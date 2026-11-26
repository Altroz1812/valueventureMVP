'use strict';
// DEP-01R: package tslib as explicit relative files in the final Vercel function.
// No changes to source modules, database or runtime permissions.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');
const root = process.cwd();
const output = path.join(root, '.vercel', 'output');
const verifyOnly = process.argv.includes('--verify-only');
const vendorDir = '_vp_runtime';
const pkg = path.dirname(require.resolve('tslib/package.json'));
const version = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'), 'utf8')).version;
if (version !== '2.8.1') throw new Error(`Expected tslib 2.8.1, found ${version}`);
function walk(dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', vendorDir].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(p));
    else if (e.isFile() && /\.(mjs|cjs|js)$/.test(e.name)) files.push(p);
  }
  return files;
}
function relative(from, to) {
  const s = path.relative(path.dirname(from), to).split(path.sep).join('/');
  return s.startsWith('.') ? s : './' + s;
}
function specifiers(file, source) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (ast.parseDiagnostics.length) throw new Error(`Cannot parse generated module: ${file}`);
  const found = [];
  function inspect(node, cjs) {
    if (!node || !ts.isStringLiteralLike(node)) return;
    if (node.text !== 'tslib' && !node.text.startsWith('tslib/')) return;
    if (node.text !== 'tslib') throw new Error(`Unsupported tslib subpath ${node.text} in ${file}`);
    found.push({ start: node.getStart(ast), end: node.getEnd(), cjs });
  }
  function visit(n) {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) inspect(n.moduleSpecifier, false);
    if (ts.isCallExpression(n) && n.arguments.length) {
      const e = n.expression;
      if (e.kind === ts.SyntaxKind.ImportKeyword) inspect(n.arguments[0], false);
      else if (ts.isIdentifier(e) && /^(?:require|__require\d*)$/.test(e.text)) inspect(n.arguments[0], true);
      else if (ts.isPropertyAccessExpression(e) && e.name.text === 'require') inspect(n.arguments[0], true);
      else if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && /^(?:require|__require\d*)$/.test(e.expression.text) && e.name.text === 'resolve') inspect(n.arguments[0], true);
    }
    ts.forEachChild(n, visit);
  }
  visit(ast);
  return found;
}
function run() {
  const target = path.join(output, 'functions', '__server.func');
  const importer = path.join(target, '_libs', 'supabase__functions-js.mjs');
  if (!fs.existsSync(path.join(output, 'config.json')) || !fs.existsSync(importer)) {
    throw new Error('Expected Nitro Vercel Build Output API files not found. Check the build preset/output; refusing to skip validation.');
  }
  const vendor = path.join(target, vendorDir);
  const esm = path.join(vendor, 'tslib.es6.mjs');
  const cjs = path.join(vendor, 'tslib.cjs');
  if (!verifyOnly) {
    fs.mkdirSync(vendor, { recursive: true });
    for (const [src, dst] of [['tslib.es6.mjs','tslib.es6.mjs'],['tslib.js','tslib.cjs'],['LICENSE.txt','LICENSE.txt'],['CopyrightNotice.txt','CopyrightNotice.txt']]) {
      fs.copyFileSync(path.join(pkg, src), path.join(vendor, dst));
    }
  }
  for (const [src, dst] of [['tslib.es6.mjs','tslib.es6.mjs'],['tslib.js','tslib.cjs']]) {
    if (!fs.existsSync(path.join(vendor,dst)) || !fs.readFileSync(path.join(vendor,dst)).equals(fs.readFileSync(path.join(pkg,src)))) {
      throw new Error(`Missing or altered vendored runtime ${dst}`);
    }
  }
  let count = 0, patched = 0;
  for (const file of walk(target)) {
    const source = fs.readFileSync(file, 'utf8');
    // Fast filter, then use the TypeScript AST to avoid rewriting comments or unrelated strings.
    if (!source.includes('tslib')) continue;
    const matches = specifiers(file, source);
    if (!matches.length) continue;
    if (verifyOnly) throw new Error(`Unpatched tslib import in final artifact: ${file}`);
    let next = source;
    for (const m of matches.sort((a,b) => b.start-a.start)) {
      next = next.slice(0,m.start) + JSON.stringify(relative(file, m.cjs ? cjs : esm)) + next.slice(m.end);
    }
    if (specifiers(file,next).length) throw new Error(`Remaining tslib import: ${file}`);
    fs.writeFileSync(file,next,'utf8');
    count += matches.length;
    patched++;
  }
  // Isolate the exact function and remove its top-level node_modules in the TEST COPY ONLY.
  // This reproduces missing runtime package lookup without deleting deployed dependencies.
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'vp-vercel-'));
  try {
    const copy = path.join(temp,'server.func');
    fs.cpSync(target,copy,{recursive:true,dereference:true,filter:(src)=>path.relative(target,src).split(path.sep)[0] !== 'node_modules'});
    const check = `import { createRequire } from 'node:module';\nconst esm = await import(${JSON.stringify(pathToFileURL(path.join(copy,vendorDir,'tslib.es6.mjs')).href)});\nconst cjs = createRequire(import.meta.url)(${JSON.stringify(path.join(copy,vendorDir,'tslib.cjs'))});\nif (typeof esm.__awaiter !== 'function' || typeof cjs.__awaiter !== 'function') throw new Error('Invalid tslib exports');\nawait import(${JSON.stringify(pathToFileURL(path.join(copy,'_libs','supabase__functions-js.mjs')).href)});\nconsole.log('PASS: Supabase runtime import without function node_modules');`;
    const test = spawnSync(process.execPath,['--input-type=module','-e',check],{cwd:copy,env:{...process.env,NODE_PATH:''},stdio:'inherit',timeout:30000});
    if (test.error || test.status !== 0) throw new Error(`Isolated import test failed: ${test.error || test.status}`);
  } finally { fs.rmSync(temp,{recursive:true,force:true}); }
  console.log(`PASS: Vercel relative tslib packaging (${count} imports changed in ${patched} modules; verifyOnly=${verifyOnly})`);
}
try { run(); } catch (e) { console.error('DEP-01R FAILED:', e); process.exitCode = 1; }
