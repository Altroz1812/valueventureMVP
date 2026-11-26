import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle } from "./card-svjjW0Eb.mjs";
import { n as collectPages } from "./vp-query-NYEPg70J.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { s as propertyError } from "./vp-property-data-NyFxtdD0.mjs";
import { o as validMapPoint } from "./vp-p22-sketch-CLt13-It.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-market-search-DEMx_PJV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Canvas = (0, import_react.lazy)(() => import("./vp-p22-map-canvas-4W5o_y1u.mjs"));
function VpP22ComparableMap({ filters, rows }) {
	const { tenant, can } = useApp();
	const [open, setOpen] = (0, import_react.useState)(false);
	const ids = rows.map((r) => r.evidence_id);
	const query = useQuery({
		queryKey: [
			"vp-p22-map",
			tenant.id,
			filters,
			ids
		],
		enabled: open && can("cases.View"),
		queryFn: async () => {
			const { data: rev, error: revError } = await vpDb.from("vp_property_revisions").select("data").eq("org_id", tenant.id).eq("property_id", filters.property_id).eq("revision", filters.revision).single();
			if (revError) throw revError;
			const s = rev?.data;
			if (!s || !validMapPoint(s.latitude, s.longitude)) throw new Error("Pinned subject revision has no usable map coordinates.");
			const points = [{
				id: "subject",
				lat: s.latitude,
				lng: Number(s.longitude),
				label: `Subject PM-${filters.property_id} r${filters.revision}`,
				subject: true
			}];
			if (ids.length) {
				const { data, error } = await vpDb.from("vp_market_evidence").select("id::text,latitude,longitude").eq("org_id", tenant.id).in("id", ids);
				if (error) throw error;
				const lookup = new Map(rows.map((r) => [r.evidence_id, r]));
				for (const p of data ?? []) {
					const r = lookup.get(String(p.id));
					if (r && validMapPoint(p.latitude, p.longitude)) points.push({
						id: r.evidence_id,
						lat: p.latitude,
						lng: Number(p.longitude),
						label: `${r.label} · ${(r.dist_meters / 1e3).toFixed(2)} km · ${r.status}`,
						subject: false
					});
				}
			}
			return points;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded border p-3 space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "outline",
			onClick: () => setOpen((v) => !v),
			children: open ? "Hide comparable map" : "Show comparable map (P22)"
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading registered coordinates…" }),
			query.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive",
				children: ["Map coordinates unavailable: ", String(query.error.message ?? query.error)]
			}),
			query.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Mapped ",
					query.data.length - 1,
					" of ",
					rows.length,
					" matched evidence records. Missing/unsupported coordinates are omitted; table remains authoritative."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading map…" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
					points: query.data,
					radius: filters.radius
				})
			})] })
		] })]
	});
}
var EVIDENCE_KINDS = {
	registered_sale: "Registered sale",
	broker_enquiry: "Broker enquiry",
	asking_price: "Asking price",
	guideline: "Government guideline value",
	land_rate: "Land rate observation",
	previous_valuation: "Previous valuation"
};
var BASES = {
	land: "Land area",
	builtup: "Built-up area",
	carpet: "Carpet area",
	superbuiltup: "Super built-up area"
};
function today() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function useEvidence(page, kind, status) {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: [
			"vp-p17-evidence",
			tenant.id,
			page,
			kind,
			status
		],
		enabled: can("cases.View"),
		queryFn: async () => {
			let q = vpDb.from("vp_market_evidence").select("id::text,property_id::text,property_revision,category,kind,label,address,observed_on,source_ref,amount,area,area_unit,area_basis,road_access,notes,latitude,longitude,status,created_by::text,created_at,reviewed_by::text,reviewed_at,review_reason", { count: "exact" }).eq("org_id", tenant.id);
			if (kind !== "all") q = q.eq("kind", kind);
			if (status !== "all") q = q.eq("status", status);
			const { data, error, count } = await q.order("id", { ascending: false }).range(page * 50, page * 50 + 49);
			if (error) throw error;
			return {
				rows: data ?? [],
				count: count ?? 0
			};
		}
	});
}
function useComparableSearch(filters) {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: [
			"vp-p17-search",
			tenant.id,
			filters
		],
		enabled: !!filters && can("cases.View"),
		queryFn: async () => {
			if (!filters) throw new Error("Choose search criteria");
			const { data, error } = await vpDb.rpc("vp_p17_nearby_sales", {
				p_property_id: filters.property_id,
				p_revision: filters.revision,
				p_radius_m: filters.radius,
				p_max_age_months: filters.months,
				p_as_of: filters.asOf,
				p_verified_only: filters.verified,
				p_area_basis: filters.basis,
				p_kind: filters.kind
			});
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useSelectedEvidence(num) {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: [
			"vp-p17-selected",
			tenant.id,
			num
		],
		enabled: num !== null && can("cases.View"),
		queryFn: async () => {
			return collectPages(async (start, end) => {
				const { data, error } = await vpDb.from("vp_case_market_evidence").select("link_version,evidence_id::text,effective_date,snapshot,reason,selected_at").eq("org_id", tenant.id).eq("num", num).order("link_version", { ascending: false }).order("evidence_id", { ascending: false }).range(start, end);
				return {
					data,
					error
				};
			});
		}
	});
}
async function call(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw error;
	return data;
}
var addEvidence = (data) => call("vp_p17_add_evidence", { p_data: data });
var reviewEvidence = (id, status, reason) => call("vp_p17_review_evidence", {
	p_id: id,
	p_status: status,
	p_reason: reason
});
var selectEvidence = (num, version, id, asOf, reason) => call("vp_p17_select_evidence", {
	p_num: num,
	p_link_version: version,
	p_evidence_id: id,
	p_effective_date: asOf,
	p_reason: reason
});
function MarketSearch({ id, revision, caseNum, linkVersion }) {
	const { tenant, can } = useApp();
	const qc = useQueryClient();
	const [radius, setRadius] = (0, import_react.useState)("5");
	const [months, setMonths] = (0, import_react.useState)("36");
	const [asOf, setAsOf] = (0, import_react.useState)(today);
	const [basis, setBasis] = (0, import_react.useState)("land");
	const [kind, setKind] = (0, import_react.useState)("registered_sale");
	const [verified, setVerified] = (0, import_react.useState)(true);
	const [filters, setFilters] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const search = useComparableSearch(filters);
	const selected = useSelectedEvidence(caseNum ?? null);
	function run() {
		setError("");
		const r = Number(radius) * 1e3, m = Number(months);
		if (!Number.isInteger(r) || r < 1 || r > 5e4 || !Number.isInteger(m) || m < 1 || m > 120 || !asOf || asOf > today()) {
			setError("Enter valid radius (up to 50 km), age (1–120 months) and effective date.");
			return;
		}
		setFilters({
			property_id: id,
			revision,
			radius: r,
			months: m,
			asOf,
			basis,
			kind,
			verified
		});
	}
	async function choose(eid) {
		if (caseNum === void 0 || linkVersion === void 0 || !filters || !reason.trim() || busy) return;
		setBusy(true);
		setError("");
		try {
			await selectEvidence(caseNum, linkVersion, eid, filters.asOf, reason);
			await qc.invalidateQueries({ queryKey: [
				"vp-p17-selected",
				tenant.id,
				caseNum
			] });
			setReason("");
		} catch (e) {
			setError(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	const current = selected.data?.filter((s) => s.link_version === linkVersion) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "md:col-span-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "text-base",
			children: [
				"Market comparable search · PM-",
				id,
				" r",
				revision
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Search the agency's recorded evidence only. Results use the pinned property location and category. No automated adoption of rates. GPS is used for distance, not geofencing."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						run();
					},
					className: "grid gap-2 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Radius (km)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "0.001",
								max: "50",
								step: "0.001",
								value: radius,
								onChange: (e) => setRadius(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Maximum age (months)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "1",
								max: "120",
								value: months,
								onChange: (e) => setMonths(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Valuation effective date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: asOf,
								max: today(),
								onChange: (e) => setAsOf(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Evidence type", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "rounded border bg-background p-2",
								value: kind,
								onChange: (e) => setKind(e.target.value),
								children: Object.entries(EVIDENCE_KINDS).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: k,
									children: v
								}, k))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Area basis", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "rounded border bg-background p-2",
								value: basis,
								onChange: (e) => setBasis(e.target.value),
								children: Object.entries(BASES).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: k,
									children: v
								}, k))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: verified,
								onChange: (e) => setVerified(e.target.checked)
							}), "Verified only"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: search.isFetching,
							children: "Search evidence"
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: error
				}),
				search.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: propertyError(search.error)
				}),
				search.isFetching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Searching…" }),
				filters && search.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							search.data.length,
							" result(s), nearest first, maximum 100 · ",
							EVIDENCE_KINDS[filters.kind],
							" · ",
							BASES[filters.basis],
							" · as of ",
							filters.asOf
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP22ComparableMap, {
						filters,
						rows: search.data
					}, `${filters.property_id}:${filters.revision}:${filters.asOf}`),
					caseNum !== void 0 && can("cases.Edit") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: "grid gap-1",
						children: ["Selection reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							maxLength: 1e3
						})]
					}),
					search.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No matching evidence. Add sourced observations in Market Intelligence." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-b",
								children: [
									"Evidence / source",
									"Date / status",
									"Distance",
									"INR / sq yd",
									"INR / sq ft",
									"Action"
								].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2",
									children: x
								}, x))
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: search.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.label }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.address }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.source_ref }),
											!r.property_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted-foreground",
												children: "Property identity not linked: confirm not the subject."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2",
										children: [r.observed_on, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.status })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-2",
										children: [(r.dist_meters / 1e3).toFixed(2), " km"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2",
										children: fmtINR(Number(r.rate_per_sqyd))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2",
										children: fmtINR(Number(r.rate_per_sqft))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2",
										children: caseNum !== void 0 && can("cases.Edit") ? current.some((s) => s.evidence_id === r.evidence_id) ? "Selected" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											disabled: busy || !reason.trim() || r.status !== "verified" || !selected.isSuccess,
											onClick: () => void choose(r.evidence_id),
											children: "Select"
										}) : "Reference"
									})
								]
							}, r.evidence_id)) })]
						})
					})
				] }),
				caseNum !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "Selected evidence history"
					}),
					selected.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-destructive",
						children: propertyError(selected.error)
					}),
					selected.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading…" }),
					selected.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No selected evidence." }),
					selected.data?.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.snapshot.label }),
							" · ",
							EVIDENCE_KINDS[s.snapshot.kind],
							" · ",
							fmtINR(Number(s.snapshot.amount)),
							" / ",
							s.snapshot.area,
							" ",
							s.snapshot.area_unit,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								s.snapshot.source_ref,
								" · ",
								s.reason
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Link v",
									s.link_version,
									s.link_version !== linkVersion ? " (historical)" : "",
									" · effective ",
									s.effective_date,
									" · selected ",
									new Date(s.selected_at).toLocaleString()
								]
							})
						]
					}, `${s.link_version}:${s.evidence_id}`))
				] })
			]
		})]
	});
}
//#endregion
export { reviewEvidence as a, useSelectedEvidence as c, addEvidence as i, EVIDENCE_KINDS as n, today as o, MarketSearch as r, useEvidence as s, BASES as t };
