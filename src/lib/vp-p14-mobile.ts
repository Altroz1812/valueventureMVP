import type { FieldVisit } from '@/lib/vp-field';
import type { VpCase } from '@/lib/vp-cases';

export type FieldMobileView = 'visits' | 'reports';
export type FieldMobileVisitFilter = 'all' | 'scheduled' | 'onsite' | 'completed';

/** Back-end RLS still enforces the authoritative permission. This only shapes visible UI. */
export function scopedMobileVisits(
  visits: readonly FieldVisit[],
  cases: readonly VpCase[],
  ownUserId: string | undefined,
  canAssign: boolean,
  branch: string,
): { v: FieldVisit; c: VpCase | undefined }[] {
  const caseMap = new Map(cases.map(item => [item.caseNum, item]));
  return visits.filter(visit => {
    if (visit.status === 'Cancelled') return false;
    const isMine = Boolean(ownUserId) && String(visit.assigned_user_id) === ownUserId;
    if (!canAssign && !isMine) return false;
    // Never hide an assigned officer's visit just because a case list query
    // (which is independently RBAC-protected) returned no matching row.
    if (canAssign && branch !== 'all') {
      const caseRow = caseMap.get(visit.num);
      if (!caseRow || caseRow.branchId !== branch) return false;
    }
    return true;
  }).map(v => ({v, c:caseMap.get(v.num)}));
}

export function filterMobileVisits(
  visits: readonly { v: FieldVisit; c: VpCase | undefined }[],
  filter: FieldMobileVisitFilter,
) {
  switch (filter) {
    case 'scheduled': return visits.filter(row => row.v.status === 'Scheduled');
    case 'onsite': return visits.filter(row => row.v.status === 'On site');
    case 'completed': return visits.filter(row => row.v.status === 'Completed');
    default: return [...visits];
  }
}
