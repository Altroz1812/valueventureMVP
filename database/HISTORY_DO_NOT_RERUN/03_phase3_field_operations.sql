-- ValuationPro | Phase 3 | Field Operations | BIGINT multi-tenant
-- Requires successful Phase 1 and Phase 2 deployment in SAME Supabase database.
-- Non-destructive: no existing table/column/constraint/workflow label altered.
-- Run under postgres in Supabase SQL Editor after backup. All operations are transactional.
BEGIN;
DO $$ BEGIN
  IF to_regclass('public.vp_branches') IS NULL
     OR to_regclass('public.valuation_auth_links') IS NULL
     OR to_regprocedure('public.vp_current_org_id()') IS NULL
     OR to_regprocedure('public.vp_is_admin(bigint)') IS NULL
     OR to_regprocedure('public.vp_case_assign(integer,bigint)') IS NULL
     OR to_regclass('public.trips') IS NULL OR to_regclass('public.expenses') IS NULL
     OR to_regclass('storage.objects') IS NULL THEN
    RAISE EXCEPTION 'Phase 1 and Phase 2 must be installed and verified first';
  END IF;
END $$;

-- Actual visit record, distinct from existing trips (daily mileage aggregates).
CREATE TABLE IF NOT EXISTS public.vp_site_visits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL REFERENCES public.orgs(id),
  num integer NOT NULL,
  assigned_user_id bigint NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Scheduled'
    CHECK(status IN ('Scheduled','On site','Completed','Cancelled')),
  min_photos integer NOT NULL CHECK (min_photos BETWEEN 1 AND 100),
  target_lat double precision,
  target_lng double precision,
  radius_m numeric,
  max_accuracy_m numeric,
  checkin_at timestamptz,
  checkin_lat double precision,
  checkin_lng double precision,
  checkin_accuracy_m numeric,
  checkin_distance_m numeric,
  checkin_verified boolean,
  checkout_at timestamptz,
  checkout_lat double precision,
  checkout_lng double precision,
  checkout_accuracy_m numeric,
  checkout_distance_m numeric,
  checkout_verified boolean,
  created_by bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id,id),
  FOREIGN KEY(org_id,num) REFERENCES public.cases(org_id,num),
  FOREIGN KEY(org_id,assigned_user_id) REFERENCES public.users(org_id,id),
  FOREIGN KEY(org_id,created_by) REFERENCES public.users(org_id,id),
  CONSTRAINT vp_visit_coordinates_valid CHECK (
    (target_lat IS NULL AND target_lng IS NULL AND radius_m IS NULL AND max_accuracy_m IS NULL)
    OR (target_lat BETWEEN -90 AND 90 AND target_lng BETWEEN -180 AND 180
      AND radius_m BETWEEN 1 AND 100000 AND max_accuracy_m BETWEEN 1 AND 10000)
  ),
  CONSTRAINT vp_visit_checkin_pair CHECK ((checkin_at IS NULL) = (checkin_lat IS NULL)),
  CONSTRAINT vp_visit_checkout_pair CHECK ((checkout_at IS NULL) = (checkout_lat IS NULL))
);
CREATE INDEX IF NOT EXISTS vp_site_visits_org_schedule_idx
  ON public.vp_site_visits(org_id,scheduled_at DESC);
CREATE INDEX IF NOT EXISTS vp_site_visits_org_case_idx ON public.vp_site_visits(org_id,num);
CREATE INDEX IF NOT EXISTS vp_site_visits_assignee_idx ON public.vp_site_visits(org_id,assigned_user_id,status);

-- Private photographic evidence; existing documents and storage bucket remain intact.
CREATE TABLE IF NOT EXISTS public.vp_visit_photos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  visit_id bigint NOT NULL,
  storage_path text NOT NULL,
  name text NOT NULL,
  mime text NOT NULL CHECK(mime IN ('image/jpeg','image/png','image/webp')),
  size integer NOT NULL CHECK(size BETWEEN 1 AND 10485760),
  uploaded_by bigint NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(org_id,visit_id) REFERENCES public.vp_site_visits(org_id,id) ON DELETE CASCADE,
  FOREIGN KEY(org_id,uploaded_by) REFERENCES public.users(org_id,id),
  UNIQUE(org_id,storage_path)
);
CREATE INDEX IF NOT EXISTS vp_visit_photos_visit_idx ON public.vp_visit_photos(org_id,visit_id);

