-- P12 read-only: run in Supabase SQL Editor (postgres role).
-- Confirms whether agency roles were entered under a different org and whether branches exist.
SELECT id, code, name, status FROM public.orgs ORDER BY id;
SELECT o.id AS org_id, o.code AS org_code, r.name AS role_name
FROM public.orgs o LEFT JOIN public.roles r ON r.org_id=o.id
ORDER BY o.id, r.name;
SELECT o.id AS org_id, o.code AS org_code,
 count(b.id) AS total_branches,
 count(b.id) FILTER (WHERE b.is_active) AS active_branches
FROM public.orgs o LEFT JOIN public.vp_branches b ON b.org_id=o.id
GROUP BY o.id,o.code ORDER BY o.id;
-- Verify where existing staff user records actually live; do not move across tenants blindly.
SELECT o.id AS org_id, o.code, COUNT(u.id) AS user_count
FROM public.orgs o LEFT JOIN public.users u ON u.org_id=o.id
GROUP BY o.id, o.code ORDER BY o.id;
SELECT o.code AS org_code, u.id AS user_id, u.login, u.role, u.active
FROM public.users u JOIN public.orgs o ON o.id=u.org_id
ORDER BY o.code, u.login;
SELECT u.id AS user_id, u.login, u.role, u.active, o.code AS org_code,
 EXISTS (SELECT 1 FROM public.role_perms p
   WHERE p.org_id=u.org_id AND p.role=u.role AND p.perm='tenant.admin') AS has_tenant_admin
FROM public.users u JOIN public.orgs o ON o.id=u.org_id
WHERE lower(btrim(u.login))='kranthisamin@gmail.com';
SELECT to_regprocedure('public.vp_sec_can(text)') AS sec_can,
 to_regprocedure('public.vp_sec_admin_user_directory()') AS secure_user_directory,
 to_regprocedure('public.vp_sec_admin_role_matrix()') AS secure_role_matrix,
 to_regprocedure('public.vp_sec_admin_user_setup()') AS secure_user_setup;
