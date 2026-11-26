-- ValuationPro Phase 8 | Advanced Analytics, Audit & Platform Summary
-- ADDITIVE BIGINT design for Phases 1–7. Does NOT modify existing 16 base tables,
-- case stages, QC workflows, RLS policies, report versions, tax or calculation rules.
-- No sample data. Run as database owner after backup, in a NEW BLANK SQL Editor tab.
BEGIN;
DO $$ BEGIN
  IF to_regclass('public.cases') IS NULL
     OR to_regclass('public.audit') IS NULL
     OR to_regclass('public.log') IS NULL
     OR to_regclass('public.vp_user_branches') IS NULL
     OR to_regclass('public.vp_qc_tasks') IS NULL
     OR to_regclass('public.vp_qc_events') IS NULL
     OR to_regclass('public.vp_report_versions') IS NULL
     OR to_regclass('public.vp_invoice_records') IS NULL
     OR to_regclass('public.vp_invoice_payments') IS NULL
     OR to_regclass('public.vp_alert_inbox') IS NULL
     OR to_regprocedure('public.vp_current_org_id()') IS NULL
     OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
     OR to_regprocedure('public.vp_first_login_required()') IS NULL
     OR to_regprocedure('public.vp_billing_can(text)') IS NULL
     OR to_regprocedure('public.vp_is_admin(bigint)') IS NULL THEN
    RAISE EXCEPTION 'Phase 8 prerequisites missing. Run 00_preflight_readonly.sql first.';
  END IF;
END $$;

-- Add only a narrow index; avoid changing business tables, CHECKs or stages.
CREATE INDEX IF NOT EXISTS vp8_cases_org_created_idx ON public.cases(org_id,created);
CREATE INDEX IF NOT EXISTS vp8_cases_org_due_idx ON public.cases(org_id,due);

-- Explicit, non-authoritative record of exports initiated by the new UI.
CREATE TABLE IF NOT EXISTS public.vp8_export_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  actor_user_id bigint NOT NULL,
  dataset text NOT NULL CHECK (dataset IN ('bank','branch','property','audit')),
  filter_branch_id bigint,
  date_from date,
  date_to date,
  row_count integer NOT NULL CHECK (row_count BETWEEN 0 AND 10000),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(org_id,actor_user_id) REFERENCES public.users(org_id,id),
  FOREIGN KEY(org_id,filter_branch_id) REFERENCES public.vp_branches(org_id,id)
);
CREATE INDEX IF NOT EXISTS vp8_export_events_recent
  ON public.vp8_export_events(org_id,created_at DESC);
ALTER TABLE public.vp8_export_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vp8_export_events FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp8_export_events TO authenticated;
GRANT ALL ON public.vp8_export_events TO service_role;

-- Current tenant's role matrix, existing active membership, and mandatory first-login gate.
CREATE OR REPLACE FUNCTION public.vp8_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT coalesce(p_action IN ('View','Audit','Export'),false)
  AND (SELECT public.vp_current_org_id()) IS NOT NULL
  AND NOT (SELECT public.vp_first_login_required())
  AND EXISTS (
    SELECT 1 FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id
    JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
    WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
      AND u.org_id=(SELECT public.vp_current_org_id())
      AND rp.perm IN ('tenant.admin','analytics.'||p_action)
  );
$$;

CREATE OR REPLACE FUNCTION public.vp8_is_tenant_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT (SELECT public.vp_current_org_id()) IS NOT NULL
  AND NOT (SELECT public.vp_first_login_required())
  AND public.vp_is_admin((SELECT public.vp_current_org_id()));
$$;

-- Platform-wide visibility is NEVER inferred from tenant.admin. Requires both
-- orgs.type='platform' AND explicit platform.Overview permission. Read-only aggregates.
CREATE OR REPLACE FUNCTION public.vp8_platform_can()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT NOT (SELECT public.vp_first_login_required()) AND EXISTS (
  SELECT 1 FROM public.valuation_auth_links l
  JOIN public.users u ON u.id=l.user_id
  JOIN public.orgs o ON o.id=u.org_id
  JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
  WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
    AND o.status='active' AND o.type='platform'
    AND rp.perm='platform.Overview'
 );
$$;

