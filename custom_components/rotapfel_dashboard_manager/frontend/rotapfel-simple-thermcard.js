/*!
# Third-party notices

This file includes React and ReactDOM, both Copyright (c) Meta Platforms, Inc.
and affiliates, under the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// \0rolldown/runtime.js
var e = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), t = "rotapfel_thermcard_perf", n = "rotapfel-thermcard:perf", r = 2e3, i, a = () => typeof performance > "u" ? 0 : performance.now();
function o() {
	if (i !== void 0 || (i = !1, typeof window > "u")) return i;
	try {
		i = new URLSearchParams(window.location.search).get(t) === "1" || window.localStorage.getItem(n) === "1";
	} catch {}
	return i && l(), i;
}
function s(e, t) {
	if (!o()) return;
	let n = window.__rotapfelThermCardPerf;
	if (!n || n.marks.length >= r) return;
	let i = {
		name: e,
		at: a()
	};
	if (t) {
		let e = Object.fromEntries(Object.entries(t).filter(([, e]) => e !== void 0));
		Object.keys(e).length && (i.detail = e);
	}
	n.marks.push(i);
	try {
		performance.mark(`rotapfel-thermcard:${e}`);
	} catch {}
}
function c(e, t) {
	o() && (typeof requestAnimationFrame == "function" ? requestAnimationFrame(() => requestAnimationFrame(() => s(e, t))) : s(e, t));
}
function l() {
	window.__rotapfelThermCardPerf || (window.__rotapfelThermCardPerf = {
		version: 1,
		enabled: !0,
		startedAt: a(),
		marks: []
	}), window.addEventListener("pointerdown", (e) => {
		let t = e.target instanceof Element ? e.target.closest("button, [role='button'], a") : null;
		s("input:pointerdown", {
			label: t?.getAttribute("aria-label") ?? t?.textContent?.trim().slice(0, 80) ?? void 0,
			tag: (t ?? (e.target instanceof Element ? e.target : null))?.tagName.toLowerCase()
		});
	}, {
		capture: !0,
		passive: !0
	});
}
// node_modules/scheduler/cjs/scheduler.production.js
/**
* @license React
* scheduler.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var u = /* @__PURE__ */ e(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && j(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && j(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), d = /* @__PURE__ */ e(((e, t) => {
	t.exports = u();
})), f = /* @__PURE__ */ e(((e) => {
	/**
	* @license React
	* react.production.js
	*
	* Copyright (c) Meta Platforms, Inc. and affiliates.
	*
	* This source code is licensed under the MIT license found in the
	* LICENSE file in the root directory of this source tree.
	*/
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function A(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var j = /\/+/g;
	function M(e, t) {
		return typeof e == "object" && e && e.key != null ? A("" + e.key) : t.toString(36);
	}
	function N(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function P(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, P(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + M(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(j, "$&/") + "/"), P(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(j, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + M(a, u), c += P(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + M(a, u++), c += P(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return P(N(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function F(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return P(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ee(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var te = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function ne(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, te);
		} catch (e) {
			te(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function re(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ne(re.bind(null, e));
	}
	var ie = {
		map: F,
		forEach: function(e, t, n) {
			F(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return F(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return F(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ie, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = re, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ee
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ne, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), p = /* @__PURE__ */ e(((e, t) => {
	t.exports = f();
})), m = /* @__PURE__ */ e(((e) => {
	/**
	* @license React
	* react-dom.production.js
	*
	* Copyright (c) Meta Platforms, Inc. and affiliates.
	*
	* This source code is licensed under the MIT license found in the
	* LICENSE file in the root directory of this source tree.
	*/
	var t = p();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function u(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = u(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = u(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = u(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), h = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = m();
})), g = /* @__PURE__ */ e(((e) => {
	/**
	* @license React
	* react-dom-client.production.js
	*
	* Copyright (c) Meta Platforms, Inc. and affiliates.
	*
	* This source code is licensed under the MIT license found in the
	* LICENSE file in the root directory of this source tree.
	*/
	var t = d(), n = p(), r = h();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function u(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function f(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = f(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function m(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && m(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function E(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), F = Symbol.for("react.context"), ee = Symbol.for("react.forward_ref"), te = Symbol.for("react.suspense"), ne = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), ae = Symbol.for("react.activity"), I = Symbol.for("react.legacy_hidden"), L = Symbol.for("react.memo_cache_sentinel"), oe = Symbol.for("react.view_transition"), se = Symbol.for("react.recoverable"), ce = Symbol.iterator;
	function le(e) {
		return typeof e != "object" || !e ? null : (e = ce && e[ce] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ue = Symbol.for("react.client.reference");
	function de(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ue ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case j: return "Fragment";
			case N: return "Profiler";
			case M: return "StrictMode";
			case te: return "Suspense";
			case ne: return "SuspenseList";
			case ae: return "Activity";
			case oe: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case A: return "Portal";
			case F: return e.displayName || "Context";
			case P: return (e._context.displayName || "Context") + ".Consumer";
			case ee:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? de(e.type) || "Memo" : t;
			case ie:
				t = e._payload, e = e._init;
				try {
					return de(e(t));
				} catch {}
		}
		return null;
	}
	var fe = Array.isArray, R = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, z = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, pe = [], me = -1;
	function he(e) {
		return { current: e };
	}
	function ge(e) {
		0 > me || (e.current = pe[me], pe[me] = null, me--);
	}
	function V(e, t) {
		me++, pe[me] = e.current, e.current = t;
	}
	var H = he(null), _e = he(null), ve = he(null), ye = he(null);
	function be(e, t) {
		switch (V(ve, t), V(_e, e), V(H, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		ge(H), V(H, e);
	}
	function xe() {
		ge(H), ge(_e), ge(ve);
	}
	function Se(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, V(ye, e)), t = H.current;
		var n = dp(t, e.type);
		t !== n && (V(_e, e), V(H, n));
	}
	function Ce(e) {
		_e.current === e && (ge(H), ge(_e)), ye.current === e && (ge(ye), sh._currentValue = B);
	}
	var we, Te;
	function U(e) {
		if (we === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			we = t && t[1] || "", Te = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + we + e + Te;
	}
	var Ee = !1;
	function De(e, t) {
		if (!e || Ee) return "";
		Ee = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Ee = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? U(n) : "";
	}
	function Oe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return U(e.type);
			case 16: return U("Lazy");
			case 13: return e.child !== t && t !== null ? U("Suspense Fallback") : U("Suspense");
			case 19: return U("SuspenseList");
			case 0:
			case 15: return De(e.type, !1);
			case 11: return De(e.type.render, !1);
			case 1: return De(e.type, !0);
			case 31: return U("Activity");
			case 30: return U("ViewTransition");
			default: return "";
		}
	}
	function ke(e) {
		try {
			var t = "", n = null;
			do
				t += Oe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ae = Object.prototype.hasOwnProperty, je = t.unstable_scheduleCallback, Me = t.unstable_cancelCallback, Ne = t.unstable_shouldYield, Pe = t.unstable_requestPaint, Fe = t.unstable_now, Ie = t.unstable_getCurrentPriorityLevel, Le = t.unstable_ImmediatePriority, Re = t.unstable_UserBlockingPriority, ze = t.unstable_NormalPriority, Be = t.unstable_LowPriority, Ve = t.unstable_IdlePriority, He = t.log, Ue = t.unstable_setDisableYieldValue, We = null, Ge = null;
	function Ke(e) {
		if (typeof He == "function" && Ue(e), Ge && typeof Ge.setStrictMode == "function") try {
			Ge.setStrictMode(We, e);
		} catch {}
	}
	var qe = Math.clz32 ? Math.clz32 : Xe, Je = Math.log, Ye = Math.LN2;
	function Xe(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Je(e) / Ye | 0) | 0;
	}
	var Ze = 256, Qe = 262144, $e = 4194304;
	function et(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function tt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = et(n))) : i = et(o) : i = et(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = et(n))) : i = et(o)) : i = et(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function nt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function rt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - qe(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function it(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function at() {
		var e = $e;
		return $e <<= 1, !($e & 62914560) && ($e = 4194304), e;
	}
	function ot(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function st(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function ct(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - qe(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && lt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function lt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - qe(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function ut(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - qe(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function dt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : ft(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function ft(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function pt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function mt() {
		var e = z.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function ht(e, t) {
		var n = z.p;
		try {
			return z.p = e, t();
		} finally {
			z.p = n;
		}
	}
	var gt = Math.random().toString(36).slice(2), _t = "__reactFiber$" + gt, vt = "__reactProps$" + gt, yt = "__reactContainer$" + gt, bt = "__reactEvents$" + gt, xt = "__reactListeners$" + gt, St = "__reactHandles$" + gt, Ct = "__reactResources$" + gt, wt = "__reactMarker$" + gt, Tt = "__reactLoad$" + gt;
	function Et(e) {
		delete e[_t], delete e[vt], delete e[xt], delete e[St];
	}
	function Dt(e) {
		var t;
		if (t = e[_t]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[yt] || n[_t]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[_t]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Ot(e) {
		if (e = e[_t] || e[yt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function kt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function At(e) {
		var t = e[Ct];
		return t ||= e[Ct] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function jt(e) {
		e[wt] = !0;
	}
	function Mt(e) {
		e[Tt] = void 0;
	}
	var Nt = /* @__PURE__ */ new Set(), Pt = {};
	function Ft(e, t) {
		It(e, t), It(e + "Capture", t);
	}
	function It(e, t) {
		for (Pt[e] = t, e = 0; e < t.length; e++) Nt.add(t[e]);
	}
	var Lt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Rt = {}, zt = {};
	function Bt(e) {
		return Ae.call(zt, e) ? !0 : Ae.call(Rt, e) ? !1 : Lt.test(e) ? zt[e] = !0 : (Rt[e] = !0, !1);
	}
	var W = !1;
	function Vt() {
		var e = W;
		return W = !1, e;
	}
	function Ht(e, t, n) {
		if (Bt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Ut(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Wt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Gt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Kt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function qt(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Jt(e) {
		if (!e._valueTracker) {
			var t = Kt(e) ? "checked" : "value";
			e._valueTracker = qt(e, t, "" + e[t]);
		}
	}
	function Yt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Kt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var Xt = /[\n"\\]/g;
	function Zt(e) {
		return e.replace(Xt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Qt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Gt(t)) : e.value !== "" + Gt(t) && (e.value = "" + Gt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : en(e, Gt(n)) : o === "number" && e.value == t ? en(e, Gt(e.value)) : en(e, Gt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Gt(s) : e.removeAttribute("name");
	}
	function $t(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Jt(e);
				return;
			}
			n = n == null ? "" : "" + Gt(n), t = t == null ? n : "" + Gt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Jt(e);
	}
	function en(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function tn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Gt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function nn(e, t, n) {
		t != null && (t = "" + Gt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Gt(n);
	}
	function rn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (fe(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Gt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Jt(e);
	}
	function an(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var on = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function sn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || on.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function cn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", W = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (sn(e, a, r), W = !0);
		} else for (var o in t) t.hasOwnProperty(o) && sn(e, o, t[o]);
	}
	function ln(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var un = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), dn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function fn(e) {
		return dn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function pn() {}
	var mn = null;
	function hn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var gn = null, _n = null;
	function vn(e) {
		var t = Ot(e);
		if (t && (e = t.stateNode)) {
			var n = e[vt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Qt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Zt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[vt] || null;
								if (!a) throw Error(i(90));
								Qt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Yt(r);
					}
					break a;
				case "textarea":
					nn(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && tn(e, !!n.multiple, t, !1);
			}
		}
	}
	var yn = !1;
	function bn(e, t, n) {
		if (yn) return e(t, n);
		yn = !0;
		try {
			return e(t);
		} finally {
			if (yn = !1, (gn !== null || _n !== null) && (Ld(), gn && (t = gn, e = _n, _n = gn = null, vn(t), e))) for (t = 0; t < e.length; t++) vn(e[t]);
		}
	}
	function xn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[vt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var Sn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Cn = !1;
	if (Sn) try {
		var wn = {};
		Object.defineProperty(wn, "passive", { get: function() {
			Cn = !0;
		} }), window.addEventListener("test", wn, wn), window.removeEventListener("test", wn, wn);
	} catch {
		Cn = !1;
	}
	var Tn = null, En = null, Dn = null;
	function On() {
		if (Dn) return Dn;
		var e, t = En, n = t.length, r, i = "value" in Tn ? Tn.value : Tn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Dn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function kn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function An() {
		return !0;
	}
	function jn() {
		return !1;
	}
	function Mn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? An : jn, this.isPropagationStopped = jn, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = An);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = An);
			},
			persist: function() {},
			isPersistent: An
		}), t;
	}
	var Nn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Pn = Mn(Nn), Fn = D({}, Nn, {
		view: 0,
		detail: 0
	}), In = Mn(Fn), Ln, Rn, zn, Bn = D({}, Fn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: Zn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== zn && (zn && e.type === "mousemove" ? (Ln = e.screenX - zn.screenX, Rn = e.screenY - zn.screenY) : Rn = Ln = 0, zn = e), Ln);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Rn;
		}
	}), Vn = Mn(Bn), Hn = Mn(D({}, Bn, { dataTransfer: 0 })), Un = Mn(D({}, Fn, { relatedTarget: 0 })), Wn = Mn(D({}, Nn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Gn = Mn(D({}, Nn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Kn = Mn(D({}, Nn, { data: 0 })), qn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Jn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Yn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Xn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Yn[e]) ? !!t[e] : !1;
	}
	function Zn() {
		return Xn;
	}
	var Qn = Mn(D({}, Fn, {
		key: function(e) {
			if (e.key) {
				var t = qn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = kn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Jn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Zn,
		charCode: function(e) {
			return e.type === "keypress" ? kn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? kn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), $n = Mn(D({}, Bn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), er = Mn(D({}, Nn, { submitter: 0 })), tr = Mn(D({}, Fn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Zn
	})), nr = Mn(D({}, Nn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), rr = Mn(D({}, Bn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), ir = Mn(D({}, Nn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), ar = [
		9,
		13,
		27,
		32
	], or = Sn && "CompositionEvent" in window, sr = null;
	Sn && "documentMode" in document && (sr = document.documentMode);
	var cr = Sn && "TextEvent" in window && !sr, lr = Sn && (!or || sr && 8 < sr && 11 >= sr), ur = " ", dr = !1;
	function fr(e, t) {
		switch (e) {
			case "keyup": return ar.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function pr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var mr = !1;
	function hr(e, t) {
		switch (e) {
			case "compositionend": return pr(t);
			case "keypress": return t.which === 32 ? (dr = !0, ur) : null;
			case "textInput": return e = t.data, e === ur && dr ? null : e;
			default: return null;
		}
	}
	function gr(e, t) {
		if (mr) return e === "compositionend" || !or && fr(e, t) ? (e = On(), Dn = En = Tn = null, mr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return lr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var _r = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function vr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!_r[e.type] : t === "textarea";
	}
	function yr(e, t, n, r) {
		gn ? _n ? _n.push(r) : _n = [r] : gn = r, t = qf(t, "onChange"), 0 < t.length && (n = new Pn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var G = null, br = null;
	function xr(e) {
		Bf(e, 0);
	}
	function Sr(e) {
		if (Yt(kt(e))) return e;
	}
	function Cr(e, t) {
		if (e === "change") return t;
	}
	var wr = !1;
	if (Sn) {
		var Tr;
		if (Sn) {
			var Er = "oninput" in document;
			if (!Er) {
				var Dr = document.createElement("div");
				Dr.setAttribute("oninput", "return;"), Er = typeof Dr.oninput == "function";
			}
			Tr = Er;
		} else Tr = !1;
		wr = Tr && (!document.documentMode || 9 < document.documentMode);
	}
	function Or() {
		G && (G.detachEvent("onpropertychange", kr), br = G = null);
	}
	function kr(e) {
		if (e.propertyName === "value" && Sr(br)) {
			var t = [];
			yr(t, br, e, hn(e)), bn(xr, t);
		}
	}
	function Ar(e, t, n) {
		e === "focusin" ? (Or(), G = t, br = n, G.attachEvent("onpropertychange", kr)) : e === "focusout" && Or();
	}
	function jr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Sr(br);
	}
	function Mr(e, t) {
		if (e === "click") return Sr(t);
	}
	function Nr(e, t) {
		if (e === "input" || e === "change") return Sr(t);
	}
	function Pr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Fr = typeof Object.is == "function" ? Object.is : Pr;
	function Ir(e, t) {
		if (Fr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ae.call(t, i) || !Fr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Lr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Rr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function zr(e, t) {
		var n = Rr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Rr(n);
		}
	}
	function Br(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Br(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Vr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Lr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Lr(e.document);
		}
		return t;
	}
	function Hr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Ur = Sn && "documentMode" in document && 11 >= document.documentMode, Wr = null, Gr = null, Kr = null, qr = !1;
	function Jr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		qr || Wr == null || Wr !== Lr(r) || (r = Wr, "selectionStart" in r && Hr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Kr && Ir(Kr, r) || (Kr = r, r = qf(Gr, "onSelect"), 0 < r.length && (t = new Pn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Wr)));
	}
	function Yr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Xr = {
		animationend: Yr("Animation", "AnimationEnd"),
		animationiteration: Yr("Animation", "AnimationIteration"),
		animationstart: Yr("Animation", "AnimationStart"),
		transitionrun: Yr("Transition", "TransitionRun"),
		transitionstart: Yr("Transition", "TransitionStart"),
		transitioncancel: Yr("Transition", "TransitionCancel"),
		transitionend: Yr("Transition", "TransitionEnd")
	}, Zr = {}, Qr = {};
	Sn && (Qr = document.createElement("div").style, "AnimationEvent" in window || (delete Xr.animationend.animation, delete Xr.animationiteration.animation, delete Xr.animationstart.animation), "TransitionEvent" in window || delete Xr.transitionend.transition);
	function $r(e) {
		if (Zr[e]) return Zr[e];
		if (!Xr[e]) return e;
		var t = Xr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Qr) return Zr[e] = t[n];
		return e;
	}
	var ei = $r("animationend"), ti = $r("animationiteration"), ni = $r("animationstart"), ri = $r("transitionrun"), ii = $r("transitionstart"), ai = $r("transitioncancel"), oi = $r("transitionend"), si = /* @__PURE__ */ new Map(), ci = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	ci.push("scrollEnd");
	function li(e, t) {
		si.set(e, t), Ft(t, [e]);
	}
	var ui = 0;
	function di(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = vd.identifierPrefix;
		var n = ui++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function fi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Ed;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function pi(e, t) {
		return e = fi(e), t = fi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var mi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, hi = [], gi = 0, _i = 0;
	function vi() {
		for (var e = gi, t = _i = gi = 0; t < e;) {
			var n = hi[t];
			hi[t++] = null;
			var r = hi[t];
			hi[t++] = null;
			var i = hi[t];
			hi[t++] = null;
			var a = hi[t];
			if (hi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Si(n, i, a);
		}
	}
	function yi(e, t, n, r) {
		hi[gi++] = e, hi[gi++] = t, hi[gi++] = n, hi[gi++] = r, _i |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function bi(e, t, n, r) {
		return yi(e, t, n, r), Ci(e);
	}
	function xi(e, t) {
		return yi(e, null, null, t), Ci(e);
	}
	function Si(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - qe(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Ci(e) {
		if (50 < Dd) throw Dd = 0, Od = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var wi = {};
	function Ti(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ei(e, t, n, r) {
		return new Ti(e, t, n, r);
	}
	function Di(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Oi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ei(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function ki(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Ai(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Di(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, H.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ae: return e = Ei(31, n, t, a), e.elementType = ae, e.lanes = o, e;
			case j: return ji(n.children, a, o, t);
			case M:
				s = 8, a |= 24;
				break;
			case N: return e = Ei(12, n, t, a | 2), e.elementType = N, e.lanes = o, e;
			case te: return e = Ei(13, n, t, a), e.elementType = te, e.lanes = o, e;
			case ne: return e = Ei(19, n, t, a), e.elementType = ne, e.lanes = o, e;
			case I:
			case oe: return e = a | 32, e = Ei(30, n, t, e), e.elementType = oe, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case F:
						s = 10;
						break a;
					case P:
						s = 9;
						break a;
					case ee:
						s = 11;
						break a;
					case re:
						s = 14;
						break a;
					case ie:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ei(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function ji(e, t, n, r) {
		return e = Ei(7, e, r, t), e.lanes = n, e;
	}
	function Mi(e, t, n) {
		return e = Ei(6, e, null, t), e.lanes = n, e;
	}
	function Ni(e) {
		var t = Ei(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Pi(e, t, n) {
		return t = Ei(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Fi = /* @__PURE__ */ new WeakMap();
	function Ii(e, t) {
		if (typeof e == "object" && e) {
			var n = Fi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ke(t)
			}, Fi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ke(t)
		};
	}
	var Li = [], Ri = 0, zi = null, Bi = 0, Vi = [], Hi = 0, Ui = null, Wi = 1, Gi = "";
	function Ki(e, t) {
		Li[Ri++] = Bi, Li[Ri++] = zi, zi = e, Bi = t;
	}
	function qi(e, t, n) {
		Vi[Hi++] = Wi, Vi[Hi++] = Gi, Vi[Hi++] = Ui, Ui = e;
		var r = Wi;
		e = Gi;
		var i = 32 - qe(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - qe(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Wi = 1 << 32 - qe(t) + i | n << i | r, Gi = a + e;
		} else Wi = 1 << a | n << i | r, Gi = e;
	}
	function Ji(e) {
		e.return !== null && (Ki(e, 1), qi(e, 1, 0));
	}
	function Yi(e) {
		for (; e === zi;) zi = Li[--Ri], Li[Ri] = null, Bi = Li[--Ri], Li[Ri] = null;
		for (; e === Ui;) Ui = Vi[--Hi], Vi[Hi] = null, Gi = Vi[--Hi], Vi[Hi] = null, Wi = Vi[--Hi], Vi[Hi] = null;
	}
	function Xi(e, t) {
		Vi[Hi++] = Wi, Vi[Hi++] = Gi, Vi[Hi++] = Ui, Wi = t.id, Gi = t.overflow, Ui = e;
	}
	var Zi = null, Qi = null, K = !1, $i = null, ea = !1, ta = Error(i(519));
	function na(e) {
		throw ca(Ii(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ta;
	}
	function ra(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[_t] = e, t[vt] = r, n) {
			case "dialog":
				$("cancel", t), $("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				$("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Rf.length; n++) $(Rf[n], t);
				break;
			case "source":
				$("error", t);
				break;
			case "img":
			case "image":
			case "link":
				$("error", t), $("load", t);
				break;
			case "details":
				$("toggle", t);
				break;
			case "input":
				$("invalid", t), $t(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				$("invalid", t);
				break;
			case "textarea": $("invalid", t), rn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || $f(t.textContent, n) ? (r.popover != null && ($("beforetoggle", t), $("toggle", t)), r.onScroll != null && $("scroll", t), r.onScrollEnd != null && $("scrollend", t), r.onClick != null && (t.onclick = pn), t = !0) : t = !1, t || na(e, !0);
	}
	function ia(e) {
		for (Zi = e.return; Zi;) switch (Zi.tag) {
			case 5:
			case 31:
			case 13:
				ea = !1;
				return;
			case 27:
			case 3:
				ea = !0;
				return;
			default: Zi = Zi.return;
		}
	}
	function aa(e) {
		if (e !== Zi) return !1;
		if (!K) return ia(e), K = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && Qi && na(e), ia(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Qi = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Qi = dm(e);
		} else t === 27 ? (t = Qi, Sp(e.type) ? (e = um, um = null, Qi = e) : Qi = t) : Qi = Zi ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function oa() {
		Qi = Zi = null, K = !1;
	}
	function sa() {
		var e = $i;
		return e !== null && (ud === null ? ud = e : ud.push.apply(ud, e), $i = null), e;
	}
	function ca(e) {
		$i === null ? $i = [e] : $i.push(e);
	}
	var la = he(null), ua = null, da = null;
	function fa(e, t, n) {
		V(la, t._currentValue), t._currentValue = n;
	}
	function pa(e) {
		e._currentValue = la.current, ge(la);
	}
	function ma(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ha(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), ma(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), ma(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), ma(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ga(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Fr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ye.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && ha(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function _a(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Fr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function va(e) {
		ua = e, da = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ya(e) {
		return xa(ua, e);
	}
	function ba(e, t) {
		return ua === null && va(e), xa(e, t);
	}
	function xa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, da === null) {
			if (e === null) throw Error(i(308));
			da = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else da = da.next = t;
		return n;
	}
	var Sa = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Ca = t.unstable_scheduleCallback, wa = t.unstable_NormalPriority, Ta = {
		$$typeof: F,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ea() {
		return {
			controller: new Sa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Da(e) {
		e.refCount--, e.refCount === 0 && Ca(wa, function() {
			e.controller.abort();
		});
	}
	function Oa(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var ka = null;
	function Aa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var ja = null, Ma = 0, Na = 0, Pa = null;
	function Fa(e, t) {
		if (ja === null) {
			var n = ja = [];
			Ma = 0, Na = Nf(), Pa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ma++, t.then(Ia, Ia), t;
	}
	function Ia() {
		if (--Ma === 0 && (ka = null, ja !== null)) {
			Pa !== null && (Pa.status = "fulfilled");
			var e = ja;
			ja = null, Na = 0, Pa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function La(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ra = R.S;
	R.S = function(e, t) {
		if (pd = Fe(), typeof t == "object" && t && typeof t.then == "function" && Fa(e, t), ka !== null) for (var n = yf; n !== null;) Oa(n, ka), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = yf; r !== null;) Oa(r, n), r = r.next;
			if (Na !== 0) {
				r = ka, r === null && (r = ka = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ra !== null && Ra(e, t);
	};
	var za = he(null);
	function Ba() {
		var e = za.current;
		return e === null ? Zu.pooledCache : e;
	}
	function Va(e, t) {
		t === null ? V(za, za.current) : V(za, t.pool);
	}
	function Ha() {
		var e = Ba();
		return e === null ? null : {
			parent: Ta._currentValue,
			pool: e
		};
	}
	var Ua = Error(i(460)), Wa = Error(i(474)), Ga = Error(i(542)), Ka = { then: function() {} };
	function qa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ja(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(pn, pn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Qa(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(pn, pn);
				else {
					if (e = Zu, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Qa(e), e;
				}
				throw Xa = t, Ua;
		}
	}
	function Ya(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Xa = e, Ua) : e;
		}
	}
	var Xa = null;
	function Za() {
		if (Xa === null) throw Error(i(459));
		var e = Xa;
		return Xa = null, e;
	}
	function Qa(e) {
		if (e === Ua || e === Ga) throw Error(i(483));
	}
	var $a = null, eo = 0;
	function to(e) {
		var t = eo;
		return eo += 1, $a === null && ($a = []), Ja($a, e, t);
	}
	function no(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function ro(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function io(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Oi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Mi(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === j ? (e = d(e, t, n.props.children, r, n.key), no(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ie && Ya(i) === t.type) ? (t = a(t, n.props), no(t, n), t.return = e, t) : (t = Ai(n.type, n.key, n.props, null, e.mode, r), no(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Pi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = ji(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Mi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = Ai(t.type, t.key, t.props, null, e.mode, n), no(n, t), n.return = e, n;
					case A: return t = Pi(t, e.mode, n), t.return = e, t;
					case ie: return t = Ya(t), f(e, t, n);
				}
				if (fe(t) || le(t)) return t = ji(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, to(t), n);
				if (t.$$typeof === F) return f(e, ba(e, t), n);
				ro(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case k: return n.key === i ? l(e, t, n, r) : null;
					case A: return n.key === i ? u(e, t, n, r) : null;
					case ie: return n = Ya(n), p(e, t, n, r);
				}
				if (fe(n) || le(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, to(n), r);
				if (n.$$typeof === F) return p(e, t, ba(e, n), r);
				ro(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case A: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ie: return r = Ya(r), m(e, t, n, r, i);
				}
				if (fe(r) || le(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, to(r), i);
				if (r.$$typeof === F) return m(e, t, n, ba(t, r), i);
				ro(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), K && Ki(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return K && Ki(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), K && Ki(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), K && Ki(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return K && Ki(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), K && Ki(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === j && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case k:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === j) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), no(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ie && Ya(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), no(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === j ? (c = ji(o.props.children, e.mode, c, o.key), no(c, o), c.return = e, e = c) : (c = Ai(o.type, o.key, o.props, null, e.mode, c), no(c, o), c.return = e, e = c);
						}
						return s(e);
					case A:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Pi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ie: return o = Ya(o), _(e, r, o, c);
				}
				if (fe(o)) return h(e, r, o, c);
				if (le(o)) {
					if (l = le(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, to(o), c);
				if (o.$$typeof === F) return _(e, r, ba(e, o), c);
				ro(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Mi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				eo = 0;
				var i = _(e, t, n, r);
				return $a = null, i;
			} catch (t) {
				if (t === Ua || t === Ga) throw t;
				var a = Ei(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var ao = io(!0), oo = io(!1), so = !1;
	function co(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function lo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function uo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function fo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, Y & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Ci(e), Si(e, null, n), t;
		}
		return yi(e, r, t, n), Ci(e);
	}
	function po(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ut(e, n);
		}
	}
	function mo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var ho = !1;
	function go() {
		if (ho) {
			var e = Pa;
			if (e !== null) throw e;
		}
	}
	function _o(e, t, n, r) {
		ho = !1;
		var i = e.updateQueue;
		so = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Z & f) === f : (r & f) === f) {
					f !== 0 && f === Na && (ho = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = D({}, d, f);
								break a;
							case 2: so = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), id |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function vo(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function yo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) vo(n[e], t);
	}
	var bo = he(null), xo = he(0);
	function So(e, t) {
		e = nd, V(xo, e), V(bo, t), nd = e | t.baseLanes;
	}
	function Co() {
		V(xo, nd), V(bo, bo.current);
	}
	function wo() {
		nd = xo.current, ge(bo), ge(xo);
	}
	var To = he(null), Eo = null;
	function Do(e) {
		var t = e.alternate;
		V(Mo, Mo.current & 1), V(To, e), Eo === null && (t === null || bo.current !== null || t.memoizedState !== null) && (Eo = e);
	}
	function Oo(e) {
		V(Mo, Mo.current), V(To, e), Eo === null && (Eo = e);
	}
	function ko(e) {
		e.tag === 22 ? (V(Mo, Mo.current), V(To, e), Eo === null && (Eo = e)) : Ao();
	}
	function Ao() {
		V(Mo, Mo.current), V(To, To.current);
	}
	function jo(e) {
		ge(To), Eo === e && (Eo = null), ge(Mo);
	}
	var Mo = he(0);
	function No(e, t) {
		V(To, To.current), V(Mo, t);
	}
	function Po(e) {
		ge(Mo), ge(To), Eo === e && (Eo = null);
	}
	function Fo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Io = 0, q = null, Lo = null, Ro = null, zo = !1, Bo = !1, Vo = !1, Ho = 0, Uo = 0, Wo = null, Go = 0;
	function Ko() {
		throw Error(i(321));
	}
	function qo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Fr(e[n], t[n])) return !1;
		return !0;
	}
	function Jo(e, t, n, r, i, a) {
		return Io = a, q = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, R.H = e === null || e.memoizedState === null ? dc : fc, Vo = !1, a = n(r, i), Vo = !1, Bo && (a = Xo(t, n, r, i)), Yo(e), a;
	}
	function Yo(e) {
		R.H = uc;
		var t = Lo !== null && Lo.next !== null;
		if (Io = 0, Ro = Lo = q = null, zo = !1, Uo = 0, Wo = null, t) throw Error(i(300));
		e === null || kc || (e = e.dependencies, e !== null && _a(e) && (kc = !0));
	}
	function Xo(e, t, n, r) {
		q = e;
		var a = 0;
		do {
			if (Bo && (Wo = null), Uo = 0, Bo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Ro = Lo = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			R.H = pc, o = t(n, r);
		} while (Bo);
		return o;
	}
	function Zo() {
		var e = R.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? is(t) : t, e = e.useState()[0], (Lo === null ? null : Lo.memoizedState) !== e && (q.flags |= 1024), t;
	}
	function Qo() {
		var e = Ho !== 0;
		return Ho = 0, e;
	}
	function $o(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function es(e) {
		if (zo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			zo = !1;
		}
		Io = 0, Ro = Lo = q = null, Bo = !1, Uo = Ho = 0, Wo = null;
	}
	function ts() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Ro === null ? q.memoizedState = Ro = e : Ro = Ro.next = e, Ro;
	}
	function ns() {
		if (Lo === null) {
			var e = q.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Lo.next;
		var t = Ro === null ? q.memoizedState : Ro.next;
		if (t !== null) Ro = t, Lo = e;
		else {
			if (e === null) throw q.alternate === null ? Error(i(467)) : Error(i(310));
			Lo = e, e = {
				memoizedState: Lo.memoizedState,
				baseState: Lo.baseState,
				baseQueue: Lo.baseQueue,
				queue: Lo.queue,
				next: null
			}, Ro === null ? q.memoizedState = Ro = e : Ro = Ro.next = e;
		}
		return Ro;
	}
	function rs() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function is(e) {
		var t = Uo;
		return Uo += 1, Wo === null && (Wo = []), e = Ja(Wo, e, t), t = q, (Ro === null ? t.memoizedState : Ro.next) === null && (t = t.alternate, R.H = t === null || t.memoizedState === null ? dc : fc), e;
	}
	function as(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return is(e);
			if (e.$$typeof === se) return;
			if (e.$$typeof === F) return ya(e);
		}
		throw Error(i(438, String(e)));
	}
	function os(e) {
		var t = null, n = q.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = q.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = rs(), q.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = L;
		return t.index++, n;
	}
	function ss(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function cs(e) {
		return ls(ns(), Lo, e);
	}
	function ls(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Io & f) === f : (Z & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Na && (d = !0);
					else if ((Io & p) === p) {
						u = u.next, p === Na && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, q.lanes |= p, id |= p;
					f = u.action, Vo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, q.lanes |= f, id |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Fr(o, e.memoizedState) && (kc = !0, d && (n = Pa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function us(e) {
		var t = ns(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Fr(o, t.memoizedState) || (kc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function ds(e, t, n) {
		var r = q, a = ns(), o = K;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Fr((Lo || a).memoizedState, n);
		if (s && (a.memoizedState = n, kc = !0), a = a.queue, Is(ms.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Ro !== null && !!(Ro.memoizedState.tag & 1), js(e ? 9 : 8, { destroy: void 0 }, ps.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Zu === null) throw Error(i(349));
			o || Io & 127 || fs(r, t, n);
		}
		return n;
	}
	function fs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = q.updateQueue, t === null ? (t = rs(), q.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function ps(e, t, n, r) {
		t.value = n, t.getSnapshot = r, hs(t) && gs(e);
	}
	function ms(e, t, n) {
		return n(function() {
			hs(t) && gs(e);
		});
	}
	function hs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Fr(e, n);
		} catch {
			return !0;
		}
	}
	function gs(e) {
		var t = xi(e, 2);
		t !== null && Md(t, e, 2);
	}
	function _s(e) {
		var t = ts();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Vo) {
				Ke(!0);
				try {
					n();
				} finally {
					Ke(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ss,
			lastRenderedState: e
		}, t;
	}
	function vs(e, t, n, r) {
		return e.baseState = n, ls(e, Lo, typeof r == "function" ? r : ss);
	}
	function ys(e, t, n, r, a) {
		if (sc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			R.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, bs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function bs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = R.T, o = {};
			o.types = a === null ? null : a.types, R.T = o;
			try {
				var s = n(i, r), c = R.S;
				c !== null && c(o, s), xs(e, t, s);
			} catch (n) {
				Cs(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), R.T = a;
			}
		} else try {
			a = n(i, r), xs(e, t, a);
		} catch (n) {
			Cs(e, t, n);
		}
	}
	function xs(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Ss(e, t, n);
		}, function(n) {
			return Cs(e, t, n);
		}) : Ss(e, t, n);
	}
	function Ss(e, t, n) {
		t.status = "fulfilled", t.value = n, ws(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, bs(e, n)));
	}
	function Cs(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, ws(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function ws(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Ts(e, t) {
		return t;
	}
	function Es(e, t) {
		if (K) {
			var n = Zu.formState;
			if (n !== null) {
				a: {
					var r = q;
					if (K) {
						if (Qi) {
							b: {
								for (var i = Qi, a = ea; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Qi = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						na(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = ts(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Ts,
			lastRenderedState: t
		}, n.queue = r, n = ic.bind(null, q, r), r.dispatch = n, r = _s(!1), a = oc.bind(null, q, !1, r.queue), r = ts(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = ys.bind(null, q, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Ds(e) {
		return Os(ns(), Lo, e);
	}
	function Os(e, t, n) {
		if (t = ls(e, t, Ts)[0], e = cs(ss)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = is(t);
		} catch (e) {
			throw e === Ua ? Ga : e;
		}
		else r = t;
		t = ns();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (q.flags |= 2048, js(9, { destroy: void 0 }, ks.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function ks(e, t) {
		e.action = t;
	}
	function As(e) {
		var t = ns(), n = Lo;
		if (n !== null) return Os(t, n, e);
		ns(), t = t.memoizedState, n = ns();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function js(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = q.updateQueue, t === null && (t = rs(), q.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Ms() {
		return ns().memoizedState;
	}
	function Ns(e, t, n, r) {
		var i = ts();
		q.flags |= e, i.memoizedState = js(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ps(e, t, n, r) {
		var i = ns();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Lo !== null && r !== null && qo(r, Lo.memoizedState.deps) ? i.memoizedState = js(t, a, n, r) : (q.flags |= e, i.memoizedState = js(1 | t, a, n, r));
	}
	function Fs(e, t) {
		Ns(8390656, 8, e, t);
	}
	function Is(e, t) {
		Ps(2048, 8, e, t);
	}
	function Ls(e) {
		q.flags |= 4;
		var t = q.updateQueue;
		if (t === null) t = rs(), q.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Rs(e) {
		var t = ns().memoizedState;
		return Ls({
			ref: t,
			nextImpl: e
		}), function() {
			if (Y & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function zs(e, t) {
		return Ps(4, 2, e, t);
	}
	function Bs(e, t) {
		return Ps(4, 4, e, t);
	}
	function Vs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Hs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ps(4, 4, Vs.bind(null, t, e), n);
	}
	function Us() {}
	function Ws(e, t) {
		var n = ns();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && qo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Gs(e, t) {
		var n = ns();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && qo(t, r[1])) return r[0];
		if (r = e(), Vo) {
			Ke(!0);
			try {
				e();
			} finally {
				Ke(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ks(e, t, n) {
		return n === void 0 || Io & 1073741824 && !(Z & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Ad(), q.lanes |= e, id |= e, n);
	}
	function qs(e, t, n, r) {
		return Fr(n, t) ? n : bo.current === null ? !(Io & 106) || Io & 1073741824 && !(Z & 261930) ? (kc = !0, e.memoizedState = n) : (e = Ad(), q.lanes |= e, id |= e, t) : (e = Ks(e, n, r), Fr(e, t) || (kc = !0), e);
	}
	function Js(e, t, n, r, i) {
		var a = z.p;
		z.p = a !== 0 && 8 > a ? a : 8;
		var o = R.T, s = {};
		s.types = o === null ? null : o.types, R.T = s, oc(e, !1, t, n);
		try {
			var c = i(), l = R.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? ac(e, t, La(c, r), kd(e)) : ac(e, t, r, kd(e));
		} catch (n) {
			ac(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, kd());
		} finally {
			z.p = a, o !== null && s.types !== null && (o.types = s.types), R.T = o;
		}
	}
	function Ys() {}
	function Xs(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Zs(e).queue;
		Js(e, a, t, B, n === null ? Ys : function() {
			return Qs(e), n(r);
		});
	}
	function Zs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: B,
			baseState: B,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ss,
				lastRenderedState: B
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: ss,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Qs(e) {
		var t = Zs(e);
		t.next === null && (t = e.alternate.memoizedState), ac(e, t.next.queue, {}, kd());
	}
	function $s() {
		return ya(sh);
	}
	function ec() {
		return ns().memoizedState;
	}
	function tc() {
		return ns().memoizedState;
	}
	function nc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = kd();
					e = uo(n);
					var r = fo(t, e, n);
					r !== null && (Md(r, t, n), po(r, t, n)), t = { cache: Ea() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function rc(e, t, n) {
		var r = kd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, sc(e) ? cc(t, n) : (n = bi(e, t, n, r), n !== null && (Md(n, e, r), lc(n, t, r)));
	}
	function ic(e, t, n) {
		ac(e, t, n, kd());
	}
	function ac(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (sc(e)) cc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Fr(s, o)) return yi(e, t, i, 0), Zu === null && vi(), !1;
			} catch {}
			if (n = bi(e, t, i, r), n !== null) return Md(n, e, r), lc(n, t, r), !0;
		}
		return !1;
	}
	function oc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Nf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, sc(e)) {
			if (t) throw Error(i(479));
		} else t = bi(e, n, r, 2), t !== null && Md(t, e, 2);
	}
	function sc(e) {
		var t = e.alternate;
		return e === q || t !== null && t === q;
	}
	function cc(e, t) {
		Bo = zo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function lc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ut(e, n);
		}
	}
	var uc = {
		readContext: ya,
		use: as,
		useCallback: Ko,
		useContext: Ko,
		useEffect: Ko,
		useImperativeHandle: Ko,
		useLayoutEffect: Ko,
		useInsertionEffect: Ko,
		useMemo: Ko,
		useReducer: Ko,
		useRef: Ko,
		useState: Ko,
		useDebugValue: Ko,
		useDeferredValue: Ko,
		useTransition: Ko,
		useSyncExternalStore: Ko,
		useId: Ko,
		useHostTransitionStatus: Ko,
		useFormState: Ko,
		useActionState: Ko,
		useOptimistic: Ko,
		useMemoCache: Ko,
		useCacheRefresh: Ko,
		useEffectEvent: Ko
	}, dc = {
		readContext: ya,
		use: as,
		useCallback: function(e, t) {
			return ts().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ya,
		useEffect: Fs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Ns(4194308, 4, Vs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Ns(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Ns(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = ts();
			t = t === void 0 ? null : t;
			var r = e();
			if (Vo) {
				Ke(!0);
				try {
					e();
				} finally {
					Ke(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = ts();
			if (n !== void 0) {
				var i = n(t);
				if (Vo) {
					Ke(!0);
					try {
						n(t);
					} finally {
						Ke(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = rc.bind(null, q, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = ts();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = _s(e);
			var t = e.queue, n = ic.bind(null, q, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Us,
		useDeferredValue: function(e, t) {
			return Ks(ts(), e, t);
		},
		useTransition: function() {
			var e = _s(!1);
			return e = Js.bind(null, q, e.queue, !0, !1), ts().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = q, a = ts();
			if (K) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Zu === null) throw Error(i(349));
				Z & 127 || fs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Fs(ms.bind(null, r, o, e), [e]), r.flags |= 2048, js(9, { destroy: void 0 }, ps.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = ts(), t = Zu.identifierPrefix;
			if (K) {
				var n = Gi, r = Wi;
				n = (r & ~(1 << 32 - qe(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Ho++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Go++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: $s,
		useFormState: Es,
		useActionState: Es,
		useOptimistic: function(e) {
			var t = ts();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = oc.bind(null, q, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: os,
		useCacheRefresh: function() {
			return ts().memoizedState = nc.bind(null, q);
		},
		useEffectEvent: function(e) {
			var t = ts(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (Y & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, fc = {
		readContext: ya,
		use: as,
		useCallback: Ws,
		useContext: ya,
		useEffect: Is,
		useImperativeHandle: Hs,
		useInsertionEffect: zs,
		useLayoutEffect: Bs,
		useMemo: Gs,
		useReducer: cs,
		useRef: Ms,
		useState: function() {
			return cs(ss);
		},
		useDebugValue: Us,
		useDeferredValue: function(e, t) {
			return qs(ns(), Lo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = cs(ss)[0], t = ns().memoizedState;
			return [typeof e == "boolean" ? e : is(e), t];
		},
		useSyncExternalStore: ds,
		useId: ec,
		useHostTransitionStatus: $s,
		useFormState: Ds,
		useActionState: Ds,
		useOptimistic: function(e, t) {
			return vs(ns(), Lo, e, t);
		},
		useMemoCache: os,
		useCacheRefresh: tc,
		useEffectEvent: Rs
	}, pc = {
		readContext: ya,
		use: as,
		useCallback: Ws,
		useContext: ya,
		useEffect: Is,
		useImperativeHandle: Hs,
		useInsertionEffect: zs,
		useLayoutEffect: Bs,
		useMemo: Gs,
		useReducer: us,
		useRef: Ms,
		useState: function() {
			return us(ss);
		},
		useDebugValue: Us,
		useDeferredValue: function(e, t) {
			var n = ns();
			return Lo === null ? Ks(n, e, t) : qs(n, Lo.memoizedState, e, t);
		},
		useTransition: function() {
			var e = us(ss)[0], t = ns().memoizedState;
			return [typeof e == "boolean" ? e : is(e), t];
		},
		useSyncExternalStore: ds,
		useId: ec,
		useHostTransitionStatus: $s,
		useFormState: As,
		useActionState: As,
		useOptimistic: function(e, t) {
			var n = ns();
			return Lo === null ? (n.baseState = e, [e, n.queue.dispatch]) : vs(n, Lo, e, t);
		},
		useMemoCache: os,
		useCacheRefresh: tc,
		useEffectEvent: Rs
	};
	function mc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var hc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = kd(), i = uo(r);
			i.payload = t, n != null && (i.callback = n), t = fo(e, i, r), t !== null && (Md(t, e, r), po(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = kd(), i = uo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = fo(e, i, r), t !== null && (Md(t, e, r), po(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = kd(), r = uo(n);
			r.tag = 2, t != null && (r.callback = t), t = fo(e, r, n), t !== null && (Md(t, e, n), po(t, e, n));
		}
	};
	function gc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Ir(n, r) || !Ir(i, a) : !0;
	}
	function _c(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && hc.enqueueReplaceState(t, t.state, null);
	}
	function vc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function yc(e) {
		mi(e);
	}
	function bc(e) {
		console.error(e);
	}
	function xc(e) {
		mi(e);
	}
	function Sc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Cc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function wc(e, t, n) {
		return n = uo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Sc(e, t);
		}, n;
	}
	function Tc(e) {
		return e = uo(e), e.tag = 3, e;
	}
	function Ec(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Cc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Cc(t, n, r), typeof i != "function" && (gd === null ? gd = /* @__PURE__ */ new Set([this]) : gd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Dc(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ga(t, n, a, !0), n = To.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Eo === null ? Wd() : n.alternate === null && rd === 0 && (rd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ka ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), pf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ka ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), pf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return pf(e, r, a), Wd(), !1;
		}
		if (K) return t = To.current, t === null ? (r !== ta && (t = Error(i(423), { cause: r }), ca(Ii(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Ii(r, n), a = wc(e.stateNode, r, a), mo(e, a), rd !== 4 && (rd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ta && (e = Error(i(422), { cause: r }), ca(Ii(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Ii(o, n), ld === null ? ld = [o] : ld.push(o), rd !== 4 && (rd = 2), t === null) return !0;
		r = Ii(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = wc(n.stateNode, r, e), mo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (gd === null || !gd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Tc(a), Ec(a, e, n, r), mo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Oc = Error(i(461)), kc = !1;
	function Ac(e, t, n, r) {
		t.child = e === null ? oo(t, null, n, r) : ao(t, e.child, n, r);
	}
	function jc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return va(t), r = Jo(e, t, n, o, a, i), s = Qo(), e !== null && !kc ? ($o(e, t, i), al(e, t, i)) : (K && s && Ji(t), t.flags |= 1, Ac(e, t, r, i), t.child);
	}
	function Mc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Di(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Nc(e, t, a, r, i)) : (e = Ai(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !ol(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Ir : n, n(o, r) && e.ref === t.ref) return al(e, t, i);
		}
		return t.flags |= 1, e = Oi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Nc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Ir(a, r) && e.ref === t.ref) {
				if (kc = !1, t.pendingProps = r = a, ol(e, i)) e.flags & 131072 && (kc = !0);
				else return t.lanes = e.lanes, al(e, t, i);
			}
		}
		return Vc(e, t, n, r, i);
	}
	function Pc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Ic(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Va(t, a === null ? null : a.cachePool), a === null ? Co() : So(t, a), ko(t);
			else return r = t.lanes = 536870912, Ic(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Va(t, null), Co(), Ao()) : (Va(t, a.cachePool), So(t, a), Ao(), t.memoizedState = null);
		return Ac(e, t, i, n), t.child;
	}
	function Fc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Ic(e, t, n, r, i) {
		var a = Ba();
		return a = a === null ? null : {
			parent: Ta._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Va(t, null), Co(), ko(t), e !== null && ga(e, t, r, !0), t.childLanes = i, null;
	}
	function Lc(e, t) {
		return t = Xc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Rc(e, t, n) {
		return ao(t, e.child, null, n), e = Lc(t, t.pendingProps), e.flags |= 2, jo(t), t.memoizedState = null, e;
	}
	function zc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (K) {
				if (r.mode === "hidden") return e = Lc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Fc(null, e);
				if (Oo(t), (e = Qi) ? (e = am(e, ea), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ui === null ? null : {
						id: Wi,
						overflow: Gi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ni(e), n.return = t, t.child = n, Zi = t, Qi = null)) : e = null, e === null) throw na(t);
				return t.lanes = 536870912, null;
			}
			return Lc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Oo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Rc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (kc || ga(e, t, n, !1), a = (n & e.childLanes) !== 0, kc || a) {
				if (bo.current === null) {
					if (r = Zu, r !== null && (s = dt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, xi(e, s), Md(r, e, s), Oc;
					Wd();
				}
				t = Rc(e, t, n);
			} else e = o.treeContext, Qi = lm(s.nextSibling), Zi = t, K = !0, $i = null, ea = !1, e !== null && Xi(t, e), t = Lc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Oi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Bc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Vc(e, t, n, r, i) {
		return va(t), n = Jo(e, t, n, r, void 0, i), r = Qo(), e !== null && !kc ? ($o(e, t, i), al(e, t, i)) : (K && r && Ji(t), t.flags |= 1, Ac(e, t, n, i), t.child);
	}
	function Hc(e, t, n, r, i, a) {
		return va(t), t.updateQueue = null, n = Xo(t, r, n, i), Yo(e), r = Qo(), e !== null && !kc ? ($o(e, t, a), al(e, t, a)) : (K && r && Ji(t), t.flags |= 1, Ac(e, t, n, a), t.child);
	}
	function Uc(e, t, n, r, i) {
		if (va(t), t.stateNode === null) {
			var a = wi, o = n.contextType;
			typeof o == "object" && o && (a = ya(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = hc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, co(t), o = n.contextType, a.context = typeof o == "object" && o ? ya(o) : wi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (mc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && hc.enqueueReplaceState(a, a.state, null), _o(t, r, a, i), go(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = vc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = wi, typeof u == "object" && u && (o = ya(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && _c(t, a, r, o), so = !1;
			var f = t.memoizedState;
			a.state = f, _o(t, r, a, i), go(), l = t.memoizedState, s || f !== l || so ? (typeof d == "function" && (mc(t, n, d, r), l = t.memoizedState), (c = so || gc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, lo(e, t), o = t.memoizedProps, u = vc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = wi, typeof l == "object" && l && (c = ya(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && _c(t, a, r, c), so = !1, f = t.memoizedState, a.state = f, _o(t, r, a, i), go();
			var p = t.memoizedState;
			o !== d || f !== p || so || e !== null && e.dependencies !== null && _a(e.dependencies) ? (typeof s == "function" && (mc(t, n, s, r), p = t.memoizedState), (u = so || gc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && _a(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Bc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = ao(t, e.child, null, i), t.child = ao(t, null, n, i)) : Ac(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = al(e, t, i), e;
	}
	function Wc(e, t, n, r) {
		return oa(), t.flags |= 256, Ac(e, t, n, r), t.child;
	}
	var Gc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Kc(e) {
		return {
			baseLanes: e,
			cachePool: Ha()
		};
	}
	function qc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= sd), e;
	}
	function Jc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Mo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (K) {
				if (i ? Do(t) : Ao(), (e = Qi) ? (e = am(e, ea), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ui === null ? null : {
						id: Wi,
						overflow: Gi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Ni(e), n.return = t, t.child = n, Zi = t, Qi = null)) : e = null, e === null) throw na(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Ao(), i = t.mode, a = Xc({
				mode: "hidden",
				children: a
			}, i), r = ji(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Kc(n), r.childLanes = qc(e, o, n), t.memoizedState = Gc, Fc(null, r)) : (Do(t), Yc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Qc(e, t, a, o, r, c, s, n);
		}
		return i ? (Ao(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Oi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = ji(i, a, n, null), i.flags |= 2) : i = Oi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Fc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Kc(n) : (a = i.cachePool, a === null ? a = Ha() : (s = Ta._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = qc(e, o, n), t.memoizedState = Gc, Fc(e.child, r)) : (Do(t), n = e.child, e = n.sibling, n = Oi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Yc(e, t) {
		return t = Xc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Xc(e, t) {
		return e = Ei(22, e, null, t), e.lanes = 0, e;
	}
	function Zc(e, t, n) {
		return ao(t, e.child, null, n), e = Yc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Qc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Do(t), t.flags &= -257, Zc(e, t, c)) : t.memoizedState === null ? (Ao(), o = a.fallback, s = t.mode, a = Xc({
			mode: "visible",
			children: a.children
		}, s), o = ji(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, ao(t, e.child, null, c), a = t.child, a.memoizedState = Kc(c), a.childLanes = qc(e, r, c), t.memoizedState = Gc, Fc(null, a)) : (Ao(), t.child = e.child, t.flags |= 128, null);
		if (Do(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, ca({
				value: a,
				source: null,
				stack: null
			})), Zc(e, t, c);
		}
		if (kc || ga(e, t, c, !1), r = (c & e.childLanes) !== 0, kc || r) {
			if (bo.current !== null) return Zc(e, t, c);
			if (r = Zu, r !== null && (a = dt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, xi(e, a), Md(r, e, a), Oc;
			return om(o) || Wd(), Zc(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, Qi = lm(o.nextSibling), Zi = t, K = !0, $i = null, ea = !1, e !== null && Xi(t, e), t = Yc(t, a.children), t.flags |= 134221824, t);
	}
	function $c(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), ma(e.return, t, n);
	}
	function el(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Fo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function tl(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function nl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function rl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Mo.current;
		if (t.flags & 128) return No(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, No(t, o), i === "backwards" && e !== null ? (nl(e), Ac(e, t, r, n), nl(e)) : Ac(e, t, r, n), r = K ? Bi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && $c(e, n, t);
			else if (e.tag === 19) $c(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = el(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, nl(t)), tl(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Fo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				tl(t, !0, n, null, a, r);
				break;
			case "together":
				tl(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = el(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), tl(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function il(e, t, n) {
		var r = t.pendingProps;
		return fa(t, t.type, r.value), Ac(e, t, r.children, n), t.child;
	}
	function al(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), id |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ga(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Oi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Oi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function ol(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && _a(e)));
	}
	function sl(e, t, n) {
		switch (t.tag) {
			case 3:
				be(t, t.stateNode.containerInfo), fa(t, Ta, e.memoizedState.cache), oa();
				break;
			case 27:
			case 5:
				Se(t);
				break;
			case 4:
				be(t, t.stateNode.containerInfo);
				break;
			case 10:
				fa(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Oo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Do(t), t.flags |= 128, null;
					r = ga(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Jc(e, t, n) : (Do(t), e = al(e, t, n), e === null ? null : e.sibling);
				}
				Do(t);
				break;
			case 19:
				if (t.flags & 128) return rl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ga(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return rl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), No(t, Mo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Pc(e, t, n, t.pendingProps);
			case 24: fa(t, Ta, e.memoizedState.cache);
		}
		return al(e, t, n);
	}
	function cl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) kc = !0;
			else {
				if (!ol(e, n) && !(t.flags & 128)) return kc = !1, sl(e, t, n);
				kc = !!(e.flags & 131072);
			}
		} else kc = !1, K && t.flags & 1048576 && qi(t, Bi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ya(t.elementType), t.type = e, typeof e == "function") Di(e) ? (r = vc(e, r), t.tag = 1, t = Uc(null, t, e, r, n)) : (t.tag = 0, t = Vc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === ee) {
								t.tag = 11, t = jc(null, t, e, r, n);
								break a;
							}
							if (a === re) {
								t.tag = 14, t = Mc(null, t, e, r, n);
								break a;
							}
							if (a === F) {
								t.tag = 10, t.type = e, t = il(null, t, n);
								break a;
							}
						}
						throw t = de(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Vc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = vc(r, t.pendingProps), Uc(e, t, r, a, n);
			case 3:
				a: {
					if (be(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, lo(e, t), _o(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, fa(t, Ta, r), r !== o.cache && ha(t, [Ta], n, !0), go(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Wc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Ii(Error(i(424)), t), ca(a), t = Wc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Qi = lm(e.firstChild), Zi = t, K = !0, $i = null, ea = !0, n = oo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (oa(), r === a) {
							t = al(e, t, n);
							break a;
						}
						Ac(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Bc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : K || (t.stateNode = fp(t.type, t.pendingProps, ve.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Se(t), e === null && K && (r = t.stateNode = hm(t.type, t.pendingProps, ve.current), Zi = t, ea = !0, a = Qi, Sp(t.type) ? (um = a, Qi = lm(r.firstChild)) : Qi = a), Ac(e, t, t.pendingProps.children, n), Bc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && K && ((a = r = Qi) && (r = rm(r, t.type, t.pendingProps, ea), r === null ? a = !1 : (t.stateNode = r, Zi = t, Qi = lm(r.firstChild), ea = !1, a = !0)), a || na(t)), Se(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Jo(e, t, Zo, null, null, n), sh._currentValue = a), Bc(e, t), Ac(e, t, r, n), t.child;
			case 6: return e === null && K && ((e = n = Qi) && (n = im(n, t.pendingProps, ea), n === null ? e = !1 : (t.stateNode = n, Zi = t, Qi = null, e = !0)), e || na(t)), null;
			case 13: return Jc(e, t, n);
			case 4: return be(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = ao(t, null, r, n) : Ac(e, t, r, n), t.child;
			case 11: return jc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Bc(e, t), Ac(e, t, r, n), t.child;
			case 8: return Ac(e, t, t.pendingProps.children, n), t.child;
			case 12: return Ac(e, t, t.pendingProps.children, n), t.child;
			case 10: return il(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, va(t), a = ya(a), r = r(a), t.flags |= 1, Ac(e, t, r, n), t.child;
			case 14: return Mc(e, t, t.type, t.pendingProps, n);
			case 15: return Nc(e, t, t.type, t.pendingProps, n);
			case 19: return rl(e, t, n);
			case 31: return zc(e, t, n);
			case 22: return Pc(e, t, n, t.pendingProps);
			case 24: return va(t), r = ya(Ta), e === null ? (a = Ba(), a === null && (a = Zu, o = Ea(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, co(t), fa(t, Ta, a)) : ((e.lanes & n) !== 0 && (lo(e, t), _o(t, null, null, n), go()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, fa(t, Ta, r), r !== a.cache && ha(t, [Ta], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), fa(t, Ta, r))), Ac(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : K && Ji(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Bc(e, t), Ac(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function ll(e) {
		e.flags |= 4;
	}
	function ul(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Vd()) e.flags |= 8192;
				else throw Xa = Ka, Wa;
			}
		} else e.flags &= -16777217;
	}
	function dl(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Vd()) e.flags |= 8192;
			else throw Xa = Ka, Wa;
		}
	}
	function fl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : at(), e.lanes |= t, cd |= t);
	}
	function pl(e, t) {
		if (!K) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function ml(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function hl(e, t, n) {
		var r = t.pendingProps;
		switch (Yi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return ml(t), null;
			case 1: return ml(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), pa(Ta), xe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (aa(t) ? ll(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, sa())), ml(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (ll(t), o === null ? (ml(t), ul(t, a, null, r, n)) : (ml(t), dl(t, o))) : o ? o === e.memoizedState ? (ml(t), t.flags &= -16777217) : (ll(t), ml(t), dl(t, o)) : (e = e.memoizedProps, e !== r && ll(t), ml(t), ul(t, a, e, r, n)), null;
			case 27:
				if (Ce(t), n = ve.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && ll(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return ml(t), t.subtreeFlags &= -33554433, null;
					}
					e = H.current, aa(t) ? ra(t, e) : (e = hm(a, r, n), t.stateNode = e, ll(t));
				}
				return ml(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Ce(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && ll(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return ml(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = H.current, aa(t)) ra(t, o);
					else {
						var s = lp(ve.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[_t] = t, o[vt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && ll(t);
					}
				}
				return ml(t), t.subtreeFlags &= -33554433, ul(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && ll(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = ve.current, aa(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Zi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[_t] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || $f(e.nodeValue, n)), e || na(t, !0);
					} else e = lp(e).createTextNode(r), e[_t] = t, t.stateNode = e;
				}
				return ml(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = aa(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[_t] = t;
						} else oa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						ml(t), e = !1;
					} else n = sa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (jo(t), t) : (jo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return ml(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = aa(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[_t] = t;
						} else oa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						ml(t), a = !1;
					} else a = sa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (jo(t), t) : (jo(t), null);
				}
				return jo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), fl(t, t.updateQueue), ml(t), null);
			case 4: return xe(), e === null && Uf(t.stateNode.containerInfo), t.flags |= 67108864, ml(t), null;
			case 10: return pa(t.type), ml(t), null;
			case 19:
				if (Po(t), r = t.memoizedState, r === null) return ml(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) pl(r, !1);
					else {
						if (rd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Fo(e), o !== null) {
								for (t.flags |= 128, pl(r, !1), e = o.updateQueue, t.updateQueue = e, fl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) ki(n, e), n = n.sibling;
								return No(t, Mo.current & 1 | 2), K && Ki(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Fe() > md && (t.flags |= 128, a = !0, pl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Fo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, fl(t, e), pl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !K) return ml(t), null;
						} else 2 * Fe() - r.renderingStartTime > md && n !== 536870912 && (t.flags |= 128, a = !0, pl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Fe(), e.sibling = null, o = Mo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || K ? No(t, o) : (n = o, V(To, t), V(Mo, n), Eo === null && (Eo = t)), K && Ki(t, r.treeForkCount), e;
				}
				return ml(t), null;
			case 22:
			case 23: return jo(t), wo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (ml(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ml(t), n = t.updateQueue, n !== null && fl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ge(za), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), pa(Ta), ml(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, ml(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function gl(e, t) {
		switch (Yi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return pa(Ta), xe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Ce(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (jo(t), t.alternate === null) throw Error(i(340));
					oa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (jo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					oa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Po(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return xe(), null;
			case 10: return pa(t.type), null;
			case 22:
			case 23: return jo(t), wo(), e !== null && ge(za), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return pa(Ta), null;
			case 25: return null;
			default: return null;
		}
	}
	function _l(e, t) {
		switch (Yi(t), t.tag) {
			case 3:
				pa(Ta), xe();
				break;
			case 26:
			case 27:
			case 5:
				Ce(t);
				break;
			case 4:
				xe();
				break;
			case 31:
				t.memoizedState !== null && jo(t);
				break;
			case 13:
				jo(t);
				break;
			case 19:
				Po(t);
				break;
			case 10:
				pa(t.type);
				break;
			case 22:
			case 23:
				jo(t), wo(), e !== null && ge(za);
				break;
			case 24: pa(Ta);
		}
	}
	function vl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function yl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								ff(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function bl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				yo(t, n);
			} catch (t) {
				ff(e, e.return, t);
			}
		}
	}
	function xl(e, t, n) {
		n.props = vc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			ff(e, t, n);
		}
	}
	function Sl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = di(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							m(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			ff(e, t, n);
		}
	}
	function Cl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				ff(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				ff(e, t, n);
			}
			else n.current = null;
		}
	}
	function wl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Tl(e) {
		for (var t = e.return; t !== null && (Ol(t) && em(e.stateNode, t.stateNode), !Dl(t));) t = t.return;
	}
	function El(e) {
		for (var t = e.return; t !== null && (Ol(t) && tm(e.stateNode, t.stateNode), !Dl(t));) t = t.return;
	}
	function Dl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Ol(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function kl(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	function Al(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[vt] = t;
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	function jl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Ml(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || jl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Nl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = pn)), wl(e, r), W = !0;
		else if (i !== 4 && (i === 27 && (wl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Nl(e, t, n, r), e = e.sibling; e !== null;) Nl(e, t, n, r), e = e.sibling;
	}
	function Pl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), wl(e, r), W = !0;
		else if (i !== 4 && (i === 27 && (wl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Pl(e, t, n, r), e = e.sibling; e !== null;) Pl(e, t, n, r), e = e.sibling;
	}
	function Fl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[_t] = e, t[vt] = n;
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	var Il = !1, Ll = null;
	function Rl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Il = !0);
	}
	var zl = null;
	function Bl() {
		var e = zl;
		return zl = null, e;
	}
	var Vl = 0;
	function Hl(e, t, n, r, i) {
		return Vl = 0, Ul(e.child, t, n, r, i);
	}
	function Ul(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Il = !0, Tp(o, Vl === 0 ? t : t + "_" + Vl, n), Vl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Ul(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Wl(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Wl(e.child, t), e = e.sibling;
	}
	function Gl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Gl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = pi(t.default, t.share), t !== "none" && (Hl(e, n, t, null, !1) || Wl(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Kl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = di(r, n), a = pi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Gl(e) : Hl(e, i, a, null, !1) ? (Gl(e), n.paired || t || jd(e, r.onEnter)) : Wl(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Kl(e, t), e = e.sibling;
		else Gl(e);
	}
	function ql(e) {
		if (Ll !== null && Ll.size !== 0) {
			var t = Ll;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = pi(n.default, n.share);
								if (a !== "none" && (Hl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, jd(e, n.onShare)) : Wl(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					ql(e);
				}
				e = e.sibling;
			}
		}
	}
	function Jl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = di(t, e.stateNode), r = Ll === null ? void 0 : Ll.get(n), i = pi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Hl(e, n, i, null, !1) ? r === void 0 ? jd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Ll.delete(n), jd(e, t.onShare)) : Wl(e.child, !1)), Ll !== null && ql(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Jl(e), e = e.sibling;
		else Ll !== null && ql(e);
	}
	function Yl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = di(t, e.stateNode);
				t = pi(t.default, t.update), e.flags &= -5, t !== "none" && Hl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Yl(e);
			e = e.sibling;
		}
	}
	function Xl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Wl(e.child, !1));
				}
				Xl(e);
			}
			e = e.sibling;
		}
	}
	function Zl(e) {
		if (e.tag === 30) e.stateNode.paired = null, Wl(e.child, !1), Xl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e), e = e.sibling;
		else Xl(e);
	}
	function Ql(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Wl(e.child, !1) : e.subtreeFlags & 33554432 && Ql(e), e = e.sibling;
	}
	function $l(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Vl < a.length) {
					var l = a[Vl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Vl === 0 ? n : n + "_" + Vl, i), s && e.flags & 4 || (zl === null && (zl = []), zl.push(c, Vl === 0 ? r : r + "_" + Vl, t.memoizedProps)), Vl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : $l(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function eu(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = di(n, r), a = pi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Vl = 0, i = $l(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || jd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && eu(e, t);
			e = e.sibling;
		}
	}
	var tu = !1, J = !1, nu = !1, ru = !1, iu = typeof WeakSet == "function" ? WeakSet : Set, au = null, ou = !1, su = !1, cu = !1, lu = !1;
	function uu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Vr(e), Hr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, au = t, t = n ? 9270 : 1024; au !== null;) {
			if (e = au, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Jl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Rl(e), du(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Jl(r), du(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Rl(e), du(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, au = r) : (n && Yl(e), du(n));
			}
		}
		Ll = null;
	}
	function du(e) {
		for (; au !== null;) {
			var t = au, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = vc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							ff(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = di(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = pi(a.default, a.update), a !== "none" && Hl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, au = r;
				break;
			}
			au = t.return;
		}
	}
	function fu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Mu(e, n), r & 4 && vl(5, n);
				break;
			case 1:
				if (Mu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						ff(n, n.return, e);
					}
					else {
						var i = vc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							ff(n, n.return, e);
						}
					}
				}
				r & 64 && bl(n), r & 512 && Sl(n, n.return);
				break;
			case 3:
				if (Mu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						yo(e, t);
					} catch (e) {
						ff(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Fl(n);
			case 26:
			case 5:
				Mu(e, n), t === null && r & 4 && kl(n), r & 512 && Sl(n, n.return);
				break;
			case 12:
				Mu(e, n);
				break;
			case 31:
				Mu(e, n), r & 4 && xu(e, n);
				break;
			case 13:
				Mu(e, n), r & 4 && Su(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = gf.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || tu, !r) {
					var a = t !== null && t.memoizedState !== null || J;
					t = tu, i = J, tu = r, (J = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Pu(e, n, r)) : Mu(e, n), tu = t, J = i;
				}
				break;
			case 30:
				Mu(e, n), r & 512 && Sl(n, n.return);
				break;
			case 7: r & 512 && Sl(n, n.return);
			default: Mu(e, n);
		}
	}
	function pu(e, t) {
		for (e = e.child; e !== null;) mu(e, t), e = e.sibling;
	}
	function mu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					ff(e, e.return, t);
				}
				hu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, W = !0;
				} catch (t) {
					ff(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					ff(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && pu(e, t);
				break;
			default: pu(e, t);
		}
	}
	function hu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						mu(n, r);
						break a;
					case 22:
						n.memoizedState === null && hu(n, r);
						break a;
					default: hu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function gu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, gu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Et(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var _u = null, vu = !1;
	function yu(e, t, n) {
		for (n = n.child; n !== null;) bu(e, t, n), n = n.sibling;
	}
	function bu(e, t, n) {
		if (Ge && typeof Ge.onCommitFiberUnmount == "function") try {
			Ge.onCommitFiberUnmount(We, n);
		} catch {}
		switch (n.tag) {
			case 26:
				J || Cl(n, t), yu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !J && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				J || Cl(n, t), El(n);
				var r = _u, i = vu;
				Sp(n.type) && (_u = n.stateNode, vu = !1), yu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), _u = r, vu = i;
				break;
			case 5: J || Cl(n, t), El(n);
			case 6:
				if (n.tag === 6 && El(n), r = _u, i = vu, _u = null, yu(e, t, n), _u = r, vu = i, _u !== null) {
					if (vu) try {
						(_u.nodeType === 9 ? _u.body : _u.nodeName === "HTML" ? _u.ownerDocument.body : _u).removeChild(n.stateNode), W = !0;
					} catch (e) {
						ff(n, t, e);
					}
					else try {
						_u.removeChild(n.stateNode), W = !0;
					} catch (e) {
						ff(n, t, e);
					}
				}
				break;
			case 18:
				_u !== null && (vu ? (e = _u, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(_u, n.stateNode));
				break;
			case 4:
				r = _u, i = vu, _u = n.stateNode.containerInfo, vu = !0, yu(e, t, n), _u = r, vu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				yl(2, n, t), J || yl(4, n, t), yu(e, t, n);
				break;
			case 1:
				J || (Cl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && xl(n, t, r)), yu(e, t, n);
				break;
			case 21:
				yu(e, t, n);
				break;
			case 22:
				J = (r = J) || n.memoizedState !== null, yu(e, t, n), J = r;
				break;
			case 30:
				Cl(n, t), yu(e, t, n);
				break;
			case 7:
				J || Cl(n, t), yu(e, t, n);
				break;
			default: yu(e, t, n);
		}
	}
	function xu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				ff(t, t.return, e);
			}
		}
	}
	function Su(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function Cu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new iu()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new iu()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function wu(e, t) {
		var n = Cu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = _f.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Tu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							_u = l.stateNode, vu = !1;
							break a;
						}
						break;
					case 5:
						_u = l.stateNode, vu = !1;
						break a;
					case 3:
					case 4:
						_u = l.stateNode.containerInfo, vu = !0;
						break a;
				}
				l = l.return;
			}
			if (_u === null) throw Error(i(160));
			bu(s, c, o), _u = null, vu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Du(t, e, n), t = t.sibling;
	}
	var Eu = null;
	function Du(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Tu(t, e, n), Ou(e), a & 4 && (yl(3, e, e.return), vl(3, e), yl(5, e, e.return));
				break;
			case 1:
				Tu(t, e, n), Ou(e), a & 512 && (J || r === null || Cl(r, r.return)), a & 64 && tu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Eu, Tu(t, e, n), Ou(e), a & 512 && (J || r === null || Cl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (tu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[wt] || r[_t] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[_t] = e, jt(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[_t] = e, jt(r), t = r;
									}
									e.stateNode = t;
								}
							} else tu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Al(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || J || t.parentNode.removeChild(t)) : a.count--, n === null ? tu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Tu(t, e, n), Ou(e), a & 512 && (J || r === null || Cl(r, r.return)), r !== null && a & 4 && Al(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = nu, nu = !1, Tu(t, e, n), nu = o, Ou(e), a & 512 && (J || r === null || Cl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						an(t, ""), W = !0;
					} catch (t) {
						ff(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Al(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (ru = !0);
				break;
			case 6:
				if (Tu(t, e, n), Ou(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, W = !0;
					} catch (t) {
						ff(e, e.return, t);
					}
				}
				break;
			case 3:
				if (W = !1, Wm = null, o = Eu, Eu = bm(t.containerInfo), Tu(t, e, n), Eu = o, Ou(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					ff(e, e.return, t);
				}
				ru && (ru = !1, ku(e)), W = !1;
				break;
			case 4:
				a = nu, nu = tu, r = Vt(), o = Eu, Eu = bm(e.stateNode.containerInfo), Tu(t, e, n), Ou(e), Eu = o, W && su && (cu = !0), W = r, nu = a;
				break;
			case 12:
				Tu(t, e, n), Ou(e);
				break;
			case 31:
				Tu(t, e, n), Ou(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, wu(e, t)));
				break;
			case 13:
				Tu(t, e, n), Ou(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (fd = Fe()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, wu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = tu, l = J, u = nu;
				tu = c || o, nu = u || o, J = l || s, Tu(t, e, n), J = l, nu = u, tu = c, Ou(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || tu || J || (t = s || J, n = tu, r = J, tu = o || tu, J = t, Nu(e, 2), tu = n, J = r), !o && nu || pu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, wu(e, n))));
				break;
			case 19:
				Tu(t, e, n), Ou(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, wu(e, t)));
				break;
			case 30:
				a & 512 && (J || r === null || Cl(r, r.return)), a = Vt(), o = su, s = (n & 335544064) === n, c = e.memoizedProps, su = s && pi(c.default, c.update) !== "none", Tu(t, e, n), Ou(e), s && r !== null && W && (e.flags |= 4), su = o, W = a;
				break;
			case 21: break;
			case 7: a & 512 && (J || r === null || Cl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Tu(t, e, n), Ou(e);
		}
	}
	function Ou(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (jl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Ol(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Dl(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Pl(e, Ml(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (an(l, ""), n.flags &= -33), Pl(e, Ml(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Nl(e, Ml(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				ff(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function ku(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			ku(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Au(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) ju(t, e), t = t.sibling;
		else eu(t, !1);
	}
	function ju(e, t) {
		var n = e.alternate;
		if (n === null) Kl(e, !1);
		else switch (e.tag) {
			case 3:
				if (lu = ou = !1, Bl(), Au(t, e), !ou && !cu) {
					if (e = zl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), lu = !0;
				}
				zl = null;
				break;
			case 5:
				Au(t, e);
				break;
			case 4:
				r = ou, ou = !1, Au(t, e), ou && (cu = !0), ou = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Au(t, e) : Kl(e, !1));
				break;
			case 30:
				r = ou, i = Bl(), ou = !1, Au(t, e), ou && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = di(a, o), o = di(n.memoizedProps, o);
				var s = pi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Vl = 0, t = $l(e, n, t, o, s, a, !0), Vl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (jd(e, e.memoizedProps.onUpdate), zl = i) : i !== null && (i.push.apply(i, zl), zl = i), ou = e.flags & 32 ? !0 : r;
				break;
			default: Au(t, e);
		}
	}
	function Mu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) fu(e, t.alternate, t), t = t.sibling;
	}
	function Nu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					yl(4, n, n.return), Nu(n, r);
					break;
				case 1:
					Cl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && xl(n, n.return, i), Nu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Cl(n, n.return), n.tag !== 5 && n.tag !== 27 || El(n), Nu(n, r);
					break;
				case 6:
					El(n);
					break;
				case 26:
					Cl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || J || i.parentNode.removeChild(i), Nu(n, r);
					break;
				case 22:
					n.memoizedState === null && Nu(n, r);
					break;
				case 30:
					Cl(n, n.return), Nu(n, r);
					break;
				case 7: Cl(n, n.return);
				default: Nu(n, r);
			}
			e = e.sibling;
		}
	}
	function Pu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Pu(i, a, n), vl(4, a);
					break;
				case 1:
					if (Pu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						ff(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) vo(l[i], c);
						} catch (e) {
							ff(r, r.return, e);
						}
					}
					s && o & 64 && bl(a), Sl(a, a.return);
					break;
				case 27: n & 2 && Fl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Tl(a), Pu(i, a, n), s && r === null && o & 4 && kl(a), Sl(a, a.return);
					break;
				case 6:
					Tl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || tu || Km(bm(c.ownerDocument), a.type, c), Pu(i, a, n), s && r === null && o & 4 && kl(a), Sl(a, a.return);
					break;
				case 12:
					Pu(i, a, n);
					break;
				case 31:
					Pu(i, a, n), s && o & 4 && xu(i, a);
					break;
				case 13:
					Pu(i, a, n), s && o & 4 && Su(i, a);
					break;
				case 22:
					a.memoizedState === null && Pu(i, a, n), Sl(a, a.return);
					break;
				case 30:
					Pu(i, a, n), Sl(a, a.return);
					break;
				case 7: Sl(a, a.return);
				default: Pu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Fu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Da(n));
	}
	function Iu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Da(e));
	}
	function Lu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Ru(e, t, n, r), t = t.sibling;
		else i && Ql(t);
	}
	function Ru(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Zl(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Lu(e, t, n, r), a & 2048 && vl(9, t);
				break;
			case 1:
				Lu(e, t, n, r);
				break;
			case 3:
				Lu(e, t, n, r), i && lu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Da(a)));
				break;
			case 12:
				if (a & 2048) {
					Lu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						ff(t, t.return, e);
					}
				} else Lu(e, t, n, r);
				break;
			case 31:
				Lu(e, t, n, r);
				break;
			case 13:
				Lu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Zl(t), o._visibility & 2 ? Lu(e, t, n, r) : (o._visibility |= 2, zu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Zl(s), o._visibility & 2 ? Lu(e, t, n, r) : Bu(e, t)), a & 2048 && Fu(s, t);
				break;
			case 24:
				Lu(e, t, n, r), a & 2048 && Iu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Wl(a.child, !0), Wl(t.child, !0))), Lu(e, t, n, r);
				break;
			default: Lu(e, t, n, r);
		}
	}
	function zu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					zu(a, o, s, c, i), vl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, zu(a, o, s, c, i)) : u._visibility & 2 ? zu(a, o, s, c, i) : Bu(a, o), i && l & 2048 && Fu(o.alternate, o);
					break;
				case 24:
					zu(a, o, s, c, i), i && l & 2048 && Iu(o.alternate, o);
					break;
				default: zu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Bu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Bu(n, r), i & 2048 && Fu(r.alternate, r);
					break;
				case 24:
					Bu(n, r), i & 2048 && Iu(r.alternate, r);
					break;
				default: Bu(n, r);
			}
			t = t.sibling;
		}
	}
	var Vu = 8192;
	function Hu(e, t, n) {
		if (e.subtreeFlags & Vu) for (e = e.child; e !== null;) Uu(e, t, n), e = e.sibling;
	}
	function Uu(e, t, n) {
		switch (e.tag) {
			case 26:
				Hu(e, t, n), e.flags & Vu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, Eu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Hu(e, t, n), e.flags & Vu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = Eu;
				Eu = bm(e.stateNode.containerInfo), Hu(e, t, n), Eu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Vu, Vu = 16777216, Hu(e, t, n), Vu = r) : Hu(e, t, n));
				break;
			case 30:
				if ((e.flags & Vu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Ll === null && (Ll = /* @__PURE__ */ new Map()), Ll.set(r, i);
				}
				Hu(e, t, n);
				break;
			default: Hu(e, t, n);
		}
	}
	function Wu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Gu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				au = r, Ju(r, e);
			}
			Wu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Ku(e), e = e.sibling;
	}
	function Ku(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Gu(e), e.flags & 2048 && yl(9, e, e.return);
				break;
			case 3:
				Gu(e);
				break;
			case 12:
				Gu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, qu(e)) : Gu(e);
				break;
			default: Gu(e);
		}
	}
	function qu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				au = r, Ju(r, e);
			}
			Wu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					yl(8, t, t.return), qu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, qu(t));
					break;
				default: qu(t);
			}
			e = e.sibling;
		}
	}
	function Ju(e, t) {
		for (; au !== null;) {
			var n = au;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					yl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Da(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, au = r;
			else a: for (n = e; au !== null;) {
				r = au;
				var i = r.sibling, a = r.return;
				if (gu(r), r === n) {
					au = null;
					break a;
				}
				if (i !== null) {
					i.return = a, au = i;
					break a;
				}
				au = a;
			}
		}
	}
	var Yu = {
		getCacheForType: function(e) {
			var t = ya(Ta), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ya(Ta).controller.signal;
		}
	}, Xu = typeof WeakMap == "function" ? WeakMap : Map, Y = 0, Zu = null, X = null, Z = 0, Q = 0, Qu = null, $u = !1, ed = !1, td = !1, nd = 0, rd = 0, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = null, ud = null, dd = !1, fd = 0, pd = 0, md = Infinity, hd = null, gd = null, _d = 0, vd = null, yd = null, bd = 0, xd = 0, Sd = null, Cd = null, wd = null, Td = null, Ed = null, Dd = 0, Od = null;
	function kd() {
		return Y & 2 && Z !== 0 ? Z & -Z : R.T === null ? mt() : Nf();
	}
	function Ad() {
		if (sd === 0) {
			if (!(Z & 536870912) || K) {
				var e = Qe;
				Qe <<= 1, !(Qe & 3932160) && (Qe = 262144), sd = e;
			} else sd = 536870912;
		}
		return e = To.current, e !== null && (e.flags |= 32), sd;
	}
	function jd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(di(e.memoizedProps, n))), Td === null && (Td = []), Td.push(t.bind(null, r));
		}
	}
	function Md(e, t, n) {
		(e === Zu && (Q === 2 || Q === 9) || e.cancelPendingCommit !== null) && (zd(e, 0), Id(e, Z, sd, !1)), st(e, n), Y & 2 && e === Zu || (e === Zu && (!(Y & 2) && (ad |= n), rd === 4 && Id(e, Z, sd, !1)), Tf(e));
	}
	function Nd(e, t, n) {
		if (Y & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || nt(e, t), a = r ? qd(e, t) : Gd(e, t, !0), o = r;
		do {
			if (a === 0) {
				ed && !r && Id(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Fd(n)) a = Gd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = ld;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (zd(c, s).flags |= 256), s = Gd(c, s, !1), s !== 2 && s !== 6) {
								if (td && !l) {
									c.errorRecoveryDisabledLanes |= o, ad |= o, a = 4;
									break a;
								}
								o = ud, ud = a, o !== null && (ud === null ? ud = o : ud.push.apply(ud, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					zd(e, 0), Id(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Id(r, t, sd, !$u);
							break a;
						case 2:
							ud = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = fd + 300 - Fe(), 10 < a)) {
						if (Id(r, t, sd, !$u), tt(r, 0, !0) !== 0) break a;
						bd = t, r.timeoutHandle = gp(Pd.bind(null, r, n, ud, hd, dd, t, sd, ad, cd, $u, o, "Throttled", -0, 0), a);
						break a;
					}
					Pd(r, n, ud, hd, dd, t, sd, ad, cd, $u, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Tf(e);
	}
	function Pd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: pn
		}, Ll = null, Uu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? fd - Fe() : (a & 4194048) === a ? pd - Fe() : 0, m = eh(d, m), m !== null) ? (bd = a, e.cancelPendingCommit = m(ef.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Id(e, a, o, !l)) : ef(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Fd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Fr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Id(e, t, n, r) {
		t = rt(e, t), t &= ~od, t &= ~ad, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - qe(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && lt(e, n, t);
	}
	function Ld() {
		return Y & 6 ? !0 : (Ef(0, !1), !1);
	}
	function Rd() {
		if (X !== null) {
			if (Q === 0) var e = X.return;
			else e = X, da = ua = null, es(e), $a = null, eo = 0, e = X;
			for (; e !== null;) _l(e.alternate, e), e = e.return;
			X = null;
		}
	}
	function zd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), bd = 0, Rd(), Zu = e, X = n = Oi(e.current, null), Z = t, Q = 0, Qu = null, $u = !1, ed = nt(e, t), td = !1, cd = sd = od = ad = id = rd = 0, ud = ld = null, dd = !1, nd = rt(e, t), vi(), n;
	}
	function Bd(e, t) {
		q = null, R.H = uc, t === Ua || t === Ga ? (t = Za(), Q = 3) : t === Wa ? (t = Za(), Q = 4) : Q = t === Oc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Qu = t, X === null && (rd = 1, Sc(e, Ii(t, e.current)));
	}
	function Vd() {
		var e = To.current;
		return e === null ? !0 : (Z & 4194048) === Z ? Eo === null : (Z & 62914560) === Z || Z & 536870912 ? e === Eo : !1;
	}
	function Hd() {
		var e = R.H;
		return R.H = uc, e === null ? uc : e;
	}
	function Ud() {
		var e = R.A;
		return R.A = Yu, e;
	}
	function Wd() {
		rd = 4, $u || (Z & 4194048) !== Z && To.current !== null || (ed = !0), !(id & 134217727) && !(ad & 134217727) || Zu === null || Id(Zu, Z, sd, !1);
	}
	function Gd(e, t, n) {
		var r = Y;
		Y |= 2;
		var i = Hd(), a = Ud();
		(Zu !== e || Z !== t) && (hd = null, zd(e, t)), t = !1;
		var o = rd;
		a: do
			try {
				if (Q !== 0 && X !== null) {
					var s = X, c = Qu;
					switch (Q) {
						case 8:
							Rd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							To.current === null && (t = !0);
							var l = Q;
							if (Q = 0, Qu = null, Zd(e, s, c, l), n && ed) {
								o = 0;
								break a;
							}
							break;
						default: l = Q, Q = 0, Qu = null, Zd(e, s, c, l);
					}
				}
				Kd(), o = rd;
				break;
			} catch (t) {
				Bd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, da = ua = null, Y = r, R.H = i, R.A = a, X === null && (Zu = null, Z = 0, vi()), o;
	}
	function Kd() {
		for (; X !== null;) Yd(X);
	}
	function qd(e, t) {
		var n = Y;
		Y |= 2;
		var r = Hd(), a = Ud();
		Zu !== e || Z !== t ? (hd = null, md = Fe() + 500, zd(e, t)) : ed = nt(e, t);
		a: do
			try {
				if (Q !== 0 && X !== null) {
					t = X;
					var o = Qu;
					b: switch (Q) {
						case 1:
							Q = 0, Qu = null, Zd(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (qa(o)) {
								Q = 0, Qu = null, Xd(t);
								break;
							}
							t = function() {
								Q !== 2 && Q !== 9 || Zu !== e || (Q = 7), Tf(e);
							}, o.then(t, t);
							break a;
						case 3:
							Q = 7;
							break a;
						case 4:
							Q = 5;
							break a;
						case 7:
							qa(o) ? (Q = 0, Qu = null, Xd(t)) : (Q = 0, Qu = null, Zd(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (X.tag) {
								case 26: s = X.memoizedState;
								case 5:
								case 27:
									var c = X;
									if (s ? Ym(s) : c.stateNode.complete) {
										Q = 0, Qu = null;
										var l = c.sibling;
										if (l !== null) X = l;
										else {
											var u = c.return;
											u === null ? X = null : (X = u, Qd(u));
										}
										break b;
									}
							}
							Q = 0, Qu = null, Zd(e, t, o, 5);
							break;
						case 6:
							Q = 0, Qu = null, Zd(e, t, o, 6);
							break;
						case 8:
							Rd(), rd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Jd();
				break;
			} catch (t) {
				Bd(e, t);
			}
		while (1);
		return da = ua = null, R.H = r, R.A = a, Y = n, X === null ? (Zu = null, Z = 0, vi(), rd) : 0;
	}
	function Jd() {
		for (; X !== null && !Ne();) Yd(X);
	}
	function Yd(e) {
		var t = cl(e.alternate, e, nd);
		e.memoizedProps = e.pendingProps, t === null ? Qd(e) : X = t;
	}
	function Xd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Hc(n, t, t.pendingProps, t.type, void 0, Z);
				break;
			case 11:
				t = Hc(n, t, t.pendingProps, t.type.render, t.ref, Z);
				break;
			case 5:
				es(t);
				var r = t;
				r === Zi && (K ? (ia(r), r.tag === 5 && r.stateNode != null && (Qi = r.stateNode)) : (ia(r), K = !0));
			default: _l(n, t), t = X = ki(t, nd), t = cl(n, t, nd);
		}
		e.memoizedProps = e.pendingProps, t === null ? Qd(e) : X = t;
	}
	function Zd(e, t, n, r) {
		da = ua = null, es(t), $a = null, eo = 0;
		var i = t.return;
		try {
			if (Dc(e, i, t, n, Z)) {
				rd = 1, Sc(e, Ii(n, e.current)), X = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw X = i, t;
			rd = 1, Sc(e, Ii(n, e.current)), X = null;
			return;
		}
		t.flags & 32768 ? (K || r === 1 ? e = !0 : ed || Z & 536870912 ? e = !1 : ($u = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = To.current, r !== null && r.tag === 13 && (r.flags |= 16384))), $d(t, e)) : Qd(t);
	}
	function Qd(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				$d(t, $u);
				return;
			}
			e = t.return;
			var n = hl(t.alternate, t, nd);
			if (n !== null) {
				X = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				X = t;
				return;
			}
			X = t = e;
		} while (t !== null);
		rd === 0 && (rd = 5);
	}
	function $d(e, t) {
		do {
			var n = gl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, X = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				X = e;
				return;
			}
			X = e = n;
		} while (e !== null);
		rd = 6, X = null;
	}
	function ef(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			lf();
		while (_d !== 0);
		if (Y & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Zu && (X = Zu = null, Z = 0), yd = t, vd = e, bd = n, Sd = a, Cd = r, tf(e, t, n, s, c, l, f);
		}
	}
	function tf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (xd = s, s |= _i, ct(e, n, s, r, i, a), Td = null, (n & 335544064) === n ? (Ed = Aa(e), r = 10262) : (Ed = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, vf(ze, function() {
			return uf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Il = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = R.T, R.T = null, i = z.p, z.p = 2, a = Y, Y |= 4;
			try {
				uu(e, t, n);
			} finally {
				Y = a, z.p = i, R.T = r;
			}
		}
		_d = 1, Il ? wd = Mp(o, e.containerInfo, Ed, af, of, rf, sf, uf, nf, null, null) : (af(), of(), sf());
	}
	function nf(e) {
		if (_d !== 0) {
			var t = vd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function rf() {
		_d === 3 && (_d = 0, ju(yd, vd), _d = 4);
	}
	function af() {
		if (_d === 1) {
			_d = 0;
			var e = vd, t = yd, n = bd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = R.T, R.T = null;
				var i = z.p;
				z.p = 2;
				var a = Y;
				Y |= 4;
				try {
					su = cu = !1, Du(t, e, n), n = cp;
					var o = Vr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Br(s.ownerDocument.documentElement, s)) {
						if (c !== null && Hr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = zr(s, h), v = zr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					Y = a, z.p = i, R.T = r;
				}
			}
			e.current = t, _d = 2;
		}
	}
	function of() {
		if (_d === 2) {
			_d = 0;
			var e = vd, t = yd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = R.T, R.T = null;
				var r = z.p;
				z.p = 2;
				var i = Y;
				Y |= 4;
				try {
					fu(e, t.alternate, t);
				} finally {
					Y = i, z.p = r, R.T = n;
				}
			}
			_d = 3;
		}
	}
	function sf() {
		if (_d === 4 || _d === 3) {
			_d = 0;
			var e = wd;
			wd = null, Pe();
			var t = vd, n = yd, r = bd, i = Cd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? _d = 5 : (_d = 0, yd = vd = null, cf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (gd = null), pt(r), n = n.stateNode, Ge && typeof Ge.onCommitFiberRoot == "function") try {
				Ge.onCommitFiberRoot(We, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = R.T, a = z.p, z.p = 2, R.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					R.T = n, z.p = a;
				}
			}
			if (i = Td, o = Ed, Ed = null, i !== null && (Td = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			bd & 3 && lf(), Tf(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Od ? Dd++ : (Dd = 0, Od = t) : (Dd = 0, Od = null), Ef(0, !1);
		}
	}
	function cf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Da(t)));
	}
	function lf() {
		return wd !== null && (wd.skipTransition(), wd = null), af(), of(), sf(), uf();
	}
	function uf() {
		if (_d !== 5) return !1;
		var e = vd, t = xd;
		xd = 0;
		var n = pt(bd), r = R.T, a = z.p;
		try {
			z.p = 32 > n ? 32 : n, R.T = null, n = Sd, Sd = null;
			var o = vd, s = bd;
			if (_d = 0, yd = vd = null, bd = 0, Y & 6) throw Error(i(331));
			var c = Y;
			if (Y |= 4, Ku(o.current), Ru(o, o.current, s, n), Y = c, Ef(0, !1), Ge && typeof Ge.onPostCommitFiberRoot == "function") try {
				Ge.onPostCommitFiberRoot(We, o);
			} catch {}
			return !0;
		} finally {
			z.p = a, R.T = r, cf(e, t);
		}
	}
	function df(e, t, n) {
		t = Ii(n, t), t = wc(e.stateNode, t, 2), e = fo(e, t, 2), e !== null && (st(e, 2), Tf(e));
	}
	function ff(e, t, n) {
		if (e.tag === 3) df(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				df(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (gd === null || !gd.has(r))) {
					e = Ii(n, e), n = Tc(2), r = fo(t, n, 2), r !== null && (Ec(n, r, t, e), st(r, 2), Tf(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function pf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Xu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (td = !0, i.add(n), e = mf.bind(null, e, t, n), t.then(e, e));
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Zu === e && (Z & n) === n && (rd === 4 || rd === 3 && (Z & 62914560) === Z && 300 > Fe() - fd ? Y & 2 ? od |= n : zd(e, 0) : od |= n, cd === Z && (cd = 0)), Tf(e);
	}
	function hf(e, t) {
		t === 0 && (t = at()), e = xi(e, t), e !== null && (st(e, t), Tf(e));
	}
	function gf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), hf(e, n);
	}
	function _f(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), hf(e, n);
	}
	function vf(e, t) {
		return je(e, t);
	}
	var yf = null, bf = null, xf = !1, Sf = !1, Cf = !1, wf = 0;
	function Tf(e) {
		e !== bf && e.next === null && (bf === null ? yf = bf = e : bf = bf.next = e), Sf = !0, xf || (xf = !0, Mf());
	}
	function Ef(e, t) {
		if (!Cf && Sf) {
			Cf = !0;
			do
				for (var n = !1, r = yf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - qe(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, jf(r, a));
						} else a = Z, a = tt(r, r === Zu ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || nt(r, a) || (n = !0, jf(r, a));
					}
					r = r.next;
				}
			while (n);
			Cf = !1;
		}
	}
	function Df() {
		Of();
	}
	function Of() {
		Sf = xf = !1;
		var e = 0;
		wf !== 0 && hp() && (e = wf);
		for (var t = Fe(), n = null, r = yf; r !== null;) {
			var i = r.next, a = kf(r, t);
			a === 0 ? (r.next = null, n === null ? yf = i : n.next = i, i === null && (bf = n)) : (n = r, (e !== 0 || a & 3) && (Sf = !0)), r = i;
		}
		_d !== 0 && _d !== 5 || Ef(e, !1), wf !== 0 && (wf = 0);
	}
	function kf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - qe(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = it(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Zu, n = Z, n = tt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Q === 2 || Q === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Me(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || nt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Me(r), pt(n)) {
				case 2:
				case 8:
					n = Re;
					break;
				case 32:
					n = ze;
					break;
				case 268435456:
					n = Ve;
					break;
				default: n = ze;
			}
			return r = Af.bind(null, e), n = je(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Me(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Af(e, t) {
		if (_d !== 0 && _d !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (lf() && e.callbackNode !== n) return null;
		var r = Z;
		return r = tt(e, e === Zu ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Nd(e, r, t), kf(e, Fe()), e.callbackNode != null && e.callbackNode === n ? Af.bind(null, e) : null);
	}
	function jf(e, t) {
		if (lf()) return null;
		Nd(e, t, !0);
	}
	function Mf() {
		bp(function() {
			Y & 6 ? je(Le, Df) : Of();
		});
	}
	function Nf() {
		if (wf === 0) {
			var e = Na;
			e === 0 && (e = Ze, Ze <<= 1, !(Ze & 261888) && (Ze = 256)), wf = e;
		}
		return wf;
	}
	function Pf(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : fn(e);
	}
	function Ff(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Pf((i[vt] || null).action), o = r.submitter;
			o && (t = (t = o[vt] || null) ? Pf(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Pn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (wf !== 0) {
								var e = new FormData(i, o);
								Xs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), Xs(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var If = 0; If < ci.length; If++) {
		var Lf = ci[If];
		li(Lf.toLowerCase(), "on" + (Lf[0].toUpperCase() + Lf.slice(1)));
	}
	li(ei, "onAnimationEnd"), li(ti, "onAnimationIteration"), li(ni, "onAnimationStart"), li("dblclick", "onDoubleClick"), li("focusin", "onFocus"), li("focusout", "onBlur"), li(ri, "onTransitionRun"), li(ii, "onTransitionStart"), li(ai, "onTransitionCancel"), li(oi, "onTransitionEnd"), It("onMouseEnter", ["mouseout", "mouseover"]), It("onMouseLeave", ["mouseout", "mouseover"]), It("onPointerEnter", ["pointerout", "pointerover"]), It("onPointerLeave", ["pointerout", "pointerover"]), Ft("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ft("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ft("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Ft("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ft("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ft("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Rf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), zf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Rf));
	function Bf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						mi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						mi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function $(e, t) {
		var n = t[bt];
		n === void 0 && (n = t[bt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Wf(t, e, 2, !1), n.add(r));
	}
	function Vf(e, t, n) {
		var r = 0;
		t && (r |= 4), Wf(n, e, r, t);
	}
	var Hf = "_reactListening" + Math.random().toString(36).slice(2);
	function Uf(e) {
		if (!e[Hf]) {
			e[Hf] = !0, Nt.forEach(function(t) {
				t !== "selectionchange" && (zf.has(t) || Vf(t, !1, e), Vf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Hf] || (t[Hf] = !0, Vf("selectionchange", !1, t));
		}
	}
	function Wf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !Cn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Gf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Dt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		bn(function() {
			var r = a, i = hn(n), s = [];
			a: {
				var c = si.get(e);
				if (c !== void 0) {
					var l = Pn, u = e;
					switch (e) {
						case "keypress": if (kn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Qn;
							break;
						case "focusin":
							u = "focus", l = Un;
							break;
						case "focusout":
							u = "blur", l = Un;
							break;
						case "beforeblur":
						case "afterblur":
							l = Un;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Vn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Hn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = tr;
							break;
						case ei:
						case ti:
						case ni:
							l = Wn;
							break;
						case oi:
							l = nr;
							break;
						case "scroll":
						case "scrollend":
							l = In;
							break;
						case "wheel":
							l = rr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Gn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = $n;
							break;
						case "submit":
							l = er;
							break;
						case "toggle":
						case "beforetoggle": l = ir;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = xn(m, p), g != null && d.push(Kf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== mn && (u = n.relatedTarget || n.fromElement) && (Dt(u) || u[yt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Dt(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Vn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = $n, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : kt(c), h = l == null ? u : kt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Dt(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Jf) : null, c !== null && Yf(s, u, c, d, !1), l !== null && f !== null && Yf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? kt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Cr;
					else if (vr(c)) {
						if (wr) _ = Nr;
						else {
							_ = jr;
							var v = Ar;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && ln(r.elementType) && (_ = Cr) : _ = Mr;
					if (_ &&= _(e, r)) {
						yr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? kt(r) : window, e) {
					case "focusin":
						(vr(v) || v.contentEditable === "true") && (Wr = v, Gr = r, Kr = null);
						break;
					case "focusout":
						Kr = Gr = Wr = null;
						break;
					case "mousedown":
						qr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						qr = !1, Jr(s, n, i);
						break;
					case "selectionchange": if (Ur) break;
					case "keydown":
					case "keyup": Jr(s, n, i);
				}
				var y;
				if (or) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else mr ? fr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (lr && n.locale !== "ko" && (mr || b !== "onCompositionStart" ? b === "onCompositionEnd" && mr && (y = On()) : (Tn = i, En = "value" in Tn ? Tn.value : Tn.textContent, mr = !0)), v = qf(r, b), 0 < v.length && (b = new Kn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = pr(n), y !== null && (b.data = y)))), (y = cr ? hr(e, n) : gr(e, n)) && (b = qf(r, "onBeforeInput"), 0 < b.length && (v = new Kn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Ff(s, e, r, n, i);
			}
			Bf(s, t);
		});
	}
	function Kf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function qf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = xn(e, n), i != null && r.unshift(Kf(e, i, a)), i = xn(e, t), i != null && r.push(Kf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Jf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Yf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = xn(n, a), l != null && o.unshift(Kf(n, l, c))) : i || (l = xn(n, a), l != null && o.push(Kf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Xf = /\r\n?/g, Zf = /\u0000|\uFFFD/g;
	function Qf(e) {
		return (typeof e == "string" ? e : "" + e).replace(Xf, "\n").replace(Zf, "");
	}
	function $f(e, t) {
		return t = Qf(t), Qf(e) === t;
	}
	function ep(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || an(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && an(e, "" + r);
				else return;
				break;
			case "className":
				Ut(e, "class", r);
				break;
			case "tabIndex":
				Ut(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Ut(e, n, r);
				break;
			case "style":
				cn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Ut(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = fn(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && ep(e, t, "name", a.name, a, null), ep(e, t, "formEncType", a.formEncType, a, null), ep(e, t, "formMethod", a.formMethod, a, null), ep(e, t, "formTarget", a.formTarget, a, null)) : (ep(e, t, "encType", a.encType, a, null), ep(e, t, "method", a.method, a, null), ep(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = fn(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = pn);
				return;
			case "onScroll":
				r != null && $("scroll", e);
				return;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = fn(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				$("beforetoggle", e), $("toggle", e), Ht(e, "popover", r);
				break;
			case "xlinkActuate":
				Wt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Wt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Wt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Wt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Wt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Wt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Wt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Wt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Wt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Ht(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = un.get(n) || n, Ht(e, n, r);
			else return;
		}
		W = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				cn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") an(e, r);
				else if (typeof r == "number" || typeof r == "bigint") an(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && $("scroll", e);
				return;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = pn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Pt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[vt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					W = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Ht(e, n, r);
				}
				return;
		}
		W = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				$("error", e), $("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: ep(e, t, o, s, n, null);
					}
				}
				a && ep(e, t, "srcSet", n.srcSet, n, null), r && ep(e, t, "src", n.src, n, null);
				return;
			case "input":
				$("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: ep(e, t, r, d, n, null);
					}
				}
				$t(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in $("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: ep(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && tn(e, !!r, n, !0) : tn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in $("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: ep(e, t, s, c, n, null);
				}
				rn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: ep(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				$("beforetoggle", e), $("toggle", e), $("cancel", e), $("close", e);
				break;
			case "iframe":
			case "object":
				$("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Rf.length; r++) $(Rf[r], e);
				break;
			case "image":
				$("error", e), $("load", e);
				break;
			case "details":
				$("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": $("error", e), $("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: ep(e, t, u, r, n, null);
				}
				return;
			default: if (ln(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && ep(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || ep(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (W = !0), o = m;
							break;
						case "name":
							m !== f && (W = !0), a = m;
							break;
						case "checked":
							m !== f && (W = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (W = !0), d = m;
							break;
						case "value":
							m !== f && (W = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (W = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && ep(e, t, p, m, r, f);
					}
				}
				Qt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || ep(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (W = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (W = !0), c = o;
						break;
					case "multiple": o !== l && (W = !0), s = o;
					default: o !== l && ep(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? tn(e, !!n, n ? [] : "", !1) : tn(e, !!n, t, !0)) : tn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: ep(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (W = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (W = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && ep(e, t, s, a, r, o);
				}
				nn(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: ep(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (W = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: ep(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && ep(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: ep(e, t, u, p, r, m);
				}
				return;
			default: if (ln(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && ep(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || ep(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[_t] = r, n[vt] = t, np(n, e, t), jt(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[wt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), m(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), m(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		m(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		m(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && m(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), m(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), m(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return m(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		m(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Dt(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (m(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (m(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		m(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), Et(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[wt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && ep(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === pn && (e.onclick = null), Et(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Et(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = z.d;
	z.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = Ld();
		return e || t;
	}
	function Cm(e) {
		var t = Ot(e);
		t !== null && t.tag === 5 && t.type === "form" ? Qs(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = Zt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), jt(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Zt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Zt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Zt(n.imageSizes) + "\"]")) : i += "[href=\"" + Zt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Tt] = !0, o.onload = o.onerror = function() {
					Mt(o);
				}), jt(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Zt(r) + "\"][href=\"" + Zt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), jt(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = At(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					jt(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = At(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), jt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = At(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), jt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = ve.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = At(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = At(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = At(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + Zt(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Tt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Tt] = !0, t.onload = t.onerror = Mt.bind(null, t), np(t, "link", n), jt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + Zt(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Zt(n.href) + "\"]");
				if (r) return t.instance = r, jt(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), jt(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, jt(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), jt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, jt(a), a) : (r = n, (a = vm.get(o)) && (r = D({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), jt(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[wt] || a[_t] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, jt(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), jt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: F,
		Provider: null,
		Consumer: null,
		_currentValue: B,
		_currentValue2: B,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ot(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ot(0), this.hiddenUpdates = ot(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ei(3, null, null, t), e.current = a, a.stateNode = e, t = Ea(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, co(a), e;
	}
	function uh(e) {
		return e ? (e = wi, e) : wi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = uo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = fo(e, r, t), n !== null && (Md(n, e, t), po(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = xi(e, 67108864);
			t !== null && Md(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = kd();
			t = ft(t);
			var n = xi(e, t);
			n !== null && Md(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = R.T;
		R.T = null;
		var a = z.p;
		try {
			z.p = 2, yh(e, t, n, r);
		} finally {
			z.p = a, R.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = R.T;
		R.T = null;
		var a = z.p;
		try {
			z.p = 8, yh(e, t, n, r);
		} finally {
			z.p = a, R.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Gf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = Ot(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = et(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - qe(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Tf(a), !(Y & 6) && (md = Fe() + 500, Ef(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = xi(a, 2), s !== null && Md(s, a, 2), Ld(), ph(a, 2);
					}
					if (a = bh(r), a === null && Gf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Gf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = hn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Dt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ie()) {
				case Le: return 2;
				case Re: return 8;
				case ze:
				case Be: return 32;
				case Ve: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Ot(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Dt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, ht(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, ht(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				mn = r, n.target.dispatchEvent(r), mn = null;
			} else return t = Ot(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = Ot(n);
				a !== null && (e.splice(t, 3), t -= 3, Xs(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[vt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[vt] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, kd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), Ld(), t[yt] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = mt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	z.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = u(t), e = e === null ? null : f(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: R,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			We = Jh.inject(qh), Ge = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = yc, s = bc, c = xc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[yt] = t.current, Uf(e), new Wh(t);
	};
})), _ = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = g();
})), v = {
	not_connected: {
		category: "connection",
		retryable: !0
	},
	service_failed: {
		category: "rejected",
		retryable: !0
	},
	transport_unknown: {
		category: "connection",
		retryable: !1
	},
	unsupported: {
		category: "unsupported",
		retryable: !1
	},
	invalid_input: {
		category: "invalid_input",
		retryable: !1
	}
}, y = class extends Error {
	code;
	category;
	retryable;
	domain;
	service;
	entityId;
	translationKey;
	providerCode;
	constructor(e, t, n = {}) {
		super(t), this.name = "HaActionError", this.code = e;
		let r = v[e];
		this.category = r.category, this.retryable = r.retryable, this.domain = n.domain, this.service = n.service, this.entityId = n.entityId, this.translationKey = n.translationKey, this.providerCode = n.providerCode;
	}
}, b = (e) => typeof e == "object" && !!e && !Array.isArray(e), x = (e) => typeof e == "number" && Number.isFinite(e) ? e : void 0, S = (e) => typeof e == "string" && e.length > 0 ? e : void 0, C = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
function w(e) {
	if (!Array.isArray(e)) return;
	let t = [...new Set(e.filter((e) => typeof e == "string" && e.length > 0))];
	return t.length ? t : void 0;
}
function T(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (t === "℉" || /^(?:°?f|fahrenheit)$/i.test(t)) return "°F";
	if (t === "℃" || /^(?:°?c|celsius)$/i.test(t)) return "°C";
}
function E(e, t) {
	if (typeof e == "object" && e || typeof e == "function") try {
		return e[t];
	} catch {
		return;
	}
}
function D(e) {
	let t = E(e, "translation_key"), n = E(e, "code");
	return {
		...typeof t == "string" ? { translationKey: t } : {},
		...typeof n == "string" ? { providerCode: n } : {}
	};
}
// packages/core/src/ha/picture.ts
var O = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function k(e) {
	if (!e || O.has(e.state)) return;
	let t = e.attributes.entity_picture;
	return typeof t == "string" && t.trim() !== "" ? t.trim() : void 0;
}
function A(e) {
	let t = /^([a-z][a-z0-9+.-]*):/i.exec(e)?.[1]?.toLowerCase();
	return t === "http" || t === "https" || t === "blob" || t === "data" && /^data:image\/[a-z0-9.+-]+[;,]/i.test(e);
}
function j(e, t) {
	if (!e) return;
	if (/^(data|blob):/i.test(e)) return A(e) ? e : void 0;
	if (e.startsWith("//")) return;
	let n = t ? t(e) : e;
	if (n && !n.startsWith("//")) return /^[a-z][a-z0-9+.-]*:/i.test(n) ? A(n) ? n : void 0 : n.startsWith("/") ? n : void 0;
}
function M(e, t) {
	if (!t) return e;
	try {
		return new URL(e, t).href;
	} catch {
		return;
	}
}
// packages/core/src/ha/store.ts
var N = 3, P = /* @__PURE__ */ new Set(["lock", "alarm_control_panel"]);
function F(e, t) {
	let n = /* @__PURE__ */ new Set(), r = {
		status: "idle",
		entities: {},
		generation: 0
	}, i = t && Object.keys(t).length > 0 ? t : void 0, a = 0, l = [], u, d = 0, f, p, m, h = (e) => {
		r = {
			...r,
			...e
		};
		for (let e of [...n]) try {
			e();
		} catch {}
	}, g = (e) => {
		let t = u;
		u = void 0, t && (e === void 0 ? t.resolve() : t.reject(e));
	}, _ = () => {
		a += 1, m = void 0;
		for (let e of l.splice(0)) try {
			e();
		} catch {}
	}, v = () => {
		_(), f = void 0, h({
			status: "error",
			entities: {},
			error: ee(),
			lastActionError: void 0,
			generation: r.generation + 1
		}), s("store:error", { generation: r.generation }), g(ee());
	}, x = () => {
		if (u) return u.promise;
		if (r.status === "connected") return Promise.resolve();
		let t, n, o = new Promise((e, r) => {
			t = e, n = r;
		});
		u = {
			promise: o,
			resolve: t,
			reject: n
		}, _(), f = void 0;
		let d = a, p = i;
		i = void 0, h({
			status: "connecting",
			entities: p ?? {},
			error: void 0,
			lastActionError: void 0,
			generation: r.generation + 1
		});
		let y = (e) => {
			if (d !== a) return;
			let t = m;
			if (t?.entityId) {
				let n = r.entities[t.entityId], i = e[t.entityId];
				i && (!n || n.state !== i.state || n.last_updated !== i.last_updated) && (m = void 0, s("action:state", {
					seq: t.seq,
					state: i.state
				}), c("action:settled", { seq: t.seq }));
			}
			r.status === "connected" ? h({ entities: e }) : (h({
				status: "connected",
				entities: e,
				error: void 0,
				generation: r.generation + 1
			}), s("store:connected", { generation: r.generation }), c("store:painted", { generation: r.generation }), g());
		}, b = (e) => {
			if (d === a) {
				if (e === "error") v();
				else if (e === "disconnected") {
					if (r.status === "disconnected") return;
					f = void 0, h({
						status: "disconnected",
						entities: {},
						lastActionError: void 0,
						generation: r.generation + 1
					}), s("store:disconnected", { generation: r.generation });
				} else r.status !== "connected" && h({
					status: "connecting",
					generation: r.generation + 1
				});
			}
		};
		try {
			e.subscribeConnection && l.push(e.subscribeConnection(b)), l.push(e.subscribeEntities(y)), p && d === a && r.status === "connecting" && (h({
				status: "connected",
				entities: p,
				error: void 0,
				generation: r.generation + 1
			}), s("store:connected", {
				generation: r.generation,
				seeded: !0
			}), c("store:painted", {
				generation: r.generation,
				seeded: !0
			}), g());
		} catch {
			d === a && v();
		}
		return o;
	}, S = () => {
		_(), g(), r.status !== "disconnected" && r.status !== "idle" && (f = void 0, h({
			status: "disconnected",
			entities: {},
			error: void 0,
			lastActionError: void 0,
			generation: r.generation + 1
		}), s("store:disconnected", { generation: r.generation }));
	}, C = async (e, t, n, i, a) => {
		let c = r.generation, l = i ? ++d : 0, u = i && o(), g = (e) => (u && (s("action:error", {
			seq: l,
			code: e.code
		}), m?.seq === l && (m = void 0)), i && l === d && c === r.generation && (f = a && e.retryable ? a : void 0, p = t.entityId ? {
			entityId: t.entityId,
			entity: r.entities[t.entityId]
		} : void 0, h({ lastActionError: e })), e);
		if (r.status !== "connected") throw g(new y("not_connected", "Home Assistant is not connected", t));
		u && (m && s("action:superseded", { seq: m.seq }), m = {
			seq: l,
			entityId: t.entityId
		}, s("action:start", {
			seq: l,
			label: e,
			entityId: t.entityId
		}));
		let _;
		try {
			_ = await n();
		} catch (n) {
			let i = c !== r.generation || n === N || E(n, "code") === N;
			throw g(new y(i ? "transport_unknown" : "service_failed", i ? `Home Assistant connection lost during ${e}; outcome is unknown` : `Home Assistant rejected ${e}`, {
				...t,
				...D(n)
			}));
		}
		if (c !== r.generation) throw g(new y("transport_unknown", `Home Assistant connection changed during ${e}; outcome is unknown`, t));
		return u && s("action:ack", {
			seq: l,
			label: e
		}), i && l === d && (f = void 0, r.lastActionError && h({ lastActionError: void 0 })), _;
	}, w = (t) => (n, r, i = {}, a = {}) => {
		if (!b(i) || !ne(a)) {
			let e = new y("invalid_input", "Invalid Home Assistant service input", {
				domain: n,
				service: r
			});
			return t && (f = void 0, h({ lastActionError: e })), Promise.reject(e);
		}
		let o = {
			domain: n,
			service: r,
			entityId: re(i, a)
		}, s = () => Object.keys(a).length > 0 ? e.callService(n, r, i, a) : e.callService(n, r, i), c, l = () => C(`${n}.${r}`, o, s, t, c);
		return t && !Object.prototype.hasOwnProperty.call(i, "code") && !P.has(n) && (c = l), l();
	}, T = () => r.status === "connected" && f !== void 0 && (!p || r.entities[p.entityId] === p.entity);
	return {
		getSnapshot: () => r,
		subscribe(e) {
			return n.add(e), () => {
				n.delete(e);
			};
		},
		connect: x,
		disconnect: S,
		callService: w(!0),
		clearActionError() {
			f = void 0, r.lastActionError && h({ lastActionError: void 0 });
		},
		canRetryLastAction: () => T(),
		retryLastAction() {
			return f && T() ? f() : Promise.reject(new y("unsupported", "No Home Assistant action is available to retry"));
		},
		query: w(!1),
		callApi: (t, n = {}) => {
			if (typeof t != "string" || !b(n)) return Promise.reject(new y("invalid_input", "Invalid Home Assistant command input"));
			let r = e.sendMessage;
			return r ? C(t, { service: t }, () => r(t, n), !1) : Promise.reject(new y("unsupported", "Home Assistant transport does not support generic commands", { service: t }));
		},
		resolveUrl: (t) => j(t, e.resolveUrl?.bind(e))
	};
}
function ee() {
	return /* @__PURE__ */ Error("Home Assistant connection failed");
}
var te = /* @__PURE__ */ new Set([
	"entity_id",
	"device_id",
	"area_id",
	"floor_id",
	"label_id"
]);
function ne(e) {
	return !b(e) || Object.keys(e).some((e) => e !== "target" && e !== "returnResponse") || e.returnResponse !== void 0 && typeof e.returnResponse != "boolean" ? !1 : e.target === void 0 ? !0 : b(e.target) ? Object.entries(e.target).every(([e, t]) => te.has(e) && (typeof t == "string" || Array.isArray(t) && t.every((e) => typeof e == "string"))) : !1;
}
function re(e, t) {
	return typeof e.entity_id == "string" ? e.entity_id : typeof t.target?.entity_id == "string" ? t.target.entity_id : void 0;
}
// node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var ie = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), ae = /* @__PURE__ */ e(((e, t) => {
	t.exports = ie();
})), I = p(), L = ae(), oe = (0, I.createContext)(null), se = (0, I.createContext)(void 0), ce = /* @__PURE__ */ new WeakMap();
function le(e) {
	let t = ce.get(e) ?? { count: 0 };
	t.count += 1, ce.set(e, t), t.count === 1 && e.connect().catch(() => void 0);
}
function ue(e) {
	let t = ce.get(e);
	t && (--t.count, t.count > 0 || (ce.delete(e), e.disconnect()));
}
function de({ store: e, moreInfo: t, children: n }) {
	let r = (0, I.useRef)(null), i = (0, I.useRef)(0);
	return (0, I.useEffect)(() => {
		let t = r.current;
		t && t !== e && (r.current = null, ue(t)), r.current !== e && (r.current = e, le(e));
		let n = ++i.current;
		return () => {
			queueMicrotask(() => {
				i.current === n && r.current === e && (r.current = null, ue(e));
			});
		};
	}, [e]), /* @__PURE__ */ (0, L.jsx)(oe.Provider, {
		value: e,
		children: /* @__PURE__ */ (0, L.jsx)(se.Provider, {
			value: t,
			children: n
		})
	});
}
function fe() {
	return (0, I.useContext)(se);
}
function R() {
	let e = (0, I.useContext)(oe);
	if (!e) throw Error("useHaStore must be used inside HaProvider");
	return e;
}
function z(e) {
	let t = R(), n = () => e(t.getSnapshot());
	return (0, I.useSyncExternalStore)(t.subscribe, n, n);
}
function B(e) {
	return z((t) => t.entities[e]);
}
function pe(e) {
	let t = R(), n = e.join("\n"), r = (0, I.useRef)(null), i = () => {
		let e = t.getSnapshot().entities, i = n === "" ? [] : n.split("\n").map((t) => e[t]), a = r.current;
		return a && a.key === n && a.entities.every((e, t) => e === i[t]) ? a.entities : (r.current = {
			key: n,
			entities: i
		}, i);
	};
	return (0, I.useSyncExternalStore)(t.subscribe, i, i);
}
function me() {
	return z((e) => e.status);
}
function he() {
	return z((e) => e.generation);
}
// packages/core/src/entities/clock.ts
function ge(e, { locale: t, hourCycle: n, timeZone: r } = {}) {
	let i = new Intl.DateTimeFormat(t, {
		weekday: "long",
		month: "long",
		day: "numeric",
		timeZone: r
	}).format(e), a = new Intl.DateTimeFormat(t, {
		hour: "numeric",
		hourCycle: n,
		timeZone: r
	}).resolvedOptions().hourCycle, o = a === "h23" || a === "h24", s = new Intl.DateTimeFormat(t, {
		hour: o ? "2-digit" : "numeric",
		minute: "2-digit",
		hourCycle: n,
		timeZone: r
	}).formatToParts(e), c = s.filter((e) => e.type !== "dayPeriod").map((e) => e.value).join("").trim(), l = s.find((e) => e.type === "dayPeriod")?.value;
	return {
		date: i,
		day: new Intl.DateTimeFormat("en-CA", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			timeZone: r
		}).format(e),
		time: c,
		period: l,
		twentyFour: o
	};
}
var V = /* @__PURE__ */ new Map();
function H(e, t) {
	if (t) return t;
	let n = e ?? "", r = V.get(n);
	if (!r) {
		let t = new Intl.DateTimeFormat(e, { hour: "numeric" }).resolvedOptions().hourCycle;
		r = t === "h23" || t === "h24" ? "h23" : "h12", V.set(n, r);
	}
	return r;
}
var _e = {
	am: "AM",
	pm: "PM"
};
function ve(e, t, n = H()) {
	let r = (Math.trunc(e) % 24 + 24) % 24, i = String(Math.trunc(t)).padStart(2, "0");
	return n === "h23" ? { time: `${String(r).padStart(2, "0")}:${i}` } : {
		time: `${r % 12 || 12}:${i}`,
		period: r < 12 ? _e.am : _e.pm
	};
}
function ye(e, t, n = H()) {
	let { time: r, period: i } = ve(e, t, n);
	return i ? `${r}\u00a0${i}` : r;
}
var be = (e, t = H()) => ye(e.getHours(), e.getMinutes(), t);
function xe(e, t = H()) {
	let n = (Math.trunc(e) % 24 + 24) % 24;
	return t === "h23" ? String(n).padStart(2, "0") : `${n % 12 || 12}${n < 12 ? _e.am : _e.pm}`;
}
function Se(e, t, n = H()) {
	let r = be(e, n);
	return e >= new Date(t.getFullYear(), t.getMonth(), t.getDate()) ? r : e >= new Date(t.getFullYear(), t.getMonth(), t.getDate() - 6) ? `${e.toLocaleDateString("en-US", { weekday: "short" })} ${r}` : e.toLocaleDateString("en-US", {
		day: "numeric",
		month: "short"
	});
}
var Ce = /(?: · )?(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[ \u00a0])?\d{1,2}:\d\d(?:\u00a0[AP]M)?(?:[–-]\d{1,2}:\d\d(?:\u00a0[AP]M)?)?/g;
function we(e) {
	let t = [], n = 0;
	for (let r of e.matchAll(Ce)) r.index > n && t.push({ text: e.slice(n, r.index) }), t.push({
		text: r[0],
		time: !0
	}), n = r.index + r[0].length;
	return n < e.length && t.push({ text: e.slice(n) }), t;
}
// packages/core/src/ha/time.ts
function Te(e) {
	if (typeof e != "string" || !e) return;
	let t = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/.exec(e);
	if (!t) return;
	let n = Number(t[1]), r = Number(t[2]), i = Number(t[3]), a = Number(t[4]), o = Number(t[5]), s = t[6] == null ? 0 : Number(t[6]), c = t[7], l = !c || c === "Z" ? void 0 : [Number(c.slice(1, 3)), Number(c.slice(4, 6))], u = new Date(Date.UTC(n, r - 1, i));
	if (u.getUTCFullYear() !== n || u.getUTCMonth() !== r - 1 || u.getUTCDate() !== i || a > 23 || o > 59 || s > 59 || l && (l[0] > 23 || l[1] > 59)) return;
	let d = new Date(e);
	if (!Number.isNaN(d.getTime()) && (c || d.getFullYear() === n && d.getMonth() === r - 1 && d.getDate() === i && d.getHours() === a && d.getMinutes() === o && d.getSeconds() === s)) return d;
}
function U(e, t = /* @__PURE__ */ new Date(), n) {
	let r = Te(e);
	if (r) return Se(r, t, H(void 0, n));
}
// packages/core/src/ha/mappers/light.ts
var Ee = (e) => e >= 0 && e <= 255 ? Math.min(100, Math.max(1, Math.round(e / 255 * 100))) : void 0, De = /* @__PURE__ */ new Set([
	"brightness",
	"color_temp",
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww",
	"white"
]), Oe = /* @__PURE__ */ new Set([
	"hs",
	"xy",
	"rgb",
	"rgbw",
	"rgbww"
]);
function ke(e) {
	if (!Array.isArray(e) || e.length !== 2) return;
	let [t, n] = e.map(x);
	return t != null && n != null && t >= 0 && t <= 360 && n >= 0 && n <= 100 ? [t, n] : void 0;
}
function Ae(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = C(r.supported_color_modes), a = i.some((e) => De.has(e)), o = i.includes("color_temp"), s = i.some((e) => Oe.has(e)), c = e?.state === "on" || e?.state === "off" || e?.state === "unknown" ? e.state : "unavailable", l = c === "on" || c === "off", u = x(r.brightness), d = l && a && u != null ? Ee(u) : void 0, f = S(r.friendly_name), p = U(e?.last_changed, n.now, n.hourCycle), m = o ? x(r.min_color_temp_kelvin) : void 0, h = o ? x(r.max_color_temp_kelvin) : void 0, g = m == null || h == null || m <= h, _ = g ? m : void 0, v = g ? h : void 0, y = l && o ? x(r.color_temp_kelvin) : void 0, b = y != null && g && (_ == null || y >= _) && (v == null || y <= v) ? y : void 0, w = l && s && S(r.color_mode) !== "color_temp" ? ke(r.hs_color) : void 0;
	return {
		entityId: t,
		name: n.name ?? f ?? t,
		area: n.area,
		state: c,
		...r.assumed_state === !0 && { assumedState: !0 },
		supportsBrightness: a,
		brightness: d,
		supportsColorTemp: o,
		kelvin: b,
		minKelvin: _,
		maxKelvin: v,
		supportsColor: s,
		hs: w,
		lastChanged: p,
		lastSeen: c === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/mappers/climate.ts
var je = /* @__PURE__ */ new Set([
	"off",
	"heat",
	"cool",
	"heat_cool",
	"auto",
	"dry",
	"fan_only"
]), Me = /* @__PURE__ */ new Set([
	"heating",
	"cooling",
	"idle",
	"off",
	"drying",
	"fan"
]), Ne = 7, Pe = 35, Fe = 45, Ie = 95, Le = {
	"°C": .5,
	"°F": 1
}, Re = {
	TURN_OFF: 128,
	TURN_ON: 256
};
function ze(...e) {
	for (let t of e) {
		let e = x(t);
		if (e != null) return e;
	}
}
function Be(e) {
	return e != null && e >= 0 && e <= 100 ? e : void 0;
}
function Ve(e) {
	return (w(e) ?? []).filter((e) => je.has(e));
}
function He(e) {
	return typeof e == "string" && Me.has(e) ? e : void 0;
}
function Ue(e) {
	return e && je.has(e) ? e : "unavailable";
}
function We(e, t, n) {
	let r = n === "°F" ? Fe : Ne, i = n === "°F" ? Ie : Pe;
	return e != null && t != null && e <= t ? {
		min: e,
		max: t
	} : e != null && t == null ? {
		min: e,
		max: Math.max(i, e)
	} : e == null && t != null ? {
		min: Math.min(r, t),
		max: t
	} : {
		min: r,
		max: i
	};
}
function Ge(e, t, n) {
	if (e != null && t != null && e > t) return {
		low: void 0,
		high: void 0
	};
	let r = (e) => e == null || e >= n.min && e <= n.max;
	return !r(e) || !r(t) ? {
		low: void 0,
		high: void 0
	} : {
		low: e,
		high: t
	};
}
var Ke = (e) => "current_temperature" in e || "native_current_temperature" in e;
function qe(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = Ue(e?.state), a = n.unit ?? T(r.temperature_unit) ?? T(r.native_temperature_unit) ?? T(r.unit_of_measurement) ?? T(n.systemUnit) ?? "°C", o = ((bounds) => ({ min: Math.max(bounds.min, 7), max: Math.min(bounds.max, 26) }))(We(ze(r.min_temp, r.min_temperature, r.native_min_temp), ze(r.max_temp, r.max_temperature, r.native_max_temp), a)), s = ze(r.target_temp_step, r.temperature_step, r.precision), c = s != null && s > 0 ? s : Le[a], l = Ge(ze(r.target_temp_low, r.target_temperature_low, r.native_target_temperature_low), ze(r.target_temp_high, r.target_temperature_high, r.native_target_temperature_high), o), u = ze(r.temperature, r.target_temperature, r.native_target_temperature), d = u != null && u >= o.min && u <= o.max ? u : void 0, f = S(r.friendly_name), p = U(e?.last_changed, n.now, n.hourCycle), m = i === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0, h = i !== "unavailable", g = x(r.supported_features) ?? 0;
	return {
		entityId: t,
		name: n.name ?? f ?? t,
		area: n.area,
		state: i,
		hvacModes: Ve(r.hvac_modes),
		supportsTurnOn: (g & Re.TURN_ON) !== 0,
		supportsTurnOff: (g & Re.TURN_OFF) !== 0,
		hvacAction: h ? He(S(r.hvac_action)) : void 0,
		currentTemperature: h ? ze(r.current_temperature, r.native_current_temperature) : void 0,
		...h && !Ke(r) && { reportsCurrentTemperature: !1 },
		currentHumidity: h ? Be(ze(r.current_humidity)) : void 0,
		targetTemperature: h ? d : void 0,
		targetLow: h ? l.low : void 0,
		targetHigh: h ? l.high : void 0,
		minTemp: o.min,
		maxTemp: o.max,
		step: c,
		unit: a,
		presetMode: S(r.preset_mode),
		presetModes: w(r.preset_modes),
		fanMode: S(r.fan_mode),
		fanModes: w(r.fan_modes),
		lastChanged: p,
		lastSeen: m
	};
}
// packages/core/src/ha/mappers/battery.ts
var Je = (e) => e != null && e >= 0 && e <= 100 ? e : void 0;
function Ye(e) {
	return b(e?.attributes) && typeof e?.state == "string" && e.state !== "unknown" && e.state !== "unavailable";
}
function Xe(e) {
	if (!b(e?.attributes)) return !1;
	let t = S(e.attributes.device_class);
	return t === "battery" || t == null && (e.attributes.unit_of_measurement === "%" || e.attributes.native_unit_of_measurement === "%");
}
function Ze(e) {
	if (!Ye(e) || !Xe(e) || e.state.trim() === "") return;
	let t = Number(e.state);
	return Number.isFinite(t) ? Je(t) : void 0;
}
function Qe(e) {
	return Je(x(e?.battery_level) ?? x(e?.battery));
}
// packages/core/src/ha/mappers/sensor.ts
var $e = (e) => {
	if (e && e.attributes && typeof e.attributes == "object" && !Array.isArray(e.attributes)) return e.attributes;
};
function et(e) {
	if (!e || typeof e.state != "string" || e.state === "unknown" || e.state === "unavailable" || e.state.trim().length === 0) return;
	let t = Number(e.state);
	return Number.isFinite(t) ? t : void 0;
}
function tt(e) {
	let t = $e(e);
	return T(t?.unit_of_measurement) ?? T(t?.native_unit_of_measurement);
}
function nt(e) {
	return S($e(e)?.device_class);
}
function rt(e) {
	return e != null && e >= 0 && e <= 100 ? e : void 0;
}
function it(e) {
	return $e(e) != null && typeof e?.state == "string" && e.state !== "unknown" && e.state !== "unavailable";
}
function at(e) {
	let t = nt(e), n = $e(e);
	return t === "humidity" || t == null && (n?.unit_of_measurement === "%" || n?.native_unit_of_measurement === "%");
}
function ot(e) {
	let t = S(e?.device_class);
	return t == null ? [e?.unit_of_measurement, e?.native_unit_of_measurement].some((e) => e === "%" || T(e) != null) : t === "temperature" || t === "humidity";
}
function st(e, t, n = {}) {
	let r = $e(e) ?? {}, i = it(e) ? "ok" : "unavailable", a = i === "ok" ? et(e) : void 0, o = tt(e), s = n.unit ?? o ?? "°C", c = nt(e), l = n.unit != null || o != null, u = a != null && l && (c === "temperature" || c == null && !at(e)) ? a : void 0, d = a != null && (c === "humidity" || at(e)) ? rt(a) : void 0, f = i === "ok" && it(n.humidityEntity) && at(n.humidityEntity) ? rt(et(n.humidityEntity)) : void 0, p = a != null && c === "battery" ? rt(a) : void 0, m = i === "ok" ? Qe(r) : void 0, h = i === "ok" ? Ze(n.batteryEntity) : void 0, g = S(r.friendly_name), _ = i === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0;
	return {
		entityId: t,
		name: n.name ?? g ?? t,
		area: n.area,
		state: i,
		temperature: u,
		humidity: d ?? f,
		unit: s,
		outdoor: n.outdoor,
		battery: p ?? m ?? h,
		lastUpdated: U(S(e?.last_updated), n.now, n.hourCycle),
		lastSeen: _
	};
}
// packages/core/src/ha/mappers/weather.ts
var ct = /* @__PURE__ */ new Set([
	"sunny",
	"clear-night",
	"partlycloudy",
	"cloudy",
	"fog",
	"rainy",
	"pouring",
	"snowy",
	"snowy-rainy",
	"hail",
	"lightning",
	"lightning-rainy",
	"windy",
	"windy-variant",
	"exceptional"
]);
function lt(e) {
	return typeof e == "string" && ct.has(e) ? e : void 0;
}
function ut(e) {
	if (e === "km/h" || e === "kph" || e === "kmh") return "km/h";
	if (e === "mph" || e === "mi/h") return "mph";
	if (e === "m/s" || e === "mps" || e === "ms") return "m/s";
}
function dt(e) {
	if (e === "hPa" || e === "mbar") return "hPa";
	if (e === "kPa") return "kPa";
	if (e === "inHg") return "inHg";
}
function ft(e) {
	let t = x(e);
	if (t != null && t >= 0 && t <= 360) return t;
	if (typeof e == "string") return {
		N: 0,
		NE: 45,
		E: 90,
		SE: 135,
		S: 180,
		SW: 225,
		W: 270,
		NW: 315
	}[e.trim().toUpperCase()];
}
function pt(e) {
	let t = x(e);
	return t != null && t >= 0 && t <= 100 ? t : void 0;
}
function mt(e, t) {
	if (t !== "US" || !e || typeof e.state != "string" || !e.attributes || typeof e.attributes != "object" || Array.isArray(e.attributes) || e.state === "unknown" || e.state === "unavailable" || e.state.trim().length === 0 || typeof e.attributes.device_class != "string" || e.attributes.device_class !== "aqi") return;
	let n = Number(e.state);
	return Number.isFinite(n) && n >= 0 && n <= 500 ? n : void 0;
}
function ht(e) {
	if (e && e.state !== "unknown" && e.state !== "unavailable") {
		if (e.state === "above_horizon") return !0;
		if (e.state === "below_horizon") return !1;
	}
}
function gt(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = lt(e?.state), a = i != null, o = S(r.friendly_name), s = n.temperatureUnit ?? T(r.temperature_unit) ?? T(r.native_temperature_unit) ?? "°C", c = n.windSpeedUnit ?? ut(r.wind_speed_unit) ?? ut(r.native_wind_speed_unit) ?? "km/h", l = n.pressureUnit ?? dt(r.pressure_unit) ?? dt(r.native_pressure_unit) ?? "hPa";
	return {
		entityId: t,
		name: n.name ?? o ?? t,
		state: i ?? "unavailable",
		temperature: a ? x(r.temperature) : void 0,
		apparentTemperature: a ? x(r.apparent_temperature) : void 0,
		dewPoint: a ? x(r.dew_point) : void 0,
		humidity: a ? pt(r.humidity) : void 0,
		pressure: a ? vt(r.pressure) : void 0,
		windSpeed: a ? _t(r.wind_speed) : void 0,
		windGustSpeed: a ? _t(r.wind_gust_speed) : void 0,
		windBearing: a ? ft(r.wind_bearing) : void 0,
		uvIndex: a ? _t(r.uv_index) : void 0,
		temperatureUnit: s,
		windSpeedUnit: c,
		pressureUnit: l,
		aqi: a ? mt(n.aqiEntity, n.aqiScale) : void 0,
		isDay: a ? ht(n.sunEntity) : void 0,
		lastUpdated: U(e?.last_updated ?? e?.last_reported, n.now, n.hourCycle),
		lastSeen: a ? void 0 : n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle)
	};
}
function _t(e) {
	let t = x(e);
	return t != null && t >= 0 ? t : void 0;
}
function vt(e) {
	let t = x(e);
	return t != null && t > 0 ? t : void 0;
}
function yt(e, t) {
	if (!e || typeof e != "object") return [];
	let n = e, r = n.result && typeof n.result == "object" ? n.result : void 0, i = n.response && typeof n.response == "object" ? n.response : void 0, a = (r?.response && typeof r.response == "object" ? r.response : void 0)?.[t] ?? i?.[t] ?? n[t], o = (a && typeof a == "object" ? a : void 0)?.forecast;
	return Array.isArray(o) ? o.filter((e) => !!e && typeof e == "object") : [];
}
function bt(e) {
	if (typeof e.datetime != "string") return;
	let t = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})?$/.exec(e.datetime);
	if (!t) return;
	let [, n, r, i, a, o, s, c] = t, l = Number(n), u = Number(r), d = Number(i), f = Number(a), p = Number(o), m = Number(s), h = [
		31,
		l % 4 == 0 && (l % 100 != 0 || l % 400 == 0) ? 29 : 28,
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
	if (u < 1 || u > 12 || d < 1 || d > h[u - 1] || f > 23 || p > 59 || m > 59 || c && c !== "Z" && (Number(c.slice(1, 3)) > 23 || Number(c.slice(4, 6)) > 59)) return;
	let g = new Date(e.datetime);
	if (!Number.isNaN(g.getTime()) && (c || g.getFullYear() === l && g.getMonth() === u - 1 && g.getDate() === d && g.getHours() === f && g.getMinutes() === p && g.getSeconds() === m)) return g;
}
function xt(e) {
	return Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) / 864e5;
}
function St(e, t) {
	return Math.round(xt(e) - xt(t)) * 24 + e.getHours();
}
function Ct(e) {
	return pt(e);
}
function wt(e, t, n) {
	let r = yt(e, t);
	if (n === "hourly") {
		let e = r.map(bt).find((e) => !!e);
		return r.flatMap((t) => {
			let n = lt(t.condition), r = x(t.temperature), i = bt(t), a = x(t.hour), o = i && e ? St(i, e) : void 0, s = a == null || i != null && o != null && Number.isInteger(a) && a >= 0 && (a === i.getHours() || a === o), c = o ?? (a != null && Number.isInteger(a) && a >= 0 ? a : void 0);
			return !n || r == null || !i || !s || c == null || c < 0 ? [] : [{
				hour: c,
				temperature: r,
				condition: n,
				precipitationProbability: Ct(t.precipitation_probability)
			}];
		});
	}
	return r.flatMap((e) => {
		let t = lt(e.condition), n = x(e.temperature), r = x(e.templow), i = bt(e), a = S(e.day)?.trim() || (i ? i.toLocaleDateString("en-US", { weekday: "short" }) : void 0);
		return !t || n == null || r == null || n < r || !i || !a ? [] : [{
			day: a,
			condition: t,
			high: n,
			low: r,
			precipitationProbability: Ct(e.precipitation_probability)
		}];
	});
}
// packages/core/src/entities/assumed.ts
var Tt = (e) => e.state !== "unavailable" && (e.assumedState === !0 || e.state === "unknown"), Et = (e) => e.state === "unknown" ? "Its state isn't known yet, so both are here." : "Home Assistant assumes its state, so both are here.", Dt = [{
	value: "off",
	label: "Aus"
}, {
	value: "on",
	label: "Ein"
}];
// packages/core/src/ha/actions/either.ts
function Ot(e, t, n) {
	return !Tt(e) || e.supportsTurnOn === !1 || e.supportsTurnOff === !1 ? {} : {
		onTurnOn: () => {
			n() && t("turn_on");
		},
		onTurnOff: () => {
			n() && t("turn_off");
		}
	};
}
// packages/core/src/ha/actions/run.ts
function kt(e, t, n, r) {
	let { entityId: i } = n, a = (e) => r?.(new y("unsupported", e, {
		domain: t,
		entityId: i
	})), o = (e, n) => n instanceof y ? n : new y("service_failed", `Home Assistant rejected ${t}.${e}`, {
		domain: t,
		service: e,
		entityId: i,
		...D(n)
	});
	return {
		run(n, a = {}) {
			e.callService(t, n, {
				entity_id: i,
				...a
			}).catch((e) => {
				r?.(o(n, e));
			});
		},
		async attempt(n, r = {}) {
			try {
				await e.callService(t, n, {
					entity_id: i,
					...r
				});
				return;
			} catch (e) {
				return o(n, e);
			}
		},
		report: (e) => r?.(e),
		unsupported: a,
		invalidInput: (e) => r?.(new y("invalid_input", e, {
			domain: t,
			entityId: i
		})),
		actionable() {
			return n.state !== "unavailable" || (a(`${i} is unavailable`), !1);
		}
	};
}
// packages/core/src/ha/actions/light.ts
var At = (e) => Math.min(100, Math.max(1, Math.round(e)));
function jt(e, t, n = {}) {
	let { run: r, unsupported: i, invalidInput: a, actionable: o } = kt(e, "light", t, n.onError);
	return {
		onToggle: () => {
			o() && r("toggle");
		},
		...Ot(t, r, o),
		onBrightnessChange: (e) => {
			o() && (t.supportsBrightness ? Number.isFinite(e) ? r("turn_on", { brightness_pct: At(e) }) : a(`${t.entityId} brightness must be finite`) : i(`${t.entityId} does not support brightness`));
		},
		onKelvinChange: t.supportsColorTemp ? (e) => {
			o() && (!Number.isFinite(e) || t.minKelvin != null && e < t.minKelvin || t.maxKelvin != null && e > t.maxKelvin ? a(`${t.entityId} color temperature is outside its supported range`) : r("turn_on", { color_temp_kelvin: e }));
		} : void 0,
		onColorChange: t.supportsColor ? ([e, n]) => {
			o() && (!Number.isFinite(e) || !Number.isFinite(n) || e < 0 || e > 360 || n < 0 || n > 100 ? a(`${t.entityId} colour is outside hue 0-360 and saturation 0-100`) : r("turn_on", { hs_color: [e, n] }));
		} : void 0
	};
}
// packages/core/src/entities/climate/power.ts
var Mt = (e) => e.hvacModes.find((e) => e !== "off"), Nt = (e) => e.supportsTurnOn !== !1 || Mt(e) != null, Pt = (e) => e.supportsTurnOff !== !1 || e.hvacModes.includes("off"), Ft = (e) => e.state !== "unavailable" && (e.state === "off" ? Nt(e) : Pt(e)), It = (e, t) => e >= t.minTemp && e <= t.maxTemp;
function Lt(e, t, n = {}) {
	let { run: r, unsupported: i, invalidInput: a, actionable: o } = kt(e, "climate", t, n.onError), s = (e) => Number.isFinite(e) ? It(e, t) ? !0 : (a(`${t.entityId} temperature is outside its supported range`), !1) : (a(`${t.entityId} temperature must be finite`), !1);
	return {
		onToggle: () => {
			if (o()) {
				if (t.state === "off") {
					let e = Mt(t);
					t.supportsTurnOn === !1 ? e ? r("set_hvac_mode", { hvac_mode: e }) : i(`${t.entityId} can't be turned on`) : r("turn_on");
				} else t.supportsTurnOff === !1 ? t.hvacModes.includes("off") ? r("set_hvac_mode", { hvac_mode: "off" }) : i(`${t.entityId} can't be turned off`) : r("turn_off");
			}
		},
		onTargetChange: (e) => {
			o() && s(e) && r("set_temperature", { temperature: e });
		},
		onRangeChange: t.hvacModes.includes("heat_cool") ? (e, n) => {
			if (!o()) return;
			if (!Number.isFinite(e) || !Number.isFinite(n)) {
				a(`${t.entityId} target range must be finite`);
				return;
			}
			let i = Math.min(e, n), s = Math.max(e, n);
			!It(i, t) || !It(s, t) ? a(`${t.entityId} target range is outside its supported range`) : r("set_temperature", {
				target_temp_low: i,
				target_temp_high: s
			});
		} : void 0,
		onModeChange: t.hvacModes.length > 0 ? (e) => {
			o() && (t.hvacModes.includes(e) ? r("set_hvac_mode", { hvac_mode: e }) : i(`${t.entityId} does not support HVAC mode ${e}`));
		} : void 0,
		onPresetChange: t.presetModes && t.presetModes.length > 0 ? (e) => {
			o() && (t.presetModes?.includes(e) ? r("set_preset_mode", { preset_mode: e }) : i(`${t.entityId} does not support preset ${e}`));
		} : void 0,
		onFanChange: t.fanModes && t.fanModes.length > 0 ? (e) => {
			o() && (t.fanModes?.includes(e) ? r("set_fan_mode", { fan_mode: e }) : i(`${t.entityId} does not support fan mode ${e}`));
		} : void 0
	};
}
// packages/core/src/entities/owlet/sleep.ts
var Rt = {
	deep_sleep: 1,
	light_sleep: .5,
	awake: 0
};
// packages/core/src/entities/history.ts
function zt(e, t = .5) {
	let n = e.filter((e) => typeof e == "number");
	if (!n.length) return {
		samples: e.map((e) => typeof e == "number" ? 0 : e),
		min: null,
		max: null
	};
	let r = Math.min(...n), i = Math.max(...n), a = Math.max(i - r, t);
	return {
		samples: e.map((e) => typeof e == "number" ? .12 + .88 * (e - r) / a : e),
		min: r,
		max: i
	};
}
// packages/core/src/entities/format.ts
var Bt = (e) => {
	let t = Math.round(e * 10) / 10;
	return (t === 0 ? 0 : t).toFixed(1);
}, W = (e) => {
	let t = Math.max(0, Math.round(e)), n = Math.floor(t / 60), r = t % 60;
	return n === 0 ? `${r}m` : r === 0 ? `${n}h` : `${n}h ${r}m`;
};
function Vt(e) {
	let t = e.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
	return t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : e;
}
function Ht(e) {
	let t = Number.isFinite(e) ? Math.max(0, Math.floor(e)) : 0, n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60, a = String(i).padStart(2, "0");
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${a}` : `${r}:${a}`;
}
// packages/core/src/entities/today.ts
var Ut = (e, t) => t > 0 ? `${e.charAt(0).toUpperCase()}${e.slice(1)} ${W(t)}` : `Not ${e} today`, Wt = "No readings yet", Gt = (e, t, n) => e == null || t == null ? Wt : `Low ${n(e)} · High ${n(t)}`, Kt = [
	"measurement",
	"total",
	"total_increasing"
], qt = (e) => typeof e == "string" && Kt.includes(e), Jt = (e, t) => {
	let n = Number(e.toFixed(t));
	return String(n === 0 ? 0 : n);
}, Yt = (e) => Jt(e, Math.abs(e) >= 100 ? 0 : Math.abs(e) >= 10 ? 1 : 2), Xt = [
	["T", 0xe8d4a51000],
	["G", 1e9],
	["M", 1e6],
	["k", 1e3]
];
function Zt(e) {
	let t = Yt(e);
	if (t.length <= 5) return t;
	for (let [t, n] of Xt) if (!(Math.abs(e) < n)) for (let r of [1, 0]) {
		let i = `${Jt(e / n, r)}${t}`;
		if (i.length <= 5) return i;
	}
	return t;
}
var Qt = (e) => !!e && /^[%°′″]/.test(e), $t = (e, t) => t ? `${e}${Qt(t) ? "" : " "}${t}` : e;
function en(e) {
	let t = e.filter((e) => typeof e == "number"), n = t.length ? Math.max(...t.map(Math.abs)) : 0;
	return zt(e, Math.max(n / 100, 1e-9));
}
function tn(e) {
	if (e.length === 0) return;
	let t = 0;
	for (let n = 1; n < e.length; n++) {
		let [r, i] = [e[n - 1], e[n]];
		t += i < .9 * r ? i : i - r;
	}
	return t;
}
function nn(e, t) {
	let n = en(t.readings);
	if (n.min == null || n.max == null) return {
		long: Wt,
		samples: n.samples
	};
	let r = t.readings.slice(0, t.currentHour + 1).filter((e) => typeof e == "number"), i = t.rise ?? tn(r);
	if (e.stateClass === "total_increasing" && i != null && i >= 0) return {
		short: `+${Zt(i)}`,
		long: `${$t(`+${Yt(i)}`, e.unit)} today`,
		samples: n.samples
	};
	let [a, o] = [Yt(n.min), Yt(n.max)];
	if (a === o) return {
		short: Zt(n.min),
		long: `Steady at ${$t(a, e.unit)}`,
		samples: n.samples
	};
	let s = n.min < 0 ? " to " : "–";
	return {
		short: `${Zt(n.min)}${s}${Zt(n.max)}`,
		long: `Low ${$t(a, e.unit)} · High ${$t(o, e.unit)}`,
		samples: n.samples
	};
}
// packages/core/src/ha/mappers/mediaPlayer.ts
var rn = {
	PAUSE: 1,
	SEEK: 2,
	VOLUME_SET: 4,
	VOLUME_MUTE: 8,
	PREVIOUS_TRACK: 16,
	NEXT_TRACK: 32,
	TURN_ON: 128,
	TURN_OFF: 256,
	VOLUME_STEP: 1024,
	SELECT_SOURCE: 2048,
	STOP: 4096,
	PLAY: 16384
}, an = {
	playing: "playing",
	play: "playing",
	paused: "paused",
	pause: "paused",
	buffering: "buffering",
	loading: "buffering",
	idle: "idle",
	stopped: "idle",
	stop: "idle",
	on: "on",
	standby: "standby",
	sleep: "standby",
	sleeping: "standby",
	off: "off"
}, on = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function sn(e) {
	let t = e?.trim().toLowerCase().replace(/[\s-]+/g, "_");
	if (t == null || on.has(t)) return { state: "unavailable" };
	let n = an[t];
	return n ? { state: n } : {
		state: "other",
		stateText: Vt(e)
	};
}
var cn = (e) => S(e)?.trim() || void 0;
function ln(e, t, n = {}) {
	let r = b(e?.attributes) ? e.attributes : {}, { state: i, stateText: a } = e == null ? {
		state: "unavailable",
		stateText: void 0
	} : sn(typeof e.state == "string" ? e.state : void 0), o = i === "unavailable", s = x(r.supported_features) ?? 0, c = (e) => (s & e) !== 0, l = C(r.source_list), u = x(r.volume_level), d = x(r.media_duration), f = x(r.media_position), p = r.is_volume_muted, m = o ? {} : {
		title: cn(r.media_title) ?? cn(r.media_channel),
		artist: cn(r.media_artist) ?? cn(r.media_album_artist) ?? cn(r.media_series_title),
		album: cn(r.media_album_name),
		app: cn(r.app_name),
		duration: d != null && d > 0 ? d : void 0,
		position: f != null && f >= 0 ? f : void 0,
		positionAt: f == null ? void 0 : Te(S(r.media_position_updated_at))?.getTime(),
		volume: u == null ? void 0 : Math.round(Math.min(1, Math.max(0, u)) * 100),
		muted: typeof p == "boolean" ? p : void 0,
		source: cn(r.source)
	};
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		...a && { stateText: a },
		...Object.fromEntries(Object.entries(m).filter(([, e]) => e !== void 0)),
		...l.length > 0 && { sources: l },
		...r.assumed_state === !0 && { assumedState: !0 },
		supportsPlay: c(rn.PLAY),
		supportsPause: c(rn.PAUSE),
		supportsStop: c(rn.STOP),
		supportsPrevious: c(rn.PREVIOUS_TRACK),
		supportsNext: c(rn.NEXT_TRACK),
		supportsSeek: c(rn.SEEK),
		supportsVolume: c(rn.VOLUME_SET),
		supportsVolumeStep: c(rn.VOLUME_STEP),
		supportsMute: c(rn.VOLUME_MUTE),
		supportsSource: c(rn.SELECT_SOURCE) && l.length > 0,
		supportsTurnOn: c(rn.TURN_ON),
		supportsTurnOff: c(rn.TURN_OFF),
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		changedAt: Te(e?.last_changed)?.getTime(),
		lastSeen: o ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/mappers/vacuum.ts
var un = {
	PAUSE: 4,
	STOP: 8,
	RETURN_HOME: 16,
	FAN_SPEED: 32,
	BATTERY: 64,
	STATUS: 128,
	LOCATE: 512,
	START: 8192
}, dn = {
	cleaning: "cleaning",
	on: "cleaning",
	running: "cleaning",
	docked: "docked",
	charging: "docked",
	charged: "docked",
	charging_completed: "docked",
	returning: "returning",
	returning_home: "returning",
	return_to_base: "returning",
	returning_to_dock: "returning",
	paused: "paused",
	idle: "idle",
	off: "idle",
	stopped: "idle",
	standby: "idle",
	ready: "idle",
	sleeping: "idle",
	error: "error",
	stuck: "error"
}, fn = /* @__PURE__ */ new Set([
	"unknown",
	"unavailable",
	""
]);
function pn(e) {
	let t = e?.trim().toLowerCase().replace(/[\s-]+/g, "_");
	if (t == null || fn.has(t)) return { state: "unavailable" };
	let n = dn[t];
	return n ? { state: n } : /clean|mop|vacuum/.test(t) ? {
		state: "cleaning",
		stateText: Vt(e)
	} : {
		state: "other",
		stateText: Vt(e)
	};
}
function mn(e, t, n = {}) {
	let r = b(e?.attributes) ? e.attributes : {}, { state: i, stateText: a } = e == null ? {
		state: "unavailable",
		stateText: void 0
	} : pn(typeof e.state == "string" ? e.state : void 0), o = i === "unavailable", s = x(r.supported_features) ?? 0, c = (e) => (s & e) !== 0, l = C(r.fan_speed_list), u = o ? void 0 : S(r.status)?.trim() || void 0, d = S(r.battery_icon) ?? "", f = o ? void 0 : Qe(r);
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		...a && { stateText: a },
		...u && { status: u },
		...i === "error" && S(r.error) && { error: Vt(S(r.error)) },
		battery: f,
		charging: o ? void 0 : f != null && (/charging/.test(d) || /^charging$/i.test(u ?? "") || e?.state === "charging"),
		supportsStart: c(un.START),
		supportsPause: c(un.PAUSE),
		supportsReturn: c(un.RETURN_HOME),
		supportsLocate: c(un.LOCATE),
		supportsFanSpeed: c(un.FAN_SPEED) && l.length > 0,
		...l.length > 0 && { fanSpeeds: l },
		fanSpeed: o ? void 0 : S(r.fan_speed),
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		changedAt: Te(e?.last_changed)?.getTime(),
		lastSeen: o ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/history.ts
var hn = (e) => typeof e == "number" && Number.isFinite(e) ? /* @__PURE__ */ new Date(e * 1e3) : void 0;
function gn(e, t) {
	if (!b(e)) return [];
	let n = [];
	for (let r of t) {
		let t = Object.prototype.hasOwnProperty.call(e, r) ? e[r] : void 0;
		if (!Array.isArray(t)) continue;
		let i = {};
		for (let e of t) {
			if (!b(e)) continue;
			let t = hn(e.lu) ?? hn(e.lc);
			t != null && (b(e.a) && (i = e.a), n.push({
				entityId: r,
				state: typeof e.s == "string" ? e.s : "unavailable",
				changed: t,
				attributes: i
			}));
		}
	}
	return n;
}
var _n = (e) => e instanceof Date && !Number.isNaN(e.getTime()) ? e : /* @__PURE__ */ new Date(), vn = (e, t) => (e ?? []).filter((e) => e.entityId === t), yn = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()), bn = (e, t) => e.filter((e) => e.changed <= t).sort((e, t) => e.changed.getTime() - t.changed.getTime());
function xn(e, t) {
	let n = yn(t).getTime(), r = bn(e, t), i = Array(24).fill(void 0), a = 0, o;
	for (; a < r.length && r[a].changed.getTime() < n;) o = r[a++];
	for (let e = 0; e < 24; e++) {
		for (; a < r.length && r[a].changed.getHours() <= e;) o = r[a++];
		i[e] = o;
	}
	return i;
}
function Sn(e, t) {
	let n = yn(t).getTime(), r = bn(e, t), i = [];
	return r.forEach((e, a) => {
		let o = Math.max(e.changed.getTime(), n), s = a + 1 < r.length ? r[a + 1].changed.getTime() : t.getTime();
		s > o && i.push({
			record: e,
			ms: s - o
		});
	}), i;
}
function Cn(e, t, n) {
	let r = xn(e, t), i = t.getHours(), a = Array(24).fill(null);
	for (let e = 0; e <= i && e < 24; e++) {
		let t = r[e];
		a[e] = t == null ? n.noData ?? "unavailable" : n.value(t.state, t.attributes);
	}
	let o = 0, s = !1;
	if (n.on) {
		for (let { record: r, ms: i } of Sn(e, t)) n.on(r.state, r.attributes) && (o += i);
		let a = r[i];
		s = a != null && n.on(a.state, a.attributes);
	}
	return {
		samples: a,
		currentHour: i,
		minutes: o > 0 || s ? Math.max(1, Math.round(o / 6e4)) : 0
	};
}
var wn = {
	brightness: !0,
	color_temp: !0,
	hs: !0,
	xy: !0,
	rgb: !0,
	rgbw: !0,
	rgbww: !0,
	white: !0
}, Tn = (e) => e >= 0 && e <= 255 ? Math.min(100, Math.max(1, Math.round(e / 255 * 100))) : void 0;
function En(e, t) {
	if (e === "on") {
		if (!C(t.supported_color_modes).some((e) => e in wn)) return 1;
		let e = x(t.brightness);
		if (e == null) return "unavailable";
		let n = Tn(e);
		return n == null ? "unavailable" : n / 100;
	}
	return e === "off" ? 0 : "unavailable";
}
function Dn(e, t, n) {
	let r = _n(n), { samples: i, currentHour: a, minutes: o } = Cn(vn(e, t), r, {
		value: En,
		on: (e) => e === "on"
	});
	return {
		samples: i,
		currentHour: a,
		onMinutes: o
	};
}
function On(e) {
	return e === "on" ? 1 : e === "off" ? 0 : "unavailable";
}
function kn(e, t, n) {
	let r = _n(n), { samples: i, currentHour: a, minutes: o } = Cn(vn(e, t), r, {
		value: On,
		on: (e) => e === "on"
	});
	return {
		samples: i,
		currentHour: a,
		onMinutes: o
	};
}
function An(e, t, n) {
	let r = _n(n), i = (e) => pn(e).state === "cleaning", { samples: a, currentHour: o, minutes: s } = Cn(vn(e, t), r, {
		value: (e) => pn(e).state === "unavailable" ? "unavailable" : +!!i(e),
		on: i
	});
	return {
		samples: a,
		currentHour: o,
		cleaningMinutes: s
	};
}
var jn = kn;
function Mn(e, t) {
	if (e === "unavailable" || e === "unknown") return "unavailable";
	let n = x(t.current_position);
	return n != null && n >= 0 && n <= 100 ? n / 100 : e === "open" ? 1 : e === "closed" ? 0 : "unavailable";
}
function Nn(e, t, n) {
	let r = _n(n), { samples: i, currentHour: a } = Cn(vn(e, t), r, { value: Mn });
	return {
		samples: i,
		currentHour: a
	};
}
var Pn = {
	disarmed: !0,
	arming: !0,
	disarming: !0
};
function Fn(e) {
	return e.startsWith("armed") || e === "pending" || e === "triggered";
}
function In(e) {
	return e === "unavailable" || e === "unknown" ? "unavailable" : Fn(e) ? 1 : e in Pn ? 0 : "unavailable";
}
function Ln(e, t, n) {
	let r = _n(n), { samples: i, currentHour: a, minutes: o } = Cn(vn(e, t), r, {
		value: In,
		on: Fn
	});
	return {
		samples: i,
		currentHour: a,
		armedMinutes: o
	};
}
function Rn(e) {
	return e === "off" ? 0 : e === "unavailable" || e === "unknown" ? "unavailable" : 1;
}
function zn(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let { record: r, ms: i } of Sn(e, t)) {
		let e = r.attributes.hvac_action;
		typeof e == "string" && e !== "" && e !== "idle" && e !== "off" && n.set(e, (n.get(e) ?? 0) + i);
	}
	if (n.size === 0) return "running";
	let r = 0;
	for (let e of n.values()) e > r && (r = e);
	let i = [...n.entries()].filter(([, e]) => e === r).map(([e]) => e);
	return i.includes("heating") ? "heating" : i.includes("cooling") ? "cooling" : "running";
}
function Bn(e, t, n) {
	let r = _n(n), i = vn(e, t), { samples: a, currentHour: o, minutes: s } = Cn(i, r, {
		value: Rn,
		on: (e) => e !== "off" && e !== "unavailable" && e !== "unknown"
	});
	return {
		samples: a,
		currentHour: o,
		activeMinutes: s,
		activity: zn(i, r)
	};
}
function Vn(e) {
	if (e === "unavailable" || e === "unknown") return "unavailable";
	let t = Number(e);
	return e.trim() !== "" && Number.isFinite(t) ? t : "unavailable";
}
function Hn(e, t) {
	return e === "unavailable" || e === "unknown" ? "unavailable" : x(t.temperature) ?? "unavailable";
}
function Un(e, t) {
	let n = yn(t).getTime(), r = bn(e, t);
	if (r.length === 0 || r[r.length - 1].attributes.state_class !== "total_increasing") return;
	let i = 0;
	for (; i + 1 < r.length && r[i + 1].changed.getTime() <= n;) i++;
	return tn(r.slice(i).map((e) => Vn(e.state)).filter((e) => typeof e == "number"));
}
function Wn(e, t, n) {
	let r = xn(e, t), i = t.getHours(), a = Array(24).fill(null);
	for (let e = 0; e <= i && e < 24; e++) {
		let t = r[e];
		a[e] = t == null ? null : n(t.state, t.attributes);
	}
	return a;
}
function Gn(e, t, n) {
	let r = _n(n);
	return {
		temperature: Wn(vn(e, t.temperature), r, Vn),
		humidity: t.humidity == null ? void 0 : Wn(vn(e, t.humidity), r, Vn),
		currentHour: r.getHours()
	};
}
function Kn(e, t, n) {
	let r = _n(n), i = vn(e, t), a = Un(i, r);
	return {
		readings: Wn(i, r, Vn),
		currentHour: r.getHours(),
		...a === void 0 ? {} : { rise: a }
	};
}
function qn(e, t, n) {
	let r = _n(n);
	return {
		temperature: Wn(vn(e, t), r, Hn),
		currentHour: r.getHours()
	};
}
var Jn = (e) => Object.hasOwn(Rt, e);
function Yn(e, t, n) {
	let r = _n(n), { samples: i, currentHour: a, minutes: o } = Cn(vn(e, t.sleep), r, {
		value: (e) => Jn(e) ? Rt[e] : "unavailable",
		on: (e) => e === "deep_sleep" || e === "light_sleep"
	});
	return {
		sleep: i,
		heartRate: t.heartRate == null ? void 0 : Wn(vn(e, t.heartRate), r, Vn),
		oxygen: t.oxygen == null ? void 0 : Wn(vn(e, t.oxygen), r, Vn),
		currentHour: a,
		asleepMinutes: o
	};
}
function Xn(e, t, n) {
	let r = _n(n), i = (e) => {
		let t = sn(e).state;
		return t === "playing" || t === "buffering";
	}, { samples: a, currentHour: o, minutes: s } = Cn(vn(e, t), r, {
		value: (e) => sn(e).state === "unavailable" ? "unavailable" : +!!i(e),
		on: i
	});
	return {
		samples: a,
		currentHour: o,
		playingMinutes: s
	};
}
// packages/core/src/ha/useHaRequest.ts
var Zn = /* @__PURE__ */ new WeakMap();
function Qn(e, t, n, r, i) {
	let a = Zn.get(e);
	if ((!a || a.generation < t) && (a = {
		generation: t,
		requests: /* @__PURE__ */ new Map()
	}, Zn.set(e, a)), a.generation !== t) return r();
	let o = a.requests.get(n);
	if (o) return o;
	let s = r(), c = a.requests;
	c.set(n, s);
	let l = () => {
		c.get(n) === s && c.delete(n);
	};
	return s.then(i ? void 0 : l, l), s;
}
function $n(e, t, { cache: n = !1, keepPrevious: r = !1 } = {}) {
	let i = R(), a = me(), o = he(), [s, c] = (0, I.useState)({}), l = (0, I.useRef)(t);
	return l.current = t, (0, I.useEffect)(() => {
		if (e === void 0 || a !== "connected") return;
		let t = !1, r = () => !t && i.getSnapshot().generation === o && i.getSnapshot().status === "connected";
		return Qn(i, o, e, () => l.current(i), n).then((t) => {
			r() && c({
				key: e,
				generation: o,
				value: t
			});
		}, (t) => {
			r() && c({
				key: e,
				generation: o,
				error: t
			});
		}), () => {
			t = !0;
		};
	}, [
		n,
		o,
		e,
		a,
		i
	]), e === void 0 || a !== "connected" || s.generation !== o || s.key !== e && !r ? {} : s;
}
// packages/core/src/ha/registry.ts
var er = (e) => Array.isArray(e) ? e : [];
function tr(e) {
	let t = [];
	for (let n of er(e)) {
		if (!b(n)) continue;
		let e = S(n.area_id), r = S(n.name);
		e && r && t.push({
			id: e,
			name: r,
			icon: S(n.icon),
			floorId: S(n.floor_id),
			labels: C(n.labels),
			aliases: C(n.aliases)
		});
	}
	return t;
}
function nr(e) {
	let t = [];
	for (let n of er(e)) {
		if (!b(n)) continue;
		let e = S(n.floor_id), r = S(n.name);
		e && r && t.push({
			id: e,
			name: r,
			level: x(n.level),
			icon: S(n.icon),
			aliases: C(n.aliases)
		});
	}
	return t;
}
function rr(e) {
	let t = [];
	for (let n of er(e)) {
		if (!b(n)) continue;
		let e = S(n.id);
		e && t.push({
			id: e,
			name: S(n.name),
			nameByUser: S(n.name_by_user),
			areaId: S(n.area_id),
			manufacturer: S(n.manufacturer),
			model: S(n.model),
			disabledBy: S(n.disabled_by)
		});
	}
	return t;
}
function ir(e) {
	let t = /* @__PURE__ */ new Map(), n = b(e) && b(e.entity_categories) ? e.entity_categories : {};
	for (let r of er(b(e) ? e.entities : void 0)) {
		if (!b(r)) continue;
		let e = S(r.ei);
		if (!e) continue;
		let i = r.ec, a = typeof i == "string" || typeof i == "number" ? S(n[i]) ?? "other" : void 0;
		t.set(e, {
			entityId: e,
			areaId: S(r.ai),
			deviceId: S(r.di),
			platform: S(r.pl),
			entityCategory: a,
			hidden: r.hb === !0
		});
	}
	return t;
}
function ar(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e of er(t)) {
		if (!b(e)) continue;
		let t = S(e.id), r = S(e.area_id);
		t && r && n.set(t, r);
	}
	let r = /* @__PURE__ */ new Map();
	for (let t of er(b(e) ? e.entities : void 0)) {
		if (!b(t)) continue;
		let e = S(t.ei), i = S(t.di), a = S(t.ai) ?? (i ? n.get(i) : void 0);
		e && a && r.set(e, a);
	}
	return r;
}
function or(e, t, n, r = []) {
	return {
		areas: tr(n),
		floors: nr(r),
		devices: rr(t),
		entities: ir(e),
		membership: ar(e, t)
	};
}
async function sr(e) {
	let [t, n, r, i] = await Promise.all([
		e.callApi("config/entity_registry/list_for_display"),
		e.callApi("config/device_registry/list"),
		e.callApi("config/area_registry/list"),
		e.callApi("config/floor_registry/list").catch(() => [])
	]);
	return or(t, n, r, i);
}
function cr() {
	let { value: e } = $n("registry", sr, { cache: !0 });
	return e;
}
function lr(e) {
	let t = cr();
	return (0, I.useMemo)(() => {
		if (!t) return;
		let n = t.membership.get(e);
		return n ? t.areas.find((e) => e.id === n)?.name : void 0;
	}, [t, e]);
}
// packages/core/src/ha/useHaHistory.ts
var ur = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate());
async function dr(e, t, n) {
	let r = Date.now();
	return {
		records: gn(await e.callApi("history/history_during_period", {
			entity_ids: [...t],
			start_time: new Date(n).toISOString(),
			end_time: new Date(r).toISOString(),
			include_start_time_state: !0,
			significant_changes_only: !1,
			minimal_response: !1,
			no_attributes: !1
		}), t),
		until: r
	};
}
function fr(e, t) {
	let n = new Date(t.last_updated ?? t.last_changed ?? NaN);
	if (!Number.isNaN(n.getTime())) return {
		entityId: e,
		state: t.state,
		changed: n,
		attributes: t.attributes
	};
}
function pr(e, t = !0, n = /* @__PURE__ */ new Date()) {
	let r = R(), i = e.join(","), a = ur(n).getTime(), o = (0, I.useRef)(e);
	o.current = e;
	let { value: s, error: c } = $n(t ? `history:${a}:${i}` : void 0, (e) => dr(e, o.current, a)), [l, u] = (0, I.useState)([]), d = (0, I.useRef)(0);
	d.current = s?.until ?? 0;
	let f = (0, I.useRef)(!1);
	return f.current = c !== void 0, (0, I.useEffect)(() => {
		if (u([]), !t) return;
		let e = o.current, n = new Map(e.map((e) => [e, r.getSnapshot().entities[e]]));
		return r.subscribe(() => {
			let t = r.getSnapshot().entities, i = [];
			for (let r of e) {
				let e = t[r];
				if (e === n.get(r)) continue;
				n.set(r, e);
				let a = e ? fr(r, e) : void 0;
				a && i.push(a);
			}
			i.length && u((e) => f.current ? [] : [...e, ...i].filter((e) => e.changed.getTime() > d.current));
		});
	}, [
		i,
		t,
		r
	]), (0, I.useMemo)(() => {
		if (!s) return;
		let e = l.filter((e) => e.changed.getTime() > s.until);
		return e.length ? [...s.records, ...e] : s.records;
	}, [s, l]);
}
// packages/core/src/ha/dev.ts
var mr = /^[a-z0-9_]+\.[a-z0-9_]+$/, hr = /* @__PURE__ */ new Set();
function gr() {
	return typeof process < "u" && !1;
}
function _r(e, t, n) {
	if (!gr()) return;
	let r = `${n}\u0000${e}`;
	if (hr.has(r)) return;
	let i;
	if (!mr.test(e)) i = `${n}: "${e}" is not a Home Assistant entity id (expected "domain.object_id" in lower-case letters, digits and underscores)`;
	else {
		let r = e.slice(0, e.indexOf("."));
		t.includes(r) || (i = `${n}: "${e}" is a ${r} entity; expected ${t.length === 1 ? `${t[0]}.*` : t.map((e) => `${e}.*`).join(" or ")}`);
	}
	i && (hr.add(r), console.warn(i));
}
// packages/core/src/hooks/useNow.ts
function vr(e) {
	let [t, n] = (0, I.useState)(() => e ?? /* @__PURE__ */ new Date()), r = e?.getTime();
	return (0, I.useEffect)(() => {
		if (r != null) return;
		let e, t = () => {
			let r = /* @__PURE__ */ new Date();
			n(r), e = window.setTimeout(t, 6e4 - (r.getSeconds() * 1e3 + r.getMilliseconds()) + 20);
		};
		t();
		let i = () => {
			document.visibilityState === "visible" && (window.clearTimeout(e), t());
		};
		return document.addEventListener("visibilitychange", i), () => {
			window.clearTimeout(e), document.removeEventListener("visibilitychange", i);
		};
	}, [r]), r == null ? t : new Date(r);
}
// packages/core/src/hooks/hourCycle.tsx
var yr = (0, I.createContext)(void 0);
function G({ hourCycle: e, locale: t } = {}) {
	let n = (0, I.useContext)(yr);
	return e || (t ? H(t) : n ?? H());
}
function br({ hourCycle: e, locale: t, children: n }) {
	let r = G({
		hourCycle: e,
		locale: t
	});
	return /* @__PURE__ */ (0, L.jsx)(yr.Provider, {
		value: r,
		children: n
	});
}
// packages/core/src/ha/hooks/light.ts
function xr(e, { name: t, area: n, lastSeen: r, history: i, loadHistory: a = !0, onActionError: o } = {}) {
	_r(e, ["light"], "useHaLight");
	let s = R(), c = B(e), l = lr(e), u = vr(), d = G(), f = pr([e], a && i === void 0, u), p = (0, I.useMemo)(() => Dn(f, e, u), [
		f,
		e,
		u
	]), m = (0, I.useMemo)(() => Ae(c, e, {
		name: t,
		area: n ?? l,
		lastSeen: r,
		now: u,
		hourCycle: d
	}), [
		c,
		e,
		n,
		l,
		t,
		r,
		u,
		d
	]), h = (0, I.useMemo)(() => jt(s, m, { onError: o }), [
		s,
		m,
		o
	]);
	return {
		entity: m,
		history: i ?? p,
		actions: h
	};
}
// packages/core/src/ha/hooks/climate.ts
var Sr = (e) => e.callApi("get_config");
function Cr(e, { name: t, area: n, lastSeen: r, unit: i, history: a, loadHistory: o = !0, onActionError: s } = {}) {
	_r(e, ["climate"], "useHaClimate");
	let c = R(), l = B(e), u = lr(e), d = vr(), f = G(), p = pr([e], o && a === void 0, d), m = $n(i ? void 0 : "config", Sr, { cache: !0 }).value, h = typeof m?.unit_system?.temperature == "string" ? m.unit_system.temperature : void 0, g = (0, I.useMemo)(() => Bn(p, e, d), [
		p,
		e,
		d
	]), _ = (0, I.useMemo)(() => qe(l, e, {
		name: t,
		area: n ?? u,
		lastSeen: r,
		unit: i,
		systemUnit: h,
		now: d,
		hourCycle: f
	}), [
		l,
		e,
		n,
		u,
		t,
		r,
		i,
		h,
		d,
		f
	]), v = (0, I.useMemo)(() => Lt(c, _, { onError: s }), [
		c,
		_,
		s
	]);
	return {
		entity: _,
		history: a ?? g,
		actions: v
	};
}
// packages/core/src/ha/hooks/weather.ts
var wr = (e, t, n) => e.query("weather", "get_forecasts", { type: n }, {
	target: { entity_id: t },
	returnResponse: !0
});
function Tr(e, t, n, r, i) {
	let { value: a, error: o } = $n(n ? `forecast:${e}:${t}:${r}` : void 0, (n) => wr(n, e, t), { keepPrevious: !0 });
	return (0, I.useEffect)(() => {
		o !== void 0 && i(o);
	}, [o]), (0, I.useMemo)(() => {
		if (a !== void 0) return t === "hourly" ? wt(a, e, "hourly") : wt(a, e, "daily");
	}, [
		a,
		e,
		t
	]);
}
function Er(e, { aqiEntityId: t, aqiScale: n, sunEntityId: r, name: i, lastSeen: a, temperatureUnit: o, windSpeedUnit: s, pressureUnit: c, hourly: l, daily: u, history: d, loadHistory: f = !0, loadForecasts: p = !0, onForecastError: m } = {}) {
	_r(e, ["weather"], "useHaWeather");
	let h = B(e), g = B(t ?? ""), _ = B(r ?? ""), v = (0, I.useRef)(m);
	v.current = m;
	let y = (e) => v.current?.(e), b = vr(), x = G(), S = pr([e], f && d === void 0, b), C = (0, I.useMemo)(() => qn(S, e, b), [
		S,
		e,
		b
	]), w = Math.floor(b.getTime() / 36e5), T = Tr(e, "hourly", p && l === void 0, w, y), E = Tr(e, "daily", p && u === void 0, w, y);
	return {
		entity: (0, I.useMemo)(() => gt(h, e, {
			aqiEntity: g,
			aqiScale: n,
			sunEntity: _,
			name: i,
			lastSeen: a,
			temperatureUnit: o,
			windSpeedUnit: s,
			pressureUnit: c,
			now: b,
			hourCycle: x
		}), [
			h,
			e,
			g,
			n,
			_,
			i,
			a,
			o,
			s,
			c,
			b,
			x
		]),
		history: d ?? C,
		hourly: l ?? T,
		daily: u ?? E
	};
}
// packages/core/src/ha/hooks/sensor.ts
function Dr(e, { humidityEntityId: t, batteryEntityId: n, name: r, area: i, outdoor: a, lastSeen: o, unit: s, history: c, loadHistory: l = !0 } = {}) {
	_r(e, ["sensor"], "useHaSensor");
	let u = B(e), d = B(t ?? ""), f = B(n ?? ""), p = lr(e), m = vr(), h = G(), g = pr(t ? [e, t] : [e], l && c === void 0, m), _ = (0, I.useMemo)(() => Gn(g, {
		temperature: e,
		humidity: t
	}, m), [
		g,
		e,
		t,
		m
	]);
	return {
		entity: (0, I.useMemo)(() => st(u, e, {
			name: r,
			area: i ?? p,
			outdoor: a,
			lastSeen: o,
			unit: s,
			humidityEntity: d,
			batteryEntity: f,
			now: m,
			hourCycle: h
		}), [
			u,
			e,
			r,
			i,
			p,
			a,
			o,
			s,
			d,
			f,
			m,
			h
		]),
		history: c ?? _
	};
}
// packages/core/src/entities/cover/position.ts
var Or = {
	curtain: "Curtain",
	blind: "Blind",
	shade: "Shade",
	shutter: "Shutter",
	awning: "Awning",
	window: "Window",
	garage: "Garage door",
	door: "Door",
	gate: "Gate"
}, kr = (e) => e === "garage" || e === "door" || e === "gate", Ar = (e) => kr(e.deviceClass), jr = (e) => e.supportsTilt ? "position" : e.supportsTiltOpen && e.supportsTiltClose ? "ends" : void 0, Mr = [
	{
		value: 0,
		label: "Closed"
	},
	{
		value: 25,
		label: "25%"
	},
	{
		value: 50,
		label: "Half"
	},
	{
		value: 100,
		label: "Open"
	}
], Nr = Mr.filter((e) => e.value === 0 || e.value === 100), Pr = (e) => e <= 3 ? 0 : e >= 97 ? 100 : e, Fr = (e) => e.state === "opening" || e.state === "closing", Ir = (e) => e.position ?? (e.state === "open" || e.state === "opening" ? 100 : 0), Lr = (e) => e.supportsPosition && e.position != null, Rr = (e) => e <= 0 ? "close" : e >= 100 ? "open" : { position: e }, zr = (e, t) => typeof e == "string" ? e === "open" : e.position > Ir(t);
function Br(e, t) {
	return t.state === "unavailable" ? !0 : e === "open" ? t.state === "open" || t.state === "opening" : e === "close" ? t.state === "closed" || t.state === "closing" : t.position === e.position;
}
var Vr = (e) => typeof e == "string" ? e === "open" ? 100 : 0 : e.position;
// packages/core/src/ha/actions/cover.ts
function Hr(e, t, n = {}) {
	let { run: r, unsupported: i, invalidInput: a, actionable: o } = kt(e, "cover", t, n.onError), s = (e) => Math.min(100, Math.max(0, e)), c = (e) => {
		if (!o()) return;
		let n = e === "open" ? 100 : 0;
		(e === "open" ? t.supportsOpen : t.supportsClose) === !1 ? t.supportsPosition ? r("set_cover_position", { position: n }) : (e === "open" ? t.supportsTiltOpen : t.supportsTiltClose) ? r(`${e}_cover_tilt`) : t.supportsTilt ? r("set_cover_tilt_position", { tilt_position: n }) : i(`${t.entityId} does not support ${e === "open" ? "opening" : "closing"}`) : r(`${e}_cover`);
	}, l = jr(t), u = t.supportsOpen === !1 && t.supportsClose === !1 && !t.supportsPosition;
	return {
		onOpenCover: () => c("open"),
		onCloseCover: () => c("close"),
		onStopCover: () => {
			o() && (t.supportsStop ? r(u && t.supportsTiltStop ? "stop_cover_tilt" : "stop_cover") : i(`${t.entityId} does not support stopping`));
		},
		onSetPosition: t.supportsPosition ? (e) => {
			o() && (Number.isFinite(e) ? r("set_cover_position", { position: s(e) }) : a(`${t.entityId} position must be finite`));
		} : void 0,
		onSetTilt: l ? (e) => {
			o() && (Number.isFinite(e) ? l === "ends" ? e === 0 || e === 100 ? r(e === 100 ? "open_cover_tilt" : "close_cover_tilt") : a(`${t.entityId} slats only open and close`) : r("set_cover_tilt_position", { tilt_position: s(e) }) : a(`${t.entityId} tilt must be finite`));
		} : void 0
	};
}
// packages/core/src/ha/mappers/cover.ts
var Ur = (e) => {
	let t = x(e);
	return t != null && t >= 0 && t <= 100 ? t : void 0;
}, Wr = /* @__PURE__ */ new Set([
	"open",
	"opening",
	"closed",
	"closing",
	"unknown"
]), Gr = /* @__PURE__ */ new Set([
	"curtain",
	"blind",
	"shade",
	"shutter",
	"awning",
	"window",
	"garage",
	"door",
	"gate"
]), Kr = {
	OPEN: 1,
	CLOSE: 2,
	SET_POSITION: 4,
	STOP: 8,
	OPEN_TILT: 16,
	CLOSE_TILT: 32,
	STOP_TILT: 64,
	SET_TILT_POSITION: 128
};
function qr(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e?.state, a = i != null && Wr.has(i) ? i : "unavailable", o = a !== "unavailable" && a !== "unknown", s = S(r.device_class), c = n.deviceClass ?? (s != null && Gr.has(s) ? s : "shade"), l = x(r.supported_features) ?? 0, u = (e) => (l & e) !== 0, d = u(Kr.SET_POSITION), f = u(Kr.SET_TILT_POSITION), p = !u(Kr.OPEN) && !u(Kr.CLOSE) && !d, m = u(Kr.STOP) || p && u(Kr.STOP_TILT), h = S(r.friendly_name);
	return {
		entityId: t,
		name: n.name ?? h ?? t,
		area: n.area,
		state: a,
		deviceClass: c,
		position: o && d ? Ur(r.current_position) : void 0,
		tilt: o && (f || u(Kr.OPEN_TILT) || u(Kr.CLOSE_TILT)) ? Ur(r.current_tilt_position) : void 0,
		supportsPosition: d,
		supportsStop: m,
		supportsTilt: f,
		supportsOpen: u(Kr.OPEN),
		supportsClose: u(Kr.CLOSE),
		supportsTiltOpen: u(Kr.OPEN_TILT),
		supportsTiltClose: u(Kr.CLOSE_TILT),
		supportsTiltStop: u(Kr.STOP_TILT),
		...r.assumed_state === !0 && { assumedState: !0 },
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		lastSeen: a === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/cover.ts
function Jr(e, { name: t, area: n, lastSeen: r, deviceClass: i, history: a, loadHistory: o = !0, onActionError: s } = {}) {
	_r(e, ["cover"], "useHaCover");
	let c = R(), l = B(e), u = lr(e), d = vr(), f = G(), p = pr([e], o && a === void 0, d), m = (0, I.useMemo)(() => Nn(p, e, d), [
		p,
		e,
		d
	]), h = (0, I.useMemo)(() => qr(l, e, {
		name: t,
		area: n ?? u,
		lastSeen: r,
		deviceClass: i,
		now: d,
		hourCycle: f
	}), [
		l,
		e,
		n,
		u,
		t,
		r,
		i,
		d,
		f
	]), g = (0, I.useMemo)(() => Hr(c, h, { onError: s }), [
		c,
		h,
		s
	]);
	return {
		entity: h,
		history: a ?? m,
		actions: g
	};
}
// packages/core/src/ha/actions/toggle.ts
var Yr = ["input_boolean", "switch"];
function Xr(e, t, n = {}) {
	let r = t.entityId.slice(0, t.entityId.indexOf(".")), { run: i, unsupported: a } = kt(e, r, t, n.onError), o = (e) => {
		Yr.includes(r) ? t.state === "unavailable" ? a(`${t.entityId} is unavailable`) : i(e) : a(`${t.entityId} is not an input_boolean or a switch`);
	};
	return {
		onToggle: () => o("toggle"),
		...Tt(t) && {
			onTurnOn: () => o("turn_on"),
			onTurnOff: () => o("turn_off")
		}
	};
}
// packages/core/src/ha/mappers/toggle.ts
function Zr(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e?.state === "on" || e?.state === "off" || e?.state === "unknown" ? e.state : "unavailable", a = S(r.friendly_name), o = S(r.last_seen);
	return {
		entityId: t,
		name: n.name ?? a ?? t,
		area: n.area,
		state: i,
		...r.assumed_state === !0 && { assumedState: !0 },
		icon: n.icon,
		description: n.description,
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		lastSeen: i === "unavailable" ? n.lastSeen ?? U(o, n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/toggle.ts
function Qr(e, { name: t, area: n, lastSeen: r, icon: i, description: a, history: o, loadHistory: s = !0, onActionError: c } = {}) {
	_r(e, ["input_boolean", "switch"], "useHaToggle");
	let l = R(), u = B(e), d = lr(e), f = vr(), p = G(), m = pr([e], s && o === void 0, f), h = (0, I.useMemo)(() => jn(m, e, f), [
		m,
		e,
		f
	]), g = (0, I.useMemo)(() => Zr(u, e, {
		name: t,
		area: n ?? d,
		lastSeen: r,
		icon: i,
		description: a,
		now: f,
		hourCycle: p
	}), [
		u,
		e,
		n,
		d,
		t,
		r,
		i,
		a,
		f,
		p
	]), _ = (0, I.useMemo)(() => Xr(l, g, { onError: c }), [
		l,
		g,
		c
	]);
	return {
		entity: g,
		history: o ?? h,
		actions: _
	};
}
// packages/core/src/ha/actions/alarm.ts
var $r = {
	home: "alarm_arm_home",
	away: "alarm_arm_away",
	night: "alarm_arm_night",
	vacation: "alarm_arm_vacation",
	custom_bypass: "alarm_arm_custom_bypass"
};
function ei(e, t, n = {}) {
	let r = "alarm_control_panel", { attempt: i, report: a } = kt(e, r, t, n.onError), o = async (e, t) => {
		let n = await i(e, t ? { code: t } : {});
		if (!n) return !0;
		if (n.translationKey === "invalid_code") return !1;
		throw a(n), n;
	};
	return {
		onArm: (e, n) => {
			if (!t.modes.includes(e)) {
				let n = new y("unsupported", `${t.entityId} does not support arming ${e}`, {
					domain: r,
					entityId: t.entityId
				});
				return a(n), Promise.reject(n);
			}
			return o($r[e], n);
		},
		onDisarm: (e) => o("alarm_disarm", e)
	};
}
// packages/core/src/ha/mappers/alarm.ts
var ti = [
	[1, "home"],
	[2, "away"],
	[4, "night"],
	[32, "vacation"],
	[16, "custom_bypass"]
], ni = {
	disarmed: !0,
	armed_home: !0,
	armed_away: !0,
	armed_night: !0,
	armed_vacation: !0,
	armed_custom_bypass: !0,
	arming: !0,
	pending: !0,
	disarming: !0,
	triggered: !0,
	unavailable: !0
};
function ri(e) {
	if (typeof e != "string") return;
	let t = e.replace(/^armed_/, "");
	return ti.some(([, e]) => e === t) ? t : void 0;
}
function ii(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = typeof e?.state == "string" && ni[e.state] === !0 ? e.state : "unavailable", a = x(r.supported_features) ?? 0, o = ti.filter(([e]) => a & e).map(([, e]) => e), s = S(r.changed_by), c = U(e?.last_changed, n.now, n.hourCycle), l = Te(e?.last_changed)?.getTime(), u = x(r.delay), d = u != null && u > 0 ? u : i === "arming" ? n.exitDelay : i === "pending" ? n.entryDelay : void 0, f = i === "arming" || i === "pending" ? ri(r.next_state) ?? ri(r.arm_mode) : void 0;
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		modes: o,
		codeFormat: r.code_format === "number" || r.code_format === "text" ? r.code_format : null,
		codeArmRequired: typeof r.code_arm_required != "boolean" || r.code_arm_required,
		armingTo: f,
		delay: d,
		changedAt: l,
		changedBy: s,
		lastChanged: c,
		lastSeen: i === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0,
		openSensors: n.openSensors && n.openSensors.length ? n.openSensors : void 0,
		triggeredBy: n.triggeredBy
	};
}
// packages/core/src/ha/hooks/alarm.ts
function ai(e, { name: t, area: n, lastSeen: r, exitDelay: i, entryDelay: a, openSensors: o, triggeredBy: s, history: c, loadHistory: l = !0, onActionError: u } = {}) {
	_r(e, ["alarm_control_panel"], "useHaAlarm");
	let d = R(), f = B(e), p = lr(e), m = vr(), h = G(), g = pr([e], l && c === void 0, m), _ = (0, I.useMemo)(() => Ln(g, e, m), [
		g,
		e,
		m
	]), v = (0, I.useMemo)(() => ii(f, e, {
		name: t,
		area: n ?? p,
		lastSeen: r,
		exitDelay: i,
		entryDelay: a,
		openSensors: o,
		triggeredBy: s,
		now: m,
		hourCycle: h
	}), [
		f,
		e,
		n,
		p,
		t,
		r,
		i,
		a,
		o,
		s,
		m,
		h
	]), y = (0, I.useMemo)(() => ei(d, v, { onError: u }), [
		d,
		v,
		u
	]);
	return {
		entity: v,
		history: c ?? _,
		actions: y
	};
}
// packages/core/src/ha/actions/owlet.ts
function oi(e, t, n = {}) {
	let { baseEntityId: r } = n;
	if (!r || t.baseOn == null) return {};
	let { run: i } = kt(e, "switch", {
		entityId: r,
		state: t.baseOn ? "on" : "off"
	}, n.onError);
	return { onBaseToggle: () => i(t.baseOn ? "turn_off" : "turn_on") };
}
// packages/core/src/entities/owlet/severity.ts
var si = /* @__PURE__ */ new Set([
	"sock_off",
	"sock_disconnected",
	"lost_power",
	"critical_battery"
]);
function ci(e = [], t = !1) {
	let { vitals: n, problems: r } = Ei(e);
	return n.length ? "alarm" : t || r.some((e) => si.has(e)) ? "urgent" : r.length ? "advisory" : void 0;
}
// packages/core/src/entities/owlet/readings.ts
var li = {
	deep_sleep: "Deep sleep",
	light_sleep: "Light sleep",
	awake: "Awake"
}, ui = {
	deep_sleep: "Deep",
	light_sleep: "Light",
	awake: "Awake"
}, di = "Sleep unknown", fi = "Unknown", pi = "Charging", mi = "Stopped", hi = (e) => {
	let t = e?.trim();
	if (t) return /\d{1,2}:\d{2}.*$/.exec(t)?.[0] ?? t;
}, gi = (e) => ({
	word: mi,
	detail: hi(e),
	said: vi(e)
}), _i = (e) => {
	let { word: t, detail: n } = gi(e);
	return n ? `${t} ${n}` : t;
}, vi = (e) => `No new reading${e ? ` since ${e}` : ""}`, yi = (e) => String(Math.round(e)), bi = (e) => String(Math.round(e)), xi = (e) => zt(e, 1), Si = [
	"critical_oxygen",
	"low_oxygen",
	"low_heart_rate",
	"high_heart_rate",
	"high_oxygen",
	"sock_disconnected",
	"sock_off",
	"lost_power",
	"critical_battery",
	"low_battery"
], Ci = /* @__PURE__ */ new Set([
	"critical_oxygen",
	"low_oxygen",
	"high_oxygen",
	"low_heart_rate",
	"high_heart_rate"
]), wi = {
	critical_oxygen: "Critical O₂",
	low_oxygen: "Low oxygen",
	high_oxygen: "High oxygen",
	low_heart_rate: "Low pulse",
	high_heart_rate: "High pulse",
	sock_off: "Sock off",
	sock_disconnected: "Sock offline",
	lost_power: "No base power",
	critical_battery: "Battery dying",
	low_battery: "Battery low"
}, Ti = {
	critical_oxygen: "Critical oxygen",
	low_oxygen: "Low oxygen",
	high_oxygen: "High oxygen",
	low_heart_rate: "Low heart rate",
	high_heart_rate: "High heart rate",
	sock_off: "Sock off",
	sock_disconnected: "Sock disconnected",
	lost_power: "Base lost power",
	critical_battery: "Battery critical",
	low_battery: "Battery low"
};
function Ei(e = []) {
	let t = Si.filter((t) => e.includes(t));
	return {
		vitals: t.filter((e) => Ci.has(e)),
		problems: t.filter((e) => !Ci.has(e))
	};
}
// packages/core/src/ha/mappers/owlet.ts
var Di = {
	critical_oxygen: "critical_oxygen_alert",
	low_oxygen: "low_oxygen_alert",
	high_oxygen: "high_oxygen_alert",
	low_heart_rate: "low_heart_rate_alert",
	high_heart_rate: "high_heart_rate_alert",
	sock_off: "sock_off",
	sock_disconnected: "sock_disconnected_alert",
	lost_power: "lost_power_alert",
	critical_battery: "critical_battery_alert",
	low_battery: "low_battery_alert"
}, Oi = {
	deep_sleep: "deep_sleep",
	light_sleep: "light_sleep",
	awake: "awake"
};
function ki(e) {
	if (!/^sensor\.\w+_sleep_state$/.test(e)) return;
	let t = e.slice(7, -12), n = Object.fromEntries(Object.entries(Di).map(([e, n]) => [e, `binary_sensor.${t}_${n}`]));
	return {
		heartRate: `sensor.${t}_heart_rate`,
		oxygen: `sensor.${t}_o2_saturation`,
		charging: `binary_sensor.${t}_charging`,
		base: `switch.${t}_base_station_on`,
		alerts: n
	};
}
function Ai(e, t) {
	let n = e?.state;
	if (typeof n != "string" || n.trim() === "") return;
	let r = Number(n);
	return Number.isFinite(r) && r > 0 && r <= t ? r : void 0;
}
function ji(e) {
	return e.map((e) => ({
		raw: e?.last_updated ?? "",
		at: Te(e?.last_updated)
	})).filter((e) => e.at != null).sort((e, t) => t.at.getTime() - e.at.getTime())[0];
}
var Mi = /* @__PURE__ */ new Set(["low_battery", "critical_battery"]);
function Ni(e, t, n = {}) {
	let r = (e && Oi[e.state]) ?? "unavailable", i = Ai(n.heartRateEntity, 300), a = Ai(n.oxygenEntity, 100), o = S(e?.attributes?.friendly_name)?.replace(/ Sleep state$/i, ""), s = r === "unavailable" && i == null && a == null, c = s ? void 0 : ji([
		e,
		n.heartRateEntity,
		n.oxygenEntity
	]), l = n.now ?? /* @__PURE__ */ new Date(), u = (n.staleAfterMinutes ?? 3) * 6e4, d = n.chargingEntity?.state === "on", f = Object.keys(n.alertEntities ?? {}).filter((e) => n.alertEntities?.[e]?.state === "on").filter((e) => !(d && Mi.has(e))), p = f.filter((e) => Ci.has(e)).map((e) => Te(n.alertEntities?.[e]?.last_changed)?.getTime()).filter((e) => e != null), m = p.length ? Math.min(...p) : void 0;
	return {
		entityId: t,
		name: n.name ?? o ?? t,
		area: n.area,
		state: r,
		heartRate: i,
		oxygen: a,
		alerts: f,
		vitalsSince: m,
		charging: d,
		baseOn: n.baseEntity?.state === "on" || n.baseEntity?.state !== "off" && void 0,
		live: c ? l.getTime() - c.at.getTime() <= u : void 0,
		lastUpdated: c ? U(c.raw, n.now, n.hourCycle) : void 0,
		lastSeen: s ? n.lastSeen : void 0
	};
}
// packages/core/src/ha/hooks/owlet.ts
var Pi = Object.keys(Di);
function Fi(e, { heartRateEntityId: t, oxygenEntityId: n, chargingEntityId: r, baseEntityId: i, alertEntityIds: a, name: o, area: s, lastSeen: c, history: l, loadHistory: u = !0, staleAfterMinutes: d, onActionError: f } = {}) {
	_r(e, ["sensor"], "useHaOwlet");
	let p = R(), m = ki(e), h = t ?? m?.heartRate, g = n ?? m?.oxygen, _ = B(e), v = B(h ?? ""), y = B(g ?? ""), b = i ?? m?.base, x = B(b ?? ""), S = pe([r ?? m?.charging, ...Pi.map((e) => a?.[e] ?? m?.alerts[e])].map((e) => e ?? "")), [C, w] = (0, I.useMemo)(() => [S[0], Object.fromEntries(Pi.map((e, t) => [e, S[t + 1]]))], [S]), T = lr(e), E = vr(), D = G(), O = pr([
		e,
		h,
		g
	].filter((e) => e != null), u && l === void 0, E), k = (0, I.useMemo)(() => Yn(O, {
		sleep: e,
		heartRate: h,
		oxygen: g
	}, E), [
		O,
		e,
		h,
		g,
		E
	]), A = (0, I.useMemo)(() => Ni(_, e, {
		name: o,
		area: s ?? T,
		lastSeen: c,
		heartRateEntity: v,
		oxygenEntity: y,
		chargingEntity: C,
		baseEntity: x,
		alertEntities: w,
		staleAfterMinutes: d,
		now: E,
		hourCycle: D
	}), [
		_,
		e,
		o,
		s,
		T,
		c,
		v,
		y,
		C,
		x,
		w,
		d,
		E,
		D
	]), j = (0, I.useMemo)(() => oi(p, A, {
		baseEntityId: b,
		onError: f
	}), [
		p,
		A,
		b,
		f
	]);
	return {
		entity: A,
		history: l ?? k,
		actions: j
	};
}
// packages/core/src/ha/actions/humidifier.ts
function Ii(e, t, n = {}) {
	let { run: r, unsupported: i, invalidInput: a, actionable: o } = kt(e, "humidifier", t, n.onError);
	return {
		onToggle: () => {
			o() && r("toggle");
		},
		onTargetChange: t.targetHumidity == null ? void 0 : (e) => {
			if (!o()) return;
			if (!Number.isFinite(e)) {
				a(`${t.entityId} humidity must be finite`);
				return;
			}
			let n = Math.round(e);
			n < t.minHumidity || n > t.maxHumidity ? a(`${t.entityId} humidity is outside its supported range`) : r("set_humidity", { humidity: n });
		},
		onModeChange: t.modes && t.modes.length > 0 ? (e) => {
			o() && (t.modes?.includes(e) ? r("set_mode", { mode: e }) : i(`${t.entityId} does not support mode ${e}`));
		} : void 0
	};
}
// packages/core/src/ha/mappers/humidifier.ts
var Li = /* @__PURE__ */ new Set([
	"humidifying",
	"drying",
	"idle",
	"off"
]), Ri = 0, zi = 100, Bi = (e) => {
	let t = x(e);
	return t != null && t >= 0 && t <= 100 ? t : void 0;
};
function Vi(e, t) {
	return e != null && t != null && e <= t ? {
		min: e,
		max: t
	} : e != null && t == null ? {
		min: e,
		max: zi
	} : e == null && t != null ? {
		min: Ri,
		max: t
	} : {
		min: Ri,
		max: zi
	};
}
function Hi(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e?.state === "on" ? "on" : e?.state === "off" ? "off" : "unavailable", a = i !== "unavailable", { min: o, max: s } = Vi(Bi(r.min_humidity), Bi(r.max_humidity)), c = Bi(r.humidity), l = S(r.action);
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		kind: r.device_class === "dehumidifier" ? "dehumidifier" : "humidifier",
		action: a && l && Li.has(l) ? l : void 0,
		currentHumidity: a ? Bi(r.current_humidity) : void 0,
		targetHumidity: a && c != null && c >= o && c <= s ? c : void 0,
		minHumidity: o,
		maxHumidity: s,
		mode: S(r.mode),
		modes: w(r.available_modes),
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		lastSeen: i === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/humidifier.ts
function Ui(e, { name: t, area: n, lastSeen: r, history: i, loadHistory: a = !0, onActionError: o } = {}) {
	_r(e, ["humidifier"], "useHaHumidifier");
	let s = R(), c = B(e), l = lr(e), u = vr(), d = G(), f = pr([e], a && i === void 0, u), p = (0, I.useMemo)(() => kn(f, e, u), [
		f,
		e,
		u
	]), m = (0, I.useMemo)(() => Hi(c, e, {
		name: t,
		area: n ?? l,
		lastSeen: r,
		now: u,
		hourCycle: d
	}), [
		c,
		e,
		t,
		n,
		l,
		r,
		u,
		d
	]), h = (0, I.useMemo)(() => Ii(s, m, { onError: o }), [
		s,
		m,
		o
	]);
	return {
		entity: m,
		history: i ?? p,
		actions: h
	};
}
// packages/core/src/ha/actions/sound.ts
function Wi(e, t, n = {}) {
	let { run: r, actionable: i } = kt(e, "switch", t, n.onError), { volume: a } = n;
	return {
		onToggle: () => {
			i() && r("toggle");
		},
		onVolumeChange: a ? (t) => {
			if (!i()) return;
			let r = kt(e, "number", {
				entityId: a.entityId,
				state: "on"
			}, n.onError);
			if (!Number.isFinite(t)) {
				r.invalidInput(`${a.entityId} volume must be finite`);
				return;
			}
			let o = a.min + Math.min(100, Math.max(0, t)) / 100 * (a.max - a.min), s = a.min + Math.round((o - a.min) / a.step) * a.step, c = Math.min(a.max, Math.max(a.min, +s.toFixed(6)));
			r.run("set_value", { value: c });
		} : void 0
	};
}
// packages/core/src/ha/mappers/sound.ts
function Gi(e) {
	let t = e.slice(e.indexOf(".") + 1), n = t.includes("_") ? t.slice(0, t.lastIndexOf("_")) : void 0;
	return [`number.${t}_volume`, ...n ? [`number.${n}_volume`] : []];
}
function Ki(e) {
	if (!e) return;
	let t = x(e.attributes.min) ?? 0, n = x(e.attributes.max) ?? 100, r = x(e.attributes.step) ?? 1;
	if (!(n > t) || !(r > 0)) return;
	let i = e.state === "unknown" || e.state === "unavailable" || e.state.trim().length === 0 ? NaN : Number(e.state), a = Number.isFinite(i) && i >= t && i <= n ? i : void 0;
	return {
		entityId: e.entity_id,
		min: t,
		max: n,
		step: r,
		value: a
	};
}
function qi(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e?.state === "on" ? "on" : e?.state === "off" ? "off" : "unavailable", a = Ki(n.volumeEntity);
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		volume: i !== "unavailable" && a?.value != null ? Math.round((a.value - a.min) / (a.max - a.min) * 100) : void 0,
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		lastSeen: i === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/sound.ts
function Ji(e, { volumeEntityId: t, name: n, area: r, lastSeen: i, history: a, loadHistory: o = !0, onActionError: s } = {}) {
	_r(e, ["switch"], "useHaSound");
	let c = R(), l = B(e), u = pe(t ? [t] : Gi(e)).find((e) => e != null), d = (0, I.useMemo)(() => Ki(u), [u]), f = lr(e), p = vr(), m = G(), h = pr([e], o && a === void 0, p), g = (0, I.useMemo)(() => kn(h, e, p), [
		h,
		e,
		p
	]), _ = (0, I.useMemo)(() => qi(l, e, {
		name: n,
		area: r ?? f,
		lastSeen: i,
		now: p,
		hourCycle: m,
		volumeEntity: u
	}), [
		l,
		e,
		n,
		r,
		f,
		i,
		p,
		m,
		u
	]), v = (0, I.useMemo)(() => Wi(c, _, {
		onError: s,
		volume: d
	}), [
		c,
		_,
		s,
		d
	]);
	return {
		entity: _,
		history: a ?? g,
		actions: v
	};
}
// packages/core/src/entities/lock/code.ts
function Yi(e) {
	if (e) try {
		return new RegExp(e);
	} catch {
		return;
	}
}
function Xi(e) {
	if (!e) return;
	let t = e.replace(/^\^/, "").replace(/\$$/, "").replace(/\{\d+(,\d*)?\}|[+*?]/g, "");
	return /^(?:\\d|\[0-9\])+$/.test(t) ? "number" : "text";
}
function Zi(e, t) {
	let n = Yi(e);
	return n == null || n.test(t);
}
// packages/core/src/ha/actions/lock.ts
var Qi = /* @__PURE__ */ new Set(["add_default_code", "invalid_code"]);
function K(e, t, n = {}) {
	let { attempt: r, report: i, actionable: a, unsupported: o } = kt(e, "lock", t, n.onError), s = async (e, n) => {
		if (!a()) return "failed";
		if (n && !Zi(t.codePattern, n)) return "wrong_code";
		let o = await r(e, n ? { code: n } : {});
		return o ? o.translationKey && Qi.has(o.translationKey) ? "wrong_code" : (i(o), "failed") : "done";
	};
	return {
		onLock: (e) => s("lock", e),
		onUnlock: (e) => s("unlock", e),
		onOpen: (e) => t.state !== "unavailable" && !t.supportsOpen ? (o(`${t.entityId} does not support open`), Promise.resolve("failed")) : s("open", e)
	};
}
// packages/core/src/ha/mappers/lock.ts
var $i = /* @__PURE__ */ new Set([
	"locked",
	"unlocked",
	"locking",
	"unlocking",
	"jammed",
	"open",
	"opening"
]), ea = 1;
function ta(e, t, n = {}) {
	let r = b(e?.attributes) ? e.attributes : {}, i = typeof e?.state == "string" && $i.has(e.state) ? e.state : "unavailable", a = i === "unavailable", o = x(r.supported_features) ?? 0, s = S(r.code_format);
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		supportsOpen: (o & ea) !== 0,
		codeFormat: Xi(s) ?? null,
		codePattern: s,
		changedBy: a ? void 0 : S(r.changed_by),
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		battery: a ? void 0 : Qe(r) ?? Ze(n.batteryEntity),
		lastSeen: a ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/lock.ts
function na(e, { batteryEntityId: t, name: n, area: r, lastSeen: i, onActionError: a } = {}) {
	_r(e, ["lock"], "useHaLock");
	let o = R(), s = B(e), c = B(t ?? ""), l = lr(e), u = vr(), d = G(), f = (0, I.useMemo)(() => ta(s, e, {
		name: n,
		area: r ?? l,
		lastSeen: i,
		batteryEntity: c,
		now: u,
		hourCycle: d
	}), [
		s,
		e,
		n,
		r,
		l,
		i,
		c,
		u,
		d
	]);
	return {
		entity: f,
		actions: (0, I.useMemo)(() => K(o, f, { onError: a }), [
			o,
			f,
			a
		])
	};
}
// packages/core/src/ha/actions/fan.ts
function ra(e, t, n = {}) {
	let { run: r, actionable: i, unsupported: a, invalidInput: o } = kt(e, "fan", t, n.onError), s = t.entityId, c = (e, t) => i() ? e ? !0 : (a(`${s} does not support ${t}`), !1) : !1;
	return {
		...Ot(t, r, i),
		onToggle: () => {
			t.state === "on" ? c(t.supportsTurnOff !== !1, "turning off") && r("turn_off") : c(t.supportsTurnOn !== !1, "turning on") && r("turn_on");
		},
		onPercentageChange: (e) => {
			c(t.supportsSpeed, "speed") && (Number.isFinite(e) ? r("set_percentage", { percentage: Math.min(100, Math.max(1, Math.floor(e))) }) : o(`${s} speed must be finite`));
		},
		onPresetChange: (e) => {
			c(t.supportsPreset, "preset modes") && (t.presetModes?.includes(e) ? r("set_preset_mode", { preset_mode: e }) : o(`${s} has no preset "${e}"`));
		},
		onOscillateChange: (e) => {
			c(t.supportsOscillate, "oscillation") && r("oscillate", { oscillating: e === !0 });
		},
		onDirectionChange: (e) => {
			c(t.supportsDirection, "direction") && (e !== "forward" && e !== "reverse" ? o(`${s} direction must be forward or reverse`) : r("set_direction", { direction: e }));
		}
	};
}
function ia(e) {
	return e == null || !Number.isFinite(e) || e <= 0 || e > 100 ? 100 : Math.min(100, Math.max(1, Math.round(100 / e)));
}
function aa(e, t) {
	let n = Math.max(1, Math.round(t)), r = Math.min(n, Math.max(1, Math.round(e / 100 * n)));
	return r < n && oa(r + 1, n) === e ? r + 1 : r;
}
function oa(e, t) {
	let n = Math.max(1, Math.round(t));
	return Math.min(100, Math.max(1, Math.floor(Math.min(n, Math.max(1, e)) * 100 / n)));
}
var sa = (e) => e >= 2 && e <= 10, ca = (e, t) => sa(t) ? `Speed ${aa(e, t)}` : `${Math.round(e)}%`, la = {
	SET_SPEED: 1,
	OSCILLATE: 2,
	DIRECTION: 4,
	PRESET_MODE: 8,
	TURN_OFF: 16,
	TURN_ON: 32
}, ua = /* @__PURE__ */ new Set(["forward", "reverse"]);
function da(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e?.state === "on" || e?.state === "off" || e?.state === "unknown" ? e.state : "unavailable", a = i === "on", o = i === "on" || i === "off", s = x(r.supported_features) ?? 0, c = (e) => (s & e) !== 0, l = c(la.SET_SPEED), u = x(r.percentage), d = a && l && u != null && u > 0 && u <= 100 ? Math.round(u) : void 0, f = c(la.PRESET_MODE) ? w(r.preset_modes) ?? [] : [], p = f.length > 0, m = S(r.preset_mode), h = a && m != null && f.includes(m) ? m : void 0, g = c(la.OSCILLATE), _ = o && g && typeof r.oscillating == "boolean" ? r.oscillating : void 0, v = c(la.DIRECTION), y = S(r.direction), b = o && v && y != null && ua.has(y) ? y : void 0;
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		...r.assumed_state === !0 && { assumedState: !0 },
		supportsTurnOn: c(la.TURN_ON),
		supportsTurnOff: c(la.TURN_OFF),
		supportsSpeed: l,
		percentage: d,
		speedCount: l ? ia(x(r.percentage_step)) : void 0,
		supportsPreset: p,
		presetModes: p ? f : void 0,
		presetMode: h,
		supportsOscillate: g,
		oscillating: _,
		supportsDirection: v,
		direction: b,
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		lastSeen: i === "unavailable" ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/fan.ts
function fa(e, { name: t, area: n, lastSeen: r, history: i, loadHistory: a = !0, onActionError: o } = {}) {
	_r(e, ["fan"], "useHaFan");
	let s = R(), c = B(e), l = lr(e), u = vr(), d = G(), f = pr([e], a && i === void 0, u), p = (0, I.useMemo)(() => kn(f, e, u), [
		f,
		e,
		u
	]), m = (0, I.useMemo)(() => da(c, e, {
		name: t,
		area: n ?? l,
		lastSeen: r,
		now: u,
		hourCycle: d
	}), [
		c,
		e,
		t,
		n,
		l,
		r,
		u,
		d
	]), h = (0, I.useMemo)(() => ra(s, m, { onError: o }), [
		s,
		m,
		o
	]);
	return {
		entity: m,
		history: i ?? p,
		actions: h
	};
}
// packages/core/src/ha/actions/guestWifi.ts
var pa = {
	button: "press",
	input_button: "press",
	script: "turn_on"
}, ma = Object.keys(pa);
function ha(e, { onError: t, refresh: n, newCode: r } = {}) {
	let i = (n) => {
		let r = n?.entityId.slice(0, n.entityId.indexOf("."));
		if (!n || !r || !pa[r] || n.state === "unavailable") return;
		let i = kt(e, r, n, t);
		return async () => {
			let e = await i.attempt(pa[r]);
			e && i.report(e);
		};
	};
	return {
		onRefresh: i(n),
		onNewCode: i(r)
	};
}
// packages/core/src/entities/guard.ts
var ga = "Waiting", _a = (e) => `Waiting for the ${e}`, va = "Didn’t go through. Try again", ya = "Wrong code. Try again", ba = "Checking";
function xa(e) {
	let t = e.filter((e) => !!e).map((e) => e.toLowerCase());
	if (!t.length) return;
	let n = t.length === 1 ? t[0] : `${t.slice(0, -1).join(", ")} and ${t.at(-1)}`;
	return `${n[0].toUpperCase()}${n.slice(1)} ${t.length === 1 ? "asks" : "ask"} first.`;
}
// packages/core/src/entities/guestWifi/words.ts
var Sa = {
	d: 1440,
	h: 60,
	min: 1,
	s: 1 / 60
};
function Ca(e) {
	if (typeof e != "string" || !e.trim()) return;
	let t = 0;
	for (let n of e.split(",")) {
		let e = n.trim().match(/^(\d+)\s*(d|h|min|s)$/);
		if (!e) return;
		t += Number(e[1]) * Sa[e[2]];
	}
	return Math.round(t);
}
var wa = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`;
function Ta(e) {
	let t = Math.floor(e / 1440), n = Math.floor(e % 1440 / 60), r = e % 60;
	return t ? n ? `${wa(t, "day")} ${n} h` : wa(t, "day") : n ? r ? `${n} h ${r} min` : `${n} h` : `${Math.max(r, 1)} min`;
}
function Ea(e) {
	if (e.allowed == null) return;
	if (e.allowed === "unlimited") return "Unlimited uses";
	let t = Math.max(0, e.allowed - (e.used ?? 0));
	return e.allowed === 1 ? t ? "Single use" : "Used" : t === e.allowed ? wa(e.allowed, "use") : `${t} of ${e.allowed} uses left`;
}
function Da(e) {
	if (e.leftMinutes != null) return `${Ta(e.leftMinutes)} left`;
	if (e.lastsMinutes != null) return `Lasts ${Ta(e.lastsMinutes)}`;
}
var Oa = (e) => /^\d+(?:[\s-]\d+)*$/.test(e.trim()), ka = {
	"-": "dash",
	_: "underscore",
	" ": "space",
	".": "dot",
	"@": "at",
	"#": "hash",
	"!": "exclamation mark",
	"?": "question mark",
	"&": "ampersand",
	"*": "star",
	"/": "slash"
};
function Aa(e) {
	return Oa(e) ? ja(e).map((e) => e.split("").join(" ")).join(", ") : [...e].map((e) => ka[e] ?? (e === e.toLowerCase() ? e : `capital ${e}`)).join(" ");
}
var ja = (e) => e.split(/[\s-]+/).filter(Boolean), Ma = (e) => e.access === "password" ? "password" : "code", Na = (e) => e.access === "password" ? "No password" : "No code", Pa = (e) => e.access === "password" ? "No password is set. Make one to give." : "Every code has been used. Make a new one to give.", Fa = (e) => e ? `Made ${e}` : "";
function Ia(e) {
	let t = e.network ?? "the network";
	return e.access === "password" ? e.qr ? `Scan to join ${t}, or choose it in Wi-Fi settings and type the password.` : `Choose ${t} in Wi-Fi settings and type the password.` : `Join ${t}, then enter the code on the page that opens.`;
}
var La = "No QR code", Ra = (e) => `${La}. ${Ia({
	...e,
	qr: void 0
})}`, za = (e) => e.access === "password" ? "Devices already joined will need the new password." : "The codes already given keep working.", Ba = (e) => `Change the password for ${e.network ?? e.name}`, Va = (e) => `${Ba(e)}?`, Ha = xa(["Changing the password"]), Ua = (e) => /^(input_text|text)\./.test(e) ? "password" : "code";
function Wa(e) {
	let t = e.match(/^sensor\.(\w+)_voucher$/)?.[1];
	return t ? {
		qr: `image.${t}_qr_code`,
		newCode: `button.${t}_create`,
		refresh: `button.${t}_update`
	} : {};
}
var Ga = (e) => e != null && e.state !== "unavailable", Ka = (e) => {
	let t = x(e);
	return t != null && Number.isInteger(t) && t >= 0 ? t : void 0;
};
function qa(e, t, n = {}) {
	let { now: r, qrEntity: i, newCodeEntity: a } = n, o = e?.attributes ?? {}, s = e && e.state !== "unavailable" && e.state !== "unknown" ? S(e.state.trim()) : void 0, c = s ? "ready" : Ga(a) ? "none" : "unavailable", l = c !== "unavailable" && Ga(i) ? i : void 0, u = s ? Ka(o.quota) : void 0;
	return {
		entityId: t,
		name: n.name ?? "Guest Wi-Fi",
		area: n.area,
		state: c,
		access: n.access ?? Ua(t),
		network: c === "unavailable" ? void 0 : n.network ?? S(o.wlan_name) ?? S(l?.attributes.wlan_name),
		code: s,
		allowed: u === 0 ? "unlimited" : u,
		used: s ? Ka(o.used) : void 0,
		lastsMinutes: s ? Ca(o.duration) : void 0,
		leftMinutes: s ? Ca(o.status_expires) : void 0,
		created: s ? U(o.create_time, r, n.hourCycle) : void 0,
		lastUpdated: s ? U(o.last_pull ?? e?.last_updated, r, n.hourCycle) : void 0,
		lastSeen: c === "unavailable" ? n.lastSeen : void 0
	};
}
// packages/core/src/ha/useHaPicture.ts
function Ja(e) {
	let t = R(), n = k(B(e ?? ""));
	return (0, I.useMemo)(() => n && t.resolveUrl ? t.resolveUrl(n) : j(n), [t, n]);
}
function Ya(e) {
	let t = fe(), n = (0, I.useCallback)(() => {
		e && t?.(e);
	}, [t, e]);
	return t && e ? n : void 0;
}
// packages/core/src/ha/hooks/guestWifi.ts
function Xa(e, { access: t, network: n, qrEntityId: r, newCodeEntityId: i, refreshEntityId: a, name: o, area: s, lastSeen: c, onActionError: l } = {}) {
	_r(e, [
		"sensor",
		"input_text",
		"text"
	], "useHaGuestWifi");
	let u = R(), d = Wa(e), f = {
		qr: r ?? d.qr,
		newCode: i ?? d.newCode,
		refresh: a ?? d.refresh
	}, p = B(e), m = B(f.qr ?? ""), h = B(f.newCode ?? ""), g = B(f.refresh ?? ""), _ = Ja(f.qr), v = lr(e), y = vr(), b = G(), x = (0, I.useMemo)(() => {
		let r = qa(p, e, {
			name: o,
			area: s ?? v,
			lastSeen: c,
			now: y,
			hourCycle: b,
			qrEntity: m,
			newCodeEntity: h,
			access: t,
			network: n
		});
		return _ && r.state !== "unavailable" ? {
			...r,
			qr: _
		} : r;
	}, [
		p,
		e,
		o,
		s,
		v,
		c,
		y,
		b,
		m,
		h,
		t,
		n,
		_
	]), S = h?.state, C = g?.state;
	return {
		entity: x,
		actions: (0, I.useMemo)(() => ha(u, {
			onError: l,
			newCode: S == null || !f.newCode ? void 0 : {
				entityId: f.newCode,
				state: S
			},
			refresh: C == null || !f.refresh ? void 0 : {
				entityId: f.refresh,
				state: C
			}
		}), [
			u,
			l,
			f.newCode,
			S,
			f.refresh,
			C
		])
	};
}
// packages/core/src/entities/cover/words.ts
var Za = (e) => e.state !== "unavailable" && (Ir(e) > 0 || e.state === "open");
function Qa(e) {
	return e.state === "unavailable" ? "Unavailable" : e.state === "opening" ? "Opening" : e.state === "closing" ? "Closing" : e.state === "unknown" ? "Unknown" : Za(e) ? "Open" : "Closed";
}
var $a = (e) => e === 0 ? "Closed" : e === 100 ? "Open" : e === 50 ? "Half open" : `${e}% open`, eo = [
	{
		value: 0,
		label: "Closed"
	},
	{
		value: 50,
		label: "Angled"
	},
	{
		value: 100,
		label: "Open"
	}
], to = [{
	value: 0,
	label: "Closed"
}, {
	value: 100,
	label: "Open"
}], no = "Open", ro = (e) => `${no}${e ? ` since ${e}` : ""}`, io = {
	open: "Open",
	close: "Close"
}, ao = (e, t) => typeof e == "string" ? `${io[e]} ${t}?` : `Move ${t} to ${e.position}%?`;
function oo(e, t) {
	return [
		zr(e, t) ? "It opens now, and anyone outside can come in." : "It closes now. Check nothing is in its way.",
		t.state === "unknown" ? "Where it is isn't known." : null,
		t.supportsStop ? null : "It can't be stopped from here."
	].filter(Boolean).join(" ");
}
var so = (e, t) => typeof e == "string" ? `${io[e]} ${Or[t.deviceClass].toLowerCase()}` : `Move to ${e.position}%`, co = (e) => _a(Or[e.deviceClass].toLowerCase()), lo = xa(["Opening", "closing"]), uo = (e) => ({
	on: e,
	off: "Clear",
	today: "detected"
}), fo = {
	battery: {
		on: "Low",
		off: "Normal",
		today: "low"
	},
	battery_charging: {
		on: "Charging",
		off: "Not charging",
		today: "charging"
	},
	carbon_monoxide: uo("CO"),
	cold: {
		on: "Cold",
		off: "Normal",
		today: "cold"
	},
	connectivity: {
		on: "Connected",
		off: "Disconnected",
		today: "connected"
	},
	door: {
		on: "Offen",
		off: "Geschlossen",
		today: "open"
	},
	garage_door: {
		on: "Offen",
		off: "Geschlossen",
		today: "open"
	},
	gas: uo("Gas"),
	heat: {
		on: "Hot",
		off: "Normal",
		today: "hot"
	},
	light: {
		on: "Light",
		off: "Dark",
		today: "detected"
	},
	lock: {
		on: "Unlocked",
		off: "Locked",
		today: "unlocked"
	},
	moisture: {
		on: "Wet",
		off: "Dry",
		today: "wet"
	},
	motion: uo("Motion"),
	moving: {
		on: "Moving",
		off: "Still",
		today: "moving"
	},
	occupancy: {
		on: "Occupied",
		off: "Clear",
		today: "occupied"
	},
	opening: {
		on: "Offen",
		off: "Geschlossen",
		today: "open"
	},
	plug: {
		on: "Plugged in",
		off: "Unplugged",
		today: "plugged in"
	},
	power: {
		on: "Power",
		off: "No power",
		today: "powered"
	},
	presence: {
		on: "Home",
		off: "Away",
		today: "home"
	},
	problem: {
		on: "Problem",
		off: "OK",
		today: "faulty"
	},
	running: {
		on: "Running",
		off: "Not running",
		today: "running"
	},
	safety: {
		on: "Unsafe",
		off: "Safe",
		today: "unsafe"
	},
	smoke: uo("Smoke"),
	sound: uo("Sound"),
	tamper: {
		on: "Tampered",
		off: "Clear",
		today: "tampered"
	},
	update: {
		on: "Update",
		off: "Up to date",
		today: "pending"
	},
	vibration: uo("Vibration"),
	window: {
		on: "Offen",
		off: "Geschlossen",
		today: "open"
	}
}, po = {
	on: "Ein",
	off: "Aus",
	today: "on"
}, mo = (e) => typeof e == "string" && Object.hasOwn(fo, e), ho = {
	smoke: "Smoke alarm",
	gas: "Gas alarm",
	carbon_monoxide: "CO alarm",
	moisture: "Leak detected",
	heat: "Too hot",
	safety: "Unsafe",
	tamper: "Tampered",
	problem: "Problem",
	cold: "Too cold",
	battery: "Battery low",
	garage_door: "Open"
}, go = {
	smoke: "Smoke detected",
	gas: "Gas detected",
	carbon_monoxide: "Carbon monoxide detected",
	moisture: "Leak detected",
	heat: "Too hot",
	safety: "Unsafe",
	tamper: "Tampering detected",
	problem: "Problem reported",
	cold: "Too cold",
	battery: "Battery low",
	garage_door: "Open"
}, _o = (e) => e.state === "on" && e.deviceClass ? ho[e.deviceClass] : void 0, vo = /* @__PURE__ */ new Set(["garage_door"]);
function yo(e) {
	let t = _o(e);
	return t && e.deviceClass && vo.has(e.deviceClass) ? ro(e.lastChanged) : t;
}
function bo(e) {
	if (_o(e) && e.deviceClass) return vo.has(e.deviceClass) ? ro(e.lastChanged) : go[e.deviceClass];
}
var xo = (e) => e ? fo[e] : po;
function So(e) {
	if (e.state === "unavailable") return "Unavailable";
	let t = xo(e.deviceClass);
	return e.state === "on" ? t.on : t.off;
}
var Co = {
	door: "door",
	garage_door: "door",
	opening: "door",
	lock: "door",
	window: "window",
	moisture: "leak",
	smoke: "smoke",
	gas: "smoke",
	carbon_monoxide: "smoke",
	heat: "smoke",
	motion: "motion",
	occupancy: "motion",
	presence: "motion",
	moving: "motion",
	vibration: "motion",
	sound: "motion"
}, wo = (e) => e && Co[e] || "sensor";
// packages/core/src/ha/mappers/binarySensor.ts
function To(e, t, n = {}) {
	let r = b(e?.attributes) ? e.attributes : {}, i = e?.state === "on" ? "on" : e?.state === "off" ? "off" : "unavailable", a = i === "unavailable", o = r.device_class;
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		deviceClass: mo(o) ? o : void 0,
		lastChanged: U(e?.last_changed, n.now, n.hourCycle),
		changedAt: Te(e?.last_changed)?.getTime(),
		battery: a ? void 0 : Qe(r) ?? Ze(n.batteryEntity),
		lastSeen: a ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0
	};
}
// packages/core/src/ha/hooks/binarySensor.ts
function Eo(e, { batteryEntityId: t, name: n, area: r, lastSeen: i, history: a, loadHistory: o = !0 } = {}) {
	_r(e, ["binary_sensor"], "useHaBinarySensor");
	let s = B(e), c = B(t ?? ""), l = lr(e), u = vr(), d = G(), f = pr([e], o && a === void 0, u), p = (0, I.useMemo)(() => kn(f, e, u), [
		f,
		e,
		u
	]);
	return {
		entity: (0, I.useMemo)(() => To(s, e, {
			name: n,
			area: r ?? l,
			lastSeen: i,
			batteryEntity: c,
			now: u,
			hourCycle: d
		}), [
			s,
			e,
			n,
			r,
			l,
			i,
			c,
			u,
			d
		]),
		history: a ?? p
	};
}
// packages/core/src/ha/mappers/camera.ts
var Do = [
	"idle",
	"recording",
	"streaming"
];
function Oo(e, t, n = {}) {
	let r = b(e?.attributes) ? e.attributes : {}, i = e?.state?.trim() ?? "", a = !e || i === "" || i === "unknown" || i === "unavailable" ? "unavailable" : Do.includes(i) ? i : "other", o = a === "unavailable", s = r.motion_detection;
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: a,
		stateText: a === "other" ? Vt(i) : void 0,
		brand: S(r.brand),
		model: S(r.model_name),
		motionDetection: o || typeof s != "boolean" ? void 0 : s,
		lastChanged: o ? void 0 : U(e?.last_changed, n.now, n.hourCycle),
		lastSeen: o ? n.lastSeen : void 0
	};
}
// packages/core/src/ha/hooks/camera.ts
function ko(e, { name: t, area: n, lastSeen: r, still: i = !0 } = {}) {
	_r(e, ["camera"], "useHaCamera");
	let a = B(e), o = lr(e), s = vr(), c = G(), l = Ja(e);
	return { entity: (0, I.useMemo)(() => ({
		...Oo(a, e, {
			name: t,
			area: n ?? o,
			lastSeen: r,
			now: s,
			hourCycle: c
		}),
		picture: i ? l : void 0
	}), [
		a,
		e,
		t,
		n,
		o,
		r,
		s,
		c,
		l,
		i
	]) };
}
// packages/core/src/ha/actions/mediaPlayer.ts
function Ao(e, t, n = {}) {
	let { run: r, attempt: i, report: a, actionable: o, unsupported: s, invalidInput: c } = kt(e, "media_player", t, n.onError), l = t.entityId, u = (e, t) => o() ? e ? !0 : (s(`${l} does not support ${t}`), !1) : !1;
	return {
		onPlay: () => {
			u(t.supportsPlay, "play") && r("media_play");
		},
		onPause: () => {
			u(t.supportsPause, "pause") && r("media_pause");
		},
		onStop: () => {
			u(t.supportsStop, "stop") && r("media_stop");
		},
		onPrevious: () => {
			u(t.supportsPrevious, "previous track") && r("media_previous_track");
		},
		onNext: () => {
			u(t.supportsNext, "next track") && r("media_next_track");
		},
		onTurnOn: () => {
			u(t.supportsTurnOn, "turn on") && r("turn_on");
		},
		onTurnOff: () => {
			u(t.supportsTurnOff, "turn off") && r("turn_off");
		},
		onVolumeChange: (e) => {
			u(t.supportsVolume, "volume") && (Number.isFinite(e) ? r("volume_set", { volume_level: Math.round(Math.min(100, Math.max(0, e))) / 100 }) : c(`${l} volume must be finite`));
		},
		onSeek: async (e) => {
			if (!u(t.supportsSeek, "seek")) return !1;
			if (!Number.isFinite(e)) return c(`${l} seek position must be finite`), !1;
			let n = t.duration != null && Number.isFinite(t.duration) ? t.duration : Infinity, r = await i("media_seek", { seek_position: Math.min(n, Math.max(0, e)) });
			return r && a(r), !r;
		},
		onVolumeUp: () => {
			u(t.supportsVolumeStep || t.supportsVolume, "volume steps") && r("volume_up");
		},
		onVolumeDown: () => {
			u(t.supportsVolumeStep || t.supportsVolume, "volume steps") && r("volume_down");
		},
		onMuteChange: (e) => {
			u(t.supportsMute, "mute") && r("volume_mute", { is_volume_muted: e });
		},
		onSourceChange: (e) => {
			u(t.supportsSource, "sources") && (t.sources?.includes(e) ? r("select_source", { source: e }) : c(`${l} has no source "${e}"`));
		}
	};
}
// packages/core/src/ha/hooks/mediaPlayer.ts
function jo(e, { name: t, area: n, lastSeen: r, history: i, loadHistory: a = !0, onActionError: o } = {}) {
	let s = R(), c = B(e), l = lr(e), u = Ja(e), d = vr(), f = G(), p = pr([e], a && i === void 0, d), m = (0, I.useMemo)(() => Xn(p, e, d), [
		p,
		e,
		d
	]), h = (0, I.useMemo)(() => ln(c, e, {
		name: t,
		area: n ?? l,
		lastSeen: r,
		now: d,
		hourCycle: f
	}), [
		c,
		e,
		t,
		n,
		l,
		r,
		d,
		f
	]), g = (0, I.useMemo)(() => u && h.state !== "off" && h.state !== "standby" ? {
		...h,
		picture: u
	} : h, [h, u]), _ = (0, I.useMemo)(() => Ao(s, g, { onError: o }), [
		s,
		g,
		o
	]);
	return {
		entity: g,
		history: i ?? (a ? m : void 0),
		actions: _
	};
}
// packages/core/src/entities/numeric/words.ts
var Mo = (e, t = e) => ({
	label: e,
	long: t,
	picture: "air"
}), No = (e, t = e) => ({
	label: e,
	long: t,
	picture: "power"
}), Po = (e, t = e) => ({
	label: e,
	long: t,
	picture: "meter"
}), Fo = (e, t = e) => ({
	label: e,
	long: t,
	picture: "gauge"
}), Io = {
	apparent_power: No("Power", "Apparent power"),
	aqi: Mo("AQI", "Air quality index"),
	atmospheric_pressure: Fo("Pressure", "Atmospheric pressure"),
	carbon_dioxide: Mo("CO₂", "Carbon dioxide"),
	carbon_monoxide: Mo("CO", "Carbon monoxide"),
	current: No("Current"),
	data_rate: Fo("Data rate"),
	data_size: Fo("Data"),
	distance: Fo("Distance"),
	energy: Po("Energy"),
	frequency: Fo("Frequency"),
	gas: Po("Gas", "Gas use"),
	humidity: Fo("Humidity"),
	illuminance: Fo("Light", "Illuminance"),
	irradiance: Fo("Sunlight", "Irradiance"),
	moisture: Fo("Moisture"),
	nitrogen_dioxide: Mo("NO₂", "Nitrogen dioxide"),
	ozone: Mo("Ozone"),
	pm1: Mo("PM1", "Ultrafine particles"),
	pm10: Mo("PM10", "Coarse particles"),
	pm25: Mo("PM2.5", "Fine particles"),
	power: No("Power"),
	power_factor: No("Power factor"),
	precipitation: Fo("Rain", "Precipitation"),
	precipitation_intensity: Fo("Rain rate", "Precipitation intensity"),
	pressure: Fo("Pressure"),
	reactive_power: No("Power", "Reactive power"),
	signal_strength: Fo("Signal", "Signal strength"),
	sound_pressure: Fo("Noise", "Sound pressure"),
	speed: Fo("Speed"),
	temperature: Fo("Temperature"),
	volatile_organic_compounds: Mo("VOC", "Volatile organic compounds"),
	volatile_organic_compounds_parts: Mo("VOC", "Volatile organic compounds"),
	voltage: No("Voltage"),
	volume: Po("Volume"),
	water: Po("Water", "Water use"),
	weight: Fo("Weight"),
	wind_speed: Fo("Wind", "Wind speed")
}, q = {
	label: "",
	long: "Reading",
	picture: "gauge"
}, Lo = (e) => typeof e == "string" && Object.hasOwn(Io, e), Ro = (e) => e ? Io[e] : q;
function zo({ deviceClass: e, unit: t }) {
	let n = e ? Io[e].long : void 0;
	return n && t ? `${n} in ${t}` : n ?? (t ? `In ${t}` : "");
}
var Bo = (e) => /^[A-Z][a-z ]*$/.test(e) ? e.toLowerCase() : e;
function Vo(e, t) {
	if (e === "temperature") return t === "above" ? "Too warm" : "Too cold";
	let n = e ? Io[e].label : "";
	return !n || `High ${n}`.length > 13 ? t === "above" ? "Too high" : "Too low" : `${t === "above" ? "High" : "Low"} ${Bo(n)}`;
}
var Ho = (e, t) => $t(Yt(e), t);
function Uo(e, t) {
	let n = t === "above" ? e.warnAbove : e.warnBelow;
	return n == null ? "" : [
		e.deviceClass ? Io[e.deviceClass].long : "",
		t,
		Ho(n, e.unit)
	].filter(Boolean).join(" ");
}
function Wo(e) {
	let t = [e.warnBelow == null ? null : `below ${Ho(e.warnBelow, e.unit)}`, e.warnAbove == null ? null : `above ${Ho(e.warnAbove, e.unit)}`].filter(Boolean);
	return t.length ? `Warns ${t.join(" or ")}` : "";
}
// packages/core/src/ha/mappers/numeric.ts
function Go(e, t, n = {}) {
	let r = b(e?.attributes) ? e.attributes : {}, i = e && e.state !== "unavailable" && e.state !== "unknown" ? "ok" : "unavailable", a = i === "unavailable", o = Number(e?.state), s = !a && e.state.trim() !== "" && Number.isFinite(o) ? o : void 0, c = r.device_class, l = r.state_class;
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		value: s,
		unit: n.unit ?? S(r.unit_of_measurement),
		deviceClass: Lo(c) ? c : void 0,
		stateClass: qt(l) ? l : void 0,
		lastUpdated: a ? void 0 : U(e?.last_updated, n.now, n.hourCycle),
		lastSeen: a ? n.lastSeen ?? U(S(r.last_seen), n.now, n.hourCycle) : void 0,
		warnAbove: n.warnAbove,
		warnBelow: n.warnBelow
	};
}
// packages/core/src/ha/hooks/numeric.ts
function Ko(e, { name: t, area: n, unit: r, lastSeen: i, warnAbove: a, warnBelow: o, history: s, loadHistory: c = !0 } = {}) {
	let l = B(e), u = lr(e), d = vr(), f = G(), p = pr([e], c && s === void 0, d), m = (0, I.useMemo)(() => Kn(p, e, d), [
		p,
		e,
		d
	]);
	return {
		entity: (0, I.useMemo)(() => Go(l, e, {
			name: t,
			area: n ?? u,
			unit: r,
			lastSeen: i,
			warnAbove: a,
			warnBelow: o,
			now: d,
			hourCycle: f
		}), [
			l,
			e,
			t,
			n,
			u,
			r,
			i,
			a,
			o,
			d,
			f
		]),
		history: s ?? m
	};
}
// packages/core/src/ha/actions/vacuum.ts
function qo(e, t, n = {}) {
	let { run: r, actionable: i, unsupported: a, invalidInput: o } = kt(e, "vacuum", t, n.onError), s = t.entityId, c = (e, t) => i() ? e ? !0 : (a(`${s} does not support ${t}`), !1) : !1;
	return {
		onStart: () => {
			c(t.supportsStart, "start") && r("start");
		},
		onPause: () => {
			c(t.supportsPause, "pause") && r("pause");
		},
		onReturnToBase: () => {
			c(t.supportsReturn, "return to base") && r("return_to_base");
		},
		onLocate: () => {
			c(t.supportsLocate, "locate") && r("locate");
		},
		onFanSpeedChange: (e) => {
			c(t.supportsFanSpeed, "fan speeds") && (t.fanSpeeds?.includes(e) ? r("set_fan_speed", { fan_speed: e }) : o(`${s} has no fan speed "${e}"`));
		}
	};
}
// packages/core/src/ha/hooks/vacuum.ts
function Jo(e, { name: t, area: n, lastSeen: r, history: i, loadHistory: a = !0, onActionError: o } = {}) {
	let s = R(), c = B(e), l = lr(e), u = vr(), d = G(), f = pr([e], a && i === void 0, u), p = (0, I.useMemo)(() => An(f, e, u), [
		f,
		e,
		u
	]), m = (0, I.useMemo)(() => mn(c, e, {
		name: t,
		area: n ?? l,
		lastSeen: r,
		now: u,
		hourCycle: d
	}), [
		c,
		e,
		t,
		n,
		l,
		r,
		u,
		d
	]), h = (0, I.useMemo)(() => qo(s, m, { onError: o }), [
		s,
		m,
		o
	]);
	return {
		entity: m,
		history: i ?? p,
		actions: h
	};
}
// packages/core/src/entities/calendar/words.ts
var Yo = {
	now: "Now",
	allDay: "All day",
	today: "Today",
	tomorrow: "Tomorrow",
	free: "Free",
	waiting: "Waiting…",
	noReading: "No reading yet",
	untitled: "Busy",
	busy: "busy",
	busySaid: "Hours busy by hour today, those ahead included.",
	eventsToday: "Events today",
	comingUp: "Coming up"
}, Xo = 864e5, Zo = (e) => {
	let t = new Date(e);
	return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
}, Qo = (e, t = 1) => {
	let n = new Date(e);
	return new Date(n.getFullYear(), n.getMonth(), n.getDate() + t).getTime();
}, $o = (e, t) => Math.round((Zo(t) - Zo(e)) / Xo), es = (e, t = H()) => {
	let n = new Date(e);
	return ye(n.getHours(), n.getMinutes(), t);
}, ts = (e, t = H()) => {
	let n = new Date(e);
	return ve(n.getHours(), n.getMinutes(), t);
};
function ns(e, t) {
	let n = $o(t, e);
	if (n === 0) return Yo.today;
	if (n === 1) return Yo.tomorrow;
	let r = new Date(e);
	return n > 1 && n < 7 ? r.toLocaleDateString("en-US", { weekday: "short" }) : r.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
}
var rs = (e) => Qo(e.end - 1, 0), is = (e, t) => e.start <= t && t < e.end, as = (e, t) => e != null && is(e, t), os = (e, t) => e.end <= t, ss = (e, t) => Math.max(0, Math.ceil((e.start - t) / 6e4)), cs = (e) => `In ${W(Math.max(1, e))}`;
function ls(e, t, n = H()) {
	if (is(e, t)) {
		if (e.allDay) {
			let n = rs(e);
			if ($o(t, n) <= 0) return {
				label: Yo.today,
				value: Yo.allDay,
				line: Yo.allDay
			};
			let r = ns(n, t);
			return {
				label: "Until",
				value: r,
				line: `Until ${r}`
			};
		}
		let r = es(e.end, n), i = $o(t, e.end) === 0 ? r : `${ns(e.end, t)} ${r}`;
		return {
			label: "Until",
			value: i,
			line: `Until ${i}`
		};
	}
	let r = ns(e.start, t);
	if (e.allDay) return {
		label: r,
		value: Yo.allDay,
		line: r
	};
	if ($o(t, e.start) === 0) return {
		label: "In",
		value: W(Math.max(1, ss(e, t))),
		line: cs(ss(e, t))
	};
	let i = es(e.start, n);
	return {
		label: r,
		value: i,
		line: `${r} ${i}`
	};
}
var us = (e, t, n = H()) => is(e, t) && !e.allDay ? Yo.now : ls(e, t, n).line;
function ds(e, t, n = H()) {
	if (e.allDay) {
		let n = rs(e);
		return $o(t, n) <= 0 || $o(e.start, n) === 0 ? Yo.allDay : `Until ${ns(n, t)}`;
	}
	let r = $o(e.start, e.end - 1) === 0, i = new Date(e.end).toLocaleDateString("en-US", { weekday: "short" }), a = ts(e.start, n), o = ts(e.end, n);
	return `${r && a.period === o.period ? a.time : es(e.start, n)}–${r ? "" : `${i} `}${es(e.end, n)}`;
}
var fs = (e, t, n = H()) => e.allDay ? ns(e.start, t) : `${ns(e.start, t)} ${es(e.start, n)}`, ps = (e) => [e.location, e.calendar].filter(Boolean).join(" · ") || void 0;
function ms(e) {
	return {
		label: "For",
		value: e <= 1 ? "today" : `${e} days`,
		line: e <= 1 ? "Free today" : `Free for ${e} days`
	};
}
function hs(e, t) {
	return e > 0 ? `${e} left today` : t > 0 ? "Nothing more today" : "Nothing today";
}
function gs(e, t) {
	let n = e <= 1 ? "Today only" : `Next ${e} days`;
	return t > 1 ? `${t} calendars · ${n}` : n;
}
function _s(e) {
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	if (!t) return;
	let [n, r, i] = [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	], a = new Date(n, r - 1, i);
	return a.getFullYear() === n && a.getMonth() === r - 1 && a.getDate() === i ? a.getTime() : void 0;
}
var vs = (e) => Te(e.replace(" ", "T"))?.getTime();
function ys(e, t) {
	let n = S(e.start) ?? S(e.start_time), r = S(e.end) ?? S(e.end_time);
	if (!n || !r) return;
	let i = _s(n), a = i != null || e.all_day === !0, o = i ?? vs(n), s = _s(r) ?? vs(r);
	if (o == null || s == null || (a && s <= o && (s = Qo(o)), s <= o)) return;
	let c = (S(e.summary) ?? S(e.message))?.trim() || Yo.untitled, l = S(e.location)?.trim() || void 0;
	return {
		title: c,
		start: o,
		end: s,
		allDay: a,
		...l && { location: l },
		...t && { calendar: t }
	};
}
function bs(e, t) {
	if (Array.isArray(e)) return e.flatMap((e) => bs(e, t));
	if (!b(e)) return [];
	let n = b(e.result) ? e.result : void 0, r = ((b(n?.response) ? n.response : void 0) ?? (b(e.response) ? e.response : void 0) ?? e)[t], i = b(r) ? r.events : void 0;
	return Array.isArray(i) ? i.filter(b) : [];
}
function xs(e, t) {
	let n = t.length > 1;
	return t.flatMap(({ entityId: t, name: r }) => bs(e, t).flatMap((e) => ys(e, n ? r ?? t : void 0) ?? [])).sort((e, t) => e.start - t.start || e.end - t.end);
}
function Ss(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e && e.state !== "unavailable" && e.state !== "unknown" ? "ok" : "unavailable", a = n.now ?? /* @__PURE__ */ new Date(), o = Math.max(1, Math.round(n.days ?? 7)), s = Zo(a.getTime()), c = Qo(s, o), l = i === "ok" ? ys(r) : void 0, u = n.events ?? (l ? [l] : void 0), d = i === "ok" && u ? u.filter((e) => e.end > s && e.start < c) : void 0;
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		events: d,
		now: a.getTime(),
		days: o,
		calendars: Math.max(1, n.calendars ?? 1),
		lastUpdated: i === "ok" ? U(e?.last_updated, a, n.hourCycle) : void 0,
		lastSeen: i === "unavailable" ? n.lastSeen : void 0
	};
}
// packages/core/src/entities/calendar/agenda.ts
var Cs = (e, t) => e.start - t.start || e.end - t.end || e.title.localeCompare(t.title), ws = (e, t) => Math.max(0, $o(t, Math.max(e.start, t)));
function Ts(e = [], t) {
	let n = Zo(t), r = Qo(t), i = e.filter((e) => e.start < r && e.end > n).sort((e, t) => Number(t.allDay) - Number(e.allDay) || Cs(e, t)), a = i.filter((e) => !os(e, t)), o = e.filter((e) => e.start >= r).sort(Cs);
	return {
		next: e.filter((e) => !os(e, t)).sort((e, n) => ws(e, t) - ws(n, t) || Number(e.allDay) - Number(n.allDay) || Cs(e, n))[0],
		today: i,
		left: a,
		later: o
	};
}
function Es(e = [], t) {
	let n = Zo(t), r = e.filter((e) => !e.allDay), i = [], a = 0;
	for (let e = 0; e < 24; e++) {
		let t = new Date(n).setHours(e), o = new Date(n).setHours(e + 1), s = r.map((e) => [Math.max(t, e.start), Math.min(o, e.end)]).filter(([e, t]) => t > e).sort((e, t) => e[0] - t[0]), c = 0, l = t;
		for (let [e, t] of s) {
			let n = Math.max(e, l);
			t > n && (c += t - n, l = t);
		}
		a += c, i.push(o > t ? Math.min(1, c / (o - t)) : 0);
	}
	return {
		samples: i,
		currentHour: new Date(t).getHours(),
		busyMinutes: Math.round(a / 6e4)
	};
}
// packages/core/src/ha/hooks/calendar.ts
var Ds = (e, t, n, r) => Promise.all(t.map((t, i) => {
	let a = e.query("calendar", "get_events", {
		start_date_time: new Date(n).toISOString(),
		end_date_time: new Date(r).toISOString()
	}, {
		target: { entity_id: t },
		returnResponse: !0
	});
	return i === 0 ? a : a.catch(() => void 0);
}));
function Os(e, { calendarEntityIds: t = [], days: n = 7, name: r, area: i, lastSeen: a, events: o, loadEvents: s = !0, onEventsError: c, loadHistory: l = !0 } = {}) {
	_r(e, ["calendar"], "useHaCalendar");
	let u = B(e), d = lr(e), f = vr(), p = G(), m = (0, I.useRef)(c);
	m.current = c;
	let h = (0, I.useMemo)(() => [e, ...t.filter((t) => t !== e)], [e, t]), g = h.join(","), _ = Math.max(1, Math.round(n)), v = Zo(f.getTime()), y = Qo(v, _), b = Math.floor(f.getTime() / 36e5), { value: x, error: C } = $n(s && o === void 0 && u ? `calendar:${g}:${_}:${b}:${u.last_updated}` : void 0, (e) => Ds(e, h, v, y), { keepPrevious: !0 });
	(0, I.useEffect)(() => {
		C !== void 0 && m.current?.(C);
	}, [C]);
	let w = pe(h), T = h.map((e, t) => S(w[t]?.attributes.friendly_name) ?? e).join("\0"), E = (0, I.useMemo)(() => x === void 0 ? void 0 : xs(x, h.map((e, t) => ({
		entityId: e,
		name: T.split("\0")[t]
	}))), [
		x,
		g,
		T
	]), D = (0, I.useMemo)(() => Ss(u, e, {
		name: r,
		area: i ?? d,
		lastSeen: a,
		now: f,
		hourCycle: p,
		events: o ?? E,
		days: _,
		calendars: h.length
	}), [
		u,
		e,
		r,
		i,
		d,
		a,
		f,
		p,
		o,
		E,
		_,
		h.length
	]);
	return {
		entity: D,
		history: (0, I.useMemo)(() => l ? Es(D.events, D.now) : void 0, [
			l,
			D.events,
			D.now
		])
	};
}
// packages/core/src/ha/mappers/sun.ts
var ks = (e) => Te(e)?.getTime();
function As(e, t, n = {}) {
	let r = e?.attributes ?? {}, i = e && e.state !== "unavailable" && e.state !== "unknown" ? "ok" : "unavailable", a = i === "ok", o = n.now ?? /* @__PURE__ */ new Date();
	return {
		entityId: t,
		name: n.name ?? S(r.friendly_name) ?? t,
		area: n.area,
		state: i,
		up: a && e.state === "above_horizon" ? !0 : a && e.state === "below_horizon" ? !1 : void 0,
		nextRising: a ? ks(r.next_rising) : void 0,
		nextSetting: a ? ks(r.next_setting) : void 0,
		nextDawn: a ? ks(r.next_dawn) : void 0,
		nextDusk: a ? ks(r.next_dusk) : void 0,
		nextNoon: a ? ks(r.next_noon) : void 0,
		elevation: a ? x(r.elevation) : void 0,
		azimuth: a ? x(r.azimuth) : void 0,
		now: o.getTime(),
		lastUpdated: a ? U(e?.last_updated, o, n.hourCycle) : void 0,
		lastSeen: a ? void 0 : n.lastSeen
	};
}
// packages/core/src/entities/sun/position.ts
var js = Math.PI / 180, Ms = 864e5, Ns = -.833, Ps = (e, t, n) => Fs(e, t, n).elevation;
function Fs(e, t, n) {
	let r = e / Ms + 2440587.5 - 2451545, i = (280.46 + .9856474 * r) % 360, a = (357.528 + .9856003 * r) % 360 * js, o = (i + 1.915 * Math.sin(a) + .02 * Math.sin(2 * a)) * js, s = (23.439 - 4e-7 * r) * js, c = Math.atan2(Math.cos(s) * Math.sin(o), Math.cos(o)), l = Math.asin(Math.sin(s) * Math.sin(o)), u = ((18.697374558 + 24.06570982441908 * r) % 24 * 15 + n) * js - c, d = t * js, f = Math.sin(d) * Math.sin(l) + Math.cos(d) * Math.cos(l) * Math.cos(u);
	return {
		elevation: Math.asin(Math.max(-1, Math.min(1, f))) / js,
		azimuth: ((Math.atan2(Math.sin(u), Math.cos(u) * Math.sin(d) - Math.tan(l) * Math.cos(d)) / js + 180) % 360 + 360) % 360
	};
}
function Is(e) {
	let t = new Date(e);
	return {
		start: new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime(),
		end: new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1).getTime()
	};
}
function Ls(e, t) {
	let n, r;
	for (let i = 1; i < e.length; i++) {
		let a = e[i - 1] - t, o = e[i] - t;
		a < 0 && o >= 0 && n === void 0 && (n = (i - 1 + a / (a - o)) / (e.length - 1)), a >= 0 && o < 0 && (r = (i - 1 + a / (a - o)) / (e.length - 1));
	}
	return {
		up: n,
		down: r
	};
}
function Rs(e, t, n) {
	let { start: r, end: i } = Is(e), a = i - r, o = Array.from({ length: 145 }, (e, i) => Ps(r + a * i / 144, t, n)), s = Math.max(...o), { up: c, down: l } = Ls(o, Ns), u = new Date(r), d = (e) => (new Date(u.getFullYear(), u.getMonth(), u.getDate(), e).getTime() - r) * 144 / a, f = Array.from({ length: 24 }, (e, t) => {
		let n = Math.max(...o.slice(Math.ceil(d(t)), Math.floor(d(t + 1)) + 1));
		return s > 0 && n > 0 ? Math.min(1, n / s) : 0;
	}), p = 0;
	for (let e = 1; e < o.length; e++) {
		let t = o[e - 1] - Ns, n = o[e] - Ns;
		p += t >= 0 && n >= 0 ? 1 : t < 0 && n < 0 ? 0 : Math.max(t, n) / Math.abs(t - n);
	}
	let m = Math.min(1, Math.max(0, (e - r) / a));
	return {
		path: o,
		samples: f,
		currentHour: new Date(e).getHours(),
		nowAt: m,
		riseAt: c,
		setAt: l,
		rise: c === void 0 ? void 0 : Math.round((r + c * a) / 6e4) * 6e4,
		set: l === void 0 ? void 0 : Math.round((r + l * a) / 6e4) * 6e4,
		peak: s,
		daylightMinutes: Math.round(p / 144 * a / 6e4)
	};
}
// packages/core/src/ha/hooks/sun.ts
var zs = (e) => e.callApi("get_config");
function Bs(e, { name: t, area: n, lastSeen: r, latitude: i, longitude: a, loadHistory: o = !0 } = {}) {
	_r(e, ["sun"], "useHaSun");
	let s = B(e), c = lr(e), l = vr(), u = G(), d = i !== void 0 && a !== void 0, f = $n(o && !d ? "config" : void 0, zs, { cache: !0 }).value, p = d ? i : x(f?.latitude), m = d ? a : x(f?.longitude), h = l.getTime(), g = (0, I.useMemo)(() => o && p !== void 0 && m !== void 0 ? Rs(h, p, m) : void 0, [
		o,
		p,
		m,
		h
	]);
	return {
		entity: (0, I.useMemo)(() => As(s, e, {
			name: t,
			area: n ?? c,
			lastSeen: r,
			now: l,
			hourCycle: u
		}), [
			s,
			e,
			t,
			n,
			c,
			r,
			l,
			u
		]),
		history: g
	};
}
// packages/core/src/entities/dyson/labels.ts
var Vs = {
	forward: "Front",
	reverse: "Back"
}, Hs = [
	45,
	90,
	180,
	350
], Us = {
	min: 5,
	max: 355,
	ahead: 180
}, Ws = [
	0,
	45,
	90,
	180,
	350
], Gs = (e) => e === 0 ? "Still" : `${e}°`;
function Ks(e, t, n = Us) {
	let r = t <= 0 ? 0 : Math.min(n.max - n.min, Math.max(30, Math.round(t))), i = Math.min(n.max - r, Math.max(n.min, Math.round(e - r / 2)));
	return {
		angle_low: i,
		angle_high: i + r
	};
}
var qs = (e, t) => Math.round((e + t) / 2);
function Js(e, t = Us.ahead) {
	let n = Math.round(e - t);
	return Math.abs(n) < 3 ? "ahead" : `${Math.abs(n)}° ${n < 0 ? "left" : "right"}`;
}
var Ys = (e) => `${e}°`;
function Xs(e, t) {
	return Hs.find((n) => Math.abs(t - e - n) <= 2);
}
function Zs(e) {
	return e.oscillating == null ? null : e.oscillating ? e.oscillationModes?.length ? e.oscillationMode ?? null : "on" : "off";
}
function Qs(e) {
	return e.state === "on" ? e.heatOn && e.heatTarget != null ? `Heat ${e.heatTarget}${e.heatUnit === "°F" ? "°F" : "°"}` : e.auto ? "Auto" : e.nightMode ? "Night" : e.oscillating && e.oscillationLow != null && e.oscillationHigh != null && e.oscillationLow === e.oscillationHigh ? `Points ${Js(e.oscillationLow, e.angles?.ahead)}` : e.oscillating ? e.oscillationMode ? `Sweeps ${e.oscillationMode}` : "Oscillating" : null : null;
}
function $s(e) {
	let t = e.speedCount ?? 0, n = e.oscillationModes ?? [], r = [
		e.supportsSpeed && t >= 2 ? sa(t) ? `${t} speeds` : "variable speed" : null,
		e.supportsAuto ? "auto" : null,
		e.supportsOscillate ? n.length ? `oscillates ${n.join(", ")}` : "oscillates" : null,
		e.supportsDirection ? "front or back airflow" : null,
		e.supportsNightMode ? "night mode" : null,
		e.supportsHeat ? "heats" : null
	].filter(Boolean).join(", ");
	return r ? r.charAt(0).toUpperCase() + r.slice(1) : "On / off";
}
// packages/core/src/ha/actions/dyson.ts
function ec(e, t, n = {}) {
	let { onError: r } = n, i = ra(e, t, { onError: r }), { run: a, actionable: o, unsupported: s, invalidInput: c } = kt(e, "fan", t, r), l = t.entityId, u = (e, t) => o() ? e ? !0 : (s(`${l} does not support ${t}`), !1) : !1, d = (n, i) => kt(e, n, {
		entityId: i,
		state: t.state
	}, r).run, f = (e) => Hs.find((t) => Ys(t) === e), p = t.angles ?? Us, m = !!t.supportsOscillate && (t.oscillationBy === "angle" || t.oscillationBy === "number"), h = t.oscillationLow, g = t.oscillationHigh, _ = t.oscillationCentre ?? (h != null && g != null ? qs(h, g) : p.ahead), v = (e, r) => {
		if (t.oscillationBy === "number") {
			let t = e == null ? n.angleSpanEntityId : n.angleCenterEntityId;
			if (!t) {
				s(`${l} has no oscillation ${e == null ? "angle" : "centre"} slider`);
				return;
			}
			d("number", t)("set_value", { value: e ?? r });
			return;
		}
		let i = r ?? (h != null && g != null ? g - h : 0);
		d("dyson_local", l)("set_angle", Ks(e ?? _, i, p));
	};
	return {
		onToggle: i.onToggle,
		onPercentageChange: i.onPercentageChange,
		onDirectionChange: i.onDirectionChange,
		onOscillateChange: i.onOscillateChange,
		onAutoChange: (e) => {
			if (!u(t.supportsAuto, "auto mode")) return;
			let n = e ? t.autoPreset : t.manualPreset;
			n ? a("set_preset_mode", { preset_mode: n }) : s(`${l} has no preset that leaves auto mode`);
		},
		onOscillationModeChange: (e) => {
			if (u(t.supportsOscillate && !!t.oscillationModes?.length, "an oscillation range")) {
				if (!t.oscillationModes.includes(e)) c(`${l} has no oscillation range "${e}"`);
				else if (t.oscillationBy === "select") {
					if (!n.oscillationModeEntityId) {
						s(`${l} has no oscillation mode select`);
						return;
					}
					d("select", n.oscillationModeEntityId)("select_option", { option: e });
				} else v(void 0, f(e));
			}
		},
		onAimChange: (e) => {
			u(m, "oscillation angles") && (!Number.isFinite(e) || e < p.min || e > p.max ? c(`${l} aims from ${p.min} to ${p.max}°`) : v(Math.round(e), void 0));
		},
		onSpreadChange: (e) => {
			u(m, "oscillation angles") && (!Number.isFinite(e) || e < 0 || e > p.max - p.min || e > 0 && e < 30 ? c(`${l} sweeps 0, or 30 to ${p.max - p.min}°`) : v(void 0, Math.round(e)));
		},
		onNightModeChange: (e) => {
			u(t.supportsNightMode && !!n.nightModeEntityId, "night mode") && d("switch", n.nightModeEntityId)(e === !0 ? "turn_on" : "turn_off");
		},
		onHeatChange: (e) => {
			u(t.supportsHeat && !!n.heatEntityId, "heat") && d("climate", n.heatEntityId)("set_hvac_mode", { hvac_mode: e === !0 ? "heat" : t.heatOffMode ?? "cool" });
		},
		onHeatTargetChange: (e) => {
			if (!u(t.supportsHeat && !!n.heatEntityId, "heat")) return;
			if (!Number.isFinite(e)) {
				c(`${l} heat target must be finite`);
				return;
			}
			let r = t.heatStep ?? 1, i = Math.round(e / r) * r, a = Math.min(t.heatMax ?? 37, Math.max(t.heatMin ?? 1, i));
			d("climate", n.heatEntityId)("set_temperature", { temperature: Number(a.toFixed(1)) });
		}
	};
}
// packages/core/src/entities/dyson/air.ts
var tc = [
	"pm25",
	"pm10",
	"voc",
	"no2",
	"hcho"
], nc = {
	pm25: {
		label: "PM2.5",
		long: "Fine particles"
	},
	pm10: {
		label: "PM10",
		long: "Coarse particles"
	},
	voc: {
		label: "VOC",
		long: "Volatile organic compounds"
	},
	no2: {
		label: "NO₂",
		long: "Nitrogen dioxide"
	},
	hcho: {
		label: "HCHO",
		long: "Formaldehyde"
	}
}, rc = {
	pm25: [
		35,
		53,
		70
	],
	pm10: [
		50,
		75,
		100
	],
	voc: [
		3,
		6,
		8
	],
	no2: [
		3,
		6,
		8
	],
	hcho: [
		.099,
		.299,
		.499
	]
}, ic = [
	"good",
	"fair",
	"poor",
	"very_poor"
], ac = {
	good: "Good",
	fair: "Fair",
	poor: "Poor",
	very_poor: "Very poor"
};
function oc(e, t) {
	let n = rc[e].findIndex((e) => t <= e);
	return ic[n === -1 ? 3 : n];
}
function sc(e) {
	if (e.state === "unavailable") return;
	let t;
	for (let n of e.air) {
		if (n.value == null) continue;
		let e = oc(n.pollutant, n.value);
		(!t || ic.indexOf(e) > ic.indexOf(t.band)) && (t = {
			band: e,
			lead: {
				...n,
				value: n.value
			}
		});
	}
	return t;
}
function cc(e) {
	return e.value == null ? "—" : e.pollutant === "hcho" ? e.value.toFixed(2) : e.pollutant === "voc" || e.pollutant === "no2" ? String(Math.round(e.value * 10) / 10) : String(Math.round(e.value));
}
var lc = (e) => e.unit ? `${cc(e)} ${e.unit}` : cc(e), uc = (e) => e ? `Air ${ac[e.band].toLowerCase()}` : void 0, dc = {
	hepa: "HEPA filter",
	carbon: "Carbon filter",
	combined: "Filter"
}, fc = (e) => e.state === "unavailable" ? [] : e.filters.filter((e) => e.percent != null && e.percent <= 10);
function pc(e) {
	let t = sc(e);
	if (t && (t.band === "poor" || t.band === "very_poor")) {
		let e = ac[t.band];
		return {
			kind: "air",
			word: `${e} air`,
			said: `${e} air: ${nc[t.lead.pollutant].long} ${lc(t.lead)}`
		};
	}
	let n = fc(e);
	if (n.length) return {
		kind: "filter",
		word: "Change filter",
		said: `Change filter: ${n.map((e) => `${dc[e.kind]} at ${Math.round(e.percent)}%`).join(", ")}`
	};
}
function mc(e) {
	return pc(e) ? "advisory" : void 0;
}
// packages/core/src/ha/mappers/dyson.ts
function hc(e) {
	let t = /^fan\.(\w+)$/.exec(e);
	if (!t) return;
	let n = t[1], r = (...e) => e.map((e) => `sensor.${n}_${e}`);
	return {
		pm25: r("pm_2_5", "pm2_5"),
		pm10: r("pm_10", "pm10"),
		voc: r("volatile_organic_compounds_index", "voc"),
		no2: r("nitrogen_dioxide_index", "no2"),
		hcho: r("hcho", "formaldehyde"),
		temperature: r("temperature"),
		humidity: r("humidity"),
		hepaFilter: r("hepa_filter_life"),
		carbonFilter: r("carbon_filter_life"),
		filter: r("filter_life"),
		filterPercentage: r("filter_life_percentage"),
		nightMode: [`switch.${n}_night_mode`],
		heat: [`climate.${n}`],
		oscillationMode: [`select.${n}_oscillation_mode`, `select.${n}_oscillation`],
		angleCenter: [`number.${n}_oscillation_center_angle`],
		angleSpan: [`number.${n}_oscillation_angle`],
		angleLow: [`number.${n}_oscillation_low_angle`],
		angleHigh: [`number.${n}_oscillation_high_angle`]
	};
}
var gc = [
	...tc,
	"temperature",
	"humidity",
	"hepaFilter",
	"carbonFilter",
	"filter",
	"filterPercentage",
	"nightMode",
	"heat",
	"oscillationMode",
	"angleCenter",
	"angleSpan",
	"angleLow",
	"angleHigh"
];
function _c(e, t, n) {
	return e === "voc" && n === "mg/m³" ? { value: t == null ? null : Math.round(t * 1e3) / 10 } : e === "no2" && n === "µg/m³" ? { value: t == null ? null : t / 10 } : {
		value: t,
		...n && { unit: n }
	};
}
var vc = (e) => e != null && e.state !== "unavailable" && e.state !== "unknown", yc = (e) => vc(e) ? x(Number(e.state)) ?? null : null;
function bc(e) {
	let { angleCenter: t, angleSpan: n, angleLow: r, angleHigh: i } = e, a = t ?? r;
	if (!a) return;
	let o = x(a.attributes?.min) ?? 0, s = x(a.attributes?.max) ?? 350, c = {
		min: o,
		max: s,
		ahead: Math.round((o + s) / 2)
	}, l = (e) => e && vc(e) ? x(Number(e.state)) : void 0, u = l(t), d = l(n);
	if (u != null && d != null) {
		let e = Math.floor(d / 2), t = Math.max(o, u - e), n = Math.min(s, u + e);
		return t === o ? n = Math.min(s, o + d) : n === s && (t = Math.max(o, s - d)), {
			low: t,
			high: n,
			angles: c,
			live: !0
		};
	}
	let f = l(r), p = l(i);
	return f != null && p != null ? {
		low: f,
		high: p,
		angles: c,
		live: !0
	} : {
		low: c.ahead,
		high: c.ahead,
		angles: c,
		live: !1
	};
}
function xc(e, t) {
	if (!t || S(t.attributes?.unit_of_measurement) !== "%") return;
	let n = yc(t);
	return {
		kind: e,
		percent: n == null ? null : Math.min(100, Math.max(0, n))
	};
}
function Sc(e, t, n = {}) {
	let { companions: r = {} } = n, i = da(e, t, n), a = i.presetModes ?? [], o = {
		...i,
		state: i.state === "unknown" ? "unavailable" : i.state
	};
	delete o.assumedState, delete o.supportsPreset, delete o.presetModes, delete o.presetMode;
	let s = e?.attributes ?? {}, c = o.state !== "unavailable", l = a.find((e) => e.toLowerCase() === "auto"), u = a.find((e) => e !== l), d = S(s.preset_mode), f = tc.flatMap((e) => {
		let t = r[e];
		return t ? [{
			pollutant: e,
			..._c(e, yc(t), S(t.attributes?.unit_of_measurement))
		}] : [];
	}), p = [
		xc("hepa", r.hepaFilter),
		xc("carbon", r.carbonFilter),
		xc("combined", r.filter) ?? xc("combined", r.filterPercentage)
	].filter((e) => e != null), m = r.oscillationMode, h = m ? w(m.attributes?.options) ?? [] : [], g = bc(r), _ = g?.low ?? x(s.angle_low), v = g?.high ?? x(s.angle_high), y = g ? "number" : h.length ? "select" : _ != null && v != null ? "angle" : void 0, b = _ != null && v != null ? Xs(_, v) : void 0, E = !o.supportsOscillate || !y ? {} : y === "select" ? {
		oscillationModes: h,
		oscillationMode: c && m && vc(m) && h.includes(m.state) ? m.state : void 0,
		oscillationBy: y
	} : {
		oscillationModes: Hs.map(Ys),
		oscillationMode: c && b != null ? Ys(b) : void 0,
		oscillationCentre: Math.round((_ + v) / 2),
		...c && g?.live !== !1 && {
			oscillationLow: _,
			oscillationHigh: v
		},
		angles: g?.angles ?? Us,
		oscillationBy: y
	}, D = r.nightMode, O = r.heat, k = O ? C(O.attributes?.hvac_modes) : [], A = k.includes("heat"), j = k.includes("cool") ? "cool" : k.includes("fan_only") ? "fan_only" : void 0, M = A && c && vc(O), N = r.temperature && vc(r.temperature) ? yc(r.temperature) ?? void 0 : void 0, P = r.humidity && vc(r.humidity) ? yc(r.humidity) ?? void 0 : void 0, F = T(r.temperature?.attributes?.unit_of_measurement);
	return {
		...o,
		supportsAuto: l != null,
		auto: l != null && c ? d === l : void 0,
		autoPreset: l,
		manualPreset: u,
		...E,
		supportsNightMode: D != null,
		nightMode: D && c && (D.state === "on" || D.state === "off") ? D.state === "on" : void 0,
		supportsHeat: A,
		...A && j && { heatOffMode: j },
		...M && {
			heatOn: O.state === "heat",
			heating: O.state === "heat" && S(O.attributes?.hvac_action) === "heating",
			heatTarget: x(O.attributes?.temperature)
		},
		...A && {
			heatMin: x(O.attributes?.min_temp) ?? 1,
			heatMax: x(O.attributes?.max_temp) ?? 37,
			heatStep: x(O.attributes?.target_temp_step) ?? 1,
			heatUnit: F ?? "°C"
		},
		...N != null && {
			temperature: N,
			...F && { temperatureUnit: F }
		},
		...P != null && { humidity: P },
		air: c ? f : [],
		filters: c ? p : []
	};
}
// packages/core/src/ha/hooks/dyson.ts
function Cc(e, { companions: t, name: n, area: r, lastSeen: i, history: a, loadHistory: o = !0, onActionError: s } = {}) {
	_r(e, ["fan"], "useHaDyson");
	let c = R(), l = B(e), u = hc(e), d = gc.map((e) => {
		let n = t?.[e];
		return n == null ? u?.[e] ?? [] : n ? [n] : [];
	}), f = pe(d.flat()), p = (0, I.useMemo)(() => {
		let e = 0;
		return d.map((t) => {
			let n = e;
			e += t.length;
			let r = t.findIndex((e, t) => f[n + t] != null);
			return r === -1 ? void 0 : {
				id: t[r],
				raw: f[n + r]
			};
		});
	}, [f]), m = (0, I.useMemo)(() => Object.fromEntries(gc.flatMap((e, t) => p[t] ? [[e, p[t].raw]] : [])), [p]), h = (e) => p[gc.indexOf(e)]?.id, g = h("nightMode"), _ = h("heat"), v = h("oscillationMode"), y = h("angleCenter"), b = h("angleSpan"), x = lr(e), S = vr(), C = G(), w = pr([e], o && a === void 0, S), T = (0, I.useMemo)(() => kn(w, e, S), [
		w,
		e,
		S
	]), E = (0, I.useMemo)(() => Sc(l, e, {
		name: n,
		area: r ?? x,
		lastSeen: i,
		now: S,
		hourCycle: C,
		companions: m
	}), [
		l,
		e,
		n,
		r,
		x,
		i,
		S,
		C,
		m
	]), D = (0, I.useMemo)(() => ec(c, E, {
		nightModeEntityId: g,
		heatEntityId: _,
		oscillationModeEntityId: v,
		angleCenterEntityId: y,
		angleSpanEntityId: b,
		onError: s
	}), [
		c,
		E,
		g,
		_,
		v,
		y,
		b,
		s
	]);
	return {
		entity: E,
		history: a ?? T,
		actions: D
	};
}
// packages/core/src/ha/energy.ts
var wc = "energy/get_prefs";
async function Tc(e) {
	let t;
	try {
		t = await e({ type: wc });
	} catch {
		return;
	}
	if (!b(t) || !Array.isArray(t.energy_sources)) return;
	let n = t.energy_sources.filter((e) => b(e) && typeof e.type == "string");
	return {
		...t,
		energy_sources: n
	};
}
var Ec = (e) => e === 3 || e?.error?.code === 3;
// node_modules/home-assistant-js-websocket/dist/messages.js
function Dc() {
	return { type: "get_states" };
}
function Oc(e, t, n, r, i) {
	let a = {
		type: "call_service",
		domain: e,
		service: t,
		target: r,
		return_response: i
	};
	return n && (a.service_data = n), a;
}
// node_modules/home-assistant-js-websocket/dist/util.js
var kc = (e, t, n, r) => {
	let [i, a, o] = e.split(".", 3);
	return Number(i) > t || Number(i) === t && (r === void 0 ? Number(a) >= n : Number(a) > n) || r !== void 0 && Number(i) === t && Number(a) === n && Number(o) >= r;
}, Ac = (e) => {
	let t = [];
	function n(e) {
		let n = [];
		for (let r = 0; r < t.length; r++) t[r] === e ? e = null : n.push(t[r]);
		t = n;
	}
	function r(n, r) {
		e = r ? n : Object.assign(Object.assign({}, e), n);
		let i = t;
		for (let t = 0; t < i.length; t++) i[t](e);
	}
	return {
		get state() {
			return e;
		},
		action(t) {
			function n(e) {
				r(e, !1);
			}
			return function() {
				let r = [e];
				for (let e = 0; e < arguments.length; e++) r.push(arguments[e]);
				let i = t.apply(this, r);
				if (i != null) return i instanceof Promise ? i.then(n) : n(i);
			};
		},
		setState: r,
		clearState() {
			e = void 0;
		},
		subscribe(e) {
			return t.push(e), () => {
				n(e);
			};
		}
	};
}, jc = 5e3, Mc = (e, t, n, r, i = { unsubGrace: !0 }) => {
	if (e[t]) return e[t];
	let a = 0, o, s, c = Ac(), l = () => {
		if (!n) throw Error("Collection does not support refresh");
		return n(e).then((e) => c.setState(e, !0));
	}, u = () => l().catch((t) => {
		if (e.connected) throw t;
	}), d = () => {
		s === void 0 ? (r && (o = r(e, c), o.catch((e) => {
			if (!Ec(e)) throw e;
		})), n && (e.addEventListener("ready", u), u()), e.addEventListener("disconnected", m)) : (clearTimeout(s), s = void 0);
	}, f = () => {
		s = void 0, o && o.then((e) => {
			e();
		}, () => void 0), c.clearState(), e.removeEventListener("ready", u), e.removeEventListener("disconnected", m);
	}, p = () => {
		s = setTimeout(f, jc);
	}, m = () => {
		s && (clearTimeout(s), f());
	};
	return e[t] = {
		get state() {
			return c.state;
		},
		refresh: l,
		subscribe(e) {
			a++, a === 1 && d();
			let t = c.subscribe(e);
			return c.state !== void 0 && setTimeout(() => e(c.state), 0), () => {
				t(), a--, a || (i.unsubGrace ? p() : f());
			};
		}
	}, e[t];
}, Nc = (e) => e.sendMessagePromise(Dc()), Pc = (e, t, n, r, i, a) => e.sendMessagePromise(Oc(t, n, r, i, a));
// node_modules/home-assistant-js-websocket/dist/entities.js
function Fc(e, t, n) {
	let r = n ? {} : Object.assign({}, e.state);
	if (t.a) for (let e in t.a) {
		let n = t.a[e], i = (/* @__PURE__ */ new Date(n.lc * 1e3)).toISOString();
		r[e] = {
			entity_id: e,
			state: n.s,
			attributes: n.a,
			context: typeof n.c == "string" ? {
				id: n.c,
				parent_id: null,
				user_id: null
			} : n.c,
			last_changed: i,
			last_updated: n.lu ? (/* @__PURE__ */ new Date(n.lu * 1e3)).toISOString() : i
		};
	}
	if (t.r) for (let e of t.r) delete r[e];
	if (t.c) for (let e in t.c) {
		let n = r[e];
		if (!n) {
			console.warn("Received state update for unknown entity", e);
			continue;
		}
		n = Object.assign({}, n);
		let { "+": i, "-": a } = t.c[e], o = i?.a || a?.a, s = o ? Object.assign({}, n.attributes) : n.attributes;
		if (i && (i.s !== void 0 && (n.state = i.s), i.c && (typeof i.c == "string" ? n.context = Object.assign(Object.assign({}, n.context), { id: i.c }) : n.context = Object.assign(Object.assign({}, n.context), i.c)), i.lc ? n.last_updated = n.last_changed = (/* @__PURE__ */ new Date(i.lc * 1e3)).toISOString() : i.lu && (n.last_updated = (/* @__PURE__ */ new Date(i.lu * 1e3)).toISOString()), i.a && Object.assign(s, i.a)), a?.a) for (let e of a.a) delete s[e];
		o && (n.attributes = s), r[e] = n;
	}
	e.setState(r, !0);
}
var Ic = async (e, t) => {
	let n = !0, r = () => {
		n = !0;
	};
	e.addEventListener("ready", r);
	try {
		let i = await e.subscribeMessage((e) => {
			Fc(t, e, n), n = !1;
		}, { type: "subscribe_entities" });
		return () => {
			e.removeEventListener("ready", r), i();
		};
	} catch (t) {
		throw e.removeEventListener("ready", r), t;
	}
};
function Lc(e, t) {
	let n = e.state;
	if (n === void 0) return;
	let { entity_id: r, new_state: i } = t.data;
	if (i) e.setState({ [i.entity_id]: i });
	else {
		let t = Object.assign({}, n);
		delete t[r], e.setState(t, !0);
	}
}
async function Rc(e) {
	let t = await Nc(e), n = {};
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		n[r.entity_id] = r;
	}
	return n;
}
var zc = (e, t) => e.subscribeEvents((e) => Lc(t, e), "state_changed"), Bc = (e) => kc(e.haVersion, 2022, 4, 0) ? Mc(e, "_ent", void 0, Ic) : Mc(e, "_ent", Rc, zc), Vc = (e, t) => Bc(e).subscribe(t);
// packages/core/src/websocket.ts
function Hc(e) {
	return {
		subscribeEntities: (t) => Vc(e, t),
		subscribeConnection(t) {
			let n = () => t("connected"), r = () => t("disconnected"), i = () => t("error");
			return e.addEventListener("ready", n), e.addEventListener("disconnected", r), e.addEventListener("reconnect-error", i), () => {
				e.removeEventListener("ready", n), e.removeEventListener("disconnected", r), e.removeEventListener("reconnect-error", i);
			};
		},
		callService: (t, n, r, i = {}) => Pc(e, t, n, r, i.target, i.returnResponse),
		sendMessage: (t, n = {}) => e.sendMessagePromise({
			...n,
			type: t
		}),
		resolveUrl: (t) => M(t, e.options.auth?.data.hassUrl),
		close: () => e.close()
	};
}
// packages/core/src/lovelace/errorBoundary.tsx
var Uc = class extends I.Component {
	state = {};
	static getDerivedStateFromError(e) {
		return { error: e };
	}
	componentDidUpdate(e) {
		this.state.error && e.config !== this.props.config && this.setState({ error: void 0 });
	}
	render() {
		return this.state.error ? /* @__PURE__ */ (0, L.jsxs)("div", {
			className: "hd-config-error",
			role: "alert",
			children: ["The dashboard stopped: ", this.state.error.message]
		}) : this.props.children;
	}
}, Wc = _(), Gc = (e, t) => ({
	states: e.states,
	entities: e.entities,
	devices: e.devices,
	areas: e.areas,
	floors: e.floors,
	...t && { energy: t }
}), Kc = /* @__PURE__ */ new WeakMap();
function qc(e) {
	let t = Kc.get(e);
	if (t) return t;
	let n = {
		settled: !1,
		done: Promise.resolve()
	};
	return n.done = Tc((t) => e.sendMessagePromise(t)).then((e) => {
		n.prefs = e, n.settled = !0;
	}), Kc.set(e, n), n;
}
function Jc(e) {
	if (document.head.querySelector(`link[href="${e}"]`)) return;
	let t = document.createElement("link");
	t.rel = "stylesheet", t.href = e, document.head.append(t);
}
var Yc = class extends HTMLElement {
	mountClass = "";
	fontHref;
	config;
	#e;
	#t;
	#n;
	#r;
	#i = (e) => {
		this.dispatchEvent(new CustomEvent("hass-more-info", {
			detail: { entityId: e },
			bubbles: !0,
			composed: !0
		}));
	};
	paintHost(e, t) {}
	#a;
	energyPrefs(e) {
		let t = qc(e.connection);
		return !t.settled && this.#a !== e.connection && (this.#a = e.connection, t.done.then(() => this.render())), t.prefs;
	}
	static heldEnergyPrefs(e) {
		return Kc.get(e.connection)?.prefs;
	}
	setConfig(e) {
		this.config = this.parse(e), s("config:parsed"), this.render();
	}
	set hass(e) {
		let t = this.#e;
		this.#e = e, t || s("hass:ready"), this.#t && t?.connection === e.connection || (this.#t = F(Hc(e.connection), e.states), s("store:created")), (!t || t.connection !== e.connection || this.changed(t, e)) && this.render();
	}
	getCardSize() {
		return 12;
	}
	getGridOptions() {
		return {
			columns: "full",
			rows: "auto"
		};
	}
	connectedCallback() {
		if (s("element:connected", { first: !this.shadowRoot }), !this.shadowRoot) {
			let e = this.attachShadow({ mode: "open" }), t = document.createElement("style");
			t.textContent = this.styles, this.#r = document.createElement("div"), this.mountClass && (this.#r.className = this.mountClass), e.append(t, this.#r), this.fontHref && Jc(this.fontHref);
		}
		this.render();
	}
	disconnectedCallback() {
		queueMicrotask(() => {
			this.isConnected || (this.#n?.unmount(), this.#n = void 0);
		});
	}
	render() {
		let e = this.config, t = this.#e;
		if (!e || !t || !this.#t || !this.#r || !this.isConnected) return;
		let n = !this.#n;
		s("render:start", { first: n }), this.paintHost(e, t), n && this.#t.connect().catch(() => void 0), this.#n ??= (0, Wc.createRoot)(this.#r), this.#n.render(/* @__PURE__ */ (0, L.jsx)(Uc, {
			config: e,
			children: /* @__PURE__ */ (0, L.jsx)(de, {
				store: this.#t,
				moreInfo: this.#i,
				children: this.draw(e, t)
			})
		})), n && c("render:painted", { first: n });
	}
};
function Xc(e, t, n, r) {
	customElements.get(e) || (customElements.define(e, t), window.customCards ??= [], window.customCards.push({
		type: e,
		name: n,
		description: r,
		preview: !1
	}));
}
// packages/core/src/lovelace/styles.ts
function Zc(e) {
	return e.replace(/:root:not\(([^)]*)\)/g, ":host(:not($1))").replace(/:root((?:\[[^\]]*\])+)/g, ":host($1)").replace(/:root\b/g, ":host");
}
// packages/core/src/lovelace/actionMessage.ts
function Qc(e, t, n) {
	if (!e || e.translationKey === "invalid_code") return null;
	let r = e.entityId?.split(".", 2)[1]?.replaceAll("_", " ") ?? "device", i = r.charAt(0).toUpperCase() + r.slice(1), a = typeof t?.attributes.friendly_name == "string" ? t.attributes.friendly_name : i;
	return e.code === "not_connected" ? {
		title: "Home Assistant is not connected",
		detail: "The command was not sent. Wait for the connection to return."
	} : e.code === "transport_unknown" ? {
		title: `${a} may not have changed`,
		detail: "Check its current state before sending another command."
	} : e.code === "unsupported" || e.code === "invalid_input" ? {
		title: `${a} can’t do that`,
		detail: "Open the device in Home Assistant for details."
	} : {
		title: `${a} didn’t respond`,
		detail: n ? "Retry the command, or check Home Assistant." : "Check Home Assistant, then try again from the control."
	};
}
// packages/core/src/lovelace/useActionStatus.ts
function $c() {
	let e = R(), t = z((e) => e.lastActionError), n = z((e) => t?.entityId ? e.entities[t.entityId] : void 0), [r, i] = (0, I.useState)(!1), a = e.canRetryLastAction?.() === !0, o = Qc(t, n, a);
	return o ? {
		...o,
		canRetry: a,
		retrying: r,
		retry() {
			i(!0), e.retryLastAction?.().catch(() => void 0).finally(() => i(!1));
		},
		dismiss: () => e.clearActionError?.()
	} : null;
}
// packages/core/src/lovelace/strategy.ts
var el = "Home", tl = "mdi:view-dashboard-outline", nl = (e) => `ll-strategy-dashboard-${e.type}`, rl = (e) => `ll-strategy-view-${e.type}`;
function il(e, t) {
	throw Error(`${e.name}: ${t}`);
}
var al = (e) => [
	"type",
	"title",
	...e.options ?? []
];
function ol(e, t) {
	(!t || typeof t != "object" || Array.isArray(t)) && il(e, "the strategy's config must be a mapping.");
	let n = t, r = al(e), i = Object.keys(n).filter((e) => !r.includes(e));
	i.length && il(e, `unknown ${i.length === 1 ? "key" : "keys"} ${i.map((e) => `"${e}"`).join(", ")}. The strategy takes ${r.slice(1).join(", ")}.`);
	for (let t of r.slice(1)) n[t] !== void 0 && typeof n[t] != "string" && il(e, `"${t}" must be text.`);
	return n;
}
function sl(e, t) {
	let n = Object.fromEntries((e.options ?? []).flatMap((e) => t[e] === void 0 ? [] : [[e, t[e]]]));
	return {
		type: e.card,
		title: t.title ?? el,
		...n
	};
}
function cl(e, t) {
	return {
		type: "panel",
		cards: [sl(e, ol(e, t))]
	};
}
function ll(e, t) {
	return { views: [{
		title: e.name,
		path: "home",
		...cl(e, t)
	}] };
}
var ul = (e) => ({
	type: e.type,
	strategyType: "dashboard",
	name: e.name,
	description: e.description,
	...e.documentationURL && { documentationURL: e.documentationURL }
});
function dl(e) {
	class t extends HTMLElement {
		static getCreateSuggestions() {
			return {
				title: e.name,
				icon: e.icon ?? tl
			};
		}
		static async generate(t) {
			return ll(e, t);
		}
		static shouldRegenerate() {
			return !1;
		}
	}
	class n extends HTMLElement {
		static async generate(t) {
			return cl(e, t);
		}
		static shouldRegenerate() {
			return !1;
		}
	}
	customElements.get(nl(e)) || customElements.define(nl(e), t), customElements.get(rl(e)) || customElements.define(rl(e), n), window.customStrategies ??= [], window.customStrategies.some((t) => t.type === e.type && t.strategyType === "dashboard") || window.customStrategies.push(ul(e));
}
// packages/core/src/lovelace/layout.ts
var fl = (e) => e.slice(0, e.indexOf(".")), pl = (e) => typeof e?.attributes.device_class == "string" ? e.attributes.device_class : void 0, ml = (e, t) => String(e[t]?.attributes.friendly_name ?? t), hl = (e) => (t, n) => ml(e, t).localeCompare(ml(e, n));
function gl(e, t) {
	let n = e.entities?.[t];
	return n?.area_id ?? (n?.device_id ? e.devices?.[n.device_id]?.area_id ?? void 0 : void 0);
}
function _l(e, t) {
	let n = gl(e, t);
	return n ? e.areas?.[n]?.name : void 0;
}
function vl(e, t = () => !0) {
	return Object.keys(e.states).filter((n) => {
		let r = e.entities?.[n];
		return !r?.hidden && !r?.entity_category && t(n);
	});
}
function yl(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.area, [...t.get(n.area) ?? [], n]);
	return [...t.entries()].sort(([e], [t]) => e == null ? 1 : t == null ? -1 : e.localeCompare(t)).map(([e, t]) => ({
		area: e,
		modules: t
	}));
}
function bl(e, t) {
	let n = e.find((e) => e.title.toLowerCase() === t.title.toLowerCase());
	n ? n.cards.push(...t.cards) : e.push(t);
}
function xl({ states: e, entities: t = {} }, n, r, i = "sensor") {
	let a = t[n]?.device_id;
	if (a) return Cl(e, t).get(a)?.find((a) => a !== n && a.startsWith(`${i}.`) && !t[a]?.hidden && pl(e[a]) === r);
}
var Sl = /* @__PURE__ */ new WeakMap();
function Cl(e, t) {
	let n = Sl.get(e);
	n || Sl.set(e, n = /* @__PURE__ */ new WeakMap());
	let r = n.get(t);
	if (!r) {
		r = /* @__PURE__ */ new Map();
		for (let n of Object.keys(e)) {
			let e = t[n]?.device_id;
			if (!e) continue;
			let i = r.get(e);
			i ? i.push(n) : r.set(e, [n]);
		}
		n.set(t, r);
	}
	return r;
}
var wl = [
	"hepa_filter_life",
	"carbon_filter_life",
	"filter_life"
];
function Tl({ states: e }) {
	return Object.keys(e).flatMap((t) => {
		let n = /^fan\.(\w+)$/.exec(t);
		if (!n) return [];
		let r = n[1];
		return !e[`switch.${r}_night_mode`] || !wl.some((t) => e[`sensor.${r}_${t}`]) ? [] : [e[`climate.${r}`] ? {
			fan: t,
			heat: `climate.${r}`
		} : { fan: t }];
	});
}
function El({ states: e, entities: t = {} }) {
	let n = (t) => ml(e, t), r = Object.keys(e).filter((e) => e.startsWith("sensor.") && !t[e]?.hidden && !t[e]?.entity_category), i = (e) => t[e]?.device_id ?? void 0, a = (n, r) => xl({
		states: e,
		entities: t
	}, n, r), o = /* @__PURE__ */ new Set(), s = [];
	for (let t of ["temperature", "humidity"]) for (let c of r.filter((n) => pl(e[n]) === t).sort((e, t) => n(e).localeCompare(n(t)))) {
		let e = i(c);
		if (o.has(c) || e && o.has(`device:${e}`)) continue;
		e && o.add(`device:${e}`), o.add(c);
		let n = t === "temperature" ? a(c, "humidity") : void 0, r = a(c, "battery");
		s.push({
			entity: c,
			...n && { humidity: n },
			...r && { battery: r }
		});
	}
	return s;
}
var Dl = [
	"door",
	"garage_door",
	"window",
	"opening",
	"moisture",
	"smoke",
	"gas",
	"carbon_monoxide",
	"safety"
], Ol = (e) => e != null && Dl.includes(e);
function kl({ states: e, entities: t = {} }) {
	return Object.keys(e).filter((n) => n.startsWith("binary_sensor.") && !t[n]?.hidden && !t[n]?.entity_category && Ol(pl(e[n]))).sort(hl(e)).map((n) => {
		let r = xl({
			states: e,
			entities: t
		}, n, "battery");
		return {
			entity: n,
			...r && { battery: r }
		};
	});
}
var Al = [
	"carbon_dioxide",
	"pm25",
	"pm10",
	"volatile_organic_compounds",
	"volatile_organic_compounds_parts"
];
function jl({ states: e, entities: t = {} }) {
	let n = Object.keys(e).filter((e) => e.startsWith("sensor.") && !t[e]?.hidden && !t[e]?.entity_category), r = (t) => Al.indexOf(pl(e[t])), i = /* @__PURE__ */ new Map();
	for (let e of n.filter((e) => r(e) >= 0)) {
		let n = t[e]?.device_id ? `device:${t[e].device_id}` : e, a = i.get(n);
		(!a || r(e) < r(a)) && i.set(n, e);
	}
	return [...i.values()].sort(hl(e));
}
var Ml = {
	actions: [
		"climate",
		"cover",
		"light",
		"toggle",
		"sound",
		"humidifier",
		"fan",
		"dyson",
		"mediaPlayer",
		"vacuum"
	],
	security: [
		"alarm",
		"lock",
		"binarySensor"
	],
	cameras: ["camera"],
	status: [
		"owlet",
		"guestWifi",
		"calendar"
	],
	glance: [
		"weather",
		"sun",
		"sensor",
		"numeric"
	]
}, Nl = Object.values(Ml).flat(), Pl = [
	...Ml.actions,
	"alarm",
	"lock"
], Fl = (e) => Pl.includes(e) ? "compact" : "standard";
function Il(e) {
	return Object.values(e.areas ?? {}).find((e) => e.name.trim().toLowerCase() === "outside")?.name;
}
function Ll(e) {
	let t = Object.keys(e.floors ?? {}), n = (e) => {
		let n = e ? t.indexOf(e) : -1;
		return n < 0 ? t.length : n;
	};
	return Object.values(e.areas ?? {}).map((e, t) => ({
		name: e.name,
		floor: n(e.floor_id),
		at: t
	})).sort((e, t) => e.floor - t.floor || e.at - t.at).map((e) => e.name);
}
var Rl = ["wall"];
function zl(e, t) {
	if (t.layout == null) return;
	let n = e.choice(t, "layout", "", Rl);
	for (let n of [
		"cards",
		"rows",
		"pages"
	]) t[n] != null && e.problem("layout", `"layout" lays the house out automatically: leave out "${n}", or leave out "layout"`);
	return n;
}
function Bl(e, { card: t, area: n, outside: r, order: i = [] }) {
	let a = [...e], o = (e) => {
		let n = Nl.indexOf(t(e));
		return n < 0 ? Nl.length : n;
	}, s = (e) => [...e].sort((e, t) => o(e) - o(t)), c = (e) => n(e) ?? (r && (t(e) === "weather" || t(e) === "sun") ? r : void 0), l = yl(a.map((e) => ({
		item: e,
		area: c(e)
	}))), u = (e) => e.trim().toLowerCase(), d = i.map(u), f = (e) => {
		let t = d.indexOf(u(e));
		return t < 0 ? d.length : t;
	}, p = l.flatMap((e) => e.area == null ? [] : [{
		area: e.area,
		items: s(e.modules.map((e) => e.item))
	}]).sort((e, t) => f(e.area) - f(t.area));
	return p.length < 2 ? {
		areas: [],
		house: s(a)
	} : {
		areas: p,
		house: s(l.find((e) => e.area == null)?.modules.map((e) => e.item) ?? [])
	};
}
function Vl(e, t, n = []) {
	let r = Math.max(1, Math.floor(t)), i = n.length ? Math.max(1, r - 1) : r, a = [[...e.slice(0, i), ...n.length ? [n] : []]];
	for (let t = i; t < e.length; t += r) a.push(e.slice(t, t + r));
	let o = a[0].length;
	return a.filter((e) => e.some((e) => e.length)).map((e) => ({
		columns: Math.max(1, o),
		cards: e.flatMap((e, t) => e.map((e) => ({
			card: e,
			column: t + 1
		})))
	}));
}
var Hl = (e, t) => e.trim().toLowerCase() === t.trim().toLowerCase();
function Ul(e, t) {
	if (e.title || !e.cards.length || e.cards.some((e) => !e.column || e.width !== 1)) return;
	let n = Math.max(e.columns ?? 0, ...e.cards.map((e) => e.column ?? 1)), r = Array.from({ length: n }, (n, r) => {
		let i = e.cards.filter((e) => e.column === r + 1).map((e) => t(e.item)), [a] = i;
		return a && i.every((e) => e && Hl(e, a)) ? a : void 0;
	});
	return r.some(Boolean) ? r : void 0;
}
var Wl = (e, t, n) => Math.max(1, Math.floor((e + n) / (t + n)));
function Gl(e, t, n) {
	return !e || e <= 0 ? t ?? 1 : t ? Math.min(t, Wl(e, n.min, n.gap)) : Math.min(n.max, Wl(e, n.preferred, n.gap));
}
var Kl = (e, t, n, r) => e && e > 0 ? (e - (t - 1) * r) / t * n + (n - 1) * r : void 0;
function ql(e, { tracks: t, columns: n, flow: r = "normal", align: i = "top" }) {
	let a = Math.max(1, Math.floor(t)), o = (e) => e.width === "full" ? a : Math.min(Math.max(1, Math.floor(e.width)), a), s = Math.max(0, ...e.map((e) => e.column ? e.column + (e.width === "full" ? 1 : e.width) - 1 : 0)), c = n ?? s, l = e.some((e) => e.column) && a >= c, u = [], d = (e, t, n, r) => {
		for (let i = e; i < e + r; i++) for (let e = t; e < t + n; e++) if (u[i]?.[e]) return !1;
		return !0;
	}, f = {
		row: 0,
		column: 0
	}, p = e.map((e) => {
		let t = o(e), n = Math.max(1, Math.floor(typeof e.height == "function" ? e.height(t) : e.height)), i = r === "dense" ? {
			row: 0,
			column: 0
		} : f, s = l && e.column ? Math.min(e.column - 1, a - t) : void 0, c;
		for (let e = i.row; !c; e++) {
			let r = e === i.row ? i.column : 0;
			if (s !== void 0) s >= r && d(e, s, t, n) && (c = {
				row: e,
				column: s
			});
			else for (let i = r; i + t <= a; i++) if (d(e, i, t, n)) {
				c = {
					row: e,
					column: i
				};
				break;
			}
		}
		for (let e = c.row; e < c.row + n; e++) {
			u[e] ??= [];
			for (let n = c.column; n < c.column + t; n++) u[e][n] = !0;
		}
		return f = {
			row: c.row,
			column: c.column + t
		}, {
			column: c.column + 1,
			span: t,
			row: c.row + 1,
			height: n
		};
	}), m = Math.max(0, ...p.map((e) => e.row - 1 + e.height));
	if (i === "bottom" && p.length) {
		let e = Array.from({ length: a }, (e, t) => t), t = (n) => e[n] === n ? n : e[n] = t(e[n]);
		for (let n of p) for (let r = n.column; r < n.column - 1 + n.span; r++) e[t(r)] = t(n.column - 1);
		let n = /* @__PURE__ */ new Map();
		for (let e of p) {
			let r = t(e.column - 1);
			n.set(r, Math.max(n.get(r) ?? 0, e.row - 1 + e.height));
		}
		for (let e of p) e.row += m - n.get(t(e.column - 1));
	}
	return {
		tracks: a,
		cells: p,
		rows: m,
		anchored: l
	};
}
var Jl = [
	"home",
	"grid",
	"solar",
	"battery"
], Yl = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "object" && !!e && !Array.isArray(e)) : [];
function Xl({ states: e, entities: t = {}, energy: n }) {
	let r = Yl(n?.energy_sources), i = (e) => r.filter((t) => t.type === e), a = (e, t, n = []) => e.flatMap((e) => [e[t], ...n.flatMap((n) => Yl(e[n]).map((e) => e[t]))]), o = Jl.flatMap((e) => a(i(e), "stat_rate", [
		"power",
		"flow_from",
		"flow_to"
	])), s = [
		...a(i("home"), "stat_energy_to"),
		...a(i("grid"), "stat_energy_from", ["flow_from"]),
		...a(i("grid"), "stat_energy_to", ["flow_to"]),
		...a(i("solar"), "stat_energy_from"),
		...a(i("battery"), "stat_energy_from"),
		...a(i("battery"), "stat_energy_to"),
		...a(i("gas"), "stat_energy_from"),
		...a(i("water"), "stat_energy_from")
	], c = (n) => typeof n == "string" && n.startsWith("sensor.") && n in e && !t[n]?.hidden && !t[n]?.entity_category;
	return [...new Set([...o, ...s].filter(c))];
}
// src/skins/orb/lovelace/auto.ts
var Zl = /^sensor\.\w+_sleep_state$/, Ql = /^sensor\.\w+_voucher$/, $l = {
	cover: "cover",
	light: "light",
	switch: "toggle",
	humidifier: "humidifier",
	fan: "fan",
	media_player: "mediaPlayer",
	vacuum: "vacuum"
};
function eu(e) {
	let { states: t } = e, n = vl(e), r = (e) => e.sort(hl(t)), i = (...e) => r(n.filter((t) => e.includes(fl(t)))), a = i("cover", "light", "switch", "humidifier", "fan", "media_player", "vacuum"), o = Tl(e), s = new Set(o.flatMap((e) => e.heat ? [e.heat] : []));
	return {
		alarms: i("alarm_control_panel"),
		locks: i("lock").map((t) => {
			let n = xl(e, t, "battery");
			return {
				entity: t,
				footprint: "compact",
				...n && { battery: n }
			};
		}),
		safety: kl(e).map(({ entity: e, battery: t }) => ({
			entity: e,
			footprint: "compact",
			...t && { battery: t }
		})),
		cameras: i("camera"),
		weather: i("weather")[0],
		sun: i("sun")[0],
		climate: i("climate").filter((e) => !s.has(e)),
		dysons: new Set(o.map((e) => e.fan)),
		rooms: El(e).map(({ entity: e, humidity: t, battery: n }) => t || n ? {
			entity: e,
			...t && { humidity: t },
			...n && { battery: n }
		} : e),
		quality: jl(e).map((e) => ({
			entity: e,
			card: "numeric"
		})),
		modes: i("input_boolean"),
		socks: r(n.filter((e) => Zl.test(e))),
		wifi: r(n.filter((e) => Ql.test(e))),
		calendars: i("calendar"),
		controls: a
	};
}
function tu(e, t = "Home", { layout: n } = {}) {
	if (n === "wall") return ru(e, t);
	let { areas: r = {} } = e, i = (t) => {
		let n = gl(e, t);
		return n && r[n] ? n : void 0;
	}, { alarms: a, locks: o, safety: s, cameras: c, weather: l, sun: u, climate: d, dysons: f, rooms: p, quality: m, modes: h, socks: g, wifi: _, calendars: v, controls: y } = eu(e), b = [], x = (e) => bl(b, e);
	d.length && x({
		title: "Comfort",
		cards: d.map((e, t) => t === 0 ? e : {
			entity: e,
			footprint: "compact"
		})
	});
	let S = [...p, ...m];
	h.length && x({
		title: "Modes",
		columns: 2,
		cards: h.map((e) => ({
			entity: e,
			footprint: "compact"
		}))
	});
	let C = /* @__PURE__ */ new Map();
	for (let e of y) {
		let t = i(e) ?? "";
		C.set(t, [...C.get(t) ?? [], e]);
	}
	let w = [
		"cover",
		"light",
		"switch",
		"humidifier",
		"fan",
		"media_player",
		"vacuum"
	], T = [...C.keys()].filter(Boolean).sort((e, t) => r[e].name.localeCompare(r[t].name));
	for (let e of [...T, ""]) {
		let t = C.get(e);
		t && (t.sort((e, t) => w.indexOf(fl(e)) - w.indexOf(fl(t))), x({
			title: e ? r[e].name : "Other",
			cards: t.map((e) => ({
				entity: e,
				footprint: "compact",
				...f.has(e) && { card: "dyson" }
			}))
		}));
	}
	(a.length || o.length || s.length) && x({
		title: "Security",
		cards: [
			...a.map((e) => ({
				entity: e,
				footprint: "compact"
			})),
			...o,
			...s
		]
	}), c.length && x({
		title: "Cameras",
		cards: c
	}), g.length && x({
		title: "Nursery",
		cards: g
	}), _.length && x({
		title: "Guests",
		cards: _
	}), v.length && x({
		title: "Calendar",
		cards: v
	}), (l || u) && x({
		title: "Outside",
		cards: [l, u].filter((e) => e !== void 0)
	}), S.length && x({
		title: "Rooms",
		cards: S
	});
	let E = nu(e, b.flatMap((e) => e.cards));
	return E && x(E), b.length ? {
		type: "custom:rotapfel-simple-thermcard",
		title: t,
		rows: b
	} : {
		type: "custom:rotapfel-simple-thermcard",
		title: t
	};
}
var J = (e) => typeof e == "string" ? e : e.entity;
function nu(e, t) {
	let n = new Set(t.map(J)), r = Xl(e).filter((e) => !n.has(e));
	return r.length ? {
		title: "Energy",
		cards: r.map((e) => ({
			entity: e,
			card: "numeric"
		}))
	} : void 0;
}
function ru(e, t) {
	let { alarms: n, locks: r, safety: i, cameras: a, weather: o, sun: s, climate: c, dysons: l, rooms: u, quality: d, modes: f, socks: p, wifi: m, calendars: h, controls: g } = eu(e), _ = (e) => (t) => ({
		config: t,
		card: e
	}), { areas: v, house: y } = Bl([
		...c.map(_("climate")),
		...f.map(_("toggle")),
		...g.map((e) => l.has(e) ? {
			config: {
				entity: e,
				card: "dyson"
			},
			card: "dyson"
		} : {
			config: e,
			card: $l[fl(e)]
		}),
		...n.map(_("alarm")),
		...r.map(_("lock")),
		...i.map(_("binarySensor")),
		...a.map(_("camera")),
		...p.map(_("owlet")),
		...m.map(_("guestWifi")),
		...h.map(_("calendar")),
		...o ? [_("weather")(o)] : [],
		...s ? [_("sun")(s)] : [],
		...u.map(_("sensor")),
		...d.map(_("numeric"))
	], {
		card: (e) => e.card,
		area: (t) => _l(e, J(t.config)),
		outside: Il(e),
		order: Ll(e)
	}), b = (t, n, r) => {
		let { entity: i, ...a } = typeof t.config == "string" ? { entity: t.config } : t.config;
		delete a.footprint;
		let o = r && !_l(e, i) ? { area: r } : {}, s = Fl(t.card) === "compact" ? { footprint: "compact" } : {}, c = {
			entity: i,
			...n && { column: n },
			...s,
			...a,
			...o
		};
		return Object.keys(c).length === 1 ? i : c;
	}, x = v.length ? Vl(v.map((e) => e.items.map((t) => ({
		item: t,
		area: e.area
	}))), 3, y.map((e) => ({ item: e }))).map((e) => ({
		columns: e.columns,
		flow: "dense",
		cards: e.cards.map(({ card: e, column: t }) => b(e.item, t, e.area))
	})) : y.length ? [{ cards: y.map((e) => b(e)) }] : [], S = nu(e, x.flatMap((e) => e.cards));
	return S && x.push(S), x.length ? {
		type: "custom:rotapfel-simple-thermcard",
		title: t,
		rows: x
	} : {
		type: "custom:rotapfel-simple-thermcard",
		title: t,
		layout: "wall"
	};
}
// packages/core/src/lovelace/schema.ts
var iu = "home", au = class extends Error {
	problems;
	constructor(e) {
		super(`The card's config has ${e.length === 1 ? "a problem" : `${e.length} problems`}:\n${e.map((e) => `• ${e}`).join("\n")}`), this.name = "DashboardConfigError", this.problems = e;
	}
}, ou = (e) => typeof e == "object" && !!e && !Array.isArray(e), su = /^[a-z0-9_]+\.[a-z0-9_]+$/, cu = [
	"section",
	"page",
	"navigate"
], lu = /^[a-z0-9][a-z0-9_-]*$/;
function uu(e, t) {
	let n = Array.from({ length: t.length + 1 }, (e, t) => t);
	for (let r = 1; r <= e.length; r++) {
		let i = n[0];
		n[0] = r;
		for (let a = 1; a <= t.length; a++) {
			let o = Math.min(n[a] + 1, n[a - 1] + 1, i + (e[r - 1] === t[a - 1] ? 0 : 1));
			i = n[a], n[a] = o;
		}
	}
	return n[t.length];
}
function du(e, t) {
	let n, r = Infinity;
	for (let i of t) {
		let t = uu(e.toLowerCase(), i);
		t < r && (n = i, r = t);
	}
	return r <= Math.max(2, Math.floor(e.length / 3)) ? n : void 0;
}
var fu = (e) => e.map((e) => `"${e}"`).join(", "), pu = class {
	problems = [];
	problem(e, t) {
		this.problems.push(e ? `${e}: ${t}` : t);
	}
	keys(e, t, n) {
		for (let r of Object.keys(e)) {
			if (n.includes(r)) continue;
			let e = du(r, n);
			this.problem(t, `unknown key "${r}"${e ? ` — did you mean "${e}"?` : ""}`);
		}
	}
	string(e, t, n) {
		let r = e[t];
		if (r != null) {
			if (typeof r == "string" || typeof r == "number") return String(r);
			this.problem(n, `"${t}" must be text`);
		}
	}
	boolean(e, t, n) {
		let r = e[t];
		if (r != null) {
			if (typeof r == "boolean") return r;
			this.problem(n, `"${t}" must be true or false`);
		}
	}
	number(e, t, n, r, i, a = !0) {
		let o = e[t];
		if (o != null) {
			if (typeof o == "number" && Number.isFinite(o) && o >= r && o <= i && (!a || Number.isInteger(o))) return o;
			this.problem(n, `"${t}" must be ${a ? "a whole number" : "a number"} from ${r} to ${i}`);
		}
	}
	choice(e, t, n, r) {
		let i = e[t];
		if (i == null) return;
		if (typeof i == "string" && r.includes(i)) return i;
		let a = typeof i == "string" ? du(i, r) : void 0;
		this.problem(n, `"${t}" must be one of ${fu(r)}${a ? ` — did you mean "${a}"?` : ""}`);
	}
	entityId(e, t, n) {
		if (typeof e != "string" || !su.test(e)) {
			this.problem(t, `"${String(e)}" is not an entity id like light.kitchen`);
			return;
		}
		let r = e.slice(0, e.indexOf("."));
		if (n && !n.includes(r)) this.problem(t, `${e} must be a ${n.map((e) => `${e}.*`).join(" or ")} entity`);
		else return e;
	}
	optionalEntity(e, t, n, r) {
		if (e[t] != null) return this.entityId(e[t], `${n}.${t}`, r);
	}
	navEntry(e, t) {
		if (!ou(e)) {
			this.problem(t, "a nav item is a map with one of \"section\", \"page\" or \"navigate\"");
			return;
		}
		this.keys(e, t, [...cu, "label"]);
		let n = cu.filter((t) => e[t] != null);
		if (n.length !== 1) {
			this.problem(t, `needs exactly one of ${fu(cu)}`);
			return;
		}
		let r = this.string(e, "label", t), i = this.string(e, n[0], t);
		if (i != null) {
			if (n[0] === "section") return {
				kind: "section",
				title: i,
				label: r
			};
			if (n[0] === "page") return {
				kind: "page",
				id: i,
				label: r
			};
			if (!i.startsWith("/")) this.problem(t, "\"navigate\" is a Home Assistant path like /baby-view/0");
			else return {
				kind: "navigate",
				path: i,
				label: r
			};
		}
	}
	nav(e, t, n) {
		if (e.nav === !1) return !1;
		if (e.nav == null) return;
		if (!Array.isArray(e.nav)) {
			this.problem("nav", "must be a list of destinations, or false for no nav");
			return;
		}
		let r = e.nav.map((e, t) => this.navEntry(e, `nav[${t}]`)).filter((e) => !!e), i = [iu, ...t.map((e) => e.id)];
		return r.forEach((e, t) => {
			if (e.kind === "page" && !i.includes(e.id)) {
				let n = du(e.id, i);
				this.problem(`nav[${t}]`, `no page "${e.id}"${n ? ` — did you mean "${n}"?` : ` (pages: ${fu(i)})`}`);
			}
			if (e.kind === "section" && n && !n.includes(e.title)) {
				let r = n.find((t) => t.toLowerCase() === e.title.toLowerCase()) ?? du(e.title, n);
				this.problem(`nav[${t}]`, `no row titled "${e.title}" on the main page${r ? ` — did you mean "${r}"?` : ""}`);
			}
			e.kind === "section" && n && n.filter((t) => t === e.title).length > 1 && this.problem(`nav[${t}]`, `${n.filter((t) => t === e.title).length} rows are titled "${e.title}"; give each its own title so the nav can tell them apart`);
		}), r;
	}
	page(e, t, n, r = gu) {
		if (!ou(e)) {
			this.problem(t, "a page is a map with \"id\", \"title\" and \"cards\" (or \"rows\")");
			return;
		}
		this.keys(e, t, [
			"id",
			"title",
			...r
		]);
		let i = this.string(e, "id", t), a = this.string(e, "title", t);
		i == null || !lu.test(i) ? this.problem(t, "\"id\" is required: lower-case letters, digits, - and _, like living-room") : i === "home" && this.problem(t, `"id" can't be "${iu}": that is the main page`), a ?? this.problem(t, "\"title\" is required");
		let o = n(e, t);
		if (o === void 0) e.cards == null && e.rows == null && this.problem(t, "a page needs \"cards\", or \"rows\" of cards");
		else return i && a && lu.test(i) && i !== "home" ? {
			id: i,
			title: a,
			body: o
		} : void 0;
	}
	pages(e, t, n = gu) {
		if (e.pages == null) return;
		if (!Array.isArray(e.pages) || e.pages.length === 0) {
			this.problem("pages", "must be a list of at least one page, or left out");
			return;
		}
		let r = e.pages.map((e, r) => this.page(e, `pages[${r}]`, t, n)).filter((e) => !!e), i = r.map((e) => e.id);
		for (let e of new Set(i.filter((e, t) => i.indexOf(e) !== t))) this.problem("pages", `two pages have the id "${e}"`);
		return r;
	}
}, mu = ["normal", "dense"], hu = ["top", "bottom"], gu = [
	"cards",
	"rows",
	"columns",
	"flow",
	"align",
	"sections",
	"modules"
], _u = ["width", "column"], vu = [
	"title",
	"note",
	"columns",
	"flow",
	"align",
	"cards"
], yu = [
	"type",
	"view_layout",
	"grid_options",
	"visibility"
], bu = (e) => ({
	rows: "rows don't nest: list this row's cards under its own \"cards\", and put the inner rows beside it in the page's \"rows\"",
	sections: "rows don't nest: list this row's cards under its own \"cards\", and put the inner sections beside it in the page's \"rows\"",
	modules: `a row lists its ${e}s under "cards"`,
	gap: "the skin spaces its grid: leave out \"gap\"",
	width: `"width" places one ${e} inside a row: put it on the ${e}`,
	column: `"column" places one ${e} inside a row: put it on the ${e}`
}), xu = (e, t) => e ? `${e}.${t}` : t, Su = (e, t) => {
	let n = typeof t == "string" ? t : ou(t) && typeof t.entity == "string" ? t.entity : void 0;
	return n ? `${e} (${n})` : e;
};
function Cu(e, t, n, r) {
	let i = t.columns;
	if (i == null) return null;
	if (i !== "auto") return typeof i == "number" && Number.isInteger(i) && i >= 1 && i <= r ? i : (e.problem(n, `"columns" must be a whole number from 1 to ${r}, or auto${typeof i == "string" && /^\d+$/.test(i) ? ` — write columns: ${i}, without quotes` : ""}`), null);
}
function wu(e, t, n, r, i) {
	let a = t.maxColumns, o = n, s = 1, c;
	if (ou(n)) {
		let l = Su(r, n);
		if ("span" in n && (e.problem(l, `"span" isn't a key: a ${t.noun} spans columns with "width", a whole number or full`), o = Object.fromEntries(Object.entries(n).filter(([e]) => e !== "span"))), n.width != null) {
			let r = n.width;
			r === "full" ? s = "full" : typeof r == "number" && Number.isInteger(r) && r >= 1 && r <= a ? s = r : e.problem(l, `"width" is how many columns the ${t.noun} spans: a whole number from 1 to ${a}, or full${typeof r == "string" && /px$/.test(r) ? " — not pixels" : ""}`);
		}
		if (n.column != null) {
			let t = n.column;
			typeof t == "number" && Number.isInteger(t) && t >= 1 && t <= a ? c = t : e.problem(l, `"column" is the column it starts in: a whole number from 1 to ${a}`);
		}
		c !== void 0 && s === "full" && (e.problem(l, "\"width: full\" spans the whole row from column 1: leave out \"column\", or give a number of columns"), c = void 0), i === void 0 ? c !== void 0 && typeof s == "number" && c + s - 1 > a && (e.problem(l, `starts in column ${c} and spans ${s}, past the ${a} columns a row can have: use column: ${a - s + 1}, or a smaller width`), c = void 0) : (typeof s == "number" && s > i && (e.problem(l, `"width: ${s}" is wider than this row's ${i} column${i === 1 ? "" : "s"}: use width: full, or raise the row's columns to ${s}`), s = i), c !== void 0 && c > i ? (e.problem(l, `"column: ${c}" is past this row's ${i} column${i === 1 ? "" : "s"}: use column: ${i}, or raise the row's columns to ${c}`), c = void 0) : c !== void 0 && typeof s == "number" && c + s - 1 > i && (e.problem(l, `starts in column ${c} and spans ${s}, past this row's ${i} columns: use column: ${i - s + 1}, or raise the row's columns to ${c + s - 1}`), c = void 0));
	}
	let l = t.readItem(e, o, r);
	return l === void 0 ? void 0 : {
		item: l,
		width: s,
		column: c
	};
}
function Tu(e, t, n, r, i, a) {
	let o = t.footprints;
	if (!o || o.mix === "lattice") return;
	let s = n.cards.map((e) => o.of(e.item)), c = [...new Set(s)];
	if (c.length < 2) return;
	let l = (e) => s.filter((t) => t === e).length, u = [...c].sort((e, t) => l(e) - l(t) || s.indexOf(t) - s.indexOf(e))[0], d = c.map((e) => `${e}`).join(" and ");
	o.mix === "uniform" ? e.problem(xu(i, "cards"), `this skin draws one footprint per row, and this row mixes ${d}: move the ${u} ${t.noun}s into a row of their own`) : (n.stacks = !0, r.flow === "dense" && e.problem(i, "\"flow: dense\" fills holes in a grid, and this row stacks its mixed footprints by column, so it has none: leave out \"flow\""), n.cards.forEach((n, r) => {
		let i = a[r].raw;
		ou(i) && i.column != null && n.column === void 0 || (n.column === void 0 ? e.problem(a[r].path, `this row mixes ${d} ${t.noun}s, so each stacks in a column: give it a "column", or move the ${u} ones into a row of their own`) : n.width !== 1 && e.problem(a[r].path, `a ${t.noun} in a column stack is one column wide: leave out "width"`));
	}));
}
function Eu(e, t, n, r, i = { flow: "normal" }) {
	if (!ou(n) || "entity" in n || "bundle" in n) {
		let i = typeof n == "string" || ou(n) ? `this is a ${t.noun}, not a row` : "a row is a map with \"cards\" (and usually a \"title\")";
		e.problem(Su(r, n), typeof n == "string" || ou(n) ? `${i}: put it in a row's "cards", or list the ${t.noun}s under "cards" at the top for one plain grid` : i);
		return;
	}
	let a = bu(t.noun);
	for (let t of Object.keys(a)) t in n && e.problem(r, a[t]);
	e.keys(n, r, [...vu, ...Object.keys(a)]);
	let o = Cu(e, n, r, t.maxColumns), s = o === null ? i.columns : o, c = e.choice(n, "flow", r, mu) ?? i.flow, l = e.choice(n, "align", r, hu) ?? "top", u = {
		title: e.string(n, "title", r),
		note: e.string(n, "note", r),
		columns: s,
		flow: c,
		align: l,
		cards: []
	}, d = n.cards;
	if (!Array.isArray(d) || d.length === 0) return e.problem(r, `"cards" must be a list of at least one ${t.noun}`), u;
	let f = [];
	return d.forEach((n, i) => {
		let a = xu(r, `cards[${i}]`), o = wu(e, t, n, a, s);
		o && (u.cards.push(o), f.push({
			path: Su(a, n),
			raw: n
		}));
	}), Tu(e, t, u, n, r, f), u;
}
function Du(e, t, n, r = "") {
	n.sections != null && e.problem(xu(r, "sections"), "isn't a key: list the page's cards under \"cards\" for one plain grid, or under \"rows\" in titled groups (each row: title, columns, cards)"), n.modules != null && e.problem(xu(r, "modules"), `isn't a key: list the page's ${t.noun}s under "cards", or under "rows" in titled groups`), n.align != null && e.problem(xu(r, "align"), "lines up one row's columns: put it on a row under \"rows\""), n.cards != null && n.rows != null && e.problem(r, "\"cards\" and \"rows\" both lay out this page: keep \"cards\" for one plain grid, or move those cards into a row under \"rows\"");
	let i = {
		columns: Cu(e, n, r, t.maxColumns) ?? void 0,
		flow: e.choice(n, "flow", r, mu) ?? "normal"
	}, a = [];
	if (n.cards != null) {
		if (!Array.isArray(n.cards) || n.cards.length === 0) e.problem(xu(r, "cards"), `must be a list of at least one ${t.noun}: entity ids like light.kitchen, or maps with an "entity" — each on its own line starting with "- "`);
		else {
			let o = Eu(e, t, {
				cards: n.cards,
				...n.flow === "dense" && { flow: "dense" }
			}, r, i);
			o && a.push(o);
		}
	}
	return n.rows != null && (!Array.isArray(n.rows) || n.rows.length === 0 ? e.problem(xu(r, "rows"), "must be a list of at least one row, each a map with its own \"cards\" — each row on its own line starting with \"- \"") : n.rows.forEach((n, o) => {
		let s = Eu(e, t, n, xu(r, `rows[${o}]`), i);
		s && a.push(s);
	})), n.cards == null && n.rows == null ? void 0 : a;
}
var Ou = (e = []) => e.flatMap((e) => e.title ? [e.title] : []), ku = (e) => e.slice(0, e.indexOf("."));
function Au(e, t) {
	return [.../* @__PURE__ */ new Set([...Object.values(e), ...Object.keys(t)])];
}
function ju(e, t, n, r) {
	if (ou(n) && t.before && !t.before(e, n, r)) return;
	if (!ou(n) && typeof n != "string") {
		e.problem(r, `a ${t.noun} is an entity id, or a map with an "entity" key`);
		return;
	}
	let i = typeof n == "string" ? { entity: n } : n;
	if (i.entity == null) {
		e.problem(r, t.missing?.(i) ?? `a ${t.noun} needs an "entity"`);
		return;
	}
	let a = e.entityId(i.entity, r, t.domains);
	if (!a) return;
	let o = ku(a), s = (t.order ?? Object.keys(t.kinds)).filter((e) => t.kinds[e].domains.includes(o));
	if (!s.length) {
		e.problem(r, t.noKind?.(a, o) ?? `${a}: ${o}.* entities have no ${t.noun}`);
		return;
	}
	let c = `${r} (${a})`, l;
	if (i.card != null && (l = e.choice(i, "card", c, s), l === void 0 && t.stopOnInvalidCard)) return;
	let u = l ?? s.find((e) => t.kinds[e].id?.test(a)) ?? s.find((e) => !t.kinds[e].id);
	if (!u) {
		e.problem(c, `pick its ${t.noun} with "card": one of ${s.join(", ")}`);
		return;
	}
	let d = t.kinds[u].keys ?? [], f = [...t.common, ...d], p = i.card == null ? Object.keys(i).flatMap((e) => {
		if (f.includes(e)) return [];
		let n = s.find((n) => n !== u && t.kinds[n].keys?.includes(e));
		return n ? [{
			key: e,
			owner: n
		}] : [];
	}) : [];
	for (let { key: n, owner: r } of p) e.problem(c, `"${n}" is the ${r} ${t.noun}'s: add card: ${r}`);
	let m = [...f, ...p.map(({ key: e }) => e)];
	t.checkKeys ? t.checkKeys(e, i, c, m) : e.keys(i, c, m);
	let h = t.base(e, i, c), g = t.kinds[u].readOptions?.(e, i, c) ?? {}, _ = i.card == null && !t.kinds[u].id && s.length > 1 && !d.some((e) => e in i);
	return {
		...h,
		entity: a,
		kind: u,
		...g,
		..._ && { defaulted: !0 }
	};
}
function Mu(e, t, ...n) {
	return e[t.kind](t, ...n);
}
var Nu = (e, t, n) => e.choice(t, "unit", n, ["°C", "°F"]), Pu = (e, t, n) => ({
	humidity: e.optionalEntity(t, "humidity", n, ["sensor"]),
	battery: e.optionalEntity(t, "battery", n, ["sensor"]),
	outdoor: e.boolean(t, "outdoor", n)
}), Fu = (e, t, n) => ({
	aqi: e.optionalEntity(t, "aqi", n, ["sensor"]),
	aqiScale: e.choice(t, "aqi_scale", n, ["US"]),
	sun: t.sun === void 0 ? "sun.sun" : e.optionalEntity(t, "sun", n, ["sun"]),
	forecasts: e.boolean(t, "forecasts", n) ?? !0
}), Iu = (e, t, n) => {
	let r = t.calendars;
	return r != null && !Array.isArray(r) && e.problem(n, "\"calendars\" must be a list of calendar.* entity ids"), {
		calendars: Array.isArray(r) ? r.flatMap((t, r) => e.entityId(t, `${n}.calendars[${r}]`, ["calendar"]) ?? []) : void 0,
		days: e.number(t, "days", n, 1, 31),
		events: e.boolean(t, "events", n) ?? !0
	};
}, Lu = (e, t, n) => {
	let r = t.open_sensors;
	return r != null && !(Array.isArray(r) && r.every((e) => typeof e == "string")) && e.problem(n, "\"open_sensors\" must be a list of names"), {
		readOnly: e.boolean(t, "read_only", n),
		exitDelay: e.number(t, "exit_delay", n, 0, 3600),
		entryDelay: e.number(t, "entry_delay", n, 0, 3600),
		openSensors: Array.isArray(r) ? r.filter((e) => typeof e == "string") : void 0
	};
}, Ru = (e, t, n) => ({
	still: e.boolean(t, "still", n),
	refresh: e.number(t, "refresh", n, 1, 3600)
});
function zu(e, t, n, r) {
	let i = t.alerts;
	return i != null && !ou(i) && e.problem(n, "\"alerts\" must map alerts to binary_sensor.* entities, like low_oxygen: binary_sensor.sock_low_oxygen"), ou(i) && e.keys(i, `${n}.alerts`, r), {
		heartRate: e.optionalEntity(t, "heart_rate", n, ["sensor"]),
		oxygen: e.optionalEntity(t, "oxygen", n, ["sensor"]),
		charging: e.optionalEntity(t, "charging", n, ["binary_sensor"]),
		baseStation: e.optionalEntity(t, "base_station", n, ["switch"]),
		alerts: ou(i) ? Object.fromEntries(r.flatMap((t) => {
			let r = e.optionalEntity(i, t, `${n}.alerts`, ["binary_sensor"]);
			return r ? [[t, r]] : [];
		})) : void 0,
		staleAfter: e.number(t, "stale_after", n, 1, 60)
	};
}
var Bu = {
	pm25: {
		companion: "pm25",
		domains: ["sensor"]
	},
	pm10: {
		companion: "pm10",
		domains: ["sensor"]
	},
	voc: {
		companion: "voc",
		domains: ["sensor"]
	},
	no2: {
		companion: "no2",
		domains: ["sensor"]
	},
	hcho: {
		companion: "hcho",
		domains: ["sensor"]
	},
	temperature: {
		companion: "temperature",
		domains: ["sensor"]
	},
	humidity: {
		companion: "humidity",
		domains: ["sensor"]
	},
	hepa_filter: {
		companion: "hepaFilter",
		domains: ["sensor"]
	},
	carbon_filter: {
		companion: "carbonFilter",
		domains: ["sensor"]
	},
	filter: {
		companion: "filter",
		domains: ["sensor"]
	},
	filter_percentage: {
		companion: "filterPercentage",
		domains: ["sensor"]
	},
	night_mode: {
		companion: "nightMode",
		domains: ["switch"]
	},
	heat: {
		companion: "heat",
		domains: ["climate"]
	},
	oscillation_mode: {
		companion: "oscillationMode",
		domains: ["select"]
	},
	angle_center: {
		companion: "angleCenter",
		domains: ["number"]
	},
	angle_span: {
		companion: "angleSpan",
		domains: ["number"]
	},
	angle_low: {
		companion: "angleLow",
		domains: ["number"]
	},
	angle_high: {
		companion: "angleHigh",
		domains: ["number"]
	}
};
function Vu(e, t, n) {
	let r = t.companions;
	if (r == null) return {};
	if (!ou(r)) return e.problem(n, "\"companions\" must map companions to entities, like pm25: sensor.bedroom_pm25 or heat: climate.bedroom"), {};
	let i = Object.keys(Bu);
	e.keys(r, `${n}.companions`, i);
	let a = Object.fromEntries(i.flatMap((t) => {
		if (r[t] === "none") return [[Bu[t].companion, ""]];
		let i = e.optionalEntity(r, t, `${n}.companions`, Bu[t].domains);
		return i ? [[Bu[t].companion, i]] : [];
	}));
	return Object.keys(a).length ? { companions: a } : {};
}
function Hu(e, t, n) {
	let r = (r) => {
		let i = t[r];
		if (i != null) {
			if (typeof i == "number" && Number.isFinite(i)) return i;
			e.problem(n, `"${r}" must be a number`);
		}
	}, i = e.string(t, "unit", n), a = r("warn_above"), o = r("warn_below");
	return a != null && o != null && o >= a && e.problem(n, "\"warn_below\" must be under \"warn_above\""), {
		unit: i,
		warnAbove: a,
		warnBelow: o
	};
}
// src/skins/orb/lovelace/config.ts
var Uu = {
	light: "light",
	climate: "climate",
	sensor: "sensor",
	weather: "weather",
	cover: "cover",
	input_boolean: "toggle",
	switch: "toggle",
	alarm_control_panel: "alarm",
	humidifier: "humidifier",
	lock: "lock",
	fan: "fan",
	binary_sensor: "binarySensor",
	camera: "camera",
	media_player: "mediaPlayer",
	vacuum: "vacuum",
	calendar: "calendar",
	sun: "sun"
}, Wu = {
	owlet: {
		domains: ["sensor"],
		id: /^sensor\.\w+_sleep_state$/
	},
	sound: { domains: ["switch"] },
	guestWifi: {
		domains: [
			"sensor",
			"input_text",
			"text"
		],
		id: /^sensor\.\w+_voucher$/
	},
	numeric: { domains: ["sensor"] },
	dyson: { domains: ["fan"] }
}, Gu = {
	yellow: {
		chroma: .145,
		hue: 92
	},
	sage: {
		chroma: .08,
		hue: 150
	},
	coral: {
		chroma: .12,
		hue: 35
	},
	sky: {
		chroma: .09,
		hue: 235
	},
	lilac: {
		chroma: .08,
		hue: 300
	}
}, Ku = Object.keys(Di), qu = [
	"bell-off",
	"moon",
	"volume-off",
	"guest",
	"away",
	"power",
	"waves"
], Ju = [
	"compact",
	"standard",
	"featured"
], Yu = [
	"garage",
	"door",
	"gate"
], Xu = [
	"entity",
	"card",
	"name",
	"area",
	"footprint",
	..._u,
	"show_control",
	"history"
], Y = 12, Zu = {
	light: {},
	climate: {
		keys: ["unit"],
		readOptions: (e, t, n) => ({ unit: Nu(e, t, n) })
	},
	sensor: {
		keys: [
			"humidity",
			"battery",
			"outdoor",
			"unit"
		],
		readOptions: (e, t, n) => ({
			...Pu(e, t, n),
			unit: Nu(e, t, n)
		})
	},
	weather: {
		keys: [
			"aqi",
			"aqi_scale",
			"sun",
			"forecasts"
		],
		readOptions: Fu
	},
	cover: {
		keys: ["device_class"],
		readOptions: (e, t, n) => ({ deviceClass: e.choice(t, "device_class", n, Yu) })
	},
	toggle: {
		keys: ["icon", "description"],
		readOptions: (e, t, n) => ({
			icon: e.choice(t, "icon", n, qu),
			description: e.string(t, "description", n)
		})
	},
	alarm: {
		keys: [
			"read_only",
			"exit_delay",
			"entry_delay",
			"open_sensors"
		],
		readOptions: Lu
	},
	owlet: {
		keys: [
			"heart_rate",
			"oxygen",
			"charging",
			"base_station",
			"alerts",
			"stale_after"
		],
		readOptions: (e, t, n) => zu(e, t, n, Ku)
	},
	humidifier: {},
	sound: {
		keys: ["volume"],
		readOptions: (e, t, n) => ({ volume: e.optionalEntity(t, "volume", n, ["number"]) })
	},
	lock: {
		keys: ["battery"],
		readOptions: (e, t, n) => ({ battery: e.optionalEntity(t, "battery", n, ["sensor"]) })
	},
	fan: {},
	guestWifi: {
		keys: [
			"access",
			"network",
			"qr",
			"new_code",
			"refresh"
		],
		readOptions: (e, t, n) => ({
			access: e.choice(t, "access", n, ["code", "password"]),
			network: e.string(t, "network", n),
			qr: e.optionalEntity(t, "qr", n, ["image"]),
			newCode: e.optionalEntity(t, "new_code", n, ma),
			refresh: e.optionalEntity(t, "refresh", n, ma)
		})
	},
	binarySensor: {
		keys: ["battery"],
		readOptions: (e, t, n) => ({ battery: e.optionalEntity(t, "battery", n, ["sensor"]) })
	},
	camera: {
		keys: ["still", "refresh"],
		readOptions: Ru
	},
	mediaPlayer: {},
	numeric: {
		keys: [
			"unit",
			"warn_above",
			"warn_below"
		],
		readOptions: Hu
	},
	vacuum: {},
	calendar: {
		keys: [
			"calendars",
			"days",
			"events"
		],
		readOptions: Iu
	},
	sun: {},
	dyson: {
		keys: ["companions"],
		readOptions: Vu
	}
}, X = Au(Uu, Wu), Z = Object.keys(Zu).reduce((e, t) => (e[t] = {
	...Zu[t],
	domains: [...Object.keys(Uu).filter((e) => Uu[e] === t), ...Wu[t]?.domains ?? []],
	id: Wu[t]?.id
}, e), {}), Q = { color: "\"color\" is gone: a card has no colour of its own, and the dashboard's \"accent\" sets the one colour every card is on in" }, Qu = {
	noun: "card",
	common: Xu,
	order: X,
	kinds: Z,
	stopOnInvalidCard: !0,
	checkKeys: (e, t, n, r) => {
		for (let r of Object.keys(Q)) r in t && e.problem(n, Q[r]);
		e.keys(t, n, [...r, ...Object.keys(Q)]);
	},
	base: (e, t, n) => ({
		name: e.string(t, "name", n),
		area: e.string(t, "area", n),
		footprint: e.choice(t, "footprint", n, Ju),
		showControl: e.boolean(t, "show_control", n),
		history: e.boolean(t, "history", n) ?? !0
	}),
	missing: () => "a card needs an \"entity\"",
	noKind: (e, t) => `${e}: ${t}.* entities have no card yet (supported: ${Object.keys(Uu).join(", ")})`
}, $u = [
	"type",
	"title",
	"subtitle",
	"show_time",
	"hour_cycle",
	"viewing",
	"layout",
	"theme",
	"accent",
	"stills",
	"quiet",
	...gu,
	"nav",
	"pages",
	"view_layout",
	"grid_options",
	"visibility"
], ed = [
	"joined",
	"lead",
	"titled"
], td = {
	joined: {
		keys: [
			"bundle",
			"label",
			"cards",
			..._u
		],
		fewest: 2,
		what: "a joined bundle shares one card between two or more compact cards"
	},
	lead: {
		keys: [
			"bundle",
			"label",
			"sheet_title",
			"cards",
			..._u
		],
		fewest: 2,
		what: "a lead bundle is its first card, standard, then one or more compact rows"
	},
	titled: {
		keys: [
			"bundle",
			"title",
			"area",
			"cards",
			..._u
		],
		fewest: 1,
		what: "a titled bundle is a lid naming one thing, then its parts"
	}
};
$u.filter((e) => !gu.includes(e) && !yu.includes(e)), Object.fromEntries(Object.keys(Zu).map((e) => [e, Zu[e].keys ?? []]));
var nd = class extends pu {
	layout = {
		noun: "card",
		maxColumns: Y,
		readItem: (e, t, n) => this.item(t, n)
	};
	card(e, t) {
		return ju(this, Qu, e, t);
	}
	members(e, t, n) {
		return (!Array.isArray(e) || e.length < n.fewest) && (this.problem(t, `${n.what}: list ${n.fewest === 1 ? "at least one card" : `at least ${n.fewest} cards`}`), !Array.isArray(e)) ? [] : e.flatMap((e, n) => {
			let r = `${t}[${n}]`;
			if (ou(e)) {
				let t = typeof e.entity == "string" ? `${r} (${e.entity})` : r;
				if ("bundle" in e) return this.problem(r, "bundles don't nest: put this bundle beside the other in the row's \"cards\""), [];
				let n = ["footprint", ..._u].filter((t) => t in e);
				for (let e of n) this.problem(t, e === "footprint" ? "\"footprint\" is the bundle's to set: every card in it is compact (a lead bundle's first card, standard)" : `"${e}" places the whole bundle: put it on the bundle, beside "bundle"`);
				let i = Object.fromEntries(Object.entries(e).filter(([e]) => !n.includes(e))), a = this.card(i, r);
				return a ? [a] : [];
			}
			let i = this.card(e, r);
			return i ? [i] : [];
		});
	}
	item(e, t) {
		if (ou(e) && !("entity" in e) && ("cards" in e || "joined" in e || "lead" in e || "rows" in e) && !("bundle" in e)) {
			this.problem(t, "a map of \"cards\" in a row is a bundle: say which with \"bundle\": joined, lead or titled");
			return;
		}
		if (!ou(e) || !("bundle" in e)) return this.card(e, t);
		let n = this.choice(e, "bundle", t, ed);
		if (!n) return;
		let r = td[n];
		this.keys(e, t, r.keys);
		let i = this.members(e.cards, `${t}.cards`, r);
		if (n === "joined") return {
			kind: n,
			label: this.string(e, "label", t),
			members: i
		};
		if (n === "lead") {
			let [r, ...a] = i;
			return r && {
				kind: n,
				label: this.string(e, "label", t),
				sheetTitle: this.string(e, "sheet_title", t),
				lead: r,
				rows: a
			};
		}
		let a = this.string(e, "title", t);
		if (!a) this.problem(t, "a titled bundle needs a \"title\" naming what its cards make up, like Sound machine");
		else return {
			kind: n,
			title: a,
			area: this.string(e, "area", t),
			rows: i
		};
	}
	body(e, t = "") {
		return Du(this, this.layout, e, t);
	}
};
function rd(e) {
	let t = new nd();
	if (!ou(e)) throw new au(["the card config must be a map"]);
	t.keys(e, "", $u);
	let n;
	if (typeof e.accent == "string") {
		if (n = Gu[e.accent], !n) {
			let n = du(e.accent, Object.keys(Gu));
			t.problem("accent", `must be one of ${fu(Object.keys(Gu))}, or { chroma, hue }${n ? ` — did you mean "${n}"?` : ""}`);
		}
	} else if (ou(e.accent)) {
		t.keys(e.accent, "accent", ["chroma", "hue"]);
		let r = t.number(e.accent, "chroma", "accent", 0, .37, !1), i = t.number(e.accent, "hue", "accent", 0, 360, !1);
		if (r !== void 0 && i !== void 0) n = {
			chroma: r,
			hue: i
		};
		else for (let n of ["chroma", "hue"]) e.accent[n] === void 0 && t.problem(`accent.${n}`, "is required with the other");
	} else e.accent != null && t.problem("accent", `must be one of ${fu(Object.keys(Gu))}, or { chroma, hue }`);
	let r = t.body(e), i = t.pages(e, (e, n) => t.body(e, n))?.map(({ id: e, title: t, body: n }) => ({
		id: e,
		title: t,
		rows: n
	})), a = t.nav(e, i ?? [], r ? Ou(r) : void 0), o = {
		title: t.string(e, "title", "") ?? "Home",
		subtitle: t.string(e, "subtitle", ""),
		showTime: t.boolean(e, "show_time", "") ?? !1,
		hourCycle: t.choice(e, "hour_cycle", "", ["h12", "h23"]),
		viewing: t.choice(e, "viewing", "", ["near", "far"]),
		layout: zl(t, e),
		theme: t.choice(e, "theme", "", [
			"home-assistant",
			"auto",
			"light",
			"dark"
		]) ?? "home-assistant",
		accent: n,
		rows: r,
		nav: a,
		pages: i,
		stills: t.boolean(e, "stills", "") ?? !0,
		quiet: t.boolean(e, "quiet", "") ?? !1
	};
	if (t.problems.length) throw new au(t.problems);
	return o;
}
// packages/core/src/hooks/useDelayLeft.ts
function id(e, t, n) {
	let r = n && e != null && e > 0 && t != null, [i, a] = (0, I.useState)(() => Date.now());
	if ((0, I.useEffect)(() => {
		if (!r) return;
		a(Date.now());
		let e = window.setInterval(() => a(Date.now()), 1e3), t = () => a(Date.now());
		return document.addEventListener("visibilitychange", t), () => {
			window.clearInterval(e), document.removeEventListener("visibilitychange", t);
		};
	}, [r, t]), r) return Math.max(0, Math.ceil(e - (i - t) / 1e3));
}
// packages/core/src/hooks/useHashPage.ts
var ad = /(?:^#|&)page=([^&]*)/;
function od(e, t, n) {
	let r = e.match(ad)?.[1], i = n;
	try {
		r && (i = decodeURIComponent(r));
	} catch {}
	return t.includes(i) ? i : n;
}
function sd(e, t) {
	let n = e.join("\n"), [r, i] = (0, I.useState)(() => od(location.hash, e, t));
	return (0, I.useEffect)(() => {
		let e = n.split("\n"), r = () => i(od(location.hash, e, t));
		return r(), addEventListener("popstate", r), addEventListener("hashchange", r), () => {
			removeEventListener("popstate", r), removeEventListener("hashchange", r);
		};
	}, [n, t]), [r, (0, I.useCallback)((e) => {
		if (e === r) return;
		let n = e === t ? "" : `#page=${encodeURIComponent(e)}`;
		history.pushState(history.state, "", `${location.pathname}${location.search}${n}`), i(e);
	}, [r, t])];
}
// packages/core/src/hooks/picture.ts
var cd = { status: "none" };
function ld(e, t) {
	switch (t.type) {
		case "source": return t.source ? t.source === e.source ? e : {
			source: t.source,
			frame: e.frame,
			status: "loading"
		} : e.status === "none" && !e.frame ? e : cd;
		case "loaded": return t.source === e.source ? {
			source: t.source,
			frame: {
				src: t.src,
				at: t.at,
				source: t.source
			},
			status: "ready",
			settledAt: t.at
		} : e;
		case "failed": return t.source === e.source ? e.frame?.source === t.source ? {
			...e,
			status: "stale",
			settledAt: t.at
		} : {
			source: t.source,
			status: "failed",
			settledAt: t.at
		} : e;
	}
}
function ud(e, t) {
	if (/^(data|blob):/i.test(e)) return e;
	let n = e.indexOf("#"), r = n < 0 ? e : e.slice(0, n), i = n < 0 ? "" : e.slice(n);
	return `${r}${r.includes("?") ? "&" : "?"}t=${t}${i}`;
}
function dd(e, t, n) {
	if (!(!e || e <= 0 || t === void 0)) return Math.max(0, t + e - n);
}
// packages/core/src/hooks/usePicture.ts
function fd() {
	let e = () => typeof document > "u" || document.visibilityState !== "hidden", [t, n] = (0, I.useState)(() => ({
		visible: e(),
		wakes: 0
	}));
	return (0, I.useEffect)(() => {
		let t = () => n((t) => {
			let n = e();
			return n === t.visible ? t : {
				visible: n,
				wakes: t.wakes + +!!n
			};
		});
		return document.addEventListener("visibilitychange", t), () => document.removeEventListener("visibilitychange", t);
	}, []), t;
}
function pd(e) {
	let t = typeof IntersectionObserver < "u", [n, r] = (0, I.useState)(!1);
	return (0, I.useEffect)(() => {
		if (!e || !t) return;
		let n = new IntersectionObserver((e) => {
			for (let t of e) r(t.isIntersecting);
		});
		return n.observe(e), () => n.disconnect();
	}, [e, t]), e != null && (!t || n);
}
function md(e, { refresh: t, paused: n = !1 } = {}) {
	let [r, i] = (0, I.useState)(null), a = pd(r), o = fd(), s = a && o.visible, [c, l] = (0, I.useReducer)(ld, cd), u = (0, I.useRef)(null), d = (0, I.useCallback)(() => {
		let e = u.current;
		u.current = null, e && (e.src = "");
	}, []), f = (0, I.useCallback)((e) => {
		d();
		let n = new Image();
		n.decoding = "async", u.current = n;
		let r = t ? ud(e, Date.now()) : e, i = (t) => {
			u.current === n && (u.current = null, l(t ? {
				type: "loaded",
				source: e,
				src: r,
				at: Date.now()
			} : {
				type: "failed",
				source: e,
				at: Date.now()
			}));
		};
		typeof n.decode == "function" ? (n.src = r, n.decode().then(() => i(!0), () => i(!1))) : (n.onload = () => i(!0), n.onerror = () => i(!1), n.src = r);
	}, [d, t]);
	(0, I.useEffect)(() => (l({
		type: "source",
		source: e
	}), d), [e, d]), (0, I.useEffect)(() => {
		s && e && c.source === e && c.status === "loading" && !u.current && f(e);
	}, [
		s,
		e,
		c.source,
		c.status,
		f
	]), (0, I.useEffect)(() => {
		if (!s || !e || n || c.source !== e) return;
		let r = dd(t, c.settledAt, Date.now());
		if (r === void 0) return;
		let i = setTimeout(() => f(e), r);
		return () => clearTimeout(i);
	}, [
		s,
		e,
		n,
		t,
		c.source,
		c.settledAt,
		f
	]);
	let p = (0, I.useRef)(o.wakes);
	(0, I.useEffect)(() => {
		o.wakes !== p.current && (p.current = o.wakes, n && t && s && e && c.source === e && c.status !== "loading" && f(e));
	}, [
		o.wakes,
		n,
		t,
		s,
		e,
		c.source,
		c.status,
		f
	]);
	let m = n && t && c.status === "ready" ? "stale" : c.status;
	return {
		ref: i,
		src: c.frame?.src,
		status: m,
		at: c.frame?.at
	};
}
// packages/core/src/entities/mediaPlayer/position.ts
function hd(e, t) {
	let { duration: n, position: r } = e;
	if (e.state === "unavailable" || e.state === "off" || e.state === "standby" || n == null || !Number.isFinite(n) || n <= 0 || r == null || !Number.isFinite(r)) return;
	let i = e.state === "playing", a = i && e.positionAt != null ? Math.max(0, (t - e.positionAt) / 1e3) : 0;
	return {
		at: Math.min(n, Math.max(0, r + a)),
		duration: n,
		running: i
	};
}
var gd = (e) => e.duration > 0 ? Math.min(1, Math.max(0, e.at / e.duration)) : 0, _d = .001, vd = (e, t, n, r) => {
	let i = r * n, a = e % i, o = (a + t - e + _d) / i;
	return {
		kind: "digit",
		base: n,
		period: r,
		cycle: i,
		offset: a,
		digit: Math.floor(a / r),
		turns: o
	};
};
function yd(e, t) {
	let n = Math.max(0, Math.min(e, t)), r = { kind: "colon" }, i = (e, r) => vd(n, t, e, r), a = [i(6, 10), i(10, 1)];
	return t >= 3600 ? [
		i(10, 3600),
		r,
		i(6, 600),
		i(10, 60),
		r,
		...a
	] : t >= 600 ? [
		i(6, 600),
		i(10, 60),
		r,
		...a
	] : [
		i(10, 60),
		r,
		...a
	];
}
function bd(e) {
	let t = Math.max(0, Math.floor(e)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60, a = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
	return [
		n && a(n, "hour"),
		r && a(r, "minute"),
		(i || !n && !r) && a(i, "second")
	].filter(Boolean).join(" ");
}
// packages/core/src/hooks/usePlayhead.ts
function xd(e) {
	let { state: t, duration: n, position: r, positionAt: i } = e;
	return (0, I.useMemo)(() => {
		let e = Date.now(), a = hd({
			state: t,
			duration: n,
			position: r,
			positionAt: i
		}, e);
		return a && {
			...a,
			key: `${t}|${n}|${r}|${i ?? e}`
		};
	}, [
		t,
		n,
		r,
		i
	]);
}
// packages/core/src/hooks/useScrollSpy.ts
var Sd = .35, Cd = 800, wd = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function Td(e, t) {
	let [n, r] = (0, I.useState)(null), i = (0, I.useRef)(0);
	return (0, I.useEffect)(() => {
		let t = e.current;
		if (!t) return;
		let n = 0, a = () => {
			if (n = 0, performance.now() < i.current) return;
			let e = [...t.querySelectorAll("[data-section-id]")];
			if (!e.length) {
				r(null);
				return;
			}
			let a = innerHeight * Sd, o = e[0];
			for (let t of e) t.getBoundingClientRect().top <= a && (o = t);
			let s = t.getBoundingClientRect();
			s.top >= 0 ? o = e[0] : s.bottom <= innerHeight + 2 && (o = e[e.length - 1]), r(o.dataset.sectionId ?? null);
		}, o = () => {
			n ||= requestAnimationFrame(a);
		};
		return document.addEventListener("scroll", o, {
			capture: !0,
			passive: !0
		}), addEventListener("resize", o), a(), () => {
			document.removeEventListener("scroll", o, { capture: !0 }), removeEventListener("resize", o), n && cancelAnimationFrame(n);
		};
	}, [e, t]), [n, (0, I.useCallback)((t) => {
		let n = e.current?.querySelector(`[data-section-id="${t}"]`);
		n && (r(t), i.current = performance.now() + Cd, n.scrollIntoView({
			block: "start",
			behavior: wd() ? "auto" : "smooth"
		}));
	}, [e])];
}
var Ed = (e, t) => Math.min(t, Math.max(0, e));
function Dd(e, t) {
	let [n, r] = (0, I.useState)(void 0), [i, a] = (0, I.useState)(void 0), o = (0, I.useRef)(0), s = e && i?.from === e.key ? i : void 0, c = (0, I.useMemo)(() => {
		if (!e || !s) return e;
		let t = e.running ? Math.max(0, (Date.now() - s.since) / 1e3) : 0;
		return {
			at: Ed(s.at + t, e.duration),
			duration: e.duration,
			running: e.running,
			key: `seek|${s.at}|${s.since}`
		};
	}, [e, s]), l = c?.key, u = (0, I.useMemo)(() => l == null ? 0 : Date.now(), [l]);
	if (!e || !c || !t) return;
	let d = n != null, f = d ? {
		at: Ed(n, c.duration),
		duration: c.duration,
		running: !1,
		key: c.key
	} : c, p = (n) => {
		let i = Ed(n, e.duration), s = ++o.current;
		r(void 0), a({
			at: i,
			since: Date.now(),
			from: e.key,
			id: s
		}), Promise.resolve(t(i)).then((e) => {
			e === !1 && a((e) => e?.id === s ? void 0 : e);
		});
	};
	return {
		head: f,
		held: d,
		...d && { target: f.at },
		slider: {
			value: f.at,
			min: 0,
			max: c.duration,
			step: 5,
			valueText: (e) => `${bd(e)} of ${bd(c.duration)}`,
			onChange: r,
			onCommit: p,
			current: () => d || !f.running ? f.at : Ed(f.at + (Date.now() - u) / 1e3, f.duration)
		}
	};
}
function Od(e = 400) {
	let t = (0, I.useRef)(null);
	return (0, I.useEffect)(() => {
		t.current = Date.now();
	}, []), (0, I.useCallback)(() => t.current != null && Date.now() - t.current >= e, [e]);
}
// packages/core/src/primitives/keypad.ts
var kd = 12;
function Ad({ text: e, onSubmit: t }) {
	let [n, r] = (0, I.useState)(""), [i, a] = (0, I.useState)(null), [o, s] = (0, I.useState)(!1), c = (0, I.useRef)(!0);
	(0, I.useEffect)(() => (c.current = !0, () => {
		c.current = !1;
	}), []);
	let l = (0, I.useRef)(null), u = (0, I.useRef)(null);
	(0, I.useEffect)(() => {
		let e = u.current ?? l.current;
		e?.closest("dialog")?.open && e.focus();
	}, []);
	let d = async () => {
		if (!n || o) return;
		s(!0);
		let e;
		try {
			e = await t(n) ? "ok" : "wrong";
		} catch {
			e = "failed";
		}
		c.current && (s(!1), e !== "ok" && (a(e), e === "wrong" && r("")));
	}, f = (e) => {
		o || (a(null), r((t) => t.length >= kd ? t : t + e));
	}, p = () => {
		o || (a(null), r((e) => e.slice(0, -1)));
	}, m = (e) => {
		o || (a(null), r(e.slice(0, kd)));
	};
	return (0, I.useEffect)(() => {
		let t = (t) => {
			let r = t.composedPath()[0] ?? t.target;
			if (r instanceof HTMLInputElement) return;
			let i = r instanceof HTMLButtonElement;
			/^[0-9]$/.test(t.key) || e && /^[a-z]$/i.test(t.key) ? (t.preventDefault(), f(t.key)) : t.key === "Backspace" ? (t.preventDefault(), p()) : (t.key === "Enter" && !i || t.key === "Enter" && i && !l.current?.contains(r) && n) && (t.preventDefault(), d());
		};
		return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
	}), {
		code: n,
		error: i,
		busy: o,
		press: f,
		back: p,
		type: m,
		submit: d,
		inputProps: e ? {
			ref: u,
			type: "password",
			value: n,
			readOnly: o,
			autoComplete: "off",
			autoCapitalize: "off",
			autoCorrect: "off",
			spellCheck: !1,
			enterKeyHint: "go",
			maxLength: kd,
			"data-autofocus": !0,
			onChange: (e) => m(e.currentTarget.value),
			onKeyDown: (e) => {
				e.key === "Enter" && (e.preventDefault(), d());
			}
		} : void 0,
		rootProps: {
			ref: l,
			tabIndex: -1,
			"data-autofocus": !e || void 0
		}
	};
}
// packages/core/src/primitives/dial.ts
function jd(e, t, { top: n, min: r, max: i }) {
	let a = n + Math.atan2(e, -t) * 180 / Math.PI;
	for (; a < r;) a += 360;
	for (; a >= r + 360;) a -= 360;
	return a > i && (a = a - i <= r + 360 - a ? i : r), Math.round(a);
}
function Md({ value: e, top: t, min: n, max: r, step: i = 1, disabled: a, valueText: o, onChange: s }) {
	let [c, l] = (0, I.useState)(null), u = (e) => {
		let i = e.currentTarget.getBoundingClientRect();
		return jd(e.clientX - (i.left + i.width / 2), e.clientY - (i.top + i.height / 2), {
			top: t,
			min: n,
			max: r
		});
	}, d = c?.value ?? e;
	return {
		shown: d,
		dragging: c != null,
		rootProps: {
			"data-dragging": c ? "" : void 0,
			onPointerDown: (e) => {
				a || c || e.button > 0 || (e.currentTarget.setPointerCapture?.(e.pointerId), l({
					id: e.pointerId,
					value: u(e)
				}));
			},
			onPointerMove: (e) => {
				c && e.pointerId === c.id && l({
					id: c.id,
					value: u(e)
				});
			},
			onPointerUp: (t) => {
				c && t.pointerId === c.id && (l(null), c.value !== e && s(c.value));
			},
			onPointerCancel: () => l(null)
		},
		inputProps: {
			type: "range",
			min: n,
			max: r,
			step: i,
			value: d,
			disabled: a,
			"aria-valuetext": o?.(d),
			onChange: (e) => s(e.currentTarget.valueAsNumber)
		}
	};
}
// packages/core/src/primitives/press.ts
var Nd = 450, Pd = 10, Fd = 1e3;
function Id({ onPress: e, onHold: t, pressed: n, disabled: r, unavailable: i }) {
	let a = r ? void 0 : t, o = (0, I.useRef)(void 0), s = (0, I.useRef)(0), c = (0, I.useRef)({
		x: 0,
		y: 0
	}), [l, u] = (0, I.useState)(!1), d = (0, I.useCallback)(() => {
		window.clearTimeout(o.current), o.current = void 0, u(!1);
	}, []);
	return (0, I.useEffect)(() => d, [d]), {
		type: "button",
		"aria-pressed": n,
		"aria-disabled": i || void 0,
		disabled: r,
		"data-holding": l || void 0,
		onPointerDown: (e) => {
			!a || e.button > 0 || (s.current = 0, c.current = {
				x: e.clientX,
				y: e.clientY
			}, u(!0), o.current = window.setTimeout(() => {
				s.current = Date.now(), u(!1);
				try {
					navigator.vibrate?.(8);
				} catch {}
				a();
			}, Nd));
		},
		onPointerMove: (e) => {
			o.current !== void 0 && Math.hypot(e.clientX - c.current.x, e.clientY - c.current.y) > Pd && d();
		},
		onPointerUp: () => {
			s.current &&= Date.now(), d();
		},
		onPointerCancel: d,
		onPointerLeave: d,
		onContextMenu: (e) => {
			a && e.preventDefault();
		},
		onClick: () => {
			let t = s.current > 0 && Date.now() - s.current < Fd;
			s.current = 0, !t && !i && e();
		}
	};
}
// packages/core/src/primitives/sheet.ts
var Ld = .4, Rd = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function zd({ open: e, label: t, onClose: n, closeMs: r, phone: i, handle: a, snapBack: o }) {
	let s = (0, I.useRef)(null), [c, l] = (0, I.useState)(e), u = (0, I.useRef)(null);
	e && !c && l(!0), (0, I.useEffect)(() => {
		let t = s.current;
		if (!t || !e || !c) return;
		if (t.removeAttribute("data-closing"), t.style.translate = "", t.style.transition = "", !t.open) {
			try {
				t.showModal();
			} catch {
				t.setAttribute("open", "");
			}
			t.querySelector("[data-autofocus]")?.focus();
		}
		let n = document.documentElement, r = n.style.overflow;
		return n.style.overflow = "hidden", () => {
			n.style.overflow = r;
		};
	}, [e, c]), (0, I.useEffect)(() => {
		let t = s.current;
		if (e || !t) return;
		if (!t.open) {
			l(!1);
			return;
		}
		let n = () => {
			t.removeAttribute("data-closing"), t.style.translate = "", t.style.transition = "", t.open && t.close(), l(!1);
		};
		t.setAttribute("data-closing", "");
		let i = window.setTimeout(n, r);
		return () => window.clearTimeout(i);
	}, [e, r]);
	let d = (e) => {
		if (u.current) return;
		let t = e.target;
		e.button > 0 || !window.matchMedia(i).matches || t.closest("dialog") === e.currentTarget && t.closest(a) && !t.closest("button, a, input") && (u.current = {
			id: e.pointerId,
			y0: e.clientY,
			dy: 0,
			trail: [{
				t: e.timeStamp,
				y: e.clientY
			}]
		}, e.currentTarget.setPointerCapture(e.pointerId), e.currentTarget.style.transition = "none");
	}, f = (e) => {
		let t = u.current;
		if (!t || e.pointerId !== t.id) return;
		for (t.dy = e.clientY - t.y0, t.trail.push({
			t: e.timeStamp,
			y: e.clientY
		}); t.trail.length > 2 && e.timeStamp - t.trail[0].t > 100;) t.trail.shift();
		let n = t.dy >= 0 ? t.dy : -3 * Math.sqrt(-t.dy);
		e.currentTarget.style.translate = `0 ${n.toFixed(1)}px`;
	}, p = (e) => {
		let t = u.current;
		if (!t || e.pointerId !== t.id) return;
		u.current = null;
		let r = e.currentTarget, i = t.trail[0], a = t.trail[t.trail.length - 1], s = (a.y - i.y) / Math.max(1, a.t - i.t);
		r.style.transition = "", t.dy > Math.min(140, r.offsetHeight * .3) || t.dy > 12 && s > Ld ? (Rd() || (r.style.translate = ""), r.setAttribute("data-closing", ""), n()) : (r.style.transition = o, r.style.translate = "0 0", window.setTimeout(() => {
			u.current || (r.style.transition = "", r.style.translate = "");
		}, 320));
	};
	return {
		mounted: c,
		dialogProps: {
			ref: s,
			"aria-label": t,
			onCancel: (e) => {
				e.target === e.currentTarget && (e.preventDefault(), n());
			},
			onClick: (e) => {
				let t = s.current;
				if (!t || e.target !== t) return;
				let r = t.getBoundingClientRect();
				(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) && n();
			},
			onPointerDown: d,
			onPointerMove: f,
			onPointerUp: p,
			onPointerCancel: p
		}
	};
}
// packages/core/src/primitives/slider.ts
var Bd = 4, Vd = (e, t, n) => Math.min(1, Math.max(0, (e - t.left - n) / Math.max(1, t.width - n * 2)));
function Hd(e, t, n, r, i) {
	let a;
	switch (e.key) {
		case "ArrowLeft":
		case "ArrowDown":
			a = t - i;
			break;
		case "ArrowRight":
		case "ArrowUp":
			a = t + i;
			break;
		case "PageDown":
			a = t - i * 10;
			break;
		case "PageUp":
			a = t + i * 10;
			break;
		case "Home":
			a = n;
			break;
		case "End":
			a = r;
			break;
		default: return;
	}
	return e.preventDefault(), Ud(Number(a.toFixed(4)), n, r);
}
var Ud = (e, t, n) => Math.min(n, Math.max(t, e)), Wd = (e) => Number(e.toFixed(4));
function Gd(e, t, n, r) {
	let i = Math.ceil(Wd((e - t) / r)), a = Math.ceil(Wd((Math.max(n, t + r) - e) / r));
	return {
		min: Wd(e - i * r),
		max: Wd(e + a * r)
	};
}
function Kd(e, t) {
	let n = (0, I.useRef)(null), r = (0, I.useRef)(null), i = (e) => {
		let t = n.current;
		t && (e ? t.setAttribute("data-anim", "") : t.removeAttribute("data-anim"));
	};
	return {
		ref: n,
		handlers: {
			onPointerDown: (t) => {
				if (r.current || t.button > 0 || !n.current) return;
				let a = t.pointerType !== "mouse";
				r.current = {
					id: t.pointerId,
					x0: t.clientX,
					moved: !1,
					touch: a
				}, t.currentTarget.setPointerCapture(t.pointerId), a || (i(!0), e(t.clientX, n.current, "jump", t.clientX));
			},
			onPointerMove: (t) => {
				let a = r.current;
				if (a && t.pointerId === a.id && n.current) {
					if (!a.moved) {
						if (Math.abs(t.clientX - a.x0) < Bd) return;
						a.moved = !0, i(!1);
					}
					e(t.clientX, n.current, "drag", a.x0);
				}
			},
			onPointerUp: (a) => {
				let o = r.current;
				o && a.pointerId === o.id && (r.current = null, o.touch && !o.moved && n.current && (i(!0), e(a.clientX, n.current, "jump", a.clientX)), t?.());
			},
			onPointerCancel: (e) => {
				r.current?.id === e.pointerId && (r.current = null, t?.());
			}
		},
		still: () => i(!1)
	};
}
function qd(e, t, n, r, i, a, o, s, c = {}) {
	return {
		type: "range",
		...Gd(e, n, r, i),
		step: i,
		value: e,
		"aria-valuetext": t,
		disabled: a,
		onKeyDown: (t) => {
			o();
			let a = c.current ? Ud(c.current(), n, r) : e, l = Hd(t, a, n, r, i);
			l != null && l !== a && (s(l), c.keyed?.(l));
		},
		...c.keyUp && { onKeyUp: c.keyUp },
		onChange: (e) => {
			let t = Ud(Number(e.target.value), n, r);
			s(t), c.swiped?.(t);
		}
	};
}
function Jd({ value: e, min: t, max: n, step: r = 1, inset: i, disabled: a, along: o = Vd, snap: s, reportUnchanged: c, valueText: l, onChange: u, onCommit: d, current: f }) {
	let p = Ud(e, t, n), m = Math.max(r, n - t), h = (0, I.useRef)(void 0), g = (0, I.useRef)(void 0), _ = (e) => {
		let t = e.current;
		e.current = void 0, t != null && d?.(t);
	}, v = Kd((e, a) => {
		let l = t + o(e, a.getBoundingClientRect(), typeof i == "function" ? i(a) : i) * m, d = Ud(s ? s(l) : Number((t + Math.round((l - t) / r) * r).toFixed(4)), t, n);
		h.current = d, (d !== p || c) && u(d);
	}, () => _(h)), y = a || !d ? { current: f } : {
		current: f,
		keyed: (e) => {
			g.current = e;
		},
		keyUp: () => _(g),
		swiped: (e) => d(e)
	};
	return {
		value: p,
		fraction: (e) => Ud((e - t) / m, 0, 1),
		rootProps: { ref: v.ref },
		hitProps: {
			"aria-hidden": !0,
			...a ? {} : v.handlers
		},
		inputProps: qd(p, l(p), t, n, r, a, v.still, (e) => {
			a || u(e);
		}, y)
	};
}
function Yd({ low: e, high: t, min: n, max: r, step: i, inset: a, disabled: o, valueText: s, onChange: c }) {
	let l = Ud(Math.min(e, t), n, r), u = Ud(Math.max(e, t), n, r), d = Math.max(i, r - n), f = (0, I.useRef)(null), p = (e, t) => {
		if (o) return;
		let n = e === "low" ? Math.min(t, u) : l, r = e === "high" ? Math.max(t, l) : u;
		(n !== l || r !== u) && c(n, r);
	}, m = (e, t) => {
		let o = typeof a == "function" ? a(t) : a, s = Vd(e, t.getBoundingClientRect(), o) * d;
		return Ud(Number((n + Math.round(s / i) * i).toFixed(4)), n, r);
	}, h = (e, t) => l === u ? t ? "high" : "low" : Math.abs(e - l) <= Math.abs(e - u) ? "low" : "high", g = Kd((e, t, n, r) => {
		let i = m(e, t);
		n === "jump" ? (f.current = null, p(h(i, i > l), i)) : (f.current ??= h(m(r, t), e > r), p(f.current, i));
	}, () => {
		f.current = null;
	});
	return {
		low: l,
		high: u,
		fraction: (e) => Ud((e - n) / d, 0, 1),
		rootProps: { ref: g.ref },
		hitProps: {
			"aria-hidden": !0,
			...o ? {} : g.handlers
		},
		lowInputProps: qd(l, s(l, "low"), n, r, i, o, g.still, (e) => p("low", e)),
		highInputProps: qd(u, s(u, "high"), n, r, i, o, g.still, (e) => p("high", e))
	};
}
// packages/core/src/primitives/guarded.ts
var Xd = (e) => typeof e == "string" ? e : JSON.stringify(e);
async function Zd(e) {
	try {
		let t = await (typeof e == "function" ? e() : e);
		return t === !1 ? "wrong_code" : t == null || t === !0 ? "done" : t;
	} catch {
		return "failed";
	}
}
function Qd({ run: e, needsCode: t, settled: n, initial: r = null, disabled: i = !1, askElsewhere: a }) {
	let [o, s] = (0, I.useState)(i ? null : r), [c, l] = (0, I.useState)(!1), [u, d] = (0, I.useState)(!1), [f, p] = (0, I.useState)(!1), m = (0, I.useRef)(!0);
	(0, I.useEffect)(() => (m.current = !0, () => {
		m.current = !1;
	}), []);
	let h = r == null ? null : Xd(r);
	(0, I.useEffect)(() => {
		s(i ? null : r), l(!1), p(!1);
	}, [h, i]);
	let g = o != null && n ? n(o) : !1;
	(0, I.useEffect)(() => {
		g && (s(null), l(!1), p(!1));
	}, [g]);
	let _ = () => {
		s(null), l(!1), p(!1);
	}, v = (e, t) => {
		p(!1), l(t), a ? a(e) : s(e);
	};
	return {
		pending: i || g ? null : o,
		pendingKey: o == null ? void 0 : Xd(o),
		code: o != null && (c || t(o)),
		busy: u,
		failed: f,
		ask: (e) => {
			i || v(e, !1);
		},
		attempt: async (n) => {
			if (i) return;
			if (t(n)) {
				v(n, !1);
				return;
			}
			let r = await Zd(() => e(n));
			return r === "wrong_code" && m.current && v(n, !0), r;
		},
		confirm: async () => {
			if (o == null || u) return;
			d(!0), p(!1);
			let t = await Zd(() => e(o));
			m.current && (d(!1), t === "done" ? _() : t === "wrong_code" ? l(!0) : p(!0));
		},
		submit: async (t) => {
			if (o == null) return !1;
			let n = await Zd(() => e(o, t));
			if (n === "failed") throw Error("not sent");
			return n === "done" && m.current && _(), n === "done";
		},
		close: _
	};
}
// packages/core/src/lovelace/card.tsx
function $d({ variant: e = "card", footprint: t = "standard", showControl: n = !0 } = {}) {
	let r = e === "sheet", i = !r && t === "compact";
	return {
		sheet: r,
		compact: i,
		featured: !r && t === "featured",
		bare: i && !n,
		footprint: t
	};
}
function ef(e = {}) {
	let t = (0, I.useId)(), n = `${t}-n`;
	return {
		...$d(e),
		uid: t,
		nameId: n,
		article: { "aria-labelledby": n }
	};
}
function tf(e) {
	return typeof e != "object" || !e ? e : "nativeEvent" in e || typeof Event < "u" && e instanceof Event ? void 0 : e;
}
function nf(e = !1, t) {
	let [n, r] = (0, I.useState)(e || t != null), [i, a] = (0, I.useState)(t);
	return {
		open: n,
		action: i,
		openDetails: (e) => {
			s("details:request"), a(tf(e)), r(!0);
		},
		closeDetails: () => {
			r(!1), a(void 0);
		}
	};
}
function rf({ open: e, onClose: t, label: n, className: r, handle: i, snapBack: a, closeMs: o = 250, phone: s = "(max-width: 600px)", children: l }) {
	let { mounted: u, dialogProps: d } = zd({
		open: e,
		label: n,
		onClose: t,
		closeMs: o,
		phone: s,
		handle: i,
		snapBack: a
	});
	return (0, I.useEffect)(() => {
		e && c("details:visible", { label: n });
	}, [e, n]), /* @__PURE__ */ (0, L.jsx)("dialog", {
		className: r,
		...d,
		children: u && l
	});
}
function af(e, t, n) {
	function r({ open: r, onClose: i, ...a }) {
		let o = {
			...a,
			variant: "sheet",
			onClose: i
		};
		return /* @__PURE__ */ (0, L.jsx)(t, {
			open: r,
			onClose: i,
			label: n(o),
			children: (0, I.createElement)(e, o)
		});
	}
	return r.displayName = `${(e.displayName ?? e.name).replace(/Card$/, "")}Sheet`, r;
}
function of(e, t, n) {
	function r({ defaultOpen: r = !1, defaultAction: i, ...a }) {
		let o = nf(r, r ? i : void 0), s = (0, I.createElement)(e, {
			...a,
			onOpenDetails: o.openDetails
		}), c = {
			...a,
			...o.action != null && { action: o.action },
			open: o.open,
			onClose: o.closeDetails
		};
		return /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [n ? /* @__PURE__ */ (0, L.jsx)("div", {
			className: n,
			children: s
		}) : s, (0, I.createElement)(t, c)] });
	}
	return r.displayName = `${(e.displayName ?? e.name).replace(/Card$/, "")}Tile`, r;
}
// packages/core/src/entities/facts.ts
var sf = (e) => `Last seen ${e ?? "unknown"}`, cf = (e) => `Unavailable since ${e ?? "earlier"}`, lf = (e) => e ? `Since ${e}` : void 0, uf = (e, t) => e ? `Last changed ${e}${t ? ` by ${t}` : ""}` : "", df = (e, t) => e ? `${t ? "Live · updated" : "Updated"} ${e}` : "", ff = "No reading yet", pf = "Not reported", mf = (e) => `${e} now`, hf = {
	none: "No picture",
	open: "Open"
}, gf = (e, t = H()) => be(new Date(e), t), _f = (e, t = H()) => e === void 0 ? void 0 : `Still from ${gf(e, t)}`, vf = (0, I.createContext)(2), yf = (0, I.createContext)(null), bf = (0, I.createContext)(null), xf = (e, t) => e.trim().toLowerCase() === t.trim().toLowerCase();
function Sf(e, { variant: t = "card", footprint: n = "standard", showControl: r = !0, area: i }) {
	let { uid: a, nameId: o, sheet: s, compact: c, featured: l, bare: u } = ef({
		variant: t,
		footprint: n,
		showControl: r
	}), d = (0, I.useContext)(yf), f = (0, I.useContext)(bf), p = d != null && (i == null || d.area != null && xf(i, d.area));
	return {
		uid: a,
		nameId: o,
		area: d ? s ? [d.title, p ? d.area : i].filter(Boolean).join(" · ") : p ? void 0 : i : !s && i != null && f != null && xf(i, f) ? void 0 : i,
		sheet: s,
		compact: c,
		featured: l,
		bare: u,
		article: {
			className: `hd ${e}${s ? " hd--sheet" : ""}${c ? " hd--compact" : ""}${l ? " hd--featured" : ""}`,
			"data-control": u ? "off" : void 0,
			"aria-labelledby": o
		}
	};
}
function Cf(e, t) {
	return {
		"data-role": e,
		"data-glow": t > 0 ? "" : void 0,
		style: { "--hd-glow": +t.toFixed(3) }
	};
}
var wf = () => /* @__PURE__ */ (0, L.jsx)("svg", {
	viewBox: "0 0 16 16",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M4.5 4.5l7 7M11.5 4.5l-7 7" })
});
function Tf({ label: e, pressed: t, unavailable: n, intensity: r = 1, small: i, onToggle: a, onLongPress: o, children: s }) {
	let c = Id({
		onPress: a,
		onHold: o,
		pressed: t,
		unavailable: n
	});
	return /* @__PURE__ */ (0, L.jsx)("button", {
		className: `hd-orb${i ? " hd-orb--sm" : ""}`,
		"aria-label": e,
		style: { "--b": r },
		...c,
		children: /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-orb-i",
			children: s
		})
	});
}
function Ef({ id: e, name: t, onOpen: n, openHint: r = "details", children: i }) {
	let a = (0, I.useContext)(vf) === 3 ? "h3" : "h2";
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-title",
		children: [/* @__PURE__ */ (0, L.jsx)(a, {
			className: "hd-name",
			"aria-labelledby": n ? e : void 0,
			children: n ? /* @__PURE__ */ (0, L.jsxs)("button", {
				type: "button",
				className: "hd-open",
				title: t,
				"aria-label": `${t} ${r}`,
				"aria-haspopup": "dialog",
				onClick: n,
				children: [/* @__PURE__ */ (0, L.jsx)("span", {
					id: e,
					children: t
				}), /* @__PURE__ */ (0, L.jsx)("svg", {
					className: "hd-chev",
					viewBox: "0 0 16 16",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M6 3.5l4.5 4.5L6 12.5" })
				})]
			}) : /* @__PURE__ */ (0, L.jsx)("span", {
				id: e,
				title: t,
				children: t
			})
		}), i]
	});
}
function Df({ label: e, onClick: t, autoFocus: n, children: r }) {
	return /* @__PURE__ */ (0, L.jsx)("button", {
		type: "button",
		className: "hd-circ",
		"aria-label": e,
		onClick: t,
		"data-autofocus": n || void 0,
		children: /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-circ-i",
			children: r
		})
	});
}
function Of({ label: e, onClick: t, focusOnOpen: n = !0 }) {
	return /* @__PURE__ */ (0, L.jsx)(Df, {
		label: e,
		onClick: t,
		autoFocus: n,
		children: /* @__PURE__ */ (0, L.jsx)(wf, {})
	});
}
function kf({ label: e, level: t }) {
	return /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-alert-cue",
		"data-level": t,
		...e ? {
			role: "img",
			"aria-label": e
		} : { "aria-hidden": !0 },
		children: /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 14 14",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "7",
				cy: "7",
				r: "5.5"
			}), /* @__PURE__ */ (0, L.jsx)("path", { d: "M7 3.8v4.1M7 10.3h.01" })]
		})
	});
}
function Af({ label: e, level: t, children: n }) {
	let r = (0, I.useContext)(op);
	return /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(kf, {
		label: e,
		level: t ?? r.level
	}), /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-warn",
		children: jf(n)
	})] });
}
function jf(e) {
	if (typeof e != "string") return e;
	let t = we(e);
	return t.some((e) => e.time) ? t.map((e, t) => e.time ? /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-time",
		children: e.text
	}, t) : e.text) : e;
}
function Mf({ alert: e, more: t, value: n, action: r }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-alarm",
		role: "alert",
		"data-action": r ? "" : void 0,
		children: [
			/* @__PURE__ */ (0, L.jsxs)("span", {
				className: "hd-alarm-l",
				children: [/* @__PURE__ */ (0, L.jsx)("b", { children: e }), t && /* @__PURE__ */ (0, L.jsxs)("span", {
					className: "hd-alarm-c",
					children: [" · ", t]
				})]
			}),
			n && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-alarm-v",
				children: n
			}),
			r
		]
	});
}
function Nf({ label: e, on: t, onToggle: n, children: r, extra: i, action: a, turnOn: o, disabled: s }) {
	let c = Id({
		onPress: n,
		pressed: t,
		disabled: s
	}), l = a ?? i;
	return /* @__PURE__ */ (0, L.jsxs)("button", {
		className: o ? "hd-btn hd-pill hd-pill--turn-on" : "hd-btn hd-pill",
		"aria-label": e,
		...c,
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-pill-w",
			children: r
		}), l && /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-pill-x",
			"data-action": a ? "" : void 0,
			children: l
		})]
	});
}
function Pf({ word: e, rest: t, behind: n }) {
	return /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "hd-said",
		children: [
			n ? " · " : "",
			e,
			t ? " · " : ""
		]
	});
}
function Ff({ start: e, end: t, warn: n }) {
	return /* @__PURE__ */ (0, L.jsxs)("p", {
		className: "hd-info",
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: n ? "hd-warn" : void 0,
			children: e
		}), /* @__PURE__ */ (0, L.jsx)("span", { children: t })]
	});
}
function If({ lastSeen: e, word: t = "Unavailable" }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-unav",
		children: [/* @__PURE__ */ (0, L.jsx)("span", { children: t }), e && /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-unav-t",
			children: sf(e)
		})]
	});
}
function Lf({ label: e, onOpen: t, children: n }) {
	let r = /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-read-i",
		"aria-hidden": "true",
		children: n
	});
	return t ? /* @__PURE__ */ (0, L.jsx)("button", {
		type: "button",
		className: "hd-read",
		"aria-label": `${e}. Open details`,
		onClick: t,
		children: r
	}) : /* @__PURE__ */ (0, L.jsx)("div", {
		className: "hd-read",
		role: "img",
		"aria-label": e,
		children: r
	});
}
var Rf = () => /* @__PURE__ */ (0, L.jsxs)("svg", {
	viewBox: "0 0 24 24",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, L.jsx)("rect", {
			x: "3",
			y: "5",
			width: "18",
			height: "14",
			rx: "2"
		}),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M3 16l5-5 4 4 3-3 6 6" }),
		/* @__PURE__ */ (0, L.jsx)("circle", {
			cx: "16",
			cy: "9",
			r: "1.5"
		})
	]
});
function zf({ picture: e, label: t, ratio: n, fit: r = "cover", unavailable: i = !1, onOpen: a, openLabel: o = hf.open, children: s = /* @__PURE__ */ (0, L.jsx)(Rf, {}) }) {
	let c = i ? void 0 : e.src, l = /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-pic-i",
		children: c ? /* @__PURE__ */ (0, L.jsx)("img", {
			className: "hd-pic-img",
			src: c,
			alt: "",
			draggable: !1,
			decoding: "async"
		}) : /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-pic-glyph",
			"aria-hidden": "true",
			children: s
		})
	}), u = {
		className: "hd-pic",
		style: n ? { aspectRatio: n } : void 0,
		"data-fit": r,
		"data-status": i ? "unavailable" : e.status
	};
	return a && !i ? /* @__PURE__ */ (0, L.jsx)("button", {
		type: "button",
		ref: e.ref,
		...u,
		"aria-label": `${t}. ${o}`,
		onClick: a,
		children: l
	}) : /* @__PURE__ */ (0, L.jsx)("div", {
		ref: e.ref,
		...u,
		role: "img",
		"aria-label": t,
		children: l
	});
}
var Bf = () => /* @__PURE__ */ (0, L.jsx)("svg", {
	className: "hd-step-i",
	viewBox: "0 0 14 14",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M3 7h8" })
}), $ = () => /* @__PURE__ */ (0, L.jsx)("svg", {
	className: "hd-step-i",
	viewBox: "0 0 14 14",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M3 7h8M7 3v8" })
});
function Vf({ label: e, kicker: t, cue: n, value: r, unit: i, format: a = String, min: o, max: s, step: c, onChange: l }) {
	let u = Math.max(o, +(r - c).toFixed(2)), d = Math.min(s, +(r + c).toFixed(2));
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-step",
		role: "group",
		"aria-label": e,
		children: [
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-btn hd-step-b",
				"aria-label": `Lower to ${a(u)}${i}`,
				disabled: r <= o,
				onClick: () => l(u),
				children: /* @__PURE__ */ (0, L.jsx)("span", { children: /* @__PURE__ */ (0, L.jsx)(Bf, {}) })
			}),
			/* @__PURE__ */ (0, L.jsxs)("span", {
				className: "hd-step-v",
				"aria-live": "polite",
				children: [
					t && /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-step-k",
						children: t
					}),
					n && /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-cue",
						children: n
					}),
					a(r),
					/* @__PURE__ */ (0, L.jsx)("small", { children: i })
				]
			}),
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-btn hd-step-b",
				"aria-label": `Raise to ${a(d)}${i}`,
				disabled: r >= s,
				onClick: () => l(d),
				children: /* @__PURE__ */ (0, L.jsx)("span", { children: /* @__PURE__ */ (0, L.jsx)($, {}) })
			})
		]
	});
}
function Hf({ slider: e, inputs: t, className: n, text: r, lit: i = !0, focus: a = "groove", groove: o = !0, disabled: s, style: c, children: l, ...u }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: [
			"hd-track",
			o && "hd-track--groove",
			n
		].filter(Boolean).join(" "),
		...e.rootProps,
		...u,
		"data-lit": i ? void 0 : "false",
		"data-focus": a === "thumb" ? "thumb" : void 0,
		"data-disabled": s || void 0,
		style: c,
		children: [
			r != null && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-track-lab",
				"aria-hidden": "true",
				children: r
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-track-fill",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-track-lab",
					children: r
				})
			})] }),
			l,
			/* @__PURE__ */ (0, L.jsx)("div", {
				className: "hd-track-hit",
				...e.hitProps
			}),
			t.map(({ className: e, ...t }) => /* @__PURE__ */ (0, L.jsx)("input", {
				className: e ? `hd-track-in ${e}` : "hd-track-in",
				...t
			}, t.id))
		]
	});
}
function Uf({ id: e, label: t, slider: n, text: r, heading: i, precision: a = 4, style: o, children: s, ...c }) {
	let l = Jd(n), u = l.value, d = /* @__PURE__ */ (0, L.jsx)(Hf, {
		slider: l,
		inputs: [{
			id: e,
			...t ? { "aria-label": t } : {},
			...l.inputProps
		}],
		text: r?.(u),
		style: {
			"--v": l.fraction(u).toFixed(a),
			...o
		},
		...c,
		children: s?.(u)
	});
	return i ? /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-blk",
		children: [/* @__PURE__ */ (0, L.jsx)("p", {
			className: "hd-blk-h",
			children: i(u)
		}), d]
	}) : d;
}
var Wf = 30;
function Gf({ id: e, label: t, heading: n, value: r, min: i, max: a, on: o, wakes: s, text: c, offText: l = () => "Off", valueText: u, onChange: d, onCommit: f, disabled: p }) {
	return /* @__PURE__ */ (0, L.jsx)(Uf, {
		id: e,
		label: t,
		slider: {
			value: Math.round(r),
			min: i,
			max: a,
			inset: Wf / 2,
			reportUnchanged: s && !o,
			onChange: d,
			onCommit: f,
			disabled: p,
			valueText: u
		},
		disabled: p,
		heading: n ? () => /* @__PURE__ */ (0, L.jsx)("label", {
			htmlFor: e,
			children: n
		}) : void 0,
		className: "hd-level",
		text: (e) => o ? c(e) : l(e),
		lit: o
	});
}
var Kf = {
	outer: 86,
	inner: 62,
	knob: 48
}, qf = (e, t) => {
	let n = e * Math.PI / 180;
	return {
		x: +(t * Math.sin(n)).toFixed(2),
		y: +(-t * Math.cos(n)).toFixed(2)
	};
};
function Jf({ id: e, label: t, heading: n, says: r, valueText: i = r, value: a, min: o, max: s, top: c, step: l = 5, topLabel: u, lit: d, hub: f = 22, disabled: p, onChange: m, children: h }) {
	let g = Md({
		value: a,
		min: o,
		max: s,
		top: c,
		step: l,
		disabled: p,
		valueText: i,
		onChange: m
	}), _ = g.shown, v = _ - c, [y, b] = d?.(_) ?? [Infinity, -Infinity], x = [];
	for (let e = o; e <= s; e += l) x.push(e);
	let S = r(_);
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-blk hd-dial",
		children: [/* @__PURE__ */ (0, L.jsxs)("p", {
			className: "hd-blk-h",
			children: [/* @__PURE__ */ (0, L.jsx)("label", {
				htmlFor: e,
				children: n
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-blk-v",
				"aria-hidden": "true",
				children: S.charAt(0).toUpperCase() + S.slice(1)
			})]
		}), /* @__PURE__ */ (0, L.jsxs)("div", {
			className: "hd-dial-face",
			children: [/* @__PURE__ */ (0, L.jsx)("input", {
				id: e,
				className: "hd-dial-input",
				"aria-label": t,
				...g.inputProps
			}), /* @__PURE__ */ (0, L.jsxs)("svg", {
				viewBox: "-100 -104 200 208",
				"aria-hidden": "true",
				"aria-disabled": p || void 0,
				...g.rootProps,
				children: [
					x.map((e) => {
						let t = qf(e - c, Kf.inner), n = qf(e - c, Kf.outer);
						return /* @__PURE__ */ (0, L.jsx)("path", {
							className: "hd-dial-tick",
							"data-lit": e >= y && e <= b ? "" : void 0,
							d: `M${t.x} ${t.y}L${n.x} ${n.y}`
						}, e);
					}),
					u && /* @__PURE__ */ (0, L.jsx)("text", {
						className: "hd-dial-top",
						x: "0",
						y: -Kf.outer - 8,
						textAnchor: "middle",
						children: u
					}),
					h?.(v),
					/* @__PURE__ */ (0, L.jsxs)("g", {
						className: "hd-dial-turn",
						style: { transform: `rotate(${v}deg)` },
						children: [/* @__PURE__ */ (0, L.jsx)("path", {
							className: "hd-dial-stem",
							d: `M0 ${-f}V${-Kf.knob}`
						}), /* @__PURE__ */ (0, L.jsx)("circle", {
							className: "hd-dial-knob",
							cy: -Kf.knob,
							r: "9"
						})]
					})
				]
			})]
		})]
	});
}
var Yf = [
	0,
	6,
	12,
	18
];
function Xf({ samples: e, currentHour: t, summary: n, title: r = "Today", tone: i, forecastFrom: a }) {
	let o = G();
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-tl",
		style: i ? { "--accent-strong": i } : void 0,
		children: [
			/* @__PURE__ */ (0, L.jsxs)("p", {
				className: "hd-tl-h",
				children: [/* @__PURE__ */ (0, L.jsx)("span", { children: r }), /* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-tl-v",
					children: n
				})]
			}),
			/* @__PURE__ */ (0, L.jsx)("div", {
				className: "hd-tl-bars",
				"aria-hidden": "true",
				children: Array.from({ length: 24 }, (n, r) => {
					let i = e[r], o, s = 0;
					return i === "unavailable" ? o = "unav" : i == null ? o = "future" : a != null && r >= a ? (o = "fc", s = i) : r === t ? (o = i > 0 ? "now" : "now-off", s = i) : i > 0 ? (o = "on", s = i) : o = "off", /* @__PURE__ */ (0, L.jsx)("i", {
						"data-s": o,
						style: { "--h": s.toFixed(2) }
					}, r);
				})
			}),
			/* @__PURE__ */ (0, L.jsx)("div", {
				className: "hd-tl-axis",
				"aria-hidden": "true",
				children: Yf.map((e) => /* @__PURE__ */ (0, L.jsx)("span", { children: xe(e, o) }, e))
			})
		]
	});
}
function Zf({ selected: e, className: t, onPick: n, children: r }) {
	let i = Id({
		onPress: n,
		pressed: e
	});
	return /* @__PURE__ */ (0, L.jsx)("button", {
		className: t ? `hd-chip ${t}` : "hd-chip",
		...i,
		children: r
	});
}
function Qf({ id: e, label: t, options: n, value: r, onChange: i }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-blk",
		children: [/* @__PURE__ */ (0, L.jsx)("p", {
			className: "hd-blk-h",
			children: /* @__PURE__ */ (0, L.jsx)("span", {
				id: e,
				children: t
			})
		}), /* @__PURE__ */ (0, L.jsx)("div", {
			className: "hd-chips",
			role: "group",
			"aria-labelledby": e,
			style: { "--n": n.length },
			children: n.map((e) => /* @__PURE__ */ (0, L.jsxs)(Zf, {
				selected: r === e.value,
				onPick: () => i(e.value),
				children: [/* @__PURE__ */ (0, L.jsx)("span", { children: e.label }), e.sub && /* @__PURE__ */ (0, L.jsx)("small", { children: e.sub })]
			}, String(e.value)))
		})]
	});
}
function $f({ question: e, detail: t, action: n, busy: r, waiting: i = ga, error: a, onConfirm: o, onCancel: s }) {
	let c = (0, I.useId)(), l = Od(), u = (0, I.useRef)(null);
	return (0, I.useEffect)(() => {
		u.current?.closest("dialog")?.open && u.current.focus();
	}, []), /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-cf",
		role: "group",
		"aria-labelledby": `${c}-q`,
		"aria-describedby": `${c}-d`,
		children: [
			/* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-cf-q",
				id: `${c}-q`,
				children: e
			}),
			/* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-cf-d",
				id: `${c}-d`,
				role: "status",
				children: r ? `${i}…` : a ? /* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-warn",
					children: `${a}.`
				}) : t
			}),
			/* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hd-cf-b",
				children: [/* @__PURE__ */ (0, L.jsx)("button", {
					type: "button",
					className: "hd-cf-x",
					ref: u,
					"data-autofocus": "",
					onClick: s,
					children: "Cancel"
				}), /* @__PURE__ */ (0, L.jsx)("button", {
					type: "button",
					className: "hd-cf-ok",
					disabled: r,
					onClick: () => {
						l() && o();
					},
					children: n
				})]
			})
		]
	});
}
var ep = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];
function tp({ prompt: e, text: t, onSubmit: n, onCancel: r }) {
	let i = (0, I.useId)(), { code: a, error: o, busy: s, press: c, back: l, submit: u, rootProps: d, inputProps: f } = Ad({
		text: t,
		onSubmit: n
	}), p = Math.max(4, a.length), m = `${a.length} ${t ? "characters" : "digits"} entered`;
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-kp",
		...d,
		"aria-label": e,
		children: [
			/* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-kp-p",
				id: `${i}-p`,
				role: "status",
				children: s ? `${ba}…` : o === "wrong" ? /* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-warn",
					children: `${ya}.`
				}) : o === "failed" ? /* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-warn",
					children: `${va}.`
				}) : e
			}),
			f ? /* @__PURE__ */ (0, L.jsx)("input", {
				className: "hd-kp-in",
				...f,
				"aria-labelledby": `${i}-p`,
				"data-error": o === "wrong" || void 0,
				placeholder: "Letters or digits"
			}) : /* @__PURE__ */ (0, L.jsx)("div", {
				className: "hd-kp-dots",
				"data-error": o === "wrong" || void 0,
				"data-busy": s || void 0,
				role: "img",
				"aria-label": m,
				children: Array.from({ length: p }, (e, t) => /* @__PURE__ */ (0, L.jsx)("i", { "data-on": t < a.length || void 0 }, t))
			}),
			/* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hd-kp-keys",
				role: "group",
				"aria-labelledby": `${i}-p`,
				children: [
					ep.map((e) => /* @__PURE__ */ (0, L.jsx)("button", {
						type: "button",
						className: "hd-key",
						onClick: () => c(e),
						disabled: s,
						children: e
					}, e)),
					/* @__PURE__ */ (0, L.jsx)("button", {
						type: "button",
						className: "hd-key",
						"aria-label": "Delete",
						onClick: l,
						disabled: !a || s,
						children: /* @__PURE__ */ (0, L.jsx)("svg", {
							viewBox: "0 0 20 20",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M7.5 5h8.5v10H7.5L3.5 10ZM9.5 8l4 4M13.5 8l-4 4" })
						})
					}),
					/* @__PURE__ */ (0, L.jsx)("button", {
						type: "button",
						className: "hd-key",
						onClick: () => c("0"),
						disabled: s,
						children: "0"
					}),
					/* @__PURE__ */ (0, L.jsx)("button", {
						type: "button",
						className: "hd-key hd-key--ok",
						"aria-label": "Enter code",
						onClick: u,
						disabled: !a || s,
						children: /* @__PURE__ */ (0, L.jsx)("svg", {
							viewBox: "0 0 20 20",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M5 10.5 8.5 14 15 6.5" })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-cf-x hd-kp-x",
				onClick: r,
				children: "Cancel"
			})
		]
	});
}
var np = (0, I.createContext)(null);
function rp({ open: e, onClose: t, label: n, children: r }) {
	let i = (0, I.useContext)(np);
	return /* @__PURE__ */ (0, L.jsx)(rf, {
		open: e,
		onClose: t,
		label: n,
		className: "hd-sheet",
		handle: ".hd--sheet > .hd-head",
		snapBack: "translate 300ms var(--ease-drawer)",
		children: /* @__PURE__ */ (0, L.jsx)(vf.Provider, {
			value: 2,
			children: /* @__PURE__ */ (0, L.jsxs)("div", {
				className: `hd-c${i ? " hd-c--more" : ""}`,
				children: [r, i && /* @__PURE__ */ (0, L.jsx)(np.Provider, {
					value: null,
					children: /* @__PURE__ */ (0, L.jsxs)("section", {
						className: "hd-more",
						"aria-label": i.title,
						children: [/* @__PURE__ */ (0, L.jsx)("h3", {
							className: "hd-blk-h",
							children: i.title
						}), i.content]
					})
				})]
			})
		})
	});
}
function ip(e, t = (e) => `${e} details`) {
	return af(e, rp, (e) => t(e.entity.name));
}
function ap(e, t) {
	return of(e, t, "hd-c");
}
var op = (0, I.createContext)({
	sheet: !1,
	unavailable: !1
});
function sp(e) {
	let t = (0, I.useRef)(null), n = (0, I.useRef)(e);
	return (0, I.useLayoutEffect)(() => {
		if (n.current === e) return;
		n.current = e;
		let r = t.current;
		if (!r?.animate) return;
		let i = getComputedStyle(r), a = i.getPropertyValue("--press").trim(), o = Number.parseFloat(a) * (a.endsWith("ms") ? 1 : 1e3), s = i.getPropertyValue("--ease-out").trim();
		if (!o || !s) return;
		let c = window.matchMedia("(prefers-reduced-motion: reduce)").matches, l = r.animate(c ? [{ opacity: 0 }, { opacity: 1 }] : [{
			opacity: 0,
			transform: "scale(0.97)"
		}, {
			opacity: 1,
			transform: "scale(1)"
		}], {
			duration: o,
			easing: s
		});
		return () => l.cancel();
	}, [e]), t;
}
function cp({ climateTempHeader: climateTempHeader, card: e, name: t, attrs: n, level: r, orb: i, glyph: a, unavailable: o = !1, lastSeen: s, unavailableWord: c, onOpen: l, openHint: u, status: d, statusTitle: f, value: p, alert: m, warning: h = p, bareValue: g = p, readout: _, onClose: v, closeLabel: y, closeFocus: b = !0, control: x, urgent: S, slot: C = !0, slotKind: w, facts: T, children: E }) {
	let { article: D, nameId: O, sheet: k, compact: A, bare: j } = e, M = sp(w), N = k ? void 0 : l, P = n["data-role"] === "reading", F = A && !k && r === "urgent" && m && !o && (j || P) ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(kf, { level: r }), /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-warn",
		children: jf(h)
	})] }) : null, ee = S ?? (F && j ? /* @__PURE__ */ (0, L.jsx)("p", {
		className: "hd-val",
		children: F
	}) : F ? /* @__PURE__ */ (0, L.jsx)(Lf, {
		label: m,
		onOpen: N,
		children: F
	}) : j ? /* @__PURE__ */ (0, L.jsx)("p", {
		className: "hd-val",
		children: g
	}) : o ? /* @__PURE__ */ (0, L.jsx)(If, {
		lastSeen: s,
		word: c
	}) : x);
	return /* @__PURE__ */ (0, L.jsx)(op.Provider, {
		value: {
			sheet: k,
			unavailable: o,
			lastSeen: s,
			level: r
		},
		children: /* @__PURE__ */ (0, L.jsxs)("article", {
			...D,
			...n,
            style: (() => {
                const kind = n["data-natura-kind"];
                const state = n["data-state"];
                const baseStyle = { ...(D.style || {}), ...(n.style || {}) };
                let bg = null;
                if (kind === "climate") bg = state === "active" ? "#F3DEB3" : "#D8C4A3";
                if (kind === "light") bg = "#BBDCD1";
                if (kind === "window") bg = state === "on" ? "#F1C3A9" : "#AAC2D0";
                return bg ? { ...baseStyle, background: bg, backgroundColor: bg, color: "#172B2B", "--card": bg, "--card-edge": "#FFFFFF88" } : baseStyle;
            })(),
			"data-level": r,
			children: [
				/* @__PURE__ */ (0, L.jsxs)("header", {
					className: "hd-head",
                    style: climateTempHeader ? { position: "relative", paddingRight: "132px" } : void 0,
					children: [
						i ? /* @__PURE__ */ (0, L.jsx)(Tf, {
							...i,
							unavailable: o,
							onLongPress: N
						}) : /* @__PURE__ */ (0, L.jsx)("span", {
							className: "hd-orb hd-orb--static",
							"aria-hidden": "true",
							"aria-disabled": o || void 0,
							children: /* @__PURE__ */ (0, L.jsx)("span", {
								className: "hd-orb-i",
								children: a
							})
						}),
						/* @__PURE__ */ (0, L.jsxs)(Ef, {
							id: O,
							name: t,
							onOpen: N,
							openHint: u,
							children: [/* @__PURE__ */ (0, L.jsx)("p", {
								className: "hd-area",
								title: f,
								children: jf(d)
							}), A && /* @__PURE__ */ (0, L.jsx)("p", {
								className: "hd-sub",
								children: m ? /* @__PURE__ */ (0, L.jsx)(Af, {
									label: m,
									children: p
								}) : jf(p)
							})]
						}),
                        climateTempHeader && /* @__PURE__ */ (0, L.jsx)("span", { style: { position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "28px", fontWeight: 700, whiteSpace: "nowrap", lineHeight: 1.1, color: "var(--ink)", pointerEvents: "none" }, children: climateTempHeader }),
						_ && /* @__PURE__ */ (0, L.jsx)("p", {
							className: [
								"hd-num",
								_.duplicate && "hd-num--control-duplicate",
								_.word && "hd-num--word",
								_.className
							].filter(Boolean).join(" "),
							..._.label ? {
								role: "img",
								"aria-label": _.label
							} : { "aria-hidden": !0 },
							children: _.value
						}),
						k && /* @__PURE__ */ (0, L.jsx)(Of, {
							label: y ?? `Close ${t}`,
							onClick: v,
							focusOnOpen: b
						})
					]
				}),
				C && /* @__PURE__ */ (0, L.jsx)("div", {
					className: "hd-slot",
					ref: M,
					children: ee
				}),
				E,
				k && T && /* @__PURE__ */ (0, L.jsx)(Ff, { ...T })
			]
		})
	});
}
function lp({ children: e }) {
	let { sheet: t } = (0, I.useContext)(op);
	return t && I.Children.toArray(e).length > 0 ? /* @__PURE__ */ (0, L.jsx)("div", {
		className: "hd-extra",
		children: e
	}) : null;
}
function up({ children: e }) {
	return /* @__PURE__ */ (0, L.jsx)("p", {
		className: "hd-empty",
		children: e
	});
}
function dp({ summary: e, ...t }) {
	let { unavailable: n, lastSeen: r } = (0, I.useContext)(op);
	return /* @__PURE__ */ (0, L.jsx)(Xf, {
		...t,
		summary: n ? cf(r) : e
	});
}
// src/skins/orb/dashboards/Header.tsx
function fp({ title: e, subtitle: t, showTime: n, hourCycle: r, locale: i, timeZone: a, now: o }) {
	let s = vr(o), { date: c, day: l, time: u, period: d } = ge(s, {
		locale: i,
		hourCycle: G({
			hourCycle: r,
			locale: i
		}),
		timeZone: a
	});
	return /* @__PURE__ */ (0, L.jsx)("div", {
		className: "hh-c",
		children: /* @__PURE__ */ (0, L.jsxs)("header", {
			className: "hh",
			children: [/* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hh-t",
				children: [/* @__PURE__ */ (0, L.jsx)("h1", {
					className: "hh-title",
					title: e,
					children: e
				}), /* @__PURE__ */ (0, L.jsx)("p", {
					className: "hh-sub",
					children: t ?? /* @__PURE__ */ (0, L.jsx)("time", {
						dateTime: l,
						children: c
					})
				})]
			}), n && /* @__PURE__ */ (0, L.jsxs)("p", {
				className: "hh-time",
				children: [/* @__PURE__ */ (0, L.jsx)("time", {
					dateTime: s.toISOString(),
					children: u
				}), d && /* @__PURE__ */ (0, L.jsx)("small", { children: d })]
			})]
		})
	});
}
// src/skins/orb/dashboards/layout.tsx
function pp({ children: e, style: t, viewing: n, nav: r, pageRef: i, ...a }) {
	return /* @__PURE__ */ (0, L.jsx)(br, {
		hourCycle: a.hourCycle,
		locale: a.locale,
		children: /* @__PURE__ */ (0, L.jsxs)("div", {
			ref: i,
			className: "dash",
			style: t,
			"data-viewing": n === "far" ? "far" : void 0,
			"data-nav": r ? "" : void 0,
			children: [
				/* Header removed for compact Fire HD 10 dashboard */
				e,
				r && /* @__PURE__ */ (0, L.jsx)("div", {
					className: "dash-dock",
					children: r
				})
			]
		})
	});
}
// src/skins/orb/dashboards/NavBar.tsx
var mp = () => /* @__PURE__ */ (0, L.jsx)("svg", {
	className: "dash-nav-x",
	viewBox: "0 0 12 12",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M4 2.5h5.5V8M9.5 2.5 2.5 9.5" })
});
function hp({ label: e = "Dashboard", items: t }) {
	let n = (0, I.useRef)(null), r = t.find((e) => e.current)?.key;
	return (0, I.useEffect)(() => {
		let e = n.current, t = e?.querySelector("[aria-current]");
		if (!e || !t) return;
		let r = t.offsetLeft - e.offsetLeft;
		(r < e.scrollLeft || r + t.offsetWidth > e.scrollLeft + e.clientWidth) && e.scrollTo({ left: r - 12 });
	}, [r]), /* @__PURE__ */ (0, L.jsx)("nav", {
		className: "dash-nav",
		"aria-label": e,
		children: /* @__PURE__ */ (0, L.jsx)("ul", {
			className: "dash-nav-list",
			ref: n,
			children: t.map((e) => /* @__PURE__ */ (0, L.jsx)("li", { children: /* @__PURE__ */ (0, L.jsxs)("button", {
				type: "button",
				className: "dash-nav-i",
				"aria-current": e.current ? e.kind === "section" ? "location" : "page" : void 0,
				onClick: e.onSelect,
				children: [e.label, e.leaves && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(mp, {}), /* @__PURE__ */ (0, L.jsx)("span", {
					className: "dash-nav-sr",
					children: ", another dashboard"
				})] })]
			}) }, e.key))
		})
	});
}
// packages/core/src/lovelace/nav.ts
var gp = (e) => `section-${e.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "untitled"}`;
function _p(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = gp(e), r = (t.get(n) ?? 0) + 1;
		return t.set(n, r), {
			title: e,
			id: r === 1 ? n : `${n}-${r}`
		};
	});
}
function vp({ entries: e, mainTitle: t, pages: n, sections: r, panels: i }) {
	return (e ?? (n.length ? [{
		kind: "page",
		id: "home"
	}, ...n.map((e) => ({
		kind: "page",
		id: e.id
	}))] : r.map(({ title: e, id: t }) => ({
		kind: "section",
		title: e,
		id: t
	})))).flatMap((e, a) => {
		let o = `${a}:${e.kind}`;
		if (e.kind === "section") {
			let t = r.find((t) => e.id ? t.id === e.id : t.title === e.title);
			return t ? [{
				key: o,
				label: e.label ?? t.title,
				target: {
					kind: "section",
					title: t.title,
					id: t.id
				},
				leaves: !1
			}] : [];
		}
		if (e.kind === "page") {
			let r = e.id === "home" ? t : n.find((t) => t.id === e.id)?.title;
			return r == null ? [] : [{
				key: o,
				label: e.label ?? r,
				target: e,
				leaves: !1
			}];
		}
		let s = e.path.split("/")[1], c = s ? i?.[s] : void 0;
		return [{
			key: o,
			label: e.label ?? c?.title ?? e.path,
			target: e,
			leaves: !0
		}];
	});
}
function yp(e) {
	history.pushState(null, "", e), dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
// packages/core/src/lovelace/sensorCard.ts
var bp = [
	"enum",
	"timestamp",
	"date"
], xp = (e) => typeof e == "string" && e.trim().length > 0;
function Sp(e) {
	let t = e?.attributes;
	if (!t || typeof t != "object" || Array.isArray(t) || ot(t)) return "sensor";
	let n = t.device_class;
	return xp(t.state_class) || xp(t.unit_of_measurement) || xp(n) && !bp.includes(n) ? "numeric" : "sensor";
}
function Cp(e) {
	return z((t) => Sp(t.entities[e]));
}
// packages/core/src/lovelace/useDashboardNav.ts
function wp({ items: e, pages: t, rootRef: n, navigate: r = yp }) {
	let [i, a] = sd((0, I.useMemo)(() => [iu, ...t], [t]), iu), [o, s] = Td(n, i), [c, l] = (0, I.useState)(null);
	(0, I.useEffect)(() => {
		c && i === "home" && (s(c), l(null));
	}, [
		c,
		i,
		s
	]);
	let u = (0, I.useCallback)((e) => {
		a(e), n.current?.scrollIntoView({ block: "start" });
	}, [a, n]);
	return {
		page: i,
		buttons: (0, I.useMemo)(() => {
			let t = (e) => e.id ?? gp(e.title), n = (e) => i === "home" && o === t(e), c = e.some((e) => e.target.kind === "section" && n(e.target));
			return e.map((e) => {
				let o = e.target, d = o.kind === "section" ? n(o) : o.kind === "page" ? i === o.id && !(o.id === "home" && c) : location.pathname === o.path || location.pathname.startsWith(`${o.path}/`), f = o.kind === "page" ? () => u(o.id) : o.kind === "navigate" ? () => r(o.path) : () => {
					if (i === "home") return s(t(o));
					l(t(o)), a(iu);
				};
				return {
					key: e.key,
					label: e.label,
					kind: o.kind,
					leaves: e.leaves,
					current: d,
					onSelect: f
				};
			});
		}, [
			e,
			i,
			o,
			s,
			a,
			u,
			r
		])
	};
}
// packages/core/src/lovelace/useRowLayout.ts
function Tp(e, t, n) {
	let r = (0, I.useRef)(null), i = (0, I.useRef)(void 0), [, a] = (0, I.useState)(0), o = (r) => {
		let i = Gl(r, e.columns, t);
		return ql(e.cards.map((e) => ({
			width: e.width,
			column: e.column,
			height: n ? (a) => n(e.item, Kl(r, i, a, t.gap)) : 1
		})), {
			tracks: i,
			columns: e.columns,
			flow: e.flow,
			align: e.align
		});
	}, s = o(i.current), c = JSON.stringify(s), l = (0, I.useRef)({
		place: o,
		key: c
	});
	return l.current = {
		place: o,
		key: c
	}, (0, I.useLayoutEffect)(() => {
		let e = r.current;
		if (!e) return;
		let t = (e) => {
			i.current = e > 0 ? e : void 0, JSON.stringify(l.current.place(i.current)) !== l.current.key && a((e) => e + 1);
		};
		if (t(e.getBoundingClientRect().width), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(([e]) => t(e.contentRect.width));
		return n.observe(e), () => n.disconnect();
	}, []), {
		ref: r,
		tracks: s.tracks,
		rows: s.rows,
		cells: s.cells.map((e) => ({
			...e,
			style: {
				gridColumn: `${e.column} / span ${e.span}`,
				gridRow: `${e.row} / span ${e.height}`
			}
		})),
		style: { gridTemplateColumns: `repeat(${s.tracks}, minmax(0, 1fr))` },
		anchored: s.anchored
	};
}
// src/skins/orb/bundles/Bundle.tsx
var Ep = (e) => I.Children.toArray(e).filter(I.isValidElement);
function Dp(e, t) {
	return e <= 1 || t === void 0 ? 1 : t < 340 ? e : e === 3 && t < 510 ? 3 : e === 4 ? t < 450 ? 4 : t < 600 ? 2 : 1 : 1;
}
function Op({ label: e, children: t }) {
	let n = Ep(t).map((e) => (0, I.cloneElement)(e, { footprint: "compact" }));
	return /* @__PURE__ */ (0, L.jsx)("div", {
		className: "hb-c",
		children: /* @__PURE__ */ (0, L.jsx)("div", {
			className: "hb hb--joined",
			role: e ? "group" : void 0,
			"aria-label": e,
			"data-n": n.length,
			style: { "--n": n.length },
			children: n.map((e, t) => /* @__PURE__ */ (0, L.jsx)("div", {
				className: "hb-part",
				children: e
			}, e.key ?? t))
		})
	});
}
function kp({ lead: e, label: t, sheetTitle: n = "Also in this bundle", children: r }) {
	let i = (0, I.cloneElement)(e, { footprint: "standard" }), a = Ep(r).map((e) => (0, I.cloneElement)(e, { footprint: "compact" }));
	return /* @__PURE__ */ (0, L.jsx)("div", {
		className: "hb-c",
		children: /* @__PURE__ */ (0, L.jsxs)("div", {
			className: "hb hb--lead",
			role: t ? "group" : void 0,
			"aria-label": t,
			children: [/* @__PURE__ */ (0, L.jsx)("div", {
				className: "hb-part hb-lead",
				children: /* @__PURE__ */ (0, L.jsx)(np.Provider, {
					value: {
						title: n,
						content: a.map((e, t) => /* @__PURE__ */ (0, L.jsx)("div", {
							className: "hb-part",
							children: e
						}, e.key ?? t))
					},
					children: i
				})
			}), a.map((e, t) => /* @__PURE__ */ (0, L.jsx)("div", {
				className: "hb-part hb-row",
				children: e
			}, e.key ?? t))]
		})
	});
}
function Ap({ title: e, area: t, children: n }) {
	let r = (0, I.useId)(), i = (0, I.useContext)(vf) === 3 ? "h3" : "h2", a = Ep(n).map((e) => (0, I.cloneElement)(e, { footprint: "compact" }));
	return /* @__PURE__ */ (0, L.jsx)("div", {
		className: "hb-c",
		children: /* @__PURE__ */ (0, L.jsx)(yf.Provider, {
			value: {
				title: e,
				area: t
			},
			children: /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hb hb--titled",
				role: "group",
				"aria-labelledby": r,
				children: [/* @__PURE__ */ (0, L.jsxs)("div", {
					className: "hb-lid",
					children: [/* @__PURE__ */ (0, L.jsx)(i, {
						className: "hb-lid-name",
						id: r,
						children: e
					}), t && /* @__PURE__ */ (0, L.jsx)("p", {
						className: "hb-lid-area",
						children: t
					})]
				}), a.map((e, t) => /* @__PURE__ */ (0, L.jsx)("div", {
					className: "hb-part hb-row",
					children: e
				}, e.key ?? t))]
			})
		})
	});
}
var jp = (e) => e != null && e <= 15, Mp = (e) => `Battery ${e}%`, Np = "replace soon", Pp = (e) => `${Mp(e)}, ${Np}`;
// packages/core/src/entities/lock/severity.ts
function Fp(e) {
	if (e.state !== "unavailable") {
		if (e.state === "jammed") return "urgent";
		if (jp(e.battery)) return "advisory";
	}
}
// packages/core/src/entities/lock/words.ts
var Ip = {
	locked: "Locked",
	unlocked: "Unlocked",
	locking: "Locking",
	unlocking: "Unlocking",
	jammed: "Jammed",
	open: "Open",
	opening: "Opening",
	unavailable: "Unavailable"
}, Lp = "May not be locked", Rp = (e, t) => `${e === "lock" ? "Lock" : e === "unlock" ? "Unlock" : "Open"} ${t}?`, zp = (e, t) => e === "open" ? `${t} unlatches, and the door can be pushed open.` : e === "unlock" ? "Anyone at the door can open it." : "It locks now.", Bp = (e) => e === "lock" ? "Lock" : e === "unlock" ? "Unlock" : "Open door", Vp = (e) => e === "open" ? "open the door" : e, Hp = _a("lock"), Up = (e, t) => xa([e && "Unlocking", t && "opening the door"]);
// src/skins/orb/cards/lock/icons.tsx
function Wp({ open: e = !1, alert: t = !1 }) {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("rect", {
				x: "4.5",
				y: "9",
				width: "11",
				height: "8",
				rx: "2"
			}),
			/* @__PURE__ */ (0, L.jsx)("path", { d: e ? "M7 9V6.2a3 3 0 0 1 5.9-.8" : "M7 9V6.5a3 3 0 0 1 6 0V9" }),
			t ? /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 11v2.6M10 15.4h.01" }) : /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 12.2v1.8" })
		]
	});
}
function Gp() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M5 17V3.5h10V17M3.5 17h13" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M5 3.5l6 1.6V17" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M9.2 10.5h.01" })
		]
	});
}
// src/skins/orb/cards/lock/LockCard.tsx
function Kp({ entity: e, variant: t, footprint: n, showControl: r, onLock: i, onUnlock: a, onOpenDoor: o, readOnly: s, onOpenDetails: c, onClose: l, action: u }) {
	let d = Sf("lk", {
		variant: t,
		footprint: n,
		showControl: r,
		area: e.area
	}), { uid: f, sheet: p, compact: m, area: h } = d, g = e.state === "unavailable", _ = e.state === "locked", v = e.state === "locking" || e.state === "unlocking" || e.state === "opening", y = e.state === "jammed", b = s ?? (!i && !a), x = Cf("state", 0), S = `${Ip[e.state]}${v ? "…" : ""}`, C = Fp(e), w = (e) => e === "lock" ? i : e === "unlock" ? a : o, T = Qd({
		run: (e, t) => w(e)?.(t),
		needsCode: () => !!e.codeFormat,
		settled: (t) => g || t === "unlock" && e.state === "unlocked" || t === "open" && e.state === "open" || t === "lock" && e.state === "locked",
		initial: u,
		disabled: b,
		askElsewhere: p ? void 0 : (e) => c?.(e)
	}), E = T.pending, D = T.code || E === "lock", O = () => {
		b || g || v || (_ ? T.ask("unlock") : T.attempt("lock"));
	}, k = !g && jp(e.battery), A = C === "urgent" ? Ip.jammed : C === "advisory" ? Mp(e.battery) : null, j = C === "urgent" ? `Warning: ${e.name}: jammed, it ${Lp.toLowerCase()}` : C === "advisory" ? `Warning: ${e.name}: ${Pp(e.battery)}` : null, M = lf(e.lastChanged), N = j ? /* @__PURE__ */ (0, L.jsx)(Af, {
		label: j,
		children: C === "urgent" && !m ? `${A} · ${Lp.toLowerCase()}` : A
	}) : h ?? (g ? "Unavailable" : M), P = _ ? "Unlock…" : y ? void 0 : "Lock", F = g ? `${e.name}: Unavailable` : v ? `${e.name}: ${S}` : _ ? `Unlock ${e.name}…` : `Lock ${e.name}`, ee;
	ee = b || v ? /* @__PURE__ */ (0, L.jsxs)("p", {
		className: "hd-st lk-st",
		"data-moving": v || void 0,
		children: [S, b && e.changedBy && !v ? /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "lk-st-x",
			children: [" by ", e.changedBy]
		}) : null]
	}) : /* @__PURE__ */ (0, L.jsx)(Nf, {
		label: _ ? `${e.name}: Locked · Unlock…` : y ? `${e.name}: Jammed · Lock again` : `${e.name}: ${S} · Lock`,
		on: _,
		onToggle: O,
		extra: P,
		children: y ? "Lock again" : S
	});
	let te = /* @__PURE__ */ (0, L.jsx)(Wp, {
		open: !g && !_ && e.state !== "locking",
		alert: y
	}), ne = e.supportsOpen && !!o && !b && !g && !v && e.state !== "open", re = b ? void 0 : Up(_, ne);
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: d,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...x
		},
		level: C,
		orb: b ? void 0 : {
			label: F,
			pressed: _,
			intensity: 0,
			onToggle: O,
			children: te
		},
		glyph: b ? te : void 0,
		unavailable: g,
		lastSeen: e.lastSeen,
		onOpen: c && (() => c()),
		status: N,
		value: j ? A : S,
		alert: j,
		bareValue: y ? A : S,
		readout: {
			value: g ? null : S,
			duplicate: !0,
			word: !0
		},
		onClose: l,
		closeFocus: !E,
		control: ee,
		facts: {
			start: g ? sf(e.lastSeen) : uf(e.lastChanged, e.changedBy),
			end: b ? "View only" : e.codeFormat ? "Code to unlock" : "No code"
		},
		children: [!g && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
			E && (D ? /* @__PURE__ */ (0, L.jsx)(tp, {
				prompt: `Enter the code to ${Vp(E)}`,
				text: e.codeFormat === "text",
				onSubmit: T.submit,
				onCancel: T.close
			}, E) : /* @__PURE__ */ (0, L.jsx)($f, {
				busy: T.busy,
				waiting: Hp,
				error: T.failed ? "Didn’t go through. Try again" : null,
				question: Rp(E, e.name),
				detail: zp(E, e.name),
				action: Bp(E),
				onConfirm: () => void T.confirm(),
				onCancel: T.close
			}, E)),
			!E && ne && /* @__PURE__ */ (0, L.jsxs)("button", {
				type: "button",
				className: "lk-door",
				"aria-label": "Open door…",
				"aria-describedby": `${f}-door`,
				onClick: () => T.ask("open"),
				children: [
					/* @__PURE__ */ (0, L.jsx)(Gp, {}),
					/* @__PURE__ */ (0, L.jsx)("span", { children: "Open door…" }),
					/* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-blk-v",
						id: `${f}-door`,
						children: "Unlatch it"
					})
				]
			}),
			!E && re && /* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-note",
				children: re
			})
		] }), !g && !E && e.battery != null && /* @__PURE__ */ (0, L.jsx)("dl", {
			className: "lk-last",
			children: e.battery != null && /* @__PURE__ */ (0, L.jsxs)("div", { children: [/* @__PURE__ */ (0, L.jsx)("dt", { children: "Battery" }), /* @__PURE__ */ (0, L.jsx)("dd", { children: k ? `${e.battery}% · replace soon` : `${e.battery}%` })] })
		})]
	});
}
// src/skins/orb/cards/lock/LockTile.tsx
var qp = ap(Kp, ip(Kp));
// src/skins/orb/ha/HaLockTile.tsx
function Jp({ entityId: e, batteryEntityId: t, name: n, area: r, lastSeen: i, onActionError: a, ...o }) {
	let { entity: s, actions: c } = na(e, {
		batteryEntityId: t,
		name: n,
		area: r,
		lastSeen: i,
		onActionError: a
	});
	return /* @__PURE__ */ (0, L.jsx)(qp, {
		...o,
		entity: s,
		onLock: c.onLock,
		onUnlock: c.onUnlock,
		onOpenDoor: c.onOpen
	});
}
// packages/core/src/entities/fan/power.ts
var Yp = (e) => e.state !== "unavailable" && (e.state === "on" ? e.supportsTurnOff !== !1 : e.supportsTurnOn !== !1), Xp = (e) => e.charAt(0).toUpperCase() + e.slice(1).replace(/_/g, " "), Zp = (e, t) => e.state === "unavailable" ? "Unavailable" : e.state === "unknown" ? "Unknown" : e.state === "on" ? t ?? "On" : "Off", Qp = [{
	value: "off",
	label: "Aus"
}, {
	value: "on",
	label: "Ein"
}], $p = {
	forward: "Forward",
	reverse: "Reverse"
}, em = (e) => e.state === "on" ? e.presetMode ? Xp(e.presetMode) : e.oscillating ? "Oscillating" : null : null;
function tm(e, t, n) {
	if (!n) return "Off";
	let r = sa(t) ? `speed ${e} of ${t}` : `${oa(e, t)} percent`;
	return r.charAt(0).toUpperCase() + r.slice(1);
}
function nm(e) {
	let t = e.speedCount ?? 0, n = [
		e.supportsSpeed && t >= 2 ? sa(t) ? `${t} speeds` : "variable speed" : null,
		e.supportsPreset ? "presets" : null,
		e.supportsOscillate ? "oscillates" : null,
		e.supportsDirection ? "reverses" : null
	].filter(Boolean).join(", ");
	return n ? n.charAt(0).toUpperCase() + n.slice(1) : "On / off";
}
// src/skins/orb/cards/fan/icons.tsx
var rm = "M9.9 8.3C7.6 7.6 6.3 4.7 7.6 2.9a2.9 2.9 0 0 1 4.6.2c1.3 2-.1 4.4-1.6 5.3";
function im() {
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: /* @__PURE__ */ (0, L.jsxs)("g", {
			transform: "translate(0 0.8)",
			children: [[
				0,
				120,
				240
			].map((e) => /* @__PURE__ */ (0, L.jsx)("path", {
				d: rm,
				transform: `rotate(${e} 10 10)`
			}, e)), /* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "10",
				cy: "10",
				r: "1.6"
			})]
		})
	});
}
// src/skins/orb/cards/fan/parts.tsx
function am({ id: e, label: t, percent: n, count: r, on: i, onChange: a }) {
	return /* @__PURE__ */ (0, L.jsx)(Gf, {
		id: e,
		label: t,
		value: aa(n, r),
		min: 1,
		max: r,
		on: i,
		wakes: !0,
		text: (e) => ca(oa(e, r), r),
		valueText: (e) => tm(e, r, i),
		onChange: (e) => a(oa(e, r))
	});
}
// src/skins/orb/cards/fan/FanCard.tsx
var om = ["forward", "reverse"].map((e) => ({
	value: e,
	label: $p[e]
}));
function sm({ entity: e, history: t, variant: n, footprint: r, showControl: i, onToggle: a, onTurnOn: o, onTurnOff: s, onPercentageChange: c, onPresetChange: l, onOscillateChange: u, onDirectionChange: d, onOpenDetails: f, onClose: p }) {
	let m = Sf("fn", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: h, sheet: g, area: _ } = m, v = e.state === "unavailable", y = e.state === "on", b = v || Yp(e), x = Cf("state", 0), S = e.speedCount ?? 0, C = !!(e.supportsSpeed && S >= 2 && c), w = y && e.supportsSpeed && e.percentage != null && S >= 2 ? ca(e.percentage, S) : null, T = Zp(e, w), E = y ? lf(e.lastChanged) : "Turn on", D = em(e), O = v ? e.lastSeen : e.lastChanged, k = D ?? lf(O) ?? null, A = Tt(e) && !!o && !!s, j = !v && (A || e.supportsPreset && e.presetModes && l || e.supportsOscillate && u || e.supportsDirection && d);
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: m,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...x
		},
		orb: b ? {
			label: e.name,
			pressed: y,
			intensity: .7,
			onToggle: a,
			children: /* @__PURE__ */ (0, L.jsx)(im, {})
		} : void 0,
		glyph: b ? void 0 : /* @__PURE__ */ (0, L.jsx)(im, {}),
		unavailable: v,
		lastSeen: e.lastSeen,
		onOpen: f,
		status: _ ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [_, D && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "fn-mode",
			children: [" · ", D]
		})] }) : !g && k,
		statusTitle: _,
		value: T,
		readout: {
			value: v ? null : w?.endsWith("%") ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [w.slice(0, -1), /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) : T,
			duplicate: !0,
			word: !w?.endsWith("%")
		},
		onClose: p,
		control: C ? /* @__PURE__ */ (0, L.jsx)(am, {
			id: `${h}-speed`,
			label: `${e.name} speed`,
			percent: y && e.percentage != null ? e.percentage : oa(1, S),
			count: S,
			on: y,
			onChange: c
		}) : b ? /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: `${e.name}: ${T}${E ? ` · ${E}` : ""}`,
			on: y,
			onToggle: a,
			extra: E,
			children: T
		}) : /* @__PURE__ */ (0, L.jsx)("p", {
			className: "hd-st",
			children: T
		}),
		facts: {
			start: v ? sf(e.lastSeen) : uf(e.lastChanged),
			end: nm(e)
		},
		children: [j && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
			A && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-note",
				children: Et(e)
			}), /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${h}-w`,
				label: "Turn",
				options: [...Dt],
				value: null,
				onChange: (e) => (e === "on" ? o : s)?.()
			})] }),
			e.supportsPreset && e.presetModes && l && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${h}-p`,
				label: "Preset",
				options: e.presetModes.map((e) => ({
					value: e,
					label: Xp(e)
				})),
				value: e.presetMode,
				onChange: l
			}),
			e.supportsOscillate && u && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${h}-o`,
				label: "Oscillation",
				options: [...Qp],
				value: e.oscillating == null ? null : e.oscillating ? "on" : "off",
				onChange: (e) => u(e === "on")
			}),
			e.supportsDirection && d && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${h}-d`,
				label: "Direction",
				options: om,
				value: e.direction,
				onChange: d
			})
		] }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut("on", t.onMinutes)
		})]
	});
}
// src/skins/orb/cards/fan/FanTile.tsx
var cm = ap(sm, ip(sm));
// src/skins/orb/ha/HaFanTile.tsx
function lm({ entityId: e, name: t, area: n, lastSeen: r, history: i, loadHistory: a, onActionError: o, ...s }) {
	let c = fa(e, {
		name: t,
		area: n,
		lastSeen: r,
		history: i,
		loadHistory: a,
		onActionError: o
	});
	return /* @__PURE__ */ (0, L.jsx)(cm, {
		...s,
		entity: c.entity,
		history: c.history,
		...c.actions
	});
}
// src/skins/orb/cards/guestWifi/icons.tsx
function um() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M2.6 8.1a10.4 10.4 0 0 1 14.8 0" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M5.3 10.9a6.6 6.6 0 0 1 9.4 0" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M7.9 13.6a3 3 0 0 1 4.2 0" }),
			/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "10",
				cy: "16.1",
				r: "1",
				fill: "currentColor",
				stroke: "none"
			})
		]
	});
}
// src/skins/orb/cards/guestWifi/GuestWifiCard.tsx
var dm = (e) => e[0].toUpperCase() + e.slice(1);
function fm({ entity: e, variant: t, footprint: n, showControl: r, onOpenDetails: i, onClose: a, onRefresh: o, onNewCode: s }) {
	let c = Sf("gw", {
		variant: t,
		footprint: n,
		showControl: r,
		area: e.area
	}), { sheet: l, featured: u, nameId: d } = c, [f, p] = (0, I.useState)(null), [m, h] = (0, I.useState)(), g = e.state === "unavailable", _ = e.state === "ready" && e.code != null, v = e.access === "password", y = Qd({
		run: () => s?.(),
		needsCode: () => !1,
		disabled: !s || g
	}), b = Ma(e), x = Cf("reading", 0), S = _ ? [Ea(e), Da(e)].filter(Boolean).join(" · ") : "", C = Na(e), w = g ? "Unavailable" : _ ? e.code : C, T = _ ? `${b} ${Aa(e.code)}` : C.toLowerCase(), E = g ? "Unavailable" : e.network ?? c.area, D = _ && (!Oa(e.code) || e.code.length > 13) ? "" : void 0, O = /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-bar gw-bar",
		children: _ ? /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-label",
				children: dm(b)
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "gw-code",
				"data-long": D,
				children: e.code
			})]
		}) : /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-none",
			children: C
		})
	}), k = (e, t) => t && (() => {
		f || (p(e), t().finally(() => p(null)));
	}), A = k("refresh", o), j = k("new", s), M = j ? [za(e), v && Ha].filter(Boolean).join(" ") : "", N = _ ? e.qr : void 0, P = N != null && m === N, F = u && _ && !N, ee = (u || l) && !g && /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "gw-join",
		"data-qr": N ? "" : void 0,
		"data-failed": P ? "" : void 0,
		"data-empty": F ? "" : void 0,
		children: [
			F && /* @__PURE__ */ (0, L.jsx)(up, { children: "No QR code" }),
			N && (P ? /* @__PURE__ */ (0, L.jsx)("span", {
				className: "gw-qr",
				"aria-hidden": "true"
			}) : /* @__PURE__ */ (0, L.jsx)("img", {
				className: "gw-qr",
				src: N,
				alt: `QR code to join ${e.network ?? "the network"}`,
				draggable: !1,
				onError: () => h(N)
			})),
			/* @__PURE__ */ (0, L.jsxs)("p", {
				className: "gw-how",
				children: [_ ? P ? Ra(e) : Ia(e) : l ? Pa(e) : "Make one in details.", u && S && /* @__PURE__ */ (0, L.jsx)("span", {
					className: "gw-terms",
					children: S
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: c,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...x
		},
		glyph: /* @__PURE__ */ (0, L.jsx)(um, {}),
		unavailable: g,
		lastSeen: e.lastSeen,
		onOpen: i,
		status: E,
		value: w,
		onClose: a,
		control: l || !i ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: T,
			children: O
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${T}`,
			onOpen: i,
			children: O
		}),
		facts: {
			start: g ? sf(e.lastSeen) : df(e.lastUpdated),
			end: g ? "" : Fa(e.created)
		},
		children: [ee, /* @__PURE__ */ (0, L.jsx)(lp, { children: !g && (A || j || S) && (y.pending === "new" ? /* @__PURE__ */ (0, L.jsx)($f, {
			question: Va(e),
			detail: za(e),
			action: "Change",
			busy: y.busy,
			waiting: "Changing the password",
			error: y.failed ? "Didn’t go through. Try again" : null,
			onConfirm: () => void y.confirm(),
			onCancel: y.close
		}) : /* @__PURE__ */ (0, L.jsxs)("section", {
			className: "hd-blk gw-codes",
			"aria-labelledby": `${d}-c`,
			children: [
				/* @__PURE__ */ (0, L.jsxs)("h3", {
					className: "hd-blk-h",
					id: `${d}-c`,
					children: [v ? "Wi-Fi password" : "Codes", S && /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-blk-v",
						children: S
					})]
				}),
				(A || j) && /* @__PURE__ */ (0, L.jsxs)("div", {
					className: "gw-acts",
					children: [A && /* @__PURE__ */ (0, L.jsx)(Nf, {
						label: f === "refresh" ? `Checking the ${b}` : `Refresh ${e.name}'s ${b}`,
						onToggle: A,
						children: f === "refresh" ? "Checking…" : "Refresh"
					}), j && /* @__PURE__ */ (0, L.jsx)(Nf, {
						label: f === "new" ? `Making a new ${b}` : `Make a new ${b} for ${e.name}${v ? "…" : ""}`,
						onToggle: v ? () => y.ask("new") : j,
						children: f === "new" ? "Making…" : `New ${b}${v ? "…" : ""}`
					})]
				}),
				/* @__PURE__ */ (0, L.jsxs)("p", {
					className: "gw-note",
					children: [/* @__PURE__ */ (0, L.jsx)("span", {
						role: "status",
						children: f === "new" ? `Making a new ${b}…` : f === "refresh" ? `Checking the ${b}…` : M
					}), /* @__PURE__ */ (0, L.jsx)("span", {
						className: "gw-note-room",
						"aria-hidden": "true",
						children: M
					})]
				})
			]
		})) })]
	});
}
// src/skins/orb/cards/guestWifi/GuestWifiTile.tsx
var pm = ap(fm, ip(fm));
// src/skins/orb/ha/HaGuestWifiTile.tsx
function mm({ entityId: e, access: t, network: n, qrEntityId: r, newCodeEntityId: i, refreshEntityId: a, name: o, area: s, lastSeen: c, onActionError: l, ...u }) {
	let d = Xa(e, {
		access: t,
		network: n,
		qrEntityId: r,
		newCodeEntityId: i,
		refreshEntityId: a,
		name: o,
		area: s,
		lastSeen: c,
		onActionError: l
	});
	return /* @__PURE__ */ (0, L.jsx)(pm, {
		...u,
		entity: d.entity,
		...d.actions
	});
}
// packages/core/src/entities/binarySensor/severity.ts
var hm = {
	smoke: "alarm",
	gas: "alarm",
	carbon_monoxide: "alarm",
	moisture: "urgent",
	heat: "urgent",
	safety: "urgent",
	tamper: "urgent",
	problem: "urgent",
	cold: "advisory",
	battery: "advisory",
	garage_door: "advisory"
}, gm = (e) => e.state === "on" && e.deviceClass ? hm[e.deviceClass] : void 0;
function _m(e) {
	if (e.state !== "unavailable") return gm(e) ?? (jp(e.battery) ? "advisory" : void 0);
}
// src/skins/orb/cards/binarySensor/icons.tsx
function vm({ picture: e, on: t = !1 }) {
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: ym[e](t)
	});
}
var ym = {
	door: (e) => e ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M5 17V3.5h10V17M3.5 17h13" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M5 3.5l6 1.6V17" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M9.2 10.5h.01" })
	] }) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M5 17V3.5h10V17M3.5 17h13" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M12.2 10.5h.01" })] }),
	window: (e) => e ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M4 3.5h12v13H4z" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.5v13" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.5l4.5 2.5v12.5L10 16.5" })
	] }) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M4 3.5h12v13H4z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.5v13M4 10h12" })] }),
	leak: (e) => e ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 2.8c2.2 2.7 3.6 4.7 3.6 6.5a3.6 3.6 0 0 1-7.2 0c0-1.8 1.4-3.8 3.6-6.5Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M3 16.5c1.2-.9 2.3-.9 3.5 0s2.3.9 3.5 0 2.3-.9 3.5 0 2.3.9 3.5 0" })] }) : /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.5c2.8 3.4 4.5 6 4.5 8.2a4.5 4.5 0 0 1-9 0c0-2.2 1.7-4.8 4.5-8.2Z" }),
	smoke: (e) => /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 4.5h13" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M5.5 4.5a4.5 3.6 0 0 0 9 0" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 6.2h.01" }),
		e && /* @__PURE__ */ (0, L.jsx)("path", { d: "M7 11c-.9 1.2.9 2.1 0 3.4M10 11c-.9 1.2.9 2.1 0 3.4M13 11c-.9 1.2.9 2.1 0 3.4" })
	] }),
	motion: (e) => /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("circle", {
			cx: "10",
			cy: "10",
			r: "1.6"
		}),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M7 7a4.2 4.2 0 0 0 0 6M13 7a4.2 4.2 0 0 1 0 6" }),
		e && /* @__PURE__ */ (0, L.jsx)("path", { d: "M4.5 4.5a7.8 7.8 0 0 0 0 11M15.5 4.5a7.8 7.8 0 0 1 0 11" })
	] }),
	sensor: (e) => /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("circle", {
		cx: "10",
		cy: "10",
		r: "6.5"
	}), /* @__PURE__ */ (0, L.jsx)("circle", {
		cx: "10",
		cy: "10",
		r: "2.5",
		fill: e ? "currentColor" : "none"
	})] })
};
// src/skins/orb/cards/binarySensor/BinarySensorCard.tsx
function bm({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenDetails: a, onClose: o }) {
	let s = Sf("bs", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { sheet: c, area: l } = s, u = e.state === "unavailable", d = e.state === "on", f = Cf("reading", 0), p = So(e), m = xo(e.deviceClass), h = _m(e), g = gm(e), _ = g === "alarm", v = g ? yo(e) : void 0, y = !u && jp(e.battery), b = v ?? (h ? Mp(e.battery) : void 0), x = b ? `${_ ? "Alert" : "Warning"}: ${e.name}: ${v ? bo(e) : Pp(e.battery)}` : null, S = !u && e.lastChanged ? e.lastChanged : void 0, C = S ? `Since ${S}` : void 0, w = u ? "Unavailable" : x && !_ ? /* @__PURE__ */ (0, L.jsx)(Af, {
		label: x,
		children: b
	}) : l ?? C, T = `${p}${S ? `, since ${S}` : ""}`, E = /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "hd-bar hd-bar--pair bs-bar",
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-metric hd-metric-w bs-f",
			children: p
		}), S && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric hd-metric--sub bs-since",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-label",
				children: "Since"
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-metric-t",
				children: S
			})]
		})]
	});
	return /* @__PURE__ */ (0, L.jsx)(cp, {
		card: s,
		name: e.name,
		attrs: {
			"data-natura-kind": "window",
			"data-state": e.state,
			...f
		},
		level: h,
		glyph: /* @__PURE__ */ (0, L.jsx)(vm, {
			picture: wo(e.deviceClass),
			on: d
		}),
		unavailable: u,
		lastSeen: e.lastSeen,
		onOpen: a,
		status: w,
		value: b ?? p,
		alert: x,
		bareValue: p,
		readout: {
			value: u ? null : p,
			label: c && !u ? T : void 0,
			word: !0
		},
		onClose: o,
		slot: !c || u || _,
		urgent: _ ? /* @__PURE__ */ (0, L.jsx)(Mf, {
			alert: _o(e),
			value: S && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "bs-al-k",
				children: "Since "
			}), S] })
		}) : void 0,
		control: c || !a ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: T,
			children: E
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${T}`,
			onOpen: a,
			children: E
		}),
		facts: {
			start: u ? sf(e.lastSeen) : uf(e.lastChanged),
			end: e.battery == null || u ? "" : y ? /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-warn",
				children: Pp(e.battery)
			}) : Mp(e.battery)
		},
		children: t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut(m.today, t.onMinutes)
		})
	});
}
// src/skins/orb/cards/binarySensor/BinarySensorTile.tsx
var xm = ap(bm, ip(bm));
// src/skins/orb/ha/HaBinarySensorTile.tsx
function Sm({ entityId: e, batteryEntityId: t, name: n, area: r, lastSeen: i, history: a, loadHistory: o, ...s }) {
	let c = Eo(e, {
		batteryEntityId: t,
		name: n,
		area: r,
		lastSeen: i,
		history: a,
		loadHistory: o
	});
	return /* @__PURE__ */ (0, L.jsx)(xm, {
		...s,
		entity: c.entity,
		history: c.history
	});
}
// packages/core/src/entities/camera/words.ts
var Cm = {
	idle: "Idle",
	recording: "Recording",
	streaming: "Streaming",
	unavailable: "Unavailable"
};
function wm(e) {
	return e.state === "other" ? e.stateText ?? "Unknown" : Cm[e.state];
}
var Tm = (e) => `Open ${e}'s live view`, Em = (e) => e ? "Open live view" : "Open details";
function Dm(e, t, n = H()) {
	if (t && e.state !== "unavailable") {
		if (t.status === "none" || t.status === "failed") return hf.none;
		if (t.status === "stale") return _f(t.at, n);
	}
}
function Om(e) {
	let t = [[e.brand, e.model].filter(Boolean).join(" "), e.motionDetection == null ? void 0 : `motion detection ${e.motionDetection ? "on" : "off"}`].filter(Boolean).join(" · ");
	return t.charAt(0).toUpperCase() + t.slice(1);
}
// src/skins/orb/cards/camera/icons.tsx
function km({ state: e = "idle" }) {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("rect", {
				x: "2.5",
				y: "5.5",
				width: "11",
				height: "8",
				rx: "2"
			}),
			/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "8",
				cy: "9.5",
				r: "2"
			}),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M13.5 8.5l3-1.8v5.6l-3-1.8" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M8 13.5v2.5M5.5 16h5" }),
			e === "recording" && /* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "4.9",
				cy: "7.7",
				r: "0.9",
				fill: "currentColor",
				stroke: "none"
			}),
			e === "streaming" && /* @__PURE__ */ (0, L.jsx)("path", { d: "M16.3 3.4a3.2 3.2 0 0 1 1.4 1.9M15.6 1.8a5 5 0 0 1 3 2.6" })
		]
	});
}
// src/skins/orb/cards/camera/CameraCard.tsx
function Am({ entity: e, still: t = !0, refresh: n = 10, paused: r = !1, variant: i, footprint: a, showControl: o, onOpenLive: s, onOpenDetails: c, onClose: l }) {
	let u = Sf("cm", {
		variant: i,
		footprint: a,
		showControl: o,
		area: e.area
	}), { sheet: d, compact: f, featured: p, area: m } = u, h = e.state === "unavailable", g = wm(e), _ = t && !f, v = md(_ && !h ? e.picture : void 0, {
		refresh: n * 1e3,
		paused: r
	}), y = G(), b = _ ? Dm(e, v, y) : void 0, x = d ? s : s ?? c, S = !h && e.lastChanged ? e.lastChanged : void 0, C = h ? g : b ?? m ?? lf(S), w = `${g}${S ? `, since ${S}` : ""}`, T = !!s, E = e.state === "other", D = /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "hd-bar hd-bar--pair cm-bar",
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-metric hd-metric-w cm-f",
			"data-own": E || void 0,
			children: g
		}), S && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric hd-metric--sub cm-since",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-label",
				children: "Since"
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-metric-t",
				children: S
			})]
		})]
	}), O = _ && (!h || p && !d), k = O && /* @__PURE__ */ (0, L.jsx)("div", {
		className: "cm-pic",
		children: /* @__PURE__ */ (0, L.jsx)(zf, {
			picture: v,
			label: `${e.name}: ${g}`,
			fit: d ? "contain" : "cover",
			ratio: d ? "16 / 9" : void 0,
			unavailable: h,
			onOpen: x,
			openLabel: Em(T),
			children: /* @__PURE__ */ (0, L.jsx)(km, { state: e.state })
		})
	});
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: u,
		name: e.name,
		attrs: {
			"data-state": e.state,
			"data-still": O ? "" : void 0,
			...Cf("reading", 0)
		},
		glyph: /* @__PURE__ */ (0, L.jsx)(km, { state: e.state }),
		unavailable: h,
		lastSeen: e.lastSeen,
		onOpen: c,
		status: C,
		value: g,
		readout: {
			value: h ? null : g,
			label: d && !h ? w : void 0,
			word: !0
		},
		onClose: l,
		slot: !d || h,
		control: d || !c ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: w,
			children: D
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${w}`,
			onOpen: c,
			children: D
		}),
		facts: {
			start: h ? sf(e.lastSeen) : uf(e.lastChanged),
			end: h ? "" : Om(e)
		},
		children: [s && !h && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: Tm(e.name),
			onToggle: s,
			children: "Live view"
		}) }), k]
	});
}
// src/skins/orb/cards/camera/CameraTile.tsx
var jm = ap(Am, ip(Am));
// src/skins/orb/ha/HaCameraTile.tsx
function Mm({ entityId: e, name: t, area: n, lastSeen: r, still: i = !0, ...a }) {
	let o = ko(e, {
		name: t,
		area: n,
		lastSeen: r,
		still: i
	}), s = Ya(e);
	return /* @__PURE__ */ (0, L.jsx)(jm, {
		...a,
		still: i,
		entity: o.entity,
		onOpenLive: s
	});
}
// packages/core/src/entities/volume.ts
var Nm = "Volume", Pm = (e, t) => t ? `${t} · ${e}%` : `${Nm} ${e}%`, Fm = (e, t) => t ? `${e} percent, ${t}` : `${e} percent`, Im = {
	playing: "Playing",
	paused: "Paused",
	buffering: "Buffering",
	idle: "Idle",
	on: "On",
	standby: "Standby",
	off: "Off",
	unavailable: "Unavailable"
}, Lm = "Muted";
function Rm(e) {
	return e.state === "unavailable" ? Im.unavailable : e.stateText ? e.stateText : e.state === "other" ? "Unknown" : Im[e.state];
}
var zm = (e) => e.state === "playing" || e.state === "buffering", Bm = (e) => zm(e) || e.state === "on", Vm = (e) => e.state === "off" || e.state === "standby", Hm = (e) => e.state !== "unavailable" && !Vm(e), Um = (e) => Hm(e) ? e.title : void 0, Wm = (e) => Hm(e) ? e.artist : void 0;
function Gm(e) {
	if (!Hm(e)) return;
	let t = [e.title, e.artist].filter((e) => !!e?.trim());
	return t.length ? t.join(" · ") : e.app;
}
var Km = (e) => zm(e) || e.state === "paused" ? "No title" : "Nothing playing";
function qm(e) {
	if (Hm(e)) return e.app ?? e.source;
}
function Jm(e) {
	return e.state === "unavailable" ? null : Vm(e) ? e.supportsTurnOn ? "turnOn" : null : (zm(e) ? e.supportsPause ? "pause" : e.supportsStop ? "stop" : null : e.supportsPlay ? "play" : null) ?? (e.supportsTurnOff ? "turnOff" : null);
}
var Ym = {
	play: "Play",
	pause: "Pause",
	stop: "Stop",
	turnOn: "Turn on",
	turnOff: "Turn off"
}, Xm = (e) => Ym[e];
function Zm(e) {
	return Hm(e) && e.muted ? Lm : Bm(e) ? void 0 : Rm(e);
}
var Qm = (e) => !!e.supportsVolumeStep && !(e.supportsVolume && e.volume != null), $m = {
	down: "Down",
	up: "Up"
}, eh = (e, t) => `${e}: volume ${t}`;
function th(e) {
	let t = Zm(e);
	return e.volume == null ? Hm(e) && e.muted ? Lm : void 0 : t ? `${t} · ${e.volume}%` : `${e.volume}%`;
}
var nh = {
	previous: "Previous",
	next: "Next"
}, rh = (e, t) => `${e}: ${t} track`;
function ih(e) {
	let t = Um(e);
	return t ? `Artwork for ${t}` : `${e.name} artwork`;
}
var ah = (e) => `Open ${e} in Home Assistant`;
function oh(e) {
	let t = [
		(e.supportsPrevious || e.supportsNext) && "skip",
		e.supportsSeek && "seek",
		e.supportsVolume ? "volume" : e.supportsVolumeStep && "volume steps",
		e.supportsMute && "mute",
		e.supportsSource && e.sources?.length && (e.sources.length === 1 ? "1 source" : `${e.sources.length} sources`)
	].filter((e) => !!e);
	if (!t.length) {
		let t = e.supportsPlay || e.supportsPause, n = e.supportsTurnOn || e.supportsTurnOff;
		return t ? "Play and pause" : n ? "On and off" : "View only";
	}
	let n = t.join(", ");
	return n.charAt(0).toUpperCase() + n.slice(1);
}
// src/skins/orb/cards/mediaPlayer/icons.tsx
function sh() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [/* @__PURE__ */ (0, L.jsx)("rect", {
			x: "3",
			y: "4",
			width: "14",
			height: "12",
			rx: "3"
		}), /* @__PURE__ */ (0, L.jsx)("path", { d: "M8.6 7.6v4.8l4-2.4Z" })]
	});
}
// src/skins/orb/cards/mediaPlayer/parts.tsx
var ch = {
	6: [
		0,
		1,
		2,
		3,
		4,
		5
	],
	10: [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9
	]
}, lh = (e) => e.running ? "running" : "paused";
function uh({ head: e, className: t = "mp-fill" }) {
	let n = {
		"--mp-len": `${e.duration}s`,
		"--mp-at": `${-e.at}s`,
		animationPlayState: lh(e),
		clipPath: `inset(0 ${((1 - gd(e)) * 100).toFixed(3)}% 0 0)`
	};
	return /* @__PURE__ */ (0, L.jsx)("span", {
		className: t,
		style: n
	}, e.key);
}
function dh({ head: e }) {
	return /* @__PURE__ */ (0, L.jsx)("span", {
		className: "mp-clock",
		children: yd(e.at, e.duration).map((t, n) => t.kind === "colon" ? /* @__PURE__ */ (0, L.jsx)("span", {
			className: "mp-colon",
			children: ":"
		}, n) : /* @__PURE__ */ (0, L.jsx)("span", {
			className: "mp-place",
			children: /* @__PURE__ */ (0, L.jsx)("span", {
				className: "mp-reel",
				"data-base": t.base,
				style: {
					"--mp-cycle": `${t.cycle}s`,
					"--mp-off": `${-t.offset}s`,
					"--mp-turns": t.turns,
					animationPlayState: lh(e),
					transform: `translateY(${-100 * t.digit / t.base}%)`
				},
				children: ch[t.base].map((e) => /* @__PURE__ */ (0, L.jsx)("span", { children: e }, e))
			})
		}, n))
	}, e.key);
}
function fh({ head: e }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "mp-prog",
		role: "img",
		"aria-label": `${bd(e.at)} of ${bd(e.duration)}`,
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: "mp-bar",
			children: /* @__PURE__ */ (0, L.jsx)(uh, { head: e })
		}), /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "mp-times",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, L.jsx)(dh, { head: e }), /* @__PURE__ */ (0, L.jsx)("span", { children: Ht(e.duration) })]
		})]
	});
}
function ph({ id: e, label: t, seek: n }) {
	let { head: r, held: i, slider: a } = n;
	return /* @__PURE__ */ (0, L.jsx)(Uf, {
		id: e,
		label: t,
		slider: {
			...a,
			inset: 0
		},
		className: "mp-seek",
		"data-held": i || void 0,
		children: () => /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(uh, {
			head: r,
			className: "mp-fill mp-seek-fill"
		}), /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "mp-seek-times",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "mp-seek-at",
				children: /* @__PURE__ */ (0, L.jsx)(dh, { head: r })
			}), /* @__PURE__ */ (0, L.jsx)("span", { children: Ht(r.duration) })]
		})] })
	});
}
// src/skins/orb/cards/mediaPlayer/MediaPlayerCard.tsx
var mh = [{
	value: "off",
	label: "Aus"
}, {
	value: "on",
	label: "Ein"
}];
function hh({ entity: e, history: t, variant: n, footprint: r, showControl: i, onPlay: a, onPause: o, onStop: s, onPrevious: c, onNext: l, onTurnOn: u, onTurnOff: d, onVolumeChange: f, onSeek: p, onVolumeUp: m, onVolumeDown: h, onMuteChange: g, onSourceChange: _, quiet: v, onOpenMore: y, onOpenDetails: b, onClose: x }) {
	let S = Sf("mp", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: C, sheet: w, featured: T, area: E } = S, D = e.state === "unavailable", O = Bm(e), k = Cf("state", 0), A = Rm(e), j = {
		play: a,
		pause: o,
		stop: s,
		turnOn: u,
		turnOff: d
	}, M = !a && !o && !s && !u && !d, N = Jm(e), P = N && j[N] ? N : null, F = P ? Xm(P) : void 0, ee = () => {
		P && j[P]?.();
	}, te = Gm(e), ne = !D && !Vm(e) && e.muted === !0, re = Zm(e), ie = T || w, ae = qm(e), I = D ? A : lf(e.lastChanged), oe = te ?? E ?? I, se = [E, ae].filter(Boolean).join(" · ") || (te ?? I ?? ""), ce = (e) => P && /* @__PURE__ */ (0, L.jsx)(Pf, {
		word: A,
		rest: e
	}), le = ie ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [ce(!!se), jf(se)] }) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		ce(!!oe || ne),
		jf(oe),
		ne && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "mp-muted",
			children: [oe ? " · " : "", "Muted"]
		})
	] }), ue = D ? `${e.name}: Unavailable` : F ? `${F} ${e.name}` : `${e.name}: ${A}`, de = P ? /* @__PURE__ */ (0, L.jsx)(Nf, {
		label: `${e.name}: ${A} · ${F}`,
		on: O,
		onToggle: ee,
		action: F,
		children: A
	}) : /* @__PURE__ */ (0, L.jsx)("p", {
		className: "hd-st mp-st",
		children: A
	}), fe = xd(e), R = v ? void 0 : fe, z = Um(e), B = Wm(e), pe = !D && !Vm(e), me = md(ie && pe ? e.picture : void 0), he = Dd(w && pe && e.supportsSeek ? R : void 0, p), ge = ie && pe && (z || B || R && !he || e.picture), V = {
		previous: pe && e.supportsPrevious && !!c,
		next: pe && e.supportsNext && !!l,
		either: Tt(e) && e.supportsTurnOn && e.supportsTurnOff && !!u && !!d,
		off: !D && !Vm(e) && !Tt(e) && e.supportsTurnOff && !!d && P !== "turnOff",
		volume: pe && e.supportsVolume && e.volume != null && !!f,
		steps: pe && Qm(e) && !!m && !!h,
		mute: pe && e.supportsMute && !!g,
		source: pe && e.supportsSource && (e.sources?.length ?? 0) > 0 && !!_,
		more: !D && !!y
	}, H = th(e);
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: S,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...k
		},
		orb: M ? void 0 : {
			label: ue,
			pressed: O,
			intensity: 0,
			onToggle: ee,
			children: /* @__PURE__ */ (0, L.jsx)(sh, {})
		},
		glyph: M ? /* @__PURE__ */ (0, L.jsx)(sh, {}) : void 0,
		unavailable: D,
		lastSeen: e.lastSeen,
		onOpen: b && (() => b()),
		status: le,
		statusTitle: typeof le == "string" ? le : oe,
		value: A,
		readout: D ? { value: null } : ne ? {
			value: Lm,
			duplicate: !0,
			word: !0,
			className: "hd-num--long"
		} : pe && e.volume != null ? { value: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [e.volume, /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) } : {
			value: A,
			duplicate: !0,
			word: !0,
			className: "hd-num--long"
		},
		onClose: x,
		control: de,
		facts: {
			start: D ? sf(e.lastSeen) : uf(e.lastChanged),
			end: D ? "" : oh(e)
		},
		children: [
			T && !D && !ge && /* @__PURE__ */ (0, L.jsx)(up, { children: Km(e) }),
			ge && /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "mp-now",
				"data-art": e.picture ? "" : void 0,
				children: [e.picture && /* @__PURE__ */ (0, L.jsx)(zf, {
					picture: me,
					label: ih(e),
					ratio: "1 / 1",
					children: /* @__PURE__ */ (0, L.jsx)(sh, {})
				}), /* @__PURE__ */ (0, L.jsxs)("div", {
					className: "mp-meta",
					children: [
						z && /* @__PURE__ */ (0, L.jsx)("p", {
							className: "mp-title",
							title: z,
							children: z
						}),
						B && /* @__PURE__ */ (0, L.jsx)("p", {
							className: "mp-artist",
							title: B,
							children: B
						}),
						w && e.album && /* @__PURE__ */ (0, L.jsx)("p", {
							className: "mp-album",
							title: e.album,
							children: e.album
						}),
						R && !he && /* @__PURE__ */ (0, L.jsx)(fh, { head: R })
					]
				})]
			}),
			(he || V.previous || V.next || V.off || V.either || V.volume || V.steps || V.mute || V.source || V.more) && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
				he && /* @__PURE__ */ (0, L.jsx)(ph, {
					id: `${C}-pos`,
					label: `${e.name} position`,
					seek: he
				}),
				(V.previous || V.next) && /* @__PURE__ */ (0, L.jsxs)("div", {
					className: "hd-acts",
					children: [V.previous && /* @__PURE__ */ (0, L.jsx)(Nf, {
						label: rh(e.name, "previous"),
						onToggle: c,
						children: nh.previous
					}), V.next && /* @__PURE__ */ (0, L.jsx)(Nf, {
						label: rh(e.name, "next"),
						onToggle: l,
						children: nh.next
					})]
				}),
				V.volume && /* @__PURE__ */ (0, L.jsx)(Gf, {
					id: `${C}-vol`,
					heading: "Volume",
					value: e.volume,
					min: 0,
					max: 100,
					on: !re,
					text: (e) => `${e}%`,
					offText: (e) => Pm(e, re),
					valueText: (e) => Fm(e, re?.toLowerCase()),
					onChange: f
				}),
				V.steps && /* @__PURE__ */ (0, L.jsxs)("div", {
					className: "hd-blk",
					role: "group",
					"aria-labelledby": `${C}-vs`,
					children: [/* @__PURE__ */ (0, L.jsxs)("p", {
						className: "hd-blk-h",
						id: `${C}-vs`,
						children: [/* @__PURE__ */ (0, L.jsx)("span", { children: "Volume" }), H && /* @__PURE__ */ (0, L.jsx)("span", {
							className: "hd-blk-v",
							children: H
						})]
					}), /* @__PURE__ */ (0, L.jsxs)("div", {
						className: "hd-acts",
						children: [/* @__PURE__ */ (0, L.jsx)(Nf, {
							label: eh(e.name, "down"),
							disabled: e.volume != null && e.volume <= 0,
							onToggle: h,
							children: $m.down
						}), /* @__PURE__ */ (0, L.jsx)(Nf, {
							label: eh(e.name, "up"),
							disabled: e.volume != null && e.volume >= 100,
							onToggle: m,
							children: $m.up
						})]
					})]
				}),
				V.mute && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${C}-m`,
					label: "Mute",
					options: [...mh],
					value: e.muted == null ? null : e.muted ? "on" : "off",
					onChange: (e) => g(e === "on")
				}),
				V.source && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${C}-s`,
					label: "Source",
					options: e.sources.map((e) => ({
						value: e,
						label: e
					})),
					value: e.source,
					onChange: _
				}),
				V.off && /* @__PURE__ */ (0, L.jsx)("div", {
					className: "hd-acts",
					children: /* @__PURE__ */ (0, L.jsx)(Nf, {
						label: `Turn ${e.name} off`,
						onToggle: d,
						children: Xm("turnOff")
					})
				}),
				V.either && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("p", {
					className: "hd-note",
					children: Et(e)
				}), /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${C}-w`,
					label: "Turn",
					options: [...Dt],
					value: null,
					onChange: (e) => (e === "on" ? u : d)?.()
				})] }),
				V.more && /* @__PURE__ */ (0, L.jsx)("div", {
					className: "hd-acts",
					children: /* @__PURE__ */ (0, L.jsx)(Nf, {
						label: ah(e.name),
						onToggle: y,
						children: "Open in Home Assistant"
					})
				})
			] }),
			w && t && /* @__PURE__ */ (0, L.jsx)(dp, {
				samples: t.samples,
				currentHour: t.currentHour,
				summary: Ut("playing", t.playingMinutes)
			})
		]
	});
}
// src/skins/orb/cards/mediaPlayer/MediaPlayerTile.tsx
var gh = ap(hh, ip(hh));
// src/skins/orb/ha/HaMediaPlayerTile.tsx
function _h({ entityId: e, name: t, area: n, lastSeen: r, history: i, loadHistory: a, onActionError: o, ...s }) {
	let c = jo(e, {
		name: t,
		area: n,
		lastSeen: r,
		history: i,
		loadHistory: a,
		onActionError: o
	}), l = Ya(e);
	return /* @__PURE__ */ (0, L.jsx)(gh, {
		...s,
		entity: c.entity,
		history: c.history,
		...c.actions,
		onOpenMore: l
	});
}
// packages/core/src/entities/numeric/severity.ts
function vh(e) {
	if (e.state === "unavailable" || e.value == null) return;
	let t = e.warnAbove != null && e.value > e.warnAbove ? "above" : e.warnBelow != null && e.value < e.warnBelow ? "below" : void 0;
	return t && {
		side: t,
		word: Vo(e.deviceClass, t),
		said: Uo(e, t)
	};
}
function yh(e) {
	return vh(e) ? "advisory" : void 0;
}
// src/skins/orb/cards/numeric/icons.tsx
function bh({ picture: e }) {
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: xh[e]
	});
}
var xh = {
	air: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M5.6 14.5h8.6a3.3 3.3 0 0 0 .4-6.6 4.6 4.6 0 0 0-8.8 1.2 2.7 2.7 0 0 0-.2 5.4Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M8.2 11.4h.01M11.6 10.2h.01M10.6 12.8h.01" })] }),
	power: /* @__PURE__ */ (0, L.jsx)("path", { d: "M11.2 2.8 4.8 11.3h4.6l-.8 5.9 6.4-8.5h-4.6l.8-5.9Z" }),
	meter: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("rect", {
			x: "3.5",
			y: "3.5",
			width: "13",
			height: "13",
			rx: "2.5"
		}),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M6.5 13h7" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 10.2l2.2-2.8" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M6.6 9.6a3.4 3.4 0 0 1 6.8 0" })
	] }),
	gauge: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 14a6.5 6.5 0 1 1 13 0" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 14l3.2-4.2" })] })
};
// src/skins/orb/cards/numeric/NumericCard.tsx
function Sh({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenDetails: a, onClose: o }) {
	let s = Sf("nm", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { sheet: c, area: l } = s, u = e.state === "unavailable", d = u ? void 0 : e.value, f = Ro(e.deviceClass), p = Cf("reading", 0), m = t ? nn(e, t) : void 0, h = d == null ? void 0 : Zt(d), g = u ? "Unavailable" : h == null ? "Waiting…" : $t(h, e.unit), _ = d == null ? "no reading yet" : $t(Yt(d), e.unit), v = vh(e), y = v ? `Warning: ${e.name}: ${v.said}` : null, b = u ? "Unavailable" : v ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
		label: y,
		children: v.word
	}), l && /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-sub-optional",
		children: ` · ${l}`
	})] }) : [l, h == null ? "No reading yet" : f.label].filter(Boolean).join(" · ") || void 0, x = m?.short && m.short.length <= 9 ? m.short : void 0, S = /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "hd-bar hd-bar--pair nm-bar",
		children: [h == null ? /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-none",
			children: "Waiting…"
		}) : /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric nm-f",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "nm-v hd-metric-n",
				children: h
			}), e.unit && /* @__PURE__ */ (0, L.jsx)("small", { children: e.unit })]
		}), h != null && x && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric hd-metric--sub nm-today",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-label",
				children: "Today"
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "nm-t",
				children: x
			})]
		})]
	}), C = m?.short ? `${_}, today ${m.long}` : _;
	return /* @__PURE__ */ (0, L.jsx)(cp, {
		card: s,
		name: e.name,
		attrs: {
			"data-state": u ? "unavailable" : "ok",
			...p
		},
		level: yh(e),
		glyph: /* @__PURE__ */ (0, L.jsx)(bh, { picture: f.picture }),
		unavailable: u,
		lastSeen: e.lastSeen,
		onOpen: a,
		status: b,
		value: v ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
			label: y,
			children: v.word
		}), ` · ${g}`] }) : g,
		bareValue: g,
		readout: {
			value: h == null ? null : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [h, e.unit && /* @__PURE__ */ (0, L.jsx)("span", { children: e.unit })] }),
			label: c && h != null ? _ : void 0
		},
		onClose: o,
		slot: !c || u || h == null,
		control: c || !a ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: C,
			children: S
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${C}`,
			onOpen: a,
			children: S
		}),
		facts: {
			start: u ? sf(e.lastSeen) : df(e.lastUpdated),
			end: [zo(e), Wo(e)].filter(Boolean).join(" · ")
		},
		children: m && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: m.samples,
			currentHour: t.currentHour,
			summary: m.long
		})
	});
}
// src/skins/orb/cards/numeric/NumericTile.tsx
var Ch = ap(Sh, ip(Sh));
// src/skins/orb/ha/HaNumericTile.tsx
function wh({ entityId: e, name: t, area: n, unit: r, lastSeen: i, warnAbove: a, warnBelow: o, history: s, loadHistory: c, ...l }) {
	let u = Ko(e, {
		name: t,
		area: n,
		unit: r,
		lastSeen: i,
		warnAbove: a,
		warnBelow: o,
		history: s,
		loadHistory: c
	});
	return /* @__PURE__ */ (0, L.jsx)(Ch, {
		...l,
		entity: u.entity,
		history: u.history
	});
}
// packages/core/src/entities/vacuum/words.ts
var Th = {
	cleaning: "Cleaning",
	docked: "Docked",
	returning: "Returning",
	paused: "Paused",
	idle: "Idle",
	error: "Error",
	unavailable: "Unavailable"
};
function Eh(e) {
	return e.state === "unavailable" ? Th.unavailable : e.stateText ? e.stateText : e.state === "other" ? "Unknown" : Th[e.state];
}
var Dh = Vt, Oh = (e) => e.state === "cleaning" || e.state === "returning", kh = Oh;
function Ah(e) {
	return e.state === "unavailable" ? null : Oh(e) ? e.supportsPause ? "pause" : e.state === "cleaning" && e.supportsReturn ? "return" : null : e.supportsStart ? "start" : null;
}
function jh(e, t) {
	return e === "pause" ? "Pause" : e === "return" ? Mh.long : t.state === "paused" ? "Resume" : t.state === "error" ? "Start again" : "Start";
}
var Mh = {
	long: "Return to dock",
	short: "Return"
}, Nh = (e) => `Send ${e} back to its dock`, Ph = "Locate", Fh = (e) => `${Ph} ${e}: it plays a sound`;
function Ih(e, t) {
	return e === "return" ? Nh(t.name) : e === "start" && t.state === "error" ? `Start ${t.name} again` : `${jh(e, t)} ${t.name}`;
}
var Lh = (e) => e.state !== "unavailable" && e.state !== "docked" && !Oh(e) && !e.charging && jp(e.battery);
function Rh(e) {
	if (e.state === "error") return "Error";
	if (Lh(e)) return Mp(e.battery);
}
function zh(e) {
	let t = Rh(e);
	return t && e.state === "error" && e.error ? `${t} · ${e.error}` : t;
}
function Bh(e) {
	if (e.state === "error") return `Stopped with an error${e.error ? `: ${e.error.charAt(0).toLowerCase()}${e.error.slice(1)}` : ""}`;
	if (Lh(e)) return `${Mp(e.battery)}, ${Vh}`;
}
var Vh = "needs charging";
function Hh(e) {
	return e.battery == null || e.state === "unavailable" ? "" : Lh(e) ? `${Mp(e.battery)}, ${Vh}` : `${Mp(e.battery)}${e.charging ? ", charging" : ""}`;
}
function Uh(e) {
	if (e.status && e.state !== "unavailable") return e.status.trim().toLowerCase() === Eh(e).toLowerCase() ? void 0 : e.status.trim();
}
// packages/core/src/entities/vacuum/severity.ts
function Wh(e) {
	if (e.state !== "unavailable") {
		if (e.state === "error") return "urgent";
		if (Lh(e)) return "advisory";
	}
}
// src/skins/orb/cards/vacuum/icons.tsx
function Gh() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "10",
				cy: "10",
				r: "7"
			}),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M4.1 6.3h11.8" }),
			/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "10",
				cy: "11.2",
				r: "1.8"
			})
		]
	});
}
// src/skins/orb/cards/vacuum/VacuumCard.tsx
function Kh({ entity: e, history: t, variant: n, footprint: r, showControl: i, onStart: a, onPause: o, onReturnToBase: s, onLocate: c, onFanSpeedChange: l, onOpenDetails: u, onClose: d }) {
	let f = Sf("vc", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: p, compact: m, featured: h, area: g } = f, _ = e.state === "unavailable", v = kh(e), y = Cf("state", 0), b = Eh(e), x = {
		start: a,
		pause: o,
		return: s
	}, S = !a && !o && !s, C = Ah(e), w = C && x[C] ? C : null, T = w ? jh(w, e) : void 0, E = () => {
		w && x[w]?.();
	}, D = Wh(e), O = D ? Rh(e) : void 0, k = O ? `Warning: ${e.name}: ${Bh(e)}` : null, A = Uh(e), j = w && e.state !== "error", M = g ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [g, A && /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "vc-detail",
		children: [" · ", A]
	})] }) : _ ? "Unavailable" : jf(A ?? lf(e.lastChanged)), N = k ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
		label: k,
		children: m ? O : zh(e)
	}), j && /* @__PURE__ */ (0, L.jsx)(Pf, {
		word: b,
		behind: !0
	})] }) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [j && /* @__PURE__ */ (0, L.jsx)(Pf, {
		word: b,
		rest: !!M
	}), M] }), P = _ ? `${e.name}: Unavailable` : w ? Ih(w, e) : `${e.name}: ${b}`, F = w ? /* @__PURE__ */ (0, L.jsx)(Nf, {
		label: `${e.name}: ${b} · ${T}`,
		on: v,
		onToggle: E,
		action: j ? T : void 0,
		children: e.state === "error" ? T : b
	}) : /* @__PURE__ */ (0, L.jsx)("p", {
		className: "hd-st vc-st",
		children: b
	}), ee = !_ && e.supportsReturn && !!s && w !== "return" && e.state !== "docked" && e.state !== "returning", te = !_ && e.supportsLocate && !!c, ne = !_ && e.supportsFanSpeed && e.fanSpeeds && l ? e.fanSpeeds : null, re = Hh(e);
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: f,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...y
		},
		level: D,
		orb: S ? void 0 : {
			label: P,
			pressed: v,
			intensity: 0,
			onToggle: E,
			children: /* @__PURE__ */ (0, L.jsx)(Gh, {})
		},
		glyph: S ? /* @__PURE__ */ (0, L.jsx)(Gh, {}) : void 0,
		unavailable: _,
		lastSeen: e.lastSeen,
		onOpen: u && (() => u()),
		status: N,
		value: O ?? b,
		alert: k,
		bareValue: b,
		readout: {
			value: _ ? null : b,
			duplicate: !0,
			word: !0,
			className: "hd-num--long"
		},
		onClose: d,
		control: F,
		facts: {
			start: _ ? sf(e.lastSeen) : uf(e.lastChanged),
			end: re && D === "advisory" ? /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-warn",
				children: re
			}) : re
		},
		children: [
			(ee || te || ne) && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [(ee || te) && /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hd-acts",
				children: [ee && /* @__PURE__ */ (0, L.jsx)(Nf, {
					label: Nh(e.name),
					onToggle: s,
					children: Mh.long
				}), te && /* @__PURE__ */ (0, L.jsx)(Nf, {
					label: Fh(e.name),
					onToggle: c,
					children: "Locate"
				})]
			}), ne && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${p}-f`,
				label: "Fan speed",
				options: ne.map((e) => ({
					value: e,
					label: Dh(e)
				})),
				value: e.fanSpeed,
				onChange: l
			})] }),
			h && !_ && !t && /* @__PURE__ */ (0, L.jsx)(up, { children: "No cleaning history" }),
			t && /* @__PURE__ */ (0, L.jsx)(dp, {
				samples: t.samples,
				currentHour: t.currentHour,
				summary: Ut("cleaning", t.cleaningMinutes)
			})
		]
	});
}
// src/skins/orb/cards/vacuum/VacuumTile.tsx
var qh = ap(Kh, ip(Kh));
// src/skins/orb/ha/HaVacuumTile.tsx
function Jh({ entityId: e, name: t, area: n, lastSeen: r, history: i, loadHistory: a, onActionError: o, ...s }) {
	let c = Jo(e, {
		name: t,
		area: n,
		lastSeen: r,
		history: i,
		loadHistory: a,
		onActionError: o
	});
	return /* @__PURE__ */ (0, L.jsx)(qh, {
		...s,
		entity: c.entity,
		history: c.history,
		...c.actions
	});
}
// src/skins/orb/cards/calendar/icons.tsx
function Yh({ now: e = !1 }) {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("rect", {
				x: "3.5",
				y: "4.5",
				width: "13",
				height: "12",
				rx: "2"
			}),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 8.5h13M7 3v3M13 3v3" }),
			/* @__PURE__ */ (0, L.jsx)("rect", {
				x: "6.5",
				y: "11",
				width: "3",
				height: "2.6",
				rx: "0.6",
				fill: e ? "currentColor" : "none"
			})
		]
	});
}
// src/skins/orb/cards/calendar/CalendarCard.tsx
var Xh = 5;
function Zh({ event: e, now: t, when: n }) {
	let r = is(e, t), i = ps(e);
	return /* @__PURE__ */ (0, L.jsxs)("li", {
		className: "ca-ev",
		"data-when": r ? "now" : os(e, t) ? "over" : "ahead",
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: "ca-ev-t",
			children: n
		}), /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "ca-ev-n",
			children: [/* @__PURE__ */ (0, L.jsxs)("span", {
				className: "ca-ev-title",
				children: [r && !e.allDay && /* @__PURE__ */ (0, L.jsxs)("span", {
					className: "ca-ev-now",
					children: [Yo.now, " "]
				}), e.title]
			}), i && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "ca-ev-d",
				children: i
			})]
		})]
	});
}
function Qh({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenDetails: a, onClose: o }) {
	let s = Sf("ca", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { sheet: c, compact: l, area: u } = s, d = e.state === "unavailable", f = Cf("reading", 0), p = Ts(e.events, e.now), m = d ? void 0 : p.next, h = !d && e.events === void 0, g = ms(e.days), _ = G(), v = m?.title ?? (h ? Yo.waiting : Yo.free), y = m ? ls(m, e.now, _) : h ? void 0 : g, b = d ? "Unavailable" : m ? us(m, e.now, _) : h ? Yo.waiting : g.line, x = m ? `${m.title}, ${y.line}` : h ? Yo.noReading : g.line, S = h ? void 0 : hs(p.left.length, p.today.length), C = d ? "Unavailable" : h ? [u, Yo.noReading].filter(Boolean).join(" · ") : l ? m ? m.title : S ?? u : c ? [u, S].filter(Boolean).join(" · ") || void 0 : S ?? u, w = as(m, e.now), T = d ? "unavailable" : m ? w ? "on" : "ok" : "off", E = /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-bar hd-bar--pair ca-bar",
		children: h ? /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-none",
			children: Yo.waiting
		}) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-metric ca-f",
				children: v
			}),
			y && /* @__PURE__ */ (0, L.jsxs)("span", {
				className: "hd-metric hd-metric--sub ca-when",
				children: [/* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-label",
					children: y.label
				}), /* @__PURE__ */ (0, L.jsx)("span", {
					className: "ca-t",
					children: y.value
				})]
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "ca-cue",
				children: b
			})
		] })
	});
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: s,
		name: e.name,
		attrs: {
			"data-state": T,
			...f
		},
		glyph: /* @__PURE__ */ (0, L.jsx)(Yh, { now: w }),
		unavailable: d,
		lastSeen: e.lastSeen,
		onOpen: a,
		status: C,
		value: m ? `${m.title} · ${b}` : b,
		bareValue: b,
		onClose: o,
		control: c || !a ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: x,
			children: E
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${x}`,
			onOpen: a,
			children: E
		}),
		facts: {
			start: d ? sf(e.lastSeen) : df(e.lastUpdated),
			end: gs(e.days, e.calendars)
		},
		children: [/* @__PURE__ */ (0, L.jsxs)(lp, { children: [!d && p.today.length > 0 && /* @__PURE__ */ (0, L.jsxs)("section", {
			className: "hd-blk",
			"aria-labelledby": `${s.nameId}-today`,
			children: [/* @__PURE__ */ (0, L.jsx)("h3", {
				className: "hd-blk-h",
				id: `${s.nameId}-today`,
				children: Yo.eventsToday
			}), /* @__PURE__ */ (0, L.jsx)("ol", {
				className: "ca-list",
				children: p.today.map((t, n) => /* @__PURE__ */ (0, L.jsx)(Zh, {
					event: t,
					now: e.now,
					when: ds(t, e.now, _)
				}, n))
			})]
		}), !d && p.later.length > 0 && /* @__PURE__ */ (0, L.jsxs)("section", {
			className: "hd-blk",
			"aria-labelledby": `${s.nameId}-later`,
			children: [/* @__PURE__ */ (0, L.jsx)("h3", {
				className: "hd-blk-h",
				id: `${s.nameId}-later`,
				children: Yo.comingUp
			}), /* @__PURE__ */ (0, L.jsx)("ol", {
				className: "ca-list",
				children: p.later.slice(0, Xh).map((t, n) => /* @__PURE__ */ (0, L.jsx)(Zh, {
					event: t,
					now: e.now,
					when: fs(t, e.now, _)
				}, n))
			})]
		})] }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			forecastFrom: t.currentHour + 1,
			summary: Ut(Yo.busy, t.busyMinutes)
		})]
	});
}
// src/skins/orb/cards/calendar/CalendarTile.tsx
var $h = ap(Qh, ip(Qh));
// src/skins/orb/ha/HaCalendarTile.tsx
function eg({ entityId: e, calendarEntityIds: t, days: n, name: r, area: i, lastSeen: a, events: o, loadEvents: s, onEventsError: c, loadHistory: l, ...u }) {
	let d = Os(e, {
		calendarEntityIds: t,
		days: n,
		name: r,
		area: i,
		lastSeen: a,
		events: o,
		loadEvents: s,
		onEventsError: c,
		loadHistory: l
	});
	return /* @__PURE__ */ (0, L.jsx)($h, {
		...u,
		entity: d.entity,
		history: d.history
	});
}
// packages/core/src/entities/sun/drawing.ts
var tg = .08;
function ng(e) {
	let t = e.path.length - 1, n = Math.max(e.peak, Ns + 10), r = Math.min(...e.path, Ns - 10), i = (e) => tg + (n - e) / (n - r) * (1 - 2 * tg), a = (n) => {
		let r = Math.min(t - 1, Math.floor(n * t)), i = n * t - r;
		return e.path[r] + (e.path[r + 1] - e.path[r]) * i;
	}, o = [
		e.riseAt,
		e.setAt,
		e.nowAt
	].filter((e) => e !== void 0), s = [.../* @__PURE__ */ new Set([...e.path.map((e, n) => n / t), ...o])].sort((e, t) => e - t), c = (t, n) => {
		let r = (t + n) / 2;
		return a(r) < -.833 ? "night" : r < e.nowAt ? "past" : "ahead";
	}, l = [];
	for (let e = 1; e < s.length; e++) {
		let t = c(s[e - 1], s[e]), n = [s[e], i(a(s[e]))], r = l[l.length - 1];
		r?.part === t ? r.points.push(n) : l.push({
			part: t,
			points: [[s[e - 1], i(a(s[e - 1]))], n]
		});
	}
	let u = a(e.nowAt);
	return {
		pieces: l,
		horizon: i(Ns),
		sun: [e.nowAt, i(u)],
		up: u >= Ns
	};
}
// packages/core/src/entities/sun/words.ts
var rg = {
	sunrise: "Sunrise",
	sunset: "Sunset",
	dawn: "Dawn",
	dusk: "Dusk",
	noon: "Noon",
	waiting: "Waiting…",
	noReading: "No reading yet",
	daylight: "daylight",
	noDaylight: "No daylight today",
	upAllDay: "Up all day",
	downAllDay: "Down all day",
	next: "Next",
	elevation: "Elevation",
	azimuth: "Azimuth",
	pathSaid: "The sun's path today"
}, ig = (e) => e.state === "ok" && e.up === !0;
function ag(e) {
	if (e.state !== "ok" || e.up === void 0) return;
	let t = e.up ? e.nextSetting : e.nextRising;
	return t === void 0 ? void 0 : {
		kind: e.up ? "setting" : "rising",
		at: t
	};
}
function og(e) {
	if (!(e.state !== "ok" || e.up === void 0 || ag(e))) return e.up ? rg.upAllDay : rg.downAllDay;
}
function sg(e) {
	if (e.state !== "ok" || e.up === void 0) return;
	let t = e.up ? e.nextRising : e.nextSetting;
	return t === void 0 ? void 0 : {
		kind: e.up ? "rising" : "setting",
		at: t
	};
}
var cg = {
	dawn: rg.dawn,
	rising: rg.sunrise,
	noon: rg.noon,
	setting: rg.sunset,
	dusk: rg.dusk
}, lg = {
	dawn: "Dawn",
	rising: "Rises",
	noon: "Noon",
	setting: "Sets",
	dusk: "Dusk"
}, ug = (e) => cg[e], dg = (e, t) => Math.max(1, Math.ceil((e - t) / 6e4)), fg = (e, t = H()) => es(e.at, t);
function pg(e, t) {
	let n = dg(e.at, t);
	return n < 1440 ? `${lg[e.kind]} in ${W(n)}` : `${lg[e.kind]} ${ns(e.at, t)}`;
}
var mg = (e, t, n = H()) => `${cg[e.kind]} at ${fg(e, n)}, ${pg(e, t).toLowerCase()}`;
function hg(e) {
	return e.state === "ok" ? [
		["dawn", e.nextDawn],
		["rising", e.nextRising],
		["noon", e.nextNoon],
		["setting", e.nextSetting],
		["dusk", e.nextDusk]
	].filter((e) => e[1] !== void 0).map(([e, t]) => ({
		kind: e,
		at: t
	})).sort((e, t) => e.at - t.at) : [];
}
function gg(e, t, n = H()) {
	let r = ns(e.at, t), i = es(e.at, n);
	return r === "Today" ? i : `${r} ${i}`;
}
var _g = (e) => `${Math.round(e) === 0 ? 0 : Math.round(e)}°`;
function vg(e) {
	return [e.elevation === void 0 ? void 0 : `${rg.elevation} ${_g(e.elevation)}`, e.azimuth === void 0 ? void 0 : `${rg.azimuth} ${_g(e.azimuth)}`].filter(Boolean).join(" · ") || void 0;
}
function yg(e) {
	return e.daylightMinutes > 0 ? `Daylight ${W(e.daylightMinutes)}` : rg.noDaylight;
}
// src/skins/orb/cards/sun/icons.tsx
function bg({ rising: e = !1, up: t = !1 }) {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", {
				d: "M6.2 14a3.8 3.8 0 0 1 7.6 0",
				fill: t ? "currentColor" : "none"
			}),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M2.5 14h1.7M15.8 14h1.7M4.7 9.6l1.1 1.1M15.3 9.6l-1.1 1.1M3 17h14" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: e ? "M10 7.5V2.8M8.2 4.6 10 2.8l1.8 1.8" : "M10 2.8v4.7M8.2 5.7 10 7.5l1.8-1.8" })
		]
	});
}
// src/skins/orb/cards/sun/SunCard.tsx
var xg = (e) => `${(e * 100).toFixed(2)}%`;
function Sg({ at: e, hourCycle: t }) {
	let { time: n, period: r } = ts(e, t);
	return /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [n, r && /* @__PURE__ */ (0, L.jsx)("small", { children: `\u00a0${r}` })] });
}
function Cg({ day: e, unavailable: t, lastSeen: n }) {
	let r = ng(e), i = G(), a = (e) => e.map(([e, t], n) => `${n ? "L" : "M"}${(e * 240).toFixed(1)} ${(t * 100).toFixed(1)}`).join(""), o = [e.riseAt !== void 0 && e.rise !== void 0 ? {
		at: e.riseAt,
		time: es(e.rise, i),
		word: rg.sunrise
	} : void 0, e.setAt !== void 0 && e.set !== void 0 ? {
		at: e.setAt,
		time: es(e.set, i),
		word: rg.sunset
	} : void 0].filter((e) => e !== void 0), s = [
		rg.pathSaid,
		...o.map((e) => `${e.word.toLowerCase()} ${e.time}`),
		`highest ${_g(e.peak)}`,
		t ? void 0 : r.up ? "up now" : "down now"
	].filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-blk su-path",
		children: [/* @__PURE__ */ (0, L.jsxs)("p", {
			className: "hd-blk-h",
			children: [/* @__PURE__ */ (0, L.jsx)("span", { children: "Today" }), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-blk-v",
				children: t ? cf(n) : yg(e)
			})]
		}), /* @__PURE__ */ (0, L.jsxs)("div", {
			className: "su-plot",
			role: "img",
			"aria-label": s,
			"data-unavailable": t || void 0,
			children: [
				/* @__PURE__ */ (0, L.jsxs)("svg", {
					viewBox: "0 0 240 100",
					preserveAspectRatio: "none",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, L.jsx)("path", {
						className: "su-hz",
						d: `M0 ${(r.horizon * 100).toFixed(1)}H240`
					}), r.pieces.map((e, n) => /* @__PURE__ */ (0, L.jsx)("path", {
						className: "su-line",
						"data-part": t ? "night" : e.part,
						d: a(e.points)
					}, n))]
				}),
				o.map((e) => /* @__PURE__ */ (0, L.jsx)("span", {
					className: "su-mark",
					style: {
						"--x": xg(e.at),
						"--y": xg(r.horizon)
					},
					children: /* @__PURE__ */ (0, L.jsx)("span", {
						className: "su-mark-t",
						children: e.time
					})
				}, e.word)),
				!t && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", {
					className: "su-now",
					style: { "--x": xg(r.sun[0]) }
				}), /* @__PURE__ */ (0, L.jsx)("span", {
					className: "su-sun",
					"data-up": r.up || void 0,
					style: {
						"--x": xg(r.sun[0]),
						"--y": xg(r.sun[1])
					}
				})] })
			]
		})]
	});
}
function wg({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenDetails: a, onClose: o }) {
	let s = Sf("su", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { sheet: c, compact: l, area: u } = s, d = e.state === "unavailable", f = Cf("reading", 0), p = ag(e), m = sg(e), h = og(e), g = !d && !p && !h, _ = ig(e), v = G(), y = d ? "Unavailable" : p ? fg(p, v) : h ?? rg.waiting, b = p ? pg(p, e.now) : void 0, x = p ? mg(p, e.now, v) : h ?? rg.noReading, S = d ? "Unavailable" : g ? [u, rg.noReading].filter(Boolean).join(" · ") : c ? [u, b].filter(Boolean).join(" · ") || void 0 : b ?? u, C = d ? "unavailable" : _ ? "on" : "ok", w = /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-bar hd-bar--pair su-bar",
		children: g ? /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-none",
			children: rg.waiting
		}) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: `hd-metric ${p ? "hd-metric-n" : "hd-metric-w"} su-f`,
			children: p ? /* @__PURE__ */ (0, L.jsx)(Sg, {
				at: p.at,
				hourCycle: v
			}) : y
		}), p && m && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric hd-metric--sub su-after",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-label",
				children: ug(m.kind)
			}), /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-metric-t",
				children: /* @__PURE__ */ (0, L.jsx)(Sg, {
					at: m.at,
					hourCycle: v
				})
			})]
		})] })
	}), T = hg(e);
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: s,
		name: e.name,
		attrs: {
			"data-state": C,
			...f
		},
		glyph: /* @__PURE__ */ (0, L.jsx)(bg, {
			rising: p ? p.kind === "rising" : e.up === !1,
			up: _
		}),
		unavailable: d,
		lastSeen: e.lastSeen,
		onOpen: a,
		status: S,
		value: b ? `${b} · ${y}` : y,
		bareValue: y,
		onClose: o,
		control: c || !a ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: x,
			children: w
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${x}`,
			onOpen: a,
			children: w
		}),
		facts: {
			start: d ? sf(e.lastSeen) : df(e.lastUpdated),
			end: d ? void 0 : vg(e)
		},
		children: [t && !l && /* @__PURE__ */ (0, L.jsx)(Cg, {
			day: t,
			unavailable: d,
			lastSeen: e.lastSeen
		}), /* @__PURE__ */ (0, L.jsx)(lp, { children: T.length > 0 && /* @__PURE__ */ (0, L.jsxs)("section", {
			className: "hd-blk",
			"aria-labelledby": `${s.nameId}-next`,
			children: [/* @__PURE__ */ (0, L.jsx)("h3", {
				className: "hd-blk-h",
				id: `${s.nameId}-next`,
				children: rg.next
			}), /* @__PURE__ */ (0, L.jsx)("ol", {
				className: "su-list",
				children: T.map((t) => /* @__PURE__ */ (0, L.jsxs)("li", {
					className: "su-ev",
					"data-lead": t.kind === p?.kind || void 0,
					children: [/* @__PURE__ */ (0, L.jsx)("span", {
						className: "su-ev-n",
						children: ug(t.kind)
					}), /* @__PURE__ */ (0, L.jsx)("span", {
						className: "su-ev-t",
						children: gg(t, e.now, v)
					})]
				}, t.kind))
			})]
		}) })]
	});
}
// src/skins/orb/cards/sun/SunTile.tsx
var Tg = ap(wg, ip(wg));
// src/skins/orb/ha/HaSunTile.tsx
function Eg({ entityId: e, name: t, area: n, lastSeen: r, latitude: i, longitude: a, loadHistory: o, ...s }) {
	let c = Bs(e, {
		name: t,
		area: n,
		lastSeen: r,
		latitude: i,
		longitude: a,
		loadHistory: o
	});
	return /* @__PURE__ */ (0, L.jsx)(Tg, {
		...s,
		entity: c.entity,
		history: c.history
	});
}
// src/skins/orb/cards/dyson/icons.tsx
function Dg() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 2.5c2.8 0 4.5 2.1 4.5 4.8S12.8 12 10 12 5.5 9.9 5.5 7.3 7.2 2.5 10 2.5z" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 5c1.3 0 2 1 2 2.3S11.3 9.5 10 9.5 8 8.6 8 7.3 8.7 5 10 5z" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M7.5 12.5v4.2c0 .4.3.8.8.8h3.4c.5 0 .8-.4.8-.8v-4.2" })
		]
	});
}
function Og({ turned: e, back: t }) {
	let n = (e, t) => {
		let n = e * Math.PI / 180;
		return `${+(t * Math.sin(n)).toFixed(2)} ${+(-t * Math.cos(n)).toFixed(2)}`;
	};
	return /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("path", {
			className: "dy-cable",
			d: `M${n(t, 16)}Q${n(t - 6, 60)} ${n(t, 100)}`
		}),
		/* @__PURE__ */ (0, L.jsx)("circle", {
			className: "dy-base",
			r: "16"
		}),
		/* @__PURE__ */ (0, L.jsx)("g", {
			className: "hd-dial-turn",
			style: { transform: `rotate(${e}deg)` },
			children: /* @__PURE__ */ (0, L.jsx)("rect", {
				className: "dy-head",
				x: "-15",
				y: "-22",
				width: "30",
				height: "10",
				rx: "5"
			})
		})
	] });
}
// src/skins/orb/cards/dyson/DysonCard.tsx
var kg = 8, Ag = [{
	value: "off",
	label: "Aus"
}, {
	value: "on",
	label: "Ein"
}], jg = [{
	value: "auto",
	label: "Auto"
}, {
	value: "manual",
	label: "Manual"
}], Mg = ["forward", "reverse"].map((e) => ({
	value: e,
	label: Vs[e]
})), Ng = (e, t = "on", n = "off") => e == null ? null : e ? t : n, Pg = (e, t) => `${Bt(e)}${t === "°F" ? "°F" : "°"}`;
function Fg({ entity: e, history: t, variant: n, footprint: r, showControl: i, onToggle: a, onPercentageChange: o, onAutoChange: s, onOscillateChange: c, onOscillationModeChange: l, onAimChange: u, onSpreadChange: d, onDirectionChange: f, onNightModeChange: p, onHeatChange: m, onHeatTargetChange: h, onOpenDetails: g, onClose: _ }) {
	let v = Sf("dy", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: y, area: b } = v, x = e.state === "unavailable", S = e.state === "on", C = x || Yp(e), w = mc(e), T = S && e.heating ? Cf("energy", w ? 0 : .9) : Cf("state", 0), E = e.speedCount ?? 0, D = !!(e.supportsSpeed && E >= 2 && o), O = S && !!e.auto, k = S && !O && e.supportsSpeed && e.percentage != null && E >= 2 ? ca(e.percentage, E) : null, A = O ? "Auto" : Zp(e, k), j = S ? lf(e.lastChanged) : "Turn on", M = sc(e), N = pc(e), P = N ? `Warning: ${e.name}: ${N.said}` : null, F = Qs(e) ?? uc(M), ee = x ? b : N ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
		label: P,
		children: N.word
	}), b && /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-sub-optional",
		children: ` · ${b}`
	})] }) : b ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [b, F && /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "dy-mode",
		children: [" · ", F]
	})] }) : F, te = (e.oscillationBy === "angle" || e.oscillationBy === "number") && d && u && e.oscillationLow != null && e.oscillationHigh != null ? {
		low: e.oscillationLow,
		high: e.oscillationHigh
	} : void 0, ne = !te && e.oscillationModes?.length && l ? e.oscillationModes : void 0, re = [{
		value: "off",
		label: "Off"
	}, ...te ? Ws.map((e) => ({
		value: Gs(e),
		label: Gs(e)
	})) : ne ? ne.map((e) => ({
		value: e,
		label: e
	})) : [{
		value: "on",
		label: "On"
	}]], ie = te && te.low === te.high, ae = e.angles ?? Us, I = te ? te.high - te.low : 0, oe = te && e.oscillating ? ie ? "Still" : e.oscillationMode ?? null : Zs({
		...e,
		oscillationModes: ne
	}), se = (e) => {
		if (e === "off") return c?.(!1);
		if (e === "on") return c?.(!0);
		if (te) return d(Ws.find((t) => Gs(t) === e) ?? 0);
		l?.(e);
	}, ce = [
		...e.air.map((e) => ({
			key: e.pollutant,
			label: nc[e.pollutant].label,
			long: nc[e.pollutant].long,
			value: e.value == null ? ff : lc(e),
			band: e.value == null ? void 0 : ac[oc(e.pollutant, e.value)]
		})),
		...e.temperature == null ? [] : [{
			key: "temperature",
			label: "Temperature",
			long: "Temperature",
			value: Pg(e.temperature, e.temperatureUnit),
			band: void 0
		}],
		...e.humidity == null ? [] : [{
			key: "humidity",
			label: "Humidity",
			long: "Humidity",
			value: `${Math.round(e.humidity)}%`,
			band: void 0
		}]
	], le = N?.kind === "filter";
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: v,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...T
		},
		level: w,
		orb: C ? {
			label: e.name,
			pressed: S,
			intensity: .7,
			onToggle: a,
			children: /* @__PURE__ */ (0, L.jsx)(Dg, {})
		} : void 0,
		glyph: C ? void 0 : /* @__PURE__ */ (0, L.jsx)(Dg, {}),
		unavailable: x,
		lastSeen: e.lastSeen,
		onOpen: g,
		status: ee,
		statusTitle: b,
		value: N ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
			label: P,
			children: N.word
		}), ` · ${A}`] }) : A,
		bareValue: A,
		readout: {
			value: x ? null : k?.endsWith("%") ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [k.slice(0, -1), /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) : A,
			duplicate: !0,
			word: !k?.endsWith("%")
		},
		onClose: _,
		control: D ? /* @__PURE__ */ (0, L.jsx)(Gf, {
			id: `${y}-speed`,
			label: `${e.name} speed`,
			value: aa(S && e.percentage != null ? e.percentage : oa(1, E), E),
			min: 1,
			max: E,
			on: S && !O && e.percentage != null,
			wakes: !0,
			text: (e) => ca(oa(e, E), E),
			offText: () => O ? "Auto" : "Off",
			valueText: (e) => O ? "Auto, choosing its own speed" : tm(e, E, S),
			onChange: (e) => o(oa(e, E))
		}) : C ? /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: `${e.name}: ${A}${j ? ` · ${j}` : ""}`,
			on: S,
			onToggle: a,
			extra: j,
			children: A
		}) : /* @__PURE__ */ (0, L.jsx)("p", {
			className: "hd-st",
			children: A
		}),
		facts: {
			start: x ? sf(e.lastSeen) : uf(e.lastChanged),
			end: $s(e)
		},
		children: [
			!x && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
				e.supportsAuto && s && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${y}-m`,
					label: "Mode",
					options: [...jg],
					value: Ng(e.auto, "auto", "manual"),
					onChange: (e) => s(e === "auto")
				}),
				e.supportsOscillate && c && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${y}-o`,
					label: "Oscillation",
					options: re,
					value: oe,
					onChange: se
				}),
				te && e.oscillating && /* @__PURE__ */ (0, L.jsx)(Jf, {
					id: `${y}-aim`,
					label: `${e.name} aims`,
					heading: "Points",
					says: (e) => Js(e, ae.ahead),
					valueText: (e) => `Points ${Js(e, ae.ahead)}${I ? `, sweeping ${I}°` : ""}`,
					value: Math.round((te.low + te.high) / 2),
					min: ae.min,
					max: ae.max,
					top: ae.ahead,
					topLabel: "Ahead",
					lit: (e) => {
						if (!I) return [e - kg, e + kg];
						let { angle_low: t, angle_high: n } = Ks(e, I, ae);
						return [t, n];
					},
					onChange: u,
					children: (e) => /* @__PURE__ */ (0, L.jsx)(Og, {
						turned: e,
						back: (ae.max + ae.min + 360) / 2 - ae.ahead
					})
				}),
				e.supportsDirection && f && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${y}-d`,
					label: "Airflow",
					options: Mg,
					value: e.direction,
					onChange: f
				}),
				e.supportsNightMode && p && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${y}-night`,
					label: "Night mode",
					options: [...Ag],
					value: Ng(e.nightMode),
					onChange: (e) => p(e === "on")
				}),
				e.supportsHeat && m && /* @__PURE__ */ (0, L.jsx)(Qf, {
					id: `${y}-heat`,
					label: "Heat",
					options: [...Ag],
					value: Ng(e.heatOn),
					onChange: (e) => m(e === "on")
				}),
				e.supportsHeat && e.heatOn && e.heatTarget != null && h && /* @__PURE__ */ (0, L.jsx)(Vf, {
					label: `${e.name} heat target`,
					kicker: "Heat to",
					value: e.heatTarget,
					unit: e.heatUnit === "°F" ? "°F" : "°",
					format: (e.heatStep ?? 1) % 1 == 0 ? String : Bt,
					min: e.heatMin ?? 1,
					max: e.heatMax ?? 37,
					step: e.heatStep ?? 1,
					onChange: h
				})
			] }),
			!x && ce.length > 0 && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hd-blk",
				children: [/* @__PURE__ */ (0, L.jsxs)("p", {
					className: "hd-blk-h",
					children: [/* @__PURE__ */ (0, L.jsx)("span", { children: "Air quality" }), M && /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-blk-v",
						children: ac[M.band]
					})]
				}), /* @__PURE__ */ (0, L.jsx)("dl", {
					className: "dy-list",
					children: ce.map((e) => /* @__PURE__ */ (0, L.jsxs)("div", {
						className: "dy-row",
						"data-band": e.band && e.band !== "Good" && e.band !== "Fair" ? "warn" : void 0,
						children: [/* @__PURE__ */ (0, L.jsx)("dt", { children: /* @__PURE__ */ (0, L.jsx)("abbr", {
							title: e.long,
							children: e.label
						}) }), /* @__PURE__ */ (0, L.jsxs)("dd", { children: [e.value, e.band && /* @__PURE__ */ (0, L.jsx)("span", {
							className: "dy-band",
							children: e.band
						})] })]
					}, e.key))
				})]
			}) }),
			!x && e.filters.length > 0 && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hd-blk",
				children: [/* @__PURE__ */ (0, L.jsxs)("p", {
					className: "hd-blk-h",
					children: [/* @__PURE__ */ (0, L.jsx)("span", { children: "Filters" }), le && /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-blk-v",
						children: "Change soon"
					})]
				}), /* @__PURE__ */ (0, L.jsx)("dl", {
					className: "dy-list",
					children: e.filters.map((e) => /* @__PURE__ */ (0, L.jsxs)("div", {
						className: "dy-row",
						"data-band": e.percent != null && e.percent <= 10 ? "warn" : void 0,
						children: [/* @__PURE__ */ (0, L.jsx)("dt", { children: dc[e.kind] }), /* @__PURE__ */ (0, L.jsx)("dd", { children: e.percent == null ? "No reading yet" : `${Math.round(e.percent)}%` })]
					}, e.kind))
				})]
			}) }),
			t && /* @__PURE__ */ (0, L.jsx)(dp, {
				samples: t.samples,
				currentHour: t.currentHour,
				summary: Ut("on", t.onMinutes)
			})
		]
	});
}
// src/skins/orb/cards/dyson/DysonTile.tsx
var Ig = ap(Fg, ip(Fg));
// src/skins/orb/ha/HaDysonTile.tsx
function Lg({ entityId: e, companions: t, name: n, area: r, lastSeen: i, history: a, loadHistory: o, onActionError: s, ...c }) {
	let l = Cc(e, {
		companions: t,
		name: n,
		area: r,
		lastSeen: i,
		history: a,
		loadHistory: o,
		onActionError: s
	});
	return /* @__PURE__ */ (0, L.jsx)(Ig, {
		...c,
		entity: l.entity,
		history: l.history,
		...l.actions
	});
}
// packages/core/src/entities/light/kelvin.ts
var Rg = 2200, zg = 6500;
function Bg(e) {
	if (e <= 4800) {
		let t = (e - 2200) / 2600;
		return {
			c: +(.16 * (1 - t) ** .85 + .02 * t).toFixed(3),
			h: +Math.min(105, 80 + 45 * t).toFixed(1)
		};
	}
	return {
		c: +(.02 + (e - 4800) / 1700 * .06).toFixed(3),
		h: 245
	};
}
function Vg(e) {
	return e <= 2500 ? "Candlelight" : e <= 3200 ? "Warm white" : e <= 4200 ? "Neutral white" : e <= 5500 ? "Daylight" : "Cool daylight";
}
// packages/core/src/entities/light/color.ts
var Hg = [
	{
		name: "Red",
		hs: [0, 100]
	},
	{
		name: "Amber",
		hs: [31, 94.5]
	},
	{
		name: "Yellow",
		hs: [52, 100]
	},
	{
		name: "Green",
		hs: [120, 100]
	},
	{
		name: "Blue",
		hs: [220, 100]
	},
	{
		name: "Purple",
		hs: [285, 85]
	},
	{
		name: "White",
		hs: [0, 0]
	}
], Ug = [
	15,
	42,
	75,
	165,
	260,
	345
], Wg = 20;
function Gg([e, t]) {
	if (t < Wg) return Hg[Hg.length - 1];
	let n = (e % 360 + 360) % 360;
	return n >= Ug[Ug.length - 1] ? Hg[0] : Hg[Ug.findIndex((e) => n < e)];
}
// src/skins/orb/cards/light/color.ts
var Kg = {
	Red: {
		c: .2,
		h: 29
	},
	Amber: {
		c: .17,
		h: 62
	},
	Yellow: {
		c: .17,
		h: 98
	},
	Green: {
		c: .2,
		h: 145
	},
	Blue: {
		c: .16,
		h: 255
	},
	Purple: {
		c: .17,
		h: 310
	},
	White: {
		c: .012,
		h: 90
	}
}, qg = (e) => ({
	...e,
	swatch: Kg[e.name]
}), Jg = Hg.map(qg), Yg = (e) => qg(Gg(e)), Xg = ({ c: e, h: t }) => `oklch(var(--accent-strong-l) ${e} ${t})`, Zg = (e) => e.state === "unavailable" ? "Unavailable" : e.state === "unknown" ? "Unknown" : e.state === "on" ? "Ein" : "Aus", Qg = [
	{
		value: 5,
		label: "Night",
		sub: "5%"
	},
	{
		value: 25,
		label: "Dim",
		sub: "25%"
	},
	{
		value: 50,
		label: "Half",
		sub: "50%"
	},
	{
		value: 100,
		label: "Full",
		sub: "100%"
	}
], $g = (e) => e.supportsBrightness ? `Dimmable${e.supportsColorTemp ? ", warmth" : ""}${e.supportsColor ? ", colour" : ""}` : "On / off";
// src/skins/orb/cards/light/kelvin.ts
function e_(e) {
	let { c: t, h: n } = Bg(e);
	return `oklch(var(--accent-l) ${t} ${n})`;
}
function t_(e = Rg, t = zg) {
	return Array.from({ length: 11 }, (n, r) => `${e_(e + (t - e) * r / 10)} ${(r / 10 * 100).toFixed(1)}%`).join(", ");
}
// src/skins/orb/cards/light/parts.tsx
var n_ = () => /* @__PURE__ */ (0, L.jsxs)("svg", {
	viewBox: "0 0 20 20",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.2a4.8 4.8 0 0 0-2.9 8.6c.5.4.8 1 .8 1.6v.5h4.2v-.5c0-.6.3-1.2.8-1.6A4.8 4.8 0 0 0 10 3.2Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M8.3 16.5h3.4" })]
}), r_ = () => /* @__PURE__ */ (0, L.jsxs)("svg", {
	viewBox: "0 0 20 20",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.2a4.8 4.8 0 0 0-2.9 8.6c.5.4.8 1 .8 1.6v.5h4.2v-.5c0-.6.3-1.2.8-1.6A4.8 4.8 0 0 0 10 3.2Z" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M8.3 16.5h3.4" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 3.5l13 13" })
	]
});
function i_({ id: e, label: t, value: n, on: r, known: i = !0, offText: a = "Off", onChange: o }) {
	return /* @__PURE__ */ (0, L.jsx)(Gf, {
		id: e,
		label: t,
		value: n,
		min: 1,
		max: 100,
		on: r,
		wakes: !0,
		text: (e) => `${e}%`,
		offText: () => a,
		valueText: (e) => r ? `${e} percent` : i ? `${a}. Last set to ${e} percent` : a,
		onChange: o
	});
}
function a_({ id: e, kelvin: t, min: n = Rg, max: r = zg, disabled: i, onChange: a }) {
	let o = Math.max(1, Math.round(Math.max(100, r - n) / 100));
	return /* @__PURE__ */ (0, L.jsx)(Uf, {
		id: e,
		slider: {
			value: t,
			min: n,
			max: r,
			step: 100,
			inset: 12,
			disabled: i,
			snap: (e) => Math.round(e / 100) * 100,
			onChange: a,
			valueText: (e) => `${e} kelvin, ${Vg(e)}`
		},
		heading: (t) => /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("label", {
			htmlFor: e,
			children: "Warmth"
		}), /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-blk-v",
			children: Vg(t)
		})] }),
		className: "lw-ruler",
		groove: !1,
		focus: "thumb",
		disabled: i,
		style: { "--warm-grad": t_(n, Math.max(r, n + 100)) },
		children: (e) => /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
			/* @__PURE__ */ (0, L.jsx)("div", {
				className: "lw-ruler-ticks",
				style: { background: `repeating-linear-gradient(90deg, var(--tick) 0 1.5px, transparent 1.5px calc(100% / ${o}))` }
			}),
			/* @__PURE__ */ (0, L.jsx)("div", { className: "lw-ruler-line" }),
			/* @__PURE__ */ (0, L.jsxs)("div", {
				className: "lw-ruler-rail",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, L.jsx)("div", {
					className: "lw-ruler-at lw-ruler-at--mark",
					children: /* @__PURE__ */ (0, L.jsx)("div", { className: "lw-ruler-mark" })
				}), /* @__PURE__ */ (0, L.jsx)("div", {
					className: "lw-ruler-at lw-ruler-at--tip",
					children: /* @__PURE__ */ (0, L.jsxs)("div", {
						className: "lw-ruler-tip",
						children: [e, " K"]
					})
				})]
			})
		] })
	});
}
function o_({ id: e, value: t, onChange: n }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-blk",
		children: [/* @__PURE__ */ (0, L.jsxs)("p", {
			className: "hd-blk-h",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				id: e,
				children: "Colour"
			}), t && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-blk-v",
				children: t.name
			})]
		}), /* @__PURE__ */ (0, L.jsx)("div", {
			className: "hd-chips",
			role: "group",
			"aria-labelledby": e,
			style: { "--n": Jg.length },
			children: Jg.map((e) => /* @__PURE__ */ (0, L.jsxs)(Zf, {
				className: "lw-chip",
				selected: t?.name === e.name,
				onPick: () => n(e),
				children: [/* @__PURE__ */ (0, L.jsx)("span", {
					className: "lw-sw",
					"aria-hidden": "true",
					style: { "--sw": Xg(e.swatch) }
				}), /* @__PURE__ */ (0, L.jsx)("span", { children: e.name })]
			}, e.name))
		})]
	});
}
// src/skins/orb/cards/light/LightCard.tsx
function s_({ entity: e, history: t, variant: n, footprint: r, showControl: i, onToggle: a, onTurnOn: o, onTurnOff: s, onBrightnessChange: c, onKelvinChange: l, onColorChange: u, onOpenDetails: d, onClose: f }) {
	let p = Sf("lw", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: m, sheet: h, area: g } = p, _ = e.state === "unavailable", v = e.state === "on", y = e.supportsBrightness && e.brightness != null, b = e.supportsBrightness && !_ && (y || !v), x = e.brightness == null ? 100 : Math.min(100, Math.max(1, Math.round(e.brightness))), S = v ? y ? x / 100 : .85 : 0, C = y ? x / 100 : .85, w = Cf("energy", S), T = Zg(e), E = _ ? null : v && y ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [x, /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) : T, D = v && y ? `${x}%` : T, O = v && e.supportsColor && e.hs ? Yg(e.hs) : null, k = v && e.supportsColorTemp && e.kelvin != null ? Vg(e.kelvin) : O?.name ?? null, A = !!(e.supportsColor && u), j = _ ? e.lastSeen : e.lastChanged, M = k ?? lf(j) ?? null, N = D;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: p,
		name: e.name,
		attrs: {
			"data-natura-kind": "light",
			"data-state": e.state,
			...w
		},
		orb: {
			label: e.name,
			pressed: v,
			intensity: C,
			onToggle: a,
			children: _ ? /* @__PURE__ */ (0, L.jsx)(r_, {}) : /* @__PURE__ */ (0, L.jsx)(n_, {})
		},
		unavailable: _,
		lastSeen: e.lastSeen,
		onOpen: d,
		status: g ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [g, k && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "lw-k",
			children: [" · ", k]
		})] }) : !h && M,
		statusTitle: g,
		value: N,
		readout: {
			value: E,
			duplicate: !0,
			word: !(v && y)
		},
		onClose: f,
		control: b ? /* @__PURE__ */ (0, L.jsx)(i_, {
			id: `${m}-dim`,
			label: `${e.name} brightness`,
			value: x,
			on: v,
			known: y,
			offText: T,
			onChange: c
		}) : /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: `${e.name}: ${T}`,
			on: v,
			onToggle: a,
			children: T
		}),
		facts: {
			start: _ ? sf(e.lastSeen) : uf(e.lastChanged),
			end: $g(e)
		},
		children: [!_ && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
			Tt(e) && o && s && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-note",
				children: Et(e)
			}), /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-w`,
				label: "Turn",
				options: [...Dt],
				value: null,
				onChange: (e) => (e === "on" ? o : s)()
			})] }),
			b && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-lv`,
				label: "Quick levels",
				options: Qg,
				value: v ? x : null,
				onChange: c
			}),
			e.supportsColorTemp && e.kelvin != null && l && /* @__PURE__ */ (0, L.jsx)(a_, {
				id: `${m}-k`,
				kelvin: e.kelvin,
				min: e.minKelvin ?? 2200,
				max: e.maxKelvin ?? 6500,
				disabled: !v,
				onChange: l
			}),
			A && /* @__PURE__ */ (0, L.jsx)(o_, {
				id: `${m}-c`,
				value: O,
				onChange: (e) => u?.(e.hs)
			})
		] }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut("on", t.onMinutes)
		})]
	});
}
// src/skins/orb/cards/light/LightTile.tsx
var c_ = ap(s_, ip(s_));
// src/skins/orb/ha/HaLightTile.tsx
function l_({ entityId: e, name: t, area: n, lastSeen: r, history: i, loadHistory: a, onActionError: o, ...s }) {
	let c = xr(e, {
		name: t,
		area: n,
		lastSeen: r,
		history: i,
		loadHistory: a,
		onActionError: o
	});
	return /* @__PURE__ */ (0, L.jsx)(c_, {
		...s,
		entity: c.entity,
		history: c.history,
		...c.actions
	});
}
// packages/core/src/entities/climate/modes.ts
var u_ = {
	off: { label: "Aus" },
	heat: { label: "Heizen" },
	cool: { label: "Cool" },
	heat_cool: { label: "Heat/Cool" },
	auto: { label: "Auto" },
	dry: { label: "Dry" },
	fan_only: { label: "Fan only" }
}, d_ = {
	heating: "Heizen",
	cooling: "Cooling",
	idle: "Idle",
	off: "Aus",
	drying: "Drying",
	fan: "Fan"
}, f_ = (e) => Number.isInteger(e) ? String(e) : Bt(e), p_ = (e) => Bt(e), m_ = (e) => e.charAt(0).toUpperCase() + e.slice(1).replace(/_/g, " "), h_ = (e, t) => [Math.min(e, t), Math.max(e, t)], g_ = {
	heat: "Heat to",
	cool: "Cool to",
	auto: "Keep at",
	heat_cool: "Keep"
}, __ = (e) => e.reportsCurrentTemperature === !1 ? pf : ff, v_ = (e) => `${f_(e.minTemp)}–${f_(e.maxTemp)}${e.unit}`, y_ = (e) => [e.currentHumidity == null ? null : `Humidity ${Math.round(e.currentHumidity)}%`, v_(e)].filter(Boolean).join(" · "), b_ = (e) => u_[e].label.replace("/", "/​"), x_ = {
	fill: "none",
	stroke: "currentColor"
};
function S_() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...x_,
		children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M8 11.6V4.5a2 2 0 1 1 4 0v7.1a3.5 3.5 0 1 1-4 0Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 9v5" })]
	});
}
function C_({ mode: e, unavailable: t }) {
	if (t) return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...x_,
		children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3v6M6.2 5.6a6 6 0 1 0 7.6 0" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 3.5l13 13" })]
	});
	switch (e) {
		case "heat": return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...x_,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 17.5c-3 0-5-2.1-5-4.8 0-2.6 1.8-4 3-5.6.6 1.4 1.5 2.1 2.3 2.4C10.4 7 10 4.8 11.4 2.5c1.6 2 3.6 4.6 3.6 7.6v2.6c0 2.7-2 4.8-5 4.8Z" })
		});
		case "cool": return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...x_,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 2.5v15M3.5 6.25l13 7.5M16.5 6.25l-13 7.5M8 3.9l2 1.5 2-1.5M8 16.1l2-1.5 2 1.5" })
		});
		case "heat_cool":
		case "auto": return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...x_,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M7 14V5.5m0 0L4.6 7.9M7 5.5l2.4 2.4M13 6v8.5m0 0l-2.4-2.4m2.4 2.4l2.4-2.4" })
		});
		case "dry": return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...x_,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.2s5 5.3 5 8.6a5 5 0 0 1-10 0c0-3.3 5-8.6 5-8.6Z" })
		});
		case "fan_only": return /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...x_,
			children: [/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "10",
				cy: "10",
				r: "1.6"
			}), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 8.4c-.6-3.2.4-5.4 2.4-5.4s1.8 3.4-2.4 5.4ZM11.5 10.9c3 1.2 4.4 3.3 3.4 5s-3.8.1-3.4-5ZM8.5 10.9c-2.5 2-4.9 2.3-5.9.6s1.9-3.1 5.9-.6Z" })]
		});
		default: return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...x_,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3v6M6.2 5.6a6 6 0 1 0 7.6 0" })
		});
	}
}
// src/skins/orb/cards/climate/RangeBar.tsx
function w_({ id: e, name: t, low: n, high: r, current: i, modeCue: a, min: o, max: s, step: c, onChange: l, onOpen: u }) {
	let d = Yd({
		low: n,
		high: r,
		min: o,
		max: s,
		step: c,
		inset: (e) => e.querySelector(".cw-rb-k").getBoundingClientRect().width / 2,
		valueText: (e, t) => `${t === "low" ? "Heat below" : "Cool above"} ${f_(e)} degrees`,
		onChange: l
	}), { low: f, high: p, fraction: m } = d, h = {
		"--lo": m(f).toFixed(4),
		"--hi": m(p).toFixed(4),
		...i == null ? {} : { "--cur": m(i).toFixed(4) }
	};
	return /* @__PURE__ */ (0, L.jsxs)(Hf, {
		slider: d,
		inputs: [{
			id: `${e}-lo`,
			className: "cw-rb-in--lo",
			"aria-label": `${t}, heat below`,
			...d.lowInputProps
		}, {
			id: `${e}-hi`,
			className: "cw-rb-in--hi",
			"aria-label": `${t}, cool above`,
			...d.highInputProps
		}],
		className: "cw-rb",
		focus: "thumb",
		style: h,
		children: [
			/* @__PURE__ */ (0, L.jsx)("div", { className: "cw-rb-zone cw-rb-zone--heat" }),
			/* @__PURE__ */ (0, L.jsx)("div", { className: "cw-rb-zone cw-rb-zone--cool" }),
			i != null && /* @__PURE__ */ (0, L.jsx)("i", {
				className: "cw-rb-cur",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "cw-rb-lab",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, L.jsxs)("span", { children: [
					a && /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-cue",
						children: a
					}),
					f === p ? f_(f) : `${f_(f)}–${f_(p)}`,
					"°"
				] })
			}),
			/* @__PURE__ */ (0, L.jsxs)("div", {
				className: "cw-rb-rail",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, L.jsx)("div", {
					className: "cw-rb-at cw-rb-at--lo",
					children: /* @__PURE__ */ (0, L.jsxs)("i", {
						className: "cw-rb-k cw-rb-k--lo",
						children: [f_(f), "°"]
					})
				}), /* @__PURE__ */ (0, L.jsx)("div", {
					className: "cw-rb-at cw-rb-at--hi",
					children: /* @__PURE__ */ (0, L.jsxs)("i", {
						className: "cw-rb-k cw-rb-k--hi",
						children: [f_(p), "°"]
					})
				})]
			}),
			u && /* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "cw-rb-open",
				onClick: u,
				"aria-label": `${t}: heat below ${f_(f)}°, cool above ${f_(p)}°. Open details`
			})
		]
	});
}
function T_({ low: e, high: t, min: n, max: r, step: i, onChange: a }) {
	let o = (e) => +e.toFixed(2), s = (e, t, n, r, i, a) => /* @__PURE__ */ (0, L.jsxs)("div", {
		className: `cw-fine-g cw-fine-g--${e}`,
		role: "group",
		"aria-label": t,
		children: [
			/* @__PURE__ */ (0, L.jsxs)("span", {
				className: "cw-fine-l",
				children: [/* @__PURE__ */ (0, L.jsx)("span", { children: t }), /* @__PURE__ */ (0, L.jsxs)("b", { children: [f_(n), "°"] })]
			}),
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-btn cw-fine-b",
				"aria-label": `${t} ${f_(r)}°`,
				disabled: r === n,
				onClick: () => a(r),
				children: /* @__PURE__ */ (0, L.jsx)(Bf, {})
			}),
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-btn cw-fine-b",
				"aria-label": `${t} ${f_(i)}°`,
				disabled: i === n,
				onClick: () => a(i),
				children: /* @__PURE__ */ (0, L.jsx)($, {})
			})
		]
	});
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "cw-fine",
		children: [s("heat", "Heat below", e, o(Math.max(n, e - i)), o(Math.min(t, e + i)), (e) => a(e, t)), s("cool", "Cool above", t, o(Math.max(e, t - i)), o(Math.min(r, t + i)), (t) => a(e, t))]
	});
}
// Custom thermostat slider: Rotapfel light-slider appearance, bounded 7-26 C.
function NaturaClimateSlider({ entity: e, onCommit: t }) {
  const min = Math.max(7, Number.isFinite(e.minTemp) ? e.minTemp : 7);
  const max = Math.min(26, Number.isFinite(e.maxTemp) ? e.maxTemp : 26);
  const step = Number.isFinite(e.step) && e.step > 0 ? e.step : .5;
  const clamp = v => Math.max(min, Math.min(max, v));
  const [value, setValue] = (0, I.useState)(clamp(e.targetTemperature));
  (0, I.useEffect)(() => { setValue(clamp(e.targetTemperature)); }, [e.targetTemperature, min, max]);
  const pct = max > min ? (value - min) / (max - min) * 100 : 0;
  const commit = v => { if (max > min) t?.(clamp(Number(v))); };
  return /* @__PURE__ */ (0, L.jsxs)("div", {
    style: { width: "100%", position: "relative", height: "38px", borderRadius: "999px", overflow: "hidden", background: "#e9e8e5", boxShadow: "inset 0 1px 3px #00000018" },
    children: [
      /* @__PURE__ */ (0, L.jsx)("div", { style: { position: "absolute", inset: 0, width: `${pct}%`, background: "#EBC49A", borderRadius: "999px", pointerEvents: "none" } }),
      /* @__PURE__ */ (0, L.jsxs)("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px", fontSize: "16px", fontWeight: 700, color: "#191919", pointerEvents: "none" }, children: ["Soll: ", value.toFixed(step < 1 ? 1 : 0), " °C"] }),
      /* @__PURE__ */ (0, L.jsx)("input", {
        type: "range", min, max, step, value,
        "aria-label": `${e.name} Solltemperatur von ${min} bis ${max} Grad`,
        disabled: max <= min,
        onChange: ev => setValue(Number(ev.currentTarget.value)),
        onPointerUp: ev => commit(ev.currentTarget.value),
        onKeyUp: ev => { if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(ev.key)) commit(ev.currentTarget.value); },
        style: { position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "pointer", touchAction: "pan-x" }
      })
    ]
  });
}
// src/skins/orb/cards/climate/ClimateCard.tsx
function E_({ entity: e, history: t, variant: n, footprint: r, showControl: i, onToggle: a, onTargetChange: o, onRangeChange: s, onModeChange: c, onPresetChange: l, onFanChange: u, onOpenDetails: d, onClose: f }) {
	let p = Sf("cw", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: m, sheet: h, compact: g, bare: _, area: v } = p, y = e.state === "unavailable", b = y ? "off" : e.state, x = !y && b !== "off", S = e.hvacAction ?? (x ? "idle" : "off"), C = x && S !== "idle" && S !== "off", w = Ft(e), T = Cf(C ? "energy" : "state", C ? .9 : 0), E = e.currentTemperature, D = b === "heat_cool" && e.targetLow != null && e.targetHigh != null, O = !D && e.targetTemperature != null && (b === "heat" || b === "cool" || b === "auto"), k = E == null ? __(e) : void 0, A = E == null ? k === "Not reported" ? null : k : g ? `${p_(E)}°` : mf(`${p_(E)}°`), j = y ? v ?? "Unavailable" : [A, d_[S]].filter(Boolean).join(" · "), M = g && x ? `${b_(b)} · ` : "", N = y ? "Unavailable" : x ? D ? `${M}${e.targetLow === e.targetHigh ? `${f_(e.targetLow)}°` : `${f_(e.targetLow)}–${f_(e.targetHigh)}°`}` : O ? `${M}${f_(e.targetTemperature)}°` : b_(b) : "Off", P = g_[b] ?? g_.auto, F = (e, t) => {
		let [n, r] = h_(e, t);
		s?.(n, r);
	}, ee;
	ee = x ? D ? /* @__PURE__ */ (0, L.jsx)(w_, {
		id: `${m}-r`,
		name: e.name,
		low: e.targetLow,
		high: e.targetHigh,
		current: E,
		modeCue: g ? /* @__PURE__ */ (0, L.jsx)(C_, { mode: "heat_cool" }) : void 0,
		min: e.minTemp,
		max: e.maxTemp,
		step: e.step,
		onChange: F,
		onOpen: h ? void 0 : d
	}) : O ? /* @__PURE__ */ (0, L.jsx)(NaturaClimateSlider, { entity: e, onCommit: o }) : w ? /* @__PURE__ */ (0, L.jsx)(Nf, {
		label: `${e.name}: ${b_(b)}${e.fanMode ? `, Fan ${m_(e.fanMode).toLowerCase()}` : ""}`,
		on: !0,
		onToggle: a,
		extra: e.fanMode ? `Fan ${m_(e.fanMode).toLowerCase()}` : void 0,
		children: b_(b)
	}) : /* @__PURE__ */ (0, L.jsx)("p", {
		className: "hd-st",
		children: b_(b)
	}) : /* @__PURE__ */ (0, L.jsx)(Nf, {
		label: `${e.name}: Off, turn on`,
		on: !1,
		onToggle: a,
		turnOn: !0,
		children: "Turn on"
	});
	let te = g ? /* @__PURE__ */ (0, L.jsx)(S_, {}) : /* @__PURE__ */ (0, L.jsx)(C_, {
		mode: x ? b : Mt(e) ?? "heat",
		unavailable: y
	}), ne = _ ? "bare" : y ? "unavailable" : x ? D ? "range" : O ? "setpoint" : "mode" : "off", re = N;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: p,
		name: e.name,
		attrs: {
            "data-natura-kind": "climate",
			"data-state": y ? "unavailable" : x ? C ? "active" : "idle" : "off",
			"data-action": S,
			...T
		},
		orb: w || y ? {
			label: `${e.name}, ${x ? b_(b) : "off"}`,
			pressed: x,
			intensity: C ? 1 : .4,
			onToggle: a,
			children: te
		} : void 0,
		glyph: w || y ? void 0 : te,
		unavailable: y,
		lastSeen: e.lastSeen,
		onOpen: d,
		status: h && v && !y ? `${v} · ${d_[S]}` : d_[S],
		climateTempHeader: E != null && !y ? `${p_(E)} °C` : null,
		value: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [E != null && !y && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-sub-optional",
			children: [p_(E), "° · "]
		}), N] }),
		bareValue: re,
		readout: void 0,
		onClose: f,
		control: ee,
		slotKind: ne,
		facts: {
			start: y ? sf(e.lastSeen) : uf(e.lastChanged),
			end: y ? "" : y_(e)
		},
		children: [!y && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
			D && s && /* @__PURE__ */ (0, L.jsx)(T_, {
				low: e.targetLow,
				high: e.targetHigh,
				min: e.minTemp,
				max: e.maxTemp,
				step: e.step,
				onChange: F
			}),
			c && e.hvacModes.length > 1 && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-m`,
				label: "Mode",
				options: e.hvacModes.map((e) => ({
					value: e,
					label: b_(e)
				})),
				value: b,
				onChange: c
			}),
			l && e.presetModes && e.presetModes.length > 0 && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-p`,
				label: "Preset",
				options: e.presetModes.map((e) => ({
					value: e,
					label: m_(e)
				})),
				value: e.presetMode,
				onChange: l
			}),
			u && e.fanModes && e.fanModes.length > 0 && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-f`,
				label: "Fan",
				options: e.fanModes.map((e) => ({
					value: e,
					label: m_(e)
				})),
				value: e.fanMode,
				onChange: u
			})
		] }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut(t.activity, t.activeMinutes)
		})]
	});
}
// src/skins/orb/cards/climate/ClimateTile.tsx
var D_ = ap(E_, ip(E_));
// src/skins/orb/ha/HaClimateTile.tsx
function O_({ entityId: e, name: t, area: n, lastSeen: r, unit: i, history: a, loadHistory: o, onActionError: s, ...c }) {
	let l = Cr(e, {
		name: t,
		area: n,
		lastSeen: r,
		unit: i,
		history: a,
		loadHistory: o,
		onActionError: s
	});
	return /* @__PURE__ */ (0, L.jsx)(D_, {
		...c,
		entity: l.entity,
		history: l.history,
		...l.actions
	});
}
// packages/core/src/entities/sensor/severity.ts
function k_(e) {
	if (e.state !== "unavailable") return jp(e.battery) ? "advisory" : void 0;
}
// packages/core/src/entities/sensor/readings.ts
var A_ = (e, t) => t === "°F" ? (e - 32) * 5 / 9 : e;
function j_(e, t, n) {
	if (n || e == null && t == null) return "";
	let r = [];
	return e != null && (e < 18 ? r.push("Cool") : e > 25 && r.push("Warm")), t != null && (t < 30 ? r.push("Dry") : t > 60 && r.push("Humid")), r.length ? [r[0], ...r.slice(1).map((e) => e.toLowerCase())].join(", ") : "Comfortable";
}
var M_ = {
	rising: "Rising",
	falling: "Falling",
	steady: "Steady"
};
function N_(e, t, n = .3) {
	if (!e) return null;
	let r = e[t], i = e[t - 1];
	if (typeof r != "number" || typeof i != "number") return null;
	let a = r - i;
	return a > n ? "rising" : a < -n ? "falling" : "steady";
}
var P_ = (e) => zt(e, .5), F_ = (e) => Bt(e), I_ = (e) => String(Math.round(e)), L_ = {
	fill: "none",
	stroke: "currentColor"
}, R_ = () => /* @__PURE__ */ (0, L.jsxs)("svg", {
	viewBox: "0 0 20 20",
	"aria-hidden": "true",
	...L_,
	children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M8 11.6V4.5a2 2 0 1 1 4 0v7.1a3.5 3.5 0 1 1-4 0Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 9v5" })]
}), z_ = () => /* @__PURE__ */ (0, L.jsxs)("svg", {
	viewBox: "0 0 20 20",
	"aria-hidden": "true",
	...L_,
	children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M8 11.6V4.5a2 2 0 1 1 4 0v7.1a3.5 3.5 0 1 1-4 0Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 3.5l13 13" })]
});
// src/skins/orb/cards/sensor/SensorCard.tsx
function B_({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenDetails: a, onClose: o }) {
	let s = Sf("sw", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { sheet: c, compact: l, area: u } = s, d = e.state === "unavailable", f = d ? void 0 : e.temperature, p = d ? void 0 : e.humidity, m = !d && f == null && p == null, h = f == null ? void 0 : A_(f, e.unit), g = Cf("reading", 0), _ = t ? N_(t.temperature, t.currentHour) : null, v = k_(e), y = v === "advisory", b = y ? Mp(e.battery) : null, x = y ? `Warning: ${e.name}: ${Pp(e.battery)}` : null, S = j_(h, p, e.outdoor), C = [f == null ? null : `${F_(f)}°`, p == null ? null : `${I_(p)}%`].filter(Boolean).join(" · "), w = c && f != null, T = m ? "no reading yet" : [f == null ? null : `${F_(f)} degrees`, p == null ? null : `humidity ${I_(p)} percent`].filter(Boolean).join(", "), E = d ? ["Unavailable"] : m ? [b, "No reading yet"].filter(Boolean) : [
		b,
		c && u && !e.outdoor ? u : null,
		y ? null : e.outdoor ? u ?? "Outside" : S
	].filter(Boolean), D = _ && !l && !y ? M_[_] : null, O = /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [E.map((e, t) => /* @__PURE__ */ (0, L.jsxs)(I.Fragment, { children: [t > 0 && " · ", t === 0 && x ? /* @__PURE__ */ (0, L.jsx)(Af, {
		label: x,
		children: e
	}) : e] }, t)), D && /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "sw-trend",
		children: [E.length > 0 && " · ", D]
	})] }), k = /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "hd-bar hd-bar--pair sw-bar",
		children: [
			f != null && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-metric sw-t",
				children: /* @__PURE__ */ (0, L.jsxs)("span", {
					className: "sw-value hd-metric-n",
					children: [F_(f), /* @__PURE__ */ (0, L.jsx)("small", { children: "°" })]
				})
			}),
			p != null && /* @__PURE__ */ (0, L.jsxs)("span", {
				className: "hd-metric hd-metric--sub sw-h",
				children: [/* @__PURE__ */ (0, L.jsxs)("span", {
					className: "hd-label",
					children: [/* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-label-long",
						children: "Humidity"
					}), /* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-label-short",
						children: "RH"
					})]
				}), /* @__PURE__ */ (0, L.jsxs)("span", {
					className: "sw-value hd-metric-v",
					children: [I_(p), /* @__PURE__ */ (0, L.jsx)("small", { children: "%" })]
				})]
			}),
			m && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-none",
				children: "Waiting…"
			})
		]
	}), A = t ? P_(t.temperature) : null, j = t?.humidity ? P_(t.humidity) : null, M = d ? "Unavailable" : b ?? (m ? "Waiting…" : C);
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: s,
		name: e.name,
		attrs: {
			"data-state": d ? "unavailable" : "ok",
			...g
		},
		level: v,
		glyph: d ? /* @__PURE__ */ (0, L.jsx)(z_, {}) : /* @__PURE__ */ (0, L.jsx)(R_, {}),
		unavailable: d,
		lastSeen: e.lastSeen,
		onOpen: a,
		status: O,
		value: M,
		alert: x,
		readout: {
			value: f == null ? null : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [F_(f), /* @__PURE__ */ (0, L.jsx)("span", { children: "°" })] }),
			label: w ? `${F_(f)} degrees` : void 0
		},
		onClose: o,
		slot: !(w && p == null),
		control: c || !a ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: w ? `humidity ${I_(p)} percent` : T,
			children: k
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${T}`,
			onOpen: a,
			children: k
		}),
		facts: {
			start: d ? sf(e.lastSeen) : df(e.lastUpdated),
			end: e.battery == null ? "" : y ? /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-warn",
				children: Pp(e.battery)
			}) : Mp(e.battery)
		},
		children: [A && /* @__PURE__ */ (0, L.jsx)(dp, {
			title: c ? "Temperature today" : "Today",
			samples: A.samples,
			currentHour: t.currentHour,
			summary: Gt(A.min, A.max, (e) => `${F_(e)}°`)
		}), j && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsx)(Xf, {
			title: "Humidity today",
			samples: j.samples,
			currentHour: t.currentHour,
			summary: Gt(j.min, j.max, (e) => `${I_(e)}%`)
		}) })]
	});
}
// src/skins/orb/cards/sensor/SensorTile.tsx
var V_ = ap(B_, ip(B_));
// src/skins/orb/ha/HaSensorTile.tsx
function H_({ entityId: e, humidityEntityId: t, batteryEntityId: n, name: r, area: i, outdoor: a, lastSeen: o, unit: s, history: c, loadHistory: l, ...u }) {
	let d = Dr(e, {
		humidityEntityId: t,
		batteryEntityId: n,
		name: r,
		area: i,
		outdoor: a,
		lastSeen: o,
		unit: s,
		history: c,
		loadHistory: l
	});
	return /* @__PURE__ */ (0, L.jsx)(V_, {
		...u,
		entity: d.entity,
		history: d.history
	});
}
// packages/core/src/entities/weather/conditions.ts
var U_ = {
	sunny: "Sunny",
	"clear-night": "Clear",
	partlycloudy: "Partly cloudy",
	cloudy: "Cloudy",
	fog: "Fog",
	rainy: "Rain",
	pouring: "Heavy rain",
	snowy: "Snow",
	"snowy-rainy": "Sleet",
	hail: "Hail",
	lightning: "Thunder",
	"lightning-rainy": "Thunderstorms",
	windy: "Windy",
	"windy-variant": "Windy, cloudy",
	exceptional: "Severe weather"
}, W_ = {
	sunny: "clear",
	"clear-night": "clear",
	partlycloudy: "partly",
	cloudy: "cloudy",
	fog: "fog",
	rainy: "rain",
	pouring: "rain",
	snowy: "snow",
	"snowy-rainy": "snow",
	hail: "snow",
	lightning: "storm",
	"lightning-rainy": "storm",
	windy: "wind",
	"windy-variant": "wind",
	exceptional: "storm"
}, G_ = /* @__PURE__ */ new Set([
	"rain",
	"snow",
	"storm"
]), K_ = (e) => G_.has(W_[e]), q_ = (e, t = H()) => ye(e % 24, 0, t);
function J_(e, t, n, r = H()) {
	if (!t) return null;
	let i = K_(e), a = t.find((e) => e.hour > n && e.hour <= n + 12 && K_(e.condition) !== i);
	if (!a) return null;
	let o = q_(a.hour, r);
	if (i) return `${U_[e]} until ${o}`;
	let s = W_[a.condition] === "snow" ? "snow" : W_[a.condition] === "storm" ? "storms" : "rain", c = a.precipitationProbability;
	return c == null ? `${s[0].toUpperCase()}${s.slice(1)} at ${o}` : `${Math.round(c)}% ${s} at ${o}`;
}
var Y_ = [
	"N",
	"NE",
	"E",
	"SE",
	"S",
	"SW",
	"W",
	"NW"
], X_ = (e) => Y_[Math.round((e % 360 + 360) % 360 / 45) % 8], Z_ = (e, t) => t === "km/h" ? e : t === "mph" ? e * 1.609 : e * 3.6, Q_ = (e) => e.state === "clear-night" || e.isDay === !1, $_ = (e, t) => t && e === "sunny" ? "Clear" : U_[e], ev = (e) => `${Math.round(e) || 0}°`;
function tv(e) {
	return e <= 50 ? {
		label: "Good",
		short: "Good"
	} : e <= 100 ? {
		label: "Moderate",
		short: "Moderate"
	} : e <= 150 ? {
		label: "Unhealthy for sensitive groups",
		short: "Sensitive"
	} : e <= 200 ? {
		label: "Unhealthy",
		short: "Unhealthy"
	} : e <= 300 ? {
		label: "Very unhealthy",
		short: "Very poor"
	} : {
		label: "Hazardous",
		short: "Hazardous"
	};
}
function nv(e) {
	return e < 3 ? { label: "Low" } : e < 6 ? { label: "Moderate" } : e < 8 ? { label: "High" } : e < 11 ? { label: "Very high" } : { label: "Extreme" };
}
var rv = (e) => e.aqi != null && e.aqi > 100, iv = (e) => e.windGustSpeed != null && Z_(e.windGustSpeed, e.windSpeedUnit) >= 50, av = (e) => e.uvIndex != null && e.uvIndex >= 8;
function ov(e) {
	return e.state === "unavailable" ? [] : [
		rv(e) ? e.aqi > 300 ? "Hazardous air" : e.aqi > 200 ? "Very poor air" : "Poor air" : null,
		iv(e) ? "Strong gusts" : null,
		av(e) ? `${nv(e.uvIndex).label} UV` : null
	].filter((e) => !!e);
}
function sv(e) {
	return ov(e).map((t) => t === "Strong gusts" ? `Gusts ${Math.round(e.windGustSpeed)} ${e.windSpeedUnit}` : t);
}
function cv(e, t, n, r) {
	let i = t?.currentHour ?? 0, a = (t?.temperature ?? []).filter((e) => typeof e == "number"), o = (n ?? []).filter((e) => e.hour > i && e.hour < 24).map((e) => e.temperature), s = [
		...a,
		...o,
		...e == null ? [] : [e],
		...r?.[0] ? [r[0].low, r[0].high] : []
	];
	return s.length ? {
		low: Math.min(...s),
		high: Math.max(...s)
	} : null;
}
function lv(e) {
	return !e || Math.round(e.high) === Math.round(e.low) ? null : `${ev(e.low)}${Math.round(e.high) < 0 ? " to " : "–"}${ev(e.high)}`;
}
// packages/core/src/entities/weather/severity.ts
function uv(e) {
	return ov(e).length ? "advisory" : void 0;
}
// src/skins/orb/cards/weather/conditions.tsx
var dv = {
	fill: "none",
	stroke: "currentColor"
}, fv = "M6.2 15.5h8a3.2 3.2 0 0 0 .4-6.4 4.4 4.4 0 0 0-8.5 1.1 2.7 2.7 0 0 0 .1 5.3Z", pv = "M6.2 12.5h8a3.2 3.2 0 0 0 .4-6.4 4.4 4.4 0 0 0-8.5 1.1 2.7 2.7 0 0 0 .1 5.3Z";
function mv({ condition: e, night: t }) {
	if (e === "unavailable") return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...dv,
		children: [/* @__PURE__ */ (0, L.jsx)("path", { d: fv }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 3.5l13 13" })]
	});
	let n = W_[e], r = t || e === "clear-night";
	switch (n) {
		case "clear": return r ? /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M15 12.4A5.6 5.6 0 0 1 7.6 5a5.6 5.6 0 1 0 7.4 7.4Z" })
		}) : /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: [/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "10",
				cy: "10",
				r: "3.4"
			}), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10 2.8v1.6M10 15.6v1.6M2.8 10h1.6M15.6 10h1.6M4.9 4.9l1.1 1.1M14 14l1.1 1.1M4.9 15.1 6 14M14 6l1.1-1.1" })]
		});
		case "partly": return /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: [r ? /* @__PURE__ */ (0, L.jsx)("path", {
				d: "M9.4 6.2A3.6 3.6 0 0 1 4.6 2.6a3.6 3.6 0 1 0 4.8 4.8",
				transform: "translate(1 1)"
			}) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("circle", {
				cx: "7",
				cy: "7",
				r: "2.4"
			}), /* @__PURE__ */ (0, L.jsx)("path", { d: "M7 2.4v.9M2.4 7h.9M3.8 3.8l.6.6M10.2 3.8l-.6.6" })] }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M7.6 16h7a2.8 2.8 0 0 0 .3-5.6 3.8 3.8 0 0 0-7.3 1 2.3 2.3 0 0 0 0 4.6Z" })]
		});
		case "cloudy": return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: fv })
		});
		case "fog": return /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: [/* @__PURE__ */ (0, L.jsx)("path", { d: pv }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M4 15.5h12M6 18h8" })]
		});
		case "rain": return /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: [/* @__PURE__ */ (0, L.jsx)("path", { d: pv }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M7 14.5l-.8 2.2M10.4 14.5l-.8 2.2M13.8 14.5 13 16.7" })]
		});
		case "snow": return /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: [/* @__PURE__ */ (0, L.jsx)("path", { d: pv }), /* @__PURE__ */ (0, L.jsx)("path", {
				d: "M7 15.5h.01M10 17h.01M13 15.5h.01",
				strokeWidth: "2.2"
			})]
		});
		case "storm": return /* @__PURE__ */ (0, L.jsxs)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: [/* @__PURE__ */ (0, L.jsx)("path", { d: pv }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M10.6 13.5 9 16h2.2l-1.4 2.5" })]
		});
		case "wind": return /* @__PURE__ */ (0, L.jsx)("svg", {
			viewBox: "0 0 20 20",
			"aria-hidden": "true",
			...dv,
			children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M3 8h9.5a2.3 2.3 0 1 0-2.2-2.9M3 11.5h12.5a2.3 2.3 0 1 1-2.2 2.9M3 15h6" })
		});
	}
}
// src/skins/orb/cards/weather/WeatherCard.tsx
var hv = (e) => `${Bt(e).replace(/\.0$/, "")}°`, gv = 12;
function _v({ now: e, feels: t, label: n, onOpen: r }) {
	let i = /* @__PURE__ */ (0, L.jsx)("span", {
		className: "hd-bar wx-bar",
		children: /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric wx-rd",
			children: [/* @__PURE__ */ (0, L.jsxs)("span", {
				className: "wx-rd-t hd-metric-n",
				children: [Bt(e), "°"]
			}), t != null && /* @__PURE__ */ (0, L.jsxs)("span", {
				className: "wx-rd-f",
				children: ["Feels ", ev(t)]
			})]
		})
	});
	return /* @__PURE__ */ (0, L.jsx)(Lf, {
		label: n,
		onOpen: r,
		children: i
	});
}
function vv({ hours: e, empty: t }) {
	let n = G(), r = e.map((e) => [
		q_(e.hour, n),
		U_[e.condition],
		`${Math.round(e.temperature)} degrees`,
		e.precipitationProbability != null && e.precipitationProbability >= 20 ? `${Math.round(e.precipitationProbability)}% chance of precipitation` : null
	].filter(Boolean).join(", ")).join("; ");
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-blk wx-hrs",
		children: [/* @__PURE__ */ (0, L.jsx)("p", {
			className: "hd-blk-h",
			children: /* @__PURE__ */ (0, L.jsx)("span", { children: "Next hours" })
		}), e.length === 0 ? /* @__PURE__ */ (0, L.jsx)("p", {
			className: "wx-hrs-none",
			children: t
		}) : /* @__PURE__ */ (0, L.jsx)("div", {
			role: "img",
			"aria-label": r,
			children: /* @__PURE__ */ (0, L.jsx)("ol", {
				className: "wx-hr-l",
				"aria-hidden": "true",
				children: e.map((e) => /* @__PURE__ */ (0, L.jsxs)("li", {
					className: "wx-hr",
					children: [
						/* @__PURE__ */ (0, L.jsx)("span", {
							className: "wx-hr-t",
							children: xe(e.hour, n)
						}),
						/* @__PURE__ */ (0, L.jsx)("span", {
							className: "wx-hr-i",
							children: /* @__PURE__ */ (0, L.jsx)(mv, { condition: e.condition })
						}),
						/* @__PURE__ */ (0, L.jsx)("span", {
							className: "wx-hr-v",
							children: ev(e.temperature)
						}),
						/* @__PURE__ */ (0, L.jsx)("span", {
							className: "wx-hr-p",
							children: e.precipitationProbability != null && e.precipitationProbability >= 20 ? `${Math.round(e.precipitationProbability)}%` : ""
						})
					]
				}, e.hour))
			})
		})]
	});
}
function yv({ label: e, value: t, sub: n }) {
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "wx-stat",
		children: [
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-chip-sub",
				children: e
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "wx-stat-v",
				children: t
			}),
			n && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "wx-stat-s",
				children: n
			})
		]
	});
}
function bv({ entity: e, history: t, hourly: n, daily: r, variant: i, footprint: a, showControl: o, onOpenDetails: s, onClose: c }) {
	let l = Sf("wx", {
		variant: i,
		footprint: a,
		showControl: o
	}), { sheet: u, featured: d } = l, f = e.state === "unavailable", p = f ? null : e.state, m = Q_(e), h = f ? void 0 : e.temperature, g = f ? void 0 : e.apparentTemperature, _ = Cf("reading", 0), v = t?.currentHour ?? 0, y = f ? null : lv(cv(h, t, n, r)), b = p ? $_(p, m) : "Unavailable", x = G(), S = p ? J_(p, n, v, x) : null, C = S && p && K_(p) ? null : b, w = e.aqi == null ? null : tv(e.aqi), T = ov(e), E = uv(e), D = T.length > 1 ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", {
		className: "wx-warn-l",
		children: `${T[0]} +${T.length - 1}`
	}), /* @__PURE__ */ (0, L.jsx)("span", {
		className: "wx-warn-s",
		children: `${T.length} warnings`
	})] }) : T[0] ?? null, O = u ? T.join(" · ") : D, k = E ? `Warning: ${e.name}: ${sv(e).join(", ")}` : null, A = [
		S,
		C,
		y
	].filter(Boolean).join(" · "), j = k ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
		label: k,
		children: O
	}), A && ` · ${A}`] }) : A, M = h == null ? "" : `${Bt(h)} degrees now${g == null ? "" : `, feels like ${Math.round(g) || 0}`}`, N;
	N = h == null ? /* @__PURE__ */ (0, L.jsx)(Lf, {
		label: `${e.name}: No reading yet`,
		onOpen: u ? void 0 : s,
		children: /* @__PURE__ */ (0, L.jsx)("span", {
			className: "hd-bar wx-bar",
			children: /* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-none",
				children: "Waiting…"
			})
		})
	}) : /* @__PURE__ */ (0, L.jsx)(_v, {
		now: h,
		feels: g,
		label: M,
		onOpen: u ? void 0 : s
	});
	let P = (n ?? []).filter((e) => e.hour > v && e.hour <= v + gv), F = f ? cf(e.lastSeen) : "No forecast yet", ee = h == null ? null : `${Bt(h)}°`, te = g == null ? null : `Feels ${ev(g)}`, ne = f ? "Unavailable" : D ?? [
		ee,
		te,
		S ?? b
	].filter(Boolean).join(" · "), re = f ? "Unavailable" : ee ? [ee, te].filter(Boolean).join(" · ") : b;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: l,
		name: e.name,
		attrs: {
			"data-state": f ? "unavailable" : "ok",
			..._
		},
		level: E,
		glyph: /* @__PURE__ */ (0, L.jsx)(mv, {
			condition: p ?? "unavailable",
			night: m
		}),
		unavailable: f,
		lastSeen: e.lastSeen,
		onOpen: s,
		openHint: "weather details",
		status: j,
		value: ne,
		alert: k,
		bareValue: re,
		readout: {
			value: h == null ? null : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [Bt(h), /* @__PURE__ */ (0, L.jsx)("span", { children: "°" })] }),
			label: u && h != null ? M : void 0
		},
		onClose: c,
		slot: !(u && h != null),
		control: N,
		facts: { start: f ? sf(e.lastSeen) : df(e.lastUpdated) },
		children: [
			!f && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "wx-stats",
				children: [
					e.apparentTemperature != null && /* @__PURE__ */ (0, L.jsx)(yv, {
						label: "Feels like",
						value: ev(e.apparentTemperature),
						sub: e.dewPoint == null ? void 0 : `Dew point ${hv(e.dewPoint)}`
					}),
					e.humidity != null && /* @__PURE__ */ (0, L.jsx)(yv, {
						label: "Humidity",
						value: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [Math.round(e.humidity), /* @__PURE__ */ (0, L.jsx)("small", { children: "%" })] })
					}),
					e.windSpeed != null && /* @__PURE__ */ (0, L.jsx)(yv, {
						label: "Wind",
						value: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [Math.round(e.windSpeed), /* @__PURE__ */ (0, L.jsxs)("small", { children: [" ", e.windSpeedUnit] })] }),
						sub: [e.windBearing == null ? null : X_(e.windBearing), e.windGustSpeed == null ? null : `gusts ${Math.round(e.windGustSpeed)}`].filter(Boolean).join(", ") || void 0
					}),
					w && /* @__PURE__ */ (0, L.jsx)(yv, {
						label: "Air quality",
						value: Math.round(e.aqi),
						sub: w.label
					}),
					e.uvIndex != null && /* @__PURE__ */ (0, L.jsx)(yv, {
						label: "UV index",
						value: Math.round(e.uvIndex),
						sub: nv(e.uvIndex).label
					}),
					e.pressure != null && /* @__PURE__ */ (0, L.jsx)(yv, {
						label: "Pressure",
						value: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [e.pressureUnit === "inHg" ? e.pressure.toFixed(2) : Math.round(e.pressure), /* @__PURE__ */ (0, L.jsxs)("small", { children: [" ", e.pressureUnit] })] })
					})
				]
			}) }),
			(d || u) && /* @__PURE__ */ (0, L.jsx)(vv, {
				hours: f ? [] : P,
				empty: F
			}),
			r && r.length > 0 && !f && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "hd-blk",
				children: [/* @__PURE__ */ (0, L.jsx)("p", {
					className: "hd-blk-h",
					children: /* @__PURE__ */ (0, L.jsx)("span", { children: "Next days" })
				}), /* @__PURE__ */ (0, L.jsx)("ol", {
					className: "wx-days",
					children: r.slice(0, 5).map((e, t) => /* @__PURE__ */ (0, L.jsxs)("li", {
						className: "wx-day",
						children: [
							/* @__PURE__ */ (0, L.jsx)("span", {
								className: "wx-day-n",
								children: t === 0 ? "Today" : e.day
							}),
							/* @__PURE__ */ (0, L.jsx)("span", {
								className: "wx-day-i",
								title: U_[e.condition],
								children: /* @__PURE__ */ (0, L.jsx)(mv, { condition: e.condition })
							}),
							/* @__PURE__ */ (0, L.jsxs)("span", {
								className: "wx-day-t",
								children: [
									/* @__PURE__ */ (0, L.jsxs)("b", { children: [Math.round(e.high), "°"] }),
									" ",
									Math.round(e.low),
									"°"
								]
							}),
							/* @__PURE__ */ (0, L.jsx)("span", {
								className: "wx-day-p",
								children: e.precipitationProbability != null && e.precipitationProbability >= 20 ? `${e.precipitationProbability}%` : ""
							})
						]
					}, t))
				})]
			}) })
		]
	});
}
// src/skins/orb/cards/weather/WeatherTile.tsx
var xv = ap(bv, ip(bv, (e) => `${e} weather details`));
// src/skins/orb/ha/HaWeatherTile.tsx
function Sv({ entityId: e, aqiEntityId: t, aqiScale: n, sunEntityId: r, name: i, lastSeen: a, temperatureUnit: o, windSpeedUnit: s, pressureUnit: c, hourly: l, daily: u, history: d, loadHistory: f, loadForecasts: p, onForecastError: m, ...h }) {
	let g = Er(e, {
		aqiEntityId: t,
		aqiScale: n,
		sunEntityId: r,
		name: i,
		lastSeen: a,
		temperatureUnit: o,
		windSpeedUnit: s,
		pressureUnit: c,
		hourly: l,
		daily: u,
		history: d,
		loadHistory: f,
		loadForecasts: p,
		onForecastError: m
	});
	return /* @__PURE__ */ (0, L.jsx)(xv, {
		...h,
		entity: g.entity,
		history: g.history,
		hourly: g.hourly,
		daily: g.daily
	});
}
// packages/core/src/entities/cover/severity.ts
function Cv(e) {
	if (!(e.state === "unavailable" || e.state === "unknown" || Fr(e))) return kr(e.deviceClass) && Za(e) ? "advisory" : void 0;
}
// src/skins/orb/cards/cover/icons.tsx
var wv = {
	fill: "none",
	stroke: "currentColor"
};
function Tv({ kind: e, open: t, stop: n }) {
	if (n) return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, L.jsx)("rect", {
			x: "6.5",
			y: "6.5",
			width: "7",
			height: "7",
			rx: "1.2",
			fill: "currentColor"
		})
	});
	let r;
	switch (e) {
		case "curtain":
			r = t ? "M3 4h14M4.5 4v12h2.8C6.6 12.5 6.6 7.5 7.6 4M15.5 4v12h-2.8c.7-3.5.7-8.5-.3-12" : "M3 4h14M4.5 4v12h5.1V4M15.5 4v12h-5.1V4M7 6v8M13 6v8";
			break;
		case "garage":
		case "door":
		case "gate":
			r = t ? "M3 8.5 10 4l7 4.5v8M3 8.5v8M6 16.5v-6.5h8v6.5M6 12h8" : "M3 8.5 10 4l7 4.5v8M3 8.5v8M6 10h8v6.5H6ZM6 12.2h8M6 14.4h8";
			break;
		case "window":
			r = "M4.5 3.5h11v13h-11ZM10 3.5v13M4.5 10h11";
			break;
		default: r = t ? "M3.5 4h13M5 4v3.5h10V4M5 16.5V9.5M15 16.5V9.5" : "M3.5 4h13M5 4v12.5h10V4M5 7.5h10M5 11h10M5 14h10";
	}
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...wv,
		children: /* @__PURE__ */ (0, L.jsx)("path", { d: r })
	});
}
// src/skins/orb/cards/cover/parts.tsx
var Ev = 14;
function Dv({ id: e, label: t, kind: n, position: r, moving: i, disabled: a, text: o, onChange: s, onCommit: c }) {
	return /* @__PURE__ */ (0, L.jsx)(Uf, {
		id: e,
		label: t,
		slider: {
			value: Math.round(r),
			min: 0,
			max: 100,
			inset: 0,
			along: n === "curtain" ? (e, t) => Math.min(1, Math.abs(e - (t.left + t.width / 2)) / Math.max(1, t.width / 2 - Ev)) : void 0,
			snap: (e) => Pr(Math.round(e)),
			valueText: $a,
			disabled: a,
			onChange: s,
			onCommit: c
		},
		className: "cv-bar",
		disabled: a,
		text: () => o,
		precision: 3,
		"data-kind": n,
		"data-moving": i || void 0
	});
}
var Ov = () => /* @__PURE__ */ (0, L.jsx)("svg", {
	viewBox: "0 0 14 14",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 8.5 7 5l3.5 3.5" })
}), kv = () => /* @__PURE__ */ (0, L.jsx)("svg", {
	viewBox: "0 0 14 14",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 5.5 7 9l3.5-3.5" })
});
function Av({ name: e, open: t, moving: n, either: r = !1, asks: i = !1, flat: a = !1, text: o, canStop: s, onOpen: c, onClose: l, onStop: u }) {
	let d = i ? "…" : "";
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "hd-step",
		"data-open": t || void 0,
		role: "group",
		"aria-label": e,
		children: [
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-btn cv-oc-b",
				"aria-label": `Close ${e}${d}`,
				disabled: a || !t && !n && !r,
				onClick: l,
				children: /* @__PURE__ */ (0, L.jsx)("span", { children: /* @__PURE__ */ (0, L.jsx)(kv, {}) })
			}),
			n && s ? /* @__PURE__ */ (0, L.jsxs)("button", {
				type: "button",
				className: "cv-oc-stop",
				onClick: u,
				children: [/* @__PURE__ */ (0, L.jsx)("i", { "aria-hidden": "true" }), "Stop"]
			}) : /* @__PURE__ */ (0, L.jsx)("span", {
				className: "cv-oc-v",
				"aria-live": "polite",
				children: o
			}),
			/* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "hd-btn cv-oc-b",
				"aria-label": `Open ${e}${d}`,
				disabled: a || t && !n && !r,
				onClick: c,
				children: /* @__PURE__ */ (0, L.jsx)("span", { children: /* @__PURE__ */ (0, L.jsx)(Ov, {}) })
			})
		]
	});
}
// src/skins/orb/cards/cover/CoverCard.tsx
function jv({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenCover: a, onCloseCover: o, onStopCover: s, onSetPosition: c, onSetTilt: l, onOpenDetails: u, onClose: d, action: f }) {
	let p = Sf("cv", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: m, sheet: h, area: g } = p, _ = e.state === "unavailable", v = e.state === "unknown", y = v || !!e.assumedState, b = Fr(e), x = Math.round(Ir(e)), S = x > 0 || e.state === "open", C = kr(e.deviceClass), w = Cf(C ? "state" : "energy", _ || C ? 0 : .6 * x / 100), T = Lr(e), E = jr(e), D = Qa(e), O = !v && T && x > 0, k = b ? `${D}${T ? ` · ${x}%` : ""}` : v || !S || !T || x === 100 ? D : `${D} · ${x}%`, A = b && e.supportsStop, j = Ar(e) && !_, M = Qd({
		run: (e) => typeof e == "string" ? e === "open" ? a() : o() : c?.(e.position),
		needsCode: () => !1,
		settled: (t) => Br(t, e),
		initial: f,
		disabled: !j,
		askElsewhere: h ? void 0 : (e) => u?.(e)
	}), N = M.pending, P = j && b && !e.supportsStop, F = S ? "close" : "open", ee = A ? s : P ? () => {} : j ? () => M.ask(F) : S ? o : a, te = A ? `Stop ${e.name}` : P ? `${e.name}: ${D}` : j ? `${F === "open" ? "Open" : "Close"} ${e.name}…` : e.name, ne = Cv(e), re = ne != null, ie = g ?? Or[e.deviceClass], ae = re ? ro(e.lastChanged) : void 0, oe = re ? `Warning: ${e.name}: ${ae}` : void 0, se = h && g && !(C && S) ? `${g} · ${Or[e.deviceClass]}` : ie, ce = T && c != null, [le, ue] = (0, I.useState)(null), [de, fe] = (0, I.useState)(null), R = (0, I.useRef)(!1), z = (e) => {
		R.current = !0, ue(e);
	}, B = (e) => {
		R.current = !1, ue(null), e !== x && M.ask(Rr(e));
	}, pe = (e) => {
		let t = R.current;
		R.current = !1, t && (ue(null), e === x ? fe(null) : (fe({
			at: e,
			from: x
		}), c?.(e)));
	}, me = de == null || de.from !== x ? null : de.at, he = le ?? (N == null ? me ?? x : Vr(N)), ge = he === x ? k : he === 0 ? "Closed" : he === 100 ? "Open" : `Open · ${he}%`, V;
	V = ce && j ? /* @__PURE__ */ (0, L.jsx)(Dv, {
		id: `${m}-p`,
		label: `${e.name} position…`,
		kind: e.deviceClass === "curtain" ? "curtain" : "shade",
		position: he,
		moving: b && le == null,
		text: ge,
		disabled: P || N != null,
		onChange: z,
		onCommit: B
	}) : ce ? /* @__PURE__ */ (0, L.jsx)(Dv, {
		id: `${m}-p`,
		label: `${e.name} position`,
		kind: e.deviceClass === "curtain" ? "curtain" : "shade",
		position: he,
		moving: b && le == null && me == null,
		text: ge,
		onChange: z,
		onCommit: pe
	}) : /* @__PURE__ */ (0, L.jsx)(Av, {
		name: e.name,
		open: S,
		moving: b,
		either: y,
		asks: j,
		flat: P || N != null,
		text: k,
		canStop: e.supportsStop,
		onOpen: j ? () => M.ask("open") : a,
		onClose: j ? () => M.ask("close") : o,
		onStop: s
	});
	let H = _ ? "Unavailable" : ae ?? k;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: p,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...w
		},
		level: ne,
		orb: {
			label: te,
			pressed: S && !_,
			intensity: x / 100,
			onToggle: ee,
			children: /* @__PURE__ */ (0, L.jsx)(Tv, {
				kind: e.deviceClass,
				open: S,
				stop: A
			})
		},
		unavailable: _,
		lastSeen: e.lastSeen,
		onOpen: u && (() => u()),
		status: oe ? /* @__PURE__ */ (0, L.jsx)(Af, {
			label: oe,
			children: ae
		}) : se,
		value: H,
		alert: oe,
		readout: {
			value: _ ? null : O ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [x, /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) : D,
			duplicate: !0,
			word: !O
		},
		onClose: d,
		closeLabel: `Close ${e.name} details`,
		closeFocus: !N,
		control: V,
		facts: {
			start: _ ? sf(e.lastSeen) : uf(e.lastChanged),
			end: [
				Or[e.deviceClass],
				T ? "position" : "open / close",
				E ? "tilt" : null
			].filter(Boolean).join(", ")
		},
		children: [!_ && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
			N && /* @__PURE__ */ (0, L.jsx)($f, {
				busy: M.busy,
				waiting: co(e),
				error: M.failed ? "Didn’t go through. Try again" : null,
				question: ao(N, e.name),
				detail: oo(N, e),
				action: so(N, e),
				onConfirm: () => void M.confirm(),
				onCancel: M.close
			}, M.pendingKey),
			j && !N && /* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-note",
				children: lo
			}),
			ce && !j && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-q`,
				label: "Quick positions",
				options: Mr,
				value: b ? null : x,
				onChange: c
			}),
			ce && j && !N && !P && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-q`,
				label: "Quick positions",
				options: Nr.map((e) => ({
					...e,
					label: `${e.label}…`
				})),
				value: b ? null : x,
				onChange: B
			}),
			E && l && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${m}-t`,
				label: "Slats",
				options: E === "ends" ? to : eo,
				value: e.tilt ?? null,
				onChange: l
			})
		] }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: e.lastChanged ? `${b ? S ? "Open" : "Closed" : D} since ${e.lastChanged}` : ""
		})]
	});
}
// src/skins/orb/cards/cover/CoverTile.tsx
var Mv = ap(jv, ip(jv));
// src/skins/orb/ha/HaCoverTile.tsx
function Nv({ entityId: e, name: t, area: n, lastSeen: r, deviceClass: i, history: a, loadHistory: o, onActionError: s, ...c }) {
	let l = Jr(e, {
		name: t,
		area: n,
		lastSeen: r,
		deviceClass: i,
		history: a,
		loadHistory: o,
		onActionError: s
	});
	return /* @__PURE__ */ (0, L.jsx)(Mv, {
		...c,
		entity: l.entity,
		history: l.history,
		...l.actions
	});
}
// packages/core/src/entities/toggle/durations.ts
var Pv = [
	{
		value: "30",
		label: "30 min"
	},
	{
		value: "60",
		label: "1 hour"
	},
	{
		value: "morning",
		label: "Morning",
		sub: "07:00"
	},
	{
		value: "manual",
		label: "Until off",
		sub: "No end"
	}
], Fv = (e) => e.state === "unavailable" ? "Unavailable" : e.state === "unknown" ? "Unknown" : e.state === "on" ? "Ein" : "Aus", Iv = (e) => e.entityId.startsWith("switch.") ? "Switch" : "Toggle helper", Lv = {
	fill: "none",
	stroke: "currentColor"
}, Rv = {
	"bell-off": /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M6.2 6.6A3.9 3.9 0 0 1 13.8 8v2.9l1.4 2.3H6.5" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M5.9 9.2v1.7l-1.4 2.3" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M8.4 15.6a1.7 1.7 0 0 0 3.2 0" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 3.5l13 13" })
	] }),
	moon: /* @__PURE__ */ (0, L.jsx)("path", { d: "M15.2 12.6A6 6 0 0 1 7.4 4.8a6 6 0 1 0 7.8 7.8Z" }),
	"volume-off": /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.8 8h2.7l3.6-3v10l-3.6-3H3.8Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M13 8l4 4M17 8l-4 4" })] }),
	guest: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsx)("circle", {
			cx: "8",
			cy: "7",
			r: "2.6"
		}),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.4 15.5a4.6 4.6 0 0 1 9.2 0" }),
		/* @__PURE__ */ (0, L.jsx)("path", { d: "M13.2 5.2a2.4 2.4 0 0 1 0 4.4M14.6 11.6a4.2 4.2 0 0 1 2 3.9" })
	] }),
	away: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("rect", {
		x: "3.5",
		y: "7",
		width: "13",
		height: "8.5",
		rx: "2"
	}), /* @__PURE__ */ (0, L.jsx)("path", { d: "M7.5 7V5.6a1.4 1.4 0 0 1 1.4-1.4h2.2a1.4 1.4 0 0 1 1.4 1.4V7M3.5 11h13" })] }),
	power: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 3.5v6" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M6.3 6.2a5.4 5.4 0 1 0 7.4 0" })] }),
	waves: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M3 7.5c1.2-1.3 2.3-1.3 3.5 0s2.3 1.3 3.5 0 2.3-1.3 3.5 0 2.3 1.3 3.5 0" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M3 12.5c1.2-1.3 2.3-1.3 3.5 0s2.3 1.3 3.5 0 2.3-1.3 3.5 0 2.3 1.3 3.5 0" })] })
};
function zv({ icon: e = "power" }) {
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...Lv,
		children: Rv[e]
	});
}
// src/skins/orb/cards/toggle/ToggleCard.tsx
function Bv({ entity: e, history: t, variant: n, footprint: r, showControl: i, durations: a = Pv, onToggle: o, onTurnOn: s, onTurnOff: c, onTurnOnFor: l, onOpenDetails: u, onClose: d }) {
	let f = Sf("tw", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: p, sheet: m, area: h } = f, g = e.state === "unavailable", _ = e.state === "on", v = Cf("state", 0), y = _ ? e.until ? `Until ${e.until}` : lf(e.lastChanged) ?? "On" : null, b = _ && e.until && !g ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", {
		className: "tw-st-u",
		children: jf(y)
	}), /* @__PURE__ */ (0, L.jsx)("span", {
		className: "tw-st-a",
		children: h
	})] }) : h ?? (!m && (g ? e.lastSeen : e.lastChanged) ? lf(g ? e.lastSeen : e.lastChanged) : null), x = Fv(e), S = _ && e.until ? `${x} until ${e.until}` : x, C = x;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: f,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...v
		},
		orb: {
			label: e.name,
			pressed: _,
			intensity: .7,
			onToggle: o,
			children: /* @__PURE__ */ (0, L.jsx)(zv, { icon: e.icon })
		},
		unavailable: g,
		lastSeen: e.lastSeen,
		onOpen: u,
		status: m && h ? `${h}${_ && e.until ? ` · Until ${e.until}` : ""}` : b,
		value: S,
		bareValue: C,
		readout: {
			value: g ? null : x,
			duplicate: !0,
			word: !0
		},
		onClose: d,
		control: /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: `${e.name}: ${x} · ${_ ? y : "Turn on"}`,
			on: _,
			onToggle: o,
			extra: _ ? y : "Turn on",
			children: x
		}),
		facts: {
			start: g ? sf(e.lastSeen) : uf(e.lastChanged),
			end: Iv(e)
		},
		children: [!g && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [
			e.description && /* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-note",
				children: e.description
			}),
			Tt(e) && s && c && /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("p", {
				className: "hd-note",
				children: Et(e)
			}), /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${p}-w`,
				label: "Turn",
				options: [...Dt],
				value: null,
				onChange: (e) => (e === "on" ? s : c)()
			})] }),
			l && a.length > 0 && /* @__PURE__ */ (0, L.jsx)(Qf, {
				id: `${p}-d`,
				label: _ ? "Keep on" : "Turn on for",
				options: a,
				value: _ ? e.duration ?? null : null,
				onChange: l
			})
		] }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut("on", t.onMinutes)
		})]
	});
}
// src/skins/orb/cards/toggle/ToggleTile.tsx
var Vv = ap(Bv, ip(Bv));
// src/skins/orb/ha/HaToggleTile.tsx
function Hv({ entityId: e, name: t, area: n, lastSeen: r, icon: i, description: a, history: o, loadHistory: s, onActionError: c, ...l }) {
	let u = Qr(e, {
		name: t,
		area: n,
		lastSeen: r,
		icon: i,
		description: a,
		history: o,
		loadHistory: s,
		onActionError: c
	});
	return /* @__PURE__ */ (0, L.jsx)(Vv, {
		...l,
		entity: u.entity,
		history: u.history,
		...u.actions
	});
}
// packages/core/src/entities/alarm/severity.ts
function Uv(e) {
	return e.state === "triggered" ? "alarm" : e.state === "pending" ? "urgent" : e.state === "disarmed" && e.openSensors?.length ? "advisory" : void 0;
}
// packages/core/src/entities/alarm/modes.ts
var Wv = {
	armed_home: "home",
	armed_away: "away",
	armed_night: "night",
	armed_vacation: "vacation",
	armed_custom_bypass: "custom_bypass"
}, Gv = {
	off: "Off",
	home: "Home",
	away: "Away",
	night: "Night",
	vacation: "Vacation",
	custom_bypass: "Custom"
}, Kv = {
	home: "Armed home",
	away: "Armed away",
	night: "Armed night",
	vacation: "Armed vacation",
	custom_bypass: "Armed custom"
}, qv = (e, t) => [
	"off",
	...e,
	...t !== "off" && !e.includes(t) ? [t] : []
], Jv = (e, t) => !!e.codeFormat && (t.kind === "disarm" || (e.codeArmRequired ?? !0)), Yv = (e) => `${Math.floor(Math.max(0, e) / 60)}:${String(Math.max(0, Math.ceil(e)) % 60).padStart(2, "0")}`, Xv = (e) => e.length <= 1 ? e.join("") : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`, Zv = (e) => `${Xv(e)} ${e.length > 1 ? "are" : "is"} open.`;
function Qv(e) {
	let t = e.triggeredBy;
	if (e.state === "triggered") return {
		word: "Triggered",
		detail: t,
		said: `Triggered${t ? ` by ${t}` : ""}`
	};
	if (e.state === "pending") return {
		word: "Entry delay",
		detail: t,
		said: `Entry delay${t ? `, ${t} opened` : ""}`
	};
	let n = e.openSensors ?? [];
	if (e.state === "disarmed" && n.length) return {
		word: n.length > 1 ? `${n.length} open` : "Open",
		detail: n.join(", "),
		said: Zv(n).slice(0, -1)
	};
}
var $v = (e) => e.detail ? `${e.word} · ${e.detail}` : e.word, ey = (e, t) => e.kind === "disarm" ? t.state === "arming" ? "cancel arming" : "disarm" : `arm ${Gv[e.mode].toLowerCase()}`, ty = {
	fill: "none",
	stroke: "currentColor"
}, ny = "M10 2.8 4.5 5v4.6c0 3.4 2.3 6.2 5.5 7.6 3.2-1.4 5.5-4.2 5.5-7.6V5Z";
function ry({ kind: e }) {
	let t = e === "armed" ? "M7.6 10l1.7 1.7 3.2-3.4" : e === "alert" ? "M10 7v3.4M10 13h.01" : "M3.5 3.5l13 13";
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...ty,
		children: [/* @__PURE__ */ (0, L.jsx)("path", { d: ny }), /* @__PURE__ */ (0, L.jsx)("path", { d: t })]
	});
}
var iy = {
	off: "M10 3.5v6M6.3 6.2a5.4 5.4 0 1 0 7.4 0",
	home: "M3.5 9.5 10 4l6.5 5.5M5.5 8v8.5h9V8",
	away: "M8.5 3.5h7v13h-7M12 10H3.5M6 7.5 3.5 10 6 12.5",
	night: "M15.2 12.6A6 6 0 0 1 7.4 4.8a6 6 0 1 0 7.8 7.8Z",
	vacation: "M3.5 7h13v8.5h-13ZM7.5 7V5.6a1.4 1.4 0 0 1 1.4-1.4h2.2a1.4 1.4 0 0 1 1.4 1.4V7",
	custom_bypass: "M4 6h12M4 10h12M4 14h12M7 4.5v3M13 8.5v3M9 12.5v3"
};
function ay({ mode: e }) {
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...ty,
		children: /* @__PURE__ */ (0, L.jsx)("path", { d: iy[e] })
	});
}
// src/skins/orb/cards/alarm/parts.tsx
function oy({ name: e, modes: t, current: n, onPick: r }) {
	let i = qv(t, n), a = Math.max(0, i.indexOf(n));
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "al-sw",
		role: "group",
		"aria-label": `${e} mode`,
		"data-armed": n !== "off" || void 0,
		"data-many": i.length >= 5 || void 0,
		"data-crowd": i.length >= 6 || void 0,
		style: {
			"--n": i.length,
			"--i": a
		},
		children: [/* @__PURE__ */ (0, L.jsx)("span", {
			className: "al-thumb",
			"aria-hidden": "true"
		}), i.map((e) => /* @__PURE__ */ (0, L.jsx)(sy, {
			mode: e,
			current: n === e,
			onPick: () => {
				n !== e && r(e);
			}
		}, e))]
	});
}
function sy({ mode: e, current: t, onPick: n }) {
	let r = Id({
		onPress: n,
		pressed: t
	});
	return /* @__PURE__ */ (0, L.jsxs)("button", {
		className: "al-seg",
		"aria-label": e === "off" ? "Off: Disarm" : `Arm ${Gv[e].toLowerCase()}`,
		title: Gv[e],
		...r,
		children: [/* @__PURE__ */ (0, L.jsx)(ay, { mode: e }), /* @__PURE__ */ (0, L.jsx)("span", {
			className: "al-seg-l",
			children: Gv[e]
		})]
	});
}
function cy({ kind: e, label: t, left: n, total: r, action: i, onAction: a }) {
	let o = n != null && r != null && r > 0, s = o ? 1 - Math.max(0, n) / r : 0;
	return /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "al-cd",
		"data-kind": e,
		"data-timed": o || void 0,
		role: "timer",
		"aria-live": "off",
		style: { "--f": s.toFixed(3) },
		children: [
			o ? /* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-cd-fill",
				"aria-hidden": "true"
			}) : /* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-cd-wait",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-cd-l",
				children: t
			}),
			o && /* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-cd-t",
				children: Yv(n)
			}),
			i && a && /* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "al-cd-b",
				onClick: a,
				children: i
			})
		]
	});
}
function ly({ mode: e, by: t, onOpen: n }) {
	let r = e !== "off", i = r ? Kv[e] : "Disarmed";
	return n ? /* @__PURE__ */ (0, L.jsxs)("button", {
		type: "button",
		className: "al-st al-st--open",
		"data-armed": r || void 0,
		"aria-label": `${i}. Change mode`,
		onClick: n,
		children: [
			/* @__PURE__ */ (0, L.jsx)(ay, { mode: e }),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-st-l",
				children: i
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-st-s",
				children: r ? Gv[e] : i
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-st-x",
				children: "Change"
			})
		]
	}) : /* @__PURE__ */ (0, L.jsxs)("div", {
		className: "al-st",
		"data-armed": r || void 0,
		children: [
			/* @__PURE__ */ (0, L.jsx)(ay, { mode: e }),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-st-l",
				children: i
			}),
			/* @__PURE__ */ (0, L.jsx)("span", {
				className: "al-st-s",
				children: r ? Gv[e] : i
			}),
			t && /* @__PURE__ */ (0, L.jsxs)("span", {
				className: "al-st-x",
				children: ["by ", t]
			})
		]
	});
}
// src/skins/orb/cards/alarm/AlarmCard.tsx
function uy({ entity: e, history: t, variant: n, footprint: r, showControl: i, onArm: a, onDisarm: o, readOnly: s, onOpenDetails: c, onClose: l, action: u }) {
	let d = Sf("al", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { sheet: f, area: p } = d, m = e.state === "unavailable", h = Wv[e.state], g = m ? void 0 : Uv(e), _ = m ? void 0 : Qv(e), v = g === "alarm" || g === "urgent", y = e.state === "arming" || e.state === "pending" || e.state === "disarming", b = Cf("state", 0), x = s ?? (!a && !o), S = !!e.codeFormat && (e.codeArmRequired ?? !0), C = id(e.delay, e.changedAt, y), w = Qd({
		run: (e, t) => e.kind === "disarm" ? o?.(t) : a?.(e.mode, t),
		needsCode: (t) => Jv(e, t),
		settled: (t) => t.kind === "disarm" && e.state === "disarmed",
		initial: u,
		disabled: x,
		askElsewhere: f ? void 0 : (e) => c?.(e)
	}), T = w.pending, E = (e) => {
		w.attempt(e);
	}, D = (e) => E(e === "off" ? { kind: "disarm" } : {
		kind: "arm",
		mode: e
	}), O = e.openSensors ?? [], k = _ ? $v(_) : null, A = _ ? `${g === "alarm" ? "Alert" : "Warning"}: ${e.name}: ${_.said}` : null, j = e.armingTo ? ` ${Gv[e.armingTo].toLowerCase()}` : "", M = g === "alarm" ? k : _ ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(Af, {
		label: A,
		children: _.word
	}), _.detail && ` · ${_.detail}`] }) : m ? p ?? "Unavailable" : e.state === "arming" ? `Arming${j} · leave now` : e.state === "disarming" ? "Disarming…" : h ? `${Gv[h]}${e.lastChanged ? ` since ${e.lastChanged}` : ""}` : p ?? "Disarmed", N = m ? "Unavailable" : e.state === "triggered" ? "Alarm" : e.state === "pending" ? x ? "Entry delay" : "Disarm now" : e.state === "arming" ? "Arming" : e.state === "disarming" ? "Disarming" : h ? Gv[h] : "Disarmed", P;
	P = e.state === "pending" ? x ? /* @__PURE__ */ (0, L.jsx)(cy, {
		kind: "pending",
		label: C == null ? "Entry delay…" : "Entry delay",
		left: C,
		total: e.delay
	}) : /* @__PURE__ */ (0, L.jsx)(cy, {
		kind: "pending",
		label: C == null ? "Entry delay · disarm now" : "Disarm now",
		left: C,
		total: e.delay,
		action: "Disarm",
		onAction: () => E({ kind: "disarm" })
	}) : e.state === "arming" ? /* @__PURE__ */ (0, L.jsx)(cy, {
		kind: "arming",
		label: C == null ? `Arming${j}…` : `Arming${j}`,
		left: C,
		total: e.delay,
		action: x ? void 0 : "Cancel",
		onAction: x ? void 0 : () => E({ kind: "disarm" })
	}) : e.state === "disarming" ? /* @__PURE__ */ (0, L.jsx)(cy, {
		kind: "disarming",
		label: "Disarming…",
		left: C,
		total: e.delay
	}) : x ? /* @__PURE__ */ (0, L.jsx)(ly, {
		mode: h ?? "off",
		by: e.changedBy
	}) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(oy, {
		name: e.name,
		modes: e.modes,
		current: h ?? "off",
		onPick: D
	}), !f && c && /* @__PURE__ */ (0, L.jsx)(ly, {
		mode: h ?? "off",
		onOpen: () => c()
	})] });
	let F = k ?? N;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: d,
		name: e.name,
		attrs: {
			"data-state": e.state,
			"data-armed": h || e.state === "arming" || e.state === "disarming" ? "" : void 0,
			...b
		},
		level: g,
		glyph: /* @__PURE__ */ (0, L.jsx)(ry, { kind: m ? "unavailable" : v ? "alert" : h || e.state === "arming" || e.state === "disarming" ? "armed" : "off" }),
		unavailable: m,
		lastSeen: e.lastSeen,
		onOpen: c && (() => c()),
		status: M,
		value: F,
		alert: A,
		readout: {
			value: N,
			duplicate: !0,
			word: !0
		},
		onClose: l,
		closeFocus: !T,
		control: P,
		urgent: g === "alarm" ? /* @__PURE__ */ (0, L.jsx)(Mf, {
			alert: "Alarm",
			more: e.triggeredBy,
			value: x ? lf(e.lastChanged) : void 0,
			action: x ? void 0 : /* @__PURE__ */ (0, L.jsx)("button", {
				type: "button",
				className: "al-cd-b al-alarm-b",
				onClick: () => E({ kind: "disarm" }),
				children: "Disarm"
			})
		}) : void 0,
		facts: {
			start: m ? sf(e.lastSeen) : uf(e.lastChanged, e.changedBy),
			end: x ? "View only" : e.codeFormat ? S ? "Code to arm and disarm" : "Code to disarm" : "No code"
		},
		children: [!m && /* @__PURE__ */ (0, L.jsxs)(lp, { children: [O.length > 0 && (!T || T.kind === "arm") && /* @__PURE__ */ (0, L.jsxs)("p", {
			className: "hd-note",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-warn",
				children: Zv(O)
			}), x ? null : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
				" Arming will leave ",
				O.length > 1 ? "them" : "it",
				" unguarded."
			] })]
		}), T && /* @__PURE__ */ (0, L.jsx)(tp, {
			prompt: `Enter the code to ${ey(T, e)}`,
			text: e.codeFormat === "text",
			onSubmit: w.submit,
			onCancel: w.close
		}, w.pendingKey)] }), t && !T && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut("armed", t.armedMinutes)
		})]
	});
}
// src/skins/orb/cards/alarm/AlarmTile.tsx
var dy = ap(uy, ip(uy));
// src/skins/orb/ha/HaAlarmTile.tsx
function fy({ entityId: e, name: t, area: n, lastSeen: r, exitDelay: i, entryDelay: a, openSensors: o, triggeredBy: s, history: c, loadHistory: l, onActionError: u, ...d }) {
	let f = ai(e, {
		name: t,
		area: n,
		lastSeen: r,
		exitDelay: i,
		entryDelay: a,
		openSensors: o,
		triggeredBy: s,
		history: c,
		loadHistory: l,
		onActionError: u
	});
	return /* @__PURE__ */ (0, L.jsx)(dy, {
		...d,
		entity: f.entity,
		history: f.history,
		...f.actions
	});
}
// src/skins/orb/cards/owlet/icons.tsx
var py = {
	fill: "none",
	stroke: "currentColor"
};
function my({ off: e }) {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...py,
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M7 2.5h5.2v7.4l3 2.9a2.5 2.5 0 0 1-3.5 3.6L7.9 12.7A3 3 0 0 1 7 10.6Z" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M7 5.3h5.2" }),
			e && /* @__PURE__ */ (0, L.jsx)("path", { d: "M3.5 3.5l13 13" })
		]
	});
}
function hy() {
	return /* @__PURE__ */ (0, L.jsx)("svg", {
		className: "ow-heart-i",
		viewBox: "0 0 16 16",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, L.jsx)("path", { d: "M8 13.6S2.2 10.1 2.2 6.1A3 3 0 0 1 8 4.7a3 3 0 0 1 5.8 1.4c0 4-5.8 7.5-5.8 7.5Z" })
	});
}
// src/skins/orb/cards/owlet/OwletCard.tsx
function gy({ entity: e, history: t, variant: n, footprint: r, showControl: i, onOpenDetails: a, onClose: o, onBaseToggle: s }) {
	let c = Sf("ow", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { nameId: l, sheet: u, compact: d, area: f } = c, p = e.state === "unavailable" ? void 0 : e.state, m = e.heartRate, h = e.oxygen, g = p == null && m == null && h == null, _ = Cf("reading", 0), { vitals: v, problems: y } = Ei(e.alerts), b = !g && e.live === !1, x = ci(e.alerts, b), S = x === "alarm" ? v[0] : void 0, C = y[0], w = _i(e.lastUpdated), T = C ? `Warning: ${e.name}: ${Ti[C]}` : b ? `Warning: ${e.name}: ${vi(e.lastUpdated)}` : null, E = S ? S.endsWith("oxygen") ? h == null ? null : `${bi(h)}% O₂` : m == null ? null : `${yi(m)} bpm` : null, D = S ? [
		wi[S],
		E,
		...v.slice(1).map((e) => wi[e])
	].filter(Boolean).join(" · ") : null, O = S ? [
		Ti[S],
		E,
		...v.slice(1).map((e) => Ti[e])
	].filter(Boolean).join(" · ") : null, k = p ? li[p] : di, A = [m == null ? null : `${yi(m)} bpm`, h == null ? null : `${bi(h)}% O₂`].filter(Boolean).join(" · "), j = [m == null ? null : `heart rate ${yi(m)} beats per minute`, h == null ? null : `oxygen ${bi(h)} percent`].filter(Boolean).join(", "), M = j ? e.live ? `live, ${j}` : b ? `${j}, ${vi(e.lastUpdated).toLowerCase()}` : j : "no reading yet", N = `${k.toLowerCase()}, ${M}`, P = e.baseOn === !1, F = d || S != null, ee = C ? /* @__PURE__ */ (0, L.jsx)(Af, {
		label: T,
		children: wi[C]
	}) : b ? /* @__PURE__ */ (0, L.jsx)(Af, {
		label: T,
		children: w
	}) : P ? "Base station off" : null, te = g ? C ? ee : e.charging ? pi : "Unavailable" : F ? ee && p ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		ee,
		" · ",
		/* @__PURE__ */ (0, L.jsx)("span", {
			className: "ow-sl-l",
			children: k
		}),
		/* @__PURE__ */ (0, L.jsx)("span", {
			className: "ow-sl-s",
			children: ui[p]
		})
	] }) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		ee,
		ee && " · ",
		k
	] }) : ee ?? f, ne = g ? C ? wi[C] : e.charging ? pi : "Unavailable" : [p ? li[p] : null, A || "Waiting…"].filter(Boolean).join(" · "), re = D ?? ne, ie = D ? `Alert: ${e.name}: ${O}` : T, ae = /* @__PURE__ */ (0, L.jsxs)("span", {
		className: "hd-bar ow-bar",
		children: [/* @__PURE__ */ (0, L.jsxs)("span", {
			className: "hd-metric ow-metric ow-metric--sleep",
			children: [/* @__PURE__ */ (0, L.jsx)("span", {
				className: "hd-label ow-label",
				children: "Sleep"
			}), p ? /* @__PURE__ */ (0, L.jsx)("span", {
				className: "ow-value hd-metric-v ow-sleep",
				children: ui[p]
			}) : /* @__PURE__ */ (0, L.jsx)("span", {
				className: "ow-sleep-none",
				children: fi
			})]
		}), /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "ow-vitals",
			children: [
				m != null && /* @__PURE__ */ (0, L.jsxs)("span", {
					className: "hd-metric ow-metric ow-metric--heart",
					children: [
						/* @__PURE__ */ (0, L.jsx)("span", {
							className: "ow-heart",
							"data-live": e.live || void 0,
							children: /* @__PURE__ */ (0, L.jsx)(hy, {})
						}),
						/* @__PURE__ */ (0, L.jsxs)("span", {
							className: "hd-label ow-label",
							children: [/* @__PURE__ */ (0, L.jsx)("span", {
								className: "hd-label-long",
								children: "Heart rate"
							}), /* @__PURE__ */ (0, L.jsx)("span", {
								className: "hd-label-short",
								children: "Heart"
							})]
						}),
						/* @__PURE__ */ (0, L.jsxs)("span", {
							className: "ow-value hd-metric-v",
							children: [yi(m), /* @__PURE__ */ (0, L.jsx)("small", { children: "bpm" })]
						})
					]
				}),
				h != null && /* @__PURE__ */ (0, L.jsxs)("span", {
					className: "hd-metric ow-metric ow-metric--oxygen",
					children: [/* @__PURE__ */ (0, L.jsx)("span", {
						className: "hd-label ow-label",
						children: "Oxygen"
					}), /* @__PURE__ */ (0, L.jsxs)("span", {
						className: "ow-value hd-metric-v",
						children: [bi(h), /* @__PURE__ */ (0, L.jsxs)("small", { children: ["%", /* @__PURE__ */ (0, L.jsx)("span", {
							className: "ow-compact-unit",
							children: " O₂"
						})] })]
					})]
				}),
				m == null && h == null && /* @__PURE__ */ (0, L.jsx)("span", {
					className: "hd-none",
					children: "Waiting…"
				})
			]
		})]
	}), I = t?.heartRate ? xi(t.heartRate) : null, oe = t?.oxygen ? xi(t.oxygen) : null, se = (e, t) => Gt(e.min, e.max, (e) => `${Math.round(e)}${t}`), ce = [...v, ...y];
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: c,
		name: e.name,
		attrs: {
			"data-state": g ? "unavailable" : p ?? "unknown",
			"data-stale": b ? "true" : void 0,
			..._
		},
		level: x,
		glyph: /* @__PURE__ */ (0, L.jsx)(my, { off: g }),
		unavailable: g,
		lastSeen: e.lastSeen,
		unavailableWord: e.charging ? pi : void 0,
		onOpen: a,
		status: te,
		value: re,
		alert: ie,
		warning: C && si.has(C) ? wi[C] : w,
		bareValue: g ? ne : A || "Waiting…",
		onClose: o,
		urgent: S ? /* @__PURE__ */ (0, L.jsx)(Mf, {
			alert: wi[S],
			more: v.length > 1 ? v.slice(1).map((e) => wi[e]).join(" · ") : void 0,
			value: E
		}) : void 0,
		control: u || !a ? /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: N,
			children: ae
		}) : /* @__PURE__ */ (0, L.jsx)(Lf, {
			label: `${e.name}: ${N}`,
			onOpen: a,
			children: ae
		}),
		facts: {
			start: g ? sf(e.lastSeen) : df(e.lastUpdated, e.live),
			end: g && e.charging ? pi : ""
		},
		children: [
			u && ce.length > 0 && /* @__PURE__ */ (0, L.jsxs)("section", {
				className: "ow-alerts",
				"aria-labelledby": `${l}-a`,
				children: [/* @__PURE__ */ (0, L.jsx)("h3", {
					className: "hd-blk-h",
					id: `${l}-a`,
					children: "Alerts"
				}), /* @__PURE__ */ (0, L.jsx)("ul", { children: ce.map((t) => /* @__PURE__ */ (0, L.jsx)("li", { children: /* @__PURE__ */ (0, L.jsx)(Af, {
					label: `${Ci.has(t) ? "Alert" : "Warning"}: ${e.name}: ${Ti[t]}`,
					level: ci([t]),
					children: Ti[t]
				}) }, t)) })]
			}),
			u && e.baseOn != null && s && /* @__PURE__ */ (0, L.jsxs)("section", {
				className: "hd-blk ow-base",
				"aria-labelledby": `${l}-b`,
				children: [/* @__PURE__ */ (0, L.jsx)("h3", {
					className: "hd-blk-h",
					id: `${l}-b`,
					children: "Base station"
				}), /* @__PURE__ */ (0, L.jsx)(Nf, {
					label: `Base station: ${e.baseOn ? "On · Turn off" : "Off · Turn on"}`,
					on: e.baseOn,
					onToggle: s,
					extra: e.baseOn ? "Turn off" : "Turn on",
					children: e.baseOn ? "On" : "Off"
				})]
			}),
			t && /* @__PURE__ */ (0, L.jsx)(dp, {
				title: u ? "Sleep today" : "Today",
				samples: t.sleep,
				currentHour: t.currentHour,
				summary: Ut("asleep", t.asleepMinutes)
			}),
			/* @__PURE__ */ (0, L.jsxs)(lp, { children: [I && /* @__PURE__ */ (0, L.jsx)(Xf, {
				title: "Heart rate today",
				samples: I.samples,
				currentHour: t.currentHour,
				summary: se(I, " bpm")
			}), oe && /* @__PURE__ */ (0, L.jsx)(Xf, {
				title: "Oxygen today",
				samples: oe.samples,
				currentHour: t.currentHour,
				summary: se(oe, "%")
			})] })
		]
	});
}
// src/skins/orb/cards/owlet/OwletTile.tsx
var _y = ap(gy, ip(gy));
// src/skins/orb/ha/HaOwletTile.tsx
function vy({ entityId: e, heartRateEntityId: t, oxygenEntityId: n, chargingEntityId: r, baseEntityId: i, alertEntityIds: a, name: o, area: s, lastSeen: c, history: l, loadHistory: u, staleAfterMinutes: d, onActionError: f, ...p }) {
	let m = Fi(e, {
		heartRateEntityId: t,
		oxygenEntityId: n,
		chargingEntityId: r,
		baseEntityId: i,
		alertEntityIds: a,
		name: o,
		area: s,
		lastSeen: c,
		history: l,
		loadHistory: u,
		staleAfterMinutes: d,
		onActionError: f
	});
	return /* @__PURE__ */ (0, L.jsx)(_y, {
		...p,
		entity: m.entity,
		history: m.history,
		...m.actions
	});
}
// packages/core/src/entities/humidifier/labels.ts
var yy = {
	humidifying: "Humidifying",
	drying: "Drying",
	idle: "Idle",
	off: "Off"
}, by = (e) => String(Math.round(e)), xy = (e) => e.charAt(0).toUpperCase() + e.slice(1).replace(/_/g, " "), Sy = (e) => e === "dehumidifier" ? "Dehumidifier" : "Humidifier", Cy = (e, t = !1) => t ? Sy(e.kind) : `${Sy(e.kind)} · ${by(e.minHumidity)}–${by(e.maxHumidity)}%`, wy = (e) => e === "dehumidifier" ? "Dry to" : "Humidify to", Ty = {
	fill: "none",
	stroke: "currentColor"
};
function Ey({ kind: e = "humidifier" }) {
	return e === "dehumidifier" ? /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...Ty,
		children: [
			/* @__PURE__ */ (0, L.jsx)("rect", {
				x: "4.5",
				y: "2.5",
				width: "11",
				height: "15",
				rx: "1.5"
			}),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M7.5 5.5h5M7.5 7.5h5" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M10 10.3s2 2.1 2 3.5a2 2 0 0 1-4 0c0-1.4 2-3.5 2-3.5Z" })
		]
	}) : /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		...Ty,
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M5.5 10h9v6.5a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5Z" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M8.5 13.5h3" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M7.5 7.5c-.9-.9-.9-1.8 0-2.7s.9-1.8 0-2.7M12.5 7.5c-.9-.9-.9-1.8 0-2.7s.9-1.8 0-2.7" })
		]
	});
}
// src/skins/orb/cards/humidifier/HumidifierCard.tsx
var Dy = 1;
function Oy({ entity: e, history: t, variant: n, footprint: r, showControl: i, onToggle: a, onTargetChange: o, onModeChange: s, onOpenDetails: c, onClose: l }) {
	let u = Sf("hu", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: d, sheet: f, compact: p, area: m } = u, h = e.state === "unavailable", g = e.state === "on", _ = Cf("state", 0), v = h ? void 0 : e.currentHumidity, y = g ? e.targetHumidity : void 0, b = g ? e.action : void 0, x = h ? [] : [v == null ? null : p ? `${by(v)}%` : mf(`${by(v)}%`), b ? yy[b] : g ? null : yy.off].filter(Boolean), S = x.length ? x.join(" · ") : h ? m ?? "Unavailable" : m, C = h ? "Unavailable" : g ? y == null ? e.mode ? xy(e.mode) : "On" : `${wy(e.kind)} ${by(y)}%` : "Off", w;
	if (!g) w = /* @__PURE__ */ (0, L.jsx)(Nf, {
		label: `${e.name}: Off, turn on`,
		on: !1,
		onToggle: a,
		turnOn: !0,
		children: "Turn on"
	});
	else if (y != null && o) w = /* @__PURE__ */ (0, L.jsx)(Vf, {
		label: `${e.name} target humidity`,
		kicker: p ? void 0 : wy(e.kind),
		value: y,
		unit: "%",
		format: by,
		min: e.minHumidity,
		max: e.maxHumidity,
		step: Dy,
		onChange: o
	});
	else {
		let t = y == null ? "On" : `${by(y)}%`, n = e.mode ? xy(e.mode) : void 0;
		w = /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: `${e.name}: ${t}${n ? ` · ${n}` : ""}`,
			on: !0,
			onToggle: a,
			extra: n,
			children: t
		});
	}
	let T = v == null ? C : `${by(v)}% · ${C}`;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: u,
		name: e.name,
		attrs: {
			"data-state": e.state,
			"data-action": b ?? (g ? "on" : "off"),
			..._
		},
		orb: {
			label: e.name,
			pressed: g,
			intensity: .7,
			onToggle: a,
			children: /* @__PURE__ */ (0, L.jsx)(Ey, { kind: e.kind })
		},
		unavailable: h,
		lastSeen: e.lastSeen,
		onOpen: c,
		status: f && m && S !== m && !h ? `${m} · ${S}` : S,
		value: T,
		bareValue: C,
		readout: { value: v == null ? null : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [by(v), /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) },
		onClose: l,
		control: w,
		facts: {
			start: h ? sf(e.lastSeen) : uf(e.lastChanged),
			end: Cy(e, h)
		},
		children: [!h && s && e.modes && e.modes.length > 1 && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsx)(Qf, {
			id: `${d}-m`,
			label: "Mode",
			options: e.modes.map((e) => ({
				value: e,
				label: xy(e)
			})),
			value: e.mode,
			onChange: s
		}) }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut("on", t.onMinutes)
		})]
	});
}
// src/skins/orb/cards/humidifier/HumidifierTile.tsx
var ky = ap(Oy, ip(Oy));
// src/skins/orb/ha/HaHumidifierTile.tsx
function Ay({ entityId: e, name: t, area: n, lastSeen: r, history: i, loadHistory: a, onActionError: o, ...s }) {
	let c = Ui(e, {
		name: t,
		area: n,
		lastSeen: r,
		history: i,
		loadHistory: a,
		onActionError: o
	});
	return /* @__PURE__ */ (0, L.jsx)(ky, {
		...s,
		entity: c.entity,
		history: c.history,
		...c.actions
	});
}
// packages/core/src/entities/sound/words.ts
var jy = (e) => e.state === "unavailable" ? "Unavailable" : e.state === "on" ? "Ein" : "Aus", My = (e) => e.volume == null ? "On / off" : "On / off, volume", Ny = (e) => e.state === "on" ? void 0 : jy(e), Py = "sound off";
// src/skins/orb/cards/sound/icons.tsx
function Fy() {
	return /* @__PURE__ */ (0, L.jsxs)("svg", {
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		fill: "none",
		stroke: "currentColor",
		children: [
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M3.8 8h2.7l3.6-3v10l-3.6-3H3.8Z" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M13 7.6a3.4 3.4 0 0 1 0 4.8" }),
			/* @__PURE__ */ (0, L.jsx)("path", { d: "M15.2 5.4a6.5 6.5 0 0 1 0 9.2" })
		]
	});
}
// src/skins/orb/cards/sound/parts.tsx
function Iy({ id: e, value: t, on: n, onChange: r }) {
	return /* @__PURE__ */ (0, L.jsx)(Gf, {
		id: e,
		heading: Nm,
		value: t,
		min: 0,
		max: 100,
		on: n,
		text: (e) => `${e}%`,
		offText: (e) => Pm(e, Ny({ state: "off" })),
		valueText: (e) => Fm(e, n ? void 0 : Py),
		onChange: r
	});
}
// src/skins/orb/cards/sound/SoundCard.tsx
function Ly({ entity: e, history: t, variant: n, footprint: r, showControl: i, onToggle: a, onVolumeChange: o, onOpenDetails: s, onClose: c }) {
	let l = Sf("sn", {
		variant: n,
		footprint: r,
		showControl: i,
		area: e.area
	}), { uid: u, sheet: d, area: f } = l, p = e.state === "unavailable", m = e.state === "on", h = Cf("state", 0), g = jy(e), _ = m ? lf(e.lastChanged) : "Turn on", v = !p && e.volume != null ? Pm(e.volume) : null, y = p ? e.lastSeen : e.lastChanged;
	return /* @__PURE__ */ (0, L.jsxs)(cp, {
		card: l,
		name: e.name,
		attrs: {
			"data-state": e.state,
			...h
		},
		orb: {
			label: e.name,
			pressed: m,
			intensity: .7,
			onToggle: a,
			children: /* @__PURE__ */ (0, L.jsx)(Fy, {})
		},
		unavailable: p,
		lastSeen: e.lastSeen,
		onOpen: s,
		status: f ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [f, v && /* @__PURE__ */ (0, L.jsxs)("span", {
			className: "sn-vol",
			children: [" · ", v]
		})] }) : !d && (v ?? lf(y) ?? null),
		statusTitle: f,
		value: g,
		readout: e.volume != null && !p ? { value: /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [e.volume, /* @__PURE__ */ (0, L.jsx)("span", { children: "%" })] }) } : {
			value: p ? null : g,
			duplicate: !0,
			word: !0
		},
		onClose: c,
		control: /* @__PURE__ */ (0, L.jsx)(Nf, {
			label: `${e.name}: ${g}${_ ? ` · ${_}` : ""}`,
			on: m,
			onToggle: a,
			extra: _,
			children: g
		}),
		facts: {
			start: p ? sf(e.lastSeen) : uf(e.lastChanged),
			end: p ? "" : My(e)
		},
		children: [!p && e.volume != null && o && /* @__PURE__ */ (0, L.jsx)(lp, { children: /* @__PURE__ */ (0, L.jsx)(Iy, {
			id: `${u}-vol`,
			value: e.volume,
			on: m,
			onChange: o
		}) }), t && /* @__PURE__ */ (0, L.jsx)(dp, {
			samples: t.samples,
			currentHour: t.currentHour,
			summary: Ut("on", t.onMinutes)
		})]
	});
}
// src/skins/orb/cards/sound/SoundTile.tsx
var Ry = ap(Ly, ip(Ly));
// src/skins/orb/ha/HaSoundTile.tsx
function zy({ entityId: e, volumeEntityId: t, name: n, area: r, lastSeen: i, history: a, loadHistory: o, onActionError: s, ...c }) {
	let l = Ji(e, {
		volumeEntityId: t,
		name: n,
		area: r,
		lastSeen: i,
		history: a,
		loadHistory: o,
		onActionError: s
	});
	return /* @__PURE__ */ (0, L.jsx)(Ry, {
		...c,
		entity: l.entity,
		history: l.history,
		...l.actions
	});
}
// src/skins/orb/lovelace/ActionStatus.tsx
function By() {
	let e = $c();
	if (!e) return null;
	let { title: t, detail: n, canRetry: r, retrying: i } = e;
	return /* @__PURE__ */ (0, L.jsx)("div", {
		className: "ha-action-dock",
		children: /* @__PURE__ */ (0, L.jsxs)("div", {
			className: "ha-action",
			role: "alert",
			"aria-label": "Home Assistant action failed",
			children: [
				/* @__PURE__ */ (0, L.jsx)("span", {
					className: "ha-action-i",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, L.jsxs)("svg", {
						viewBox: "0 0 18 18",
						children: [/* @__PURE__ */ (0, L.jsx)("path", { d: "M9 2.25 16 15H2L9 2.25Z" }), /* @__PURE__ */ (0, L.jsx)("path", { d: "M9 6.5v4M9 13h.01" })]
					})
				}),
				/* @__PURE__ */ (0, L.jsxs)("span", {
					className: "ha-action-copy",
					children: [/* @__PURE__ */ (0, L.jsx)("strong", { children: t }), /* @__PURE__ */ (0, L.jsx)("span", { children: n })]
				}),
				/* @__PURE__ */ (0, L.jsxs)("span", {
					className: "ha-action-buttons",
					children: [r && /* @__PURE__ */ (0, L.jsx)("button", {
						type: "button",
						className: "hd-btn ha-action-b",
						disabled: i,
						onClick: e.retry,
						children: i ? "Retrying…" : "Retry"
					}), /* @__PURE__ */ (0, L.jsx)("button", {
						type: "button",
						className: "hd-btn ha-action-b",
						onClick: e.dismiss,
						children: "Dismiss"
					})]
				})
			]
		})
	});
}
// src/skins/orb/lovelace/ConfigDashboard.tsx
var Vy = (0, I.createContext)({
	stills: !0,
	quiet: !1
});
function Hy({ card: e }) {
	let { stills: t, quiet: n } = (0, I.useContext)(Vy);
	return /* @__PURE__ */ (0, L.jsx)(Mm, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		area: e.area,
		still: t && e.still !== !1,
		refresh: e.refresh,
		paused: n
	});
}
function Uy({ card: e }) {
	let { quiet: t } = (0, I.useContext)(Vy);
	return /* @__PURE__ */ (0, L.jsx)(_h, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		quiet: t
	});
}
function Wy({ card: e, sensor: t }) {
	return Cp(e.entity) === "numeric" ? Gy.numeric({
		...e,
		kind: "numeric"
	}) : t;
}
var Gy = {
	light: (e, t) => /* @__PURE__ */ (0, L.jsx)(l_, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area
	}, t),
	climate: (e, t) => /* @__PURE__ */ (0, L.jsx)(O_, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		unit: e.unit
	}, t),
	cover: (e, t) => /* @__PURE__ */ (0, L.jsx)(Nv, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		deviceClass: e.deviceClass
	}, t),
	sensor: (e, t) => {
		let n = /* @__PURE__ */ (0, L.jsx)(H_, {
			entityId: e.entity,
			name: e.name,
			footprint: e.footprint,
			showControl: e.showControl,
			loadHistory: e.history,
			area: e.area,
			humidityEntityId: e.humidity,
			batteryEntityId: e.battery,
			outdoor: e.outdoor,
			unit: e.unit
		}, t);
		return e.defaulted ? /* @__PURE__ */ (0, L.jsx)(Wy, {
			card: e,
			sensor: n
		}, t) : n;
	},
	weather: (e, t) => /* @__PURE__ */ (0, L.jsx)(Sv, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		aqiEntityId: e.aqi,
		aqiScale: e.aqiScale,
		sunEntityId: e.sun,
		loadForecasts: e.forecasts
	}, t),
	toggle: (e, t) => /* @__PURE__ */ (0, L.jsx)(Hv, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		icon: e.icon,
		description: e.description
	}, t),
	alarm: (e, t) => /* @__PURE__ */ (0, L.jsx)(fy, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		readOnly: e.readOnly,
		exitDelay: e.exitDelay,
		entryDelay: e.entryDelay,
		openSensors: e.openSensors
	}, t),
	owlet: (e, t) => /* @__PURE__ */ (0, L.jsx)(vy, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		heartRateEntityId: e.heartRate,
		oxygenEntityId: e.oxygen,
		chargingEntityId: e.charging,
		baseEntityId: e.baseStation,
		alertEntityIds: e.alerts,
		staleAfterMinutes: e.staleAfter
	}, t),
	humidifier: (e, t) => /* @__PURE__ */ (0, L.jsx)(Ay, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area
	}, t),
	sound: (e, t) => /* @__PURE__ */ (0, L.jsx)(zy, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		volumeEntityId: e.volume
	}, t),
	lock: (e, t) => /* @__PURE__ */ (0, L.jsx)(Jp, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		area: e.area,
		batteryEntityId: e.battery
	}, t),
	fan: (e, t) => /* @__PURE__ */ (0, L.jsx)(lm, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area
	}, t),
	guestWifi: (e, t) => /* @__PURE__ */ (0, L.jsx)(mm, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		area: e.area,
		access: e.access,
		network: e.network,
		qrEntityId: e.qr,
		newCodeEntityId: e.newCode,
		refreshEntityId: e.refresh
	}, t),
	binarySensor: (e, t) => /* @__PURE__ */ (0, L.jsx)(Sm, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		batteryEntityId: e.battery
	}, t),
	camera: (e, t) => /* @__PURE__ */ (0, L.jsx)(Hy, { card: e }, t),
	mediaPlayer: (e, t) => /* @__PURE__ */ (0, L.jsx)(Uy, { card: e }, t),
	numeric: (e, t) => /* @__PURE__ */ (0, L.jsx)(wh, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		unit: e.unit,
		warnAbove: e.warnAbove,
		warnBelow: e.warnBelow
	}, t),
	vacuum: (e, t) => /* @__PURE__ */ (0, L.jsx)(Jh, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area
	}, t),
	calendar: (e, t) => /* @__PURE__ */ (0, L.jsx)(eg, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		area: e.area,
		calendarEntityIds: e.calendars,
		days: e.days,
		loadEvents: e.events,
		loadHistory: e.history
	}, t),
	sun: (e, t) => /* @__PURE__ */ (0, L.jsx)(Eg, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area
	}, t),
	dyson: (e, t) => /* @__PURE__ */ (0, L.jsx)(Lg, {
		entityId: e.entity,
		name: e.name,
		footprint: e.footprint,
		showControl: e.showControl,
		loadHistory: e.history,
		area: e.area,
		companions: e.companions
	}, t)
};
function Ky(e, t) {
	return Mu(Gy, e, t);
}
function qy(e) {
	return e.kind === "joined" ? /* @__PURE__ */ (0, L.jsx)(Op, {
		label: e.label,
		children: e.members.map((e, t) => Ky(e, `${t}:${e.entity}`))
	}) : e.kind === "lead" ? /* @__PURE__ */ (0, L.jsx)(kp, {
		lead: Ky(e.lead),
		label: e.label,
		sheetTitle: e.sheetTitle,
		children: e.rows.map((e, t) => Ky(e, `${t}:${e.entity}`))
	}) : e.kind === "titled" ? /* @__PURE__ */ (0, L.jsx)(Ap, {
		title: e.title,
		area: e.area,
		children: e.rows.map((e, t) => Ky(e, `${t}:${e.entity}`))
	}) : Ky(e);
}
var Jy = {
	gap: 8,
	min: 156,
	preferred: 300,
	max: 12
}, Yy = {
	compact: 1,
	standard: 2,
	featured: 4
};
function Xy(e, t) {
	return e.kind === "joined" ? Dp(e.members.length, t) : e.kind === "lead" ? Yy.standard + e.rows.length : e.kind === "titled" ? 1 + e.rows.length : Yy[e.footprint ?? "standard"];
}
function Zy({ row: e, id: t }) {
	let n = Tp(e, Jy, Xy), r = Qy(e), i = (e, t) => `${t}:${"entity" in e.item ? e.item.entity : e.item.kind}`, a = r && n.anchored ? /* @__PURE__ */ (0, L.jsx)("div", {
		ref: n.ref,
		className: "dash-row dash-row--areas",
		"data-tracks": n.tracks,
		style: n.style,
		children: r.map((t, r) => {
			let a = e.cards.flatMap((e, t) => e.column === r + 1 ? [{
				entry: e,
				i: t
			}] : []);
			if (!a.length) return null;
			let o = /* @__PURE__ */ (0, L.jsx)("div", {
				className: "dash-row",
				"data-tracks": "1",
				style: { gridTemplateColumns: "minmax(0, 1fr)" },
				children: a.map(({ entry: e, i: t }) => /* @__PURE__ */ (0, L.jsx)("div", {
					className: "dash-place",
					style: { gridRow: `${n.cells[t]?.row ?? 1} / span ${n.cells[t]?.height ?? 1}` },
					children: qy(e.item)
				}, i(e, t)))
			});
			return t ? /* @__PURE__ */ (0, L.jsxs)("section", {
				className: "dash-sec dash-col",
				style: { gridColumn: r + 1 },
				"aria-label": t,
				children: [/* @__PURE__ */ (0, L.jsx)("h2", {
					className: "dash-sec-h",
					title: t,
					children: t
				}), /* @__PURE__ */ (0, L.jsx)(bf.Provider, {
					value: t,
					children: /* @__PURE__ */ (0, L.jsx)(vf.Provider, {
						value: 3,
						children: o
					})
				})]
			}, r) : /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "dash-sec dash-col",
				style: { gridColumn: r + 1 },
				children: [/* @__PURE__ */ (0, L.jsx)("div", {
					className: "dash-sec-h",
					"aria-hidden": "true",
					children: "\xA0"
				}), o]
			}, r);
		})
	}) : /* @__PURE__ */ (0, L.jsx)("div", {
		ref: n.ref,
		className: "dash-row",
		"data-tracks": n.tracks,
		style: n.style,
		children: e.cards.map((e, t) => /* @__PURE__ */ (0, L.jsx)("div", {
			className: "dash-place",
			style: n.cells[t]?.style,
			children: qy(e.item)
		}, i(e, t)))
	});
	return e.title ? /* @__PURE__ */ (0, L.jsxs)("section", {
		id: t,
		"data-section-id": t,
		className: "dash-sec",
		"aria-label": e.title,
		children: [/* @__PURE__ */ (0, L.jsxs)("h2", {
			className: "dash-sec-h",
			children: [e.title, e.note && /* @__PURE__ */ (0, L.jsx)("small", { children: e.note })]
		}), /* @__PURE__ */ (0, L.jsx)(vf.Provider, {
			value: 3,
			children: a
		})]
	}) : a;
}
function Qy(e) {
	let t = cr();
	return (0, I.useMemo)(() => Ul(e, (e) => {
		if (!("entity" in e)) return;
		if (e.area) return e.area;
		let n = t?.membership.get(e.entity);
		return n ? t?.areas.find((e) => e.id === n)?.name : void 0;
	}), [e, t]);
}
function $y(e) {
	let t = e.filter((e) => !!e.title), n = _p(t.map((e) => e.title));
	return {
		anchors: n,
		ids: new Map(t.map((e, t) => [e, n[t].id]))
	};
}
function eb({ config: e, panels: t, now: n, navigate: r }) {
	let i = (0, I.useRef)(null), a = (0, I.useMemo)(() => e.pages ?? [], [e.pages]), o = (0, I.useMemo)(() => a.map((e) => e.id), [a]), s = (0, I.useMemo)(() => $y(e.rows), [e.rows]), c = wp({
		items: (0, I.useMemo)(() => e.nav === !1 ? [] : vp({
			entries: e.nav,
			mainTitle: e.title,
			pages: a,
			sections: s.anchors,
			panels: t
		}), [
			e.nav,
			e.title,
			s,
			a,
			t
		]),
		pages: o,
		rootRef: i,
		navigate: r
	}), l = c.page === "home" ? void 0 : a.find((e) => e.id === c.page), u = c.buttons.length > 1 && (e.viewing !== "far" || Array.isArray(e.nav)), d = l?.rows ?? e.rows, f = l ? $y(l.rows).ids : s.ids, p = (0, I.useMemo)(() => ({
		stills: e.stills !== !1,
		quiet: e.quiet === !0
	}), [e.stills, e.quiet]);
	return /* @__PURE__ */ (0, L.jsx)(Vy.Provider, {
		value: p,
		children: /* @__PURE__ */ (0, L.jsxs)(pp, {
			pageRef: i,
			title: l?.title ?? e.title,
			subtitle: l ? void 0 : e.subtitle,
			showTime: e.showTime,
			hourCycle: e.hourCycle,
			viewing: e.viewing,
			now: n,
			nav: u ? /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)(By, {}), /* @__PURE__ */ (0, L.jsx)(hp, { items: c.buttons })] }) : void 0,
			children: [d.map((e, t) => /* @__PURE__ */ (0, L.jsx)(Zy, {
				row: e,
				id: f.get(e)
			}, `${l?.id ?? "home"}:${t}`)), !u && /* @__PURE__ */ (0, L.jsx)(By, {})]
		})
	});
}
// src/skins/orb/shared/surface.ts
var tb = "data-orb-theme", nb = "https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap", rb = {
	type: "rotapfel-simple-thermcard",
	name: "Rotapfel Simple ThermCard",
	description: "Soft, round cards read at a glance: every supported device in a room-by-room page, laid out for you and kept up to date.",
	documentationURL: "",
	icon: "mdi:home-variant",
	card: "custom:rotapfel-simple-thermcard",
	options: [
		"viewing",
		"theme",
		"layout"
	]
}, ib = "rotapfel-simple-thermcard", ab = "\n:host { display: block; height: 100%; }\n.ha-surface { min-height: 0 !important; background: transparent !important; background-image: none !important; }\n.dash[data-nav] { min-height: calc(100dvh - var(--header-height, 56px)); }\n.dash { --dash-scroll-offset: calc(var(--header-height, 56px) + var(--safe-area-inset-top, 0px)); }\n.hd-config-error { margin: 16px; padding: 16px; border-radius: 16px; background: var(--card-solid); color: var(--ink); font: 500 14px/1.5 var(--font); white-space: pre-wrap; }\n";
function ob(e) {
	let t = Zc(e) + ab;
	return class e extends Yc {
		styles = t;
		mountClass = "ha-surface";
		fontHref = nb;
		#e;
		setConfig(e) {
			this.#e = void 0, super.setConfig(e);
		}
		static getStubConfig(t) {
			return tu(Gc(t, e.heldEnergyPrefs(t)));
		}
		parse(e) {
			return rd(e);
		}
		changed(e, t) {
			return e.themes?.darkMode !== t.themes?.darkMode || e.panels !== t.panels || !this.config?.rows && this.#n(t);
		}
		paintHost(e, t) {
			let n = e.theme === "home-assistant" ? t.themes?.darkMode ? "dark" : "light" : e.theme;
			n === "auto" ? this.removeAttribute(tb) : this.setAttribute(tb, n), e.accent ? (this.style.setProperty("--brand-c", String(e.accent.chroma)), this.style.setProperty("--brand-h", String(e.accent.hue))) : (this.style.removeProperty("--brand-c"), this.style.removeProperty("--brand-h"));
		}
		draw(e, t) {
			return /* @__PURE__ */ (0, L.jsx)(eb, {
				config: {
					...e,
					rows: this.#r(e, t)
				},
				panels: t.panels
			});
		}
		#t(e) {
			return [
				e.entities,
				e.devices,
				e.areas,
				e.floors,
				Object.keys(e.states).length,
				this.energyPrefs(e)
			];
		}
		#n(e) {
			let t = this.#t(e);
			return !this.#e || this.#e.key.some((e, n) => e !== t[n]);
		}
		#r(e, t) {
			if (e.rows) return e.rows;
			if (this.#n(t)) {
				let n = rd({
					...tu(Gc(t, this.energyPrefs(t)), e.title, { layout: e.layout }),
					title: e.title
				});
				this.#e = {
					key: this.#t(t),
					rows: n.rows ?? []
				};
			}
			return this.#e.rows;
		}
	};
}
function sb(e) {
	Xc(ib, ob(e), "Rotapfel Simple ThermCard", "Rotapfel Simple ThermCard supports a whole page from one YAML card. Leave out `cards` and `rows` to lay the house out automatically; `layout: wall` lays it out one column per area.");
}
s("resource:entry"), sb(":root{--brand-c:.145;--brand-h:92;--bg-a:#e1e3e5;--bg-b:#f0eee6;--bg-c:#eae6d9;--card:#ffffff8f;--card-solid:#faf9f5;--card-edge:#ffffffd9;--ink:#1c1a17;--ink-2:#54524f;--ink-3:#6b6965;--line:#1c1a171a;--chip:#ffffffb8;--fill:#e8e6e0;--tick:#1c1a1747;--inv-bg:#1f1e1c;--inv-fg:#f6f5f2;--on-accent:#211c12;--warn:#a93800;--on-warn:#fefbf8;--accent-l:.89;--accent-strong-l:.76;--glow-a:.22;--shadow:0 1px 2px #332d230d, 0 18px 40px -24px #362c1c40;--btn:#fefdfb;--btn-shadow:inset 0 0 0 1px #1c1a171a, 0 1px 2px #332d231f, 0 3px 8px -3px #332d2329;--groove:#1c1a1711;--groove-shadow:inset 0 1px 2px #1c1a171a, inset 0 0 0 1px #1c1a170d;--font:\"Urbanist\", \"Instrument Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif;--ease-out:cubic-bezier(.23, 1, .32, 1);--ease-in-out:cubic-bezier(.77, 0, .175, 1);--ease-drawer:cubic-bezier(.32, .72, 0, 1);--ease:var(--ease-out);--press:.16s;--type-status:13.5px;--type-status-compact:12.5px;--type-status-leading:1.3;--type-caption:10.5px;--type-readout-weight:300;--type-cue:14px}@supports (color:lab(0% 0 0)){:root{--bg-a:lab(90.137% -.443637 -1.43197);--bg-b:lab(94.0299% -.30455 3.80756);--bg-c:lab(91.4088% -.504524 6.88474);--card:lab(100% 0 0/.56);--card-solid:lab(97.9496% -.18999 2.27957);--card-edge:lab(100% 0 0/.85);--ink:lab(9.53554% .377633 2.28434);--ink-2:lab(35.0569% .353932 2.26749);--ink-3:lab(44.3371% .350177 2.26504);--line:lab(9.53554% .377633 2.28434/.1);--chip:lab(100% 0 0/.72);--fill:lab(91.3377% .0836849 3.05647);--tick:lab(9.53554% .377633 2.28434/.28);--inv-bg:lab(11.271% .239909 1.51435);--inv-fg:lab(96.5452% -.128806 1.51825);--on-accent:lab(10.7354% 1.00211 7.76324);--warn:lab(40.678% 46.4402 54.8349);--on-warn:lab(98.8312% .835866 1.65983);--shadow:0 1px 2px lab(18.8394% 1.47951 7.80956/.05), 0 18px 40px -24px lab(18.8439% 2.48641 12.0393/.25);--btn:lab(99.439% -.097543 1.13807);--btn-shadow:inset 0 0 0 1px lab(9.53554% .377633 2.28434/.1), 0 1px 2px lab(18.8394% 1.47951 7.80956/.12), 0 3px 8px -3px lab(18.8394% 1.47951 7.80956/.16);--groove:lab(9.53554% .377633 2.28434/.065);--groove-shadow:inset 0 1px 2px lab(9.53554% .377633 2.28434/.1), inset 0 0 0 1px lab(9.53554% .377633 2.28434/.05)}}[data-viewing=far]{--type-status:15px;--type-status-compact:14px;--type-status-leading:1.2;--type-caption:12px;--type-readout-weight:400;--type-cue:16px}@media (prefers-color-scheme:dark){:root:not([data-orb-theme=light]){--bg-a:#0b0c0e;--bg-b:#12100d;--bg-c:#211e18;--card:#28262380;--card-solid:#1d1c19;--card-edge:#ffffff14;--ink:#f2f2ef;--ink-2:#b6b4b0;--ink-3:#969591;--line:#ffffff1a;--chip:#ffffff14;--fill:#34332f;--tick:#ffffff4d;--inv-bg:#efeeeb;--inv-fg:#171613;--on-accent:#211c12;--warn:#f9aa60;--on-warn:#211209;--accent-l:.87;--accent-strong-l:.84;--glow-a:.14;--shadow:0 18px 44px -24px #000000b3;--btn:#3e3d3a;--btn-shadow:inset 0 1px 0 #ffffff14, inset 0 0 0 1px #ffffff0f, 0 1px 2px #00000073, 0 3px 8px -3px #00000080;--groove:#0000002e;--groove-shadow:inset 0 1px 2px #0000004d, inset 0 0 0 1px #ffffff14;--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}@supports (color:lab(0% 0 0)){:root:not([data-orb-theme=light]){--bg-a:lab(3.36136% -.233673 -.832838);--bg-b:lab(4.86709% .0518113 2.0476);--bg-c:lab(11.3001% .483707 4.68526);--card:lab(15.3429% .192806 2.30244/.5);--card-solid:lab(10.1224% .20048 2.30813);--card-edge:lab(100% 0 0/.08);--ink:lab(95.3852% -.128776 1.51829);--ink-2:lab(73.351% -.00971556 2.29201);--ink-3:lab(61.7509% -.0077188 2.29332);--line:lab(100% 0 0/.1);--chip:lab(100% 0 0/.08);--fill:lab(21.1432% .186801 2.29812);--tick:lab(100% 0 0/.3);--inv-bg:lab(94.2252% -.128716 1.51831);--inv-fg:lab(7.24397% .154369 1.71363);--on-accent:lab(10.7354% 1.00211 7.76324);--warn:lab(76.3806% 25.0059 49.8107);--on-warn:lab(7.0753% 7.06377 6.92256);--shadow:0 18px 44px -24px lab(0% 0 0/.7);--btn:lab(25.7834% .18318 2.29557);--btn-shadow:inset 0 1px 0 lab(100% 0 0/.08), inset 0 0 0 1px lab(100% 0 0/.06), 0 1px 2px lab(0% 0 0/.45), 0 3px 8px -3px lab(0% 0 0/.5);--groove:lab(0% 0 0/.18);--groove-shadow:inset 0 1px 2px lab(0% 0 0/.3), inset 0 0 0 1px lab(100% 0 0/.08)}}}:root[data-orb-theme=dark]{--bg-a:#0b0c0e;--bg-b:#12100d;--bg-c:#211e18;--card:#28262380;--card-solid:#1d1c19;--card-edge:#ffffff14;--ink:#f2f2ef;--ink-2:#b6b4b0;--ink-3:#969591;--line:#ffffff1a;--chip:#ffffff14;--fill:#34332f;--tick:#ffffff4d;--inv-bg:#efeeeb;--inv-fg:#171613;--on-accent:#211c12;--warn:#f9aa60;--on-warn:#211209;--accent-l:.87;--accent-strong-l:.84;--glow-a:.14;--shadow:0 18px 44px -24px #000000b3;--btn:#3e3d3a;--btn-shadow:inset 0 1px 0 #ffffff14, inset 0 0 0 1px #ffffff0f, 0 1px 2px #00000073, 0 3px 8px -3px #00000080;--groove:#0000002e;--groove-shadow:inset 0 1px 2px #0000004d, inset 0 0 0 1px #ffffff14;--lightningcss-light: ;--lightningcss-dark:initial;color-scheme:dark}@supports (color:lab(0% 0 0)){:root[data-orb-theme=dark]{--bg-a:lab(3.36136% -.233673 -.832838);--bg-b:lab(4.86709% .0518113 2.0476);--bg-c:lab(11.3001% .483707 4.68526);--card:lab(15.3429% .192806 2.30244/.5);--card-solid:lab(10.1224% .20048 2.30813);--card-edge:lab(100% 0 0/.08);--ink:lab(95.3852% -.128776 1.51829);--ink-2:lab(73.351% -.00971556 2.29201);--ink-3:lab(61.7509% -.0077188 2.29332);--line:lab(100% 0 0/.1);--chip:lab(100% 0 0/.08);--fill:lab(21.1432% .186801 2.29812);--tick:lab(100% 0 0/.3);--inv-bg:lab(94.2252% -.128716 1.51831);--inv-fg:lab(7.24397% .154369 1.71363);--on-accent:lab(10.7354% 1.00211 7.76324);--warn:lab(76.3806% 25.0059 49.8107);--on-warn:lab(7.0753% 7.06377 6.92256);--shadow:0 18px 44px -24px lab(0% 0 0/.7);--btn:lab(25.7834% .18318 2.29557);--btn-shadow:inset 0 1px 0 lab(100% 0 0/.08), inset 0 0 0 1px lab(100% 0 0/.06), 0 1px 2px lab(0% 0 0/.45), 0 3px 8px -3px lab(0% 0 0/.5);--groove:lab(0% 0 0/.18);--groove-shadow:inset 0 1px 2px lab(0% 0 0/.3), inset 0 0 0 1px lab(100% 0 0/.08)}}:root[data-orb-theme=light]{--lightningcss-light:initial;--lightningcss-dark: ;color-scheme:light}html:has(>body.ha-surface){-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%;overscroll-behavior:none}.ha-surface{background:linear-gradient(140deg, var(--bg-a) 0%, var(--bg-b) 48%, var(--bg-c) 100%) fixed, var(--bg-b);min-height:100%;color:var(--ink);font-family:var(--font);-webkit-font-smoothing:antialiased;font-size:15px;line-height:1.45}.hd-c{--hd-unit:60px;--hd-gap:8px;--hd-standard:104px;--hd-featured:264px;min-width:0;container:hd/inline-size}.hd{--accent:oklch(var(--accent-l) var(--brand-c) var(--brand-h));--accent-strong:oklch(var(--accent-strong-l) var(--brand-c) var(--brand-h));--pad:10px;--read-icon:22px;--head-gap:12px;--read-indent:calc(var(--read-icon) + var(--head-gap));--pad-in:16px;--inset:4px;--slot-h:44px;box-sizing:border-box;grid-template-rows:minmax(0, 1fr) var(--slot-h);gap:var(--hd-gap);height:var(--hd-standard);padding:var(--pad);isolation:isolate;background:var(--card);-webkit-backdrop-filter:blur(22px)saturate(1.15);box-shadow:inset 0 0 0 1px var(--card-edge), var(--shadow);color:var(--ink);font-family:var(--font);-webkit-tap-highlight-color:transparent;border-radius:24px;font-size:15px;line-height:1.45;display:grid;position:relative}.hd:before{content:\"\";z-index:-1;border-radius:inherit;pointer-events:none;background:radial-gradient(circle at calc(var(--pad) + 22px) calc(var(--pad) + 22px), oklch(var(--accent-l) var(--brand-c) var(--brand-h) / var(--glow-a)), transparent min(90cqi, 360px));opacity:calc(var(--hd-glow,0) * var(--glow-damp,1));transition:opacity .3s var(--ease-out);position:absolute;inset:0}.hd *,.hd :before,.hd :after{box-sizing:border-box}.hd--compact:before{opacity:0}.hd :is(button,[role=button],input),.hd-sheet :is(button,input){-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.hd button,.hd-sheet button{touch-action:manipulation}.hd p{margin:0}.hd-head{align-content:center;align-items:center;column-gap:var(--head-gap);grid-template-columns:auto minmax(0,1fr);grid-template-areas:\"orb title\";display:grid;position:relative}.hd-head>.hd-orb{grid-area:orb}.hd-head>.hd-orb:not(.hd-orb--static){z-index:1;position:relative}.hd-title{grid-area:title;min-width:0}.hd-head>.hd-circ{grid-area:open}.hd-num{font-size:clamp(32px,7cqi,44px);font-weight:var(--type-readout-weight);letter-spacing:-.035em;font-variant-numeric:tabular-nums;white-space:nowrap;grid-area:num;line-height:1;display:none}.hd-num span{letter-spacing:0;color:var(--ink-2);margin-left:2px;font-size:.48em}.hd:is([data-state=off],[data-state=unknown]) .hd-num{color:var(--ink-3)}.hd-num--word{letter-spacing:-.02em;font-size:clamp(28px,6cqi,38px)}.hd .hd-num.hd-num--long{letter-spacing:-.02em;text-overflow:ellipsis;white-space:nowrap;min-width:0;font-size:clamp(26px,5.4cqi,34px);line-height:1.25;overflow:hidden}.hd--sheet.hd .hd-num:is(.hd-num--word,.hd-num--long){letter-spacing:-.02em;font-size:30px}.hd-name{letter-spacing:-.01em;min-width:0;margin:0;font-size:clamp(16px,4.6cqi,19px);font-weight:600;line-height:1.2;display:flex}.hd-name>span,.hd-open>span:first-child,.hd-pill-w{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.hd-area{font-size:var(--type-status);color:var(--ink-2);font-weight:500;line-height:var(--type-status-leading);text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums;overflow:hidden;margin-top:3px!important}.hd-sub{display:none}.hd-area:empty:before{content:\" \"}.hd--compact .hd-area:empty{display:none}.hd-open{min-width:0;color:inherit;font:inherit;letter-spacing:inherit;text-align:left;cursor:pointer;transition:opacity var(--press) var(--ease-out);background:0 0;border:0;border-radius:6px;align-items:center;gap:2px;margin:0;padding:0;display:flex}.hd-open:after{content:\"\";position:absolute;inset-block:min(0px,50% - 22px);inset-inline:0}.hd-open:active{opacity:.6}.hd-open:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.hd-chev{width:.8em;height:.8em;color:var(--ink-3);fill:none;stroke:currentColor;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round;transition:color .15s var(--ease-out), translate .16s var(--ease-out);flex:none}@media (hover:hover) and (pointer:fine){.hd-open:hover .hd-chev{color:var(--ink);translate:2px}}@container hd (width<=185px){.hd-chev{display:none}}@container hd (width<=219px){.hd-sub-optional{display:none}}.hd-circ{width:44px;height:44px;color:var(--ink);cursor:pointer;background:0 0;border:0;border-radius:50%;flex:none;place-items:center;margin:-3px -4px -3px 0;padding:0;display:grid}.hd-circ-i{background:var(--btn);width:36px;height:36px;box-shadow:var(--btn-shadow);transition:background-color .15s var(--ease-out), scale var(--press) var(--ease-out);border-radius:50%;place-items:center;display:grid}.hd-circ:active .hd-circ-i{scale:.92}.hd-circ svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:16px;height:16px}.hd-circ:focus-visible{outline:none}.hd-circ:focus-visible .hd-circ-i{outline:2px solid var(--ink);outline-offset:2px}@media (hover:hover) and (pointer:fine){.hd-circ:hover .hd-circ-i{background:color-mix(in oklab, var(--btn) 94%, var(--ink))}}.hd-orb{--sz:40px;--b:1;width:44px;height:44px;color:var(--ink);cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:manipulation;background:0 0;border:0;border-radius:50%;flex:none;place-items:center;padding:0;display:grid}.hd-orb-i{width:var(--sz);height:var(--sz);background:var(--btn);box-shadow:var(--btn-shadow);transition:background-color .2s var(--ease-out), box-shadow .2s var(--ease-out), scale var(--press) var(--ease-out);border-radius:50%;place-items:center;display:grid}.hd-orb:active .hd-orb-i{scale:.94}.hd-orb[data-holding] .hd-orb-i{transition:scale .45s linear, background-color .2s var(--ease-out), box-shadow .2s var(--ease-out);scale:.88}.hd-orb[aria-disabled=true]:active .hd-orb-i{scale:1}.hd-orb svg{fill:none;stroke:currentColor;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;width:52%;height:52%}.hd-orb[aria-pressed=true]{color:var(--on-accent)}.hd-orb[aria-pressed=true] .hd-orb-i{background:var(--accent);box-shadow:0 0 0 1px oklch(var(--accent-strong-l) var(--brand-c) var(--brand-h) / .5), 0 4px calc(8px + 16px * var(--b)) calc(-2px + 2px * var(--b)) oklch(var(--accent-strong-l) var(--brand-c) var(--brand-h) / calc(.25 + .35 * var(--b)))}.hd[data-role=state] .hd-orb[aria-pressed=true] .hd-orb-i,.hd--compact .hd-orb[aria-pressed=true] .hd-orb-i{box-shadow:none}.hd-orb[aria-disabled=true]{cursor:default;color:var(--ink-3)}.hd-orb[aria-disabled=true] .hd-orb-i{box-shadow:none;outline:1.5px dashed var(--ink-3);outline-offset:-1.5px;background:0 0}.hd-orb:focus-visible{outline:none}.hd-orb:focus-visible .hd-orb-i{outline:2px solid var(--ink);outline-offset:3px}.hd-orb--sm{--sz:34px}.hd-orb--static{cursor:default;color:var(--ink)}.hd-orb--static .hd-orb-i{box-shadow:none;background:0 0}.hd[data-role=reading]:not(.hd--compact) .hd-orb--static:not([aria-disabled=true]),.hd[data-role=reading]:not(.hd--compact) .hd-orb--static:not([aria-disabled=true]) .hd-orb-i{width:var(--read-icon)}.hd[data-role=reading]:not(.hd--compact) .hd-orb--static:not([aria-disabled=true]) svg{width:100%}.hd--featured[data-role=reading]:not(.hd--sheet) .hd-head{grid-template-columns:auto minmax(0,1fr);grid-template-areas:\"orb title\"}.hd--featured[data-role=reading]:not(.hd--sheet) .hd-num{display:none}.hd-warn{color:var(--warn);font-weight:600}.hd-alert-cue{width:var(--type-cue);height:var(--type-cue);color:var(--warn);vertical-align:-2px;place-items:center;margin-inline-end:5px;display:inline-grid}.hd-alert-cue svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:100%;height:100%}.hd-alert-cue[data-level=urgent] circle{fill:currentColor}.hd-alert-cue[data-level=urgent] path{stroke:var(--on-warn);stroke-width:1.8px}.hd-slot{min-width:0;display:grid}.hd-pill,.hd-unav{height:var(--slot-h);border-radius:99px}.hd-pill{width:100%;min-width:0;padding:0 var(--pad-in);cursor:pointer;text-align:left;background:var(--btn);box-shadow:var(--btn-shadow);color:var(--ink);font:600 14px var(--font);white-space:nowrap;transition:background-color .2s var(--ease-out), color .2s var(--ease-out), box-shadow .2s var(--ease-out), scale var(--press) var(--ease-out);border:0;justify-content:space-between;align-items:center;gap:12px;display:flex;overflow:hidden}.hd-pill:active{scale:.98}.hd-pill[aria-pressed=true]{background:var(--accent);color:var(--on-accent);box-shadow:none}.hd-pill:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.hd-btn:disabled,.hd-btn:disabled>span{box-shadow:none;color:var(--ink-3);cursor:default;background:0 0}.hd-btn:disabled:active,.hd-btn:disabled:active>span{scale:1}.hd-pill--turn-on{background:color-mix(in oklab, var(--btn) 45%, var(--card-solid));justify-content:center}.hd-pill-x{text-overflow:ellipsis;flex-shrink:1000;font-weight:500;display:none;overflow:hidden}.hd-pill-x[data-action]{flex:none}.hd-said{display:none}@container hd (width<=259px){.hd-pill:has(>.hd-pill-x[data-action])>.hd-pill-w{display:none}.hd-pill-x[data-action]{font-weight:inherit;display:inline}.hd-said{display:inline}:is(.hd--compact,.hd--sheet) .hd-pill:has(>.hd-pill-x[data-action])>.hd-pill-w{display:inline}:is(.hd--compact,.hd--sheet) .hd-pill-x[data-action]{font-weight:500}:is(.hd--compact,.hd--sheet) .hd-said{display:none}}.hd-unav{padding:0 var(--pad-in);outline:1.5px dashed var(--ink-3);outline-offset:-1.5px;color:var(--ink-3);white-space:nowrap;justify-content:space-between;align-items:center;gap:12px;font-size:13.5px;font-weight:600;display:flex;overflow:hidden}.hd-unav-t{font-weight:500;display:none}.hd-time{white-space:pre;display:inline-block}.hd-alarm{isolation:isolate;min-width:0;height:var(--slot-h);background:var(--warn);color:var(--on-warn);font-variant-numeric:tabular-nums;white-space:nowrap;border-radius:99px;align-items:center;gap:12px;padding:0 16px;display:flex;position:relative}.hd-alarm:before{content:\"\";z-index:-1;border-radius:inherit;pointer-events:none;background:color-mix(in oklab, var(--warn) 78%, var(--ink));opacity:0;animation:hd-alarm 1.4s var(--ease-in-out) infinite alternate;position:absolute;inset:0}@keyframes hd-alarm{to{opacity:1}}@media (prefers-reduced-motion:reduce){.hd-alarm:before{animation:none}}.hd-alarm-l{text-overflow:ellipsis;flex:1;min-width:0;font-size:14px;overflow:hidden}.hd-alarm-l b{font-weight:700}.hd-alarm-v{flex:none;font-size:14px;font-weight:700}@container hd (width<=259px){.hd-alarm-c{display:none}}@container hd (width<=179px){.hd-alarm-v{display:none}}.hd--compact .hd-alarm{gap:8px;padding:0 10px}.hd--compact .hd-alarm-l,.hd--compact .hd-alarm-v{font-size:12.5px}.hd--compact .hd-alarm-c{display:none}.hd-alarm[data-action]{padding-right:var(--inset)}.hd--compact .hd-alarm[data-action] .hd-alarm-v{display:none}.hd-st{height:var(--slot-h);min-width:0;padding:0 var(--pad-in);color:var(--ink-2);white-space:nowrap;text-overflow:ellipsis;align-items:center;margin:0;font-size:15px;font-weight:600;display:flex;overflow:hidden}.hd--compact .hd-st{justify-content:flex-end;font-size:13px}.hd-acts{grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:8px;display:grid}.hd-read{min-width:0;color:inherit;font:inherit;text-align:left;background:0 0;border:0;border-radius:99px;padding:0;display:grid}button.hd-read{cursor:pointer}button.hd-read:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.hd-read-i{transition:scale var(--press) var(--ease-out)}button.hd-read:active .hd-read-i{scale:.98}.hd-bar{min-width:0;height:var(--slot-h);color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap;align-items:center;display:grid}.hd:not(.hd--compact) .hd-bar--pair{--pair-gap:12px;--pair-share:.325;--pair-min:44px;align-content:flex-start;align-items:center;column-gap:var(--pair-gap);contain:inline-size;flex-wrap:wrap;display:flex;overflow:hidden}.hd:not(.hd--compact) .hd-bar--pair:before{content:\"\";width:0;height:100%;flex:none;margin-inline-end:calc(-1 * var(--pair-gap))}.hd:not(.hd--compact) .hd-bar--pair>*{flex:auto}.hd:not(.hd--compact) .hd-bar--pair>.hd-metric--sub{min-width:max(var(--pair-min), (100% - var(--pair-gap)) * var(--pair-share));flex:none}.hd-metric{min-width:0}.hd-metric:only-child{grid-column:1/-1}.hd-metric--sub{color:var(--ink-2);align-content:center;gap:2px;display:grid}.hd-metric-t{font-size:15px;font-weight:600;line-height:1}.hd-metric-w{text-overflow:ellipsis;font-size:30px;font-weight:var(--type-readout-weight);letter-spacing:-.03em;line-height:1.1;overflow:hidden}.hd:not(.hd--compact):not(.hd--sheet) .hd-metric-n{font-size:34px;font-weight:var(--type-readout-weight);letter-spacing:-.035em}.hd-label{color:var(--ink-3);font-size:var(--type-caption);letter-spacing:.01em;font-weight:600;line-height:1}.hd-label-short{display:none}.hd-none{text-overflow:ellipsis;min-width:0;color:var(--ink-3);grid-column:1/-1;font-size:13.5px;font-weight:600;overflow:hidden}@container hd (width<=259px){.hd:not(.hd--compact):not(.hd--sheet) .hd-label-long{display:none}.hd:not(.hd--compact):not(.hd--sheet) .hd-label-short{display:inline}.hd:not(.hd--compact):not(.hd--sheet) .hd-metric-w{font-size:26px}.hd:not(.hd--compact):not(.hd--sheet) .hd-bar--pair{--pair-gap:8px;--pair-share:.275;--pair-min:38px}}.hd--compact .hd-bar{justify-content:flex-end;align-items:center;column-gap:10px;padding-inline-end:var(--pad-in);display:flex}.hd--compact .hd-label{display:none}.hd--compact :is(.hd-metric-w,.hd-metric-n,.hd-metric-v){letter-spacing:0;font-size:13.5px;font-weight:700}.hd--compact .hd-none{flex:none;font-size:12.5px}.hd-empty{white-space:nowrap;text-overflow:ellipsis;min-width:0;font-size:var(--type-status);font-weight:500;line-height:var(--type-status-leading);color:var(--ink-3);align-self:center;margin:0;overflow:hidden}.hd-step{--btn:calc(var(--slot-h) - 2 * var(--inset));grid-template-columns:var(--slot-h) minmax(0, 1fr) var(--slot-h);height:var(--slot-h);background:var(--groove);min-width:0;color:var(--ink);box-shadow:var(--groove-shadow);border-radius:99px;align-items:center;display:grid}.hd-step-b{width:var(--slot-h);height:var(--slot-h);color:inherit;cursor:pointer;touch-action:manipulation;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.hd-step-b>span{width:var(--btn);height:var(--btn);background:var(--btn);color:var(--ink);box-shadow:var(--btn-shadow);transition:background-color .15s var(--ease-out), scale var(--press) var(--ease-out);border-radius:50%;place-items:center;display:grid}.hd-step-i{fill:none;stroke:currentColor;stroke-width:1.8px;stroke-linecap:round;width:14px;height:14px}.hd-step-b:active>span{scale:.9}.hd-step-b:focus-visible{outline:none}.hd-step-b:focus-visible>span{outline:2px solid var(--ink);outline-offset:1px}@media (hover:hover) and (pointer:fine){.hd-step-b:not(:disabled):hover>span{background:color-mix(in oklab, var(--btn) 94%, var(--ink))}}.hd-step-v{white-space:nowrap;font-variant-numeric:tabular-nums;justify-content:center;align-items:baseline;gap:6px;min-width:0;font-size:15px;font-weight:700;display:flex;overflow:hidden}.hd-step-v small{margin-left:-4px;font-size:.8em;font-weight:600}.hd-step-k{opacity:.72;font-size:12.5px;font-weight:600;display:none}.hd-cue{flex:0 0 13px;align-self:center;place-items:center;display:inline-grid}.hd-cue svg{fill:none;stroke:currentColor;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;width:13px;height:13px}@container hd (width>=260px){.hd-step-k{display:inline}}.hd--compact .hd-step-k{display:none}.hd--compact .hd-step-v{gap:4px;font-size:13.5px}.hd--sheet .hd-step-v{font-size:18px}.hd--sheet .hd-step-k{display:inline}@media (prefers-reduced-motion:reduce){.hd-step-b>span{scale:none!important}}.hd-track{min-width:0;position:relative}:where(.hd-track--groove){height:var(--slot-h);background:var(--groove);box-shadow:var(--groove-shadow);border-radius:99px}.hd-track--groove:not([data-focus=thumb]):has(>.hd-track-in:focus-visible){outline:2px solid var(--ink);outline-offset:3px}.hd-track-lab{padding:0 var(--pad-in);font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ink-2);pointer-events:none;align-items:center;font-size:14px;font-weight:600;display:flex;position:absolute;inset:0}.hd-track-fill{border-radius:inherit;background:var(--accent);pointer-events:none;clip-path:inset(0 calc((100% - var(--cap,0px)) * (1 - var(--v,0))) 0 0 round 99px);transition:opacity .2s var(--ease-out);position:absolute;inset:0}.hd-track-fill .hd-track-lab{color:var(--on-accent)}.hd-track[data-lit=false] .hd-track-fill{opacity:0}.hd-track[data-anim] .hd-track-fill{transition:clip-path .16s var(--ease-out), opacity .2s var(--ease-out)}.hd-track-hit{border-radius:inherit;cursor:pointer;touch-action:pan-y;position:absolute;inset:0}.hd-track[data-disabled] .hd-track-hit{cursor:default}.hd-track-in{opacity:0;pointer-events:none;width:1px;height:1px;margin:0;position:absolute;bottom:0;left:0}.hd-level{--cap:30px}.hd--compact .hd-level .hd-track-lab{font-size:13px}.hd-tl{gap:8px;display:none}.hd-tl-h{justify-content:space-between;align-items:baseline;gap:12px;font-size:14px;font-weight:600;display:flex}.hd-tl-v{color:var(--ink-2);font-variant-numeric:tabular-nums;text-align:right;font-size:13.5px;font-weight:500}.hd-tl-bars{grid-template-columns:repeat(24,minmax(0,1fr));align-items:end;height:46px;display:grid}.hd-tl-bars i{width:4px;height:calc(8px + 38px * var(--h,0));background:var(--ink);opacity:.8;border-radius:2px;justify-self:center}.hd-tl-bars i[data-s=off]{background:var(--tick);opacity:1;height:4px}.hd-tl-bars i[data-s=future]{background:var(--line);opacity:1;height:4px}.hd-tl-bars i[data-s=fc]{background:var(--tick);opacity:1}.hd-tl-bars i[data-s=now]{background:var(--accent-strong);opacity:1;border-radius:3px;width:6px}.hd-tl-bars i[data-s=now-off]{background:var(--ink-3);opacity:1;border-radius:3px;width:6px;height:6px}.hd-tl-bars i[data-s=unav]{outline:1.2px dashed var(--ink-3);outline-offset:-1.2px;opacity:1;background:0 0;height:18px}.hd-tl-axis{color:var(--ink-3);font-variant-numeric:tabular-nums;grid-template-columns:repeat(4,minmax(0,1fr));font-size:11.5px;font-weight:500;display:grid}.hd-extra{gap:18px;display:none}.hd-note{color:var(--ink-2);margin:0;font-size:14px;font-weight:500;line-height:1.45}.hd-blk{gap:10px;min-width:0;display:grid}.hd-blk-h{justify-content:space-between;align-items:baseline;gap:12px;margin:0;font-size:14px;font-weight:600;display:flex}.hd-blk-v{color:var(--ink-2);font-size:13.5px;font-weight:500}.hd-chips{grid-template-columns:repeat(min(var(--n,4), 4), minmax(0, 1fr));gap:8px;display:grid}.hd-chip{background:var(--btn);min-width:0;min-height:52px;box-shadow:var(--btn-shadow);color:var(--ink);font:600 14px/1.2 var(--font);text-align:left;cursor:pointer;transition:background-color .2s var(--ease-out), color .2s var(--ease-out), box-shadow .2s var(--ease-out), scale var(--press) var(--ease-out);border:0;border-radius:18px;align-content:center;justify-items:start;gap:1px;padding:6px 12px;display:grid}.hd-chip:active{scale:.97}.hd-chip>span{overflow-wrap:break-word;max-width:100%}.hd-chip small,.hd-chip-sub{color:var(--ink-2);font-size:12px;font-weight:500}.hd-chip[aria-pressed=true]{background:var(--accent);color:var(--on-accent);box-shadow:none}.hd-chip[aria-pressed=true] small{color:var(--on-accent)}.hd-chip:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.hd-info{border-top:1px solid var(--line);color:var(--ink-3);justify-content:space-between;gap:12px;padding-top:12px;font-size:13px;font-weight:500;display:flex}@container hd (width<=259px){.hd:not(.hd--compact):not(.hd--sheet) .hd-head{column-gap:10px}.hd--featured:not(.hd--sheet) .hd-head{grid-template-columns:auto minmax(0,1fr);grid-template-areas:\"orb title\"}.hd--featured:not(.hd--sheet) .hd-num{display:none}}@container hd (width>=260px){.hd-unav-t,.hd-pill-x{display:inline}}.hd--featured{height:var(--hd-featured);grid-template-rows:var(--slot-h) var(--slot-h) minmax(0, 1fr)}.hd--featured .hd-head{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:\"orb title num\";row-gap:0}.hd--featured .hd-num{display:block}.hd--featured .hd-tl{display:grid}.hd--featured:not(.hd--sheet) .hd-num--control-duplicate{display:none}.hd--compact{--pad:8px;--pad-in:12px;--slot-h:44px;height:var(--hd-unit);border-radius:999px;grid-template-rows:none;grid-template-columns:44px minmax(0,1fr) auto;grid-template-areas:\"orb title slot\";align-items:center;gap:0 10px;padding:8px}.hd--compact .hd-head{display:contents}.hd--compact .hd-head>.hd-orb{grid-area:orb}.hd--compact .hd-title{grid-area:title;position:relative}.hd--compact .hd-open:after{inset-inline:-10px 8px}.hd--compact .hd-name{font-size:15px}.hd--compact .hd-area,.hd--compact .hd-sub{font-size:var(--type-status-compact);margin-top:1px!important}.hd--compact .hd-sub{color:var(--ink-2);font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.hd--compact .hd-slot{grid-area:slot;width:clamp(112px,40cqi,232px)}.hd--compact .hd-pill,.hd--compact .hd-unav{font-size:13px}.hd--compact .hd-pill{justify-content:center}.hd--compact .hd-unav-t,.hd--compact .hd-pill-x,.hd--compact .hd-num,.hd--compact .hd-tl{display:none}.hd-val{text-overflow:ellipsis;white-space:nowrap;text-align:right;min-width:0;color:var(--ink);font-variant-numeric:tabular-nums;margin:0;font-size:14px;font-weight:600;overflow:hidden}.hd--compact[data-control=off] .hd-slot{justify-items:end;width:auto;max-width:48cqi}.hd--compact .hd-val{padding-inline-end:var(--pad-in)}.hd--compact[data-control=off]:is([data-state=off],[data-state=unknown],[data-state=unavailable]) .hd-val{color:var(--ink-3)}.hd--compact[data-control=off] .hd-title{position:static}.hd--compact[data-control=off] .hd-open:after{border-radius:999px;inset:0}.hd--compact[data-control=off] .hd-open:focus-visible{outline:none}.hd--compact[data-control=off] .hd-open:focus-visible:after{outline:2px solid var(--ink);outline-offset:2px}.hd--compact[data-control=off]:has(.hd-open){cursor:pointer;transition:scale var(--press) var(--ease-out)}.hd--compact[data-control=off]:has(.hd-open:active){scale:.985}@container hd (width<=319px){.hd--compact{grid-template-columns:44px minmax(0,1fr);grid-template-areas:\"orb title\";column-gap:8px}.hd--compact .hd-slot,.hd--compact .hd-area{display:none}.hd--compact .hd-sub{display:block}.hd--compact:is([data-state=unavailable],[data-state=off],[data-state=unknown]) .hd-sub{color:var(--ink-3)}.hd--compact .hd-title{position:static}.hd--compact .hd-open:after{border-radius:999px;inset:0}.hd--compact .hd-open:focus-visible{outline:none}.hd--compact .hd-open:focus-visible:after{outline:2px solid var(--ink);outline-offset:2px}.hd--compact:has(.hd-open){cursor:pointer;transition:scale var(--press) var(--ease-out)}.hd--compact:has(.hd-open:active){scale:.985}}.hd--sheet{--slot-h:52px;background:var(--card-solid);-webkit-backdrop-filter:none;grid-template-rows:none;gap:20px;height:auto}.hd--sheet .hd-head{grid-template-columns:auto minmax(0,1fr) auto auto;grid-template-areas:\"orb title num open\";row-gap:0}.hd--sheet .hd-num{font-size:40px;display:block}.hd--sheet .hd-area{white-space:normal}.hd--sheet .hd-name>span{white-space:normal;overflow-wrap:anywhere}.hd--sheet .hd-unav-t,.hd--sheet .hd-pill-x{display:inline}.hd--sheet .hd-tl,.hd--sheet .hd-extra{display:grid}.hd-sheet{color:var(--ink);overscroll-behavior:contain;-webkit-tap-highlight-color:transparent;width:min(440px,100vw - 24px);max-width:none;max-height:calc(100dvh - 32px);transition:opacity .2s var(--ease-out), scale .2s var(--ease-out), translate .2s var(--ease-out);background:0 0;border:0;padding:0;overflow:auto}.hd-sheet::backdrop{-webkit-backdrop-filter:blur(6px);transition:opacity .24s var(--ease-out);background:#18161161;background:lab(7.24722% .654019 3.2768/.38)}@starting-style{.hd-sheet[open]{opacity:0;scale:.96}}@starting-style{.hd-sheet[open]::backdrop{opacity:0}}.hd-sheet[data-closing]{opacity:0;pointer-events:none;transition-duration:.15s;scale:.97}.hd-sheet[data-closing]::backdrop{opacity:0;transition-duration:.18s}@media (max-width:600px){.hd-sheet{width:100%;max-height:92dvh;transition:translate .38s var(--ease-drawer);border-radius:28px 28px 0 0;margin:auto 0 0}@starting-style{.hd-sheet[open]{opacity:1;translate:0 100%;scale:1}}.hd-sheet[data-closing]{opacity:1;transition-duration:.24s;translate:0 100%;scale:1}.hd-sheet .hd--sheet{padding-bottom:calc(var(--pad) + env(safe-area-inset-bottom,0px));box-shadow:inset 0 1px 0 var(--card-edge), 0 -12px 40px -20px #1b150b66;border-radius:28px 28px 0 0}@supports (color:lab(0% 0 0)){.hd-sheet .hd--sheet{box-shadow:inset 0 1px 0 var(--card-edge), 0 -12px 40px -20px lab(7.25373% 1.57871 6.11279/.4)}}.hd-sheet .hd--sheet>.hd-head{z-index:2;margin:calc(-1 * var(--pad)) calc(-1 * var(--pad)) -6px;padding:calc(var(--pad) + 14px) var(--pad) 12px;background:var(--card-solid);touch-action:none;cursor:grab;border-radius:28px 28px 0 0;position:sticky;top:0}.hd-sheet .hd--sheet>.hd-head:before{content:\"\";background:var(--tick);border-radius:3px;width:38px;height:5px;position:absolute;top:8px;left:50%;translate:-50%}}.hd-cf{border-top:1px solid var(--line);gap:6px;padding-top:14px;display:grid}.hd-cf-q{overflow-wrap:anywhere;margin:0;font-size:17px;font-weight:600}.hd-cf-d{min-height:1.45em;color:var(--ink-2);margin:0 0 10px;font-size:14px;font-weight:500;line-height:1.45}.hd-cf-b{grid-template-columns:1fr 1fr;gap:10px;display:grid}.hd-cf-x,.hd-cf-ok{height:52px;font:600 15px var(--font);cursor:pointer;transition:background-color .2s var(--ease-out), opacity .2s var(--ease-out), scale var(--press) var(--ease-out);border:0;border-radius:99px;padding:0 16px}.hd-cf-x{background:var(--btn);box-shadow:var(--btn-shadow);color:var(--ink)}.hd-cf-ok{background:var(--inv-bg);color:var(--inv-fg)}.hd-cf-x:active,.hd-cf-ok:active:not(:disabled){scale:.97}.hd-cf-x:focus-visible,.hd-cf-ok:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.hd-cf-ok:disabled{opacity:.45;cursor:default}.hd-kp{border-radius:18px;justify-items:center;gap:16px;padding:6px 0 2px;display:grid}.hd-kp:focus,.hd-kp:focus-visible{outline:none}.hd-kp-p{text-align:center;margin:0;font-size:15px;font-weight:600}.hd-kp-dots{align-items:center;gap:12px;height:14px;display:flex}.hd-kp-dots i{width:12px;height:12px;box-shadow:inset 0 0 0 1.5px var(--ink-3);transition:background-color .12s var(--ease-out);border-radius:50%}.hd-kp-dots i[data-on]{background:var(--ink);box-shadow:none}.hd-kp-dots[data-error]{animation:hd-kp-shake .36s var(--ease-out)}.hd-kp-in{box-sizing:border-box;background:var(--groove);width:256px;max-width:100%;height:52px;box-shadow:var(--groove-shadow);color:var(--ink);font:600 20px var(--font);letter-spacing:.12em;text-align:center;border:0;border-radius:99px;padding:0 20px}.hd-kp-in::placeholder{color:var(--ink-3);letter-spacing:0;font-size:15px}.hd-kp-in:focus{outline:none}.hd-kp-in:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.hd-kp-in[data-error]{animation:hd-kp-shake .36s var(--ease-out)}.hd-kp-dots[data-busy] i[data-on]{animation:hd-kp-wait .7s var(--ease-in-out) infinite alternate}@keyframes hd-kp-wait{to{opacity:.35}}@keyframes hd-kp-shake{20%{translate:-7px}40%{translate:6px}60%{translate:-4px}80%{translate:2px}}.hd-kp-keys{grid-template-columns:repeat(3,72px);gap:12px 20px;display:grid}.hd-key{background:var(--btn);width:72px;height:72px;box-shadow:var(--btn-shadow);color:var(--ink);font:400 28px var(--font);font-variant-numeric:tabular-nums;cursor:pointer;transition:background-color .12s var(--ease-out), scale var(--press) var(--ease-out);border:0;border-radius:50%;place-items:center;padding:0;display:grid}.hd-key:active:not(:disabled){background:var(--fill);scale:.93}.hd-key:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.hd-key svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:24px;height:24px}.hd-key--ok{background:var(--inv-bg);color:var(--inv-fg);box-shadow:none}.hd-key:disabled{opacity:.35;cursor:default}.hd-kp-x{width:256px;max-width:100%}.hd-pic{aspect-ratio:16/9;width:100%;min-width:0;color:var(--ink-3);font:inherit;text-align:inherit;background:0 0;border:0;border-radius:14px;margin:0;padding:0;display:block;position:relative}button.hd-pic{cursor:pointer}button.hd-pic:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.hd-pic-i{border-radius:inherit;background:var(--fill);transition:scale var(--press) var(--ease-out);place-items:center;display:grid;position:absolute;inset:0;overflow:hidden}button.hd-pic:active .hd-pic-i{scale:.98}.hd-pic-img{object-fit:cover;width:100%;height:100%;animation:hd-pic-in .2s var(--ease-out);display:block;position:absolute;inset:0}.hd-pic[data-fit=contain] .hd-pic-img{object-fit:contain}.hd-pic-glyph{place-items:center;width:28px;height:28px;display:grid}.hd-pic-glyph svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:100%;height:100%}.hd-pic[data-status=unavailable] .hd-pic-i{outline:1.5px dashed var(--ink-3);outline-offset:-1.5px;background:0 0}@keyframes hd-pic-in{0%{opacity:0}}@media (prefers-reduced-motion:reduce){.hd :is(.hd-orb-i,.hd-circ-i,.hd-pill,.hd-chip,.hd-read-i,.hd-pic-i),.hd--compact{scale:none!important}.hd-chev{translate:none!important}.hd-kp-dots[data-error],.hd-kp-in[data-error]{animation:none}.hd-cf-x,.hd-cf-ok,.hd-key{scale:none!important}.hd-sheet{transition:opacity .2s var(--ease-out)}@starting-style{.hd-sheet[open]{opacity:0;translate:none;scale:none}}.hd-sheet[data-closing]{opacity:0;transition-duration:.15s;translate:none;scale:none}}.hd-dial-face{width:min(100%,220px);margin:4px auto 0;position:relative}.hd-dial-face svg{cursor:grab;touch-action:none;width:100%;height:auto;display:block;overflow:visible}.hd-dial-face svg[data-dragging]{cursor:grabbing}.hd-dial-face svg[aria-disabled]{cursor:default}.hd-dial-input{opacity:0;pointer-events:none;width:100%;height:100%;margin:0;position:absolute;inset:0}.hd-dial-tick{stroke:currentColor;stroke-width:2.4px;color:var(--tick);transition:color var(--press) var(--ease-out)}.hd-dial-tick[data-lit]{color:var(--accent)}.hd-dial-top{letter-spacing:.02em;fill:var(--ink-2);font-size:11px;font-weight:600}.hd-dial-turn{transition:transform .32s var(--ease-out)}.hd-dial-face svg[data-dragging] .hd-dial-turn,.hd-dial-face svg[data-dragging] .hd-dial-tick{transition:none}.hd-dial-stem{stroke:var(--ink);stroke-width:3px;stroke-linecap:round}.hd-dial-knob{fill:var(--card-solid);stroke:var(--ink);stroke-width:3px}.hd-dial-input:focus-visible+svg .hd-dial-knob{stroke:var(--accent);stroke-width:4px}.hd-dial-face svg[aria-disabled] .hd-dial-stem,.hd-dial-face svg[aria-disabled] .hd-dial-knob{stroke:var(--ink-3)}@media (prefers-reduced-motion:reduce){.hd-dial-turn,.hd-dial-tick{transition:none}}.hh-c{min-width:0;container:hh/inline-size}.hh{color:var(--ink);font-family:var(--font);justify-content:space-between;align-items:flex-end;gap:16px;padding-inline:4px;display:flex}.hh-t{min-width:0}.hh-title{letter-spacing:-.03em;white-space:nowrap;text-overflow:ellipsis;margin:0;font-size:clamp(30px,4.2cqi,48px);font-weight:300;line-height:1.05;overflow:hidden}.hh-sub{color:var(--ink-2);white-space:nowrap;text-overflow:ellipsis;margin:6px 0 0;font-size:clamp(14px,1.3cqi,16px);font-weight:500;line-height:1.3;overflow:hidden}.hh-time{letter-spacing:-.04em;font-variant-numeric:tabular-nums;white-space:nowrap;flex:none;margin:0;font-size:clamp(32px,5.4cqi,68px);font-weight:300;line-height:.82}.hh-time small{letter-spacing:0;color:var(--ink-2);margin-left:.2em;font-size:max(13px,.27em);font-weight:600}.dash{box-sizing:border-box;color:var(--ink);font-family:var(--font);align-content:start;gap:10px;padding:8px 10px 12px;display:grid;container:dash/inline-size}.dash *,.dash :before,.dash :after{box-sizing:border-box}.dash-cols{grid-template-columns:repeat(var(--cols,2), minmax(0, 1fr));gap:var(--dash-cols-gap,20px);align-items:start;display:grid}.dash-sec{align-content:start;gap:10px;min-width:0;display:grid}.dash-sec-h{justify-content:space-between;align-items:baseline;gap:12px;margin:0;padding-inline:4px;font-size:17px;font-weight:700;line-height:1.2;display:flex}.dash-sec-h small{color:var(--ink-2);font-size:13px;font-weight:500;line-height:1.3}.dash-grid{grid-template-columns:repeat(var(--cols,2), minmax(0, 1fr));gap:var(--dash-grid-gap,8px);align-items:start;display:grid}.dash-cell{grid-column:span var(--span,1);min-width:0}:is(.dash-grid--1,.dash-row[data-tracks=\"1\"])>* .hd:not(.hd--sheet){--glow-damp:calc(var(--glow-later,1) * var(--glow-yield,1))}.dash-grid--1>:has(.hd[data-glow]:not(.hd--compact,.hd--sheet))~:has(.hd[data-glow]) .hd{--glow-later:var(--glow-damp-later,.5)}.dash-grid--1:has(>* .hd:is([data-level=urgent],[data-level=alarm]))>* .hd[data-glow]{--glow-yield:var(--glow-damp-under-alert,1)}.dash-row{grid-auto-rows:60px;align-items:start;gap:8px;min-width:0;display:grid}.dash-place{min-width:0}.dash-row[data-tracks=\"1\"]>:has(.hd[data-glow]:not(.hd--compact,.hd--sheet))~:has(.hd[data-glow]) .hd{--glow-later:var(--glow-damp-later,.5)}.dash-row[data-tracks=\"1\"]:has(>* .hd:is([data-level=urgent],[data-level=alarm]))>* .hd[data-glow]{--glow-yield:var(--glow-damp-under-alert,1)}.dash-row--areas{grid-auto-rows:auto;column-gap:16px}.dash-col{min-width:0}.dash-col>.dash-sec-h{text-overflow:ellipsis;white-space:nowrap;display:block;overflow:hidden}@container dash (width<=319px){.dash-grid{grid-template-columns:minmax(0,1fr)}.dash-cell{grid-column:1}}.dash{scroll-margin-top:var(--dash-scroll-offset,0px)}.dash-sec{scroll-margin-top:calc(var(--dash-scroll-offset,0px) + 12px)}.dash[data-nav]{flex-direction:column;display:flex}.dash-dock{bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:4;pointer-events:none;flex-direction:column;align-items:center;gap:8px;margin-top:auto;display:flex;position:sticky}.dash-dock>*{pointer-events:auto}.dash-dock>.ha-action-dock{align-self:stretch;position:static}.dash-nav{--accent:oklch(var(--accent-l) var(--brand-c) var(--brand-h));background:var(--card);-webkit-backdrop-filter:blur(22px)saturate(1.15);min-width:0;max-width:100%;box-shadow:inset 0 0 0 1px var(--card-edge), var(--shadow);border-radius:999px;padding:6px 0}.dash-nav-list{overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;-webkit-mask-image:linear-gradient(to right, transparent, var(--ink) 12px, var(--ink) calc(100% - 12px), transparent);-webkit-mask-image:linear-gradient(to right, transparent, var(--ink) 12px, var(--ink) calc(100% - 12px), transparent);mask-image:linear-gradient(to right, transparent, var(--ink) 12px, var(--ink) calc(100% - 12px), transparent);gap:6px;margin:0;padding:0 12px;scroll-padding-inline:12px;list-style:none;display:flex;overflow-x:auto}.dash-nav-list::-webkit-scrollbar{display:none}.dash-nav-i{background:var(--btn);height:44px;box-shadow:var(--btn-shadow);color:var(--ink);font:600 14px/1 var(--font);white-space:nowrap;cursor:pointer;scroll-snap-align:start;touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;transition:background-color .2s var(--ease-out), color .2s var(--ease-out), box-shadow .2s var(--ease-out), scale var(--press) var(--ease-out);border:0;border-radius:999px;align-items:center;gap:6px;padding:0 16px;display:inline-flex;position:relative}.dash-nav-i:active{scale:.97}.dash-nav-i[aria-current]{background:var(--accent);color:var(--on-accent);box-shadow:none}.dash-nav-i:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.dash-nav-x{fill:none;stroke:currentColor;stroke-width:1.8px;stroke-linecap:round;stroke-linejoin:round;flex:none;width:11px;height:11px}.dash-nav-sr{clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:absolute;overflow:hidden}@media (hover:hover) and (pointer:fine){.dash-nav-i:not([aria-current]):hover{background:color-mix(in oklab, var(--btn) 94%, var(--ink))}}@media (prefers-reduced-motion:reduce){.dash-nav-i:active{scale:none}}.hb-c{min-width:0;container:hb/inline-size}.hb{isolation:isolate;background:var(--card);-webkit-backdrop-filter:blur(22px)saturate(1.15);box-shadow:inset 0 0 0 1px var(--card-edge), var(--shadow);border-radius:24px;display:grid;position:relative;overflow:hidden}.hb-part{min-width:0;position:relative}.hb-part>.hd-c>.hd{box-shadow:none;-webkit-backdrop-filter:none;background:0 0;border-radius:0}.hb-part:before{content:none;z-index:1;background:var(--line);pointer-events:none;position:absolute}.hb--joined{grid-template-columns:repeat(var(--n,2), minmax(0, 1fr));border-radius:24px;row-gap:8px}.hb--joined>.hb-part+.hb-part:before{content:\"\";width:1px;top:14px;bottom:14px;left:0}@container hb (width<=339px){.hb--joined{grid-template-columns:minmax(0,1fr)}.hb--joined>.hb-part+.hb-part:before{width:auto;height:1px;inset:-4px 14px auto}}@container hb (width<=509px){.hb--joined[data-n=\"3\"]{grid-template-columns:minmax(0,1fr)}.hb--joined[data-n=\"3\"]>.hb-part+.hb-part:before{width:auto;height:1px;inset:-4px 14px auto}}@container hb (width<=449px){.hb--joined[data-n=\"4\"]{grid-template-columns:minmax(0,1fr)}.hb--joined[data-n=\"4\"]>.hb-part+.hb-part:before{width:auto;height:1px;inset:-4px 14px auto}}@container hb (width>=450px) and (width<=599px){.hb--joined[data-n=\"4\"]{grid-template-columns:repeat(2,minmax(0,1fr))}}.hb--lead{--lp:16px;gap:8px}.hb-row>.hd-c>.hd--compact{padding:8px var(--lp)}.hb-row:before{content:\"\";top:-4px;left:var(--lp);right:var(--lp);height:1px}.hd-c--more{background:var(--card-solid);box-shadow:inset 0 0 0 1px var(--card-edge), var(--shadow);border-radius:clamp(22px,7cqi,30px)}.hd-c--more>.hd--sheet{box-shadow:none;background:0 0;padding-bottom:14px}.hd-more{--pad:clamp(14px, 4.8cqi, 22px);padding:4px var(--pad) var(--pad);gap:8px;display:grid}.hd-more>.hb-part>.hd-c>.hd{background:var(--chip);box-shadow:inset 0 0 0 1px var(--line);border-radius:999px}@media (max-width:600px){.hd-sheet .hd-c--more{box-shadow:inset 0 1px 0 var(--card-edge), 0 -12px 40px -20px #1b150b66;border-radius:28px 28px 0 0}@supports (color:lab(0% 0 0)){.hd-sheet .hd-c--more{box-shadow:inset 0 1px 0 var(--card-edge), 0 -12px 40px -20px lab(7.25373% 1.57871 6.11279/.4)}}.hd-sheet .hd-c--more>.hd--sheet{box-shadow:none;padding-bottom:14px}.hd-more{padding-bottom:calc(var(--pad) + env(safe-area-inset-bottom,0px))}}.hb--titled{--lp:16px;gap:8px}.hb-lid{height:60px;padding:8px var(--lp) 0;align-content:center;min-width:0;display:grid;position:relative}.hb-lid-name{letter-spacing:-.01em;text-overflow:ellipsis;white-space:nowrap;min-width:0;margin:0;font-size:clamp(16px,4.6cqi,19px);font-weight:600;line-height:1.2;overflow:hidden}.hb-lid-area{font-size:var(--type-status);font-weight:500;line-height:var(--type-status-leading);color:var(--ink-2);text-overflow:ellipsis;white-space:nowrap;margin:3px 0 0;overflow:hidden}.lk[data-state=unlocked] .hd-num,.lk[data-state=open] .hd-num{color:var(--ink-2)}.lk .lk-st{color:var(--ink);gap:6px}.lk-st-x{color:var(--ink-2);text-overflow:ellipsis;font-weight:500;overflow:hidden}.lk-st[data-moving]{animation:lk-wait .9s var(--ease-in-out) infinite alternate}@keyframes lk-wait{to{opacity:.65}}.lk-last{align-content:end;gap:10px;min-width:0;margin:0;display:none}.hd--featured .lk-last,.hd--sheet .lk-last{display:grid}.lk-last>div{border-top:1px solid var(--line);justify-content:space-between;align-items:baseline;gap:12px;min-width:0;padding-top:10px;display:flex}.lk-last dt{flex:none;font-size:14px;font-weight:600}.lk-last dd{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--ink-2);text-align:right;margin:0;font-size:13.5px;font-weight:500;overflow:hidden}.hd--sheet .lk-last dd{white-space:normal;overflow-wrap:anywhere}.lk-door{background:var(--btn);min-height:52px;box-shadow:var(--btn-shadow);color:var(--ink);font:600 15px var(--font);text-align:left;cursor:pointer;transition:background-color .2s var(--ease-out), scale var(--press) var(--ease-out);border:0;border-radius:99px;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:0 16px;display:grid}.lk-door:active{scale:.98}.lk-door:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.lk-door svg{fill:none;stroke:currentColor;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;width:22px;height:22px}@media (prefers-reduced-motion:reduce){.lk-st[data-moving]{animation-duration:1.6s}.lk-door{scale:none!important}}@container hd (width>=400px){.lk.hd--compact .hd-pill-x{display:inline}.lk.hd--compact .hd-pill{justify-content:space-between}}.hd--compact .fn-mode,.hd--sheet .fn-mode{display:none}@container hd (width<=259px){.fn-mode{display:none}}.fn .hd-chip>span{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.gw-bar .hd-metric{gap:5px;display:grid}.gw-code{font-size:clamp(20px,10.5cqi,30px);font-weight:var(--type-readout-weight);letter-spacing:.01em;line-height:1}.hd--compact .gw-code{letter-spacing:.02em;font-size:14px;font-weight:600}.hd--sheet .gw-code{-webkit-user-select:text;user-select:text;font-size:32px;font-weight:300}.gw-code[data-long]{white-space:nowrap;text-overflow:ellipsis;letter-spacing:0;min-width:0;font-size:clamp(16px,6cqi,22px);display:block;overflow:hidden}.hd--compact .gw-code[data-long]{font-size:13.5px}.hd--sheet .gw-code[data-long]{white-space:normal;overflow-wrap:anywhere;font-size:22px;font-weight:400;line-height:1.25}.hd--sheet .gw-bar:has([data-long]){height:auto;min-height:var(--slot-h)}.gw-join{grid-template-columns:minmax(0,1fr);align-items:center;gap:14px;min-width:0;min-height:0;display:grid}.gw-join:is([data-qr],[data-empty]){grid-template-columns:auto minmax(0,1fr)}.gw-qr{aspect-ratio:1;image-rendering:pixelated;-webkit-user-drag:none;border-radius:8px;display:block}.gw-how{min-width:0;color:var(--ink-2);font-size:var(--type-status);margin:0;font-weight:500;line-height:1.35}.gw-terms{color:var(--ink-3);font-size:var(--type-caption);margin-top:6px;font-weight:600;display:block}span.gw-qr{background:var(--fill)}.hd--featured:not(.hd--sheet) .gw-join{height:100%;overflow:hidden}.hd--featured:not(.hd--sheet) .gw-qr{height:100%;max-height:132px}@container hd (width<=259px){.hd--featured:not(.hd--sheet) .gw-join[data-qr]:not([data-failed]) .gw-how{display:none}.hd--featured:not(.hd--sheet) .gw-join[data-failed]{grid-template-columns:minmax(0,1fr)}.hd--featured:not(.hd--sheet) .gw-join[data-failed] .gw-qr{display:none}.hd--featured:not(.hd--sheet) .gw-join[data-empty]{grid-template-columns:minmax(0,1fr)}.hd--featured:not(.hd--sheet) .gw-join[data-empty] .hd-empty{display:none}}.hd--sheet .gw-join{justify-items:center;gap:12px}.hd--sheet .gw-join[data-qr]{grid-template-columns:minmax(0,1fr)}.hd--sheet .gw-qr{border-radius:12px;width:min(232px,72%)}.hd--sheet .gw-how{text-align:center;max-width:32ch;font-size:14px}.gw-acts{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;display:grid}.gw-note{min-height:1.35em;color:var(--ink-3);margin:0;font-size:13px;line-height:1.35;display:grid}.gw-note>*{grid-area:1/1;min-width:0}.gw-note-room{visibility:hidden}.hd--compact[data-state=none] :is(.hd-val,.hd-sub){color:var(--ink-3)}.bs[data-state=off] .bs-f{color:var(--ink-2)}@container hd (width>=260px){.bs:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}}@container hd (width<=259px){.bs-al-k{display:none}}.hd--compact .bs-since,.hd--compact .bs-al-k{display:none}.cm[data-state=idle] .cm-f{color:var(--ink-2)}.cm:not(.hd--compact):not(.hd--sheet) .cm-f[data-own]{-webkit-line-clamp:2;white-space:normal;overflow-wrap:break-word;-webkit-box-orient:vertical;line-height:1;display:-webkit-box}.cm-pic{min-width:0;min-height:0}@container hd (width>=260px){.cm:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet){grid-template-columns:minmax(0,1fr) min(171px,47cqi);column-gap:12px}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .hd-head{grid-area:1/1}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .hd-slot{grid-area:2/1}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .cm-pic{grid-area:1/2/3/3}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .cm-f{font-size:24px}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .cm-f[data-own]{font-size:20px}.cm[data-still]:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .cm-since{display:none}.cm.hd--featured[data-still]:not(.hd--sheet):not([data-state=unavailable]) .hd-head{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:\"orb title num\"}.cm.hd--featured[data-still]:not(.hd--sheet):not([data-state=unavailable]) .hd-num{text-overflow:ellipsis;letter-spacing:-.02em;max-width:40cqi;font-size:24px;display:block;overflow:hidden}.cm.hd--featured[data-still]:not(.hd--sheet):not([data-state=unavailable]) .hd-slot{display:none}.cm.hd--featured[data-still]:not(.hd--sheet):not([data-state=unavailable]) .cm-pic{grid-row:2/4}}@container hd (width<=259px){.cm:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .cm-pic{display:none}}.cm.hd--featured:not(.hd--sheet) .cm-pic .hd-pic,.cm:not(.hd--compact):not(.hd--featured):not(.hd--sheet) .cm-pic .hd-pic{aspect-ratio:auto;height:100%}.hd--compact .cm-since{display:none}.cm[data-state=idle] .hd-num,.mp:not([data-state=playing],[data-state=buffering],[data-state=on]) .hd-num{color:var(--ink-2)}.mp-muted{color:var(--ink-3)}.mp-now{grid-template-columns:minmax(0,1fr);align-items:center;column-gap:14px;min-width:0;min-height:0;display:grid}.mp-now[data-art]{grid-template-columns:auto minmax(0,1fr)}.hd--featured:not(.hd--sheet) .mp-now{height:100%}.hd--featured:not(.hd--sheet) .mp-now .hd-pic{width:auto;height:100%}.hd--sheet .mp-now .hd-pic{width:128px}.mp-meta{align-content:center;gap:2px;min-width:0;display:grid}.mp-title{-webkit-line-clamp:2;line-clamp:2;letter-spacing:-.01em;overflow-wrap:anywhere;-webkit-box-orient:vertical;font-size:17px;font-weight:600;line-height:1.3;display:-webkit-box;overflow:hidden}.mp-artist,.mp-album{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--ink-2);font-size:14px;font-weight:500;overflow:hidden}.mp-album{color:var(--ink-3);font-size:13px}.mp-prog{gap:5px;min-width:0;margin-top:10px;display:grid}.mp-bar{background:var(--fill);border-radius:2px;height:4px;display:block;position:relative;overflow:hidden}.mp-fill{border-radius:inherit;background:var(--ink-2);clip-path:inset(0 100% 0 0);animation:mp-fill var(--mp-len) linear var(--mp-at) forwards;position:absolute;inset:0}@keyframes mp-fill{0%{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}.mp-times{color:var(--ink-3);font-variant-numeric:tabular-nums;justify-content:space-between;gap:8px;font-size:12px;font-weight:500;line-height:16px;display:flex}.mp-clock{display:inline-flex}.mp-place{height:16px;display:inline-block;overflow:hidden}.mp-reel{animation:mp-reel-10 var(--mp-cycle) linear var(--mp-off) var(--mp-turns,1) forwards;flex-direction:column;display:flex}.mp-reel[data-base=\"6\"]{animation-name:mp-reel-6}.mp-reel>span{text-align:center;height:16px;display:block}.mp-place:first-child .mp-reel>span{text-align:end}@keyframes mp-reel-10{0%,9.9999%{transform:translateY(0)}10%,19.9999%{transform:translateY(-10%)}20%,29.9999%{transform:translateY(-20%)}30%,39.9999%{transform:translateY(-30%)}40%,49.9999%{transform:translateY(-40%)}50%,59.9999%{transform:translateY(-50%)}60%,69.9999%{transform:translateY(-60%)}70%,79.9999%{transform:translateY(-70%)}80%,89.9999%{transform:translateY(-80%)}90%,to{transform:translateY(-90%)}}@keyframes mp-reel-6{0%,16.6665%{transform:translateY(0)}16.6666%,33.3332%{transform:translateY(-16.6667%)}33.3333%,49.9999%{transform:translateY(-33.3333%)}50%,66.6665%{transform:translateY(-50%)}66.6666%,83.3332%{transform:translateY(-66.6667%)}83.3333%,to{transform:translateY(-83.3333%)}}.mp-seek-fill{background:color-mix(in oklab, var(--ink) 9%, transparent)}.mp-seek-times{padding:0 var(--pad-in);color:var(--ink-3);font-variant-numeric:tabular-nums;pointer-events:none;justify-content:space-between;align-items:center;gap:8px;font-size:14px;font-weight:600;line-height:16px;display:flex;position:absolute;inset:0}.mp-seek-at{color:var(--ink-2)}.mp-seek[data-held] .mp-seek-at{color:var(--ink)}.mp-seek[data-held] :is(.mp-fill,.mp-reel){animation:none}.mp-seek[data-anim] .mp-seek-fill{transition:clip-path .16s var(--ease-out)}@media (prefers-reduced-motion:reduce){.mp-seek[data-anim] .mp-seek-fill{transition:none}}@container hd (width>=400px){.mp.hd--compact .hd-pill-x{display:inline}.mp.hd--compact .hd-pill{justify-content:space-between}}@container hd (width<=259px){.hd--featured:not(.hd--sheet) .mp-now[data-art]{grid-template-columns:minmax(0,1fr)}.hd--featured:not(.hd--sheet) .mp-now .hd-pic{display:none}}.nm-f{white-space:nowrap;align-items:baseline;min-width:0;line-height:1;display:flex}.nm-f small{text-overflow:ellipsis;color:var(--ink-2);letter-spacing:0;margin-left:4px;font-size:15px;font-weight:600;overflow:hidden}.nm-t{text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums;font-size:18px;font-weight:600;line-height:1;overflow:hidden}@container hd (width>=260px){.nm:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}}@container hd (width<=259px){.nm:not(.hd--compact):not(.hd--sheet) .nm-f .nm-v{font-size:30px}.nm:not(.hd--compact):not(.hd--sheet) .nm-f small{font-size:13px}.nm:not(.hd--compact):not(.hd--sheet) .nm-today{display:none}}.nm.hd--featured .nm-today{display:none}.hd--compact .nm-f small{margin-left:3px;font-size:12.5px}.hd--compact .nm-today{display:none}.hd--sheet.nm .hd-num{font-size:36px}.vc:not([data-state=cleaning],[data-state=returning]) .hd-num{color:var(--ink-2)}.vc-detail{color:var(--ink-3)}@container hd (width>=400px){.vc.hd--compact .hd-pill-x{display:inline}.vc.hd--compact .hd-pill{justify-content:space-between}}.ca-f{text-overflow:ellipsis;font-size:24px;font-weight:var(--type-readout-weight);letter-spacing:-.02em;line-height:1.15;overflow:hidden}.ca[data-state=off] .ca-f{color:var(--ink-2)}.ca-t{text-overflow:ellipsis;font-size:15px;font-weight:600;line-height:1;overflow:hidden}.ca-cue{display:none}@container hd (width>=260px){.ca:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}}.ca:not(.hd--compact) .ca-bar>.ca-f{flex-basis:0}@container hd (width<=259px){.ca:not(.hd--compact):not(.hd--sheet) .ca-f{font-size:20px}}.hd--compact .ca-f,.hd--compact .ca-when{display:none}.hd--compact .ca-cue{text-overflow:ellipsis;font-size:13.5px;font-weight:700;display:block;overflow:hidden}.hd--compact[data-state=off] .ca-cue{color:var(--ink-2);font-weight:600}.ca-list{gap:10px;margin:0;padding:0;list-style:none;display:grid}.ca-ev{grid-template-columns:8.6em minmax(0,1fr);align-items:baseline;column-gap:12px;min-width:0;font-size:14px;display:grid}.ca-ev-t{text-overflow:ellipsis;white-space:nowrap;color:var(--ink-2);font-variant-numeric:tabular-nums;font-weight:500;overflow:hidden}.ca-ev-n{gap:2px;min-width:0;display:grid}.ca-ev-title{overflow-wrap:anywhere;font-weight:600;line-height:1.3}.ca-ev-d{color:var(--ink-2);overflow-wrap:anywhere;font-size:12.5px;font-weight:500;line-height:1.3}.ca-ev[data-when=now] .ca-ev-t{color:var(--ink);font-weight:600}.ca-ev-now{font-weight:700}.ca-ev[data-when=over] :is(.ca-ev-t,.ca-ev-title,.ca-ev-d){color:var(--ink-3);font-weight:500}.su-f{text-overflow:ellipsis;overflow:hidden}.hd--sheet .su-f.hd-metric-n{font-size:40px;font-weight:var(--type-readout-weight);letter-spacing:-.04em;line-height:1}@container hd (width>=260px){.su:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}}.su-f small{letter-spacing:0;color:var(--ink-2);font-size:max(12px,.4em);font-weight:600}.su-after small{font-size:.8em}.hd--compact .su-after,.su:not(.hd--featured):not(.hd--sheet) .su-path{display:none}.su-path{grid-template-rows:auto minmax(0,1fr);min-height:0}.hd--sheet .su-plot{height:96px}.su-plot{min-height:56px;margin-bottom:16px;position:relative}.su-plot svg{width:100%;height:100%;position:absolute;inset:0;overflow:visible}.su-plot path{fill:none;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}.su-hz{stroke:var(--line);stroke-width:1px}.su-line[data-part=past]{stroke:var(--ink);stroke-width:2px}.su-line[data-part=ahead]{stroke:var(--tick);stroke-width:2px}.su-line[data-part=night]{stroke:var(--tick);stroke-width:1.25px;opacity:.6}.su-plot[data-unavailable] .su-line{opacity:.45}.su-mark{left:var(--x);top:var(--y);background:var(--ink-3);width:1.5px;height:8px;margin:-4px 0 0 -.75px;position:absolute}.su-mark-t{color:var(--ink-3);font-variant-numeric:tabular-nums;white-space:nowrap;font-size:11.5px;font-weight:500;position:absolute;top:12px;left:50%;translate:-50%}.su-now{left:var(--x);background:var(--accent-strong);border-radius:1px;width:2px;margin-left:-1px;position:absolute;top:0;bottom:0}.su-sun{left:var(--x);top:var(--y);background:var(--card-solid);width:12px;height:12px;box-shadow:inset 0 0 0 2px var(--ink-3);border-radius:50%;margin:-6px 0 0 -6px;position:absolute}.su-sun[data-up]{box-shadow:inset 0 0 0 2px var(--ink)}.su-list{gap:8px;margin:0;padding:0;list-style:none;display:grid}.su-ev{justify-content:space-between;gap:12px;min-width:0;font-size:14px;display:flex}.su-ev-n{color:var(--ink-2);font-weight:600}.su-ev-t{color:var(--ink-2);font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:500}.su-ev[data-lead] :is(.su-ev-n,.su-ev-t){color:var(--ink);font-weight:700}.hd--compact .dy-mode,.hd--sheet .dy-mode{display:none}@container hd (width<=259px){.dy-mode{display:none}}.dy-list{gap:6px;margin:0;display:grid}.dy-row{justify-content:space-between;align-items:baseline;gap:12px;min-width:0;font-size:14px;display:flex}.dy-row dt{color:var(--ink-2)}.dy-row abbr{text-decoration:none}.dy-row dd{font-variant-numeric:tabular-nums;text-align:right;overflow-wrap:anywhere;margin:0}.dy-band{color:var(--ink-3);margin-left:8px}.dy-row[data-band=warn] dd,.dy-row[data-band=warn] .dy-band{color:var(--warn)}.dy-cable{fill:none;stroke:var(--ink-3);stroke-width:1.5px;stroke-linecap:round}.dy-base{fill:var(--btn);stroke:var(--line);stroke-width:1px}.dy-head{fill:var(--btn);stroke:var(--ink-2);stroke-width:2.5px}.hd--compact .lw-k,.hd--sheet .lw-k{display:none}.lw-ruler{--tw:24px;height:70px}.lw-ruler-ticks{height:14px;position:absolute;bottom:12px;left:12px;right:12px}.lw-ruler-line{background:linear-gradient(90deg, var(--warm-grad));border-radius:3px;height:5px;position:absolute;bottom:0;left:12px;right:12px}.lw-ruler-rail{pointer-events:none;position:absolute;inset:0 12px}.lw-ruler-at{width:100%;transform:translateX(calc(var(--v,.5) * 100%));position:absolute;top:0;bottom:0;right:100%}.lw-ruler-at--tip{transform:translateX(clamp(28px, calc(var(--v,.5) * 100%), calc(100% - 28px)))}.lw-ruler[data-anim] .lw-ruler-at{transition:transform .16s var(--ease-out)}.lw-ruler-mark{background:var(--ink);border-radius:2px;width:4px;height:34px;position:absolute;bottom:8px;left:100%;translate:-50%}.lw-ruler-tip{background:var(--btn);box-shadow:var(--btn-shadow);color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap;border-radius:99px;padding:6px 14px;font-size:12.5px;font-weight:700;position:absolute;top:0;left:100%;translate:-50%}.lw-ruler:has(.hd-track-in:focus-visible) .lw-ruler-mark{outline:2px solid var(--ink);outline-offset:3px}.lw-ruler[data-disabled=true]{opacity:.4}.lw-chip{grid-template-columns:auto minmax(0,1fr);align-items:center;column-gap:8px}.lw-sw{background:var(--sw);width:14px;height:14px;box-shadow:inset 0 0 0 1px var(--line);border-radius:50%}.cw-rb{--kn:48px;--kh:calc(var(--slot-h) - 2 * var(--inset))}.cw-rb-zone{border-radius:inherit;position:absolute;inset:0}.cw-rb-zone--heat{clip-path:inset(0 calc(100% - var(--kn) / 2 - (100% - var(--kn)) * var(--lo)) 0 0)}.cw-rb-zone--cool{clip-path:inset(0 0 0 calc(var(--kn) / 2 + (100% - var(--kn)) * var(--hi)))}.cw-rb-lab{pointer-events:none;justify-content:center;align-items:center;display:none;position:absolute;inset:0}.cw-rb-lab>span{font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ink);align-items:center;gap:4px;font-size:13px;font-weight:700;display:flex}.cw-rb-cur{top:24%;bottom:24%;left:calc(var(--kn) / 2 + (100% - var(--kn)) * var(--cur));background:var(--ink);opacity:.45;pointer-events:none;border-radius:1px;width:2px;position:absolute;translate:-1px}.cw-rb-rail{inset:0 calc(var(--kn) / 2);pointer-events:none;position:absolute}.cw-rb-at{width:100%;transform:translateX(calc(var(--lo) * 100%));position:absolute;top:0;bottom:0;right:100%}.cw-rb-at--hi{transform:translateX(calc(var(--hi) * 100%))}.cw-rb[data-anim] .cw-rb-at{transition:transform .16s var(--ease-out)}.cw-rb[data-anim] .cw-rb-zone{transition:clip-path .16s var(--ease-out)}.cw-rb-k{width:var(--kn);height:var(--kh);pointer-events:none;background:var(--btn);box-shadow:var(--btn-shadow);color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap;border-radius:99px;place-items:center;font-size:13.5px;font-style:normal;font-weight:700;display:grid;position:absolute;top:50%;left:100%;translate:-50% -50%}.cw-rb .hd-track-hit{cursor:grab}.cw-rb .hd-track-hit:active{cursor:grabbing}:is(.cw-rb:has(.cw-rb-in--lo:focus-visible) .cw-rb-k--lo,.cw-rb:has(.cw-rb-in--hi:focus-visible) .cw-rb-k--hi){outline:2px solid var(--ink);outline-offset:2px}.cw-rb-open{border-radius:inherit;cursor:pointer;background:0 0;border:0;padding:0;position:absolute;inset:0}.cw-rb{transition:scale var(--press) var(--ease-out)}.cw-rb:has(>.cw-rb-open:active){scale:.98}.cw-rb-open:focus-visible{outline:2px solid var(--ink);outline-offset:3px}.cw-rb .hd-track-in,.cw-rb .hd-track-hit,.cw-rb-k{display:none}.cw-rb-lab{display:flex}.cw-rb{background:var(--btn);box-shadow:var(--btn-shadow)}.cw-rb-zone,.cw-rb-cur{display:none}@container hd (width>=260px){.cw-rb{background:var(--groove);box-shadow:var(--groove-shadow)}.cw-rb-zone,.cw-rb-cur,.cw-rb .hd-track-in,.cw-rb .hd-track-hit{display:block}.cw-rb-k{display:grid}.cw-rb-open,.cw-rb-lab{display:none}}.hd--compact .cw-rb{background:var(--btn);box-shadow:var(--btn-shadow)}.hd--compact .cw-rb-zone,.hd--compact .cw-rb-cur,.hd--compact .cw-rb .hd-track-in,.hd--compact .cw-rb .hd-track-hit,.hd--compact .cw-rb-k{display:none}.hd--compact .cw-rb-open{display:block}.hd--compact .cw-rb-lab{display:flex}.hd--compact .cw-rb-lab>span{font-size:12.5px}.hd--sheet .cw-rb{--kn:56px}.hd--sheet .cw-rb-k{font-size:15px}.cw-fine{grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:8px;display:grid}.cw-fine-g{background:var(--chip);min-width:0;min-height:56px;box-shadow:inset 0 0 0 1px var(--line);border-radius:18px;align-items:center;gap:6px;padding:6px 6px 6px 12px;display:flex}.cw-fine-l{min-width:0;color:var(--ink-2);flex:1;font-size:12px;font-weight:500;line-height:1.2;display:grid}.cw-fine-l span{white-space:nowrap;text-overflow:ellipsis;align-items:center;gap:6px;min-width:0;display:flex;overflow:hidden}.cw-fine-l b{color:var(--ink);font-variant-numeric:tabular-nums;font-size:17px;font-weight:700}.cw-fine-b{background:var(--btn);width:40px;height:40px;box-shadow:var(--btn-shadow);color:var(--ink);cursor:pointer;border:0;border-radius:50%;flex:none;place-items:center;padding:0;display:grid}.cw-fine-b:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.cw-fine-b{transition:scale var(--press) var(--ease-out)}.cw-fine-b:not(:disabled):active{scale:.92}@media (prefers-reduced-motion:reduce){.cw-rb,.cw-fine-b{scale:none!important}}.cw[data-action=heating] .cw-rb-zone--heat,.cw[data-action=cooling] .cw-rb-zone--cool{background:var(--accent)}.sw-t{align-items:baseline;display:flex}.sw-value{line-height:1}.sw-t .sw-value small{letter-spacing:0;vertical-align:.34em;margin-left:1px;font-size:.62em;font-weight:400}.sw-h .sw-value{font-size:18px;font-weight:600}.sw-h .sw-value small{margin-left:1px;font-size:.78em;font-weight:600}@container hd (width>=260px){.sw:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}}@container hd (width<=259px){.sw:not(.hd--compact):not(.hd--sheet) .sw-trend{display:none}.sw:not(.hd--compact):not(.hd--sheet) .sw-t .sw-value{font-size:32px}.sw:not(.hd--compact):not(.hd--sheet) .sw-h .sw-value{font-size:17px}}.hd--compact :is(.sw-t,.sw-h){display:block}.hd--compact .sw-t .sw-value small{vertical-align:.12em;font-size:.8em;font-weight:600}.hd--compact .sw-h .sw-value{color:var(--ink-2);font-size:12.5px;font-weight:700}.hd--sheet .sw-t{display:none}.hd--sheet .sw-h .sw-value{font-size:20px}.wx-rd{min-width:0;height:var(--slot-h);line-height:var(--slot-h);flex-wrap:wrap;align-items:baseline;column-gap:12px;display:flex;overflow:hidden}.wx-rd-t{color:var(--ink);font-size:20px;font-weight:700}.wx-warn-s{display:none}@container hd (width<=259px){.wx-warn-l{display:none}.wx-warn-s{display:inline}}.wx-rd-f{color:var(--ink-2);font-size:14px;font-weight:600}.wx:not(.hd--compact):not(.hd--sheet) .wx-rd-f{font-size:15px}.hd--compact .wx-rd{justify-content:flex-end;column-gap:8px}.hd--compact .wx-rd-f{color:var(--ink-3);font-size:12.5px}.wx-hrs{grid-template-rows:auto minmax(0,1fr);align-content:start;min-height:0}.wx-hr-l{grid-template-rows:auto;grid-template-columns:repeat(auto-fit,minmax(40px,1fr));grid-auto-rows:0;row-gap:0;margin:0;padding:0;list-style:none;display:grid;overflow:hidden}.wx-hr{font-variant-numeric:tabular-nums;align-content:start;justify-items:center;gap:6px;min-width:0;display:grid}.wx-hr-t{color:var(--ink-3);font-size:12.5px;font-weight:500}.wx-hr-i svg{fill:none;stroke:currentColor;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;width:22px;height:22px;color:var(--ink);display:block}.wx-hr-v{color:var(--ink);font-size:15px;font-weight:600}.wx-hr-p{min-height:1.3em;color:var(--ink-2);font-size:11.5px;font-weight:600}.wx-hrs-none{color:var(--ink-3);font-size:13.5px;font-weight:500}.wx-stats{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;display:grid}.wx-stat{background:var(--chip);min-width:0;min-height:68px;box-shadow:inset 0 0 0 1px var(--line);border-radius:18px;align-content:start;gap:1px;padding:10px 12px;display:grid}.wx-stat-v{color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap;font-size:18px;font-weight:700}.wx-stat-v small{color:var(--ink-2);font-size:12px;font-weight:600}.wx-stat-s{color:var(--ink-3);white-space:nowrap;text-overflow:ellipsis;font-size:12px;font-weight:500;overflow:hidden}.wx-days{grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0;padding:0;list-style:none;display:grid}.wx-day{background:var(--chip);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink-2);font-variant-numeric:tabular-nums;border-radius:18px;align-content:start;justify-items:center;gap:4px;min-width:0;padding:10px 4px;font-size:12.5px;font-weight:500;display:grid}.wx-day-n{color:var(--ink);font-weight:600}.wx-day-i svg{fill:none;stroke:currentColor;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;width:22px;height:22px;color:var(--ink);display:block}.wx-day-t b{color:var(--ink);font-weight:700}.wx-day-p{min-height:1.3em;color:var(--ink-3);font-size:11.5px;font-weight:600}.cv-bar[data-kind=curtain]{--stub:14px;--fw:calc(var(--stub) + (50% - var(--stub)) * (1 - var(--v)))}.cv-bar[data-kind=curtain] .hd-track-fill{clip-path:inset(0 var(--fw) 0 var(--fw) round 99px)}.cv-bar.hd-track[data-moving] .hd-track-fill{transition:clip-path 1s linear}.cv-bar .hd-track-lab{font-size:13px}.hd--compact .cv-bar .hd-track-lab{font-size:12.5px}.hd--sheet .cv-bar .hd-track-lab{font-size:14px}.cv-bar[data-kind=curtain] .hd-track-lab{justify-content:center}.cv-oc-b{width:var(--slot-h);height:var(--slot-h);color:inherit;cursor:pointer;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:grid}.cv-oc-b>span{width:var(--btn);height:var(--btn);background:var(--btn);color:var(--ink);box-shadow:var(--btn-shadow);transition:scale var(--press) var(--ease-out), background-color .15s var(--ease-out);border-radius:50%;place-items:center;display:grid}.cv-oc-b svg{fill:none;stroke:currentColor;stroke-width:1.8px;stroke-linecap:round;stroke-linejoin:round;width:14px;height:14px}.cv-oc-b:not(:disabled):active>span{scale:.9}.cv-oc-b:focus-visible{outline:none}.cv-oc-b:focus-visible>span{outline:2px solid var(--ink);outline-offset:1px}.cv-oc-v{text-overflow:ellipsis;white-space:nowrap;text-align:center;min-width:0;font-size:14px;font-weight:600;overflow:hidden}.cv-oc-stop{height:calc(var(--slot-h) - 2 * var(--inset));padding:0 var(--pad-in);background:var(--inv-bg);color:var(--inv-fg);font:600 13.5px var(--font);cursor:pointer;transition:scale var(--press) var(--ease-out);border:0;border-radius:99px;justify-self:center;align-items:center;gap:7px;display:inline-flex}.cv-oc-stop i{background:currentColor;border-radius:2px;width:9px;height:9px}.cv-oc-stop:active{scale:.96}.cv-oc-stop:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.hd--compact .cv-oc-v{font-size:12.5px}.hd--compact .cv-oc-stop{height:var(--slot-h);font-size:12px}@media (prefers-reduced-motion:reduce){.cv-bar.hd-track[data-moving] .hd-track-fill{transition:none}.cv-oc-b>span,.cv-oc-stop{scale:none!important}}.tw-st-a{display:none}@container hd (width>=260px){.tw:not(.hd--compact) .tw-st-u{display:none}.tw:not(.hd--compact) .tw-st-a{display:inline}}.al[data-armed] .hd-orb--static{color:var(--on-accent)}.al[data-armed] .hd-orb--static .hd-orb-i{background:var(--accent)}.al[data-state=triggered] .hd-orb--static .hd-orb-i{background:var(--warn);color:var(--on-warn);box-shadow:none}.al-sw{grid-template-columns:repeat(var(--n), minmax(0, 1fr));height:var(--slot-h);min-width:0;padding:var(--inset);background:var(--groove);box-shadow:var(--groove-shadow);border-radius:99px;display:grid;position:relative}.al-thumb{top:var(--inset);bottom:var(--inset);left:var(--inset);width:calc((100% - 2 * var(--inset)) / var(--n));background:var(--btn);box-shadow:var(--btn-shadow);transform:translateX(calc(var(--i) * 100%));transition:transform .24s var(--ease-out), background-color .2s var(--ease-out), box-shadow .2s var(--ease-out);border-radius:99px;position:absolute}.al-sw[data-armed] .al-thumb{background:var(--accent);box-shadow:none}.al-seg{z-index:1;min-width:0;color:var(--ink-2);font:600 13.5px var(--font);cursor:pointer;transition:color .2s var(--ease-out), scale var(--press) var(--ease-out);background:0 0;border:0;border-radius:99px;justify-content:center;align-items:center;gap:6px;padding:0 6px;display:flex;position:relative}.al-seg:active{scale:.95}.al-seg[aria-pressed=true]{color:var(--ink);cursor:default}.al-sw[data-armed] .al-seg[aria-pressed=true]{color:var(--on-accent)}.al-seg:focus-visible{outline:2px solid var(--ink);outline-offset:-2px}.al-seg svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;flex:none;width:17px;height:17px}.al-seg-l{text-overflow:ellipsis;white-space:nowrap;min-width:0;display:none;overflow:hidden}@container hd (width>=260px){.al:not(.hd--compact) .al-seg-l{display:inline}.al:not(.hd--compact) .al-sw[data-many] .al-seg svg{display:none}}@container hd (width>=440px){.al:not(.hd--compact) .al-sw[data-many] .al-seg svg{display:block}}@container hd (width>=340px){.al:not(.hd--compact) .al-sw[data-crowd] .al-seg{flex-direction:column;gap:1px;padding:0 2px;font-size:11px;line-height:1.1}.al:not(.hd--compact) .al-sw[data-crowd] .al-seg svg{width:15px;height:15px;display:block}.al:not(.hd--compact) .al-sw[data-crowd] .al-seg-l{max-width:100%}}.hd--sheet .al-sw[data-crowd] .al-seg{flex-direction:column;gap:1px;padding:0 2px;font-size:11px;line-height:1.1}.hd--sheet .al-sw[data-crowd] .al-seg svg{width:15px;height:15px;display:block}.hd--sheet .al-sw[data-crowd] .al-seg-l{max-width:100%}.hd--sheet .al-seg-l{display:inline}.hd--compact .al-seg svg{width:15px;height:15px}.al:not(.hd--compact) :is(.al-seg,.al-cd-b):after{content:\"\";inset:calc(-1 * var(--inset)) 0;position:absolute}.hd--compact .al-sw{padding:0}.hd--compact .al-thumb{width:calc(100% / var(--n) - 2 * var(--inset));transform:translateX(calc(var(--i) * (100% + 2 * var(--inset))))}.hd--compact.al:has(.al-sw:not([data-many])) .hd-slot{width:176px}.hd--compact.al:has(.al-sw[data-many]) :is(.hd-slot,.hd-area){display:none}.hd--compact.al:has(.al-sw[data-many]) .hd-sub{display:block}@container hd (width<=359px){.hd--compact.al:has(.al-sw) :is(.hd-slot,.hd-area){display:none}.hd--compact.al:has(.al-sw) .hd-sub{display:block}}.al-st{height:var(--slot-h);min-width:0;color:var(--ink);white-space:nowrap;align-items:center;gap:8px;font-size:15px;font-weight:600;display:flex;overflow:hidden}.al-st svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;flex:none;width:17px;height:17px}.al-st-l{text-overflow:ellipsis;min-width:0;overflow:hidden}.al-st-s{display:none}.al-st-x{text-overflow:ellipsis;opacity:.72;min-width:0;margin-left:auto;padding-left:8px;font-weight:500;overflow:hidden}.al:not(.hd--compact) .al-st:not(.al-st--open){column-gap:var(--head-gap);grid-template-columns:44px minmax(0,1fr) auto;align-self:end;height:auto;padding-inline-end:var(--pad-in);display:grid}.al:not(.hd--compact) .al-st:not(.al-st--open) svg{justify-self:center}@container hd (width<=259px){.al:not(.hd--compact):not(.hd--sheet) .al-st:not(.al-st--open){column-gap:10px;padding-inline-end:0}.al:not(.hd--compact):not(.hd--sheet) .al-st:not(.al-st--open) .al-st-l{display:none}.al:not(.hd--compact):not(.hd--sheet) .al-st:not(.al-st--open) .al-st-s{text-overflow:ellipsis;min-width:0;display:inline;overflow:hidden}}.al-st--open{width:100%;padding:0 var(--pad-in);background:var(--btn);box-shadow:var(--btn-shadow);text-align:left;cursor:pointer;transition:opacity var(--press) var(--ease-out);border:0;border-radius:99px;display:none}.al-st--open:active{opacity:.6}.al-st--open:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.al-st--open .al-st-l{display:none}.al-st--open .al-st-s{text-overflow:ellipsis;min-width:0;display:inline;overflow:hidden}@container hd (width<=199px){.al-st--open .al-st-x{display:none}}@container hd (width<=259px){.al-st:not(.al-st--open) .al-st-x{display:none}}.hd--compact .al-st{justify-content:flex-end;gap:6px;padding-inline-end:var(--pad-in);font-size:13px}.hd--compact .al-st svg{width:15px;height:15px}.hd--compact :is(.al-st-l,.al-st-x){display:none}.hd--compact .al-st-s{text-overflow:ellipsis;display:inline;overflow:hidden}@container hd (width<=259px){.al:not(.hd--compact) .hd-slot:has(.al-st--open) .al-sw[data-many]{display:none}.al:not(.hd--compact) .hd-slot:has(.al-sw[data-many]) .al-st--open{display:flex}}@container hd (width<=339px){.al:not(.hd--compact) .hd-slot:has(.al-st--open) .al-sw[data-crowd]{display:none}.al:not(.hd--compact) .hd-slot:has(.al-sw[data-crowd]) .al-st--open{display:flex}}.al-cd{height:var(--slot-h);min-width:0;padding:0 var(--inset) 0 var(--pad-in);font-variant-numeric:tabular-nums;background:var(--groove);box-shadow:var(--groove-shadow);border-radius:99px;align-items:center;gap:10px;display:flex;position:relative;overflow:hidden}.al-cd-fill{background:color-mix(in oklab, var(--ink) 9%, transparent);transform-origin:0;transform:scaleX(var(--f));transition:transform 1s linear;position:absolute;inset:0}.al-cd-l{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:14px;font-weight:600;position:relative;overflow:hidden}.al-cd-t{flex:none;font-size:15px;font-weight:700;position:relative}.al-cd-b{height:calc(var(--slot-h) - 2 * var(--inset));padding:0 var(--pad-in);background:var(--inv-bg);color:var(--inv-fg);font:600 13.5px var(--font);cursor:pointer;transition:scale var(--press) var(--ease-out);border:0;border-radius:99px;flex:none;position:relative}.al-cd-b:active{scale:.95}.al-cd-b:focus-visible{outline:2px solid var(--ink);outline-offset:2px}.al-cd-wait{background:linear-gradient(90deg, transparent, color-mix(in oklab, var(--ink) 8%, transparent), transparent);width:40%;animation:al-sweep 1.8s var(--ease-in-out) infinite;position:absolute;top:0;bottom:0;left:0}@keyframes al-sweep{0%{transform:translate(-100%)}to{transform:translate(250%)}}.al .al-cd:not([data-timed]){justify-content:flex-end}.al-cd:not([data-timed]) .al-cd-l{margin-right:auto}.al .al-cd:not([data-timed]):not(:has(.al-cd-b)){padding:0 var(--pad-in);justify-content:center}.al-cd:not([data-timed]):not(:has(.al-cd-b)) .al-cd-l{flex:none;margin:0;display:block!important}@container hd (width<=259px){.al-cd-l{display:none}.al-cd{padding-left:var(--pad-in);justify-content:space-between}}.hd--compact .al-cd-l{display:none}.hd--compact .al-cd{padding-left:var(--pad-in);justify-content:space-between}.hd--compact .al-cd-b{height:var(--slot-h);font-size:12.5px}.al-alarm-b{background:var(--card-solid);color:var(--ink)}.al-cd[data-timed]:not(:has(.al-cd-b)){padding-right:16px}.hd--compact .al-cd[data-timed]:not(:has(.al-cd-b)){padding:0 var(--pad-in);justify-content:center}@container hd (width<=259px){.al-cd[data-timed]:not(:has(.al-cd-b)){padding:0 var(--pad-in);justify-content:center}}@keyframes al-wait{to{opacity:.35}}@media (prefers-reduced-motion:reduce){.al-cd-wait{animation:al-wait 1.4s var(--ease-in-out) infinite alternate;left:30%}.al-thumb{transition:background-color .2s var(--ease-out)}.al-seg,.al-cd-b{scale:none!important}}.ow{--ow-fig:clamp(26px, 6.8cqi, 30px)}.ow-bar{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:16px}.ow-vitals{display:contents}.ow-vitals>.hd-metric:only-child{grid-column:auto}.ow-bar .hd-none{grid-column:2/-1}.ow-metric{grid-template-columns:auto minmax(0,1fr);grid-template-areas:\"cue label\"\"value value\";align-content:center;gap:2px 4px;display:grid}.ow-metric--oxygen{grid-template-columns:minmax(0,1fr);grid-template-areas:\"label\"\"value\"}.ow-label{text-overflow:ellipsis;grid-area:label;min-width:0;overflow:hidden}.ow-value{min-width:0;font-size:var(--ow-fig);font-weight:var(--type-readout-weight);letter-spacing:-.03em;color:var(--ink);grid-area:value;line-height:1}.ow-value small{color:var(--ink-2);letter-spacing:0;margin-left:3px;font-size:12.5px;font-weight:600}.ow-metric--sleep{grid-template-columns:minmax(0,1fr);grid-template-areas:\"label\"\"value\"}.ow-sleep-none{height:var(--ow-fig);color:var(--ink-3);grid-area:value;align-items:flex-end;font-size:13.5px;font-weight:600;line-height:1.2;display:flex}.ow-compact-unit{display:none}@container hd (width>=260px){.ow:not(.hd--compact):not(.hd--sheet) .hd-slot{padding-inline-start:var(--read-indent)}}@container hd (width<=259px){.ow:not(.hd--compact):not(.hd--sheet) .ow-bar{column-gap:10px}.ow:not(.hd--compact):not(.hd--sheet){--ow-fig:23px}.ow:not(.hd--compact):not(.hd--sheet) .ow-value small{margin-left:1px;font-size:11px}}@container hd (width<=319px){.ow:not(.hd--compact):not(.hd--sheet) .ow-bar{grid-template-columns:minmax(0,1.35fr) minmax(max-content,.65fr);column-gap:12px}.ow:not(.hd--compact):not(.hd--sheet) .ow-vitals{align-content:center;justify-items:start;row-gap:4px;display:grid}.ow:not(.hd--compact):not(.hd--sheet) .ow-vitals .hd-none{grid-column:auto}.ow:not(.hd--compact):not(.hd--sheet) .ow-vitals .ow-metric{align-items:baseline;display:flex}.ow:not(.hd--compact):not(.hd--sheet) .ow-vitals .hd-label{display:none}.ow:not(.hd--compact):not(.hd--sheet) .ow-vitals .ow-value{letter-spacing:0;font-size:13.5px;font-weight:700;line-height:1.2}.ow:not(.hd--compact):not(.hd--sheet) .ow-vitals .ow-value small{margin-left:2px;font-size:12.5px}.ow:not(.hd--compact):not(.hd--sheet) .ow-compact-unit{display:inline}.ow:not(.hd--compact):not(.hd--sheet) .ow-heart{margin-right:3px}}.hd--compact .ow-metric.ow-metric--sleep{display:none}.hd--compact .ow-metric{align-items:baseline;column-gap:0;display:flex}.hd--compact .ow-value small{margin-left:2px;font-size:12.5px}.hd--compact .ow-compact-unit{display:inline}.hd--compact .ow-heart{margin-right:3px}.ow.hd--sheet{--ow-fig:30px}.ow-heart{width:11px;color:var(--ink-3);grid-area:cue;place-items:center;display:inline-grid}.ow-heart-i{fill:none;stroke:currentColor;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;width:100%;height:auto;display:block}.ow-heart[data-live] .ow-heart-i{animation:ow-beat 2.4s var(--ease-out) infinite;transform-origin:50% 60%}@keyframes ow-beat{0%,12%,to{scale:1}5%{scale:1.24}9%{scale:.96}}.ow[data-stale] :is(.ow-value,.ow-value small,.hd-label,.ow-heart,.hd-val){color:var(--ink-3)}.ow-sl-s{display:none}@container hd (width<=439px){.hd--compact .ow-sl-l{display:none}.hd--compact .ow-sl-s{display:inline}}@media (prefers-reduced-motion:reduce){.ow-heart[data-live] .ow-heart-i{animation:ow-fade 2.4s var(--ease-in-out) infinite alternate}@keyframes ow-fade{to{opacity:.4}}}.ow-alerts{gap:8px;display:grid}.ow-alerts ul{gap:6px;margin:0;padding:0;font-size:14px;font-weight:600;list-style:none;display:grid}.hd--compact .sn-vol,.hd--sheet .sn-vol,.hd--featured .sn-vol{display:none}@container hd (width<=259px){.hd--featured:not(.hd--sheet) .sn-vol{display:inline}}.ha-action-dock{bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:3;position:sticky}.ha-action{background:var(--card-solid);min-width:0;box-shadow:var(--shadow);color:var(--ink);font-family:var(--font);animation:ha-action-in .24s var(--ease-out);border-radius:24px;align-items:center;gap:12px;padding:10px 10px 10px 16px;display:flex}@keyframes ha-action-in{0%{opacity:0;transform:translateY(8px)}}.ha-action-i{width:18px;height:18px;color:var(--warn);flex:none;place-items:center;display:grid}.ha-action-i svg{fill:none;stroke:currentColor;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round;width:100%;height:100%}.ha-action-copy{flex:1;gap:2px;min-width:0;font-size:13.5px;line-height:1.3;display:grid}.ha-action-copy strong{color:var(--warn);font-size:14px;font-weight:700}.ha-action-copy>span{color:var(--ink-2);font-weight:500}.ha-action-buttons{flex:none;gap:8px;display:flex}.ha-action-b{background:var(--btn);min-width:72px;height:44px;box-shadow:var(--btn-shadow);color:var(--ink);font:600 13.5px var(--font);cursor:pointer;touch-action:manipulation;transition:background-color .15s var(--ease-out), box-shadow .15s var(--ease-out), scale var(--press) var(--ease-out);border:0;border-radius:99px;padding:0 14px}.ha-action-b:active{scale:.96}.ha-action-b:focus-visible{outline:2px solid var(--ink);outline-offset:2px}@media (hover:hover) and (pointer:fine){.ha-action-b:not(:disabled):hover{background:color-mix(in oklab, var(--btn) 94%, var(--ink))}}@container dash (width<=359px){.ha-action{flex-wrap:wrap;align-items:flex-start;padding:12px}.ha-action-copy{min-width:calc(100% - 30px)}.ha-action-buttons{width:100%;padding-inline-start:30px}.ha-action-b{flex:1}}@media (prefers-reduced-motion:reduce){.ha-action{animation-name:ha-action-fade}@keyframes ha-action-fade{0%{opacity:0}}.ha-action-b{scale:none!important}}\n/* NEXUS NATURA V14: Accent only, retain light card background */.hd[data-natura-kind=\"climate\"] .hd-orb-i{background:#EBC49A!important;color:#211C12!important}.hd[data-natura-kind=\"light\"][data-state=\"on\"] .hd-orb-i{background:#EBC49A!important;color:#211C12!important}.hd[data-natura-kind=\"light\"][data-state=\"on\"] .hd-pill[aria-pressed=\"true\"]{background:#EBC49A!important;color:#211C12!important}.hd[data-natura-kind=\"light\"][data-state=\"on\"] .hd-pill:not([aria-pressed]){background:#EBC49A!important;color:#211C12!important}/* NEXUS NATURA V15: Uniform OFF appearance for all lights (dimmable and non-dimmable). */.hd[data-natura-kind=\"light\"][data-state=\"off\"] .hd-orb-i{background:#FFFFFF!important;color:#172B2B!important}.hd[data-natura-kind=\"light\"][data-state=\"off\"] .hd-pill{background:#DDE2DE!important;color:#454B47!important;box-shadow:inset 0 1px 3px #00000012!important}.hd[data-natura-kind=\"light\"][data-state=\"off\"] .hd-level{--btn:#DDE2DE;--accent:#DDE2DE;--track:#DDE2DE;--fill:#DDE2DE}/* NEXUS NATURA V19: Unified muted green OFF switch surface for standard, RGB and dimmable lights. */.hd[data-natura-kind=\"light\"][data-state=\"off\"] .hd-slot .hd-track--groove,.hd[data-natura-kind=\"light\"][data-state=\"off\"] .hd-slot .hd-pill{background:#B3D1C7!important;color:#454B47!important;box-shadow:inset 0 1px 3px #00000012,inset 0 0 0 1px #567F731F!important}.hd[data-natura-kind=\"light\"][data-state=\"off\"] .hd-slot .hd-track--groove .hd-track-fill{opacity:0!important}/*$vite$:1*/"), dl(rb), console.info("Rotapfel Simple ThermCard 1.0.0");
