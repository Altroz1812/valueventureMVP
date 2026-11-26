-- RUN IN SUPABASE SQL EDITOR against the intended tenant DB. READ ONLY.
SELECT
  to_regclass('public.documents') IS NOT NULL AS documents_present,
  to_regclass('public.cases') IS NOT NULL AS cases_present,
  to_regclass('public.vp_field_inspections') IS NOT NULL AS p0_inspections_present,
  to_regprocedure('public.vp_current_org_id()') IS NOT NULL AS tenant_context_present,
  to_regprocedure('public.vp_field_my_user_id()') IS NOT NULL AS mapped_user_present,
  (SELECT public FROM storage.buckets WHERE id = 'vp-case-docs') IS FALSE AS private_documents_bucket;

SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS installed_signature
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN (
  'vp_p2_valuer_inspection_for_case', 'vp_p2_transfer_history', 'vp_p2_save_reviewed_valuation',
  'vp_p3_ocr_claim', 'vp_p3_ocr_complete'
) ORDER BY p.proname;
-- P2 missing = resolve P2 separately. P3 does not silently install P2 functions.
