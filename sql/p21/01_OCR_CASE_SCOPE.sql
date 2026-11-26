-- Tighten the original P6 RPCs without replacing unrelated logic or privileges.
BEGIN;
DO $p21$
DECLARE sig text; f oid; def text; marker text := E'BEGIN\n  IF auth.uid()'; guard text := E'BEGIN\n  IF p_case_num IS NULL OR NOT coalesce(public.vp_sec_case_visible(p_case_num),false) THEN RAISE EXCEPTION ''OCR case access denied'' USING ERRCODE=''42501''; END IF;\n  IF auth.uid()';
BEGIN
 IF to_regprocedure('public.vp_sec_case_visible(bigint)') IS NULL THEN RAISE EXCEPTION 'P10 case visibility required'; END IF;
 FOREACH sig IN ARRAY ARRAY['public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)','public.vp_p6_ocr_history(integer,bigint)'] LOOP
  f:=to_regprocedure(sig);
  IF f IS NULL THEN RAISE EXCEPTION 'Missing OCR RPC: %',sig; END IF;
  def:=replace(pg_get_functiondef(f),E'\r\n',E'\n');
  IF position('OCR case access denied' IN def)>0 AND position('vp_sec_case_visible(p_case_num' IN def)>0 THEN CONTINUE; END IF;
  IF position('vp_sec_case_visible' IN def)>0 OR (length(def)-length(replace(def,marker,'')))<>length(marker) OR position('public.vp_p6_saved_ocr' IN def)=0 OR position('SECURITY DEFINER' IN def)=0 THEN
   RAISE EXCEPTION 'Unexpected OCR function definition; inspect before changing: %',sig;
  END IF;
  EXECUTE replace(def,marker,guard);
 END LOOP;
END $p21$;
COMMIT;
