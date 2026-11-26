-- ValuationPro Phase 2: Case Management | existing 16-table BIGINT schema
-- PRECONDITION: Phase 1 auth/RLS migration was successfully applied.
-- No existing table, PK, FK, CHECK, workflow stage, or valuation formula is replaced.
-- New: branch master + per-bank/property tariffs; documents.storage_path (nullable).
-- RPCs, not client-supplied org_id, perform all writes. Run as postgres in SQL Editor.
BEGIN;
DO $$
BEGIN
  IF to_regclass('public.valuation_auth_links') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_is_admin(bigint)') IS NULL THEN
    RAISE EXCEPTION 'Phase 1 is required. Apply/verify the Phase 1 migration first.';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='documents' AND column_name='storage_path'
      AND data_type<>'text') THEN
    RAISE EXCEPTION 'documents.storage_path already exists with a different type; investigate first';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema='public' AND c.table_name IN ('log','documents') AND c.column_name='id'
      AND c.is_identity<>'YES' AND c.column_default IS NULL) THEN
    RAISE EXCEPTION 'Existing log/documents IDs have no default generator; inspect before enabling Phase 2 writes';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns c WHERE c.table_schema='public'
    AND c.table_name='cases' AND c.column_name IN ('org_id','num','cust','bank','br','prod','addr','stage','team','due','meta')
    GROUP BY c.table_name HAVING count(*)<>11) THEN
    RAISE EXCEPTION 'Unexpected cases table structure';
  END IF;
  IF to_regclass('storage.buckets') IS NULL OR to_regclass('storage.objects') IS NULL THEN
    RAISE EXCEPTION 'Supabase Storage schema is missing';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.vp_branches (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL REFERENCES public.orgs(id),
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 200),
  code text NOT NULL CHECK (code ~ '^[A-Z0-9]{2,12}$'),
  branch_type text NOT NULL DEFAULT 'Local' CHECK (branch_type IN ('Head Office','Regional','Local')),
  city text NOT NULL CHECK (length(btrim(city))>0),
  state text NOT NULL DEFAULT '',
  pin text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  manager_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  case_prefix text NOT NULL CHECK (case_prefix ~ '^[A-Z0-9]{2,8}$'),
  geofence_km numeric NOT NULL DEFAULT 0 CHECK (geofence_km >= 0),
  tat_days integer NOT NULL DEFAULT 3 CHECK (tat_days BETWEEN 1 AND 365),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id,id), UNIQUE(org_id,code)
);
CREATE TABLE IF NOT EXISTS public.vp_bank_rate_cards (
  org_id bigint NOT NULL,
  bank_name text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('House','Flat','Land','Commercial')),
  fee numeric NOT NULL CHECK (fee >= 0),
  tat_days integer NOT NULL CHECK (tat_days BETWEEN 1 AND 365),
  PRIMARY KEY(org_id,bank_name,property_type),
  FOREIGN KEY(org_id,bank_name) REFERENCES public.banks(org_id,name) ON UPDATE CASCADE
);
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS storage_path text;
CREATE UNIQUE INDEX IF NOT EXISTS vp_documents_org_storage_path_uk
  ON public.documents(org_id,storage_path) WHERE storage_path IS NOT NULL;

-- Explicit grant + RLS; nothing here gives anonymous access.
ALTER TABLE public.vp_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_bank_rate_cards ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.vp_branches, public.vp_bank_rate_cards FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.vp_branches,public.vp_bank_rate_cards TO authenticated;
GRANT ALL ON TABLE public.vp_branches,public.vp_bank_rate_cards TO service_role;
DROP POLICY IF EXISTS vp_phase2_branch_read ON public.vp_branches;
CREATE POLICY vp_phase2_branch_read ON public.vp_branches FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()));
DROP POLICY IF EXISTS vp_phase2_tariff_read ON public.vp_bank_rate_cards;
CREATE POLICY vp_phase2_tariff_read ON public.vp_bank_rate_cards FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()));

