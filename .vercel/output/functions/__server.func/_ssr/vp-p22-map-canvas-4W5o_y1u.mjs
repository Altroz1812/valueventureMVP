import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { n as Button } from "./card-svjjW0Eb.mjs";
import { t as require_leaflet_src } from "../_libs/leaflet.mjs";
import "../_libs/geoman-io__leaflet-geoman-free.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-p22-map-canvas-4W5o_y1u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
function MapCanvas({ points, radius }) {
	const el = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const drawn = (0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const subject = points.find((p) => p.subject);
		if (!subject || !el.current) return;
		let map;
		let observer;
		try {
			map = import_leaflet_src.default.map(el.current, { attributionControl: true }).setView([subject.lat, subject.lng], 14);
			mapRef.current = map;
			const bounds = import_leaflet_src.default.circle([subject.lat, subject.lng], {
				radius,
				color: "#2563eb",
				fillOpacity: .03,
				interactive: false,
				pmIgnore: true
			}).addTo(map).getBounds();
			points.forEach((p) => {
				const marker = import_leaflet_src.default.circleMarker([p.lat, p.lng], {
					radius: p.subject ? 9 : 6,
					color: p.subject ? "#1d4ed8" : "#15803d",
					fillOpacity: .85,
					pmIgnore: true
				}).addTo(map);
				const label = document.createElement("span");
				label.textContent = p.label;
				marker.bindTooltip(label);
				bounds.extend([p.lat, p.lng]);
			});
			map.fitBounds(bounds.pad(.2), { maxZoom: 16 });
			map.on("pm:create", (evt) => {
				const layer = evt.layer;
				if (drawn.current) map?.removeLayer(drawn.current);
				drawn.current = layer;
				map?.pm.disableDraw();
			});
			observer = new ResizeObserver(() => map?.invalidateSize());
			observer.observe(el.current);
			setReady(true);
			setError("");
		} catch (e) {
			setError(String(e));
			setReady(false);
		}
		return () => {
			observer?.disconnect();
			map?.remove();
			mapRef.current = null;
			drawn.current = null;
		};
	}, [points, radius]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: el,
				style: {
					height: 360,
					background: "#e9eef1"
				},
				"aria-label": "Comparable coordinate map without online tiles"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "text-destructive",
				children: ["Map unavailable: ", error]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: !ready,
					onClick: () => mapRef.current?.pm.enableDraw("Polygon", { allowSelfIntersection: false }),
					children: "Draw temporary outline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: !ready,
					onClick: () => {
						mapRef.current?.pm.disableDraw();
						if (drawn.current) mapRef.current?.removeLayer(drawn.current);
						drawn.current = null;
					},
					children: "Clear / cancel outline"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Blue: subject. Green: comparable. Circle: search radius. Coordinates use Leaflet projection; map has no external tile requests. Drawn polygon is temporary, not a recorded parcel or survey."
			})
		]
	});
}
//#endregion
export { MapCanvas as default };
