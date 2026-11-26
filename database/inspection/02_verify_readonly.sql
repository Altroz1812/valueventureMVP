-- READ ONLY, after migration.
SELECT c.relname AS table_name,c.relrowsecurity AS rls_enabled
FROM pg_class c WHERE c.oid=to_regclass('public.vp_field_inspections');
SELECT p.proname,p.prosecdef AS security_definer
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN
('vp_inspection_get','vp_inspection_save','vp_inspection_for_case');
SELECT o.code,o.name,
  (SELECT count(*) FROM public.vp_field_inspections i WHERE i.org_id=o.id) AS inspections,
  (SELECT count(*) FROM public.vp_field_inspections i WHERE i.org_id=o.id AND i.status='Submitted') AS submitted
FROM public.orgs o ORDER BY o.id;
