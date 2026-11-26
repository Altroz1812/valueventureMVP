import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { AppShell, PageHeader } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { classifyReadRpcProbe, type RpcProbeResult } from '@/lib/vp-p5-rpc-diagnostics';

type Check = { module: string; table: string; count: number | null; error: string | null; link: string };
type P2ReadProbe = { name: string; diagnosis: RpcProbeResult };

export const Route = createFileRoute('/admin/data-integrity')({
  component: DataIntegrityPage,
});

/** Uses the signed-in browser session: detects RLS errors that SQL Editor cannot show. */
function DataIntegrityPage() {
  const { tenant, tenantUsers, tenantBranches } = useApp();
  const authorized = Boolean(tenant.adminAccess);
  const test = useQuery({
    queryKey: ['vp-live-data-integrity', tenant.id],
    enabled: authorized,
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Check[]> => {
      const definitions = [
        { module: 'Existing Users', table: 'users (vp_list_users RPC)', link: '/admin/users', run: () => vpDb.rpc('vp_list_users') },
        { module: 'Bank / NBFC Clients', table: 'banks', link: '/admin/bank-masters', run: () => vpDb.from('banks').select('name', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'Bank Rate Cards', table: 'vp_bank_rate_cards', link: '/admin/bank-masters', run: () => vpDb.from('vp_bank_rate_cards').select('bank_name', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'Property Types', table: 'vp_property_types', link: '/admin/bank-masters', run: () => vpDb.from('vp_property_types').select('code', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'Branches', table: 'vp_branches', link: '/admin/branches', run: () => vpDb.from('vp_branches').select('id', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'Cases', table: 'cases', link: '/cases', run: () => vpDb.from('cases').select('num', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'QC Tasks', table: 'vp_qc_list_tasks RPC', link: '/qc-checking', run: () => vpDb.rpc('vp_qc_list_tasks') },
        { module: 'Site Visits', table: 'vp_site_visits', link: '/field-operations', run: () => vpDb.from('vp_site_visits').select('id', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'Released/Draft Reports', table: 'vp_report_versions', link: '/reports', run: () => vpDb.from('vp_report_versions').select('id', { count:'exact', head:true }).eq('org_id',tenant.id) },
        { module: 'Invoices', table: 'invoices', link: '/billing-mis', run: () => vpDb.from('invoices').select('id', { count:'exact', head:true }).eq('org_id',tenant.id) },
      ];
      return Promise.all(definitions.map(async (item): Promise<Check> => {
        try {
          const result = await item.run();
          return { module:item.module,table:item.table,link:item.link,
            count: result.error ? null : Array.isArray(result.data) ? result.data.length : result.count ?? null,
            error: result.error?.message ?? null };
        } catch (error) {
          return { module:item.module,table:item.table,link:item.link,count:null,
            error:error instanceof Error ? error.message : String(error) };
        }
      }));
    },
  });
  // These are read-only functions. Case number 0 is an intentionally absent
  // probe case; "case not found" means the function was reached, not that
  // it can access case data. Never probe the mutation RPC this way.
  const p2Check = useQuery({
    queryKey: ['vp-p2-runtime-readiness', tenant.id],
    enabled: authorized,
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<P2ReadProbe[]> => {
      const checks = [
        {name: 'Submitted inspection / valuation transfer', rpc: 'vp_p2_valuer_inspection_for_case'},
        {name: 'Reviewed transfer audit history', rpc: 'vp_p2_transfer_history'},
      ] as const;
      return Promise.all(checks.map(async ({name, rpc}) => {
        try {
          const result = await vpDb.rpc(rpc, {p_case_num: 0});
          return {name, diagnosis: classifyReadRpcProbe(result.error)};
        } catch (error) {
          return {name, diagnosis: classifyReadRpcProbe(error)};
        }
      }));
    },
  });
  const rows = test.data ?? [];
  const failed = rows.filter(x => x.error).length;
  return <AppShell>
    <PageHeader title="Data Connections" description="Read-only checks from the current user's authenticated session. No tables or records are modified.">
      <Button variant="outline" size="sm" disabled={!authorized || test.isFetching} onClick={() => void test.refetch()}>
        <RefreshCw className="mr-2 size-4" /> Recheck
      </Button>
    </PageHeader>
    {!authorized && <Card><CardContent className="p-4 text-sm">Tenant administration access is required. This page does not bypass RLS.</CardContent></Card>}
    {authorized && <>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Organization</CardTitle></CardHeader><CardContent className="text-sm">{tenant.name} · ID {tenant.id}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Users in App Context</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{tenantUsers.length}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Branches in App Context</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{tenantBranches.length}</CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-sm">P2 backend readiness (read-only probes)</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-xs text-muted-foreground">These checks call only the two P2 read functions with a non-existent case number. They do not save valuations or modify records. "Function reached" does not prove row-level security across tenants. Verify the P2 write RPC using the separate SQL inventory and authorized staging tests.</p>
          <Button variant="outline" size="sm" disabled={p2Check.isFetching} onClick={() => void p2Check.refetch()}>Recheck P2 functions</Button>
          {p2Check.isPending && <p>Checking read-only RPCs…</p>}
          {p2Check.error && <p role="alert" className="text-destructive">{p2Check.error.message}</p>}
          {(p2Check.data ?? []).map(({name, diagnosis}) => <div className="rounded border p-3" key={name}>
            <p className="font-medium">{name}</p>
            <p className={diagnosis.state === 'missing' || diagnosis.state === 'unexpected-error' ? 'text-destructive' : 'text-muted-foreground'}>{diagnosis.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{diagnosis.guidance}</p>
          </div>)}
          <p className="text-xs text-muted-foreground">Also run sql/p5/00_BACKEND_READINESS_READONLY.sql in Supabase SQL Editor. It checks the reviewed-save RPC without executing it.</p>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-sm">Live module queries</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {test.isPending && <p>Testing database reads…</p>}
          {test.error && <p className="text-destructive">Cannot run checks: {test.error.message}</p>}
          {rows.map(r => <div key={r.module} className="flex flex-wrap items-center justify-between gap-2 border-b py-2">
            <div><p className="font-medium">{r.module}</p><p className="text-xs text-muted-foreground">{r.table}</p>
              {r.error && <p className="text-xs text-destructive">{r.error}</p>}</div>
            <div className="flex items-center gap-3"><Badge variant={r.error ? 'destructive' : 'outline'}>
              {r.error ? 'Query failed' : r.count === 0 ? '0 visible' : `${r.count ?? '—'} visible`}</Badge>
              <a href={r.link} className="text-xs text-primary underline">Open</a>
            </div>
          </div>)}
          {rows.length > 0 && <p className="text-xs text-muted-foreground">
            {failed} failed module queries. Zero visible rows may mean no data, filtered data or RLS restrictions; compare with the SQL Editor diagnostic. The bank/client master is public.banks, not the unrelated UUID public.clients schema.
          </p>}
        </CardContent></Card>
    </>}
  </AppShell>;
}
