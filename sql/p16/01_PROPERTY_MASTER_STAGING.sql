-- P16: additive, transactional, staging first. Run once only. No legacy table changes.
BEGIN;
DO $$
BEGIN
 IF to_regprocedure('public.vp_current_org_id()') IS NULL OR to_regprocedure('public.vp_field_my_user_id()') IS NULL OR to_regprocedure('public.vp_sec_can(text)') IS NULL OR to_regprocedure('public.vp_sec_case_visible(bigint)') IS NULL THEN RAISE EXCEPTION 'P16 requires P10 identity and RBAC helpers'; END IF;
 IF EXISTS (SELECT 1 FROM (VALUES ('orgs','id','bigint'),('users','id','bigint'),('users','org_id','bigint'),('cases','org_id','bigint'),('cases','num','integer')) e(t,c,typ) WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns i WHERE i.table_schema='public' AND i.table_name=e.t AND i.column_name=e.c AND i.data_type=e.typ)) THEN RAISE EXCEPTION 'P16 requires original BIGINT agency schema'; END IF;
END $$;
CREATE TABLE public.vp_property_master (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 org_id bigint NOT NULL REFERENCES public.orgs(id),
 current_revision integer NOT NULL CHECK (current_revision>0),
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object'),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(org_id,id)
);
CREATE TABLE public.vp_property_revisions (
 org_id bigint NOT NULL, property_id bigint NOT NULL, revision integer NOT NULL CHECK(revision>0),
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object'), reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 1 AND 1000),
 recorded_by bigint NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,property_id,revision),
 FOREIGN KEY(org_id,property_id) REFERENCES public.vp_property_master(org_id,id),
 FOREIGN KEY(org_id,recorded_by) REFERENCES public.users(org_id,id)
);
CREATE TABLE public.vp_property_case_links (
 org_id bigint NOT NULL, num integer NOT NULL, link_version integer NOT NULL CHECK(link_version>0),
 property_id bigint NOT NULL, property_revision integer NOT NULL,
 reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 1 AND 1000),
 linked_by bigint NOT NULL, linked_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,num,link_version),
 FOREIGN KEY(org_id,num) REFERENCES public.cases(org_id,num),
 FOREIGN KEY(org_id,property_id,property_revision) REFERENCES public.vp_property_revisions(org_id,property_id,revision),
 FOREIGN KEY(org_id,linked_by) REFERENCES public.users(org_id,id)
);
CREATE INDEX vp_p16_master_org_idx ON public.vp_property_master(org_id,id DESC);
CREATE INDEX vp_p16_link_property_idx ON public.vp_property_case_links(org_id,property_id,num,link_version DESC);
-- Current property association; PostgreSQL 15+ security-invoker view inherits table RLS.
CREATE VIEW public.vp_property_current_links WITH (security_invoker=true) AS
 SELECT DISTINCT ON(org_id,num) org_id,num,link_version,property_id,property_revision,reason,linked_by,linked_at
 FROM public.vp_property_case_links ORDER BY org_id,num,link_version DESC;
