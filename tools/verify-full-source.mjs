import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]??'.');
const checks=[
 ['Valuation field route','src/routes/field-inspections.$visitId.tsx','<VpInspectionForm'],
 ['Report sections from Excel','src/lib/vp-inspection-template.ts',"title:'9. Photographs'"],
 ['Land actual measurements','src/lib/vp-inspection-template.ts',"title:'2. Land Actual"],
 ['Setbacks table','src/components/field/vp-inspection-form.tsx',"section.layout==='setbacks'"],
 ['Floor wise area table','src/components/field/vp-inspection-form.tsx',"section.layout==='floor_area'"],
 ['Boundaries table','src/components/field/vp-inspection-form.tsx',"section.layout==='boundaries'"],
 ['Per-field microphone','src/components/field/vp-inspection-form.tsx','<VoiceMic'],
 ['Field list link','src/routes/field-operations.tsx','Valuation Report (Excel 1–9)'],
 ['Field schedule microphone','src/routes/field-operations.tsx','<VoiceMic'],
 ['Case creation voice','src/routes/cases.tsx','<VoiceLanguage'],
 ['QC voice and inspection summary','src/routes/qc-checking.tsx','<VpInspectionQcSummary'],
 ['QC remarks microphone','src/routes/qc-checking.tsx','<VoiceMic'],
 ['Dashboard uses live RPC','src/lib/vp-dashboard.ts','vp9_dashboard_snapshot'],
 ['Dashboard renders live data','src/routes/index.tsx','<Vp9DashboardCards'],
 ['Case linked records','src/routes/cases_.$caseId.tsx','<VpCaseLinkedRecords'],
 ['Analytics route','src/routes/analytics.tsx','createFileRoute'],
 ['Live alert inbox','src/routes/notifications.tsx','<VpNotificationCenter'],
 ['User bulk provisioning','src/components/admin/vp-user-provision.tsx','read-excel-file/browser'],
 ['Provisioning function','supabase/functions/vp-provision-users/index.ts','serve'],
 ['Data integrity route','src/routes/admin.data-integrity.tsx','createFileRoute'],
];
let failures=0;
for(const [label,rel,needle] of checks){const f=path.join(root,rel);const ok=fs.existsSync(f)&&fs.readFileSync(f,'utf8').includes(needle);console.log(ok?'PASS':'FAIL',label);if(!ok)failures++;}
const missingEnv=!fs.existsSync(path.join(root,'.env'));
console.log(missingEnv?'PASS':'FAIL','No private .env in archive');if(!missingEnv)failures++;
console.log(`${checks.length+1-failures}/${checks.length+1} static checks passed`);
process.exitCode=failures?1:0;
