
import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vpDb } from '@/lib/vp-db';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  adoptionSelectionKey, errorMessage, integer, parseOfficial, record, safeId
} from '@/lib/vp-official-valuation';

export function useVpOfficialSummary(
  orgId: string,
  num: number,
  enabled: boolean
) {
  return useQuery({
    queryKey: ['vp-official-valuation', orgId, num],
    enabled: enabled && Number.isSafeInteger(num) && num > 0,
    staleTime: 0,
    retry: false,
    queryFn: async () => {
      const { data, error } = await vpDb.rpc(
        'vp_p23_summary', { p_num: num }
      );
      if (error) throw error;
      return parseOfficial(data);
    }
  });
}

type Props = {
  orgId: string;
  num: number;
  bank: string;
  category: string;
  summary: ReturnType<typeof useVpOfficialSummary>;
  canRead: boolean;
  canAdopt: boolean;
  onBusy: (busy: boolean) => void;
};

function money(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      }).format(value)
    : 'Not available';
}

async function eligibleWorkpapers(
  orgId: string, num: number, bank: string, category: string
) {
  const latest = await vpDb.from('vp_p19_analyses')
    .select('version_no')
    .eq('org_id', orgId)
    .eq('num', num)
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest.error) throw latest.error;
  if (!latest.data) return { analysis: 0, exports: [] };

  const analysis = integer(record(latest.data)['version_no'], 1);

  const review = await vpDb.from('vp_p19_reviews')
    .select('decision')
    .eq('org_id', orgId)
    .eq('num', num)
    .eq('version_no', analysis)
    .maybeSingle();

  if (review.error) throw review.error;

  if (!review.data || record(review.data)['decision'] !== 'Reviewed') {
    return { analysis, exports: [] };
  }

  const templates = await vpDb.from('vp_p20_templates')
    .select('id')
    .eq('org_id', orgId)
    .eq('bank_name', bank)
    .eq('category', category)
    .order('id', { ascending: false })
    .limit(100);

  if (templates.error) throw templates.error;

  const ids = (templates.data ?? []).map(
    item => safeId(record(item)['id'])
  );

  if (!ids.length) return { analysis, exports: [] };

  const exports = await vpDb.from('vp_p20_exports')
    .select('id,prepared_at')
    .eq('org_id', orgId)
    .eq('num', num)
    .eq('analysis_version', analysis)
    .in('template_id', ids)
    .order('id', { ascending: false })
    .limit(50);

  if (exports.error) throw exports.error;

  return {
    analysis,
    exports: (exports.data ?? []).map(item => ({
      id: safeId(record(item)['id']),
      preparedAt: String(record(item)['prepared_at'] ?? '')
    }))
  };
}

