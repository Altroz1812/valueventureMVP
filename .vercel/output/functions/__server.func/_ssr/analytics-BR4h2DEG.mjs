import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as RefreshCw, dt as Download, l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { a as vp8GetReconciliation, i as vp8GetPlatform, n as vp8GetAudit, o as vp8GetSummary, r as vp8GetBreakdown, s as vp8LogExport, t as useVp8Access } from "./vp-analytics-KLm34ulp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BR4h2DEG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function localDate(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function errorText(e) {
	return e instanceof Error ? e.message : String(e);
}
function count(v) {
	return v == null ? "Not permitted" : Number(v).toLocaleString("en-IN");
}
function money(v) {
	return v == null ? "Not permitted" : `₹${Number(v).toLocaleString("en-IN", {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	})}`;
}
function quoteCSV(v) {
	const s = String(v ?? "");
	return `"${(/^[\s]*[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, "\"\"")}"`;
}
function downloadCSV(name, rows) {
	const raw = "﻿" + rows.map((r) => r.map(quoteCSV).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob([raw], { type: "text/csv;charset=utf-8" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function AnalyticsPage() {
	const { tenant, branch, tenantBranches } = useApp();
	const today = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const [from, setFrom] = (0, import_react.useState)(() => localDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29)));
	const [to, setTo] = (0, import_react.useState)(() => localDate(today));
	const [dimension, setDimension] = (0, import_react.useState)("bank");
	const [auditPage, setAuditPage] = (0, import_react.useState)(0);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const filters = (0, import_react.useMemo)(() => ({
		branchId: branch === "all" ? null : branch,
		from,
		to
	}), [
		branch,
		from,
		to
	]);
	const access = useVp8Access();
	const view = access.data?.view === true;
	const auditAllowed = access.data?.audit === true;
	const financeAllowed = access.data?.billing === true;
	const canExport = access.data?.export === true;
	const summary = useQuery({
		queryKey: [
			"vp8",
			tenant.id,
			"summary",
			filters
		],
		queryFn: () => vp8GetSummary(filters),
		enabled: view
	});
	const groups = useQuery({
		queryKey: [
			"vp8",
			tenant.id,
			"groups",
			dimension,
			filters
		],
		queryFn: () => vp8GetBreakdown(dimension, filters),
		enabled: view
	});
	const audit = useQuery({
		queryKey: [
			"vp8",
			tenant.id,
			"audit",
			auditPage
		],
		queryFn: () => vp8GetAudit(100, auditPage * 100),
		enabled: auditAllowed
	});
	const issues = useQuery({
		queryKey: [
			"vp8",
			tenant.id,
			"recon"
		],
		queryFn: vp8GetReconciliation,
		enabled: auditAllowed && financeAllowed
	});
	const platform = useQuery({
		queryKey: [
			"vp8",
			tenant.id,
			"platform"
		],
		queryFn: vp8GetPlatform,
		enabled: access.data?.platform === true
	});
	const errors = [
		access.error,
		summary.error,
		groups.error,
		audit.error,
		issues.error,
		platform.error
	].filter(Boolean);
	async function exportData(dataset) {
		if (!canExport || !view) return;
		setExporting(true);
		try {
			if (dataset === "audit") {
				if (!auditAllowed) throw new Error("Audit permission required");
				const page = await vp8GetAudit(100, 0);
				const rows = [[
					"Time",
					"Date only",
					"Category",
					"Actor",
					"Event",
					"Case",
					"Source"
				]];
				for (const e of page) rows.push([
					e.event_time,
					e.date_only ? "Yes" : "No",
					e.category,
					e.actor,
					e.description,
					e.case_num,
					e.source_key
				]);
				await vp8LogExport("audit", page.length, {
					branchId: null,
					from: "",
					to: ""
				});
				downloadCSV("valuationpro-audit-latest-100.csv", rows);
				toast.success("Exported up to 100 latest audit events");
			} else {
				if (!financeAllowed) throw new Error("Billing View permission is required for breakdown exports");
				const items = await vp8GetBreakdown(dataset, filters);
				const rows = [[
					"Group",
					"Cases created",
					"Overdue from cohort",
					"Pending QC",
					"Released cases",
					"Invoiced total (₹)"
				]];
				for (const r of items) rows.push([
					r.label,
					r.cases_count,
					r.overdue_cases,
					r.pending_qc,
					r.released_cases,
					r.invoiced_total
				]);
				await vp8LogExport(dataset, items.length, filters);
				downloadCSV(`valuationpro-${dataset}-analytics.csv`, rows);
				toast.success("Exported up to 200 summary groups");
			}
		} catch (e) {
			toast.error(errorText(e));
		} finally {
			setExporting(false);
		}
	}
	const s = summary.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
			title: "Analytics & Audit",
			description: "Real operational analytics, tenant-scoped audit history and reconciliation. No demonstration figures.",
			children: [canExport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				disabled: !view || exporting,
				onClick: () => void exportData(dimension),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), exporting ? "Exporting…" : "Export groups CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => {
					summary.refetch();
					groups.refetch();
					audit.refetch();
					issues.refetch();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Refresh"]
			})]
		}),
		errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 rounded-md border border-destructive/40 p-3 text-sm text-destructive",
			children: ["Analytics error: ", errorText(errors[0])]
		}),
		access.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Checking analytics permissions…"
		}),
		!access.isLoading && !view && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "py-8 text-sm text-muted-foreground",
			children: "This account does not have analytics.View. Ask your administrator to enable Analytics → View in Role Matrix."
		}) }),
		view && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-3 pt-6 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "vp8-from",
							children: "From (case created / event date)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "vp8-from",
							type: "date",
							value: from,
							max: to,
							onChange: (e) => setFrom(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "vp8-to",
							children: "To"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "vp8-to",
							type: "date",
							value: to,
							min: from,
							onChange: (e) => setTo(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end text-xs text-muted-foreground",
							children: [
								"Branch: ",
								branch === "all" ? "Permitted branches" : tenantBranches.find((b) => b.id === branch)?.name ?? "Unknown",
								" (use the existing header selector)"
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					["New cases", count(s?.cases_created)],
					["Open cases (created cohort)", count(s?.open_from_created_cohort)],
					["Overdue cases (created cohort)", count(s?.overdue_from_created_cohort)],
					["Pending QC (created cohort)", count(s?.pending_qc_for_created_cases)],
					["Reports released in period", count(s?.released_reports_during_period)],
					["Visits completed in period", count(s?.completed_visits_during_period)],
					["Invoices issued in period", count(s?.invoices_issued_during_period)],
					["Billed on period invoices", money(s?.invoice_billed_during_period)]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-xs font-medium text-muted-foreground",
						children: label
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl font-semibold",
					children: value
				}) })] }, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Receipts dated in period"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "font-semibold",
						children: money(s?.receipts_recorded_during_period)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Outstanding on period invoices"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "font-semibold",
						children: money(s?.invoice_outstanding_for_period_invoices)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Legacy invoices excluded"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "font-semibold",
						children: count(s?.unlinked_legacy_invoices)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-5 text-xs text-muted-foreground",
				children: "Case cards describe cases created within the selected dates; released reports, visits, and receipts use their event dates. Invoice balance is current for invoices created in the selected dates. Unlinked legacy invoices are excluded from finance totals."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Case cohort performance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dimension,
						onValueChange: (v) => setDimension(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "bank",
								children: "By bank"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "branch",
								children: "By branch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "property",
								children: "By property type"
							})
						] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Group" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Cases"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Overdue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Pending QC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Released"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Invoiced"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(groups.data ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: g.label }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: count(g.cases_count)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: count(g.overdue_cases)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: count(g.pending_qc)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: count(g.released_cases)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: money(g.invoiced_total)
						})
					] }, g.label)), !groups.isLoading && !groups.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 6,
						className: "text-center text-muted-foreground",
						children: "No recorded cases for this date range."
					}) })] })] })
				}) })]
			})
		] }),
		auditAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Audit trail"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Records from existing audit, case, QC, report, payment and export sources. Case log dates have day-level precision."
				})] }), canExport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					disabled: exporting,
					onClick: () => void exportData("audit"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Audit CSV"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date/time" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Module" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Actor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Event" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Case" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(audit.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "whitespace-nowrap text-xs",
						children: a.event_time ? a.date_only ? new Date(a.event_time).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }) : new Date(a.event_time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.actor }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.description }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.case_num ?? "—" })
				] }, a.source_key)), !audit.isLoading && !audit.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "text-center text-muted-foreground",
					children: "No matching audit events."
				}) })] })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-end gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: auditPage === 0,
						onClick: () => setAuditPage((p) => Math.max(0, p - 1)),
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: ["Page ", auditPage + 1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: (audit.data?.length ?? 0) < 100,
						onClick: () => setAuditPage((p) => p + 1),
						children: "Next"
					})
				]
			})] })]
		}),
		auditAllowed && financeAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }), "Billing reconciliation exceptions"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [(issues.data ?? []).length === 0 && !issues.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No exceptions in the first 100 results."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Issue" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reference" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Details" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (issues.data ?? []).map((i, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: i.issue }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: i.reference }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: i.details })
				] }, `${i.issue}:${i.reference}:${n}`)) })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "Exception list is diagnostic only; it never adjusts invoices or creates payments. Unbilled released reports may be intentional."
			})] })]
		}),
		access.data?.platform === true && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Platform overview (aggregate only)"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Organization type" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Organizations" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Users" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Cases" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (platform.data ?? []).map((p, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.org_type }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.org_status }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: count(p.organizations) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: count(p.users_total) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: count(p.cases_total) })
		] }, n)) })] }) })] })
	] });
}
//#endregion
export { AnalyticsPage as component };
