import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region node_modules/its-fine/dist/index.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/* @__PURE__ */ (() => {
	var e, t;
	return typeof window != "undefined" && (((e = window.document) == null ? void 0 : e.createElement) || ((t = window.navigator) == null ? void 0 : t.product) === "ReactNative");
})() ? import_react.useLayoutEffect : import_react.useEffect;
function l(e, t, i) {
	if (!e) return;
	if (i(e) === !0) return e;
	let n = t ? e.return : e.child;
	for (; n;) {
		const o = l(n, t, i);
		if (o) return o;
		n = t ? null : n.sibling;
	}
}
function b(e) {
	try {
		return Object.defineProperties(e, {
			_currentRenderer: {
				get() {
					return null;
				},
				set() {}
			},
			_currentRenderer2: {
				get() {
					return null;
				},
				set() {}
			}
		});
	} catch (t) {
		return e;
	}
}
var p = /* @__PURE__ */ b(/* @__PURE__ */ import_react.createContext(null));
var h = class extends import_react.Component {
	render() {
		return /* @__PURE__ */ import_react.createElement(p.Provider, { value: this._reactInternals }, this.props.children);
	}
};
function m() {
	const e = import_react.useContext(p);
	if (e === null) throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");
	const t = import_react.useId();
	return import_react.useMemo(() => {
		for (const n of [e, e == null ? void 0 : e.alternate]) {
			if (!n) continue;
			const o = l(n, !1, (d) => {
				let s = d.memoizedState;
				for (; s;) {
					if (s.memoizedState === t) return !0;
					s = s.next;
				}
			});
			if (o) return o;
		}
	}, [e, t]);
}
var w = Symbol.for("react.context");
var E = (e) => e !== null && typeof e == "object" && "$$typeof" in e && e.$$typeof === w;
function g() {
	const e = m(), [t] = import_react.useState(() => /* @__PURE__ */ new Map());
	t.clear();
	let i = e;
	for (; i;) {
		const n = i.type;
		E(n) && n !== p && !t.has(n) && t.set(n, import_react.use(b(n))), i = i.return;
	}
	return t;
}
function M() {
	const e = g();
	return import_react.useMemo(() => Array.from(e.keys()).reduce((t, i) => (n) => /* @__PURE__ */ import_react.createElement(t, null, /* @__PURE__ */ import_react.createElement(i.Provider, {
		...n,
		value: e.get(i)
	})), (t) => /* @__PURE__ */ import_react.createElement(h, { ...t })), [e]);
}
//#endregion
export { h as n, M as t };
