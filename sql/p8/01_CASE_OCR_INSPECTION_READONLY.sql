-- P8 READ-ONLY: replace tenant/case values with the case actually displayed in the app.
-- Example from user's previous test: org_id=2, case_num=1. Read-only metadata only.
WITH target AS (SELECT 2::bigint AS org_id, 1::integer AS case_num)
SELECT v.id AS visit_id,v.status AS visit_status,
       i.status AS inspection_status,i.updated_at AS inspection_updated_at,
       COALESCE(i.data ? '__vp_field_sources_v1',false) AS has_accepted_source_provenance,
       (SELECT COUNT(*) FROM public.vp_p6_saved_ocr o
         WHERE o.org_id=t.org_id AND o.num=t.case_num) AS saved_ocr_batch_count,
       (SELECT COUNT(DISTINCT o.document_id) FROM public.vp_p6_saved_ocr o
         WHERE o.org_id=t.org_id AND o.num=t.case_num) AS saved_ocr_document_count
FROM target t
LEFT JOIN public.vp_site_visits v ON v.org_id=t.org_id AND v.num=t.case_num
LEFT JOIN public.vp_field_inspections i ON i.org_id=v.org_id AND i.visit_id=v.id
ORDER BY v.id;

-- Shows each registered document's OCR batches; no raw OCR contents exposed.
WITH target AS (SELECT 2::bigint AS org_id, 1::integer AS case_num)
SELECT d.id AS document_id,d.name AS document_name,COUNT(o.id) AS saved_ocr_batches,
       MAX(o.created_at) AS latest_ocr_save
FROM target t
JOIN public.documents d ON d.org_id=t.org_id AND d.num=t.case_num
LEFT JOIN public.vp_p6_saved_ocr o ON o.org_id=d.org_id AND o.num=d.num AND o.document_id=d.id
GROUP BY d.id,d.name ORDER BY d.id;
