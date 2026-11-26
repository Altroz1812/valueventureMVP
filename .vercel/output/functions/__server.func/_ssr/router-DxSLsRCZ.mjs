import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { c as workspaceAuthorizationKey, i as supabase, n as mayOpenPath, o as vpDb, r as normalizeGrantedPermissions, s as vpSignOutToHome, t as AppProvider } from "./vp-session-C-vOghu2.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { Ft as Building2, I as MapPinned, rt as FileText, vt as ClipboardCheck } from "../_libs/lucide-react.mjs";
import { t as Route } from "./cases_._caseId-2W1CRUr5.mjs";
import { t as Route$18 } from "./field-inspections._visitId-RDKfgEoR.mjs";
import { t as Route$19 } from "./field-operations-BZXLCsMr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DxSLsRCZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function VpAuthGate({ children }) {
	const pathname = useRouterState({ select: (r) => r.location.pathname });
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [gate, setGate] = (0, import_react.useState)("loading");
	const refreshSequence = (0, import_react.useRef)(0);
	const sessionUser = (0, import_react.useRef)(null);
	const authorizationScope = (0, import_react.useRef)(null);
	const activeRefresh = (0, import_react.useRef)(0);
	const lastRefreshStarted = (0, import_react.useRef)(0);
	const [workspaceEpoch, setWorkspaceEpoch] = (0, import_react.useState)(0);
	const [identity, setIdentity] = (0, import_react.useState)(null);
	const [capabilities, setCapabilities] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [register, setRegister] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [serverPasswordRequired, setServerPasswordRequired] = (0, import_react.useState)(false);
	const [invitePassword, setInvitePassword] = (0, import_react.useState)("");
	const [confirmInvitePassword, setConfirmInvitePassword] = (0, import_react.useState)("");
	function clearWorkspace() {
		authorizationScope.current = null;
		queryClient.clear();
		setIdentity(null);
		setCapabilities([]);
		setWorkspaceEpoch((value) => value + 1);
	}
	async function refresh() {
		const currentSequence = ++refreshSequence.current;
		activeRefresh.current = currentSequence;
		lastRefreshStarted.current = Date.now();
		const stillCurrent = () => currentSequence === refreshSequence.current;
		try {
			const { data: { user }, error: authError } = await supabase.auth.getUser();
			if (!stillCurrent()) return;
			if (authError && sessionUser.current && authError.name !== "AuthSessionMissingError" && authError.status !== 401 && authError.status !== 403) throw authError;
			if (authError || !user) {
				sessionUser.current = null;
				clearWorkspace();
				setGate("login");
				return;
			}
			if (sessionUser.current !== null && sessionUser.current !== user.id) {
				clearWorkspace();
				setGate("loading");
			}
			sessionUser.current = user.id;
			const { data, error: rpcError } = await vpDb.rpc("vp_my_context");
			if (!stillCurrent()) return;
			if (rpcError) throw rpcError;
			const profile = data;
			if (!profile) {
				clearWorkspace();
				const { data: accountStatus, error: statusError } = await vpDb.rpc("vp_account_status");
				if (!stillCurrent()) return;
				if (statusError) throw statusError;
				setGate(accountStatus === "unlinked" ? "setup" : "blocked");
				return;
			}
			const { data: firstLogin, error: setupError } = await vpDb.rpc("vp_first_login_required");
			if (!stillCurrent()) return;
			if (setupError) throw setupError;
			if (typeof firstLogin !== "boolean") throw new Error("Invalid password setup response");
			setServerPasswordRequired(firstLogin);
			const meta = user.user_metadata ?? {};
			if (firstLogin === true || meta["vp_invited"] === true && meta["vp_password_set"] !== true) {
				clearWorkspace();
				setIdentity(profile);
				setGate("password-setup");
				return;
			}
			const { data: granted, error: permissionsError } = await vpDb.rpc("vp_sec_my_capabilities");
			if (!stillCurrent()) return;
			if (permissionsError) throw new Error("Unable to verify role permissions: " + permissionsError.message);
			const permissions = normalizeGrantedPermissions(granted);
			const { data: branches, error: branchError } = await vpDb.from("vp_user_branches").select("branch_id::text").eq("org_id", profile.org_id).eq("user_id", profile.user_id);
			if (!stillCurrent()) return;
			if (branchError) throw new Error("Unable to verify branch allocations: " + branchError.message);
			const scope = workspaceAuthorizationKey(user.id, profile, permissions, branches);
			if (authorizationScope.current !== scope) {
				queryClient.clear();
				authorizationScope.current = scope;
				setWorkspaceEpoch((value) => value + 1);
			}
			setIdentity(profile);
			setCapabilities(permissions);
			setGate("ready");
		} catch (failure) {
			if (!stillCurrent()) return;
			clearWorkspace();
			setError(failure instanceof Error ? failure.message : "Unable to verify the session");
			setGate("error");
		} finally {
			if (activeRefresh.current === currentSequence) activeRefresh.current = 0;
		}
	}
	(0, import_react.useEffect)(() => {
		let disposed = false;
		let channel = null;
		const timers = /* @__PURE__ */ new Set();
		function deferRefresh() {
			const timer = setTimeout(() => {
				timers.delete(timer);
				if (!disposed) refresh();
			}, 0);
			timers.add(timer);
		}
		function backgroundRefresh() {
			if (disposed || document.visibilityState !== "visible" || !sessionUser.current || !authorizationScope.current || activeRefresh.current !== 0 || Date.now() - lastRefreshStarted.current < 2e3) return;
			refresh();
		}
		function handlePermissionChange() {
			if (disposed) return;
			try {
				channel?.postMessage("permissions-changed");
			} catch {}
			deferRefresh();
		}
		try {
			if (typeof BroadcastChannel !== "undefined") {
				channel = new BroadcastChannel("valuationpro-authorization");
				channel.onmessage = (event) => {
					if (!disposed && event.data === "permissions-changed" && sessionUser.current) deferRefresh();
				};
			}
		} catch {
			channel = null;
		}
		window.addEventListener("vp-permissions-changed", handlePermissionChange);
		window.addEventListener("focus", backgroundRefresh);
		window.addEventListener("online", backgroundRefresh);
		document.addEventListener("visibilitychange", backgroundRefresh);
		const interval = window.setInterval(backgroundRefresh, 6e4);
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (disposed) return;
			if (event === "SIGNED_OUT") {
				++refreshSequence.current;
				activeRefresh.current = 0;
				sessionUser.current = null;
				clearWorkspace();
				setGate("login");
				return;
			}
			if (event === "SIGNED_IN") {
				const incoming = session?.user.id;
				if (incoming && sessionUser.current && incoming !== sessionUser.current) {
					++refreshSequence.current;
					activeRefresh.current = 0;
					sessionUser.current = incoming;
					clearWorkspace();
					setGate("loading");
				}
				deferRefresh();
			} else if (event === "USER_UPDATED") deferRefresh();
		});
		refresh();
		return () => {
			disposed = true;
			++refreshSequence.current;
			activeRefresh.current = 0;
			subscription.unsubscribe();
			window.clearInterval(interval);
			for (const timer of timers) clearTimeout(timer);
			timers.clear();
			channel?.close();
			window.removeEventListener("vp-permissions-changed", handlePermissionChange);
			window.removeEventListener("focus", backgroundRefresh);
			window.removeEventListener("online", backgroundRefresh);
			document.removeEventListener("visibilitychange", backgroundRefresh);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (gate === "login" && pathname !== "/") navigate({
			to: "/",
			replace: true
		});
	}, [
		gate,
		pathname,
		navigate
	]);
	async function submitLogin(e) {
		e.preventDefault();
		setError("");
		setNotice("");
		setBusy(true);
		try {
			if (register) {
				const { data, error: signUpError } = await supabase.auth.signUp({
					email,
					password
				});
				if (signUpError) throw signUpError;
				if (!data.session) {
					setError("Check your email and confirm your account, then sign in.");
					setRegister(false);
				} else {
					await refresh();
					await navigate({
						to: "/",
						replace: true
					});
				}
			} else {
				const { error: signInError } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (signInError) throw signInError;
				queryClient.clear();
				await refresh();
				await navigate({
					to: "/",
					replace: true
				});
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Sign in failed");
		} finally {
			setBusy(false);
		}
	}
	async function createAgency(e) {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			const { error: rpcError } = await vpDb.rpc("vp_register_agency", {
				p_code: code.trim().toUpperCase(),
				p_name: name.trim()
			});
			if (rpcError) throw rpcError;
			await refresh();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Agency setup failed");
		} finally {
			setBusy(false);
		}
	}
	async function completeInvitePassword(e) {
		e.preventDefault();
		if (invitePassword.length < 12 || !/[A-Za-z]/.test(invitePassword) || !/[0-9]/.test(invitePassword) || invitePassword !== confirmInvitePassword) {
			setError("Use a matching password of at least 12 characters containing letters and numbers");
			return;
		}
		setBusy(true);
		setError("");
		try {
			if (serverPasswordRequired) {
				const { data, error: updateError } = await supabase.functions.invoke("vp-provision-users", { body: {
					action: "set_password",
					password: invitePassword
				} });
				if (updateError) throw updateError;
				if (data?.error) throw new Error(data.error);
				setInvitePassword("");
				setConfirmInvitePassword("");
				const { error: signOutError } = await supabase.auth.signOut();
				if (signOutError) throw signOutError;
				queryClient.clear();
				await navigate({
					to: "/",
					replace: true
				});
				setIdentity(null);
				setCapabilities([]);
				setNotice("Password updated. Please sign in using your new password.");
				setGate("login");
				return;
			} else {
				const { error: updateError } = await supabase.auth.updateUser({
					password: invitePassword,
					data: { vp_password_set: true }
				});
				if (updateError) throw updateError;
			}
			setInvitePassword("");
			setConfirmInvitePassword("");
			await refresh();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Password update failed");
		} finally {
			setBusy(false);
		}
	}
	async function signOut() {
		try {
			setError("");
			await vpSignOutToHome(queryClient);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Sign out failed");
		}
	}
	if (gate === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground",
		children: "Verifying ValuationPro session…"
	});
	if (gate === "ready" && identity) {
		if (!mayOpenPath(pathname, capabilities)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Access restricted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This role has no permission to open this module. Ask the administrator to update its Role Matrix." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded border px-3 py-2",
					onClick: signOut,
					children: "Sign out"
				})
			]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProvider, {
			identity,
			capabilities,
			children
		}, workspaceEpoch);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen bg-background text-foreground lg:grid-cols-[1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden overflow-hidden bg-[#0f2542] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-center xl:px-20",
			"aria-label": "About ValuationPro",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 max-w-xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
							className: "size-8",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-semibold",
							children: "ValuationPro"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-4xl font-semibold leading-tight tracking-tight xl:text-5xl",
						children: [
							"Property valuation.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"One connected workspace."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-base leading-relaxed text-slate-200",
						children: "Manage case intake, site inspections, valuation workpapers and quality review in one platform."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							{
								Icon: MapPinned,
								label: "Inspect"
							},
							{
								Icon: ClipboardCheck,
								label: "Review"
							},
							{
								Icon: FileText,
								label: "Report"
							}
						].map(({ Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-slate-500 bg-white/10 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "mb-3 size-6 text-blue-200",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: label
							})]
						}, label))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				focusable: "false",
				viewBox: "0 0 600 400",
				className: "pointer-events-none absolute bottom-0 right-0 w-full max-w-[650px] opacity-20",
				fill: "none",
				stroke: "#93c5fd",
				strokeWidth: "1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 400 600 0M120 400 600 80M240 400 600 160M360 400 600 240M480 400 600 320M0 200 300 400M0 100 450 400M100 0 600 333" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M245 280V140l100-65 100 65v140M245 140l100 60 100-60M345 200v160M445 280l-100 80-100-80M290 168v140M400 168v140",
					strokeWidth: "3"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-w-0 items-center justify-center p-4 sm:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl font-bold",
						children: "ValuationPro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: gate === "setup" ? "Set up your valuation agency" : "Secure workspace access"
					}),
					gate === "password-setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4",
						onSubmit: completeInvitePassword,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "For account security, replace your temporary password before entering the workspace."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["New password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									autoComplete: "new-password",
									className: "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2",
									required: true,
									minLength: 12,
									value: invitePassword,
									onChange: (e) => setInvitePassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Confirm password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									autoComplete: "new-password",
									className: "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2",
									required: true,
									minLength: 12,
									value: confirmInvitePassword,
									onChange: (e) => setConfirmInvitePassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								className: "min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50",
								children: busy ? "Saving…" : "Set password & continue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: signOut,
								className: "w-full text-sm underline",
								children: "Sign out"
							})
						]
					}) : gate === "blocked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This user or organization is inactive. Contact your tenant administrator." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded border px-3 py-2",
							onClick: signOut,
							children: "Sign out"
						})]
					}) : gate === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4",
						onSubmit: createAgency,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Agency legal name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									minLength: 3,
									maxLength: 200
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Agency code (2–6 letters)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 uppercase",
									value: code,
									onChange: (e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6)),
									required: true,
									pattern: "[A-Z]{2,6}"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Your verified account becomes the Tenant Owner. Set up your agency before inviting staff."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								className: "min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50",
								children: busy ? "Creating…" : "Create agency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "w-full text-sm underline",
								onClick: signOut,
								children: "Sign out"
							})
						]
					}) : gate !== "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4",
						onSubmit: submitLogin,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									className: "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									className: "mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2",
									autoComplete: register ? "new-password" : "current-password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: busy,
								className: "min-h-11 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50",
								children: busy ? "Working…" : register ? "Create account" : "Sign in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "w-full text-sm underline",
								onClick: () => {
									setRegister((p) => !p);
									setError("");
								},
								children: register ? "Already have an account? Sign in" : "New agency? Create an account"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-5 rounded border px-3 py-2",
						onClick: () => {
							setGate("loading");
							refresh();
						},
						children: "Retry"
					}),
					notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-green-700",
						children: notice
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive",
						children: error
					})
				]
			})
		})]
	});
}
var styles_default = "/assets/styles-CM3kIi-i.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ValuationPro" },
			{
				name: "description",
				content: "Multi-tenant property valuation suite for Indian valuation agencies."
			},
			{
				property: "og:title",
				content: "ValuationPro"
			},
			{
				property: "og:description",
				content: "Multi-tenant property valuation suite for Indian valuation agencies."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpAuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$15 = () => import("./routes-HQ23i5ng.mjs");
var Route$16 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ValuationPro — Agency Dashboard" },
		{
			name: "description",
			content: "Live valuation case pipeline, QC queue and branch performance across your agency branches."
		},
		{
			property: "og:title",
			content: "ValuationPro — Agency Dashboard"
		},
		{
			property: "og:description",
			content: "Live valuation case pipeline, QC queue and branch performance across your agency branches."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
/** A proper mobile landing page for the Field Officer, rather than analytics-denied desktop widgets. */
var $$splitComponentImporter$14 = () => import("./analytics-BR4h2DEG.mjs");
var Route$15 = createFileRoute("/analytics")({
	head: () => ({ meta: [{ title: "ValuationPro — Analytics & Audit" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./billing-mis-ClfRZuXt.mjs");
var Route$14 = createFileRoute("/billing-mis")({
	head: () => ({ meta: [{ title: "ValuationPro — Billing & MIS" }, {
		name: "description",
		content: "Bank invoicing, payment collections, and branch/bank MIS."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./cases-USxG9x-O.mjs");
var Route$13 = createFileRoute("/cases")({
	head: () => ({ meta: [{ title: "ValuationPro — Case Pipeline" }, {
		name: "description",
		content: "Track valuation cases across branches and banks."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./market-intelligence-BCThUDQM.mjs");
var Route$12 = createFileRoute("/market-intelligence")({
	head: () => ({ meta: [{ title: "Market Intelligence — ValuationPro" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./notifications-CzgjKPrJ.mjs");
var Route$11 = createFileRoute("/notifications")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./onboarding-DA-MH55A.mjs");
var Route$10 = createFileRoute("/onboarding")({
	head: () => ({ meta: [
		{ title: "ValuationPro — Tenant Onboarding" },
		{
			name: "description",
			content: "Set up a new valuation agency workspace in six guided steps: profile, branch, users, workflow, integrations and activation."
		},
		{
			property: "og:title",
			content: "ValuationPro — Tenant Onboarding"
		},
		{
			property: "og:description",
			content: "Set up a new valuation agency workspace in six guided steps."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./properties-W5qZywR5.mjs");
var Route$9 = createFileRoute("/properties")({
	head: () => ({ meta: [{ title: "Property Master — ValuationPro" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./qc-checking-RYLhQ0d-.mjs");
var Route$8 = createFileRoute("/qc-checking")({
	head: () => ({ meta: [{ title: "ValuationPro — QC & Checking" }, {
		name: "description",
		content: "Authenticated QC queue, checker assignment, review and rework."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./reports-Bhf1cerM.mjs");
var Route$7 = createFileRoute("/reports")({
	head: () => ({ meta: [{ title: "ValuationPro — Reports & Sign-off" }, {
		name: "description",
		content: "Versioned valuation reports, bank format references and controlled release."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.bank-masters-DQpqBIGP.mjs");
var Route$6 = createFileRoute("/admin/bank-masters")({
	head: () => ({ meta: [{ title: "ValuationPro — Bank Masters & Rate Cards" }, {
		name: "description",
		content: "Tenant banks and valuation tariffs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.branches-BDs9IPDz.mjs");
var Route$5 = createFileRoute("/admin/branches")({
	head: () => ({ meta: [{ title: "ValuationPro — Agency Branches" }, {
		name: "description",
		content: "Tenant-specific agency branch configuration."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.data-integrity-DsDqF_ID.mjs");
var Route$4 = createFileRoute("/admin/data-integrity")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
/** Uses the signed-in browser session: detects RLS errors that SQL Editor cannot show. */
var $$splitComponentImporter$2 = () => import("./admin.roles-permissions-C3nql03d.mjs");
var Route$3 = createFileRoute("/admin/roles-permissions")({
	head: () => ({ meta: [
		{ title: "ValuationPro — Role Matrix" },
		{
			name: "description",
			content: "Central role and capability matrix across case management, field ops, QC, digital sign-off, billing and administration."
		},
		{
			property: "og:title",
			content: "ValuationPro — Role Matrix"
		},
		{
			property: "og:description",
			content: "Central role and capability matrix across all agency modules."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.users-D_ietsgB.mjs");
var Route$2 = createFileRoute("/admin/users")({
	head: () => ({ meta: [{ title: "ValuationPro — Users & Permissions" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.settings.branches._id-DScR-K5Q.mjs");
var Route$1 = createFileRoute("/admin/settings/branches/$id")({
	head: () => ({ meta: [
		{ title: "ValuationPro — Branch Configuration" },
		{
			name: "description",
			content: "Field-level configuration inheritance between agency defaults and branch overrides."
		},
		{
			property: "og:title",
			content: "ValuationPro — Branch Configuration"
		},
		{
			property: "og:description",
			content: "Field-level configuration inheritance between agency defaults and branch overrides."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$16.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$17
	}),
	AnalyticsRoute: Route$15.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => Route$17
	}),
	BillingMisRoute: Route$14.update({
		id: "/billing-mis",
		path: "/billing-mis",
		getParentRoute: () => Route$17
	}),
	CasesRoute: Route$13.update({
		id: "/cases",
		path: "/cases",
		getParentRoute: () => Route$17
	}),
	FieldOperationsRoute: Route$19.update({
		id: "/field-operations",
		path: "/field-operations",
		getParentRoute: () => Route$17
	}),
	MarketIntelligenceRoute: Route$12.update({
		id: "/market-intelligence",
		path: "/market-intelligence",
		getParentRoute: () => Route$17
	}),
	NotificationsRoute: Route$11.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => Route$17
	}),
	OnboardingRoute: Route$10.update({
		id: "/onboarding",
		path: "/onboarding",
		getParentRoute: () => Route$17
	}),
	PropertiesRoute: Route$9.update({
		id: "/properties",
		path: "/properties",
		getParentRoute: () => Route$17
	}),
	QcCheckingRoute: Route$8.update({
		id: "/qc-checking",
		path: "/qc-checking",
		getParentRoute: () => Route$17
	}),
	ReportsRoute: Route$7.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => Route$17
	}),
	AdminBankMastersRoute: Route$6.update({
		id: "/admin/bank-masters",
		path: "/admin/bank-masters",
		getParentRoute: () => Route$17
	}),
	AdminBranchesRoute: Route$5.update({
		id: "/admin/branches",
		path: "/admin/branches",
		getParentRoute: () => Route$17
	}),
	AdminDataIntegrityRoute: Route$4.update({
		id: "/admin/data-integrity",
		path: "/admin/data-integrity",
		getParentRoute: () => Route$17
	}),
	AdminRolesPermissionsRoute: Route$3.update({
		id: "/admin/roles-permissions",
		path: "/admin/roles-permissions",
		getParentRoute: () => Route$17
	}),
	AdminUsersRoute: Route$2.update({
		id: "/admin/users",
		path: "/admin/users",
		getParentRoute: () => Route$17
	}),
	CasesCaseIdRoute: Route.update({
		id: "/cases_/$caseId",
		path: "/cases/$caseId",
		getParentRoute: () => Route$17
	}),
	FieldInspectionsVisitIdRoute: Route$18.update({
		id: "/field-inspections/$visitId",
		path: "/field-inspections/$visitId",
		getParentRoute: () => Route$17
	}),
	AdminSettingsBranchesIdRoute: Route$1.update({
		id: "/admin/settings/branches/$id",
		path: "/admin/settings/branches/$id",
		getParentRoute: () => Route$17
	})
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
