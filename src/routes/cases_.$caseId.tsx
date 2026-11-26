import { parseReleaseArtifactReadback } from '@/lib/vp-report-history';
import { reportInspectionReference, reportAmount, validAnnexPhoto, validAnnexImage } from '@/lib/vp-report-history';
import { buildBankMappingReadback, compareBankCell, type BankMappedCell, type BankCellResult } from '@/lib/vp-report-history';
import { checkReportSnapshots, reportIdentifier, validReportPdfPath, hasPdfHeader, type ReportReadbackCheck } from '@/lib/vp-report-history';
import { caseReportHistory, releasedHistory, chooseReleasedReport, reportVersion, reportProvenance } from '@/lib/vp-report-history';
import { VpOfficialValuation, useVpOfficialSummary } from '@/components/cases/vp-official-valuation';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect,useMemo,useRef,useState } from 'react';
import { useQuery,useQueryClient } from '@tanstack/react-query';
import { ArrowLeft,Calculator,Printer } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell,PageHeader } from '@/components/app-shell';
import { TatBadge } from '@/components/ops-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs,TabsContent,TabsList,TabsTrigger } from '@/components/ui/tabs';
import { fmtINR } from '@/lib/data';
import { CaseContext } from '@/components/cases/vp-case-context';
import { ValueGraphic } from '@/components/cases/vp-value-graphic';
import { VpIcon } from '@/components/workspace/vp-icon';
import type { CaseSection } from '@/lib/vp-workbench';
import { CaseProgress } from '@/components/cases/vp-case-progress';
import { mayOpenPath } from '@/lib/vp-p10-permissions';
import { useApp } from '@/lib/app-context';
import { uploadVpCaseDocument,useVpCases,useVpCaseDocuments } from '@/lib/vp-cases';
import { computeValuation,rupeesInWords,type ValuationInput } from '@/lib/valuation';
import { CaseProperty } from '@/components/properties/vp-case-property';
import { VpCaseLinkedRecords } from '@/components/cases/vp-case-linked-records';
import { VpDocumentWorkbench } from '@/components/documents/vp-document-workbench';
import { VALUATION_KEYS,saveVpValuation,useVpReportPermissions,useVpValuationForm,useVpValuationVersions,useVpReportVersions,viewVpReportPdf } from '@/lib/vp-reports';
import { VpInspectionValuationReview, type PendingInspectionTransfer } from '@/components/cases/vp-inspection-valuation-review';
import { VpP20Report } from '@/components/cases/vp-p20-report';
import { P19Analysis } from '@/components/cases/vp-p19-analysis';
import { vpDb } from '@/lib/vp-db';

export const Route=createFileRoute('/cases_/$caseId')({
  head:()=>({meta:[{title:'Case Dossier — ValuationPro'},
    {name:'description',content:'Authenticated property case dossier.'}]}),
  component:CaseDossier,
});
const fields:{key:keyof ValuationInput;label:string}[]=[
  {key:'landAreaSqYd',label:'Land area (sq.yd)'},
  {key:'landRate',label:'Market land rate (₹/sq.yd)'},
  {key:'guidelineRate',label:'Guideline rate (₹/sq.yd)'},
  {key:'builtUpSqFt',label:'Built-up area (sq.ft)'},
  {key:'constructionRate',label:'Construction rate (₹/sq.ft)'},
  {key:'ageYears',label:'Building age (yrs)'},
  {key:'lifeYears',label:'Total life (yrs)'},
  {key:'salvagePct',label:'Salvage value (%)'},
  {key:'amenities',label:'Amenities (₹)'},
  {key:'realizablePct',label:'Realizable (% of FMV)'},
  {key:'distressPct',label:'Distress (% of FMV)'},
];
const empty:ValuationInput={
  landAreaSqYd:0,landRate:0,guidelineRate:0,builtUpSqFt:0,constructionRate:0,
  ageYears:0,lifeYears:0,salvagePct:0,amenities:0,realizablePct:0,distressPct:0,
};
function CaseDossier() {
  const { caseId } = Route.useParams();
  const { tenant } = useApp();

  return (
    <CaseDossierWorkspace
      key={String(tenant.id) + ':' + caseId}
    />
  );
}

