/** Presentation-only guidance. No permissions, certification or state transitions. */
export type CaseSection = 'overview'|'documents'|'property'|'inspection'|'valuation'|'certificate'|'history';
export function nextCaseSection(stage:string): {section:CaseSection;label:string;detail:string} {
  switch(stage){
    case 'Initiation': case 'Received': return {section:'documents',label:'Review intake documents',detail:'Check the available documents and property particulars.'};
    case 'Initiation QC': return {section:'inspection',label:'Review initiation QC',detail:'Open the linked quality tasks and assignment details.'};
    case 'Field Visit': case 'Assigned': case 'Visit scheduled': case 'Visit done': return {section:'inspection',label:'Review site inspection',detail:'Open the linked visit and inspection evidence.'};
    case 'Field QC': case 'Checker pending': return {section:'inspection',label:'Review field QC',detail:'Check the recorded inspection and assigned review task.'};
    case 'Report Draft': return {section:'valuation',label:'Open valuation workbench',detail:'Review measurements and analysis before authorized submission.'};
    case 'Final QC': return {section:'inspection',label:'Review Final QC status',detail:'Check the linked quality task. Approval remains with the authorized checker.'};
    case 'Approved': case 'Delivered': case 'Submitted': case 'Invoiced': return {section:'certificate',label:'Open report workspace',detail:'Review the available report versions and release status.'};
    default:return {section:'overview',label:'Review case status',detail:'Confirm the recorded stage before taking further action.'};
  }
}
export function evidenceStatus(count:number|undefined,loading:boolean,failed:boolean):string {
  if(failed)return 'Unavailable'; if(loading||count===undefined)return 'Loading';
  return count===0?'No documents':`${count} registered`;
}
export function previewBar(value:number,total:number):number {
  return Number.isFinite(value)&&Number.isFinite(total)&&total>0?Math.min(100,Math.max(0,value/total*100)):0;
}
