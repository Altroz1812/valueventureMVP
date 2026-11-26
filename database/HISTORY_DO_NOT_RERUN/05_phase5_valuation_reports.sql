-- ValuationPro Phase 5 — Valuation forms, versions, bank format references and controlled report release.
-- ADDITIVE for the verified BIGINT tenancy schema. Retains all legacy cases, forms, roles and QC stages.
-- Run in Supabase SQL Editor on the intended project after a database backup.
-- This implements internal release ATTESTATION, not a cryptographic digital signature or IBBI verification API.
BEGIN;

DO $$ BEGIN
  IF to_regclass('public.forms') IS NULL OR to_regclass('public.vp_qc_tasks') IS NULL
     OR to_regclass('public.valuation_auth_links') IS NULL OR to_regclass('public.banks') IS NULL
     OR to_regprocedure('public.vp_current_org_id()') IS NULL
     OR to_regprocedure('public.vp_is_admin(bigint)') IS NULL
     OR to_regprocedure('public.vp_can_case_action(text)') IS NULL
     OR to_regprocedure('public.vp_field_my_user_id()') IS NULL
     OR to_regclass('public.vp_user_password_setup') IS NULL
     OR to_regprocedure('public.vp_first_login_required()') IS NULL
     OR to_regprocedure('public.vp_admin_replace_module_permissions(text,text,text[])') IS NULL
  THEN RAISE EXCEPTION 'Phase 5 requires verified Phases 1–4 and the Role Matrix RPC'; END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.vp_report_formats (
  org_id bigint NOT NULL REFERENCES public.orgs(id),
  bank_name text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('House','Flat','Land','Commercial')),
  format_name text NOT NULL CHECK (length(btrim(format_name)) BETWEEN 3 AND 160),
  instructions text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id,bank_name,property_type),
  FOREIGN KEY (org_id,bank_name) REFERENCES public.banks(org_id,name) ON UPDATE CASCADE
);

-- An internal administrative review of credentials; NOT automatic government registry validation.
CREATE TABLE IF NOT EXISTS public.vp_valuer_credentials (
  org_id bigint NOT NULL,
  user_id bigint NOT NULL,
  reg_no text NOT NULL,
  registration_category text NOT NULL DEFAULT 'Land & Building',
  expires_on date NOT NULL,
  review_status text NOT NULL DEFAULT 'Pending' CHECK (review_status IN ('Pending','Checked','Rejected')),
  recorded_by bigint NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by bigint,
  reviewed_at timestamptz,
  review_note text NOT NULL DEFAULT '',
  PRIMARY KEY (org_id,user_id),
  FOREIGN KEY (org_id,user_id) REFERENCES public.users(org_id,id),
  FOREIGN KEY (org_id,recorded_by) REFERENCES public.users(org_id,id),
  FOREIGN KEY (org_id,reviewed_by) REFERENCES public.users(org_id,id)
);

-- Immutable submitted snapshots. The existing public.forms stays the mutable draft/current form.
CREATE TABLE IF NOT EXISTS public.vp_valuation_versions (
  org_id bigint NOT NULL,
  num integer NOT NULL,
  version_no integer NOT NULL CHECK (version_no > 0),
  method text NOT NULL DEFAULT 'Land & Building',
  inputs jsonb NOT NULL CHECK (jsonb_typeof(inputs)='object'),
  calculations jsonb NOT NULL CHECK (jsonb_typeof(calculations)='object'),
  submitted_by bigint NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id,num,version_no),
  FOREIGN KEY (org_id,num) REFERENCES public.cases(org_id,num),
  FOREIGN KEY (org_id,submitted_by) REFERENCES public.users(org_id,id)
);
CREATE INDEX IF NOT EXISTS vp_valuation_versions_latest
  ON public.vp_valuation_versions(org_id,num,submitted_at DESC);

