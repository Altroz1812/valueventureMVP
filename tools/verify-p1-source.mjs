// Static source check ONLY; does not prove authenticated browser/Supabase operation.
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const exists=(s)=>fs.existsSync(path.join(root,s));
const read=(s)=>fs.readFileSync(path.join(root,s),'utf8');
const form='src/components/field/vp-inspection-form.tsx',sql='sql/p1/01_P1_OPTIMISTIC_INSPECTION_SAVE.sql';
const tests=[
 ['P0 project baseline present',exists('P0_ACCEPTANCE.md')],
 ['Inspection page is active route',read('src/routes/field-inspections.$visitId.tsx').includes('<VpInspectionForm')],
 ['Autosave RPC invoked',read(form).includes('vp_p1_inspection_save')],
 ['Autosave has debounce',read(form).includes('window.setTimeout')],
 ['User sees save and error status',read(form).includes('saveStatus')&&read(form).includes('saveError')],
 ['Client conflict timestamp sent',read(form).includes('p_expected_updated_at:expectedUpdatedAt.current')],
 ['Server locks visit and inspection',read(sql).includes('vp_site_visits WHERE org_id=v_org AND id=p_visit_id FOR UPDATE')&&read(sql).includes('vp_field_inspections')],
 ['Server delegates existing officer permission gate',read(sql).includes('public.vp_inspection_save(p_visit_id,p_data,p_submit)')],
 ['Server delegates audited manager corrections',read(sql).includes('public.vp_p0_manager_inspection_save(p_visit_id,p_data,p_reason)')],
 ['Original Excel template packaged',exists('public/templates/Valuation_Report.xlsx')],
 ['Excel export integrated',read(form).includes('downloadInspectionWorkbook')],
 ['Excel sketch embedded as editable shapes',read('src/lib/vp-inspection-export.ts').includes('xl/drawings/drawing1.xml')],
 ['Source suggestion review mounted',read(form).includes('<VpInspectionSourceReview')],
 ['No automatic OCR claim',read('P1_DELIVERY.md').includes('not automatic PDF/OCR extraction')],
 ['No plaintext .env',!exists('.env')],
];
let pass=0;for(const [name,okay] of tests){console.log(`${okay?'PASS':'FAIL'} ${name}`);if(okay)pass++;}
console.log(`P1 SOURCE CHECKS: ${pass}/${tests.length}`);if(pass!==tests.length)process.exitCode=1;
