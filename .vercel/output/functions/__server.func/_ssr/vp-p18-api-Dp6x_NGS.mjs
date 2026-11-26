import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-p18-api-Dp6x_NGS.js
/** ValuationPro-specific bounded template configuration. JSON Forms renders the schema. */
var P18_KEY = "__vp_p18_supplement_v1";
var P18_CATEGORIES = [
	"Land",
	"House",
	"Flat",
	"Commercial"
];
var text = (key, label) => ({
	key,
	label,
	type: "text"
});
var num = (key, label, unit) => ({
	key,
	label,
	type: "number",
	unit
});
var choice = (key, label, options) => ({
	key,
	label,
	type: "choice",
	options
});
var common = [
	text("planning_authority", "Planning authority"),
	text("approval_reference", "Approval / layout reference"),
	text("survey_reference", "Survey / plot reference"),
	text("source_reference", "Measurement or document source reference")
];
var categoryFields = {
	Land: [
		num("deed_extent", "Document land extent", "sq. yd."),
		num("actual_extent", "Actual land extent", "sq. yd."),
		choice("land_use", "Observed land use", [
			"Residential",
			"Commercial",
			"Agricultural",
			"Industrial",
			"Other",
			"Unknown"
		]),
		text("access_rights", "Access / easement observations"),
		text("topography", "Topography and drainage")
	],
	House: [
		num("approved_area", "Approved constructed area", "sq. ft."),
		num("actual_area", "Actual constructed area", "sq. ft."),
		num("year_built", "Year of construction", "year"),
		num("replacement_rate", "Indicative replacement rate (unadopted)", "₹/sq. ft."),
		text("condition", "Structural condition observations"),
		text("improvements", "Compound wall, borewell and other improvements")
	],
	Flat: [
		num("uds_deed", "Undivided land share as per deed", "sq. yd."),
		num("carpet_area", "Carpet area", "sq. ft."),
		num("builtup_area", "Built-up area", "sq. ft."),
		num("superbuiltup_area", "Super built-up area", "sq. ft."),
		text("occupancy_certificate", "Occupancy certificate reference"),
		text("parking_rights", "Parking / common area rights")
	],
	Commercial: [
		num("rentable_area", "Rentable area", "sq. ft."),
		num("approved_area", "Approved area", "sq. ft."),
		num("actual_area", "Actual area", "sq. ft."),
		num("monthly_rent", "Observed monthly rent (unadopted)", "₹/month"),
		text("lease_reference", "Lease / rental evidence reference"),
		text("permitted_use", "Permitted and observed use"),
		text("fire_access", "Fire access and safety observations")
	]
};
function isP18Category(x) {
	return typeof x === "string" && P18_CATEGORIES.includes(x);
}
function defaultTemplate(category) {
	return {
		category,
		revision: "builtin-1",
		fields: [...common, ...categoryFields[category]].map((f) => ({
			...f,
			...f.options ? { options: [...f.options] } : {}
		}))
	};
}
var obj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
var validString = (x, max) => typeof x === "string" && x.trim().length > 0 && x.length <= max;
function parseFields(raw) {
	if (!Array.isArray(raw) || raw.length < 1 || raw.length > 30) throw new Error("Template must have 1–30 fields");
	const used = /* @__PURE__ */ new Set();
	return raw.map((f) => {
		if (!obj(f) || !validString(f["key"], 40) || !/^[a-z][a-z0-9_]{0,39}$/.test(f["key"]) || ["constructor", "prototype"].includes(f["key"]) || used.has(f["key"]) || !validString(f["label"], 120)) throw new Error("Each field needs a unique safe key and a label");
		const key = f["key"], label = f["label"], type = f["type"];
		used.add(key);
		if (type !== "text" && type !== "number" && type !== "choice") throw new Error("Supported types: text, number, choice");
		const unit = f["unit"];
		if (unit !== void 0 && !validString(unit, 40)) throw new Error("Invalid unit");
		const options = f["options"];
		if (type === "choice" && (!Array.isArray(options) || options.length < 2 || options.length > 20 || !options.every((o) => validString(o, 100)) || new Set(options).size !== options.length)) throw new Error("Choice fields need 2–20 unique options");
		if (type !== "choice" && options !== void 0) throw new Error("Only choice fields may have options");
		return {
			key,
			label,
			type,
			...typeof unit === "string" ? { unit } : {},
			...type === "choice" ? { options } : {}
		};
	});
}
function normalizeValues(template, raw) {
	if (!obj(raw)) throw new Error("Supplement values must be an object");
	const result = {};
	for (const f of template.fields) {
		const v = raw[f.key];
		if (v === void 0 || v === null || v === "") continue;
		if (f.type === "number") {
			if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 0x38d7ea4c68000) throw new Error(`${f.label}: enter a nonnegative number`);
		} else if (typeof v !== "string" || v.length > 1e3 || f.type === "choice" && !f.options?.includes(v)) throw new Error(`${f.label}: invalid value`);
		result[f.key] = v;
	}
	return result;
}
function encodeSnapshot(template, raw) {
	return JSON.stringify({
		template,
		values: normalizeValues(template, raw)
	});
}
function decodeSnapshot(raw) {
	if (raw === void 0 || raw === "") return null;
	if (raw.length > 65e3) throw new Error("Supplement exceeds maximum size");
	const p = JSON.parse(raw);
	if (!obj(p) || !obj(p["template"])) throw new Error("Invalid supplemental snapshot");
	const t = p["template"];
	if (!isP18Category(t["category"]) || typeof t["revision"] !== "string" || !/^(builtin-1|[1-9][0-9]{0,19})$/.test(t["revision"])) throw new Error("Invalid template reference");
	const template = {
		category: t["category"],
		revision: t["revision"],
		fields: parseFields(t["fields"])
	};
	return {
		template,
		values: normalizeValues(template, p["values"])
	};
}
function useP18Template(category, enabled = true) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-p18-template",
			tenant.id,
			category
		],
		enabled: enabled && isP18Category(category),
		retry: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			if (!isP18Category(category)) throw new Error("Unsupported case category");
			const { data, error } = await vpDb.from("vp_p18_templates").select("id::text,category,fields").eq("org_id", tenant.id).eq("category", category).order("id", { ascending: false }).limit(1).maybeSingle();
			if (error) throw error;
			if (!data) return defaultTemplate(category);
			return {
				category,
				revision: String(data["id"]),
				fields: parseFields(data["fields"])
			};
		}
	});
}
async function publishP18Template(category, fields, reason) {
	const { error } = await vpDb.rpc("vp_p18_publish_template", {
		p_category: category,
		p_fields: parseFields(fields),
		p_reason: reason
	});
	if (error) throw error;
}
//#endregion
export { encodeSnapshot as a, publishP18Template as c, defaultTemplate as i, useP18Template as l, P18_KEY as n, isP18Category as o, decodeSnapshot as r, parseFields as s, P18_CATEGORIES as t };
