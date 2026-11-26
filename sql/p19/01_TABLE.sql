BEGIN;
CREATE TABLE public.vp_p19_analyses (
 org_id bigint NOT NULL, num integer NOT NULL, version_no integer NOT NULL CHECK(version_no>0),
 link_version integer NOT NULL, effective_date date NOT NULL,
 method text NOT NULL CHECK(method IN ('cost','comparison','income')),
 formula_version text NOT NULL CHECK(formula_version='p19-v1'),
 inputs jsonb NOT NULL, results jsonb NOT NULL, property_snapshot jsonb NOT NULL,
 evidence_snapshots jsonb NOT NULL, inspection_snapshot jsonb, created_by bigint NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,num,version_no),
 FOREIGN KEY(org_id,num,link_version) REFERENCES public.vp_property_case_links(org_id,num,link_version),
 FOREIGN KEY(org_id,created_by) REFERENCES public.users(org_id,id)
);
ALTER TABLE public.vp_p19_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p19_read ON public.vp_p19_analyses FOR SELECT TO authenticated
 USING(org_id=(SELECT public.vp_current_org_id()) AND public.vp_sec_case_visible(num)
 AND ((SELECT public.vp_report_can('View')) OR (SELECT public.vp_report_can('Edit')) OR (SELECT public.vp_sec_can('qc.View'))));
REVOKE ALL ON public.vp_p19_analyses FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_p19_analyses TO authenticated;
COMMIT;
