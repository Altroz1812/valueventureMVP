import { o as __toESM } from "../_runtime.mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as unzipSync, t as strFromU8 } from "../_libs/fflate.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-p20-workbook-tcEI4tq5.js
var P20_FIELDS = [
	"status",
	"case_num",
	"bank",
	"customer",
	"category",
	"address",
	"property_label",
	"effective_date",
	"method",
	"analysis_version",
	"formula_version",
	"marketValue",
	"guidelineValue",
	"realizableValue",
	"distressValue",
	"landValue",
	"buildingValue",
	"replacementCost",
	"depreciation",
	"amenities",
	"adoptedRate",
	"basis",
	"netOperatingIncome",
	"capRatePct",
	"annualGrossRent",
	"annualExpenses",
	"reason",
	"review_reason"
];
var REQUIRED = [
	"status",
	"case_num",
	"method",
	"analysis_version",
	"marketValue"
];
function parseP20Mapping(input) {
	if (!Array.isArray(input) || input.length < 5 || input.length > 80) throw new Error("Provide 5–80 mappings");
	const targets = /* @__PURE__ */ new Set();
	const fields = /* @__PURE__ */ new Set();
	const rows = input.map((row) => {
		if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error("Invalid mapping row");
		const r = row;
		const field = r["field"], sheet = r["sheet"], cell = r["cell"];
		if (Object.keys(r).some((k) => ![
			"field",
			"sheet",
			"cell"
		].includes(k)) || typeof field !== "string" || !P20_FIELDS.includes(field)) throw new Error("Unknown field");
		if (typeof sheet !== "string" || sheet.trim() !== sheet || !sheet || sheet.length > 31 || sheet.toLowerCase() === "_vp20_audit" || typeof cell !== "string" || !/^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(cell)) throw new Error("Invalid sheet or cell");
		const parts = /^([A-Z]+)(\d+)$/.exec(cell);
		let col = 0;
		for (const c of parts[1]) col = col * 26 + c.charCodeAt(0) - 64;
		if (col > 16384 || Number(parts[2]) > 1048576) throw new Error("Cell outside Excel limits");
		const target = sheet.toLowerCase() + ":" + cell;
		if (targets.has(target)) throw new Error("Duplicate cell target");
		targets.add(target);
		fields.add(field);
		return {
			field,
			sheet,
			cell
		};
	});
	if (!REQUIRED.every((k) => fields.has(k))) throw new Error("Map status, case_num, method, analysis_version and marketValue");
	return rows;
}
var EXAMPLE_MAPPING = REQUIRED.map((field, i) => ({
	field,
	sheet: "Sheet1",
	cell: `B${i + 2}`
}));
function mappedValue(values, field) {
	const v = values[field];
	if (v == null) return null;
	if (typeof v === "string" || typeof v === "boolean" || typeof v === "number" && Number.isFinite(v)) return v;
	throw new Error(`Invalid value for ${field}`);
}
function useP20Templates(enabled, bank, category) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-p20-templates",
			tenant.id,
			bank,
			category
		],
		enabled,
		queryFn: async () => {
			let q = vpDb.from("vp_p20_templates").select("id::text,bank_name,category,title,mapping,published_at").eq("org_id", tenant.id);
			if (bank) q = q.eq("bank_name", bank);
			if (category) q = q.eq("category", category);
			const { data, error } = await q.order("id", { ascending: false }).limit(50);
			if (error) throw error;
			return data ?? [];
		}
	});
}
function useP20Exports(num, enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-p20-exports",
			tenant.id,
			num
		],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_p20_exports").select("id::text,num,analysis_version,template_id::text,prepared_at").eq("org_id", tenant.id).eq("num", num).order("id", { ascending: false }).limit(100);
			if (error) throw error;
			return data ?? [];
		}
	});
}
async function publishP20(bank, category, title, base64, mapping, reason) {
	const { data, error } = await vpDb.rpc("vp_p20_publish", {
		p_bank: bank,
		p_category: category,
		p_title: title,
		p_workbook: base64,
		p_mapping: mapping,
		p_reason: reason
	});
	if (error) throw error;
	return String(data);
}
async function prepareP20(num, version, templateId) {
	const { data, error } = await vpDb.rpc("vp_p20_prepare", {
		p_num: num,
		p_version: version,
		p_template: templateId
	});
	if (error) throw error;
	return String(data);
}
async function loadP20Export(org, num, id) {
	const { data, error } = await vpDb.from("vp_p20_exports").select("id::text,num,analysis_version,template_id::text,prepared_at,cell_values").eq("org_id", org).eq("num", num).eq("id", id).single();
	if (error) throw error;
	const row = data;
	const { data: t, error: e } = await vpDb.from("vp_p20_templates").select("workbook_base64,mapping").eq("org_id", org).eq("id", row.template_id).single();
	if (e) throw e;
	return {
		row,
		template: t
	};
}
function base64ToBytes(s) {
	if (s.length > 1398104) throw new Error("Workbook exceeds 1 MiB");
	return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
function bytesToBase64(bytes) {
	let s = "";
	for (let i = 0; i < bytes.length; i += 8192) s += String.fromCharCode(...bytes.subarray(i, i + 8192));
	return btoa(s);
}
async function openWorkbook(bytes) {
	if (bytes.length < 4 || bytes.length > 1048576 || bytes[0] !== 80 || bytes[1] !== 75) throw new Error("Select a blank unencrypted XLSX (max 1 MiB)");
	let total = 0, count = 0;
	const parts = unzipSync(bytes, { filter: (f) => {
		total += f.originalSize;
		count++;
		if (total > 20971520 || count > 500) throw new Error("Expanded workbook too large");
		if (/(?:externalLinks|vbaProject|embeddings|activeX|connections\.xml|queryTables)/i.test(f.name)) throw new Error("External links, macros and embedded objects are not supported");
		return /\.(xml|rels)$/i.test(f.name);
	} });
	if (!parts["xl/workbook.xml"] || !parts["[Content_Types].xml"]) throw new Error("Not a valid XLSX workbook");
	for (const [name, part] of Object.entries(parts)) {
		const xml = strFromU8(part);
		if (/<!DOCTYPE|<!ENTITY|TargetMode\s*=\s*["']External["']|macroEnabled|<\/?(?:\w+:)?(?:oleObject|externalReference)\b/i.test(xml)) throw new Error(`Unsupported external/active workbook content: ${name}`);
		if (/worksheets\//.test(name) && /<(?:\w+:)?f(?:\s|>)[\s\S]*?(?:WEBSERVICE|HYPERLINK|RTD|DDE|\[[^\]]+\])[\s\S]*?<\/(?:\w+:)?f>/i.test(xml)) throw new Error("External formula references are not supported");
	}
	const { default: XlsxPopulate } = await import("../_libs/xlsx-populate.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	return XlsxPopulate.fromDataAsync(bytes);
}
async function checkedWorkbook(bytes, mapping) {
	const wb = await openWorkbook(bytes);
	if (wb.sheets().some((s) => s.name().toLowerCase() === "_vp20_audit")) throw new Error("Reserved audit sheet already exists");
	for (const row of mapping) {
		const sheet = wb.sheet(row.sheet);
		if (!sheet) throw new Error(`Sheet not found: ${row.sheet}`);
		if (sheet.cell(row.cell).formula()) throw new Error(`Cannot overwrite formula ${row.sheet}!${row.cell}`);
	}
	return wb;
}
async function inspectP20Workbook(bytes, input) {
	return (await checkedWorkbook(bytes, parseP20Mapping(input))).sheets().map((s) => s.name());
}
async function renderP20Workbook(encoded, input, values, audit) {
	const mapping = parseP20Mapping(input);
	const wb = await checkedWorkbook(base64ToBytes(encoded), mapping);
	for (const row of mapping) {
		const cell = wb.sheet(row.sheet).cell(row.cell);
		const v = mappedValue(values, row.field);
		cell.value(v === null ? "" : v);
	}
	const sheet = wb.addSheet("_VP20_AUDIT");
	[
		["STATUS", "REVIEWED WORKPAPER - NOT RELEASED"],
		["Export register ID", audit.id],
		["Template ID", audit.template_id],
		["Analysis version", audit.analysis_version],
		["Prepared at", audit.prepared_at],
		["Case", String(values["case_num"])],
		["Formula", String(values["formula_version"])],
		["Warning", "Not an official bank valuation certificate. Recalculate and verify all formulas in Excel."]
	].forEach(([k, v], i) => {
		sheet.cell(`A${i + 1}`).value(k);
		sheet.cell(`B${i + 1}`).value(v);
	});
	const blob = await wb.outputAsync({ type: "blob" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `WORKPAPER_NOT_RELEASED_${String(values["case_num"])}_v${audit.analysis_version}_export${audit.id}.xlsx`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
//#endregion
export { loadP20Export as a, publishP20 as c, useP20Templates as d, inspectP20Workbook as i, renderP20Workbook as l, P20_FIELDS as n, parseP20Mapping as o, bytesToBase64 as r, prepareP20 as s, EXAMPLE_MAPPING as t, useP20Exports as u };
