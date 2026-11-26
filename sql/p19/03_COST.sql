BEGIN;
-- INR values, area in explicit units; floor areas in square feet.
CREATE FUNCTION public.vp_p19_cost(p jsonb,cat text) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE x jsonb; a numeric; rate numeric; age numeric; life numeric; residual numeric; cost numeric;
 dep numeric; land numeric:=0; repl numeric:=0; depreciation numeric:=0; amenities numeric; detail jsonb:='[]'; key text;
BEGIN
 IF cat NOT IN ('Land','House','Commercial') THEN RAISE EXCEPTION 'Cost method unsupported for category'; END IF;
 IF jsonb_typeof(p->'parcels') IS DISTINCT FROM 'array' OR jsonb_typeof(p->'floors') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Parcels and floors must be arrays'; END IF;
 IF jsonb_array_length(p->'parcels') NOT BETWEEN 1 AND 100 OR jsonb_array_length(p->'floors')>100 THEN RAISE EXCEPTION 'Invalid parcel or floor count'; END IF;
 IF (cat='Land' AND jsonb_array_length(p->'floors')<>0) OR (cat<>'Land' AND jsonb_array_length(p->'floors')=0) THEN RAISE EXCEPTION 'Floor count incompatible with category'; END IF;
 FOR x IN SELECT value FROM jsonb_array_elements(p->'parcels') LOOP
  key:=public.vp_p19_text(x,'label'); PERFORM public.vp_p19_text(x,'source');
  IF x->>'unit' IS NULL OR x->>'unit' NOT IN ('sqyd','sqft','sqm','acre','gunta','cent','hectare') THEN RAISE EXCEPTION 'Invalid land unit'; END IF;
  a:=public.vp_p17_convert_measure(public.vp_p19_number(x,'area',0.000001,1e9),x->>'unit','sqyd');
  rate:=public.vp_p19_number(x,'rate',0.01,1e9); cost:=round(a*rate,2);land:=land+cost;
  detail:=detail||jsonb_build_array(jsonb_build_object('label',key,'kind','land','sqyd',a,'rate',rate,'value',cost));
 END LOOP;
 FOR x IN SELECT value FROM jsonb_array_elements(p->'floors') LOOP
  key:=public.vp_p19_text(x,'label');PERFORM public.vp_p19_text(x,'source');
  a:=public.vp_p19_number(x,'area',0.000001,1e9);rate:=public.vp_p19_number(x,'rate',0.01,1e9);
  age:=public.vp_p19_number(x,'age',0,500);life:=public.vp_p19_number(x,'life',0.01,500);residual:=public.vp_p19_number(x,'salvage',0,100);
  cost:=round(a*rate,2);dep:=round(cost*(100-residual)*least(age,life)/life/100,2);
  repl:=repl+cost;depreciation:=depreciation+dep;
  detail:=detail||jsonb_build_array(jsonb_build_object('label',key,'kind','floor','sqft',a,'rate',rate,'replacement',cost,'depreciation',dep,'value',cost-dep));
 END LOOP;
 amenities:=public.vp_p19_number(p,'amenities',0,1e12);
 IF amenities>0 THEN PERFORM public.vp_p19_text(p,'amenities_source'); END IF;
 RETURN jsonb_build_object('landValue',land,'replacementCost',repl,'depreciation',depreciation,'buildingValue',repl-depreciation,'amenities',amenities,'marketValue',land+repl-depreciation+amenities,'lines',detail);
END $$;
REVOKE ALL ON FUNCTION public.vp_p19_cost(jsonb,text) FROM PUBLIC,anon,authenticated;
COMMIT;
