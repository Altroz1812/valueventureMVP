-- ValuationPro Phase 6 | Billing & MIS | BIGINT schema | additive, no seeded business data.
-- Preconditions: Phase 1 Auth + Phase 2 Cases + Phase 5 released reports + direct-user password gate.
-- Existing invoices remains financial source-of-truth; existing invoicing fields and CHECKs are preserved.
-- Important: operators determine actual GST applicability/rate/treatment; this is not tax advice.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.invoices') IS NULL OR to_regclass('public.cases') IS NULL
     OR to_regclass('public.vp_report_versions') IS NULL
     OR to_regclass('public.vp_bank_rate_cards') IS NULL
     OR to_regclass('public.valuation_auth_links') IS NULL
     OR to_regprocedure('public.vp_current_org_id()') IS NULL
     OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
     OR to_regprocedure('public.vp_first_login_required()') IS NULL THEN
    RAISE EXCEPTION 'Phase 6 prerequisites are missing. Do not run partial migrations.';
  END IF;
  -- The legacy invoices.id is BIGINT, with an existing generator in the intended live schema.
  -- Fail without any change if it cannot generate new IDs automatically.
  IF EXISTS (SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema='public' AND c.table_name='invoices' AND c.column_name='id'
      AND c.is_identity IS DISTINCT FROM 'YES' AND c.column_default IS NULL) THEN
    RAISE EXCEPTION 'invoices.id has no identity/default. Inspect existing schema before generating invoices.';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns c
    WHERE c.table_schema='public' AND c.table_name='invoices' AND c.column_name='id'
      AND c.data_type<>'bigint') THEN
    RAISE EXCEPTION 'Existing invoices.id is not BIGINT.';
  END IF;
END $$;

-- Unique composite lookup adds no changes to original invoices PK or data.
CREATE UNIQUE INDEX IF NOT EXISTS vp_invoices_org_id_id_unique
  ON public.invoices (org_id,id);

CREATE TABLE IF NOT EXISTS public.vp_billing_settings (
  org_id bigint PRIMARY KEY REFERENCES public.orgs(id),
  invoice_prefix text NOT NULL CHECK (invoice_prefix ~ '^[A-Z0-9][A-Z0-9/-]{1,30}$'),
  payment_days integer NOT NULL CHECK (payment_days BETWEEN 1 AND 365),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by bigint,
  FOREIGN KEY(org_id,updated_by) REFERENCES public.users(org_id,id)
);

-- Per-case invoice metadata; primary totals and receipts continue to live in public.invoices.
CREATE TABLE IF NOT EXISTS public.vp_invoice_records (
  org_id bigint NOT NULL,
  invoice_id bigint NOT NULL,
  case_num integer NOT NULL,
  branch_id bigint,
  branch_name text NOT NULL DEFAULT '',
  case_no text NOT NULL,
  service_fee numeric(14,2) NOT NULL CHECK (service_fee > 0),
  tax_treatment text NOT NULL CHECK (tax_treatment IN ('CGST+SGST','IGST','No GST')),
  tax_rate numeric(6,2) NOT NULL CHECK (tax_rate BETWEEN 0 AND 100),
  cgst numeric(14,2) NOT NULL DEFAULT 0 CHECK (cgst >= 0),
  sgst numeric(14,2) NOT NULL DEFAULT 0 CHECK (sgst >= 0),
  igst numeric(14,2) NOT NULL DEFAULT 0 CHECK (igst >= 0),
  tax_note text NOT NULL DEFAULT '',
  created_by bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(org_id,invoice_id),
  UNIQUE(org_id,case_num),
  FOREIGN KEY(org_id,invoice_id) REFERENCES public.invoices(org_id,id),
  FOREIGN KEY(org_id,case_num) REFERENCES public.cases(org_id,num),
  FOREIGN KEY(org_id,branch_id) REFERENCES public.vp_branches(org_id,id),
  FOREIGN KEY(org_id,created_by) REFERENCES public.users(org_id,id),
  CHECK ((tax_treatment='No GST' AND tax_rate=0 AND cgst=0 AND sgst=0 AND igst=0)
    OR (tax_treatment='CGST+SGST' AND tax_rate>0 AND igst=0)
    OR (tax_treatment='IGST' AND tax_rate>0 AND cgst=0 AND sgst=0)),
  CHECK (tax_treatment<>'No GST' OR length(btrim(tax_note)) BETWEEN 5 AND 500)
);
CREATE INDEX IF NOT EXISTS vp_invoice_records_branch ON public.vp_invoice_records(org_id,branch_id);