-- Fixed allow-list of actions; Tenant Owner/Admin via tenant.admin, other roles via Phase 1 Role Matrix.
CREATE OR REPLACE FUNCTION public.vp_can_case_action(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT p_action=ANY(ARRAY['Create','Edit','Assign']) AND EXISTS (
    SELECT 1 FROM public.valuation_auth_links l
      JOIN public.users u ON u.id=l.user_id
      JOIN public.orgs o ON o.id=u.org_id
      JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
    WHERE l.auth_uid=(SELECT auth.uid()) AND u.active=true AND o.status='active'
      AND rp.perm=ANY(ARRAY['tenant.admin','cases.'||p_action]));
$$;

-- Agency branch master. No demo rows inserted. Readable for any active tenant member.
CREATE OR REPLACE FUNCTION public.vp_admin_save_branch(
  p_id bigint, p_name text,p_code text,p_type text,p_city text,p_state text,
  p_pin text,p_address text,p_manager text,p_email text,p_phone text,
  p_prefix text,p_tat_days integer,p_geofence_km numeric,p_active boolean)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_id bigint;
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Tenant admin required'; END IF;
  IF p_code !~ '^[A-Z0-9]{2,12}$' OR p_prefix !~ '^[A-Z0-9]{2,8}$'
    THEN RAISE EXCEPTION 'Invalid branch code or case prefix'; END IF;
  IF p_type NOT IN ('Head Office','Regional','Local') THEN RAISE EXCEPTION 'Invalid branch type'; END IF;
  IF length(btrim(coalesce(p_name,'')))<2 OR length(btrim(coalesce(p_city,'')))<1
    THEN RAISE EXCEPTION 'Branch name and city are required'; END IF;
  IF p_tat_days NOT BETWEEN 1 AND 365 OR p_geofence_km IS NULL OR p_geofence_km<0
    THEN RAISE EXCEPTION 'Invalid TAT or geofence'; END IF;
  IF p_id IS NULL THEN
    INSERT INTO public.vp_branches(org_id,name,code,branch_type,city,state,pin,address,
      manager_name,email,phone,case_prefix,tat_days,geofence_km,is_active)
    VALUES(v_org,btrim(p_name),p_code,p_type,btrim(p_city),coalesce(p_state,''),
      coalesce(p_pin,''),coalesce(p_address,''),coalesce(p_manager,''),
      coalesce(p_email,''),coalesce(p_phone,''),p_prefix,p_tat_days,p_geofence_km,coalesce(p_active,true))
    RETURNING id INTO v_id;
  ELSE
    UPDATE public.vp_branches SET name=btrim(p_name),code=p_code,branch_type=p_type,
      city=btrim(p_city),state=coalesce(p_state,''),pin=coalesce(p_pin,''),
      address=coalesce(p_address,''),manager_name=coalesce(p_manager,''),
      email=coalesce(p_email,''),phone=coalesce(p_phone,''),case_prefix=p_prefix,
      tat_days=p_tat_days,geofence_km=p_geofence_km,is_active=coalesce(p_active,true)
    WHERE org_id=v_org AND id=p_id RETURNING id INTO v_id;
    IF v_id IS NULL THEN RAISE EXCEPTION 'Branch not found in your organization'; END IF;
  END IF;
  RETURN v_id::text;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_admin_save_bank(p_name text,p_kind text,p_rate numeric,p_alias text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Tenant admin required'; END IF;
  IF length(btrim(coalesce(p_name,'')))<2 OR length(p_name)>200 THEN RAISE EXCEPTION 'Invalid bank name'; END IF;
  IF p_kind NOT IN ('bank','nbfc','private','other') THEN RAISE EXCEPTION 'Invalid bank kind'; END IF;
  IF p_rate IS NULL OR p_rate<0 THEN RAISE EXCEPTION 'Invalid default fee'; END IF;
  INSERT INTO public.banks(org_id,name,rate,alias,kind)
  VALUES(v_org,btrim(p_name),p_rate,coalesce(p_alias,''),p_kind)
  ON CONFLICT (org_id,name) DO UPDATE SET rate=EXCLUDED.rate,alias=EXCLUDED.alias,kind=EXCLUDED.kind;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_admin_save_tariff(
  p_bank_name text,p_property_type text,p_fee numeric,p_tat_days integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Tenant admin required'; END IF;
  IF p_property_type NOT IN ('House','Flat','Land','Commercial') OR p_fee IS NULL OR p_fee<0
    OR p_tat_days NOT BETWEEN 1 AND 365 THEN RAISE EXCEPTION 'Invalid tariff'; END IF;
  INSERT INTO public.vp_bank_rate_cards(org_id,bank_name,property_type,fee,tat_days)
    VALUES(v_org,p_bank_name,p_property_type,p_fee,p_tat_days)
  ON CONFLICT (org_id,bank_name,property_type) DO UPDATE
    SET fee=EXCLUDED.fee,tat_days=EXCLUDED.tat_days;
END; $$;

-- Database-allocated (org_id,num) key and UI-facing case number.
-- Locks the existing org row so concurrent creations in the same tenant cannot collide.
-- DB CHECK stage starts at Received; ORIGINAL UI label 'Initiation' is preserved in meta.ui_stage.
CREATE OR REPLACE FUNCTION public.vp_case_create(
  p_branch_id bigint,p_bank_name text,p_customer text,p_product text,p_address text,
  p_assignee_user_id bigint DEFAULT NULL,p_priority text DEFAULT 'Normal')
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_org_code text; v_branch public.vp_branches%ROWTYPE;
  v_next integer; v_fee numeric; v_tat integer; v_name text:=''; v_assignee text;
  v_login text; v_case_no text; v_meta jsonb;
BEGIN
  IF v_org IS NULL OR NOT public.vp_can_case_action('Create') THEN
    RAISE EXCEPTION 'Case create permission required'; END IF;
  IF p_product NOT IN ('House','Flat','Land','Commercial') THEN RAISE EXCEPTION 'Invalid property category'; END IF;
  IF p_priority NOT IN ('High','Normal','Low') THEN RAISE EXCEPTION 'Invalid priority'; END IF;
  IF length(btrim(coalesce(p_customer,'')))<2 OR length(btrim(coalesce(p_address,'')))<4
    THEN RAISE EXCEPTION 'Customer name and property address are required'; END IF;
  SELECT * INTO v_branch FROM public.vp_branches
    WHERE id=p_branch_id AND org_id=v_org AND is_active=true;
  IF NOT FOUND THEN RAISE EXCEPTION 'Select an active branch belonging to your agency'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.banks b WHERE b.org_id=v_org AND b.name=p_bank_name) THEN
    RAISE EXCEPTION 'Bank does not exist in your agency'; END IF;
  -- Do not assume that existing banks.rate is an INR fee. Require explicit tariff.
  SELECT r.fee,r.tat_days INTO v_fee,v_tat FROM public.vp_bank_rate_cards r
    WHERE r.org_id=v_org AND r.bank_name=p_bank_name AND r.property_type=p_product;
  IF NOT FOUND THEN RAISE EXCEPTION 'Configure a bank/property tariff before creating a case'; END IF;
  IF p_assignee_user_id IS NOT NULL THEN
    SELECT name INTO v_assignee FROM public.users
      WHERE org_id=v_org AND id=p_assignee_user_id AND active=true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Assignee must be an active member of this agency'; END IF;
    v_name:=v_assignee;
  END IF;
  -- Lock is acquired before MAX, and released on commit/rollback.
  SELECT code INTO v_org_code FROM public.orgs WHERE id=v_org AND status='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Agency inactive'; END IF;
  SELECT coalesce(max(num),0)+1 INTO v_next FROM public.cases WHERE org_id=v_org;
  IF v_next>2147483647 THEN RAISE EXCEPTION 'Case number range exhausted'; END IF;
  v_case_no:=v_org_code||'/'||v_branch.case_prefix||'/'||to_char(CURRENT_DATE,'YYYY')||'/'||lpad(v_next::text,5,'0');
  v_meta:=jsonb_build_object('ui_stage','Initiation','case_no',v_case_no,
    'branch_id',v_branch.id::text,'branch_code',v_branch.code,'city',v_branch.city,
    'priority',p_priority,'fee',v_fee,'tat_days',v_tat,
    'assigned_user_id',CASE WHEN p_assignee_user_id IS NULL THEN NULL ELSE p_assignee_user_id::text END,
    'assigned_to',v_name);
  INSERT INTO public.cases(org_id,num,cust,bank,br,prod,addr,stage,team,due,meta)
    VALUES(v_org,v_next,btrim(p_customer),p_bank_name,v_branch.name,p_product,
      btrim(p_address),'Received',v_name,CURRENT_DATE+v_tat,v_meta);
  SELECT login INTO v_login FROM public.users u JOIN public.valuation_auth_links l ON l.user_id=u.id
    WHERE l.auth_uid=auth.uid() AND u.org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,v_next,v_login,'Case created: '||v_case_no);
  RETURN v_next::text;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_case_assign(p_case_num integer,p_user_id bigint)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_name text; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_can_case_action('Assign') THEN
    RAISE EXCEPTION 'Case assignment permission required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.cases WHERE org_id=v_org AND num=p_case_num)
    THEN RAISE EXCEPTION 'Case does not exist in your organization'; END IF;
  SELECT name INTO v_name FROM public.users WHERE org_id=v_org AND id=p_user_id AND active=true;
  IF NOT FOUND THEN RAISE EXCEPTION 'Assignee must be an active member of your organization'; END IF;
  UPDATE public.cases SET team=v_name, stage=CASE WHEN stage='Received' THEN 'Assigned' ELSE stage END,
    meta=meta||jsonb_build_object('assigned_user_id',p_user_id::text,'assigned_to',v_name)
    WHERE org_id=v_org AND num=p_case_num;
  SELECT login INTO v_login FROM public.users u JOIN public.valuation_auth_links l ON l.user_id=u.id
    WHERE l.auth_uid=auth.uid() AND u.org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,p_case_num,v_login,'Assigned to '||v_name);
