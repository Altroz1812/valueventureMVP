import { VpFin02BConfig } from '@/components/admin/vp-fin02b-config';
import {VpFin02BankConfig} from '@/components/admin/vp-fin02-config';
import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {CalendarClock,Landmark,Layers,Percent,Plus} from 'lucide-react';
import {toast} from 'sonner';
import {AppShell,PageHeader} from '@/components/app-shell';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card,CardContent} from '@/components/ui/card';
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {fmtINR} from '@/lib/data';
import {useVpBanks,useVpPropertyTypes,type PropertyType,type VpBank} from '@/lib/vp-cases';
import {useApp} from '@/lib/app-context';
import {vpDb} from '@/lib/vp-db';
import {VpP20TemplateAdmin} from '@/components/admin/vp-p20-template-admin';
import {VpP18TemplateAdmin} from '@/components/admin/vp-p18-template-admin';

export const Route=createFileRoute('/admin/bank-masters')({
  head:()=>({meta:[{title:'ValuationPro — Bank Masters & Rate Cards'},
    {name:'description',content:'Tenant banks and valuation tariffs.'}]}),
  component:BankMastersPage,
});
function BankMastersPage(){
  const {tenant}=useApp();
  const qc=useQueryClient();
  const {data:banks=[],isLoading,error}=useVpBanks();
  const {data:propertyTypes=[],isLoading:propertyTypesLoading,error:propertyTypesError}=useVpPropertyTypes();
  const activeTypes=propertyTypes.filter(t=>t.is_active);
  const [tab,setTab]=useState('all');
  const [rateCard,setRateCard]=useState<VpBank|null>(null);
  const [addOpen,setAddOpen]=useState(false);
  const [bankName,setBankName]=useState('');
  const [alias,setAlias]=useState('');
  const [kind,setKind]=useState<VpBank['kind']>('bank');
  const [rate,setRate]=useState('0');
  const [saving,setSaving]=useState(false);
  const [ptype,setPtype]=useState<PropertyType>('Flat');
  const [typeSaving,setTypeSaving]=useState<string|null>(null);
  const [fee,setFee]=useState('');
  const [tat,setTat]=useState('3');
  const list=banks.filter(b=>tab==='all'||b.kind===tab);
  const flatFees=banks.flatMap(b=>b.tariffs.filter(x=>x.property_type==='Flat').map(x=>x.fee));
  const avgFlat=flatFees.length?fmtINR(Math.round(flatFees.reduce((a,b)=>a+b,0)/flatFees.length)):'—';
  async function setPropertyTypeActive(code:PropertyType,isActive:boolean){
    setTypeSaving(code);
    try {
      const {error}=await vpDb.rpc('vp_admin_set_property_type',{
        p_code:code,p_active:isActive,
      });
      if(error) throw error;
      await qc.invalidateQueries({queryKey:['vp-property-types',tenant.id]});
      toast.success(`${code} ${isActive?'enabled':'disabled'} for new cases`);
    }catch(e){toast.error(e instanceof Error?e.message:'Unable to update property type');}
    finally{setTypeSaving(null);}
  }
  async function saveBank(){
    if(!bankName.trim()){toast.error('Bank name is required');return;}
    setSaving(true);
    try{
      const {error}=await vpDb.rpc('vp_admin_save_bank',{p_name:bankName.trim(),p_alias:alias.trim(),p_kind:kind,p_rate:Number(rate)});
      if(error) throw error;
      await qc.invalidateQueries({queryKey:['vp-live-banks',tenant.id]});
      toast.success('Bank saved to Supabase');setAddOpen(false);setBankName('');setAlias('');setRate('0');
    }catch(e){toast.error(e instanceof Error?e.message:'Unable to save bank');}
    finally{setSaving(false);}
  }
  async function saveTariff(){
    if(!rateCard || !activeTypes.some(t=>t.code===ptype)){toast.error('Select an active property type');return;}
    setSaving(true);
    try{
      const {error}=await vpDb.rpc('vp_admin_save_tariff',{
        p_bank_name:rateCard.name,p_property_type:ptype,p_fee:Number(fee),p_tat_days:Number(tat),
      });
      if(error) throw error;
      await qc.invalidateQueries({queryKey:['vp-live-banks',tenant.id]});
      toast.success('Rate card updated');setRateCard(null);setFee('');
    }catch(e){toast.error(e instanceof Error?e.message:'Unable to save tariff');}
    finally{setSaving(false);}
  }
  return <AppShell>
    <PageHeader title="Bank Masters & Rate Cards" description="Bank and NBFC client masters and agreed property-category tariffs.">
      <Button size="sm" onClick={()=>setAddOpen(true)}><Plus className="size-4" /> Add Bank</Button>
    </PageHeader>
    <VpFin02BankConfig />
    <VpFin02BConfig />
    {error&&<p className="mb-4 rounded border border-destructive p-2 text-destructive">{error.message}</p>}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[
      {l:'Client Banks',v:banks.length,i:Landmark},
      {l:'Agency Branches Linked',v:'—',i:Layers},
      {l:'Empanelments Expiring <90d',v:'—',i:CalendarClock},
      {l:'Avg. Flat Fee (configured)',v:avgFlat,i:Percent},
    ].map(k=><Card key={k.l} className="border-border shadow-sm"><CardContent className="flex items-center gap-3 p-4">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10"><k.i className="size-4 text-primary" /></span><div><p className="font-display text-xl font-bold leading-none">{k.v}</p><p className="mt-1 text-[11px] text-muted-foreground">{k.l}</p></div>
    </CardContent></Card>)}</div>
    <Card className="mt-5 border-border shadow-sm"><CardContent className="p-4">
      <div className="mb-3"><h3 className="font-display text-sm font-semibold">Property Type Master</h3>
        <p className="text-xs text-muted-foreground">These are the four categories permitted by your existing cases.prod constraint. Enabling or disabling a category does not modify historical cases.</p></div>
      {propertyTypesError&&<p role="alert" className="mb-2 text-sm text-destructive">{propertyTypesError.message}</p>}
      <Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Code</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Manage</TableHead></TableRow></TableHeader><TableBody>
        {propertyTypes.map(t=><TableRow key={t.code}>
          <TableCell>{t.name}</TableCell><TableCell className="font-mono text-xs">{t.code}</TableCell>
          <TableCell><Badge variant="outline">{t.is_active?'Active':'Inactive'}</Badge></TableCell>
          <TableCell className="text-right"><Button size="sm" variant="outline" disabled={!!typeSaving}
            onClick={()=>setPropertyTypeActive(t.code,!t.is_active)}>{typeSaving===t.code?'Saving…':t.is_active?'Deactivate':'Activate'}</Button></TableCell>
        </TableRow>)}
        {!propertyTypesLoading&&propertyTypes.length===0&&<TableRow><TableCell colSpan={4} className="text-muted-foreground">No property types found. Apply the Property Type Master SQL migration.</TableCell></TableRow>}
      </TableBody></Table>
    </CardContent></Card>
    <Tabs value={tab} onValueChange={setTab} className="mt-3"><TabsList>
      <TabsTrigger value="all">All Clients</TabsTrigger><TabsTrigger value="bank">Banks</TabsTrigger>
      <TabsTrigger value="private">Private Banks</TabsTrigger><TabsTrigger value="nbfc">NBFCs</TabsTrigger>
      <TabsTrigger value="other">Other</TabsTrigger>
    </TabsList></Tabs>
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm"><Table>
      <TableHeader><TableRow className="bg-muted/50"><TableHead>Client</TableHead><TableHead className="hidden md:table-cell">Type</TableHead><TableHead>Empanelled Branches</TableHead><TableHead className="hidden lg:table-cell">Validity</TableHead><TableHead className="hidden xl:table-cell">Default Format</TableHead><TableHead className="text-right">Rate Card</TableHead></TableRow></TableHeader>
      <TableBody>{list.map(b=><TableRow key={b.name}>
        <TableCell><p className="text-sm font-semibold">{b.name}</p><p className="text-[11px] text-muted-foreground">{b.alias||'—'}</p></TableCell>
        <TableCell className="hidden md:table-cell"><Badge variant="outline">{b.kind}</Badge></TableCell>
        <TableCell className="text-xs text-muted-foreground">Not configured</TableCell>
        <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">Not configured</TableCell>
        <TableCell className="hidden text-xs text-muted-foreground xl:table-cell">Not configured</TableCell>
        <TableCell className="text-right"><Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={()=>{setRateCard(b);setFee('');setTat('3');setPtype(activeTypes[0]?.code??'Flat');}}>{b.tariffs.length} tariffs · View</Button></TableCell>
      </TableRow>)}{!isLoading&&list.length===0&&<TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No client banks. Add a bank to configure case intake.</TableCell></TableRow>}</TableBody>
    </Table></div>
    <Dialog open={addOpen} onOpenChange={setAddOpen}><DialogContent><DialogHeader><DialogTitle>Add bank / NBFC</DialogTitle><DialogDescription>Client details are stored in the existing banks table.</DialogDescription></DialogHeader>
      <div className="grid gap-3"><div><Label>Client bank name</Label><Input value={bankName} onChange={e=>setBankName(e.target.value)}/></div>
        <div><Label>Alias / code</Label><Input value={alias} onChange={e=>setAlias(e.target.value)}/></div>
        <div><Label>Kind</Label><select className="h-9 w-full rounded-md border bg-background px-2" value={kind} onChange={e=>setKind(e.target.value as VpBank['kind'])}><option value="bank">Bank</option><option value="private">Private Bank</option><option value="nbfc">NBFC</option><option value="other">Other</option></select></div>
        <div><Label>Existing bank rate (not used for case tariff)</Label><Input type="number" min={0} value={rate} onChange={e=>setRate(e.target.value)}/></div>
      </div><DialogFooter><Button variant="outline" onClick={()=>setAddOpen(false)}>Cancel</Button><Button disabled={saving||rate.trim()===''} onClick={saveBank}>{saving?'Saving…':'Save bank'}</Button></DialogFooter>
    </DialogContent></Dialog>
    <Dialog open={!!rateCard} onOpenChange={o=>!o&&setRateCard(null)}><DialogContent>{rateCard&&<>
      <DialogHeader><DialogTitle className="font-display">{rateCard.name} — Tariff Rate Card</DialogTitle><DialogDescription>Set an explicit tariff for each property type. The existing banks.rate is not treated as an INR fee.</DialogDescription></DialogHeader>
      <Table><TableHeader><TableRow><TableHead>Property Type</TableHead><TableHead className="text-right">Fee</TableHead><TableHead className="text-right">TAT</TableHead></TableRow></TableHeader><TableBody>
        {rateCard.tariffs.map(r=><TableRow key={r.property_type}><TableCell>{r.property_type}</TableCell><TableCell className="text-right">{fmtINR(r.fee)}</TableCell><TableCell className="text-right">{r.tat_days} days</TableCell></TableRow>)}
        {rateCard.tariffs.length===0&&<TableRow><TableCell colSpan={3} className="text-muted-foreground">No category tariffs yet. Case creation is allowed; fees will remain pending until a tariff is configured.</TableCell></TableRow>}
      </TableBody></Table>
      <div className="grid grid-cols-3 gap-2"><div><Label>Property type</Label><select className="h-9 w-full rounded-md border bg-background px-1" value={ptype} onChange={e=>setPtype(e.target.value as typeof ptype)}>{activeTypes.map(t=><option key={t.code} value={t.code}>{t.name}</option>)}</select></div><div><Label>Fee (₹)</Label><Input type="number" min={0} value={fee} onChange={e=>setFee(e.target.value)}/></div><div><Label>TAT days</Label><Input type="number" min={1} value={tat} onChange={e=>setTat(e.target.value)}/></div></div>
      <DialogFooter><Button disabled={saving||fee.trim()===''||!activeTypes.some(t=>t.code===ptype)} onClick={saveTariff}>{saving?'Saving…':'Save tariff'}</Button></DialogFooter>
      <p className="text-[11px] text-muted-foreground">Empanelment validity and bank-specific report formats will be configured in a later phase.</p>
    </>}</DialogContent></Dialog>
    <VpP18TemplateAdmin/>
    <VpP20TemplateAdmin banks={banks}/>
  </AppShell>;
}
