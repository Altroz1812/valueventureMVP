/**
 * Privacy-preserving client-side OCR for registered case documents.
 * Text PDF -> PDF.js text layer; scanned PDF -> PDF.js canvas + Tesseract.js or localhost PaddleOCR.
 * JPEG/PNG -> selected local OCR engine. Files are processed locally after the RLS-protected
 * Supabase Storage download. OCR binaries/language models may be fetched from a CDN.
 * No Google Cloud OCR or Supabase Edge Function is called.
 */
import { vpDb } from '@/lib/vp-db';
import { DOC_BUCKET, type VpCaseDocument } from '@/lib/vp-cases';
import type { OcrPage, OcrResponse } from '@/lib/vp-ocr-candidates';
import { paddleRecognize } from '@/lib/vp-p21-paddle';
import { pdfBatch } from '@/lib/vp-p4-page-ranges';

export type LocalOcrLanguage = 'eng' | 'hin' | 'tel';
export type OcrProgress = (description: string) => void;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_PAGES = 5;
const MAX_TEXT_CHARS = 30000;

function safePage(page: number, text: string, engine: NonNullable<OcrPage['engine']>, alreadyTruncated = false): OcrPage {
  return {
    page,
    text: text.slice(0, MAX_TEXT_CHARS),
    truncated: alreadyTruncated || text.length > MAX_TEXT_CHARS,
    engine,
  };
}

function pdfText(items: readonly unknown[]): string {
  let result = '';
  for (const raw of items) {
    if (!raw || typeof raw !== 'object' || !('str' in raw)) continue;
    const item = raw as {str: string; hasEOL?: boolean};
    result += item.str + (item.hasEOL ? '\n' : ' ');
  }
  return result.trim();
}

export async function extractLocally(
  document: VpCaseDocument,
  caseNum: number,
  tenantId: string,
  language: LocalOcrLanguage,
  progress: OcrProgress,
  startPage = 1,
  paddleToken?: string,
): Promise<OcrResponse> {
  if (!Number.isInteger(caseNum) || caseNum < 1 || !tenantId) {
    throw new Error('Invalid case context.');
  }
  const expectedPrefix = `${tenantId}/${caseNum}/`;
  if (!document.storage_path?.startsWith(expectedPrefix)) {
    throw new Error('The document storage path does not match the selected case.');
  }
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(document.mime)) {
    throw new Error('Only PDF, JPEG and PNG are supported.');
  }
  progress('Retrieving authorized document from private Storage…');
  const { data: blob, error } = await vpDb.storage.from(DOC_BUCKET).download(document.storage_path);
  if (error || !blob) throw new Error(error?.message ?? 'Private document download failed.');
  if (blob.size < 1 || blob.size > MAX_FILE_BYTES) {
    throw new Error('File must be between 1 byte and 10 MB.');
  }

  type TesseractWorker = Awaited<ReturnType<typeof import('tesseract.js')['createWorker']>>;
  let worker: TesseractWorker | undefined;
  async function recognize(image: Blob | HTMLCanvasElement): Promise<{text:string;engine:NonNullable<OcrPage['engine']>;truncated:boolean}> {
    if(paddleToken!==undefined){progress(`Recognizing with local PaddleOCR (${language}); first use may download models…`);return paddleRecognize(image,language,paddleToken);}
    if (!worker) {
      progress(`Loading ${language} OCR model (first use may require a download)…`);
      const { createWorker } = await import('tesseract.js');
      worker = await createWorker(language);
    }
    const data = await worker.recognize(image);
    return {text:data.data.text ?? '',engine:'tesseract',truncated:false};
  }
  const pages: OcrPage[] = [];
  let pdfPageCount: number | undefined;
  let nextPage: number | null = null;
  try {
    if (document.mime !== 'application/pdf') {
      progress('Recognizing image text on this device…');
      const recognized=await recognize(blob.type===document.mime?blob:new Blob([blob],{type:document.mime}));
      pages.push(safePage(1,recognized.text,recognized.engine,recognized.truncated));
    } else {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url,
      ).toString();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const loadTask = pdfjs.getDocument({data: bytes, isEvalSupported: false});
      let pdf: Awaited<typeof loadTask.promise> | undefined;
      try {
        pdf = await loadTask.promise;
        pdfPageCount = pdf.numPages;
        const batch = pdfBatch(pdf.numPages, startPage);
        nextPage = batch.next;
        for (let n = batch.start; n <= batch.end; n++) {
          progress(`Extracting PDF page ${n} of ${pdf.numPages}…`);
          const page = await pdf.getPage(n);
          const layer = await page.getTextContent();
          let text = pdfText(layer.items);
          let engine: NonNullable<OcrPage['engine']> = 'pdf-text';
          let truncated=false;
          // Digitally generated PDFs do not require OCR. Scanned pages do.
          if (text.replace(/\s/g, '').length < 25) {
            const base = page.getViewport({scale: 1});
            const scale = Math.min(2, 2200 / Math.max(base.width, base.height));
            const viewport = page.getViewport({scale});
            const canvas = window.document.createElement('canvas');
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Your browser does not support canvas rendering.');
            progress(`Recognizing scanned PDF page ${n} of ${pdf.numPages}…`);
            await page.render({canvas, canvasContext: ctx, viewport}).promise;
            const recognized=await recognize(canvas);
            text=recognized.text;engine=recognized.engine;truncated=recognized.truncated;
            canvas.width = 0;
            canvas.height = 0;
          }
          pages.push(safePage(n, text,engine,truncated));
          page.cleanup();
        }
      } finally {
        await pdf?.destroy();
      }
    }
  } finally {
    await worker?.terminate();
  }
  return {
    document_id: document.id,
    case_num: caseNum,
    document_name: document.name,
    provider: paddleToken!==undefined?'local-paddleocr':'local-tesseract',
    pages,
    processing_limit: `${MAX_PDF_PAGES} PDF pages per run, max 10 MB; on-device recognition`,
    ...(pdfPageCount !== undefined ? { pdf_page_count: pdfPageCount, next_pdf_page: nextPage } : {}),
    request_id: `local-${crypto.randomUUID()}`,
  };
}
