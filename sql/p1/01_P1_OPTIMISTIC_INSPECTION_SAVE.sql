-- P1 additive: server-side last-write detection for UI autosave and submission.
-- Apply to STAGING after P0 tests pass. Does not drop/modify existing tables or QC functions.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.vp_field_inspections') IS NULL
    OR to_regprocedure('public.vp_inspection_save(bigint,jsonb,boolean)') IS NULL
    OR to_regprocedure('public.vp_p0_manager_inspection_save(bigint,jsonb,text)') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
 THEN RAISE EXCEPTION 'P1 prerequisites not installed. No changes applied.'; END IF;
 IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
  AND table_name='vp_field_inspections' AND column_name='updated_at'
  AND data_type='timestamp with time zone') THEN
   RAISE EXCEPTION 'Unexpected vp_field_inspections.updated_at type; inspect schema.';
 END IF;
END $$;
CREATE OR REPLACE FUNCTION public.vp_p1_inspection_save(
 p_visit_id bigint,p_data jsonb,p_expected_updated_at timestamptz,
 p_submit boolean DEFAULT false,p_reason text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
 v_actor bigint:=public.vp_field_my_user_id();
 v_current timestamptz;v_has_row boolean;v_result jsonb;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL THEN
   RAISE EXCEPTION 'Signed-in tenant user required';
 END IF;
 -- Serialize first-time writers by locking the parent visit row as well.
 PERFORM 1 FROM public.vp_site_visits WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Visit not found in your organization'; END IF;
 -- Hold the inspection row lock through the delegated P0 write.
 SELECT updated_at INTO v_current FROM public.vp_field_inspections
  WHERE org_id=v_org AND visit_id=p_visit_id FOR UPDATE;
 v_has_row:=FOUND;
 IF v_has_row IS DISTINCT FROM (p_expected_updated_at IS NOT NULL) THEN
   -- A missing record must have a null expected timestamp; an existing one must not.
   RAISE EXCEPTION USING MESSAGE='Inspection was added or replaced on the server. Reload and review before saving.', ERRCODE='40001';
 END IF;
 IF v_has_row AND v_current IS DISTINCT FROM p_expected_updated_at THEN
   RAISE EXCEPTION USING MESSAGE='Inspection changed on another device. Keep a copy of your unsaved work and reload.', ERRCODE='40001';
 END IF;
 IF p_reason IS NOT NULL THEN
   IF p_submit THEN RAISE EXCEPTION 'Managers cannot submit on behalf of field officers'; END IF;
   v_result:=public.vp_p0_manager_inspection_save(p_visit_id,p_data,p_reason);
 ELSE
   v_result:=public.vp_inspection_save(p_visit_id,p_data,p_submit);
 END IF;
 -- The underlying P0 functions enforce assignment, role, stage, evidence and audit controls.
 RETURN (SELECT jsonb_build_object('status',status,'updated_at',updated_at)
     FROM public.vp_field_inspections WHERE org_id=v_org AND visit_id=p_visit_id);
END; $$;
REVOKE ALL ON FUNCTION public.vp_p1_inspection_save(bigint,jsonb,timestamptz,boolean,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p1_inspection_save(bigint,jsonb,timestamptz,boolean,text) TO authenticated;
COMMIT;
