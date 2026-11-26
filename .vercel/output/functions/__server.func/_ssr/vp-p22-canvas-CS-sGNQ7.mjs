import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { n as clampPoint } from "./vp-p22-sketch-CLt13-It.mjs";
import { a as Stage, i as Rect, n as Layer, o as Text, r as Line, t as Circle } from "../_libs/react-konva+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vp-p22-canvas-CS-sGNQ7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SketchCanvas({ sketch, disabled, onChange }) {
	const wrap = (0, import_react.useRef)(null);
	const [width, setWidth] = (0, import_react.useState)(300);
	(0, import_react.useEffect)(() => {
		const el = wrap.current;
		if (!el) return;
		const update = () => {
			if (el.clientWidth > 0) setWidth(Math.min(600, el.clientWidth));
		};
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	const scale = width / 600;
	const points = sketch.points;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrap,
		className: "w-full max-w-[600px] overflow-hidden rounded border bg-white",
		"aria-label": "Schematic drawing canvas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {
			width,
			height: 360 * scale,
			scaleX: scale,
			scaleY: scale,
			onPointerDown: (e) => {
				if (disabled || points.length >= 24 || e.target.name() !== "sketch-background") return;
				const p = e.target.getStage()?.getPointerPosition();
				if (!p) return;
				onChange({
					...sketch,
					points: [...points, clampPoint(p.x / scale, p.y / scale)]
				});
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layer, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rect, {
					name: "sketch-background",
					width: 600,
					height: 360,
					fill: "#fff"
				}),
				Array.from({ length: 14 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					points: [
						i * 48,
						0,
						i * 48,
						360
					],
					stroke: "#e2e8f0",
					listening: false
				}, `x${i}`)),
				Array.from({ length: 9 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					points: [
						0,
						i * 48,
						600,
						i * 48
					],
					stroke: "#e2e8f0",
					listening: false
				}, `y${i}`)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					points: points.flatMap((p) => [p.x, p.y]),
					closed: points.length >= 3,
					fill: points.length >= 3 ? "#dbeafe" : "transparent",
					stroke: "#1e3a8a",
					strokeWidth: 2,
					listening: false
				}),
				points.map((p, i) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
						x: p.x,
						y: p.y,
						radius: 8,
						fill: "#2563eb",
						stroke: "white",
						strokeWidth: 2,
						draggable: !disabled,
						onDragEnd: (e) => {
							if (disabled) return;
							const v = clampPoint(e.target.x(), e.target.y());
							onChange({
								...sketch,
								points: points.map((q, j) => j === i ? {
									...v,
									label: q.label
								} : q)
							});
						}
					}, i);
				}),
				points.map((p, i) => {
					const next = points[(i + 1) % points.length];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						x: next ? (p.x + next.x) / 2 : p.x,
						y: next ? (p.y + next.y) / 2 : p.y,
						text: p.label || `P${i + 1}`,
						fill: "#0f172a",
						fontSize: 13,
						listening: false
					}, i);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
					x: 12,
					y: 12,
					text: "SCHEMATIC — NOT TO SCALE",
					fontSize: 12,
					fill: "#475569",
					listening: false
				})
			] })
		})
	});
}
//#endregion
export { SketchCanvas as default };
