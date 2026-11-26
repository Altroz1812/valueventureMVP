import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Plus, T as Receipt, X as IndianRupee, dt as Download, h as Settings2, l as TriangleAlert, pt as CreditCard } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, c as Dialog, d as DialogFooter, f as DialogHeader, i as CardContent, l as DialogContent, n as Button, o as CardHeader, p as DialogTitle, r as Card, s as CardTitle, t as AppShell, u as DialogDescription, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table$2 } from "./table-DV5SRygD.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { a as VpFin04D2Accounts, i as VpFin04CReview, n as VpFin04BReview } from "./vp-fin04b-journeys-CGkmckj8.mjs";
import { r as StatCard } from "./ops-ui-CJPu_Wj9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-mis-ClfRZuXt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var registers = {
	invoices: {
		label: "Invoice / GST supporting register",
		date: "Invoice date",
		cols: "batch_id branch client invoice_no invoice_date due_on supplier_gstin recipient_gstin place_of_supply sac einvoice_status taxable cgst sgst igst total bank_received tds_credit outstanding"
	},
	settlements: {
		label: "Bank receipt & TDS allocations",
		date: "Receipt date",
		cols: "settlement_id batch_id branch client invoice_no kind received_on reference status allocation_amount current_credit"
	},
	claims: {
		label: "Approved employee claims",
		date: "Claim month (first day)",
		cols: "claim_id employee_id employee branch month_start status original_amount reduction net_approved cash_paid advance_applied outstanding"
	},
	payments: {
		label: "Reimbursement payments",
		date: "Payment date",
		cols: "payment_id claim_id employee_id branch payment_day reference status amount reversed current_cash_paid"
	},
	advances: {
		label: "Advance & adjustment movements",
		date: "Entry date",
		cols: "entry_id employee_id branch kind status entry_day reference claim_id advance_id payment_id allocation_id amount advance_remaining"
	},
	legacy_flags: {
		label: "Possible legacy overlaps",
		date: "Invoice date / claim month",
		cols: "issue record_id branch record_date"
	},
	reconciliation: {
		label: "Current balance reconciliation",
		date: "All visible FIN history (dates ignored)",
		cols: "check_name difference result"
	}
};
var money$7 = new Set("taxable cgst sgst igst total bank_received tds_credit outstanding allocation_amount current_credit original_amount reduction net_approved cash_paid advance_applied amount current_cash_paid advance_remaining difference".split(" "));
var str$2 = (v) => v === null || v === void 0 ? "" : typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : (() => {
	throw new Error("Unexpected non-scalar register value");
})();
function obj$5(v) {
	if (v === null || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid register response");
	return v;
}
function csvCell(v, numeric = false) {
	let s = str$2(v);
	if (numeric && s !== "" && !/^-?\d+(\.\d+)?$/.test(s)) throw new Error("Invalid numeric field");
	if (!numeric && (/^[\s\u0000-\u001f]*[=+\-@＝＋－＠]/u.test(s) || /^[\t\r\n]/.test(s))) s = "'" + s;
	return "\"" + s.replace(/"/g, "\"\"") + "\"";
}
function todayIST() {
	return new Date(Date.now() + 198e5).toISOString().slice(0, 10);
}
function decode$2(v, org, reg, from, to) {
	const r = obj$5(v);
	if (r["org_id"] !== org || r["register"] !== reg || r["scope"] !== "current_fin_register_v1" || r["currency"] !== "INR" || r["from"] !== from || r["to"] !== to || typeof r["generated_at"] !== "string") throw new Error("Register scope mismatch");
	const raw = r["items"];
	if (!Array.isArray(raw) || raw.length > 5e3 || raw.length !== r["count"]) throw new Error("Invalid register row count");
	const cols = registers[reg].cols.split(" ");
	const rows = raw.map(obj$5);
	for (const row of rows) for (const k of cols) {
		if (!Object.prototype.hasOwnProperty.call(row, k)) throw new Error("Missing field: " + k);
		csvCell(row[k], money$7.has(k));
	}
	return {
		reg,
		from,
		to,
		generated: r["generated_at"],
		rows
	};
}
function download(data, org) {
	const cols = registers[data.reg].cols.split(" ");
	const lines = [[...[
		"workspace_id",
		"register",
		"cohort_from",
		"cohort_to",
		"generated_at",
		"balance_basis",
		"currency"
	], ...cols].map((k) => csvCell(k)).join(",")];
	for (const r of data.rows) lines.push([...[
		org,
		data.reg,
		data.from,
		data.to,
		data.generated,
		data.reg === "reconciliation" ? "all_visible_fin_history" : "current_not_historical",
		"INR"
	].map((v) => csvCell(v)), ...cols.map((k) => csvCell(r[k], money$7.has(k)))].join(","));
	const blob = new Blob(["﻿" + lines.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob), a = document.createElement("a");
	a.href = url;
	a.download = `FIN05C_${data.reg}_${data.from}_${data.to}.csv`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function VpFin05CRegisters() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Registers, { org: tenant.id }, tenant.id) : null;
}
function Registers({ org }) {
	const [reg, setReg] = (0, import_react.useState)("invoices"), [from, setFrom] = (0, import_react.useState)(() => todayIST().slice(0, 8) + "01"), [to, setTo] = (0, import_react.useState)(todayIST), [data, setData] = (0, import_react.useState)(null), [busy, setBusy] = (0, import_react.useState)(false), [err, setErr] = (0, import_react.useState)("");
	const clear = () => {
		setData(null);
		setErr("");
	};
	async function load() {
		clear();
		setBusy(true);
		try {
			const { data: raw, error } = await vpDb.rpc("vp_fin05c_register", {
				p_register: reg,
				p_from: from,
				p_to: to
			});
			if (error) throw new Error(error.message);
			setData(decode$2(raw, org, reg, from, to));
		} catch (e) {
			setErr(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	const cols = registers[reg].cols.split(" ");
	const disabled = busy || from === "" || to === "" || from > to;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-4 space-y-3 rounded-lg border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: "Accounts registers & reconciliation · FIN-05C"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Current FIN ledgers only · CSV for accounts / CA review · INR"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded border p-2 text-xs",
				children: "Dates select transaction cohorts, not historical as-of balances. Amounts reflect current posting/reversal status. Settlement amounts are allocation-level; advance movements are different accounting events and must not be summed as expenses. GST/TDS fields are supporting data, not statutory filings. Legacy flags require manual investigation; no records are imported or changed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["Register", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							disabled: busy,
							className: "block rounded border bg-background p-2",
							value: reg,
							onChange: (e) => {
								setReg(e.target.value);
								clear();
							},
							children: Object.keys(registers).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: registers[k].label
							}, k))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "block rounded border bg-background p-2",
							disabled: busy,
							value: from,
							max: todayIST(),
							onChange: (e) => {
								setFrom(e.target.value);
								clear();
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							className: "block rounded border bg-background p-2",
							disabled: busy,
							value: to,
							max: todayIST(),
							onChange: (e) => {
								setTo(e.target.value);
								clear();
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled,
						className: "rounded border px-3 py-2 text-xs disabled:opacity-50",
						onClick: () => void load(),
						children: "Load register"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || data === null,
						className: "rounded border px-3 py-2 text-xs disabled:opacity-50",
						onClick: () => {
							if (data !== null) try {
								download(data, org);
							} catch (e) {
								setErr(e instanceof Error ? e.message : String(e));
							}
						},
						children: "Export CSV"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Date basis: ",
					registers[reg].date,
					". Maximum 5,000 rows per export; narrow dates if exceeded. Keep exported finance data secure."
				]
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				children: "Loading…"
			}),
			err !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-red-600",
				children: err
			}),
			data !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs",
					children: [
						data.rows.length,
						" rows · Generated ",
						data.generated,
						" · Preview first 50; CSV includes all loaded rows."
					]
				}),
				reg === "legacy_flags" && data.rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs text-amber-700",
					children: "Possible overlaps found. Do not treat them as confirmed duplicate payments."
				}),
				reg === "reconciliation" && data.rows.some((r) => r["result"] !== "PASS") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-red-600",
					children: "Reconciliation exception. Investigate before CA handover."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-x-auto rounded border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: cols.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "whitespace-nowrap p-2 text-left",
								children: k.replace(/_/g, " ")
							}, k)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.rows.slice(0, 50).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
							className: "border-t",
							children: cols.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "whitespace-nowrap p-2 " + (money$7.has(k) ? "text-right tabular-nums" : ""),
								children: str$2(r[k])
							}, k))
						}, i)) })]
					}), data.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-3 text-xs",
						children: "No matching records. A zero-row export contains headers only."
					})]
				})
			] })
		]
	});
}
var obj$4 = (v) => {
	if (v === null || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid contribution response");
	return v;
};
var rows$5 = (v) => {
	if (!Array.isArray(v)) throw new Error("Invalid contribution list");
	return v.map(obj$4);
};
var num = (v) => {
	const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
	if (!Number.isFinite(n)) throw new Error("Invalid financial value");
	return n;
};
var txt = (v) => typeof v === "string" ? v : typeof v === "number" ? String(v) : "Unallocated / unspecified";
var inr$1 = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
});
var money$6 = (v) => inr$1.format(num(v));
var keys = [
	"revenue",
	"cost",
	"contribution"
];
function decode$1(v, org, offset) {
	const r = obj$4(v);
	if (r["org_id"] !== org || r["scope"] !== "current_fin_contribution" || r["allocation_method"] !== "indicative_equal_distinct_case_v1" || r["currency"] !== "INR" || r["offset"] !== offset) throw new Error("Contribution workspace or schema mismatch");
	const totals = obj$4(r["totals"]), checks = obj$4(r["checks"]), cases = rows$5(r["cases"]), clients = rows$5(r["clients"]), branches = rows$5(r["branches"]);
	for (const x of [
		totals,
		...cases,
		...clients,
		...branches
	]) for (const k of keys) num(x[k]);
	for (const x of [totals, ...branches]) num(x["unallocated_cost"]);
	num(totals["allocated_cost"]);
	for (const k of [
		"bad_batches",
		"bad_claims",
		"unresolved_journeys",
		"revenue_difference",
		"cost_difference"
	]) num(checks[k]);
	const count = num(r["case_count"]);
	if (!Number.isSafeInteger(count) || count < 0 || cases.length > 100) throw new Error("Invalid page");
	return {
		totals,
		checks,
		cases,
		clients,
		branches,
		count,
		generated: txt(r["generated_at"])
	};
}
var valueCols = [
	{
		key: "revenue",
		label: "Issued revenue (ex GST)",
		money: true
	},
	{
		key: "cost",
		label: "Net claim cost",
		money: true
	},
	{
		key: "contribution",
		label: "Contribution",
		money: true
	}
];
function Table$1({ data, columns }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "whitespace-nowrap p-2 " + (c.money ? "text-right" : "text-left"),
					children: c.label
				}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "p-2 text-right",
					children: "Margin %"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((r, i) => {
				const revenue = num(r["revenue"]), contribution = num(r["contribution"]);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 " + (c.money ? "whitespace-nowrap text-right tabular-nums" : "text-left") + (c.key === "contribution" && contribution < 0 ? " text-red-600 font-medium" : ""),
						children: c.money ? money$6(r[c.key]) : txt(r[c.key])
					}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-2 text-right tabular-nums",
						children: revenue > 0 ? (100 * contribution / revenue).toFixed(1) + "%" : "—"
					})]
				}, i);
			}) })]
		}), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-3 text-muted-foreground",
			children: "No records in scope."
		})]
	});
}
function VpFin05BProfitability() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profitability, { org: tenant.id }, tenant.id) : null;
}
function Profitability({ org }) {
	const [data, setData] = (0, import_react.useState)(null), [error, setError] = (0, import_react.useState)(""), [loading, setLoading] = (0, import_react.useState)(true), [offset, setOffset] = (0, import_react.useState)(0), [refresh, setRefresh] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let current = true;
		setData(null);
		setError("");
		setLoading(true);
		(async () => {
			try {
				const { data: raw, error: rpcError } = await vpDb.rpc("vp_fin05b_snapshot", { p_offset: offset });
				if (rpcError) throw new Error(rpcError.message);
				const d = decode$1(raw, org, offset);
				if (current) setData(d);
			} catch (e) {
				if (current) setError(e instanceof Error ? e.message : String(e));
			} finally {
				if (current) setLoading(false);
			}
		})();
		return () => {
			current = false;
		};
	}, [
		org,
		offset,
		refresh
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-4 space-y-3 rounded-lg border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Profitability & cost allocation · FIN-05B"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Indicative contribution · all recorded FIN history · authorized branches only"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: loading,
					onClick: () => {
						setData(null);
						setRefresh((x) => x + 1);
					},
					className: "rounded border px-3 py-2 text-xs",
					children: "Refresh"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded border p-2 text-xs text-muted-foreground",
				children: "Management estimate, not accounting profit. Approved mileage is split equally across distinct cases in each journey, after proportional claim reductions. Other allowances and unresolved journeys remain branch costs; not allocated to clients. Revenue uses issued invoice taxable amounts only. Legacy data, unissued work, salaries and other overheads are excluded. No accounting entries are created."
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-sm",
				children: "Loading contribution balances…"
			}),
			error !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "rounded border border-red-500 p-2 text-sm",
				children: ["Contribution unavailable: ", error]
			}),
			data !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Snapshot: ", data.generated]
				}),
				num(data.checks["unresolved_journeys"]) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "rounded border border-amber-500 p-2 text-sm",
					children: [num(data.checks["unresolved_journeys"]), " journey lines could not be attributed safely; their costs are included in unallocated branch costs."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 lg:grid-cols-5",
					children: [
						{
							key: "revenue",
							label: "Issued revenue, ex GST"
						},
						{
							key: "cost",
							label: "Net approved claim cost"
						},
						{
							key: "allocated_cost",
							label: "Allocated case cost"
						},
						{
							key: "unallocated_cost",
							label: "Unallocated branch cost"
						},
						{
							key: "contribution",
							label: "Branch contribution before other costs"
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 rounded border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "break-words font-semibold tabular-nums",
							children: money$6(data.totals[c.key])
						})]
					}, c.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Branch contribution (includes unallocated costs)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table$1, {
					data: data.branches,
					columns: [
						{
							key: "branch_name",
							label: "Branch"
						},
						...valueCols,
						{
							key: "unallocated_cost",
							label: "Unallocated within cost",
							money: true
						}
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Client contribution (allocated costs only)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table$1, {
					data: data.clients,
					columns: [{
						key: "client",
						label: "Client / unallocated"
					}, ...valueCols]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Case contribution · lowest first"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Case numbers are grouped by historic agency branch and client snapshots. A case can appear under multiple historical groups. No revenue means margin percentage is not applicable."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table$1, {
					data: data.cases,
					columns: [
						{
							key: "branch_name",
							label: "Branch"
						},
						{
							key: "client",
							label: "Client"
						},
						{
							key: "case_num",
							label: "Case no."
						},
						...valueCols
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.count === 0 ? "0 rows" : `${offset + 1}–${offset + data.cases.length} of ${data.count} groups` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded border px-3 py-2 disabled:opacity-50",
							disabled: offset === 0 || loading,
							onClick: () => {
								setData(null);
								setOffset((x) => Math.max(0, x - 100));
							},
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded border px-3 py-2 disabled:opacity-50",
							disabled: offset + 100 >= data.count || loading || offset >= 1e6,
							onClick: () => {
								setData(null);
								setOffset((x) => x + 100);
							},
							children: "Next"
						})]
					})]
				})
			] })
		]
	});
}
var obj$3 = (v) => {
	if (v === null || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid finance response");
	return v;
};
var rows$4 = (v) => {
	if (!Array.isArray(v)) throw new Error("Invalid finance list");
	return v.map(obj$3);
};
var text$3 = (v) => typeof v === "string" ? v : typeof v === "number" ? String(v) : "—";
var numeric = (v) => {
	const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
	if (!Number.isFinite(n)) throw new Error("Missing/invalid financial value");
	return n;
};
var inr = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
});
var money$5 = (v) => inr.format(numeric(v));
var count = (v) => numeric(v).toLocaleString("en-IN");
var cashKeys = [
	"issued",
	"bank_received",
	"tds_credit",
	"receivable",
	"overdue",
	"approved_original",
	"net_approved",
	"reduction",
	"cash_paid",
	"advance_applied",
	"payable",
	"advances_issued",
	"advances_outstanding",
	"approved_unissued"
];
var countKeys = [
	"invoice_count",
	"approved_claim_count",
	"draft_batches",
	"submitted_claims",
	"returned_claims",
	"pending_payments",
	"pending_entries"
];
var checkKeys = [
	"invoice_anomalies",
	"claim_anomalies",
	"advance_anomalies",
	"category_difference",
	"ageing_difference"
];
function decode(v, org) {
	const r = obj$3(v);
	if (r["org_id"] !== org || r["scope"] !== "current_visible_fin_ledgers" || r["currency"] !== "INR") throw new Error("Finance workspace or schema mismatch");
	const totals = obj$3(r["totals"]), checks = obj$3(r["checks"]), branches = rows$4(r["branches"]), clients = rows$4(r["clients"]), categories = rows$4(r["categories"]), ageing = rows$4(r["ageing"]);
	for (const t of [totals, ...branches]) for (const k of [...cashKeys, ...countKeys]) numeric(t[k]);
	for (const c of clients) for (const k of [
		"issued",
		"bank_received",
		"tds_credit",
		"receivable",
		"overdue",
		"invoice_count"
	]) numeric(c[k]);
	for (const c of categories) numeric(c["approved_original"]);
	for (const a of ageing) numeric(a["outstanding"]);
	for (const k of checkKeys) numeric(checks[k]);
	return {
		asOf: text$3(r["as_of"]),
		generatedAt: text$3(r["generated_at"]),
		totals,
		checks,
		branches,
		clients,
		categories,
		ageing
	};
}
function Table({ data, columns, idKey }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "whitespace-nowrap p-2 " + (c.kind === "text" ? "text-left" : "text-right"),
					children: c.label
				}, c.key)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t",
				children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-2 " + (c.kind === "text" ? "text-left" : "whitespace-nowrap text-right tabular-nums"),
					children: c.kind === "money" ? money$5(r[c.key]) : c.kind === "count" ? count(r[c.key]) : text$3(r[c.key])
				}, c.key))
			}, text$3(r[idKey]) + "-" + i)) })]
		}), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-3 text-muted-foreground",
			children: "No records in this scope."
		})]
	});
}
var m = (key, label) => ({
	key,
	label,
	kind: "money"
});
var t = (key, label) => ({
	key,
	label,
	kind: "text"
});
var n = (key, label) => ({
	key,
	label,
	kind: "count"
});
function Cards({ values, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2 lg:grid-cols-4",
		children: items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 rounded border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: c.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "break-words text-base font-semibold tabular-nums",
				children: c.kind === "count" ? count(values[c.key]) : money$5(values[c.key])
			})]
		}, c.key))
	});
}
function VpFin05ADashboard() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { org: tenant.id }, tenant.id) : null;
}
function Dashboard({ org }) {
	const [data, setData] = (0, import_react.useState)(null), [error, setError] = (0, import_react.useState)(""), [loading, setLoading] = (0, import_react.useState)(true), [refresh, setRefresh] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let current = true;
		setLoading(true);
		setError("");
		setData(null);
		(async () => {
			try {
				const { data: raw, error: rpcError } = await vpDb.rpc("vp_fin05a_snapshot", {});
				if (rpcError) throw new Error(rpcError.message);
				const snap = decode(raw, org);
				if (current) setData(snap);
			} catch (e) {
				if (current) setError(e instanceof Error ? e.message : String(e));
			} finally {
				if (current) setLoading(false);
			}
		})();
		return () => {
			current = false;
		};
	}, [org, refresh]);
	const invalid = data !== null && checkKeys.some((k) => numeric(data.checks[k]) !== 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-4 rounded-lg border bg-card p-3 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Finance overview · FIN-05A"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Current balances · authorized branches only · INR"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: loading,
					className: "rounded border px-3 py-2 text-xs font-medium disabled:opacity-50",
					onClick: () => setRefresh((v) => v + 1),
					children: loading ? "Loading…" : "Refresh"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded border p-2 text-xs text-muted-foreground",
				children: "New FIN ledgers only. Legacy invoices, trips, expenses, SaaS subscriptions and unapproved charges are not included. This is not a historical as-of report, bank balance, cash-flow statement or profit report."
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-sm",
				children: "Loading authorized finance balances…"
			}),
			error !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "rounded border border-red-500 p-2 text-sm",
				children: [
					"Finance dashboard unavailable: ",
					error,
					". Requires FIN-03 administrator and billing.View access."
				]
			}),
			data !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Balance date (IST): ",
						data.asOf,
						" · Snapshot: ",
						data.generatedAt
					]
				}),
				invalid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "alert",
					className: "rounded border border-amber-500 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Reconciliation failed — do not rely on these totals until reviewed."
					}), checkKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						k,
						": ",
						text$3(data.checks[k])
					] }, k))]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Arithmetic reconciliation checks passed for this scope; ledger completeness and approvals still require review."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Client receivables"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cards, {
					values: data.totals,
					items: [
						m("receivable", "Outstanding receivables"),
						m("overdue", "Overdue receivables"),
						m("issued", "Issued invoice value"),
						m("approved_unissued", "Approved, not issued"),
						m("bank_received", "Posted bank receipts"),
						m("tds_credit", "Posted TDS credits"),
						n("invoice_count", "Issued invoices"),
						n("draft_batches", "Draft batches")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Employee reimbursements & advances"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cards, {
					values: data.totals,
					items: [
						m("payable", "Outstanding reimbursement"),
						m("net_approved", "Net approved claims"),
						m("cash_paid", "Net posted cash paid"),
						m("advance_applied", "Net advance allocated"),
						m("advances_outstanding", "Unsettled advances"),
						m("advances_issued", "Posted advances issued"),
						m("approved_original", "Original approved claims"),
						m("reduction", "Posted claim reductions")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Approval queues (not in posted balances)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cards, {
					values: data.totals,
					items: [
						n("submitted_claims", "Submitted claims"),
						n("returned_claims", "Returned claims"),
						n("pending_payments", "Pending reimbursements"),
						n("pending_entries", "Pending advance/correction entries")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Receivable ageing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: data.ageing.map((a) => {
						const amount = numeric(a["outstanding"]), total = numeric(data.totals["receivable"]);
						const pct = total > 0 ? Math.max(0, Math.min(100, 100 * amount / total)) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text$3(a["bucket"]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: money$5(amount)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 overflow-hidden rounded bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded bg-primary",
								style: { width: `${pct}%` }
							})
						})] }, text$3(a["bucket"]));
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Agency branch financial summary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					data: data.branches,
					idKey: "branch_id",
					columns: [
						t("branch_name", "Branch"),
						m("issued", "Issued"),
						m("receivable", "Receivable"),
						m("overdue", "Overdue"),
						m("approved_unissued", "Not issued"),
						m("net_approved", "Net claims"),
						m("cash_paid", "Cash paid"),
						m("advance_applied", "Advance applied"),
						m("payable", "Payable"),
						m("advances_outstanding", "Unsettled advances")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Client-wise receivables"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					data: data.clients,
					idKey: "client",
					columns: [
						t("client", "Client"),
						n("invoice_count", "Invoices"),
						m("issued", "Issued"),
						m("bank_received", "Bank receipts"),
						m("tds_credit", "TDS"),
						m("receivable", "Outstanding"),
						m("overdue", "Overdue")
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Expense categories — original approved value"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Includes approved monthly claim line amounts after applicable ceilings. Later claim reductions remain separate because the existing ledger does not assign reductions to categories."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					data: data.categories,
					idKey: "category",
					columns: [t("category", "Expense code"), m("approved_original", "Original approved")]
				})
			] })
		]
	});
}
var str$1 = (x) => typeof x === "number" || typeof x === "string" ? String(x) : "";
var field$1 = "w-full rounded border bg-background min-h-10 p-2 text-sm";
var btn$4 = "rounded border px-3 py-2 text-sm disabled:opacity-50";
async function rpc$5(n, a) {
	const { data, error } = await vpDb.rpc(n, a);
	if (error) throw new Error(error.message);
	return data;
}
function VpFin04D3() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		org: tenant.id,
		create: capabilities.includes("billing.Create"),
		approve: capabilities.includes("billing.Approve")
	}, tenant.id) : null;
}
function Panel({ org, create, approve }) {
	const [code, setCode] = (0, import_react.useState)("*"), [month, setMonth] = (0, import_react.useState)(""), [cap, setCap] = (0, import_react.useState)(""), [unlimited, setUnlimited] = (0, import_react.useState)(false), [reason, setReason] = (0, import_react.useState)(""), [decisionReason, setDecisionReason] = (0, import_react.useState)(""), [claim, setClaim] = (0, import_react.useState)(""), [amount, setAmount] = (0, import_react.useState)(""), [day, setDay] = (0, import_react.useState)(""), [ref, setRef] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [items, setItems] = (0, import_react.useState)([]), [offset, setOffset] = (0, import_react.useState)(0), [busy, setBusy] = (0, import_react.useState)(false), [msg, setMsg] = (0, import_react.useState)("");
	async function load(o) {
		const r = await rpc$5("vp_fin04d3_ceiling_list", { p_offset: o });
		if (r["org_id"] !== org || !Array.isArray(r["items"])) throw new Error("Invalid workspace/list");
		setItems(r["items"]);
		setOffset(o);
	}
	async function run(f) {
		setBusy(true);
		setMsg("");
		try {
			await f();
		} catch (e) {
			setMsg(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Monthly expense ceilings & claim corrections · FIN-04D3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Agency-wide per employee/month. Category and total limits apply after existing line caps, from an approved future month. No automatic default limits." }),
				create && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					disabled: busy,
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Category code (* = total)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase())
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Effective month", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							type: "month",
							value: month,
							onChange: (e) => setMonth(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Monthly cap (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							inputMode: "decimal",
							disabled: unlimited,
							value: cap,
							onChange: (e) => setCap(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: unlimited,
							onChange: (e) => setUnlimited(e.target.checked)
						}), " Remove limit prospectively"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Policy reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: field$1,
							value: reason,
							onChange: (e) => setReason(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn$4,
							type: "button",
							disabled: !month || !code || reason.trim().length < 5 || !unlimited && !(Number(cap) > 0),
							onClick: () => void run(async () => {
								await rpc$5("vp_fin04d3_ceiling_save", {
									p_code: code,
									p_month: month + "-01",
									p_cap: unlimited ? null : Number(cap),
									p_reason: reason
								});
								await load(0);
								setMsg("Draft ceiling recorded. Independent approval required.");
							}),
							children: "Save draft ceiling"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btn$4,
					type: "button",
					disabled: busy,
					onClick: () => void run(() => load(0)),
					children: "Load ceilings"
				}),
				approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: ["Decision reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field$1,
						value: decisionReason,
						onChange: (e) => setDecisionReason(e.target.value)
					})]
				}),
				items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"#",
							str$1(x["id"]),
							" · ",
							str$1(x["code"]),
							" · ",
							str$1(x["effective_month"]),
							" · ",
							x["cap"] === null ? "No limit" : "₹" + str$1(x["cap"]),
							" · ",
							str$1(x["status"])
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs",
							children: [
								str$1(x["reason"]),
								" ",
								str$1(x["decision_reason"])
							]
						}),
						approve && x["status"] === "Draft" && ["Approved", "Rejected"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: btn$4,
							disabled: busy || decisionReason.trim().length < 5,
							onClick: () => void run(async () => {
								await rpc$5("vp_fin04d3_ceiling_decide", {
									p_id: x["id"],
									p_decision: d,
									p_reason: decisionReason
								});
								await load(offset);
								setDecisionReason("");
							}),
							children: d
						}, d))
					]
				}, str$1(x["id"]))),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$4,
						type: "button",
						disabled: busy || offset === 0,
						onClick: () => void run(() => load(Math.max(0, offset - 50))),
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$4,
						type: "button",
						disabled: busy || items.length < 50,
						onClick: () => void run(() => load(offset + 50)),
						children: "Next"
					})]
				}),
				create && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					disabled: busy,
					className: "grid gap-2 sm:grid-cols-2 border-t pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sm:col-span-2",
							children: "Reduce only the unsettled balance of an approved claim. Original approved amount remains unchanged. Upload supporting evidence against the pending ledger entry and review through FIN-04D1."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Approved claim ID", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							inputMode: "numeric",
							value: claim,
							onChange: (e) => setClaim(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Reduction (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							inputMode: "decimal",
							value: amount,
							onChange: (e) => setAmount(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Correction date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							type: "date",
							value: day,
							onChange: (e) => setDay(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Unique reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							value: ref,
							onChange: (e) => setRef(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Evidence reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field$1,
							value: evidence,
							onChange: (e) => setEvidence(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: btn$4,
							disabled: !/^[1-9]\d{0,18}$/.test(claim) || !(Number(amount) > 0) || !day || ref.trim().length < 5 || evidence.trim().length < 5,
							onClick: () => void run(async () => {
								if (!window.confirm("Record pending claim reduction?")) return;
								const k = await rpc$5("vp_fin04d3_record_reduction", {
									p_claim: claim,
									p_amount: Number(amount),
									p_day: day,
									p_reference: ref,
									p_evidence: evidence
								});
								setMsg("Pending ledger entry #" + str$1(k) + ". Refresh FIN-04D1 for independent review.");
								setRef("");
								setEvidence("");
								setAmount("");
							}),
							children: "Record pending reduction"
						})
					]
				}),
				msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					children: msg
				})
			]
		})]
	});
}
var str = (v) => typeof v === "string" || typeof v === "number" ? String(v) : "";
var rows$3 = (v) => {
	if (!Array.isArray(v) || v.some((x) => !x || typeof x !== "object" || Array.isArray(x))) throw new Error("Invalid register response");
	return v;
};
var today$2 = () => {
	const p = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return [
		"year",
		"month",
		"day"
	].map((t) => p.find((x) => x.type === t)?.value ?? "").join("-");
};
var money$4 = (v) => Number(v ?? 0).toLocaleString("en-IN", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
var field = "w-full rounded border bg-background min-h-10 p-2 text-sm";
var btn$3 = "rounded border px-3 py-2 text-sm disabled:opacity-50";
async function rpc$4(n, a) {
	const { data, error } = await vpDb.rpc(n, a);
	if (error) throw new Error(error.message);
	return data;
}
function VpFin04DAdvances() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Register$3, {
		org: tenant.id,
		create: capabilities.includes("billing.Create"),
		approve: capabilities.includes("billing.Approve")
	}, tenant.id) : null;
}
function Register$3({ org, create, approve }) {
	const [items, setItems] = (0, import_react.useState)([]), [workers, setWorkers] = (0, import_react.useState)([]), [offset, setOffset] = (0, import_react.useState)(0), [loaded, setLoaded] = (0, import_react.useState)(false), [kind, setKind] = (0, import_react.useState)("Advance"), [worker, setWorker] = (0, import_react.useState)(""), [claim, setClaim] = (0, import_react.useState)(""), [advance, setAdvance] = (0, import_react.useState)(""), [payment, setPayment] = (0, import_react.useState)(""), [amount, setAmount] = (0, import_react.useState)(""), [day, setDay] = (0, import_react.useState)(today$2), [reference, setReference] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [reason, setReason] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	async function load(n) {
		const v = await rpc$4("vp_fin04d_list", { p_offset: n });
		if (!v || typeof v !== "object" || v["org_id"] !== org) throw new Error("Workspace mismatch");
		const r = v;
		setItems(rows$3(r["items"]));
		setWorkers(rows$3(r["workers"]));
		setOffset(n);
		setLoaded(true);
	}
	async function run(f) {
		setBusy(true);
		setMessage("");
		try {
			await f();
		} catch (e) {
			setMessage(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	const id = (x) => /^[1-9]\d*$/.test(x) ? x : null;
	const [userId, branchId] = worker.split(":");
	const valid = !!day && reference.trim().length >= 5 && evidence.trim().length >= 5 && (kind === "Advance" ? !!id(userId ?? "") && !!id(branchId ?? "") : !!id(claim) && (kind === "Allocate" ? !!id(advance) : !!id(payment))) && (kind === "ReversePayment" || Number.isFinite(Number(amount)) && Number(amount) > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 font-semibold text-sm",
			children: "Expense advances & settlement adjustments · FIN-04D1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Record actual external disbursements only. Allocate posted advances to approved claims. Full payment reversals require confirmed bank reversal or documented erroneous posting; they do not send money. Refresh the FIN-04C claim queue after approval."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: btn$3,
					disabled: busy,
					onClick: () => void run(() => load(0)),
					children: "Load register & staff"
				}),
				loaded && create && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					disabled: busy,
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Entry type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: field,
								value: kind,
								onChange: (e) => {
									setKind(e.target.value);
									setClaim("");
									setAdvance("");
									setPayment("");
									setAmount("");
									setReference("");
									setEvidence("");
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Advance",
										children: "Record paid advance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Allocate",
										children: "Apply advance to approved claim"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ReversePayment",
										children: "Reverse full posted cash payment"
									})
								]
							})]
						}),
						kind === "Advance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Employee / servicing branch", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: field,
								value: worker,
								onChange: (e) => setWorker(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select"
								}), workers.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: str(w["user_id"]) + ":" + str(w["branch_id"]),
									children: [
										str(w["name"]),
										" · ",
										str(w["branch_name"])
									]
								}, str(w["user_id"]) + ":" + str(w["branch_id"])))]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Approved claim ID (FIN-04C queue)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								inputMode: "numeric",
								value: claim,
								onChange: (e) => setClaim(e.target.value)
							})]
						}),
						kind === "Allocate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Posted advance ID", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								inputMode: "numeric",
								value: advance,
								onChange: (e) => setAdvance(e.target.value)
							})]
						}),
						kind === "ReversePayment" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Posted payment ID (FIN-04C)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								inputMode: "numeric",
								value: payment,
								onChange: (e) => setPayment(e.target.value)
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Amount (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								inputMode: "decimal",
								value: amount,
								onChange: (e) => setAmount(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Entry date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: field,
								max: today$2(),
								value: day,
								onChange: (e) => setDay(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Unique transaction / allocation reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								maxLength: 120,
								value: reference,
								onChange: (e) => setReference(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Evidence reference (not file upload)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field,
								maxLength: 500,
								value: evidence,
								onChange: (e) => setEvidence(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: btn$3,
							disabled: !valid || busy,
							onClick: () => void run(async () => {
								if (!window.confirm("Record pending entry for independent review?")) return;
								await rpc$4("vp_fin04d_record", {
									p_kind: kind,
									p_user: kind === "Advance" ? id(userId ?? "") : null,
									p_branch: kind === "Advance" ? id(branchId ?? "") : null,
									p_claim: kind === "Advance" ? null : id(claim),
									p_advance: kind === "Allocate" ? id(advance) : null,
									p_payment: kind === "ReversePayment" ? id(payment) : null,
									p_amount: kind === "ReversePayment" ? null : Number(amount),
									p_day: day,
									p_reference: reference,
									p_evidence: evidence
								});
								setReference("");
								setEvidence("");
								setAmount("");
								await load(0);
								setMessage("Pending entry recorded. No balance change before approval.");
							}),
							children: "Record pending entry"
						})
					]
				}),
				loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Independent review reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: field,
							maxLength: 1e3,
							disabled: busy,
							value: reason,
							onChange: (e) => setReason(e.target.value)
						})]
					}),
					items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "No visible entries."
					}),
					items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2 space-y-1 text-xs break-words",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									"#",
									str(x["id"]),
									" · ",
									str(x["kind"]),
									" · ",
									str(x["status"]),
									" · ₹",
									money$4(x["amount"])
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								str(x["worker_name"]),
								" · ",
								str(x["branch_name"]),
								" · ",
								str(x["entry_day"])
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Reference: ",
								str(x["reference"]),
								" · Evidence: ",
								str(x["evidence_ref"])
							] }),
							x["kind"] === "Advance" && x["status"] === "Posted" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Unallocated advance: ₹", money$4(x["available"])] }),
							str(x["claim_id"]) !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Claim #",
								str(x["claim_id"]),
								" · Advance #",
								str(x["advance_id"]) || "—",
								" · Payment #",
								str(x["payment_id"]) || "—"
							] }),
							str(x["reason"]) !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Decision: ", str(x["reason"])] }),
							approve && x["status"] === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: ["Posted", "Rejected"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: btn$3,
									disabled: busy || reason.trim().length < 5,
									onClick: () => void run(async () => {
										if (!window.confirm("Confirm independent evidence review?")) return;
										await rpc$4("vp_fin04d_decide", {
											p_id: x["id"],
											p_decision: d,
											p_reason: reason
										});
										setReason("");
										await load(offset);
										setMessage("Decision saved. Refresh claim queue.");
									}),
									children: d === "Posted" ? "Approve posting" : "Reject"
								}, d))
							})
						]
					}, str(x["id"]))),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: btn$3,
							disabled: busy || offset === 0,
							onClick: () => void run(() => load(Math.max(0, offset - 30))),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: btn$3,
							disabled: busy || items.length < 30,
							onClick: () => void run(() => load(offset + 30)),
							children: "Next"
						})]
					})
				] }),
				message !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-xs break-words",
					children: message
				})
			]
		})]
	});
}
var input$2 = "w-full rounded border border-border bg-background px-2 py-1.5 text-xs";
var button = "rounded border border-border bg-background px-3 py-1.5 text-xs font-medium disabled:opacity-50";
var text$2 = (v) => v === null || v === void 0 ? "" : String(v);
var errorText = (v) => v instanceof Error ? v.message : String(v);
var money$3 = (v) => typeof v === "number" && Number.isFinite(v) ? v.toLocaleString("en-IN", {
	style: "currency",
	currency: "INR"
}) : "—";
var obj$2 = (v) => {
	if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid response");
	return v;
};
var rows$2 = (v) => {
	if (!Array.isArray(v)) throw new Error("Invalid list");
	return v.map(obj$2);
};
var scoped$2 = (v, org) => {
	const r = obj$2(v);
	if (r["org_id"] !== org) throw new Error("Workspace mismatch");
	return r;
};
var modes = [
	"km",
	"actual",
	"fixed_day",
	"fixed_month"
];
function mode(v) {
	if (typeof v !== "string" || !modes.includes(v)) throw new Error("Invalid calculation mode");
	return v;
}
function today$1() {
	const p = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return [
		"year",
		"month",
		"day"
	].map((k) => p.find((x) => x.type === k)?.value ?? "").join("-");
}
function positive(v, label) {
	if (!v.trim() || !Number.isFinite(Number(v)) || Number(v) <= 0) throw new Error(label + " must be positive");
	return Number(v);
}
async function rpc$3(name, args = {}) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw new Error(error.message);
	return data;
}
function draftRule(r) {
	return {
		code: text$2(r["code"]),
		label: text$2(r["label"]),
		mode: mode(r["mode"]),
		rate: text$2(r["rate"]),
		cap: text$2(r["cap"]),
		evidence: r["evidence_required"] !== false
	};
}
function PolicyPanel({ org, create, approve }) {
	const [offset, setOffset] = (0, import_react.useState)(0);
	const setup = useQuery({
		queryKey: ["fin04a-setup", org],
		retry: false,
		queryFn: async () => scoped$2(await rpc$3("vp_fin04a_setup"), org)
	});
	const history = useQuery({
		queryKey: [
			"fin04a-list",
			org,
			offset
		],
		retry: false,
		queryFn: async () => rows$2(scoped$2(await rpc$3("vp_fin04a_list", { p_offset: offset }), org)["items"])
	});
	const [branch, setBranch] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("");
	const [rev, setRev] = (0, import_react.useState)("0");
	const [effective, setEffective] = (0, import_react.useState)(today$1);
	const [title, setTitle] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [fuel, setFuel] = (0, import_react.useState)(false);
	const [rules, setRules] = (0, import_react.useState)([]);
	const [category, setCategory] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [decision, setDecision] = (0, import_react.useState)("Approved");
	const [reviewReason, setReviewReason] = (0, import_react.useState)("");
	const [previewBranch, setPreviewBranch] = (0, import_react.useState)("");
	const [previewRole, setPreviewRole] = (0, import_react.useState)("");
	const [previewDate, setPreviewDate] = (0, import_react.useState)(today$1);
	const [items, setItems] = (0, import_react.useState)([{
		code: "BIKE_KM",
		quantity: ""
	}]);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const branches = setup.data ? rows$2(setup.data["branches"]) : [];
	const roles = setup.data && Array.isArray(setup.data["roles"]) ? setup.data["roles"].map(text$2) : [];
	const catalog = setup.data ? rows$2(setup.data["catalogue"]) : [];
	async function run(work) {
		setBusy(true);
		setError("");
		setMessage("");
		try {
			await work();
		} catch (e) {
			setError(errorText(e));
		} finally {
			setBusy(false);
		}
	}
	function changeRule(i, patch) {
		setRules((old) => old.map((r, j) => i === j ? {
			...r,
			...patch
		} : r));
	}
	function copyPolicy(p) {
		setBranch(text$2(p["branch_id"]));
		setRole(text$2(p["role_name"]));
		setRev(text$2(p["revision"]));
		setTitle(text$2(p["title"]));
		setEffective(today$1());
		setReason("");
		setFuel(p["allow_fuel_and_mileage"] === true);
		setRules(rows$2(p["rules"]).map(draftRule));
		setMessage("Copied revision. Choose a new effective date and reason.");
	}
	function addCategory() {
		const r = catalog.find((x) => x["code"] === category);
		if (r && !rules.some((x) => x.code === category)) setRules((old) => [...old, draftRule(r)]);
	}
	const branchName = (id) => branches.find((b) => b["id"] === id)?.["name"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-3 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer px-4 py-3 text-sm font-semibold",
			children: "Field reimbursement policies · FIN-04A"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 border-t p-3 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Standard categories are available automatically. No reimbursement rate is assumed. Policy previews do not create claims, journeys, payroll or payments."
				}),
				(setup.isError || history.isError) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: errorText(setup.error || history.error)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: button,
					disabled: busy,
					onClick: () => void run(async () => {
						await Promise.all([setup.refetch(), history.refetch()]);
					}),
					children: "Refresh"
				}),
				create && setup.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3 rounded border p-3",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							if (!rules.length) throw new Error("Add at least one category");
							const payload = rules.map((r) => ({
								code: r.code.trim(),
								label: r.label.trim(),
								mode: r.mode,
								rate: r.mode === "actual" ? null : positive(r.rate, "Rate"),
								cap: r.cap.trim() ? positive(r.cap, "Line ceiling") : null,
								evidence_required: r.evidence
							}));
							const id = await rpc$3("vp_fin04a_save", {
								p_branch: branch || null,
								p_role: role || null,
								p_expected_revision: Number(rev),
								p_effective: effective,
								p_title: title,
								p_rules: payload,
								p_allow_fuel: fuel,
								p_reason: reason
							});
							if (typeof id !== "string") throw new Error("Missing save receipt; refresh before retry");
							setMessage("Draft policy " + id + " saved for independent approval.");
							setRules([]);
							setReason("");
							setOffset(0);
							await history.refetch();
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Create policy revision"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Scope branch", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$2,
									value: branch,
									onChange: (e) => {
										setBranch(e.target.value);
										setRev("0");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All branches"
									}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: text$2(b["id"]),
										children: text$2(b["name"])
									}, text$2(b["id"])))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Scope role", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$2,
									value: role,
									onChange: (e) => {
										setRole(e.target.value);
										setRev("0");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All roles"
									}), roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Expected latest revision", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									type: "number",
									min: "0",
									step: "1",
									value: rev,
									onChange: (e) => setRev(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Effective from (IST date)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									type: "date",
									min: today$1(),
									value: effective,
									onChange: (e) => setEffective(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Policy title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									minLength: 3,
									maxLength: 120,
									value: title,
									onChange: (e) => setTitle(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Reason / agreement reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									minLength: 5,
									maxLength: 1e3,
									value: reason,
									onChange: (e) => setReason(e.target.value)
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Start with revision 0 for a new scope; copy the latest revision for changes. Precedence: branch + role, branch, role, agency. A more specific policy replaces the entire less-specific policy."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "min-w-44",
									children: ["Standard category", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: input$2,
										value: category,
										onChange: (e) => setCategory(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Choose category"
										}), catalog.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: text$2(r["code"]),
											children: text$2(r["label"])
										}, text$2(r["code"])))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: button,
									disabled: busy || !category || rules.length >= 30 || rules.some((r) => r.code === category),
									onClick: addCategory,
									children: "Add category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: button,
									disabled: busy || rules.length >= 30,
									onClick: () => setRules((old) => [...old, {
										code: "",
										label: "",
										mode: "actual",
										rate: "",
										cap: "",
										evidence: true
									}]),
									children: "Custom category"
								})
							]
						}),
						rules.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid items-end gap-2 rounded border p-2 sm:grid-cols-2 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									pattern: "[A-Z][A-Z0-9_]{1,39}",
									value: r.code,
									onChange: (e) => changeRule(i, { code: e.target.value.toUpperCase() })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Label", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									minLength: 2,
									maxLength: 120,
									value: r.label,
									onChange: (e) => changeRule(i, { label: e.target.value })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Method", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$2,
									value: r.mode,
									onChange: (e) => changeRule(i, {
										mode: mode(e.target.value),
										rate: ""
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "km",
											children: "INR / km"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "actual",
											children: "Actual expense"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fixed_day",
											children: "Fixed / day"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fixed_month",
											children: "Fixed / month"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Rate", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									type: "number",
									min: "0.01",
									step: "0.01",
									disabled: r.mode === "actual",
									required: r.mode !== "actual",
									value: r.rate,
									onChange: (e) => changeRule(i, { rate: e.target.value })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Line ceiling (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									type: "number",
									min: "0.01",
									step: "0.01",
									value: r.cap,
									onChange: (e) => changeRule(i, { cap: e.target.value })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: r.evidence,
										onChange: (e) => changeRule(i, { evidence: e.target.checked })
									}), " Evidence"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: button,
										onClick: () => setRules((old) => old.filter((_, j) => i !== j)),
										children: "Remove"
									})]
								})
							]
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: fuel,
								onChange: (e) => setFuel(e.target.checked)
							}), " Explicitly allow petrol with mileage in the same scenario (justify in reason)."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: button,
							disabled: busy || !rules.length,
							children: "Save draft"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Policy revision history"
						}),
						history.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No configured policy. No rates are available until a policy is approved." }),
						history.data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded border p-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											text$2(p["title"]),
											" · Rev ",
											text$2(p["revision"])
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											text$2(p["status"]),
											" · ",
											text$2(p["effective_on"])
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											text$2(branchName(p["branch_id"]) ?? p["branch_id"] ?? "All branches"),
											" / ",
											text$2(p["role_name"] ?? "All roles")
										] }),
										create && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: button,
											disabled: busy,
											onClick: () => copyPolicy(p),
											children: "Copy as new revision"
										}),
										approve && p["status"] === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: button,
											disabled: busy,
											onClick: () => {
												setSelected(p);
												setDecision("Approved");
												setReviewReason("");
											},
											children: "Review"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Created by ",
									text$2(p["created_by"]),
									" · ",
									text$2(p["reason"])
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: rows$2(p["rules"]).map((r) => `${text$2(r["code"])}: ${text$2(r["mode"])} ${r["rate"] === null ? "" : money$3(r["rate"])}${r["cap"] === null ? "" : ` (cap ${money$3(r["cap"])})`}${r["evidence_required"] === true ? " · evidence required" : ""}`).join(" | ") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Fuel with mileage: ", p["allow_fuel_and_mileage"] === true ? "Explicitly allowed" : "Not allowed"] }),
								text$2(p["decision_reason"]) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Decision by ",
									text$2(p["decided_by"]),
									": ",
									text$2(p["decision_reason"])
								] })
							]
						}, text$2(p["id"]))),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: button,
								disabled: busy || offset === 0,
								onClick: () => setOffset((v) => Math.max(0, v - 100)),
								children: "Previous"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: button,
								disabled: busy || (history.data?.length ?? 0) < 100,
								onClick: () => setOffset((v) => v + 100),
								children: "Next"
							})]
						})
					]
				}),
				selected && approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2 rounded border p-3",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							if (await rpc$3("vp_fin04a_decide", {
								p_id: selected["id"],
								p_decision: decision,
								p_reason: reviewReason
							}) !== selected["id"]) throw new Error("Missing decision receipt; refresh before retry");
							setSelected(null);
							setMessage("Policy decision recorded.");
							await history.refetch();
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							"Review policy ",
							text$2(selected["id"]),
							" · ",
							text$2(selected["title"])
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Confirm all rates, ceilings, evidence rules, scope and effective date in history above. Self-approval is blocked by the server." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Decision", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: input$2,
							value: decision,
							onChange: (e) => setDecision(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Approved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rejected" })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: input$2,
							required: true,
							minLength: 5,
							maxLength: 1e3,
							value: reviewReason,
							onChange: (e) => setReviewReason(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: button,
								disabled: busy,
								children: "Record decision"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: button,
								onClick: () => setSelected(null),
								children: "Cancel"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2 rounded border p-3",
					onSubmit: (e) => {
						e.preventDefault();
						setPreview(null);
						run(async () => {
							setPreview(scoped$2(await rpc$3("vp_fin04a_preview", {
								p_branch: previewBranch,
								p_role: previewRole,
								p_day: previewDate,
								p_items: items.map((i) => ({
									code: i.code.trim(),
									quantity: positive(i.quantity, "Quantity")
								}))
							}), org));
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Approved policy calculation preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Scenario quantities: km for mileage, INR for actual expenses, 1 for a fixed daily or monthly allowance. No journey evidence or cumulative ceiling is certified by this preview."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Branch", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$2,
									required: true,
									value: previewBranch,
									onChange: (e) => setPreviewBranch(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select"
									}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: text$2(b["id"]),
										children: text$2(b["name"])
									}, text$2(b["id"])))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Role", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$2,
									required: true,
									value: previewRole,
									onChange: (e) => setPreviewRole(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select"
									}), roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Expense date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									type: "date",
									required: true,
									value: previewDate,
									onChange: (e) => setPreviewDate(e.target.value)
								})] })
							]
						}),
						items.map((i, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid items-end gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Category code", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									required: true,
									value: i.code,
									onChange: (e) => setItems((old) => old.map((x, k) => k === j ? {
										...x,
										code: e.target.value.toUpperCase()
									} : x))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Quantity", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$2,
									type: "number",
									required: true,
									min: "0.001",
									step: "0.001",
									value: i.quantity,
									onChange: (e) => setItems((old) => old.map((x, k) => k === j ? {
										...x,
										quantity: e.target.value
									} : x))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: button,
									type: "button",
									disabled: items.length === 1,
									onClick: () => setItems((old) => old.filter((_, k) => j !== k)),
									children: "Remove"
								})
							]
						}, j)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: button,
								disabled: items.length >= 30,
								onClick: () => setItems((old) => [...old, {
									code: "",
									quantity: ""
								}]),
								children: "Add line"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: button,
								disabled: busy,
								children: "Calculate"
							})]
						})
					]
				}),
				preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 rounded border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: text$2(preview["status"]) }),
						preview["status"] === "Calculated" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								text$2(preview["title"]),
								" · Revision ",
								text$2(preview["revision"]),
								" · Effective ",
								text$2(preview["effective_on"])
							] }),
							rows$2(obj$2(preview["calculation"])["lines"]).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								text$2(l["label"]),
								": ",
								money$3(l["gross"]),
								" → ",
								money$3(l["amount"]),
								l["evidence_required"] === true ? " · evidence required" : ""
							] }, text$2(l["code"]))),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: ["Preview total: ", money$3(obj$2(preview["calculation"])["total"])]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Estimate only. No approved claim or payment." })
					]
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					children: message
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "break-words text-destructive",
					children: error
				})
			]
		})]
	});
}
function VpFin04APolicy() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin") || !capabilities.includes("billing.View")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyPanel, {
		org: tenant.id,
		create: capabilities.includes("billing.Create"),
		approve: capabilities.includes("billing.Approve")
	}, tenant.id);
}
var obj$1 = (x) => {
	if (!x || typeof x !== "object" || Array.isArray(x)) throw new Error("Invalid finance response");
	return x;
};
var rows$1 = (x) => {
	if (!Array.isArray(x)) throw new Error("Invalid finance list");
	return x.map(obj$1);
};
var text$1 = (x) => x === null || x === void 0 ? "" : String(x);
var money$2 = (x) => typeof x === "number" && Number.isFinite(x) ? x.toLocaleString("en-IN", {
	style: "currency",
	currency: "INR"
}) : "—";
var input$1 = "w-full rounded border border-border bg-background p-2 text-xs";
var btn$2 = "rounded border border-border bg-background px-3 py-1.5 text-xs font-medium disabled:opacity-50";
var err$2 = (x) => x instanceof Error ? x.message : String(x);
async function rpc$2(n, args) {
	const { data, error } = await vpDb.rpc(n, args);
	if (error) throw new Error(error.message);
	return data;
}
function scoped$1(x, org) {
	const r = obj$1(x);
	if (r["org_id"] !== org) throw new Error("Organization mismatch");
	return r;
}
function today() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date()).filter((p) => p.type !== "literal").reduce((a, p) => ({
		...a,
		[p.type]: p.value
	}), {});
}
function day() {
	const d = today();
	return `${d["year"]}-${d["month"]}-${d["day"]}`;
}
var docFields = [
	["invoice_no", "Externally issued invoice number"],
	["invoice_date", "Invoice date"],
	["supplier_name", "Supplier legal name"],
	["supplier_address", "Supplier registered address"],
	["supplier_gstin", "Supplier GSTIN"],
	["recipient_name", "Recipient legal name"],
	["recipient_address", "Recipient billing address"],
	["recipient_gstin", "Recipient GSTIN"],
	["place_of_supply", "Place of supply (state name)"],
	["place_of_supply_code", "Place of supply (2 digit code)"],
	["sac", "SAC"],
	["description", "Service description"],
	["evidence_ref", "External invoice / document reference"],
	["taxable", "External taxable amount"],
	["cgst", "External CGST"],
	["sgst", "External SGST"],
	["igst", "External IGST"],
	["total", "External invoice total"]
];
function printable(i) {
	const d = obj$1(i["document_snapshot"]), b = obj$1(i["balance"]), s = obj$1(i["statement"]), lines = rows$1(s["lines"]), profile = obj$1(s["report_profile"]), parties = obj$1(s["party_snapshot"]);
	const columns = profile["columns"];
	if (!Array.isArray(columns) || columns.some((c) => typeof c !== "string")) throw new Error("Invalid report profile");
	const w = window.open("", "_blank", "width=960,height=720");
	if (!w) throw new Error("Allow the print popup");
	w.opener = null;
	const page = w.document;
	page.title = "Receivables reconciliation copy";
	const style = page.createElement("style");
	style.textContent = "@page{size:A4;margin:12mm}body{font:12px system-ui;color:#202b3a;margin:20px}h1{font-size:20px}table{border-collapse:collapse;width:100%;margin:10px 0}th,td{border:1px solid #bbb;text-align:left;padding:6px;overflow-wrap:anywhere}p{margin:4px 0}@media print{button{display:none}}";
	page.head.appendChild(style);
	const add = (tag, value) => {
		const e = page.createElement(tag);
		e.textContent = value;
		page.body.appendChild(e);
		return e;
	};
	add("h1", "Receivables reconciliation copy");
	add("p", "NOT A TAX INVOICE — refer to the original externally issued document.");
	add("p", `Invoice ${text$1(i["invoice_no"])} · ${text$1(i["invoice_date"])} · Due ${text$1(i["due_on"])}`);
	for (const [k, label] of docFields.filter(([k]) => ![
		"invoice_no",
		"invoice_date",
		"taxable",
		"cgst",
		"sgst",
		"igst",
		"total"
	].includes(k))) add("p", `${label}: ${text$1(d[k])}`);
	add("p", `E-invoice: ${text$1(d["einvoice_status"])} · ${text$1(d["irn"])}`);
	const table = page.createElement("table");
	const tr = (v, head = false) => {
		const r = page.createElement("tr");
		for (const x of v) {
			const td = page.createElement(head ? "th" : "td");
			td.textContent = x;
			r.appendChild(td);
		}
		table.appendChild(r);
	};
	add("h2", text$1(profile["title"]));
	tr(columns.map((c) => String(c).replaceAll("_", " ")), true);
	for (const l of lines) {
		const c = obj$1(l["calculation"]);
		const display = {
			...c,
			agency_branch: parties["agency_branch"],
			distance_km: c["road_one_way_km"] ?? c["distance_km"] ?? null,
			adjustments: typeof c["penalty"] === "number" ? -c["penalty"] : null,
			tax: c["gst"],
			total: c["invoice_total_estimate"]
		};
		tr(columns.map((k) => text$1(display[String(k)])));
	}
	page.body.appendChild(table);
	for (const k of [
		"taxable",
		"cgst",
		"sgst",
		"igst",
		"total"
	]) add("p", `${k.toUpperCase()}: ${money$2(i[k])}`);
	for (const k of [
		"bank_received",
		"tds_credit",
		"outstanding"
	]) add("p", `${k.replaceAll("_", " ")}: ${money$2(b[k])}`);
	const print = page.createElement("button");
	print.type = "button";
	print.textContent = "Print / Save as PDF";
	print.onclick = () => w.print();
	page.body.appendChild(print);
}
function Register$2({ org, create, approve, canExport }) {
	const [offset, setOffset] = (0, import_react.useState)(0), [voucherOffset, setVoucherOffset] = (0, import_react.useState)(0), [selected, setSelected] = (0, import_react.useState)(null), [doc, setDoc] = (0, import_react.useState)({}), [confirmed, setConfirmed] = (0, import_react.useState)(false), [detail, setDetail] = (0, import_react.useState)(null), [kind, setKind] = (0, import_react.useState)("Bank receipt"), [ref, setRef] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [received, setReceived] = (0, import_react.useState)(day()), [amount, setAmount] = (0, import_react.useState)(""), [allocations, setAllocations] = (0, import_react.useState)([{
		batch_id: "",
		amount: ""
	}]), [voucher, setVoucher] = (0, import_react.useState)(null), [decision, setDecision] = (0, import_react.useState)("Posted"), [reason, setReason] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [error, setError] = (0, import_react.useState)(""), [message, setMessage] = (0, import_react.useState)("");
	const register = useQuery({
		queryKey: [
			"vp-fin03c-register",
			org,
			offset
		],
		retry: false,
		queryFn: async () => {
			const r = scoped$1(await rpc$2("vp_fin03c_register", { p_offset: offset }), org);
			return {
				items: rows$1(r["items"]),
				totals: obj$1(r["totals"])
			};
		}
	});
	const vouchers = useQuery({
		queryKey: [
			"vp-fin03c-vouchers",
			org,
			voucherOffset
		],
		retry: false,
		queryFn: async () => rows$1(scoped$1(await rpc$2("vp_fin03c_vouchers", { p_offset: voucherOffset }), org)["items"])
	});
	async function run(f) {
		setBusy(true);
		setError("");
		setMessage("");
		try {
			await f();
		} catch (e) {
			setError(err$2(e));
		} finally {
			setBusy(false);
		}
	}
	async function refresh() {
		await Promise.all([register.refetch(), vouchers.refetch()]);
	}
	function change(k, v) {
		setDoc((p) => ({
			...p,
			[k]: v
		}));
		setConfirmed(false);
	}
	const totals = register.data?.totals;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-3 rounded-lg border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Issued invoices & receivables · FIN-03C"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Consolidated register only; legacy invoices remain in the existing module. Record actual externally issued invoices after finance verification. No IRP connection, official PDF issuance or GST filing."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btn$2,
					disabled: busy,
					onClick: () => void run(refresh),
					children: "Refresh"
				}),
				register.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: err$2(register.error)
				}),
				totals && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-5",
					children: [
						"issued",
						"bank_received",
						"tds_credit",
						"outstanding",
						"overdue"
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: k.replaceAll("_", " ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money$2(totals[k]) })]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "Approved billing statements / issued invoices"
				}),
				register.data?.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded border p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						text$1(i["client"]),
						" · ",
						text$1(i["invoice_no"] ?? i["reference"]),
						" · ",
						money$2(i["total"]),
						i["balance"] ? ` · Due ${money$2(obj$1(i["balance"])["outstanding"])}` : " · Awaiting external invoice"
					] }), i["invoice_no"] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$2,
						disabled: busy,
						onClick: () => void run(async () => {
							setSelected(null);
							const d = scoped$1(await rpc$2("vp_fin03c_invoice_detail", { p_batch: i["batch_id"] }), org);
							if (d["batch_id"] !== i["batch_id"]) throw new Error("Invoice mismatch");
							setDetail(d);
						}),
						children: "Open"
					}) : approve && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$2,
						disabled: busy,
						onClick: () => {
							setSelected(i);
							setDetail(null);
							setDoc({
								invoice_date: day(),
								einvoice_status: "",
								cgst: "",
								sgst: "",
								igst: ""
							});
							setConfirmed(false);
						},
						children: "Record issued invoice"
					})]
				}, text$1(i["batch_id"]))),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$2,
						disabled: busy || offset === 0,
						onClick: () => setOffset((v) => Math.max(0, v - 100)),
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$2,
						disabled: busy || (register.data?.items.length ?? 0) < 100,
						onClick: () => setOffset((v) => v + 100),
						children: "Next"
					})]
				}),
				selected && approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2 rounded border p-3",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							if (await rpc$2("vp_fin03c_record_invoice", {
								p_batch: selected["batch_id"],
								p_doc: {
									...doc,
									confirmed
								}
							}) !== selected["batch_id"]) throw new Error("Invoice recording receipt missing; refresh before retry");
							setSelected(null);
							setMessage("Externally issued invoice recorded.");
							await refresh();
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold",
							children: ["Record invoice for ", text$1(selected["reference"])]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Approved totals: Taxable ",
							money$2(selected["taxable"]),
							" · CGST ",
							money$2(selected["cgst"]),
							" · SGST ",
							money$2(selected["sgst"]),
							" · IGST ",
							money$2(selected["igst"]),
							" · Total ",
							money$2(selected["total"])
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [
								docFields.map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									required: true,
									disabled: busy,
									type: k === "invoice_date" ? "date" : "text",
									maxLength: k === "invoice_no" ? 16 : 500,
									value: doc[k] ?? "",
									onChange: (e) => change(k, e.target.value)
								})] }, k)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["E-invoice applicability", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$1,
									required: true,
									value: doc["einvoice_status"] ?? "",
									disabled: busy,
									onChange: (e) => {
										setDoc((p) => ({
											...p,
											einvoice_status: e.target.value,
											irn: "",
											einvoice_reason: ""
										}));
										setConfirmed(false);
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select after verification"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Not applicable - verified" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "IRN verified externally" })
									]
								})] }),
								doc["einvoice_status"] === "IRN verified externally" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Verified IRN", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: input$1,
									minLength: 64,
									maxLength: 64,
									value: doc["irn"] ?? "",
									onChange: (e) => change("irn", e.target.value)
								})] }) : doc["einvoice_status"] === "Not applicable - verified" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Reason for non-applicability", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: input$1,
									minLength: 5,
									maxLength: 500,
									value: doc["einvoice_reason"] ?? "",
									onChange: (e) => change("einvoice_reason", e.target.value)
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: confirmed,
								required: true,
								onChange: (e) => setConfirmed(e.target.checked)
							}), "I verified the actual issued invoice, supplier/recipient, same place of supply and SAC across all charges, domestic forward-charge GST, tax amounts and e-invoice applicability. Evidence is retained externally."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$2,
								disabled: busy || !confirmed,
								children: "Record receivable"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: btn$2,
								onClick: () => setSelected(null),
								disabled: busy,
								children: "Cancel"
							})]
						})
					]
				}),
				detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							text$1(detail["invoice_no"]),
							" · ",
							text$1(detail["invoice_date"])
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Total ",
							money$2(detail["total"]),
							" · Bank ",
							money$2(obj$1(detail["balance"])["bank_received"]),
							" · TDS ",
							money$2(obj$1(detail["balance"])["tds_credit"]),
							" · Outstanding ",
							money$2(obj$1(detail["balance"])["outstanding"])
						] }),
						canExport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn$2,
							onClick: () => void run(async () => printable(detail)),
							children: "Print reconciliation / Save PDF"
						})
					]
				}),
				create && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2 border-t pt-3",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							const id = await rpc$2("vp_fin03c_submit_settlement", {
								p_kind: kind,
								p_reference: ref,
								p_evidence: evidence,
								p_date: received,
								p_amount: amount,
								p_lines: allocations
							});
							if (typeof id !== "string") throw new Error("Voucher receipt missing; refresh before retry");
							setMessage("Voucher " + id + " submitted for independent review.");
							setRef("");
							setEvidence("");
							setAmount("");
							setAllocations([{
								batch_id: "",
								amount: ""
							}]);
							await refresh();
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Submit settlement voucher"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Bank receipts are cash collections; TDS credit requires confirmed deduction evidence and is not cash. Allocate full voucher amount to one or more invoices of the same financier and supplier GSTIN." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input$1,
									value: kind,
									onChange: (e) => setKind(e.target.value),
									disabled: busy,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Bank receipt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "TDS credit" })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Transaction / TDS reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									required: true,
									minLength: 4,
									maxLength: 160,
									value: ref,
									onChange: (e) => setRef(e.target.value),
									disabled: busy
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Evidence reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									required: true,
									minLength: 5,
									maxLength: 500,
									value: evidence,
									onChange: (e) => setEvidence(e.target.value),
									disabled: busy
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Receipt / credit date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									type: "date",
									required: true,
									value: received,
									onChange: (e) => setReceived(e.target.value),
									disabled: busy
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Total amount", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									type: "number",
									min: "0.01",
									step: "0.01",
									required: true,
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									disabled: busy
								})] })
							]
						}),
						allocations.map((a, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Invoice batch ID", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									required: true,
									pattern: "[1-9][0-9]*",
									value: a.batch_id,
									onChange: (e) => setAllocations((p) => p.map((x, i) => i === index ? {
										...x,
										batch_id: e.target.value
									} : x)),
									disabled: busy
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Allocation amount", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input$1,
									required: true,
									type: "number",
									min: "0.01",
									step: "0.01",
									value: a.amount,
									onChange: (e) => setAllocations((p) => p.map((x, i) => i === index ? {
										...x,
										amount: e.target.value
									} : x)),
									disabled: busy
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: btn$2,
									disabled: busy || allocations.length === 1,
									onClick: () => setAllocations((p) => p.filter((_, i) => i !== index)),
									children: "Remove"
								})
							]
						}, index)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: ["Issued invoice IDs on this page: ", register.data?.items.filter((i) => i["invoice_no"]).map((i) => `${text$1(i["batch_id"])} = ${text$1(i["invoice_no"])}`).join(" · ") || "None"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: btn$2,
								disabled: busy || allocations.length >= 50,
								onClick: () => setAllocations((p) => [...p, {
									batch_id: "",
									amount: ""
								}]),
								children: "Add allocation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$2,
								disabled: busy,
								children: "Submit voucher"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "border-t pt-3 font-semibold",
					children: "Settlement history"
				}),
				vouchers.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: err$2(vouchers.error)
				}),
				vouchers.data?.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								text$1(v["id"]),
								" · ",
								text$1(v["kind"]),
								" · ",
								text$1(v["reference"]),
								" · ",
								money$2(v["amount"]),
								" · ",
								text$1(v["status"])
							] }), approve && ["Draft", "Posted"].includes(text$1(v["status"])) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$2,
								disabled: busy,
								onClick: () => {
									setVoucher(v);
									setDecision(v["status"] === "Posted" ? "Reversed" : "Posted");
									setReason("");
								},
								children: "Review"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: rows$1(v["allocations"]).map((a) => `${text$1(a["invoice_no"])}: ${money$2(a["amount"])}`).join(" · ")
						}),
						text$1(v["decision_reason"]) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text$1(v["decision_reason"]) }),
						text$1(v["reversal_reason"]) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Reversal: ", text$1(v["reversal_reason"])] })
					]
				}, text$1(v["id"]))),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$2,
						disabled: busy || voucherOffset === 0,
						onClick: () => setVoucherOffset((v) => Math.max(0, v - 50)),
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$2,
						disabled: busy || (vouchers.data?.length ?? 0) < 50,
						onClick: () => setVoucherOffset((v) => v + 50),
						children: "Next"
					})]
				}),
				voucher && approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2 rounded border p-3",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							await rpc$2("vp_fin03c_decide", {
								p_id: voucher["id"],
								p_decision: decision,
								p_reason: reason
							});
							setVoucher(null);
							setMessage("Decision recorded.");
							setDetail(null);
							await refresh();
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Voucher ",
							text$1(voucher["id"]),
							" · Evidence ",
							text$1(voucher["evidence_ref"]),
							" · ",
							money$2(voucher["amount"]),
							". Verify evidence before posting. Reversal restores outstanding and retains history."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Decision", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: input$1,
							value: decision,
							onChange: (e) => setDecision(e.target.value),
							disabled: busy,
							children: voucher["status"] === "Posted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Reversed" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Posted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rejected" })] })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: input$1,
							required: true,
							minLength: 5,
							maxLength: 1e3,
							value: reason,
							onChange: (e) => setReason(e.target.value),
							disabled: busy
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$2,
								disabled: busy,
								children: "Record decision"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$2,
								type: "button",
								disabled: busy,
								onClick: () => setVoucher(null),
								children: "Cancel"
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "break-words text-destructive",
					children: error
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					children: message
				})
			]
		})]
	});
}
function VpFin03CReceivables() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin") || !capabilities.includes("billing.View")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Register$2, {
		org: tenant.id,
		create: capabilities.includes("billing.Create"),
		approve: capabilities.includes("billing.Approve"),
		canExport: capabilities.includes("billing.Export")
	}, tenant.id);
}
var btn$1 = "rounded border border-border bg-background px-3 py-1.5 text-xs font-medium disabled:opacity-50";
var input = "w-full rounded border border-border bg-background p-2 text-xs";
var obj = (v) => {
	if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid billing response");
	return v;
};
var money$1 = (v) => typeof v === "number" && Number.isFinite(v) ? v.toLocaleString("en-IN", {
	style: "currency",
	currency: "INR"
}) : "—";
var text = (v) => v === null || v === void 0 ? "—" : String(v);
var err$1 = (v) => v instanceof Error ? v.message : String(v);
async function rpc$1(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw new Error(error.message);
	return data;
}
function scoped(v, id) {
	const x = obj(v);
	if (x["org_id"] !== id) throw new Error("Organization mismatch");
	return x;
}
function rows(v) {
	if (!Array.isArray(v)) throw new Error("Invalid line list");
	return v.map(obj);
}
var cell = (v) => {
	const s = v == null ? "" : String(v);
	return "\"" + (/^[\s]*[=+\-@\t\r\n]/.test(s) ? "'" + s : s).replaceAll("\"", "\"\"") + "\"";
};
function reportRows(b) {
	const profile = obj(b["report_profile"]), parties = obj(b["party_snapshot"]);
	const columns = profile["columns"];
	if (!Array.isArray(columns) || columns.some((x) => typeof x !== "string")) throw new Error("Invalid report profile");
	return {
		columns,
		lines: rows(b["lines"]).map((l) => {
			const j = obj(l["calculation"]);
			return {
				...j,
				agency_branch: parties["agency_branch"],
				distance_km: j["road_one_way_km"] ?? j["distance_km"] ?? null,
				adjustments: typeof j["penalty"] === "number" ? -j["penalty"] : null,
				tax: j["gst"],
				total: j["invoice_total_estimate"]
			};
		}),
		title: text(profile["title"])
	};
}
function exportStatement(b) {
	const r = reportRows(b);
	const csv = "﻿" + [
		[r.title, "Internal billing statement — not tax invoice"],
		["Reference", text(b["internal_reference"])],
		r.columns,
		...r.lines.map((l) => r.columns.map((c) => l[c])),
		[
			"Taxable",
			b["taxable"],
			"CGST",
			b["cgst"],
			"SGST",
			b["sgst"],
			"IGST",
			b["igst"],
			"Total",
			b["total"]
		]
	].map((x) => x.map(cell).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = "billing-" + text(b["id"]) + ".csv";
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function Statement({ b }) {
	const r = reportRows(b), g = obj(b["group_key"]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-sm",
				children: r.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs",
				children: [
					text(g["client"]),
					" · ",
					text(g["frequency"]),
					" · ",
					text(g["period_from"]),
					" to ",
					text(g["period_until"]),
					" (exclusive) · ",
					text(g["tax_treatment"]),
					" · ",
					r.lines.length,
					" charges"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: r.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "whitespace-nowrap border-b p-2",
						children: c.replaceAll("_", " ")
					}, c)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: r.lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: r.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "border-b p-2",
						children: text(l[c])
					}, c)) }, i)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-5",
				children: [
					"taxable",
					"cgst",
					"sgst",
					"igst",
					"total"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded bg-muted p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-sm",
						children: money$1(b[k])
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Internal billing statement only. TDS estimate is not deducted from total."
			})
		]
	});
}
function Register$1({ org, create, approve, exportAllowed }) {
	const [offset, setOffset] = (0, import_react.useState)(0), [historyOffset, setHistoryOffset] = (0, import_react.useState)(0), [anchor, setAnchor] = (0, import_react.useState)(null), [preview, setPreview] = (0, import_react.useState)(null), [detail, setDetail] = (0, import_react.useState)(null), [reason, setReason] = (0, import_react.useState)(""), [decision, setDecision] = (0, import_react.useState)("Approved"), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)(""), [error, setError] = (0, import_react.useState)("");
	const queue = useQuery({
		queryKey: [
			"vp-fin03b-queue",
			org,
			offset
		],
		enabled: true,
		retry: false,
		queryFn: async () => rows(scoped(await rpc$1("vp_fin03b_queue", { p_offset: offset }), org)["items"])
	});
	const history = useQuery({
		queryKey: [
			"vp-fin03b-list",
			org,
			historyOffset
		],
		enabled: true,
		retry: false,
		queryFn: async () => rows(scoped(await rpc$1("vp_fin03b_list", { p_offset: historyOffset }), org)["items"])
	});
	async function run(fn) {
		setBusy(true);
		setError("");
		setMessage("");
		try {
			await fn();
		} catch (e) {
			setError(err$1(e));
		} finally {
			setBusy(false);
		}
	}
	const args = (a) => ({
		p_kind: a.source_kind,
		p_source_id: a.source_id,
		p_revision: a.revision
	});
	async function refresh() {
		await Promise.all([queue.refetch(), history.refetch()]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-3 rounded-lg border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Consolidated client billing · FIN-03B"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Select any approved charge to build its matching client/branch/tax/period group. Weekly and monthly groups must be closed. Drafts reserve charges; rejection releases them. Legacy invoice totals do not include this separate register."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btn$1,
					disabled: busy,
					onClick: () => void run(refresh),
					children: "Refresh registers"
				}),
				queue.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs text-destructive",
					children: err$1(queue.error)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: queue.data?.map((v) => {
						const a = v;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 rounded border p-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								a.case_no,
								" · ",
								a.client,
								" · ",
								a.frequency,
								" · ",
								money$1(a.amount)
							] }), create && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$1,
								disabled: busy,
								onClick: () => void run(async () => {
									setDetail(null);
									setPreview(null);
									setAnchor(a);
									setReason("");
									const p = scoped(await rpc$1("vp_fin03b_preview", args(a)), org);
									reportRows(p);
									setPreview(p);
								}),
								children: "Preview group"
							})]
						}, a.source_kind + ":" + a.source_id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						disabled: busy || offset === 0,
						onClick: () => setOffset((v) => Math.max(0, v - 100)),
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						disabled: busy || (queue.data?.length ?? 0) < 100,
						onClick: () => setOffset((v) => v + 100),
						children: "Next"
					})]
				}),
				preview && anchor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Statement, { b: preview }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							const id = await rpc$1("vp_fin03b_create", {
								...args(anchor),
								p_expected_token: preview["preview_token"],
								p_reason: reason
							});
							if (typeof id !== "string") throw new Error("Draft receipt missing; refresh history before retry");
							setMessage("Draft " + id + " reserved. No statutory invoice issued.");
							setPreview(null);
							setAnchor(null);
							setReason("");
							await refresh();
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Draft reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: input,
							required: true,
							minLength: 5,
							maxLength: 1e3,
							disabled: busy,
							value: reason,
							onChange: (e) => setReason(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						disabled: busy,
						children: "Reserve billing draft"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "border-t pt-3 text-sm font-semibold",
					children: "Billing history"
				}),
				history.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs text-destructive",
					children: err$1(history.error)
				}),
				history.data?.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded border p-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						text(b["internal_reference"] ?? b["id"]),
						" · ",
						text(b["status"]),
						" · ",
						money$1(b["total"])
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						disabled: busy,
						onClick: () => void run(async () => {
							setPreview(null);
							setReason("");
							const d = scoped(await rpc$1("vp_fin03b_detail", { p_id: b["id"] }), org);
							if (d["id"] !== b["id"]) throw new Error("Batch mismatch");
							reportRows(d);
							setDetail(d);
						}),
						children: "Open"
					})]
				}, text(b["id"]))),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						disabled: busy || historyOffset === 0,
						onClick: () => setHistoryOffset((v) => Math.max(0, v - 100)),
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						disabled: busy || (history.data?.length ?? 0) < 100,
						onClick: () => setHistoryOffset((v) => v + 100),
						children: "Next"
					})]
				}),
				detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium",
						children: [
							text(detail["status"]),
							" · ",
							text(detail["internal_reference"]),
							" · Internal due date ",
							text(detail["due_on"])
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Statement, { b: detail }),
					detail["status"] === "Approved" && exportAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn$1,
						onClick: () => void run(async () => exportStatement(detail)),
						disabled: busy,
						children: "Export billing statement CSV"
					}),
					detail["status"] === "Draft" && approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							run(async () => {
								await rpc$1("vp_fin03b_decide", {
									p_id: detail["id"],
									p_decision: decision,
									p_reason: reason
								});
								setDetail(scoped(await rpc$1("vp_fin03b_detail", { p_id: detail["id"] }), org));
								setMessage("Independent review recorded.");
								setReason("");
								await refresh();
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: "Confirm all charges, party details, tax treatment and absence of overlapping fees before approving. Reviewer must differ from draft maker."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: ["Decision", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: input,
									value: decision,
									onChange: (e) => setDecision(e.target.value),
									disabled: busy,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Approved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rejected" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: ["Review reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									minLength: 5,
									maxLength: 1e3,
									required: true,
									value: reason,
									onChange: (e) => setReason(e.target.value),
									disabled: busy
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn$1,
								disabled: busy,
								children: "Record decision"
							})
						]
					})
				] }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "break-words text-xs text-destructive",
					children: error
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-xs",
					children: message
				})
			]
		})]
	});
}
function VpFin03BBilling() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin") || !capabilities.includes("billing.View")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Register$1, {
		org: tenant.id,
		create: capabilities.includes("billing.Create"),
		approve: capabilities.includes("billing.Approve"),
		exportAllowed: capabilities.includes("billing.Export")
	}, tenant.id);
}
var cls = "w-full min-w-0 rounded border border-border bg-background px-2 py-1.5 text-xs";
var btn = "rounded border border-border bg-background px-3 py-1.5 text-xs font-medium disabled:opacity-50";
var primary = "rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50";
var money = (x) => typeof x === "number" && Number.isFinite(x) ? x.toLocaleString("en-IN", {
	style: "currency",
	currency: "INR"
}) : "—";
var dateText = (x) => new Date(x).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
var err = (e) => e instanceof Error ? e.message : String(e);
var object = (x) => {
	if (!x || typeof x !== "object" || Array.isArray(x)) throw new Error("Invalid finance response");
	return x;
};
var fval = (f, key) => String(f.get(key) ?? "").trim();
async function rpc(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw new Error(error.message);
	return data;
}
function isoToday() {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return [
		"year",
		"month",
		"day"
	].map((k) => parts.find((p) => p.type === k)?.value ?? "").join("-");
}
function defaults() {
	const t = isoToday();
	const next = /* @__PURE__ */ new Date(t + "T00:00:00Z");
	next.setUTCDate(next.getUTCDate() + 1);
	return {
		from: t.slice(0, 8) + "01",
		until: next.toISOString().slice(0, 10),
		offset: 0
	};
}
function Breakdown({ j }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded border p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-3 lg:grid-cols-6",
				children: [
					["Base fee", "base_fee"],
					["Travel", "travel_fee"],
					["Penalty", "penalty"],
					["Taxable", "pretax_total"],
					["GST", "gst"],
					["Invoice estimate", "invoice_total_estimate"]
				].map(([label, k]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded bg-muted p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-sm",
						children: money(j[k])
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs",
				children: [
					"SLA ",
					String(j["rule_key"]),
					" v",
					String(j["revision"]),
					" · ",
					String(j["billing_frequency"]),
					" · TDS estimate ",
					money(j["indicative_tds"]),
					" (separate)"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "cursor-pointer text-xs",
				children: "Evidence and calculation snapshot"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs",
				children: JSON.stringify(j, null, 2)
			})] })
		]
	});
}
function EventEditor({ item, orgId, canCreate, canApprove, refresh }) {
	const [visit, setVisit] = (0, import_react.useState)("");
	const [late, setLate] = (0, import_react.useState)("");
	const [tat, setTat] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [decision, setDecision] = (0, import_react.useState)("Approved");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const args = () => {
		if (visit && !/^\d+$/.test(visit)) throw new Error("Enter a valid visit ID");
		const days = late.trim() === "" ? null : Number(late);
		if (days !== null && (!Number.isSafeInteger(days) || days < 0 || days > 36500)) throw new Error("Invalid late days");
		return {
			p_kind: item.source_kind,
			p_source_id: item.source_id,
			p_distance_visit: visit || null,
			p_late_days: days,
			p_tat_reference: tat.trim() || null
		};
	};
	async function run(fn) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await fn();
		} catch (e) {
			setError(err(e));
		} finally {
			setBusy(false);
		}
	}
	const canSubmit = canCreate && !item.legacy_invoiced && ["Unreviewed", "Rejected"].includes(item.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "cursor-pointer text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: item.case_no
				}),
				" · ",
				item.client,
				" · ",
				item.event_kind.replaceAll("_", " "),
				" · ",
				dateText(item.occurred_at),
				" · ",
				item.status,
				item.legacy_invoiced ? " · Existing legacy invoice" : ""
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Source ",
						item.source_kind,
						" #",
						item.source_id,
						" · revision ",
						item.revision,
						" · ",
						item.property_type
					]
				}),
				item.calculation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, { j: item.calculation }),
				" ",
				item.submission_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs",
					children: ["Submission: ", item.submission_reason]
				}),
				item.decision_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs",
					children: ["Decision: ", item.decision_reason]
				}),
				canSubmit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1 text-xs",
								children: ["Distance visit ID (optional for report)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: cls,
									inputMode: "numeric",
									value: visit,
									disabled: busy,
									onChange: (e) => {
										setVisit(e.target.value);
										setPreview(null);
									},
									placeholder: "Auto if exactly one"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1 text-xs",
								children: ["Contractual late days (only if penalty)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: cls,
									type: "number",
									min: "0",
									step: "1",
									value: late,
									disabled: busy,
									onChange: (e) => {
										setLate(e.target.value);
										setPreview(null);
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "space-y-1 text-xs",
								children: ["TAT evidence reference (if penalty)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: cls,
									value: tat,
									maxLength: 1e3,
									disabled: busy,
									onChange: (e) => {
										setTat(e.target.value);
										setPreview(null);
									}
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn,
						type: "button",
						disabled: busy,
						onClick: () => {
							setPreview(null);
							run(async () => {
								const j = object(await rpc("vp_fin03a_preview", args()));
								if (j["org_id"] !== orgId || j["source_id"] !== item.source_id || j["source_kind"] !== item.source_kind || j["event_verified"] !== true || j["financial_posting"] !== false) throw new Error("Event preview mismatch");
								setPreview(j);
							});
						},
						children: "Calculate actual event"
					}),
					preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, { j: preview }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							run(async () => {
								await rpc("vp_fin03a_submit", {
									...args(),
									p_expected_revision: item.revision,
									p_reason: reason,
									p_expected_calculation: preview
								});
								setPreview(null);
								setNotice("Submitted for independent review. No invoice created.");
								await refresh();
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: ["Submission reason and evidence confirmation", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: cls,
								value: reason,
								onChange: (e) => setReason(e.target.value),
								required: true,
								minLength: 5,
								maxLength: 1e3,
								disabled: busy
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: primary,
							disabled: busy,
							children: "Submit for review"
						})]
					})] })
				] }),
				item.status === "Draft" && canApprove && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-2",
					onSubmit: (e) => {
						e.preventDefault();
						run(async () => {
							await rpc("vp_fin03a_decide", {
								p_kind: item.source_kind,
								p_source_id: item.source_id,
								p_revision: item.revision,
								p_decision: decision,
								p_reason: reason
							});
							setNotice("Review recorded. No invoice created.");
							await refresh();
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Independent reviewer: confirm event, applicable SLA, distance accuracy, contractual TAT, taxes and absence of overlapping charges."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: ["Decision", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: cls,
								value: decision,
								onChange: (e) => setDecision(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Approved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rejected" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: ["Review reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: cls,
								value: reason,
								onChange: (e) => setReason(e.target.value),
								required: true,
								minLength: 5,
								maxLength: 1e3,
								disabled: busy
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: primary,
							disabled: busy,
							children: "Record independent decision"
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "break-words text-xs text-destructive",
					children: error
				}),
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-xs",
					children: notice
				})
			]
		})]
	});
}
function Register({ orgId, canCreate, canApprove }) {
	const [range, setRange] = (0, import_react.useState)(defaults);
	const [caseNum, setCaseNum] = (0, import_react.useState)("");
	const [historyNum, setHistoryNum] = (0, import_react.useState)(null);
	const q = useQuery({
		queryKey: [
			"vp-fin03a-queue",
			orgId,
			range
		],
		enabled: true,
		retry: false,
		queryFn: async () => {
			const x = object(await rpc("vp_fin03a_queue", {
				p_from: range.from,
				p_until: range.until,
				p_offset: range.offset
			}));
			if (x["org_id"] !== orgId || !Array.isArray(x["items"])) throw new Error("Tenant queue mismatch");
			return x["items"];
		}
	});
	const history = useQuery({
		queryKey: [
			"vp-fin03a-history",
			orgId,
			historyNum
		],
		enabled: historyNum !== null,
		retry: false,
		queryFn: async () => {
			const x = object(await rpc("vp_fin03a_history", { p_num: historyNum }));
			if (x["org_id"] !== orgId || x["case_num"] !== historyNum || !Array.isArray(x["items"])) throw new Error("History mismatch");
			return x["items"];
		}
	});
	function load(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		const from = fval(f, "from"), until = fval(f, "until");
		if (from === range.from && until === range.until && range.offset === 0) q.refetch();
		else setRange({
			from,
			until,
			offset: 0
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-3 rounded-lg border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Billable event register · FIN-03A"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Automatically discover actual completed visits and released reports. Existing invoice workflow is unchanged. Do not treat approved events as posted invoices. Events with a missing, ambiguous or changed historical SLA require separate review."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-wrap items-end gap-2",
					onSubmit: load,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["From (IST)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: cls,
								name: "from",
								type: "date",
								defaultValue: range.from,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Until (exclusive, IST)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: cls,
								name: "until",
								type: "date",
								defaultValue: range.until,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							children: "Load events"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							type: "button",
							onClick: () => void q.refetch(),
							children: "Refresh"
						})
					]
				}),
				q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs text-destructive",
					children: err(q.error)
				}) : q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs",
						children: [q.data.length, " events on this page"]
					}),
					q.data.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventEditor, {
						item: x,
						orgId,
						canCreate,
						canApprove,
						refresh: q.refetch
					}, x.source_kind + ":" + x.source_id + ":" + x.revision + ":" + x.status)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							disabled: range.offset === 0,
							onClick: () => setRange((v) => ({
								...v,
								offset: Math.max(0, v.offset - 100)
							})),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							disabled: q.data.length < 100,
							onClick: () => setRange((v) => ({
								...v,
								offset: v.offset + 100
							})),
							children: "Next"
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs",
					children: "Loading events…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-wrap items-end gap-2 border-t pt-3",
					onSubmit: (e) => {
						e.preventDefault();
						const n = Number(caseNum);
						if (Number.isSafeInteger(n) && n > 0) if (n === historyNum) history.refetch();
						else setHistoryNum(n);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["Case revision history (internal numeric case number)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: cls,
							type: "number",
							min: "1",
							step: "1",
							value: caseNum,
							onChange: (e) => setCaseNum(e.target.value),
							required: true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn,
						children: "Load history"
					})]
				}),
				history.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs text-destructive",
					children: err(history.error)
				}) : history.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-96 overflow-auto whitespace-pre-wrap break-words text-xs",
					children: JSON.stringify(history.data, null, 2)
				}) : null
			]
		})]
	});
}
function VpFin03ARegister() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin") || !capabilities.includes("billing.View")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Register, {
		orgId: tenant.id,
		canCreate: capabilities.includes("billing.Create"),
		canApprove: capabilities.includes("billing.Approve")
	}, tenant.id);
}
function normalizeInvoice(r) {
	return {
		...r,
		invoice_id: String(r["invoice_id"]),
		branch_id: r["branch_id"] == null ? null : String(r["branch_id"]),
		case_num: Number(r["case_num"]),
		service_fee: Number(r["service_fee"]),
		tax_rate: Number(r["tax_rate"]),
		cgst: Number(r["cgst"]),
		sgst: Number(r["sgst"]),
		igst: Number(r["igst"]),
		total: Number(r["total"]),
		paid: Number(r["paid"]),
		outstanding: Number(r["outstanding"])
	};
}
function normalizeSummary(s) {
	return {
		invoice_count: Number(s?.["invoice_count"] ?? 0),
		billed: Number(s?.["billed"] ?? 0),
		collected: Number(s?.["collected"] ?? 0),
		outstanding: Number(s?.["outstanding"] ?? 0),
		overdue: Number(s?.["overdue"] ?? 0)
	};
}
function branchArg(branch) {
	return branch === "all" ? null : branch;
}
function useVpBillingPermissions() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing-perms",
			tenant.id,
			tenant.role
		],
		queryFn: async () => {
			const flags = await Promise.all([
				"View",
				"Create",
				"Approve",
				"Export"
			].map(async (p_action) => {
				const { data, error } = await vpDb.rpc("vp_billing_can", { p_action });
				if (error) throw error;
				return data === true;
			}));
			return {
				view: flags[0] ?? false,
				create: flags[1] ?? false,
				approve: flags[2] ?? false,
				export: flags[3] ?? false
			};
		},
		staleTime: 15e3
	});
}
function useVpBillingSettings(enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"settings"
		],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_billing_settings").select("invoice_prefix,payment_days").eq("org_id", tenant.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
