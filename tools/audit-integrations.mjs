import fs from 'node:fs';
import path from 'node:path';

// Read-only offline source audit. Does not connect to Supabase, execute SQL,
// read .env values, or modify application source files.
// Run: node path/to/audit-integrations.mjs D:\\valuationpro-workspace-main
const root = path.resolve(process.argv[2] || process.cwd());
const checks = [];
const file = (p) => path.join(root, p);
const content = (p) => fs.existsSync(file(p)) ? fs.readFileSync(file(p), 'utf8') : '';
const check = (level, name, evidence, next = '') => checks.push({ level, name, evidence, next });
const found = (p, regex) => regex.test(content(p));

if (!fs.existsSync(file('package.json')) || !fs.existsSync(file('src/router.tsx'))) {
  console.error('STOP: This is not the expected ValuationPro project root.');
  process.exit(1);
}
const routeTree = content('src/routeTree.gen.ts');
const route = 'src/routes/admin.data-integrity.tsx';
check(fs.existsSync(file(route)) ? 'PASS' : 'WARN',
  'Optional data-integrity route file', fs.existsSync(file(route)) ? 'Route source exists' : 'Route source absent',
  'If desired, install the included optional route; a 404 here does not by itself mean the database is broken.');
check(routeTree.includes('/admin/data-integrity') ? 'PASS' : 'WARN',
  'TanStack generated route registration', routeTree.includes('/admin/data-integrity') ? 'Path found in routeTree.gen.ts' : 'Path not found in routeTree.gen.ts',
  'Restart Vite and run npm run build after copying the route file. Do not edit routeTree.gen.ts manually.');
const dash = 'src/routes/index.tsx';
check(fs.existsSync(file(dash)) ? 'PASS' : 'FAIL','Dashboard route',
  fs.existsSync(file(dash)) ? 'src/routes/index.tsx exists' : 'Missing dashboard route');
const old = ['Connect in Phase 3','Connect in Phase 4','Connect in Phase 5','Connect in Billing phase']
  .filter(x=>content(dash).includes(x));
check(old.length ? 'FAIL' : 'PASS','Dashboard legacy placeholder text',
  old.length ? old.join('; ') : 'None of the known four placeholders found',
  'If stale browser content remains, confirm the running Vite process uses this project root and reload.');
check(found(dash, /Vp9DashboardCards|vp9_dashboard_snapshot|useVp9/)
    ? 'PASS' : 'WARN','Dashboard live component wiring',
  found(dash, /Vp9DashboardCards|vp9_dashboard_snapshot|useVp9/) ? 'Live dashboard reference present' : 'No recognizable Phase 9 dashboard reference in route',
  'Check that Phase 9 components are actually rendered in src/routes/index.tsx.');
check(found('src/lib/vp-dashboard.ts', /vp9_dashboard_snapshot/)
    ? 'PASS' : 'WARN','Phase 9 dashboard RPC client',
  found('src/lib/vp-dashboard.ts', /vp9_dashboard_snapshot/) ? 'RPC invoked in client' : 'RPC reference not present',
  'SQL Editor object existence is not evidence that the browser is calling it.');
check(found('src/lib/vp-qc.ts', /vp_qc_list_tasks/)
    ? 'PASS' : 'WARN','Phase 4 QC RPC client',
  found('src/lib/vp-qc.ts', /vp_qc_list_tasks/) ? 'QC listing RPC referenced' : 'No expected QC listing call found');
const routeChecks = [
  ['Users', 'src/routes/admin.users.tsx', /vp[_-](?:admin[_-]user[_-]directory|list[_-]users|user[_-]provision)|VpUserProvision/i],
  ['Banks / clients', 'src/routes/admin.bank-masters.tsx', /vp[_-]bank|banks|rate.cards/i],
  ['Cases', 'src/routes/cases.tsx', /useVpCases|vp[_-]cases|\.from\(['"]cases['"]\)/i],
  ['Case details', 'src/routes/cases_.$caseId.tsx', /vp[_-]case|vp[_-]valuation|VpCaseLinkedRecords/i],
  ['Field Operations', 'src/routes/field-operations.tsx', /vp[_-]field|vp[_-]site|vp[_-]visit/i],
  ['QC & Checking', 'src/routes/qc-checking.tsx', /vp[_-]qc|useVpQc/i],
  ['Reports', 'src/routes/reports.tsx', /vp[_-]report|vp[_-]valuation/i],
  ['Billing', 'src/routes/billing-mis.tsx', /vp[_-]billing|vp[_-]invoice/i],
];
for (const [module, p, matcher] of routeChecks) {
  const exists = fs.existsSync(file(p));
  const wired = exists && found(p, matcher);
  check(!exists ? 'FAIL' : wired ? 'PASS' : 'WARN', `Route: ${module}`,
    !exists ? `Missing ${p}` : wired ? `Found live-module symbol in ${p}` : `No known live-module symbol in ${p}`,
    'Static detection only; the UI still needs a browser acceptance test.');
}
check(fs.existsSync(file('src/components/cases/vp-case-linked-records.tsx')) ? 'PASS' : 'WARN',
  'Case-linked visits and QC component',
  fs.existsSync(file('src/components/cases/vp-case-linked-records.tsx'))
    ? 'Component exists' : 'Optional dossier linkage component not found',
  'Case detail may not display visit and approved QC history even though the QC screen works.');
check(found('src/routes/cases_.$caseId.tsx', /VpCaseLinkedRecords/)
    ? 'PASS' : 'WARN','Case-details linked-records rendering',
  found('src/routes/cases_.$caseId.tsx', /VpCaseLinkedRecords/)
    ? 'Linked component referenced in route' : 'No linked-records component reference in case dossier');
check(fs.existsSync(file('supabase/functions/vp-provision-users/index.ts')) ? 'PASS' : 'WARN',
  'User provisioning Edge Function source',
  fs.existsSync(file('supabase/functions/vp-provision-users/index.ts'))
    ? 'Entrypoint in canonical CLI location' : 'Missing canonical source (deployment may still exist remotely)',
  'Does not verify function deployment or secret configuration.');

console.log(`\nVALUATIONPRO PHASE 10 — READ-ONLY SOURCE AUDIT\nProject: ${root}\n`);
for (const c of checks) console.log(`[${c.level.padEnd(4)}] ${c.name}\n       ${c.evidence}${c.level === 'PASS' ? '' : `\n       Next: ${c.next}`}`);
const totals = Object.fromEntries(['PASS','WARN','FAIL'].map(x=>[x,checks.filter(c=>c.level===x).length]));
console.log(`\nResults: ${totals.PASS} PASS, ${totals.WARN} WARN, ${totals.FAIL} FAIL`);
console.log('IMPORTANT: A PASS checks static source only, not authenticated Supabase access, UI rendering, or server authorization.');
console.log('Use the Data Connections page with a real tenant user, then compare against the SQL audit.');