-- Links existing public.expenses rows to visits (no second expense ledger).
CREATE TABLE IF NOT EXISTS public.vp_visit_expense_links (
  expense_id bigint PRIMARY KEY REFERENCES public.expenses(id) ON DELETE CASCADE,
  org_id bigint NOT NULL,
  visit_id bigint NOT NULL,
  FOREIGN KEY(org_id,visit_id) REFERENCES public.vp_site_visits(org_id,id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS vp_visit_expense_links_idx ON public.vp_visit_expense_links(org_id,visit_id);

-- Source entries backing existing trips.org_id/user_id/day daily totals.
-- One distance claim per visit prevents duplicate additions on retries.
CREATE TABLE IF NOT EXISTS public.vp_visit_travel (
  visit_id bigint PRIMARY KEY,
  org_id bigint NOT NULL,
  user_id bigint NOT NULL,
  day date NOT NULL,
  km numeric NOT NULL CHECK(km > 0 AND km <= 2000),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(org_id,visit_id) REFERENCES public.vp_site_visits(org_id,id) ON DELETE CASCADE,
  FOREIGN KEY(org_id,user_id) REFERENCES public.users(org_id,id)
);

ALTER TABLE public.vp_site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_visit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_visit_expense_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_visit_travel ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vp_site_visits, public.vp_visit_photos,
  public.vp_visit_expense_links, public.vp_visit_travel FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_site_visits, public.vp_visit_photos,
  public.vp_visit_expense_links, public.vp_visit_travel TO authenticated;
GRANT ALL ON public.vp_site_visits, public.vp_visit_photos,
  public.vp_visit_expense_links, public.vp_visit_travel TO service_role;

CREATE OR REPLACE FUNCTION public.vp_field_my_user_id()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT u.id FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id
    JOIN public.orgs o ON o.id=u.org_id
  WHERE l.auth_uid=(SELECT auth.uid()) AND u.active=true AND o.status='active'
  LIMIT 1;
$$;
CREATE OR REPLACE FUNCTION public.vp_field_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT p_action=ANY(ARRAY['View','Assign','Check In/Out','Manage Geofence'])
    AND EXISTS (
      SELECT 1 FROM public.valuation_auth_links l
      JOIN public.users u ON u.id=l.user_id
      JOIN public.orgs o ON o.id=u.org_id
      JOIN public.role_perms p ON p.org_id=u.org_id AND p.role=u.role
      WHERE l.auth_uid=(SELECT auth.uid()) AND u.active=true AND o.status='active'
      AND p.perm=ANY(ARRAY['tenant.admin','field.'||p_action])
    );
$$;
CREATE OR REPLACE FUNCTION public.vp_field_can_see_visit(p_visit_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vp_site_visits v
    WHERE v.id=p_visit_id AND v.org_id=public.vp_current_org_id()
      AND (v.assigned_user_id=public.vp_field_my_user_id() OR public.vp_field_can('View')
        OR public.vp_field_can('Assign'))
  );
$$;

DROP POLICY IF EXISTS vp_phase3_visits_read ON public.vp_site_visits;
CREATE POLICY vp_phase3_visits_read ON public.vp_site_visits FOR SELECT TO authenticated
  USING(org_id=(SELECT public.vp_current_org_id()) AND
    (assigned_user_id=(SELECT public.vp_field_my_user_id())
      OR (SELECT public.vp_field_can('View')) OR (SELECT public.vp_field_can('Assign'))));
DROP POLICY IF EXISTS vp_phase3_photos_read ON public.vp_visit_photos;
CREATE POLICY vp_phase3_photos_read ON public.vp_visit_photos FOR SELECT TO authenticated
  USING(org_id=(SELECT public.vp_current_org_id()) AND public.vp_field_can_see_visit(visit_id));
DROP POLICY IF EXISTS vp_phase3_expense_links_read ON public.vp_visit_expense_links;
CREATE POLICY vp_phase3_expense_links_read ON public.vp_visit_expense_links FOR SELECT TO authenticated
  USING(org_id=(SELECT public.vp_current_org_id()) AND public.vp_field_can_see_visit(visit_id));
DROP POLICY IF EXISTS vp_phase3_travel_read ON public.vp_visit_travel;
CREATE POLICY vp_phase3_travel_read ON public.vp_visit_travel FOR SELECT TO authenticated
  USING(org_id=(SELECT public.vp_current_org_id()) AND public.vp_field_can_see_visit(visit_id));

-- Geographic distance in meters. GPS coordinates are claimed by browser/device,
-- not independently authenticated; retain original observations for review.
CREATE OR REPLACE FUNCTION public.vp_field_distance_m(
  lat1 double precision,lng1 double precision,lat2 double precision,lng2 double precision)
RETURNS numeric LANGUAGE sql IMMUTABLE SECURITY INVOKER SET search_path='' AS $$
  SELECT (6371000.0*acos(least(1.0,greatest(-1.0,
   sin(radians(lat1))*sin(radians(lat2))+
   cos(radians(lat1))*cos(radians(lat2))*cos(radians(lng2-lng1))))))::numeric;
$$;

-- Schedule or reschedule, only before check-in; exact same case/tenant/assignee verified.
-- Location config is optional; absent config is explicitly NOT geofence-verified.
CREATE OR REPLACE FUNCTION public.vp_field_schedule(
  p_visit_id bigint, p_case_num integer,p_assigned_user_id bigint,
  p_scheduled_at timestamptz,p_min_photos integer,
  p_target_lat double precision DEFAULT NULL,p_target_lng double precision DEFAULT NULL,
  p_radius_m numeric DEFAULT NULL,p_max_accuracy_m numeric DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v_id bigint; v_login text; v_case public.cases%ROWTYPE; v_prior public.vp_site_visits%ROWTYPE;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Assign') THEN
    RAISE EXCEPTION 'Field scheduling permission required'; END IF;
  IF p_scheduled_at IS NULL OR p_min_photos IS NULL OR p_min_photos NOT BETWEEN 1 AND 100 THEN
    RAISE EXCEPTION 'Schedule and required photo count (1–100) are mandatory'; END IF;
  IF NOT ((p_target_lat IS NULL AND p_target_lng IS NULL AND p_radius_m IS NULL AND p_max_accuracy_m IS NULL)
    OR (p_target_lat BETWEEN -90 AND 90 AND p_target_lng BETWEEN -180 AND 180
      AND p_radius_m BETWEEN 1 AND 100000 AND p_max_accuracy_m BETWEEN 1 AND 10000)) THEN
    RAISE EXCEPTION 'Provide all property pin/geofence fields, or leave all blank'; END IF;
  SELECT * INTO v_case FROM public.cases WHERE org_id=v_org AND num=p_case_num FOR UPDATE;
  IF NOT FOUND OR v_case.stage IN ('Approved','Submitted','Invoiced') THEN
    RAISE EXCEPTION 'Case missing or not eligible for a visit'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.users
    WHERE org_id=v_org AND id=p_assigned_user_id AND active=true) THEN
    RAISE EXCEPTION 'Choose an active officer from your agency'; END IF;
  -- Geofence configuration is a separately permissioned responsibility.
  -- Dispatchers may reschedule without being able to alter a verified property pin.
  IF p_visit_id IS NULL AND p_target_lat IS NOT NULL
    AND NOT public.vp_field_can('Manage Geofence') THEN
    RAISE EXCEPTION 'Manage Geofence permission required to set a property pin';
  END IF;
  IF p_visit_id IS NOT NULL THEN
    SELECT * INTO v_prior FROM public.vp_site_visits
      WHERE org_id=v_org AND id=p_visit_id AND num=p_case_num FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Visit not found in your organization'; END IF;
    IF (p_target_lat IS DISTINCT FROM v_prior.target_lat
        OR p_target_lng IS DISTINCT FROM v_prior.target_lng
        OR p_radius_m IS DISTINCT FROM v_prior.radius_m
        OR p_max_accuracy_m IS DISTINCT FROM v_prior.max_accuracy_m)
      AND NOT public.vp_field_can('Manage Geofence') THEN
      RAISE EXCEPTION 'Manage Geofence permission required to change the property pin';
    END IF;
  END IF;
  IF p_visit_id IS NULL THEN
    INSERT INTO public.vp_site_visits(org_id,num,assigned_user_id,scheduled_at,min_photos,
      target_lat,target_lng,radius_m,max_accuracy_m,created_by)
    VALUES(v_org,p_case_num,p_assigned_user_id,p_scheduled_at,p_min_photos,
      p_target_lat,p_target_lng,p_radius_m,p_max_accuracy_m,v_actor)
    RETURNING id INTO v_id;
  ELSE
    UPDATE public.vp_site_visits SET assigned_user_id=p_assigned_user_id,
      scheduled_at=p_scheduled_at,min_photos=p_min_photos,target_lat=p_target_lat,
      target_lng=p_target_lng,radius_m=p_radius_m,max_accuracy_m=p_max_accuracy_m,
      updated_at=now()
    WHERE org_id=v_org AND id=p_visit_id AND num=p_case_num AND status='Scheduled'
    RETURNING id INTO v_id;
    IF v_id IS NULL THEN RAISE EXCEPTION 'Only a scheduled visit may be rescheduled'; END IF;
  END IF;
  IF v_case.stage IN ('Received','Assigned') THEN
    UPDATE public.cases SET stage='Visit scheduled' WHERE org_id=v_org AND num=p_case_num;
  END IF;
  SELECT login INTO v_login FROM public.users WHERE id=v_actor AND org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,p_case_num,v_login,
      CASE WHEN p_visit_id IS NULL THEN 'Visit scheduled' ELSE 'Visit rescheduled' END
        ||' (#'||v_id::text||')');
  RETURN v_id::text;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_field_cancel(p_visit_id bigint)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_num integer; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Assign') THEN RAISE EXCEPTION 'Field scheduling permission required'; END IF;
  UPDATE public.vp_site_visits SET status='Cancelled',updated_at=now()
    WHERE org_id=v_org AND id=p_visit_id AND status='Scheduled' RETURNING num INTO v_num;
  IF v_num IS NULL THEN RAISE EXCEPTION 'Only scheduled visits can be cancelled'; END IF;
  -- Do not leave the database case falsely marked Visit scheduled if none remain.
  IF NOT EXISTS (SELECT 1 FROM public.vp_site_visits
       WHERE org_id=v_org AND num=v_num AND status IN ('Scheduled','On site')) THEN
    UPDATE public.cases SET stage=CASE
        WHEN nullif(btrim(coalesce(team,'')),'') IS NULL THEN 'Received'
        ELSE 'Assigned' END
      WHERE org_id=v_org AND num=v_num AND stage='Visit scheduled';
  END IF;
  SELECT login INTO v_login FROM public.users WHERE id=public.vp_field_my_user_id();
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v_num,v_login,'Visit cancelled (#'||p_visit_id||')');
END; $$;

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
  IF v.target_lat IS NOT NULL THEN
    v_distance:=public.vp_field_distance_m(v.target_lat,v.target_lng,p_lat,p_lng);
    IF v_distance>v.radius_m THEN RAISE EXCEPTION 'Outside configured property geofence (% m, limit % m)',round(v_distance),v.radius_m; END IF;
    IF p_accuracy_m>v.max_accuracy_m THEN
      RAISE EXCEPTION 'GPS accuracy too low (% m, limit % m)',p_accuracy_m,v.max_accuracy_m; END IF;
    v_ok:=true;
  END IF;
  UPDATE public.vp_site_visits SET status='On site',checkin_at=now(),
    checkin_lat=p_lat,checkin_lng=p_lng,checkin_accuracy_m=p_accuracy_m,
    checkin_distance_m=v_distance,checkin_verified=v_ok,updated_at=now()
    WHERE id=v.id AND org_id=v_org;
  SELECT login INTO v_login FROM public.users WHERE id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,v.num,v_login,'Site check-in (#'||v.id||') — geofence '||
      CASE WHEN v_ok THEN 'verified' ELSE 'not configured / unverified' END);
  RETURN jsonb_build_object('verified',v_ok,'distance_m',v_distance);
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
  IF v.target_lat IS NOT NULL THEN
    v_distance:=public.vp_field_distance_m(v.target_lat,v.target_lng,p_lat,p_lng);
    IF v_distance>v.radius_m THEN RAISE EXCEPTION 'Outside configured property geofence (% m, limit % m)',round(v_distance),v.radius_m; END IF;
    IF p_accuracy_m>v.max_accuracy_m THEN
      RAISE EXCEPTION 'GPS accuracy too low (% m, limit % m)',p_accuracy_m,v.max_accuracy_m; END IF;
    v_ok:=true;
  END IF;
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
    'Visit completed (#'||v.id||'); photographs: '||v_photos||'; geofence '||
      CASE WHEN v_ok THEN 'verified' ELSE 'unverified' END);
  RETURN jsonb_build_object('verified',v_ok,'photos',v_photos,'distance_m',v_distance);
