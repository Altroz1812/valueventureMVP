import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]??'.');
const required=[
  ['src/lib/vp-p6-ocr-register.ts',"vp_p6_save_ocr"],
  ['src/lib/vp-p6-ocr-register.ts',"vp_p6_ocr_history"],
  ['src/components/documents/vp-document-ocr.tsx','await saveOcrBatch('],
  ['src/components/documents/vp-document-ocr.tsx','Review saved OCR'],
  ['src/components/documents/vp-document-ocr.tsx','Review & accept'],
  ['src/components/field/vp-inspection-source-review.tsx','onAccept={onApply}'],
  ['src/components/field/vp-inspection-form.tsx','setValues(old=>proposeValue('],
  ['src/components/field/vp-inspection-form.tsx','setTimeout(()=>{void save(false,true);},2000)'],
  ['src/lib/vp-ocr-candidates.ts',"field: 'ownership_type'"],
  ['src/lib/vp-ocr-candidates.ts',"field: 'occupancy'"],
  ['sql/p6/01_SAVED_OCR_REVIEW_STAGING.sql','REVOKE ALL ON public.vp_p6_saved_ocr'],
  ['sql/p6/01_SAVED_OCR_REVIEW_STAGING.sql',"status text NOT NULL DEFAULT 'UNVERIFIED'"],
  ['sql/p6/01_SAVED_OCR_REVIEW_STAGING.sql','SECURITY DEFINER SET search_path'],
  ['sql/p6/02_VERIFY_READONLY.sql','has_function_privilege'],
];
for(const [file,token] of required){
 const target=path.join(root,file);
 if(!fs.existsSync(target)||!fs.readFileSync(target,'utf8').includes(token))throw Error(`FAIL ${file} missing ${token}`);
 console.log('PASS',file,token);
}
console.log(`P6 STATIC SOURCE CHECKS: ${required.length}/${required.length} PASS. This is not a full build or authenticated runtime test.`);
