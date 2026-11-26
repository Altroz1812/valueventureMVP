import { useQuery } from '@tanstack/react-query';
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { inspectionSections, inspectionPhotoCategoryFromName, inspectionRequiredPhotoSlots, missingInspectionFields } from '@/lib/vp-inspection-template';
import { useVpFieldPhotos,openFieldPhoto } from '@/lib/vp-field';

import { VpP22Sketch } from '@/components/field/vp-p22-sketch';
import { P22_KEY } from '@/lib/vp-p22-sketch';
import { VpP18QcSummary } from '@/components/field/vp-p18-supplement';
import { P18_KEY } from '@/lib/vp-p18-templates';

type ReadReport={data?:Record<string,string>;status?:string};
type LinkedReport={visit_id?:number|string;report?:ReadReport;data?:Record<string,string>;status?:string};
export function VpInspectionQcSummary({caseNum,propertyType}:{caseNum:number;propertyType:string}) {
  const {tenant}=useApp();
  const query=useQuery({
    queryKey:['vp-inspection-qc',tenant.id,caseNum],enabled:caseNum>0,
    queryFn:async():Promise<LinkedReport>=>{
      const {data,error}=await vpDb.rpc('vp_inspection_for_case',{p_case_num:caseNum});
      if(error)throw error;
      return (data??{}) as LinkedReport;
    },staleTime:0,
  });
  const report=query.data?.report??query.data;
  const fields=report?.data??{};
  const visitId=query.data?.visit_id!=null?String(query.data.visit_id):undefined;
  const photos=useVpFieldPhotos(visitId);
  const requiredCategories=inspectionRequiredPhotoSlots(propertyType);
  const uploadedCategories=new Set((photos.data??[]).map(p=>inspectionPhotoCategoryFromName(p.name)).filter(Boolean));
  const missingCategories=requiredCategories.filter(c=>!uploadedCategories.has(c));
  const missingFields=missingInspectionFields(fields);
  return <Card>
    <CardHeader><CardTitle className="text-sm">Site Inspection — Read-only QC Reference</CardTitle></CardHeader>
    <CardContent className="space-y-3 text-sm">
      {query.isLoading&&<p>Loading site inspection...</p>}
      {query.error&&<p role="alert" className="text-destructive">Inspection error: {query.error.message}</p>}
      {!query.isLoading&&!query.error&&<p className="text-muted-foreground">Status: <strong>{report?.status??'Not started'}</strong> · This report does not replace QC decision or sign-off.</p>}
      {report?.status!=='Submitted'&&!query.isLoading&&<p role="alert" className="text-destructive">Inspection is not submitted; Field QC approval is blocked by the P0 server guard.</p>}
      {missingFields.length>0&&<p className="text-amber-700">Missing mandatory fields: {missingFields.join(', ')}</p>}
      {photos.error&&<p className="text-destructive">Evidence access error: {photos.error.message}</p>}
      <div className="rounded border p-3 space-y-2">
        <p className="font-medium">Actual registered evidence: {photos.data?.length??0} photo(s)</p>
        {missingCategories.length>0&&<p className="text-amber-700">Missing required categories: {missingCategories.join(', ')}</p>}
        <div className="flex flex-wrap gap-2">{(photos.data??[]).map(p=><Button key={p.id} variant="outline" size="sm" onClick={()=>void openFieldPhoto(p.storage_path).catch(e=>toast.error(String(e)))}>{inspectionPhotoCategoryFromName(p.name)??p.name.slice(0,25)}</Button>)}</div>
        <p className="text-xs text-muted-foreground">Private evidence links expire. The backend independently checks required categories and configured minimum; this screen does not certify geotags.</p>
      </div>
      <VpP18QcSummary raw={fields[P18_KEY]}/><VpP22Sketch raw={fields[P22_KEY]} disabled/>
      {inspectionSections.map(section=>{
        const entries=section.fields.filter(f=>String(fields[f.key]??'').trim().length>0);
        if(!entries.length)return null;
        return <div className="rounded border p-3" key={section.id}>
          <h4 className="mb-2 font-semibold">{section.title}</h4>
          <dl className="grid gap-2 sm:grid-cols-2">
            {entries.map(f=><div key={f.key}><dt className="text-xs text-muted-foreground">{f.label}</dt><dd className="whitespace-pre-wrap break-words">{fields[f.key]}</dd></div>)}
          </dl>
        </div>;
      })}
    </CardContent>
  </Card>;
}
