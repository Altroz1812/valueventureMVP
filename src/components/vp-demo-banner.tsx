import { useQuery } from '@tanstack/react-query';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import { vpDb } from '@/lib/vp-db';
import { workspaceMode } from '@/lib/vp-demo-mode';

export function VpDemoBanner({ orgId }: { orgId: string }) {
  const status = useQuery({
    queryKey: ['vp-demo-mode', orgId],
    enabled: Boolean(orgId),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await vpDb.from('orgs').select('demo').eq('id', orgId).single();
      if (error) throw error;
      const value: unknown = data?.['demo'];
      if (typeof value !== 'boolean') throw new Error('Workspace mode is unavailable');
      return value;
    },
  });
  const mode = status.isError ? 'unknown' : workspaceMode(status.data);
  if (mode === 'live') return null;
  if (mode === 'unknown') return (
    <aside role="status" className="mb-3 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">{status.isPending ? 'Verifying workspace mode...' : 'Workspace mode could not be verified.'}</div>
      {status.isError && <button type="button" className="underline" onClick={() => void status.refetch()}>Retry</button>}
    </aside>
  );
  return (
    <aside role="status" aria-label="Demonstration workspace" className="mb-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-950">
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div><p className="text-[11px] font-bold uppercase tracking-wide">Demonstration workspace</p><p className="text-xs">Training and synthetic data only. Not for lending or official valuation use.</p></div>
    </aside>
  );
}
