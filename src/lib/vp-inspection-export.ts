import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { inspectionPhotoSlots, inspectionRiskGroups, inspectionPhotoCategoryFromName } from '@/lib/vp-inspection-template';

/** Fill the user's original 60-row workbook. No values or images are invented. */
export const EXCEL_CELL_MAP:Readonly<Record<string,string>>={
  visit_date:'C2',ownership_type:'C3',geotag_remarks:'G3',owner_name:'C4',
  identified_through:'C6',property_type:'D8',site_address:'D9',occupancy:'D10',
  occupant_names:'D11',rent_per_unit:'D12',property_demarcated:'D15',
  structure_type:'D17',roof_type:'F17',property_usage:'D18',apartment_floor:'D19',
  locality_type:'D20',vicinity:'D21',building_specifications:'D23',amenities:'D24',
  building_dimensions_note:'D26',plot_sketch_note:'D27',
  setback_front_plan:'D39',setback_front_actual:'F39',setback_front_remarks:'H39',
  setback_left_side_plan:'D40',setback_left_side_actual:'F40',setback_left_side_remarks:'H40',
  setback_right_side_plan:'D41',setback_right_side_actual:'F41',setback_right_side_remarks:'H41',
  setback_rear_plan:'D42',setback_rear_actual:'F42',setback_rear_remarks:'H42',
  floor_area_0:'D45',floor_area_1:'E45',floor_area_2:'F45',floor_area_3:'G45',
  floor_area_4:'H45',floor_area_5:'E46',recommended_construction_value:'D47',
  boundary_east_deed:'D50',boundary_west_deed:'E50',boundary_north_deed:'F50',boundary_south_deed:'H50',
  boundary_east_site:'D51',boundary_west_site:'E51',boundary_north_site:'F51',boundary_south_site:'H51',
  boundary_east_match:'D52',boundary_west_match:'E52',boundary_north_match:'F52',boundary_south_match:'H52',
  land_rate_reference:'D59',
};
function val(v:Record<string,string>,key:string):string {return String(v[key]??'').trim();}
function dateDisplay(s:string):string {
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m?`${m[3]}/${m[2]}/${m[1]}`:s;
}
function dims(v:Record<string,string>,type:'land'|'building'):string {
  const l=val(v,`${type}_length`),b=val(v,`${type}_breadth`),unit=val(v,'measurement_unit')||'Feet';
  return l&&b?`${l} × ${b} ${unit}`:val(v,`${type}_dimensions_note`);
}
export function inspectionWorkbookCells(values:Record<string,string>,photoNames:readonly string[]):Record<string,string>{
  const cells:Record<string,string>={};
  for(const [key,cell] of Object.entries(EXCEL_CELL_MAP))cells[cell]=val(values,key);
  cells['C2']=dateDisplay(val(values,'visit_date'));
  cells['G2']=val(values,'utility_bill_verified')==='Yes'?val(values,'utility_bill_type'):'Not verified / '+val(values,'utility_bill_verified');
  cells['D5']=[val(values,'inspection_contact'),val(values,'inspection_contact_mobile'),val(values,'inspection_contact_relation')].filter(Boolean).join(' / ');
  cells['D13']=[val(values,'property_age')&&`${val(values,'property_age')} years`,val(values,'completion_percent')&&`${val(values,'completion_percent')}% complete`].filter(Boolean).join(' · ');
  cells['D14']=val(values,'floorwise_completion')||Array.from({length:6},(_,i)=>val(values,`floor_completion_${i}`)?`${i}: ${val(values,`floor_completion_${i}`)}%`:'').filter(Boolean).join(', ');
  cells['D16']=[val(values,'block_count')&&`${val(values,'block_count')} blocks`,val(values,'floor_count')&&`${val(values,'floor_count')} floors`,val(values,'unit_count')&&`${val(values,'unit_count')} units`].filter(Boolean).join(' / ');
  cells['D22']=[val(values,'approach_road'),val(values,'approach_road_width')&&`Width ${val(values,'approach_road_width')}`].filter(Boolean).join(' / ');
  cells['D25']=dims(values,'land');
  cells['D26']=dims(values,'building');
  for(const [row,group] of inspectionRiskGroups.entries()){
    const cols=['D','E','G'];
    for(const [i,item] of group.items.entries()){
      const answer=val(values,item.key);
      cells[`${cols[i]}${54+row}`]=`${answer==='Yes'?'☑': '☐'} ${item.label}${answer==='Not checked'?' (not checked)':''}`;
    }
  }
  const categories=new Set(photoNames.map(inspectionPhotoCategoryFromName).filter((x):x is string=>!!x));
  cells['B60']='Photographs: '+inspectionPhotoSlots.map(slot=>`${categories.has(slot.key)?'☑':'☐'} ${slot.label}`).join(', ');
  return cells;
}
function escapeXml(v:string):string{return v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function replaceCell(xml:string,cell:string,text:string):string{
  const rx=new RegExp(`<c\\s+r="${cell}"([^>]*?)(?:\\s*/>|>[\\s\\S]*?<\\/c>)`);
  const match=xml.match(rx);
  if(!match)throw new Error(`Workbook template changed: cell ${cell} unavailable`);
  const style=match[1]?.match(/\bs="\d+"/)?.[0]??'';
  return xml.replace(rx,`<c r="${cell}" ${style} t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`);
}

// Editable native spreadsheet shapes, anchored over the existing sketch area (D27:H37).
function diagramShapes(v:Record<string,string>):string{
  const E=6800;
  const f=(n:number)=>Math.round(n*E);
  let next=3;
  const rect=(name:string,text:string,x:number,y:number,w:number,h:number,bg:string,stroke:string):string=>{
    const id=next++;
    const lines=text.split('\n').slice(0,4).map(line=>`<a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-IN" sz="900" dirty="0"><a:solidFill><a:srgbClr val="222222"/></a:solidFill></a:rPr><a:t>${escapeXml(line.slice(0,90))}</a:t></a:r></a:p>`).join('');
    return `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id}" name="${escapeXml(name)}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="${f(x)}" y="${f(y)}"/><a:ext cx="${f(w)}" cy="${f(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${bg}"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="${stroke}"/></a:solidFill></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="square" anchor="ctr"/><a:lstStyle/>${lines}</xdr:txBody></xdr:sp>`;
  };
  const north=val(v,'boundary_north_site'), south=val(v,'boundary_south_site'),east=val(v,'boundary_east_site'),west=val(v,'boundary_west_site');
  const plot=val(v,'plot_facing')||'Not confirmed';
  const body=[
    rect('Title','Indicative plot sketch — NOT TO SCALE',0,5,1000,38,'FFFFFF','FFFFFF'),
    rect('North',`NORTH\n${north||'Not entered'}`,285,55,430,83,'EFF6FF','B8C4D6'),
    rect('West',`WEST\n${west||'Not entered'}`,28,151,205,143,'F8FAFC','CBD5E1'),
    rect('Plot',`PLOT\n${dims(v,'land')||'Dimensions not verified'}\nFacing: ${plot}`,286,151,428,143,'E2E8F0','334155'),
    rect('East',`EAST\n${east||'Not entered'}`,768,151,205,143,'F8FAFC','CBD5E1'),
    rect('South',`SOUTH\n${south||'Not entered'}`,285,308,430,83,'EFF6FF','B8C4D6'),
  ].join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>3</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>26</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>8</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>37</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="2" name="Inspection sketch"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${f(1000)}" cy="${f(430)}"/><a:chOff x="0" y="0"/><a:chExt cx="${f(1000)}" cy="${f(430)}"/></a:xfrm></xdr:grpSpPr>${body}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>`;
}
function insertDrawing(parts:Record<string,Uint8Array>,values:Record<string,string>):void{
  const sheet='xl/worksheets/sheet1.xml',rel='xl/worksheets/_rels/sheet1.xml.rels',draw='xl/drawings/drawing1.xml';
  if(parts[draw])throw new Error('Template already contains a drawing. Export cancelled to avoid overwriting it.');
  let xml=strFromU8(parts[sheet]!);
  if(/<drawing\s/.test(xml))throw new Error('Template already references a drawing. Export cancelled.');
  if(!xml.includes('xmlns:r='))xml=xml.replace('<worksheet ','<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ');
  xml=xml.replace('</worksheet>','<drawing r:id="rIdP1Sketch"/></worksheet>');
  parts[sheet]=strToU8(xml);
  const relationship='<Relationship Id="rIdP1Sketch" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>';
  if(parts[rel]){
    const previous=strFromU8(parts[rel]);
    if(previous.includes('rIdP1Sketch'))throw new Error('Duplicate drawing relationship');
    parts[rel]=strToU8(previous.replace('</Relationships>',relationship+'</Relationships>'));
  }else parts[rel]=strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationship}</Relationships>`);
  const contentTypes='[Content_Types].xml';
  const typeXml=strFromU8(parts[contentTypes]!);
  parts[contentTypes]=strToU8(typeXml.replace('</Types>','<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>'));
  parts[draw]=strToU8(diagramShapes(values));
}
export function fillInspectionWorkbook(template:Uint8Array,values:Record<string,string>,photoNames:readonly string[]):Uint8Array{
  const parts=unzipSync(template);
  const sheet='xl/worksheets/sheet1.xml';
  if(!parts[sheet]||!parts['[Content_Types].xml'])throw new Error('Not the expected Valuation Report template');
  let xml=strFromU8(parts[sheet]!);
  for(const [ref,value] of Object.entries(inspectionWorkbookCells(values,photoNames))){xml=replaceCell(xml,ref,value);}
  parts[sheet]=strToU8(xml);
  insertDrawing(parts,values);
  return zipSync(parts,{level:6});
}
export async function downloadInspectionWorkbook(visitId:string,values:Record<string,string>,photos:readonly string[]):Promise<void>{
  const response=await fetch('/templates/Valuation_Report.xlsx',{cache:'no-store'});
  if(!response.ok)throw new Error('Original report template not found. Check public/templates/Valuation_Report.xlsx');
  const bytes=fillInspectionWorkbook(new Uint8Array(await response.arrayBuffer()),values,photos);
  const blob=new Blob([new Uint8Array(bytes)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob);
  try{
    const a=document.createElement('a');a.href=url;a.download=`Valuation_Report_Visit_${visitId}.xlsx`;document.body.append(a);a.click();a.remove();
  }finally{setTimeout(()=>URL.revokeObjectURL(url),3000);}
}
