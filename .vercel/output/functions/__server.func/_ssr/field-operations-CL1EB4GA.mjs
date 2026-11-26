import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as LogIn, D as Plus, L as MapPin, Mt as CalendarDays, Nt as CalendarClock, St as CircleCheck, T as Receipt, _t as ClipboardList, b as Route, jt as Camera, ot as FilePenLine, vt as ClipboardCheck, wt as ChevronRight, z as LogOut } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, E as cn, S as SelectItem, b as Select, c as Dialog, d as DialogFooter, f as DialogHeader, i as CardContent, l as DialogContent, n as Button, p as DialogTitle, r as Card, t as AppShell, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { o as VpFin04D2Field, r as VpFin04CClaim, t as VpFin04BJourney } from "./vp-fin04b-journeys-CGkmckj8.mjs";
import { r as StatCard } from "./ops-ui-CJPu_Wj9.mjs";
import { i as spokenNumber, n as VoiceMic, r as VoiceOption, t as VoiceLanguage } from "./vp-voice-BmdpI54j.mjs";
import { a as useVpFieldVisits, i as useVpFieldPhotos, n as openFieldPhoto, o as useVpVisitCosts, r as uploadFieldPhoto, t as getDevicePosition } from "./vp-field-CDqchrKK.mjs";
import { t as Route$1 } from "./field-operations-BZXLCsMr.mjs";
import { n as ProgressIndicator, t as Progress$1 } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/field-operations-CL1EB4GA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Back-end RLS still enforces the authoritative permission. This only shapes visible UI. */
function scopedMobileVisits(visits, cases, ownUserId, canAssign, branch) {
	const caseMap = new Map(cases.map((item) => [item.caseNum, item]));
	return visits.filter((visit) => {
		if (visit.status === "Cancelled") return false;
		const isMine = Boolean(ownUserId) && String(visit.assigned_user_id) === ownUserId;
		if (!canAssign && !isMine) return false;
		if (canAssign && branch !== "all") {
			const caseRow = caseMap.get(visit.num);
			if (!caseRow || caseRow.branchId !== branch) return false;
		}
		return true;
	}).map((v) => ({
		v,
		c: caseMap.get(v.num)
	}));
}
function filterMobileVisits(visits, filter) {
	switch (filter) {
		case "scheduled": return visits.filter((row) => row.v.status === "Scheduled");
		case "onsite": return visits.filter((row) => row.v.status === "On site");
		case "completed": return visits.filter((row) => row.v.status === "Completed");
		default: return [...visits];
	}
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress$1, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressIndicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Progress$1.displayName;
var localDate = () => {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
var err = (e) => e instanceof Error ? e.message : String(e);
var formatTime = (s) => new Date(s).toLocaleString("en-IN", {
	dateStyle: "medium",
	timeStyle: "short"
});
var localDateTimeInput = (iso) => {
	const d = new Date(iso);
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
function FieldPage() {
	const { tenant, branch, tenantUsers, can } = useApp();
	const { view: mobileView } = Route$1.useSearch();
	const [visitFilter, setVisitFilter] = (0, import_react.useState)("all");
	const client = useQueryClient();
	const { allCases, isLoading: casesLoading, error: caseError } = useVpCases();
	const { data: visits = [], isLoading: visitsLoading, error: visitError } = useVpFieldVisits();
	const { data: myUserId, isLoading: identityLoading, error: identityError } = useQuery({
		queryKey: ["vp-field-self", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_field_my_user_id");
			if (error) throw error;
			return String(data);
		}
	});
	const { data: canAssign = false } = useQuery({
		queryKey: [
			"vp-field-assign-perm",
			tenant.id,
			tenant.role,
			can("field.Assign")
		],
		queryFn: async () => {
			return can("field.Assign");
		}
	});
	const [schedule, setSchedule] = (0, import_react.useState)(null);
	const [details, setDetails] = (0, import_react.useState)(null);
	const [selfSchedule, setSelfSchedule] = (0, import_react.useState)(null);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const caseMap = (0, import_react.useMemo)(() => new Map(allCases.map((c) => [c.caseNum, c])), [allCases]);
	const rows = visits.map((v) => ({
		v,
		c: caseMap.get(v.num)
	})).filter((x) => x.c && (branch === "all" || x.c.branchId === branch));
	const activeRows = rows.filter((x) => x.v.status !== "Cancelled");
	const mobileRows = scopedMobileVisits(visits, allCases, myUserId, canAssign, branch);
	const filteredMobileRows = mobileView === "reports" ? mobileRows : filterMobileVisits(mobileRows, visitFilter);
	const mobileCounts = {
		scheduled: mobileRows.filter((x) => x.v.status === "Scheduled").length,
		onsite: mobileRows.filter((x) => x.v.status === "On site").length,
		completed: mobileRows.filter((x) => x.v.status === "Completed").length
	};
	const checkinCount = activeRows.filter((x) => x.v.checkin_at !== null).length;
	const shortfall = activeRows.filter((x) => x.v.status === "On site" && x.v.photo_count < x.v.min_photos).length;
	const reload = async () => {
		await Promise.all([client.invalidateQueries({ queryKey: ["vp-field-visits", tenant.id] }), client.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] })]);
	};
	async function runGps(v, kind) {
		setBusyId(v.id);
		try {
			const p = await getDevicePosition();
			const { error } = await vpDb.rpc(kind === "checkin" ? "vp_field_checkin" : "vp_field_checkout", {
				p_visit_id: v.id,
				p_lat: p.lat,
				p_lng: p.lng,
				p_accuracy_m: p.accuracy
			});
			if (error) throw error;
			await reload();
			toast.success(`${kind === "checkin" ? "Checked in" : "Visit completed"} — GPS recorded (±${Math.round(p.accuracy)} m)`);
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusyId(null);
		}
	}
	async function cancel(v) {
		if (!window.confirm("Cancel this scheduled visit?")) return;
		setBusyId(v.id);
		try {
			const { error } = await vpDb.rpc("vp_field_cancel", { p_visit_id: v.id });
			if (error) throw error;
			await reload();
			toast.success("Visit cancelled");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusyId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04BJourney, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04CClaim, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpFin04D2Field, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden md:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Field Operations",
					description: "Site inspections, GPS attendance records and photo evidence.",
					children: canAssign && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setSchedule({
							visit: null,
							caseNum: null
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Schedule visit"]
					})
				}),
				(visitError || caseError) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "mb-4 rounded-md border border-destructive p-3 text-sm text-destructive",
					children: ["Could not load field data: ", err(visitError ?? caseError)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Scheduled visits",
							value: activeRows.filter((x) => x.v.status === "Scheduled").length,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Checked in",
							value: checkinCount,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Completed visits",
							value: activeRows.filter((x) => x.v.status === "Completed").length,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Photo shortfall",
							value: shortfall,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs text-muted-foreground",
					children: "GPS coordinates, device-reported accuracy and time are recorded for attendance audit. No distance or GPS accuracy threshold blocks check-in; GPS alone does not independently prove physical presence."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-4 md:hidden",
			"aria-label": "Mobile field officer workspace",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-[.18em] text-primary-foreground/70",
							children: "Field workspace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold",
								children: mobileView === "reports" ? "My Reports" : canAssign ? "Field Visits" : "My Field Visits"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-primary-foreground/80",
								children: [
									mobileRows.length,
									" active assigned visit",
									mobileRows.length === 1 ? "" : "s"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-white/15 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-6" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-white/10 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xl font-bold",
										children: mobileCounts.scheduled
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-primary-foreground/75",
										children: "Scheduled"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-white/10 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xl font-bold",
										children: mobileCounts.onsite
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-primary-foreground/75",
										children: "On site"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-white/10 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xl font-bold",
										children: mobileCounts.completed
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-primary-foreground/75",
										children: "Completed"
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/field-operations",
						search: { view: "visits" },
						className: `flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${mobileView === "visits" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4" }), "Visits"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/field-operations",
						search: { view: "reports" },
						className: `flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold ${mobileView === "reports" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "size-4" }), "Reports"]
					})]
				}),
				mobileView === "visits" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					"aria-label": "Filter visits by status",
					children: [
						["all", "All"],
						["scheduled", "Scheduled"],
						["onsite", "On site"],
						["completed", "Completed"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": visitFilter === id,
						onClick: () => setVisitFilter(id),
						className: `min-h-10 shrink-0 rounded-full border px-4 text-xs font-semibold ${visitFilter === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`,
						children: label
					}, id))
				}),
				canAssign && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "min-h-12 w-full",
					onClick: () => setSchedule({
						visit: null,
						caseNum: null
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Schedule / Assign visit"]
				}),
				visitError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "rounded-xl border border-destructive p-3 text-sm text-destructive",
					children: ["Could not load assigned visits: ", err(visitError)]
				}),
				caseError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border p-3 text-xs text-muted-foreground",
					children: "Some case details could not load. Assigned visit actions remain available subject to permission checks."
				}),
				(visitsLoading || identityLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "rounded-xl border bg-card p-5 text-sm text-muted-foreground",
					children: "Loading assigned visits…"
				}),
				identityError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "rounded-xl border border-destructive p-3 text-sm text-destructive",
					children: ["Field Officer identity could not be loaded: ", err(identityError)]
				}),
				filteredMobileRows.map(({ v, c }) => {
					const own = myUserId != null && String(v.assigned_user_id) === String(myUserId);
					const officer = tenantUsers.find((u) => u.id === v.assigned_user_id)?.name ?? "Assigned officer";
					const photoTarget = Math.max(1, v.min_photos);
					const photoPercent = Math.min(100, 100 * v.photo_count / photoTarget);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "vp-native-case-card overflow-hidden rounded-2xl border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
												children: [
													c?.caseNo ?? `Case #${v.num}`,
													" · Visit #",
													v.id
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "mt-1 break-words font-display text-base font-bold leading-snug",
												children: c?.property ?? "Assigned property visit"
											}),
											c?.customer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 truncate text-xs text-muted-foreground",
												children: c.customer
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: v.status === "Completed" ? "secondary" : "outline",
										className: "shrink-0 rounded-full px-2.5 py-1 text-[11px]",
										children: v.status === "On site" ? "On site" : v.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/60 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mb-1 flex items-center gap-1 text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-3" }), " Visit schedule"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold leading-5",
											children: formatTime(v.scheduled_at)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/60 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mb-1 flex items-center gap-1 text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }), " GPS check-in"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold leading-5",
											children: v.checkin_at ? "Recorded" : "Not checked in"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1.5 flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }), " Actual photographs"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										v.photo_count,
										" / ",
										photoTarget
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									className: "h-2",
									value: photoPercent
								})] }),
								canAssign && !own && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Officer: ", officer]
								}),
								mobileView === "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Complete the Excel-aligned inspection, verify real evidence and submit when permitted. Submission state is checked inside the report." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "min-h-12 w-full rounded-xl text-sm font-semibold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/field-inspections/$visitId",
										params: { visitId: String(v.id) },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "mr-2 size-4" }),
											mobileView === "reports" ? "Open Full Report" : "Prepare / Continue Report",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-4" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [
										own && v.status === "Scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "min-h-12 rounded-xl",
											onClick: () => setSelfSchedule(v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "mr-1 size-4" }), "Schedule"]
										}),
										own && v.status === "Scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "min-h-12 rounded-xl",
											disabled: busyId === v.id,
											onClick: () => void runGps(v, "checkin"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-1 size-4" }), "GPS check-in"]
										}),
										own && v.status === "On site" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "min-h-12 rounded-xl",
											disabled: busyId === v.id,
											onClick: () => void runGps(v, "checkout"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-1 size-4" }), "GPS check-out"]
										}),
										v.status !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "min-h-12 rounded-xl",
											onClick: () => setDetails(v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1 size-4" }), "Photos / Costs"]
										}),
										canAssign && v.status === "Scheduled" && !own && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "min-h-12 rounded-xl",
											onClick: () => setSchedule({
												visit: v,
												caseNum: v.num
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "mr-1 size-4" }), "Reassign"]
										})
									]
								})
							]
						})
					}, v.id);
				}),
				!visitsLoading && !identityLoading && !identityError && !visitError && filteredMobileRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed bg-card p-7 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "mx-auto mb-3 size-8 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: mobileView === "reports" ? "No reports available" : "No visits in this view"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: canAssign ? "Schedule or assign a case to begin." : "Assigned cases will appear here once QC schedules a visit."
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "hidden md:block border-border shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Time" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Case / Property" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Officer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "GPS attendance" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reported accuracy" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-44",
						children: "Photos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
					rows.map(({ v, c }) => {
						const officer = tenantUsers.find((u) => u.id === v.assigned_user_id)?.name ?? "Assigned officer";
						const checked = v.status === "Completed" || v.status === "On site";
						const accuracy = v.checkout_accuracy_m ?? v.checkin_accuracy_m;
						const canOperate = myUserId != null && String(myUserId) === String(v.assigned_user_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "whitespace-nowrap text-xs",
								children: formatTime(v.scheduled_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/cases/$caseId",
								params: { caseId: String(c.caseNum) },
								className: "font-mono text-xs text-muted-foreground hover:underline",
								children: c.caseNo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: c.property
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: officer }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: checked ? "GPS recorded" : "Awaiting check-in"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: accuracy === null ? "—" : `±${Math.round(accuracy)} m` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: Math.min(100, 100 * v.photo_count / v.min_photos),
									className: "h-2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs",
									children: [
										v.photo_count,
										"/",
										v.min_photos
									]
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: v.status === "Completed" ? "secondary" : "outline",
								children: v.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "whitespace-nowrap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1",
									children: [
										v.status === "Scheduled" && canOperate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											disabled: busyId === v.id,
											onClick: () => void runGps(v, "checkin"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-3.5" }), "Check in"]
										}),
										v.status === "On site" && canOperate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											disabled: busyId === v.id,
											onClick: () => void runGps(v, "checkout"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), "Check out"]
										}),
										canOperate && v.status === "Scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setSelfSchedule(v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-3.5" }), " Schedule my visit"]
										}),
										canAssign && v.status === "Scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setSchedule({
												visit: v,
												caseNum: v.num
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-3.5" }), " Reschedule"]
										}),
										v.status !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setDetails(v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }), " Details"]
										}),
										v.status !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/field-inspections/$visitId",
												params: { visitId: String(v.id) },
												children: "Valuation Report (Excel 1–9)"
											})
										}),
										canAssign && v.status === "Scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											disabled: busyId === v.id,
											onClick: () => void cancel(v),
											children: "Cancel"
										})
									]
								})
							})
						] }, v.id);
					}),
					(visitsLoading || casesLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 8,
						className: "py-10 text-center text-muted-foreground",
						children: "Loading field visits…"
					}) }),
					!visitsLoading && !casesLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: 8,
						className: "py-10 text-center text-muted-foreground",
						children: ["No site visits. ", canAssign ? "Use Schedule visit to assign a real case." : "Your administrator can schedule a visit."]
					}) })
				] })] })
			})
		}),
		schedule && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleDialog, {
			data: schedule,
			cases: allCases,
			onClose: () => setSchedule(null),
			onSaved: async () => {
				await reload();
				setSchedule(null);
			}
		}, `${schedule.visit?.id ?? "new"}-${schedule.caseNum ?? "none"}`),
		details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitDetails, {
			visit: visits.find((v) => v.id === details.id) ?? details,
			onClose: () => setDetails(null),
			canOperate: myUserId != null && String(myUserId) === String(details.assigned_user_id),
			onChanged: reload
		}, details.id),
		selfSchedule && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelfScheduleDialog, {
			visit: selfSchedule,
			onClose: () => setSelfSchedule(null),
			onSaved: async () => {
				await reload();
				setSelfSchedule(null);
			}
		}, selfSchedule.id)
	] });
}
function SelfScheduleDialog({ visit, onClose, onSaved }) {
	const [scheduled, setScheduled] = (0, import_react.useState)(localDateTimeInput(visit.scheduled_at));
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		const when = new Date(scheduled);
		if (Number.isNaN(when.getTime())) {
			toast.error("Select a valid visit date/time");
			return;
		}
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_p9_field_self_reschedule", {
				p_visit_id: visit.id,
				p_scheduled_at: when.toISOString()
			});
			if (error) throw error;
			await onSaved();
			toast.success("Visit rescheduled; original assignment unchanged");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[calc(100vw-1.5rem)] max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Schedule my site visit" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Update the visit time for your assigned case. Only QC/dispatch can change the assigned officer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "p9-self-date",
					children: "Date and time"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "p9-self-date",
					type: "datetime-local",
					className: "min-h-11",
					value: scheduled,
					onChange: (e) => setScheduled(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => void save(),
					children: busy ? "Saving…" : "Save schedule"
				})] })
			]
		})
	});
}
function ScheduleDialog({ data, cases, onClose, onSaved }) {
	const { tenantUsers } = useApp();
	const v = data.visit;
	const [caseNum, setCaseNum] = (0, import_react.useState)(data.caseNum ? String(data.caseNum) : "");
	const [officer, setOfficer] = (0, import_react.useState)(v?.assigned_user_id ?? "");
	const [scheduled, setScheduled] = (0, import_react.useState)(v ? localDateTimeInput(v.scheduled_at) : "");
	const [minPhotos, setMinPhotos] = (0, import_react.useState)(v ? String(v.min_photos) : "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [voiceLang, setVoiceLang] = (0, import_react.useState)("en-IN");
	async function submit() {
		if (!caseNum || !officer || !scheduled || !minPhotos) {
			toast.error("Case, officer, schedule and minimum photos are required");
			return;
		}
		setSaving(true);
		try {
			const when = new Date(scheduled);
			if (Number.isNaN(when.getTime())) throw new Error("Invalid schedule date and time");
			const { error } = await vpDb.rpc("vp_field_schedule", {
				p_visit_id: v?.id ?? null,
				p_case_num: Number(caseNum),
				p_assigned_user_id: officer,
				p_scheduled_at: when.toISOString(),
				p_min_photos: Number(minPhotos),
				p_target_lat: v?.target_lat ?? null,
				p_target_lng: v?.target_lng ?? null,
				p_radius_m: v?.radius_m ?? null,
				p_max_accuracy_m: v?.max_accuracy_m ?? null
			});
			if (error) throw error;
			await onSaved();
			toast.success(v ? "Visit rescheduled" : "Visit scheduled");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: v ? "Reschedule visit" : "Schedule site visit" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLanguage, {
					value: voiceLang,
					onChange: setVoiceLang
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Case" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: caseNum,
								onValueChange: setCaseNum,
								disabled: !!v,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select case" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cases.filter((c) => ![
									"Approved",
									"Submitted",
									"Invoiced",
									"Delivered"
								].includes(c.stage)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: String(c.caseNum),
									children: [
										c.caseNo,
										" · ",
										c.customer
									]
								}, c.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
								label: "Case",
								lang: voiceLang,
								options: cases.map((c) => c.caseNo),
								onSelect: (name) => {
									const chosen = cases.find((c) => c.caseNo === name);
									if (chosen && !v) setCaseNum(String(chosen.caseNum));
								},
								disabled: !!v
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assigned field officer" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: officer,
								onValueChange: setOfficer,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select active user" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tenantUsers.filter((u) => u.status === "Active").map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: u.id,
									children: [
										u.name,
										" · ",
										u.role
									]
								}, u.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
								label: "Assigned field officer",
								lang: voiceLang,
								options: tenantUsers.filter((u) => u.status === "Active").map((u) => u.name),
								onSelect: (name) => {
									const chosen = tenantUsers.find((u) => u.name === name);
									if (chosen) setOfficer(chosen.id);
								}
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "visit-time",
							children: "Scheduled date and time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "visit-time",
								type: "datetime-local",
								value: scheduled,
								onChange: (e) => setScheduled(e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
								lang: voiceLang,
								label: "Schedule date and time",
								onTranscript: (v) => {
									const d = new Date(v);
									if (Number.isNaN(d.getTime())) toast.error("Could not parse date/time; use picker");
									else setScheduled(localDateTimeInput(d.toISOString()));
								}
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "min-photo",
							children: "Required site photographs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "min-photo",
								type: "number",
								min: "1",
								max: "100",
								placeholder: "Set by agency SOP",
								value: minPhotos,
								onChange: (e) => setMinPhotos(e.target.value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
								lang: voiceLang,
								label: "Minimum photographs",
								onTranscript: (spoken) => {
									const n = spokenNumber(spoken);
									if (n) setMinPhotos(n);
									else toast.error("Enter number manually");
								}
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "GPS coordinates and reported accuracy are captured automatically at check-in and check-out. No geofence is configured or enforced."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: saving,
					onClick: () => void submit(),
					children: saving ? "Saving…" : "Save visit"
				})] })
			]
		})
	});
}
function VisitDetails({ visit, onClose, canOperate, onChanged }) {
	const { tenant } = useApp();
	const client = useQueryClient();
	const { data: photos = [], isLoading: photoLoading, error: photoError } = useVpFieldPhotos(visit.id);
	const { data: costs, error: costError } = useVpVisitCosts(visit.id);
	const { data: inspectionAccess } = useQuery({
		queryKey: [
			"vp-p0-inspection-access",
			tenant.id,
			visit.id
		],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_p0_inspection_access", { p_visit_id: visit.id });
			if (error) throw error;
			return data;
		},
		retry: false
	});
	const photoEditable = canOperate && inspectionAccess?.can_capture === true;
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [date, setDate] = (0, import_react.useState)(localDate());
	const [visitVoiceLang, setVisitVoiceLang] = (0, import_react.useState)("en-IN");
	const [photoCategory, setPhotoCategory] = (0, import_react.useState)("Road");
	const [km, setKm] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Petrol");
	const [amount, setAmount] = (0, import_react.useState)("");
	const canWrite = canOperate && (visit.status === "On site" || visit.status === "Completed");
	const invalidate = async () => {
		await Promise.all([client.invalidateQueries({ queryKey: [
			"vp-field-photos",
			tenant.id,
			visit.id
		] }), client.invalidateQueries({ queryKey: [
			"vp-field-costs",
			tenant.id,
			visit.id
		] })]);
		await onChanged();
	};
	async function upload(files) {
		if (!files?.length || !photoEditable) return;
		setBusy(true);
		try {
			for (const f of Array.from(files)) {
				const safe = photoCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-");
				const tagged = new File([f], `${safe}__${f.name}`, {
					type: f.type,
					lastModified: f.lastModified
				});
				await uploadFieldPhoto(tenant.id, visit, tagged);
			}
			await invalidate();
			toast.success(`${files.length} actual photograph(s) registered`);
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	async function addExpense() {
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_field_add_expense", {
				p_visit_id: visit.id,
				p_day: date,
				p_category: category,
				p_amount: Number(amount)
			});
			if (error) throw error;
			await invalidate();
			setAmount("");
			toast.success("Expense recorded");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	async function addTravel() {
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_field_record_travel", {
				p_visit_id: visit.id,
				p_day: date,
				p_km: Number(km)
			});
			if (error) throw error;
			await invalidate();
			setKm("");
			toast.success("Travel recorded in the existing daily trip total");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
					"Site visit #",
					visit.id,
					" · Field evidence & expenses"
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/field-inspections/$visitId",
						params: { visitId: visit.id },
						children: "Open full site inspection form"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLanguage, {
					value: visitVoiceLang,
					onChange: setVisitVoiceLang
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 rounded-md border p-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: visit.status })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["GPS attendance: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: visit.checkin_at ? "Recorded" : "Awaiting check-in" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Check-in: ", visit.checkin_at ? formatTime(visit.checkin_at) : "—"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Check-out: ", visit.checkout_at ? formatTime(visit.checkout_at) : "—"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1 inline size-4" }),
										" Site photographs (",
										photos.length,
										"/",
										visit.min_photos,
										")"
									]
								}),
								photoError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-destructive",
									children: err(photoError)
								}),
								photoLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading evidence…" }) : photos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "No photographs uploaded yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-36 space-y-1 overflow-y-auto",
									children: photos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "block w-full truncate rounded border px-2 py-1 text-left hover:bg-muted",
										onClick: () => void openFieldPhoto(p.storage_path).catch((e) => toast.error(err(e))),
										children: [
											p.name,
											" · ",
											Math.round(p.size / 1024),
											" KB"
										]
									}, p.id))
								}),
								photoEditable && visit.status === "On site" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Photograph category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: photoCategory,
											onValueChange: setPhotoCategory,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
												"Road",
												"Address",
												"Front elevation",
												"Side elevation",
												"Internal 1",
												"Internal 2",
												"Kitchen",
												"Bills verified",
												"Selfie customer",
												"Dishaank",
												"Compass",
												"Other"
											].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: x,
												children: x
											}, x)) })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
											label: "Photo category",
											options: [
												"Road",
												"Address",
												"Front elevation",
												"Side elevation",
												"Internal 1",
												"Internal 2",
												"Kitchen",
												"Bills verified",
												"Selfie customer",
												"Dishaank",
												"Compass",
												"Other"
											],
											lang: visitVoiceLang,
											onSelect: setPhotoCategory
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "evidence-photo",
										children: "Upload actual site photographs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "evidence-photo",
										type: "file",
										multiple: true,
										accept: "image/jpeg,image/png,image/webp",
										disabled: busy,
										onChange: (e) => {
											upload(e.target.files);
											e.target.value = "";
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "JPEG, PNG or WebP; max 10 MB each. Files are private and tied to this visit."
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 border-t pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "mr-1 inline size-4" }), " Travel"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: costs?.travel ? `${costs.travel.km} km on ${costs.travel.day} (already added to daily trips)` : "No travel reported."
								}),
								canWrite && !costs?.travel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											className: "w-36",
											value: date,
											max: localDate(),
											onChange: (e) => setDate(e.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
											lang: visitVoiceLang,
											label: "Travel / expense date",
											onTranscript: (spoken) => {
												const d = new Date(spoken);
												if (Number.isNaN(d.getTime())) toast.error("Cannot parse date; use picker");
												else setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											className: "w-28",
											placeholder: "Kilometres",
											min: "0.1",
											step: "0.1",
											value: km,
											onChange: (e) => setKm(e.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
											lang: visitVoiceLang,
											label: "Travel kilometres",
											onTranscript: (spoken) => {
												const n = spokenNumber(spoken);
												if (n !== null) setKm(n);
												else toast.error("Enter kilometres manually");
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											disabled: busy || Number(km) <= 0,
											onClick: () => void addTravel(),
											children: "Add km"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 border-t pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1 inline size-4" }), " Expenses"]
								}),
								costError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-destructive",
									children: err(costError)
								}),
								costs?.expenses.length ? costs.expenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										e.day,
										" · ",
										e.cat
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["₹", e.amt.toFixed(2)] })]
								}, e.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "No expenses recorded."
								}),
								canWrite && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: category,
											onValueChange: setCategory,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
												"Petrol",
												"Food",
												"Toll",
												"Parking",
												"Other"
											].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: x,
												children: x
											}, x)) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
											label: "Expense category",
											lang: visitVoiceLang,
											options: [
												"Petrol",
												"Food",
												"Toll",
												"Parking",
												"Other"
											],
											onSelect: setCategory
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												placeholder: "Amount ₹",
												min: "0.01",
												step: "0.01",
												value: amount,
												onChange: (e) => setAmount(e.target.value)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
												lang: visitVoiceLang,
												label: "Expense amount",
												onTranscript: (spoken) => {
													const n = spokenNumber(spoken);
													if (n !== null) setAmount(n);
													else toast.error("Enter amount manually");
												}
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "sm:col-span-2",
											disabled: busy || Number(amount) <= 0,
											onClick: () => void addExpense(),
											children: "Add expense"
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Close"
				}) })
			]
		})
	});
}
//#endregion
export { FieldPage as component };
