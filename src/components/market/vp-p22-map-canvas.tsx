import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import {Button} from '@/components/ui/button';
export type MapPoint={id:string;lat:number;lng:number;label:string;subject:boolean};
export default function MapCanvas({points,radius}:{points:MapPoint[];radius:number}){
 const el=useRef<HTMLDivElement>(null);const mapRef=useRef<L.Map|null>(null);const drawn=useRef<L.Layer|null>(null);const [ready,setReady]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{const subject=points.find(p=>p.subject);if(!subject||!el.current)return;let map:L.Map|undefined;let observer:ResizeObserver|undefined;
  try{map=L.map(el.current,{attributionControl:true}).setView([subject.lat,subject.lng],14);mapRef.current=map;
   const ring=L.circle([subject.lat,subject.lng],{radius,color:'#2563eb',fillOpacity:0.03,interactive:false,pmIgnore:true}).addTo(map);
   const bounds=ring.getBounds();
   points.forEach(p=>{const marker=L.circleMarker([p.lat,p.lng],{radius:p.subject?9:6,color:p.subject?'#1d4ed8':'#15803d',fillOpacity:0.85,pmIgnore:true}).addTo(map!);const label=document.createElement('span');label.textContent=p.label;marker.bindTooltip(label);bounds.extend([p.lat,p.lng]);});
   map.fitBounds(bounds.pad(0.2),{maxZoom:16});
   map.on('pm:create',(evt:L.LeafletEvent)=>{const layer=(evt as L.LeafletEvent&{layer:L.Layer}).layer;if(drawn.current)map?.removeLayer(drawn.current);drawn.current=layer;map?.pm.disableDraw();});
   observer=new ResizeObserver(()=>map?.invalidateSize());observer.observe(el.current);setReady(true);setError('');
  }catch(e){setError(String(e));setReady(false);}
  return()=>{observer?.disconnect();map?.remove();mapRef.current=null;drawn.current=null;};
 },[points,radius]);
 return <div className="space-y-2"><div ref={el} style={{height:360,background:'#e9eef1'}} aria-label="Comparable coordinate map without online tiles"/>{error&&<p role="alert" className="text-destructive">Map unavailable: {error}</p>}<div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={!ready} onClick={()=>mapRef.current?.pm.enableDraw('Polygon',{allowSelfIntersection:false})}>Draw temporary outline</Button><Button type="button" variant="outline" disabled={!ready} onClick={()=>{mapRef.current?.pm.disableDraw();if(drawn.current)mapRef.current?.removeLayer(drawn.current);drawn.current=null;}}>Clear / cancel outline</Button></div><p className="text-xs text-muted-foreground">Blue: subject. Green: comparable. Circle: search radius. Coordinates use Leaflet projection; map has no external tile requests. Drawn polygon is temporary, not a recorded parcel or survey.</p></div>;
}