function CaseDossierWorkspace() {
  const {caseId}=Route.useParams();
  return <CaseDossierContent key={caseId} caseId={caseId}/>;
}
function CaseDossierContent({caseId}:{caseId:string}){
  const [section,setSection]=useState<CaseSection>('overview');
  const [documentsOpened,setDocumentsOpened]=useState(false);
  useEffect(()=>{if(section==='documents')setDocumentsOpened(true);},[section]);
  const {tenant,capabilities}=useApp();
  const {allCases,isLoading,error}=useVpCases();
  const c=allCases.find(x=>x.id===caseId);
  const [inp,setInp]=useState<ValuationInput>(empty);
  const [saving,setSaving]=useState(false);
  const [pendingTransfer,setPendingTransfer]=useState<PendingInspectionTransfer|null>(null);
  const reportPermissions=useVpReportPermissions();
  const form=useVpValuationForm(Number(caseId));
  const versions=useVpValuationVersions(Number(caseId));
  const reports=useVpReportVersions();
  
  const [vp29SelectedVersion, setVp29SelectedVersion] =
    useState<string | null>(null);

  const vp29ReportHistory =
    reports.isSuccess && !reports.isPlaceholderData
      ? caseReportHistory(reports.data ?? [], Number(caseId))
      : [];

  const vp29ReleasedHistory = releasedHistory(vp29ReportHistory);

  const released = chooseReleasedReport(
    vp29ReportHistory,
    vp29SelectedVersion
  );

  const vp29Provenance = released
    ? reportProvenance(released)
    : null;

  const loadedKey=useRef('');
  useEffect(()=>{
    if (form.isPlaceholderData) return;

    const value = form.data?.data?.valuation_inputs;
    const key=`${caseId}:${form.data?.updated??''}`;
    if(!value || loadedKey.current===key) return;
    if(VALUATION_KEYS.every(k=>typeof value[k]==='number' && Number.isFinite(value[k]))) {
      setInp(value);loadedKey.current=key;
    }
  },[caseId,form.data]);
  const [uploading,setUploading]=useState(false);
  const qc=useQuery({queryKey:['vp-case-log',tenant.id,caseId],enabled:!!c,
    queryFn:async()=>{
      const {data,error}=await vpDb.from('log').select('id,at,by,msg')
        .eq('org_id',tenant.id).eq('num',Number(caseId)).order('id',{ascending:false});
      if(error) throw error;
      return (data??[]) as {id:number;at:string;by:string;msg:string}[];
    },
  });
  const docs=useVpCaseDocuments(Number(caseId));
  const queryClient=useQueryClient();
  const v=useMemo(()=>computeValuation(inp),[inp]);
  
  const canEditAdvancedValuation = c?.stage==='Report Draft'&&reportPermissions.data?.edit===true;

  const [p28Adopting, setP28Adopting] = useState(false);

  const { can: p28Can } = useApp();

  const p28CanRead =
    reportPermissions.data?.view === true ||
    reportPermissions.data?.edit === true ||
    p28Can('qc.View') ||
    p28Can('qc.Edit');

  const p28Official = useVpOfficialSummary(
    String(tenant.id),
    c?.caseNum ?? 0,
    !!c && p28CanRead
  );

  const canEditValuation =
    canEditAdvancedValuation &&
    form.isSuccess &&
    !form.isPlaceholderData &&
    p28Official.isSuccess && !p28Official.isPlaceholderData &&
    !p28Official.isFetching &&
    p28Official.data?.advanced === false &&
    !p28Adopting;
  
  async function persist(submit:boolean){
    if (!canEditValuation || saving) {
      toast.error('Legacy valuation is locked or unavailable. Reload the case.');
      return;
    }

    if(!c) return;
    setSaving(true);
    try {
      const freshOfficial = await p28Official.refetch();

      if (
        freshOfficial.isError ||
        freshOfficial.data?.advanced !== false ||
        freshOfficial.data.version !== p28Official.data?.version
      ) {
        throw new Error(
          'Official valuation changed or is unavailable. Reload the case.'
        );
      }

      const result = pendingTransfer
        ? await (async()=>{
          const {data,error}=await vpDb.rpc('vp_p2_save_reviewed_valuation',{
            p_case_num:c.caseNum,p_input:inp,p_submit:submit,
            p_visit_id:pendingTransfer.visitId,p_source_revision:pendingTransfer.updatedAt,
            p_selection:pendingTransfer.selection,
          });
          if(error)throw error;
          return data as {version_no:number|null};
        })()
        : await saveVpValuation(c.caseNum,inp,submit);
      setPendingTransfer(null);
      await Promise.all([
        queryClient.invalidateQueries({queryKey:['vp-p2-transfer-history',tenant.id,c.caseNum]}),
        queryClient.invalidateQueries({queryKey:['vp-valuation-form',tenant.id,c.caseNum]}),
        queryClient.invalidateQueries({queryKey:['vp-valuation-versions',tenant.id,c.caseNum]}),
        queryClient.invalidateQueries({queryKey:['vp-case-log',tenant.id,caseId]}),
      ]);
      toast.success(submit?`Valuation v${result.version_no} submitted — send case to Final QC`:'Draft saved (calculation verified on server)');
    }catch(e){toast.error(e instanceof Error?e.message:'Valuation save failed');}
    finally{
      await p28Official.refetch();
setSaving(false);}
  }
  if(isLoading) return <AppShell><PageHeader title="Case dossier" description="Loading case…" /></AppShell>;
  if(error) return <AppShell><PageHeader title="Case dossier" description={`Database error: ${error.message}`} /></AppShell>;
  if(!c) return <AppShell><PageHeader title="Case not found" description="This case does not exist in your organization." />
    <Button asChild variant="outline"><Link to={mayOpenPath("/cases",capabilities)?"/cases":"/"}><ArrowLeft className="mr-2 size-4" />Back to workspace</Link></Button></AppShell>;

  async function uploadFile(file:File|undefined){
    if(!file) return;
    setUploading(true);
    try{
      await uploadVpCaseDocument(tenant.id,c!.caseNum,file);
      await queryClient.invalidateQueries({queryKey:['vp-case-documents',tenant.id,c!.caseNum]});
      await queryClient.invalidateQueries({queryKey:['vp-case-log',tenant.id,caseId]});
      toast.success('Document uploaded and registered');
    }catch(e){toast.error(e instanceof Error?e.message:'Document upload failed');}
    finally{setUploading(false);}
  }
  return <AppShell>
    <div className="vp-case-layout print:hidden">
      <Button asChild variant="ghost" size="sm" className="mb-1"><Link to={mayOpenPath("/cases",capabilities)?"/cases":"/"}><ArrowLeft className="mr-2 size-4" />{mayOpenPath("/cases",capabilities)?"All cases":"Workspace"}</Link></Button>
      <PageHeader title={c.caseNo} description={`${c.property} · ${c.bank} · ${c.branchName}`}>
        <TatBadge c={c}/>
        <Button disabled={!released} onClick={()=>window.print()} title={released?"Print released-report summary":"Only a released report is printable"}><Printer className="mr-2 size-4" />Print released summary</Button>
      </PageHeader>
      <CaseProgress stage={c.stage} dbStage={c.dbStage}/>
      <CaseContext record={c} documentCount={docs.data?.length} loading={docs.isLoading} failed={!!docs.error} onOpen={next=>{setSection(next);requestAnimationFrame(()=>document.querySelector<HTMLElement>(`[data-vp-case-tab="${next}"]`)?.focus());}}/>
      <Tabs value={section} onValueChange={v=>setSection(v as CaseSection)}><TabsList aria-label="Case workspace sections" className="vp-case-tabs w-full justify-start">
        <TabsTrigger data-vp-case-tab="overview" value="overview" className="gap-2"><VpIcon name="overview" className="size-4 shrink-0"/>Overview</TabsTrigger>
        <TabsTrigger data-vp-case-tab="documents" value="documents" className="gap-2"><VpIcon name="documents" className="size-4 shrink-0"/>Documents</TabsTrigger>
        <TabsTrigger data-vp-case-tab="property" value="property" className="gap-2"><VpIcon name="property" className="size-4 shrink-0"/>Property</TabsTrigger>
        <TabsTrigger data-vp-case-tab="inspection" value="inspection" className="gap-2"><VpIcon name="inspection" className="size-4 shrink-0"/>Inspection & QC</TabsTrigger>
        <TabsTrigger data-vp-case-tab="valuation" value="valuation" className="gap-2"><VpIcon name="valuation" className="size-4 shrink-0"/>Valuation</TabsTrigger>
        <TabsTrigger data-vp-case-tab="certificate" value="certificate" className="gap-2"><VpIcon name="certificate" className="size-4 shrink-0"/>Report</TabsTrigger>
        <TabsTrigger data-vp-case-tab="history" value="history" className="gap-2"><VpIcon name="history" className="size-4 shrink-0"/>History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="grid gap-3 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-sm">Property</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><div>{c.property}</div><div className="text-muted-foreground">{c.propertyType} · {c.city}</div><div>Customer: {c.customer}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Assignment</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><div>Valuer: {c.assignedTo}</div><div>Priority: {c.priorityKnown?c.priority:'—'}</div><div>Fee: {c.feeKnown?fmtINR(c.fee):'—'}</div><div>Due: {c.due}</div></CardContent></Card>
      </TabsContent>
      <TabsContent value="property"><CaseProperty key={c.caseNum} num={c.caseNum}/></TabsContent>
      <TabsContent value="inspection"><VpCaseLinkedRecords caseNum={c.caseNum} bankName={c.bank}/></TabsContent>
      <TabsContent value="history" className="space-y-3">
        <Card><CardHeader><CardTitle className="text-sm">Case activity</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{qc.error?<span className="text-destructive">{qc.error.message}</span>:(qc.data??[]).length?(qc.data??[]).map(n=><div key={n.id}><Badge variant="outline" className="mr-2">{n.at}</Badge>{n.msg}<span className="ml-2 text-muted-foreground">({n.by})</span></div>):<span className="text-muted-foreground">No activity recorded.</span>}</CardContent></Card>
      </TabsContent>
      <TabsContent value="documents" forceMount className="data-[state=inactive]:hidden">
        {(documentsOpened||section==='documents')&&<VpDocumentWorkbench key={`${tenant.id}:${c.caseNum}`} caseNum={c.caseNum} documents={docs.data??[]} loading={docs.isLoading} error={docs.error?.message} uploading={uploading} onUpload={file=>void uploadFile(file)}/>}
      </TabsContent>
      <TabsContent value="valuation" className="space-y-3">
        <div className="rounded-lg border bg-card p-3 text-sm"><h2 className="font-semibold">Valuation workbench</h2><p className="mt-1 text-muted-foreground">Review advanced analysis and inspection evidence below. The existing official land-and-building submission remains separate; advanced analysis is not automatically adopted into the released report.</p></div>
        <div className="space-y-3">
        <P19Analysis key={c.caseNum} num={c.caseNum} category={c.propertyType} canEdit={canEditAdvancedValuation} canView={reportPermissions.data?.view===true} reportDraft={c.stage==='Report Draft'}/>
        {p28Official.isSuccess && !p28Official.isPlaceholderData && p28Official.data?.advanced === false && (<VpInspectionValuationReview caseNum={c.caseNum} canEdit={canEditValuation} pending={pendingTransfer}
          onApply={(patch,transfer)=>{
            const changingExisting=Object.entries(patch).some(([key,next])=>{
              const before=inp[key as keyof ValuationInput];return before>0&&before!==next;
            });
            if(changingExisting&&!window.confirm('Replace existing nonzero valuation values with reviewed inspection measurements?'))return;
            setInp(old=>({...old,...patch}));setPendingTransfer(transfer);
          }}/>)}
        </div><div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {p28Official.isSuccess && !p28Official.isPlaceholderData && p28Official.data?.advanced === false && (<Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Calculator className="size-4" />Land & Building method inputs</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">
          {fields.map(f=><div key={f.key} className="space-y-1"><Label htmlFor={f.key} className="text-xs">{f.label}</Label><Input id={f.key} type="number" min={0} step="any" disabled={!canEditValuation||saving} value={inp[f.key]} onChange={e=>{setPendingTransfer(null);setInp({...inp,[f.key]:Number(e.target.value)||0});}} /></div>)}
          <div className="sm:col-span-2 space-y-2">
            <p className="text-xs text-muted-foreground">{form.error?`Database error: ${form.error.message}`:form.data?`Saved ${form.data.status} · ${form.data.updated}`:'No valuation saved yet.'} {versions.data?.length?`· ${versions.data.length} submitted version(s)`:''}</p>
            {canEditValuation?<div className="flex flex-wrap gap-2"><Button disabled={saving||form.isLoading} variant="outline" onClick={()=>void persist(false)}>Save draft</Button><Button disabled={saving||form.isLoading} onClick={()=>void persist(true)}>Submit valuation for Final QC</Button></div>:<p className="text-xs text-muted-foreground">{c.stage!=='Report Draft'?'Editing is locked until Report Draft (or returned rework).':'Your role lacks Valuation Edit permission, or permission loading failed.'}</p>}
            {reportPermissions.error&&<p className="text-xs text-destructive">Permission check: {reportPermissions.error.message}</p>}
            <p className="text-xs text-muted-foreground">Your calculated preview is not a certified valuation. PostgreSQL independently recalculates and stores each submitted version.</p>
          </div>
        </CardContent></Card>)}
        {p28Official.isSuccess && !p28Official.isPlaceholderData && p28Official.data?.advanced === false && (<Card><CardHeader><CardTitle className="text-sm">Computed values (local preview)</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
          <ValueGraphic market={v.marketValue} realizable={v.realizableValue} distress={v.distressValue}/>
          <Row l="Land value" v={v.landValue}/><Row l="Replacement cost" v={v.replacementCost}/>
          <Row l={`Depreciation (${v.depreciationPct}%)`} v={-v.depreciation}/>
          <Row l="Depreciated building value" v={v.buildingValue}/>
          <Row l="Amenities" v={inp.amenities}/>
          <div className="border-t pt-2"><Row l="Fair Market Value" v={v.marketValue} strong/></div>
          <Row l="Realizable value" v={v.realizableValue}/><Row l="Distress / forced sale value" v={v.distressValue}/>
          <Row l="Guideline value" v={v.guidelineValue}/>
          <p className="pt-2 text-xs text-muted-foreground">{rupeesInWords(v.marketValue)}</p>
        </CardContent></Card>)}
      </div></TabsContent>
      <TabsContent value="certificate" className="space-y-3">
        <div className="space-y-3 rounded-lg border bg-card p-4 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-sm">Report version history</h3>
            <Button
              variant="outline"
              size="sm"
              disabled={reports.isFetching}
              onClick={() => void reports.refetch()}
            >
              Refresh reports
            </Button>
          </div>

          {reports.isLoading && <p>Loading report history...</p>}

          {reports.isError && (
            <p role="alert" className="text-sm text-destructive">
              Report history could not be retrieved.
            </p>
          )}

          <div className="grid gap-2 sm:grid-cols-3 text-sm">
            <div className="rounded border p-2">
              Total versions: {vp29ReportHistory.length}
            </div>
            <div className="rounded border p-2">
              Released: {vp29ReleasedHistory.length}
            </div>
            <div className="rounded border p-2">
              Drafts: {
                vp29ReportHistory.length - vp29ReleasedHistory.length
              }
            </div>
          </div>

          <label className="block space-y-1 text-sm">
            <span>Released report version</span>

            <select
              className="w-full rounded-md border bg-background p-2"
              value={vp29SelectedVersion ?? 'latest'}
              disabled={!vp29ReleasedHistory.length}
              onChange={e =>
                setVp29SelectedVersion(
                  e.target.value === 'latest' ? null : e.target.value
                )
              }
            >
              <option value="latest">Latest released report</option>

              {vp29ReleasedHistory.map(row => (
                <option
                  key={reportVersion(row)}
                  value={String(reportVersion(row))}
                >
                  Version {reportVersion(row)}
                </option>
              ))}
            </select>
          </label>

          {vp29SelectedVersion !== null && !released && (
            <p role="alert" className="text-sm text-destructive">
              Selected version is unavailable. Select an accessible
              released version.
            </p>
          )}

          
          
          {reportPermissions.data?.view === true && (
            <ReportDraftPack
              key={String(tenant.id) + ':' + caseId}
              orgId={String(tenant.id)}
              num={Number(caseId)}
              versions={vp29ReportHistory.map(row => ({
                version: reportVersion(row),
                status: String(row.status)
              }))}
            />
          )}

          {released && reportPermissions.data?.view === true && (

            <ReleasedReportReadback
              key={String(tenant.id) + ':' + caseId + ':' +
                reportVersion(released)}
              orgId={String(tenant.id)}
              num={Number(caseId)}
              version={reportVersion(released)}
            />
          )}

          {vp29Provenance && (

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Report version', vp29Provenance.reportVersion],
                ['Official valuation version',
                  vp29Provenance.valuationVersion ?? 'Not recorded'],
                ['Bank', vp29Provenance.bank],
                ['Report format', vp29Provenance.format],
                ['Valuation method', vp29Provenance.method],
                ['Registered Excel workpaper', vp29Provenance.workpaper],
                ['Released at', vp29Provenance.releasedAt],
                ['Valuer registration', vp29Provenance.registration],
                ['Status', vp29Provenance.status]
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="min-w-0 rounded-md border p-2"
                >
                  <p className="text-xs text-muted-foreground">
                    {label}
                  </p>
                  <p className="break-words text-sm font-medium">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            The summary and stored PDF below correspond to the
            selected released report. Drafts cannot be selected
            as released certificates. Historical values are not
            recalculated from current property data.
          </p>
        </div>
<VpP20Report key={`p20-${c.caseNum}`} num={c.caseNum} bank={c.bank} category={c.propertyType} reportDraft={c.stage==='Report Draft'}/>
        <VpOfficialValuation
          key={String(tenant.id) + ':' + c.caseNum}
          orgId={String(tenant.id)}
          num={c.caseNum}
          bank={c.bank}
          category={c.propertyType}
          summary={p28Official}
          canRead={p28CanRead}
          canAdopt={canEditAdvancedValuation && !saving && !p28Adopting}
          onBusy={setP28Adopting}
        />
<Card className="mx-auto max-w-3xl print:border-0 print:shadow-none"><CardContent className="space-y-3 p-4 text-sm sm:p-8">
        <h2 className="font-display text-xl font-semibold">Released report summary</h2>
        {released?<>
          <p className="text-muted-foreground">Released report v{released.version_no} · {released.format_name} · {released.released_at}</p>
          <p>Property: <b>{released.case_snapshot['property_address']}</b> · Bank: <b>{released.case_snapshot['bank']}</b></p>
          <Row l="Land value" v={released.calculations_snapshot.landValue} />
          <Row l="Building value" v={released.calculations_snapshot.buildingValue} />
          <Row l="Fair Market Value" v={released.calculations_snapshot.marketValue} strong />
          <Row l="Realizable Value" v={released.calculations_snapshot.realizableValue} />
          <Row l="Distress Value" v={released.calculations_snapshot.distressValue} />
          <p className="text-muted-foreground">Released by internally checked registration {released.released_reg_no}. This screen is an internal summary and does not constitute a cryptographic digital signature or the bank-specific uploaded PDF.</p>
          {released.file_path&&<Button className="print:hidden" variant="outline" onClick={()=>void viewVpReportPdf(released.file_path!).catch(e=>toast.error(String(e)))}>View actual PDF securely</Button>}
        </>:<p className="text-muted-foreground">No report has been released for this case. A submitted valuation, Final QC approval, bank-format PDF and authorized release are required.</p>}
      </CardContent></Card></TabsContent>
      </Tabs>
    </div>
    {released&&<div className="hidden print:block p-8 text-sm"><h1 className="text-2xl font-semibold">Released Valuation Summary</h1><p>{released.case_snapshot['case_number']} · {released.format_name}</p><p>{released.case_snapshot['property_address']}</p><Row l="Market value" v={released.calculations_snapshot.marketValue}/><Row l="Realizable" v={released.calculations_snapshot.realizableValue}/><Row l="Distress" v={released.calculations_snapshot.distressValue}/><p className="mt-6">Internal release record · {released.released_reg_no} · {released.released_at}. Not a digital signature. Refer to the stored bank-format PDF.</p></div>}
  </AppShell>;
}
function Row({l,v,strong}:{l:string;v:number;strong?:boolean}){
  return <div className={`flex flex-wrap justify-between gap-x-3 gap-y-1 ${strong?'font-semibold':''}`}><span>{l}</span><span className="font-mono tabular-nums">{typeof v === 'number' && Number.isFinite(v) ? fmtINR(v) : 'Not available'}</span></div>;
}


async function vpReadbackRow(
  request: PromiseLike<{ data: unknown; error: unknown }>
): Promise<Record<string, unknown> | null> {
  const { data, error } = await request;

  if (error) {
    throw new Error(
      typeof error === 'object' &&
      error !== null &&
      'message' in error
        ? String(error.message)
        : 'Record readback failed'
    );
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  return data as Record<string, unknown>;
}

function ReleasedReportReadback({
  orgId, num, version
}: {
  orgId: string;
  num: number;
  version: number;
}) {
  const verification = useQuery({
    queryKey: [
      'vp-report-readback', orgId, num, version
    ],
    enabled: false,
    retry: false,
    gcTime: 0,
    staleTime: 0,

    queryFn: async () => {

      const report = await vpReadbackRow(
        vpDb.from('vp_report_versions')
          .select(
            'org_id,num,version_no,valuation_version_no,' +
            'status,final_qc_task_id,case_snapshot,' +
            'inputs_snapshot,calculations_snapshot,file_path'
          )
          .eq('org_id', orgId)
          .eq('num', num)
          .eq('version_no', version)
          .eq('status', 'Released')
          .maybeSingle()
      );

      if (!report) {
        throw new Error('Released report is unavailable or access denied');
      }

      const valuationVersion = report['valuation_version_no'];

      if (typeof valuationVersion !== 'number' ||
          !Number.isSafeInteger(valuationVersion) ||
          valuationVersion <= 0) {
        throw new Error('Invalid official valuation reference');
      }

      const official = await vpReadbackRow(
        vpDb.from('vp_valuation_versions')
          .select('org_id,num,version_no,method,inputs,calculations')
          .eq('org_id', orgId)
          .eq('num', num)
          .eq('version_no', valuationVersion)
          .maybeSingle()
      );

      const qcId = reportIdentifier(report['final_qc_task_id']);

      const qc = qcId
        ? await vpReadbackRow(
            vpDb.from('vp_qc_tasks')
              .select('id,org_id,num,review_stage,status')
              .eq('org_id', orgId)
              .eq('num', num)
              .eq('id', qcId)
              .maybeSingle()
          )
        : null;

      const caseSnapshot =
        report['case_snapshot'] as Record<string, unknown> | null;

      const exportId =
        reportIdentifier(caseSnapshot?.['p20_export_id']);

      const workpaper = exportId
        ? await vpReadbackRow(
            vpDb.from('vp_p20_exports')
              .select('id,org_id,num,analysis_version,template_id,cell_values')
              .eq('org_id', orgId)
              .eq('num', num)
              .eq('id', exportId)
              .maybeSingle()
          )
        : null;

      const templateId = reportIdentifier(workpaper?.['template_id']);

      const template = templateId
        ? await vpReadbackRow(
            vpDb.from('vp_p20_templates')
              .select('id,org_id,bank_name,category,title,published_at,mapping')
              .eq('org_id', orgId)
              .eq('id', templateId)
              .maybeSingle()
          )
        : null;

      const checks = checkReportSnapshots(
        report, official, qc, workpaper, template
      );



      try {
        const artifact = await vpDb.rpc(
          'vp_report_artifact_readback',
          {
            p_case_num: num,
            p_version: version
          }
        );

        if (artifact.error) {
          throw artifact.error;
        }

        checks.push(
          parseReleaseArtifactReadback(artifact.data)
        );

      } catch {
        checks.push({
          label: 'Release-time storage metadata',
          status: 'Unavailable',
          detail:
            'Artifact verification service unavailable or access denied.'
        });
      }

      let bankMappings: BankMappedCell[] | null = null;
      let bankMappingError: string | null = null;

      if (exportId) {
        try {
          const requiredChecks = [
            'Official valuation reference',
            'Valuation inputs',
            'Valuation calculations',
            'Adopted workpaper reference',
            'Original bank template'
          ];

          if (requiredChecks.some(label =>
            checks.find(check => check.label === label)
              ?.status !== 'Matched'
          )) {
            throw new Error(
              'Official valuation and workpaper references must match'
            );
          }

          bankMappings = buildBankMappingReadback(
            report, workpaper, template
          );

        } catch (error) {
          bankMappingError = error instanceof Error
            ? error.message
            : 'Bank mapping readback failed';
        }
      }

      let fingerprint: {
        sha256: string;
        bytes: number;
      } | null = null;

      let fileError: string | null = null;

      try {

        if (!validReportPdfPath(report['file_path'], orgId, num)) {
          throw new Error('Missing or invalid registered PDF path');
        }

        const { data: blob, error } = await vpDb.storage
          .from('vp-report-files')
          .download(report['file_path']);

        if (error || !blob) {
          throw new Error('Stored PDF unavailable or access denied');
        }

        if (blob.size < 5 || blob.size > 20 * 1024 * 1024) {
          throw new Error('Unexpected PDF file size');
        }

        const bytes = await blob.arrayBuffer();

        if (!hasPdfHeader(new Uint8Array(bytes))) {
          throw new Error('Stored file has an invalid PDF header');
        }

        if (!globalThis.crypto?.subtle) {
          throw new Error('SHA-256 requires a secure browser context');
        }

        const digest = await globalThis.crypto.subtle.digest(
          'SHA-256', bytes
        );

        fingerprint = {
          sha256: Array.from(new Uint8Array(digest))
            .map(n => n.toString(16).padStart(2, '0'))
            .join(''),
          bytes: blob.size
        };

      } catch (error) {
        fileError = error instanceof Error
          ? error.message
          : 'PDF readback failed';
      }

      return {
        checks,
        bankMappings,
        bankMappingError,
        fingerprint,
        fileError,
        checkedAt: new Date().toISOString()
      };
    }
  });

  function checkClass(status: ReportReadbackCheck['status']) {
    if (status === 'Matched') return 'text-emerald-700';
    if (status === 'Mismatch') return 'text-destructive';
    return 'text-muted-foreground';
  }

  return (
    <section className="space-y-3 rounded-md border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-medium">
          Report snapshot verification
        </h4>

        <Button
          variant="outline"
          size="sm"
          disabled={verification.isFetching}
          onClick={() => void verification.refetch()}
        >
          {verification.isFetching
            ? 'Reading stored records...'
            : 'Verify released records'}
        </Button>
      </div>

      {!verification.data && !verification.isError && (
        <p className="text-xs text-muted-foreground">
          Compare this released version with its referenced official
          valuation, Final QC, workpaper and registered PDF.
        </p>
      )}

      {verification.isError && (
        <p role="alert" className="text-sm text-destructive">
          {verification.error.message}
        </p>
      )}

      {verification.isSuccess &&
       !verification.isFetching &&
       verification.data && (
        <>
          <div className="divide-y rounded-md border">
            {verification.data.checks.map(check => (
              <div key={check.label}
                className="flex flex-wrap justify-between gap-2 p-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{check.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {check.detail}
                  </p>
                </div>
                <span className={'text-xs font-medium ' +
                  checkClass(check.status)}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>


          {verification.data.bankMappingError && (
            <p role="alert" className="text-sm text-destructive">
              Bank mapping: {verification.data.bankMappingError}
            </p>
          )}

          {verification.data.bankMappings && (
            <BankWorkbookReadback
              key={verification.data.checkedAt}
              mappings={verification.data.bankMappings}
            />
          )}

          {verification.data.fingerprint && (

            <div className="space-y-1 rounded-md border p-3">
              <p className="text-sm font-medium">Stored PDF fingerprint</p>

              <p className="text-xs">
                {verification.data.fingerprint.bytes.toLocaleString()}
                {' bytes'}
              </p>

              <p className="break-all font-mono text-xs">
                {verification.data.fingerprint.sha256}
              </p>

              <p className="text-xs text-muted-foreground">
                Calculated from the currently downloaded bytes.
                No release-time hash comparison is available.
                This is not digital signature verification.
              </p>
            </div>
          )}

          {verification.data.fileError && (
            <p role="alert" className="text-sm text-destructive">
              PDF: {verification.data.fileError}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Readback performed at {verification.data.checkedAt}.
            These checks do not modify the report or its approval.
          </p>
        </>
      )}
    </section>
  );
}


type ExistingWorkbookReader = {
  fromDataAsync: (bytes: ArrayBuffer) => Promise<{
    sheet: (name: string) => {
      cell: (address: string) => {
        value: () => unknown;
        formula: () => unknown;
      };
    } | undefined;
  }>;
};

function BankWorkbookReadback({
  mappings
}: {
  mappings: BankMappedCell[];
}) {
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] =
    useState<BankCellResult[] | null>(null);

  const sourceMismatch = mappings.some(
    item => item.reference === 'Mismatch'
  );

  async function verifyWorkbook(file: File) {
    if (busy || sourceMismatch) return;

    setBusy(true);
    setResults(null);
    setError(null);
    setFileName(file.name);

    try {
      if (!/\.xlsx$/i.test(file.name) ||
          file.size < 4 ||
          file.size > 5 * 1024 * 1024) {
        throw new Error(
          'Select a trusted .xlsx workpaper up to 5 MB'
        );
      }

      const bytes = await file.arrayBuffer();
      const signature = new Uint8Array(bytes, 0, 4);

      if (signature[0] !== 80 ||
          signature[1] !== 75 ||
          signature[2] !== 3 ||
          signature[3] !== 4) {
        throw new Error('Invalid XLSX file signature');
      }

      // Use the same library as the existing P20 renderer.
      const imported = await import("xlsx-populate/browser/xlsx-populate-no-encryption.js");

      const namespace = imported as unknown as {
        default?: unknown;
      };

      const reader = (
        namespace.default ?? imported
      ) as ExistingWorkbookReader;

      if (typeof reader.fromDataAsync !== 'function') {
        throw new Error('Existing Excel reader is unavailable');
      }

      const workbook = await reader.fromDataAsync(bytes);

      const checked = mappings.map(mapping => {
        try {
          const sheet = workbook.sheet(mapping.sheet);

          if (!sheet) {
            return {
              status: 'Unavailable',
              actual: 'Worksheet missing'
            } satisfies BankCellResult;
          }

          const cell = sheet.cell(mapping.cell);

          return compareBankCell(
            mapping.expected,
            cell.value(),
            cell.formula()
          );

        } catch {
          return {
            status: 'Unavailable',
            actual: 'Mapped cell could not be read'
          } satisfies BankCellResult;
        }
      });

      setResults(checked);

    } catch (failure) {
      setError(failure instanceof Error
        ? failure.message
        : 'Workbook verification failed');
    } finally {
      setBusy(false);
    }
  }

  const matched = results?.filter(
    result => result.status === 'Matched'
  ).length ?? 0;

  return (
    <section className="space-y-3 rounded-md border p-3">
      <h4 className="text-sm font-semibold">
        Original bank workbook mapping
      </h4>

      <div className="grid gap-2 sm:grid-cols-3 text-xs">
        <div className="rounded border p-2">
          Mapped cells: {mappings.length}
        </div>
        <div className="rounded border p-2">
          Official matches: {
            mappings.filter(x => x.reference === 'Matched').length
          }
        </div>
        <div className="rounded border p-2">
          Source mismatches: {
            mappings.filter(x => x.reference === 'Mismatch').length
          }
        </div>
      </div>

      {sourceMismatch && (
        <p role="alert" className="text-sm text-destructive">
          Registered values differ from the official report snapshot.
          Workbook verification is locked until reconciled.
        </p>
      )}

      <label className="block space-y-1 text-sm">
        <span>Verify regenerated reviewed workpaper</span>

        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          disabled={busy || sourceMismatch}
          className="block w-full rounded-md border p-2 text-xs"
          onChange={event => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void verifyWorkbook(file);
          }}
        />
      </label>

      <p className="text-xs text-muted-foreground">
        Choose a trusted workbook generated by the existing P20
        workpaper feature. The file is read locally and is not
        uploaded or saved by this verification.
      </p>

      {busy && <p>Reading mapped workbook cells...</p>}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {results && (
        <div className="space-y-1 rounded-md border p-2 text-sm">
          <p className="break-all font-medium">{fileName}</p>
          <p>
            {matched} of {mappings.length} mapped cells matched.
          </p>
          <p className="text-xs text-muted-foreground">
            {matched === mappings.length
              ? 'All mapped cell values matched the registered workpaper.'
              : 'Review mismatched, formula or unavailable cells.'}
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted">
            <tr>
              {[
                'Field',
                'Sheet / Cell',
                'Registered value',
                'Official comparison',
                'Excel value',
                'Cell result'
              ].map(label => (
                <th key={label} className="p-2">{label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {mappings.map((mapping, index) => {
              const result = results?.[index];

              return (
                <tr
                  key={mapping.sheet + ':' + mapping.cell}
                  className="border-t align-top"
                >
                  <td className="p-2 font-medium">
                    {mapping.field}
                  </td>

                  <td className="p-2">
                    {mapping.sheet} / {mapping.cell}
                  </td>

                  <td className="p-2 break-all">
                    {mapping.expected === null
                      ? '(Blank)'
                      : String(mapping.expected)}
                  </td>

                  <td className="p-2">
                    <span className={
                      mapping.reference === 'Mismatch'
                        ? 'text-destructive'
                        : mapping.reference === 'Matched'
                          ? 'text-emerald-700'
                          : 'text-muted-foreground'
                    }>
                      {mapping.reference}
                    </span>
                  </td>

                  <td className="p-2 break-all">
                    {result?.actual ?? 'Not checked'}
                  </td>

                  <td className="p-2">
                    <span className={
                      result?.status === 'Matched'
                        ? 'text-emerald-700'
                        : result?.status === 'Mismatch'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                    }>
                      {result?.status ?? 'Not checked'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        This checks mapped cell values, not formula recalculation,
        workbook layout, drawings or digital signatures.
        Reviewed workpapers are not released bank reports.
      </p>
    </section>
  );
}


type DraftPackPhoto = {
  name: string;
  uploadedAt: string;
  dataUrl: string;
};

function packRow(value: unknown): Record<string, unknown> {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
}

function packText(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return 'Not recorded';
}

function photoDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve,reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Photo could not be decoded'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Photo read failed'));
    };

    reader.readAsDataURL(blob);
  });
}

async function loadDraftPackPhotos(
  report: Record<string, unknown>,
  orgId: string,
  num: number
): Promise<{
  photos: DraftPackPhoto[];
  notices: string[];
}> {
  const reference = reportInspectionReference(report);
  const photos: DraftPackPhoto[] = [];
  const notices: string[] = [];

  if (!reference) {
    notices.push(
      'No historical inspection reference is recorded. ' +
      'Current visit photographs were not substituted.'
    );

    return { photos, notices };
  }

  try {
    const {data,error} = await vpDb.from('vp_visit_photos')
      .select('id,org_id,visit_id,storage_path,name,mime,size,uploaded_at')
      .eq('org_id',orgId)
      .eq('visit_id',reference.visitId)
      .lte('uploaded_at',reference.revision)
      .order('uploaded_at',{ascending:true})
      .order('id',{ascending:true})
      .limit(9);

    if (error) {
      throw new Error('Photograph register unavailable or access denied');
    }

    const records = (data ?? []) as unknown[];

    if (!records.length) {
      notices.push(
        'No accessible photographs were returned. ' +
        'This does not establish that no photographs exist.'
      );
    }

    if (records.length > 8) {
      notices.push(
        'Annexure limited to the first eight accessible photographs.'
      );
    }

    let totalBytes = 0;

    for (const raw of records.slice(0,8)) {
      const row = packRow(raw);

      if (!validAnnexPhoto(row,orgId,num,reference)) {
        notices.push('An invalid photograph reference was omitted.');
        continue;
      }

      const size = Number(row['size']);

      if (totalBytes + size > 20 * 1024 * 1024) {
        notices.push('Combined photograph limit reached (20 MB).');
        break;
      }

      try {
        const {data:blob,error:downloadError} =
          await vpDb.storage.from('vp-field-evidence')
            .download(String(row['storage_path']));

        if (downloadError || !blob) {
          throw new Error('Photo unavailable');
        }

        if (blob.size !== size ||
            blob.size > 10485760) {
          throw new Error('Stored photograph size mismatch');
        }

        const bytes = new Uint8Array(await blob.arrayBuffer());

        if (!validAnnexImage(bytes,row['mime'])) {
          throw new Error('Stored photograph type mismatch');
        }

        const image = new Blob([bytes],{
          type:String(row['mime'])
        });

        photos.push({
          name:packText(row['name']),
          uploadedAt:packText(row['uploaded_at']),
          dataUrl:await photoDataUrl(image)
        });

        totalBytes += size;

      } catch {
        notices.push(
          'Could not retrieve photograph: ' + packText(row['name'])
        );
      }
    }

  } catch (error) {
    notices.push(error instanceof Error
      ? error.message
      : 'Photographic annexure unavailable');
  }

  return { photos, notices };
}

function renderDraftPack(
  popup: Window,
  report: Record<string, unknown>,
  photos: DraftPackPhoto[],
  notices: string[]
) {
  const doc = popup.document;

  doc.title = 'ValuationPro - Internal Draft Report';
  doc.head.replaceChildren();
  doc.body.replaceChildren();

  const charset = doc.createElement('meta');
  charset.setAttribute('charset','utf-8');
  doc.head.appendChild(charset);

  const policy = doc.createElement('meta');
  policy.httpEquiv = 'Content-Security-Policy';
  policy.content =
    "default-src 'none'; img-src data:; " +
    "style-src 'unsafe-inline'; base-uri 'none'; " +
    "form-action 'none'";
  doc.head.appendChild(policy);

  const style = doc.createElement('style');

  style.textContent = [
    '@page{size:A4;margin:15mm}',
    '*{box-sizing:border-box}',
    'body{font:12px Arial,sans-serif;color:#17283b;',
    'max-width:820px;margin:24px auto;padding:16px}',
    'h1{font-size:24px;margin:12px 0}',
    'h2{font-size:16px;margin-top:24px;',
    'border-bottom:2px solid #253e59;padding-bottom:6px}',
    'p{line-height:1.5;overflow-wrap:anywhere}',
    'table{width:100%;border-collapse:collapse}',
    'th,td{padding:9px;border:1px solid #cbd5e1;',
    'text-align:left;overflow-wrap:anywhere}',
    'th{width:36%;background:#f1f5f9}',
    '.warning{color:#991b1b;border:2px solid #991b1b;',
    'padding:10px;font-weight:bold}',
    '.muted{color:#475569;font-size:11px}',
    'figure{margin:12px 0;break-inside:avoid;',
    'border:1px solid #cbd5e1;padding:10px}',
    'img{width:100%;max-height:330px;object-fit:contain}',
    'figcaption{padding-top:7px;overflow-wrap:anywhere}',
    'button{padding:10px 16px;cursor:pointer}',
    'tr{break-inside:avoid}',
    '@media print{body{max-width:none;margin:0;padding:0}',
    '.screen-only{display:none!important}}'
  ].join('');

  doc.head.appendChild(style);

  function add(
    tag: string,
    text: string,
    className = ''
  ): HTMLElement {
    const element = doc.createElement(tag);

    // Do not insert database values as HTML.
    element.textContent = text;
    element.className = className;

    doc.body.appendChild(element);

    return element;
  }

  function table(rows: [string,string][]) {
    const element = doc.createElement('table');

    for (const [label,value] of rows) {
      const tr = doc.createElement('tr');
      const th = doc.createElement('th');
      const td = doc.createElement('td');

      th.textContent = label;
      td.textContent = value;

      tr.append(th,td);
      element.appendChild(tr);
    }

    doc.body.appendChild(element);
  }

  const printButton = doc.createElement('button');
  printButton.className = 'screen-only';
  printButton.textContent = 'Print / Save as PDF';
  printButton.disabled = true;
  printButton.addEventListener('click',() => popup.print());
  doc.body.appendChild(printButton);

  add('h1','Property Valuation - Internal Review Pack');

  add(
    'p',
    'DRAFT - NOT FOR BANK SUBMISSION',
    'warning'
  );

  add(
    'p',
    'Generated from stored report snapshots. ' +
    'This is not the original released bank report, ' +
    'a certified valuation or a digital signature.',
    'muted'
  );

  const snapshot = packRow(report['case_snapshot']);
  const inputs = packRow(report['inputs_snapshot']);
  const calculations = packRow(report['calculations_snapshot']);
  const property = packRow(inputs['property_snapshot']);
  const reference = reportInspectionReference(report);

  add('h2','1. Report identification');

  table([
    ['Case number',packText(snapshot['case_number'] ?? report['num'])],
    ['Bank / lender',packText(snapshot['bank'])],
    ['Report format',packText(report['format_name'])],
    ['Source report version',packText(report['version_no'])],
    ['Source report status',packText(report['status'])],
    ['Official valuation version',packText(report['valuation_version_no'])],
    ['Valuation method',packText(snapshot['valuation_method'] ?? inputs['method'])],
    ['Bank workpaper',packText(snapshot['p20_export_id'] ?? inputs['export_id'])],
    ['Effective valuation date',packText(inputs['effective_date'])]
  ]);

  add('h2','2. Property information');

  table([
    ['Property address',packText(property['address'] ?? snapshot['property_address'])],
    ['Property category',packText(property['category'])],
    ['Property label',packText(property['label'])],
    ['Referenced inspection visit',packText(reference?.visitId)],
    ['Inspection snapshot revision',packText(reference?.revision)]
  ]);

  add('h2','3. Valuation assessment');

  table([
    ['Land value',reportAmount(calculations['landValue'])],
    ['Building value',reportAmount(calculations['buildingValue'])],
    ['Fair market value',reportAmount(calculations['marketValue'])],
    ['Realizable value',reportAmount(calculations['realizableValue'])],
    ['Distress value',reportAmount(calculations['distressValue'])],
    ['Guideline value',reportAmount(calculations['guidelineValue'])]
  ]);

  add(
    'p',
    'Amounts are reproduced from the selected stored calculation. ' +
    'Missing values are not replaced by zero.',
    'muted'
  );

  add('h2','4. Valuation basis');

  const analysisInputs = packRow(inputs['analysis_inputs']);

  table([
    ['Analysis version',packText(inputs['analysis_version'])],
    ['Formula version',packText(inputs['formula_version'])],
    ['Valuation rationale',packText(analysisInputs['reason'])],
    ['Adoption rationale',packText(inputs['adoption_reason'])]
  ]);

  add('h2','5. Photographic annexure');

  add(
    'p',
    'Photographs are read from the accessible register for ' +
    'the referenced visit, limited to records dated on or before ' +
    'the inspection snapshot revision. They are not a verified ' +
    'immutable list of photographs included in the original report.',
    'muted'
  );

  if (!photos.length) {
    add('p','No photographs included in this annexure.');
  }

  const imageLoads: Promise<void>[] = [];

  photos.forEach((photo,index) => {
    const figure = doc.createElement('figure');
    const image = doc.createElement('img');

    image.alt = photo.name;

    const loaded = new Promise<void>(resolve => {
      const timeout = popup.setTimeout(() => {
        image.remove();
        figure.appendChild(doc.createTextNode(
          'Photograph preview timed out.'
        ));
        resolve();
      },15000);

      image.onload = () => {
        popup.clearTimeout(timeout);
        resolve();
      };

      image.onerror = () => {
        popup.clearTimeout(timeout);
        image.remove();
        figure.appendChild(doc.createTextNode(
          'Photograph could not be rendered.'
        ));
        resolve();
      };
    });

    imageLoads.push(loaded);
    image.src = photo.dataUrl;

    const caption = doc.createElement('figcaption');

    caption.textContent =
      'Photo ' + (index + 1) + ': ' + photo.name +
      ' | Uploaded: ' + photo.uploadedAt;

    figure.append(image,caption);
    doc.body.appendChild(figure);
  });

  for (const notice of notices) {
    add('p',notice,'warning');
  }

  add('h2','6. Limitations');

  add(
    'p',
    'This internal draft does not replace lender-specific ' +
    'format requirements, maker-checker review or authorized release. ' +
    'Survey sketches and signatures are not automatically included.'
  );

  add(
    'p',
    'Prepared for internal review: ' + new Date().toISOString(),
    'muted'
  );

  void Promise.all(imageLoads).then(() => {
    if (!popup.closed) printButton.disabled = false;
  });
}

function ReportDraftPack({
  orgId,num,versions
}: {
  orgId:string;
  num:number;
  versions:{version:number;status:string}[];
}) {
  const [selection,setSelection] = useState('');
  const [includePhotos,setIncludePhotos] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState<string|null>(null);

  const selected = versions.find(
    row => String(row.version) === selection
  );

  async function prepare() {
    if (!selected || busy) return;

    if (selected.status !== 'Draft' &&
        selected.status !== 'Released') return;

    const popup = window.open(
      '',
      '_blank',
      'popup,width=920,height=850'
    );

    if (!popup) {
      setError('Allow popups for this application to prepare the PDF.');
      return;
    }

    popup.opener = null;

    popup.document.title = 'Preparing internal draft';
    popup.document.body.textContent = 'Preparing report...';

    setBusy(true);
    setError(null);

    try {
      const report = await vpReadbackRow(
        vpDb.from('vp_report_versions')
          .select(
            'org_id,num,version_no,valuation_version_no,' +
            'format_name,status,case_snapshot,inputs_snapshot,' +
            'calculations_snapshot'
          )
          .eq('org_id',orgId)
          .eq('num',num)
          .eq('version_no',selected.version)
          .eq('status',selected.status)
          .maybeSingle()
      );

      if (!report ||
          reportIdentifier(report['org_id']) !== orgId ||
          report['num'] !== num ||
          report['version_no'] !== selected.version ||
          report['status'] !== selected.status) {
        throw new Error(
          'Selected report is unavailable or has changed. Refresh reports.'
        );
      }

      const annexure = includePhotos
        ? await loadDraftPackPhotos(report,orgId,num)
        : {
            photos:[],
            notices:['Photographic annexure not requested.']
          };

      if (popup.closed) return;

      renderDraftPack(
        popup,
        report,
        annexure.photos,
        annexure.notices
      );

    } catch (failure) {
      const message = failure instanceof Error
        ? failure.message
        : 'Draft report preparation failed';

      setError(message);

      if (!popup.closed) popup.close();

    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-md border p-3 print:hidden">
      <h4 className="text-sm font-semibold">
        Prepare internal PDF report
      </h4>

      <label className="block space-y-1 text-sm">
        <span>Source report version</span>
        <select
          className="w-full rounded-md border bg-background p-2"
          value={selection}
          disabled={busy}
          onChange={event => setSelection(event.target.value)}
        >
          <option value="">Select report version</option>

          {versions.map(row => (
            <option key={row.version} value={String(row.version)}>
              Version {row.version} - {row.status}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={includePhotos}
          disabled={busy}
          onChange={event => setIncludePhotos(event.target.checked)}
        />
        Include accessible historical visit photographs
      </label>

      <Button
        size="sm"
        disabled={!selected || busy}
        onClick={() => void prepare()}
      >
        {busy ? 'Preparing...' : 'Prepare PDF draft'}
      </Button>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Opens a separate printable A4 document. Select Save as PDF
        in the browser print dialog. Existing reports and their
        release status are not modified.
      </p>
    </section>
  );
}
