-- ValuationPro | Property Type Master and Case Creation Repair
-- Targets live BIGINT schema and Phase 1+2 database objects; compatible with Phase 3+4.
-- ADDITIVE: creates vp_property_types, trigger and admin RPC.
-- EXISTING FUNCTION REPLACEMENTS: vp_admin_save_tariff and vp_case_create, keeping signatures.
-- Existing cases.prod CHECK, stages, tables, PKs, FKs, and valuation formulas unchanged.
-- Existing customer/case/bank rows are not modified. Backup before applying.
BEGIN;

DO $$ BEGIN
  IF to_regclass('public.orgs') IS NULL
    OR to_regclass('public.cases') IS NULL
    OR to_regclass('public.vp_branches') IS NULL
    OR to_regclass('public.vp_bank_rate_cards') IS NULL
    OR to_regclass('public.valuation_auth_links') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_is_admin(bigint)') IS NULL
    OR to_regprocedure('public.vp_can_case_action(text)') IS NULL THEN
    RAISE EXCEPTION 'ValuationPro Phase 1 + Phase 2 prerequisites are missing';
  END IF;
END $$;

-- The canonical codes exactly match the existing cases.prod CHECK constraint.
CREATE TABLE IF NOT EXISTS public.vp_property_types (
  org_id bigint NOT NULL REFERENCES public.orgs(id),
  code text NOT NULL CHECK (code IN ('House','Flat','Land','Commercial')),
  name text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (org_id,code)
);
ALTER TABLE public.vp_property_types ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.vp_property_types FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.vp_property_types TO authenticated;
GRANT ALL ON TABLE public.vp_property_types TO service_role;
DROP POLICY IF EXISTS vp_property_types_tenant_read ON public.vp_property_types;
CREATE POLICY vp_property_types_tenant_read
  ON public.vp_property_types FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()));

-- Initialize only the four valid master codes; no demonstration data or fees.
INSERT INTO public.vp_property_types(org_id,code,name,sort_order)
SELECT o.id, pt.code,pt.name,pt.sort_order
FROM public.orgs o
CROSS JOIN (VALUES
  ('House','House',1::smallint),
  ('Flat','Flat',2::smallint),
  ('Land','Land',3::smallint),
  ('Commercial','Commercial',4::smallint)
) AS pt(code,name,sort_order)
ON CONFLICT (org_id,code) DO NOTHING;

-- New organizations receive the same valid master rows automatically.
CREATE OR REPLACE FUNCTION public.vp_property_types_seed_new_org()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  INSERT INTO public.vp_property_types(org_id,code,name,sort_order)
  VALUES
    (NEW.id,'House','House',1),
    (NEW.id,'Flat','Flat',2),
    (NEW.id,'Land','Land',3),
    (NEW.id,'Commercial','Commercial',4)
  ON CONFLICT (org_id,code) DO NOTHING;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vp_property_types_seed_org ON public.orgs;
CREATE TRIGGER vp_property_types_seed_org
  AFTER INSERT ON public.orgs FOR EACH ROW
  EXECUTE FUNCTION public.vp_property_types_seed_new_org();

