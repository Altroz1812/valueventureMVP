/** P7: safe viewing of previously saved OCR without auto-applying field values. */
import type { VpCaseDocument } from './vp-cases';
import type { SavedOcrBatch } from './vp-p6-ocr-register';
import type { OcrResponse } from './vp-ocr-candidates';

const OCR_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

/** Honor user selection; otherwise choose a registered OCR-readable file. */
export function preferredOcrDocument<T extends Pick<VpCaseDocument,'id'|'mime'|'storage_path'>>(
  documents: readonly T[], selectedId: string,
): T | undefined {
  return documents.find(document => document.id === selectedId)
    ?? documents.find(document => Boolean(document.storage_path) && OCR_MIMES.has(document.mime))
    ?? documents[0];
}

/** Preview is deliberately UNVERIFIED. No case/inspection/valuation write occurs here. */
export function savedOcrPreview(batch: SavedOcrBatch, documentName: string): OcrResponse {
  return {
    document_id: batch.document_id,
    case_num: batch.case_num,
    document_name: documentName,
    provider: batch.pages.some(p=>p.engine==='paddleocr-3.3.2')?'local-paddleocr':batch.pages.some(p=>p.engine==='tesseract')?'local-tesseract':'saved-unknown',
    pages: batch.pages,
    processing_limit: 'UNVERIFIED saved OCR; review original before acceptance',
    request_id: `saved-${batch.id}`,
    ...(batch.pdf_page_count != null ? {pdf_page_count: batch.pdf_page_count} : {}),
  };
}
