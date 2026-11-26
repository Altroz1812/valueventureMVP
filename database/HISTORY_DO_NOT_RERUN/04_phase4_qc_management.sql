-- ValuationPro Phase 4 | QC & Checking | additive BIGINT tenant-aware migration
-- Preconditions: Phases 1, 2 and 3 deployed to this Supabase project.
-- Does not change any existing table, column, FK, CHECK, role label or valuation calculation.
-- The original eight QC checklist labels are kept; applicability depends on QC stage.
-- Run as database owner (Supabase SQL Editor) after backup, not from a browser.
BEGIN;

DO $$ BEGIN
  IF to_regclass('public.valuation_auth_links') IS NULL
    OR to_regclass('public.vp_site_visits') IS NULL
    OR to_regclass('public.vp_visit_photos') IS NULL
    OR to_regclass('public.cases') IS NULL
    OR to_regclass('public.forms') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_is_admin(bigint)') IS NULL
    OR to_regprocedure('public.vp_can_case_action(text)') IS NULL
    OR to_regprocedure('public.vp_field_my_user_id()') IS NULL THEN
    RAISE EXCEPTION 'Phase 4 requires the verified Phase 1-3 database migrations';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.vp_qc_tasks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  num integer NOT NULL,
  review_stage text NOT NULL CHECK (review_stage IN ('Initiation QC','Field QC','Final QC')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Returned')),
  assigned_checker_id bigint,
  submitted_by bigint,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  assigned_by bigint,
  assigned_at timestamptz,
  decided_by bigint,
  decided_at timestamptz,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(checklist)='object'),
  defect text,
  remarks text,
  UNIQUE (org_id,id),
  FOREIGN KEY (org_id,num) REFERENCES public.cases(org_id,num),
  FOREIGN KEY (org_id,assigned_checker_id) REFERENCES public.users(org_id,id),
  FOREIGN KEY (org_id,submitted_by) REFERENCES public.users(org_id,id),
  FOREIGN KEY (org_id,assigned_by) REFERENCES public.users(org_id,id),
  FOREIGN KEY (org_id,decided_by) REFERENCES public.users(org_id,id)
);
-- A case may have multiple review rounds, but only one open QC task at a time.
CREATE UNIQUE INDEX IF NOT EXISTS vp_qc_one_open_per_case
  ON public.vp_qc_tasks(org_id,num) WHERE status='Pending';
CREATE INDEX IF NOT EXISTS vp_qc_queue_idx
  ON public.vp_qc_tasks(org_id,status,review_stage,submitted_at DESC);
CREATE INDEX IF NOT EXISTS vp_qc_checker_idx
  ON public.vp_qc_tasks(org_id,assigned_checker_id,status);

CREATE TABLE IF NOT EXISTS public.vp_qc_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  task_id bigint NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('Submitted','Assigned','Unassigned','Approved','Returned')),
  actor_user_id bigint,
  remarks text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK(jsonb_typeof(details)='object'),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (org_id,task_id) REFERENCES public.vp_qc_tasks(org_id,id),
  FOREIGN KEY (org_id,actor_user_id) REFERENCES public.users(org_id,id)
);
CREATE INDEX IF NOT EXISTS vp_qc_events_task_idx
  ON public.vp_qc_events(org_id,task_id,occurred_at DESC);

ALTER TABLE public.vp_qc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_qc_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vp_qc_tasks,public.vp_qc_events FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_qc_tasks,public.vp_qc_events TO authenticated;
GRANT ALL ON public.vp_qc_tasks,public.vp_qc_events TO service_role;

-- Permissions already supported by Phase 1 Role Matrix: qc.View/Approve/Return/Edit.
CREATE OR REPLACE FUNCTION public.vp_qc_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT p_action=ANY(ARRAY['View','Approve','Return','Edit']) AND EXISTS (
    SELECT 1 FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id
    JOIN public.orgs o ON o.id=u.org_id
    JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
    WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE AND o.status='active'
      AND rp.perm=ANY(ARRAY['tenant.admin','qc.'||p_action])
  );
