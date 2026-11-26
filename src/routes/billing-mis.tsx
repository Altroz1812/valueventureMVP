import { VpFin04DAdvances } from '@/components/vp-fin04d-advances';
import { VpFin04CReview } from '@/components/vp-fin04c-claims';
import { VpFin04BReview } from '@/components/vp-fin04b-journeys';
import { VpFin04APolicy } from '@/components/vp-fin04a-policy';
import { VpFin03CReceivables } from '@/components/vp-fin03c-receivables';
import { VpFin03BBilling } from '@/components/vp-fin03b-billing';
import { VpFin03ARegister } from '@/components/vp-fin03a-register';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IndianRupee, Plus, Receipt, TriangleAlert, Download, Settings2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, PageHeader } from '@/components/app-shell';
import { StatCard } from '@/components/ops-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/lib/app-context';
import { fmtINR } from '@/lib/data';
import { fetchVpBillingInvoices, useVpBillingBreakdown, useVpBillingInvoices,
  useVpBillingLegacyCount, useVpBillingPermissions, useVpBillingReady, useVpBillingReceipts,
  useVpBillingSettings, useVpBillingSummary, vpBillingRaise, vpBillingRecordPayment,
  vpBillingSaveSettings, type BillingInvoice, type ReadyCase, type TaxTreatment,
  type PaymentMethod } from '@/lib/vp-billing';

