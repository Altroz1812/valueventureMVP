import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VpOriginalPreview } from './vp-original-preview';
import { previewable } from '@/lib/vp-p27-evidence';
import { FileSearch, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/lib/app-context';
import { extractLocally, type LocalOcrLanguage } from '@/lib/vp-local-ocr';
import { findOcrSuggestions, type OcrResponse, type OcrSuggestion } from '@/lib/vp-ocr-candidates';
import { reviewOcrEvidence } from '@/lib/vp-p4-evidence-review';
import type { VpCaseDocument } from '@/lib/vp-cases';
import { getOcrHistory, saveOcrBatch, type SavedOcrBatch } from '@/lib/vp-p6-ocr-register';
import { savedOcrPreview } from '@/lib/vp-p7-ocr-visibility';
import { P21PropertyReview } from '@/components/documents/vp-p21-property-review';
import { verifyOcrReadback } from '@/lib/vp-p8-persistence-verification';

type Props = {
  document: VpCaseDocument;
  caseNum: number;
  canAccept?: boolean;
  propertyReview?: boolean;
  onAccept?: (field: string, value: string, source: string, detail: string) => void;
  existingValues?: Readonly<Record<string,string>>;
  onActivity?: (state:{busy:boolean;unsaved:boolean}) => void;
};

export function VpDocumentOcr({document, caseNum, canAccept = false, propertyReview = false, onAccept, existingValues,onActivity}: Props) {
  const {tenant} = useApp();
  const queryClient = useQueryClient();
  const [authorized, setAuthorized] = useState(false);
  const [engine,setEngine]=useState<'tesseract'|'paddle'>('tesseract');
  const [paddleToken,setPaddleToken]=useState('');
  const [savedBatchId,setSavedBatchId]=useState<string|null>(null);
  const [localOrigin,setLocalOrigin]=useState(false);
  useEffect(()=>{setLocalOrigin(window.location.protocol==='http:'&&['localhost','127.0.0.1'].includes(window.location.hostname));},[]);
  const [language, setLanguage] = useState<LocalOcrLanguage>('eng');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'verifying'|'saved'|'failed'>('idle');
  const [saveError, setSaveError] = useState('');
  const [unsavedResult, setUnsavedResult] = useState<OcrResponse | null>(null);
  const [unsavedLanguage, setUnsavedLanguage] = useState<LocalOcrLanguage>('eng');
  const [error, setError] = useState('');
  const [result, setResult] = useState<OcrResponse | null>(null);
  const [selectedPage, setSelectedPage] = useState('1');
  const [sourcePage,setSourcePage]=useState(1);
  const [propertyBusy,setPropertyBusy]=useState(false);
  const valid=previewable(document,tenant.id,caseNum);
  useEffect(()=>{onActivity?.({busy:loading||propertyBusy,unsaved:!!unsavedResult});},[onActivity,loading,propertyBusy,unsavedResult]);
  useEffect(()=>{if(!loading&&!unsavedResult&&!propertyBusy)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[loading,unsavedResult,propertyBusy]);
  function showSource(page:number){if(Number.isSafeInteger(page)&&page>0)setSourcePage(page);}
  const [filter, setFilter] = useState('');
  const [startPage, setStartPage] = useState('1');
  const history = useQuery({
    queryKey: ['vp-p6-ocr-history', tenant.id, caseNum, document.id],
    enabled: valid,
    queryFn: () => getOcrHistory(document.id, caseNum),
    staleTime: 5000,
    retry: false,
  });
  const displayedResult = useMemo(
    () => valid ? (result ?? (history.data?.[0] ? savedOcrPreview(history.data[0],document.name) : null)) : null,
    [valid,result,history.data,document.name],
  );
  const suggestions = useMemo(() => findOcrSuggestions(displayedResult?.pages ?? []), [displayedResult]);
  const activePage = displayedResult?.pages.find(p => String(p.page) === selectedPage) ?? displayedResult?.pages[0];

  async function persistAndVerify(parsed: OcrResponse, lang: LocalOcrLanguage) {
    const savedId=await saveOcrBatch(document.id,caseNum,parsed,lang);
    setSaveStatus('verifying');
    const rows=await getOcrHistory(document.id,caseNum);
    const check=verifyOcrReadback(savedId,document.id,caseNum,lang,parsed.pages,rows);
    if(!check.verified)throw new Error(`OCR save returned an ID but could not be verified: ${check.reason}`);
    queryClient.setQueryData(['vp-p6-ocr-history',tenant.id,caseNum,document.id],rows);
    return savedId;
  }

  async function start(requestedPage?: number) {
    if (!authorized || !valid || loading || propertyBusy) return;
    if(unsavedResult&&!window.confirm("Discard the unconfirmed local extraction and run a new batch?"))return;
    const page = requestedPage ?? Number(startPage);
    if (!Number.isInteger(page) || page < 1) { setError('Enter a valid PDF start page (1 or higher).'); return; }
    if(engine==='paddle'&&(!localOrigin||paddleToken.length<32)){setError('Start the localhost PaddleOCR service and enter its token.');return;}
    setLoading(true);
    setSavedBatchId(null);
    setResult(null);
    setUnsavedResult(null);
    setSaveStatus('idle');
    setSaveError('');
    setError('');
    try {
      const parsed = await extractLocally(document, caseNum, tenant.id, language, setProgress, page,engine==='paddle'?paddleToken:undefined);
      setStartPage(String(page));
      setResult(parsed);
      setSelectedPage(String(parsed.pages[0]?.page ?? 1));
      showSource(parsed.pages[0]?.page??1);
      // The signed-in user has explicitly opted into saving extracted text.
      // Never auto-apply candidates to case, inspection or valuation records.
      setSaveStatus('saving');
      try {
        setSavedBatchId(await persistAndVerify(parsed,language));
        setSaveStatus('saved');
      } catch (e) {
        setUnsavedResult(parsed);
        setUnsavedLanguage(language);
        setSaveStatus('failed');
        setSaveError(e instanceof Error ? e.message : 'OCR register failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Local OCR failed');
    } finally {
      setLoading(false);
      setProgress('');
    }
  }

  async function retrySave() {
    if (!authorized || !unsavedResult || loading || propertyBusy) return;
    setSaveStatus('saving'); setSaveError('');setLoading(true);
    try {
      setSavedBatchId(await persistAndVerify(unsavedResult,unsavedLanguage));
      setUnsavedResult(null); setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('failed');
      setSaveError(e instanceof Error ? e.message : 'OCR register failed');
    } finally {setLoading(false);}
  }

  function loadSaved(batch: SavedOcrBatch) {
    if(unsavedResult&&!window.confirm("Discard the unconfirmed local extraction and open a saved batch?"))return;
    setResult(savedOcrPreview(batch,document.name));
    setSavedBatchId(batch.id);
    setSelectedPage(String(batch.pages[0]?.page ?? 1));
    showSource(batch.pages[0]?.page??1);
    setSaveStatus('saved');
    setSaveError('');
    setUnsavedResult(null);
  }

  function accept(item: OcrSuggestion) {
    if (!onAccept || !canAccept || !existingValues || loading || !valid) return;
    const review = reviewOcrEvidence(item, existingValues);
    if (!review.canAccept) return;
    const current = existingValues[item.field]?.trim() ?? '';
    if (!window.confirm(`Verify against the original document before accepting:\n${item.label}: ${item.value}${item.source_unit ? ' ' + item.source_unit : ''}\nSource: page ${item.page}\n${current ? 'Current value: ' + current + '\n' : ''}${review.status === 'conflict' ? 'This will REPLACE the existing value.\n' : ''}\nHave you checked the original document and confirmed the value?`)) return;
    onAccept(item.field, item.value,
      `Document ${document.id}: ${document.name} · OCR page ${item.page}`,
      `Human-confirmed local OCR suggestion${item.source_unit ? '; source unit: ' + item.source_unit : ''}; source line: ${item.source_line.slice(0, 160)}`);
  }

  if(!valid)return <p role="status" className="rounded border p-3 text-sm text-muted-foreground">No supported registered private document in this case scope.</p>;
  return <div className="vp-evidence-pane"><div className="vp-evidence-split"><VpOriginalPreview key={`${tenant.id}:${caseNum}:${document.id}:${document.storage_path}`} document={document} caseNum={caseNum} page={sourcePage} onPage={setSourcePage} /><Card>
    <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><FileSearch className="size-4"/> Extraction & evidence review</CardTitle></CardHeader>
    <CardContent className="space-y-3 text-sm">
      <details className="rounded border p-2"><summary className="cursor-pointer text-sm font-medium">Extraction settings</summary><p className="my-2 text-xs text-muted-foreground">PDF text is read directly; scanned pages/JPEG/PNG use Tesseract.js or optional localhost PaddleOCR (5 PDF pages per batch). PaddleOCR sends image bytes only to the local service, not a cloud OCR endpoint. After you authorize local OCR, extracted text and suggestions are saved to the tenant's private review register. Existing saved batches display automatically below; viewing them does not accept any field. No paid OCR API.</p>
      <div className="flex items-start gap-2 rounded border p-3">
        <Checkbox id={`ocr-authorized-${document.id}`} checked={authorized} onCheckedChange={v => setAuthorized(v === true)} disabled={loading||propertyBusy}/>
        <Label htmlFor={`ocr-authorized-${document.id}`} className="cursor-pointer font-normal leading-5">I am authorized to run NEW local OCR processing of this document and to save its unverified text/suggestions to this tenant's private register. Existing saved batches may be viewed without running OCR again.</Label>
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <div><Label>OCR engine</Label><Select value={engine} onValueChange={v=>{setEngine(v==='paddle'?'paddle':'tesseract');setAuthorized(false);setPaddleToken('');}} disabled={loading||propertyBusy}><SelectTrigger className="w-44 max-w-full" aria-label="Extraction setting"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="tesseract">Tesseract (browser)</SelectItem><SelectItem value="paddle" disabled={!localOrigin}>PaddleOCR (localhost)</SelectItem></SelectContent></Select></div>
        {engine==='paddle'&&<div><Label>Local service token</Label><Input type="password" autoComplete="off" value={paddleToken} onChange={e=>setPaddleToken(e.target.value)} disabled={loading||propertyBusy} placeholder="VP_OCR_TOKEN"/></div>}
        <div><Label>OCR language</Label><Select value={language} onValueChange={v => { setLanguage(v as LocalOcrLanguage); }} disabled={loading||propertyBusy}>
          <SelectTrigger className="w-44 max-w-full" aria-label="Extraction setting"><SelectValue/></SelectTrigger><SelectContent>
            <SelectItem value="eng">English</SelectItem><SelectItem value="hin">Hindi</SelectItem><SelectItem value="tel">Telugu</SelectItem>
          </SelectContent></Select></div>
        {document.mime === 'application/pdf' && <div><Label htmlFor={`p4-start-${document.id}`}>PDF start page (5/run)</Label><Input id={`p4-start-${document.id}`} type="number" min={1} className="w-36" value={startPage} onChange={e => setStartPage(e.target.value)} disabled={loading||propertyBusy}/></div>}
        <Button size="sm" type="button" disabled={!authorized || !valid || loading || propertyBusy || (engine==='paddle'&&(!localOrigin||paddleToken.length<32))} onClick={() => void start()}>
          {loading ? 'Reading locally…' : displayedResult ? 'Run local OCR again' : 'Extract locally (free)'}
        </Button>
      </div>
      </details>
      {!valid && <p className="text-amber-700">This legacy document has no registered private storage file.</p>}
      {loading && <p role="status" className="text-muted-foreground">{progress}</p>}
      {error && <p role="alert" className="text-destructive">Local OCR error: {error}. The file and inspection were not changed.</p>}
      {saveStatus === 'saving' && <p role="status" className="text-xs">Saving unverified OCR pages and mappings to Supabase…</p>}
      {saveStatus === 'verifying' && <p role="status" className="text-xs">Verifying saved OCR pages against Supabase history…</p>}
      {saveStatus === 'saved' && <p role="status" className="text-xs text-green-700">OCR extraction saved and verified in Supabase history. Field values were NOT changed.</p>}
      {saveStatus === 'failed' && <div className="rounded border border-amber-400 p-2 text-xs"><p role="alert">OCR recognition succeeded, but storage or read-back verification was not confirmed: {saveError}. Do not assume it is unsaved or saved; retry verification/saving (request IDs are idempotent). Official inspection values remain unchanged.</p><Button size="sm" variant="outline" disabled={loading||propertyBusy} onClick={()=>void retrySave()}>Retry saving / verifying OCR</Button></div>}
      <details className="space-y-2 rounded border p-2 text-xs">
        <summary className="cursor-pointer text-sm font-medium">Saved extractions ({history.data?.length??0})</summary>
        {history.isLoading && <p>Loading saved extractions…</p>}
        {history.error && <p className="text-destructive">Cannot load saved OCR: {history.error.message}</p>}
        {history.data?.length === 0 && <p>No saved extractions for this document yet. Run local OCR and verify that the Supabase save status says saved.</p>}
        {(history.data?.length ?? 0) > 0 && !result && <p role="status" className="text-green-700">Showing the newest saved batch automatically. These values have not been accepted into any official field.</p>}
        {history.data?.map(batch => <div key={batch.id} className="flex items-center justify-between gap-2 border-t pt-2">
          <span>{new Date(batch.created_at).toLocaleString('en-IN')} · {batch.pages.map(p=>p.page).join(', ')} page(s) · {batch.candidates.length} mapped suggestion(s)</span>
          <Button size="sm" variant="outline" disabled={propertyBusy||loading||saveStatus==='saving'||saveStatus==='verifying'} onClick={()=>loadSaved(batch)}>Review saved OCR</Button>
        </div>)}
      </details>
      {history.error&&<p role="alert" className="text-xs text-destructive">Saved extractions unavailable: {history.error.message}</p>}
      {history.isLoading&&<p role="status" className="text-xs">Loading extraction history…</p>}
      {!displayedResult&&!history.isLoading&&!history.error&&<p className="text-sm text-muted-foreground">No extraction to review. Open Extraction settings to authorize and run local OCR.</p>}
      {displayedResult && <>
        <div role="status" className="flex items-center gap-2 text-xs"><ShieldAlert className="size-4"/> {displayedResult.pages.length} OCR page(s) available for review{displayedResult.pdf_page_count ? ` of ${displayedResult.pdf_page_count} PDF pages` : ''}. OCR text is not verified evidence.</div>
        {displayedResult.next_pdf_page != null && <Button size="sm" variant="outline" disabled={!authorized || loading || propertyBusy} onClick={() => void start(displayedResult.next_pdf_page ?? undefined)}>Process next batch (page {displayedResult.next_pdf_page})</Button>}
        {displayedResult.pages.some(p => p.truncated) && <p className="text-amber-700">Long OCR output was truncated in preview. Check the original document.</p>}
        {displayedResult.pages.every(p=>!p.text.trim()) && <p className="text-amber-700">No readable text detected. Try a clearer scan or manual transcription.</p>}
        {displayedResult.pages.length > 0 && <>
          <div className="flex flex-wrap gap-2 items-end">
            <div><Label>Source page</Label><Select value={String(activePage?.page ?? 1)} onValueChange={v=>{setSelectedPage(v);showSource(Number(v));}}>
              <SelectTrigger className="w-32" aria-label="Extracted source page"><SelectValue/></SelectTrigger><SelectContent>{displayedResult.pages.map(p => <SelectItem key={p.page} value={String(p.page)}>Page {p.page} · {p.engine??'legacy / unknown'}</SelectItem>)}</SelectContent>
            </Select></div>
            <div className="min-w-0 flex-1"><Label>Search OCR preview</Label><Input aria-label="Search extracted text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Find owner, address, area…"/></div>
          </div>
          <details className="rounded border p-2"><summary className="cursor-pointer text-sm font-medium">Extracted text · page {activePage?.page??1}</summary><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded border bg-muted/30 p-3 text-xs">{activePage?.text.split('\n').filter(line => !filter || line.toLocaleLowerCase().includes(filter.toLocaleLowerCase())).join('\n') || (filter ? 'No matching text on this page' : 'No recognized text')}</pre></details>
        </>}
        {propertyReview&&!loading&&<P21PropertyReview onSourcePage={showSource} onBusy={setPropertyBusy} key={`${document.id}:${result?result.request_id:history.data?.[0]?.id??'none'}:${savedBatchId??''}`} num={caseNum} documentId={document.id} batchId={result?savedBatchId:history.data?.[0]?.id??null} pages={displayedResult.pages}/>}
        <div className="space-y-2"><b>Proposed inspection-field mappings — NOT applied automatically</b>
          {suggestions.length === 0 && <p className="text-muted-foreground">No safely labelled field suggestions found. Review OCR text and use manual source entry.</p>}
          {suggestions.map((candidate, i) => {
            const review = existingValues ? reviewOcrEvidence(candidate, existingValues) : null;
            return <div className="flex flex-wrap items-start gap-2 rounded border p-2" key={`${candidate.field}-${candidate.page}-${i}`}>
              <div className="min-w-0 flex-1 break-words"><b>{candidate.label}:</b> {candidate.value}{candidate.source_unit ? ` ${candidate.source_unit}` : ''}
                <p className="text-xs text-muted-foreground">Page {candidate.page} · {candidate.source_line}</p>
                {existingValues&&<p className="text-xs">Recorded inspection: {existingValues[candidate.field]?.trim()||'Not recorded'}</p>}
                {review && <p className={review.canAccept ? 'text-xs text-muted-foreground' : 'text-xs text-amber-700'}>Review: {review.status} — {review.detail}</p>}
              </div>
              <Button size="sm" variant="ghost" onClick={()=>showSource(candidate.page)}>Page {candidate.page}</Button>
              {onAccept && <Button variant="outline" size="sm" disabled={!valid || loading || !canAccept || !review?.canAccept} onClick={() => accept(candidate)}>{review?.status === 'conflict' ? 'Review replacement' : 'Review & accept'}</Button>}
            </div>;
          })}
        </div>
      </>}
    </CardContent>
  </Card></div></div>;
}
