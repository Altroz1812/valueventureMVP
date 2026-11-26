import {describe,it,expect} from 'vitest';
import {previewable,selectedEvidence,filterEvidence,comparisonStatus} from '@/lib/vp-p27-evidence';
const doc={id:'1',name:'Sale deed.pdf',mime:'application/pdf',storage_path:'7/12/deed.pdf'};
const legacy={id:'2',name:'Old record',mime:'application/pdf',storage_path:null};
describe('P27 evidence workbench',()=>{
 it('permits matching registered context only',()=>{expect(previewable(doc,'7',12)).toBe(true);expect(previewable(doc,'8',12)).toBe(false);expect(previewable(doc,'7',1)).toBe(false);expect(previewable(doc,'7',0)).toBe(false);});
 it('rejects unsupported paths and types',()=>{for(const d of [legacy,{...doc,mime:'text/html'},{...doc,storage_path:'7/12/'},{...doc,storage_path:'7/12/../other.pdf'},{...doc,storage_path:'7/12/a\\b.pdf'}])expect(previewable(d,'7',12)).toBe(false);});
 it('selects an explicit registered or legacy record, prefers file otherwise',()=>{expect(selectedEvidence([legacy,doc],'')?.id).toBe('1');expect(selectedEvidence([legacy,doc],'2')?.id).toBe('2');expect(selectedEvidence([], '')).toBeUndefined();});
 it('filters literal document names',()=>{expect(filterEvidence([doc,legacy],' SALE ').map(d=>d.id)).toEqual(['1']);expect(filterEvidence([doc,legacy],'none')).toEqual([]);});
 it('compares values without assuming missing or differing records match',()=>{expect(comparisonStatus('', '')).toBe('Missing');expect(comparisonStatus('a',null)).toBe('Missing');expect(comparisonStatus(' A ','A')).toBe('Same');expect(comparisonStatus('A','B')).toBe('Different');expect(comparisonStatus(0,0)).toBe('Same');});
});