END; $$;

-- Self-declared travel distance; once per visit, atomically added to existing daily trips.
CREATE OR REPLACE FUNCTION public.vp_field_record_travel(
  p_visit_id bigint,p_day date,p_km numeric)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v public.vp_site_visits%ROWTYPE; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Check In/Out') THEN RAISE EXCEPTION 'Field permission required'; END IF;
  IF p_day IS NULL OR p_day>CURRENT_DATE OR p_km IS NULL OR p_km<=0 OR p_km>2000 THEN
    RAISE EXCEPTION 'Valid past/today travel date and kilometres required'; END IF;
  SELECT * INTO v FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
  IF NOT FOUND OR v.assigned_user_id<>v_actor OR v.status NOT IN ('On site','Completed') THEN
    RAISE EXCEPTION 'Travel can only be reported by assigned officer after check-in'; END IF;
  INSERT INTO public.vp_visit_travel(visit_id,org_id,user_id,day,km)
    VALUES(v.id,v_org,v_actor,p_day,p_km);
  INSERT INTO public.trips(org_id,user_id,day,km) VALUES(v_org,v_actor,p_day,p_km)
    ON CONFLICT(org_id,user_id,day) DO UPDATE SET km=public.trips.km+EXCLUDED.km;
  SELECT login INTO v_login FROM public.users WHERE id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v.num,v_login,
    'Travel logged (#'||v.id||'): '||p_km||' km');
