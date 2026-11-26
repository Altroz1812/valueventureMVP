import type { OcrPage } from './vp-ocr-candidates';
export const P21_FIELDS = ['address','state','district','mandal','village','pincode','municipality','landmark','road_access','building_name','flat_no','east_deed','west_deed','north_deed','south_deed'] as const;
export type P21Field=typeof P21_FIELDS[number];
export type P21Candidate={field:P21Field|string;label:string;value:string;page:number;sourceLine:string;adoptable:boolean};
// Only explicit labels followed by a colon. No guess at legal role, schedule or units.
const fields:readonly {field:string;label:string;re:RegExp}[]=[
 {field:'address',label:'Property address',re:/^(property address|site address|address of property|ఆస్తి చిరునామా|संपत्ति का पता)$/iu},
 {field:'state',label:'State',re:/^(state|రాష్ట్రం|राज्य)$/iu},
 {field:'district',label:'District',re:/^(district|జిల్లా|जिला|ज़िला)$/iu},
 {field:'mandal',label:'Mandal / Taluk',re:/^(mandal|taluk|tehsil|మండలం|తాలూకా|तहसील)$/iu},
 {field:'village',label:'Village / locality',re:/^(village|locality|గ్రామం|ग्राम|गाँव)$/iu},
 {field:'pincode',label:'PIN code',re:/^(pin code|pincode|పిన్ కోడ్|पिन कोड)$/iu},
 {field:'municipality',label:'Municipality',re:/^(municipality|gram panchayat|మున్సిపాలిటీ|नगरपालिका)$/iu},
 {field:'landmark',label:'Landmark',re:/^(landmark|nearby landmark)$/iu},
 {field:'road_access',label:'Road access',re:/^(road access|approach road)$/iu},
 {field:'building_name',label:'Building name',re:/^(building name|project name)$/iu},
 {field:'flat_no',label:'Flat / unit number',re:/^(flat no\.?|flat number|unit number)$/iu},
 ...(['east','west','north','south'] as const).map(d=>({field:d+'_deed',label:d[0]!.toUpperCase()+d.slice(1)+' deed boundary',re:new RegExp(`^(?:${d} deed boundary|deed boundary ${d})$`,'i')})),
 {field:'survey_no',label:'Survey number — confirm parcel manually',re:/^(survey no\.?|survey number|సర్వే నంబర్|सर्वे नंबर)$/iu},
 {field:'plot_no',label:'Plot number — confirm parcel manually',re:/^(plot no\.?|plot number|ప్లాట్ నంబర్|प्लॉट नंबर)$/iu},
 {field:'deed_area',label:'Deed extent — confirm parcel & unit manually',re:/^(land extent|deed extent|plot area|land area|విస్తీర్ణం|क्षेत्रफल)$/iu},
 {field:'owner',label:'Owner name — confirm legal capacity manually',re:/^(owner name|property owner|name of owner|యజమాని పేరు|मालिक का नाम)$/iu},
 {field:'document_ref',label:'Registration reference — confirm deed manually',re:/^(document number|document no\.?|registration number|registration no\.?|దస్తావేజు సంఖ్య|दस्तावेज संख्या)$/iu},
 {field:'document_date',label:'Document date — confirm document manually',re:/^(document date|registration date|deed date|రిజిస్ట్రేషన్ తేదీ|पंजीकरण तिथि)$/iu},
 {field:'sro',label:'Sub-Registrar office — confirm document manually',re:/^(sro|sub registrar office|sub-registrar office)$/iu},
 {field:'approval_ref',label:'Approval reference — manual review',re:/^(building approval number|approval number|sanction number|occupancy certificate number)$/iu},
 {field:'tax_ref',label:'Tax reference — manual review',re:/^(property tax number|assessment number|ptin)$/iu},
];
export function isP21Field(field:string):field is P21Field{return (P21_FIELDS as readonly string[]).includes(field)}
export function propertyOcrCandidates(pages:readonly OcrPage[]):P21Candidate[]{
 const out:P21Candidate[]=[];const seen=new Set<string>();
 for(const p of pages){if(!Number.isInteger(p.page)||p.page<1||p.truncated)continue;
  for(const raw of p.text.split(/\r?\n/).slice(0,1000)){const line=raw.trim();if(!line||line.length>300||/[\x00-\x08<>]/.test(line))continue;
   const match=/^([^:：]{1,80})[:：]\s*(.+)$/u.exec(line);if(!match)continue;
   const rule=fields.find(f=>f.re.test(match[1]!.trim()));if(!rule)continue;
   const value=match[2]!.trim();if(!value||value.length>200||(rule.field==='pincode'&&!/^[1-9][0-9]{5}$/.test(value)))continue;
   const key=`${p.page}:${rule.field}:${value}`;if(seen.has(key))continue;seen.add(key);
   out.push({field:rule.field,label:rule.label,value,page:p.page,sourceLine:line,adoptable:isP21Field(rule.field)});
   if(out.length>=50)return out;
  }
 }return out;
}
