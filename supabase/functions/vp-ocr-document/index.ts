/**
 * P3 secure, user-triggered OCR: RLS-scoped registered case documents only.
 * Google Cloud Vision is optional and paid. No document text is stored by the function.
 * Requires P3 claim/complete SQL and GOOGLE_VISION_API_KEY secret.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const env = (key: string) => Deno.env.get(key) ?? '';
const allowed = env('VP_ALLOWED_ORIGINS').split(',').map(s => s.trim()).filter(Boolean);
const headers = {
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};
function reply(status: number, body: Record<string, unknown>, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {...headers, ...(origin && allowed.includes(origin) ? {'Access-Control-Allow-Origin':origin,'Vary':'Origin'} : {})},
  });
}

type VisionAnnotation = {
  fullTextAnnotation?: {text?: string};
  textAnnotations?: Array<{description?: string}>;
  context?: {pageNumber?: number};
  error?: {message?: string};
};
type VisionResponse = {responses?: Array<VisionAnnotation | {responses?: VisionAnnotation[]}>; error?: {message?: string}};
const allowedMime = new Set(['application/pdf','image/jpeg','image/png']);
function hasMagic(bytes: Uint8Array, mime: string): boolean {
  if (mime === 'application/pdf') return bytes.length > 5 && bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70 && bytes[4] === 45;
  if (mime === 'image/jpeg') return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === 'image/png') return bytes.length > 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
  return false;
}
function encode64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192)
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}
function getText(annotation: VisionAnnotation): string {
  return annotation.fullTextAnnotation?.text ?? annotation.textAnnotations?.[0]?.description ?? '';
}

Deno.serve(async req => {
  const origin = req.headers.get('Origin');
  if (req.method === 'OPTIONS') return reply(200,{ok:true},origin);
  if (req.method !== 'POST') return reply(405,{error:'POST required'},origin);
  if (!origin || !allowed.includes(origin)) return reply(403,{error:'Application origin not authorized'},origin);
  const bearer = req.headers.get('Authorization') ?? '';
  if (!bearer.startsWith('Bearer ')) return reply(401,{error:'Sign in before requesting OCR'},origin);
  const url = env('SUPABASE_URL');
  const publishable = env('SUPABASE_PUBLISHABLE_KEY') || env('SUPABASE_ANON_KEY');
  const providerKey = env('GOOGLE_VISION_API_KEY');
  if (!url || !publishable || !providerKey) return reply(503,{error:'OCR provider or Supabase configuration missing on server'},origin);
  const token = bearer.slice(7);
  const caller = createClient(url,publishable,{
    auth:{persistSession:false,autoRefreshToken:false},
    global:{headers:{Authorization:bearer}},
  });
  const {data: userData,error: userError} = await caller.auth.getUser(token);
  if (userError || !userData.user) return reply(401,{error:'Invalid login session'},origin);
  let requestId: string | null = null;
  let status: 'success' | 'error' = 'error';
  let pagesProcessed = 0;
  let errorCode = 'unknown';
  try {
    const input = await req.json() as Record<string,unknown>;
    if (input.consent_acknowledged !== true) return reply(400,{error:'Explicit document-processing consent required'},origin);
    const docId = String(input.document_id ?? '');
    const caseNum = Number(input.case_num);
    if (!/^\d{1,20}$/.test(docId) || !Number.isSafeInteger(caseNum) || caseNum < 1) {
      return reply(400,{error:'Invalid registered document identifier or case number'},origin);
    }
    const {data:orgId,error:orgError} = await caller.rpc('vp_current_org_id');
    if (orgError || !orgId) return reply(403,{error:'No active tenant context'},origin);
    // The documents SELECT and Storage download both use the signed-in user's RLS.
    const {data:doc,error:docError} = await caller.from('documents')
      .select('id,org_id,num,name,mime,size,storage_path')
      .eq('org_id',String(orgId)).eq('num',caseNum).eq('id',docId).maybeSingle();
    if (docError || !doc || !doc.storage_path || !allowedMime.has(doc.mime)) {
      return reply(404,{error:'Registered document not accessible to this login'},origin);
    }
    const filePath = String(doc.storage_path);
    if (!filePath.startsWith(`${orgId}/${caseNum}/`) || filePath.includes('..')) {
      return reply(403,{error:'Invalid private document path'},origin);
    }
    if (Number(doc.size) < 1 || Number(doc.size) > 10485760) {
      return reply(413,{error:'OCR accepts registered files up to 10 MB'},origin);
    }
    const {data:claim,error:claimError} = await caller.rpc('vp_p3_ocr_claim',{
      p_document_id:docId,p_case_num:caseNum,
    });
    if (claimError || !claim) return reply(403,{error:claimError?.message ?? 'OCR quota or authorization denied; install P3 SQL'},origin);
    requestId = String(claim);
    const {data:blob,error:downloadError} = await caller.storage.from('vp-case-docs').download(filePath);
    if (downloadError || !blob) {errorCode='storage_denied';throw new Error('Private document download denied by storage policy');}
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (bytes.length < 1 || bytes.length > 10485760 || !hasMagic(bytes,doc.mime)) {
      errorCode='invalid_file';throw new Error('File size or type does not match the registered document');
    }
    const content = encode64(bytes);
    const isPdf = doc.mime === 'application/pdf';
    const endpoint = isPdf ? 'files:annotate' : 'images:annotate';
    const payload = isPdf ? {requests:[{
      inputConfig:{content,mimeType:'application/pdf'},features:[{type:'DOCUMENT_TEXT_DETECTION'}],
    }]} : {requests:[{image:{content},features:[{type:'DOCUMENT_TEXT_DETECTION'}]}]};
    const ocrRes = await fetch(`https://vision.googleapis.com/v1/${endpoint}?key=${encodeURIComponent(providerKey)}`,{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),
      signal:AbortSignal.timeout(55000),
    });
    if (!ocrRes.ok) {
      errorCode='provider_http';
      throw new Error(`OCR provider returned HTTP ${ocrRes.status}. Check billing, API key restrictions and quota.`);
    }
    const data = await ocrRes.json() as VisionResponse;
    if (data.error) {errorCode='provider_error';throw new Error('OCR provider rejected the document');}
    const extracted = isPdf
      ? (((data.responses?.[0] ?? {}) as {responses?:VisionAnnotation[]}).responses ?? [])
      : (data.responses ?? []) as VisionAnnotation[];
    const pages = extracted.slice(0,5).map((annotation,i) => {
      if (annotation.error) {errorCode='provider_page_error';throw new Error(`OCR could not process page ${i+1}`);}
      const text = getText(annotation);
      return {page:annotation.context?.pageNumber ?? i+1,text:text.slice(0,30000),truncated:text.length>30000};
    });
    pagesProcessed=pages.length;
    status='success';
    return reply(200,{
      document_id:String(doc.id),case_num:caseNum,document_name:String(doc.name),
      provider:'google-vision',pages,processing_limit:isPdf?'First five PDF pages only':'Single image',request_id:requestId,
    },origin);
  } catch (error) {
    return reply(502,{error:error instanceof Error?error.message:'OCR processing failed',request_id:requestId},origin);
  } finally {
    if (requestId) {
      // The completion RPC is caller-scoped and does not grant service-role privileges.
      await caller.rpc('vp_p3_ocr_complete',{
        p_request_id:requestId,p_status:status,p_page_count:pagesProcessed,
        p_error_code:status==='error'?errorCode:null,
      });
    }
  }
});