-- An uploaded PDF plus an auditable release. Release is not a cryptographic signature.
CREATE TABLE IF NOT EXISTS public.vp_report_versions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  num integer NOT NULL,
  version_no integer NOT NULL CHECK (version_no > 0),
  valuation_version_no integer NOT NULL,
  format_name text NOT NULL,
  case_snapshot jsonb NOT NULL CHECK (jsonb_typeof(case_snapshot)='object'),
  inputs_snapshot jsonb NOT NULL CHECK (jsonb_typeof(inputs_snapshot)='object'),
  calculations_snapshot jsonb NOT NULL CHECK (jsonb_typeof(calculations_snapshot)='object'),
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Released')),
  file_path text,
  prepared_by bigint NOT NULL,
  prepared_at timestamptz NOT NULL DEFAULT now(),
  final_qc_task_id bigint NOT NULL,
  released_by bigint,
  released_at timestamptz,
  released_reg_no text,
  UNIQUE(org_id,id), UNIQUE(org_id,num,version_no),
  FOREIGN KEY(org_id,num,valuation_version_no)
    REFERENCES public.vp_valuation_versions(org_id,num,version_no),
  FOREIGN KEY(org_id,num) REFERENCES public.cases(org_id,num),
  FOREIGN KEY(org_id,final_qc_task_id) REFERENCES public.vp_qc_tasks(org_id,id),
  FOREIGN KEY(org_id,prepared_by) REFERENCES public.users(org_id,id),
  FOREIGN KEY(org_id,released_by) REFERENCES public.users(org_id,id)
);
CREATE UNIQUE INDEX IF NOT EXISTS vp_report_one_release_per_case
  ON public.vp_report_versions(org_id,num) WHERE status='Released';
CREATE INDEX IF NOT EXISTS vp_report_versions_case
  ON public.vp_report_versions(org_id,num,version_no DESC);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['vp_report_formats','vp_valuer_credentials',
      'vp_valuation_versions','vp_report_versions'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC,anon,authenticated',t);
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated',t);
    EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role',t);
  END LOOP;
END $$;

-- Only authorized active tenant members, also subject to the first-login gate, may use reports.
-- Existing Role Matrix keys signoff.View / signoff.Generate / signoff.Manage Templates
-- remain valid. signoff.Release is a NEW workflow permission distinct from digital Sign.
CREATE OR REPLACE FUNCTION public.vp_report_can(p_action text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT p_action=ANY(ARRAY['View','Edit','Prepare','Release','Manage Formats']) AND EXISTS (
   SELECT 1 FROM public.valuation_auth_links l
   JOIN public.users u ON u.id=l.user_id
   JOIN public.role_perms rp ON rp.org_id=u.org_id AND rp.role=u.role
   WHERE l.auth_uid=(SELECT auth.uid()) AND u.active IS TRUE
     AND u.org_id=(SELECT public.vp_current_org_id())
     AND (
       (p_action='View' AND rp.perm=ANY(ARRAY['tenant.admin','signoff.View','signoff.Generate','signoff.Release']))
       OR (p_action='Edit' AND rp.perm=ANY(ARRAY['tenant.admin','cases.Edit','signoff.Generate']))
       OR (p_action='Prepare' AND rp.perm=ANY(ARRAY['tenant.admin','signoff.Generate']))
       OR (p_action='Manage Formats' AND rp.perm=ANY(ARRAY['tenant.admin','signoff.Manage Templates']))
       OR (p_action='Release' AND rp.perm='signoff.Release')
     )
 );
$$;

DROP POLICY IF EXISTS vp_phase5_formats_read ON public.vp_report_formats;
CREATE POLICY vp_phase5_formats_read ON public.vp_report_formats FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()));
DROP POLICY IF EXISTS vp_phase5_credentials_read ON public.vp_valuer_credentials;
CREATE POLICY vp_phase5_credentials_read ON public.vp_valuer_credentials FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id())
   AND (public.vp_report_can('Manage Formats') OR user_id=(SELECT public.vp_field_my_user_id())
     OR public.vp_report_can('View')));
DROP POLICY IF EXISTS vp_phase5_valuations_read ON public.vp_valuation_versions;
CREATE POLICY vp_phase5_valuations_read ON public.vp_valuation_versions FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND public.vp_report_can('View'));
DROP POLICY IF EXISTS vp_phase5_reports_read ON public.vp_report_versions;
CREATE POLICY vp_phase5_reports_read ON public.vp_report_versions FOR SELECT TO authenticated
 USING (org_id=(SELECT public.vp_current_org_id()) AND public.vp_report_can('View'));

