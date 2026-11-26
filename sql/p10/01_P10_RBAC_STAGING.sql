-- ValuationPro P10: server-side RBAC + complete administrator user directory.
-- STAGING ONLY, AFTER BACKUP. This is ADDITIVE RLS and narrow, reviewed helper replacements.
-- Existing users/roles/cases/documents are not deleted; do NOT rerun historical migrations.
-- Non-negotiable: role_perms determines operational data access even for tenant.admin.
-- tenant.admin remains a protected management/recovery capability, not content access.
BEGIN;
DO $p10$
DECLARE n text;
BEGIN
  FOREACH n IN ARRAY ARRAY['valuation_auth_links','users','roles','role_perms','orgs',
  'vp_site_visits','vp_visit_photos','vp_user_branches','vp_user_password_setup','cases',
  'documents','forms','banks','invoices','expenses','trips','extractions','log','audit',
  'vp_branches','vp_bank_rate_cards','vp_qc_tasks','vp_qc_events','vp_report_versions',
  'vp_report_formats','vp_valuation_versions','vp_valuer_credentials',
  'vp_billing_settings','vp_invoice_records','vp_invoice_payments'] LOOP
    IF to_regclass('public.'||n) IS NULL THEN
      RAISE EXCEPTION 'P10 precheck: missing public.% — inspect phase installation; no changes applied',n;
    END IF;
  END LOOP;
  IF to_regprocedure('public.vp_current_org_id()') IS NULL
   OR to_regprocedure('public.vp_first_login_required()') IS NULL
   OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
   OR to_regclass('storage.objects') IS NULL
   OR to_regprocedure('public.vp_admin_replace_module_permissions(text,text,text[])') IS NULL THEN
    RAISE EXCEPTION 'P10 precheck: prerequisites missing; no changes applied';
  END IF;
  IF EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace ns ON ns.oid=c.relnamespace
    WHERE ns.nspname='public' AND c.relname IN ('cases','vp_site_visits','users','role_perms')
      AND c.relforcerowsecurity) THEN
    RAISE EXCEPTION 'P10 requires review of FORCE RLS on protected helper source tables';
  END IF;
  IF EXISTS(SELECT 1 FROM storage.buckets WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files') AND public IS TRUE) THEN
    RAISE EXCEPTION 'Public valuation file bucket detected; resolve before applying P10';
  END IF;
END $p10$;

-- Caller identity comes ONLY from the linked, active Supabase Auth user.
-- Unlike previous helpers, tenant.admin does not grant operational actions.
CREATE OR REPLACE FUNCTION public.vp_sec_can(p_permission text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT coalesce(p_permission IS NOT NULL, false)
 AND (SELECT public.vp_current_org_id()) IS NOT NULL
 AND NOT (SELECT public.vp_first_login_required())
 AND EXISTS (
   SELECT 1 FROM public.valuation_auth_links l
   JOIN public.users u ON u.id=l.user_id
   JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
   WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
     AND u.org_id=(SELECT public.vp_current_org_id()) AND rp.perm=p_permission
 );
$$;

CREATE OR REPLACE FUNCTION public.vp_sec_my_capabilities()
RETURNS text[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT coalesce(array_agg(DISTINCT rp.perm ORDER BY rp.perm),ARRAY[]::text[])
 FROM public.valuation_auth_links l
 JOIN public.users u ON u.id=l.user_id
 JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
 WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
   AND u.org_id=(SELECT public.vp_current_org_id())
   AND NOT (SELECT public.vp_first_login_required());
$$;

CREATE OR REPLACE FUNCTION public.vp_sec_case_visible(p_case_num bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS (SELECT 1 FROM public.cases c
  WHERE c.org_id=(SELECT public.vp_current_org_id()) AND c.num=p_case_num)
 AND (
   (SELECT public.vp_sec_can('cases.View'))
   OR ((SELECT public.vp_sec_can('field.View'))
        OR (SELECT public.vp_sec_can('field.Check In/Out')))
      AND EXISTS (SELECT 1 FROM public.vp_site_visits v
       WHERE v.org_id=(SELECT public.vp_current_org_id()) AND v.num=p_case_num
         AND v.assigned_user_id=(SELECT public.vp_field_my_user_id()))
   OR (SELECT public.vp_sec_can('qc.View'))
   OR (SELECT public.vp_sec_can('signoff.View'))
 );
$$;

CREATE OR REPLACE FUNCTION public.vp_sec_visit_visible(p_visit_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM public.vp_site_visits v
  WHERE v.org_id=(SELECT public.vp_current_org_id()) AND v.id=p_visit_id
    AND (
       (SELECT public.vp_sec_can('field.View'))
       OR (SELECT public.vp_sec_can('field.Assign'))
       OR ((SELECT public.vp_sec_can('field.Check In/Out'))
           AND v.assigned_user_id=(SELECT public.vp_field_my_user_id()))
       OR (SELECT public.vp_sec_can('qc.View'))
    ));
$$;

-- Complete CURRENT-TENANT directory, including users not linked to Auth yet.
-- No legacy passwords, tokens, auth UUIDs or other tenant members are returned.
CREATE OR REPLACE FUNCTION public.vp_sec_admin_user_directory()
RETURNS TABLE (
  id text, org_id text, login text, name text, role text, active boolean,
  email_confirmed boolean, invited_at timestamptz, last_login timestamptz,
  branch_ids text[], qc_eligible boolean, qc_issue text,
  login_linked boolean, password_setup_required boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.id::text,u.org_id::text,u.login,u.name,u.role,u.active,
  (a.email_confirmed_at IS NOT NULL), a.invited_at,u.last_login,
  ARRAY(SELECT ub.branch_id::text FROM public.vp_user_branches ub
    WHERE ub.org_id=u.org_id AND ub.user_id=u.id ORDER BY ub.branch_id) AS branch_ids,
  (u.active IS TRUE AND a.email_confirmed_at IS NOT NULL
   AND coalesce(ps.must_change,false) IS FALSE
   AND EXISTS (SELECT 1 FROM public.role_perms rp WHERE rp.org_id=u.org_id
     AND rp.role=u.role AND rp.perm='qc.Approve')
   AND EXISTS (SELECT 1 FROM public.role_perms rp WHERE rp.org_id=u.org_id
     AND rp.role=u.role AND rp.perm='qc.Return')) AS qc_eligible,
  CASE WHEN l.auth_uid IS NULL THEN 'Login not linked to Supabase Authentication'
    WHEN a.email_confirmed_at IS NULL THEN 'Login email not verified'
    WHEN coalesce(ps.must_change,false) THEN 'First-login password change required'
    WHEN u.active IS NOT TRUE THEN 'User suspended'
    WHEN NOT EXISTS(SELECT 1 FROM public.role_perms rp WHERE rp.org_id=u.org_id
      AND rp.role=u.role AND rp.perm='qc.Approve') THEN 'QC Approve permission missing'
    WHEN NOT EXISTS(SELECT 1 FROM public.role_perms rp WHERE rp.org_id=u.org_id
      AND rp.role=u.role AND rp.perm='qc.Return') THEN 'QC Return permission missing'
    ELSE 'Ready' END AS qc_issue,
  (l.auth_uid IS NOT NULL) AS login_linked,
  coalesce(ps.must_change,false) AS password_setup_required
 FROM public.users u
 LEFT JOIN public.valuation_auth_links l ON l.user_id=u.id
 LEFT JOIN auth.users a ON a.id=l.auth_uid
 LEFT JOIN public.vp_user_password_setup ps ON ps.auth_uid=l.auth_uid
 WHERE u.org_id=(SELECT public.vp_current_org_id())
   AND (SELECT public.vp_sec_can('tenant.admin'))
 ORDER BY u.name,u.id;
$$;

-- Replace the previous tenant.admin blanket bypass in write-authorizing helpers.
CREATE OR REPLACE FUNCTION public.vp_can_case_action(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['Create','Edit','Assign'])
 AND public.vp_sec_can('cases.'||p_action);
$$;
CREATE OR REPLACE FUNCTION public.vp_field_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Assign','Check In/Out','Manage Geofence'])
 AND public.vp_sec_can('field.'||p_action);
$$;
CREATE OR REPLACE FUNCTION public.vp_qc_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Approve','Return','Edit'])
 AND public.vp_sec_can('qc.'||p_action);
$$;
CREATE OR REPLACE FUNCTION public.vp_billing_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Create','Approve','Export'])
 AND public.vp_sec_can('billing.'||p_action);
$$;
CREATE OR REPLACE FUNCTION public.vp8_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Audit','Export'])
 AND public.vp_sec_can('analytics.'||p_action);
$$;
CREATE OR REPLACE FUNCTION public.vp_report_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT CASE p_action
  WHEN 'View' THEN public.vp_sec_can('signoff.View') OR public.vp_sec_can('signoff.Generate') OR public.vp_sec_can('signoff.Release')
  WHEN 'Edit' THEN public.vp_sec_can('cases.Edit') OR public.vp_sec_can('signoff.Generate')
  WHEN 'Prepare' THEN public.vp_sec_can('signoff.Generate')
  WHEN 'Release' THEN public.vp_sec_can('signoff.Release')
  WHEN 'Manage Formats' THEN public.vp_sec_can('signoff.Manage Templates')
  ELSE false END;
$$;

-- RESTRICTIVE policies intersect all pre-existing permissive policies (including
-- legacy tenant-wide reads), so they prevent alternate policies from bypassing P10.
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vp_p10_cases_gate ON public.cases;
CREATE POLICY vp_p10_cases_gate ON public.cases AS RESTRICTIVE FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND public.vp_sec_case_visible(num));

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vp_p10_documents_gate ON public.documents;
CREATE POLICY vp_p10_documents_gate ON public.documents AS RESTRICTIVE FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND public.vp_sec_case_visible(num));

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vp_p10_forms_gate ON public.forms;
CREATE POLICY vp_p10_forms_gate ON public.forms AS RESTRICTIVE FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND public.vp_sec_case_visible(num));

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vp_p10_users_gate ON public.users;
CREATE POLICY vp_p10_users_gate ON public.users AS RESTRICTIVE FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND
 (id=(SELECT public.vp_field_my_user_id()) OR (SELECT public.vp_sec_can('tenant.admin'))
 OR (SELECT public.vp_sec_can('field.Assign')) OR (SELECT public.vp_sec_can('qc.Edit'))));

ALTER TABLE public.role_perms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vp_p10_role_perms_gate ON public.role_perms;
CREATE POLICY vp_p10_role_perms_gate ON public.role_perms AS RESTRICTIVE FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND
  ((SELECT public.vp_sec_can('tenant.admin')) OR role=(
   SELECT u.role FROM public.users u JOIN public.valuation_auth_links l ON l.user_id=u.id
   WHERE l.auth_uid=(SELECT auth.uid()) LIMIT 1)));

