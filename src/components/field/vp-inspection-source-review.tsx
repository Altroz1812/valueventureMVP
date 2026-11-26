import { useEffect, useMemo, useState } from 'react';
import { Link2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVpCaseDocuments, useVpCases, openVpDocument } from '@/lib/vp-cases';
import { inspectionSections } from '@/lib/vp-inspection-template';
import { caseInspectionCandidates, loadProvenance } from '@/lib/vp-inspection-suggestions';
import { VpDocumentOcr } from '@/components/documents/vp-document-ocr';
import { preferredOcrDocument } from '@/lib/vp-p7-ocr-visibility';

export function VpInspectionSourceReview({caseNum,values,canEdit,hasUnsavedChanges=false,onApply}:{
  caseNum:number;values:Record<string,string>;canEdit:boolean;hasUnsavedChanges?:boolean;
  onApply:(field:string,value:string,source:string,detail:string)=>void;
}){
  const cases=useVpCases();
  const docs=useVpCaseDocuments(caseNum);
  const c=cases.allCases.find(row=>row.caseNum===caseNum);
  const caseCandidates=useMemo(()=>caseInspectionCandidates(c),[c]);
  const availableFields=inspectionSections.filter(s=>s.id!=='photographs').flatMap(s=>s.fields).filter(x=>x.type!=='date');
  const [selectedField,setSelectedField]=useState('owner_name');
  const [selectedDoc,setSelectedDoc]=useState('');
  const [activity,setActivity]=useState({busy:false,unsaved:false});
  const [transcribed,setTranscribed]=useState('');
  const provenance=loadProvenance(values);
  const doc=selectedDoc?(docs.data??[]).find(d=>d.id===selectedDoc):preferredOcrDocument(docs.data??[],selectedDoc);
  useEffect(()=>{if(!selectedDoc&&doc)setSelectedDoc(doc.id);},[selectedDoc,doc?.id]);
  const sourcePath=doc?.storage_path;
  function applyManual(){
    const value=transcribed.trim();
    if(!doc||!sourcePath||!value||!canEdit){toast.error('Select a registered document and enter its observed value');return;}
    const field=availableFields.find(x=>x.key===selectedField);
    if(!field){toast.error('Unsupported target field');return;}
    if(field.type==='choice'&&!(field.options??[]).includes(value)){toast.error('Value must match an available option');return;}
    if(field.type==='number'&&(!Number.isFinite(Number(value))||Number(value)<0)){toast.error('Enter a valid non-negative number');return;}
    onApply(selectedField,value,`Document ${doc.id}: ${doc.name}`,'Manually transcribed and accepted after inspecting the registered document');
    setTranscribed('');
  }
  return <Card>
    <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Link2 className="size-4"/> Source review & accepted values</CardTitle></CardHeader>
    <CardContent className="space-y-4 text-sm">
      <p className="text-xs text-muted-foreground">OCR from PDFs/images is free and processed locally. Previously saved OCR can be viewed in read-only mode when the server permits document access. OCR is NOT verified title, area or valuation evidence; accepting a mapped field requires editing permission and confirmation.</p>
      {!canEdit && <p className="rounded border border-amber-300 p-2 text-xs">Inspection editing is disabled. Document selection and saved OCR review are read-only; no OCR value will be added to the inspection until the server authorizes editing.</p>}
      {cases.error&&<p className="text-amber-700">Case suggestions unavailable: {cases.error.message}</p>}
      {caseCandidates.map(candidate=><div key={candidate.field} className="flex flex-wrap items-center gap-2 rounded border p-2">
        <div className="min-w-44 flex-1"><b>{availableFields.find(x=>x.key===candidate.field)?.label??candidate.field}</b>
          <p>{candidate.value}</p><p className="text-xs text-muted-foreground">{candidate.source} · {candidate.detail}</p></div>
        <Button size="sm" variant="outline" disabled={!canEdit} onClick={()=>onApply(candidate.field,candidate.value,candidate.source,candidate.detail)}>{values[candidate.field]?'Use instead':'Accept suggestion'}</Button>
      </div>)}
      <div className="space-y-2 rounded border p-3">
        <b>Manually record a document value</b>
        <p className="text-xs text-muted-foreground">Inspect a source document first; transcription is a human action, not AI extraction.</p>
        {docs.error&&<p className="text-amber-700">Document list unavailable: {docs.error.message}</p>}
        <div className="grid gap-2 md:grid-cols-2">
          <div><Label>Target field</Label><Select value={selectedField} onValueChange={setSelectedField} disabled={!canEdit}>
            <SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{availableFields.map(field=><SelectItem key={field.key} value={field.key}>{field.label}</SelectItem>)}</SelectContent>
          </Select></div>
          <div><Label>Registered source document</Label><Select value={doc?.id??''} onValueChange={id=>{if(activity.busy)return;if(activity.unsaved&&!window.confirm("Discard the unconfirmed local extraction and switch documents?"))return;setSelectedDoc(id);setTranscribed('');setActivity({busy:false,unsaved:false});}} disabled={docs.isLoading||!!docs.error||activity.busy}>
            <SelectTrigger><SelectValue placeholder="Choose document"/></SelectTrigger><SelectContent>{(docs.data??[]).map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
          </Select></div>
        </div>
        {sourcePath&&<Button variant="outline" size="sm" onClick={()=>void openVpDocument(sourcePath).catch(e=>toast.error(String(e)))}>View source securely</Button>}
        <div><Label>Value confirmed from document</Label><Input value={transcribed} onChange={e=>setTranscribed(e.target.value)} disabled={!canEdit} placeholder="Only a value you actually verified"/></div>
        <Button size="sm" disabled={!canEdit||!doc||!sourcePath||!transcribed.trim()} onClick={applyManual}>Accept with provenance</Button>
      </div>
      {doc && <VpDocumentOcr key={`${caseNum}:${doc.id}`} document={doc} caseNum={caseNum} canAccept={canEdit} existingValues={values} onAccept={onApply} onActivity={setActivity}/>}
      {Object.entries(provenance).length>0&&<div className="space-y-1"><p className="flex items-center gap-2 font-medium"><ShieldCheck className="size-4"/> {hasUnsavedChanges ? 'Accepted locally — not yet verified saved' : 'Accepted sources in loaded inspection'}</p>
        {Object.entries(provenance).map(([key,item])=><div key={key} className="rounded border px-3 py-2 text-xs"><b>{availableFields.find(x=>x.key===key)?.label??key}:</b> {item.source}<span className="text-muted-foreground"> · {item.confirmed_at}</span><p className="text-muted-foreground">{item.detail}</p></div>)}
      </div>}
    </CardContent>
  </Card>;
}
