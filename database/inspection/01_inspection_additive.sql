-- Additive, opt-in structured inspection data for the Excel-based Field Inspection form.
-- Does NOT change existing cases, forms, vp_site_visits, QC, valuation or billing objects.
-- IMPORTANT: Review preflight results, take DB backup, then run in a STAGING project first.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.vp_site_visits') IS NULL
    OR to_regclass('public.vp_qc_tasks') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
    OR to_regprocedure('public.vp_field_can_see_visit(bigint)') IS NULL
    OR to_regprocedure('public.vp_qc_can(text)') IS NULL
 THEN RAISE EXCEPTION 'Required existing Phase 3/4 objects missing; no changes made'; END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.vp_field_inspections (
 org_id bigint NOT NULL,
 visit_id bigint NOT NULL,
 data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(data)='object'),
 status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Submitted')),
 updated_by bigint NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 submitted_at timestamptz,
 PRIMARY KEY (org_id,visit_id),
 FOREIGN KEY (org_id,visit_id) REFERENCES public.vp_site_visits(org_id,id) ON DELETE CASCADE,
 FOREIGN KEY (org_id,updated_by) REFERENCES public.users(org_id,id)
);
ALTER TABLE public.vp_field_inspections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vp_field_inspections FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_field_inspections TO authenticated;
GRANT ALL ON public.vp_field_inspections TO service_role;
DROP POLICY IF EXISTS vp_inspections_tenant_read ON public.vp_field_inspections;
CREATE POLICY vp_inspections_tenant_read ON public.vp_field_inspections
 FOR SELECT TO authenticated
 USING (
  org_id=(SELECT public.vp_current_org_id())
  AND (
    public.vp_field_can_see_visit(visit_id)
    OR public.vp_qc_can('View') OR public.vp_qc_can('Edit')
    OR EXISTS(SELECT 1 FROM public.vp_site_visits v
      JOIN public.vp_qc_tasks t ON t.org_id=v.org_id AND t.num=v.num
      WHERE v.id=vp_field_inspections.visit_id
        AND v.org_id=vp_field_inspections.org_id
        AND t.assigned_checker_id=public.vp_field_my_user_id())
  )
 );

