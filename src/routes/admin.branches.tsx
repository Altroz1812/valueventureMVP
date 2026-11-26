import {VpFin02BranchGeo} from '@/components/admin/vp-fin02-config';
import {createFileRoute,Link} from '@tanstack/react-router';
import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {Building2,MapPin,MoreHorizontal,Pencil,Plus,Settings2,Users,Landmark,Activity} from 'lucide-react';
import {toast} from 'sonner';
import {AppShell,PageHeader} from '@/components/app-shell';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card,CardContent} from '@/components/ui/card';
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {useApp} from '@/lib/app-context';
import {fmtINR,type Branch} from '@/lib/data';
import {useVpCases} from '@/lib/vp-cases';
import {vpDb} from '@/lib/vp-db';

export const Route=createFileRoute('/admin/branches')({
  head:()=>({meta:[{title:'ValuationPro — Agency Branches'},
    {name:'description',content:'Tenant-specific agency branch configuration.'}]}),
  component:BranchesPage,
});

type FormState={name:string;code:string;type:'Head Office'|'Regional'|'Local';city:string;
  state:string;pin:string;address:string;manager:string;email:string;phone:string;
  casePrefix:string;tatDays:string;geofenceKm:string;active:boolean};
const blank:FormState={name:'',code:'',type:'Local',city:'',state:'',pin:'',address:'',
  manager:'',email:'',phone:'',casePrefix:'',tatDays:'3',geofenceKm:'0',active:true};
