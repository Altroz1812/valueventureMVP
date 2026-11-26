import { ArrowRight, BookOpenCheck, FileText, Clock3, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { nextCaseSection, evidenceStatus, type CaseSection } from '@/lib/vp-workbench';
import type { VpCase } from '@/lib/vp-cases';
export function CaseContext({record,documentCount,loading,failed,onOpen}:{record:VpCase;documentCount:number|undefined;loading:boolean;failed:boolean;onOpen:(section:CaseSection)=>void}){
  const next=nextCaseSection(record.stage);
  return <section className="vp-context-panel mb-2" aria-label="Case guidance and evidence">
    <div className="min-w-0"><div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary"><BookOpenCheck className="size-[18px]" strokeWidth={1.65} aria-hidden="true"/>Workflow guidance</div><h2 className="text-base font-semibold">{next.label}</h2><p className="mt-1 text-sm text-muted-foreground">{next.detail}</p><Button variant="outline" className="mt-2 gap-2" onClick={()=>onOpen(next.section)}>Open section<ArrowRight className="size-4" aria-hidden="true"/></Button></div>
    <dl className="vp-case-meta grid min-w-0 gap-2 sm:grid-cols-3"><div className="flex gap-2"><FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true"/><div className="min-w-0"><dt className="text-xs text-muted-foreground">Documents</dt><dd className="break-words text-sm font-semibold">{evidenceStatus(documentCount,loading,failed)}</dd></div></div><div className="flex gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true"/><div className="min-w-0"><dt className="text-xs text-muted-foreground">Due date</dt><dd className="break-words text-sm font-semibold">{record.due||'Not recorded'}</dd></div></div><div className="flex gap-2"><UserRound className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true"/><div className="min-w-0"><dt className="text-xs text-muted-foreground">Assigned to</dt><dd className="break-words text-sm font-semibold">{record.assignedTo||'Unassigned'}</dd></div></div></dl>
    <p className="text-xs text-muted-foreground vp-guidance-note">Based on the recorded case stage and loaded document register. Not an AI assessment or approval.</p>
  </section>;
}
