BEGIN;
CREATE TABLE public.vp_p20_templates (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 org_id bigint NOT NULL REFERENCES public.orgs(id), bank_name text NOT NULL,
 category text NOT NULL CHECK(category IN ('Land','House','Flat','Commercial')),
 title text NOT NULL CHECK(length(btrim(title)) BETWEEN 1 AND 160),
 workbook_base64 text NOT NULL CHECK(length(workbook_base64) BETWEEN 4 AND 1398104),
 mapping jsonb NOT NULL CHECK(jsonb_typeof(mapping)='array' AND jsonb_array_length(mapping) BETWEEN 5 AND 80),
 reason text NOT NULL CHECK(length(btrim(reason)) BETWEEN 1 AND 1000),
 published_by bigint NOT NULL, published_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(org_id,id), FOREIGN KEY(org_id,published_by) REFERENCES public.users(org_id,id)
);
CREATE INDEX vp_p20_templates_lookup ON public.vp_p20_templates(org_id,bank_name,category,id DESC);
ALTER TABLE public.vp_p20_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p20_template_read ON public.vp_p20_templates FOR SELECT TO authenticated
 USING(org_id=(SELECT public.vp_current_org_id()) AND ((SELECT public.vp_report_can('Manage Formats')) OR (SELECT public.vp_report_can('Prepare')) OR (SELECT public.vp_report_can('View'))));
REVOKE ALL ON public.vp_p20_templates FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_p20_templates TO authenticated;
CREATE TABLE public.vp_p20_exports (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, org_id bigint NOT NULL,
 num integer NOT NULL, analysis_version integer NOT NULL, template_id bigint NOT NULL,
 cell_values jsonb NOT NULL CHECK(jsonb_typeof(cell_values)='object'),
 prepared_by bigint NOT NULL, prepared_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(org_id,num,analysis_version) REFERENCES public.vp_p19_reviews(org_id,num,version_no),
 FOREIGN KEY(org_id,template_id) REFERENCES public.vp_p20_templates(org_id,id),
 FOREIGN KEY(org_id,prepared_by) REFERENCES public.users(org_id,id),
 UNIQUE(org_id,num,analysis_version,template_id)
);
ALTER TABLE public.vp_p20_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p20_export_read ON public.vp_p20_exports FOR SELECT TO authenticated
 USING(org_id=(SELECT public.vp_current_org_id()) AND public.vp_sec_case_visible(num) AND ((SELECT public.vp_report_can('Prepare')) OR (SELECT public.vp_report_can('View'))));
REVOKE ALL ON public.vp_p20_exports FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_p20_exports TO authenticated;
COMMIT;
