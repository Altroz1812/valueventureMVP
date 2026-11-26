-- P8 READ-ONLY: run from Supabase SQL Editor against the exact project used by the frontend.
-- No CREATE/ALTER/DROP/GRANT. Does NOT validate cross-tenant authorization.
WITH required(phase, signature) AS (VALUES
 ('P0','public.vp_p0_inspection_access(bigint)'),
 ('P0','public.vp_p0_manager_inspection_save(bigint,jsonb,text)'),
 ('P0','public.vp_inspection_get(bigint)'),
 ('P1','public.vp_p1_inspection_save(bigint,jsonb,timestamptz,boolean,text)'),
 ('P2','public.vp_p2_valuer_inspection_for_case(integer)'),
 ('P2','public.vp_p2_transfer_history(integer)'),
 ('P6','public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)'),
 ('P6','public.vp_p6_ocr_history(integer,bigint)')
)
SELECT phase,signature,to_regprocedure(signature) IS NOT NULL AS installed
FROM required ORDER BY phase,signature;

SELECT p.proname,p.oid::regprocedure AS real_signature,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_can_execute,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_can_execute
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid
WHERE n.nspname='public' AND p.proname IN
 ('vp_p0_inspection_access','vp_p1_inspection_save','vp_inspection_get','vp_p6_save_ocr','vp_p6_ocr_history')
ORDER BY p.proname;
