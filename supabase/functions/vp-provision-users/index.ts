// ValuationPro server-side staff provisioning. No invitation emails are sent.
// Call from a signed-in app session. Keep service/secret keys server-side only.
import { createClient } from 'npm:@supabase/supabase-js@2';

type UserRow = { name: string; email: string; role: string; branch_codes?: string[] };
type Outcome = { name: string; email: string; role: string; status: 'created' | 'failed';
  user_id?: string; temporary_password?: string; error?: string; warning?: string };
const env = (name: string) => Deno.env.get(name) ?? '';
const allowedOrigins = env('VP_ALLOWED_ORIGINS').split(',').map(x => x.trim()).filter(Boolean);
const baseHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};
const response = (status: number, value: unknown, origin: string | null) => new Response(JSON.stringify(value), {
  status, headers: { ...baseHeaders, ...(origin && allowedOrigins.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}) },
});
const emailOk = (value: string) => value.length <= 320 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
function generatePassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const chars = [...bytes].map(x => alphabet[x % alphabet.length]).join('');
  return `V!8${chars}m`;
}
function normalize(input: unknown): UserRow {
  const x = (input ?? {}) as Record<string, unknown>;
  const codes = Array.isArray(x.branch_codes) ? x.branch_codes.map(v => String(v).trim().toUpperCase()).filter(Boolean) : [];
  return {
    name: String(x.name ?? '').trim(), email: String(x.email ?? '').trim().toLowerCase(),
    role: String(x.role ?? '').trim(), branch_codes: Array.from(new Set(codes)),
  };
}
function invalid(x: UserRow): string | null {
  if (x.name.length < 2 || x.name.length > 200) return 'Full name must be 2–200 characters';
  if (!emailOk(x.email)) return 'Valid email address required';
  if (!x.role || x.role.length > 80) return 'Role is required';
  if ((x.branch_codes ?? []).some(code => !/^[A-Z0-9_-]{1,30}$/.test(code))) return 'Invalid branch code';
  return null;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return response(200, { ok: true }, origin);
  if (req.method !== 'POST') return response(405, { error: 'POST required' }, origin);
  if (!allowedOrigins.length || !origin || !allowedOrigins.includes(origin))
    return response(403, { error: 'Application origin not authorized' }, origin);
  const authorization = req.headers.get('Authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return response(401, { error: 'Please sign in' }, origin);
  const url = env('SUPABASE_URL');
  const secret = env('SUPABASE_SECRET_KEY') || env('SUPABASE_SERVICE_ROLE_KEY');
  const pub = env('SUPABASE_PUBLISHABLE_KEY') || env('SUPABASE_ANON_KEY');
  if (!url || !secret || !pub) return response(500, { error: 'Server configuration incomplete' }, origin);
  const token = authorization.substring(7);
  const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const caller = createClient(url, pub, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authorization } },
  });
  try {
    const { data: current, error: verifyError } = await admin.auth.getUser(token);
    if (verifyError || !current.user) return response(401, { error: 'Session invalid' }, origin);
    const body = await req.json() as Record<string, unknown>;
    const action = String(body.action ?? '');

    if (action === 'set_password') {
      const next = String(body.password ?? '');
      if (next.length < 12 || next.length > 128 || !/[A-Za-z]/.test(next) || !/[0-9]/.test(next))
        return response(400, { error: 'Use 12–128 characters with letters and numbers' }, origin);
      const { data: pending, error: pendingError } = await caller.rpc('vp_first_login_required');
      if (pendingError || pending !== true) return response(403, { error: 'Password setup is not required for this account' }, origin);
      const { error: changeError } = await admin.auth.admin.updateUserById(current.user.id, { password: next });
      if (changeError) return response(400, { error: changeError.message }, origin);
      const { error: clearError } = await admin.from('vp_user_password_setup')
        .update({ must_change: false, completed_at: new Date().toISOString() })
        .eq('auth_uid', current.user.id).eq('must_change', true);
      if (clearError) return response(500, { error: 'Password updated; please retry the setup step to complete activation' }, origin);
      return response(200, { ok: true, password_changed: true }, origin);
    }

    // User provisioning and reset require a current, active tenant administrator.
    const { data: ctx, error: ctxError } = await caller.rpc('vp_my_context');
    const { data: liveOrg, error: liveOrgError } = await caller.rpc('vp_current_org_id');
    if (ctxError || liveOrgError || !ctx || ctx.is_admin !== true || String(liveOrg) !== String(ctx.org_id))
      return response(403, { error: 'Active tenant administrator access required' }, origin);
    const tenantId = String(ctx.org_id);
    const actorId = String(ctx.user_id);
    // Use the same authoritative, SECURITY DEFINER catalogue as User Management.
    // Do not infer a role list from RLS-filtered table SELECTs.
    const { data: setup, error: setupError } = await caller.rpc('vp_sec_admin_user_setup');
    if (setupError || !setup || String(setup.org_id) !== tenantId ||
        !Array.isArray(setup.roles) || !Array.isArray(setup.branches)) {
      return response(500, { error: 'Unable to load authorized tenant role and branch catalogue' }, origin);
    }
    const allowedRoles = new Set<string>(setup.roles.filter((r: { assignable: boolean }) => r.assignable)
      .map((r: { name: string }) => String(r.name)));
    const elevatedRoles = new Set<string>(setup.roles.filter((r: { privileged: boolean }) => r.privileged)
      .map((r: { name: string }) => String(r.name)));
    const branches = new Map<string, string>(setup.branches.filter((b: { is_active: boolean }) => b.is_active)
      .map((b: { code: string; id: string }) => [String(b.code).toUpperCase(), String(b.id)]));
    const validate = (row: UserRow) => {
      const failure = invalid(row);
      if (failure) return failure;
      if (!allowedRoles.has(row.role)) return 'Role does not exist in your organization';
      if ((row.role === 'Tenant Owner' || elevatedRoles.has(row.role)) && ctx.role !== 'Tenant Owner')
        return 'Only Tenant Owner can create administrative accounts';
      for (const code of row.branch_codes ?? []) {
        if (!branches.has(code)) return `Unknown or inactive branch: ${code}`;
      }
      return null;
    };

    if (action === 'reset_password') {
      const userId = String(body.user_id ?? '');
      if (!/^\d{1,20}$/.test(userId)) return response(400, { error: 'Invalid user identifier' }, origin);
      const { data: target, error: targetError } = await admin.from('users')
        .select('id,org_id,login,name,role').eq('org_id', tenantId).eq('id', userId).maybeSingle();
      if (targetError || !target) return response(404, { error: 'User not found in this organization' }, origin);
      if (String(target.id) === actorId || target.role === 'Tenant Owner')
        return response(403, { error: 'Cannot reset your own or Tenant Owner password here' }, origin);
      if (elevatedRoles.has(target.role) && ctx.role !== 'Tenant Owner')
        return response(403, { error: 'Only Tenant Owner may reset an administrator' }, origin);
      const { data: link, error: linkError } = await admin.from('valuation_auth_links')
        .select('auth_uid').eq('user_id', userId).maybeSingle();
      if (linkError || !link) return response(409, { error: 'This user has no linked login account' }, origin);
      const { error: stageError } = await admin.from('vp_user_password_setup').upsert({
        auth_uid: link.auth_uid, org_id: tenantId, must_change: true, created_by_user_id: actorId,
        completed_at: null,
      }, { onConflict: 'auth_uid' });
      if (stageError) return response(500, { error: 'Unable to secure password reset state' }, origin);
      const password = generatePassword();
      const { error: resetError } = await admin.auth.admin.updateUserById(link.auth_uid, { password });
      if (resetError) return response(500, { error: 'Password reset failed; account remains locked until retried' }, origin);
      return response(200, { status: 'reset', email: target.login, name: target.name,
        role: target.role, temporary_password: password }, origin);
    }
    if (action !== 'create' && action !== 'bulk') return response(400, { error: 'Unknown action' }, origin);
    const raw = action === 'create' ? [body.user] : body.rows;
    if (!Array.isArray(raw) || raw.length < 1 || raw.length > 20)
      return response(400, { error: 'Send 1–20 users per request' }, origin);
    const rows = raw.map(normalize);
    // Preflight all rows before any writes. Per-row errors still reported.
    const seen = new Set<string>();
    const preflight = rows.map(row => {
      const problem = validate(row);
      if (seen.has(row.email)) return 'Repeated email in this batch';
      seen.add(row.email);
      return problem;
    });
    const outcomes: Outcome[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (preflight[i]) {
        outcomes.push({ ...row, status: 'failed', error: preflight[i]! });
        continue;
      }
      const password = generatePassword();
      const { data: account, error: createError } = await admin.auth.admin.createUser({
        email: row.email, password, email_confirm: true,
        user_metadata: { name: row.name },
      });
      if (createError || !account.user) {
        outcomes.push({ ...row, status: 'failed', error: createError?.message ?? 'Account creation failed' });
        continue;
      }
      const authUid = account.user.id;
      // Stage the first-login lock before linking, preventing a race to tenant data.
      const { error: pendingError } = await admin.from('vp_user_password_setup').insert({
        auth_uid: authUid, org_id: tenantId, must_change: true, created_by_user_id: actorId,
      });
      if (pendingError) {
        await admin.auth.admin.deleteUser(authUid);
        outcomes.push({ ...row, status: 'failed', error: 'Failed to protect first-login account' });
        continue;
      }
      const { data: appId, error: attachError } = await caller.rpc('vp_admin_attach_invited_user', {
        p_email: row.email, p_name: row.name, p_role: row.role,
      });
      if (attachError || !appId) {
        // Only delete the Auth user created in this request. Never delete pre-existing accounts.
        await admin.auth.admin.deleteUser(authUid);
        outcomes.push({ ...row, status: 'failed', error: attachError?.message ?? 'Application user linking failed' });
        continue;
      }
      let warning: string | undefined;
      if (row.branch_codes?.length) {
        const { error: branchError } = await caller.rpc('vp_admin_replace_user_branches', {
          p_user_id: String(appId), p_branch_ids: row.branch_codes.map(code => branches.get(code)),
        });
        if (branchError) warning = 'Account created; branch allocation needs manual review';
      }
      outcomes.push({ name: row.name, email: row.email, role: row.role,
        status: 'created', user_id: String(appId), temporary_password: password, warning });
    }
    return response(200, { results: outcomes, created: outcomes.filter(x => x.status === 'created').length,
      failed: outcomes.filter(x => x.status === 'failed').length, password_visible_once: true }, origin);
  } catch (error) {
    // Never log request bodies or passwords.
    return response(500, { error: error instanceof Error ? error.message : 'Provisioning failed' }, origin);
  }
});
