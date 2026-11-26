BEGIN;
CREATE TABLE public.vp_p18_templates (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 org_id bigint NOT NULL REFERENCES public.orgs(id),
 category text NOT NULL CHECK(category IN ('Land','House','Flat','Commercial')),
 fields jsonb NOT NULL CHECK(jsonb_typeof(fields)='array' AND jsonb_array_length(fields) BETWEEN 1 AND 30 AND octet_length(fields::text)<=24000),
 reason text NOT NULL CHECK(length(btrim(reason)) BETWEEN 1 AND 1000),
 published_by bigint NOT NULL, published_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(org_id,published_by) REFERENCES public.users(org_id,id)
);
CREATE INDEX vp_p18_templates_latest ON public.vp_p18_templates(org_id,category,id DESC);
ALTER TABLE public.vp_p18_templates ENABLE ROW LEVEL SECURITY;
-- Non-sensitive form definitions only; assigned field officers may read their own tenant's templates.
CREATE POLICY vp_p18_template_read ON public.vp_p18_templates FOR SELECT TO authenticated
 USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_field_my_user_id()) IS NOT NULL);
REVOKE ALL ON public.vp_p18_templates FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_p18_templates TO authenticated;
COMMIT;
