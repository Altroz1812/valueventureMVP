//#region node_modules/.nitro/vite/services/ssr/assets/ops-BcxJm0Qk.js
var STAGES = [
	"Initiation",
	"Initiation QC",
	"Field Visit",
	"Field QC",
	"Report Draft",
	"Final QC",
	"Approved",
	"Delivered"
];
function tatTone(tatLeft, stage) {
	if ([
		"Approved",
		"Delivered",
		"Submitted",
		"Invoiced"
	].includes(stage)) return "done";
	if (tatLeft < 0) return "overdue";
	if (tatLeft <= 1) return "today";
	return "ok";
}
//#endregion
export { tatTone as n, STAGES as t };
