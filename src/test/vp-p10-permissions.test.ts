import { describe, it, expect } from 'vitest';
import { mayOpenPath } from '@/lib/vp-p10-permissions';

describe('P10 role matrix navigation (backend must independently deny)', () => {
  it('denies operational modules when every checkbox is unchecked', () => {
    const adminRecoveryOnly = ['tenant.admin'];
    for (const path of ['/cases','/field-operations','/qc-checking','/reports','/billing-mis','/analytics'])
      expect(mayOpenPath(path, adminRecoveryOnly)).toBe(false);
    expect(mayOpenPath('/admin/users', adminRecoveryOnly)).toBe(true);
    expect(mayOpenPath('/admin/roles-permissions', adminRecoveryOnly)).toBe(true);
  });
  it('always allows the safe home route, without granting analytics data', () => {
    expect(mayOpenPath('/', [])).toBe(true);
    expect(mayOpenPath('/analytics', [])).toBe(false);
  });
  it('denies direct URLs, not just sidebar entries', () => {
    expect(mayOpenPath('/cases/121', [])).toBe(false);
    expect(mayOpenPath('/field-inspections/8', [])).toBe(false);
    expect(mayOpenPath('/admin/users', ['cases.View'])).toBe(false);
    expect(mayOpenPath('/unknown-private-page', ['cases.View'])).toBe(false);
  });
  it('allows specifically permitted modules and assigned field workflow routes', () => {
    expect(mayOpenPath('/cases', ['cases.View'])).toBe(true);
    expect(mayOpenPath('/cases/121', ['field.Check In/Out'])).toBe(true);
    expect(mayOpenPath('/field-inspections/8', ['field.Check In/Out'])).toBe(true);
    expect(mayOpenPath('/qc-checking', ['qc.View'])).toBe(true);
    expect(mayOpenPath('/billing-mis', ['cases.View'])).toBe(false);
  });
});
