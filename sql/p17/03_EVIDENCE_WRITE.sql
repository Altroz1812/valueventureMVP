BEGIN;
CREATE FUNCTION public.vp_p17_add_evidence(p_data jsonb) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); eid bigint;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can('cases.Create'),false) THEN RAISE EXCEPTION 'Evidence creation denied' USING ERRCODE='42501'; END IF;
 IF p_data IS NULL OR jsonb_typeof(p_data)<>'object' OR octet_length(p_data::text)>20000 THEN RAISE EXCEPTION 'Invalid evidence'; END IF;
 IF (p_data->>'property_id') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.vp_property_revisions r WHERE r.org_id=o AND r.property_id=(p_data->>'property_id')::bigint AND r.revision=(p_data->>'property_revision')::integer AND r.data->>'category'=p_data->>'category') THEN RAISE EXCEPTION 'Linked property revision/category invalid' USING ERRCODE='22023'; END IF;
 INSERT INTO public.vp_market_evidence(org_id,created_by,property_id,property_revision,category,kind,label,address,observed_on,source_ref,amount,area,area_unit,area_basis,road_access,notes,latitude,longitude)
 VALUES(o,u,(p_data->>'property_id')::bigint,(p_data->>'property_revision')::integer,p_data->>'category',p_data->>'kind',p_data->>'label',p_data->>'address',(p_data->>'observed_on')::date,p_data->>'source_ref',(p_data->>'amount')::numeric,(p_data->>'area')::numeric,p_data->>'area_unit',p_data->>'area_basis',coalesce(p_data->>'road_access',''),coalesce(p_data->>'notes',''),(p_data->>'latitude')::double precision,(p_data->>'longitude')::double precision) RETURNING id INTO eid;
 RETURN eid::text;
END $$;
CREATE FUNCTION public.vp_p17_review_evidence(p_id bigint,p_status text,p_reason text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id();
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can('cases.Edit'),false) THEN RAISE EXCEPTION 'Evidence review denied' USING ERRCODE='42501'; END IF;
 IF p_status IS NULL OR p_status NOT IN ('verified','rejected') OR p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Review decision and reason required'; END IF;
 UPDATE public.vp_market_evidence SET status=p_status,reviewed_by=u,reviewed_at=now(),review_reason=trim(p_reason) WHERE org_id=o AND id=p_id AND created_by<>u AND status='unverified';
 IF NOT FOUND THEN RAISE EXCEPTION 'Evidence missing, already reviewed, or self-review not permitted' USING ERRCODE='42501'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.vp_p17_add_evidence(jsonb),public.vp_p17_review_evidence(bigint,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p17_add_evidence(jsonb),public.vp_p17_review_evidence(bigint,text,text) TO authenticated;
COMMIT;
