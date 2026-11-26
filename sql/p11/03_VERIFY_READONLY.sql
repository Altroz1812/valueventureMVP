-- Post-deployment metadata only. Also execute manual cross-role tests.
SELECT p.proname,pg_get_function_identity_arguments(p.oid) args,p.prosecdef security_definer,
  has_function_privilege('authenticated',p.oid,'EXECUTE') authenticated_can_execute,
  has_function_privilege('anon',p.oid,'EXECUTE') anon_can_execute
FROM pg_proc p WHERE p.pronamespace='public'::regnamespace
 AND p.proname IN ('vp_sec_can','vp_sec_my_capabilities','vp_sec_admin_user_directory',
  'vp_sec_admin_role_matrix','vp_sec_case_visible','vp_sec_visit_visible')
ORDER BY p.proname;
SELECT o.code AS tenant,u.login,u.role,u.active,exists(
 SELECT 1 FROM public.role_perms r WHERE r.org_id=u.org_id
 AND r.role=u.role AND r.perm='tenant.admin') admin_permission
FROM public.users u JOIN public.orgs o ON o.id=u.org_id
WHERE lower(btrim(u.login))='kranthisamin@gmail.com';
SELECT policyname,schemaname,tablename,permissive,cmd
FROM pg_policies WHERE policyname LIKE 'vp_p10_%'
ORDER BY schemaname,tablename,policyname;
SELECT id,public FROM storage.buckets
WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files');
