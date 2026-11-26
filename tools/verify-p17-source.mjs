import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.argv[2]??'.';const r=f=>fs.readFileSync(path.join(root,f),'utf8');const files=fs.readdirSync(path.join(root,'sql/p17')).filter(f=>f.endsWith('.sql'));const sql=files.map(f=>r('sql/p17/'+f)).join('\n');const table=r('sql/p17/02_EVIDENCE_TABLE.sql'),search=r('sql/p17/04_SEARCH.sql'),write=r('sql/p17/03_EVIDENCE_WRITE.sql'),sel=r('sql/p17/05_CASE_EVIDENCE.sql'),converter=r('sql/p17/01_CONVERTER.sql');const checks=[
['all executable scripts below 4KB',files.every(f=>Buffer.byteLength(r('sql/p17/'+f))<4000)],
['balanced dollar quotes',files.every(f=>(r('sql/p17/'+f).match(/\$\$/g)||[]).length%2===0)],
['five transactional migration steps',files.filter(f=>/^0[1-5]_/.test(f)).every(f=>/^BEGIN;/m.test(r('sql/p17/'+f))&&/^COMMIT;/m.test(r('sql/p17/'+f)))],
['original MIT license and pinned source',r('third_party/open-comps/LICENSE').includes('MIT License')&&r('third_party/open-comps/SOURCE_REGISTER.md').includes('a2c42772c766fe31eb900fd7368cf900cd8b8190')],
['original converter algorithm',converter.includes('RETURN val * from_factor / to_factor;')&&r('third_party/open-comps/convert_measure.original.sql').includes('RETURN val * from_factor / to_factor;')],
['original nearby spatial operations retained',['ST_Distance','ST_DWithin','<-> anchor'].every(x=>search.includes(x)&&r('third_party/open-comps/nearby_sales.original.sql').includes(x))],
['tenant RLS for both tables',[table,sel].every(x=>x.includes('ENABLE ROW LEVEL SECURITY')&&x.includes('org_id=(SELECT public.vp_current_org_id())'))],
['case visibility restriction',sel.includes('public.vp_sec_case_visible(num)')&&sel.includes('public.vp_sec_case_visible(p_num)')],
['no direct authenticated writes',![table,sel].some(x=>/GRANT (INSERT|UPDATE|DELETE|ALL)/i.test(x))],
['composite tenant-bound references',table.includes('FOREIGN KEY(org_id,property_id,property_revision)')&&sel.includes('FOREIGN KEY(org_id,evidence_id)')&&sel.includes('FOREIGN KEY(org_id,num,link_version)')],
['review cannot self approve',write.includes('created_by<>u')&&write.includes("status='unverified'")],
['evidence source and amount required',table.includes('source_ref text NOT NULL')&&table.includes('amount numeric NOT NULL')&&table.includes('area numeric NOT NULL')],
['filters do not mix unlike evidence',search.includes('ps.kind=p_kind')&&search.includes('ps.area_basis=p_area_basis')&&search.includes('ps.category=subject_category')],
['effective date and subject exclusion',search.includes('ps.observed_on<=p_as_of')&&search.includes('ps.property_id IS DISTINCT FROM p_property_id')],
['verified-only case snapshots',sel.includes("e.status<>'verified'")&&sel.includes("to_jsonb(e)-'location'")],
['version concurrency',sel.includes('FOR UPDATE')&&sel.includes('l.link_version IS DISTINCT FROM p_link_version')],
['no legacy writes or destructive operations',!/DROP TABLE|TRUNCATE|UPDATE public\.(cases|forms|vp_report_versions|vp_property_master)\b/i.test(sql)],
['navigation and authorization',r('src/components/app-shell.tsx').includes('to: "/market-intelligence"')&&r('src/lib/vp-p10-permissions.ts').includes("path: '/market-intelligence', anyOf: ['cases.View']")&&r('src/routeTree.gen.ts').includes('MarketIntelligenceRoute: MarketIntelligenceRoute')],
['case integration pinned to revision',r('src/components/properties/vp-case-property.tsx').includes('revision={current.property_revision}')],
['all upstream converter test scenarios preserved',r('sql/p17/07_CONVERTER_TESTS_READONLY.sql').includes('Both error handling tests passed')&&r('third_party/open-comps/test_convert_measure.original.sql').includes('SELECT plan(12)')]
];for(const [n,ok] of checks)console.log(`${ok?'PASS':'FAIL'} ${n}`);assert.equal(checks.filter(x=>!x[1]).length,0);console.log(`${checks.length}/${checks.length} static checks passed; not database execution`);
