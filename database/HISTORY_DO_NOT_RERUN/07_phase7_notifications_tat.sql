-- ValuationPro Phase 7 | Notification Inbox, TAT and Escalation | BIGINT schema
-- Safe ADDITIVE design. Requires Phase 1-6 objects. NO DEMO DATA. NO providers called.
-- Backup first. Execute as database owner in a NEW SQL editor tab, not via browser.
BEGIN;
DO $$ BEGIN
  IF to_regclass('public.orgs') IS NULL
    OR to_regclass('public.users') IS NULL
    OR to_regclass('public.cases') IS NULL
    OR to_regclass('public.role_perms') IS NULL
    OR to_regclass('public.vp_qc_tasks') IS NULL
    OR to_regclass('public.vp_report_versions') IS NULL
    OR to_regclass('public.vp_invoice_records') IS NULL
    OR to_regclass('public.vp_invoice_payments') IS NULL
    OR to_regclass('public.vp_invoices_org_id_id_unique') IS NULL
    OR to_regclass('public.valuation_auth_links') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
    OR to_regprocedure('public.vp_first_login_required()') IS NULL THEN
    RAISE EXCEPTION 'Phase 7 requires Phase 1-6 migrations. Run 00_preflight_readonly.sql first.';
  END IF;
END $$;

-- Tenant configuration. External channels remain disabled until a real provider is connected.
CREATE TABLE IF NOT EXISTS public.vp_alert_settings (
  org_id bigint PRIMARY KEY REFERENCES public.orgs(id),
  case_warning_days integer NOT NULL DEFAULT 2 CHECK (case_warning_days BETWEEN 0 AND 30),
  invoice_warning_days integer NOT NULL DEFAULT 3 CHECK (invoice_warning_days BETWEEN 0 AND 30),
  email_enabled boolean NOT NULL DEFAULT false,
  whatsapp_enabled boolean NOT NULL DEFAULT false,
  updated_by bigint,
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(org_id,updated_by) REFERENCES public.users(org_id,id)
);

-- One row per target recipient, uniquely identified by the business event.
CREATE TABLE IF NOT EXISTS public.vp_alert_inbox (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  recipient_user_id bigint NOT NULL,
  event_key text NOT NULL CHECK (length(event_key) BETWEEN 1 AND 240),
  kind text NOT NULL CHECK (kind IN ('case','qc','report','billing','tat')),
  title text NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  body text NOT NULL DEFAULT '',
  case_num integer,
  invoice_id bigint,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  UNIQUE(org_id,id),
  UNIQUE(org_id,recipient_user_id,event_key),
  FOREIGN KEY(org_id,recipient_user_id) REFERENCES public.users(org_id,id),
  FOREIGN KEY(org_id,case_num) REFERENCES public.cases(org_id,num),
  FOREIGN KEY(org_id,invoice_id) REFERENCES public.invoices(org_id,id)
);
CREATE INDEX IF NOT EXISTS vp_alert_inbox_recipient_idx
  ON public.vp_alert_inbox(org_id,recipient_user_id,read_at,created_at DESC);

