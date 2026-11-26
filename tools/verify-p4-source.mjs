import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
let passes = 0;
let fails = 0;
const check = (name, test) => {
  if (test) { console.log(`[PASS] ${name}`); passes++; }
  else { console.error(`[FAIL] ${name}`); fails++; }
};
const file = (p) => {
  const full = path.join(root, p);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
};
const exists = (p) => fs.existsSync(path.join(root, p));
const ocr = file('src/components/documents/vp-document-ocr.tsx');
const extractor = file('src/lib/vp-local-ocr.ts');
const candidates = file('src/lib/vp-ocr-candidates.ts');
const review = file('src/lib/vp-p4-evidence-review.ts');
const source = file('src/components/field/vp-inspection-source-review.tsx');
const p2 = file('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql');

check('Field Inspection route retained', exists('src/routes/field-inspections.$visitId.tsx'));
check('Case Creation route retained', exists('src/routes/cases.tsx'));
check('QC route retained', exists('src/routes/qc-checking.tsx'));
check('Local OCR uses private Storage', extractor.includes('vpDb.storage.from(DOC_BUCKET).download'));
check('P4 bounded PDF page batches', extractor.includes('pdfBatch(pdf.numPages, startPage)'));
check('PDF next page available', extractor.includes('next_pdf_page: nextPage'));
check('Page selector wired', ocr.includes('PDF start page (5/run)'));
check('Next batch wired', ocr.includes('Process next batch'));
check('Explicit unit extraction', candidates.includes('source_unit?:'));
check('Evidence conflict review logic', review.includes("status: 'conflict'"));
check('Unknown measurement units blocked', review.includes("status: 'unit-check'"));
check('Road width manual verification', review.includes("status: 'manual-only'"));
check('Conflict status rendered in OCR', ocr.includes("review?.status === 'conflict'"));
check('Inspection passes existing values for comparison', source.includes('existingValues={values}'));
check('Provenance maintained on acceptance', ocr.includes('source line:'));
check('P2 migration kept, not marked installed', p2.includes('vp_p2_valuer_inspection_for_case'));
check('Read-only P4 readiness SQL', exists('sql/p4/00_READINESS_READONLY.sql'));
check('Paid OCR function archived', exists('supabase/PAID_OCR_DISABLED_DO_NOT_DEPLOY/vp-ocr-document/index.ts'));
check('No deployable paid OCR function', !exists('supabase/functions/vp-ocr-document/index.ts'));
check('User provisioning function retained', exists('supabase/functions/vp-provision-users/index.ts'));
check('P4 regression tests', exists('tests/p4-evidence-review.test.ts'));
console.log(`P4 source: ${passes} PASS, ${fails} FAIL`);
if (fails) process.exit(1);
