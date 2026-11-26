import { describe, expect, it, vi } from 'vitest';

// Pagination is pure; prevent creation of a real Supabase client in unit tests.
vi.mock('@/lib/vp-db', () => ({ vpDb: {} }));
import { collectPages } from '@/lib/vp-query';

describe('collectPages', () => {
  it('collects all pages without skipping a final partial page', async () => {
    const ranges: Array<[number, number]> = [];
    const rows = await collectPages<number>(async (start, end) => {
      ranges.push([start, end]);
      return { data: [1, 2, 3, 4, 5].slice(start, end + 1), error: null };
    }, 2);
    expect(rows).toEqual([1, 2, 3, 4, 5]);
    expect(ranges).toEqual([[0, 1], [2, 3], [4, 5]]);
  });
  it('propagates server errors without returning truncated data', async () => {
    await expect(collectPages(async () => ({ data: [], error: new Error('RLS denied') })))
      .rejects.toThrow('RLS denied');
  });
  it('rejects invalid pagination sizes', async () => {
    await expect(collectPages(async () => ({ data: [], error: null }), 0))
      .rejects.toThrow('Invalid page size');
  });
});