-- An INTERNAL queue only. No service transmits messages in this phase.
-- Future workers must obtain a verified recipient address, opt-in and provider config.
CREATE TABLE IF NOT EXISTS public.vp_alert_delivery_outbox (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  inbox_id bigint NOT NULL,
  channel text NOT NULL CHECK (channel IN ('email','whatsapp')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sending','sent','failed','cancelled')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 50),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id,inbox_id,channel),
  FOREIGN KEY(org_id,inbox_id) REFERENCES public.vp_alert_inbox(org_id,id)
);
CREATE INDEX IF NOT EXISTS vp_alert_outbox_work_idx
  ON public.vp_alert_delivery_outbox(status,next_attempt_at);

DO $$ DECLARE tbl text; BEGIN
 FOR tbl IN SELECT unnest(ARRAY['vp_alert_settings','vp_alert_inbox','vp_alert_delivery_outbox']) LOOP
   EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',tbl);
   EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC,anon,authenticated',tbl);
   EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role',tbl);
 END LOOP;
END $$;
GRANT SELECT ON public.vp_alert_settings,public.vp_alert_inbox TO authenticated;
-- No browser access of any kind to the delivery outbox.

-- Safe active membership check; never trusts a client supplied org_id.
CREATE OR REPLACE FUNCTION public.vp_alert_member()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT (SELECT public.vp_current_org_id()) IS NOT NULL
  AND (SELECT public.vp_field_my_user_id()) IS NOT NULL
  AND NOT (SELECT public.vp_first_login_required())
  AND EXISTS (
    SELECT 1 FROM public.users u JOIN public.orgs o ON o.id=u.org_id
    WHERE u.org_id=(SELECT public.vp_current_org_id())
      AND u.id=(SELECT public.vp_field_my_user_id())
      AND u.active IS TRUE AND o.status='active');
$$;

CREATE OR REPLACE FUNCTION public.vp_alert_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT (SELECT public.vp_alert_member()) AND EXISTS (
   SELECT 1 FROM public.users u
   JOIN public.role_perms r ON r.org_id=u.org_id AND r.role=u.role
   WHERE u.org_id=(SELECT public.vp_current_org_id())
     AND u.id=(SELECT public.vp_field_my_user_id())
     AND r.perm='tenant.admin');
$$;

DROP POLICY IF EXISTS vp_phase7_inbox_read ON public.vp_alert_inbox;
CREATE POLICY vp_phase7_inbox_read ON public.vp_alert_inbox FOR SELECT TO authenticated
USING (org_id=(SELECT public.vp_current_org_id())
 AND recipient_user_id=(SELECT public.vp_field_my_user_id())
 AND (SELECT public.vp_alert_member()));
DROP POLICY IF EXISTS vp_phase7_settings_read ON public.vp_alert_settings;
CREATE POLICY vp_phase7_settings_read ON public.vp_alert_settings FOR SELECT TO authenticated
USING (org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_alert_admin()));
-- No direct browser insert/update/delete grants or policies.

-- Trigger-only helper. A user cannot call this through the client API.
CREATE OR REPLACE FUNCTION public.vp_alert_enqueue(
  p_org bigint,p_recipient bigint,p_key text,p_kind text,p_title text,
  p_body text DEFAULT '',p_case integer DEFAULT NULL,p_invoice bigint DEFAULT NULL,
  p_severity text DEFAULT 'info')
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_id bigint; v_email boolean; v_whatsapp boolean;
BEGIN
 IF p_org IS NULL OR p_recipient IS NULL OR p_key IS NULL OR p_kind IS NULL OR p_title IS NULL THEN RETURN; END IF;
 IF p_kind NOT IN ('case','qc','report','billing','tat') OR p_severity NOT IN ('info','warning','critical') THEN RETURN; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.users u JOIN public.orgs o ON o.id=u.org_id
   WHERE u.id=p_recipient AND u.org_id=p_org AND u.active IS TRUE AND o.status='active') THEN RETURN; END IF;
 INSERT INTO public.vp_alert_inbox(org_id,recipient_user_id,event_key,kind,title,body,case_num,invoice_id,severity)
 VALUES(p_org,p_recipient,left(p_key,240),p_kind,left(p_title,150),left(coalesce(p_body,''),1000),p_case,p_invoice,p_severity)
 ON CONFLICT (org_id,recipient_user_id,event_key) DO NOTHING RETURNING id INTO v_id;
 IF v_id IS NULL THEN RETURN; END IF;
 SELECT email_enabled,whatsapp_enabled INTO v_email,v_whatsapp
 FROM public.vp_alert_settings WHERE org_id=p_org;
 IF coalesce(v_email,false) THEN
  INSERT INTO public.vp_alert_delivery_outbox(org_id,inbox_id,channel) VALUES(p_org,v_id,'email') ON CONFLICT DO NOTHING;
 END IF;
 IF coalesce(v_whatsapp,false) THEN
  INSERT INTO public.vp_alert_delivery_outbox(org_id,inbox_id,channel) VALUES(p_org,v_id,'whatsapp') ON CONFLICT DO NOTHING;
 END IF;
