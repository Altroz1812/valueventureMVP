import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-analytics-KLm34ulp.js
function err(error) {
	if (error) throw new Error(error.message);
}
function args(f) {
	return {
		p_branch_id: f.branchId,
		p_from: f.from || null,
		p_to: f.to || null
	};
}
async function vp8GetAccess() {
	const [v, a, e, b, p] = await Promise.all([
		vpDb.rpc("vp8_can", { p_action: "View" }),
		vpDb.rpc("vp8_can", { p_action: "Audit" }),
		vpDb.rpc("vp8_can", { p_action: "Export" }),
		vpDb.rpc("vp_billing_can", { p_action: "View" }),
		vpDb.rpc("vp8_platform_can")
	]);
	for (const x of [
		v,
		a,
		e,
		b,
		p
	]) err(x.error);
	return {
		view: v.data === true,
		audit: a.data === true,
		export: e.data === true,
		billing: b.data === true,
		platform: p.data === true
	};
}
function useVp8Access() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp8",
			tenant.id,
			"access",
			tenant.role
		],
		queryFn: vp8GetAccess,
		staleTime: 15e3
	});
}
async function vp8GetSummary(filters) {
	const { data, error } = await vpDb.rpc("vp8_summary", args(filters));
	err(error);
	if (!data) throw new Error("No analytics summary returned");
	return data;
}
async function vp8GetBreakdown(dimension, filters) {
	const { data, error } = await vpDb.rpc("vp8_breakdown", {
		p_dimension: dimension,
		...args(filters)
	});
	err(error);
	return data ?? [];
}
async function vp8GetAudit(limit = 100, offset = 0) {
	const { data, error } = await vpDb.rpc("vp8_audit_feed", {
		p_limit: limit,
		p_offset: offset
	});
	err(error);
	return data ?? [];
}
async function vp8GetReconciliation() {
	const { data, error } = await vpDb.rpc("vp8_reconciliation", { p_limit: 100 });
	err(error);
	return data ?? [];
}
async function vp8GetPlatform() {
	const { data, error } = await vpDb.rpc("vp8_platform_overview");
	err(error);
	return data ?? [];
}
async function vp8LogExport(dataset, rowCount, filters) {
	const { error } = await vpDb.rpc("vp8_record_export", {
		p_dataset: dataset,
		p_row_count: rowCount,
		...args(filters)
	});
	err(error);
}
//#endregion
export { vp8GetReconciliation as a, vp8GetPlatform as i, vp8GetAudit as n, vp8GetSummary as o, vp8GetBreakdown as r, vp8LogExport as s, useVp8Access as t };
