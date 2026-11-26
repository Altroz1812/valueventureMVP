-- P6 preflight (read-only). Run in Supabase SQL Editor, not PowerShell.
SELECT 'documents' AS object_name, to_regclass('public.documents') IS NOT NULL AS exists
UNION ALL SELECT 'users', to_regclass('public.users') IS NOT NULL
UNION ALL SELECT 'vp_current_org_id()', to_regprocedure('public.vp_current_org_id()') IS NOT NULL
UNION ALL SELECT 'vp_field_my_user_id()', to_regprocedure('public.vp_field_my_user_id()') IS NOT NULL
UNION ALL SELECT 'vp_p1_inspection_save(...)', EXISTS (
  SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
  WHERE n.nspname='public' AND p.proname='vp_p1_inspection_save'
);
-- Check table types before applying migration.
SELECT table_name,column_name,data_type
FROM information_schema.columns
WHERE table_schema='public' AND table_name IN ('documents','users')
 AND column_name IN ('id','org_id','num','active','storage_path')
ORDER BY table_name,column_name;