function fromBranch(b:Branch):FormState {return {
  name:b.name,code:b.code,type:b.type,city:b.city,state:b.state,pin:b.pin,address:b.address,
  manager:b.manager,email:b.email,phone:b.phone,casePrefix:b.casePrefix,
  tatDays:String(b.tatDays),geofenceKm:String(b.geofenceKm),active:b.status==='Active',
};}
function BranchesPage(){
  const {tenant,tenantBranches,reloadBranches}=useApp();
  const {allCases}=useVpCases();
  const qc=useQueryClient();
  const [editOpen,setEditOpen]=useState(false);
  const [detailId,setDetailId]=useState<string|null>(null);
  const [editId,setEditId]=useState<string|null>(null);
  const [form,setForm]=useState<FormState>(blank);
  const [saving,setSaving]=useState(false);
  const detail=tenantBranches.find(b=>b.id===detailId);
  const activeCount=(b:Branch)=>allCases.filter(c=>c.branchId===b.id&&!['Approved','Delivered','Submitted','Invoiced'].includes(c.stage)).length;
  const kpis=[
    {label:'Total Branches',value:tenantBranches.length,icon:Building2},
    {label:'Active',value:tenantBranches.filter(b=>b.status==='Active').length,icon:Activity},
    {label:'Inactive',value:tenantBranches.filter(b=>b.status==='Inactive').length,icon:MapPin},
    {label:'Branch Users',value:'—',icon:Users},
  ];
  function startEdit(b?:Branch){setEditId(b?.id??null);setForm(b?fromBranch(b):blank);setEditOpen(true);}
  function field<K extends keyof FormState>(name:K,value:FormState[K]) {setForm(old=>({...old,[name]:value}));}
  async function save(){
    if(!form.name.trim()||!form.code||!form.city.trim()||!form.casePrefix){toast.error('Branch name, code, city and case prefix are required');return;}
    setSaving(true);
    try{
      const {error}=await vpDb.rpc('vp_admin_save_branch',{
        p_id:editId,p_name:form.name,p_code:form.code.toUpperCase(),p_type:form.type,
        p_city:form.city,p_state:form.state,p_pin:form.pin,p_address:form.address,
        p_manager:form.manager,p_email:form.email,p_phone:form.phone,p_prefix:form.casePrefix.toUpperCase(),
        p_tat_days:Number(form.tatDays),p_geofence_km:Number(form.geofenceKm),p_active:form.active,
      });
      if(error) throw error;
      await reloadBranches();await qc.invalidateQueries({queryKey:['vp-live-cases',tenant.id]});
      setEditOpen(false);toast.success('Branch saved to Supabase');
    }catch(e){toast.error(e instanceof Error?e.message:'Branch save failed');}
    finally{setSaving(false);}
  }
  return <AppShell>
    <PageHeader title="Agency Branches" description={`Offices of ${tenant.name}. Configuration inherits tenant defaults — override only what must differ.`}>
      <Button size="sm" onClick={()=>startEdit()}><Plus className="size-4" /> Add Branch</Button>
    </PageHeader>
    <VpFin02BranchGeo />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{kpis.map(k=><Card key={k.label} className="border-border shadow-sm"><CardContent className="flex items-center gap-3 p-4">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10"><k.icon className="size-4 text-primary" /></span>
      <div><p className="font-display text-xl font-bold leading-none">{k.value}</p><p className="mt-1 text-[11px] text-muted-foreground">{k.label}</p></div>
    </CardContent></Card>)}</div>
    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm"><Table>
      <TableHeader><TableRow className="bg-muted/50"><TableHead>Branch</TableHead><TableHead>Code</TableHead><TableHead className="hidden md:table-cell">Branch Manager</TableHead><TableHead>Users</TableHead><TableHead className="hidden sm:table-cell">Active Cases</TableHead><TableHead>Status</TableHead><TableHead className="w-24 text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>{tenantBranches.map(b=><TableRow key={b.id}>
        <TableCell><button className="text-left" onClick={()=>setDetailId(b.id)}><p className="text-sm font-semibold hover:underline">{b.name}</p><p className="text-[11px] text-muted-foreground">{b.city}, {b.state} · {b.type}</p></button></TableCell>
        <TableCell className="font-mono text-xs">{b.code}</TableCell><TableCell className="hidden text-xs md:table-cell">{b.manager||'—'}</TableCell>
        <TableCell className="text-xs font-medium">—</TableCell><TableCell className="hidden text-xs sm:table-cell">{activeCount(b)}</TableCell>
        <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
        <TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
          <DropdownMenuItem onClick={()=>setDetailId(b.id)}><Building2 className="size-4" /> View details</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>startEdit(b)}><Pencil className="size-4" /> Edit branch</DropdownMenuItem>
          <DropdownMenuItem disabled><Settings2 className="size-4" /> Advanced settings (later)</DropdownMenuItem>
        </DropdownMenuContent></DropdownMenu></TableCell>
      </TableRow>)}{tenantBranches.length===0&&<TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No branches yet. Add your first branch.</TableCell></TableRow>}</TableBody>
    </Table></div>
    <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent className="max-w-2xl">
      <DialogHeader><DialogTitle className="font-display">{editId?'Edit':'Add'} branch</DialogTitle><DialogDescription>Branch settings inherit tenant defaults unless overridden below.</DialogDescription></DialogHeader>
      <Tabs defaultValue="general"><TabsList className="flex w-full flex-wrap"><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="contact">Contact</TabsTrigger><TabsTrigger value="ops">Operational</TabsTrigger><TabsTrigger value="perm">Permissions</TabsTrigger><TabsTrigger value="integr">Integrations</TabsTrigger></TabsList>
        <TabsContent value="general" className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Branch name" value={form.name} onChange={v=>field('name',v)}/>
          <Field label="Branch code" value={form.code} onChange={v=>field('code',v.toUpperCase())}/>
          <div className="space-y-1.5"><Label className="text-xs">Branch type</Label><select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={form.type} onChange={e=>field('type',e.target.value as FormState['type'])}><option>Head Office</option><option>Regional</option><option>Local</option></select></div>
          <Field label="Branch manager" value={form.manager} onChange={v=>field('manager',v)}/>
        </TabsContent>
        <TabsContent value="contact" className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Address" value={form.address} onChange={v=>field('address',v)}/><Field label="City" value={form.city} onChange={v=>field('city',v)}/><Field label="State" value={form.state} onChange={v=>field('state',v)}/><Field label="PIN" value={form.pin} onChange={v=>field('pin',v)}/><Field label="Phone" value={form.phone} onChange={v=>field('phone',v)}/><Field label="Email" value={form.email} onChange={v=>field('email',v)}/></TabsContent>
        <TabsContent value="ops" className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Case numbering prefix" value={form.casePrefix} onChange={v=>field('casePrefix',v.toUpperCase())}/><Field label="Default case TAT (days)" value={form.tatDays} onChange={v=>field('tatDays',v)} type="number"/>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={e=>field('active',e.target.checked)}/> Active</label></TabsContent>
        <TabsContent value="perm" className="mt-4 text-sm text-muted-foreground">Case CRUD permissions are enforced using the Role Matrix. Branch-level user allocations will follow.</TabsContent>
        <TabsContent value="integr" className="mt-4 text-sm text-muted-foreground">Branch-specific integrations are not connected in Phase 2.</TabsContent>
      </Tabs>
      <DialogFooter><Button variant="outline" onClick={()=>setEditOpen(false)}>Cancel</Button><Button disabled={saving} onClick={save}>{saving?'Saving…':'Save branch'}</Button></DialogFooter>
    </DialogContent></Dialog>
    <Dialog open={!!detailId} onOpenChange={o=>!o&&setDetailId(null)}><DialogContent className="max-w-2xl">{detail&&<>
      <DialogHeader><DialogTitle className="font-display">{detail.name} · {detail.code}</DialogTitle><DialogDescription>{detail.address}, {detail.city} {detail.pin} · opened {detail.openedOn}</DialogDescription></DialogHeader>
      <Tabs defaultValue="overview"><TabsList className="flex w-full flex-wrap"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="staff">Users</TabsTrigger><TabsTrigger value="cases">Cases</TabsTrigger><TabsTrigger value="config">Configuration</TabsTrigger></TabsList>
        <TabsContent value="overview" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Active cases',activeCount(detail)],['Staff','—'],['TAT',`${detail.tatDays} days`],['Status',detail.status]].map(([l,v])=><div key={String(l)} className="rounded-xl border p-3"><p className="font-display text-lg font-bold">{v}</p><p className="text-[11px] text-muted-foreground">{l}</p></div>)}</TabsContent>
        <TabsContent value="staff" className="mt-4 text-sm">Branch head: {detail.manager||'Not set'}. Branch-level staff allocations are not configured yet.</TabsContent>
        <TabsContent value="cases" className="mt-4">{allCases.filter(c=>c.branchId===detail.id).slice(0,8).map(c=><div key={c.id} className="flex items-center justify-between border-b py-2 text-xs"><Link to="/cases/$caseId" params={{caseId:c.id}} className="font-mono underline">{c.caseNo}</Link><span>{c.bank} · {c.stage}</span><span>{c.feeKnown?fmtINR(c.fee):'—'}</span></div>)}</TabsContent>
        <TabsContent value="config" className="mt-4 text-sm text-muted-foreground">TAT {detail.tatDays} days · prefix {detail.casePrefix}. Advanced settings are not yet connected.</TabsContent>
      </Tabs><div className="flex items-center gap-2 text-xs text-muted-foreground"><Landmark className="size-3.5" /> Branch bank empanelments will be implemented separately.</div>
    </>}</DialogContent></Dialog>
  </AppShell>;
}
function Field({label,value,onChange,type='text'}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label><Input type={type} value={value} onChange={e=>onChange(e.target.value)}/></div>;
}
