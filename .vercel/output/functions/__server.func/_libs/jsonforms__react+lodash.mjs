import { o as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { $ as mapStateToOneOfEnumControlProps, C as i18nReducer, D as isControl, Et as require__root, G as mapStateToCellProps, H as mapDispatchToArrayControlProps, J as mapStateToEnumControlProps, K as mapStateToControlProps, Q as mapStateToOneOfEnumCellProps, T as index$1, Tt as require_isObject, U as mapDispatchToControlProps, W as mapStateToArrayControlProps, X as mapStateToLabelProps, Y as mapStateToJsonFormsRendererProps, Z as mapStateToLayoutProps, f as coreReducer, g as defaultMiddleware, gt as require_toNumber, h as defaultMapStateToEnumCellProps, m as defaultJsonFormsI18nState, q as mapStateToDispatchCellProps, r as Id, s as arrayDefaultTranslations, t as Generate, u as configReducer, x as getArrayTranslations, yt as require_maxBy } from "./@jsonforms/core+[...].mjs";
//#region node_modules/lodash/now.js
var require_now = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var root = require__root();
	/**
	* Gets the timestamp of the number of milliseconds that have elapsed since
	* the Unix epoch (1 January 1970 00:00:00 UTC).
	*
	* @static
	* @memberOf _
	* @since 2.4.0
	* @category Date
	* @returns {number} Returns the timestamp.
	* @example
	*
	* _.defer(function(stamp) {
	*   console.log(_.now() - stamp);
	* }, _.now());
	* // => Logs the number of milliseconds it took for the deferred invocation.
	*/
	var now = function() {
		return root.Date.now();
	};
	module.exports = now;
}));
//#endregion
//#region node_modules/lodash/debounce.js
var require_debounce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_isObject();
	var now = require_now();
	var toNumber = require_toNumber();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	var nativeMax = Math.max;
	var nativeMin = Math.min;
	/**
	* Creates a debounced function that delays invoking `func` until after `wait`
	* milliseconds have elapsed since the last time the debounced function was
	* invoked. The debounced function comes with a `cancel` method to cancel
	* delayed `func` invocations and a `flush` method to immediately invoke them.
	* Provide `options` to indicate whether `func` should be invoked on the
	* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	* with the last arguments provided to the debounced function. Subsequent
	* calls to the debounced function return the result of the last `func`
	* invocation.
	*
	* **Note:** If `leading` and `trailing` options are `true`, `func` is
	* invoked on the trailing edge of the timeout only if the debounced function
	* is invoked more than once during the `wait` timeout.
	*
	* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	* until to the next tick, similar to `setTimeout` with a timeout of `0`.
	*
	* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	* for details over the differences between `_.debounce` and `_.throttle`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Function
	* @param {Function} func The function to debounce.
	* @param {number} [wait=0] The number of milliseconds to delay.
	* @param {Object} [options={}] The options object.
	* @param {boolean} [options.leading=false]
	*  Specify invoking on the leading edge of the timeout.
	* @param {number} [options.maxWait]
	*  The maximum time `func` is allowed to be delayed before it's invoked.
	* @param {boolean} [options.trailing=true]
	*  Specify invoking on the trailing edge of the timeout.
	* @returns {Function} Returns the new debounced function.
	* @example
	*
	* // Avoid costly calculations while the window size is in flux.
	* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	*
	* // Invoke `sendMail` when clicked, debouncing subsequent calls.
	* jQuery(element).on('click', _.debounce(sendMail, 300, {
	*   'leading': true,
	*   'trailing': false
	* }));
	*
	* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	* var source = new EventSource('/stream');
	* jQuery(source).on('message', debounced);
	*
	* // Cancel the trailing debounced invocation.
	* jQuery(window).on('popstate', debounced.cancel);
	*/
	function debounce(func, wait, options) {
		var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
		if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
		wait = toNumber(wait) || 0;
		if (isObject(options)) {
			leading = !!options.leading;
			maxing = "maxWait" in options;
			maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}
		function invokeFunc(time) {
			var args = lastArgs, thisArg = lastThis;
			lastArgs = lastThis = void 0;
			lastInvokeTime = time;
			result = func.apply(thisArg, args);
			return result;
		}
		function leadingEdge(time) {
			lastInvokeTime = time;
			timerId = setTimeout(timerExpired, wait);
			return leading ? invokeFunc(time) : result;
		}
		function remainingWait(time) {
			var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
			return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
		}
		function shouldInvoke(time) {
			var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
			return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
		}
		function timerExpired() {
			var time = now();
			if (shouldInvoke(time)) return trailingEdge(time);
			timerId = setTimeout(timerExpired, remainingWait(time));
		}
		function trailingEdge(time) {
			timerId = void 0;
			if (trailing && lastArgs) return invokeFunc(time);
			lastArgs = lastThis = void 0;
			return result;
		}
		function cancel() {
			if (timerId !== void 0) clearTimeout(timerId);
			lastInvokeTime = 0;
			lastArgs = lastCallTime = lastThis = timerId = void 0;
		}
		function flush() {
			return timerId === void 0 ? result : trailingEdge(now());
		}
		function debounced() {
			var time = now(), isInvoking = shouldInvoke(time);
			lastArgs = arguments;
			lastThis = this;
			lastCallTime = time;
			if (isInvoking) {
				if (timerId === void 0) return leadingEdge(lastCallTime);
				if (maxing) {
					clearTimeout(timerId);
					timerId = setTimeout(timerExpired, wait);
					return invokeFunc(lastCallTime);
				}
			}
			if (timerId === void 0) timerId = setTimeout(timerExpired, wait);
			return result;
		}
		debounced.cancel = cancel;
		debounced.flush = flush;
		return debounced;
	}
	module.exports = debounce;
}));
//#endregion
//#region node_modules/@jsonforms/react/lib/jsonforms-react.esm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_maxBy = /* @__PURE__ */ __toESM(require_maxBy());
var import_debounce = /* @__PURE__ */ __toESM(require_debounce());
var RendererComponent = class extends import_react.Component {
	constructor(props) {
		super(props);
	}
};
var Control = class extends RendererComponent {
	constructor(props) {
		super(props);
		this.handleChange = (value) => {
			this.setState({ value });
			this.updateData(value);
		};
		this.onFocus = () => {
			this.setState({ isFocused: true });
		};
		this.onBlur = () => {
			this.setState({ isFocused: false });
		};
		this.updateData = (value) => {
			this.props.handleChange(this.props.path, value);
		};
		this.state = {
			value: props.data ? props.data : "",
			isFocused: false
		};
	}
};
var UnknownRenderer = class extends import_react.Component {
	render() {
		return import_react.createElement("div", { style: { color: "red" } }, "No applicable ", this.props.type, " found.");
	}
};
var JsonFormsContext = import_react.createContext({
	core: {
		data: {},
		schema: {},
		uischema: void 0,
		errors: [],
		additionalErrors: [],
		validator: void 0,
		ajv: void 0
	},
	renderers: []
});
var useEffectAfterFirstRender = (effect, dependencies) => {
	const firstExecution = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (firstExecution.current) {
			firstExecution.current = false;
			return;
		}
		effect();
	}, dependencies);
};
var JsonFormsStateProvider = ({ children, initState, onChange, middleware }) => {
	const { data, schema, uischema, ajv, validationMode, additionalErrors } = initState.core;
	const middlewareRef = (0, import_react.useRef)(middleware ?? defaultMiddleware);
	middlewareRef.current = middleware ?? defaultMiddleware;
	const [core, setCore] = (0, import_react.useState)(() => middlewareRef.current(initState.core, index$1.init(data, schema, uischema, {
		ajv,
		validationMode,
		additionalErrors
	}), coreReducer));
	(0, import_react.useEffect)(() => setCore((currentCore) => middlewareRef.current(currentCore, index$1.updateCore(data, schema, uischema, {
		ajv,
		validationMode,
		additionalErrors
	}), coreReducer)), [
		data,
		schema,
		uischema,
		ajv,
		validationMode,
		additionalErrors
	]);
	const [config, configDispatch] = (0, import_react.useReducer)(configReducer, void 0, () => configReducer(void 0, index$1.setConfig(initState.config)));
	useEffectAfterFirstRender(() => {
		configDispatch(index$1.setConfig(initState.config));
	}, [initState.config]);
	const [i18n, i18nDispatch] = (0, import_react.useReducer)(i18nReducer, void 0, () => i18nReducer(initState.i18n, index$1.updateI18n(initState.i18n?.locale, initState.i18n?.translate, initState.i18n?.translateError)));
	(0, import_react.useEffect)(() => {
		i18nDispatch(index$1.updateI18n(initState.i18n?.locale, initState.i18n?.translate, initState.i18n?.translateError));
	}, [
		initState.i18n?.locale,
		initState.i18n?.translate,
		initState.i18n?.translateError
	]);
	const dispatch = (0, import_react.useCallback)((action) => {
		setCore((currentCore) => middlewareRef.current(currentCore, action, coreReducer));
	}, []);
	const contextValue = (0, import_react.useMemo)(() => ({
		core,
		renderers: initState.renderers,
		cells: initState.cells,
		config,
		uischemas: initState.uischemas,
		readonly: initState.readonly,
		i18n,
		dispatch
	}), [
		core,
		initState.renderers,
		initState.cells,
		config,
		initState.uischemas,
		initState.readonly,
		i18n
	]);
	const onChangeRef = (0, import_react.useRef)(onChange);
	(0, import_react.useEffect)(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	const debouncedEmit = (0, import_react.useCallback)((0, import_debounce.default)((...args) => onChangeRef.current?.(...args), 10), []);
	(0, import_react.useEffect)(() => {
		debouncedEmit({
			data: core.data,
			errors: core.errors
		});
	}, [core.data, core.errors]);
	return import_react.createElement(JsonFormsContext.Provider, { value: contextValue }, children);
};
var useJsonForms = () => (0, import_react.useContext)(JsonFormsContext);
var ctxToArrayControlProps = (ctx, props) => mapStateToArrayControlProps({ jsonforms: { ...ctx } }, props);
var ctxToLayoutProps = (ctx, props) => mapStateToLayoutProps({ jsonforms: { ...ctx } }, props);
var ctxToControlProps = (ctx, props) => mapStateToControlProps({ jsonforms: { ...ctx } }, props);
var ctxToEnumControlProps = (ctx, props) => {
	const enumProps = mapStateToEnumControlProps({ jsonforms: { ...ctx } }, props);
	const options = (0, import_react.useMemo)(() => enumProps.options, [
		props.options,
		enumProps.schema,
		ctx.i18n?.translate
	]);
	return {
		...enumProps,
		options
	};
};
var ctxToOneOfEnumControlProps = (ctx, props) => {
	const enumProps = mapStateToOneOfEnumControlProps({ jsonforms: { ...ctx } }, props);
	const options = (0, import_react.useMemo)(() => enumProps.options, [
		props.options,
		enumProps.schema,
		ctx.i18n?.translate
	]);
	return {
		...enumProps,
		options
	};
};
var ctxDispatchToControlProps = (dispatch) => (0, import_react.useMemo)(() => mapDispatchToControlProps(dispatch), [dispatch]);
var ctxToJsonFormsRendererProps = (ctx, ownProps) => mapStateToJsonFormsRendererProps({ jsonforms: { ...ctx } }, ownProps);
var ctxDispatchToArrayControlProps = (dispatch) => ({
	...ctxDispatchToControlProps(dispatch),
	...(0, import_react.useMemo)(() => mapDispatchToArrayControlProps(dispatch), [dispatch])
});
var ctxToCellProps = (ctx, ownProps) => {
	return mapStateToCellProps({ jsonforms: { ...ctx } }, ownProps);
};
var ctxToEnumCellProps = (ctx, ownProps) => {
	const cellProps = defaultMapStateToEnumCellProps({ jsonforms: { ...ctx } }, ownProps);
	const options = (0, import_react.useMemo)(() => cellProps.options, [
		ownProps.options,
		cellProps.schema,
		ctx.i18n?.translate
	]);
	return {
		...cellProps,
		options
	};
};
var ctxToOneOfEnumCellProps = (ctx, props) => {
	const enumCellProps = mapStateToOneOfEnumCellProps({ jsonforms: { ...ctx } }, props);
	const options = (0, import_react.useMemo)(() => enumCellProps.options, [
		props.options,
		enumCellProps.schema,
		ctx.i18n?.translate
	]);
	return {
		...enumCellProps,
		options
	};
};
var ctxToDispatchCellProps = (ctx, ownProps) => {
	return mapStateToDispatchCellProps({ jsonforms: { ...ctx } }, ownProps);
};
var ctxToLabelProps = (ctx, ownProps) => {
	return mapStateToLabelProps({ jsonforms: { ...ctx } }, ownProps);
};
var withJsonFormsContext = (Component) => function WithJsonFormsContext(props) {
	const ctx = useJsonForms();
	return import_react.createElement(Component, {
		ctx,
		props
	});
};
var withContextToJsonFormsRendererProps = (Component) => function WithContextToJsonFormsRendererProps({ ctx, props }) {
	const contextProps = ctxToJsonFormsRendererProps(ctx, props);
	return import_react.createElement(Component, {
		...props,
		...contextProps
	});
};
var withContextToControlProps = (Component) => function WithContextToControlProps({ ctx, props }) {
	const controlProps = ctxToControlProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...controlProps,
		...dispatchProps
	});
};
var withContextToLayoutProps = (Component) => function WithContextToLayoutProps({ ctx, props }) {
	const layoutProps = ctxToLayoutProps(ctx, props);
	return import_react.createElement(Component, {
		...props,
		...layoutProps
	});
};
var withContextToArrayControlProps = (Component) => function WithContextToArrayControlProps({ ctx, props }) {
	const stateProps = ctxToArrayControlProps(ctx, props);
	const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...stateProps,
		...dispatchProps
	});
};
var withContextToCellProps = (Component) => function WithContextToCellProps({ ctx, props }) {
	const cellProps = ctxToCellProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...dispatchProps,
		...cellProps
	});
};
var withContextToDispatchCellProps = (Component) => function WithContextToDispatchCellProps({ ctx, props }) {
	const cellProps = ctxToDispatchCellProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...dispatchProps,
		...cellProps
	});
};
var withContextToEnumCellProps = (Component) => function WithContextToEnumCellProps({ ctx, props }) {
	const cellProps = ctxToEnumCellProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...dispatchProps,
		...cellProps
	});
};
var withContextToEnumProps = (Component) => function WithContextToEnumProps({ ctx, props }) {
	const stateProps = ctxToEnumControlProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...dispatchProps,
		...stateProps
	});
};
var withContextToOneOfEnumCellProps = (Component) => function WithContextToOneOfEnumCellProps({ ctx, props }) {
	const cellProps = ctxToOneOfEnumCellProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...dispatchProps,
		...cellProps
	});
};
var withContextToOneOfEnumProps = (Component) => function WithContextToOneOfEnumProps({ ctx, props }) {
	const stateProps = ctxToOneOfEnumControlProps(ctx, props);
	const dispatchProps = ctxDispatchToControlProps(ctx.dispatch);
	return import_react.createElement(Component, {
		...props,
		...dispatchProps,
		...stateProps
	});
};
var withContextToLabelProps = (Component) => function WithContextToLabelProps({ ctx, props }) {
	const stateProps = ctxToLabelProps(ctx, props);
	return import_react.createElement(Component, {
		...props,
		...stateProps
	});
};
var withJsonFormsRendererProps = (Component, memoize = true) => withJsonFormsContext(withContextToJsonFormsRendererProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsControlProps = (Component, memoize = true) => withJsonFormsContext(withContextToControlProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsLayoutProps = (Component, memoize = true) => withJsonFormsContext(withContextToLayoutProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsArrayControlProps = (Component, memoize = true) => withJsonFormsContext(withContextToArrayControlProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsCellProps = (Component, memoize = true) => withJsonFormsContext(withContextToCellProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsDispatchCellProps = (Component, memoize = true) => withJsonFormsContext(withContextToDispatchCellProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsEnumCellProps = (Component, memoize = true) => withJsonFormsContext(withContextToEnumCellProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsEnumProps = (Component, memoize = true) => withJsonFormsContext(withContextToEnumProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsOneOfEnumCellProps = (Component, memoize = true) => withJsonFormsContext(withContextToOneOfEnumCellProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsOneOfEnumProps = (Component, memoize = true) => withJsonFormsContext(withContextToOneOfEnumProps(memoize ? import_react.memo(Component) : Component));
var withJsonFormsLabelProps = (Component, memoize = true) => withJsonFormsContext(withContextToLabelProps(memoize ? import_react.memo(Component) : Component));
var withTranslateProps = (Component) => function WithTranslateProps(props) {
	const ctx = useJsonForms();
	const locale = ctx.i18n?.locale ?? defaultJsonFormsI18nState.locale;
	const t = ctx.i18n?.translate ?? defaultJsonFormsI18nState.translate;
	return import_react.createElement(Component, {
		...props,
		locale,
		t
	});
};
var withArrayTranslationProps = (Component) => function withArrayTranslatationProps(props) {
	const translations = (0, import_react.useMemo)(() => getArrayTranslations(props.t, arrayDefaultTranslations, props.i18nKeyPrefix, props.label), [
		props.t,
		props.i18nKeyPrefix,
		props.label
	]);
	return import_react.createElement(Component, {
		...props,
		translations
	});
};
var JsonFormsDispatchRenderer = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = { id: isControl(props.uischema) ? Id.createId(props.uischema.scope) : void 0 };
	}
	componentWillUnmount() {
		if (isControl(this.props.uischema)) Id.removeId(this.state.id);
	}
	componentDidUpdate(prevProps) {
		if (prevProps.schema !== this.props.schema) {
			Id.removeId(this.state.id);
			this.setState({ id: isControl(this.props.uischema) ? Id.createId(this.props.uischema.scope) : void 0 });
		}
	}
	render() {
		const { schema, rootSchema, uischema, path, enabled, renderers, cells, config } = this.props;
		return import_react.createElement(TestAndRender, {
			uischema,
			schema,
			rootSchema,
			path,
			enabled,
			renderers,
			cells,
			id: this.state.id,
			config
		});
	}
};
var TestAndRender = import_react.memo(function TestAndRender(props) {
	const testerContext = (0, import_react.useMemo)(() => ({
		rootSchema: props.rootSchema,
		config: props.config
	}), [props.rootSchema, props.config]);
	const renderer = (0, import_react.useMemo)(() => (0, import_maxBy.default)(props.renderers, (r) => r.tester(props.uischema, props.schema, testerContext)), [
		props.renderers,
		props.uischema,
		props.schema,
		testerContext
	]);
	if (renderer === void 0 || renderer.tester(props.uischema, props.schema, testerContext) === -1) return import_react.createElement(UnknownRenderer, { type: "renderer" });
	else {
		const Render = renderer.renderer;
		return import_react.createElement(Render, {
			uischema: props.uischema,
			schema: props.schema,
			path: props.path,
			enabled: props.enabled,
			renderers: props.renderers,
			cells: props.cells,
			id: props.id
		});
	}
});
var ResolvedJsonFormsDispatchRenderer = class extends JsonFormsDispatchRenderer {
	constructor(props) {
		super(props);
	}
};
var JsonFormsDispatch = withJsonFormsRendererProps(JsonFormsDispatchRenderer);
withJsonFormsRendererProps(ResolvedJsonFormsDispatchRenderer);
var JsonForms = (props) => {
	const { ajv, data, schema, uischema, renderers, cells, onChange, config, uischemas, readonly, validationMode, i18n, additionalErrors, middleware } = props;
	const schemaToUse = (0, import_react.useMemo)(() => schema !== void 0 ? schema : Generate.jsonSchema(data), [schema, data]);
	const uischemaToUse = (0, import_react.useMemo)(() => typeof uischema === "object" ? uischema : Generate.uiSchema(schemaToUse, void 0, void 0, schemaToUse), [uischema, schemaToUse]);
	return import_react.createElement(JsonFormsStateProvider, {
		initState: {
			core: {
				ajv,
				data,
				schema: schemaToUse,
				uischema: uischemaToUse,
				validationMode,
				additionalErrors
			},
			config,
			uischemas,
			renderers,
			cells,
			readonly,
			i18n
		},
		onChange,
		middleware
	}, import_react.createElement(JsonFormsDispatch, null));
};
var Dispatch = ({ uischema, schema, rootSchema, path, cells, id, enabled, renderers, config }) => {
	const testerContext = (0, import_react.useMemo)(() => ({
		rootSchema,
		config
	}), [rootSchema, config]);
	const cell = (0, import_react.useMemo)(() => (0, import_maxBy.default)(cells, (r) => r.tester(uischema, schema, testerContext)), [
		cells,
		uischema,
		schema,
		testerContext
	]);
	if (cell === void 0 || cell.tester(uischema, schema, testerContext) === -1) return import_react.createElement(UnknownRenderer, { type: "cell" });
	else {
		const Cell = cell.cell;
		return import_react.createElement(Cell, {
			uischema,
			schema,
			enabled,
			path,
			id,
			renderers,
			cells
		});
	}
};
var DispatchCell = withJsonFormsDispatchCellProps(Dispatch);
//#endregion
export { useJsonForms as a, withJsonFormsCellProps as c, withJsonFormsEnumProps as d, withJsonFormsLabelProps as f, withTranslateProps as g, withJsonFormsOneOfEnumProps as h, JsonFormsDispatch as i, withJsonFormsControlProps as l, withJsonFormsOneOfEnumCellProps as m, DispatchCell as n, withArrayTranslationProps as o, withJsonFormsLayoutProps as p, JsonForms as r, withJsonFormsArrayControlProps as s, Control as t, withJsonFormsEnumCellProps as u };
