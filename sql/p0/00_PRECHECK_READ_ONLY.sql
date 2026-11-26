-- P0 preflight. RUN IN SUPABASE SQL EDITOR, NEVER POWERSHELL.
-- Do not apply the migration unless every required object exists and live function
-- definitions have been reviewed/backed up. No writes are performed here.
SELECT 'table' AS kind, t AS object_name, to_regclass('public.'||t) IS NOT NULL AS present
FROM unnest(ARRAY['orgs','users','cases','log','vp_site_visits','vp_visit_photos','vp_field_inspections','vp_qc_tasks','valuation_auth_links']) t
UNION ALL
SELECT 'function',p,to_regprocedure('public.'||p) IS NOT NULL
FROM unnest(ARRAY[
 'vp_current_org_id()', 'vp_field_my_user_id()', 'vp_is_admin(bigint)',
 'vp_field_can(text)', 'vp_field_can_see_visit(bigint)',
 'vp_inspection_get(bigint)','vp_inspection_save(bigint,jsonb,boolean)',
 'vp_inspection_for_case(integer)','vp_qc_decide(bigint,text,jsonb,text,text)']) p
ORDER BY kind,object_name;

-- Inspect permission mapping and current implementation prior to replacing ONE existing RPC.
SELECT p.oid::regprocedure AS signature,
       md5(pg_get_functiondef(p.oid)) AS live_definition_md5,
       pg_get_functiondef(p.oid) AS live_definition
FROM pg_proc p
WHERE p.oid=to_regprocedure('public.vp_inspection_save(bigint,jsonb,boolean)');

SELECT org_id,role,perm FROM public.role_perms
WHERE perm IN ('tenant.admin','field.Assign','field.Check In/Out','qc.Approve','qc.Return')
ORDER BY org_id,role,perm;
