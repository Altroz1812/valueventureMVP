// Field labels and section order follow Valuation_Report(1).xlsx > "Valuation Report" (A1:H60).
// Existing JSON keys are retained so saved draft values remain compatible.
export type InspectionFieldType = 'text' | 'longtext' | 'number' | 'date' | 'choice';
export type InspectionField = {
  key: string; label: string; type: InspectionFieldType;
  options?: readonly string[]; unit?: string; required?: boolean;
};
export type InspectionLayout = 'fields' | 'setbacks' | 'floor_area' | 'boundaries' | 'observations' | 'photos';
export type InspectionSection = {
  id: string; title: string; source: string; layout: InspectionLayout;
  fields: readonly InspectionField[];
};
const f=(key:string,label:string,type:InspectionFieldType='text',options?:readonly string[],unit?:string,required?:boolean):InspectionField=>({
  key,label,type,...(options!==undefined?{options}:{}),...(unit!==undefined?{unit}:{}),...(required!==undefined?{required}:{})
});
const floorNames=['Stilt / Base','Ground','First','Second','Third','4th'] as const;
const boundaryNames=['East','West','North','South'] as const;
const setbacks=[
  {name:'Front',key:'front'},
  {name:'Side1 (Left)',key:'left_side'},
  {name:'Side2 (Right)',key:'right_side'},
  {name:'Rear',key:'rear'}
] as const;
// Observations in the same row-major order as the Excel, rows 54-58.
// Keep the original risk_1..risk_18 storage keys; 5 headings were previously
// (incorrectly) editable fields. Those legacy JSON values remain untouched.
export const inspectionRiskGroups = [
  {title:'Identification Issues', items:[{key:'risk_1',label:'Property Locked'},{key:'risk_2',label:'CDA'},{key:'risk_3',label:'Nala /Lake/ Buffer zone'}]},
  {title:'Plot area mismatch as per document', items:[{key:'risk_5',label:'Approach Road Issue'},{key:'risk_6',label:'Usage Deviation'},{key:'risk_7',label:'Railway Track'}]},
  {title:'Negative Area', items:[{key:'risk_9',label:'HT Line'},{key:'risk_10',label:'Closer to Religious Building'},{key:'risk_11',label:'Graveyard'}]},
  {title:'Building deviation / Boundary Mismatch', items:[{key:'risk_13',label:'Boundary to BDA/BMRDA/Notified areas'},{key:'risk_14',label:'Encroachment'},{key:'risk_15',label:'OS displayed'}]},
  {title:'Zoning Irregularities', items:[{key:'risk_17',label:'Garbage yard'},{key:'risk_18',label:'Any Other'}]},
] as const;

// 11 reference categories; the workbook labels Internal 2, while the reference
// field app additionally contains Internal 1. Both are kept, never fabricated.
export const inspectionPhotoSlots = [
  {key:'road',label:'Road'},
  {key:'address',label:'Address'},
  {key:'front-elevation',label:'Front elevation / plot frontage'},
  {key:'side-elevation',label:'Side elevation / plot side'},
  {key:'internal-1',label:'Internal 1 (reference addition)'},
  {key:'internal-2',label:'Internal 2'},
  {key:'kitchen',label:'Kitchen (where applicable)'},
  {key:'bills-verified',label:'Bills verified (where available)'},
  {key:'selfie-customer',label:'Selfie with customer'},
  {key:'dishaank',label:'Dishaank'},
  {key:'compass',label:'Compass'},
] as const;
export type InspectionPhotoKey=(typeof inspectionPhotoSlots)[number]['key'];
export function inspectionPhotoCategoryFromName(name:string):string|null {
  // Includes photos uploaded from the existing Field Operations category selector.
  const raw=name.includes('__')?name.split('__',1)[0]??'':'';
  const normalized=raw.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(normalized==='selfie-customer'||normalized==='selfie-with-customer')return 'selfie-customer';
  return inspectionPhotoSlots.some(p=>p.key===normalized)?normalized:null;
}
export function inspectionRequiredPhotoSlots(propertyType:string):readonly InspectionPhotoKey[]{
  const shared:InspectionPhotoKey[]=['road','address','front-elevation','side-elevation','dishaank','compass'];
  return propertyType==='Land'?shared:[...shared,'internal-2','selfie-customer'];
}
export function missingInspectionFields(values:Record<string,string>):string[]{
  const missing=inspectionRequiredKeys.filter(k=>!String(values[k]??'').trim());
  const landLength=String(values['land_length']??'').trim();
  const landBreadth=String(values['land_breadth']??'').trim();
  const irregular=String(values['land_dimensions_note']??'').trim();
  const validPositive=(s:string)=>/^(?:[0-9]+(?:\.[0-9]+)?)$/.test(s)&&Number(s)>0;
  if(irregular.length<8&&(!validPositive(landLength)||!validPositive(landBreadth)))missing.push('positive land_length + land_breadth (or irregular-dimensions explanation 8+ characters)');
  return missing;
}

// Legacy Excel photo-note JSON keys retained for backward-compatible saved drafts.
const photoLabels=[
  ['photo_road','Road'],['photo_address','Address'],['photo_front','Front elevation'],
  ['photo_side','Side elevation'],['photo_internal','Internal 2'],['photo_kitchen','Kitchen'],
  ['photo_bills','Bills Verified'],['photo_selfie','Selfie/Customer'],
  ['photo_dishaank','Dishaank'],['photo_compass','Compass']
] as const;

