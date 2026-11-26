import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as PenLine, At as ChartColumn, I as MapPinned, J as Landmark, Rt as BadgeCheck, T as Receipt, V as Lock, f as ShieldCheck, m as Settings, mt as Copy, r as Users, tt as FolderOpen } from "../_libs/lucide-react.mjs";
import { E as cn, a as CardDescription, c as Dialog, d as DialogFooter, f as DialogHeader, i as CardContent, l as DialogContent, m as DialogTrigger, n as Button, o as CardHeader, p as DialogTitle, r as Card, s as CardTitle, t as AppShell, u as DialogDescription, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { n as permissionModules } from "./data-BZzdNe14.mjs";
import { t as Checkbox } from "./checkbox-BI658bIE.mjs";
import { t as Switch } from "./switch-n1RkjKwl.mjs";
import { a as ScrollAreaViewport, i as ScrollAreaThumb, n as ScrollAreaCorner, r as ScrollAreaScrollbar, t as ScrollArea$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { a as TooltipTrigger$1, i as TooltipProvider$1, n as TooltipContent$1, r as TooltipPortal, t as Tooltip$1 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.roles-permissions-C3nql03d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea$1, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaViewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaCorner, {})
	]
}));
ScrollArea.displayName = ScrollArea$1.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var TooltipProvider = TooltipProvider$1;
var Tooltip = Tooltip$1;
var TooltipTrigger = TooltipTrigger$1;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = TooltipContent$1.displayName;
var moduleIcons = {
	cases: FolderOpen,
	field: MapPinned,
	qc: ShieldCheck,
	signoff: PenLine,
	billing: Receipt,
	analytics: ChartColumn,
	admin: Settings
};
function RolesPage() {
	const { tenant } = useApp();
	const queryClient = useQueryClient();
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [matrix, setMatrix] = (0, import_react.useState)({});
	const [updating, setUpdating] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [ibbiLock, setIbbiLock] = (0, import_react.useState)(true);
	const [cloneOpen, setCloneOpen] = (0, import_react.useState)(false);
	const [cloneSource, setCloneSource] = (0, import_react.useState)("");
	const [cloneName, setCloneName] = (0, import_react.useState)("");
	async function loadMatrix() {
		setLoadError(null);
		const { data: rows, error: matrixError } = await vpDb.rpc("vp_sec_admin_role_matrix");
		if (matrixError) throw matrixError;
		if (!Array.isArray(rows)) throw new Error("Invalid role matrix response");
		const fetched = [...new Set(rows.map((r) => String(r.role_name)))].sort().map((name) => ({
			id: name,
			name,
			ibbi: false,
			system: [
				"Tenant Owner",
				"Tenant Admin",
				"Branch Admin",
				"Back Office",
				"Checker",
				"Field Officer",
				"Accounts",
				"Manager"
			].includes(name)
		}));
		const next = {};
		for (const role of fetched) next[role.id] = {};
		for (const row of rows) {
			if (!row.permission || !next[row.role_name]) continue;
			const split = row.permission.indexOf(".");
			if (split < 0) continue;
			const mod = row.permission.slice(0, split);
			const action = row.permission.slice(split + 1);
			if (permissionModules.find((m) => m.id === mod)?.actions.includes(action)) next[row.role_name][mod] = [...next[row.role_name][mod] ?? [], action];
		}
		setRoles(fetched);
		setMatrix(next);
		if (fetched.length) setCloneSource((prev) => fetched.some((r) => r.id === prev) ? prev : fetched[0].id);
	}
	(0, import_react.useEffect)(() => {
		loadMatrix().catch((e) => {
			const message = e instanceof Error ? e.message : "Unable to load permissions";
			setLoadError(message);
			toast.error(message);
		});
	}, [tenant.id]);
	async function updateModule(roleId, moduleId, actions) {
		if (updating) return;
		const actionsToSave = moduleId === "admin" ? actions.filter((action) => action === "Audit Logs") : actions;
		setUpdating(roleId + ":" + moduleId);
		try {
			const { error } = moduleId === "analytics" ? await vpDb.rpc("vp8_admin_set_analytics_permissions", {
				p_role: roleId,
				p_actions: actionsToSave
			}) : await vpDb.rpc("vp_admin_replace_module_permissions", {
				p_role: roleId,
				p_module: moduleId,
				p_actions: actionsToSave
			});
			if (error) {
				toast.error(error.message);
				await loadMatrix();
				return;
			}
			await loadMatrix();
			window.dispatchEvent(new Event("vp-permissions-changed"));
			toast.success("Permissions saved and reloaded");
			await Promise.all([queryClient.invalidateQueries({ queryKey: ["vp-qc-eligible-checkers", tenant.id] }), queryClient.invalidateQueries({ queryKey: ["vp-qc-permissions", tenant.id] })]);
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);
			toast.error(message);
			setLoadError(message);
		} finally {
			setUpdating(null);
		}
	}
	function setCell(roleId, moduleId, action, on) {
		const current = matrix[roleId]?.[moduleId] ?? [];
		updateModule(roleId, moduleId, on ? [.../* @__PURE__ */ new Set([...current, action])] : current.filter((a) => a !== action));
	}
	function toggleModuleForRole(roleId, moduleId) {
		const mod = permissionModules.find((m) => m.id === moduleId);
		const current = matrix[roleId]?.[moduleId] ?? [];
		const editable = mod.actions.filter((a) => !isLocked(roleId, moduleId, a));
		if (!editable.length) return;
		updateModule(roleId, moduleId, editable.every((a) => current.includes(a)) ? current.filter((a) => !editable.includes(a)) : [.../* @__PURE__ */ new Set([...current, ...editable])]);
	}
	const isLocked = (_roleId, moduleId, action) => moduleId === "signoff" && action === "Sign" || moduleId === "admin" && action !== "Audit Logs";
	const granted = (0, import_react.useMemo)(() => {
		let n = 0;
		for (const roleId of Object.keys(matrix)) for (const modId of Object.keys(matrix[roleId] ?? {})) n += (matrix[roleId]?.[modId] ?? []).length;
		return n;
	}, [matrix]);
	async function cloneRole() {
		if (!cloneName.trim()) {
			toast.error("Give the new role a name first.");
			return;
		}
		const { error } = await vpDb.rpc("vp_admin_clone_role", {
			p_source: cloneSource,
			p_name: cloneName.trim()
		});
		if (error) {
			toast.error(error.message);
			await loadMatrix();
			return;
		}
		await loadMatrix();
		window.dispatchEvent(new Event("vp-permissions-changed"));
		await queryClient.invalidateQueries({ queryKey: ["vp-qc-eligible-checkers", tenant.id] });
		toast.success(`Role "${cloneName.trim()}" created`);
		setCloneOpen(false);
		setCloneName("");
	}
	const checkerActions = matrix["Checker"]?.["qc"] ?? [];
	const checkerReady = checkerActions.includes("View") && checkerActions.includes("Approve") && checkerActions.includes("Return");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
			title: "Role & Capability Matrix",
			description: "Every role across your agency, mapped to what it can do in each module. Changes apply to all users holding the role.",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "outline",
				className: "gap-1 border-success/30 bg-success/10 text-[11px] text-success",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-3" }),
					" ",
					granted,
					" permissions granted"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: cloneOpen,
				onOpenChange: setCloneOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Clone Role"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display",
						children: "Clone an existing role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Copy a role's full permission set, then adjust the details." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Base role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: cloneSource,
							onChange: (e) => setCloneSource(e.target.value),
							className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm",
							children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.id,
								children: r.name
							}, r.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "New role name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cloneName,
							onChange: (e) => setCloneName(e.target.value),
							placeholder: "e.g. Valuation Head"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setCloneOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							cloneRole();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Create role"]
					})] })
				] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-md border p-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Checker role readiness: " }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: checkerReady ? "text-success" : "text-destructive",
					children: checkerReady ? "Configured" : "Missing QC permissions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "For an active, email-verified Checker to appear in QC assignment, grant QC View, Approve and Return. The QC Edit permission is for coordinators who assign checkers, not required for an individual checker."
				})
			]
		}),
		loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "alert",
			className: "mb-3 flex flex-wrap items-center gap-3 rounded border border-destructive p-2 text-sm text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Role Matrix failed to load/save: ", loadError] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => void loadMatrix().catch((e) => setLoadError(e instanceof Error ? e.message : String(e))),
				children: "Retry"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-xs text-muted-foreground",
			children: "Protected administrator management is granted by the server-side `tenant.admin` capability and cannot be switched off with the legacy admin.* checkboxes. Only Administration → Audit Logs is independently selectable. Unchecking Cases, Field, QC, Reports, Billing or Analytics removes data access even from administrators after P10 SQL is installed. Changes are authoritative only after a successful save."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "outline",
				className: cn("gap-1.5 px-3 py-1.5 text-xs", r.system ? "border-primary/25 bg-primary/5 text-primary" : "border-accent/40 bg-accent/15 text-accent-foreground"),
				children: [
					r.system ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3" }),
					r.name,
					r.ibbi && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-3 text-success" })
				]
			}, r.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-border shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row flex-wrap items-center justify-between gap-3 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "font-display text-base",
					children: "Permission grid"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Click any cell to grant or revoke a single capability. Use the module toggle to set a whole row for a role." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5 text-warning-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-warning-foreground",
							children: "IBBI sign-off lock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: ibbiLock,
							onCheckedChange: setIbbiLock,
							disabled: true
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
				delayDuration: 200,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "w-full whitespace-nowrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "sticky left-0 z-10 min-w-[230px] bg-card",
						children: "Module / Capability"
					}), roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
						className: "min-w-[92px] text-center text-[11px] leading-tight",
						children: [r.name, r.ibbi && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "mx-auto mt-0.5 size-3 text-success" })]
					}, r.id))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: permissionModules.map((mod) => {
						const Icon = moduleIcons[mod.id] ?? Settings;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
							className: "bg-muted/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "sticky left-0 z-10 bg-muted/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 font-display text-sm font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }),
										" ",
										mod.name
									]
								})
							}), roles.map((r) => {
								const allowedActions = mod.actions.filter((a) => !isLocked(r.id, mod.id, a));
								const all = allowedActions.length > 0 && allowedActions.every((a) => (matrix[r.id]?.[mod.id] ?? []).includes(a));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: all,
										onCheckedChange: () => toggleModuleForRole(r.id, mod.id),
										"aria-label": `Toggle all ${mod.name} for ${r.name}`,
										disabled: updating !== null || Boolean(loadError) || allowedActions.length === 0,
										className: "data-[state=checked]:bg-primary"
									})
								}, r.id);
							})]
						}, `${mod.id}-h`), mod.actions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "sticky left-0 z-10 bg-card pl-10 text-[13px] text-muted-foreground",
							children: [action, mod.ibbiLockedAction === action && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "ml-2 inline size-3 align-[-1px] text-warning-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
								side: "right",
								className: "max-w-56 text-xs",
								children: "Digital sign-off requires verified IBBI registration, which is not stored in the current 16-table schema. The lock remains enforced."
							})] })]
						}), roles.map((r) => {
							const locked = isLocked(r.id, mod.id, action);
							const on = locked ? false : (matrix[r.id]?.[mod.id] ?? []).includes(action);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-center",
								children: locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									title: mod.id === "admin" ? "Protected administration (tenant.admin)" : "IBBI verification required",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mx-auto size-3.5 text-muted-foreground/50" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: on,
									onCheckedChange: (v) => setCell(r.id, mod.id, action, v === true),
									"aria-label": `${action} for ${r.name} in ${mod.name}`,
									disabled: updating !== null || Boolean(loadError)
								})
							}, r.id);
						})] }, `${mod.id}-${action}`))] });
					}) })] })
				})
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-3.5" }), "Maker–checker guidance: avoid granting a user both \"Create\" and \"Approve\" on the same module when your workflow requires separation of duties."]
		})
	] });
}
//#endregion
export { RolesPage as component };