export const Route = createFileRoute('/billing-mis')({
  head:()=>({meta:[{title:'ValuationPro — Billing & MIS'},
    {name:'description',content:'Bank invoicing, payment collections, and branch/bank MIS.'}]}),
  component:BillingPage,
});
const methods:PaymentMethod[]=['NEFT','RTGS','IMPS','UPI','Cheque','Cash','Other'];
function errMsg(e:unknown){return e instanceof Error?e.message:String(e);}
function amount(s:string){
  if(!/^\d+(?:\.\d{1,2})?$/.test(s.trim()))return NaN;
  return Number(s);
}
function csvSafe(s:unknown){
  const v=String(s??'');
  const safe=/^[\s]*[=+\-@]/.test(v)?`'${v}`:v;
  return `"${safe.replace(/"/g,'""')}"`;
}
function downloadCSV(filename:string,rows:(string|number)[][]){
  const csv='\uFEFF'+rows.map(r=>r.map(csvSafe).join(',')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  URL.revokeObjectURL(url);
}

function BillingPage(){
  const {tenant,branch}=useApp();
  const qc=useQueryClient();
  const perms=useVpBillingPermissions();
  const view=perms.data?.view===true;
  const create=perms.data?.create===true;
  const approve=perms.data?.approve===true;
  const exportAllowed=perms.data?.export===true;
  const settings=useVpBillingSettings(view);
  const stats=useVpBillingSummary(view);
  const [page,setPage]=useState(0);
  useEffect(()=>setPage(0),[tenant.id,branch]);
  const invoices=useVpBillingInvoices(view,100,page*100);
  const ready=useVpBillingReady(create);
  const breakdown=useVpBillingBreakdown(view);
  const legacy=useVpBillingLegacyCount(view);
  const [configOpen,setConfigOpen]=useState(false);
  const [prefix,setPrefix]=useState('');
  const [days,setDays]=useState('30');
  const [raiseFor,setRaiseFor]=useState<ReadyCase|null>(null);
  const [fee,setFee]=useState('');
  const [taxTreatment,setTaxTreatment]=useState<TaxTreatment|'Unselected'>('Unselected');
  const [taxRate,setTaxRate]=useState('');
  const [taxNote,setTaxNote]=useState('');
  const [paymentFor,setPaymentFor]=useState<BillingInvoice|null>(null);
  const [paymentAmount,setPaymentAmount]=useState('');
  const [paymentDate,setPaymentDate]=useState('');
  const [paymentRef,setPaymentRef]=useState('');
  const [paymentMethod,setPaymentMethod]=useState<PaymentMethod>('NEFT');
  const receipts=useVpBillingReceipts(paymentFor?.invoice_id??null,view);
  const [busy,setBusy]=useState(false);
  const [exporting,setExporting]=useState(false);
  const errors=[perms.error,settings.error,stats.error,invoices.error,ready.error,breakdown.error,legacy.error].filter(Boolean);

  async function refresh(){
    await Promise.all([
      qc.invalidateQueries({queryKey:['vp-billing',tenant.id]}),
      qc.invalidateQueries({queryKey:['vp-live-cases',tenant.id]}),
      qc.invalidateQueries({queryKey:['vp-report-versions',tenant.id]}),
    ]);
  }
  function openConfig(){setPrefix(settings.data?.invoice_prefix??'');setDays(String(settings.data?.payment_days??30));setConfigOpen(true);}
  function openRaise(c:ReadyCase){
    setRaiseFor(c);setFee(c.fee_suggestion!==null?String(c.fee_suggestion):'');
    setTaxTreatment('Unselected');setTaxRate('');setTaxNote('');
  }
  async function saveConfig(){
    const n=Number(days);
    if(!Number.isInteger(n)||n<1||n>365){toast.error('Payment terms must be between 1 and 365 days');return;}
    setBusy(true);
    try{await vpBillingSaveSettings(prefix.trim(),n);await refresh();setConfigOpen(false);toast.success('Billing settings saved');}
    catch(e){toast.error(errMsg(e));}finally{setBusy(false);}
  }
  async function issue(){
    if(!raiseFor||taxTreatment==='Unselected'){ toast.error('Choose GST treatment'); return; }
    const f=amount(fee),t=amount(taxRate);
    if(!(f>0)||!Number.isFinite(t)||t<0||t>100){toast.error('Enter an explicit fee and GST rate');return;}
    if(taxTreatment==='No GST'&&(!taxNote.trim()||t!==0)){ toast.error('No GST requires rate 0 and an explanation'); return; }
    if(taxTreatment!=='No GST'&&t<=0){ toast.error('Enter a positive GST rate for the selected treatment'); return; }
    setBusy(true);
    try{await vpBillingRaise(raiseFor.case_num,f,taxTreatment,t,taxNote.trim());
      setRaiseFor(null);setPage(0);await refresh();toast.success('Invoice raised and saved to Supabase');}
    catch(e){toast.error(errMsg(e));}finally{setBusy(false);}
  }
  function openPayment(i:BillingInvoice){
    setPaymentFor(i);setPaymentAmount('');setPaymentRef('');setPaymentMethod('NEFT');
    setPaymentDate(new Date().toLocaleDateString('en-CA'));
  }
  async function recordPayment(){
    if(!paymentFor)return;
    const n=amount(paymentAmount);
    if(!(n>0)||n>paymentFor.outstanding){ toast.error('Amount must be positive and not exceed outstanding'); return; }
    if(paymentRef.trim().length<4){ toast.error('Enter a unique receipt/bank reference'); return; }
    setBusy(true);
    try{await vpBillingRecordPayment(paymentFor.invoice_id,n,paymentDate,paymentRef.trim(),paymentMethod);
      await refresh();await qc.invalidateQueries({queryKey:['vp-billing',tenant.id,'receipts',paymentFor.invoice_id]});
      setPaymentFor(null);toast.success('Collection recorded; invoice balance updated');}
    catch(e){toast.error(errMsg(e));}finally{setBusy(false);}
  }
  async function exportInvoices(){
    if(!exportAllowed)return;
    setExporting(true);
    try{
      const rows:(string|number)[][]=[['Invoice','Case','Bank','Branch','Date','Due','Fee',
        'Tax treatment','Tax rate %','CGST','SGST','IGST','Total','Collected','Outstanding','Status']];
      for(let offset=0;;offset+=500){
        const batch=await fetchVpBillingInvoices(branch,500,offset);
        for(const i of batch)rows.push([i.invoice_no,i.case_no,i.bank_name,i.branch_name,
          i.created_date,i.due_date,i.service_fee,i.tax_treatment,i.tax_rate,i.cgst,
          i.sgst,i.igst,i.total,i.paid,i.outstanding,i.status]);
        if(batch.length<500)break;
      }
      downloadCSV(`valuationpro-invoices-${new Date().toLocaleDateString('en-CA')}.csv`,rows);
      toast.success('Invoice CSV prepared (tenant and branch scoped)');
    }catch(e){toast.error(errMsg(e));}finally{setExporting(false);}
  }
  const s=stats.data??{invoice_count:0,billed:0,collected:0,outstanding:0,overdue:0};
  const bankRows=(breakdown.data??[]).filter(x=>x.kind==='Bank').sort((a,b)=>b.billed-a.billed);
  const branchRows=(breakdown.data??[]).filter(x=>x.kind==='Branch').sort((a,b)=>b.billed-a.billed);
  const maxBank=Math.max(1,...bankRows.map(x=>x.billed));
  return <AppShell>
    <PageHeader title="Billing & MIS" description="Actual released-report invoices, partial collections and tenant-scoped branch/bank MIS. GST treatment and rate are entered explicitly.">
      {approve&&<Button variant="outline" size="sm" onClick={openConfig}><Settings2 className="size-4"/>Billing setup</Button>}
      {exportAllowed&&<Button variant="outline" size="sm" disabled={exporting||!view} onClick={()=>void exportInvoices()}><Download className="size-4"/>{exporting?'Exporting…':'Export CSV'}</Button>}
    </PageHeader>
    <VpFin03ARegister />
    <VpFin03BBilling />
    <VpFin03CReceivables />
    <VpFin04APolicy />
    <VpFin04BReview />
    <VpFin04CReview />
    <VpFin04DAdvances />
    {errors.length>0&&<p className="mb-4 rounded-md border border-destructive/40 p-3 text-sm text-destructive">Database error: {errMsg(errors[0])}</p>}
    {perms.isLoading&&<p className="mb-4 text-sm text-muted-foreground">Checking billing permissions…</p>}
    {!perms.isLoading&&!view&&<Card><CardContent className="p-6 text-sm text-muted-foreground">Billing access is not configured for your role. Ask your tenant administrator to enable <strong>billing.View</strong> in the Role Matrix.</CardContent></Card>}
    {view&&<>
      {!settings.isLoading&&!settings.data&&<p className="mb-4 rounded-md border border-warning/40 p-3 text-sm">Invoice numbering and payment terms are not configured. An authorized billing approver must complete Billing setup before raising invoices.</p>}
      {(legacy.data??0)>0&&<p className="mb-4 rounded-md border p-3 text-xs text-muted-foreground">{legacy.data} historical invoice(s) in the original <code>invoices</code> table are not linked to a case. They are excluded from Phase 6 metrics until explicitly reconciled; no historical values were fabricated.</p>}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total billed" value={fmtINR(s.billed)} icon={<Receipt className="size-4"/>}/>
        <StatCard label="Collected" value={fmtINR(s.collected)} icon={<IndianRupee className="size-4"/>}/>
        <StatCard label="Outstanding" value={fmtINR(s.outstanding)}/>
        <StatCard label="Overdue" value={fmtINR(s.overdue)} icon={<TriangleAlert className="size-4"/>}/>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">{s.invoice_count} case-linked invoices in this {branch==='all'?'agency':'branch'} · Amounts are billed service fees plus recorded tax, not property valuations. Overdue is based on the invoice due date and outstanding balance.</p>
      {create&&<Card className="mb-4 border-border shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-base">Ready to bill ({ready.data?.length??0})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ready.isLoading&&<p className="text-sm text-muted-foreground">Loading released reports…</p>}
          {!ready.isLoading&&ready.data?.length===0&&<p className="text-sm text-muted-foreground">No newly released, unbilled reports. Only completed Phase 5 report releases are billable.</p>}
          {(ready.data??[]).map(c=><div key={c.case_num} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
            <div><span className="font-mono text-xs">{c.case_no}</span> · {c.bank_name} · {c.branch_name}<div className="text-xs text-muted-foreground">{c.fee_suggestion!=null?`Recorded case fee: ${fmtINR(c.fee_suggestion)}`:'No recorded case fee — enter agreed service charge'}</div></div>
            <Button size="sm" disabled={!settings.data} onClick={()=>openRaise(c)}><Plus className="size-3.5"/>Raise invoice</Button>
          </div>)}
        </CardContent></Card>}
      <Card className="mb-4 border-border shadow-sm"><CardContent className="p-0"><Table>
        <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Bank / Case</TableHead><TableHead>Date / Due</TableHead><TableHead className="text-right">Fee</TableHead><TableHead className="text-right">CGST</TableHead><TableHead className="text-right">SGST</TableHead><TableHead className="text-right">IGST</TableHead><TableHead className="text-right">Total</TableHead><TableHead className="text-right">Balance</TableHead><TableHead>Status</TableHead><TableHead/></TableRow></TableHeader>
        <TableBody>{(invoices.data??[]).map(i=><TableRow key={i.invoice_id}>
          <TableCell className="font-mono text-xs">{i.invoice_no}</TableCell>
          <TableCell className="text-xs">{i.bank_name}<div className="text-muted-foreground">{i.case_no}</div></TableCell>
          <TableCell className="text-xs">{i.created_date}<div className="text-muted-foreground">Due: {i.due_date}</div></TableCell>
          <TableCell className="text-right">{fmtINR(i.service_fee)}</TableCell>
          <TableCell className="text-right">{fmtINR(i.cgst)}</TableCell>
          <TableCell className="text-right">{fmtINR(i.sgst)}</TableCell>
          <TableCell className="text-right">{fmtINR(i.igst)}</TableCell>
          <TableCell className="text-right font-semibold">{fmtINR(i.total)}</TableCell>
          <TableCell className="text-right">{fmtINR(i.outstanding)}</TableCell>
          <TableCell><Badge variant={i.status==='Overdue'?'destructive':i.status==='Paid'?'secondary':'outline'}>{i.status}</Badge></TableCell>
          <TableCell className="text-right"><Button size="sm" variant="outline" onClick={()=>openPayment(i)}><CreditCard className="size-3"/>{approve&&i.outstanding>0?'Collect':'Receipts'}</Button></TableCell>
        </TableRow>)}
          {!invoices.isLoading&&invoices.data?.length===0&&<TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No case-linked invoices found.</TableCell></TableRow>}
        </TableBody></Table></CardContent>
        <div className="flex items-center justify-end gap-2 px-3 py-2 text-xs"><span>Page {page+1}</span><Button size="sm" variant="outline" disabled={page===0} onClick={()=>setPage(x=>Math.max(0,x-1))}>Previous</Button><Button size="sm" variant="outline" disabled={(invoices.data??[]).length<100} onClick={()=>setPage(x=>x+1)}>Next</Button></div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-base">Branch MIS — billed revenue</CardTitle></CardHeader><CardContent className="p-0"><Table>
          <TableHeader><TableRow><TableHead>Branch</TableHead><TableHead className="text-right">Invoices</TableHead><TableHead className="text-right">Billed</TableHead><TableHead className="text-right">Collected</TableHead><TableHead className="text-right">Outstanding</TableHead></TableRow></TableHeader>
          <TableBody>{branchRows.map(x=><TableRow key={x.label}><TableCell>{x.label||'Unassigned'}</TableCell><TableCell className="text-right">{x.invoice_count}</TableCell><TableCell className="text-right">{fmtINR(x.billed)}</TableCell><TableCell className="text-right">{fmtINR(x.collected)}</TableCell><TableCell className="text-right">{fmtINR(x.outstanding)}</TableCell></TableRow>)}{branchRows.length===0&&<TableRow><TableCell colSpan={5} className="py-6 text-center text-muted-foreground">No billing activity</TableCell></TableRow>}</TableBody>
        </Table></CardContent></Card>
        <Card className="border-border shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-base">Revenue by bank — billed</CardTitle></CardHeader><CardContent className="space-y-3">
          {bankRows.map(x=><div key={x.label} className="text-sm"><div className="mb-1 flex justify-between gap-2"><span>{x.label}</span><span className="font-medium">{fmtINR(x.billed)}</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{width:`${(x.billed/maxBank)*100}%`}}/></div><div className="mt-1 text-xs text-muted-foreground">Collected {fmtINR(x.collected)} · Due {fmtINR(x.outstanding)}</div></div>)}
          {bankRows.length===0&&<p className="text-sm text-muted-foreground">No billed bank revenue yet.</p>}
        </CardContent></Card>
      </div>
    </>}

    <Dialog open={configOpen} onOpenChange={setConfigOpen}><DialogContent>
      <DialogHeader><DialogTitle>Billing setup</DialogTitle><DialogDescription>Specify your actual invoice prefix and agreed credit period. No tax rate is assumed by this configuration.</DialogDescription></DialogHeader>
      <div className="space-y-3"><div><Label>Invoice prefix</Label><Input value={prefix} onChange={e=>setPrefix(e.target.value.toUpperCase())} placeholder="YOURORG/INV"/><p className="text-xs text-muted-foreground">Format: prefix/YYYY/00001. Only uppercase letters, digits, / and -.</p></div>
        <div><Label>Payment terms (days)</Label><Input type="number" min={1} max={365} value={days} onChange={e=>setDays(e.target.value)}/></div></div>
      <DialogFooter><Button variant="outline" onClick={()=>setConfigOpen(false)}>Cancel</Button><Button disabled={busy||!prefix} onClick={()=>void saveConfig()}>Save</Button></DialogFooter>
    </DialogContent></Dialog>

    <Dialog open={!!raiseFor} onOpenChange={o=>!o&&setRaiseFor(null)}><DialogContent>
      <DialogHeader><DialogTitle>Raise bank invoice</DialogTitle><DialogDescription>{raiseFor?.case_no} · {raiseFor?.bank_name}. Released report required. Confirm agreed service charge and tax treatment.</DialogDescription></DialogHeader>
      <div className="space-y-3">
        <div><Label>Service fee (₹)</Label><Input type="number" min="0.01" step="0.01" value={fee} onChange={e=>setFee(e.target.value)}/></div>
        <div><Label>Tax treatment</Label><Select value={taxTreatment} onValueChange={v=>{setTaxTreatment(v as TaxTreatment);setTaxRate('');setTaxNote('');}}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Unselected">Select treatment</SelectItem><SelectItem value="CGST+SGST">CGST + SGST (intra-state)</SelectItem><SelectItem value="IGST">IGST (inter-state)</SelectItem><SelectItem value="No GST">No GST (requires reason)</SelectItem></SelectContent></Select></div>
        <div><Label>Tax rate (%) — enter actual applicable rate</Label><Input type="number" min={0} max={100} step="0.01" value={taxRate} onChange={e=>setTaxRate(e.target.value)}/></div>
        {taxTreatment==='No GST'&&<div><Label>Reason for no GST</Label><Input value={taxNote} onChange={e=>setTaxNote(e.target.value)} placeholder="Enter verified reason"/></div>}
        <p className="text-xs text-muted-foreground">Tax classification and applicability must be checked against the actual transaction. This form does not generate a statutory GST tax-invoice PDF.</p>
      </div>
      <DialogFooter><Button variant="outline" onClick={()=>setRaiseFor(null)}>Cancel</Button><Button disabled={busy||!fee||!taxRate||taxTreatment==='Unselected'} onClick={()=>void issue()}>{busy?'Saving…':'Raise invoice'}</Button></DialogFooter>
    </DialogContent></Dialog>

    <Dialog open={!!paymentFor} onOpenChange={o=>!o&&setPaymentFor(null)}><DialogContent>
      <DialogHeader><DialogTitle>Collections & receipts</DialogTitle><DialogDescription>{paymentFor?.invoice_no} · Outstanding {fmtINR(paymentFor?.outstanding??0)}. Record actual bank receipts only.</DialogDescription></DialogHeader>
      <div className="max-h-28 space-y-1 overflow-auto text-xs">{(receipts.data??[]).map(r=><p key={r.id}>{r.payment_date} · {fmtINR(r.amount)} · {r.method} · {r.reference}</p>)}{!receipts.isLoading&&!receipts.data?.length&&<p className="text-muted-foreground">No recorded receipt entries.</p>}</div>
      {approve&&(paymentFor?.outstanding??0)>0&&<div className="grid gap-3"><div><Label>Amount received (₹)</Label><Input type="number" min="0.01" step="0.01" value={paymentAmount} onChange={e=>setPaymentAmount(e.target.value)}/></div><div><Label>Date received</Label><Input type="date" value={paymentDate} onChange={e=>setPaymentDate(e.target.value)}/></div><div><Label>Payment method</Label><Select value={paymentMethod} onValueChange={v=>setPaymentMethod(v as PaymentMethod)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{methods.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div><div><Label>Bank / receipt reference (unique)</Label><Input value={paymentRef} onChange={e=>setPaymentRef(e.target.value)}/></div></div>}
      <DialogFooter><Button variant="outline" onClick={()=>setPaymentFor(null)}>Close</Button>{approve&&(paymentFor?.outstanding??0)>0&&<Button disabled={busy||!paymentAmount||!paymentRef||!paymentDate} onClick={()=>void recordPayment()}>{busy?'Saving…':'Record collection'}</Button>}</DialogFooter>
    </DialogContent></Dialog>
  </AppShell>;
}
