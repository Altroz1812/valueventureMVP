import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { E as cn, i as CardContent, r as Card } from "./card-svjjW0Eb.mjs";
import { n as tatTone } from "./ops-BcxJm0Qk.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-ui-CJPu_Wj9.js
var import_jsx_runtime = require_jsx_runtime();
function TatBadge({ c }) {
	const t = tatTone(c.tatLeft, c.stage);
	const label = t === "done" ? "Completed" : t === "overdue" ? `Overdue ${-c.tatLeft}d` : t === "today" ? c.tatLeft === 0 ? "Due today" : "Due in 1d" : `${c.tatLeft}d left`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: cn("font-medium", t === "ok" && "border-success/30 bg-success/10 text-success", t === "today" && "border-warning/40 bg-warning/10 text-warning", t === "overdue" && "border-destructive/30 bg-destructive/10 text-destructive", t === "done" && "text-muted-foreground"),
		children: label
	});
}
function PriorityBadge({ p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: p === "High" ? "destructive" : "secondary",
		className: "font-medium",
		children: p
	});
}
function StatCard({ label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex items-start justify-between gap-2 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-xl font-semibold tabular-nums text-foreground",
					children: value
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: hint
				})
			] }), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md bg-primary/10 p-1.5 text-primary",
				children: icon
			})]
		})
	});
}
function EmptyRow({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-6 text-center text-sm text-muted-foreground",
		children: text
	});
}
//#endregion
export { TatBadge as i, PriorityBadge as n, StatCard as r, EmptyRow as t };
