import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import type { ValuationInput } from '@/lib/valuation';

export const VALUATION_KEYS: (keyof ValuationInput)[] = [
  'landAreaSqYd', 'landRate', 'guidelineRate', 'builtUpSqFt',
  'constructionRate', 'ageYears', 'lifeYears', 'salvagePct',
  'amenities', 'realizablePct', 'distressPct',
];

export interface ValuationResults {
  landValue: number; replacementCost: number; depreciationPct: number;
  depreciation: number; buildingValue: number; marketValue: number;
  guidelineValue: number; realizableValue: number; distressValue: number;
}
export interface ValuationForm {
  data: { valuation_inputs?: ValuationInput; valuation_results?: ValuationResults;
    valuation_method?: string; [key: string]: unknown };
  status: 'draft' | 'submitted'; updated: string; by: string;
}
export interface ValuationVersion {
  version_no: number; submitted_at: string; submitted_by: string;
  inputs: ValuationInput; calculations: ValuationResults;
}
export interface BankReportFormat {
  org_id: string; bank_name: string; property_type: string;
  format_name: string; instructions: string; active: boolean;
}
export interface ValuerCredential {
  org_id: string; user_id: string; reg_no: string; registration_category: string;
  expires_on: string; review_status: 'Pending' | 'Checked' | 'Rejected';
  recorded_by: string; reviewed_by: string | null; review_note: string;
}
export interface ReportVersion {
  id: string; num: number; version_no: number; valuation_version_no: number;
  format_name: string; status: 'Draft' | 'Released'; file_path: string | null;
  case_snapshot: Record<string, string>; inputs_snapshot: ValuationInput;
  calculations_snapshot: ValuationResults; prepared_at: string;
  released_at: string | null; released_reg_no: string | null;
}