END; $$;

-- Existing expenses remains the financial source of truth; only a link is added.
CREATE OR REPLACE FUNCTION public.vp_field_add_expense(
  p_visit_id bigint,p_day date,p_category text,p_amount numeric)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v public.vp_site_visits%ROWTYPE; v_expense_id bigint; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Check In/Out') THEN RAISE EXCEPTION 'Field permission required'; END IF;
  IF p_day IS NULL OR p_day>CURRENT_DATE OR p_category NOT IN ('Petrol','Food','Toll','Parking','Other')
    OR p_amount IS NULL OR p_amount<=0 THEN RAISE EXCEPTION 'Invalid expense date, category or amount'; END IF;
  SELECT * INTO v FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id;
  IF NOT FOUND OR v.assigned_user_id<>v_actor OR v.status NOT IN ('On site','Completed') THEN
    RAISE EXCEPTION 'Expenses must be submitted by assigned officer after check-in'; END IF;
  INSERT INTO public.expenses(org_id,user_id,day,cat,amt)
    VALUES(v_org,v_actor,p_day,p_category,p_amount) RETURNING id INTO v_expense_id;
  INSERT INTO public.vp_visit_expense_links(expense_id,org_id,visit_id)
    VALUES(v_expense_id,v_org,p_visit_id);
  SELECT login INTO v_login FROM public.users WHERE id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v.num,v_login,
    'Expense logged (#'||v.id||'): '||p_category||' INR '||p_amount);
  RETURN v_expense_id::text;
