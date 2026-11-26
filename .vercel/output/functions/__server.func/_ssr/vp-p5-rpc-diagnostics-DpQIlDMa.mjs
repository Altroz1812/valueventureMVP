//#region node_modules/.nitro/vite/services/ssr/assets/vp-p5-rpc-diagnostics-DpQIlDMa.js
function errorFields(error) {
	if (!error || typeof error !== "object") return {
		code: "",
		message: String(error ?? "")
	};
	const e = error;
	return {
		code: typeof e.code === "string" ? e.code : "",
		message: typeof e.message === "string" ? e.message : ""
	};
}
/**
* Classify an already-attempted, read-only RPC call using the returned PostgREST
* error. A restricted function is not classified as missing. Never call write
* RPCs (such as reviewed valuation save) to test their availability.
*/
function classifyReadRpcProbe(error) {
	if (!error) return {
		state: "available",
		label: "Available",
		guidance: "Read-only RPC call succeeded."
	};
	const { code, message } = errorFields(error);
	if (code === "PGRST202" || /could not find the function.*schema cache/i.test(message)) return {
		state: "missing",
		label: "Missing from API schema",
		guidance: "Verify the P2 SQL migration in the Supabase project used by this app. If installed with the correct signature, run NOTIFY pgrst, 'reload schema'; in Supabase SQL Editor."
	};
	if (code === "42501" || /permission denied|permission required|not authorized|not authenticated|jwt expired/i.test(message)) return {
		state: "restricted",
		label: "Function reached; access denied",
		guidance: "The function is reachable but this signed-in user is not authorized. Check role permissions, authenticated grants and function-side tenant checks; do not disable RLS."
	};
	if (/case not found|does not exist in your organization/i.test(message)) return {
		state: "case-not-found",
		label: "Function reached; probe case absent",
		guidance: "The function responded to a non-existent case number. This confirms reachability, not successful access to an actual case."
	};
	return {
		state: "unexpected-error",
		label: "RPC returned an error",
		guidance: `Inspect the Edge/API error and Supabase logs (${code || "no code"}): ${message || "no message"}`
	};
}
//#endregion
export { classifyReadRpcProbe as t };
