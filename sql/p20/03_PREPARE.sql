BEGIN;
CREATE FUNCTION public.vp_p20_prepare(p_num integer,p_version integer,p_template bigint) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $p20$
DECLARE o bigint:=public.vp_current_org_id();u bigint:=public.vp_field_my_user_id();c public.cases%ROWTYPE;
 a public.vp_p19_analyses%ROWTYPE;r public.vp_p19_reviews%ROWTYPE;t public.vp_p20_templates%ROWTYPE; v integer;l integer;out_id bigint; vals jsonb;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_report_can('Prepare'),false) OR NOT coalesce(public.vp_sec_case_visible(p_num),false) THEN RAISE EXCEPTION 'Prepare permission denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO c FROM public.cases WHERE org_id=o AND num=p_num FOR UPDATE;
 IF NOT FOUND OR c.meta->>'ui_stage' IS DISTINCT FROM 'Report Draft' OR c.stage IN ('Approved','Submitted','Invoiced') OR EXISTS(SELECT 1 FROM public.vp_qc_tasks WHERE org_id=o AND num=p_num AND status='Pending') THEN RAISE EXCEPTION 'Prepare requires Report Draft without pending QC'; END IF;
 SELECT * INTO a FROM public.vp_p19_analyses WHERE org_id=o AND num=p_num AND version_no=p_version;
 IF NOT FOUND THEN RAISE EXCEPTION 'Analysis unavailable'; END IF;
 SELECT * INTO r FROM public.vp_p19_reviews WHERE org_id=o AND num=p_num AND version_no=p_version;
 IF NOT FOUND OR r.decision<>'Reviewed' OR r.reviewed_by=a.created_by THEN RAISE EXCEPTION 'Independent reviewed analysis required'; END IF;
 SELECT max(version_no) INTO v FROM public.vp_p19_analyses WHERE org_id=o AND num=p_num;
 SELECT max(link_version) INTO l FROM public.vp_property_case_links WHERE org_id=o AND num=p_num;
 IF v IS DISTINCT FROM p_version OR l IS DISTINCT FROM a.link_version THEN RAISE EXCEPTION 'Analysis superseded; reload'; END IF;
 SELECT * INTO t FROM public.vp_p20_templates WHERE org_id=o AND id=p_template AND bank_name=c.bank AND category=c.prod;
 IF NOT FOUND THEN RAISE EXCEPTION 'Template must match case bank and category'; END IF;
 IF t.id IS DISTINCT FROM (SELECT max(id) FROM public.vp_p20_templates WHERE org_id=o AND bank_name=c.bank AND category=c.prod) THEN RAISE EXCEPTION 'Template superseded; reload'; END IF;
 vals:=(a.results-'lines')||jsonb_build_object('status','REVIEWED WORKPAPER - NOT RELEASED','case_num',c.num,'bank',c.bank,'customer',c.cust,'category',c.prod,'address',a.property_snapshot->>'address','property_label',a.property_snapshot->>'label','effective_date',a.effective_date,'method',a.method,'analysis_version',a.version_no,'formula_version',a.formula_version,'reason',a.inputs->>'reason','review_reason',r.reason);
 INSERT INTO public.vp_p20_exports(org_id,num,analysis_version,template_id,cell_values,prepared_by) VALUES(o,p_num,p_version,p_template,vals,u)
 ON CONFLICT(org_id,num,analysis_version,template_id) DO NOTHING RETURNING id INTO out_id;
 IF out_id IS NULL THEN SELECT id INTO out_id FROM public.vp_p20_exports WHERE org_id=o AND num=p_num AND analysis_version=p_version AND template_id=p_template; END IF;
 RETURN out_id::text;
END $p20$;
REVOKE ALL ON FUNCTION public.vp_p20_prepare(integer,integer,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p20_prepare(integer,integer,bigint) TO authenticated;
COMMIT;
