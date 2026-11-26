-- P16 step 01B: run after 01A succeeds.
BEGIN;
-- Validate the canonical snapshot at the database boundary, not merely in React.
CREATE FUNCTION public.vp_p16_validate(p_data jsonb) RETURNS void LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE k text; item jsonb; group_name text; numeric_key text; n numeric; coord text;
BEGIN
 IF p_data IS NULL OR jsonb_typeof(p_data)<>'object' OR octet_length(p_data::text)>200000 THEN RAISE EXCEPTION 'Invalid property payload'; END IF;
 IF (p_data->>'category') IS NULL OR (p_data->>'category') NOT IN ('Land','House','Flat','Commercial','Industrial','Agricultural','Other') THEN RAISE EXCEPTION 'Invalid property category'; END IF;
 FOREACH k IN ARRAY ARRAY['label','address','state','district','mandal','village','pincode','municipality','landmark','road_access','notes','flat_no','building_name','east_deed','west_deed','north_deed','south_deed','east_actual','west_actual','north_actual','south_actual'] LOOP
  IF jsonb_typeof(p_data->k) IS DISTINCT FROM 'string' OR length(p_data->>k)>4000 THEN RAISE EXCEPTION 'Invalid field: %',k; END IF;
 END LOOP;
 IF length(trim(p_data->>'label')) NOT BETWEEN 1 AND 200 OR length(trim(p_data->>'address')) NOT BETWEEN 1 AND 2000 OR length(trim(p_data->>'state'))=0 OR length(trim(p_data->>'district'))=0 THEN RAISE EXCEPTION 'Name, address, state and district required'; END IF;
 IF (p_data->>'pincode')<>'' AND (p_data->>'pincode') !~ '^[1-9][0-9]{5}$' THEN RAISE EXCEPTION 'Invalid PIN code'; END IF;
 FOREACH coord IN ARRAY ARRAY['latitude','longitude'] LOOP
  IF jsonb_typeof(p_data->coord) IS DISTINCT FROM 'null' THEN
   IF jsonb_typeof(p_data->coord) IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Invalid coordinate'; END IF;
   n:=(p_data->>coord)::numeric;
   IF abs(n)>(CASE WHEN coord='latitude' THEN 90 ELSE 180 END) THEN RAISE EXCEPTION 'Coordinate out of range'; END IF;
  END IF;
 END LOOP;
 IF ((p_data->>'latitude') IS NULL) <> ((p_data->>'longitude') IS NULL) THEN RAISE EXCEPTION 'Enter both coordinates or neither'; END IF;
 FOREACH group_name IN ARRAY ARRAY['parcels','owners','documents'] LOOP
  IF jsonb_typeof(p_data->group_name) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Missing array: %',group_name; END IF;
  IF jsonb_array_length(p_data->group_name)>100 THEN RAISE EXCEPTION 'Too many entries: %',group_name; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(p_data->group_name) LOOP
   IF jsonb_typeof(item)<>'object' THEN RAISE EXCEPTION 'Invalid entry: %',group_name; END IF;
   IF group_name='parcels' THEN
    FOREACH k IN ARRAY ARRAY['survey_no','plot_no','deed_unit','actual_unit','notes'] LOOP
     IF jsonb_typeof(item->k) IS DISTINCT FROM 'string' OR length(item->>k)>1000 THEN RAISE EXCEPTION 'Invalid parcel field: %',k; END IF;
    END LOOP;
    IF trim(item->>'survey_no')='' AND trim(item->>'plot_no')='' THEN RAISE EXCEPTION 'Enter parcel survey or plot number'; END IF;
    FOREACH numeric_key IN ARRAY ARRAY['deed_area','actual_area'] LOOP
     IF jsonb_typeof(item->numeric_key) IS DISTINCT FROM 'null' THEN
      IF jsonb_typeof(item->numeric_key) IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Invalid parcel area'; END IF;
      n:=(item->>numeric_key)::numeric; IF n<=0 OR n>1000000000000 THEN RAISE EXCEPTION 'Parcel area must be positive'; END IF;
     END IF;
    END LOOP;
    IF (item->>'deed_unit') NOT IN ('sqyd','sqft','sqm','acre','gunta','cent','hectare') OR (item->>'actual_unit') NOT IN ('sqyd','sqft','sqm','acre','gunta','cent','hectare') THEN RAISE EXCEPTION 'Invalid area unit'; END IF;
   ELSIF group_name='owners' THEN
    FOREACH k IN ARRAY ARRAY['name','interest','from_date','to_date','evidence'] LOOP
     IF jsonb_typeof(item->k) IS DISTINCT FROM 'string' OR length(item->>k)>1000 THEN RAISE EXCEPTION 'Invalid ownership field: %',k; END IF;
    END LOOP;
    IF trim(item->>'name')='' THEN RAISE EXCEPTION 'Owner name required'; END IF;
    IF jsonb_typeof(item->'share_pct') IS DISTINCT FROM 'null' THEN
     IF jsonb_typeof(item->'share_pct') IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'Invalid ownership share'; END IF;
     n:=(item->>'share_pct')::numeric; IF n<0 OR n>100 THEN RAISE EXCEPTION 'Share outside 0–100'; END IF;
    END IF;
    FOREACH k IN ARRAY ARRAY['from_date','to_date'] LOOP
     IF item->>k<>'' THEN IF (item->>k)!~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Invalid ownership date'; END IF; PERFORM (item->>k)::date; END IF;
    END LOOP;
    IF item->>'from_date'<>'' AND item->>'to_date'<>'' AND (item->>'to_date')::date<(item->>'from_date')::date THEN RAISE EXCEPTION 'Ownership end precedes start'; END IF;
   ELSE
    FOREACH k IN ARRAY ARRAY['kind','reference','date','sro','notes'] LOOP
     IF jsonb_typeof(item->k) IS DISTINCT FROM 'string' OR length(item->>k)>1000 THEN RAISE EXCEPTION 'Invalid document field: %',k; END IF;
    END LOOP;
    IF trim(item->>'kind')='' OR trim(item->>'reference')='' THEN RAISE EXCEPTION 'Document type and reference required'; END IF;
    IF item->>'date'<>'' THEN IF (item->>'date')!~ '^\d{4}-\d{2}-\d{2}$' THEN RAISE EXCEPTION 'Invalid document date'; END IF; PERFORM (item->>'date')::date; END IF;
   END IF;
  END LOOP;
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.vp_p16_validate(jsonb) FROM PUBLIC,anon,authenticated;
COMMIT;