$$;

-- RLS uses trusted caller identity, not a caller-supplied organization or role.
DROP POLICY IF EXISTS vp_phase4_tasks_read ON public.vp_qc_tasks;
CREATE POLICY vp_phase4_tasks_read ON public.vp_qc_tasks FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id())
     AND ((SELECT public.vp_qc_can('View')) OR (SELECT public.vp_qc_can('Edit'))
       OR assigned_checker_id=(SELECT public.vp_field_my_user_id())));
DROP POLICY IF EXISTS vp_phase4_events_read ON public.vp_qc_events;
CREATE POLICY vp_phase4_events_read ON public.vp_qc_events FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()) AND EXISTS (
    SELECT 1 FROM public.vp_qc_tasks t
    WHERE t.org_id=vp_qc_events.org_id AND t.id=vp_qc_events.task_id));

-- SQL mirrors the current UI labels; never treat a pre-visit QC as a site inspection.
CREATE OR REPLACE FUNCTION public.vp_qc_required_checks(p_stage text,p_product text)
RETURNS text[] LANGUAGE sql IMMUTABLE SECURITY INVOKER SET search_path='' AS $$
 SELECT CASE p_stage
  WHEN 'Initiation QC' THEN ARRAY[
    'Land extent matches title documents']::text[]
  WHEN 'Field QC' THEN ARRAY[
    'Four boundaries verified on site',
    'Minimum 8 geotagged photos attached',
    'GPS check-in within geofence']::text[]
  WHEN 'Final QC' THEN
    CASE WHEN p_product='Land' THEN ARRAY[
      'Guideline (SRO) rate vs market rate justified',
      'Comparable sales evidence (min. 2)',
      'IBBI registration valid for signing valuer']::text[]
    ELSE ARRAY[
      'Guideline (SRO) rate vs market rate justified',
      'Comparable sales evidence (min. 2)',
      'Building age & depreciation applied',
      'IBBI registration valid for signing valuer']::text[] END
  ELSE ARRAY[]::text[] END;
$$;

-- A CASE metadata transition into an existing UI QC stage creates a real review.
-- Works with Phase 3 checkout (Field Visit -> Field QC) and future Phase 5 submissions.
CREATE OR REPLACE FUNCTION public.vp_qc_on_case_stage()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_stage text; v_task_id bigint; v_actor bigint;
BEGIN
  v_stage:=NEW.meta->>'ui_stage';
  IF v_stage NOT IN ('Initiation QC','Field QC','Final QC') THEN RETURN NEW; END IF;
  IF TG_OP='UPDATE' THEN
    IF v_stage IS NOT DISTINCT FROM (OLD.meta->>'ui_stage') THEN RETURN NEW; END IF;
  END IF;
  SELECT u.id INTO v_actor
  FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id
  WHERE l.auth_uid=(SELECT auth.uid()) AND u.org_id=NEW.org_id AND u.active IS TRUE;
  INSERT INTO public.vp_qc_tasks(org_id,num,review_stage,submitted_by)
    VALUES(NEW.org_id,NEW.num,v_stage,v_actor)
    ON CONFLICT DO NOTHING RETURNING id INTO v_task_id;
  IF v_task_id IS NOT NULL THEN
    INSERT INTO public.vp_qc_events(org_id,task_id,event_type,actor_user_id)
      VALUES(NEW.org_id,v_task_id,'Submitted',v_actor);
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_phase4_qc_on_case_stage ON public.cases;
CREATE TRIGGER vp_phase4_qc_on_case_stage
  AFTER INSERT OR UPDATE OF meta ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.vp_qc_on_case_stage();

-- Backfill only real cases ALREADY in a known UI QC stage. No samples are inserted.
INSERT INTO public.vp_qc_tasks(org_id,num,review_stage)
SELECT c.org_id,c.num,c.meta->>'ui_stage'
FROM public.cases c
WHERE c.meta->>'ui_stage' IN ('Initiation QC','Field QC','Final QC')
  AND NOT EXISTS (SELECT 1 FROM public.vp_qc_tasks q
                  WHERE q.org_id=c.org_id AND q.num=c.num AND q.status='Pending')
