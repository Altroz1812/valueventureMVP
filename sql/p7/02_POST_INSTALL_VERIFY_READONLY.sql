-- P7 READ ONLY: run AFTER properly reviewed P0 and P1 migrations in staging.
SELECT
 to_regprocedure('public.vp_p0_inspection_access(bigint)') IS NOT NULL AS p0_access_ready,
 to_regprocedure('public.vp_p0_manager_inspection_save(bigint,jsonb,text)') IS NOT NULL AS p0_manager_ready,
 to_regprocedure('public.vp_p1_inspection_save(bigint,jsonb,timestamptz,boolean,text)') IS NOT NULL AS p1_autosave_ready,
 to_regprocedure('public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)') IS NOT NULL AS p6_ocr_save_ready,
 to_regprocedure('public.vp_p6_ocr_history(integer,bigint)') IS NOT NULL AS p6_ocr_history_ready;

SELECT p.oid::regprocedure AS installed_signature,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN
 ('vp_p0_inspection_access','vp_p1_inspection_save','vp_p6_save_ocr','vp_p6_ocr_history')
ORDER BY p.proname;

-- Check the P0 server-side QC approval guard; it cannot be assumed just because
-- the access function exists. The trigger is expected to be enabled.
SELECT t.tgname AS trigger_name,t.tgenabled AS enabled_state,
       t.tgrelid::regclass AS installed_on
FROM pg_trigger t
WHERE t.tgrelid=to_regclass('public.vp_qc_tasks')
  AND t.tgname='vp_p0_field_qc_approval_guard' AND NOT t.tgisinternal;
