import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Camera, Download, RefreshCcw, Save, Send, Eye, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { inspectionSections, inspectionRiskGroups, inspectionPhotoSlots, inspectionPhotoCategoryFromName, inspectionRequiredPhotoSlots, missingInspectionFields, type InspectionField, type InspectionSection } from '@/lib/vp-inspection-template';
import { useVpFieldPhotos, useVpFieldVisits, openFieldPhoto, uploadFieldPhoto } from '@/lib/vp-field';
import { VoiceLanguage, VoiceMic, VoiceOption, spokenNumber, type VoiceLang } from '@/components/voice/vp-voice';
import { VpInspectionSourceReview } from '@/components/field/vp-inspection-source-review';
import { VpP22Sketch } from '@/components/field/vp-p22-sketch';
import { P22_KEY,sketchSubmissionError } from '@/lib/vp-p22-sketch';
import { VpPlotSketch } from '@/components/field/vp-plot-sketch';
import { downloadInspectionWorkbook } from '@/lib/vp-inspection-export';
import { loadProvenance, PROVENANCE_KEY, proposeValue } from '@/lib/vp-inspection-suggestions';
import { verifyInspectionReadback } from '@/lib/vp-p8-persistence-verification';
import { VpFieldCaseEditor } from '@/components/field/vp-field-case-editor';
import { VpP18Supplement } from '@/components/field/vp-p18-supplement';
import { P18_KEY } from '@/lib/vp-p18-templates';

type Report = {
  data: Record<string,string>; status:string;
  updated_at?:string|undefined; submitted_at?:string|undefined; can_edit?:boolean|undefined;
};
const mapFields=(section:InspectionSection)=>new Map(section.fields.map(f=>[f.key,f]));
const setbacks=[['Front','front'],['Side1 (Left)','left_side'],['Side2 (Right)','right_side'],['Rear','rear']] as const;
const floors=[['Stilt /Base','0'],['Ground','1'],['First','2'],['Second','3'],['3rd','4'],['4th','5']] as const;
const directions=['East','West','North','South'] as const;

