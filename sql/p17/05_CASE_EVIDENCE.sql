BEGIN;
CREATE TABLE public.vp_case_market_evidence (
 org_id bigint NOT NULL, num integer NOT NULL, link_version integer NOT NULL, evidence_id bigint NOT NULL,
 effective_date date NOT NULL, snapshot jsonb NOT NULL CHECK(jsonb_typeof(snapshot)='object'),
 reason text NOT NULL CHECK(length(trim(reason)) BETWEEN 1 AND 1000),
 selected_by bigint NOT NULL, selected_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,num,link_version,evidence_id),
 FOREIGN KEY(org_id,num,link_version) REFERENCES public.vp_property_case_links(org_id,num,link_version),
 FOREIGN KEY(org_id,evidence_id) REFERENCES public.vp_market_evidence(org_id,id),
 FOREIGN KEY(org_id,selected_by) REFERENCES public.users(org_id,id)
);
ALTER TABLE public.vp_case_market_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p17_case_read ON public.vp_case_market_evidence FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND (SELECT public.vp_sec_can('cases.View')) AND public.vp_sec_case_visible(num));
REVOKE ALL ON public.vp_case_market_evidence FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_case_market_evidence TO authenticated;
CREATE FUNCTION public.vp_p17_select_evidence(p_num integer,p_link_version integer,p_evidence_id bigint,p_effective_date date,p_reason text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); l public.vp_property_case_links%ROWTYPE; e public.vp_market_evidence%ROWTYPE; cat text;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can('cases.Edit'),false) OR NOT coalesce(public.vp_sec_case_visible(p_num),false) THEN RAISE EXCEPTION 'Case evidence permission denied' USING ERRCODE='42501'; END IF;
 IF p_effective_date IS NULL OR p_effective_date>CURRENT_DATE OR p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Effective date and reason required'; END IF;
 PERFORM 1 FROM public.cases WHERE org_id=o AND num=p_num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case unavailable'; END IF;
 SELECT * INTO l FROM public.vp_property_case_links WHERE org_id=o AND num=p_num ORDER BY link_version DESC LIMIT 1;
 IF NOT FOUND OR l.link_version IS DISTINCT FROM p_link_version THEN RAISE EXCEPTION 'Property link changed; reload' USING ERRCODE='40001'; END IF;
 SELECT data->>'category' INTO cat FROM public.vp_property_revisions WHERE org_id=o AND property_id=l.property_id AND revision=l.property_revision;
 SELECT * INTO e FROM public.vp_market_evidence WHERE org_id=o AND id=p_evidence_id FOR SHARE;
 IF NOT FOUND OR e.status<>'verified' OR e.observed_on>p_effective_date OR e.property_id IS NOT DISTINCT FROM l.property_id OR e.category IS DISTINCT FROM cat THEN RAISE EXCEPTION 'Evidence not eligible for this property or effective date'; END IF;
 INSERT INTO public.vp_case_market_evidence(org_id,num,link_version,evidence_id,effective_date,snapshot,reason,selected_by) VALUES(o,p_num,p_link_version,p_evidence_id,p_effective_date,to_jsonb(e)-'location',trim(p_reason),u);
END $$;
REVOKE ALL ON FUNCTION public.vp_p17_select_evidence(integer,integer,bigint,date,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p17_select_evidence(integer,integer,bigint,date,text) TO authenticated;
COMMIT;
