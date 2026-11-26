import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle } from "./card-svjjW0Eb.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { a as encodeSnapshot, l as useP18Template, o as isP18Category, r as decodeSnapshot } from "./vp-p18-api-Dp6x_NGS.mjs";
import { a as sketchSubmissionError, i as encodeSketches, n as clampPoint, r as decodeSketches } from "./vp-p22-sketch-CLt13-It.mjs";
import { r as JsonForms } from "../_libs/jsonforms__react+lodash.mjs";
import { n as vanillaRenderers, t as vanillaCells } from "../_libs/@jsonforms/vanilla-renderers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-p18-supplement-u-OvQj-n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var f = (key, label, type = "text", options, unit, required) => ({
	key,
	label,
	type,
	...options !== void 0 ? { options } : {},
	...unit !== void 0 ? { unit } : {},
	...required !== void 0 ? { required } : {}
});
var floorNames = [
	"Stilt / Base",
	"Ground",
	"First",
	"Second",
	"Third",
	"4th"
];
var boundaryNames = [
	"East",
	"West",
	"North",
	"South"
];
var setbacks = [
	{
		name: "Front",
		key: "front"
	},
	{
		name: "Side1 (Left)",
		key: "left_side"
	},
	{
		name: "Side2 (Right)",
		key: "right_side"
	},
	{
		name: "Rear",
		key: "rear"
	}
];
var inspectionRiskGroups = [
	{
		title: "Identification Issues",
		items: [
			{
				key: "risk_1",
				label: "Property Locked"
			},
			{
				key: "risk_2",
				label: "CDA"
			},
			{
				key: "risk_3",
				label: "Nala /Lake/ Buffer zone"
			}
		]
	},
	{
		title: "Plot area mismatch as per document",
		items: [
			{
				key: "risk_5",
				label: "Approach Road Issue"
			},
			{
				key: "risk_6",
				label: "Usage Deviation"
			},
			{
				key: "risk_7",
				label: "Railway Track"
			}
		]
	},
	{
		title: "Negative Area",
		items: [
			{
				key: "risk_9",
				label: "HT Line"
			},
			{
				key: "risk_10",
				label: "Closer to Religious Building"
			},
			{
				key: "risk_11",
				label: "Graveyard"
			}
		]
	},
	{
		title: "Building deviation / Boundary Mismatch",
		items: [
			{
				key: "risk_13",
				label: "Boundary to BDA/BMRDA/Notified areas"
			},
			{
				key: "risk_14",
				label: "Encroachment"
			},
			{
				key: "risk_15",
				label: "OS displayed"
			}
		]
	},
	{
		title: "Zoning Irregularities",
		items: [{
			key: "risk_17",
			label: "Garbage yard"
		}, {
			key: "risk_18",
			label: "Any Other"
		}]
	}
];
var inspectionPhotoSlots = [
	{
		key: "road",
		label: "Road"
	},
	{
		key: "address",
		label: "Address"
	},
	{
		key: "front-elevation",
		label: "Front elevation / plot frontage"
	},
	{
		key: "side-elevation",
		label: "Side elevation / plot side"
	},
	{
		key: "internal-1",
		label: "Internal 1 (reference addition)"
	},
	{
		key: "internal-2",
		label: "Internal 2"
	},
	{
		key: "kitchen",
		label: "Kitchen (where applicable)"
	},
	{
		key: "bills-verified",
		label: "Bills verified (where available)"
	},
	{
		key: "selfie-customer",
		label: "Selfie with customer"
	},
	{
		key: "dishaank",
		label: "Dishaank"
	},
	{
		key: "compass",
		label: "Compass"
	}
];
function inspectionPhotoCategoryFromName(name) {
	const normalized = (name.includes("__") ? name.split("__", 1)[0] ?? "" : "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	if (normalized === "selfie-customer" || normalized === "selfie-with-customer") return "selfie-customer";
	return inspectionPhotoSlots.some((p) => p.key === normalized) ? normalized : null;
}
function inspectionRequiredPhotoSlots(propertyType) {
	const shared = [
		"road",
		"address",
		"front-elevation",
		"side-elevation",
		"dishaank",
		"compass"
	];
	return propertyType === "Land" ? shared : [
		...shared,
		"internal-2",
		"selfie-customer"
	];
}
function missingInspectionFields(values) {
	const missing = inspectionRequiredKeys.filter((k) => !String(values[k] ?? "").trim());
	const landLength = String(values["land_length"] ?? "").trim();
	const landBreadth = String(values["land_breadth"] ?? "").trim();
	const irregular = String(values["land_dimensions_note"] ?? "").trim();
	const validPositive = (s) => /^(?:[0-9]+(?:\.[0-9]+)?)$/.test(s) && Number(s) > 0;
	if (irregular.length < 8 && (!validPositive(landLength) || !validPositive(landBreadth))) missing.push("positive land_length + land_breadth (or irregular-dimensions explanation 8+ characters)");
	return missing;
}
var photoLabels = [
	["photo_road", "Road"],
	["photo_address", "Address"],
	["photo_front", "Front elevation"],
	["photo_side", "Side elevation"],
	["photo_internal", "Internal 2"],
	["photo_kitchen", "Kitchen"],
	["photo_bills", "Bills Verified"],
	["photo_selfie", "Selfie/Customer"],
	["photo_dishaank", "Dishaank"],
	["photo_compass", "Compass"]
];
var inspectionSections = [
	{
		id: "identification",
		title: "VALUATION REPORT — Visit & verification",
		source: "Rows 1–6",
		layout: "fields",
		fields: [
			f("visit_date", "Date of Visit", "date", void 0, void 0, true),
			f("utility_bill_verified", "Verified", "choice", [
				"Yes",
				"No",
				"Not available"
			]),
			f("utility_bill_type", "Electricity/ Water/ Landline/ Gas Bill", "choice", [
				"Electricity",
				"Water",
				"Landline",
				"Gas",
				"Other"
			]),
			f("ownership_type", "Ownership Type", "choice", ["Freehold", "Lease"]),
			f("geotag_remarks", "Geo Tag", "longtext"),
			f("owner_name", "Property owner name", "text", void 0, void 0, true),
			f("inspection_contact", "Contact Person @ inspection (Name)"),
			f("inspection_contact_mobile", "Contact Person @ inspection (Mobile)"),
			f("inspection_contact_relation", "Relation to owner"),
			f("identified_through", "Property Identified through", "longtext")
		]
	},
	{
		id: "basic",
		title: "1. BASIC DETAILS",
		source: "Rows 7–24",
		layout: "fields",
		fields: [
			f("property_type", "Type of property", "choice", [
				"Resi",
				"Com",
				"Mix",
				"Land"
			], void 0, true),
			f("site_address", "Property address at site", "longtext", void 0, void 0, true),
			f("occupancy", "Occupancy", "choice", [
				"Self occupied",
				"Tenant",
				"Vacant",
				"Under construction",
				"Owner occupied",
				"Tenant occupied",
				"Mixed"
			], void 0, true),
			f("occupant_names", "Name of Occupants"),
			f("rent_per_unit", "Approx. Rent / Unit", "number", void 0, "₹"),
			f("property_age", "Age of Property", "number", void 0, "years"),
			f("completion_percent", "% completion", "number", void 0, "%"),
			f("floorwise_completion", "% comp. in under Construction floorwise", "longtext"),
			...floorNames.map((name, i) => f(`floor_completion_${i}`, `${name}: % completion`, "number", void 0, "%")),
			f("property_demarcated", "Property Demarcated (Yes / No)", "choice", [
				"Yes",
				"No",
				"Unable to verify"
			]),
			f("block_count", "No.of Blocks", "number"),
			f("floor_count", "No.of Floors", "number"),
			f("unit_count", "No of Units", "number"),
			f("structure_type", "Type of Structure", "choice", ["Load Bearing", "Column-Beam"]),
			f("roof_type", "Roof / Plot", "choice", [
				"RCC",
				"Sheet Roof",
				"Vacant Plot"
			]),
			f("property_usage", "Usage of Property", "longtext"),
			f("apartment_floor", "Property located on floor No. (Apartment)", "number"),
			f("locality_type", "Locality Type", "choice", [
				"HIG",
				"MIG",
				"LIG"
			]),
			f("vicinity", "Close Vicinity/Landmark", "longtext"),
			f("approach_road", "Condition of approach road", "longtext"),
			f("approach_road_width", "Width of approach road", "number"),
			f("building_specifications", "Building Specification", "longtext"),
			f("amenities", "Amenities", "longtext")
		]
	},
	{
		id: "land",
		title: "2. Land Actual (L X B)",
		source: "Row 25",
		layout: "fields",
		fields: [
			f("measurement_unit", "Measurement unit", "choice", [
				"Feet",
				"Metres",
				"Other"
			]),
			f("land_length", "Actual Land Length", "number"),
			f("land_breadth", "Actual Land Breadth", "number"),
			f("land_dimensions_note", "Land Actual (L X B) / irregular dimensions", "longtext")
		]
	},
	{
		id: "building",
		title: "3. Building Actual & Building Sketch",
		source: "Rows 26–37",
		layout: "fields",
		fields: [
			f("building_length", "Building Actual Length", "number"),
			f("building_breadth", "Building Actual Breadth", "number"),
			f("building_dimensions_note", "Building Actual / Building Sketch", "longtext"),
			f("plot_sketch_note", "(Compass Direction & Plot sketch)", "longtext"),
			f("plot_facing", "Front of plot faces (road side)", "choice", [
				"East",
				"West",
				"North",
				"South"
			])
		]
	},
	{
		id: "setbacks",
		title: "4. Setbacks",
		source: "Rows 38–42",
		layout: "setbacks",
		fields: setbacks.flatMap((s) => [
			f(`setback_${s.key}_plan`, `${s.name} — As per plan/ Bye laws`, "number"),
			f(`setback_${s.key}_actual`, `${s.name} — Actual at site`, "number"),
			f(`setback_${s.key}_remarks`, `${s.name} — Remarks, if any`, "longtext")
		])
	},
	{
		id: "floor_area",
		title: "5. Floor Wise Area (In Sft.)",
		source: "Rows 43–47",
		layout: "floor_area",
		fields: [...floorNames.map((name, i) => f(`floor_area_${i}`, `${name} — Actual (Sqft)`, "number", void 0, "Sqft")), f("recommended_construction_value", "Recommended Construction Value", "number", void 0, "₹")]
	},
	{
		id: "boundaries",
		title: "6. Boundaries",
		source: "Rows 48–52",
		layout: "boundaries",
		fields: boundaryNames.flatMap((name) => {
			const key = name.toLowerCase();
			return [
				f(`boundary_${key}_deed`, `${name} — As per deed`),
				f(`boundary_${key}_site`, `${name} — At site`),
				f(`boundary_${key}_match`, `${name} — Boundaries Matching`, "choice", [
					"Yes",
					"No",
					"Unable to verify"
				])
			];
		})
	},
	{
		id: "observations",
		title: "7. Observations",
		source: "Rows 53–58",
		layout: "observations",
		fields: [...inspectionRiskGroups.flatMap((group) => group.items.map((item) => f(item.key, item.label, "choice", [
			"Yes",
			"No",
			"Not checked"
		]))), f("risk_remarks", "Observations — detailed remarks", "longtext")]
	},
	{
		id: "land_rate",
		title: "8. Land Rate Ref:",
		source: "Row 59",
		layout: "fields",
		fields: [f("land_rate_reference", "Land Rate Ref:", "longtext")]
	},
	{
		id: "photographs",
		title: "9. Photographs",
		source: "Row 60",
		layout: "photos",
		fields: [...photoLabels.map(([key, label]) => f(key, `${label} — evidence/photo note`)), f("other_notes", "Other site inspection remarks", "longtext")]
	}
];
var inspectionRequiredKeys = [...inspectionSections.flatMap((s) => s.fields).filter((f) => f.required).map((f) => f.key), ...[
	"east",
	"west",
	"north",
	"south"
].map((x) => `boundary_${x}_site`)];
var Canvas = (0, import_react.lazy)(() => import("./vp-p22-canvas-CS-sGNQ7.mjs"));
function VpP22Sketch({ raw, disabled, onChange }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [kind, setKind] = (0, import_react.useState)("plot");
	(0, import_react.useEffect)(() => setMounted(true), []);
	const parsed = (0, import_react.useMemo)(() => {
		try {
			return {
				data: decodeSketches(raw),
				error: ""
			};
		} catch (e) {
			return {
				data: null,
				error: String(e)
			};
		}
	}, [raw]);
	if (disabled && !raw) return null;
	if (!parsed.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		role: "alert",
		className: "text-destructive",
		children: ["Stored sketch unreadable; preserved unchanged. ", parsed.error]
	});
	const data = parsed.data, s = data[kind];
	const update = (next) => {
		if (!disabled) onChange?.(encodeSketches({
			...data,
			[kind]: next
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Plot & floor schematic"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Optional drawing, not to scale or certified. No geometric area or rate enters valuation. Changes use the existing inspection save and submission lock."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					"aria-pressed": kind === "plot",
					variant: kind === "plot" ? "default" : "outline",
					onClick: () => setKind("plot"),
					children: "Plot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					"aria-pressed": kind === "floor",
					variant: kind === "floor" ? "default" : "outline",
					onClick: () => setKind("floor"),
					children: "Floor"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-1",
				children: ["Sketch name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: s.name,
					maxLength: 80,
					disabled,
					onChange: (e) => update({
						...s,
						name: e.target.value
					})
				})]
			}),
			mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading canvas…" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
					sketch: s,
					disabled,
					onChange: update
				})
			}),
			!disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Tap the canvas to add a vertex, drag points to adjust, or edit coordinates below. Maximum ",
				24,
				" vertices."
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: s.points.length >= 24,
						onClick: () => update({
							...s,
							points: [...s.points, clampPoint(40 + s.points.length * 19, 60 + s.points.length % 4 * 40)]
						}),
						children: "Add vertex"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: !s.points.length,
						onClick: () => update({
							...s,
							points: s.points.slice(0, -1)
						}),
						children: "Undo last vertex"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: !s.points.length,
						onClick: () => {
							if (window.confirm("Clear this schematic?")) update({
								...s,
								points: []
							});
						},
						children: "Clear outline"
					})
				]
			})] }),
			s.points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 rounded border p-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
						"Vertex ",
						i + 1,
						" X",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 600,
							value: p.x,
							disabled,
							onChange: (e) => update({
								...s,
								points: s.points.map((q, j) => j === i ? {
									...clampPoint(Number(e.target.value), q.y),
									label: q.label
								} : q)
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
						"Vertex ",
						i + 1,
						" Y",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 360,
							value: p.y,
							disabled,
							onChange: (e) => update({
								...s,
								points: s.points.map((q, j) => j === i ? {
									...clampPoint(q.x, Number(e.target.value)),
									label: q.label
								} : q)
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "col-span-2 sm:col-span-1",
						children: ["Edge to next vertex (observed)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.label,
							maxLength: 80,
							disabled,
							onChange: (e) => update({
								...s,
								points: s.points.map((q, j) => j === i ? {
									...q,
									label: e.target.value
								} : q)
							})
						})]
					})
				]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-1",
				children: ["Drawing notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "rounded border bg-background p-2",
					maxLength: 500,
					value: s.note,
					disabled,
					onChange: (e) => update({
						...s,
						note: e.target.value
					})
				})]
			}),
			sketchSubmissionError(raw) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-amber-700",
				children: sketchSubmissionError(raw)
			})
		]
	})] });
}
function formSchema(template) {
	const properties = {};
	for (const f of template.fields) {
		const title = f.label + (f.unit ? ` (${f.unit})` : "");
		properties[f.key] = f.type === "number" ? {
			type: "number",
			title,
			minimum: 0,
			maximum: 0x38d7ea4c68000
		} : f.type === "choice" ? {
			type: "string",
			title,
			enum: f.options ?? []
		} : {
			type: "string",
			title,
			maxLength: 1e3
		};
	}
	return {
		schema: {
			type: "object",
			properties,
			additionalProperties: false
		},
		uischema: {
			type: "VerticalLayout",
			elements: template.fields.map((f) => ({
				type: "Control",
				scope: `#/properties/${f.key}`
			}))
		}
	};
}
function parse(raw) {
	try {
		return {
			snapshot: decodeSnapshot(raw),
			error: ""
		};
	} catch (e) {
		return {
			snapshot: null,
			error: e instanceof Error ? e.message : String(e)
		};
	}
}
function ReadOnly({ snapshot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-muted-foreground",
		children: [
			"Category: ",
			snapshot.template.category,
			" · Template revision: ",
			snapshot.template.revision,
			" · supplemental observations (not adopted values)"
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "grid gap-3 sm:grid-cols-2",
		children: snapshot.template.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
			className: "text-xs text-muted-foreground",
			children: [f.label, f.unit ? ` (${f.unit})` : ""]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "break-words whitespace-pre-wrap",
			children: snapshot.values[f.key] ?? "Not recorded"
		})] }, f.key))
	})] });
}
function VpP18QcSummary({ raw }) {
	const { snapshot, error } = parse(raw);
	if (!raw) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded border p-3 space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
			className: "font-semibold",
			children: "Category-specific observations"
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			role: "alert",
			className: "text-destructive",
			children: [
				"Supplement unreadable: ",
				error,
				". Original report retained."
			]
		}) : snapshot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnly, { snapshot })]
	});
}
function Editor({ template, saved, disabled, onApply, onPending }) {
	const { schema, uischema } = (0, import_react.useMemo)(() => formSchema(template), [template]);
	const [draft, setDraft] = (0, import_react.useState)(saved);
	const [errors, setErrors] = (0, import_react.useState)(0);
	const savedEncoded = encodeSnapshot(template, saved);
	const [encoded, setEncoded] = (0, import_react.useState)(savedEncoded);
	const [localError, setLocalError] = (0, import_react.useState)("");
	const pending = !disabled && (encoded !== savedEncoded || errors > 0 || !!localError);
	(0, import_react.useEffect)(() => {
		onPending(pending);
	}, [pending, onPending]);
	(0, import_react.useEffect)(() => () => onPending(false), [onPending]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Template ",
					template.category,
					" / ",
					template.revision,
					". Fields are optional supplemental observations. Apply to the inspection draft, then save and verify through the original report."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vp-p18-jsonforms",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonForms, {
					schema,
					uischema,
					data: draft,
					renderers: vanillaRenderers,
					cells: vanillaCells,
					readonly: disabled,
					onChange: ({ data, errors: validationErrors }) => {
						setDraft(data);
						setErrors(validationErrors?.length ?? 0);
						try {
							setEncoded(encodeSnapshot(template, data));
							setLocalError("");
						} catch (e) {
							setLocalError(e instanceof Error ? e.message : String(e));
						}
					}
				})
			}),
			!!localError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive text-sm",
				children: localError
			}),
			pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-xs text-amber-700",
				children: "Unapplied supplemental changes. Apply or discard before submitting."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: disabled || !pending || errors > 0 || !!localError,
					onClick: () => {
						onApply(encoded);
						onPending(false);
					},
					children: "Apply to inspection draft"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: disabled || !pending,
					onClick: () => {
						setDraft({ ...saved });
						setEncoded(savedEncoded);
						setErrors(0);
						setLocalError("");
						onPending(false);
					},
					children: "Discard unapplied changes"
				})]
			})
		]
	});
}
function VpP18Supplement({ productType, raw, disabled, onApply, onPending }) {
	const parsed = (0, import_react.useMemo)(() => parse(raw), [raw]);
	const query = useP18Template(productType, !raw && !disabled);
	const selected = parsed.snapshot?.template ?? query.data;
	const saved = parsed.snapshot?.values ?? {};
	if (!raw && !isP18Category(productType)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
		className: "pb-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Additional property observations"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "space-y-3 text-sm",
		children: parsed.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			role: "alert",
			className: "text-destructive",
			children: [
				"Saved supplement cannot be decoded: ",
				parsed.error,
				". It will be preserved without modification."
			]
		}) : parsed.snapshot && parsed.snapshot.template.category !== productType ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "text-amber-700",
			children: "Case category differs from saved template. Historical supplement is preserved read-only; review category before further analysis."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnly, { snapshot: parsed.snapshot })] }) : disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parsed.snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnly, { snapshot: parsed.snapshot }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No supplemental observations recorded."
		}) }) : query.isError && !parsed.snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			role: "alert",
			className: "text-destructive",
			children: [
				"Template unavailable: ",
				String(query.error?.message ?? query.error),
				". Existing inspection fields remain available."
			]
		}) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
			template: selected,
			saved,
			disabled,
			onApply,
			onPending
		}, `${selected.category}:${selected.revision}:${raw ?? ""}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading template…" })
	})] });
}
//#endregion
export { inspectionPhotoSlots as a, inspectionSections as c, inspectionPhotoCategoryFromName as i, missingInspectionFields as l, VpP18Supplement as n, inspectionRequiredPhotoSlots as o, VpP22Sketch as r, inspectionRiskGroups as s, VpP18QcSummary as t };
