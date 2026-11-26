import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Bt as ArrowRight, Dt as Check, Ft as Building2, L as MapPin, R as Mail, S as Rocket, Vt as ArrowLeft, Z as Image, et as Globe, f as ShieldCheck, r as Users, s as UserPlus, y as Save } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, E as cn, S as SelectItem, a as CardDescription, b as Select, i as CardContent, n as Button, o as CardHeader, r as Card, s as CardTitle, t as AppShell, w as SelectValue, x as SelectContent } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { t as Switch } from "./switch-n1RkjKwl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DA-MH55A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	{
		n: 1,
		title: "Agency Legal Profile",
		icon: Building2
	},
	{
		n: 2,
		title: "Primary Agency Branch",
		icon: MapPin
	},
	{
		n: 3,
		title: "Invite Initial Users",
		icon: UserPlus
	},
	{
		n: 4,
		title: "Valuation Workflow",
		icon: Check
	},
	{
		n: 5,
		title: "Integrations",
		icon: Globe
	},
	{
		n: 6,
		title: "Review & Activate",
		icon: Rocket
	}
];
var STEP_TITLES = [
	"Create your agency account",
	"Create primary agency branch",
	"Invite initial users",
	"Configure valuation workflow",
	"Configure integrations",
	"Review and activate"
];
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "text-xs font-medium",
			children: [
				label,
				" ",
				required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-destructive",
					children: "*"
				})
			]
		}), children]
	});
}
function Onboarding() {
	useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [sampleData, setSampleData] = (0, import_react.useState)(true);
	const [qcMandatory, setQcMandatory] = (0, import_react.useState)(true);
	const [signoffCompliance, setSignoffCompliance] = (0, import_react.useState)(true);
	const [invites, setInvites] = (0, import_react.useState)([
		{
			name: "Ravi Kumar",
			email: "ravi@abcvaluers.in",
			role: "Tenant Owner",
			branch: "All branches"
		},
		{
			name: "Suresh Babu",
			email: "suresh@abcvaluers.in",
			role: "Branch Admin",
			branch: "Hyderabad"
		},
		{
			name: "Anil Sharma",
			email: "anil@abcvaluers.in",
			role: "Checker",
			branch: "Hyderabad"
		},
		{
			name: "Mohan Rao",
			email: "mohan@abcvaluers.in",
			role: "Field Officer",
			branch: "Hyderabad"
		}
	]);
	const integrations = [
		{
			name: "Supabase Auth",
			desc: "Secure user logins & invitations",
			status: "Connected",
			detail: "auth.abcvaluers.in"
		},
		{
			name: "SMS / WhatsApp Gateway",
			desc: "Assignment & TAT alerts",
			status: "Not connected",
			detail: "MSG91 · WA Business"
		},
		{
			name: "Email Intake (Gmail)",
			desc: "Convert bank emails into cases",
			status: "Connect",
			detail: "intake@abcvaluers.in"
		},
		{
			name: "GPS Field Tracking",
			desc: "Check-in / check-out GPS audit",
			status: "Connected",
			detail: "Google Maps Platform"
		}
	];
	const statusTone = {
		Connected: "bg-success/15 text-success",
		"Not connected": "bg-muted text-muted-foreground",
		Connect: "bg-accent/25 text-accent-foreground"
	};
	function activate() {
		toast.error("This six-step onboarding workflow is a preview.", { description: "Your initial agency is created securely after Supabase login. Branches, integrations and sample data are not provisioned here yet." });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "mb-3 border-primary/30 bg-primary/5 text-primary",
						children: "Tenant onboarding"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight",
						children: "Set up your valuation agency"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Six short steps. You can save a draft at any point and finish later."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mb-8 grid grid-cols-3 gap-2 sm:grid-cols-6",
				children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setStep(s.n),
					className: cn("w-full rounded-xl border px-2 py-2.5 text-center transition-colors", step === s.n ? "border-primary bg-primary text-primary-foreground" : step > s.n ? "border-success/40 bg-success/10 text-success" : "border-border bg-card text-muted-foreground hover:bg-accent/40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-auto mb-1 flex size-6 items-center justify-center rounded-full border text-[11px] font-bold",
						children: step > s.n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : s.n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[10px] font-semibold leading-tight",
						children: s.title
					})]
				}) }, s.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "font-display text-lg",
					children: [
						"Step ",
						step,
						" · ",
						STEP_TITLES[step - 1]
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: [
					"Legal identity and contact details for the agency.",
					"Every tenant needs at least one active agency branch — this becomes the Head Office.",
					"The owner automatically receives full tenant administration. Invited users only get the branches you select.",
					"Default business rules applied to every new case. Case number example: ABC/HYD/2026/00001.",
					"OAuth credentials are stored securely on the server, never in the browser.",
					"Confirm everything before the workspace goes live."
				][step - 1] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Agency legal name",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "ABC Valuers Private Limited" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Display / trade name",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "ABC Valuers" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Business type",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "pvt",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "prop",
												children: "Proprietorship"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "ptn",
												children: "Partnership"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "llp",
												children: "LLP"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pvt",
												children: "Private Limited"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "pub",
												children: "Public Limited"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "other",
												children: "Other"
											})
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "CIN",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: "U74999TG2019PTC163..." })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "IBBI agency registration",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: "IBBI/CO/2020/..." })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "PAN",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: "AAACA1234F" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "GSTIN",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: "36AAACA1234F1Z5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Registered address",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Plot 42, Road No. 12, Banjara Hills" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "City",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Hyderabad" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "State",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "tg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "tg",
												children: "Telangana"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "ap",
												children: "Andhra Pradesh"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "ka",
												children: "Karnataka"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "mh",
												children: "Maharashtra"
											})
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "PIN code",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "500081" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Contact email",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "contact@abcvaluers.in" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Contact mobile",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "+91 98490 11223" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Currency",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "inr",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "inr",
											children: "INR (₹)"
										}) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Timezone",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "ist",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ist",
											children: "Asia/Kolkata (IST)"
										}) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Agency logo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-10 items-center gap-2 rounded-lg border border-dashed border-input px-3 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4" }), " Upload PNG or SVG"]
									})
								})
							]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Branch name",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Hyderabad Main Office" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Branch code",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "HYD001" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Branch type",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "ho",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "ho",
												children: "Head Office"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "reg",
												children: "Regional"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "loc",
												children: "Local"
											})
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Branch status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "active",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "active",
											children: "Active"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "inactive",
											children: "Inactive"
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full office address",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Plot 42, Road No. 12, Banjara Hills, Hyderabad" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "State",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										defaultValue: "tg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "tg",
											children: "Telangana"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ap",
											children: "Andhra Pradesh"
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "City",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Hyderabad" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "PIN",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "500081" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Branch email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "hyd@abcvaluers.in" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Contact person",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "Ravi Kumar" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Contact mobile",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "+91 98490 11223" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Latitude / Longitude",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: "17.4126, 78.4392",
										placeholder: "Optional map location"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1.5 inline size-3.5" }), "This branch will be created automatically as the tenant's Head Office."]
								})
							]
						}),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								invites.map((inv, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 items-end gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Full name",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: inv.name,
												onChange: (e) => setInvites(invites.map((x, j) => j === i ? {
													...x,
													name: e.target.value
												} : x))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Email address",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: inv.email,
												onChange: (e) => setInvites(invites.map((x, j) => j === i ? {
													...x,
													email: e.target.value
												} : x))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Tenant role",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: inv.role,
												onValueChange: (v) => setInvites(invites.map((x, j) => j === i ? {
													...x,
													role: v
												} : x)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "owner",
														children: "Tenant Owner"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "admin",
														children: "Tenant Admin"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "branch",
														children: "Branch Admin"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "backoffice",
														children: "Back Office"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "checker",
														children: "Checker"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "field",
														children: "Field Officer"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "accounts",
														children: "Accounts"
													})
												] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Branch access",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: inv.branch,
												onValueChange: (v) => setInvites(invites.map((x, j) => j === i ? {
													...x,
													branch: v
												} : x)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All branches"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "hyd",
													children: "Hyderabad"
												})] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "mb-0.5",
											onClick: () => setInvites(invites.filter((_, j) => j !== i)),
											children: "✕"
										})
									]
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setInvites([...invites, {
										name: "",
										email: "",
										role: "Back Office",
										branch: "Hyderabad"
									}]),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), " Add another invite"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground",
									children: "Invitations are sent via Supabase Auth. A person who already has a ValuationPro login can accept this invitation without creating another account — their role here stays separate from other agencies."
								})
							]
						}),
						step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Case numbering format",
										required: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { defaultValue: "{AGENCY}/{BRANCH}/{YYYY}/{SEQ}" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Default case priority",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											defaultValue: "Normal",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "high",
													children: "High"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "normal",
													children: "Normal"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "low",
													children: "Low"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Default TAT rules (days)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											defaultValue: 3
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Default assignment method",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											defaultValue: "round-robin",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "round-robin",
													children: "Round robin"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "manual",
													children: "Branch Admin manual"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "load",
													children: "Least loaded officer"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Revision handling",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											defaultValue: "review",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "review",
												children: "Admin approval to reopen"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "auto",
												children: "Auto-reopen within window"
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Case closure rule",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											defaultValue: "delivery",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "delivery",
												children: "After report delivery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "payment",
												children: "After payment received"
											})] })]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y rounded-xl border border-border",
								children: [
									{
										label: "Initiation QC required",
										desc: "Every case is checked before field assignment",
										on: true
									},
									{
										label: "Field report QC required",
										desc: "Checker reviews every field report",
										on: true
									},
									{
										label: "Report approval required",
										desc: "Sign-off before delivery to the bank",
										on: true
									},
									{
										label: "Allow vendor field officers",
										desc: "External empanelled valuers can be assigned",
										on: true
									},
									{
										label: "Allow internal field officers",
										desc: "Employees can visit properties",
										on: true
									}
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: t.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: t.desc
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { defaultChecked: t.on })]
								}, t.label))
							})]
						}),
						step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: integrations.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 rounded-xl border border-border p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: i.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: i.desc
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3" }),
											" ",
											i.detail
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: cn("border-transparent text-[10px]", statusTone[i.status]),
										children: i.status
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										className: "mt-2 h-7 px-2 text-[11px]",
										children: "Test"
									})]
								})]
							}, i.name))
						}),
						step === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									{
										t: "Agency",
										rows: [
											"ABC Valuers Private Limited",
											"Private Limited · PAN AAACA1234F",
											"Hyderabad, Telangana 500081"
										]
									},
									{
										t: "Head Office",
										rows: [
											"Hyderabad Main Office (HYD001)",
											"GPS attendance recording",
											"Contact: Ravi Kumar"
										]
									},
									{
										t: "Users invited",
										rows: [
											"4 users across 4 roles",
											"Owner gets full administration",
											"2 users limited to Hyderabad"
										]
									},
									{
										t: "Workflow",
										rows: [
											"Numbering: ABC/HYD/2026/00001",
											"TAT 3 days · Priority Normal",
											"Initiation QC, Field QC & approval ON"
										]
									},
									{
										t: "Integrations",
										rows: [
											"Supabase Auth · Connected",
											"GPS Field Tracking · Connected",
											"2 pending connections"
										]
									},
									{
										t: "Subscription",
										rows: [
											"Enterprise · Annual",
											"Renews 03 Nov 2027",
											"Unlimited branches & users"
										]
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
										children: s.t
									}), s.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1.5 py-0.5 text-xs text-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-success" }),
											" ",
											r
										]
									}, r))]
								}, s.t))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Pre-load sample data"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Start with demo cases, users and bank masters to explore the workspace."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: sampleData,
									onCheckedChange: setSampleData
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					disabled: step === 1,
					onClick: () => setStep((s) => Math.max(1, s - 1)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => toast("Draft persistence is not enabled in Phase 1. No changes were saved."),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save as Draft"]
					}), step < 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setStep((s) => Math.min(6, s + 1)),
						children: ["Save & Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: activate,
						className: "bg-success text-success-foreground hover:bg-success/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "size-4" }), " Activate Workspace"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), " Only Tenant Owner and Tenant Admin see tenant administration; branch users see only their permitted modules."]
			})
		]
	}) });
}
//#endregion
export { Onboarding as component };
