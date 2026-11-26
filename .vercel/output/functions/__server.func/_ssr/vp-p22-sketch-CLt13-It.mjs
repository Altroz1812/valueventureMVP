//#region node_modules/.nitro/vite/services/ssr/assets/vp-p22-sketch-CLt13-It.js
/** Schematic coordinates only. Never use these for land area or valuation. */
var P22_KEY = "__vp_p22_sketch_v1";
var emptySketches = () => ({
	version: 1,
	plot: {
		name: "Plot outline",
		points: [],
		note: ""
	},
	floor: {
		name: "Floor outline",
		points: [],
		note: ""
	}
});
var obj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
var text = (x, max) => typeof x === "string" && x.length <= max;
function bounded(x, max) {
	return typeof x === "number" && Number.isFinite(x) && x >= 0 && x <= max;
}
function parseSketch(x) {
	if (!obj(x) || !text(x["name"], 80) || !text(x["note"], 500) || !Array.isArray(x["points"]) || x["points"].length > 24) throw new Error("Invalid sketch");
	const points = x["points"].map((p) => {
		if (!obj(p) || !bounded(p["x"], 600) || !bounded(p["y"], 360) || !text(p["label"], 80)) throw new Error("Invalid sketch vertex");
		return {
			x: p["x"],
			y: p["y"],
			label: p["label"]
		};
	});
	return {
		name: x["name"],
		note: x["note"],
		points
	};
}
function decodeSketches(raw) {
	if (!raw) return emptySketches();
	if (raw.length > 12e3) throw new Error("Sketch exceeds size limit");
	const x = JSON.parse(raw);
	if (!obj(x) || x["version"] !== 1) throw new Error("Unsupported sketch version");
	return {
		version: 1,
		plot: parseSketch(x["plot"]),
		floor: parseSketch(x["floor"])
	};
}
function encodeSketches(x) {
	return JSON.stringify(decodeSketches(JSON.stringify(x)));
}
function clampPoint(x, y) {
	return {
		x: Math.round(Math.min(600, Math.max(0, x))),
		y: Math.round(Math.min(360, Math.max(0, y))),
		label: ""
	};
}
function intersects(a, b, c, d) {
	const cross = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
	const on = (p, q, r) => cross(p, q, r) === 0 && r.x >= Math.min(p.x, q.x) && r.x <= Math.max(p.x, q.x) && r.y >= Math.min(p.y, q.y) && r.y <= Math.max(p.y, q.y);
	const x = cross(a, b, c), y = cross(a, b, d), z = cross(c, d, a), w = cross(c, d, b);
	return x * y < 0 && z * w < 0 || on(a, b, c) || on(a, b, d) || on(c, d, a) || on(c, d, b);
}
function sketchSubmissionError(raw) {
	try {
		const d = decodeSketches(raw);
		for (const k of ["plot", "floor"]) {
			const p = d[k].points;
			if (p.length > 0 && p.length < 3) return `${k} outline needs at least three vertices or must be cleared.`;
			if (p.length >= 3) {
				if (new Set(p.map((v) => `${v.x}:${v.y}`)).size !== p.length) return `${k} outline contains duplicate vertices.`;
				if (p.reduce((s, v, i) => {
					const q = p[(i + 1) % p.length];
					return s + v.x * q.y - q.x * v.y;
				}, 0) === 0) return `${k} outline is degenerate.`;
				for (let i = 0; i < p.length; i++) for (let j = i + 2; j < p.length; j++) {
					if (i === 0 && j === p.length - 1) continue;
					if (intersects(p[i], p[(i + 1) % p.length], p[j], p[(j + 1) % p.length])) return `${k} outline crosses itself.`;
				}
			}
		}
		return null;
	} catch (e) {
		return e instanceof Error ? e.message : String(e);
	}
}
function validMapPoint(lat, lng) {
	return typeof lat === "number" && Number.isFinite(lat) && Math.abs(lat) <= 85.05112878 && typeof lng === "number" && Number.isFinite(lng) && Math.abs(lng) <= 180;
}
//#endregion
export { sketchSubmissionError as a, encodeSketches as i, clampPoint as n, validMapPoint as o, decodeSketches as r, P22_KEY as t };