-- The original RLS policy is deliberately preserved; additional gates only narrow access.
DO $pol$
DECLARE t text; expression text;
BEGIN
  FOR t,expression IN SELECT * FROM (VALUES
   ('banks','public.vp_sec_can(''cases.View'') OR public.vp_sec_can(''cases.Create'') OR public.vp_sec_can(''tenant.admin'')'),
   ('vp_bank_rate_cards','public.vp_sec_can(''cases.View'') OR public.vp_sec_can(''cases.Create'') OR public.vp_sec_can(''tenant.admin'')'),
   ('vp_branches','public.vp_sec_can(''cases.View'') OR public.vp_sec_can(''field.View'') OR public.vp_sec_can(''field.Assign'') OR public.vp_sec_can(''field.Check In/Out'') OR public.vp_sec_can(''tenant.admin'')'),
   ('extractions','public.vp_sec_can(''cases.View'') OR public.vp_sec_can(''signoff.View'')'),
   ('invoices','public.vp_sec_can(''billing.View'')'),
   ('expenses','public.vp_sec_can(''field.View'') OR public.vp_sec_can(''billing.View'') OR public.vp_sec_can(''field.Check In/Out'')'),
   ('trips','public.vp_sec_can(''field.View'') OR public.vp_sec_can(''billing.View'') OR public.vp_sec_can(''field.Check In/Out'')'),
   ('log','public.vp_sec_can(''cases.View'') OR public.vp_sec_can(''qc.View'') OR public.vp_sec_can(''analytics.Audit'')'),
   ('audit','public.vp_sec_can(''analytics.Audit'') OR public.vp_sec_can(''admin.Audit Logs'')'),
   ('org_settings','public.vp_sec_can(''tenant.admin'')'),
   ('vp_site_visits','public.vp_sec_visit_visible(id)'),
   ('vp_visit_photos','public.vp_sec_visit_visible(visit_id)'),
   ('vp_visit_expense_links','public.vp_sec_visit_visible(visit_id)'),
   ('vp_visit_travel','public.vp_sec_visit_visible(visit_id)'),
   ('vp_qc_tasks','public.vp_sec_can(''qc.View'') OR public.vp_sec_can(''qc.Edit'')'),
   ('vp_qc_events','public.vp_sec_can(''qc.View'') OR public.vp_sec_can(''qc.Edit'')'),
   ('vp_report_formats','public.vp_sec_can(''signoff.View'') OR public.vp_sec_can(''signoff.Generate'') OR public.vp_sec_can(''signoff.Manage Templates'')'),
   ('vp_valuer_credentials','public.vp_sec_can(''signoff.View'') OR public.vp_sec_can(''signoff.Manage Templates'') OR user_id=(SELECT public.vp_field_my_user_id())'),
   ('vp_report_versions','public.vp_sec_can(''signoff.View'') OR public.vp_sec_can(''signoff.Generate'')'),
   ('vp_valuation_versions','public.vp_sec_can(''signoff.View'') OR public.vp_sec_can(''signoff.Generate'')'),
   ('vp_billing_settings','public.vp_sec_can(''billing.View'')'),
   ('vp_invoice_records','public.vp_sec_can(''billing.View'')'),
   ('vp_invoice_payments','public.vp_sec_can(''billing.View'')')
  ) AS rules(table_name,predicate)
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I','vp_p10_gate',t);
    EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR SELECT TO authenticated USING (org_id=(SELECT public.vp_current_org_id()) AND (%s))',
       'vp_p10_gate',t,expression);
  END LOOP;
