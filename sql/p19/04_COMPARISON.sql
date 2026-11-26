BEGIN;
-- Evidence comes from immutable P17 case selections, never the caller's quoted prices.
CREATE FUNCTION public.vp_p19_comparison(p jsonb,ev jsonb,cat text) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE x jsonb; e jsonb; s jsonb; eid text; seen text[]:='{}'; basis text:=p->>'basis'; target numeric; rate numeric; adj numeric; total numeric:=0; n integer:=0; detail jsonb:='[]';
BEGIN
 IF basis IS NULL OR basis NOT IN ('land','builtup','carpet','superbuiltup') OR (cat='Land' AND basis<>'land') OR (cat<>'Land' AND basis='land') THEN RAISE EXCEPTION 'Invalid comparable area basis'; END IF;
 IF jsonb_typeof(p->'comparables') IS DISTINCT FROM 'array' OR jsonb_array_length(p->'comparables') NOT BETWEEN 1 AND 25 THEN RAISE EXCEPTION 'Select 1 to 25 eligible comparable records'; END IF;
 target:=public.vp_p19_number(p,'subject_area',0.000001,1e9);
 PERFORM public.vp_p19_text(p,'area_source');
 FOR x IN SELECT value FROM jsonb_array_elements(p->'comparables') LOOP
  eid:=public.vp_p19_text(x,'evidence_id');IF eid=ANY(seen) THEN RAISE EXCEPTION 'Duplicate comparable'; END IF;seen:=array_append(seen,eid);
  SELECT value INTO e FROM jsonb_array_elements(ev) WHERE value->>'evidence_id'=eid;
  IF NOT FOUND THEN RAISE EXCEPTION 'Comparable not selected for this case/date'; END IF;
  s:=e->'snapshot';
  IF s->>'kind' IS DISTINCT FROM 'registered_sale' OR s->>'status' IS DISTINCT FROM 'verified' OR s->>'category' IS DISTINCT FROM cat OR s->>'area_basis' IS DISTINCT FROM basis THEN RAISE EXCEPTION 'Only verified registered sales with matching category and basis are eligible'; END IF;
  rate:=public.vp_p19_number(s,'amount',0.01,1e15)/public.vp_p17_convert_measure(public.vp_p19_number(s,'area',0.000001,1e12),s->>'area_unit',CASE WHEN basis='land' THEN 'sqyd' ELSE 'sqft' END);
  adj:=public.vp_p19_number(x,'adjustment',-99,100);PERFORM public.vp_p19_text(x,'reason');
  total:=total+rate*(1+adj/100);n:=n+1;
  detail:=detail||jsonb_build_array(jsonb_build_object('evidence_id',eid,'baseRate',rate,'adjustmentPct',adj,'adjustedRate',rate*(1+adj/100)));
 END LOOP;
 RETURN jsonb_build_object('marketValue',round(target*total/n,2),'adoptedRate',round(total/n,4),'count',n,'basis',basis,'lines',detail);
END $$;
REVOKE ALL ON FUNCTION public.vp_p19_comparison(jsonb,jsonb,text) FROM PUBLIC,anon,authenticated;
COMMIT;