CREATE TABLE IF NOT EXISTS public.vp_invoice_payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  invoice_id bigint NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount>0),
  payment_date date NOT NULL,
  reference text NOT NULL CHECK (length(btrim(reference)) BETWEEN 4 AND 120),
  method text NOT NULL CHECK (method IN ('NEFT','RTGS','IMPS','UPI','Cheque','Cash','Other')),
  recorded_by bigint NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(org_id,invoice_id) REFERENCES public.vp_invoice_records(org_id,invoice_id),
  FOREIGN KEY(org_id,recorded_by) REFERENCES public.users(org_id,id)
);
-- Same external payment reference cannot be recorded twice for an invoice, including concurrent posts.
CREATE UNIQUE INDEX IF NOT EXISTS vp_invoice_payment_reference_uk
  ON public.vp_invoice_payments(org_id,invoice_id,lower(btrim(reference)));
CREATE INDEX IF NOT EXISTS vp_invoice_payments_lookup
  ON public.vp_invoice_payments(org_id,invoice_id,payment_date DESC);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['vp_billing_settings','vp_invoice_records','vp_invoice_payments'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC,anon,authenticated',t);
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated',t);
    EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role',t);
  END LOOP;
END $$;

-- A role-matrix check is performed in PostgreSQL on every privileged action.
CREATE OR REPLACE FUNCTION public.vp_billing_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT p_action=ANY(ARRAY['View','Create','Approve','Export'])
    AND (SELECT public.vp_current_org_id()) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.valuation_auth_links l
      JOIN public.users u ON u.id=l.user_id
      JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
      WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
        AND u.org_id=(SELECT public.vp_current_org_id())
        AND rp.perm=ANY(ARRAY['tenant.admin','billing.'||p_action])
    );
$$;

DROP POLICY IF EXISTS vp_phase6_settings_read ON public.vp_billing_settings;
CREATE POLICY vp_phase6_settings_read ON public.vp_billing_settings FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_billing_can('View')));
DROP POLICY IF EXISTS vp_phase6_invoice_records_read ON public.vp_invoice_records;
CREATE POLICY vp_phase6_invoice_records_read ON public.vp_invoice_records FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_billing_can('View')));
DROP POLICY IF EXISTS vp_phase6_payments_read ON public.vp_invoice_payments;
CREATE POLICY vp_phase6_payments_read ON public.vp_invoice_payments FOR SELECT TO authenticated
  USING (org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_billing_can('View')));

