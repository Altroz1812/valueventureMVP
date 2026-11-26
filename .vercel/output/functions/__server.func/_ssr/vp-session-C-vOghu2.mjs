import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-session-C-vOghu2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function hasRolePermission(capabilities, action) {
	return capabilities.includes(action);
}
var accessRules = [
	{
		path: "/admin/roles-permissions",
		anyOf: ["tenant.admin"]
	},
	{
		path: "/admin/users",
		anyOf: ["tenant.admin"]
	},
	{
		path: "/admin/",
		anyOf: ["tenant.admin"]
	},
	{
		path: "/cases/",
		anyOf: [
			"cases.View",
			"field.View",
			"field.Check In/Out",
			"qc.View",
			"signoff.View"
		]
	},
	{
		path: "/cases",
		anyOf: ["cases.View"]
	},
	{
		path: "/properties",
		anyOf: ["cases.View"]
	},
	{
		path: "/market-intelligence",
		anyOf: ["cases.View"]
	},
	{
		path: "/field-inspections/",
		anyOf: [
			"field.View",
			"field.Check In/Out",
			"qc.View"
		]
	},
	{
		path: "/field-operations",
		anyOf: [
			"field.View",
			"field.Assign",
			"field.Check In/Out"
		]
	},
	{
		path: "/qc-checking",
		anyOf: ["qc.View"]
	},
	{
		path: "/reports",
		anyOf: ["signoff.View", "signoff.Generate"]
	},
	{
		path: "/billing-mis",
		anyOf: ["billing.View"]
	},
	{
		path: "/analytics",
		anyOf: ["analytics.View"]
	},
	{
		path: "/notifications",
		anyOf: []
	},
	{
		path: "/",
		anyOf: []
	}
];
function requiredPermissions(pathname) {
	return accessRules.find((r) => pathname === r.path || r.path !== "/" && r.path.endsWith("/") && pathname.startsWith(r.path))?.anyOf ?? [];
}
function mayOpenPath(pathname, capabilities) {
	const required = requiredPermissions(pathname);
	if (!accessRules.some((r) => pathname === r.path || r.path !== "/" && r.path.endsWith("/") && pathname.startsWith(r.path))) return pathname === "/onboarding";
	return required.length === 0 || required.some((x) => hasRolePermission(capabilities, x));
}
function normalizeGrantedPermissions(value) {
	if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0 || item.trim() !== item)) throw new Error("Invalid permission response");
	return [...new Set(value)].sort();
}
function authorizationId(value) {
	const id = typeof value === "number" && Number.isSafeInteger(value) ? String(value) : typeof value === "string" ? value : "";
	if (!/^[1-9][0-9]{0,18}$/.test(id) || id.length === 19 && id > "9223372036854775807") throw new Error("Invalid authorization identifier");
	return id;
}
function normalizeBranchAssignments(value) {
	if (!Array.isArray(value)) throw new Error("Invalid branch assignment response");
	const ids = value.map((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Invalid branch assignment");
		return authorizationId(item["branch_id"]);
	});
	return [...new Set(ids)].sort();
}
function workspaceAuthorizationKey(authUid, identity, permissions, branchAssignments) {
	if (!authUid || typeof identity.role !== "string" || !identity.role.trim() || typeof identity.is_admin !== "boolean") throw new Error("Invalid workspace authorization");
	return JSON.stringify([
		authUid,
		authorizationId(identity.org_id),
		authorizationId(identity.user_id),
		identity.role,
		identity.is_admin,
		normalizeGrantedPermissions(permissions),
		normalizeBranchAssignments(branchAssignments)
	]);
}
var RESULT = "lovable-preview-auth:result";
function readBrokerReply(data, requestId) {
	if (typeof data !== "object" || data === null) return null;
	if (!("type" in data) || data.type !== RESULT) return null;
	if (!("requestId" in data) || data.requestId !== requestId) return null;
	return {
		ok: "ok" in data && Boolean(data.ok),
		value: "value" in data && typeof data.value === "string" ? data.value : null
	};
}
/**
* On a Lovable preview surface, broker the auth session to the editor over
* postMessage so the project's preview surfaces share one login; else localStorage.
*/
function brokeredPreviewStorage() {
	if (typeof window === "undefined") return void 0;
	const host = location.hostname;
	const projectId = [
		"lovableproject.com",
		"lovableproject-dev.com",
		"lovable.app",
		"gpt-eng.com",
		"gptengineer.run"
	].some((z) => host === z || host.endsWith("." + z)) ? (/* @__PURE__ */ new RegExp("^(?:id-preview(?:-[a-z0-9]+)?|project)--([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:-dev)?(?=\\.|$)", "i")).exec(host)?.[1] ?? (/* @__PURE__ */ new RegExp("^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?=[.-])", "i")).exec(host)?.[1] : void 0;
	const parentWindow = window.parent;
	if (!projectId || !(parentWindow !== null && parentWindow !== window)) return localStorage;
	const dev = host.endsWith(".lovableproject-dev.com") || host.endsWith(".gpt-eng.com");
	const EDITOR = dev ? /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$|^http:\/\/localhost:3000$/ : /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$/;
	const ancestor = location.ancestorOrigins?.[0] ?? (document.referrer ? new URL(document.referrer).origin : "");
	const editorOrigins = ancestor && EDITOR.test(ancestor) ? [ancestor] : dev ? ["https://lovable.dev", "http://localhost:3000"] : ["https://lovable.dev"];
	const TIMEOUT = 2e3;
	const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
	const request = (type, key, value) => new Promise((resolve) => {
		const requestId = newId();
		let done = false;
		const finish = (reply) => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(reply);
		};
		const onMessage = (e) => {
			if (!editorOrigins.includes(e.origin)) return;
			const reply = readBrokerReply(e.data, requestId);
			if (reply) finish(reply);
		};
		window.addEventListener("message", onMessage);
		const timer = setTimeout(() => {
			finish(null);
		}, TIMEOUT);
		const msg = {
			type,
			requestId,
			projectId,
			key
		};
		if (value !== void 0) msg.value = value;
		for (const origin of editorOrigins) window.parent.postMessage(msg, origin);
	});
	let firstGet = true;
	const RETRY_DELAY = 250;
	const readLocal = (key) => {
		try {
			return localStorage.getItem(key);
		} catch {
			return;
		}
	};
	return {
		getItem: async (key) => {
			const local = readLocal(key);
			let res = await request("lovable-preview-auth:get", key, local ?? void 0);
			if (!res && firstGet) {
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				res = await request("lovable-preview-auth:get", key, local ?? void 0);
			}
			firstGet = false;
			if (res?.ok && res.value !== null) {
				if (res.value === "") {
					if (local !== void 0 && readLocal(key) === local) localStorage.removeItem(key);
					return null;
				}
				if (local === null && readLocal(key) === null) try {
					localStorage.setItem(key, res.value);
				} catch {}
				return res.value;
			}
			return localStorage.getItem(key);
		},
		setItem: (key, value) => {
			localStorage.setItem(key, value);
			return request("lovable-preview-auth:set", key, value).then((res) => {
				if (res?.ok && res.value !== null && localStorage.getItem(key) === value) if (res.value === "") localStorage.removeItem(key);
				else localStorage.setItem(key, res.value);
			});
		},
		removeItem: (key) => {
			const local = readLocal(key);
			localStorage.removeItem(key);
			return request("lovable-preview-auth:remove", key, local ?? void 0).then(() => {});
		}
	};
}
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function serverSupabaseUrl(publicUrl, supabaseKey) {
	if (typeof window !== "undefined" || typeof process === "undefined") return void 0;
	const serverUrl = process.env["SUPABASE_URL"]?.replace(/\/+$/, "");
	if (!serverUrl || serverUrl === publicUrl || process.env["SUPABASE_PUBLISHABLE_KEY"] !== supabaseKey) return void 0;
	return serverUrl;
}
function createSupabaseFetch(supabaseUrl, supabaseKey) {
	const publicUrl = supabaseUrl.replace(/\/+$/, "");
	const serverUrl = serverSupabaseUrl(publicUrl, supabaseKey);
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		if (serverUrl) {
			const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
			if (url.startsWith(`${publicUrl}/`)) {
				const target = serverUrl + url.slice(publicUrl.length);
				const request = typeof input === "string" || input instanceof URL ? target : new Request(target, input);
				return fetch(request, {
					...init,
					headers
				});
			}
		}
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseClient() {
	const SUPABASE_URL = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "fovgyyntmygvpmkhicef",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_FBR5BfVVZvekrXOhtyF-5w__Ppn-DJN",
		"VITE_SUPABASE_URL": "https://fovgyyntmygvpmkhicef.supabase.co"
	}["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
	const SUPABASE_PUBLISHABLE_KEY = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "fovgyyntmygvpmkhicef",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_FBR5BfVVZvekrXOhtyF-5w__Ppn-DJN",
		"VITE_SUPABASE_URL": "https://fovgyyntmygvpmkhicef.supabase.co"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) },
		auth: {
			storage: brokeredPreviewStorage(),
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
var vpDb = supabase;
var AppContext = (0, import_react.createContext)(null);
function AppProvider({ children, identity, capabilities }) {
	const [branch, setBranch] = (0, import_react.useState)("all");
	const [tenantUsers, setTenantUsers] = (0, import_react.useState)([]);
	const [tenantBranches, setTenantBranches] = (0, import_react.useState)([]);
	const tenant = (0, import_react.useMemo)(() => ({
		id: identity.org_id,
		name: identity.org_name,
		shortName: identity.org_name,
		role: identity.role,
		plan: "Active workspace",
		status: "active",
		adminAccess: identity.is_admin
	}), [identity]);
	const reloadUsers = (0, import_react.useCallback)(async () => {
		const { data, error } = await vpDb.rpc("vp_list_users");
		if (error) throw error;
		setTenantUsers((data ?? []).map((u) => ({
			id: String(u.id),
			tenantId: String(u.org_id),
			name: u.name,
			email: u.login,
			mobile: "—",
			role: u.role,
			allocations: [],
			status: u.active ? "Active" : "Suspended",
			employeeType: "—",
			joined: "—"
		})));
	}, [identity.org_id]);
	(0, import_react.useEffect)(() => {
		reloadUsers().catch(console.error);
	}, [reloadUsers]);
	const reloadBranches = (0, import_react.useCallback)(async () => {
		const { data, error } = await vpDb.from("vp_branches").select("id,org_id,name,code,branch_type,city,state,pin,address,manager_name,email,phone,geofence_km,tat_days,case_prefix,is_active,created_at").eq("org_id", identity.org_id).order("name");
		if (error) throw error;
		setTenantBranches((data ?? []).map((b) => ({
			id: String(b.id),
			tenantId: String(b.org_id),
			name: b.name,
			code: b.code,
			type: b.branch_type,
			city: b.city,
			state: b.state,
			pin: b.pin,
			address: b.address,
			manager: b.manager_name,
			email: b.email,
			phone: b.phone,
			geofenceKm: Number(b.geofence_km),
			tatDays: b.tat_days,
			casePrefix: b.case_prefix,
			openedOn: String(b.created_at).slice(0, 10),
			users: 0,
			activeCases: 0,
			status: b.is_active ? "Active" : "Inactive"
		})));
	}, [identity.org_id]);
	(0, import_react.useEffect)(() => {
		reloadBranches().catch(console.error);
	}, [reloadBranches]);
	const setTenantById = (0, import_react.useCallback)((id) => {
		if (id !== identity.org_id) throw new Error("Unauthorized workspace switch");
	}, [identity.org_id]);
	const canUseAllBranches = identity.is_admin || identity.role !== "Field Officer";
	const can = (action) => hasRolePermission(capabilities, action);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppContext.Provider, {
		value: {
			tenant,
			capabilities,
			can,
			branch,
			setTenantById,
			setBranch,
			tenantBranches,
			tenantUsers,
			reloadUsers,
			reloadBranches,
			currentUserName: identity.user_name,
			canUseAllBranches,
			branchLabel: branch === "all" ? canUseAllBranches ? "All branches" : "Assigned branches" : tenantBranches.find((b) => b.id === branch)?.name ?? "Selected branch"
		},
		children
	});
}
function useApp() {
	const ctx = (0, import_react.useContext)(AppContext);
	if (!ctx) throw new Error("useApp must be used inside AppProvider");
	return ctx;
}
/**
* Always leave a signed-out user at the root login screen.
* Replace, rather than push, the route to avoid retaining the active
* protected location as the next login destination.
*/
async function vpSignOutToHome(queryClient) {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
	queryClient.clear();
	if (typeof window !== "undefined") window.location.replace("/");
}
//#endregion
export { useApp as a, workspaceAuthorizationKey as c, supabase as i, mayOpenPath as n, vpDb as o, normalizeGrantedPermissions as r, vpSignOutToHome as s, AppProvider as t };