-- Non-admin analytics users may see only their explicitly allocated branches.
-- Rows with a missing/unmatched branch are admin-only. Client-supplied branch is
-- checked; using 'All branches' does not bypass row-level branch filtering.
CREATE OR REPLACE FUNCTION public.vp8_branch_visible(p_branch_text text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.vp8_is_tenant_admin() OR EXISTS(
  SELECT 1 FROM public.vp_user_branches ub
  WHERE ub.org_id=(SELECT public.vp_current_org_id())
    AND ub.user_id=(SELECT public.vp_field_my_user_id())
    AND ub.branch_id::text=p_branch_text
 );
$$;

CREATE OR REPLACE FUNCTION public.vp8_check_filters(
  p_branch_id bigint,p_from date,p_to date)
RETURNS void LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
 IF v_org IS NULL OR NOT public.vp8_can('View') THEN
   RAISE EXCEPTION 'Analytics View permission required'; END IF;
 IF p_from IS NOT NULL AND p_to IS NOT NULL AND p_from>p_to THEN
   RAISE EXCEPTION 'Date from must be <= date to'; END IF;
 IF p_branch_id IS NOT NULL AND NOT EXISTS(
   SELECT 1 FROM public.vp_branches b
   WHERE b.org_id=v_org AND b.id=p_branch_id) THEN
   RAISE EXCEPTION 'Branch not found in current organization'; END IF;
 IF p_branch_id IS NOT NULL AND NOT public.vp8_branch_visible(p_branch_id::text) THEN
   RAISE EXCEPTION 'Branch is outside your permitted allocations'; END IF;
END; $$;

DROP POLICY IF EXISTS vp8_export_events_read ON public.vp8_export_events;
CREATE POLICY vp8_export_events_read ON public.vp8_export_events
 FOR SELECT TO authenticated USING (
   org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp8_can('Audit'))
 );

