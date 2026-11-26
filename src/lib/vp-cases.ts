import { useQuery } from '@tanstack/react-query';
import { vpDb } from '@/lib/vp-db';
import { collectOrgRows } from '@/lib/vp-query';
import { useApp } from '@/lib/app-context';
import type { CaseRow } from '@/lib/data';
import { STAGES } from '@/lib/ops';

export const PROPERTY_TYPES = ['House', 'Flat', 'Land', 'Commercial'] as const;

export interface VpPropertyType {
  code: PropertyType;
  name: string;
  is_active: boolean;
  sort_order: number;
}

/** Canonical per-agency categories, separate from bank fee configuration. */
export function useVpPropertyTypes() {
  const {tenant}=useApp();
  return useQuery({
    queryKey:['vp-property-types',tenant.id],
    queryFn:async()=>{
      const {data,error}=await vpDb.from('vp_property_types')
        .select('code,name,is_active,sort_order')
        .eq('org_id',tenant.id).order('sort_order');
      if(error) throw error;
      return (data??[]) as VpPropertyType[];
    },staleTime:15_000,
  });
}

export const DOC_BUCKET = 'vp-case-docs';
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export interface VpBank {
  name: string;
  alias: string;
  kind: 'bank' | 'nbfc' | 'private' | 'other';
  rate: number;
  tariffs: { property_type: PropertyType; fee: number; tat_days: number }[];
}
export interface VpCase extends CaseRow {
  dbStage: string;
  customer: string;
  caseNum: number;
  due: string;
  created: string;
  feeKnown: boolean;
  priorityKnown: boolean;
  branchName: string;
}
export interface VpCaseDocument {
  id: string;
  name: string;
  mime: string;
  size: number;
  at: string;
  by: string;
  storage_path: string | null;
}

type DbCase = {
  num: number; org_id: number | string; cust: string; bank: string; br: string;
  prod: string; addr: string; stage: string; team: string; due: string;
  created: string; meta: Record<string, unknown> | null;
};

function localToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}
export function daysUntil(due: string): number {
  const [y,m,d] = due.split('-').map(Number);
  if (!y || !m || !d) return 0;
  return Math.round((new Date(y,m-1,d).getTime() - localToday())/86_400_000);
}
const uiStages: ReadonlySet<string> = new Set(STAGES);
function str(v: unknown): string { return typeof v === 'string' ? v : ''; }
function num(v: unknown): number | null { return typeof v === 'number' && Number.isFinite(v) ? v : null; }

export function mapVpCase(row: DbCase, tenantId: string, branches: {id:string;name:string;city:string}[]): VpCase {
  const meta = row.meta && typeof row.meta === 'object' ? row.meta : {};
  const userStage = str(meta['ui_stage']);
  const stage = uiStages.has(userStage) ? userStage : row.stage;
  const branch = branches.find(b => b.id === str(meta['branch_id'])) ?? branches.find(b=>b.name===row.br);
  const priorityValue = str(meta['priority']);
  const priorityKnown = ['High','Normal','Low'].includes(priorityValue);
  const fee = num(meta['fee']);
  return {
    id:String(row.num),caseNum:row.num,
    caseNo:str(meta['case_no']) || `#${row.num}`, tenantId,
    branchId:branch?.id ?? str(meta['branch_id']),
    property:row.addr,propertyType:row.prod,customer:row.cust,
    bank:row.bank,city:str(meta['city']) || branch?.city || '',branchName:row.br,
    assignedTo:row.team || 'Unassigned',stage:stage as CaseRow['stage'],dbStage:row.stage,
    priority:(priorityKnown ? priorityValue : 'Normal') as CaseRow['priority'],
    priorityKnown, fee:fee ?? 0,feeKnown:fee!==null,
    tatLeft:daysUntil(row.due),due:row.due,created:row.created,
  };
}

