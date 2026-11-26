import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Vt as ArrowLeft, l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { i as CardContent, n as Button, r as Card, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings.branches._id-DScR-K5Q.js
var import_jsx_runtime = require_jsx_runtime();
function BranchSettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Branch configuration",
		description: "Manage your agency's live branch records from Administration."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4 p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "size-5 shrink-0 text-warning",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Legacy configuration preview retired"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "The former settings screen used sample values and did not persist changes to the database. Live workflow defaults and branch overrides require a separate configuration migration. Manage existing branch records using the branch register."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/branches",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Open branch register"]
			})
		})]
	}) })] });
}
//#endregion
export { BranchSettingsPage as component };
