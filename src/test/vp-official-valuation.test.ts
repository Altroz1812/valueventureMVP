
import { describe, it, expect } from 'vitest';
import {
  parseOfficial, safeId, integer, adoptionSelectionKey
} from '../lib/vp-official-valuation';

describe('Official valuation contract', () => {
  it('accepts a case without an official version', () => {
    expect(parseOfficial({version: 0, status: null}).advanced)
      .toBe(false);
  });

  it('preserves the legacy method', () => {
    expect(parseOfficial({
      version: 1,
      status: 'submitted',
      method: 'Land & Building',
      results: {marketValue: 100000},
      adoption: null
    }).advanced).toBe(false);
  });

  it('preserves an adopted advanced valuation', () => {
    const value = parseOfficial({
      version: 2,
      status: 'submitted',
      method: 'P19 comparison',
      results: {marketValue: 1000000},
      adoption: {
        analysis_version: 4,
        export_id: '9223372036854775807',
        reason: 'Reviewed bank workpaper'
      }
    });

    expect(value.advanced).toBe(true);
    expect(value.adoption?.exportId).toBe('9223372036854775807');
  });

  it('rejects an advanced valuation without its adoption', () => {
    expect(() => parseOfficial({
      version: 2,
      status: 'submitted',
      method: 'P19 cost',
      results: {},
      adoption: null
    })).toThrow();
  });

  it('rejects unsafe numeric identifiers', () => {
    expect(() => safeId(Number.MAX_SAFE_INTEGER + 1)).toThrow();
    expect(() => safeId('9223372036854775808')).toThrow();
    expect(() => safeId('1.5')).toThrow();
  });

  it('rejects malformed versions and responses', () => {
    expect(() => integer(-1)).toThrow();
    expect(() => integer('1')).toThrow();
    expect(() => parseOfficial(null)).toThrow();
    expect(() => parseOfficial({version: 1})).toThrow();
  });
});

describe('Adoption selection consistency', () => {
  it('binds confirmation to official valuation version', () => {
    expect(adoptionSelectionKey(2, 4, '12'))
      .not.toBe(adoptionSelectionKey(3, 4, '12'));
  });

  it('invalidates confirmation when analysis changes', () => {
    expect(adoptionSelectionKey(2, 4, '12'))
      .not.toBe(adoptionSelectionKey(2, 5, '12'));
  });

  it('invalidates confirmation when workpaper changes', () => {
    expect(adoptionSelectionKey(2, 4, '12'))
      .not.toBe(adoptionSelectionKey(2, 4, '13'));
  });

  it('preserves bigint identifiers without precision loss', () => {
    expect(adoptionSelectionKey(
      2, 4, '9223372036854775807'
    )).toBe('2:4:9223372036854775807');
  });
});