export function VpOfficialValuation({
  orgId, num, bank, category, summary,
  canRead, canAdopt, onBusy
}: Props) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState('');
  const [reason, setReason] = useState('');
  const [acknowledged, setAcknowledged] = useState<string | null>(null);
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);

  const eligible = useQuery({
    queryKey: ['vp-adoption-workpapers', orgId, num, bank, category],
    enabled: canAdopt && summary.isSuccess,
    retry: false,
    staleTime: 0,
    queryFn: () => eligibleWorkpapers(orgId, num, bank, category)
  });

  const official =
    summary.isSuccess && !summary.isPlaceholderData
      ? summary.data
      : undefined;
  const chosen = eligible.data?.exports.find(x => x.id === selected);

  const selectionKey =
    official && chosen && eligible.data
      ? adoptionSelectionKey(
          official.version,
          eligible.data.analysis,
          chosen.id
        )
      : null;

  const ready =
    canAdopt &&
    summary.isSuccess &&
    !summary.isFetching &&
    !!official &&
    eligible.isSuccess &&
    !eligible.isFetching &&
    !!chosen &&
    selectionKey !== null &&
    acknowledged === selectionKey &&
    reason.trim().length >= 5 &&
    reason.trim().length <= 1000 &&
    !saving;

  async function adopt() {
    if (!ready || !official || !chosen || !eligible.data || busy.current) {
      return;
    }

    busy.current = true;
    setSaving(true);
    onBusy(true);

    let committed = false;

    try {
      const { data, error } = await vpDb.rpc('vp_p23_adopt', {
        p_num: num,
        p_analysis: eligible.data.analysis,
        p_export: chosen.id,
        p_expected: official.version,
        p_reason: reason.trim()
      });

      if (error) throw error;
      committed = true;

      const version = integer(data, 1);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['vp-valuation-form', orgId, num]
        }),
        queryClient.invalidateQueries({
          queryKey: ['vp-valuation-versions', orgId, num]
        }),
        queryClient.invalidateQueries({
          queryKey: ['vp-case-log', orgId]
        })
      ]);

      const checked = await summary.refetch();

      if (checked.isError ||
          checked.data?.version !== version ||
          checked.data?.advanced !== true ||
          checked.data?.adoption?.analysisVersion !== eligible.data.analysis ||
          checked.data?.adoption?.exportId !== chosen.id) {
        throw new Error('Official valuation readback could not be verified');
      }

      setReason('');
      setSelected('');
      setAcknowledged(null);

      toast.success(
        'Official valuation v' + version + ' adopted. Final QC required.'
      );
    } catch (error) {
      toast.error(committed
        ? 'Adoption was recorded but readback failed. Reload before retrying.'
        : errorMessage(error));
      await summary.refetch();
      await eligible.refetch();
    } finally {
      busy.current = false;
      setSaving(false);
      onBusy(false);
    }
  }

  if (!canRead) return null;

  return (
    <Card className="min-w-0 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm">
          Official valuation and adoption
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {summary.isLoading && <p>Loading official valuation...</p>}

        {summary.isError && (
          <p role="alert" className="text-destructive">
            {errorMessage(summary.error)}. Legacy editing remains locked.
          </p>
        )}

        {official && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium">
                {official.version
                  ? 'Official version ' + official.version
                  : 'No official valuation submitted'}
              </span>
              {official.method && <span>{official.method}</span>}
              {official.status && <span>{official.status}</span>}
            </div>

            {official.version > 0 && (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Market value', 'marketValue'],
                  ['Realizable value', 'realizableValue'],
                  ['Distress value', 'distressValue'],
                  ['Guideline value', 'guidelineValue']
                ].map(([label, field]) => (
                  <div key={field} className="rounded-md border p-3">
                    <p className="text-xs text-muted-foreground">
                      {label}
                    </p>
                    <p className="font-semibold">
                      {money(official.results[field!])}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {official.adoption && (
              <div className="space-y-1 rounded-md border p-3">
                <p>
                  Adopted analysis v{official.adoption.analysisVersion}
                  {' / Workpaper '}{official.adoption.exportId}
                </p>
                <p>{official.adoption.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Legacy valuation editing is locked. Report release
                  remains subject to Final QC and existing server checks.
                </p>
              </div>
            )}
          </>
        )}

        {(canAdopt || saving) && official && (
          <div className="space-y-3 border-t pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">Adopt reviewed valuation</span>
              <Button
                size="sm"
                variant="outline"
                disabled={saving || eligible.isFetching || summary.isFetching}
                onClick={() => {
                  setSelected('');
                  setAcknowledged(null);
                  void Promise.all([
                    eligible.refetch(), summary.refetch()
                  ]);
                }}
              >
                Refresh eligible workpapers
              </Button>
            </div>

            {eligible.isError && (
              <p role="alert" className="text-destructive">
                {errorMessage(eligible.error)}
              </p>
            )}

            {eligible.isFetching && <p>Checking reviewed workpapers...</p>}

            {eligible.isSuccess &&
             eligible.data.exports.length === 0 && (
              <p className="text-muted-foreground">
                Complete the independent review of the latest analysis
                and prepare a matching P20 bank workpaper first.
              </p>
            )}

            <label className="block space-y-1">
              <span>Registered bank workpaper</span>
              <select
                className="w-full rounded-md border bg-background p-2"
                value={selected}
                disabled={saving || eligible.isFetching}
                onChange={e => {
                  setSelected(e.target.value);
                  setAcknowledged(null);
                }}
              >
                <option value="">Select reviewed workpaper</option>
                {(eligible.data?.exports ?? []).map(item => (
                  <option key={item.id} value={item.id}>
                    Analysis v{eligible.data?.analysis}
                    {' / Workpaper '}{item.id}
                    {' / '}{item.preparedAt}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1">
              <span>Adoption reason</span>
              <textarea
                className="w-full rounded-md border bg-background p-2"
                rows={3}
                maxLength={1000}
                disabled={saving}
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={selectionKey !== null && acknowledged === selectionKey}
                disabled={saving}
                onChange={e => setAcknowledged(e.target.checked ? selectionKey : null)}
              />
              <span>
                Adopt the selected reviewed calculation as the official
                valuation. This does not approve or release the report.
              </span>
            </label>

            <Button disabled={!ready} onClick={() => void adopt()}>
              {saving ? 'Adopting...' : 'Adopt official valuation'}
            </Button>

            <p className="text-xs text-muted-foreground">
              Latest 50 matching workpapers from up to 100 bank templates.
              PostgreSQL independently checks evidence, case stage,
              authorization and version consistency.
            </p>
          </div>
        )}

        {!canAdopt && !saving && (
          <p className="text-xs text-muted-foreground">
            Adoption requires Report Draft stage and valuation edit permission.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
