import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]??'.');
const load=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const tests=[
  ['Transfer calculation module present',()=>load('src/lib/vp-inspection-valuation-transfer.ts').includes('proposeReviewedTransfer')],
  ['Measurement unit confirmation',()=>load('src/components/cases/vp-inspection-valuation-review.tsx').includes('rectangular')],
  ['Floor selection is explicit',()=>load('src/components/cases/vp-inspection-valuation-review.tsx').includes('setFloors')],
  ['P2 view RPC wired to the Case Dossier',()=>load('src/components/cases/vp-inspection-valuation-review.tsx').includes('vp_p2_valuer_inspection_for_case')],
  ['P2 save RPC wired to Case Dossier',()=>load('src/routes/cases_.$caseId.tsx').includes('vp_p2_save_reviewed_valuation')],
  ['Existing report stage validation preserved',()=>load('src/routes/cases_.$caseId.tsx').includes("c?.stage==='Report Draft'")],
  ['Role permission check added',()=>load('src/routes/cases_.$caseId.tsx').includes('useVpReportPermissions')],
  ['Core save function remains available',()=>load('src/routes/cases_.$caseId.tsx').includes('saveVpValuation(')],
  ['P2 SQL creates new audit only',()=>load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql').includes('CREATE TABLE IF NOT EXISTS public.vp_p2_valuation_transfer_events')],
  ['P2 SQL keeps core save RPC untouched',()=>!load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql').includes('CREATE OR REPLACE FUNCTION public.vp_report_save_valuation')],
  ['P2 SQL checks source revision',()=>load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql').includes('v_revision IS DISTINCT FROM p_source_revision')],
  ['P2 SQL checks tenant context',()=>load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql').includes('v_org bigint:=public.vp_current_org_id()')],
  ['P2 SQL checks report RBAC',()=>load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql').includes("public.vp_report_can('Edit')")],
  ['P2 SQL denies anonymous execution',()=>load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql').includes('FROM PUBLIC,anon')],
  ['P2 SQL does not DROP user data',()=>!/\bDROP\s+(?:TABLE|SCHEMA|FUNCTION)\b/i.test(load('sql/p2/01_REVIEWED_TRANSFER_STAGING.sql'))],
  ['Original workbook template retained',()=>fs.existsSync(path.join(root,'public/templates/Valuation_Report.xlsx'))],
  ['No private .env bundled',()=>!fs.existsSync(path.join(root,'.env'))],
];
let failures=0;
for(const [label,fn] of tests){try{const good=fn();console.log(good?'PASS':'FAIL',label);if(!good)failures++;}catch(e){console.log('FAIL',label,e.message);failures++;}}
console.log(`P2 STATIC SOURCE CHECKS: ${tests.length-failures}/${tests.length}`);
if(failures)process.exitCode=1;
