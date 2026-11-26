-- OPTIONAL, additive function-only correction for assigned field officer Scheduled DRAFT entry.
-- Based on the previous ValuationPro inspection RPC definition. No new tables or grants to anon.
-- Apply in Supabase SQL Editor ONLY after verifying this is the same function definition currently deployed.
-- This preserves tenant restriction, assigned-officer check, stage guard, QC lock and submission requirements.
BEGIN;
DO $$ BEGIN
 IF to_regprocedure('public.vp_inspection_save(bigint,jsonb,boolean)') IS NULL THEN
   RAISE EXCEPTION 'Existing inspection save function not installed; aborting';
 END IF;
END $$;
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
 IF v_visit.status NOT IN ('Scheduled','On site','Completed') THEN
    RAISE EXCEPTION 'Visit status does not allow inspection editing'; END IF;
 IF p_submit AND v_visit.status NOT IN ('On site','Completed') THEN
    RAISE EXCEPTION 'Submission requires site check-in or completed visit; Scheduled allows draft only'; END IF;
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

REVOKE ALL ON FUNCTION public.vp_inspection_save(bigint,jsonb,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_inspection_save(bigint,jsonb,boolean) TO authenticated;
COMMIT;
