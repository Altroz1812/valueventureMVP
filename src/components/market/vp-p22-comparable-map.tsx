import {lazy,Suspense,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useApp} from '@/lib/app-context';
import {vpDb} from '@/lib/vp-db';
import {Button} from '@/components/ui/button';
import {validMapPoint} from '@/lib/vp-p22-sketch';
import type {SearchFilters,Comparable} from '@/lib/vp-market';
import type {MapPoint} from './vp-p22-map-canvas';
const Canvas=lazy(()=>import('./vp-p22-map-canvas'));
export function VpP22ComparableMap({filters,rows}:{filters:SearchFilters;rows:Comparable[]}){
 const {tenant,can}=useApp();const [open,setOpen]=useState(false);const ids=rows.map(r=>r.evidence_id);
 const query=useQuery({queryKey:['vp-p22-map',tenant.id,filters,ids],enabled:open&&can('cases.View'),queryFn:async()=>{
  const {data:rev,error:revError}=await vpDb.from('vp_property_revisions').select('data').eq('org_id',tenant.id).eq('property_id',filters.property_id).eq('revision',filters.revision).single();if(revError)throw revError;
  const s=rev?.data as {latitude:unknown;longitude:unknown}|undefined;if(!s||!validMapPoint(s.latitude,s.longitude))throw new Error('Pinned subject revision has no usable map coordinates.');
  const points:MapPoint[]=[{id:'subject',lat:s.latitude,lng:Number(s.longitude),label:`Subject PM-${filters.property_id} r${filters.revision}`,subject:true}];
  if(ids.length){const {data,error}=await vpDb.from('vp_market_evidence').select('id::text,latitude,longitude').eq('org_id',tenant.id).in('id',ids);if(error)throw error;
   const lookup=new Map(rows.map(r=>[r.evidence_id,r]));for(const p of (data??[]) as unknown as {id:string;latitude:unknown;longitude:unknown}[]){const r=lookup.get(String(p.id));if(r&&validMapPoint(p.latitude,p.longitude))points.push({id:r.evidence_id,lat:p.latitude,lng:Number(p.longitude),label:`${r.label} · ${(r.dist_meters/1000).toFixed(2)} km · ${r.status}`,subject:false});}
  }return points;
 }});
 return <section className="rounded border p-3 space-y-2"><Button type="button" variant="outline" onClick={()=>setOpen(v=>!v)}>{open?'Hide comparable map':'Show comparable map (P22)'}</Button>{open&&<>{query.isLoading&&<p>Loading registered coordinates…</p>}{query.error&&<p role="alert" className="text-destructive">Map coordinates unavailable: {String(query.error.message??query.error)}</p>}{query.data&&<><p className="text-xs text-muted-foreground">Mapped {query.data.length-1} of {rows.length} matched evidence records. Missing/unsupported coordinates are omitted; table remains authoritative.</p><Suspense fallback={<p>Loading map…</p>}><Canvas points={query.data} radius={filters.radius}/></Suspense></>}</>}</section>;
}
