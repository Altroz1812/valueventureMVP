import {readFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(process.argv[2]??'.');
const files={
  route:'src/routes/field-inspections.$visitId.tsx',
  review:'src/components/field/vp-inspection-source-review.tsx',
  ocr:'src/components/documents/vp-document-ocr.tsx',
  d:'src/lib/vp-p7-inspection-diagnostics.ts',
  v:'src/lib/vp-p7-ocr-visibility.ts',
  p0:'sql/p0/01_P0_STAGING_MIGRATION.sql',
  p1:'sql/p1/01_P1_OPTIMISTIC_INSPECTION_SAVE.sql',
  pre:'sql/p7/00_BACKEND_READINESS_READONLY.sql',
  post:'sql/p7/02_POST_INSTALL_VERIFY_READONLY.sql',
};
const data=Object.fromEntries(Object.entries(files).map(([k,v])=>[k,existsSync(join(root,v))?readFileSync(join(root,v),'utf8'):'']));
const tests=[
  ['Existing P0 migration retained',!!data.p0.includes('CREATE OR REPLACE FUNCTION public.vp_p0_inspection_access')],
  ['Existing P1 migration retained',!!data.p1.includes('CREATE OR REPLACE FUNCTION public.vp_p1_inspection_save')],
  ['P0 authorization still enforced',data.route.includes("vp_p0_inspection_access")&&data.route.includes('can_edit===true')],
  ['P0 query no longer endlessly retries',data.route.includes('retry:false')],
  ['Missing P0 error classified',data.d.includes("code === 'PGRST202'")],
  ['Retry check visible',data.route.includes('Retry permission check')],
  ['Document selector not tied to write permission',data.review.includes('disabled={docs.isLoading||!!docs.error}')],
  ['Default registered document',data.review.includes('preferredOcrDocument(')],
  ['OCR component remounts on doc change',data.review.includes('key={`${caseNum}:${doc.id}`}')],
  ['OCR history independent of new OCR consent',data.ocr.includes('enabled: Boolean(document.storage_path)')],
  ['Saved batch preview automatic',data.ocr.includes('history.data?.[0]')],
  ['OCR acceptance remains gated by edit permission',data.ocr.includes('!canAccept || !review?.canAccept')],
  ['Human confirmation still required',data.ocr.includes('window.confirm(')],
  ['Existing P1 autosave still used',readFileSync(join(root,'src/components/field/vp-inspection-form.tsx'),'utf8').includes("vp_p1_inspection_save")],
  ['P7 SQL checks do not mutate database',!!data.pre&&!!data.post&&!/\b(CREATE|ALTER|DROP|GRANT|INSERT|UPDATE|DELETE|NOTIFY)\b\s+(?:TABLE|FUNCTION|TRIGGER|POLICY|ON|pgrst)/i.test(data.pre+'\n'+data.post)],
];
let good=0;
for(const [name,pass] of tests){if(pass)good++;console.log(`${pass?'PASS':'FAIL'} ${name}`)}
console.log(`${good}/${tests.length} P7 source-level checks passed`);
if(good!==tests.length)process.exitCode=1;
