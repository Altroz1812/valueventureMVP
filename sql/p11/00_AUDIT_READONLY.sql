-- P11 RBAC audit. Read-only. Run in the target Supabase project first.
SELECT current_database() AS db_name, current_user AS executed_as, now() AS checked_at;
SELECT o.id::text AS org_id,o.code,o.name,o.status,
       u.id::text AS user_id,u.login,u.name AS user_name,u.role,u.active,
       (l.auth_uid IS NOT NULL) AS auth_linked,
       (a.email_confirmed_at IS NOT NULL) AS email_verified
FROM public.users u
JOIN public.orgs o ON o.id=u.org_id
LEFT JOIN public.valuation_auth_links l ON l.user_id=u.id
LEFT JOIN auth.users a ON a.id=l.auth_uid
WHERE lower(btrim(u.login))='kranthisamin@gmail.com'
   OR lower(btrim(coalesce(a.email,'')))='kranthisamin@gmail.com'
ORDER BY o.id,u.id;

SELECT n.nspname AS schema_name,p.proname,pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef AS security_definer,pg_get_function_result(p.oid) AS returns
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN
('vp_sec_can','vp_sec_my_capabilities','vp_sec_admin_user_directory',
 'vp_sec_case_visible','vp_sec_visit_visible','vp_admin_replace_module_permissions',
 'vp8_admin_set_analytics_permissions','vp_admin_set_user_role','vp9_dashboard_snapshot',
 'vp_current_org_id','vp_first_login_required','vp8_branch_visible')
ORDER BY p.proname,args;

SELECT n.nspname AS schema_name,c.relname AS table_name,c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS force_rls
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE (n.nspname='public' AND c.relname IN
 ('cases','documents','forms','users','roles','role_perms','vp_site_visits','vp_visit_photos'))
 OR (n.nspname='storage' AND c.relname='objects')
ORDER BY n.nspname,c.relname;

SELECT schemaname,tablename,policyname,permissive,cmd,roles
FROM pg_policies
WHERE (schemaname='public' AND tablename IN
('cases','documents','forms','users','roles','role_perms','vp_site_visits','vp_visit_photos'))
OR (schemaname='storage' AND tablename='objects')
ORDER BY schemaname,tablename,policyname;

SELECT id,public FROM storage.buckets
WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files');

SELECT o.code,u.role,count(*) AS members,
  count(*) FILTER(WHERE u.active IS TRUE) AS active_members,
  EXISTS(SELECT 1 FROM public.role_perms p WHERE p.org_id=o.id
    AND p.role=u.role AND p.perm='tenant.admin') AS has_protected_admin
FROM public.users u JOIN public.orgs o ON o.id=u.org_id
GROUP BY o.id,o.code,u.role
ORDER BY o.code,u.role;
