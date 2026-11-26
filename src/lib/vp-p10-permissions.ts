// P10 role-matrix navigation. This is a UX guard only; PostgreSQL RLS/RPCs enforce data access.
// Administration (tenant.admin) is deliberately a separate recovery permission.
export function hasRolePermission(capabilities: readonly string[], action: string): boolean {
  return capabilities.includes(action);
}
export type AccessRule = { path: string; anyOf: readonly string[] };
export const accessRules: readonly AccessRule[] = [
  { path: '/admin/roles-permissions', anyOf: ['tenant.admin'] },
  { path: '/admin/users', anyOf: ['tenant.admin'] },
  { path: '/admin/', anyOf: ['tenant.admin'] },
  { path: '/cases/', anyOf: ['cases.View', 'field.View', 'field.Check In/Out', 'qc.View', 'signoff.View'] },
  { path: '/cases', anyOf: ['cases.View'] },
  { path: '/properties', anyOf: ['cases.View'] },
  { path: '/market-intelligence', anyOf: ['cases.View'] },
  { path: '/field-inspections/', anyOf: ['field.View', 'field.Check In/Out', 'qc.View'] },
  { path: '/field-operations', anyOf: ['field.View','field.Assign','field.Check In/Out'] },
  { path: '/qc-checking', anyOf: ['qc.View'] },
  { path: '/reports', anyOf: ['signoff.View', 'signoff.Generate'] },
  { path: '/billing-mis', anyOf: ['billing.View'] },
  { path: '/analytics', anyOf: ['analytics.View'] },
  { path: '/notifications', anyOf: [] }, // personal notifications are separately recipient-scoped.
  // Any authenticated member may load the safe home shell. Dashboard data
  // remains guarded by analytics.View in both React and the database RPC.
  { path: '/', anyOf: [] },
];
export function requiredPermissions(pathname: string): readonly string[] {
  const match = accessRules.find(r => pathname === r.path ||
    (r.path !== '/' && r.path.endsWith('/') && pathname.startsWith(r.path)));
  return match?.anyOf ?? [];
}
export function mayOpenPath(pathname: string, capabilities: readonly string[]): boolean {
  const required = requiredPermissions(pathname);
  // Unknown paths fail closed, except public onboarding which is handled by VpAuthGate.
  if (!accessRules.some(r => pathname === r.path || (r.path !== '/' && r.path.endsWith('/') && pathname.startsWith(r.path))))
    return pathname === '/onboarding';
  return required.length === 0 || required.some(x => hasRolePermission(capabilities, x));
}


export function normalizeGrantedPermissions(
  value: unknown
): string[] {
  if (!Array.isArray(value) ||
      value.some(item =>
        typeof item !== 'string' ||
        item.length === 0 ||
        item.trim() !== item
      )) {
    throw new Error('Invalid permission response');
  }

  return [...new Set(value as string[])].sort();
}

function authorizationId(value: unknown): string {
  const id =
    typeof value === 'number' && Number.isSafeInteger(value)
      ? String(value)
      : typeof value === 'string'
        ? value
        : '';

  if (!/^[1-9][0-9]{0,18}$/.test(id) ||
      (id.length === 19 &&
       id > '9223372036854775807')) {
    throw new Error('Invalid authorization identifier');
  }

  return id;
}

export function normalizeBranchAssignments(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid branch assignment response');
  }

  const ids = value.map(item => {
    if (!item ||
        typeof item !== 'object' ||
        Array.isArray(item)) {
      throw new Error('Invalid branch assignment');
    }

    return authorizationId(
      (item as Record<string, unknown>)['branch_id']
    );
  });

  return [...new Set(ids)].sort();
}

export function workspaceAuthorizationKey(
  authUid: string,
  identity: {
    org_id: unknown;
    user_id: unknown;
    role: unknown;
    is_admin: unknown;
  },
  permissions: unknown,
  branchAssignments: unknown
): string {
  if (!authUid ||
      typeof identity.role !== 'string' ||
      !identity.role.trim() ||
      typeof identity.is_admin !== 'boolean') {
    throw new Error('Invalid workspace authorization');
  }

  return JSON.stringify([
    authUid,
    authorizationId(identity.org_id),
    authorizationId(identity.user_id),
    identity.role,
    identity.is_admin,
    normalizeGrantedPermissions(permissions),
    normalizeBranchAssignments(branchAssignments)
  ]);
}
