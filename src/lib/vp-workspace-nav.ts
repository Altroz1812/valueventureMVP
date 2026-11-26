import { mayOpenPath } from './vp-p10-permissions';

export type WorkspaceEntry = { label: string; to: string; icon: string };
export type WorkspaceGroup = { id: string; label: string; icon: string; items: WorkspaceEntry[] };
const groups: WorkspaceGroup[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', items: [{ label: 'Dashboard', to: '/', icon: 'dashboard' }] },
  { id: 'cases', label: 'Cases', icon: 'cases', items: [{ label: 'Cases', to: '/cases', icon: 'cases' }] },
  { id: 'tasks', label: 'My Tasks', icon: 'tasks', items: [
    { label: 'Field operations', to: '/field-operations', icon: 'field' },
    { label: 'Quality checking', to: '/qc-checking', icon: 'qc' },
    { label: 'Reports & sign-off', to: '/reports', icon: 'reports' },
  ] },
  { id: 'property', label: 'Property & Market', icon: 'property', items: [
    { label: 'Property master', to: '/properties', icon: 'property' },
    { label: 'Market evidence', to: '/market-intelligence', icon: 'market' },
  ] },
  { id: 'finance', label: 'Finance & MIS', icon: 'finance', items: [
    { label: 'Billing & MIS', to: '/billing-mis', icon: 'finance' },
    { label: 'Analytics & audit', to: '/analytics', icon: 'market' },
  ] },
  { id: 'admin', label: 'Administration', icon: 'admin', items: [
    { label: 'Branches & configuration', to: '/admin/branches', icon: 'property' },
    { label: 'Users', to: '/admin/users', icon: 'users' },
    { label: 'Role permissions', to: '/admin/roles-permissions', icon: 'shield' },
    { label: 'Banks & templates', to: '/admin/bank-masters', icon: 'bank' },
    { label: 'Data connections', to: '/admin/data-integrity', icon: 'database' },
  ] },
];
export function workspaceGroups(capabilities: readonly string[]): WorkspaceGroup[] {
  return groups.map(g => ({ ...g, items: g.items.filter(i => mayOpenPath(i.to, capabilities)) })).filter(g => g.items.length > 0);
}
export function isWorkspacePath(pathname: string, to: string): boolean {
  return pathname === to || (to !== '/' && pathname.startsWith(to + '/')) ||
    (to === '/field-operations' && pathname.startsWith('/field-inspections/')) ||
    (to === '/admin/branches' && pathname.startsWith('/admin/settings/branches/'));
}
export function filterWorkspaceGroups(groups: WorkspaceGroup[], input: string): WorkspaceGroup[] {
  const q = input.trim().toLowerCase();
  return groups.map(g => ({ ...g, items: g.items.filter(i => !q || `${g.label} ${i.label}`.toLowerCase().includes(q)) })).filter(g => g.items.length > 0);
}
