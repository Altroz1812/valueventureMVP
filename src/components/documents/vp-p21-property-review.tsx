import { useEffect,useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { useCasePropertyLinks,usePropertyMaster,propertyError } from '@/lib/vp-property-master';
import { propertyOcrCandidates,isP21Field,type P21Candidate } from '@/lib/vp-p21-property-candidates';
import type { OcrPage } from '@/lib/vp-ocr-candidates';
export function P21PropertyReview({num,documentId,batchId,pages,onSourcePage,onBusy}:{num:number;documentId:string;batchId:string|null;pages:readonly OcrPage[];onSourcePage?:(page:number)=>void;onBusy?:(busy:boolean)=>void}){
 const {tenant,can}=useApp();const links=useCasePropertyLinks(num);const properties=usePropertyMaster();const qc=useQueryClient();
 const [selected,setSelected]=useState<P21Candidate|null>(null);const [reviewContext,setReviewContext]=useState('');const [confirmed,setConfirmed]=useState(false);const [reason,setReason]=useState('');const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');const [failed,setFailed]=useState(false);
 useEffect(()=>{onBusy?.(busy);},[busy,onBusy]);
 useEffect(()=>()=>onBusy?.(false),[onBusy]);
 const link=links.data?.[0];const property=properties.data?.find(p=>p.id===link?.property_id);const candidates=propertyOcrCandidates(pages);
 const context=property&&link?`${property.id}:${property.current_revision}:${link.link_version}`:'';
 const editable=!!batchId&&!!property&&!!link&&can('cases.View')&&can('cases.Edit')&&links.isSuccess&&properties.isSuccess;
 async function adopt(){
  if(!selected||!isP21Field(selected.field)||!editable||!property||!link||!batchId||!confirmed||!reason.trim()||busy||reviewContext!==context)return;
  if(!window.confirm(`Create a new master revision for PM-${property.id}?\n${selected.label}: ${selected.value}\nThe case remains pinned to its existing revision.`))return;
  setBusy(true);setStatus('');setFailed(false);
  try{const {data,error}=await vpDb.rpc('vp_p21_apply_property_text',{p_num:num,p_doc:documentId,p_batch:batchId,p_page:selected.page,p_property:property.id,p_link:link.link_version,p_revision:property.current_revision,p_field:selected.field,p_value:selected.value,p_line:selected.sourceLine,p_reason:reason.trim()});if(error)throw error;if(String(data)!==property.id)throw new Error('Unexpected property ID returned. Check revision history before retrying.');
   const check=await vpDb.from('vp_property_revisions').select('revision,data').eq('org_id',tenant.id).eq('property_id',property.id).eq('revision',property.current_revision+1).single();
   if(check.error||!check.data||check.data.data?.[selected.field]!==selected.value)throw new Error('Save returned an ID but revision read-back was not confirmed. Check history before retrying.');
   setStatus(`Master revision ${property.current_revision+1} saved and read back. Case association and valuation unchanged.`);setSelected(null);setConfirmed(false);setReason('');
  }catch(e){setFailed(true);setStatus(propertyError(e));}finally{await qc.invalidateQueries({queryKey:['vp-p16-properties',tenant.id]});await qc.invalidateQueries({queryKey:['vp-p16-revisions',tenant.id,property.id]});setBusy(false);}
 }
 return <section className="rounded border p-3 space-y-2 text-xs"><b>Property field comparison (unverified)</b><p className="text-muted-foreground">Explicitly labelled lines only. Compare with the original registered document, including the property schedule. A human-confirmed correction creates a new Property Master revision; it does not change this case's pinned revision, inspection, valuation, or report. Ownership, survey/plot, extent and document references require manual association.</p>
 {links.error||properties.error?<p role="alert" className="text-destructive">Property reference unavailable: {propertyError(links.error??properties.error)}</p>:null}
 {property&&link?<p>Linked property PM-{property.id} · current master r{property.current_revision} · case pinned r{link.property_revision}</p>:<p>Link an existing property from the case Property tab before adoption.</p>}
 {!batchId&&<p>Save and verify this OCR batch before adopting a field.</p>}
 {!candidates.length&&<p>No safely labelled suggestions. Review extracted text and enter manually.</p>}
 {candidates.map((c,i)=><div key={`${c.field}:${c.page}:${i}`} className="flex flex-wrap items-start justify-between gap-2 rounded border p-2"><div className="min-w-0 flex-1 break-words"><b>{c.label}:</b> {c.value}<p className="break-words text-muted-foreground">Page {c.page} · {c.sourceLine}</p>{onSourcePage&&<Button type="button" size="sm" variant="ghost" onClick={()=>onSourcePage(c.page)}>View source page {c.page}</Button>}{property&&isP21Field(c.field)&&<p>Master: {property.data[c.field]||'Not entered'}</p>}</div>{c.adoptable&&<Button size="sm" variant="outline" disabled={busy||!editable||(property&&isP21Field(c.field)&&property.data[c.field]===c.value)} onClick={()=>{onSourcePage?.(c.page);setSelected(c);setReviewContext(context);setConfirmed(false);setReason('');setStatus('');}}>Review correction</Button>}</div>)}
 {selected&&<div className="space-y-2 border p-3 rounded"><b>Review: {selected.label} → {selected.value}</b>{reviewContext!==context&&<p className="text-destructive">Property or association changed. Select Review correction again.</p>}<p>Page {selected.page}: {selected.sourceLine}</p><Label className="grid gap-1">Reason for correction<Input value={reason} maxLength={250} disabled={busy} onChange={e=>setReason(e.target.value)}/></Label><Label className="flex items-start gap-2"><Checkbox checked={confirmed} onCheckedChange={v=>setConfirmed(v===true)} disabled={busy}/>I checked the original document, property identity and field meaning; I authorize this new master revision.</Label><div className="flex gap-2"><Button size="sm" disabled={!editable||!confirmed||!reason.trim()||busy||reviewContext!==context} onClick={()=>void adopt()}>{busy?'Saving…':'Save verified correction'}</Button><Button size="sm" variant="outline" disabled={busy} onClick={()=>setSelected(null)}>Cancel</Button></div></div>}
 {status&&<p role={failed?'alert':'status'} className={failed?'text-destructive':'text-green-700'}>{status}</p>}
 </section>;
}
