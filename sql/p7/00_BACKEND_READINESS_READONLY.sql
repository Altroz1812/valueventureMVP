-- P7 READ ONLY: inspect runtime dependencies in the same Supabase project
-- that your ValuationPro VITE_SUPABASE_URL points to. Do NOT paste into PowerShell.
-- NO DDL, NO GRANTS, NO TENANT DATA CHANGES.
SELECT current_database() AS database_name, current_schema() AS current_schema,
  now() AS checked_at;

WITH required(kind, phase, description, signature) AS (
 VALUES
 ('RPC','BASE','Inspection get','public.vp_inspection_get(bigint)'),
 ('RPC','BASE','Original inspection save','public.vp_inspection_save(bigint,jsonb,boolean)'),
 ('RPC','P0','Inspection access','public.vp_p0_inspection_access(bigint)'),
 ('RPC','P0','Audited manager correction','public.vp_p0_manager_inspection_save(bigint,jsonb,text)'),
 ('RPC','P1','Optimistic inspection autosave','public.vp_p1_inspection_save(bigint,jsonb,timestamp with time zone,boolean,text)'),
 ('RPC','P2','Valuer inspection review','public.vp_p2_valuer_inspection_for_case(integer)'),
 ('RPC','P2','Reviewed valuation transfer history','public.vp_p2_transfer_history(integer)'),
 ('RPC','P6','Save OCR evidence','public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)'),
 ('RPC','P6','OCR evidence history','public.vp_p6_ocr_history(integer,bigint)'),
 ('TABLE','P0','Inspection data','public.vp_field_inspections'),
 ('TABLE','P0','Site visits','public.vp_site_visits'),
 ('TABLE','P6','Unverified OCR register','public.vp_p6_saved_ocr')
)
SELECT kind,phase,description,signature,
 CASE kind WHEN 'RPC' THEN to_regprocedure(signature) IS NOT NULL
           ELSE to_regclass(signature) IS NOT NULL END AS installed
FROM required ORDER BY phase,kind,description;

-- Actual signatures distinguish absent functions from argument mismatches.
SELECT p.proname,
       p.oid::regprocedure AS installed_signature,
       pg_get_function_identity_arguments(p.oid) AS arguments,
       has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
       has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public'
  AND p.proname IN ('vp_p0_inspection_access','vp_p1_inspection_save',
   'vp_inspection_save','vp_p0_manager_inspection_save',
   'vp_p6_save_ocr','vp_p6_ocr_history')
ORDER BY p.proname;

-- The RLS check is structural, NOT a cross-tenant test.
SELECT c.relname AS table_name,c.relrowsecurity AS rls_enabled,c.relforcerowsecurity AS force_rls
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname IN
  ('vp_field_inspections','vp_site_visits','documents','vp_p6_saved_ocr');
