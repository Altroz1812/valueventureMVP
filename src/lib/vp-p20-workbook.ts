import {unzipSync,strFromU8} from 'fflate';
import {parseP20Mapping,mappedValue,type Mapping} from './vp-p20-model';
export function base64ToBytes(s:string){if(s.length>1398104)throw new Error('Workbook exceeds 1 MiB');return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
export function bytesToBase64(bytes:Uint8Array){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);}
async function openWorkbook(bytes:Uint8Array){
 if(bytes.length<4||bytes.length>1048576||bytes[0]!==80||bytes[1]!==75)throw new Error('Select a blank unencrypted XLSX (max 1 MiB)');
 let total=0,count=0;
 const parts=unzipSync(bytes,{filter:f=>{total+=f.originalSize;count++;if(total>20*1024*1024||count>500)throw new Error('Expanded workbook too large');if(/(?:externalLinks|vbaProject|embeddings|activeX|connections\.xml|queryTables)/i.test(f.name))throw new Error('External links, macros and embedded objects are not supported');return /\.(xml|rels)$/i.test(f.name);}});
 if(!parts['xl/workbook.xml']||!parts['[Content_Types].xml'])throw new Error('Not a valid XLSX workbook');
 for(const [name,part] of Object.entries(parts)){const xml=strFromU8(part);if(/<!DOCTYPE|<!ENTITY|TargetMode\s*=\s*["']External["']|macroEnabled|<\/?(?:\w+:)?(?:oleObject|externalReference)\b/i.test(xml))throw new Error(`Unsupported external/active workbook content: ${name}`);if(/worksheets\//.test(name)&&/<(?:\w+:)?f(?:\s|>)[\s\S]*?(?:WEBSERVICE|HYPERLINK|RTD|DDE|\[[^\]]+\])[\s\S]*?<\/(?:\w+:)?f>/i.test(xml))throw new Error('External formula references are not supported');}
 const {default:XlsxPopulate}=await import('xlsx-populate/browser/xlsx-populate-no-encryption.js');return XlsxPopulate.fromDataAsync(bytes);
}
async function checkedWorkbook(bytes:Uint8Array,mapping:Mapping[]){const wb=await openWorkbook(bytes);if(wb.sheets().some(s=>s.name().toLowerCase()==='_vp20_audit'))throw new Error('Reserved audit sheet already exists');for(const row of mapping){const sheet=wb.sheet(row.sheet);if(!sheet)throw new Error(`Sheet not found: ${row.sheet}`);if(sheet.cell(row.cell).formula())throw new Error(`Cannot overwrite formula ${row.sheet}!${row.cell}`);}return wb;}
export async function inspectP20Workbook(bytes:Uint8Array,input:unknown){const mapping=parseP20Mapping(input);const wb=await checkedWorkbook(bytes,mapping);return wb.sheets().map(s=>s.name());}
export async function renderP20Workbook(encoded:string,input:unknown,values:Record<string,unknown>,audit:{id:string;template_id:string;analysis_version:number;prepared_at:string}){
 const mapping=parseP20Mapping(input);const wb=await checkedWorkbook(base64ToBytes(encoded),mapping);
 for(const row of mapping){const cell=wb.sheet(row.sheet)!.cell(row.cell);const v=mappedValue(values,row.field);cell.value(v===null?'':v);}
 const sheet=wb.addSheet('_VP20_AUDIT');const pairs:[string,string|number][]=[['STATUS','REVIEWED WORKPAPER - NOT RELEASED'],['Export register ID',audit.id],['Template ID',audit.template_id],['Analysis version',audit.analysis_version],['Prepared at',audit.prepared_at],['Case',String(values['case_num'])],['Formula',String(values['formula_version'])],['Warning','Not an official bank valuation certificate. Recalculate and verify all formulas in Excel.']];
 pairs.forEach(([k,v],i)=>{sheet.cell(`A${i+1}`).value(k);sheet.cell(`B${i+1}`).value(v);});
 const blob=await wb.outputAsync({type:'blob'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`WORKPAPER_NOT_RELEASED_${String(values['case_num'])}_v${audit.analysis_version}_export${audit.id}.xlsx`;document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
