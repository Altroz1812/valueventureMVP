import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=process.argv[2]??'.';const read=f=>fs.readFileSync(path.join(root,f),'utf8');const sql=read('sql/p16/01_PROPERTY_MASTER_STAGING.sql');const ui=read('src/routes/properties.tsx');const api=read('src/lib/vp-property-master.ts');const caseUI=read('src/components/properties/vp-case-property.tsx');const checks=[
 ['transactional additive migration',/^BEGIN;/m.test(sql)&&/^COMMIT;/m.test(sql)&&!/DROP\s+(TABLE|SCHEMA)|TRUNCATE|ALTER TABLE public\.cases/i.test(sql)],
 ['BIGINT property identity',sql.includes('id bigint GENERATED ALWAYS AS IDENTITY')],
 ['all new tables have RLS', ['vp_property_master','vp_property_revisions','vp_property_case_links'].every(t=>sql.includes(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY`))],
 ['all new tables tenant-scoped reads',(sql.match(/org_id=\(SELECT public\.vp_current_org_id\(\)\)/g)||[]).length===3],
 ['authenticated direct writes revoked',sql.includes('REVOKE ALL ON public.vp_property_master')&&sql.includes('GRANT SELECT ON public.vp_property_master')&&!/GRANT (INSERT|UPDATE|DELETE|ALL)/.test(sql)],
 ['revision FK tenant-bound',sql.includes('FOREIGN KEY(org_id,property_id,property_revision) REFERENCES public.vp_property_revisions(org_id,property_id,revision)')],
 ['case association tenant-bound',sql.includes('FOREIGN KEY(org_id,num) REFERENCES public.cases(org_id,num)')],
 ['version concurrency guards',sql.includes('p_expected_revision IS DISTINCT FROM rev')&&sql.includes('p_expected_link_version IS DISTINCT FROM prev')&&sql.includes('FOR UPDATE')],
 ['RPC permission guard',sql.includes("public.vp_sec_can('cases.View')")&&sql.includes("public.vp_sec_can('cases.Edit')")&&sql.includes('public.vp_sec_case_visible(p_case_num)')],
 ['historical associations append-only',!/UPDATE public\.vp_property_case_links|DELETE FROM public\.vp_property_case_links/.test(sql)&&sql.includes('INSERT INTO public.vp_property_case_links')],
 ['security invoker current view',sql.includes('WITH (security_invoker=true)')],
 ['server-side validation',sql.includes('PERFORM public.vp_p16_validate(p_data)')&&sql.includes('Parcel area must be positive')],
 ['guarded route and navigation',read('src/lib/vp-p10-permissions.ts').includes("path: '/properties', anyOf: ['cases.View']")&&read('src/components/app-shell.tsx').includes('to: "/properties"')&&read('src/routeTree.gen.ts').includes('PropertiesRoute: PropertiesRoute')],
 ['case dossier association and audit',read('src/routes/cases_.$caseId.tsx').includes('<CaseProperty key={c.caseNum}')&&caseUI.includes('Association audit history')],
 ['history respects report capability',ui.includes("can('signoff.View')||can('signoff.Generate')")&&ui.includes(".eq('status','Released')")],
 ['API uses existing supabase client and RPCs',api.includes('vp_p16_save_property')&&api.includes('vp_p16_link_case')&&api.includes('collectPages')],
 ['no automatic updates to case or valuation',!/UPDATE public\.(cases|forms|vp_report_versions|vp_valuation_versions)/.test(sql)]
];for(const [n,ok] of checks)console.log(`${ok?'PASS':'FAIL'} ${n}`);assert.equal(checks.filter(x=>!x[1]).length,0);console.log(`${checks.length}/${checks.length} static checks passed (not live tests)`);
