-- P11 scoped complement to the existing P10 migration. STAGING ONLY.
-- Does not remove any existing user, role, permission, file or case.
-- First install and verify sql/p10/01_P10_RBAC_STAGING.sql from the existing project.
BEGIN;
DO $preflight$
DECLARE v_missing text; v_public_bucket text;
BEGIN
 SELECT string_agg(x.label,', ') INTO v_missing FROM (VALUES
  ('vp_sec_can(text)',to_regprocedure('public.vp_sec_can(text)')),
  ('vp_sec_my_capabilities()',to_regprocedure('public.vp_sec_my_capabilities()')),
  ('vp_sec_admin_user_directory()',to_regprocedure('public.vp_sec_admin_user_directory()')),
  ('vp_sec_case_visible(bigint)',to_regprocedure('public.vp_sec_case_visible(bigint)')),
  ('vp_sec_visit_visible(bigint)',to_regprocedure('public.vp_sec_visit_visible(bigint)')),
  ('vp8_branch_visible(text)',to_regprocedure('public.vp8_branch_visible(text)'))
 ) AS x(label,oid) WHERE x.oid IS NULL;
 IF v_missing IS NOT NULL THEN
  RAISE EXCEPTION 'P10/P8 prerequisites missing: %. Install the complete verified migrations first.',v_missing;
 END IF;
 IF EXISTS(
  SELECT 1 FROM (VALUES('cases','vp_p10_cases_gate'),('documents','vp_p10_documents_gate'),
  ('forms','vp_p10_forms_gate'),('users','vp_p10_users_gate'),
  ('role_perms','vp_p10_role_perms_gate')) x(tbl,policy)
  WHERE NOT EXISTS(SELECT 1 FROM pg_policies p WHERE p.schemaname='public'
    AND p.tablename=x.tbl AND p.policyname=x.policy AND p.permissive='RESTRICTIVE')
 ) THEN RAISE EXCEPTION 'P10 restrictive policies are missing. Stop; do not paper over incomplete P10.'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects'
   AND policyname='vp_p10_storage_read_gate' AND permissive='RESTRICTIVE') THEN
   RAISE EXCEPTION 'P10 storage read gate missing; stop';
 END IF;
 SELECT string_agg(id,', ') INTO v_public_bucket FROM storage.buckets
 WHERE id IN ('vp-case-docs','vp-field-evidence','vp-report-files') AND public;
 IF v_public_bucket IS NOT NULL THEN
   RAISE EXCEPTION 'Protected storage buckets are public: %',v_public_bucket;
 END IF;
END $preflight$;

-- One authoritative directory for the Role Matrix. Direct role_perms RLS reads
-- are no longer needed to display other roles' permissions.
CREATE OR REPLACE FUNCTION public.vp_sec_admin_role_matrix()
RETURNS TABLE(role_name text, permission text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT r.name,p.perm
 FROM public.roles r
 LEFT JOIN public.role_perms p ON p.org_id=r.org_id AND p.role=r.name
 WHERE r.org_id=(SELECT public.vp_current_org_id())
   AND (SELECT public.vp_sec_can('tenant.admin'))
 ORDER BY r.name,p.perm;
$$;
REVOKE ALL ON FUNCTION public.vp_sec_admin_role_matrix() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_sec_admin_role_matrix() TO authenticated;

-- Case access is tenant-scoped. For general viewers/QC/sign-off, branch allocation
-- is required unless the user is a tenant administrator. An explicitly ASSIGNED
-- Field Officer can still open their own visit even without a branch allocation.
-- Operational permissions remain required in all cases.
CREATE OR REPLACE FUNCTION public.vp_sec_case_visible(p_case_num bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS (
   SELECT 1 FROM public.cases c
   WHERE c.org_id=(SELECT public.vp_current_org_id())
     AND c.num=p_case_num
     AND (
       (public.vp8_branch_visible(c.meta->>'branch_id') AND
         ((SELECT public.vp_sec_can('cases.View'))
          OR (SELECT public.vp_sec_can('qc.View'))
          OR (SELECT public.vp_sec_can('signoff.View'))))
       OR
       (((SELECT public.vp_sec_can('field.View')) OR
         (SELECT public.vp_sec_can('field.Check In/Out')))
         AND EXISTS (
           SELECT 1 FROM public.vp_site_visits v
           WHERE v.org_id=c.org_id AND v.num=c.num
             AND v.assigned_user_id=(SELECT public.vp_field_my_user_id())
         ))
     )
 );
$$;

CREATE OR REPLACE FUNCTION public.vp_sec_visit_visible(p_visit_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS (
   SELECT 1 FROM public.vp_site_visits v
   JOIN public.cases c ON c.org_id=v.org_id AND c.num=v.num
   WHERE v.org_id=(SELECT public.vp_current_org_id())
     AND v.id=p_visit_id
     AND (
       (public.vp8_branch_visible(c.meta->>'branch_id')
        AND ((SELECT public.vp_sec_can('field.View'))
         OR (SELECT public.vp_sec_can('field.Assign'))
         OR (SELECT public.vp_sec_can('qc.View'))))
       OR ((SELECT public.vp_sec_can('field.Check In/Out'))
         AND v.assigned_user_id=(SELECT public.vp_field_my_user_id()))
     )
 );
$$;

-- Preserve original P10 executor grants, explicitly deny anonymous calls.
REVOKE ALL ON FUNCTION public.vp_sec_case_visible(bigint),
 public.vp_sec_visit_visible(bigint) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_sec_case_visible(bigint),
 public.vp_sec_visit_visible(bigint) TO authenticated;
COMMIT;
NOTIFY pgrst, 'reload schema';
