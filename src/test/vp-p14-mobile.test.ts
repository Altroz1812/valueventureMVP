import { describe, expect, it } from 'vitest';
import { filterMobileVisits, scopedMobileVisits } from '@/lib/vp-p14-mobile';
import type { FieldVisit } from '@/lib/vp-field';
import type { VpCase } from '@/lib/vp-cases';

const visit=(id:string,owner:string,status:FieldVisit['status'],num:number):FieldVisit => ({
  id, org_id:'2',num,assigned_user_id:owner,status,scheduled_at:'2026-11-17T09:00:00Z',
  min_photos:8,photo_count:0,target_lat:null,target_lng:null,radius_m:null,max_accuracy_m:null,
  checkin_at:null,checkin_accuracy_m:null,checkin_distance_m:null,checkin_verified:null,
  checkout_at:null,checkout_accuracy_m:null,checkout_distance_m:null,checkout_verified:null,
});

describe('P14 mobile Field Officer visit scoping', () => {
  const data=[visit('1','101','Scheduled',14),visit('2','202','On site',15),visit('3','101','Completed',16),visit('4','101','Cancelled',17)];
  it('shows only own active visits even if case listing is empty',()=>{
    const rows=scopedMobileVisits(data,[], '101',false,'other-branch');
    expect(rows.map(row=>row.v.id)).toEqual(['1','3']);
    expect(rows[0]?.c).toBeUndefined();
  });
  it('restricts managers by selected branch where case data exists',()=>{
    const cases=[{caseNum:14,branchId:'br-a'},{caseNum:15,branchId:'br-b'}] as VpCase[];
    const rows=scopedMobileVisits(data,cases,'101',true,'br-a');
    expect(rows.map(row=>row.v.id)).toEqual(['1']);
  });
  it('filters scheduled, on-site, and completed without changing source rows',()=>{
    const rows=scopedMobileVisits(data,[],'101',false,'all');
    expect(filterMobileVisits(rows,'scheduled').map(row=>row.v.id)).toEqual(['1']);
    expect(filterMobileVisits(rows,'completed').map(row=>row.v.id)).toEqual(['3']);
    expect(filterMobileVisits(rows,'onsite')).toHaveLength(0);
    expect(rows).toHaveLength(2);
  });
});
