export const P20_FIELDS=['status','case_num','bank','customer','category','address','property_label','effective_date','method','analysis_version','formula_version','marketValue','guidelineValue','realizableValue','distressValue','landValue','buildingValue','replacementCost','depreciation','amenities','adoptedRate','basis','netOperatingIncome','capRatePct','annualGrossRent','annualExpenses','reason','review_reason'] as const;
export type Mapping={field:typeof P20_FIELDS[number];sheet:string;cell:string};
export const REQUIRED=['status','case_num','method','analysis_version','marketValue'] as const;
export function parseP20Mapping(input:unknown):Mapping[]{
 if(!Array.isArray(input)||input.length<5||input.length>80)throw new Error('Provide 5–80 mappings');
 const targets=new Set<string>();const fields=new Set<string>();
 const rows=input.map((row:unknown)=>{
  if(!row||typeof row!=='object'||Array.isArray(row))throw new Error('Invalid mapping row');
  const r=row as Record<string,unknown>;const field=r['field'],sheet=r['sheet'],cell=r['cell'];
  if(Object.keys(r).some(k=>!['field','sheet','cell'].includes(k))||typeof field!=='string'||!P20_FIELDS.includes(field as Mapping['field']))throw new Error('Unknown field');
  if(typeof sheet!=='string'||sheet.trim()!==sheet||!sheet||sheet.length>31||sheet.toLowerCase()==='_vp20_audit'||typeof cell!=='string'||!/^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(cell))throw new Error('Invalid sheet or cell');
  const parts=/^([A-Z]+)(\d+)$/.exec(cell)!;let col=0;for(const c of parts[1]!)col=col*26+c.charCodeAt(0)-64;
  if(col>16384||Number(parts[2])>1048576)throw new Error('Cell outside Excel limits');
  const target=sheet.toLowerCase()+':'+cell;if(targets.has(target))throw new Error('Duplicate cell target');targets.add(target);fields.add(field);
  return {field:field as Mapping['field'],sheet,cell};
 });
 if(!REQUIRED.every(k=>fields.has(k)))throw new Error('Map status, case_num, method, analysis_version and marketValue');return rows;
}
export const EXAMPLE_MAPPING:Mapping[]=REQUIRED.map((field,i)=>({field,sheet:'Sheet1',cell:`B${i+2}`}));
export function mappedValue(values:Record<string,unknown>,field:Mapping['field']):string|number|boolean|null{
 const v=values[field];if(v==null)return null;if(typeof v==='string'||typeof v==='boolean'||(typeof v==='number'&&Number.isFinite(v)))return v;throw new Error(`Invalid value for ${field}`);
}
