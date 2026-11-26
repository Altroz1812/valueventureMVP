import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/lib/app-context';
import { vpDb } from '@/lib/vp-db';
import { classifyReadRpcProbe } from '@/lib/vp-p5-rpc-diagnostics';
import type { ValuationInput } from '@/lib/valuation';
import {
  proposeReviewedTransfer,
  type SelectedTransfer,
  type InspectionMeasureData,
} from '@/lib/vp-inspection-valuation-transfer';

export type PendingInspectionTransfer = {
  visitId: string;
  updatedAt: string;
  selection: SelectedTransfer;
};

type LinkedInspection = {
  visit_id: number | string;
  updated_at: string;
  submitted_at: string;
  data: Record<string, string | null>;
};

const floorNames = [
  'Stilt / basement', 'Ground', 'First', 'Second', 'Third', 'Fourth',
];

const validPositive = (s: string | null | undefined) =>
  s != null && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(s.trim()) && Number(s) > 0;

export function VpInspectionValuationReview({
  caseNum,
  canEdit,
  pending,
  onApply,
}: {
  caseNum: number;
  canEdit: boolean;
  pending: PendingInspectionTransfer | null;
  onApply: (patch: Partial<ValuationInput>, transfer: PendingInspectionTransfer) => void;
}) {
  const {tenant} = useApp();
  const [rectangular, setRectangular] = useState(false);
  const [transferAge, setTransferAge] = useState(false);
  const [floors, setFloors] = useState<string[]>([]);
  const query = useQuery({
    queryKey: ['vp-p2-valuation-inspection', tenant.id, caseNum],
    enabled: caseNum > 0,
    queryFn: async (): Promise<LinkedInspection | null> => {
      const {data, error} = await vpDb.rpc('vp_p2_valuer_inspection_for_case', {p_case_num: caseNum});
      if (error) throw error;
      return (data ?? null) as LinkedInspection | null;
    },
    staleTime: 0,
  });
  const history = useQuery({
    queryKey: ['vp-p2-transfer-history', tenant.id, caseNum],
    enabled: caseNum > 0,
    queryFn: async (): Promise<Array<{visit_id: string | number;created_at: string;actor_user_id: number | string;selection: SelectedTransfer;submitted: boolean}>> => {
      const {data,error} = await vpDb.rpc('vp_p2_transfer_history',{p_case_num:caseNum});
      if(error) throw error;
      return (data??[]) as Array<{visit_id:string|number;created_at:string;actor_user_id:number|string;selection:SelectedTransfer;submitted:boolean}>;
    },
  });
  const sourceDiagnostic = query.error ? classifyReadRpcProbe(query.error) : null;
  const historyDiagnostic = history.error ? classifyReadRpcProbe(history.error) : null;
  const source: InspectionMeasureData = Object.fromEntries(
    Object.entries(query.data?.data ?? {}).map(([key, value]) => [key, value ?? ''])
  );
  const selection: SelectedTransfer = {
    ...(rectangular ? {landAreaSqYd: {rectangular_confirmed: true as const}} : {}),
    ...(floors.length ? {builtUpSqFt: {floors}} : {}),
    ...(transferAge ? {ageYears: true as const} : {}),
  };
  const result = useMemo(() => {
    try {
      return {proposals: proposeReviewedTransfer(source, selection), error: ''};
    } catch (error) {
      return {proposals: [], error: error instanceof Error ? error.message : String(error)};
    }
  }, [query.data, rectangular, floors, transferAge]);

  function apply() {
    if (!query.data || !canEdit || result.error || !result.proposals.length) return;
    const patch: Partial<ValuationInput> = {};
    for (const item of result.proposals) patch[item.field] = item.value;
    onApply(patch, {
      visitId: String(query.data.visit_id),
      updatedAt: query.data.updated_at,
      selection,
    });
  }

  return <Card className="sm:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-sm">
        <ClipboardCheck className="size-4" /> P2 — Review submitted inspection measurements
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm">
      <p className="text-xs text-muted-foreground">
        Only a Field-QC-approved submitted inspection is eligible. This panel proposes measurements, not market rates.
        Selected values are applied to the unsaved valuation form; the server validates them again when you save.
      </p>
      {query.isLoading && <p>Loading submitted inspection measurements…</p>}
      {sourceDiagnostic && <div role="alert" className="rounded border border-destructive/30 p-3 text-sm">
        <p className="font-semibold text-destructive">P2 inspection integration: {sourceDiagnostic.label}</p>
        <p className="mt-1">{sourceDiagnostic.guidance}</p>
        <p className="mt-1 text-xs text-muted-foreground">Original error: {query.error?.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">No valuation or inspection data was changed.</p>
      </div>}
      {!query.isLoading && !query.error && !query.data && <p>No submitted and Field-QC-approved inspection is available for this case.</p>}
      {query.data && <>
        <p className="text-xs text-muted-foreground">Source: visit #{query.data.visit_id}, submitted {query.data.submitted_at}, revision {query.data.updated_at}</p>
        <label className="flex gap-3 rounded border p-3">
          <Checkbox checked={rectangular} disabled={!canEdit || !validPositive(source['land_length']) || !validPositive(source['land_breadth'])} onCheckedChange={v=>setRectangular(v===true)} />
          <span><b>Land area</b>: {source['land_length'] || '—'} × {source['land_breadth'] || '—'} {source['measurement_unit'] || 'units not supplied'}.
            I confirmed the land has a regular rectangular shape and the measurements are suitable for valuation.
            <span className="block text-xs text-amber-700">Inspection note: {source['land_dimensions_note'] || 'None'} — check any irregularity before confirming.</span>
          </span>
        </label>
        <div className="rounded border p-3">
          <p className="mb-2 font-semibold">Built-up area — select only chargeable/eligible floors verified for this valuation</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {floorNames.map((label, index) => {
              const key = `floor_area_${index}`;
              const checked = floors.includes(key);
              return <label key={key} className="flex gap-2 text-sm">
                <Checkbox checked={checked} disabled={!canEdit || !validPositive(source[key])}
                  onCheckedChange={value=>setFloors(old=>value===true ? [...old, key] : old.filter(x=>x!==key))} />
                <span>{label}: {source[key] || 'No measurement'} sq.ft</span>
              </label>;
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Stilt/basement is never included automatically. The selected sum is a suggestion, not certification of built-up area.</p>
        </div>
        <label className="flex gap-3 rounded border p-3">
          <Checkbox checked={transferAge} disabled={!canEdit || source['property_age'] == null || !/^\d+(?:\.\d+)?$/.test(source['property_age']!)}
            onCheckedChange={v=>setTransferAge(v===true)} />
          <span>Use inspected building age: {source['property_age'] || 'Not recorded'} years</span>
        </label>
        {result.error && <p role="alert" className="text-destructive">{result.error}</p>}
        {result.proposals.length>0 && <div className="rounded border p-3 space-y-2">
          <b>Proposed changes (nothing saved yet)</b>
          {result.proposals.map(p=><div key={p.field} className="border-t pt-2"><b>{p.label}: {p.value}</b><p className="text-xs text-muted-foreground">{p.explanation}</p></div>)}
        </div>}
        {pending?.visitId===String(query.data.visit_id) && <p role="status" className="text-amber-700">Reviewed values are in your local draft. Click Save Draft or Submit valuation to persist them with a provenance audit. Any manual field edit clears this pending transfer.</p>}
        <Button size="sm" disabled={!canEdit || !!result.error || result.proposals.length===0 || query.isFetching} onClick={apply}>Apply reviewed values to draft</Button>
      </>}
      <div className="rounded border p-3">
        <b>Reviewed transfer audit history</b>
        {historyDiagnostic && <p role="alert" className="text-xs text-destructive">
          P2 history: {historyDiagnostic.label}. {historyDiagnostic.guidance}
        </p>}
        {!history.isLoading&&!history.error&&!history.data?.length&&<p className="text-xs text-muted-foreground">No reviewed transfers saved for this case.</p>}
        {(history.data??[]).map((event,index)=><p key={`${event.created_at}-${index}`} className="border-t py-2 text-xs">
          {event.created_at} · Visit #{event.visit_id} · Application user #{event.actor_user_id} · {event.submitted?'Submitted':'Draft'} · Fields: {Object.keys(event.selection).join(', ')}
        </p>)}
      </div>
      {!canEdit && <p className="text-xs text-muted-foreground">Only authorized users at Report Draft can apply these values. Other stages are read-only.</p>}
    </CardContent>
  </Card>;
}
