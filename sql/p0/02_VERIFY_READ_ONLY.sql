-- Read-only checks after applying the migration in staging.
SELECT p AS signature,to_regprocedure('public.'||p) IS NOT NULL AS installed
FROM unnest(ARRAY[
 'vp_p0_inspection_access(bigint)',
 'vp_p0_manager_inspection_save(bigint,jsonb,text)',
 'vp_p0_assert_inspection_ready(bigint,bigint,text,jsonb)',
 'vp_p0_field_qc_approval_guard()',
 'vp_inspection_save(bigint,jsonb,boolean)']) p;
SELECT tgname,tgenabled FROM pg_trigger
WHERE tgrelid='public.vp_qc_tasks'::regclass AND tgname='vp_p0_field_qc_approval_guard';
SELECT rolname FROM pg_roles WHERE rolname IN ('anon','authenticated','service_role');
SELECT count(*) AS manager_corrections FROM public.vp_p0_inspection_corrections;
-- Confirm cross-tenant security and denied anonymous RPC calls with REAL JWTs.