-- Tenant administrator preserves existing role-matrix allow-list and adds Release,
-- NOT the separate locked signoff.Sign (which would imply digital signing).
CREATE OR REPLACE FUNCTION public.vp_admin_replace_module_permissions(
 p_role text,p_module text,p_actions text[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
 v_actions text[]:=coalesce(p_actions,ARRAY[]::text[]);
 v_allowed text[]; v_caller_role text;
BEGIN
 IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Admin access required'; END IF;
 SELECT u.role INTO v_caller_role FROM public.valuation_auth_links l
 JOIN public.users u ON u.id=l.user_id WHERE l.auth_uid=auth.uid();
 IF p_role='Tenant Owner' AND v_caller_role<>'Tenant Owner' THEN
   RAISE EXCEPTION 'Only the Tenant Owner can edit owner permissions'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.roles WHERE org_id=v_org AND name=p_role)
   THEN RAISE EXCEPTION 'Unknown role'; END IF;
 v_allowed := CASE p_module
   WHEN 'cases' THEN ARRAY['View','Create','Edit','Delete','Assign','Approve','Export']
   WHEN 'field' THEN ARRAY['View','Assign','Check In/Out','Manage Geofence','Export']
   WHEN 'qc' THEN ARRAY['View','Approve','Return','Edit','Export']
   WHEN 'signoff' THEN ARRAY['View','Generate','Manage Templates','Release']
   WHEN 'billing' THEN ARRAY['View','Create','Approve','Export']
   WHEN 'admin' THEN ARRAY['View','Manage Users','Manage Roles','Edit Settings','Audit Logs']
   ELSE NULL END;
 IF v_allowed IS NULL OR EXISTS (SELECT 1 FROM unnest(v_actions) AS a(action)
   WHERE a.action IS NULL OR a.action<>ALL(v_allowed)) THEN
   RAISE EXCEPTION 'Unknown module/action or restricted digital sign permission'; END IF;
 DELETE FROM public.role_perms WHERE org_id=v_org AND role=p_role AND perm LIKE p_module||'.%';
 INSERT INTO public.role_perms(org_id,role,perm)
   SELECT v_org,p_role,p_module||'.'||a.action FROM unnest(v_actions) AS a(action)
   ON CONFLICT DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_report_save_format(
 p_bank text,p_product text,p_name text,p_instructions text DEFAULT '')
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();
BEGIN
 IF v_org IS NULL OR NOT public.vp_report_can('Manage Formats') THEN
   RAISE EXCEPTION 'Report format management permission required'; END IF;
 IF p_product NOT IN ('House','Flat','Land','Commercial')
    OR length(btrim(coalesce(p_name,''))) NOT BETWEEN 3 AND 160
    OR length(coalesce(p_instructions,''))>2000 THEN RAISE EXCEPTION 'Invalid format details'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.banks WHERE org_id=v_org AND name=p_bank) THEN
   RAISE EXCEPTION 'Bank does not exist for your tenant'; END IF;
 INSERT INTO public.vp_report_formats(org_id,bank_name,property_type,format_name,instructions,active)
 VALUES(v_org,p_bank,p_product,btrim(p_name),coalesce(p_instructions,''),true)
 ON CONFLICT(org_id,bank_name,property_type) DO UPDATE
 SET format_name=EXCLUDED.format_name,instructions=EXCLUDED.instructions,active=true,updated_at=now();
END; $$;

CREATE OR REPLACE FUNCTION public.vp_report_record_valuer(
 p_user_id bigint,p_reg_no text,p_expires date,p_category text DEFAULT 'Land & Building')
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
BEGIN
 IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Tenant admin required'; END IF;
 IF p_reg_no IS NULL OR length(btrim(p_reg_no)) NOT BETWEEN 5 AND 100
   OR p_expires IS NULL OR p_category NOT IN ('Land & Building','Plant & Machinery','Securities or Financial Assets')
   THEN RAISE EXCEPTION 'Registration number, expiry and category required'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.users WHERE org_id=v_org AND id=p_user_id AND active IS TRUE)
   THEN RAISE EXCEPTION 'Select an active user belonging to your organization'; END IF;
 INSERT INTO public.vp_valuer_credentials(org_id,user_id,reg_no,expires_on,registration_category,recorded_by)
 VALUES(v_org,p_user_id,btrim(p_reg_no),p_expires,p_category,v_actor)
 ON CONFLICT (org_id,user_id) DO UPDATE SET reg_no=EXCLUDED.reg_no,expires_on=EXCLUDED.expires_on,
   registration_category=EXCLUDED.registration_category,review_status='Pending',
   reviewed_by=NULL,reviewed_at=NULL,review_note='',recorded_by=EXCLUDED.recorded_by,recorded_at=now();
