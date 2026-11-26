import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Copy,
  FolderOpen,
  Landmark,
  Lock,
  MapPinned,
  PenLine,
  Receipt,
  BarChart3,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { matrixRoles, permissionModules, type Matrix } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { vpDb } from "@/lib/vp-db";

export const Route = createFileRoute("/admin/roles-permissions")({
  head: () => ({
    meta: [
      { title: "ValuationPro — Role Matrix" },
      { name: "description", content: "Central role and capability matrix across case management, field ops, QC, digital sign-off, billing and administration." },
      { property: "og:title", content: "ValuationPro — Role Matrix" },
      { property: "og:description", content: "Central role and capability matrix across all agency modules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RolesPage,
});

const moduleIcons: Record<string, LucideIcon> = {
  cases: FolderOpen,
  field: MapPinned,
  qc: ShieldCheck,
  signoff: PenLine,
  billing: Receipt,
  analytics: BarChart3,
  admin: Settings,
};

function RolesPage() {
  const { tenant } = useApp();
  const queryClient = useQueryClient();
  const [roles, setRoles] = useState<typeof matrixRoles>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [updating, setUpdating] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [ibbiLock, setIbbiLock] = useState(true);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [cloneSource, setCloneSource] = useState('');
  const [cloneName, setCloneName] = useState('');

  async function loadMatrix() {
    setLoadError(null);
    const { data: rows, error: matrixError } = await vpDb.rpc('vp_sec_admin_role_matrix');
    if (matrixError) throw matrixError;
    if (!Array.isArray(rows)) throw new Error('Invalid role matrix response');
    const roleNames = [...new Set(rows.map((r: {role_name: string}) => String(r.role_name)))].sort();
    const fetched = roleNames.map((name) => ({
      id: name, name,
      ibbi: false,
      system: ['Tenant Owner', 'Tenant Admin', 'Branch Admin', 'Back Office',
        'Checker', 'Field Officer', 'Accounts', 'Manager'].includes(name),
    }));
    const next: Matrix = {};
    for (const role of fetched) next[role.id] = {};
    for (const row of rows as Array<{role_name:string;permission:string|null}>) {
      if (!row.permission || !next[row.role_name]) continue;
      const split = row.permission.indexOf('.');
      if (split < 0) continue;
      const mod = row.permission.slice(0, split);
      const action = row.permission.slice(split + 1);
      if (permissionModules.find((m) => m.id === mod)?.actions.includes(action)) {
        next[row.role_name]![mod] = [...(next[row.role_name]![mod] ?? []), action];
      }
    }
    setRoles(fetched);
    setMatrix(next);
    if (fetched.length) setCloneSource((prev) => fetched.some((r) => r.id===prev) ? prev : fetched[0]!.id);
  }

  useEffect(() => { void loadMatrix().catch((e: unknown) => {const message = e instanceof Error ? e.message : 'Unable to load permissions'; setLoadError(message); toast.error(message);}); }, [tenant.id]);

  async function updateModule(roleId: string, moduleId: string, actions: string[]) {
    if (updating) return;
    // Legacy admin.View / Manage* toggles were never enforced by the server.
    // Only independently enforced admin.Audit Logs is editable.
    const actionsToSave = moduleId === 'admin'
      ? actions.filter((action) => action === 'Audit Logs')
      : actions;
    setUpdating(roleId + ':' + moduleId);
    try {
    const { error } = moduleId === 'analytics'
      ? await vpDb.rpc('vp8_admin_set_analytics_permissions', {p_role:roleId,p_actions:actionsToSave})
      : await vpDb.rpc('vp_admin_replace_module_permissions', {
          p_role: roleId, p_module: moduleId, p_actions: actionsToSave,
        });
    if (error) { toast.error(error.message); await loadMatrix(); return; }
    await loadMatrix();
    window.dispatchEvent(new Event('vp-permissions-changed'));
    toast.success('Permissions saved and reloaded');
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['vp-qc-eligible-checkers', tenant.id] }),
      queryClient.invalidateQueries({ queryKey: ['vp-qc-permissions', tenant.id] }),
    ]);
    } catch (e) { const message=e instanceof Error?e.message:String(e);toast.error(message);setLoadError(message); }
    finally { setUpdating(null); }
  }

  function setCell(roleId: string, moduleId: string, action: string, on: boolean) {
    const current = matrix[roleId]?.[moduleId] ?? [];
    const next = on ? [...new Set([...current, action])] : current.filter((a) => a !== action);
    void updateModule(roleId, moduleId, next);
  }

  function toggleModuleForRole(roleId: string, moduleId: string) {
    const mod = permissionModules.find((m) => m.id === moduleId)!;
    const current = matrix[roleId]?.[moduleId] ?? [];
    const editable = mod.actions.filter((a) => !isLocked(roleId, moduleId, a));
    if (!editable.length) return;
    const full = editable.every((a) => current.includes(a));
    const actions = full ? current.filter(a => !editable.includes(a)) : [...new Set([...current, ...editable])];
    void updateModule(roleId, moduleId, actions);
  }

  const isLocked = (_roleId: string, moduleId: string, action: string) =>
    (moduleId === 'signoff' && action === 'Sign') ||
    (moduleId === 'admin' && action !== 'Audit Logs');
  // The legacy admin.* controls other than Audit Logs are not enforced by the
  // historical administration RPCs; exposing them as working toggles is unsafe.
  // Protected user/role/settings administration is granted via tenant.admin.

  const granted = useMemo(() => {
    let n = 0;
    for (const roleId of Object.keys(matrix)) {
      for (const modId of Object.keys(matrix[roleId] ?? {})) {
        n += (matrix[roleId]?.[modId] ?? []).length;
      }
    }
    return n;
  }, [matrix]);

  async function cloneRole() {
    if (!cloneName.trim()) { toast.error('Give the new role a name first.'); return; }
    const { error } = await vpDb.rpc('vp_admin_clone_role', {
      p_source: cloneSource, p_name: cloneName.trim(),
    });
    if (error) { toast.error(error.message); await loadMatrix(); return; }
    await loadMatrix();
    window.dispatchEvent(new Event('vp-permissions-changed'));
    await queryClient.invalidateQueries({ queryKey: ['vp-qc-eligible-checkers', tenant.id] });
    toast.success(`Role "${cloneName.trim()}" created`);
    setCloneOpen(false);
    setCloneName('');
  }

  const checkerActions = matrix['Checker']?.['qc'] ?? [];
  const checkerReady = checkerActions.includes('View') && checkerActions.includes('Approve') && checkerActions.includes('Return');

  return (
    <AppShell>
      <PageHeader
        title="Role & Capability Matrix"
        description="Every role across your agency, mapped to what it can do in each module. Changes apply to all users holding the role."
      >
        <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-[11px] text-success">
          <BadgeCheck className="size-3" /> {granted} permissions granted
        </Badge>
        <Dialog open={cloneOpen} onOpenChange={setCloneOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Copy className="size-4" /> Clone Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Clone an existing role</DialogTitle>
              <DialogDescription>Copy a role's full permission set, then adjust the details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label className="text-xs">Base role</Label>
              <select
                value={cloneSource}
                onChange={(e) => setCloneSource(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">New role name</Label>
              <Input value={cloneName} onChange={(e) => setCloneName(e.target.value)} placeholder="e.g. Valuation Head" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCloneOpen(false)}>Cancel</Button>
              <Button onClick={() => { void cloneRole(); }}><Copy className="size-4" /> Create role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="mb-4 rounded-md border p-3 text-sm">
        <strong>Checker role readiness: </strong>
        <span className={checkerReady ? 'text-success' : 'text-destructive'}>
          {checkerReady ? 'Configured' : 'Missing QC permissions'}
        </span>
        <p className="mt-1 text-xs text-muted-foreground">For an active, email-verified Checker to appear in QC assignment, grant QC View, Approve and Return. The QC Edit permission is for coordinators who assign checkers, not required for an individual checker.</p>
      </div>
      {loadError && <div role="alert" className="mb-3 flex flex-wrap items-center gap-3 rounded border border-destructive p-2 text-sm text-destructive"><span>Role Matrix failed to load/save: {loadError}</span><Button size="sm" variant="outline" onClick={() => void loadMatrix().catch(e => setLoadError(e instanceof Error ? e.message : String(e)))}>Retry</Button></div>}
      <p className="mb-4 text-xs text-muted-foreground">Protected administrator management is granted by the server-side `tenant.admin` capability and cannot be switched off with the legacy admin.* checkboxes. Only Administration → Audit Logs is independently selectable. Unchecking Cases, Field, QC, Reports, Billing or Analytics removes data access even from administrators after P10 SQL is installed. Changes are authoritative only after a successful save.</p>
      {/* Role chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {roles.map((r) => (
          <Badge key={r.id} variant="outline" className={cn("gap-1.5 px-3 py-1.5 text-xs", r.system ? "border-primary/25 bg-primary/5 text-primary" : "border-accent/40 bg-accent/15 text-accent-foreground")}>
            {r.system ? <ShieldCheck className="size-3" /> : <Users className="size-3" />}
            {r.name}
            {r.ibbi && <BadgeCheck className="size-3 text-success" />}
          </Badge>
        ))}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-3">
          <div>
            <CardTitle className="font-display text-base">Permission grid</CardTitle>
            <CardDescription>Click any cell to grant or revoke a single capability. Use the module toggle to set a whole row for a role.</CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2">
            <Lock className="size-3.5 text-warning-foreground" />
            <span className="text-xs font-medium text-warning-foreground">IBBI sign-off lock</span>
            <Switch checked={ibbiLock} onCheckedChange={setIbbiLock} disabled />
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider delayDuration={200}>
            <ScrollArea className="w-full whitespace-nowrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 z-10 min-w-[230px] bg-card">Module / Capability</TableHead>
                    {roles.map((r) => (
                      <TableHead key={r.id} className="min-w-[92px] text-center text-[11px] leading-tight">
                        {r.name}
                        {r.ibbi && <BadgeCheck className="mx-auto mt-0.5 size-3 text-success" />}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionModules.map((mod) => {
                    const Icon = moduleIcons[mod.id] ?? Settings;
                    return (
                      <>
                        <TableRow key={`${mod.id}-h`} className="bg-muted/60">
                          <TableCell className="sticky left-0 z-10 bg-muted/60">
                            <span className="flex items-center gap-2 font-display text-sm font-semibold">
                              <Icon className="size-4 text-primary" /> {mod.name}
                            </span>
                          </TableCell>
                          {roles.map((r) => {
                            const allowedActions = mod.actions.filter((a) => !isLocked(r.id, mod.id, a));
                            const all = allowedActions.length > 0 && allowedActions.every((a) => (matrix[r.id]?.[mod.id] ?? []).includes(a));
                            return (
                              <TableCell key={r.id} className="text-center">
                                <Checkbox
                                  checked={all}
                                  onCheckedChange={() => toggleModuleForRole(r.id, mod.id)}
                                  aria-label={`Toggle all ${mod.name} for ${r.name}`}
                                  disabled={updating !== null || Boolean(loadError) || allowedActions.length === 0}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        {mod.actions.map((action) => (
                          <TableRow key={`${mod.id}-${action}`}>
                            <TableCell className="sticky left-0 z-10 bg-card pl-10 text-[13px] text-muted-foreground">
                              {action}
                              {mod.ibbiLockedAction === action && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Lock className="ml-2 inline size-3 align-[-1px] text-warning-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-56 text-xs">
                                    Digital sign-off requires verified IBBI registration, which is not stored in the current 16-table schema. The lock remains enforced.
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>
                            {roles.map((r) => {
                              const locked = isLocked(r.id, mod.id, action);
                              const on = locked ? false : (matrix[r.id]?.[mod.id] ?? []).includes(action);
                              return (
                                <TableCell key={r.id} className="text-center">
                                  {locked ? (
                                    <span title={mod.id === 'admin' ? 'Protected administration (tenant.admin)' : 'IBBI verification required'}><Lock className="mx-auto size-3.5 text-muted-foreground/50" /></span>
                                  ) : (
                                    <Checkbox
                                      checked={on}
                                      onCheckedChange={(v) => setCell(r.id, mod.id, action, v === true)}
                                      aria-label={`${action} for ${r.name} in ${mod.name}`}
                                      disabled={updating !== null || Boolean(loadError)}
                                    />
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </TooltipProvider>
        </CardContent>
      </Card>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Landmark className="size-3.5" />
        Maker–checker guidance: avoid granting a user both "Create" and "Approve" on the same module when your workflow requires separation of duties.
      </p>
    </AppShell>
  );
}
