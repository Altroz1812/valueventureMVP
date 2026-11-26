import { o as vpDb } from "./vp-session-C-vOghu2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-query-NYEPg70J.js
var DEFAULT_PAGE_SIZE = 500;
/**
* Fetch all rows, without silently truncating results at a single page.
* The caller provides a stable sort key to avoid skipping or repeating rows.
*/
async function collectPages(fetchPage, pageSize = DEFAULT_PAGE_SIZE) {
	if (!Number.isInteger(pageSize) || pageSize <= 0) throw new Error("Invalid page size");
	const all = [];
	for (let start = 0;; start += pageSize) {
		const { data, error } = await fetchPage(start, start + pageSize - 1);
		if (error) throw error;
		const page = data ?? [];
		all.push(...page);
		if (page.length < pageSize) return all;
	}
}
/** Consistent, tenant-scoped Supabase pagination for read-only lists. */
function collectOrgRows(table, columns, orgId, sortColumn, ascending) {
	return collectPages(async (start, end) => {
		const { data, error } = await vpDb.from(table).select(columns).eq("org_id", orgId).order(sortColumn, { ascending }).range(start, end);
		return {
			data,
			error
		};
	});
}
//#endregion
export { collectPages as n, collectOrgRows as t };
