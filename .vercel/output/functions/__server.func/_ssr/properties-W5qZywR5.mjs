import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { n as collectPages } from "./vp-query-NYEPg70J.mjs";
import { s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { a as emptyParcel, i as emptyOwner, n as PROPERTY_CATEGORIES, o as emptyProperty, r as emptyDocument, s as propertyError, t as AREA_UNITS } from "./vp-property-data-NyFxtdD0.mjs";
import { a as usePropertyMaster, i as usePropertyLinks, n as saveProperty, o as usePropertyRevisions } from "./vp-property-master-z5usx4CM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-W5qZywR5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var textFields = [
	["label", "Property name / reference"],
	["address", "Full address"],
	["state", "State"],
	["district", "District"],
	["mandal", "Mandal / Taluk"],
	["village", "Village / locality"],
	["municipality", "Municipality / Gram Panchayat"],
	["pincode", "PIN code"],
	["landmark", "Landmark"],
	["road_access", "Road / access"],
	["building_name", "Building / project name"],
	["flat_no", "Flat / unit number"],
	["notes", "Source / general notes"]
];
var dirs = [
	"north",
	"south",
	"east",
	"west"
];
var native = "w-full rounded-md border border-input bg-background px-2 py-2 text-sm";
function Field({ label, value, onChange, type = "text", disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
		className: "grid gap-1 text-xs font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type,
			step: type === "number" ? "any" : void 0,
			value: value ?? "",
			disabled,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
function n(s) {
	return s.trim() === "" ? null : Number(s);
}
function Unit({ value, onChange, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
		className: "grid gap-1 text-xs",
		children: ["Unit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			className: native,
			value,
			disabled,
			onChange: (e) => onChange(e.target.value),
			children: AREA_UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: u }, u))
		})]
	});
}
function PropertyEditor({ record, editable, onSaved, onCancel }) {
	const [d, setD] = (0, import_react.useState)(() => record?.data ?? emptyProperty());
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const locked = !editable || busy;
	function patch(key, value) {
		setD((old) => ({
			...old,
			[key]: value
		}));
	}
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError("");
		try {
			await onSaved(await saveProperty(record, d, reason));
		} catch (e) {
			setError(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: submit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: record ? `Property PM-${record.id} · Revision ${record.current_revision}` : "New property"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: "grid gap-1 text-xs",
						children: ["Property category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: native,
							disabled: locked,
							value: d.category,
							onChange: (e) => patch("category", e.target.value),
							children: PROPERTY_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})]
					}),
					textFields.map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label,
						value: d[k],
						disabled: locked,
						onChange: (v) => patch(k, v)
					}, k)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Latitude (optional)",
						type: "number",
						value: d.latitude,
						disabled: locked,
						onChange: (v) => patch("latitude", n(v))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Longitude (optional)",
						type: "number",
						value: d.longitude,
						disabled: locked,
						onChange: (v) => patch("longitude", n(v))
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Boundaries — document vs site"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid gap-3 sm:grid-cols-2",
				children: dirs.map((dir) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 rounded border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `${dir} as per deed`,
						value: d[`${dir}_deed`],
						disabled: locked,
						onChange: (v) => patch(`${dir}_deed`, v)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `${dir} as observed`,
						value: d[`${dir}_actual`],
						disabled: locked,
						onChange: (v) => patch(`${dir}_actual`, v)
					})]
				}, dir))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Land parcels & extents"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					d.parcels.map((p, i) => {
						const upd = (v) => patch("parcels", d.parcels.map((x, j) => j === i ? {
							...x,
							...v
						} : x));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded border p-3 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Survey / subdivision",
									value: p.survey_no,
									disabled: locked,
									onChange: (v) => upd({ survey_no: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Plot number",
									value: p.plot_no,
									disabled: locked,
									onChange: (v) => upd({ plot_no: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Document extent",
									type: "number",
									value: p.deed_area,
									disabled: locked,
									onChange: (v) => upd({ deed_area: n(v) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
									value: p.deed_unit,
									disabled: locked,
									onChange: (v) => upd({ deed_unit: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Actual extent",
									type: "number",
									value: p.actual_area,
									disabled: locked,
									onChange: (v) => upd({ actual_area: n(v) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
									value: p.actual_unit,
									disabled: locked,
									onChange: (v) => upd({ actual_unit: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Notes / source",
									value: p.notes,
									disabled: locked,
									onChange: (v) => upd({ notes: v })
								}),
								editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									disabled: busy,
									onClick: () => patch("parcels", d.parcels.filter((_, j) => j !== i)),
									children: "Remove parcel"
								})
							]
						}, i);
					}),
					!d.parcels.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No parcels recorded."
					}),
					editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy || d.parcels.length >= 100,
						onClick: () => patch("parcels", [...d.parcels, emptyParcel()]),
						children: "Add parcel"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Reported ownership history"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Recorded statements only; not a legal title certification."
					}),
					d.owners.map((o, i) => {
						const upd = (v) => patch("owners", d.owners.map((x, j) => j === i ? {
							...x,
							...v
						} : x));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded border p-3 sm:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Owner name",
									value: o.name,
									disabled: locked,
									onChange: (v) => upd({ name: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Interest / ownership type",
									value: o.interest,
									disabled: locked,
									onChange: (v) => upd({ interest: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Share % (if known)",
									type: "number",
									value: o.share_pct,
									disabled: locked,
									onChange: (v) => upd({ share_pct: n(v) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "From date",
									type: "date",
									value: o.from_date,
									disabled: locked,
									onChange: (v) => upd({ from_date: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "To date",
									type: "date",
									value: o.to_date,
									disabled: locked,
									onChange: (v) => upd({ to_date: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Evidence reference",
									value: o.evidence,
									disabled: locked,
									onChange: (v) => upd({ evidence: v })
								}),
								editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									disabled: busy,
									onClick: () => patch("owners", d.owners.filter((_, j) => j !== i)),
									children: "Remove entry"
								})
							]
						}, i);
					}),
					!d.owners.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No ownership records."
					}),
					editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy || d.owners.length >= 100,
						onClick: () => patch("owners", [...d.owners, emptyOwner()]),
						children: "Add owner"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Document references"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Record deed, EC, approval, tax and other reference details. Upload actual documents in the existing case Documents tab."
					}),
					d.documents.map((doc, i) => {
						const upd = (v) => patch("documents", d.documents.map((x, j) => j === i ? {
							...x,
							...v
						} : x));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded border p-3 sm:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Document type",
									value: doc.kind,
									disabled: locked,
									onChange: (v) => upd({ kind: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Document / registration number",
									value: doc.reference,
									disabled: locked,
									onChange: (v) => upd({ reference: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Document date",
									type: "date",
									value: doc.date,
									disabled: locked,
									onChange: (v) => upd({ date: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "SRO / issuing authority",
									value: doc.sro,
									disabled: locked,
									onChange: (v) => upd({ sro: v })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Notes",
									value: doc.notes,
									disabled: locked,
									onChange: (v) => upd({ notes: v })
								}),
								editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									disabled: busy,
									onClick: () => patch("documents", d.documents.filter((_, j) => j !== i)),
									children: "Remove reference"
								})
							]
						}, i);
					}),
					!d.documents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No document references."
					}),
					editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy || d.documents.length >= 100,
						onClick: () => patch("documents", [...d.documents, emptyDocument()]),
						children: "Add document reference"
					})
				]
			})] }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: error
			}),
			editable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-md border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Reason for creation or revision (required)",
					value: reason,
					disabled: locked,
					onChange: setReason
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || !reason.trim(),
						children: busy ? "Saving…" : "Save property revision"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy,
						onClick: onCancel,
						children: "Cancel"
					})]
				})]
			})
		]
	});
}
function ReleasedHistory({ links }) {
	const { tenant } = useApp();
	const nums = links.map((l) => l.num);
	const reports = useQuery({
		queryKey: [
			"vp-p16-released-history",
			tenant.id,
			nums
		],
		enabled: nums.length > 0,
		queryFn: async () => {
			const rows = [];
			for (let i = 0; i < nums.length; i += 100) rows.push(...await collectPages(async (start, end) => {
				const { data, error } = await vpDb.from("vp_report_versions").select("id::text,num,version_no,status,released_at,calculations_snapshot").eq("org_id", tenant.id).eq("status", "Released").in("num", nums.slice(i, i + 100)).order("id", { ascending: false }).range(start, end);
				return {
					data,
					error
				};
			}));
			return rows.sort((a, b) => (b.released_at ?? "").localeCompare(a.released_at ?? ""));
		}
	});
	const rows = reports.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-medium",
			children: "Released valuation reports"
		}), reports.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading reports…" }) : reports.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "text-destructive",
			children: propertyError(reports.error)
		}) : rows.length ? rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap justify-between gap-2 border-b py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "underline",
				to: "/cases/$caseId",
				params: { caseId: String(r.num) },
				children: [
					"Case #",
					r.num,
					" · report v",
					r.version_no
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				r.released_at ? new Date(r.released_at).toLocaleDateString() : "—",
				" · ",
				typeof r.calculations_snapshot?.marketValue === "number" ? fmtINR(r.calculations_snapshot.marketValue) : "Market value unavailable"
			] })]
		}, r.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No accessible released reports for currently linked cases."
		})]
	});
}
function PropertyHistory({ record }) {
	const revisions = usePropertyRevisions(record.id);
	const links = usePropertyLinks(record.id);
	const cases = useVpCases();
	const { can } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Property history & linked cases"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4 text-sm",
		children: [
			revisions.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive",
				children: propertyError(revisions.error)
			}),
			revisions.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading revisions…" }),
			revisions.data?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "rounded border p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "cursor-pointer",
						children: [
							"Revision ",
							r.revision,
							" · ",
							new Date(r.recorded_at).toLocaleString(),
							" · ",
							r.reason
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "my-2 text-xs text-muted-foreground",
						children: [
							"Recorded by user ",
							r.recorded_by,
							". Read-only snapshot."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyEditor, {
						record: {
							...record,
							current_revision: r.revision,
							data: r.data,
							updated_at: r.recorded_at
						},
						editable: false,
						onSaved: async () => {},
						onCancel: () => {}
					}, `${record.id}:${r.revision}:snapshot`)
				]
			}, r.revision)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium",
				children: "Currently linked cases"
			}),
			links.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading associations…" }) : links.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive",
				children: propertyError(links.error)
			}) : links.data?.length ? links.data.map((l) => {
				const c = cases.allCases.find((x) => x.caseNum === l.num);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-between gap-2 border-b py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "underline",
						to: "/cases/$caseId",
						params: { caseId: String(l.num) },
						children: [
							c?.caseNo ?? `#${l.num}`,
							" · ",
							c?.bank ?? "Case"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Property revision ",
						l.property_revision,
						" · linked ",
						new Date(l.linked_at).toLocaleDateString()
					] })]
				}, l.num);
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "No linked cases. Use a case's Overview tab to associate it."
			}),
			(can("signoff.View") || can("signoff.Generate")) && links.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleasedHistory, { links: links.data })
		]
	})] });
}
function PropertiesPage() {
	const { can, tenant } = useApp();
	const qc = useQueryClient();
	const master = usePropertyMaster();
	const [q, setQ] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [editRecord, setEditRecord] = (0, import_react.useState)(null);
	const editing = editRecord !== null;
	const record = master.data?.find((p) => p.id === selected) ?? null;
	const rows = (master.data ?? []).filter((p) => [
		p.id,
		p.data.label,
		p.data.address,
		p.data.district,
		p.data.category,
		...p.data.parcels.flatMap((x) => [x.survey_no, x.plot_no])
	].join(" ").toLowerCase().includes(q.toLowerCase()));
	async function saved(id) {
		await Promise.all([qc.invalidateQueries({ queryKey: ["vp-p16-properties", tenant.id] }), qc.invalidateQueries({ queryKey: [
			"vp-p16-revisions",
			tenant.id,
			id
		] })]);
		setSelected(id);
		setCreating(false);
		setEditRecord(null);
	}
	function choose(id) {
		if ((creating || editing) && !window.confirm("Discard unsaved changes?")) return;
		setSelected(id);
		setEditRecord(null);
		setCreating(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Property Master",
		description: "Agency-wide property register · Indian property identification, parcels, ownership and document references.",
		children: can("cases.View") && can("cases.Create") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: creating || editing,
			onClick: () => {
				setCreating(true);
				setEditRecord(null);
			},
			children: "New property"
		})
	}), !can("cases.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Property register access is denied." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 text-xs text-muted-foreground",
		children: "This is an agency-wide reference register (not restricted by the branch selector). Source observations are not certified title or automatically adopted valuation inputs. Search before creating a duplicate."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[280px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "text-sm",
			children: [
				"Properties (",
				rows.length,
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			placeholder: "Search address, survey, plot…",
			value: q,
			onChange: (e) => setQ(e.target.value)
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-1",
			children: [
				master.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading properties…" }),
				master.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-destructive",
					children: propertyError(master.error)
				}),
				master.isSuccess && !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No matching properties."
				}),
				rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => choose(p.id),
					className: `w-full rounded border p-2 text-left text-sm ${selected === p.id && !creating ? "border-primary bg-muted" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: p.data.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"PM-",
							p.id,
							" · ",
							p.data.category,
							" · ",
							p.data.district,
							" · r",
							p.current_revision
						]
					})]
				}, p.id))
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyEditor, {
				record: null,
				editable: can("cases.Create"),
				onSaved: saved,
				onCancel: () => setCreating(false)
			}, "new") : record ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: can("cases.Edit") && !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setEditRecord(record),
						children: "Edit / new revision"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyEditor, {
					record: editRecord ?? record,
					editable: editing && can("cases.Edit"),
					onSaved: saved,
					onCancel: () => setEditRecord(null)
				}, `${record.id}:${editRecord?.current_revision ?? record.current_revision}:${editing}`),
				!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyHistory, { record })
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded border p-6 text-sm text-muted-foreground",
				children: "Select a property or create a new record."
			})
		})]
	})] })] });
}
//#endregion
export { PropertiesPage as component };
