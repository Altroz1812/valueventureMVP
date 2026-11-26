-- P16: additive, transactional, staging first. Run once only. No legacy table changes.
BEGIN;
DO $$
BEGIN
 IF to_regprocedure('public.vp_current_org_id()') IS NULL OR to_regprocedure('public.vp_field_my_user_id()') IS NULL OR to_regprocedure('public.vp_sec_can(text)') IS NULL OR to_regprocedure('public.vp_sec_case_visible(bigint)') IS NULL THEN RAISE EXCEPTION 'P16 requires P10 identity and RBAC helpers'; END IF;
 IF EXISTS (SELECT 1 FROM (VALUES ('orgs','id','bigint'),('users','id','bigint'),('users','org_id','bigint'),('cases','org_id','bigint'),('cases','num','integer')) e(t,c,typ) WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns i WHERE i.table_schema='public' AND i.table_name=e.t AND i.column_name=e.c AND i.data_type=e.typ)) THEN RAISE EXCEPTION 'P16 requires original BIGINT agency schema'; END IF;
END $$;
CREATE TABLE public.vp_property_master (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 org_id bigint NOT NULL REFERENCES public.orgs(id),
 current_revision integer NOT NULL CHECK (current_revision>0),
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object'),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(org_id,id)
);
CREATE TABLE public.vp_property_revisions (
 org_id bigint NOT NULL, property_id bigint NOT NULL, revision integer NOT NULL CHECK(revision>0),
 data jsonb NOT NULL CHECK(jsonb_typeof(data)='object'), reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 1 AND 1000),
 recorded_by bigint NOT NULL, recorded_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,property_id,revision),
 FOREIGN KEY(org_id,property_id) REFERENCES public.vp_property_master(org_id,id),
 FOREIGN KEY(org_id,recorded_by) REFERENCES public.users(org_id,id)
);
CREATE TABLE public.vp_property_case_links (
 org_id bigint NOT NULL, num integer NOT NULL, link_version integer NOT NULL CHECK(link_version>0),
 property_id bigint NOT NULL, property_revision integer NOT NULL,
 reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 1 AND 1000),
 linked_by bigint NOT NULL, linked_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,num,link_version),
 FOREIGN KEY(org_id,num) REFERENCES public.cases(org_id,num),
 FOREIGN KEY(org_id,property_id,property_revision) REFERENCES public.vp_property_revisions(org_id,property_id,revision),
 FOREIGN KEY(org_id,linked_by) REFERENCES public.users(org_id,id)
);
CREATE INDEX vp_p16_master_org_idx ON public.vp_property_master(org_id,id DESC);
CREATE INDEX vp_p16_link_property_idx ON public.vp_property_case_links(org_id,property_id,num,link_version DESC);
-- Current property association; PostgreSQL 15+ security-invoker view inherits table RLS.
CREATE VIEW public.vp_property_current_links WITH (security_invoker=true) AS
 SELECT DISTINCT ON(org_id,num) org_id,num,link_version,property_id,property_revision,reason,linked_by,linked_at
 FROM public.vp_property_case_links ORDER BY org_id,num,link_version DESC;
ALTER TABLE public.vp_property_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_property_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vp_property_case_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p16_master_read ON public.vp_property_master FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')));
CREATE POLICY vp_p16_revision_read ON public.vp_property_revisions FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')));
CREATE POLICY vp_p16_link_read ON public.vp_property_case_links FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')) AND public.vp_sec_case_visible(num));
REVOKE ALL ON public.vp_property_master,public.vp_property_revisions,public.vp_property_case_links,public.vp_property_current_links FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_property_master,public.vp_property_revisions,public.vp_property_case_links,public.vp_property_current_links TO authenticated;
COMMIT;
