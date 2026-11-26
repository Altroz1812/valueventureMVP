import { VpFin04D2Field } from '@/components/vp-fin04d2-adjustments';
import { VpFin04CClaim } from '@/components/vp-fin04c-claims';
import { VpFin04BJourney } from '@/components/vp-fin04b-journeys';
import { VoiceMic, VoiceLanguage, VoiceOption, spokenNumber, type VoiceLang } from '@/components/voice/vp-voice';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { filterMobileVisits, scopedMobileVisits, type FieldMobileVisitFilter } from '@/lib/vp-p14-mobile';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, Camera, LogIn, LogOut, MapPin, Plus, Receipt, Route as RouteIcon, FilePenLine, ClipboardCheck, ClipboardList, CalendarDays, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, PageHeader } from '@/components/app-shell';
import { StatCard } from '@/components/ops-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { type VpCase, useVpCases } from '@/lib/vp-cases';
import { getDevicePosition, openFieldPhoto, uploadFieldPhoto,
  type FieldVisit, useVpFieldPhotos, useVpFieldVisits, useVpVisitCosts } from '@/lib/vp-field';

export const Route=createFileRoute('/field-operations')({
  validateSearch: (search: Record<string, unknown>) => ({ view: search['view'] === 'reports' ? 'reports' as const : 'visits' as const }),
  head:()=>({meta:[
    {title:'ValuationPro — Field Operations'},
    {name:'description',content:'Site inspection scheduling, GPS audit capture and actual photo evidence.'},
  ]}),component:FieldPage,
});
const localDate=()=>{
  const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const err=(e:unknown)=>e instanceof Error?e.message:String(e);
const formatTime=(s:string)=>new Date(s).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});
const localDateTimeInput=(iso:string)=>{
  const d=new Date(iso);const p=(n:number)=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

function FieldPage(){
  const {tenant,branch,tenantUsers,can}=useApp();
  const {view:mobileView}=Route.useSearch();
  const [visitFilter,setVisitFilter]=useState<FieldMobileVisitFilter>('all');
  const client=useQueryClient();
  const {allCases,isLoading:casesLoading,error:caseError}=useVpCases();
  const {data:visits=[],isLoading:visitsLoading,error:visitError}=useVpFieldVisits();
  const {data:myUserId,isLoading:identityLoading,error:identityError}=useQuery({queryKey:['vp-field-self',tenant.id],
    queryFn:async()=>{const {data,error}=await vpDb.rpc('vp_field_my_user_id');if(error) throw error;return String(data);}});
  const {data:canAssign=false}=useQuery({queryKey:['vp-field-assign-perm',tenant.id,tenant.role,can('field.Assign')],
    queryFn:async()=>{
      // No tenant.admin bypass: the operational role matrix is authoritative.
      return can('field.Assign');
    }});
  const [schedule,setSchedule]=useState<{visit:FieldVisit|null;caseNum:number|null}|null>(null);
  const [details,setDetails]=useState<FieldVisit|null>(null);
  const [selfSchedule,setSelfSchedule]=useState<FieldVisit|null>(null);
  const [busyId,setBusyId]=useState<string|null>(null);
  const caseMap=useMemo(()=>new Map(allCases.map(c=>[c.caseNum,c])),[allCases]);
  const rows=visits.map(v=>({v,c:caseMap.get(v.num)})).filter(x=>x.c&&
    (branch==='all'||x.c.branchId===branch)) as {v:FieldVisit;c:VpCase}[];
  const activeRows=rows.filter(x=>x.v.status!=='Cancelled');
  const mobileRows=scopedMobileVisits(visits,allCases,myUserId,canAssign,branch);
  const filteredMobileRows=mobileView==='reports'?mobileRows:filterMobileVisits(mobileRows,visitFilter);
  const mobileCounts={
    scheduled:mobileRows.filter(x=>x.v.status==='Scheduled').length,
    onsite:mobileRows.filter(x=>x.v.status==='On site').length,
    completed:mobileRows.filter(x=>x.v.status==='Completed').length,
  };
  const checkinCount=activeRows.filter(x=>x.v.checkin_at!==null).length;
  const shortfall=activeRows.filter(x=>x.v.status==='On site'&&x.v.photo_count<x.v.min_photos).length;
  const reload=async()=>{
    await Promise.all([
      client.invalidateQueries({queryKey:['vp-field-visits',tenant.id]}),
      client.invalidateQueries({queryKey:['vp-live-cases',tenant.id]}),
    ]);
  };
  async function runGps(v:FieldVisit,kind:'checkin'|'checkout'){
    setBusyId(v.id);
    try {
      const p=await getDevicePosition();
      const {error}=await vpDb.rpc(kind==='checkin'?'vp_field_checkin':'vp_field_checkout',{
        p_visit_id:v.id,p_lat:p.lat,p_lng:p.lng,p_accuracy_m:p.accuracy,
      });
      if(error) throw error;
      await reload();
      toast.success(`${kind==='checkin'?'Checked in':'Visit completed'} — GPS recorded (±${Math.round(p.accuracy)} m)`);
    } catch(e){toast.error(err(e));}
    finally {setBusyId(null);}
  }
  async function cancel(v:FieldVisit){
    if(!window.confirm('Cancel this scheduled visit?')) return;
    setBusyId(v.id);
    try {const {error}=await vpDb.rpc('vp_field_cancel',{p_visit_id:v.id});if(error) throw error;
      await reload();toast.success('Visit cancelled');} catch(e){toast.error(err(e));}
    finally {setBusyId(null);}
  }
  return <AppShell>
    <VpFin04BJourney />
    <VpFin04CClaim />
    <VpFin04D2Field />
    <div className="hidden md:block">
      <PageHeader title="Field Operations" description="Site inspections, GPS attendance records and photo evidence.">
        {canAssign&&<Button onClick={()=>setSchedule({visit:null,caseNum:null})}><Plus className="size-4"/> Schedule visit</Button>}
      </PageHeader>
      {(visitError||caseError)&&<p role="alert" className="mb-4 rounded-md border border-destructive p-3 text-sm text-destructive">
        Could not load field data: {err(visitError??caseError)}
      </p>}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Scheduled visits" value={activeRows.filter(x=>x.v.status==='Scheduled').length} icon={<MapPin className="size-4"/>}/>
        <StatCard label="Checked in" value={checkinCount} icon={<LogIn className="size-4"/>}/>
        <StatCard label="Completed visits" value={activeRows.filter(x=>x.v.status==='Completed').length} icon={<LogOut className="size-4"/>}/>
        <StatCard label="Photo shortfall" value={shortfall} icon={<Camera className="size-4"/>}/>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        GPS coordinates, device-reported accuracy and time are recorded for attendance audit. No distance or GPS accuracy threshold blocks check-in; GPS alone does not independently prove physical presence.
      </p>
    </div>
    <section className="space-y-4 md:hidden" aria-label="Mobile field officer workspace">
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary-foreground/70">Field workspace</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div><h1 className="font-display text-2xl font-bold">{mobileView==='reports'?'My Reports':canAssign?'Field Visits':'My Field Visits'}</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">{mobileRows.length} active assigned visit{mobileRows.length===1?'':'s'}</p></div>
          <div className="rounded-xl bg-white/15 p-3"><ClipboardList className="size-6"/></div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/10 p-2.5"><span className="block text-xl font-bold">{mobileCounts.scheduled}</span><span className="text-[10px] text-primary-foreground/75">Scheduled</span></div>
          <div className="rounded-xl bg-white/10 p-2.5"><span className="block text-xl font-bold">{mobileCounts.onsite}</span><span className="text-[10px] text-primary-foreground/75">On site</span></div>
          <div className="rounded-xl bg-white/10 p-2.5"><span className="block text-xl font-bold">{mobileCounts.completed}</span><span className="text-[10px] text-primary-foreground/75">Completed</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-1">
        <Link to="/field-operations" search={{view:'visits'}} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${mobileView==='visits'?'bg-card text-foreground shadow-sm':'text-muted-foreground'}`}><CalendarDays className="size-4"/>Visits</Link>
        <Link to="/field-operations" search={{view:'reports'}} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${mobileView==='reports'?'bg-card text-foreground shadow-sm':'text-muted-foreground'}`}><FilePenLine className="size-4"/>Reports</Link>
      </div>
      {mobileView==='visits'&&<div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter visits by status">
        {([['all','All'],['scheduled','Scheduled'],['onsite','On site'],['completed','Completed']] as const).map(([id,label])=><button type="button" aria-pressed={visitFilter===id} onClick={()=>setVisitFilter(id)} key={id} className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-semibold ${visitFilter===id?'border-primary bg-primary text-primary-foreground':'border-border bg-card text-muted-foreground'}`}>{label}</button>)}
      </div>}
      {canAssign&&<Button className="min-h-12 w-full" onClick={()=>setSchedule({visit:null,caseNum:null})}><Plus className="mr-2 size-4"/>Schedule / Assign visit</Button>}
      {visitError&&<p role="alert" className="rounded-xl border border-destructive p-3 text-sm text-destructive">Could not load assigned visits: {err(visitError)}</p>}
      {caseError&&<p className="rounded-xl border p-3 text-xs text-muted-foreground">Some case details could not load. Assigned visit actions remain available subject to permission checks.</p>}
      {(visitsLoading||identityLoading)&&<p role="status" className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">Loading assigned visits…</p>}
      {identityError&&<p role="alert" className="rounded-xl border border-destructive p-3 text-sm text-destructive">Field Officer identity could not be loaded: {err(identityError)}</p>}
      {filteredMobileRows.map(({v,c})=>{
        const own=myUserId!=null&&String(v.assigned_user_id)===String(myUserId);
        const officer=tenantUsers.find(u=>u.id===v.assigned_user_id)?.name??'Assigned officer';
        const photoTarget=Math.max(1,v.min_photos);
        const photoPercent=Math.min(100,100*v.photo_count/photoTarget);
        return <Card key={v.id} className="vp-native-case-card overflow-hidden rounded-2xl border-border bg-card"><CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{c?.caseNo??`Case #${v.num}`} · Visit #{v.id}</p>
              <h2 className="mt-1 break-words font-display text-base font-bold leading-snug">{c?.property??'Assigned property visit'}</h2>
              {c?.customer&&<p className="mt-1 truncate text-xs text-muted-foreground">{c.customer}</p>}
            </div>
            <Badge variant={v.status==='Completed'?'secondary':'outline'} className="shrink-0 rounded-full px-2.5 py-1 text-[11px]">{v.status==='On site'?'On site':v.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/60 p-3"><p className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground"><CalendarClock className="size-3"/> Visit schedule</p><p className="text-xs font-semibold leading-5">{formatTime(v.scheduled_at)}</p></div>
            <div className="rounded-xl bg-muted/60 p-3"><p className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="size-3"/> GPS check-in</p><p className="text-xs font-semibold leading-5">{v.checkin_at?'Recorded':'Not checked in'}</p></div>
          </div>
          <div><div className="mb-1.5 flex justify-between text-xs"><span className="flex items-center gap-1 text-muted-foreground"><Camera className="size-3.5"/> Actual photographs</span><strong>{v.photo_count} / {photoTarget}</strong></div>
            <Progress className="h-2" value={photoPercent}/></div>
          {canAssign&&!own&&<p className="text-xs text-muted-foreground">Officer: {officer}</p>}
          {mobileView==='reports'&&<div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0"/><span>Complete the Excel-aligned inspection, verify real evidence and submit when permitted. Submission state is checked inside the report.</span></div>}
          <Button asChild className="min-h-12 w-full rounded-xl text-sm font-semibold"><Link to="/field-inspections/$visitId" params={{visitId:String(v.id)}}><FilePenLine className="mr-2 size-4"/>{mobileView==='reports'?'Open Full Report':'Prepare / Continue Report'}<ChevronRight className="ml-auto size-4"/></Link></Button>
          <div className="grid grid-cols-2 gap-2">
            {own&&v.status==='Scheduled'&&<Button variant="outline" className="min-h-12 rounded-xl" onClick={()=>setSelfSchedule(v)}><CalendarClock className="mr-1 size-4"/>Schedule</Button>}
            {own&&v.status==='Scheduled'&&<Button variant="outline" className="min-h-12 rounded-xl" disabled={busyId===v.id} onClick={()=>void runGps(v,'checkin')}><LogIn className="mr-1 size-4"/>GPS check-in</Button>}
            {own&&v.status==='On site'&&<Button variant="outline" className="min-h-12 rounded-xl" disabled={busyId===v.id} onClick={()=>void runGps(v,'checkout')}><LogOut className="mr-1 size-4"/>GPS check-out</Button>}
            {v.status!=='Cancelled'&&<Button variant="outline" className="min-h-12 rounded-xl" onClick={()=>setDetails(v)}><Camera className="mr-1 size-4"/>Photos / Costs</Button>}
            {canAssign&&v.status==='Scheduled'&&!own&&<Button variant="outline" className="min-h-12 rounded-xl" onClick={()=>setSchedule({visit:v,caseNum:v.num})}><ClipboardCheck className="mr-1 size-4"/>Reassign</Button>}
          </div>
        </CardContent></Card>;
      })}
      {!visitsLoading&&!identityLoading&&!identityError&&!visitError&&filteredMobileRows.length===0&&<div className="rounded-2xl border border-dashed bg-card p-7 text-center">
        <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground"/>
        <p className="font-semibold">{mobileView==='reports'?'No reports available':'No visits in this view'}</p>
        <p className="mt-1 text-sm text-muted-foreground">{canAssign?'Schedule or assign a case to begin.':'Assigned cases will appear here once QC schedules a visit.'}</p>
      </div>}
    </section>
    <Card className="hidden md:block border-border shadow-sm"><CardContent className="p-0"><Table>
      <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Case / Property</TableHead>
        <TableHead>Officer</TableHead><TableHead>GPS attendance</TableHead><TableHead>Reported accuracy</TableHead>
        <TableHead className="w-44">Photos</TableHead><TableHead>Status</TableHead><TableHead/></TableRow></TableHeader>
      <TableBody>
        {rows.map(({v,c})=>{
          const officer=tenantUsers.find(u=>u.id===v.assigned_user_id)?.name??'Assigned officer';
          const checked=v.status==='Completed'||v.status==='On site';
          const accuracy=v.checkout_accuracy_m??v.checkin_accuracy_m;
                    const canOperate=myUserId != null && String(myUserId)===String(v.assigned_user_id);
          return <TableRow key={v.id}>
            <TableCell className="whitespace-nowrap text-xs">{formatTime(v.scheduled_at)}</TableCell>
            <TableCell><Link to="/cases/$caseId" params={{caseId:String(c.caseNum)}} className="font-mono text-xs text-muted-foreground hover:underline">{c.caseNo}</Link>
              <div className="font-medium">{c.property}</div></TableCell>
            <TableCell>{officer}</TableCell>
            <TableCell><Badge variant="outline">{checked?'GPS recorded':'Awaiting check-in'}</Badge></TableCell>
            <TableCell>{accuracy===null?'—':`±${Math.round(accuracy)} m`}</TableCell>
            <TableCell><div className="flex items-center gap-2"><Progress value={Math.min(100,100*v.photo_count/v.min_photos)} className="h-2"/>
              <span className="text-xs">{v.photo_count}/{v.min_photos}</span></div></TableCell>
            <TableCell><Badge variant={v.status==='Completed'?'secondary':'outline'}>{v.status}</Badge></TableCell>
            <TableCell className="whitespace-nowrap"><div className="flex flex-wrap gap-1">
              {v.status==='Scheduled'&&canOperate&&<Button size="sm" variant="outline" disabled={busyId===v.id} onClick={()=>void runGps(v,'checkin')}><LogIn className="size-3.5"/>Check in</Button>}
              {v.status==='On site'&&canOperate&&<Button size="sm" variant="outline" disabled={busyId===v.id} onClick={()=>void runGps(v,'checkout')}><LogOut className="size-3.5"/>Check out</Button>}
              {canOperate&&v.status==='Scheduled'&&<Button size="sm" variant="outline" onClick={()=>setSelfSchedule(v)}><CalendarClock className="size-3.5"/> Schedule my visit</Button>}
              {canAssign&&v.status==='Scheduled'&&<Button size="sm" variant="ghost" onClick={()=>setSchedule({visit:v,caseNum:v.num})}><CalendarClock className="size-3.5"/> Reschedule</Button>}
              {v.status!=='Cancelled'&&<Button size="sm" variant="ghost" onClick={()=>setDetails(v)}><Camera className="size-3.5"/> Details</Button>}
              {v.status!=='Cancelled'&&<Button asChild size="sm" variant="outline"><Link to="/field-inspections/$visitId" params={{visitId:String(v.id)}}>Valuation Report (Excel 1–9)</Link></Button>}
              {canAssign&&v.status==='Scheduled'&&<Button size="sm" variant="ghost" disabled={busyId===v.id} onClick={()=>void cancel(v)}>Cancel</Button>}
            </div></TableCell>
          </TableRow>;
        })}
        {(visitsLoading||casesLoading)&&<TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">Loading field visits…</TableCell></TableRow>}
        {!visitsLoading&&!casesLoading&&rows.length===0&&<TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
          No site visits. {canAssign?'Use Schedule visit to assign a real case.':'Your administrator can schedule a visit.'}</TableCell></TableRow>}
      </TableBody>
    </Table></CardContent></Card>
    {schedule&&<ScheduleDialog key={`${schedule.visit?.id??'new'}-${schedule.caseNum??'none'}`} data={schedule} cases={allCases}
      onClose={()=>setSchedule(null)} onSaved={async()=>{await reload();setSchedule(null);}}/>}
    {details&&<VisitDetails key={details.id} visit={visits.find(v=>v.id===details.id)??details}
      onClose={()=>setDetails(null)} canOperate={myUserId != null && String(myUserId)===String(details.assigned_user_id)}
      onChanged={reload}/>}
    {selfSchedule&&<SelfScheduleDialog key={selfSchedule.id} visit={selfSchedule} onClose={()=>setSelfSchedule(null)}
      onSaved={async()=>{await reload();setSelfSchedule(null);}}/>}
  </AppShell>;
}

function SelfScheduleDialog({visit,onClose,onSaved}:{visit:FieldVisit;onClose:()=>void;onSaved:()=>Promise<void>}){
  const [scheduled,setScheduled]=useState(localDateTimeInput(visit.scheduled_at));
  const [busy,setBusy]=useState(false);
  async function save(){
    const when=new Date(scheduled);
    if(Number.isNaN(when.getTime())){toast.error('Select a valid visit date/time');return;}
    setBusy(true);
    try{
      const {error}=await vpDb.rpc('vp_p9_field_self_reschedule',{
        p_visit_id:visit.id,p_scheduled_at:when.toISOString(),
      });if(error)throw error;
      await onSaved();toast.success('Visit rescheduled; original assignment unchanged');
    }catch(e){toast.error(err(e));}finally{setBusy(false);}
  }
  return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="w-[calc(100vw-1.5rem)] max-w-lg">
    <DialogHeader><DialogTitle>Schedule my site visit</DialogTitle></DialogHeader>
    <p className="text-sm text-muted-foreground">Update the visit time for your assigned case. Only QC/dispatch can change the assigned officer.</p>
    <Label htmlFor="p9-self-date">Date and time</Label>
    <Input id="p9-self-date" type="datetime-local" className="min-h-11" value={scheduled} onChange={e=>setScheduled(e.target.value)}/>
    <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={busy} onClick={()=>void save()}>{busy?'Saving…':'Save schedule'}</Button></DialogFooter>
  </DialogContent></Dialog>;
}

function ScheduleDialog({data,cases,onClose,onSaved}:{
  data:{visit:FieldVisit|null;caseNum:number|null};cases:VpCase[];
  onClose:()=>void;onSaved:()=>Promise<void>;
}){
  const {tenantUsers}=useApp();
  const v=data.visit;
  const [caseNum,setCaseNum]=useState(data.caseNum?String(data.caseNum):'');
  const [officer,setOfficer]=useState(v?.assigned_user_id??'');
  const [scheduled,setScheduled]=useState(v?localDateTimeInput(v.scheduled_at):'');
  const [minPhotos,setMinPhotos]=useState(v?String(v.min_photos):'');
  const [saving,setSaving]=useState(false);
  const [voiceLang,setVoiceLang]=useState<VoiceLang>('en-IN');
  async function submit(){
    if(!caseNum||!officer||!scheduled||!minPhotos){toast.error('Case, officer, schedule and minimum photos are required');return;}
    setSaving(true);
    try {
      const when=new Date(scheduled);
      if(Number.isNaN(when.getTime())) throw new Error('Invalid schedule date and time');
      const {error}=await vpDb.rpc('vp_field_schedule',{
        p_visit_id:v?.id??null,p_case_num:Number(caseNum),p_assigned_user_id:officer,
        p_scheduled_at:when.toISOString(),p_min_photos:Number(minPhotos),
        // Retain any historical property pin on rescheduling. It is no longer
        // configured in the UI and the GPS-only RPC never enforces its limits.
        p_target_lat:v?.target_lat??null,p_target_lng:v?.target_lng??null,
        p_radius_m:v?.radius_m??null,p_max_accuracy_m:v?.max_accuracy_m??null,
      });
      if(error) throw error;
      await onSaved();toast.success(v?'Visit rescheduled':'Visit scheduled');
    }catch(e){toast.error(err(e));}finally{setSaving(false);}
  }
  return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
    <DialogHeader><DialogTitle>{v?'Reschedule visit':'Schedule site visit'}</DialogTitle></DialogHeader>
    <VoiceLanguage value={voiceLang} onChange={setVoiceLang}/>
    <div className="grid gap-3">
      <div><Label>Case</Label><Select value={caseNum} onValueChange={setCaseNum} disabled={!!v}>
        <SelectTrigger><SelectValue placeholder="Select case"/></SelectTrigger><SelectContent>
          {cases.filter(c=>!['Approved','Submitted','Invoiced','Delivered'].includes(c.stage)).map(c=><SelectItem key={c.id} value={String(c.caseNum)}>{c.caseNo} · {c.customer}</SelectItem>)}
        </SelectContent></Select><VoiceOption label="Case" lang={voiceLang} options={cases.map(c=>c.caseNo)} onSelect={name=>{const chosen=cases.find(c=>c.caseNo===name);if(chosen&&!v)setCaseNum(String(chosen.caseNum));}} disabled={!!v}/></div>
      <div><Label>Assigned field officer</Label><Select value={officer} onValueChange={setOfficer}>
        <SelectTrigger><SelectValue placeholder="Select active user"/></SelectTrigger><SelectContent>
          {tenantUsers.filter(u=>u.status==='Active').map(u=><SelectItem key={u.id} value={u.id}>{u.name} · {u.role}</SelectItem>)}
        </SelectContent></Select><VoiceOption label="Assigned field officer" lang={voiceLang} options={tenantUsers.filter(u=>u.status==='Active').map(u=>u.name)} onSelect={name=>{const chosen=tenantUsers.find(u=>u.name===name);if(chosen)setOfficer(chosen.id);}}/></div>
      <div><Label htmlFor="visit-time">Scheduled date and time</Label>
        <div className="flex gap-2"><Input id="visit-time" type="datetime-local" value={scheduled} onChange={e=>setScheduled(e.target.value)}/><VoiceMic lang={voiceLang} label="Schedule date and time" onTranscript={v=>{const d=new Date(v);if(Number.isNaN(d.getTime()))toast.error('Could not parse date/time; use picker');else setScheduled(localDateTimeInput(d.toISOString()));}}/></div></div>
      <div><Label htmlFor="min-photo">Required site photographs</Label>
        <div className="flex gap-2"><Input id="min-photo" type="number" min="1" max="100" placeholder="Set by agency SOP" value={minPhotos} onChange={e=>setMinPhotos(e.target.value)}/><VoiceMic lang={voiceLang} label="Minimum photographs" onTranscript={spoken=>{const n=spokenNumber(spoken);if(n)setMinPhotos(n);else toast.error('Enter number manually');}}/></div></div>
      <p className="text-xs text-muted-foreground">GPS coordinates and reported accuracy are captured automatically at check-in and check-out. No geofence is configured or enforced.</p>
    </div>
    <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button disabled={saving} onClick={()=>void submit()}>{saving?'Saving…':'Save visit'}</Button></DialogFooter>
  </DialogContent></Dialog>;
}

function VisitDetails({visit,onClose,canOperate,onChanged}:{
  visit:FieldVisit;onClose:()=>void;canOperate:boolean;onChanged:()=>Promise<void>;
}){
  const {tenant}=useApp();
  const client=useQueryClient();
  const {data:photos=[],isLoading:photoLoading,error:photoError}=useVpFieldPhotos(visit.id);
  const {data:costs,error:costError}=useVpVisitCosts(visit.id);
  const {data:inspectionAccess}=useQuery({
    queryKey:['vp-p0-inspection-access',tenant.id,visit.id],
    queryFn:async()=>{const {data,error}=await vpDb.rpc('vp_p0_inspection_access',{p_visit_id:visit.id});if(error)throw error;return data as {can_capture:boolean};},
    retry:false,
  });
  const photoEditable=canOperate&&inspectionAccess?.can_capture===true;
  const [busy,setBusy]=useState(false);
  const [date,setDate]=useState(localDate());
  const [visitVoiceLang,setVisitVoiceLang]=useState<VoiceLang>('en-IN');
  const [photoCategory,setPhotoCategory]=useState('Road');
  const [km,setKm]=useState('');
  const [category,setCategory]=useState('Petrol');
  const [amount,setAmount]=useState('');
  const canWrite=canOperate&&(visit.status==='On site'||visit.status==='Completed');
  const invalidate=async()=>{
    await Promise.all([
      client.invalidateQueries({queryKey:['vp-field-photos',tenant.id,visit.id]}),
      client.invalidateQueries({queryKey:['vp-field-costs',tenant.id,visit.id]}),
    ]);
    await onChanged();
  };
  async function upload(files:FileList|null){
    if(!files?.length||!photoEditable) return;
    setBusy(true);
    try {
      for(const f of Array.from(files)) {const safe=photoCategory.toLowerCase().replace(/[^a-z0-9]+/g,'-');const tagged=new File([f],`${safe}__${f.name}`,{type:f.type,lastModified:f.lastModified});await uploadFieldPhoto(tenant.id,visit,tagged);}
      await invalidate();toast.success(`${files.length} actual photograph(s) registered`);
    }catch(e){toast.error(err(e));}finally{setBusy(false);}
  }
  async function addExpense(){
    setBusy(true);try{
      const {error}=await vpDb.rpc('vp_field_add_expense',{
        p_visit_id:visit.id,p_day:date,p_category:category,p_amount:Number(amount),
      });if(error) throw error;
      await invalidate();setAmount('');toast.success('Expense recorded');
    }catch(e){toast.error(err(e));}finally{setBusy(false);}
  }
  async function addTravel(){
    setBusy(true);try{
      const {error}=await vpDb.rpc('vp_field_record_travel',{
        p_visit_id:visit.id,p_day:date,p_km:Number(km),
      });if(error) throw error;
      await invalidate();setKm('');toast.success('Travel recorded in the existing daily trip total');
    }catch(e){toast.error(err(e));}finally{setBusy(false);}
  }
  return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
    <DialogHeader><DialogTitle>Site visit #{visit.id} · Field evidence & expenses</DialogTitle></DialogHeader>
    <Button asChild variant="outline" size="sm"><Link to="/field-inspections/$visitId" params={{visitId:visit.id}}>Open full site inspection form</Link></Button>
    <VoiceLanguage value={visitVoiceLang} onChange={setVisitVoiceLang}/>
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-2 rounded-md border p-3 text-xs">
        <div>Status: <strong>{visit.status}</strong></div>
        <div>GPS attendance: <strong>{visit.checkin_at?'Recorded':'Awaiting check-in'}</strong></div>
        <div>Check-in: {visit.checkin_at?formatTime(visit.checkin_at):'—'}</div>
        <div>Check-out: {visit.checkout_at?formatTime(visit.checkout_at):'—'}</div>
      </div>
      <div className="space-y-2"><h3 className="font-medium"><Camera className="mr-1 inline size-4"/> Site photographs ({photos.length}/{visit.min_photos})</h3>
        {photoError&&<p className="text-destructive">{err(photoError)}</p>}
        {photoLoading?<p>Loading evidence…</p>:photos.length===0?<p className="text-muted-foreground">No photographs uploaded yet.</p>:
          <div className="max-h-36 space-y-1 overflow-y-auto">{photos.map(p=><button key={p.id} className="block w-full truncate rounded border px-2 py-1 text-left hover:bg-muted" onClick={()=>void openFieldPhoto(p.storage_path).catch(e=>toast.error(err(e)))}>{p.name} · {Math.round(p.size/1024)} KB</button>)}</div>}
        {photoEditable&&visit.status==='On site'&&<div><Label>Photograph category</Label><div className="flex gap-2"><Select value={photoCategory} onValueChange={setPhotoCategory}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{['Road','Address','Front elevation','Side elevation','Internal 1','Internal 2','Kitchen','Bills verified','Selfie customer','Dishaank','Compass','Other'].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select><VoiceOption label="Photo category" options={['Road','Address','Front elevation','Side elevation','Internal 1','Internal 2','Kitchen','Bills verified','Selfie customer','Dishaank','Compass','Other']} lang={visitVoiceLang} onSelect={setPhotoCategory}/></div><Label htmlFor="evidence-photo">Upload actual site photographs</Label>
          <Input id="evidence-photo" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{void upload(e.target.files);e.target.value='';}}/>
          <p className="text-xs text-muted-foreground">JPEG, PNG or WebP; max 10 MB each. Files are private and tied to this visit.</p></div>}
      </div>
      <div className="space-y-2 border-t pt-3"><h3 className="font-medium"><RouteIcon className="mr-1 inline size-4"/> Travel</h3>
        <p className="text-muted-foreground">{costs?.travel?`${costs.travel.km} km on ${costs.travel.day} (already added to daily trips)`:'No travel reported.'}</p>
        {canWrite&&!costs?.travel&&<div className="flex flex-wrap gap-2"><Input type="date" className="w-36" value={date} max={localDate()} onChange={e=>setDate(e.target.value)}/><VoiceMic lang={visitVoiceLang} label="Travel / expense date" onTranscript={spoken=>{const d=new Date(spoken);if(Number.isNaN(d.getTime()))toast.error('Cannot parse date; use picker');else setDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);}}/>
          <Input type="number" className="w-28" placeholder="Kilometres" min="0.1" step="0.1" value={km} onChange={e=>setKm(e.target.value)}/><VoiceMic lang={visitVoiceLang} label="Travel kilometres" onTranscript={spoken=>{const n=spokenNumber(spoken);if(n!==null)setKm(n);else toast.error('Enter kilometres manually');}}/>
          <Button variant="outline" disabled={busy||Number(km)<=0} onClick={()=>void addTravel()}>Add km</Button></div>}
      </div>
      <div className="space-y-2 border-t pt-3"><h3 className="font-medium"><Receipt className="mr-1 inline size-4"/> Expenses</h3>
        {costError&&<p className="text-destructive">{err(costError)}</p>}
        {costs?.expenses.length?costs.expenses.map(e=><div className="flex justify-between text-xs" key={e.id}><span>{e.day} · {e.cat}</span><strong>₹{e.amt.toFixed(2)}</strong></div>):<p className="text-muted-foreground">No expenses recorded.</p>}
        {canWrite&&<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
            {['Petrol','Food','Toll','Parking','Other'].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}
          </SelectContent></Select><VoiceOption label="Expense category" lang={visitVoiceLang} options={['Petrol','Food','Toll','Parking','Other']} onSelect={setCategory}/>
          <div className="flex gap-1"><Input type="number" placeholder="Amount ₹" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/><VoiceMic lang={visitVoiceLang} label="Expense amount" onTranscript={spoken=>{const n=spokenNumber(spoken);if(n!==null)setAmount(n);else toast.error('Enter amount manually');}}/></div>
          <Button variant="outline" className="sm:col-span-2" disabled={busy||Number(amount)<=0} onClick={()=>void addExpense()}>Add expense</Button>
        </div>}
      </div>
    </div>
    <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
  </DialogContent></Dialog>;
}
