'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(process.argv[2]||'.'),dry=process.argv.includes('--dry-run');
const route='src/routes/billing-mis.tsx',component='src/components/vp-fin04d-advances.tsx';
const dest=path.join(root,component),source=fs.readFileSync(path.join(__dirname,'source/vp-fin04d-advances.tsx'),'utf8');
function fail(m){throw new Error(m)}
if(!fs.existsSync(path.join(root,'package.json')))fail('Not a ValuationPro project');
if(fs.existsSync(dest))fail('FIN-04D1 file already exists; inspect before reinstalling');
const ts=require(require.resolve('typescript',{paths:[root]}));
function validate(name,content){const f=ts.createSourceFile(name,content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);if(f.parseDiagnostics.length)fail(name+': '+f.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));}
function unique(s,a,b){if(s.split(a).length!==2)fail('Expected unique billing route integration anchor: '+a);return s.replace(a,b);}
const prior=fs.readFileSync(path.join(root,route),'utf8');
const claim='src/components/vp-fin04c-claims.tsx';
const claimPrior=fs.readFileSync(path.join(root,claim),'utf8');
const claimAfter=unique(claimPrior,"Paid ₹${money(c['paid'])}","Settled (cash + advances) ₹${money(c['paid'])}");
const claimId=unique(claimAfter,"<p className=\"font-semibold\">{str(c['status'])} \u00b7 \u20b9","<p className=\"font-semibold\">Claim #{str(c['id'])} \u00b7 {str(c['status'])} \u00b7 \u20b9");
const claimTotals=unique(claimId,"{c['legacy_overlap']===true&&<p className=\"text-amber-700\">","{approved&&c['settlement']!==null&&typeof c['settlement']==='object'&&<p>Cash \u20b9{money(obj(c['settlement'])['cash_paid'])} \u00b7 Applied advances \u20b9{money(obj(c['settlement'])['advance_applied'])} \u00b7 Reversed cash \u20b9{money(obj(c['settlement'])['reversed'])}</p>}{c['legacy_overlap']===true&&<p className=\"text-amber-700\">");
const claimNew=unique(claimTotals,"{str(p['status'])} \u00b7 {str(p['reference'])}","{p['reversed']===true?'Reversed':str(p['status'])} \u00b7 {str(p['reference'])}");
const changes=[{rel:route,before:prior,after:"import { VpFin04DAdvances } from '@/components/vp-fin04d-advances';\n"+unique(prior,'<VpFin04CReview />','<VpFin04CReview />\n    <VpFin04DAdvances />')},{rel:claim,before:claimPrior,after:claimNew}];
validate(component,source);for(const x of changes)validate(x.rel,x.after);
console.log('FIN-04D1 preflight passed: billing route anchor and TSX parse verified.');
if(dry){console.log('DRY RUN ONLY; no files written.');process.exit(0)}
const backup=path.join(path.dirname(root),'ValuationPro_FIN04D1_Backup_'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(backup,{recursive:false});
for(const x of changes){const f=path.join(backup,x.rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,x.before,'utf8');}
const results=[];let written=false;
function check(name,cmd,args,shell=false){const r=spawnSync(cmd,args,{cwd:root,encoding:'utf8',shell,maxBuffer:64*1024*1024});const output=(r.stdout||'')+(r.stderr||'')+(r.error?String(r.error):'');fs.writeFileSync(path.join(backup,name+'.log'),output);const code=r.status??-1;results.push({check:name,exitCode:code});fs.writeFileSync(path.join(backup,'RESULTS.json'),JSON.stringify(results,null,2));if(code!==0){console.error(output.split('\n').slice(-50).join('\n'));fail(name+' failed')}console.log(name+': PASS')}
try{fs.writeFileSync(dest,source,{encoding:'utf8',flag:'wx'});written=true;for(const x of changes)fs.writeFileSync(path.join(root,x.rel),x.after,'utf8');check('TypeScript',process.execPath,[path.join(root,'node_modules/typescript/bin/tsc'),'--noEmit']);check('Regression',process.execPath,[path.join(root,'node_modules/vitest/vitest.mjs'),'run','--pool=threads','--maxWorkers=1','--no-file-parallelism']);const win=process.platform==='win32';check('Dependencies',win?'npm.cmd':'npm',['ls','--all','--json','--legacy-peer-deps=false'],win);check('ProductionBuild',win?'npm.cmd':'npm',['run','build'],win);console.log('FIN-04D1 UI SOURCE INSTALLATION PASSED. Backup: '+backup)}catch(e){for(const x of changes)fs.writeFileSync(path.join(root,x.rel),x.before,'utf8');if(written)fs.rmSync(dest,{force:true});console.error('Modified source restored. Build outputs not restored. SQL migration remains installed. Logs: '+backup);throw e}
