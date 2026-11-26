-- P13 optional role grant: ADASOL Back Office dashboard statistics.
-- Review with tenant owner; changes access for ALL users with Back Office role.
-- Run in STAGING and check before promoting to production.
BEGIN;
DO $check$
DECLARE v_org_id bigint;
BEGIN
  SELECT id INTO v_org_id FROM public.orgs
  WHERE code = 'ADASOL' AND status = 'active';
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Active ADASOL organization not found';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.roles
      WHERE org_id = v_org_id AND name = 'Back Office') THEN
    RAISE EXCEPTION 'Back Office role is not configured in ADASOL';
  END IF;
  IF to_regprocedure('public.vp_sec_can(text)') IS NULL OR
     to_regprocedure('public.vp_sec_my_capabilities()') IS NULL THEN
    RAISE EXCEPTION 'P10 role-based security functions are missing';
  END IF;
END $check$;

INSERT INTO public.role_perms (org_id, role, perm)
SELECT o.id, 'Back Office', 'analytics.View'
FROM public.orgs o
WHERE o.code = 'ADASOL' AND o.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM public.role_perms rp
    WHERE rp.org_id = o.id AND rp.role = 'Back Office'
      AND rp.perm = 'analytics.View'
  )
ON CONFLICT DO NOTHING;
COMMIT;

-- If all checks pass, current Back Office users must sign out and sign in again.
SELECT o.code AS tenant, rp.role, rp.perm
FROM public.role_perms rp JOIN public.orgs o ON o.id = rp.org_id
WHERE o.code = 'ADASOL' AND rp.role = 'Back Office'
ORDER BY rp.perm;