-- Tenant administrator may activate/deactivate standard categories.
-- Historical cases and bank tariffs are retained when a category is disabled.
CREATE OR REPLACE FUNCTION public.vp_admin_set_property_type(p_code text,p_active boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN
    RAISE EXCEPTION 'Tenant administrator permission required';
  END IF;
  IF p_active IS NULL THEN RAISE EXCEPTION 'Active flag is required'; END IF;
  UPDATE public.vp_property_types SET is_active=p_active
  WHERE org_id=v_org AND code=p_code;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unknown property type for this tenant'; END IF;
END; $$;

-- Keep Phase 2 signature/validation; additionally require an active master category.
CREATE OR REPLACE FUNCTION public.vp_admin_save_tariff(
  p_bank_name text,p_property_type text,p_fee numeric,p_tat_days integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
  IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN
    RAISE EXCEPTION 'Tenant admin required'; END IF;
  IF p_fee IS NULL OR p_fee<0 OR p_tat_days NOT BETWEEN 1 AND 365 THEN
    RAISE EXCEPTION 'Invalid tariff'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.vp_property_types
    WHERE org_id=v_org AND code=p_property_type AND is_active) THEN
    RAISE EXCEPTION 'Select an active property type from the master'; END IF;
  INSERT INTO public.vp_bank_rate_cards(org_id,bank_name,property_type,fee,tat_days)
    VALUES(v_org,p_bank_name,p_property_type,p_fee,p_tat_days)
  ON CONFLICT (org_id,bank_name,property_type) DO UPDATE
    SET fee=EXCLUDED.fee,tat_days=EXCLUDED.tat_days;
END; $$;

-- Case can be created BEFORE bank-specific tariff setup.
-- In that case: meta.fee=NULL, due date uses the branch's configured tat_days.
-- Existing banking/case authorization, numbering and UI stage mapping stay unchanged.
CREATE OR REPLACE FUNCTION public.vp_case_create(
  p_branch_id bigint,p_bank_name text,p_customer text,p_product text,p_address text,
  p_assignee_user_id bigint DEFAULT NULL,p_priority text DEFAULT 'Normal')
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
  v_org bigint:=public.vp_current_org_id();
  v_org_code text;
  v_branch public.vp_branches%ROWTYPE;
  v_next integer;
  v_fee numeric;
  v_tat integer;
  v_has_tariff boolean:=false;
  v_name text:='';
  v_assignee text;
  v_login text;
  v_case_no text;
  v_meta jsonb;
BEGIN
  IF v_org IS NULL OR NOT public.vp_can_case_action('Create') THEN
    RAISE EXCEPTION 'Case create permission required'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.vp_property_types t
    WHERE t.org_id=v_org AND t.code=p_product AND t.is_active) THEN
    RAISE EXCEPTION 'Select an active property type'; END IF;
  IF p_priority NOT IN ('High','Normal','Low') THEN
    RAISE EXCEPTION 'Invalid priority'; END IF;
  IF length(btrim(coalesce(p_customer,'')))<2 OR length(btrim(coalesce(p_address,'')))<4 THEN
    RAISE EXCEPTION 'Customer name and property address are required'; END IF;

  SELECT * INTO v_branch FROM public.vp_branches
    WHERE id=p_branch_id AND org_id=v_org AND is_active=true;
  IF NOT FOUND THEN RAISE EXCEPTION 'Select an active branch belonging to your agency'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.banks b
    WHERE b.org_id=v_org AND b.name=p_bank_name) THEN
    RAISE EXCEPTION 'Bank does not exist in your agency'; END IF;

  SELECT r.fee,r.tat_days INTO v_fee,v_tat FROM public.vp_bank_rate_cards r
    WHERE r.org_id=v_org AND r.bank_name=p_bank_name AND r.property_type=p_product;
  v_has_tariff:=FOUND;
  IF NOT v_has_tariff THEN
    v_fee:=NULL;
    v_tat:=v_branch.tat_days;
  END IF;

  IF p_assignee_user_id IS NOT NULL THEN
    SELECT name INTO v_assignee FROM public.users
      WHERE org_id=v_org AND id=p_assignee_user_id AND active=true;
    IF NOT FOUND THEN RAISE EXCEPTION 'Assignee must be an active member of this agency'; END IF;
    v_name:=v_assignee;
  END IF;

  SELECT code INTO v_org_code FROM public.orgs
    WHERE id=v_org AND status='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Agency inactive'; END IF;
  SELECT coalesce(max(num),0)+1 INTO v_next FROM public.cases WHERE org_id=v_org;
  IF v_next>2147483647 THEN RAISE EXCEPTION 'Case number range exhausted'; END IF;
  v_case_no:=v_org_code||'/'||v_branch.case_prefix||'/'||
    to_char(CURRENT_DATE,'YYYY')||'/'||lpad(v_next::text,5,'0');

  v_meta:=jsonb_build_object(
    'ui_stage','Initiation','case_no',v_case_no,
    'branch_id',v_branch.id::text,'branch_code',v_branch.code,'city',v_branch.city,
    'priority',p_priority,'fee',v_fee,'tat_days',v_tat,
    'fee_status',CASE WHEN v_has_tariff THEN 'Configured' ELSE 'Pending' END,
    'tat_source',CASE WHEN v_has_tariff THEN 'Bank rate card' ELSE 'Branch default' END,
    'assigned_user_id',CASE WHEN p_assignee_user_id IS NULL
      THEN NULL ELSE p_assignee_user_id::text END,
    'assigned_to',v_name
  );

  INSERT INTO public.cases(org_id,num,cust,bank,br,prod,addr,stage,team,due,meta)
    VALUES(v_org,v_next,btrim(p_customer),p_bank_name,v_branch.name,p_product,
      btrim(p_address),'Received',v_name,CURRENT_DATE+v_tat,v_meta);
  SELECT u.login INTO v_login
    FROM public.users u JOIN public.valuation_auth_links l ON l.user_id=u.id
    WHERE l.auth_uid=auth.uid() AND u.org_id=v_org;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,v_next,v_login,'Case created: '||v_case_no);
  RETURN v_next::text;
END; $$;

-- Functions are never available to the anonymous API role.
REVOKE ALL ON FUNCTION public.vp_property_types_seed_new_org() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.vp_admin_set_property_type(text,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_admin_set_property_type(text,boolean) TO authenticated;
REVOKE ALL ON FUNCTION public.vp_admin_save_tariff(text,text,numeric,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_admin_save_tariff(text,text,numeric,integer) TO authenticated;
REVOKE ALL ON FUNCTION public.vp_case_create(bigint,text,text,text,text,bigint,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_case_create(bigint,text,text,text,text,bigint,text) TO authenticated;
COMMIT;
