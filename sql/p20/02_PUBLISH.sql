BEGIN;
CREATE FUNCTION public.vp_p20_publish(p_bank text,p_category text,p_title text,p_workbook text,p_mapping jsonb,p_reason text) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $p20$
DECLARE o bigint:=public.vp_current_org_id();u bigint:=public.vp_field_my_user_id(); f jsonb; k text; s text; a text; keys text[]:=ARRAY[]::text[]; targets text[]:=ARRAY[]::text[]; result bigint; raw bytea; col integer; ch text;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_report_can('Manage Formats'),false) THEN RAISE EXCEPTION 'Manage Formats permission required' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.banks WHERE org_id=o AND name=p_bank) THEN RAISE EXCEPTION 'Unknown bank'; END IF;
 IF p_category IS NULL OR p_category NOT IN ('Land','House','Flat','Commercial') THEN RAISE EXCEPTION 'Invalid category'; END IF;
 IF length(btrim(coalesce(p_title,''))) NOT BETWEEN 1 AND 160 OR length(btrim(coalesce(p_reason,''))) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Title and publication reason required'; END IF;
 IF p_workbook IS NULL OR length(p_workbook)>1398104 OR p_workbook !~ '^[A-Za-z0-9+/]+={0,2}$' THEN RAISE EXCEPTION 'Invalid workbook encoding or size'; END IF;
 raw:=decode(p_workbook,'base64');IF octet_length(raw)>1048576 OR substring(raw from 1 for 4)<>decode('504b0304','hex') THEN RAISE EXCEPTION 'Expected unencrypted XLSX, max 1 MiB'; END IF;
 IF jsonb_typeof(p_mapping) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Mapping array required'; END IF;
 IF jsonb_array_length(p_mapping) NOT BETWEEN 5 AND 80 OR octet_length(p_mapping::text)>16000 THEN RAISE EXCEPTION 'Invalid mapping size'; END IF;
 FOR f IN SELECT value FROM jsonb_array_elements(p_mapping) LOOP
  IF jsonb_typeof(f) IS DISTINCT FROM 'object' OR f-ARRAY['field','sheet','cell']<>'{}'::jsonb THEN RAISE EXCEPTION 'Invalid mapping'; END IF;
  k:=f->>'field';s:=f->>'sheet';a:=f->>'cell';
  IF k IS NULL OR k NOT IN ('status','case_num','bank','customer','category','address','property_label','effective_date','method','analysis_version','formula_version','marketValue','guidelineValue','realizableValue','distressValue','landValue','buildingValue','replacementCost','depreciation','amenities','adoptedRate','basis','netOperatingIncome','capRatePct','annualGrossRent','annualExpenses','reason','review_reason') THEN RAISE EXCEPTION 'Unsupported mapping field: %',k; END IF;
  IF s IS NULL OR length(btrim(s)) NOT BETWEEN 1 AND 31 OR lower(s)='_vp20_audit' OR a IS NULL OR a !~ '^[A-Z]{1,3}[1-9][0-9]{0,6}$' THEN RAISE EXCEPTION 'Invalid sheet or cell'; END IF;
  IF jsonb_typeof(f->'field') IS DISTINCT FROM 'string' OR jsonb_typeof(f->'sheet') IS DISTINCT FROM 'string' OR jsonb_typeof(f->'cell') IS DISTINCT FROM 'string' OR btrim(s)<>s THEN RAISE EXCEPTION 'Mapping values must be strings'; END IF;
  col:=0; FOREACH ch IN ARRAY regexp_split_to_array(regexp_replace(a,'[0-9]+$',''),'') LOOP col:=col*26+ascii(ch)-64; END LOOP;
  IF col>16384 OR regexp_replace(a,'^[A-Z]+','')::integer>1048576 THEN RAISE EXCEPTION 'Cell outside Excel limits'; END IF;
  IF (lower(s)||':'||a)=ANY(targets) THEN RAISE EXCEPTION 'Duplicate cell target'; END IF;
  keys:=array_append(keys,k); targets:=array_append(targets,lower(s)||':'||a);
 END LOOP;
 IF NOT (ARRAY['status','case_num','method','analysis_version','marketValue'] <@ keys) THEN RAISE EXCEPTION 'Required mappings: status, case_num, method, analysis_version, marketValue'; END IF;
 INSERT INTO public.vp_p20_templates(org_id,bank_name,category,title,workbook_base64,mapping,reason,published_by)
 VALUES(o,p_bank,p_category,btrim(p_title),p_workbook,p_mapping,btrim(p_reason),u) RETURNING id INTO result;
 RETURN result::text;
END $p20$;
REVOKE ALL ON FUNCTION public.vp_p20_publish(text,text,text,text,jsonb,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p20_publish(text,text,text,text,jsonb,text) TO authenticated;
COMMIT;
