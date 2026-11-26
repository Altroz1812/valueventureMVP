import { describe, expect, it } from 'vitest';
import { inspectionReadiness } from '@/lib/vp-p7-inspection-diagnostics';
import { preferredOcrDocument, savedOcrPreview } from '@/lib/vp-p7-ocr-visibility';
import type { SavedOcrBatch } from '@/lib/vp-p6-ocr-register';

describe('P7 inspection recovery keeps server authorization authoritative', () => {
  it('classifies a missing P0 function without granting access', () => {
    const r = inspectionReadiness({code:'PGRST202',message:'Could not find the function public.vp_p0_inspection_access(p_visit_id) in schema cache'});
    expect(r.state).toBe('missing');
    expect(r.action).toContain('P0');
  });
  it('distinguishes missing from server permission denial and tenant mismatch', () => {
    expect(inspectionReadiness({code:'42501',message:'permission denied'}).state).toBe('restricted');
    expect(inspectionReadiness({message:'Visit not found in your organization'}).state).toBe('visit-denied');
    expect(inspectionReadiness(null).state).toBe('available');
  });
});

describe('P7 saved OCR visibility is read-only', () => {
  const docs = [
    {id:'11',mime:'application/pdf',storage_path:null},
    {id:'12',mime:'image/png',storage_path:'2/1/a.png'},
    {id:'13',mime:'application/pdf',storage_path:'2/1/b.pdf'},
  ];
  it('defaults to a registered OCR-capable file and honors explicit choice', () => {
    expect(preferredOcrDocument(docs,'')?.id).toBe('12');
    expect(preferredOcrDocument(docs,'13')?.id).toBe('13');
    expect(preferredOcrDocument(docs,'unknown')?.id).toBe('12');
  });
  it('converts immutable saved batches to unverified preview without applying fields', () => {
    const batch: SavedOcrBatch = {
      id:'7',document_id:'12',case_num:1,language:'eng',
      pages:[{page:6,text:'Owner Name: A',truncated:false}],
      candidates:[],pdf_page_count:12,status:'UNVERIFIED',created_at:'2026-11-15T00:00:00Z',
    };
    const preview=savedOcrPreview(batch,'registered.pdf');
    expect(preview.document_id).toBe('12');
    expect(preview.pages[0]?.page).toBe(6);
    expect(preview.processing_limit).toContain('UNVERIFIED');
    expect(preview).not.toHaveProperty('appliedValues');
  });
});