END; $$;

-- Private document storage; the original documents table is retained.
-- Maximum 10MB; PDFs, JPEG, PNG only; paths must be org_id/case_num/random.ext.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
  VALUES ('vp-case-docs','vp-case-docs',false,10485760,
          ARRAY['application/pdf','image/jpeg','image/png']::text[])
  ON CONFLICT (id) DO NOTHING;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id='vp-case-docs' AND public=true) THEN
    RAISE EXCEPTION 'Existing vp-case-docs bucket is public; inspect before continuing';
  END IF;
END $$;
DROP POLICY IF EXISTS vp_phase2_docs_read ON storage.objects;
CREATE POLICY vp_phase2_docs_read ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id='vp-case-docs' AND split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
  AND EXISTS(SELECT 1 FROM public.cases c
    WHERE c.org_id=(SELECT public.vp_current_org_id()) AND c.num::text=split_part(name,'/',2))
);
DROP POLICY IF EXISTS vp_phase2_docs_insert ON storage.objects;
CREATE POLICY vp_phase2_docs_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id='vp-case-docs'
  AND split_part(name,'/',1)=(SELECT public.vp_current_org_id())::text
  AND array_length(storage.foldername(name),1)=2
  AND (public.vp_can_case_action('Create') OR public.vp_can_case_action('Edit'))
  AND EXISTS(SELECT 1 FROM public.cases c
    WHERE c.org_id=(SELECT public.vp_current_org_id()) AND c.num::text=split_part(name,'/',2))
);
-- No UPDATE or DELETE privileges added to storage.objects; documents are immutable in this phase.

