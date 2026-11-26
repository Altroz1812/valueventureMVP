-- P15 read-only preflight. Run on staging with the correct BIGINT database.
SELECT current_database(), current_user, now() AS checked_at;
WITH expected(table_name,column_name,expected_type) AS (VALUES
 ('orgs','id','bigint'),('users','id','bigint'),('cases','org_id','bigint'),
 ('cases','num','integer'),('vp_qc_tasks','id','bigint'),('vp_site_visits','id','bigint'),
 ('vp_site_visits','checkin_lat','double precision'),('vp_site_visits','checkin_lng','double precision'),
 ('vp_site_visits','checkout_lat','double precision'),('vp_site_visits','checkout_lng','double precision'),
 ('vp_site_visits','checkin_accuracy_m','numeric'),('vp_site_visits','checkout_accuracy_m','numeric'))
SELECT e.*, c.data_type AS actual_type, coalesce(c.data_type=e.expected_type,false) AS matches
FROM expected e LEFT JOIN information_schema.columns c ON c.table_schema='public'
 AND c.table_name=e.table_name AND c.column_name=e.column_name ORDER BY 1,2;
WITH required(signature) AS (VALUES
 ('public.vp_qc_required_checks(text,text)'),('public.vp_qc_decide(bigint,text,jsonb,text,text)'),
 ('public.vp_field_checkin(bigint,double precision,double precision,numeric)'),
 ('public.vp_field_checkout(bigint,double precision,double precision,numeric)'),
 ('public.vp_sec_can(text)'),('public.vp_sec_my_capabilities()'),
 ('public.vp_sec_admin_user_directory()'),('public.vp_sec_admin_user_setup()'))
SELECT signature,to_regprocedure(signature) IS NOT NULL AS installed,
 CASE WHEN to_regprocedure(signature) IS NOT NULL THEN pg_get_functiondef(to_regprocedure(signature)) END AS live_definition
FROM required;
SELECT n.nspname AS schema_name,c.relname,c.relrowsecurity AS rls_enabled,c.relforcerowsecurity AS force_rls
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE (n.nspname='public' AND c.relname IN ('orgs','users','roles','role_perms','cases','documents','forms','vp_site_visits','vp_visit_photos','vp_qc_tasks','vp_qc_events'))
 OR (n.nspname='storage' AND c.relname='objects') ORDER BY 1,2;
SELECT schemaname,tablename,policyname,permissive,cmd,roles FROM pg_policies
WHERE (schemaname='public' AND tablename IN ('cases','documents','forms','users','roles','role_perms','vp_site_visits','vp_qc_tasks','vp_visit_photos'))
 OR (schemaname='storage' AND tablename='objects') ORDER BY 1,2,3;
SELECT id,public FROM storage.buckets WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files');
