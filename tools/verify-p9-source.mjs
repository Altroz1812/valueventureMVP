import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let ts;
try{ts=require('typescript');}catch{const fallback='/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript';try{ts=require(fallback);}catch{console.error('Install project TypeScript dependency first: npm install');process.exit(2);}}
const root=path.resolve(process.argv[2]??'.');
const files=['src/routes/field-operations.tsx','src/routes/field-inspections.$visitId.tsx','src/components/field/vp-inspection-form.tsx','src/components/field/vp-field-case-editor.tsx','src/lib/vp-p8-persistence-verification.ts'];
let errors=[];
for(const rel of files){
 const source=fs.readFileSync(path.join(root,rel),'utf8');
 const result=ts.transpileModule(source,{fileName:rel,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
 for(const d of result.diagnostics??[]){if(d.category===ts.DiagnosticCategory.Error)errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`);}
}
const report=fs.readFileSync(path.join(root,'src/components/field/vp-inspection-form.tsx'),'utf8');
const visits=fs.readFileSync(path.join(root,'src/routes/field-operations.tsx'),'utf8');
const sql=fs.readFileSync(path.join(root,'sql/p9/01_FIELD_OFFICER_CASE_AND_SCHEDULE_STAGING.sql'),'utf8');
const assert=(ok,name)=>{if(!ok)errors.push(name);};
for(const str of ['mobileStep','voiceProposal','setVoiceProposal','VpFieldCaseEditor','vp_p1_inspection_save','Submit to Checker','capture="environment"'])assert(report.includes(str),`Missing inspection feature ${str}`);
for(const str of ['SelfScheduleDialog','vp_p9_field_self_reschedule','mobileRows','runGps'])assert(visits.includes(str),`Missing visit feature ${str}`);
for(const str of ['vp_p9_field_update_case','vp_p9_field_self_reschedule','vp_p9_photo_lock_after_submission','v_visit.assigned_user_id IS DISTINCT FROM v_actor','vp_p0_inspection_access','INSERT INTO public.log'])assert(sql.includes(str),`Missing backend guard ${str}`);
if(errors.length){for(const e of errors)console.error('FAIL',e);process.exit(1);}
console.log('P9 source syntax and structural invariants: OK (NOT a full typecheck or runtime security test)');
