import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as Slot, m as require_jsx_runtime, n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, n as mayOpenPath, o as vpDb, s as vpSignOutToHome } from "./vp-session-C-vOghu2.mjs";
import { b as Link, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as History, C as RefreshCw, Ct as ChevronUp, Dt as Check, Et as ChevronDown, F as Menu, Ft as Building2, I as MapPinned, J as Landmark, K as LayoutDashboard, Lt as Bell, M as PanelLeftClose, Mt as CalendarDays, Pt as Calculator, Q as House, T as Receipt, _ as Search, _t as ClipboardList, bt as CircleUserRound, f as ShieldCheck, ft as Database, h as Settings2, j as PanelLeftOpen, kt as ChartNoAxesCombined, l as TriangleAlert, nt as FlaskConical, r as Users, rt as FileText, st as FileCheck, t as X, tt as FolderOpen, v as ScanLine, vt as ClipboardCheck, wt as ChevronRight, xt as CircleQuestionMark, yt as Circle, z as LogOut, zt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-svjjW0Eb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 lg:h-8 px-3 py-1",
			sm: "h-11 lg:h-8 rounded-md px-2.5 text-sm",
			lg: "h-12 lg:h-10 rounded-md px-4",
			icon: "h-11 w-11 lg:h-8 lg:w-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function usageMetric(used, limit) {
	if (typeof used !== "number" || !Number.isSafeInteger(used) || used < 0) throw new Error("Invalid subscription usage");
	if (limit !== null && (typeof limit !== "number" || !Number.isSafeInteger(limit) || limit <= 0)) throw new Error("Invalid subscription limit");
	const cap = limit;
	return {
		used,
		limit: cap,
		percent: cap === null ? null : Math.min(100, used / cap * 100),
		overLimit: cap !== null && used > cap
	};
}
function recordOf(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid subscription response");
	return value;
}
function mayShowSubscription(path, capabilities) {
	return path === "/" && capabilities.includes("tenant.admin");
}
function parseSubscription(value, orgId) {
	const row = recordOf(value);
	const name = row["plan_name"];
	const status = row["status"];
	if (row["org_id"] !== orgId || typeof name !== "string" || !name.trim() || typeof status !== "string" || ![
		"active",
		"trial",
		"paused",
		"cancelled",
		"expired",
		"unassigned"
	].includes(status) || row["enforcement"] !== "monitoring") throw new Error("Subscription context mismatch");
	const usage = recordOf(row["usage"]);
	const limits = recordOf(row["limits"]);
	return {
		name,
		status,
		endsOn: typeof row["ends_on"] === "string" ? row["ends_on"] : null,
		users: usageMetric(usage["users"], limits["users"]),
		branches: usageMetric(usage["branches"], limits["branches"]),
		cases: usageMetric(usage["monthly_cases"], limits["monthly_cases"])
	};
}
function parseGrowthMode(value, orgId) {
	const row = recordOf(value);
	if (row["org_id"] !== orgId || row["enforcement"] !== "growth" && row["enforcement"] !== "monitoring") throw new Error("Invalid subscription enforcement context");
	return row["enforcement"];
}
function Metric({ label, metric }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums",
					children: [metric.used.toLocaleString("en-IN"), metric.limit !== null ? ` / ${metric.limit.toLocaleString("en-IN")}` : ""]
				})]
			}),
			metric.percent !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-muted",
				role: "progressbar",
				"aria-label": label,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round(metric.percent),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: metric.overLimit ? "h-full rounded-full bg-amber-500" : "h-full rounded-full bg-primary",
					style: { width: `${metric.percent}%` }
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "No configured limit"
			}),
			metric.overLimit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-amber-700",
				children: "Configured limit exceeded"
			})
		]
	});
}
function SubscriptionDetails({ orgId }) {
	const query = useQuery({
		queryKey: ["vp-saas-subscription", orgId],
		staleTime: 3e4,
		gcTime: 0,
		retry: false,
		refetchOnWindowFocus: true,
		queryFn: async () => {
			const [summary, mode] = await Promise.all([vpDb.rpc("vp_saas_my_subscription"), vpDb.rpc("vp_saas_my_growth_mode")]);
			if (summary.error) throw summary.error;
			if (mode.error) throw mode.error;
			return {
				...parseSubscription(summary.data, orgId),
				growthMode: parseGrowthMode(mode.data, orgId)
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-3 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "cursor-pointer px-4 py-3 text-sm font-semibold",
			children: ["Subscription & Usage", !query.isError && query.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 text-xs font-normal text-muted-foreground",
				children: query.data.name
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t px-4 py-3",
			children: query.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Loading subscription..."
			}) : query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Subscription details unavailable."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs underline",
					onClick: () => void query.refetch(),
					children: "Retry"
				})]
			}) : query.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-muted px-2 py-1 text-xs",
							children: query.data.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs capitalize text-muted-foreground",
							children: query.data.status === "unassigned" ? "No commercial contract assigned" : query.data.status
						}),
						query.data.endsOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: ["Valid until (exclusive): ", query.data.endsOn]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto rounded border p-2",
							"aria-label": "Refresh subscription usage",
							disabled: query.isFetching,
							onClick: () => void query.refetch(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
								className: "size-3.5",
								"aria-hidden": "true"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Active users",
							metric: query.data.users
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Active branches",
							metric: query.data.branches
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Monthly cases",
							metric: query.data.cases
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[11px] text-muted-foreground",
					children: query.data.growthMode === "growth" ? "Growth controls enabled. New active users, branches and cases are subject to subscription capacity and validity. Existing workflows remain available under role permissions." : "Monitoring mode. Subscription limits do not currently restrict operational access."
				})
			] }) : null
		})]
	});
}
function VpSubscriptionUsage() {
	const { tenant, capabilities } = useApp();
	if (!mayShowSubscription(useRouterState({ select: (state) => state.location.pathname }), capabilities)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionDetails, { orgId: tenant.id }, tenant.id);
}
function workspaceMode(value) {
	if (value === true) return "demo";
	if (value === false) return "live";
	return "unknown";
}
function VpDemoBanner({ orgId }) {
	const status = useQuery({
		queryKey: ["vp-demo-mode", orgId],
		enabled: Boolean(orgId),
		staleTime: 6e4,
		retry: false,
		refetchOnWindowFocus: true,
		queryFn: async () => {
			const { data, error } = await vpDb.from("orgs").select("demo").eq("id", orgId).single();
			if (error) throw error;
			const value = data?.["demo"];
			if (typeof value !== "boolean") throw new Error("Workspace mode is unavailable");
			return value;
		}
	});
	const mode = status.isError ? "unknown" : workspaceMode(status.data);
	if (mode === "live") return null;
	if (mode === "unknown") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		role: "status",
		className: "mb-3 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "size-4 shrink-0",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: status.isPending ? "Verifying workspace mode..." : "Workspace mode could not be verified."
			}),
			status.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "underline",
				onClick: () => void status.refetch(),
				children: "Retry"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		role: "status",
		"aria-label": "Demonstration workspace",
		className: "mb-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-950",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, {
			className: "mt-0.5 size-4 shrink-0",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-bold uppercase tracking-wide",
			children: "Demonstration workspace"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs",
			children: "Training and synthetic data only. Not for lending or official valuation use."
		})] })]
	});
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-11 lg:h-8 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var Sheet = Dialog$1;
var SheetTrigger = DialogTrigger$1;
var SheetClose = DialogClose;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
var groups = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: "dashboard",
		items: [{
			label: "Dashboard",
			to: "/",
			icon: "dashboard"
		}]
	},
	{
		id: "cases",
		label: "Cases",
		icon: "cases",
		items: [{
			label: "Cases",
			to: "/cases",
			icon: "cases"
		}]
	},
	{
		id: "tasks",
		label: "My Tasks",
		icon: "tasks",
		items: [
			{
				label: "Field operations",
				to: "/field-operations",
				icon: "field"
			},
			{
				label: "Quality checking",
				to: "/qc-checking",
				icon: "qc"
			},
			{
				label: "Reports & sign-off",
				to: "/reports",
				icon: "reports"
			}
		]
	},
	{
		id: "property",
		label: "Property & Market",
		icon: "property",
		items: [{
			label: "Property master",
			to: "/properties",
			icon: "property"
		}, {
			label: "Market evidence",
			to: "/market-intelligence",
			icon: "market"
		}]
	},
	{
		id: "finance",
		label: "Finance & MIS",
		icon: "finance",
		items: [{
			label: "Billing & MIS",
			to: "/billing-mis",
			icon: "finance"
		}, {
			label: "Analytics & audit",
			to: "/analytics",
			icon: "market"
		}]
	},
	{
		id: "admin",
		label: "Administration",
		icon: "admin",
		items: [
			{
				label: "Branches & configuration",
				to: "/admin/branches",
				icon: "property"
			},
			{
				label: "Users",
				to: "/admin/users",
				icon: "users"
			},
			{
				label: "Role permissions",
				to: "/admin/roles-permissions",
				icon: "shield"
			},
			{
				label: "Banks & templates",
				to: "/admin/bank-masters",
				icon: "bank"
			},
			{
				label: "Data connections",
				to: "/admin/data-integrity",
				icon: "database"
			}
		]
	}
];
function workspaceGroups(capabilities) {
	return groups.map((g) => ({
		...g,
		items: g.items.filter((i) => mayOpenPath(i.to, capabilities))
	})).filter((g) => g.items.length > 0);
}
function isWorkspacePath(pathname, to) {
	return pathname === to || to !== "/" && pathname.startsWith(to + "/") || to === "/field-operations" && pathname.startsWith("/field-inspections/") || to === "/admin/branches" && pathname.startsWith("/admin/settings/branches/");
}
/** Only the Field Officer's mobile workspace gets this navigation. It grants no permissions. */
function FieldMobileBottomNav() {
	const { tenant, currentUserName, can } = useApp();
	const queryClient = useQueryClient();
	const location = useRouterState({ select: (state) => state.location });
	if (tenant.role !== "Field Officer" || !(can("field.View") || can("field.Check In/Out"))) return null;
	const onField = location.pathname === "/field-operations";
	const reportTab = onField && location.search["view"] === "reports";
	const inInspection = location.pathname.startsWith("/field-inspections/");
	const item = "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-medium transition-colors";
	const active = "bg-primary/10 text-primary";
	const idle = "text-muted-foreground hover:bg-muted hover:text-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Field Officer mobile navigation",
		className: "vp-field-bottom-nav fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-2 pt-2 shadow-[0_-8px_20px_-18px_#000] backdrop-blur md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-lg items-stretch gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					"aria-label": "Home",
					"aria-current": location.pathname === "/" ? "page" : void 0,
					className: cn(item, location.pathname === "/" ? active : idle),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/field-operations",
					search: { view: "visits" },
					"aria-label": "My visits",
					"aria-current": onField && !reportTab ? "page" : void 0,
					className: cn(item, onField && !reportTab ? active : idle),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Visits" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/field-operations",
					search: { view: "reports" },
					"aria-label": "My reports",
					"aria-current": reportTab || inInspection ? "page" : void 0,
					className: cn(item, reportTab || inInspection ? active : idle),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reports" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
					className: cn(item, idle, "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"),
					"aria-label": "Profile and sign out",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profile" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					side: "top",
					className: "mb-3 w-60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate",
							children: currentUserName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-normal text-muted-foreground",
							children: [
								tenant.role,
								" · ",
								tenant.name
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => void vpSignOutToHome(queryClient).catch((error) => toast.error(error instanceof Error ? error.message : "Sign out failed")),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Sign out"]
						})
					]
				})] })
			]
		})
	});
}
var icons = {
	dashboard: LayoutDashboard,
	cases: FolderOpen,
	tasks: ClipboardList,
	qc: ClipboardCheck,
	field: MapPinned,
	reports: FileText,
	finance: Receipt,
	market: ChartNoAxesCombined,
	property: Building2,
	users: Users,
	shield: ShieldCheck,
	bank: Landmark,
	database: Database,
	admin: Settings2,
	documents: ScanLine,
	history: History,
	certificate: FileCheck,
	valuation: Calculator,
	overview: LayoutDashboard,
	inspection: ClipboardCheck,
	notifications: Bell
};
function VpIcon({ name, className = "size-[18px] shrink-0" }) {
	const Icon = icons[name] ?? CircleQuestionMark;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className,
		strokeWidth: 1.65,
		"aria-hidden": "true"
	});
}
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-slate-950/60  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_1.5rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-3 overflow-y-auto overscroll-contain rounded-lg border bg-card p-4 shadow-xl lg:p-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-2 top-2 flex size-11 lg:size-8 items-center justify-center rounded-md opacity-90 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 pr-9 text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
function VpCommandMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { capabilities } = useApp();
	(0, import_react.useEffect)(() => {
		const handler = (event) => {
			if (event.defaultPrevented || event.isComposing) return;
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);
	const groups = workspaceGroups(capabilities);
	function go(to) {
		if (!mayOpenPath(to, capabilities)) return;
		setOpen(false);
		navigate({ to });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "h-11 lg:h-8 gap-2 bg-background px-2",
				"aria-label": "Open quick navigation (Control or Command K)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "size-[18px]",
						strokeWidth: 1.65,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden xl:inline",
						children: "Jump to…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "ml-2 hidden rounded border bg-muted px-1.5 text-xs xl:inline",
						children: "Ctrl K"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl gap-0 overflow-hidden p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b px-3 pb-2 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Quick navigation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "mt-1",
						children: "Find a permitted workspace. No customer or document search."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
					className: "rounded-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
						autoFocus: true,
						"aria-label": "Find workspace",
						placeholder: "Search workspaces…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, {
						className: "max-h-[min(50vh,400px)] p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No matching workspaces." }),
							groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
								heading: g.label,
								children: g.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
									value: `${g.label} ${i.label} ${i.to}`,
									onSelect: () => go(i.to),
									className: "min-h-11 lg:min-h-9 gap-2 rounded-md px-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, { name: i.icon }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											children: i.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
											className: "size-4 text-muted-foreground",
											"aria-hidden": "true"
										})
									]
								}, i.to))
							}, g.id)),
							mayOpenPath("/notifications", capabilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
								heading: "Personal",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
									value: "notifications",
									onSelect: () => go("/notifications"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, { name: "notifications" }), "Notifications"]
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-t px-3 py-2 text-xs text-muted-foreground",
					children: "Use arrow keys to browse, Enter to open, Escape to close."
				})
			]
		})]
	});
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase() || "VP";
}
function Brand({ collapsed = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "vp-brand-mark flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb] text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 32 32",
				className: "size-6",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M5 12 16 5l11 7-11 7L5 12Zm0 0v8l11 7 11-7v-8M16 19v8",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinejoin: "round",
					strokeLinecap: "round"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "m11 9 11 7",
					stroke: "currentColor",
					strokeWidth: "1.4",
					strokeLinecap: "round"
				})]
			})
		}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-base font-semibold tracking-tight",
				children: "ValuationPro"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-300",
				children: "Agency workspace"
			})]
		})]
	});
}
function TenantSwitcher() {
	const { tenant } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary",
			children: initials(tenant.name)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Organization"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-[180px] truncate text-sm font-semibold",
				title: tenant.name,
				children: tenant.name
			})]
		})]
	});
}
function BranchSelector() {
	const { branch, setBranch, tenantBranches, canUseAllBranches } = useApp();
	const visible = tenantBranches.some((b) => b.id === branch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: branch === "all" || visible ? branch : "",
		onValueChange: setBranch,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "h-10 lg:h-8 w-[168px] max-w-full bg-card",
			"aria-label": "Branch context",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select branch" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [(canUseAllBranches || branch === "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: "all",
			children: canUseAllBranches ? "All branches" : "Assigned branches"
		}), tenantBranches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: b.id,
			disabled: b.status === "Inactive" && !canUseAllBranches,
			children: b.name
		}, b.id))] })]
	});
}
function WorkspaceNavigation({ collapsed = false, mobile = false, onExpand }) {
	const { capabilities } = useApp();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [expanded, setExpanded] = (0, import_react.useState)({});
	const groups = workspaceGroups(capabilities);
	function renderLink(item, nested = false) {
		const active = isWorkspacePath(pathname, item.to);
		const link = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.to,
			"aria-label": item.label,
			"aria-current": active ? "page" : void 0,
			title: collapsed ? item.label : void 0,
			className: cn("vp-nav-link flex min-h-11 lg:min-h-9 items-center gap-2 rounded-md px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300", collapsed && "justify-center px-0", nested && !collapsed && "ml-2 pl-3", active ? "bg-[#294b76] font-semibold text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, { name: item.icon }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0",
				children: item.label
			})]
		});
		return mobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetClose, {
			asChild: true,
			children: link
		}, item.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: link }, item.to);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Main navigation",
		className: "space-y-1",
		children: [groups.map((g) => {
			const active = g.items.some((i) => isWorkspacePath(pathname, i.to));
			const open = expanded[g.id] ?? active;
			if (g.items.length === 1 && ["dashboard", "cases"].includes(g.id)) return renderLink(g.items[0]);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				title: collapsed ? g.label : void 0,
				"aria-label": g.label,
				"aria-expanded": !collapsed && open,
				onClick: () => {
					if (collapsed) onExpand?.();
					setExpanded((p) => ({
						...p,
						[g.id]: collapsed || !open
					}));
				},
				className: cn("flex min-h-11 lg:min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-300", active ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/10", collapsed && "justify-center px-0"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpIcon, { name: g.icon }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1",
					children: g.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", open && "rotate-180"),
					"aria-hidden": "true"
				})] })]
			}), !collapsed && open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 space-y-1",
				children: g.items.map((i) => renderLink(i, true))
			})] }, g.id);
		}), !groups.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			className: "px-2 py-3 text-sm text-slate-300",
			children: "No permitted workspaces."
		})]
	});
}
function MobileWorkspaceMenu() {
	const { tenant } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			className: "size-11 lg:hidden",
			"aria-label": "Open navigation menu",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
		side: "left",
		className: "w-[min(22rem,90vw)] overflow-y-auto border-slate-600 bg-[#101e35] p-5 text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
			className: "mb-5 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
				className: "text-white",
				children: "ValuationPro"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
				className: "text-slate-300",
				children: [
					tenant.name,
					" · ",
					tenant.role
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceNavigation, { mobile: true })]
	})] });
}
function AppShell({ children }) {
	const { tenant, currentUserName, capabilities } = useApp();
	const queryClient = useQueryClient();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setCollapsed(localStorage.getItem("vp-sidebar-collapsed") === "true");
		} catch {}
	}, []);
	function updateCollapsed(v) {
		setCollapsed(v);
		try {
			localStorage.setItem("vp-sidebar-collapsed", String(v));
		} catch {}
	}
	function signOut() {
		vpSignOutToHome(queryClient).catch((error) => toast.error(error instanceof Error ? error.message : "Sign out failed"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#vp-main-content",
				className: "sr-only z-[70] rounded-md bg-card p-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4",
				children: "Skip to main content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("vp-shell-chrome fixed inset-y-0 left-0 z-20 hidden flex-col vp-enterprise-sidebar bg-[#101e35] text-white lg:flex", collapsed ? "w-[60px]" : "w-[216px]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-h-16 lg:min-h-12 items-center border-b border-white/15 px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { collapsed })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-y-auto p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceNavigation, {
							collapsed,
							onExpand: () => updateCollapsed(false)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-white/15 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-1 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								className: "size-9 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "bg-blue-100 font-semibold text-blue-900",
									children: initials(currentUserName)
								})
							}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: currentUserName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-slate-300",
									children: tenant.role
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("vp-shell-body min-w-0", collapsed ? "lg:ml-[60px]" : "lg:ml-[216px]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "vp-shell-chrome sticky top-0 z-10 border-b border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-16 lg:min-h-12 items-center gap-2 px-3 sm:px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileWorkspaceMenu, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "hidden size-11 lg:size-8 lg:inline-flex",
								"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
								"aria-expanded": !collapsed,
								onClick: () => updateCollapsed(!collapsed),
								children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden min-w-0 md:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenantSwitcher, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-sm font-bold md:hidden",
								children: "ValuationPro"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-auto hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchSelector, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-1 sm:ml-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpCommandMenu, {}),
									mayOpenPath("/notifications", capabilities) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										size: "icon",
										className: "size-11 lg:size-8",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/notifications",
											"aria-label": "Notifications",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-11 lg:size-8",
											"aria-label": "Account menu",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
												className: "size-9",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials(currentUserName) })
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "end",
										className: "w-56",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: currentUserName }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: signOut,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), "Sign out"]
											})
										]
									})] })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border px-4 py-2 sm:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BranchSelector, {})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					id: "vp-main-content",
					tabIndex: -1,
					className: "vp-workspace mx-auto min-w-0 w-full max-w-none px-3 pb-28 pt-4 sm:px-4 md:pb-8 lg:py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpDemoBanner, { orgId: tenant.id }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpSubscriptionUsage, {}),
						children
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldMobileBottomNav, {})
		]
	});
}
function PageHeader({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vp-page-header mb-3 flex flex-wrap items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold tracking-tight",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 max-w-3xl text-sm leading-snug text-muted-foreground",
				children: description
			})]
		}), children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children
		})]
	});
}
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("min-w-0 rounded-lg border bg-card text-card-foreground", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1 p-3", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-snug tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-3 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-wrap items-center gap-2 p-3 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
//#endregion
export { SelectTrigger as C, cn as E, SelectItem as S, VpIcon as T, DropdownMenuItem as _, CardDescription as a, Select as b, Dialog as c, DialogFooter as d, DialogHeader as f, DropdownMenuContent as g, DropdownMenu as h, CardContent as i, DialogContent as l, DialogTrigger as m, Button as n, CardHeader as o, DialogTitle as p, Card as r, CardTitle as s, AppShell as t, DialogDescription as u, DropdownMenuTrigger as v, SelectValue as w, SelectContent as x, PageHeader as y };
