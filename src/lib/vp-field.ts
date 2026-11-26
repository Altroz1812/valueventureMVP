import { useQuery } from '@tanstack/react-query';
import { vpDb } from '@/lib/vp-db';
import { collectOrgRows } from '@/lib/vp-query';
import { useApp } from '@/lib/app-context';

export const FIELD_BUCKET='vp-field-evidence';
export type VisitStatus='Scheduled'|'On site'|'Completed'|'Cancelled';
export interface FieldVisit {
  id:string; org_id:string; num:number; assigned_user_id:string;
  scheduled_at:string; status:VisitStatus; min_photos:number;
  target_lat:number|null; target_lng:number|null;
  radius_m:number|null; max_accuracy_m:number|null;
  checkin_at:string|null; checkin_accuracy_m:number|null; checkin_distance_m:number|null;
  checkin_verified:boolean|null; checkout_at:string|null;
  checkout_accuracy_m:number|null; checkout_distance_m:number|null;
  checkout_verified:boolean|null; photo_count:number;
}
export interface FieldPhoto {
  id:string; visit_id:string; storage_path:string; name:string; mime:string; size:number;
  uploaded_at:string;
}
export interface VisitExpense { id:string; day:string; cat:string; amt:number }
export interface VisitTravel { day:string; km:number }


function n(value:unknown):number|null { return value===null||value===undefined?null:Number(value); }
export function useVpFieldVisits() {
  const {tenant}=useApp();
  return useQuery({
    queryKey:['vp-field-visits',tenant.id],
    queryFn:async():Promise<FieldVisit[]>=>{
      const [visits,photos]=await Promise.all([
        collectOrgRows<any>('vp_site_visits',
          'id,org_id,num,assigned_user_id,scheduled_at,status,min_photos,target_lat,target_lng,radius_m,max_accuracy_m,checkin_at,checkin_accuracy_m,checkin_distance_m,checkin_verified,checkout_at,checkout_accuracy_m,checkout_distance_m,checkout_verified',tenant.id,'id',true),
        collectOrgRows<{visit_id:string}>('vp_visit_photos','visit_id',tenant.id,'id',true),
      ]);
      const counts=new Map<string,number>();
      for(const photo of photos){const k=String(photo.visit_id);counts.set(k,(counts.get(k)??0)+1);}
      return visits.map(v=>({
        id:String(v.id),org_id:String(v.org_id),num:v.num,
        assigned_user_id:String(v.assigned_user_id),scheduled_at:v.scheduled_at,
        status:v.status,min_photos:v.min_photos,
        target_lat:n(v.target_lat),target_lng:n(v.target_lng),
        radius_m:n(v.radius_m),max_accuracy_m:n(v.max_accuracy_m),
        checkin_at:v.checkin_at,checkin_accuracy_m:n(v.checkin_accuracy_m),
        checkin_distance_m:n(v.checkin_distance_m),checkin_verified:v.checkin_verified,
        checkout_at:v.checkout_at,checkout_accuracy_m:n(v.checkout_accuracy_m),
        checkout_distance_m:n(v.checkout_distance_m),checkout_verified:v.checkout_verified,
        photo_count:counts.get(String(v.id))??0,
      })).sort((a,b)=>b.scheduled_at.localeCompare(a.scheduled_at));
    },staleTime:8_000,
  });
}
export function useVpFieldPhotos(visitId:string|undefined) {
  const {tenant}=useApp();
  return useQuery({
    queryKey:['vp-field-photos',tenant.id,visitId],enabled:!!visitId,
    queryFn:async():Promise<FieldPhoto[]>=>{
      const {data,error}=await vpDb.from('vp_visit_photos')
        .select('id,visit_id,storage_path,name,mime,size,uploaded_at')
        .eq('org_id',tenant.id).eq('visit_id',visitId!).order('uploaded_at',{ascending:false});
      if(error) throw error;
      return (data??[]).map((p:any)=>({...p,id:String(p.id),visit_id:String(p.visit_id)}));
    },
  });
}
export function useVpVisitCosts(visitId:string|undefined) {
  const {tenant}=useApp();
  return useQuery({
    queryKey:['vp-field-costs',tenant.id,visitId],enabled:!!visitId,
    queryFn:async():Promise<{expenses:VisitExpense[],travel:VisitTravel|null}>=>{
      const [links,travelRes]=await Promise.all([
        vpDb.from('vp_visit_expense_links').select('expense_id').eq('org_id',tenant.id).eq('visit_id',visitId!),
        vpDb.from('vp_visit_travel').select('day,km').eq('org_id',tenant.id).eq('visit_id',visitId!).maybeSingle(),
      ]);
      if(links.error) throw links.error;
      if(travelRes.error) throw travelRes.error;
      const ids=(links.data??[]).map((x:any)=>x.expense_id);
      let expenses:VisitExpense[]=[];
      if(ids.length){
        const {data,error}=await vpDb.from('expenses').select('id,day,cat,amt')
          .eq('org_id',tenant.id).in('id',ids);
        if(error) throw error;
        expenses=(data??[]).map((x:any)=>({id:String(x.id),day:x.day,cat:x.cat,amt:Number(x.amt)}));
      }
      return {expenses,travel:travelRes.data?{day:travelRes.data.day,km:Number(travelRes.data.km)}:null};
    },staleTime:5_000,
  });
}

export async function getDevicePosition():Promise<{lat:number;lng:number;accuracy:number}>{
  if(typeof navigator==='undefined'||!navigator.geolocation) throw new Error('GPS is unavailable on this device/browser');
  return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(
    p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy}),
    e=>reject(new Error(e.message||'Could not get device location')),
    {enableHighAccuracy:true,maximumAge:0,timeout:20_000},
  ));
}
export async function uploadFieldPhoto(orgId:string,visit:FieldVisit,file:File):Promise<void> {
  const ext:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
  if(!ext[file.type]) throw new Error('Only JPEG, PNG and WebP photos are supported');
  if(file.size<1||file.size>10_485_760) throw new Error('Photo must be between 1 byte and 10 MB');
  if(file.name.length>250) throw new Error('Photo filename is too long');
  const path=`${orgId}/${visit.num}/${visit.id}/${crypto.randomUUID()}.${ext[file.type]}`;
  const {error:uploadError}=await vpDb.storage.from(FIELD_BUCKET).upload(path,file,
    {contentType:file.type,cacheControl:'3600',upsert:false});
  if(uploadError) throw uploadError;
  const {error}=await vpDb.rpc('vp_field_register_photo',{
    p_visit_id:visit.id,p_path:path,p_name:file.name,p_mime:file.type,p_size:file.size,
  });
  if(error) throw new Error(`File uploaded, but evidence registration failed: ${error.message}. Ask the administrator to clean up the orphan private object.`);
}
export async function openFieldPhoto(path:string):Promise<void> {
  const {data,error}=await vpDb.storage.from(FIELD_BUCKET).createSignedUrl(path,60);
  if(error||!data?.signedUrl) throw error??new Error('Unable to open photo');
  window.open(data.signedUrl,'_blank','noopener,noreferrer');
}
