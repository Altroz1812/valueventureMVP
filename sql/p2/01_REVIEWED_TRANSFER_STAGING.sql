-- P2 Reviewed Inspection -> Valuation. ADDITIVE; does NOT replace core valuation/QC RPCs.
-- Run in STAGING after P0/P1 tests, backup and 00_PRECHECK_READONLY.sql.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.vp_field_inspections') IS NULL
 OR to_regclass('public.vp_site_visits') IS NULL
 OR to_regclass('public.cases') IS NULL
 OR to_regclass('public.users') IS NULL
 OR to_regclass('public.vp_qc_tasks') IS NULL
 OR to_regprocedure('public.vp_report_can(text)') IS NULL
 OR to_regprocedure('public.vp_current_org_id()') IS NULL
 OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
 OR to_regprocedure('public.vp_report_save_valuation(integer,jsonb,boolean)') IS NULL
 THEN RAISE EXCEPTION 'P2 preflight failed. Missing P0/P1 or Phase 5 objects'; END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.vp_p2_valuation_transfer_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 org_id bigint NOT NULL,
 num integer NOT NULL,
 visit_id bigint NOT NULL,
 actor_user_id bigint NOT NULL,
 source_updated_at timestamptz NOT NULL,
 selection jsonb NOT NULL CHECK(jsonb_typeof(selection)='object'),
 valuation_inputs jsonb NOT NULL CHECK(jsonb_typeof(valuation_inputs)='object'),
 submitted boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY (org_id,num) REFERENCES public.cases(org_id,num),
 FOREIGN KEY (org_id,visit_id) REFERENCES public.vp_site_visits(org_id,id),
 FOREIGN KEY (actor_user_id) REFERENCES public.users(id)
);
ALTER TABLE public.vp_p2_valuation_transfer_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.vp_p2_valuation_transfer_events FROM PUBLIC,anon,authenticated;
GRANT ALL ON TABLE public.vp_p2_valuation_transfer_events TO service_role;
CREATE INDEX IF NOT EXISTS vp_p2_transfer_case_idx ON public.vp_p2_valuation_transfer_events(org_id,num,created_at DESC);

-- Minimal data only: do not expose owner/contact/photo details to report preparation.
CREATE OR REPLACE FUNCTION public.vp_p2_valuer_inspection_for_case(p_case_num integer)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
 v_id bigint; v_revision timestamptz; v_submitted timestamptz; v_data jsonb;
BEGIN
 IF v_org IS NULL OR NOT (public.vp_report_can('View') OR public.vp_report_can('Edit')) THEN
   RAISE EXCEPTION 'Valuation report view permission required'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.cases c WHERE c.org_id=v_org AND c.num=p_case_num) THEN
   RAISE EXCEPTION 'Case not found in your organization'; END IF;
 SELECT i.visit_id,i.updated_at,i.submitted_at,i.data INTO v_id,v_revision,v_submitted,v_data
 FROM public.vp_field_inspections i
 JOIN public.vp_site_visits v ON v.org_id=i.org_id AND v.id=i.visit_id
 WHERE i.org_id=v_org AND v.num=p_case_num AND i.status='Submitted'
   AND v.status<>'Cancelled' AND EXISTS(
     SELECT 1 FROM public.vp_qc_tasks q WHERE q.org_id=v_org AND q.num=p_case_num
       AND q.review_stage='Field QC' AND q.status='Approved' AND q.decided_at>=i.submitted_at)
 ORDER BY i.submitted_at DESC NULLS LAST,i.updated_at DESC,i.visit_id DESC LIMIT 1;
 IF v_id IS NULL THEN RETURN NULL; END IF;
 RETURN jsonb_build_object('visit_id',v_id,'updated_at',v_revision,'submitted_at',v_submitted,
  'data',jsonb_build_object(
    'land_length',v_data->>'land_length','land_breadth',v_data->>'land_breadth',
    'land_dimensions_note',v_data->>'land_dimensions_note','measurement_unit',v_data->>'measurement_unit',
    'property_age',v_data->>'property_age',
    'floor_area_0',v_data->>'floor_area_0','floor_area_1',v_data->>'floor_area_1',
    'floor_area_2',v_data->>'floor_area_2','floor_area_3',v_data->>'floor_area_3',
    'floor_area_4',v_data->>'floor_area_4','floor_area_5',v_data->>'floor_area_5'));