ALTER TABLE public.vp_property_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_property_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_property_case_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p16_master_read ON public.vp_property_master FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')));
CREATE POLICY vp_p16_revision_read ON public.vp_property_revisions FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')));
CREATE POLICY vp_p16_link_read ON public.vp_property_case_links FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')) AND public.vp_sec_case_visible(num));
REVOKE ALL ON public.vp_property_master,public.vp_property_revisions,public.vp_property_case_links,public.vp_property_current_links FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_property_master,public.vp_property_revisions,public.vp_property_case_links,public.vp_property_current_links TO authenticated;
-- Validate the canonical snapshot at the database boundary, not merely in React.
CREATE FUNCTION public.vp_p16_validate(p_data jsonb) RETURNS void LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE k text; item jsonb; group_name text; numeric_key text; n numeric; coord text;
BEGIN
 IF p_data IS NULL OR jsonb_typeof(p_data)<>'object' OR octet_length(p_data::text)>200000 THEN RAISE EXCEPTION 'Invalid property payload'; END IF;
 IF (p_data->>'category') IS NULL OR (p_data->>'category') NOT IN ('Land','House','Flat','Commercial','Industrial','Agricultural','Other') THEN RAISE EXCEPTION 'Invalid property category'; END IF;
 FOREACH k IN ARRAY ARRAY['label','address','state','district','mandal','village','pincode','municipality','landmark','road_access','notes','flat_no','building_name','east_deed','west_deed','north_deed','south_deed','east_actual','west_actual','north_actual','south_actual'] LOOP
  IF jsonb_typeof(p_data->k) IS DISTINCT FROM 'string' OR length(p_data->>k)>4000 THEN RAISE EXCEPTION 'Invalid field: %',k; END IF;
 END LOOP;
 IF length(trim(p_data->>'label')) NOT BETWEEN 1 AND 200 OR length(trim(p_data->>'address')) NOT BETWEEN 1 AND 2000 OR length(trim(p_data->>'state'))=0 OR length(trim(p_data->>'district'))=0 THEN RAISE EXCEPTION 'Name, address, state and district required'; END IF;
 IF (p_data->>'pincode')<>'' AND (p_data->>'pincode') !~ '^[1-9][0-9]{5}$' THEN RAISE EXCEPTION 'Invalid PIN code'; END IF;
 FOREACH coord IN ARRAY ARRAY['latitude','longitude'] LOOP
  IF jsonb_typeof(p_data->coord) IS DISTINCT FROM 'null' THEN
   IF jsonb_typeof(p_data->coord) IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Invalid coordinate'; END IF;
   n:=(p_data->>coord)::numeric;
   IF abs(n)>(CASE WHEN coord='latitude' THEN 90 ELSE 180 END) THEN RAISE EXCEPTION 'Coordinate out of range'; END IF;
  END IF;
 END LOOP;
 IF ((p_data->>'latitude') IS NULL) <> ((p_data->>'longitude') IS NULL) THEN RAISE EXCEPTION 'Enter both coordinates or neither'; END IF;
 FOREACH group_name IN ARRAY ARRAY['parcels','owners','documents'] LOOP
  IF jsonb_typeof(p_data->group_name) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Missing array: %',group_name; END IF;
  IF jsonb_array_length(p_data->group_name)>100 THEN RAISE EXCEPTION 'Too many entries: %',group_name; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(p_data->group_name) LOOP
   IF jsonb_typeof(item)<>'object' THEN RAISE EXCEPTION 'Invalid entry: %',group_name; END IF;
   IF group_name='parcels' THEN
    FOREACH k IN ARRAY ARRAY['survey_no','plot_no','deed_unit','actual_unit','notes'] LOOP
     IF jsonb_typeof(item->k) IS DISTINCT FROM 'string' OR length(item->>k)>1000 THEN RAISE EXCEPTION 'Invalid parcel field: %',k; END IF;
    END LOOP;
    IF trim(item->>'survey_no')='' AND trim(item->>'plot_no')='' THEN RAISE EXCEPTION 'Enter parcel survey or plot number'; END IF;
    FOREACH numeric_key IN ARRAY ARRAY['deed_area','actual_area'] LOOP
     IF jsonb_typeof(item->numeric_key) IS DISTINCT FROM 'null' THEN
      IF jsonb_typeof(item->numeric_key) IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Invalid parcel area'; END IF;
      n:=(item->>numeric_key)::numeric; IF n<=0 OR n>1000000000000 THEN RAISE EXCEPTION 'Parcel area must be positive'; END IF;
     END IF;
    END LOOP;
    IF (item->>'deed_unit') NOT IN ('sqyd','sqft','sqm','acre','gunta','cent','hectare') OR (item->>'actual_unit') NOT IN ('sqyd','sqft','sqm','acre','gunta','cent','hectare') THEN RAISE EXCEPTION 'Invalid area unit'; END IF;
   ELSIF group_name='owners' THEN
    FOREACH k IN ARRAY ARRAY['name','interest','from_date','to_date','evidence'] LOOP
     IF jsonb_typeof(item->k) IS DISTINCT FROM 'string' OR length(item->>k)>1000 THEN RAISE EXCEPTION 'Invalid ownership field: %',k; END IF;
    END LOOP;
    IF trim(item->>'name')='' THEN RAISE EXCEPTION 'Owner name required'; END IF;
    IF jsonb_typeof(item->'share_pct') IS DISTINCT FROM 'null' THEN
     IF jsonb_typeof(item->'share_pct') IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Invalid ownership share'; END IF;
     n:=(item->>'share_pct')::numeric; IF n<0 OR n>100 THEN RAISE EXCEPTION 'Share outside 0–100'; END IF;
    END IF;
    FOREACH k IN ARRAY ARRAY['from_date','to_date'] LOOP
     IF item->>k<>'' THEN IF (item->>k)!~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Invalid ownership date'; END IF; PERFORM (item->>k)::date; END IF;
    END LOOP;
    IF item->>'from_date'<>'' AND item->>'to_date'<>'' AND (item->>'to_date')::date<(item->>'from_date')::date THEN RAISE EXCEPTION 'Ownership end precedes start'; END IF;
   ELSE
    FOREACH k IN ARRAY ARRAY['kind','reference','date','sro','notes'] LOOP
     IF jsonb_typeof(item->k) IS DISTINCT FROM 'string' OR length(item->>k)>1000 THEN RAISE EXCEPTION 'Invalid document field: %',k; END IF;
    END LOOP;
    IF trim(item->>'kind')='' OR trim(item->>'reference')='' THEN RAISE EXCEPTION 'Document type and reference required'; END IF;
    IF item->>'date'<>'' THEN IF (item->>'date')!~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Invalid document date'; END IF; PERFORM (item->>'date')::date; END IF;
   END IF;
  END LOOP;
 END LOOP;