END; $$;

-- Private photos stored separately from case-document bucket, with strict path validation.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('vp-field-evidence','vp-field-evidence',false,10485760,
  ARRAY['image/jpeg','image/png','image/webp']::text[])
ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM storage.buckets WHERE id='vp-field-evidence'
    AND (public=true OR file_size_limit IS DISTINCT FROM 10485760)) THEN
    RAISE EXCEPTION 'Existing vp-field-evidence bucket configuration differs: inspect manually';
  END IF;
END $$;

DROP POLICY IF EXISTS vp_phase3_evidence_read ON storage.objects;
CREATE POLICY vp_phase3_evidence_read ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id='vp-field-evidence'
  AND split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
  AND EXISTS(SELECT 1 FROM public.vp_site_visits v
    WHERE v.org_id=(SELECT public.vp_current_org_id())
      AND v.num::text=split_part(name,'/',2)
      AND v.id::text=split_part(name,'/',3)
      AND public.vp_field_can_see_visit(v.id))
);
DROP POLICY IF EXISTS vp_phase3_evidence_insert ON storage.objects;
CREATE POLICY vp_phase3_evidence_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id='vp-field-evidence'
  AND split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
  AND array_length(storage.foldername(name),1)=3
  AND public.vp_field_can('Check In/Out')
  AND EXISTS(SELECT 1 FROM public.vp_site_visits v
    WHERE v.org_id=(SELECT public.vp_current_org_id())
      AND v.num::text=split_part(name,'/',2)
      AND v.id::text=split_part(name,'/',3)
      AND v.assigned_user_id=(SELECT public.vp_field_my_user_id())
      AND v.status='On site')
);

