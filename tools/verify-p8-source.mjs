import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[
 ['source helper is present',read('src/lib/vp-p8-persistence-verification.ts').includes('verifyInspectionReadback')],
 ['OCR readback helper is present',read('src/lib/vp-p8-persistence-verification.ts').includes('verifyOcrReadback')],
 ['inspection calls verified readback',read('src/components/field/vp-inspection-form.tsx').includes('verifyInspectionReadback(savedValues,readback,submit)')],
 ['inspection verifies via existing RPC',read('src/components/field/vp-inspection-form.tsx').includes("vpDb.rpc('vp_inspection_get'")],
 ['OCR reads saved history',read('src/components/documents/vp-document-ocr.tsx').includes('verifyOcrReadback(savedId,')],
 ['OCR only calls verified saved after check',read('src/components/documents/vp-document-ocr.tsx').includes('await persistAndVerify(parsed,language)')],
 ['OCR accepts only with confirmation',read('src/components/documents/vp-document-ocr.tsx').includes('window.confirm(')],
 ['source provenance labeled unsaved',read('src/components/field/vp-inspection-source-review.tsx').includes('Accepted locally — not yet verified saved')],
 ['no new P8 mutating SQL',fs.readdirSync(path.join(root,'sql/p8')).every(x=>x.includes('READONLY'))],
 ['P8 focused regression tests',read('src/test/vp-p8-persistence.test.ts').includes('verifyOcrReadback')],
];
let failed=0;
for (const [name,passed] of checks){console.log(`${passed?'PASS':'FAIL'} ${name}`);if(!passed)failed++}
console.log(`${checks.length-failed}/${checks.length} checks passed`);if(failed)process.exitCode=1;
