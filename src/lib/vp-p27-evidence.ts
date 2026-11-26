/** Presentation and validation only; no database writes or implicit adoption. */
export type EvidenceDocument={id:string;name:string;mime:string;storage_path?:string|null};
export const previewMimes=['application/pdf','image/jpeg','image/png'] as const;
export function previewable(d:EvidenceDocument,tenant:string,num:number):boolean {
 return !!tenant&&Number.isSafeInteger(num)&&num>0&&!!d.storage_path&&d.storage_path.startsWith(`${tenant}/${num}/`)&&d.storage_path.length>(`${tenant}/${num}/`).length&&!d.storage_path.split('/').some(part=>part==='..'||part==='.'||!part)&&!d.storage_path.includes('\\')&&(previewMimes as readonly string[]).includes(d.mime);
}
export function selectedEvidence<T extends EvidenceDocument>(docs:readonly T[],id:string):T|undefined {
 return docs.find(d=>d.id===id)??docs.find(d=>!!d.storage_path)??docs[0];
}
export function filterEvidence<T extends EvidenceDocument>(docs:readonly T[],term:string):T[] {
 const q=term.trim().toLocaleLowerCase();return docs.filter(d=>!q||d.name.toLocaleLowerCase().includes(q));
}
export function comparisonStatus(a:unknown,b:unknown):'Missing'|'Same'|'Different' {
 const norm=(x:unknown)=>typeof x==='string'?x.trim():x==null?'':String(x);
 const left=norm(a),right=norm(b);return !left||!right?'Missing':left===right?'Same':'Different';
}
