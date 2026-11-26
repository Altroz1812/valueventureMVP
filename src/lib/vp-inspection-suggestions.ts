/** These are case-master suggestions, NOT values extracted from a document. */
export type InspectionCandidate = {field:string;value:string;source:string;detail:string};
export type InspectionProvenance = Record<string,{source:string;detail:string;confirmed_at:string}>;
export const PROVENANCE_KEY='__vp_field_sources_v1';
export function loadProvenance(raw:Record<string,string>):InspectionProvenance {
  try {
    const parsed:unknown=JSON.parse(raw[PROVENANCE_KEY]??'{}');
    if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))return parsed as InspectionProvenance;
  }catch { /* Retain unrecognized legacy data; show no claimed provenance. */ }
  return {};
}
export function caseInspectionCandidates(c:{customer:string;property:string;propertyType:string}|undefined):InspectionCandidate[]{
  if(!c)return [];
  const values:InspectionCandidate[]=[];
  const add=(field:string,value:string,detail:string)=>{if(value.trim())values.push({field,value,source:'Case master',detail});};
  add('owner_name',c.customer,'Borrower name only — verify whether borrower is the actual owner');
  add('site_address',c.property,'Case address — confirm at site');
  const type:Record<string,string>={House:'Resi',Flat:'Resi',Commercial:'Com',Land:'Land'};
  if(type[c.propertyType])add('property_type',type[c.propertyType]??'',`Case property category: ${c.propertyType}`);
  if(c.propertyType==='Land')add('roof_type','Vacant Plot','From case property category; inspect before confirming');
  return values;
}
export function proposeValue(previous:Record<string,string>,field:string,value:string,source:string,detail:string,now:string):Record<string,string>{
  const provenance={...loadProvenance(previous),[field]:{source,detail,confirmed_at:now}};
  return {...previous,[field]:value,[PROVENANCE_KEY]:JSON.stringify(provenance)};
}