END; $$;

-- In a single transaction: check source revision, validate math, call existing stage/RBAC-
-- guarded valuation RPC, and write an immutable provenance record. Client cannot bypass QC.
CREATE OR REPLACE FUNCTION public.vp_p2_save_reviewed_valuation(
 p_case_num integer,p_input jsonb,p_submit boolean,p_visit_id bigint,
 p_source_revision timestamptz,p_selection jsonb)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
 v_data jsonb;v_revision timestamptz;v_expected numeric;v_length numeric;v_breadth numeric;
 v_field text;v_floor text;v_total numeric:=0;v_seen text[]:=ARRAY[]::text[];
 v_result jsonb;v_unit text;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL OR NOT public.vp_report_can('Edit') THEN
  RAISE EXCEPTION 'Valuation edit permission required'; END IF;
 IF p_selection IS NULL OR jsonb_typeof(p_selection)<>'object' OR p_selection='{}'::jsonb THEN
  RAISE EXCEPTION 'At least one reviewed field selection is required'; END IF;
 IF EXISTS(SELECT 1 FROM jsonb_object_keys(p_selection) AS chosen(key)
     WHERE chosen.key NOT IN ('landAreaSqYd','builtUpSqFt','ageYears')) THEN
  RAISE EXCEPTION 'Unsupported field transfer requested'; END IF;
 -- Restrict to latest approved, submitted inspection of the case, selected using the same query as view RPC.
 SELECT i.data,i.updated_at INTO v_data,v_revision
 FROM public.vp_field_inspections i
 JOIN public.vp_site_visits v ON v.org_id=i.org_id AND v.id=i.visit_id
 WHERE i.org_id=v_org AND i.visit_id=p_visit_id AND v.num=p_case_num
   AND i.status='Submitted' AND v.status<>'Cancelled'
   AND EXISTS(SELECT 1 FROM public.vp_qc_tasks q WHERE q.org_id=v_org AND q.num=p_case_num
       AND q.review_stage='Field QC' AND q.status='Approved' AND q.decided_at>=i.submitted_at)
   AND p_visit_id=(SELECT latest.visit_id FROM public.vp_field_inspections latest
     JOIN public.vp_site_visits lv ON lv.org_id=latest.org_id AND lv.id=latest.visit_id
     WHERE latest.org_id=v_org AND lv.num=p_case_num AND latest.status='Submitted'
       AND lv.status<>'Cancelled'
     ORDER BY latest.submitted_at DESC NULLS LAST,latest.updated_at DESC,latest.visit_id DESC LIMIT 1)
 FOR SHARE OF i;
 IF NOT FOUND THEN RAISE EXCEPTION 'Selected submitted inspection is unavailable or not latest'; END IF;
 IF v_revision IS DISTINCT FROM p_source_revision THEN
  RAISE EXCEPTION 'Inspection changed since review. Reload before transfer'; END IF;
 IF p_selection ? 'landAreaSqYd' THEN
  IF p_selection->'landAreaSqYd'->'rectangular_confirmed' IS DISTINCT FROM 'true'::jsonb THEN
   RAISE EXCEPTION 'Rectangular dimensions must be explicitly confirmed'; END IF;
  IF v_data->>'land_length' IS NULL OR v_data->>'land_breadth' IS NULL
     OR (v_data->>'land_length') !~ '^[0-9]+([.][0-9]+)?$'
     OR (v_data->>'land_breadth') !~ '^[0-9]+([.][0-9]+)?$' THEN
   RAISE EXCEPTION 'Invalid land dimensions'; END IF;
  v_length:=(v_data->>'land_length')::numeric;v_breadth:=(v_data->>'land_breadth')::numeric;
  IF v_length<=0 OR v_breadth<=0 THEN RAISE EXCEPTION 'Land dimensions must be positive'; END IF;
  v_unit:=v_data->>'measurement_unit';
  IF v_unit='Feet' THEN v_expected:=round(v_length*v_breadth/9,2);
  ELSIF v_unit='Metres' THEN v_expected:=round(v_length*v_breadth/0.83612736,2);
  ELSE RAISE EXCEPTION 'Inspection measurement unit must be Feet or Metres'; END IF;
  IF abs((p_input->>'landAreaSqYd')::numeric-v_expected)>0.011 THEN
   RAISE EXCEPTION 'Land area differs from verified submitted dimensions'; END IF;
 END IF;
 IF p_selection ? 'builtUpSqFt' THEN
  IF jsonb_typeof(p_selection->'builtUpSqFt'->'floors') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Selected floors must be an array'; END IF;
  IF jsonb_array_length(p_selection->'builtUpSqFt'->'floors') NOT BETWEEN 1 AND 6 THEN
    RAISE EXCEPTION 'Choose 1 to 6 floor areas'; END IF;
  FOR v_floor IN SELECT jsonb_array_elements_text(p_selection->'builtUpSqFt'->'floors') LOOP
    IF v_floor NOT IN ('floor_area_0','floor_area_1','floor_area_2','floor_area_3','floor_area_4','floor_area_5')
       OR v_floor=ANY(v_seen) THEN RAISE EXCEPTION 'Invalid or duplicate floor'; END IF;
    v_seen:=array_append(v_seen,v_floor);
    IF v_data->>v_floor IS NULL OR (v_data->>v_floor) !~ '^[0-9]+([.][0-9]+)?$'
      OR (v_data->>v_floor)::numeric<=0 THEN
       RAISE EXCEPTION 'Chosen floor measurement invalid: %',v_floor; END IF;
    v_total:=v_total+(v_data->>v_floor)::numeric;
  END LOOP;
  IF abs((p_input->>'builtUpSqFt')::numeric-round(v_total,2))>0.011 THEN
    RAISE EXCEPTION 'Built-up area differs from selected floor measurements'; END IF;
 END IF;
 IF p_selection ? 'ageYears' THEN
  IF p_selection->'ageYears' IS DISTINCT FROM 'true'::jsonb
     OR v_data->>'property_age' IS NULL
     OR (v_data->>'property_age') !~ '^[0-9]+([.][0-9]+)?$' THEN
    RAISE EXCEPTION 'Invalid property age selection'; END IF;
  IF abs((p_input->>'ageYears')::numeric-(v_data->>'property_age')::numeric)>0.011 THEN
    RAISE EXCEPTION 'Building age differs from submitted inspection'; END IF;
 END IF;
 v_result:=public.vp_report_save_valuation(p_case_num,p_input,p_submit);
 INSERT INTO public.vp_p2_valuation_transfer_events(
  org_id,num,visit_id,actor_user_id,source_updated_at,selection,valuation_inputs,submitted)
 VALUES(v_org,p_case_num,p_visit_id,v_actor,v_revision,p_selection,p_input,p_submit);
 RETURN v_result;
