/** P7: classify read-only inspection-access errors without calling write RPCs. */
export type InspectionReadinessState = 'available' | 'missing' | 'restricted' | 'visit-denied' | 'other-error';
export type InspectionReadiness = {state: InspectionReadinessState; message: string; action: string};

export function inspectionReadiness(error: unknown): InspectionReadiness {
  if (!error) return {
    state: 'available', message: 'Inspection access RPC responded.',
    action: 'Inspect the returned edit/submission permission flags before enabling controls.',
  };
  const e = (error && typeof error === 'object') ? error as {code?: unknown; message?: unknown} : null;
  const code = typeof e?.code === 'string' ? e.code : '';
  const message = typeof e?.message === 'string' ? e.message : String(error ?? 'Unknown error');
  if (code === 'PGRST202' || /could not find the function.*schema cache/i.test(message)) return {
    state: 'missing', message: 'P0 inspection-access function is not available to the API.',
    action: 'Run sql/p7/00_BACKEND_READINESS_READONLY.sql in your actual Supabase project. If missing, review and install P0, then P1, in staging first; refresh the PostgREST schema cache.',
  };
  if (code === '42501' || /permission denied|jwt expired|not authenticated|not authorized/i.test(message)) return {
    state: 'restricted', message: 'Inspection access was denied.',
    action: 'Verify the signed-in user, authenticated EXECUTE grant, organization and role assignment. Do not bypass server permissions or disable RLS.',
  };
  if (/visit not found|visit view permission denied|not found in your organization/i.test(message)) return {
    state: 'visit-denied', message: 'The visit is not available to this user.',
    action: 'Verify visit assignment and tenant membership. Do not grant access solely to make the screen editable.',
  };
  return {
    state: 'other-error', message: 'Inspection access check failed.',
    action: `Review the Supabase API logs. ${code ? `Code ${code}. ` : ''}${message.slice(0, 350)}`,
  };
}
