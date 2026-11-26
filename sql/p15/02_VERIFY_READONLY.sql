-- P15 metadata verification (not a live role acceptance test).
SELECT public.vp_qc_required_checks('Field QC','Land') AS field_qc_checks,
 public.vp_qc_required_checks('Final QC','Land') AS final_land_checks,
 public.vp_qc_required_checks('Final QC','Residential') AS final_building_checks;
WITH f AS (SELECT pg_get_functiondef(to_regprocedure('public.vp_qc_decide(bigint,text,jsonb,text,text)')) AS body)
SELECT position('GPS evidence missing or invalid' IN body)>0 AS gps_recording_guard,
 position('Geofence verification is missing' IN body)=0 AS no_geofence_gate,
 position('greatest(8,v_visit.min_photos)' IN body)>0 AS photo_minimum_preserved,
 position('Only the assigned checker can decide this review' IN body)>0 AS checker_guard_preserved,
 position('Field officer cannot decide QC on their own inspection' IN body)>0 AS maker_checker_preserved FROM f;
SELECT p.oid::regprocedure AS rpc,p.prosecdef AS security_definer,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute
FROM pg_proc p WHERE p.pronamespace='public'::regnamespace AND p.proname IN
 ('vp_qc_decide','vp_qc_required_checks','vp_field_checkin','vp_field_checkout','vp_sec_can','vp_sec_my_capabilities','vp_sec_admin_user_directory','vp_sec_admin_user_setup') ORDER BY 1;
