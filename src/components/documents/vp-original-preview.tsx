import {useEffect,useRef,useState} from 'react';
import {FileText, ChevronLeft, ChevronRight, ExternalLink} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useApp} from '@/lib/app-context';
import {vpDb} from '@/lib/vp-db';
import {DOC_BUCKET,openVpDocument,type VpCaseDocument} from '@/lib/vp-cases';
import {previewable} from '@/lib/vp-p27-evidence';
import {toast} from 'sonner';
const maxBytes=10*1024*1024;
function ImagePreview({blob,name}:{blob:Blob;name:string}){
 const [url,setUrl]=useState('');const [failed,setFailed]=useState(false);
 useEffect(()=>{const u=URL.createObjectURL(blob);setUrl(u);setFailed(false);return()=>URL.revokeObjectURL(u);},[blob]);
 return failed?<p role="alert" className="p-3 text-sm text-destructive">Image cannot be displayed. Open the original securely.</p>:url?<img src={url} alt={`Original document: ${name}`} onError={()=>setFailed(true)} className="mx-auto h-auto max-w-full object-contain"/>:null;
}
function PdfPreview({blob,page,onCount}:{blob:Blob;page:number;onCount:(n:number)=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);const [error,setError]=useState('');const [busy,setBusy]=useState(true);
 useEffect(()=>{
  let cancelled=false;let destroy:(()=>Promise<unknown>)|undefined;let cancelRender:(()=>void)|undefined;
  setBusy(true);setError('');
  void (async()=>{try{
   const pdfjs=await import('pdfjs-dist');const bytes=new Uint8Array(await blob.arrayBuffer());if(cancelled)return;
   pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString();
   const task=pdfjs.getDocument({data:bytes,isEvalSupported:false});destroy=()=>task.destroy();
   const pdf=await task.promise;if(cancelled)return;onCount(pdf.numPages);
   if(!Number.isInteger(page)||page<1||page>pdf.numPages)throw Error(`Requested source page ${page} is outside this document (${pdf.numPages} pages).`);
   const p=await pdf.getPage(page);if(cancelled)return;
   const base=p.getViewport({scale:1});const viewport=p.getViewport({scale:Math.min(2,1800/Math.max(base.width,base.height))});
   // Render offscreen: an older async render cannot paint onto a newer page's canvas.
   const tmp=window.document.createElement('canvas');tmp.width=Math.ceil(viewport.width);tmp.height=Math.ceil(viewport.height);const ctx=tmp.getContext('2d');if(!ctx)throw Error('Canvas unavailable');
   const render=p.render({canvas:tmp,canvasContext:ctx,viewport});cancelRender=()=>render.cancel();await render.promise;
   if(!cancelled&&canvas.current){canvas.current.width=tmp.width;canvas.current.height=tmp.height;canvas.current.getContext('2d')?.drawImage(tmp,0,0);setBusy(false);}tmp.width=0;tmp.height=0;
  }catch(e){if(!cancelled){setError(e instanceof Error?e.message:String(e));setBusy(false);}}finally{if(!cancelled&&destroy){const d=destroy;destroy=undefined;await d().catch(()=>{});}}})();
  return()=>{cancelled=true;cancelRender?.();if(destroy)void destroy().catch(()=>{});};
 },[blob,page,onCount]);
 return <>{busy&&<p role="status" className="p-3 text-sm">Rendering page…</p>}{error&&<p role="alert" className="p-3 text-sm text-destructive">Preview unavailable: {error}</p>}<canvas ref={canvas} className="mx-auto h-auto max-w-full" hidden={busy||!!error} role="img" aria-label={`Original PDF page ${page}`} /></>;
}
export function VpOriginalPreview({document:doc,caseNum,page,onPage}:{document:VpCaseDocument;caseNum:number;page:number;onPage:(n:number)=>void}){
 const {tenant}=useApp();const [blob,setBlob]=useState<Blob|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [count,setCount]=useState(0);const valid=previewable(doc,tenant.id,caseNum);
 // The caller keys this component by tenant/case/document/path; no blob survives a context change.
 const reportCount=setCount;
 const mounted=useRef(true);useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 async function load(){if(!valid||!doc.storage_path||busy)return;setBusy(true);setError('');try{const {data,error}=await vpDb.storage.from(DOC_BUCKET).download(doc.storage_path);if(error||!data)throw Error(error?.message??'Private document unavailable');if(data.size<1||data.size>maxBytes)throw Error('Preview supports files up to 10 MB');if(mounted.current){setBlob(new Blob([data],{type:doc.mime}));if(doc.mime!=='application/pdf')reportCount(1);}}catch(e){if(mounted.current)setError(e instanceof Error?e.message:String(e));}finally{if(mounted.current)setBusy(false);}}
 return <section aria-label="Original document" className="min-w-0 rounded-lg border bg-card"><div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2"><h3 className="flex items-center gap-2 text-sm font-semibold"><FileText className="size-4"/>Original document</h3>{valid&&doc.storage_path&&<Button variant="outline" size="sm" onClick={()=>void openVpDocument(doc.storage_path!).catch(e=>toast.error(String(e)))}><ExternalLink className="size-3.5"/>Open securely</Button>}</div>
 {!valid?<p className="p-3 text-sm text-muted-foreground">No supported private file is registered for this case.</p>:!blob?<div className="space-y-2 p-3"><p className="text-sm text-muted-foreground">Load the original for visual comparison. Files remain subject to private storage access.</p><Button size="sm" disabled={busy} onClick={()=>void load()}>{busy?'Loading…':'Load original'}</Button>{error&&<p role="alert" className="text-sm text-destructive">{error}</p>}</div>:<>
 {doc.mime==='application/pdf'&&<div className="flex items-center justify-center gap-2 border-b p-1.5"><Button variant="ghost" size="icon" aria-label={count&&page>count?"Return to first source page":"Previous source page"} disabled={page<=1} onClick={()=>onPage(count&&page>count?1:page-1)}><ChevronLeft className="size-4"/></Button><span className="text-xs tabular-nums">Page {page}{count>0?` / ${count}`:''}</span><Button variant="ghost" size="icon" aria-label="Next source page" disabled={!count||page>=count} onClick={()=>onPage(page+1)}><ChevronRight className="size-4"/></Button></div>}
 <div className="max-h-[65vh] overflow-auto bg-muted/30 p-2">{doc.mime==='application/pdf'?<PdfPreview blob={blob} page={page} onCount={reportCount}/>:page===1?<ImagePreview blob={blob} name={doc.name}/>:<div className="p-3"><p role="alert" className="text-sm text-destructive">Requested page {page} is not available in this single image.</p><Button size="sm" variant="outline" onClick={()=>onPage(1)}>Return to original image</Button></div>}</div><p className="px-3 py-2 text-xs text-muted-foreground">Visual preview only. Confirm the original page before accepting any extracted field.</p></>}
 </section>;
}
