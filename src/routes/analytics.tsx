import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell,PageHeader } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from '@/components/ui/select';
import { Table,TableHeader,TableHead,TableBody,TableRow,TableCell } from '@/components/ui/table';
import { useApp } from '@/lib/app-context';
import { useVp8Access, vp8GetSummary,vp8GetBreakdown,vp8GetAudit,
  vp8GetReconciliation,vp8GetPlatform,vp8LogExport,
  type Vp8Dimension,type Vp8Filters } from '@/lib/vp-analytics';

export const Route=createFileRoute('/analytics')({
  head:()=>({meta:[{title:'ValuationPro — Analytics & Audit'}]}),
  component:AnalyticsPage,
});
function localDate(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function errorText(e:unknown){return e instanceof Error?e.message:String(e);}
function count(v:number|null|undefined){return v==null?'Not permitted':Number(v).toLocaleString('en-IN');}
function money(v:number|null|undefined){return v==null?'Not permitted':`₹${Number(v).toLocaleString('en-IN',{maximumFractionDigits:2,minimumFractionDigits:2})}`;}
function quoteCSV(v:unknown){
  const s=String(v??'');
  const safe=/^[\s]*[=+\-@]/.test(s)?`'${s}`:s;
  return `"${safe.replace(/"/g,'""')}"`;
}
function downloadCSV(name:string,rows:(string|number|null|undefined)[][]){
  const raw='\uFEFF'+rows.map(r=>r.map(quoteCSV).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([raw],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function AnalyticsPage(){
  const {tenant,branch,tenantBranches}=useApp();
  const today=useMemo(()=>new Date(),[]);
  const [from,setFrom]=useState(()=>localDate(new Date(today.getFullYear(),today.getMonth(),today.getDate()-29)));
  const [to,setTo]=useState(()=>localDate(today));
  const [dimension,setDimension]=useState<Vp8Dimension>('bank');
  const [auditPage,setAuditPage]=useState(0);
  const [exporting,setExporting]=useState(false);
  const filters:Vp8Filters=useMemo(()=>({branchId:branch==='all'?null:branch,from,to}),[branch,from,to]);
  const access=useVp8Access();
  const view=access.data?.view===true;
  const auditAllowed=access.data?.audit===true;
  const financeAllowed=access.data?.billing===true;
  const canExport=access.data?.export===true;
  const summary=useQuery({queryKey:['vp8',tenant.id,'summary',filters],queryFn:()=>vp8GetSummary(filters),enabled:view});
  const groups=useQuery({queryKey:['vp8',tenant.id,'groups',dimension,filters],queryFn:()=>vp8GetBreakdown(dimension,filters),enabled:view});
  const audit=useQuery({queryKey:['vp8',tenant.id,'audit',auditPage],queryFn:()=>vp8GetAudit(100,auditPage*100),enabled:auditAllowed});
  const issues=useQuery({queryKey:['vp8',tenant.id,'recon'],queryFn:vp8GetReconciliation,enabled:auditAllowed&&financeAllowed});
  const platform=useQuery({queryKey:['vp8',tenant.id,'platform'],queryFn:vp8GetPlatform,enabled:access.data?.platform===true});
  const errors=[access.error,summary.error,groups.error,audit.error,issues.error,platform.error].filter(Boolean);
  async function exportData(dataset:Vp8Dimension|'audit'){
    if(!canExport||!view)return;
    setExporting(true);
    try{
      if(dataset==='audit'){
        if(!auditAllowed)throw new Error('Audit permission required');
        const page=await vp8GetAudit(100,0);
        const rows:(string|number|null)[][]=[['Time','Date only','Category','Actor','Event','Case','Source']];
        for(const e of page)rows.push([e.event_time,e.date_only?'Yes':'No',e.category,e.actor,e.description,e.case_num,e.source_key]);
        await vp8LogExport('audit',page.length,{branchId:null,from:'',to:''});
        downloadCSV('valuationpro-audit-latest-100.csv',rows);
        toast.success('Exported up to 100 latest audit events');
      }else{
        if(!financeAllowed)throw new Error('Billing View permission is required for breakdown exports');
        const items=await vp8GetBreakdown(dataset,filters);
        const rows:(string|number|null)[][]=[['Group','Cases created','Overdue from cohort','Pending QC','Released cases','Invoiced total (₹)']];
        for(const r of items)rows.push([r.label,r.cases_count,r.overdue_cases,r.pending_qc,r.released_cases,r.invoiced_total]);
        await vp8LogExport(dataset,items.length,filters);
        downloadCSV(`valuationpro-${dataset}-analytics.csv`,rows);
        toast.success('Exported up to 200 summary groups');
      }
    }catch(e){toast.error(errorText(e));}finally{setExporting(false);}
  }
  const s=summary.data;
  return <AppShell>
    <PageHeader title="Analytics & Audit" description="Real operational analytics, tenant-scoped audit history and reconciliation. No demonstration figures.">
      {canExport&&<Button variant="outline" size="sm" disabled={!view||exporting} onClick={()=>void exportData(dimension)}><Download className="size-4"/>{exporting?'Exporting…':'Export groups CSV'}</Button>}
      <Button variant="outline" size="sm" onClick={()=>{void summary.refetch();void groups.refetch();void audit.refetch();void issues.refetch();}}><RefreshCw className="size-4"/>Refresh</Button>
    </PageHeader>
    {errors.length>0&&<p className="mb-4 rounded-md border border-destructive/40 p-3 text-sm text-destructive">Analytics error: {errorText(errors[0])}</p>}
    {access.isLoading&&<p className="text-sm text-muted-foreground">Checking analytics permissions…</p>}
    {!access.isLoading&&!view&&<Card><CardContent className="py-8 text-sm text-muted-foreground">This account does not have analytics.View. Ask your administrator to enable Analytics → View in Role Matrix.</CardContent></Card>}
    {view&&<>
      <Card className="mb-4"><CardContent className="grid gap-3 pt-6 sm:grid-cols-3">
        <div><Label htmlFor="vp8-from">From (case created / event date)</Label><Input id="vp8-from" type="date" value={from} max={to} onChange={e=>setFrom(e.target.value)}/></div>
        <div><Label htmlFor="vp8-to">To</Label><Input id="vp8-to" type="date" value={to} min={from} onChange={e=>setTo(e.target.value)}/></div>
        <div className="flex items-end text-xs text-muted-foreground">Branch: {branch==='all'?'Permitted branches':tenantBranches.find(b=>b.id===branch)?.name??'Unknown'} (use the existing header selector)</div>
      </CardContent></Card>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[['New cases',count(s?.cases_created)],['Open cases (created cohort)',count(s?.open_from_created_cohort)],
          ['Overdue cases (created cohort)',count(s?.overdue_from_created_cohort)],['Pending QC (created cohort)',count(s?.pending_qc_for_created_cases)],
          ['Reports released in period',count(s?.released_reports_during_period)],['Visits completed in period',count(s?.completed_visits_during_period)],
          ['Invoices issued in period',count(s?.invoices_issued_during_period)],['Billed on period invoices',money(s?.invoice_billed_during_period)]
        ].map(([label,value])=><Card key={label}><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle></CardHeader><CardContent><p className="font-display text-xl font-semibold">{value}</p></CardContent></Card>)}
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Receipts dated in period</CardTitle></CardHeader><CardContent className="font-semibold">{money(s?.receipts_recorded_during_period)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Outstanding on period invoices</CardTitle></CardHeader><CardContent className="font-semibold">{money(s?.invoice_outstanding_for_period_invoices)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Legacy invoices excluded</CardTitle></CardHeader><CardContent className="font-semibold">{count(s?.unlinked_legacy_invoices)}</CardContent></Card>
      </div>
      <p className="mb-5 text-xs text-muted-foreground">Case cards describe cases created within the selected dates; released reports, visits, and receipts use their event dates. Invoice balance is current for invoices created in the selected dates. Unlinked legacy invoices are excluded from finance totals.</p>
      <Card className="mb-5"><CardHeader className="flex flex-row items-center justify-between gap-3"><CardTitle className="text-base">Case cohort performance</CardTitle>
        <Select value={dimension} onValueChange={v=>setDimension(v as Vp8Dimension)}><SelectTrigger className="w-44"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="bank">By bank</SelectItem><SelectItem value="branch">By branch</SelectItem><SelectItem value="property">By property type</SelectItem></SelectContent></Select>
      </CardHeader><CardContent><div className="overflow-auto"><Table><TableHeader><TableRow><TableHead>Group</TableHead><TableHead className="text-right">Cases</TableHead><TableHead className="text-right">Overdue</TableHead><TableHead className="text-right">Pending QC</TableHead><TableHead className="text-right">Released</TableHead><TableHead className="text-right">Invoiced</TableHead></TableRow></TableHeader>
        <TableBody>{(groups.data??[]).map(g=><TableRow key={g.label}><TableCell>{g.label}</TableCell><TableCell className="text-right">{count(g.cases_count)}</TableCell><TableCell className="text-right">{count(g.overdue_cases)}</TableCell><TableCell className="text-right">{count(g.pending_qc)}</TableCell><TableCell className="text-right">{count(g.released_cases)}</TableCell><TableCell className="text-right">{money(g.invoiced_total)}</TableCell></TableRow>)}
          {!groups.isLoading&&!groups.data?.length&&<TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No recorded cases for this date range.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
    </>}
    {auditAllowed&&<Card className="mb-5"><CardHeader className="flex flex-row items-center justify-between gap-2"><div><CardTitle className="text-base">Audit trail</CardTitle><p className="mt-1 text-xs text-muted-foreground">Records from existing audit, case, QC, report, payment and export sources. Case log dates have day-level precision.</p></div>{canExport&&<Button size="sm" variant="outline" disabled={exporting} onClick={()=>void exportData('audit')}><Download className="size-4"/>Audit CSV</Button>}</CardHeader><CardContent>
      <div className="overflow-auto"><Table><TableHeader><TableRow><TableHead>Date/time</TableHead><TableHead>Module</TableHead><TableHead>Actor</TableHead><TableHead>Event</TableHead><TableHead>Case</TableHead></TableRow></TableHeader><TableBody>
        {(audit.data??[]).map(a=><TableRow key={a.source_key}><TableCell className="whitespace-nowrap text-xs">{a.event_time?(a.date_only?new Date(a.event_time).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'}):new Date(a.event_time).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})):'—'}</TableCell><TableCell>{a.category}</TableCell><TableCell>{a.actor}</TableCell><TableCell>{a.description}</TableCell><TableCell>{a.case_num??'—'}</TableCell></TableRow>)}
        {!audit.isLoading&&!audit.data?.length&&<TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No matching audit events.</TableCell></TableRow>}</TableBody></Table></div>
      <div className="mt-3 flex items-center justify-end gap-2"><Button size="sm" variant="outline" disabled={auditPage===0} onClick={()=>setAuditPage(p=>Math.max(0,p-1))}>Previous</Button><Badge variant="secondary">Page {auditPage+1}</Badge><Button size="sm" variant="outline" disabled={(audit.data?.length??0)<100} onClick={()=>setAuditPage(p=>p+1)}>Next</Button></div>
    </CardContent></Card>}
    {auditAllowed&&financeAllowed&&<Card className="mb-5"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4"/>Billing reconciliation exceptions</CardTitle></CardHeader><CardContent>
      {(issues.data??[]).length===0&&!issues.isLoading?<p className="text-sm text-muted-foreground">No exceptions in the first 100 results.</p>:<div className="overflow-auto"><Table><TableHeader><TableRow><TableHead>Issue</TableHead><TableHead>Reference</TableHead><TableHead>Details</TableHead></TableRow></TableHeader><TableBody>{(issues.data??[]).map((i,n)=><TableRow key={`${i.issue}:${i.reference}:${n}`}><TableCell>{i.issue}</TableCell><TableCell>{i.reference}</TableCell><TableCell>{i.details}</TableCell></TableRow>)}</TableBody></Table></div>}
      <p className="mt-2 text-xs text-muted-foreground">Exception list is diagnostic only; it never adjusts invoices or creates payments. Unbilled released reports may be intentional.</p>
    </CardContent></Card>}
    {access.data?.platform===true&&<Card><CardHeader><CardTitle className="text-base">Platform overview (aggregate only)</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Organization type</TableHead><TableHead>Status</TableHead><TableHead>Organizations</TableHead><TableHead>Users</TableHead><TableHead>Cases</TableHead></TableRow></TableHeader><TableBody>{(platform.data??[]).map((p,n)=><TableRow key={n}><TableCell>{p.org_type}</TableCell><TableCell>{p.org_status}</TableCell><TableCell>{count(p.organizations)}</TableCell><TableCell>{count(p.users_total)}</TableCell><TableCell>{count(p.cases_total)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>}
  </AppShell>;
}
