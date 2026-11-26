-- P6 — Free local OCR review register. Additive, staging first, no existing table changes.
-- Saves unverified OCR text and suggested inspection field values. NEVER alters cases,
-- inspections, valuations, documents, approval decisions or field provenance directly.
-- Requires the active ValuationPro BIGINT schema and same-tenant document access.
BEGIN;
DO $$ BEGIN
  IF to_regclass('public.documents') IS NULL OR to_regclass('public.users') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_field_my_user_id()') IS NULL THEN
    RAISE EXCEPTION 'P6 prerequisites missing; review read-only precheck and abort';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='documents' AND column_name='id'
      AND data_type<>'bigint') THEN RAISE EXCEPTION 'documents.id must be BIGINT; incompatible schema'; END IF;
  IF to_regclass('public.vp_p6_saved_ocr') IS NOT NULL
    OR to_regprocedure('public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer)') IS NOT NULL
    OR to_regprocedure('public.vp_p6_ocr_history(integer,bigint)') IS NOT NULL THEN
    RAISE EXCEPTION 'P6 objects already exist. Do not overwrite; inspect existing installation and run read-only verification.';
  END IF;
END $$;

CREATE TABLE public.vp_p6_saved_ocr (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  num integer NOT NULL,
  document_id bigint NOT NULL,
  extracted_by_user_id bigint NOT NULL,
  request_id text NOT NULL CHECK (length(request_id) BETWEEN 5 AND 100),
  language text NOT NULL CHECK (language IN ('eng','hin','tel')),
  pages jsonb NOT NULL CHECK (jsonb_typeof(pages)='array' AND jsonb_array_length(pages) BETWEEN 1 AND 5),
  candidates jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(candidates)='array' AND jsonb_array_length(candidates)<=50),
  pdf_page_count integer CHECK (pdf_page_count BETWEEN 1 AND 10000),
  processing_method text NOT NULL DEFAULT 'local' CHECK (processing_method='local'),
  status text NOT NULL DEFAULT 'UNVERIFIED' CHECK (status='UNVERIFIED'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vp_p6_ocr_unique_request UNIQUE (org_id,extracted_by_user_id,request_id),
  -- Existing documents/users tables have no guaranteed composite UNIQUE(org_id,id).
  -- Tenant/document/user membership is enforced inside the SECURITY DEFINER RPCs.
  CHECK (num > 0)
);
CREATE INDEX vp_p6_ocr_lookup_idx ON public.vp_p6_saved_ocr
  (org_id,num,document_id,created_at DESC);
ALTER TABLE public.vp_p6_saved_ocr ENABLE ROW LEVEL SECURITY;
-- No direct client reads or writes; the SECURITY DEFINER RPCs below enforce tenant +
-- active-user + registered-document scope. SQL Editor/service_role can inspect as owner.
REVOKE ALL ON public.vp_p6_saved_ocr FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.vp_p6_save_ocr(
 p_document_id bigint, p_case_num integer, p_request_id text, p_language text,
 p_pages jsonb, p_candidates jsonb, p_pdf_page_count integer DEFAULT NULL
) RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
  v_org bigint:=public.vp_current_org_id();
  v_user bigint:=public.vp_field_my_user_id();
  v_id bigint; v_count integer;
