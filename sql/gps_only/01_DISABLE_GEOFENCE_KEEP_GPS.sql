-- ValuationPro | GPS-only check-in/check-out (NO GEOFENCE ENFORCEMENT).
-- Additive function replacement only. Keeps GPS, actor checks, visit statuses,
-- required photographs, case-stage transition, audit log, RLS and all existing records.
-- IMPORTANT: Review the current database function bodies via precheck before applying.
-- Apply to a backed-up staging project first. No schema/table/row drops.
BEGIN;
DO $$
BEGIN
  IF to_regprocedure('public.vp_field_checkin(bigint,double precision,double precision,numeric)') IS NULL
     OR to_regprocedure('public.vp_field_checkout(bigint,double precision,double precision,numeric)') IS NULL
     OR to_regprocedure('public.vp_field_distance_m(double precision,double precision,double precision,double precision)') IS NULL
     OR to_regclass('public.vp_site_visits') IS NULL
     OR to_regclass('public.vp_visit_photos') IS NULL THEN
    RAISE EXCEPTION 'Phase 3 field backend missing; do not apply GPS-only patch';
  END IF;
  -- Prevent blindly overwriting a different implementation that may have
  -- extra security logic beyond the reviewed Phase 3 functions.
  IF position('Outside configured property geofence' in
      pg_get_functiondef('public.vp_field_checkin(bigint,double precision,double precision,numeric)'::regprocedure))=0
     OR position('Outside configured property geofence' in
      pg_get_functiondef('public.vp_field_checkout(bigint,double precision,double precision,numeric)'::regprocedure))=0 THEN
    RAISE EXCEPTION 'Unexpected live check-in/out definitions: inspect before applying patch';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.vp_field_checkin(
  p_visit_id bigint,p_lat double precision,p_lng double precision,p_accuracy_m numeric)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v public.vp_site_visits%ROWTYPE; v_distance numeric; v_ok boolean:=false; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Check In/Out') THEN
    RAISE EXCEPTION 'Field check-in permission required'; END IF;
  IF p_lat IS NULL OR p_lng IS NULL OR p_lat NOT BETWEEN -90 AND 90
    OR p_lng NOT BETWEEN -180 AND 180 OR p_accuracy_m IS NULL
    OR p_accuracy_m<=0 OR p_accuracy_m>100000 THEN RAISE EXCEPTION 'Valid GPS position and accuracy required'; END IF;
  SELECT * INTO v FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
  IF NOT FOUND OR v.status<>'Scheduled' THEN RAISE EXCEPTION 'Visit is not scheduled'; END IF;
  IF v.assigned_user_id<>v_actor THEN RAISE EXCEPTION 'Only the assigned officer can check in'; END IF;
  -- Geofence is disabled. A stored property pin is used only to calculate
  -- an optional audit distance; it never blocks check-in or check-out.
  IF v.target_lat IS NOT NULL AND v.target_lng IS NOT NULL THEN
    v_distance:=public.vp_field_distance_m(v.target_lat,v.target_lng,p_lat,p_lng);
  END IF;
  -- No location verification is asserted because no geofence is enforced.
  v_ok:=false;
  UPDATE public.vp_site_visits SET status='On site',checkin_at=now(),
    checkin_lat=p_lat,checkin_lng=p_lng,checkin_accuracy_m=p_accuracy_m,
    checkin_distance_m=v_distance,checkin_verified=v_ok,updated_at=now()
    WHERE id=v.id AND org_id=v_org;
  SELECT login INTO v_login FROM public.users WHERE id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,v.num,v_login,'Site check-in (#'||v.id||') — GPS captured; reported accuracy '||p_accuracy_m||' m; geofence disabled');
  RETURN jsonb_build_object('verified',false,'distance_m',v_distance,
    'accuracy_m',p_accuracy_m,'geofence_enforced',false);
END; $$;

CREATE OR REPLACE FUNCTION public.vp_field_checkout(
  p_visit_id bigint,p_lat double precision,p_lng double precision,p_accuracy_m numeric)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v public.vp_site_visits%ROWTYPE; v_distance numeric; v_ok boolean:=false;
 v_photos bigint; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Check In/Out') THEN
    RAISE EXCEPTION 'Field check-out permission required'; END IF;
  IF p_lat IS NULL OR p_lng IS NULL OR p_lat NOT BETWEEN -90 AND 90
    OR p_lng NOT BETWEEN -180 AND 180 OR p_accuracy_m IS NULL
    OR p_accuracy_m<=0 OR p_accuracy_m>100000 THEN RAISE EXCEPTION 'Valid GPS position and accuracy required'; END IF;
  SELECT * INTO v FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
  IF NOT FOUND OR v.status<>'On site' THEN RAISE EXCEPTION 'Visit has not checked in'; END IF;
  IF v.assigned_user_id<>v_actor THEN RAISE EXCEPTION 'Only assigned officer can check out'; END IF;
  SELECT count(*) INTO v_photos FROM public.vp_visit_photos WHERE org_id=v_org AND visit_id=v.id;
  IF v_photos<v.min_photos THEN
    RAISE EXCEPTION 'At least % registered site photographs required (% currently)',v.min_photos,v_photos;
  END IF;
  -- Geofence is disabled. A stored property pin is used only to calculate
  -- an optional audit distance; it never blocks check-in or check-out.
  IF v.target_lat IS NOT NULL AND v.target_lng IS NOT NULL THEN
    v_distance:=public.vp_field_distance_m(v.target_lat,v.target_lng,p_lat,p_lng);
  END IF;
  -- No location verification is asserted because no geofence is enforced.
  v_ok:=false;
  UPDATE public.vp_site_visits SET status='Completed',checkout_at=now(),checkout_lat=p_lat,
    checkout_lng=p_lng,checkout_accuracy_m=p_accuracy_m,
    checkout_distance_m=v_distance,checkout_verified=v_ok,updated_at=now()
    WHERE org_id=v_org AND id=v.id;
  UPDATE public.cases SET stage=CASE WHEN stage IN ('Visit scheduled','Assigned','Visit done')
      THEN 'Visit done' ELSE stage END,
    meta=CASE WHEN meta->>'ui_stage'='Field Visit'
      THEN jsonb_set(coalesce(meta,'{}'::jsonb),'{ui_stage}','"Field QC"'::jsonb,true)
      ELSE meta END
    WHERE org_id=v_org AND num=v.num;
  SELECT login INTO v_login FROM public.users WHERE id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v.num,v_login,
    'Visit completed (#'||v.id||'); photographs: '||v_photos||
      '; GPS captured; reported accuracy '||p_accuracy_m||' m; geofence disabled');
  RETURN jsonb_build_object('verified',false,'photos',v_photos,
    'distance_m',v_distance,'accuracy_m',p_accuracy_m,'geofence_enforced',false);
END; $$;

-- Match the original security model; do not grant access to anon or PUBLIC.
REVOKE ALL ON FUNCTION public.vp_field_checkin(bigint,double precision,double precision,numeric)
  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.vp_field_checkout(bigint,double precision,double precision,numeric)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vp_field_checkin(bigint,double precision,double precision,numeric)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.vp_field_checkout(bigint,double precision,double precision,numeric)
  TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
