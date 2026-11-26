SELECT p.oid::regprocedure AS signature,p.prosecdef AS security_definer,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
 position('vp_sec_case_visible' IN pg_get_functiondef(p.oid))>0 AS case_scope_check
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('vp_p6_save_ocr','vp_p6_ocr_history','vp_p21_apply_property_text') ORDER BY p.proname;
SELECT relrowsecurity AS ocr_register_rls FROM pg_class WHERE oid=to_regclass('public.vp_p6_saved_ocr');
