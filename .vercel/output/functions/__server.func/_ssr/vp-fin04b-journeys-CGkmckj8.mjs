import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, o as vpDb } from "./vp-session-C-vOghu2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-fin04b-journeys-CGkmckj8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var obj$2 = (x) => {
	if (!x || typeof x !== "object" || Array.isArray(x)) throw new Error("Invalid response");
	return x;
};
var str$2 = (x) => typeof x === "string" || typeof x === "number" ? String(x) : "";
var id = (x) => /^[1-9]\d{0,18}$/.test(x) ? x : null;
var field$2 = "w-full rounded border bg-background min-h-10 p-2 text-sm";
var btn = "rounded border px-3 py-2 text-sm disabled:opacity-50";
var bucket = "vp-expense-receipts";
async function rpc$2(n, a) {
	const { data, error } = await vpDb.rpc(n, a);
	if (error) throw new Error(error.message);
	return data;
}
var today$2 = () => {
	const p = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return [
		"year",
		"month",
		"day"
	].map((t) => p.find((x) => x.type === t)?.value ?? "").join("-");
};
function VpFin04D2Accounts() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Adjustments, { canCreate: capabilities.includes("billing.Create") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipts, {
		org: tenant.id,
		worker: false,
		canCreate: capabilities.includes("billing.Create"),
		canReview: capabilities.includes("billing.Approve")
	})] }, tenant.id) : null;
}
function VpFin04D2Field() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("field.Check In/Out") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipts, {
		org: tenant.id,
		worker: true,
		canCreate: true,
		canReview: false
	}, tenant.id) : null;
}
function Adjustments({ canCreate }) {
	const [kind, setKind] = (0, import_react.useState)("RecoverAdvance"), [source, setSource] = (0, import_react.useState)(""), [amount, setAmount] = (0, import_react.useState)(""), [day, setDay] = (0, import_react.useState)(today$2), [ref, setRef] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	async function save() {
		setBusy(true);
		setMessage("");
		try {
			const result = await rpc$2("vp_fin04d2_record", {
				p_kind: kind,
				p_source: id(source),
				p_amount: kind === "RecoverAdvance" ? Number(amount) : null,
				p_day: day,
				p_reference: ref,
				p_evidence: evidence
			});
			setMessage("Pending entry #" + str$2(result) + " recorded. Refresh the FIN-04D1 register for independent review. No balance change until posted.");
			setRef("");
			setEvidence("");
			setAmount("");
		} catch (e) {
			setMessage(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	if (!canCreate) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Advance recovery & allocation reversal · FIN-04D2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Record only actual returned advances or documented erroneous allocations. Original records remain intact. Approve in FIN-04D1."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					disabled: busy,
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Transaction", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: field$2,
								value: kind,
								onChange: (e) => {
									setKind(e.target.value);
									setSource("");
									setAmount("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "RecoverAdvance",
									children: "Recover unused advance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ReverseAllocation",
									children: "Reverse full posted allocation"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: [kind === "RecoverAdvance" ? "Posted Advance ID" : "Posted Allocate entry ID", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field$2,
								inputMode: "numeric",
								value: source,
								onChange: (e) => setSource(e.target.value)
							})]
						}),
						kind === "RecoverAdvance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Actual returned amount (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field$2,
								inputMode: "decimal",
								value: amount,
								onChange: (e) => setAmount(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Transaction date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field$2,
								type: "date",
								max: today$2(),
								value: day,
								onChange: (e) => setDay(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Unique transaction reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field$2,
								maxLength: 120,
								value: ref,
								onChange: (e) => setRef(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Evidence reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field$2,
								maxLength: 500,
								value: evidence,
								onChange: (e) => setEvidence(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							type: "button",
							disabled: busy || !id(source) || !day || ref.trim().length < 5 || evidence.trim().length < 5 || kind === "RecoverAdvance" && (!Number.isFinite(Number(amount)) || Number(amount) <= 0),
							onClick: () => {
								if (window.confirm("Record pending adjustment for independent review?")) save();
							},
							children: "Record pending adjustment"
						})
					]
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-xs break-words",
					children: message
				})
			]
		})]
	});
}
async function verifyHeader(file) {
	const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
	if (!(file.type === "application/pdf" ? b.length >= 5 && String.fromCharCode(...b.slice(0, 5)) === "%PDF-" : file.type === "image/jpeg" ? b[0] === 255 && b[1] === 216 && b[2] === 255 : file.type === "image/png" ? [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	].every((v, i) => b[i] === v) : false)) throw new Error("File signature does not match supported MIME type");
}
function Receipts({ org, worker, canCreate, canReview }) {
	const [kind, setKind] = (0, import_react.useState)(worker ? "claim" : "entry"), [target, setTarget] = (0, import_react.useState)(""), [ref, setRef] = (0, import_react.useState)(""), [file, setFile] = (0, import_react.useState)(null), [items, setItems] = (0, import_react.useState)([]), [loaded, setLoaded] = (0, import_react.useState)(false), [reason, setReason] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	const args = () => ({
		p_claim: kind === "claim" ? id(target) : null,
		p_entry: kind === "entry" ? id(target) : null
	});
	async function load() {
		const r = obj$2(await rpc$2("vp_fin04d2_receipt_list", args()));
		if (r["org_id"] !== org || !Array.isArray(r["items"])) throw new Error("Workspace mismatch or invalid list");
		setItems(r["items"].map(obj$2));
		setLoaded(true);
	}
	async function run(f) {
		setBusy(true);
		setMessage("");
		try {
			await f();
		} catch (e) {
			setMessage(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	function reset(t, k) {
		setTarget(t);
		setKind(k);
		setItems([]);
		setLoaded(false);
		setFile(null);
		setRef("");
		setReason("");
		setMessage("");
	}
	const uploadAllowed = canCreate && (worker ? kind === "claim" : kind === "entry");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Expense receipt evidence · FIN-04D2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Save a claim or pending ledger entry first. Use its exact evidence reference. PDF/JPEG/PNG, up to 10 MB; files cannot be overwritten. Verification is separate from financial approval."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					disabled: busy,
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						!worker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: ["Linked record", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: field$2,
								value: kind,
								onChange: (e) => reset("", e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "entry",
									children: "Advance / adjustment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "claim",
									children: "Monthly claim"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs",
							children: [kind === "claim" ? "Saved claim ID" : "Ledger entry ID", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: field$2,
								inputMode: "numeric",
								value: target,
								onChange: (e) => reset(e.target.value, kind)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: btn,
							type: "button",
							disabled: !id(target) || busy,
							onClick: () => void run(load),
							children: "Load evidence"
						}),
						uploadAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: ["Matching evidence reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field$2,
									maxLength: 500,
									value: ref,
									onChange: (e) => setRef(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs",
								children: ["Receipt file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field$2,
									type: "file",
									accept: "application/pdf,image/jpeg,image/png",
									onChange: (e) => setFile(e.target.files?.[0] ?? null)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn,
								type: "button",
								disabled: !loaded || !id(target) || !file || ref.trim().length < 5 || busy,
								onClick: () => void run(async () => {
									if (!file || file.size < 1 || file.size > 10485760) throw new Error("File must be 1 byte to 10 MB");
									await verifyHeader(file);
									const r = obj$2(await rpc$2("vp_fin04d2_receipt_reserve", {
										...args(),
										p_ref: ref,
										p_name: file.name,
										p_mime: file.type,
										p_size: file.size
									}));
									if (r["org_id"] !== org || !str$2(r["id"]) || !str$2(r["path"])) throw new Error("Invalid reservation");
									const up = await vpDb.storage.from(bucket).upload(str$2(r["path"]), file, {
										contentType: file.type,
										upsert: false
									});
									if (up.error) throw new Error("Upload failed; reservation retained: " + up.error.message);
									await rpc$2("vp_fin04d2_receipt_finish", { p_id: r["id"] });
									setFile(null);
									await load();
									setMessage("Receipt uploaded. Awaiting independent verification.");
								}),
								children: "Upload receipt"
							})
						] })
					]
				}),
				loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					canReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Review reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: field$2,
							maxLength: 1e3,
							value: reason,
							disabled: busy,
							onChange: (e) => setReason(e.target.value)
						})]
					}),
					items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "No visible evidence."
					}),
					items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-2 space-y-2 text-xs break-words",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									str$2(r["filename"]),
									" · ",
									str$2(r["status"])
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [str$2(r["evidence_ref"]), r["claim_revision"] !== null ? " · Saved revision " + str$2(r["claim_revision"]) : ""] }),
							r["status"] === "Reserved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn,
								type: "button",
								disabled: busy,
								onClick: () => void run(async () => {
									await rpc$2("vp_fin04d2_receipt_finish", { p_id: r["id"] });
									await load();
									setMessage("Existing uploaded object finalized.");
								}),
								children: "Retry finalization"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: btn,
								type: "button",
								disabled: busy,
								onClick: () => void run(async () => {
									const { data, error } = await vpDb.storage.from(bucket).download(str$2(r["path"]));
									if (error || !data) throw new Error(error?.message ?? "File unavailable");
									const url = URL.createObjectURL(data);
									const a = document.createElement("a");
									a.href = url;
									a.download = str$2(r["filename"]).replace(/[\\/]/g, "_");
									a.click();
									window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
								}),
								children: "Download receipt"
							}),
							canReview && r["status"] === "Uploaded" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: ["Verified", "Rejected"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: btn,
									disabled: busy || reason.trim().length < 5,
									onClick: () => void run(async () => {
										await rpc$2("vp_fin04d2_receipt_decide", {
											p_id: r["id"],
											p_decision: d,
											p_reason: reason
										});
										await load();
										setReason("");
										setMessage("Evidence decision saved.");
									}),
									children: d === "Verified" ? "Verify evidence" : "Reject evidence"
								}, d))
							}),
							str$2(r["reason"]) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: str$2(r["reason"]) })
						]
					}, str$2(r["id"])))
				] }),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-xs break-words",
					children: message
				})
			]
		})]
	});
}
var obj$1 = (v) => {
	if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid claim response");
	return v;
};
var rows$1 = (v) => {
	if (!Array.isArray(v)) throw new Error("Invalid claim list");
	return v.map(obj$1);
};
var str$1 = (v) => typeof v === "string" || typeof v === "number" ? String(v) : "";
var today$1 = () => {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return [
		"year",
		"month",
		"day"
	].map((t) => parts.find((p) => p.type === t)?.value ?? "").join("-");
};
var closed = () => {
	const [y, m] = today$1().split("-").map(Number);
	return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 2, 1)).toISOString().slice(0, 7);
};
var field$1 = "w-full min-h-10 rounded-md border bg-background px-2 py-1.5 text-sm";
var button$1 = "rounded-md border px-3 py-2 text-sm disabled:opacity-50";
var primary$1 = "rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50";
var outstanding = (c) => c["settlement"] && typeof c["settlement"] === "object" ? Number(obj$1(c["settlement"])["outstanding"]) : Number(c["amount"]) - Number(c["paid"]);
var money = (v) => Number(v ?? 0).toLocaleString("en-IN", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
async function rpc$1(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw new Error(error.message);
	return data;
}
function response(v, org) {
	const r = obj$1(v);
	if (r["org_id"] !== org) throw new Error("Workspace mismatch");
	return r;
}
function Breakdown({ c }) {
	const lines = rows$1(obj$1(c["calculation"])["lines"]);
	const approved = c["status"] === "Approved";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded border p-2 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-semibold",
				children: [
					"Claim #",
					str$1(c["id"]),
					" · ",
					str$1(c["status"]),
					" · ₹",
					money(c["amount"]),
					approved ? ` · Settled (cash + advances) ₹${money(c["paid"])} · Balance ₹${money(outstanding(c))}` : " · Not a payable"
				]
			}),
			approved && c["settlement"] !== null && typeof c["settlement"] === "object" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Cash ₹",
				money(obj$1(c["settlement"])["cash_paid"]),
				" · Applied advances ₹",
				money(obj$1(c["settlement"])["advance_applied"]),
				" · Reversed cash ₹",
				money(obj$1(c["settlement"])["reversed"])
			] }),
			approved && c["settlement"] !== null && typeof c["settlement"] === "object" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Approved reduction ₹",
				money(obj$1(c["settlement"])["claim_reduction"]),
				" · Net approved ₹",
				money(obj$1(c["settlement"])["net_approved"])
			] }),
			c["legacy_overlap"] === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-amber-700",
				children: "Legacy overlap: settlement on hold."
			}),
			str$1(c["decision_reason"]) !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Review: ", str$1(c["decision_reason"])] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-1",
				children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								str$1(l["day"]),
								" · ",
								str$1(l["label"]),
								" · ₹",
								money(l["amount"])
							]
						}),
						Number(l["period_ceiling_reduction"] ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Before monthly cap ₹",
							money(l["before_period_ceiling"]),
							" · Capped ₹",
							money(l["period_ceiling_reduction"])
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Quantity ",
							str$1(l["quantity"]),
							" · Rate ",
							str$1(l["rate"]) || "actual",
							" · Policy #",
							str$1(obj$1(l["policy"])["id"])
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "break-words",
							children: ["Evidence reference: ", str$1(l["evidence_ref"]) || "Not required"]
						}),
						l["source"] === "journey" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: rows$1(l["cases"]).map((x) => `${str$1(x["case_no"])} (${str$1(x["bank"])})`).join(", ") })
					]
				}, i))
			}),
			rows$1(c["payments"]).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "break-words",
				children: [
					"Payment #",
					str$1(p["id"]),
					" · ",
					str$1(p["payment_day"]),
					" · ₹",
					money(p["amount"]),
					" · ",
					p["reversed"] === true ? "Reversed" : str$1(p["status"]),
					" · ",
					str$1(p["reference"]),
					" · ",
					str$1(p["evidence_ref"]),
					" ",
					str$1(p["reason"])
				]
			}, str$1(p["id"])))
		]
	});
}
function VpFin04CClaim() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("field.Check In/Out") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Claim, { org: tenant.id }, tenant.id) : null;
}
function Claim({ org }) {
	const [month, setMonth] = (0, import_react.useState)(closed), [loaded, setLoaded] = (0, import_react.useState)(""), [c, setC] = (0, import_react.useState)(null), [branches, setBranches] = (0, import_react.useState)([]), [journeys, setJourneys] = (0, import_react.useState)([]), [branch, setBranch] = (0, import_react.useState)(""), [items, setItems] = (0, import_react.useState)([]), [overlap, setOverlap] = (0, import_react.useState)(false), [day, setDay] = (0, import_react.useState)(""), [rules, setRules] = (0, import_react.useState)([]), [ruleKey, setRuleKey] = (0, import_react.useState)(""), [code, setCode] = (0, import_react.useState)(""), [qty, setQty] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	const resetRules = () => {
		setRules([]);
		setRuleKey("");
		setCode("");
		setQty("");
		setEvidence("");
	};
	async function load() {
		const r = response(await rpc$1("vp_fin04c_month_view", { p_month: month + "-01" }), org);
		const next = r["claim"] === null ? null : obj$1(r["claim"]);
		const bs = rows$1(r["branches"]);
		const js = rows$1(r["journeys"]);
		setC(next);
		setBranches(bs);
		setJourneys(js);
		setBranch(next ? str$1(next["branch_id"]) : str$1(js[0]?.["branch_id"]) || str$1(bs[0]?.["id"]));
		setItems(next ? rows$1(next["items"]) : []);
		setOverlap(r["legacy_overlap"] === true);
		setDay(month + "-01");
		resetRules();
		setLoaded(month);
	}
	async function run(fn) {
		setBusy(true);
		setMessage("");
		try {
			await fn();
		} catch (e) {
			setMessage(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	const editable = loaded === month && (!c || c["status"] === "Draft" || c["status"] === "Returned");
	const chosen = rules.find((x) => str$1(x["code"]) === code);
	const mode = str$1(chosen?.["mode"]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Monthly expense claim · FIN-04C"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Closed months only. All approved daily journeys are included once. Do not re-enter mileage as an expense. One servicing branch per claim."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["Claim month", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "month",
							className: field$1,
							max: closed(),
							value: month,
							disabled: busy,
							onChange: (e) => {
								setMonth(e.target.value);
								setLoaded("");
								setC(null);
								resetRules();
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: button$1,
						disabled: busy || !month,
						onClick: () => void run(load),
						children: "Load / reload"
					})]
				}),
				loaded === month && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					overlap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-amber-700",
						children: "Legacy records exist: claim held until reconciled. Do not delete legacy data."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium",
						children: "Recorded journeys"
					}),
					journeys.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "No recorded journeys."
					}),
					journeys.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs",
						children: [
							str$1(j["day"]),
							" · ",
							str$1(j["km"]),
							" km · ",
							str$1(j["status"]),
							" · ₹",
							money(j["amount"])
						]
					}, str$1(j["id"]))),
					editable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						disabled: busy,
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: ["Servicing branch", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: field$1,
									value: branch,
									onChange: (e) => {
										setBranch(e.target.value);
										resetRules();
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select branch"
									}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: str$1(b["id"]),
										children: str$1(b["name"])
									}, str$1(b["id"])))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium",
								children: "Non-mileage expenses and allowances"
							}),
							items.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded border p-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 break-words",
									children: [
										str$1(x["day"]),
										" · ",
										str$1(x["code"]),
										" · Qty/actual ₹ ",
										str$1(x["quantity"]),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: str$1(x["evidence_ref"]) })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: button$1,
									onClick: () => setItems((old) => old.filter((_, n) => n !== i)),
									children: "Remove"
								})]
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs",
									children: ["Expense / entitlement day", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: field$1,
										value: day,
										min: month + "-01",
										max: new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10),
										onChange: (e) => {
											setDay(e.target.value);
											resetRules();
										}
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: button$1,
									disabled: !branch || !day || day.slice(0, 7) !== month,
									onClick: () => void run(async () => {
										const r = response(await rpc$1("vp_fin04c_rules", {
											p_branch: branch,
											p_day: day
										}), org);
										setRules(rows$1(r["rules"]));
										setRuleKey(branch + day);
										setCode("");
										setQty("");
										setEvidence("");
										if (rows$1(r["rules"]).length === 0) setMessage("No approved non-mileage policy rules for this date.");
									}),
									children: "Load applicable policy"
								})]
							}),
							ruleKey === branch + day && rules.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: ["Expense category", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: field$1,
									value: code,
									onChange: (e) => {
										setCode(e.target.value);
										setQty("");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select category"
									}), rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: str$1(r["code"]),
										children: [
											str$1(r["label"]),
											" · ",
											str$1(r["mode"])
										]
									}, str$1(r["code"])))]
								})]
							}), chosen !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs",
									children: [
										mode === "actual" ? "Enter the actual daily total in INR." : `Fixed entitlement ₹${money(chosen["rate"])}. Monthly allowance: use the last calendar day.`,
										" ",
										chosen["cap"] !== null ? `Line ceiling ₹${money(chosen["cap"])}.` : ""
									]
								}),
								mode === "actual" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs",
									children: ["Actual expense (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: field$1,
										inputMode: "decimal",
										value: qty,
										onChange: (e) => setQty(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs",
									children: ["Evidence reference (not an upload)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: field$1,
										maxLength: 500,
										value: evidence,
										onChange: (e) => setEvidence(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: button$1,
									onClick: () => {
										const q = mode === "actual" ? Number(qty) : 1;
										if (!Number.isFinite(q) || q <= 0) {
											setMessage("Enter a positive amount");
											return;
										}
										if ((mode === "actual" || chosen["evidence_required"] === true) && evidence.trim().length < 5) {
											setMessage("Supporting evidence reference required");
											return;
										}
										if (items.some((x) => x["day"] === day && x["code"] === code)) {
											setMessage("Category already added for date");
											return;
										}
										setItems((old) => [...old, {
											day,
											code,
											quantity: q,
											evidence_ref: evidence
										}]);
										setCode("");
										setQty("");
										setEvidence("");
									},
									children: "Add expense"
								})
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: primary$1,
								disabled: !branch || overlap,
								onClick: () => void run(async () => {
									await rpc$1("vp_fin04c_save", {
										p_month: month + "-01",
										p_branch: branch,
										p_expected: c ? Number(c["revision"]) : 0,
										p_items: items
									});
									await load();
									setMessage("Calculated draft saved. Review the saved amounts.");
								}),
								children: "Calculate and save draft"
							})
						]
					}),
					c !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, { c }), c["status"] === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: button$1,
						disabled: busy || overlap,
						onClick: () => void run(async () => {
							if (!window.confirm("Submit saved draft? Unsaved edits are not included.")) return;
							await rpc$1("vp_fin04c_submit", {
								p_id: c["id"],
								p_expected: c["revision"]
							});
							await load();
							setMessage("Submitted for independent approval.");
						}),
						children: "Submit saved claim"
					})] })
				] }),
				message !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "break-words text-xs",
					children: message
				})
			]
		})]
	});
}
function VpFin04CReview() {
	const { tenant, capabilities } = useApp();
	return capabilities.includes("billing.View") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Review$1, {
		org: tenant.id,
		approve: capabilities.includes("billing.Approve"),
		create: capabilities.includes("billing.Create")
	}, tenant.id) : null;
}
function Review$1({ org, approve, create }) {
	const [month, setMonth] = (0, import_react.useState)(closed), [loaded, setLoaded] = (0, import_react.useState)(""), [items, setItems] = (0, import_react.useState)([]), [offset, setOffset] = (0, import_react.useState)(0), [reason, setReason] = (0, import_react.useState)(""), [payId, setPayId] = (0, import_react.useState)(""), [amount, setAmount] = (0, import_react.useState)(""), [payDay, setPayDay] = (0, import_react.useState)(today$1), [reference, setReference] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	async function load(n) {
		const r = response(await rpc$1("vp_fin04c_queue", {
			p_month: month + "-01",
			p_offset: n
		}), org);
		setItems(rows$1(r["items"]));
		setOffset(n);
		setLoaded(month);
	}
	async function run(fn) {
		setBusy(true);
		setMessage("");
		try {
			await fn();
		} catch (e) {
			setMessage(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Expense claim review & settlements · FIN-04C"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Review underlying evidence independently. This register records external payments; it does not transfer money."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["Month", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "month",
							className: field$1,
							max: closed(),
							value: month,
							disabled: busy,
							onChange: (e) => {
								setMonth(e.target.value);
								setLoaded("");
								setItems([]);
								setPayId("");
								setReason("");
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: button$1,
						disabled: busy,
						onClick: () => void run(() => load(0)),
						children: "Load queue"
					})]
				}),
				loaded === month && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "No submitted claims."
					}),
					approve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Decision reason", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: field$1,
							maxLength: 1e3,
							value: reason,
							disabled: busy,
							onChange: (e) => setReason(e.target.value)
						})]
					}),
					items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded border p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "cursor-pointer text-sm font-medium",
							children: [
								str$1(c["worker_name"]),
								" · ",
								str$1(c["branch_name"]),
								" · ",
								str$1(c["status"]),
								" · ₹",
								money(c["amount"])
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breakdown, { c }),
								approve && c["status"] === "Submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: ["Approved", "Returned"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: button$1,
										disabled: busy || reason.trim().length < 5 || d === "Approved" && c["legacy_overlap"] === true,
										onClick: () => void run(async () => {
											if (!window.confirm("Confirm independent claim review?")) return;
											await rpc$1("vp_fin04c_decide", {
												p_id: c["id"],
												p_expected: c["revision"],
												p_decision: d,
												p_reason: reason
											});
											setReason("");
											await load(offset);
										}),
										children: d
									}, d))
								}),
								create && c["status"] === "Approved" && outstanding(c) > 0 && c["legacy_overlap"] !== true && !rows$1(c["payments"]).some((p) => p["status"] === "Pending") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: button$1,
									disabled: busy,
									onClick: () => {
										setPayId(str$1(c["id"]));
										setAmount(String(outstanding(c)));
										setPayDay(today$1());
										setReference("");
										setEvidence("");
									},
									children: "Record external payment"
								}), payId === str$1(c["id"]) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
									disabled: busy,
									className: "grid gap-2 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs",
											children: ["Amount (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: field$1,
												inputMode: "decimal",
												value: amount,
												onChange: (e) => setAmount(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs",
											children: ["Payment date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: field$1,
												value: payDay,
												max: today$1(),
												onChange: (e) => setPayDay(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs",
											children: ["Unique transaction reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: field$1,
												value: reference,
												onChange: (e) => setReference(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs",
											children: ["Evidence reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: field$1,
												value: evidence,
												onChange: (e) => setEvidence(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: primary$1,
											onClick: () => void run(async () => {
												if (!window.confirm("Record an actual external transfer for independent verification?")) return;
												await rpc$1("vp_fin04c_record_payment", {
													p_id: c["id"],
													p_amount: Number(amount),
													p_day: payDay,
													p_reference: reference,
													p_evidence: evidence
												});
												setPayId("");
												await load(offset);
												setMessage("Payment recorded pending approval.");
											}),
											children: "Save pending payment"
										})
									]
								})] }),
								approve && rows$1(c["payments"]).filter((p) => p["status"] === "Pending").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 text-xs",
									children: [
										"Payment #",
										str$1(p["id"]),
										" ₹",
										money(p["amount"]),
										["Posted", "Rejected"].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: button$1,
											disabled: busy || reason.trim().length < 5 || d === "Posted" && c["legacy_overlap"] === true,
											onClick: () => void run(async () => {
												if (!window.confirm("Confirm payment evidence and decision?")) return;
												await rpc$1("vp_fin04c_payment_decide", {
													p_payment: p["id"],
													p_decision: d,
													p_reason: reason
												});
												setReason("");
												await load(offset);
											}),
											children: d === "Posted" ? "Approve settlement" : "Reject record"
										}, d))
									]
								}, str$1(p["id"])))
							]
						})]
					}, str$1(c["id"]))),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: button$1,
							disabled: busy || offset === 0,
							onClick: () => void run(() => load(Math.max(0, offset - 30))),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: button$1,
							disabled: busy || items.length < 30,
							onClick: () => void run(() => load(offset + 30)),
							children: "Next"
						})]
					})
				] }),
				message !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "text-xs break-words",
					children: message
				})
			]
		})]
	});
}
var obj = (v) => {
	if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Invalid journey response");
	return v;
};
var rows = (v) => {
	if (!Array.isArray(v)) throw new Error("Invalid journey list");
	return v.map(obj);
};
var str = (v) => typeof v === "string" || typeof v === "number" ? String(v) : "";
var today = () => {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date());
	return [
		"year",
		"month",
		"day"
	].map((t) => parts.find((p) => p.type === t)?.value ?? "").join("-");
};
var errorText = (v) => v instanceof Error ? v.message : String(v);
var field = "w-full min-h-10 rounded-md border bg-background px-2 py-1.5 text-sm";
var button = "rounded-md border bg-background px-3 py-2 text-sm font-medium disabled:opacity-50";
var primary = "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50";
async function rpc(name, args) {
	const { data, error } = await vpDb.rpc(name, args);
	if (error) throw new Error(error.message);
	return data;
}
function checkedResponse(v, org) {
	const r = obj(v);
	if (r["org_id"] !== org) throw new Error("Workspace mismatch");
	return r;
}
function point(label, lat, lng) {
	if (Boolean(lat.trim()) !== Boolean(lng.trim())) throw new Error("Provide both endpoint coordinates or leave both blank");
	const a = lat.trim() ? Number(lat) : null, b = lng.trim() ? Number(lng) : null;
	if (a !== null && (!Number.isFinite(a) || Math.abs(a) > 90) || b !== null && (!Number.isFinite(b) || Math.abs(b) > 180)) throw new Error("Invalid coordinates");
	return {
		label,
		lat: a,
		lng: b
	};
}
function numberOrNull(v) {
	if (!v.trim()) return null;
	const n = Number(v);
	if (!Number.isFinite(n)) throw new Error("Invalid distance");
	return n;
}
function Estimate({ j }) {
	const calc = j["calculation"] ? obj(j["calculation"]) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-muted/30 p-2 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				str(j["status"]),
				" · ",
				str(j["km"]),
				" km · ",
				str(j["category"])
			] }),
			calc !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-medium",
				children: [
					"Mileage estimate: ₹",
					str(calc["total"]),
					" · policy ",
					str(j["policy_id"]),
					" (not a payable)"
				]
			}),
			j["legacy_overlap"] === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium text-amber-700",
				children: "Legacy trip/expense overlap — reconciliation required."
			}),
			str(j["decision_reason"]) !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Review: ", str(j["decision_reason"])] })
		]
	});
}
function StopList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-1 text-xs",
		children: items.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded border px-2 py-1",
			children: [
				i + 1,
				". ",
				str(s["case_no"]),
				" · ",
				str(s["bank"]),
				" · ",
				str(s["branch_name"]),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-muted-foreground",
					children: [
						str(s["checkin_at"]),
						" → ",
						str(s["checkout_at"]),
						" · GPS: ",
						str(s["lat"]) || "—",
						", ",
						str(s["lng"]) || "—",
						" (device evidence, not route distance)"
					]
				})
			]
		}, str(s["visit_id"])))
	});
}
function VpFin04BJourney() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("field.Check In/Out")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyForm, { org: tenant.id }, tenant.id);
}
function JourneyForm({ org }) {
	const [day, setDay] = (0, import_react.useState)(today), [loaded, setLoaded] = (0, import_react.useState)(""), [j, setJ] = (0, import_react.useState)(null), [candidates, setCandidates] = (0, import_react.useState)([]), [selected, setSelected] = (0, import_react.useState)([]), [overlap, setOverlap] = (0, import_react.useState)(false);
	const [category, setCategory] = (0, import_react.useState)("BIKE_KM"), [method, setMethod] = (0, import_react.useState)("odometer"), [odoStart, setOdoStart] = (0, import_react.useState)(""), [odoEnd, setOdoEnd] = (0, import_react.useState)(""), [manual, setManual] = (0, import_react.useState)(""), [start, setStart] = (0, import_react.useState)("Office"), [end, setEnd] = (0, import_react.useState)("Office"), [slat, setSlat] = (0, import_react.useState)(""), [slng, setSlng] = (0, import_react.useState)(""), [elat, setElat] = (0, import_react.useState)(""), [elng, setElng] = (0, import_react.useState)(""), [evidence, setEvidence] = (0, import_react.useState)(""), [notes, setNotes] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	async function load() {
		const r = checkedResponse(await rpc("vp_fin04b_day", { p_day: day }), org);
		const next = r["journey"] === null ? null : obj(r["journey"]);
		setJ(next);
		setCandidates(rows(r["candidates"]));
		setOverlap(r["legacy_overlap"] === true);
		setLoaded(day);
		setSelected(next ? rows(next["stops"]).map((s) => str(s["visit_id"])) : []);
		setCategory(next ? str(next["category"]) : "BIKE_KM");
		setMethod(next ? str(next["distance_method"]) : "odometer");
		setOdoStart(next ? str(next["odo_start"]) : "");
		setOdoEnd(next ? str(next["odo_end"]) : "");
		setManual(next && next["distance_method"] === "manual" ? str(next["km"]) : "");
		const a = next ? obj(next["start_point"]) : {}, b = next ? obj(next["end_point"]) : {};
		setStart(str(a["label"]) || "Office");
		setEnd(str(b["label"]) || "Office");
		setSlat(str(a["lat"]));
		setSlng(str(a["lng"]));
		setElat(str(b["lat"]));
		setElng(str(b["lng"]));
		setEvidence(next ? str(next["evidence_ref"]) : "");
		setNotes(next ? str(next["notes"]) : "");
	}
	async function run(fn) {
		setBusy(true);
		setMessage("");
		try {
			await fn();
		} catch (e) {
			setMessage(errorText(e));
		} finally {
			setBusy(false);
		}
	}
	const chosen = candidates.filter((s) => selected.includes(str(s["visit_id"])));
	const branches = [...new Set(chosen.map((s) => str(s["branch_id"])))];
	const editable = loaded === day && (!j || j["status"] === "Draft" || j["status"] === "Returned");
	async function save() {
		if (chosen.length !== selected.length || branches.length !== 1) throw new Error("Select completed visits from one servicing branch");
		await rpc("vp_fin04b_save", {
			p_day: day,
			p_expected: j ? Number(j["revision"]) : 0,
			p_branch: branches[0],
			p_visits: selected,
			p_category: category,
			p_method: method,
			p_start: point(start, slat, slng),
			p_end: point(end, elat, elng),
			p_odo_start: method === "odometer" ? numberOrNull(odoStart) : null,
			p_odo_end: method === "odometer" ? numberOrNull(odoEnd) : null,
			p_manual: method === "manual" ? numberOrNull(manual) : null,
			p_evidence: evidence,
			p_notes: notes
		});
		await load();
		setMessage("Draft saved. Submit the saved version for review.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Daily journey · FIN-04B"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "One journey per day; link completed visits across financiers. Record actual odometer difference or documented manual distance. No geofence or continuous GPS tracking."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "min-w-0 flex-1 text-xs",
						children: ["Journey date (IST)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							type: "date",
							value: day,
							max: today(),
							disabled: busy,
							onChange: (e) => {
								setDay(e.target.value);
								setLoaded("");
								setJ(null);
								setCandidates([]);
								setMessage("");
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: button,
						disabled: busy,
						onClick: () => void run(load),
						children: "Load day / reload"
					})]
				}),
				loaded === day && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					j !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estimate, { j }),
					" ",
					overlap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-xs text-amber-700",
						children: "Existing legacy travel/expenses detected. Draft can be saved but submission/approval is held until reconciled."
					}),
					editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						disabled: busy,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-xs font-semibold",
								children: "Completed visits — select all included stops"
							}),
							candidates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs",
								children: "No completed same-day visits assigned to you."
							}),
							candidates.map((s) => {
								const id = str(s["visit_id"]);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-2 rounded border p-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: selected.includes(id),
										onChange: (e) => setSelected((old) => e.target.checked ? [...old, id] : old.filter((x) => x !== id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										str(s["case_no"]),
										" · ",
										str(s["bank"]),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-muted-foreground",
											children: [
												str(s["branch_name"]),
												" · ",
												str(s["checkin_at"])
											]
										})
									] })]
								}, id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs",
								children: [
									selected.length,
									" stops · ",
									new Set(chosen.map((s) => str(s["bank"]))).size,
									" financiers. ",
									branches.length > 1 ? "Cross-branch journey requires exception review; do not split mileage artificially." : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Vehicle", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: field,
											value: category,
											onChange: (e) => setCategory(e.target.value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "BIKE_KM",
												children: "Bike"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "CAR_KM",
												children: "Car"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Distance method", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: field,
											value: method,
											onChange: (e) => setMethod(e.target.value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "odometer",
												children: "Odometer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "manual",
												children: "Documented manual distance"
											})]
										})]
									}),
									method === "odometer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Start reading (km)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: odoStart,
											onChange: (e) => setOdoStart(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["End reading (km)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: odoEnd,
											onChange: (e) => setOdoEnd(e.target.value)
										})]
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Actual distance (km)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: manual,
											onChange: (e) => setManual(e.target.value)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Start location label", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											maxLength: 80,
											value: start,
											onChange: (e) => setStart(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["End location label", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											maxLength: 80,
											value: end,
											onChange: (e) => setEnd(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Start latitude (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: slat,
											onChange: (e) => setSlat(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["Start longitude (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: slng,
											onChange: (e) => setSlng(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["End latitude (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: elat,
											onChange: (e) => setElat(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs",
										children: ["End longitude (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: field,
											inputMode: "decimal",
											value: elng,
											onChange: (e) => setElng(e.target.value)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Endpoint coordinates are manually recorded; avoid private home coordinates unless needed and authorized."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: ["Evidence reference (odometer record / route log)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: field,
									maxLength: 500,
									value: evidence,
									onChange: (e) => setEvidence(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: field,
									maxLength: 1e3,
									value: notes,
									onChange: (e) => setNotes(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: primary,
								disabled: busy || branches.length !== 1,
								onClick: () => void run(save),
								children: "Save journey draft"
							})
						]
					}) : null,
					j !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold",
							children: "Saved stops (chronological)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopList, { items: rows(j["stops"]) }),
						j["status"] === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: button,
							disabled: busy || overlap,
							onClick: () => void run(async () => {
								if (!window.confirm("Submit the saved draft? Unsaved form changes are not included.")) return;
								await rpc("vp_fin04b_submit", {
									p_id: j["id"],
									p_expected: j["revision"]
								});
								await load();
								setMessage("Submitted for independent review.");
							}),
							children: "Submit saved draft"
						})
					] })
				] }),
				message !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "break-words text-xs",
					children: message
				})
			]
		})]
	});
}
function VpFin04BReview() {
	const { tenant, capabilities } = useApp();
	if (!capabilities.includes("billing.View")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Review, {
		org: tenant.id,
		mayDecide: capabilities.includes("billing.Approve")
	}, tenant.id);
}
function Review({ org, mayDecide }) {
	const [day, setDay] = (0, import_react.useState)(today), [items, setItems] = (0, import_react.useState)([]), [offset, setOffset] = (0, import_react.useState)(0), [loaded, setLoaded] = (0, import_react.useState)(""), [reason, setReason] = (0, import_react.useState)(""), [message, setMessage] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false);
	async function load(n) {
		const r = checkedResponse(await rpc("vp_fin04b_queue", {
			p_day: day,
			p_offset: n
		}), org);
		setItems(rows(r["items"]));
		setOffset(n);
		setLoaded(day);
	}
	async function run(fn) {
		setBusy(true);
		setMessage("");
		try {
			await fn();
		} catch (e) {
			setMessage(errorText(e));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mb-4 rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer p-3 text-sm font-semibold",
			children: "Daily journey review · FIN-04B"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Branch-scoped review. Approved journeys are evidence for later claims, not payments."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["Journey date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							type: "date",
							value: day,
							disabled: busy,
							onChange: (e) => {
								setDay(e.target.value);
								setLoaded("");
								setItems([]);
								setReason("");
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: button,
						disabled: busy,
						onClick: () => void run(() => load(0)),
						children: "Load queue"
					})]
				}),
				loaded === day && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs",
						children: "No submitted journeys in this page."
					}),
					mayDecide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: ["Decision reason (applies to selected action)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: field,
							value: reason,
							maxLength: 1e3,
							disabled: busy,
							onChange: (e) => setReason(e.target.value)
						})]
					}),
					items.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded border p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "cursor-pointer text-sm font-medium",
							children: [
								str(j["worker_name"]),
								" · ",
								str(j["km"]),
								" km · ",
								str(j["status"])
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estimate, { j }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs",
									children: [
										str(obj(j["start_point"])["label"]),
										" → ",
										str(obj(j["end_point"])["label"]),
										" · ",
										str(j["distance_method"]),
										" ",
										j["distance_method"] === "odometer" ? `(${str(j["odo_start"])} → ${str(j["odo_end"])})` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs break-words",
									children: [
										"Evidence reference (not a verified attachment): ",
										str(j["evidence_ref"]),
										" · ",
										str(j["notes"])
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs",
									children: [
										"Recorded start coordinates: ",
										str(obj(j["start_point"])["lat"]) || "—",
										", ",
										str(obj(j["start_point"])["lng"]) || "—",
										" · End: ",
										str(obj(j["end_point"])["lat"]) || "—",
										", ",
										str(obj(j["end_point"])["lng"]) || "—"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopList, { items: rows(j["stops"]) }),
								mayDecide && j["status"] === "Submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: ["Approved", "Returned"].map((decision) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: button,
										disabled: busy || reason.trim().length < 5 || decision === "Approved" && j["legacy_overlap"] === true,
										onClick: () => void run(async () => {
											if (!window.confirm(`${decision}: verify supporting journey evidence before confirming.`)) return;
											await rpc("vp_fin04b_decide", {
												p_id: j["id"],
												p_expected: j["revision"],
												p_decision: decision,
												p_reason: reason
											});
											setReason("");
											await load(offset);
											setMessage("Decision recorded.");
										}),
										children: decision === "Approved" ? "Approve journey" : "Return for correction"
									}, decision))
								})
							]
						})]
					}, str(j["id"]))),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: button,
							disabled: busy || offset === 0,
							onClick: () => void run(() => load(Math.max(0, offset - 50))),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: button,
							disabled: busy || items.length < 50,
							onClick: () => void run(() => load(offset + 50)),
							children: "Next"
						})]
					})
				] }),
				message !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "status",
					className: "break-words text-xs",
					children: message
				})
			]
		})]
	});
}
//#endregion
export { VpFin04D2Accounts as a, VpFin04CReview as i, VpFin04BReview as n, VpFin04D2Field as o, VpFin04CClaim as r, VpFin04BJourney as t };