ON CONFLICT DO NOTHING;
INSERT INTO public.vp_qc_events(org_id,task_id,event_type,remarks)
SELECT q.org_id,q.id,'Submitted','Existing case imported into QC queue'
FROM public.vp_qc_tasks q
WHERE NOT EXISTS (SELECT 1 FROM public.vp_qc_events e WHERE e.task_id=q.id);

-- Existing application cases have no generic QC 'submit' action. Provide an RPC
-- without changing the database's allowed stage CHECK values.
CREATE OR REPLACE FUNCTION public.vp_qc_submit(p_case_num integer,p_review_stage text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_case public.cases%ROWTYPE;
  v_next text; v_login text; v_task_id bigint;
BEGIN
  IF v_org IS NULL OR NOT (public.vp_can_case_action('Edit') OR public.vp_qc_can('Edit')) THEN
    RAISE EXCEPTION 'Case editing or QC editing permission required'; END IF;
  IF p_review_stage NOT IN ('Initiation QC','Field QC','Final QC') THEN
    RAISE EXCEPTION 'Unknown QC stage'; END IF;
  SELECT * INTO v_case FROM public.cases WHERE org_id=v_org AND num=p_case_num FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Case not found'; END IF;
  IF v_case.stage IN ('Approved','Submitted','Invoiced') THEN
    RAISE EXCEPTION 'A finalized case cannot be resubmitted to QC'; END IF;
  v_next:=v_case.meta->>'ui_stage';
  IF NOT coalesce(
      (v_next='Initiation' AND p_review_stage='Initiation QC') OR
      (v_next='Field Visit' AND p_review_stage='Field QC') OR
      (v_next='Report Draft' AND p_review_stage='Final QC'),false) THEN
    RAISE EXCEPTION 'Case is not at the prerequisite stage for this QC gate'; END IF;
  IF p_review_stage='Field QC' AND NOT EXISTS (
      SELECT 1 FROM public.vp_site_visits v
      WHERE v.org_id=v_org AND v.num=p_case_num AND v.status='Completed') THEN
    RAISE EXCEPTION 'A completed site visit is required before Field QC'; END IF;
  IF p_review_stage='Final QC' AND NOT EXISTS (
      SELECT 1 FROM public.forms f WHERE f.org_id=v_org AND f.num=p_case_num
        AND f.status='submitted' AND f.data IS NOT NULL AND f.data<>'{}'::jsonb) THEN
    RAISE EXCEPTION 'A submitted, nonempty valuation form is required for Final QC (Phase 5)'; END IF;
  IF EXISTS(SELECT 1 FROM public.vp_qc_tasks q
      WHERE q.org_id=v_org AND q.num=p_case_num AND q.status='Pending') THEN
    RAISE EXCEPTION 'A pending QC task already exists for this case'; END IF;
  UPDATE public.cases SET stage='Checker pending',
    meta=jsonb_set(coalesce(meta,'{}'::jsonb),'{ui_stage}',to_jsonb(p_review_stage),true)
    WHERE org_id=v_org AND num=p_case_num;
  SELECT id INTO v_task_id FROM public.vp_qc_tasks
    WHERE org_id=v_org AND num=p_case_num AND status='Pending' ORDER BY id DESC LIMIT 1;
  IF v_task_id IS NULL THEN RAISE EXCEPTION 'QC task could not be created'; END IF;
  SELECT u.login INTO v_login FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id WHERE l.auth_uid=auth.uid() AND u.org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,p_case_num,v_login,'Submitted for '||p_review_stage||' (QC task #'||v_task_id||')');
  RETURN v_task_id::text;
END; $$;

