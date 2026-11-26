import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as Printer, V as Lock, c as Upload, f as ShieldCheck, ot as FilePenLine } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, E as cn, S as SelectItem, b as Select, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { a as useVpBanks, s as useVpCases } from "./vp-cases-DcoVfkM7.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { t as fmtINR } from "./data-BZzdNe14.mjs";
import { a as releaseVpReport, d as useVpReportVersions, h as viewVpReportPdf, i as recordVpValuer, l as useVpReportFormats, m as useVpValuerCredentials, n as attachVpReportPdf, o as reviewVpValuer, p as useVpValuationVersions, r as prepareVpReport, s as saveVpBankFormat, u as useVpReportPermissions } from "./vp-reports-CNYb7FPD.mjs";
import { t as Textarea } from "./textarea-BAeo4PcW.mjs";
import { t as EmptyRow } from "./ops-ui-CJPu_Wj9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-Bhf1cerM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REPORT_STAGES = [
	"Report Draft",
	"Final QC",
	"Approved",
	"Delivered"
];
var PRODUCT_TYPES = [
	"House",
	"Flat",
	"Land",
	"Commercial"
];
function errorText(e) {
	return e instanceof Error ? e.message : String(e);
}
function ReportsPage() {
	const { tenant, tenantUsers, can } = useApp();
	const queryClient = useQueryClient();
	const cases = useVpCases();
	const banksQuery = useVpBanks();
	const formats = useVpReportFormats();
	const credentials = useVpValuerCredentials();
	const reportQuery = useVpReportVersions();
	const permsQuery = useVpReportPermissions();
	const self = useQuery({
		queryKey: ["vp-my-report-identity", tenant.id],
		queryFn: async () => {
			const { data, error } = await vpDb.rpc("vp_my_context");
			if (error) throw error;
			return data;
		}
	});
	const list = (0, import_react.useMemo)(() => cases.cases.filter((c) => REPORT_STAGES.includes(c.stage)), [cases.cases]);
	const [selId, setSelId] = (0, import_react.useState)(null);
	const sel = list.find((c) => c.id === selId) ?? list[0];
	const caseVersions = useVpValuationVersions(sel?.caseNum ?? 0);
	const reports = (0, import_react.useMemo)(() => (reportQuery.data ?? []).filter((r) => r.num === sel?.caseNum), [reportQuery.data, sel?.caseNum]);
	const currentReport = reports.find((r) => r.status === "Released") ?? reports[0];
	const calculation = currentReport?.calculations_snapshot ?? caseVersions.data?.[0]?.calculations;
	const perms = permsQuery.data;
	const myCredential = credentials.data?.find((c) => c.user_id === self.data?.user_id);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [bank, setBank] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("House");
	const [formatName, setFormatName] = (0, import_react.useState)("");
	const [formatNotes, setFormatNotes] = (0, import_react.useState)("");
	const [userId, setUserId] = (0, import_react.useState)("");
	const [regNo, setRegNo] = (0, import_react.useState)("");
	const [expires, setExpires] = (0, import_react.useState)("");
	const [reviewNote, setReviewNote] = (0, import_react.useState)("");
	const banks = (0, import_react.useMemo)(() => (banksQuery.data ?? []).map((b) => b.name).sort(), [banksQuery.data]);
	const bankForSetup = bank || banks[0] || "";
	const selectedFormat = formats.data?.find((f) => f.bank_name === sel?.bank && f.property_type === sel?.propertyType && f.active);
	const isReleased = currentReport?.status === "Released";
	const loadError = cases.error ?? banksQuery.error ?? formats.error ?? credentials.error ?? reportQuery.error ?? permsQuery.error;
	async function refresh() {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["vp-report-versions", tenant.id] }),
			queryClient.invalidateQueries({ queryKey: ["vp-valuer-credentials", tenant.id] }),
			queryClient.invalidateQueries({ queryKey: ["vp-report-formats", tenant.id] }),
			queryClient.invalidateQueries({ queryKey: ["vp-live-cases", tenant.id] })
		]);
	}
	async function action(fn, msg) {
		setBusy(true);
		try {
			await fn();
			await refresh();
			toast.success(msg);
		} catch (e) {
			toast.error(errorText(e));
		} finally {
			setBusy(false);
		}
	}
	async function handleUpload(file) {
		if (!file || !currentReport || currentReport.status !== "Draft") return;
		await action(() => attachVpReportPdf(tenant.id, currentReport, file), "Private report PDF uploaded and registered");
	}
	async function saveFormat() {
		if (!bankForSetup || !formatName.trim()) {
			toast.error("Select a bank and enter a format reference");
			return;
		}
		await action(() => saveVpBankFormat(bankForSetup, category, formatName, formatNotes), "Bank report format reference saved");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Reports & Sign-off",
				description: "Prepare only QC-approved valuation versions; release an actual bank-format PDF through authorized valuer attestation."
			}),
			loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 rounded-md border border-destructive/30 p-2 text-sm text-destructive",
				children: ["Database error: ", errorText(loadError)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[320px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-1.5 p-2",
						children: [
							(cases.isLoading || reportQuery.isLoading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-3 text-sm text-muted-foreground",
								children: "Loading reports…"
							}),
							!cases.isLoading && list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyRow, { text: "No reports in progress." }),
							list.map((c) => {
								const rpt = (reportQuery.data ?? []).find((r) => r.num === c.caseNum);
								const fmt = formats.data?.find((f) => f.bank_name === c.bank && f.property_type === c.propertyType);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelId(c.id),
									className: cn("w-full rounded-md border px-3 py-2 text-left", sel?.id === c.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs",
												children: c.caseNo
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: c.stage === "Delivered" ? "secondary" : "outline",
												className: "text-[10px]",
												children: c.stage
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-medium",
											children: c.property
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-xs text-muted-foreground",
											children: rpt?.format_name ?? fmt?.format_name ?? "Bank format not configured"
										})
									]
								}, c.id);
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: sel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex-row items-center justify-between space-y-0 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Valuation certificate preview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !isReleased,
								onClick: () => window.print(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-card p-6 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 flex justify-between border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg font-bold",
										children: tenant.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Format reference: ", currentReport?.format_name ?? selectedFormat?.format_name ?? "Not configured"]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono",
											children: sel.caseNo
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["To: ", sel.bank] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "grid grid-cols-2 gap-x-6 gap-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Property",
											v: sel.property
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Type",
											v: sel.propertyType
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Location",
											v: sel.city
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Assigned to",
											v: sel.assignedTo
										})
									]
								}),
								calculation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Val, {
											label: "Fair Market Value",
											v: calculation.marketValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Val, {
											label: "Realizable Value",
											v: calculation.realizableValue
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Val, {
											label: "Distress Value",
											v: calculation.distressValue
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm text-muted-foreground",
									children: "No submitted valuation amounts. Open the case dossier to enter and submit actual property data."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 border-t border-border pt-3 text-xs",
									children: isReleased ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium text-success",
										children: [
											"Released ",
											currentReport?.released_at,
											" · registration ",
											currentReport?.released_reg_no,
											" (internal attestation, NOT a cryptographic signature)"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: [
											"Preview only · ",
											sel.stage === "Approved" ? "Final QC approved, report release pending" : "Awaiting Final QC approval",
											" · Not a signed certificate"
										]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "This screen is a generic internal preview. A true bank-specific deliverable must be uploaded separately as a PDF."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Report preparation & release"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: sel.stage
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											children: ["Valuation v", caseVersions.data?.[0]?.version_no ?? "—"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											children: ["Report v", currentReport?.version_no ?? "—"]
										})
									]
								}),
								sel.stage === "Report Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Open ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/cases/$caseId",
										params: { caseId: sel.id },
										className: "underline",
										children: "the case dossier"
									}),
									" to save and submit the valuation; then send it to Final QC from the QC screen."
								] }),
								!selectedFormat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-warning-foreground",
									children: "An administrator must configure a real bank/property report format reference."
								}),
								sel.stage === "Approved" && perms?.prepare && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									disabled: busy || !selectedFormat || !caseVersions.data?.length,
									onClick: () => void action(() => prepareVpReport(sel.caseNum), "Versioned report prepared"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "size-4" }), "Prepare report version"]
								}),
								currentReport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 rounded-md border p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-medium",
											children: [
												"Report v",
												currentReport.version_no,
												" · ",
												currentReport.status
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Based on valuation v",
												currentReport.valuation_version_no,
												" and ",
												currentReport.format_name
											]
										}),
										currentReport.status === "Draft" && perms?.prepare && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "inline-flex cursor-pointer items-center gap-2 text-sm underline",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
												"Upload completed bank-format PDF (max 20 MB)",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "application/pdf,.pdf",
													className: "sr-only",
													disabled: busy,
													onChange: (e) => {
														const f = e.target.files?.[0];
														e.target.value = "";
														handleUpload(f);
													}
												})
											]
										}),
										currentReport.file_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => void viewVpReportPdf(currentReport.file_path).catch((e) => toast.error(errorText(e))),
											children: "View uploaded PDF"
										}),
										currentReport.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											disabled: busy || !perms?.release || !currentReport.file_path || !myCredential || myCredential.review_status !== "Checked" || myCredential.expires_on < (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA"),
											onClick: () => void action(() => releaseVpReport(currentReport.id), "Report released with internal registered-valuer attestation"),
											children: [perms?.release ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), " Release approved report"]
										}),
										currentReport.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Release requires signoff.Release in your role, your personally checked/unexpired registration, an independent Final QC reviewer and the uploaded PDF."
										})
									]
								}),
								myCredential && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Your recorded registration: ",
										myCredential.reg_no,
										" · ",
										myCredential.review_status,
										" · expires ",
										myCredential.expires_on
									]
								}),
								!myCredential && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No registration recorded for this signed-in user. Administrator configuration is required before release."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 inline size-3" }), "No electronic/digital signature is generated by this phase. Release is an internal workflow attestation only."]
								})
							]
						})]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyRow, { text: "No eligible cases for report preparation." }) })
				})]
			}),
			(perms?.manage || can("signoff.Manage Templates")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-3 border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Report administration"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-6 lg:grid-cols-2",
					children: [perms?.manage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium",
								children: "Bank-specific format reference"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Registers the approved format name only. Does not automatically generate a bank's official PDF template."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bankForSetup,
									onValueChange: setBank,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a bank" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: banks.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: x,
										children: x
									}, x)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: category,
									onValueChange: setCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRODUCT_TYPES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: x,
										children: x
									}, x)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Approved format reference" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formatName,
									onChange: (e) => setFormatName(e.target.value),
									placeholder: "Enter actual client-approved format name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Instructions (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: formatNotes,
									onChange: (e) => setFormatNotes(e.target.value),
									maxLength: 2e3
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || !bankForSetup || formatName.trim().length < 3,
								onClick: () => void saveFormat(),
								children: "Save format reference"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-40 space-y-1 overflow-auto text-xs",
								children: (formats.data ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									f.bank_name,
									" · ",
									f.property_type,
									" · ",
									f.format_name
								] }, `${f.bank_name}/${f.property_type}`))
							})
						]
					}), tenant.adminAccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium",
								children: "Valuer registration and internal review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Enter documentary registration details. A DIFFERENT administrator must review the evidence. This is not an automated IBBI registry check."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Agency user" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: userId,
									onValueChange: setUserId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a valuer" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tenantUsers.filter((u) => u.status === "Active").map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: u.id,
										children: [
											u.name,
											" (",
											u.email,
											")"
										]
									}, u.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Registration number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: regNo,
									onChange: (e) => setRegNo(e.target.value),
									placeholder: "As per supporting evidence"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expiry date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: expires,
									onChange: (e) => setExpires(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy || !userId || regNo.trim().length < 5 || !expires,
								onClick: () => void action(() => recordVpValuer(userId, regNo, expires), "Valuer registration recorded for separate review"),
								children: "Record / update registration"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Evidence checked — reviewer note (8+ characters)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: reviewNote,
									onChange: (e) => setReviewNote(e.target.value),
									placeholder: "Record the evidence verified outside this application"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-48 space-y-2 overflow-auto text-xs",
								children: (credentials.data ?? []).map((cr) => {
									const u = tenantUsers.find((x) => x.id === cr.user_id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded border p-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-medium",
												children: [
													u?.name ?? cr.user_id,
													" · ",
													cr.reg_no,
													" · ",
													cr.review_status
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Expires ", cr.expires_on] }),
											cr.review_status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													disabled: busy || reviewNote.trim().length < 8,
													onClick: () => void action(() => reviewVpValuer(cr.user_id, true, reviewNote), "Credential review recorded"),
													children: "Mark evidence checked"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													disabled: busy || reviewNote.trim().length < 8,
													onClick: () => void action(() => reviewVpValuer(cr.user_id, false, reviewNote), "Credential rejected"),
													children: "Reject"
												})]
											})
										]
									}, cr.user_id);
								})
							})
						]
					})]
				})]
			})
		]
	}), sel && isReleased && currentReport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden print:block space-y-2 p-8 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Released valuation summary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				sel.caseNo,
				" · ",
				sel.bank,
				" · ",
				currentReport.format_name
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: sel.property }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Market value ", fmtINR(currentReport.calculations_snapshot.marketValue)] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Realizable ",
				fmtINR(currentReport.calculations_snapshot.realizableValue),
				" · Distress ",
				fmtINR(currentReport.calculations_snapshot.distressValue)
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Released ",
				currentReport.released_at,
				" · Registration ",
				currentReport.released_reg_no,
				". Internal attestation, not a digital signature. Refer to uploaded PDF for the bank-format report."
			] })
		]
	})] });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-muted-foreground",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-medium",
		children: v
	})] });
}
function Val({ label, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-muted p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg font-bold",
			children: fmtINR(v)
		})]
	});
}
//#endregion
export { ReportsPage as component };
