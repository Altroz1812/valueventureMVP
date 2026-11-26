-- ValuationPro | Direct and bulk staff provisioning | additive to Phase 1-4 BIGINT schema.
-- IMPORTANT: Requires 00_prior_user_qc_foundation_optional.sql to have been applied.
-- Do not run the old UUID-based migration. No original table is dropped or changed.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.valuation_auth_links') IS NULL
 OR to_regclass('public.vp_user_branches') IS NULL
 OR to_regprocedure('public.vp_admin_attach_invited_user(text,text,text)') IS NULL
 OR to_regprocedure('public.vp_admin_replace_user_branches(bigint,bigint[])') IS NULL
 OR to_regprocedure('public.vp_current_org_id()') IS NULL THEN
   RAISE EXCEPTION 'First apply the prior User & QC foundation (00), then retry';
 END IF;
END $$;

-- One-time password gate is recorded per Auth identity, not client-editable metadata.
CREATE TABLE IF NOT EXISTS public.vp_user_password_setup (
  auth_uid uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id bigint NOT NULL REFERENCES public.orgs(id),
  must_change boolean NOT NULL DEFAULT true,
  created_by_user_id bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  FOREIGN KEY (org_id,created_by_user_id) REFERENCES public.users(org_id,id)
);
CREATE INDEX IF NOT EXISTS vp_user_password_setup_org_idx
  ON public.vp_user_password_setup(org_id,must_change);
ALTER TABLE public.vp_user_password_setup ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vp_user_password_setup FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.vp_user_password_setup TO service_role;
-- No direct browser policy: Edge Function uses a secret server-side key.

-- Reject ordinary tenant data access until an administrator-created account
-- has changed its temporary password. Existing accounts with no setup row are unchanged.
CREATE OR REPLACE FUNCTION public.vp_current_org_id()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.org_id
 FROM public.valuation_auth_links l
 JOIN public.users u ON u.id=l.user_id
 JOIN public.orgs o ON o.id=u.org_id
 WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE AND o.status='active'
   AND NOT EXISTS (
      SELECT 1 FROM public.vp_user_password_setup s
      WHERE s.auth_uid=l.auth_uid AND s.must_change IS TRUE)
 LIMIT 1;
$$;


-- Other Phase 1–4 SECURITY DEFINER authorization helpers must respect the same
-- first-login gate. Otherwise a password-pending account could still use RPCs.
CREATE OR REPLACE FUNCTION public.vp_is_admin(p_org_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT p_org_id IS NOT NULL
    AND p_org_id=(SELECT public.vp_current_org_id())
    AND EXISTS(SELECT 1 FROM public.valuation_auth_links l
      JOIN public.users u ON u.id=l.user_id
      JOIN public.role_perms p ON p.org_id=u.org_id AND p.role=u.role
      WHERE l.auth_uid=(SELECT auth.uid()) AND u.org_id=p_org_id
        AND u.active IS TRUE AND p.perm='tenant.admin');
$$;

CREATE OR REPLACE FUNCTION public.vp_can_case_action(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['Create','Edit','Assign']) AND EXISTS (
    SELECT 1 FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id
    JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
    WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
      AND u.org_id=(SELECT public.vp_current_org_id())
      AND rp.perm=ANY(ARRAY['tenant.admin','cases.'||p_action]));
$$;

CREATE OR REPLACE FUNCTION public.vp_qc_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Approve','Return','Edit']) AND EXISTS (
    SELECT 1 FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id
    JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
    WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
      AND u.org_id=(SELECT public.vp_current_org_id())
      AND rp.perm=ANY(ARRAY['tenant.admin','qc.'||p_action]));
$$;

CREATE OR REPLACE FUNCTION public.vp_field_my_user_id()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.id FROM public.valuation_auth_links l
 JOIN public.users u ON u.id=l.user_id
 WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
   AND u.org_id=(SELECT public.vp_current_org_id()) LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.vp_field_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Assign','Check In/Out','Manage Geofence'])
  AND EXISTS (SELECT 1 FROM public.valuation_auth_links l
   JOIN public.users u ON u.id=l.user_id
   JOIN public.role_perms p ON p.org_id=u.org_id AND p.role=u.role
   WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
     AND u.org_id=(SELECT public.vp_current_org_id())
     AND p.perm=ANY(ARRAY['tenant.admin','field.'||p_action]));
