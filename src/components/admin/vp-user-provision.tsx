import { useMemo, useState, type ChangeEvent } from 'react';
import { Download, FileSpreadsheet, KeyRound, Plus, Upload, UserRoundPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { vpDb } from '@/lib/vp-db';

type Branch = { id: string; name: string; code: string; is_active: boolean };
type NewUser = { name: string; email: string; role: string; branch_codes: string[] };
export type ProvisionResult = { name: string; email: string; role: string;
  status: 'created' | 'failed' | 'reset'; user_id?: string;
  temporary_password?: string; error?: string; warning?: string };
type ImportEntry = NewUser & { excel_row: number; error: string | null };
const emailValid = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 320;
function errorText(e: unknown): string { return e instanceof Error ? e.message : String(e); }
async function invokeProvision(body: Record<string, unknown>): Promise<{ results: ProvisionResult[] }> {
  const { data, error } = await supabase.functions.invoke('vp-provision-users', { body });
  if (error) {
    let message = error.message;
    const context = (error as any).context;
    if (context && typeof context.json === 'function') {
      try { const json = await context.json(); message = json.error ?? message; } catch { /* ignore */ }
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(String(data.error));
  return data as { results: ProvisionResult[] };
}
function csvCell(value: string) {
  const neutral = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${neutral.replaceAll('"', '""')}"`;
}
function downloadCredentials(items: ProvisionResult[], fileName: string) {
  const headers = ['Full Name', 'Email', 'Role', 'Temporary Password', 'Status', 'Error'];
  const rows = items.map(x => [x.name, x.email, x.role, x.temporary_password ?? '', x.status, x.error ?? x.warning ?? '']);
  const content = '\uFEFF' + [headers, ...rows].map(row => row.map(cell => csvCell(String(cell))).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = fileName; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function VpOneTimeCredentials({ results, onClose }: {
  results: ProvisionResult[] | null; onClose: () => void;
}) {
  const completed = results?.filter(r => r.status !== 'failed') ?? [];
  return <Dialog open={Boolean(results)} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-xl">
      <DialogHeader><DialogTitle>One-time account credentials</DialogTitle>
        <DialogDescription>Passwords appear only here. Record or securely distribute them before closing. Never place the credentials file in shared storage or send it by ordinary email.</DialogDescription>
      </DialogHeader>
      <div className="max-h-64 space-y-2 overflow-auto rounded-md border p-3 text-sm">
        {completed.map((x, i) => <div className="border-b pb-2 last:border-0" key={`${x.email}-${i}`}>
          <b>{x.name}</b> — {x.email} ({x.role})
          <div className="mt-1 font-mono text-xs break-all">Temporary password: {x.temporary_password}</div>
          {x.warning && <div className="text-xs text-amber-700">{x.warning}</div>}
        </div>)}
        {results?.filter(x => x.status === 'failed').map((x, i) =>
          <p className="text-xs text-destructive" key={`${x.email}-${i}`}>{x.email}: {x.error}</p>)}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close and clear passwords</Button>
        <Button disabled={!completed.length} onClick={() => downloadCredentials(results ?? [], 'ValuationPro_One_Time_Credentials.csv')}>
          <Download className="size-4" /> Export credentials once
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function VpUserProvisionDialog({ open, onOpenChange, roles, branches, onComplete }: {
  open: boolean; onOpenChange: (open: boolean) => void;
  roles: string[]; branches: Branch[]; onComplete: () => Promise<void>;
}) {
  const [mode, setMode] = useState<'single' | 'bulk' | 'link'>('single');
  const [user, setUser] = useState<NewUser>({ name: '', email: '', role: '', branch_codes: [] });
  const [rows, setRows] = useState<ImportEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProvisionResult[] | null>(null);
  const activeCodes = useMemo(() => new Set(branches.filter(x => x.is_active).map(x => x.code.toUpperCase())), [branches]);
  const validRows = rows.filter(r => !r.error);
  const failedRows = rows.filter(r => r.error);
  const isValid = (x: NewUser): string | null => {
    if (x.name.trim().length < 2 || x.name.length > 200) return 'Name must be 2–200 characters';
    if (!emailValid(x.email)) return 'Invalid email';
    if (!roles.includes(x.role)) return `Unknown role: ${x.role}`;
    const unknown = x.branch_codes.find(code => !activeCodes.has(code));
    return unknown ? `Unknown/inactive branch: ${unknown}` : null;
  };
  async function readExcel(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setResults(null); setRows([]); setProgress(0);
    if (!/\.xlsx$/i.test(file.name) || file.size > 3_000_000) {
      toast.error('Select a .xlsx file up to 3 MB'); return;
    }
    try {
      const { readSheet } = await import('read-excel-file/browser');
      const data = await readSheet(file);
      const headers = (data[0] ?? []).map(v => String(v ?? '').trim().toLowerCase());
      const expected = ['full name', 'email', 'role', 'branch codes'];
      if (expected.some((name, idx) => headers[idx] !== name))
        throw new Error('Excel columns must be: Full Name | Email | Role | Branch Codes');
      const records = data.slice(1).filter(line => line.some(cell => String(cell ?? '').trim()));
      if (!records.length || records.length > 1000) throw new Error('Workbook must contain 1–1000 users');
      const seen = new Set<string>();
      setRows(records.map((cells, index) => {
        const row: NewUser = {
          name: String(cells[0] ?? '').trim(), email: String(cells[1] ?? '').trim().toLowerCase(),
          role: String(cells[2] ?? '').trim(),
          branch_codes: Array.from(new Set(String(cells[3] ?? '').split(';').map(s => s.trim().toUpperCase()).filter(Boolean))),
        };
        let error = isValid(row);
        if (seen.has(row.email)) error = 'Repeated email in import';
        seen.add(row.email);
        return { ...row, excel_row: index + 2, error };
      }));
    } catch (e) { toast.error(errorText(e)); }
  }
  async function provision() {
    if (busy) return;
    setBusy(true); setProgress(0); setResults(null);
    try {
      if (mode === 'link') {
        const error = isValid(user); if (error) throw new Error(error);
        const { data: id, error: linkError } = await vpDb.rpc('vp_admin_attach_invited_user', {
          p_name: user.name.trim(), p_email: user.email.trim().toLowerCase(), p_role: user.role,
        });
        if (linkError) throw linkError;
        if (user.branch_codes.length) {
          const ids = user.branch_codes.map(code => branches.find(b => b.code.toUpperCase() === code)?.id).filter(Boolean);
          const { error: branchError } = await vpDb.rpc('vp_admin_replace_user_branches', {
            p_user_id: String(id), p_branch_ids: ids,
          });
          if (branchError) toast.warning('Linked account; review branch assignments');
        }
        toast.success('Existing login linked to this agency');
        await onComplete(); onOpenChange(false);
      } else {
        const batch = mode === 'single' ? [user] : validRows;
        if (mode === 'single') { const error = isValid(user); if (error) throw new Error(error); }
        if (!batch.length) throw new Error('No valid users to create');
        const outcomes: ProvisionResult[] = [];
        for (let i = 0; i < batch.length; i += 20) {
          const part = batch.slice(i, i + 20);
          try {
            const data = await invokeProvision(mode === 'single' ? { action: 'create', user: part[0] }
              : { action: 'bulk', rows: part });
            outcomes.push(...data.results);
          } catch (e) {
            outcomes.push(...part.map(x => ({ ...x, status: 'failed' as const, error: errorText(e) })));
          }
          setProgress(Math.min(i + part.length, batch.length));
        }
        outcomes.push(...failedRows.map(x => ({ ...x, status: 'failed' as const, error: `Row ${x.excel_row}: ${x.error}` })));
        setResults(outcomes);
        await onComplete();
        const successes = outcomes.filter(x => x.status === 'created').length;
        toast[successes ? 'success' : 'error'](`${successes} user(s) created; ${outcomes.length - successes} failed`);
      }
    } catch (e) { toast.error(errorText(e)); }
    finally { setBusy(false); }
  }
  function close() {
    if (busy) return;
    setResults(null); setRows([]); setProgress(0);
    onOpenChange(false);
  }
  return <>
    <Dialog open={open && !results} onOpenChange={v => { if (!v && !results) close(); else if (v) onOpenChange(true); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>User Management — Add Accounts</DialogTitle>
          <DialogDescription>Create staff logins directly. No email invitations or database-console steps are needed.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant={mode === 'single' ? 'default' : 'outline'} disabled={busy} onClick={() => setMode('single')}>
            <UserRoundPlus className="size-4" /> Create User</Button>
          <Button type="button" size="sm" variant={mode === 'bulk' ? 'default' : 'outline'} disabled={busy} onClick={() => setMode('bulk')}>
            <Upload className="size-4" /> Excel Bulk Import</Button>
          <Button type="button" size="sm" variant={mode === 'link' ? 'default' : 'outline'} disabled={busy} onClick={() => setMode('link')}>
            <Plus className="size-4" /> Link Existing Account</Button>
        </div>
        {mode !== 'bulk' ? <div className="space-y-4">
          <div><Label>Full name</Label><Input value={user.name} onChange={e => setUser(x => ({ ...x, name: e.target.value }))} placeholder="Employee full name" /></div>
          <div><Label>Work email / login</Label><Input type="email" value={user.email} onChange={e => setUser(x => ({ ...x, email: e.target.value }))} placeholder="staff@company.com" /></div>
          <div><Label>Role</Label><Select
  value={user.role}
  onValueChange={role =>
    setUser(x => ({ ...x, role }))
  }
>
            <SelectTrigger><SelectValue placeholder="Choose a role" /></SelectTrigger>
            <SelectContent>{roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
          </Select>
          {!roles.length && <p role="alert" className="mt-1 text-xs text-destructive">No assignable roles available. Ask the Tenant Owner to configure the Role Matrix.</p>}
          </div>
          <div><Label>Branch access (optional)</Label><div className="mt-2 flex max-h-28 flex-wrap gap-3 overflow-auto rounded border p-3">
            {branches.filter(b => b.is_active).map(branch => <label className="flex items-center gap-2 text-xs" key={branch.id}>
              <Checkbox checked={user.branch_codes.includes(branch.code)} onCheckedChange={checked =>
                setUser(x => ({ ...x, branch_codes: checked === true ? [...x.branch_codes, branch.code]
                  : x.branch_codes.filter(code => code !== branch.code) }))} />
              {branch.name} ({branch.code})
            </label>)}
            {!branches.some(b => b.is_active) && <p className="text-xs text-muted-foreground">No active branches in this tenant. Create a branch under Administration → Branches, or create the user without branch allocation.</p>}
          </div></div>
          <p className="rounded-md border p-2 text-xs text-muted-foreground">
            {mode === 'single' ? 'A unique temporary password will be displayed once. The employee must change it on first login.' :
              'Link an account already registered in the login service. No new password will be created.'}
          </p>
        </div> : <div className="space-y-3">
          <a href="/ValuationPro_User_Import_Template.xlsx" className="inline-flex items-center gap-2 text-sm font-medium underline" download>
            <Download className="size-4" /> Download Excel template</a>
          <div className="flex items-center gap-2"><FileSpreadsheet className="size-5" />
            <Input type="file" accept=".xlsx" disabled={busy} onChange={e => void readExcel(e)} /></div>
          <p className="text-xs text-muted-foreground">Columns: Full Name, Email, Role, Branch Codes (separate multiple codes with semicolons). No passwords in the upload. Up to 1,000 users per file; processed in batches of 20.</p>
          {!!rows.length && <div className="rounded border p-3 text-sm">
            <b>{rows.length} rows</b> · {validRows.length} ready · {failedRows.length} need correction
            <div className="mt-2 max-h-36 overflow-auto text-xs">
              {rows.slice(0, 20).map(x => <p key={x.excel_row} className={x.error ? 'text-destructive' : ''}>
                Row {x.excel_row}: {x.name} / {x.email} / {x.role} {x.error ? `— ${x.error}` : '✓'}
              </p>)}
              {rows.length > 20 && <p>...and {rows.length - 20} further rows</p>}
            </div>
          </div>}
          {busy && <p className="text-sm">Processed {progress} of {validRows.length} users. Keep this page open.</p>}
        </div>}
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={close}>Cancel</Button>
          <Button disabled={busy || (mode === 'bulk' ? validRows.length === 0 : Boolean(isValid(user)))} onClick={() => void provision()}>
            {busy ? 'Creating…' : mode === 'bulk' ? `Create ${validRows.length} Users` : mode === 'link' ? 'Link Existing Account' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <VpOneTimeCredentials results={results} onClose={() => { setResults(null); close(); }} />
  </>;
}

export async function resetValuationUser(userId: string): Promise<ProvisionResult> {
  const { data, error } = await supabase.functions.invoke('vp-provision-users', {
    body: { action: 'reset_password', user_id: userId },
  });
  if (error) {
    let message = error.message;
    const context = (error as any).context;
    if (context && typeof context.json === 'function') {
      try { const obj = await context.json(); message = obj.error ?? message; } catch { /* ignore */ }
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data as ProvisionResult;
}
