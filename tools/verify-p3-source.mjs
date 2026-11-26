import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[
  ['P3 free OCR imports Tesseract.js',()=>read('src/lib/vp-local-ocr.ts').includes("import('tesseract.js')")],
  ['P3 free OCR reads PDF.js text or renders scanned pages',()=>read('src/lib/vp-local-ocr.ts').includes("import('pdfjs-dist')")],
  ['Document tenant-storage prefix validation',()=>read('src/lib/vp-local-ocr.ts').includes('expectedPrefix')],
  ['Private storage download using authenticated client',()=>read('src/lib/vp-local-ocr.ts').includes('vpDb.storage.from(DOC_BUCKET).download')],
  ['No client-side service secret',()=>!read('src/components/documents/vp-document-ocr.tsx').includes('SERVICE_ROLE_KEY')],
  ['Explicit user consent',()=>read('src/components/documents/vp-document-ocr.tsx').includes('I am authorized')],
  ['OCR not auto-applied',()=>read('src/components/documents/vp-document-ocr.tsx').includes('window.confirm')],
  ['Source review OCR wired',()=>read('src/components/field/vp-inspection-source-review.tsx').includes('<VpDocumentOcr')],
  ['Case Documents OCR wired',()=>read('src/routes/cases_.$caseId.tsx').includes('<VpDocumentOcr')],
  ['Page-labelled suggestions',()=>read('src/lib/vp-ocr-candidates.ts').includes('source_line')],
  ['Historical paid P3 SQL has 24h quota',()=>read('sql/p3/01_OCR_REQUEST_AUDIT_STAGING.sql').includes("interval '24 hours'")],
  ['Historical paid P3 audit RLS enabled',()=>read('sql/p3/01_OCR_REQUEST_AUDIT_STAGING.sql').includes('ENABLE ROW LEVEL SECURITY')],
  ['Historical paid P3 anon RPC revoked',()=>read('sql/p3/01_OCR_REQUEST_AUDIT_STAGING.sql').includes('FROM PUBLIC, anon')],
  ['Historical migrations isolated',()=>fs.existsSync(path.join(root,'database/HISTORY_DO_NOT_RERUN/04_phase4_qc_management.sql'))],
  ['P2 migration retained',()=>fs.existsSync(path.join(root,'sql/p2/01_REVIEWED_TRANSFER_STAGING.sql'))],
  ['No private env in ZIP source',()=>!fs.existsSync(path.join(root,'.env'))],
];
let passed=0;
for(const [name,fn] of checks){try{const ok=fn();console.log((ok?'PASS ':'FAIL ')+name);if(ok)passed++;}catch(e){console.error('FAIL '+name+': '+e.message);}}
console.log(`P3 source checks: ${passed}/${checks.length}`);
if(passed!==checks.length)process.exitCode=1;
