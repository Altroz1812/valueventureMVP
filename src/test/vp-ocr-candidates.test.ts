import { describe, expect, it } from 'vitest';
import { findOcrSuggestions } from '@/lib/vp-ocr-candidates';

describe('P3 OCR suggestions are conservative and page referenced', () => {
  it('finds explicit labelled fields with page provenance', () => {
    const results = findOcrSuggestions([
      {page:2,truncated:false,text:'Owner Name: Lakshmi Rao\nLand Length: 40 ft\nLand Breadth: 30.5 ft\nPlot Facing: East'},
    ]);
    expect(results.map(x=>[x.field,x.value,x.page])).toEqual([
      ['owner_name','Lakshmi Rao',2],['land_length','40',2],['land_breadth','30.5',2],['plot_facing','East',2],
    ]);
  });
  it('does not mistake arbitrary amounts and unlabeled numbers for measurements', () => {
    expect(findOcrSuggestions([{page:1,truncated:false,text:'Rs 4000000\n15 x 30\n60 feet road\nGSTIN 36ABCDE'}])).toEqual([]);
  });
  it('rejects malformed or implausible labels and preserves originals in source_line', () => {
    const results=findOcrSuggestions([{page:3,truncated:false,text:'Land Length: 3000000000\nProperty Address: Plot 5, Hyderabad\nPlot Facing: Sideways'}]);
    expect(results).toHaveLength(1);
    expect(results[0]?.field).toBe('site_address');
    expect(results[0]?.source_line).toBe('Property Address: Plot 5, Hyderabad');
  });
});
