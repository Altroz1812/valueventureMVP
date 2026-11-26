import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { St as CircleCheck, f as ShieldCheck, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, E as cn, S as SelectItem, b as Select, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { t as Textarea } from "./textarea-BAeo4PcW.mjs";
import { n as P18_KEY } from "./vp-p18-api-Dp6x_NGS.mjs";
import { t as Checkbox } from "./checkbox-BI658bIE.mjs";
import { i as TatBadge, n as PriorityBadge, r as StatCard, t as EmptyRow } from "./ops-ui-CJPu_Wj9.mjs";
import { n as VoiceMic, r as VoiceOption, t as VoiceLanguage } from "./vp-voice-BmdpI54j.mjs";
import { t as P22_KEY } from "./vp-p22-sketch-CLt13-It.mjs";
import { c as inspectionSections, i as inspectionPhotoCategoryFromName, l as missingInspectionFields, o as inspectionRequiredPhotoSlots, r as VpP22Sketch, t as VpP18QcSummary } from "./vp-p18-supplement-u-OvQj-n.mjs";
import { i as useVpFieldPhotos, n as openFieldPhoto } from "./vp-field-CDqchrKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/qc-checking-RYLhQ0d-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VpInspectionQcSummary({ caseNum, propertyType }) {
	const { tenant } = useApp();
	const query = useQuery({
		queryKey: [
			"vp-inspection-qc",
			tenant.id,
			caseNum
		],
		enabled: caseNum > 0,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_inspection_for_case", { p_case_num: caseNum });
			if (error) throw error;
			return data ?? {};
		},
		staleTime: 0
	});
	const report = query.data?.report ?? query.data;
	const fields = report?.data ?? {};
	const visitId = query.data?.visit_id != null ? String(query.data.visit_id) : void 0;
	const photos = useVpFieldPhotos(visitId);
	const requiredCategories = inspectionRequiredPhotoSlots(propertyType);
	const uploadedCategories = new Set((photos.data ?? []).map((p) => inspectionPhotoCategoryFromName(p.name)).filter(Boolean));
	const missingCategories = requiredCategories.filter((c) => !uploadedCategories.has(c));
	const missingFields = missingInspectionFields(fields);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-sm",
		children: "Site Inspection — Read-only QC Reference"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3 text-sm",
		children: [
			query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Loading site inspection..." }),
			query.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive",
				children: ["Inspection error: ", query.error.message]
			}),
			!query.isLoading && !query.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [
					"Status: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: report?.status ?? "Not started" }),
					" · This report does not replace QC decision or sign-off."
				]
			}),
			report?.status !== "Submitted" && !query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-destructive",
				children: "Inspection is not submitted; Field QC approval is blocked by the P0 server guard."
			}),
			missingFields.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-amber-700",
				children: ["Missing mandatory fields: ", missingFields.join(", ")]
			}),
			photos.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-destructive",
				children: ["Evidence access error: ", photos.error.message]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded border p-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: [
							"Actual registered evidence: ",
							photos.data?.length ?? 0,
							" photo(s)"
						]
					}),
					missingCategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-amber-700",
						children: ["Missing required categories: ", missingCategories.join(", ")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: (photos.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void openFieldPhoto(p.storage_path).catch((e) => toast.error(String(e))),
							children: inspectionPhotoCategoryFromName(p.name) ?? p.name.slice(0, 25)
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Private evidence links expire. The backend independently checks required categories and configured minimum; this screen does not certify geotags."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP18QcSummary, { raw: fields[P18_KEY] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpP22Sketch, {
				raw: fields[P22_KEY],
				disabled: true
			}),
			inspectionSections.map((section) => {
				const entries = section.fields.filter((f) => String(fields[f.key] ?? "").trim().length > 0);
				if (!entries.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-2 font-semibold",
						children: section.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "grid gap-2 sm:grid-cols-2",
						children: entries.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: f.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "whitespace-pre-wrap break-words",
							children: fields[f.key]
						})] }, f.key))
					})]
				}, section.id);
			})
		]
	})] });
}
var QC_STAGES = [
	"Initiation QC",
	"Field QC",
	"Final QC"
];
var QC_CHECKLIST = {
	"Initiation QC": ["Land extent matches title documents"],
	"Field QC": [
		"Four boundaries verified on site",
		"Minimum 8 registered photos attached",
		"GPS check-in and check-out recorded"
	],
	"Final QC": [
		"Guideline (SRO) rate vs market rate justified",
		"Comparable sales evidence (min. 2)",
		"Building age & depreciation applied",
		"IBBI registration valid for signing valuer"
	]
};
var QC_DEFECTS = [
	"Measurement mismatch",
	"Insufficient photos",
	"Boundary discrepancy",
	"Rate not justified",
	"Document missing",
	"GPS evidence missing or invalid"
];
function requiredChecks(stage, propertyType) {
	const all = [...QC_CHECKLIST[stage]];
	return stage === "Final QC" && propertyType === "Land" ? all.filter((x) => x !== "Building age & depreciation applied") : all;
}
function useVpQcTasks() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-qc-tasks", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_qc_list_tasks");
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 5e3
	});
}
function useVpQcPermissions() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: [
			"vp-qc-permissions",
			tenant.id,
			tenant.role
		],
		queryFn: async () => {
			const results = await Promise.all([
				"View",
				"Edit",
				"Approve",
				"Return"
			].map(async (action) => {
				const { data, error } = await vpDb.rpc("vp_qc_can", { p_action: action });
				if (error) throw error;
				return Boolean(data);
			}));
			const { data: editCase, error: editError } = await vpDb.rpc("vp_can_case_action", { p_action: "Edit" });
			if (editError) throw editError;
			return {
				view: results[0],
				edit: results[1],
				approve: results[2],
				returnCase: results[3],
				submit: Boolean(editCase) || results[1]
			};
		},
		staleTime: 15e3
	});
}
function useVpQcEligibleCheckers(enabled) {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-qc-eligible-checkers", tenant.id],
		enabled,
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_qc_eligible_checkers");
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 15e3
	});
}
function useVpQcEvents() {
	const { tenant } = useApp();
	return useQuery({
		queryKey: ["vp-qc-events", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.from("vp_qc_events").select("id,task_id,event_type,actor_user_id,remarks,occurred_at").eq("org_id", tenant.id).order("occurred_at", { ascending: false }).limit(500);
			if (error) throw error;
			return (data ?? []).map((x) => ({
				...x,
				id: String(x.id),
				task_id: String(x.task_id),
				actor_user_id: x.actor_user_id === null ? null : String(x.actor_user_id)
			}));
		},
		staleTime: 5e3
	});
}
function QcPage() {
	const { tenant, branch } = useApp();
	const client = useQueryClient();
	const casesQuery = useVpCases();
	const tasksQuery = useVpQcTasks();
	const permsQuery = useVpQcPermissions();
	const eventsQuery = useVpQcEvents();
	const perms = permsQuery.data;
	const eligibleQuery = useVpQcEligibleCheckers(Boolean(perms?.edit));
	const eligible = eligibleQuery.data ?? [];
	const [selectedTaskId, setSelectedTaskId] = (0, import_react.useState)(null);
	const [checks, setChecks] = (0, import_react.useState)({});
	const [defect, setDefect] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [voiceLang, setVoiceLang] = (0, import_react.useState)("en-IN");
	const [submitCaseId, setSubmitCaseId] = (0, import_react.useState)("");
	const casesByNum = (0, import_react.useMemo)(() => new Map(casesQuery.allCases.map((c) => [c.caseNum, c])), [casesQuery.allCases]);
	const tasks = tasksQuery.data ?? [];
	const queue = (0, import_react.useMemo)(() => tasks.filter((t) => {
		const c = casesByNum.get(t.num);
		return t.status === "Pending" && c && (branch === "all" || c.branchId === branch);
	}), [
		tasks,
		casesByNum,
		branch
	]);
	const selTask = queue.find((t) => t.id === selectedTaskId) ?? queue[0];
	const sel = selTask ? casesByNum.get(selTask.num) : void 0;
	const required = selTask && sel ? requiredChecks(selTask.review_stage, sel.propertyType) : [];
	const done = required.filter((x) => checks[x]).length;
	const currentId = useSelfUserId(tenant.id);
	const canCurrentDecide = Boolean(selTask && currentId.data && selTask.assigned_checker_id === currentId.data);
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
	const returnedToday = tasks.filter((t) => t.status === "Returned" && t.decided_at && new Date(t.decided_at).toLocaleDateString("en-CA") === today).length;
	const submitCandidates = casesQuery.cases.filter((c) => c.stage === "Initiation" || c.stage === "Report Draft");
	const selectedSubmit = submitCandidates.find((c) => c.id === submitCaseId);
	const pendingError = casesQuery.error ?? tasksQuery.error ?? permsQuery.error;
	(0, import_react.useEffect)(() => {
		setChecks({});
		setDefect("");
		setNote("");
	}, [selTask?.id]);
	async function refresh() {
		await Promise.all([
			client.invalidateQueries({ queryKey: ["vp-qc-tasks", tenant.id] }),
			client.invalidateQueries({ queryKey: ["vp-qc-events", tenant.id] }),
			client.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] })
		]);
	}
	async function decide(decision) {
		if (!selTask) return;
		if (!canCurrentDecide) {
			toast.error("Only the assigned checker can decide");
			return;
		}
		if (decision === "Approved" && done !== required.length) {
			toast.error(`Complete all ${required.length} applicable checklist items`);
			return;
		}
		if (decision === "Returned" && (!defect || note.trim().length < 5)) {
			toast.error("Choose a defect and enter at least 5 characters of remarks");
			return;
		}
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_qc_decide", {
				p_task_id: selTask.id,
				p_decision: decision,
				p_checklist: checks,
				p_defect: decision === "Returned" ? defect : null,
				p_remarks: note.trim() || null
			});
			if (error) throw error;
			await refresh();
			toast.success(`${sel?.caseNo ?? "Case"} ${decision === "Approved" ? "approved and advanced" : "returned for correction"}`);
			setSelectedTaskId(null);
			setChecks({});
			setDefect("");
			setNote("");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	async function assign(checkerId) {
		if (!selTask || !perms?.edit) return;
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_qc_assign", {
				p_task_id: selTask.id,
				p_checker_user_id: checkerId === "unassigned" ? null : checkerId
			});
			if (error) throw error;
			await refresh();
			toast.success(checkerId === "unassigned" ? "Checker unassigned" : "Checker assigned");
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	async function submit() {
		if (!selectedSubmit || !perms?.submit) return;
		const stage = selectedSubmit.stage === "Initiation" ? "Initiation QC" : "Final QC";
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_qc_submit", {
				p_case_num: selectedSubmit.caseNum,
				p_review_stage: stage
			});
			if (error) throw error;
			setSubmitCaseId("");
			await refresh();
			toast.success(`${selectedSubmit.caseNo} submitted for ${stage}`);
		} catch (e) {
			toast.error(err(e));
		} finally {
			setBusy(false);
		}
	}
	const caseTaskHistory = tasks.filter((t) => sel && t.num === sel.caseNum && t.status !== "Pending");
	const taskEvents = eventsQuery.data?.filter((e) => selTask && e.task_id === selTask.id) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "QC & Checking",
			description: "Review cases waiting in Initiation, Field and Final QC. Approve to move forward or return with a defect."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceLanguage, {
				value: voiceLang,
				onChange: setVoiceLang
			})
		}),
		(pendingError || eventsQuery.error || eligibleQuery.error) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-destructive",
			children: ["Database error: ", err(pendingError ?? eventsQuery.error ?? eligibleQuery.error)]
		}),
		perms?.submit && submitCandidates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-end gap-2 rounded-md border p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-60 flex-1 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Send case to QC" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: submitCaseId,
							onValueChange: setSubmitCaseId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select case ready for QC" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: submitCandidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: c.id,
								children: [
									c.caseNo,
									" · ",
									c.stage
								]
							}, c.id)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
							label: "Send case to QC",
							lang: voiceLang,
							options: submitCandidates.map((c) => c.caseNo),
							onSelect: (name) => {
								const chosen = submitCandidates.find((c) => c.caseNo === name);
								if (chosen) setSubmitCaseId(chosen.id);
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void submit(),
					disabled: !selectedSubmit || busy,
					children: "Submit for QC"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-full text-xs text-muted-foreground",
					children: "Final QC requires a submitted valuation form; this is configured in Phase 5."
				})
			]
		}),
		perms?.edit && !eligibleQuery.isLoading && eligible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-warning/40 bg-warning/5 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "No eligible QC checker is available"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Check Users & Permissions: the user must be linked to Auth, email verified, active, and have qc.Approve + qc.Return (or tenant.admin)."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/users",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					children: "Manage users & QC readiness"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 grid grid-cols-2 gap-3 md:grid-cols-4",
			children: [QC_STAGES.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: stage,
				value: queue.filter((t) => t.review_stage === stage).length
			}, stage)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Returned today",
				value: returnedToday
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[360px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base",
						children: [
							"Checker queue (",
							queue.length,
							")"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 p-2",
					children: [
						(casesQuery.isLoading || tasksQuery.isLoading || permsQuery.isLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-3 text-sm text-muted-foreground",
							children: "Loading QC queue…"
						}),
						!tasksQuery.isLoading && queue.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyRow, { text: "No pending QC tasks. Submit an eligible case to QC first." }),
						queue.map((t) => {
							const c = casesByNum.get(t.num);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedTaskId(t.id),
								className: cn("w-full rounded-md border px-3 py-2 text-left transition-colors", selTask?.id === t.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs",
											children: c.caseNo
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: t.review_stage
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 truncate text-sm font-medium",
										children: c.property
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { p: c.priority }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TatBadge, { c })]
									})
								]
							}, t.id);
						})
					]
				})]
			}), sel && selTask ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-lg",
							children: sel.property
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								sel.caseNo,
								" · ",
								sel.bank,
								" · ",
								sel.propertyType,
								" · ",
								sel.feeKnown ? fmtINR(sel.fee) : "Fee not configured",
								" · by ",
								sel.assignedTo
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), selTask.review_stage]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5",
					children: [
						selTask.review_stage === "Field QC" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpInspectionQcSummary, {
							caseNum: sel.caseNum,
							propertyType: sel.propertyType
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assigned checker" }), perms?.edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selTask.assigned_checker_id ?? "unassigned",
								onValueChange: (value) => void assign(value),
								disabled: busy,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose checker" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "unassigned",
										children: "Unassigned"
									}),
									selTask.assigned_checker_id && !eligible.some((u) => u.id === selTask.assigned_checker_id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: selTask.assigned_checker_id,
										children: "Previous checker (now ineligible)"
									}),
									eligible.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: u.id,
										children: [
											u.name,
											" · ",
											u.role
										]
									}, u.id))
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
								label: "Assigned checker",
								lang: voiceLang,
								options: eligible.map((u) => u.name),
								disabled: busy,
								onSelect: (name) => {
									const chosen = eligible.find((u) => u.name === name);
									if (chosen) assign(chosen.id);
								}
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: selTask.assigned_checker_id ? eligible.find((x) => x.id === selTask.assigned_checker_id)?.name ?? "Assigned checker" : "Awaiting checker assignment"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between text-sm font-semibold",
								children: ["QC checklist ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										done,
										"/",
										required.length
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: required.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 rounded-md border border-border p-2.5 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: !!checks[item],
											onCheckedChange: (value) => setChecks((old) => ({
												...old,
												[item]: !!value
											})),
											disabled: !canCurrentDecide || busy,
											className: "mt-0.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1",
											children: item
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
											label: item,
											lang: voiceLang,
											options: ["Yes", "No"],
											disabled: !canCurrentDecide || busy,
											onSelect: (value) => setChecks((old) => ({
												...old,
												[item]: value === "Yes"
											}))
										})
									]
								}, item))
							}),
							selTask.review_stage === "Field QC" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Field QC approval requires a completed visit, the configured photo minimum (at least eight registered photos), and recorded GPS check-in and check-out with reported accuracy. No geofence is enforced; GPS and photo geotags are not independently verified."
							}),
							selTask.review_stage === "Final QC" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Checklist confirmation is a checker attestation, not an IBBI registration verification or an authorized valuation certificate/signature."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-[220px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Defect category (for returns)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: defect,
									onValueChange: setDefect,
									disabled: !canCurrentDecide || busy,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "None" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: QC_DEFECTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: d,
										children: d
									}, d)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceOption, {
									label: "Defect category",
									options: QC_DEFECTS,
									lang: voiceLang,
									disabled: !canCurrentDecide || busy,
									onSelect: setDefect
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Checker remarks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: note,
									onChange: (e) => setNote(e.target.value),
									disabled: !canCurrentDecide || busy,
									placeholder: "Notes for the field officer or back office"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceMic, {
									label: "Checker remarks",
									lang: voiceLang,
									disabled: !canCurrentDecide || busy,
									onTranscript: (spoken) => setNote((old) => old ? `${old} ${spoken}` : spoken)
								})]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								disabled: !canCurrentDecide || !perms?.returnCase || busy,
								onClick: () => void decide("Returned"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Return for correction"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								disabled: !canCurrentDecide || !perms?.approve || busy,
								onClick: () => void decide("Approved"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), " Approve & advance"]
							})]
						}),
						(caseTaskHistory.length > 0 || taskEvents.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-medium",
									children: "QC review history"
								}),
								taskEvents.slice(0, 8).map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
											className: "text-foreground",
											children: [event.event_type, ":"]
										}),
										" ",
										new Date(event.occurred_at).toLocaleString("en-IN"),
										" ",
										event.remarks ?? ""
									]
								}, event.id)),
								caseTaskHistory.slice(0, 6).map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
											className: "text-foreground",
											children: [
												task.review_stage,
												" ",
												task.status,
												":"
											]
										}),
										" ",
										task.defect ?? task.remarks ?? "Decision recorded"
									]
								}, task.id))
							]
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyRow, { text: "Nothing to review in this branch." })
			})]
		})
	] });
}
function err(e) {
	return e instanceof Error ? e.message : String(e);
}
function useSelfUserId(orgId) {
	const { data, isLoading, error } = useSelfUserIdQuery(orgId);
	return {
		data,
		isLoading,
		error
	};
}
function useSelfUserIdQuery(orgId) {
	return useQuery({
		queryKey: ["vp-qc-self", orgId],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_field_my_user_id");
			if (error) throw error;
			return data === null ? null : String(data);
		},
		staleTime: 3e4
	});
}
//#endregion
export { QcPage as component };
