import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';

export interface Vp8Access { view:boolean; audit:boolean; export:boolean; billing:boolean; platform:boolean }
export interface Vp8Summary {
  cases_created:number;
  open_from_created_cohort:number;
  overdue_from_created_cohort:number;
  pending_qc_for_created_cases:number;
  released_reports_during_period:number;
  completed_visits_during_period:number;
  finance_access:boolean;
  invoices_issued_during_period:number|null;
  invoice_billed_during_period:number|null;
  invoice_collected_to_date_for_period_invoices:number|null;
  invoice_outstanding_for_period_invoices:number|null;
  receipts_recorded_during_period:number|null;
  unlinked_legacy_invoices:number|null;
}
export interface Vp8Group {
  label:string;cases_count:number;overdue_cases:number;pending_qc:number;
  released_cases:number;invoiced_total:number|null;
}
export interface Vp8Audit {
  event_time:string|null; date_only:boolean;category:string;actor:string;
  description:string;case_num:number|null;source_key:string;
}
export interface Vp8Issue {
  issue:string;reference:string;expected:number;observed:number;details:string;
}
export interface Vp8Platform {
  org_type:string;org_status:string;organizations:number;
  users_total:number;cases_total:number;
}
export type Vp8Dimension = 'bank'|'branch'|'property';
export interface Vp8Filters { branchId:string|null; from:string;to:string }
function err(error:{message:string}|null){if(error)throw new Error(error.message);}
function args(f:Vp8Filters){return {p_branch_id:f.branchId,p_from:f.from||null,p_to:f.to||null};}

export async function vp8GetAccess():Promise<Vp8Access>{
  const [v,a,e,b,p]=await Promise.all([
    vpDb.rpc('vp8_can',{p_action:'View'}),
    vpDb.rpc('vp8_can',{p_action:'Audit'}),
    vpDb.rpc('vp8_can',{p_action:'Export'}),
    vpDb.rpc('vp_billing_can',{p_action:'View'}),
    vpDb.rpc('vp8_platform_can'),
  ]);
  for(const x of [v,a,e,b,p])err(x.error);
  return {view:v.data===true,audit:a.data===true,export:e.data===true,
    billing:b.data===true,platform:p.data===true};
}
export function useVp8Access(){
  const {tenant}=useApp();
  return useQuery({queryKey:['vp8',tenant.id,'access',tenant.role],
    queryFn:vp8GetAccess,staleTime:15_000});
}
export async function vp8GetSummary(filters:Vp8Filters):Promise<Vp8Summary>{
  const {data,error}=await vpDb.rpc('vp8_summary',args(filters));err(error);
  if(!data)throw new Error('No analytics summary returned');
  return data as Vp8Summary;
}
export async function vp8GetBreakdown(dimension:Vp8Dimension,filters:Vp8Filters):Promise<Vp8Group[]>{
  const {data,error}=await vpDb.rpc('vp8_breakdown',{p_dimension:dimension,...args(filters)});err(error);
  return (data??[]) as Vp8Group[];
}
export async function vp8GetAudit(limit=100,offset=0):Promise<Vp8Audit[]>{
  const {data,error}=await vpDb.rpc('vp8_audit_feed',{p_limit:limit,p_offset:offset});err(error);
  return (data??[]) as Vp8Audit[];
}
export async function vp8GetReconciliation():Promise<Vp8Issue[]>{
  const {data,error}=await vpDb.rpc('vp8_reconciliation',{p_limit:100});err(error);
  return (data??[]) as Vp8Issue[];
}
export async function vp8GetPlatform():Promise<Vp8Platform[]>{
  const {data,error}=await vpDb.rpc('vp8_platform_overview');err(error);
  return (data??[]) as Vp8Platform[];
}
export async function vp8LogExport(dataset:Vp8Dimension|'audit',rowCount:number,filters:Vp8Filters){
  const {error}=await vpDb.rpc('vp8_record_export',{
    p_dataset:dataset,p_row_count:rowCount,...args(filters),
  });err(error);
}
