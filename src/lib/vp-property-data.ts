export const PROPERTY_CATEGORIES=['Land','House','Flat','Commercial','Industrial','Agricultural','Other'] as const;
export const AREA_UNITS=['sqyd','sqft','sqm','acre','gunta','cent','hectare'] as const;
export type AreaUnit=typeof AREA_UNITS[number];
export type Parcel={survey_no:string;plot_no:string;deed_area:number|null;deed_unit:AreaUnit;actual_area:number|null;actual_unit:AreaUnit;notes:string};
export type Owner={name:string;interest:string;share_pct:number|null;from_date:string;to_date:string;evidence:string};
export type DocumentReference={kind:string;reference:string;date:string;sro:string;notes:string};
export type PropertyData={category:typeof PROPERTY_CATEGORIES[number];label:string;address:string;state:string;district:string;mandal:string;village:string;pincode:string;municipality:string;landmark:string;road_access:string;notes:string;flat_no:string;building_name:string;east_deed:string;west_deed:string;north_deed:string;south_deed:string;east_actual:string;west_actual:string;north_actual:string;south_actual:string;latitude:number|null;longitude:number|null;parcels:Parcel[];owners:Owner[];documents:DocumentReference[]};
export type PropertyRecord={id:string;current_revision:number;data:PropertyData;updated_at:string};
export type PropertyRevision={revision:number;data:PropertyData;reason:string;recorded_at:string;recorded_by:string};
export type PropertyLink={num:number;link_version:number;property_id:string;property_revision:number;reason:string;linked_at:string;linked_by:string};
export const emptyParcel=():Parcel=>({survey_no:'',plot_no:'',deed_area:null,deed_unit:'sqyd',actual_area:null,actual_unit:'sqyd',notes:''});
export const emptyOwner=():Owner=>({name:'',interest:'',share_pct:null,from_date:'',to_date:'',evidence:''});
export const emptyDocument=():DocumentReference=>({kind:'',reference:'',date:'',sro:'',notes:''});
export const emptyProperty=():PropertyData=>({category:'Land',label:'',address:'',state:'',district:'',mandal:'',village:'',pincode:'',municipality:'',landmark:'',road_access:'',notes:'',flat_no:'',building_name:'',east_deed:'',west_deed:'',north_deed:'',south_deed:'',east_actual:'',west_actual:'',north_actual:'',south_actual:'',latitude:null,longitude:null,parcels:[],owners:[],documents:[]});
export function propertyError(e:unknown):string {if(e instanceof Error)return e.message;if(e&&typeof e==='object'&&'message' in e)return String(e.message);return String(e);}
export function validateProperty(d:PropertyData):string|null {
 if(!d.label.trim()||!d.address.trim()||!d.state.trim()||!d.district.trim())return 'Name, address, state and district are required.';
 if(d.label.length>200||d.address.length>2000)return 'Name or address is too long.';
 if(d.pincode&&!/^[1-9][0-9]{5}$/.test(d.pincode))return 'PIN must contain six digits.';
 if((d.latitude===null)!==(d.longitude===null))return 'Enter both coordinates or neither.';
 if((d.latitude!==null&&(!Number.isFinite(d.latitude)||Math.abs(d.latitude)>90))||(d.longitude!==null&&(!Number.isFinite(d.longitude)||Math.abs(d.longitude)>180)))return 'Coordinates out of range.';
 if([d.parcels,d.owners,d.documents].some(a=>a.length>100))return 'Maximum 100 entries per section.';
 for(const p of d.parcels){if(!p.survey_no.trim()&&!p.plot_no.trim())return 'Each parcel needs a survey or plot number.';if([p.deed_area,p.actual_area].some(n=>n!==null&&(!Number.isFinite(n)||n<=0||n>1e12)))return 'Parcel areas must be positive.';}
 for(const o of d.owners){if(!o.name.trim())return 'Owner name is required.';if(o.share_pct!==null&&(!Number.isFinite(o.share_pct)||o.share_pct<0||o.share_pct>100))return 'Ownership share must be between 0 and 100.';if(o.from_date&&o.to_date&&o.from_date>o.to_date)return 'Ownership end precedes start.';}
 for(const dref of d.documents)if(!dref.kind.trim()||!dref.reference.trim())return 'Document type and reference are required.';
 return null;
}
