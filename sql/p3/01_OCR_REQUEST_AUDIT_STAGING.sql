-- Staging first; additive P3 OCR audit and per-user quota. No existing tables are dropped.
-- Source documents remain in the private vp-case-docs bucket.
BEGIN;
DO $$ BEGIN
  IF to_regclass('public.documents') IS NULL
    OR to_regprocedure('public.vp_current_org_id()') IS NULL
    OR to_regprocedure('public.vp_field_my_user_id()') IS NULL THEN
    RAISE EXCEPTION 'ValuationPro base schema and user-context RPCs required';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.vp_p3_ocr_runs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id bigint NOT NULL,
  user_id bigint NOT NULL,
  document_id bigint NOT NULL,
  case_num integer NOT NULL,
  provider text NOT NULL DEFAULT 'google-vision' CHECK(provider = 'google-vision'),
  status text NOT NULL DEFAULT 'claimed' CHECK(status IN ('claimed','success','error')),
  page_count integer NOT NULL DEFAULT 0 CHECK(page_count BETWEEN 0 AND 5),
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);
CREATE INDEX IF NOT EXISTS vp_p3_ocr_org_user_time ON public.vp_p3_ocr_runs (org_id,user_id,created_at DESC);
ALTER TABLE public.vp_p3_ocr_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vp_p3_ocr_runs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.vp_p3_ocr_runs TO authenticated;
DROP POLICY IF EXISTS vp_p3_ocr_own_requests ON public.vp_p3_ocr_runs;
CREATE POLICY vp_p3_ocr_own_requests ON public.vp_p3_ocr_runs
  FOR SELECT TO authenticated USING (
    org_id = public.vp_current_org_id()
    AND user_id = public.vp_field_my_user_id()
  );

CREATE OR REPLACE FUNCTION public.vp_p3_ocr_claim(p_document_id bigint, p_case_num integer)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_org bigint := public.vp_current_org_id();
  v_user bigint := public.vp_field_my_user_id();
  v_id bigint;
BEGIN
  IF auth.uid() IS NULL OR v_org IS NULL OR v_user IS NULL THEN
    RAISE EXCEPTION 'Active authenticated organization user required';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.org_id=v_org AND u.id=v_user AND u.active=true
  ) THEN RAISE EXCEPTION 'Inactive or unlinked user'; END IF;
  IF p_document_id IS NULL OR p_case_num IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id=p_document_id AND d.org_id=v_org AND d.num=p_case_num
      AND d.storage_path IS NOT NULL AND d.mime IN ('application/pdf','image/jpeg','image/png')
  ) THEN RAISE EXCEPTION 'Document is unavailable in this organization/case'; END IF;
  -- Serialize requests by user so concurrent claims cannot evade quota.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_org::text||':'||v_user::text)::bigint);
  IF (SELECT count(*) FROM public.vp_p3_ocr_runs r
      WHERE r.org_id=v_org AND r.user_id=v_user
        AND r.created_at >= now()-interval '24 hours') >= 20 THEN
    RAISE EXCEPTION 'OCR daily per-user limit reached (20 requests / 24h)';
  END IF;
  INSERT INTO public.vp_p3_ocr_runs(org_id,user_id,document_id,case_num)
    VALUES(v_org,v_user,p_document_id,p_case_num) RETURNING id INTO v_id;
  RETURN v_id;
END $$;

CREATE OR REPLACE FUNCTION public.vp_p3_ocr_complete(
  p_request_id bigint, p_status text, p_page_count integer, p_error_code text DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_org bigint := public.vp_current_org_id(); v_user bigint := public.vp_field_my_user_id();
BEGIN
  IF auth.uid() IS NULL OR v_org IS NULL OR v_user IS NULL THEN
    RAISE EXCEPTION 'Active user required'; END IF;
  IF p_status NOT IN ('success','error') OR p_page_count IS NULL
    OR p_page_count < 0 OR p_page_count > 5 THEN RAISE EXCEPTION 'Invalid status or page count'; END IF;
  UPDATE public.vp_p3_ocr_runs r SET status=p_status, page_count=p_page_count,
    error_code=left(coalesce(p_error_code,''),80),finished_at=now()
    WHERE r.id=p_request_id AND r.org_id=v_org AND r.user_id=v_user AND r.status='claimed';
  IF NOT FOUND THEN RAISE EXCEPTION 'OCR request is not owned by current user or already completed'; END IF;
  RETURN true;
END $$;

REVOKE ALL ON FUNCTION public.vp_p3_ocr_claim(bigint,integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.vp_p3_ocr_complete(bigint,text,integer,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vp_p3_ocr_claim(bigint,integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vp_p3_ocr_complete(bigint,text,integer,text) TO authenticated;
COMMIT;
NOTIFY pgrst, 'reload schema';
