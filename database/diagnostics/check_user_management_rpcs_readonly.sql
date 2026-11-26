-- Read-only: verify backend RPCs referenced by the active User Management UI
-- Run in Supabase SQL Editor. No data or permissions are changed.
WITH expected(name) AS (
  VALUES
    ('vp_admin_attach_invited_user'),
    ('vp_admin_replace_user_branches'),
    ('vp_admin_user_directory')
)
SELECT e.name AS rpc_name,
       count(p.oid) > 0 AS exists_in_public_schema,
       string_agg(pg_get_function_identity_arguments(p.oid), ' | ' ORDER BY p.oid)
         AS available_signatures,
       bool_or(has_function_privilege('authenticated', p.oid, 'EXECUTE'))
         AS authenticated_can_execute
FROM expected e
LEFT JOIN pg_proc p
  ON p.proname = e.name
 AND p.pronamespace = 'public'::regnamespace
GROUP BY e.name
ORDER BY e.name;