CREATE OR REPLACE FUNCTION public.vp_billing_save_settings(p_prefix text,p_payment_days integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
BEGIN
  IF v_org IS NULL OR NOT public.vp_billing_can('Approve') THEN
    RAISE EXCEPTION 'Billing administrator/approver permission required'; END IF;
  IF p_prefix IS NULL OR p_prefix !~ '^[A-Z0-9][A-Z0-9/-]{1,30}$'
    OR p_prefix LIKE '%//' OR p_payment_days NOT BETWEEN 1 AND 365 THEN
    RAISE EXCEPTION 'Provide an uppercase invoice prefix (2-31 chars) and 1-365 payment days'; END IF;
  INSERT INTO public.vp_billing_settings(org_id,invoice_prefix,payment_days,updated_by)
    VALUES(v_org,p_prefix,p_payment_days,v_actor)
    ON CONFLICT(org_id) DO UPDATE SET invoice_prefix=EXCLUDED.invoice_prefix,
      payment_days=EXCLUDED.payment_days,updated_at=now(),updated_by=EXCLUDED.updated_by;
END; $$;

-- Only released reports are billable. No tax percentage, tax type or fee is inferred silently.
CREATE OR REPLACE FUNCTION public.vp_billing_raise(
  p_case_num integer,p_service_fee numeric,p_tax_treatment text,
  p_tax_rate numeric,p_tax_note text DEFAULT '')
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
  v_case public.cases%ROWTYPE; v_cfg public.vp_billing_settings%ROWTYPE;
  v_id bigint; v_no text; v_sequence integer; v_fee numeric(14,2); v_rate numeric(6,2);
  v_cgst numeric(14,2):=0; v_sgst numeric(14,2):=0; v_igst numeric(14,2):=0;
  v_total numeric(14,2); v_prefix text; v_year text:=to_char(CURRENT_DATE,'YYYY');
  v_branch_id bigint; v_branch_text text; v_case_no text; v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_billing_can('Create') THEN
    RAISE EXCEPTION 'Billing Create permission required'; END IF;
  IF p_service_fee IS NULL OR p_service_fee<=0 OR p_service_fee>999999999999.99
     OR round(p_service_fee,2)<>p_service_fee THEN
    RAISE EXCEPTION 'Enter an explicit positive service fee with at most two decimals'; END IF;
  IF p_tax_treatment NOT IN ('CGST+SGST','IGST','No GST') OR p_tax_treatment IS NULL
    OR p_tax_rate IS NULL OR p_tax_rate<0 OR p_tax_rate>100
    OR round(p_tax_rate,2)<>p_tax_rate THEN
    RAISE EXCEPTION 'Select GST treatment and an explicit rate (0-100, max two decimals)'; END IF;
  IF (p_tax_treatment='No GST' AND (p_tax_rate<>0 OR length(btrim(coalesce(p_tax_note,'')))<5))
    OR (p_tax_treatment<>'No GST' AND p_tax_rate<=0) THEN
    RAISE EXCEPTION 'No GST requires zero rate and a reason; GST invoices need a positive rate'; END IF;
  IF length(coalesce(p_tax_note,''))>500 THEN RAISE EXCEPTION 'Tax note too long'; END IF;
  v_fee:=p_service_fee; v_rate:=p_tax_rate;
  SELECT * INTO v_case FROM public.cases
    WHERE org_id=v_org AND num=p_case_num FOR UPDATE;
  IF NOT FOUND OR v_case.stage<>'Submitted' OR v_case.meta->>'ui_stage'<>'Delivered' THEN
    RAISE EXCEPTION 'Invoice requires a released, delivered report'; END IF;
  -- Rate-card/recorded service fee can only be overridden by Billing Approve.
  -- When a case was created without a tariff, manual fee entry also needs approval.
  IF jsonb_typeof(v_case.meta->'fee')='number'
     AND coalesce(v_case.meta->>'fee_status','')<>'Pending' THEN
    IF v_fee<>(v_case.meta->>'fee')::numeric
       AND NOT public.vp_billing_can('Approve') THEN
      RAISE EXCEPTION 'A fee override requires Billing Approve permission'; END IF;
  ELSIF NOT public.vp_billing_can('Approve') THEN
    RAISE EXCEPTION 'No recorded tariff: manual fee setting requires Billing Approve permission';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public.vp_report_versions r WHERE r.org_id=v_org
      AND r.num=p_case_num AND r.status='Released') THEN
    RAISE EXCEPTION 'No released Phase 5 report exists for this case'; END IF;
  IF EXISTS(SELECT 1 FROM public.vp_invoice_records r WHERE r.org_id=v_org AND r.case_num=p_case_num) THEN
    RAISE EXCEPTION 'This case already has a Phase 6 invoice'; END IF;
  SELECT * INTO v_cfg FROM public.vp_billing_settings WHERE org_id=v_org;
  IF NOT FOUND THEN RAISE EXCEPTION 'Configure the invoice prefix and payment terms first'; END IF;
  IF p_tax_treatment='CGST+SGST' THEN
    v_cgst:=round(v_fee*v_rate/200,2);
    v_sgst:=round(v_fee*v_rate/200,2);
  ELSIF p_tax_treatment='IGST' THEN
    v_igst:=round(v_fee*v_rate/100,2);
  END IF;
  v_total:=v_fee+v_cgst+v_sgst+v_igst;
  -- Serialized per organization for predictable invoice-number allocation.
  PERFORM 1 FROM public.orgs WHERE id=v_org AND status='active' FOR UPDATE;
  v_prefix:=v_cfg.invoice_prefix||'/'||v_year||'/';
  SELECT coalesce(max(substring(i.no FROM length(v_prefix)+1)::integer),0)+1 INTO v_sequence
  FROM public.invoices i
  WHERE i.org_id=v_org AND left(i.no,length(v_prefix))=v_prefix
    AND substring(i.no FROM length(v_prefix)+1) ~ '^[0-9]{1,9}$';
  IF v_sequence>999999999 THEN RAISE EXCEPTION 'Invoice serial sequence exhausted'; END IF;
  v_no:=v_prefix||lpad(v_sequence::text,5,'0');
  INSERT INTO public.invoices(org_id,no,client,tot,exp,rec,due,created)
    VALUES(v_org,v_no,v_case.bank,v_total,0,0,CURRENT_DATE+v_cfg.payment_days,CURRENT_DATE)
    RETURNING id INTO v_id;
  -- branches are only linked if the case carries a valid Phase 2 branch id.
  v_branch_text:=nullif(v_case.meta->>'branch_id','');
  IF v_branch_text ~ '^[0-9]+$' THEN
    SELECT b.id INTO v_branch_id FROM public.vp_branches b
      WHERE b.org_id=v_org AND b.id::text=v_branch_text;
  END IF;
  v_case_no:=coalesce(nullif(v_case.meta->>'case_no',''),'#'||v_case.num::text);
  INSERT INTO public.vp_invoice_records(org_id,invoice_id,case_num,branch_id,branch_name,
    case_no,service_fee,tax_treatment,tax_rate,cgst,sgst,igst,tax_note,created_by)
  VALUES(v_org,v_id,p_case_num,v_branch_id,coalesce(v_case.br,''),v_case_no,
    v_fee,p_tax_treatment,v_rate,v_cgst,v_sgst,v_igst,coalesce(p_tax_note,''),v_actor);
  UPDATE public.cases SET stage='Invoiced' WHERE org_id=v_org AND num=p_case_num;
  SELECT login INTO v_login FROM public.users WHERE org_id=v_org AND id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg)
    VALUES(v_org,p_case_num,v_login,'Invoice '||v_no||' raised (service fee '||v_fee||', total '||v_total||')');
  RETURN v_id::text;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_billing_record_payment(
  p_invoice_id bigint,p_amount numeric,p_payment_date date,p_reference text,p_method text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
  v_invoice public.invoices%ROWTYPE; v_rec public.vp_invoice_records%ROWTYPE;
  v_id bigint;v_login text;
BEGIN
  IF v_org IS NULL OR NOT public.vp_billing_can('Approve') THEN
    RAISE EXCEPTION 'Billing Approve permission required to record collections'; END IF;
  IF p_amount IS NULL OR p_amount<=0 OR round(p_amount,2)<>p_amount
     OR p_amount>999999999999.99 THEN
    RAISE EXCEPTION 'Enter a valid positive payment amount with two decimals'; END IF;
  IF p_payment_date IS NULL OR p_payment_date>CURRENT_DATE
     OR p_payment_date<DATE '2000-01-01' THEN
    RAISE EXCEPTION 'Payment date is missing, future-dated, or unsupported'; END IF;
  IF p_method NOT IN ('NEFT','RTGS','IMPS','UPI','Cheque','Cash','Other') THEN
    RAISE EXCEPTION 'Select a valid payment method'; END IF;
  IF length(btrim(coalesce(p_reference,''))) NOT BETWEEN 4 AND 120 THEN
    RAISE EXCEPTION 'Enter a unique bank/receipt reference (4-120 characters)'; END IF;
  SELECT * INTO v_invoice FROM public.invoices
    WHERE org_id=v_org AND id=p_invoice_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invoice not found in your organization'; END IF;
  SELECT * INTO v_rec FROM public.vp_invoice_records
    WHERE org_id=v_org AND invoice_id=p_invoice_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Legacy invoices require reconciliation before posting Phase 6 receipts'; END IF;
  IF p_payment_date<v_invoice.created THEN
    RAISE EXCEPTION 'A pre-invoice advance must be reconciled separately'; END IF;
  IF v_invoice.rec+p_amount>v_invoice.tot THEN
    RAISE EXCEPTION 'Payment exceeds outstanding invoice amount'; END IF;
  INSERT INTO public.vp_invoice_payments(org_id,invoice_id,amount,payment_date,reference,method,recorded_by)
    VALUES(v_org,p_invoice_id,p_amount,p_payment_date,btrim(p_reference),p_method,v_actor)
    RETURNING id INTO v_id;
  UPDATE public.invoices SET rec=rec+p_amount
    WHERE org_id=v_org AND id=p_invoice_id;
  SELECT login INTO v_login FROM public.users WHERE org_id=v_org AND id=v_actor;
  INSERT INTO public.log(org_id,num,"by",msg) VALUES(v_org,v_rec.case_num,v_login,
    'Receipt #'||v_id||' recorded for invoice '||v_invoice.no||' amount '||p_amount);
  RETURN v_id::text;
END; $$;

-- Paginated live list; no fake entries. Amounts are generated by PostgreSQL.
CREATE OR REPLACE FUNCTION public.vp_billing_list(
 p_branch_id bigint DEFAULT NULL,p_limit integer DEFAULT 100,p_offset integer DEFAULT 0)
RETURNS TABLE(invoice_id text,case_num integer,invoice_no text,bank_name text,
 branch_id text,branch_name text,case_no text,service_fee numeric,tax_treatment text,
 tax_rate numeric,cgst numeric,sgst numeric,igst numeric,tax_note text,
 total numeric,paid numeric,outstanding numeric,due_date date,created_date date,status text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_billing_can('View') THEN RAISE EXCEPTION 'Billing View permission required'; END IF;
 IF p_limit IS NULL OR p_offset IS NULL OR p_limit NOT BETWEEN 1 AND 500 OR p_offset<0
 THEN RAISE EXCEPTION 'Invalid page size or offset'; END IF;
 RETURN QUERY SELECT i.id::text,r.case_num,i.no,i.client,r.branch_id::text,r.branch_name,
   r.case_no,r.service_fee,r.tax_treatment,r.tax_rate,r.cgst,r.sgst,r.igst,r.tax_note,
   i.tot,i.rec,greatest(0,i.tot-i.rec),i.due,i.created,
   CASE WHEN i.rec>=i.tot THEN 'Paid' WHEN i.due<CURRENT_DATE THEN 'Overdue' ELSE 'Raised' END
 FROM public.vp_invoice_records r
 JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
 WHERE r.org_id=(SELECT public.vp_current_org_id())
   AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
 ORDER BY i.created DESC,i.id DESC LIMIT p_limit OFFSET p_offset;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_billing_receipts(p_invoice_id bigint)
RETURNS TABLE(id text,amount numeric,payment_date date,reference text,method text,recorded_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_billing_can('View') THEN RAISE EXCEPTION 'Billing View permission required'; END IF;
 RETURN QUERY SELECT p.id::text,p.amount,p.payment_date,p.reference,p.method,p.recorded_at
 FROM public.vp_invoice_payments p
 WHERE p.org_id=(SELECT public.vp_current_org_id()) AND p.invoice_id=p_invoice_id
 ORDER BY p.recorded_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_billing_ready_cases(p_branch_id bigint DEFAULT NULL)
RETURNS TABLE(case_num integer,case_no text,bank_name text,property_type text,
 branch_name text,branch_id text,fee_suggestion numeric,released_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_billing_can('Create') THEN RAISE EXCEPTION 'Billing Create permission required'; END IF;
 RETURN QUERY SELECT c.num,coalesce(nullif(c.meta->>'case_no',''),'#'||c.num::text),
   c.bank,c.prod,c.br,c.meta->>'branch_id',
   CASE WHEN jsonb_typeof(c.meta->'fee')='number' AND coalesce(c.meta->>'fee_status','')<>'Pending'
     THEN (c.meta->>'fee')::numeric ELSE NULL END,
   r.released_at
 FROM public.cases c
 JOIN public.vp_report_versions r ON r.org_id=c.org_id AND r.num=c.num AND r.status='Released'
 WHERE c.org_id=(SELECT public.vp_current_org_id()) AND c.stage='Submitted'
   AND c.meta->>'ui_stage'='Delivered'
   AND NOT EXISTS(SELECT 1 FROM public.vp_invoice_records b WHERE b.org_id=c.org_id AND b.case_num=c.num)
   AND (p_branch_id IS NULL OR c.meta->>'branch_id'=p_branch_id::text)
 ORDER BY r.released_at DESC,c.num DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_billing_summary(p_branch_id bigint DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_result jsonb;
BEGIN
 IF NOT public.vp_billing_can('View') THEN RAISE EXCEPTION 'Billing View permission required'; END IF;
 SELECT jsonb_build_object(
  'invoice_count',count(*),
  'billed',coalesce(sum(i.tot),0),
  'collected',coalesce(sum(i.rec),0),
  'outstanding',coalesce(sum(greatest(0,i.tot-i.rec)),0),
  'overdue',coalesce(sum(CASE WHEN i.due<CURRENT_DATE AND i.rec<i.tot THEN i.tot-i.rec ELSE 0 END),0)
 ) INTO v_result
 FROM public.vp_invoice_records r JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
 WHERE r.org_id=v_org AND (p_branch_id IS NULL OR r.branch_id=p_branch_id);
 RETURN v_result;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_billing_breakdown(p_branch_id bigint DEFAULT NULL)
RETURNS TABLE(kind text,label text,invoice_count bigint,billed numeric,collected numeric,outstanding numeric)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.vp_billing_can('View') THEN RAISE EXCEPTION 'Billing View permission required'; END IF;
 RETURN QUERY
 SELECT 'Branch'::text,r.branch_name,count(*),sum(i.tot),sum(i.rec),sum(greatest(0,i.tot-i.rec))
 FROM public.vp_invoice_records r JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
 WHERE r.org_id=(SELECT public.vp_current_org_id()) AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
 GROUP BY r.branch_name
 UNION ALL
 SELECT 'Bank'::text,i.client,count(*),sum(i.tot),sum(i.rec),sum(greatest(0,i.tot-i.rec))
 FROM public.vp_invoice_records r JOIN public.invoices i ON i.org_id=r.org_id AND i.id=r.invoice_id
 WHERE r.org_id=(SELECT public.vp_current_org_id()) AND (p_branch_id IS NULL OR r.branch_id=p_branch_id)
 GROUP BY i.client;
END; $$;

-- Historical invoices without case links are not invented as new invoices or silently included in metrics.
CREATE OR REPLACE FUNCTION public.vp_billing_legacy_count()
RETURNS bigint LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_result bigint;
BEGIN
 IF NOT public.vp_billing_can('View') THEN RAISE EXCEPTION 'Billing View permission required'; END IF;
 SELECT count(*) INTO v_result FROM public.invoices i
 WHERE i.org_id=(SELECT public.vp_current_org_id())
   AND NOT EXISTS(SELECT 1 FROM public.vp_invoice_records r
                  WHERE r.org_id=i.org_id AND r.invoice_id=i.id);
 RETURN v_result;
END; $$;

DO $$ DECLARE p record; BEGIN
 FOR p IN SELECT x.oid::regprocedure AS signature FROM pg_proc x
 JOIN pg_namespace n ON n.oid=x.pronamespace
 WHERE n.nspname='public' AND x.proname=ANY(ARRAY[
 'vp_billing_can','vp_billing_save_settings','vp_billing_raise',
 'vp_billing_record_payment','vp_billing_list','vp_billing_receipts',
 'vp_billing_ready_cases','vp_billing_summary','vp_billing_breakdown','vp_billing_legacy_count']) LOOP
   EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon',p.signature);
   EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',p.signature);
 END LOOP;
END $$;
COMMIT;
