CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.organization_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  branch_type text NOT NULL DEFAULT 'Local',
  city text, state text, pincode text, address text,
  manager_name text, email text, phone text,
  geofence_km numeric NOT NULL DEFAULT 20,
  tat_days integer NOT NULL DEFAULT 3,
  case_prefix text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_branches TO authenticated;
GRANT ALL ON public.organization_branches TO service_role;
ALTER TABLE public.organization_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view branches" ON public.organization_branches FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "Admins insert branches" ON public.organization_branches FOR INSERT TO authenticated WITH CHECK (public.is_org_admin(organization_id));
CREATE POLICY "Admins update branches" ON public.organization_branches FOR UPDATE TO authenticated USING (public.is_org_admin(organization_id)) WITH CHECK (public.is_org_admin(organization_id));
CREATE POLICY "Admins delete branches" ON public.organization_branches FOR DELETE TO authenticated USING (public.is_org_admin(organization_id));
CREATE TRIGGER trg_branches_updated BEFORE UPDATE ON public.organization_branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.branch_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.organization_branches(id) ON DELETE CASCADE,
  setting_key text NOT NULL,
  setting_value text NOT NULL,
  group_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX branch_settings_uniq ON public.branch_settings (organization_id, COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid), setting_key);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.branch_settings TO authenticated;
GRANT ALL ON public.branch_settings TO service_role;
ALTER TABLE public.branch_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members view settings" ON public.branch_settings FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "Admins insert settings" ON public.branch_settings FOR INSERT TO authenticated WITH CHECK (public.is_org_admin(organization_id));
CREATE POLICY "Admins update settings" ON public.branch_settings FOR UPDATE TO authenticated USING (public.is_org_admin(organization_id)) WITH CHECK (public.is_org_admin(organization_id));
CREATE POLICY "Admins delete settings" ON public.branch_settings FOR DELETE TO authenticated USING (public.is_org_admin(organization_id));
CREATE TRIGGER trg_branch_settings_updated BEFORE UPDATE ON public.branch_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.valuation_cases
  ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES public.organization_branches(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'Initiation',
  ADD COLUMN IF NOT EXISTS fee_amount numeric,
  ADD COLUMN IF NOT EXISTS tat_due_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_cases_branch ON public.valuation_cases(branch_id);
CREATE INDEX IF NOT EXISTS idx_cases_stage ON public.valuation_cases(organization_id, stage);

ALTER TABLE public.site_visits
  ADD COLUMN IF NOT EXISTS geofence_verified boolean,
  ADD COLUMN IF NOT EXISTS geofence_distance_m numeric,
  ADD COLUMN IF NOT EXISTS gps_accuracy_m numeric,
  ADD COLUMN IF NOT EXISTS photo_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checkin_at timestamptz,
  ADD COLUMN IF NOT EXISTS checkout_at timestamptz;

ALTER TABLE public.valuation_reports
  ADD COLUMN IF NOT EXISTS bank_format text,
  ADD COLUMN IF NOT EXISTS ibbi_reg_no text,
  ADD COLUMN IF NOT EXISTS signed_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS compliance_status text DEFAULT 'Pending';