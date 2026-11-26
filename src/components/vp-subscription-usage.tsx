import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { mayShowSubscription, parseSubscription, parseGrowthMode, type UsageMetric } from '@/lib/vp-subscription';

function Metric({label, metric}: {label:string; metric:UsageMetric}) {
  return <div className="min-w-0 space-y-2">
    <div className="flex items-center justify-between gap-2 text-xs"><span className="font-medium">{label}</span><span className="tabular-nums">{metric.used.toLocaleString('en-IN')}{metric.limit !== null ? ` / ${metric.limit.toLocaleString('en-IN')}` : ''}</span></div>
    {metric.percent !== null ? <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(metric.percent)}><div className={metric.overLimit ? 'h-full rounded-full bg-amber-500' : 'h-full rounded-full bg-primary'} style={{width: `${metric.percent}%`}} /></div> : <p className="text-[11px] text-muted-foreground">No configured limit</p>}
    {metric.overLimit && <p className="text-xs font-medium text-amber-700">Configured limit exceeded</p>}
  </div>;
}
function SubscriptionDetails({orgId}: {orgId:string}) {
  const query = useQuery({
    queryKey: ['vp-saas-subscription', orgId], staleTime: 30_000, gcTime: 0, retry: false, refetchOnWindowFocus: true,
    queryFn: async () => { const [summary, mode] = await Promise.all([vpDb.rpc('vp_saas_my_subscription'), vpDb.rpc('vp_saas_my_growth_mode')]); if (summary.error) throw summary.error; if (mode.error) throw mode.error; return {...parseSubscription(summary.data, orgId), growthMode: parseGrowthMode(mode.data, orgId)}; },
  });
  return <details className="mb-3 rounded-lg border bg-card">
    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Subscription &amp; Usage{!query.isError && query.data && <span className="ml-2 text-xs font-normal text-muted-foreground">{query.data.name}</span>}</summary>
    <div className="border-t px-4 py-3">
      {query.isPending ? <p className="text-xs text-muted-foreground">Loading subscription...</p> : query.isError ? <div className="flex items-center justify-between gap-2"><p className="text-xs text-muted-foreground">Subscription details unavailable.</p><button type="button" className="text-xs underline" onClick={() => void query.refetch()}>Retry</button></div> : query.data ? <>
        <div className="mb-4 flex flex-wrap items-center gap-2"><span className="rounded bg-muted px-2 py-1 text-xs">{query.data.name}</span><span className="text-xs capitalize text-muted-foreground">{query.data.status === 'unassigned' ? 'No commercial contract assigned' : query.data.status}</span>{query.data.endsOn && <span className="text-xs text-muted-foreground">Valid until (exclusive): {query.data.endsOn}</span>}<button type="button" className="ml-auto rounded border p-2" aria-label="Refresh subscription usage" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw className="size-3.5" aria-hidden="true" /></button></div>
        <div className="grid gap-4 sm:grid-cols-3"><Metric label="Active users" metric={query.data.users}/><Metric label="Active branches" metric={query.data.branches}/><Metric label="Monthly cases" metric={query.data.cases}/></div>
        <p className="mt-4 text-[11px] text-muted-foreground">{query.data.growthMode === 'growth' ? 'Growth controls enabled. New active users, branches and cases are subject to subscription capacity and validity. Existing workflows remain available under role permissions.' : 'Monitoring mode. Subscription limits do not currently restrict operational access.'}</p>
      </> : null}
    </div>
  </details>;
}
// Resolve authorization and routing inside this component, not in AppShell.
export function VpSubscriptionUsage() {
  const {tenant, capabilities} = useApp();
  const pathname = useRouterState({select: state => state.location.pathname});
  if (!mayShowSubscription(pathname, capabilities)) return null;
  return <SubscriptionDetails key={tenant.id} orgId={tenant.id}/>;
}
