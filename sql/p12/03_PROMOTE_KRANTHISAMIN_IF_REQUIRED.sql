-- OPTIONAL: run only after P12 role seeding, and after verifying the identity/org
-- in 00_READ_ONLY_DIAGNOSIS.sql. Intentionally targets ADASOL only.
-- This is an explicit administrative role change, not a routine migration.
BEGIN;
DO $promote$
DECLARE
  v_uid uuid;
  v_user bigint;
  v_org bigint;
  v_role text;
  v_active boolean;
  v_login text;
BEGIN
  SELECT id INTO STRICT v_uid FROM auth.users
    WHERE lower(btrim(email))='kranthisamin@gmail.com'
      AND email_confirmed_at IS NOT NULL;
  SELECT u.id,u.org_id,u.role,u.active,u.login
  INTO STRICT v_user,v_org,v_role,v_active,v_login
  FROM public.valuation_auth_links l
  JOIN public.users u ON u.id=l.user_id
  JOIN public.orgs o ON o.id=u.org_id
  WHERE l.auth_uid=v_uid AND o.code='ADASOL' AND o.status='active';
  IF v_active IS DISTINCT FROM true OR lower(btrim(v_login)) <> 'kranthisamin@gmail.com' THEN
    RAISE EXCEPTION 'Inactive user or mismatched email: stop';
  END IF;
  IF v_role='Tenant Owner' THEN
    RAISE EXCEPTION 'Do not demote the Tenant Owner';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE org_id=v_org AND name='Tenant Admin') THEN
    RAISE EXCEPTION 'Tenant Admin role missing in ADASOL. Run 01_P12_USER_SETUP_STAGING.sql first';
  END IF;
  INSERT INTO public.role_perms(org_id,role,perm)
    VALUES(v_org,'Tenant Admin','tenant.admin') ON CONFLICT DO NOTHING;
  UPDATE public.users SET role='Tenant Admin' WHERE id=v_user AND org_id=v_org;
  RAISE NOTICE 'Verified ADASOL user % now has Tenant Admin role',v_user;
EXCEPTION WHEN NO_DATA_FOUND THEN
  RAISE EXCEPTION 'Auth user or ADASOL membership not found; do not create duplicate users';
WHEN TOO_MANY_ROWS THEN
  RAISE EXCEPTION 'Duplicate Auth accounts or memberships; manual review needed';
END $promote$;
COMMIT;
NOTIFY pgrst, 'reload schema';