CREATE OR REPLACE FUNCTION public.vp_field_register_photo(
  p_visit_id bigint,p_path text,p_name text,p_mime text,p_size integer)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v public.vp_site_visits%ROWTYPE; v_id bigint; v_login text; v_meta jsonb;
BEGIN
  IF v_org IS NULL OR NOT public.vp_field_can('Check In/Out') THEN RAISE EXCEPTION 'Field permission required'; END IF;
  SELECT * INTO v FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
  IF NOT FOUND OR v.assigned_user_id<>v_actor OR v.status<>'On site' THEN
    RAISE EXCEPTION 'Only the assigned officer can add photographs after check-in'; END IF;
  IF p_path IS NULL OR p_path !~ ('^'||v_org::text||'/'||v.num::text||'/'||v.id::text||'/[0-9a-f-]{36}[.](jpg|png|webp)$')
    OR p_mime NOT IN('image/jpeg','image/png','image/webp')
    OR length(btrim(coalesce(p_name,''))) NOT BETWEEN 1 AND 250
    OR p_size IS NULL OR p_size NOT BETWEEN 1 AND 10485760 THEN
    RAISE EXCEPTION 'Invalid photo metadata or visit path'; END IF;
  SELECT metadata INTO v_meta FROM storage.objects WHERE bucket_id='vp-field-evidence' AND name=p_path;
  IF NOT FOUND THEN RAISE EXCEPTION 'Photo must be uploaded into the private bucket first'; END IF;
  IF v_meta->>'mimetype' IS DISTINCT FROM p_mime OR (v_meta->>'size')::bigint IS DISTINCT FROM p_size::bigint THEN
    RAISE EXCEPTION 'Photo MIME/size does not match stored object'; END IF;
  INSERT INTO public.vp_visit_photos(org_id,visit_id,storage_path,name,mime,size,uploaded_by)
    VALUES(v_org,v.id,p_path,btrim(p_name),p_mime,p_size,v_actor) RETURNING id INTO v_id;
  SELECT login INTO v_login FROM public.users WHERE id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v.num,v_login,
    'Site photograph uploaded (#'||v.id||'): '||left(btrim(p_name),100));
  RETURN v_id::text;
END; $$;

-- Secure all newly added SECURITY DEFINER calls. No browser direct writes.
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS signature FROM pg_proc p
    JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname=ANY(ARRAY[
      'vp_field_my_user_id','vp_field_can','vp_field_can_see_visit','vp_field_distance_m',
      'vp_field_schedule','vp_field_cancel','vp_field_checkin','vp_field_checkout',
      'vp_field_record_travel','vp_field_add_expense','vp_field_register_photo']) LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon',f.signature);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.signature);
  END LOOP;
END $$;
COMMIT;
