-- P6 verification, read-only; run in intended Supabase SQL Editor.
SELECT to_regclass('public.vp_p6_saved_ocr') IS NOT NULL AS saved_ocr_table,
  to_regprocedure('public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)') IS NOT NULL AS save_rpc,
  to_regprocedure('public.vp_p6_ocr_history(integer,bigint)') IS NOT NULL AS history_rpc;
SELECT c.relname,c.relrowsecurity AS rls_enabled,
   has_table_privilege('anon',c.oid,'SELECT') AS anon_can_select,
   has_table_privilege('authenticated',c.oid,'INSERT') AS authenticated_can_insert
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='vp_p6_saved_ocr';
SELECT p.proname,pg_get_function_identity_arguments(p.oid) AS installed_args,
  has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
  has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('vp_p6_save_ocr','vp_p6_ocr_history');