END; $$;

-- Case assignment is recorded only when the assigned user changes.
CREATE OR REPLACE FUNCTION public.vp_alert_case_trigger()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_old text; v_new text; v_user bigint;
BEGIN
 v_new:=NEW.meta->>'assigned_user_id';
 IF TG_OP='UPDATE' THEN v_old:=OLD.meta->>'assigned_user_id'; END IF;
 IF v_new IS NOT NULL AND v_new ~ '^[0-9]{1,19}$'
    AND (TG_OP='INSERT' OR v_new IS DISTINCT FROM v_old) THEN
   SELECT u.id INTO v_user FROM public.users u
     WHERE u.org_id=NEW.org_id AND u.id::text=v_new AND u.active IS TRUE;
   IF v_user IS NOT NULL THEN
     PERFORM public.vp_alert_enqueue(NEW.org_id,v_user,
       'case-assigned:'||NEW.num::text||':'||txid_current()::text,
       'case','Case #'||NEW.num::text||' assigned',
       'A valuation case has been assigned to you.',NEW.num,NULL,'info');
   END IF;
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_phase7_case_assigned ON public.cases;
CREATE TRIGGER vp_phase7_case_assigned AFTER INSERT OR UPDATE OF meta ON public.cases
 FOR EACH ROW EXECUTE FUNCTION public.vp_alert_case_trigger();

-- QC checker assignment and completed decisions; alerts do not change QC workflow.
CREATE OR REPLACE FUNCTION public.vp_alert_qc_trigger()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_actor bigint; v_assignee_changed boolean:=true;
BEGIN
 IF TG_OP='UPDATE' THEN
   v_assignee_changed:=NEW.assigned_checker_id IS DISTINCT FROM OLD.assigned_checker_id;
 END IF;
 IF NEW.assigned_checker_id IS NOT NULL AND NEW.status='Pending'
    AND v_assignee_changed THEN
   PERFORM public.vp_alert_enqueue(NEW.org_id,NEW.assigned_checker_id,
     'qc-assigned:'||NEW.id::text||':'||NEW.assigned_checker_id::text,
     'qc',NEW.review_stage||' assigned','You have a new QC review.',NEW.num,NULL,'warning');
 END IF;
 IF TG_OP='UPDATE' THEN
  IF NEW.status IN ('Approved','Returned') AND NEW.status IS DISTINCT FROM OLD.status THEN
   SELECT u.id INTO v_actor FROM public.cases c JOIN public.users u
     ON u.org_id=c.org_id AND u.id::text=(c.meta->>'assigned_user_id')
     WHERE c.org_id=NEW.org_id AND c.num=NEW.num AND u.active IS TRUE;
   v_actor:=coalesce(v_actor,NEW.submitted_by);
   PERFORM public.vp_alert_enqueue(NEW.org_id,v_actor,
     'qc-decision:'||NEW.id::text||':'||NEW.status,
     'qc',NEW.review_stage||' '||lower(NEW.status),
     CASE WHEN NEW.status='Returned' THEN 'Rework is required.' ELSE 'The QC decision is complete.' END,
     NEW.num,NULL,CASE WHEN NEW.status='Returned' THEN 'warning' ELSE 'info' END);
  END IF;
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_phase7_qc_change ON public.vp_qc_tasks;
CREATE TRIGGER vp_phase7_qc_change AFTER INSERT OR UPDATE OF assigned_checker_id,status
 ON public.vp_qc_tasks FOR EACH ROW EXECUTE FUNCTION public.vp_alert_qc_trigger();

-- Report release: notify the assigned case handler.
CREATE OR REPLACE FUNCTION public.vp_alert_report_trigger()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_user bigint; v_released_now boolean:=true;
BEGIN
 IF TG_OP='UPDATE' THEN
   v_released_now:=NEW.status IS DISTINCT FROM OLD.status;
 END IF;
 IF NEW.status='Released' AND v_released_now THEN
   SELECT u.id INTO v_user FROM public.cases c JOIN public.users u
     ON u.org_id=c.org_id AND u.id::text=(c.meta->>'assigned_user_id')
     WHERE c.org_id=NEW.org_id AND c.num=NEW.num AND u.active IS TRUE;
   PERFORM public.vp_alert_enqueue(NEW.org_id,v_user,
     'report-released:'||NEW.id::text,'report','Report released',
     'The valuation report is ready for the next workflow step.',NEW.num,NULL,'info');
 END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_phase7_report_released ON public.vp_report_versions;
