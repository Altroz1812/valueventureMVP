/**
 * P6: immutable, unverified, tenant-scoped OCR batches.
 * Only the RPCs can read/write the private register. Accepting a suggestion
 * into a field remains a separate, human-confirmed inspection form action.
 */
import { vpDb } from '@/lib/vp-db';
import type { OcrResponse, OcrPage, OcrSuggestion } from '@/lib/vp-ocr-candidates';
import { findOcrSuggestions } from '@/lib/vp-ocr-candidates';

export type SavedOcrBatch = {
  id: string;
  document_id: string;
  case_num: number;
  language: string;
  pages: OcrPage[];
  candidates: OcrSuggestion[];
  pdf_page_count: number | null;
  status: 'UNVERIFIED';
  created_at: string;
};

export function ocrRegisterError(error: unknown): string {
  const e = error as {code?: string;message?: string} | null;
  if (e?.code === 'PGRST202' || e?.message?.includes('schema cache')) {
    return 'P6 OCR storage is not installed in this Supabase project. Run sql/p6/00_PRECHECK_READONLY.sql and apply the reviewed P6 migration in staging first. OCR remains available only in this browser until then.';
  }
  return e?.message ?? 'Unknown OCR register error';
}

export async function saveOcrBatch(
  documentId: string,
  caseNum: number,
  response: OcrResponse,
  language: 'eng'|'hin'|'tel',
): Promise<string> {
  const candidates = findOcrSuggestions(response.pages);
  const {data,error} = await vpDb.rpc('vp_p6_save_ocr', {
    p_document_id: documentId,
    p_case_num: caseNum,
    p_request_id: response.request_id,
    p_language: language,
    p_pages: response.pages,
    p_candidates: candidates,
    p_pdf_page_count: response.pdf_page_count ?? null,
  });
  if (error) throw new Error(ocrRegisterError(error));
  if (data === null || data === undefined) throw new Error('OCR register did not return an ID');
  return String(data);
}

export async function getOcrHistory(documentId: string, caseNum: number): Promise<SavedOcrBatch[]> {
  const {data,error} = await vpDb.rpc('vp_p6_ocr_history', {
    p_case_num: caseNum,
    p_document_id: documentId,
  });
  if (error) throw new Error(ocrRegisterError(error));
  if (!Array.isArray(data)) throw new Error('Invalid OCR history response');
  return data as SavedOcrBatch[];
}
