import {useMemo,useState,useEffect} from 'react';
import {JsonForms} from '@jsonforms/react';
import {vanillaRenderers,vanillaCells} from '@jsonforms/vanilla-renderers';
import type {JsonSchema7,UISchemaElement} from '@jsonforms/core';
import {Card,CardHeader,CardTitle,CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useP18Template} from '@/lib/vp-p18-api';
import {decodeSnapshot,encodeSnapshot,isP18Category,type P18Template,type P18Snapshot,type P18Values} from '@/lib/vp-p18-templates';

export function formSchema(template:P18Template):{schema:JsonSchema7;uischema:UISchemaElement}{
 const properties:Record<string,JsonSchema7>={};
 for(const f of template.fields){
  const title=f.label+(f.unit?` (${f.unit})`:'');
  properties[f.key]=f.type==='number'?{type:'number',title,minimum:0,maximum:1e15}:f.type==='choice'?{type:'string',title,enum:f.options??[]}:{type:'string',title,maxLength:1000};
 }
 return {schema:{type:'object',properties,additionalProperties:false},uischema:{type:'VerticalLayout',elements:template.fields.map(f=>({type:'Control',scope:`#/properties/${f.key}`}))} as UISchemaElement};
}
function parse(raw:string|undefined):{snapshot:P18Snapshot|null;error:string}{try{return {snapshot:decodeSnapshot(raw),error:''};}catch(e){return {snapshot:null,error:e instanceof Error?e.message:String(e)};}}
function ReadOnly({snapshot}:{snapshot:P18Snapshot}){return <><p className="text-xs text-muted-foreground">Category: {snapshot.template.category} · Template revision: {snapshot.template.revision} · supplemental observations (not adopted values)</p><dl className="grid gap-3 sm:grid-cols-2">{snapshot.template.fields.map(f=><div key={f.key}><dt className="text-xs text-muted-foreground">{f.label}{f.unit?` (${f.unit})`:''}</dt><dd className="break-words whitespace-pre-wrap">{snapshot.values[f.key]??'Not recorded'}</dd></div>)}</dl></>;}
export function VpP18QcSummary({raw}:{raw:string|undefined}){
 const {snapshot,error}=parse(raw);if(!raw)return null;
 return <div className="rounded border p-3 space-y-2"><h4 className="font-semibold">Category-specific observations</h4>{error?<p role="alert" className="text-destructive">Supplement unreadable: {error}. Original report retained.</p>:snapshot&&<ReadOnly snapshot={snapshot}/>}</div>;
}
function Editor({template,saved,disabled,onApply,onPending}:{template:P18Template;saved:P18Values;disabled:boolean;onApply:(s:string)=>void;onPending:(p:boolean)=>void}){
 const {schema,uischema}=useMemo(()=>formSchema(template),[template]);
 const [draft,setDraft]=useState<unknown>(saved);const [errors,setErrors]=useState(0);
 const savedEncoded=encodeSnapshot(template,saved);
 const [encoded,setEncoded]=useState(savedEncoded);const [localError,setLocalError]=useState('');
 const pending=!disabled&&(encoded!==savedEncoded||errors>0||!!localError);
 useEffect(()=>{onPending(pending);},[pending,onPending]);
 useEffect(()=>()=>onPending(false),[onPending]);
 return <div className="space-y-3">
  <p className="text-xs text-muted-foreground">Template {template.category} / {template.revision}. Fields are optional supplemental observations. Apply to the inspection draft, then save and verify through the original report.</p>
  <div className="vp-p18-jsonforms"><JsonForms schema={schema} uischema={uischema} data={draft} renderers={vanillaRenderers} cells={vanillaCells} readonly={disabled} onChange={({data,errors:validationErrors})=>{
   setDraft(data);setErrors(validationErrors?.length??0);
   try{setEncoded(encodeSnapshot(template,data));setLocalError('');}catch(e){setLocalError(e instanceof Error?e.message:String(e));}
  }}/></div>
  {!!localError&&<p role="alert" className="text-destructive text-sm">{localError}</p>}
  {pending&&<p role="status" className="text-xs text-amber-700">Unapplied supplemental changes. Apply or discard before submitting.</p>}
  <div className="flex flex-wrap gap-2"><Button type="button" disabled={disabled||!pending||errors>0||!!localError} onClick={()=>{onApply(encoded);onPending(false);}}>Apply to inspection draft</Button><Button type="button" variant="outline" disabled={disabled||!pending} onClick={()=>{setDraft({...saved});setEncoded(savedEncoded);setErrors(0);setLocalError('');onPending(false);}}>Discard unapplied changes</Button></div>
 </div>;
}
export function VpP18Supplement({productType,raw,disabled,onApply,onPending}:{productType:string;raw:string|undefined;disabled:boolean;onApply:(s:string)=>void;onPending:(p:boolean)=>void}){
 const parsed=useMemo(()=>parse(raw),[raw]);
 const query=useP18Template(productType,!raw&&!disabled);
 const selected=parsed.snapshot?.template??query.data;
 const saved=parsed.snapshot?.values??{};
 if(!raw&&!isP18Category(productType))return null;
 return <Card><CardHeader className="pb-2"><CardTitle className="text-base">Additional property observations</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
 {parsed.error?<p role="alert" className="text-destructive">Saved supplement cannot be decoded: {parsed.error}. It will be preserved without modification.</p>:parsed.snapshot&&parsed.snapshot.template.category!==productType?<><p role="alert" className="text-amber-700">Case category differs from saved template. Historical supplement is preserved read-only; review category before further analysis.</p><ReadOnly snapshot={parsed.snapshot}/></>:disabled?<>{parsed.snapshot?<ReadOnly snapshot={parsed.snapshot}/>:<p className="text-muted-foreground">No supplemental observations recorded.</p>}</>:query.isError&&!parsed.snapshot?<p role="alert" className="text-destructive">Template unavailable: {String(query.error?.message??query.error)}. Existing inspection fields remain available.</p>:selected?<Editor key={`${selected.category}:${selected.revision}:${raw??''}`} template={selected} saved={saved} disabled={disabled} onApply={onApply} onPending={onPending}/>:<p>Loading template…</p>}
 </CardContent></Card>;
}
