-- P16 step 01C: run after 01B succeeds.
BEGIN;
CREATE FUNCTION public.vp_p16_save_property(p_property_id bigint,p_expected_revision integer,p_data jsonb,p_reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); pid bigint; rev integer;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can(CASE WHEN p_property_id IS NULL THEN 'cases.Create' ELSE 'cases.Edit' END),false) THEN RAISE EXCEPTION 'Property permission denied' USING ERRCODE='42501'; END IF;
 IF p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Record a reason'; END IF;
 PERFORM public.vp_p16_validate(p_data);
 IF p_property_id IS NULL THEN
  IF p_expected_revision IS DISTINCT FROM 0 THEN RAISE EXCEPTION 'Invalid new revision'; END IF;
  rev:=1; INSERT INTO public.vp_property_master(org_id,current_revision,data) VALUES(o,rev,p_data) RETURNING id INTO pid;
 ELSE
  SELECT id,current_revision INTO pid,rev FROM public.vp_property_master WHERE org_id=o AND id=p_property_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Property not found' USING ERRCODE='42501'; END IF;
  IF p_expected_revision IS DISTINCT FROM rev THEN RAISE EXCEPTION 'Property changed; reload before editing' USING ERRCODE='40001'; END IF;
  rev:=rev+1; UPDATE public.vp_property_master SET current_revision=rev,data=p_data,updated_at=now() WHERE org_id=o AND id=pid;
 END IF;
 INSERT INTO public.vp_property_revisions(org_id,property_id,revision,data,reason,recorded_by) VALUES(o,pid,rev,p_data,trim(p_reason),u);
 RETURN pid::text;
END $$;
CREATE FUNCTION public.vp_p16_link_case(p_case_num integer,p_property_id bigint,p_property_revision integer,p_expected_link_version integer,p_reason text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE o bigint:=public.vp_current_org_id(); u bigint:=public.vp_field_my_user_id(); rev integer; prev integer;
BEGIN
 IF o IS NULL OR u IS NULL OR NOT coalesce(public.vp_sec_can('cases.View'),false) OR NOT coalesce(public.vp_sec_can('cases.Edit'),false) OR NOT coalesce(public.vp_sec_case_visible(p_case_num),false) THEN RAISE EXCEPTION 'Case link permission denied' USING ERRCODE='42501'; END IF;
 IF p_reason IS NULL OR length(trim(p_reason)) NOT BETWEEN 1 AND 1000 THEN RAISE EXCEPTION 'Record association reason'; END IF;
 PERFORM 1 FROM public.cases WHERE org_id=o AND num=p_case_num FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Case not found' USING ERRCODE='42501'; END IF;
 SELECT current_revision INTO rev FROM public.vp_property_master WHERE org_id=o AND id=p_property_id FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Property not found' USING ERRCODE='42501'; END IF;
 IF p_property_revision IS DISTINCT FROM rev THEN RAISE EXCEPTION 'Property revised; reload before linking' USING ERRCODE='40001'; END IF;
 SELECT coalesce(max(link_version),0) INTO prev FROM public.vp_property_case_links WHERE org_id=o AND num=p_case_num;
 IF p_expected_link_version IS DISTINCT FROM prev THEN RAISE EXCEPTION 'Case association changed; reload' USING ERRCODE='40001'; END IF;
 INSERT INTO public.vp_property_case_links(org_id,num,link_version,property_id,property_revision,reason,linked_by) VALUES(o,p_case_num,prev+1,p_property_id,rev,trim(p_reason),u);
 RETURN prev+1;
END $$;
REVOKE ALL ON FUNCTION public.vp_p16_validate(jsonb),public.vp_p16_save_property(bigint,integer,jsonb,text),public.vp_p16_link_case(integer,bigint,integer,integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p16_save_property(bigint,integer,jsonb,text),public.vp_p16_link_case(integer,bigint,integer,integer,text) TO authenticated;
COMMIT;
