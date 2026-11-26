import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as RefreshCw, Lt as Bell, Ot as CheckCheck, h as Settings2, l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-CzgjKPrJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function vpLoadAlerts(limit = 50) {
	const { data, error } = await vpDb.rpc("vp_alert_list", {
		p_limit: limit,
		p_offset: 0
	});
	if (error) throw error;
	return data ?? [];
}
async function vpMarkAlertsRead(ids) {
	if (!ids.length) return 0;
	const { data, error } = await vpDb.rpc("vp_alert_mark_read", { p_ids: ids });
	if (error) throw error;
	return Number(data ?? 0);
}
async function vpLoadAlertSettings() {
	const { data, error } = await vpDb.rpc("vp_alert_settings_read");
	if (error) throw error;
	const value = Array.isArray(data) ? data[0] : data;
	if (!value) throw new Error("Alert settings are unavailable");
	return value;
}
async function vpSaveAlertSettings(caseDays, invoiceDays) {
	const { error } = await vpDb.rpc("vp_alert_settings_save", {
		p_case_warning_days: caseDays,
		p_invoice_warning_days: invoiceDays
	});
	if (error) throw error;
}
function timeLabel(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}
function AlertLine({ alert, onMark, pending }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-lg border px-3 py-2 ${alert.read_at ? "bg-background" : "bg-muted/30"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [alert.severity !== "info" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 shrink-0 text-amber-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "truncate text-xs",
						children: alert.title
					})]
				}), !alert.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "h-7 text-xs",
					disabled: pending,
					onClick: () => onMark(alert.id),
					children: "Mark read"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: alert.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[11px] text-muted-foreground",
				children: [
					alert.kind.toUpperCase(),
					" · ",
					timeLabel(alert.created_at),
					alert.case_num != null ? ` · Case #${alert.case_num}` : ""
				]
			})
		]
	});
}
/** Insert as an additive card into the existing dashboard; do not replace its layout. */
function VpNotificationCenter() {
	const { tenant } = useApp();
	const qc = useQueryClient();
	const key = ["vp-alert-inbox", tenant.id];
	const inbox = useQuery({
		queryKey: key,
		queryFn: () => vpLoadAlerts(50),
		refetchInterval: 6e4
	});
	const isAdmin = Boolean(tenant.adminAccess);
	const settings = useQuery({
		queryKey: ["vp-alert-settings", tenant.id],
		queryFn: vpLoadAlertSettings,
		enabled: isAdmin
	});
	const [caseDays, setCaseDays] = (0, import_react.useState)("2");
	const [invoiceDays, setInvoiceDays] = (0, import_react.useState)("3");
	(0, import_react.useEffect)(() => {
		if (settings.data) {
			setCaseDays(String(settings.data.case_warning_days));
			setInvoiceDays(String(settings.data.invoice_warning_days));
		}
	}, [settings.data]);
	const mark = useMutation({
		mutationFn: vpMarkAlertsRead,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: key });
		},
		onError: (e) => toast.error(e.message)
	});
	const save = useMutation({
		mutationFn: () => {
			const a = Number(caseDays), b = Number(invoiceDays);
			if (!Number.isInteger(a) || a < 0 || a > 30 || !Number.isInteger(b) || b < 0 || b > 30) throw new Error("Warning windows must be whole numbers between 0 and 30 days");
			return vpSaveAlertSettings(a, b);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["vp-alert-settings", tenant.id] });
			toast.success("Alert thresholds saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const unread = (inbox.data ?? []).filter((a) => !a.read_at);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between gap-2 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 font-display text-base",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }),
					" Notifications",
					unread.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary",
						children: [unread.length, " unread"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => void inbox.refetch(),
				disabled: inbox.isFetching,
				"aria-label": "Refresh notifications",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				inbox.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Loading notifications…"
				}),
				inbox.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs text-destructive",
					children: inbox.error.message
				}),
				!inbox.isLoading && !inbox.error && inbox.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No notifications yet. Alerts appear as real workflow events occur."
				}),
				(inbox.data ?? []).slice(0, 15).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertLine, {
					alert: a,
					pending: mark.isPending,
					onMark: (id) => mark.mutate([id])
				}, a.id)),
				unread.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					disabled: mark.isPending,
					onClick: () => mark.mutate(unread.map((a) => a.id).slice(0, 100)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-2 size-4" }), " Mark unread as read"]
				}),
				inbox.data && inbox.data.length > 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Showing the 15 newest of ",
						inbox.data.length,
						" loaded alerts."
					]
				}),
				isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-lg border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), " TAT warning settings"]
						}),
						settings.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-xs text-destructive",
							children: settings.error.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] text-muted-foreground",
								children: ["Case warning (days)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1 h-8",
									type: "number",
									min: 0,
									max: 30,
									step: 1,
									value: caseDays,
									onChange: (e) => setCaseDays(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] text-muted-foreground",
								children: ["Invoice warning (days)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1 h-8",
									type: "number",
									min: 0,
									max: 30,
									step: 1,
									value: invoiceDays,
									onChange: (e) => setInvoiceDays(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: save.isPending || settings.isLoading,
							onClick: () => save.mutate(),
							children: "Save warning windows"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Due-date alerts require the trusted daily scan job. External email/WhatsApp delivery is disabled until configured separately."
						})
					]
				})
			]
		})]
	});
}
function NotificationsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications & TAT",
		description: "Live alerts for your organization; no demo counts."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpNotificationCenter, {})] });
}
//#endregion
export { NotificationsPage as component };
