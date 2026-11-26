import { describe, expect, it } from 'vitest';
import { verifyInspectionReadback, verifyOcrReadback } from '../lib/vp-p8-persistence-verification';

describe('P8 server persistence verification',()=>{
  it('confirms exact saved inspection fields, including OCR source provenance',()=>{
    const expected={owner_name:'Verified owner',__vp_field_sources_v1:'{"owner_name":{"source":"OCR Page 1"}}'};
    expect(verifyInspectionReadback(expected,{status:'Draft',data:{...expected}},false).verified).toBe(true);
    expect(verifyInspectionReadback(expected,{status:'Draft',data:{owner_name:'Verified owner'}},false).verified).toBe(false);
  });
  it('rejects readback data mismatches and missing submission status',()=>{
    expect(verifyInspectionReadback({site_address:'A'},{status:'Draft',data:{site_address:'B'}},false).verified).toBe(false);
    expect(verifyInspectionReadback({site_address:'A'},{status:'Draft',data:{site_address:'A'}},true).verified).toBe(false);
  });
  it('confirms document, case, language, and exact OCR page text',()=>{
    const batch={id:'9',document_id:'12',case_num:1,language:'eng',pages:[{page:3,text:'Owner Name: A'}]};
    expect(verifyOcrReadback('9','12',1,'eng',[{page:3,text:'Owner Name: A'}],[batch]).verified).toBe(true);
    expect(verifyOcrReadback('9','12',1,'eng',[{page:3,text:'Owner Name: B'}],[batch]).verified).toBe(false);
    expect(verifyOcrReadback('10','12',1,'eng',[{page:3,text:'Owner Name: A'}],[batch]).verified).toBe(false);
    expect(verifyOcrReadback('9','13',1,'eng',[{page:3,text:'Owner Name: A'}],[batch]).verified).toBe(false);
  });
});