BEGIN
  IF auth.uid() IS NULL OR v_org IS NULL OR v_user IS NULL THEN
    RAISE EXCEPTION 'Active authenticated tenant user required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.users u
    WHERE u.org_id=v_org AND u.id=v_user AND u.active=true) THEN
    RAISE EXCEPTION 'Inactive or unlinked user'; END IF;
  IF p_case_num IS NULL OR p_case_num<1 OR p_document_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.documents d WHERE d.id=p_document_id
    AND d.org_id=v_org AND d.num=p_case_num AND d.storage_path IS NOT NULL
    AND d.mime IN ('application/pdf','image/jpeg','image/png')
  ) THEN RAISE EXCEPTION 'Document not accessible in current organization/case'; END IF;
  IF p_request_id IS NULL OR length(p_request_id) NOT BETWEEN 5 AND 100
    OR p_language NOT IN ('eng','hin','tel')
    OR p_pages IS NULL OR jsonb_typeof(p_pages)<>'array'
    OR p_candidates IS NULL OR jsonb_typeof(p_candidates)<>'array'
    OR p_pdf_page_count IS NOT NULL AND p_pdf_page_count NOT BETWEEN 1 AND 10000 THEN
    RAISE EXCEPTION 'Invalid OCR metadata'; END IF;
  IF jsonb_array_length(p_pages) NOT BETWEEN 1 AND 5
    OR jsonb_array_length(p_candidates)>50
    OR pg_catalog.octet_length(p_pages::text)>640000
    OR pg_catalog.octet_length(p_candidates::text)>80000 THEN
    RAISE EXCEPTION 'OCR payload exceeds per-batch limits (5 pages, 640 KB OCR, 80 KB candidates)'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_pages) AS p(value)
    WHERE jsonb_typeof(p.value)<>'object'
      OR jsonb_typeof(p.value->'page')<>'number'
      OR jsonb_typeof(p.value->'text')<>'string'
      OR length(p.value->>'text')>30000
      OR (p.value->>'page') !~ '^[0-9]{1,5}$'
      OR (p.value->>'page')::integer NOT BETWEEN 1 AND 10000) THEN
    RAISE EXCEPTION 'Malformed OCR page'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_candidates) AS c(value)
    WHERE jsonb_typeof(c.value)<>'object'
      OR coalesce(length(c.value->>'field'),0)>100
      OR coalesce(length(c.value->>'source_line'),0)>320
      OR coalesce(length(c.value->>'value'),0)>260) THEN
    RAISE EXCEPTION 'Malformed OCR candidate'; END IF;
  -- Each saved batch is immutable. Identical request IDs are idempotent for this user,
  -- but cannot be reused against another document or case.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_org::text||':'||v_user::text)::bigint);
  SELECT id INTO v_id FROM public.vp_p6_saved_ocr
    WHERE org_id=v_org AND extracted_by_user_id=v_user AND request_id=p_request_id;
  IF FOUND THEN
    IF NOT EXISTS(SELECT 1 FROM public.vp_p6_saved_ocr
      WHERE id=v_id AND document_id=p_document_id AND num=p_case_num) THEN
      RAISE EXCEPTION 'OCR request ID reused for another document'; END IF;
    RETURN v_id;
  END IF;
  SELECT count(*) INTO v_count FROM public.vp_p6_saved_ocr
   WHERE org_id=v_org AND extracted_by_user_id=v_user
     AND created_at > now()-interval '24 hours';
  IF v_count>=100 THEN RAISE EXCEPTION 'OCR saved-batch limit reached (100 / 24 hours)'; END IF;
  INSERT INTO public.vp_p6_saved_ocr
    (org_id,num,document_id,extracted_by_user_id,request_id,language,pages,candidates,pdf_page_count)
  VALUES(v_org,p_case_num,p_document_id,v_user,p_request_id,p_language,p_pages,p_candidates,p_pdf_page_count)
  RETURNING id INTO v_id;
  RETURN v_id;
END $$;

CREATE FUNCTION public.vp_p6_ocr_history(
 p_case_num integer, p_document_id bigint
) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE v_org bigint:=public.vp_current_org_id(); v_user bigint:=public.vp_field_my_user_id();
  v_output jsonb;
BEGIN
  IF auth.uid() IS NULL OR v_org IS NULL OR v_user IS NULL
    OR NOT EXISTS(SELECT 1 FROM public.users u
      WHERE u.org_id=v_org AND u.id=v_user AND u.active=true) THEN
    RAISE EXCEPTION 'Active authenticated tenant user required'; END IF;
  IF p_document_id IS NULL OR p_case_num IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id=p_document_id AND d.org_id=v_org AND d.num=p_case_num
      AND d.storage_path IS NOT NULL
  ) THEN RAISE EXCEPTION 'Document not accessible in current organization/case'; END IF;
  SELECT coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) INTO v_output
  FROM (
    SELECT id::text AS id, document_id::text AS document_id, num AS case_num,
      language, pages, candidates, pdf_page_count, status, created_at
    FROM public.vp_p6_saved_ocr
    WHERE org_id=v_org AND num=p_case_num AND document_id=p_document_id
    ORDER BY created_at DESC,id DESC LIMIT 10
  ) r;
  RETURN v_output;
END $$;

REVOKE ALL ON FUNCTION public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.vp_p6_ocr_history(integer,bigint) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.vp_p6_save_ocr(bigint,integer,text,text,jsonb,jsonb,integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p6_ocr_history(integer,bigint) TO authenticated;
COMMIT;
NOTIFY pgrst, 'reload schema';
