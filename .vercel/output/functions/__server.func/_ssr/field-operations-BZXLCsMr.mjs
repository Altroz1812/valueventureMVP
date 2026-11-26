import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/field-operations-BZXLCsMr.js
var $$splitComponentImporter = () => import("./field-operations-CL1EB4GA.mjs");
var Route = createFileRoute("/field-operations")({
	validateSearch: (search) => ({ view: search["view"] === "reports" ? "reports" : "visits" }),
	head: () => ({ meta: [{ title: "ValuationPro — Field Operations" }, {
		name: "description",
		content: "Site inspection scheduling, GPS audit capture and actual photo evidence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
