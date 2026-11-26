/** ValuationPro-specific bounded template configuration. JSON Forms renders the schema. */
export const P18_KEY='__vp_p18_supplement_v1';
export const P18_CATEGORIES=['Land','House','Flat','Commercial'] as const;
export type P18Category=typeof P18_CATEGORIES[number];
export type P18Field={key:string;label:string;type:'text'|'number'|'choice';unit?:string;options?:string[]};
export type P18Template={category:P18Category;revision:string;fields:P18Field[]};
export type P18Values=Record<string,string|number>;
export type P18Snapshot={template:P18Template;values:P18Values};
const text=(key:string,label:string):P18Field=>({key,label,type:'text'});
const num=(key:string,label:string,unit:string):P18Field=>({key,label,type:'number',unit});
const choice=(key:string,label:string,options:string[]):P18Field=>({key,label,type:'choice',options});
const common=[text('planning_authority','Planning authority'),text('approval_reference','Approval / layout reference'),text('survey_reference','Survey / plot reference'),text('source_reference','Measurement or document source reference')];
const categoryFields:Record<P18Category,P18Field[]>={
 Land:[num('deed_extent','Document land extent','sq. yd.'),num('actual_extent','Actual land extent','sq. yd.'),choice('land_use','Observed land use',['Residential','Commercial','Agricultural','Industrial','Other','Unknown']),text('access_rights','Access / easement observations'),text('topography','Topography and drainage')],
 House:[num('approved_area','Approved constructed area','sq. ft.'),num('actual_area','Actual constructed area','sq. ft.'),num('year_built','Year of construction','year'),num('replacement_rate','Indicative replacement rate (unadopted)','₹/sq. ft.'),text('condition','Structural condition observations'),text('improvements','Compound wall, borewell and other improvements')],
 Flat:[num('uds_deed','Undivided land share as per deed','sq. yd.'),num('carpet_area','Carpet area','sq. ft.'),num('builtup_area','Built-up area','sq. ft.'),num('superbuiltup_area','Super built-up area','sq. ft.'),text('occupancy_certificate','Occupancy certificate reference'),text('parking_rights','Parking / common area rights')],
 Commercial:[num('rentable_area','Rentable area','sq. ft.'),num('approved_area','Approved area','sq. ft.'),num('actual_area','Actual area','sq. ft.'),num('monthly_rent','Observed monthly rent (unadopted)','₹/month'),text('lease_reference','Lease / rental evidence reference'),text('permitted_use','Permitted and observed use'),text('fire_access','Fire access and safety observations')],
};
export function isP18Category(x:unknown):x is P18Category{return typeof x==='string'&&(P18_CATEGORIES as readonly string[]).includes(x);}
export function defaultTemplate(category:P18Category):P18Template{return {category,revision:'builtin-1',fields:[...common,...categoryFields[category]].map(f=>({...f,...(f.options?{options:[...f.options]}:{})}))};}
const obj=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const validString=(x:unknown,max:number):x is string=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
export function parseFields(raw:unknown):P18Field[]{
 if(!Array.isArray(raw)||raw.length<1||raw.length>30)throw new Error('Template must have 1–30 fields');
 const used=new Set<string>();
 return raw.map((f:unknown)=>{
  if(!obj(f)||!validString(f['key'],40)||!/^[a-z][a-z0-9_]{0,39}$/.test(f['key'])||['constructor','prototype'].includes(f['key'])||used.has(f['key'])||!validString(f['label'],120))throw new Error('Each field needs a unique safe key and a label');
  const key=f['key'],label=f['label'],type=f['type'];used.add(key);
  if(type!=='text'&&type!=='number'&&type!=='choice')throw new Error('Supported types: text, number, choice');
  const unit=f['unit'];if(unit!==undefined&&!validString(unit,40))throw new Error('Invalid unit');
  const options=f['options'];
  if(type==='choice'&&(!Array.isArray(options)||options.length<2||options.length>20||!options.every(o=>validString(o,100))||new Set(options).size!==options.length))throw new Error('Choice fields need 2–20 unique options');
  if(type!=='choice'&&options!==undefined)throw new Error('Only choice fields may have options');
  return {key,label,type,...(typeof unit==='string'?{unit}:{}),...(type==='choice'?{options:options as string[]}:{})};
 });
}
export function normalizeValues(template:P18Template,raw:unknown):P18Values{
 if(!obj(raw))throw new Error('Supplement values must be an object');const result:P18Values={};
 for(const f of template.fields){const v=raw[f.key];if(v===undefined||v===null||v==='')continue;
  if(f.type==='number'){if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1e15)throw new Error(`${f.label}: enter a nonnegative number`);}
  else if(typeof v!=='string'||v.length>1000||(f.type==='choice'&&!f.options?.includes(v)))throw new Error(`${f.label}: invalid value`);
  result[f.key]=v as string|number;
 }
 return result;
}
export function encodeSnapshot(template:P18Template,raw:unknown):string{return JSON.stringify({template,values:normalizeValues(template,raw)});}
export function decodeSnapshot(raw:string|undefined):P18Snapshot|null{
 if(raw===undefined||raw==='')return null;
 if(raw.length>65000)throw new Error('Supplement exceeds maximum size');
 const p:unknown=JSON.parse(raw);if(!obj(p)||!obj(p['template']))throw new Error('Invalid supplemental snapshot');
 const t=p['template'];if(!isP18Category(t['category'])||typeof t['revision']!=='string'||!(/^(builtin-1|[1-9][0-9]{0,19})$/).test(t['revision']))throw new Error('Invalid template reference');
 const template:P18Template={category:t['category'],revision:t['revision'],fields:parseFields(t['fields'])};
 return {template,values:normalizeValues(template,p['values'])};
}
