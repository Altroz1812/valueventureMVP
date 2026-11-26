export type UsageMetric = { used: number; limit: number | null; percent: number | null; overLimit: boolean };
export function usageMetric(used: unknown, limit: unknown): UsageMetric {
  if (typeof used !== 'number' || !Number.isSafeInteger(used) || used < 0) throw new Error('Invalid subscription usage');
  if (limit !== null && (typeof limit !== 'number' || !Number.isSafeInteger(limit) || limit <= 0)) throw new Error('Invalid subscription limit');
  const cap = limit as number | null;
  return { used, limit: cap, percent: cap === null ? null : Math.min(100, used / cap * 100), overLimit: cap !== null && used > cap };
}
function recordOf(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid subscription response');
  return value as Record<string, unknown>;
}
export function mayShowSubscription(path: string, capabilities: readonly string[]): boolean {
  return path === '/' && capabilities.includes('tenant.admin');
}
export function parseSubscription(value: unknown, orgId: string) {
  const row = recordOf(value);
  const name = row['plan_name'];
  const status = row['status'];
  if (row['org_id'] !== orgId || typeof name !== 'string' || !name.trim() || typeof status !== 'string' || !['active','trial','paused','cancelled','expired','unassigned'].includes(status) || row['enforcement'] !== 'monitoring') throw new Error('Subscription context mismatch');
  const usage = recordOf(row['usage']);
  const limits = recordOf(row['limits']);
  return { name, status, endsOn: typeof row['ends_on'] === 'string' ? row['ends_on'] : null, users: usageMetric(usage['users'], limits['users']), branches: usageMetric(usage['branches'], limits['branches']), cases: usageMetric(usage['monthly_cases'], limits['monthly_cases']) };
}

export function parseGrowthMode(value: unknown, orgId: string): 'growth' | 'monitoring' {
  const row = recordOf(value);
  if (row['org_id'] !== orgId || (row['enforcement'] !== 'growth' && row['enforcement'] !== 'monitoring')) throw new Error('Invalid subscription enforcement context');
  return row['enforcement'];
}
