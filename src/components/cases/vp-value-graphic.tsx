import { fmtINR } from '@/lib/data';
import { previewBar } from '@/lib/vp-workbench';
export function ValueGraphic({market,realizable,distress}:{market:number;realizable:number;distress:number}){
  const entries=[{label:'Market value',value:market},{label:'Realizable value',value:realizable},{label:'Distress / forced sale value',value:distress}];
  const scale=Math.max(0,...entries.map(e=>Number.isFinite(e.value)?e.value:0));
  return <figure className="vp-value-graphic" aria-label="Local calculation comparison"><figcaption className="mb-2"><h3 className="text-sm font-semibold">Value comparison</h3><p className="mt-1 text-xs text-muted-foreground">Local preview · not approved or certified</p></figcaption><div className="space-y-2">{entries.map((e,i)=><div key={e.label}><div className="mb-1 flex flex-wrap items-center justify-between gap-1 text-sm"><span>{e.label}</span><strong className="tabular-nums">{Number.isFinite(e.value)?fmtINR(e.value):'Unavailable'}</strong></div><div className="vp-graphic-track" aria-hidden="true"><div className={`vp-graphic-fill vp-value-fill-${i}`} style={{width:`${previewBar(e.value,scale)}%`}}/></div></div>)}</div></figure>;
}
