import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, n as mayOpenPath, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Bt as ArrowRight, C as RefreshCw, Dt as Check, E as Printer, It as BookOpenCheck, Pt as Calculator, Vt as ArrowLeft, _ as Search, a as UserRound, c as Upload, gt as Clock3, rt as FileText, vt as ClipboardCheck } from "../_libs/lucide-react.mjs";
import { E as cn, T as VpIcon, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { n as collectPages } from "./vp-query-NYEPg70J.mjs";
import { t as STAGES } from "./ops-BcxJm0Qk.mjs";
import { i as uploadVpCaseDocument, o as useVpCaseDocuments, s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-KC4eSjOh.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { c as saveVpValuation, d as useVpReportVersions, f as useVpValuationForm, h as viewVpReportPdf, p as useVpValuationVersions, t as VALUATION_KEYS, u as useVpReportPermissions } from "./vp-reports-CNYb7FPD.mjs";
import { a as loadP20Export, d as useP20Templates, l as renderP20Workbook, s as prepareP20, u as useP20Exports } from "./vp-p20-workbook-tcEI4tq5.mjs";
import { s as propertyError, t as AREA_UNITS } from "./vp-property-data-NyFxtdD0.mjs";
import { t as classifyReadRpcProbe } from "./vp-p5-rpc-diagnostics-DpQIlDMa.mjs";
import { t as Checkbox } from "./checkbox-BI658bIE.mjs";
import { i as TatBadge } from "./ops-ui-CJPu_Wj9.mjs";
import { t as Route } from "./cases_._caseId-2W1CRUr5.mjs";
import { a as usePropertyMaster, o as usePropertyRevisions, r as useCasePropertyLinks, t as linkCaseProperty } from "./vp-property-master-z5usx4CM.mjs";
import { a as previewable, n as comparisonStatus, o as selectedEvidence, r as filterEvidence, t as VpDocumentOcr } from "./vp-document-ocr-weBL-qtE.mjs";
import { c as useSelectedEvidence, o as today, r as MarketSearch, t as BASES } from "./vp-market-search-DEMx_PJV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases_._caseId-BYk8Bmud.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function asRow(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function positiveVersion(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;
}
function label(value) {
	return typeof value === "string" && value.trim() ? value : "Not recorded";
}
function reportVersion(value) {
	return positiveVersion(asRow(value)["version_no"]) ?? 0;
}
function caseReportHistory(rows, caseNum) {
	if (!Number.isSafeInteger(caseNum) || caseNum <= 0) return [];
	return rows.filter((value) => {
		const row = asRow(value);
		return row["num"] === caseNum && reportVersion(value) > 0 && (row["status"] === "Draft" || row["status"] === "Released");
	}).sort((a, b) => reportVersion(b) - reportVersion(a));
}
function releasedHistory(rows) {
	return rows.filter((row) => asRow(row)["status"] === "Released").sort((a, b) => reportVersion(b) - reportVersion(a));
}
function chooseReleasedReport(rows, selection) {
	const released = releasedHistory(rows);
	if (!released.length) return void 0;
	const target = selection === null ? reportVersion(released[0]) : Number(selection);
	if (!Number.isSafeInteger(target) || target <= 0) return;
	const matches = released.filter((row) => reportVersion(row) === target);
	return matches.length === 1 ? matches[0] : void 0;
}
function reportProvenance(value) {
	const row = asRow(value);
	const snapshot = asRow(row["case_snapshot"]);
	const inputs = asRow(row["inputs_snapshot"]);
	const method = label(snapshot["valuation_method"]);
	return {
		reportVersion: reportVersion(value),
		valuationVersion: positiveVersion(row["valuation_version_no"]),
		format: label(row["format_name"]),
		status: label(row["status"]),
		bank: label(snapshot["bank"]),
		property: label(snapshot["property_address"]),
		method,
		workpaper: label(snapshot["p20_export_id"] ?? inputs["export_id"]),
		releasedAt: label(row["released_at"]),
		registration: label(row["released_reg_no"])
	};
}
function canonicalSnapshot(value) {
	if (value === void 0) return "undefined";
	if (Array.isArray(value)) return "[" + value.map(canonicalSnapshot).join(",") + "]";
	if (value !== null && typeof value === "object") {
		const row = value;
		return "{" + Object.keys(row).sort().map((key) => JSON.stringify(key) + ":" + canonicalSnapshot(row[key])).join(",") + "}";
	}
	return JSON.stringify(value) ?? "undefined";
}
function snapshotsEqual(a, b) {
	if (a === void 0 || b === void 0 || a === null || b === null) return false;
	return canonicalSnapshot(a) === canonicalSnapshot(b);
}
function reportIdentifier(value) {
	const id = typeof value === "number" && Number.isSafeInteger(value) ? String(value) : typeof value === "string" ? value : "";
	if (!/^[1-9][0-9]{0,18}$/.test(id)) return null;
	if (id.length === 19 && id > "9223372036854775807") return null;
	return id;
}
function validReportPdfPath(value, orgId, caseNum) {
	if (!reportIdentifier(orgId) || !Number.isSafeInteger(caseNum) || caseNum <= 0) return false;
	if (typeof value !== "string") return false;
	const segments = value.split("/");
	return segments.length >= 3 && segments[0] === orgId && segments[1] === String(caseNum) && segments.every((part) => part.length > 0 && part !== "." && part !== ".." && !part.includes("\\") && !part.includes("%"));
}
function hasPdfHeader(bytes) {
	return bytes.length >= 5 && bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70 && bytes[4] === 45;
}
function checkReportSnapshots(reportValue, officialValue, qcValue, exportValue, templateValue) {
	const report = asRow(reportValue);
	const official = asRow(officialValue);
	const qc = asRow(qcValue);
	const workpaper = asRow(exportValue);
	const template = asRow(templateValue);
	const inputs = asRow(report["inputs_snapshot"]);
	const caseData = asRow(report["case_snapshot"]);
	const property = asRow(inputs["property_snapshot"]);
	const checks = [];
	function add(label, available, matched, detail) {
		checks.push({
			label,
			status: !available ? "Unavailable" : matched ? "Matched" : "Mismatch",
			detail
		});
	}
	const officialExists = Object.keys(official).length > 0;
	add("Official valuation reference", officialExists, official["version_no"] === report["valuation_version_no"] && official["num"] === report["num"] && reportIdentifier(official["org_id"]) !== null && reportIdentifier(official["org_id"]) === reportIdentifier(report["org_id"]), "Exact report-linked official valuation version");
	add("Valuation inputs", officialExists, snapshotsEqual(report["inputs_snapshot"], official["inputs"]), "Stored report inputs compared with official inputs");
	add("Valuation calculations", officialExists, snapshotsEqual(report["calculations_snapshot"], official["calculations"]), "Stored calculation snapshot compared without recalculation");
	add("Final QC reference", Object.keys(qc).length > 0, reportIdentifier(qc["id"]) !== null && reportIdentifier(qc["id"]) === reportIdentifier(report["final_qc_task_id"]) && reportIdentifier(qc["org_id"]) === reportIdentifier(report["org_id"]) && qc["num"] === report["num"] && qc["review_stage"] === "Final QC" && qc["status"] === "Approved", "Referenced approval record; not a separate proof of version binding");
	const method = String(official["method"] ?? caseData["valuation_method"] ?? "");
	if (!officialExists && !method) {
		checks.push({
			label: "Bank workpaper",
			status: "Unavailable",
			detail: "Valuation method could not be established"
		});
		return checks;
	}
	if (!method.startsWith("P19 ")) {
		checks.push({
			label: "Bank workpaper",
			status: "Not applicable",
			detail: "Legacy valuation method"
		});
		return checks;
	}
	const exportId = reportIdentifier(caseData["p20_export_id"]);
	const inputExportId = reportIdentifier(inputs["export_id"]);
	add("Adopted workpaper reference", Object.keys(workpaper).length > 0, exportId !== null && exportId === inputExportId && exportId === reportIdentifier(workpaper["id"]) && reportIdentifier(workpaper["org_id"]) === reportIdentifier(report["org_id"]) && workpaper["num"] === report["num"] && workpaper["analysis_version"] === inputs["analysis_version"], "Workpaper " + (exportId ?? "not recorded"));
	add("Original bank template", Object.keys(template).length > 0, reportIdentifier(template["id"]) !== null && reportIdentifier(template["id"]) === reportIdentifier(workpaper["template_id"]) && reportIdentifier(template["org_id"]) === reportIdentifier(report["org_id"]) && template["bank_name"] === caseData["bank"] && template["category"] === property["category"], String(template["title"] ?? "Template unavailable"));
	return checks;
}
var requiredBankFields = [
	"status",
	"case_num",
	"method",
	"analysis_version",
	"marketValue"
];
var calculationFields = [
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
	"annualExpenses"
];
var allowedBankFields = /* @__PURE__ */ new Set([
	...requiredBankFields,
	...calculationFields,
	"bank",
	"customer",
	"category",
	"address",
	"property_label",
	"effective_date",
	"formula_version",
	"reason",
	"review_reason"
]);
function bankScalar(value) {
	if (value === void 0 || value === null || value === "") return null;
	if (typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	throw new Error("Invalid mapped workbook value");
}
function validBankCell(address) {
	const match = /^([A-Z]{1,3})([1-9][0-9]{0,6})$/.exec(address);
	if (!match) return false;
	let column = 0;
	for (const letter of match[1]) column = column * 26 + letter.charCodeAt(0) - 64;
	return column <= 16384 && Number(match[2]) <= 1048576;
}
function buildBankMappingReadback(reportValue, workpaperValue, templateValue) {
	const report = asRow(reportValue);
	const workpaper = asRow(workpaperValue);
	const template = asRow(templateValue);
	const inputs = asRow(report["inputs_snapshot"]);
	const calculations = asRow(report["calculations_snapshot"]);
	const caseData = asRow(report["case_snapshot"]);
	const property = asRow(inputs["property_snapshot"]);
	const analysisInputs = asRow(inputs["analysis_inputs"]);
	const values = asRow(workpaper["cell_values"]);
	if (!reportIdentifier(workpaper["id"]) || reportIdentifier(workpaper["id"]) !== reportIdentifier(caseData["p20_export_id"]) || reportIdentifier(workpaper["id"]) !== reportIdentifier(inputs["export_id"]) || workpaper["num"] !== report["num"] || workpaper["analysis_version"] !== inputs["analysis_version"] || reportIdentifier(template["id"]) !== reportIdentifier(workpaper["template_id"]) || reportIdentifier(report["org_id"]) === null || reportIdentifier(report["org_id"]) !== reportIdentifier(workpaper["org_id"]) || reportIdentifier(report["org_id"]) !== reportIdentifier(template["org_id"]) || template["bank_name"] !== caseData["bank"] || template["category"] !== property["category"]) throw new Error("Original workpaper or template reference mismatch");
	const mapping = template["mapping"];
	if (!Array.isArray(mapping) || mapping.length < 5 || mapping.length > 80) throw new Error("Invalid registered bank mapping");
	const source = /* @__PURE__ */ new Map();
	source.set("status", "REVIEWED WORKPAPER - NOT RELEASED");
	source.set("case_num", report["num"]);
	source.set("bank", caseData["bank"]);
	source.set("category", property["category"]);
	source.set("address", property["address"]);
	source.set("property_label", property["label"]);
	source.set("effective_date", inputs["effective_date"]);
	source.set("method", inputs["method"]);
	source.set("analysis_version", inputs["analysis_version"]);
	source.set("formula_version", inputs["formula_version"]);
	source.set("reason", analysisInputs["reason"]);
	for (const field of calculationFields) source.set(field, calculations[field]);
	const seenTargets = /* @__PURE__ */ new Set();
	const seenFields = /* @__PURE__ */ new Set();
	const result = mapping.map((value) => {
		const row = asRow(value);
		if (Object.keys(row).sort().join(",") !== "cell,field,sheet") throw new Error("Unexpected mapping structure");
		const field = row["field"];
		const sheet = row["sheet"];
		const cell = row["cell"];
		if (typeof field !== "string" || !allowedBankFields.has(field) || typeof sheet !== "string" || !sheet.trim() || sheet.trim() !== sheet || sheet.length > 31 || sheet.toLowerCase() === "_vp20_audit" || typeof cell !== "string" || !validBankCell(cell)) throw new Error("Invalid bank mapping field or address");
		const target = sheet.toLowerCase() + ":" + cell;
		if (seenTargets.has(target)) throw new Error("Duplicate bank mapping target: " + target);
		seenTargets.add(target);
		seenFields.add(field);
		const expected = bankScalar(values[field]);
		let reference = "Registered only";
		if (source.has(field)) reference = bankScalar(source.get(field)) === expected ? "Matched" : "Mismatch";
		if (requiredBankFields.includes(field) && expected === null) reference = "Mismatch";
		if (field === "marketValue" && (typeof expected !== "number" || expected < 0)) reference = "Mismatch";
		return {
			field,
			sheet,
			cell,
			expected,
			reference
		};
	});
	if (requiredBankFields.some((field) => !seenFields.has(field))) throw new Error("Required bank mapping fields missing");
	return result;
}
function compareBankCell(expected, actual, formula) {
	if (formula !== void 0 && formula !== null && formula !== "") return {
		status: "Formula",
		actual: "Formula requires manual verification"
	};
	try {
		const parsed = bankScalar(actual);
		return {
			status: parsed === expected ? "Matched" : "Mismatch",
			actual: parsed === null ? "(Blank)" : String(parsed)
		};
	} catch {
		return {
			status: "Unavailable",
			actual: "Unsupported cell value"
		};
	}
}
function reportInspectionReference(reportValue) {
	const inspection = asRow(asRow(asRow(reportValue)["inputs_snapshot"])["inspection_snapshot"]);
	const visitId = reportIdentifier(inspection["visit_id"]);
	const revision = inspection["updated_at"];
	if (!visitId || typeof revision !== "string" || !Number.isFinite(Date.parse(revision))) return null;
	return {
		visitId,
		revision
	};
}
function reportAmount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return "Not recorded";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 2
	}).format(value);
}
function validAnnexPhoto(value, orgId, caseNum, reference) {
	const row = asRow(value);
	const mime = row["mime"];
	const storagePath = row["storage_path"];
	const size = row["size"];
	const uploadedAt = row["uploaded_at"];
	if (!reportIdentifier(orgId) || !reportIdentifier(reference.visitId) || !Number.isSafeInteger(caseNum) || caseNum <= 0 || !reportIdentifier(row["id"]) || reportIdentifier(row["org_id"]) !== orgId || reportIdentifier(row["visit_id"]) !== reference.visitId) return false;
	if (typeof storagePath !== "string" || typeof size !== "number" || !Number.isInteger(size) || size < 1 || size > 10485760 || typeof uploadedAt !== "string" || !Number.isFinite(Date.parse(uploadedAt)) || !Number.isFinite(Date.parse(reference.revision)) || Date.parse(uploadedAt) > Date.parse(reference.revision)) return false;
	const segments = storagePath.split("/");
	if (segments.length !== 4 || segments[0] !== orgId || segments[1] !== String(caseNum) || segments[2] !== reference.visitId) return false;
	const name = segments[3] ?? "";
	const extension = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "";
	if (!extension) return false;
	const match = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i.exec(name);
	return match !== null && match[1] === extension;
}
function validAnnexImage(bytes, mime) {
	if (mime === "image/jpeg") return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
	if (mime === "image/png") return bytes.length > 8 && [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	].every((value, index) => bytes[index] === value);
	if (mime === "image/webp") return bytes.length > 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80;
	return false;
}
function parseReleaseArtifactReadback(value) {
	const row = asRow(value);
	const label = "Release-time storage metadata";
	switch (row["status"]) {
		case "metadata_matched": return {
			label,
			status: "Matched",
			detail: "Stored object identity and metadata match the release-time record. This is not a binary hash comparison."
		};
		case "metadata_changed": return {
			label,
			status: "Mismatch",
			detail: "Storage object identity or metadata changed since release."
		};
		case "object_missing": return {
			label,
			status: "Mismatch",
			detail: "The PDF registered at release is no longer available."
		};
		case "bucket_not_private": return {
			label,
			status: "Mismatch",
			detail: "The report storage bucket is missing or not private."
		};
		case "not_recorded": return {
			label,
			status: "Unavailable",
			detail: "No release-time metadata was recorded for this report."
		};
		default: return {
			label,
			status: "Unavailable",
			detail: "Unrecognized or unavailable artifact verification response."
		};
	}
}
function record(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Unexpected database response");
	return value;
}
function safeId(value) {
	const id = typeof value === "number" && Number.isSafeInteger(value) ? String(value) : typeof value === "string" ? value : "";
	if (!/^[1-9][0-9]{0,18}$/.test(id) || id.length === 19 && id > "9223372036854775807") throw new Error("Invalid or unsafe database identifier");
	return id;
}
function integer(value, minimum = 0) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum || value > 2147483647) throw new Error("Invalid database version");
	return value;
}
function parseOfficial(value) {
	const row = record(value);
	const version = integer(row["version"]);
	const status = row["status"];
	if (status !== null && typeof status !== "string") throw new Error("Invalid official valuation status");
	if (version === 0) return {
		version,
		status,
		method: null,
		advanced: false,
		results: {},
		adoption: null
	};
	const method = row["method"];
	if (typeof method !== "string" || !method.trim()) throw new Error("Official valuation method missing");
	const advanced = method.startsWith("P19 ");
	const raw = row["adoption"];
	if (advanced !== (raw !== null && raw !== void 0)) throw new Error("Official valuation adoption is inconsistent");
	const a = advanced ? record(raw) : null;
	if (a && typeof a["reason"] !== "string") throw new Error("Official adoption reason missing");
	return {
		version,
		status,
		method,
		advanced,
		results: record(row["results"]),
		adoption: a ? {
			analysisVersion: integer(a["analysis_version"], 1),
			exportId: safeId(a["export_id"]),
			reason: String(a["reason"])
		} : null
	};
}
function errorMessage(value) {
	if (value && typeof value === "object" && "message" in value) return String(value.message);
	return "Operation failed";
}
function adoptionSelectionKey(officialVersion, analysisVersion, exportId) {
	return [
		integer(officialVersion),
		integer(analysisVersion, 1),
		safeId(exportId)
	].join(":");
}
function useVpOfficialSummary(orgId, num, enabled) {
	return useQuery({
		queryKey: [
			"vp-official-valuation",
			orgId,
			num
		],
		enabled: enabled && Number.isSafeInteger(num) && num > 0,
		staleTime: 0,
		retry: false,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_p23_summary", { p_num: num });
			if (error) throw error;
			return parseOfficial(data);
		}
	});
}
function money(value) {
	return typeof value === "number" && Number.isFinite(value) ? new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 2
	}).format(value) : "Not available";
}
async function eligibleWorkpapers(orgId, num, bank, category) {
	const latest = await vpDb.from("vp_p19_analyses").select("version_no").eq("org_id", orgId).eq("num", num).order("version_no", { ascending: false }).limit(1).maybeSingle();
	if (latest.error) throw latest.error;
	if (!latest.data) return {
		analysis: 0,
		exports: []
	};
	const analysis = integer(record(latest.data)["version_no"], 1);
	const review = await vpDb.from("vp_p19_reviews").select("decision").eq("org_id", orgId).eq("num", num).eq("version_no", analysis).maybeSingle();
	if (review.error) throw review.error;
	if (!review.data || record(review.data)["decision"] !== "Reviewed") return {
		analysis,
		exports: []
	};
	const templates = await vpDb.from("vp_p20_templates").select("id").eq("org_id", orgId).eq("bank_name", bank).eq("category", category).order("id", { ascending: false }).limit(100);
	if (templates.error) throw templates.error;
	const ids = (templates.data ?? []).map((item) => safeId(record(item)["id"]));
	if (!ids.length) return {
		analysis,
		exports: []
	};
	const exports = await vpDb.from("vp_p20_exports").select("id,prepared_at").eq("org_id", orgId).eq("num", num).eq("analysis_version", analysis).in("template_id", ids).order("id", { ascending: false }).limit(50);
	if (exports.error) throw exports.error;
	return {
		analysis,
		exports: (exports.data ?? []).map((item) => ({
			id: safeId(record(item)["id"]),
			preparedAt: String(record(item)["prepared_at"] ?? "")
		}))
	};
}
function VpOfficialValuation({ orgId, num, bank, category, summary, canRead, canAdopt, onBusy }) {
	const queryClient = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [acknowledged, setAcknowledged] = (0, import_react.useState)(null);
	const busy = (0, import_react.useRef)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const eligible = useQuery({
		queryKey: [
			"vp-adoption-workpapers",
			orgId,
			num,
			bank,
			category
		],
		enabled: canAdopt && summary.isSuccess,
		retry: false,
		staleTime: 0,
		queryFn: () => eligibleWorkpapers(orgId, num, bank, category)
	});
	const official = summary.isSuccess && !summary.isPlaceholderData ? summary.data : void 0;
	const chosen = eligible.data?.exports.find((x) => x.id === selected);
	const selectionKey = official && chosen && eligible.data ? adoptionSelectionKey(official.version, eligible.data.analysis, chosen.id) : null;
	const ready = canAdopt && summary.isSuccess && !summary.isFetching && !!official && eligible.isSuccess && !eligible.isFetching && !!chosen && selectionKey !== null && acknowledged === selectionKey && reason.trim().length >= 5 && reason.trim().length <= 1e3 && !saving;
	async function adopt() {
		if (!ready || !official || !chosen || !eligible.data || busy.current) return;
		busy.current = true;
		setSaving(true);
		onBusy(true);
		let committed = false;
		try {
			const { data, error } = await vpDb.rpc("vp_p23_adopt", {
				p_num: num,
				p_analysis: eligible.data.analysis,
				p_export: chosen.id,
				p_expected: official.version,
				p_reason: reason.trim()
			});
			if (error) throw error;
			committed = true;
			const version = integer(data, 1);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [
					"vp-valuation-form",
					orgId,
					num
				] }),
				queryClient.invalidateQueries({ queryKey: [
					"vp-valuation-versions",
					orgId,
					num
				] }),
				queryClient.invalidateQueries({ queryKey: ["vp-case-log", orgId] })
			]);
			const checked = await summary.refetch();
			if (checked.isError || checked.data?.version !== version || checked.data?.advanced !== true || checked.data?.adoption?.analysisVersion !== eligible.data.analysis || checked.data?.adoption?.exportId !== chosen.id) throw new Error("Official valuation readback could not be verified");
			setReason("");
			setSelected("");
			setAcknowledged(null);
			toast.success("Official valuation v" + version + " adopted. Final QC required.");
		} catch (error) {
			toast.error(committed ? "Adoption was recorded but readback failed. Reload before retrying." : errorMessage(error));
			await summary.refetch();
			await eligible.refetch();
		} finally {
			busy.current = false;
			setSaving(false);
			onBusy(false);
		}
	}
	if (!canRead) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "min-w-0 lg:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-sm",
			children: "Official valuation and adoption"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4 text-sm",
			children: [
				summary.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading official valuation..." }),
				summary.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "text-destructive",
					children: [errorMessage(summary.error), ". Legacy editing remains locked."]
				}),
				official && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: official.version ? "Official version " + official.version : "No official valuation submitted"
							}),
							official.method && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: official.method }),
							official.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: official.status })
						]
					}),
					official.version > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							["Market value", "marketValue"],
							["Realizable value", "realizableValue"],
							["Distress value", "distressValue"],
							["Guideline value", "guidelineValue"]
						].map(([label, field]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: money(official.results[field])
							})]
						}, field))
					}),
					official.adoption && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 rounded-md border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Adopted analysis v",
								official.adoption.analysisVersion,
								" / Workpaper ",
								official.adoption.exportId
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: official.adoption.reason }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Legacy valuation editing is locked. Report release remains subject to Final QC and existing server checks."
							})
						]
					})
				] }),
				(canAdopt || saving) && official && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-t pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Adopt reviewed valuation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: saving || eligible.isFetching || summary.isFetching,
								onClick: () => {
									setSelected("");
									setAcknowledged(null);
									Promise.all([eligible.refetch(), summary.refetch()]);
								},
								children: "Refresh eligible workpapers"
							})]
						}),
						eligible.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-destructive",
							children: errorMessage(eligible.error)
						}),
						eligible.isFetching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking reviewed workpapers..." }),
						eligible.isSuccess && eligible.data.exports.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Complete the independent review of the latest analysis and prepare a matching P20 bank workpaper first."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Registered bank workpaper" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full rounded-md border bg-background p-2",
								value: selected,
								disabled: saving || eligible.isFetching,
								onChange: (e) => {
									setSelected(e.target.value);
									setAcknowledged(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select reviewed workpaper"
								}), (eligible.data?.exports ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: item.id,
									children: [
										"Analysis v",
										eligible.data?.analysis,
										" / Workpaper ",
										item.id,
										" / ",
										item.preparedAt
									]
								}, item.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adoption reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "w-full rounded-md border bg-background p-2",
								rows: 3,
								maxLength: 1e3,
								disabled: saving,
								value: reason,
								onChange: (e) => setReason(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: selectionKey !== null && acknowledged === selectionKey,
								disabled: saving,
								onChange: (e) => setAcknowledged(e.target.checked ? selectionKey : null)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adopt the selected reviewed calculation as the official valuation. This does not approve or release the report." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !ready,
							onClick: () => void adopt(),
							children: saving ? "Adopting..." : "Adopt official valuation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Latest 50 matching workpapers from up to 100 bank templates. PostgreSQL independently checks evidence, case stage, authorization and version consistency."
						})
					]
				}),
				!canAdopt && !saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Adoption requires Report Draft stage and valuation edit permission."
				})
			]
		})]
	});
}
function nextCaseSection(stage) {
	switch (stage) {
		case "Initiation":
		case "Received": return {
			section: "documents",
			label: "Review intake documents",
			detail: "Check the available documents and property particulars."
		};
		case "Initiation QC": return {
			section: "inspection",
			label: "Review initiation QC",
			detail: "Open the linked quality tasks and assignment details."
		};
		case "Field Visit":
		case "Assigned":
		case "Visit scheduled":
		case "Visit done": return {
			section: "inspection",
			label: "Review site inspection",
			detail: "Open the linked visit and inspection evidence."
		};
		case "Field QC":
		case "Checker pending": return {
			section: "inspection",
			label: "Review field QC",
			detail: "Check the recorded inspection and assigned review task."
		};
		case "Report Draft": return {
			section: "valuation",
			label: "Open valuation workbench",
			detail: "Review measurements and analysis before authorized submission."
		};
		case "Final QC": return {
			section: "inspection",
			label: "Review Final QC status",
			detail: "Check the linked quality task. Approval remains with the authorized checker."
		};
		case "Approved":
		case "Delivered":
		case "Submitted":
		case "Invoiced": return {
			section: "certificate",
			label: "Open report workspace",
			detail: "Review the available report versions and release status."
		};
		default: return {
			section: "overview",
			label: "Review case status",
			detail: "Confirm the recorded stage before taking further action."
		};
	}
}
function evidenceStatus(count, loading, failed) {
	if (failed) return "Unavailable";
	if (loading || count === void 0) return "Loading";
	return count === 0 ? "No documents" : `${count} registered`;
}
function previewBar(value, total) {
	return Number.isFinite(value) && Number.isFinite(total) && total > 0 ? Math.min(100, Math.max(0, value / total * 100)) : 0;
}
function CaseContext({ record, documentCount, loading, failed, onOpen }) {
	const next = nextCaseSection(record.stage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "vp-context-panel mb-2",
		"aria-label": "Case guidance and evidence",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2 text-sm font-semibold text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenCheck, {
							className: "size-[18px]",
							strokeWidth: 1.65,
							"aria-hidden": "true"
						}), "Workflow guidance"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: next.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: next.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "mt-2 gap-2",
						onClick: () => onOpen(next.section),
						children: ["Open section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							className: "size-4",
							"aria-hidden": "true"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "vp-case-meta grid min-w-0 gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
							className: "mt-0.5 size-4 shrink-0 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Documents"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "break-words text-sm font-semibold",
								children: evidenceStatus(documentCount, loading, failed)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {
							className: "mt-0.5 size-4 shrink-0 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Due date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "break-words text-sm font-semibold",
								children: record.due || "Not recorded"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
							className: "mt-0.5 size-4 shrink-0 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Assigned to"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "break-words text-sm font-semibold",
								children: record.assignedTo || "Unassigned"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground vp-guidance-note",
				children: "Based on the recorded case stage and loaded document register. Not an AI assessment or approval."
			})
		]
	});
}
function ValueGraphic({ market, realizable, distress }) {
	const entries = [
		{
			label: "Market value",
			value: market
		},
		{
			label: "Realizable value",
			value: realizable
		},
		{
			label: "Distress / forced sale value",
			value: distress
		}
	];
	const scale = Math.max(0, ...entries.map((e) => Number.isFinite(e.value) ? e.value : 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "vp-value-graphic",
		"aria-label": "Local calculation comparison",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
			className: "mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Value comparison"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Local preview · not approved or certified"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: entries.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex flex-wrap items-center justify-between gap-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "tabular-nums",
					children: Number.isFinite(e.value) ? fmtINR(e.value) : "Unavailable"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vp-graphic-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `vp-graphic-fill vp-value-fill-${i}`,
					style: { width: `${previewBar(e.value, scale)}%` }
				})
			})] }, e.label))
		})]
	});
}
var labels = [
	"Intake",
	"Intake QC",
	"Field visit",
	"Field QC",
	"Valuation",
	"Final QC",
	"Approved",
	"Delivered"
];
function CaseProgress({ stage, dbStage }) {
	const index = STAGES.indexOf(stage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "vp-workflow-rail mb-2",
		"aria-label": "Case workflow",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Case lifecycle"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-muted-foreground",
				children: [
					index >= 0 ? `Stage ${index + 1} of ${STAGES.length}` : "Unmapped stage",
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: index === -1 ? dbStage : stage
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "vp-stage-grid",
			children: STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				"aria-current": i === index ? "step" : void 0,
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold", i === index ? "border-primary bg-primary text-primary-foreground" : i < index ? "border-success/40 bg-success/10 text-success" : "border-input bg-muted text-muted-foreground"),
							children: i < index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								strokeWidth: 1.8,
								className: "size-4",
								"aria-hidden": "true"
							}) : i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("h-px flex-1", i < index ? "bg-success/50" : "bg-border"),
							"aria-hidden": "true"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm font-medium leading-snug", i === index && "text-primary"),
						children: labels[i]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: index < 0 ? "Unknown" : i === index ? "Current" : i < index ? "Earlier stage" : "Not reached"
					})
				]
			}, s))
		})]
	});
}
function computeValuation(i) {
	const landValue = Math.round(i.landAreaSqYd * i.landRate);
	const replacementCost = Math.round(i.builtUpSqFt * i.constructionRate);
	const age = Math.min(Math.max(i.ageYears, 0), i.lifeYears);
	const depreciationPct = i.lifeYears > 0 ? (100 - i.salvagePct) * age / i.lifeYears : 0;
	const depreciation = Math.round(replacementCost * depreciationPct / 100);
	const buildingValue = replacementCost - depreciation;
	const marketValue = landValue + buildingValue + Math.round(i.amenities);
	const guidelineValue = Math.round(i.landAreaSqYd * i.guidelineRate) + buildingValue;
	return {
		landValue,
		replacementCost,
		depreciationPct: Math.round(depreciationPct * 100) / 100,
		depreciation,
		buildingValue,
		marketValue,
		guidelineValue,
		realizableValue: Math.round(marketValue * i.realizablePct / 100),
		distressValue: Math.round(marketValue * i.distressPct / 100)
	};
}
/** Indian-style words for a rupee amount (e.g. "Eighty Five Lakh Rupees Only"). */
function rupeesInWords(n) {
	const ones = [
		"",
		"One",
		"Two",
		"Three",
		"Four",
		"Five",
		"Six",
		"Seven",
		"Eight",
		"Nine",
		"Ten",
		"Eleven",
		"Twelve",
		"Thirteen",
		"Fourteen",
		"Fifteen",
		"Sixteen",
		"Seventeen",
		"Eighteen",
		"Nineteen"
	];
	const tens = [
		"",
		"",
		"Twenty",
		"Thirty",
		"Forty",
		"Fifty",
		"Sixty",
		"Seventy",
		"Eighty",
		"Ninety"
	];
	const two = (x) => x < 20 ? ones[x] : `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
	const three = (x) => x >= 100 ? `${ones[Math.floor(x / 100)]} Hundred${x % 100 ? " " + two(x % 100) : ""}` : two(x);
	n = Math.round(n);
	if (n === 0) return "Zero Rupees Only";
	const parts = [];
	const crore = Math.floor(n / 1e7);
	n %= 1e7;
	const lakh = Math.floor(n / 1e5);
	n %= 1e5;
	const thousand = Math.floor(n / 1e3);
	n %= 1e3;
	if (crore) parts.push(`${three(crore)} Crore`);
	if (lakh) parts.push(`${two(lakh)} Lakh`);
	if (thousand) parts.push(`${two(thousand)} Thousand`);
	if (n) parts.push(three(n));
	return `${parts.join(" ")} Rupees Only`;
}
var fields$1 = [
	{
		key: "label",
		label: "Property name"
	},
	{
		key: "category",
		label: "Category"
	},
	{
		key: "address",
		label: "Address"
	},
	{
		key: "district",
		label: "District"
	},
	{
		key: "mandal",
		label: "Mandal"
	},
	{
		key: "village",
		label: "Village"
	},
	{
		key: "state",
		label: "State"
	},
	{
		key: "pincode",
		label: "PIN"
	},
	{
		key: "flat_no",
		label: "Unit"
	},
	{
		key: "building_name",
		label: "Building"
	}
];
var sides = [
	"east",
	"west",
	"north",
	"south"
];
var show = (value) => value == null || value === "" ? "Not recorded" : String(value);
function PropertyReconciliation({ record, link }) {
	const revisions = usePropertyRevisions(record.id);
	const pinned = revisions.data?.find((r) => r.revision === link.property_revision);
	if (revisions.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "status",
		className: "text-sm",
		children: "Loading pinned property evidence…"
	});
	if (revisions.error || !pinned) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		role: "alert",
		className: "rounded border p-3 text-sm text-destructive",
		children: [
			"Pinned revision unavailable. ",
			revisions.error?.message ?? "Historical revision not found.",
			" Do not substitute the latest master."
		]
	});
	const data = pinned.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-sm",
		children: "Property evidence & revision comparison"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-muted-foreground",
		children: [
			"Case pinned r",
			link.property_revision,
			" · Latest master r",
			record.current_revision,
			". Comparisons are informational; no automatic re-linking or valuation update."
		]
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Particular" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pinned case record" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Latest master" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Comparison" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: fields$1.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-medium",
					children: f.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "whitespace-normal break-words",
					children: show(data[f.key])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "whitespace-normal break-words",
					children: show(record.data[f.key])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: comparisonStatus(data[f.key], record.data[f.key]) })
			] }, f.key)) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-semibold text-sm",
				children: "Boundaries in the pinned property record"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Stored deed and actual entries are not an independent inspection verification."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Side" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Deed" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Recorded actual" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Comparison" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: sides.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "capitalize",
					children: s
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "whitespace-normal break-words",
					children: show(data[`${s}_deed`])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "whitespace-normal break-words",
					children: show(data[`${s}_actual`])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: comparisonStatus(data[`${s}_deed`], data[`${s}_actual`]) })
			] }, s)) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-semibold text-sm",
				children: "Pinned parcels"
			}),
			data.parcels?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Survey / plot" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Deed extent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Recorded actual" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.parcels.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
					show(p.survey_no),
					" / ",
					show(p.plot_no)
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.deed_area == null ? "Not recorded" : `${p.deed_area} ${p.deed_unit}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.actual_area == null ? "Not recorded" : `${p.actual_area} ${p.actual_unit}` })
			] }, i)) })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "No parcels recorded in the pinned revision."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Different units are displayed as recorded; no area conversions, legal conclusions or adopted values are inferred."
			})
		]
	})] });
}
function CaseProperty({ num }) {
	const { can, tenant } = useApp();
	const properties = usePropertyMaster();
	const links = useCasePropertyLinks(num);
	const qc = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	if (!can("cases.View")) return null;
	const current = links.data?.[0];
	const chosen = properties.data?.find((p) => p.id === selected);
	const currentProperty = properties.data?.find((p) => p.id === current?.property_id);
	async function save() {
		if (!chosen || !reason.trim() || !links.isSuccess) return;
		if (!window.confirm("Record this property association? Existing valuation and released report snapshots will not change.")) return;
		setBusy(true);
		setError("");
		try {
			await linkCaseProperty(num, chosen, current?.link_version ?? 0, reason);
			await Promise.all([qc.invalidateQueries({ queryKey: [
				"vp-p16-case-links",
				tenant.id,
				num
			] }), qc.invalidateQueries({ queryKey: ["vp-p16-links", tenant.id] })]);
			setSelected("");
			setReason("");
		} catch (e) {
			setError(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "md:col-span-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-sm",
				children: "Central property reference"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Reference only. Linking or correcting the property does not modify case data, valuation, QC or released reports. Historical associations are recorded on the actual link date."
					}),
					links.isLoading || properties.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading property register…" }) : null,
					links.error || properties.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "alert",
						className: "text-destructive",
						children: ["Property register unavailable: ", propertyError(links.error ?? properties.error)]
					}) : null,
					links.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"PM-",
						current.property_id,
						" · ",
						currentProperty?.data.label ?? "Property",
						" · pinned revision ",
						current.property_revision,
						" · association ",
						current.link_version
					] }) : "No property linked." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/properties",
						className: "text-primary underline",
						children: "Open Property Master"
					}),
					can("cases.Edit") && links.isSuccess && properties.isSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "grid gap-1 text-xs",
								children: [current ? "Correct association / pin newer revision" : "Select existing property", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full rounded border bg-background p-2 text-sm",
									value: selected,
									disabled: busy,
									onChange: (e) => setSelected(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Choose property"
									}), properties.data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p.id,
										children: [
											"PM-",
											p.id,
											" · ",
											p.data.label,
											" · ",
											p.data.district,
											" · r",
											p.current_revision
										]
									}, p.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "grid gap-1 text-xs",
								children: ["Association reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: reason,
									disabled: busy,
									onChange: (e) => setReason(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || !chosen || !reason.trim() || current?.property_id === chosen.id && current.property_revision === chosen.current_revision,
								onClick: () => void save(),
								children: busy ? "Saving…" : "Record link"
							})
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-destructive",
						children: error
					}),
					links.data && links.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer",
						children: "Association audit history"
					}), links.data.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b py-2",
						children: [
							"#",
							l.link_version,
							" · PM-",
							l.property_id,
							" r",
							l.property_revision,
							" · ",
							new Date(l.linked_at).toLocaleString(),
							" · user ",
							l.linked_by,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: l.reason
							})
						]
					}, l.link_version))] })
				]
			})]
		}),
		current && currentProperty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyReconciliation, {
			record: currentProperty,
			link: current
		}, `${current.property_id}:${current.link_version}`),
		" ",
		current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketSearch, {
			id: current.property_id,
			revision: current.property_revision,
			caseNum: num,
			linkVersion: current.link_version
		}, `${num}:${current.link_version}`)
	] });
}
function displayDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}
/** Read-only dossier links. Every request is org-scoped and still subject to server RLS/RPC permissions. */
function VpCaseLinkedRecords({ caseNum, bankName }) {
	const { tenant, tenantUsers, capabilities } = useApp();
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: [
			"vp-case-linked-records",
			tenant.id,
			caseNum,
			bankName
		],
		enabled: Number.isInteger(caseNum) && caseNum > 0,
		queryFn: async () => {
			const [bankResult, visitResult, qcResult] = await Promise.all([
				vpDb.from("banks").select("name,alias,kind").eq("org_id", tenant.id).eq("name", bankName).maybeSingle(),
				vpDb.from("vp_site_visits").select("id,assigned_user_id,scheduled_at,status,checkin_at,checkout_at,checkin_verified,checkout_verified").eq("org_id", tenant.id).eq("num", caseNum).order("scheduled_at", { ascending: false }),
				vpDb.rpc("vp_qc_list_tasks")
			]);
			const qcRows = qcResult.error ? [] : (qcResult.data ?? []).filter((task) => Number(task.num) === caseNum);
			const taskIds = qcRows.map((task) => String(task.id));
			const eventResult = taskIds.length > 0 ? await vpDb.from("vp_qc_events").select("id,task_id,event_type,actor_user_id,remarks,occurred_at").eq("org_id", tenant.id).in("task_id", taskIds).order("occurred_at", { ascending: false }).limit(100) : null;
			return {
				bank: bankResult.error ? null : bankResult.data,
				visits: visitResult.error ? [] : visitResult.data ?? [],
				qc: qcRows,
				events: eventResult?.error ? [] : eventResult?.data ?? [],
				bankError: bankResult.error?.message ?? null,
				visitError: visitResult.error?.message ?? null,
				qcError: qcResult.error?.message ?? null,
				eventError: eventResult?.error?.message ?? null
			};
		},
		staleTime: 1e4,
		refetchOnWindowFocus: true
	});
	const nameFor = (id) => tenantUsers.find((u) => u.id === String(id))?.name ?? (id == null ? "Unassigned" : `User #${id}`);
	const bank = query.data?.bank;
	const visits = query.data?.visits ?? [];
	const qc = query.data?.qc ?? [];
	const events = query.data?.events ?? [];
	const hasError = Boolean(query.data?.bankError || query.data?.visitError || query.data?.qcError || query.data?.eventError);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "md:col-span-3 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Linked case records — live database"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled: query.isFetching,
					onClick: () => void Promise.all([query.refetch(), queryClient.invalidateQueries({ queryKey: ["vp-qc-tasks", tenant.id] })]),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 size-3.5" }), " Refresh"]
				})]
			}),
			query.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Loading linked bank, visit and QC records…"
			}),
			query.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-destructive",
				children: ["Database connection error: ", query.error.message]
			}),
			hasError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "alert",
				className: "rounded border border-destructive/30 p-3 text-xs text-destructive",
				children: [Object.entries({
					bank: query.data?.bankError,
					visits: query.data?.visitError,
					qc: query.data?.qcError,
					events: query.data?.eventError
				}).filter(([, error]) => !!error).map(([module, error]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					module,
					": ",
					error
				] }, module)), "A permission error is not the same as an empty table."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Client / Bank Master"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: bank?.name ?? bankName
							}),
							bank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground",
								children: [bank.kind, bank.alias ? ` · ${bank.alias}` : ""]
							}),
							!bank && !query.isPending && !query.data?.bankError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-amber-700",
								children: "No matching permitted bank master record."
							}),
							mayOpenPath("/admin/bank-masters", capabilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/bank-masters",
								className: "text-primary underline",
								children: "Open Bank Masters"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm",
						children: [
							"Field Visits (",
							visits.length,
							")"
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 text-xs",
						children: [
							visits.slice(0, 4).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b pb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayDate(v.scheduled_at) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: v.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["Officer: ", nameFor(v.assigned_user_id)]
									}),
									mayOpenPath("/field-inspections/" + v.id, capabilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/field-inspections/$visitId",
										params: { visitId: String(v.id) },
										className: "inline-block py-1 text-sm text-primary underline",
										children: "Open inspection"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: [
											"GPS check-in/out recorded: ",
											v.checkin_at ? "yes" : "no",
											" / ",
											v.checkout_at ? "yes" : "no"
										]
									})
								]
							}, String(v.id))),
							!visits.length && !query.isPending && !query.data?.visitError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "No visits visible for this case."
							}),
							mayOpenPath("/field-operations", capabilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/field-operations",
								search: { view: "visits" },
								className: "text-primary underline",
								children: "Open Field Operations"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm",
						children: [
							"QC Reviews (",
							qc.length,
							")"
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 text-xs",
						children: [
							qc.slice(0, 5).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b pb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.review_stage }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: t.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["Checker: ", nameFor(t.assigned_checker_id)]
									}),
									t.decided_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["Decision: ", displayDate(t.decided_at)]
									}),
									t.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.remarks })
								]
							}, t.id)),
							!qc.length && !query.isPending && !query.data?.qcError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "No QC reviews visible. Records may be hidden by permissions."
							}),
							mayOpenPath("/qc-checking", capabilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/qc-checking",
								className: "text-primary underline",
								children: "Open QC & Checking"
							})
						]
					})] })
				]
			}),
			events.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded border p-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-semibold",
					children: "Recent QC actions"
				}), events.slice(0, 5).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 border-b py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: e.event_type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayDate(e.occurred_at) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: nameFor(e.actor_user_id)
						}),
						e.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.remarks })
					]
				}, String(e.id)))]
			})
		]
	});
}
function VpDocumentWorkbench({ caseNum, documents, loading, error, uploading, onUpload }) {
	const { tenant } = useApp();
	const [selected, setSelected] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("");
	const [activity, setActivity] = (0, import_react.useState)({
		busy: false,
		unsaved: false
	});
	const doc = selected ? documents.find((d) => d.id === selected) : selectedEvidence(documents, selected);
	(0, import_react.useEffect)(() => {
		if (!selected && doc) setSelected(doc.id);
	}, [selected, doc?.id]);
	const visible = filterEvidence(documents, filter);
	function choose(id) {
		if (activity.busy || id === doc?.id) return;
		if (activity.unsaved && !window.confirm("This extraction has not been confirmed saved. Switch documents and discard the local result?")) return;
		setActivity({
			busy: false,
			unsaved: false
		});
		setSelected(id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Document workbench",
		className: "vp-evidence-workspace space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Document intelligence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [documents.length, " registered · select a file to compare original and extracted data"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "vp-upload inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border bg-card px-3 text-sm font-medium lg:min-h-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
						uploading ? "Uploading…" : "Upload document",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							className: "sr-only",
							disabled: uploading || activity.busy,
							accept: ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
							onChange: (e) => {
								const f = e.target.files?.[0];
								e.target.value = "";
								onUpload(f);
							}
						})
					]
				})]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-sm",
				children: "Loading registered documents…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vp-document-register",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "min-w-0 rounded-lg border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "search",
								"aria-label": "Filter documents",
								placeholder: "Find document",
								value: filter,
								onChange: (e) => setFilter(e.target.value),
								className: "pl-8"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-40 overflow-auto lg:max-h-72",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y",
							children: visible.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: activity.busy,
								"aria-pressed": d.id === doc?.id,
								onClick: () => choose(d.id),
								className: `flex w-full min-w-0 items-start gap-2 px-2.5 py-2 text-left text-sm ${d.id === doc?.id ? "bg-primary/10 font-semibold text-primary" : "hover:bg-muted"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block break-words",
										children: d.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs font-normal text-muted-foreground",
										children: [
											Math.ceil(d.size / 1024),
											" KB · ",
											d.storage_path ? "Registered" : "Metadata only"
										]
									})]
								})]
							}) }, d.id))
						}), !visible.length && !loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-3 text-sm text-muted-foreground",
							children: documents.length ? "No matching documents." : "No registered documents."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0",
					children: doc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex flex-wrap items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "min-w-0 break-words text-sm font-semibold",
							children: doc.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								doc.at,
								" · ",
								doc.by
							]
						})]
					}), previewable(doc, tenant.id, caseNum) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpDocumentOcr, {
						document: doc,
						caseNum,
						propertyReview: true,
						onActivity: setActivity
					}, `${tenant.id}:${caseNum}:${doc.id}:${doc.storage_path}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded border bg-card p-3 text-sm",
						children: "This registered record has no supported private file in the current case scope."
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded border bg-card p-3 text-sm text-muted-foreground",
						children: "Select or upload a document (PDF, JPEG or PNG, maximum 10 MB)."
					})
				})]
			})
		]
	});
}
var floorKey = (value) => /^floor_area_[0-5]$/.test(value);
var decimal = (raw) => {
	if (!raw || !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw.trim())) return null;
	const n = Number(raw.trim());
	return Number.isFinite(n) && n >= 0 && n <= 1e9 ? n : null;
};
var roundTwo = (number) => Math.round((number + Number.EPSILON) * 100) / 100;
function proposeReviewedTransfer(source, selection) {
	const result = [];
	if (selection.landAreaSqYd?.rectangular_confirmed) {
		const length = decimal(source["land_length"]);
		const breadth = decimal(source["land_breadth"]);
		const unit = source["measurement_unit"];
		if (length === null || breadth === null || length <= 0 || breadth <= 0) throw new Error("Both positive land dimensions are required.");
		if (unit !== "Feet" && unit !== "Metres") throw new Error("Select Feet or Metres on the inspection before deriving land area.");
		const squareYards = unit === "Feet" ? length * breadth / 9 : length * breadth / .83612736;
		result.push({
			field: "landAreaSqYd",
			label: "Land area (sq.yd)",
			value: roundTwo(squareYards),
			explanation: `${length} × ${breadth} ${unit}; rectangular shape confirmed; ${unit === "Feet" ? "÷ 9" : "÷ 0.83612736"} to square yards`
		});
	}
	const chosenFloors = selection.builtUpSqFt?.floors ?? [];
	if (chosenFloors.length) {
		if (new Set(chosenFloors).size !== chosenFloors.length || !chosenFloors.every(floorKey)) throw new Error("Invalid or duplicated floor choice.");
		let total = 0;
		for (const key of chosenFloors) {
			const amount = decimal(source[key]);
			if (amount === null || amount <= 0) throw new Error(`Floor area ${key} must be positive.`);
			total += amount;
		}
		result.push({
			field: "builtUpSqFt",
			label: "Built-up area (sq.ft)",
			value: roundTwo(total),
			explanation: `Explicitly selected floor areas: ${chosenFloors.join(", ")}; excludes all other floors and does not certify chargeable area`
		});
	}
	if (selection.ageYears) {
		const age = decimal(source["property_age"]);
		if (age === null) throw new Error("Property age is missing or invalid.");
		result.push({
			field: "ageYears",
			label: "Building age (years)",
			value: age,
			explanation: "Recorded property age from submitted site inspection"
		});
	}
	return result;
}
var floorNames = [
	"Stilt / basement",
	"Ground",
	"First",
	"Second",
	"Third",
	"Fourth"
];
var validPositive = (s) => s != null && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(s.trim()) && Number(s) > 0;
function VpInspectionValuationReview({ caseNum, canEdit, pending, onApply }) {
	const { tenant } = useApp();
	const [rectangular, setRectangular] = (0, import_react.useState)(false);
	const [transferAge, setTransferAge] = (0, import_react.useState)(false);
	const [floors, setFloors] = (0, import_react.useState)([]);
	const query = useQuery({
		queryKey: [
			"vp-p2-valuation-inspection",
			tenant.id,
			caseNum
		],
		enabled: caseNum > 0,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_p2_valuer_inspection_for_case", { p_case_num: caseNum });
			if (error) throw error;
			return data ?? null;
		},
		staleTime: 0
	});
	const history = useQuery({
		queryKey: [
			"vp-p2-transfer-history",
			tenant.id,
			caseNum
		],
		enabled: caseNum > 0,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_p2_transfer_history", { p_case_num: caseNum });
			if (error) throw error;
			return data ?? [];
		}
	});
	const sourceDiagnostic = query.error ? classifyReadRpcProbe(query.error) : null;
	const historyDiagnostic = history.error ? classifyReadRpcProbe(history.error) : null;
	const source = Object.fromEntries(Object.entries(query.data?.data ?? {}).map(([key, value]) => [key, value ?? ""]));
	const selection = {
		...rectangular ? { landAreaSqYd: { rectangular_confirmed: true } } : {},
		...floors.length ? { builtUpSqFt: { floors } } : {},
		...transferAge ? { ageYears: true } : {}
	};
	const result = (0, import_react.useMemo)(() => {
		try {
			return {
				proposals: proposeReviewedTransfer(source, selection),
				error: ""
			};
		} catch (error) {
			return {
				proposals: [],
				error: error instanceof Error ? error.message : String(error)
			};
		}
	}, [
		query.data,
		rectangular,
		floors,
		transferAge
	]);
	function apply() {
		if (!query.data || !canEdit || result.error || !result.proposals.length) return;
		const patch = {};
		for (const item of result.proposals) patch[item.field] = item.value;
		onApply(patch, {
			visitId: String(query.data.visit_id),
			updatedAt: query.data.updated_at,
			selection
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "sm:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "size-4" }), " P2 — Review submitted inspection measurements"]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Only a Field-QC-approved submitted inspection is eligible. This panel proposes measurements, not market rates. Selected values are applied to the unsaved valuation form; the server validates them again when you save."
				}),
				query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading submitted inspection measurements…" }),
				sourceDiagnostic && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "alert",
					className: "rounded border border-destructive/30 p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-destructive",
							children: ["P2 inspection integration: ", sourceDiagnostic.label]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: sourceDiagnostic.guidance
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["Original error: ", query.error?.message]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "No valuation or inspection data was changed."
						})
					]
				}),
				!query.isLoading && !query.error && !query.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No submitted and Field-QC-approved inspection is available for this case." }),
				query.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Source: visit #",
							query.data.visit_id,
							", submitted ",
							query.data.submitted_at,
							", revision ",
							query.data.updated_at
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex gap-3 rounded border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: rectangular,
							disabled: !canEdit || !validPositive(source["land_length"]) || !validPositive(source["land_breadth"]),
							onCheckedChange: (v) => setRectangular(v === true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Land area" }),
							": ",
							source["land_length"] || "—",
							" × ",
							source["land_breadth"] || "—",
							" ",
							source["measurement_unit"] || "units not supplied",
							". I confirmed the land has a regular rectangular shape and the measurements are suitable for valuation.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-amber-700",
								children: [
									"Inspection note: ",
									source["land_dimensions_note"] || "None",
									" — check any irregularity before confirming."
								]
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 font-semibold",
								children: "Built-up area — select only chargeable/eligible floors verified for this valuation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: floorNames.map((label, index) => {
									const key = `floor_area_${index}`;
									const checked = floors.includes(key);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked,
											disabled: !canEdit || !validPositive(source[key]),
											onCheckedChange: (value) => setFloors((old) => value === true ? [...old, key] : old.filter((x) => x !== key))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											label,
											": ",
											source[key] || "No measurement",
											" sq.ft"
										] })]
									}, key);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Stilt/basement is never included automatically. The selected sum is a suggestion, not certification of built-up area."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex gap-3 rounded border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: transferAge,
							disabled: !canEdit || source["property_age"] == null || !/^\d+(?:\.\d+)?$/.test(source["property_age"]),
							onCheckedChange: (v) => setTransferAge(v === true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Use inspected building age: ",
							source["property_age"] || "Not recorded",
							" years"
						] })]
					}),
					result.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-destructive",
						children: result.error
					}),
					result.proposals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-3 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Proposed changes (nothing saved yet)" }), result.proposals.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
								p.label,
								": ",
								p.value
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: p.explanation
							})]
						}, p.field))]
					}),
					pending?.visitId === String(query.data.visit_id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-amber-700",
						children: "Reviewed values are in your local draft. Click Save Draft or Submit valuation to persist them with a provenance audit. Any manual field edit clears this pending transfer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !canEdit || !!result.error || result.proposals.length === 0 || query.isFetching,
						onClick: apply,
						children: "Apply reviewed values to draft"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Reviewed transfer audit history" }),
						historyDiagnostic && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							role: "alert",
							className: "text-xs text-destructive",
							children: [
								"P2 history: ",
								historyDiagnostic.label,
								". ",
								historyDiagnostic.guidance
							]
						}),
						!history.isLoading && !history.error && !history.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No reviewed transfers saved for this case."
						}),
						(history.data ?? []).map((event, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "border-t py-2 text-xs",
							children: [
								event.created_at,
								" · Visit #",
								event.visit_id,
								" · Application user #",
								event.actor_user_id,
								" · ",
								event.submitted ? "Submitted" : "Draft",
								" · Fields: ",
								Object.keys(event.selection).join(", ")
							]
						}, `${event.created_at}-${index}`))
					]
				}),
				!canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Only authorized users at Report Draft can apply these values. Other stages are read-only."
				})
			]
		})]
	});
}
function useP19History(num, enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-p19-history",
			tenant.id,
			num
		],
		enabled,
		queryFn: () => collectPages(async (start, end) => {
			const { data, error } = await vpDb.from("vp_p19_analyses").select("version_no,link_version,effective_date,method,formula_version,inputs,results,created_by::text,created_at,evidence_snapshots,property_snapshot,inspection_snapshot").eq("org_id", tenant.id).eq("num", num).order("version_no", { ascending: false }).range(start, end);
			return {
				data,
				error
			};
		})
	});
}
function useP19Reviews(num, enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-p19-reviews",
			tenant.id,
			num
		],
		enabled,
		queryFn: () => collectPages(async (start, end) => {
			const { data, error } = await vpDb.from("vp_p19_reviews").select("version_no,decision,reason,reviewed_by::text,reviewed_at").eq("org_id", tenant.id).eq("num", num).order("version_no", { ascending: false }).range(start, end);
			return {
				data,
				error
			};
		})
	});
}
async function saveP19(num, link, date, method, input, expected) {
	const { data, error } = await vpDb.rpc("vp_p19_save", {
		p_num: num,
		p_link: link,
		p_date: date,
		p_method: method,
		p_input: input,
		p_expected: expected
	});
	if (error) throw error;
	return Number(data);
}
async function reviewP19(num, version, decision, reason) {
	const { error } = await vpDb.rpc("vp_p19_review", {
		p_num: num,
		p_version: version,
		p_decision: decision,
		p_reason: reason
	});
	if (error) throw error;
}
function VpP20Report({ num, bank, category, reportDraft }) {
	const { tenant } = useApp();
	const qc = useQueryClient();
	const perm = useVpReportPermissions();
	const view = perm.data?.view === true || perm.data?.prepare === true;
	const prepare = perm.data?.prepare === true;
	const templates = useP20Templates(view, bank, category);
	const exports = useP20Exports(num, view);
	const analyses = useP19History(num, view);
	const reviews = useP19Reviews(num, view);
	const links = useCasePropertyLinks(num);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const latest = analyses.data?.[0];
	const review = reviews.data?.find((r) => r.version_no === latest?.version_no);
	const template = templates.data?.[0];
	const ready = !!(prepare && reportDraft && latest && template && review?.decision === "Reviewed" && links.data?.[0]?.link_version === latest.link_version && analyses.isSuccess && reviews.isSuccess && templates.isSuccess && links.isSuccess);
	async function download(id) {
		if (busy) return;
		setBusy(true);
		setMsg("");
		try {
			let exportId = id;
			if (!exportId) {
				if (!ready || !latest || !template) throw new Error("Latest reviewed analysis and matching published template required");
				exportId = await prepareP20(num, latest.version_no, template.id);
				await qc.invalidateQueries({ queryKey: [
					"vp-p20-exports",
					tenant.id,
					num
				] });
			}
			const { row, template: stored } = await loadP20Export(tenant.id, num, exportId);
			await renderP20Workbook(stored.workbook_base64, stored.mapping, row.cell_values, row);
			setMsg(`Workbook generated from export register #${exportId}. Not officially released.`);
		} catch (e) {
			setMsg(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	if (!view) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "lg:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Bank-specific Excel workpaper"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded border p-2 text-muted-foreground",
					children: "Reviewed analysis export only. Official valuation, Final QC, released reports and PDF certification remain unchanged."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Latest analysis: ", latest ? `v${latest.version_no} · ${latest.method} · ${review?.decision ?? "Not reviewed"}` : "None"] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Matching template: ", template ? `#${template.id} · ${template.title}` : "No published template for this bank and category"] }),
				[
					templates.error,
					exports.error,
					analyses.error,
					reviews.error,
					links.error
				].filter(Boolean).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: propertyError(e)
				}, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !ready || busy,
					onClick: () => void download(),
					children: "Register & generate reviewed Excel"
				}),
				!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Requires Prepare permission, Report Draft stage, a current independently reviewed P19 version and matching template."
				}),
				msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-medium",
					children: "Registered exports (latest 100)"
				}),
				exports.data?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-t pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"#",
						r.id,
						" · Analysis v",
						r.analysis_version,
						" · Template #",
						r.template_id,
						" · ",
						r.prepared_at
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: busy,
						onClick: () => void download(r.id),
						children: "Regenerate workpaper"
					})]
				}, r.id))
			]
		})]
	});
}
var blank = () => ({
	label: "",
	area: "",
	unit: "sqyd",
	rate: "",
	age: "",
	life: "",
	salvage: "",
	source: ""
});
var numeric = (v) => v.trim() === "" ? null : Number(v);
var field = (label, value, set, type = "text") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
	className: "grid gap-1 text-xs",
	children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		type,
		step: type === "number" ? "any" : void 0,
		value,
		onChange: (e) => set(e.target.value)
	})]
});
var methods = {
	cost: "Land and building cost",
	comparison: "Registered sales comparison",
	income: "Income capitalization"
};
function Lines({ rows, set, floor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-medium",
				children: floor ? "Building floors" : "Land parcels"
			}),
			rows.map((r, i) => {
				const change = (k, v) => set(rows.map((x, j) => j === i ? {
					...x,
					[k]: v
				} : x));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 rounded border p-3 sm:grid-cols-3",
					children: [
						field(floor ? "Floor label" : "Parcel / survey reference", r.label, (v) => change("label", v)),
						field(floor ? "Area (sq.ft.)" : "Adopted area", r.area, (v) => change("area", v), "number"),
						!floor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "grid gap-1 text-xs",
							children: ["Area unit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "rounded border bg-background p-2",
								value: r.unit,
								onChange: (e) => change("unit", e.target.value),
								children: AREA_UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: u }, u))
							})]
						}),
						field(floor ? "Replacement rate ₹/sq.ft." : "Market rate ₹/sq.yd.", r.rate, (v) => change("rate", v), "number"),
						floor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							field("Age (years)", r.age, (v) => change("age", v), "number"),
							field("Useful life (years)", r.life, (v) => change("life", v), "number"),
							field("Residual value %", r.salvage, (v) => change("salvage", v), "number")
						] }),
						field("Measurement and rate evidence reference", r.source, (v) => change("source", v)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => set(rows.filter((_, j) => j !== i)),
							children: "Remove"
						})
					]
				}, i);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				disabled: rows.length >= 100,
				onClick: () => set([...rows, blank()]),
				children: ["Add ", floor ? "floor" : "parcel"]
			})
		]
	});
}
function P19Analysis({ num, category, canEdit, canView, reportDraft }) {
	const { tenant, can } = useApp();
	const qc = useQueryClient();
	const access = canView || canEdit || can("qc.View");
	const history = useP19History(num, access);
	const reviews = useP19Reviews(num, access);
	const links = useCasePropertyLinks(num);
	const link = links.data?.[0];
	const prop = usePropertyRevisions(link?.property_id ?? "").data?.find((r) => r.revision === link?.property_revision)?.data;
	const selected = useSelectedEvidence(num);
	const [method, setMethod] = (0, import_react.useState)(category === "Flat" ? "comparison" : "cost");
	const [date, setDate] = (0, import_react.useState)(today);
	const [parcels, setParcels] = (0, import_react.useState)([blank()]);
	const [floors, setFloors] = (0, import_react.useState)(category === "Land" ? [] : [blank()]);
	const [amenities, setAmenities] = (0, import_react.useState)("0");
	const [amenitySource, setAmenitySource] = (0, import_react.useState)("");
	const [basis, setBasis] = (0, import_react.useState)(category === "Land" ? "land" : "builtup");
	const [area, setArea] = (0, import_react.useState)("");
	const [areaSource, setAreaSource] = (0, import_react.useState)("");
	const [chosen, setChosen] = (0, import_react.useState)({});
	const [rent, setRent] = (0, import_react.useState)("");
	const [vacancy, setVacancy] = (0, import_react.useState)("");
	const [expenses, setExpenses] = (0, import_react.useState)("");
	const [cap, setCap] = (0, import_react.useState)("");
	const [rentSource, setRentSource] = (0, import_react.useState)("");
	const [capSource, setCapSource] = (0, import_react.useState)("");
	const [guide, setGuide] = (0, import_react.useState)("");
	const [guideSource, setGuideSource] = (0, import_react.useState)("");
	const [real, setReal] = (0, import_react.useState)("");
	const [distress, setDistress] = (0, import_react.useState)("");
	const [disposal, setDisposal] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [reviewReason, setReviewReason] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const latest = history.data?.[0];
	const eligible = (selected.data ?? []).filter((s) => s.link_version === link?.link_version && s.effective_date === date && s.snapshot.status === "verified" && s.snapshot.kind === "registered_sale" && s.snapshot.category === category && s.snapshot.area_basis === basis);
	const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: [
		"vp-p19-history",
		tenant.id,
		num
	] }), qc.invalidateQueries({ queryKey: [
		"vp-p19-reviews",
		tenant.id,
		num
	] })]);
	async function save() {
		if (!link || !history.isSuccess || !links.isSuccess || busy) return;
		setBusy(true);
		setMessage("");
		try {
			const data = {
				reason,
				disposal_source: disposal,
				realizable_pct: numeric(real),
				distress_pct: numeric(distress),
				guideline_amount: numeric(guide),
				guideline_source: guideSource
			};
			if (method === "cost") Object.assign(data, {
				parcels: parcels.map((r) => ({
					...r,
					area: numeric(r.area),
					rate: numeric(r.rate)
				})),
				floors: floors.map((r) => ({
					...r,
					area: numeric(r.area),
					rate: numeric(r.rate),
					age: numeric(r.age),
					life: numeric(r.life),
					salvage: numeric(r.salvage)
				})),
				amenities: numeric(amenities),
				amenities_source: amenitySource
			});
			if (method === "comparison") Object.assign(data, {
				basis,
				subject_area: numeric(area),
				area_source: areaSource,
				comparables: eligible.filter((s) => chosen[s.evidence_id]).map((s) => ({
					evidence_id: s.evidence_id,
					adjustment: numeric(chosen[s.evidence_id].adjustment),
					reason: chosen[s.evidence_id].reason
				}))
			});
			if (method === "income") Object.assign(data, {
				monthly_rent: numeric(rent),
				vacancy_pct: numeric(vacancy),
				annual_expenses: numeric(expenses),
				cap_rate_pct: numeric(cap),
				rent_source: rentSource,
				cap_source: capSource
			});
			const v = await saveP19(num, link.link_version, date, method, data, latest?.version_no ?? 0);
			await refresh();
			setMessage(`Analysis v${v} recorded by server. Official report unchanged.`);
		} catch (e) {
			setMessage(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	async function review(decision) {
		if (!latest || busy) return;
		setBusy(true);
		setMessage("");
		try {
			await reviewP19(num, latest.version_no, decision, reviewReason);
			await refresh();
			setReviewReason("");
			setMessage("Analysis review recorded. Official QC unchanged.");
		} catch (e) {
			setMessage(propertyError(e));
		} finally {
			setBusy(false);
		}
	}
	if (!access) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "lg:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Advanced valuation analysis"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded border p-2 text-muted-foreground",
					children: "Evidence-backed analysis workpapers only. Server calculates every saved version. No automatic transfer to the legacy official valuation, QC or bank report. Adopted inputs require professional verification."
				}),
				history.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: propertyError(history.error)
				}),
				reviews.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-destructive",
					children: propertyError(reviews.error)
				}),
				canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					links.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: propertyError(links.error) }),
					link ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"PM-",
						link.property_id,
						" · pinned revision ",
						link.property_revision,
						" · association ",
						link.link_version
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Link a property in Overview first." }),
					prop && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Recorded parcel measurements (reference only)" }),
						prop.parcels.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							p.survey_no || p.plot_no,
							" · Deed: ",
							p.deed_area ?? "—",
							" ",
							p.deed_unit,
							" · Actual: ",
							p.actual_area ?? "—",
							" ",
							p.actual_unit
						] }, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: busy || !prop.parcels.length,
							onClick: () => setParcels(prop.parcels.map((p) => ({
								...blank(),
								label: p.survey_no || p.plot_no,
								area: p.actual_area === null ? "" : String(p.actual_area),
								unit: p.actual_unit,
								source: `PM-${link?.property_id} r${link?.property_revision}, actual extent (verify)`
							}))),
							children: "Copy actual extents to cost workpaper"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						disabled: busy,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "grid gap-1",
									children: ["Method", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "rounded border bg-background p-2",
										value: method,
										onChange: (e) => setMethod(e.target.value),
										children: Object.keys(methods).filter((m) => !(category === "Flat" && m === "cost") && !(category === "Land" && m === "income")).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: m,
											children: methods[m]
										}, m))
									})]
								}), field("Valuation effective date", date, setDate, "date")]
							}),
							method === "cost" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, {
									rows: parcels,
									set: setParcels,
									floor: false
								}),
								category !== "Land" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, {
									rows: floors,
									set: setFloors,
									floor: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 sm:grid-cols-2",
									children: [field("Additional improvements ₹", amenities, setAmenities, "number"), field("Improvements evidence", amenitySource, setAmenitySource)]
								})
							] }),
							method === "comparison" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "grid gap-1",
											children: ["Comparable basis", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												className: "rounded border bg-background p-2",
												value: basis,
												onChange: (e) => {
													setBasis(e.target.value);
													setChosen({});
												},
												children: Object.keys(BASES).filter((b) => category === "Land" ? b === "land" : b !== "land").map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: b,
													children: BASES[b]
												}, b))
											})]
										}),
										field(`Adopted subject area (${basis === "land" ? "sq.yd." : "sq.ft."})`, area, setArea, "number"),
										field("Subject measurement source", areaSource, setAreaSource)
									]
								}),
								selected.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									role: "alert",
									children: propertyError(selected.error)
								}),
								eligible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose verified registered sales in Overview for the same effective date and area basis." }),
								eligible.map((s) => {
									const ch = chosen[s.evidence_id];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 rounded border p-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														checked: !!ch,
														onChange: (e) => setChosen((old) => {
															const next = { ...old };
															if (e.target.checked) next[s.evidence_id] = {
																adjustment: "",
																reason: ""
															};
															else delete next[s.evidence_id];
															return next;
														})
													}),
													s.snapshot.label,
													" · ",
													fmtINR(Number(s.snapshot.amount)),
													" / ",
													s.snapshot.area,
													" ",
													s.snapshot.area_unit
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs",
												children: s.snapshot.source_ref
											}),
											ch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid gap-2 sm:grid-cols-2",
												children: [field("Net adjustment % (+/-)", ch.adjustment, (v) => setChosen((old) => ({
													...old,
													[s.evidence_id]: {
														...ch,
														adjustment: v
													}
												})), "number"), field("Adjustment rationale", ch.reason, (v) => setChosen((old) => ({
													...old,
													[s.evidence_id]: {
														...ch,
														reason: v
													}
												})))]
											})
										]
									}, s.evidence_id);
								})
							] }),
							method === "income" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-3",
								children: [
									field("Monthly market rent ₹", rent, setRent, "number"),
									field("Vacancy %", vacancy, setVacancy, "number"),
									field("Annual operating expenses ₹", expenses, setExpenses, "number"),
									field("Capitalization rate %", cap, setCap, "number"),
									field("Rent and expense evidence", rentSource, setRentSource),
									field("Capitalization rate evidence", capSource, setCapSource)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 border-t pt-3 sm:grid-cols-2",
								children: [
									field("Government guideline total ₹ (optional)", guide, setGuide, "number"),
									field("Guideline source / effective date", guideSource, setGuideSource),
									field("Realizable % of indicative value", real, setReal, "number"),
									field("Distress % of indicative value", distress, setDistress, "number"),
									field("Disposal assumptions and evidence", disposal, setDisposal),
									field("Method and adopted input rationale", reason, setReason)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || !link || !history.isSuccess || !links.isSuccess || !reason.trim() || !disposal.trim() || method === "comparison" && !selected.isSuccess,
								onClick: () => void save(),
								children: "Calculate and save analysis version"
							})
						]
					})
				] }),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "rounded border p-2",
					children: message
				}),
				history.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading analysis versions…" }),
				history.isSuccess && !history.data.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No saved analysis." }),
				history.data?.map((a) => {
					const reviewRow = reviews.data?.find((r) => r.version_no === a.version_no);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						open: a.version_no === latest?.version_no,
						className: "rounded border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
								className: "cursor-pointer font-medium",
								children: [
									"v",
									a.version_no,
									" · ",
									methods[a.method],
									" · ",
									a.effective_date,
									" · ",
									fmtINR(Number(a.results["marketValue"])),
									" · ",
									reviewRow?.decision ?? "Unreviewed"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Link v",
									a.link_version,
									" · ",
									a.formula_version,
									" · ",
									a.created_at
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 py-2 sm:grid-cols-3",
								children: Object.entries(a.results).filter(([, v]) => typeof v === "number" || v === null).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: v === null ? "Not assessed" : k === "count" || k === "capRatePct" ? String(v) : k === "adoptedRate" ? `${fmtINR(Number(v))}/${a.results["basis"] === "land" ? "sq.yd." : "sq.ft."}` : fmtINR(Number(v)) })] }, k))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Inputs, line calculations and evidence snapshot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "max-h-80 overflow-auto whitespace-pre-wrap break-all text-xs",
								children: JSON.stringify({
									inputs: a.inputs,
									results: a.results,
									evidence: a.evidence_snapshots,
									property: a.property_snapshot,
									approvedInspection: a.inspection_snapshot
								}, null, 2)
							})] }),
							reviewRow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								reviewRow.decision,
								": ",
								reviewRow.reason,
								" · ",
								reviewRow.reviewed_at
							] }),
							a.version_no === latest?.version_no && !reviewRow && reviews.isSuccess && reportDraft && can("qc.Edit") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2",
								children: [
									field("Independent review reason", reviewReason, setReviewReason),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											disabled: busy || !reviewReason.trim(),
											onClick: () => void review("Reviewed"),
											children: "Mark reviewed"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											disabled: busy || !reviewReason.trim(),
											onClick: () => void review("Returned"),
											children: "Return workpaper"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Does not approve or return the official case QC task."
									})
								]
							})
						]
					}, a.version_no);
				})
			]
		})]
	});
}
var fields = [
	{
		key: "landAreaSqYd",
		label: "Land area (sq.yd)"
	},
	{
		key: "landRate",
		label: "Market land rate (₹/sq.yd)"
	},
	{
		key: "guidelineRate",
		label: "Guideline rate (₹/sq.yd)"
	},
	{
		key: "builtUpSqFt",
		label: "Built-up area (sq.ft)"
	},
	{
		key: "constructionRate",
		label: "Construction rate (₹/sq.ft)"
	},
	{
		key: "ageYears",
		label: "Building age (yrs)"
	},
	{
		key: "lifeYears",
		label: "Total life (yrs)"
	},
	{
		key: "salvagePct",
		label: "Salvage value (%)"
	},
	{
		key: "amenities",
		label: "Amenities (₹)"
	},
	{
		key: "realizablePct",
		label: "Realizable (% of FMV)"
	},
	{
		key: "distressPct",
		label: "Distress (% of FMV)"
	}
];
var empty = {
	landAreaSqYd: 0,
	landRate: 0,
	guidelineRate: 0,
	builtUpSqFt: 0,
	constructionRate: 0,
	ageYears: 0,
	lifeYears: 0,
	salvagePct: 0,
	amenities: 0,
	realizablePct: 0,
	distressPct: 0
};
function CaseDossier() {
	const { caseId } = Route.useParams();
	const { tenant } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseDossierWorkspace, {}, String(tenant.id) + ":" + caseId);
}
function CaseDossierWorkspace() {
	const { caseId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseDossierContent, { caseId }, caseId);
}
function CaseDossierContent({ caseId }) {
	const [section, setSection] = (0, import_react.useState)("overview");
	const [documentsOpened, setDocumentsOpened] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (section === "documents") setDocumentsOpened(true);
	}, [section]);
	const { tenant, capabilities } = useApp();
	const { allCases, isLoading, error } = useVpCases();
	const c = allCases.find((x) => x.id === caseId);
	const [inp, setInp] = (0, import_react.useState)(empty);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [pendingTransfer, setPendingTransfer] = (0, import_react.useState)(null);
	const reportPermissions = useVpReportPermissions();
	const form = useVpValuationForm(Number(caseId));
	const versions = useVpValuationVersions(Number(caseId));
	const reports = useVpReportVersions();
	const [vp29SelectedVersion, setVp29SelectedVersion] = (0, import_react.useState)(null);
	const vp29ReportHistory = reports.isSuccess && !reports.isPlaceholderData ? caseReportHistory(reports.data ?? [], Number(caseId)) : [];
	const vp29ReleasedHistory = releasedHistory(vp29ReportHistory);
	const released = chooseReleasedReport(vp29ReportHistory, vp29SelectedVersion);
	const vp29Provenance = released ? reportProvenance(released) : null;
	const loadedKey = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (form.isPlaceholderData) return;
		const value = form.data?.data?.valuation_inputs;
		const key = `${caseId}:${form.data?.updated ?? ""}`;
		if (!value || loadedKey.current === key) return;
		if (VALUATION_KEYS.every((k) => typeof value[k] === "number" && Number.isFinite(value[k]))) {
			setInp(value);
			loadedKey.current = key;
		}
	}, [caseId, form.data]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const qc = useQuery({
		queryKey: [
			"vp-case-log",
			tenant.id,
			caseId
		],
		enabled: !!c,
		queryFn: async () => {
			const { data, error } = await vpDb.from("log").select("id,at,by,msg").eq("org_id", tenant.id).eq("num", Number(caseId)).order("id", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const docs = useVpCaseDocuments(Number(caseId));
	const queryClient = useQueryClient();
	const v = (0, import_react.useMemo)(() => computeValuation(inp), [inp]);
	const canEditAdvancedValuation = c?.stage === "Report Draft" && reportPermissions.data?.edit === true;
	const [p28Adopting, setP28Adopting] = (0, import_react.useState)(false);
	const { can: p28Can } = useApp();
	const p28CanRead = reportPermissions.data?.view === true || reportPermissions.data?.edit === true || p28Can("qc.View") || p28Can("qc.Edit");
	const p28Official = useVpOfficialSummary(String(tenant.id), c?.caseNum ?? 0, !!c && p28CanRead);
	const canEditValuation = canEditAdvancedValuation && form.isSuccess && !form.isPlaceholderData && p28Official.isSuccess && !p28Official.isPlaceholderData && !p28Official.isFetching && p28Official.data?.advanced === false && !p28Adopting;
	async function persist(submit) {
		if (!canEditValuation || saving) {
			toast.error("Legacy valuation is locked or unavailable. Reload the case.");
			return;
		}
		if (!c) return;
		setSaving(true);
		try {
			const freshOfficial = await p28Official.refetch();
			if (freshOfficial.isError || freshOfficial.data?.advanced !== false || freshOfficial.data.version !== p28Official.data?.version) throw new Error("Official valuation changed or is unavailable. Reload the case.");
			const result = pendingTransfer ? await (async () => {
				const { data, error } = await vpDb.rpc("vp_p2_save_reviewed_valuation", {
					p_case_num: c.caseNum,
					p_input: inp,
					p_submit: submit,
					p_visit_id: pendingTransfer.visitId,
					p_source_revision: pendingTransfer.updatedAt,
					p_selection: pendingTransfer.selection
				});
				if (error) throw error;
				return data;
			})() : await saveVpValuation(c.caseNum, inp, submit);
			setPendingTransfer(null);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [
					"vp-p2-transfer-history",
					tenant.id,
					c.caseNum
				] }),
				queryClient.invalidateQueries({ queryKey: [
					"vp-valuation-form",
					tenant.id,
					c.caseNum
				] }),
				queryClient.invalidateQueries({ queryKey: [
					"vp-valuation-versions",
					tenant.id,
					c.caseNum
				] }),
				queryClient.invalidateQueries({ queryKey: [
					"vp-case-log",
					tenant.id,
					caseId
				] })
			]);
			toast.success(submit ? `Valuation v${result.version_no} submitted — send case to Final QC` : "Draft saved (calculation verified on server)");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Valuation save failed");
		} finally {
			await p28Official.refetch();
			setSaving(false);
		}
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Case dossier",
		description: "Loading case…"
	}) });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Case dossier",
		description: `Database error: ${error.message}`
	}) });
	if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Case not found",
		description: "This case does not exist in your organization."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		variant: "outline",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: mayOpenPath("/cases", capabilities) ? "/cases" : "/",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), "Back to workspace"]
		})
	})] });
	async function uploadFile(file) {
		if (!file) return;
		setUploading(true);
		try {
			await uploadVpCaseDocument(tenant.id, c.caseNum, file);
			await queryClient.invalidateQueries({ queryKey: [
				"vp-case-documents",
				tenant.id,
				c.caseNum
			] });
			await queryClient.invalidateQueries({ queryKey: [
				"vp-case-log",
				tenant.id,
				caseId
			] });
			toast.success("Document uploaded and registered");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Document upload failed");
		} finally {
			setUploading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vp-case-layout print:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				className: "mb-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: mayOpenPath("/cases", capabilities) ? "/cases" : "/",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), mayOpenPath("/cases", capabilities) ? "All cases" : "Workspace"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
				title: c.caseNo,
				description: `${c.property} · ${c.bank} · ${c.branchName}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TatBadge, { c }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: !released,
					onClick: () => window.print(),
					title: released ? "Print released-report summary" : "Only a released report is printable",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 size-4" }), "Print released summary"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseProgress, {
				stage: c.stage,
				dbStage: c.dbStage
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseContext, {
				record: c,
				documentCount: docs.data?.length,
				loading: docs.isLoading,
				failed: !!docs.error,
				onOpen: (next) => {
					setSection(next);
					requestAnimationFrame(() => document.querySelector(`[data-vp-case-tab="${next}"]`)?.focus());
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: section,
				onValueChange: (v) => setSection(v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						"aria-label": "Case workspace sections",
						className: "vp-case-tabs w-full justify-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "overview",
								value: "overview",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "overview",
									className: "size-4 shrink-0"
								}), "Overview"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "documents",
								value: "documents",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "documents",
									className: "size-4 shrink-0"
								}), "Documents"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "property",
								value: "property",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "property",
									className: "size-4 shrink-0"
								}), "Property"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "inspection",
								value: "inspection",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "inspection",
									className: "size-4 shrink-0"
								}), "Inspection & QC"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "valuation",
								value: "valuation",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "valuation",
									className: "size-4 shrink-0"
								}), "Valuation"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "certificate",
								value: "certificate",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "certificate",
									className: "size-4 shrink-0"
								}), "Report"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								"data-vp-case-tab": "history",
								value: "history",
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, {
									name: "history",
									className: "size-4 shrink-0"
								}), "History"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "overview",
						className: "grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm",
							children: "Property"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.property }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground",
									children: [
										c.propertyType,
										" · ",
										c.city
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Customer: ", c.customer] })
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm",
							children: "Assignment"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Valuer: ", c.assignedTo] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Priority: ", c.priorityKnown ? c.priority : "—"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Fee: ", c.feeKnown ? fmtINR(c.fee) : "—"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Due: ", c.due] })
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "property",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaseProperty, { num: c.caseNum }, c.caseNum)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "inspection",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpCaseLinkedRecords, {
							caseNum: c.caseNum,
							bankName: c.bank
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "history",
						className: "space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm",
							children: "Case activity"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-2 text-sm",
							children: qc.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: qc.error.message
							}) : (qc.data ?? []).length ? (qc.data ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "mr-2",
									children: n.at
								}),
								n.msg,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 text-muted-foreground",
									children: [
										"(",
										n.by,
										")"
									]
								})
							] }, n.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "No activity recorded."
							})
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "documents",
						forceMount: true,
						className: "data-[state=inactive]:hidden",
						children: (documentsOpened || section === "documents") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpDocumentWorkbench, {
							caseNum: c.caseNum,
							documents: docs.data ?? [],
							loading: docs.isLoading,
							error: docs.error?.message,
							uploading,
							onUpload: (file) => void uploadFile(file)
						}, `${tenant.id}:${c.caseNum}`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "valuation",
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-card p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: "Valuation workbench"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted-foreground",
									children: "Review advanced analysis and inspection evidence below. The existing official land-and-building submission remains separate; advanced analysis is not automatically adopted into the released report."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(P19Analysis, {
									num: c.caseNum,
									category: c.propertyType,
									canEdit: canEditAdvancedValuation,
									canView: reportPermissions.data?.view === true,
									reportDraft: c.stage === "Report Draft"
								}, c.caseNum), p28Official.isSuccess && !p28Official.isPlaceholderData && p28Official.data?.advanced === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpInspectionValuationReview, {
									caseNum: c.caseNum,
									canEdit: canEditValuation,
									pending: pendingTransfer,
									onApply: (patch, transfer) => {
										if (Object.entries(patch).some(([key, next]) => {
											const before = inp[key];
											return before > 0 && before !== next;
										}) && !window.confirm("Replace existing nonzero valuation values with reviewed inspection measurements?")) return;
										setInp((old) => ({
											...old,
											...patch
										}));
										setPendingTransfer(transfer);
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid items-start gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]",
								children: [p28Official.isSuccess && !p28Official.isPlaceholderData && p28Official.data?.advanced === false && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "size-4" }), "Land & Building method inputs"]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "grid gap-3 sm:grid-cols-2",
									children: [fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: f.key,
											className: "text-xs",
											children: f.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: f.key,
											type: "number",
											min: 0,
											step: "any",
											disabled: !canEditValuation || saving,
											value: inp[f.key],
											onChange: (e) => {
												setPendingTransfer(null);
												setInp({
													...inp,
													[f.key]: Number(e.target.value) || 0
												});
											}
										})]
									}, f.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													form.error ? `Database error: ${form.error.message}` : form.data ? `Saved ${form.data.status} · ${form.data.updated}` : "No valuation saved yet.",
													" ",
													versions.data?.length ? `· ${versions.data.length} submitted version(s)` : ""
												]
											}),
											canEditValuation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													disabled: saving || form.isLoading,
													variant: "outline",
													onClick: () => void persist(false),
													children: "Save draft"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													disabled: saving || form.isLoading,
													onClick: () => void persist(true),
													children: "Submit valuation for Final QC"
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: c.stage !== "Report Draft" ? "Editing is locked until Report Draft (or returned rework)." : "Your role lacks Valuation Edit permission, or permission loading failed."
											}),
											reportPermissions.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-destructive",
												children: ["Permission check: ", reportPermissions.error.message]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Your calculated preview is not a certified valuation. PostgreSQL independently recalculates and stores each submitted version."
											})
										]
									})]
								})] }), p28Official.isSuccess && !p28Official.isPlaceholderData && p28Official.data?.advanced === false && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-sm",
									children: "Computed values (local preview)"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueGraphic, {
											market: v.marketValue,
											realizable: v.realizableValue,
											distress: v.distressValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Land value",
											v: v.landValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Replacement cost",
											v: v.replacementCost
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: `Depreciation (${v.depreciationPct}%)`,
											v: -v.depreciation
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Depreciated building value",
											v: v.buildingValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Amenities",
											v: inp.amenities
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "border-t pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												l: "Fair Market Value",
												v: v.marketValue,
												strong: true
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Realizable value",
											v: v.realizableValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Distress / forced sale value",
											v: v.distressValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Guideline value",
											v: v.guidelineValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "pt-2 text-xs text-muted-foreground",
											children: rupeesInWords(v.marketValue)
										})
									]
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "certificate",
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 rounded-lg border bg-card p-4 print:hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-sm",
											children: "Report version history"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											disabled: reports.isFetching,
											onClick: () => void reports.refetch(),
											children: "Refresh reports"
										})]
									}),
									reports.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading report history..." }),
									reports.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										role: "alert",
										className: "text-sm text-destructive",
										children: "Report history could not be retrieved."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2 sm:grid-cols-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border p-2",
												children: ["Total versions: ", vp29ReportHistory.length]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border p-2",
												children: ["Released: ", vp29ReleasedHistory.length]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border p-2",
												children: ["Drafts: ", vp29ReportHistory.length - vp29ReleasedHistory.length]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block space-y-1 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Released report version" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "w-full rounded-md border bg-background p-2",
											value: vp29SelectedVersion ?? "latest",
											disabled: !vp29ReleasedHistory.length,
											onChange: (e) => setVp29SelectedVersion(e.target.value === "latest" ? null : e.target.value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "latest",
												children: "Latest released report"
											}), vp29ReleasedHistory.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: String(reportVersion(row)),
												children: ["Version ", reportVersion(row)]
											}, reportVersion(row)))]
										})]
									}),
									vp29SelectedVersion !== null && !released && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										role: "alert",
										className: "text-sm text-destructive",
										children: "Selected version is unavailable. Select an accessible released version."
									}),
									reportPermissions.data?.view === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportDraftPack, {
										orgId: String(tenant.id),
										num: Number(caseId),
										versions: vp29ReportHistory.map((row) => ({
											version: reportVersion(row),
											status: String(row.status)
										}))
									}, String(tenant.id) + ":" + caseId),
									released && reportPermissions.data?.view === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleasedReportReadback, {
										orgId: String(tenant.id),
										num: Number(caseId),
										version: reportVersion(released)
									}, String(tenant.id) + ":" + caseId + ":" + reportVersion(released)),
									vp29Provenance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
										children: [
											["Report version", vp29Provenance.reportVersion],
											["Official valuation version", vp29Provenance.valuationVersion ?? "Not recorded"],
											["Bank", vp29Provenance.bank],
											["Report format", vp29Provenance.format],
											["Valuation method", vp29Provenance.method],
											["Registered Excel workpaper", vp29Provenance.workpaper],
											["Released at", vp29Provenance.releasedAt],
											["Valuer registration", vp29Provenance.registration],
											["Status", vp29Provenance.status]
										].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 rounded-md border p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "break-words text-sm font-medium",
												children: value
											})]
										}, String(label)))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "The summary and stored PDF below correspond to the selected released report. Drafts cannot be selected as released certificates. Historical values are not recalculated from current property data."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP20Report, {
								num: c.caseNum,
								bank: c.bank,
								category: c.propertyType,
								reportDraft: c.stage === "Report Draft"
							}, `p20-${c.caseNum}`),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpOfficialValuation, {
								orgId: String(tenant.id),
								num: c.caseNum,
								bank: c.bank,
								category: c.propertyType,
								summary: p28Official,
								canRead: p28CanRead,
								canAdopt: canEditAdvancedValuation && !saving && !p28Adopting,
								onBusy: setP28Adopting
							}, String(tenant.id) + ":" + c.caseNum),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "mx-auto max-w-3xl print:border-0 print:shadow-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-3 p-4 text-sm sm:p-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-semibold",
										children: "Released report summary"
									}), released ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												"Released report v",
												released.version_no,
												" · ",
												released.format_name,
												" · ",
												released.released_at
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											"Property: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: released.case_snapshot["property_address"] }),
											" · Bank: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: released.case_snapshot["bank"] })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Land value",
											v: released.calculations_snapshot.landValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Building value",
											v: released.calculations_snapshot.buildingValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Fair Market Value",
											v: released.calculations_snapshot.marketValue,
											strong: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Realizable Value",
											v: released.calculations_snapshot.realizableValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											l: "Distress Value",
											v: released.calculations_snapshot.distressValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: [
												"Released by internally checked registration ",
												released.released_reg_no,
												". This screen is an internal summary and does not constitute a cryptographic digital signature or the bank-specific uploaded PDF."
											]
										}),
										released.file_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "print:hidden",
											variant: "outline",
											onClick: () => void viewVpReportPdf(released.file_path).catch((e) => toast.error(String(e))),
											children: "View actual PDF securely"
										})
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "No report has been released for this case. A submitted valuation, Final QC approval, bank-format PDF and authorized release are required."
									})]
								})
							})
						]
					})
				]
			})
		]
	}), released && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden print:block p-8 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Released Valuation Summary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				released.case_snapshot["case_number"],
				" · ",
				released.format_name
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: released.case_snapshot["property_address"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				l: "Market value",
				v: released.calculations_snapshot.marketValue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				l: "Realizable",
				v: released.calculations_snapshot.realizableValue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				l: "Distress",
				v: released.calculations_snapshot.distressValue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6",
				children: [
					"Internal release record · ",
					released.released_reg_no,
					" · ",
					released.released_at,
					". Not a digital signature. Refer to the stored bank-format PDF."
				]
			})
		]
	})] });
}
function Row({ l, v, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-wrap justify-between gap-x-3 gap-y-1 ${strong ? "font-semibold" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums",
			children: typeof v === "number" && Number.isFinite(v) ? fmtINR(v) : "Not available"
		})]
	});
}
async function vpReadbackRow(request) {
	const { data, error } = await request;
	if (error) throw new Error(typeof error === "object" && error !== null && "message" in error ? String(error.message) : "Record readback failed");
	if (!data || typeof data !== "object" || Array.isArray(data)) return null;
	return data;
}
function ReleasedReportReadback({ orgId, num, version }) {
	const verification = useQuery({
		queryKey: [
			"vp-report-readback",
			orgId,
			num,
			version
		],
		enabled: false,
		retry: false,
		gcTime: 0,
		staleTime: 0,
		queryFn: async () => {
			const report = await vpReadbackRow(vpDb.from("vp_report_versions").select("org_id,num,version_no,valuation_version_no,status,final_qc_task_id,case_snapshot,inputs_snapshot,calculations_snapshot,file_path").eq("org_id", orgId).eq("num", num).eq("version_no", version).eq("status", "Released").maybeSingle());
			if (!report) throw new Error("Released report is unavailable or access denied");
			const valuationVersion = report["valuation_version_no"];
			if (typeof valuationVersion !== "number" || !Number.isSafeInteger(valuationVersion) || valuationVersion <= 0) throw new Error("Invalid official valuation reference");
			const official = await vpReadbackRow(vpDb.from("vp_valuation_versions").select("org_id,num,version_no,method,inputs,calculations").eq("org_id", orgId).eq("num", num).eq("version_no", valuationVersion).maybeSingle());
			const qcId = reportIdentifier(report["final_qc_task_id"]);
			const qc = qcId ? await vpReadbackRow(vpDb.from("vp_qc_tasks").select("id,org_id,num,review_stage,status").eq("org_id", orgId).eq("num", num).eq("id", qcId).maybeSingle()) : null;
			const caseSnapshot = report["case_snapshot"];
			const exportId = reportIdentifier(caseSnapshot?.["p20_export_id"]);
			const workpaper = exportId ? await vpReadbackRow(vpDb.from("vp_p20_exports").select("id,org_id,num,analysis_version,template_id,cell_values").eq("org_id", orgId).eq("num", num).eq("id", exportId).maybeSingle()) : null;
			const templateId = reportIdentifier(workpaper?.["template_id"]);
			const template = templateId ? await vpReadbackRow(vpDb.from("vp_p20_templates").select("id,org_id,bank_name,category,title,published_at,mapping").eq("org_id", orgId).eq("id", templateId).maybeSingle()) : null;
			const checks = checkReportSnapshots(report, official, qc, workpaper, template);
			try {
				const artifact = await vpDb.rpc("vp_report_artifact_readback", {
					p_case_num: num,
					p_version: version
				});
				if (artifact.error) throw artifact.error;
				checks.push(parseReleaseArtifactReadback(artifact.data));
			} catch {
				checks.push({
					label: "Release-time storage metadata",
					status: "Unavailable",
					detail: "Artifact verification service unavailable or access denied."
				});
			}
			let bankMappings = null;
			let bankMappingError = null;
			if (exportId) try {
				if ([
					"Official valuation reference",
					"Valuation inputs",
					"Valuation calculations",
					"Adopted workpaper reference",
					"Original bank template"
				].some((label) => checks.find((check) => check.label === label)?.status !== "Matched")) throw new Error("Official valuation and workpaper references must match");
				bankMappings = buildBankMappingReadback(report, workpaper, template);
			} catch (error) {
				bankMappingError = error instanceof Error ? error.message : "Bank mapping readback failed";
			}
			let fingerprint = null;
			let fileError = null;
			try {
				if (!validReportPdfPath(report["file_path"], orgId, num)) throw new Error("Missing or invalid registered PDF path");
				const { data: blob, error } = await vpDb.storage.from("vp-report-files").download(report["file_path"]);
				if (error || !blob) throw new Error("Stored PDF unavailable or access denied");
				if (blob.size < 5 || blob.size > 20971520) throw new Error("Unexpected PDF file size");
				const bytes = await blob.arrayBuffer();
				if (!hasPdfHeader(new Uint8Array(bytes))) throw new Error("Stored file has an invalid PDF header");
				if (!globalThis.crypto?.subtle) throw new Error("SHA-256 requires a secure browser context");
				const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
				fingerprint = {
					sha256: Array.from(new Uint8Array(digest)).map((n) => n.toString(16).padStart(2, "0")).join(""),
					bytes: blob.size
				};
			} catch (error) {
				fileError = error instanceof Error ? error.message : "PDF readback failed";
			}
			return {
				checks,
				bankMappings,
				bankMappingError,
				fingerprint,
				fileError,
				checkedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		}
	});
	function checkClass(status) {
		if (status === "Matched") return "text-emerald-700";
		if (status === "Mismatch") return "text-destructive";
		return "text-muted-foreground";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 rounded-md border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-medium",
					children: "Report snapshot verification"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					disabled: verification.isFetching,
					onClick: () => void verification.refetch(),
					children: verification.isFetching ? "Reading stored records..." : "Verify released records"
				})]
			}),
			!verification.data && !verification.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Compare this released version with its referenced official valuation, Final QC, workpaper and registered PDF."
			}),
			verification.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: verification.error.message
			}),
			verification.isSuccess && !verification.isFetching && verification.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y rounded-md border",
					children: verification.data.checks.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-between gap-2 p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: check.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: check.detail
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium " + checkClass(check.status),
							children: check.status
						})]
					}, check.label))
				}),
				verification.data.bankMappingError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "text-sm text-destructive",
					children: ["Bank mapping: ", verification.data.bankMappingError]
				}),
				verification.data.bankMappings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankWorkbookReadback, { mappings: verification.data.bankMappings }, verification.data.checkedAt),
				verification.data.fingerprint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 rounded-md border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Stored PDF fingerprint"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs",
							children: [verification.data.fingerprint.bytes.toLocaleString(), " bytes"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "break-all font-mono text-xs",
							children: verification.data.fingerprint.sha256
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Calculated from the currently downloaded bytes. No release-time hash comparison is available. This is not digital signature verification."
						})
					]
				}),
				verification.data.fileError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "text-sm text-destructive",
					children: ["PDF: ", verification.data.fileError]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Readback performed at ",
						verification.data.checkedAt,
						". These checks do not modify the report or its approval."
					]
				})
			] })
		]
	});
}
function BankWorkbookReadback({ mappings }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [results, setResults] = (0, import_react.useState)(null);
	const sourceMismatch = mappings.some((item) => item.reference === "Mismatch");
	async function verifyWorkbook(file) {
		if (busy || sourceMismatch) return;
		setBusy(true);
		setResults(null);
		setError(null);
		setFileName(file.name);
		try {
			if (!/\.xlsx$/i.test(file.name) || file.size < 4 || file.size > 5242880) throw new Error("Select a trusted .xlsx workpaper up to 5 MB");
			const bytes = await file.arrayBuffer();
			const signature = new Uint8Array(bytes, 0, 4);
			if (signature[0] !== 80 || signature[1] !== 75 || signature[2] !== 3 || signature[3] !== 4) throw new Error("Invalid XLSX file signature");
			const imported = await import("../_libs/xlsx-populate.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			const reader = imported.default ?? imported;
			if (typeof reader.fromDataAsync !== "function") throw new Error("Existing Excel reader is unavailable");
			const workbook = await reader.fromDataAsync(bytes);
			const checked = mappings.map((mapping) => {
				try {
					const sheet = workbook.sheet(mapping.sheet);
					if (!sheet) return {
						status: "Unavailable",
						actual: "Worksheet missing"
					};
					const cell = sheet.cell(mapping.cell);
					return compareBankCell(mapping.expected, cell.value(), cell.formula());
				} catch {
					return {
						status: "Unavailable",
						actual: "Mapped cell could not be read"
					};
				}
			});
			setResults(checked);
		} catch (failure) {
			setError(failure instanceof Error ? failure.message : "Workbook verification failed");
		} finally {
			setBusy(false);
		}
	}
	const matched = results?.filter((result) => result.status === "Matched").length ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 rounded-md border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-sm font-semibold",
				children: "Original bank workbook mapping"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2",
						children: ["Mapped cells: ", mappings.length]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2",
						children: ["Official matches: ", mappings.filter((x) => x.reference === "Matched").length]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2",
						children: ["Source mismatches: ", mappings.filter((x) => x.reference === "Mismatch").length]
					})
				]
			}),
			sourceMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: "Registered values differ from the official report snapshot. Workbook verification is locked until reconciled."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify regenerated reviewed workpaper" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					disabled: busy || sourceMismatch,
					className: "block w-full rounded-md border p-2 text-xs",
					onChange: (event) => {
						const file = event.target.files?.[0];
						event.target.value = "";
						if (file) verifyWorkbook(file);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Choose a trusted workbook generated by the existing P20 workpaper feature. The file is read locally and is not uploaded or saved by this verification."
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reading mapped workbook cells..." }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: error
			}),
			results && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1 rounded-md border p-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "break-all font-medium",
						children: fileName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						matched,
						" of ",
						mappings.length,
						" mapped cells matched."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: matched === mappings.length ? "All mapped cell values matched the registered workpaper." : "Review mismatched, formula or unavailable cells."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-md border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Field",
							"Sheet / Cell",
							"Registered value",
							"Official comparison",
							"Excel value",
							"Cell result"
						].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: label
						}, label)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: mappings.map((mapping, index) => {
						const result = results?.[index];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 font-medium",
									children: mapping.field
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2",
									children: [
										mapping.sheet,
										" / ",
										mapping.cell
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 break-all",
									children: mapping.expected === null ? "(Blank)" : String(mapping.expected)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: mapping.reference === "Mismatch" ? "text-destructive" : mapping.reference === "Matched" ? "text-emerald-700" : "text-muted-foreground",
										children: mapping.reference
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 break-all",
									children: result?.actual ?? "Not checked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: result?.status === "Matched" ? "text-emerald-700" : result?.status === "Mismatch" ? "text-destructive" : "text-muted-foreground",
										children: result?.status ?? "Not checked"
									})
								})
							]
						}, mapping.sheet + ":" + mapping.cell);
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "This checks mapped cell values, not formula recalculation, workbook layout, drawings or digital signatures. Reviewed workpapers are not released bank reports."
			})
		]
	});
}
function packRow(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function packText(value) {
	if (typeof value === "string" && value.trim()) return value;
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return "Not recorded";
}
function photoDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") resolve(reader.result);
			else reject(/* @__PURE__ */ new Error("Photo could not be decoded"));
		};
		reader.onerror = () => {
			reject(/* @__PURE__ */ new Error("Photo read failed"));
		};
		reader.readAsDataURL(blob);
	});
}
async function loadDraftPackPhotos(report, orgId, num) {
	const reference = reportInspectionReference(report);
	const photos = [];
	const notices = [];
	if (!reference) {
		notices.push("No historical inspection reference is recorded. Current visit photographs were not substituted.");
		return {
			photos,
			notices
		};
	}
	try {
		const { data, error } = await vpDb.from("vp_visit_photos").select("id,org_id,visit_id,storage_path,name,mime,size,uploaded_at").eq("org_id", orgId).eq("visit_id", reference.visitId).lte("uploaded_at", reference.revision).order("uploaded_at", { ascending: true }).order("id", { ascending: true }).limit(9);
		if (error) throw new Error("Photograph register unavailable or access denied");
		const records = data ?? [];
		if (!records.length) notices.push("No accessible photographs were returned. This does not establish that no photographs exist.");
		if (records.length > 8) notices.push("Annexure limited to the first eight accessible photographs.");
		let totalBytes = 0;
		for (const raw of records.slice(0, 8)) {
			const row = packRow(raw);
			if (!validAnnexPhoto(row, orgId, num, reference)) {
				notices.push("An invalid photograph reference was omitted.");
				continue;
			}
			const size = Number(row["size"]);
			if (totalBytes + size > 20971520) {
				notices.push("Combined photograph limit reached (20 MB).");
				break;
			}
			try {
				const { data: blob, error: downloadError } = await vpDb.storage.from("vp-field-evidence").download(String(row["storage_path"]));
				if (downloadError || !blob) throw new Error("Photo unavailable");
				if (blob.size !== size || blob.size > 10485760) throw new Error("Stored photograph size mismatch");
				const bytes = new Uint8Array(await blob.arrayBuffer());
				if (!validAnnexImage(bytes, row["mime"])) throw new Error("Stored photograph type mismatch");
				const image = new Blob([bytes], { type: String(row["mime"]) });
				photos.push({
					name: packText(row["name"]),
					uploadedAt: packText(row["uploaded_at"]),
					dataUrl: await photoDataUrl(image)
				});
				totalBytes += size;
			} catch {
				notices.push("Could not retrieve photograph: " + packText(row["name"]));
			}
		}
	} catch (error) {
		notices.push(error instanceof Error ? error.message : "Photographic annexure unavailable");
	}
	return {
		photos,
		notices
	};
}
function renderDraftPack(popup, report, photos, notices) {
	const doc = popup.document;
	doc.title = "ValuationPro - Internal Draft Report";
	doc.head.replaceChildren();
	doc.body.replaceChildren();
	const charset = doc.createElement("meta");
	charset.setAttribute("charset", "utf-8");
	doc.head.appendChild(charset);
	const policy = doc.createElement("meta");
	policy.httpEquiv = "Content-Security-Policy";
	policy.content = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'";
	doc.head.appendChild(policy);
	const style = doc.createElement("style");
	style.textContent = [
		"@page{size:A4;margin:15mm}",
		"*{box-sizing:border-box}",
		"body{font:12px Arial,sans-serif;color:#17283b;",
		"max-width:820px;margin:24px auto;padding:16px}",
		"h1{font-size:24px;margin:12px 0}",
		"h2{font-size:16px;margin-top:24px;",
		"border-bottom:2px solid #253e59;padding-bottom:6px}",
		"p{line-height:1.5;overflow-wrap:anywhere}",
		"table{width:100%;border-collapse:collapse}",
		"th,td{padding:9px;border:1px solid #cbd5e1;",
		"text-align:left;overflow-wrap:anywhere}",
		"th{width:36%;background:#f1f5f9}",
		".warning{color:#991b1b;border:2px solid #991b1b;",
		"padding:10px;font-weight:bold}",
		".muted{color:#475569;font-size:11px}",
		"figure{margin:12px 0;break-inside:avoid;",
		"border:1px solid #cbd5e1;padding:10px}",
		"img{width:100%;max-height:330px;object-fit:contain}",
		"figcaption{padding-top:7px;overflow-wrap:anywhere}",
		"button{padding:10px 16px;cursor:pointer}",
		"tr{break-inside:avoid}",
		"@media print{body{max-width:none;margin:0;padding:0}",
		".screen-only{display:none!important}}"
	].join("");
	doc.head.appendChild(style);
	function add(tag, text, className = "") {
		const element = doc.createElement(tag);
		element.textContent = text;
		element.className = className;
		doc.body.appendChild(element);
		return element;
	}
	function table(rows) {
		const element = doc.createElement("table");
		for (const [label, value] of rows) {
			const tr = doc.createElement("tr");
			const th = doc.createElement("th");
			const td = doc.createElement("td");
			th.textContent = label;
			td.textContent = value;
			tr.append(th, td);
			element.appendChild(tr);
		}
		doc.body.appendChild(element);
	}
	const printButton = doc.createElement("button");
	printButton.className = "screen-only";
	printButton.textContent = "Print / Save as PDF";
	printButton.disabled = true;
	printButton.addEventListener("click", () => popup.print());
	doc.body.appendChild(printButton);
	add("h1", "Property Valuation - Internal Review Pack");
	add("p", "DRAFT - NOT FOR BANK SUBMISSION", "warning");
	add("p", "Generated from stored report snapshots. This is not the original released bank report, a certified valuation or a digital signature.", "muted");
	const snapshot = packRow(report["case_snapshot"]);
	const inputs = packRow(report["inputs_snapshot"]);
	const calculations = packRow(report["calculations_snapshot"]);
	const property = packRow(inputs["property_snapshot"]);
	const reference = reportInspectionReference(report);
	add("h2", "1. Report identification");
	table([
		["Case number", packText(snapshot["case_number"] ?? report["num"])],
		["Bank / lender", packText(snapshot["bank"])],
		["Report format", packText(report["format_name"])],
		["Source report version", packText(report["version_no"])],
		["Source report status", packText(report["status"])],
		["Official valuation version", packText(report["valuation_version_no"])],
		["Valuation method", packText(snapshot["valuation_method"] ?? inputs["method"])],
		["Bank workpaper", packText(snapshot["p20_export_id"] ?? inputs["export_id"])],
		["Effective valuation date", packText(inputs["effective_date"])]
	]);
	add("h2", "2. Property information");
	table([
		["Property address", packText(property["address"] ?? snapshot["property_address"])],
		["Property category", packText(property["category"])],
		["Property label", packText(property["label"])],
		["Referenced inspection visit", packText(reference?.visitId)],
		["Inspection snapshot revision", packText(reference?.revision)]
	]);
	add("h2", "3. Valuation assessment");
	table([
		["Land value", reportAmount(calculations["landValue"])],
		["Building value", reportAmount(calculations["buildingValue"])],
		["Fair market value", reportAmount(calculations["marketValue"])],
		["Realizable value", reportAmount(calculations["realizableValue"])],
		["Distress value", reportAmount(calculations["distressValue"])],
		["Guideline value", reportAmount(calculations["guidelineValue"])]
	]);
	add("p", "Amounts are reproduced from the selected stored calculation. Missing values are not replaced by zero.", "muted");
	add("h2", "4. Valuation basis");
	const analysisInputs = packRow(inputs["analysis_inputs"]);
	table([
		["Analysis version", packText(inputs["analysis_version"])],
		["Formula version", packText(inputs["formula_version"])],
		["Valuation rationale", packText(analysisInputs["reason"])],
		["Adoption rationale", packText(inputs["adoption_reason"])]
	]);
	add("h2", "5. Photographic annexure");
	add("p", "Photographs are read from the accessible register for the referenced visit, limited to records dated on or before the inspection snapshot revision. They are not a verified immutable list of photographs included in the original report.", "muted");
	if (!photos.length) add("p", "No photographs included in this annexure.");
	const imageLoads = [];
	photos.forEach((photo, index) => {
		const figure = doc.createElement("figure");
		const image = doc.createElement("img");
		image.alt = photo.name;
		const loaded = new Promise((resolve) => {
			const timeout = popup.setTimeout(() => {
				image.remove();
				figure.appendChild(doc.createTextNode("Photograph preview timed out."));
				resolve();
			}, 15e3);
			image.onload = () => {
				popup.clearTimeout(timeout);
				resolve();
			};
			image.onerror = () => {
				popup.clearTimeout(timeout);
				image.remove();
				figure.appendChild(doc.createTextNode("Photograph could not be rendered."));
				resolve();
			};
		});
		imageLoads.push(loaded);
		image.src = photo.dataUrl;
		const caption = doc.createElement("figcaption");
		caption.textContent = "Photo " + (index + 1) + ": " + photo.name + " | Uploaded: " + photo.uploadedAt;
		figure.append(image, caption);
		doc.body.appendChild(figure);
	});
	for (const notice of notices) add("p", notice, "warning");
	add("h2", "6. Limitations");
	add("p", "This internal draft does not replace lender-specific format requirements, maker-checker review or authorized release. Survey sketches and signatures are not automatically included.");
	add("p", "Prepared for internal review: " + (/* @__PURE__ */ new Date()).toISOString(), "muted");
	Promise.all(imageLoads).then(() => {
		if (!popup.closed) printButton.disabled = false;
	});
}
function ReportDraftPack({ orgId, num, versions }) {
	const [selection, setSelection] = (0, import_react.useState)("");
	const [includePhotos, setIncludePhotos] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const selected = versions.find((row) => String(row.version) === selection);
	async function prepare() {
		if (!selected || busy) return;
		if (selected.status !== "Draft" && selected.status !== "Released") return;
		const popup = window.open("", "_blank", "popup,width=920,height=850");
		if (!popup) {
			setError("Allow popups for this application to prepare the PDF.");
			return;
		}
		popup.opener = null;
		popup.document.title = "Preparing internal draft";
		popup.document.body.textContent = "Preparing report...";
		setBusy(true);
		setError(null);
		try {
			const report = await vpReadbackRow(vpDb.from("vp_report_versions").select("org_id,num,version_no,valuation_version_no,format_name,status,case_snapshot,inputs_snapshot,calculations_snapshot").eq("org_id", orgId).eq("num", num).eq("version_no", selected.version).eq("status", selected.status).maybeSingle());
			if (!report || reportIdentifier(report["org_id"]) !== orgId || report["num"] !== num || report["version_no"] !== selected.version || report["status"] !== selected.status) throw new Error("Selected report is unavailable or has changed. Refresh reports.");
			const annexure = includePhotos ? await loadDraftPackPhotos(report, orgId, num) : {
				photos: [],
				notices: ["Photographic annexure not requested."]
			};
			if (popup.closed) return;
			renderDraftPack(popup, report, annexure.photos, annexure.notices);
		} catch (failure) {
			const message = failure instanceof Error ? failure.message : "Draft report preparation failed";
			setError(message);
			if (!popup.closed) popup.close();
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 rounded-md border p-3 print:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-sm font-semibold",
				children: "Prepare internal PDF report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Source report version" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "w-full rounded-md border bg-background p-2",
					value: selection,
					disabled: busy,
					onChange: (event) => setSelection(event.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select report version"
					}), versions.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: String(row.version),
						children: [
							"Version ",
							row.version,
							" - ",
							row.status
						]
					}, row.version))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: includePhotos,
					disabled: busy,
					onChange: (event) => setIncludePhotos(event.target.checked)
				}), "Include accessible historical visit photographs"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				disabled: !selected || busy,
				onClick: () => void prepare(),
				children: busy ? "Preparing..." : "Prepare PDF draft"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Opens a separate printable A4 document. Select Save as PDF in the browser print dialog. Existing reports and their release status are not modified."
			})
		]
	});
}
//#endregion
export { CaseDossier as component };
