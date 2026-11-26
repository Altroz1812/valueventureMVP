import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as RefreshCw, I as MapPinned, L as MapPin, Nt as CalendarClock, Q as House, _t as ClipboardList, f as ShieldCheck, jt as Camera, l as TriangleAlert, n as Wallet, ot as FilePenLine, r as Users, rt as FileText, vt as ClipboardCheck, wt as ChevronRight, zt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { n as vp8GetAudit, t as useVp8Access } from "./vp-analytics-KLm34ulp.mjs";
import { a as useVpFieldVisits } from "./vp-field-CDqchrKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-HQ23i5ng.js
var import_jsx_runtime = require_jsx_runtime();
async function vp9GetDashboard(branchId) {
	const { data, error } = await vpDb.rpc("vp9_dashboard_snapshot", { p_branch_id: branchId });
	if (error) throw new Error(error.message || "Unable to load dashboard");
	if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Dashboard summary was not returned by Supabase");
	return data;
}
function useVp9Dashboard() {
	const { tenant, branch, can } = useApp();
	const allowed = can("analytics.View");
	const branchId = branch === "all" ? null : branch;
	return useQuery({
		queryKey: [
			"vp9",
			"dashboard",
			tenant.id,
			branchId,
			allowed
		],
		queryFn: () => vp9GetDashboard(branchId),
		enabled: Boolean(tenant.id) && allowed,
		staleTime: 15e3,
		refetchInterval: allowed ? 6e4 : false,
		refetchOnWindowFocus: allowed,
		retry: false
	});
}
var number = (value) => value === void 0 ? "—" : value.toLocaleString("en-IN");
var money = (value) => value == null ? "—" : new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
}).format(value);
/** Replaces only the five existing dashboard KPI cards. No demo data. */
function Vp9DashboardCards() {
	const { data, isPending, error, refetch, isFetching } = useVp9Dashboard();
	const missing = error !== null;
	const value = (n) => isPending ? "…" : missing ? "—" : number(n);
	const financeValue = isPending ? "…" : missing ? "—" : !data?.billing_access ? "Restricted" : money(data.billing_mtd);
	const cards = [
		{
			label: "Active Cases",
			value: value(data?.active_cases),
			icon: FileText,
			hint: "All currently open cases"
		},
		{
			label: "Pending QC",
			value: value(data?.pending_qc),
			icon: ClipboardCheck,
			hint: "All pending QC rounds"
		},
		{
			label: "Field Visits Today",
			value: value(data?.field_visits_today),
			icon: MapPinned,
			hint: "Scheduled today, excluding cancelled"
		},
		{
			label: "Reports Due This Week",
			value: value(data?.reports_due_this_week),
			icon: CalendarClock,
			hint: "Unreleased cases due in 7 days"
		},
		{
			label: "Billing MTD",
			value: financeValue,
			icon: Wallet,
			hint: data?.billing_access === false ? "Billing View permission required" : "Linked invoices created this month"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			role: "alert",
			className: "mb-3 rounded-md border border-destructive/40 p-3 text-sm text-destructive",
			children: [
				"Dashboard cannot load live figures: ",
				error instanceof Error ? error.message : String(error),
				". Nothing has been treated as zero."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "vp-kpi-grid",
			"aria-label": "Live dashboard KPIs",
			children: cards.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "vp-kpi-content p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground",
								children: k.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-primary/10 p-1.5 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, {
									className: "size-4 shrink-0",
									"aria-hidden": "true"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl font-semibold tabular-nums text-foreground break-words",
							"aria-label": `${k.label}: ${k.value}`,
							children: k.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: k.hint
						})
					]
				})
			}, k.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-x-3 gap-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Overdue cases: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: value(data?.overdue_cases)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Reports released MTD: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: value(data?.reports_released_mtd)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Visits completed MTD: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: value(data?.field_visits_completed_mtd)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Receipts MTD: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: isPending ? "…" : missing ? "—" : !data?.billing_access ? "Restricted" : money(data.receipts_mtd)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["My unread alerts (all branches): ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: value(data?.unread_alerts_all_branches)
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [data?.as_of && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Updated ",
					new Date(data.as_of).toLocaleTimeString("en-IN", {
						timeZone: "Asia/Kolkata",
						hour: "2-digit",
						minute: "2-digit"
					}),
					" IST"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					disabled: isFetching,
					onClick: () => void refetch(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), isFetching ? "Refreshing…" : "Refresh"]
				})]
			})]
		})
	] });
}
/** Uses the same permission-checked RPC as KPI figures, not an unfiltered UI array. */
function Vp9DashboardBranchPerformance() {
	const { data, error, isPending } = useVp9Dashboard();
	const rows = error ? [] : data?.branch_performance ?? [];
	const max = Math.max(1, ...rows.map((r) => Number(r.active_cases)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "font-display text-base",
				children: "Branch Performance"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [
				isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Loading authorized branches…"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-destructive",
					children: "Branch figures unavailable."
				}),
				!isPending && !error && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No permitted branches configured."
				}),
				rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: row.branch_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [number(row.active_cases), " active"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 rounded-full bg-muted",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-full bg-primary",
						style: { width: `${Math.round(100 * Number(row.active_cases) / max)}%` }
					})
				})] }, row.branch_id)),
				rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Unallocated cases are included in tenant-admin totals but not attributed to a branch."
				})
			]
		})]
	});
}
/** Phase 8 cross-module audit feed replaces the older case-log-only activity card. */
function Vp9DashboardActivity() {
	const { tenant } = useApp();
	const access = useVp8Access();
	const allowed = access.data?.audit === true;
	const audit = useQuery({
		queryKey: [
			"vp9",
			tenant.id,
			"recent-cross-module-activity"
		],
		queryFn: () => vp8GetAudit(5, 0),
		enabled: allowed,
		staleTime: 15e3,
		refetchInterval: 6e4,
		retry: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "font-display text-base",
				children: "Recent Activity"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [
				access.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Checking access…"
				}),
				access.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-destructive",
					children: "Unable to check audit permissions."
				}),
				!access.isPending && !access.error && !allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Analytics → Audit permission required to view cross-module activity."
				}),
				allowed && audit.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Loading activity…"
				}),
				allowed && audit.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-destructive",
					children: "Unable to load audit events."
				}),
				allowed && (audit.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-1.5 shrink-0 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-foreground",
						children: [
							a.category,
							": ",
							a.description
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							a.actor || "System",
							" · ",
							a.event_time ? new Date(a.event_time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "Date unavailable"
						]
					})] })]
				}, a.source_key)),
				allowed && !audit.isPending && !audit.error && (audit.data ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "No recent activity."
				}),
				allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1 inline size-3" }), "Case log dates may have day-only precision."]
				})
			]
		})]
	});
}
/** Same authorized snapshot as KPI cards, so branch selection cannot leak recent cases. */
function Vp9DashboardRecentCases() {
	const { data, error, isPending } = useVp9Dashboard();
	const rows = error ? [] : data?.recent_cases ?? [];
	const { can } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border shadow-sm vp-recent-cases",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "font-display text-base",
				children: "Recent Cases"
			}), can("cases.View") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cases",
				className: "text-sm text-primary underline",
				children: "View all cases"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				"aria-label": "Recent cases",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Case No." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "table-cell",
						children: "Property"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Bank" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "table-cell",
						children: "Stage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "TAT"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-sm font-medium",
						children: can("cases.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cases/$caseId",
							params: { caseId: String(c.num) },
							className: "text-primary underline",
							children: c.case_no
						}) : c.case_no
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "max-w-[220px] whitespace-normal break-words",
						title: c.property,
						children: c.property
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm",
						children: c.bank
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "table-cell",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "border-transparent text-xs",
							children: c.stage
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: `text-right text-xs font-semibold ${c.days_left <= 1 ? "text-destructive" : "text-muted-foreground"}`,
						children: ["Delivered", "Approved"].includes(c.stage) ? "—" : `${c.days_left}d`
					})
				] }, c.num)) })]
			}),
			isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-5 text-center text-xs text-muted-foreground",
				children: "Loading recent cases…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-5 text-center text-xs text-destructive",
				children: "Case list unavailable."
			}),
			!isPending && !error && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-5 text-center text-xs text-muted-foreground",
				children: "No cases in your permitted branches."
			})
		] })]
	});
}
function Vp9DashboardOverdueBanner() {
	const { data, error } = useVp9Dashboard();
	if (error || !data || data.overdue_cases <= 0) return null;
	const oldest = data.oldest_overdue_case;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold",
					children: [
						number(data.overdue_cases),
						" overdue case",
						data.overdue_cases === 1 ? "" : "s"
					]
				}),
				oldest ? ` — oldest is ${oldest.case_no} (${oldest.days_overdue} day${oldest.days_overdue === 1 ? "" : "s"} overdue)` : "",
				"."
			]
		})]
	});
}
/** Existing authorized snapshot. Counts have different units and windows, so no stacked pipeline or trend is implied. */
function VpWorkloadGraphic() {
	const { data, isPending, error } = useVp9Dashboard();
	const values = [
		{
			label: "Overdue cases",
			value: data?.overdue_cases,
			description: "Open cases past due"
		},
		{
			label: "Pending QC rounds",
			value: data?.pending_qc,
			description: "Awaiting a QC decision"
		},
		{
			label: "Scheduled visits today",
			value: data?.field_visits_today,
			description: "Excludes cancelled visits"
		},
		{
			label: "Reports due in 7 days",
			value: data?.reports_due_this_week,
			description: "Unreleased cases"
		}
	];
	const valid = values.every((r) => typeof r.value === "number" && Number.isFinite(r.value) && r.value >= 0);
	const max = Math.max(1, ...values.map((r) => typeof r.value === "number" && Number.isFinite(r.value) ? r.value : 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Work requiring attention"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Current authorized snapshot · Independent counts, not a pipeline total"
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "space-y-2",
		"aria-busy": isPending,
		children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			children: "Loading workload…"
		}) : error || !valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "text-sm text-destructive",
			children: "Workload counts unavailable."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: values.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex flex-wrap items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "tabular-nums",
						children: number(r.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vp-graphic-track",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "vp-graphic-fill",
						style: { width: `${100 * (r.value ?? 0) / max}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: r.description
				})
			] }, r.label))
		})
	})] });
}
function Dashboard() {
	const { tenant, branch, tenantBranches, can, branchLabel } = useApp();
	const canViewAnalytics = can("analytics.View");
	const canAdminister = can("tenant.admin");
	const canViewCases = can("cases.View");
	const canOpenField = can("field.View") || can("field.Assign") || can("field.Check In/Out");
	const canOpenQc = can("qc.View");
	const canOpenBilling = can("billing.View");
	const canOpenReports = can("signoff.View") || can("signoff.Generate");
	const selectedBranch = branch === "all" ? null : tenantBranches.find((b) => b.id === branch);
	const branchName = branch === "all" ? branchLabel : selectedBranch?.name ?? "Selected Branch";
	const description = `Workspace overview for ${tenant.name} · ${branchName}`;
	if (tenant.role === "Field Officer" && canOpenField) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldOfficerHome, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Agency overview",
		description,
		children: canViewCases && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/cases",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" }), "Open cases"]
			})
		})
	}), !canViewAnalytics ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-6 border-border shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-5" }), "Welcome to your workspace"]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "You can open the modules permitted to your role. Live dashboard statistics are available only when Analytics → View is enabled in your Role Matrix."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						canViewCases && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/cases",
								children: "Cases"
							})
						}),
						canOpenField && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/field-operations",
								search: { view: "visits" },
								children: "Field Operations"
							})
						}),
						canOpenQc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/qc-checking",
								children: "QC & Checking"
							})
						}),
						canOpenReports && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/reports",
								children: "Reports"
							})
						}),
						canOpenBilling && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/billing-mis",
								children: "Billing & MIS"
							})
						}),
						canAdminister && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/users",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 size-4" }), "Users"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/roles-permissions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 size-4" }), "Role Matrix"]
							})
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Access is determined by your assigned role. If a required module is missing, contact your tenant administrator."
				})
			]
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vp-dashboard-layout",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vp9DashboardOverdueBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vp9DashboardCards, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vp-dashboard-grid mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vp9DashboardRecentCases, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpWorkloadGraphic, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vp9DashboardBranchPerformance, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vp9DashboardActivity, {})
					]
				})]
			})
		]
	})] });
}
/** A proper mobile landing page for the Field Officer, rather than analytics-denied desktop widgets. */
function FieldOfficerHome() {
	const { tenant, currentUserName } = useApp();
	const visitsQuery = useVpFieldVisits();
	const self = useQuery({
		queryKey: ["vp-field-self", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_field_my_user_id");
			if (error) throw error;
			if (data == null) throw new Error("No assigned field officer identity");
			return String(data);
		},
		retry: false
	});
	const myVisits = (visitsQuery.data ?? []).filter((v) => v.status !== "Cancelled" && self.data === String(v.assigned_user_id));
	const next = myVisits.find((v) => v.status === "On site") ?? myVisits.find((v) => v.status === "Scheduled") ?? myVisits[0];
	const scheduled = myVisits.filter((v) => v.status === "Scheduled").length;
	const active = myVisits.filter((v) => v.status === "On site").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-primary-foreground/75",
						children: "Field Officer workspace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-2xl font-bold",
						children: "My Field Visits"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-primary-foreground/80",
						children: [
							"Welcome, ",
							currentUserName,
							". Manage your assigned cases from your phone."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-white/10 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold",
									children: myVisits.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-primary-foreground/80",
									children: "Assigned"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-white/10 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold",
									children: scheduled
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-primary-foreground/80",
									children: "Scheduled"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-white/10 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold",
									children: active
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-primary-foreground/80",
									children: "On site"
								})]
							})
						]
					})
				]
			}),
			(visitsQuery.error || self.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-xl border border-destructive p-3 text-sm text-destructive",
				role: "alert",
				children: ["Could not load assigned visit details: ", String(visitsQuery.error?.message ?? self.error?.message)]
			}),
			(visitsQuery.isLoading || self.isLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				role: "status",
				children: "Loading assigned visits…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "min-h-14 rounded-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/field-operations",
						search: { view: "visits" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-2 size-4" }), "My Visits"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "min-h-14 rounded-xl",
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/field-operations",
						search: { view: "reports" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "mr-2 size-4" }), "My Reports"]
					})
				})]
			}),
			next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-5" }), "Next assigned visit"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Case #", next.num] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-muted px-3 py-1 text-xs font-semibold",
								children: next.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: new Date(next.scheduled_at).toLocaleString("en-IN", {
								dateStyle: "medium",
								timeStyle: "short"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mb-1 size-4" }),
									"GPS ",
									next.checkin_at ? "recorded" : "pending"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mb-1 size-4" }),
									next.photo_count,
									" real photos"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "min-h-12 w-full rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/field-inspections/$visitId",
								params: { visitId: String(next.id) },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "mr-2 size-4" }),
									"Continue Report",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-4" })
								]
							})
						})
					]
				})]
			}) : !visitsQuery.isLoading && !self.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "mx-auto mb-2 size-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "No assigned visits"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "QC will assign your first case."
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "GPS check-in, original site photos and report submissions are protected actions and remain separate from voice entry."
			})
		]
	}) });
}
//#endregion
export { Dashboard as component };
