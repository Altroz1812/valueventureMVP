// ValuationPro strict-TypeScript repair for the eight files listed in tsc log.
// No SQL, tsconfig, UI layout, workflow or permissions changes.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const changes = new Map();
const notes = [];
const get = (p) => {
  const filename = path.join(root, p);
  if (!fs.existsSync(filename)) throw Error(`Required project file missing: ${p}`);
  return fs.readFileSync(filename, 'utf8');
};
function edit(file, callback) {
  const before = get(file);
  const after = callback(before);
  changes.set(file, { before, after });
  notes.push(`${before === after ? 'UNCHANGED' : 'PATCH'} ${file}`);
}
function replaceExact(text, original, replacement) {
  return text.replaceAll(original, replacement);
}
function bracketify(text, receiver, props, optional = false) {
  // Only the known fields from the TS4111 compiler output are changed.
  for (const prop of props) {
    // Lookbehind avoids rewriting e.g. `user.id` when the variable is `r`.
    const pattern = new RegExp(`(?<![A-Za-z0-9_$])${receiver}${optional ? '\\?' : ''}\\.${prop}(?![A-Za-z0-9_$])`, 'g');
    text = text.replace(pattern, optional
      ? `${receiver}?.['${prop}']` : `${receiver}['${prop}']`);
  }
  return text;
}
edit('src/components/admin/vp-user-provision.tsx', s =>
  replaceExact(s, 'async function invokeProvision(body: unknown)',
    'async function invokeProvision(body: Record<string, unknown>)'));
edit('src/lib/app-context.tsx', s =>
  replaceExact(s, 'setTenantUsers((data ?? []).map((u) => ({',
    'setTenantUsers((data ?? []).map((u: { id: string | number; org_id: string | number; name: string; login: string; role: string; active: boolean }) => ({'));
edit('src/lib/vp-auth.tsx', s =>
  bracketify(s, 'meta', ['vp_invited', 'vp_password_set']));
edit('src/lib/vp-billing.ts', s => {
  s = bracketify(s, 'r', ['invoice_id','branch_id','case_num','service_fee','tax_rate','cgst','sgst','igst','total','paid','outstanding','fee_suggestion','invoice_count','billed','collected','id','amount']);
  s = bracketify(s, 's', ['invoice_count','billed','collected','outstanding','overdue'], true);
  for (let n = 0; n < 4; n++) {
    s = s.replace(new RegExp(`flags\\[${n}\\](?!\\s*\\?\\?)`, 'g'), `flags[${n}] ?? false`);
  }
  return s;
});
edit('src/lib/vp-cases.ts', s =>
  bracketify(s, 'meta', ['ui_stage','branch_id','priority','fee','case_no','city']));
edit('src/routes/billing-mis.tsx', s =>
  s.replace(/return toast\.error\(([^;]*?)\);/g, (_all, argument) =>
    `{ toast.error(${argument}); return; }`));
edit('src/routes/cases_.$caseId.tsx', s =>
  bracketify(s, 'case_snapshot', ['property_address', 'case_number', 'bank']));
edit('src/routes/reports.tsx', s =>
  s.replace(/return toast\.error\(([^;]*?)\);/g, (_all, argument) =>
    `{ toast.error(${argument}); return; }`));

// Validate all patches before writing any file.
const unresolved = [];
const strictPatterns = [
  /async function invokeProvision\(body: unknown\)/,
  /setTenantUsers\(\(data \?\? \[\]\)\.map\(\(u\) =>/,
  /meta\.vp_invited|meta\.vp_password_set/,
  /\bflags\[[0-3]\](?!\s*\?\?)/,
  /\bmeta\.(?:ui_stage|branch_id|priority|fee|case_no|city)\b/,
  /\bcase_snapshot\.(?:property_address|case_number|bank)\b/,
  /return toast\.error\(/,
];
for (const [p, {after}] of changes) {
  for (const pattern of strictPatterns) {
    if (pattern.test(after)) unresolved.push(`${p}: ${pattern}`);
  }
}
if (unresolved.length) {
  console.error('Source differs from expected patch patterns. No files changed.');
  console.error(unresolved.join('\n'));
  process.exit(1);
}
const edited = [...changes.entries()].filter(([, v]) => v.before !== v.after);
if (!edited.length) {
  console.log('Already patched: no changes needed.');
  process.exit(0);
}
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
for (const [relative, { before, after }] of edited) {
  const filename = path.join(root, relative);
  const backup = `${filename}.bak-${stamp}`;
  fs.writeFileSync(backup, before, { flag: 'wx' });
  fs.writeFileSync(filename, after, 'utf8');
  console.log(`PATCHED ${relative}`);
  console.log(`Backup  ${path.relative(root, backup)}`);
}
console.log(`Updated ${edited.length} file(s). Next: npx tsc --noEmit`);
