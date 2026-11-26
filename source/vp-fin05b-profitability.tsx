import {useEffect,useState} from 'react';
import {useApp} from '@/lib/app-context';
import {vpDb} from '@/lib/vp-db';
type Row=Record<string,unknown>;
type Snapshot={totals:Row;checks:Row;cases:Row[];clients:Row[];branches:Row[];count:number;generated:string};
const obj=(v:unknown):Row=>{if(v===null||typeof v!=='object'||Array.isArray(v))throw new Error('Invalid contribution response');return v as Row;};
const rows=(v:unknown):Row[]=>{if(!Array.isArray(v))throw new Error('Invalid contribution list');return v.map(obj);};
const num=(v:unknown):number=>{const n=typeof v==='number'?v:typeof v==='string'&&v.trim()!==''?Number(v):NaN;if(!Number.isFinite(n))throw new Error('Invalid financial value');return n;};
const txt=(v:unknown)=>typeof v==='string'?v:typeof v==='number'?String(v):'Unallocated / unspecified';
const inr=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2});
const money=(v:unknown)=>inr.format(num(v));
const keys=['revenue','cost','contribution'];
function decode(v:unknown,org:string,offset:number):Snapshot{
 const r=obj(v);if(r['org_id']!==org||r['scope']!=='current_fin_contribution'||r['allocation_method']!=='indicative_equal_distinct_case_v1'||r['currency']!=='INR'||r['offset']!==offset)throw new Error('Contribution workspace or schema mismatch');
 const totals=obj(r['totals']),checks=obj(r['checks']),cases=rows(r['cases']),clients=rows(r['clients']),branches=rows(r['branches']);
 for(const x of [totals,...cases,...clients,...branches])for(const k of keys)num(x[k]);
 for(const x of [totals,...branches])num(x['unallocated_cost']);num(totals['allocated_cost']);
 for(const k of ['bad_batches','bad_claims','unresolved_journeys','revenue_difference','cost_difference'])num(checks[k]);
 const count=num(r['case_count']);if(!Number.isSafeInteger(count)||count<0||cases.length>100)throw new Error('Invalid page');
 return {totals,checks,cases,clients,branches,count,generated:txt(r['generated_at'])};
}
type Column={key:string;label:string;money?:boolean};
const valueCols:Column[]=[{key:'revenue',label:'Issued revenue (ex GST)',money:true},{key:'cost',label:'Net claim cost',money:true},{key:'contribution',label:'Contribution',money:true}];
function Table({data,columns}:{data:Row[];columns:Column[]}){return <div className="overflow-x-auto rounded border"><table className="w-full text-xs"><thead className="bg-muted/50"><tr>{columns.map(c=><th className={'whitespace-nowrap p-2 '+(c.money?'text-right':'text-left')} key={c.key}>{c.label}</th>)}<th className="p-2 text-right">Margin %</th></tr></thead><tbody>{data.map((r,i)=>{const revenue=num(r['revenue']),contribution=num(r['contribution']);return <tr key={i} className="border-t">{columns.map(c=><td className={'p-2 '+(c.money?'whitespace-nowrap text-right tabular-nums':'text-left')+(c.key==='contribution'&&contribution<0?' text-red-600 font-medium':'')} key={c.key}>{c.money?money(r[c.key]):txt(r[c.key])}</td>)}<td className="p-2 text-right tabular-nums">{revenue>0?(100*contribution/revenue).toFixed(1)+'%':'—'}</td></tr>;})}</tbody></table>{data.length===0&&<p className="p-3 text-muted-foreground">No records in scope.</p>}</div>;}
export function VpFin05BProfitability(){const {tenant,capabilities}=useApp();return capabilities.includes('billing.View')?<Profitability key={tenant.id} org={tenant.id}/>:null;}
function Profitability({org}:{org:string}){
 const [data,setData]=useState<Snapshot|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[offset,setOffset]=useState(0),[refresh,setRefresh]=useState(0);
 useEffect(()=>{let current=true;setData(null);setError('');setLoading(true);void(async()=>{try{const {data:raw,error:rpcError}=await vpDb.rpc('vp_fin05b_snapshot',{p_offset:offset});if(rpcError)throw new Error(rpcError.message);const d=decode(raw,org,offset);if(current)setData(d);}catch(e){if(current)setError(e instanceof Error?e.message:String(e));}finally{if(current)setLoading(false);}})();return()=>{current=false;};},[org,offset,refresh]);
 const cards=[{key:'revenue',label:'Issued revenue, ex GST'},{key:'cost',label:'Net approved claim cost'},{key:'allocated_cost',label:'Allocated case cost'},{key:'unallocated_cost',label:'Unallocated branch cost'},{key:'contribution',label:'Branch contribution before other costs'}];
 return <section className="mb-4 space-y-3 rounded-lg border bg-card p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-base font-semibold">Profitability & cost allocation · FIN-05B</h2><p className="text-xs text-muted-foreground">Indicative contribution · all recorded FIN history · authorized branches only</p></div><button type="button" disabled={loading} onClick={()=>{setData(null);setRefresh(x=>x+1);}} className="rounded border px-3 py-2 text-xs">Refresh</button></div>
 <p className="rounded border p-2 text-xs text-muted-foreground">Management estimate, not accounting profit. Approved mileage is split equally across distinct cases in each journey, after proportional claim reductions. Other allowances and unresolved journeys remain branch costs; not allocated to clients. Revenue uses issued invoice taxable amounts only. Legacy data, unissued work, salaries and other overheads are excluded. No accounting entries are created.</p>
 {loading&&<p role="status" className="text-sm">Loading contribution balances…</p>}{error!==''&&<p role="alert" className="rounded border border-red-500 p-2 text-sm">Contribution unavailable: {error}</p>}
 {data!==null&&<><p className="text-xs text-muted-foreground">Snapshot: {data.generated}</p>{num(data.checks['unresolved_journeys'])>0&&<p role="alert" className="rounded border border-amber-500 p-2 text-sm">{num(data.checks['unresolved_journeys'])} journey lines could not be attributed safely; their costs are included in unallocated branch costs.</p>}
 <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">{cards.map(c=><div key={c.key} className="min-w-0 rounded border p-3"><p className="text-xs text-muted-foreground">{c.label}</p><p className="break-words font-semibold tabular-nums">{money(data.totals[c.key])}</p></div>)}</div>
 <h3 className="text-sm font-semibold">Branch contribution (includes unallocated costs)</h3><Table data={data.branches} columns={[{key:'branch_name',label:'Branch'},...valueCols,{key:'unallocated_cost',label:'Unallocated within cost',money:true}]}/>
 <h3 className="text-sm font-semibold">Client contribution (allocated costs only)</h3><Table data={data.clients} columns={[{key:'client',label:'Client / unallocated'},...valueCols]}/>
 <h3 className="text-sm font-semibold">Case contribution · lowest first</h3><p className="text-xs text-muted-foreground">Case numbers are grouped by historic agency branch and client snapshots. A case can appear under multiple historical groups. No revenue means margin percentage is not applicable.</p><Table data={data.cases} columns={[{key:'branch_name',label:'Branch'},{key:'client',label:'Client'},{key:'case_num',label:'Case no.'},...valueCols]}/><div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span>{data.count===0?'0 rows':`${offset+1}–${offset+data.cases.length} of ${data.count} groups`}</span><div className="flex gap-2"><button type="button" className="rounded border px-3 py-2 disabled:opacity-50" disabled={offset===0||loading} onClick={()=>{setData(null);setOffset(x=>Math.max(0,x-100));}}>Previous</button><button type="button" className="rounded border px-3 py-2 disabled:opacity-50" disabled={offset+100>=data.count||loading||offset>=1000000} onClick={()=>{setData(null);setOffset(x=>x+100);}}>Next</button></div></div></>}
 </section>;
}