CREATE TRIGGER vp_phase7_report_released AFTER INSERT OR UPDATE OF status
 ON public.vp_report_versions FOR EACH ROW EXECUTE FUNCTION public.vp_alert_report_trigger();

-- Notify tenant billing staff when invoices and receipts are actually recorded.
CREATE OR REPLACE FUNCTION public.vp_alert_billing_trigger()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_u record; v_no text; v_case integer; v_title text; v_event text;
BEGIN
 IF TG_TABLE_NAME='vp_invoice_records' THEN
   SELECT i.no INTO v_no FROM public.invoices i WHERE i.org_id=NEW.org_id AND i.id=NEW.invoice_id;
   v_case:=NEW.case_num;
   v_title:='Invoice created';
   v_event:='invoice-created:'||NEW.invoice_id::text;
 ELSE
   SELECT i.no,r.case_num INTO v_no,v_case FROM public.invoices i
   JOIN public.vp_invoice_records r ON r.org_id=i.org_id AND r.invoice_id=i.id
   WHERE i.org_id=NEW.org_id AND i.id=NEW.invoice_id;
   v_title:='Payment recorded';
   v_event:='payment-recorded:'||NEW.id::text;
 END IF;
 FOR v_u IN
   SELECT DISTINCT u.id FROM public.users u JOIN public.orgs o ON o.id=u.org_id
   JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
   WHERE u.org_id=NEW.org_id AND u.active IS TRUE AND o.status='active'
    AND rp.perm IN ('tenant.admin','billing.View','billing.Approve')
 LOOP
   PERFORM public.vp_alert_enqueue(NEW.org_id,v_u.id,v_event,
       'billing',v_title,'Invoice '||coalesce(v_no,NEW.invoice_id::text)||' requires attention.',
       v_case,NEW.invoice_id,'info');
 END LOOP;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_phase7_invoice_created ON public.vp_invoice_records;
CREATE TRIGGER vp_phase7_invoice_created AFTER INSERT ON public.vp_invoice_records
 FOR EACH ROW EXECUTE FUNCTION public.vp_alert_billing_trigger();
DROP TRIGGER IF EXISTS vp_phase7_payment_created ON public.vp_invoice_payments;
CREATE TRIGGER vp_phase7_payment_created AFTER INSERT ON public.vp_invoice_payments
 FOR EACH ROW EXECUTE FUNCTION public.vp_alert_billing_trigger();

