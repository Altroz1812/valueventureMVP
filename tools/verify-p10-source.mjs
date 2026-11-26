import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const checks = [
  ['src/lib/vp-p10-permissions.ts', /mayOpenPath/, 'centralized route denial'],
  ['src/lib/vp-auth.tsx', /vp_sec_my_capabilities/, 'server sourced capabilities'],
  ['src/lib/vp-auth.tsx', /mayOpenPath\(pathname, capabilities\)/, 'direct URL gating'],
  ['src/components/app-shell.tsx', /workspaceNav\.filter\(item => mayOpenPath/, 'sidebar filtering'],
  ['src/routes/admin.users.tsx', /vp_sec_admin_user_directory/, 'complete admin directory'],
  ['src/routes/admin.roles-permissions.tsx', /updating !== null/, 'saving lock'],
  ['src/routes/field-operations.tsx', /can\('field.Assign'\)/, 'no admin dispatch bypass'],
  ['sql/p10/01_P10_RBAC_STAGING.sql', /AS RESTRICTIVE FOR SELECT TO authenticated/, 'mandatory restrictive RLS'],
  ['sql/p10/01_P10_RBAC_STAGING.sql', /bucket_id='vp-case-docs'/, 'case document access'],
  ['sql/p10/01_P10_RBAC_STAGING.sql', /bucket_id='vp-field-evidence'/, 'photo evidence access'],
  ['sql/p10/01_P10_RBAC_STAGING.sql', /bucket_id='vp-report-files'/, 'report PDF access'],
  ['sql/p10/01_P10_RBAC_STAGING.sql', /RETURNS TABLE \(/, 'directory database response'],
];
let failed = 0;
for(const [filename,pattern,label] of checks){
  const full=path.join(root,filename);
  const ok=fs.existsSync(full)&&pattern.test(fs.readFileSync(full,'utf8'));
  process.stdout.write(`${ok?'PASS':'FAIL'} ${label}\n`);
  if(!ok) failed++;
}
const sql=fs.readFileSync(path.join(root,'sql/p10/01_P10_RBAC_STAGING.sql'),'utf8');
for(const text of ['DELETE FROM public.users','DELETE FROM public.cases','TRUNCATE','DROP TABLE']){
  if(sql.toUpperCase().includes(text.toUpperCase())) { failed++; process.stdout.write(`FAIL: destructive query ${text}\n`);}
}
console.log(`${checks.length} checks, failures: ${failed}`);
process.exit(failed?1:0);
