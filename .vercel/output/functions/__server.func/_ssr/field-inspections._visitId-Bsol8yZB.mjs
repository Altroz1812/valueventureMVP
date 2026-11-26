import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, n as mayOpenPath, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Dt as Check, H as LockKeyhole, Tt as ChevronLeft, Vt as ArrowLeft, W as Link2, ct as Eye, dt as Download, f as ShieldCheck, g as Send, jt as Camera, l as TriangleAlert, p as ShieldAlert, t as X, vt as ClipboardCheck, w as RefreshCcw, wt as ChevronRight, y as Save } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { o as useVpCaseDocuments, r as openVpDocument, s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as zipSync, i as unzipSync, n as strToU8, t as strFromU8 } from "../_libs/fflate.mjs";
import { t as Textarea } from "./textarea-BAeo4PcW.mjs";
import { n as P18_KEY } from "./vp-p18-api-Dp6x_NGS.mjs";
import { i as spokenNumber, n as VoiceMic, r as VoiceOption, t as VoiceLanguage } from "./vp-voice-BmdpI54j.mjs";
import { i as preferredOcrDocument, s as verifyInspectionReadback, t as VpDocumentOcr } from "./vp-document-ocr-weBL-qtE.mjs";
import { a as sketchSubmissionError, t as P22_KEY } from "./vp-p22-sketch-CLt13-It.mjs";
import { t as Route } from "./field-inspections._visitId-RDKfgEoR.mjs";
import { a as inspectionPhotoSlots, c as inspectionSections, i as inspectionPhotoCategoryFromName, l as missingInspectionFields, n as VpP18Supplement, o as inspectionRequiredPhotoSlots, r as VpP22Sketch, s as inspectionRiskGroups } from "./vp-p18-supplement-u-OvQj-n.mjs";
import { a as useVpFieldVisits, i as useVpFieldPhotos, n as openFieldPhoto, r as uploadFieldPhoto } from "./vp-field-CDqchrKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/field-inspections._visitId-Bsol8yZB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function inspectionReadiness(error) {
	if (!error) return {
		state: "available",
		message: "Inspection access RPC responded.",
		action: "Inspect the returned edit/submission permission flags before enabling controls."
	};
	const e = error && typeof error === "object" ? error : null;
	const code = typeof e?.code === "string" ? e.code : "";
	const message = typeof e?.message === "string" ? e.message : String(error ?? "Unknown error");
	if (code === "PGRST202" || /could not find the function.*schema cache/i.test(message)) return {
		state: "missing",
		message: "P0 inspection-access function is not available to the API.",
		action: "Run sql/p7/00_BACKEND_READINESS_READONLY.sql in your actual Supabase project. If missing, review and install P0, then P1, in staging first; refresh the PostgREST schema cache."
	};
	if (code === "42501" || /permission denied|jwt expired|not authenticated|not authorized/i.test(message)) return {
		state: "restricted",
		message: "Inspection access was denied.",
		action: "Verify the signed-in user, authenticated EXECUTE grant, organization and role assignment. Do not bypass server permissions or disable RLS."
	};
	if (/visit not found|visit view permission denied|not found in your organization/i.test(message)) return {
		state: "visit-denied",
		message: "The visit is not available to this user.",
		action: "Verify visit assignment and tenant membership. Do not grant access solely to make the screen editable."
	};
	return {
		state: "other-error",
		message: "Inspection access check failed.",
		action: `Review the Supabase API logs. ${code ? `Code ${code}. ` : ""}${message.slice(0, 350)}`
	};
}
var PROVENANCE_KEY = "__vp_field_sources_v1";
function loadProvenance(raw) {
	try {
		const parsed = JSON.parse(raw["__vp_field_sources_v1"] ?? "{}");
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {}
	return {};
}
function caseInspectionCandidates(c) {
	if (!c) return [];
	const values = [];
	const add = (field, value, detail) => {
		if (value.trim()) values.push({
			field,
			value,
			source: "Case master",
			detail
		});
	};
	add("owner_name", c.customer, "Borrower name only — verify whether borrower is the actual owner");
	add("site_address", c.property, "Case address — confirm at site");
	const type = {
		House: "Resi",
		Flat: "Resi",
		Commercial: "Com",
		Land: "Land"
	};
	if (type[c.propertyType]) add("property_type", type[c.propertyType] ?? "", `Case property category: ${c.propertyType}`);
	if (c.propertyType === "Land") add("roof_type", "Vacant Plot", "From case property category; inspect before confirming");
	return values;
}
function proposeValue(previous, field, value, source, detail, now) {
	const provenance = {
		...loadProvenance(previous),
		[field]: {
			source,
			detail,
			confirmed_at: now
		}
	};
	return {
		...previous,
		[field]: value,
		[PROVENANCE_KEY]: JSON.stringify(provenance)
	};
}
function VpInspectionSourceReview({ caseNum, values, canEdit, hasUnsavedChanges = false, onApply }) {
	const cases = useVpCases();
	const docs = useVpCaseDocuments(caseNum);
	const c = cases.allCases.find((row) => row.caseNum === caseNum);
	const caseCandidates = (0, import_react.useMemo)(() => caseInspectionCandidates(c), [c]);
	const availableFields = inspectionSections.filter((s) => s.id !== "photographs").flatMap((s) => s.fields).filter((x) => x.type !== "date");
	const [selectedField, setSelectedField] = (0, import_react.useState)("owner_name");
	const [selectedDoc, setSelectedDoc] = (0, import_react.useState)("");
	const [activity, setActivity] = (0, import_react.useState)({
		busy: false,
		unsaved: false
	});
	const [transcribed, setTranscribed] = (0, import_react.useState)("");
	const provenance = loadProvenance(values);
	const doc = selectedDoc ? (docs.data ?? []).find((d) => d.id === selectedDoc) : preferredOcrDocument(docs.data ?? [], selectedDoc);
	(0, import_react.useEffect)(() => {
		if (!selectedDoc && doc) setSelectedDoc(doc.id);
	}, [selectedDoc, doc?.id]);
	const sourcePath = doc?.storage_path;
	function applyManual() {
		const value = transcribed.trim();
		if (!doc || !sourcePath || !value || !canEdit) {
			toast.error("Select a registered document and enter its observed value");
			return;
		}
		const field = availableFields.find((x) => x.key === selectedField);
		if (!field) {
			toast.error("Unsupported target field");
			return;
		}
		if (field.type === "choice" && !(field.options ?? []).includes(value)) {
			toast.error("Value must match an available option");
			return;
		}
		if (field.type === "number" && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
			toast.error("Enter a valid non-negative number");
			return;
		}
		onApply(selectedField, value, `Document ${doc.id}: ${doc.name}`, "Manually transcribed and accepted after inspecting the registered document");
		setTranscribed("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center gap-2 text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), " Source review & accepted values"]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "OCR from PDFs/images is free and processed locally. Previously saved OCR can be viewed in read-only mode when the server permits document access. OCR is NOT verified title, area or valuation evidence; accepting a mapped field requires editing permission and confirmation."
			}),
			!canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded border border-amber-300 p-2 text-xs",
				children: "Inspection editing is disabled. Document selection and saved OCR review are read-only; no OCR value will be added to the inspection until the server authorizes editing."
			}),
			cases.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-amber-700",
				children: ["Case suggestions unavailable: ", cases.error.message]
			}),
			caseCandidates.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 rounded border p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-44 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: availableFields.find((x) => x.key === candidate.field)?.label ?? candidate.field }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: candidate.value }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								candidate.source,
								" · ",
								candidate.detail
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					disabled: !canEdit,
					onClick: () => onApply(candidate.field, candidate.value, candidate.source, candidate.detail),
					children: values[candidate.field] ? "Use instead" : "Accept suggestion"
				})]
			}, candidate.field)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Manually record a document value" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Inspect a source document first; transcription is a human action, not AI extraction."
					}),
					docs.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-amber-700",
						children: ["Document list unavailable: ", docs.error.message]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target field" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedField,
							onValueChange: setSelectedField,
							disabled: !canEdit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableFields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: field.key,
								children: field.label
							}, field.key)) })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Registered source document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: doc?.id ?? "",
							onValueChange: (id) => {
								if (activity.busy) return;
								if (activity.unsaved && !window.confirm("Discard the unconfirmed local extraction and switch documents?")) return;
								setSelectedDoc(id);
								setTranscribed("");
								setActivity({
									busy: false,
									unsaved: false
								});
							},
							disabled: docs.isLoading || !!docs.error || activity.busy,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose document" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (docs.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: d.id,
								children: d.name
							}, d.id)) })]
						})] })]
					}),
					sourcePath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => void openVpDocument(sourcePath).catch((e) => toast.error(String(e))),
						children: "View source securely"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Value confirmed from document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: transcribed,
						onChange: (e) => setTranscribed(e.target.value),
						disabled: !canEdit,
						placeholder: "Only a value you actually verified"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !canEdit || !doc || !sourcePath || !transcribed.trim(),
						onClick: applyManual,
						children: "Accept with provenance"
					})
				]
			}),
			doc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpDocumentOcr, {
				document: doc,
				caseNum,
				canAccept: canEdit,
				existingValues: values,
				onAccept: onApply,
				onActivity: setActivity
			}, `${caseNum}:${doc.id}`),
			Object.entries(provenance).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
						" ",
						hasUnsavedChanges ? "Accepted locally — not yet verified saved" : "Accepted sources in loaded inspection"
					]
				}), Object.entries(provenance).map(([key, item]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border px-3 py-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [availableFields.find((x) => x.key === key)?.label ?? key, ":"] }),
						" ",
						item.source,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [" · ", item.confirmed_at]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: item.detail
						})
					]
				}, key))]
			})
		]
	})] });
}
/** Visual aid from entered measurements and site boundaries; not a certified survey. */
function VpPlotSketch({ values }) {
	const read = (key) => String(values[key] ?? "").trim();
	const x = Number(read("land_length")), y = Number(read("land_breadth"));
	const measured = Number.isFinite(x) && x > 0 && Number.isFinite(y) && y > 0;
	const width = 210 * (measured ? Math.max(.6, Math.min(1.8, x / y)) : 1.25), height = 210;
	const left = 340 - width / 2, top = 96;
	const frontage = read("plot_facing");
	const boundary = (direction) => read(`boundary_${direction}_site`) || "Not verified";
	const label = (s) => s.length > 36 ? s.slice(0, 33) + "…" : s;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Indicative plot sketch"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 680 380",
			role: "img",
			"aria-label": "Indicative property boundaries diagram, not to scale",
			className: "w-full max-w-3xl rounded border bg-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: left,
					y: top,
					width,
					height,
					fill: "#e2e8f0",
					stroke: "#334155",
					strokeWidth: "3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "183",
					textAnchor: "middle",
					fontSize: "17",
					fill: "#0f172a",
					children: "Plot (not to scale)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "209",
					textAnchor: "middle",
					fontSize: "13",
					fill: "#334155",
					children: measured ? `${x} × ${y} ${read("measurement_unit") || "Feet"}` : "Measurements not verified"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "230",
					textAnchor: "middle",
					fontSize: "13",
					fill: "#334155",
					children: `Facing: ${frontage || "Not confirmed"}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "52",
					textAnchor: "middle",
					fontSize: "14",
					fill: "#0f172a",
					children: "NORTH"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "73",
					textAnchor: "middle",
					fontSize: "12",
					fill: "#334155",
					children: label(boundary("north"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "341",
					textAnchor: "middle",
					fontSize: "14",
					fill: "#0f172a",
					children: "SOUTH"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "340",
					y: "360",
					textAnchor: "middle",
					fontSize: "12",
					fill: "#334155",
					children: label(boundary("south"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "74",
					y: "173",
					textAnchor: "middle",
					fontSize: "14",
					fill: "#0f172a",
					children: "WEST"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "74",
					y: "197",
					textAnchor: "middle",
					fontSize: "12",
					fill: "#334155",
					children: label(boundary("west"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "605",
					y: "173",
					textAnchor: "middle",
					fontSize: "14",
					fill: "#0f172a",
					children: "EAST"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "605",
					y: "197",
					textAnchor: "middle",
					fontSize: "12",
					fill: "#334155",
					children: label(boundary("east"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M620 95 L620 45 M620 45 L612 57 M620 45 L628 57",
					fill: "none",
					stroke: "#111827",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "620",
					y: "33",
					textAnchor: "middle",
					fontSize: "14",
					fill: "#111827",
					children: "N"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-3 grid gap-2 text-sm sm:grid-cols-2",
			children: [
				[
					"north",
					"south",
					"east",
					"west"
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-medium capitalize",
						children: d
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "break-words text-muted-foreground",
						children: boundary(d)
					})]
				}, d)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "font-medium",
					children: "Measurements"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: measured ? `${x} × ${y} ${read("measurement_unit") || "Feet"}` : "Not verified" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "font-medium",
					children: "Facing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: frontage || "Not confirmed" })] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-muted-foreground",
			children: "Indicative only; no survey coordinates or certified dimensions are inferred. The Excel export contains an editable native drawing with the same field labels."
		})
	] })] });
}
/** Fill the user's original 60-row workbook. No values or images are invented. */
var EXCEL_CELL_MAP = {
	visit_date: "C2",
	ownership_type: "C3",
	geotag_remarks: "G3",
	owner_name: "C4",
	identified_through: "C6",
	property_type: "D8",
	site_address: "D9",
	occupancy: "D10",
	occupant_names: "D11",
	rent_per_unit: "D12",
	property_demarcated: "D15",
	structure_type: "D17",
	roof_type: "F17",
	property_usage: "D18",
	apartment_floor: "D19",
	locality_type: "D20",
	vicinity: "D21",
	building_specifications: "D23",
	amenities: "D24",
	building_dimensions_note: "D26",
	plot_sketch_note: "D27",
	setback_front_plan: "D39",
	setback_front_actual: "F39",
	setback_front_remarks: "H39",
	setback_left_side_plan: "D40",
	setback_left_side_actual: "F40",
	setback_left_side_remarks: "H40",
	setback_right_side_plan: "D41",
	setback_right_side_actual: "F41",
	setback_right_side_remarks: "H41",
	setback_rear_plan: "D42",
	setback_rear_actual: "F42",
	setback_rear_remarks: "H42",
	floor_area_0: "D45",
	floor_area_1: "E45",
	floor_area_2: "F45",
	floor_area_3: "G45",
	floor_area_4: "H45",
	floor_area_5: "E46",
	recommended_construction_value: "D47",
	boundary_east_deed: "D50",
	boundary_west_deed: "E50",
	boundary_north_deed: "F50",
	boundary_south_deed: "H50",
	boundary_east_site: "D51",
	boundary_west_site: "E51",
	boundary_north_site: "F51",
	boundary_south_site: "H51",
	boundary_east_match: "D52",
	boundary_west_match: "E52",
	boundary_north_match: "F52",
	boundary_south_match: "H52",
	land_rate_reference: "D59"
};
function val(v, key) {
	return String(v[key] ?? "").trim();
}
function dateDisplay(s) {
	const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
}
function dims(v, type) {
	const l = val(v, `${type}_length`), b = val(v, `${type}_breadth`), unit = val(v, "measurement_unit") || "Feet";
	return l && b ? `${l} × ${b} ${unit}` : val(v, `${type}_dimensions_note`);
}
function inspectionWorkbookCells(values, photoNames) {
	const cells = {};
	for (const [key, cell] of Object.entries(EXCEL_CELL_MAP)) cells[cell] = val(values, key);
	cells["C2"] = dateDisplay(val(values, "visit_date"));
	cells["G2"] = val(values, "utility_bill_verified") === "Yes" ? val(values, "utility_bill_type") : "Not verified / " + val(values, "utility_bill_verified");
	cells["D5"] = [
		val(values, "inspection_contact"),
		val(values, "inspection_contact_mobile"),
		val(values, "inspection_contact_relation")
	].filter(Boolean).join(" / ");
	cells["D13"] = [val(values, "property_age") && `${val(values, "property_age")} years`, val(values, "completion_percent") && `${val(values, "completion_percent")}% complete`].filter(Boolean).join(" · ");
	cells["D14"] = val(values, "floorwise_completion") || Array.from({ length: 6 }, (_, i) => val(values, `floor_completion_${i}`) ? `${i}: ${val(values, `floor_completion_${i}`)}%` : "").filter(Boolean).join(", ");
	cells["D16"] = [
		val(values, "block_count") && `${val(values, "block_count")} blocks`,
		val(values, "floor_count") && `${val(values, "floor_count")} floors`,
		val(values, "unit_count") && `${val(values, "unit_count")} units`
	].filter(Boolean).join(" / ");
	cells["D22"] = [val(values, "approach_road"), val(values, "approach_road_width") && `Width ${val(values, "approach_road_width")}`].filter(Boolean).join(" / ");
	cells["D25"] = dims(values, "land");
	cells["D26"] = dims(values, "building");
	for (const [row, group] of inspectionRiskGroups.entries()) {
		const cols = [
			"D",
			"E",
			"G"
		];
		for (const [i, item] of group.items.entries()) {
			const answer = val(values, item.key);
			cells[`${cols[i]}${54 + row}`] = `${answer === "Yes" ? "☑" : "☐"} ${item.label}${answer === "Not checked" ? " (not checked)" : ""}`;
		}
	}
	const categories = new Set(photoNames.map(inspectionPhotoCategoryFromName).filter((x) => !!x));
	cells["B60"] = "Photographs: " + inspectionPhotoSlots.map((slot) => `${categories.has(slot.key) ? "☑" : "☐"} ${slot.label}`).join(", ");
	return cells;
}
function escapeXml(v) {
	return v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function replaceCell(xml, cell, text) {
	const rx = new RegExp(`<c\\s+r="${cell}"([^>]*?)(?:\\s*/>|>[\\s\\S]*?<\\/c>)`);
	const match = xml.match(rx);
	if (!match) throw new Error(`Workbook template changed: cell ${cell} unavailable`);
	const style = match[1]?.match(/\bs="\d+"/)?.[0] ?? "";
	return xml.replace(rx, `<c r="${cell}" ${style} t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`);
}
function diagramShapes(v) {
	const E = 6800;
	const f = (n) => Math.round(n * E);
	let next = 3;
	const rect = (name, text, x, y, w, h, bg, stroke) => {
		const id = next++;
		const lines = text.split("\n").slice(0, 4).map((line) => `<a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-IN" sz="900" dirty="0"><a:solidFill><a:srgbClr val="222222"/></a:solidFill></a:rPr><a:t>${escapeXml(line.slice(0, 90))}</a:t></a:r></a:p>`).join("");
		return `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id}" name="${escapeXml(name)}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="${f(x)}" y="${f(y)}"/><a:ext cx="${f(w)}" cy="${f(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${bg}"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="${stroke}"/></a:solidFill></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="square" anchor="ctr"/><a:lstStyle/>${lines}</xdr:txBody></xdr:sp>`;
	};
	const north = val(v, "boundary_north_site"), south = val(v, "boundary_south_site"), east = val(v, "boundary_east_site"), west = val(v, "boundary_west_site");
	const plot = val(v, "plot_facing") || "Not confirmed";
	const body = [
		rect("Title", "Indicative plot sketch — NOT TO SCALE", 0, 5, 1e3, 38, "FFFFFF", "FFFFFF"),
		rect("North", `NORTH\n${north || "Not entered"}`, 285, 55, 430, 83, "EFF6FF", "B8C4D6"),
		rect("West", `WEST\n${west || "Not entered"}`, 28, 151, 205, 143, "F8FAFC", "CBD5E1"),
		rect("Plot", `PLOT\n${dims(v, "land") || "Dimensions not verified"}\nFacing: ${plot}`, 286, 151, 428, 143, "E2E8F0", "334155"),
		rect("East", `EAST\n${east || "Not entered"}`, 768, 151, 205, 143, "F8FAFC", "CBD5E1"),
		rect("South", `SOUTH\n${south || "Not entered"}`, 285, 308, 430, 83, "EFF6FF", "B8C4D6")
	].join("");
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>3</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>26</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>8</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>37</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="2" name="Inspection sketch"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${f(1e3)}" cy="${f(430)}"/><a:chOff x="0" y="0"/><a:chExt cx="${f(1e3)}" cy="${f(430)}"/></a:xfrm></xdr:grpSpPr>${body}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>`;
}
function insertDrawing(parts, values) {
	const sheet = "xl/worksheets/sheet1.xml", rel = "xl/worksheets/_rels/sheet1.xml.rels", draw = "xl/drawings/drawing1.xml";
	if (parts[draw]) throw new Error("Template already contains a drawing. Export cancelled to avoid overwriting it.");
	let xml = strFromU8(parts[sheet]);
	if (/<drawing\s/.test(xml)) throw new Error("Template already references a drawing. Export cancelled.");
	if (!xml.includes("xmlns:r=")) xml = xml.replace("<worksheet ", "<worksheet xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" ");
	xml = xml.replace("</worksheet>", "<drawing r:id=\"rIdP1Sketch\"/></worksheet>");
	parts[sheet] = strToU8(xml);
	const relationship = "<Relationship Id=\"rIdP1Sketch\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing\" Target=\"../drawings/drawing1.xml\"/>";
	if (parts[rel]) {
		const previous = strFromU8(parts[rel]);
		if (previous.includes("rIdP1Sketch")) throw new Error("Duplicate drawing relationship");
		parts[rel] = strToU8(previous.replace("</Relationships>", "<Relationship Id=\"rIdP1Sketch\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing\" Target=\"../drawings/drawing1.xml\"/></Relationships>"));
	} else parts[rel] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationship}</Relationships>`);
	const contentTypes = "[Content_Types].xml";
	const typeXml = strFromU8(parts[contentTypes]);
	parts[contentTypes] = strToU8(typeXml.replace("</Types>", "<Override PartName=\"/xl/drawings/drawing1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.drawing+xml\"/></Types>"));
	parts[draw] = strToU8(diagramShapes(values));
}
function fillInspectionWorkbook(template, values, photoNames) {
	const parts = unzipSync(template);
	const sheet = "xl/worksheets/sheet1.xml";
	if (!parts[sheet] || !parts["[Content_Types].xml"]) throw new Error("Not the expected Valuation Report template");
	let xml = strFromU8(parts[sheet]);
	for (const [ref, value] of Object.entries(inspectionWorkbookCells(values, photoNames))) xml = replaceCell(xml, ref, value);
	parts[sheet] = strToU8(xml);
	insertDrawing(parts, values);
	return zipSync(parts, { level: 6 });
}
async function downloadInspectionWorkbook(visitId, values, photos) {
	const response = await fetch("/templates/Valuation_Report.xlsx", { cache: "no-store" });
	if (!response.ok) throw new Error("Original report template not found. Check public/templates/Valuation_Report.xlsx");
	const bytes = fillInspectionWorkbook(new Uint8Array(await response.arrayBuffer()), values, photos);
	const blob = new Blob([new Uint8Array(bytes)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const url = URL.createObjectURL(blob);
	try {
		const a = document.createElement("a");
		a.href = url;
		a.download = `Valuation_Report_Visit_${visitId}.xlsx`;
		document.body.append(a);
		a.click();
		a.remove();
	} finally {
		setTimeout(() => URL.revokeObjectURL(url), 3e3);
	}
}
/** Case-master corrections are separate from the visit report, and never auto-overwrite evidence. */
function VpFieldCaseEditor({ visitId, caseNum, canEdit, isAssigned }) {
	const { tenant } = useApp();
	const { allCases } = useVpCases();
	const client = useQueryClient();
	const master = allCases.find((c) => c.caseNum === caseNum);
	const [customer, setCustomer] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!dirty && master) {
			setCustomer(master.customer);
			setAddress(master.property);
		}
	}, [
		master?.customer,
		master?.property,
		dirty
	]);
	async function save() {
		if (!canEdit || !isAssigned || busy) return;
		if (customer.trim().length < 2 || address.trim().length < 5) {
			toast.error("Customer and site address are required");
			return;
		}
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_p9_field_update_case", {
				p_visit_id: visitId,
				p_customer: customer.trim(),
				p_site_address: address.trim()
			});
			if (error) throw error;
			await client.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] });
			setDirty(false);
			toast.success("Assigned case details updated and audited");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
		className: "pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Assigned case details"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Customer and property address can be corrected until submission. This updates the case master, not the Excel report. Bank, officer assignment and QC controls are managed separately."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "p9-customer",
					children: "Customer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "p9-customer",
					value: customer,
					disabled: !canEdit || !isAssigned || busy,
					onChange: (e) => {
						setCustomer(e.target.value);
						setDirty(true);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "p9-address",
					children: "Property / site address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "p9-address",
					value: address,
					disabled: !canEdit || !isAssigned || busy,
					onChange: (e) => {
						setAddress(e.target.value);
						setDirty(true);
					}
				})]
			}),
			dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-amber-700",
				children: "Unsaved case-master changes are separate from inspection autosave."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full sm:w-auto",
				onClick: () => void save(),
				disabled: !canEdit || !isAssigned || !dirty || busy,
				children: busy ? "Saving…" : "Save case details"
			})
		]
	})] });
}
var mapFields = (section) => new Map(section.fields.map((f) => [f.key, f]));
var setbacks = [
	["Front", "front"],
	["Side1 (Left)", "left_side"],
	["Side2 (Right)", "right_side"],
	["Rear", "rear"]
];
var floors = [
	["Stilt /Base", "0"],
	["Ground", "1"],
	["First", "2"],
	["Second", "3"],
	["3rd", "4"],
	["4th", "5"]
];
var directions = [
	"East",
	"West",
	"North",
	"South"
];
function parseVoiceDate(spoken) {
	const text = spoken.trim();
	const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	const dmy = text.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
	const year = Number(iso?.[1] ?? dmy?.[3]), month = Number(iso?.[2] ?? dmy?.[2]), day = Number(iso?.[3] ?? dmy?.[1]);
	if (!year || !month || !day) return null;
	const date = new Date(Date.UTC(year, month - 1, day));
	if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function FieldControl({ field, value, onChange, disabled, lang, compact = false }) {
	const id = `inspection-${field.key}`;
	const [voiceProposal, setVoiceProposal] = (0, import_react.useState)(null);
	const spoken = (text) => {
		if (field.type === "number") {
			const n = spokenNumber(text);
			if (n === null) {
				toast.error(`Unrecognized numeric entry: ${text}. Enter manually.`);
				return;
			}
			setVoiceProposal(n);
			return;
		}
		if (field.type === "date") {
			const date = parseVoiceDate(text);
			if (!date) {
				toast.error("Say date DD/MM/YYYY or YYYY-MM-DD, or enter it manually.");
				return;
			}
			setVoiceProposal(date);
			return;
		}
		onChange(value ? `${value} ${text}` : text);
	};
	const options = field.options ?? [];
	const choices = value && !options.includes(value) ? [...options, value] : options;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 space-y-1",
		children: [
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor: id,
				className: "text-sm font-medium leading-5",
				children: [
					field.label,
					field.required ? " *" : "",
					field.unit ? ` (${field.unit})` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-start gap-1",
				children: [field.type === "choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value,
					onValueChange: onChange,
					disabled,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						id,
						className: "min-h-11 min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: choices.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: opt,
						children: opt
					}, opt)) })]
				}) : field.type === "longtext" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id,
					value,
					onChange: (e) => onChange(e.target.value),
					disabled,
					rows: compact ? 2 : 3,
					className: "min-h-11 lg:min-h-8 min-w-0 flex-1 text-base md:text-sm"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id,
					value,
					onChange: (e) => onChange(e.target.value),
					disabled,
					type: field.type === "date" ? "date" : field.type === "number" ? "number" : "text",
					min: field.type === "number" ? "0" : void 0,
					step: field.type === "number" ? "any" : void 0,
					className: "min-h-11 lg:min-h-8 min-w-0 flex-1 text-base md:text-sm"
				}), field.type === "choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
					label: field.label,
					lang,
					options: choices,
					disabled,
					onSelect: setVoiceProposal
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
					label: field.label,
					lang,
					disabled,
					onTranscript: spoken
				})]
			}),
			voiceProposal !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-amber-400 bg-amber-50 p-2 text-xs text-slate-900",
				role: "status",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [
							"Verify recognized ",
							field.type === "number" ? "measurement / numeric value" : field.type === "choice" ? "option" : "date",
							field.unit ? ` (${field.unit})` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "break-words py-1 font-semibold",
						children: voiceProposal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							onClick: () => {
								onChange(voiceProposal);
								setVoiceProposal(null);
							},
							disabled,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 size-3" }), "Accept"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							onClick: () => setVoiceProposal(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 size-3" }), "Discard"]
						})]
					})
				]
			})
		]
	});
}
function InspectionSectionView({ section, values, onChange, disabled, lang }) {
	const byKey = mapFields(section);
	const field = (key, compact = false) => {
		const f = byKey.get(key);
		if (!f) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldControl, {
			field: f,
			value: values[key] ?? "",
			onChange: (v) => onChange(key, v),
			disabled,
			lang,
			compact
		});
	};
	let content;
	if (section.layout === "setbacks") content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden md:block overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[750px] border-collapse text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "bg-muted/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border p-2 text-left",
						children: "Setbacks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border p-2 text-left",
						children: "As per plan/ Bye laws"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border p-2 text-left",
						children: "Actual at site"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border p-2 text-left",
						children: "Remarks, if any"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: setbacks.map(([name, key]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "border p-2 text-left font-medium",
				children: name
			}), [
				"plan",
				"actual",
				"remarks"
			].map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "border p-2 align-top",
				children: field(`setback_${key}_${part}`, true)
			}, part))] }, key)) })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 md:hidden",
		children: setbacks.map(([name, key]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border p-3 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-semibold text-sm",
				children: name
			}), [
				"plan",
				"actual",
				"remarks"
			].map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: field(`setback_${key}_${part}`) }, part))]
		}, key))
	})] });
	else if (section.layout === "floor_area") content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "min-w-[920px] w-full border-collapse text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "border p-2 text-left",
							children: "Areas"
						}), floors.map(([name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "border p-2 text-left",
							children: name
						}, name))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "border p-2 text-left",
						children: "Actual (Sqft)"
					}), floors.map(([, idx]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "border p-2",
						children: field(`floor_area_${idx}`, true)
					}, idx))] }) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:hidden",
				children: floors.map(([name, idx]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-sm mb-2",
						children: name
					}), field(`floor_area_${idx}`)]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-md",
				children: field("recommended_construction_value")
			})
		]
	});
	else if (section.layout === "boundaries") content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden md:block overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[900px] border-collapse text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "bg-muted/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border p-2 text-left",
					children: "Boundaries"
				}), directions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border p-2 text-left",
					children: d
				}, d))]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
				["As per deed", "deed"],
				["At site", "site"],
				["Boundaries Matching", "match"]
			].map(([label, suffix]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "border p-2 text-left font-medium",
				children: label
			}), directions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "border p-2 align-top",
				children: field(`boundary_${d.toLowerCase()}_${suffix}`, true)
			}, d))] }, suffix)) })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 md:hidden",
		children: directions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border p-3 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-semibold text-sm",
				children: d
			}), [
				"deed",
				"site",
				"match"
			].map((suffix) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: field(`boundary_${d.toLowerCase()}_${suffix}`) }, suffix))]
		}, d))
	})] });
	else if (section.layout === "observations") content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [inspectionRiskGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "mb-3 text-sm font-semibold",
				children: group.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: group.items.map((item) => {
					const f = byKey.get(item.key);
					return f ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldControl, {
						field: f,
						value: values[item.key] ?? "",
						onChange: (v) => onChange(item.key, v),
						disabled,
						lang
					}, item.key) : null;
				})
			})]
		}, group.title)), field("risk_remarks")]
	});
	else content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: section.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldControl, {
			field: f,
			value: values[f.key] ?? "",
			onChange: (v) => onChange(f.key, v),
			disabled,
			lang
		}, f.key))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		id: `inspection-${section.id}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: section.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: ["Excel source: ", section.source]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [content, section.layout === "photos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Notes do not count as evidence. Use the category-specific capture controls immediately below to upload actual private photos."
			})]
		})]
	});
}
function VpInspectionForm({ visitId, canEdit, canSubmit = false, canManage = false, canCapture = false, productType, editReason }) {
	const { tenant } = useApp();
	const queryClient = useQueryClient();
	const [lang, setLang] = (0, import_react.useState)("en-IN");
	const [mobileStep, setMobileStep] = (0, import_react.useState)(0);
	const [values, setValues] = (0, import_react.useState)({});
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [supplementPending, setSupplementPending] = (0, import_react.useState)(false);
	const [supplementReset, setSupplementReset] = (0, import_react.useState)(0);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("idle");
	const [saveError, setSaveError] = (0, import_react.useState)("");
	const editRevision = (0, import_react.useRef)(0);
	const expectedUpdatedAt = (0, import_react.useRef)(null);
	const lastAutoErrorRevision = (0, import_react.useRef)(null);
	const [managerReason, setManagerReason] = (0, import_react.useState)("");
	const [uploadingCategory, setUploadingCategory] = (0, import_react.useState)(null);
	const visits = useVpFieldVisits();
	const photos = useVpFieldPhotos(visitId);
	const currentVisit = (visits.data ?? []).find((v) => String(v.id) === String(visitId));
	const requiredPhotoKeys = inspectionRequiredPhotoSlots(productType);
	const categoryLookup = new Map(inspectionPhotoSlots.map((slot) => [slot.key, (photos.data ?? []).filter((p) => inspectionPhotoCategoryFromName(p.name) === slot.key)]));
	const missingPhotos = requiredPhotoKeys.filter((key) => (categoryLookup.get(key)?.length ?? 0) === 0);
	const reportQuery = useQuery({
		queryKey: [
			"vp-inspection",
			tenant.id,
			visitId
		],
		enabled: !!visitId,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_inspection_get", { p_visit_id: visitId });
			if (error) throw error;
			const raw = data ?? {};
			return {
				data: raw.data ?? {},
				status: raw.status ?? "Not started",
				...raw.updated_at !== void 0 ? { updated_at: raw.updated_at } : {},
				...raw.submitted_at !== void 0 ? { submitted_at: raw.submitted_at } : {},
				...raw.can_edit !== void 0 ? { can_edit: raw.can_edit } : {}
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (!dirty && reportQuery.data) {
			setValues(reportQuery.data.data ?? {});
			expectedUpdatedAt.current = reportQuery.data.updated_at ?? null;
		}
	}, [reportQuery.data, dirty]);
	(0, import_react.useEffect)(() => {
		const warn = (event) => {
			if (dirty || saving || supplementPending) {
				event.preventDefault();
				event.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [
		dirty,
		saving,
		supplementPending
	]);
	const report = reportQuery.data;
	const stepCount = inspectionSections.length;
	const stepSection = inspectionSections[mobileStep] ?? inspectionSections[0];
	const editable = canEdit && (report?.can_edit ?? report?.status !== "Submitted");
	const filled = (0, import_react.useMemo)(() => inspectionSections.flatMap((s) => s.fields).filter((f) => String(values[f.key] ?? "").trim()).length, [values]);
	const total = inspectionSections.reduce((n, s) => n + s.fields.length, 0);
	const missing = missingInspectionFields(values);
	function setValue(key, value) {
		editRevision.current++;
		setDirty(true);
		setSaveStatus("idle");
		setSaveError("");
		setValues((old) => {
			const sources = { ...loadProvenance(old) };
			delete sources[key];
			return {
				...old,
				[key]: value,
				[PROVENANCE_KEY]: JSON.stringify(sources)
			};
		});
	}
	function acceptCandidate(field, value, source, detail) {
		editRevision.current++;
		setDirty(true);
		setSaveStatus("idle");
		setSaveError("");
		setValues((old) => proposeValue(old, field, value, source, detail, (/* @__PURE__ */ new Date()).toISOString()));
	}
	async function save(submit, auto = false) {
		if (canManage && submit) {
			toast.error("Manager corrections cannot submit on behalf of the assigned officer");
			return;
		}
		if (canManage && managerReason.trim().length < 10) {
			toast.error("Enter a correction reason (minimum 10 characters)");
			return;
		}
		if (!editable) {
			toast.error("Inspection is read-only");
			return;
		}
		if (submit && sketchSubmissionError(values["__vp_p22_sketch_v1"])) {
			toast.error(sketchSubmissionError(values[P22_KEY]));
			return;
		}
		if (submit && supplementPending) {
			toast.error("Apply or discard supplemental data before submission");
			return;
		}
		if (submit && !canSubmit) {
			toast.error("Submit only after site visit check-in or completion");
			return;
		}
		if (submit && missing.length) {
			toast.error(`Complete ${missing.length} mandatory inspection field(s): ${missing.slice(0, 5).join(", ")}`);
			return;
		}
		if (submit && photos.data && photos.data.length < Math.max(8, currentVisit?.min_photos ?? 8)) {
			toast.error("At least eight registered photographs (or the configured visit minimum) are required");
			return;
		}
		if (submit && missingPhotos.length) {
			toast.error(`Missing photo categories: ${missingPhotos.join(", ")}`);
			return;
		}
		if (submit && !window.confirm("Submit and lock this inspection? Check dictated dimensions, boundaries and photos first.")) return;
		const savedRevision = editRevision.current;
		const savedValues = { ...values };
		setSaving(true);
		setSaveStatus("saving");
		setSaveError("");
		try {
			const { data, error } = await vpDb.rpc("vp_p1_inspection_save", {
				p_visit_id: visitId,
				p_data: savedValues,
				p_expected_updated_at: expectedUpdatedAt.current,
				p_submit: submit,
				p_reason: canManage ? managerReason : null
			});
			if (error) throw error;
			if (!data || typeof data !== "object" || typeof data.updated_at !== "string") throw new Error("Save succeeded but response lacks updated_at; reload to avoid version conflict");
			expectedUpdatedAt.current = data.updated_at;
			setSaveStatus("verifying");
			const { data: readback, error: readbackError } = await vpDb.rpc("vp_inspection_get", { p_visit_id: visitId });
			if (readbackError) throw new Error(`Save RPC succeeded but server readback failed: ${readbackError.message}. Your changes remain visible; check before retrying.`);
			const verified = verifyInspectionReadback(savedValues, readback, submit);
			if (!verified.verified) throw new Error(`Save RPC succeeded but verification failed: ${verified.reason} Review before retrying.`);
			if (savedRevision === editRevision.current || submit) setDirty(false);
			if (canManage && savedRevision === editRevision.current) setManagerReason("");
			setSaveStatus(savedRevision === editRevision.current ? "saved" : "idle");
			lastAutoErrorRevision.current = null;
			await queryClient.invalidateQueries({ queryKey: [
				"vp-inspection",
				tenant.id,
				visitId
			] });
			if (!auto) toast.success(submit ? "Inspection submitted and read back" : "Inspection draft saved and read back");
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			setSaveStatus("error");
			setSaveError(message);
			if (auto) lastAutoErrorRevision.current = editRevision.current;
			else toast.error(message);
		} finally {
			setSaving(false);
		}
	}
	(0, import_react.useEffect)(() => {
		if (!dirty || !editable || saving || reportQuery.isLoading || reportQuery.error || reportQuery.isFetching) return;
		if (canManage) return;
		if (lastAutoErrorRevision.current === editRevision.current) return;
		const timer = window.setTimeout(() => {
			save(false, true);
		}, 2e3);
		return () => window.clearTimeout(timer);
	}, [
		dirty,
		values,
		editable,
		saving,
		canManage,
		managerReason,
		reportQuery.isLoading,
		reportQuery.isFetching,
		reportQuery.error
	]);
	async function exportExcel() {
		try {
			await downloadInspectionWorkbook(visitId, values, (photos.data ?? []).map((p) => p.name));
			toast.success(dirty ? "Exported current UNSAVED inspection values" : "Inspection Excel exported");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : String(e));
		}
	}
	async function reloadServerVersion() {
		if ((dirty || supplementPending) && !window.confirm("Discard current unsaved changes and reload the server version?")) return;
		setSupplementPending(false);
		setSupplementReset((v) => v + 1);
		setDirty(false);
		lastAutoErrorRevision.current = null;
		setSaveError("");
		setSaveStatus("idle");
		const result = await reportQuery.refetch();
		if (result.data) {
			setValues(result.data.data ?? {});
			expectedUpdatedAt.current = result.data.updated_at ?? null;
		}
	}
	async function capture(key, file) {
		if (!file || !canCapture || !editable || !currentVisit) return;
		setUploadingCategory(key);
		try {
			const name = `${key}__${file.name.slice(-190)}`;
			const tagged = new File([file], name, {
				type: file.type,
				lastModified: file.lastModified
			});
			await uploadFieldPhoto(tenant.id, currentVisit, tagged);
			await queryClient.invalidateQueries({ queryKey: [
				"vp-field-photos",
				tenant.id,
				visitId
			] });
			await queryClient.invalidateQueries({ queryKey: ["vp-field-visits", tenant.id] });
			toast.success(`${key} photo registered`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : String(e));
		} finally {
			setUploadingCategory(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: tenant.role === "Field Officer" ? "space-y-4 lg:space-y-3 pb-44 md:pb-4" : "space-y-4 lg:space-y-3 pb-28 md:pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Inspection progress" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLanguage, {
							value: lang,
							onChange: setLang
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							filled,
							"/",
							total,
							" fields filled · ",
							report?.status ?? "Loading",
							dirty ? " · Unsaved changes" : ""
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "status",
						"aria-live": "polite",
						className: "rounded border p-2 text-xs",
						children: [
							saveStatus === "saving" ? "Saving securely…" : saveStatus === "verifying" ? "Verifying values and OCR provenance from Supabase…" : saveStatus === "saved" ? "Saved and verified in Supabase" : saveStatus === "error" ? "Save failed — changes retained locally until you retry" : dirty ? canManage ? "Manager correction: enter a reason and click Save Draft" : "Draft changed — autosave starts after 2 seconds" : "No unsaved changes",
							saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-destructive",
								children: [saveError, ". If another user updated this report, review before reloading."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									disabled: reportQuery.isLoading || !!reportQuery.error,
									onClick: () => void exportExcel(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 size-4" }), "Download original Excel"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									disabled: saving || reportQuery.isFetching,
									onClick: () => void reloadServerVersion(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "mr-1 size-4" }), "Reload server data"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Based on the uploaded Excel rows 1–60. Microphones populate editable values only; verify recognized measurements and options. GPS check-in and actual photo evidence remain separate controls."
					}),
					reportQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading inspection..." }),
					reportQuery.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "alert",
						className: "text-destructive",
						children: ["Inspection API: ", reportQuery.error.message]
					}),
					!canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "status",
						className: "text-amber-700",
						children: ["Read-only: ", editReason ?? "Only the assigned officer can edit while the visit is active."]
					}),
					canEdit && report?.can_edit === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-amber-700",
						children: "Inspection already submitted and locked. A Field QC return is required for corrections."
					}),
					canEdit && !canSubmit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Scheduled: draft entry only. Submission and real photo capture require site check-in. Manager corrections always require a reason."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vp-mobile-report-nav space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:hidden",
				"aria-label": "Mobile report sections",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
							children: "Inspection report"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary",
							children: [
								mobileStep + 1,
								" / ",
								stepCount
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold leading-snug",
						children: stepSection.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-muted",
						role: "progressbar",
						"aria-valuemin": 0,
						"aria-valuemax": stepCount,
						"aria-valuenow": mobileStep + 1,
						"aria-label": "Report section progress",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${(mobileStep + 1) / stepCount * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "p14-mobile-step",
						className: "block text-xs text-muted-foreground",
						children: "Choose report section"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "p14-mobile-step",
						className: "min-h-12 w-full rounded-xl border border-input bg-background px-3 text-sm",
						value: mobileStep,
						onChange: (e) => setMobileStep(Number(e.target.value)),
						children: inspectionSections.map((section, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: i,
							children: [
								i + 1,
								". ",
								section.title
							]
						}, section.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "min-h-12",
							disabled: mobileStep === 0,
							onClick: () => {
								setMobileStep((v) => Math.max(0, v - 1));
								window.scrollTo({
									top: 0,
									behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-1 size-4" }), "Previous"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "min-h-12",
							disabled: mobileStep === stepCount - 1,
							onClick: () => {
								setMobileStep((v) => Math.min(stepCount - 1, v + 1));
								window.scrollTo({
									top: 0,
									behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
								});
							},
							children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1 size-4" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							filled,
							" of ",
							total,
							" fields entered. Complete all required fields before submitting."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "Inspection sections",
				className: "hidden rounded-xl border bg-card p-3 md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-sm font-semibold",
					children: "Jump to section"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: inspectionSections.map((section, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `#inspection-${section.id}`,
						className: "rounded-lg border border-border px-3 py-2 text-sm text-primary hover:bg-muted",
						children: [
							i + 1,
							". ",
							section.title
						]
					}, section.id))
				})]
			}),
			currentVisit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: mobileStep === 0 ? "block" : "hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFieldCaseEditor, {
					visitId,
					caseNum: currentVisit.num,
					canEdit: editable,
					isAssigned: !canManage && canEdit
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: mobileStep === 0 ? "block" : "hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpInspectionSourceReview, {
					caseNum: currentVisit?.num ?? 0,
					values,
					canEdit: editable && !saving,
					hasUnsavedChanges: dirty || saving,
					onApply: acceptCandidate
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: mobileStep === 0 ? "block" : "hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP18Supplement, {
					productType,
					raw: values[P18_KEY],
					disabled: !editable || reportQuery.isLoading || !!reportQuery.error,
					onApply: (v) => setValue(P18_KEY, v),
					onPending: setSupplementPending
				}, `${visitId}:${supplementReset}`)
			}),
			inspectionSections.filter((section) => section.id !== "photographs").map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: `inspection-${section.id}`,
				className: mobileStep === inspectionSections.findIndex((x) => x.id === section.id) ? "vp-child-section block" : "vp-child-section hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectionSectionView, {
					section,
					values,
					onChange: setValue,
					disabled: !editable || saving || reportQuery.isLoading || !!reportQuery.error,
					lang
				})
			}, section.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: mobileStep === inspectionSections.findIndex((x) => x.id === "building") ? "block" : "hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP22Sketch, {
						raw: values[P22_KEY],
						disabled: !editable || saving || reportQuery.isLoading || !!reportQuery.error,
						onChange: (v) => setValue(P22_KEY, v)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded-xl border bg-card p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm font-semibold",
							children: "Measurement-based plot preview (not to scale)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpPlotSketch, { values })
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "inspection-photographs",
				className: mobileStep === stepCount - 1 ? "vp-child-section block" : "vp-child-section hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), " 9. Photographs — evidence and notes"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Registered in the private field-evidence bucket. 11 categories include optional Internal 1 from the reference application. Required categories depend on property type; minimum photo count remains controlled by Field QC."
						}),
						photos.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading evidence..." }),
						photos.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-destructive",
							children: ["Photo database error: ", photos.error.message]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: inspectionPhotoSlots.map((slot) => {
								const existing = categoryLookup.get(slot.key) ?? [];
								const latest = existing[0];
								const noteKey = {
									"road": "photo_road",
									"address": "photo_address",
									"front-elevation": "photo_front",
									"side-elevation": "photo_side",
									"internal-2": "photo_internal",
									"kitchen": "photo_kitchen",
									"bills-verified": "photo_bills",
									"selfie-customer": "photo_selfie",
									"dishaank": "photo_dishaank",
									"compass": "photo_compass"
								}[slot.key];
								const noteField = inspectionSections.find((x) => x.id === "photographs")?.fields.find((f) => f.key === noteKey);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded border p-3 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: slot.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													requiredPhotoKeys.includes(slot.key) ? "Required" : "Optional",
													" · ",
													existing.length,
													" file(s)"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [latest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => void openFieldPhoto(latest.storage_path).catch((e) => toast.error(String(e))),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 size-4" }), "View latest"]
											}), canCapture && editable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "vp-upload cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-muted",
												children: [uploadingCategory === slot.key ? "Uploading…" : latest ? "Retake / new version" : "Take / upload photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/jpeg,image/png,image/webp",
													capture: "environment",
													className: "sr-only",
													disabled: uploadingCategory !== null,
													onChange: (e) => {
														const file = e.target.files?.[0];
														e.target.value = "";
														capture(slot.key, file);
													}
												})]
											})]
										}),
										noteKey && noteField && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldControl, {
											field: noteField,
											value: values[noteKey] ?? "",
											onChange: (v) => setValue(noteKey, v),
											disabled: !editable || saving,
											lang
										})
									]
								}, slot.key);
							})
						}),
						(() => {
							const notes = inspectionSections.find((x) => x.id === "photographs")?.fields.find((f) => f.key === "other_notes");
							return notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldControl, {
								field: notes,
								value: values["other_notes"] ?? "",
								onChange: (v) => setValue("other_notes", v),
								disabled: !editable || saving,
								lang
							}) : null;
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Missing required categories: ",
								missingPhotos.length ? missingPhotos.join(", ") : "None",
								". Photos are kept as an audit trail; retake adds a new version instead of deleting old evidence."
							]
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 rounded-lg border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-48 flex-1 text-xs text-muted-foreground",
						children: "Autosave stores drafts after inactivity. Verify every measurement and the saved status before closing; Excel export is not a certified valuation."
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "inspection-correction-reason",
							children: "Manager correction reason (mandatory; audited)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "inspection-correction-reason",
							value: managerReason,
							onChange: (e) => setManagerReason(e.target.value),
							placeholder: "Why are you correcting the assigned officer's draft?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "hidden md:inline-flex",
						variant: "outline",
						disabled: !editable || saving || reportQuery.isLoading || !!reportQuery.error || canManage && managerReason.trim().length < 10,
						onClick: () => void save(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 size-4" }), "Save draft"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "hidden md:inline-flex",
						disabled: !editable || !canSubmit || supplementPending || saving || reportQuery.isLoading || !!reportQuery.error || missing.length > 0 || missingPhotos.length > 0 || photos.isLoading || !!photos.error || (photos.data ?? []).length < Math.max(8, currentVisit?.min_photos ?? 8),
						onClick: () => void save(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 size-4" }), "Submit to Checker"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `vp-mobile-save-bar fixed inset-x-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur md:hidden ${tenant.role === "Field Officer" ? "bottom-[calc(4.5rem+env(safe-area-inset-bottom))]" : "bottom-0"}`,
				"aria-label": "Mobile inspection save actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-center text-xs font-medium text-muted-foreground",
					role: "status",
					"aria-live": "polite",
					children: saveStatus === "saving" || saveStatus === "verifying" ? "Saving and verifying…" : saveStatus === "error" ? "Save failed — retry required" : dirty ? "Unsaved draft changes" : saveStatus === "saved" ? "Saved and verified" : "Report draft"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-lg gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "min-h-12 flex-1",
						variant: "outline",
						disabled: !editable || saving || reportQuery.isLoading || !!reportQuery.error || canManage && managerReason.trim().length < 10,
						onClick: () => void save(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 size-4" }), "Save"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "min-h-12 flex-1",
						disabled: !editable || !canSubmit || supplementPending || saving || reportQuery.isLoading || !!reportQuery.error || missing.length > 0 || missingPhotos.length > 0 || photos.isLoading || !!photos.error || (photos.data ?? []).length < Math.max(8, currentVisit?.min_photos ?? 8),
						onClick: () => void save(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 size-4" }), "Submit to Checker"]
					})]
				})]
			})
		]
	});
}
function FieldInspectionPage() {
	const { visitId } = Route.useParams();
	const { tenant, capabilities } = useApp();
	const visitsQuery = useVpFieldVisits();
	const identity = useQuery({
		queryKey: ["vp-field-self", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_field_my_user_id");
			if (error) throw error;
			if (data == null) throw new Error("No application-user ID mapped to this login");
			return String(data);
		}
	});
	const visit = (visitsQuery.data ?? []).find((v) => String(v.id) === String(visitId));
	const assigned = !!visit && !!identity.data && String(visit.assigned_user_id) === String(identity.data);
	const access = useQuery({
		queryKey: [
			"vp-p0-inspection-access",
			tenant.id,
			visitId
		],
		enabled: !!visit,
		retry: false,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_p0_inspection_access", { p_visit_id: visitId });
			if (error) throw error;
			return data;
		}
	});
	const canEdit = access.data?.can_edit === true && !access.isLoading && !access.error;
	const canSubmit = access.data?.can_submit === true && canEdit;
	const canManage = access.data?.can_manager_save === true && canEdit;
	const canCapture = access.data?.can_capture === true && canEdit;
	const diagnosis = inspectionReadiness(access.error);
	const reason = !visit ? "Visit not found or not accessible to this login" : access.error ? `${diagnosis.message} ${diagnosis.action}` : access.isLoading ? "Checking server-enforced inspection access…" : access.data?.reason ?? "Inspection edit permission is unavailable";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-screen-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					asChild: true,
					children: mayOpenPath("/field-operations", capabilities) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/field-operations",
						search: { view: "visits" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Field visits"]
					}) : mayOpenPath("/qc-checking", capabilities) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/qc-checking",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Quality checking"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Workspace"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Site inspection",
				description: visit ? `Case #${visit.num} · ${visit.status}` : "Inspection details"
			}),
			visitsQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading site visits..." }),
			visitsQuery.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive",
				children: ["Visit API: ", visitsQuery.error.message]
			}),
			identity.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive",
				children: ["Field officer identity: ", identity.error.message]
			}),
			access.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "alert",
				className: "mb-3 space-y-2 rounded border border-amber-400 p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }),
							" Inspection access: ",
							diagnosis.message
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: diagnosis.action }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "Field editing, submission and autosave remain disabled until the server explicitly authorizes them. Saved OCR is separate unverified evidence."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: access.isFetching,
						onClick: () => void access.refetch(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "mr-1 size-4" }), "Retry permission check"]
					})
				]
			}),
			!visitsQuery.isLoading && !visitsQuery.error && !visit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Visit not visible. It must exist under this organization and be accessible to your account." }),
			visit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, {
										className: "size-5 text-primary",
										strokeWidth: 1.65,
										"aria-hidden": "true"
									}),
									"Visit #",
									visit.id,
									" · Case #",
									visit.num
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border px-2 py-1 text-xs font-medium",
								children: visit.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: identity.isLoading || access.isLoading ? "Checking permissions…" : assigned ? "Assigned to this account" : canManage ? "Manager correction access" : "Read-only for this account"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 rounded-lg border bg-card p-3 text-sm",
						role: "status",
						children: [canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, {
							className: "mt-0.5 size-5 shrink-0 text-primary",
							"aria-hidden": "true"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, {
							className: "mt-0.5 size-5 shrink-0 text-muted-foreground",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: canEdit ? canSubmit ? "Full report editable — verify GPS and evidence, then submit to Checker." : "Draft fully editable — complete GPS check-in before submitting." : reason })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpInspectionForm, {
						visitId: visit.id,
						canEdit,
						canSubmit,
						canManage,
						canCapture,
						productType: access.data?.case_product ?? "Unknown",
						editReason: reason
					}, String(visit.id))
				]
			})
		]
	}) });
}
//#endregion
export { FieldInspectionPage as component };
