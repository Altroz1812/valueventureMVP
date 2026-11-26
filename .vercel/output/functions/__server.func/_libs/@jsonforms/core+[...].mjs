import { a as __toCommonJS, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/lodash/_freeGlobal.js
var require__freeGlobal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof global == "object" && global && global.Object === Object && global;
}));
//#endregion
//#region node_modules/lodash/_root.js
var require__root = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var freeGlobal = require__freeGlobal();
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	module.exports = freeGlobal || freeSelf || Function("return this")();
}));
//#endregion
//#region node_modules/lodash/_Symbol.js
var require__Symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root().Symbol;
}));
//#endregion
//#region node_modules/lodash/_getRawTag.js
var require__getRawTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = objectProto.toString;
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
		try {
			value[symToStringTag] = void 0;
			var unmasked = true;
		} catch (e) {}
		var result = nativeObjectToString.call(value);
		if (unmasked) if (isOwn) value[symToStringTag] = tag;
		else delete value[symToStringTag];
		return result;
	}
	module.exports = getRawTag;
}));
//#endregion
//#region node_modules/lodash/_objectToString.js
var require__objectToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = Object.prototype.toString;
	/**
	* Converts `value` to a string using `Object.prototype.toString`.
	*
	* @private
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	*/
	function objectToString(value) {
		return nativeObjectToString.call(value);
	}
	module.exports = objectToString;
}));
//#endregion
//#region node_modules/lodash/_baseGetTag.js
var require__baseGetTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var getRawTag = require__getRawTag();
	var objectToString = require__objectToString();
	/** `Object#toString` result references. */
	var nullTag = "[object Null]";
	var undefinedTag = "[object Undefined]";
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}
	module.exports = baseGetTag;
}));
//#endregion
//#region node_modules/lodash/isObjectLike.js
var require_isObjectLike = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return value != null && typeof value == "object";
	}
	module.exports = isObjectLike;
}));
//#endregion
//#region node_modules/lodash/isSymbol.js
var require_isSymbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var symbolTag = "[object Symbol]";
	/**
	* Checks if `value` is classified as a `Symbol` primitive or object.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	* @example
	*
	* _.isSymbol(Symbol.iterator);
	* // => true
	*
	* _.isSymbol('abc');
	* // => false
	*/
	function isSymbol(value) {
		return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
	}
	module.exports = isSymbol;
}));
//#endregion
//#region node_modules/lodash/_baseExtremum.js
var require__baseExtremum = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isSymbol = require_isSymbol();
	/**
	* The base implementation of methods like `_.max` and `_.min` which accepts a
	* `comparator` to determine the extremum value.
	*
	* @private
	* @param {Array} array The array to iterate over.
	* @param {Function} iteratee The iteratee invoked per iteration.
	* @param {Function} comparator The comparator used to compare values.
	* @returns {*} Returns the extremum value.
	*/
	function baseExtremum(array, iteratee, comparator) {
		var index = -1, length = array.length;
		while (++index < length) {
			var value = array[index], current = iteratee(value);
			if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) var computed = current, result = value;
		}
		return result;
	}
	module.exports = baseExtremum;
}));
//#endregion
//#region node_modules/lodash/_baseGt.js
var require__baseGt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.gt` which doesn't coerce arguments.
	*
	* @private
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if `value` is greater than `other`,
	*  else `false`.
	*/
	function baseGt(value, other) {
		return value > other;
	}
	module.exports = baseGt;
}));
//#endregion
//#region node_modules/lodash/_listCacheClear.js
var require__listCacheClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Removes all key-value entries from the list cache.
	*
	* @private
	* @name clear
	* @memberOf ListCache
	*/
	function listCacheClear() {
		this.__data__ = [];
		this.size = 0;
	}
	module.exports = listCacheClear;
}));
//#endregion
//#region node_modules/lodash/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Performs a
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* comparison between two values to determine if they are equivalent.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.eq(object, object);
	* // => true
	*
	* _.eq(object, other);
	* // => false
	*
	* _.eq('a', 'a');
	* // => true
	*
	* _.eq('a', Object('a'));
	* // => false
	*
	* _.eq(NaN, NaN);
	* // => true
	*/
	function eq(value, other) {
		return value === other || value !== value && other !== other;
	}
	module.exports = eq;
}));
//#endregion
//#region node_modules/lodash/_assocIndexOf.js
var require__assocIndexOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var eq = require_eq();
	/**
	* Gets the index at which the `key` is found in `array` of key-value pairs.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} key The key to search for.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) if (eq(array[length][0], key)) return length;
		return -1;
	}
	module.exports = assocIndexOf;
}));
//#endregion
//#region node_modules/lodash/_listCacheDelete.js
var require__listCacheDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/** Built-in value references. */
	var splice = Array.prototype.splice;
	/**
	* Removes `key` and its value from the list cache.
	*
	* @private
	* @name delete
	* @memberOf ListCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function listCacheDelete(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) return false;
		if (index == data.length - 1) data.pop();
		else splice.call(data, index, 1);
		--this.size;
		return true;
	}
	module.exports = listCacheDelete;
}));
//#endregion
//#region node_modules/lodash/_listCacheGet.js
var require__listCacheGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/**
	* Gets the list cache value for `key`.
	*
	* @private
	* @name get
	* @memberOf ListCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function listCacheGet(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		return index < 0 ? void 0 : data[index][1];
	}
	module.exports = listCacheGet;
}));
//#endregion
//#region node_modules/lodash/_listCacheHas.js
var require__listCacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/**
	* Checks if a list cache value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf ListCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}
	module.exports = listCacheHas;
}));
//#endregion
//#region node_modules/lodash/_listCacheSet.js
var require__listCacheSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assocIndexOf = require__assocIndexOf();
	/**
	* Sets the list cache `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf ListCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the list cache instance.
	*/
	function listCacheSet(key, value) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else data[index][1] = value;
		return this;
	}
	module.exports = listCacheSet;
}));
//#endregion
//#region node_modules/lodash/_ListCache.js
var require__ListCache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var listCacheClear = require__listCacheClear();
	var listCacheDelete = require__listCacheDelete();
	var listCacheGet = require__listCacheGet();
	var listCacheHas = require__listCacheHas();
	var listCacheSet = require__listCacheSet();
	/**
	* Creates an list cache object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function ListCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	module.exports = ListCache;
}));
//#endregion
//#region node_modules/lodash/_stackClear.js
var require__stackClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ListCache = require__ListCache();
	/**
	* Removes all key-value entries from the stack.
	*
	* @private
	* @name clear
	* @memberOf Stack
	*/
	function stackClear() {
		this.__data__ = new ListCache();
		this.size = 0;
	}
	module.exports = stackClear;
}));
//#endregion
//#region node_modules/lodash/_stackDelete.js
var require__stackDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Removes `key` and its value from the stack.
	*
	* @private
	* @name delete
	* @memberOf Stack
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function stackDelete(key) {
		var data = this.__data__, result = data["delete"](key);
		this.size = data.size;
		return result;
	}
	module.exports = stackDelete;
}));
//#endregion
//#region node_modules/lodash/_stackGet.js
var require__stackGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the stack value for `key`.
	*
	* @private
	* @name get
	* @memberOf Stack
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function stackGet(key) {
		return this.__data__.get(key);
	}
	module.exports = stackGet;
}));
//#endregion
//#region node_modules/lodash/_stackHas.js
var require__stackHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if a stack value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Stack
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function stackHas(key) {
		return this.__data__.has(key);
	}
	module.exports = stackHas;
}));
//#endregion
//#region node_modules/lodash/isObject.js
var require_isObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is the
	* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an object, else `false`.
	* @example
	*
	* _.isObject({});
	* // => true
	*
	* _.isObject([1, 2, 3]);
	* // => true
	*
	* _.isObject(_.noop);
	* // => true
	*
	* _.isObject(null);
	* // => false
	*/
	function isObject(value) {
		var type = typeof value;
		return value != null && (type == "object" || type == "function");
	}
	module.exports = isObject;
}));
//#endregion
//#region node_modules/lodash/isFunction.js
var require_isFunction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObject = require_isObject();
	/** `Object#toString` result references. */
	var asyncTag = "[object AsyncFunction]";
	var funcTag = "[object Function]";
	var genTag = "[object GeneratorFunction]";
	var proxyTag = "[object Proxy]";
	/**
	* Checks if `value` is classified as a `Function` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a function, else `false`.
	* @example
	*
	* _.isFunction(_);
	* // => true
	*
	* _.isFunction(/abc/);
	* // => false
	*/
	function isFunction(value) {
		if (!isObject(value)) return false;
		var tag = baseGetTag(value);
		return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	module.exports = isFunction;
}));
//#endregion
//#region node_modules/lodash/_coreJsData.js
var require__coreJsData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root()["__core-js_shared__"];
}));
//#endregion
//#region node_modules/lodash/_isMasked.js
var require__isMasked = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var coreJsData = require__coreJsData();
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
	/**
	* Checks if `func` has its source masked.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` is masked, else `false`.
	*/
	function isMasked(func) {
		return !!maskSrcKey && maskSrcKey in func;
	}
	module.exports = isMasked;
}));
//#endregion
//#region node_modules/lodash/_toSource.js
var require__toSource = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;
	/**
	* Converts `func` to its source code.
	*
	* @private
	* @param {Function} func The function to convert.
	* @returns {string} Returns the source code.
	*/
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString.call(func);
			} catch (e) {}
			try {
				return func + "";
			} catch (e) {}
		}
		return "";
	}
	module.exports = toSource;
}));
//#endregion
//#region node_modules/lodash/_baseIsNative.js
var require__baseIsNative = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isFunction = require_isFunction();
	var isMasked = require__isMasked();
	var isObject = require_isObject();
	var toSource = require__toSource();
	/**
	* Used to match `RegExp`
	* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	*/
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/** Used to detect if a method is native. */
	var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	/**
	* The base implementation of `_.isNative` without bad shim checks.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a native function,
	*  else `false`.
	*/
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) return false;
		return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
	}
	module.exports = baseIsNative;
}));
//#endregion
//#region node_modules/lodash/_getValue.js
var require__getValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the value at `key` of `object`.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function getValue(object, key) {
		return object == null ? void 0 : object[key];
	}
	module.exports = getValue;
}));
//#endregion
//#region node_modules/lodash/_getNative.js
var require__getNative = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsNative = require__baseIsNative();
	var getValue = require__getValue();
	/**
	* Gets the native function at `key` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the method to get.
	* @returns {*} Returns the function if it's native, else `undefined`.
	*/
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : void 0;
	}
	module.exports = getNative;
}));
//#endregion
//#region node_modules/lodash/_Map.js
var require__Map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Map");
}));
//#endregion
//#region node_modules/lodash/_nativeCreate.js
var require__nativeCreate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(Object, "create");
}));
//#endregion
//#region node_modules/lodash/_hashClear.js
var require__hashClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/**
	* Removes all key-value entries from the hash.
	*
	* @private
	* @name clear
	* @memberOf Hash
	*/
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}
	module.exports = hashClear;
}));
//#endregion
//#region node_modules/lodash/_hashDelete.js
var require__hashDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Removes `key` and its value from the hash.
	*
	* @private
	* @name delete
	* @memberOf Hash
	* @param {Object} hash The hash to modify.
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function hashDelete(key) {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}
	module.exports = hashDelete;
}));
//#endregion
//#region node_modules/lodash/_hashGet.js
var require__hashGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Gets the hash value for `key`.
	*
	* @private
	* @name get
	* @memberOf Hash
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? void 0 : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : void 0;
	}
	module.exports = hashGet;
}));
//#endregion
//#region node_modules/lodash/_hashHas.js
var require__hashHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Checks if a hash value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Hash
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
	}
	module.exports = hashHas;
}));
//#endregion
//#region node_modules/lodash/_hashSet.js
var require__hashSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCreate = require__nativeCreate();
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/**
	* Sets the hash `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Hash
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the hash instance.
	*/
	function hashSet(key, value) {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
		return this;
	}
	module.exports = hashSet;
}));
//#endregion
//#region node_modules/lodash/_Hash.js
var require__Hash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hashClear = require__hashClear();
	var hashDelete = require__hashDelete();
	var hashGet = require__hashGet();
	var hashHas = require__hashHas();
	var hashSet = require__hashSet();
	/**
	* Creates a hash object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Hash(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	module.exports = Hash;
}));
//#endregion
//#region node_modules/lodash/_mapCacheClear.js
var require__mapCacheClear = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Hash = require__Hash();
	var ListCache = require__ListCache();
	var Map = require__Map();
	/**
	* Removes all key-value entries from the map.
	*
	* @private
	* @name clear
	* @memberOf MapCache
	*/
	function mapCacheClear() {
		this.size = 0;
		this.__data__ = {
			"hash": new Hash(),
			"map": new (Map || ListCache)(),
			"string": new Hash()
		};
	}
	module.exports = mapCacheClear;
}));
//#endregion
//#region node_modules/lodash/_isKeyable.js
var require__isKeyable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is suitable for use as unique object key.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	*/
	function isKeyable(value) {
		var type = typeof value;
		return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
	}
	module.exports = isKeyable;
}));
//#endregion
//#region node_modules/lodash/_getMapData.js
var require__getMapData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isKeyable = require__isKeyable();
	/**
	* Gets the data for `map`.
	*
	* @private
	* @param {Object} map The map to query.
	* @param {string} key The reference key.
	* @returns {*} Returns the map data.
	*/
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
	}
	module.exports = getMapData;
}));
//#endregion
//#region node_modules/lodash/_mapCacheDelete.js
var require__mapCacheDelete = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Removes `key` and its value from the map.
	*
	* @private
	* @name delete
	* @memberOf MapCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function mapCacheDelete(key) {
		var result = getMapData(this, key)["delete"](key);
		this.size -= result ? 1 : 0;
		return result;
	}
	module.exports = mapCacheDelete;
}));
//#endregion
//#region node_modules/lodash/_mapCacheGet.js
var require__mapCacheGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Gets the map value for `key`.
	*
	* @private
	* @name get
	* @memberOf MapCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}
	module.exports = mapCacheGet;
}));
//#endregion
//#region node_modules/lodash/_mapCacheHas.js
var require__mapCacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Checks if a map value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf MapCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}
	module.exports = mapCacheHas;
}));
//#endregion
//#region node_modules/lodash/_mapCacheSet.js
var require__mapCacheSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getMapData = require__getMapData();
	/**
	* Sets the map `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf MapCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the map cache instance.
	*/
	function mapCacheSet(key, value) {
		var data = getMapData(this, key), size = data.size;
		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}
	module.exports = mapCacheSet;
}));
//#endregion
//#region node_modules/lodash/_MapCache.js
var require__MapCache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var mapCacheClear = require__mapCacheClear();
	var mapCacheDelete = require__mapCacheDelete();
	var mapCacheGet = require__mapCacheGet();
	var mapCacheHas = require__mapCacheHas();
	var mapCacheSet = require__mapCacheSet();
	/**
	* Creates a map cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function MapCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	module.exports = MapCache;
}));
//#endregion
//#region node_modules/lodash/_stackSet.js
var require__stackSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ListCache = require__ListCache();
	var Map = require__Map();
	var MapCache = require__MapCache();
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	/**
	* Sets the stack `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Stack
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the stack cache instance.
	*/
	function stackSet(key, value) {
		var data = this.__data__;
		if (data instanceof ListCache) {
			var pairs = data.__data__;
			if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
				pairs.push([key, value]);
				this.size = ++data.size;
				return this;
			}
			data = this.__data__ = new MapCache(pairs);
		}
		data.set(key, value);
		this.size = data.size;
		return this;
	}
	module.exports = stackSet;
}));
//#endregion
//#region node_modules/lodash/_Stack.js
var require__Stack = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ListCache = require__ListCache();
	var stackClear = require__stackClear();
	var stackDelete = require__stackDelete();
	var stackGet = require__stackGet();
	var stackHas = require__stackHas();
	var stackSet = require__stackSet();
	/**
	* Creates a stack cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Stack(entries) {
		var data = this.__data__ = new ListCache(entries);
		this.size = data.size;
	}
	Stack.prototype.clear = stackClear;
	Stack.prototype["delete"] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	module.exports = Stack;
}));
//#endregion
//#region node_modules/lodash/_setCacheAdd.js
var require__setCacheAdd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/**
	* Adds `value` to the array cache.
	*
	* @private
	* @name add
	* @memberOf SetCache
	* @alias push
	* @param {*} value The value to cache.
	* @returns {Object} Returns the cache instance.
	*/
	function setCacheAdd(value) {
		this.__data__.set(value, HASH_UNDEFINED);
		return this;
	}
	module.exports = setCacheAdd;
}));
//#endregion
//#region node_modules/lodash/_setCacheHas.js
var require__setCacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is in the array cache.
	*
	* @private
	* @name has
	* @memberOf SetCache
	* @param {*} value The value to search for.
	* @returns {boolean} Returns `true` if `value` is found, else `false`.
	*/
	function setCacheHas(value) {
		return this.__data__.has(value);
	}
	module.exports = setCacheHas;
}));
//#endregion
//#region node_modules/lodash/_SetCache.js
var require__SetCache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MapCache = require__MapCache();
	var setCacheAdd = require__setCacheAdd();
	var setCacheHas = require__setCacheHas();
	/**
	*
	* Creates an array cache object to store unique values.
	*
	* @private
	* @constructor
	* @param {Array} [values] The values to cache.
	*/
	function SetCache(values) {
		var index = -1, length = values == null ? 0 : values.length;
		this.__data__ = new MapCache();
		while (++index < length) this.add(values[index]);
	}
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	module.exports = SetCache;
}));
//#endregion
//#region node_modules/lodash/_arraySome.js
var require__arraySome = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.some` for arrays without support for iteratee
	* shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {boolean} Returns `true` if any element passes the predicate check,
	*  else `false`.
	*/
	function arraySome(array, predicate) {
		var index = -1, length = array == null ? 0 : array.length;
		while (++index < length) if (predicate(array[index], index, array)) return true;
		return false;
	}
	module.exports = arraySome;
}));
//#endregion
//#region node_modules/lodash/_cacheHas.js
var require__cacheHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if a `cache` value for `key` exists.
	*
	* @private
	* @param {Object} cache The cache to query.
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function cacheHas(cache, key) {
		return cache.has(key);
	}
	module.exports = cacheHas;
}));
//#endregion
//#region node_modules/lodash/_equalArrays.js
var require__equalArrays = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SetCache = require__SetCache();
	var arraySome = require__arraySome();
	var cacheHas = require__cacheHas();
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	var COMPARE_UNORDERED_FLAG = 2;
	/**
	* A specialized version of `baseIsEqualDeep` for arrays with support for
	* partial deep comparisons.
	*
	* @private
	* @param {Array} array The array to compare.
	* @param {Array} other The other array to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `array` and `other` objects.
	* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	*/
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
		var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
		if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
		var arrStacked = stack.get(array);
		var othStacked = stack.get(other);
		if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
		var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
		stack.set(array, other);
		stack.set(other, array);
		while (++index < arrLength) {
			var arrValue = array[index], othValue = other[index];
			if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
			if (compared !== void 0) {
				if (compared) continue;
				result = false;
				break;
			}
			if (seen) {
				if (!arraySome(other, function(othValue, othIndex) {
					if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
				})) {
					result = false;
					break;
				}
			} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
				result = false;
				break;
			}
		}
		stack["delete"](array);
		stack["delete"](other);
		return result;
	}
	module.exports = equalArrays;
}));
//#endregion
//#region node_modules/lodash/_Uint8Array.js
var require__Uint8Array = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__root().Uint8Array;
}));
//#endregion
//#region node_modules/lodash/_mapToArray.js
var require__mapToArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Converts `map` to its key-value pairs.
	*
	* @private
	* @param {Object} map The map to convert.
	* @returns {Array} Returns the key-value pairs.
	*/
	function mapToArray(map) {
		var index = -1, result = Array(map.size);
		map.forEach(function(value, key) {
			result[++index] = [key, value];
		});
		return result;
	}
	module.exports = mapToArray;
}));
//#endregion
//#region node_modules/lodash/_setToArray.js
var require__setToArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Converts `set` to an array of its values.
	*
	* @private
	* @param {Object} set The set to convert.
	* @returns {Array} Returns the values.
	*/
	function setToArray(set) {
		var index = -1, result = Array(set.size);
		set.forEach(function(value) {
			result[++index] = value;
		});
		return result;
	}
	module.exports = setToArray;
}));
//#endregion
//#region node_modules/lodash/_equalByTag.js
var require__equalByTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var Uint8Array = require__Uint8Array();
	var eq = require_eq();
	var equalArrays = require__equalArrays();
	var mapToArray = require__mapToArray();
	var setToArray = require__setToArray();
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	var COMPARE_UNORDERED_FLAG = 2;
	/** `Object#toString` result references. */
	var boolTag = "[object Boolean]";
	var dateTag = "[object Date]";
	var errorTag = "[object Error]";
	var mapTag = "[object Map]";
	var numberTag = "[object Number]";
	var regexpTag = "[object RegExp]";
	var setTag = "[object Set]";
	var stringTag = "[object String]";
	var symbolTag = "[object Symbol]";
	var arrayBufferTag = "[object ArrayBuffer]";
	var dataViewTag = "[object DataView]";
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0;
	var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
	/**
	* A specialized version of `baseIsEqualDeep` for comparing objects of
	* the same `toStringTag`.
	*
	* **Note:** This function only supports comparing values with tags of
	* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {string} tag The `toStringTag` of the objects to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
		switch (tag) {
			case dataViewTag:
				if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
				object = object.buffer;
				other = other.buffer;
			case arrayBufferTag:
				if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
				return true;
			case boolTag:
			case dateTag:
			case numberTag: return eq(+object, +other);
			case errorTag: return object.name == other.name && object.message == other.message;
			case regexpTag:
			case stringTag: return object == other + "";
			case mapTag: var convert = mapToArray;
			case setTag:
				var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
				convert || (convert = setToArray);
				if (object.size != other.size && !isPartial) return false;
				var stacked = stack.get(object);
				if (stacked) return stacked == other;
				bitmask |= COMPARE_UNORDERED_FLAG;
				stack.set(object, other);
				var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
				stack["delete"](object);
				return result;
			case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
		}
		return false;
	}
	module.exports = equalByTag;
}));
//#endregion
//#region node_modules/lodash/_arrayPush.js
var require__arrayPush = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Appends the elements of `values` to `array`.
	*
	* @private
	* @param {Array} array The array to modify.
	* @param {Array} values The values to append.
	* @returns {Array} Returns `array`.
	*/
	function arrayPush(array, values) {
		var index = -1, length = values.length, offset = array.length;
		while (++index < length) array[offset + index] = values[index];
		return array;
	}
	module.exports = arrayPush;
}));
//#endregion
//#region node_modules/lodash/isArray.js
var require_isArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Array.isArray;
}));
//#endregion
//#region node_modules/lodash/_baseGetAllKeys.js
var require__baseGetAllKeys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayPush = require__arrayPush();
	var isArray = require_isArray();
	/**
	* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	* `keysFunc` and `symbolsFunc` to get the enumerable property names and
	* symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Function} keysFunc The function to get the keys of `object`.
	* @param {Function} symbolsFunc The function to get the symbols of `object`.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
		var result = keysFunc(object);
		return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}
	module.exports = baseGetAllKeys;
}));
//#endregion
//#region node_modules/lodash/_arrayFilter.js
var require__arrayFilter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.filter` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {Array} Returns the new filtered array.
	*/
	function arrayFilter(array, predicate) {
		var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
		while (++index < length) {
			var value = array[index];
			if (predicate(value, index, array)) result[resIndex++] = value;
		}
		return result;
	}
	module.exports = arrayFilter;
}));
//#endregion
//#region node_modules/lodash/stubArray.js
var require_stubArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This method returns a new empty array.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {Array} Returns the new empty array.
	* @example
	*
	* var arrays = _.times(2, _.stubArray);
	*
	* console.log(arrays);
	* // => [[], []]
	*
	* console.log(arrays[0] === arrays[1]);
	* // => false
	*/
	function stubArray() {
		return [];
	}
	module.exports = stubArray;
}));
//#endregion
//#region node_modules/lodash/_getSymbols.js
var require__getSymbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayFilter = require__arrayFilter();
	var stubArray = require_stubArray();
	/** Built-in value references. */
	var propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
	var nativeGetSymbols = Object.getOwnPropertySymbols;
	module.exports = !nativeGetSymbols ? stubArray : function(object) {
		if (object == null) return [];
		object = Object(object);
		return arrayFilter(nativeGetSymbols(object), function(symbol) {
			return propertyIsEnumerable.call(object, symbol);
		});
	};
}));
//#endregion
//#region node_modules/lodash/_baseTimes.js
var require__baseTimes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.times` without support for iteratee shorthands
	* or max array length checks.
	*
	* @private
	* @param {number} n The number of times to invoke `iteratee`.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the array of results.
	*/
	function baseTimes(n, iteratee) {
		var index = -1, result = Array(n);
		while (++index < n) result[index] = iteratee(index);
		return result;
	}
	module.exports = baseTimes;
}));
//#endregion
//#region node_modules/lodash/_baseIsArguments.js
var require__baseIsArguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]";
	/**
	* The base implementation of `_.isArguments`.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an `arguments` object,
	*/
	function baseIsArguments(value) {
		return isObjectLike(value) && baseGetTag(value) == argsTag;
	}
	module.exports = baseIsArguments;
}));
//#endregion
//#region node_modules/lodash/isArguments.js
var require_isArguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsArguments = require__baseIsArguments();
	var isObjectLike = require_isObjectLike();
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	module.exports = baseIsArguments(function() {
		return arguments;
	}()) ? baseIsArguments : function(value) {
		return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
	};
}));
//#endregion
//#region node_modules/lodash/stubFalse.js
var require_stubFalse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This method returns `false`.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {boolean} Returns `false`.
	* @example
	*
	* _.times(2, _.stubFalse);
	* // => [false, false]
	*/
	function stubFalse() {
		return false;
	}
	module.exports = stubFalse;
}));
//#endregion
//#region node_modules/lodash/isBuffer.js
var require_isBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var root = require__root();
	var stubFalse = require_stubFalse();
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	/** Built-in value references. */
	var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0;
	module.exports = (Buffer ? Buffer.isBuffer : void 0) || stubFalse;
}));
//#endregion
//#region node_modules/lodash/_isIndex.js
var require__isIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	/**
	* Checks if `value` is a valid array-like index.
	*
	* @private
	* @param {*} value The value to check.
	* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	*/
	function isIndex(value, length) {
		var type = typeof value;
		length = length == null ? MAX_SAFE_INTEGER : length;
		return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	}
	module.exports = isIndex;
}));
//#endregion
//#region node_modules/lodash/isLength.js
var require_isLength = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	/**
	* Checks if `value` is a valid array-like length.
	*
	* **Note:** This method is loosely based on
	* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	* @example
	*
	* _.isLength(3);
	* // => true
	*
	* _.isLength(Number.MIN_VALUE);
	* // => false
	*
	* _.isLength(Infinity);
	* // => false
	*
	* _.isLength('3');
	* // => false
	*/
	function isLength(value) {
		return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	module.exports = isLength;
}));
//#endregion
//#region node_modules/lodash/_baseIsTypedArray.js
var require__baseIsTypedArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isLength = require_isLength();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]";
	var arrayTag = "[object Array]";
	var boolTag = "[object Boolean]";
	var dateTag = "[object Date]";
	var errorTag = "[object Error]";
	var funcTag = "[object Function]";
	var mapTag = "[object Map]";
	var numberTag = "[object Number]";
	var objectTag = "[object Object]";
	var regexpTag = "[object RegExp]";
	var setTag = "[object Set]";
	var stringTag = "[object String]";
	var weakMapTag = "[object WeakMap]";
	var arrayBufferTag = "[object ArrayBuffer]";
	var dataViewTag = "[object DataView]";
	var float32Tag = "[object Float32Array]";
	var float64Tag = "[object Float64Array]";
	var int8Tag = "[object Int8Array]";
	var int16Tag = "[object Int16Array]";
	var int32Tag = "[object Int32Array]";
	var uint8Tag = "[object Uint8Array]";
	var uint8ClampedTag = "[object Uint8ClampedArray]";
	var uint16Tag = "[object Uint16Array]";
	var uint32Tag = "[object Uint32Array]";
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	/**
	* The base implementation of `_.isTypedArray` without Node.js optimizations.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	*/
	function baseIsTypedArray(value) {
		return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}
	module.exports = baseIsTypedArray;
}));
//#endregion
//#region node_modules/lodash/_baseUnary.js
var require__baseUnary = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.unary` without support for storing metadata.
	*
	* @private
	* @param {Function} func The function to cap arguments for.
	* @returns {Function} Returns the new capped function.
	*/
	function baseUnary(func) {
		return function(value) {
			return func(value);
		};
	}
	module.exports = baseUnary;
}));
//#endregion
//#region node_modules/lodash/_nodeUtil.js
var require__nodeUtil = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var freeGlobal = require__freeGlobal();
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	/** Detect free variable `process` from Node.js. */
	var freeProcess = freeModule && freeModule.exports === freeExports && freeGlobal.process;
	module.exports = function() {
		try {
			var types = freeModule && freeModule.require && freeModule.require("util").types;
			if (types) return types;
			return freeProcess && freeProcess.binding && freeProcess.binding("util");
		} catch (e) {}
	}();
}));
//#endregion
//#region node_modules/lodash/isTypedArray.js
var require_isTypedArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsTypedArray = require__baseIsTypedArray();
	var baseUnary = require__baseUnary();
	var nodeUtil = require__nodeUtil();
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	module.exports = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
}));
//#endregion
//#region node_modules/lodash/_arrayLikeKeys.js
var require__arrayLikeKeys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseTimes = require__baseTimes();
	var isArguments = require_isArguments();
	var isArray = require_isArray();
	var isBuffer = require_isBuffer();
	var isIndex = require__isIndex();
	var isTypedArray = require_isTypedArray();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Creates an array of the enumerable property names of the array-like `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @param {boolean} inherited Specify returning inherited property names.
	* @returns {Array} Returns the array of property names.
	*/
	function arrayLikeKeys(value, inherited) {
		var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
		for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
		return result;
	}
	module.exports = arrayLikeKeys;
}));
//#endregion
//#region node_modules/lodash/_isPrototype.js
var require__isPrototype = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	/**
	* Checks if `value` is likely a prototype object.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	*/
	function isPrototype(value) {
		var Ctor = value && value.constructor;
		return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
	}
	module.exports = isPrototype;
}));
//#endregion
//#region node_modules/lodash/_overArg.js
var require__overArg = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Creates a unary function that invokes `func` with its argument transformed.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {Function} transform The argument transform.
	* @returns {Function} Returns the new function.
	*/
	function overArg(func, transform) {
		return function(arg) {
			return func(transform(arg));
		};
	}
	module.exports = overArg;
}));
//#endregion
//#region node_modules/lodash/_nativeKeys.js
var require__nativeKeys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__overArg()(Object.keys, Object);
}));
//#endregion
//#region node_modules/lodash/_baseKeys.js
var require__baseKeys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isPrototype = require__isPrototype();
	var nativeKeys = require__nativeKeys();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	*/
	function baseKeys(object) {
		if (!isPrototype(object)) return nativeKeys(object);
		var result = [];
		for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
		return result;
	}
	module.exports = baseKeys;
}));
//#endregion
//#region node_modules/lodash/isArrayLike.js
var require_isArrayLike = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isFunction = require_isFunction();
	var isLength = require_isLength();
	/**
	* Checks if `value` is array-like. A value is considered array-like if it's
	* not a function and has a `value.length` that's an integer greater than or
	* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	* @example
	*
	* _.isArrayLike([1, 2, 3]);
	* // => true
	*
	* _.isArrayLike(document.body.children);
	* // => true
	*
	* _.isArrayLike('abc');
	* // => true
	*
	* _.isArrayLike(_.noop);
	* // => false
	*/
	function isArrayLike(value) {
		return value != null && isLength(value.length) && !isFunction(value);
	}
	module.exports = isArrayLike;
}));
//#endregion
//#region node_modules/lodash/keys.js
var require_keys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayLikeKeys = require__arrayLikeKeys();
	var baseKeys = require__baseKeys();
	var isArrayLike = require_isArrayLike();
	/**
	* Creates an array of the own enumerable property names of `object`.
	*
	* **Note:** Non-object values are coerced to objects. See the
	* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	* for more details.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Object
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.keys(new Foo);
	* // => ['a', 'b'] (iteration order is not guaranteed)
	*
	* _.keys('hi');
	* // => ['0', '1']
	*/
	function keys(object) {
		return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	module.exports = keys;
}));
//#endregion
//#region node_modules/lodash/_getAllKeys.js
var require__getAllKeys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetAllKeys = require__baseGetAllKeys();
	var getSymbols = require__getSymbols();
	var keys = require_keys();
	/**
	* Creates an array of own enumerable property names and symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function getAllKeys(object) {
		return baseGetAllKeys(object, keys, getSymbols);
	}
	module.exports = getAllKeys;
}));
//#endregion
//#region node_modules/lodash/_equalObjects.js
var require__equalObjects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getAllKeys = require__getAllKeys();
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* A specialized version of `baseIsEqualDeep` for objects with support for
	* partial deep comparisons.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
		var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length;
		if (objLength != getAllKeys(other).length && !isPartial) return false;
		var index = objLength;
		while (index--) {
			var key = objProps[index];
			if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
		}
		var objStacked = stack.get(object);
		var othStacked = stack.get(other);
		if (objStacked && othStacked) return objStacked == other && othStacked == object;
		var result = true;
		stack.set(object, other);
		stack.set(other, object);
		var skipCtor = isPartial;
		while (++index < objLength) {
			key = objProps[index];
			var objValue = object[key], othValue = other[key];
			if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
			if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
				result = false;
				break;
			}
			skipCtor || (skipCtor = key == "constructor");
		}
		if (result && !skipCtor) {
			var objCtor = object.constructor, othCtor = other.constructor;
			if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
		}
		stack["delete"](object);
		stack["delete"](other);
		return result;
	}
	module.exports = equalObjects;
}));
//#endregion
//#region node_modules/lodash/_DataView.js
var require__DataView = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "DataView");
}));
//#endregion
//#region node_modules/lodash/_Promise.js
var require__Promise = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Promise");
}));
//#endregion
//#region node_modules/lodash/_Set.js
var require__Set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "Set");
}));
//#endregion
//#region node_modules/lodash/_WeakMap.js
var require__WeakMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__getNative()(require__root(), "WeakMap");
}));
//#endregion
//#region node_modules/lodash/_getTag.js
var require__getTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DataView = require__DataView();
	var Map = require__Map();
	var Promise = require__Promise();
	var Set = require__Set();
	var WeakMap = require__WeakMap();
	var baseGetTag = require__baseGetTag();
	var toSource = require__toSource();
	/** `Object#toString` result references. */
	var mapTag = "[object Map]";
	var objectTag = "[object Object]";
	var promiseTag = "[object Promise]";
	var setTag = "[object Set]";
	var weakMapTag = "[object WeakMap]";
	var dataViewTag = "[object DataView]";
	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView);
	var mapCtorString = toSource(Map);
	var promiseCtorString = toSource(Promise);
	var setCtorString = toSource(Set);
	var weakMapCtorString = toSource(WeakMap);
	/**
	* Gets the `toStringTag` of `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	var getTag = baseGetTag;
	if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
		var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
		if (ctorString) switch (ctorString) {
			case dataViewCtorString: return dataViewTag;
			case mapCtorString: return mapTag;
			case promiseCtorString: return promiseTag;
			case setCtorString: return setTag;
			case weakMapCtorString: return weakMapTag;
		}
		return result;
	};
	module.exports = getTag;
}));
//#endregion
//#region node_modules/lodash/_baseIsEqualDeep.js
var require__baseIsEqualDeep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stack = require__Stack();
	var equalArrays = require__equalArrays();
	var equalByTag = require__equalByTag();
	var equalObjects = require__equalObjects();
	var getTag = require__getTag();
	var isArray = require_isArray();
	var isBuffer = require_isBuffer();
	var isTypedArray = require_isTypedArray();
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]";
	var arrayTag = "[object Array]";
	var objectTag = "[object Object]";
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* A specialized version of `baseIsEqual` for arrays and objects which performs
	* deep comparisons and tracks traversed objects enabling objects with circular
	* references to be compared.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} [stack] Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
		var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
		objTag = objTag == argsTag ? objectTag : objTag;
		othTag = othTag == argsTag ? objectTag : othTag;
		var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
		if (isSameTag && isBuffer(object)) {
			if (!isBuffer(other)) return false;
			objIsArr = true;
			objIsObj = false;
		}
		if (isSameTag && !objIsObj) {
			stack || (stack = new Stack());
			return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
		}
		if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
			var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
			if (objIsWrapped || othIsWrapped) {
				var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
				stack || (stack = new Stack());
				return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
			}
		}
		if (!isSameTag) return false;
		stack || (stack = new Stack());
		return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}
	module.exports = baseIsEqualDeep;
}));
//#endregion
//#region node_modules/lodash/_baseIsEqual.js
var require__baseIsEqual = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsEqualDeep = require__baseIsEqualDeep();
	var isObjectLike = require_isObjectLike();
	/**
	* The base implementation of `_.isEqual` which supports partial comparisons
	* and tracks traversed objects.
	*
	* @private
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @param {boolean} bitmask The bitmask flags.
	*  1 - Unordered comparison
	*  2 - Partial comparison
	* @param {Function} [customizer] The function to customize comparisons.
	* @param {Object} [stack] Tracks traversed `value` and `other` objects.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	*/
	function baseIsEqual(value, other, bitmask, customizer, stack) {
		if (value === other) return true;
		if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
		return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}
	module.exports = baseIsEqual;
}));
//#endregion
//#region node_modules/lodash/_baseIsMatch.js
var require__baseIsMatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stack = require__Stack();
	var baseIsEqual = require__baseIsEqual();
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	var COMPARE_UNORDERED_FLAG = 2;
	/**
	* The base implementation of `_.isMatch` without support for iteratee shorthands.
	*
	* @private
	* @param {Object} object The object to inspect.
	* @param {Object} source The object of property values to match.
	* @param {Array} matchData The property names, values, and compare flags to match.
	* @param {Function} [customizer] The function to customize comparisons.
	* @returns {boolean} Returns `true` if `object` is a match, else `false`.
	*/
	function baseIsMatch(object, source, matchData, customizer) {
		var index = matchData.length, length = index, noCustomizer = !customizer;
		if (object == null) return !length;
		object = Object(object);
		while (index--) {
			var data = matchData[index];
			if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
		}
		while (++index < length) {
			data = matchData[index];
			var key = data[0], objValue = object[key], srcValue = data[1];
			if (noCustomizer && data[2]) {
				if (objValue === void 0 && !(key in object)) return false;
			} else {
				var stack = new Stack();
				if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
				if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) return false;
			}
		}
		return true;
	}
	module.exports = baseIsMatch;
}));
//#endregion
//#region node_modules/lodash/_isStrictComparable.js
var require__isStrictComparable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_isObject();
	/**
	* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` if suitable for strict
	*  equality comparisons, else `false`.
	*/
	function isStrictComparable(value) {
		return value === value && !isObject(value);
	}
	module.exports = isStrictComparable;
}));
//#endregion
//#region node_modules/lodash/_getMatchData.js
var require__getMatchData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isStrictComparable = require__isStrictComparable();
	var keys = require_keys();
	/**
	* Gets the property names, values, and compare flags of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the match data of `object`.
	*/
	function getMatchData(object) {
		var result = keys(object), length = result.length;
		while (length--) {
			var key = result[length], value = object[key];
			result[length] = [
				key,
				value,
				isStrictComparable(value)
			];
		}
		return result;
	}
	module.exports = getMatchData;
}));
//#endregion
//#region node_modules/lodash/_matchesStrictComparable.js
var require__matchesStrictComparable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `matchesProperty` for source values suitable
	* for strict equality comparisons, i.e. `===`.
	*
	* @private
	* @param {string} key The key of the property to get.
	* @param {*} srcValue The value to match.
	* @returns {Function} Returns the new spec function.
	*/
	function matchesStrictComparable(key, srcValue) {
		return function(object) {
			if (object == null) return false;
			return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
		};
	}
	module.exports = matchesStrictComparable;
}));
//#endregion
//#region node_modules/lodash/_baseMatches.js
var require__baseMatches = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsMatch = require__baseIsMatch();
	var getMatchData = require__getMatchData();
	var matchesStrictComparable = require__matchesStrictComparable();
	/**
	* The base implementation of `_.matches` which doesn't clone `source`.
	*
	* @private
	* @param {Object} source The object of property values to match.
	* @returns {Function} Returns the new spec function.
	*/
	function baseMatches(source) {
		var matchData = getMatchData(source);
		if (matchData.length == 1 && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
		return function(object) {
			return object === source || baseIsMatch(object, source, matchData);
		};
	}
	module.exports = baseMatches;
}));
//#endregion
//#region node_modules/lodash/_isKey.js
var require__isKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArray = require_isArray();
	var isSymbol = require_isSymbol();
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
	var reIsPlainProp = /^\w*$/;
	/**
	* Checks if `value` is a property name and not a property path.
	*
	* @private
	* @param {*} value The value to check.
	* @param {Object} [object] The object to query keys on.
	* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	*/
	function isKey(value, object) {
		if (isArray(value)) return false;
		var type = typeof value;
		if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
		return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
	}
	module.exports = isKey;
}));
//#endregion
//#region node_modules/lodash/memoize.js
var require_memoize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MapCache = require__MapCache();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	/**
	* Creates a function that memoizes the result of `func`. If `resolver` is
	* provided, it determines the cache key for storing the result based on the
	* arguments provided to the memoized function. By default, the first argument
	* provided to the memoized function is used as the map cache key. The `func`
	* is invoked with the `this` binding of the memoized function.
	*
	* **Note:** The cache is exposed as the `cache` property on the memoized
	* function. Its creation may be customized by replacing the `_.memoize.Cache`
	* constructor with one whose instances implement the
	* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	* method interface of `clear`, `delete`, `get`, `has`, and `set`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Function
	* @param {Function} func The function to have its output memoized.
	* @param {Function} [resolver] The function to resolve the cache key.
	* @returns {Function} Returns the new memoized function.
	* @example
	*
	* var object = { 'a': 1, 'b': 2 };
	* var other = { 'c': 3, 'd': 4 };
	*
	* var values = _.memoize(_.values);
	* values(object);
	* // => [1, 2]
	*
	* values(other);
	* // => [3, 4]
	*
	* object.a = 2;
	* values(object);
	* // => [1, 2]
	*
	* // Modify the result cache.
	* values.cache.set(object, ['a', 'b']);
	* values(object);
	* // => ['a', 'b']
	*
	* // Replace `_.memoize.Cache`.
	* _.memoize.Cache = WeakMap;
	*/
	function memoize(func, resolver) {
		if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT);
		var memoized = function() {
			var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
			if (cache.has(key)) return cache.get(key);
			var result = func.apply(this, args);
			memoized.cache = cache.set(key, result) || cache;
			return result;
		};
		memoized.cache = new (memoize.Cache || MapCache)();
		return memoized;
	}
	memoize.Cache = MapCache;
	module.exports = memoize;
}));
//#endregion
//#region node_modules/lodash/_memoizeCapped.js
var require__memoizeCapped = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var memoize = require_memoize();
	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;
	/**
	* A specialized version of `_.memoize` which clears the memoized function's
	* cache when it exceeds `MAX_MEMOIZE_SIZE`.
	*
	* @private
	* @param {Function} func The function to have its output memoized.
	* @returns {Function} Returns the new memoized function.
	*/
	function memoizeCapped(func) {
		var result = memoize(func, function(key) {
			if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
			return key;
		});
		var cache = result.cache;
		return result;
	}
	module.exports = memoizeCapped;
}));
//#endregion
//#region node_modules/lodash/_stringToPath.js
var require__stringToPath = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var memoizeCapped = require__memoizeCapped();
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	module.exports = memoizeCapped(function(string) {
		var result = [];
		if (string.charCodeAt(0) === 46) result.push("");
		string.replace(rePropName, function(match, number, quote, subString) {
			result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
		});
		return result;
	});
}));
//#endregion
//#region node_modules/lodash/_arrayMap.js
var require__arrayMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.map` for arrays without support for iteratee
	* shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the new mapped array.
	*/
	function arrayMap(array, iteratee) {
		var index = -1, length = array == null ? 0 : array.length, result = Array(length);
		while (++index < length) result[index] = iteratee(array[index], index, array);
		return result;
	}
	module.exports = arrayMap;
}));
//#endregion
//#region node_modules/lodash/_baseToString.js
var require__baseToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var arrayMap = require__arrayMap();
	var isArray = require_isArray();
	var isSymbol = require_isSymbol();
	/** Used as references for various `Number` constants. */
	var INFINITY = Infinity;
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0;
	var symbolToString = symbolProto ? symbolProto.toString : void 0;
	/**
	* The base implementation of `_.toString` which doesn't convert nullish
	* values to empty strings.
	*
	* @private
	* @param {*} value The value to process.
	* @returns {string} Returns the string.
	*/
	function baseToString(value) {
		if (typeof value == "string") return value;
		if (isArray(value)) return arrayMap(value, baseToString) + "";
		if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
		var result = value + "";
		return result == "0" && 1 / value == -INFINITY ? "-0" : result;
	}
	module.exports = baseToString;
}));
//#endregion
//#region node_modules/lodash/toString.js
var require_toString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseToString = require__baseToString();
	/**
	* Converts `value` to a string. An empty string is returned for `null`
	* and `undefined` values. The sign of `-0` is preserved.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	* @example
	*
	* _.toString(null);
	* // => ''
	*
	* _.toString(-0);
	* // => '-0'
	*
	* _.toString([1, 2, 3]);
	* // => '1,2,3'
	*/
	function toString(value) {
		return value == null ? "" : baseToString(value);
	}
	module.exports = toString;
}));
//#endregion
//#region node_modules/lodash/_castPath.js
var require__castPath = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArray = require_isArray();
	var isKey = require__isKey();
	var stringToPath = require__stringToPath();
	var toString = require_toString();
	/**
	* Casts `value` to a path array if it's not one.
	*
	* @private
	* @param {*} value The value to inspect.
	* @param {Object} [object] The object to query keys on.
	* @returns {Array} Returns the cast property path array.
	*/
	function castPath(value, object) {
		if (isArray(value)) return value;
		return isKey(value, object) ? [value] : stringToPath(toString(value));
	}
	module.exports = castPath;
}));
//#endregion
//#region node_modules/lodash/_toKey.js
var require__toKey = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isSymbol = require_isSymbol();
	/** Used as references for various `Number` constants. */
	var INFINITY = Infinity;
	/**
	* Converts `value` to a string key if it's not a string or symbol.
	*
	* @private
	* @param {*} value The value to inspect.
	* @returns {string|symbol} Returns the key.
	*/
	function toKey(value) {
		if (typeof value == "string" || isSymbol(value)) return value;
		var result = value + "";
		return result == "0" && 1 / value == -INFINITY ? "-0" : result;
	}
	module.exports = toKey;
}));
//#endregion
//#region node_modules/lodash/_baseGet.js
var require__baseGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var castPath = require__castPath();
	var toKey = require__toKey();
	/**
	* The base implementation of `_.get` without support for default values.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Array|string} path The path of the property to get.
	* @returns {*} Returns the resolved value.
	*/
	function baseGet(object, path) {
		path = castPath(path, object);
		var index = 0, length = path.length;
		while (object != null && index < length) object = object[toKey(path[index++])];
		return index && index == length ? object : void 0;
	}
	module.exports = baseGet;
}));
//#endregion
//#region node_modules/lodash/get.js
var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGet = require__baseGet();
	/**
	* Gets the value at `path` of `object`. If the resolved value is
	* `undefined`, the `defaultValue` is returned in its place.
	*
	* @static
	* @memberOf _
	* @since 3.7.0
	* @category Object
	* @param {Object} object The object to query.
	* @param {Array|string} path The path of the property to get.
	* @param {*} [defaultValue] The value returned for `undefined` resolved values.
	* @returns {*} Returns the resolved value.
	* @example
	*
	* var object = { 'a': [{ 'b': { 'c': 3 } }] };
	*
	* _.get(object, 'a[0].b.c');
	* // => 3
	*
	* _.get(object, ['a', '0', 'b', 'c']);
	* // => 3
	*
	* _.get(object, 'a.b.c', 'default');
	* // => 'default'
	*/
	function get(object, path, defaultValue) {
		var result = object == null ? void 0 : baseGet(object, path);
		return result === void 0 ? defaultValue : result;
	}
	module.exports = get;
}));
//#endregion
//#region node_modules/lodash/_baseHasIn.js
var require__baseHasIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.hasIn` without support for deep paths.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {Array|string} key The key to check.
	* @returns {boolean} Returns `true` if `key` exists, else `false`.
	*/
	function baseHasIn(object, key) {
		return object != null && key in Object(object);
	}
	module.exports = baseHasIn;
}));
//#endregion
//#region node_modules/lodash/_hasPath.js
var require__hasPath = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var castPath = require__castPath();
	var isArguments = require_isArguments();
	var isArray = require_isArray();
	var isIndex = require__isIndex();
	var isLength = require_isLength();
	var toKey = require__toKey();
	/**
	* Checks if `path` exists on `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Array|string} path The path to check.
	* @param {Function} hasFunc The function to check properties.
	* @returns {boolean} Returns `true` if `path` exists, else `false`.
	*/
	function hasPath(object, path, hasFunc) {
		path = castPath(path, object);
		var index = -1, length = path.length, result = false;
		while (++index < length) {
			var key = toKey(path[index]);
			if (!(result = object != null && hasFunc(object, key))) break;
			object = object[key];
		}
		if (result || ++index != length) return result;
		length = object == null ? 0 : object.length;
		return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
	}
	module.exports = hasPath;
}));
//#endregion
//#region node_modules/lodash/hasIn.js
var require_hasIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseHasIn = require__baseHasIn();
	var hasPath = require__hasPath();
	/**
	* Checks if `path` is a direct or inherited property of `object`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Object
	* @param {Object} object The object to query.
	* @param {Array|string} path The path to check.
	* @returns {boolean} Returns `true` if `path` exists, else `false`.
	* @example
	*
	* var object = _.create({ 'a': _.create({ 'b': 2 }) });
	*
	* _.hasIn(object, 'a');
	* // => true
	*
	* _.hasIn(object, 'a.b');
	* // => true
	*
	* _.hasIn(object, ['a', 'b']);
	* // => true
	*
	* _.hasIn(object, 'b');
	* // => false
	*/
	function hasIn(object, path) {
		return object != null && hasPath(object, path, baseHasIn);
	}
	module.exports = hasIn;
}));
//#endregion
//#region node_modules/lodash/_baseMatchesProperty.js
var require__baseMatchesProperty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsEqual = require__baseIsEqual();
	var get = require_get();
	var hasIn = require_hasIn();
	var isKey = require__isKey();
	var isStrictComparable = require__isStrictComparable();
	var matchesStrictComparable = require__matchesStrictComparable();
	var toKey = require__toKey();
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	var COMPARE_UNORDERED_FLAG = 2;
	/**
	* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	*
	* @private
	* @param {string} path The path of the property to get.
	* @param {*} srcValue The value to match.
	* @returns {Function} Returns the new spec function.
	*/
	function baseMatchesProperty(path, srcValue) {
		if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
		return function(object) {
			var objValue = get(object, path);
			return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
		};
	}
	module.exports = baseMatchesProperty;
}));
//#endregion
//#region node_modules/lodash/identity.js
var require_identity = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This method returns the first argument it receives.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Util
	* @param {*} value Any value.
	* @returns {*} Returns `value`.
	* @example
	*
	* var object = { 'a': 1 };
	*
	* console.log(_.identity(object) === object);
	* // => true
	*/
	function identity(value) {
		return value;
	}
	module.exports = identity;
}));
//#endregion
//#region node_modules/lodash/_baseProperty.js
var require__baseProperty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.property` without support for deep paths.
	*
	* @private
	* @param {string} key The key of the property to get.
	* @returns {Function} Returns the new accessor function.
	*/
	function baseProperty(key) {
		return function(object) {
			return object == null ? void 0 : object[key];
		};
	}
	module.exports = baseProperty;
}));
//#endregion
//#region node_modules/lodash/_basePropertyDeep.js
var require__basePropertyDeep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGet = require__baseGet();
	/**
	* A specialized version of `baseProperty` which supports deep paths.
	*
	* @private
	* @param {Array|string} path The path of the property to get.
	* @returns {Function} Returns the new accessor function.
	*/
	function basePropertyDeep(path) {
		return function(object) {
			return baseGet(object, path);
		};
	}
	module.exports = basePropertyDeep;
}));
//#endregion
//#region node_modules/lodash/property.js
var require_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseProperty = require__baseProperty();
	var basePropertyDeep = require__basePropertyDeep();
	var isKey = require__isKey();
	var toKey = require__toKey();
	/**
	* Creates a function that returns the value at `path` of a given object.
	*
	* @static
	* @memberOf _
	* @since 2.4.0
	* @category Util
	* @param {Array|string} path The path of the property to get.
	* @returns {Function} Returns the new accessor function.
	* @example
	*
	* var objects = [
	*   { 'a': { 'b': 2 } },
	*   { 'a': { 'b': 1 } }
	* ];
	*
	* _.map(objects, _.property('a.b'));
	* // => [2, 1]
	*
	* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	* // => [1, 2]
	*/
	function property(path) {
		return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
	}
	module.exports = property;
}));
//#endregion
//#region node_modules/lodash/_baseIteratee.js
var require__baseIteratee = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseMatches = require__baseMatches();
	var baseMatchesProperty = require__baseMatchesProperty();
	var identity = require_identity();
	var isArray = require_isArray();
	var property = require_property();
	/**
	* The base implementation of `_.iteratee`.
	*
	* @private
	* @param {*} [value=_.identity] The value to convert to an iteratee.
	* @returns {Function} Returns the iteratee.
	*/
	function baseIteratee(value) {
		if (typeof value == "function") return value;
		if (value == null) return identity;
		if (typeof value == "object") return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
		return property(value);
	}
	module.exports = baseIteratee;
}));
//#endregion
//#region node_modules/lodash/maxBy.js
var require_maxBy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseExtremum = require__baseExtremum();
	var baseGt = require__baseGt();
	var baseIteratee = require__baseIteratee();
	/**
	* This method is like `_.max` except that it accepts `iteratee` which is
	* invoked for each element in `array` to generate the criterion by which
	* the value is ranked. The iteratee is invoked with one argument: (value).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Math
	* @param {Array} array The array to iterate over.
	* @param {Function} [iteratee=_.identity] The iteratee invoked per element.
	* @returns {*} Returns the maximum value.
	* @example
	*
	* var objects = [{ 'n': 1 }, { 'n': 2 }];
	*
	* _.maxBy(objects, function(o) { return o.n; });
	* // => { 'n': 2 }
	*
	* // The `_.property` iteratee shorthand.
	* _.maxBy(objects, 'n');
	* // => { 'n': 2 }
	*/
	function maxBy(array, iteratee) {
		return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : void 0;
	}
	module.exports = maxBy;
}));
//#endregion
//#region node_modules/lodash/isEmpty.js
var require_isEmpty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseKeys = require__baseKeys();
	var getTag = require__getTag();
	var isArguments = require_isArguments();
	var isArray = require_isArray();
	var isArrayLike = require_isArrayLike();
	var isBuffer = require_isBuffer();
	var isPrototype = require__isPrototype();
	var isTypedArray = require_isTypedArray();
	/** `Object#toString` result references. */
	var mapTag = "[object Map]";
	var setTag = "[object Set]";
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Checks if `value` is an empty object, collection, map, or set.
	*
	* Objects are considered empty if they have no own enumerable string keyed
	* properties.
	*
	* Array-like values such as `arguments` objects, arrays, buffers, strings, or
	* jQuery-like collections are considered empty if they have a `length` of `0`.
	* Similarly, maps and sets are considered empty if they have a `size` of `0`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is empty, else `false`.
	* @example
	*
	* _.isEmpty(null);
	* // => true
	*
	* _.isEmpty(true);
	* // => true
	*
	* _.isEmpty(1);
	* // => true
	*
	* _.isEmpty([1, 2, 3]);
	* // => false
	*
	* _.isEmpty({ 'a': 1 });
	* // => false
	*/
	function isEmpty(value) {
		if (value == null) return true;
		if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) return !value.length;
		var tag = getTag(value);
		if (tag == mapTag || tag == setTag) return !value.size;
		if (isPrototype(value)) return !baseKeys(value).length;
		for (var key in value) if (hasOwnProperty.call(value, key)) return false;
		return true;
	}
	module.exports = isEmpty;
}));
//#endregion
//#region node_modules/lodash/_arrayReduce.js
var require__arrayReduce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.reduce` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @param {*} [accumulator] The initial value.
	* @param {boolean} [initAccum] Specify using the first element of `array` as
	*  the initial value.
	* @returns {*} Returns the accumulated value.
	*/
	function arrayReduce(array, iteratee, accumulator, initAccum) {
		var index = -1, length = array == null ? 0 : array.length;
		if (initAccum && length) accumulator = array[++index];
		while (++index < length) accumulator = iteratee(accumulator, array[index], index, array);
		return accumulator;
	}
	module.exports = arrayReduce;
}));
//#endregion
//#region node_modules/lodash/_basePropertyOf.js
var require__basePropertyOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.propertyOf` without support for deep paths.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Function} Returns the new accessor function.
	*/
	function basePropertyOf(object) {
		return function(key) {
			return object == null ? void 0 : object[key];
		};
	}
	module.exports = basePropertyOf;
}));
//#endregion
//#region node_modules/lodash/_deburrLetter.js
var require__deburrLetter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__basePropertyOf()({
		"À": "A",
		"Á": "A",
		"Â": "A",
		"Ã": "A",
		"Ä": "A",
		"Å": "A",
		"à": "a",
		"á": "a",
		"â": "a",
		"ã": "a",
		"ä": "a",
		"å": "a",
		"Ç": "C",
		"ç": "c",
		"Ð": "D",
		"ð": "d",
		"È": "E",
		"É": "E",
		"Ê": "E",
		"Ë": "E",
		"è": "e",
		"é": "e",
		"ê": "e",
		"ë": "e",
		"Ì": "I",
		"Í": "I",
		"Î": "I",
		"Ï": "I",
		"ì": "i",
		"í": "i",
		"î": "i",
		"ï": "i",
		"Ñ": "N",
		"ñ": "n",
		"Ò": "O",
		"Ó": "O",
		"Ô": "O",
		"Õ": "O",
		"Ö": "O",
		"Ø": "O",
		"ò": "o",
		"ó": "o",
		"ô": "o",
		"õ": "o",
		"ö": "o",
		"ø": "o",
		"Ù": "U",
		"Ú": "U",
		"Û": "U",
		"Ü": "U",
		"ù": "u",
		"ú": "u",
		"û": "u",
		"ü": "u",
		"Ý": "Y",
		"ý": "y",
		"ÿ": "y",
		"Æ": "Ae",
		"æ": "ae",
		"Þ": "Th",
		"þ": "th",
		"ß": "ss",
		"Ā": "A",
		"Ă": "A",
		"Ą": "A",
		"ā": "a",
		"ă": "a",
		"ą": "a",
		"Ć": "C",
		"Ĉ": "C",
		"Ċ": "C",
		"Č": "C",
		"ć": "c",
		"ĉ": "c",
		"ċ": "c",
		"č": "c",
		"Ď": "D",
		"Đ": "D",
		"ď": "d",
		"đ": "d",
		"Ē": "E",
		"Ĕ": "E",
		"Ė": "E",
		"Ę": "E",
		"Ě": "E",
		"ē": "e",
		"ĕ": "e",
		"ė": "e",
		"ę": "e",
		"ě": "e",
		"Ĝ": "G",
		"Ğ": "G",
		"Ġ": "G",
		"Ģ": "G",
		"ĝ": "g",
		"ğ": "g",
		"ġ": "g",
		"ģ": "g",
		"Ĥ": "H",
		"Ħ": "H",
		"ĥ": "h",
		"ħ": "h",
		"Ĩ": "I",
		"Ī": "I",
		"Ĭ": "I",
		"Į": "I",
		"İ": "I",
		"ĩ": "i",
		"ī": "i",
		"ĭ": "i",
		"į": "i",
		"ı": "i",
		"Ĵ": "J",
		"ĵ": "j",
		"Ķ": "K",
		"ķ": "k",
		"ĸ": "k",
		"Ĺ": "L",
		"Ļ": "L",
		"Ľ": "L",
		"Ŀ": "L",
		"Ł": "L",
		"ĺ": "l",
		"ļ": "l",
		"ľ": "l",
		"ŀ": "l",
		"ł": "l",
		"Ń": "N",
		"Ņ": "N",
		"Ň": "N",
		"Ŋ": "N",
		"ń": "n",
		"ņ": "n",
		"ň": "n",
		"ŋ": "n",
		"Ō": "O",
		"Ŏ": "O",
		"Ő": "O",
		"ō": "o",
		"ŏ": "o",
		"ő": "o",
		"Ŕ": "R",
		"Ŗ": "R",
		"Ř": "R",
		"ŕ": "r",
		"ŗ": "r",
		"ř": "r",
		"Ś": "S",
		"Ŝ": "S",
		"Ş": "S",
		"Š": "S",
		"ś": "s",
		"ŝ": "s",
		"ş": "s",
		"š": "s",
		"Ţ": "T",
		"Ť": "T",
		"Ŧ": "T",
		"ţ": "t",
		"ť": "t",
		"ŧ": "t",
		"Ũ": "U",
		"Ū": "U",
		"Ŭ": "U",
		"Ů": "U",
		"Ű": "U",
		"Ų": "U",
		"ũ": "u",
		"ū": "u",
		"ŭ": "u",
		"ů": "u",
		"ű": "u",
		"ų": "u",
		"Ŵ": "W",
		"ŵ": "w",
		"Ŷ": "Y",
		"ŷ": "y",
		"Ÿ": "Y",
		"Ź": "Z",
		"Ż": "Z",
		"Ž": "Z",
		"ź": "z",
		"ż": "z",
		"ž": "z",
		"Ĳ": "IJ",
		"ĳ": "ij",
		"Œ": "Oe",
		"œ": "oe",
		"ŉ": "'n",
		"ſ": "s"
	});
}));
//#endregion
//#region node_modules/lodash/deburr.js
var require_deburr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var deburrLetter = require__deburrLetter();
	var toString = require_toString();
	/** Used to match Latin Unicode letters (excluding mathematical operators). */
	var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
	/**
	* Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
	* [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
	*/
	var reComboMark = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", "g");
	/**
	* Deburrs `string` by converting
	* [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	* and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
	* letters to basic Latin letters and removing
	* [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category String
	* @param {string} [string=''] The string to deburr.
	* @returns {string} Returns the deburred string.
	* @example
	*
	* _.deburr('déjà vu');
	* // => 'deja vu'
	*/
	function deburr(string) {
		string = toString(string);
		return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
	}
	module.exports = deburr;
}));
//#endregion
//#region node_modules/lodash/_asciiWords.js
var require__asciiWords = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to match words composed of alphanumeric characters. */
	var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
	/**
	* Splits an ASCII `string` into an array of its words.
	*
	* @private
	* @param {string} The string to inspect.
	* @returns {Array} Returns the words of `string`.
	*/
	function asciiWords(string) {
		return string.match(reAsciiWord) || [];
	}
	module.exports = asciiWords;
}));
//#endregion
//#region node_modules/lodash/_hasUnicodeWord.js
var require__hasUnicodeWord = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to detect strings that need a more robust regexp to match words. */
	var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
	/**
	* Checks if `string` contains a word composed of Unicode symbols.
	*
	* @private
	* @param {string} string The string to inspect.
	* @returns {boolean} Returns `true` if a word is found, else `false`.
	*/
	function hasUnicodeWord(string) {
		return reHasUnicodeWord.test(string);
	}
	module.exports = hasUnicodeWord;
}));
//#endregion
//#region node_modules/lodash/_unicodeWords.js
var require__unicodeWords = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to compose unicode character classes. */
	var rsAstralRange = "\\ud800-\\udfff";
	var rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff";
	var rsDingbatRange = "\\u2700-\\u27bf";
	var rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff";
	var rsMathOpRange = "\\xac\\xb1\\xd7\\xf7";
	var rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
	var rsPunctuationRange = "\\u2000-\\u206f";
	var rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
	var rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde";
	var rsVarRange = "\\ufe0e\\ufe0f";
	var rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
	/** Used to compose unicode capture groups. */
	var rsApos = "['’]";
	var rsBreak = "[" + rsBreakRange + "]";
	var rsCombo = "[" + rsComboRange + "]";
	var rsDigits = "\\d+";
	var rsDingbat = "[" + rsDingbatRange + "]";
	var rsLower = "[" + rsLowerRange + "]";
	var rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]";
	var rsModifier = "(?:" + rsCombo + "|\\ud83c[\\udffb-\\udfff])";
	var rsNonAstral = "[^" + rsAstralRange + "]";
	var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
	var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
	var rsUpper = "[" + rsUpperRange + "]";
	var rsZWJ = "\\u200d";
	/** Used to compose unicode regexes. */
	var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")";
	var rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")";
	var rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?";
	var rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?";
	var reOptMod = rsModifier + "?";
	var rsOptVar = "[" + rsVarRange + "]?";
	var rsOptJoin = "(?:" + rsZWJ + "(?:" + [
		rsNonAstral,
		rsRegional,
		rsSurrPair
	].join("|") + ")" + rsOptVar + reOptMod + ")*";
	var rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])";
	var rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])";
	var rsSeq = rsOptVar + reOptMod + rsOptJoin;
	var rsEmoji = "(?:" + [
		rsDingbat,
		rsRegional,
		rsSurrPair
	].join("|") + ")" + rsSeq;
	/** Used to match complex or compound words. */
	var reUnicodeWord = RegExp([
		rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [
			rsBreak,
			rsUpper,
			"$"
		].join("|") + ")",
		rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [
			rsBreak,
			rsUpper + rsMiscLower,
			"$"
		].join("|") + ")",
		rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
		rsUpper + "+" + rsOptContrUpper,
		rsOrdUpper,
		rsOrdLower,
		rsDigits,
		rsEmoji
	].join("|"), "g");
	/**
	* Splits a Unicode `string` into an array of its words.
	*
	* @private
	* @param {string} The string to inspect.
	* @returns {Array} Returns the words of `string`.
	*/
	function unicodeWords(string) {
		return string.match(reUnicodeWord) || [];
	}
	module.exports = unicodeWords;
}));
//#endregion
//#region node_modules/lodash/words.js
var require_words = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var asciiWords = require__asciiWords();
	var hasUnicodeWord = require__hasUnicodeWord();
	var toString = require_toString();
	var unicodeWords = require__unicodeWords();
	/**
	* Splits `string` into an array of its words.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category String
	* @param {string} [string=''] The string to inspect.
	* @param {RegExp|string} [pattern] The pattern to match words.
	* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	* @returns {Array} Returns the words of `string`.
	* @example
	*
	* _.words('fred, barney, & pebbles');
	* // => ['fred', 'barney', 'pebbles']
	*
	* _.words('fred, barney, & pebbles', /[^, ]+/g);
	* // => ['fred', 'barney', '&', 'pebbles']
	*/
	function words(string, pattern, guard) {
		string = toString(string);
		pattern = guard ? void 0 : pattern;
		if (pattern === void 0) return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
		return string.match(pattern) || [];
	}
	module.exports = words;
}));
//#endregion
//#region node_modules/lodash/_createCompounder.js
var require__createCompounder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayReduce = require__arrayReduce();
	var deburr = require_deburr();
	var words = require_words();
	/** Used to match apostrophes. */
	var reApos = RegExp("['’]", "g");
	/**
	* Creates a function like `_.camelCase`.
	*
	* @private
	* @param {Function} callback The function to combine each word.
	* @returns {Function} Returns the new compounder function.
	*/
	function createCompounder(callback) {
		return function(string) {
			return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
		};
	}
	module.exports = createCompounder;
}));
//#endregion
//#region node_modules/lodash/_baseSlice.js
var require__baseSlice = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.slice` without an iteratee call guard.
	*
	* @private
	* @param {Array} array The array to slice.
	* @param {number} [start=0] The start position.
	* @param {number} [end=array.length] The end position.
	* @returns {Array} Returns the slice of `array`.
	*/
	function baseSlice(array, start, end) {
		var index = -1, length = array.length;
		if (start < 0) start = -start > length ? 0 : length + start;
		end = end > length ? length : end;
		if (end < 0) end += length;
		length = start > end ? 0 : end - start >>> 0;
		start >>>= 0;
		var result = Array(length);
		while (++index < length) result[index] = array[index + start];
		return result;
	}
	module.exports = baseSlice;
}));
//#endregion
//#region node_modules/lodash/_castSlice.js
var require__castSlice = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseSlice = require__baseSlice();
	/**
	* Casts `array` to a slice if it's needed.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {number} start The start position.
	* @param {number} [end=array.length] The end position.
	* @returns {Array} Returns the cast slice.
	*/
	function castSlice(array, start, end) {
		var length = array.length;
		end = end === void 0 ? length : end;
		return !start && end >= length ? array : baseSlice(array, start, end);
	}
	module.exports = castSlice;
}));
//#endregion
//#region node_modules/lodash/_hasUnicode.js
var require__hasUnicode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	var reHasUnicode = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
	/**
	* Checks if `string` contains Unicode symbols.
	*
	* @private
	* @param {string} string The string to inspect.
	* @returns {boolean} Returns `true` if a symbol is found, else `false`.
	*/
	function hasUnicode(string) {
		return reHasUnicode.test(string);
	}
	module.exports = hasUnicode;
}));
//#endregion
//#region node_modules/lodash/_asciiToArray.js
var require__asciiToArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Converts an ASCII `string` to an array.
	*
	* @private
	* @param {string} string The string to convert.
	* @returns {Array} Returns the converted array.
	*/
	function asciiToArray(string) {
		return string.split("");
	}
	module.exports = asciiToArray;
}));
//#endregion
//#region node_modules/lodash/_unicodeToArray.js
var require__unicodeToArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to compose unicode character classes. */
	var rsAstralRange = "\\ud800-\\udfff";
	var rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff";
	var rsVarRange = "\\ufe0e\\ufe0f";
	/** Used to compose unicode capture groups. */
	var rsAstral = "[" + rsAstralRange + "]";
	var rsCombo = "[" + rsComboRange + "]";
	var rsFitz = "\\ud83c[\\udffb-\\udfff]";
	var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
	var rsNonAstral = "[^" + rsAstralRange + "]";
	var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
	var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
	var rsZWJ = "\\u200d";
	/** Used to compose unicode regexes. */
	var reOptMod = rsModifier + "?";
	var rsOptVar = "[" + rsVarRange + "]?";
	var rsOptJoin = "(?:" + rsZWJ + "(?:" + [
		rsNonAstral,
		rsRegional,
		rsSurrPair
	].join("|") + ")" + rsOptVar + reOptMod + ")*";
	var rsSeq = rsOptVar + reOptMod + rsOptJoin;
	var rsSymbol = "(?:" + [
		rsNonAstral + rsCombo + "?",
		rsCombo,
		rsRegional,
		rsSurrPair,
		rsAstral
	].join("|") + ")";
	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
	/**
	* Converts a Unicode `string` to an array.
	*
	* @private
	* @param {string} string The string to convert.
	* @returns {Array} Returns the converted array.
	*/
	function unicodeToArray(string) {
		return string.match(reUnicode) || [];
	}
	module.exports = unicodeToArray;
}));
//#endregion
//#region node_modules/lodash/_stringToArray.js
var require__stringToArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var asciiToArray = require__asciiToArray();
	var hasUnicode = require__hasUnicode();
	var unicodeToArray = require__unicodeToArray();
	/**
	* Converts `string` to an array.
	*
	* @private
	* @param {string} string The string to convert.
	* @returns {Array} Returns the converted array.
	*/
	function stringToArray(string) {
		return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
	}
	module.exports = stringToArray;
}));
//#endregion
//#region node_modules/lodash/_createCaseFirst.js
var require__createCaseFirst = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var castSlice = require__castSlice();
	var hasUnicode = require__hasUnicode();
	var stringToArray = require__stringToArray();
	var toString = require_toString();
	/**
	* Creates a function like `_.lowerFirst`.
	*
	* @private
	* @param {string} methodName The name of the `String` case method to use.
	* @returns {Function} Returns the new case function.
	*/
	function createCaseFirst(methodName) {
		return function(string) {
			string = toString(string);
			var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
			var chr = strSymbols ? strSymbols[0] : string.charAt(0);
			var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
			return chr[methodName]() + trailing;
		};
	}
	module.exports = createCaseFirst;
}));
//#endregion
//#region node_modules/lodash/upperFirst.js
var require_upperFirst = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__createCaseFirst()("toUpperCase");
}));
//#endregion
//#region node_modules/lodash/startCase.js
var require_startCase = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createCompounder = require__createCompounder();
	var upperFirst = require_upperFirst();
	module.exports = createCompounder(function(result, word, index) {
		return result + (index ? " " : "") + upperFirst(word);
	});
}));
//#endregion
//#region node_modules/lodash/_baseRange.js
var require__baseRange = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeCeil = Math.ceil;
	var nativeMax = Math.max;
	/**
	* The base implementation of `_.range` and `_.rangeRight` which doesn't
	* coerce arguments.
	*
	* @private
	* @param {number} start The start of the range.
	* @param {number} end The end of the range.
	* @param {number} step The value to increment or decrement by.
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {Array} Returns the range of numbers.
	*/
	function baseRange(start, end, step, fromRight) {
		var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
		while (length--) {
			result[fromRight ? length : ++index] = start;
			start += step;
		}
		return result;
	}
	module.exports = baseRange;
}));
//#endregion
//#region node_modules/lodash/_isIterateeCall.js
var require__isIterateeCall = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var eq = require_eq();
	var isArrayLike = require_isArrayLike();
	var isIndex = require__isIndex();
	var isObject = require_isObject();
	/**
	* Checks if the given arguments are from an iteratee call.
	*
	* @private
	* @param {*} value The potential iteratee value argument.
	* @param {*} index The potential iteratee index or key argument.
	* @param {*} object The potential iteratee object argument.
	* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	*  else `false`.
	*/
	function isIterateeCall(value, index, object) {
		if (!isObject(object)) return false;
		var type = typeof index;
		if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
		return false;
	}
	module.exports = isIterateeCall;
}));
//#endregion
//#region node_modules/lodash/_trimmedEndIndex.js
var require__trimmedEndIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to match a single whitespace character. */
	var reWhitespace = /\s/;
	/**
	* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	* character of `string`.
	*
	* @private
	* @param {string} string The string to inspect.
	* @returns {number} Returns the index of the last non-whitespace character.
	*/
	function trimmedEndIndex(string) {
		var index = string.length;
		while (index-- && reWhitespace.test(string.charAt(index)));
		return index;
	}
	module.exports = trimmedEndIndex;
}));
//#endregion
//#region node_modules/lodash/_baseTrim.js
var require__baseTrim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var trimmedEndIndex = require__trimmedEndIndex();
	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;
	/**
	* The base implementation of `_.trim`.
	*
	* @private
	* @param {string} string The string to trim.
	* @returns {string} Returns the trimmed string.
	*/
	function baseTrim(string) {
		return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
	}
	module.exports = baseTrim;
}));
//#endregion
//#region node_modules/lodash/toNumber.js
var require_toNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseTrim = require__baseTrim();
	var isObject = require_isObject();
	var isSymbol = require_isSymbol();
	/** Used as references for various `Number` constants. */
	var NAN = NaN;
	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;
	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;
	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;
	/**
	* Converts `value` to a number.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to process.
	* @returns {number} Returns the number.
	* @example
	*
	* _.toNumber(3.2);
	* // => 3.2
	*
	* _.toNumber(Number.MIN_VALUE);
	* // => 5e-324
	*
	* _.toNumber(Infinity);
	* // => Infinity
	*
	* _.toNumber('3.2');
	* // => 3.2
	*/
	function toNumber(value) {
		if (typeof value == "number") return value;
		if (isSymbol(value)) return NAN;
		if (isObject(value)) {
			var other = typeof value.valueOf == "function" ? value.valueOf() : value;
			value = isObject(other) ? other + "" : other;
		}
		if (typeof value != "string") return value === 0 ? value : +value;
		value = baseTrim(value);
		var isBinary = reIsBinary.test(value);
		return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}
	module.exports = toNumber;
}));
//#endregion
//#region node_modules/lodash/toFinite.js
var require_toFinite = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toNumber = require_toNumber();
	/** Used as references for various `Number` constants. */
	var INFINITY = Infinity;
	var MAX_INTEGER = 17976931348623157e292;
	/**
	* Converts `value` to a finite number.
	*
	* @static
	* @memberOf _
	* @since 4.12.0
	* @category Lang
	* @param {*} value The value to convert.
	* @returns {number} Returns the converted number.
	* @example
	*
	* _.toFinite(3.2);
	* // => 3.2
	*
	* _.toFinite(Number.MIN_VALUE);
	* // => 5e-324
	*
	* _.toFinite(Infinity);
	* // => 1.7976931348623157e+308
	*
	* _.toFinite('3.2');
	* // => 3.2
	*/
	function toFinite(value) {
		if (!value) return value === 0 ? value : 0;
		value = toNumber(value);
		if (value === INFINITY || value === -INFINITY) return (value < 0 ? -1 : 1) * MAX_INTEGER;
		return value === value ? value : 0;
	}
	module.exports = toFinite;
}));
//#endregion
//#region node_modules/lodash/_createRange.js
var require__createRange = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseRange = require__baseRange();
	var isIterateeCall = require__isIterateeCall();
	var toFinite = require_toFinite();
	/**
	* Creates a `_.range` or `_.rangeRight` function.
	*
	* @private
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {Function} Returns the new range function.
	*/
	function createRange(fromRight) {
		return function(start, end, step) {
			if (step && typeof step != "number" && isIterateeCall(start, end, step)) end = step = void 0;
			start = toFinite(start);
			if (end === void 0) {
				end = start;
				start = 0;
			} else end = toFinite(end);
			step = step === void 0 ? start < end ? 1 : -1 : toFinite(step);
			return baseRange(start, end, step, fromRight);
		};
	}
	module.exports = createRange;
}));
//#endregion
//#region node_modules/lodash/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__createRange()();
}));
//#endregion
//#region node_modules/lodash/_baseHas.js
var require__baseHas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* The base implementation of `_.has` without support for deep paths.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {Array|string} key The key to check.
	* @returns {boolean} Returns `true` if `key` exists, else `false`.
	*/
	function baseHas(object, key) {
		return object != null && hasOwnProperty.call(object, key);
	}
	module.exports = baseHas;
}));
//#endregion
//#region node_modules/lodash/has.js
var require_has = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseHas = require__baseHas();
	var hasPath = require__hasPath();
	/**
	* Checks if `path` is a direct property of `object`.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Object
	* @param {Object} object The object to query.
	* @param {Array|string} path The path to check.
	* @returns {boolean} Returns `true` if `path` exists, else `false`.
	* @example
	*
	* var object = { 'a': { 'b': 2 } };
	* var other = _.create({ 'a': _.create({ 'b': 2 }) });
	*
	* _.has(object, 'a');
	* // => true
	*
	* _.has(object, 'a.b');
	* // => true
	*
	* _.has(object, ['a', 'b']);
	* // => true
	*
	* _.has(other, 'a');
	* // => false
	*/
	function has(object, path) {
		return object != null && hasPath(object, path, baseHas);
	}
	module.exports = has;
}));
//#endregion
//#region node_modules/lodash/_createFind.js
var require__createFind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIteratee = require__baseIteratee();
	var isArrayLike = require_isArrayLike();
	var keys = require_keys();
	/**
	* Creates a `_.find` or `_.findLast` function.
	*
	* @private
	* @param {Function} findIndexFunc The function to find the collection index.
	* @returns {Function} Returns the new find function.
	*/
	function createFind(findIndexFunc) {
		return function(collection, predicate, fromIndex) {
			var iterable = Object(collection);
			if (!isArrayLike(collection)) {
				var iteratee = baseIteratee(predicate, 3);
				collection = keys(collection);
				predicate = function(key) {
					return iteratee(iterable[key], key, iterable);
				};
			}
			var index = findIndexFunc(collection, predicate, fromIndex);
			return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
		};
	}
	module.exports = createFind;
}));
//#endregion
//#region node_modules/lodash/_baseFindIndex.js
var require__baseFindIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.findIndex` and `_.findLastIndex` without
	* support for iteratee shorthands.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {Function} predicate The function invoked per iteration.
	* @param {number} fromIndex The index to search from.
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
		var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
		while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
		return -1;
	}
	module.exports = baseFindIndex;
}));
//#endregion
//#region node_modules/lodash/toInteger.js
var require_toInteger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toFinite = require_toFinite();
	/**
	* Converts `value` to an integer.
	*
	* **Note:** This method is loosely based on
	* [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to convert.
	* @returns {number} Returns the converted integer.
	* @example
	*
	* _.toInteger(3.2);
	* // => 3
	*
	* _.toInteger(Number.MIN_VALUE);
	* // => 0
	*
	* _.toInteger(Infinity);
	* // => 1.7976931348623157e+308
	*
	* _.toInteger('3.2');
	* // => 3
	*/
	function toInteger(value) {
		var result = toFinite(value), remainder = result % 1;
		return result === result ? remainder ? result - remainder : result : 0;
	}
	module.exports = toInteger;
}));
//#endregion
//#region node_modules/lodash/findIndex.js
var require_findIndex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseFindIndex = require__baseFindIndex();
	var baseIteratee = require__baseIteratee();
	var toInteger = require_toInteger();
	var nativeMax = Math.max;
	/**
	* This method is like `_.find` except that it returns the index of the first
	* element `predicate` returns truthy for instead of the element itself.
	*
	* @static
	* @memberOf _
	* @since 1.1.0
	* @category Array
	* @param {Array} array The array to inspect.
	* @param {Function} [predicate=_.identity] The function invoked per iteration.
	* @param {number} [fromIndex=0] The index to search from.
	* @returns {number} Returns the index of the found element, else `-1`.
	* @example
	*
	* var users = [
	*   { 'user': 'barney',  'active': false },
	*   { 'user': 'fred',    'active': false },
	*   { 'user': 'pebbles', 'active': true }
	* ];
	*
	* _.findIndex(users, function(o) { return o.user == 'barney'; });
	* // => 0
	*
	* // The `_.matches` iteratee shorthand.
	* _.findIndex(users, { 'user': 'fred', 'active': false });
	* // => 1
	*
	* // The `_.matchesProperty` iteratee shorthand.
	* _.findIndex(users, ['active', false]);
	* // => 0
	*
	* // The `_.property` iteratee shorthand.
	* _.findIndex(users, 'active');
	* // => 2
	*/
	function findIndex(array, predicate, fromIndex) {
		var length = array == null ? 0 : array.length;
		if (!length) return -1;
		var index = fromIndex == null ? 0 : toInteger(fromIndex);
		if (index < 0) index = nativeMax(length + index, 0);
		return baseFindIndex(array, baseIteratee(predicate, 3), index);
	}
	module.exports = findIndex;
}));
//#endregion
//#region node_modules/lodash/find.js
var require_find = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__createFind()(require_findIndex());
}));
//#endregion
//#region node_modules/lodash/_baseIsNaN.js
var require__baseIsNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.isNaN` without support for number objects.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	*/
	function baseIsNaN(value) {
		return value !== value;
	}
	module.exports = baseIsNaN;
}));
//#endregion
//#region node_modules/lodash/_strictIndexOf.js
var require__strictIndexOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.indexOf` which performs strict equality
	* comparisons of values, i.e. `===`.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} value The value to search for.
	* @param {number} fromIndex The index to search from.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function strictIndexOf(array, value, fromIndex) {
		var index = fromIndex - 1, length = array.length;
		while (++index < length) if (array[index] === value) return index;
		return -1;
	}
	module.exports = strictIndexOf;
}));
//#endregion
//#region node_modules/lodash/_baseIndexOf.js
var require__baseIndexOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseFindIndex = require__baseFindIndex();
	var baseIsNaN = require__baseIsNaN();
	var strictIndexOf = require__strictIndexOf();
	/**
	* The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} value The value to search for.
	* @param {number} fromIndex The index to search from.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function baseIndexOf(array, value, fromIndex) {
		return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
	}
	module.exports = baseIndexOf;
}));
//#endregion
//#region node_modules/lodash/isString.js
var require_isString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isArray = require_isArray();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var stringTag = "[object String]";
	/**
	* Checks if `value` is classified as a `String` primitive or object.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a string, else `false`.
	* @example
	*
	* _.isString('abc');
	* // => true
	*
	* _.isString(1);
	* // => false
	*/
	function isString(value) {
		return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
	}
	module.exports = isString;
}));
//#endregion
//#region node_modules/lodash/_baseValues.js
var require__baseValues = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayMap = require__arrayMap();
	/**
	* The base implementation of `_.values` and `_.valuesIn` which creates an
	* array of `object` property values corresponding to the property names
	* of `props`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Array} props The property names to get values for.
	* @returns {Object} Returns the array of property values.
	*/
	function baseValues(object, props) {
		return arrayMap(props, function(key) {
			return object[key];
		});
	}
	module.exports = baseValues;
}));
//#endregion
//#region node_modules/lodash/values.js
var require_values = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseValues = require__baseValues();
	var keys = require_keys();
	/**
	* Creates an array of the own enumerable string keyed property values of `object`.
	*
	* **Note:** Non-object values are coerced to objects.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Object
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property values.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.values(new Foo);
	* // => [1, 2] (iteration order is not guaranteed)
	*
	* _.values('hi');
	* // => ['h', 'i']
	*/
	function values(object) {
		return object == null ? [] : baseValues(object, keys(object));
	}
	module.exports = values;
}));
//#endregion
//#region node_modules/lodash/includes.js
var require_includes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIndexOf = require__baseIndexOf();
	var isArrayLike = require_isArrayLike();
	var isString = require_isString();
	var toInteger = require_toInteger();
	var values = require_values();
	var nativeMax = Math.max;
	/**
	* Checks if `value` is in `collection`. If `collection` is a string, it's
	* checked for a substring of `value`, otherwise
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* is used for equality comparisons. If `fromIndex` is negative, it's used as
	* the offset from the end of `collection`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Collection
	* @param {Array|Object|string} collection The collection to inspect.
	* @param {*} value The value to search for.
	* @param {number} [fromIndex=0] The index to search from.
	* @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
	* @returns {boolean} Returns `true` if `value` is found, else `false`.
	* @example
	*
	* _.includes([1, 2, 3], 1);
	* // => true
	*
	* _.includes([1, 2, 3], 1, 2);
	* // => false
	*
	* _.includes({ 'a': 1, 'b': 2 }, 1);
	* // => true
	*
	* _.includes('abcd', 'bc');
	* // => true
	*/
	function includes(collection, value, fromIndex, guard) {
		collection = isArrayLike(collection) ? collection : values(collection);
		fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
		var length = collection.length;
		if (fromIndex < 0) fromIndex = nativeMax(length + fromIndex, 0);
		return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
	}
	module.exports = includes;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/code.js
