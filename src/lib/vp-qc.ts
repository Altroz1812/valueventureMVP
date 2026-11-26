import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';

export const QC_STAGES = ['Initiation QC', 'Field QC', 'Final QC'] as const;
export type QcStage = (typeof QC_STAGES)[number];
export type QcStatus = 'Pending' | 'Approved' | 'Returned';
export type QcDecision = 'Approved' | 'Returned';

export const QC_CHECKLIST = {
  'Initiation QC': ['Land extent matches title documents'],
  'Field QC': [
    'Four boundaries verified on site',
    'Minimum 8 registered photos attached',
    'GPS check-in and check-out recorded',
  ],
  'Final QC': [
    'Guideline (SRO) rate vs market rate justified',
    'Comparable sales evidence (min. 2)',
    'Building age & depreciation applied',
    'IBBI registration valid for signing valuer',
  ],
} as const;
export const QC_DEFECTS = [
  'Measurement mismatch', 'Insufficient photos', 'Boundary discrepancy',
  'Rate not justified', 'Document missing', 'GPS evidence missing or invalid',
] as const;

export interface VpQcTask {
  id: string;
  org_id: string;
  num: number;
  review_stage: QcStage;
  status: QcStatus;
  assigned_checker_id: string | null;
  submitted_by: string | null;
  submitted_at: string;
  decided_by: string | null;
  decided_at: string | null;
  checklist: Record<string, boolean>;
  defect: string | null;
  remarks: string | null;
}
export interface VpQcChecker { id: string; name: string; role: string }
export interface VpQcEvent {
  id: string; task_id: string;
  event_type: 'Submitted' | 'Assigned' | 'Unassigned' | 'Approved' | 'Returned';
  actor_user_id: string | null; remarks: string | null; occurred_at: string;
}

export function requiredChecks(stage: QcStage, propertyType: string): string[] {
  const all = [...QC_CHECKLIST[stage]];
  return stage === 'Final QC' && propertyType === 'Land'
    ? all.filter((x) => x !== 'Building age & depreciation applied') : all;
}

export function useVpQcTasks() {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-qc-tasks', tenant.id],
    queryFn: async (): Promise<VpQcTask[]> => {
      const { data, error } = await vpDb.rpc('vp_qc_list_tasks');
      if (error) throw error;
      return (data ?? []) as VpQcTask[];
    }, staleTime: 5_000,
  });
}

export function useVpQcPermissions() {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-qc-permissions', tenant.id, tenant.role],
    queryFn: async () => {
      const actions = ['View','Edit','Approve','Return'] as const;
      const results = await Promise.all(actions.map(async (action) => {
        const { data, error } = await vpDb.rpc('vp_qc_can', { p_action: action });
        if (error) throw error;
        return Boolean(data);
      }));
      const { data: editCase, error: editError } = await vpDb.rpc('vp_can_case_action', { p_action:'Edit' });
      if (editError) throw editError;
      return { view: results[0], edit: results[1], approve: results[2],
        returnCase: results[3], submit: Boolean(editCase) || results[1] };
    }, staleTime: 15_000,
  });
}

export function useVpQcEligibleCheckers(enabled: boolean) {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-qc-eligible-checkers', tenant.id], enabled,
    queryFn: async (): Promise<VpQcChecker[]> => {
      const { data, error } = await vpDb.rpc('vp_qc_eligible_checkers');
      if (error) throw error;
      return (data ?? []) as VpQcChecker[];
    }, staleTime: 15_000,
  });
}

export function useVpQcEvents() {
  const { tenant } = useApp();
  return useQuery({
    queryKey: ['vp-qc-events', tenant.id],
    queryFn: async (): Promise<VpQcEvent[]> => {
      const { data, error } = await vpDb.from('vp_qc_events')
        .select('id,task_id,event_type,actor_user_id,remarks,occurred_at')
        .eq('org_id', tenant.id).order('occurred_at', { ascending:false }).limit(500);
      if (error) throw error;
      return (data ?? []).map((x: any) => ({ ...x, id: String(x.id), task_id: String(x.task_id),
        actor_user_id: x.actor_user_id === null ? null : String(x.actor_user_id) })) as VpQcEvent[];
    }, staleTime: 5_000,
  });
}
