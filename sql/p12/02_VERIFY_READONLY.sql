-- Run after P12 installation, in SQL Editor.
SELECT to_regprocedure('public.vp_sec_admin_user_setup()') AS admin_setup_rpc;
SELECT r.name, count(rp.perm) AS permission_count
FROM public.roles r JOIN public.orgs o ON o.id=r.org_id
LEFT JOIN public.role_perms rp ON rp.org_id=r.org_id AND rp.role=r.name
WHERE o.code='ADASOL' GROUP BY r.name ORDER BY r.name;
SELECT b.id,b.name,b.code,b.is_active FROM public.vp_branches b
JOIN public.orgs o ON o.id=b.org_id WHERE o.code='ADASOL' ORDER BY b.name;
SELECT has_function_privilege('authenticated',
 'public.vp_sec_admin_user_setup()', 'EXECUTE') AS authenticated_can_call_catalog;
