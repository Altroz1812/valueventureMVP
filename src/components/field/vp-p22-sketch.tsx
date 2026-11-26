import {lazy,Suspense,useEffect,useMemo,useState} from 'react';
import {Card,CardHeader,CardTitle,CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {decodeSketches,encodeSketches,MAX_POINTS,WIDTH,HEIGHT,clampPoint,sketchSubmissionError,type Sketch} from '@/lib/vp-p22-sketch';
const Canvas=lazy(()=>import('./vp-p22-canvas'));
export function VpP22Sketch({raw,disabled,onChange}:{raw:string|undefined;disabled:boolean;onChange?:(s:string)=>void}){
 const [mounted,setMounted]=useState(false);const [kind,setKind]=useState<'plot'|'floor'>('plot');useEffect(()=>setMounted(true),[]);
 const parsed=useMemo(()=>{try{return {data:decodeSketches(raw),error:''};}catch(e){return {data:null,error:String(e)};}},[raw]);
 if(disabled&&!raw)return null;
 if(!parsed.data)return <p role="alert" className="text-destructive">Stored sketch unreadable; preserved unchanged. {parsed.error}</p>;
 const data=parsed.data,s=data[kind];const update=(next:Sketch)=>{if(!disabled)onChange?.(encodeSketches({...data,[kind]:next}));};
 return <Card><CardHeader><CardTitle className="text-base">Plot & floor schematic</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
 <p className="text-muted-foreground">Optional drawing, not to scale or certified. No geometric area or rate enters valuation. Changes use the existing inspection save and submission lock.</p>
 <div className="flex gap-2"><Button type="button" aria-pressed={kind==='plot'} variant={kind==='plot'?'default':'outline'} onClick={()=>setKind('plot')}>Plot</Button><Button type="button" aria-pressed={kind==='floor'} variant={kind==='floor'?'default':'outline'} onClick={()=>setKind('floor')}>Floor</Button></div>
 <label className="grid gap-1">Sketch name<Input value={s.name} maxLength={80} disabled={disabled} onChange={e=>update({...s,name:e.target.value})}/></label>
 {mounted&&<Suspense fallback={<p>Loading canvas…</p>}><Canvas sketch={s} disabled={disabled} onChange={update}/></Suspense>}
 {!disabled&&<><p>Tap the canvas to add a vertex, drag points to adjust, or edit coordinates below. Maximum {MAX_POINTS} vertices.</p><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={s.points.length>=MAX_POINTS} onClick={()=>update({...s,points:[...s.points,clampPoint(40+s.points.length*19,60+s.points.length%4*40)]})}>Add vertex</Button><Button type="button" variant="outline" disabled={!s.points.length} onClick={()=>update({...s,points:s.points.slice(0,-1)})}>Undo last vertex</Button><Button type="button" variant="outline" disabled={!s.points.length} onClick={()=>{if(window.confirm('Clear this schematic?'))update({...s,points:[]});}}>Clear outline</Button></div></>}
 {s.points.map((p,i)=><div className="grid grid-cols-2 gap-2 rounded border p-2 sm:grid-cols-3" key={i}><label>Vertex {i+1} X<Input type="number" min={0} max={WIDTH} value={p.x} disabled={disabled} onChange={e=>update({...s,points:s.points.map((q,j)=>j===i?{...clampPoint(Number(e.target.value),q.y),label:q.label}:q)})}/></label><label>Vertex {i+1} Y<Input type="number" min={0} max={HEIGHT} value={p.y} disabled={disabled} onChange={e=>update({...s,points:s.points.map((q,j)=>j===i?{...clampPoint(q.x,Number(e.target.value)),label:q.label}:q)})}/></label><label className="col-span-2 sm:col-span-1">Edge to next vertex (observed)<Input value={p.label} maxLength={80} disabled={disabled} onChange={e=>update({...s,points:s.points.map((q,j)=>j===i?{...q,label:e.target.value}:q)})}/></label></div>)}
 <label className="grid gap-1">Drawing notes<textarea className="rounded border bg-background p-2" maxLength={500} value={s.note} disabled={disabled} onChange={e=>update({...s,note:e.target.value})}/></label>
 {sketchSubmissionError(raw)&&<p role="status" className="text-amber-700">{sketchSubmissionError(raw)}</p>}
 </CardContent></Card>;
}
