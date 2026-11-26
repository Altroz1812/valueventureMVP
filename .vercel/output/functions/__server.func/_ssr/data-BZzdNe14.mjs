//#region node_modules/.nitro/vite/services/ssr/assets/data-BZzdNe14.js
var permissionModules = [
	{
		id: "cases",
		name: "Case Management",
		icon: "Folders",
		actions: [
			"View",
			"Create",
			"Edit",
			"Delete",
			"Assign",
			"Approve",
			"Export"
		]
	},
	{
		id: "field",
		name: "Field Operations",
		icon: "MapPin",
		actions: [
			"View",
			"Assign",
			"Check In/Out",
			"Manage Geofence",
			"Export"
		]
	},
	{
		id: "qc",
		name: "QC & Review",
		icon: "ShieldCheck",
		actions: [
			"View",
			"Approve",
			"Return",
			"Edit",
			"Export"
		]
	},
	{
		id: "signoff",
		name: "Digital Sign-off & Legal",
		icon: "PenLine",
		actions: [
			"View",
			"Sign",
			"Generate",
			"Manage Templates",
			"Release"
		],
		ibbiLockedAction: "Sign"
	},
	{
		id: "billing",
		name: "Billing & MIS",
		icon: "Receipt",
		actions: [
			"View",
			"Create",
			"Approve",
			"Export"
		]
	},
	{
		id: "analytics",
		name: "Analytics & Audit",
		icon: "Receipt",
		actions: [
			"View",
			"Audit",
			"Export"
		]
	},
	{
		id: "admin",
		name: "Administration",
		icon: "Settings",
		actions: [
			"View",
			"Manage Users",
			"Manage Roles",
			"Edit Settings",
			"Audit Logs"
		]
	}
];
function fmtINR(n) {
	return "₹" + n.toLocaleString("en-IN");
}
//#endregion
export { permissionModules as n, fmtINR as t };
