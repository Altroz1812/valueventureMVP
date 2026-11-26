import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-reports-CNYb7FPD.js
var VALUATION_KEYS = [
	"landAreaSqYd",
	"landRate",
	"guidelineRate",
	"builtUpSqFt",
	"constructionRate",
	"ageYears",
	"lifeYears",
	"salvagePct",
	"amenities",
	"realizablePct",
	"distressPct"
];
function getError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function useVpValuationForm(caseNum) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-valuation-form",
			tenant.id,
			caseNum
		],
		enabled: caseNum > 0,
		queryFn: async () => {
			const { data, error } = await vpDb.from("forms").select("data,status,updated,by").eq("org_id", tenant.id).eq("num", caseNum).maybeSingle();
			if (error) throw error;
			return data;
		},
		staleTime: 1e4
	});
}
function useVpValuationVersions(caseNum) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-valuation-versions",
			tenant.id,
			caseNum
		],
		enabled: caseNum > 0,
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_valuation_versions").select("version_no,submitted_at,submitted_by,inputs,calculations").eq("org_id", tenant.id).eq("num", caseNum).order("version_no", { ascending: false });
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 1e4
	});
}
function useVpReportFormats() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-report-formats", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_report_formats").select("org_id,bank_name,property_type,format_name,instructions,active").eq("org_id", tenant.id).order("bank_name");
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 15e3
	});
}
function useVpValuerCredentials() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-valuer-credentials", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_valuer_credentials").select("org_id,user_id,reg_no,registration_category,expires_on,review_status,recorded_by,reviewed_by,review_note").eq("org_id", tenant.id);
			if (error) throw error;
			return (data ?? []).map((r) => ({
				...r,
				org_id: String(r.org_id),
				user_id: String(r.user_id),
				recorded_by: String(r.recorded_by),
				reviewed_by: r.reviewed_by === null ? null : String(r.reviewed_by)
			}));
		},
		staleTime: 15e3
	});
}
function useVpReportVersions() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-report-versions", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_report_versions").select("id,num,version_no,valuation_version_no,format_name,status,file_path,case_snapshot,inputs_snapshot,calculations_snapshot,prepared_at,released_at,released_reg_no").eq("org_id", tenant.id).order("id", { ascending: false }).limit(1e3);
			if (error) throw error;
			return (data ?? []).map((r) => ({
				...r,
				id: String(r.id)
			}));
		},
		staleTime: 1e4
	});
}
function useVpReportPermissions() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-report-permissions",
			tenant.id,
			tenant.role
		],
		queryFn: async () => {
			const vals = await Promise.all([
				"View",
				"Edit",
				"Prepare",
				"Release",
				"Manage Formats"
			].map(async (p_action) => {
				const { data, error } = await vpDb.rpc("vp_report_can", { p_action });
				if (error) throw error;
				return data === true;
			}));
			return {
				view: vals[0],
				edit: vals[1],
				prepare: vals[2],
				release: vals[3],
				manage: vals[4]
			};
		},
		staleTime: 1e4
	});
}
async function saveVpValuation(caseNum, input, submit) {
	const { data, error } = await vpDb.rpc("vp_report_save_valuation", {
		p_case_num: caseNum,
		p_input: input,
		p_submit: submit
	});
	if (error) throw error;
	return data;
}
async function prepareVpReport(caseNum) {
	const { data, error } = await vpDb.rpc("vp_report_prepare", { p_case_num: caseNum });
	if (error) throw error;
	return String(data);
}
async function saveVpBankFormat(bank, product, name, instructions) {
	const { error } = await vpDb.rpc("vp_report_save_format", {
		p_bank: bank,
		p_product: product,
		p_name: name,
		p_instructions: instructions
	});
	if (error) throw error;
}
async function recordVpValuer(userId, registration, expires) {
	const { error } = await vpDb.rpc("vp_report_record_valuer", {
		p_user_id: userId,
		p_reg_no: registration,
		p_expires: expires,
		p_category: "Land & Building"
	});
	if (error) throw error;
}
async function reviewVpValuer(userId, accept, note) {
	const { error } = await vpDb.rpc("vp_report_review_valuer", {
		p_user_id: userId,
		p_accept: accept,
		p_note: note
	});
	if (error) throw error;
}
var REPORT_BUCKET = "vp-report-files";
async function attachVpReportPdf(orgId, report, file) {
	if (file.type !== "application/pdf" || file.size <= 0 || file.size > 20971520) throw new Error("Select a PDF file (maximum 20 MB)");
	const path = `${orgId}/${report.num}/${crypto.randomUUID()}.pdf`;
	const { error: uploadError } = await vpDb.storage.from(REPORT_BUCKET).upload(path, file, {
		contentType: "application/pdf",
		upsert: false
	});
	if (uploadError) throw uploadError;
	const { error: registerError } = await vpDb.rpc("vp_report_attach_pdf", {
		p_report_id: report.id,
		p_file_path: path
	});
	if (registerError) throw new Error(`PDF uploaded but not registered: ${registerError.message}. Contact an administrator to remove the orphan file.`);
}
async function viewVpReportPdf(path) {
	const { data, error } = await vpDb.storage.from(REPORT_BUCKET).createSignedUrl(path, 60);
	if (error || !data?.signedUrl) throw getError(error ?? "Cannot open private report");
	window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}
async function releaseVpReport(reportId) {
	const { error } = await vpDb.rpc("vp_report_release", { p_report_id: reportId });
	if (error) throw error;
}
//#endregion
export { releaseVpReport as a, saveVpValuation as c, useVpReportVersions as d, useVpValuationForm as f, viewVpReportPdf as h, recordVpValuer as i, useVpReportFormats as l, useVpValuerCredentials as m, attachVpReportPdf as n, reviewVpValuer as o, useVpValuationVersions as p, prepareVpReport as r, saveVpBankFormat as s, VALUATION_KEYS as t, useVpReportPermissions as u };
