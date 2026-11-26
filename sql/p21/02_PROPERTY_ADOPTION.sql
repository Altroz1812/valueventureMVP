-- A human-confirmed, single-field master correction; never updates the pinned case link.
BEGIN;
CREATE FUNCTION public.vp_p21_apply_property_text(p_num integer,p_doc bigint,p_batch bigint,p_page integer,p_property bigint,p_link integer,p_revision integer,p_field text,p_value text,p_line text,p_reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $p21$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); l public.vp_property_case_links%ROWTYPE; d jsonb; t text; eng text;
BEGIN
 IF auth.uid() IS NULL OR o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can('cases.Edit'),false) OR NOT coalesce(public.vp_sec_case_visible(p_num),false) THEN RAISE EXCEPTION 'Property correction permission denied' USING ERRCODE='42501'; END IF;
 IF p_field IS NULL OR p_field NOT IN ('address','state','district','mandal','village','pincode','municipality','landmark','road_access','building_name','flat_no','east_deed','west_deed','north_deed','south_deed') OR p_value IS NULL OR length(trim(p_value)) NOT BETWEEN 1 AND 200 OR p_line IS NULL OR length(p_line) NOT BETWEEN 1 AND 300 OR p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 250 THEN RAISE EXCEPTION 'Invalid correction fields'; END IF;
 IF p_value IS DISTINCT FROM trim(regexp_replace(p_line,'^[^:：]+[:：]','')) OR p_line !~ '^[^:：]+[:：]' THEN RAISE EXCEPTION 'Value must match the labelled source line'; END IF;
 PERFORM 1 FROM public.cases WHERE org_id=o AND num=p_num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case missing'; END IF;
 SELECT * INTO l FROM public.vp_property_case_links WHERE org_id=o AND num=p_num ORDER BY link_version DESC LIMIT 1;
 IF NOT FOUND OR l.property_id IS DISTINCT FROM p_property OR l.link_version IS DISTINCT FROM p_link THEN RAISE EXCEPTION 'Case property link changed; reload' USING ERRCODE='40001'; END IF;
 SELECT m.data INTO d FROM public.vp_property_master m WHERE m.org_id=o AND m.id=p_property AND m.current_revision=p_revision FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Property revision changed; reload' USING ERRCODE='40001'; END IF;
 SELECT j.value->>'text',j.value->>'engine' INTO t,eng FROM public.vp_p6_saved_ocr b JOIN public.documents doc ON doc.id=b.document_id AND doc.org_id=b.org_id AND doc.num=b.num CROSS JOIN LATERAL jsonb_array_elements(b.pages) j(value)
 WHERE b.org_id=o AND b.num=p_num AND b.document_id=p_doc AND b.id=p_batch AND doc.storage_path IS NOT NULL AND j.value->>'page'=p_page::text AND coalesce(j.value->>'truncated','false')='false';
 IF NOT FOUND OR t IS NULL OR NOT EXISTS(SELECT 1 FROM regexp_split_to_table(t,E'\\r?\\n') x(line) WHERE btrim(x.line,E' \t\r')=p_line) THEN RAISE EXCEPTION 'Saved OCR source line not found'; END IF;
 IF d->>p_field=p_value THEN RAISE EXCEPTION 'Value is unchanged'; END IF;
 RETURN public.vp_p16_save_property(p_property,p_revision,jsonb_set(d,ARRAY[p_field],to_jsonb(p_value),false),
  left('P21 human-reviewed OCR: case '||p_num||', document '||p_doc||', batch '||p_batch||', page '||p_page||', engine '||coalesce(eng,'unknown')||', field '||p_field||'; source: '||p_line||'; reason: '||trim(p_reason),1000));
END $p21$;
REVOKE ALL ON FUNCTION public.vp_p21_apply_property_text(integer,bigint,bigint,integer,bigint,integer,integer,text,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p21_apply_property_text(integer,bigint,bigint,integer,bigint,integer,integer,text,text,text,text) TO authenticated;
COMMIT;
