-- MIT Open-Comps nearby_sales: adapted RETURN QUERY and spatial predicates.
BEGIN;
SET LOCAL search_path=pg_catalog,extensions,public;
CREATE FUNCTION public.vp_p17_nearby_sales(p_property_id bigint,p_revision integer,p_radius_m integer DEFAULT 5000,p_max_age_months integer DEFAULT 36,p_as_of date DEFAULT CURRENT_DATE,p_verified_only boolean DEFAULT true,p_area_basis text DEFAULT 'land',p_kind text DEFAULT 'registered_sale')
RETURNS TABLE(evidence_id text,property_id text,label text,category text,kind text,observed_on date,amount numeric,area numeric,area_unit text,area_basis text,rate_per_sqyd numeric,rate_per_sqft numeric,status text,source_ref text,address text,dist_meters double precision)
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path=pg_catalog,extensions,public AS $$
DECLARE anchor geography; subject_category text;
BEGIN
 IF NOT coalesce(public.vp_sec_can('cases.View'),false) OR public.vp_current_org_id() IS NULL THEN RAISE EXCEPTION 'Comparable access denied' USING ERRCODE='42501'; END IF;
 IF p_radius_m IS NULL OR p_radius_m NOT BETWEEN 1 AND 50000 OR p_max_age_months IS NULL OR p_max_age_months NOT BETWEEN 1 AND 120 OR p_as_of IS NULL OR p_as_of>CURRENT_DATE OR p_verified_only IS NULL OR p_area_basis IS NULL OR p_area_basis NOT IN ('land','builtup','carpet','superbuiltup') OR p_kind IS NULL OR p_kind NOT IN ('registered_sale','broker_enquiry','asking_price','guideline','land_rate','previous_valuation') THEN RAISE EXCEPTION 'Invalid search filters' USING ERRCODE='22023'; END IF;
 SELECT ST_SetSRID(ST_MakePoint((r.data->>'longitude')::double precision,(r.data->>'latitude')::double precision),4326)::geography,r.data->>'category' INTO anchor,subject_category FROM public.vp_property_revisions r WHERE r.org_id=public.vp_current_org_id() AND r.property_id=p_property_id AND r.revision=p_revision;
 IF NOT FOUND OR anchor IS NULL THEN RAISE EXCEPTION 'Subject property revision unavailable or has no GPS coordinates' USING ERRCODE='22023'; END IF;
 RETURN QUERY
 SELECT ps.id::text,ps.property_id::text,ps.label,ps.category,ps.kind,ps.observed_on,ps.amount,ps.area,ps.area_unit,ps.area_basis,
 ps.amount/public.vp_p17_convert_measure(ps.area,ps.area_unit,'sqyd'),ps.amount/public.vp_p17_convert_measure(ps.area,ps.area_unit,'sqft'),ps.status,ps.source_ref,ps.address,ST_Distance(ps.location,anchor)
 FROM public.vp_market_evidence ps
 WHERE ps.org_id=public.vp_current_org_id() AND ps.location IS NOT NULL
 AND ST_DWithin(ps.location,anchor,p_radius_m)
 AND ps.property_id IS DISTINCT FROM p_property_id AND ps.category=subject_category AND ps.kind=p_kind AND ps.area_basis=p_area_basis
 AND ps.observed_on<=p_as_of AND ps.observed_on>=p_as_of-make_interval(months=>p_max_age_months)
 AND ps.status<>'rejected' AND (NOT p_verified_only OR ps.status='verified')
 ORDER BY ps.location <-> anchor,ps.observed_on DESC,ps.id DESC LIMIT 100;
END $$;
REVOKE ALL ON FUNCTION public.vp_p17_nearby_sales(bigint,integer,integer,integer,date,boolean,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p17_nearby_sales(bigint,integer,integer,integer,date,boolean,text,text) TO authenticated;
COMMIT;
