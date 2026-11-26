import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock, GitBranch, RefreshCw, ShieldCheck,
  UserPlus, Users, UserX, AlertTriangle, Settings2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, PageHeader } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { VpUserProvisionDialog, VpOneTimeCredentials, resetValuationUser,
  type ProvisionResult } from '@/components/admin/vp-user-provision';

export const Route = createFileRoute('/admin/users')({
  head: () => ({ meta: [{ title: 'ValuationPro — Users & Permissions' }] }),
  component: UsersPage,
});

type DirectoryUser = {
  id: string; org_id: string; login: string; name: string; role: string;
  active: boolean; email_confirmed: boolean; invited_at: string | null;
  last_login: string | null; branch_ids: string[];
  qc_eligible: boolean; qc_issue: string; password_setup_required?: boolean; login_linked?: boolean;
};
type Branch = { id: string; code: string; name: string; is_active: boolean };
type SetupRole = { name: string; privileged: boolean; assignable: boolean };
type UserSetup = { org_id: string; roles: SetupRole[]; branches: Branch[] };

function status(u: DirectoryUser): 'Suspended' | 'Login Not Linked' | 'Pending Invite' | 'Password Change Required' | 'Active' {
  if (u.login_linked === false) return 'Login Not Linked';
  if (!u.active) return 'Suspended';
  if (u.password_setup_required) return 'Password Change Required';
  if (!u.email_confirmed) return 'Pending Invite';
  return 'Active';
}
function getError(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function UsersPage() {
  const { tenant, reloadUsers } = useApp();
  const qc = useQueryClient();
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [roleDefinitions, setRoleDefinitions] = useState<SetupRole[]>([]);
  const [assignableRoles, setAssignableRoles] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [resetResult, setResetResult] = useState<ProvisionResult[] | null>(null);
  const [selected, setSelected] = useState<DirectoryUser | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editBranches, setEditBranches] = useState<string[]>([]);

  async function reload() {
    setLoading(true);
    setDirectoryError(null);
    setUsers([]); // Never display a stale partial directory after an RPC failure.
    setRoles([]); setRoleDefinitions([]); setAssignableRoles([]); setBranches([]);
    try {
      // Single authenticated catalogue RPC avoids incomplete direct-table RLS reads.
      // Both RPCs enforce tenant.admin and derive the tenant from the login.
      const [members, setupResponse] = await Promise.all([
        vpDb.rpc('vp_sec_admin_user_directory'),
        vpDb.rpc('vp_sec_admin_user_setup'),
      ]);
      if (members.error) throw members.error;
      if (setupResponse.error) throw setupResponse.error;
      const setup = setupResponse.data as UserSetup | null;
      if (!setup || String(setup.org_id) !== String(tenant.id) ||
          !Array.isArray(setup.roles) || !Array.isArray(setup.branches)) {
        throw new Error('User setup catalogue is missing or belongs to another tenant');
      }

      setUsers(((members.data ?? []) as DirectoryUser[]).map((u) => ({
        ...u, id: String(u.id), branch_ids: (u.branch_ids ?? []).map(String),
        password_setup_required: Boolean(u.password_setup_required),
        qc_eligible: u.qc_eligible && !u.password_setup_required,
        qc_issue: u.password_setup_required ? 'First login password change required' : u.qc_issue,
      }))); 
      setRoles(setup.roles.map((r) => r.name));
      setRoleDefinitions(setup.roles);
      setAssignableRoles(setup.roles.filter((r) => r.assignable).map((r) => r.name));
      setBranches(setup.branches.map((b) => ({ ...b, id: String(b.id) })));
      // The secure directory is the source of truth for this page. A failure
      // refreshing the legacy app-context list must not hide verified members.
      try { await reloadUsers(); } catch (refreshError) {
        console.warn('Legacy user-list refresh failed; administrator directory remains available', refreshError);
      }
      await qc.invalidateQueries({ queryKey: ['vp-qc-eligible-checkers', tenant.id] });
    } catch (e) { setDirectoryError(getError(e)); toast.error(`Unable to load user directory: ${getError(e)}`); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, [tenant.id]);

  const filtered = useMemo(() => users.filter((u) => {
    const search = `${u.name} ${u.login}`.toLowerCase();
    return (!query || search.includes(query.toLowerCase())) &&
      (filter === 'all' || (filter === 'qc' ? u.qc_eligible : status(u) === filter)) &&
      (roleFilter === 'all' || roleFilter === u.role);
  }), [users, query, filter, roleFilter]);
  // Server calculates which roles this administrator may assign.
  const permittedRoles = assignableRoles;
  const isProtectedRole = (roleName: string) =>
    roleName === 'Tenant Owner' || roleDefinitions.some(r => r.name === roleName && r.privileged);
  const mayManageAccount = (u: DirectoryUser) =>
    tenant.role === 'Tenant Owner' || !isProtectedRole(u.role);

  async function resetPassword(u: DirectoryUser) {
    if (!window.confirm(`Reset the password for ${u.name}? Their current login will be blocked until they set a new password.`)) return;
    setBusy(true);
    try {
      const result = await resetValuationUser(u.id);
      setResetResult([result]);
      await reload();
      toast.success('A temporary password was created; distribute it securely');
    } catch (e) { toast.error(getError(e)); }
    finally { setBusy(false); }
  }

  async function changeActive(u: DirectoryUser) {
    setBusy(true);
    try {
      const { error } = await vpDb.rpc('vp_admin_set_user_active', {
        p_user_id: u.id, p_active: !u.active,
      });
      if (error) throw error;
      toast.success(u.active ? 'User suspended' : 'User reactivated');
      await reload();
    } catch (e) { toast.error(getError(e)); }
    finally { setBusy(false); }
  }

  async function saveUser() {
    if (!selected || busy) return;

    if (!mayManageAccount(selected)) {
      toast.error('You cannot modify this protected account');
      return;
    }

    if (
      selected.role !== editRole &&
      !permittedRoles.includes(editRole)
    ) {
      toast.error('You cannot assign the selected protected role');
      return;
    }

    const previousBranches = [
      ...new Set(selected.branch_ids)
    ].sort();

    const requestedBranches = [
      ...new Set(editBranches)
    ].sort();

    if (
      selected.role === editRole &&
      JSON.stringify(previousBranches) ===
        JSON.stringify(requestedBranches)
    ) {
      toast.info('No user access changes to save');
      setSelected(null);
      return;
    }

    setBusy(true);

    try {

      const { data, error } = await vpDb.rpc(
        'vp_admin_save_user_access',
        {
          p_user_id: selected.id,
          p_expected_role: selected.role,
          p_expected_active: selected.active,
          p_expected_branches: previousBranches,
          p_role: editRole,
          p_branch_ids: requestedBranches
        }
      );

      if (error) throw error;

      if (
        !data ||
        typeof data !== 'object' ||
        String(data.user_id) !== String(selected.id) ||
        data.role !== editRole ||
        !Array.isArray(data.branch_ids) ||
        JSON.stringify(
          [...data.branch_ids].map(String).sort()
        ) !== JSON.stringify(requestedBranches)
      ) {
        throw new Error(
          'Server response could not be verified. Refresh the directory.'
        );
      }

      setSelected(null);

      toast.success('User role and branch access updated');

      await reload();

      window.dispatchEvent(
        new Event('vp-permissions-changed')
      );

    } catch (e) {

      toast.error(
        getError(e) +
        '. Refresh and verify the current user access.'
      );

      setSelected(null);

      await reload();

    } finally {
      setBusy(false);
    }
  }

  const kpis = [
    { title: 'Total users', count: users.length, icon: Users },
    { title: 'Active', count: users.filter((u) => status(u)==='Active').length, icon: CheckCircle2 },
    { title: 'Password setup', count: users.filter((u) => status(u)==='Password Change Required').length, icon: Clock },
    { title: 'QC ready', count: users.filter((u) => u.qc_eligible).length, icon: ShieldCheck },
  ];

  return <AppShell>
    <PageHeader title="Users & Permissions"
      description={`Manage staff accounts, tenant roles, branch allocation and QC eligibility for ${tenant.shortName}.`}>
      <Button variant="outline" size="sm" onClick={() => void reload()} disabled={loading}>
        <RefreshCw className="size-4" /> Refresh
      </Button>
      <Link to="/admin/roles-permissions"><Button variant="outline" size="sm">
        <Settings2 className="size-4" /> Role Matrix
      </Button></Link>
      <Button size="sm" disabled={loading || Boolean(directoryError) || !permittedRoles.length} onClick={() => { setInviteOpen(true); }}>
        <UserPlus className="size-4" /> Add User
      </Button>
    </PageHeader>

    {directoryError && <div role="alert" className="mb-4 rounded-md border border-destructive bg-destructive/5 p-3 text-sm text-destructive">User Management could not load securely: {directoryError}. Verify P10/P11 and install the P12 user-setup RPC. No roles or users will be guessed.</div>}
    {!loading && !directoryError && !permittedRoles.length && <div role="alert" className="mb-4 rounded-md border border-amber-500/50 p-3 text-sm">No assignable roles exist for this tenant. Configure roles in the Role Matrix before adding an account.</div>}
    {!loading && !directoryError && !branches.some(b => b.is_active) && <div className="mb-4 rounded-md border p-3 text-sm">No active agency branches are configured. You can create an account without a branch, or <Link className="underline" to="/admin/branches">configure real branches</Link> first.</div>}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((x) => <Card key={x.title}><CardContent className="flex items-center gap-3 p-4">
        <x.icon className="size-5 text-primary"/><div><p className="font-display text-xl font-bold">{x.count}</p>
          <p className="text-xs text-muted-foreground">{x.title}</p></div>
      </CardContent></Card>)}
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      <Input className="max-w-72" placeholder="Search name or email" value={query} onChange={(e)=>setQuery(e.target.value)} />
      <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Pending Invite">Pending Invite</SelectItem><SelectItem value="Login Not Linked">Login Not Linked</SelectItem><SelectItem value="Password Change Required">Password Change Required</SelectItem><SelectItem value="Suspended">Suspended</SelectItem>
        <SelectItem value="qc">QC ready</SelectItem></SelectContent></Select>
      <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All roles</SelectItem>
          {roles.map((r)=><SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent></Select>
    </div>
    <Card className="mt-4">
      <CardHeader><CardTitle className="text-base">User directory ({filtered.length})</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table><TableHeader><TableRow>
          <TableHead>Name / Login</TableHead><TableHead>Role</TableHead>
          <TableHead>Access status</TableHead><TableHead>QC assignment</TableHead>
          <TableHead>Branches</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader><TableBody>
          {filtered.map((u)=><TableRow key={u.id}>
            <TableCell><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.login}</div></TableCell>
            <TableCell>{u.role}</TableCell>
            <TableCell><Badge variant="outline">{status(u)}</Badge></TableCell>
            <TableCell>{u.qc_eligible ? <Badge className="bg-success/15 text-success">Eligible</Badge> :
              <span className="flex max-w-48 items-start gap-1 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-3 shrink-0"/>{u.qc_issue}</span>}</TableCell>
            <TableCell>{u.branch_ids.length ? u.branch_ids.map((id)=>branches.find((b)=>b.id===id)?.code ?? id).join(', ') : 'Not allocated'}</TableCell>
            <TableCell className="text-right"><div className="flex justify-end gap-2">
              {mayManageAccount(u) ? <Button size="sm" variant="outline" disabled={busy}
                onClick={()=>{setSelected(u);setEditRole(u.role);setEditBranches([...u.branch_ids]);}}>Manage</Button> : <span className="text-xs text-muted-foreground">Protected account</span>}
              {u.role!=='Tenant Owner' && mayManageAccount(u) && <Button size="sm" variant="outline" disabled={busy || u.login_linked === false}
                onClick={()=>void resetPassword(u)}><KeyRound className="size-4" /> Reset password</Button>}
              {u.role!=='Tenant Owner' && mayManageAccount(u) && <Button size="sm" variant="outline" disabled={busy}
                onClick={()=>void changeActive(u)}>{u.active?<UserX className="size-4"/>:<CheckCircle2 className="size-4"/>}
                {u.active?'Suspend':'Activate'}</Button>}
            </div></TableCell>
          </TableRow>)}
          {!filtered.length && <TableRow><TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
            {loading?'Loading all agency users…':directoryError?'Directory unavailable — inspect the error above.':'No users match. Clear filters or create an account.'}
          </TableCell></TableRow>}
        </TableBody></Table>
      </CardContent>
    </Card>
    <p className="mt-3 text-xs text-muted-foreground">Branch allocations must be enforced in each workflow. Missing allocations do not imply unrestricted data access. QC eligibility also depends on maker/checker separation.</p>

    <VpUserProvisionDialog open={inviteOpen} onOpenChange={setInviteOpen}
      roles={permittedRoles} branches={branches} onComplete={reload} />
    <VpOneTimeCredentials results={resetResult} onClose={() => setResetResult(null)} />

    <Dialog open={Boolean(selected)} onOpenChange={(open)=>{if(!open)setSelected(null);}}>
      <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Manage user: {selected?.name}</DialogTitle>
        <DialogDescription>Update the real role and branch assignments. Changes are saved to ValuationPro.</DialogDescription></DialogHeader>
        {selected && <div className="space-y-4">
          <div className="rounded-md border p-3 text-sm"><b>{selected.login}</b><p className="mt-1 text-xs text-muted-foreground">
            {status(selected)} · {selected.qc_issue}</p></div>
          <div className="space-y-1"><Label>Role</Label>
            <Select value={editRole} onValueChange={setEditRole} disabled={selected.role==='Tenant Owner' || !permittedRoles.includes(selected.role)}>
              <SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              {permittedRoles.map((r)=><SelectItem value={r} key={r}>{r}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Allocated branches (optional)</Label>
            <div className="max-h-44 space-y-2 overflow-auto rounded-md border p-3">
              {branches.filter((b)=>b.is_active).map((b)=><label key={b.id} className="flex items-center gap-2 text-sm">
                <Checkbox checked={editBranches.includes(b.id)} onCheckedChange={(v)=>setEditBranches((old)=>v===true?[...old,b.id]:old.filter((x)=>x!==b.id))}/>
                {b.name} ({b.code})
              </label>)}
              {!branches.length && <p className="text-xs text-muted-foreground">Create an agency branch first.</p>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">For a Checker, grant qc.View, qc.Approve and qc.Return in Role Matrix. Only a different maker can be selected as its checker.</p>
        </div>}
        <DialogFooter><Button variant="outline" onClick={()=>setSelected(null)}>Cancel</Button>
          <Button disabled={busy} onClick={()=>void saveUser()}>Save changes</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </AppShell>;
}
