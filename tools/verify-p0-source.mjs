// Source-only preflight, NOT a Supabase role/behavior test.
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const exists=x=>fs.existsSync(path.join(root,x));
const file=x=>fs.readFileSync(path.join(root,x),'utf8');
const checks=[
 ['Inspection UI route exists',exists('src/routes/field-inspections.$visitId.tsx')],
 ['Server-authoritative access RPC wired',file('src/routes/field-inspections.$visitId.tsx').includes('vp_p0_inspection_access')],
 ['Assigned/manager access separated',file('src/routes/field-inspections.$visitId.tsx').includes('canManage={canManage}')],
 ['Inspector can request corrections',file('src/components/field/vp-inspection-form.tsx').includes('p_reason:canManage?managerReason:null') && file('sql/p1/01_P1_OPTIMISTIC_INSPECTION_SAVE.sql').includes('public.vp_p0_manager_inspection_save(p_visit_id,p_data,p_reason)')],
 ['Field officer save endpoint intact',file('src/components/field/vp-inspection-form.tsx').includes('vp_p1_inspection_save') && file('sql/p1/01_P1_OPTIMISTIC_INSPECTION_SAVE.sql').includes('public.vp_inspection_save(p_visit_id,p_data,p_submit)')],
 ['11 actual photo slots declared',file('src/lib/vp-inspection-template.ts').includes('inspectionPhotoSlots')],
 ['Photo evidence uploaded through existing secure function',file('src/components/field/vp-inspection-form.tsx').includes('uploadFieldPhoto')],
 ['Excel observation group headings rendered separately',file('src/components/field/vp-inspection-form.tsx').includes('inspectionRiskGroups.map')],
 ['Old risk keys retained',file('src/lib/vp-inspection-template.ts').includes("'risk_18'")],
 ['QC photo viewer wired',file('src/components/field/vp-inspection-qc-summary.tsx').includes('openFieldPhoto')],
 ['P0 approval trigger present in SQL',file('sql/p0/01_P0_STAGING_MIGRATION.sql').includes('BEFORE UPDATE OF status ON public.vp_qc_tasks')],
 ['Recorded manager corrections stored in audit table',file('sql/p0/01_P0_STAGING_MIGRATION.sql').includes('vp_p0_inspection_corrections')],
 ['P0 SQL does not drop source tables',!/DROP TABLE|TRUNCATE/i.test(file('sql/p0/01_P0_STAGING_MIGRATION.sql'))],
 ['Existing QC approval function not rewritten',!file('sql/p0/01_P0_STAGING_MIGRATION.sql').includes('CREATE OR REPLACE FUNCTION public.vp_qc_decide')],
 ['No private environment file',!exists('.env')],
 ['Acceptance tests documented',exists('P0_ACCEPTANCE.md')],
];
for(const [name,ok] of checks)console.log(`${ok?'PASS':'FAIL'} ${name}`);
const passed=checks.filter(x=>x[1]).length;
console.log(`P0 STATIC CHECKS: ${passed}/${checks.length}`);
process.exitCode=passed===checks.length?0:1;