function parseVoiceDate(spoken:string):string|null {
  const text=spoken.trim();
  const iso=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dmy=text.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  const year=Number(iso?.[1]??dmy?.[3]), month=Number(iso?.[2]??dmy?.[2]), day=Number(iso?.[3]??dmy?.[1]);
  if(!year||!month||!day)return null;
  const date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function FieldControl({field,value,onChange,disabled,lang,compact=false}:{
  field:InspectionField;value:string;onChange:(v:string)=>void;disabled:boolean;lang:VoiceLang;compact?:boolean;
}) {
  const id=`inspection-${field.key}`;
  const [voiceProposal,setVoiceProposal]=useState<string|null>(null);
  const spoken=(text:string)=>{
    if(field.type==='number'){
      const n=spokenNumber(text);
      if(n===null){toast.error(`Unrecognized numeric entry: ${text}. Enter manually.`);return;}
      setVoiceProposal(n);return;
    }
    if(field.type==='date'){
      const date=parseVoiceDate(text);
      if(!date){toast.error('Say date DD/MM/YYYY or YYYY-MM-DD, or enter it manually.');return;}
      setVoiceProposal(date);return;
    }
    onChange(value?`${value} ${text}`:text);
  };
  const options=field.options??[];
  const choices=value&&!options.includes(value)?[...options,value]:options;
  return <div className="min-w-0 space-y-1">
    {!compact&&<Label htmlFor={id} className="text-sm font-medium leading-5">{field.label}{field.required?' *':''}{field.unit?` (${field.unit})`:''}</Label>}
    <div className="flex min-w-0 items-start gap-1">
      {field.type==='choice'?<Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className="min-h-11 min-w-0 flex-1"><SelectValue placeholder="Select"/></SelectTrigger>
        <SelectContent>{choices.map(opt=><SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
      </Select>:field.type==='longtext'?<Textarea id={id} value={value} onChange={e=>onChange(e.target.value)}
        disabled={disabled} rows={compact?2:3} className="min-h-11 lg:min-h-8 min-w-0 flex-1 text-base md:text-sm"/>:
        <Input id={id} value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
          type={field.type==='date'?'date':field.type==='number'?'number':'text'}
          min={field.type==='number'?'0':undefined} step={field.type==='number'?'any':undefined}
          className="min-h-11 lg:min-h-8 min-w-0 flex-1 text-base md:text-sm"/>}
      {field.type==='choice'?<VoiceOption label={field.label} lang={lang} options={choices}
        disabled={disabled} onSelect={setVoiceProposal}/>:
        <VoiceMic label={field.label} lang={lang} disabled={disabled} onTranscript={spoken}/>}
    </div>
    {voiceProposal!==null&&<div className="rounded-md border border-amber-400 bg-amber-50 p-2 text-xs text-slate-900" role="status">
      <p className="font-medium">Verify recognized {field.type==='number'?'measurement / numeric value':field.type==='choice'?'option':'date'}{field.unit?` (${field.unit})`:''}</p>
      <p className="break-words py-1 font-semibold">{voiceProposal}</p>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={()=>{onChange(voiceProposal);setVoiceProposal(null);}} disabled={disabled}><Check className="mr-1 size-3"/>Accept</Button>
        <Button type="button" size="sm" variant="outline" onClick={()=>setVoiceProposal(null)}><X className="mr-1 size-3"/>Discard</Button>
      </div>
    </div>}
  </div>;
}

function InspectionSectionView({section,values,onChange,disabled,lang}:{
  section:InspectionSection;values:Record<string,string>;
  onChange:(key:string,value:string)=>void;disabled:boolean;lang:VoiceLang;
}) {
  const byKey=mapFields(section);
  const field=(key:string,compact=false)=>{
    const f=byKey.get(key);
    if(!f)return null;
    return <FieldControl field={f} value={values[key]??''} onChange={v=>onChange(key,v)} disabled={disabled} lang={lang} compact={compact}/>;
  };
  let content:ReactNode;
  if(section.layout==='setbacks'){
    content=<><div className="hidden md:block overflow-x-auto"><table className="w-full min-w-[750px] border-collapse text-sm">
      <thead><tr className="bg-muted/40"><th className="border p-2 text-left">Setbacks</th><th className="border p-2 text-left">As per plan/ Bye laws</th><th className="border p-2 text-left">Actual at site</th><th className="border p-2 text-left">Remarks, if any</th></tr></thead>
      <tbody>{setbacks.map(([name,key])=><tr key={key}><th className="border p-2 text-left font-medium">{name}</th>
        {(['plan','actual','remarks'] as const).map(part=><td key={part} className="border p-2 align-top">{field(`setback_${key}_${part}`,true)}</td>)}
      </tr>)}</tbody></table></div>
      <div className="space-y-3 md:hidden">{setbacks.map(([name,key])=><div key={key} className="rounded-lg border p-3 space-y-3"><h4 className="font-semibold text-sm">{name}</h4>{(['plan','actual','remarks'] as const).map(part=><div key={part}>{field(`setback_${key}_${part}`)}</div>)}</div>)}</div></>;
  }else if(section.layout==='floor_area'){
    content=<div className="space-y-3"><div className="hidden md:block overflow-x-auto"><table className="min-w-[920px] w-full border-collapse text-sm">
      <thead><tr className="bg-muted/40"><th className="border p-2 text-left">Areas</th>{floors.map(([name])=><th key={name} className="border p-2 text-left">{name}</th>)}</tr></thead>
      <tbody><tr><th className="border p-2 text-left">Actual (Sqft)</th>{floors.map(([,idx])=><td key={idx} className="border p-2">{field(`floor_area_${idx}`,true)}</td>)}</tr></tbody></table></div>
      <div className="grid gap-3 md:hidden">{floors.map(([name,idx])=><div className="rounded border p-3" key={idx}><p className="font-medium text-sm mb-2">{name}</p>{field(`floor_area_${idx}`)}</div>)}</div>
      <div className="max-w-md">{field('recommended_construction_value')}</div></div>;
  }else if(section.layout==='boundaries'){
    content=<><div className="hidden md:block overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-sm">
      <thead><tr className="bg-muted/40"><th className="border p-2 text-left">Boundaries</th>{directions.map(d=><th className="border p-2 text-left" key={d}>{d}</th>)}</tr></thead>
      <tbody>{([['As per deed','deed'],['At site','site'],['Boundaries Matching','match']] as const).map(([label,suffix])=><tr key={suffix}>
        <th className="border p-2 text-left font-medium">{label}</th>
        {directions.map(d=><td className="border p-2 align-top" key={d}>{field(`boundary_${d.toLowerCase()}_${suffix}`,true)}</td>)}
      </tr>)}</tbody></table></div>
      <div className="space-y-3 md:hidden">{directions.map(d=><div key={d} className="rounded-lg border p-3 space-y-3"><h4 className="font-semibold text-sm">{d}</h4>{(['deed','site','match'] as const).map(suffix=><div key={suffix}>{field(`boundary_${d.toLowerCase()}_${suffix}`)}</div>)}</div>)}</div></>;
  }else if(section.layout==='observations'){
    content=<div className="space-y-4">
      {inspectionRiskGroups.map(group=><div className="rounded-md border p-3" key={group.title}>
        <h4 className="mb-3 text-sm font-semibold">{group.title}</h4>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {group.items.map(item=>{const f=byKey.get(item.key);return f?<FieldControl key={item.key} field={f} value={values[item.key]??''} onChange={v=>onChange(item.key,v)} disabled={disabled} lang={lang}/>:null;})}
        </div>
      </div>)}{field('risk_remarks')}
    </div>;
  }else{
    content=<div className="grid gap-3 md:grid-cols-2">{section.fields.map(f=><FieldControl key={f.key} field={f} value={values[f.key]??''} onChange={v=>onChange(f.key,v)} disabled={disabled} lang={lang}/>)}</div>;
  }
  return <Card id={`inspection-${section.id}`}>
    <CardHeader className="pb-3"><CardTitle className="text-base">{section.title}</CardTitle><p className="text-xs text-muted-foreground">Excel source: {section.source}</p></CardHeader>
    <CardContent className="space-y-3">{content}{section.layout==='photos'&&<p className="text-xs text-muted-foreground">Notes do not count as evidence. Use the category-specific capture controls immediately below to upload actual private photos.</p>}</CardContent>
  </Card>;
}

export function VpInspectionForm({visitId,canEdit,canSubmit=false,canManage=false,canCapture=false,productType,editReason}:{
  visitId:string;canEdit:boolean;canSubmit?:boolean;canManage?:boolean;canCapture?:boolean;productType:string;editReason?:string;
}) {
  const {tenant}=useApp();
  const queryClient=useQueryClient();
  const [lang,setLang]=useState<VoiceLang>('en-IN');
  const [mobileStep,setMobileStep]=useState(0);
  const [values,setValues]=useState<Record<string,string>>({});
  const [dirty,setDirty]=useState(false);
  const [supplementPending,setSupplementPending]=useState(false);
  const [supplementReset,setSupplementReset]=useState(0);
  const [saving,setSaving]=useState(false);
  const [saveStatus,setSaveStatus]=useState<'idle'|'saving'|'verifying'|'saved'|'error'>('idle');
  const [saveError,setSaveError]=useState('');
  const editRevision=useRef(0);
  const expectedUpdatedAt=useRef<string|null>(null);
  const lastAutoErrorRevision=useRef<number|null>(null);
  const [managerReason,setManagerReason]=useState('');
  const [uploadingCategory,setUploadingCategory]=useState<string|null>(null);
  const visits=useVpFieldVisits();
  const photos=useVpFieldPhotos(visitId);
  const currentVisit=(visits.data??[]).find(v=>String(v.id)===String(visitId));
  const requiredPhotoKeys=inspectionRequiredPhotoSlots(productType);
  const categoryLookup=new Map(inspectionPhotoSlots.map(slot=>[slot.key,(photos.data??[]).filter(p=>inspectionPhotoCategoryFromName(p.name)===slot.key)]));
  const missingPhotos=requiredPhotoKeys.filter(key=>(categoryLookup.get(key)?.length??0)===0);
  const reportQuery=useQuery({
    queryKey:['vp-inspection',tenant.id,visitId],enabled:!!visitId,
    queryFn:async():Promise<Report>=>{
      const {data,error}=await vpDb.rpc('vp_inspection_get',{p_visit_id:visitId});
      if(error)throw error;
      const raw=(data??{}) as Partial<Report>;
      return {data:raw.data??{},status:raw.status??'Not started',
        ...(raw.updated_at!==undefined?{updated_at:raw.updated_at}:{}),
        ...(raw.submitted_at!==undefined?{submitted_at:raw.submitted_at}:{}),
        ...(raw.can_edit!==undefined?{can_edit:raw.can_edit}:{})};
    }
  });
  useEffect(()=>{if(!dirty&&reportQuery.data){setValues(reportQuery.data.data??{});expectedUpdatedAt.current=reportQuery.data.updated_at??null;}},[reportQuery.data,dirty]);
  useEffect(()=>{
    const warn=(event:BeforeUnloadEvent)=>{if(dirty||saving||supplementPending){event.preventDefault();event.returnValue='';}};
    window.addEventListener('beforeunload',warn);
    return ()=>window.removeEventListener('beforeunload',warn);
  },[dirty,saving,supplementPending]);
  const report=reportQuery.data;
  const stepCount=inspectionSections.length;
  const stepSection=inspectionSections[mobileStep]??inspectionSections[0]!;
  const editable=canEdit&&(report?.can_edit??report?.status!=='Submitted');
  const filled=useMemo(()=>inspectionSections.flatMap(s=>s.fields).filter(f=>String(values[f.key]??'').trim()).length,[values]);
  const total=inspectionSections.reduce((n,s)=>n+s.fields.length,0);
  const missing=missingInspectionFields(values);
  function setValue(key:string,value:string){
    editRevision.current++;setDirty(true);setSaveStatus('idle');setSaveError('');
    setValues(old=>{const sources={...loadProvenance(old)};delete sources[key];return {...old,[key]:value,[PROVENANCE_KEY]:JSON.stringify(sources)};});
  }
  function acceptCandidate(field:string,value:string,source:string,detail:string){
    editRevision.current++;setDirty(true);setSaveStatus('idle');setSaveError('');
    setValues(old=>proposeValue(old,field,value,source,detail,new Date().toISOString()));
  }
  async function save(submit:boolean,auto=false){
    if(canManage&&submit){toast.error('Manager corrections cannot submit on behalf of the assigned officer');return;}
    if(canManage&&managerReason.trim().length<10){toast.error('Enter a correction reason (minimum 10 characters)');return;}
    if(!editable){toast.error('Inspection is read-only');return;}
    if(submit&&sketchSubmissionError(values[P22_KEY])){toast.error(sketchSubmissionError(values[P22_KEY])!);return;}
    if(submit&&supplementPending){toast.error('Apply or discard supplemental data before submission');return;}
    if(submit&&!canSubmit){toast.error('Submit only after site visit check-in or completion');return;}
    if(submit&&missing.length){toast.error(`Complete ${missing.length} mandatory inspection field(s): ${missing.slice(0,5).join(', ')}`);return;}
    if(submit&&photos.data&&photos.data.length<Math.max(8,currentVisit?.min_photos??8)){toast.error('At least eight registered photographs (or the configured visit minimum) are required');return;}
    if(submit&&missingPhotos.length){toast.error(`Missing photo categories: ${missingPhotos.join(', ')}`);return;}
    if(submit&&!window.confirm('Submit and lock this inspection? Check dictated dimensions, boundaries and photos first.'))return;
    const savedRevision=editRevision.current;
    const savedValues={...values};
    setSaving(true);setSaveStatus('saving');setSaveError('');
    try{
      const {data,error}=await vpDb.rpc('vp_p1_inspection_save',{
        p_visit_id:visitId,p_data:savedValues,p_expected_updated_at:expectedUpdatedAt.current,
        p_submit:submit,p_reason:canManage?managerReason:null,
      });
      if(error)throw error;
      if(!data||typeof data!=='object'||typeof data.updated_at!=='string')throw new Error('Save succeeded but response lacks updated_at; reload to avoid version conflict');
      // P8: do not say "Saved in Supabase" until a new authoritative read
      // returns every field, including the accepted OCR source provenance.
      expectedUpdatedAt.current=data.updated_at;
      setSaveStatus('verifying');
      const {data:readback,error:readbackError}=await vpDb.rpc('vp_inspection_get',{p_visit_id:visitId});
      if(readbackError) throw new Error(`Save RPC succeeded but server readback failed: ${readbackError.message}. Your changes remain visible; check before retrying.`);
      const verified=verifyInspectionReadback(savedValues,readback,submit);
      if(!verified.verified)throw new Error(`Save RPC succeeded but verification failed: ${verified.reason} Review before retrying.`);
      if(savedRevision===editRevision.current||submit)setDirty(false);
      if(canManage&&savedRevision===editRevision.current)setManagerReason('');
      setSaveStatus(savedRevision===editRevision.current?'saved':'idle');
      lastAutoErrorRevision.current=null;
      await queryClient.invalidateQueries({queryKey:['vp-inspection',tenant.id,visitId]});
      if(!auto)toast.success(submit?'Inspection submitted and read back':'Inspection draft saved and read back');
    }catch(e){
      const message=e instanceof Error?e.message:String(e);
      setSaveStatus('error');setSaveError(message);
      if(auto)lastAutoErrorRevision.current=editRevision.current;
      else toast.error(message);
    }finally{setSaving(false);}
  }
  useEffect(()=>{
    if(!dirty||!editable||saving||reportQuery.isLoading||reportQuery.error||reportQuery.isFetching)return;
    // Manager changes create immutable audit records: use explicit Save, never periodic autosave.
    if(canManage)return;
    if(lastAutoErrorRevision.current===editRevision.current)return;
    const timer=window.setTimeout(()=>{void save(false,true);},2000);
    return ()=>window.clearTimeout(timer);
  },[dirty,values,editable,saving,canManage,managerReason,reportQuery.isLoading,reportQuery.isFetching,reportQuery.error]);
  async function exportExcel(){
    try{await downloadInspectionWorkbook(visitId,values,(photos.data??[]).map(p=>p.name));toast.success(dirty?'Exported current UNSAVED inspection values':'Inspection Excel exported');}
    catch(e){toast.error(e instanceof Error?e.message:String(e));}
  }
  async function reloadServerVersion(){
    if((dirty||supplementPending)&&!window.confirm('Discard current unsaved changes and reload the server version?'))return;
    setSupplementPending(false);setSupplementReset(v=>v+1);
    setDirty(false);lastAutoErrorRevision.current=null;setSaveError('');setSaveStatus('idle');
    const result=await reportQuery.refetch();
    if(result.data){setValues(result.data.data??{});expectedUpdatedAt.current=result.data.updated_at??null;}
  }
  async function capture(key:string,file:File|undefined){
    if(!file||!canCapture||!editable||!currentVisit)return;
    setUploadingCategory(key);
    try{
      const name=`${key}__${file.name.slice(-190)}`;
      const tagged=new File([file],name,{type:file.type,lastModified:file.lastModified});
      await uploadFieldPhoto(tenant.id,currentVisit,tagged);
      await queryClient.invalidateQueries({queryKey:['vp-field-photos',tenant.id,visitId]});
      await queryClient.invalidateQueries({queryKey:['vp-field-visits',tenant.id]});
      toast.success(`${key} photo registered`);
    }catch(e){toast.error(e instanceof Error?e.message:String(e));}
    finally{setUploadingCategory(null);}
  }
  return <div className={tenant.role==='Field Officer'?'space-y-4 lg:space-y-3 pb-44 md:pb-4':'space-y-4 lg:space-y-3 pb-28 md:pb-4'}>
    <Card><CardHeader><CardTitle>Inspection progress</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><VoiceLanguage value={lang} onChange={setLang}/><span>{filled}/{total} fields filled · {report?.status??'Loading'}{dirty?' · Unsaved changes':''}</span></div>
        <div role="status" aria-live="polite" className="rounded border p-2 text-xs">
          {saveStatus==='saving'?'Saving securely…':saveStatus==='verifying'?'Verifying values and OCR provenance from Supabase…':saveStatus==='saved'?'Saved and verified in Supabase':saveStatus==='error'?'Save failed — changes retained locally until you retry':dirty?(canManage?'Manager correction: enter a reason and click Save Draft':'Draft changed — autosave starts after 2 seconds'):'No unsaved changes'}
          {saveError&&<p className="text-destructive">{saveError}. If another user updated this report, review before reloading.</p>}
          <div className="mt-2 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={reportQuery.isLoading||!!reportQuery.error} onClick={()=>void exportExcel()}><Download className="mr-1 size-4"/>Download original Excel</Button>
            <Button size="sm" variant="outline" disabled={saving||reportQuery.isFetching} onClick={()=>void reloadServerVersion()}><RefreshCcw className="mr-1 size-4"/>Reload server data</Button></div>
        </div>
        <p className="text-xs text-muted-foreground">Based on the uploaded Excel rows 1–60. Microphones populate editable values only; verify recognized measurements and options. GPS check-in and actual photo evidence remain separate controls.</p>
        {reportQuery.isLoading&&<p>Loading inspection...</p>}
        {reportQuery.error&&<p role="alert" className="text-destructive">Inspection API: {reportQuery.error.message}</p>}
        {!canEdit&&<p role="status" className="text-amber-700">Read-only: {editReason??'Only the assigned officer can edit while the visit is active.'}</p>}
        {canEdit&&report?.can_edit===false&&<p role="status" className="text-amber-700">Inspection already submitted and locked. A Field QC return is required for corrections.</p>}
        {canEdit&&!canSubmit&&<p className="text-muted-foreground">Scheduled: draft entry only. Submission and real photo capture require site check-in. Manager corrections always require a reason.</p>}
      </CardContent>
    </Card>
    <div className="vp-mobile-report-nav space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:hidden" aria-label="Mobile report sections">
      <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inspection report</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{mobileStep+1} / {stepCount}</span></div>
      <h2 className="font-display text-lg font-bold leading-snug">{stepSection.title}</h2>
      <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={stepCount} aria-valuenow={mobileStep+1} aria-label="Report section progress"><div className="h-full rounded-full bg-primary transition-all" style={{width:`${(mobileStep+1)/stepCount*100}%`}}/></div>
      <label htmlFor="p14-mobile-step" className="block text-xs text-muted-foreground">Choose report section</label>
      <select id="p14-mobile-step" className="min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm" value={mobileStep} onChange={e=>setMobileStep(Number(e.target.value))}>
        {inspectionSections.map((section,i)=><option key={section.id} value={i}>{i+1}. {section.title}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="min-h-12" disabled={mobileStep===0} onClick={()=>{setMobileStep(v=>Math.max(0,v-1));window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}><ChevronLeft className="mr-1 size-4"/>Previous</Button>
        <Button className="min-h-12" disabled={mobileStep===stepCount-1} onClick={()=>{setMobileStep(v=>Math.min(stepCount-1,v+1));window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}>Next<ChevronRight className="ml-1 size-4"/></Button>
      </div>
      <p className="text-xs text-muted-foreground">{filled} of {total} fields entered. Complete all required fields before submitting.</p>
    </div>
    <nav aria-label="Inspection sections" className="hidden rounded-xl border bg-card p-3 md:block"><h2 className="mb-2 text-sm font-semibold">Jump to section</h2><div className="flex flex-wrap gap-2">{inspectionSections.map((section,i)=><a key={section.id} href={`#inspection-${section.id}`} className="rounded-lg border border-border px-3 py-2 text-sm text-primary hover:bg-muted">{i+1}. {section.title}</a>)}</div></nav>
    {currentVisit&&<div className={mobileStep===0?'block':'hidden md:block'}><VpFieldCaseEditor visitId={visitId} caseNum={currentVisit.num}
      canEdit={editable} isAssigned={!canManage&&canEdit}/></div>}
    <div className={mobileStep===0?'block':'hidden md:block'}>
      <VpInspectionSourceReview caseNum={currentVisit?.num??0} values={values} canEdit={editable&&!saving} hasUnsavedChanges={dirty||saving} onApply={acceptCandidate}/>
    </div>
    <div className={mobileStep===0?'block':'hidden md:block'}><VpP18Supplement key={`${visitId}:${supplementReset}`} productType={productType} raw={values[P18_KEY]} disabled={!editable||reportQuery.isLoading||!!reportQuery.error} onApply={v=>setValue(P18_KEY,v)} onPending={setSupplementPending}/></div>
    {inspectionSections.filter(section=>section.id!=='photographs').map(section=><div id={`inspection-${section.id}`} className={mobileStep===inspectionSections.findIndex(x=>x.id===section.id)?'vp-child-section block':'vp-child-section hidden md:block'} key={section.id}><InspectionSectionView section={section}
      values={values} onChange={setValue} disabled={!editable||saving||reportQuery.isLoading||!!reportQuery.error} lang={lang}/></div>)}
    <div className={mobileStep===inspectionSections.findIndex(x=>x.id==='building')?'block':'hidden md:block'}><div className="space-y-3"><VpP22Sketch raw={values[P22_KEY]} disabled={!editable||saving||reportQuery.isLoading||!!reportQuery.error} onChange={v=>setValue(P22_KEY,v)}/><details className="rounded-xl border bg-card p-3"><summary className="cursor-pointer text-sm font-semibold">Measurement-based plot preview (not to scale)</summary><div className="mt-3"><VpPlotSketch values={values}/></div></details></div></div>
    <div id="inspection-photographs" className={mobileStep===stepCount-1?'vp-child-section block':'vp-child-section hidden md:block'}><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Camera className="size-4"/> 9. Photographs — evidence and notes</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-muted-foreground">Registered in the private field-evidence bucket. 11 categories include optional Internal 1 from the reference application. Required categories depend on property type; minimum photo count remains controlled by Field QC.</p>
        {photos.isLoading&&<p>Loading evidence...</p>}
        {photos.error&&<p className="text-destructive">Photo database error: {photos.error.message}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {inspectionPhotoSlots.map(slot=>{const existing=categoryLookup.get(slot.key)??[];const latest=existing[0];const noteKeys:Record<string,string>={'road':'photo_road','address':'photo_address','front-elevation':'photo_front','side-elevation':'photo_side','internal-2':'photo_internal','kitchen':'photo_kitchen','bills-verified':'photo_bills','selfie-customer':'photo_selfie','dishaank':'photo_dishaank','compass':'photo_compass'};const noteKey=noteKeys[slot.key];const noteField=inspectionSections.find(x=>x.id==='photographs')?.fields.find(f=>f.key===noteKey);return <div key={slot.key} className="rounded border p-3 space-y-2">
            <div className="flex items-center justify-between gap-2"><strong>{slot.label}</strong><span className="text-xs text-muted-foreground">{requiredPhotoKeys.includes(slot.key)?'Required':'Optional'} · {existing.length} file(s)</span></div>
            <div className="flex flex-wrap items-center gap-2">
              {latest&&<Button variant="outline" size="sm" onClick={()=>void openFieldPhoto(latest.storage_path).catch(e=>toast.error(String(e)))}><Eye className="mr-1 size-4"/>View latest</Button>}
              {canCapture&&editable&&<label className="vp-upload cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted">
                {uploadingCategory===slot.key?'Uploading…':latest?'Retake / new version':'Take / upload photo'}
                <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" disabled={uploadingCategory!==null} onChange={e=>{const file=e.target.files?.[0];e.target.value='';void capture(slot.key,file);}}/>
              </label>}
            </div>
            {noteKey&&noteField&&<FieldControl field={noteField} value={values[noteKey]??''} onChange={v=>setValue(noteKey,v)} disabled={!editable||saving} lang={lang}/>}
          </div>;})}
        </div>
        {(()=>{const notes=inspectionSections.find(x=>x.id==='photographs')?.fields.find(f=>f.key==='other_notes');return notes?<FieldControl field={notes} value={values['other_notes']??''} onChange={v=>setValue('other_notes',v)} disabled={!editable||saving} lang={lang}/>:null;})()}
        <p className="text-xs text-muted-foreground">Missing required categories: {missingPhotos.length?missingPhotos.join(', '):'None'}. Photos are kept as an audit trail; retake adds a new version instead of deleting old evidence.</p>
      </CardContent>
    </Card></div>
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <AlertTriangle className="size-4 text-muted-foreground"/><p className="min-w-48 flex-1 text-xs text-muted-foreground">Autosave stores drafts after inactivity. Verify every measurement and the saved status before closing; Excel export is not a certified valuation.</p>
      {canManage&&<div className="w-full space-y-1"><Label htmlFor="inspection-correction-reason">Manager correction reason (mandatory; audited)</Label><Textarea id="inspection-correction-reason" value={managerReason} onChange={e=>setManagerReason(e.target.value)} placeholder="Why are you correcting the assigned officer's draft?"/></div>}
      <Button className="hidden md:inline-flex" variant="outline" disabled={!editable||saving||reportQuery.isLoading||!!reportQuery.error||(canManage&&managerReason.trim().length<10)} onClick={()=>void save(false)}><Save className="mr-1 size-4"/>Save draft</Button>
      <Button className="hidden md:inline-flex" disabled={!editable||!canSubmit||supplementPending||saving||reportQuery.isLoading||!!reportQuery.error||missing.length>0||missingPhotos.length>0||photos.isLoading||!!photos.error||(photos.data??[]).length<Math.max(8,currentVisit?.min_photos??8)} onClick={()=>void save(true)}><Send className="mr-1 size-4"/>Submit to Checker</Button>
    </div>
    <div className={`vp-mobile-save-bar fixed inset-x-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur md:hidden ${tenant.role==='Field Officer'?'bottom-[calc(4.5rem+env(safe-area-inset-bottom))]':'bottom-0'}`} aria-label="Mobile inspection save actions">
      <p className="mb-1.5 text-center text-xs font-medium text-muted-foreground" role="status" aria-live="polite">{saveStatus==='saving'||saveStatus==='verifying'?'Saving and verifying…':saveStatus==='error'?'Save failed — retry required':dirty?'Unsaved draft changes':saveStatus==='saved'?'Saved and verified':'Report draft'}</p>
      <div className="mx-auto flex max-w-lg gap-2">
        <Button className="min-h-12 flex-1" variant="outline" disabled={!editable||saving||reportQuery.isLoading||!!reportQuery.error||(canManage&&managerReason.trim().length<10)} onClick={()=>void save(false)}><Save className="mr-1 size-4"/>Save</Button>
        <Button className="min-h-12 flex-1" disabled={!editable||!canSubmit||supplementPending||saving||reportQuery.isLoading||!!reportQuery.error||missing.length>0||missingPhotos.length>0||photos.isLoading||!!photos.error||(photos.data??[]).length<Math.max(8,currentVisit?.min_photos??8)} onClick={()=>void save(true)}><Send className="mr-1 size-4"/>Submit to Checker</Button>
      </div>
    </div>
  </div>;
}
