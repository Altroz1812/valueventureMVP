import { VoiceMic, VoiceOption, VoiceLanguage, type VoiceLang } from '@/components/voice/vp-voice';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LayoutGrid, List, Plus, Search, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, PageHeader } from '@/components/app-shell';
import { PriorityBadge, TatBadge } from '@/components/ops-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog,DialogContent,DialogFooter,DialogHeader,DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select';
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from '@/components/ui/table';
import { useApp } from '@/lib/app-context';
import { fmtINR } from '@/lib/data';
import { STAGES } from '@/lib/ops';
import { useVpBanks,useVpCases,useVpPropertyTypes,type VpCase } from '@/lib/vp-cases';
import { vpDb } from '@/lib/vp-db';

export const Route=createFileRoute('/cases')({
  head:()=>({meta:[{title:'ValuationPro — Case Pipeline'},
    {name:'description',content:'Track valuation cases across branches and banks.'}]}),
  component:CasesPage,
});

function CasesPage() {
  const {tenant,branch,tenantBranches,tenantUsers,can}=useApp();
  const queryClient=useQueryClient();
  const {cases:scoped,allCases,isLoading,error}=useVpCases();
  const {data:banksData}=useVpBanks();
  const [view,setView]=useState<'table'|'board'>('table');
  const [q,setQ]=useState('');
  const [stage,setStage]=useState('all');
  const [bank,setBank]=useState('all');
  const [prio,setPrio]=useState('all');
  const [open,setOpen]=useState(false);
  const [assignFor,setAssignFor]=useState<VpCase|null>(null);
  const [assigning,setAssigning]=useState(false);
  const rows=useMemo(()=>scoped.filter(c=>(stage==='all'||c.stage===stage)
    &&(bank==='all'||c.bank===bank)&&(prio==='all'||c.priority===prio)
    &&(!q||`${c.caseNo} ${c.customer} ${c.property} ${c.assignedTo}`.toLowerCase().includes(q.toLowerCase()))),
    [scoped,stage,bank,prio,q]);
  const banks=[...new Set(scoped.map(c=>c.bank))];
  const legacyStages=[...new Set(rows.map(c=>c.stage).filter(s=>!STAGES.includes(s)))];

  async function assign(c:VpCase,userId:string) {
    setAssigning(true);
    const who=tenantUsers.find(u=>u.id===userId);
    try {
      const {error}=await vpDb.rpc('vp_case_assign',{p_case_num:c.caseNum,p_user_id:userId});
      if(error) throw error;
      await queryClient.invalidateQueries({queryKey:['vp-live-cases',tenant.id]});
      toast.success(`Assigned to ${who?.name??'selected user'}`);
      setAssignFor(null);
    } catch(e) {toast.error(e instanceof Error?e.message:'Assignment failed');}
    finally {setAssigning(false);}
  }
  return <AppShell>
    <PageHeader title="Cases" description="Full valuation pipeline across your branches. Filter, assign and open new cases.">
      <div className="flex rounded-md border border-border">
        <Button size="sm" variant={view==='table'?'secondary':'ghost'} onClick={()=>setView('table')} aria-label="Table view" aria-pressed={view==='table'}><List className="size-4" /></Button>
        <Button size="sm" variant={view==='board'?'secondary':'ghost'} onClick={()=>setView('board')} aria-label="Board view" aria-pressed={view==='board'}><LayoutGrid className="size-4" /></Button>
      </div>
      {can('cases.Create') && <Button onClick={()=>setOpen(true)}><Plus className="size-4" /> New case</Button>}
    </PageHeader>
    {error && <p role="alert" className="mb-4 rounded-md border border-destructive p-3 text-sm text-destructive">Database error: {error.message}</p>}
    {tenantBranches.length===0 && <p className="mb-3 rounded-md border p-3 text-sm">No branches configured. <Link to="/admin/branches" className="underline">Create an agency branch</Link> before creating a case.</p>}
    {(banksData??[]).length===0 && <p className="mb-3 rounded-md border p-3 text-sm">No client banks configured. <Link to="/admin/bank-masters" className="underline">Add a client bank</Link> before creating a case.</p>}
    <section aria-label="Case filters" className="mb-3 rounded-lg border bg-card p-2.5"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="size-4" strokeWidth={1.65} aria-hidden="true"/>Case filters</div><p role="status" className="text-sm text-muted-foreground">{error?'Case list unavailable':isLoading?'Loading cases…':`${rows.length} of ${scoped.length} visible cases`}</p></div><div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 w-full sm:w-64 lg:w-60"><Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-8" aria-label="Search loaded cases" placeholder="Case, customer, property…" value={q} onChange={e=>setQ(e.target.value)} /></div>
      <Filter value={stage} onChange={setStage} all="All stages" items={[...STAGES,...legacyStages]} />
      <Filter value={bank} onChange={setBank} all="All banks" items={banks} />
      <Filter value={prio} onChange={setPrio} all="All priorities" items={['High','Normal','Low']} />
      <Button variant="ghost" disabled={!q&&stage==='all'&&bank==='all'&&prio==='all'} onClick={()=>{setQ('');setStage('all');setBank('all');setPrio('all');}}>Clear filters</Button></div></section>
    {isLoading?<div className="py-10 text-center text-muted-foreground">Loading cases…</div>:view==='table'?
    <Card className="border-border shadow-sm"><CardContent className="p-0"><Table>
      <TableHeader><TableRow><TableHead>Case</TableHead><TableHead>Property</TableHead><TableHead>Bank</TableHead><TableHead>Stage</TableHead><TableHead>Assigned</TableHead><TableHead>Priority</TableHead><TableHead>TAT</TableHead><TableHead className="text-right">Fee</TableHead><TableHead /></TableRow></TableHeader>
      <TableBody>{rows.map(c=><TableRow key={c.id}>
        <TableCell className="font-mono text-xs"><Link to="/cases/$caseId" params={{caseId:c.id}} className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline">{c.caseNo}<ArrowUpRight className="size-3.5" aria-hidden="true"/></Link></TableCell>
        <TableCell><div className="font-medium">{c.property}</div><div className="text-xs text-muted-foreground">{c.propertyType} · {c.city}</div></TableCell>
        <TableCell>{c.bank}</TableCell><TableCell><Badge variant="outline">{c.stage}</Badge></TableCell>
        <TableCell>{c.assignedTo}</TableCell><TableCell>{c.priorityKnown?<PriorityBadge p={c.priority}/>:<span>—</span>}</TableCell>
        <TableCell><TatBadge c={c}/></TableCell><TableCell className="text-right">{c.feeKnown?fmtINR(c.fee):'—'}</TableCell>
        <TableCell>{can('cases.Assign') && <Button size="sm" variant="ghost" onClick={()=>setAssignFor(c)}>Assign</Button>}</TableCell>
      </TableRow>)}{rows.length===0 && <TableRow><TableCell colSpan={9} className="py-10 text-center text-muted-foreground">No cases match these filters.</TableCell></TableRow>}</TableBody>
    </Table></CardContent></Card>:
    <div className="flex gap-3 overflow-x-auto pb-2">{[...STAGES,...legacyStages].map(s=>{
      const list=rows.filter(c=>c.stage===s);
      return <div key={s} className="w-64 shrink-0 rounded-lg bg-muted/50 p-2"><div className="mb-2 flex items-center justify-between px-1 text-sm font-semibold">{s}<Badge variant="secondary">{list.length}</Badge></div>
        <div className="space-y-2">{list.map(c=><Card key={c.id} className="border-border shadow-sm"><CardContent className="space-y-1.5 p-3">
          <Link to="/cases/$caseId" params={{caseId:c.id}} className="block font-mono text-[11px] text-muted-foreground hover:text-primary">{c.caseNo}</Link>
          <div className="text-sm font-medium leading-snug">{c.property}</div><div className="text-xs text-muted-foreground">{c.bank} · {c.assignedTo}</div>
          <div className="flex gap-1.5">{c.priorityKnown&&<PriorityBadge p={c.priority}/>}<TatBadge c={c}/></div>
        </CardContent></Card>)}</div>
      </div>;
    })}</div>}
    <NewCaseDialog open={open} onOpenChange={setOpen} />
    <Dialog open={!!assignFor} onOpenChange={o=>!o&&setAssignFor(null)}><DialogContent>
      <DialogHeader><DialogTitle>Reassign {assignFor?.caseNo}</DialogTitle></DialogHeader>
      <div className="space-y-1">{tenantUsers.filter(u=>u.status==='Active').map(u=><button key={u.id} disabled={assigning} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50" onClick={()=>assign(assignFor!,u.id)}><span className="font-medium">{u.name}</span><span className="text-xs text-muted-foreground">{u.role}</span></button>)}</div>
      <p className="text-xs text-muted-foreground">Available: active users in your agency. Branch-level user allocation will follow in a later phase.</p>
    </DialogContent></Dialog>
  </AppShell>;
}

function Filter({value,onChange,all,items}:{value:string;onChange:(v:string)=>void;all:string;items:string[]}) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={all} className="w-44 lg:w-36 max-w-full"><SelectValue /></SelectTrigger><SelectContent>
    <SelectItem value="all">{all}</SelectItem>{items.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}
  </SelectContent></Select>;
}

function NewCaseDialog({open,onOpenChange}:{open:boolean;onOpenChange:(o:boolean)=>void}) {
  const {tenant,branch,tenantBranches,tenantUsers}=useApp();
  const {data:banks=[]}=useVpBanks();
  const {data:propertyTypes=[],isLoading:typesLoading,error:typesError}=useVpPropertyTypes();
  const client=useQueryClient();
  const [br,setBr]=useState('');
  const [bankName,setBankName]=useState('');
  const [ptype,setPtype]=useState('');
  const [property,setProperty]=useState('');
  const [customer,setCustomer]=useState('');
  const [assignee,setAssignee]=useState('');
  const [priority,setPriority]=useState<'High'|'Normal'|'Low'>('Normal');
  const [busy,setBusy]=useState(false);
  const [voiceLang,setVoiceLang]=useState<VoiceLang>('en-IN');
  const branchId=br||(branch!=='all'?branch:tenantBranches.find(x=>x.status==='Active')?.id??'');
  const selectedBranch=tenantBranches.find(b=>b.id===branchId);
  const selectedBank=banks.find(b=>b.name===bankName);
  const tariff=selectedBank?.tariffs.find(r=>r.property_type===ptype);
  const fee=tariff?.fee;
  const tat=tariff?.tat_days;
  const allowedTypes=propertyTypes.filter(t=>t.is_active).map(t=>t.code);
  async function submit() {
    if(!selectedBranch||selectedBranch.status!=='Active'||!selectedBank||!allowedTypes.includes(ptype as (typeof allowedTypes)[number])||!property.trim()||!customer.trim()) {
      toast.error('Select an active branch, bank and property type; enter customer name and address');return;
    }
    setBusy(true);
    try {
      const {data,error}=await vpDb.rpc('vp_case_create',{
        p_branch_id:branchId,p_bank_name:bankName,p_customer:customer.trim(),p_product:ptype,
        p_address:property.trim(),p_assignee_user_id:assignee||null,p_priority:priority,
      });
      if(error) throw error;
      await client.invalidateQueries({queryKey:['vp-live-cases',tenant.id]});
      toast.success(`Case #${data} created`);
      setProperty('');setCustomer('');setPtype('');setBankName('');setAssignee('');onOpenChange(false);
    }catch(e){toast.error(e instanceof Error?e.message:'Unable to create case');}
    finally{setBusy(false);}
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-lg">
    <DialogHeader><DialogTitle>New valuation case</DialogTitle></DialogHeader>
    <VoiceLanguage value={voiceLang} onChange={setVoiceLang}/>
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Branch</Label><Select value={branchId} onValueChange={setBr}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{tenantBranches.filter(x=>x.status==='Active').map(x=><SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}</SelectContent></Select><VoiceOption label="Branch" lang={voiceLang} options={tenantBranches.filter(x=>x.status==='Active').map(b=>b.name)} onSelect={name=>{const chosen=tenantBranches.find(b=>b.name===name);if(chosen)setBr(chosen.id);}}/></div>
        <div><Label>Client bank</Label><Select value={bankName} onValueChange={v=>{setBankName(v);setPtype('');}}><SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger><SelectContent>{banks.map(b=><SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>)}</SelectContent></Select><VoiceOption label="Bank" lang={voiceLang} options={banks.map(b=>b.name)} onSelect={name=>{setBankName(name);setPtype('');}}/></div>
      </div>
      <div><Label>Customer name</Label><div className="flex gap-2"><Input value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Borrower / customer" /><VoiceMic lang={voiceLang} label="Customer name" onTranscript={spoken=>setCustomer(old=>old?`${old} ${spoken}`:spoken)}/></div></div>
      <div><Label>Property type</Label><Select value={ptype} onValueChange={setPtype} disabled={typesLoading||!!typesError}><SelectTrigger><SelectValue placeholder="Select property category" /></SelectTrigger><SelectContent>{allowedTypes.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><VoiceOption label="Property type" lang={voiceLang} disabled={!selectedBank} options={allowedTypes} onSelect={setPtype}/></div>
      <div><Label>Property address</Label><div className="flex gap-2"><Input value={property} onChange={e=>setProperty(e.target.value)} placeholder="e.g. Flat 504, Aparna Sarovar, Nallagandla" /><VoiceMic lang={voiceLang} label="Property address" onTranscript={spoken=>setProperty(old=>old?`${old} ${spoken}`:spoken)}/></div></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Assign to</Label><Select value={assignee||'unassigned'} onValueChange={v=>setAssignee(v==='unassigned'?'':v)}><SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger><SelectContent><SelectItem value="unassigned">Unassigned</SelectItem>{tenantUsers.filter(u=>u.status==='Active').map(u=><SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select><VoiceOption label="Assignee" lang={voiceLang} options={tenantUsers.filter(u=>u.status==='Active').map(u=>u.name)} onSelect={name=>{const who=tenantUsers.find(u=>u.name===name);if(who)setAssignee(who.id);}}/></div>
        <div><Label>Priority</Label><Select value={priority} onValueChange={v=>setPriority(v as typeof priority)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['High','Normal','Low'].map(p=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><VoiceOption label="Priority" lang={voiceLang} options={['High','Normal','Low']} onSelect={v=>setPriority(v as typeof priority)}/></div>
      </div>
      {selectedBank && selectedBranch && <div className="rounded-md bg-muted p-3 text-sm">Rate card fee <b>{tariff?fmtINR(fee!):'Pending configuration'}</b> · TAT <b>{tat??selectedBranch.tatDays} day(s)</b> · DB stage <b>Received</b></div>}
      {(!tenantBranches.length||!banks.length)&&<p className="text-xs text-muted-foreground">Set up a branch and a client bank in Administration first.</p>}
      {typesError&&<p role="alert" className="text-xs text-destructive">Property type master is unavailable: {typesError.message}</p>}
      {!typesLoading&&allowedTypes.length===0&&<p className="text-xs text-muted-foreground">No active property types. Ask your tenant administrator to enable a category in Bank Masters.</p>}
      {selectedBank&&ptype&&!tariff&&<p className="text-xs text-muted-foreground">No bank/property tariff is configured. The case can still be created; the fee will remain pending and the branch TAT will be used.</p>}
    </div>
    <DialogFooter><Button variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button><Button disabled={busy||typesLoading||!!typesError||!tenantBranches.length||!banks.length||!ptype||!allowedTypes.includes(ptype as (typeof allowedTypes)[number])} onClick={submit}>{busy?'Creating…':'Create case'}</Button></DialogFooter>
  </DialogContent></Dialog>;
}
