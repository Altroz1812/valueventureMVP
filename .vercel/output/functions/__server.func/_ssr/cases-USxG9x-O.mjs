import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Plus, G as LayoutGrid, U as List, _ as Search, d as SlidersHorizontal, zt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, c as Dialog, d as DialogFooter, f as DialogHeader, i as CardContent, l as DialogContent, n as Button, p as DialogTitle, r as Card, t as AppShell, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as STAGES } from "./ops-BcxJm0Qk.mjs";
import { a as useVpBanks, c as useVpPropertyTypes, s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { i as TatBadge, n as PriorityBadge } from "./ops-ui-CJPu_Wj9.mjs";
import { n as VoiceMic, r as VoiceOption, t as VoiceLanguage } from "./vp-voice-BmdpI54j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-USxG9x-O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CasesPage() {
	const { tenant, branch, tenantBranches, tenantUsers, can } = useApp();
	const queryClient = useQueryClient();
	const { cases: scoped, allCases, isLoading, error } = useVpCases();
	const { data: banksData } = useVpBanks();
	const [view, setView] = (0, import_react.useState)("table");
	const [q, setQ] = (0, import_react.useState)("");
	const [stage, setStage] = (0, import_react.useState)("all");
	const [bank, setBank] = (0, import_react.useState)("all");
	const [prio, setPrio] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [assignFor, setAssignFor] = (0, import_react.useState)(null);
	const [assigning, setAssigning] = (0, import_react.useState)(false);
	const rows = (0, import_react.useMemo)(() => scoped.filter((c) => (stage === "all" || c.stage === stage) && (bank === "all" || c.bank === bank) && (prio === "all" || c.priority === prio) && (!q || `${c.caseNo} ${c.customer} ${c.property} ${c.assignedTo}`.toLowerCase().includes(q.toLowerCase()))), [
		scoped,
		stage,
		bank,
		prio,
		q
	]);
	const banks = [...new Set(scoped.map((c) => c.bank))];
	const legacyStages = [...new Set(rows.map((c) => c.stage).filter((s) => !STAGES.includes(s)))];
	async function assign(c, userId) {
		setAssigning(true);
		const who = tenantUsers.find((u) => u.id === userId);
		try {
			const { error } = await vpDb.rpc("vp_case_assign", {
				p_case_num: c.caseNum,
				p_user_id: userId
			});
			if (error) throw error;
			await queryClient.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] });
			toast.success(`Assigned to ${who?.name ?? "selected user"}`);
			setAssignFor(null);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Assignment failed");
		} finally {
			setAssigning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
			title: "Cases",
			description: "Full valuation pipeline across your branches. Filter, assign and open new cases.",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex rounded-md border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: view === "table" ? "secondary" : "ghost",
					onClick: () => setView("table"),
					"aria-label": "Table view",
					"aria-pressed": view === "table",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: view === "board" ? "secondary" : "ghost",
					onClick: () => setView("board"),
					"aria-label": "Board view",
					"aria-pressed": view === "board",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
				})]
			}), can("cases.Create") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New case"]
			})]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			role: "alert",
			className: "mb-4 rounded-md border border-destructive p-3 text-sm text-destructive",
			children: ["Database error: ", error.message]
		}),
		tenantBranches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 rounded-md border p-3 text-sm",
			children: [
				"No branches configured. ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/branches",
					className: "underline",
					children: "Create an agency branch"
				}),
				" before creating a case."
			]
		}),
		(banksData ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 rounded-md border p-3 text-sm",
			children: [
				"No client banks configured. ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/bank-masters",
					className: "underline",
					children: "Add a client bank"
				}),
				" before creating a case."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": "Case filters",
			className: "mb-3 rounded-lg border bg-card p-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
						className: "size-4",
						strokeWidth: 1.65,
						"aria-hidden": "true"
					}), "Case filters"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-sm text-muted-foreground",
					children: error ? "Case list unavailable" : isLoading ? "Loading cases…" : `${rows.length} of ${scoped.length} visible cases`
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 w-full sm:w-64 lg:w-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-8",
							"aria-label": "Search loaded cases",
							placeholder: "Case, customer, property…",
							value: q,
							onChange: (e) => setQ(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						value: stage,
						onChange: setStage,
						all: "All stages",
						items: [...STAGES, ...legacyStages]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						value: bank,
						onChange: setBank,
						all: "All banks",
						items: banks
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						value: prio,
						onChange: setPrio,
						all: "All priorities",
						items: [
							"High",
							"Normal",
							"Low"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: !q && stage === "all" && bank === "all" && prio === "all",
						onClick: () => {
							setQ("");
							setStage("all");
							setBank("all");
							setPrio("all");
						},
						children: "Clear filters"
					})
				]
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-10 text-center text-muted-foreground",
			children: "Loading cases…"
		}) : view === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-border shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Case" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Property" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Bank" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Stage" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Assigned" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Priority" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "TAT" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Fee"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cases/$caseId",
							params: { caseId: c.id },
							className: "inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline",
							children: [c.caseNo, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "size-3.5",
								"aria-hidden": "true"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: c.property
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							c.propertyType,
							" · ",
							c.city
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.bank }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: c.stage
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.assignedTo }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.priorityKnown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { p: c.priority }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "—" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TatBadge, { c }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: c.feeKnown ? fmtINR(c.fee) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: can("cases.Assign") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setAssignFor(c),
						children: "Assign"
					}) })
				] }, c.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 9,
					className: "py-10 text-center text-muted-foreground",
					children: "No cases match these filters."
				}) })] })] })
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-3 overflow-x-auto pb-2",
			children: [...STAGES, ...legacyStages].map((s) => {
				const list = rows.filter((c) => c.stage === s);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-64 shrink-0 rounded-lg bg-muted/50 p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between px-1 text-sm font-semibold",
						children: [s, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: list.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-1.5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/cases/$caseId",
										params: { caseId: c.id },
										className: "block font-mono text-[11px] text-muted-foreground hover:text-primary",
										children: c.caseNo
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium leading-snug",
										children: c.property
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											c.bank,
											" · ",
											c.assignedTo
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1.5",
										children: [c.priorityKnown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { p: c.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TatBadge, { c })]
									})
								]
							})
						}, c.id))
					})]
				}, s);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCaseDialog, {
			open,
			onOpenChange: setOpen
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!assignFor,
			onOpenChange: (o) => !o && setAssignFor(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Reassign ", assignFor?.caseNo] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: tenantUsers.filter((u) => u.status === "Active").map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: assigning,
						className: "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50",
						onClick: () => assign(assignFor, u.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: u.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: u.role
						})]
					}, u.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Available: active users in your agency. Branch-level user allocation will follow in a later phase."
				})
			] })
		})
	] });
}
function Filter({ value, onChange, all, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value,
		onValueChange: onChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			"aria-label": all,
			className: "w-44 lg:w-36 max-w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: "all",
			children: all
		}), items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: i,
			children: i
		}, i))] })]
	});
}
function NewCaseDialog({ open, onOpenChange }) {
	const { tenant, branch, tenantBranches, tenantUsers } = useApp();
	const { data: banks = [] } = useVpBanks();
	const { data: propertyTypes = [], isLoading: typesLoading, error: typesError } = useVpPropertyTypes();
	const client = useQueryClient();
	const [br, setBr] = (0, import_react.useState)("");
	const [bankName, setBankName] = (0, import_react.useState)("");
	const [ptype, setPtype] = (0, import_react.useState)("");
	const [property, setProperty] = (0, import_react.useState)("");
	const [customer, setCustomer] = (0, import_react.useState)("");
	const [assignee, setAssignee] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("Normal");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [voiceLang, setVoiceLang] = (0, import_react.useState)("en-IN");
	const branchId = br || (branch !== "all" ? branch : tenantBranches.find((x) => x.status === "Active")?.id ?? "");
	const selectedBranch = tenantBranches.find((b) => b.id === branchId);
	const selectedBank = banks.find((b) => b.name === bankName);
	const tariff = selectedBank?.tariffs.find((r) => r.property_type === ptype);
	const fee = tariff?.fee;
	const tat = tariff?.tat_days;
	const allowedTypes = propertyTypes.filter((t) => t.is_active).map((t) => t.code);
	async function submit() {
		if (!selectedBranch || selectedBranch.status !== "Active" || !selectedBank || !allowedTypes.includes(ptype) || !property.trim() || !customer.trim()) {
			toast.error("Select an active branch, bank and property type; enter customer name and address");
			return;
		}
		setBusy(true);
		try {
			const { data, error } = await vpDb.rpc("vp_case_create", {
				p_branch_id: branchId,
				p_bank_name: bankName,
				p_customer: customer.trim(),
				p_product: ptype,
				p_address: property.trim(),
				p_assignee_user_id: assignee || null,
				p_priority: priority
			});
			if (error) throw error;
			await client.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] });
			toast.success(`Case #${data} created`);
			setProperty("");
			setCustomer("");
			setPtype("");
			setBankName("");
			setAssignee("");
			onOpenChange(false);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Unable to create case");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New valuation case" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLanguage, {
					value: voiceLang,
					onChange: setVoiceLang
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Branch" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: branchId,
									onValueChange: setBr,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select branch" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tenantBranches.filter((x) => x.status === "Active").map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: x.id,
										children: x.name
									}, x.id)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
									label: "Branch",
									lang: voiceLang,
									options: tenantBranches.filter((x) => x.status === "Active").map((b) => b.name),
									onSelect: (name) => {
										const chosen = tenantBranches.find((b) => b.name === name);
										if (chosen) setBr(chosen.id);
									}
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client bank" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bankName,
									onValueChange: (v) => {
										setBankName(v);
										setPtype("");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select bank" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: banks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: b.name,
										children: b.name
									}, b.name)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
									label: "Bank",
									lang: voiceLang,
									options: banks.map((b) => b.name),
									onSelect: (name) => {
										setBankName(name);
										setPtype("");
									}
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: customer,
								onChange: (e) => setCustomer(e.target.value),
								placeholder: "Borrower / customer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
								lang: voiceLang,
								label: "Customer name",
								onTranscript: (spoken) => setCustomer((old) => old ? `${old} ${spoken}` : spoken)
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property type" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: ptype,
								onValueChange: setPtype,
								disabled: typesLoading || !!typesError,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select property category" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: allowedTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									children: t
								}, t)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
								label: "Property type",
								lang: voiceLang,
								disabled: !selectedBank,
								options: allowedTypes,
								onSelect: setPtype
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: property,
								onChange: (e) => setProperty(e.target.value),
								placeholder: "e.g. Flat 504, Aparna Sarovar, Nallagandla"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
								lang: voiceLang,
								label: "Property address",
								onTranscript: (spoken) => setProperty((old) => old ? `${old} ${spoken}` : spoken)
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign to" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: assignee || "unassigned",
									onValueChange: (v) => setAssignee(v === "unassigned" ? "" : v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Unassigned" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "unassigned",
										children: "Unassigned"
									}), tenantUsers.filter((u) => u.status === "Active").map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: u.id,
										children: u.name
									}, u.id))] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
									label: "Assignee",
									lang: voiceLang,
									options: tenantUsers.filter((u) => u.status === "Active").map((u) => u.name),
									onSelect: (name) => {
										const who = tenantUsers.find((u) => u.name === name);
										if (who) setAssignee(who.id);
									}
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: priority,
									onValueChange: (v) => setPriority(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"High",
										"Normal",
										"Low"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p,
										children: p
									}, p)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
									label: "Priority",
									lang: voiceLang,
									options: [
										"High",
										"Normal",
										"Low"
									],
									onSelect: (v) => setPriority(v)
								})
							] })]
						}),
						selectedBank && selectedBranch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-muted p-3 text-sm",
							children: [
								"Rate card fee ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tariff ? fmtINR(fee) : "Pending configuration" }),
								" · TAT ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [tat ?? selectedBranch.tatDays, " day(s)"] }),
								" · DB stage ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Received" })
							]
						}),
						(!tenantBranches.length || !banks.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Set up a branch and a client bank in Administration first."
						}),
						typesError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							role: "alert",
							className: "text-xs text-destructive",
							children: ["Property type master is unavailable: ", typesError.message]
						}),
						!typesLoading && allowedTypes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No active property types. Ask your tenant administrator to enable a category in Bank Masters."
						}),
						selectedBank && ptype && !tariff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No bank/property tariff is configured. The case can still be created; the fee will remain pending and the branch TAT will be used."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || typesLoading || !!typesError || !tenantBranches.length || !banks.length || !ptype || !allowedTypes.includes(ptype),
					onClick: submit,
					children: busy ? "Creating…" : "Create case"
				})] })
			]
		})
	});
}
//#endregion
export { CasesPage as component };
