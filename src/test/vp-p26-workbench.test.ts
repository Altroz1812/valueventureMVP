import { describe, expect, it } from 'vitest';
import { nextCaseSection, evidenceStatus, previewBar } from '@/lib/vp-workbench';
describe('workbench presentation',()=>{
  it.each([['Initiation','documents'],['Received','documents'],['Initiation QC','inspection'],['Field Visit','inspection'],['Assigned','inspection'],['Field QC','inspection'],['Report Draft','valuation'],['Final QC','inspection'],['Approved','certificate'],['Delivered','certificate'],['Rework','overview'],['Unexpected','overview']])('maps %s to %s',(stage,section)=>{expect(nextCaseSection(stage).section).toBe(section);});
  it('distinguishes unavailable data from empty evidence',()=>{expect(evidenceStatus(0,false,false)).toBe('No documents');expect(evidenceStatus(0,true,true)).toBe('Unavailable');expect(evidenceStatus(undefined,true,false)).toBe('Loading');expect(evidenceStatus(7,false,false)).toBe('7 registered');});
  it.each([[50,100,50],[0,0,0],[-20,100,0],[120,100,100],[NaN,100,0],[50,Infinity,0]])('normalizes %s / %s to %s',(value,total,expected)=>{expect(previewBar(value,total)).toBe(expected);});
});