-- Only active and suitably permissioned tenant users are eligible as checkers.
CREATE OR REPLACE FUNCTION public.vp_qc_eligible_checkers()
RETURNS TABLE(id text,name text,role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT u.id::text,u.name,u.role FROM public.users u
  WHERE u.org_id=(SELECT public.vp_current_org_id()) AND u.active IS TRUE
    AND (public.vp_qc_can('Edit') OR public.vp_qc_can('View'))
    AND EXISTS (SELECT 1 FROM public.role_perms p WHERE p.org_id=u.org_id AND p.role=u.role
      AND p.perm IN ('tenant.admin','qc.Approve','qc.Return'))
  ORDER BY u.name;
$$;

CREATE OR REPLACE FUNCTION public.vp_qc_assign(p_task_id bigint,p_checker_user_id bigint)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
  v_task public.vp_qc_tasks%ROWTYPE; v_case public.cases%ROWTYPE; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_qc_can('Edit') THEN
    RAISE EXCEPTION 'QC assignment permission required'; END IF;
  SELECT * INTO v_task FROM public.vp_qc_tasks
    WHERE id=p_task_id AND org_id=v_org AND status='Pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pending QC task not found'; END IF;
  SELECT * INTO v_case FROM public.cases WHERE org_id=v_org AND num=v_task.num;
  IF v_case.meta->>'ui_stage' IS DISTINCT FROM v_task.review_stage THEN
    RAISE EXCEPTION 'Case is no longer at this review gate'; END IF;
  IF p_checker_user_id IS NOT NULL THEN
    IF NOT EXISTS(SELECT 1 FROM public.users u WHERE u.org_id=v_org
      AND u.id=p_checker_user_id AND u.active IS TRUE AND EXISTS(
        SELECT 1 FROM public.role_perms r WHERE r.org_id=u.org_id AND r.role=u.role
          AND r.perm IN ('tenant.admin','qc.Approve','qc.Return'))) THEN
      RAISE EXCEPTION 'Select an active user with QC decision permissions in this tenant'; END IF;
    IF nullif(v_case.meta->>'assigned_user_id','')=p_checker_user_id::text THEN
      RAISE EXCEPTION 'Assigned case maker cannot check their own case'; END IF;
    IF v_task.review_stage='Field QC' AND EXISTS (
      SELECT 1 FROM public.vp_site_visits v WHERE v.org_id=v_org AND v.num=v_task.num
        AND v.status='Completed' AND v.assigned_user_id=p_checker_user_id) THEN
      RAISE EXCEPTION 'Field inspector cannot check their own visit'; END IF;
  END IF;
  UPDATE public.vp_qc_tasks SET assigned_checker_id=p_checker_user_id,
    assigned_by=v_actor,assigned_at=now() WHERE id=p_task_id AND org_id=v_org;
  INSERT INTO public.vp_qc_events(org_id,task_id,event_type,actor_user_id,details)
    VALUES(v_org,p_task_id,CASE WHEN p_checker_user_id IS NULL THEN 'Unassigned' ELSE 'Assigned' END,
      v_actor,jsonb_build_object('checker_user_id',p_checker_user_id));
  SELECT login INTO v_login FROM public.users WHERE id=v_actor AND org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,v_task.num,v_login,CASE WHEN p_checker_user_id IS NULL
      THEN 'QC checker unassigned' ELSE 'QC checker assigned (#'||p_checker_user_id||')' END);
END; $$;

