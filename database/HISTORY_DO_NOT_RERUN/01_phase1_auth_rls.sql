-- ValuationPro Phase 1 | existing 16-table BIGINT schema | non-destructive
-- Run as postgres in Supabase SQL Editor. Read entirely before execution.
-- No existing table, column, key, or business-stage CHECK constraint is changed.
BEGIN;

-- Fail closed if other policies appeared since the user's inspection; permissive
-- policies combine with OR and could undermine the intended tenant boundary.
DO $$
DECLARE v_unknown text;
BEGIN
  SELECT string_agg(format('%I.%I / %I',schemaname,tablename,policyname), ', ')
    INTO v_unknown
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = ANY(ARRAY[
    'audit','banks','cases','documents','expenses','extractions','forms','invoices',
    'log','org_settings','orgs','role_perms','roles','settings','trips','users'])
    AND policyname NOT IN (
      'vp_member_select','vp_admin_insert','vp_admin_update','vp_admin_delete',
      'vp_org_select','vp_org_update','vp_audit_select','vp_user_select',
      'vp_roles_select','vp_perms_select','vp_auth_member_select');
  IF v_unknown IS NOT NULL THEN
    RAISE EXCEPTION 'Review existing RLS policies before deploying Phase 1: %',v_unknown;
  END IF;
  IF (SELECT count(*) FROM information_schema.tables WHERE table_schema='public'
        AND table_type='BASE TABLE' AND table_name = ANY(ARRAY[
    'audit','banks','cases','documents','expenses','extractions','forms','invoices',
    'log','org_settings','orgs','role_perms','roles','settings','trips','users'])) <> 16 THEN
    RAISE EXCEPTION 'The required 16 live tables are not all present';
  END IF;
  -- Both organizations and users are inserted without explicit IDs.
  -- The inspected column_default was NULL, which is normal for IDENTITY,
  -- but an ID generator must actually exist.
  IF EXISTS (
    SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema='public' AND c.table_name IN ('orgs','users')
      AND c.column_name='id'
      AND c.is_identity <> 'YES' AND c.column_default IS NULL
  ) THEN
    RAISE EXCEPTION 'orgs.id and users.id need existing IDENTITY/default generators; inspect before running Phase 1';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.valuation_auth_links (
  auth_uid uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id bigint NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.valuation_auth_links ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.valuation_auth_links FROM PUBLIC, anon, authenticated;

-- Helper functions run under the SQL migration owner, read exact auth identity,
-- and do not trust any client-provided org_id or editable JWT metadata.
CREATE OR REPLACE FUNCTION public.vp_current_org_id()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT u.org_id FROM public.valuation_auth_links l
  JOIN public.users u ON u.id=l.user_id
  JOIN public.orgs o ON o.id=u.org_id
  WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE AND o.status='active'
  LIMIT 1;
$$;
CREATE OR REPLACE FUNCTION public.vp_is_member(p_org_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p_org_id IS NOT NULL AND p_org_id=(SELECT public.vp_current_org_id());
$$;
CREATE OR REPLACE FUNCTION public.vp_is_admin(p_org_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.valuation_auth_links l
    JOIN public.users u ON u.id=l.user_id
    JOIN public.orgs o ON o.id=u.org_id
    JOIN public.role_perms p ON p.org_id=u.org_id AND p.role=u.role
    WHERE l.auth_uid=(SELECT auth.uid()) AND u.org_id=p_org_id
      AND u.active IS TRUE AND o.status='active' AND p.perm='tenant.admin');
$$;

-- Remove only policies owned by the previous ValuationPro draft if present.
DO $$
DECLARE t text; policy_name text;
BEGIN
  FOREACH t IN ARRAY ARRAY['audit','banks','cases','documents','expenses','extractions',
    'forms','invoices','log','org_settings','orgs','role_perms','roles','settings','trips','users'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
    FOREACH policy_name IN ARRAY ARRAY['vp_member_select','vp_admin_insert','vp_admin_update',
      'vp_admin_delete','vp_org_select','vp_org_update','vp_audit_select',
      'vp_user_select','vp_roles_select','vp_perms_select','vp_auth_member_select'] LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, t);
    END LOOP;
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated',t);
  END LOOP;
END $$;

-- Operational tables: tenant members can read their own rows. All browser writes
-- remain closed in Phase 1; each later module will add narrowly scoped write
-- policies and validated server operations after its workflow is verified.
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['banks','cases','documents','expenses','extractions',
    'forms','invoices','org_settings','trips'] LOOP
    EXECUTE format('CREATE POLICY vp_member_select ON public.%I FOR SELECT TO authenticated USING ((SELECT public.vp_current_org_id())=org_id)',t);
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated',t);
  END LOOP;
END $$;

-- Sensitive identity and permission tables: ONLY RPC functions can write.
CREATE POLICY vp_org_select ON public.orgs FOR SELECT TO authenticated
  USING ((SELECT public.vp_current_org_id())=id);
GRANT SELECT ON public.orgs TO authenticated;
CREATE POLICY vp_user_select ON public.users FOR SELECT TO authenticated
  USING ((SELECT public.vp_current_org_id())=org_id);
-- IMPORTANT: never grant browser access to legacy users.pw.
GRANT SELECT (id, org_id, login, name, role, active, last_login)
  ON public.users TO authenticated;
CREATE POLICY vp_roles_select ON public.roles FOR SELECT TO authenticated
  USING ((SELECT public.vp_current_org_id())=org_id);
GRANT SELECT ON public.roles TO authenticated;
CREATE POLICY vp_perms_select ON public.role_perms FOR SELECT TO authenticated
  USING ((SELECT public.vp_current_org_id())=org_id);
GRANT SELECT ON public.role_perms TO authenticated;
CREATE POLICY vp_member_select ON public.log FOR SELECT TO authenticated
  USING ((SELECT public.vp_current_org_id())=org_id);
GRANT SELECT ON public.log TO authenticated;
CREATE POLICY vp_audit_select ON public.audit FOR SELECT TO authenticated
  USING (public.vp_is_admin(org_id));
GRANT SELECT ON public.audit TO authenticated;
-- settings is global: no browser access; links are private: no browser access.
REVOKE ALL ON TABLE public.settings, public.valuation_auth_links FROM PUBLIC, anon, authenticated;

-- Signed-in app context returns only fields needed to render the existing UI.
CREATE OR REPLACE FUNCTION public.vp_my_context()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT jsonb_build_object(
    'org_id',o.id::text, 'org_name',o.name,'org_code',o.code,
    'org_type',o.type,'user_id',u.id::text,'user_name',u.name,
    'email',u.login,'role',u.role,
    'is_admin',EXISTS(SELECT 1 FROM public.role_perms p WHERE p.org_id=u.org_id
      AND p.role=u.role AND p.perm='tenant.admin'))
  FROM public.valuation_auth_links l
  JOIN public.users u ON u.id=l.user_id
  JOIN public.orgs o ON o.id=u.org_id
  WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE AND o.status='active'
  LIMIT 1;
$$;

-- Safe bigint-as-text API for the existing Users screen; invokes its own RLS.
CREATE OR REPLACE FUNCTION public.vp_list_users()
RETURNS TABLE(id text,org_id text,login text,name text,role text,active boolean,last_login timestamptz)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$
  SELECT u.id::text,u.org_id::text,u.login,u.name,u.role,u.active,u.last_login
  FROM public.users u WHERE u.org_id=(SELECT public.vp_current_org_id())
  ORDER BY u.name;
$$;

-- Distinguishes accounts awaiting onboarding from disabled users/tenants.
CREATE OR REPLACE FUNCTION public.vp_account_status()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT CASE
    WHEN NOT EXISTS(SELECT 1 FROM public.valuation_auth_links WHERE auth_uid=(SELECT auth.uid()))
      THEN 'unlinked'
    WHEN EXISTS(SELECT 1 FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id
      JOIN public.orgs o ON o.id=u.org_id WHERE l.auth_uid=(SELECT auth.uid())
      AND (u.active IS NOT TRUE OR o.status<>'active')) THEN 'suspended'
    ELSE 'active' END;
$$;

-- Self-onboarding: verified Supabase email, one auth identity per tenant;
-- agency type is fixed (not accepted from browser). Atomic transaction.
CREATE OR REPLACE FUNCTION public.vp_register_agency(p_code text,p_name text)
RETURNS text LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_uid uuid := auth.uid(); v_email text; v_org bigint; v_user bigint;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT lower(email) INTO v_email FROM auth.users
    WHERE id=v_uid AND email_confirmed_at IS NOT NULL;
  IF v_email IS NULL THEN RAISE EXCEPTION 'A verified email is required'; END IF;
  IF p_code IS NULL OR p_code !~ '^[A-Z]{2,6}$' THEN
    RAISE EXCEPTION 'Organization code must be 2 to 6 uppercase letters'; END IF;
  IF length(btrim(coalesce(p_name,''))) < 3 OR length(p_name) > 200 THEN
    RAISE EXCEPTION 'Organization name must be 3 to 200 characters'; END IF;
  IF EXISTS (SELECT 1 FROM public.valuation_auth_links WHERE auth_uid=v_uid)
     OR EXISTS (SELECT 1 FROM public.users WHERE login=v_email) THEN
    RAISE EXCEPTION 'This identity is already provisioned'; END IF;
  INSERT INTO public.orgs(name,code,type,status)
    VALUES (btrim(p_name),p_code,'agency','active') RETURNING id INTO v_org;
  INSERT INTO public.roles(org_id,name)
    SELECT v_org, r.name FROM unnest(ARRAY['Tenant Owner','Tenant Admin','Branch Admin',
       'Back Office','Checker','Field Officer','Accounts','Manager']) AS r(name);
  INSERT INTO public.role_perms(org_id,role,perm) VALUES
    (v_org,'Tenant Owner','tenant.admin'),(v_org,'Tenant Admin','tenant.admin');
  -- Legacy pw is NOT NULL. Sentinel is never an actual password or verifier.
  INSERT INTO public.users(org_id,login,name,role,pw,active)
    VALUES (v_org,v_email,split_part(v_email,'@',1),'Tenant Owner','SUPABASE_AUTH_ONLY',true)
    RETURNING id INTO v_user;
  INSERT INTO public.valuation_auth_links(auth_uid,user_id) VALUES(v_uid,v_user);
  RETURN v_org::text;
END; $$;

-- Add an existing, email-confirmed Supabase Auth identity to the caller's
-- agency. Create/invite the Auth identity in the dashboard first.
CREATE OR REPLACE FUNCTION public.vp_admin_attach_auth_user(p_email text,p_name text,p_role text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint := public.vp_current_org_id(); v_uid uuid; v_login text; v_id bigint;
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF length(btrim(coalesce(p_name,''))) < 2 THEN RAISE EXCEPTION 'Name is required'; END IF;
  IF p_role='Tenant Owner' AND NOT EXISTS (
     SELECT 1 FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id
     WHERE l.auth_uid=auth.uid() AND u.role='Tenant Owner') THEN
     RAISE EXCEPTION 'Only the Tenant Owner may assign that role'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.roles WHERE org_id=v_org AND name=p_role)
    THEN RAISE EXCEPTION 'Role is not configured in this organization'; END IF;
  IF EXISTS(SELECT 1 FROM public.role_perms WHERE org_id=v_org AND role=p_role AND perm='tenant.admin')
    AND NOT EXISTS (SELECT 1 FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id
      WHERE l.auth_uid=auth.uid() AND u.role='Tenant Owner') THEN
    RAISE EXCEPTION 'Only the Tenant Owner can add administrator accounts'; END IF;
  SELECT id,lower(email) INTO v_uid,v_login FROM auth.users
    WHERE lower(email)=lower(btrim(p_email)) AND email_confirmed_at IS NOT NULL LIMIT 1;
  IF v_uid IS NULL THEN RAISE EXCEPTION 'First create or invite and verify the user in Supabase Authentication'; END IF;
  IF EXISTS(SELECT 1 FROM public.valuation_auth_links WHERE auth_uid=v_uid)
     OR EXISTS(SELECT 1 FROM public.users WHERE login=v_login) THEN
     RAISE EXCEPTION 'That account is already linked'; END IF;
  INSERT INTO public.users(org_id,login,name,role,pw,active)
    VALUES(v_org,v_login,btrim(p_name),p_role,'SUPABASE_AUTH_ONLY',true) RETURNING id INTO v_id;
  INSERT INTO public.valuation_auth_links(auth_uid,user_id) VALUES(v_uid,v_id);
  RETURN v_id::text;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_admin_set_user_active(p_user_id bigint,p_active boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_target public.users%ROWTYPE; v_self bigint;
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Admin access required'; END IF;
  SELECT u.id INTO v_self FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id WHERE l.auth_uid=auth.uid();
  SELECT * INTO v_target FROM public.users WHERE org_id=v_org AND id=p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'User not found in your organization'; END IF;
  IF v_target.id=v_self AND p_active=false THEN RAISE EXCEPTION 'Cannot suspend yourself'; END IF;
  IF v_target.role='Tenant Owner' AND p_active=false THEN RAISE EXCEPTION 'Tenant Owner cannot be suspended'; END IF;
  IF EXISTS(SELECT 1 FROM public.role_perms WHERE org_id=v_org AND role=v_target.role AND perm='tenant.admin')
      AND NOT EXISTS (SELECT 1 FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id
        WHERE l.auth_uid=auth.uid() AND u.role='Tenant Owner') THEN
    RAISE EXCEPTION 'Only the Tenant Owner can change administrator status'; END IF;
  UPDATE public.users SET active=p_active WHERE id=v_target.id AND org_id=v_org;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_admin_set_user_role(p_user_id bigint,p_role text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_target public.users%ROWTYPE; v_caller_role text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Admin access required'; END IF;
  SELECT u.role INTO v_caller_role FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id WHERE l.auth_uid=auth.uid();
  SELECT * INTO v_target FROM public.users WHERE org_id=v_org AND id=p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'User not found in your organization'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.roles WHERE org_id=v_org AND name=p_role)
    THEN RAISE EXCEPTION 'Unknown tenant role'; END IF;
  IF v_target.role='Tenant Owner' OR p_role='Tenant Owner' THEN
    RAISE EXCEPTION 'Tenant Owner role cannot be reassigned'; END IF;
  IF (EXISTS(SELECT 1 FROM public.role_perms WHERE org_id=v_org AND role=p_role AND perm='tenant.admin')
       OR EXISTS(SELECT 1 FROM public.role_perms WHERE org_id=v_org AND role=v_target.role AND perm='tenant.admin'))
     AND v_caller_role <> 'Tenant Owner' THEN
    RAISE EXCEPTION 'Only the Tenant Owner can modify administrator assignments'; END IF;
  UPDATE public.users SET role=p_role WHERE org_id=v_org AND id=p_user_id;
END; $$;

-- Permission matrix operations; only allowed UI module and action names.
CREATE OR REPLACE FUNCTION public.vp_admin_replace_module_permissions(
  p_role text,p_module text,p_actions text[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actions text[]:=coalesce(p_actions,ARRAY[]::text[]);
 v_allowed text[]; v_caller_role text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Admin access required'; END IF;
  SELECT u.role INTO v_caller_role FROM public.valuation_auth_links l JOIN public.users u ON u.id=l.user_id WHERE l.auth_uid=auth.uid();
  IF p_role='Tenant Owner' AND v_caller_role<>'Tenant Owner' THEN
    RAISE EXCEPTION 'Only the Tenant Owner can edit owner permissions'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.roles WHERE org_id=v_org AND name=p_role)
    THEN RAISE EXCEPTION 'Unknown role'; END IF;
  v_allowed := CASE p_module
    WHEN 'cases' THEN ARRAY['View','Create','Edit','Delete','Assign','Approve','Export']
    WHEN 'field' THEN ARRAY['View','Assign','Check In/Out','Manage Geofence','Export']
    WHEN 'qc' THEN ARRAY['View','Approve','Return','Edit','Export']
    WHEN 'signoff' THEN ARRAY['View','Generate','Manage Templates'] -- no unverified IBBI signing
    WHEN 'billing' THEN ARRAY['View','Create','Approve','Export']
    WHEN 'admin' THEN ARRAY['View','Manage Users','Manage Roles','Edit Settings','Audit Logs']
    ELSE NULL END;
  IF v_allowed IS NULL OR EXISTS (SELECT 1 FROM unnest(v_actions) AS a(action)
    WHERE a.action IS NULL OR a.action<>ALL(v_allowed)) THEN
    RAISE EXCEPTION 'Unknown module/action or restricted sign-off permission'; END IF;
  DELETE FROM public.role_perms WHERE org_id=v_org AND role=p_role AND perm LIKE p_module||'.%';
  INSERT INTO public.role_perms(org_id,role,perm)
    SELECT v_org,p_role,p_module||'.'||a.action FROM unnest(v_actions) AS a(action) ON CONFLICT DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_admin_clone_role(p_source text,p_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Admin access required'; END IF;
  IF length(btrim(coalesce(p_name,'')))<2 OR length(p_name)>80 THEN RAISE EXCEPTION 'Invalid role name'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE org_id=v_org AND name=p_source)
    THEN RAISE EXCEPTION 'Source role not found'; END IF;
  INSERT INTO public.roles(org_id,name) VALUES(v_org,btrim(p_name));
  INSERT INTO public.role_perms(org_id,role,perm)
    SELECT v_org,btrim(p_name),perm FROM public.role_perms
      WHERE org_id=v_org AND role=p_source AND perm<>'tenant.admin'
        AND perm<>'signoff.Sign';
END; $$;

-- This app must never authenticate against users.pw. Only Supabase Auth is used.
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS signature FROM pg_proc p
    JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname=ANY(ARRAY[
       'vp_current_org_id','vp_is_member','vp_is_admin','vp_my_context','vp_account_status','vp_list_users',
       'vp_register_agency','vp_admin_attach_auth_user','vp_admin_set_user_active',
       'vp_admin_set_user_role','vp_admin_replace_module_permissions','vp_admin_clone_role']) LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon',f.signature);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.signature);
  END LOOP;
END $$;
COMMIT;
