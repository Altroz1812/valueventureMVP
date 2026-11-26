import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useVpBanks, c as useVpPropertyTypes } from "./vp-cases-DcoVfkM7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-fin02-config-DW5RnkQ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputClass = "w-full min-w-0 rounded-md border border-border bg-background px-2.5 py-2 text-sm";
var btn = "rounded-md border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50";
var primary = "rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50";
var events = [
	"report_released",
	"report_delivered",
	"visit_completed",
	"revisit_completed",
	"cancelled_before_visit",
	"cancelled_after_visit",
	"no_access"
];
var labelOf = (s) => s.replaceAll("_", " ");
function today() {
	const parts = new Intl.DateTimeFormat("en-CA", {
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
function num(s) {
	if (!s.trim()) throw new Error("Complete required numeric fields");
	const n = Number(s);
	if (!Number.isFinite(n)) throw new Error("Invalid number");
	return n;
}
function nullableNum(s) {
	return s.trim() ? num(s) : null;
}
function message(e) {
	return e instanceof Error ? e.message : typeof e === "object" && e !== null && "message" in e ? String(e.message) : String(e);
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "min-w-0 space-y-1 text-xs font-medium",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block",
			children: label
		}), children]
	});
}
function Text({ label, value, onChange, type = "text", required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: inputClass,
			type,
			step: type === "number" ? "any" : void 0,
			required,
			value,
			onChange: (e) => onChange(e.target.value)
		})
	});
}
function Choice({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			className: inputClass,
			value,
			onChange: (e) => onChange(e.target.value),
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o.value,
				children: o.label
			}, o.value))
		})
	});
}
var options = (values) => values.map((value) => ({
	value,
	label: labelOf(value)
}));
function Section({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-3 rounded-lg border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer px-4 py-3 text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t border-border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: description
			}), children]
		})]
	});
}
function useCatalog() {
	const { tenant, capabilities } = useApp();
	return useQuery({
		queryKey: ["vp-fin02-catalog", tenant.id],
		enabled: capabilities.includes("tenant.admin"),
		retry: false,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_fin02_catalog");
			if (error) throw error;
			const c = data;
			if (!c || c.org_id !== tenant.id || !Array.isArray(c.rules) || !Array.isArray(c.geo) || !Array.isArray(c.profiles) || !Array.isArray(c.client_branches) || !Array.isArray(c.templates)) throw new Error("Unexpected finance configuration response");
			return c;
		}
	});
}
function useAction(refresh) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [failed, setFailed] = (0, import_react.useState)(false);
	async function run(action, success) {
		if (busy) return;
		setBusy(true);
		setNotice("");
		setFailed(false);
		try {
			await action();
			setNotice(success);
			try {
				await refresh();
			} catch (e) {
				setFailed(true);
				setNotice(`${success} Refresh failed: ${message(e)}`);
			}
		} catch (e) {
			setFailed(true);
			setNotice(message(e));
		} finally {
			setBusy(false);
		}
	}
	return {
		busy,
		run,
		feedback: notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: failed ? "alert" : "status",
			className: `text-xs ${failed ? "text-destructive" : "text-muted-foreground"}`,
			children: notice
		}) : null
	};
}
async function rpc(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw error;
	return data;
}
function Load({ query }) {
	return query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "alert",
		className: "flex flex-wrap items-center gap-2 text-xs text-destructive",
		children: [message(query.error), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: btn,
			type: "button",
			onClick: () => void query.refetch(),
			children: "Retry"
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: "Loading configuration…"
	});
}
function VpFin02BranchGeo() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchGeo, {}, tenant.id);
}
function BranchGeo() {
	const { tenantBranches } = useApp();
	const query = useCatalog();
	const [id, setId] = (0, import_react.useState)("");
	const selected = tenantBranches.find((b) => b.id === id && b.status === "Active");
	const geo = query.data?.geo.find((g) => g.branch_id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Commercial branch geo-tagging",
		description: "Record the actual agency office coordinates for SLA distance pricing. This does not change GPS check-in or operational geofence settings.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
			label: "Agency branch",
			value: id,
			onChange: setId,
			options: [{
				value: "",
				label: "Select branch"
			}, ...tenantBranches.filter((b) => b.status === "Active").map((b) => ({
				value: b.id,
				label: b.name
			}))]
		}), !query.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Load, { query }) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeoForm, {
			id,
			geo,
			refresh: () => query.refetch()
		}, `${id}:${geo?.revision ?? 0}`) : null]
	});
}
function GeoForm({ id, geo, refresh }) {
	const [lat, setLat] = (0, import_react.useState)(geo ? String(geo.latitude) : "");
	const [lng, setLng] = (0, import_react.useState)(geo ? String(geo.longitude) : "");
	const [reason, setReason] = (0, import_react.useState)("");
	const a = useAction(refresh);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			e.preventDefault();
			a.run(() => rpc("vp_fin02_save_geo", {
				p_branch_id: id,
				p_expected_revision: geo?.revision ?? 0,
				p_lat: num(lat),
				p_lng: num(lng),
				p_reason: reason
			}), "New coordinate revision saved.");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [geo ? `Current revision ${geo.revision}` : "No commercial geo-tag recorded", " · Enter verified office coordinates, not a customer location."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					label: "Latitude",
					value: lat,
					onChange: setLat,
					type: "number",
					required: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					label: "Longitude",
					value: lng,
					onChange: setLng,
					type: "number",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				label: "Source / reason (minimum 5 characters)",
				value: reason,
				onChange: setReason,
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: primary,
				disabled: a.busy,
				children: "Save coordinate revision"
			}),
			a.feedback
		]
	});
}
function VpFin02BankConfig() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankConfig, {}, tenant.id);
}
function BankConfig() {
	const q = useCatalog();
	const { data: banks = [] } = useVpBanks();
	const { data: types = [] } = useVpPropertyTypes();
	const { tenantBranches } = useApp();
	const [bank, setBank] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)("");
	const bankOptions = [{
		value: "",
		label: "Select client"
	}, ...banks.map((b) => ({
		value: b.name,
		label: b.name
	}))];
	const branchOptions = [{
		value: "",
		label: "Any servicing branch"
	}, ...tenantBranches.filter((b) => b.status === "Active").map((b) => ({
		value: b.id,
		label: b.name
	}))];
	const typeOptions = types.filter((t) => t.is_active).map((t) => ({
		value: t.code,
		label: t.name
	}));
	const c = q.data;
	const rules = c?.rules.filter((r) => r.bank_name === bank) ?? [];
	const latest = rules.find((r) => r.rule_key === selected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Client SLA, pricing and reporting",
		description: "Existing bank masters and tariffs remain active. Configure versioned commercial rules here; the preview does not create invoices or change case workflows.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
			label: "Financier / client",
			value: bank,
			onChange: (v) => {
				setBank(v);
				setSelected("");
			},
			options: bankOptions
		}), !c ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Load, { query: q }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [bank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientBranchForm, {
				bank,
				rows: c.client_branches.filter((b) => b.bank_name === bank),
				refresh: () => q.refetch()
			}, bank),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border p-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "SLA rule configuration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Rule revision",
						value: selected,
						onChange: setSelected,
						options: [{
							value: "",
							label: "New rule key"
						}, ...Array.from(new Set(rules.map((r) => r.rule_key))).map((value) => ({
							value,
							label: value
						}))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleForm, {
						bank,
						old: latest,
						branchOptions,
						clientBranches: c.client_branches.filter((b) => b.bank_name === bank),
						typeOptions,
						templates: c.templates.filter((t) => t.bank_name === bank),
						refresh: () => q.refetch()
					}, `${bank}:${selected}:${latest?.revision ?? 0}`),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleHistory, {
						rules,
						refresh: () => q.refetch()
					}, bank)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, {
				bank,
				branchOptions: branchOptions.slice(1),
				types: typeOptions,
				clientBranches: c.client_branches.filter((b) => b.bank_name === bank)
			}, bank)
		] }), c.profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, {
			profile: p,
			refresh: () => q.refetch()
		}, `${p.report_kind}:${p.revision}`))] })]
	});
}
function ClientBranchForm({ bank, rows, refresh }) {
	const [code, setCode] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [gst, setGst] = (0, import_react.useState)("");
	const [lat, setLat] = (0, import_react.useState)("");
	const [lng, setLng] = (0, import_react.useState)("");
	const a = useAction(refresh);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded-md border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: [
				"Client branches (",
				rows.length,
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs",
				children: [
					r.code,
					" — ",
					r.name
				]
			}, r.code)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					a.run(async () => {
						await rpc("vp_fin02_add_client_branch", {
							p_bank_name: bank,
							p_code: code.toUpperCase().trim(),
							p_name: name,
							p_address: address,
							p_gstin: gst.toUpperCase().trim() || null,
							p_lat: nullableNum(lat),
							p_lng: nullableNum(lng)
						});
						setCode("");
						setName("");
						setAddress("");
						setGst("");
						setLat("");
						setLng("");
					}, "Client branch added.");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Branch code",
								value: code,
								onChange: setCode,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Branch name",
								value: name,
								onChange: setName,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Billing address",
								value: address,
								onChange: setAddress
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "GSTIN (optional; verify separately)",
								value: gst,
								onChange: setGst
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Client branch latitude (optional)",
								value: lat,
								onChange: setLat,
								type: "number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								label: "Client branch longitude (optional)",
								value: lng,
								onChange: setLng,
								type: "number"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: primary,
						disabled: a.busy,
						children: "Add client branch"
					}),
					a.feedback
				]
			})]
		})]
	});
}
var initialRule = {
	rule_key: "",
	agency_branch_id: "",
	client_branch_code: "",
	property_type: "",
	loan_product: "",
	service_type: "",
	priority: "0",
	effective_from: today(),
	effective_until: "",
	base_fee: "",
	tat_days: "",
	distance_mode: "none",
	included_km: "",
	maximum_km: "",
	surcharge_mode: "none",
	surcharge_rate: "0",
	distance_basis: "excess",
	journey_multiplier: "1",
	billable_event: "report_released",
	billing_frequency: "monthly",
	payment_days: "",
	tax_treatment: "Unconfigured",
	tax_rate: "",
	tax_note: "",
	valuation_report_mode: "standard_auto",
	template_id: "",
	reason: ""
};
function RuleForm({ bank, old, branchOptions, clientBranches, typeOptions, templates, refresh }) {
	const [f, setF] = (0, import_react.useState)(() => {
		const next = { ...initialRule };
		if (old) {
			for (const k of Object.keys(next)) {
				const v = old[k];
				next[k] = v === null || v === void 0 ? "" : String(v);
			}
			next.effective_from = today();
			next.reason = "";
		}
		return next;
	});
	const a = useAction(refresh);
	const field = (k) => (v) => setF((o) => ({
		...o,
		[k]: v
	}));
	const text = (k, label, type = "text", required = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
		label,
		value: f[k],
		onChange: field(k),
		type,
		required
	});
	const choice = (k, label, o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
		label,
		value: f[k],
		onChange: field(k),
		options: o
	});
	const clientOptions = [{
		value: "",
		label: "Any client branch"
	}, ...clientBranches.map((b) => ({
		value: b.code,
		label: b.name
	}))];
	function submit(e) {
		e.preventDefault();
		a.run(() => {
			return rpc("vp_fin02_save_rule", {
				p_rule: {
					...f,
					bank_name: bank,
					rule_key: f.rule_key.toUpperCase().trim(),
					agency_branch_id: f.agency_branch_id || null,
					client_branch_code: f.client_branch_code || null,
					loan_product: f.loan_product.toUpperCase().trim() || null,
					service_type: f.service_type.toUpperCase().trim() || null,
					priority: num(f.priority),
					effective_until: f.effective_until || null,
					base_fee: num(f.base_fee),
					tat_days: num(f.tat_days),
					included_km: f.distance_mode === "radial" ? num(f.included_km) : null,
					maximum_km: f.distance_mode === "radial" ? nullableNum(f.maximum_km) : null,
					surcharge_mode: f.distance_mode === "radial" ? f.surcharge_mode : "none",
					surcharge_rate: f.distance_mode === "radial" && f.surcharge_mode !== "none" ? num(f.surcharge_rate) : 0,
					journey_multiplier: num(f.journey_multiplier),
					payment_days: num(f.payment_days),
					tax_rate: f.tax_treatment === "Unconfigured" ? null : f.tax_treatment === "No GST" ? 0 : num(f.tax_rate),
					template_id: f.valuation_report_mode === "client_template" ? f.template_id || null : null
				},
				p_expected_revision: old?.revision ?? 0
			});
		}, "Draft saved. A different tenant administrator must approve it.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: submit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: old ? `New revision of ${old.rule_key}; scope must remain unchanged.` : "Use a unique rule key for each scope and event. Blank product/service means all."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					text("rule_key", "Stable rule key", "text", true),
					choice("agency_branch_id", "Agency branch", branchOptions),
					choice("client_branch_code", "Client branch", clientOptions),
					choice("property_type", "Property category", [{
						value: "",
						label: "Select category"
					}, ...typeOptions]),
					text("loan_product", "Loan product code (optional)"),
					text("service_type", "Service type code (optional)"),
					choice("billable_event", "Billable event", options(events)),
					text("priority", "Priority within same specificity", "number", true),
					text("effective_from", "Effective from", "date", true),
					text("effective_until", "End date (exclusive)", "date"),
					text("base_fee", "Base fee ₹", "number", true),
					text("tat_days", "TAT days", "number", true),
					choice("distance_mode", "Commercial distance", options(["none", "radial"])),
					f.distance_mode === "radial" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						text("included_km", "Included radius (km)", "number", true),
						text("maximum_km", "Maximum service radius (optional)", "number"),
						choice("surcharge_mode", "Outside radius charge", options([
							"none",
							"fixed",
							"per_km"
						])),
						f.surcharge_mode !== "none" && text("surcharge_rate", f.surcharge_mode === "fixed" ? "Fixed surcharge ₹" : "Surcharge ₹/km", "number", true),
						f.surcharge_mode === "per_km" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [choice("distance_basis", "Chargeable distance", options(["excess", "full"])), choice("journey_multiplier", "Journey factor", [{
							value: "1",
							label: "One way"
						}, {
							value: "2",
							label: "Round trip"
						}])] })
					] }),
					choice("billing_frequency", "Billing frequency", options([
						"case",
						"weekly",
						"fortnightly",
						"monthly"
					])),
					text("payment_days", "Payment credit days", "number", true),
					choice("tax_treatment", "GST treatment", options([
						"Unconfigured",
						"CGST+SGST",
						"IGST",
						"No GST"
					])),
					["CGST+SGST", "IGST"].includes(f.tax_treatment) && text("tax_rate", "GST rate %", "number", true),
					text("tax_note", "Tax basis / note"),
					choice("valuation_report_mode", "Valuation report mode", options(["standard_auto", "client_template"])),
					f.valuation_report_mode === "client_template" && choice("template_id", "Existing client Excel template", [{
						value: "",
						label: "Select template"
					}, ...templates.filter((t) => t.category === f.property_type).map((t) => ({
						value: t.id,
						label: t.title
					}))])
				]
			}),
			text("reason", "SLA / agreement reference and change reason", "text", true),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: primary,
				disabled: a.busy,
				children: "Save SLA draft"
			}),
			a.feedback
		]
	});
}
function RuleHistory({ rules, refresh }) {
	const [reason, setReason] = (0, import_react.useState)("");
	const a = useAction(refresh);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 border-t pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-xs font-semibold",
				children: "Revision history"
			}),
			rules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "No custom SLA rules. Standard preview uses the existing tariff where eligible."
			}),
			rules.some((r) => r.status === "Draft") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				label: "Independent review reason",
				value: reason,
				onChange: setReason
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-64 space-y-2 overflow-auto",
				children: rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 rounded border p-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [
							r.rule_key,
							" v",
							r.revision,
							" · ",
							r.property_type,
							" · ",
							labelOf(r.billable_event),
							" · ₹",
							r.base_fee,
							" · ",
							r.effective_from,
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.status })
						]
					}), r.status === "Draft" && ["Approved", "Rejected"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn,
						disabled: a.busy || reason.trim().length < 5,
						type: "button",
						onClick: () => void a.run(() => rpc("vp_fin02_decide_rule", {
							p_rule_key: r.rule_key,
							p_revision: r.revision,
							p_decision: d,
							p_reason: reason
						}), `Rule ${d.toLowerCase()}.`),
						children: d === "Approved" ? "Approve" : "Reject"
					}, d))]
				}, `${r.rule_key}:${r.revision}`))
			}),
			a.feedback
		]
	});
}
function Preview({ bank, branchOptions, types, clientBranches }) {
	const [branch, setBranch] = (0, import_react.useState)("");
	const [client, setClient] = (0, import_react.useState)("");
	const [property, setProperty] = (0, import_react.useState)("");
	const [product, setProduct] = (0, import_react.useState)("");
	const [service, setService] = (0, import_react.useState)("");
	const [event, setEvent] = (0, import_react.useState)("report_released");
	const [lat, setLat] = (0, import_react.useState)("");
	const [lng, setLng] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const a = useAction(async () => void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Calculate base SLA estimate (FIN-02A only)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				setResult(null);
				a.run(async () => {
					const args = {
						p_bank_name: bank,
						p_branch_id: branch,
						p_client_branch_code: client || null,
						p_property_type: property,
						p_loan_product: product.toUpperCase().trim() || null,
						p_service_type: service.toUpperCase().trim() || null,
						p_event: event,
						p_site_lat: nullableNum(lat),
						p_site_lng: nullableNum(lng)
					};
					const data = await rpc("vp_fin02_preview", args);
					if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid preview response");
					setResult({
						...data,
						preview_inputs: args
					});
				}, "Preview only — no invoice created.");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Agency branch",
							value: branch,
							onChange: setBranch,
							options: [{
								value: "",
								label: "Select branch"
							}, ...branchOptions]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Client branch",
							value: client,
							onChange: setClient,
							options: [{
								value: "",
								label: "Not specified"
							}, ...clientBranches.map((b) => ({
								value: b.code,
								label: b.name
							}))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Property category",
							value: property,
							onChange: setProperty,
							options: [{
								value: "",
								label: "Select category"
							}, ...types]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Loan product code",
							value: product,
							onChange: setProduct
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Service type code",
							value: service,
							onChange: setService
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Event",
							value: event,
							onChange: setEvent,
							options: options(events)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Sample property latitude",
							value: lat,
							onChange: setLat,
							type: "number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Sample property longitude",
							value: lng,
							onChange: setLng,
							type: "number"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: primary,
					disabled: a.busy || !branch || !property,
					children: "Calculate estimate"
				}),
				a.feedback,
				result !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewResult, { result })
			]
		})]
	});
}
function ProfileForm({ profile, refresh }) {
	const [mode, setMode] = (0, import_react.useState)(profile.mode);
	const [title, setTitle] = (0, import_react.useState)(profile.title);
	const [cols, setCols] = (0, import_react.useState)(profile.columns.join(", "));
	const [reason, setReason] = (0, import_react.useState)("");
	const a = useAction(refresh);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: [
				labelOf(profile.report_kind),
				" report · ",
				labelOf(profile.mode),
				" (v",
				profile.revision,
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				a.run(() => rpc("vp_fin02_save_report_profile", {
					p_kind: profile.report_kind,
					p_expected_revision: profile.revision,
					p_mode: mode,
					p_title: title,
					p_columns: cols.split(",").map((s) => s.trim()).filter(Boolean),
					p_reason: reason
				}), "Report profile version saved. Renderer integration is pending.");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Standard auto is the default. Custom report titles and column order are tenant-specific; mandatory reconciliation fields cannot be removed. This configures the future finance report renderer, not issued invoices."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					label: "Layout mode",
					value: mode,
					onChange: setMode,
					options: options(["standard_auto", "custom"])
				}),
				mode === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Report title",
						value: title,
						onChange: setTitle,
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Column order (comma-separated)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: inputClass,
							rows: 4,
							value: cols,
							onChange: (e) => setCols(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "break-words text-xs text-muted-foreground",
						children: ["Available: ", profile.available_columns.join(", ")]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					label: "Change reason",
					value: reason,
					onChange: setReason,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: primary,
					disabled: a.busy,
					children: "Save report profile"
				}),
				a.feedback
			]
		})]
	});
}
function PreviewResult({ result }) {
	if (!result || typeof result !== "object" || Array.isArray(result)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "alert",
		className: "text-xs text-destructive",
		children: "Invalid estimate response."
	});
	const r = result;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded-md border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold",
				children: "Base SLA estimate only — advanced FIN-02B terms not included"
			}),
			r["status"] === "estimate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-3",
				children: [
					["Base fee", r["base_fee"]],
					["Travel surcharge", r["travel_fee"]],
					["Pre-tax total", r["pretax_total"]]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded bg-muted p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: String(label)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: typeof value === "number" ? "₹" + value.toLocaleString("en-IN", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}) : "Unavailable"
					})]
				}, String(label)))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "status",
				className: "text-sm font-medium",
				children: ["Review required: ", labelOf(String(r["reason"] ?? "unknown"))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "cursor-pointer text-xs",
				children: "Calculation provenance and rule details"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-72 overflow-auto whitespace-pre-wrap break-words rounded bg-muted p-3 text-xs",
				children: JSON.stringify(result, null, 2)
			})] })
		]
	});
}
//#endregion
export { VpFin02BranchGeo as n, VpFin02BankConfig as t };