CREATE OR REPLACE FUNCTION public.vp_qc_decide(
  p_task_id bigint,p_decision text,p_checklist jsonb,
  p_defect text DEFAULT NULL,p_remarks text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
  v_task public.vp_qc_tasks%ROWTYPE; v_case public.cases%ROWTYPE;
  v_login text; v_need text[]; v_check text;
  v_visit public.vp_site_visits%ROWTYPE; v_photo_count bigint;
  v_form public.forms%ROWTYPE;
BEGIN
  IF v_org IS NULL OR p_decision IS NULL OR p_decision NOT IN ('Approved','Returned')
    OR NOT public.vp_qc_can(CASE WHEN p_decision='Approved' THEN 'Approve' ELSE 'Return' END) THEN
    RAISE EXCEPTION 'The required QC decision permission is missing'; END IF;
  SELECT * INTO v_task FROM public.vp_qc_tasks
    WHERE id=p_task_id AND org_id=v_org AND status='Pending' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'QC task is already decided, missing, or outside your organization'; END IF;
  SELECT * INTO v_case FROM public.cases
    WHERE org_id=v_org AND num=v_task.num FOR UPDATE;
  IF NOT FOUND OR v_case.meta->>'ui_stage' IS DISTINCT FROM v_task.review_stage THEN
    RAISE EXCEPTION 'Case QC gate has changed; refresh'; END IF;
  IF v_task.assigned_checker_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'Only the assigned checker can decide this review'; END IF;
  IF nullif(v_case.meta->>'assigned_user_id','')=v_actor::text THEN
    RAISE EXCEPTION 'Assigned case maker cannot approve or return their own case'; END IF;
  IF v_task.review_stage='Field QC' AND EXISTS (
    SELECT 1 FROM public.vp_site_visits v WHERE v.org_id=v_org AND v.num=v_task.num
      AND v.status='Completed' AND v.assigned_user_id=v_actor) THEN
    RAISE EXCEPTION 'Field officer cannot decide QC on their own inspection'; END IF;
  IF v_task.review_stage='Final QC' AND EXISTS (
    SELECT 1 FROM public.forms f WHERE f.org_id=v_org AND f.num=v_task.num
      AND lower(btrim(coalesce(f."by",'')))=(SELECT login FROM public.users WHERE id=v_actor)) THEN
    RAISE EXCEPTION 'Valuation form preparer cannot decide Final QC'; END IF;
  IF length(coalesce(p_remarks,''))>2000 THEN RAISE EXCEPTION 'Remarks exceed 2000 characters'; END IF;
  IF p_decision='Returned' THEN
    IF p_defect IS NULL OR p_defect NOT IN ('Measurement mismatch','Insufficient photos','Boundary discrepancy',
      'Rate not justified','Document missing','GPS outside geofence') THEN
      RAISE EXCEPTION 'Choose a valid defect category'; END IF;
    IF length(btrim(coalesce(p_remarks,'')))<5 THEN
      RAISE EXCEPTION 'Provide meaningful return remarks (at least 5 characters)'; END IF;
  ELSE
    IF jsonb_typeof(p_checklist) IS DISTINCT FROM 'object' THEN
      RAISE EXCEPTION 'QC checklist must be an object'; END IF;
    v_need:=public.vp_qc_required_checks(v_task.review_stage,v_case.prod);
    FOREACH v_check IN ARRAY v_need LOOP
      IF p_checklist->v_check IS DISTINCT FROM 'true'::jsonb THEN
        RAISE EXCEPTION 'Complete required QC check: %',v_check;
      END IF;
    END LOOP;
    IF v_task.review_stage='Field QC' THEN
      SELECT * INTO v_visit FROM public.vp_site_visits v
        WHERE v.org_id=v_org AND v.num=v_task.num AND v.status='Completed'
        ORDER BY v.checkout_at DESC NULLS LAST,v.id DESC LIMIT 1;
      IF NOT FOUND THEN RAISE EXCEPTION 'A completed site visit is required for Field QC'; END IF;
      SELECT count(*) INTO v_photo_count FROM public.vp_visit_photos
        WHERE org_id=v_org AND visit_id=v_visit.id;
      IF v_photo_count<greatest(8,v_visit.min_photos) THEN
        RAISE EXCEPTION 'Field QC requires at least 8 photographs and the configured visit minimum; found %',v_photo_count;
      END IF;
      IF v_visit.checkin_verified IS DISTINCT FROM true
        OR v_visit.checkout_verified IS DISTINCT FROM true THEN
        RAISE EXCEPTION 'Geofence verification is missing; do not certify this checklist item'; END IF;
    END IF;
    IF v_task.review_stage='Final QC' AND NOT EXISTS (
      SELECT 1 FROM public.forms f WHERE f.org_id=v_org AND f.num=v_task.num
      AND f.status='submitted' AND f.data IS NOT NULL AND f.data<>'{}'::jsonb) THEN
      RAISE EXCEPTION 'A submitted nonempty valuation form is required for Final QC'; END IF;
  END IF;
  UPDATE public.vp_qc_tasks SET status=p_decision,decided_by=v_actor,decided_at=now(),
    checklist=coalesce(p_checklist,'{}'::jsonb),defect=CASE WHEN p_decision='Returned' THEN p_defect ELSE NULL END,
    remarks=nullif(btrim(coalesce(p_remarks,'')),'')
    WHERE id=p_task_id AND org_id=v_org;
  UPDATE public.cases SET
    stage=CASE WHEN p_decision='Returned' THEN 'Rework'
      WHEN v_task.review_stage='Initiation QC' THEN
        CASE WHEN nullif(btrim(coalesce(team,'')),'') IS NULL THEN 'Received' ELSE 'Assigned' END
      WHEN v_task.review_stage='Field QC' THEN 'Checker pending'
      ELSE 'Approved' END,
    meta=jsonb_set(coalesce(meta,'{}'::jsonb),'{ui_stage}',to_jsonb(
      CASE WHEN p_decision='Returned' THEN
         CASE v_task.review_stage WHEN 'Initiation QC' THEN 'Initiation'
              WHEN 'Field QC' THEN 'Field Visit' ELSE 'Report Draft' END
       WHEN v_task.review_stage='Initiation QC' THEN 'Field Visit'
       WHEN v_task.review_stage='Field QC' THEN 'Report Draft'
       ELSE 'Approved' END),true)
    WHERE org_id=v_org AND num=v_task.num;
  INSERT INTO public.vp_qc_events(org_id,task_id,event_type,actor_user_id,remarks,details)
    VALUES(v_org,p_task_id,p_decision,v_actor,nullif(btrim(coalesce(p_remarks,'')),''),
      jsonb_build_object('checklist',coalesce(p_checklist,'{}'::jsonb),'defect',p_defect,
        'review_stage',v_task.review_stage));
  SELECT login INTO v_login FROM public.users WHERE id=v_actor AND org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,v_task.num,v_login,
      v_task.review_stage||' '||CASE WHEN p_decision='Approved' THEN 'approved' ELSE 'returned: '||p_defect END);
