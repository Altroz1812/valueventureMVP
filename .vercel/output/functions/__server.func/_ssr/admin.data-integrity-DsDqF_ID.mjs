import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as RefreshCw } from "../_libs/lucide-react.mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as classifyReadRpcProbe } from "./vp-p5-rpc-diagnostics-DpQIlDMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.data-integrity-DsDqF_ID.js
var import_jsx_runtime = require_jsx_runtime();
/** Uses the signed-in browser session: detects RLS errors that SQL Editor cannot show. */
function DataIntegrityPage() {
	const { tenant, tenantUsers, tenantBranches } = useApp();
	const authorized = Boolean(tenant.adminAccess);
	const test = useQuery({
		queryKey: ["vp-live-data-integrity", tenant.id],
		enabled: authorized,
		staleTime: 0,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			return Promise.all([
				{
					module: "Existing Users",
					table: "users (vp_list_users RPC)",
					link: "/admin/users",
					run: () => vpDb.rpc("vp_list_users")
				},
				{
					module: "Bank / NBFC Clients",
					table: "banks",
					link: "/admin/bank-masters",
					run: () => vpDb.from("banks").select("name", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "Bank Rate Cards",
					table: "vp_bank_rate_cards",
					link: "/admin/bank-masters",
					run: () => vpDb.from("vp_bank_rate_cards").select("bank_name", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "Property Types",
					table: "vp_property_types",
					link: "/admin/bank-masters",
					run: () => vpDb.from("vp_property_types").select("code", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "Branches",
					table: "vp_branches",
					link: "/admin/branches",
					run: () => vpDb.from("vp_branches").select("id", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "Cases",
					table: "cases",
					link: "/cases",
					run: () => vpDb.from("cases").select("num", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "QC Tasks",
					table: "vp_qc_list_tasks RPC",
					link: "/qc-checking",
					run: () => vpDb.rpc("vp_qc_list_tasks")
				},
				{
					module: "Site Visits",
					table: "vp_site_visits",
					link: "/field-operations",
					run: () => vpDb.from("vp_site_visits").select("id", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "Released/Draft Reports",
					table: "vp_report_versions",
					link: "/reports",
					run: () => vpDb.from("vp_report_versions").select("id", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				},
				{
					module: "Invoices",
					table: "invoices",
					link: "/billing-mis",
					run: () => vpDb.from("invoices").select("id", {
						count: "exact",
						head: true
					}).eq("org_id", tenant.id)
				}
			].map(async (item) => {
				try {
					const result = await item.run();
					return {
						module: item.module,
						table: item.table,
						link: item.link,
						count: result.error ? null : Array.isArray(result.data) ? result.data.length : result.count ?? null,
						error: result.error?.message ?? null
					};
				} catch (error) {
					return {
						module: item.module,
						table: item.table,
						link: item.link,
						count: null,
						error: error instanceof Error ? error.message : String(error)
					};
				}
			}));
		}
	});
	const p2Check = useQuery({
		queryKey: ["vp-p2-runtime-readiness", tenant.id],
		enabled: authorized,
		staleTime: 0,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			return Promise.all([{
				name: "Submitted inspection / valuation transfer",
				rpc: "vp_p2_valuer_inspection_for_case"
			}, {
				name: "Reviewed transfer audit history",
				rpc: "vp_p2_transfer_history"
			}].map(async ({ name, rpc }) => {
				try {
					const result = await vpDb.rpc(rpc, { p_case_num: 0 });
					return {
						name,
						diagnosis: classifyReadRpcProbe(result.error)
					};
				} catch (error) {
					return {
						name,
						diagnosis: classifyReadRpcProbe(error)
					};
				}
			}));
		}
	});
	const rows = test.data ?? [];
	const failed = rows.filter((x) => x.error).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Data Connections",
			description: "Read-only checks from the current user's authenticated session. No tables or records are modified.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				disabled: !authorized || test.isFetching,
				onClick: () => void test.refetch(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 size-4" }), " Recheck"]
			})
		}),
		!authorized && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-4 text-sm",
			children: "Tenant administration access is required. This page does not bypass RLS."
		}) }),
		authorized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Organization"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "text-sm",
						children: [
							tenant.name,
							" · ID ",
							tenant.id
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Users in App Context"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "text-2xl font-semibold",
						children: tenantUsers.length
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Branches in App Context"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "text-2xl font-semibold",
						children: tenantBranches.length
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-sm",
				children: "P2 backend readiness (read-only probes)"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "These checks call only the two P2 read functions with a non-existent case number. They do not save valuations or modify records. \"Function reached\" does not prove row-level security across tenants. Verify the P2 write RPC using the separate SQL inventory and authorized staging tests."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: p2Check.isFetching,
						onClick: () => void p2Check.refetch(),
						children: "Recheck P2 functions"
					}),
					p2Check.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking read-only RPCs…" }),
					p2Check.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-destructive",
						children: p2Check.error.message
					}),
					(p2Check.data ?? []).map(({ name, diagnosis }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: diagnosis.state === "missing" || diagnosis.state === "unexpected-error" ? "text-destructive" : "text-muted-foreground",
								children: diagnosis.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: diagnosis.guidance
							})
						]
					}, name)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Also run sql/p5/00_BACKEND_READINESS_READONLY.sql in Supabase SQL Editor. It checks the reviewed-save RPC without executing it."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-sm",
				children: "Live module queries"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					test.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Testing database reads…" }),
					test.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-destructive",
						children: ["Cannot run checks: ", test.error.message]
					}),
					rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-b py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: r.module
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: r.table
							}),
							r.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: r.error
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.error ? "destructive" : "outline",
								children: r.error ? "Query failed" : r.count === 0 ? "0 visible" : `${r.count ?? "—"} visible`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: r.link,
								className: "text-xs text-primary underline",
								children: "Open"
							})]
						})]
					}, r.module)),
					rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [failed, " failed module queries. Zero visible rows may mean no data, filtered data or RLS restrictions; compare with the SQL Editor diagnostic. The bank/client master is public.banks, not the unrelated UUID public.clients schema."]
					})
				]
			})] })
		] })
	] });
}
//#endregion
export { DataIntegrityPage as component };
