import { vpDb } from '@/lib/vp-db';

const DEFAULT_PAGE_SIZE = 500;

/**
 * Fetch all rows, without silently truncating results at a single page.
 * The caller provides a stable sort key to avoid skipping or repeating rows.
 */
export async function collectPages<T>(
  fetchPage: (start: number, end: number) => Promise<{ data: T[] | null; error: unknown }>,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<T[]> {
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new Error('Invalid page size');
  }
  const all: T[] = [];
  for (let start = 0; ; start += pageSize) {
    const { data, error } = await fetchPage(start, start + pageSize - 1);
    if (error) throw error;
    const page = data ?? [];
    all.push(...page);
    if (page.length < pageSize) return all;
  }
}

/** Consistent, tenant-scoped Supabase pagination for read-only lists. */
export function collectOrgRows<T>(
  table: string,
  columns: string,
  orgId: string,
  sortColumn: string,
  ascending: boolean,
): Promise<T[]> {
  return collectPages<T>(async (start, end) => {
    const { data, error } = await vpDb.from(table).select(columns)
      .eq('org_id', orgId)
      .order(sortColumn, { ascending })
      .range(start, end);
    return { data: data as T[] | null, error };
  });
}
