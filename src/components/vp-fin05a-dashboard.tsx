import {useEffect,useState} from 'react';
import {useApp} from '@/lib/app-context';
import {vpDb} from '@/lib/vp-db';
type Row=Record<string,unknown>;
type Snapshot={asOf:string;generatedAt:string;totals:Row;branches:Row[];clients:Row[];categories:Row[];ageing:Row[];checks:Row};
const obj=(v:unknown):Row=>{if(v===null||typeof v!=='object'||Array.isArray(v))throw new Error('Invalid finance response');return v as Row;};
const rows=(v:unknown):Row[]=>{if(!Array.isArray(v))throw new Error('Invalid finance list');return v.map(obj);};
const text=(v:unknown):string=>typeof v==='string'?v:typeof v==='number'?String(v):'—';
const numeric=(v:unknown):number=>{const n=typeof v==='number'?v:typeof v==='string'&&v.trim()!==''?Number(v):NaN;if(!Number.isFinite(n))throw new Error('Missing/invalid financial value');return n;};
const inr=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2});
const money=(v:unknown)=>inr.format(numeric(v));
const count=(v:unknown)=>numeric(v).toLocaleString('en-IN');
const cashKeys=['issued','bank_received','tds_credit','receivable','overdue','approved_original','net_approved','reduction','cash_paid','advance_applied','payable','advances_issued','advances_outstanding','approved_unissued'];
const countKeys=['invoice_count','approved_claim_count','draft_batches','submitted_claims','returned_claims','pending_payments','pending_entries'];
const checkKeys=['invoice_anomalies','claim_anomalies','advance_anomalies','category_difference','ageing_difference'];
function decode(v:unknown,org:string):Snapshot{
 const r=obj(v);if(r['org_id']!==org||r['scope']!=='current_visible_fin_ledgers'||r['currency']!=='INR')throw new Error('Finance workspace or schema mismatch');
 const totals=obj(r['totals']),checks=obj(r['checks']),branches=rows(r['branches']),clients=rows(r['clients']),categories=rows(r['categories']),ageing=rows(r['ageing']);
 for(const t of [totals,...branches])for(const k of [...cashKeys,...countKeys])numeric(t[k]);
 for(const c of clients)for(const k of ['issued','bank_received','tds_credit','receivable','overdue','invoice_count'])numeric(c[k]);
 for(const c of categories)numeric(c['approved_original']);for(const a of ageing)numeric(a['outstanding']);for(const k of checkKeys)numeric(checks[k]);
 return {asOf:text(r['as_of']),generatedAt:text(r['generated_at']),totals,checks,branches,clients,categories,ageing};
}
type Column={key:string;label:string;kind:'money'|'count'|'text'};
function Table({data,columns,idKey}:{data:Row[];columns:Column[];idKey:string}){
 return <div className="overflow-x-auto rounded border"><table className="w-full text-xs"><thead className="bg-muted/50"><tr>{columns.map(c=><th key={c.key} className={'whitespace-nowrap p-2 '+(c.kind==='text'?'text-left':'text-right')}>{c.label}</th>)}</tr></thead><tbody>{data.map((r,i)=><tr className="border-t" key={text(r[idKey])+'-'+i}>{columns.map(c=><td key={c.key} className={'p-2 '+(c.kind==='text'?'text-left':'whitespace-nowrap text-right tabular-nums')}>{c.kind==='money'?money(r[c.key]):c.kind==='count'?count(r[c.key]):text(r[c.key])}</td>)}</tr>)}</tbody></table>{data.length===0&&<p className="p-3 text-muted-foreground">No records in this scope.</p>}</div>;
}
const m=(key:string,label:string):Column=>({key,label,kind:'money'});const t=(key:string,label:string):Column=>({key,label,kind:'text'});const n=(key:string,label:string):Column=>({key,label,kind:'count'});
function Cards({values,items}:{values:Row;items:Column[]}){return <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{items.map(c=><div key={c.key} className="min-w-0 rounded border p-3"><p className="text-xs text-muted-foreground">{c.label}</p><p className="break-words text-base font-semibold tabular-nums">{c.kind==='count'?count(values[c.key]):money(values[c.key])}</p></div>)}</div>;}
export function VpFin05ADashboard(){const {tenant,capabilities}=useApp();return capabilities.includes('billing.View')?<Dashboard key={tenant.id} org={tenant.id}/>:null;}
function Dashboard({org}:{org:string}){
 const [data,setData]=useState<Snapshot|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[refresh,setRefresh]=useState(0);
 useEffect(()=>{let current=true;setLoading(true);setError('');setData(null);void (async()=>{try{const {data:raw,error:rpcError}=await vpDb.rpc('vp_fin05a_snapshot',{});if(rpcError)throw new Error(rpcError.message);const snap=decode(raw,org);if(current)setData(snap);}catch(e){if(current)setError(e instanceof Error?e.message:String(e));}finally{if(current)setLoading(false);}})();return()=>{current=false;};},[org,refresh]);
 const invalid=data!==null&&checkKeys.some(k=>numeric(data.checks[k])!==0);
 return <section className="mb-4 rounded-lg border bg-card p-3 space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-base font-semibold">Finance overview · FIN-05A</h2><p className="text-xs text-muted-foreground">Current balances · authorized branches only · INR</p></div><button type="button" disabled={loading} className="rounded border px-3 py-2 text-xs font-medium disabled:opacity-50" onClick={()=>setRefresh(v=>v+1)}>{loading?'Loading…':'Refresh'}</button></div>
 <p className="rounded border p-2 text-xs text-muted-foreground">New FIN ledgers only. Legacy invoices, trips, expenses, SaaS subscriptions and unapproved charges are not included. This is not a historical as-of report, bank balance, cash-flow statement or profit report.</p>
 {loading&&<p role="status" className="text-sm">Loading authorized finance balances…</p>}{error!==''&&<p role="alert" className="rounded border border-red-500 p-2 text-sm">Finance dashboard unavailable: {error}. Requires FIN-03 administrator and billing.View access.</p>}
 {data!==null&&<><p className="text-xs text-muted-foreground">Balance date (IST): {data.asOf} · Snapshot: {data.generatedAt}</p>{invalid?<div role="alert" className="rounded border border-amber-500 p-3 text-sm"><p className="font-semibold">Reconciliation failed — do not rely on these totals until reviewed.</p>{checkKeys.map(k=><p key={k}>{k}: {text(data.checks[k])}</p>)}</div>:<p className="text-xs text-muted-foreground">Arithmetic reconciliation checks passed for this scope; ledger completeness and approvals still require review.</p>}
 <h3 className="text-sm font-semibold">Client receivables</h3><Cards values={data.totals} items={[m('receivable','Outstanding receivables'),m('overdue','Overdue receivables'),m('issued','Issued invoice value'),m('approved_unissued','Approved, not issued'),m('bank_received','Posted bank receipts'),m('tds_credit','Posted TDS credits'),n('invoice_count','Issued invoices'),n('draft_batches','Draft batches')]}/>
 <h3 className="text-sm font-semibold">Employee reimbursements & advances</h3><Cards values={data.totals} items={[m('payable','Outstanding reimbursement'),m('net_approved','Net approved claims'),m('cash_paid','Net posted cash paid'),m('advance_applied','Net advance allocated'),m('advances_outstanding','Unsettled advances'),m('advances_issued','Posted advances issued'),m('approved_original','Original approved claims'),m('reduction','Posted claim reductions')]}/>
 <h3 className="text-sm font-semibold">Approval queues (not in posted balances)</h3><Cards values={data.totals} items={[n('submitted_claims','Submitted claims'),n('returned_claims','Returned claims'),n('pending_payments','Pending reimbursements'),n('pending_entries','Pending advance/correction entries')]}/>
 <h3 className="text-sm font-semibold">Receivable ageing</h3><div className="space-y-2">{data.ageing.map(a=>{const amount=numeric(a['outstanding']),total=numeric(data.totals['receivable']);const pct=total>0?Math.max(0,Math.min(100,100*amount/total)):0;return <div key={text(a['bucket'])}><div className="flex justify-between gap-2 text-xs"><span>{text(a['bucket'])}</span><span className="tabular-nums">{money(amount)}</span></div><div className="h-2 overflow-hidden rounded bg-muted"><div className="h-full rounded bg-primary" style={{width:`${pct}%`}}/></div></div>;})}</div>
 <h3 className="text-sm font-semibold">Agency branch financial summary</h3><Table data={data.branches} idKey="branch_id" columns={[t('branch_name','Branch'),m('issued','Issued'),m('receivable','Receivable'),m('overdue','Overdue'),m('approved_unissued','Not issued'),m('net_approved','Net claims'),m('cash_paid','Cash paid'),m('advance_applied','Advance applied'),m('payable','Payable'),m('advances_outstanding','Unsettled advances')]}/>
 <h3 className="text-sm font-semibold">Client-wise receivables</h3><Table data={data.clients} idKey="client" columns={[t('client','Client'),n('invoice_count','Invoices'),m('issued','Issued'),m('bank_received','Bank receipts'),m('tds_credit','TDS'),m('receivable','Outstanding'),m('overdue','Overdue')]}/>
 <h3 className="text-sm font-semibold">Expense categories — original approved value</h3><p className="text-xs text-muted-foreground">Includes approved monthly claim line amounts after applicable ceilings. Later claim reductions remain separate because the existing ledger does not assign reductions to categories.</p><Table data={data.categories} idKey="category" columns={[t('category','Expense code'),m('approved_original','Original approved')]}/></>}
 </section>;
}
