import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(process.argv[2] ?? '.');
const target = path.join(root, 'src');
function allFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(item => {
      const full = path.join(dir, item.name);
      return item.isDirectory() ? allFiles(full) : [full];
    });
}
const files = allFiles(target).filter(file => /\.[jt]sx?$/.test(file));
const hashes = new Map();
const missing = [];
let imports = 0;
let syntaxWarnings = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const digest = createHash('sha256').update(source).digest('hex');
  hashes.set(digest, [...(hashes.get(digest) ?? []), path.relative(root, file)]);
  const importPattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\brequire\s*\(\s*)['"]([^'"]+)['"]/g;
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1].split('?')[0];
    if (!(specifier.startsWith('@/') || specifier.startsWith('./') || specifier.startsWith('../'))) continue;
    imports += 1;
    const base = specifier.startsWith('@/')
      ? path.join(target, specifier.slice(2))
      : path.resolve(path.dirname(file), specifier);
    const paths = [base, base + '.ts', base + '.tsx', base + '.js', base + '.jsx',
      base + '.css', path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
    if (!paths.some(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())) {
      missing.push(`${path.relative(root, file)} -> ${specifier}`);
    }
  }
}
const duplicates = [...hashes.values()].filter(group => group.length > 1);
const obsoleteMigration = allFiles(path.join(root, 'supabase', 'migrations'))
  .filter(f => f.endsWith('.sql'))
  .filter(f => /\b(valuation_cases|organization_branches)\b/i.test(fs.readFileSync(f, 'utf8')));
const secrets = ['.env', '.env.local', '.env.production']
  .filter(name => fs.existsSync(path.join(root, name)));
const expected = [
  'src/routes/cases.tsx', 'src/routes/qc-checking.tsx',
  'src/routes/field-operations.tsx', 'src/routes/field-inspections.$visitId.tsx',
  'src/components/voice/vp-voice.tsx',
  'src/components/field/vp-inspection-form.tsx',
  'supabase/functions/vp-provision-users/index.ts',
];
const absent = expected.filter(f => !fs.existsSync(path.join(root, f)));
const bad = missing.length + duplicates.length + obsoleteMigration.length + secrets.length + absent.length;
console.log(`Source files: ${files.length}`);
console.log(`Local imports: ${imports}; unresolved: ${missing.length}`);
console.log(`Identical source-file groups: ${duplicates.length}`);
console.log(`Incompatible executable migrations: ${obsoleteMigration.length}`);
console.log(`Private environment files: ${secrets.length}`);
console.log(`Missing critical files: ${absent.length}`);
if (missing.length) console.error('Unresolved imports:\n' + missing.join('\n'));
if (duplicates.length) console.error('Duplicate files:\n' + JSON.stringify(duplicates));
if (obsoleteMigration.length) console.error('Incompatible migrations:\n' + obsoleteMigration.join('\n'));
if (secrets.length) console.error('Secret files found:\n' + secrets.join('\n'));
if (absent.length) console.error('Critical files missing:\n' + absent.join('\n'));
console.log(bad ? 'SOURCE AUDIT FAILED' : 'SOURCE AUDIT PASSED');
process.exitCode = bad ? 1 : 0;
