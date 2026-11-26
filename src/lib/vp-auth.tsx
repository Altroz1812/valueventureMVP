import { normalizeGrantedPermissions, workspaceAuthorizationKey } from '@/lib/vp-p10-permissions';
import { Building2, ClipboardCheck, FileText, MapPinned } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppProvider } from '@/lib/app-context';
import { vpDb, type VpIdentity } from '@/lib/vp-db';
import { mayOpenPath } from '@/lib/vp-p10-permissions';
import { vpSignOutToHome } from '@/lib/vp-session';


type Gate = 'loading' | 'login' | 'setup' | 'blocked' | 'ready' | 'password-setup' | 'error';

export function VpAuthGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [gate, setGate] = useState<Gate>('loading');
  const refreshSequence = useRef(0);
  const sessionUser = useRef<string | null>(null);
  const authorizationScope = useRef<string | null>(null);
  const activeRefresh = useRef(0);
  const lastRefreshStarted = useRef(0);
  const [workspaceEpoch, setWorkspaceEpoch] = useState(0);
  const [identity, setIdentity] = useState<VpIdentity | null>(null);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [serverPasswordRequired, setServerPasswordRequired] = useState(false);
  const [invitePassword, setInvitePassword] = useState('');
  const [confirmInvitePassword, setConfirmInvitePassword] = useState('');


  function clearWorkspace() {
    authorizationScope.current = null;

    queryClient.clear();

    setIdentity(null);
    setCapabilities([]);
    setWorkspaceEpoch(value => value + 1);
  }

  async function refresh() {
    const currentSequence = ++refreshSequence.current;

    activeRefresh.current = currentSequence;
    lastRefreshStarted.current = Date.now();

    const stillCurrent = () =>
      currentSequence === refreshSequence.current;

    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (!stillCurrent()) return;

      if (authError &&
          sessionUser.current &&
          authError.name !== 'AuthSessionMissingError' &&
          authError.status !== 401 &&
          authError.status !== 403) {
        throw authError;
      }

      if (authError || !user) {
        sessionUser.current = null;
        clearWorkspace();
        setGate('login');
        return;
      }

      if (sessionUser.current !== null &&
          sessionUser.current !== user.id) {
        clearWorkspace();
        setGate('loading');
      }

      sessionUser.current = user.id;

      const { data, error: rpcError } =
        await vpDb.rpc('vp_my_context');

      if (!stillCurrent()) return;

      if (rpcError) throw rpcError;

      const profile = data as VpIdentity | null;

      if (!profile) {
        clearWorkspace();

        const {
          data: accountStatus,
          error: statusError
        } = await vpDb.rpc('vp_account_status');

        if (!stillCurrent()) return;

        if (statusError) throw statusError;

        setGate(accountStatus === 'unlinked'
          ? 'setup'
          : 'blocked');

        return;
      }

      const {
        data: firstLogin,
        error: setupError
      } = await vpDb.rpc('vp_first_login_required');

      if (!stillCurrent()) return;

      if (setupError) throw setupError;

      if (typeof firstLogin !== 'boolean') {
        throw new Error('Invalid password setup response');
      }

      setServerPasswordRequired(firstLogin);

      const meta = user.user_metadata ?? {};

      if (
        firstLogin === true ||
        (
          meta['vp_invited'] === true &&
          meta['vp_password_set'] !== true
        )
      ) {
        clearWorkspace();

        setIdentity(profile);
        setGate('password-setup');

        return;
      }

      const {
        data: granted,
        error: permissionsError
      } = await vpDb.rpc('vp_sec_my_capabilities');

      if (!stillCurrent()) return;

      if (permissionsError) {
        throw new Error(
          'Unable to verify role permissions: ' +
          permissionsError.message
        );
      }

      const permissions =
        normalizeGrantedPermissions(granted);

      // Reuse existing own-user branch allocations.
      // The database continues to enforce tenant scope.

      const {
        data: branches,
        error: branchError
      } = await vpDb.from('vp_user_branches')
        .select('branch_id::text')
        .eq('org_id', profile.org_id)
        .eq('user_id', profile.user_id);

      if (!stillCurrent()) return;

      if (branchError) {
        throw new Error(
          'Unable to verify branch allocations: ' +
          branchError.message
        );
      }

      const scope = workspaceAuthorizationKey(
        user.id,
        profile,
        permissions,
        branches
      );

      // Clear cached records only when the verified
      // authorization scope has actually changed.

      if (authorizationScope.current !== scope) {
        queryClient.clear();

        authorizationScope.current = scope;

        setWorkspaceEpoch(value => value + 1);
      }

      setIdentity(profile);
      setCapabilities(permissions);
      setGate('ready');

    } catch (failure) {
      if (!stillCurrent()) return;

      clearWorkspace();

      setError(
        failure instanceof Error
          ? failure.message
          : 'Unable to verify the session'
      );

      setGate('error');

    } finally {
      if (activeRefresh.current === currentSequence) {
        activeRefresh.current = 0;
      }
    }
  }

  useEffect(() => {
    let disposed = false;
    let channel: BroadcastChannel | null = null;

    const timers = new Set<
      ReturnType<typeof setTimeout>
    >();

    function deferRefresh() {
      const timer = setTimeout(() => {
        timers.delete(timer);

        if (!disposed) void refresh();
      }, 0);

      timers.add(timer);
    }

    function backgroundRefresh() {
      if (
        disposed ||
        document.visibilityState !== 'visible' ||
        !sessionUser.current ||
        !authorizationScope.current ||
        activeRefresh.current !== 0 ||
        Date.now() - lastRefreshStarted.current < 2000
      ) {
        return;
      }

      void refresh();
    }

    function handlePermissionChange() {
      if (disposed) return;

      // Broadcast a notification only.
      // Never broadcast credentials or permission data.

      try {
        channel?.postMessage('permissions-changed');
      } catch {
        // Foreground refresh remains available.
      }

      deferRefresh();
    }

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(
          'valuationpro-authorization'
        );

        channel.onmessage = event => {
          if (
            !disposed &&
            event.data === 'permissions-changed' &&
            sessionUser.current
          ) {
            deferRefresh();
          }
        };
      }
    } catch {
      channel = null;
    }

    window.addEventListener(
      'vp-permissions-changed',
      handlePermissionChange
    );

    window.addEventListener('focus', backgroundRefresh);
    window.addEventListener('online', backgroundRefresh);

    document.addEventListener(
      'visibilitychange',
      backgroundRefresh
    );

    const interval = window.setInterval(
      backgroundRefresh,
      60000
    );

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (disposed) return;

      if (event === 'SIGNED_OUT') {
        ++refreshSequence.current;

        activeRefresh.current = 0;
        sessionUser.current = null;

        clearWorkspace();
        setGate('login');

        return;
      }

      if (event === 'SIGNED_IN') {
        const incoming = session?.user.id;

        if (
          incoming &&
          sessionUser.current &&
          incoming !== sessionUser.current
        ) {
          ++refreshSequence.current;

          activeRefresh.current = 0;
          sessionUser.current = incoming;

          clearWorkspace();
          setGate('loading');
        }

        // Defer database requests outside the
        // Supabase authentication callback.

        deferRefresh();

      } else if (event === 'USER_UPDATED') {
        deferRefresh();
      }
    });

    void refresh();

    return () => {
      disposed = true;

      ++refreshSequence.current;
      activeRefresh.current = 0;

      subscription.unsubscribe();

      window.clearInterval(interval);

      for (const timer of timers) {
        clearTimeout(timer);
      }

      timers.clear();

      channel?.close();

      window.removeEventListener(
        'vp-permissions-changed',
        handlePermissionChange
      );

      window.removeEventListener('focus', backgroundRefresh);
      window.removeEventListener('online', backgroundRefresh);

      document.removeEventListener(
        'visibilitychange',
        backgroundRefresh
      );
    };
  }, []);

  // A deep link must not become the login URL or a future post-login redirect.
  // The authenticated home screen is always /; modules are selected afterwards.
  useEffect(() => {
    if (gate === 'login' && pathname !== '/') {
      void navigate({ to: '/', replace: true });
    }
  }, [gate, pathname, navigate]);

  async function submitLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (register) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setError('Check your email and confirm your account, then sign in.');
          setRegister(false);
        } else {
          await refresh();
          await navigate({ to: '/', replace: true });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        // Prevent data belonging to a previous login from appearing briefly.
        queryClient.clear();
        await refresh();
        await navigate({ to: '/', replace: true });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed');
    } finally { setBusy(false); }
  }

  async function createAgency(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { error: rpcError } = await vpDb.rpc('vp_register_agency', {
        p_code: code.trim().toUpperCase(), p_name: name.trim(),
      });
      if (rpcError) throw rpcError;
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Agency setup failed'); }
    finally { setBusy(false); }
  }

  async function completeInvitePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (invitePassword.length < 12 || !/[A-Za-z]/.test(invitePassword) || !/[0-9]/.test(invitePassword) || invitePassword !== confirmInvitePassword) {
      setError('Use a matching password of at least 12 characters containing letters and numbers'); return;
    }
    setBusy(true); setError('');
    try {
      if (serverPasswordRequired) {
        const { data, error: updateError } = await supabase.functions.invoke('vp-provision-users', {
          body: { action: 'set_password', password: invitePassword },
        });
        if (updateError) throw updateError;
        if (data?.error) throw new Error(data.error);
        setInvitePassword(''); setConfirmInvitePassword('');
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        queryClient.clear();
        await navigate({ to: '/', replace: true });
        setIdentity(null);
        setCapabilities([]);
        setNotice('Password updated. Please sign in using your new password.');
        setGate('login');
        return;
      } else {
        const { error: updateError } = await supabase.auth.updateUser({
          password: invitePassword, data: { vp_password_set: true },
        });
        if (updateError) throw updateError;
      }
      setInvitePassword(''); setConfirmInvitePassword('');
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Password update failed'); }
    finally { setBusy(false); }
  }

  async function signOut() {
    try {
      setError('');
      await vpSignOutToHome(queryClient);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign out failed');
    }
  }

  if (gate === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Verifying ValuationPro session…</div>;
  }
  if (gate === 'ready' && identity) {
    if (!mayOpenPath(pathname, capabilities)) {
      return <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-foreground"><h1 className="text-xl font-semibold">Access restricted</h1><p>This role has no permission to open this module. Ask the administrator to update its Role Matrix.</p><button className="rounded border px-3 py-2" onClick={signOut}>Sign out</button></main>;
    }
    return <AppProvider key={workspaceEpoch} identity={identity} capabilities={capabilities}>{children}</AppProvider>;
  }
  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-[#0f2542] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-center xl:px-20" aria-label="About ValuationPro">
        <div className="relative z-10 max-w-xl space-y-6"><div className="flex items-center gap-3"><Building2 className="size-8" aria-hidden="true"/><span className="text-xl font-semibold">ValuationPro</span></div>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Property valuation.<br/>One connected workspace.</h2>
          <p className="max-w-md text-base leading-relaxed text-slate-200">Manage case intake, site inspections, valuation workpapers and quality review in one platform.</p>
          <div className="grid gap-3 sm:grid-cols-3">{[{Icon:MapPinned,label:'Inspect'},{Icon:ClipboardCheck,label:'Review'},{Icon:FileText,label:'Report'}].map(({Icon,label})=><div key={label} className="rounded-xl border border-slate-500 bg-white/10 p-4"><Icon className="mb-3 size-6 text-blue-200" aria-hidden="true"/><p className="text-sm font-medium">{label}</p></div>)}</div>
        </div>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 600 400" className="pointer-events-none absolute bottom-0 right-0 w-full max-w-[650px] opacity-20" fill="none" stroke="#93c5fd" strokeWidth="1.5"><path d="M0 400 600 0M120 400 600 80M240 400 600 160M360 400 600 240M480 400 600 320M0 200 300 400M0 100 450 400M100 0 600 333"/><path d="M245 280V140l100-65 100 65v140M245 140l100 60 100-60M345 200v160M445 280l-100 80-100-80M290 168v140M400 168v140" strokeWidth="3"/></svg>
      </section>
      <main className="flex min-w-0 items-center justify-center p-4 sm:p-8"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-xl font-bold">ValuationPro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {gate === 'setup' ? 'Set up your valuation agency' : 'Secure workspace access'}
        </p>
        {gate === 'password-setup' ? (
          <form className="mt-6 space-y-4" onSubmit={completeInvitePassword}>
            <p className="text-sm">For account security, replace your temporary password before entering the workspace.</p>
            <label className="block text-sm">New password<input type="password" autoComplete="new-password" className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2" required minLength={12} value={invitePassword} onChange={(e)=>setInvitePassword(e.target.value)}/></label>
            <label className="block text-sm">Confirm password<input type="password" autoComplete="new-password" className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2" required minLength={12} value={confirmInvitePassword} onChange={(e)=>setConfirmInvitePassword(e.target.value)}/></label>
            <button disabled={busy} className="min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : 'Set password & continue'}</button>
            <button type="button" onClick={signOut} className="w-full text-sm underline">Sign out</button>
          </form>
        ) : gate === 'blocked' ? (
          <div className="mt-5 space-y-3 text-sm"><p>This user or organization is inactive. Contact your tenant administrator.</p><button className="rounded border px-3 py-2" onClick={signOut}>Sign out</button></div>
        ) : gate === 'setup' ? (
          <form className="mt-6 space-y-4" onSubmit={createAgency}>
            <label className="block text-sm">Agency legal name<input className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} maxLength={200}/></label>
            <label className="block text-sm">Agency code (2–6 letters)<input className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 uppercase" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0,6))} required pattern="[A-Z]{2,6}"/></label>
            <p className="text-xs text-muted-foreground">Your verified account becomes the Tenant Owner. Set up your agency before inviting staff.</p>
            <button disabled={busy} className="min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Creating…' : 'Create agency'}</button>
            <button type="button" className="w-full text-sm underline" onClick={signOut}>Sign out</button>
          </form>
        ) : gate !== 'error' ? (
          <form className="mt-6 space-y-4" onSubmit={submitLogin}>
            <label className="block text-sm">Email<input type="email" className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}/></label>
            <label className="block text-sm">Password<input type="password" className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2" autoComplete={register ? 'new-password' : 'current-password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}/></label>
            <button disabled={busy} className="min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50">{busy ? 'Working…' : register ? 'Create account' : 'Sign in'}</button>
            <button type="button" className="w-full text-sm underline" onClick={() => { setRegister((p) => !p); setError(''); }}>{register ? 'Already have an account? Sign in' : 'New agency? Create an account'}</button>
          </form>
        ) : <button className="mt-5 rounded border px-3 py-2" onClick={() => { setGate('loading'); void refresh(); }}>Retry</button>}
        {notice && <p className="mt-4 text-xs text-green-700">{notice}</p>}
        {error && <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">{error}</p>}
      </div></main>
    </div>
  );
}
