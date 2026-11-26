-- P10 read-only precheck. Stop if unexpected schema/function signatures are reported.
SELECT current_database() database_name, current_user deployment_role, now() checked_at;
SELECT c.table_schema,c.table_name,c.column_name,c.data_type
FROM information_schema.columns c
WHERE c.table_schema='public'
 AND c.table_name IN ('users','roles','role_perms','valuation_auth_links',
 'vp_user_branches','vp_user_password_setup','cases','documents','forms',
 'vp_site_visits','vp_visit_photos','vp_qc_tasks')
 AND c.column_name IN ('id','num','org_id','user_id','auth_uid','name','login','role','perm',
 'active','email_confirmed','branch_id','must_change','last_login','assigned_user_id')
ORDER BY c.table_name,c.ordinal_position;
SELECT p.proname,pg_get_function_identity_arguments(p.oid) signature,
 pg_get_function_result(p.oid) result_type, p.prosecdef is_security_definer
FROM pg_proc p WHERE p.pronamespace='public'::regnamespace
 AND p.proname IN ('vp_current_org_id','vp_is_admin','vp_first_login_required',
 'vp_can_case_action','vp_field_can','vp_qc_can','vp_billing_can','vp_report_can','vp8_can',
 'vp_admin_user_directory','vp_admin_replace_module_permissions',
 'vp_admin_first_login_status','vp_admin_attach_invited_user',
 'vp_admin_replace_user_branches')
ORDER BY p.proname;
SELECT schemaname,tablename,policyname,permissive,cmd,roles,qual
FROM pg_policies WHERE (schemaname='public' AND tablename IN
('users','cases','documents','forms','vp_site_visits','vp_visit_photos','role_perms'))
 OR (schemaname='storage' AND tablename='objects')
ORDER BY schemaname,tablename,policyname;
SELECT id,public, file_size_limit FROM storage.buckets WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files');
SELECT role,perm,count(*) count FROM public.role_perms
 WHERE org_id IN (SELECT public.vp_current_org_id())
 GROUP BY role,perm ORDER BY role,perm;
