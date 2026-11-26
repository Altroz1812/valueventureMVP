SELECT to_regprocedure('public.vp_p9_field_update_case(bigint,text,text)') IS NOT NULL AS case_edit_rpc_ready,
 to_regprocedure('public.vp_p9_field_self_reschedule(bigint,timestamptz)') IS NOT NULL AS self_schedule_rpc_ready;
SELECT p.proname,pg_get_functiondef(p.oid) AS function_source
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN ('vp_p9_field_update_case','vp_p9_field_self_reschedule');
