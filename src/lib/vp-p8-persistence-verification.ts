/**
 * P8: read-after-write verification. A successful RPC response is not proof that
 * accepted OCR values are visible in the persisted inspection record.
 * This module performs no writes and confers no permission.
 */
export type ReadbackCheck = { verified: boolean; reason: string };

export function verifyInspectionReadback(
  submitted: Readonly<Record<string, string>>,
  server: unknown,
  expectingSubmitted: boolean,
): ReadbackCheck {
  if (!server || typeof server !== 'object' || Array.isArray(server)) {
    return { verified: false, reason: 'Inspection readback did not return a report.' };
  }
  const report = server as Record<string, unknown>;
  if (!report['data'] || typeof report['data'] !== 'object' || Array.isArray(report['data'])) {
    return { verified: false, reason: 'Inspection readback has no field data.' };
  }
  if (expectingSubmitted && report['status'] !== 'Submitted') {
    return { verified: false, reason: 'Inspection readback does not confirm Submitted status.' };
  }
  const stored = report['data'] as Record<string, unknown>;
  const missing = Object.entries(submitted)
    .filter(([key, value]) => stored[key] !== value)
    .map(([key]) => key);
  if (missing.length) {
    return { verified: false, reason: `Inspection readback differs for ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? ' and more fields' : ''}.` };
  }
  return { verified: true, reason: 'Saved inspection fields and source provenance were confirmed by a fresh server read.' };
}

export type OcrBatchReadback = {
  id: string;
  document_id: string;
  case_num: number;
  language: string;
  pages: readonly {page: number; text: string; engine?:string; truncated?:boolean}[];
};

export function verifyOcrReadback(
  savedId: string,
  expectedDocumentId: string,
  expectedCaseNum: number,
  expectedLanguage: string,
  expectedPages: readonly {page: number; text: string; engine?:string; truncated?:boolean}[],
  batches: readonly OcrBatchReadback[],
): ReadbackCheck {
  const match = batches.find(x => String(x.id) === savedId);
  if (!match) return {verified:false,reason:'OCR save returned an ID, but the saved batch was not found in history.'};
  if (String(match.document_id) !== String(expectedDocumentId) || match.case_num !== expectedCaseNum || match.language !== expectedLanguage) {
    return {verified:false,reason:'OCR readback metadata differs from the saved document/case/language.'};
  }
  if (!Array.isArray(match.pages) || match.pages.length !== expectedPages.length) {
    return {verified:false,reason:'OCR readback has a different page count.'};
  }
  for (let i=0;i<expectedPages.length;i++) {
    const expected=expectedPages[i];
    const actual=match.pages[i];
    if (!expected || !actual || Number(expected.page)!==Number(actual.page) || expected.text!==actual.text || (expected.engine!==undefined&&expected.engine!==actual.engine) || (expected.truncated!==undefined&&expected.truncated!==actual.truncated)) {
      return {verified:false,reason:`OCR page ${expected?.page ?? i+1} is not identical in saved history.`};
    }
  }
  return {verified:true,reason:'OCR batch confirmed in private Supabase history. No official inspection fields were modified.'};
}
