import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {Card,CardContent,CardHeader,CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {useApp} from '@/lib/app-context';
import {useP18Template,publishP18Template} from '@/lib/vp-p18-api';
import {defaultTemplate,isP18Category,parseFields,P18_CATEGORIES,type P18Category} from '@/lib/vp-p18-templates';
function ConfigEditor({category}:{category:P18Category}){
 const {tenant}=useApp();const client=useQueryClient();const query=useP18Template(category);const [draft,setDraft]=useState<string|null>(null);const [reason,setReason]=useState('');const [busy,setBusy]=useState(false);
 const shown=draft??JSON.stringify(query.data?.fields??defaultTemplate(category).fields,null,2);
 async function publish(){if(busy||!query.data)return;try{const fields=parseFields(JSON.parse(shown));if(!reason.trim()||reason.length>1000)throw new Error('Enter a publication reason (1–1000 characters)');if(!window.confirm('Publish a new immutable template revision for new supplements? Existing snapshots are not changed.'))return;setBusy(true);await publishP18Template(category,fields,reason);await client.invalidateQueries({queryKey:['vp-p18-template',tenant.id,category]});setDraft(null);setReason('');toast.success('Template revision published');}catch(e){toast.error(e&&typeof e==='object'&&'message' in e?String(e.message):String(e));}finally{setBusy(false);}}
 return <div className="space-y-3"><p className="text-xs text-muted-foreground">Active revision: {query.data?.revision??'Loading'} · 1–30 fields. Each entry uses key, label, type (text, number or choice), optional unit and options for choice. All are supplemental and optional; they do not change existing QC rules.</p>
 {query.error&&<p role="alert" className="text-destructive text-sm">Template load failed: {query.error.message}</p>}
 <Textarea rows={12} className="font-mono text-xs" aria-label="Template field definitions JSON" value={shown} disabled={busy||!query.data} onChange={e=>setDraft(e.target.value)}/>
 <Input aria-label="Publication reason" placeholder="Publication reason" value={reason} maxLength={1000} disabled={busy} onChange={e=>setReason(e.target.value)}/>
 <div className="flex flex-wrap gap-2"><Button type="button" disabled={busy||!query.data||draft===null||!reason.trim()} onClick={()=>void publish()}>{busy?'Publishing…':'Publish new revision'}</Button><Button type="button" variant="outline" disabled={busy||!query.data} onClick={()=>setDraft(JSON.stringify(defaultTemplate(category).fields,null,2))}>Load default fields</Button><Button type="button" variant="outline" disabled={busy||draft===null} onClick={()=>{setDraft(null);setReason('');}}>Discard edits</Button></div></div>;
}
export function VpP18TemplateAdmin(){const {tenant}=useApp();const [category,setCategory]=useState<P18Category>('Land');if(!tenant.adminAccess)return null;return <Card className="mt-5"><CardHeader><CardTitle className="text-base">Property capture templates (P18)</CardTitle></CardHeader><CardContent className="space-y-3"><label className="block text-xs font-medium" htmlFor="p18-category">Case category</label><select id="p18-category" className="rounded border bg-background p-2 text-sm" value={category} onChange={e=>{if(isP18Category(e.target.value))setCategory(e.target.value);}}>{P18_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select><ConfigEditor key={category} category={category}/></CardContent></Card>;}
