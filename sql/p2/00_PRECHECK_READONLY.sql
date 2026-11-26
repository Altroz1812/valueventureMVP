-- Run ONLY in Supabase SQL Editor, staging first. No modifications.
SELECT
 to_regclass('public.orgs') IS NOT NULL AS orgs_ok,
 to_regclass('public.cases') IS NOT NULL AS cases_ok,
 to_regclass('public.vp_field_inspections') IS NOT NULL AS inspections_ok,
 to_regclass('public.vp_site_visits') IS NOT NULL AS visits_ok,
 to_regprocedure('public.vp_report_can(text)') IS NOT NULL AS report_permission_ok,
 to_regprocedure('public.vp_report_save_valuation(integer,jsonb,boolean)') IS NOT NULL AS valuation_save_ok,
 to_regprocedure('public.vp_current_org_id()') IS NOT NULL AS tenant_context_ok,
 to_regprocedure('public.vp_field_my_user_id()') IS NOT NULL AS user_context_ok;
SELECT p.proname,pg_get_function_identity_arguments(p.oid) AS signature
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN ('vp_report_save_valuation','vp_report_can','vp_inspection_for_case');
