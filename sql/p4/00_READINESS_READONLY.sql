-- P4 READ-ONLY prerequisite inventory. Run ONLY in Supabase SQL Editor.
-- Does not bypass RLS and does not prove authenticated runtime authorization.
SELECT 'P0 inspection table' AS component,
       (to_regclass('public.vp_field_inspections') IS NOT NULL) AS installed
UNION ALL SELECT 'P1 optimistic inspection save',
       (to_regprocedure('public.vp_p1_inspection_save(bigint,jsonb,timestamp with time zone,boolean,text)') IS NOT NULL)
UNION ALL SELECT 'P2 approved inspection read RPC',
       (to_regprocedure('public.vp_p2_valuer_inspection_for_case(integer)') IS NOT NULL)
UNION ALL SELECT 'P2 reviewed valuation save RPC',
       (to_regprocedure('public.vp_p2_save_reviewed_valuation(integer,jsonb,boolean,bigint,timestamp with time zone,jsonb)') IS NOT NULL)
UNION ALL SELECT 'P2 transfer history RPC',
       (to_regprocedure('public.vp_p2_transfer_history(integer)') IS NOT NULL)
UNION ALL SELECT 'P2 transfer audit table',
       (to_regclass('public.vp_p2_valuation_transfer_events') IS NOT NULL);

-- The following shows actual signatures, which may differ from the above
-- expected names/types if local migrations were modified.
SELECT p.proname AS function_name,
       pg_get_function_identity_arguments(p.oid) AS installed_arguments,
       has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authenticated_can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public'
  AND p.proname IN (
    'vp_p1_inspection_save',
    'vp_p2_valuer_inspection_for_case',
    'vp_p2_save_reviewed_valuation',
    'vp_p2_transfer_history'
  )
ORDER BY p.proname;