END; $$;

-- Two-person administrative check: registering a valuer's own credential is not enough.
CREATE OR REPLACE FUNCTION public.vp_report_review_valuer(
 p_user_id bigint,p_accept boolean,p_note text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v_rec public.vp_valuer_credentials%ROWTYPE;
BEGIN
 IF v_org IS NULL OR NOT public.vp_is_admin(v_org) THEN RAISE EXCEPTION 'Tenant admin required'; END IF;
 IF p_accept IS NULL OR length(btrim(coalesce(p_note,'')))<8 THEN
   RAISE EXCEPTION 'Provide an 8+ character record of the credential evidence checked'; END IF;
 SELECT * INTO v_rec FROM public.vp_valuer_credentials
 WHERE org_id=v_org AND user_id=p_user_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Valuer registration not recorded'; END IF;
 IF v_actor=p_user_id OR v_actor=v_rec.recorded_by THEN
   RAISE EXCEPTION 'A separate tenant administrator must review the registration'; END IF;
 IF p_accept AND v_rec.expires_on<CURRENT_DATE THEN
   RAISE EXCEPTION 'Registration expiry date is in the past'; END IF;
 UPDATE public.vp_valuer_credentials SET review_status=CASE WHEN p_accept THEN 'Checked' ELSE 'Rejected' END,
  reviewed_by=v_actor,reviewed_at=now(),review_note=btrim(p_note)
 WHERE org_id=v_org AND user_id=p_user_id;
END; $$;

-- Exact arithmetic mirrors src/lib/valuation.ts; results are calculated in PostgreSQL.
-- Existing forms.data is preserved/extended under valuation_inputs and valuation_results keys.
CREATE OR REPLACE FUNCTION public.vp_report_save_valuation(
 p_case_num integer,p_input jsonb,p_submit boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_actor bigint:=public.vp_field_my_user_id();
 v_case public.cases%ROWTYPE; v_login text; v_key text; v_num numeric;
 v_area numeric; v_rate numeric; v_guide_rate numeric; v_built numeric; v_build_rate numeric;
 v_age numeric; v_life numeric; v_salvage numeric; v_amenities numeric; v_real_pct numeric; v_dist_pct numeric;
 v_land numeric; v_replacement numeric; v_dep_pct numeric; v_dep numeric; v_build_value numeric;
 v_market numeric; v_guide numeric; v_calc jsonb; v_version integer;
BEGIN
 IF v_org IS NULL OR NOT public.vp_report_can('Edit') THEN
   RAISE EXCEPTION 'Valuation edit permission required'; END IF;
 IF p_submit IS NULL OR jsonb_typeof(p_input) IS DISTINCT FROM 'object' THEN
   RAISE EXCEPTION 'Valid valuation inputs and submit flag are required'; END IF;
 SELECT * INTO v_case FROM public.cases
   WHERE org_id=v_org AND num=p_case_num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case not found'; END IF;
 IF v_case.meta->>'ui_stage' IS DISTINCT FROM 'Report Draft' OR
    v_case.stage IN ('Approved','Submitted','Invoiced') THEN
   RAISE EXCEPTION 'Valuation can be edited only at Report Draft stage'; END IF;
 IF EXISTS(SELECT 1 FROM public.vp_qc_tasks t WHERE t.org_id=v_org AND t.num=p_case_num
      AND t.status='Pending') THEN RAISE EXCEPTION 'Cannot edit while QC is pending'; END IF;
 FOREACH v_key IN ARRAY ARRAY['landAreaSqYd','landRate','guidelineRate',
   'builtUpSqFt','constructionRate','ageYears','lifeYears','salvagePct',
   'amenities','realizablePct','distressPct'] LOOP
   IF jsonb_typeof(p_input->v_key) IS DISTINCT FROM 'number' THEN
     RAISE EXCEPTION 'Missing or invalid numeric input: %',v_key; END IF;
   v_num:=(p_input->>v_key)::numeric;
   IF v_num<0 OR v_num>1000000000 THEN RAISE EXCEPTION 'Value out of range: %',v_key; END IF;
 END LOOP;
 v_area:=(p_input->>'landAreaSqYd')::numeric;v_rate:=(p_input->>'landRate')::numeric;
 v_guide_rate:=(p_input->>'guidelineRate')::numeric;v_built:=(p_input->>'builtUpSqFt')::numeric;
 v_build_rate:=(p_input->>'constructionRate')::numeric;v_age:=(p_input->>'ageYears')::numeric;
 v_life:=(p_input->>'lifeYears')::numeric;v_salvage:=(p_input->>'salvagePct')::numeric;
 v_amenities:=(p_input->>'amenities')::numeric;v_real_pct:=(p_input->>'realizablePct')::numeric;
 v_dist_pct:=(p_input->>'distressPct')::numeric;
 IF v_salvage>100 OR v_real_pct>100 OR v_dist_pct>100
    OR (v_built>0 AND v_life<=0) THEN RAISE EXCEPTION 'Invalid depreciation or valuation percentages/life'; END IF;
 IF p_submit AND (v_area<=0 OR v_rate<=0) THEN
    RAISE EXCEPTION 'Land area and market land rate are required before submission'; END IF;
 v_land:=round(v_area*v_rate);v_replacement:=round(v_built*v_build_rate);
 v_dep_pct:=CASE WHEN v_life>0 THEN ((100-v_salvage)*least(greatest(v_age,0),v_life))/v_life ELSE 0 END;
 v_dep:=round(v_replacement*v_dep_pct/100);v_build_value:=v_replacement-v_dep;
 v_market:=v_land+v_build_value+round(v_amenities);
 v_guide:=round(v_area*v_guide_rate)+v_build_value;
 IF p_submit AND v_market<=0 THEN RAISE EXCEPTION 'Cannot submit a zero market valuation'; END IF;
 v_calc:=jsonb_build_object('landValue',v_land,'replacementCost',v_replacement,
  'depreciationPct',round(v_dep_pct,2),'depreciation',v_dep,'buildingValue',v_build_value,
  'marketValue',v_market,'guidelineValue',v_guide,
  'realizableValue',round(v_market*v_real_pct/100),'distressValue',round(v_market*v_dist_pct/100));
 SELECT u.login INTO v_login FROM public.users u WHERE u.org_id=v_org AND u.id=v_actor;
 INSERT INTO public.forms(org_id,num,data,status,"by",updated)
 VALUES(v_org,p_case_num,jsonb_build_object('valuation_inputs',p_input,'valuation_results',v_calc,'valuation_method','Land & Building'),
   CASE WHEN p_submit THEN 'submitted' ELSE 'draft' END,v_login,now())
 ON CONFLICT(org_id,num) DO UPDATE SET
   data=coalesce(forms.data,'{}'::jsonb)||EXCLUDED.data,
   status=EXCLUDED.status,"by"=EXCLUDED."by",updated=now();
 IF p_submit THEN
   SELECT coalesce(max(version_no),0)+1 INTO v_version FROM public.vp_valuation_versions
     WHERE org_id=v_org AND num=p_case_num;
   INSERT INTO public.vp_valuation_versions(org_id,num,version_no,inputs,calculations,submitted_by)
     VALUES(v_org,p_case_num,v_version,p_input,v_calc,v_actor);
   INSERT INTO public.log(org_id,num,"by",msg)
     VALUES(v_org,p_case_num,v_login,'Valuation form submitted (version '||v_version||')');
 END IF;
 RETURN jsonb_build_object('submitted',p_submit,'version_no',v_version,'results',v_calc);
END; $$;

-- A prepared report snapshots the already QC-approved valuation and format reference.
CREATE OR REPLACE FUNCTION public.vp_report_prepare(p_case_num integer)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
 v_case public.cases%ROWTYPE;v_val public.vp_valuation_versions%ROWTYPE;
 v_qc public.vp_qc_tasks%ROWTYPE;v_format text;v_report_no integer;v_id bigint;
BEGIN
 IF v_org IS NULL OR NOT public.vp_report_can('Prepare') THEN
   RAISE EXCEPTION 'Report generation permission required'; END IF;
 SELECT * INTO v_case FROM public.cases WHERE org_id=v_org AND num=p_case_num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case not found'; END IF;
 IF v_case.meta->>'ui_stage' IS DISTINCT FROM 'Approved' OR v_case.stage<>'Approved' THEN
   RAISE EXCEPTION 'Final QC must approve the case before preparing the official report'; END IF;
 IF EXISTS (SELECT 1 FROM public.vp_report_versions WHERE org_id=v_org AND num=p_case_num AND status='Released')
   THEN RAISE EXCEPTION 'Case already has a released report; revisions require a controlled amendment workflow'; END IF;
 SELECT * INTO v_val FROM public.vp_valuation_versions
 WHERE org_id=v_org AND num=p_case_num ORDER BY version_no DESC LIMIT 1;
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM public.forms WHERE org_id=v_org AND num=p_case_num
     AND status='submitted') THEN RAISE EXCEPTION 'Submitted valuation not found'; END IF;
 SELECT * INTO v_qc FROM public.vp_qc_tasks
 WHERE org_id=v_org AND num=p_case_num AND review_stage='Final QC' AND status='Approved'
   AND decided_at>=v_val.submitted_at ORDER BY decided_at DESC,id DESC LIMIT 1;
 IF NOT FOUND THEN RAISE EXCEPTION 'No Final QC approval after the latest valuation submission'; END IF;
 SELECT format_name INTO v_format FROM public.vp_report_formats
 WHERE org_id=v_org AND bank_name=v_case.bank AND property_type=v_case.prod AND active;
 IF v_format IS NULL THEN RAISE EXCEPTION 'Configure this bank/property report format first'; END IF;
 SELECT coalesce(max(version_no),0)+1 INTO v_report_no FROM public.vp_report_versions
 WHERE org_id=v_org AND num=p_case_num;
 INSERT INTO public.vp_report_versions(org_id,num,version_no,valuation_version_no,
  format_name,case_snapshot,inputs_snapshot,calculations_snapshot,prepared_by,final_qc_task_id)
 VALUES(v_org,p_case_num,v_report_no,v_val.version_no,v_format,
  jsonb_build_object('customer',v_case.cust,'bank',v_case.bank,'branch',v_case.br,
     'property_type',v_case.prod,'property_address',v_case.addr,
     'case_number',coalesce(v_case.meta->>'case_no',p_case_num::text)),
  v_val.inputs,v_val.calculations,v_actor,v_qc.id) RETURNING id INTO v_id;
 RETURN v_id::text;
END; $$;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 VALUES('vp-report-files','vp-report-files',false,20971520,ARRAY['application/pdf']::text[])
 ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM storage.buckets WHERE id='vp-report-files' AND public=false)
 THEN RAISE EXCEPTION 'Report storage bucket is missing or public; do not publish valuation reports'; END IF;
