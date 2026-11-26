-- Run after staging install. Do not use SQL Editor as a substitute for tests with real Auth JWTs.
SELECT p.proname,pg_get_function_identity_arguments(p.oid) args,
 pg_get_function_result(p.oid) result_type
FROM pg_proc p WHERE p.pronamespace='public'::regnamespace
 AND p.proname IN ('vp_sec_can','vp_sec_my_capabilities','vp_sec_admin_user_directory',
 'vp_sec_case_visible','vp_sec_visit_visible','vp_can_case_action','vp_qc_can',
 'vp_field_can','vp_billing_can','vp_report_can','vp8_can')
ORDER BY p.proname;
SELECT schemaname,tablename,policyname,permissive,cmd,roles,qual
FROM pg_policies WHERE policyname LIKE 'vp_p10_%'
ORDER BY schemaname,tablename,policyname;
SELECT id,public FROM storage.buckets WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files');
SELECT org_id,role,count(*) user_count FROM public.users GROUP BY org_id,role ORDER BY org_id,role;
SELECT org_id,role,count(*) granted_permissions FROM public.role_perms
 GROUP BY org_id,role ORDER BY org_id,role;
-- In the browser: with a test role, remove cases.View, refresh and verify both
-- GET /rest/v1/cases and GET /storage/v1/object/sign/vp-case-docs/... are denied.
