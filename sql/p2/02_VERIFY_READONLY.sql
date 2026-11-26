-- Read-only structural checks; does not prove role isolation or calculation behavior.
SELECT
 to_regclass('public.vp_p2_valuation_transfer_events') IS NOT NULL AS audit_table_present,
 to_regprocedure('public.vp_p2_valuer_inspection_for_case(integer)') IS NOT NULL AS source_read_rpc_present,
 to_regprocedure('public.vp_p2_save_reviewed_valuation(integer,jsonb,boolean,bigint,timestamptz,jsonb)') IS NOT NULL AS reviewed_save_rpc_present,
 to_regprocedure('public.vp_p2_transfer_history(integer)') IS NOT NULL AS history_rpc_present;
SELECT c.relname,c.relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname='vp_p2_valuation_transfer_events';
SELECT p.proname,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 WHERE n.nspname='public' AND p.proname IN ('vp_p2_valuer_inspection_for_case','vp_p2_save_reviewed_valuation','vp_p2_transfer_history');