function useVpBillingSummary(enabled) {
	const { tenant, branch } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"summary",
			branch
		],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_billing_summary", { p_branch_id: branchArg(branch) });
			if (error) throw error;
			return normalizeSummary(data);
		},
		staleTime: 1e4
	});
}
async function fetchVpBillingInvoices(branch, limit = 100, offset = 0) {
	const { data, error } = await vpDb.rpc("vp_billing_list", {
		p_branch_id: branchArg(branch),
		p_limit: limit,
		p_offset: offset
	});
	if (error) throw error;
	return (data ?? []).map(normalizeInvoice);
}
function useVpBillingInvoices(enabled, limit = 100, offset = 0) {
	const { tenant, branch } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"invoices",
			branch,
			limit,
			offset
		],
		enabled,
		queryFn: () => fetchVpBillingInvoices(branch, limit, offset),
		staleTime: 1e4
	});
}
function useVpBillingReady(enabled) {
	const { tenant, branch } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"ready",
			branch
		],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_billing_ready_cases", { p_branch_id: branchArg(branch) });
			if (error) throw error;
			return (data ?? []).map((r) => ({
				...r,
				case_num: Number(r["case_num"]),
				branch_id: r["branch_id"] == null ? null : String(r["branch_id"]),
				fee_suggestion: r["fee_suggestion"] == null ? null : Number(r["fee_suggestion"])
			}));
		},
		staleTime: 1e4
	});
}
function useVpBillingBreakdown(enabled) {
	const { tenant, branch } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"breakdown",
			branch
		],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_billing_breakdown", { p_branch_id: branchArg(branch) });
			if (error) throw error;
			return (data ?? []).map((r) => ({
				...r,
				invoice_count: Number(r["invoice_count"]),
				billed: Number(r["billed"]),
				collected: Number(r["collected"]),
				outstanding: Number(r["outstanding"])
			}));
		},
		staleTime: 1e4
	});
}
function useVpBillingLegacyCount(enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"legacy"
		],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_billing_legacy_count");
			if (error) throw error;
			return Number(data ?? 0);
		},
		staleTime: 6e4
	});
}
function useVpBillingReceipts(invoiceId, enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-billing",
			tenant.id,
			"receipts",
			invoiceId
		],
		enabled: enabled && !!invoiceId,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_billing_receipts", { p_invoice_id: invoiceId });
			if (error) throw error;
			return (data ?? []).map((r) => ({
				...r,
				id: String(r["id"]),
				amount: Number(r["amount"])
			}));
		},
		staleTime: 1e4
	});
}
async function vpBillingSaveSettings(prefix, days) {
	const { error } = await vpDb.rpc("vp_billing_save_settings", {
		p_prefix: prefix,
		p_payment_days: days
	});
	if (error) throw error;
}
async function vpBillingRaise(caseNum, fee, treatment, rate, note) {
	const { data, error } = await vpDb.rpc("vp_billing_raise", {
		p_case_num: caseNum,
		p_service_fee: fee,
		p_tax_treatment: treatment,
		p_tax_rate: rate,
		p_tax_note: note
	});
	if (error) throw error;
	return String(data);
}
async function vpBillingRecordPayment(invoiceId, amount, date, ref, method) {
	const { data, error } = await vpDb.rpc("vp_billing_record_payment", {
		p_invoice_id: invoiceId,
		p_amount: amount,
		p_payment_date: date,
		p_reference: ref,
		p_method: method
	});
	if (error) throw error;
	return String(data);
}
var methods = [
	"NEFT",
	"RTGS",
	"IMPS",
	"UPI",
	"Cheque",
	"Cash",
	"Other"
];
function errMsg(e) {
	return e instanceof Error ? e.message : String(e);
}
function amount(s) {
	if (!/^\d+(?:\.\d{1,2})?$/.test(s.trim())) return NaN;
	return Number(s);
}
function csvSafe(s) {
	const v = String(s ?? "");
	return `"${(/^[\s]*[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, "\"\"")}"`;
}
function downloadCSV(filename, rows) {
	const csv = "﻿" + rows.map((r) => r.map(csvSafe).join(",")).join("\r\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}
function BillingPage() {
	const { tenant, branch } = useApp();
	const qc = useQueryClient();
	const perms = useVpBillingPermissions();
	const view = perms.data?.view === true;
	const create = perms.data?.create === true;
	const approve = perms.data?.approve === true;
	const exportAllowed = perms.data?.export === true;
	const settings = useVpBillingSettings(view);
	const stats = useVpBillingSummary(view);
	const [page, setPage] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => setPage(0), [tenant.id, branch]);
	const invoices = useVpBillingInvoices(view, 100, page * 100);
	const ready = useVpBillingReady(create);
	const breakdown = useVpBillingBreakdown(view);
	const legacy = useVpBillingLegacyCount(view);
	const [configOpen, setConfigOpen] = (0, import_react.useState)(false);
	const [prefix, setPrefix] = (0, import_react.useState)("");
	const [days, setDays] = (0, import_react.useState)("30");
	const [raiseFor, setRaiseFor] = (0, import_react.useState)(null);
	const [fee, setFee] = (0, import_react.useState)("");
	const [taxTreatment, setTaxTreatment] = (0, import_react.useState)("Unselected");
	const [taxRate, setTaxRate] = (0, import_react.useState)("");
	const [taxNote, setTaxNote] = (0, import_react.useState)("");
	const [paymentFor, setPaymentFor] = (0, import_react.useState)(null);
	const [paymentAmount, setPaymentAmount] = (0, import_react.useState)("");
	const [paymentDate, setPaymentDate] = (0, import_react.useState)("");
	const [paymentRef, setPaymentRef] = (0, import_react.useState)("");
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("NEFT");
	const receipts = useVpBillingReceipts(paymentFor?.invoice_id ?? null, view);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const errors = [
		perms.error,
		settings.error,
		stats.error,
		invoices.error,
		ready.error,
		breakdown.error,
		legacy.error
	].filter(Boolean);
	async function refresh() {
		await Promise.all([
			qc.invalidateQueries({ queryKey: ["vp-billing", tenant.id] }),
			qc.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] }),
			qc.invalidateQueries({ queryKey: ["vp-report-versions", tenant.id] })
		]);
	}
	function openConfig() {
		setPrefix(settings.data?.invoice_prefix ?? "");
		setDays(String(settings.data?.payment_days ?? 30));
		setConfigOpen(true);
	}
	function openRaise(c) {
		setRaiseFor(c);
		setFee(c.fee_suggestion !== null ? String(c.fee_suggestion) : "");
		setTaxTreatment("Unselected");
		setTaxRate("");
		setTaxNote("");
	}
	async function saveConfig() {
		const n = Number(days);
		if (!Number.isInteger(n) || n < 1 || n > 365) {
			toast.error("Payment terms must be between 1 and 365 days");
			return;
		}
		setBusy(true);
		try {
			await vpBillingSaveSettings(prefix.trim(), n);
			await refresh();
			setConfigOpen(false);
			toast.success("Billing settings saved");
		} catch (e) {
			toast.error(errMsg(e));
		} finally {
			setBusy(false);
		}
	}
	async function issue() {
		if (!raiseFor || taxTreatment === "Unselected") {
			toast.error("Choose GST treatment");
			return;
		}
		const f = amount(fee), t = amount(taxRate);
		if (!(f > 0) || !Number.isFinite(t) || t < 0 || t > 100) {
			toast.error("Enter an explicit fee and GST rate");
			return;
		}
		if (taxTreatment === "No GST" && (!taxNote.trim() || t !== 0)) {
			toast.error("No GST requires rate 0 and an explanation");
			return;
		}
		if (taxTreatment !== "No GST" && t <= 0) {
			toast.error("Enter a positive GST rate for the selected treatment");
			return;
		}
		setBusy(true);
		try {
			await vpBillingRaise(raiseFor.case_num, f, taxTreatment, t, taxNote.trim());
			setRaiseFor(null);
			setPage(0);
			await refresh();
			toast.success("Invoice raised and saved to Supabase");
		} catch (e) {
			toast.error(errMsg(e));
		} finally {
			setBusy(false);
		}
	}
	function openPayment(i) {
		setPaymentFor(i);
		setPaymentAmount("");
		setPaymentRef("");
		setPaymentMethod("NEFT");
		setPaymentDate((/* @__PURE__ */ new Date()).toLocaleDateString("en-CA"));
	}
	async function recordPayment() {
		if (!paymentFor) return;
		const n = amount(paymentAmount);
		if (!(n > 0) || n > paymentFor.outstanding) {
			toast.error("Amount must be positive and not exceed outstanding");
			return;
		}
		if (paymentRef.trim().length < 4) {
			toast.error("Enter a unique receipt/bank reference");
			return;
		}
		setBusy(true);
		try {
			await vpBillingRecordPayment(paymentFor.invoice_id, n, paymentDate, paymentRef.trim(), paymentMethod);
			await refresh();
			await qc.invalidateQueries({ queryKey: [
				"vp-billing",
				tenant.id,
				"receipts",
				paymentFor.invoice_id
			] });
			setPaymentFor(null);
			toast.success("Collection recorded; invoice balance updated");
		} catch (e) {
			toast.error(errMsg(e));
		} finally {
			setBusy(false);
		}
	}
	async function exportInvoices() {
		if (!exportAllowed) return;
		setExporting(true);
		try {
			const rows = [[
				"Invoice",
				"Case",
				"Bank",
				"Branch",
				"Date",
				"Due",
				"Fee",
				"Tax treatment",
				"Tax rate %",
				"CGST",
				"SGST",
				"IGST",
				"Total",
				"Collected",
				"Outstanding",
				"Status"
			]];
			for (let offset = 0;; offset += 500) {
				const batch = await fetchVpBillingInvoices(branch, 500, offset);
				for (const i of batch) rows.push([
					i.invoice_no,
					i.case_no,
					i.bank_name,
					i.branch_name,
					i.created_date,
					i.due_date,
					i.service_fee,
					i.tax_treatment,
					i.tax_rate,
					i.cgst,
					i.sgst,
					i.igst,
					i.total,
					i.paid,
					i.outstanding,
					i.status
				]);
				if (batch.length < 500) break;
			}
			downloadCSV(`valuationpro-invoices-${(/* @__PURE__ */ new Date()).toLocaleDateString("en-CA")}.csv`, rows);
			toast.success("Invoice CSV prepared (tenant and branch scoped)");
		} catch (e) {
			toast.error(errMsg(e));
		} finally {
			setExporting(false);
		}
	}
	const s = stats.data ?? {
		invoice_count: 0,
		billed: 0,
		collected: 0,
		outstanding: 0,
		overdue: 0
	};
	const bankRows = (breakdown.data ?? []).filter((x) => x.kind === "Bank").sort((a, b) => b.billed - a.billed);
	const branchRows = (breakdown.data ?? []).filter((x) => x.kind === "Branch").sort((a, b) => b.billed - a.billed);
	const maxBank = Math.max(1, ...bankRows.map((x) => x.billed));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
			title: "Billing & MIS",
			description: "Actual released-report invoices, partial collections and tenant-scoped branch/bank MIS. GST treatment and rate are entered explicitly.",
			children: [approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: openConfig,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), "Billing setup"]
			}), exportAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				disabled: exporting || !view,
				onClick: () => void exportInvoices(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), exporting ? "Exporting…" : "Export CSV"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin03ARegister, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin03BBilling, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin03CReceivables, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04APolicy, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04BReview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04CReview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04DAdvances, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04D2Accounts, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin05CRegisters, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin05BProfitability, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin05ADashboard, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04D3, {}),
		errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 rounded-md border border-destructive/40 p-3 text-sm text-destructive",
			children: ["Database error: ", errMsg(errors[0])]
		}),
		perms.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted-foreground",
			children: "Checking billing permissions…"
		}),
		!perms.isLoading && !view && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6 text-sm text-muted-foreground",
			children: [
				"Billing access is not configured for your role. Ask your tenant administrator to enable ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "billing.View" }),
				" in the Role Matrix."
			]
		}) }),
		view && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			!settings.isLoading && !settings.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 rounded-md border border-warning/40 p-3 text-sm",
				children: "Invoice numbering and payment terms are not configured. An authorized billing approver must complete Billing setup before raising invoices."
			}),
			(legacy.data ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 rounded-md border p-3 text-xs text-muted-foreground",
				children: [
					legacy.data,
					" historical invoice(s) in the original ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "invoices" }),
					" table are not linked to a case. They are excluded from Phase 6 metrics until explicitly reconciled; no historical values were fabricated."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total billed",
						value: fmtINR(s.billed),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Collected",
						value: fmtINR(s.collected),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Outstanding",
						value: fmtINR(s.outstanding)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue",
						value: fmtINR(s.overdue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-xs text-muted-foreground",
				children: [
					s.invoice_count,
					" case-linked invoices in this ",
					branch === "all" ? "agency" : "branch",
					" · Amounts are billed service fees plus recorded tax, not property valuations. Overdue is based on the invoice due date and outstanding balance."
				]
			}),
			create && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-4 border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base",
						children: [
							"Ready to bill (",
							ready.data?.length ?? 0,
							")"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2",
					children: [
						ready.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Loading released reports…"
						}),
						!ready.isLoading && ready.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No newly released, unbilled reports. Only completed Phase 5 report releases are billable."
						}),
						(ready.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: c.case_no
								}),
								" · ",
								c.bank_name,
								" · ",
								c.branch_name,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: c.fee_suggestion != null ? `Recorded case fee: ${fmtINR(c.fee_suggestion)}` : "No recorded case fee — enter agreed service charge"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: !settings.data,
								onClick: () => openRaise(c),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Raise invoice"]
							})]
						}, c.case_num))
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-4 border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table$2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Invoice" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Bank / Case" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date / Due" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Fee"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "CGST"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "SGST"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "IGST"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Total"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Balance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [(invoices.data ?? []).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: i.invoice_no
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-xs",
							children: [i.bank_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground",
								children: i.case_no
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-xs",
							children: [i.created_date, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: ["Due: ", i.due_date]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: fmtINR(i.service_fee)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: fmtINR(i.cgst)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: fmtINR(i.sgst)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: fmtINR(i.igst)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right font-semibold",
							children: fmtINR(i.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: fmtINR(i.outstanding)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: i.status === "Overdue" ? "destructive" : i.status === "Paid" ? "secondary" : "outline",
							children: i.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => openPayment(i),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-3" }), approve && i.outstanding > 0 ? "Collect" : "Receipts"]
							})
						})
					] }, i.invoice_id)), !invoices.isLoading && invoices.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 11,
						className: "py-10 text-center text-muted-foreground",
						children: "No case-linked invoices found."
					}) })] })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2 px-3 py-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Page ", page + 1] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: page === 0,
							onClick: () => setPage((x) => Math.max(0, x - 1)),
							children: "Previous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: (invoices.data ?? []).length < 100,
							onClick: () => setPage((x) => x + 1),
							children: "Next"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Branch MIS — billed revenue"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table$2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Branch" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Invoices"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Billed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Collected"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "text-right",
								children: "Outstanding"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [branchRows.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: x.label || "Unassigned" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: x.invoice_count
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: fmtINR(x.billed)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: fmtINR(x.collected)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: fmtINR(x.outstanding)
							})
						] }, x.label)), branchRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 5,
							className: "py-6 text-center text-muted-foreground",
							children: "No billing activity"
						}) })] })] })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Revenue by bank — billed"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [bankRows.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: fmtINR(x.billed)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 rounded-full bg-primary",
										style: { width: `${x.billed / maxBank * 100}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"Collected ",
										fmtINR(x.collected),
										" · Due ",
										fmtINR(x.outstanding)
									]
								})
							]
						}, x.label)), bankRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No billed bank revenue yet."
						})]
					})]
				})]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: configOpen,
			onOpenChange: setConfigOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Billing setup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Specify your actual invoice prefix and agreed credit period. No tax rate is assumed by this configuration." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Invoice prefix" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: prefix,
							onChange: (e) => setPrefix(e.target.value.toUpperCase()),
							placeholder: "YOURORG/INV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Format: prefix/YYYY/00001. Only uppercase letters, digits, / and -."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment terms (days)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						max: 365,
						value: days,
						onChange: (e) => setDays(e.target.value)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setConfigOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || !prefix,
					onClick: () => void saveConfig(),
					children: "Save"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!raiseFor,
			onOpenChange: (o) => !o && setRaiseFor(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Raise bank invoice" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					raiseFor?.case_no,
					" · ",
					raiseFor?.bank_name,
					". Released report required. Confirm agreed service charge and tax treatment."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service fee (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0.01",
							step: "0.01",
							value: fee,
							onChange: (e) => setFee(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tax treatment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: taxTreatment,
							onValueChange: (v) => {
								setTaxTreatment(v);
								setTaxRate("");
								setTaxNote("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Unselected",
									children: "Select treatment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "CGST+SGST",
									children: "CGST + SGST (intra-state)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "IGST",
									children: "IGST (inter-state)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "No GST",
									children: "No GST (requires reason)"
								})
							] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tax rate (%) — enter actual applicable rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 100,
							step: "0.01",
							value: taxRate,
							onChange: (e) => setTaxRate(e.target.value)
						})] }),
						taxTreatment === "No GST" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason for no GST" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: taxNote,
							onChange: (e) => setTaxNote(e.target.value),
							placeholder: "Enter verified reason"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Tax classification and applicability must be checked against the actual transaction. This form does not generate a statutory GST tax-invoice PDF."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setRaiseFor(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || !fee || !taxRate || taxTreatment === "Unselected",
					onClick: () => void issue(),
					children: busy ? "Saving…" : "Raise invoice"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!paymentFor,
			onOpenChange: (o) => !o && setPaymentFor(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Collections & receipts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					paymentFor?.invoice_no,
					" · Outstanding ",
					fmtINR(paymentFor?.outstanding ?? 0),
					". Record actual bank receipts only."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-28 space-y-1 overflow-auto text-xs",
					children: [(receipts.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						r.payment_date,
						" · ",
						fmtINR(r.amount),
						" · ",
						r.method,
						" · ",
						r.reference
					] }, r.id)), !receipts.isLoading && !receipts.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "No recorded receipt entries."
					})]
				}),
				approve && (paymentFor?.outstanding ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount received (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0.01",
							step: "0.01",
							value: paymentAmount,
							onChange: (e) => setPaymentAmount(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: paymentDate,
							onChange: (e) => setPaymentDate(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: paymentMethod,
							onValueChange: (v) => setPaymentMethod(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: methods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: m,
								children: m
							}, m)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank / receipt reference (unique)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: paymentRef,
							onChange: (e) => setPaymentRef(e.target.value)
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setPaymentFor(null),
					children: "Close"
				}), approve && (paymentFor?.outstanding ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || !paymentAmount || !paymentRef || !paymentDate,
					onClick: () => void recordPayment(),
					children: busy ? "Saving…" : "Record collection"
				})] })
			] })
		})
	] });
}
//#endregion
export { BillingPage as component };