END $pol$;

-- Object access gate: BOTH the existing storage policies and P10 must permit it.
-- Previously issued signed URLs may remain valid until their own expiration.
DROP POLICY IF EXISTS vp_p10_storage_read_gate ON storage.objects;
CREATE POLICY vp_p10_storage_read_gate ON storage.objects
 AS RESTRICTIVE FOR SELECT TO authenticated
 USING (CASE
  WHEN bucket_id='vp-case-docs' THEN
    split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
    AND CASE WHEN split_part(name,'/',2) ~ '^[0-9]{1,18}$' THEN
      public.vp_sec_case_visible(split_part(name,'/',2)::bigint) ELSE false END
  WHEN bucket_id='vp-field-evidence' THEN
    split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
    AND CASE WHEN split_part(name,'/',3) ~ '^[0-9]{1,18}$' THEN
      public.vp_sec_visit_visible(split_part(name,'/',3)::bigint) ELSE false END
  WHEN bucket_id='vp-report-files' THEN
    split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
    AND public.vp_report_can('View')
  ELSE true END);
DROP POLICY IF EXISTS vp_p10_storage_insert_gate ON storage.objects;
CREATE POLICY vp_p10_storage_insert_gate ON storage.objects
 AS RESTRICTIVE FOR INSERT TO authenticated
 WITH CHECK (CASE
  WHEN bucket_id='vp-case-docs' THEN
     (public.vp_sec_can('cases.Create') OR public.vp_sec_can('cases.Edit'))
  WHEN bucket_id='vp-field-evidence' THEN
     public.vp_sec_can('field.Check In/Out')
  WHEN bucket_id='vp-report-files' THEN
     public.vp_sec_can('signoff.Generate')
  ELSE true END);

-- These functions are never executable anonymously and never expose caller-supplied org scope.
DO $grant$
DECLARE f record;
BEGIN
 FOR f IN SELECT p.oid::regprocedure signature FROM pg_proc p
 JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public'
 AND p.proname=ANY(ARRAY['vp_sec_can','vp_sec_my_capabilities',
 'vp_sec_case_visible','vp_sec_visit_visible','vp_sec_admin_user_directory']) LOOP
   EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon',f.signature);
   EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.signature);
 END LOOP;
END $grant$;
COMMIT;