var require_code$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$1();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$1();
	var scope_1 = require_scope();
	var code_2 = require_code$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen();
	var code_1 = require_code$1();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
//#endregion
//#region node_modules/ajv/dist/compile/names.js
var require_names = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
//#endregion
//#region node_modules/ajv/dist/compile/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/rules.js
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules();
	var applicability_1 = require_applicability();
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/code.js
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	var util_2 = require_util();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var code_1 = require_code();
	var errors_1 = require_errors();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
//#endregion
//#region node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/resolve.js
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) if (ref[0] === "#") {
					checkAmbiguosRef(sch, localRefs[ref], ref);
					localRefs[ref] = sch;
				} else this.refs[ref] = fullPath;
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/index.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults();
	var keyword_1 = require_keyword();
	var subschema_1 = require_subschema();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var errors_1 = require_errors();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
//#endregion
//#region node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
//#endregion
//#region node_modules/ajv/dist/compile/index.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen();
	var validation_error_1 = require_validation_error();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var validate_1 = require_validate();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
//#endregion
//#region node_modules/ajv/dist/refs/data.json
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$1,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description,
	properties: () => properties$1,
	required: () => required,
	type: () => type$1
}), $id$1, description, type$1, required, properties$1, data_default;
var init_data = __esmMin((() => {
	$id$1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$1 = "object";
	required = ["$data"];
	properties$1 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$1,
		description,
		type: type$1,
		required,
		properties: properties$1,
		additionalProperties: false
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isPort = RegExp.prototype.test.bind(/^\d*$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
	/** @type {(value: string) => boolean} */
	var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
	/** @type {(value: string) => boolean} */
	var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
	var BYTE_HEX = new Array(256);
	{
		const HEX_DIGITS = "0123456789ABCDEF";
		for (let i = 0; i < 256; i++) BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
	}
	function percentEncodeNonAscii(cp) {
		if (cp < 2048) return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
		if (cp < 65536) return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
		return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
	}
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/** @type {(value: string) => boolean} */
	var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
	/** @type {(value: string) => boolean} */
	var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
	/** @type {(value: string) => boolean} */
	var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {string} zone
	* @returns {boolean}
	*/
	function isZoneIdentifier(zone) {
		if (zone.length === 0) return false;
		for (let i = 0; i < zone.length; i++) {
			if (isZoneCharacter(zone[i])) continue;
			if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
				i += 2;
				continue;
			}
			return false;
		}
		return true;
	}
	/**
	* Compresses the longest run of zero hextets to "::" per RFC 5952. A run of a
	* single zero hextet is left uncompressed. On ties the leftmost run wins.
	*
	* @param {string[]} hextets
	* @returns {string}
	*/
	function compressIPv6ZeroRun(hextets) {
		let bestStart = -1;
		let bestLength = 0;
		let runStart = -1;
		let runLength = 0;
		for (let i = 0; i < hextets.length; i++) if (hextets[i] === "0") {
			if (runStart === -1) runStart = i;
			runLength++;
			if (runLength > bestLength) {
				bestLength = runLength;
				bestStart = runStart;
			}
		} else {
			runStart = -1;
			runLength = 0;
		}
		if (bestLength < 2) return hextets.join(":");
		const head = hextets.slice(0, bestStart).join(":");
		const tail = hextets.slice(bestStart + bestLength).join(":");
		return head + "::" + tail;
	}
	/**
	* Validates an IPv6 address against the alternatives in RFC 3986 section
	* 3.2.2 and returns the same address with leading hextet zeroes removed.
	* An embedded IPv4 address counts as two hextets and is only valid at the end.
	*
	* @param {string} input
	* @returns {string|undefined}
	*/
	function normalizeIPv6Address(input) {
		const compression = input.indexOf("::");
		if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
		const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
		const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
		if (compression !== -1) {
			if (left.length === 1 && left[0] === "") left.length = 0;
			if (right.length === 1 && right[0] === "") right.length = 0;
		}
		const parts = left.concat(right);
		let hextetCount = 0;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part === "") return void 0;
			if (part.indexOf(".") !== -1) {
				if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
				hextetCount += 2;
				continue;
			}
			if (!isHextet(part)) return void 0;
			parts[i] = parseInt(part, 16).toString(16);
			hextetCount++;
		}
		if (compression === -1) {
			if (hextetCount !== 8) return void 0;
			return compressIPv6ZeroRun(parts);
		}
		if (hextetCount >= 8) return void 0;
		const expanded = parts.slice(0, left.length);
		for (let i = hextetCount; i < 8; i++) expanded.push("0");
		for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
		return compressIPv6ZeroRun(expanded);
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	* @property {boolean} [isIPVFuture] - Indicates if the host is an IPvFuture literal.
	* @property {boolean} [error] - Indicates if a bracketed IP literal is malformed.
	*/
	/**
	* Validates and normalizes a bracketed IP literal. Raw zone separators remain
	* accepted for backwards compatibility, while encoded separators and zone
	* contents follow RFC 6874.
	*
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		const bracketed = host[0] === "[" && host[host.length - 1] === "]";
		if ((host[0] === "[" || host[host.length - 1] === "]") && !bracketed) return {
			host,
			isIPV6: false,
			error: true
		};
		let input = bracketed ? host.slice(1, -1) : host;
		if (bracketed && isIPvFuture(input)) {
			input = input.toLowerCase();
			return {
				host: `[${input}]`,
				escapedHost: input,
				isIPV6: false,
				isIPVFuture: true
			};
		}
		if (findToken(input, ":") < 2) return {
			host,
			isIPV6: false,
			error: bracketed
		};
		let zoneIdentifier = "";
		const zoneSeparator = input.indexOf("%");
		if (zoneSeparator !== -1) {
			const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
			zoneIdentifier = input.slice(zoneSeparator + separatorLength);
			if (!isZoneIdentifier(zoneIdentifier)) return {
				host,
				isIPV6: false,
				error: true
			};
			input = input.slice(0, zoneSeparator);
		}
		const address = normalizeIPv6Address(input);
		if (address === void 0) return {
			host,
			isIPV6: false,
			error: true
		};
		return {
			host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
			escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
			isIPV6: true
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) if (input === ".") break;
			else if (input === "/") {
				output.push("/");
				break;
			} else {
				output.push(input);
				break;
			}
			else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Removes dot segments from the path of a relative reference (a path that does
	* not start with "/") without changing what it resolves to against any base.
	* Unlike `removeDotSegments`, leading ".." segments that cannot be collapsed
	* are kept, the result never becomes root-relative, and a result that would be
	* empty or start with an empty segment is prefixed with "." (an empty path
	* means "same document" and a leading "//" would introduce an authority).
	*
	* @param {string} path
	* @returns {string}
	*/
	function removeDotSegmentsRelative(path) {
		if (path === "" || path[0] === "/") return removeDotSegments(path);
		const segments = path.split("/");
		const last = segments.length - 1;
		/** @type {string[]} */
		const output = [];
		let trailingDirectory = false;
		for (let i = 0; i <= last; i++) {
			const segment = segments[i];
			if (segment === "." || segment === "..") {
				if (segment === "..") if (output.length !== 0 && output[output.length - 1] !== "..") output.pop();
				else output.push("..");
				trailingDirectory = i === last;
			} else output.push(segment);
		}
		if (trailingDirectory && output[output.length - 1] !== "..") output.push("");
		if (output.length === 0 || output[0] === "" || output[0].includes(":")) output.unshift(".");
		return output.join("/");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` stay escaped; `%2E` is unreserved.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Serializes a path without rewriting reserved data. Raw RFC 3986 path
	* characters remain literal, valid escapes are preserved and uppercased, and
	* everything else is UTF-8 percent-encoded. In a path-noscheme, a colon in the
	* first segment must be escaped so the result cannot be parsed as a scheme.
	*
	* @param {string} input
	* @param {boolean} [pathNoScheme=false]
	* @returns {string}
	*/
	function serializePathEncoding(input, pathNoScheme = false) {
		let output = "";
		let firstSegment = pathNoScheme && input[0] !== "/";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			if (ch === "/") firstSegment = false;
			if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Percent-encodes a URI component using its RFC 3986 literal character set.
	* Existing valid escapes are preserved and normalized to uppercase hex.
	*
	* @param {string} input
	* @param {(value: string) => boolean} isAllowed
	* @returns {string}
	*/
	function encodeComponent(input, isAllowed) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			if (isAllowed(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Encodes userinfo while preserving its RFC 3986 §3.2.1 literal characters.
	* In particular, authority delimiters such as `@`, `/`, `?`, and `#` are data.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeUserinfo(input) {
		return encodeComponent(input, isUserinfoCharacter);
	}
	/**
	* Encodes query data using the RFC 3986 §3.4 grammar. A literal `#` must be
	* escaped because it would otherwise begin the fragment component.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeQuery(input) {
		return encodeComponent(input, isQueryFragmentCharacter);
	}
	/**
	* Encodes fragment data using the RFC 3986 §3.5 grammar.
	*
	* @param {string} input
	* @returns {string}
	*/
	function encodeFragment(input) {
		return encodeComponent(input, isQueryFragmentCharacter);
	}
	function isEscapeSafe(cp) {
		return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
	}
	/**
	* Normalizes the percent-encoding of a query or fragment component.
	*
	* Like `normalizePathEncoding`, but uses the query/fragment character set
	* (which additionally allows `?`) and decodes `.` since it has no dot-segment
	* meaning outside of a path.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizeQueryFragmentEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			const ch = input[i];
			if (ch === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isQueryFragmentCharacter(ch)) output += ch;
			else {
				const code = input.charCodeAt(i);
				if (code < 128) output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
				else if (code < 55296 || code > 57343) output += percentEncodeNonAscii(code);
				else if (code <= 56319 && i + 1 < input.length) {
					const low = input.charCodeAt(i + 1);
					if (low >= 56320 && low <= 57343) {
						output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
						i++;
					} else output += percentEncodeNonAscii(65533);
				} else output += percentEncodeNonAscii(65533);
			}
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(encodeUserinfo(component.userinfo));
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = component.host;
			if (!isIPv4(host)) {
				let ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
					host = normalizePercentEncoding(host, true);
					ipV6res = normalizeIPv6(host);
				}
				if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			const port = String(component.port);
			if (!isPort(port)) throw new TypeError("URI port is malformed.");
			uriTokens.push(":");
			uriTokens.push(port);
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		serializePathEncoding,
		normalizeQueryFragmentEncoding,
		encodeUserinfo,
		encodeQuery,
		encodeFragment,
		escapePreservingEscapes,
		removeDotSegments,
		removeDotSegmentsRelative,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/schemes.js
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils();
	var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const queryIndex = wsComponent.resourceName.indexOf("?");
			const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches && matches[0] === urnComponent.path) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
//#endregion
//#region node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	var { SCHEMES, getSchemeHandler } = require_schemes();
	var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
	var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
	var MALFORMED_HOST_ERROR = "URI host is malformed.";
	var FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
	/**
	* RFC 3986 section 3.1 does not allow percent-encoding in a scheme, so the
	* scheme is validated as-is and never decoded. Decoding would let inert input
	* such as `%6Aavascript:` become a live `javascript:` scheme.
	*
	* @param {string} scheme
	* @returns {string}
	*/
	function validateScheme(scheme) {
		const stringScheme = String(scheme);
		if (!VALID_SCHEME.test(stringScheme)) throw new TypeError(MALFORMED_SCHEME_ERROR);
		return stringScheme;
	}
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed, malformedPercentEncoding: baseMalformedPercentEncoding, malformedSchemeSpecific: baseMalformedSchemeSpecific, malformedHost: baseMalformedHost, malformedScheme: baseMalformedScheme } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed, malformedPercentEncoding: relativeMalformedPercentEncoding, malformedSchemeSpecific: relativeMalformedSchemeSpecific, malformedHost: relativeMalformedHost, malformedScheme: relativeMalformedScheme } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
		const resolvedHost = resolved.host;
		const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
		if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) throw new Error(MALFORMED_HOST_ERROR);
		canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
		const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !/\P{ASCII}/u.test(resolvedHost);
		if (resolved.error && !encodedASCIIHost) throw new Error(resolved.error);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						const baseHasAuthority = base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0;
						if (baseHasAuthority && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = base.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		if (component.scheme) component.scheme = validateScheme(component.scheme);
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
		const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
		const pathNoScheme = !options.skipEscape && schemelessReference;
		if (component.path !== void 0) if (!options.skipEscape) component.path = serializePathEncoding(component.path, pathNoScheme);
		else component.path = normalizePercentEncoding(component.path);
		if (options.reference !== "suffix" && component.scheme) {
			component.scheme = validateScheme(component.scheme);
			uriTokens.push(component.scheme, ":");
		}
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
			if (schemelessReference) s = serializePathEncoding(s, true);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", encodeQuery(component.query));
		if (component.fragment !== void 0) uriTokens.push("#", encodeFragment(component.fragment));
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* Checks percent syntax without decoding the represented octets. RFC 3986
	* percent-encoding is byte-oriented, so sequences such as `%FF` are valid even
	* though they are not independently valid UTF-8.
	*
	* @param {string|undefined} component
	* @returns {boolean}
	*/
	function hasMalformedPercentEncoding(component) {
		if (component === void 0) return false;
		let percent = component.indexOf("%");
		while (percent !== -1) {
			if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) return true;
			percent = component.indexOf("%", percent + 3);
		}
		return false;
	}
	/**
	* Whether the host is a bracketed IP literal (RFC 3986 `IP-literal`).
	* An unterminated `[` is not a literal, so it must still be validated as a
	* reg-name instead of being waved through as an IP.
	*
	* @param {string} host
	* @returns {boolean}
	*/
	function isIPLiteral(host) {
		return host[0] === "[" && host[host.length - 1] === "]";
	}
	/**
	* @param {RegExpMatchArray} matches
	* @returns {boolean}
	*/
	function hasMalformedComponentPercentEncoding(matches) {
		const host = matches[4];
		return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
	}
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean, unicodeSupport?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean} whether host conversion failed
	*/
	function canonicalizeHost(parsed, options, schemeHandler, isIP) {
		if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP)) {
			parsed.error = parsed.error || MALFORMED_HOST_ERROR;
			return true;
		}
		if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
			let url;
			try {
				url = new URL("http://" + parsed.host);
			} catch (e) {
				parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				return true;
			}
			if (!isHostOnlyURL(url)) {
				parsed.error = parsed.error || MALFORMED_HOST_ERROR;
				return true;
			}
			parsed.host = url.hostname;
		}
		return false;
	}
	/**
	* Whether a domain host contains an ASCII character that RFC 3986 does not
	* allow in a reg-name (unreserved, sub-delims, or pct-encoded). Such a host is
	* rejected instead of being handed to the WHATWG URL parser, which would treat
	* "@" as a userinfo delimiter (silently dropping the data before it) and strip
	* TAB, LF, and CR. Non-ASCII characters remain allowed for IDNs.
	*
	* @param {import('./types/index').URIComponent} parsed
	* @param {import('./types/index').Options} options
	* @param {{ domainHost?: boolean }|undefined} schemeHandler
	* @param {boolean} isIP
	* @returns {boolean}
	*/
	function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP) {
		return Boolean(parsed.host && isIP === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host));
	}
	/**
	* @param {URL} url
	* @returns {boolean}
	*/
	function isHostOnlyURL(url) {
		return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let malformedPercentEncoding = false;
		let malformedSchemeSpecific = false;
		let malformedHost = false;
		let malformedIPLiteral = false;
		let malformedScheme = false;
		let isIP = false;
		if (options.reference === "suffix") if (options.scheme) uri = options.scheme + ":" + uri;
		else uri = "//" + uri;
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (parsed.scheme !== void 0) if (VALID_SCHEME.test(parsed.scheme)) parsed.scheme = parsed.scheme.toLowerCase();
			else {
				parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
				malformedScheme = true;
			}
			malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
			if (malformedPercentEncoding) parsed.error = parsed.error || "URI contains malformed percent-encoding.";
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) if (isIPv4(parsed.host) === false) {
				const bracketedIPLiteral = isIPLiteral(parsed.host);
				const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
				const ipv6result = normalizeIPv6(parsed.host);
				isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
				malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
				parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
				if (malformedIPLiteral) {
					parsed.error = parsed.error || MALFORMED_HOST_ERROR;
					malformedAuthorityOrPort = true;
				}
			} else isIP = true;
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!malformedIPLiteral) malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
			if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
				let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
				if (!isIP) host = normalizePercentEncoding(host.toLowerCase());
				parsed.host = isIP || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP) : host;
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.query) parsed.query = normalizeQueryFragmentEncoding(parsed.query);
				if (parsed.fragment) parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
			}
			if (schemeHandler && schemeHandler.parse) {
				schemeHandler.parse(parsed, options);
				if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) malformedSchemeSpecific = true;
			}
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean, malformedPercentEncoding: boolean, malformedSchemeSpecific: boolean, malformedHost: boolean, malformedScheme: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort,
			malformedPercentEncoding,
			malformedSchemeSpecific,
			malformedHost,
			malformedScheme
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri !== "string" && typeof uri !== "object") return;
		let value;
		try {
			value = typeof uri === "string" ? uri : serialize(uri, opts);
		} catch {
			return;
		}
		const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
		return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
