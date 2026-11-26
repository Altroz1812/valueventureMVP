-- VALUATIONPRO P5 — BACKEND READINESS (READ ONLY)
-- Execute in the intended Supabase project's SQL Editor, NOT PowerShell.
-- Check the project URL used by your browser .env before running.
-- This query DOES NOT install migrations or call any write RPC.

WITH expected(kind, name, signature) AS ( VALUES
 ('TABLE','P0 inspection','public.vp_field_inspections'),
 ('TABLE','P0 site visits','public.vp_site_visits'),
 ('TABLE','P2 provenance audit','public.vp_p2_valuation_transfer_events'),
 ('RPC','P1 inspection save','public.vp_p1_inspection_save(bigint,jsonb,timestamp with time zone,boolean,text)'),
 ('RPC','P2 eligible inspection read','public.vp_p2_valuer_inspection_for_case(integer)'),
 ('RPC','P2 reviewed valuation save','public.vp_p2_save_reviewed_valuation(integer,jsonb,boolean,bigint,timestamp with time zone,jsonb)'),
 ('RPC','P2 transfer history','public.vp_p2_transfer_history(integer)')
)
SELECT kind,name,signature,
 CASE WHEN kind='TABLE' THEN to_regclass(signature) IS NOT NULL
      ELSE to_regprocedure(signature) IS NOT NULL END AS installed
FROM expected ORDER BY kind,name;

-- Check actual signatures and grants. Zero rows means no matching function installed.
SELECT p.proname AS function_name,
       pg_get_function_identity_arguments(p.oid) AS installed_arguments,
       has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN (
 'vp_p1_inspection_save',
 'vp_p2_valuer_inspection_for_case',
 'vp_p2_save_reviewed_valuation',
 'vp_p2_transfer_history')
ORDER BY p.proname;

-- Audit table RLS, if present.
SELECT n.nspname,c.relname,c.relrowsecurity AS rls_enabled
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='vp_p2_valuation_transfer_events';

-- API function signature/permission changes may require a PostgREST cache refresh
-- AFTER a successful P2 migration:  NOTIFY pgrst, 'reload schema';
-- Do not infer tenant isolation from these catalog checks alone.
