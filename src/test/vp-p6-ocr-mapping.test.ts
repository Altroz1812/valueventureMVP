import { describe,expect,it } from 'vitest';
import { findOcrSuggestions } from '@/lib/vp-ocr-candidates';
import { reviewOcrEvidence } from '@/lib/vp-p4-evidence-review';

describe('P6 saved OCR candidate mapping stays review-only',()=>{
  it('maps exact labelled inspection fields and retains page metadata',()=>{
    const data=findOcrSuggestions([{page:4,truncated:false,text:
      'Ownership Type: Freehold\nOccupancy: Vacant\nNumber of Floors: 3\nPlot Facing: West\nLand Length: 45 ft'}]);
    expect(data.map(x=>[x.field,x.value,x.page])).toEqual([
      ['ownership_type','Freehold',4],['occupancy','Vacant',4],['floor_count','3',4],
      ['plot_facing','West',4],['land_length','45',4],
    ]);
    expect(data.find(row=>row.field==='land_length')?.source_unit).toBe('Feet');
  });
  it('never creates a mapping from unlabeled page contents',()=>{
    expect(findOcrSuggestions([{page:1,truncated:false,text:'₹45,00,000  4 floor  vacant area 120'}])).toEqual([]);
  });
  it('preserves manual unit and conflict review for measurements',()=>{
    const c=findOcrSuggestions([{page:2,truncated:false,text:'Land Length: 50 metres'}])[0];
    expect(c?.field).toBe('land_length');
    if (!c) return;
    expect(reviewOcrEvidence(c,{measurement_unit:'Feet',land_length:'100'}).canAccept).toBe(false);
    expect(reviewOcrEvidence(c,{measurement_unit:'Metres',land_length:'100'}).status).toBe('conflict');
  });
});
