import { VoiceMic, VoiceOption, VoiceLanguage, type VoiceLang } from '@/components/voice/vp-voice';
import { VpInspectionQcSummary } from '@/components/field/vp-inspection-qc-summary';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, PageHeader } from '@/components/app-shell';
import { EmptyRow, PriorityBadge, StatCard, TatBadge } from '@/components/ops-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/lib/app-context';
import { fmtINR } from '@/lib/data';
import { useVpCases } from '@/lib/vp-cases';
import { vpDb } from '@/lib/vp-db';
import { QC_DEFECTS, QC_STAGES, requiredChecks,
  useVpQcEligibleCheckers, useVpQcEvents, useVpQcPermissions, useVpQcTasks,
  type VpQcTask } from '@/lib/vp-qc';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/qc-checking')({
  head: () => ({ meta: [
    { title: 'ValuationPro — QC & Checking' },
    { name: 'description', content: 'Authenticated QC queue, checker assignment, review and rework.' },
  ] }),
  component: QcPage,
});

function QcPage() {
  const { tenant, branch } = useApp();
  const client = useQueryClient();
  const casesQuery = useVpCases();
  const tasksQuery = useVpQcTasks();
  const permsQuery = useVpQcPermissions();
  const eventsQuery = useVpQcEvents();
  const perms = permsQuery.data;
  const eligibleQuery = useVpQcEligibleCheckers(Boolean(perms?.edit));
  const eligible = eligibleQuery.data ?? [];
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [defect, setDefect] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [voiceLang,setVoiceLang]=useState<VoiceLang>('en-IN');
  const [submitCaseId, setSubmitCaseId] = useState('');

  const casesByNum = useMemo(() => new Map(casesQuery.allCases.map((c) => [c.caseNum, c])),
    [casesQuery.allCases]);
  const tasks = tasksQuery.data ?? [];
  const queue = useMemo(() => tasks.filter((t) => {
    const c = casesByNum.get(t.num);
    return t.status === 'Pending' && c && (branch === 'all' || c.branchId === branch);
  }), [tasks, casesByNum, branch]);
  const selTask: VpQcTask | undefined = queue.find((t) => t.id === selectedTaskId) ?? queue[0];
  const sel = selTask ? casesByNum.get(selTask.num) : undefined;
  const required = selTask && sel ? requiredChecks(selTask.review_stage, sel.propertyType) : [];
  const done = required.filter((x) => checks[x]).length;
  const currentId = useSelfUserId(tenant.id);
  const canCurrentDecide = Boolean(selTask && currentId.data && selTask.assigned_checker_id === currentId.data);
  const today = new Date().toLocaleDateString('en-CA');
  const returnedToday = tasks.filter((t) => t.status === 'Returned' && t.decided_at &&
    new Date(t.decided_at).toLocaleDateString('en-CA') === today).length;
  const submitCandidates = casesQuery.cases.filter((c) =>
    c.stage === 'Initiation' || c.stage === 'Report Draft');
  const selectedSubmit = submitCandidates.find((c) => c.id === submitCaseId);
  const pendingError = casesQuery.error ?? tasksQuery.error ?? permsQuery.error;

  useEffect(() => { setChecks({}); setDefect(''); setNote(''); }, [selTask?.id]);
  async function refresh() {
    await Promise.all([
      client.invalidateQueries({ queryKey: ['vp-qc-tasks', tenant.id] }),
      client.invalidateQueries({ queryKey: ['vp-qc-events', tenant.id] }),
      client.invalidateQueries({ queryKey: ['vp-live-cases', tenant.id] }),
    ]);
  }
  async function decide(decision: 'Approved' | 'Returned') {
    if (!selTask) return;
    if (!canCurrentDecide) { toast.error('Only the assigned checker can decide'); return; }
    if (decision === 'Approved' && done !== required.length) {
      toast.error(`Complete all ${required.length} applicable checklist items`); return;
    }
    if (decision === 'Returned' && (!defect || note.trim().length < 5)) {
      toast.error('Choose a defect and enter at least 5 characters of remarks'); return;
    }
    setBusy(true);
    try {
      const { error } = await vpDb.rpc('vp_qc_decide', {
        p_task_id: selTask.id, p_decision: decision,
        p_checklist: checks, p_defect: decision === 'Returned' ? defect : null,
        p_remarks: note.trim() || null,
      });
      if (error) throw error;
      await refresh();
      toast.success(`${sel?.caseNo ?? 'Case'} ${decision === 'Approved' ? 'approved and advanced' : 'returned for correction'}`);
      setSelectedTaskId(null); setChecks({}); setDefect(''); setNote('');
    } catch (e) { toast.error(err(e)); }
    finally { setBusy(false); }
  }
  async function assign(checkerId: string) {
    if (!selTask || !perms?.edit) return;
    setBusy(true);
    try {
      const { error } = await vpDb.rpc('vp_qc_assign', {
        p_task_id: selTask.id,
        p_checker_user_id: checkerId === 'unassigned' ? null : checkerId,
      });
      if (error) throw error;
      await refresh();
      toast.success(checkerId === 'unassigned' ? 'Checker unassigned' : 'Checker assigned');
    } catch (e) { toast.error(err(e)); }
    finally { setBusy(false); }
  }
  async function submit() {
    if (!selectedSubmit || !perms?.submit) return;
    const stage = selectedSubmit.stage === 'Initiation' ? 'Initiation QC' : 'Final QC';
    setBusy(true);
    try {
      const { error } = await vpDb.rpc('vp_qc_submit', {
        p_case_num: selectedSubmit.caseNum, p_review_stage: stage,
      });
      if (error) throw error;
      setSubmitCaseId('');
      await refresh();
      toast.success(`${selectedSubmit.caseNo} submitted for ${stage}`);
    } catch (e) { toast.error(err(e)); }
    finally { setBusy(false); }
  }
  const caseTaskHistory = tasks.filter((t) => sel && t.num === sel.caseNum && t.status !== 'Pending');
  const taskEvents = eventsQuery.data?.filter((e) => selTask && e.task_id === selTask.id) ?? [];

  return (
    <AppShell>
      <PageHeader title="QC & Checking" description="Review cases waiting in Initiation, Field and Final QC. Approve to move forward or return with a defect." />
      <div className="mb-3"><VoiceLanguage value={voiceLang} onChange={setVoiceLang}/></div>
      {(pendingError || eventsQuery.error || eligibleQuery.error) &&
        <p className="mb-4 text-sm text-destructive">Database error: {err(pendingError ?? eventsQuery.error ?? eligibleQuery.error)}</p>}
      {perms?.submit && submitCandidates.length > 0 && (
        <div className="mb-4 flex flex-wrap items-end gap-2 rounded-md border p-3">
          <div className="min-w-60 flex-1 space-y-1">
            <Label>Send case to QC</Label>
            <Select value={submitCaseId} onValueChange={setSubmitCaseId}>
              <SelectTrigger><SelectValue placeholder="Select case ready for QC" /></SelectTrigger>
              <SelectContent>{submitCandidates.map((c) =>
                <SelectItem key={c.id} value={c.id}>{c.caseNo} · {c.stage}</SelectItem>)}</SelectContent>
            </Select><VoiceOption label="Send case to QC" lang={voiceLang} options={submitCandidates.map(c=>c.caseNo)} onSelect={name=>{const chosen=submitCandidates.find(c=>c.caseNo===name);if(chosen)setSubmitCaseId(chosen.id);}}/>
          </div>
          <Button onClick={() => void submit()} disabled={!selectedSubmit || busy}>Submit for QC</Button>
          <span className="w-full text-xs text-muted-foreground">Final QC requires a submitted valuation form; this is configured in Phase 5.</span>
        </div>
      )}
      {perms?.edit && !eligibleQuery.isLoading && eligible.length === 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-warning/40 bg-warning/5 p-3">
          <div><p className="text-sm font-medium">No eligible QC checker is available</p>
            <p className="text-xs text-muted-foreground">Check Users & Permissions: the user must be linked to Auth, email verified, active, and have qc.Approve + qc.Return (or tenant.admin).</p></div>
          <Link to="/admin/users"><Button variant="outline" size="sm">Manage users & QC readiness</Button></Link>
        </div>
      )}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {QC_STAGES.map((stage) =>
          <StatCard key={stage} label={stage} value={queue.filter((t) => t.review_stage === stage).length} />)}
        <StatCard label="Returned today" value={returnedToday} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base">Checker queue ({queue.length})</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 p-2">
            {(casesQuery.isLoading || tasksQuery.isLoading || permsQuery.isLoading) &&
              <p className="p-3 text-sm text-muted-foreground">Loading QC queue…</p>}
            {!tasksQuery.isLoading && queue.length === 0 && <EmptyRow text="No pending QC tasks. Submit an eligible case to QC first." />}
            {queue.map((t) => {
              const c = casesByNum.get(t.num)!;
              return <button key={t.id} onClick={() => setSelectedTaskId(t.id)}
                className={cn('w-full rounded-md border px-3 py-2 text-left transition-colors',
                  selTask?.id === t.id ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted')}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{c.caseNo}</span>
                  <Badge variant="outline" className="text-[10px]">{t.review_stage}</Badge>
                </div>
                <div className="mt-0.5 truncate text-sm font-medium">{c.property}</div>
                <div className="mt-1 flex gap-1.5"><PriorityBadge p={c.priority} /><TatBadge c={c} /></div>
              </button>;
            })}
          </CardContent>
        </Card>
        {sel && selTask ? (
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{sel.property}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {sel.caseNo} · {sel.bank} · {sel.propertyType} · {sel.feeKnown ? fmtINR(sel.fee) : 'Fee not configured'} · by {sel.assignedTo}
                  </p>
                </div>
                <Badge className="gap-1"><ShieldCheck className="size-3.5" />{selTask.review_stage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {selTask.review_stage==='Field QC' && <VpInspectionQcSummary caseNum={sel.caseNum} propertyType={sel.propertyType}/>}
              <div className="space-y-2">
                <Label>Assigned checker</Label>
                {perms?.edit ? (
                  <><Select value={selTask.assigned_checker_id ?? 'unassigned'}
                    onValueChange={(value) => void assign(value)} disabled={busy}>
                    <SelectTrigger><SelectValue placeholder="Choose checker" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {selTask.assigned_checker_id && !eligible.some((u) => u.id === selTask.assigned_checker_id) && (
                        <SelectItem value={selTask.assigned_checker_id}>Previous checker (now ineligible)</SelectItem>)}
                      {eligible.map((u) =>
                        <SelectItem key={u.id} value={u.id}>{u.name} · {u.role}</SelectItem>)}
                    </SelectContent>
                  </Select><VoiceOption label="Assigned checker" lang={voiceLang} options={eligible.map(u=>u.name)} disabled={busy} onSelect={name=>{const chosen=eligible.find(u=>u.name===name);if(chosen)void assign(chosen.id);}}/></>
                ) : <p className="text-sm text-muted-foreground">{selTask.assigned_checker_id
                  ? eligible.find((x) => x.id === selTask.assigned_checker_id)?.name ?? 'Assigned checker'
                  : 'Awaiting checker assignment'}</p>}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  QC checklist <span className="text-muted-foreground">{done}/{required.length}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {required.map((item) =>
                    <div key={item} className="flex items-start gap-2 rounded-md border border-border p-2.5 text-sm">
                      <Checkbox checked={!!checks[item]} onCheckedChange={(value) =>
                        setChecks((old) => ({...old, [item]: !!value}))} disabled={!canCurrentDecide || busy} className="mt-0.5" />
                      <span className="min-w-0 flex-1">{item}</span>
                      <VoiceOption label={item} lang={voiceLang} options={['Yes','No']} disabled={!canCurrentDecide||busy} onSelect={value=>setChecks(old=>({...old,[item]:value==='Yes'}))}/>
                    </div>)}
                </div>
                {selTask.review_stage === 'Field QC' &&
                  <p className="mt-2 text-xs text-muted-foreground">Field QC approval requires a completed visit, the configured photo minimum (at least eight registered photos), and recorded GPS check-in and check-out with reported accuracy. No geofence is enforced; GPS and photo geotags are not independently verified.</p>}
                {selTask.review_stage === 'Final QC' &&
                  <p className="mt-2 text-xs text-muted-foreground">Checklist confirmation is a checker attestation, not an IBBI registration verification or an authorized valuation certificate/signature.</p>}
              </div>
              <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
                <div><Label>Defect category (for returns)</Label>
                  <Select value={defect} onValueChange={setDefect} disabled={!canCurrentDecide || busy}>
                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>{QC_DEFECTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select><VoiceOption label="Defect category" options={QC_DEFECTS} lang={voiceLang} disabled={!canCurrentDecide||busy} onSelect={setDefect}/>
                </div>
                <div><Label>Checker remarks</Label>
                  <div className="flex gap-2"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                    disabled={!canCurrentDecide || busy} placeholder="Notes for the field officer or back office" /><VoiceMic label="Checker remarks" lang={voiceLang} disabled={!canCurrentDecide||busy} onTranscript={spoken=>setNote(old=>old?`${old} ${spoken}`:spoken)}/></div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" disabled={!canCurrentDecide || !perms?.returnCase || busy}
                  onClick={() => void decide('Returned')}><RotateCcw className="size-4" /> Return for correction</Button>
                <Button disabled={!canCurrentDecide || !perms?.approve || busy}
                  onClick={() => void decide('Approved')}><CheckCircle2 className="size-4" /> Approve & advance</Button>
              </div>
              {(caseTaskHistory.length > 0 || taskEvents.length > 0) && (
                <div className="border-t border-border pt-3 text-sm">
                  <p className="mb-2 font-medium">QC review history</p>
                  {taskEvents.slice(0, 8).map((event) =>
                    <p key={event.id} className="text-muted-foreground">
                      <b className="text-foreground">{event.event_type}:</b> {new Date(event.occurred_at).toLocaleString('en-IN')} {event.remarks ?? ''}
                    </p>)}
                  {caseTaskHistory.slice(0, 6).map((task) =>
                    <p key={task.id} className="text-muted-foreground">
                      <b className="text-foreground">{task.review_stage} {task.status}:</b> {task.defect ?? task.remarks ?? 'Decision recorded'}
                    </p>)}
                </div>
              )}
            </CardContent>
          </Card>
        ) : <Card className="border-border"><EmptyRow text="Nothing to review in this branch." /></Card>}
      </div>
    </AppShell>
  );
}

function err(e: unknown): string { return e instanceof Error ? e.message : String(e); }

// Only a trusted session-derived user ID decides whether the action buttons are enabled.
function useSelfUserId(orgId: string) {
  const { data, isLoading, error } = useSelfUserIdQuery(orgId);
  return { data, isLoading, error };
}
function useSelfUserIdQuery(orgId: string) {
  return useQuery({
    queryKey: ['vp-qc-self', orgId],
    queryFn: async () => {
      const { data, error } = await vpDb.rpc('vp_field_my_user_id');
      if (error) throw error;
      return data === null ? null : String(data);
    }, staleTime: 30_000,
  });
}
