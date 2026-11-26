import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/app-context';
import { useVpCases } from '@/lib/vp-cases';
import { vpDb } from '@/lib/vp-db';

/** Case-master corrections are separate from the visit report, and never auto-overwrite evidence. */
export function VpFieldCaseEditor({visitId,caseNum,canEdit,isAssigned}:{
  visitId:string;caseNum:number;canEdit:boolean;isAssigned:boolean;
}){
  const {tenant}=useApp();
  const {allCases}=useVpCases();
  const client=useQueryClient();
  const master=allCases.find(c=>c.caseNum===caseNum);
  const [customer,setCustomer]=useState('');
  const [address,setAddress]=useState('');
  const [dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    if(!dirty&&master){setCustomer(master.customer);setAddress(master.property);}
  },[master?.customer,master?.property,dirty]);
  async function save(){
    if(!canEdit||!isAssigned||busy)return;
    if(customer.trim().length<2||address.trim().length<5){toast.error('Customer and site address are required');return;}
    setBusy(true);
    try{
      const {error}=await vpDb.rpc('vp_p9_field_update_case',{
        p_visit_id:visitId,p_customer:customer.trim(),p_site_address:address.trim(),
      });
      if(error)throw error;
      await client.invalidateQueries({queryKey:['vp-live-cases',tenant.id]});
      setDirty(false);toast.success('Assigned case details updated and audited');
    }catch(e){toast.error(e instanceof Error?e.message:String(e));}
    finally{setBusy(false);}
  }
  return <Card>
    <CardHeader className="pb-2"><CardTitle className="text-base">Assigned case details</CardTitle>
      <p className="text-xs text-muted-foreground">Customer and property address can be corrected until submission. This updates the case master, not the Excel report. Bank, officer assignment and QC controls are managed separately.</p>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-1"><Label htmlFor="p9-customer">Customer</Label>
        <Input id="p9-customer" value={customer} disabled={!canEdit||!isAssigned||busy} onChange={e=>{setCustomer(e.target.value);setDirty(true);}}/></div>
      <div className="space-y-1"><Label htmlFor="p9-address">Property / site address</Label>
        <Textarea id="p9-address" value={address} disabled={!canEdit||!isAssigned||busy} onChange={e=>{setAddress(e.target.value);setDirty(true);}}/></div>
      {dirty&&<p className="text-xs text-amber-700">Unsaved case-master changes are separate from inspection autosave.</p>}
      <Button className="w-full sm:w-auto" onClick={()=>void save()} disabled={!canEdit||!isAssigned||!dirty||busy}>{busy?'Saving…':'Save case details'}</Button>
    </CardContent>
  </Card>;
}
