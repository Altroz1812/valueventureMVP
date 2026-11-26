import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { n as PROPERTY_CATEGORIES, s as propertyError, t as AREA_UNITS } from "./vp-property-data-NyFxtdD0.mjs";
import { a as usePropertyMaster } from "./vp-property-master-z5usx4CM.mjs";
import { a as reviewEvidence, i as addEvidence, n as EVIDENCE_KINDS, o as today, r as MarketSearch, s as useEvidence, t as BASES } from "./vp-market-search-DEMx_PJV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-intelligence-BCThUDQM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blank = () => ({
	label: "",
	address: "",
	observed_on: today(),
	source_ref: "",
	amount: "",
	area: "",
	latitude: "",
	longitude: "",
	road_access: "",
	notes: ""
});
function EvidenceForm({ onDone }) {
	const { tenant } = useApp();
	const qc = useQueryClient();
	const properties = usePropertyMaster();
	const [pid, setPid] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Land");
	const [kind, setKind] = (0, import_react.useState)("registered_sale");
	const [basis, setBasis] = (0, import_react.useState)("land");
	const [unit, setUnit] = (0, import_react.useState)("sqyd");
	const [f, setF] = (0, import_react.useState)(blank);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const p = properties.data?.find((x) => x.id === pid);
	function pick(id) {
		setPid(id);
		const r = properties.data?.find((x) => x.id === id);
		if (r) {
			setCategory(r.data.category);
			setF((old) => ({
				...old,
				label: r.data.label,
				address: r.data.address,
				latitude: r.data.latitude === null ? "" : String(r.data.latitude),
				longitude: r.data.longitude === null ? "" : String(r.data.longitude),
				road_access: r.data.road_access
			}));
		}
	}
	async function save() {
		setError("");
		if (busy) return;
		const amount = Number(f.amount), area = Number(f.area), latitude = f.latitude.trim() === "" ? null : Number(f.latitude), longitude = f.longitude.trim() === "" ? null : Number(f.longitude);
		if (!f.label.trim() || !f.address.trim() || !f.source_ref.trim() || !f.observed_on || f.observed_on > today() || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(area) || area <= 0 || latitude === null !== (longitude === null) || latitude !== null && (!Number.isFinite(latitude) || Math.abs(latitude) > 90) || longitude !== null && (!Number.isFinite(longitude) || Math.abs(longitude) > 180) || pid && !p) {
			setError("Enter valid evidence, date, amount, area, and both coordinates or neither.");
			return;
		}
		const d = {
			...f,
			property_id: p?.id ?? null,
			property_revision: p?.current_revision ?? null,
			category,
			kind,
			area_basis: basis,
			area_unit: unit,
			amount,
			area,
			latitude,
			longitude
		};
		setBusy(true);
		try {
			await addEvidence(d);
			await Promise.all([qc.invalidateQueries({ queryKey: ["vp-p17-evidence", tenant.id] }), qc.invalidateQueries({ queryKey: ["vp-p17-search", tenant.id] })]);
			onDone();
		} catch (e) {
			setError(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Record market evidence"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		onSubmit: (e) => {
			e.preventDefault();
			save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "grid gap-1",
				children: ["Known property (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "rounded border bg-background p-2",
					value: pid,
					onChange: (e) => pick(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Unlinked observation"
					}), properties.data?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: r.id,
						children: [
							"PM-",
							r.id,
							" · ",
							r.data.label
						]
					}, r.id))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "grid gap-1",
				children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "rounded border bg-background p-2",
					value: category,
					disabled: !!p,
					onChange: (e) => setCategory(e.target.value),
					children: PROPERTY_CATEGORIES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))
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
			[
				{
					k: "label",
					l: "Property / observation name",
					required: true
				},
				{
					k: "address",
					l: "Full address / locality",
					required: true
				},
				{
					k: "observed_on",
					l: "Transaction / observation date",
					required: true,
					type: "date"
				},
				{
					k: "source_ref",
					l: "Source reference (deed no., URL, enquiry)",
					required: true
				},
				{
					k: "amount",
					l: "Total consideration / quoted amount (INR)",
					required: true,
					type: "number"
				},
				{
					k: "area",
					l: "Area corresponding to amount",
					required: true,
					type: "number"
				},
				{
					k: "latitude",
					l: "Latitude (optional)",
					type: "number"
				},
				{
					k: "longitude",
					l: "Longitude (optional)",
					type: "number"
				},
				{
					k: "road_access",
					l: "Road access / width"
				},
				{
					k: "notes",
					l: "Evidence notes"
				}
			].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "grid gap-1",
				children: [x.l, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: f[x.k],
					onChange: (e) => setF((old) => ({
						...old,
						[x.k]: e.target.value
					})),
					type: "type" in x ? x.type : "text",
					required: "required" in x && x.required,
					step: "any",
					max: x.k === "observed_on" ? today() : void 0
				})]
			}, x.k)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "grid gap-1",
				children: ["Area unit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "rounded border bg-background p-2",
					value: unit,
					onChange: (e) => setUnit(e.target.value),
					children: AREA_UNITS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					type: "submit",
					children: busy ? "Saving…" : "Save unverified evidence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: onDone,
					disabled: busy,
					children: "Cancel"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive sm:col-span-2",
				children: error
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-xs text-muted-foreground",
		children: "Enter the total amount corresponding to the stated area (for a rate quote, enter amount for one unit and area 1). Evidence remains unverified until reviewed by another authorized user. Saved observations cannot be overwritten."
	})] })] });
}
function EvidenceRow({ r }) {
	const { tenant, can } = useApp();
	const qc = useQueryClient();
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function review(status) {
		if (busy || !reason.trim() || !window.confirm(`Record ${status} decision permanently?`)) return;
		setBusy(true);
		setError("");
		try {
			await reviewEvidence(r.id, status, reason);
			await Promise.all([qc.invalidateQueries({ queryKey: ["vp-p17-evidence", tenant.id] }), qc.invalidateQueries({ queryKey: ["vp-p17-search", tenant.id] })]);
		} catch (e) {
			setError(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "cursor-pointer",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.label }),
				" · ",
				EVIDENCE_KINDS[r.kind],
				" · ",
				fmtINR(Number(r.amount)),
				" / ",
				r.area,
				" ",
				r.area_unit,
				" · ",
				r.status
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 space-y-2 text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					r.category,
					" · ",
					BASES[r.area_basis],
					" · ",
					r.observed_on,
					" · ",
					r.address
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Source: ",
					r.source_ref,
					" · ",
					r.property_id ? `PM-${r.property_id} r${r.property_revision}` : "Unlinked observation"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"GPS: ",
					r.latitude ?? "—",
					", ",
					r.longitude ?? "—",
					" · Road: ",
					r.road_access || "—"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: r.notes }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Created by ",
					r.created_by,
					" · ",
					new Date(r.created_at).toLocaleString()
				] }),
				r.reviewed_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Reviewed by ",
					r.reviewed_by,
					" · ",
					r.review_reason,
					" · ",
					new Date(r.reviewed_at).toLocaleString()
				] }),
				r.status === "unverified" && can("cases.Edit") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1",
							children: ["Review reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								maxLength: 1e3,
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: busy || !reason.trim(),
							onClick: () => void review("verified"),
							children: "Verify"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: busy || !reason.trim(),
							onClick: () => void review("rejected"),
							children: "Reject"
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: error
				})
			]
		})]
	});
}
function MarketPage() {
	const { can } = useApp();
	const properties = usePropertyMaster();
	const [show, setShow] = (0, import_react.useState)(false);
	const [page, setPage] = (0, import_react.useState)(0);
	const [kind, setKind] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [pid, setPid] = (0, import_react.useState)("");
	const list = useEvidence(page, kind, status);
	const p = properties.data?.find((x) => x.id === pid);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Market Intelligence",
		description: "Evidence register · comparable sales · land rates · government guideline values.",
		children: can("cases.View") && can("cases.Create") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setShow((v) => !v),
			children: show ? "Close form" : "New evidence"
		})
	}), !can("cases.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Access denied." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Agency-wide register. No external data feed or automatic market price is supplied. Only reviewed evidence can be selected for a case."
			}),
			show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceForm, { onDone: () => {
				setShow(false);
				setPage(0);
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Market evidence register"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Evidence type",
							className: "rounded border bg-background p-2",
							value: kind,
							onChange: (e) => {
								setKind(e.target.value);
								setPage(0);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All evidence types"
							}), Object.entries(EVIDENCE_KINDS).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: v
							}, k))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							"aria-label": "Verification status",
							className: "rounded border bg-background p-2",
							value: status,
							onChange: (e) => {
								setStatus(e.target.value);
								setPage(0);
							},
							children: [
								"all",
								"unverified",
								"verified",
								"rejected"
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))
						})]
					}),
					list.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading…" }),
					list.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-destructive",
						children: propertyError(list.error)
					}),
					list.isSuccess && list.data.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No evidence recorded." }),
					list.data?.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceRow, { r }, r.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: page === 0,
								onClick: () => setPage((v) => v - 1),
								children: "Previous"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Page ",
								page + 1,
								" · ",
								list.data?.count ?? 0,
								" records"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !list.data || (page + 1) * 50 >= list.data.count,
								onClick: () => setPage((v) => v + 1),
								children: "Next"
							})
						]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Find comparable properties"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [properties.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive",
				children: propertyError(properties.error)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "grid gap-1",
				children: ["Subject property", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "rounded border bg-background p-2",
					value: pid,
					onChange: (e) => setPid(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select subject property"
					}), properties.data?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: r.id,
						children: [
							"PM-",
							r.id,
							" · ",
							r.data.label,
							" · r",
							r.current_revision
						]
					}, r.id))]
				})]
			})] })] }),
			p && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketSearch, {
				id: p.id,
				revision: p.current_revision
			}, `${p.id}:${p.current_revision}`)
		]
	})] });
}
//#endregion
export { MarketPage as component };
