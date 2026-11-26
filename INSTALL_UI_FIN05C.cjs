'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(process.argv[2]||'.'),dry=process.argv.includes('--dry-run');
const route='src/routes/billing-mis.tsx',component='src/components/vp-fin05c-registers.tsx';
const dest=path.join(root,component),source=fs.readFileSync(path.join(__dirname,'source/vp-fin05c-registers.tsx'),'utf8');
function fail(m){throw new Error(m)}
if(!fs.existsSync(path.join(root,'package.json')))fail('Not a ValuationPro project');
if(fs.existsSync(dest))fail('FIN-05C file already exists; inspect before reinstalling');
const ts=require(require.resolve('typescript',{paths:[root]}));
function validate(name,content){const f=ts.createSourceFile(name,content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);if(f.parseDiagnostics.length)fail(name+': '+f.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));}
function unique(s,a,b){if(s.split(a).length!==2)fail('Expected unique billing route integration anchor: '+a);return s.replace(a,b);}
const prior=fs.readFileSync(path.join(root,route),'utf8');
if(!fs.existsSync(path.join(root,'src/components/vp-fin05b-profitability.tsx')))fail('FIN-05B UI prerequisite missing: install FIN-05B first');
if(prior.includes('VpFin05CRegisters'))fail('FIN-05C already integrated');
const changes=[{rel:route,before:prior,after:"import { VpFin05CRegisters } from '@/components/vp-fin05c-registers';\n"+unique(prior,'<VpFin05BProfitability />','<VpFin05CRegisters />\n    <VpFin05BProfitability />')}];
validate(component,source);for(const x of changes)validate(x.rel,x.after);
console.log('FIN-05C preflight passed: billing route anchor and TSX parse verified.');
if(dry){console.log('DRY RUN ONLY; no files written.');process.exit(0)}
const backup=path.join(path.dirname(root),'ValuationPro_FIN05C_Backup_'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(backup,{recursive:false});
for(const x of changes){const f=path.join(backup,x.rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,x.before,'utf8');}
const results=[];let written=false;
function check(name,cmd,args,shell=false){const r=spawnSync(cmd,args,{cwd:root,encoding:'utf8',shell,maxBuffer:64*1024*1024});const output=(r.stdout||'')+(r.stderr||'')+(r.error?String(r.error):'');fs.writeFileSync(path.join(backup,name+'.log'),output);const code=r.status??-1;results.push({check:name,exitCode:code});fs.writeFileSync(path.join(backup,'RESULTS.json'),JSON.stringify(results,null,2));if(code!==0){console.error(output.split('\n').slice(-50).join('\n'));fail(name+' failed')}console.log(name+': PASS')}
try{fs.writeFileSync(dest,source,{encoding:'utf8',flag:'wx'});written=true;for(const x of changes)fs.writeFileSync(path.join(root,x.rel),x.after,'utf8');check('TypeScript',process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),'--noEmit']);check('Regression',process.execPath,[path.join(root,'node_modules/vitest/vitest.mjs'),'run','--pool=threads','--maxWorkers=1','--no-file-parallelism']);const win=process.platform==='win32';check('Dependencies',win?'npm.cmd':'npm',['ls','--all','--json','--legacy-peer-deps=false'],win);check('ProductionBuild',win?'npm.cmd':'npm',['run','build'],win);console.log('FIN-05C UI SOURCE INSTALLATION PASSED. Backup: '+backup)}catch(e){for(const x of changes)fs.writeFileSync(path.join(root,x.rel),x.before,'utf8');if(written)fs.rmSync(dest,{force:true});console.error('Modified source restored. Build outputs not restored. SQL migration remains installed. Logs: '+backup);throw e}