END $$;

DROP POLICY IF EXISTS vp_phase5_report_upload ON storage.objects;
CREATE POLICY vp_phase5_report_upload ON storage.objects FOR INSERT TO authenticated
 WITH CHECK (
  bucket_id='vp-report-files' AND public.vp_report_can('Prepare')
  AND (storage.foldername(name))[1] = (SELECT public.vp_current_org_id())::text
  AND (storage.foldername(name))[2] ~ '^[0-9]+$'
  AND EXISTS(SELECT 1 FROM public.vp_report_versions r
    WHERE r.org_id=(SELECT public.vp_current_org_id())
      AND r.num::text=(storage.foldername(name))[2] AND r.status='Draft')
 );
DROP POLICY IF EXISTS vp_phase5_report_download ON storage.objects;
CREATE POLICY vp_phase5_report_download ON storage.objects FOR SELECT TO authenticated
 USING (bucket_id='vp-report-files' AND public.vp_report_can('View')
  AND (storage.foldername(name))[1]=(SELECT public.vp_current_org_id())::text
  AND EXISTS (SELECT 1 FROM public.vp_report_versions r
    WHERE r.org_id=(SELECT public.vp_current_org_id()) AND r.file_path=name));

CREATE OR REPLACE FUNCTION public.vp_report_attach_pdf(p_report_id bigint,p_file_path text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_row public.vp_report_versions%ROWTYPE;
BEGIN
 IF v_org IS NULL OR NOT public.vp_report_can('Prepare') THEN RAISE EXCEPTION 'Report generation permission required'; END IF;
 SELECT * INTO v_row FROM public.vp_report_versions
 WHERE org_id=v_org AND id=p_report_id AND status='Draft' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Draft report not found'; END IF;
 IF p_file_path IS NULL OR p_file_path NOT LIKE v_org::text||'/'||v_row.num::text||'/%'
   OR p_file_path !~ '\.pdf$' OR length(p_file_path)>300 THEN
   RAISE EXCEPTION 'Incorrect private report PDF path'; END IF;
 IF NOT EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='vp-report-files' AND name=p_file_path)
   THEN RAISE EXCEPTION 'PDF has not been uploaded to the private bucket'; END IF;
 UPDATE public.vp_report_versions SET file_path=p_file_path WHERE id=p_report_id AND org_id=v_org;
