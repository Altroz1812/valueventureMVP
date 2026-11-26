declare module 'xlsx-populate/browser/xlsx-populate-no-encryption.js' {
 interface Cell { formula():string|undefined; value():unknown; value(v:string|number|boolean|undefined):Cell; }
 interface Sheet { name():string; cell(address:string):Cell; }
 interface Workbook { sheets():Sheet[]; sheet(name:string):Sheet|undefined; addSheet(name:string):Sheet; outputAsync(options:{type:'blob'}):Promise<Blob>; }
 const XlsxPopulate:{fromDataAsync(data:Uint8Array):Promise<Workbook>};
 export default XlsxPopulate;
}