-- Date-scoped operational summary; all quantities are based on REAL records.
-- Finance metrics require BOTH analytics.View AND billing.View; unavailable
-- revenue fields return NULL, never misleading zero. Historic unlinked invoices
-- are excluded by design, and their count is disclosed.
CREATE OR REPLACE FUNCTION public.vp8_summary(
 p_branch_id bigint DEFAULT NULL,p_from date DEFAULT NULL,p_to date DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_result jsonb;
 v_cases bigint;v_open bigint;v_overdue bigint;v_pending bigint;v_released bigint;
 v_visits bigint;v_invoices bigint;v_billed numeric;v_collected numeric;
 v_outstanding numeric;v_receipts numeric;v_legacy bigint;v_finance boolean;
BEGIN
 PERFORM public.vp8_check_filters(p_branch_id,p_from,p_to);
 SELECT count(*),
   count(*) FILTER(WHERE c.stage NOT IN ('Approved','Submitted','Invoiced')),
   count(*) FILTER(WHERE c.due<CURRENT_DATE AND c.stage NOT IN ('Approved','Submitted','Invoiced'))
 INTO v_cases,v_open,v_overdue
 FROM public.cases c
 WHERE c.org_id=v_org
  AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
  AND public.vp8_branch_visible(c.meta->>'branch_id')
  AND (p_from IS NULL OR c.created>=p_from) AND (p_to IS NULL OR c.created<=p_to);

 SELECT count(*) INTO v_pending FROM public.vp_qc_tasks q
 JOIN public.cases c ON c.org_id=q.org_id AND c.num=q.num
 WHERE q.org_id=v_org AND q.status='Pending'
  AND public.vp8_branch_visible(c.meta->>'branch_id')
  AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
  AND (p_from IS NULL OR c.created>=p_from) AND (p_to IS NULL OR c.created<=p_to);

 SELECT count(*) INTO v_released FROM public.vp_report_versions r
 JOIN public.cases c ON c.org_id=r.org_id AND c.num=r.num
 WHERE r.org_id=v_org AND r.status='Released'
  AND public.vp8_branch_visible(c.meta->>'branch_id')
  AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
  AND (p_from IS NULL OR (r.released_at AT TIME ZONE 'Asia/Kolkata')::date>=p_from)
  AND (p_to IS NULL OR (r.released_at AT TIME ZONE 'Asia/Kolkata')::date<=p_to);

 SELECT count(*) INTO v_visits FROM public.vp_site_visits v
 JOIN public.cases c ON c.org_id=v.org_id AND c.num=v.num
 WHERE v.org_id=v_org AND v.status='Completed'
  AND public.vp8_branch_visible(c.meta->>'branch_id')
  AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
  AND (p_from IS NULL OR (v.checkout_at AT TIME ZONE 'Asia/Kolkata')::date>=p_from)
  AND (p_to IS NULL OR (v.checkout_at AT TIME ZONE 'Asia/Kolkata')::date<=p_to);

 v_finance:=public.vp_billing_can('View');
 IF v_finance THEN
  SELECT count(*),coalesce(sum(i.tot),0),coalesce(sum(i.rec),0),
    coalesce(sum(greatest(0,i.tot-i.rec)),0)
  INTO v_invoices,v_billed,v_collected,v_outstanding
  FROM public.vp_invoice_records r
  JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
  WHERE r.org_id=v_org AND public.vp8_branch_visible(r.branch_id::text)
   AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
   AND (p_from IS NULL OR i.created>=p_from) AND (p_to IS NULL OR i.created<=p_to);

  SELECT coalesce(sum(p.amount),0) INTO v_receipts
  FROM public.vp_invoice_payments p
  JOIN public.vp_invoice_records r ON r.org_id=p.org_id AND r.invoice_id=p.invoice_id
  WHERE p.org_id=v_org AND public.vp8_branch_visible(r.branch_id::text)
   AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
   AND (p_from IS NULL OR p.payment_date>=p_from)
   AND (p_to IS NULL OR p.payment_date<=p_to);

  IF public.vp8_is_tenant_admin() THEN
   SELECT count(*) INTO v_legacy FROM public.invoices i
   WHERE i.org_id=v_org AND NOT EXISTS (
     SELECT 1 FROM public.vp_invoice_records r
     WHERE r.org_id=i.org_id AND r.invoice_id=i.id);
  END IF;
 END IF;
 v_result:=jsonb_build_object('cases_created',v_cases,'open_from_created_cohort',v_open,
  'overdue_from_created_cohort',v_overdue,'pending_qc_for_created_cases',v_pending,
  'released_reports_during_period',v_released,'completed_visits_during_period',v_visits,
  'finance_access',v_finance,'invoices_issued_during_period',v_invoices,
  'invoice_billed_during_period',v_billed,'invoice_collected_to_date_for_period_invoices',v_collected,
  'invoice_outstanding_for_period_invoices',v_outstanding,
  'receipts_recorded_during_period',v_receipts,'unlinked_legacy_invoices',v_legacy);
 RETURN v_result;
END; $$;

-- Created-case cohort grouped by bank, branch or property category. Each case
-- counted exactly once; the finance amount is the case's linked invoice total.
CREATE OR REPLACE FUNCTION public.vp8_breakdown(
 p_dimension text DEFAULT 'bank',p_branch_id bigint DEFAULT NULL,
 p_from date DEFAULT NULL,p_to date DEFAULT NULL)
RETURNS TABLE(label text,cases_count bigint,overdue_cases bigint,pending_qc bigint,
  released_cases bigint,invoiced_total numeric)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_finance boolean;
BEGIN
 PERFORM public.vp8_check_filters(p_branch_id,p_from,p_to);
 IF p_dimension NOT IN ('bank','branch','property') THEN
   RAISE EXCEPTION 'Invalid breakdown dimension'; END IF;
 v_finance:=public.vp_billing_can('View');
 RETURN QUERY WITH cohort AS (
  SELECT c.org_id,c.num,c.stage,c.due,
    CASE p_dimension WHEN 'bank' THEN c.bank
      WHEN 'branch' THEN coalesce(b.name,c.br)
      ELSE c.prod END::text AS group_name,
    EXISTS(SELECT 1 FROM public.vp_qc_tasks q
      WHERE q.org_id=c.org_id AND q.num=c.num AND q.status='Pending') AS qc_pending,
    EXISTS(SELECT 1 FROM public.vp_report_versions v
      WHERE v.org_id=c.org_id AND v.num=c.num AND v.status='Released') AS released,
    CASE WHEN v_finance THEN (
      SELECT i.tot FROM public.vp_invoice_records r
      JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
      WHERE r.org_id=c.org_id AND r.case_num=c.num)
    ELSE NULL::numeric END AS case_billed
  FROM public.cases c
  LEFT JOIN public.vp_branches b
    ON b.org_id=c.org_id AND b.id::text=c.meta->>'branch_id'
  WHERE c.org_id=v_org AND public.vp8_branch_visible(c.meta->>'branch_id')
    AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
    AND (p_from IS NULL OR c.created>=p_from) AND (p_to IS NULL OR c.created<=p_to)
 )
 SELECT coalesce(group_name,'Unspecified') AS label,count(*) AS cases_count,
  count(*) FILTER (WHERE due<CURRENT_DATE AND stage NOT IN ('Approved','Submitted','Invoiced')),
  count(*) FILTER (WHERE qc_pending),count(*) FILTER (WHERE released),
  CASE WHEN v_finance THEN coalesce(sum(case_billed),0)
       ELSE NULL::numeric END
 FROM cohort GROUP BY group_name ORDER BY count(*) DESC,group_name LIMIT 200;
END; $$;

-- Auditable event stream based on the EXISTING authoritative sources.
-- Legacy log.at is DATE, so event precision is deliberately represented as a DATE.
CREATE OR REPLACE FUNCTION public.vp8_audit_feed(
 p_limit integer DEFAULT 100,p_offset integer DEFAULT 0)
RETURNS TABLE(event_time timestamptz,date_only boolean,category text,
  actor text,description text,case_num integer,source_key text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
 IF NOT public.vp8_can('Audit') THEN RAISE EXCEPTION 'Analytics Audit permission required'; END IF;
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 500 OR p_offset IS NULL OR p_offset<0 THEN
   RAISE EXCEPTION 'Invalid audit pagination'; END IF;
 RETURN QUERY
 SELECT f.event_time,f.date_only,f.category,f.actor,f.description,f.case_num,f.source_key
 FROM (
  SELECT a.at AS event_time,false AS date_only,'Administration'::text AS category,
   a."by"::text AS actor,a.msg::text AS description,NULL::integer AS case_num,
   ('audit:'||a.id::text) AS source_key
  FROM public.audit a WHERE a.org_id=v_org
  UNION ALL
  SELECT (l.at::timestamp AT TIME ZONE 'Asia/Kolkata'),true,'Case',l."by",l.msg,l.num,
    ('log:'||l.id::text)
  FROM public.log l JOIN public.cases c ON c.org_id=l.org_id AND c.num=l.num
  WHERE l.org_id=v_org AND public.vp8_branch_visible(c.meta->>'branch_id')
  UNION ALL
  SELECT e.occurred_at,false,'QC',coalesce(u.name,'System'),
    ('QC '||e.event_type||coalesce(' — '||nullif(e.remarks,''),'')),q.num,
    ('qc:'||e.id::text)
  FROM public.vp_qc_events e JOIN public.vp_qc_tasks q
    ON q.org_id=e.org_id AND q.id=e.task_id
  JOIN public.cases c ON c.org_id=q.org_id AND c.num=q.num
  LEFT JOIN public.users u ON u.org_id=e.org_id AND u.id=e.actor_user_id
  WHERE e.org_id=v_org AND public.vp8_branch_visible(c.meta->>'branch_id')
  UNION ALL
  SELECT r.released_at,false,'Report',coalesce(u.name,'System'),
    ('Report version '||r.version_no::text||' released'),r.num,('report:'||r.id::text)
  FROM public.vp_report_versions r
  JOIN public.cases c ON c.org_id=r.org_id AND c.num=r.num
  LEFT JOIN public.users u ON u.org_id=r.org_id AND u.id=r.released_by
  WHERE r.org_id=v_org AND r.status='Released'
    AND public.vp8_branch_visible(c.meta->>'branch_id')
  UNION ALL
  SELECT p.recorded_at,false,'Billing',coalesce(u.name,'System'),
    ('Payment reference: '||p.reference),r.case_num,('payment:'||p.id::text)
  FROM public.vp_invoice_payments p
  JOIN public.vp_invoice_records r ON r.org_id=p.org_id AND r.invoice_id=p.invoice_id
  LEFT JOIN public.users u ON u.org_id=p.org_id AND u.id=p.recorded_by
  WHERE p.org_id=v_org AND public.vp_billing_can('View')
    AND public.vp8_branch_visible(r.branch_id::text)
  UNION ALL
  SELECT x.created_at,false,'Export',coalesce(u.name,'System'),
    ('Export '||x.dataset||' ('||x.row_count::text||' rows)'),NULL::integer,('export:'||x.id::text)
  FROM public.vp8_export_events x
  LEFT JOIN public.users u ON u.org_id=x.org_id AND u.id=x.actor_user_id
  WHERE x.org_id=v_org
 ) f ORDER BY f.event_time DESC NULLS LAST,f.source_key DESC
 LIMIT p_limit OFFSET p_offset;
END; $$;

-- Identifies live financial reconciliation exceptions. Never silently fixes data.
CREATE OR REPLACE FUNCTION public.vp8_reconciliation(p_limit integer DEFAULT 100)
RETURNS TABLE(issue text,reference text,expected numeric,observed numeric,details text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
 IF NOT public.vp8_can('Audit') OR NOT public.vp_billing_can('View') THEN
   RAISE EXCEPTION 'Audit and Billing View permissions required'; END IF;
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 500 THEN RAISE EXCEPTION 'Invalid limit'; END IF;
 RETURN QUERY
 WITH problems AS (
  SELECT 'Receipt mismatch'::text issue,i.no::text reference,
    i.rec::numeric expected,coalesce(sum(p.amount),0)::numeric observed,
    'Invoice collected total differs from the linked Phase 6 payment ledger'::text details
  FROM public.vp_invoice_records r
  JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
  LEFT JOIN public.vp_invoice_payments p ON p.org_id=r.org_id AND p.invoice_id=r.invoice_id
  WHERE r.org_id=v_org AND public.vp8_branch_visible(r.branch_id::text)
  GROUP BY i.id,i.no,i.rec,i.org_id
  HAVING i.rec IS DISTINCT FROM coalesce(sum(p.amount),0)
  UNION ALL
  SELECT 'Unlinked legacy invoice',i.no,0::numeric,i.tot,
    'Original invoice has no Phase 6 case link; excluded from linked MIS'
  FROM public.invoices i WHERE i.org_id=v_org
    AND public.vp8_is_tenant_admin()
    AND NOT EXISTS(SELECT 1 FROM public.vp_invoice_records r
      WHERE r.org_id=i.org_id AND r.invoice_id=i.id)
  UNION ALL
  SELECT 'Released but unbilled',coalesce(c.meta->>'case_no',c.num::text),0::numeric,0::numeric,
    'Report released but case has no Phase 6 invoice; may be intentionally pending'
  FROM public.vp_report_versions rv JOIN public.cases c
    ON c.org_id=rv.org_id AND c.num=rv.num
  WHERE rv.org_id=v_org AND rv.status='Released'
    AND public.vp8_branch_visible(c.meta->>'branch_id')
    AND NOT EXISTS(SELECT 1 FROM public.vp_invoice_records r
      WHERE r.org_id=rv.org_id AND r.case_num=rv.num)
 ) SELECT p.issue,p.reference,p.expected,p.observed,p.details
 FROM problems p ORDER BY p.issue,p.reference LIMIT p_limit;
END; $$;

-- Audit of the NEW interface's export action. No arbitrary tenant/user is accepted.
CREATE OR REPLACE FUNCTION public.vp8_record_export(
 p_dataset text,p_row_count integer,p_branch_id bigint DEFAULT NULL,
 p_from date DEFAULT NULL,p_to date DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_id bigint;v_org bigint:=public.vp_current_org_id();
BEGIN
 IF NOT public.vp8_can('Export') THEN RAISE EXCEPTION 'Analytics Export permission required'; END IF;
 PERFORM public.vp8_check_filters(p_branch_id,p_from,p_to);
 IF p_dataset NOT IN ('bank','branch','property','audit') OR
    p_row_count IS NULL OR p_row_count NOT BETWEEN 0 AND 10000 THEN
   RAISE EXCEPTION 'Invalid export request'; END IF;
 IF p_dataset='audit' AND NOT public.vp8_can('Audit') THEN
   RAISE EXCEPTION 'Audit export requires Audit permission'; END IF;
 IF p_dataset<>'audit' AND NOT public.vp_billing_can('View') THEN
   -- Breakdown includes financial columns: require explicit Billing View.
   RAISE EXCEPTION 'Breakdown export requires Billing View permission'; END IF;
 INSERT INTO public.vp8_export_events(org_id,actor_user_id,dataset,filter_branch_id,
   date_from,date_to,row_count)
 VALUES(v_org,public.vp_field_my_user_id(),p_dataset,p_branch_id,p_from,p_to,p_row_count)
 RETURNING id INTO v_id;
 RETURN v_id::text;
END; $$;

-- Strictly aggregated tenant usage. No tenant names, user identities or case detail.
CREATE OR REPLACE FUNCTION public.vp8_platform_overview()
RETURNS TABLE(org_type text,org_status text,organizations bigint,
  users_total bigint,cases_total bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp8_platform_can() THEN
   RAISE EXCEPTION 'Explicit platform Overview permission required'; END IF;
 RETURN QUERY SELECT o.type,o.status,count(*)::bigint,
   coalesce(sum((SELECT count(*) FROM public.users u WHERE u.org_id=o.id)),0)::bigint,
   coalesce(sum((SELECT count(*) FROM public.cases c WHERE c.org_id=o.id)),0)::bigint
 FROM public.orgs o GROUP BY o.type,o.status ORDER BY o.type,o.status;
END; $$;


-- Dedicated allow-listed updater for the NEW analytics module only. Do not
-- replace the existing Phase 5 Role Matrix RPC or its signed-report rules.
CREATE OR REPLACE FUNCTION public.vp8_admin_set_analytics_permissions(
 p_role text,p_actions text[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
 v_actions text[]:=coalesce(p_actions,ARRAY[]::text[]);v_caller_role text;
BEGIN
 IF v_org IS NULL OR NOT public.vp8_is_tenant_admin() THEN
   RAISE EXCEPTION 'Tenant administrator required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.roles WHERE org_id=v_org AND name=p_role) THEN
   RAISE EXCEPTION 'Role does not belong to current tenant'; END IF;
 SELECT u.role INTO v_caller_role FROM public.valuation_auth_links l
 JOIN public.users u ON u.id=l.user_id WHERE l.auth_uid=auth.uid();
 IF p_role='Tenant Owner' AND v_caller_role<>'Tenant Owner' THEN
   RAISE EXCEPTION 'Only Tenant Owner can change owner permissions'; END IF;
 IF EXISTS(SELECT 1 FROM unnest(v_actions) AS a(action)
   WHERE a.action IS NULL OR a.action NOT IN ('View','Audit','Export')) THEN
   RAISE EXCEPTION 'Unknown analytics permission'; END IF;
 DELETE FROM public.role_perms WHERE org_id=v_org AND role=p_role AND perm LIKE 'analytics.%';
 INSERT INTO public.role_perms(org_id,role,perm)
 SELECT v_org,p_role,'analytics.'||a.action FROM (SELECT DISTINCT unnest(v_actions) AS action) a
 ON CONFLICT DO NOTHING;
END; $$;

-- Restrict all new functions from anon/PUBLIC. Only platform explicitly entitled
-- identities can cross tenants, and only via the aggregate-only platform RPC.
DO $$ DECLARE p record;BEGIN
 FOR p IN SELECT x.oid::regprocedure AS sig FROM pg_proc x
 JOIN pg_namespace n ON n.oid=x.pronamespace
 WHERE n.nspname='public' AND x.proname=ANY(ARRAY[
  'vp8_can','vp8_is_tenant_admin','vp8_platform_can','vp8_branch_visible',
  'vp8_check_filters','vp8_summary','vp8_breakdown','vp8_audit_feed',
  'vp8_reconciliation','vp8_record_export','vp8_platform_overview',
  'vp8_admin_set_analytics_permissions']) LOOP
  EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon',p.sig);
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',p.sig);
 END LOOP;
END $$;
COMMIT;