END; $$;

CREATE OR REPLACE FUNCTION public.vp_report_release(p_report_id bigint)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id();v_actor bigint:=public.vp_field_my_user_id();
 v_row public.vp_report_versions%ROWTYPE;v_case public.cases%ROWTYPE;
 v_val public.vp_valuation_versions%ROWTYPE;v_cred public.vp_valuer_credentials%ROWTYPE;v_login text;
BEGIN
 IF v_org IS NULL OR NOT public.vp_report_can('Release') THEN
   RAISE EXCEPTION 'You need the distinct signoff.Release permission'; END IF;
 SELECT * INTO v_row FROM public.vp_report_versions
 WHERE org_id=v_org AND id=p_report_id AND status='Draft' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Draft report not found'; END IF;
 SELECT * INTO v_case FROM public.cases WHERE org_id=v_org AND num=v_row.num FOR UPDATE;
 IF v_case.stage<>'Approved' OR v_case.meta->>'ui_stage' IS DISTINCT FROM 'Approved' THEN
   RAISE EXCEPTION 'Case is not at approved Final QC stage'; END IF;
 IF v_row.file_path IS NULL OR NOT EXISTS(SELECT 1 FROM storage.objects
     WHERE bucket_id='vp-report-files' AND name=v_row.file_path) THEN
   RAISE EXCEPTION 'Attach the verified bank-format PDF before release'; END IF;
 SELECT * INTO v_val FROM public.vp_valuation_versions
 WHERE org_id=v_org AND num=v_row.num ORDER BY version_no DESC LIMIT 1;
 IF NOT FOUND OR v_val.version_no<>v_row.valuation_version_no THEN
   RAISE EXCEPTION 'A newer valuation exists; prepare a fresh report'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.vp_qc_tasks q
   WHERE q.org_id=v_org AND q.id=v_row.final_qc_task_id AND q.num=v_row.num
     AND q.review_stage='Final QC' AND q.status='Approved'
     AND q.decided_at>=v_val.submitted_at AND q.decided_by IS DISTINCT FROM v_actor) THEN
   RAISE EXCEPTION 'Independent Final QC approval is missing'; END IF;
 SELECT * INTO v_cred FROM public.vp_valuer_credentials
 WHERE org_id=v_org AND user_id=v_actor AND review_status='Checked'
   AND expires_on>=CURRENT_DATE AND registration_category='Land & Building';
 IF NOT FOUND THEN RAISE EXCEPTION 'Your Land & Building credential is not currently checked and valid'; END IF;
 IF EXISTS(SELECT 1 FROM public.vp_report_versions r
  WHERE r.org_id=v_org AND r.num=v_row.num AND r.status='Released') THEN
   RAISE EXCEPTION 'A released report already exists for the case'; END IF;
 UPDATE public.vp_report_versions SET status='Released',released_by=v_actor,released_at=now(),
   released_reg_no=v_cred.reg_no WHERE id=p_report_id AND org_id=v_org;
 UPDATE public.cases SET stage='Submitted',
   meta=jsonb_set(coalesce(meta,'{}'::jsonb),'{ui_stage}','"Delivered"'::jsonb,true)
 WHERE org_id=v_org AND num=v_row.num;
 SELECT login INTO v_login FROM public.users WHERE org_id=v_org AND id=v_actor;
 INSERT INTO public.log(org_id,num,"by",msg)
 VALUES(v_org,v_row.num,v_login,'Report version '||v_row.version_no||' released by internally checked valuer. Not cryptographically signed.');
END; $$;

-- Revoke broad PostgreSQL default function grants; preserve app access only.
DO $$ DECLARE f record; BEGIN
 FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
   JOIN pg_namespace n ON n.oid=p.pronamespace
   WHERE n.nspname='public' AND p.proname=ANY(ARRAY[
     'vp_report_can','vp_report_save_format','vp_report_record_valuer','vp_report_review_valuer',
     'vp_report_save_valuation','vp_report_prepare','vp_report_attach_pdf','vp_report_release']) LOOP
   EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon',f.sig);
   EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.sig);
 END LOOP;
END $$;
COMMIT;
