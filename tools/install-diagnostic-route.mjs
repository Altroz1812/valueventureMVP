import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Run: node path/to/install-diagnostic-route.mjs D:\\valuationpro-workspace-main
// No SQL and no modifications to existing application screens.
const here = path.dirname(fileURLToPath(import.meta.url));
const bundle = path.resolve(here, '..');
const root = path.resolve(process.argv[2] || process.cwd());
const from = path.join(bundle, 'src', 'routes', 'admin.data-integrity.tsx');
const to = path.join(root, 'src', 'routes', 'admin.data-integrity.tsx');
const required = [
  'src/router.tsx',
  'src/routes/__root.tsx',
  'src/lib/vp-db.ts',
  'src/lib/app-context.tsx',
  'package.json',
];
for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) {
    console.error(`STOP: Missing ${relative}. No files changed.`);
    process.exit(1);
  }
}
if (!fs.existsSync(from)) {
  console.error('STOP: Diagnostic route not found in this package.');
  process.exit(1);
}
if (fs.existsSync(to)) {
  const existing = fs.readFileSync(to, 'utf8');
  if (existing.includes("createFileRoute('/admin/data-integrity')")) {
    console.log(`Already present: ${to}`);
    console.log('If the URL still shows 404, restart Vite and inspect src/routeTree.gen.ts.');
    process.exit(0);
  }
  console.error(`STOP: ${to} exists with different content. No files overwritten.`);
  process.exit(2);
}
fs.copyFileSync(from, to);
console.log(`Installed optional read-only route: ${to}`);
console.log('Next: npm run build; restart Vite; visit http://localhost:8081/admin/data-integrity');
