import { Check } from 'lucide-react';
import { STAGES } from '@/lib/ops';
import type { CaseRow } from '@/lib/data';
import { cn } from '@/lib/utils';
const labels=['Intake','Intake QC','Field visit','Field QC','Valuation','Final QC','Approved','Delivered'];
export function CaseProgress({stage,dbStage}:{stage:CaseRow['stage'];dbStage:string}){
  const index=STAGES.indexOf(stage);
  return <section className="vp-workflow-rail mb-2" aria-label="Case workflow">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">Case lifecycle</h2><span className="text-sm text-muted-foreground">{index>=0?`Stage ${index+1} of ${STAGES.length}`:'Unmapped stage'} · <strong className="text-foreground">{index===-1?dbStage:stage}</strong></span></div>
    <ol className="vp-stage-grid">{STAGES.map((s,i)=><li key={s} aria-current={i===index?'step':undefined} className="min-w-0"><div className="mb-1 flex items-center gap-1.5"><span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',i===index?'border-primary bg-primary text-primary-foreground':i<index?'border-success/40 bg-success/10 text-success':'border-input bg-muted text-muted-foreground')}>{i<index?<Check strokeWidth={1.8} className="size-4" aria-hidden="true"/>:i+1}</span><span className={cn('h-px flex-1',i<index?'bg-success/50':'bg-border')} aria-hidden="true"/></div><p className={cn('text-sm font-medium leading-snug',i===index&&'text-primary')}>{labels[i]}</p><p className="text-xs text-muted-foreground">{index<0?'Unknown':i===index?'Current':i<index?'Earlier stage':'Not reached'}</p></li>)}</ol>
  </section>;
}