END; $$;

-- Bigint IDs are serialized as strings (avoids JavaScript precision loss).
CREATE OR REPLACE FUNCTION public.vp_qc_list_tasks()
RETURNS TABLE(id text,org_id text,num integer,review_stage text,status text,
  assigned_checker_id text,submitted_by text,submitted_at timestamptz,
  decided_by text,decided_at timestamptz,checklist jsonb,defect text,remarks text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT t.id::text,t.org_id::text,t.num,t.review_stage,t.status,
    t.assigned_checker_id::text,t.submitted_by::text,t.submitted_at,
    t.decided_by::text,t.decided_at,t.checklist,t.defect,t.remarks
  FROM public.vp_qc_tasks t
  WHERE t.org_id=(SELECT public.vp_current_org_id())
    AND ((SELECT public.vp_qc_can('View')) OR (SELECT public.vp_qc_can('Edit'))
      OR t.assigned_checker_id=(SELECT public.vp_field_my_user_id()))
  ORDER BY CASE WHEN t.status='Pending' THEN 0 ELSE 1 END,t.submitted_at DESC;
$$;

-- API EXECUTE privileges: no anonymous/public function access.
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
    JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname=ANY(ARRAY[
      'vp_qc_can','vp_qc_required_checks','vp_qc_on_case_stage',
      'vp_qc_submit','vp_qc_eligible_checkers','vp_qc_assign','vp_qc_decide','vp_qc_list_tasks']) LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon',f.sig);
    IF f.sig::text NOT LIKE '%vp_qc_on_case_stage%' THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.sig);
    ELSE
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated',f.sig);
    END IF;
  END LOOP;
END $$;
COMMIT;
