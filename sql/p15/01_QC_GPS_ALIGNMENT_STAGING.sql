-- P15 | guarded correction of live QC functions only; no historical data updates.
-- Run preflight and back up both function definitions first. Stage before production.
-- Requires the existing GPS-only check-in and check-out patch already installed.
BEGIN;
DO $p15$
DECLARE
  checks_oid regprocedure := to_regprocedure('public.vp_qc_required_checks(text,text)');
  decide_oid regprocedure := to_regprocedure('public.vp_qc_decide(bigint,text,jsonb,text,text)');
  checkin_oid regprocedure := to_regprocedure('public.vp_field_checkin(bigint,double precision,double precision,numeric)');
  checkout_oid regprocedure := to_regprocedure('public.vp_field_checkout(bigint,double precision,double precision,numeric)');
  checks_def text; decide_def text; original_checks text; original_decide text;
  old_gps text := 'GPS check-in within geofence';
  new_gps text := 'GPS check-in and check-out recorded';
  old_photo text := 'Minimum 8 geotagged photos attached';
  new_photo text := 'Minimum 8 registered photos attached';
  old_defect text := 'GPS outside geofence';
  new_defect text := 'GPS evidence missing or invalid';
  old_guard text := $old$IF v_visit.checkin_verified IS DISTINCT FROM true
        OR v_visit.checkout_verified IS DISTINCT FROM true THEN
        RAISE EXCEPTION 'Geofence verification is missing; do not certify this checklist item'; END IF;$old$;
  new_guard text := $new$IF v_visit.checkin_at IS NULL OR v_visit.checkout_at IS NULL
        OR v_visit.checkout_at < v_visit.checkin_at
        OR NOT coalesce(v_visit.checkin_lat BETWEEN -90 AND 90
          AND v_visit.checkin_lng BETWEEN -180 AND 180
          AND v_visit.checkout_lat BETWEEN -90 AND 90
          AND v_visit.checkout_lng BETWEEN -180 AND 180
          AND v_visit.checkin_accuracy_m > 0 AND v_visit.checkin_accuracy_m <= 100000
          AND v_visit.checkout_accuracy_m > 0 AND v_visit.checkout_accuracy_m <= 100000,false) THEN
        RAISE EXCEPTION 'GPS evidence missing or invalid; recorded check-in and check-out are required'; END IF;$new$;
BEGIN
  IF checks_oid IS NULL OR decide_oid IS NULL OR checkin_oid IS NULL OR checkout_oid IS NULL THEN
    RAISE EXCEPTION 'Expected QC or visit RPC missing; stop and review preflight';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orgs' AND column_name='id' AND data_type='bigint')
    OR NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='vp_site_visits' AND column_name='id' AND data_type='bigint') THEN
    RAISE EXCEPTION 'Not the expected BIGINT database';
  END IF;
  IF position('Outside configured property geofence' IN pg_get_functiondef(checkin_oid))>0
     OR position('Outside configured property geofence' IN pg_get_functiondef(checkout_oid))>0
     OR position('geofence_enforced' IN pg_get_functiondef(checkin_oid))=0
     OR position('geofence_enforced' IN pg_get_functiondef(checkout_oid))=0
     OR position('v_ok:=false' IN pg_get_functiondef(checkin_oid))=0
     OR position('v_ok:=false' IN pg_get_functiondef(checkout_oid))=0 THEN
    RAISE EXCEPTION 'GPS-only backend not recognized. Review and install the earlier GPS-only patch before P15; do not overwrite unknown live code.';
  END IF;
  checks_def := pg_get_functiondef(checks_oid); decide_def := pg_get_functiondef(decide_oid);
  original_checks := checks_def; original_decide := decide_def;
  -- Preserve live authorization, audit and transition code. Replace exact reviewed fragments only.
  IF position('Only the assigned checker can decide this review' IN decide_def)=0
    OR position('Field officer cannot decide QC on their own inspection' IN decide_def)=0
    OR position('greatest(8,v_visit.min_photos)' IN decide_def)=0
    OR position('vp_qc_required_checks' IN decide_def)=0 THEN
    RAISE EXCEPTION 'Unexpected QC decision implementation; manual review required';
  END IF;
  IF position(new_gps IN checks_def)>0 AND position(new_photo IN checks_def)>0
    AND position(new_guard IN decide_def)>0 AND position(new_defect IN decide_def)>0
    AND position(old_gps IN checks_def)=0 AND position(old_photo IN checks_def)=0
    AND position(old_guard IN decide_def)=0 AND position(old_defect IN decide_def)=0 THEN
    RAISE NOTICE 'P15 QC alignment already installed'; RETURN;
  END IF;
  IF (length(checks_def)-length(replace(checks_def,old_gps,'')))<>length(old_gps)
    OR (length(checks_def)-length(replace(checks_def,old_photo,'')))<>length(old_photo)
    OR (length(decide_def)-length(replace(decide_def,old_defect,'')))<>length(old_defect)
    OR (length(decide_def)-length(replace(decide_def,old_guard,'')))<>length(old_guard) THEN
    RAISE EXCEPTION 'QC functions differ from reviewed baseline; no changes applied. Share live definitions for a targeted merge.';
  END IF;
  checks_def := replace(replace(checks_def,old_gps,new_gps),old_photo,new_photo);
  decide_def := replace(replace(decide_def,old_guard,new_guard),old_defect,new_defect);
  -- Reverse replacement must reproduce the original definitions exactly.
  IF replace(replace(checks_def,new_gps,old_gps),new_photo,old_photo)<>original_checks
    OR replace(replace(decide_def,new_guard,old_guard),new_defect,old_defect)<>original_decide THEN
    RAISE EXCEPTION 'Unexpected substitution; refusing to modify functions';
  END IF;
  EXECUTE checks_def;
  EXECUTE decide_def;
  IF position(old_gps IN pg_get_functiondef(checks_oid))>0
    OR position(old_guard IN pg_get_functiondef(decide_oid))>0 THEN
    RAISE EXCEPTION 'Post-change verification failed';
  END IF;
END $p15$;
NOTIFY pgrst, 'reload schema';
COMMIT;