//#endregion
//#region node_modules/ajv/dist/runtime/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
//#endregion
//#region node_modules/ajv/dist/core.js
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	var ref_error_1 = require_ref_error();
	var rules_1 = require_rules();
	var compile_1 = require_compile();
	var codegen_2 = require_codegen();
	var resolve_1 = require_resolve();
	var dataType_1 = require_dataType();
	var util_1 = require_util();
	var $dataRefSchema = (init_data(), __toCommonJS(data_exports).default);
	var uri_1 = require_uri();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error();
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var util_1 = require_util();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) if (schEvaluated && !schEvaluated.dynamicProps) {
				if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
			} else {
				const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
				it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
			}
			if (it.items !== true) if (schEvaluated && !schEvaluated.dynamicItems) {
				if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
			} else {
				const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
				it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id();
	var ref_1 = require_ref();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var ucs2length_1 = require_ucs2length();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var util_1 = require_util();
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/runtime/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber();
	var multipleOf_1 = require_multipleOf();
	var limitLength_1 = require_limitLength();
	var pattern_1 = require_pattern();
	var limitProperties_1 = require_limitProperties();
	var required_1 = require_required();
	var limitItems_1 = require_limitItems();
	var uniqueItems_1 = require_uniqueItems();
	var const_1 = require_const();
	var enum_1 = require_enum();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var additionalItems_1 = require_additionalItems();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var util_1 = require_util();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate();
	var code_1 = require_code();
	var util_1 = require_util();
	var additionalProperties_1 = require_additionalProperties();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var util_2 = require_util();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems();
	var prefixItems_1 = require_prefixItems();
	var items_1 = require_items();
	var items2020_1 = require_items2020();
	var contains_1 = require_contains();
	var dependencies_1 = require_dependencies();
	var propertyNames_1 = require_propertyNames();
	var additionalProperties_1 = require_additionalProperties();
	var properties_1 = require_properties();
	var patternProperties_1 = require_patternProperties();
	var not_1 = require_not();
	var anyOf_1 = require_anyOf();
	var oneOf_1 = require_oneOf();
	var allOf_1 = require_allOf();
	var if_1 = require_if();
	var thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/format/format.js
var require_format$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/format/index.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var types_1 = require_types();
	var compile_1 = require_compile();
	var ref_error_1 = require_ref_error();
	var util_1 = require_util();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-draft-07.json
var json_schema_draft_07_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id,
	$schema: () => $schema,
	default: () => json_schema_draft_07_default,
	definitions: () => definitions,
	properties: () => properties,
	title: () => title,
	type: () => type
});
var $schema, $id, title, definitions, type, properties, json_schema_draft_07_default;
var init_json_schema_draft_07 = __esmMin((() => {
	$schema = "http://json-schema.org/draft-07/schema#";
	$id = "http://json-schema.org/draft-07/schema#";
	title = "Core schema meta-schema";
	definitions = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type = ["object", "boolean"];
	properties = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default = {
		$schema,
		$id,
		title,
		definitions,
		type,
		properties,
		"default": true
	};
}));
//#endregion
//#region node_modules/ajv/dist/ajv.js
var require_ajv = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$1();
	var draft7_1 = require_draft7();
	var discriminator_1 = require_discriminator();
	var draft7MetaSchema = (init_json_schema_draft_07(), __toCommonJS(json_schema_draft_07_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/ajv-formats/dist/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
	function fmtDef(validate, compare) {
		return {
			validate,
			compare
		};
	}
	exports.fullFormats = {
		date: fmtDef(date, compareDate),
		time: fmtDef(time, compareTime),
		"date-time": fmtDef(date_time, compareDateTime),
		duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
		uri,
		"uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
		"uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
		url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
		email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
		hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
		ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
		ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
		regex,
		uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
		"json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
		"json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
		"relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
		byte,
		int32: {
			type: "number",
			validate: validateInt32
		},
		int64: {
			type: "number",
			validate: validateInt64
		},
		float: {
			type: "number",
			validate: validateNumber
		},
		double: {
			type: "number",
			validate: validateNumber
		},
		password: true,
		binary: true
	};
	exports.fastFormats = {
		...exports.fullFormats,
		date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
		time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareTime),
		"date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
		uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
		"uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
		email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
	};
	exports.formatNames = Object.keys(exports.fullFormats);
	function isLeapYear(year) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}
	var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
	var DAYS = [
		0,
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	function date(str) {
		const matches = DATE.exec(str);
		if (!matches) return false;
		const year = +matches[1];
		const month = +matches[2];
		const day = +matches[3];
		return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
	}
	function compareDate(d1, d2) {
		if (!(d1 && d2)) return void 0;
		if (d1 > d2) return 1;
		if (d1 < d2) return -1;
		return 0;
	}
	var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
	function time(str, withTimeZone) {
		const matches = TIME.exec(str);
		if (!matches) return false;
		const hour = +matches[1];
		const minute = +matches[2];
		const second = +matches[3];
		const timeZone = matches[5];
		return (hour <= 23 && minute <= 59 && second <= 59 || hour === 23 && minute === 59 && second === 60) && (!withTimeZone || timeZone !== "");
	}
	function compareTime(t1, t2) {
		if (!(t1 && t2)) return void 0;
		const a1 = TIME.exec(t1);
		const a2 = TIME.exec(t2);
		if (!(a1 && a2)) return void 0;
		t1 = a1[1] + a1[2] + a1[3] + (a1[4] || "");
		t2 = a2[1] + a2[2] + a2[3] + (a2[4] || "");
		if (t1 > t2) return 1;
		if (t1 < t2) return -1;
		return 0;
	}
	var DATE_TIME_SEPARATOR = /t|\s/i;
	function date_time(str) {
		const dateTime = str.split(DATE_TIME_SEPARATOR);
		return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1], true);
	}
	function compareDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
		const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
		const res = compareDate(d1, d2);
		if (res === void 0) return void 0;
		return res || compareTime(t1, t2);
	}
	var NOT_URI_FRAGMENT = /\/|:/;
	var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
	function uri(str) {
		return NOT_URI_FRAGMENT.test(str) && URI.test(str);
	}
	var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
	function byte(str) {
		BYTE.lastIndex = 0;
		return BYTE.test(str);
	}
	var MIN_INT32 = -(2 ** 31);
	var MAX_INT32 = 2 ** 31 - 1;
	function validateInt32(value) {
		return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
	}
	function validateInt64(value) {
		return Number.isInteger(value);
	}
	function validateNumber() {
		return true;
	}
	var Z_ANCHOR = /[^\\]\\Z/;
	function regex(str) {
		if (Z_ANCHOR.test(str)) return false;
		try {
			new RegExp(str);
			return true;
		} catch (e) {
			return false;
		}
	}
}));
//#endregion
//#region node_modules/ajv-formats/dist/limit.js
var require_limit = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatLimitDefinition = void 0;
	var ajv_1 = require_ajv();
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		formatMaximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		formatMinimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		formatExclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		formatExclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.formatLimitDefinition = {
		keyword: Object.keys(KWDs),
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => codegen_1.str`should be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => codegen_1._`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, keyword, it } = cxt;
			const { opts, self } = it;
			if (!opts.validateFormats) return;
			const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
			if (fCxt.$data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fmt = gen.const("fmt", codegen_1._`${fmts}[${fCxt.schemaCode}]`);
				cxt.fail$data(codegen_1.or(codegen_1._`typeof ${fmt} != "object"`, codegen_1._`${fmt} instanceof RegExp`, codegen_1._`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
			}
			function validateFormat() {
				const format = fCxt.schema;
				const fmtDef = self.formats[format];
				if (!fmtDef || fmtDef === true) return;
				if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
				const fmt = gen.scopeValue("formats", {
					key: format,
					ref: fmtDef,
					code: opts.code.formats ? codegen_1._`${opts.code.formats}${codegen_1.getProperty(format)}` : void 0
				});
				cxt.fail$data(compareCode(fmt));
			}
			function compareCode(fmt) {
				return codegen_1._`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
			}
		},
		dependencies: ["format"]
	};
	var formatLimitPlugin = (ajv) => {
		ajv.addKeyword(exports.formatLimitDefinition);
		return ajv;
	};
	exports.default = formatLimitPlugin;
}));
//#endregion
//#region node_modules/ajv-formats/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var formats_1 = require_formats();
	var limit_1 = require_limit();
	var codegen_1 = require_codegen();
	var fullName = new codegen_1.Name("fullFormats");
	var fastName = new codegen_1.Name("fastFormats");
	var formatsPlugin = (ajv, opts = { keywords: true }) => {
		if (Array.isArray(opts)) {
			addFormats(ajv, opts, formats_1.fullFormats, fullName);
			return ajv;
		}
		const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		addFormats(ajv, opts.formats || formats_1.formatNames, formats, exportName);
		if (opts.keywords) limit_1.default(ajv);
		return ajv;
	};
	formatsPlugin.get = (name, mode = "full") => {
		const f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name];
		if (!f) throw new Error(`Unknown format "${name}"`);
		return f;
	};
	function addFormats(ajv, list, fs, exportName) {
		var _a;
		var _b;
		(_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 || (_b.formats = codegen_1._`require("ajv-formats/dist/formats").${exportName}`);
		for (const f of list) ajv.addFormat(f, fs[f]);
	}
	module.exports = exports = formatsPlugin;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = formatsPlugin;
}));
//#endregion
//#region node_modules/lodash/_createBaseFor.js
var require__createBaseFor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Creates a base function for methods like `_.forIn` and `_.forOwn`.
	*
	* @private
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {Function} Returns the new base function.
	*/
	function createBaseFor(fromRight) {
		return function(object, iteratee, keysFunc) {
			var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
			while (length--) {
				var key = props[fromRight ? length : ++index];
				if (iteratee(iterable[key], key, iterable) === false) break;
			}
			return object;
		};
	}
	module.exports = createBaseFor;
}));
//#endregion
//#region node_modules/lodash/_baseFor.js
var require__baseFor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__createBaseFor()();
}));
//#endregion
//#region node_modules/lodash/_baseForOwn.js
var require__baseForOwn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseFor = require__baseFor();
	var keys = require_keys();
	/**
	* The base implementation of `_.forOwn` without support for iteratee shorthands.
	*
	* @private
	* @param {Object} object The object to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Object} Returns `object`.
	*/
	function baseForOwn(object, iteratee) {
		return object && baseFor(object, iteratee, keys);
	}
	module.exports = baseForOwn;
}));
//#endregion
//#region node_modules/lodash/_createBaseEach.js
var require__createBaseEach = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArrayLike = require_isArrayLike();
	/**
	* Creates a `baseEach` or `baseEachRight` function.
	*
	* @private
	* @param {Function} eachFunc The function to iterate over a collection.
	* @param {boolean} [fromRight] Specify iterating from right to left.
	* @returns {Function} Returns the new base function.
	*/
	function createBaseEach(eachFunc, fromRight) {
		return function(collection, iteratee) {
			if (collection == null) return collection;
			if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
			var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
			while (fromRight ? index-- : ++index < length) if (iteratee(iterable[index], index, iterable) === false) break;
			return collection;
		};
	}
	module.exports = createBaseEach;
}));
//#endregion
//#region node_modules/lodash/_baseEach.js
var require__baseEach = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseForOwn = require__baseForOwn();
	module.exports = require__createBaseEach()(baseForOwn);
}));
//#endregion
//#region node_modules/lodash/_baseFilter.js
var require__baseFilter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseEach = require__baseEach();
	/**
	* The base implementation of `_.filter` without support for iteratee shorthands.
	*
	* @private
	* @param {Array|Object} collection The collection to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {Array} Returns the new filtered array.
	*/
	function baseFilter(collection, predicate) {
		var result = [];
		baseEach(collection, function(value, index, collection) {
			if (predicate(value, index, collection)) result.push(value);
		});
		return result;
	}
	module.exports = baseFilter;
}));
//#endregion
//#region node_modules/lodash/filter.js
var require_filter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayFilter = require__arrayFilter();
	var baseFilter = require__baseFilter();
	var baseIteratee = require__baseIteratee();
	var isArray = require_isArray();
	/**
	* Iterates over elements of `collection`, returning an array of all elements
	* `predicate` returns truthy for. The predicate is invoked with three
	* arguments: (value, index|key, collection).
	*
	* **Note:** Unlike `_.remove`, this method returns a new array.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Collection
	* @param {Array|Object} collection The collection to iterate over.
	* @param {Function} [predicate=_.identity] The function invoked per iteration.
	* @returns {Array} Returns the new filtered array.
	* @see _.reject
	* @example
	*
	* var users = [
	*   { 'user': 'barney', 'age': 36, 'active': true },
	*   { 'user': 'fred',   'age': 40, 'active': false }
	* ];
	*
	* _.filter(users, function(o) { return !o.active; });
	* // => objects for ['fred']
	*
	* // The `_.matches` iteratee shorthand.
	* _.filter(users, { 'age': 36, 'active': true });
	* // => objects for ['barney']
	*
	* // The `_.matchesProperty` iteratee shorthand.
	* _.filter(users, ['active', false]);
	* // => objects for ['fred']
	*
	* // The `_.property` iteratee shorthand.
	* _.filter(users, 'active');
	* // => objects for ['barney']
	*
	* // Combining several predicates using `_.overEvery` or `_.overSome`.
	* _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
	* // => objects for ['fred', 'barney']
	*/
	function filter(collection, predicate) {
		return (isArray(collection) ? arrayFilter : baseFilter)(collection, baseIteratee(predicate, 3));
	}
	module.exports = filter;
}));
//#endregion
//#region node_modules/lodash/isEqual.js
var require_isEqual = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsEqual = require__baseIsEqual();
	/**
	* Performs a deep comparison between two values to determine if they are
	* equivalent.
	*
	* **Note:** This method supports comparing arrays, array buffers, booleans,
	* date objects, error objects, maps, numbers, `Object` objects, regexes,
	* sets, strings, symbols, and typed arrays. `Object` objects are compared
	* by their own, not inherited, enumerable properties. Functions and DOM
	* nodes are compared by strict equality, i.e. `===`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.isEqual(object, other);
	* // => true
	*
	* object === other;
	* // => false
	*/
	function isEqual(value, other) {
		return baseIsEqual(value, other);
	}
	module.exports = isEqual;
}));
//#endregion
//#region node_modules/lodash/_defineProperty.js
var require__defineProperty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getNative = require__getNative();
	module.exports = function() {
		try {
			var func = getNative(Object, "defineProperty");
			func({}, "", {});
			return func;
		} catch (e) {}
	}();
}));
//#endregion
//#region node_modules/lodash/_baseAssignValue.js
var require__baseAssignValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var defineProperty = require__defineProperty();
	/**
	* The base implementation of `assignValue` and `assignMergeValue` without
	* value checks.
	*
	* @private
	* @param {Object} object The object to modify.
	* @param {string} key The key of the property to assign.
	* @param {*} value The value to assign.
	*/
	function baseAssignValue(object, key, value) {
		if (key == "__proto__" && defineProperty) defineProperty(object, key, {
			"configurable": true,
			"enumerable": true,
			"value": value,
			"writable": true
		});
		else object[key] = value;
	}
	module.exports = baseAssignValue;
}));
//#endregion
//#region node_modules/lodash/_assignMergeValue.js
var require__assignMergeValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseAssignValue = require__baseAssignValue();
	var eq = require_eq();
	/**
	* This function is like `assignValue` except that it doesn't assign
	* `undefined` values.
	*
	* @private
	* @param {Object} object The object to modify.
	* @param {string} key The key of the property to assign.
	* @param {*} value The value to assign.
	*/
	function assignMergeValue(object, key, value) {
		if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
	}
	module.exports = assignMergeValue;
}));
//#endregion
//#region node_modules/lodash/_cloneBuffer.js
var require__cloneBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var root = require__root();
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	/** Built-in value references. */
	var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0;
	var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
	/**
	* Creates a clone of  `buffer`.
	*
	* @private
	* @param {Buffer} buffer The buffer to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Buffer} Returns the cloned buffer.
	*/
	function cloneBuffer(buffer, isDeep) {
		if (isDeep) return buffer.slice();
		var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
		buffer.copy(result);
		return result;
	}
	module.exports = cloneBuffer;
}));
//#endregion
//#region node_modules/lodash/_cloneArrayBuffer.js
var require__cloneArrayBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Uint8Array = require__Uint8Array();
	/**
	* Creates a clone of `arrayBuffer`.
	*
	* @private
	* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	* @returns {ArrayBuffer} Returns the cloned array buffer.
	*/
	function cloneArrayBuffer(arrayBuffer) {
		var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
		new Uint8Array(result).set(new Uint8Array(arrayBuffer));
		return result;
	}
	module.exports = cloneArrayBuffer;
}));
//#endregion
//#region node_modules/lodash/_cloneTypedArray.js
var require__cloneTypedArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var cloneArrayBuffer = require__cloneArrayBuffer();
	/**
	* Creates a clone of `typedArray`.
	*
	* @private
	* @param {Object} typedArray The typed array to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the cloned typed array.
	*/
	function cloneTypedArray(typedArray, isDeep) {
		var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
		return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}
	module.exports = cloneTypedArray;
}));
//#endregion
//#region node_modules/lodash/_copyArray.js
var require__copyArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Copies the values of `source` to `array`.
	*
	* @private
	* @param {Array} source The array to copy values from.
	* @param {Array} [array=[]] The array to copy values to.
	* @returns {Array} Returns `array`.
	*/
	function copyArray(source, array) {
		var index = -1, length = source.length;
		array || (array = Array(length));
		while (++index < length) array[index] = source[index];
		return array;
	}
	module.exports = copyArray;
}));
//#endregion
//#region node_modules/lodash/_baseCreate.js
var require__baseCreate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_isObject();
	/** Built-in value references. */
	var objectCreate = Object.create;
	module.exports = function() {
		function object() {}
		return function(proto) {
			if (!isObject(proto)) return {};
			if (objectCreate) return objectCreate(proto);
			object.prototype = proto;
			var result = new object();
			object.prototype = void 0;
			return result;
		};
	}();
}));
//#endregion
//#region node_modules/lodash/_getPrototype.js
var require__getPrototype = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__overArg()(Object.getPrototypeOf, Object);
}));
//#endregion
//#region node_modules/lodash/_initCloneObject.js
var require__initCloneObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseCreate = require__baseCreate();
	var getPrototype = require__getPrototype();
	var isPrototype = require__isPrototype();
	/**
	* Initializes an object clone.
	*
	* @private
	* @param {Object} object The object to clone.
	* @returns {Object} Returns the initialized clone.
	*/
	function initCloneObject(object) {
		return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
	}
	module.exports = initCloneObject;
}));
//#endregion
//#region node_modules/lodash/isArrayLikeObject.js
var require_isArrayLikeObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArrayLike = require_isArrayLike();
	var isObjectLike = require_isObjectLike();
	/**
	* This method is like `_.isArrayLike` except that it also checks if `value`
	* is an object.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an array-like object,
	*  else `false`.
	* @example
	*
	* _.isArrayLikeObject([1, 2, 3]);
	* // => true
	*
	* _.isArrayLikeObject(document.body.children);
	* // => true
	*
	* _.isArrayLikeObject('abc');
	* // => false
	*
	* _.isArrayLikeObject(_.noop);
	* // => false
	*/
	function isArrayLikeObject(value) {
		return isObjectLike(value) && isArrayLike(value);
	}
	module.exports = isArrayLikeObject;
}));
//#endregion
//#region node_modules/lodash/isPlainObject.js
var require_isPlainObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var getPrototype = require__getPrototype();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var objectTag = "[object Object]";
	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	/**
	* Checks if `value` is a plain object, that is, an object created by the
	* `Object` constructor or one with a `[[Prototype]]` of `null`.
	*
	* @static
	* @memberOf _
	* @since 0.8.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	* }
	*
	* _.isPlainObject(new Foo);
	* // => false
	*
	* _.isPlainObject([1, 2, 3]);
	* // => false
	*
	* _.isPlainObject({ 'x': 0, 'y': 0 });
	* // => true
	*
	* _.isPlainObject(Object.create(null));
	* // => true
	*/
	function isPlainObject(value) {
		if (!isObjectLike(value) || baseGetTag(value) != objectTag) return false;
		var proto = getPrototype(value);
		if (proto === null) return true;
		var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
		return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
	}
	module.exports = isPlainObject;
}));
//#endregion
//#region node_modules/lodash/_safeGet.js
var require__safeGet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the value at `key`, unless `key` is "__proto__" or "constructor".
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function safeGet(object, key) {
		if (key === "constructor" && typeof object[key] === "function") return;
		if (key == "__proto__") return;
		return object[key];
	}
	module.exports = safeGet;
}));
//#endregion
//#region node_modules/lodash/_assignValue.js
var require__assignValue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseAssignValue = require__baseAssignValue();
	var eq = require_eq();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Assigns `value` to `key` of `object` if the existing value is not equivalent
	* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* for equality comparisons.
	*
	* @private
	* @param {Object} object The object to modify.
	* @param {string} key The key of the property to assign.
	* @param {*} value The value to assign.
	*/
	function assignValue(object, key, value) {
		var objValue = object[key];
		if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
	}
	module.exports = assignValue;
}));
//#endregion
//#region node_modules/lodash/_copyObject.js
var require__copyObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assignValue = require__assignValue();
	var baseAssignValue = require__baseAssignValue();
	/**
	* Copies properties of `source` to `object`.
	*
	* @private
	* @param {Object} source The object to copy properties from.
	* @param {Array} props The property identifiers to copy.
	* @param {Object} [object={}] The object to copy properties to.
	* @param {Function} [customizer] The function to customize copied values.
	* @returns {Object} Returns `object`.
	*/
	function copyObject(source, props, object, customizer) {
		var isNew = !object;
		object || (object = {});
		var index = -1, length = props.length;
		while (++index < length) {
			var key = props[index];
			var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
			if (newValue === void 0) newValue = source[key];
			if (isNew) baseAssignValue(object, key, newValue);
			else assignValue(object, key, newValue);
		}
		return object;
	}
	module.exports = copyObject;
}));
//#endregion
//#region node_modules/lodash/_nativeKeysIn.js
var require__nativeKeysIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This function is like
	* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	* except that it includes inherited enumerable properties.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	*/
	function nativeKeysIn(object) {
		var result = [];
		if (object != null) for (var key in Object(object)) result.push(key);
		return result;
	}
	module.exports = nativeKeysIn;
}));
//#endregion
//#region node_modules/lodash/_baseKeysIn.js
var require__baseKeysIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isObject = require_isObject();
	var isPrototype = require__isPrototype();
	var nativeKeysIn = require__nativeKeysIn();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	*/
	function baseKeysIn(object) {
		if (!isObject(object)) return nativeKeysIn(object);
		var isProto = isPrototype(object), result = [];
		for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) result.push(key);
		return result;
	}
	module.exports = baseKeysIn;
}));
//#endregion
//#region node_modules/lodash/keysIn.js
var require_keysIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayLikeKeys = require__arrayLikeKeys();
	var baseKeysIn = require__baseKeysIn();
	var isArrayLike = require_isArrayLike();
	/**
	* Creates an array of the own and inherited enumerable property names of `object`.
	*
	* **Note:** Non-object values are coerced to objects.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category Object
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.keysIn(new Foo);
	* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	*/
	function keysIn(object) {
		return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}
	module.exports = keysIn;
}));
//#endregion
//#region node_modules/lodash/toPlainObject.js
var require_toPlainObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var copyObject = require__copyObject();
	var keysIn = require_keysIn();
	/**
	* Converts `value` to a plain object flattening inherited enumerable string
	* keyed properties of `value` to own properties of the plain object.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category Lang
	* @param {*} value The value to convert.
	* @returns {Object} Returns the converted plain object.
	* @example
	*
	* function Foo() {
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.assign({ 'a': 1 }, new Foo);
	* // => { 'a': 1, 'b': 2 }
	*
	* _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	* // => { 'a': 1, 'b': 2, 'c': 3 }
	*/
	function toPlainObject(value) {
		return copyObject(value, keysIn(value));
	}
	module.exports = toPlainObject;
}));
//#endregion
//#region node_modules/lodash/_baseMergeDeep.js
var require__baseMergeDeep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assignMergeValue = require__assignMergeValue();
	var cloneBuffer = require__cloneBuffer();
	var cloneTypedArray = require__cloneTypedArray();
	var copyArray = require__copyArray();
	var initCloneObject = require__initCloneObject();
	var isArguments = require_isArguments();
	var isArray = require_isArray();
	var isArrayLikeObject = require_isArrayLikeObject();
	var isBuffer = require_isBuffer();
	var isFunction = require_isFunction();
	var isObject = require_isObject();
	var isPlainObject = require_isPlainObject();
	var isTypedArray = require_isTypedArray();
	var safeGet = require__safeGet();
	var toPlainObject = require_toPlainObject();
	/**
	* A specialized version of `baseMerge` for arrays and objects which performs
	* deep merges and tracks traversed objects enabling objects with circular
	* references to be merged.
	*
	* @private
	* @param {Object} object The destination object.
	* @param {Object} source The source object.
	* @param {string} key The key of the value to merge.
	* @param {number} srcIndex The index of `source`.
	* @param {Function} mergeFunc The function to merge values.
	* @param {Function} [customizer] The function to customize assigned values.
	* @param {Object} [stack] Tracks traversed source values and their merged
	*  counterparts.
	*/
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
		var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
		if (stacked) {
			assignMergeValue(object, key, stacked);
			return;
		}
		var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
		var isCommon = newValue === void 0;
		if (isCommon) {
			var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
			newValue = srcValue;
			if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue;
			else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue);
			else if (isBuff) {
				isCommon = false;
				newValue = cloneBuffer(srcValue, true);
			} else if (isTyped) {
				isCommon = false;
				newValue = cloneTypedArray(srcValue, true);
			} else newValue = [];
			else if (isPlainObject(srcValue) || isArguments(srcValue)) {
				newValue = objValue;
				if (isArguments(objValue)) newValue = toPlainObject(objValue);
				else if (!isObject(objValue) || isFunction(objValue)) newValue = initCloneObject(srcValue);
			} else isCommon = false;
		}
		if (isCommon) {
			stack.set(srcValue, newValue);
			mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
			stack["delete"](srcValue);
		}
		assignMergeValue(object, key, newValue);
	}
	module.exports = baseMergeDeep;
}));
//#endregion
//#region node_modules/lodash/_baseMerge.js
var require__baseMerge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stack = require__Stack();
	var assignMergeValue = require__assignMergeValue();
	var baseFor = require__baseFor();
	var baseMergeDeep = require__baseMergeDeep();
	var isObject = require_isObject();
	var keysIn = require_keysIn();
	var safeGet = require__safeGet();
	/**
	* The base implementation of `_.merge` without support for multiple sources.
	*
	* @private
	* @param {Object} object The destination object.
	* @param {Object} source The source object.
	* @param {number} srcIndex The index of `source`.
	* @param {Function} [customizer] The function to customize merged values.
	* @param {Object} [stack] Tracks traversed source values and their merged
	*  counterparts.
	*/
	function baseMerge(object, source, srcIndex, customizer, stack) {
		if (object === source) return;
		baseFor(source, function(srcValue, key) {
			stack || (stack = new Stack());
			if (isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
			else {
				var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
				if (newValue === void 0) newValue = srcValue;
				assignMergeValue(object, key, newValue);
			}
		}, keysIn);
	}
	module.exports = baseMerge;
}));
//#endregion
//#region node_modules/lodash/_apply.js
var require__apply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A faster alternative to `Function#apply`, this function invokes `func`
	* with the `this` binding of `thisArg` and the arguments of `args`.
	*
	* @private
	* @param {Function} func The function to invoke.
	* @param {*} thisArg The `this` binding of `func`.
	* @param {Array} args The arguments to invoke `func` with.
	* @returns {*} Returns the result of `func`.
	*/
	function apply(func, thisArg, args) {
		switch (args.length) {
			case 0: return func.call(thisArg);
			case 1: return func.call(thisArg, args[0]);
			case 2: return func.call(thisArg, args[0], args[1]);
			case 3: return func.call(thisArg, args[0], args[1], args[2]);
		}
		return func.apply(thisArg, args);
	}
	module.exports = apply;
}));
//#endregion
//#region node_modules/lodash/_overRest.js
var require__overRest = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var apply = require__apply();
	var nativeMax = Math.max;
	/**
	* A specialized version of `baseRest` which transforms the rest array.
	*
	* @private
	* @param {Function} func The function to apply a rest parameter to.
	* @param {number} [start=func.length-1] The start position of the rest parameter.
	* @param {Function} transform The rest array transform.
	* @returns {Function} Returns the new function.
	*/
	function overRest(func, start, transform) {
		start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
		return function() {
			var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
			while (++index < length) array[index] = args[start + index];
			index = -1;
			var otherArgs = Array(start + 1);
			while (++index < start) otherArgs[index] = args[index];
			otherArgs[start] = transform(array);
			return apply(func, this, otherArgs);
		};
	}
	module.exports = overRest;
}));
//#endregion
//#region node_modules/lodash/constant.js
var require_constant = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Creates a function that returns `value`.
	*
	* @static
	* @memberOf _
	* @since 2.4.0
	* @category Util
	* @param {*} value The value to return from the new function.
	* @returns {Function} Returns the new constant function.
	* @example
	*
	* var objects = _.times(2, _.constant({ 'a': 1 }));
	*
	* console.log(objects);
	* // => [{ 'a': 1 }, { 'a': 1 }]
	*
	* console.log(objects[0] === objects[1]);
	* // => true
	*/
	function constant(value) {
		return function() {
			return value;
		};
	}
	module.exports = constant;
}));
//#endregion
//#region node_modules/lodash/_baseSetToString.js
var require__baseSetToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var constant = require_constant();
	var defineProperty = require__defineProperty();
	var identity = require_identity();
	module.exports = !defineProperty ? identity : function(func, string) {
		return defineProperty(func, "toString", {
			"configurable": true,
			"enumerable": false,
			"value": constant(string),
			"writable": true
		});
	};
}));
//#endregion
//#region node_modules/lodash/_shortOut.js
var require__shortOut = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800;
	var HOT_SPAN = 16;
	var nativeNow = Date.now;
	/**
	* Creates a function that'll short out and invoke `identity` instead
	* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	* milliseconds.
	*
	* @private
	* @param {Function} func The function to restrict.
	* @returns {Function} Returns the new shortable function.
	*/
	function shortOut(func) {
		var count = 0, lastCalled = 0;
		return function() {
			var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
			lastCalled = stamp;
			if (remaining > 0) {
				if (++count >= HOT_COUNT) return arguments[0];
			} else count = 0;
			return func.apply(void 0, arguments);
		};
	}
	module.exports = shortOut;
}));
//#endregion
//#region node_modules/lodash/_setToString.js
var require__setToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseSetToString = require__baseSetToString();
	module.exports = require__shortOut()(baseSetToString);
}));
//#endregion
//#region node_modules/lodash/_baseRest.js
var require__baseRest = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var identity = require_identity();
	var overRest = require__overRest();
	var setToString = require__setToString();
	/**
	* The base implementation of `_.rest` which doesn't validate or coerce arguments.
	*
	* @private
	* @param {Function} func The function to apply a rest parameter to.
	* @param {number} [start=func.length-1] The start position of the rest parameter.
	* @returns {Function} Returns the new function.
	*/
	function baseRest(func, start) {
		return setToString(overRest(func, start, identity), func + "");
	}
	module.exports = baseRest;
}));
//#endregion
//#region node_modules/lodash/_createAssigner.js
var require__createAssigner = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseRest = require__baseRest();
	var isIterateeCall = require__isIterateeCall();
	/**
	* Creates a function like `_.assign`.
	*
	* @private
	* @param {Function} assigner The function to assign values.
	* @returns {Function} Returns the new assigner function.
	*/
	function createAssigner(assigner) {
		return baseRest(function(object, sources) {
			var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
			customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
			if (guard && isIterateeCall(sources[0], sources[1], guard)) {
				customizer = length < 3 ? void 0 : customizer;
				length = 1;
			}
			object = Object(object);
			while (++index < length) {
				var source = sources[index];
				if (source) assigner(object, source, index, customizer);
			}
			return object;
		});
	}
	module.exports = createAssigner;
}));
//#endregion
//#region node_modules/lodash/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseMerge = require__baseMerge();
	module.exports = require__createAssigner()(function(object, source, srcIndex) {
		baseMerge(object, source, srcIndex);
	});
}));
//#endregion
//#region node_modules/lodash/_arrayEach.js
var require__arrayEach = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* A specialized version of `_.forEach` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns `array`.
	*/
	function arrayEach(array, iteratee) {
		var index = -1, length = array == null ? 0 : array.length;
		while (++index < length) if (iteratee(array[index], index, array) === false) break;
		return array;
	}
	module.exports = arrayEach;
}));
//#endregion
//#region node_modules/lodash/_baseAssign.js
var require__baseAssign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var copyObject = require__copyObject();
	var keys = require_keys();
	/**
	* The base implementation of `_.assign` without support for multiple sources
	* or `customizer` functions.
	*
	* @private
	* @param {Object} object The destination object.
	* @param {Object} source The source object.
	* @returns {Object} Returns `object`.
	*/
	function baseAssign(object, source) {
		return object && copyObject(source, keys(source), object);
	}
	module.exports = baseAssign;
}));
//#endregion
//#region node_modules/lodash/_baseAssignIn.js
var require__baseAssignIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var copyObject = require__copyObject();
	var keysIn = require_keysIn();
	/**
	* The base implementation of `_.assignIn` without support for multiple sources
	* or `customizer` functions.
	*
	* @private
	* @param {Object} object The destination object.
	* @param {Object} source The source object.
	* @returns {Object} Returns `object`.
	*/
	function baseAssignIn(object, source) {
		return object && copyObject(source, keysIn(source), object);
	}
	module.exports = baseAssignIn;
}));
//#endregion
//#region node_modules/lodash/_copySymbols.js
var require__copySymbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var copyObject = require__copyObject();
	var getSymbols = require__getSymbols();
	/**
	* Copies own symbols of `source` to `object`.
	*
	* @private
	* @param {Object} source The object to copy symbols from.
	* @param {Object} [object={}] The object to copy symbols to.
	* @returns {Object} Returns `object`.
	*/
	function copySymbols(source, object) {
		return copyObject(source, getSymbols(source), object);
	}
	module.exports = copySymbols;
}));
//#endregion
//#region node_modules/lodash/_getSymbolsIn.js
var require__getSymbolsIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayPush = require__arrayPush();
	var getPrototype = require__getPrototype();
	var getSymbols = require__getSymbols();
	var stubArray = require_stubArray();
	module.exports = !Object.getOwnPropertySymbols ? stubArray : function(object) {
		var result = [];
		while (object) {
			arrayPush(result, getSymbols(object));
			object = getPrototype(object);
		}
		return result;
	};
}));
//#endregion
//#region node_modules/lodash/_copySymbolsIn.js
var require__copySymbolsIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var copyObject = require__copyObject();
	var getSymbolsIn = require__getSymbolsIn();
	/**
	* Copies own and inherited symbols of `source` to `object`.
	*
	* @private
	* @param {Object} source The object to copy symbols from.
	* @param {Object} [object={}] The object to copy symbols to.
	* @returns {Object} Returns `object`.
	*/
	function copySymbolsIn(source, object) {
		return copyObject(source, getSymbolsIn(source), object);
	}
	module.exports = copySymbolsIn;
}));
//#endregion
//#region node_modules/lodash/_getAllKeysIn.js
var require__getAllKeysIn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetAllKeys = require__baseGetAllKeys();
	var getSymbolsIn = require__getSymbolsIn();
	var keysIn = require_keysIn();
	/**
	* Creates an array of own and inherited enumerable property names and
	* symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function getAllKeysIn(object) {
		return baseGetAllKeys(object, keysIn, getSymbolsIn);
	}
	module.exports = getAllKeysIn;
}));
//#endregion
//#region node_modules/lodash/_initCloneArray.js
var require__initCloneArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Initializes an array clone.
	*
	* @private
	* @param {Array} array The array to clone.
	* @returns {Array} Returns the initialized clone.
	*/
	function initCloneArray(array) {
		var length = array.length, result = new array.constructor(length);
		if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
			result.index = array.index;
			result.input = array.input;
		}
		return result;
	}
	module.exports = initCloneArray;
}));
//#endregion
//#region node_modules/lodash/_cloneDataView.js
var require__cloneDataView = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var cloneArrayBuffer = require__cloneArrayBuffer();
	/**
	* Creates a clone of `dataView`.
	*
	* @private
	* @param {Object} dataView The data view to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the cloned data view.
	*/
	function cloneDataView(dataView, isDeep) {
		var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
		return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}
	module.exports = cloneDataView;
}));
//#endregion
//#region node_modules/lodash/_cloneRegExp.js
var require__cloneRegExp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;
	/**
	* Creates a clone of `regexp`.
	*
	* @private
	* @param {Object} regexp The regexp to clone.
	* @returns {Object} Returns the cloned regexp.
	*/
	function cloneRegExp(regexp) {
		var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
		result.lastIndex = regexp.lastIndex;
		return result;
	}
	module.exports = cloneRegExp;
}));
//#endregion
//#region node_modules/lodash/_cloneSymbol.js
var require__cloneSymbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0;
	var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
	/**
	* Creates a clone of the `symbol` object.
	*
	* @private
	* @param {Object} symbol The symbol object to clone.
	* @returns {Object} Returns the cloned symbol object.
	*/
	function cloneSymbol(symbol) {
		return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}
	module.exports = cloneSymbol;
}));
//#endregion
//#region node_modules/lodash/_initCloneByTag.js
var require__initCloneByTag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var cloneArrayBuffer = require__cloneArrayBuffer();
	var cloneDataView = require__cloneDataView();
	var cloneRegExp = require__cloneRegExp();
	var cloneSymbol = require__cloneSymbol();
	var cloneTypedArray = require__cloneTypedArray();
	/** `Object#toString` result references. */
	var boolTag = "[object Boolean]";
	var dateTag = "[object Date]";
	var mapTag = "[object Map]";
	var numberTag = "[object Number]";
	var regexpTag = "[object RegExp]";
	var setTag = "[object Set]";
	var stringTag = "[object String]";
	var symbolTag = "[object Symbol]";
	var arrayBufferTag = "[object ArrayBuffer]";
	var dataViewTag = "[object DataView]";
	var float32Tag = "[object Float32Array]";
	var float64Tag = "[object Float64Array]";
	var int8Tag = "[object Int8Array]";
	var int16Tag = "[object Int16Array]";
	var int32Tag = "[object Int32Array]";
	var uint8Tag = "[object Uint8Array]";
	var uint8ClampedTag = "[object Uint8ClampedArray]";
	var uint16Tag = "[object Uint16Array]";
	var uint32Tag = "[object Uint32Array]";
	/**
	* Initializes an object clone based on its `toStringTag`.
	*
	* **Note:** This function only supports cloning values with tags of
	* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
	*
	* @private
	* @param {Object} object The object to clone.
	* @param {string} tag The `toStringTag` of the object to clone.
	* @param {boolean} [isDeep] Specify a deep clone.
	* @returns {Object} Returns the initialized clone.
	*/
	function initCloneByTag(object, tag, isDeep) {
		var Ctor = object.constructor;
		switch (tag) {
			case arrayBufferTag: return cloneArrayBuffer(object);
			case boolTag:
			case dateTag: return new Ctor(+object);
			case dataViewTag: return cloneDataView(object, isDeep);
			case float32Tag:
			case float64Tag:
			case int8Tag:
			case int16Tag:
			case int32Tag:
			case uint8Tag:
			case uint8ClampedTag:
			case uint16Tag:
			case uint32Tag: return cloneTypedArray(object, isDeep);
			case mapTag: return new Ctor();
			case numberTag:
			case stringTag: return new Ctor(object);
			case regexpTag: return cloneRegExp(object);
			case setTag: return new Ctor();
			case symbolTag: return cloneSymbol(object);
		}
	}
	module.exports = initCloneByTag;
}));
//#endregion
//#region node_modules/lodash/_baseIsMap.js
var require__baseIsMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getTag = require__getTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var mapTag = "[object Map]";
	/**
	* The base implementation of `_.isMap` without Node.js optimizations.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a map, else `false`.
	*/
	function baseIsMap(value) {
		return isObjectLike(value) && getTag(value) == mapTag;
	}
	module.exports = baseIsMap;
}));
//#endregion
//#region node_modules/lodash/isMap.js
var require_isMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsMap = require__baseIsMap();
	var baseUnary = require__baseUnary();
	var nodeUtil = require__nodeUtil();
	var nodeIsMap = nodeUtil && nodeUtil.isMap;
	module.exports = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
}));
//#endregion
//#region node_modules/lodash/_baseIsSet.js
var require__baseIsSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getTag = require__getTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var setTag = "[object Set]";
	/**
	* The base implementation of `_.isSet` without Node.js optimizations.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a set, else `false`.
	*/
	function baseIsSet(value) {
		return isObjectLike(value) && getTag(value) == setTag;
	}
	module.exports = baseIsSet;
}));
//#endregion
//#region node_modules/lodash/isSet.js
var require_isSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIsSet = require__baseIsSet();
	var baseUnary = require__baseUnary();
	var nodeUtil = require__nodeUtil();
	var nodeIsSet = nodeUtil && nodeUtil.isSet;
	module.exports = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
}));
//#endregion
//#region node_modules/lodash/_baseClone.js
var require__baseClone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stack = require__Stack();
	var arrayEach = require__arrayEach();
	var assignValue = require__assignValue();
	var baseAssign = require__baseAssign();
	var baseAssignIn = require__baseAssignIn();
	var cloneBuffer = require__cloneBuffer();
	var copyArray = require__copyArray();
	var copySymbols = require__copySymbols();
	var copySymbolsIn = require__copySymbolsIn();
	var getAllKeys = require__getAllKeys();
	var getAllKeysIn = require__getAllKeysIn();
	var getTag = require__getTag();
	var initCloneArray = require__initCloneArray();
	var initCloneByTag = require__initCloneByTag();
	var initCloneObject = require__initCloneObject();
	var isArray = require_isArray();
	var isBuffer = require_isBuffer();
	var isMap = require_isMap();
	var isObject = require_isObject();
	var isSet = require_isSet();
	var keys = require_keys();
	var keysIn = require_keysIn();
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1;
	var CLONE_FLAT_FLAG = 2;
	var CLONE_SYMBOLS_FLAG = 4;
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]";
	var arrayTag = "[object Array]";
	var boolTag = "[object Boolean]";
	var dateTag = "[object Date]";
	var errorTag = "[object Error]";
	var funcTag = "[object Function]";
	var genTag = "[object GeneratorFunction]";
	var mapTag = "[object Map]";
	var numberTag = "[object Number]";
	var objectTag = "[object Object]";
	var regexpTag = "[object RegExp]";
	var setTag = "[object Set]";
	var stringTag = "[object String]";
	var symbolTag = "[object Symbol]";
	var weakMapTag = "[object WeakMap]";
	var arrayBufferTag = "[object ArrayBuffer]";
	var dataViewTag = "[object DataView]";
	var float32Tag = "[object Float32Array]";
	var float64Tag = "[object Float64Array]";
	var int8Tag = "[object Int8Array]";
	var int16Tag = "[object Int16Array]";
	var int32Tag = "[object Int32Array]";
	var uint8Tag = "[object Uint8Array]";
	var uint8ClampedTag = "[object Uint8ClampedArray]";
	var uint16Tag = "[object Uint16Array]";
	var uint32Tag = "[object Uint32Array]";
	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
	/**
	* The base implementation of `_.clone` and `_.cloneDeep` which tracks
	* traversed objects.
	*
	* @private
	* @param {*} value The value to clone.
	* @param {boolean} bitmask The bitmask flags.
	*  1 - Deep clone
	*  2 - Flatten inherited properties
	*  4 - Clone symbols
	* @param {Function} [customizer] The function to customize cloning.
	* @param {string} [key] The key of `value`.
	* @param {Object} [object] The parent object of `value`.
	* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	* @returns {*} Returns the cloned value.
	*/
	function baseClone(value, bitmask, customizer, key, object, stack) {
		var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
		if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
		if (result !== void 0) return result;
		if (!isObject(value)) return value;
		var isArr = isArray(value);
		if (isArr) {
			result = initCloneArray(value);
			if (!isDeep) return copyArray(value, result);
		} else {
			var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
			if (isBuffer(value)) return cloneBuffer(value, isDeep);
			if (tag == objectTag || tag == argsTag || isFunc && !object) {
				result = isFlat || isFunc ? {} : initCloneObject(value);
				if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
			} else {
				if (!cloneableTags[tag]) return object ? value : {};
				result = initCloneByTag(value, tag, isDeep);
			}
		}
		stack || (stack = new Stack());
		var stacked = stack.get(value);
		if (stacked) return stacked;
		stack.set(value, result);
		if (isSet(value)) value.forEach(function(subValue) {
			result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
		});
		else if (isMap(value)) value.forEach(function(subValue, key) {
			result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
		});
		var props = isArr ? void 0 : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
		arrayEach(props || value, function(subValue, key) {
			if (props) {
				key = subValue;
				subValue = value[key];
			}
			assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
		});
		return result;
	}
	module.exports = baseClone;
}));
//#endregion
//#region node_modules/lodash/cloneDeep.js
var require_cloneDeep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseClone = require__baseClone();
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1;
	var CLONE_SYMBOLS_FLAG = 4;
	/**
	* This method is like `_.clone` except that it recursively clones `value`.
	*
	* @static
	* @memberOf _
	* @since 1.0.0
	* @category Lang
	* @param {*} value The value to recursively clone.
	* @returns {*} Returns the deep cloned value.
	* @see _.clone
	* @example
	*
	* var objects = [{ 'a': 1 }, { 'b': 2 }];
	*
	* var deep = _.cloneDeep(objects);
	* console.log(deep[0] === objects[0]);
	* // => false
	*/
	function cloneDeep(value) {
		return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	}
	module.exports = cloneDeep;
}));
//#endregion
//#region node_modules/lodash/fp/_mapping.js
var require__mapping = /* @__PURE__ */ __commonJSMin(((exports) => {
	/** Used to map aliases to their real names. */
	exports.aliasToReal = {
		"each": "forEach",
		"eachRight": "forEachRight",
		"entries": "toPairs",
		"entriesIn": "toPairsIn",
		"extend": "assignIn",
		"extendAll": "assignInAll",
		"extendAllWith": "assignInAllWith",
		"extendWith": "assignInWith",
		"first": "head",
		"conforms": "conformsTo",
		"matches": "isMatch",
		"property": "get",
		"__": "placeholder",
		"F": "stubFalse",
		"T": "stubTrue",
		"all": "every",
		"allPass": "overEvery",
		"always": "constant",
		"any": "some",
		"anyPass": "overSome",
		"apply": "spread",
		"assoc": "set",
		"assocPath": "set",
		"complement": "negate",
		"compose": "flowRight",
		"contains": "includes",
		"dissoc": "unset",
		"dissocPath": "unset",
		"dropLast": "dropRight",
		"dropLastWhile": "dropRightWhile",
		"equals": "isEqual",
		"identical": "eq",
		"indexBy": "keyBy",
		"init": "initial",
		"invertObj": "invert",
		"juxt": "over",
		"omitAll": "omit",
		"nAry": "ary",
		"path": "get",
		"pathEq": "matchesProperty",
		"pathOr": "getOr",
		"paths": "at",
		"pickAll": "pick",
		"pipe": "flow",
		"pluck": "map",
		"prop": "get",
		"propEq": "matchesProperty",
		"propOr": "getOr",
		"props": "at",
		"symmetricDifference": "xor",
		"symmetricDifferenceBy": "xorBy",
		"symmetricDifferenceWith": "xorWith",
		"takeLast": "takeRight",
		"takeLastWhile": "takeRightWhile",
		"unapply": "rest",
		"unnest": "flatten",
		"useWith": "overArgs",
		"where": "conformsTo",
		"whereEq": "isMatch",
		"zipObj": "zipObject"
	};
	/** Used to map ary to method names. */
	exports.aryMethod = {
		"1": [
			"assignAll",
			"assignInAll",
			"attempt",
			"castArray",
			"ceil",
			"create",
			"curry",
			"curryRight",
			"defaultsAll",
			"defaultsDeepAll",
			"floor",
			"flow",
			"flowRight",
			"fromPairs",
			"invert",
			"iteratee",
			"memoize",
			"method",
			"mergeAll",
			"methodOf",
			"mixin",
			"nthArg",
			"over",
			"overEvery",
			"overSome",
			"rest",
			"reverse",
			"round",
			"runInContext",
			"spread",
			"template",
			"trim",
			"trimEnd",
			"trimStart",
			"uniqueId",
			"words",
			"zipAll"
		],
		"2": [
			"add",
			"after",
			"ary",
			"assign",
			"assignAllWith",
			"assignIn",
			"assignInAllWith",
			"at",
			"before",
			"bind",
			"bindAll",
			"bindKey",
			"chunk",
			"cloneDeepWith",
			"cloneWith",
			"concat",
			"conformsTo",
			"countBy",
			"curryN",
			"curryRightN",
			"debounce",
			"defaults",
			"defaultsDeep",
			"defaultTo",
			"delay",
			"difference",
			"divide",
			"drop",
			"dropRight",
			"dropRightWhile",
			"dropWhile",
			"endsWith",
			"eq",
			"every",
			"filter",
			"find",
			"findIndex",
			"findKey",
			"findLast",
			"findLastIndex",
			"findLastKey",
			"flatMap",
			"flatMapDeep",
			"flattenDepth",
			"forEach",
			"forEachRight",
			"forIn",
			"forInRight",
			"forOwn",
			"forOwnRight",
			"get",
			"groupBy",
			"gt",
			"gte",
			"has",
			"hasIn",
			"includes",
			"indexOf",
			"intersection",
			"invertBy",
			"invoke",
			"invokeMap",
			"isEqual",
			"isMatch",
			"join",
			"keyBy",
			"lastIndexOf",
			"lt",
			"lte",
			"map",
			"mapKeys",
			"mapValues",
			"matchesProperty",
			"maxBy",
			"meanBy",
			"merge",
			"mergeAllWith",
			"minBy",
			"multiply",
			"nth",
			"omit",
			"omitBy",
			"overArgs",
			"pad",
			"padEnd",
			"padStart",
			"parseInt",
			"partial",
			"partialRight",
			"partition",
			"pick",
			"pickBy",
			"propertyOf",
			"pull",
			"pullAll",
			"pullAt",
			"random",
			"range",
			"rangeRight",
			"rearg",
			"reject",
			"remove",
			"repeat",
			"restFrom",
			"result",
			"sampleSize",
			"some",
			"sortBy",
			"sortedIndex",
			"sortedIndexOf",
			"sortedLastIndex",
			"sortedLastIndexOf",
			"sortedUniqBy",
			"split",
			"spreadFrom",
			"startsWith",
			"subtract",
			"sumBy",
			"take",
			"takeRight",
			"takeRightWhile",
			"takeWhile",
			"tap",
			"throttle",
			"thru",
			"times",
			"trimChars",
			"trimCharsEnd",
			"trimCharsStart",
			"truncate",
			"union",
			"uniqBy",
			"uniqWith",
			"unset",
			"unzipWith",
			"without",
			"wrap",
			"xor",
			"zip",
			"zipObject",
			"zipObjectDeep"
		],
		"3": [
			"assignInWith",
			"assignWith",
			"clamp",
			"differenceBy",
			"differenceWith",
			"findFrom",
			"findIndexFrom",
			"findLastFrom",
			"findLastIndexFrom",
			"getOr",
			"includesFrom",
			"indexOfFrom",
			"inRange",
			"intersectionBy",
			"intersectionWith",
			"invokeArgs",
			"invokeArgsMap",
			"isEqualWith",
			"isMatchWith",
			"flatMapDepth",
			"lastIndexOfFrom",
			"mergeWith",
			"orderBy",
			"padChars",
			"padCharsEnd",
			"padCharsStart",
			"pullAllBy",
			"pullAllWith",
			"rangeStep",
			"rangeStepRight",
			"reduce",
			"reduceRight",
			"replace",
			"set",
			"slice",
			"sortedIndexBy",
			"sortedLastIndexBy",
			"transform",
			"unionBy",
			"unionWith",
			"update",
			"xorBy",
			"xorWith",
			"zipWith"
		],
		"4": [
			"fill",
			"setWith",
			"updateWith"
		]
	};
	/** Used to map ary to rearg configs. */
	exports.aryRearg = {
		"2": [1, 0],
		"3": [
			2,
			0,
			1
		],
		"4": [
			3,
			2,
			0,
			1
		]
	};
	/** Used to map method names to their iteratee ary. */
	exports.iterateeAry = {
		"dropRightWhile": 1,
		"dropWhile": 1,
		"every": 1,
		"filter": 1,
		"find": 1,
		"findFrom": 1,
		"findIndex": 1,
		"findIndexFrom": 1,
		"findKey": 1,
		"findLast": 1,
		"findLastFrom": 1,
		"findLastIndex": 1,
		"findLastIndexFrom": 1,
		"findLastKey": 1,
		"flatMap": 1,
		"flatMapDeep": 1,
		"flatMapDepth": 1,
		"forEach": 1,
		"forEachRight": 1,
		"forIn": 1,
		"forInRight": 1,
		"forOwn": 1,
		"forOwnRight": 1,
		"map": 1,
		"mapKeys": 1,
		"mapValues": 1,
		"partition": 1,
		"reduce": 2,
		"reduceRight": 2,
		"reject": 1,
		"remove": 1,
		"some": 1,
		"takeRightWhile": 1,
		"takeWhile": 1,
		"times": 1,
		"transform": 2
	};
	/** Used to map method names to iteratee rearg configs. */
	exports.iterateeRearg = {
		"mapKeys": [1],
		"reduceRight": [1, 0]
	};
	/** Used to map method names to rearg configs. */
	exports.methodRearg = {
		"assignInAllWith": [1, 0],
		"assignInWith": [
			1,
			2,
			0
		],
		"assignAllWith": [1, 0],
		"assignWith": [
			1,
			2,
			0
		],
		"differenceBy": [
			1,
			2,
			0
		],
		"differenceWith": [
			1,
			2,
			0
		],
		"getOr": [
			2,
			1,
			0
		],
		"intersectionBy": [
			1,
			2,
			0
		],
		"intersectionWith": [
			1,
			2,
			0
		],
		"isEqualWith": [
			1,
			2,
			0
		],
		"isMatchWith": [
			2,
			1,
			0
		],
		"mergeAllWith": [1, 0],
		"mergeWith": [
			1,
			2,
			0
		],
		"padChars": [
			2,
			1,
			0
		],
		"padCharsEnd": [
			2,
			1,
			0
		],
		"padCharsStart": [
			2,
			1,
			0
		],
		"pullAllBy": [
			2,
			1,
			0
		],
		"pullAllWith": [
			2,
			1,
			0
		],
		"rangeStep": [
			1,
			2,
			0
		],
		"rangeStepRight": [
			1,
			2,
			0
		],
		"setWith": [
			3,
			1,
			2,
			0
		],
		"sortedIndexBy": [
			2,
			1,
			0
		],
		"sortedLastIndexBy": [
			2,
			1,
			0
		],
		"unionBy": [
			1,
			2,
			0
		],
		"unionWith": [
			1,
			2,
			0
		],
		"updateWith": [
			3,
			1,
			2,
			0
		],
		"xorBy": [
			1,
			2,
			0
		],
		"xorWith": [
			1,
			2,
			0
		],
		"zipWith": [
			1,
			2,
			0
		]
	};
	/** Used to map method names to spread configs. */
	exports.methodSpread = {
		"assignAll": { "start": 0 },
		"assignAllWith": { "start": 0 },
		"assignInAll": { "start": 0 },
		"assignInAllWith": { "start": 0 },
		"defaultsAll": { "start": 0 },
		"defaultsDeepAll": { "start": 0 },
		"invokeArgs": { "start": 2 },
		"invokeArgsMap": { "start": 2 },
		"mergeAll": { "start": 0 },
		"mergeAllWith": { "start": 0 },
		"partial": { "start": 1 },
		"partialRight": { "start": 1 },
		"without": { "start": 1 },
		"zipAll": { "start": 0 }
	};
	/** Used to identify methods which mutate arrays or objects. */
	exports.mutate = {
		"array": {
			"fill": true,
			"pull": true,
			"pullAll": true,
			"pullAllBy": true,
			"pullAllWith": true,
			"pullAt": true,
			"remove": true,
			"reverse": true
		},
		"object": {
			"assign": true,
			"assignAll": true,
			"assignAllWith": true,
			"assignIn": true,
			"assignInAll": true,
			"assignInAllWith": true,
			"assignInWith": true,
			"assignWith": true,
			"defaults": true,
			"defaultsAll": true,
			"defaultsDeep": true,
			"defaultsDeepAll": true,
			"merge": true,
			"mergeAll": true,
			"mergeAllWith": true,
			"mergeWith": true
		},
		"set": {
			"set": true,
			"setWith": true,
			"unset": true,
			"update": true,
			"updateWith": true
		}
	};
	/** Used to map real names to their aliases. */
	exports.realToAlias = function() {
		var hasOwnProperty = Object.prototype.hasOwnProperty, object = exports.aliasToReal, result = {};
		for (var key in object) {
			var value = object[key];
			if (hasOwnProperty.call(result, value)) result[value].push(key);
			else result[value] = [key];
		}
		return result;
	}();
	/** Used to map method names to other names. */
	exports.remap = {
		"assignAll": "assign",
		"assignAllWith": "assignWith",
		"assignInAll": "assignIn",
		"assignInAllWith": "assignInWith",
		"curryN": "curry",
		"curryRightN": "curryRight",
		"defaultsAll": "defaults",
		"defaultsDeepAll": "defaultsDeep",
		"findFrom": "find",
		"findIndexFrom": "findIndex",
		"findLastFrom": "findLast",
		"findLastIndexFrom": "findLastIndex",
		"getOr": "get",
		"includesFrom": "includes",
		"indexOfFrom": "indexOf",
		"invokeArgs": "invoke",
		"invokeArgsMap": "invokeMap",
		"lastIndexOfFrom": "lastIndexOf",
		"mergeAll": "merge",
		"mergeAllWith": "mergeWith",
		"padChars": "pad",
		"padCharsEnd": "padEnd",
		"padCharsStart": "padStart",
		"propertyOf": "get",
		"rangeStep": "range",
		"rangeStepRight": "rangeRight",
		"restFrom": "rest",
		"spreadFrom": "spread",
		"trimChars": "trim",
		"trimCharsEnd": "trimEnd",
		"trimCharsStart": "trimStart",
		"zipAll": "zip"
	};
	/** Used to track methods that skip fixing their arity. */
	exports.skipFixed = {
		"castArray": true,
		"flow": true,
		"flowRight": true,
		"iteratee": true,
		"mixin": true,
		"rearg": true,
		"runInContext": true
	};
	/** Used to track methods that skip rearranging arguments. */
	exports.skipRearg = {
		"add": true,
		"assign": true,
		"assignIn": true,
		"bind": true,
		"bindKey": true,
		"concat": true,
		"difference": true,
		"divide": true,
		"eq": true,
		"gt": true,
		"gte": true,
		"isEqual": true,
		"lt": true,
		"lte": true,
		"matchesProperty": true,
		"merge": true,
		"multiply": true,
		"overArgs": true,
		"partial": true,
		"partialRight": true,
		"propertyOf": true,
		"random": true,
		"range": true,
		"rangeRight": true,
		"subtract": true,
		"zip": true,
		"zipObject": true,
		"zipObjectDeep": true
	};
}));
//#endregion
//#region node_modules/lodash/fp/placeholder.js
var require_placeholder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The default argument placeholder value for methods.
	*
	* @type {Object}
	*/
	module.exports = {};
}));
//#endregion
//#region node_modules/lodash/fp/_baseConvert.js
var require__baseConvert = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var mapping = require__mapping();
	var fallbackHolder = require_placeholder();
	/** Built-in value reference. */
	var push = Array.prototype.push;
	/**
	* Creates a function, with an arity of `n`, that invokes `func` with the
	* arguments it receives.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {number} n The arity of the new function.
	* @returns {Function} Returns the new function.
	*/
	function baseArity(func, n) {
		return n == 2 ? function(a, b) {
			return func.apply(void 0, arguments);
		} : function(a) {
			return func.apply(void 0, arguments);
		};
	}
	/**
	* Creates a function that invokes `func`, with up to `n` arguments, ignoring
	* any additional arguments.
	*
	* @private
	* @param {Function} func The function to cap arguments for.
	* @param {number} n The arity cap.
	* @returns {Function} Returns the new function.
	*/
	function baseAry(func, n) {
		return n == 2 ? function(a, b) {
			return func(a, b);
		} : function(a) {
			return func(a);
		};
	}
	/**
	* Creates a clone of `array`.
	*
	* @private
	* @param {Array} array The array to clone.
	* @returns {Array} Returns the cloned array.
	*/
	function cloneArray(array) {
		var length = array ? array.length : 0, result = Array(length);
		while (length--) result[length] = array[length];
		return result;
	}
	/**
	* Creates a function that clones a given object using the assignment `func`.
	*
	* @private
	* @param {Function} func The assignment function.
	* @returns {Function} Returns the new cloner function.
	*/
	function createCloner(func) {
		return function(object) {
			return func({}, object);
		};
	}
	/**
	* A specialized version of `_.spread` which flattens the spread array into
	* the arguments of the invoked `func`.
	*
	* @private
	* @param {Function} func The function to spread arguments over.
	* @param {number} start The start position of the spread.
	* @returns {Function} Returns the new function.
	*/
	function flatSpread(func, start) {
		return function() {
			var length = arguments.length, lastIndex = length - 1, args = Array(length);
			while (length--) args[length] = arguments[length];
			var array = args[start], otherArgs = args.slice(0, start);
			if (array) push.apply(otherArgs, array);
			if (start != lastIndex) push.apply(otherArgs, args.slice(start + 1));
			return func.apply(this, otherArgs);
		};
	}
	/**
	* Creates a function that wraps `func` and uses `cloner` to clone the first
	* argument it receives.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {Function} cloner The function to clone arguments.
	* @returns {Function} Returns the new immutable function.
	*/
	function wrapImmutable(func, cloner) {
		return function() {
			var length = arguments.length;
			if (!length) return;
			var args = Array(length);
			while (length--) args[length] = arguments[length];
			var result = args[0] = cloner.apply(void 0, args);
			func.apply(void 0, args);
			return result;
		};
	}
	/**
	* The base implementation of `convert` which accepts a `util` object of methods
	* required to perform conversions.
	*
	* @param {Object} util The util object.
	* @param {string} name The name of the function to convert.
	* @param {Function} func The function to convert.
	* @param {Object} [options] The options object.
	* @param {boolean} [options.cap=true] Specify capping iteratee arguments.
	* @param {boolean} [options.curry=true] Specify currying.
	* @param {boolean} [options.fixed=true] Specify fixed arity.
	* @param {boolean} [options.immutable=true] Specify immutable operations.
	* @param {boolean} [options.rearg=true] Specify rearranging arguments.
	* @returns {Function|Object} Returns the converted function or object.
	*/
	function baseConvert(util, name, func, options) {
		var isLib = typeof name == "function", isObj = name === Object(name);
		if (isObj) {
			options = func;
			func = name;
			name = void 0;
		}
		if (func == null) throw new TypeError();
		options || (options = {});
		var config = {
			"cap": "cap" in options ? options.cap : true,
			"curry": "curry" in options ? options.curry : true,
			"fixed": "fixed" in options ? options.fixed : true,
			"immutable": "immutable" in options ? options.immutable : true,
			"rearg": "rearg" in options ? options.rearg : true
		};
		var defaultHolder = isLib ? func : fallbackHolder, forceCurry = "curry" in options && options.curry, forceFixed = "fixed" in options && options.fixed, forceRearg = "rearg" in options && options.rearg, pristine = isLib ? func.runInContext() : void 0;
		var helpers = isLib ? func : {
			"ary": util.ary,
			"assign": util.assign,
			"clone": util.clone,
			"curry": util.curry,
			"forEach": util.forEach,
			"isArray": util.isArray,
			"isError": util.isError,
			"isFunction": util.isFunction,
			"isWeakMap": util.isWeakMap,
			"iteratee": util.iteratee,
			"keys": util.keys,
			"rearg": util.rearg,
			"toInteger": util.toInteger,
			"toPath": util.toPath
		};
		var ary = helpers.ary, assign = helpers.assign, clone = helpers.clone, curry = helpers.curry, each = helpers.forEach, isArray = helpers.isArray, isError = helpers.isError, isFunction = helpers.isFunction, isWeakMap = helpers.isWeakMap, keys = helpers.keys, rearg = helpers.rearg, toInteger = helpers.toInteger, toPath = helpers.toPath;
		var aryMethodKeys = keys(mapping.aryMethod);
		var wrappers = {
			"castArray": function(castArray) {
				return function() {
					var value = arguments[0];
					return isArray(value) ? castArray(cloneArray(value)) : castArray.apply(void 0, arguments);
				};
			},
			"iteratee": function(iteratee) {
				return function() {
					var func = arguments[0], arity = arguments[1], result = iteratee(func, arity), length = result.length;
					if (config.cap && typeof arity == "number") {
						arity = arity > 2 ? arity - 2 : 1;
						return length && length <= arity ? result : baseAry(result, arity);
					}
					return result;
				};
			},
			"mixin": function(mixin) {
				return function(source) {
					var func = this;
					if (!isFunction(func)) return mixin(func, Object(source));
					var pairs = [];
					each(keys(source), function(key) {
						if (isFunction(source[key])) pairs.push([key, func.prototype[key]]);
					});
					mixin(func, Object(source));
					each(pairs, function(pair) {
						var value = pair[1];
						if (isFunction(value)) func.prototype[pair[0]] = value;
						else delete func.prototype[pair[0]];
					});
					return func;
				};
			},
			"nthArg": function(nthArg) {
				return function(n) {
					var arity = n < 0 ? 1 : toInteger(n) + 1;
					return curry(nthArg(n), arity);
				};
			},
			"rearg": function(rearg) {
				return function(func, indexes) {
					var arity = indexes ? indexes.length : 0;
					return curry(rearg(func, indexes), arity);
				};
			},
			"runInContext": function(runInContext) {
				return function(context) {
					return baseConvert(util, runInContext(context), options);
				};
			}
		};
		/**
		* Casts `func` to a function with an arity capped iteratee if needed.
		*
		* @private
		* @param {string} name The name of the function to inspect.
		* @param {Function} func The function to inspect.
		* @returns {Function} Returns the cast function.
		*/
		function castCap(name, func) {
			if (config.cap) {
				var indexes = mapping.iterateeRearg[name];
				if (indexes) return iterateeRearg(func, indexes);
				var n = !isLib && mapping.iterateeAry[name];
				if (n) return iterateeAry(func, n);
			}
			return func;
		}
		/**
		* Casts `func` to a curried function if needed.
		*
		* @private
		* @param {string} name The name of the function to inspect.
		* @param {Function} func The function to inspect.
		* @param {number} n The arity of `func`.
		* @returns {Function} Returns the cast function.
		*/
		function castCurry(name, func, n) {
			return forceCurry || config.curry && n > 1 ? curry(func, n) : func;
		}
		/**
		* Casts `func` to a fixed arity function if needed.
		*
		* @private
		* @param {string} name The name of the function to inspect.
		* @param {Function} func The function to inspect.
		* @param {number} n The arity cap.
		* @returns {Function} Returns the cast function.
		*/
		function castFixed(name, func, n) {
			if (config.fixed && (forceFixed || !mapping.skipFixed[name])) {
				var data = mapping.methodSpread[name], start = data && data.start;
				return start === void 0 ? ary(func, n) : flatSpread(func, start);
			}
			return func;
		}
		/**
		* Casts `func` to an rearged function if needed.
		*
		* @private
		* @param {string} name The name of the function to inspect.
		* @param {Function} func The function to inspect.
		* @param {number} n The arity of `func`.
		* @returns {Function} Returns the cast function.
		*/
		function castRearg(name, func, n) {
			return config.rearg && n > 1 && (forceRearg || !mapping.skipRearg[name]) ? rearg(func, mapping.methodRearg[name] || mapping.aryRearg[n]) : func;
		}
		/**
		* Creates a clone of `object` by `path`.
		*
		* @private
		* @param {Object} object The object to clone.
		* @param {Array|string} path The path to clone by.
		* @returns {Object} Returns the cloned object.
		*/
		function cloneByPath(object, path) {
			path = toPath(path);
			var index = -1, length = path.length, lastIndex = length - 1, result = clone(Object(object)), nested = result;
			while (nested != null && ++index < length) {
				var key = path[index], value = nested[key];
				if (value != null && !(isFunction(value) || isError(value) || isWeakMap(value))) nested[key] = clone(index == lastIndex ? value : Object(value));
				nested = nested[key];
			}
			return result;
		}
		/**
		* Converts `lodash` to an immutable auto-curried iteratee-first data-last
		* version with conversion `options` applied.
		*
		* @param {Object} [options] The options object. See `baseConvert` for more details.
		* @returns {Function} Returns the converted `lodash`.
		*/
		function convertLib(options) {
			return _.runInContext.convert(options)(void 0);
		}
		/**
		* Create a converter function for `func` of `name`.
		*
		* @param {string} name The name of the function to convert.
		* @param {Function} func The function to convert.
		* @returns {Function} Returns the new converter function.
		*/
		function createConverter(name, func) {
			var realName = mapping.aliasToReal[name] || name, methodName = mapping.remap[realName] || realName, oldOptions = options;
			return function(options) {
				return baseConvert(isLib ? pristine : helpers, realName, isLib ? pristine[methodName] : func, assign(assign({}, oldOptions), options));
			};
		}
		/**
		* Creates a function that wraps `func` to invoke its iteratee, with up to `n`
		* arguments, ignoring any additional arguments.
		*
		* @private
		* @param {Function} func The function to cap iteratee arguments for.
		* @param {number} n The arity cap.
		* @returns {Function} Returns the new function.
		*/
		function iterateeAry(func, n) {
			return overArg(func, function(func) {
				return typeof func == "function" ? baseAry(func, n) : func;
			});
		}
		/**
		* Creates a function that wraps `func` to invoke its iteratee with arguments
		* arranged according to the specified `indexes` where the argument value at
		* the first index is provided as the first argument, the argument value at
		* the second index is provided as the second argument, and so on.
		*
		* @private
		* @param {Function} func The function to rearrange iteratee arguments for.
		* @param {number[]} indexes The arranged argument indexes.
		* @returns {Function} Returns the new function.
		*/
		function iterateeRearg(func, indexes) {
			return overArg(func, function(func) {
				var n = indexes.length;
				return baseArity(rearg(baseAry(func, n), indexes), n);
			});
		}
		/**
		* Creates a function that invokes `func` with its first argument transformed.
		*
		* @private
		* @param {Function} func The function to wrap.
		* @param {Function} transform The argument transform.
		* @returns {Function} Returns the new function.
		*/
		function overArg(func, transform) {
			return function() {
				var length = arguments.length;
				if (!length) return func();
				var args = Array(length);
				while (length--) args[length] = arguments[length];
				var index = config.rearg ? 0 : length - 1;
				args[index] = transform(args[index]);
				return func.apply(void 0, args);
			};
		}
		/**
		* Creates a function that wraps `func` and applys the conversions
		* rules by `name`.
		*
		* @private
		* @param {string} name The name of the function to wrap.
		* @param {Function} func The function to wrap.
		* @returns {Function} Returns the converted function.
		*/
		function wrap(name, func, placeholder) {
			var result, realName = mapping.aliasToReal[name] || name, wrapped = func, wrapper = wrappers[realName];
			if (wrapper) wrapped = wrapper(func);
			else if (config.immutable) {
				if (mapping.mutate.array[realName]) wrapped = wrapImmutable(func, cloneArray);
				else if (mapping.mutate.object[realName]) wrapped = wrapImmutable(func, createCloner(func));
				else if (mapping.mutate.set[realName]) wrapped = wrapImmutable(func, cloneByPath);
			}
			each(aryMethodKeys, function(aryKey) {
				each(mapping.aryMethod[aryKey], function(otherName) {
					if (realName == otherName) {
						var data = mapping.methodSpread[realName];
						result = data && data.afterRearg ? castFixed(realName, castRearg(realName, wrapped, aryKey), aryKey) : castRearg(realName, castFixed(realName, wrapped, aryKey), aryKey);
						result = castCap(realName, result);
						result = castCurry(realName, result, aryKey);
						return false;
					}
				});
				return !result;
			});
			result || (result = wrapped);
			if (result == func) result = forceCurry ? curry(result, 1) : function() {
				return func.apply(this, arguments);
			};
			result.convert = createConverter(realName, func);
			result.placeholder = func.placeholder = placeholder;
			return result;
		}
		if (!isObj) return wrap(name, func, defaultHolder);
		var _ = func;
		var pairs = [];
		each(aryMethodKeys, function(aryKey) {
			each(mapping.aryMethod[aryKey], function(key) {
				var func = _[mapping.remap[key] || key];
				if (func) pairs.push([key, wrap(key, func, _)]);
			});
		});
		each(keys(_), function(key) {
			var func = _[key];
			if (typeof func == "function") {
				var length = pairs.length;
				while (length--) if (pairs[length][0] == key) return;
				func.convert = createConverter(key, func);
				pairs.push([key, func]);
			}
		});
		each(pairs, function(pair) {
			_[pair[0]] = pair[1];
		});
		_.convert = convertLib;
		_.placeholder = _;
		each(keys(_), function(key) {
			each(mapping.realToAlias[key] || [], function(alias) {
				_[alias] = _[key];
			});
		});
		return _;
	}
	module.exports = baseConvert;
}));
//#endregion
//#region node_modules/lodash/_metaMap.js
var require__metaMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var WeakMap = require__WeakMap();
	module.exports = WeakMap && new WeakMap();
}));
//#endregion
//#region node_modules/lodash/_baseSetData.js
var require__baseSetData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var identity = require_identity();
	var metaMap = require__metaMap();
	module.exports = !metaMap ? identity : function(func, data) {
		metaMap.set(func, data);
		return func;
	};
}));
//#endregion
//#region node_modules/lodash/_createCtor.js
var require__createCtor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseCreate = require__baseCreate();
	var isObject = require_isObject();
	/**
	* Creates a function that produces an instance of `Ctor` regardless of
	* whether it was invoked as part of a `new` expression or by `call` or `apply`.
	*
	* @private
	* @param {Function} Ctor The constructor to wrap.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createCtor(Ctor) {
		return function() {
			var args = arguments;
			switch (args.length) {
				case 0: return new Ctor();
				case 1: return new Ctor(args[0]);
				case 2: return new Ctor(args[0], args[1]);
				case 3: return new Ctor(args[0], args[1], args[2]);
				case 4: return new Ctor(args[0], args[1], args[2], args[3]);
				case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
				case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
				case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
			}
			var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
			return isObject(result) ? result : thisBinding;
		};
	}
	module.exports = createCtor;
}));
//#endregion
//#region node_modules/lodash/_createBind.js
var require__createBind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createCtor = require__createCtor();
	var root = require__root();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;
	/**
	* Creates a function that wraps `func` to invoke it with the optional `this`
	* binding of `thisArg`.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @param {*} [thisArg] The `this` binding of `func`.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createBind(func, bitmask, thisArg) {
		var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
		function wrapper() {
			return (this && this !== root && this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, arguments);
		}
		return wrapper;
	}
	module.exports = createBind;
}));
//#endregion
//#region node_modules/lodash/_composeArgs.js
var require__composeArgs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeMax = Math.max;
	/**
	* Creates an array that is the composition of partially applied arguments,
	* placeholders, and provided arguments into a single array of arguments.
	*
	* @private
	* @param {Array} args The provided arguments.
	* @param {Array} partials The arguments to prepend to those provided.
	* @param {Array} holders The `partials` placeholder indexes.
	* @params {boolean} [isCurried] Specify composing for a curried function.
	* @returns {Array} Returns the new array of composed arguments.
	*/
	function composeArgs(args, partials, holders, isCurried) {
		var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
		while (++leftIndex < leftLength) result[leftIndex] = partials[leftIndex];
		while (++argsIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[holders[argsIndex]] = args[argsIndex];
		while (rangeLength--) result[leftIndex++] = args[argsIndex++];
		return result;
	}
	module.exports = composeArgs;
}));
//#endregion
//#region node_modules/lodash/_composeArgsRight.js
var require__composeArgsRight = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nativeMax = Math.max;
	/**
	* This function is like `composeArgs` except that the arguments composition
	* is tailored for `_.partialRight`.
	*
	* @private
	* @param {Array} args The provided arguments.
	* @param {Array} partials The arguments to append to those provided.
	* @param {Array} holders The `partials` placeholder indexes.
	* @params {boolean} [isCurried] Specify composing for a curried function.
	* @returns {Array} Returns the new array of composed arguments.
	*/
	function composeArgsRight(args, partials, holders, isCurried) {
		var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
		while (++argsIndex < rangeLength) result[argsIndex] = args[argsIndex];
		var offset = argsIndex;
		while (++rightIndex < rightLength) result[offset + rightIndex] = partials[rightIndex];
		while (++holdersIndex < holdersLength) if (isUncurried || argsIndex < argsLength) result[offset + holders[holdersIndex]] = args[argsIndex++];
		return result;
	}
	module.exports = composeArgsRight;
}));
//#endregion
//#region node_modules/lodash/_countHolders.js
var require__countHolders = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the number of `placeholder` occurrences in `array`.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} placeholder The placeholder to search for.
	* @returns {number} Returns the placeholder count.
	*/
	function countHolders(array, placeholder) {
		var length = array.length, result = 0;
		while (length--) if (array[length] === placeholder) ++result;
		return result;
	}
	module.exports = countHolders;
}));
//#endregion
//#region node_modules/lodash/_baseLodash.js
var require__baseLodash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The function whose prototype chain sequence wrappers inherit from.
	*
	* @private
	*/
	function baseLodash() {}
	module.exports = baseLodash;
}));
//#endregion
//#region node_modules/lodash/_LazyWrapper.js
var require__LazyWrapper = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseCreate = require__baseCreate();
	var baseLodash = require__baseLodash();
	/** Used as references for the maximum length and index of an array. */
	var MAX_ARRAY_LENGTH = 4294967295;
	/**
	* Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	*
	* @private
	* @constructor
	* @param {*} value The value to wrap.
	*/
	function LazyWrapper(value) {
		this.__wrapped__ = value;
		this.__actions__ = [];
		this.__dir__ = 1;
		this.__filtered__ = false;
		this.__iteratees__ = [];
		this.__takeCount__ = MAX_ARRAY_LENGTH;
		this.__views__ = [];
	}
	LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	LazyWrapper.prototype.constructor = LazyWrapper;
	module.exports = LazyWrapper;
}));
//#endregion
//#region node_modules/lodash/noop.js
var require_noop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This method returns `undefined`.
	*
	* @static
	* @memberOf _
	* @since 2.3.0
	* @category Util
	* @example
	*
	* _.times(2, _.noop);
	* // => [undefined, undefined]
	*/
	function noop() {}
	module.exports = noop;
}));
//#endregion
//#region node_modules/lodash/_getData.js
var require__getData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var metaMap = require__metaMap();
	var noop = require_noop();
	module.exports = !metaMap ? noop : function(func) {
		return metaMap.get(func);
	};
}));
//#endregion
//#region node_modules/lodash/_realNames.js
var require__realNames = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
}));
//#endregion
//#region node_modules/lodash/_getFuncName.js
var require__getFuncName = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var realNames = require__realNames();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Gets the name of `func`.
	*
	* @private
	* @param {Function} func The function to query.
	* @returns {string} Returns the function name.
	*/
	function getFuncName(func) {
		var result = func.name + "", array = realNames[result], length = hasOwnProperty.call(realNames, result) ? array.length : 0;
		while (length--) {
			var data = array[length], otherFunc = data.func;
			if (otherFunc == null || otherFunc == func) return data.name;
		}
		return result;
	}
	module.exports = getFuncName;
}));
//#endregion
//#region node_modules/lodash/_LodashWrapper.js
var require__LodashWrapper = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseCreate = require__baseCreate();
	var baseLodash = require__baseLodash();
	/**
	* The base constructor for creating `lodash` wrapper objects.
	*
	* @private
	* @param {*} value The value to wrap.
	* @param {boolean} [chainAll] Enable explicit method chain sequences.
	*/
	function LodashWrapper(value, chainAll) {
		this.__wrapped__ = value;
		this.__actions__ = [];
		this.__chain__ = !!chainAll;
		this.__index__ = 0;
		this.__values__ = void 0;
	}
	LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	LodashWrapper.prototype.constructor = LodashWrapper;
	module.exports = LodashWrapper;
}));
//#endregion
//#region node_modules/lodash/_wrapperClone.js
var require__wrapperClone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LazyWrapper = require__LazyWrapper();
	var LodashWrapper = require__LodashWrapper();
	var copyArray = require__copyArray();
	/**
	* Creates a clone of `wrapper`.
	*
	* @private
	* @param {Object} wrapper The wrapper to clone.
	* @returns {Object} Returns the cloned wrapper.
	*/
	function wrapperClone(wrapper) {
		if (wrapper instanceof LazyWrapper) return wrapper.clone();
		var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
		result.__actions__ = copyArray(wrapper.__actions__);
		result.__index__ = wrapper.__index__;
		result.__values__ = wrapper.__values__;
		return result;
	}
	module.exports = wrapperClone;
}));
//#endregion
//#region node_modules/lodash/wrapperLodash.js
var require_wrapperLodash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LazyWrapper = require__LazyWrapper();
	var LodashWrapper = require__LodashWrapper();
	var baseLodash = require__baseLodash();
	var isArray = require_isArray();
	var isObjectLike = require_isObjectLike();
	var wrapperClone = require__wrapperClone();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Creates a `lodash` object which wraps `value` to enable implicit method
	* chain sequences. Methods that operate on and return arrays, collections,
	* and functions can be chained together. Methods that retrieve a single value
	* or may return a primitive value will automatically end the chain sequence
	* and return the unwrapped value. Otherwise, the value must be unwrapped
	* with `_#value`.
	*
	* Explicit chain sequences, which must be unwrapped with `_#value`, may be
	* enabled using `_.chain`.
	*
	* The execution of chained methods is lazy, that is, it's deferred until
	* `_#value` is implicitly or explicitly called.
	*
	* Lazy evaluation allows several methods to support shortcut fusion.
	* Shortcut fusion is an optimization to merge iteratee calls; this avoids
	* the creation of intermediate arrays and can greatly reduce the number of
	* iteratee executions. Sections of a chain sequence qualify for shortcut
	* fusion if the section is applied to an array and iteratees accept only
	* one argument. The heuristic for whether a section qualifies for shortcut
	* fusion is subject to change.
	*
	* Chaining is supported in custom builds as long as the `_#value` method is
	* directly or indirectly included in the build.
	*
	* In addition to lodash methods, wrappers have `Array` and `String` methods.
	*
	* The wrapper `Array` methods are:
	* `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
	*
	* The wrapper `String` methods are:
	* `replace` and `split`
	*
	* The wrapper methods that support shortcut fusion are:
	* `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
	* `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
	* `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
	*
	* The chainable wrapper methods are:
	* `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
	* `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
	* `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
	* `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
	* `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
	* `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
	* `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
	* `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
	* `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
	* `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
	* `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
	* `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
	* `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
	* `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
	* `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
	* `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
	* `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
	* `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
	* `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
	* `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
	* `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
	* `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
	* `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
	* `zipObject`, `zipObjectDeep`, and `zipWith`
	*
	* The wrapper methods that are **not** chainable by default are:
	* `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
	* `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
	* `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
	* `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
	* `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
	* `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
	* `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
	* `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
	* `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
	* `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
	* `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
	* `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
	* `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
	* `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
	* `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
	* `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
	* `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
	* `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
	* `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
	* `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
	* `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
	* `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
	* `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
	* `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
	* `upperFirst`, `value`, and `words`
	*
	* @name _
	* @constructor
	* @category Seq
	* @param {*} value The value to wrap in a `lodash` instance.
	* @returns {Object} Returns the new `lodash` wrapper instance.
	* @example
	*
	* function square(n) {
	*   return n * n;
	* }
	*
	* var wrapped = _([1, 2, 3]);
	*
	* // Returns an unwrapped value.
	* wrapped.reduce(_.add);
	* // => 6
	*
	* // Returns a wrapped value.
	* var squares = wrapped.map(square);
	*
	* _.isArray(squares);
	* // => false
	*
	* _.isArray(squares.value());
	* // => true
	*/
	function lodash(value) {
		if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
			if (value instanceof LodashWrapper) return value;
			if (hasOwnProperty.call(value, "__wrapped__")) return wrapperClone(value);
		}
		return new LodashWrapper(value);
	}
	lodash.prototype = baseLodash.prototype;
	lodash.prototype.constructor = lodash;
	module.exports = lodash;
}));
//#endregion
//#region node_modules/lodash/_isLaziable.js
var require__isLaziable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LazyWrapper = require__LazyWrapper();
	var getData = require__getData();
	var getFuncName = require__getFuncName();
	var lodash = require_wrapperLodash();
	/**
	* Checks if `func` has a lazy counterpart.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` has a lazy counterpart,
	*  else `false`.
	*/
	function isLaziable(func) {
		var funcName = getFuncName(func), other = lodash[funcName];
		if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) return false;
		if (func === other) return true;
		var data = getData(other);
		return !!data && func === data[0];
	}
	module.exports = isLaziable;
}));
//#endregion
//#region node_modules/lodash/_setData.js
var require__setData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseSetData = require__baseSetData();
	module.exports = require__shortOut()(baseSetData);
}));
//#endregion
//#region node_modules/lodash/_getWrapDetails.js
var require__getWrapDetails = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to match wrap detail comments. */
	var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/;
	var reSplitDetails = /,? & /;
	/**
	* Extracts wrapper details from the `source` body comment.
	*
	* @private
	* @param {string} source The source to inspect.
	* @returns {Array} Returns the wrapper details.
	*/
	function getWrapDetails(source) {
		var match = source.match(reWrapDetails);
		return match ? match[1].split(reSplitDetails) : [];
	}
	module.exports = getWrapDetails;
}));
//#endregion
//#region node_modules/lodash/_insertWrapDetails.js
var require__insertWrapDetails = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used to match wrap detail comments. */
	var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
	/**
	* Inserts wrapper `details` in a comment at the top of the `source` body.
	*
	* @private
	* @param {string} source The source to modify.
	* @returns {Array} details The details to insert.
	* @returns {string} Returns the modified source.
	*/
	function insertWrapDetails(source, details) {
		var length = details.length;
		if (!length) return source;
		var lastIndex = length - 1;
		details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
		details = details.join(length > 2 ? ", " : " ");
		return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
	}
	module.exports = insertWrapDetails;
}));
//#endregion
//#region node_modules/lodash/_arrayIncludes.js
var require__arrayIncludes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIndexOf = require__baseIndexOf();
	/**
	* A specialized version of `_.includes` for arrays without support for
	* specifying an index to search from.
	*
	* @private
	* @param {Array} [array] The array to inspect.
	* @param {*} target The value to search for.
	* @returns {boolean} Returns `true` if `target` is found, else `false`.
	*/
	function arrayIncludes(array, value) {
		return !!(array == null ? 0 : array.length) && baseIndexOf(array, value, 0) > -1;
	}
	module.exports = arrayIncludes;
}));
//#endregion
//#region node_modules/lodash/_updateWrapDetails.js
var require__updateWrapDetails = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayEach = require__arrayEach();
	var arrayIncludes = require__arrayIncludes();
	/** Used to associate wrap methods with their bit flags. */
	var wrapFlags = [
		["ary", 128],
		["bind", 1],
		["bindKey", 2],
		["curry", 8],
		["curryRight", 16],
		["flip", 512],
		["partial", 32],
		["partialRight", 64],
		["rearg", 256]
	];
	/**
	* Updates wrapper `details` based on `bitmask` flags.
	*
	* @private
	* @returns {Array} details The details to modify.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @returns {Array} Returns `details`.
	*/
	function updateWrapDetails(details, bitmask) {
		arrayEach(wrapFlags, function(pair) {
			var value = "_." + pair[0];
			if (bitmask & pair[1] && !arrayIncludes(details, value)) details.push(value);
		});
		return details.sort();
	}
	module.exports = updateWrapDetails;
}));
//#endregion
//#region node_modules/lodash/_setWrapToString.js
var require__setWrapToString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getWrapDetails = require__getWrapDetails();
	var insertWrapDetails = require__insertWrapDetails();
	var setToString = require__setToString();
	var updateWrapDetails = require__updateWrapDetails();
	/**
	* Sets the `toString` method of `wrapper` to mimic the source of `reference`
	* with wrapper details in a comment at the top of the source body.
	*
	* @private
	* @param {Function} wrapper The function to modify.
	* @param {Function} reference The reference function.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @returns {Function} Returns `wrapper`.
	*/
	function setWrapToString(wrapper, reference, bitmask) {
		var source = reference + "";
		return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
	}
	module.exports = setWrapToString;
}));
//#endregion
//#region node_modules/lodash/_createRecurry.js
var require__createRecurry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isLaziable = require__isLaziable();
	var setData = require__setData();
	var setWrapToString = require__setWrapToString();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;
	var WRAP_BIND_KEY_FLAG = 2;
	var WRAP_CURRY_BOUND_FLAG = 4;
	var WRAP_CURRY_FLAG = 8;
	var WRAP_PARTIAL_FLAG = 32;
	var WRAP_PARTIAL_RIGHT_FLAG = 64;
	/**
	* Creates a function that wraps `func` to continue currying.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @param {Function} wrapFunc The function to create the `func` wrapper.
	* @param {*} placeholder The placeholder value.
	* @param {*} [thisArg] The `this` binding of `func`.
	* @param {Array} [partials] The arguments to prepend to those provided to
	*  the new function.
	* @param {Array} [holders] The `partials` placeholder indexes.
	* @param {Array} [argPos] The argument positions of the new function.
	* @param {number} [ary] The arity cap of `func`.
	* @param {number} [arity] The arity of `func`.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
		var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
		bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
		bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
		if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
		var newData = [
			func,
			bitmask,
			thisArg,
			newPartials,
			newHolders,
			newPartialsRight,
			newHoldersRight,
			argPos,
			ary,
			arity
		];
		var result = wrapFunc.apply(void 0, newData);
		if (isLaziable(func)) setData(result, newData);
		result.placeholder = placeholder;
		return setWrapToString(result, func, bitmask);
	}
	module.exports = createRecurry;
}));
//#endregion
//#region node_modules/lodash/_getHolder.js
var require__getHolder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the argument placeholder value for `func`.
	*
	* @private
	* @param {Function} func The function to inspect.
	* @returns {*} Returns the placeholder value.
	*/
	function getHolder(func) {
		return func.placeholder;
	}
	module.exports = getHolder;
}));
//#endregion
//#region node_modules/lodash/_reorder.js
var require__reorder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var copyArray = require__copyArray();
	var isIndex = require__isIndex();
	var nativeMin = Math.min;
	/**
	* Reorder `array` according to the specified indexes where the element at
	* the first index is assigned as the first element, the element at
	* the second index is assigned as the second element, and so on.
	*
	* @private
	* @param {Array} array The array to reorder.
	* @param {Array} indexes The arranged array indexes.
	* @returns {Array} Returns `array`.
	*/
	function reorder(array, indexes) {
		var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
		while (length--) {
			var index = indexes[length];
			array[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
		}
		return array;
	}
	module.exports = reorder;
}));
//#endregion
//#region node_modules/lodash/_replaceHolders.js
var require__replaceHolders = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** Used as the internal argument placeholder. */
	var PLACEHOLDER = "__lodash_placeholder__";
	/**
	* Replaces all `placeholder` elements in `array` with an internal placeholder
	* and returns an array of their indexes.
	*
	* @private
	* @param {Array} array The array to modify.
	* @param {*} placeholder The placeholder to replace.
	* @returns {Array} Returns the new array of placeholder indexes.
	*/
	function replaceHolders(array, placeholder) {
		var index = -1, length = array.length, resIndex = 0, result = [];
		while (++index < length) {
			var value = array[index];
			if (value === placeholder || value === PLACEHOLDER) {
				array[index] = PLACEHOLDER;
				result[resIndex++] = index;
			}
		}
		return result;
	}
	module.exports = replaceHolders;
}));
//#endregion
//#region node_modules/lodash/_createHybrid.js
var require__createHybrid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var composeArgs = require__composeArgs();
	var composeArgsRight = require__composeArgsRight();
	var countHolders = require__countHolders();
	var createCtor = require__createCtor();
	var createRecurry = require__createRecurry();
	var getHolder = require__getHolder();
	var reorder = require__reorder();
	var replaceHolders = require__replaceHolders();
	var root = require__root();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;
	var WRAP_BIND_KEY_FLAG = 2;
	var WRAP_CURRY_FLAG = 8;
	var WRAP_CURRY_RIGHT_FLAG = 16;
	var WRAP_ARY_FLAG = 128;
	var WRAP_FLIP_FLAG = 512;
	/**
	* Creates a function that wraps `func` to invoke it with optional `this`
	* binding of `thisArg`, partial application, and currying.
	*
	* @private
	* @param {Function|string} func The function or method name to wrap.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @param {*} [thisArg] The `this` binding of `func`.
	* @param {Array} [partials] The arguments to prepend to those provided to
	*  the new function.
	* @param {Array} [holders] The `partials` placeholder indexes.
	* @param {Array} [partialsRight] The arguments to append to those provided
	*  to the new function.
	* @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
	* @param {Array} [argPos] The argument positions of the new function.
	* @param {number} [ary] The arity cap of `func`.
	* @param {number} [arity] The arity of `func`.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
		var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? void 0 : createCtor(func);
		function wrapper() {
			var length = arguments.length, args = Array(length), index = length;
			while (index--) args[index] = arguments[index];
			if (isCurried) var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
			if (partials) args = composeArgs(args, partials, holders, isCurried);
			if (partialsRight) args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
			length -= holdersCount;
			if (isCurried && length < arity) {
				var newHolders = replaceHolders(args, placeholder);
				return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
			}
			var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
			length = args.length;
			if (argPos) args = reorder(args, argPos);
			else if (isFlip && length > 1) args.reverse();
			if (isAry && ary < length) args.length = ary;
			if (this && this !== root && this instanceof wrapper) fn = Ctor || createCtor(fn);
			return fn.apply(thisBinding, args);
		}
		return wrapper;
	}
	module.exports = createHybrid;
}));
//#endregion
//#region node_modules/lodash/_createCurry.js
var require__createCurry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var apply = require__apply();
	var createCtor = require__createCtor();
	var createHybrid = require__createHybrid();
	var createRecurry = require__createRecurry();
	var getHolder = require__getHolder();
	var replaceHolders = require__replaceHolders();
	var root = require__root();
	/**
	* Creates a function that wraps `func` to enable currying.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @param {number} arity The arity of `func`.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createCurry(func, bitmask, arity) {
		var Ctor = createCtor(func);
		function wrapper() {
			var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
			while (index--) args[index] = arguments[index];
			var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
			length -= holders.length;
			if (length < arity) return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, void 0, args, holders, void 0, void 0, arity - length);
			return apply(this && this !== root && this instanceof wrapper ? Ctor : func, this, args);
		}
		return wrapper;
	}
	module.exports = createCurry;
}));
//#endregion
//#region node_modules/lodash/_createPartial.js
var require__createPartial = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var apply = require__apply();
	var createCtor = require__createCtor();
	var root = require__root();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;
	/**
	* Creates a function that wraps `func` to invoke it with the `this` binding
	* of `thisArg` and `partials` prepended to the arguments it receives.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {number} bitmask The bitmask flags. See `createWrap` for more details.
	* @param {*} thisArg The `this` binding of `func`.
	* @param {Array} partials The arguments to prepend to those provided to
	*  the new function.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createPartial(func, bitmask, thisArg, partials) {
		var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
		function wrapper() {
			var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
			while (++leftIndex < leftLength) args[leftIndex] = partials[leftIndex];
			while (argsLength--) args[leftIndex++] = arguments[++argsIndex];
			return apply(fn, isBind ? thisArg : this, args);
		}
		return wrapper;
	}
	module.exports = createPartial;
}));
//#endregion
//#region node_modules/lodash/_mergeData.js
var require__mergeData = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var composeArgs = require__composeArgs();
	var composeArgsRight = require__composeArgsRight();
	var replaceHolders = require__replaceHolders();
	/** Used as the internal argument placeholder. */
	var PLACEHOLDER = "__lodash_placeholder__";
	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;
	var WRAP_BIND_KEY_FLAG = 2;
	var WRAP_CURRY_BOUND_FLAG = 4;
	var WRAP_CURRY_FLAG = 8;
	var WRAP_ARY_FLAG = 128;
	var WRAP_REARG_FLAG = 256;
	var nativeMin = Math.min;
	/**
	* Merges the function metadata of `source` into `data`.
	*
	* Merging metadata reduces the number of wrappers used to invoke a function.
	* This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
	* may be applied regardless of execution order. Methods like `_.ary` and
	* `_.rearg` modify function arguments, making the order in which they are
	* executed important, preventing the merging of metadata. However, we make
	* an exception for a safe combined case where curried functions have `_.ary`
	* and or `_.rearg` applied.
	*
	* @private
	* @param {Array} data The destination metadata.
	* @param {Array} source The source metadata.
	* @returns {Array} Returns `data`.
	*/
	function mergeData(data, source) {
		var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
		var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
		if (!(isCommon || isCombo)) return data;
		if (srcBitmask & WRAP_BIND_FLAG) {
			data[2] = source[2];
			newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
		}
		var value = source[3];
		if (value) {
			var partials = data[3];
			data[3] = partials ? composeArgs(partials, value, source[4]) : value;
			data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
		}
		value = source[5];
		if (value) {
			partials = data[5];
			data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
			data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
		}
		value = source[7];
		if (value) data[7] = value;
		if (srcBitmask & WRAP_ARY_FLAG) data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
		if (data[9] == null) data[9] = source[9];
		data[0] = source[0];
		data[1] = newBitmask;
		return data;
	}
	module.exports = mergeData;
}));
//#endregion
//#region node_modules/lodash/_createWrap.js
var require__createWrap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseSetData = require__baseSetData();
	var createBind = require__createBind();
	var createCurry = require__createCurry();
	var createHybrid = require__createHybrid();
	var createPartial = require__createPartial();
	var getData = require__getData();
	var mergeData = require__mergeData();
	var setData = require__setData();
	var setWrapToString = require__setWrapToString();
	var toInteger = require_toInteger();
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1;
	var WRAP_BIND_KEY_FLAG = 2;
	var WRAP_CURRY_FLAG = 8;
	var WRAP_CURRY_RIGHT_FLAG = 16;
	var WRAP_PARTIAL_FLAG = 32;
	var WRAP_PARTIAL_RIGHT_FLAG = 64;
	var nativeMax = Math.max;
	/**
	* Creates a function that either curries or invokes `func` with optional
	* `this` binding and partially applied arguments.
	*
	* @private
	* @param {Function|string} func The function or method name to wrap.
	* @param {number} bitmask The bitmask flags.
	*    1 - `_.bind`
	*    2 - `_.bindKey`
	*    4 - `_.curry` or `_.curryRight` of a bound function
	*    8 - `_.curry`
	*   16 - `_.curryRight`
	*   32 - `_.partial`
	*   64 - `_.partialRight`
	*  128 - `_.rearg`
	*  256 - `_.ary`
	*  512 - `_.flip`
	* @param {*} [thisArg] The `this` binding of `func`.
	* @param {Array} [partials] The arguments to be partially applied.
	* @param {Array} [holders] The `partials` placeholder indexes.
	* @param {Array} [argPos] The argument positions of the new function.
	* @param {number} [ary] The arity cap of `func`.
	* @param {number} [arity] The arity of `func`.
	* @returns {Function} Returns the new wrapped function.
	*/
	function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
		var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
		if (!isBindKey && typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
		var length = partials ? partials.length : 0;
		if (!length) {
			bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
			partials = holders = void 0;
		}
		ary = ary === void 0 ? ary : nativeMax(toInteger(ary), 0);
		arity = arity === void 0 ? arity : toInteger(arity);
		length -= holders ? holders.length : 0;
		if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
			var partialsRight = partials, holdersRight = holders;
			partials = holders = void 0;
		}
		var data = isBindKey ? void 0 : getData(func);
		var newData = [
			func,
			bitmask,
			thisArg,
			partials,
			holders,
			partialsRight,
			holdersRight,
			argPos,
			ary,
			arity
		];
		if (data) mergeData(newData, data);
		func = newData[0];
		bitmask = newData[1];
		thisArg = newData[2];
		partials = newData[3];
		holders = newData[4];
		arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
		if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
		if (!bitmask || bitmask == WRAP_BIND_FLAG) var result = createBind(func, bitmask, thisArg);
		else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) result = createCurry(func, bitmask, arity);
		else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) result = createPartial(func, bitmask, thisArg, partials);
		else result = createHybrid.apply(void 0, newData);
		return setWrapToString((data ? baseSetData : setData)(result, newData), func, bitmask);
	}
	module.exports = createWrap;
}));
//#endregion
//#region node_modules/lodash/ary.js
var require_ary = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createWrap = require__createWrap();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_ARY_FLAG = 128;
	/**
	* Creates a function that invokes `func`, with up to `n` arguments,
	* ignoring any additional arguments.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category Function
	* @param {Function} func The function to cap arguments for.
	* @param {number} [n=func.length] The arity cap.
	* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	* @returns {Function} Returns the new capped function.
	* @example
	*
	* _.map(['6', '8', '10'], _.ary(parseInt, 1));
	* // => [6, 8, 10]
	*/
	function ary(func, n, guard) {
		n = guard ? void 0 : n;
		n = func && n == null ? func.length : n;
		return createWrap(func, WRAP_ARY_FLAG, void 0, void 0, void 0, void 0, n);
	}
	module.exports = ary;
}));
//#endregion
//#region node_modules/lodash/clone.js
var require_clone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseClone = require__baseClone();
	/** Used to compose bitmasks for cloning. */
	var CLONE_SYMBOLS_FLAG = 4;
	/**
	* Creates a shallow clone of `value`.
	*
	* **Note:** This method is loosely based on the
	* [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
	* and supports cloning arrays, array buffers, booleans, date objects, maps,
	* numbers, `Object` objects, regexes, sets, strings, symbols, and typed
	* arrays. The own enumerable properties of `arguments` objects are cloned
	* as plain objects. An empty object is returned for uncloneable values such
	* as error objects, functions, DOM nodes, and WeakMaps.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to clone.
	* @returns {*} Returns the cloned value.
	* @see _.cloneDeep
	* @example
	*
	* var objects = [{ 'a': 1 }, { 'b': 2 }];
	*
	* var shallow = _.clone(objects);
	* console.log(shallow[0] === objects[0]);
	* // => true
	*/
	function clone(value) {
		return baseClone(value, CLONE_SYMBOLS_FLAG);
	}
	module.exports = clone;
}));
//#endregion
//#region node_modules/lodash/curry.js
var require_curry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createWrap = require__createWrap();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_CURRY_FLAG = 8;
	/**
	* Creates a function that accepts arguments of `func` and either invokes
	* `func` returning its result, if at least `arity` number of arguments have
	* been provided, or returns a function that accepts the remaining `func`
	* arguments, and so on. The arity of `func` may be specified if `func.length`
	* is not sufficient.
	*
	* The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
	* may be used as a placeholder for provided arguments.
	*
	* **Note:** This method doesn't set the "length" property of curried functions.
	*
	* @static
	* @memberOf _
	* @since 2.0.0
	* @category Function
	* @param {Function} func The function to curry.
	* @param {number} [arity=func.length] The arity of `func`.
	* @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	* @returns {Function} Returns the new curried function.
	* @example
	*
	* var abc = function(a, b, c) {
	*   return [a, b, c];
	* };
	*
	* var curried = _.curry(abc);
	*
	* curried(1)(2)(3);
	* // => [1, 2, 3]
	*
	* curried(1, 2)(3);
	* // => [1, 2, 3]
	*
	* curried(1, 2, 3);
	* // => [1, 2, 3]
	*
	* // Curried with placeholders.
	* curried(1)(_, 3)(2);
	* // => [1, 2, 3]
	*/
	function curry(func, arity, guard) {
		arity = guard ? void 0 : arity;
		var result = createWrap(func, WRAP_CURRY_FLAG, void 0, void 0, void 0, void 0, void 0, arity);
		result.placeholder = curry.placeholder;
		return result;
	}
	curry.placeholder = {};
	module.exports = curry;
}));
//#endregion
//#region node_modules/lodash/isError.js
var require_isError = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGetTag = require__baseGetTag();
	var isObjectLike = require_isObjectLike();
	var isPlainObject = require_isPlainObject();
	/** `Object#toString` result references. */
	var domExcTag = "[object DOMException]";
	var errorTag = "[object Error]";
	/**
	* Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	* `SyntaxError`, `TypeError`, or `URIError` object.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	* @example
	*
	* _.isError(new Error);
	* // => true
	*
	* _.isError(Error);
	* // => false
	*/
	function isError(value) {
		if (!isObjectLike(value)) return false;
		var tag = baseGetTag(value);
		return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
	}
	module.exports = isError;
}));
//#endregion
//#region node_modules/lodash/isWeakMap.js
var require_isWeakMap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getTag = require__getTag();
	var isObjectLike = require_isObjectLike();
	/** `Object#toString` result references. */
	var weakMapTag = "[object WeakMap]";
	/**
	* Checks if `value` is classified as a `WeakMap` object.
	*
	* @static
	* @memberOf _
	* @since 4.3.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
	* @example
	*
	* _.isWeakMap(new WeakMap);
	* // => true
	*
	* _.isWeakMap(new Map);
	* // => false
	*/
	function isWeakMap(value) {
		return isObjectLike(value) && getTag(value) == weakMapTag;
	}
	module.exports = isWeakMap;
}));
//#endregion
//#region node_modules/lodash/iteratee.js
var require_iteratee = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseClone = require__baseClone();
	var baseIteratee = require__baseIteratee();
	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1;
	/**
	* Creates a function that invokes `func` with the arguments of the created
	* function. If `func` is a property name, the created function returns the
	* property value for a given element. If `func` is an array or object, the
	* created function returns `true` for elements that contain the equivalent
	* source properties, otherwise it returns `false`.
	*
	* @static
	* @since 4.0.0
	* @memberOf _
	* @category Util
	* @param {*} [func=_.identity] The value to convert to a callback.
	* @returns {Function} Returns the callback.
	* @example
	*
	* var users = [
	*   { 'user': 'barney', 'age': 36, 'active': true },
	*   { 'user': 'fred',   'age': 40, 'active': false }
	* ];
	*
	* // The `_.matches` iteratee shorthand.
	* _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
	* // => [{ 'user': 'barney', 'age': 36, 'active': true }]
	*
	* // The `_.matchesProperty` iteratee shorthand.
	* _.filter(users, _.iteratee(['user', 'fred']));
	* // => [{ 'user': 'fred', 'age': 40 }]
	*
	* // The `_.property` iteratee shorthand.
	* _.map(users, _.iteratee('user'));
	* // => ['barney', 'fred']
	*
	* // Create custom iteratee shorthands.
	* _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
	*   return !_.isRegExp(func) ? iteratee(func) : function(string) {
	*     return func.test(string);
	*   };
	* });
	*
	* _.filter(['abc', 'def'], /ef/);
	* // => ['def']
	*/
	function iteratee(func) {
		return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
	}
	module.exports = iteratee;
}));
//#endregion
//#region node_modules/lodash/_isFlattenable.js
var require__isFlattenable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Symbol = require__Symbol();
	var isArguments = require_isArguments();
	var isArray = require_isArray();
	/** Built-in value references. */
	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
	/**
	* Checks if `value` is a flattenable `arguments` object or array.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	*/
	function isFlattenable(value) {
		return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
	}
	module.exports = isFlattenable;
}));
//#endregion
//#region node_modules/lodash/_baseFlatten.js
var require__baseFlatten = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayPush = require__arrayPush();
	var isFlattenable = require__isFlattenable();
	/**
	* The base implementation of `_.flatten` with support for restricting flattening.
	*
	* @private
	* @param {Array} array The array to flatten.
	* @param {number} depth The maximum recursion depth.
	* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	* @param {Array} [result=[]] The initial result value.
	* @returns {Array} Returns the new flattened array.
	*/
	function baseFlatten(array, depth, predicate, isStrict, result) {
		var index = -1, length = array.length;
		predicate || (predicate = isFlattenable);
		result || (result = []);
		while (++index < length) {
			var value = array[index];
			if (depth > 0 && predicate(value)) if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
			else arrayPush(result, value);
			else if (!isStrict) result[result.length] = value;
		}
		return result;
	}
	module.exports = baseFlatten;
}));
//#endregion
//#region node_modules/lodash/flatten.js
var require_flatten = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseFlatten = require__baseFlatten();
	/**
	* Flattens `array` a single level deep.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Array
	* @param {Array} array The array to flatten.
	* @returns {Array} Returns the new flattened array.
	* @example
	*
	* _.flatten([1, [2, [3, [4]], 5]]);
	* // => [1, 2, [3, [4]], 5]
	*/
	function flatten(array) {
		return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
	}
	module.exports = flatten;
}));
//#endregion
//#region node_modules/lodash/_flatRest.js
var require__flatRest = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var flatten = require_flatten();
	var overRest = require__overRest();
	var setToString = require__setToString();
	/**
	* A specialized version of `baseRest` which flattens the rest array.
	*
	* @private
	* @param {Function} func The function to apply a rest parameter to.
	* @returns {Function} Returns the new function.
	*/
	function flatRest(func) {
		return setToString(overRest(func, void 0, flatten), func + "");
	}
	module.exports = flatRest;
}));
//#endregion
//#region node_modules/lodash/rearg.js
var require_rearg = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createWrap = require__createWrap();
	var flatRest = require__flatRest();
	/** Used to compose bitmasks for function metadata. */
	var WRAP_REARG_FLAG = 256;
	module.exports = flatRest(function(func, indexes) {
		return createWrap(func, WRAP_REARG_FLAG, void 0, void 0, void 0, indexes);
	});
}));
//#endregion
//#region node_modules/lodash/toPath.js
var require_toPath = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayMap = require__arrayMap();
	var copyArray = require__copyArray();
	var isArray = require_isArray();
	var isSymbol = require_isSymbol();
	var stringToPath = require__stringToPath();
	var toKey = require__toKey();
	var toString = require_toString();
	/**
	* Converts `value` to a property path array.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Util
	* @param {*} value The value to convert.
	* @returns {Array} Returns the new property path array.
	* @example
	*
	* _.toPath('a.b.c');
	* // => ['a', 'b', 'c']
	*
	* _.toPath('a[0].b.c');
	* // => ['a', '0', 'b', 'c']
	*/
	function toPath(value) {
		if (isArray(value)) return arrayMap(value, toKey);
		return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
	}
	module.exports = toPath;
}));
//#endregion
//#region node_modules/lodash/fp/_util.js
var require__util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"ary": require_ary(),
		"assign": require__baseAssign(),
		"clone": require_clone(),
		"curry": require_curry(),
		"forEach": require__arrayEach(),
		"isArray": require_isArray(),
		"isError": require_isError(),
		"isFunction": require_isFunction(),
		"isWeakMap": require_isWeakMap(),
		"iteratee": require_iteratee(),
		"keys": require__baseKeys(),
		"rearg": require_rearg(),
		"toInteger": require_toInteger(),
		"toPath": require_toPath()
	};
}));
//#endregion
//#region node_modules/lodash/fp/convert.js
var require_convert = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseConvert = require__baseConvert();
	var util = require__util();
	/**
	* Converts `func` of `name` to an immutable auto-curried iteratee-first data-last
	* version with conversion `options` applied. If `name` is an object its methods
	* will be converted.
	*
	* @param {string} name The name of the function to wrap.
	* @param {Function} [func] The function to wrap.
	* @param {Object} [options] The options object. See `baseConvert` for more details.
	* @returns {Function|Object} Returns the converted function or object.
	*/
	function convert(name, func, options) {
		return baseConvert(util, name, func, options);
	}
	module.exports = convert;
}));
//#endregion
//#region node_modules/lodash/_baseSet.js
var require__baseSet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assignValue = require__assignValue();
	var castPath = require__castPath();
	var isIndex = require__isIndex();
	var isObject = require_isObject();
	var toKey = require__toKey();
	/**
	* The base implementation of `_.set`.
	*
	* @private
	* @param {Object} object The object to modify.
	* @param {Array|string} path The path of the property to set.
	* @param {*} value The value to set.
	* @param {Function} [customizer] The function to customize path creation.
	* @returns {Object} Returns `object`.
	*/
	function baseSet(object, path, value, customizer) {
		if (!isObject(object)) return object;
		path = castPath(path, object);
		var index = -1, length = path.length, lastIndex = length - 1, nested = object;
		while (nested != null && ++index < length) {
			var key = toKey(path[index]), newValue = value;
			if (key === "__proto__" || key === "constructor" || key === "prototype") return object;
			if (index != lastIndex) {
				var objValue = nested[key];
				newValue = customizer ? customizer(objValue, key, nested) : void 0;
				if (newValue === void 0) newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
			}
			assignValue(nested, key, newValue);
			nested = nested[key];
		}
		return object;
	}
	module.exports = baseSet;
}));
//#endregion
//#region node_modules/lodash/set.js
var require_set$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseSet = require__baseSet();
	/**
	* Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
	* it's created. Arrays are created for missing index properties while objects
	* are created for all other missing properties. Use `_.setWith` to customize
	* `path` creation.
	*
	* **Note:** This method mutates `object`.
	*
	* @static
	* @memberOf _
	* @since 3.7.0
	* @category Object
	* @param {Object} object The object to modify.
	* @param {Array|string} path The path of the property to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns `object`.
	* @example
	*
	* var object = { 'a': [{ 'b': { 'c': 3 } }] };
	*
	* _.set(object, 'a[0].b.c', 4);
	* console.log(object.a[0].b.c);
	* // => 4
	*
	* _.set(object, ['x', '0', 'y', 'z'], 5);
	* console.log(object.x[0].y.z);
	* // => 5
	*/
	function set(object, path, value) {
		return object == null ? object : baseSet(object, path, value);
	}
	module.exports = set;
}));
//#endregion
//#region node_modules/lodash/fp/set.js
var require_set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("set", require_set$1());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/lodash/last.js
var require_last = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Gets the last element of `array`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Array
	* @param {Array} array The array to query.
	* @returns {*} Returns the last element of `array`.
	* @example
	*
	* _.last([1, 2, 3]);
	* // => 3
	*/
	function last(array) {
		var length = array == null ? 0 : array.length;
		return length ? array[length - 1] : void 0;
	}
	module.exports = last;
}));
//#endregion
//#region node_modules/lodash/_parent.js
var require__parent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseGet = require__baseGet();
	var baseSlice = require__baseSlice();
	/**
	* Gets the parent value at `path` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Array} path The path to get the parent value of.
	* @returns {*} Returns the parent value.
	*/
	function parent(object, path) {
		return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
	}
	module.exports = parent;
}));
//#endregion
//#region node_modules/lodash/_baseUnset.js
var require__baseUnset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var castPath = require__castPath();
	var last = require_last();
	var parent = require__parent();
	var toKey = require__toKey();
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* The base implementation of `_.unset`.
	*
	* @private
	* @param {Object} object The object to modify.
	* @param {Array|string} path The property path to unset.
	* @returns {boolean} Returns `true` if the property is deleted, else `false`.
	*/
	function baseUnset(object, path) {
		path = castPath(path, object);
		var index = -1, length = path.length;
		if (!length) return true;
		while (++index < length) {
			var key = toKey(path[index]);
			if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) return false;
			if ((key === "constructor" || key === "prototype") && index < length - 1) return false;
		}
		var obj = parent(object, path);
		return obj == null || delete obj[toKey(last(path))];
	}
	module.exports = baseUnset;
}));
//#endregion
//#region node_modules/lodash/unset.js
var require_unset$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseUnset = require__baseUnset();
	/**
	* Removes the property at `path` of `object`.
	*
	* **Note:** This method mutates `object`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Object
	* @param {Object} object The object to modify.
	* @param {Array|string} path The path of the property to unset.
	* @returns {boolean} Returns `true` if the property is deleted, else `false`.
	* @example
	*
	* var object = { 'a': [{ 'b': { 'c': 7 } }] };
	* _.unset(object, 'a[0].b.c');
	* // => true
	*
	* console.log(object);
	* // => { 'a': [{ 'b': {} }] };
	*
	* _.unset(object, ['a', '0', 'b', 'c']);
	* // => true
	*
	* console.log(object);
	* // => { 'a': [{ 'b': {} }] };
	*/
	function unset(object, path) {
		return object == null ? true : baseUnset(object, path);
	}
	module.exports = unset;
}));
//#endregion
//#region node_modules/lodash/fp/unset.js
var require_unset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var func = require_convert()("unset", require_unset$1());
	func.placeholder = require_placeholder();
	module.exports = func;
}));
//#endregion
//#region node_modules/lodash/_basePullAt.js
var require__basePullAt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseUnset = require__baseUnset();
	var isIndex = require__isIndex();
	/** Built-in value references. */
	var splice = Array.prototype.splice;
	/**
	* The base implementation of `_.pullAt` without support for individual
	* indexes or capturing the removed elements.
	*
	* @private
	* @param {Array} array The array to modify.
	* @param {number[]} indexes The indexes of elements to remove.
	* @returns {Array} Returns `array`.
	*/
	function basePullAt(array, indexes) {
		var length = array ? indexes.length : 0, lastIndex = length - 1;
		while (length--) {
			var index = indexes[length];
			if (length == lastIndex || index !== previous) {
				var previous = index;
				if (isIndex(index)) splice.call(array, index, 1);
				else baseUnset(array, index);
			}
		}
		return array;
	}
	module.exports = basePullAt;
}));
//#endregion
//#region node_modules/lodash/remove.js
var require_remove = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseIteratee = require__baseIteratee();
	var basePullAt = require__basePullAt();
	/**
	* Removes all elements from `array` that `predicate` returns truthy for
	* and returns an array of the removed elements. The predicate is invoked
	* with three arguments: (value, index, array).
	*
	* **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
	* to pull elements from an array by value.
	*
	* @static
	* @memberOf _
	* @since 2.0.0
	* @category Array
	* @param {Array} array The array to modify.
	* @param {Function} [predicate=_.identity] The function invoked per iteration.
	* @returns {Array} Returns the new array of removed elements.
	* @example
	*
	* var array = [1, 2, 3, 4];
	* var evens = _.remove(array, function(n) {
	*   return n % 2 == 0;
	* });
	*
	* console.log(array);
	* // => [1, 3]
	*
	* console.log(evens);
	* // => [2, 4]
	*/
	function remove(array, predicate) {
		var result = [];
		if (!(array && array.length)) return result;
		var index = -1, indexes = [], length = array.length;
		predicate = baseIteratee(predicate, 3);
		while (++index < length) {
			var value = array[index];
			if (predicate(value, index, array)) {
				result.push(value);
				indexes.push(index);
			}
		}
		basePullAt(array, indexes);
		return result;
	}
	module.exports = remove;
}));
//#endregion
//#region node_modules/lodash/_baseClamp.js
var require__baseClamp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.clamp` which doesn't coerce arguments.
	*
	* @private
	* @param {number} number The number to clamp.
	* @param {number} [lower] The lower bound.
	* @param {number} upper The upper bound.
	* @returns {number} Returns the clamped number.
	*/
	function baseClamp(number, lower, upper) {
		if (number === number) {
			if (upper !== void 0) number = number <= upper ? number : upper;
			if (lower !== void 0) number = number >= lower ? number : lower;
		}
		return number;
	}
	module.exports = baseClamp;
}));
//#endregion
//#region node_modules/lodash/endsWith.js
var require_endsWith = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseClamp = require__baseClamp();
	var baseToString = require__baseToString();
	var toInteger = require_toInteger();
	var toString = require_toString();
	/**
	* Checks if `string` ends with the given target string.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category String
	* @param {string} [string=''] The string to inspect.
	* @param {string} [target] The string to search for.
	* @param {number} [position=string.length] The position to search up to.
	* @returns {boolean} Returns `true` if `string` ends with `target`,
	*  else `false`.
	* @example
	*
	* _.endsWith('abc', 'c');
	* // => true
	*
	* _.endsWith('abc', 'b');
	* // => false
	*
	* _.endsWith('abc', 'b', 2);
	* // => true
	*/
	function endsWith(string, target, position) {
		string = toString(string);
		target = baseToString(target);
		var length = string.length;
		position = position === void 0 ? length : baseClamp(toInteger(position), 0, length);
		var end = position;
		position -= target.length;
		return position >= 0 && string.slice(position, end) == target;
	}
	module.exports = endsWith;
}));
//#endregion
//#region node_modules/lodash/_baseReduce.js
var require__baseReduce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* The base implementation of `_.reduce` and `_.reduceRight`, without support
	* for iteratee shorthands, which iterates over `collection` using `eachFunc`.
	*
	* @private
	* @param {Array|Object} collection The collection to iterate over.
	* @param {Function} iteratee The function invoked per iteration.
	* @param {*} accumulator The initial value.
	* @param {boolean} initAccum Specify using the first or last element of
	*  `collection` as the initial value.
	* @param {Function} eachFunc The function to iterate over `collection`.
	* @returns {*} Returns the accumulated value.
	*/
	function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
		eachFunc(collection, function(value, index, collection) {
			accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
		});
		return accumulator;
	}
	module.exports = baseReduce;
}));
//#endregion
//#region node_modules/lodash/reduce.js
var require_reduce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayReduce = require__arrayReduce();
	var baseEach = require__baseEach();
	var baseIteratee = require__baseIteratee();
	var baseReduce = require__baseReduce();
	var isArray = require_isArray();
	/**
	* Reduces `collection` to a value which is the accumulated result of running
	* each element in `collection` thru `iteratee`, where each successive
	* invocation is supplied the return value of the previous. If `accumulator`
	* is not given, the first element of `collection` is used as the initial
	* value. The iteratee is invoked with four arguments:
	* (accumulator, value, index|key, collection).
	*
	* Many lodash methods are guarded to work as iteratees for methods like
	* `_.reduce`, `_.reduceRight`, and `_.transform`.
	*
	* The guarded methods are:
	* `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	* and `sortBy`
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Collection
	* @param {Array|Object} collection The collection to iterate over.
	* @param {Function} [iteratee=_.identity] The function invoked per iteration.
	* @param {*} [accumulator] The initial value.
	* @returns {*} Returns the accumulated value.
	* @see _.reduceRight
	* @example
	*
	* _.reduce([1, 2], function(sum, n) {
	*   return sum + n;
	* }, 0);
	* // => 3
	*
	* _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	*   (result[value] || (result[value] = [])).push(key);
	*   return result;
	* }, {});
	* // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	*/
	function reduce(collection, iteratee, accumulator) {
		var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
		return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	}
	module.exports = reduce;
}));
//#endregion
//#region node_modules/lodash/_baseToPairs.js
var require__baseToPairs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var arrayMap = require__arrayMap();
	/**
	* The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
	* of key-value pairs for `object` corresponding to the property names of `props`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Array} props The property names to get values for.
	* @returns {Object} Returns the key-value pairs.
	*/
	function baseToPairs(object, props) {
		return arrayMap(props, function(key) {
			return [key, object[key]];
		});
	}
	module.exports = baseToPairs;
}));
//#endregion
//#region node_modules/lodash/_setToPairs.js
var require__setToPairs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Converts `set` to its value-value pairs.
	*
	* @private
	* @param {Object} set The set to convert.
	* @returns {Array} Returns the value-value pairs.
	*/
	function setToPairs(set) {
		var index = -1, result = Array(set.size);
		set.forEach(function(value) {
			result[++index] = [value, value];
		});
		return result;
	}
	module.exports = setToPairs;
}));
//#endregion
//#region node_modules/lodash/_createToPairs.js
var require__createToPairs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseToPairs = require__baseToPairs();
	var getTag = require__getTag();
	var mapToArray = require__mapToArray();
	var setToPairs = require__setToPairs();
	/** `Object#toString` result references. */
	var mapTag = "[object Map]";
	var setTag = "[object Set]";
	/**
	* Creates a `_.toPairs` or `_.toPairsIn` function.
	*
	* @private
	* @param {Function} keysFunc The function to get the keys of a given object.
	* @returns {Function} Returns the new pairs function.
	*/
	function createToPairs(keysFunc) {
		return function(object) {
			var tag = getTag(object);
			if (tag == mapTag) return mapToArray(object);
			if (tag == setTag) return setToPairs(object);
			return baseToPairs(object, keysFunc(object));
		};
	}
	module.exports = createToPairs;
}));
//#endregion
//#region node_modules/lodash/toPairs.js
var require_toPairs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require__createToPairs()(require_keys());
}));
//#endregion
//#region node_modules/lodash/isUndefined.js
var require_isUndefined = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if `value` is `undefined`.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	* @example
	*
	* _.isUndefined(void 0);
	* // => true
	*
	* _.isUndefined(null);
	* // => false
	*/
	function isUndefined(value) {
		return value === void 0;
	}
	module.exports = isUndefined;
}));
//#endregion
//#region node_modules/@jsonforms/core/lib/jsonforms-core.esm.js
var import_isEmpty = /* @__PURE__ */ __toESM(require_isEmpty());
var import_startCase = /* @__PURE__ */ __toESM(require_startCase());
var import_keys = /* @__PURE__ */ __toESM(require_keys());
var import_range = /* @__PURE__ */ __toESM(require_range());
var import_get = /* @__PURE__ */ __toESM(require_get());
var import_has = /* @__PURE__ */ __toESM(require_has());
var import_find = /* @__PURE__ */ __toESM(require_find());
var import_includes = /* @__PURE__ */ __toESM(require_includes());
var import_ajv = /* @__PURE__ */ __toESM(require_ajv());
var import_dist = /* @__PURE__ */ __toESM(require_dist());
var import_filter = /* @__PURE__ */ __toESM(require_filter());
var import_isEqual = /* @__PURE__ */ __toESM(require_isEqual());
var import_merge = /* @__PURE__ */ __toESM(require_merge());
var import_cloneDeep = /* @__PURE__ */ __toESM(require_cloneDeep());
var import_set = /* @__PURE__ */ __toESM(require_set());
var import_unset = /* @__PURE__ */ __toESM(require_unset());
var import_isFunction = /* @__PURE__ */ __toESM(require_isFunction());
var import_maxBy = /* @__PURE__ */ __toESM(require_maxBy());
require_remove();
var import_endsWith = /* @__PURE__ */ __toESM(require_endsWith());
var import_last = /* @__PURE__ */ __toESM(require_last());
var import_reduce = /* @__PURE__ */ __toESM(require_reduce());
var import_toPairs = /* @__PURE__ */ __toESM(require_toPairs());
var import_isUndefined = /* @__PURE__ */ __toESM(require_isUndefined());
var ADDITIONAL_PROPERTIES = "additionalProperties";
var REQUIRED_PROPERTIES = "required";
var distinct = (properties, discriminator) => {
	const known = {};
	return properties.filter((item) => {
		const discriminatorValue = discriminator(item);
		if (Object.prototype.hasOwnProperty.call(known, discriminatorValue)) return false;
		else {
			known[discriminatorValue] = true;
			return true;
		}
	});
};
var Gen = class {
	constructor(findOption) {
		this.findOption = findOption;
		this.schemaObject = (data) => {
			const props = this.properties(data);
			const schema = {
				type: "object",
				properties: props,
				additionalProperties: this.findOption(props)(ADDITIONAL_PROPERTIES)
			};
			const required = this.findOption(props)(REQUIRED_PROPERTIES);
			if (required.length > 0) schema.required = required;
			return schema;
		};
		this.properties = (data) => {
			return Object.keys(data).reduce((acc, propName) => {
				acc[propName] = this.property(data[propName]);
				return acc;
			}, {});
		};
		this.property = (data) => {
			switch (typeof data) {
				case "string": return { type: "string" };
				case "boolean": return { type: "boolean" };
				case "number":
					if (Number.isInteger(data)) return { type: "integer" };
					return { type: "number" };
				case "object":
					if (data == null) return { type: "null" };
					return this.schemaObjectOrArray(data);
				default: return {};
			}
		};
		this.schemaObjectOrArray = (data) => {
			if (data instanceof Array) return this.schemaArray(data);
			else return this.schemaObject(data);
		};
		this.schemaArray = (data) => {
			if (data.length > 0) {
				const uniqueProperties = distinct(data.map(this.property), (prop) => JSON.stringify(prop));
				if (uniqueProperties.length === 1) return {
					type: "array",
					items: uniqueProperties[0]
				};
				else return {
					type: "array",
					items: { oneOf: uniqueProperties }
				};
			} else return {
				type: "array",
				items: {}
			};
		};
	}
};
var generateJsonSchema = (instance, options = {}) => {
	const findOption = (props) => (optionName) => {
		switch (optionName) {
			case ADDITIONAL_PROPERTIES:
				if (Object.prototype.hasOwnProperty.call(options, ADDITIONAL_PROPERTIES)) return options[ADDITIONAL_PROPERTIES];
				return true;
			case REQUIRED_PROPERTIES:
				if (Object.prototype.hasOwnProperty.call(options, REQUIRED_PROPERTIES)) return options[REQUIRED_PROPERTIES](props);
				return Object.keys(props);
			default: return;
		}
	};
	return new Gen(findOption).schemaObject(instance);
};
var idSlots = /* @__PURE__ */ new Map();
var prefixStates = /* @__PURE__ */ new Map();
var makeId = (idBase, iteration) => iteration <= 1 ? idBase : idBase + iteration.toString();
var createId = (proposedId) => {
	if (proposedId === void 0) proposedId = "undefined";
	let state = prefixStates.get(proposedId);
	if (state === void 0) {
		state = {
			used: /* @__PURE__ */ new Set(),
			next: 0
		};
		prefixStates.set(proposedId, state);
	}
	let tries = state.next;
	while (state.used.has(tries) || idSlots.has(makeId(proposedId, tries))) tries++;
	const newId = makeId(proposedId, tries);
	state.used.add(tries);
	state.next = tries + 1;
	idSlots.set(newId, {
		prefix: proposedId,
		index: tries
	});
	return newId;
};
var removeId = (id) => {
	const slot = idSlots.get(id);
	if (slot === void 0) return false;
	idSlots.delete(id);
	const state = prefixStates.get(slot.prefix);
	if (state !== void 0) {
		state.used.delete(slot.index);
		if (slot.index < state.next) state.next = slot.index;
		if (state.used.size === 0) prefixStates.delete(slot.prefix);
	}
	return true;
};
var clearAllIds = () => {
	idSlots.clear();
	prefixStates.clear();
};
var Id = {
	createId,
	removeId,
	clearAllIds
};
var compose = (path1, path2) => {
	let p1 = path1;
	if (!(0, import_isEmpty.default)(path1) && !(0, import_isEmpty.default)(path2) && !path2.startsWith("[")) p1 = path1 + ".";
	if ((0, import_isEmpty.default)(p1)) return path2;
	else if ((0, import_isEmpty.default)(path2)) return p1;
	else return `${p1}${path2}`;
};
var toDataPathSegments = (schemaPath) => {
	const decodedSegments = schemaPath.replace(/(anyOf|allOf|oneOf)\/[\d]+\//g, "").replace(/(then|else)\//g, "").split("/").map(decode);
	const startIndex = decodedSegments[0] === "#" || decodedSegments[0] === "" ? 2 : 1;
	return (0, import_range.default)(startIndex, decodedSegments.length, 2).map((idx) => decodedSegments[idx]);
};
var encode = (segment) => segment?.replace(/~/g, "~0").replace(/\//g, "~1");
var decode = (pointerSegment) => pointerSegment?.replace(/~1/g, "/").replace(/~0/, "~");
var deriveLabel = (controlElement, schemaElement) => {
	if (schemaElement && typeof schemaElement.title === "string") return schemaElement.title;
	if (typeof controlElement.scope === "string") {
		const ref = controlElement.scope;
		const label = decode(ref.substr(ref.lastIndexOf("/") + 1));
		return (0, import_startCase.default)(label);
	}
	return "";
};
var createLabelDescriptionFrom = (withLabel, schema) => {
	const labelProperty = withLabel.label;
	if (typeof labelProperty === "boolean") return labelDescription(deriveLabel(withLabel, schema), labelProperty);
	if (typeof labelProperty === "string") return labelDescription(labelProperty, true);
	if (typeof labelProperty === "object") return labelDescription(typeof labelProperty.text === "string" ? labelProperty.text : deriveLabel(withLabel, schema), typeof labelProperty.show === "boolean" ? labelProperty.show : true);
	return labelDescription(deriveLabel(withLabel, schema), true);
};
var labelDescription = (text, show) => ({
	text,
	show
});
var resolveData = (instance, dataPath) => {
	if ((0, import_isEmpty.default)(dataPath)) return instance;
	return dataPath.split(".").reduce((curInstance, decodedSegment) => {
		if (!curInstance || !Object.prototype.hasOwnProperty.call(curInstance, decodedSegment)) return;
		return curInstance[decodedSegment];
	}, instance);
};
var invalidSegment = (pathSegment) => pathSegment === "#" || pathSegment === void 0 || pathSegment === "";
var resolveSchema = (schema, schemaPath, rootSchema) => {
	return doResolveSchema(schema, schemaPath, {
		rootSchema,
		resolutionMap: /* @__PURE__ */ new Map()
	});
};
var doResolveSchema = (schema, schemaPath, ctx) => {
	let resolvedSchema = void 0;
	if (schema && typeof schema.$ref === "string") {
		const baseSchema = resolvePath(ctx.rootSchema, schema.$ref, ctx);
		if (baseSchema !== void 0) resolvedSchema = resolvePath(baseSchema, schemaPath, ctx);
	}
	if (resolvedSchema === void 0) resolvedSchema = resolvePath(schema, schemaPath, ctx);
	return resolvedSchema;
};
var resolvePath = (schema, schemaPath, ctx) => {
	let visitedPaths = ctx.resolutionMap.get(schema);
	if (!visitedPaths) {
		visitedPaths = /* @__PURE__ */ new Set();
		ctx.resolutionMap.set(schema, visitedPaths);
	}
	if (visitedPaths.has(schemaPath)) return;
	visitedPaths.add(schemaPath);
	const resolvedSchema = resolvePathSegmentsWithCombinatorFallback(schema, schemaPath?.split("/").map(decode), ctx);
	visitedPaths.delete(schemaPath);
	return resolvedSchema;
};
var resolvePathSegmentsWithCombinatorFallback = (schema, pathSegments, ctx) => {
	if (!pathSegments || pathSegments.length === 0) return schema;
	if ((0, import_isEmpty.default)(schema)) return;
	const resolvedSchema = resolvePathSegments(schema, pathSegments, ctx);
	if (resolvedSchema !== void 0) return resolvedSchema;
	const subSchemas = [].concat(schema.oneOf ?? [], schema.allOf ?? [], schema.anyOf ?? [], schema.then ?? [], schema.else ?? []);
	for (const subSchema of subSchemas) {
		let resolvedSubSchema = subSchema;
		if (subSchema && typeof subSchema.$ref === "string") resolvedSubSchema = doResolveSchema(ctx.rootSchema, subSchema.$ref, ctx);
		const alternativeResolveResult = resolvePathSegmentsWithCombinatorFallback(resolvedSubSchema, pathSegments, ctx);
		if (alternativeResolveResult) return alternativeResolveResult;
	}
};
var resolvePathSegments = (schema, pathSegments, ctx) => {
	if (!pathSegments || pathSegments.length === 0) return schema;
	if ((0, import_isEmpty.default)(schema)) return;
	const singleStepResult = resolveSingleStep(schema, pathSegments);
	if (singleStepResult.schema && typeof singleStepResult.schema.$ref === "string") singleStepResult.schema = doResolveSchema(ctx.rootSchema, singleStepResult.schema.$ref, ctx);
	return resolvePathSegmentsWithCombinatorFallback(singleStepResult.schema, singleStepResult.remainingPathSegments, ctx);
};
var resolveSingleStep = (schema, pathSegments) => {
	if (!pathSegments || pathSegments.length === 0) return {
		schema,
		remainingPathSegments: []
	};
	if ((0, import_isEmpty.default)(schema)) return {
		schema: void 0,
		remainingPathSegments: pathSegments
	};
	const [segment, ...remainingPathSegments] = pathSegments;
	if (invalidSegment(segment)) return resolveSingleStep(schema, remainingPathSegments);
	return {
		schema: (0, import_get.default)(schema, segment),
		remainingPathSegments,
		resolvedSegment: segment
	};
};
var RuleEffect;
(function(RuleEffect) {
	RuleEffect["HIDE"] = "HIDE";
	RuleEffect["SHOW"] = "SHOW";
	RuleEffect["ENABLE"] = "ENABLE";
	RuleEffect["DISABLE"] = "DISABLE";
	RuleEffect["READONLY"] = "READONLY";
	RuleEffect["WRITABLE"] = "WRITABLE";
})(RuleEffect || (RuleEffect = {}));
var composeWithUi = (scopableUi, path) => {
	if (!isScoped(scopableUi)) return path ?? "";
	const segments = toDataPathSegments(scopableUi.scope);
	if ((0, import_isEmpty.default)(segments)) return path ?? "";
	return compose(path, segments.join("."));
};
var isInternationalized = (element) => typeof element === "object" && element !== null && typeof element.i18n === "string";
var isGroup = (layout) => layout.type === "Group";
var isLayout = (uischema) => uischema.elements !== void 0;
var isScopable = (obj) => !!obj && typeof obj === "object";
var isScoped = (obj) => isScopable(obj) && typeof obj.scope === "string";
var isLabelable = (obj) => !!obj && typeof obj === "object";
var isOrCondition = (condition) => condition.type === "OR";
var isAndCondition = (condition) => condition.type === "AND";
var isLeafCondition = (condition) => condition.type === "LEAF";
var isSchemaCondition = (condition) => (0, import_has.default)(condition, "schema");
var isValidateFunctionCondition = (condition) => (0, import_has.default)(condition, "validate") && typeof condition.validate === "function";
var getConditionScope = (condition, path) => {
	return composeWithUi(condition, path);
};
var evaluateCondition = (data, uischema, condition, path, ajv, config) => {
	if (isAndCondition(condition)) return condition.conditions.reduce((acc, cur) => acc && evaluateCondition(data, uischema, cur, path, ajv, config), true);
	else if (isOrCondition(condition)) return condition.conditions.reduce((acc, cur) => acc || evaluateCondition(data, uischema, cur, path, ajv, config), false);
	else if (isLeafCondition(condition)) return resolveData(data, getConditionScope(condition, path)) === condition.expectedValue;
	else if (isSchemaCondition(condition)) {
		const value = resolveData(data, getConditionScope(condition, path));
		if (condition.failWhenUndefined && value === void 0) return false;
		return ajv.validate(condition.schema, value);
	} else if (isValidateFunctionCondition(condition)) {
		const context = {
			data: resolveData(data, getConditionScope(condition, path)),
			fullData: data,
			path,
			uischemaElement: uischema,
			config
		};
		return condition.validate(context);
	} else return true;
};
var isRuleFulfilled = (uischema, data, path, ajv, config) => {
	const condition = uischema.rule.condition;
	return evaluateCondition(data, uischema, condition, path, ajv, config);
};
var evalVisibility = (uischema, data, path = void 0, ajv, config) => {
	const fulfilled = isRuleFulfilled(uischema, data, path, ajv, config);
	switch (uischema.rule.effect) {
		case RuleEffect.HIDE: return !fulfilled;
		case RuleEffect.SHOW: return fulfilled;
		default: return true;
	}
};
var evalEnablement = (uischema, data, path = void 0, ajv, config) => {
	const fulfilled = isRuleFulfilled(uischema, data, path, ajv, config);
	switch (uischema.rule.effect) {
		case RuleEffect.DISABLE: return !fulfilled;
		case RuleEffect.ENABLE: return fulfilled;
		default: return true;
	}
};
var evalReadonly = (uischema, data, path = void 0, ajv, config) => {
	const fulfilled = isRuleFulfilled(uischema, data, path, ajv, config);
	switch (uischema.rule.effect) {
		case RuleEffect.WRITABLE: return !fulfilled;
		case RuleEffect.READONLY: return fulfilled;
		default: return false;
	}
};
var hasShowRule = (uischema) => {
	if (uischema.rule && (uischema.rule.effect === RuleEffect.SHOW || uischema.rule.effect === RuleEffect.HIDE)) return true;
	return false;
};
var hasEnableRule = (uischema) => {
	if (uischema.rule && (uischema.rule.effect === RuleEffect.ENABLE || uischema.rule.effect === RuleEffect.DISABLE)) return true;
	return false;
};
var hasReadonlyRule = (uischema) => {
	if (uischema.rule && (uischema.rule.effect === RuleEffect.READONLY || uischema.rule.effect === RuleEffect.WRITABLE)) return true;
	return false;
};
var isVisible = (uischema, data, path = void 0, ajv, config) => {
	if (uischema.rule) return evalVisibility(uischema, data, path, ajv, config);
	return true;
};
var isEnabled = (uischema, data, path = void 0, ajv, config) => {
	if (uischema.rule) return evalEnablement(uischema, data, path, ajv, config);
	return true;
};
var isReadonly = (uischema, data, path = void 0, ajv, config) => {
	if (uischema.rule) return evalReadonly(uischema, data, path, ajv, config);
	return false;
};
var isOneOfEnumSchema = (schema) => !!schema && Object.prototype.hasOwnProperty.call(schema, "oneOf") && schema.oneOf && schema.oneOf.every((s) => s.const !== void 0);
var isEnumSchema = (schema) => !!schema && typeof schema === "object" && (Object.prototype.hasOwnProperty.call(schema, "enum") || Object.prototype.hasOwnProperty.call(schema, "const"));
var convertDateToString = (date, format) => {
	const dateString = date.toISOString();
	if (format === "date-time") return dateString;
	else if (format === "date") return dateString.split("T")[0];
	else if (format === "time") return dateString.split("T")[1].split(".")[0];
	return dateString;
};
var convertToValidClassName = (s) => s.replace("#", "root").replace(/* @__PURE__ */ new RegExp("/", "g"), "_");
var hasType = (jsonSchema, expected) => {
	return (0, import_includes.default)(deriveTypes(jsonSchema), expected);
};
var deriveTypes = (jsonSchema) => {
	if ((0, import_isEmpty.default)(jsonSchema)) return [];
	if (!(0, import_isEmpty.default)(jsonSchema.type) && typeof jsonSchema.type === "string") return [jsonSchema.type];
	if (Array.isArray(jsonSchema.type)) return jsonSchema.type;
	if (!(0, import_isEmpty.default)(jsonSchema.properties) || !(0, import_isEmpty.default)(jsonSchema.additionalProperties)) return ["object"];
	if (!(0, import_isEmpty.default)(jsonSchema.items)) return ["array"];
	if (!(0, import_isEmpty.default)(jsonSchema.enum)) {
		const types = /* @__PURE__ */ new Set();
		jsonSchema.enum.forEach((enumElement) => {
			if (typeof enumElement === "string") types.add("string");
			else deriveTypes(enumElement).forEach((type) => types.add(type));
		});
		return Array.from(types);
	}
	if (!(0, import_isEmpty.default)(jsonSchema.allOf)) {
		const allOfType = (0, import_find.default)(jsonSchema.allOf, (schema) => deriveTypes(schema).length !== 0);
		if (allOfType) return deriveTypes(allOfType);
	}
	return [];
};
var Resolve = {
	schema: resolveSchema,
	data: resolveData
};
var fromScoped = (scopable) => toDataPathSegments(scopable.scope).join(".");
var Paths = {
	compose,
	fromScoped
};
var createAjv = (options) => {
	const ajv = new import_ajv.default({
		allErrors: true,
		verbose: true,
		strict: false,
		addUsedSchema: false,
		...options
	});
	(0, import_dist.default)(ajv);
	return ajv;
};
var validate = (validator, data) => {
	if (validator === void 0) return [];
	if (validator(data)) return [];
	return validator.errors;
};
var getInvalidProperty = (error) => {
	switch (error.keyword) {
		case "required":
		case "dependencies": return error.params.missingProperty;
		case "additionalProperties": return error.params.additionalProperty;
		default: return;
	}
};
var getControlPath = (error) => {
	let controlPath = error.dataPath || error.instancePath || "";
	controlPath = controlPath.replace(/\//g, ".");
	const invalidProperty = getInvalidProperty(error);
	if (invalidProperty !== void 0) controlPath = `${controlPath}.${invalidProperty}`;
	controlPath = controlPath.replace(/^\./, "");
	controlPath = decode(controlPath);
	return controlPath;
};
var errorsAt = (instancePath, schema, matchPath) => (errors) => {
	const combinatorPaths = (0, import_filter.default)(errors, (error) => error.keyword === "oneOf" || error.keyword === "anyOf").map((error) => getControlPath(error));
	return (0, import_filter.default)(errors, (error) => {
		if (filteredErrorKeywords.indexOf(error.keyword) !== -1 && !isOneOfEnumSchema(error.parentSchema)) return false;
		let result = matchPath(getControlPath(error));
		const parentSchema = error.parentSchema;
		if (result && !isObjectSchema(parentSchema) && !isOneOfEnumSchema(parentSchema) && combinatorPaths.findIndex((p) => instancePath.startsWith(p)) !== -1) result = result && (0, import_isEqual.default)(parentSchema, schema);
		return result;
	});
};
var isObjectSchema = (schema) => {
	return schema?.type === "object" || !!schema?.properties;
};
var filteredErrorKeywords = [
	"additionalProperties",
	"allOf",
	"anyOf",
	"oneOf"
];
var formatErrorMessage = (errors) => {
	if (errors === void 0 || errors === null) return "";
	return errors.join("\n");
};
var Helpers = {
	createLabelDescriptionFrom,
	convertToValidClassName
};
var createLayout = (layoutType) => ({
	type: layoutType,
	elements: []
});
var createControlElement = (ref) => ({
	type: "Control",
	scope: ref
});
var wrapInLayoutIfNecessary = (uischema, layoutType) => {
	if (!(0, import_isEmpty.default)(uischema) && !isLayout(uischema)) {
		const verticalLayout = createLayout(layoutType);
		verticalLayout.elements.push(uischema);
		return verticalLayout;
	}
	return uischema;
};
var addLabel = (layout, labelName) => {
	if (!(0, import_isEmpty.default)(labelName)) {
		const fixedLabel = (0, import_startCase.default)(labelName);
		if (isGroup(layout)) layout.label = fixedLabel;
		else {
			const label = {
				type: "Label",
				text: fixedLabel
			};
			layout.elements.push(label);
		}
	}
};
var isCombinator = (jsonSchema) => {
	return !(0, import_isEmpty.default)(jsonSchema) && (!(0, import_isEmpty.default)(jsonSchema.oneOf) || !(0, import_isEmpty.default)(jsonSchema.anyOf) || !(0, import_isEmpty.default)(jsonSchema.allOf));
};
var generateUISchema = (jsonSchema, schemaElements, currentRef, schemaName, layoutType, rootSchema) => {
	if (!(0, import_isEmpty.default)(jsonSchema) && jsonSchema.$ref !== void 0) return generateUISchema(resolveSchema(rootSchema, jsonSchema.$ref, rootSchema), schemaElements, currentRef, schemaName, layoutType, rootSchema);
	if (isCombinator(jsonSchema)) {
		const controlObject = createControlElement(currentRef);
		schemaElements.push(controlObject);
		return controlObject;
	}
	const types = deriveTypes(jsonSchema);
	if (types.length === 0) return null;
	const nonNullTypes = types.filter((t) => t !== "null");
	const effectiveTypes = nonNullTypes.length > 0 ? nonNullTypes : types;
	if (effectiveTypes.length > 1) {
		const controlObject = createControlElement(currentRef);
		schemaElements.push(controlObject);
		return controlObject;
	}
	if (currentRef === "#" && effectiveTypes[0] === "object") {
		const layout = createLayout(layoutType);
		schemaElements.push(layout);
		if (jsonSchema.properties && (0, import_keys.default)(jsonSchema.properties).length > 1) addLabel(layout, schemaName);
		if (!(0, import_isEmpty.default)(jsonSchema.properties)) {
			const nextRef = currentRef + "/properties";
			Object.keys(jsonSchema.properties).map((propName) => {
				let value = jsonSchema.properties[propName];
				const ref = `${nextRef}/${encode(propName)}`;
				if (value.$ref !== void 0) value = resolveSchema(rootSchema, value.$ref, rootSchema);
				generateUISchema(value, layout.elements, ref, propName, layoutType, rootSchema);
			});
		}
		return layout;
	}
	switch (effectiveTypes[0]) {
		case "object":
		case "array":
		case "string":
		case "number":
		case "integer":
		case "null":
		case "boolean": {
			const controlObject = createControlElement(currentRef);
			schemaElements.push(controlObject);
			return controlObject;
		}
		default: throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
	}
};
var generateDefaultUISchema = (jsonSchema, layoutType = "VerticalLayout", prefix = "#", rootSchema = jsonSchema) => wrapInLayoutIfNecessary(generateUISchema(jsonSchema, [], prefix, "", layoutType, rootSchema), layoutType);
var Generate = {
	jsonSchema: generateJsonSchema,
	uiSchema: generateDefaultUISchema,
	controlElement: createControlElement
};
var INIT = "jsonforms/INIT";
var UPDATE_CORE = "jsonforms/UPDATE_CORE";
var SET_AJV = "jsonforms/SET_AJV";
var UPDATE_DATA = "jsonforms/UPDATE";
var UPDATE_ERRORS = "jsonforms/UPDATE_ERRORS";
var VALIDATE = "jsonforms/VALIDATE";
var ADD_RENDERER = "jsonforms/ADD_RENDERER";
var REMOVE_RENDERER = "jsonforms/REMOVE_RENDERER";
var ADD_CELL = "jsonforms/ADD_CELL";
var REMOVE_CELL = "jsonforms/REMOVE_CELL";
var SET_CONFIG = "jsonforms/SET_CONFIG";
var ADD_UI_SCHEMA = "jsonforms/ADD_UI_SCHEMA";
var REMOVE_UI_SCHEMA = "jsonforms/REMOVE_UI_SCHEMA";
var SET_SCHEMA = "jsonforms/SET_SCHEMA";
var SET_UISCHEMA = "jsonforms/SET_UISCHEMA";
var SET_VALIDATION_MODE = "jsonforms/SET_VALIDATION_MODE";
var SET_LOCALE = "jsonforms/SET_LOCALE";
var SET_TRANSLATOR = "jsonforms/SET_TRANSLATOR";
var UPDATE_I18N = "jsonforms/UPDATE_I18N";
var ADD_DEFAULT_DATA = "jsonforms/ADD_DEFAULT_DATA";
var REMOVE_DEFAULT_DATA = "jsonforms/REMOVE_DEFAULT_DATA";
var isUpdateArrayContext = (context) => {
	if (!("type" in context)) return false;
	if (typeof context.type !== "string") return false;
	switch (context.type) {
		case "ADD": return "values" in context && Array.isArray(context.values) && context.values.length > 0;
		case "REMOVE": return "indices" in context && Array.isArray(context.indices) && context.indices.length > 0 && context.indices.every((i) => typeof i === "number");
		case "MOVE": return "moves" in context && Array.isArray(context.moves) && context.moves.length > 0 && context.moves.every((m) => typeof m === "object" && m !== null && "from" in m && "to" in m && typeof m.from === "number" && typeof m.to === "number");
		default: return false;
	}
};
var init = (data, schema = generateJsonSchema(data), uischema, options) => ({
	type: INIT,
	data,
	schema,
	uischema: typeof uischema === "object" ? uischema : generateDefaultUISchema(schema),
	options
});
var updateCore = (data, schema, uischema, options) => ({
	type: UPDATE_CORE,
	data,
	schema,
	uischema,
	options
});
var registerDefaultData = (schemaPath, data) => ({
	type: ADD_DEFAULT_DATA,
	schemaPath,
	data
});
var unregisterDefaultData = (schemaPath) => ({
	type: REMOVE_DEFAULT_DATA,
	schemaPath
});
var setAjv = (ajv) => ({
	type: SET_AJV,
	ajv
});
var update = (path, updater, context) => ({
	type: UPDATE_DATA,
	path,
	updater,
	context
});
var updateErrors = (errors) => ({
	type: UPDATE_ERRORS,
	errors
});
var registerRenderer = (tester, renderer) => ({
	type: ADD_RENDERER,
	tester,
	renderer
});
var registerCell = (tester, cell) => ({
	type: ADD_CELL,
	tester,
	cell
});
var unregisterCell = (tester, cell) => ({
	type: REMOVE_CELL,
	tester,
	cell
});
var unregisterRenderer = (tester, renderer) => ({
	type: REMOVE_RENDERER,
	tester,
	renderer
});
var setConfig = (config) => ({
	type: SET_CONFIG,
	config
});
var setValidationMode = (validationMode) => ({
	type: SET_VALIDATION_MODE,
	validationMode
});
var registerUISchema = (tester, uischema) => {
	return {
		type: ADD_UI_SCHEMA,
		tester,
		uischema
	};
};
var unregisterUISchema = (tester) => {
	return {
		type: REMOVE_UI_SCHEMA,
		tester
	};
};
var setLocale = (locale) => ({
	type: SET_LOCALE,
	locale
});
var setSchema = (schema) => ({
	type: SET_SCHEMA,
	schema
});
var setTranslator = (translator, errorTranslator) => ({
	type: SET_TRANSLATOR,
	translator,
	errorTranslator
});
var updateI18n = (locale, translator, errorTranslator) => ({
	type: UPDATE_I18N,
	locale,
	translator,
	errorTranslator
});
var setUISchema = (uischema) => ({
	type: SET_UISCHEMA,
	uischema
});
var index$1 = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	INIT,
	UPDATE_CORE,
	SET_AJV,
	UPDATE_DATA,
	UPDATE_ERRORS,
	VALIDATE,
	ADD_RENDERER,
	REMOVE_RENDERER,
	ADD_CELL,
	REMOVE_CELL,
	SET_CONFIG,
	ADD_UI_SCHEMA,
	REMOVE_UI_SCHEMA,
	SET_SCHEMA,
	SET_UISCHEMA,
	SET_VALIDATION_MODE,
	SET_LOCALE,
	SET_TRANSLATOR,
	UPDATE_I18N,
	ADD_DEFAULT_DATA,
	REMOVE_DEFAULT_DATA,
	isUpdateArrayContext,
	init,
	updateCore,
	registerDefaultData,
	unregisterDefaultData,
	setAjv,
	update,
	updateErrors,
	registerRenderer,
	registerCell,
	unregisterCell,
	unregisterRenderer,
	setConfig,
	setValidationMode,
	registerUISchema,
	unregisterUISchema,
	setLocale,
	setSchema,
	setTranslator,
	updateI18n,
	setUISchema
});
var configDefault = {
	restrict: false,
	trim: false,
	showUnfocusedDescription: false,
	hideRequiredAsterisk: false,
	separateReadonlyFromDisabled: false
};
var applyDefaultConfiguration = (config = {}) => (0, import_merge.default)({}, configDefault, config);
var configReducer = (state = applyDefaultConfiguration(), action) => {
	switch (action.type) {
		case SET_CONFIG: return applyDefaultConfiguration(action.config);
		default: return state;
	}
};
var initState = {
	data: {},
	schema: {},
	uischema: void 0,
	errors: [],
	validator: void 0,
	ajv: void 0,
	validationMode: "ValidateAndShow",
	additionalErrors: []
};
var getValidationMode = (state, action) => {
	if (action && hasValidationModeOption(action.options)) return action.options.validationMode;
	return state.validationMode;
};
var hasValidationModeOption = (option) => {
	if (option) return option.validationMode !== void 0;
	return false;
};
var hasAdditionalErrorsOption = (option) => {
	if (option) return option.additionalErrors !== void 0;
	return false;
};
var getAdditionalErrors = (state, action) => {
	if (action && hasAdditionalErrorsOption(action.options)) return action.options.additionalErrors;
	return state.additionalErrors;
};
var getOrCreateAjv = (state, action) => {
	if (action) {
		if (hasAjvOption(action.options)) return action.options.ajv;
		else if (action.options !== void 0) {
			if ((0, import_isFunction.default)(action.options.compile)) return action.options;
		}
	}
	return state.ajv ? state.ajv : createAjv();
};
var hasAjvOption = (option) => {
	if (option) return option.ajv !== void 0;
	return false;
};
var coreReducer = (state = initState, action) => {
	switch (action.type) {
		case INIT: {
			const thisAjv = getOrCreateAjv(state, action);
			const validationMode = getValidationMode(state, action);
			const v = validationMode === "NoValidation" ? void 0 : thisAjv.compile(action.schema);
			const e = validate(v, action.data);
			const additionalErrors = getAdditionalErrors(state, action);
			return {
				...state,
				data: action.data,
				schema: action.schema,
				uischema: action.uischema,
				additionalErrors,
				errors: e,
				validator: v,
				ajv: thisAjv,
				validationMode
			};
		}
		case UPDATE_CORE: {
			const thisAjv = getOrCreateAjv(state, action);
			const validationMode = getValidationMode(state, action);
			let validator = state.validator;
			let errors = state.errors;
			if (state.schema !== action.schema || state.validationMode !== validationMode || state.ajv !== thisAjv) {
				validator = validationMode === "NoValidation" ? void 0 : thisAjv.compile(action.schema);
				errors = validate(validator, action.data);
			} else if (state.data !== action.data) errors = validate(validator, action.data);
			const additionalErrors = getAdditionalErrors(state, action);
			return state.data !== action.data || state.schema !== action.schema || state.uischema !== action.uischema || state.ajv !== thisAjv || state.errors !== errors || state.validator !== validator || state.validationMode !== validationMode || state.additionalErrors !== additionalErrors ? {
				...state,
				data: action.data,
				schema: action.schema,
				uischema: action.uischema,
				ajv: thisAjv,
				errors: (0, import_isEqual.default)(errors, state.errors) ? state.errors : errors,
				validator,
				validationMode,
				additionalErrors
			} : state;
		}
		case SET_AJV: {
			const currentAjv = action.ajv;
			const validator = state.validationMode === "NoValidation" ? void 0 : currentAjv.compile(state.schema);
			const errors = validate(validator, state.data);
			return {
				...state,
				validator,
				errors
			};
		}
		case SET_SCHEMA: {
			const v = action.schema && state.ajv && state.validationMode !== "NoValidation" ? state.ajv.compile(action.schema) : state.validator;
			const errors = validate(v, state.data);
			return {
				...state,
				validator: v,
				schema: action.schema,
				errors
			};
		}
		case SET_UISCHEMA: return {
			...state,
			uischema: action.uischema
		};
		case UPDATE_DATA: if (action.path === void 0 || action.path === null) return state;
		else if (action.path === "") {
			const result = action.updater((0, import_cloneDeep.default)(state.data));
			const errors = validate(state.validator, result);
			return {
				...state,
				data: result,
				errors
			};
		} else {
			const oldData = (0, import_get.default)(state.data, action.path);
			const newData = action.updater((0, import_cloneDeep.default)(oldData));
			let newState;
			if (newData !== void 0) newState = (0, import_set.default)(action.path, newData, state.data === void 0 ? {} : state.data);
			else newState = (0, import_unset.default)(action.path, state.data === void 0 ? {} : state.data);
			const errors = validate(state.validator, newState);
			return {
				...state,
				data: newState,
				errors
			};
		}
		case UPDATE_ERRORS: return {
			...state,
			errors: action.errors
		};
		case SET_VALIDATION_MODE:
			if (state.validationMode === action.validationMode) return state;
			if (action.validationMode === "NoValidation") {
				const errors = validate(void 0, state.data);
				return {
					...state,
					errors,
					validationMode: action.validationMode
				};
			}
			if (state.validationMode === "NoValidation") {
				const validator = state.ajv.compile(state.schema);
				const errors = validate(validator, state.data);
				return {
					...state,
					validator,
					errors,
					validationMode: action.validationMode
				};
			}
			return {
				...state,
				validationMode: action.validationMode
			};
		default: return state;
	}
};
var ArrayTranslationEnum;
(function(ArrayTranslationEnum) {
	ArrayTranslationEnum["addTooltip"] = "addTooltip";
	ArrayTranslationEnum["addAriaLabel"] = "addAriaLabel";
	ArrayTranslationEnum["removeTooltip"] = "removeTooltip";
	ArrayTranslationEnum["upAriaLabel"] = "upAriaLabel";
	ArrayTranslationEnum["downAriaLabel"] = "downAriaLabel";
	ArrayTranslationEnum["noSelection"] = "noSelection";
	ArrayTranslationEnum["removeAriaLabel"] = "removeAriaLabel";
	ArrayTranslationEnum["noDataMessage"] = "noDataMessage";
	ArrayTranslationEnum["deleteDialogTitle"] = "deleteDialogTitle";
	ArrayTranslationEnum["deleteDialogMessage"] = "deleteDialogMessage";
	ArrayTranslationEnum["deleteDialogAccept"] = "deleteDialogAccept";
	ArrayTranslationEnum["deleteDialogDecline"] = "deleteDialogDecline";
	ArrayTranslationEnum["up"] = "up";
	ArrayTranslationEnum["down"] = "down";
})(ArrayTranslationEnum || (ArrayTranslationEnum = {}));
var arrayDefaultTranslations = [
	{
		key: ArrayTranslationEnum.addTooltip,
		default: (input) => input ? `Add to ${input}` : "Add"
	},
	{
		key: ArrayTranslationEnum.addAriaLabel,
		default: (input) => input ? `Add to ${input} button` : "Add button"
	},
	{
		key: ArrayTranslationEnum.removeTooltip,
		default: () => "Delete"
	},
	{
		key: ArrayTranslationEnum.removeAriaLabel,
		default: () => "Delete button"
	},
	{
		key: ArrayTranslationEnum.upAriaLabel,
		default: () => `Move item up`
	},
	{
		key: ArrayTranslationEnum.up,
		default: () => "Up"
	},
	{
		key: ArrayTranslationEnum.down,
		default: () => "Down"
	},
	{
		key: ArrayTranslationEnum.downAriaLabel,
		default: () => `Move item down`
	},
	{
		key: ArrayTranslationEnum.noDataMessage,
		default: () => "No data"
	},
	{
		key: ArrayTranslationEnum.noSelection,
		default: () => "No selection"
	},
	{
		key: ArrayTranslationEnum.deleteDialogTitle,
		default: () => "Confirm Deletion"
	},
	{
		key: ArrayTranslationEnum.deleteDialogMessage,
		default: () => "Are you sure you want to delete the selected entry?"
	},
	{
		key: ArrayTranslationEnum.deleteDialogAccept,
		default: () => "Yes"
	},
	{
		key: ArrayTranslationEnum.deleteDialogDecline,
		default: () => "No"
	}
];
var CombinatorTranslationEnum;
(function(CombinatorTranslationEnum) {
	CombinatorTranslationEnum["clearDialogTitle"] = "clearDialogTitle";
	CombinatorTranslationEnum["clearDialogMessage"] = "clearDialogMessage";
	CombinatorTranslationEnum["clearDialogAccept"] = "clearDialogAccept";
	CombinatorTranslationEnum["clearDialogDecline"] = "clearDialogDecline";
})(CombinatorTranslationEnum || (CombinatorTranslationEnum = {}));
CombinatorTranslationEnum.clearDialogTitle, CombinatorTranslationEnum.clearDialogMessage, CombinatorTranslationEnum.clearDialogAccept, CombinatorTranslationEnum.clearDialogDecline;
var getI18nKeyPrefixBySchema = (schema, uischema) => {
	if (isInternationalized(uischema)) return uischema.i18n;
	return schema?.i18n ?? void 0;
};
var transformPathToI18nPrefix = (path) => {
	return path?.split(".").filter((segment) => !/^\d+$/.test(segment)).join(".") || "root";
};
var getI18nKeyPrefix = (schema, uischema, path) => {
	return getI18nKeyPrefixBySchema(schema, uischema) ?? transformPathToI18nPrefix(path);
};
var getI18nKey = (schema, uischema, path, key) => {
	return `${getI18nKeyPrefix(schema, uischema, path)}.${key}`;
};
var addI18nKeyToPrefix = (i18nKeyPrefix, key) => {
	return `${i18nKeyPrefix}.${key}`;
};
var createTranslator = (fn) => (id, defaultMessage, values) => {
	const translation = fn(id, defaultMessage, values);
	if (translation === void 0) return defaultMessage;
	return translation;
};
var defaultTranslator = createTranslator((_id, defaultMessage) => defaultMessage);
var defaultErrorTranslator = (error, t, uischema) => {
	const specializedKeywordMessage = t(getI18nKey(error.parentSchema, uischema, getControlPath(error), `error.${error.keyword}`), void 0, { error });
	if (specializedKeywordMessage !== void 0) return specializedKeywordMessage;
	const genericKeywordMessage = t(`error.${error.keyword}`, void 0, { error });
	if (genericKeywordMessage !== void 0) return genericKeywordMessage;
	const messageCustomization = t(error.message, void 0, { error });
	if (messageCustomization !== void 0) return messageCustomization;
	if (error.keyword === "required" && error.message?.startsWith("must have required property")) return t("is a required property", "is a required property", { error });
	return error.message;
};
var getCombinedErrorMessage = (errors, et, t, schema, uischema, path) => {
	if (errors.length > 0 && t) {
		const specializedErrorMessage = t(getI18nKey(schema, uischema, path, "error.custom"), void 0, {
			schema,
			uischema,
			path,
			errors
		});
		if (specializedErrorMessage !== void 0) return specializedErrorMessage;
	}
	return formatErrorMessage(errors.map((error) => et(error, t, uischema)));
};
var deriveLabelForUISchemaElement = (uischema, t) => {
	if (uischema.label === false) return;
	if ((uischema.label === void 0 || uischema.label === null || uischema.label === true) && !isInternationalized(uischema)) return;
	const stringifiedLabel = typeof uischema.label === "string" ? uischema.label : JSON.stringify(uischema.label);
	const i18nKeyPrefix = getI18nKeyPrefixBySchema(void 0, uischema);
	return t(typeof i18nKeyPrefix === "string" ? `${i18nKeyPrefix}.label` : stringifiedLabel, stringifiedLabel, { uischema });
};
var getArrayTranslations = (t, defaultTranslations, i18nKeyPrefix, label) => {
	const translations = {};
	defaultTranslations.forEach((controlElement) => {
		const key = addI18nKeyToPrefix(i18nKeyPrefix, controlElement.key);
		translations[controlElement.key] = t(key, controlElement.default(label));
	});
	return translations;
};
var fetchTranslator = (state) => {
	if (state === void 0) return defaultTranslator;
	return state.translate;
};
var fetchErrorTranslator = (state) => {
	if (state === void 0) return defaultErrorTranslator;
	return state.translateError;
};
var getTranslator = () => (state) => fetchTranslator((0, import_get.default)(state, "jsonforms.i18n"));
var getErrorTranslator = () => (state) => fetchErrorTranslator((0, import_get.default)(state, "jsonforms.i18n"));
var defaultJsonFormsI18nState = {
	locale: "en",
	translate: defaultTranslator,
	translateError: defaultErrorTranslator
};
var i18nReducer = (state = defaultJsonFormsI18nState, action) => {
	switch (action.type) {
		case UPDATE_I18N: {
			const locale = action.locale ?? defaultJsonFormsI18nState.locale;
			const translate = action.translator ?? defaultJsonFormsI18nState.translate;
			const translateError = action.errorTranslator ?? defaultJsonFormsI18nState.translateError;
			if (locale !== state.locale || translate !== state.translate || translateError !== state.translateError) return {
				...state,
				locale,
				translate,
				translateError
			};
			return state;
		}
		case SET_TRANSLATOR: return {
			...state,
			translate: action.translator ?? defaultTranslator,
			translateError: action.errorTranslator ?? defaultErrorTranslator
		};
		case SET_LOCALE: return {
			...state,
			locale: action.locale ?? navigator.languages[0]
		};
		default: return state;
	}
};
var isControl = (uischema) => !(0, import_isEmpty.default)(uischema) && uischema.scope !== void 0;
var schemaMatches = (predicate) => (uischema, schema, context) => {
	if ((0, import_isEmpty.default)(uischema) || !isControl(uischema)) return false;
	if ((0, import_isEmpty.default)(schema)) return false;
	const schemaPath = uischema.scope;
	if ((0, import_isEmpty.default)(schemaPath)) return false;
	let currentDataSchema = schema;
	if (hasType(schema, "object")) currentDataSchema = resolveSchema(schema, schemaPath, context?.rootSchema);
	if (currentDataSchema === void 0) return false;
	return predicate(currentDataSchema, context?.rootSchema);
};
var schemaSubPathMatches = (subPath, predicate) => (uischema, schema, context) => {
	if ((0, import_isEmpty.default)(uischema) || !isControl(uischema)) return false;
	const schemaPath = uischema.scope;
	let currentDataSchema = schema;
	if (hasType(schema, "object")) currentDataSchema = resolveSchema(schema, schemaPath, context?.rootSchema);
	currentDataSchema = (0, import_get.default)(currentDataSchema, subPath);
	if (currentDataSchema === void 0) return false;
	return predicate(currentDataSchema, context?.rootSchema);
};
var schemaTypeIs = (expectedType) => schemaMatches((schema) => !(0, import_isEmpty.default)(schema) && hasType(schema, expectedType));
var formatIs = (expectedFormat) => schemaMatches((schema) => !(0, import_isEmpty.default)(schema) && schema.format === expectedFormat && hasType(schema, "string"));
var uiTypeIs = (expected) => (uischema) => !(0, import_isEmpty.default)(uischema) && uischema.type === expected;
var optionIs = (optionName, optionValue) => (uischema) => {
	if ((0, import_isEmpty.default)(uischema)) return false;
	const options = uischema.options;
	return !(0, import_isEmpty.default)(options) && options[optionName] === optionValue;
};
var hasOption = (optionName) => (uischema) => {
	if ((0, import_isEmpty.default)(uischema)) return false;
	const options = uischema.options;
	return !(0, import_isEmpty.default)(options) && !(0, import_isUndefined.default)(options[optionName]);
};
var scopeEndsWith = (expected) => (uischema) => {
	if ((0, import_isEmpty.default)(expected) || !isControl(uischema)) return false;
	return (0, import_endsWith.default)(uischema.scope, expected);
};
var scopeEndIs = (expected) => (uischema) => {
	if ((0, import_isEmpty.default)(expected) || !isControl(uischema)) return false;
	const schemaPath = uischema.scope;
	return !(0, import_isEmpty.default)(schemaPath) && (0, import_last.default)(schemaPath.split("/")) === expected;
};
var and = (...testers) => (uischema, schema, context) => testers.reduce((acc, tester) => acc && tester(uischema, schema, context), true);
var or = (...testers) => (uischema, schema, context) => testers.reduce((acc, tester) => acc || tester(uischema, schema, context), false);
var rankWith = (rank, tester) => (uischema, schema, context) => {
	if (tester(uischema, schema, context)) return rank;
	return -1;
};
var withIncreasedRank = (by, rankedTester) => (uischema, schema, context) => {
	const rank = rankedTester(uischema, schema, context);
	if (rank === -1) return -1;
	return rank + by;
};
var isBooleanControl = and(uiTypeIs("Control"), schemaTypeIs("boolean"));
var isObjectControl = and(uiTypeIs("Control"), schemaTypeIs("object"));
var isAllOfControl = and(uiTypeIs("Control"), schemaMatches((schema) => Object.prototype.hasOwnProperty.call(schema, "allOf")));
var isAnyOfControl = and(uiTypeIs("Control"), schemaMatches((schema) => Object.prototype.hasOwnProperty.call(schema, "anyOf")));
var isOneOfControl = and(uiTypeIs("Control"), schemaMatches((schema) => Object.prototype.hasOwnProperty.call(schema, "oneOf")));
var isEnumControl = and(uiTypeIs("Control"), schemaMatches((schema) => isEnumSchema(schema)));
var isOneOfEnumControl = and(uiTypeIs("Control"), schemaMatches((schema) => isOneOfEnumSchema(schema)));
var isIntegerControl = and(uiTypeIs("Control"), schemaTypeIs("integer"));
var isNumberControl = and(uiTypeIs("Control"), schemaTypeIs("number"));
var isStringControl = and(uiTypeIs("Control"), schemaTypeIs("string"));
var isMultiLineControl = and(uiTypeIs("Control"), optionIs("multi", true));
var isDateControl = and(uiTypeIs("Control"), or(formatIs("date"), optionIs("format", "date")));
var isTimeControl = and(uiTypeIs("Control"), or(formatIs("time"), optionIs("format", "time")));
var isDateTimeControl = and(uiTypeIs("Control"), or(formatIs("date-time"), optionIs("format", "date-time")));
var isObjectArray = and(schemaMatches((schema, rootSchema) => hasType(schema, "array") && !Array.isArray(resolveSchema(schema, "items", rootSchema))), schemaSubPathMatches("items", (schema, rootSchema) => {
	return hasType(schema.$ref ? resolveSchema(rootSchema, schema.$ref, rootSchema) : schema, "object");
}));
var isObjectArrayControl = and(uiTypeIs("Control"), isObjectArray);
var traverse = (any, pred, rootSchema) => {
	if (Array.isArray(any)) return (0, import_reduce.default)(any, (acc, el) => acc || traverse(el, pred, rootSchema), false);
	if (pred(any)) return true;
	if (any.$ref) {
		const toTraverse = resolveSchema(rootSchema, any.$ref, rootSchema);
		if (toTraverse && !toTraverse.$ref) return traverse(toTraverse, pred, rootSchema);
	}
	if (any.items) return traverse(any.items, pred, rootSchema);
	if (any.properties) return (0, import_reduce.default)((0, import_toPairs.default)(any.properties), (acc, [_key, val]) => acc || traverse(val, pred, rootSchema), false);
	return false;
};
var isObjectArrayWithNesting = (uischema, schema, context) => {
	if (!uiTypeIs("Control")(uischema, schema, context)) return false;
	const schemaPath = uischema.scope;
	const resolvedSchema = resolveSchema(schema, schemaPath, context?.rootSchema ?? schema);
	let objectDepth = 0;
	if (resolvedSchema !== void 0 && resolvedSchema.items !== void 0) {
		if (traverse(resolvedSchema.items, (val) => {
			if (val === schema) return false;
			if (val.$ref !== void 0) return false;
			if (val.anyOf || val.allOf) return true;
			if (val.oneOf && !isOneOfEnumSchema(val)) return true;
			if (hasType(val, "object")) {
				objectDepth++;
				if (objectDepth === 2) return true;
			}
			if (hasType(val, "array")) return true;
			return false;
		}, context?.rootSchema)) return true;
		if (uischema.options && uischema.options.detail) {
			if (typeof uischema.options.detail === "string") return uischema.options.detail.toUpperCase() !== "DEFAULT";
			else if (typeof uischema.options.detail === "object" && uischema.options.detail.type) return true;
		}
	}
	return false;
};
var isArrayObjectControl = isObjectArrayControl;
var isPrimitiveArrayControl = and(uiTypeIs("Control"), schemaMatches((schema, rootSchema) => deriveTypes(schema).length !== 0 && !Array.isArray(resolveSchema(schema, "items", rootSchema))), schemaSubPathMatches("items", (schema, rootSchema) => {
	const types = deriveTypes(schema.$ref ? resolveSchema(rootSchema, schema.$ref, rootSchema) : schema);
	return types.length === 1 && (0, import_includes.default)([
		"integer",
		"number",
		"boolean",
		"string"
	], types[0]);
}));
var isRangeControl = and(uiTypeIs("Control"), or(schemaTypeIs("number"), schemaTypeIs("integer")), schemaMatches((schema) => Object.prototype.hasOwnProperty.call(schema, "maximum") && Object.prototype.hasOwnProperty.call(schema, "minimum") && Object.prototype.hasOwnProperty.call(schema, "default")), optionIs("slider", true));
var isNumberFormatControl = and(uiTypeIs("Control"), schemaTypeIs("integer"), optionIs("format", true));
var isCategorization = (category) => category.type === "Categorization";
var isCategory = (uischema) => uischema.type === "Category";
var hasCategory = (categorization) => {
	if ((0, import_isEmpty.default)(categorization.elements)) return false;
	return categorization.elements.map((elem) => isCategorization(elem) ? hasCategory(elem) : isCategory(elem)).reduce((prev, curr) => prev && curr, true);
};
var categorizationHasCategory = (uischema) => hasCategory(uischema);
var not = (tester) => (uischema, schema, context) => !tester(uischema, schema, context);
var index = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	NOT_APPLICABLE: -1,
	isControl,
	schemaMatches,
	schemaSubPathMatches,
	schemaTypeIs,
	formatIs,
	uiTypeIs,
	optionIs,
	hasOption,
	scopeEndsWith,
	scopeEndIs,
	and,
	or,
	rankWith,
	withIncreasedRank,
	isBooleanControl,
	isObjectControl,
	isAllOfControl,
	isAnyOfControl,
	isOneOfControl,
	isEnumControl,
	isOneOfEnumControl,
	isIntegerControl,
	isNumberControl,
	isStringControl,
	isMultiLineControl,
	isDateControl,
	isTimeControl,
	isDateTimeControl,
	isObjectArray,
	isObjectArrayControl,
	isObjectArrayWithNesting,
	isArrayObjectControl,
	isPrimitiveArrayControl,
	isRangeControl,
	isNumberFormatControl,
	isCategorization,
	isCategory,
	hasCategory,
	categorizationHasCategory,
	not
});
var findMatchingUISchema = (state) => (jsonSchema, schemaPath, path) => {
	const match = (0, import_maxBy.default)(state, (entry) => entry.tester(jsonSchema, schemaPath, path));
	if (match !== void 0 && match.tester(jsonSchema, schemaPath, path) !== -1) return match.uischema;
};
var findUISchema = (uischemas, schema, schemaPath, path, fallback = "VerticalLayout", control, rootSchema) => {
	if (control && control.options && control.options.detail) {
		if (typeof control.options.detail === "string") {
			if (control.options.detail.toUpperCase() === "GENERATE") {
				if (typeof fallback === "function") return fallback();
				return Generate.uiSchema(schema, fallback, void 0, rootSchema);
			}
		} else if (typeof control.options.detail === "object") {
			if (control.options.detail.type && typeof control.options.detail.type === "string") return control.options.detail;
		}
	}
	const uiSchema = findMatchingUISchema(uischemas)(schema, schemaPath, path);
	if (uiSchema === void 0) {
		if (typeof fallback === "function") return fallback();
		return Generate.uiSchema(schema, fallback, "#", rootSchema);
	}
	return uiSchema;
};
var defaultMiddleware = (state, action, defaultReducer) => defaultReducer(state, action);
var getErrorsAt = (instancePath, schema, matchPath) => (state) => {
	const errors = state.errors ?? [];
	const additionalErrors = state.additionalErrors ?? [];
	return errorsAt(instancePath, schema, matchPath)(state.validationMode === "ValidateAndHide" ? additionalErrors : [...errors, ...additionalErrors]);
};
var errorAt = (instancePath, schema) => getErrorsAt(instancePath, schema, (path) => path === instancePath);
var subErrorsAt = (instancePath, schema) => getErrorsAt(instancePath, schema, (path) => path.startsWith(instancePath + "."));
var getErrorAt = (instancePath, schema) => (state) => {
	return errorAt(instancePath, schema)(state.jsonforms.core);
};
var getSubErrorsAt = (instancePath, schema) => (state) => subErrorsAt(instancePath, schema)(state.jsonforms.core);
var getData = (state) => extractData((0, import_get.default)(state, "jsonforms.core"));
var getSchema = (state) => extractSchema((0, import_get.default)(state, "jsonforms.core"));
var getUiSchema = (state) => extractUiSchema((0, import_get.default)(state, "jsonforms.core"));
var getAjv = (state) => extractAjv((0, import_get.default)(state, "jsonforms.core"));
var getRenderers = (state) => (0, import_get.default)(state, "jsonforms.renderers");
var getCells = (state) => (0, import_get.default)(state, "jsonforms.cells");
var extractData = (state) => (0, import_get.default)(state, "data");
var extractSchema = (state) => (0, import_get.default)(state, "schema");
var extractUiSchema = (state) => (0, import_get.default)(state, "uischema");
var extractAjv = (state) => (0, import_get.default)(state, "ajv");
var getConfig = (state) => state.jsonforms.config;
var isInherentlyEnabled = (state, ownProps, uischema, schema, rootData, config) => {
	if (!config?.separateReadonlyFromDisabled && state?.jsonforms?.readonly) return false;
	if (uischema && hasEnableRule(uischema)) return isEnabled(uischema, rootData, ownProps?.path, getAjv(state), config);
	if (!config?.separateReadonlyFromDisabled) {
		if (typeof uischema?.options?.readonly === "boolean") return !uischema.options.readonly;
		if (typeof uischema?.options?.readOnly === "boolean") return !uischema.options.readOnly;
		if (typeof config?.readonly === "boolean") return !config.readonly;
		if (typeof config?.readOnly === "boolean") return !config.readOnly;
		if (schema?.readOnly === true) return false;
	}
	if (typeof ownProps?.enabled === "boolean") return ownProps.enabled;
	return true;
};
var isInherentlyReadonly = (state, ownProps, uischema, schema, rootData, config) => {
	if (state?.jsonforms?.readonly) return true;
	if (uischema && hasReadonlyRule(uischema)) return isReadonly(uischema, rootData, ownProps?.path, getAjv(state), config);
	if (typeof uischema?.options?.readonly === "boolean") return uischema.options.readonly;
	if (typeof uischema?.options?.readOnly === "boolean") return uischema.options.readOnly;
	if (typeof config?.readonly === "boolean") return config.readonly;
	if (typeof config?.readOnly === "boolean") return config.readOnly;
	if (schema?.readOnly === true) return true;
	if (typeof ownProps?.readonly === "boolean") return ownProps.readonly;
	return false;
};
var move = (array, index, delta) => {
	const newIndex = index + delta;
	if (newIndex < 0 || newIndex >= array.length) return;
	const indexes = [index, newIndex].sort((a, b) => a - b);
	array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
};
var moveUp = (array, toMove) => {
	move(array, toMove, -1);
};
var moveDown = (array, toMove) => {
	move(array, toMove, 1);
};
var isRequired = (schema, schemaPath, rootSchema) => {
	const pathSegments = schemaPath.split("/");
	const lastSegment = decode(pathSegments[pathSegments.length - 1]);
	const nextHigherSchemaPath = pathSegments.slice(0, pathSegments.length - 2).join("/");
	const nextHigherSchema = Resolve.schema(schema, nextHigherSchemaPath, rootSchema);
	return nextHigherSchema !== void 0 && nextHigherSchema.required !== void 0 && nextHigherSchema.required.indexOf(lastSegment) !== -1;
};
var computeLabel = (label, required, hideRequiredAsterisk) => {
	return `${label ?? ""}${required && !hideRequiredAsterisk ? "*" : ""}`;
};
var createDefaultValue = (schema, rootSchema) => {
	const defaultValue = doCreateDefaultValue(schema, rootSchema);
	return defaultValue === void 0 ? {} : defaultValue;
};
var doCreateDefaultValue = (schema, rootSchema) => {
	const resolvedSchema = typeof schema.$ref === "string" ? Resolve.schema(rootSchema, schema.$ref, rootSchema) : schema;
	if (resolvedSchema.default !== void 0) return extractDefaults(resolvedSchema, rootSchema);
	if (hasType(resolvedSchema, "string")) {
		if (resolvedSchema.format === "date-time" || resolvedSchema.format === "date" || resolvedSchema.format === "time") return convertDateToString(/* @__PURE__ */ new Date(), resolvedSchema.format);
		return "";
	}
	if (hasType(resolvedSchema, "integer") || hasType(resolvedSchema, "number")) return 0;
	if (hasType(resolvedSchema, "boolean")) return false;
	if (hasType(resolvedSchema, "array")) return [];
	if (hasType(resolvedSchema, "object")) return extractDefaults(resolvedSchema, rootSchema);
	if (hasType(resolvedSchema, "null")) return null;
	for (const combinator of [
		"oneOf",
		"anyOf",
		"allOf"
	]) if (schema[combinator] && Array.isArray(schema[combinator])) {
		const combinatorDefault = createDefaultValueForCombinatorSchema(schema[combinator], rootSchema);
		if (combinatorDefault !== void 0) return combinatorDefault;
	}
};
var createDefaultValueForCombinatorSchema = (combinatorSchemas, rootSchema) => {
	if (combinatorSchemas.length > 0) for (const combinatorSchema of combinatorSchemas) {
		const result = doCreateDefaultValue(combinatorSchema, rootSchema);
		if (result !== void 0) return result;
	}
};
var extractDefaults = (schema, rootSchema) => {
	if (hasType(schema, "object") && schema.default === void 0) {
		const result = {};
		for (const key in schema.properties) {
			const property = schema.properties[key];
			const resolvedProperty = property.$ref ? Resolve.schema(rootSchema, property.$ref, rootSchema) : property;
			if (resolvedProperty && resolvedProperty.default !== void 0) result[key] = (0, import_cloneDeep.default)(resolvedProperty.default);
		}
		if (schema.allOf && Array.isArray(schema.allOf)) schema.allOf.forEach((allOfSchema) => {
			if (allOfSchema && allOfSchema.properties) for (const key in allOfSchema.properties) {
				const property = allOfSchema.properties[key];
				const resolvedProperty = property.$ref ? Resolve.schema(rootSchema, property.$ref, rootSchema) : property;
				if (resolvedProperty && resolvedProperty.default !== void 0) result[key] = (0, import_cloneDeep.default)(resolvedProperty.default);
			}
		});
		return result;
	}
	return (0, import_cloneDeep.default)(schema.default);
};
var isDescriptionHidden = (visible, description, isFocused, showUnfocusedDescription) => {
	return description === void 0 || description !== void 0 && !visible || !showUnfocusedDescription && !isFocused;
};
var enumToEnumOptionMapper = (e, t, i18nKey) => {
	let label = typeof e === "string" ? e : JSON.stringify(e);
	if (t) if (i18nKey) label = t(`${i18nKey}.${label}`, label);
	else label = t(label, label);
	return {
		label,
		value: e
	};
};
var oneOfToEnumOptionMapper = (e, t, fallbackI18nKey) => {
	let label = e.title ?? (typeof e.const === "string" ? e.const : JSON.stringify(e.const));
	if (t) if (e.i18n) label = t(e.i18n, label, { schema: e });
	else if (fallbackI18nKey) label = t(`${fallbackI18nKey}.${label}`, label, { schema: e });
	else label = t(label, label, { schema: e });
	return {
		label,
		value: e.const
	};
};
var mapStateToControlProps = (state, ownProps) => {
	const { uischema } = ownProps;
	const rootData = getData(state);
	const path = composeWithUi(uischema, ownProps.path);
	const config = getConfig(state);
	const visible = ownProps.visible === void 0 || hasShowRule(uischema) ? isVisible(uischema, rootData, ownProps.path, getAjv(state), config) : ownProps.visible;
	const controlElement = uischema;
	const id = ownProps.id;
	const rootSchema = getSchema(state);
	const required = controlElement.scope !== void 0 && isRequired(ownProps.schema, controlElement.scope, rootSchema);
	const resolvedSchema = Resolve.schema(ownProps.schema || rootSchema, controlElement.scope, rootSchema);
	const errors = getErrorAt(path, resolvedSchema)(state);
	const description = resolvedSchema !== void 0 ? resolvedSchema.description : "";
	const data = Resolve.data(rootData, path);
	const labelDesc = createLabelDescriptionFrom(uischema, resolvedSchema);
	const label = labelDesc.show ? labelDesc.text : "";
	const enabled = isInherentlyEnabled(state, ownProps, uischema, resolvedSchema || rootSchema, rootData, config);
	const readonly = isInherentlyReadonly(state, ownProps, uischema, resolvedSchema || rootSchema, rootData, config);
	const schema = resolvedSchema ?? rootSchema;
	const t = getTranslator()(state);
	const te = getErrorTranslator()(state);
	const i18nKeyPrefix = getI18nKeyPrefix(schema, uischema, path);
	const i18nLabel = t(getI18nKey(schema, uischema, path, "label"), label, {
		schema,
		uischema,
		path,
		errors
	});
	return {
		data,
		description: t(getI18nKey(schema, uischema, path, "description"), description, {
			schema,
			uischema,
			path,
			errors
		}),
		errors: getCombinedErrorMessage(errors, te, t, schema, uischema, path),
		label: i18nLabel,
		visible,
		enabled,
		readonly,
		id,
		path,
		required,
		uischema,
		schema,
		config: getConfig(state),
		cells: ownProps.cells || state.jsonforms.cells,
		rootSchema,
		i18nKeyPrefix
	};
};
var mapDispatchToControlProps = (dispatch) => ({ handleChange(path, value) {
	dispatch(update(path, () => value));
} });
var mapStateToEnumControlProps = (state, ownProps) => {
	const props = mapStateToControlProps(state, ownProps);
	const options = ownProps.options || props.schema.enum?.map((e) => enumToEnumOptionMapper(e, getTranslator()(state), getI18nKeyPrefix(props.schema, props.uischema, props.path))) || props.schema.const && [enumToEnumOptionMapper(props.schema.const, getTranslator()(state), getI18nKeyPrefix(props.schema, props.uischema, props.path))];
	return {
		...props,
		options
	};
};
var mapStateToOneOfEnumControlProps = (state, ownProps) => {
	const props = mapStateToControlProps(state, ownProps);
	const options = ownProps.options || props.schema.oneOf?.map((oneOfSubSchema) => oneOfToEnumOptionMapper(oneOfSubSchema, getTranslator()(state), getI18nKeyPrefix(props.schema, props.uischema, props.path)));
	return {
		...props,
		options
	};
};
var mapStateToControlWithDetailProps = (state, ownProps) => {
	const { ...props } = mapStateToControlProps(state, ownProps);
	return {
		...props,
		uischemas: state.jsonforms.uischemas
	};
};
var mapStateToArrayControlProps = (state, ownProps) => {
	const { path, schema, uischema, label, ...props } = mapStateToControlWithDetailProps(state, ownProps);
	const resolvedSchema = Resolve.schema(schema, "items", props.rootSchema);
	const childErrors = getSubErrorsAt(path, resolvedSchema)(state);
	return {
		...props,
		label,
		path,
		uischema,
		schema: resolvedSchema,
		arraySchema: schema,
		childErrors,
		renderers: ownProps.renderers || getRenderers(state),
		cells: ownProps.cells || getCells(state)
	};
};
var mapDispatchToArrayControlProps = (dispatch) => ({
	addItem: (path, value) => () => {
		dispatch(update(path, (array) => {
			if (array === void 0 || array === null) return [value];
			array.push(value);
			return array;
		}, {
			type: "ADD",
			values: [value]
		}));
	},
	removeItems: (path, toDelete) => () => {
		dispatch(update(path, (array) => {
			toDelete.sort((a, b) => a - b).reverse().forEach((s) => array.splice(s, 1));
			return array;
		}, {
			type: "REMOVE",
			indices: toDelete
		}));
	},
	moveUp: (path, toMove) => () => {
		dispatch(update(path, (array) => {
			moveUp(array, toMove);
			return array;
		}, {
			type: "MOVE",
			moves: [{
				from: toMove,
				to: toMove - 1
			}]
		}));
	},
	moveDown: (path, toMove) => () => {
		dispatch(update(path, (array) => {
			moveDown(array, toMove);
			return array;
		}, {
			type: "MOVE",
			moves: [{
				from: toMove,
				to: toMove + 1
			}]
		}));
	}
});
var layoutDefaultProps = {
	visible: true,
	enabled: true,
	path: "",
	direction: "column"
};
var getDirection = (uischema) => {
	if (uischema.type === "HorizontalLayout") return "row";
	if (uischema.type === "VerticalLayout") return "column";
	return layoutDefaultProps.direction;
};
var mapStateToLayoutProps = (state, ownProps) => {
	const rootData = getData(state);
	const { uischema } = ownProps;
	const visible = ownProps.visible === void 0 || hasShowRule(uischema) ? isVisible(ownProps.uischema, rootData, ownProps.path, getAjv(state), getConfig(state)) : ownProps.visible;
	const data = Resolve.data(rootData, ownProps.path);
	const config = getConfig(state);
	const enabled = isInherentlyEnabled(state, ownProps, uischema, void 0, rootData, config);
	const readonly = isInherentlyReadonly(state, ownProps, uischema, void 0, rootData, config);
	const t = getTranslator()(state);
	const label = isLabelable(uischema) ? deriveLabelForUISchemaElement(uischema, t) : void 0;
	return {
		...layoutDefaultProps,
		renderers: ownProps.renderers || getRenderers(state),
		cells: ownProps.cells || getCells(state),
		visible,
		enabled,
		readonly,
		path: ownProps.path,
		data,
		uischema: ownProps.uischema,
		schema: ownProps.schema,
		direction: ownProps.direction ?? getDirection(uischema),
		config,
		label
	};
};
var mapStateToJsonFormsRendererProps = (state, ownProps) => {
	return {
		renderers: ownProps.renderers || (0, import_get.default)(state.jsonforms, "renderers"),
		cells: ownProps.cells || (0, import_get.default)(state.jsonforms, "cells"),
		schema: ownProps.schema || getSchema(state),
		rootSchema: getSchema(state),
		uischema: ownProps.uischema || getUiSchema(state),
		path: ownProps.path,
		enabled: ownProps.enabled,
		config: getConfig(state)
	};
};
({ ...layoutDefaultProps });
var mapStateToLabelProps = (state, props) => {
	const { uischema } = props;
	const visible = props.visible === void 0 || hasShowRule(uischema) ? isVisible(props.uischema, getData(state), props.path, getAjv(state), getConfig(state)) : props.visible;
	const text = uischema.text;
	const t = getTranslator()(state);
	const i18nKeyPrefix = getI18nKeyPrefixBySchema(void 0, uischema);
	return {
		text: t(i18nKeyPrefix ? `${i18nKeyPrefix}.text` : text ?? "", text, { uischema }),
		visible,
		config: getConfig(state),
		renderers: props.renderers || getRenderers(state),
		cells: props.cells || getCells(state),
		uischema
	};
};
var mapStateToCellProps = (state, ownProps) => {
	const { id, schema, path, uischema, renderers, cells } = ownProps;
	const rootData = getData(state);
	const config = getConfig(state);
	const visible = ownProps.visible !== void 0 ? ownProps.visible : isVisible(uischema, rootData, void 0, getAjv(state), config);
	const rootSchema = getSchema(state);
	let enabled;
	if (!config?.separateReadonlyFromDisabled && state.jsonforms.readonly === true) enabled = false;
	else if (typeof ownProps.enabled === "boolean") enabled = ownProps.enabled;
	else enabled = isInherentlyEnabled(state, ownProps, uischema, schema || rootSchema, rootData, config);
	let readonly;
	if (typeof ownProps.readonly === "boolean") readonly = ownProps.readonly;
	else readonly = isInherentlyReadonly(state, ownProps, uischema, schema || rootSchema, rootData, config);
	const t = getTranslator()(state);
	const te = getErrorTranslator()(state);
	const errors = getCombinedErrorMessage(getErrorAt(path, schema)(state), te, t, schema, uischema, path);
	const isValid = (0, import_isEmpty.default)(errors);
	return {
		data: Resolve.data(rootData, path),
		visible,
		enabled,
		readonly,
		id,
		path,
		errors,
		isValid,
		schema,
		uischema,
		config: getConfig(state),
		rootSchema,
		renderers,
		cells
	};
};
var mapStateToDispatchCellProps = (state, ownProps) => {
	const props = mapStateToCellProps(state, ownProps);
	const { renderers: _renderers, cells, ...otherOwnProps } = ownProps;
	return {
		...props,
		...otherOwnProps,
		cells: cells || state.jsonforms.cells || []
	};
};
var defaultMapStateToEnumCellProps = (state, ownProps) => {
	const props = mapStateToCellProps(state, ownProps);
	const options = ownProps.options || props.schema.enum?.map((e) => enumToEnumOptionMapper(e, getTranslator()(state), getI18nKeyPrefix(props.schema, props.uischema, props.path))) || props.schema.const && [enumToEnumOptionMapper(props.schema.const, getTranslator()(state), getI18nKeyPrefix(props.schema, props.uischema, props.path))];
	return {
		...props,
		options
	};
};
var mapStateToOneOfEnumCellProps = (state, ownProps) => {
	const props = mapStateToCellProps(state, ownProps);
	const options = ownProps.options || props.schema.oneOf?.map((oneOfSubSchema) => oneOfToEnumOptionMapper(oneOfSubSchema, getTranslator()(state), getI18nKeyPrefix(props.schema, props.uischema, props.path)));
	return {
		...props,
		options
	};
};
//#endregion
export { mapStateToOneOfEnumControlProps as $, isDescriptionHidden as A, isTimeControl as B, i18nReducer as C, require_isArrayLike as Ct, isControl as D, isBooleanControl as E, require__root as Et, isNumberFormatControl as F, mapStateToCellProps as G, mapDispatchToArrayControlProps as H, isObjectArrayWithNesting as I, mapStateToEnumControlProps as J, mapStateToControlProps as K, isOneOfEnumControl as L, isIntegerControl as M, isMultiLineControl as N, isDateControl as O, isNumberControl as P, mapStateToOneOfEnumCellProps as Q, isRangeControl as R, getControlPath as S, require_keys as St, index$1 as T, require_isObject as Tt, mapDispatchToControlProps as U, isVisible as V, mapStateToArrayControlProps as W, mapStateToLabelProps as X, mapStateToJsonFormsRendererProps as Y, mapStateToLayoutProps as Z, deriveLabelForUISchemaElement as _, require_startCase as _t, Resolve as a, require_convert as at, getAjv as b, require__baseIteratee as bt, compose as c, require__LodashWrapper as ct, convertToValidClassName as d, require_placeholder as dt, optionIs as et, coreReducer as f, require_merge as ft, defaultMiddleware as g, require_toNumber as gt, defaultMapStateToEnumCellProps as h, require_range as ht, Paths as i, require_remove as it, isEnumControl as j, isDateTimeControl as k, computeLabel as l, require__getFuncName as lt, defaultJsonFormsI18nState as m, require__baseEach as mt, Helpers as n, uiTypeIs as nt, and as o, require__flatRest as ot, createDefaultValue as p, require_filter as pt, mapStateToDispatchCellProps as q, Id as r, require_reduce as rt, arrayDefaultTranslations as s, require__isLaziable as st, Generate as t, rankWith as tt, configReducer as u, require__getData as ut, encode as v, require_isEmpty as vt, index as w, require_isArray as wt, getArrayTranslations as x, require__arrayMap as xt, findUISchema as y, require_maxBy as yt, isStringControl as z };
