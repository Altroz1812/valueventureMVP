-- READ ONLY: verify exact dependencies in the intended staging/project database.
SELECT 'table' AS kind, x.name, to_regclass('public.'||x.name) IS NOT NULL AS exists
FROM (VALUES ('orgs'),('users'),('cases'),('vp_site_visits'),('vp_qc_tasks')) AS x(name)
UNION ALL
SELECT 'function',x.name,to_regprocedure('public.'||x.name) IS NOT NULL
FROM (VALUES ('vp_current_org_id()'),('vp_field_my_user_id()'),
 ('vp_field_can_see_visit(bigint)'),('vp_qc_can(text)')) AS x(name);

SELECT 'existing_inspection_table' AS check_type,
 to_regclass('public.vp_field_inspections')::text AS existing_table;

SELECT c.table_name,c.column_name,c.data_type
FROM information_schema.columns c
WHERE c.table_schema='public' AND c.table_name IN
 ('vp_site_visits','vp_qc_tasks','cases')
 AND c.column_name IN ('id','org_id','num','assigned_user_id','status','meta')
ORDER BY c.table_name,c.column_name;
