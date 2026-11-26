BEGIN;
CREATE TABLE public.vp_p19_reviews (
 org_id bigint NOT NULL,num integer NOT NULL,version_no integer NOT NULL,
 decision text NOT NULL CHECK(decision IN ('Reviewed','Returned')),reason text NOT NULL CHECK(length(btrim(reason)) BETWEEN 1 AND 1000),
 reviewed_by bigint NOT NULL,reviewed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(org_id,num,version_no),
 FOREIGN KEY(org_id,num,version_no) REFERENCES public.vp_p19_analyses(org_id,num,version_no),
 FOREIGN KEY(org_id,reviewed_by) REFERENCES public.users(org_id,id)
);
ALTER TABLE public.vp_p19_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY vp_p19_review_read ON public.vp_p19_reviews FOR SELECT TO authenticated USING(org_id=(SELECT public.vp_current_org_id()) AND public.vp_sec_case_visible(num) AND ((SELECT public.vp_report_can('View')) OR (SELECT public.vp_report_can('Edit')) OR (SELECT public.vp_sec_can('qc.View'))));
REVOKE ALL ON public.vp_p19_reviews FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.vp_p19_reviews TO authenticated;
CREATE FUNCTION public.vp_p19_review(p_num integer,p_version integer,p_decision text,p_reason text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id();u bigint:=public.vp_field_my_user_id();a public.vp_p19_analyses%ROWTYPE;v integer;l integer;c public.cases%ROWTYPE;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('qc.Edit'),false) OR NOT coalesce(public.vp_sec_case_visible(p_num),false) THEN RAISE EXCEPTION 'Analysis review permission denied' USING ERRCODE='42501'; END IF;
 IF p_decision IS NULL OR p_decision NOT IN ('Reviewed','Returned') OR p_reason IS NULL OR length(btrim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Decision and reason required'; END IF;
 SELECT * INTO c FROM public.cases WHERE org_id=o AND num=p_num FOR UPDATE;
 IF NOT FOUND OR c.meta->>'ui_stage' IS DISTINCT FROM 'Report Draft' OR c.stage IN ('Approved','Submitted','Invoiced') OR EXISTS(SELECT 1 FROM public.vp_qc_tasks WHERE org_id=o AND num=p_num AND status='Pending') THEN RAISE EXCEPTION 'Analysis review requires Report Draft without pending QC'; END IF;
 SELECT * INTO a FROM public.vp_p19_analyses WHERE org_id=o AND num=p_num AND version_no=p_version;
 IF NOT FOUND OR a.created_by=u THEN RAISE EXCEPTION 'Independent reviewer required'; END IF;
 SELECT max(version_no) INTO v FROM public.vp_p19_analyses WHERE org_id=o AND num=p_num;
 SELECT max(link_version) INTO l FROM public.vp_property_case_links WHERE org_id=o AND num=p_num;
 IF v IS DISTINCT FROM p_version OR l IS DISTINCT FROM a.link_version THEN RAISE EXCEPTION 'Analysis superseded; reload'; END IF;
 INSERT INTO public.vp_p19_reviews(org_id,num,version_no,decision,reason,reviewed_by) VALUES(o,p_num,p_version,p_decision,btrim(p_reason),u);
END $$;
REVOKE ALL ON FUNCTION public.vp_p19_review(integer,integer,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p19_review(integer,integer,text,text) TO authenticated;
COMMIT;
