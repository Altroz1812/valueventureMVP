import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Plus, J as Landmark, Nt as CalendarClock, O as Percent, q as Layers } from "../_libs/lucide-react.mjs";
import { c as Dialog, d as DialogFooter, f as DialogHeader, i as CardContent, l as DialogContent, n as Button, o as CardHeader, p as DialogTitle, r as Card, s as CardTitle, t as AppShell, u as DialogDescription, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { a as useVpBanks, c as useVpPropertyTypes, n as PROPERTY_TYPES } from "./vp-cases-DcoVfkM7.mjs";
import { t as VpFin02BankConfig } from "./vp-fin02-config-DW5RnkQ6.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-KC4eSjOh.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { u as useVpReportPermissions } from "./vp-reports-CNYb7FPD.mjs";
import { c as publishP20, d as useP20Templates, i as inspectP20Workbook, n as P20_FIELDS, o as parseP20Mapping, r as bytesToBase64, t as EXAMPLE_MAPPING } from "./vp-p20-workbook-tcEI4tq5.mjs";
import { s as propertyError } from "./vp-property-data-NyFxtdD0.mjs";
import { t as Textarea } from "./textarea-BAeo4PcW.mjs";
import { c as publishP18Template, i as defaultTemplate, l as useP18Template, o as isP18Category, s as parseFields, t as P18_CATEGORIES } from "./vp-p18-api-Dp6x_NGS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.bank-masters-DQpqBIGP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cls = "w-full min-w-0 rounded-md border border-border bg-background px-2.5 py-2 text-sm";
var button = "rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50";
var neutral = "rounded-md border border-border bg-background px-3 py-2 text-xs font-medium disabled:opacity-50";
var events = [
	"report_released",
	"report_delivered",
	"visit_completed",
	"revisit_completed",
	"cancelled_before_visit",
	"cancelled_after_visit",
	"no_access"
];
var msg = (e) => e instanceof Error ? e.message : typeof e === "object" && e !== null && "message" in e ? String(e.message) : String(e);
function row(x) {
	if (!x || typeof x !== "object" || Array.isArray(x)) throw new Error("Invalid finance response");
	return x;
}
function list(x) {
	if (!Array.isArray(x)) throw new Error("Invalid finance list");
	return x;
}
async function rpc(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw new Error(error.message);
	return data;
}
function field(f, k) {
	return String(f.get(k) ?? "").trim();
}
function optional(f, k) {
	return field(f, k) || null;
}
function number(f, k, allowEmpty = false) {
	const s = field(f, k);
	if (!s) {
		if (allowEmpty) return null;
		throw new Error("Missing " + k);
	}
	const v = Number(s);
	if (!Number.isFinite(v) || v < 0) throw new Error("Invalid " + k);
	return v;
}
function whole(f, k, allowEmpty = false) {
	const v = number(f, k, allowEmpty);
	if (v !== null && !Number.isSafeInteger(v)) throw new Error("Expected whole number: " + k);
	return v;
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block min-w-0 space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium",
			children: label
		}), children]
	});
}
function Text({ name, label, type = "text", required = false, defaultValue = "", step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			className: cls,
			type,
			required,
			defaultValue,
			step,
			min: type === "number" ? "0" : void 0
		})
	});
}
function Choice({ name, label, options, defaultValue = "", required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			className: cls,
			name,
			defaultValue,
			required,
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o.value,
				children: o.label
			}, o.value))
		})
	});
}
var opts = (values) => values.map((v) => ({
	value: v,
	label: v.replaceAll("_", " ")
}));
function reason() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
		name: "reason",
		label: "Agreement / evidence reference and reason",
		required: true
	});
}
function useAction(refresh) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	async function run(fn, success) {
		setBusy(true);
		setError("");
		setNotice("");
		try {
			await fn();
			setNotice(success);
			try {
				await refresh();
			} catch (e) {
				setError("Saved, but refresh failed: " + msg(e));
			}
		} catch (e) {
			setError(msg(e));
		} finally {
			setBusy(false);
		}
	}
	return {
		busy,
		run,
		feedback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "break-words text-xs text-destructive",
			children: error
		}), notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			className: "text-xs text-muted-foreground",
			children: notice
		})] })
	};
}
function formData(e) {
	e.preventDefault();
	return new FormData(e.currentTarget);
}
function Json({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-xs font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "max-h-64 overflow-auto whitespace-pre-wrap break-words bg-muted p-2 text-xs",
			children: JSON.stringify(value, null, 2)
		})]
	});
}
function CodeForm({ refresh }) {
	const a = useAction(refresh);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Product and service master"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: (e) => {
				const f = formData(e);
				a.run(() => rpc("vp_fin02b_add_code", {
					p_kind: field(f, "kind"),
					p_code: field(f, "code").toUpperCase(),
					p_name: field(f, "name"),
					p_reason: field(f, "reason")
				}), "Tenant code registered.");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Type",
							name: "kind",
							defaultValue: "loan_product",
							options: opts(["loan_product", "service_type"])
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Stable code",
							name: "code",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Display name",
							name: "name",
							required: true
						})
					]
				}),
				reason(),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: button,
					disabled: a.busy,
					children: "Add code"
				}),
				a.feedback
			]
		})]
	});
}
function TermsForm({ rule, refresh }) {
	const a = useAction(refresh);
	const [road, setRoad] = (0, import_react.useState)(false);
	const [slabs, setSlabs] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			const f = formData(e);
			a.run(async () => {
				const payload = slabs.map((s, i) => {
					const last = i === slabs.length - 1;
					if (!s.fee.trim() || !last && !s.upper.trim()) throw new Error("Complete every slab fee and non-final upper value");
					const fee = Number(s.fee), upper = last ? null : Number(s.upper);
					if (!Number.isFinite(fee) || fee < 0 || upper !== null && (!Number.isFinite(upper) || upper <= 0)) throw new Error("Invalid slab input");
					return {
						upper_exclusive: upper,
						fee
					};
				});
				return rpc("vp_fin02b_save_terms", {
					p_rule_key: rule.rule_key,
					p_revision: rule.revision,
					p_slabs: payload,
					p_charge_distance: road ? "road" : "radial",
					p_road_included_km: road ? number(f, "roadIncluded") : null,
					p_grace_days: whole(f, "grace"),
					p_penalty_per_day: number(f, "daily"),
					p_penalty_cap: number(f, "cap"),
					p_tds_rate: number(f, "tds", true),
					p_reason: field(f, "reason")
				});
			}, "Advanced terms attached. Independent approval is required.");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Attach once before approving this base SLA revision. Empty slabs retain the base fee. Each upper limit is exclusive; the last slab has no upper limit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [slabs.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: i === slabs.length - 1 ? "Last slab: unlimited" : "Upper value ₹ (exclusive)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: cls,
							type: "number",
							min: "0",
							step: "0.01",
							disabled: i === slabs.length - 1,
							value: i === slabs.length - 1 ? "" : s.upper,
							onChange: (e) => setSlabs((old) => old.map((x, k) => k === i ? {
								...x,
								upper: e.target.value
							} : x))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fixed fee ₹",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: cls,
							type: "number",
							min: "0",
							step: "0.01",
							required: true,
							value: s.fee,
							onChange: (e) => setSlabs((old) => old.map((x, k) => k === i ? {
								...x,
								fee: e.target.value
							} : x))
						})
					})]
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: neutral,
						type: "button",
						disabled: slabs.length >= 30,
						onClick: () => setSlabs((old) => [...old, {
							upper: "",
							fee: ""
						}]),
						children: "Add slab"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: neutral,
						type: "button",
						disabled: !slabs.length,
						onClick: () => setSlabs((old) => old.slice(0, -1)),
						children: "Remove last"
					})]
				})]
			}),
			rule.distance_mode === "radial" && rule.surcharge_mode === "per_km" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: road,
					onChange: () => setRoad((v) => !v)
				}), "Use approved road distance for outside-radius per-km surcharge"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					road && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Included road km (separate from radial zone)",
						name: "roadIncluded",
						type: "number",
						step: "0.001",
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "TAT grace days",
						name: "grace",
						type: "number",
						required: true,
						defaultValue: "0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Penalty per late day ₹",
						name: "daily",
						type: "number",
						step: "0.01",
						required: true,
						defaultValue: "0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Maximum penalty ₹",
						name: "cap",
						type: "number",
						step: "0.01",
						required: true,
						defaultValue: "0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Indicative TDS rate % (optional)",
						name: "tds",
						type: "number",
						step: "0.01"
					})
				]
			}),
			reason(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: button,
				disabled: a.busy,
				children: "Attach advanced terms"
			}),
			a.feedback
		]
	});
}
function ReviewTerms({ rule, terms, refresh }) {
	const a = useAction(refresh);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Json, {
				value: rule,
				label: "Review exact base SLA revision"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Json, {
				value: terms,
				label: "Review exact saved advanced terms"
			}),
			rule.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-2",
				onSubmit: (e) => {
					const f = formData(e);
					a.run(() => rpc("vp_fin02b_approve_rule", {
						p_rule_key: rule.rule_key,
						p_revision: rule.revision,
						p_reason: field(f, "reason")
					}), "SLA and advanced terms approved.");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "ack",
							required: true
						}), "I reviewed the base SLA in FIN-02A and the advanced terms above."]
					}),
					reason(),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: button,
						disabled: a.busy,
						children: "Approve complete SLA (different admin)"
					}),
					a.feedback
				]
			})
		]
	});
}
function RulePanel({ rules, terms, refresh }) {
	const [selected, setSelected] = (0, import_react.useState)("");
	const key = (r) => r.rule_key + ":" + r.revision;
	const rule = rules.find((r) => key(r) === selected);
	const t = terms.find((x) => x.rule_key === rule?.rule_key && x.revision === rule.revision);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Advanced pricing and SLA approval"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Create the base SLA draft above first. Extended drafts must be approved here, not with the earlier approval button. To change terms, create a new base SLA revision."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "SLA revision",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: cls,
						value: selected,
						onChange: (e) => setSelected(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select rule revision"
						}), rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: key(r),
							children: [
								r.bank_name,
								" · ",
								r.rule_key,
								" v",
								r.revision,
								" · ",
								r.property_type,
								" · ",
								r.status
							]
						}, key(r)))]
					})
				}),
				rule && (t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewTerms, {
					rule,
					terms: t,
					refresh
				}, selected) : rule.status === "Draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TermsForm, {
					rule,
					refresh
				}, selected) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Base terms only; approved revisions cannot be altered."
				}))
			]
		})]
	});
}
function ContextForm({ c, codes, branches, refresh }) {
	const a = useAction(refresh);
	const blank = {
		value: "",
		label: "Not specified (general SLA only)"
	};
	const byKind = (kind) => [blank, ...codes.filter((x) => x.kind === kind).map((x) => ({
		value: x.code,
		label: x.name
	}))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			const f = formData(e);
			a.run(() => rpc("vp_fin02b_save_case_context", {
				p_num: c.case_num,
				p_expected_revision: c.context_revision,
				p_client_branch: optional(f, "client"),
				p_loan_product: optional(f, "product"),
				p_service_type: optional(f, "service"),
				p_reason: field(f, "reason")
			}), "Case commercial context saved.");
		},
		children: [
			c.context_stale && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-xs text-destructive",
				children: "Case branch, financier or property category changed. Reconfirm commercial context."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Client branch",
						name: "client",
						defaultValue: c.client_branch_code ?? "",
						options: [blank, ...branches.filter((b) => b.bank_name === c.bank_name).map((b) => ({
							value: b.code,
							label: b.name
						}))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Loan product",
						name: "product",
						defaultValue: c.loan_product ?? "",
						options: byKind("loan_product")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						label: "Service type",
						name: "service",
						defaultValue: c.service_type ?? "",
						options: byKind("service_type")
					})
				]
			}),
			reason(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: button,
				disabled: a.busy || !c.branch_active,
				children: "Save case linkage"
			}),
			a.feedback
		]
	});
}
function RoadForm({ c, refresh }) {
	const a = useAction(refresh);
	const [visit, setVisit] = (0, import_react.useState)("");
	const history = c.road_evidence.filter((r) => r.visit_id === visit);
	const revision = Math.max(0, ...history.map((r) => r.revision));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-xs font-semibold",
			children: "Road distance evidence"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "One-way route from the recorded agency branch to the completed visit. Attach a route reference; no live routing API is used. A different administrator must review the route and source."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Completed visit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: cls,
						value: visit,
						onChange: (e) => setVisit(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select visit"
						}), c.visits.filter((v) => v.status === "Completed" && v.gps_available).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: v.id,
							children: [
								"Visit ",
								v.id,
								" · GPS accuracy ",
								v.accuracy_m ?? "unknown",
								" m"
							]
						}, v.id))]
					})
				}),
				visit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						const f = formData(e);
						a.run(() => rpc("vp_fin02b_submit_road", {
							p_num: c.case_num,
							p_visit_id: visit,
							p_expected_revision: revision,
							p_one_way_km: number(f, "km"),
							p_source: field(f, "source"),
							p_reference: field(f, "reference")
						}), "Route evidence submitted for review.");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								name: "km",
								label: "One-way road distance km",
								type: "number",
								step: "0.001",
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
								label: "Evidence source",
								name: "source",
								defaultValue: "map_route",
								options: opts([
									"map_route",
									"surveyed_route",
									"client_approved_route"
								])
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							name: "reference",
							label: "Route reference / evidence location",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: button,
							disabled: a.busy || c.context_stale,
							children: "Submit road evidence"
						})
					]
				}, visit + ":" + revision),
				history.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded border p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"v",
							r.revision,
							" · ",
							r.one_way_km,
							" km · ",
							r.status,
							" · geo v",
							r.geo_revision,
							" · context v",
							r.context_revision
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "break-words",
							children: [
								r.source,
								": ",
								r.reference
							]
						}),
						r.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "space-y-2",
							onSubmit: (e) => {
								const f = formData(e);
								a.run(() => rpc("vp_fin02b_decide_road", {
									p_visit_id: r.visit_id,
									p_revision: r.revision,
									p_decision: field(f, "decision"),
									p_reason: field(f, "reason")
								}), "Route review recorded.");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
									label: "Review decision",
									name: "decision",
									defaultValue: "Approved",
									options: opts(["Approved", "Rejected"])
								}),
								reason(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: neutral,
									disabled: a.busy,
									children: "Record independent decision"
								})
							]
						})
					]
				}, r.revision)),
				a.feedback
			]
		})]
	});
}
function PreviewForm({ c, orgId }) {
	const a = useAction(async () => void 0);
	const [result, setResult] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-xs font-semibold",
			children: "Calculate complete case billing scenario"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: (e) => {
				const f = formData(e);
				setResult(null);
				a.run(async () => {
					const data = row(await rpc("vp_fin02b_preview_case", {
						p_num: c.case_num,
						p_visit_id: optional(f, "visit"),
						p_event: field(f, "event"),
						p_estimated_value: number(f, "value", true),
						p_late_days: whole(f, "late", true)
					}));
					if (data["preview_only"] !== true) throw new Error("Not a valid preview response");
					if (data["org_id"] !== void 0 && data["org_id"] !== orgId) throw new Error("Workspace mismatch");
					setResult(data);
				}, "Scenario calculated; no financial posting.");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Leave property value blank to use a single matching released report market value when available. A typed value and late days are scenario inputs, not certified valuation or TAT evidence. The selected event is a scenario, not proof that it occurred."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Requested event",
							name: "event",
							defaultValue: "report_released",
							options: opts(events)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							label: "Completed visit (for distance)",
							name: "visit",
							options: [{
								value: "",
								label: "None"
							}, ...c.visits.filter((v) => v.status === "Completed").map((v) => ({
								value: v.id,
								label: `Visit ${v.id}`
							}))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							name: "value",
							label: "Scenario property value ₹ (blank = released value)",
							type: "number",
							step: "0.01"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							name: "late",
							label: "Estimated late days (if penalty applies)",
							type: "number"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: button,
					disabled: a.busy || c.context_stale,
					children: "Calculate complete estimate"
				}),
				a.feedback,
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold",
							children: result["status"] === "estimate" ? "Scenario estimate" : `Review required: ${String(result["reason"] ?? "unknown")}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-3",
							children: [
								["Base fee", "base_fee"],
								["Travel charge", "travel_fee"],
								["Penalty", "penalty"],
								["Pre-tax total", "pretax_total"],
								["GST", "gst"],
								["Invoice total estimate", "invoice_total_estimate"],
								["Indicative TDS (separate)", "indicative_tds"]
							].map(([label, k]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded bg-muted p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-sm",
									children: typeof result[k] === "number" ? "₹" + Number(result[k]).toLocaleString("en-IN", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									}) : "—"
								})]
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Json, {
							label: "Calculation details and provenance",
							value: result
						})
					]
				})
			]
		})]
	});
}
function CasePanel({ orgId, codes, branches }) {
	const [caseNum, setCaseNum] = (0, import_react.useState)(null);
	const [input, setInput] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: [
			"vp-fin02b-case",
			orgId,
			caseNum
		],
		enabled: caseNum !== null,
		retry: false,
		queryFn: async () => {
			const j = row(await rpc("vp_fin02b_case_info", { p_num: caseNum }));
			if (j["org_id"] !== orgId || j["case_num"] !== caseNum) throw new Error("Case context mismatch");
			list(j["visits"]);
			list(j["road_evidence"]);
			return j;
		}
	});
	const c = query.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer text-sm font-semibold",
			children: "Case commercial linkage & calculation"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap items-end gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					const n = Number(input);
					if (Number.isSafeInteger(n) && n > 0) if (n === caseNum) query.refetch();
					else setCaseNum(n);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Internal case number (numeric num)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: cls,
						type: "number",
						min: "1",
						step: "1",
						required: true,
						value: input,
						onChange: (e) => setInput(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: neutral,
					children: "Load case"
				})]
			}), query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-xs text-destructive",
				children: msg(query.error)
			}) : c ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium",
						children: [
							c.case_no,
							" · ",
							c.bank_name,
							" · ",
							c.property_type,
							" · ",
							c.branch_name,
							" · context v",
							c.context_revision
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextForm, {
						c,
						codes,
						branches,
						refresh: query.refetch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoadForm, {
						c,
						refresh: query.refetch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewForm, {
						c,
						orgId
					})
				]
			}, c.case_num + ":" + c.context_revision) : caseNum !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Loading case…"
			}) : null]
		})]
	});
}
function Config({ orgId }) {
	const query = useQuery({
		queryKey: ["vp-fin02b-catalog", orgId],
		enabled: true,
		retry: false,
		queryFn: async () => {
			const [a, b] = await Promise.all([rpc("vp_fin02_catalog"), rpc("vp_fin02b_catalog")]);
			const x = row(a), y = row(b);
			if (x["org_id"] !== orgId || y["org_id"] !== orgId) throw new Error("Tenant context mismatch");
			return {
				codes: list(y["codes"]),
				terms: list(y["terms"]),
				rules: list(x["rules"]),
				branches: list(x["client_branches"])
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-4 space-y-3 rounded-lg border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Commercial configuration · FIN-02B"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: neutral,
					onClick: () => void query.refetch(),
					children: "Refresh"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Standard defaults apply automatically. Add tenant-specific codes and advanced terms to approved business agreements. Earlier FIN-02A estimates show base terms only; use this case calculation for advanced pricing."
			}),
			query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-xs text-destructive",
				children: msg(query.error)
			}) : query.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeForm, { refresh: query.refetch }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "rounded border p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-xs font-medium",
						children: "Available product and service codes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-1 sm:grid-cols-2",
						children: query.data.codes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs",
							children: [
								c.name,
								" — ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: c.code })
							]
						}, c.kind + ":" + c.code))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulePanel, {
					rules: query.data.rules,
					terms: query.data.terms,
					refresh: query.refetch
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CasePanel, {
					orgId,
					codes: query.data.codes,
					branches: query.data.branches
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Loading configuration…"
			})
		]
	});
}
function VpFin02BConfig() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("tenant.admin")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Config, { orgId: tenant.id }, tenant.id);
}
function VpP20TemplateAdmin({ banks }) {
	const { tenant } = useApp();
	const manage = useVpReportPermissions().data?.manage === true;
	const qc = useQueryClient();
	const templates = useP20Templates(manage);
	const [bank, setBank] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Land");
	const [title, setTitle] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [mapping, setMapping] = (0, import_react.useState)(JSON.stringify(EXAMPLE_MAPPING, null, 2));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	async function run(publish) {
		if (busy || !file) return;
		setBusy(true);
		setMsg("");
		try {
			if (!file.name.toLowerCase().endsWith(".xlsx") || file.size > 1048576) throw new Error("Select a blank .xlsx workbook, maximum 1 MiB");
			const rows = parseP20Mapping(JSON.parse(mapping));
			const bytes = new Uint8Array(await file.arrayBuffer());
			const sheets = await inspectP20Workbook(bytes, rows);
			if (!publish) {
				setMsg(`Mapping validated. Sheets: ${sheets.join(", ")}. Verify merged cells and print layout manually.`);
				return;
			}
			if (!bank || !title.trim() || !reason.trim()) throw new Error("Bank, title and publication reason required");
			if (!window.confirm("Publish this blank workbook and mapping as a new immutable revision? Do not upload customer data.")) return;
			const id = await publishP20(bank, category, title, bytesToBase64(bytes), rows, reason);
			await qc.invalidateQueries({ queryKey: ["vp-p20-templates", tenant.id] });
			setMsg(`Template ${id} published. Test export before use.`);
		} catch (e) {
			setMsg(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	if (!manage) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Bank Excel report templates (P20)"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Upload an authorized, blank lender workbook. Map server-calculated fields to input cells. Each publication is immutable. Exports are reviewed workpapers, not released certificates." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					disabled: busy,
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Bank", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "rounded border bg-background p-2",
								value: bank,
								onChange: (e) => setBank(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select bank"
								}), banks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: b.name }, b.name))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "rounded border bg-background p-2",
								value: category,
								onChange: (e) => setCategory(e.target.value),
								children: PROPERTY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Template name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								maxLength: 160,
								value: title,
								onChange: (e) => setTitle(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Blank XLSX (max 1 MiB)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: ".xlsx",
								onChange: (e) => setFile(e.target.files?.[0] ?? null)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1 sm:col-span-2",
							children: ["Publication reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								maxLength: 1e3,
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1 sm:col-span-2",
							children: ["Field → sheet → cell mapping (JSON)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "min-h-48 rounded border bg-background p-2 font-mono text-xs",
								value: mapping,
								onChange: (e) => setMapping(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Available fields" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "break-words text-xs",
					children: P20_FIELDS.join(", ")
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: !file || busy,
						onClick: () => void run(false),
						children: "Validate workbook & mapping"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !file || busy || !bank,
						onClick: () => void run(true),
						children: "Publish revision"
					})]
				}),
				msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "break-words",
					children: msg
				}),
				templates.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					children: propertyError(templates.error)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: templates.data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "border-t pt-1",
						children: [
							"#",
							t.id,
							" · ",
							t.bank_name,
							" · ",
							t.category,
							" · ",
							t.title,
							" · ",
							t.mapping.length,
							" mappings"
						]
					}, t.id))
				})
			]
		})]
	});
}
function ConfigEditor({ category }) {
	const { tenant } = useApp();
	const client = useQueryClient();
	const query = useP18Template(category);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const shown = draft ?? JSON.stringify(query.data?.fields ?? defaultTemplate(category).fields, null, 2);
	async function publish() {
		if (busy || !query.data) return;
		try {
			const fields = parseFields(JSON.parse(shown));
			if (!reason.trim() || reason.length > 1e3) throw new Error("Enter a publication reason (1–1000 characters)");
			if (!window.confirm("Publish a new immutable template revision for new supplements? Existing snapshots are not changed.")) return;
			setBusy(true);
			await publishP18Template(category, fields, reason);
			await client.invalidateQueries({ queryKey: [
				"vp-p18-template",
				tenant.id,
				category
			] });
			setDraft(null);
			setReason("");
			toast.success("Template revision published");
		} catch (e) {
			toast.error(e && typeof e === "object" && "message" in e ? String(e.message) : String(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Active revision: ",
					query.data?.revision ?? "Loading",
					" · 1–30 fields. Each entry uses key, label, type (text, number or choice), optional unit and options for choice. All are supplemental and optional; they do not change existing QC rules."
				]
			}),
			query.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive text-sm",
				children: ["Template load failed: ", query.error.message]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 12,
				className: "font-mono text-xs",
				"aria-label": "Template field definitions JSON",
				value: shown,
				disabled: busy || !query.data,
				onChange: (e) => setDraft(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				"aria-label": "Publication reason",
				placeholder: "Publication reason",
				value: reason,
				maxLength: 1e3,
				disabled: busy,
				onChange: (e) => setReason(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						disabled: busy || !query.data || draft === null || !reason.trim(),
						onClick: () => void publish(),
						children: busy ? "Publishing…" : "Publish new revision"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy || !query.data,
						onClick: () => setDraft(JSON.stringify(defaultTemplate(category).fields, null, 2)),
						children: "Load default fields"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy || draft === null,
						onClick: () => {
							setDraft(null);
							setReason("");
						},
						children: "Discard edits"
					})
				]
			})
		]
	});
}
function VpP18TemplateAdmin() {
	const { tenant } = useApp();
	const [category, setCategory] = (0, import_react.useState)("Land");
	if (!tenant.adminAccess) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Property capture templates (P18)"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-medium",
					htmlFor: "p18-category",
					children: "Case category"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "p18-category",
					className: "rounded border bg-background p-2 text-sm",
					value: category,
					onChange: (e) => {
						if (isP18Category(e.target.value)) setCategory(e.target.value);
					},
					children: P18_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigEditor, { category }, category)
			]
		})]
	});
}
function BankMastersPage() {
	const { tenant } = useApp();
	const qc = useQueryClient();
	const { data: banks = [], isLoading, error } = useVpBanks();
	const { data: propertyTypes = [], isLoading: propertyTypesLoading, error: propertyTypesError } = useVpPropertyTypes();
	const activeTypes = propertyTypes.filter((t) => t.is_active);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [rateCard, setRateCard] = (0, import_react.useState)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [bankName, setBankName] = (0, import_react.useState)("");
	const [alias, setAlias] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("bank");
	const [rate, setRate] = (0, import_react.useState)("0");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [ptype, setPtype] = (0, import_react.useState)("Flat");
	const [typeSaving, setTypeSaving] = (0, import_react.useState)(null);
	const [fee, setFee] = (0, import_react.useState)("");
	const [tat, setTat] = (0, import_react.useState)("3");
	const list = banks.filter((b) => tab === "all" || b.kind === tab);
	const flatFees = banks.flatMap((b) => b.tariffs.filter((x) => x.property_type === "Flat").map((x) => x.fee));
	const avgFlat = flatFees.length ? fmtINR(Math.round(flatFees.reduce((a, b) => a + b, 0) / flatFees.length)) : "—";
	async function setPropertyTypeActive(code, isActive) {
		setTypeSaving(code);
		try {
			const { error } = await vpDb.rpc("vp_admin_set_property_type", {
				p_code: code,
				p_active: isActive
			});
			if (error) throw error;
			await qc.invalidateQueries({ queryKey: ["vp-property-types", tenant.id] });
			toast.success(`${code} ${isActive ? "enabled" : "disabled"} for new cases`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Unable to update property type");
		} finally {
			setTypeSaving(null);
		}
	}
	async function saveBank() {
		if (!bankName.trim()) {
			toast.error("Bank name is required");
			return;
		}
		setSaving(true);
		try {
			const { error } = await vpDb.rpc("vp_admin_save_bank", {
				p_name: bankName.trim(),
				p_alias: alias.trim(),
				p_kind: kind,
				p_rate: Number(rate)
			});
			if (error) throw error;
			await qc.invalidateQueries({ queryKey: ["vp-live-banks", tenant.id] });
			toast.success("Bank saved to Supabase");
			setAddOpen(false);
			setBankName("");
			setAlias("");
			setRate("0");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Unable to save bank");
		} finally {
			setSaving(false);
		}
	}
	async function saveTariff() {
		if (!rateCard || !activeTypes.some((t) => t.code === ptype)) {
			toast.error("Select an active property type");
			return;
		}
		setSaving(true);
		try {
			const { error } = await vpDb.rpc("vp_admin_save_tariff", {
				p_bank_name: rateCard.name,
				p_property_type: ptype,
				p_fee: Number(fee),
				p_tat_days: Number(tat)
			});
			if (error) throw error;
			await qc.invalidateQueries({ queryKey: ["vp-live-banks", tenant.id] });
			toast.success("Rate card updated");
			setRateCard(null);
			setFee("");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Unable to save tariff");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Bank Masters & Rate Cards",
			description: "Bank and NBFC client masters and agreed property-category tariffs.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => setAddOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Bank"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin02BankConfig, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin02BConfig, {}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 rounded border border-destructive p-2 text-destructive",
			children: error.message
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-4",
			children: [
				{
					l: "Client Banks",
					v: banks.length,
					i: Landmark
				},
				{
					l: "Agency Branches Linked",
					v: "—",
					i: Layers
				},
				{
					l: "Empanelments Expiring <90d",
					v: "—",
					i: CalendarClock
				},
				{
					l: "Avg. Flat Fee (configured)",
					v: avgFlat,
					i: Percent
				}
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-lg bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.i, { className: "size-4 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-bold leading-none",
						children: k.v
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: k.l
					})] })]
				})
			}, k.l))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-5 border-border shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Property Type Master"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "These are the four categories permitted by your existing cases.prod constraint. Enabling or disabling a category does not modify historical cases."
						})]
					}),
					propertyTypesError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "mb-2 text-sm text-destructive",
						children: propertyTypesError.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Type" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Code" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Manage"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [propertyTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: t.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: t.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: t.is_active ? "Active" : "Inactive"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !!typeSaving,
								onClick: () => setPropertyTypeActive(t.code, !t.is_active),
								children: typeSaving === t.code ? "Saving…" : t.is_active ? "Deactivate" : "Activate"
							})
						})
					] }, t.code)), !propertyTypesLoading && propertyTypes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 4,
						className: "text-muted-foreground",
						children: "No property types found. Apply the Property Type Master SQL migration."
					}) })] })] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			value: tab,
			onValueChange: setTab,
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "all",
					children: "All Clients"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "bank",
					children: "Banks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "private",
					children: "Private Banks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "nbfc",
					children: "NBFCs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "other",
					children: "Other"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Client" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden md:table-cell",
						children: "Type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Empanelled Branches" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden lg:table-cell",
						children: "Validity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden xl:table-cell",
						children: "Default Format"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Rate Card"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [list.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: b.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: b.alias || "—"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "hidden md:table-cell",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: b.kind
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-xs text-muted-foreground",
					children: "Not configured"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "hidden text-xs text-muted-foreground lg:table-cell",
					children: "Not configured"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "hidden text-xs text-muted-foreground xl:table-cell",
					children: "Not configured"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-7 text-[11px]",
						onClick: () => {
							setRateCard(b);
							setFee("");
							setTat("3");
							setPtype(activeTypes[0]?.code ?? "Flat");
						},
						children: [b.tariffs.length, " tariffs · View"]
					})
				})
			] }, b.name)), !isLoading && list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-8 text-center text-muted-foreground",
				children: "No client banks. Add a bank to configure case intake."
			}) })] })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: addOpen,
			onOpenChange: setAddOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add bank / NBFC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Client details are stored in the existing banks table." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client bank name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: bankName,
							onChange: (e) => setBankName(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Alias / code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: alias,
							onChange: (e) => setAlias(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 w-full rounded-md border bg-background px-2",
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "bank",
									children: "Bank"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "private",
									children: "Private Bank"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "nbfc",
									children: "NBFC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "other",
									children: "Other"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Existing bank rate (not used for case tariff)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: rate,
							onChange: (e) => setRate(e.target.value)
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setAddOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: saving || rate.trim() === "",
					onClick: saveBank,
					children: saving ? "Saving…" : "Save bank"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!rateCard,
			onOpenChange: (o) => !o && setRateCard(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: rateCard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "font-display",
					children: [rateCard.name, " — Tariff Rate Card"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Set an explicit tariff for each property type. The existing banks.rate is not treated as an INR fee." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Property Type" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Fee"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "TAT"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rateCard.tariffs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.property_type }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: fmtINR(r.fee)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right",
						children: [r.tat_days, " days"]
					})
				] }, r.property_type)), rateCard.tariffs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "text-muted-foreground",
					children: "No category tariffs yet. Case creation is allowed; fees will remain pending until a tariff is configured."
				}) })] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-9 w-full rounded-md border bg-background px-1",
							value: ptype,
							onChange: (e) => setPtype(e.target.value),
							children: activeTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.code,
								children: t.name
							}, t.code))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fee (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: fee,
							onChange: (e) => setFee(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "TAT days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: tat,
							onChange: (e) => setTat(e.target.value)
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: saving || fee.trim() === "" || !activeTypes.some((t) => t.code === ptype),
					onClick: saveTariff,
					children: saving ? "Saving…" : "Save tariff"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: "Empanelment validity and bank-specific report formats will be configured in a later phase."
				})
			] }) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP18TemplateAdmin, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP20TemplateAdmin, { banks })
	] });
}
//#endregion
export { BankMastersPage as component };
