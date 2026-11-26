import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { AppShell, PageHeader } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCcw, ShieldAlert, ClipboardCheck, LockKeyhole } from 'lucide-react';
import { inspectionReadiness } from '@/lib/vp-p7-inspection-diagnostics';
import { VpInspectionForm } from '@/components/field/vp-inspection-form';
import { useApp } from '@/lib/app-context';
import { useVpFieldVisits } from '@/lib/vp-field';
import { vpDb } from '@/lib/vp-db';
import { mayOpenPath } from '@/lib/vp-p10-permissions';

export const Route=createFileRoute('/field-inspections/$visitId')({
  component:FieldInspectionPage,
  head:()=>({meta:[{title:'Valuation Report — Site Inspection'}]}),
});
function FieldInspectionPage(){
  const {visitId}=Route.useParams();
  const {tenant,capabilities}=useApp();
  const visitsQuery=useVpFieldVisits();
  const identity=useQuery({
    queryKey:['vp-field-self',tenant.id],
    queryFn:async():Promise<string>=>{
      const {data,error}=await vpDb.rpc('vp_field_my_user_id');
      if(error)throw error;
      if(data==null)throw new Error('No application-user ID mapped to this login');
      return String(data);
    }
  });
  const visit=(visitsQuery.data??[]).find(v=>String(v.id)===String(visitId));
  const assigned=!!visit&&!!identity.data&&String(visit.assigned_user_id)===String(identity.data);
  const access=useQuery({
    queryKey:['vp-p0-inspection-access',tenant.id,visitId],enabled:!!visit,
    retry:false, refetchOnWindowFocus:false,
    queryFn:async()=>{const {data,error}=await vpDb.rpc('vp_p0_inspection_access',{p_visit_id:visitId});if(error)throw error;return data as {can_edit:boolean;can_submit:boolean;can_manager_save:boolean;can_capture:boolean;case_product:string;reason:string};}
  });
  const canEdit=access.data?.can_edit===true && !access.isLoading && !access.error;
  const canSubmit=access.data?.can_submit===true && canEdit;
  const canManage=access.data?.can_manager_save===true && canEdit;
  const canCapture=access.data?.can_capture===true && canEdit;
  const diagnosis=inspectionReadiness(access.error);
  const reason=!visit?'Visit not found or not accessible to this login':
    access.error?`${diagnosis.message} ${diagnosis.action}`:
    access.isLoading?'Checking server-enforced inspection access…':
    access.data?.reason??'Inspection edit permission is unavailable';
  return <AppShell>
    <div className="mx-auto w-full max-w-screen-xl">
    <div className="mb-2"><Button variant="ghost" asChild>{mayOpenPath('/field-operations',capabilities)?<Link to="/field-operations" search={{view:'visits'}}><ArrowLeft className="size-4"/>Field visits</Link>:mayOpenPath('/qc-checking',capabilities)?<Link to="/qc-checking"><ArrowLeft className="size-4"/>Quality checking</Link>:<Link to="/"><ArrowLeft className="size-4"/>Workspace</Link>}</Button></div>
    <PageHeader title="Site inspection" description={visit?`Case #${visit.num} · ${visit.status}`:'Inspection details'}/>
    {visitsQuery.isLoading&&<p>Loading site visits...</p>}
    {visitsQuery.error&&<p role="alert" className="text-destructive">Visit API: {visitsQuery.error.message}</p>}
    {identity.error&&<p role="alert" className="text-destructive">Field officer identity: {identity.error.message}</p>}
    {access.error&&<div role="alert" className="mb-3 space-y-2 rounded border border-amber-400 p-3 text-sm">
      <p className="flex items-center gap-2 font-semibold"><ShieldAlert className="size-4"/> Inspection access: {diagnosis.message}</p>
      <p>{diagnosis.action}</p>
      <p className="text-xs">Field editing, submission and autosave remain disabled until the server explicitly authorizes them. Saved OCR is separate unverified evidence.</p>
      <Button size="sm" variant="outline" disabled={access.isFetching} onClick={()=>void access.refetch()}><RefreshCcw className="mr-1 size-4"/>Retry permission check</Button>
    </div>}
    {!visitsQuery.isLoading&&!visitsQuery.error&&!visit&&<p>Visit not visible. It must exist under this organization and be accessible to your account.</p>}
    {visit&&<div className="space-y-4">
      <div className="rounded-xl border bg-card p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-semibold"><ClipboardCheck className="size-5 text-primary" strokeWidth={1.65} aria-hidden="true"/>Visit #{visit.id} · Case #{visit.num}</div><span className="rounded-md border px-2 py-1 text-xs font-medium">{visit.status}</span></div><p className="mt-2 text-sm text-muted-foreground">{identity.isLoading||access.isLoading?'Checking permissions…':assigned?'Assigned to this account':canManage?'Manager correction access':'Read-only for this account'}</p></div>
      <div className="flex items-start gap-3 rounded-lg border bg-card p-3 text-sm" role="status">{canEdit?<ClipboardCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true"/>:<LockKeyhole className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true"/>}<span>
        {canEdit?(canSubmit?'Full report editable — verify GPS and evidence, then submit to Checker.':'Draft fully editable — complete GPS check-in before submitting.')
          :reason}</span>
      </div>
      <VpInspectionForm key={String(visit.id)} visitId={visit.id} canEdit={canEdit} canSubmit={canSubmit} canManage={canManage} canCapture={canCapture} productType={access.data?.case_product??'Unknown'} editReason={reason}/>
    </div>}
    </div>
  </AppShell>;
}
