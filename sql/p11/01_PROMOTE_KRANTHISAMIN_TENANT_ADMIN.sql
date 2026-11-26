-- Targeted role recovery for one existing, email-confirmed Auth user.
-- Review 00_AUDIT_READONLY.sql first to confirm the org and account match.
-- Does not create organizations/users, change active status, or grant operational modules.
-- Uses the exact existing Auth -> ValuationPro user -> tenant mapping.
BEGIN;
DO $promote$
DECLARE
 v_email constant text := 'kranthisamin@gmail.com';
 v_auth_uid uuid;
 v_user_id bigint;
 v_org_id bigint;
 v_code text;
 v_role text;
 v_active boolean;
 v_login text;
 v_count integer;
BEGIN
 SELECT count(*) INTO v_count FROM auth.users WHERE lower(btrim(email))=v_email;
 IF v_count<>1 THEN
   RAISE EXCEPTION 'Expected exactly one Auth record for %, found %. Stop; no changes applied.',v_email,v_count;
 END IF;
 SELECT a.id INTO v_auth_uid FROM auth.users a
 WHERE lower(btrim(a.email))=v_email AND a.email_confirmed_at IS NOT NULL;
 IF v_auth_uid IS NULL THEN
   RAISE EXCEPTION 'Auth user % must have verified email; no changes applied',v_email;
 END IF;
 SELECT u.id,u.org_id,o.code,u.role,u.active,u.login
 INTO v_user_id,v_org_id,v_code,v_role,v_active,v_login
 FROM public.valuation_auth_links l
 JOIN public.users u ON u.id=l.user_id
 JOIN public.orgs o ON o.id=u.org_id AND o.status='active'
 WHERE l.auth_uid=v_auth_uid;
 IF NOT FOUND THEN
   RAISE EXCEPTION 'User is not linked to an active ValuationPro tenant. Do not create a duplicate account.';
 END IF;
 IF lower(btrim(v_login))<>v_email THEN
   RAISE EXCEPTION 'Auth email and ValuationPro login differ: % vs %. Review manually.',v_email,v_login;
 END IF;
 IF v_active IS DISTINCT FROM true THEN
   RAISE EXCEPTION 'User is inactive; review suspension separately instead of silently reactivating';
 END IF;
 IF v_role='Tenant Owner' THEN
   RAISE EXCEPTION 'Account is Tenant Owner. Refusing to demote owner to Tenant Admin';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM public.roles r
   WHERE r.org_id=v_org_id AND r.name='Tenant Admin') THEN
   RAISE EXCEPTION 'Tenant Admin role does not exist in tenant %; inspect setup',v_code;
 END IF;
 -- Role grants apply to the tenant's Tenant Admin role, not only this user.
 INSERT INTO public.role_perms(org_id,role,perm)
 VALUES(v_org_id,'Tenant Admin','tenant.admin')
 ON CONFLICT DO NOTHING;
 UPDATE public.users SET role='Tenant Admin'
 WHERE id=v_user_id AND org_id=v_org_id;
 RAISE NOTICE 'Updated existing user %, ID %, organization code %, role % -> Tenant Admin',
 v_email,v_user_id,v_code,v_role;
END
$promote$;
COMMIT;
NOTIFY pgrst, 'reload schema';

-- Confirm exact user and tenant after running:
SELECT o.code AS tenant_code,u.id::text AS user_id,u.login,u.role,u.active,
  EXISTS(SELECT 1 FROM public.role_perms rp
    WHERE rp.org_id=u.org_id AND rp.role=u.role AND rp.perm='tenant.admin') AS admin_permission
FROM public.users u JOIN public.orgs o ON o.id=u.org_id
WHERE lower(btrim(u.login))='kranthisamin@gmail.com';
