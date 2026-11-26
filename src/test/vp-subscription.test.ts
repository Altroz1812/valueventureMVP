import { describe, expect, it } from 'vitest';
import { usageMetric, parseSubscription, mayShowSubscription, parseGrowthMode } from '@/lib/vp-subscription';
const fixture = {org_id:'1',plan_name:'Legacy',status:'unassigned',enforcement:'monitoring',usage:{users:4,branches:2,monthly_cases:50},limits:{users:null,branches:null,monthly_cases:null}};
describe('P33 subscription monitoring', () => {
  it('calculates percentage', () => expect(usageMetric(10,20).percent).toBe(50));
  it('flags exceeded limits', () => expect(usageMetric(25,20)).toMatchObject({percent:100,overLimit:true}));
  it('accepts equality', () => expect(usageMetric(20,20).overLimit).toBe(false));
  it('handles no limit', () => expect(usageMetric(500,null).percent).toBeNull());
  it('rejects invalid usage', () => {for(const n of [-1,'10',1.5]) expect(()=>usageMetric(n,20)).toThrow();});
  it('rejects invalid limits', () => {for(const n of [0,undefined,'20']) expect(()=>usageMetric(5,n)).toThrow();});
  it('rejects cross-tenant responses', () => expect(()=>parseSubscription(fixture,'2')).toThrow());
  it('parses expected response', () => expect(parseSubscription(fixture,'1').cases.used).toBe(50));
  it('rejects unknown status', () => expect(()=>parseSubscription({...fixture,status:'unknown'},'1')).toThrow());
  it('only displays for tenant administrators at home', () => {expect(mayShowSubscription('/', ['tenant.admin'])).toBe(true);expect(mayShowSubscription('/', ['analytics.View'])).toBe(false);expect(mayShowSubscription('/cases',['tenant.admin'])).toBe(false);});
});

describe('P33 growth mode', () => {
  it('reads both modes', () => {expect(parseGrowthMode({org_id:'1',enforcement:'growth'},'1')).toBe('growth');expect(parseGrowthMode({org_id:'1',enforcement:'monitoring'},'1')).toBe('monitoring');});
  it('rejects mismatched context and missing or unknown modes', () => {for(const value of [null,{org_id:'2',enforcement:'growth'},{org_id:'1',enforcement:'unknown'},{org_id:'1'}]) expect(()=>parseGrowthMode(value,'1')).toThrow();});
});