-- User's inbox. No untrusted tenant or recipient arguments.
CREATE OR REPLACE FUNCTION public.vp_alert_list(p_limit integer DEFAULT 50,p_offset integer DEFAULT 0)
RETURNS TABLE(id text,kind text,title text,body text,case_num integer,invoice_id text,
 severity text,created_at timestamptz,read_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_alert_member() THEN RAISE EXCEPTION 'Active login required'; END IF;
 IF p_limit IS NULL OR p_limit<1 OR p_limit>100 OR p_offset IS NULL OR p_offset<0 OR p_offset>100000 THEN
   RAISE EXCEPTION 'Invalid inbox pagination'; END IF;
 RETURN QUERY SELECT a.id::text,a.kind,a.title,a.body,a.case_num,a.invoice_id::text,
 a.severity,a.created_at,a.read_at FROM public.vp_alert_inbox a
 WHERE a.org_id=public.vp_current_org_id()
   AND a.recipient_user_id=public.vp_field_my_user_id()
 ORDER BY a.created_at DESC,a.id DESC LIMIT p_limit OFFSET p_offset;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_alert_mark_read(p_ids bigint[])
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_count integer;
BEGIN
 IF NOT public.vp_alert_member() THEN RAISE EXCEPTION 'Active login required'; END IF;
 IF p_ids IS NULL OR coalesce(array_length(p_ids,1),0)>100 THEN
   RAISE EXCEPTION 'Supply at most 100 notification ids'; END IF;
 UPDATE public.vp_alert_inbox a SET read_at=now()
 WHERE a.org_id=public.vp_current_org_id() AND a.recipient_user_id=public.vp_field_my_user_id()
   AND a.id=ANY(p_ids) AND a.read_at IS NULL;
 GET DIAGNOSTICS v_count=ROW_COUNT;
 RETURN v_count;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_alert_settings_read()
RETURNS TABLE(case_warning_days integer,invoice_warning_days integer,email_enabled boolean,whatsapp_enabled boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_alert_admin() THEN RAISE EXCEPTION 'Tenant administrator required'; END IF;
 RETURN QUERY SELECT coalesce(s.case_warning_days,2),coalesce(s.invoice_warning_days,3),
 coalesce(s.email_enabled,false),coalesce(s.whatsapp_enabled,false)
 FROM (SELECT 1) seed LEFT JOIN public.vp_alert_settings s
 ON s.org_id=public.vp_current_org_id();
END; $$;

CREATE OR REPLACE FUNCTION public.vp_alert_settings_save(p_case_warning_days integer,p_invoice_warning_days integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_alert_admin() THEN RAISE EXCEPTION 'Tenant administrator required'; END IF;
 IF p_case_warning_days IS NULL OR p_case_warning_days NOT BETWEEN 0 AND 30
  OR p_invoice_warning_days IS NULL OR p_invoice_warning_days NOT BETWEEN 0 AND 30 THEN
  RAISE EXCEPTION 'Warning windows must be 0 to 30 days'; END IF;
 INSERT INTO public.vp_alert_settings(org_id,case_warning_days,invoice_warning_days,updated_by)
 VALUES(public.vp_current_org_id(),p_case_warning_days,p_invoice_warning_days,public.vp_field_my_user_id())
 ON CONFLICT(org_id) DO UPDATE SET
 case_warning_days=EXCLUDED.case_warning_days,
 invoice_warning_days=EXCLUDED.invoice_warning_days,
 updated_by=EXCLUDED.updated_by,updated_at=now();
 -- email_enabled and whatsapp_enabled deliberately remain untouched.
END; $$;

-- Periodic scan. Service role / trusted cron only; NEVER callable by authenticated clients.
-- Idempotent per calendar day (scanning twice does not duplicate alerts).
CREATE OR REPLACE FUNCTION public.vp_alert_scan_due(p_limit integer DEFAULT 500)
RETURNS TABLE(cases_checked integer,invoices_checked integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE c record; i record; u record; v_recipient bigint; v_case_count integer:=0; v_invoice_count integer:=0;
  v_days integer; v_overdue boolean;
BEGIN
 IF p_limit IS NULL OR p_limit<1 OR p_limit>2000 THEN RAISE EXCEPTION 'Limit 1 to 2000'; END IF;
 FOR c IN SELECT ca.org_id,ca.num,ca.due,ca.meta,ca.stage,
     coalesce(s.case_warning_days,2) AS warn_days
     FROM public.cases ca JOIN public.orgs o ON o.id=ca.org_id AND o.status='active'
     LEFT JOIN public.vp_alert_settings s ON s.org_id=ca.org_id
     WHERE ca.stage NOT IN ('Approved','Submitted','Invoiced')
       AND ca.due<=CURRENT_DATE+coalesce(s.case_warning_days,2)
     ORDER BY ca.due,ca.org_id,ca.num LIMIT p_limit
 LOOP
   v_case_count:=v_case_count+1;
   v_overdue:=c.due<CURRENT_DATE;
   SELECT u1.id INTO v_recipient FROM public.users u1
     WHERE u1.org_id=c.org_id AND u1.id::text=(c.meta->>'assigned_user_id') AND u1.active IS TRUE;
   IF v_recipient IS NOT NULL THEN
     PERFORM public.vp_alert_enqueue(c.org_id,v_recipient,
       'case-tat:'||c.num::text||':'||CURRENT_DATE::text,
       'tat',CASE WHEN v_overdue THEN 'Case overdue' ELSE 'Case due soon' END,
       'Case #'||c.num::text||' due '||c.due::text,c.num,NULL,
       CASE WHEN v_overdue THEN 'critical' ELSE 'warning' END);
   ELSE
     FOR u IN SELECT DISTINCT us.id FROM public.users us JOIN public.role_perms rp
       ON rp.org_id=us.org_id AND rp.role=us.role
       WHERE us.org_id=c.org_id AND us.active IS TRUE AND rp.perm='tenant.admin'
     LOOP
       PERFORM public.vp_alert_enqueue(c.org_id,u.id,
         'case-tat:'||c.num::text||':'||CURRENT_DATE::text,'tat',
         CASE WHEN v_overdue THEN 'Unassigned case overdue' ELSE 'Unassigned case due soon' END,
         'Case #'||c.num::text||' due '||c.due::text,c.num,NULL,
         CASE WHEN v_overdue THEN 'critical' ELSE 'warning' END);
     END LOOP;
   END IF;
   v_recipient:=NULL;
 END LOOP;
 FOR i IN SELECT r.org_id,r.invoice_id,r.case_num,inv.no,inv.due,inv.tot,inv.rec
   FROM public.vp_invoice_records r JOIN public.invoices inv
     ON inv.org_id=r.org_id AND inv.id=r.invoice_id
   JOIN public.orgs o ON o.id=r.org_id AND o.status='active'
   LEFT JOIN public.vp_alert_settings s ON s.org_id=r.org_id
   WHERE inv.rec<inv.tot AND inv.due<=CURRENT_DATE+coalesce(s.invoice_warning_days,3)
   ORDER BY inv.due,r.org_id,r.invoice_id LIMIT p_limit
 LOOP
   v_invoice_count:=v_invoice_count+1;
   v_overdue:=i.due<CURRENT_DATE;
   FOR u IN SELECT DISTINCT us.id FROM public.users us JOIN public.role_perms rp
     ON rp.org_id=us.org_id AND rp.role=us.role
     WHERE us.org_id=i.org_id AND us.active IS TRUE
       AND rp.perm IN ('tenant.admin','billing.View','billing.Approve')
   LOOP
     PERFORM public.vp_alert_enqueue(i.org_id,u.id,
       'invoice-due:'||i.invoice_id::text||':'||CURRENT_DATE::text,'billing',
       CASE WHEN v_overdue THEN 'Invoice overdue' ELSE 'Invoice due soon' END,
       'Invoice '||i.no||' due '||i.due::text,i.case_num,i.invoice_id,
       CASE WHEN v_overdue THEN 'critical' ELSE 'warning' END);
   END LOOP;
 END LOOP;
 RETURN QUERY SELECT v_case_count,v_invoice_count;
END; $$;

-- Function grants. Never expose trigger helpers or daily scanners to browsers.
DO $$ DECLARE sig regprocedure; BEGIN
 FOR sig IN SELECT p.oid::regprocedure FROM pg_proc p
   JOIN pg_namespace n ON n.oid=p.pronamespace
   WHERE n.nspname='public' AND p.proname IN (
     'vp_alert_member','vp_alert_admin','vp_alert_enqueue',
     'vp_alert_case_trigger','vp_alert_qc_trigger','vp_alert_report_trigger',
     'vp_alert_billing_trigger','vp_alert_list','vp_alert_mark_read',
     'vp_alert_settings_read','vp_alert_settings_save','vp_alert_scan_due')
 LOOP
   EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',sig);
   IF sig::text LIKE '%vp_alert_list(%' OR sig::text LIKE '%vp_alert_mark_read(%'
     OR sig::text LIKE '%vp_alert_settings_read(%' OR sig::text LIKE '%vp_alert_settings_save(%' THEN
     EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',sig);
   ELSIF sig::text LIKE '%vp_alert_scan_due(%' THEN
     EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role',sig);
   END IF;
 END LOOP;
END $$;
COMMIT;
