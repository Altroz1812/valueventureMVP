// Standalone Node regression test: can run without npm install.
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let ts;
try{ts=require('typescript');}
catch {ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js');}
const path=new URL('../src/lib/vp-inspection-valuation-transfer.ts',import.meta.url);
const source=fs.readFileSync(path,'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function('exports','module',code)(mod.exports,mod);
const {proposeReviewedTransfer:propose,mergeReviewedTransfer:merge}=mod.exports;
const data={land_length:'30',land_breadth:'45',measurement_unit:'Feet',floor_area_0:'350',floor_area_1:'1500',floor_area_2:'1200',property_age:'12'};
let checks=0;
function eq(actual,expected,label){if(actual!==expected)throw new Error(`${label}: ${actual} !== ${expected}`);console.log('PASS',label);checks++;}
function throws(fn,label){let did=false;try{fn()}catch{did=true;}eq(did,true,label);}
eq(propose(data,{}).length,0,'No automatic transfer');
eq(propose(data,{landAreaSqYd:{rectangular_confirmed:true}})[0].value,150,'Feet to square yards');
eq(propose({...data,land_length:'10',land_breadth:'10',measurement_unit:'Metres'},{landAreaSqYd:{rectangular_confirmed:true}})[0].value,119.6,'Metres to square yards');
eq(propose(data,{builtUpSqFt:{floors:['floor_area_1','floor_area_2']}})[0].value,2700,'Selected floors only');
eq(propose(data,{ageYears:true})[0].value,12,'Inspected age');
throws(()=>propose(data,{builtUpSqFt:{floors:['floor_area_1','floor_area_1']}}),'Duplicate floor rejected');
throws(()=>propose({...data,measurement_unit:'Other'},{landAreaSqYd:{rectangular_confirmed:true}}),'Unknown unit rejected');
const base={landAreaSqYd:0,landRate:10000,constructionRate:2100};const out=merge(base,propose(data,{landAreaSqYd:{rectangular_confirmed:true}}));
eq(out.landRate,10000,'Land rate preserved');eq(out.constructionRate,2100,'Construction rate preserved');
console.log(`P2 mapping regression tests: ${checks}/${checks} PASS`);
