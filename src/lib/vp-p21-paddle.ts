import type { LocalOcrLanguage } from './vp-local-ocr';
export type PaddlePage = {text:string;truncated:boolean;engine:'paddleocr-3.3.2'};
export async function paddleRecognize(image:Blob|HTMLCanvasElement,language:LocalOcrLanguage,token:string):Promise<PaddlePage>{
 if(!['localhost','127.0.0.1'].includes(window.location.hostname)||window.location.protocol!=='http:')throw new Error('PaddleOCR is available only from the local HTTP application. Use Tesseract on hosted/mobile deployments.');
 if(token.length<32)throw new Error('Enter the local OCR service token.');
 const blob=image instanceof Blob?image:await new Promise<Blob>((resolve,reject)=>image.toBlob(b=>b?resolve(b):reject(new Error('Cannot render page image')),'image/png'));
 if(!['image/png','image/jpeg'].includes(blob.type)||blob.size<1||blob.size>10*1024*1024)throw new Error('Unsupported image or image exceeds 10 MB.');
 const response=await fetch('http://127.0.0.1:8765/ocr',{method:'POST',body:blob,headers:{'Content-Type':blob.type,'X-VP-OCR-Token':token,'X-VP-OCR-Language':language},credentials:'omit',redirect:'error',cache:'no-store',signal:AbortSignal.timeout(300000)});
 if(!response.ok)throw new Error(`Local PaddleOCR service returned HTTP ${response.status}. Check the token, origin, service and models; retry or choose Tesseract.`);
 const v:unknown=await response.json();
 if(!v||typeof v!=='object'||!('text' in v)||typeof v.text!=='string'||v.text.length>30000||!('truncated' in v)||typeof v.truncated!=='boolean'||!('engine' in v)||v.engine!=='paddleocr-3.3.2')throw new Error('Invalid PaddleOCR response.');
 return {text:v.text,truncated:v.truncated,engine:v.engine};
}