function readAllCases(tenantId: string): Promise<DbCase[]> {
  return collectOrgRows<DbCase>(
    'cases', 'num,org_id,cust,bank,br,prod,addr,stage,team,due,created,meta',
    tenantId, 'num', false,
  );
}
export function useVpCases() {
  const {tenant,tenantBranches,branch}=useApp();
  const query=useQuery({
    queryKey:['vp-live-cases',tenant.id],
    queryFn:()=>readAllCases(tenant.id),staleTime:15_000,
  });
  const cases=(query.data??[]).map(x=>mapVpCase(x,tenant.id,tenantBranches));
  return {...query,allCases:cases,cases:branch==='all'?cases:cases.filter(c=>c.branchId===branch)};
}
export function useVpBanks() {
  const {tenant}=useApp();
  return useQuery({
    queryKey:['vp-live-banks',tenant.id],
    queryFn:async()=>{
      const [banksRes,tariffsRes]=await Promise.all([
        vpDb.from('banks').select('name,alias,kind,rate').eq('org_id',tenant.id).order('name'),
        vpDb.from('vp_bank_rate_cards').select('bank_name,property_type,fee,tat_days').eq('org_id',tenant.id),
      ]);
      if(banksRes.error) throw banksRes.error;
      if(tariffsRes.error) throw tariffsRes.error;
      type BankRaw={name:string;alias:string;kind:VpBank['kind'];rate:number};
      type TariffRaw={bank_name:string;property_type:PropertyType;fee:number;tat_days:number};
      return ((banksRes.data??[]) as BankRaw[]).map(b=>({
        name:b.name,alias:b.alias,kind:b.kind,rate:Number(b.rate),
        tariffs:((tariffsRes.data??[]) as TariffRaw[]).filter(t=>t.bank_name===b.name)
          .map(t=>({property_type:t.property_type,fee:Number(t.fee),tat_days:t.tat_days})),
      })) as VpBank[];
    },staleTime:15_000,
  });
}
export function useVpCaseDocuments(caseNum:number) {
  const {tenant}=useApp();
  return useQuery({queryKey:['vp-case-documents',tenant.id,caseNum],enabled:Number.isInteger(caseNum)&&caseNum>0,
    queryFn:async()=>{
      const {data,error}=await vpDb.from('documents')
        .select('id,name,mime,size,at,by,storage_path')
        .eq('org_id',tenant.id).eq('num',caseNum).order('id',{ascending:false});
      if(error) throw error;
      return (data??[]).map((d:any)=>({...d,id:String(d.id)})) as VpCaseDocument[];
    },staleTime:10_000,
  });
}
export async function uploadVpCaseDocument(orgId:string,caseNum:number,file:File):Promise<void> {
  const extension:Record<string,string>={
    'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png',
  };
  if(!extension[file.type]) throw new Error('Only PDF, JPEG and PNG files are supported');
  if(file.size<1 || file.size>10_485_760) throw new Error('File must be between 1 byte and 10 MB');
  if(file.name.length>250) throw new Error('Document filename is too long');
  const objectPath=`${orgId}/${caseNum}/${crypto.randomUUID()}.${extension[file.type]}`;
  const {error:uploadError}=await vpDb.storage.from(DOC_BUCKET).upload(objectPath,file,{
    contentType:file.type,upsert:false,cacheControl:'3600',
  });
  if(uploadError) throw uploadError;
  const {error:registerError}=await vpDb.rpc('vp_case_register_document',{
    p_case_num:caseNum,p_object_path:objectPath,p_file_name:file.name,
    p_mime:file.type,p_size:file.size,
  });
  if(registerError) throw new Error(`File stored but registration failed (${registerError.message}). Contact administrator to clean up orphan file.`);
}
export async function openVpDocument(path:string):Promise<void> {
  const {data,error}=await vpDb.storage.from(DOC_BUCKET).createSignedUrl(path,60);
  if(error || !data?.signedUrl) throw error ?? new Error('Cannot open private document');
  window.open(data.signedUrl,'_blank','noopener,noreferrer');
}
