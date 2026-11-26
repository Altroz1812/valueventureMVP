import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as collectOrgRows } from "./vp-query-NYEPg70J.mjs";
import { t as STAGES } from "./ops-BcxJm0Qk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-cases-DcoVfkM7.js
var PROPERTY_TYPES = [
	"House",
	"Flat",
	"Land",
	"Commercial"
];
/** Canonical per-agency categories, separate from bank fee configuration. */
function useVpPropertyTypes() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-property-types", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_property_types").select("code,name,is_active,sort_order").eq("org_id", tenant.id).order("sort_order");
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 15e3
	});
}
var DOC_BUCKET = "vp-case-docs";
function localToday() {
	const now = /* @__PURE__ */ new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}
function daysUntil(due) {
	const [y, m, d] = due.split("-").map(Number);
	if (!y || !m || !d) return 0;
	return Math.round((new Date(y, m - 1, d).getTime() - localToday()) / 864e5);
}
var uiStages = new Set(STAGES);
function str(v) {
	return typeof v === "string" ? v : "";
}
function num(v) {
	return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function mapVpCase(row, tenantId, branches) {
	const meta = row.meta && typeof row.meta === "object" ? row.meta : {};
	const userStage = str(meta["ui_stage"]);
	const stage = uiStages.has(userStage) ? userStage : row.stage;
	const branch = branches.find((b) => b.id === str(meta["branch_id"])) ?? branches.find((b) => b.name === row.br);
	const priorityValue = str(meta["priority"]);
	const priorityKnown = [
		"High",
		"Normal",
		"Low"
	].includes(priorityValue);
	const fee = num(meta["fee"]);
	return {
		id: String(row.num),
		caseNum: row.num,
		caseNo: str(meta["case_no"]) || `#${row.num}`,
		tenantId,
		branchId: branch?.id ?? str(meta["branch_id"]),
		property: row.addr,
		propertyType: row.prod,
		customer: row.cust,
		bank: row.bank,
		city: str(meta["city"]) || branch?.city || "",
		branchName: row.br,
		assignedTo: row.team || "Unassigned",
		stage,
		dbStage: row.stage,
		priority: priorityKnown ? priorityValue : "Normal",
		priorityKnown,
		fee: fee ?? 0,
		feeKnown: fee !== null,
		tatLeft: daysUntil(row.due),
		due: row.due,
		created: row.created
	};
}
function readAllCases(tenantId) {
	return collectOrgRows("cases", "num,org_id,cust,bank,br,prod,addr,stage,team,due,created,meta", tenantId, "num", false);
}
function useVpCases() {
	const { tenant, tenantBranches, branch } = useApp();
	const query = useQuery({
		queryKey: ["vp-live-cases", tenant.id],
		queryFn: () => readAllCases(tenant.id),
		staleTime: 15e3
	});
	const cases = (query.data ?? []).map((x) => mapVpCase(x, tenant.id, tenantBranches));
	return {
		...query,
		allCases: cases,
		cases: branch === "all" ? cases : cases.filter((c) => c.branchId === branch)
	};
}
function useVpBanks() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-live-banks", tenant.id],
		queryFn: async () => {
			const [banksRes, tariffsRes] = await Promise.all([vpDb.from("banks").select("name,alias,kind,rate").eq("org_id", tenant.id).order("name"), vpDb.from("vp_bank_rate_cards").select("bank_name,property_type,fee,tat_days").eq("org_id", tenant.id)]);
			if (banksRes.error) throw banksRes.error;
			if (tariffsRes.error) throw tariffsRes.error;
			return (banksRes.data ?? []).map((b) => ({
				name: b.name,
				alias: b.alias,
				kind: b.kind,
				rate: Number(b.rate),
				tariffs: (tariffsRes.data ?? []).filter((t) => t.bank_name === b.name).map((t) => ({
					property_type: t.property_type,
					fee: Number(t.fee),
					tat_days: t.tat_days
				}))
			}));
		},
		staleTime: 15e3
	});
}
function useVpCaseDocuments(caseNum) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-case-documents",
			tenant.id,
			caseNum
		],
		enabled: Number.isInteger(caseNum) && caseNum > 0,
		queryFn: async () => {
			const { data, error } = await vpDb.from("documents").select("id,name,mime,size,at,by,storage_path").eq("org_id", tenant.id).eq("num", caseNum).order("id", { ascending: false });
			if (error) throw error;
			return (data ?? []).map((d) => ({
				...d,
				id: String(d.id)
			}));
		},
		staleTime: 1e4
	});
}
async function uploadVpCaseDocument(orgId, caseNum, file) {
	const extension = {
		"application/pdf": "pdf",
		"image/jpeg": "jpg",
		"image/png": "png"
	};
	if (!extension[file.type]) throw new Error("Only PDF, JPEG and PNG files are supported");
	if (file.size < 1 || file.size > 10485760) throw new Error("File must be between 1 byte and 10 MB");
	if (file.name.length > 250) throw new Error("Document filename is too long");
	const objectPath = `${orgId}/${caseNum}/${crypto.randomUUID()}.${extension[file.type]}`;
	const { error: uploadError } = await vpDb.storage.from(DOC_BUCKET).upload(objectPath, file, {
		contentType: file.type,
		upsert: false,
		cacheControl: "3600"
	});
	if (uploadError) throw uploadError;
	const { error: registerError } = await vpDb.rpc("vp_case_register_document", {
		p_case_num: caseNum,
		p_object_path: objectPath,
		p_file_name: file.name,
		p_mime: file.type,
		p_size: file.size
	});
	if (registerError) throw new Error(`File stored but registration failed (${registerError.message}). Contact administrator to clean up orphan file.`);
}
async function openVpDocument(path) {
	const { data, error } = await vpDb.storage.from(DOC_BUCKET).createSignedUrl(path, 60);
	if (error || !data?.signedUrl) throw error ?? /* @__PURE__ */ new Error("Cannot open private document");
	window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}
//#endregion
export { useVpBanks as a, useVpPropertyTypes as c, uploadVpCaseDocument as i, PROPERTY_TYPES as n, useVpCaseDocuments as o, openVpDocument as r, useVpCases as s, DOC_BUCKET as t };
