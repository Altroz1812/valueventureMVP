import {useQuery} from '@tanstack/react-query';
import {useApp} from '@/lib/app-context';
import {vpDb} from '@/lib/vp-db';
import {defaultTemplate,isP18Category,parseFields,type P18Category,type P18Field,type P18Template} from '@/lib/vp-p18-templates';
export function useP18Template(category:string,enabled=true){
 const {tenant}=useApp();
 return useQuery({queryKey:['vp-p18-template',tenant.id,category],enabled:enabled&&isP18Category(category),retry:false,staleTime:Infinity,refetchOnWindowFocus:false,queryFn:async():Promise<P18Template>=>{
  if(!isP18Category(category))throw new Error('Unsupported case category');
  const {data,error}=await vpDb.from('vp_p18_templates').select('id::text,category,fields').eq('org_id',tenant.id).eq('category',category).order('id',{ascending:false}).limit(1).maybeSingle();
  if(error)throw error;if(!data)return defaultTemplate(category);
  return {category,revision:String(data['id']),fields:parseFields(data['fields'])};
 }});
}
export async function publishP18Template(category:P18Category,fields:P18Field[],reason:string){
 const {error}=await vpDb.rpc('vp_p18_publish_template',{p_category:category,p_fields:parseFields(fields),p_reason:reason});if(error)throw error;
}
