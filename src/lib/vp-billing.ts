import { useQuery } from '@tanstack/react-query';
import { vpDb } from '@/lib/vp-db';
import { useApp } from '@/lib/app-context';

export type TaxTreatment = 'CGST+SGST' | 'IGST' | 'No GST';
export type PaymentMethod = 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'Cheque' | 'Cash' | 'Other';
export interface BillingPermissions { view:boolean; create:boolean; approve:boolean; export:boolean }
export interface BillingSettings { invoice_prefix:string; payment_days:number }
export interface ReadyCase {
  case_num:number;case_no:string;bank_name:string;property_type:string;
  branch_name:string;branch_id:string|null;fee_suggestion:number|null;released_at:string;
}
export interface BillingInvoice {
  invoice_id:string;case_num:number;invoice_no:string;bank_name:string;
  branch_id:string|null;branch_name:string;case_no:string;
  service_fee:number;tax_treatment:TaxTreatment;tax_rate:number;tax_note:string;
  cgst:number;sgst:number;igst:number;total:number;paid:number;outstanding:number;
  due_date:string;created_date:string;status:'Raised'|'Overdue'|'Paid';
}
export interface BillingSummary {
  invoice_count:number;billed:number;collected:number;outstanding:number;overdue:number;
}
export interface BillingBreakdown {
  kind:'Bank'|'Branch';label:string;invoice_count:number;
  billed:number;collected:number;outstanding:number;
}
export interface BillingReceipt {
  id:string;amount:number;payment_date:string;reference:string;method:PaymentMethod;recorded_at:string;
}

function normalizeInvoice(r:Record<string,unknown>):BillingInvoice {
  return {...r,invoice_id:String(r['invoice_id']),branch_id:r['branch_id']==null?null:String(r['branch_id']),
    case_num:Number(r['case_num']),service_fee:Number(r['service_fee']),tax_rate:Number(r['tax_rate']),
    cgst:Number(r['cgst']),sgst:Number(r['sgst']),igst:Number(r['igst']),total:Number(r['total']),
    paid:Number(r['paid']),outstanding:Number(r['outstanding'])} as BillingInvoice;
}
function normalizeSummary(s:Record<string,unknown>|null|undefined):BillingSummary {
  return {invoice_count:Number(s?.['invoice_count']??0),billed:Number(s?.['billed']??0),
    collected:Number(s?.['collected']??0),outstanding:Number(s?.['outstanding']??0),
    overdue:Number(s?.['overdue']??0)};
}
function branchArg(branch:string){return branch==='all'?null:branch;}

