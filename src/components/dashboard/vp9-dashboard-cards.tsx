import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, CalendarClock, ClipboardCheck, FileText, MapPinned, RefreshCw, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-context';
import { useVp9Dashboard } from '@/lib/vp-dashboard';
import { useVp8Access, vp8GetAudit } from '@/lib/vp-analytics';

const number = (value: number | undefined): string => value === undefined ? '—' : value.toLocaleString('en-IN');
const money = (value: number | null | undefined): string => value == null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

/** Replaces only the five existing dashboard KPI cards. No demo data. */
export function Vp9DashboardCards() {
  const { data, isPending, error, refetch, isFetching } = useVp9Dashboard();
  const missing = error !== null;
  const value = (n: number | undefined) => isPending ? '…' : missing ? '—' : number(n);
  const financeValue = isPending ? '…' : missing ? '—' : !data?.billing_access ? 'Restricted' : money(data.billing_mtd);
  const cards = [
    { label: 'Active Cases', value: value(data?.active_cases), icon: FileText, hint: 'All currently open cases' },
    { label: 'Pending QC', value: value(data?.pending_qc), icon: ClipboardCheck, hint: 'All pending QC rounds' },
    { label: 'Field Visits Today', value: value(data?.field_visits_today), icon: MapPinned, hint: 'Scheduled today, excluding cancelled' },
    { label: 'Reports Due This Week', value: value(data?.reports_due_this_week), icon: CalendarClock, hint: 'Unreleased cases due in 7 days' },
    { label: 'Billing MTD', value: financeValue, icon: Wallet, hint: data?.billing_access === false ? 'Billing View permission required' : 'Linked invoices created this month' },
  ];
  return <>
    {error && <p role="alert" className="mb-3 rounded-md border border-destructive/40 p-3 text-sm text-destructive">
      Dashboard cannot load live figures: {error instanceof Error ? error.message : String(error)}. Nothing has been treated as zero.
    </p>}
    <div className="vp-kpi-grid" aria-label="Live dashboard KPIs">
      {cards.map(k => <Card key={k.label} className="border-border shadow-sm">
        <CardContent className="vp-kpi-content p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">{k.label}</p>
            <span className="rounded-md bg-primary/10 p-1.5 text-primary"><k.icon className="size-4 shrink-0" aria-hidden="true"/></span>
          </div>
          <p className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground break-words" aria-label={`${k.label}: ${k.value}`}>{k.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{k.hint}</p>
        </CardContent>
      </Card>)}
    </div>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <span>Overdue cases: <strong className="text-foreground">{value(data?.overdue_cases)}</strong></span>
        <span>Reports released MTD: <strong className="text-foreground">{value(data?.reports_released_mtd)}</strong></span>
        <span>Visits completed MTD: <strong className="text-foreground">{value(data?.field_visits_completed_mtd)}</strong></span>
        <span>Receipts MTD: <strong className="text-foreground">{isPending ? '…' : missing ? '—' : !data?.billing_access ? 'Restricted' : money(data.receipts_mtd)}</strong></span>
        <span>My unread alerts (all branches): <strong className="text-foreground">{value(data?.unread_alerts_all_branches)}</strong></span>
      </div>
      <div className="flex items-center gap-2">
        {data?.as_of && <span>Updated {new Date(data.as_of).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST</span>}
        <Button size="sm" variant="outline" disabled={isFetching} onClick={() => void refetch()}><RefreshCw className="size-3.5"/>{isFetching ? 'Refreshing…' : 'Refresh'}</Button>
      </div>
    </div>
  </>;
}

/** Uses the same permission-checked RPC as KPI figures, not an unfiltered UI array. */
export function Vp9DashboardBranchPerformance() {
  const { data, error, isPending } = useVp9Dashboard();
  const rows = error ? [] : data?.branch_performance ?? [];
  const max = Math.max(1, ...rows.map(r => Number(r.active_cases)));
  return <Card className="border-border shadow-sm">
    <CardHeader className="pb-2"><CardTitle className="font-display text-base">Branch Performance</CardTitle></CardHeader>
    <CardContent className="space-y-2">
      {isPending && <p className="text-xs text-muted-foreground">Loading authorized branches…</p>}
      {error && <p className="text-xs text-destructive">Branch figures unavailable.</p>}
      {!isPending && !error && rows.length === 0 && <p className="text-xs text-muted-foreground">No permitted branches configured.</p>}
      {rows.map(row => <div key={row.branch_id}>
        <div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium">{row.branch_name}</span><span className="text-muted-foreground">{number(row.active_cases)} active</span></div>
        <div className="h-2 rounded-full bg-muted" aria-hidden="true"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.round(100 * Number(row.active_cases) / max)}%` }}/></div>
      </div>)}
      {rows.length > 0 && <p className="text-xs text-muted-foreground">Unallocated cases are included in tenant-admin totals but not attributed to a branch.</p>}
    </CardContent>
  </Card>;
}

/** Phase 8 cross-module audit feed replaces the older case-log-only activity card. */
export function Vp9DashboardActivity() {
  const { tenant } = useApp();
  const access = useVp8Access();
  const allowed = access.data?.audit === true;
  const audit = useQuery({
    queryKey: ['vp9', tenant.id, 'recent-cross-module-activity'],
    queryFn: () => vp8GetAudit(5, 0), enabled: allowed,
    staleTime: 15_000, refetchInterval: 60_000, retry: false,
  });
  return <Card className="border-border shadow-sm">
    <CardHeader className="pb-2"><CardTitle className="font-display text-base">Recent Activity</CardTitle></CardHeader>
    <CardContent className="space-y-2">
      {access.isPending && <p className="text-xs text-muted-foreground">Checking access…</p>}
      {access.error && <p className="text-xs text-destructive">Unable to check audit permissions.</p>}
      {!access.isPending && !access.error && !allowed && <p className="text-xs text-muted-foreground">Analytics → Audit permission required to view cross-module activity.</p>}
      {allowed && audit.isPending && <p className="text-xs text-muted-foreground">Loading activity…</p>}
      {allowed && audit.error && <p className="text-xs text-destructive">Unable to load audit events.</p>}
      {allowed && (audit.data ?? []).map(a => <div key={a.source_key} className="flex gap-3 text-xs">
        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
        <div><p className="text-foreground">{a.category}: {a.description}</p><p className="text-muted-foreground">{a.actor || 'System'} · {a.event_time ? new Date(a.event_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Date unavailable'}</p></div>
      </div>)}
      {allowed && !audit.isPending && !audit.error && (audit.data ?? []).length === 0 && <p className="text-xs text-muted-foreground">No recent activity.</p>}
      {allowed && <p className="text-xs text-muted-foreground"><AlertTriangle className="mr-1 inline size-3" />Case log dates may have day-only precision.</p>}
    </CardContent>
  </Card>;
}

/** Same authorized snapshot as KPI cards, so branch selection cannot leak recent cases. */
export function Vp9DashboardRecentCases() {
  const { data, error, isPending } = useVp9Dashboard();
  const rows = error ? [] : data?.recent_cases ?? [];
  const {can}=useApp();
  return <Card className="border-border shadow-sm vp-recent-cases">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="font-display text-base">Recent Cases</CardTitle>
      {can("cases.View")&&<Link to="/cases" className="text-sm text-primary underline">View all cases</Link>}
    </CardHeader>
    <CardContent>
      <Table aria-label="Recent cases">
        <TableHeader><TableRow>
          <TableHead>Case No.</TableHead><TableHead className="table-cell">Property</TableHead>
          <TableHead>Bank</TableHead><TableHead className="table-cell">Stage</TableHead>
          <TableHead className="text-right">TAT</TableHead>
        </TableRow></TableHeader>
        <TableBody>{rows.map(c => <TableRow key={c.num}>
          <TableCell className="font-mono text-sm font-medium">{can("cases.View")?<Link to="/cases/$caseId" params={{caseId:String(c.num)}} className="text-primary underline">{c.case_no}</Link>:c.case_no}</TableCell>
          <TableCell className="max-w-[220px] whitespace-normal break-words" title={c.property}>{c.property}</TableCell>
          <TableCell className="text-sm">{c.bank}</TableCell>
          <TableCell className="table-cell"><Badge variant="outline" className="border-transparent text-xs">{c.stage}</Badge></TableCell>
          <TableCell className={`text-right text-xs font-semibold ${c.days_left <= 1 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {['Delivered','Approved'].includes(c.stage) ? '—' : `${c.days_left}d`}
          </TableCell>
        </TableRow>)}</TableBody>
      </Table>
      {isPending && <p className="py-5 text-center text-xs text-muted-foreground">Loading recent cases…</p>}
      {error && <p className="py-5 text-center text-xs text-destructive">Case list unavailable.</p>}
      {!isPending && !error && rows.length === 0 && <p className="py-5 text-center text-xs text-muted-foreground">No cases in your permitted branches.</p>}
    </CardContent>
  </Card>;
}

export function Vp9DashboardOverdueBanner() {
  const { data,error } = useVp9Dashboard();
  if (error || !data || data.overdue_cases <= 0) return null;
  const oldest = data.oldest_overdue_case;
  return <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
    <AlertTriangle className="size-4 shrink-0 text-destructive" />
    <p className="text-sm text-foreground">
      <span className="font-semibold">{number(data.overdue_cases)} overdue case{data.overdue_cases === 1 ? '' : 's'}</span>
      {oldest ? ` — oldest is ${oldest.case_no} (${oldest.days_overdue} day${oldest.days_overdue === 1 ? '' : 's'} overdue)` : ''}.
    </p>
  </div>;
}

/** Existing authorized snapshot. Counts have different units and windows, so no stacked pipeline or trend is implied. */
export function VpWorkloadGraphic(){
  const {data,isPending,error}=useVp9Dashboard();
  const values=[{label:'Overdue cases',value:data?.overdue_cases,description:'Open cases past due'},{label:'Pending QC rounds',value:data?.pending_qc,description:'Awaiting a QC decision'},{label:'Scheduled visits today',value:data?.field_visits_today,description:'Excludes cancelled visits'},{label:'Reports due in 7 days',value:data?.reports_due_this_week,description:'Unreleased cases'}];
  const valid=values.every(r=>typeof r.value==='number'&&Number.isFinite(r.value)&&r.value>=0);
  const max=Math.max(1,...values.map(r=>typeof r.value==='number'&&Number.isFinite(r.value)?r.value:0));
  return <Card><CardHeader><CardTitle className="text-base">Work requiring attention</CardTitle><p className="text-sm text-muted-foreground">Current authorized snapshot · Independent counts, not a pipeline total</p></CardHeader><CardContent className="space-y-2" aria-busy={isPending}>{isPending?<p role="status">Loading workload…</p>:error||!valid?<p role="alert" className="text-sm text-destructive">Workload counts unavailable.</p>:<ul className="space-y-2">{values.map(r=><li key={r.label}><div className="mb-1 flex flex-wrap items-baseline justify-between gap-2"><span className="text-sm font-medium">{r.label}</span><strong className="tabular-nums">{number(r.value)}</strong></div><div className="vp-graphic-track" aria-hidden="true"><div className="vp-graphic-fill" style={{width:`${100*(r.value??0)/max}%`}}/></div><p className="mt-1 text-xs text-muted-foreground">{r.description}</p></li>)}</ul>}</CardContent></Card>;
}