END; $$;

-- Read-only audit summary for authorized report viewers. No general table SELECT granted.
CREATE OR REPLACE FUNCTION public.vp_p2_transfer_history(p_case_num integer)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_events jsonb;
BEGIN
 IF v_org IS NULL OR NOT (public.vp_report_can('View') OR public.vp_report_can('Edit')) THEN
   RAISE EXCEPTION 'Valuation report view permission required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.cases WHERE org_id=v_org AND num=p_case_num) THEN
   RAISE EXCEPTION 'Case not found'; END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object(
   'visit_id',e.visit_id,'actor_user_id',e.actor_user_id,'source_updated_at',e.source_updated_at,
   'selection',e.selection,'submitted',e.submitted,'created_at',e.created_at)
   ORDER BY e.created_at DESC),'[]'::jsonb) INTO v_events
 FROM public.vp_p2_valuation_transfer_events e WHERE e.org_id=v_org AND e.num=p_case_num;
 RETURN v_events;
END; $$;

REVOKE ALL ON FUNCTION public.vp_p2_valuer_inspection_for_case(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p2_valuer_inspection_for_case(integer) TO authenticated;
REVOKE ALL ON FUNCTION public.vp_p2_save_reviewed_valuation(integer,jsonb,boolean,bigint,timestamptz,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p2_save_reviewed_valuation(integer,jsonb,boolean,bigint,timestamptz,jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.vp_p2_transfer_history(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p2_transfer_history(integer) TO authenticated;
COMMIT;
