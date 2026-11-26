import {describe,it,expect} from 'vitest';
import {P18_CATEGORIES,defaultTemplate,decodeSnapshot,encodeSnapshot,parseFields,normalizeValues} from '@/lib/vp-p18-templates';
describe('P18 template model',()=>{
 for(const category of P18_CATEGORIES)it(`${category} default template roundtrips`,()=>{const t=defaultTemplate(category);expect(decodeSnapshot(encodeSnapshot(t,{}))).toEqual({template:t,values:{}});});
 const t=defaultTemplate('Flat');
 it('preserves numeric zero',()=>expect(decodeSnapshot(encodeSnapshot(t,{uds_deed:0}))?.values['uds_deed']).toBe(0));
 it('rejects string numbers',()=>expect(()=>encodeSnapshot(t,{uds_deed:'2'})).toThrow());
 it('rejects negative values',()=>expect(()=>encodeSnapshot(t,{uds_deed:-1})).toThrow());
 it('rejects unknown choice',()=>expect(()=>encodeSnapshot(defaultTemplate('Land'),{land_use:'invalid'})).toThrow());
 it('ignores non-template keys',()=>expect(normalizeValues(t,{unknown:1})).toEqual({}));
 it('rejects duplicate fields',()=>expect(()=>parseFields([t.fields[0],t.fields[0]])).toThrow());
 it('rejects prototype fields',()=>expect(()=>parseFields([{key:'constructor',label:'bad',type:'text'}])).toThrow());
 it('rejects malformed snapshots',()=>expect(()=>decodeSnapshot('{bad')).toThrow());
 it('accepts legacy missing snapshot',()=>expect(decodeSnapshot(undefined)).toBeNull());
});
