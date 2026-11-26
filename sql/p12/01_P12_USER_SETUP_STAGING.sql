-- ValuationPro P12: correct incomplete ADASOL role catalogue and supply an
-- authenticated, current-tenant admin user-setup catalogue for UI + Edge Function.
-- Run in STAGING after backup and the complete P10/P11 security migrations.
-- Does not change existing users, tenant roles, permissions, assignments or branches.
-- Adds missing role names to ADASOL only, without granting operational permissions.
BEGIN;

DO $p12$
DECLARE v_org bigint; v_n integer;
BEGIN
  IF to_regprocedure('public.vp_sec_can(text)') IS NULL
      OR to_regprocedure('public.vp_sec_admin_user_directory()') IS NULL
      OR to_regprocedure('public.vp_sec_admin_role_matrix()') IS NULL
      OR to_regclass('public.vp_branches') IS NULL THEN
    RAISE EXCEPTION 'P10 security prerequisites missing. Stop and verify full P10/P11 migrations.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='users'
      AND policyname='vp_p10_users_gate' AND permissive='RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'P10 restrictive user policy missing; verify P10 before enabling user provisioning';
  END IF;

  SELECT COUNT(*), MIN(id) INTO v_n, v_org
  FROM public.orgs WHERE code='ADASOL' AND status='active';
  IF v_n <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one active ADASOL tenant, found %',v_n;
  END IF;

  -- Do not seed into the wrong organization: require the linked administrator
  -- to belong to ADASOL, not merely have a similar email in another tenant.
  IF NOT EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.valuation_auth_links l ON l.user_id=u.id
    JOIN auth.users a ON a.id=l.auth_uid
    WHERE u.org_id=v_org AND u.active IS TRUE
      AND lower(btrim(u.login))='kranthisamin@gmail.com'
      AND lower(btrim(a.email))=lower(btrim(u.login))
  ) THEN
    RAISE EXCEPTION 'The named administrator is not an active, Auth-linked member of ADASOL. Review user/org mapping first.';
  END IF;

  INSERT INTO public.roles(org_id,name)
  SELECT v_org, x.name
  FROM unnest(ARRAY[
    'Tenant Owner','Tenant Admin','Branch Admin','Back Office',
    'Checker','Field Officer','Accounts','Manager'
  ]) AS x(name)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.roles r WHERE r.org_id=v_org AND r.name=x.name
  )
  ON CONFLICT DO NOTHING;
END $p12$;

CREATE OR REPLACE FUNCTION public.vp_sec_admin_user_setup()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $fn$
DECLARE
  v_org bigint := public.vp_current_org_id();
  v_role text;
  v_result jsonb;
BEGIN
  IF v_org IS NULL OR NOT public.vp_sec_can('tenant.admin') THEN
    RAISE EXCEPTION 'Tenant administrator permission required'
      USING ERRCODE='42501';
  END IF;

  SELECT u.role INTO v_role
  FROM public.users u
  JOIN public.valuation_auth_links l ON l.user_id=u.id
  WHERE l.auth_uid = (SELECT auth.uid())
    AND u.org_id=v_org AND u.active IS TRUE
  LIMIT 1;
  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Active, linked tenant user required'
      USING ERRCODE='42501';
  END IF;

  SELECT jsonb_build_object(
    'org_id', v_org::text,
    'roles', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'name', r.name,
        'privileged', (r.name='Tenant Owner' OR EXISTS (
          SELECT 1 FROM public.role_perms rp WHERE rp.org_id=r.org_id
             AND rp.role=r.name AND rp.perm='tenant.admin'
        )),
        'assignable', (v_role='Tenant Owner' OR (
          r.name <> 'Tenant Owner' AND NOT EXISTS (
            SELECT 1 FROM public.role_perms rp WHERE rp.org_id=r.org_id
               AND rp.role=r.name AND rp.perm='tenant.admin'
          )
        ))
      ) ORDER BY r.name)
      FROM public.roles r WHERE r.org_id=v_org
    ), '[]'::jsonb),
    'branches', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', b.id::text, 'name', b.name, 'code', b.code,
        'is_active', b.is_active
      ) ORDER BY b.name)
      FROM public.vp_branches b WHERE b.org_id=v_org
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$fn$;

REVOKE ALL ON FUNCTION public.vp_sec_admin_user_setup() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vp_sec_admin_user_setup() TO authenticated;
COMMIT;
NOTIFY pgrst, 'reload schema';
