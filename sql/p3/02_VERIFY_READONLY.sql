-- Read-only P3 verification; run in Supabase SQL Editor.
SELECT
 to_regclass('public.vp_p3_ocr_runs') IS NOT NULL AS audit_table,
 to_regprocedure('public.vp_p3_ocr_claim(bigint,integer)') IS NOT NULL AS claim_rpc,
 to_regprocedure('public.vp_p3_ocr_complete(bigint,text,integer,text)') IS NOT NULL AS complete_rpc;
SELECT c.relname, c.relrowsecurity AS rls_enabled
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname='vp_p3_ocr_runs';
SELECT p.proname,has_function_privilege('anon',p.oid,'EXECUTE') AS anon_can_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS signed_user_can_execute
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN ('vp_p3_ocr_claim','vp_p3_ocr_complete');