export const inspectionSections:readonly InspectionSection[]=[
  {id:'identification',title:'VALUATION REPORT — Visit & verification',source:'Rows 1–6',layout:'fields',fields:[
    f('visit_date','Date of Visit','date',undefined,undefined,true),
    f('utility_bill_verified','Verified','choice',['Yes','No','Not available']),
    f('utility_bill_type','Electricity/ Water/ Landline/ Gas Bill','choice',['Electricity','Water','Landline','Gas','Other']),
    f('ownership_type','Ownership Type','choice',['Freehold','Lease']),
    f('geotag_remarks','Geo Tag','longtext'),
    f('owner_name','Property owner name','text',undefined,undefined,true),
    f('inspection_contact','Contact Person @ inspection (Name)'),
    f('inspection_contact_mobile','Contact Person @ inspection (Mobile)'),
    f('inspection_contact_relation','Relation to owner'),
    f('identified_through','Property Identified through','longtext')
  ]},
  {id:'basic',title:'1. BASIC DETAILS',source:'Rows 7–24',layout:'fields',fields:[
    f('property_type','Type of property','choice',['Resi','Com','Mix','Land'],undefined,true),
    f('site_address','Property address at site','longtext',undefined,undefined,true),
    f('occupancy','Occupancy','choice',['Self occupied','Tenant','Vacant','Under construction','Owner occupied','Tenant occupied','Mixed'],undefined,true),
    f('occupant_names','Name of Occupants'),
    f('rent_per_unit','Approx. Rent / Unit','number',undefined,'₹'),
    f('property_age','Age of Property','number',undefined,'years'),
    f('completion_percent','% completion','number',undefined,'%'),
    f('floorwise_completion','% comp. in under Construction floorwise','longtext'),
    ...floorNames.map((name,i)=>f(`floor_completion_${i}`,`${name}: % completion`,'number',undefined,'%')),
    f('property_demarcated','Property Demarcated (Yes / No)','choice',['Yes','No','Unable to verify']),
    f('block_count','No.of Blocks','number'),f('floor_count','No.of Floors','number'),f('unit_count','No of Units','number'),
    f('structure_type','Type of Structure','choice',['Load Bearing','Column-Beam']),
    f('roof_type','Roof / Plot','choice',['RCC','Sheet Roof','Vacant Plot']),
    f('property_usage','Usage of Property','longtext'),
    f('apartment_floor','Property located on floor No. (Apartment)','number'),
    f('locality_type','Locality Type','choice',['HIG','MIG','LIG']),
    f('vicinity','Close Vicinity/Landmark','longtext'),
    f('approach_road','Condition of approach road','longtext'),
    f('approach_road_width','Width of approach road','number'),
    f('building_specifications','Building Specification','longtext'),
    f('amenities','Amenities','longtext')
  ]},
  {id:'land',title:'2. Land Actual (L X B)',source:'Row 25',layout:'fields',fields:[
    f('measurement_unit','Measurement unit','choice',['Feet','Metres','Other']),
    f('land_length','Actual Land Length','number'),f('land_breadth','Actual Land Breadth','number'),
    f('land_dimensions_note','Land Actual (L X B) / irregular dimensions','longtext')
  ]},
  {id:'building',title:'3. Building Actual & Building Sketch',source:'Rows 26–37',layout:'fields',fields:[
    f('building_length','Building Actual Length','number'),f('building_breadth','Building Actual Breadth','number'),
    f('building_dimensions_note','Building Actual / Building Sketch','longtext'),
    f('plot_sketch_note','(Compass Direction & Plot sketch)','longtext'),
    f('plot_facing','Front of plot faces (road side)','choice',['East','West','North','South'])
  ]},
  {id:'setbacks',title:'4. Setbacks',source:'Rows 38–42',layout:'setbacks',fields:setbacks.flatMap(s=>[
    f(`setback_${s.key}_plan`,`${s.name} — As per plan/ Bye laws`,'number'),
    f(`setback_${s.key}_actual`,`${s.name} — Actual at site`,'number'),
    f(`setback_${s.key}_remarks`,`${s.name} — Remarks, if any`,'longtext')
  ])},
  {id:'floor_area',title:'5. Floor Wise Area (In Sft.)',source:'Rows 43–47',layout:'floor_area',fields:[
    ...floorNames.map((name,i)=>f(`floor_area_${i}`,`${name} — Actual (Sqft)`,'number',undefined,'Sqft')),
    f('recommended_construction_value','Recommended Construction Value','number',undefined,'₹')
  ]},
  {id:'boundaries',title:'6. Boundaries',source:'Rows 48–52',layout:'boundaries',fields:boundaryNames.flatMap(name=>{
    const key=name.toLowerCase();return [
      f(`boundary_${key}_deed`,`${name} — As per deed`),
      f(`boundary_${key}_site`,`${name} — At site`),
      f(`boundary_${key}_match`,`${name} — Boundaries Matching`,'choice',['Yes','No','Unable to verify'])
    ];
  })},
  {id:'observations',title:'7. Observations',source:'Rows 53–58',layout:'observations',fields:[
    ...inspectionRiskGroups.flatMap(group=>group.items.map(item=>f(item.key,item.label,'choice',['Yes','No','Not checked']))),
    f('risk_remarks','Observations — detailed remarks','longtext')
  ]},
  {id:'land_rate',title:'8. Land Rate Ref:',source:'Row 59',layout:'fields',fields:[
    f('land_rate_reference','Land Rate Ref:','longtext')
  ]},
  {id:'photographs',title:'9. Photographs',source:'Row 60',layout:'photos',fields:[
    ...photoLabels.map(([key,label])=>f(key,`${label} — evidence/photo note`)),
    f('other_notes','Other site inspection remarks','longtext')
  ]}
];

export const inspectionRequiredKeys=[...inspectionSections.flatMap(s=>s.fields).filter(f=>f.required).map(f=>f.key),...(['east','west','north','south'] as const).map(x=>`boundary_${x}_site`)];