export function useVpBillingPermissions(){
  const {tenant}=useApp();
  return useQuery({queryKey:['vp-billing-perms',tenant.id,tenant.role],queryFn:async():Promise<BillingPermissions>=>{
    const names=['View','Create','Approve','Export'];
    const flags=await Promise.all(names.map(async p_action=>{
      const {data,error}=await vpDb.rpc('vp_billing_can',{p_action});
      if(error)throw error;
      return data===true;
    }));
    return {view:flags[0] ?? false,create:flags[1] ?? false,approve:flags[2] ?? false,export:flags[3] ?? false};
  },staleTime:15_000});
}
export function useVpBillingSettings(enabled:boolean){
  const {tenant}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'settings'],enabled,queryFn:async():Promise<BillingSettings|null>=>{
    const {data,error}=await vpDb.from('vp_billing_settings').select('invoice_prefix,payment_days')
      .eq('org_id',tenant.id).maybeSingle();
    if(error)throw error;
    return data as BillingSettings|null;
  }});
}
export function useVpBillingSummary(enabled:boolean){
  const {tenant,branch}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'summary',branch],enabled,queryFn:async()=>{
    const {data,error}=await vpDb.rpc('vp_billing_summary',{p_branch_id:branchArg(branch)});
    if(error)throw error;
    return normalizeSummary(data as Record<string,unknown>);
  },staleTime:10_000});
}
export async function fetchVpBillingInvoices(branch:string,limit=100,offset=0):Promise<BillingInvoice[]> {
  const {data,error}=await vpDb.rpc('vp_billing_list',{
    p_branch_id:branchArg(branch),p_limit:limit,p_offset:offset,
  });
  if(error)throw error;
  return ((data??[]) as Record<string,unknown>[]).map(normalizeInvoice);
}
export function useVpBillingInvoices(enabled:boolean,limit=100,offset=0){
  const {tenant,branch}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'invoices',branch,limit,offset],enabled,
    queryFn:()=>fetchVpBillingInvoices(branch,limit,offset),staleTime:10_000});
}
export function useVpBillingReady(enabled:boolean){
  const {tenant,branch}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'ready',branch],enabled,queryFn:async():Promise<ReadyCase[]>=>{
    const {data,error}=await vpDb.rpc('vp_billing_ready_cases',{p_branch_id:branchArg(branch)});
    if(error)throw error;
    return ((data??[]) as Record<string,unknown>[]).map(r=>({...r,
      case_num:Number(r['case_num']),branch_id:r['branch_id']==null?null:String(r['branch_id']),
      fee_suggestion:r['fee_suggestion']==null?null:Number(r['fee_suggestion'])}) as ReadyCase);
  },staleTime:10_000});
}
export function useVpBillingBreakdown(enabled:boolean){
  const {tenant,branch}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'breakdown',branch],enabled,queryFn:async():Promise<BillingBreakdown[]>=>{
    const {data,error}=await vpDb.rpc('vp_billing_breakdown',{p_branch_id:branchArg(branch)});
    if(error)throw error;
    return ((data??[]) as Record<string,unknown>[]).map(r=>({...r,
      invoice_count:Number(r['invoice_count']),billed:Number(r['billed']),
      collected:Number(r['collected']),outstanding:Number(r['outstanding'])}) as BillingBreakdown);
  },staleTime:10_000});
}
export function useVpBillingLegacyCount(enabled:boolean){
  const {tenant}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'legacy'],enabled,queryFn:async()=>{
    const {data,error}=await vpDb.rpc('vp_billing_legacy_count');
    if(error)throw error;
    return Number(data??0);
  },staleTime:60_000});
}
export function useVpBillingReceipts(invoiceId:string|null,enabled:boolean){
  const {tenant}=useApp();
  return useQuery({queryKey:['vp-billing',tenant.id,'receipts',invoiceId],enabled:enabled&&!!invoiceId,
    queryFn:async():Promise<BillingReceipt[]>=>{
      const {data,error}=await vpDb.rpc('vp_billing_receipts',{p_invoice_id:invoiceId});
      if(error)throw error;
      return ((data??[]) as Record<string,unknown>[]).map(r=>({...r,id:String(r['id']),amount:Number(r['amount'])}) as BillingReceipt);
    },staleTime:10_000});
}
export async function vpBillingSaveSettings(prefix:string,days:number){
  const {error}=await vpDb.rpc('vp_billing_save_settings',{p_prefix:prefix,p_payment_days:days});
  if(error)throw error;
}
export async function vpBillingRaise(caseNum:number,fee:number,treatment:TaxTreatment,rate:number,note:string){
  const {data,error}=await vpDb.rpc('vp_billing_raise',{
    p_case_num:caseNum,p_service_fee:fee,p_tax_treatment:treatment,
    p_tax_rate:rate,p_tax_note:note,
  });
  if(error)throw error;
  return String(data);
}
export async function vpBillingRecordPayment(invoiceId:string,amount:number,date:string,ref:string,method:PaymentMethod){
  const {data,error}=await vpDb.rpc('vp_billing_record_payment',{
    p_invoice_id:invoiceId,p_amount:amount,p_payment_date:date,
    p_reference:ref,p_method:method,
  });
  if(error)throw error;
  return String(data);
}
