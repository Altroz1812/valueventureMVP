-- ValuationPro P9, staging only. Explicit transactional RPCs; no table or stage changes.
-- Existing P0/P1 inspection save, QC guards, evidence and GPS policies remain authoritative.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.cases') IS NULL OR to_regclass('public.vp_site_visits') IS NULL
  OR to_regclass('public.vp_visit_photos') IS NULL OR to_regclass('public.vp_field_inspections') IS NULL
  OR to_regclass('public.vp_qc_tasks') IS NULL OR to_regclass('public.log') IS NULL
  OR to_regprocedure('public.vp_p0_inspection_access(bigint)') IS NULL
  OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
  OR to_regprocedure('public.vp_current_org_id()') IS NULL THEN
  RAISE EXCEPTION 'P9 prerequisites absent. No changes made.';
 END IF;
 IF EXISTS (SELECT 1 FROM (VALUES
  ('cases','org_id'),('cases','num'),('cases','cust'),('cases','addr'),('cases','meta'),
  ('vp_site_visits','org_id'),('vp_site_visits','id'),('vp_site_visits','num'),
  ('vp_site_visits','assigned_user_id'),('vp_site_visits','scheduled_at'),
  ('vp_site_visits','status'),('vp_site_visits','updated_at'),('users','login')
 ) x(t,c) WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns z
   WHERE z.table_schema='public' AND z.table_name=x.t AND z.column_name=x.c)) THEN
  RAISE EXCEPTION 'P9 schema mismatch. No changes made.';
 END IF;
END $$;

-- An officer may correct the customer/site-address master fields for their assigned visit.
-- Bank, loan reference, due date, pricing, property product, assignment and QC are NOT editable here.
CREATE OR REPLACE FUNCTION public.vp_p9_field_update_case(
 p_visit_id bigint,p_customer text,p_site_address text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v_visit public.vp_site_visits%ROWTYPE; v_access jsonb; v_old_cust text;v_old_addr text;
 v_login text;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL THEN RAISE EXCEPTION 'Active tenant user required'; END IF;
 IF length(btrim(coalesce(p_customer,''))) NOT BETWEEN 2 AND 240 OR
    length(btrim(coalesce(p_site_address,''))) NOT BETWEEN 5 AND 1500 THEN
   RAISE EXCEPTION 'Customer 2-240 characters; site address 5-1500 characters required'; END IF;
 SELECT * INTO v_visit FROM public.vp_site_visits
  WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
 IF NOT FOUND OR v_visit.assigned_user_id IS DISTINCT FROM v_actor THEN
  RAISE EXCEPTION 'Only the assigned field officer may edit this case'; END IF;
 SELECT public.vp_p0_inspection_access(p_visit_id) INTO v_access;
 IF coalesce((v_access->>'can_edit')::boolean,false) IS DISTINCT FROM true
  OR coalesce((v_access->>'is_assigned')::boolean,false) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Case is locked or not assigned to this officer'; END IF;
 SELECT cust,addr INTO v_old_cust,v_old_addr FROM public.cases
  WHERE org_id=v_org AND num=v_visit.num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case record not found'; END IF;
 IF v_old_cust IS DISTINCT FROM btrim(p_customer) OR v_old_addr IS DISTINCT FROM btrim(p_site_address) THEN
  UPDATE public.cases SET cust=btrim(p_customer),addr=btrim(p_site_address)
   WHERE org_id=v_org AND num=v_visit.num;
  SELECT login INTO v_login FROM public.users WHERE org_id=v_org AND id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v_visit.num,v_login,
   'Assigned field officer updated customer/site address for visit #'||p_visit_id::text
    ||' (customer: '||left(coalesce(v_old_cust,''),100)||' -> '||left(btrim(p_customer),100)
    ||'; site address changed: '||(v_old_addr IS DISTINCT FROM btrim(p_site_address))::text||')');
 END IF;
 RETURN jsonb_build_object('case_num',v_visit.num,'customer',btrim(p_customer),
  'site_address',btrim(p_site_address));
END; $$;