CREATE OR REPLACE FUNCTION public.vp_inspection_save(
 p_visit_id bigint,p_data jsonb,p_submit boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
 v_actor bigint:=public.vp_field_my_user_id();
 v_visit public.vp_site_visits%ROWTYPE;
 v_stage text; v_current public.vp_field_inspections%ROWTYPE;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL THEN RAISE EXCEPTION 'Signed-in tenant user required'; END IF;
 IF p_data IS NULL OR jsonb_typeof(p_data) IS DISTINCT FROM 'object'
    OR length(p_data::text)>100000 THEN
    RAISE EXCEPTION 'Inspection must be a valid object under 100KB'; END IF;
 SELECT * INTO v_visit FROM public.vp_site_visits
  WHERE id=p_visit_id AND org_id=v_org FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Visit not found in your organization'; END IF;
 IF v_visit.assigned_user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'Only the assigned field officer can save inspection'; END IF;
 IF v_visit.status NOT IN ('On site','Completed') THEN
    RAISE EXCEPTION 'Inspection may be saved only during/after site visit'; END IF;
 SELECT meta->>'ui_stage' INTO v_stage FROM public.cases
  WHERE org_id=v_org AND num=v_visit.num;
 IF v_stage NOT IN ('Field Visit','Field QC') THEN
    RAISE EXCEPTION 'Case not in field inspection stage'; END IF;
 IF EXISTS(SELECT 1 FROM public.vp_qc_tasks t
   WHERE t.org_id=v_org AND t.num=v_visit.num AND t.review_stage='Field QC'
   AND t.status='Approved') THEN
   RAISE EXCEPTION 'Field QC already approved; inspection is locked'; END IF;
 SELECT * INTO v_current FROM public.vp_field_inspections
  WHERE org_id=v_org AND visit_id=p_visit_id FOR UPDATE;
 IF FOUND AND v_current.status='Submitted' AND NOT EXISTS(
   SELECT 1 FROM public.vp_qc_tasks t WHERE t.org_id=v_org AND t.num=v_visit.num
   AND t.review_stage='Field QC' AND t.status='Returned'
   AND t.decided_at >= v_current.submitted_at) THEN
   RAISE EXCEPTION 'Submitted inspection is locked until Field QC returns it'; END IF;
 IF p_submit THEN
  IF length(btrim(coalesce(p_data->>'visit_date','')))=0
     OR length(btrim(coalesce(p_data->>'owner_name','')))=0
     OR length(btrim(coalesce(p_data->>'site_address','')))=0 THEN
     RAISE EXCEPTION 'Visit date, property owner and site address are required for submission'; END IF;
 END IF;
 INSERT INTO public.vp_field_inspections(org_id,visit_id,data,status,updated_by,updated_at,submitted_at)
 VALUES(v_org,p_visit_id,p_data,CASE WHEN p_submit THEN 'Submitted' ELSE 'Draft' END,
   v_actor,now(),CASE WHEN p_submit THEN now() ELSE NULL END)
 ON CONFLICT(org_id,visit_id) DO UPDATE SET
  data=EXCLUDED.data,status=EXCLUDED.status,updated_by=EXCLUDED.updated_by,
  updated_at=EXCLUDED.updated_at,submitted_at=EXCLUDED.submitted_at;
 RETURN jsonb_build_object('status',CASE WHEN p_submit THEN 'Submitted' ELSE 'Draft' END,
   'updated_at',now());
END; $$;

CREATE OR REPLACE FUNCTION public.vp_inspection_get(p_visit_id bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
 v_num integer; v_data jsonb; v_can_edit boolean;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL THEN RAISE EXCEPTION 'Signed-in tenant user required'; END IF;
 SELECT num INTO v_num FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id;
 IF NOT FOUND THEN RAISE EXCEPTION 'Visit not found'; END IF;
 IF NOT (public.vp_field_can_see_visit(p_visit_id)
    OR public.vp_qc_can('View') OR public.vp_qc_can('Edit')
    OR EXISTS(SELECT 1 FROM public.vp_qc_tasks t
       WHERE t.org_id=v_org AND t.num=v_num AND t.assigned_checker_id=v_actor)) THEN
    RAISE EXCEPTION 'Inspection view permission required'; END IF;
 SELECT jsonb_build_object('data',i.data,'status',i.status,
   'updated_at',i.updated_at,'submitted_at',i.submitted_at,
   'can_edit', i.status='Draft' OR EXISTS(
      SELECT 1 FROM public.vp_qc_tasks t WHERE t.org_id=v_org AND t.num=v_num
      AND t.review_stage='Field QC' AND t.status='Returned'
      AND t.decided_at >= i.submitted_at))
 INTO v_data FROM public.vp_field_inspections i WHERE i.org_id=v_org AND i.visit_id=p_visit_id;
 RETURN COALESCE(v_data,'{"data":{},"status":"Not started"}'::jsonb);
END; $$;

CREATE OR REPLACE FUNCTION public.vp_inspection_for_case(p_case_num integer)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
 v_visit_id bigint;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL THEN RAISE EXCEPTION 'Signed-in tenant user required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.cases WHERE org_id=v_org AND num=p_case_num) THEN
   RAISE EXCEPTION 'Case not found'; END IF;
 IF NOT (public.vp_qc_can('View') OR public.vp_qc_can('Edit')
   OR EXISTS(SELECT 1 FROM public.vp_qc_tasks t
     WHERE t.org_id=v_org AND t.num=p_case_num AND t.assigned_checker_id=v_actor)
   OR EXISTS(SELECT 1 FROM public.vp_site_visits v
     WHERE v.org_id=v_org AND v.num=p_case_num AND v.assigned_user_id=v_actor)) THEN
   RAISE EXCEPTION 'Field report view permission required'; END IF;
 SELECT v.id INTO v_visit_id FROM public.vp_site_visits v
   WHERE v.org_id=v_org AND v.num=p_case_num AND v.status<>'Cancelled'
   ORDER BY CASE WHEN v.status='Completed' THEN 0 ELSE 1 END,
     v.checkout_at DESC NULLS LAST,v.id DESC LIMIT 1;
 IF v_visit_id IS NULL THEN RETURN '{"data":{},"status":"No visit"}'::jsonb; END IF;
 RETURN jsonb_build_object('visit_id',v_visit_id,'report',public.vp_inspection_get(v_visit_id));
END; $$;

REVOKE ALL ON FUNCTION public.vp_inspection_save(bigint,jsonb,boolean) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.vp_inspection_get(bigint) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.vp_inspection_for_case(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_inspection_save(bigint,jsonb,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vp_inspection_get(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vp_inspection_for_case(integer) TO authenticated;
COMMIT;
