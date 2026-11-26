import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as collectPages } from "./vp-query-NYEPg70J.mjs";
import { c as validateProperty } from "./vp-property-data-NyFxtdD0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-property-master-z5usx4CM.js
function usePropertyMaster() {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: ["vp-p16-properties", tenant.id],
		enabled: can("cases.View"),
		queryFn: () => collectPages(async (start, end) => {
			const { data, error } = await vpDb.from("vp_property_master").select("id::text,current_revision,data,updated_at").eq("org_id", tenant.id).order("id", { ascending: false }).range(start, end);
			return {
				data,
				error
			};
		})
	});
}
function usePropertyRevisions(id) {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: [
			"vp-p16-revisions",
			tenant.id,
			id
		],
		enabled: !!id && can("cases.View"),
		queryFn: () => collectPages(async (start, end) => {
			const { data, error } = await vpDb.from("vp_property_revisions").select("revision,data,reason,recorded_at,recorded_by::text").eq("org_id", tenant.id).eq("property_id", id).order("revision", { ascending: false }).range(start, end);
			return {
				data,
				error
			};
		})
	});
}
function usePropertyLinks(id) {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: [
			"vp-p16-links",
			tenant.id,
			id
		],
		enabled: !!id && can("cases.View"),
		queryFn: () => collectPages(async (start, end) => {
			const { data, error } = await vpDb.from("vp_property_current_links").select("num,link_version,property_id::text,property_revision,reason,linked_at,linked_by::text").eq("org_id", tenant.id).eq("property_id", id).order("num", { ascending: false }).range(start, end);
			return {
				data,
				error
			};
		})
	});
}
function useCasePropertyLinks(num) {
	const { tenant, can } = useApp();
	return useQuery({
		queryKey: [
			"vp-p16-case-links",
			tenant.id,
			num
		],
		enabled: Number.isInteger(num) && num > 0 && can("cases.View"),
		queryFn: () => collectPages(async (start, end) => {
			const { data, error } = await vpDb.from("vp_property_case_links").select("num,link_version,property_id::text,property_revision,reason,linked_at,linked_by::text").eq("org_id", tenant.id).eq("num", num).order("link_version", { ascending: false }).range(start, end);
			return {
				data,
				error
			};
		})
	});
}
async function saveProperty(record, data, reason) {
	const validation = validateProperty(data);
	if (validation) throw new Error(validation);
	const { data: id, error } = await vpDb.rpc("vp_p16_save_property", {
		p_property_id: record?.id ?? null,
		p_expected_revision: record?.current_revision ?? 0,
		p_data: data,
		p_reason: reason
	});
	if (error) throw error;
	return String(id);
}
async function linkCaseProperty(num, property, previous, reason) {
	const { error } = await vpDb.rpc("vp_p16_link_case", {
		p_case_num: num,
		p_property_id: property.id,
		p_property_revision: property.current_revision,
		p_expected_link_version: previous,
		p_reason: reason
	});
	if (error) throw error;
}
//#endregion
export { usePropertyMaster as a, usePropertyLinks as i, saveProperty as n, usePropertyRevisions as o, useCasePropertyLinks as r, linkCaseProperty as t };
