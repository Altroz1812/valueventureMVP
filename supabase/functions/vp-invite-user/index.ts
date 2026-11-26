// Deploy as a Supabase Edge Function with JWT verification enabled.
// NEVER expose the service role / secret key to the browser.
import { createClient } from 'npm:@supabase/supabase-js@2';

const headers = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': Deno.env.get('VP_WEB_ORIGIN') ?? '',
  'Content-Type': 'application/json',
};
const result = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return result(405, { error: 'Method not allowed' });
  const origin = Deno.env.get('VP_WEB_ORIGIN');
  if (!origin || req.headers.get('origin') !== origin) {
    return result(403, { error: 'Origin not permitted' });
  }
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return result(401, { error: 'Sign in required' });
  const token = authHeader.slice('Bearer '.length);
  const url = Deno.env.get('SUPABASE_URL');
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY');
  const privateKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY');
  if (!url || !publicKey || !privateKey) return result(500, { error: 'Server configuration incomplete' });

  try {
    const input = await req.json();
    const email = String(input.email ?? '').trim().toLowerCase();
    const name = String(input.name ?? '').trim();
    const role = String(input.role ?? '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 320 ||
        name.length < 2 || name.length > 200 || role.length < 2 || role.length > 80) {
      return result(400, { error: 'Valid email, full name, and role are required' });
    }

    const admin = createClient(url, privateKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    // Authentication is verified against Auth itself, not untrusted JWT claims.
    const { data: account, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !account.user) return result(401, { error: 'Session invalid' });

    // Important: execute this check as the CALLING user, with their JWT.
    // A service-role RLS bypass must not be used for application authorization.
    const caller = createClient(url, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: context, error: ctxErr } = await caller.rpc('vp_my_context');
    if (ctxErr || !context?.is_admin) return result(403, { error: 'Tenant administrator required' });
    if (role === 'Tenant Owner' || role === 'Tenant Admin') {
      if (context.role !== 'Tenant Owner') return result(403, { error: 'Only Tenant Owner can invite administrators' });
    }
    const { data: roleRows, error: roleErr } = await caller.from('roles')
      .select('name').eq('org_id', context.org_id).eq('name', role).limit(1);
    if (roleErr || !roleRows?.length) return result(400, { error: 'Choose an existing tenant role' });
    // Admin-created invitation email and redirect are controlled by the server.
    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { vp_invited: true, vp_password_set: false },
      redirectTo: origin,
    });
    if (inviteErr) {
      return result(409, { error: inviteErr.message,
        hint: 'If this identity exists already, use Link Existing Auth User in ValuationPro.' });
    }
    const { data: id, error: linkErr } = await caller.rpc('vp_admin_attach_invited_user', {
      p_email: email, p_name: name, p_role: role,
    });
    if (linkErr) {
      return result(409, { error: 'Auth invitation sent, but application linking needs attention: ' + linkErr.message,
        hint: 'Use Link Existing Auth User with the same email in ValuationPro. Do not send a second invitation.' });
    }
    return result(200, { user_id: String(id), invited: true });
  } catch (e) {
    return result(500, { error: e instanceof Error ? e.message : 'Invitation failed' });
  }
});