$$;

CREATE OR REPLACE FUNCTION public.vp_first_login_required()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM public.vp_user_password_setup s
               WHERE s.auth_uid=(SELECT auth.uid()) AND s.must_change IS TRUE);
$$;
REVOKE ALL ON FUNCTION public.vp_first_login_required() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_first_login_required() TO authenticated;

-- Admin-only status; does not return secrets or Auth UUIDs.
CREATE OR REPLACE FUNCTION public.vp_admin_first_login_status()
RETURNS TABLE(user_id text, password_setup_required boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.id::text, s.must_change IS TRUE
 FROM public.users u
 JOIN public.valuation_auth_links l ON l.user_id=u.id
 LEFT JOIN public.vp_user_password_setup s ON s.auth_uid=l.auth_uid
 WHERE u.org_id=(SELECT public.vp_current_org_id())
   AND public.vp_is_admin(u.org_id)
 ORDER BY u.id;
$$;
REVOKE ALL ON FUNCTION public.vp_admin_first_login_status() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_admin_first_login_status() TO authenticated;

-- Checker readiness must include completion of the first-password gate.
CREATE OR REPLACE FUNCTION public.vp_qc_eligible_checkers()
RETURNS TABLE(id text,name text,role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.id::text,u.name,u.role
 FROM public.users u
 JOIN public.valuation_auth_links l ON l.user_id=u.id
 JOIN auth.users a ON a.id=l.auth_uid AND a.email_confirmed_at IS NOT NULL
 WHERE u.org_id=(SELECT public.vp_current_org_id()) AND u.active IS TRUE
   AND (public.vp_qc_can('Edit') OR public.vp_qc_can('View'))
   AND NOT EXISTS (SELECT 1 FROM public.vp_user_password_setup s
                   WHERE s.auth_uid=l.auth_uid AND s.must_change IS TRUE)
   AND EXISTS(SELECT 1 FROM public.role_perms p
      WHERE p.org_id=u.org_id AND p.role=u.role
        AND p.perm IN ('tenant.admin','qc.Approve'))
   AND EXISTS(SELECT 1 FROM public.role_perms p
      WHERE p.org_id=u.org_id AND p.role=u.role
        AND p.perm IN ('tenant.admin','qc.Return'))
 ORDER BY u.name;
$$;

-- Harden assignment RPC as well; hiding candidates in the UI is not security.
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
   IF NOT EXISTS(
     SELECT 1 FROM public.users u
     JOIN public.valuation_auth_links l ON l.user_id=u.id
     JOIN auth.users a ON a.id=l.auth_uid AND a.email_confirmed_at IS NOT NULL
     WHERE u.org_id=v_org AND u.id=p_checker_user_id AND u.active IS TRUE
       AND NOT EXISTS(SELECT 1 FROM public.vp_user_password_setup s
                      WHERE s.auth_uid=l.auth_uid AND s.must_change IS TRUE)
       AND EXISTS(SELECT 1 FROM public.role_perms r WHERE r.org_id=u.org_id
          AND r.role=u.role AND r.perm IN ('tenant.admin','qc.Approve'))
       AND EXISTS(SELECT 1 FROM public.role_perms r WHERE r.org_id=u.org_id
          AND r.role=u.role AND r.perm IN ('tenant.admin','qc.Return'))
   ) THEN RAISE EXCEPTION 'Checker is inactive, not setup, or lacks QC permissions'; END IF;
   IF nullif(v_case.meta->>'assigned_user_id','')=p_checker_user_id::text THEN
     RAISE EXCEPTION 'Case maker cannot check their own case'; END IF;
   IF v_task.review_stage='Field QC' AND EXISTS(
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

REVOKE ALL ON FUNCTION public.vp_qc_eligible_checkers() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_qc_eligible_checkers() TO authenticated;
REVOKE ALL ON FUNCTION public.vp_qc_assign(bigint,bigint) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_qc_assign(bigint,bigint) TO authenticated;
COMMIT;
