
import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';

export interface Vp9BranchCount {
  branch_id: string;
  branch_name: string;
  active_cases: number;
}

export interface Vp9RecentCase {
  num: number;
  case_no: string;
  property: string;
  bank: string;
  stage: string;
  days_left: number;
}

export interface Vp9OldestOverdue {
  case_no: string;
  days_overdue: number;
}

export interface Vp9DashboardSnapshot {
  as_of: string;
  timezone: 'Asia/Kolkata';
  branch_filter: string | null;
  active_cases: number;
  overdue_cases: number;
  pending_qc: number;
  field_visits_today: number;
  field_visits_completed_mtd: number;
  reports_due_this_week: number;
  reports_released_mtd: number;
  billing_access: boolean;
  billing_mtd: number | null;
  receipts_mtd: number | null;
  unread_alerts_all_branches: number;
  branch_performance: Vp9BranchCount[];
  recent_cases: Vp9RecentCase[];
  oldest_overdue_case: Vp9OldestOverdue | null;
}

export async function vp9GetDashboard(
  branchId: string | null
): Promise<Vp9DashboardSnapshot> {
  const { data, error } = await vpDb.rpc(
    'vp9_dashboard_snapshot',
    { p_branch_id: branchId }
  );

  if (error) {
    throw new Error(
      error.message || 'Unable to load dashboard'
    );
  }

  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data)
  ) {
    throw new Error(
      'Dashboard summary was not returned by Supabase'
    );
  }

  return data as Vp9DashboardSnapshot;
}

export function useVp9Dashboard() {
  const { tenant, branch, can } = useApp();

  // Permission comes from the P10 role matrix.
  const allowed = can('analytics.View');

  const branchId =
    branch === 'all' ? null : branch;

  return useQuery<Vp9DashboardSnapshot, Error>({
    queryKey: [
      'vp9',
      'dashboard',
      tenant.id,
      branchId,
      allowed,
    ],

    queryFn: () => vp9GetDashboard(branchId),

    // Never request analytics for an unauthorized user.
    enabled: Boolean(tenant.id) && allowed,

    staleTime: 15_000,

    refetchInterval: allowed ? 60_000 : false,

    refetchOnWindowFocus: allowed,

    // Avoid repeated permission-denied requests.
    retry: false,
  });
}