function getError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
export function useVpValuationForm(caseNum: number) {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-valuation-form', tenant.id, caseNum], enabled: caseNum > 0,
    queryFn: async (): Promise<ValuationForm | null> => {
      const { data, error } = await vpDb.from('forms').select('data,status,updated,by')
        .eq('org_id', tenant.id).eq('num',caseNum).maybeSingle();
      if (error) throw error;
      return data as ValuationForm | null;
    }, staleTime: 10_000,
  });
}
export function useVpValuationVersions(caseNum: number) {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-valuation-versions', tenant.id, caseNum], enabled: caseNum > 0,
    queryFn: async (): Promise<ValuationVersion[]> => {
      const { data, error } = await vpDb.from('vp_valuation_versions')
        .select('version_no,submitted_at,submitted_by,inputs,calculations')
        .eq('org_id', tenant.id).eq('num',caseNum).order('version_no',{ascending:false});
      if (error) throw error;
      return (data ?? []) as ValuationVersion[];
    }, staleTime: 10_000,
  });
}
export function useVpReportFormats() {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-report-formats',tenant.id],
    queryFn: async (): Promise<BankReportFormat[]> => {
      const { data,error } = await vpDb.from('vp_report_formats')
        .select('org_id,bank_name,property_type,format_name,instructions,active')
        .eq('org_id',tenant.id).order('bank_name');
      if(error) throw error;
      return (data??[]) as BankReportFormat[];
    },staleTime:15_000,
  });
}
export function useVpValuerCredentials() {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-valuer-credentials',tenant.id],
    queryFn: async (): Promise<ValuerCredential[]> => {
      const { data,error } = await vpDb.from('vp_valuer_credentials')
        .select('org_id,user_id,reg_no,registration_category,expires_on,review_status,recorded_by,reviewed_by,review_note')
        .eq('org_id',tenant.id);
      if(error) throw error;
      return (data??[]).map((r: any) => ({...r,org_id:String(r.org_id),
        user_id:String(r.user_id),recorded_by:String(r.recorded_by),
        reviewed_by:r.reviewed_by===null?null:String(r.reviewed_by)})) as ValuerCredential[];
    },staleTime:15_000,
  });
}
export function useVpReportVersions() {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-report-versions',tenant.id],
    queryFn: async (): Promise<ReportVersion[]> => {
      const { data,error } = await vpDb.from('vp_report_versions')
        .select('id,num,version_no,valuation_version_no,format_name,status,file_path,case_snapshot,inputs_snapshot,calculations_snapshot,prepared_at,released_at,released_reg_no')
        .eq('org_id',tenant.id).order('id',{ascending:false}).limit(1000);
      if(error) throw error;
      return (data??[]).map((r: any)=>({...r,id:String(r.id)})) as ReportVersion[];
    },staleTime:10_000,
  });
}
export function useVpReportPermissions() {
  const {tenant}=useApp();
  return useQuery({
    queryKey:['vp-report-permissions',tenant.id,tenant.role],
    queryFn:async()=> {
      const names = ['View','Edit','Prepare','Release','Manage Formats'] as const;
      const vals = await Promise.all(names.map(async (p_action)=>{
        const {data,error}=await vpDb.rpc('vp_report_can',{p_action});
        if(error) throw error;
        return data === true;
      }));
      return {view:vals[0],edit:vals[1],prepare:vals[2],release:vals[3],manage:vals[4]};
    },staleTime:10_000,
  });
}
export async function saveVpValuation(caseNum:number,input:ValuationInput,submit:boolean) {
  const {data,error}=await vpDb.rpc('vp_report_save_valuation',{
    p_case_num:caseNum,p_input:input,p_submit:submit,
  });
  if(error) throw error;
  return data as {submitted:boolean;version_no:number|null;results:ValuationResults};
}
export async function prepareVpReport(caseNum:number):Promise<string> {
  const {data,error}=await vpDb.rpc('vp_report_prepare',{p_case_num:caseNum});
  if(error) throw error;
  return String(data);
}
export async function saveVpBankFormat(bank:string,product:string,name:string,instructions:string) {
  const {error}=await vpDb.rpc('vp_report_save_format',{
    p_bank:bank,p_product:product,p_name:name,p_instructions:instructions,
  });
  if(error) throw error;
}
export async function recordVpValuer(userId:string,registration:string,expires:string) {
  const {error}=await vpDb.rpc('vp_report_record_valuer',{
    p_user_id:userId,p_reg_no:registration,p_expires:expires,p_category:'Land & Building',
  });
  if(error) throw error;
}
export async function reviewVpValuer(userId:string,accept:boolean,note:string) {
  const {error}=await vpDb.rpc('vp_report_review_valuer',{
    p_user_id:userId,p_accept:accept,p_note:note,
  });
  if(error) throw error;
}
const REPORT_BUCKET = 'vp-report-files';
export async function attachVpReportPdf(orgId:string,report:ReportVersion,file:File) {
  if(file.type!=='application/pdf' || file.size<=0 || file.size>20*1024*1024) {
    throw new Error('Select a PDF file (maximum 20 MB)');
  }
  const path=`${orgId}/${report.num}/${crypto.randomUUID()}.pdf`;
  const {error:uploadError}=await vpDb.storage.from(REPORT_BUCKET).upload(path,file,{
    contentType:'application/pdf',upsert:false,
  });
  if(uploadError) throw uploadError;
  const {error:registerError}=await vpDb.rpc('vp_report_attach_pdf',{
    p_report_id:report.id,p_file_path:path,
  });
  if(registerError) throw new Error(`PDF uploaded but not registered: ${registerError.message}. Contact an administrator to remove the orphan file.`);
}
export async function viewVpReportPdf(path:string) {
  const {data,error}=await vpDb.storage.from(REPORT_BUCKET).createSignedUrl(path,60);
  if(error || !data?.signedUrl) throw getError(error??'Cannot open private report');
  window.open(data.signedUrl,'_blank','noopener,noreferrer');
}
export async function releaseVpReport(reportId:string) {
  const {error}=await vpDb.rpc('vp_report_release',{p_report_id:reportId});
  if(error) throw error;
}