CREATE OR REPLACE FUNCTION public.vp_case_register_document(
  p_case_num integer,p_object_path text,p_file_name text,p_mime text,p_size integer)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_id bigint; v_login text;
BEGIN
  IF v_org IS NULL OR NOT (public.vp_can_case_action('Create') OR public.vp_can_case_action('Edit')) THEN
    RAISE EXCEPTION 'Case document upload permission required'; END IF;
  IF p_object_path IS NULL OR split_part(p_object_path,'/',1)<>v_org::text
    OR split_part(p_object_path,'/',2)<>p_case_num::text
    OR array_length(storage.foldername(p_object_path),1)<>2 THEN
    RAISE EXCEPTION 'Invalid organization/case document path'; END IF;
  IF p_file_name IS NULL OR length(btrim(p_file_name)) NOT BETWEEN 1 AND 250
    OR p_mime NOT IN ('application/pdf','image/jpeg','image/png')
    OR p_size NOT BETWEEN 1 AND 10485760 THEN RAISE EXCEPTION 'Invalid document metadata'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.cases WHERE org_id=v_org AND num=p_case_num) THEN
    RAISE EXCEPTION 'Case not found'; END IF;
  IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='vp-case-docs' AND name=p_object_path) THEN
    RAISE EXCEPTION 'Upload the file to the private bucket before registering it'; END IF;
  SELECT login INTO v_login FROM public.users u JOIN public.valuation_auth_links l ON l.user_id=u.id
    WHERE l.auth_uid=auth.uid() AND u.org_id=v_org;
  INSERT INTO public.documents(org_id,num,name,mime,size,kind,tag,"by",storage_path)
    VALUES(v_org,p_case_num,btrim(p_file_name),p_mime,p_size,'Case attachment','',v_login,p_object_path)
    RETURNING id INTO v_id;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,p_case_num,v_login,'Document uploaded: '||btrim(p_file_name));
  RETURN v_id::text;
END; $$;

-- SQL functions default to PUBLIC execute: close it explicitly, grant to authenticated only.
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
    JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname=ANY(ARRAY[
      'vp_can_case_action','vp_admin_save_branch','vp_admin_save_bank','vp_admin_save_tariff',
      'vp_case_create','vp_case_assign','vp_case_register_document']) LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon',f.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.sig);
  END LOOP;
END $$;
COMMIT;
