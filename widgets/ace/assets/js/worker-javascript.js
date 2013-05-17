"no use strict";
function initBaseUrls(e) {
    require.tlns = e
}
function initSender() {
    var e = require(null, "ace/lib/event_emitter").EventEmitter, t = require(null, "ace/lib/oop"), n = function () {
    };
    return function () {
        t.implement(this, e), this.callback = function (e, t) {
            postMessage({type: "call", id: t, data: e})
        }, this.emit = function (e, t) {
            postMessage({type: "event", name: e, data: t})
        }
    }.call(n.prototype), new n
}
if (typeof window != "undefined" && window.document)throw"atempt to load ace worker into main window instead of webWorker";
var console = {log: function () {
    var e = Array.prototype.slice.call(arguments, 0);
    postMessage({type: "log", data: e})
}, error: function () {
    var e = Array.prototype.slice.call(arguments, 0);
    postMessage({type: "log", data: e})
}}, window = {console: console}, normalizeModule = function (e, t) {
    if (t.indexOf("!") !== -1) {
        var n = t.split("!");
        return normalizeModule(e, n[0]) + "!" + normalizeModule(e, n[1])
    }
    if (t.charAt(0) == ".") {
        var r = e.split("/").slice(0, -1).join("/");
        t = r + "/" + t;
        while (t.indexOf(".") !== -1 && i != t) {
            var i = t;
            t = t.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "")
        }
    }
    return t
}, require = function (e, t) {
    if (!t.charAt)throw new Error("worker.js require() accepts only (parentId, id) as arguments");
    t = normalizeModule(e, t);
    var n = require.modules[t];
    if (n)return n.initialized || (n.initialized = !0, n.exports = n.factory().exports), n.exports;
    var r = t.split("/");
    r[0] = require.tlns[r[0]] || r[0];
    var i = r.join("/") + ".js";
    return require.id = t, importScripts(i), require(e, t)
};
require.modules = {}, require.tlns = {};
var define = function (e, t, n) {
    arguments.length == 2 ? (n = t, typeof e != "string" && (t = e, e = require.id)) : arguments.length == 1 && (n = e, e = require.id);
    if (e.indexOf("text!") === 0)return;
    var r = function (t, n) {
        return require(e, t, n)
    };
    require.modules[e] = {factory: function () {
        var e = {exports: {}}, t = n(r, e.exports, e);
        return t && (e.exports = t), e
    }}
}, main, sender;
onmessage = function (e) {
    var t = e.data;
    if (t.command) {
        if (!main[t.command])throw new Error("Unknown command:" + t.command);
        main[t.command].apply(main, t.args)
    } else if (t.init) {
        initBaseUrls(t.tlns), require(null, "ace/lib/fixoldbrowsers"), sender = initSender();
        var n = require(null, t.module)[t.classname];
        main = new n(sender)
    } else t.event && sender && sender._emit(t.event, t.data)
}, define("ace/lib/fixoldbrowsers", ["require", "exports", "module", "ace/lib/regexp", "ace/lib/es5-shim"], function (e, t, n) {
    e("./regexp"), e("./es5-shim")
}), define("ace/lib/regexp", ["require", "exports", "module"], function (e, t, n) {
    function o(e) {
        return(e.global ? "g" : "") + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.extended ? "x" : "") + (e.sticky ? "y" : "")
    }

    function u(e, t, n) {
        if (Array.prototype.indexOf)return e.indexOf(t, n);
        for (var r = n || 0; r < e.length; r++)if (e[r] === t)return r;
        return-1
    }

    var r = {exec: RegExp.prototype.exec, test: RegExp.prototype.test, match: String.prototype.match, replace: String.prototype.replace, split: String.prototype.split}, i = r.exec.call(/()??/, "")[1] === undefined, s = function () {
        var e = /^/g;
        return r.test.call(e, ""), !e.lastIndex
    }();
    if (s && i)return;
    RegExp.prototype.exec = function (e) {
        var t = r.exec.apply(this, arguments), n, a;
        if (typeof e == "string" && t) {
            !i && t.length > 1 && u(t, "") > -1 && (a = RegExp(this.source, r.replace.call(o(this), "g", "")), r.replace.call(e.slice(t.index), a, function () {
                for (var e = 1; e < arguments.length - 2; e++)arguments[e] === undefined && (t[e] = undefined)
            }));
            if (this._xregexp && this._xregexp.captureNames)for (var f = 1; f < t.length; f++)n = this._xregexp.captureNames[f - 1], n && (t[n] = t[f]);
            !s && this.global && !t[0].length && this.lastIndex > t.index && this.lastIndex--
        }
        return t
    }, s || (RegExp.prototype.test = function (e) {
        var t = r.exec.call(this, e);
        return t && this.global && !t[0].length && this.lastIndex > t.index && this.lastIndex--, !!t
    })
}), define("ace/lib/es5-shim", ["require", "exports", "module"], function (e, t, n) {
    function r() {
    }

    function w(e) {
        try {
            return Object.defineProperty(e, "sentinel", {}), "sentinel"in e
        } catch (t) {
        }
    }

    function j(e) {
        return e = +e, e !== e ? e = 0 : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e))), e
    }

    function F(e) {
        var t = typeof e;
        return e === null || t === "undefined" || t === "boolean" || t === "number" || t === "string"
    }

    function I(e) {
        var t, n, r;
        if (F(e))return e;
        n = e.valueOf;
        if (typeof n == "function") {
            t = n.call(e);
            if (F(t))return t
        }
        r = e.toString;
        if (typeof r == "function") {
            t = r.call(e);
            if (F(t))return t
        }
        throw new TypeError
    }

    Function.prototype.bind || (Function.prototype.bind = function (t) {
        var n = this;
        if (typeof n != "function")throw new TypeError("Function.prototype.bind called on incompatible " + n);
        var i = u.call(arguments, 1), s = function () {
            if (this instanceof s) {
                var e = n.apply(this, i.concat(u.call(arguments)));
                return Object(e) === e ? e : this
            }
            return n.apply(t, i.concat(u.call(arguments)))
        };
        return n.prototype && (r.prototype = n.prototype, s.prototype = new r, r.prototype = null), s
    });
    var i = Function.prototype.call, s = Array.prototype, o = Object.prototype, u = s.slice, a = i.bind(o.toString), f = i.bind(o.hasOwnProperty), l, c, h, p, d;
    if (d = f(o, "__defineGetter__"))l = i.bind(o.__defineGetter__), c = i.bind(o.__defineSetter__), h = i.bind(o.__lookupGetter__), p = i.bind(o.__lookupSetter__);
    if ([1, 2].splice(0).length != 2)if (!function () {
        function e(e) {
            var t = new Array(e + 2);
            return t[0] = t[1] = 0, t
        }

        var t = [], n;
        t.splice.apply(t, e(20)), t.splice.apply(t, e(26)), n = t.length, t.splice(5, 0, "XXX"), n + 1 == t.length;
        if (n + 1 == t.length)return!0
    }())Array.prototype.splice = function (e, t) {
        var n = this.length;
        e > 0 ? e > n && (e = n) : e == void 0 ? e = 0 : e < 0 && (e = Math.max(n + e, 0)), e + t < n || (t = n - e);
        var r = this.slice(e, e + t), i = u.call(arguments, 2), s = i.length;
        if (e === n)s && this.push.apply(this, i); else {
            var o = Math.min(t, n - e), a = e + o, f = a + s - o, l = n - a, c = n - o;
            if (f < a)for (var h = 0; h < l; ++h)this[f + h] = this[a + h]; else if (f > a)for (h = l; h--;)this[f + h] = this[a + h];
            if (s && e === c)this.length = c, this.push.apply(this, i); else {
                this.length = c + s;
                for (h = 0; h < s; ++h)this[e + h] = i[h]
            }
        }
        return r
    }; else {
        var v = Array.prototype.splice;
        Array.prototype.splice = function (e, t) {
            return arguments.length ? v.apply(this, [e === void 0 ? 0 : e, t === void 0 ? this.length - e : t].concat(u.call(arguments, 2))) : []
        }
    }
    Array.isArray || (Array.isArray = function (t) {
        return a(t) == "[object Array]"
    });
    var m = Object("a"), g = m[0] != "a" || !(0 in m);
    Array.prototype.forEach || (Array.prototype.forEach = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = arguments[1], s = -1, o = r.length >>> 0;
        if (a(t) != "[object Function]")throw new TypeError;
        while (++s < o)s in r && t.call(i, r[s], s, n)
    }), Array.prototype.map || (Array.prototype.map = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = Array(i), o = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var u = 0; u < i; u++)u in r && (s[u] = t.call(o, r[u], u, n));
        return s
    }), Array.prototype.filter || (Array.prototype.filter = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = [], o, u = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var f = 0; f < i; f++)f in r && (o = r[f], t.call(u, o, f, n) && s.push(o));
        return s
    }), Array.prototype.every || (Array.prototype.every = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var o = 0; o < i; o++)if (o in r && !t.call(s, r[o], o, n))return!1;
        return!0
    }), Array.prototype.some || (Array.prototype.some = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0, s = arguments[1];
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        for (var o = 0; o < i; o++)if (o in r && t.call(s, r[o], o, n))return!0;
        return!1
    }), Array.prototype.reduce || (Array.prototype.reduce = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0;
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        if (!i && arguments.length == 1)throw new TypeError("reduce of empty array with no initial value");
        var s = 0, o;
        if (arguments.length >= 2)o = arguments[1]; else do {
            if (s in r) {
                o = r[s++];
                break
            }
            if (++s >= i)throw new TypeError("reduce of empty array with no initial value")
        } while (!0);
        for (; s < i; s++)s in r && (o = t.call(void 0, o, r[s], s, n));
        return o
    }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function (t) {
        var n = q(this), r = g && a(this) == "[object String]" ? this.split("") : n, i = r.length >>> 0;
        if (a(t) != "[object Function]")throw new TypeError(t + " is not a function");
        if (!i && arguments.length == 1)throw new TypeError("reduceRight of empty array with no initial value");
        var s, o = i - 1;
        if (arguments.length >= 2)s = arguments[1]; else do {
            if (o in r) {
                s = r[o--];
                break
            }
            if (--o < 0)throw new TypeError("reduceRight of empty array with no initial value")
        } while (!0);
        do o in this && (s = t.call(void 0, s, r[o], o, n)); while (o--);
        return s
    });
    if (!Array.prototype.indexOf || [0, 1].indexOf(1, 2) != -1)Array.prototype.indexOf = function (t) {
        var n = g && a(this) == "[object String]" ? this.split("") : q(this), r = n.length >>> 0;
        if (!r)return-1;
        var i = 0;
        arguments.length > 1 && (i = j(arguments[1])), i = i >= 0 ? i : Math.max(0, r + i);
        for (; i < r; i++)if (i in n && n[i] === t)return i;
        return-1
    };
    if (!Array.prototype.lastIndexOf || [0, 1].lastIndexOf(0, -3) != -1)Array.prototype.lastIndexOf = function (t) {
        var n = g && a(this) == "[object String]" ? this.split("") : q(this), r = n.length >>> 0;
        if (!r)return-1;
        var i = r - 1;
        arguments.length > 1 && (i = Math.min(i, j(arguments[1]))), i = i >= 0 ? i : r - Math.abs(i);
        for (; i >= 0; i--)if (i in n && t === n[i])return i;
        return-1
    };
    Object.getPrototypeOf || (Object.getPrototypeOf = function (t) {
        return t.__proto__ || (t.constructor ? t.constructor.prototype : o)
    });
    if (!Object.getOwnPropertyDescriptor) {
        var y = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function (t, n) {
            if (typeof t != "object" && typeof t != "function" || t === null)throw new TypeError(y + t);
            if (!f(t, n))return;
            var r, i, s;
            r = {enumerable: !0, configurable: !0};
            if (d) {
                var u = t.__proto__;
                t.__proto__ = o;
                var i = h(t, n), s = p(t, n);
                t.__proto__ = u;
                if (i || s)return i && (r.get = i), s && (r.set = s), r
            }
            return r.value = t[n], r
        }
    }
    Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function (t) {
        return Object.keys(t)
    });
    if (!Object.create) {
        var b;
        Object.prototype.__proto__ === null ? b = function () {
            return{__proto__: null}
        } : b = function () {
            var e = {};
            for (var t in e)e[t] = null;
            return e.constructor = e.hasOwnProperty = e.propertyIsEnumerable = e.isPrototypeOf = e.toLocaleString = e.toString = e.valueOf = e.__proto__ = null, e
        }, Object.create = function (t, n) {
            var r;
            if (t === null)r = b(); else {
                if (typeof t != "object")throw new TypeError("typeof prototype[" + typeof t + "] != 'object'");
                var i = function () {
                };
                i.prototype = t, r = new i, r.__proto__ = t
            }
            return n !== void 0 && Object.defineProperties(r, n), r
        }
    }
    if (Object.defineProperty) {
        var E = w({}), S = typeof document == "undefined" || w(document.createElement("div"));
        if (!E || !S)var x = Object.defineProperty
    }
    if (!Object.defineProperty || x) {
        var T = "Property description must be an object: ", N = "Object.defineProperty called on non-object: ", C = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function (t, n, r) {
            if (typeof t != "object" && typeof t != "function" || t === null)throw new TypeError(N + t);
            if (typeof r != "object" && typeof r != "function" || r === null)throw new TypeError(T + r);
            if (x)try {
                return x.call(Object, t, n, r)
            } catch (i) {
            }
            if (f(r, "value"))if (d && (h(t, n) || p(t, n))) {
                var s = t.__proto__;
                t.__proto__ = o, delete t[n], t[n] = r.value, t.__proto__ = s
            } else t[n] = r.value; else {
                if (!d)throw new TypeError(C);
                f(r, "get") && l(t, n, r.get), f(r, "set") && c(t, n, r.set)
            }
            return t
        }
    }
    Object.defineProperties || (Object.defineProperties = function (t, n) {
        for (var r in n)f(n, r) && Object.defineProperty(t, r, n[r]);
        return t
    }), Object.seal || (Object.seal = function (t) {
        return t
    }), Object.freeze || (Object.freeze = function (t) {
        return t
    });
    try {
        Object.freeze(function () {
        })
    } catch (k) {
        Object.freeze = function (t) {
            return function (n) {
                return typeof n == "function" ? n : t(n)
            }
        }(Object.freeze)
    }
    Object.preventExtensions || (Object.preventExtensions = function (t) {
        return t
    }), Object.isSealed || (Object.isSealed = function (t) {
        return!1
    }), Object.isFrozen || (Object.isFrozen = function (t) {
        return!1
    }), Object.isExtensible || (Object.isExtensible = function (t) {
        if (Object(t) === t)throw new TypeError;
        var n = "";
        while (f(t, n))n += "?";
        t[n] = !0;
        var r = f(t, n);
        return delete t[n], r
    });
    if (!Object.keys) {
        var L = !0, A = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], O = A.length;
        for (var M in{toString: null})L = !1;
        Object.keys = function R(e) {
            if (typeof e != "object" && typeof e != "function" || e === null)throw new TypeError("Object.keys called on a non-object");
            var R = [];
            for (var t in e)f(e, t) && R.push(t);
            if (L)for (var n = 0, r = O; n < r; n++) {
                var i = A[n];
                f(e, i) && R.push(i)
            }
            return R
        }
    }
    Date.now || (Date.now = function () {
        return(new Date).getTime()
    });
    if ("0".split(void 0, 0).length) {
        var _ = String.prototype.split;
        String.prototype.split = function (e, t) {
            return e === void 0 && t === 0 ? [] : _.apply(this, arguments)
        }
    }
    if ("".substr && "0b".substr(-1) !== "b") {
        var D = String.prototype.substr;
        String.prototype.substr = function (e, t) {
            return D.call(this, e < 0 ? (e = this.length + e) < 0 ? 0 : e : e, t)
        }
    }
    var P = "	\n\f\r   ᠎             　\u2028\u2029﻿";
    if (!String.prototype.trim || P.trim()) {
        P = "[" + P + "]";
        var H = new RegExp("^" + P + P + "*"), B = new RegExp(P + P + "*$");
        String.prototype.trim = function () {
            if (this === undefined || this === null)throw new TypeError("can't convert " + this + " to object");
            return String(this).replace(H, "").replace(B, "")
        }
    }
    var q = function (e) {
        if (e == null)throw new TypeError("can't convert " + e + " to object");
        return Object(e)
    }
}), define("ace/lib/event_emitter", ["require", "exports", "module"], function (e, t, n) {
    var r = {};
    r._emit = r._dispatchEvent = function (e, t) {
        this._eventRegistry = this._eventRegistry || {}, this._defaultHandlers = this._defaultHandlers || {};
        var n = this._eventRegistry[e] || [], r = this._defaultHandlers[e];
        if (!n.length && !r)return;
        if (typeof t != "object" || !t)t = {};
        t.type || (t.type = e), t.stopPropagation || (t.stopPropagation = function () {
            this.propagationStopped = !0
        }), t.preventDefault || (t.preventDefault = function () {
            this.defaultPrevented = !0
        });
        for (var i = 0; i < n.length; i++) {
            n[i](t);
            if (t.propagationStopped)break
        }
        if (r && !t.defaultPrevented)return r(t)
    }, r.setDefaultHandler = function (e, t) {
        this._defaultHandlers = this._defaultHandlers || {};
        if (this._defaultHandlers[e])throw new Error("The default handler for '" + e + "' is already set");
        this._defaultHandlers[e] = t
    }, r.on = r.addEventListener = function (e, t) {
        this._eventRegistry = this._eventRegistry || {};
        var n = this._eventRegistry[e];
        n || (n = this._eventRegistry[e] = []), n.indexOf(t) == -1 && n.push(t)
    }, r.removeListener = r.removeEventListener = function (e, t) {
        this._eventRegistry = this._eventRegistry || {};
        var n = this._eventRegistry[e];
        if (!n)return;
        var r = n.indexOf(t);
        r !== -1 && n.splice(r, 1)
    }, r.removeAllListeners = function (e) {
        this._eventRegistry && (this._eventRegistry[e] = [])
    }, t.EventEmitter = r
}), define("ace/lib/oop", ["require", "exports", "module"], function (e, t, n) {
    t.inherits = function () {
        var e = function () {
        };
        return function (t, n) {
            e.prototype = n.prototype, t.super_ = n.prototype, t.prototype = new e, t.prototype.constructor = t
        }
    }(), t.mixin = function (e, t) {
        for (var n in t)e[n] = t[n]
    }, t.implement = function (e, n) {
        t.mixin(e, n)
    }
}), define("ace/mode/javascript_worker", ["require", "exports", "module", "ace/lib/oop", "ace/worker/mirror", "ace/mode/javascript/jshint"], function (require, exports, module) {
    function startRegex(e) {
        return RegExp("^(" + e.join("|") + ")")
    }

    var oop = require("../lib/oop"), Mirror = require("../worker/mirror").Mirror, lint = require("./javascript/jshint").JSHINT, disabledWarningsRe = startRegex(["Bad for in variable '(.+)'.", 'Missing "use strict"']), errorsRe = startRegex(["Unexpected", "Expected ", "Confusing (plus|minus)", "\\{a\\} unterminated regular expression", "Unclosed ", "Unmatched ", "Unbegun comment", "Bad invocation", "Missing space after", "Missing operator at"]), infoRe = startRegex(["Expected an assignment", "Bad escapement of EOL", "Unexpected comma", "Unexpected space", "Missing radix parameter.", "A leading decimal point can", "\\['{a}'\\] is better written in dot notation.", "'{a}' used out of scope"]), JavaScriptWorker = exports.JavaScriptWorker = function (e) {
        Mirror.call(this, e), this.setTimeout(500), this.setOptions()
    };
    oop.inherits(JavaScriptWorker, Mirror), function () {
        this.setOptions = function (e) {
            this.options = e || {es5: !0, esnext: !0, devel: !0, browser: !0, node: !0, laxcomma: !0, laxbreak: !0, lastsemic: !0, onevar: !1, passfail: !1, maxerr: 100, expr: !0, multistr: !0, globalstrict: !0}, this.doc.getValue() && this.deferredUpdate.schedule(100)
        }, this.changeOptions = function (e) {
            oop.mixin(this.options, e), this.doc.getValue() && this.deferredUpdate.schedule(100)
        }, this.isValidJS = function (str) {
            try {
                eval("throw 0;" + str)
            } catch (e) {
                if (e === 0)return!0
            }
            return!1
        }, this.onUpdate = function () {
            var e = this.doc.getValue();
            e = e.replace(/^#!.*\n/, "\n");
            if (!e) {
                this.sender.emit("jslint", []);
                return
            }
            var t = [], n = this.isValidJS(e) ? "warning" : "error";
            lint(e, this.options);
            var r = lint.errors, i = !1;
            for (var s = 0; s < r.length; s++) {
                var o = r[s];
                if (!o)continue;
                var u = o.raw, a = "warning";
                if (u == "Missing semicolon.") {
                    var f = o.evidence.substr(o.character);
                    f = f.charAt(f.search(/\S/)), n == "error" && f && /[\w\d{(['"]/.test(f) ? (o.reason = 'Missing ";" before statement', a = "error") : a = "info"
                } else {
                    if (disabledWarningsRe.test(u))continue;
                    infoRe.test(u) ? a = "info" : errorsRe.test(u) ? (i = !0, a = n) : u == "'{a}' is not defined." ? a = "warning" : u == "'{a}' is defined but never used." && (a = "info")
                }
                t.push({row: o.line - 1, column: o.character - 1, text: o.reason, type: a, raw: u}), i
            }
            this.sender.emit("jslint", t)
        }
    }.call(JavaScriptWorker.prototype)
}), define("ace/worker/mirror", ["require", "exports", "module", "ace/document", "ace/lib/lang"], function (e, t, n) {
    var r = e("../document").Document, i = e("../lib/lang"), s = t.Mirror = function (e) {
        this.sender = e;
        var t = this.doc = new r(""), n = this.deferredUpdate = i.deferredCall(this.onUpdate.bind(this)), s = this;
        e.on("change", function (e) {
            t.applyDeltas([e.data]), n.schedule(s.$timeout)
        })
    };
    (function () {
        this.$timeout = 500, this.setTimeout = function (e) {
            this.$timeout = e
        }, this.setValue = function (e) {
            this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout)
        }, this.getValue = function (e) {
            this.sender.callback(this.doc.getValue(), e)
        }, this.onUpdate = function () {
        }
    }).call(s.prototype)
}), define("ace/document", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter", "ace/range", "ace/anchor"], function (e, t, n) {
    var r = e("./lib/oop"), i = e("./lib/event_emitter").EventEmitter, s = e("./range").Range, o = e("./anchor").Anchor, u = function (e) {
        this.$lines = [], e.length == 0 ? this.$lines = [""] : Array.isArray(e) ? this.insertLines(0, e) : this.insert({row: 0, column: 0}, e)
    };
    (function () {
        r.implement(this, i), this.setValue = function (e) {
            var t = this.getLength();
            this.remove(new s(0, 0, t, this.getLine(t - 1).length)), this.insert({row: 0, column: 0}, e)
        }, this.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter())
        }, this.createAnchor = function (e, t) {
            return new o(this, e, t)
        }, "aaa".split(/a/).length == 0 ? this.$split = function (e) {
            return e.replace(/\r\n|\r/g, "\n").split("\n")
        } : this.$split = function (e) {
            return e.split(/\r\n|\r|\n/)
        }, this.$detectNewLine = function (e) {
            var t = e.match(/^.*?(\r\n|\r|\n)/m);
            t ? this.$autoNewLine = t[1] : this.$autoNewLine = "\n"
        }, this.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
                case"windows":
                    return"\r\n";
                case"unix":
                    return"\n";
                default:
                    return this.$autoNewLine
            }
        }, this.$autoNewLine = "\n", this.$newLineMode = "auto", this.setNewLineMode = function (e) {
            if (this.$newLineMode === e)return;
            this.$newLineMode = e
        }, this.getNewLineMode = function () {
            return this.$newLineMode
        }, this.isNewLine = function (e) {
            return e == "\r\n" || e == "\r" || e == "\n"
        }, this.getLine = function (e) {
            return this.$lines[e] || ""
        }, this.getLines = function (e, t) {
            return this.$lines.slice(e, t + 1)
        }, this.getAllLines = function () {
            return this.getLines(0, this.getLength())
        }, this.getLength = function () {
            return this.$lines.length
        }, this.getTextRange = function (e) {
            if (e.start.row == e.end.row)return this.$lines[e.start.row].substring(e.start.column, e.end.column);
            var t = this.getLines(e.start.row + 1, e.end.row - 1);
            return t.unshift((this.$lines[e.start.row] || "").substring(e.start.column)), t.push((this.$lines[e.end.row] || "").substring(0, e.end.column)), t.join(this.getNewLineCharacter())
        }, this.$clipPosition = function (e) {
            var t = this.getLength();
            return e.row >= t && (e.row = Math.max(0, t - 1), e.column = this.getLine(t - 1).length), e
        }, this.insert = function (e, t) {
            if (!t || t.length === 0)return e;
            e = this.$clipPosition(e), this.getLength() <= 1 && this.$detectNewLine(t);
            var n = this.$split(t), r = n.splice(0, 1)[0], i = n.length == 0 ? null : n.splice(n.length - 1, 1)[0];
            return e = this.insertInLine(e, r), i !== null && (e = this.insertNewLine(e), e = this.insertLines(e.row, n), e = this.insertInLine(e, i || "")), e
        }, this.insertLines = function (e, t) {
            if (t.length == 0)return{row: e, column: 0};
            if (t.length > 65535) {
                var n = this.insertLines(e, t.slice(65535));
                t = t.slice(0, 65535)
            }
            var r = [e, 0];
            r.push.apply(r, t), this.$lines.splice.apply(this.$lines, r);
            var i = new s(e, 0, e + t.length, 0), o = {action: "insertLines", range: i, lines: t};
            return this._emit("change", {data: o}), n || i.end
        }, this.insertNewLine = function (e) {
            e = this.$clipPosition(e);
            var t = this.$lines[e.row] || "";
            this.$lines[e.row] = t.substring(0, e.column), this.$lines.splice(e.row + 1, 0, t.substring(e.column, t.length));
            var n = {row: e.row + 1, column: 0}, r = {action: "insertText", range: s.fromPoints(e, n), text: this.getNewLineCharacter()};
            return this._emit("change", {data: r}), n
        }, this.insertInLine = function (e, t) {
            if (t.length == 0)return e;
            var n = this.$lines[e.row] || "";
            this.$lines[e.row] = n.substring(0, e.column) + t + n.substring(e.column);
            var r = {row: e.row, column: e.column + t.length}, i = {action: "insertText", range: s.fromPoints(e, r), text: t};
            return this._emit("change", {data: i}), r
        }, this.remove = function (e) {
            e.start = this.$clipPosition(e.start), e.end = this.$clipPosition(e.end);
            if (e.isEmpty())return e.start;
            var t = e.start.row, n = e.end.row;
            if (e.isMultiLine()) {
                var r = e.start.column == 0 ? t : t + 1, i = n - 1;
                e.end.column > 0 && this.removeInLine(n, 0, e.end.column), i >= r && this.removeLines(r, i), r != t && (this.removeInLine(t, e.start.column, this.getLine(t).length), this.removeNewLine(e.start.row))
            } else this.removeInLine(t, e.start.column, e.end.column);
            return e.start
        }, this.removeInLine = function (e, t, n) {
            if (t == n)return;
            var r = new s(e, t, e, n), i = this.getLine(e), o = i.substring(t, n), u = i.substring(0, t) + i.substring(n, i.length);
            this.$lines.splice(e, 1, u);
            var a = {action: "removeText", range: r, text: o};
            return this._emit("change", {data: a}), r.start
        }, this.removeLines = function (e, t) {
            var n = new s(e, 0, t + 1, 0), r = this.$lines.splice(e, t - e + 1), i = {action: "removeLines", range: n, nl: this.getNewLineCharacter(), lines: r};
            return this._emit("change", {data: i}), r
        }, this.removeNewLine = function (e) {
            var t = this.getLine(e), n = this.getLine(e + 1), r = new s(e, t.length, e + 1, 0), i = t + n;
            this.$lines.splice(e, 2, i);
            var o = {action: "removeText", range: r, text: this.getNewLineCharacter()};
            this._emit("change", {data: o})
        }, this.replace = function (e, t) {
            if (t.length == 0 && e.isEmpty())return e.start;
            if (t == this.getTextRange(e))return e.end;
            this.remove(e);
            if (t)var n = this.insert(e.start, t); else n = e.start;
            return n
        }, this.applyDeltas = function (e) {
            for (var t = 0; t < e.length; t++) {
                var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
                n.action == "insertLines" ? this.insertLines(r.start.row, n.lines) : n.action == "insertText" ? this.insert(r.start, n.text) : n.action == "removeLines" ? this.removeLines(r.start.row, r.end.row - 1) : n.action == "removeText" && this.remove(r)
            }
        }, this.revertDeltas = function (e) {
            for (var t = e.length - 1; t >= 0; t--) {
                var n = e[t], r = s.fromPoints(n.range.start, n.range.end);
                n.action == "insertLines" ? this.removeLines(r.start.row, r.end.row - 1) : n.action == "insertText" ? this.remove(r) : n.action == "removeLines" ? this.insertLines(r.start.row, n.lines) : n.action == "removeText" && this.insert(r.start, n.text)
            }
        }, this.indexToPosition = function (e, t) {
            var n = this.$lines || this.getAllLines(), r = this.getNewLineCharacter().length;
            for (var i = t || 0, s = n.length; i < s; i++) {
                e -= n[i].length + r;
                if (e < 0)return{row: i, column: e + n[i].length + r}
            }
            return{row: s - 1, column: n[s - 1].length}
        }, this.positionToIndex = function (e, t) {
            var n = this.$lines || this.getAllLines(), r = this.getNewLineCharacter().length, i = 0, s = Math.min(e.row, n.length);
            for (var o = t || 0; o < s; ++o)i += n[o].length;
            return i + r * o + e.column
        }
    }).call(u.prototype), t.Document = u
}), define("ace/range", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e, t, n, r) {
        this.start = {row: e, column: t}, this.end = {row: n, column: r}
    };
    (function () {
        this.isEqual = function (e) {
            return this.start.row == e.start.row && this.end.row == e.end.row && this.start.column == e.start.column && this.end.column == e.end.column
        }, this.toString = function () {
            return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
        }, this.contains = function (e, t) {
            return this.compare(e, t) == 0
        }, this.compareRange = function (e) {
            var t, n = e.end, r = e.start;
            return t = this.compare(n.row, n.column), t == 1 ? (t = this.compare(r.row, r.column), t == 1 ? 2 : t == 0 ? 1 : 0) : t == -1 ? -2 : (t = this.compare(r.row, r.column), t == -1 ? -1 : t == 1 ? 42 : 0)
        }, this.comparePoint = function (e) {
            return this.compare(e.row, e.column)
        }, this.containsRange = function (e) {
            return this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0
        }, this.intersects = function (e) {
            var t = this.compareRange(e);
            return t == -1 || t == 0 || t == 1
        }, this.isEnd = function (e, t) {
            return this.end.row == e && this.end.column == t
        }, this.isStart = function (e, t) {
            return this.start.row == e && this.start.column == t
        }, this.setStart = function (e, t) {
            typeof e == "object" ? (this.start.column = e.column, this.start.row = e.row) : (this.start.row = e, this.start.column = t)
        }, this.setEnd = function (e, t) {
            typeof e == "object" ? (this.end.column = e.column, this.end.row = e.row) : (this.end.row = e, this.end.column = t)
        }, this.inside = function (e, t) {
            return this.compare(e, t) == 0 ? this.isEnd(e, t) || this.isStart(e, t) ? !1 : !0 : !1
        }, this.insideStart = function (e, t) {
            return this.compare(e, t) == 0 ? this.isEnd(e, t) ? !1 : !0 : !1
        }, this.insideEnd = function (e, t) {
            return this.compare(e, t) == 0 ? this.isStart(e, t) ? !1 : !0 : !1
        }, this.compare = function (e, t) {
            return!this.isMultiLine() && e === this.start.row ? t < this.start.column ? -1 : t > this.end.column ? 1 : 0 : e < this.start.row ? -1 : e > this.end.row ? 1 : this.start.row === e ? t >= this.start.column ? 0 : -1 : this.end.row === e ? t <= this.end.column ? 0 : 1 : 0
        }, this.compareStart = function (e, t) {
            return this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
        }, this.compareEnd = function (e, t) {
            return this.end.row == e && this.end.column == t ? 1 : this.compare(e, t)
        }, this.compareInside = function (e, t) {
            return this.end.row == e && this.end.column == t ? 1 : this.start.row == e && this.start.column == t ? -1 : this.compare(e, t)
        }, this.clipRows = function (e, t) {
            if (this.end.row > t)var n = {row: t + 1, column: 0};
            if (this.start.row > t)var i = {row: t + 1, column: 0};
            if (this.start.row < e)var i = {row: e, column: 0};
            if (this.end.row < e)var n = {row: e, column: 0};
            return r.fromPoints(i || this.start, n || this.end)
        }, this.extend = function (e, t) {
            var n = this.compare(e, t);
            if (n == 0)return this;
            if (n == -1)var i = {row: e, column: t}; else var s = {row: e, column: t};
            return r.fromPoints(i || this.start, s || this.end)
        }, this.isEmpty = function () {
            return this.start.row == this.end.row && this.start.column == this.end.column
        }, this.isMultiLine = function () {
            return this.start.row !== this.end.row
        }, this.clone = function () {
            return r.fromPoints(this.start, this.end)
        }, this.collapseRows = function () {
            return this.end.column == 0 ? new r(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new r(this.start.row, 0, this.end.row, 0)
        }, this.toScreenRange = function (e) {
            var t = e.documentToScreenPosition(this.start), n = e.documentToScreenPosition(this.end);
            return new r(t.row, t.column, n.row, n.column)
        }
    }).call(r.prototype), r.fromPoints = function (e, t) {
        return new r(e.row, e.column, t.row, t.column)
    }, t.Range = r
}), define("ace/anchor", ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"], function (e, t, n) {
    var r = e("./lib/oop"), i = e("./lib/event_emitter").EventEmitter, s = t.Anchor = function (e, t, n) {
        this.document = e, typeof n == "undefined" ? this.setPosition(t.row, t.column) : this.setPosition(t, n), this.$onChange = this.onChange.bind(this), e.on("change", this.$onChange)
    };
    (function () {
        r.implement(this, i), this.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column)
        }, this.getDocument = function () {
            return this.document
        }, this.onChange = function (e) {
            var t = e.data, n = t.range;
            if (n.start.row == n.end.row && n.start.row != this.row)return;
            if (n.start.row > this.row)return;
            if (n.start.row == this.row && n.start.column > this.column)return;
            var r = this.row, i = this.column;
            t.action === "insertText" ? n.start.row === r && n.start.column <= i ? n.start.row === n.end.row ? i += n.end.column - n.start.column : (i -= n.start.column, r += n.end.row - n.start.row) : n.start.row !== n.end.row && n.start.row < r && (r += n.end.row - n.start.row) : t.action === "insertLines" ? n.start.row <= r && (r += n.end.row - n.start.row) : t.action == "removeText" ? n.start.row == r && n.start.column < i ? n.end.column >= i ? i = n.start.column : i = Math.max(0, i - (n.end.column - n.start.column)) : n.start.row !== n.end.row && n.start.row < r ? (n.end.row == r && (i = Math.max(0, i - n.end.column) + n.start.column), r -= n.end.row - n.start.row) : n.end.row == r && (r -= n.end.row - n.start.row, i = Math.max(0, i - n.end.column) + n.start.column) : t.action == "removeLines" && n.start.row <= r && (n.end.row <= r ? r -= n.end.row - n.start.row : (r = n.start.row, i = 0)), this.setPosition(r, i, !0)
        }, this.setPosition = function (e, t, n) {
            var r;
            n ? r = {row: e, column: t} : r = this.$clipPositionToDocument(e, t);
            if (this.row == r.row && this.column == r.column)return;
            var i = {row: this.row, column: this.column};
            this.row = r.row, this.column = r.column, this._emit("change", {old: i, value: r})
        }, this.detach = function () {
            this.document.removeEventListener("change", this.$onChange)
        }, this.$clipPositionToDocument = function (e, t) {
            var n = {};
            return e >= this.document.getLength() ? (n.row = Math.max(0, this.document.getLength() - 1), n.column = this.document.getLine(n.row).length) : e < 0 ? (n.row = 0, n.column = 0) : (n.row = e, n.column = Math.min(this.document.getLine(n.row).length, Math.max(0, t))), t < 0 && (n.column = 0), n
        }
    }).call(s.prototype)
}), define("ace/lib/lang", ["require", "exports", "module"], function (e, t, n) {
    t.stringReverse = function (e) {
        return e.split("").reverse().join("")
    }, t.stringRepeat = function (e, t) {
        var n = "";
        while (t > 0) {
            t & 1 && (n += e);
            if (t >>= 1)e += e
        }
        return n
    };
    var r = /^\s\s*/, i = /\s\s*$/;
    t.stringTrimLeft = function (e) {
        return e.replace(r, "")
    }, t.stringTrimRight = function (e) {
        return e.replace(i, "")
    }, t.copyObject = function (e) {
        var t = {};
        for (var n in e)t[n] = e[n];
        return t
    }, t.copyArray = function (e) {
        var t = [];
        for (var n = 0, r = e.length; n < r; n++)e[n] && typeof e[n] == "object" ? t[n] = this.copyObject(e[n]) : t[n] = e[n];
        return t
    }, t.deepCopy = function (e) {
        if (typeof e != "object")return e;
        var t = e.constructor();
        for (var n in e)typeof e[n] == "object" ? t[n] = this.deepCopy(e[n]) : t[n] = e[n];
        return t
    }, t.arrayToMap = function (e) {
        var t = {};
        for (var n = 0; n < e.length; n++)t[e[n]] = 1;
        return t
    }, t.createMap = function (e) {
        var t = Object.create(null);
        for (var n in e)t[n] = e[n];
        return t
    }, t.arrayRemove = function (e, t) {
        for (var n = 0; n <= e.length; n++)t === e[n] && e.splice(n, 1)
    }, t.escapeRegExp = function (e) {
        return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1")
    }, t.escapeHTML = function (e) {
        return e.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;")
    }, t.getMatchOffsets = function (e, t) {
        var n = [];
        return e.replace(t, function (e) {
            n.push({offset: arguments[arguments.length - 2], length: e.length})
        }), n
    }, t.deferredCall = function (e) {
        var t = null, n = function () {
            t = null, e()
        }, r = function (e) {
            return r.cancel(), t = setTimeout(n, e || 0), r
        };
        return r.schedule = r, r.call = function () {
            return this.cancel(), e(), r
        }, r.cancel = function () {
            return clearTimeout(t), t = null, r
        }, r
    }, t.delayedCall = function (e, t) {
        var n = null, r = function () {
            n = null, e()
        }, i = function (e) {
            n && clearTimeout(n), n = setTimeout(r, e || t)
        };
        return i.delay = i, i.schedule = function (e) {
            n == null && (n = setTimeout(r, e || 0))
        }, i.call = function () {
            this.cancel(), e()
        }, i.cancel = function () {
            n && clearTimeout(n), n = null
        }, i.isPending = function () {
            return n
        }, i
    }
}), define("ace/mode/javascript/jshint", ["require", "exports", "module"], function (e, t, n) {
    var r = function () {
        function ot() {
        }

        function ut(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }

        function at(e, t) {
            i[e] === undefined && n[e] === undefined && bt("Bad option: '" + e + "'.", t)
        }

        function ft(e) {
            return Object.prototype.toString.call(e) === "[object String]"
        }

        function lt(e) {
            return e >= "a" && e <= "z￿" || e >= "A" && e <= "Z￿"
        }

        function ct(e) {
            return e >= "0" && e <= "9"
        }

        function ht(e, t) {
            return e ? !e.identifier || e.value !== t ? !1 : !0 : !1
        }

        function pt(e, t) {
            return e.replace(/\{([^{}]*)\}/g, function (e, n) {
                var r = t[n];
                return typeof r == "string" || typeof r == "number" ? r : e
            })
        }

        function dt(e, t) {
            var n;
            for (n in t)ut(t, n) && !ut(r.blacklist, n) && (e[n] = t[n])
        }

        function vt() {
            Object.keys(r.blacklist).forEach(function (e) {
                delete O[e]
            })
        }

        function mt() {
            A.couch && dt(O, a), A.rhino && dt(O, H), A.prototypejs && dt(O, D), A.node && (dt(O, k), A.globalstrict = !0), A.devel && dt(O, l), A.dojo && dt(O, c), A.browser && dt(O, u), A.nonstandard && dt(O, I), A.jquery && dt(O, w), A.mootools && dt(O, N), A.worker && dt(O, J), A.wsh && dt(O, K), A.esnext && V(), A.globalstrict && A.strict !== !1 && (A.strict = !0), A.yui && dt(O, Q)
        }

        function gt(e, t, n) {
            var r = Math.floor(t / E.length * 100);
            throw{name: "JSHintError", line: t, character: n, message: e + " (" + r + "% scanned).", raw: e}
        }

        function yt(e, t, n, i) {
            return r.undefs.push([e, t, n, i])
        }

        function bt(e, t, n, i, s, o) {
            var u, a, f;
            return t = t || C, t.id === "(end)" && (t = z), a = t.line || 0, u = t.from || 0, f = {id: "(error)", raw: e, evidence: E[a - 1] || "", line: a, character: u, scope: r.scope, a: n, b: i, c: s, d: o}, f.reason = pt(e, f), r.errors.push(f), A.passfail && gt("Stopping. ", a, u), $ += 1, $ >= A.maxerr && gt("Too many errors.", a, u), f
        }

        function wt(e, t, n, r, i, s, o) {
            return bt(e, {line: t, from: n}, r, i, s, o)
        }

        function Et(e, t, n, r, i, s) {
            bt(e, t, n, r, i, s)
        }

        function St(e, t, n, r, i, s, o) {
            return Et(e, {line: t, from: n}, r, i, s, o)
        }

        function xt(e, t) {
            var n;
            return n = {id: "(internal)", elem: e, value: t}, r.internals.push(n), n
        }

        function Nt(e, t, n) {
            e === "hasOwnProperty" && bt("'hasOwnProperty' is a really bad name."), t === "exception" && ut(h["(context)"], e) && h[e] !== !0 && !A.node && bt("Value of '{a}' may be overwritten in IE.", C, e), ut(h, e) && !h["(global)"] && (h[e] === !0 ? A.latedef && bt("'{a}' was used before it was defined.", C, e) : !A.shadow && t !== "exception" && bt("'{a}' is already defined.", C, e)), h[e] = t, n && (h["(tokens)"][e] = n), h["(global)"] ? (v[e] = h, ut(m, e) && (A.latedef && bt("'{a}' was used before it was defined.", C, e), delete m[e])) : B[e] = h
        }

        function Ct() {
            var e = C, t = e.value, i = A.quotmark, u = {}, a, l, c, p, d, v, m;
            switch (t) {
                case"*/":
                    Et("Unbegun comment.");
                    break;
                case"/*members":
                case"/*member":
                    t = "/*members", T || (T = {}), l = T, A.quotmark = !1;
                    break;
                case"/*jshint":
                case"/*jslint":
                    l = A, c = n;
                    break;
                case"/*global":
                    l = u;
                    break;
                default:
                    Et("What?")
            }
            p = Tt.token();
            e:for (; ;) {
                m = !1;
                for (; ;) {
                    if (p.type === "special" && p.value === "*/")break e;
                    if (p.id !== "(endline)" && p.id !== ",")break;
                    p = Tt.token()
                }
                t === "/*global" && p.value === "-" && (m = !0, p = Tt.token()), p.type !== "(string)" && p.type !== "(identifier)" && t !== "/*members" && Et("Bad option.", p), v = Tt.token();
                if (v.id === ":") {
                    v = Tt.token(), l === T && Et("Expected '{a}' and instead saw '{b}'.", p, "*/", ":"), t === "/*jshint" && at(p.value, p);
                    var g = ["maxstatements", "maxparams", "maxdepth", "maxcomplexity", "maxerr", "maxlen", "indent"];
                    if (g.indexOf(p.value) > -1 && (t === "/*jshint" || t === "/*jslint"))a = +v.value, (typeof a != "number" || !isFinite(a) || a <= 0 || Math.floor(a) !== a) && Et("Expected a small integer and instead saw '{a}'.", v, v.value), p.value === "indent" && (l.white = !0), l[p.value] = a; else if (p.value === "validthis")h["(global)"] ? Et("Option 'validthis' can't be used in a global scope.") : v.value === "true" || v.value === "false" ? l[p.value] = v.value === "true" : Et("Bad option value.", v); else if (p.value === "quotmark" && t === "/*jshint")switch (v.value) {
                        case"true":
                            l.quotmark = !0;
                            break;
                        case"false":
                            l.quotmark = !1;
                            break;
                        case"double":
                        case"single":
                            l.quotmark = v.value;
                            break;
                        default:
                            Et("Bad option value.", v)
                    } else v.value === "true" || v.value === "false" ? (t === "/*jslint" ? (d = o[p.value] || p.value, l[d] = v.value === "true", s[d] !== undefined && (l[d] = !l[d])) : l[p.value] = v.value === "true", p.value === "newcap" && (l["(explicitNewcap)"] = !0)) : Et("Bad option value.", v);
                    p = Tt.token()
                } else(t === "/*jshint" || t === "/*jslint") && Et("Missing option value.", p), l[p.value] = !1, t === "/*global" && m === !0 && (r.blacklist[p.value] = p.value, vt()), p = v
            }
            t === "/*members" && (A.quotmark = i), dt(O, u);
            for (var y in u)ut(u, y) && (f[y] = e);
            c && mt()
        }

        function kt(e) {
            var t = e || 0, n = 0, r;
            while (n <= t)r = S[n], r || (r = S[n] = Tt.token()), n += 1;
            return r
        }

        function Lt(t, n) {
            switch (z.id) {
                case"(number)":
                    C.id === "." && bt("A dot following a number can be confused with a decimal point.", z);
                    break;
                case"-":
                    (C.id === "-" || C.id === "--") && bt("Confusing minusses.");
                    break;
                case"+":
                    (C.id === "+" || C.id === "++") && bt("Confusing plusses.")
            }
            if (z.type === "(string)" || z.identifier)e = z.value;
            t && C.id !== t && (n ? C.id === "(end)" ? bt("Unmatched '{a}'.", n, n.id) : bt("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.", C, t, n.id, n.line, C.value) : (C.type !== "(identifier)" || C.value !== t) && bt("Expected '{a}' and instead saw '{b}'.", C, t, C.value)), _ = z, z = C;
            for (; ;) {
                C = S.shift() || Tt.token();
                if (C.id === "(end)" || C.id === "(error)")return;
                if (C.type === "special")Ct(); else if (C.id !== "(endline)")break
            }
        }

        function At(t, n) {
            var r, i = !1, s = !1;
            C.id === "(end)" && Et("Unexpected early end of program.", z), Lt(), n && (e = "anonymous", h["(verb)"] = z.value);
            if (n === !0 && z.fud)r = z.fud(); else {
                if (z.nud)r = z.nud(); else {
                    if (C.type === "(number)" && z.id === ".")return bt("A leading decimal point can be confused with a dot: '.{a}'.", z, C.value), Lt(), z;
                    Et("Expected an identifier and instead saw '{a}'.", z, z.id)
                }
                while (t < C.lbp)i = z.value === "Array", s = z.value === "Object", r && (r.value || r.first && r.first.value) && (r.value !== "new" || r.first && r.first.value && r.first.value === ".") && (i = !1, r.value !== z.value && (s = !1)), Lt(), i && z.id === "(" && C.id === ")" && bt("Use the array literal notation [].", z), s && z.id === "(" && C.id === ")" && bt("Use the object literal notation {}.", z), z.led ? r = z.led(r) : Et("Expected an operator and instead saw '{a}'.", z, z.id)
            }
            return r
        }

        function Ot(e, t) {
            e = e || z, t = t || C, A.white && e.character !== t.from && e.line === t.line && (e.from += e.character - e.from, bt("Unexpected space after '{a}'.", e, e.value))
        }

        function Mt(e, t) {
            e = e || z, t = t || C, A.white && (e.character !== t.from || e.line !== t.line) && bt("Unexpected space before '{a}'.", t, t.value)
        }

        function _t(e, t) {
            e = e || z, t = t || C, A.white && !e.comment && e.line === t.line && Ot(e, t)
        }

        function Dt(e, t) {
            if (A.white) {
                e = e || z, t = t || C;
                if (e.value === ";" && t.value === ";")return;
                e.line === t.line && e.character === t.from && (e.from += e.character - e.from, bt("Missing space after '{a}'.", e, e.value))
            }
        }

        function Pt(e, t) {
            e = e || z, t = t || C, !A.laxbreak && e.line !== t.line ? bt("Bad line breaking before '{a}'.", t, t.id) : A.white && (e = e || z, t = t || C, e.character === t.from && (e.from += e.character - e.from, bt("Missing space after '{a}'.", e, e.value)))
        }

        function Ht(e) {
            var t;
            A.white && C.id !== "(end)" && (t = y + (e || 0), C.from !== t && bt("Expected '{a}' to have an indentation at {b} instead at {c}.", C, C.value, t, C.from))
        }

        function Bt(e) {
            e = e || z, e.line !== C.line && bt("Line breaking error '{a}'.", e, e.value)
        }

        function jt() {
            z.line !== C.line ? A.laxcomma || (jt.first && (bt("Comma warnings can be turned off with 'laxcomma'"), jt.first = !1), bt("Bad line breaking before '{a}'.", z, C.id)) : !z.comment && z.character !== C.from && A.white && (z.from += z.character - z.from, bt("Unexpected space after '{a}'.", z, z.value)), Lt(","), Dt(z, C)
        }

        function Ft(e, t) {
            var n = R[e];
            if (!n || typeof n != "object")R[e] = n = {id: e, lbp: t, value: e};
            return n
        }

        function It(e) {
            return Ft(e, 0)
        }

        function qt(e, t) {
            var n = It(e);
            return n.identifier = n.reserved = !0, n.fud = t, n
        }

        function Rt(e, t) {
            var n = qt(e, t);
            return n.block = !0, n
        }

        function Ut(e) {
            var t = e.id.charAt(0);
            if (t >= "a" && t <= "z" || t >= "A" && t <= "Z")e.identifier = e.reserved = !0;
            return e
        }

        function zt(e, t) {
            var n = Ft(e, 150);
            return Ut(n), n.nud = typeof t == "function" ? t : function () {
                this.right = At(150), this.arity = "unary";
                if (this.id === "++" || this.id === "--")A.plusplus ? bt("Unexpected use of '{a}'.", this, this.id) : (!this.right.identifier || this.right.reserved) && this.right.id !== "." && this.right.id !== "[" && bt("Bad operand.", this);
                return this
            }, n
        }

        function Wt(e, t) {
            var n = It(e);
            return n.type = e, n.nud = t, n
        }

        function Xt(e, t) {
            var n = Wt(e, t);
            return n.identifier = n.reserved = !0, n
        }

        function Vt(e, t) {
            return Xt(e, function () {
                return typeof t == "function" && t(this), this
            })
        }

        function $t(e, t, n, r) {
            var i = Ft(e, n);
            return Ut(i), i.led = function (i) {
                return r || (Pt(_, z), Dt(z, C)), e === "in" && i.id === "!" && bt("Confusing use of '{a}'.", i, "!"), typeof t == "function" ? t(i, this) : (this.left = i, this.right = At(n), this)
            }, i
        }

        function Jt(e, t) {
            var n = Ft(e, 100);
            return n.led = function (e) {
                Pt(_, z), Dt(z, C);
                var n = At(100);
                return ht(e, "NaN") || ht(n, "NaN") ? bt("Use the isNaN function to compare with NaN.", this) : t && t.apply(this, [e, n]), e.id === "!" && bt("Confusing use of '{a}'.", e, "!"), n.id === "!" && bt("Confusing use of '{a}'.", n, "!"), this.left = e, this.right = n, this
            }, n
        }

        function Kt(e) {
            return e && (e.type === "(number)" && +e.value === 0 || e.type === "(string)" && e.value === "" || e.type === "null" && !A.eqnull || e.type === "true" || e.type === "false" || e.type === "undefined")
        }

        function Qt(e) {
            return Ft(e, 20).exps = !0, $t(e, function (e, t) {
                t.left = e, O[e.value] === !1 && B[e.value]["(global)"] === !0 ? bt("Read only.", e) : e["function"] && bt("'{a}' is a function.", e, e.value);
                if (e) {
                    A.esnext && h[e.value] === "const" && bt("Attempting to override '{a}' which is a constant", e, e.value);
                    if (e.id === "." || e.id === "[")return(!e.left || e.left.value === "arguments") && bt("Bad assignment.", t), t.right = At(19), t;
                    if (e.identifier && !e.reserved)return h[e.value] === "exception" && bt("Do not assign to the exception parameter.", e), t.right = At(19), t;
                    e === R["function"] && bt("Expected an identifier in an assignment and instead saw a function invocation.", z)
                }
                Et("Bad assignment.", t)
            }, 20)
        }

        function Gt(e, t, n) {
            var r = Ft(e, n);
            return Ut(r), r.led = typeof t == "function" ? t : function (e) {
                return A.bitwise && bt("Unexpected use of '{a}'.", this, this.id), this.left = e, this.right = At(n), this
            }, r
        }

        function Yt(e) {
            return Ft(e, 20).exps = !0, $t(e, function (e, t) {
                A.bitwise && bt("Unexpected use of '{a}'.", t, t.id), Dt(_, z), Dt(z, C);
                if (e)return e.id === "." || e.id === "[" || e.identifier && !e.reserved ? (At(19), t) : (e === R["function"] && bt("Expected an identifier in an assignment, and instead saw a function invocation.", z), t);
                Et("Bad assignment.", t)
            }, 20)
        }

        function Zt(e) {
            var t = Ft(e, 150);
            return t.led = function (e) {
                return A.plusplus ? bt("Unexpected use of '{a}'.", this, this.id) : (!e.identifier || e.reserved) && e.id !== "." && e.id !== "[" && bt("Bad operand.", this), this.left = e, this
            }, t
        }

        function en(e) {
            if (C.identifier)return Lt(), z.reserved && !A.es5 && (!e || z.value !== "undefined") && bt("Expected an identifier and instead saw '{a}' (a reserved word).", z, z.id), z.value
        }

        function tn(e) {
            var t = en(e);
            if (t)return t;
            z.id === "function" && C.id === "(" ? bt("Missing name in function declaration.") : Et("Expected an identifier and instead saw '{a}'.", C, C.value)
        }

        function nn(e) {
            var t = 0, n;
            if (C.id !== ";" || L)return;
            for (; ;) {
                n = kt(t);
                if (n.reach)return;
                if (n.id !== "(endline)") {
                    if (n.id === "function") {
                        if (!A.latedef)break;
                        bt("Inner functions should be listed at the top of the outer function.", n);
                        break
                    }
                    bt("Unreachable '{a}' after '{b}'.", n, n.value, e);
                    break
                }
                t += 1
            }
        }

        function rn(e) {
            var t = y, n, r = B, i = C;
            if (i.id === ";") {
                Lt(";");
                return
            }
            i.identifier && !i.reserved && kt().id === ":" && (Lt(), Lt(":"), B = Object.create(r), Nt(i.value, "label"), !C.labelled && C.value !== "{" && bt("Label '{a}' on {b} statement.", C, i.value, C.value), it.test(i.value + ":") && bt("Label '{a}' looks like a javascript url.", i, i.value), C.label = i.value, i = C);
            if (i.id === "{") {
                un(!0, !0);
                return
            }
            e || Ht(), n = At(0, !0);
            if (!i.block) {
                !A.expr && (!n || !n.exps) ? bt("Expected an assignment or function call and instead saw an expression.", z) : A.nonew && n.id === "(" && n.left.id === "new" && bt("Do not use 'new' for side effects.", i);
                if (C.id === ",")return jt();
                C.id !== ";" ? A.asi || (!A.lastsemic || C.id !== "}" || C.line !== z.line) && wt("Missing semicolon.", z.line, z.character) : (Ot(z, C), Lt(";"), Dt(z, C))
            }
            return y = t, B = r, n
        }

        function sn(e) {
            var t = [], n;
            while (!C.reach && C.id !== "(end)")C.id === ";" ? (n = kt(), (!n || n.id !== "(") && bt("Unnecessary semicolon."), Lt(";")) : t.push(rn(e === C.line));
            return t
        }

        function on() {
            var e, t, n;
            for (; ;) {
                if (C.id === "(string)") {
                    t = kt(0);
                    if (t.id === "(endline)") {
                        e = 1;
                        do n = kt(e), e += 1; while (n.id === "(endline)");
                        if (n.id !== ";") {
                            if (n.id !== "(string)" && n.id !== "(number)" && n.id !== "(regexp)" && n.identifier !== !0 && n.id !== "}")break;
                            bt("Missing semicolon.", C)
                        } else t = n
                    } else if (t.id === "}")bt("Missing semicolon.", t); else if (t.id !== ";")break;
                    Ht(), Lt(), q[z.value] && bt('Unnecessary directive "{a}".', z, z.value), z.value === "use strict" && (A["(explicitNewcap)"] || (A.newcap = !0), A.undef = !0), q[z.value] = !0, t.id === ";" && Lt(";");
                    continue
                }
                break
            }
        }

        function un(e, t, n) {
            var r, i = g, s = y, o, u = B, a, f, l;
            g = e;
            if (!e || !A.funcscope)B = Object.create(B);
            Dt(z, C), a = C;
            var c = h["(metrics)"];
            c.nestedBlockDepth += 1, c.verifyMaxNestedBlockDepthPerFunction();
            if (C.id === "{") {
                Lt("{"), f = z.line;
                if (C.id !== "}") {
                    y += A.indent;
                    while (!e && C.from > y)y += A.indent;
                    if (n) {
                        o = {};
                        for (l in q)ut(q, l) && (o[l] = q[l]);
                        on(), A.strict && h["(context)"]["(global)"] && !o["use strict"] && !q["use strict"] && bt('Missing "use strict" statement.')
                    }
                    r = sn(f), c.statementCount += r.length, n && (q = o), y -= A.indent, f !== C.line && Ht()
                } else f !== C.line && Ht();
                Lt("}", a), y = s
            } else e ? ((!t || A.curly) && bt("Expected '{a}' and instead saw '{b}'.", C, "{", C.value), L = !0, y += A.indent, r = [rn(C.line === z.line)], y -= A.indent, L = !1) : Et("Expected '{a}' and instead saw '{b}'.", C, "{", C.value);
            h["(verb)"] = null;
            if (!e || !A.funcscope)B = u;
            return g = i, e && A.noempty && (!r || r.length === 0) && bt("Empty block."), c.nestedBlockDepth -= 1, r
        }

        function an(e) {
            T && typeof T[e] != "boolean" && bt("Unexpected /*member '{a}'.", z, e), typeof x[e] == "number" ? x[e] += 1 : x[e] = 1
        }

        function fn(e) {
            var t = e.value, n = e.line, r = m[t];
            typeof r == "function" && (r = !1), r ? r[r.length - 1] !== n && r.push(n) : (r = [n], m[t] = r)
        }

        function ln() {
            var e = en(!0);
            return e || (C.id === "(string)" ? (e = C.value, Lt()) : C.id === "(number)" && (e = C.value.toString(), Lt())), e
        }

        function cn() {
            var e = C, t = [], n;
            Lt("("), _t();
            if (C.id === ")") {
                Lt(")");
                return
            }
            for (; ;) {
                n = tn(!0), t.push(n), Nt(n, "unused", z);
                if (C.id !== ",")return Lt(")", e), _t(_, z), t;
                jt()
            }
        }

        function hn(t, n) {
            var r, i = A, s = B;
            return A = Object.create(A), B = Object.create(B), h = {"(name)": t || '"' + e + '"', "(line)": C.line, "(character)": C.character, "(context)": h, "(breakage)": 0, "(loopage)": 0, "(metrics)": pn(C), "(scope)": B, "(statement)": n, "(tokens)": {}}, r = h, z.funct = h, d.push(h), t && Nt(t, "function"), h["(params)"] = cn(), h["(metrics)"].verifyMaxParametersPerFunction(h["(params)"]), un(!1, !1, !0), h["(metrics)"].verifyMaxStatementsPerFunction(), h["(metrics)"].verifyMaxComplexityPerFunction(), B = s, A = i, h["(last)"] = z.line, h["(lastcharacter)"] = z.character, h = h["(context)"], r
        }

        function pn(e) {
            return{statementCount: 0, nestedBlockDepth: -1, ComplexityCount: 1, verifyMaxStatementsPerFunction: function () {
                if (A.maxstatements && this.statementCount > A.maxstatements) {
                    var t = "Too many statements per function (" + this.statementCount + ").";
                    bt(t, e)
                }
            }, verifyMaxParametersPerFunction: function (t) {
                t = t || [];
                if (A.maxparams && t.length > A.maxparams) {
                    var n = "Too many parameters per function (" + t.length + ").";
                    bt(n, e)
                }
            }, verifyMaxNestedBlockDepthPerFunction: function () {
                if (A.maxdepth && this.nestedBlockDepth > 0 && this.nestedBlockDepth === A.maxdepth + 1) {
                    var e = "Blocks are nested too deeply (" + this.nestedBlockDepth + ").";
                    bt(e)
                }
            }, verifyMaxComplexityPerFunction: function () {
                var t = A.maxcomplexity, n = this.ComplexityCount;
                if (t && n > t) {
                    var r = "Cyclomatic complexity is too high per function (" + n + ").";
                    bt(r, e)
                }
            }}
        }

        function dn() {
            h["(metrics)"].ComplexityCount += 1
        }

        function mn() {
            function e() {
                var e = {}, t = C;
                Lt("{");
                if (C.id !== "}")for (; ;) {
                    if (C.id === "(end)")Et("Missing '}' to match '{' from line {a}.", C, t.line); else {
                        if (C.id === "}") {
                            bt("Unexpected comma.", z);
                            break
                        }
                        C.id === "," ? Et("Unexpected comma.", C) : C.id !== "(string)" && bt("Expected a string and instead saw {a}.", C, C.value)
                    }
                    e[C.value] === !0 ? bt("Duplicate key '{a}'.", C, C.value) : C.value === "__proto__" && !A.proto || C.value === "__iterator__" && !A.iterator ? bt("The '{a}' key may produce unexpected results.", C, C.value) : e[C.value] = !0, Lt(), Lt(":"), mn();
                    if (C.id !== ",")break;
                    Lt(",")
                }
                Lt("}")
            }

            function t() {
                var e = C;
                Lt("[");
                if (C.id !== "]")for (; ;) {
                    if (C.id === "(end)")Et("Missing ']' to match '[' from line {a}.", C, e.line); else {
                        if (C.id === "]") {
                            bt("Unexpected comma.", z);
                            break
                        }
                        C.id === "," && Et("Unexpected comma.", C)
                    }
                    mn();
                    if (C.id !== ",")break;
                    Lt(",")
                }
                Lt("]")
            }

            switch (C.id) {
                case"{":
                    e();
                    break;
                case"[":
                    t();
                    break;
                case"true":
                case"false":
                case"null":
                case"(number)":
                case"(string)":
                    Lt();
                    break;
                case"-":
                    Lt("-"), z.character !== C.from && bt("Unexpected space after '-'.", z), Ot(z, C), Lt("(number)");
                    break;
                default:
                    Et("Expected a JSON value.", C)
            }
        }

        var e, t = {"<": !0, "<=": !0, "==": !0, "===": !0, "!==": !0, "!=": !0, ">": !0, ">=": !0, "+": !0, "-": !0, "*": !0, "/": !0, "%": !0}, n = {asi: !0, bitwise: !0, boss: !0, browser: !0, camelcase: !0, couch: !0, curly: !0, debug: !0, devel: !0, dojo: !0, eqeqeq: !0, eqnull: !0, es5: !0, esnext: !0, evil: !0, expr: !0, forin: !0, funcscope: !0, globalstrict: !0, immed: !0, iterator: !0, jquery: !0, lastsemic: !0, latedef: !0, laxbreak: !0, laxcomma: !0, loopfunc: !0, mootools: !0, multistr: !0, newcap: !0, noarg: !0, node: !0, noempty: !0, nonew: !0, nonstandard: !0, nomen: !0, onevar: !0, onecase: !0, passfail: !0, plusplus: !0, proto: !0, prototypejs: !0, regexdash: !0, regexp: !0, rhino: !0, undef: !0, unused: !0, scripturl: !0, shadow: !0, smarttabs: !0, strict: !0, sub: !0, supernew: !0, trailing: !0, validthis: !0, withstmt: !0, white: !0, worker: !0, wsh: !0, yui: !0}, i = {maxlen: !1, indent: !1, maxerr: !1, predef: !1, quotmark: !1, scope: !1, maxstatements: !1, maxdepth: !1, maxparams: !1, maxcomplexity: !1}, s = {bitwise: !0, forin: !0, newcap: !0, nomen: !0, plusplus: !0, regexp: !0, undef: !0, white: !0, eqeqeq: !0, onevar: !0}, o = {eqeq: "eqeqeq", vars: "onevar", windows: "wsh"}, u = {ArrayBuffer: !1, ArrayBufferView: !1, Audio: !1, Blob: !1, addEventListener: !1, applicationCache: !1, atob: !1, blur: !1, btoa: !1, clearInterval: !1, clearTimeout: !1, close: !1, closed: !1, DataView: !1, DOMParser: !1, defaultStatus: !1, document: !1, event: !1, FileReader: !1, Float32Array: !1, Float64Array: !1, FormData: !1, focus: !1, frames: !1, getComputedStyle: !1, HTMLElement: !1, HTMLAnchorElement: !1, HTMLBaseElement: !1, HTMLBlockquoteElement: !1, HTMLBodyElement: !1, HTMLBRElement: !1, HTMLButtonElement: !1, HTMLCanvasElement: !1, HTMLDirectoryElement: !1, HTMLDivElement: !1, HTMLDListElement: !1, HTMLFieldSetElement: !1, HTMLFontElement: !1, HTMLFormElement: !1, HTMLFrameElement: !1, HTMLFrameSetElement: !1, HTMLHeadElement: !1, HTMLHeadingElement: !1, HTMLHRElement: !1, HTMLHtmlElement: !1, HTMLIFrameElement: !1, HTMLImageElement: !1, HTMLInputElement: !1, HTMLIsIndexElement: !1, HTMLLabelElement: !1, HTMLLayerElement: !1, HTMLLegendElement: !1, HTMLLIElement: !1, HTMLLinkElement: !1, HTMLMapElement: !1, HTMLMenuElement: !1, HTMLMetaElement: !1, HTMLModElement: !1, HTMLObjectElement: !1, HTMLOListElement: !1, HTMLOptGroupElement: !1, HTMLOptionElement: !1, HTMLParagraphElement: !1, HTMLParamElement: !1, HTMLPreElement: !1, HTMLQuoteElement: !1, HTMLScriptElement: !1, HTMLSelectElement: !1, HTMLStyleElement: !1, HTMLTableCaptionElement: !1, HTMLTableCellElement: !1, HTMLTableColElement: !1, HTMLTableElement: !1, HTMLTableRowElement: !1, HTMLTableSectionElement: !1, HTMLTextAreaElement: !1, HTMLTitleElement: !1, HTMLUListElement: !1, HTMLVideoElement: !1, history: !1, Int16Array: !1, Int32Array: !1, Int8Array: !1, Image: !1, length: !1, localStorage: !1, location: !1, MessageChannel: !1, MessageEvent: !1, MessagePort: !1, moveBy: !1, moveTo: !1, MutationObserver: !1, name: !1, Node: !1, NodeFilter: !1, navigator: !1, onbeforeunload: !0, onblur: !0, onerror: !0, onfocus: !0, onload: !0, onresize: !0, onunload: !0, open: !1, openDatabase: !1, opener: !1, Option: !1, parent: !1, print: !1, removeEventListener: !1, resizeBy: !1, resizeTo: !1, screen: !1, scroll: !1, scrollBy: !1, scrollTo: !1, sessionStorage: !1, setInterval: !1, setTimeout: !1, SharedWorker: !1, status: !1, top: !1, Uint16Array: !1, Uint32Array: !1, Uint8Array: !1, WebSocket: !1, window: !1, Worker: !1, XMLHttpRequest: !1, XMLSerializer: !1, XPathEvaluator: !1, XPathException: !1, XPathExpression: !1, XPathNamespace: !1, XPathNSResolver: !1, XPathResult: !1}, a = {require: !1, respond: !1, getRow: !1, emit: !1, send: !1, start: !1, sum: !1, log: !1, exports: !1, module: !1, provides: !1}, f, l = {alert: !1, confirm: !1, console: !1, Debug: !1, opera: !1, prompt: !1}, c = {dojo: !1, dijit: !1, dojox: !1, define: !1, require: !1}, h, p = ["closure", "exception", "global", "label", "outer", "unused", "var"], d, v, m, g, y, b, w = {$: !1, jQuery: !1}, E, S, x, T, N = {$: !1, $$: !1, Asset: !1, Browser: !1, Chain: !1, Class: !1, Color: !1, Cookie: !1, Core: !1, Document: !1, DomReady: !1, DOMEvent: !1, DOMReady: !1, Drag: !1, Element: !1, Elements: !1, Event: !1, Events: !1, Fx: !1, Group: !1, Hash: !1, HtmlTable: !1, Iframe: !1, IframeShim: !1, InputValidator: !1, instanceOf: !1, Keyboard: !1, Locale: !1, Mask: !1, MooTools: !1, Native: !1, Options: !1, OverText: !1, Request: !1, Scroller: !1, Slick: !1, Slider: !1, Sortables: !1, Spinner: !1, Swiff: !1, Tips: !1, Type: !1, typeOf: !1, URI: !1, Window: !1}, C, k = {__filename: !1, __dirname: !1, Buffer: !1, console: !1, exports: !0, GLOBAL: !1, global: !1, module: !1, process: !1, require: !1, setTimeout: !1, clearTimeout: !1, setInterval: !1, clearInterval: !1}, L, A, O, M, _, D = {$: !1, $$: !1, $A: !1, $F: !1, $H: !1, $R: !1, $break: !1, $continue: !1, $w: !1, Abstract: !1, Ajax: !1, Class: !1, Enumerable: !1, Element: !1, Event: !1, Field: !1, Form: !1, Hash: !1, Insertion: !1, ObjectRange: !1, PeriodicalExecuter: !1, Position: !1, Prototype: !1, Selector: !1, Template: !1, Toggle: !1, Try: !1, Autocompleter: !1, Builder: !1, Control: !1, Draggable: !1, Draggables: !1, Droppables: !1, Effect: !1, Sortable: !1, SortableObserver: !1, Sound: !1, Scriptaculous: !1}, P, H = {defineClass: !1, deserialize: !1, gc: !1, help: !1, importPackage: !1, java: !1, load: !1, loadClass: !1, print: !1, quit: !1, readFile: !1, readUrl: !1, runCommand: !1, seal: !1, serialize: !1, spawn: !1, sync: !1, toint32: !1, version: !1}, B, j, F = {Array: !1, Boolean: !1, Date: !1, decodeURI: !1, decodeURIComponent: !1, encodeURI: !1, encodeURIComponent: !1, Error: !1, eval: !1, EvalError: !1, Function: !1, hasOwnProperty: !1, isFinite: !1, isNaN: !1, JSON: !1, Map: !1, Math: !1, NaN: !1, Number: !1, Object: !1, parseInt: !1, parseFloat: !1, RangeError: !1, ReferenceError: !1, RegExp: !1, Set: !1, String: !1, SyntaxError: !1, TypeError: !1, URIError: !1, WeakMap: !1}, I = {escape: !1, unescape: !1}, q, R = {}, U, z, W, X, V, $, J = {importScripts: !0, postMessage: !0, self: !0}, K = {ActiveXObject: !0, Enumerator: !0, GetObject: !0, ScriptEngine: !0, ScriptEngineBuildVersion: !0, ScriptEngineMajorVersion: !0, ScriptEngineMinorVersion: !0, VBArray: !0, WSH: !0, WScript: !0, XDomainRequest: !0}, Q = {YUI: !1, Y: !1, YUI_config: !1}, G, Y, Z, et, tt, nt, rt, it, st;
        (function () {
            G = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i, Y = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, Z = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/=(?!(\S*\/[gim]?))|\/(\*(jshint|jslint|members?|global)?|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/, et = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, tt = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, nt = /\*\//, rt = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/, it = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i, st = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/
        })(), typeof Array.isArray != "function" && (Array.isArray = function (e) {
            return Object.prototype.toString.apply(e) === "[object Array]"
        }), Array.prototype.forEach || (Array.prototype.forEach = function (e, t) {
            var n = this.length;
            for (var r = 0; r < n; r++)e.call(t || this, this[r], r, this)
        }), Array.prototype.indexOf || (Array.prototype.indexOf = function (e) {
            if (this === null || this === undefined)throw new TypeError;
            var t = new Object(this), n = t.length >>> 0;
            if (n === 0)return-1;
            var r = 0;
            arguments.length > 0 && (r = Number(arguments[1]), r != r ? r = 0 : r !== 0 && r != Infinity && r != -Infinity && (r = (r > 0 || -1) * Math.floor(Math.abs(r))));
            if (r >= n)return-1;
            var i = r >= 0 ? r : Math.max(n - Math.abs(r), 0);
            for (; i < n; i++)if (i in t && t[i] === e)return i;
            return-1
        }), typeof Object.create != "function" && (Object.create = function (e) {
            return ot.prototype = e, new ot
        }), typeof Object.keys != "function" && (Object.keys = function (e) {
            var t = [], n;
            for (n in e)ut(e, n) && t.push(n);
            return t
        });
        var Tt = function () {
            function s() {
                var e, n, s;
                return r >= E.length ? !1 : (t = 1, i = E[r], r += 1, A.smarttabs ? (n = i.match(/(\/\/)? \t/), e = n && !n[1] ? 0 : -1) : e = i.search(/ \t|\t [^\*]/), e >= 0 && wt("Mixed spaces and tabs.", r, e + 1), i = i.replace(/\t/g, U), e = i.search(Y), e >= 0 && wt("Unsafe character.", r, e), A.maxlen && A.maxlen < i.length && wt("Line too long.", r, i.length), s = A.trailing && i.match(/^(.*?)\s+$/), s && !/^\s+$/.test(i) && wt("Trailing whitespace.", r, s[1].length + 1), !0)
            }

            function o(e, i) {
                function u(e) {
                    if (!A.proto && e === "__proto__") {
                        wt("The '{a}' property is deprecated.", r, n, e);
                        return
                    }
                    if (!A.iterator && e === "__iterator__") {
                        wt("'{a}' is only available in JavaScript 1.7.", r, n, e);
                        return
                    }
                    var t = /^(_+.*|.*_+)$/.test(e);
                    if (A.nomen && t && e !== "_") {
                        if (A.node && z.id !== "." && /^(__dirname|__filename)$/.test(e))return;
                        wt("Unexpected {a} in '{b}'.", r, n, "dangling '_'", e);
                        return
                    }
                    A.camelcase && e.replace(/^_+/, "").indexOf("_") > -1 && !e.match(/^[A-Z0-9_]*$/) && wt("Identifier '{a}' is not in camel case.", r, n, i)
                }

                var s, o;
                return e === "(color)" || e === "(range)" ? o = {type: e} : e === "(punctuator)" || e === "(identifier)" && ut(R, i) ? o = R[i] || R["(error)"] : o = R[e], o = Object.create(o), (e === "(string)" || e === "(range)") && !A.scripturl && it.test(i) && wt("Script URL.", r, n), e === "(identifier)" && (o.identifier = !0, u(i)), o.value = i, o.line = r, o.character = t, o.from = n, s = o.id, s !== "(endline)" && (M = s && ("(,=:[!&|?{};".indexOf(s.charAt(s.length - 1)) >= 0 || s === "return" || s === "case")), o
            }

            var t, n, r, i;
            return{init: function (e) {
                typeof e == "string" ? E = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n") : E = e, E[0] && E[0].substr(0, 2) === "#!" && (E[0] = ""), r = 0, s(), n = 1
            }, range: function (e, s) {
                var u, a = "";
                n = t, i.charAt(0) !== e && St("Expected '{a}' and instead saw '{b}'.", r, t, e, i.charAt(0));
                for (; ;) {
                    i = i.slice(1), t += 1, u = i.charAt(0);
                    switch (u) {
                        case"":
                            St("Missing '{a}'.", r, t, u);
                            break;
                        case s:
                            return i = i.slice(1), t += 1, o("(range)", a);
                        case"\\":
                            wt("Unexpected '{a}'.", r, t, u)
                    }
                    a += u
                }
            }, token: function () {
                function E(e) {
                    var r = e.exec(i), s;
                    if (r)return p = r[0].length, s = r[1], u = s.charAt(0), i = i.substr(p), n = t + p - s.length, t += p, s
                }

                function S(e) {
                    function c(e) {
                        var n = parseInt(i.substr(a + 1, e), 16);
                        a += e, n >= 32 && n <= 126 && n !== 34 && n !== 92 && n !== 39 && wt("Unnecessary escapement.", r, t), t += e, u = String.fromCharCode(n)
                    }

                    var u, a, f = "", l = !1;
                    b && e !== '"' && wt("Strings must use doublequote.", r, t), A.quotmark && (A.quotmark === "single" && e !== "'" ? wt("Strings must use singlequote.", r, t) : A.quotmark === "double" && e !== '"' ? wt("Strings must use doublequote.", r, t) : A.quotmark === !0 && (P = P || e, P !== e && wt("Mixed double and single quotes.", r, t))), a = 0;
                    e:for (; ;) {
                        while (a >= i.length) {
                            a = 0;
                            var h = r, p = n;
                            if (!s()) {
                                St("Unclosed string.", h, p);
                                break e
                            }
                            l ? l = !1 : wt("Unclosed string.", h, p)
                        }
                        u = i.charAt(a);
                        if (u === e)return t += 1, i = i.substr(a + 1), o("(string)", f, e);
                        if (u < " ") {
                            if (u === "\n" || u === "\r")break;
                            wt("Control character in string: {a}.", r, t + a, i.slice(0, a))
                        } else if (u === "\\") {
                            a += 1, t += 1, u = i.charAt(a), w = i.charAt(a + 1);
                            switch (u) {
                                case"\\":
                                case'"':
                                case"/":
                                    break;
                                case"'":
                                    b && wt("Avoid \\'.", r, t);
                                    break;
                                case"b":
                                    u = "\b";
                                    break;
                                case"f":
                                    u = "\f";
                                    break;
                                case"n":
                                    u = "\n";
                                    break;
                                case"r":
                                    u = "\r";
                                    break;
                                case"t":
                                    u = "	";
                                    break;
                                case"0":
                                    u = "\0", w >= 0 && w <= 7 && q["use strict"] && wt("Octal literals are not allowed in strict mode.", r, t);
                                    break;
                                case"u":
                                    c(4);
                                    break;
                                case"v":
                                    b && wt("Avoid \\v.", r, t), u = "";
                                    break;
                                case"x":
                                    b && wt("Avoid \\x-.", r, t), c(2);
                                    break;
                                case"":
                                    l = !0;
                                    if (A.multistr) {
                                        b && wt("Avoid EOL escapement.", r, t), u = "", t -= 1;
                                        break
                                    }
                                    wt("Bad escapement of EOL. Use option multistr if needed.", r, t);
                                    break;
                                case"!":
                                    if (i.charAt(a - 2) === "<")break;
                                default:
                                    wt("Bad escapement.", r, t)
                            }
                        }
                        f += u, t += 1, a += 1
                    }
                }

                var e, u, a, f, l, c, h, p, d, v, m, g, y, w;
                for (; ;) {
                    if (!i)return o(s() ? "(endline)" : "(end)", "");
                    m = E(Z);
                    if (!m) {
                        m = "", u = "";
                        while (i && i < "!")i = i.substr(1);
                        i && (St("Unexpected '{a}'.", r, t, i.substr(0, 1)), i = "")
                    } else {
                        if (lt(u) || u === "_" || u === "$")return o("(identifier)", m);
                        if (ct(u))return isFinite(Number(m)) || wt("Bad number '{a}'.", r, t, m), lt(i.substr(0, 1)) && wt("Missing space after '{a}'.", r, t, m), u === "0" && (f = m.substr(1, 1), ct(f) ? z.id !== "." && wt("Don't use extra leading zeros '{a}'.", r, t, m) : b && (f === "x" || f === "X") && wt("Avoid 0x-. '{a}'.", r, t, m)), m.substr(m.length - 1) === "." && wt("A trailing decimal point can be confused with a dot '{a}'.", r, t, m), o("(number)", m);
                        switch (m) {
                            case'"':
                            case"'":
                                return S(m);
                            case"//":
                                i = "", z.comment = !0;
                                break;
                            case"/*":
                                for (; ;) {
                                    h = i.search(nt);
                                    if (h >= 0)break;
                                    s() || St("Unclosed comment.", r, t)
                                }
                                i = i.substr(h + 2), z.comment = !0;
                                break;
                            case"/*members":
                            case"/*member":
                            case"/*jshint":
                            case"/*jslint":
                            case"/*global":
                            case"*/":
                                return{value: m, type: "special", line: r, character: t, from: n};
                            case"":
                                break;
                            case"/":
                                i.charAt(0) === "=" && St("A regular expression literal can be confused with '/='.", r, n);
                                if (M) {
                                    l = 0, a = 0, p = 0;
                                    for (; ;) {
                                        e = !0, u = i.charAt(p), p += 1;
                                        switch (u) {
                                            case"":
                                                return St("Unclosed regular expression.", r, n), gt("Stopping.", r, n);
                                            case"/":
                                                l > 0 && wt("{a} unterminated regular expression group(s).", r, n + p, l), u = i.substr(0, p - 1), v = {g: !0, i: !0, m: !0};
                                                while (v[i.charAt(p)] === !0)v[i.charAt(p)] = !1, p += 1;
                                                return t += p, i = i.substr(p), v = i.charAt(0), (v === "/" || v === "*") && St("Confusing regular expression.", r, n), o("(regexp)", u);
                                            case"\\":
                                                u = i.charAt(p), u < " " ? wt("Unexpected control character in regular expression.", r, n + p) : u === "<" && wt("Unexpected escaped character '{a}' in regular expression.", r, n + p, u), p += 1;
                                                break;
                                            case"(":
                                                l += 1, e = !1;
                                                if (i.charAt(p) === "?") {
                                                    p += 1;
                                                    switch (i.charAt(p)) {
                                                        case":":
                                                        case"=":
                                                        case"!":
                                                            p += 1;
                                                            break;
                                                        default:
                                                            wt("Expected '{a}' and instead saw '{b}'.", r, n + p, ":", i.charAt(p))
                                                    }
                                                } else a += 1;
                                                break;
                                            case"|":
                                                e = !1;
                                                break;
                                            case")":
                                                l === 0 ? wt("Unescaped '{a}'.", r, n + p, ")") : l -= 1;
                                                break;
                                            case" ":
                                                v = 1;
                                                while (i.charAt(p) === " ")p += 1, v += 1;
                                                v > 1 && wt("Spaces are hard to count. Use {{a}}.", r, n + p, v);
                                                break;
                                            case"[":
                                                u = i.charAt(p), u === "^" && (p += 1, i.charAt(p) === "]" && St("Unescaped '{a}'.", r, n + p, "^")), u === "]" && wt("Empty class.", r, n + p - 1), g = !1, y = !1;
                                                e:do {
                                                    u = i.charAt(p), p += 1;
                                                    switch (u) {
                                                        case"[":
                                                        case"^":
                                                            wt("Unescaped '{a}'.", r, n + p, u), y ? y = !1 : g = !0;
                                                            break;
                                                        case"-":
                                                            g && !y ? (g = !1, y = !0) : y ? y = !1 : i.charAt(p) === "]" ? y = !0 : (A.regexdash !== (p === 2 || p === 3 && i.charAt(1) === "^") && wt("Unescaped '{a}'.", r, n + p - 1, "-"), g = !0);
                                                            break;
                                                        case"]":
                                                            y && !A.regexdash && wt("Unescaped '{a}'.", r, n + p - 1, "-");
                                                            break e;
                                                        case"\\":
                                                            u = i.charAt(p), u < " " ? wt("Unexpected control character in regular expression.", r, n + p) : u === "<" && wt("Unexpected escaped character '{a}' in regular expression.", r, n + p, u), p += 1, /[wsd]/i.test(u) ? (y && (wt("Unescaped '{a}'.", r, n + p, "-"), y = !1), g = !1) : y ? y = !1 : g = !0;
                                                            break;
                                                        case"/":
                                                            wt("Unescaped '{a}'.", r, n + p - 1, "/"), y ? y = !1 : g = !0;
                                                            break;
                                                        case"<":
                                                            y ? y = !1 : g = !0;
                                                            break;
                                                        default:
                                                            y ? y = !1 : g = !0
                                                    }
                                                } while (u);
                                                break;
                                            case".":
                                                A.regexp && wt("Insecure '{a}'.", r, n + p, u);
                                                break;
                                            case"]":
                                            case"?":
                                            case"{":
                                            case"}":
                                            case"+":
                                            case"*":
                                                wt("Unescaped '{a}'.", r, n + p, u)
                                        }
                                        if (e)switch (i.charAt(p)) {
                                            case"?":
                                            case"+":
                                            case"*":
                                                p += 1, i.charAt(p) === "?" && (p += 1);
                                                break;
                                            case"{":
                                                p += 1, u = i.charAt(p);
                                                if (u < "0" || u > "9") {
                                                    wt("Expected a number and instead saw '{a}'.", r, n + p, u);
                                                    break
                                                }
                                                p += 1, d = +u;
                                                for (; ;) {
                                                    u = i.charAt(p);
                                                    if (u < "0" || u > "9")break;
                                                    p += 1, d = +u + d * 10
                                                }
                                                c = d;
                                                if (u === ",") {
                                                    p += 1, c = Infinity, u = i.charAt(p);
                                                    if (u >= "0" && u <= "9") {
                                                        p += 1, c = +u;
                                                        for (; ;) {
                                                            u = i.charAt(p);
                                                            if (u < "0" || u > "9")break;
                                                            p += 1, c = +u + c * 10
                                                        }
                                                    }
                                                }
                                                i.charAt(p) !== "}" ? wt("Expected '{a}' and instead saw '{b}'.", r, n + p, "}", u) : p += 1, i.charAt(p) === "?" && (p += 1), d > c && wt("'{a}' should not be greater than '{b}'.", r, n + p, d, c)
                                        }
                                    }
                                    return u = i.substr(0, p - 1), t += p, i = i.substr(p), o("(regexp)", u)
                                }
                                return o("(punctuator)", m);
                            case"#":
                                return o("(punctuator)", m);
                            default:
                                return o("(punctuator)", m)
                        }
                    }
                }
            }}
        }();
        Wt("(number)", function () {
            return this
        }), Wt("(string)", function () {
            return this
        }), R["(identifier)"] = {type: "(identifier)", lbp: 0, identifier: !0, nud: function () {
            var t = this.value, n = B[t], r;
            typeof n == "function" ? n = undefined : typeof n == "boolean" && (r = h, h = d[0], Nt(t, "var"), n = h, h = r);
            if (h === n)switch (h[t]) {
                case"unused":
                    h[t] = "var";
                    break;
                case"unction":
                    h[t] = "function", this["function"] = !0;
                    break;
                case"function":
                    this["function"] = !0;
                    break;
                case"label":
                    bt("'{a}' is a statement label.", z, t)
            } else if (h["(global)"])A.undef && typeof O[t] != "boolean" && (e !== "typeof" && e !== "delete" || C && (C.value === "." || C.value === "[")) && yt(h, "'{a}' is not defined.", z, t), fn(z); else switch (h[t]) {
                case"closure":
                case"function":
                case"var":
                case"unused":
                    bt("'{a}' used out of scope.", z, t);
                    break;
                case"label":
                    bt("'{a}' is a statement label.", z, t);
                    break;
                case"outer":
                case"global":
                    break;
                default:
                    if (n === !0)h[t] = !0; else if (n === null)bt("'{a}' is not allowed.", z, t), fn(z); else if (typeof n != "object")A.undef && (e !== "typeof" && e !== "delete" || C && (C.value === "." || C.value === "[")) && yt(h, "'{a}' is not defined.", z, t), h[t] = !0, fn(z); else switch (n[t]) {
                        case"function":
                        case"unction":
                            this["function"] = !0, n[t] = "closure", h[t] = n["(global)"] ? "global" : "outer";
                            break;
                        case"var":
                        case"unused":
                            n[t] = "closure", h[t] = n["(global)"] ? "global" : "outer";
                            break;
                        case"closure":
                            h[t] = n["(global)"] ? "global" : "outer";
                            break;
                        case"label":
                            bt("'{a}' is a statement label.", z, t)
                    }
            }
            return this
        }, led: function () {
            Et("Expected an operator and instead saw '{a}'.", C, C.value)
        }}, Wt("(regexp)", function () {
            return this
        }), It("(endline)"), It("(begin)"), It("(end)").reach = !0, It("</").reach = !0, It("<!"), It("<!--"), It("-->"), It("(error)").reach = !0, It("}").reach = !0, It(")"), It("]"), It('"').reach = !0, It("'").reach = !0, It(";"), It(":").reach = !0, It(","), It("#"), It("@"), Xt("else"), Xt("case").reach = !0, Xt("catch"), Xt("default").reach = !0, Xt("finally"), Vt("arguments", function (e) {
            q["use strict"] && h["(global)"] && bt("Strict violation.", e)
        }), Vt("eval"), Vt("false"), Vt("Infinity"), Vt("null"), Vt("this", function (e) {
            q["use strict"] && !A.validthis && (h["(statement)"] && h["(name)"].charAt(0) > "Z" || h["(global)"]) && bt("Possible strict violation.", e)
        }), Vt("true"), Vt("undefined"), Qt("=", "assign", 20), Qt("+=", "assignadd", 20), Qt("-=", "assignsub", 20), Qt("*=", "assignmult", 20), Qt("/=", "assigndiv", 20).nud = function () {
            Et("A regular expression literal can be confused with '/='.")
        }, Qt("%=", "assignmod", 20), Yt("&=", "assignbitand", 20), Yt("|=", "assignbitor", 20), Yt("^=", "assignbitxor", 20), Yt("<<=", "assignshiftleft", 20), Yt(">>=", "assignshiftright", 20), Yt(">>>=", "assignshiftrightunsigned", 20), $t("?", function (e, t) {
            return t.left = e, t.right = At(10), Lt(":"), t["else"] = At(10), t
        }, 30), $t("||", "or", 40), $t("&&", "and", 50), Gt("|", "bitor", 70), Gt("^", "bitxor", 80), Gt("&", "bitand", 90), Jt("==", function (e, t) {
            var n = A.eqnull && (e.value === "null" || t.value === "null");
            return!n && A.eqeqeq ? bt("Expected '{a}' and instead saw '{b}'.", this, "===", "==") : Kt(e) ? bt("Use '{a}' to compare with '{b}'.", this, "===", e.value) : Kt(t) && bt("Use '{a}' to compare with '{b}'.", this, "===", t.value), this
        }), Jt("==="), Jt("!=", function (e, t) {
            var n = A.eqnull && (e.value === "null" || t.value === "null");
            return!n && A.eqeqeq ? bt("Expected '{a}' and instead saw '{b}'.", this, "!==", "!=") : Kt(e) ? bt("Use '{a}' to compare with '{b}'.", this, "!==", e.value) : Kt(t) && bt("Use '{a}' to compare with '{b}'.", this, "!==", t.value), this
        }), Jt("!=="), Jt("<"), Jt(">"), Jt("<="), Jt(">="), Gt("<<", "shiftleft", 120), Gt(">>", "shiftright", 120), Gt(">>>", "shiftrightunsigned", 120), $t("in", "in", 120), $t("instanceof", "instanceof", 120), $t("+", function (e, t) {
            var n = At(130);
            return e && n && e.id === "(string)" && n.id === "(string)" ? (e.value += n.value, e.character = n.character, !A.scripturl && it.test(e.value) && bt("JavaScript URL.", e), e) : (t.left = e, t.right = n, t)
        }, 130), zt("+", "num"), zt("+++", function () {
            return bt("Confusing pluses."), this.right = At(150), this.arity = "unary", this
        }), $t("+++", function (e) {
            return bt("Confusing pluses."), this.left = e, this.right = At(130), this
        }, 130), $t("-", "sub", 130), zt("-", "neg"), zt("---", function () {
            return bt("Confusing minuses."), this.right = At(150), this.arity = "unary", this
        }), $t("---", function (e) {
            return bt("Confusing minuses."), this.left = e, this.right = At(130), this
        }, 130), $t("*", "mult", 140), $t("/", "div", 140), $t("%", "mod", 140), Zt("++", "postinc"), zt("++", "preinc"), R["++"].exps = !0, Zt("--", "postdec"), zt("--", "predec"), R["--"].exps = !0, zt("delete",function () {
            var e = At(0);
            return(!e || e.id !== "." && e.id !== "[") && bt("Variables should not be deleted."), this.first = e, this
        }).exps = !0, zt("~", function () {
            return A.bitwise && bt("Unexpected '{a}'.", this, "~"), At(150), this
        }), zt("!", function () {
            return this.right = At(150), this.arity = "unary", t[this.right.id] === !0 && bt("Confusing use of '{a}'.", this, "!"), this
        }), zt("typeof", "typeof"), zt("new", function () {
            var e = At(155), t;
            if (e && e.id !== "function")if (e.identifier) {
                e["new"] = !0;
                switch (e.value) {
                    case"Number":
                    case"String":
                    case"Boolean":
                    case"Math":
                    case"JSON":
                        bt("Do not use {a} as a constructor.", _, e.value);
                        break;
                    case"Function":
                        A.evil || bt("The Function constructor is eval.");
                        break;
                    case"Date":
                    case"RegExp":
                        break;
                    default:
                        e.id !== "function" && (t = e.value.substr(0, 1), A.newcap && (t < "A" || t > "Z") && !ut(v, e.value) && bt("A constructor name should start with an uppercase letter.", z))
                }
            } else e.id !== "." && e.id !== "[" && e.id !== "(" && bt("Bad constructor.", z); else A.supernew || bt("Weird construction. Delete 'new'.", this);
            return Ot(z, C), C.id !== "(" && !A.supernew && bt("Missing '()' invoking a constructor.", z, z.value), this.first = e, this
        }), R["new"].exps = !0, zt("void").exps = !0, $t(".", function (e, t) {
            Ot(_, z), Mt();
            var n = tn();
            return typeof n == "string" && an(n), t.left = e, t.right = n, !e || e.value !== "arguments" || n !== "callee" && n !== "caller" ? !A.evil && e && e.value === "document" && (n === "write" || n === "writeln") && bt("document.write can be a form of eval.", e) : A.noarg ? bt("Avoid arguments.{a}.", e, n) : q["use strict"] && Et("Strict violation."), !A.evil && (n === "eval" || n === "execScript") && bt("eval is evil."), t
        }, 160, !0), $t("(",function (e, t) {
            _.id !== "}" && _.id !== ")" && Mt(_, z), _t(), A.immed && !e.immed && e.id === "function" && bt("Wrap an immediate function invocation in parentheses to assist the reader in understanding that the expression is the result of a function, and not the function itself.");
            var n = 0, r = [];
            e && e.type === "(identifier)" && e.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/) && "Number String Boolean Date Object".indexOf(e.value) === -1 && (e.value === "Math" ? bt("Math is not a function.", e) : A.newcap && bt("Missing 'new' prefix when invoking a constructor.", e));
            if (C.id !== ")")for (; ;) {
                r[r.length] = At(10), n += 1;
                if (C.id !== ",")break;
                jt()
            }
            return Lt(")"), _t(_, z), typeof e == "object" && (e.value === "parseInt" && n === 1 && bt("Missing radix parameter.", z), A.evil || (e.value === "eval" || e.value === "Function" || e.value === "execScript" ? (bt("eval is evil.", e), r[0] && [0].id === "(string)" && xt(e, r[0].value)) : !r[0] || r[0].id !== "(string)" || e.value !== "setTimeout" && e.value !== "setInterval" ? r[0] && r[0].id === "(string)" && e.value === "." && e.left.value === "window" && (e.right === "setTimeout" || e.right === "setInterval") && (bt("Implied eval is evil. Pass a function instead of a string.", e), xt(e, r[0].value)) : (bt("Implied eval is evil. Pass a function instead of a string.", e), xt(e, r[0].value))), !e.identifier && e.id !== "." && e.id !== "[" && e.id !== "(" && e.id !== "&&" && e.id !== "||" && e.id !== "?" && bt("Bad invocation.", e)), t.left = e, t
        }, 155, !0).exps = !0, zt("(", function () {
            _t(), C.id === "function" && (C.immed = !0);
            var e = At(0);
            return Lt(")", this), _t(_, z), A.immed && e.id === "function" && C.id !== "(" && (C.id !== "." || kt().value !== "call" && kt().value !== "apply") && bt("Do not wrap function literals in parens unless they are to be immediately invoked.", this), e
        }), $t("[", function (e, t) {
            Mt(_, z), _t();
            var n = At(0), r;
            return n && n.type === "(string)" && (!A.evil && (n.value === "eval" || n.value === "execScript") && bt("eval is evil.", t), an(n.value), !A.sub && rt.test(n.value) && (r = R[n.value], (!r || !r.reserved) && bt("['{a}'] is better written in dot notation.", _, n.value))), Lt("]", t), _t(_, z), t.left = e, t.right = n, t
        }, 160, !0), zt("[", function () {
            var e = z.line !== C.line;
            this.first = [], e && (y += A.indent, C.from === y + A.indent && (y += A.indent));
            while (C.id !== "(end)") {
                while (C.id === ",")A.es5 || bt("Extra comma."), Lt(",");
                if (C.id === "]")break;
                e && z.line !== C.line && Ht(), this.first.push(At(10));
                if (C.id !== ",")break;
                jt();
                if (C.id === "]" && !A.es5) {
                    bt("Extra comma.", z);
                    break
                }
            }
            return e && (y -= A.indent, Ht()), Lt("]", this), this
        }, 160), function (e) {
            e.nud = function () {
                function o(e, t) {
                    s[e] && ut(s, e) ? bt("Duplicate member '{a}'.", C, n) : s[e] = {}, s[e].basic = !0, s[e].basicToken = t
                }

                function u(e, t) {
                    s[e] && ut(s, e) ? (s[e].basic || s[e].setter) && bt("Duplicate member '{a}'.", C, n) : s[e] = {}, s[e].setter = !0, s[e].setterToken = t
                }

                function a(e) {
                    s[e] && ut(s, e) ? (s[e].basic || s[e].getter) && bt("Duplicate member '{a}'.", C, n) : s[e] = {}, s[e].getter = !0, s[e].getterToken = z
                }

                var e, t, n, r, i, s = {};
                e = z.line !== C.line, e && (y += A.indent, C.from === y + A.indent && (y += A.indent));
                for (; ;) {
                    if (C.id === "}")break;
                    e && Ht();
                    if (C.value === "get" && kt().id !== ":")Lt("get"), A.es5 || Et("get/set are ES5 features."), n = ln(), n || Et("Missing property name."), a(n), i = C, Ot(z, C), t = hn(), r = t["(params)"], r && bt("Unexpected parameter '{a}' in get {b} function.", i, r[0], n), Ot(z, C); else if (C.value === "set" && kt().id !== ":")Lt("set"), A.es5 || Et("get/set are ES5 features."), n = ln(), n || Et("Missing property name."), u(n, C), i = C, Ot(z, C), t = hn(), r = t["(params)"], (!r || r.length !== 1) && bt("Expected a single parameter in set {a} function.", i, n); else {
                        n = ln(), o(n, C);
                        if (typeof n != "string")break;
                        Lt(":"), Dt(z, C), At(10)
                    }
                    an(n);
                    if (C.id !== ",")break;
                    jt(), C.id === "," ? bt("Extra comma.", z) : C.id === "}" && !A.es5 && bt("Extra comma.", z)
                }
                e && (y -= A.indent, Ht()), Lt("}", this);
                if (A.es5)for (var f in s)ut(s, f) && s[f].setter && !s[f].getter && bt("Setter is defined without getter.", s[f].setterToken);
                return this
            }, e.fud = function () {
                Et("Expected to see a statement and instead saw a block.", z)
            }
        }(It("{")), V = function () {
            var e = qt("const", function (e) {
                var t, n, r;
                this.first = [];
                for (; ;) {
                    Dt(z, C), t = tn(), h[t] === "const" && bt("const '" + t + "' has already been declared"), h["(global)"] && O[t] === !1 && bt("Redefinition of '{a}'.", z, t), Nt(t, "const");
                    if (e)break;
                    n = z, this.first.push(z), C.id !== "=" && bt("const '{a}' is initialized to 'undefined'.", z, t), C.id === "=" && (Dt(z, C), Lt("="), Dt(z, C), C.id === "undefined" && bt("It is not necessary to initialize '{a}' to 'undefined'.", z, t), kt(0).id === "=" && C.identifier && Et("Constant {a} was not declared correctly.", C, C.value), r = At(0), n.first = r);
                    if (C.id !== ",")break;
                    jt()
                }
                return this
            });
            e.exps = !0
        };
        var vn = qt("var", function (e) {
            var t, n, r;
            h["(onevar)"] && A.onevar ? bt("Too many var statements.") : h["(global)"] || (h["(onevar)"] = !0), this.first = [];
            for (; ;) {
                Dt(z, C), t = tn(), A.esnext && h[t] === "const" && bt("const '" + t + "' has already been declared"), h["(global)"] && O[t] === !1 && bt("Redefinition of '{a}'.", z, t), Nt(t, "unused", z);
                if (e)break;
                n = z, this.first.push(z), C.id === "=" && (Dt(z, C), Lt("="), Dt(z, C), C.id === "undefined" && bt("It is not necessary to initialize '{a}' to 'undefined'.", z, t), kt(0).id === "=" && C.identifier && Et("Variable {a} was not declared correctly.", C, C.value), r = At(0), n.first = r);
                if (C.id !== ",")break;
                jt()
            }
            return this
        });
        vn.exps = !0, Rt("function", function () {
            g && bt("Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.", z);
            var e = tn();
            return A.esnext && h[e] === "const" && bt("const '" + e + "' has already been declared"), Ot(z, C), Nt(e, "unction", z), hn(e, {statement: !0}), C.id === "(" && C.line === z.line && Et("Function declarations are not invocable. Wrap the whole function invocation in parens."), this
        }), zt("function", function () {
            var e = en();
            return e ? Ot(z, C) : Dt(z, C), hn(e), !A.loopfunc && h["(loopage)"] && bt("Don't make functions within a loop."), this
        }), Rt("if", function () {
            var e = C;
            return dn(), Lt("("), Dt(this, e), _t(), At(20), C.id === "=" && (A.boss || bt("Assignment in conditional expression"), Lt("="), At(20)), Lt(")", e), _t(_, z), un(!0, !0), C.id === "else" && (Dt(z, C), Lt("else"), C.id === "if" || C.id === "switch" ? rn(!0) : un(!0, !0)), this
        }), Rt("try", function () {
            function t() {
                var e = B, t;
                Lt("catch"), Dt(z, C), Lt("("), B = Object.create(e), t = C.value, C.type !== "(identifier)" && (t = null, bt("Expected an identifier and instead saw '{a}'.", C, t)), Lt(), Lt(")"), h = {"(name)": "(catch)", "(line)": C.line, "(character)": C.character, "(context)": h, "(breakage)": h["(breakage)"], "(loopage)": h["(loopage)"], "(scope)": B, "(statement)": !1, "(metrics)": pn(C), "(catch)": !0, "(tokens)": {}}, t && Nt(t, "exception"), z.funct = h, d.push(h), un(!1), B = e, h["(last)"] = z.line, h["(lastcharacter)"] = z.character, h = h["(context)"]
            }

            var e;
            un(!1), C.id === "catch" && (dn(), t(), e = !0);
            if (C.id === "finally") {
                Lt("finally"), un(!1);
                return
            }
            return e || Et("Expected '{a}' and instead saw '{b}'.", C, "catch", C.value), this
        }), Rt("while",function () {
            var e = C;
            return h["(breakage)"] += 1, h["(loopage)"] += 1, dn(), Lt("("), Dt(this, e), _t(), At(20), C.id === "=" && (A.boss || bt("Assignment in conditional expression"), Lt("="), At(20)), Lt(")", e), _t(_, z), un(!0, !0), h["(breakage)"] -= 1, h["(loopage)"] -= 1, this
        }).labelled = !0, Rt("with", function () {
            var e = C;
            return q["use strict"] ? Et("'with' is not allowed in strict mode.", z) : A.withstmt || bt("Don't use 'with'.", z), Lt("("), Dt(this, e), _t(), At(0), Lt(")", e), _t(_, z), un(!0, !0), this
        }), Rt("switch",function () {
            var e = C, t = !1;
            h["(breakage)"] += 1, Lt("("), Dt(this, e), _t(), this.condition = At(20), Lt(")", e), _t(_, z), Dt(z, C), e = C, Lt("{"), Dt(z, C), y += A.indent, this.cases = [];
            for (; ;)switch (C.id) {
                case"case":
                    switch (h["(verb)"]) {
                        case"break":
                        case"case":
                        case"continue":
                        case"return":
                        case"switch":
                        case"throw":
                            break;
                        default:
                            st.test(E[C.line - 2]) || bt("Expected a 'break' statement before 'case'.", z)
                    }
                    Ht(-A.indent), Lt("case"), this.cases.push(At(20)), dn(), t = !0, Lt(":"), h["(verb)"] = "case";
                    break;
                case"default":
                    switch (h["(verb)"]) {
                        case"break":
                        case"continue":
                        case"return":
                        case"throw":
                            break;
                        default:
                            st.test(E[C.line - 2]) || bt("Expected a 'break' statement before 'default'.", z)
                    }
                    Ht(-A.indent), Lt("default"), t = !0, Lt(":");
                    break;
                case"}":
                    y -= A.indent, Ht(), Lt("}", e);
                    if (this.cases.length === 1 || this.condition.id === "true" || this.condition.id === "false")A.onecase || bt("This 'switch' should be an 'if'.", this);
                    h["(breakage)"] -= 1, h["(verb)"] = undefined;
                    return;
                case"(end)":
                    Et("Missing '{a}'.", C, "}");
                    return;
                default:
                    if (t)switch (z.id) {
                        case",":
                            Et("Each value should have its own case label.");
                            return;
                        case":":
                            t = !1, sn();
                            break;
                        default:
                            Et("Missing ':' on a case clause.", z);
                            return
                    } else {
                        if (z.id !== ":") {
                            Et("Expected '{a}' and instead saw '{b}'.", C, "case", C.value);
                            return
                        }
                        Lt(":"), Et("Unexpected '{a}'.", z, ":"), sn()
                    }
            }
        }).labelled = !0, qt("debugger",function () {
            return A.debug || bt("All 'debugger' statements should be removed."), this
        }).exps = !0, function () {
            var e = qt("do", function () {
                h["(breakage)"] += 1, h["(loopage)"] += 1, dn(), this.first = un(!0), Lt("while");
                var e = C;
                return Dt(z, e), Lt("("), _t(), At(20), C.id === "=" && (A.boss || bt("Assignment in conditional expression"), Lt("="), At(20)), Lt(")", e), _t(_, z), h["(breakage)"] -= 1, h["(loopage)"] -= 1, this
            });
            e.labelled = !0, e.exps = !0
        }(), Rt("for",function () {
            var e, t = C;
            h["(breakage)"] += 1, h["(loopage)"] += 1, dn(), Lt("("), Dt(this, t), _t();
            if (kt(C.id === "var" ? 1 : 0).id === "in") {
                if (C.id === "var")Lt("var"), vn.fud.call(vn, !0); else {
                    switch (h[C.value]) {
                        case"unused":
                            h[C.value] = "var";
                            break;
                        case"var":
                            break;
                        default:
                            bt("Bad for in variable '{a}'.", C, C.value)
                    }
                    Lt()
                }
                return Lt("in"), At(20), Lt(")", t), e = un(!0, !0), A.forin && e && (e.length > 1 || typeof e[0] != "object" || e[0].value !== "if") && bt("The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.", this), h["(breakage)"] -= 1, h["(loopage)"] -= 1, this
            }
            if (C.id !== ";")if (C.id === "var")Lt("var"), vn.fud.call(vn); else for (; ;) {
                At(0, "for");
                if (C.id !== ",")break;
                jt()
            }
            Bt(z), Lt(";"), C.id !== ";" && (At(20), C.id === "=" && (A.boss || bt("Assignment in conditional expression"), Lt("="), At(20))), Bt(z), Lt(";"), C.id === ";" && Et("Expected '{a}' and instead saw '{b}'.", C, ")", ";");
            if (C.id !== ")")for (; ;) {
                At(0, "for");
                if (C.id !== ",")break;
                jt()
            }
            return Lt(")", t), _t(_, z), un(!0, !0), h["(breakage)"] -= 1, h["(loopage)"] -= 1, this
        }).labelled = !0, qt("break",function () {
            var e = C.value;
            return h["(breakage)"] === 0 && bt("Unexpected '{a}'.", C, this.value), A.asi || Bt(this), C.id !== ";" && z.line === C.line && (h[e] !== "label" ? bt("'{a}' is not a statement label.", C, e) : B[e] !== h && bt("'{a}' is out of scope.", C, e), this.first = C, Lt()), nn("break"), this
        }).exps = !0, qt("continue",function () {
            var e = C.value;
            return h["(breakage)"] === 0 && bt("Unexpected '{a}'.", C, this.value), A.asi || Bt(this), C.id !== ";" ? z.line === C.line && (h[e] !== "label" ? bt("'{a}' is not a statement label.", C, e) : B[e] !== h && bt("'{a}' is out of scope.", C, e), this.first = C, Lt()) : h["(loopage)"] || bt("Unexpected '{a}'.", C, this.value), nn("continue"), this
        }).exps = !0, qt("return",function () {
            return this.line === C.line ? (C.id === "(regexp)" && bt("Wrap the /regexp/ literal in parens to disambiguate the slash operator."), C.id !== ";" && !C.reach && (Dt(z, C), kt().value === "=" && !A.boss && wt("Did you mean to return a conditional instead of an assignment?", z.line, z.character + 1), this.first = At(0))) : A.asi || Bt(this), nn("return"), this
        }).exps = !0, qt("throw",function () {
            return Bt(this), Dt(z, C), this.first = At(20), nn("throw"), this
        }).exps = !0, Xt("class"), Xt("const"), Xt("enum"), Xt("export"), Xt("extends"), Xt("import"), Xt("super"), Xt("let"), Xt("yield"), Xt("implements"), Xt("interface"), Xt("package"), Xt("private"), Xt("protected"), Xt("public"), Xt("static");
        var gn = function (e, t, n) {
            var i, s, o, u, a, l = {};
            t && t.scope ? r.scope = t.scope : (r.errors = [], r.undefs = [], r.internals = [], r.blacklist = {}, r.scope = "(main)"), O = Object.create(F), f = Object.create(null), dt(O, n || {});
            if (t) {
                i = t.predef, i && (!Array.isArray(i) && typeof i == "object" && (i = Object.keys(i)), i.forEach(function (e) {
                    var t;
                    e[0] === "-" ? (t = e.slice(1), r.blacklist[t] = t) : O[e] = !0
                })), a = Object.keys(t);
                for (u = 0; u < a.length; u++)l[a[u]] = t[a[u]], a[u] === "newcap" && t[a[u]] === !1 && (l["(explicitNewcap)"] = !0), a[u] === "indent" && (l.white = !0)
            }
            A = l, A.indent = A.indent || 4, A.maxerr = A.maxerr || 50, U = "";
            for (s = 0; s < A.indent; s += 1)U += " ";
            y = 1, v = Object.create(O), B = v, h = {"(global)": !0, "(name)": "(global)", "(scope)": B, "(breakage)": 0, "(loopage)": 0, "(tokens)": {}, "(metrics)": pn(C)}, d = [h], X = [], j = null, x = {}, T = null, m = {}, g = !1, S = [], b = !1, $ = 0, E = [], W = [];
            if (!ft(e) && !Array.isArray(e))return St("Input is neither a string nor an array of strings.", 0), !1;
            if (ft(e) && /^\s*$/g.test(e))return St("Input is an empty string.", 0), !1;
            if (e.length === 0)return St("Input is an empty array.", 0), !1;
            Tt.init(e), M = !0, q = {}, _ = z = C = R["(begin)"];
            for (var c in t)ut(t, c) && at(c, z);
            mt(), dt(O, n || {}), jt.first = !0, P = undefined;
            try {
                Lt();
                switch (C.id) {
                    case"{":
                    case"[":
                        A.laxbreak = !0, b = !0, mn();
                        break;
                    default:
                        on(), q["use strict"] && !A.globalstrict && bt('Use the function form of "use strict".', _), sn()
                }
                Lt(C && C.value !== "." ? "(end)" : undefined);
                var p = function (e, t) {
                    do {
                        if (typeof t[e] == "string")return t[e] === "unused" ? t[e] = "var" : t[e] === "unction" && (t[e] = "closure"), !0;
                        t = t["(context)"]
                    } while (t);
                    return!1
                }, w = function (e, t) {
                    if (!m[e])return;
                    var n = [];
                    for (var r = 0; r < m[e].length; r += 1)m[e][r] !== t && n.push(m[e][r]);
                    n.length === 0 ? delete m[e] : m[e] = n
                }, N = function (e, t) {
                    var n = t.line, r = t.character;
                    A.unused && wt("'{a}' is defined but never used.", n, r, e), W.push({name: e, line: n, character: r})
                }, k = function (e, t) {
                    var n = e[t], r = e["(tokens)"][t];
                    if (t.charAt(0) === "(")return;
                    if (n !== "unused" && n !== "unction")return;
                    if (e["(params)"] && e["(params)"].indexOf(t) !== -1)return;
                    N(t, r)
                };
                for (s = 0; s < r.undefs.length; s += 1)o = r.undefs[s].slice(0), p(o[2].value, o[0]) ? w(o[2].value, o[2].line) : bt.apply(bt, o.slice(1));
                d.forEach(function (e) {
                    for (var t in e)ut(e, t) && k(e, t);
                    if (!e["(params)"])return;
                    var n = e["(params)"].slice(), r = n.pop(), i;
                    while (r) {
                        i = e[r];
                        if (r === "undefined")return;
                        if (i !== "unused" && i !== "unction")return;
                        N(r, e["(tokens)"][r]), r = n.pop()
                    }
                });
                for (var L in f)ut(f, L) && !ut(v, L) && N(L, f[L])
            } catch (D) {
                if (D) {
                    var H = C || {};
                    r.errors.push({raw: D.raw, reason: D.message, line: D.line || H.line, character: D.character || H.from}, null)
                }
            }
            if (r.scope === "(main)") {
                t = t || {};
                for (s = 0; s < r.internals.length; s += 1)o = r.internals[s], t.scope = o.elem, gn(o.value, t, n)
            }
            return r.errors.length === 0
        };
        return gn.data = function () {
            var e = {functions: [], options: A}, t = [], n = [], r, i, s, o, u, a;
            gn.errors.length && (e.errors = gn.errors), b && (e.json = !0);
            for (u in m)ut(m, u) && t.push({name: u, line: m[u]});
            t.length > 0 && (e.implieds = t), X.length > 0 && (e.urls = X), a = Object.keys(B), a.length > 0 && (e.globals = a);
            for (s = 1; s < d.length; s += 1) {
                i = d[s], r = {};
                for (o = 0; o < p.length; o += 1)r[p[o]] = [];
                for (o = 0; o < p.length; o += 1)r[p[o]].length === 0 && delete r[p[o]];
                r.name = i["(name)"], r.param = i["(params)"], r.line = i["(line)"], r.character = i["(character)"], r.last = i["(last)"], r.lastcharacter = i["(lastcharacter)"], e.functions.push(r)
            }
            W.length > 0 && (e.unused = W), n = [];
            for (u in x)if (typeof x[u] == "number") {
                e.member = x;
                break
            }
            return e
        }, gn.jshint = gn, gn
    }();
    typeof t == "object" && t && (t.JSHINT = r)
})