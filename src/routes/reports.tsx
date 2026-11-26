import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQuery,useQueryClient } from '@tanstack/react-query';
import { FileSignature, Lock, Printer, Upload, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, PageHeader } from '@/components/app-shell';
import { EmptyRow } from '@/components/ops-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/app-context';
import { fmtINR } from '@/lib/data';
import { useVpBanks,useVpCases } from '@/lib/vp-cases';
import { vpDb } from '@/lib/vp-db';
import { attachVpReportPdf,prepareVpReport,recordVpValuer,releaseVpReport,reviewVpValuer,
  saveVpBankFormat,useVpReportFormats,useVpReportPermissions,useVpReportVersions,
  useVpValuationVersions,useVpValuerCredentials,viewVpReportPdf } from '@/lib/vp-reports';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/reports')({
  head: () => ({meta:[
    {title:'ValuationPro — Reports & Sign-off'},
    {name:'description',content:'Versioned valuation reports, bank format references and controlled release.'},
  ]}),component:ReportsPage,
});
const REPORT_STAGES=['Report Draft','Final QC','Approved','Delivered'];
const PRODUCT_TYPES=['House','Flat','Land','Commercial'];
function errorText(e:unknown) {return e instanceof Error?e.message:String(e);}

function ReportsPage(){
  const {tenant,tenantUsers,can}=useApp();
  const queryClient=useQueryClient();
  const cases=useVpCases();
  const banksQuery=useVpBanks();
  const formats=useVpReportFormats();
  const credentials=useVpValuerCredentials();
  const reportQuery=useVpReportVersions();
  const permsQuery=useVpReportPermissions();
  const self=useQuery({queryKey:['vp-my-report-identity',tenant.id],queryFn:async()=>{
    const {data,error}=await vpDb.rpc('vp_my_context');if(error)throw error;
    return data as {user_id:string;user_name:string};
  }});
  const list=useMemo(()=>cases.cases.filter(c=>REPORT_STAGES.includes(c.stage)),[cases.cases]);
  const [selId,setSelId]=useState<string|null>(null);
  const sel=list.find(c=>c.id===selId)??list[0];
  const caseVersions=useVpValuationVersions(sel?.caseNum??0);
  const reports=useMemo(()=> (reportQuery.data??[]).filter(r=>r.num===sel?.caseNum),[reportQuery.data,sel?.caseNum]);
  const currentReport=reports.find(r=>r.status==='Released')??reports[0];
  const calculation=currentReport?.calculations_snapshot??caseVersions.data?.[0]?.calculations;
  const perms=permsQuery.data;
  const myCredential=credentials.data?.find(c=>c.user_id===self.data?.user_id);
  const [busy,setBusy]=useState(false);
  // Format master input (never invent actual bank proforma or fees)
  const [bank,setBank]=useState(''); const [category,setCategory]=useState('House');
  const [formatName,setFormatName]=useState(''); const [formatNotes,setFormatNotes]=useState('');
  // Credentials are recorded by an admin and separately checked by another admin.
  const [userId,setUserId]=useState(''); const [regNo,setRegNo]=useState('');
  const [expires,setExpires]=useState(''); const [reviewNote,setReviewNote]=useState('');
  const banks=useMemo(()=> (banksQuery.data??[]).map(b=>b.name).sort(),[banksQuery.data]);
  const bankForSetup=bank||banks[0]||'';
  const selectedFormat=formats.data?.find(f=>f.bank_name===sel?.bank&&f.property_type===sel?.propertyType&&f.active);
  const isReleased=currentReport?.status==='Released';
  const loadError=cases.error??banksQuery.error??formats.error??credentials.error??reportQuery.error??permsQuery.error;

  async function refresh(){
    await Promise.all([
      queryClient.invalidateQueries({queryKey:['vp-report-versions',tenant.id]}),
      queryClient.invalidateQueries({queryKey:['vp-valuer-credentials',tenant.id]}),
      queryClient.invalidateQueries({queryKey:['vp-report-formats',tenant.id]}),
      queryClient.invalidateQueries({queryKey:['vp-live-cases',tenant.id]}),
    ]);
  }
  async function action(fn:()=>Promise<unknown>,msg:string){
    setBusy(true);
    try {await fn();await refresh();toast.success(msg);}
    catch(e){toast.error(errorText(e));}
    finally{setBusy(false);}
  }
  async function handleUpload(file:File|undefined){
    if(!file||!currentReport||currentReport.status!=='Draft')return;
    await action(()=>attachVpReportPdf(tenant.id,currentReport,file),'Private report PDF uploaded and registered');
  }
  async function saveFormat(){
    if(!bankForSetup || !formatName.trim()){ toast.error('Select a bank and enter a format reference'); return; }
    await action(()=>saveVpBankFormat(bankForSetup,category,formatName,formatNotes),'Bank report format reference saved');
  }
  return <AppShell>
    <div className="print:hidden">
    <PageHeader title="Reports & Sign-off" description="Prepare only QC-approved valuation versions; release an actual bank-format PDF through authorized valuer attestation." />
    {loadError&&<p className="mb-3 rounded-md border border-destructive/30 p-2 text-sm text-destructive">Database error: {errorText(loadError)}</p>}
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card className="border-border shadow-sm"><CardContent className="space-y-1.5 p-2">
        {(cases.isLoading||reportQuery.isLoading)&&<p className="p-3 text-sm text-muted-foreground">Loading reports…</p>}
        {!cases.isLoading && list.length===0&&<EmptyRow text="No reports in progress."/>}
        {list.map(c=>{
          const rpt=(reportQuery.data??[]).find(r=>r.num===c.caseNum);
          const fmt=formats.data?.find(f=>f.bank_name===c.bank&&f.property_type===c.propertyType);
          return <button key={c.id} onClick={()=>setSelId(c.id)} className={cn('w-full rounded-md border px-3 py-2 text-left',sel?.id===c.id?'border-primary bg-primary/5':'border-transparent hover:bg-muted')}>
            <div className="flex items-center justify-between"><span className="font-mono text-xs">{c.caseNo}</span><Badge variant={c.stage==='Delivered'?'secondary':'outline'} className="text-[10px]">{c.stage}</Badge></div>
            <div className="truncate text-sm font-medium">{c.property}</div>
            <div className="truncate text-xs text-muted-foreground">{rpt?.format_name??fmt?.format_name??'Bank format not configured'}</div>
          </button>;
        })}
      </CardContent></Card>
      <div className="space-y-4">
        {sel?<>
          <Card className="border-border shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-base">Valuation certificate preview</CardTitle>
              <Button size="sm" variant="outline" disabled={!isReleased} onClick={()=>window.print()}><Printer className="size-4"/>Print</Button>
            </CardHeader>
            <CardContent><div className="rounded-md border border-border bg-card p-6 text-sm">
              <div className="mb-4 flex justify-between border-b border-border pb-3">
                <div><p className="font-display text-lg font-bold">{tenant.name}</p><p className="text-xs text-muted-foreground">Format reference: {currentReport?.format_name??selectedFormat?.format_name??'Not configured'}</p></div>
                <div className="text-right text-xs"><p className="font-mono">{sel.caseNo}</p><p>To: {sel.bank}</p></div>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                <Row k="Property" v={sel.property}/><Row k="Type" v={sel.propertyType}/>
                <Row k="Location" v={sel.city}/><Row k="Assigned to" v={sel.assignedTo}/>
              </dl>
              {calculation?<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Val label="Fair Market Value" v={calculation.marketValue}/>
                <Val label="Realizable Value" v={calculation.realizableValue}/>
                <Val label="Distress Value" v={calculation.distressValue}/>
              </div>:<p className="mt-4 text-sm text-muted-foreground">No submitted valuation amounts. Open the case dossier to enter and submit actual property data.</p>}
              <div className="mt-5 border-t border-border pt-3 text-xs">
                {isReleased?<p className="font-medium text-success">Released {currentReport?.released_at} · registration {currentReport?.released_reg_no} (internal attestation, NOT a cryptographic signature)</p>
                  :<p className="text-muted-foreground">Preview only · {sel.stage==='Approved'?'Final QC approved, report release pending':'Awaiting Final QC approval'} · Not a signed certificate</p>}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">This screen is a generic internal preview. A true bank-specific deliverable must be uploaded separately as a PDF.</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-base">Report preparation & release</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{sel.stage}</Badge><Badge variant="outline">Valuation v{caseVersions.data?.[0]?.version_no??'—'}</Badge><Badge variant="outline">Report v{currentReport?.version_no??'—'}</Badge></div>
              {sel.stage==='Report Draft'&&<p>Open <Link to="/cases/$caseId" params={{caseId:sel.id}} className="underline">the case dossier</Link> to save and submit the valuation; then send it to Final QC from the QC screen.</p>}
              {!selectedFormat&&<p className="text-warning-foreground">An administrator must configure a real bank/property report format reference.</p>}
              {sel.stage==='Approved'&&perms?.prepare&&<Button disabled={busy||!selectedFormat||!caseVersions.data?.length} onClick={()=>void action(()=>prepareVpReport(sel.caseNum),'Versioned report prepared')}><FileSignature className="size-4"/>Prepare report version</Button>}
              {currentReport&&<div className="space-y-2 rounded-md border p-3">
                <div className="font-medium">Report v{currentReport.version_no} · {currentReport.status}</div>
                <p className="text-xs text-muted-foreground">Based on valuation v{currentReport.valuation_version_no} and {currentReport.format_name}</p>
                {currentReport.status==='Draft'&&perms?.prepare&&<label className="inline-flex cursor-pointer items-center gap-2 text-sm underline"><Upload className="size-4"/>Upload completed bank-format PDF (max 20 MB)<input type="file" accept="application/pdf,.pdf" className="sr-only" disabled={busy} onChange={e=>{const f=e.target.files?.[0];e.target.value='';void handleUpload(f);}}/></label>}
                {currentReport.file_path&&<Button size="sm" variant="outline" onClick={()=>void viewVpReportPdf(currentReport.file_path!).catch(e=>toast.error(errorText(e)))}>View uploaded PDF</Button>}
                {currentReport.status==='Draft'&&<Button disabled={busy||!perms?.release||!currentReport.file_path||!myCredential||myCredential.review_status!=='Checked'||myCredential.expires_on<new Date().toLocaleDateString('en-CA')}
                    onClick={()=>void action(()=>releaseVpReport(currentReport.id),'Report released with internal registered-valuer attestation')}>
                    {perms?.release?<FileSignature className="size-4"/>:<Lock className="size-4"/>} Release approved report
                  </Button>}
                {currentReport.status==='Draft'&&<p className="text-xs text-muted-foreground">Release requires signoff.Release in your role, your personally checked/unexpired registration, an independent Final QC reviewer and the uploaded PDF.</p>}
              </div>}
              {myCredential&&<p className="text-xs text-muted-foreground">Your recorded registration: {myCredential.reg_no} · {myCredential.review_status} · expires {myCredential.expires_on}</p>}
              {!myCredential&&<p className="text-xs text-muted-foreground">No registration recorded for this signed-in user. Administrator configuration is required before release.</p>}
              <p className="text-xs text-muted-foreground"><ShieldCheck className="mr-1 inline size-3"/>No electronic/digital signature is generated by this phase. Release is an internal workflow attestation only.</p>
            </CardContent>
          </Card>
        </>:<Card><EmptyRow text="No eligible cases for report preparation."/></Card>}
      </div>
    </div>
    {(perms?.manage||can('signoff.Manage Templates'))&&<Card className="mt-3 border-border shadow-sm"><CardHeader><CardTitle className="text-base">Report administration</CardTitle></CardHeader><CardContent className="grid gap-6 lg:grid-cols-2">
      {perms?.manage&&<section className="space-y-3"><h3 className="font-medium">Bank-specific format reference</h3>
        <p className="text-xs text-muted-foreground">Registers the approved format name only. Does not automatically generate a bank's official PDF template.</p>
        <div className="space-y-1"><Label>Bank</Label><Select value={bankForSetup} onValueChange={setBank}><SelectTrigger><SelectValue placeholder="Select a bank"/></SelectTrigger><SelectContent>{banks.map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Property type</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{PRODUCT_TYPES.map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Approved format reference</Label><Input value={formatName} onChange={e=>setFormatName(e.target.value)} placeholder="Enter actual client-approved format name"/></div>
        <div className="space-y-1"><Label>Instructions (optional)</Label><Textarea value={formatNotes} onChange={e=>setFormatNotes(e.target.value)} maxLength={2000}/></div>
        <Button disabled={busy||!bankForSetup||formatName.trim().length<3} onClick={()=>void saveFormat()}>Save format reference</Button>
        <div className="max-h-40 space-y-1 overflow-auto text-xs">{(formats.data??[]).map(f=><p key={`${f.bank_name}/${f.property_type}`}>{f.bank_name} · {f.property_type} · {f.format_name}</p>)}</div>
      </section>}
      {tenant.adminAccess&&<section className="space-y-3"><h3 className="font-medium">Valuer registration and internal review</h3>
        <p className="text-xs text-muted-foreground">Enter documentary registration details. A DIFFERENT administrator must review the evidence. This is not an automated IBBI registry check.</p>
        <div className="space-y-1"><Label>Agency user</Label><Select value={userId} onValueChange={setUserId}><SelectTrigger><SelectValue placeholder="Select a valuer"/></SelectTrigger><SelectContent>{tenantUsers.filter(u=>u.status==='Active').map(u=><SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Registration number</Label><Input value={regNo} onChange={e=>setRegNo(e.target.value)} placeholder="As per supporting evidence"/></div>
        <div className="space-y-1"><Label>Expiry date</Label><Input type="date" value={expires} onChange={e=>setExpires(e.target.value)}/></div>
        <Button disabled={busy||!userId||regNo.trim().length<5||!expires} onClick={()=>void action(()=>recordVpValuer(userId,regNo,expires),'Valuer registration recorded for separate review')}>Record / update registration</Button>
        <div className="space-y-1"><Label>Evidence checked — reviewer note (8+ characters)</Label><Input value={reviewNote} onChange={e=>setReviewNote(e.target.value)} placeholder="Record the evidence verified outside this application"/></div>
        <div className="max-h-48 space-y-2 overflow-auto text-xs">{(credentials.data??[]).map(cr=>{
          const u=tenantUsers.find(x=>x.id===cr.user_id);
          return <div key={cr.user_id} className="rounded border p-2">
            <p className="font-medium">{u?.name??cr.user_id} · {cr.reg_no} · {cr.review_status}</p><p>Expires {cr.expires_on}</p>
            {cr.review_status==='Pending'&&<div className="mt-1 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={busy||reviewNote.trim().length<8} onClick={()=>void action(()=>reviewVpValuer(cr.user_id,true,reviewNote),'Credential review recorded')}>Mark evidence checked</Button><Button size="sm" variant="outline" disabled={busy||reviewNote.trim().length<8} onClick={()=>void action(()=>reviewVpValuer(cr.user_id,false,reviewNote),'Credential rejected')}>Reject</Button></div>}
          </div>;
        })}</div>
      </section>}
    </CardContent></Card>}
    </div>
    {sel&&isReleased&&currentReport&&<div className="hidden print:block space-y-2 p-8 text-sm">
      <h2 className="text-xl font-semibold">Released valuation summary</h2>
      <p>{sel.caseNo} · {sel.bank} · {currentReport.format_name}</p>
      <p>{sel.property}</p>
      <p>Market value {fmtINR(currentReport.calculations_snapshot.marketValue)}</p>
      <p>Realizable {fmtINR(currentReport.calculations_snapshot.realizableValue)} · Distress {fmtINR(currentReport.calculations_snapshot.distressValue)}</p>
      <p>Released {currentReport.released_at} · Registration {currentReport.released_reg_no}. Internal attestation, not a digital signature. Refer to uploaded PDF for the bank-format report.</p>
    </div>}
  </AppShell>;
}
function Row({k,v}:{k:string;v:string}){
  return <div><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>;
}
function Val({label,v}:{label:string;v:number}){
  return <div className="rounded-md bg-muted p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="font-display text-lg font-bold">{fmtINR(v)}</p></div>;
}