-- Officer self-scheduling only. Assignment and photo minimum are unchanged.
-- Managers retain the existing vp_field_schedule reassignment RPC.
CREATE OR REPLACE FUNCTION public.vp_p9_field_self_reschedule(
 p_visit_id bigint,p_scheduled_at timestamptz)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
 v_visit public.vp_site_visits%ROWTYPE;v_access jsonb;v_login text;
BEGIN
 IF v_org IS NULL OR v_actor IS NULL THEN RAISE EXCEPTION 'Active tenant user required'; END IF;
 IF p_scheduled_at IS NULL OR p_scheduled_at<now()-interval '1 hour'
 OR p_scheduled_at>now()+interval '1 year' THEN
  RAISE EXCEPTION 'Select a valid upcoming site visit date'; END IF;
 SELECT * INTO v_visit FROM public.vp_site_visits
 WHERE org_id=v_org AND id=p_visit_id FOR UPDATE;
 IF NOT FOUND OR v_visit.assigned_user_id IS DISTINCT FROM v_actor THEN
  RAISE EXCEPTION 'Visit is not assigned to this field officer'; END IF;
 IF v_visit.status<>'Scheduled' OR v_visit.checkin_at IS NOT NULL THEN
  RAISE EXCEPTION 'Only an unchecked-in scheduled visit can be changed'; END IF;
 SELECT public.vp_p0_inspection_access(p_visit_id) INTO v_access;
 IF coalesce((v_access->>'can_edit')::boolean,false) IS DISTINCT FROM true
   OR coalesce((v_access->>'is_assigned')::boolean,false) IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'Case is locked; visit cannot be rescheduled'; END IF;
 UPDATE public.vp_site_visits SET scheduled_at=p_scheduled_at,updated_at=now()
  WHERE org_id=v_org AND id=p_visit_id;
 SELECT login INTO v_login FROM public.users WHERE org_id=v_org AND id=v_actor;
 INSERT INTO public.log(org_id,num,"by",msg)
 VALUES(v_org,v_visit.num,v_login,'Assigned field officer rescheduled visit #'||p_visit_id::text
   ||' from '||v_visit.scheduled_at::text||' to '||p_scheduled_at::text);
 RETURN jsonb_build_object('visit_id',p_visit_id,'scheduled_at',p_scheduled_at);
END; $$;

REVOKE ALL ON FUNCTION public.vp_p9_field_update_case(bigint,text,text) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.vp_p9_field_self_reschedule(bigint,timestamptz) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p9_field_update_case(bigint,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p9_field_self_reschedule(bigint,timestamptz) TO authenticated;
-- Prevent side-channel changes to registered photo evidence after officer submission.
-- The existing photo upload RPC and private bucket remain unchanged.
CREATE OR REPLACE FUNCTION public.vp_p9_photo_lock_after_submission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_status text;v_submitted timestamptz;v_case_num integer;
BEGIN
 SELECT i.status,i.submitted_at,v.num INTO v_status,v_submitted,v_case_num
 FROM public.vp_field_inspections i JOIN public.vp_site_visits v
  ON v.org_id=i.org_id AND v.id=i.visit_id
 WHERE i.org_id=NEW.org_id AND i.visit_id=NEW.visit_id;
 IF v_status='Submitted' AND NOT EXISTS (
  SELECT 1 FROM public.vp_qc_tasks q
  WHERE q.org_id=NEW.org_id AND q.num=v_case_num
   AND q.review_stage='Field QC' AND q.status='Returned'
   AND q.decided_at>=v_submitted
 ) THEN RAISE EXCEPTION 'Field evidence locked after submission; require checker return'; END IF;
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_p9_photo_lock_guard ON public.vp_visit_photos;
CREATE TRIGGER vp_p9_photo_lock_guard BEFORE INSERT ON public.vp_visit_photos
 FOR EACH ROW EXECUTE FUNCTION public.vp_p9_photo_lock_after_submission();
REVOKE ALL ON FUNCTION public.vp_p9_photo_lock_after_submission() FROM PUBLIC,anon,authenticated;
COMMIT;
