'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(process.argv[2]||'.'),dry=process.argv.includes('--dry-run');
const route='src/routes/billing-mis.tsx',component='src/components/vp-fin04d3.tsx';
const dest=path.join(root,component),source=fs.readFileSync(path.join(__dirname,'source/vp-fin04d3.tsx'),'utf8');
function fail(m){throw new Error(m)}
if(!fs.existsSync(path.join(root,'package.json')))fail('Not a ValuationPro project');
if(fs.existsSync(dest))fail('FIN-04D3 file already exists; inspect before reinstalling');
const ts=require(require.resolve('typescript',{paths:[root]}));
function validate(name,content){const f=ts.createSourceFile(name,content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);if(f.parseDiagnostics.length)fail(name+': '+f.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));}
function unique(s,a,b){if(s.split(a).length!==2)fail('Expected unique billing route integration anchor: '+a);return s.replace(a,b);}
const prior=fs.readFileSync(path.join(root,route),'utf8');
const claim='src/components/vp-fin04c-claims.tsx', claimPrior=fs.readFileSync(path.join(root,claim),'utf8');
if(!fs.existsSync(path.join(root,'src/components/vp-fin04d2-adjustments.tsx')))fail('FIN-04D2 UI prerequisite missing');
if(prior.includes('VpFin04D3'))fail('FIN-04D3 already integrated');
let claimAfter=unique(claimPrior,"const money=(v:unknown)","const outstanding=(c:Row)=>c['settlement']&&typeof c['settlement']==='object'?Number(obj(c['settlement'])['outstanding']):Number(c['amount'])-Number(c['paid']);\nconst money=(v:unknown)");
// Replace all three known arithmetic occurrences in exact prior source, excluding fallback above.
const old="Number(c['amount'])-Number(c['paid'])";
if(claimAfter.split(old).length!==4)fail('Unexpected claim arithmetic anchors');
let n=0;claimAfter=claimAfter.replaceAll(old,()=>++n===1?old:'outstanding(c)');
claimAfter=unique(claimAfter,"Number(c['paid'])<Number(c['amount'])","outstanding(c)>0");
claimAfter=unique(claimAfter,"{c['legacy_overlap']===true&&<p className=\"text-amber-700\">","{approved&&c['settlement']&&typeof c['settlement']==='object'&&<p>Approved reduction ₹{money(obj(c['settlement'])['claim_reduction'])} · Net approved ₹{money(obj(c['settlement'])['net_approved'])}</p>}{c['legacy_overlap']===true&&<p className=\"text-amber-700\">");
claimAfter=unique(claimAfter,"<p>Quantity {str(l['quantity'])}","{Number(l['period_ceiling_reduction']??0)>0&&<p>Before monthly cap ₹{money(l['before_period_ceiling'])} · Capped ₹{money(l['period_ceiling_reduction'])}</p>}<p>Quantity {str(l['quantity'])}");
const changes=[{rel:route,before:prior,after:"import { VpFin04D3 } from '@/components/vp-fin04d3';\n"+unique(prior,'<VpFin04D2Accounts />','<VpFin04D2Accounts />\n    <VpFin04D3 />')},{rel:claim,before:claimPrior,after:claimAfter}];
validate(component,source);for(const x of changes)validate(x.rel,x.after);
console.log('FIN-04D3 preflight passed: billing route anchor and TSX parse verified.');
if(dry){console.log('DRY RUN ONLY; no files written.');process.exit(0)}
const backup=path.join(path.dirname(root),'ValuationPro_FIN04D3_Backup_'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(backup,{recursive:false});
for(const x of changes){const f=path.join(backup,x.rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,x.before,'utf8');}
const results=[];let written=false;
function check(name,cmd,args,shell=false){const r=spawnSync(cmd,args,{cwd:root,encoding:'utf8',shell,maxBuffer:64*1024*1024});const output=(r.stdout||'')+(r.stderr||'')+(r.error?String(r.error):'');fs.writeFileSync(path.join(backup,name+'.log'),output);const code=r.status??-1;results.push({check:name,exitCode:code});fs.writeFileSync(path.join(backup,'RESULTS.json'),JSON.stringify(results,null,2));if(code!==0){console.error(output.split('\n').slice(-50).join('\n'));fail(name+' failed')}console.log(name+': PASS')}
try{fs.writeFileSync(dest,source,{encoding:'utf8',flag:'wx'});written=true;for(const x of changes)fs.writeFileSync(path.join(root,x.rel),x.after,'utf8');check('TypeScript',process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),'--noEmit']);check('Regression',process.execPath,[path.join(root,'node_modules/vitest/vitest.mjs'),'run','--pool=threads','--maxWorkers=1','--no-file-parallelism']);const win=process.platform==='win32';check('Dependencies',win?'npm.cmd':'npm',['ls','--all','--json','--legacy-peer-deps=false'],win);check('ProductionBuild',win?'npm.cmd':'npm',['run','build'],win);console.log('FIN-04D3 UI SOURCE INSTALLATION PASSED. Backup: '+backup)}catch(e){for(const x of changes)fs.writeFileSync(path.join(root,x.rel),x.before,'utf8');if(written)fs.rmSync(dest,{force:true});console.error('Modified source restored. Build outputs not restored. SQL migration remains installed. Logs: '+backup);throw e}
