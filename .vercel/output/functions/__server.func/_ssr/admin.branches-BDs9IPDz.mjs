import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Plus, Ft as Building2, Ht as Activity, J as Landmark, L as MapPin, h as Settings2, k as Pencil, r as Users, ut as Ellipsis } from "../_libs/lucide-react.mjs";
import { _ as DropdownMenuItem, c as Dialog, d as DialogFooter, f as DialogHeader, g as DropdownMenuContent, h as DropdownMenu, i as CardContent, l as DialogContent, n as Button, p as DialogTitle, r as Card, t as AppShell, u as DialogDescription, v as DropdownMenuTrigger, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { n as VpFin02BranchGeo } from "./vp-fin02-config-DW5RnkQ6.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-KC4eSjOh.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.branches-BDs9IPDz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var blank = {
	name: "",
	code: "",
	type: "Local",
	city: "",
	state: "",
	pin: "",
	address: "",
	manager: "",
	email: "",
	phone: "",
	casePrefix: "",
	tatDays: "3",
	geofenceKm: "0",
	active: true
};
function fromBranch(b) {
	return {
		name: b.name,
		code: b.code,
		type: b.type,
		city: b.city,
		state: b.state,
		pin: b.pin,
		address: b.address,
		manager: b.manager,
		email: b.email,
		phone: b.phone,
		casePrefix: b.casePrefix,
		tatDays: String(b.tatDays),
		geofenceKm: String(b.geofenceKm),
		active: b.status === "Active"
	};
}
function BranchesPage() {
	const { tenant, tenantBranches, reloadBranches } = useApp();
	const { allCases } = useVpCases();
	const qc = useQueryClient();
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(blank);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const detail = tenantBranches.find((b) => b.id === detailId);
	const activeCount = (b) => allCases.filter((c) => c.branchId === b.id && ![
		"Approved",
		"Delivered",
		"Submitted",
		"Invoiced"
	].includes(c.stage)).length;
	const kpis = [
		{
			label: "Total Branches",
			value: tenantBranches.length,
			icon: Building2
		},
		{
			label: "Active",
			value: tenantBranches.filter((b) => b.status === "Active").length,
			icon: Activity
		},
		{
			label: "Inactive",
			value: tenantBranches.filter((b) => b.status === "Inactive").length,
			icon: MapPin
		},
		{
			label: "Branch Users",
			value: "—",
			icon: Users
		}
	];
	function startEdit(b) {
		setEditId(b?.id ?? null);
		setForm(b ? fromBranch(b) : blank);
		setEditOpen(true);
	}
	function field(name, value) {
		setForm((old) => ({
			...old,
			[name]: value
		}));
	}
	async function save() {
		if (!form.name.trim() || !form.code || !form.city.trim() || !form.casePrefix) {
			toast.error("Branch name, code, city and case prefix are required");
			return;
		}
		setSaving(true);
		try {
			const { error } = await vpDb.rpc("vp_admin_save_branch", {
				p_id: editId,
				p_name: form.name,
				p_code: form.code.toUpperCase(),
				p_type: form.type,
				p_city: form.city,
				p_state: form.state,
				p_pin: form.pin,
				p_address: form.address,
				p_manager: form.manager,
				p_email: form.email,
				p_phone: form.phone,
				p_prefix: form.casePrefix.toUpperCase(),
				p_tat_days: Number(form.tatDays),
				p_geofence_km: Number(form.geofenceKm),
				p_active: form.active
			});
			if (error) throw error;
			await reloadBranches();
			await qc.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] });
			setEditOpen(false);
			toast.success("Branch saved to Supabase");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Branch save failed");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Agency Branches",
			description: `Offices of ${tenant.name}. Configuration inherits tenant defaults — override only what must differ.`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => startEdit(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Branch"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin02BranchGeo, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-4",
			children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-lg bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: "size-4 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-bold leading-none",
						children: k.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: k.label
					})] })]
				})
			}, k.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "bg-muted/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Branch" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Code" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden md:table-cell",
						children: "Branch Manager"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Users" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Active Cases"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-24 text-right",
						children: "Actions"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [tenantBranches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "text-left",
					onClick: () => setDetailId(b.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold hover:underline",
						children: b.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground",
						children: [
							b.city,
							", ",
							b.state,
							" · ",
							b.type
						]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs",
					children: b.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "hidden text-xs md:table-cell",
					children: b.manager || "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-xs font-medium",
					children: "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "hidden text-xs sm:table-cell",
					children: activeCount(b)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: b.status
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "size-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => setDetailId(b.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }), " View details"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => startEdit(b),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), " Edit branch"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								disabled: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), " Advanced settings (later)"]
							})
						]
					})] })
				})
			] }, b.id)), tenantBranches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 7,
				className: "py-8 text-center text-muted-foreground",
				children: "No branches yet. Add your first branch."
			}) })] })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display",
						children: [editId ? "Edit" : "Add", " branch"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Branch settings inherit tenant defaults unless overridden below." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "general",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "flex w-full flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "general",
										children: "General"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "contact",
										children: "Contact"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "ops",
										children: "Operational"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "perm",
										children: "Permissions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "integr",
										children: "Integrations"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "general",
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Branch name",
										value: form.name,
										onChange: (v) => field("name", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Branch code",
										value: form.code,
										onChange: (v) => field("code", v.toUpperCase())
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Branch type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "h-9 w-full rounded-md border bg-background px-2 text-sm",
											value: form.type,
											onChange: (e) => field("type", e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Head Office" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Regional" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Local" })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Branch manager",
										value: form.manager,
										onChange: (v) => field("manager", v)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "contact",
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Address",
										value: form.address,
										onChange: (v) => field("address", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "City",
										value: form.city,
										onChange: (v) => field("city", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "State",
										value: form.state,
										onChange: (v) => field("state", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "PIN",
										value: form.pin,
										onChange: (v) => field("pin", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone",
										value: form.phone,
										onChange: (v) => field("phone", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Email",
										value: form.email,
										onChange: (v) => field("email", v)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "ops",
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Case numbering prefix",
										value: form.casePrefix,
										onChange: (v) => field("casePrefix", v.toUpperCase())
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Default case TAT (days)",
										value: form.tatDays,
										onChange: (v) => field("tatDays", v),
										type: "number"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: form.active,
											onChange: (e) => field("active", e.target.checked)
										}), " Active"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "perm",
								className: "mt-4 text-sm text-muted-foreground",
								children: "Case CRUD permissions are enforced using the Role Matrix. Branch-level user allocations will follow."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "integr",
								className: "mt-4 text-sm text-muted-foreground",
								children: "Branch-specific integrations are not connected in Phase 2."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEditOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: saving,
						onClick: save,
						children: saving ? "Saving…" : "Save branch"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!detailId,
			onOpenChange: (o) => !o && setDetailId(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-2xl",
				children: detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display",
						children: [
							detail.name,
							" · ",
							detail.code
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						detail.address,
						", ",
						detail.city,
						" ",
						detail.pin,
						" · opened ",
						detail.openedOn
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "overview",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "flex w-full flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "overview",
										children: "Overview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "staff",
										children: "Users"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "cases",
										children: "Cases"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "config",
										children: "Configuration"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "overview",
								className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
								children: [
									["Active cases", activeCount(detail)],
									["Staff", "—"],
									["TAT", `${detail.tatDays} days`],
									["Status", detail.status]
								].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg font-bold",
										children: v
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: l
									})]
								}, String(l)))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "staff",
								className: "mt-4 text-sm",
								children: [
									"Branch head: ",
									detail.manager || "Not set",
									". Branch-level staff allocations are not configured yet."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "cases",
								className: "mt-4",
								children: allCases.filter((c) => c.branchId === detail.id).slice(0, 8).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b py-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/cases/$caseId",
											params: { caseId: c.id },
											className: "font-mono underline",
											children: c.caseNo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											c.bank,
											" · ",
											c.stage
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.feeKnown ? fmtINR(c.fee) : "—" })
									]
								}, c.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "config",
								className: "mt-4 text-sm text-muted-foreground",
								children: [
									"TAT ",
									detail.tatDays,
									" days · prefix ",
									detail.casePrefix,
									". Advanced settings are not yet connected."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-3.5" }), " Branch bank empanelments will be implemented separately."]
					})
				] })
			})
		})
	] });
}
function Field({ label, value, onChange, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type,
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
//#endregion
export { BranchesPage as component };
