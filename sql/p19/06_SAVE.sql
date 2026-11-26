BEGIN;
CREATE FUNCTION public.vp_p19_save(p_num integer,p_link integer,p_date date,p_method text,p_input jsonb,p_expected integer) RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); c public.cases%ROWTYPE;
l public.vp_property_case_links%ROWTYPE; prop jsonb; ev jsonb; calc jsonb; cat text; v integer; r numeric; d numeric; m numeric; g numeric;
BEGIN
IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_report_can('Edit'),false) OR NOT coalesce(public.vp_sec_case_visible(p_num),false) THEN RAISE EXCEPTION 'Analysis permission denied' USING ERRCODE='42501'; END IF;
IF p_date IS NULL OR p_date>CURRENT_DATE OR jsonb_typeof(p_input) IS DISTINCT FROM 'object' OR octet_length(p_input::text)>100000 THEN RAISE EXCEPTION 'Invalid payload/date'; END IF;
PERFORM public.vp_p19_text(p_input,'reason');PERFORM public.vp_p19_text(p_input,'disposal_source');
SELECT * INTO c FROM public.cases WHERE org_id=o AND num=p_num FOR UPDATE;
IF NOT FOUND OR c.meta->>'ui_stage' IS DISTINCT FROM 'Report Draft' OR c.stage IN ('Approved','Submitted','Invoiced') OR EXISTS(SELECT 1 FROM public.vp_qc_tasks WHERE org_id=o AND num=p_num AND status='Pending') THEN RAISE EXCEPTION 'Analysis locked outside Report Draft or pending QC'; END IF;
SELECT * INTO l FROM public.vp_property_case_links WHERE org_id=o AND num=p_num ORDER BY link_version DESC LIMIT 1;
IF NOT FOUND OR l.link_version IS DISTINCT FROM p_link THEN RAISE EXCEPTION 'Reload current property link' USING ERRCODE='40001'; END IF;
SELECT data INTO prop FROM public.vp_property_revisions WHERE org_id=o AND property_id=l.property_id AND revision=l.property_revision;
cat:=prop->>'category';IF cat IS NULL OR cat IS DISTINCT FROM c.prod OR cat NOT IN ('Land','House','Flat','Commercial') THEN RAISE EXCEPTION 'Property category mismatch'; END IF;
SELECT coalesce(max(version_no),0) INTO v FROM public.vp_p19_analyses WHERE org_id=o AND num=p_num;
IF v IS DISTINCT FROM p_expected THEN RAISE EXCEPTION 'Analysis changed; reload' USING ERRCODE='40001'; END IF;
SELECT coalesce(jsonb_agg(jsonb_build_object('evidence_id',evidence_id::text,'snapshot',snapshot,'reason',reason) ORDER BY evidence_id),'[]'::jsonb) INTO ev
FROM public.vp_case_market_evidence WHERE org_id=o AND num=p_num AND link_version=p_link AND effective_date=p_date
AND p_method='comparison' AND EXISTS(SELECT 1 FROM jsonb_array_elements(CASE WHEN jsonb_typeof(p_input->'comparables')='array' THEN p_input->'comparables' ELSE '[]'::jsonb END) j WHERE j->>'evidence_id'=evidence_id::text);
CASE p_method WHEN 'cost' THEN calc:=public.vp_p19_cost(p_input,cat); WHEN 'comparison' THEN calc:=public.vp_p19_comparison(p_input,ev,cat); WHEN 'income' THEN calc:=public.vp_p19_income(p_input,cat); ELSE RAISE EXCEPTION 'Unsupported valuation method'; END CASE;
m:=(calc->>'marketValue')::numeric; IF m<=0 OR m>1e15 THEN RAISE EXCEPTION 'Value outside supported range'; END IF;
r:=public.vp_p19_number(p_input,'realizable_pct',0.01,100); d:=public.vp_p19_number(p_input,'distress_pct',0.01,r);
g:=NULL;IF jsonb_typeof(p_input->'guideline_amount') IS DISTINCT FROM 'null' THEN g:=public.vp_p19_number(p_input,'guideline_amount',0.01,1e15);PERFORM public.vp_p19_text(p_input,'guideline_source');END IF;
calc:=calc||jsonb_build_object('realizableValue',round(m*r/100,2),'distressValue',round(m*d/100,2),'guidelineValue',g);
INSERT INTO public.vp_p19_analyses(org_id,num,version_no,link_version,effective_date,method,formula_version,inputs,results,property_snapshot,evidence_snapshots,inspection_snapshot,created_by)
VALUES(o,p_num,v+1,p_link,p_date,p_method,'p19-v1',p_input,calc,prop,ev,public.vp_p2_valuer_inspection_for_case(p_num),u);
RETURN v+1;
END $$;
REVOKE ALL ON FUNCTION public.vp_p19_save(integer,integer,date,text,jsonb,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p19_save(integer,integer,date,text,jsonb,integer) TO authenticated;
COMMIT;
