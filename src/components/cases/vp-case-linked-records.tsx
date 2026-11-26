import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { mayOpenPath } from '@/lib/vp-p10-permissions';

type VisitRow = {
  id: string | number;
  assigned_user_id: string | number;
  scheduled_at: string;
  status: string;
  checkin_at: string | null;
  checkout_at: string | null;
  checkin_verified: boolean | null;
  checkout_verified: boolean | null;
};
type QcRow = {
  id: string;
  num: number;
  review_stage: string;
  status: string;
  assigned_checker_id: string | null;
  decided_at: string | null;
  decided_by: string | null;
  defect: string | null;
  remarks: string | null;
};
type EventRow = {
  id: number | string;
  task_id: number | string;
  event_type: string;
  actor_user_id: number | string | null;
  remarks: string | null;
  occurred_at: string;
};

type DataResult = {
  bank: { name: string; alias: string | null; kind: string } | null;
  visits: VisitRow[];
  qc: QcRow[];
  events: EventRow[];
  bankError: string | null;
  visitError: string | null;
  qcError: string | null;
  eventError: string | null;
};

function displayDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

/** Read-only dossier links. Every request is org-scoped and still subject to server RLS/RPC permissions. */
export function VpCaseLinkedRecords({ caseNum, bankName }: { caseNum: number; bankName: string }) {
  const { tenant, tenantUsers, capabilities } = useApp();
  const queryClient = useQueryClient();
  const query = useQuery<DataResult>({
    queryKey: ['vp-case-linked-records', tenant.id, caseNum, bankName],
    enabled: Number.isInteger(caseNum) && caseNum > 0,
    queryFn: async () => {
      const [bankResult, visitResult, qcResult] = await Promise.all([
        vpDb.from('banks').select('name,alias,kind').eq('org_id', tenant.id).eq('name', bankName).maybeSingle(),
        vpDb.from('vp_site_visits')
          .select('id,assigned_user_id,scheduled_at,status,checkin_at,checkout_at,checkin_verified,checkout_verified')
          .eq('org_id', tenant.id).eq('num', caseNum).order('scheduled_at', { ascending: false }),
        vpDb.rpc('vp_qc_list_tasks'),
      ]);
      const qcRows = qcResult.error ? [] : ((qcResult.data ?? []) as QcRow[])
        .filter(task => Number(task.num) === caseNum);
      const taskIds = qcRows.map(task => String(task.id));
      const eventResult = taskIds.length > 0
        ? await vpDb.from('vp_qc_events')
            .select('id,task_id,event_type,actor_user_id,remarks,occurred_at')
            .eq('org_id', tenant.id).in('task_id', taskIds)
            .order('occurred_at', { ascending: false }).limit(100)
        : null;
      return {
        bank: bankResult.error ? null : (bankResult.data as DataResult['bank']),
        visits: visitResult.error ? [] : (visitResult.data ?? []) as VisitRow[],
        qc: qcRows,
        events: eventResult?.error ? [] : (eventResult?.data ?? []) as EventRow[],
        bankError: bankResult.error?.message ?? null,
        visitError: visitResult.error?.message ?? null,
        qcError: qcResult.error?.message ?? null,
        eventError: eventResult?.error?.message ?? null,
      };
    },
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });
  const nameFor = (id: string | number | null | undefined) =>
    tenantUsers.find(u => u.id === String(id))?.name ?? (id == null ? 'Unassigned' : `User #${id}`);
  const bank = query.data?.bank;
  const visits = query.data?.visits ?? [];
  const qc = query.data?.qc ?? [];
  const events = query.data?.events ?? [];
  const hasError = Boolean(query.data?.bankError || query.data?.visitError || query.data?.qcError || query.data?.eventError);
  return <div className="md:col-span-3 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold">Linked case records — live database</h3>
      <Button type="button" variant="outline" size="sm" disabled={query.isFetching}
        onClick={() => void Promise.all([
          query.refetch(),
          queryClient.invalidateQueries({ queryKey: ['vp-qc-tasks', tenant.id] }),
        ])}>
        <RefreshCw className="mr-1 size-3.5" /> Refresh
      </Button>
    </div>
    {query.isPending && <p className="text-xs text-muted-foreground">Loading linked bank, visit and QC records…</p>}
    {query.error && <p className="text-xs text-destructive">Database connection error: {query.error.message}</p>}
    {hasError && <div role="alert" className="rounded border border-destructive/30 p-3 text-xs text-destructive">
      {Object.entries({ bank: query.data?.bankError, visits: query.data?.visitError,
        qc: query.data?.qcError, events: query.data?.eventError })
        .filter(([,error]) => !!error).map(([module,error]) => <div key={module}>{module}: {error}</div>)}
      A permission error is not the same as an empty table.
    </div>}
    <div className="grid gap-3 lg:grid-cols-3">
      <Card><CardHeader><CardTitle className="text-sm">Client / Bank Master</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-xs">
          <p className="font-medium">{bank?.name ?? bankName}</p>
          {bank && <p className="text-muted-foreground">{bank.kind}{bank.alias ? ` · ${bank.alias}` : ''}</p>}
          {!bank && !query.isPending && !query.data?.bankError && <p className="text-amber-700">No matching permitted bank master record.</p>}
          {mayOpenPath("/admin/bank-masters",capabilities)&&<Link to="/admin/bank-masters" className="text-primary underline">Open Bank Masters</Link>}
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-sm">Field Visits ({visits.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-xs">
          {visits.slice(0,4).map(v => <div key={String(v.id)} className="border-b pb-2">
            <div className="flex items-center justify-between gap-1"><span>{displayDate(v.scheduled_at)}</span><Badge variant="outline">{v.status}</Badge></div>
            <p className="text-muted-foreground">Officer: {nameFor(v.assigned_user_id)}</p>{mayOpenPath("/field-inspections/"+v.id,capabilities)&&<Link to="/field-inspections/$visitId" params={{visitId:String(v.id)}} className="inline-block py-1 text-sm text-primary underline">Open inspection</Link>}
            <p className="text-muted-foreground">GPS check-in/out recorded: {v.checkin_at ? 'yes' : 'no'} / {v.checkout_at ? 'yes' : 'no'}</p>
          </div>)}
          {!visits.length && !query.isPending && !query.data?.visitError && <p className="text-muted-foreground">No visits visible for this case.</p>}
          {mayOpenPath("/field-operations",capabilities)&&<Link to="/field-operations" search={{ view: 'visits' }} className="text-primary underline">Open Field Operations</Link>}
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-sm">QC Reviews ({qc.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-xs">
          {qc.slice(0,5).map(t => <div key={t.id} className="border-b pb-2">
            <div className="flex items-center justify-between gap-1"><span>{t.review_stage}</span><Badge variant="outline">{t.status}</Badge></div>
            <p className="text-muted-foreground">Checker: {nameFor(t.assigned_checker_id)}</p>
            {t.decided_at && <p className="text-muted-foreground">Decision: {displayDate(t.decided_at)}</p>}
            {t.remarks && <p>{t.remarks}</p>}
          </div>)}
          {!qc.length && !query.isPending && !query.data?.qcError && <p className="text-muted-foreground">No QC reviews visible. Records may be hidden by permissions.</p>}
          {mayOpenPath("/qc-checking",capabilities)&&<Link to="/qc-checking" className="text-primary underline">Open QC & Checking</Link>}
        </CardContent></Card>
    </div>
    {events.length > 0 && <div className="rounded border p-3 text-xs">
      <p className="mb-2 font-semibold">Recent QC actions</p>
      {events.slice(0,5).map(e => <div key={String(e.id)} className="flex flex-wrap gap-2 border-b py-1">
        <span className="font-medium">{e.event_type}</span><span>{displayDate(e.occurred_at)}</span>
        <span className="text-muted-foreground">{nameFor(e.actor_user_id)}</span>
        {e.remarks && <span>{e.remarks}</span>}
      </div>)}
    </div>}
  </div>;
}
