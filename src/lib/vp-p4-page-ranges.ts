/** Bounded OCR batches avoid unbounded browser memory/CPU usage. */
export const OCR_PDF_BATCH_SIZE = 5;
export function pdfBatch(totalPages: number, startPage: number): {start: number; end: number; next: number | null} {
  if (!Number.isInteger(totalPages) || totalPages < 1) throw new Error('PDF contains no readable pages.');
  if (!Number.isInteger(startPage) || startPage < 1 || startPage > totalPages) {
    throw new Error(`Start page must be between 1 and ${totalPages}.`);
  }
  const end = Math.min(totalPages, startPage + OCR_PDF_BATCH_SIZE - 1);
  return {start: startPage, end, next: end < totalPages ? end + 1 : null};
}
