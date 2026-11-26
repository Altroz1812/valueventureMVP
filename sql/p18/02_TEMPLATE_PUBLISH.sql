BEGIN;
CREATE FUNCTION public.vp_p18_publish_template(p_category text,p_fields jsonb,p_reason text)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $p18$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); f jsonb; k text; t text; opt jsonb; seen text[]:=ARRAY[]::text[]; result bigint;
BEGIN
 IF o IS NULL OR u IS NULL OR public.vp_is_admin(o) IS DISTINCT FROM true THEN RAISE EXCEPTION 'Tenant administrator required'; END IF;
 IF p_category IS NULL OR p_category NOT IN ('Land','House','Flat','Commercial') THEN RAISE EXCEPTION 'Unsupported case category'; END IF;
 IF p_fields IS NULL OR jsonb_typeof(p_fields)<>'array' THEN RAISE EXCEPTION 'Fields must be an array'; END IF;
 IF jsonb_array_length(p_fields) NOT BETWEEN 1 AND 30 OR octet_length(p_fields::text)>24000 THEN RAISE EXCEPTION 'Template size exceeds limits'; END IF;
 IF length(btrim(coalesce(p_reason,''))) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Publication reason required'; END IF;
 FOR f IN SELECT value FROM jsonb_array_elements(p_fields) LOOP
  IF jsonb_typeof(f)<>'object' OR (f-ARRAY['key','label','type','unit','options'])<>'{}'::jsonb THEN RAISE EXCEPTION 'Invalid field definition'; END IF;
  k:=f->>'key';t:=f->>'type';
  IF jsonb_typeof(f->'key') IS DISTINCT FROM 'string' OR k !~ '^[a-z][a-z0-9_]{0,39}$' OR k IN ('constructor','prototype') OR k=ANY(seen) THEN RAISE EXCEPTION 'Invalid or duplicate key'; END IF;
  seen:=array_append(seen,k);
  IF jsonb_typeof(f->'label') IS DISTINCT FROM 'string' OR length(btrim(f->>'label'))=0 OR length(f->>'label')>120 THEN RAISE EXCEPTION 'Invalid label'; END IF;
  IF t IS NULL OR t NOT IN ('text','number','choice') THEN RAISE EXCEPTION 'Invalid type'; END IF;
  IF f?'unit' AND (jsonb_typeof(f->'unit') IS DISTINCT FROM 'string' OR length(btrim(f->>'unit'))=0 OR length(f->>'unit')>40) THEN RAISE EXCEPTION 'Invalid unit'; END IF;
  IF t='choice' THEN
   IF jsonb_typeof(f->'options') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Choice options required'; END IF;
   IF jsonb_array_length(f->'options') NOT BETWEEN 2 AND 20 THEN RAISE EXCEPTION 'Choice count invalid'; END IF;
   FOR opt IN SELECT value FROM jsonb_array_elements(f->'options') LOOP
    IF jsonb_typeof(opt)<>'string' OR length(btrim(opt#>>'{}'))=0 OR length(opt#>>'{}')>100 THEN RAISE EXCEPTION 'Invalid option'; END IF;
   END LOOP;
   IF (SELECT count(DISTINCT value) FROM jsonb_array_elements(f->'options'))<>jsonb_array_length(f->'options') THEN RAISE EXCEPTION 'Duplicate option'; END IF;
  ELSIF f?'options' THEN RAISE EXCEPTION 'Options permitted only on choice fields'; END IF;
 END LOOP;
 INSERT INTO public.vp_p18_templates(org_id,category,fields,reason,published_by) VALUES(o,p_category,p_fields,btrim(p_reason),u) RETURNING id INTO result;
 RETURN result;
END;
$p18$;
REVOKE ALL ON FUNCTION public.vp_p18_publish_template(text,jsonb,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p18_publish_template(text,jsonb,text) TO authenticated;
COMMIT;