END $$;
CREATE FUNCTION public.vp_p16_save_property(p_property_id bigint,p_expected_revision integer,p_data jsonb,p_reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); pid bigint; rev integer;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can(CASE WHEN p_property_id IS NULL THEN 'cases.Create' ELSE 'cases.Edit' END),false) THEN RAISE EXCEPTION 'Property permission denied' USING ERRCODE='42501'; END IF;
 IF p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Record a reason'; END IF;
 PERFORM public.vp_p16_validate(p_data);
 IF p_property_id IS NULL THEN
  IF p_expected_revision IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'Invalid new revision'; END IF;
  rev:=1; INSERT INTO public.vp_property_master(org_id,current_revision,data) VALUES(o,rev,p_data) RETURNING id INTO pid;
 ELSE
  SELECT id,current_revision INTO pid,rev FROM public.vp_property_master WHERE org_id=o AND id=p_property_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Property not found' USING ERRCODE='42501'; END IF;
  IF p_expected_revision IS DISTINCT FROM rev THEN RAISE EXCEPTION 'Property changed; reload before editing' USING ERRCODE='40001'; END IF;
  rev:=rev+1; UPDATE public.vp_property_master SET current_revision=rev,data=p_data,updated_at=now() WHERE org_id=o AND id=pid;
 END IF;
 INSERT INTO public.vp_property_revisions(org_id,property_id,revision,data,reason,recorded_by) VALUES(o,pid,rev,p_data,trim(p_reason),u);
 RETURN pid::text;
END $$;
CREATE FUNCTION public.vp_p16_link_case(p_case_num integer,p_property_id bigint,p_property_revision integer,p_expected_link_version integer,p_reason text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); rev integer; prev integer;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can('cases.Edit'),false) OR NOT coalesce(public.vp_sec_case_visible(p_case_num),false) THEN RAISE EXCEPTION 'Case link permission denied' USING ERRCODE='42501'; END IF;
 IF p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Record association reason'; END IF;
 PERFORM 1 FROM public.cases WHERE org_id=o AND num=p_case_num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case not found' USING ERRCODE='42501'; END IF;
 SELECT current_revision INTO rev FROM public.vp_property_master WHERE org_id=o AND id=p_property_id FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Property not found' USING ERRCODE='42501'; END IF;
 IF p_property_revision IS DISTINCT FROM rev THEN RAISE EXCEPTION 'Property revised; reload before linking' USING ERRCODE='40001'; END IF;
 SELECT coalesce(max(link_version),0) INTO prev FROM public.vp_property_case_links WHERE org_id=o AND num=p_case_num;
 IF p_expected_link_version IS DISTINCT FROM prev THEN RAISE EXCEPTION 'Case association changed; reload' USING ERRCODE='40001'; END IF;
 INSERT INTO public.vp_property_case_links(org_id,num,link_version,property_id,property_revision,reason,linked_by) VALUES(o,p_case_num,prev+1,p_property_id,rev,trim(p_reason),u);
 RETURN prev+1;
END $$;
REVOKE ALL ON FUNCTION public.vp_p16_validate(jsonb),public.vp_p16_save_property(bigint,integer,jsonb,text),public.vp_p16_link_case(integer,bigint,integer,integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p16_save_property(bigint,integer,jsonb,text),public.vp_p16_link_case(integer,bigint,integer,integer,text) TO authenticated;
COMMIT;
