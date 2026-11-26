import { o as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { u as require_react } from "../@floating-ui/react-dom+[...].mjs";
import { A as isDescriptionHidden, B as isTimeControl, Ct as require_isArrayLike, D as isControl, E as isBooleanControl, F as isNumberFormatControl, I as isObjectArrayWithNesting, L as isOneOfEnumControl, M as isIntegerControl, N as isMultiLineControl, O as isDateControl, P as isNumberControl, R as isRangeControl, S as getControlPath, St as require_keys$1, V as isVisible, _ as deriveLabelForUISchemaElement, _t as require_startCase$1, a as Resolve, at as require_convert, b as getAjv, bt as require__baseIteratee, c as compose, ct as require__LodashWrapper, d as convertToValidClassName$2, dt as require_placeholder, et as optionIs, ft as require_merge, ht as require_range, i as Paths, it as require_remove, j as isEnumControl, k as isDateTimeControl, l as computeLabel, lt as require__getFuncName, mt as require__baseEach, n as Helpers, nt as uiTypeIs, o as and, ot as require__flatRest, p as createDefaultValue, pt as require_filter$1, rt as require_reduce, st as require__isLaziable, tt as rankWith$1, ut as require__getData, v as encode, vt as require_isEmpty, w as index, wt as require_isArray, xt as require__arrayMap, y as findUISchema, yt as require_maxBy, z as isStringControl } from "./core+[...].mjs";
import { a as useJsonForms, c as withJsonFormsCellProps, d as withJsonFormsEnumProps, f as withJsonFormsLabelProps, g as withTranslateProps, h as withJsonFormsOneOfEnumProps, i as JsonFormsDispatch, l as withJsonFormsControlProps, m as withJsonFormsOneOfEnumCellProps, n as DispatchCell, o as withArrayTranslationProps, p as withJsonFormsLayoutProps, s as withJsonFormsArrayControlProps, t as Control, u as withJsonFormsEnumCellProps } from "../jsonforms__react+lodash.mjs";
//#region node_modules/lodash/join.js
var require_join = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeJoin = Array.prototype.join;
	/**
	* Converts all elements in `array` into a string separated by `separator`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Array
	* @param {Array} array The array to convert.
	* @param {string} [separator=','] The element separator.
	* @returns {string} Returns the joined string.
	* @example
	*
	* _.join(['a', 'b', 'c'], '~');
	* // => 'a~b~c'
	*/
	function join(array, separator) {
		return array == null ? "" : nativeJoin.call(array, separator);
	}
	module.exports = join;
}));
//#endregion
//#region node_modules/lodash/fp/filter.js
var require_filter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("filter", require_filter$1());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/lodash/_baseMap.js
var require__baseMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseEach = require__baseEach();
	var isArrayLike = require_isArrayLike();
	/**
	* The base implementation of `_.map` without support for iteratee shorthands.
	*
	* @private
	* @param {Array|Object} collection The collection to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the new mapped array.
	*/
	function baseMap(collection, iteratee) {
		var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
		baseEach(collection, function(value, key, collection) {
			result[++index] = iteratee(value, key, collection);
		});
		return result;
	}
	module.exports = baseMap;
}));
//#endregion
//#region node_modules/lodash/map.js
var require_map$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayMap = require__arrayMap();
	var baseIteratee = require__baseIteratee();
	var baseMap = require__baseMap();
	var isArray = require_isArray();
	/**
	* Creates an array of values by running each element in `collection` thru
	* `iteratee`. The iteratee is invoked with three arguments:
	* (value, index|key, collection).
	*
	* Many lodash methods are guarded to work as iteratees for methods like
	* `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	*
	* The guarded methods are:
	* `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
	* `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
	* `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
	* `template`, `trim`, `trimEnd`, `trimStart`, and `words`
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Collection
	* @param {Array|Object} collection The collection to iterate over.
	* @param {Function} [iteratee=_.identity] The function invoked per iteration.
	* @returns {Array} Returns the new mapped array.
	* @example
	*
	* function square(n) {
	*   return n * n;
	* }
	*
	* _.map([4, 8], square);
	* // => [16, 64]
	*
	* _.map({ 'a': 4, 'b': 8 }, square);
	* // => [16, 64] (iteration order is not guaranteed)
	*
	* var users = [
	*   { 'user': 'barney' },
	*   { 'user': 'fred' }
	* ];
	*
	* // The `_.property` iteratee shorthand.
	* _.map(users, 'user');
	* // => ['barney', 'fred']
	*/
	function map(collection, iteratee) {
		return (isArray(collection) ? arrayMap : baseMap)(collection, baseIteratee(iteratee, 3));
	}
	module.exports = map;
}));
//#endregion
//#region node_modules/lodash/fp/map.js
var require_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("map", require_map$1());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/lodash/_createFlow.js
var require__createFlow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LodashWrapper = require__LodashWrapper();
	var flatRest = require__flatRest();
	var getData = require__getData();
	var getFuncName = require__getFuncName();
	var isArray = require_isArray();
	var isLaziable = require__isLaziable();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	/** Used to compose bitmasks for function metadata. */
	var WRAP_CURRY_FLAG = 8;
	var WRAP_PARTIAL_FLAG = 32;
	var WRAP_ARY_FLAG = 128;
	var WRAP_REARG_FLAG = 256;
	/**
	* Creates a `_.flow` or `_.flowRight` function.
	*
	* @private
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {Function} Returns the new flow function.
	*/
	function createFlow(fromRight) {
		return flatRest(function(funcs) {
			var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
			if (fromRight) funcs.reverse();
			while (index--) {
				var func = funcs[index];
				if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
				if (prereq && !wrapper && getFuncName(func) == "wrapper") var wrapper = new LodashWrapper([], true);
			}
			index = wrapper ? index : length;
			while (++index < length) {
				func = funcs[index];
				var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : void 0;
				if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
				else wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
			}
			return function() {
				var args = arguments, value = args[0];
				if (wrapper && args.length == 1 && isArray(value)) return wrapper.plant(value).value();
				var index = 0, result = length ? funcs[index].apply(this, args) : value;
				while (++index < length) result = funcs[index].call(this, result);
				return result;
			};
		});
	}
	module.exports = createFlow;
}));
//#endregion
//#region node_modules/lodash/flow.js
var require_flow$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__createFlow()();
}));
//#endregion
//#region node_modules/lodash/fp/flow.js
var require_flow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("flow", require_flow$1());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/lodash/fp/_falseOptions.js
var require__falseOptions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"cap": false,
		"curry": false,
		"fixed": false,
		"immutable": false,
		"rearg": false
	};
}));
//#endregion
//#region node_modules/lodash/fp/keys.js
var require_keys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("keys", require_keys$1(), require__falseOptions());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/lodash/fp/startCase.js
var require_startCase = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("startCase", require_startCase$1(), require__falseOptions());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/@jsonforms/vanilla-renderers/lib/jsonforms-react-vanilla.esm.js
var import_maxBy = /* @__PURE__ */ __toESM(require_maxBy());
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_isEmpty = /* @__PURE__ */ __toESM(require_isEmpty());
require_remove();
var import_join = /* @__PURE__ */ __toESM(require_join());
var import_filter = /* @__PURE__ */ __toESM(require_filter$1());
var import_reduce = /* @__PURE__ */ __toESM(require_reduce());
var import_merge = /* @__PURE__ */ __toESM(require_merge());
var import_range = /* @__PURE__ */ __toESM(require_range());
var import_filter$1 = /* @__PURE__ */ __toESM(require_filter());
var import_map = /* @__PURE__ */ __toESM(require_map());
var import_flow = /* @__PURE__ */ __toESM(require_flow());
var import_keys = /* @__PURE__ */ __toESM(require_keys());
var import_startCase = /* @__PURE__ */ __toESM(require_startCase());
var i18nDefaults = { "enum.none": "None" };
var findStyle = (styles) => (style, ...args) => {
	const foundStyles = (0, import_filter.default)(styles, (s) => s.name === style);
	return (0, import_reduce.default)(foundStyles, (res, style) => {
		if (typeof style.classNames === "function") return res.concat(style.classNames(args));
		return res.concat(style.classNames);
	}, []);
};
var findStyleAsClassName = (styles) => (style, ...args) => (0, import_join.default)(findStyle(styles)(style, args), " ");
var JsonFormsStyleContext = import_react.createContext({ styles: [
	{
		name: "control",
		classNames: ["control"]
	},
	{
		name: "control.trim",
		classNames: ["trim"]
	},
	{
		name: "control.input",
		classNames: ["input"]
	},
	{
		name: "control.select",
		classNames: ["select"]
	},
	{
		name: "control.checkbox",
		classNames: ["checkbox"]
	},
	{
		name: "control.radio",
		classNames: ["radio"]
	},
	{
		name: "control.radio.option",
		classNames: ["radio-option"]
	},
	{
		name: "control.radio.input",
		classNames: ["radio-input"]
	},
	{
		name: "control.radio.label",
		classNames: ["radio-label"]
	},
	{
		name: "control.validation.error",
		classNames: ["validation_error"]
	},
	{
		name: "control.validation",
		classNames: ["validation"]
	},
	{
		name: "categorization",
		classNames: ["categorization"]
	},
	{
		name: "categorization.master",
		classNames: ["categorization-master"]
	},
	{
		name: "categorization.detail",
		classNames: ["categorization-detail"]
	},
	{
		name: "category.group",
		classNames: ["category-group"]
	},
	{
		name: "category.subcategories",
		classNames: ["category-subcategories"]
	},
	{
		name: "array.layout",
		classNames: ["array-layout"]
	},
	{
		name: "array.children",
		classNames: ["children"]
	},
	{
		name: "group.layout",
		classNames: ["group-layout"]
	},
	{
		name: "horizontal.layout",
		classNames: ["horizontal-layout"]
	},
	{
		name: "horizontal.layout.item",
		classNames: ([size]) => [`horizontal-layout-${size}`]
	},
	{
		name: "vertical.layout",
		classNames: ["vertical-layout"]
	},
	{
		name: "array.table.validation.error",
		classNames: ["validation_error"]
	},
	{
		name: "array.table.validation",
		classNames: ["validation"]
	},
	{
		name: "array.table",
		classNames: ["array-table-layout", "control"]
	},
	{
		name: "array.control.validation.error",
		classNames: ["validation_error"]
	},
	{
		name: "array.control.validation",
		classNames: ["validation"]
	},
	{
		name: "array.control.add",
		classNames: ["button-add"]
	},
	{
		name: "array.child.controls",
		classNames: ["child-controls"]
	},
	{
		name: "array.child.controls.up",
		classNames: ["button-up"]
	},
	{
		name: "array.child.controls.down",
		classNames: ["button-down"]
	},
	{
		name: "array.child.controls.delete",
		classNames: ["button-delete"]
	},
	{
		name: "array.control",
		classNames: ["array-control-layout", "control"]
	},
	{
		name: "input.description",
		classNames: ["input-description"]
	}
] });
var useStyleContext = () => (0, import_react.useContext)(JsonFormsStyleContext);
var useStyles = () => {
	const { styles } = useStyleContext();
	return styles;
};
var withVanillaControlProps = (Component) => function WithVanillaControlProps(props) {
	const ctx = useJsonForms();
	const contextStyles = useStyles();
	const controlElement = props.uischema;
	const config = ctx.config;
	const trim = config && config.trim;
	const styles = (0, import_react.useMemo)(() => findStyle(contextStyles)("control"), [contextStyles]);
	let classNames = !(0, import_isEmpty.default)(controlElement.scope) ? styles.concat([`${convertToValidClassName$2(controlElement.scope)}`]) : [""];
	if (trim) classNames = classNames.concat(findStyle(contextStyles)("control.trim"));
	const isValid = (0, import_isEmpty.default)(props.errors);
	const labelClass = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.label"), [contextStyles]);
	const descriptionClassName = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("input.description"), [contextStyles]);
	const validationClassName = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.validation"), [contextStyles]);
	const validationErrorClassName = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.validation.error"), [contextStyles]);
	const inputClassName = ["validate"].concat(isValid ? "valid" : "invalid");
	const getStyleAsClassName = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles), [contextStyles]);
	const getStyle = (0, import_react.useMemo)(() => findStyle(contextStyles), [contextStyles]);
	const wrapper = classNames.join(" ");
	const input = inputClassName.join(" ");
	const classNamesProp = (0, import_react.useMemo)(() => ({
		wrapper,
		input,
		label: labelClass,
		description: descriptionClassName,
		validation: validationClassName,
		validationError: validationErrorClassName
	}), [
		wrapper,
		input,
		labelClass,
		descriptionClassName,
		validationClassName,
		validationErrorClassName
	]);
	return import_react.createElement(Component, {
		...props,
		getStyleAsClassName,
		getStyle,
		classNames: classNamesProp
	});
};
var withVanillaCellPropsForType = (type) => (Component) => function WithVanillaCellPropsForType(props) {
	const inputClassName = ["validate"].concat(props.isValid ? "valid" : "invalid");
	const styles = useStyles();
	const definedStyle = findStyleAsClassName(styles)(type);
	if (definedStyle) inputClassName.push(definedStyle);
	return import_react.createElement(Component, {
		...props,
		getStyleAsClassName: findStyleAsClassName(styles),
		getStyle: findStyle(styles),
		className: inputClassName.join(" ")
	});
};
var withAjvProps = (Component) => function WithAjvProps(props) {
	const ctx = useJsonForms();
	const ajv = getAjv({ jsonforms: { ...ctx } });
	return import_react.createElement(Component, {
		...props,
		ajv
	});
};
var withVanillaCellProps = withVanillaCellPropsForType("control.input");
var withVanillaEnumCellProps = withVanillaCellPropsForType("control.select");
var withVanillaBooleanCellProps = withVanillaCellPropsForType("control.checkbox");
var InputControl = class extends Control {
	render() {
		const { classNames, description, id, errors, label, uischema, schema, rootSchema, visible, enabled, required, path, cells, config } = this.props;
		const isValid = errors.length === 0;
		const divClassNames = [classNames.validation].concat(isValid ? classNames.description : classNames.validationError).join(" ");
		const appliedUiSchemaOptions = (0, import_merge.default)({}, config, uischema.options);
		const showDescription = !isDescriptionHidden(visible, description, this.state.isFocused, appliedUiSchemaOptions.showUnfocusedDescription);
		const testerContext = {
			rootSchema,
			config
		};
		const cell = (0, import_maxBy.default)(cells, (r) => r.tester(uischema, schema, testerContext));
		if (cell === void 0 || cell.tester(uischema, schema, testerContext) === -1) {
			console.warn("No applicable cell found.", uischema, schema);
			return null;
		} else return import_react.createElement("div", {
			className: classNames.wrapper,
			hidden: !visible,
			onFocus: this.onFocus,
			onBlur: this.onBlur,
			id
		}, import_react.createElement("label", {
			htmlFor: id + "-input",
			className: classNames.label
		}, computeLabel(label, required, appliedUiSchemaOptions.hideRequiredAsterisk)), import_react.createElement(DispatchCell, {
			uischema,
			schema,
			path,
			id: id + "-input",
			enabled
		}), import_react.createElement("div", { className: divClassNames }, !isValid ? errors : showDescription ? description : null));
	}
};
var inputControlTester = rankWith$1(1, isControl);
var InputControl$1 = withVanillaControlProps(withJsonFormsControlProps(InputControl));
var RadioGroup = ({ classNames, id, label, options, required, description, errors, data, uischema, visible, config, enabled, path, handleChange }) => {
	const contextStyles = useStyles();
	const [isFocused, setFocus] = (0, import_react.useState)(false);
	const radioControl = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.radio"), [contextStyles]);
	const radioOption = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.radio.option"), [contextStyles]);
	const radioInput = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.radio.input"), [contextStyles]);
	const radioLabel = (0, import_react.useMemo)(() => findStyleAsClassName(contextStyles)("control.radio.label"), [contextStyles]);
	const isValid = errors.length === 0;
	const divClassNames = [classNames.validation].concat(isValid ? classNames.description : classNames.validationError).join(" ");
	const appliedUiSchemaOptions = (0, import_merge.default)({}, config, uischema.options);
	const showDescription = !isDescriptionHidden(visible, description, isFocused, appliedUiSchemaOptions.showUnfocusedDescription);
	const hasRadioClass = !radioControl || radioControl === "radio";
	let groupStyle = {};
	if (hasRadioClass) groupStyle = {
		display: "flex",
		flexDirection: "vertical" === appliedUiSchemaOptions.orientation ? "column" : "row"
	};
	return import_react.createElement("div", {
		className: classNames.wrapper,
		hidden: !visible,
		onFocus: () => setFocus(true),
		onBlur: () => setFocus(false)
	}, import_react.createElement("label", {
		htmlFor: id,
		className: classNames.label
	}, computeLabel(label, required, appliedUiSchemaOptions.hideRequiredAsterisk)), import_react.createElement("div", {
		className: radioControl,
		style: groupStyle
	}, options.map((option) => import_react.createElement("div", {
		key: option.label,
		className: radioOption
	}, import_react.createElement("input", {
		type: "radio",
		value: option.value,
		id: option.value,
		name: id,
		checked: data === option.value,
		onChange: (_) => handleChange(path, option.value),
		disabled: !enabled,
		className: radioInput
	}), import_react.createElement("label", {
		htmlFor: option.value,
		className: radioLabel
	}, option.label)))), import_react.createElement("div", { className: divClassNames }, !isValid ? errors : showDescription ? description : null));
};
var RadioGroupControl = (props) => {
	return import_react.createElement(RadioGroup, { ...props });
};
var radioGroupControlTester = rankWith$1(3, and(isEnumControl, optionIs("format", "radio")));
var RadioGroupControl$1 = withVanillaControlProps(withJsonFormsEnumProps(RadioGroupControl));
var OneOfRadioGroupControl = (props) => {
	return import_react.createElement(RadioGroup, { ...props });
};
var oneOfRadioGroupControlTester = rankWith$1(3, and(isOneOfEnumControl, optionIs("format", "radio")));
var OneOfRadioGroupControl$1 = withVanillaControlProps(withJsonFormsOneOfEnumProps(OneOfRadioGroupControl));
var { convertToValidClassName: convertToValidClassName$1 } = Helpers;
var ArrayControl = ({ classNames, data, label, path, schema, errors, addItem, removeItems, moveUp, moveDown, uischema, uischemas, getStyleAsClassName, renderers, rootSchema, translations, enabled }) => {
	const controlElement = uischema;
	const childUiSchema = (0, import_react.useMemo)(() => findUISchema(uischemas, schema, uischema.scope, path, void 0, uischema, rootSchema), [
		uischemas,
		schema,
		uischema.scope,
		path,
		uischema,
		rootSchema
	]);
	const isValid = errors.length === 0;
	const divClassNames = [getStyleAsClassName("array.control.validation")].concat(isValid ? "" : getStyleAsClassName("array.control.validation.error")).join(" ");
	const buttonClassAdd = getStyleAsClassName("array.control.add");
	const labelClass = getStyleAsClassName("array.control.label");
	const childControlsClass = getStyleAsClassName("array.child.controls");
	const buttonClassUp = getStyleAsClassName("array.child.controls.up");
	const buttonClassDown = getStyleAsClassName("array.child.controls.down");
	const buttonClassDelete = getStyleAsClassName("array.child.controls.delete");
	const controlClass = [getStyleAsClassName("array.control"), convertToValidClassName$1(controlElement.scope)].join(" ");
	return import_react.createElement("div", { className: controlClass }, import_react.createElement("header", null, import_react.createElement("label", { className: labelClass }, label), import_react.createElement("button", {
		type: "button",
		className: buttonClassAdd,
		disabled: !enabled,
		onClick: addItem(path, createDefaultValue(schema, rootSchema))
	}, "Add to ", label)), import_react.createElement("div", { className: divClassNames }, errors), import_react.createElement("div", { className: classNames.children }, data ? (0, import_range.default)(0, data.length).map((index) => {
		const childPath = compose(path, `${index}`);
		return import_react.createElement("div", { key: index }, import_react.createElement(JsonFormsDispatch, {
			schema,
			uischema: childUiSchema || uischema,
			path: childPath,
			key: childPath,
			renderers
		}), import_react.createElement("div", { className: childControlsClass }, import_react.createElement("button", {
			type: "button",
			className: buttonClassUp,
			disabled: !enabled,
			"aria-label": translations.upAriaLabel,
			onClick: () => {
				moveUp(path, index)();
			}
		}, translations.up), import_react.createElement("button", {
			type: "button",
			className: buttonClassDown,
			disabled: !enabled,
			"aria-label": translations.downAriaLabel,
			onClick: () => {
				moveDown(path, index)();
			}
		}, translations.down), import_react.createElement("button", {
			type: "button",
			className: buttonClassDelete,
			disabled: !enabled,
			"aria-label": translations.removeAriaLabel,
			onClick: () => {
				if (window.confirm("Are you sure you wish to delete this item?")) removeItems(path, [index])();
			}
		}, translations.removeTooltip)));
	}) : import_react.createElement("p", null, translations.noDataMessage)));
};
var ArrayControlRenderer = ({ schema, uischema, data, path, rootSchema, uischemas, addItem, getStyle, getStyleAsClassName, removeItems, moveUp, moveDown, id, visible, enabled, errors, translations, arraySchema }) => {
	const controlElement = uischema;
	const labelDescription = Helpers.createLabelDescriptionFrom(controlElement, schema);
	const label = labelDescription.show ? labelDescription.text : "";
	const classNames = {
		wrapper: `control ${Helpers.convertToValidClassName(controlElement.scope)}`,
		fieldSet: getStyleAsClassName("array.layout"),
		button: getStyleAsClassName("array.button"),
		children: getStyleAsClassName("array.children")
	};
	return import_react.createElement(ArrayControl, {
		classNames,
		data,
		label,
		path,
		schema,
		arraySchema,
		errors,
		addItem,
		removeItems,
		moveUp,
		moveDown,
		uischema,
		uischemas,
		getStyleAsClassName,
		rootSchema,
		id,
		visible,
		enabled,
		getStyle,
		translations
	});
};
var ArrayControlRenderer$1 = withVanillaControlProps(withJsonFormsArrayControlProps(withTranslateProps(withArrayTranslationProps(ArrayControlRenderer))));
var arrayControlTester = rankWith$1(4, isObjectArrayWithNesting);
var isCategorization = (category) => category.type === "Categorization";
var categorizationTester = rankWith$1(1, and(uiTypeIs("Categorization"), (uischema) => {
	const hasCategory = (element) => {
		if ((0, import_isEmpty.default)(element.elements)) return false;
		return element.elements.map((elem) => isCategorization(elem) ? hasCategory(elem) : elem.type === "Category").reduce((prev, curr) => prev && curr, true);
	};
	return hasCategory(uischema);
}));
var getCategoryClassName = (category, selectedCategory) => selectedCategory === category ? "selected" : "";
var CategorizationList = ({ selectedCategory, elements, data, depth, onSelect, subcategoriesClassName, groupClassName, t, ajv, config }) => {
	const filteredElements = (0, import_react.useMemo)(() => {
		return elements.filter((category) => isVisible(category, data, void 0, ajv, config));
	}, [
		elements,
		data,
		ajv,
		config
	]);
	const categoryLabels = (0, import_react.useMemo)(() => filteredElements.map((cat) => deriveLabelForUISchemaElement(cat, t)), [filteredElements, t]);
	return import_react.createElement("ul", { className: subcategoriesClassName }, filteredElements.map((category, idx) => {
		if (isCategorization(category)) return import_react.createElement("li", {
			key: categoryLabels[idx],
			className: groupClassName
		}, import_react.createElement("span", null, categoryLabels[idx]), import_react.createElement(CategorizationList, {
			selectedCategory,
			elements: category.elements,
			data,
			ajv,
			config,
			depth: depth + 1,
			onSelect,
			subcategoriesClassName,
			groupClassName,
			t
		}));
		else return import_react.createElement("li", {
			key: categoryLabels[idx],
			onClick: onSelect(idx),
			className: getCategoryClassName(category, selectedCategory)
		}, import_react.createElement("span", null, categoryLabels[idx]));
	}));
};
var SingleCategory = ({ category, schema, path }) => import_react.createElement("div", { id: "categorization.detail" }, (category.elements || []).map((child, index) => import_react.createElement(JsonFormsDispatch, {
	key: `${path}-${index}`,
	uischema: child,
	schema,
	path
})));
var CategorizationRenderer = ({ data, uischema, schema, path, selected, t, visible, getStyleAsClassName, onChange, ajv, config }) => {
	const categorization = uischema;
	const elements = categorization.elements;
	const classNames = getStyleAsClassName("categorization");
	const masterClassNames = getStyleAsClassName("categorization.master");
	const detailClassNames = getStyleAsClassName("categorization.detail");
	const subcategoriesClassName = getStyleAsClassName("category.subcategories");
	const groupClassName = getStyleAsClassName("category.group");
	const [previousCategorization, setPreviousCategorization] = (0, import_react.useState)(uischema);
	const [activeCategory, setActiveCategory] = (0, import_react.useState)(selected ?? 0);
	const safeCategory = activeCategory >= categorization.elements.length ? 0 : activeCategory;
	if (categorization !== previousCategorization) {
		setActiveCategory(0);
		setPreviousCategorization(categorization);
	}
	const onCategorySelected = (categoryIndex) => () => {
		if (onChange) return onChange(categoryIndex, safeCategory);
		return setActiveCategory(categoryIndex);
	};
	return import_react.createElement("div", {
		className: classNames,
		hidden: visible === null || visible === void 0 ? false : !visible
	}, import_react.createElement("div", { className: masterClassNames }, import_react.createElement(CategorizationList, {
		elements,
		selectedCategory: elements[safeCategory],
		data,
		ajv,
		config,
		depth: 0,
		onSelect: onCategorySelected,
		subcategoriesClassName,
		groupClassName,
		t
	})), import_react.createElement("div", { className: detailClassNames }, import_react.createElement(SingleCategory, {
		category: elements[safeCategory],
		schema,
		path,
		key: safeCategory
	})));
};
var CategorizationRenderer$1 = withAjvProps(withVanillaControlProps(withTranslateProps(withJsonFormsLayoutProps(CategorizationRenderer))));
var labelRendererTester = rankWith$1(1, uiTypeIs("Label"));
var LabelRenderer = ({ text, visible, getStyleAsClassName }) => {
	const classNames = getStyleAsClassName("label-control");
	const isHidden = !visible;
	return import_react.createElement("label", {
		hidden: isHidden,
		className: classNames
	}, text);
};
var LabelRenderer$1 = withVanillaControlProps(withJsonFormsLabelProps(LabelRenderer));
var { convertToValidClassName } = Helpers;
var { or, isObjectArrayControl, isPrimitiveArrayControl, rankWith } = index;
var tableArrayControlTester = rankWith(3, or(isObjectArrayControl, isPrimitiveArrayControl));
var TableArrayControl = class extends import_react.Component {
	constructor() {
		super(...arguments);
		this.confirmDelete = (path, index) => {
			const p = path.substring(0, path.lastIndexOf("."));
			this.props.removeItems(p, [index])();
		};
	}
	render() {
		const { addItem, uischema, schema, rootSchema, path, data, visible, errors, label, getStyleAsClassName, childErrors, translations, enabled } = this.props;
		const controlElement = uischema;
		const tableClass = getStyleAsClassName("array.table.table");
		const labelClass = getStyleAsClassName("array.table.label");
		const buttonClass = getStyleAsClassName("array.table.button");
		const validationClass = getStyleAsClassName("array.table.validation");
		const controlClass = [getStyleAsClassName("array.table"), convertToValidClassName(controlElement.scope)].join(" ");
		const createControlElement = (key) => ({
			type: "Control",
			label: false,
			scope: schema.type === "object" ? `#/properties/${key}` : "#"
		});
		const isValid = errors.length === 0;
		const divClassNames = [validationClass].concat(isValid ? "" : getStyleAsClassName("array.table.validation.error")).join(" ");
		return import_react.createElement("div", {
			className: controlClass,
			hidden: !visible
		}, import_react.createElement("header", null, import_react.createElement("label", { className: labelClass }, label), import_react.createElement("button", {
			type: "button",
			disabled: !enabled,
			className: buttonClass,
			onClick: addItem(path, createDefaultValue(schema, rootSchema))
		}, translations.addTooltip)), import_react.createElement("div", { className: divClassNames }, !isValid ? errors : ""), import_react.createElement("table", { className: tableClass }, import_react.createElement("thead", null, import_react.createElement("tr", null, schema.properties ? (0, import_flow.default)(import_keys.default, (0, import_filter$1.default)((prop) => schema.properties[prop].type !== "array"), (0, import_map.default)((prop) => import_react.createElement("th", { key: prop }, schema.properties[prop].title ?? (0, import_startCase.default)(prop))))(schema.properties) : import_react.createElement("th", null, "Items"), import_react.createElement("th", null, "Valid"), import_react.createElement("th", null, "\xA0"))), import_react.createElement("tbody", null, !data || !Array.isArray(data) || data.length === 0 ? import_react.createElement("tr", null, import_react.createElement("td", null, translations.noDataMessage)) : data.map((_child, index) => {
			const childPath = Paths.compose(path, `${index}`);
			const errorsPerEntry = (0, import_filter.default)(childErrors, (error) => {
				return getControlPath(error).startsWith(childPath);
			});
			const validationClassName = getStyleAsClassName("array.validation");
			const errorValidationClassName = getStyleAsClassName("array.validation.error");
			const errorClassNames = errorsPerEntry ? [validationClassName].concat(errorValidationClassName).join(" ") : validationClassName;
			return import_react.createElement("tr", { key: childPath }, schema.properties ? (0, import_flow.default)(import_keys.default, (0, import_filter$1.default)((prop) => schema.properties[prop].type !== "array"), (0, import_map.default)((prop) => {
				const childPropPath = Paths.compose(childPath, prop.toString());
				return import_react.createElement("td", { key: childPropPath }, import_react.createElement(DispatchCell, {
					schema: Resolve.schema(schema, `#/properties/${encode(prop)}`, rootSchema),
					uischema: createControlElement(encode(prop)),
					path: childPath + "." + prop
				}));
			}))(schema.properties) : import_react.createElement("td", { key: Paths.compose(childPath, index.toString()) }, import_react.createElement(DispatchCell, {
				schema,
				uischema: createControlElement(),
				path: childPath
			})), import_react.createElement("td", null, errorsPerEntry ? import_react.createElement("span", { className: errorClassNames }, (0, import_join.default)(errorsPerEntry.map((e) => e.message), " and ")) : import_react.createElement("span", { className: errorClassNames }, "OK")), import_react.createElement("td", null, import_react.createElement("button", {
				type: "button",
				disabled: !enabled,
				"aria-label": translations.removeAriaLabel,
				onClick: () => {
					if (window.confirm(translations.deleteDialogMessage)) this.confirmDelete(childPath, index);
				}
			}, translations.removeTooltip)));
		}))));
	}
};
var TableArrayControl$1 = withVanillaControlProps(withJsonFormsArrayControlProps(withTranslateProps(withArrayTranslationProps(TableArrayControl))));
var BooleanCell = (props) => {
	const { data, className, id, enabled, uischema, path, handleChange } = props;
	return import_react.createElement("input", {
		type: "checkbox",
		checked: !!data,
		onChange: (ev) => handleChange(path, ev.target.checked),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus
	});
};
var booleanCellTester = rankWith$1(2, isBooleanControl);
var BooleanCell$1 = withJsonFormsCellProps(withVanillaBooleanCellProps(BooleanCell));
var DateCell = (props) => {
	const { data, className, id, enabled, uischema, path, handleChange } = props;
	return import_react.createElement("input", {
		type: "date",
		value: data || "",
		onChange: (ev) => handleChange(path, ev.target.value),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus
	});
};
var dateCellTester = rankWith$1(2, isDateControl);
var DateCell$1 = withJsonFormsCellProps(withVanillaCellProps(DateCell));
var DateTimeCell = (props) => {
	const { data, className, id, enabled, uischema, path, handleChange } = props;
	const toISOString = (inputDateTime) => {
		return inputDateTime === "" ? "" : inputDateTime + ":00.000Z";
	};
	return import_react.createElement("input", {
		type: "datetime-local",
		value: (data || "").substr(0, 16),
		onChange: (ev) => handleChange(path, toISOString(ev.target.value)),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus
	});
};
var dateTimeCellTester = rankWith$1(2, isDateTimeControl);
var DateTimeCell$1 = withJsonFormsCellProps(withVanillaCellProps(DateTimeCell));
var EnumCell = (props) => {
	const { data, className, id, enabled, schema, uischema, path, handleChange, options, t } = props;
	const noneOptionLabel = (0, import_react.useMemo)(() => t("enum.none", i18nDefaults["enum.none"], {
		schema,
		uischema,
		path
	}), [
		t,
		schema,
		uischema,
		path
	]);
	return import_react.createElement("select", {
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus,
		value: data || "",
		onChange: (ev) => handleChange(path, ev.target.selectedIndex === 0 ? void 0 : ev.target.value)
	}, [import_react.createElement("option", {
		value: "",
		key: "jsonforms.enum.none"
	}, noneOptionLabel)].concat(options.map((optionValue) => import_react.createElement("option", {
		value: optionValue.value,
		label: optionValue.label,
		key: optionValue.value
	}))));
};
var enumCellTester = rankWith$1(2, isEnumControl);
var EnumCell$1 = withJsonFormsEnumCellProps(withTranslateProps(withVanillaEnumCellProps(EnumCell)));
var toNumber$1 = (value) => value === "" ? void 0 : parseInt(value, 10);
var IntegerCell = (props) => {
	const { data, className, id, enabled, uischema, path, handleChange } = props;
	return import_react.createElement("input", {
		type: "number",
		step: "1",
		value: data ?? "",
		onChange: (ev) => handleChange(path, toNumber$1(ev.target.value)),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus
	});
};
var integerCellTester = rankWith$1(2, isIntegerControl);
var IntegerCell$1 = withJsonFormsCellProps(withVanillaCellProps(IntegerCell));
var toNumber = (value) => value === "" ? void 0 : Number(value);
var NumberCell = (props) => {
	const { data, className, id, enabled, uischema, path, handleChange } = props;
	return import_react.createElement("input", {
		type: "number",
		step: "0.1",
		value: data ?? "",
		onChange: (ev) => handleChange(path, toNumber(ev.target.value)),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus
	});
};
var numberCellTester = rankWith$1(2, isNumberControl);
var NumberCell$1 = withJsonFormsCellProps(withVanillaCellProps(NumberCell));
var NumberFormatCell = (props) => {
	const { className, id, enabled, uischema, path, handleChange, schema } = props;
	const maxLength = schema.maxLength;
	const formattedNumber = props.toFormatted(props.data);
	const onChange = (ev) => {
		const validStringNumber = props.fromFormatted(ev.currentTarget.value);
		handleChange(path, validStringNumber);
	};
	return import_react.createElement("input", {
		type: "text",
		value: formattedNumber,
		onChange,
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus,
		maxLength: uischema.options && uischema.options.restrict ? maxLength : void 0,
		size: uischema.options && uischema.options.trim ? maxLength : void 0
	});
};
rankWith$1(4, isNumberFormatControl);
withJsonFormsCellProps(withVanillaCellProps(NumberFormatCell));
var OneOfEnumCell = (props) => {
	const { data, className, id, enabled, schema, uischema, path, handleChange, options, t } = props;
	const noneOptionLabel = (0, import_react.useMemo)(() => t("enum.none", i18nDefaults["enum.none"], {
		schema,
		uischema,
		path
	}), [
		t,
		schema,
		uischema,
		path
	]);
	const noneOption = import_react.createElement("option", {
		value: "",
		key: "jsonforms.enum.none"
	}, noneOptionLabel);
	return import_react.createElement("select", {
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus,
		value: data || "",
		onChange: (ev) => handleChange(path, ev.target.selectedIndex === 0 ? void 0 : ev.target.value)
	}, (uischema.options?.hideEmptyOption === true ? [] : [noneOption]).concat(options.map((optionValue) => import_react.createElement("option", {
		value: optionValue.value,
		label: optionValue.label,
		key: optionValue.value
	}))));
};
var oneOfEnumCellTester = rankWith$1(2, isOneOfEnumControl);
var OneOfEnumCell$1 = withJsonFormsOneOfEnumCellProps(withTranslateProps(withVanillaEnumCellProps(OneOfEnumCell)));
var SliderCell = (props) => {
	const { data, className, id, enabled, uischema, schema, path, handleChange } = props;
	return import_react.createElement("div", { style: { display: "flex" } }, import_react.createElement("input", {
		type: "range",
		max: schema.maximum,
		min: schema.minimum,
		value: data || schema.default,
		onChange: (ev) => handleChange(path, Number(ev.target.value)),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus,
		style: { flex: "1" }
	}), import_react.createElement("label", { style: { marginLeft: "0.5em" } }, data || schema.default));
};
var sliderCellTester = rankWith$1(4, isRangeControl);
var SliderCell$1 = withJsonFormsCellProps(withVanillaCellProps(SliderCell));
var TextCell = (props) => {
	const { config, data, className, id, enabled, uischema, schema, path, handleChange } = props;
	const maxLength = schema.maxLength;
	const appliedUiSchemaOptions = (0, import_merge.default)({}, config, uischema.options);
	return import_react.createElement("input", {
		type: appliedUiSchemaOptions.format === "password" ? "password" : "text",
		value: data || "",
		onChange: (ev) => handleChange(path, ev.target.value === "" ? void 0 : ev.target.value),
		className,
		id,
		disabled: !enabled,
		autoFocus: appliedUiSchemaOptions.focus,
		placeholder: appliedUiSchemaOptions.placeholder,
		maxLength: appliedUiSchemaOptions.restrict ? maxLength : void 0,
		size: appliedUiSchemaOptions.trim ? maxLength : void 0
	});
};
var textCellTester = rankWith$1(1, isStringControl);
var TextCell$1 = withJsonFormsCellProps(withVanillaCellProps(TextCell));
var TextAreaCell = (props) => {
	const { data, className, id, enabled, config, uischema, path, handleChange } = props;
	const appliedUiSchemaOptions = (0, import_merge.default)({}, config, uischema.options);
	return import_react.createElement("textarea", {
		value: data || "",
		onChange: (ev) => handleChange(path, ev.target.value === "" ? void 0 : ev.target.value),
		className,
		id,
		disabled: !enabled,
		autoFocus: appliedUiSchemaOptions.focus,
		placeholder: appliedUiSchemaOptions.placeholder
	});
};
var textAreaCellTester = rankWith$1(2, isMultiLineControl);
var TextAreaCell$1 = withJsonFormsCellProps(withVanillaCellProps(TextAreaCell));
var appendSecondsIfNecessary = (value) => {
	if (typeof value === "string") {
		const splitValue = value.split(":");
		if (splitValue.length === 2) splitValue.push("00");
		return splitValue.join(":");
	}
	return value;
};
var TimeCell = (props) => {
	const { data, className, id, enabled, uischema, path, handleChange } = props;
	return import_react.createElement("input", {
		type: "time",
		value: data || "",
		onChange: (ev) => handleChange(path, appendSecondsIfNecessary(ev.target.value)),
		className,
		id,
		disabled: !enabled,
		autoFocus: uischema.options && uischema.options.focus
	});
};
var timeCellTester = rankWith$1(2, isTimeControl);
var TimeCell$1 = withJsonFormsCellProps(withVanillaCellProps(TimeCell));
var renderChildren = (layout, schema, className, path, enabled) => {
	if ((0, import_isEmpty.default)(layout.elements)) return [];
	const { renderers, cells } = useJsonForms();
	return layout.elements.map((child, index) => {
		return import_react.createElement("div", {
			className,
			key: `${path}-${index}`
		}, import_react.createElement(JsonFormsDispatch, {
			renderers,
			cells,
			uischema: child,
			schema,
			path,
			enabled
		}));
	});
};
var groupTester = rankWith$1(1, uiTypeIs("Group"));
var GroupLayoutRenderer = (props) => {
	const { data: _data, ...otherProps } = props;
	return import_react.createElement(GroupLayoutRendererComponent, { ...otherProps });
};
var GroupLayoutRendererComponent = import_react.memo(function GroupLayoutRendererComponent({ schema, uischema, path, enabled, visible, label, getStyle, getStyleAsClassName }) {
	const group = uischema;
	const elementsSize = group.elements ? group.elements.length : 0;
	const classNames = getStyleAsClassName("group.layout");
	const childClassNames = ["group-layout-item"].concat(getStyle("group.layout.item", elementsSize)).join(" ");
	return import_react.createElement("fieldset", {
		className: classNames,
		hidden: visible === void 0 || visible === null ? false : !visible
	}, !(0, import_isEmpty.default)(label) ? import_react.createElement("legend", { className: getStyleAsClassName("group.label") }, label) : "", renderChildren(group, schema, childClassNames, path, enabled));
});
var GroupLayout = withVanillaControlProps(withJsonFormsLayoutProps(GroupLayoutRenderer));
var JsonFormsLayout = ({ className, children, visible }) => {
	return import_react.createElement("div", {
		className,
		hidden: visible === void 0 || visible === null ? false : !visible
	}, children);
};
var horizontalLayoutTester = rankWith$1(1, uiTypeIs("HorizontalLayout"));
var HorizontalLayoutRenderer = (props) => {
	const { data: _data, ...otherProps } = props;
	return import_react.createElement(HorizontalLayoutRendererComponent, { ...otherProps });
};
var HorizontalLayoutRendererComponent = import_react.memo(function HorizontalLayoutRendererComponent({ schema, uischema, getStyle, getStyleAsClassName, enabled, visible, path }) {
	const horizontalLayout = uischema;
	const elementsSize = horizontalLayout.elements ? horizontalLayout.elements.length : 0;
	const layoutClassName = getStyleAsClassName("horizontal.layout");
	const childClassNames = ["horizontal-layout-item"].concat(getStyle("horizontal.layout.item", elementsSize)).join(" ");
	return import_react.createElement(JsonFormsLayout, {
		className: layoutClassName,
		visible,
		enabled,
		path,
		uischema,
		schema,
		getStyle,
		getStyleAsClassName
	}, renderChildren(horizontalLayout, schema, childClassNames, path, enabled));
});
var HorizontalLayout = withVanillaControlProps(withJsonFormsLayoutProps(HorizontalLayoutRenderer, false));
var verticalLayoutTester = rankWith$1(1, uiTypeIs("VerticalLayout"));
var VerticalLayoutRenderer = (props) => {
	const { data: _data, ...otherProps } = props;
	return import_react.createElement(VerticalLayoutRendererComponent, { ...otherProps });
};
var VerticalLayoutRendererComponent = import_react.memo(function VerticalLayoutRendererComponent({ schema, uischema, path, visible, enabled, getStyle, getStyleAsClassName }) {
	const verticalLayout = uischema;
	const elementsSize = verticalLayout.elements ? verticalLayout.elements.length : 0;
	const layoutClassName = getStyleAsClassName("vertical.layout");
	const childClassNames = ["vertical-layout-item"].concat(getStyle("vertical.layout.item", elementsSize)).join(" ");
	return import_react.createElement(JsonFormsLayout, {
		className: layoutClassName,
		uischema,
		schema,
		visible,
		enabled,
		path,
		getStyle,
		getStyleAsClassName
	}, renderChildren(verticalLayout, schema, childClassNames, path, enabled));
});
var VerticalLayout = withVanillaControlProps(withJsonFormsLayoutProps(VerticalLayoutRenderer, false));
var vanillaRenderers = [
	{
		tester: inputControlTester,
		renderer: InputControl$1
	},
	{
		tester: radioGroupControlTester,
		renderer: RadioGroupControl$1
	},
	{
		tester: oneOfRadioGroupControlTester,
		renderer: OneOfRadioGroupControl$1
	},
	{
		tester: arrayControlTester,
		renderer: ArrayControlRenderer$1
	},
	{
		tester: labelRendererTester,
		renderer: LabelRenderer$1
	},
	{
		tester: categorizationTester,
		renderer: CategorizationRenderer$1
	},
	{
		tester: tableArrayControlTester,
		renderer: TableArrayControl$1
	},
	{
		tester: groupTester,
		renderer: GroupLayout
	},
	{
		tester: verticalLayoutTester,
		renderer: VerticalLayout
	},
	{
		tester: horizontalLayoutTester,
		renderer: HorizontalLayout
	}
];
var vanillaCells = [
	{
		tester: booleanCellTester,
		cell: BooleanCell$1
	},
	{
		tester: dateCellTester,
		cell: DateCell$1
	},
	{
		tester: dateTimeCellTester,
		cell: DateTimeCell$1
	},
	{
		tester: enumCellTester,
		cell: EnumCell$1
	},
	{
		tester: integerCellTester,
		cell: IntegerCell$1
	},
	{
		tester: numberCellTester,
		cell: NumberCell$1
	},
	{
		tester: oneOfEnumCellTester,
		cell: OneOfEnumCell$1
	},
	{
		tester: sliderCellTester,
		cell: SliderCell$1
	},
	{
		tester: textAreaCellTester,
		cell: TextAreaCell$1
	},
	{
		tester: textCellTester,
		cell: TextCell$1
	},
	{
		tester: timeCellTester,
		cell: TimeCell$1
	}
];
//#endregion
export { vanillaRenderers as n, vanillaCells as t };
