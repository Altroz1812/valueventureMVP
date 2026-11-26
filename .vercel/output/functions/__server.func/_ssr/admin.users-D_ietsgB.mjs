import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useApp, i as supabase, o as vpDb } from "./vp-session-C-vOghu2.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as RefreshCw, D as Plus, St as CircleCheck, Y as KeyRound, c as Upload, dt as Download, f as ShieldCheck, h as Settings2, ht as Clock, i as UserX, it as FileSpreadsheet, l as TriangleAlert, o as UserRoundPlus, r as Users, s as UserPlus } from "../_libs/lucide-react.mjs";
import { C as SelectTrigger, S as SelectItem, b as Select, c as Dialog, d as DialogFooter, f as DialogHeader, i as CardContent, l as DialogContent, n as Button, o as CardHeader, p as DialogTitle, r as Card, s as CardTitle, t as AppShell, u as DialogDescription, w as SelectValue, x as SelectContent, y as PageHeader } from "./card-svjjW0Eb.mjs";
import { t as Badge } from "./badge-BFs4ux9R.mjs";
import { t as Input } from "./input-CgE9mqi6.mjs";
import { t as Label } from "./label-BhTXybW9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DV5SRygD.mjs";
import { t as Checkbox } from "./checkbox-BI658bIE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-D_ietsgB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emailValid = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 320;
function errorText(e) {
	return e instanceof Error ? e.message : String(e);
}
async function invokeProvision(body) {
	const { data, error } = await supabase.functions.invoke("vp-provision-users", { body });
	if (error) {
		let message = error.message;
		const context = error.context;
		if (context && typeof context.json === "function") try {
			message = (await context.json()).error ?? message;
		} catch {}
		throw new Error(message);
	}
	if (data?.error) throw new Error(String(data.error));
	return data;
}
function csvCell(value) {
	return `"${(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value).replaceAll("\"", "\"\"")}"`;
}
function downloadCredentials(items, fileName) {
	const content = "﻿" + [[
		"Full Name",
		"Email",
		"Role",
		"Temporary Password",
		"Status",
		"Error"
	], ...items.map((x) => [
		x.name,
		x.email,
		x.role,
		x.temporary_password ?? "",
		x.status,
		x.error ?? x.warning ?? ""
	])].map((row) => row.map((cell) => csvCell(String(cell))).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 1e4);
}
function VpOneTimeCredentials({ results, onClose }) {
	const completed = results?.filter((r) => r.status !== "failed") ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: Boolean(results),
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "One-time account credentials" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Passwords appear only here. Record or securely distribute them before closing. Never place the credentials file in shared storage or send it by ordinary email." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-64 space-y-2 overflow-auto rounded-md border p-3 text-sm",
					children: [completed.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b pb-2 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: x.name }),
							" — ",
							x.email,
							" (",
							x.role,
							")",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 font-mono text-xs break-all",
								children: ["Temporary password: ", x.temporary_password]
							}),
							x.warning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-amber-700",
								children: x.warning
							})
						]
					}, `${x.email}-${i}`)), results?.filter((x) => x.status === "failed").map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-destructive",
						children: [
							x.email,
							": ",
							x.error
						]
					}, `${x.email}-${i}`))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					children: "Close and clear passwords"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: !completed.length,
					onClick: () => downloadCredentials(results ?? [], "ValuationPro_One_Time_Credentials.csv"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export credentials once"]
				})] })
			]
		})
	});
}
function VpUserProvisionDialog({ open, onOpenChange, roles, branches, onComplete }) {
	const [mode, setMode] = (0, import_react.useState)("single");
	const [user, setUser] = (0, import_react.useState)({
		name: "",
		email: "",
		role: "",
		branch_codes: []
	});
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [results, setResults] = (0, import_react.useState)(null);
	const activeCodes = (0, import_react.useMemo)(() => new Set(branches.filter((x) => x.is_active).map((x) => x.code.toUpperCase())), [branches]);
	const validRows = rows.filter((r) => !r.error);
	const failedRows = rows.filter((r) => r.error);
	const isValid = (x) => {
		if (x.name.trim().length < 2 || x.name.length > 200) return "Name must be 2–200 characters";
		if (!emailValid(x.email)) return "Invalid email";
		if (!roles.includes(x.role)) return `Unknown role: ${x.role}`;
		const unknown = x.branch_codes.find((code) => !activeCodes.has(code));
		return unknown ? `Unknown/inactive branch: ${unknown}` : null;
	};
	async function readExcel(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		setResults(null);
		setRows([]);
		setProgress(0);
		if (!/\.xlsx$/i.test(file.name) || file.size > 3e6) {
			toast.error("Select a .xlsx file up to 3 MB");
			return;
		}
		try {
			const { readSheet } = await import("../_libs/read-excel-file+worker-f.mjs").then((n) => n.t);
			const data = await readSheet(file);
			const headers = (data[0] ?? []).map((v) => String(v ?? "").trim().toLowerCase());
			if ([
				"full name",
				"email",
				"role",
				"branch codes"
			].some((name, idx) => headers[idx] !== name)) throw new Error("Excel columns must be: Full Name | Email | Role | Branch Codes");
			const records = data.slice(1).filter((line) => line.some((cell) => String(cell ?? "").trim()));
			if (!records.length || records.length > 1e3) throw new Error("Workbook must contain 1–1000 users");
			const seen = /* @__PURE__ */ new Set();
			setRows(records.map((cells, index) => {
				const row = {
					name: String(cells[0] ?? "").trim(),
					email: String(cells[1] ?? "").trim().toLowerCase(),
					role: String(cells[2] ?? "").trim(),
					branch_codes: Array.from(new Set(String(cells[3] ?? "").split(";").map((s) => s.trim().toUpperCase()).filter(Boolean)))
				};
				let error = isValid(row);
				if (seen.has(row.email)) error = "Repeated email in import";
				seen.add(row.email);
				return {
					...row,
					excel_row: index + 2,
					error
				};
			}));
		} catch (e) {
			toast.error(errorText(e));
		}
	}
	async function provision() {
		if (busy) return;
		setBusy(true);
		setProgress(0);
		setResults(null);
		try {
			if (mode === "link") {
				const error = isValid(user);
				if (error) throw new Error(error);
				const { data: id, error: linkError } = await vpDb.rpc("vp_admin_attach_invited_user", {
					p_name: user.name.trim(),
					p_email: user.email.trim().toLowerCase(),
					p_role: user.role
				});
				if (linkError) throw linkError;
				if (user.branch_codes.length) {
					const ids = user.branch_codes.map((code) => branches.find((b) => b.code.toUpperCase() === code)?.id).filter(Boolean);
					const { error: branchError } = await vpDb.rpc("vp_admin_replace_user_branches", {
						p_user_id: String(id),
						p_branch_ids: ids
					});
					if (branchError) toast.warning("Linked account; review branch assignments");
				}
				toast.success("Existing login linked to this agency");
				await onComplete();
				onOpenChange(false);
			} else {
				const batch = mode === "single" ? [user] : validRows;
				if (mode === "single") {
					const error = isValid(user);
					if (error) throw new Error(error);
				}
				if (!batch.length) throw new Error("No valid users to create");
				const outcomes = [];
				for (let i = 0; i < batch.length; i += 20) {
					const part = batch.slice(i, i + 20);
					try {
						const data = await invokeProvision(mode === "single" ? {
							action: "create",
							user: part[0]
						} : {
							action: "bulk",
							rows: part
						});
						outcomes.push(...data.results);
					} catch (e) {
						outcomes.push(...part.map((x) => ({
							...x,
							status: "failed",
							error: errorText(e)
						})));
					}
					setProgress(Math.min(i + part.length, batch.length));
				}
				outcomes.push(...failedRows.map((x) => ({
					...x,
					status: "failed",
					error: `Row ${x.excel_row}: ${x.error}`
				})));
				setResults(outcomes);
				await onComplete();
				const successes = outcomes.filter((x) => x.status === "created").length;
				toast[successes ? "success" : "error"](`${successes} user(s) created; ${outcomes.length - successes} failed`);
			}
		} catch (e) {
			toast.error(errorText(e));
		} finally {
			setBusy(false);
		}
	}
	function close() {
		if (busy) return;
		setResults(null);
		setRows([]);
		setProgress(0);
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: open && !results,
		onOpenChange: (v) => {
			if (!v && !results) close();
			else if (v) onOpenChange(true);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "User Management — Add Accounts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create staff logins directly. No email invitations or database-console steps are needed." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: mode === "single" ? "default" : "outline",
							disabled: busy,
							onClick: () => setMode("single"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRoundPlus, { className: "size-4" }), " Create User"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: mode === "bulk" ? "default" : "outline",
							disabled: busy,
							onClick: () => setMode("bulk"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), " Excel Bulk Import"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: mode === "link" ? "default" : "outline",
							disabled: busy,
							onClick: () => setMode("link"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Link Existing Account"]
						})
					]
				}),
				mode !== "bulk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: user.name,
							onChange: (e) => setUser((x) => ({
								...x,
								name: e.target.value
							})),
							placeholder: "Employee full name"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Work email / login" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: user.email,
							onChange: (e) => setUser((x) => ({
								...x,
								email: e.target.value
							})),
							placeholder: "staff@company.com"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: user.role,
								onValueChange: (role) => setUser((x) => ({
									...x,
									role
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a role" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: role,
									children: role
								}, role)) })]
							}),
							!roles.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "mt-1 text-xs text-destructive",
								children: "No assignable roles available. Ask the Tenant Owner to configure the Role Matrix."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Branch access (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex max-h-28 flex-wrap gap-3 overflow-auto rounded border p-3",
							children: [branches.filter((b) => b.is_active).map((branch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: user.branch_codes.includes(branch.code),
										onCheckedChange: (checked) => setUser((x) => ({
											...x,
											branch_codes: checked === true ? [...x.branch_codes, branch.code] : x.branch_codes.filter((code) => code !== branch.code)
										}))
									}),
									branch.name,
									" (",
									branch.code,
									")"
								]
							}, branch.id)), !branches.some((b) => b.is_active) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No active branches in this tenant. Create a branch under Administration → Branches, or create the user without branch allocation."
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-md border p-2 text-xs text-muted-foreground",
							children: mode === "single" ? "A unique temporary password will be displayed once. The employee must change it on first login." : "Link an account already registered in the login service. No new password will be created."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/ValuationPro_User_Import_Template.xlsx",
							className: "inline-flex items-center gap-2 text-sm font-medium underline",
							download: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download Excel template"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: ".xlsx",
								disabled: busy,
								onChange: (e) => void readExcel(e)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Columns: Full Name, Email, Role, Branch Codes (separate multiple codes with semicolons). No passwords in the upload. Up to 1,000 users per file; processed in batches of 20."
						}),
						!!rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [rows.length, " rows"] }),
								" · ",
								validRows.length,
								" ready · ",
								failedRows.length,
								" need correction",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 max-h-36 overflow-auto text-xs",
									children: [rows.slice(0, 20).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: x.error ? "text-destructive" : "",
										children: [
											"Row ",
											x.excel_row,
											": ",
											x.name,
											" / ",
											x.email,
											" / ",
											x.role,
											" ",
											x.error ? `— ${x.error}` : "✓"
										]
									}, x.excel_row)), rows.length > 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"...and ",
										rows.length - 20,
										" further rows"
									] })]
								})
							]
						}),
						busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								"Processed ",
								progress,
								" of ",
								validRows.length,
								" users. Keep this page open."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					disabled: busy,
					onClick: close,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || (mode === "bulk" ? validRows.length === 0 : Boolean(isValid(user))),
					onClick: () => void provision(),
					children: busy ? "Creating…" : mode === "bulk" ? `Create ${validRows.length} Users` : mode === "link" ? "Link Existing Account" : "Create User"
				})] })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpOneTimeCredentials, {
		results,
		onClose: () => {
			setResults(null);
			close();
		}
	})] });
}
async function resetValuationUser(userId) {
	const { data, error } = await supabase.functions.invoke("vp-provision-users", { body: {
		action: "reset_password",
		user_id: userId
	} });
	if (error) {
		let message = error.message;
		const context = error.context;
		if (context && typeof context.json === "function") try {
			message = (await context.json()).error ?? message;
		} catch {}
		throw new Error(message);
	}
	if (data?.error) throw new Error(data.error);
	return data;
}
function status(u) {
	if (u.login_linked === false) return "Login Not Linked";
	if (!u.active) return "Suspended";
	if (u.password_setup_required) return "Password Change Required";
	if (!u.email_confirmed) return "Pending Invite";
	return "Active";
}
function getError(e) {
	return e instanceof Error ? e.message : String(e);
}
function UsersPage() {
	const { tenant, reloadUsers } = useApp();
	const qc = useQueryClient();
	const [users, setUsers] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [roleDefinitions, setRoleDefinitions] = (0, import_react.useState)([]);
	const [assignableRoles, setAssignableRoles] = (0, import_react.useState)([]);
	const [branches, setBranches] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [directoryError, setDirectoryError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [inviteOpen, setInviteOpen] = (0, import_react.useState)(false);
	const [resetResult, setResetResult] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [editRole, setEditRole] = (0, import_react.useState)("");
	const [editBranches, setEditBranches] = (0, import_react.useState)([]);
	async function reload() {
		setLoading(true);
		setDirectoryError(null);
		setUsers([]);
		setRoles([]);
		setRoleDefinitions([]);
		setAssignableRoles([]);
		setBranches([]);
		try {
			const [members, setupResponse] = await Promise.all([vpDb.rpc("vp_sec_admin_user_directory"), vpDb.rpc("vp_sec_admin_user_setup")]);
			if (members.error) throw members.error;
			if (setupResponse.error) throw setupResponse.error;
			const setup = setupResponse.data;
			if (!setup || String(setup.org_id) !== String(tenant.id) || !Array.isArray(setup.roles) || !Array.isArray(setup.branches)) throw new Error("User setup catalogue is missing or belongs to another tenant");
			setUsers((members.data ?? []).map((u) => ({
				...u,
				id: String(u.id),
				branch_ids: (u.branch_ids ?? []).map(String),
				password_setup_required: Boolean(u.password_setup_required),
				qc_eligible: u.qc_eligible && !u.password_setup_required,
				qc_issue: u.password_setup_required ? "First login password change required" : u.qc_issue
			})));
			setRoles(setup.roles.map((r) => r.name));
			setRoleDefinitions(setup.roles);
			setAssignableRoles(setup.roles.filter((r) => r.assignable).map((r) => r.name));
			setBranches(setup.branches.map((b) => ({
				...b,
				id: String(b.id)
			})));
			try {
				await reloadUsers();
			} catch (refreshError) {
				console.warn("Legacy user-list refresh failed; administrator directory remains available", refreshError);
			}
			await qc.invalidateQueries({ queryKey: ["vp-qc-eligible-checkers", tenant.id] });
		} catch (e) {
			setDirectoryError(getError(e));
			toast.error(`Unable to load user directory: ${getError(e)}`);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, [tenant.id]);
	const filtered = (0, import_react.useMemo)(() => users.filter((u) => {
		const search = `${u.name} ${u.login}`.toLowerCase();
		return (!query || search.includes(query.toLowerCase())) && (filter === "all" || (filter === "qc" ? u.qc_eligible : status(u) === filter)) && (roleFilter === "all" || roleFilter === u.role);
	}), [
		users,
		query,
		filter,
		roleFilter
	]);
	const permittedRoles = assignableRoles;
	const isProtectedRole = (roleName) => roleName === "Tenant Owner" || roleDefinitions.some((r) => r.name === roleName && r.privileged);
	const mayManageAccount = (u) => tenant.role === "Tenant Owner" || !isProtectedRole(u.role);
	async function resetPassword(u) {
		if (!window.confirm(`Reset the password for ${u.name}? Their current login will be blocked until they set a new password.`)) return;
		setBusy(true);
		try {
			const result = await resetValuationUser(u.id);
			setResetResult([result]);
			await reload();
			toast.success("A temporary password was created; distribute it securely");
		} catch (e) {
			toast.error(getError(e));
		} finally {
			setBusy(false);
		}
	}
	async function changeActive(u) {
		setBusy(true);
		try {
			const { error } = await vpDb.rpc("vp_admin_set_user_active", {
				p_user_id: u.id,
				p_active: !u.active
			});
			if (error) throw error;
			toast.success(u.active ? "User suspended" : "User reactivated");
			await reload();
		} catch (e) {
			toast.error(getError(e));
		} finally {
			setBusy(false);
		}
	}
	async function saveUser() {
		if (!selected || busy) return;
		if (!mayManageAccount(selected)) {
			toast.error("You cannot modify this protected account");
			return;
		}
		if (selected.role !== editRole && !permittedRoles.includes(editRole)) {
			toast.error("You cannot assign the selected protected role");
			return;
		}
		const previousBranches = [...new Set(selected.branch_ids)].sort();
		const requestedBranches = [...new Set(editBranches)].sort();
		if (selected.role === editRole && JSON.stringify(previousBranches) === JSON.stringify(requestedBranches)) {
			toast.info("No user access changes to save");
			setSelected(null);
			return;
		}
		setBusy(true);
		try {
			const { data, error } = await vpDb.rpc("vp_admin_save_user_access", {
				p_user_id: selected.id,
				p_expected_role: selected.role,
				p_expected_active: selected.active,
				p_expected_branches: previousBranches,
				p_role: editRole,
				p_branch_ids: requestedBranches
			});
			if (error) throw error;
			if (!data || typeof data !== "object" || String(data.user_id) !== String(selected.id) || data.role !== editRole || !Array.isArray(data.branch_ids) || JSON.stringify([...data.branch_ids].map(String).sort()) !== JSON.stringify(requestedBranches)) throw new Error("Server response could not be verified. Refresh the directory.");
			setSelected(null);
			toast.success("User role and branch access updated");
			await reload();
			window.dispatchEvent(new Event("vp-permissions-changed"));
		} catch (e) {
			toast.error(getError(e) + ". Refresh and verify the current user access.");
			setSelected(null);
			await reload();
		} finally {
			setBusy(false);
		}
	}
	const kpis = [
		{
			title: "Total users",
			count: users.length,
			icon: Users
		},
		{
			title: "Active",
			count: users.filter((u) => status(u) === "Active").length,
			icon: CircleCheck
		},
		{
			title: "Password setup",
			count: users.filter((u) => status(u) === "Password Change Required").length,
			icon: Clock
		},
		{
			title: "QC ready",
			count: users.filter((u) => u.qc_eligible).length,
			icon: ShieldCheck
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageHeader, {
			title: "Users & Permissions",
			description: `Manage staff accounts, tenant roles, branch allocation and QC eligibility for ${tenant.shortName}.`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => void reload(),
					disabled: loading,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Refresh"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/roles-permissions",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4" }), " Role Matrix"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					disabled: loading || Boolean(directoryError) || !permittedRoles.length,
					onClick: () => {
						setInviteOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), " Add User"]
				})
			]
		}),
		directoryError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "alert",
			className: "mb-4 rounded-md border border-destructive bg-destructive/5 p-3 text-sm text-destructive",
			children: [
				"User Management could not load securely: ",
				directoryError,
				". Verify P10/P11 and install the P12 user-setup RPC. No roles or users will be guessed."
			]
		}),
		!loading && !directoryError && !permittedRoles.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "alert",
			className: "mb-4 rounded-md border border-amber-500/50 p-3 text-sm",
			children: "No assignable roles exist for this tenant. Configure roles in the Role Matrix before adding an account."
		}),
		!loading && !directoryError && !branches.some((b) => b.is_active) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 rounded-md border p-3 text-sm",
			children: [
				"No active agency branches are configured. You can create an account without a branch, or ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "underline",
					to: "/admin/branches",
					children: "configure real branches"
				}),
				" first."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: kpis.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex items-center gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(x.icon, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl font-bold",
					children: x.count
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: x.title
				})] })]
			}) }, x.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "max-w-72",
					placeholder: "Search name or email",
					value: query,
					onChange: (e) => setQuery(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: filter,
					onValueChange: setFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Active",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Pending Invite",
							children: "Pending Invite"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Login Not Linked",
							children: "Login Not Linked"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Password Change Required",
							children: "Password Change Required"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "Suspended",
							children: "Suspended"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "qc",
							children: "QC ready"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: roleFilter,
					onValueChange: setRoleFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All roles"
					}), roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: r
					}, r))] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					"User directory (",
					filtered.length,
					")"
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name / Login" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Access status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "QC assignment" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Branches" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: u.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: u.login
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: u.role }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: status(u)
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: u.qc_eligible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-success/15 text-success",
						children: "Eligible"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex max-w-48 items-start gap-1 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-3 shrink-0" }), u.qc_issue]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: u.branch_ids.length ? u.branch_ids.map((id) => branches.find((b) => b.id === id)?.code ?? id).join(", ") : "Not allocated" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [
								mayManageAccount(u) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy,
									onClick: () => {
										setSelected(u);
										setEditRole(u.role);
										setEditBranches([...u.branch_ids]);
									},
									children: "Manage"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Protected account"
								}),
								u.role !== "Tenant Owner" && mayManageAccount(u) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy || u.login_linked === false,
									onClick: () => void resetPassword(u),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" }), " Reset password"]
								}),
								u.role !== "Tenant Owner" && mayManageAccount(u) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									disabled: busy,
									onClick: () => void changeActive(u),
									children: [u.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), u.active ? "Suspend" : "Activate"]
								})
							]
						})
					})
				] }, u.id)), !filtered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "p-8 text-center text-muted-foreground",
					children: loading ? "Loading all agency users…" : directoryError ? "Directory unavailable — inspect the error above." : "No users match. Clear filters or create an account."
				}) })] })] })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted-foreground",
			children: "Branch allocations must be enforced in each workflow. Missing allocations do not imply unrestricted data access. QC eligibility also depends on maker/checker separation."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpUserProvisionDialog, {
			open: inviteOpen,
			onOpenChange: setInviteOpen,
			roles: permittedRoles,
			branches,
			onComplete: reload
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpOneTimeCredentials, {
			results: resetResult,
			onClose: () => setResetResult(null)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(selected),
			onOpenChange: (open) => {
				if (!open) setSelected(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Manage user: ", selected?.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Update the real role and branch assignments. Changes are saved to ValuationPro." })] }),
					selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: selected.login }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										status(selected),
										" · ",
										selected.qc_issue
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editRole,
									onValueChange: setEditRole,
									disabled: selected.role === "Tenant Owner" || !permittedRoles.includes(selected.role),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: permittedRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: r,
										children: r
									}, r)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Allocated branches (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-44 space-y-2 overflow-auto rounded-md border p-3",
									children: [branches.filter((b) => b.is_active).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: editBranches.includes(b.id),
												onCheckedChange: (v) => setEditBranches((old) => v === true ? [...old, b.id] : old.filter((x) => x !== b.id))
											}),
											b.name,
											" (",
											b.code,
											")"
										]
									}, b.id)), !branches.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Create an agency branch first."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "For a Checker, grant qc.View, qc.Approve and qc.Return in Role Matrix. Only a different maker can be selected as its checker."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setSelected(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void saveUser(),
						children: "Save changes"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { UsersPage as component };
