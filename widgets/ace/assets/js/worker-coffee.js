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
}), define("ace/mode/coffee_worker", ["require", "exports", "module", "ace/lib/oop", "ace/worker/mirror", "ace/mode/coffee/coffee-script"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("../worker/mirror").Mirror, s = e("../mode/coffee/coffee-script");
    window.addEventListener = function () {
    };
    var o = t.Worker = function (e) {
        i.call(this, e), this.setTimeout(200)
    };
    r.inherits(o, i), function () {
        this.onUpdate = function () {
            var e = this.doc.getValue();
            try {
                s.parse(e)
            } catch (t) {
                var n = t.message.match(/Parse error on line (\d+): (.*)/);
                if (n) {
                    this.sender.emit("error", {row: parseInt(n[1], 10) - 1, column: null, text: n[2], type: "error"});
                    return
                }
                if (t instanceof SyntaxError) {
                    var n = t.message.match(/ on line (\d+)/);
                    n && this.sender.emit("error", {row: parseInt(n[1], 10) - 1, column: null, text: t.message.replace(n[0], ""), type: "error"})
                }
                return
            }
            this.sender.emit("ok")
        }
    }.call(o.prototype)
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
}), define("ace/mode/coffee/coffee-script", ["require", "exports", "module", "ace/mode/coffee/lexer", "ace/mode/coffee/parser", "ace/mode/coffee/nodes"], function (e, t, n) {
    var r = e("./lexer").Lexer, i = e("./parser"), s = new r;
    i.lexer = {lex: function () {
        var e, t;
        return t = this.tokens[this.pos++] || [""], e = t[0], this.yytext = t[1], this.yylineno = t[2], e
    }, setInput: function (e) {
        return this.tokens = e, this.pos = 0
    }, upcomingInput: function () {
        return""
    }}, i.yy = e("./nodes"), t.parse = function (e) {
        return i.parse(s.tokenize(e))
    }
}), define("ace/mode/coffee/lexer", ["require", "exports", "module", "ace/mode/coffee/rewriter", "ace/mode/coffee/helpers"], function (e, t, n) {
    var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I, q, R, U, z, W, X, V, $, J, K, Q, G = [].indexOf || function (e) {
        for (var t = 0, n = this.length; t < n; t++)if (t in this && this[t] === e)return t;
        return-1
    };
    K = e("./rewriter"), j = K.Rewriter, b = K.INVERSES, Q = e("./helpers"), X = Q.count, J = Q.starts, W = Q.compact, $ = Q.last, t.Lexer = C = function () {
        function e() {
        }

        return e.prototype.tokenize = function (e, t) {
            var n, r;
            t == null && (t = {}), z.test(e) && (e = "\n" + e), e = e.replace(/\r/g, "").replace(R, ""), this.code = e, this.line = t.line || 0, this.indent = 0, this.indebt = 0, this.outdebt = 0, this.indents = [], this.ends = [], this.tokens = [], n = 0;
            while (this.chunk = e.slice(n))n += this.identifierToken() || this.commentToken() || this.whitespaceToken() || this.lineToken() || this.heredocToken() || this.stringToken() || this.numberToken() || this.regexToken() || this.jsToken() || this.literalToken();
            return this.closeIndentation(), (r = this.ends.pop()) && this.error("missing " + r), t.rewrite === !1 ? this.tokens : (new j).rewrite(this.tokens)
        }, e.prototype.identifierToken = function () {
            var e, t, n, r, i, s, f, l, c;
            return(i = g.exec(this.chunk)) ? (r = i[0], n = i[1], e = i[2], n === "own" && this.tag() === "FOR" ? (this.token("OWN", n), n.length) : (t = e || (s = $(this.tokens)) && ((l = s[0]) === "." || l === "?." || l === "::" || !s.spaced && s[0] === "@"), f = "IDENTIFIER", !t && (G.call(S, n) >= 0 || G.call(a, n) >= 0) && (f = n.toUpperCase(), f === "WHEN" && (c = this.tag(), G.call(x, c) >= 0) ? f = "LEADING_WHEN" : f === "FOR" ? this.seenFor = !0 : f === "UNLESS" ? f = "IF" : G.call(U, f) >= 0 ? f = "UNARY" : G.call(H, f) >= 0 && (f !== "INSTANCEOF" && this.seenFor ? (f = "FOR" + f, this.seenFor = !1) : (f = "RELATION", this.value() === "!" && (this.tokens.pop(), n = "!" + n)))), G.call(E, n) >= 0 && (t ? (f = "IDENTIFIER", n = new String(n), n.reserved = !0) : G.call(B, n) >= 0 && this.error('reserved word "' + n + '"')), t || (G.call(o, n) >= 0 && (n = u[n]), f = function () {
                switch (n) {
                    case"!":
                        return"UNARY";
                    case"==":
                    case"!=":
                        return"COMPARE";
                    case"&&":
                    case"||":
                        return"LOGIC";
                    case"true":
                    case"false":
                        return"BOOL";
                    case"break":
                    case"continue":
                        return"STATEMENT";
                    default:
                        return f
                }
            }()), this.token(f, n), e && this.token(":", ":"), r.length)) : 0
        }, e.prototype.numberToken = function () {
            var e, t, n, r, i;
            if (!(n = _.exec(this.chunk)))return 0;
            r = n[0], /^0[BOX]/.test(r) ? this.error("radix prefix '" + r + "' must be lowercase") : /E/.test(r) && !/^0x/.test(r) ? this.error("exponential notation '" + r + "' must be indicated with a lowercase 'e'") : /^0\d*[89]/.test(r) ? this.error("decimal literal '" + r + "' must not be prefixed with '0'") : /^0\d+/.test(r) && this.error("octal literal '" + r + "' must be prefixed with '0o'"), t = r.length;
            if (i = /^0o([0-7]+)/.exec(r))r = "0x" + parseInt(i[1], 8).toString(16);
            if (e = /^0b([01]+)/.exec(r))r = "0x" + parseInt(e[1], 2).toString(16);
            return this.token("NUMBER", r), t
        }, e.prototype.stringToken = function () {
            var e, t, n;
            switch (this.chunk.charAt(0)) {
                case"'":
                    if (!(e = I.exec(this.chunk)))return 0;
                    this.token("STRING", (n = e[0]).replace(L, "\\\n"));
                    break;
                case'"':
                    if (!(n = this.balancedString(this.chunk, '"')))return 0;
                    0 < n.indexOf("#{",1)?this.interpolateString(n.slice(1,-1)):this.token("STRING", this.escapeLines(n));
                    break;
                default:
                    return 0
            }
            return(t = /^(?:\\.|[^\\])*\\(?:0[0-7]|[1-7])/.test(n)) && this.error("octal escape sequences " + n + " are not allowed"), this.line += X(n, "\n"), n.length
        }, e.prototype.heredocToken = function () {
            var e, t, n, r;
            return(n = h.exec(this.chunk)) ? (t = n[0], r = t.charAt(0), e = this.sanitizeHeredoc(n[2], {quote: r, indent: null}), r === '"' && 0 <= e.indexOf("#{")?this.interpolateString(e,{heredoc:!0}):this.token("STRING",this.makeString(e,r,!0)),this.line+=X(t,"\n"), t.length) : 0
        }, e.prototype.commentToken = function () {
            var e, t, n;
            return(n = this.chunk.match(f)) ? (e = n[0], t = n[1], t && this.token("HERECOMMENT", this.sanitizeHeredoc(t, {herecomment: !0, indent: Array(this.indent + 1).join(" ")})), this.line += X(e, "\n"), e.length) : 0
        }, e.prototype.jsToken = function () {
            var e, t;
            return this.chunk.charAt(0) !== "`" || !(e = w.exec(this.chunk)) ? 0 : (this.token("JS", (t = e[0]).slice(1, -1)), this.line += X(t, "\n"), t.length)
        }, e.prototype.regexToken = function () {
            var e, t, n, r, i, s, o;
            return this.chunk.charAt(0) !== "/" ? 0 : (n = v.exec(this.chunk)) ? (t = this.heregexToken(n), this.line += X(n[0], "\n"), t) : (r = $(this.tokens), r && (s = r[0], G.call(r.spaced ? O : M, s) >= 0) ? 0 : (n = P.exec(this.chunk)) ? (o = n, n = o[0], i = o[1], e = o[2], i.slice(0, 2) === "/*" && this.error("regular expressions cannot begin with `*`"), i === "//" && (i = "/(?:)/"), this.token("REGEX", "" + i + e), n.length) : 0)
        }, e.prototype.heregexToken = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p;
            r = e[0], t = e[1], n = e[2];
            if (0 > t.indexOf("#{"))return i=t.replace(m,"").replace(/\//g,"\\/"),i.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(i||"(?:)")+"/" + n), r.length;
            this.token("IDENTIFIER", "RegExp"), this.tokens.push(["CALL_START", "("]), o = [], l = this.interpolateString(t, {regex: !0});
            for (a = 0, f = l.length; a < f; a++) {
                c = l[a], s = c[0], u = c[1];
                if (s === "TOKENS")o.push.apply(o, u); else {
                    if (!(u = u.replace(m, "")))continue;
                    u = u.replace(/\\/g, "\\\\"), o.push(["STRING", this.makeString(u, '"', !0)])
                }
                o.push(["+", "+"])
            }
            return o.pop(), ((h = o[0]) != null ? h[0] : void 0) !== "STRING" && this.tokens.push(["STRING", '""'], ["+", "+"]), (p = this.tokens).push.apply(p, o), n && this.tokens.push([",", ","], ["STRING", '"' + n + '"']), this.token(")", ")"), r.length
        }, e.prototype.lineToken = function () {
            var e, t, n, r, i;
            if (!(n = A.exec(this.chunk)))return 0;
            t = n[0], this.line += X(t, "\n"), this.seenFor = !1, i = t.length - 1 - t.lastIndexOf("\n"), r = this.unfinished();
            if (i - this.indebt === this.indent)return r ? this.suppressNewlines() : this.newlineToken(), t.length;
            if (i > this.indent) {
                if (r)return this.indebt = i - this.indent, this.suppressNewlines(), t.length;
                e = i - this.indent + this.outdebt, this.token("INDENT", e), this.indents.push(e), this.ends.push("OUTDENT"), this.outdebt = this.indebt = 0
            } else this.indebt = 0, this.outdentToken(this.indent - i, r);
            return this.indent = i, t.length
        }, e.prototype.outdentToken = function (e, t) {
            var n, r;
            while (e > 0)r = this.indents.length - 1, this.indents[r] === void 0 ? e = 0 : this.indents[r] === this.outdebt ? (e -= this.outdebt, this.outdebt = 0) : this.indents[r] < this.outdebt ? (this.outdebt -= this.indents[r], e -= this.indents[r]) : (n = this.indents.pop() - this.outdebt, e -= n, this.outdebt = 0, this.pair("OUTDENT"), this.token("OUTDENT", n));
            n && (this.outdebt -= e);
            while (this.value() === ";")this.tokens.pop();
            return this.tag() !== "TERMINATOR" && !t && this.token("TERMINATOR", "\n"), this
        }, e.prototype.whitespaceToken = function () {
            var e, t, n;
            return!(e = z.exec(this.chunk)) && !(t = this.chunk.charAt(0) === "\n") ? 0 : (n = $(this.tokens), n && (n[e ? "spaced" : "newLine"] = !0), e ? e[0].length : 0)
        }, e.prototype.newlineToken = function () {
            while (this.value() === ";")this.tokens.pop();
            return this.tag() !== "TERMINATOR" && this.token("TERMINATOR", "\n"), this
        }, e.prototype.suppressNewlines = function () {
            return this.value() === "\\" && this.tokens.pop(), this
        }, e.prototype.literalToken = function () {
            var e, t, n, r, o, u, a, f;
            (e = D.exec(this.chunk)) ? (r = e[0], s.test(r) && this.tagParameters()) : r = this.chunk.charAt(0), n = r, t = $(this.tokens);
            if (r === "=" && t) {
                !t[1].reserved && (o = t[1], G.call(E, o) >= 0) && this.error('reserved word "' + this.value() + "\" can't be assigned");
                if ((u = t[1]) === "||" || u === "&&")return t[0] = "COMPOUND_ASSIGN", t[1] += "=", r.length
            }
            if (r === ";")this.seenFor = !1, n = "TERMINATOR"; else if (G.call(k, r) >= 0)n = "MATH"; else if (G.call(l, r) >= 0)n = "COMPARE"; else if (G.call(c, r) >= 0)n = "COMPOUND_ASSIGN"; else if (G.call(U, r) >= 0)n = "UNARY"; else if (G.call(F, r) >= 0)n = "SHIFT"; else if (G.call(N, r) >= 0 || r === "?" && (t != null ? t.spaced : void 0))n = "LOGIC"; else if (t && !t.spaced)if (r === "(" && (a = t[0], G.call(i, a) >= 0))t[0] === "?" && (t[0] = "FUNC_EXIST"), n = "CALL_START"; else if (r === "[" && (f = t[0], G.call(y, f) >= 0)) {
                n = "INDEX_START";
                switch (t[0]) {
                    case"?":
                        t[0] = "INDEX_SOAK"
                }
            }
            switch (r) {
                case"(":
                case"{":
                case"[":
                    this.ends.push(b[r]);
                    break;
                case")":
                case"}":
                case"]":
                    this.pair(r)
            }
            return this.token(n, r), r.length
        }, e.prototype.sanitizeHeredoc = function (e, t) {
            var n, r, i, s, o;
            i = t.indent, r = t.herecomment;
            if (r) {
                p.test(e) && this.error('block comment cannot contain "*/", starting');
                if (e.indexOf("\n") <= 0)return e
            } else while (s = d.exec(e)) {
                n = s[1];
                if (i === null || 0 < (o = n.length) && o < i.length)i = n
            }
            return i && (e = e.replace(RegExp("\\n" + i, "g"), "\n")), r || (e = e.replace(/^\n/, "")), e
        }, e.prototype.tagParameters = function () {
            var e, t, n, r;
            if (this.tag() !== ")")return this;
            t = [], r = this.tokens, e = r.length, r[--e][0] = "PARAM_END";
            while (n = r[--e])switch (n[0]) {
                case")":
                    t.push(n);
                    break;
                case"(":
                case"CALL_START":
                    if (!t.length)return n[0] === "(" ? (n[0] = "PARAM_START", this) : this;
                    t.pop()
            }
            return this
        }, e.prototype.closeIndentation = function () {
            return this.outdentToken(this.indent)
        }, e.prototype.balancedString = function (e, t) {
            var n, r, i, s, o, u, a, f;
            n = 0, u = [t];
            for (r = a = 1, f = e.length; 1 <= f ? a < f : a > f; r = 1 <= f ? ++a : --a) {
                if (n) {
                    --n;
                    continue
                }
                switch (i = e.charAt(r)) {
                    case"\\":
                        ++n;
                        continue;
                    case t:
                        u.pop();
                        if (!u.length)return e.slice(0, +r + 1 || 9e9);
                        t = u[u.length - 1];
                        continue
                }
                t !== "}" || i !== '"' && i !== "'" ? t === "}" && i === "/" && (s = v.exec(e.slice(r)) || P.exec(e.slice(r))) ? n += s[0].length - 1 : t === "}" && i === "{" ? u.push(t = "}") : t === '"' && o === "#" && i === "{" && u.push(t = "}") : u.push(t = i), o = i
            }
            return this.error("missing " + u.pop() + ", starting")
        }, e.prototype.interpolateString = function (t, n) {
            var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w;
            n == null && (n = {}), i = n.heredoc, h = n.regex, d = [], c = 0, s = -1;
            while (f = t.charAt(s += 1)) {
                if (f === "\\") {
                    s += 1;
                    continue
                }
                if (f !== "#" || t.charAt(s + 1) !== "{" || !(r = this.balancedString(t.slice(s + 1), "}")))continue;
                c < s && d.push(["NEOSTRING", t.slice(c, s)]), o = r.slice(1, -1);
                if (o.length) {
                    l = (new e).tokenize(o, {line: this.line, rewrite: !1}), l.pop(), ((y = l[0]) != null ? y[0] : void 0) === "TERMINATOR" && l.shift();
                    if (a = l.length)a > 1 && (l.unshift(["(", "(", this.line]), l.push([")", ")", this.line])), d.push(["TOKENS", l])
                }
                s += r.length, c = s + 1
            }
            s > c && c < t.length && d.push(["NEOSTRING", t.slice(c)]);
            if (h)return d;
            if (!d.length)return this.token("STRING", '""');
            d[0][0] !== "NEOSTRING" && d.unshift(["", ""]), (u = d.length > 1) && this.token("(", "(");
            for (s = m = 0, g = d.length; m < g; s = ++m)b = d[s], p = b[0], v = b[1], s && this.token("+", "+"), p === "TOKENS" ? (w = this.tokens).push.apply(w, v) : this.token("STRING", this.makeString(v, '"', i));
            return u && this.token(")", ")"), d
        }, e.prototype.pair = function (e) {
            var t, n;
            return e !== (n = $(this.ends)) ? ("OUTDENT" !== n && this.error("unmatched " + e), this.indent -= t = $(this.indents), this.outdentToken(t, !0), this.pair(e)) : this.ends.pop()
        }, e.prototype.token = function (e, t) {
            return this.tokens.push([e, t, this.line])
        }, e.prototype.tag = function (e, t) {
            var n;
            return(n = $(this.tokens, e)) && (t ? n[0] = t : n[0])
        }, e.prototype.value = function (e, t) {
            var n;
            return(n = $(this.tokens, e)) && (t ? n[1] = t : n[1])
        }, e.prototype.unfinished = function () {
            var e;
            return T.test(this.chunk) || (e = this.tag()) === "\\" || e === "." || e === "?." || e === "UNARY" || e === "MATH" || e === "+" || e === "-" || e === "SHIFT" || e === "RELATION" || e === "COMPARE" || e === "LOGIC" || e === "THROW" || e === "EXTENDS"
        }, e.prototype.escapeLines = function (e, t) {
            return e.replace(L, t ? "\\n" : "")
        }, e.prototype.makeString = function (e, t, n) {
            return e ? (e = e.replace(/\\([\s\S])/g, function (e, n) {
                return n === "\n" || n === t ? n : e
            }), e = e.replace(RegExp("" + t, "g"), "\\$&"), t + this.escapeLines(e, n) + t) : t + t
        }, e.prototype.error = function (e) {
            throw SyntaxError("" + e + " on line " + (this.line + 1))
        }, e
    }(), S = ["true", "false", "null", "this", "new", "delete", "typeof", "in", "instanceof", "return", "throw", "break", "continue", "debugger", "if", "else", "switch", "for", "while", "do", "try", "catch", "finally", "class", "extends", "super"], a = ["undefined", "then", "unless", "until", "loop", "of", "by", "when"], u = {and: "&&", or: "||", is: "==", isnt: "!=", not: "!", yes: "true", no: "false", on: "true", off: "false"}, o = function () {
        var e;
        e = [];
        for (V in u)e.push(V);
        return e
    }(), a = a.concat(o), B = ["case", "default", "function", "var", "void", "with", "const", "let", "enum", "export", "import", "native", "__hasProp", "__extends", "__slice", "__bind", "__indexOf", "implements", "interface", "package", "private", "protected", "public", "static", "yield"], q = ["arguments", "eval"], E = S.concat(B).concat(q), t.RESERVED = B.concat(S).concat(a).concat(q), t.STRICT_PROSCRIBED = q, g = /^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/, _ = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i, h = /^("""|''')([\s\S]*?)(?:\n[^\n\S]*)?\1/, D = /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?\.|\.{2,3})/, z = /^[^\n\S]+/, f = /^###([^#][\s\S]*?)(?:###[^\n\S]*|(?:###)?$)|^(?:\s*#(?!##[^#]).*)+/, s = /^[-=]>/, A = /^(?:\n[^\n\S]*)+/, I = /^'[^\\']*(?:\\.[^\\']*)*'/, w = /^`[^\\`]*(?:\\.[^\\`]*)*`/, P = /^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/, v = /^\/{3}([\s\S]+?)\/{3}([imgy]{0,4})(?!\w)/, m = /\s+(?:#.*)?/g, L = /\n/g, d = /\n+([^\n\S]*)/g, p = /\*\//, T = /^\s*(?:,|\??\.(?![.\d])|::)/, R = /\s+$/, c = ["-=", "+=", "/=", "*=", "%=", "||=", "&&=", "?=", "<<=", ">>=", ">>>=", "&=", "^=", "|="], U = ["!", "~", "NEW", "TYPEOF", "DELETE", "DO"], N = ["&&", "||", "&", "|", "^"], F = ["<<", ">>", ">>>"], l = ["==", "!=", "<", ">", "<=", ">="], k = ["*", "/", "%"], H = ["IN", "OF", "INSTANCEOF"], r = ["TRUE", "FALSE"], O = ["NUMBER", "REGEX", "BOOL", "NULL", "UNDEFINED", "++", "--", "]"], M = O.concat(")", "}", "THIS", "IDENTIFIER", "STRING"), i = ["IDENTIFIER", "STRING", "REGEX", ")", "]", "}", "?", "::", "@", "THIS", "SUPER"], y = i.concat("NUMBER", "BOOL", "NULL", "UNDEFINED"), x = ["INDENT", "OUTDENT", "TERMINATOR"]
}), define("ace/mode/coffee/rewriter", ["require", "exports", "module"], function (e, t, n) {
    var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E = [].indexOf || function (e) {
        for (var t = 0, n = this.length; t < n; t++)if (t in this && this[t] === e)return t;
        return-1
    }, S = [].slice;
    t.Rewriter = function () {
        function e() {
        }

        return e.prototype.rewrite = function (e) {
            return this.tokens = e, this.removeLeadingNewlines(), this.removeMidExpressionNewlines(), this.closeOpenCalls(), this.closeOpenIndexes(), this.addImplicitIndentation(), this.tagPostfixConditionals(), this.addImplicitBraces(), this.addImplicitParentheses(), this.tokens
        }, e.prototype.scanTokens = function (e) {
            var t, n, r;
            r = this.tokens, t = 0;
            while (n = r[t])t += e.call(this, n, t, r);
            return!0
        }, e.prototype.detectEnd = function (e, t, n) {
            var r, i, u, a, f;
            u = this.tokens, r = 0;
            while (i = u[e]) {
                if (r === 0 && t.call(this, i, e))return n.call(this, i, e);
                if (!i || r < 0)return n.call(this, i, e - 1);
                if (a = i[0], E.call(o, a) >= 0)r += 1; else if (f = i[0], E.call(s, f) >= 0)r -= 1;
                e += 1
            }
            return e - 1
        }, e.prototype.removeLeadingNewlines = function () {
            var e, t, n, r, i;
            i = this.tokens;
            for (e = n = 0, r = i.length; n < r; e = ++n) {
                t = i[e][0];
                if (t !== "TERMINATOR")break
            }
            if (e)return this.tokens.splice(0, e)
        }, e.prototype.removeMidExpressionNewlines = function () {
            return this.scanTokens(function (e, t, n) {
                var r;
                return e[0] === "TERMINATOR" && (r = this.tag(t + 1), E.call(i, r) >= 0) ? (n.splice(t, 1), 0) : 1
            })
        }, e.prototype.closeOpenCalls = function () {
            var e, t;
            return t = function (e, t) {
                var n;
                return(n = e[0]) === ")" || n === "CALL_END" || e[0] === "OUTDENT" && this.tag(t - 1) === ")"
            }, e = function (e, t) {
                return this.tokens[e[0] === "OUTDENT" ? t - 1 : t][0] = "CALL_END"
            }, this.scanTokens(function (n, r) {
                return n[0] === "CALL_START" && this.detectEnd(r + 1, t, e), 1
            })
        }, e.prototype.closeOpenIndexes = function () {
            var e, t;
            return t = function (e, t) {
                var n;
                return(n = e[0]) === "]" || n === "INDEX_END"
            }, e = function (e, t) {
                return e[0] = "INDEX_END"
            }, this.scanTokens(function (n, r) {
                return n[0] === "INDEX_START" && this.detectEnd(r + 1, t, e), 1
            })
        }, e.prototype.addImplicitBraces = function () {
            var e, t, n, r, i, u, a, l;
            return r = [], i = null, l = null, n = !0, u = 0, a = 0, t = function (e, t) {
                var r, i, s, o, u, c;
                return u = this.tokens.slice(t + 1, +(t + 3) + 1 || 9e9), r = u[0], o = u[1], s = u[2], "HERECOMMENT" === (r != null ? r[0] : void 0) ? !1 : (i = e[0], E.call(p, i) >= 0 && (n = !1), (i === "TERMINATOR" || i === "OUTDENT" || E.call(f, i) >= 0 && n && t - a !== 1) && (!l && this.tag(t - 1) !== "," || (o != null ? o[0] : void 0) !== ":" && ((r != null ? r[0] : void 0) !== "@" || (s != null ? s[0] : void 0) !== ":")) || i === "," && r && (c = r[0]) !== "IDENTIFIER" && c !== "NUMBER" && c !== "STRING" && c !== "@" && c !== "TERMINATOR" && c !== "OUTDENT")
            }, e = function (e, t) {
                var n;
                return n = this.generate("}", "}", e[2]), this.tokens.splice(t, 0, n)
            }, this.scanTokens(function (u, f, c) {
                var h, d, v, m, g, y, b, w;
                if (b = m = u[0], E.call(o, b) >= 0)return r.push([m === "INDENT" && this.tag(f - 1) === "{" ? "{" : m, f]), 1;
                if (E.call(s, m) >= 0)return i = r.pop(), 1;
                if (m !== ":" || (h = this.tag(f - 2)) !== ":" && ((w = r[r.length - 1]) != null ? w[0] : void 0) === "{")return 1;
                n = !0, a = f + 1, r.push(["{"]), d = h === "@" ? f - 2 : f - 1;
                while (this.tag(d - 2) === "HERECOMMENT")d -= 2;
                return v = this.tag(d - 1), l = !v || E.call(p, v) >= 0, y = new String("{"), y.generated = !0, g = this.generate("{", y, u[2]), c.splice(d, 0, g), this.detectEnd(f + 2, t, e), 2
            })
        }, e.prototype.addImplicitParentheses = function () {
            var e, t, n, r, i;
            return n = i = r = !1, t = function (e, t) {
                var n, s, o, a;
                s = e[0];
                if (!i && e.fromThen)return!0;
                if (s === "IF" || s === "ELSE" || s === "CATCH" || s === "->" || s === "=>" || s === "CLASS")i = !0;
                if (s === "IF" || s === "ELSE" || s === "SWITCH" || s === "TRY" || s === "=")r = !0;
                return s !== "." && s !== "?." && s !== "::" || this.tag(t - 1) !== "OUTDENT" ? !e.generated && this.tag(t - 1) !== "," && (E.call(f, s) >= 0 || s === "INDENT" && !r) && (s !== "INDENT" || (o = this.tag(t - 2)) !== "CLASS" && o !== "EXTENDS" && (a = this.tag(t - 1), E.call(u, a) < 0) && (!(n = this.tokens[t + 1]) || !n.generated || n[0] !== "{")) : !0
            }, e = function (e, t) {
                return this.tokens.splice(t, 0, this.generate("CALL_END", ")", e[2]))
            }, this.scanTokens(function (s, o, u) {
                var f, h, d, v, m, g, y, b;
                m = s[0];
                if (m === "CLASS" || m === "IF" || m === "FOR" || m === "WHILE")n = !0;
                return g = u.slice(o - 1, +(o + 1) + 1 || 9e9), v = g[0], h = g[1], d = g[2], f = !n && m === "INDENT" && d && d.generated && d[0] === "{" && v && (y = v[0], E.call(l, y) >= 0), i = !1, r = !1, E.call(p, m) >= 0 && (n = !1), v && !v.spaced && m === "?" && (s.call = !0), s.fromThen ? 1 : f || (v != null ? v.spaced : void 0) && (v.call || (b = v[0], E.call(l, b) >= 0)) && (E.call(a, m) >= 0 || !s.spaced && !s.newLine && E.call(c, m) >= 0) ? (u.splice(o, 0, this.generate("CALL_START", "(", s[2])), this.detectEnd(o + 1, t, e), v[0] === "?" && (v[0] = "FUNC_EXIST"), 2) : 1
            })
        }, e.prototype.addImplicitIndentation = function () {
            var e, t, n, r, i;
            return i = n = r = null, t = function (e, t) {
                var n;
                return e[1] !== ";" && (n = e[0], E.call(d, n) >= 0) && (e[0] !== "ELSE" || i === "IF" || i === "THEN")
            }, e = function (e, t) {
                return this.tokens.splice(this.tag(t - 1) === "," ? t - 1 : t, 0, r)
            }, this.scanTokens(function (s, o, u) {
                var a, f, l;
                return a = s[0], a === "TERMINATOR" && this.tag(o + 1) === "THEN" ? (u.splice(o, 1), 0) : a === "ELSE" && this.tag(o - 1) !== "OUTDENT" ? (u.splice.apply(u, [o, 0].concat(S.call(this.indentation(s)))), 2) : a !== "CATCH" || (f = this.tag(o + 2)) !== "OUTDENT" && f !== "TERMINATOR" && f !== "FINALLY" ? E.call(v, a) >= 0 && this.tag(o + 1) !== "INDENT" && (a !== "ELSE" || this.tag(o + 1) !== "IF") ? (i = a, l = this.indentation(s, !0), n = l[0], r = l[1], i === "THEN" && (n.fromThen = !0), u.splice(o + 1, 0, n), this.detectEnd(o + 2, t, e), a === "THEN" && u.splice(o, 1), 1) : 1 : (u.splice.apply(u, [o + 2, 0].concat(S.call(this.indentation(s)))), 4)
            })
        }, e.prototype.tagPostfixConditionals = function () {
            var e, t, n;
            return n = null, t = function (e, t) {
                var n;
                return(n = e[0]) === "TERMINATOR" || n === "INDENT"
            }, e = function (e, t) {
                if (e[0] !== "INDENT" || e.generated && !e.fromThen)return n[0] = "POST_" + n[0]
            }, this.scanTokens(function (r, i) {
                return r[0] !== "IF" ? 1 : (n = r, this.detectEnd(i + 1, t, e), 1)
            })
        }, e.prototype.indentation = function (e, t) {
            var n, r;
            return t == null && (t = !1), n = ["INDENT", 2, e[2]], r = ["OUTDENT", 2, e[2]], t && (n.generated = r.generated = !0), [n, r]
        }, e.prototype.generate = function (e, t, n) {
            var r;
            return r = [e, t, n], r.generated = !0, r
        }, e.prototype.tag = function (e) {
            var t;
            return(t = this.tokens[e]) != null ? t[0] : void 0
        }, e
    }(), r = [
        ["(", ")"],
        ["[", "]"],
        ["{", "}"],
        ["INDENT", "OUTDENT"],
        ["CALL_START", "CALL_END"],
        ["PARAM_START", "PARAM_END"],
        ["INDEX_START", "INDEX_END"]
    ], t.INVERSES = h = {}, o = [], s = [];
    for (y = 0, b = r.length; y < b; y++)w = r[y], m = w[0], g = w[1], o.push(h[g] = m), s.push(h[m] = g);
    i = ["CATCH", "WHEN", "ELSE", "FINALLY"].concat(s), l = ["IDENTIFIER", "SUPER", ")", "CALL_END", "]", "INDEX_END", "@", "THIS"], a = ["IDENTIFIER", "NUMBER", "STRING", "JS", "REGEX", "NEW", "PARAM_START", "CLASS", "IF", "TRY", "SWITCH", "THIS", "BOOL", "NULL", "UNDEFINED", "UNARY", "SUPER", "@", "->", "=>", "[", "(", "{", "--", "++"], c = ["+", "-"], u = ["->", "=>", "{", "[", ","], f = ["POST_IF", "FOR", "WHILE", "UNTIL", "WHEN", "BY", "LOOP", "TERMINATOR"], v = ["ELSE", "->", "=>", "TRY", "FINALLY", "THEN"], d = ["TERMINATOR", "CATCH", "FINALLY", "ELSE", "OUTDENT", "LEADING_WHEN"], p = ["TERMINATOR", "INDENT", "OUTDENT"]
}), define("ace/mode/coffee/helpers", ["require", "exports", "module"], function (e, t, n) {
    var r, i, s;
    t.starts = function (e, t, n) {
        return t === e.substr(n, t.length)
    }, t.ends = function (e, t, n) {
        var r;
        return r = t.length, t === e.substr(e.length - r - (n || 0), r)
    }, t.compact = function (e) {
        var t, n, r, i;
        i = [];
        for (n = 0, r = e.length; n < r; n++)t = e[n], t && i.push(t);
        return i
    }, t.count = function (e, t) {
        var n, r;
        n = r = 0;
        if (!t.length)return 1 / 0;
        while (r = 1 + e.indexOf(t, r))n++;
        return n
    }, t.merge = function (e, t) {
        return r(r({}, e), t)
    }, r = t.extend = function (e, t) {
        var n, r;
        for (n in t)r = t[n], e[n] = r;
        return e
    }, t.flatten = i = function (e) {
        var t, n, r, s;
        n = [];
        for (r = 0, s = e.length; r < s; r++)t = e[r], t instanceof Array ? n = n.concat(i(t)) : n.push(t);
        return n
    }, t.del = function (e, t) {
        var n;
        return n = e[t], delete e[t], n
    }, t.last = function (e, t) {
        return e[e.length - (t || 0) - 1]
    }, t.some = (s = Array.prototype.some) != null ? s : function (e) {
        var t, n, r;
        for (n = 0, r = this.length; n < r; n++) {
            t = this[n];
            if (e(t))return!0
        }
        return!1
    }
}), define("ace/mode/coffee/parser", ["require", "exports", "module"], function (e, t, n) {
    var r = {trace: function () {
    }, yy: {}, symbols_: {error: 2, Root: 3, Body: 4, Block: 5, TERMINATOR: 6, Line: 7, Expression: 8, Statement: 9, Return: 10, Comment: 11, STATEMENT: 12, Value: 13, Invocation: 14, Code: 15, Operation: 16, Assign: 17, If: 18, Try: 19, While: 20, For: 21, Switch: 22, Class: 23, Throw: 24, INDENT: 25, OUTDENT: 26, Identifier: 27, IDENTIFIER: 28, AlphaNumeric: 29, NUMBER: 30, STRING: 31, Literal: 32, JS: 33, REGEX: 34, DEBUGGER: 35, UNDEFINED: 36, NULL: 37, BOOL: 38, Assignable: 39, "=": 40, AssignObj: 41, ObjAssignable: 42, ":": 43, ThisProperty: 44, RETURN: 45, HERECOMMENT: 46, PARAM_START: 47, ParamList: 48, PARAM_END: 49, FuncGlyph: 50, "->": 51, "=>": 52, OptComma: 53, ",": 54, Param: 55, ParamVar: 56, "...": 57, Array: 58, Object: 59, Splat: 60, SimpleAssignable: 61, Accessor: 62, Parenthetical: 63, Range: 64, This: 65, ".": 66, "?.": 67, "::": 68, Index: 69, INDEX_START: 70, IndexValue: 71, INDEX_END: 72, INDEX_SOAK: 73, Slice: 74, "{": 75, AssignList: 76, "}": 77, CLASS: 78, EXTENDS: 79, OptFuncExist: 80, Arguments: 81, SUPER: 82, FUNC_EXIST: 83, CALL_START: 84, CALL_END: 85, ArgList: 86, THIS: 87, "@": 88, "[": 89, "]": 90, RangeDots: 91, "..": 92, Arg: 93, SimpleArgs: 94, TRY: 95, Catch: 96, FINALLY: 97, CATCH: 98, THROW: 99, "(": 100, ")": 101, WhileSource: 102, WHILE: 103, WHEN: 104, UNTIL: 105, Loop: 106, LOOP: 107, ForBody: 108, FOR: 109, ForStart: 110, ForSource: 111, ForVariables: 112, OWN: 113, ForValue: 114, FORIN: 115, FOROF: 116, BY: 117, SWITCH: 118, Whens: 119, ELSE: 120, When: 121, LEADING_WHEN: 122, IfBlock: 123, IF: 124, POST_IF: 125, UNARY: 126, "-": 127, "+": 128, "--": 129, "++": 130, "?": 131, MATH: 132, SHIFT: 133, COMPARE: 134, LOGIC: 135, RELATION: 136, COMPOUND_ASSIGN: 137, $accept: 0, $end: 1}, terminals_: {2: "error", 6: "TERMINATOR", 12: "STATEMENT", 25: "INDENT", 26: "OUTDENT", 28: "IDENTIFIER", 30: "NUMBER", 31: "STRING", 33: "JS", 34: "REGEX", 35: "DEBUGGER", 36: "UNDEFINED", 37: "NULL", 38: "BOOL", 40: "=", 43: ":", 45: "RETURN", 46: "HERECOMMENT", 47: "PARAM_START", 49: "PARAM_END", 51: "->", 52: "=>", 54: ",", 57: "...", 66: ".", 67: "?.", 68: "::", 70: "INDEX_START", 72: "INDEX_END", 73: "INDEX_SOAK", 75: "{", 77: "}", 78: "CLASS", 79: "EXTENDS", 82: "SUPER", 83: "FUNC_EXIST", 84: "CALL_START", 85: "CALL_END", 87: "THIS", 88: "@", 89: "[", 90: "]", 92: "..", 95: "TRY", 97: "FINALLY", 98: "CATCH", 99: "THROW", 100: "(", 101: ")", 103: "WHILE", 104: "WHEN", 105: "UNTIL", 107: "LOOP", 109: "FOR", 113: "OWN", 115: "FORIN", 116: "FOROF", 117: "BY", 118: "SWITCH", 120: "ELSE", 122: "LEADING_WHEN", 124: "IF", 125: "POST_IF", 126: "UNARY", 127: "-", 128: "+", 129: "--", 130: "++", 131: "?", 132: "MATH", 133: "SHIFT", 134: "COMPARE", 135: "LOGIC", 136: "RELATION", 137: "COMPOUND_ASSIGN"}, productions_: [0, [3, 0], [3, 1], [3, 2], [4, 1], [4, 3], [4, 2], [7, 1], [7, 1], [9, 1], [9, 1], [9, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [8, 1], [5, 2], [5, 3], [27, 1], [29, 1], [29, 1], [32, 1], [32, 1], [32, 1], [32, 1], [32, 1], [32, 1], [32, 1], [17, 3], [17, 4], [17, 5], [41, 1], [41, 3], [41, 5], [41, 1], [42, 1], [42, 1], [42, 1], [10, 2], [10, 1], [11, 1], [15, 5], [15, 2], [50, 1], [50, 1], [53, 0], [53, 1], [48, 0], [48, 1], [48, 3], [48, 4], [48, 6], [55, 1], [55, 2], [55, 3], [56, 1], [56, 1], [56, 1], [56, 1], [60, 2], [61, 1], [61, 2], [61, 2], [61, 1], [39, 1], [39, 1], [39, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [62, 2], [62, 2], [62, 2], [62, 1], [62, 1], [69, 3], [69, 2], [71, 1], [71, 1], [59, 4], [76, 0], [76, 1], [76, 3], [76, 4], [76, 6], [23, 1], [23, 2], [23, 3], [23, 4], [23, 2], [23, 3], [23, 4], [23, 5], [14, 3], [14, 3], [14, 1], [14, 2], [80, 0], [80, 1], [81, 2], [81, 4], [65, 1], [65, 1], [44, 2], [58, 2], [58, 4], [91, 1], [91, 1], [64, 5], [74, 3], [74, 2], [74, 2], [74, 1], [86, 1], [86, 3], [86, 4], [86, 4], [86, 6], [93, 1], [93, 1], [94, 1], [94, 3], [19, 2], [19, 3], [19, 4], [19, 5], [96, 3], [24, 2], [63, 3], [63, 5], [102, 2], [102, 4], [102, 2], [102, 4], [20, 2], [20, 2], [20, 2], [20, 1], [106, 2], [106, 2], [21, 2], [21, 2], [21, 2], [108, 2], [108, 2], [110, 2], [110, 3], [114, 1], [114, 1], [114, 1], [114, 1], [112, 1], [112, 3], [111, 2], [111, 2], [111, 4], [111, 4], [111, 4], [111, 6], [111, 6], [22, 5], [22, 7], [22, 4], [22, 6], [119, 1], [119, 2], [121, 3], [121, 4], [123, 3], [123, 5], [18, 1], [18, 3], [18, 3], [18, 3], [16, 2], [16, 2], [16, 2], [16, 2], [16, 2], [16, 2], [16, 2], [16, 2], [16, 3], [16, 3], [16, 3], [16, 3], [16, 3], [16, 3], [16, 3], [16, 3], [16, 5], [16, 3]], performAction: function (t, n, r, i, s, o, u) {
        var a = o.length - 1;
        switch (s) {
            case 1:
                return this.$ = new i.Block;
            case 2:
                return this.$ = o[a];
            case 3:
                return this.$ = o[a - 1];
            case 4:
                this.$ = i.Block.wrap([o[a]]);
                break;
            case 5:
                this.$ = o[a - 2].push(o[a]);
                break;
            case 6:
                this.$ = o[a - 1];
                break;
            case 7:
                this.$ = o[a];
                break;
            case 8:
                this.$ = o[a];
                break;
            case 9:
                this.$ = o[a];
                break;
            case 10:
                this.$ = o[a];
                break;
            case 11:
                this.$ = new i.Literal(o[a]);
                break;
            case 12:
                this.$ = o[a];
                break;
            case 13:
                this.$ = o[a];
                break;
            case 14:
                this.$ = o[a];
                break;
            case 15:
                this.$ = o[a];
                break;
            case 16:
                this.$ = o[a];
                break;
            case 17:
                this.$ = o[a];
                break;
            case 18:
                this.$ = o[a];
                break;
            case 19:
                this.$ = o[a];
                break;
            case 20:
                this.$ = o[a];
                break;
            case 21:
                this.$ = o[a];
                break;
            case 22:
                this.$ = o[a];
                break;
            case 23:
                this.$ = o[a];
                break;
            case 24:
                this.$ = new i.Block;
                break;
            case 25:
                this.$ = o[a - 1];
                break;
            case 26:
                this.$ = new i.Literal(o[a]);
                break;
            case 27:
                this.$ = new i.Literal(o[a]);
                break;
            case 28:
                this.$ = new i.Literal(o[a]);
                break;
            case 29:
                this.$ = o[a];
                break;
            case 30:
                this.$ = new i.Literal(o[a]);
                break;
            case 31:
                this.$ = new i.Literal(o[a]);
                break;
            case 32:
                this.$ = new i.Literal(o[a]);
                break;
            case 33:
                this.$ = new i.Undefined;
                break;
            case 34:
                this.$ = new i.Null;
                break;
            case 35:
                this.$ = new i.Bool(o[a]);
                break;
            case 36:
                this.$ = new i.Assign(o[a - 2], o[a]);
                break;
            case 37:
                this.$ = new i.Assign(o[a - 3], o[a]);
                break;
            case 38:
                this.$ = new i.Assign(o[a - 4], o[a - 1]);
                break;
            case 39:
                this.$ = new i.Value(o[a]);
                break;
            case 40:
                this.$ = new i.Assign(new i.Value(o[a - 2]), o[a], "object");
                break;
            case 41:
                this.$ = new i.Assign(new i.Value(o[a - 4]), o[a - 1], "object");
                break;
            case 42:
                this.$ = o[a];
                break;
            case 43:
                this.$ = o[a];
                break;
            case 44:
                this.$ = o[a];
                break;
            case 45:
                this.$ = o[a];
                break;
            case 46:
                this.$ = new i.Return(o[a]);
                break;
            case 47:
                this.$ = new i.Return;
                break;
            case 48:
                this.$ = new i.Comment(o[a]);
                break;
            case 49:
                this.$ = new i.Code(o[a - 3], o[a], o[a - 1]);
                break;
            case 50:
                this.$ = new i.Code([], o[a], o[a - 1]);
                break;
            case 51:
                this.$ = "func";
                break;
            case 52:
                this.$ = "boundfunc";
                break;
            case 53:
                this.$ = o[a];
                break;
            case 54:
                this.$ = o[a];
                break;
            case 55:
                this.$ = [];
                break;
            case 56:
                this.$ = [o[a]];
                break;
            case 57:
                this.$ = o[a - 2].concat(o[a]);
                break;
            case 58:
                this.$ = o[a - 3].concat(o[a]);
                break;
            case 59:
                this.$ = o[a - 5].concat(o[a - 2]);
                break;
            case 60:
                this.$ = new i.Param(o[a]);
                break;
            case 61:
                this.$ = new i.Param(o[a - 1], null, !0);
                break;
            case 62:
                this.$ = new i.Param(o[a - 2], o[a]);
                break;
            case 63:
                this.$ = o[a];
                break;
            case 64:
                this.$ = o[a];
                break;
            case 65:
                this.$ = o[a];
                break;
            case 66:
                this.$ = o[a];
                break;
            case 67:
                this.$ = new i.Splat(o[a - 1]);
                break;
            case 68:
                this.$ = new i.Value(o[a]);
                break;
            case 69:
                this.$ = o[a - 1].add(o[a]);
                break;
            case 70:
                this.$ = new i.Value(o[a - 1], [].concat(o[a]));
                break;
            case 71:
                this.$ = o[a];
                break;
            case 72:
                this.$ = o[a];
                break;
            case 73:
                this.$ = new i.Value(o[a]);
                break;
            case 74:
                this.$ = new i.Value(o[a]);
                break;
            case 75:
                this.$ = o[a];
                break;
            case 76:
                this.$ = new i.Value(o[a]);
                break;
            case 77:
                this.$ = new i.Value(o[a]);
                break;
            case 78:
                this.$ = new i.Value(o[a]);
                break;
            case 79:
                this.$ = o[a];
                break;
            case 80:
                this.$ = new i.Access(o[a]);
                break;
            case 81:
                this.$ = new i.Access(o[a], "soak");
                break;
            case 82:
                this.$ = [new i.Access(new i.Literal("prototype")), new i.Access(o[a])];
                break;
            case 83:
                this.$ = new i.Access(new i.Literal("prototype"));
                break;
            case 84:
                this.$ = o[a];
                break;
            case 85:
                this.$ = o[a - 1];
                break;
            case 86:
                this.$ = i.extend(o[a], {soak: !0});
                break;
            case 87:
                this.$ = new i.Index(o[a]);
                break;
            case 88:
                this.$ = new i.Slice(o[a]);
                break;
            case 89:
                this.$ = new i.Obj(o[a - 2], o[a - 3].generated);
                break;
            case 90:
                this.$ = [];
                break;
            case 91:
                this.$ = [o[a]];
                break;
            case 92:
                this.$ = o[a - 2].concat(o[a]);
                break;
            case 93:
                this.$ = o[a - 3].concat(o[a]);
                break;
            case 94:
                this.$ = o[a - 5].concat(o[a - 2]);
                break;
            case 95:
                this.$ = new i.Class;
                break;
            case 96:
                this.$ = new i.Class(null, null, o[a]);
                break;
            case 97:
                this.$ = new i.Class(null, o[a]);
                break;
            case 98:
                this.$ = new i.Class(null, o[a - 1], o[a]);
                break;
            case 99:
                this.$ = new i.Class(o[a]);
                break;
            case 100:
                this.$ = new i.Class(o[a - 1], null, o[a]);
                break;
            case 101:
                this.$ = new i.Class(o[a - 2], o[a]);
                break;
            case 102:
                this.$ = new i.Class(o[a - 3], o[a - 1], o[a]);
                break;
            case 103:
                this.$ = new i.Call(o[a - 2], o[a], o[a - 1]);
                break;
            case 104:
                this.$ = new i.Call(o[a - 2], o[a], o[a - 1]);
                break;
            case 105:
                this.$ = new i.Call("super", [new i.Splat(new i.Literal("arguments"))]);
                break;
            case 106:
                this.$ = new i.Call("super", o[a]);
                break;
            case 107:
                this.$ = !1;
                break;
            case 108:
                this.$ = !0;
                break;
            case 109:
                this.$ = [];
                break;
            case 110:
                this.$ = o[a - 2];
                break;
            case 111:
                this.$ = new i.Value(new i.Literal("this"));
                break;
            case 112:
                this.$ = new i.Value(new i.Literal("this"));
                break;
            case 113:
                this.$ = new i.Value(new i.Literal("this"), [new i.Access(o[a])], "this");
                break;
            case 114:
                this.$ = new i.Arr([]);
                break;
            case 115:
                this.$ = new i.Arr(o[a - 2]);
                break;
            case 116:
                this.$ = "inclusive";
                break;
            case 117:
                this.$ = "exclusive";
                break;
            case 118:
                this.$ = new i.Range(o[a - 3], o[a - 1], o[a - 2]);
                break;
            case 119:
                this.$ = new i.Range(o[a - 2], o[a], o[a - 1]);
                break;
            case 120:
                this.$ = new i.Range(o[a - 1], null, o[a]);
                break;
            case 121:
                this.$ = new i.Range(null, o[a], o[a - 1]);
                break;
            case 122:
                this.$ = new i.Range(null, null, o[a]);
                break;
            case 123:
                this.$ = [o[a]];
                break;
            case 124:
                this.$ = o[a - 2].concat(o[a]);
                break;
            case 125:
                this.$ = o[a - 3].concat(o[a]);
                break;
            case 126:
                this.$ = o[a - 2];
                break;
            case 127:
                this.$ = o[a - 5].concat(o[a - 2]);
                break;
            case 128:
                this.$ = o[a];
                break;
            case 129:
                this.$ = o[a];
                break;
            case 130:
                this.$ = o[a];
                break;
            case 131:
                this.$ = [].concat(o[a - 2], o[a]);
                break;
            case 132:
                this.$ = new i.Try(o[a]);
                break;
            case 133:
                this.$ = new i.Try(o[a - 1], o[a][0], o[a][1]);
                break;
            case 134:
                this.$ = new i.Try(o[a - 2], null, null, o[a]);
                break;
            case 135:
                this.$ = new i.Try(o[a - 3], o[a - 2][0], o[a - 2][1], o[a]);
                break;
            case 136:
                this.$ = [o[a - 1], o[a]];
                break;
            case 137:
                this.$ = new i.Throw(o[a]);
                break;
            case 138:
                this.$ = new i.Parens(o[a - 1]);
                break;
            case 139:
                this.$ = new i.Parens(o[a - 2]);
                break;
            case 140:
                this.$ = new i.While(o[a]);
                break;
            case 141:
                this.$ = new i.While(o[a - 2], {guard: o[a]});
                break;
            case 142:
                this.$ = new i.While(o[a], {invert: !0});
                break;
            case 143:
                this.$ = new i.While(o[a - 2], {invert: !0, guard: o[a]});
                break;
            case 144:
                this.$ = o[a - 1].addBody(o[a]);
                break;
            case 145:
                this.$ = o[a].addBody(i.Block.wrap([o[a - 1]]));
                break;
            case 146:
                this.$ = o[a].addBody(i.Block.wrap([o[a - 1]]));
                break;
            case 147:
                this.$ = o[a];
                break;
            case 148:
                this.$ = (new i.While(new i.Literal("true"))).addBody(o[a]);
                break;
            case 149:
                this.$ = (new i.While(new i.Literal("true"))).addBody(i.Block.wrap([o[a]]));
                break;
            case 150:
                this.$ = new i.For(o[a - 1], o[a]);
                break;
            case 151:
                this.$ = new i.For(o[a - 1], o[a]);
                break;
            case 152:
                this.$ = new i.For(o[a], o[a - 1]);
                break;
            case 153:
                this.$ = {source: new i.Value(o[a])};
                break;
            case 154:
                this.$ = function () {
                    return o[a].own = o[a - 1].own, o[a].name = o[a - 1][0], o[a].index = o[a - 1][1], o[a]
                }();
                break;
            case 155:
                this.$ = o[a];
                break;
            case 156:
                this.$ = function () {
                    return o[a].own = !0, o[a]
                }();
                break;
            case 157:
                this.$ = o[a];
                break;
            case 158:
                this.$ = o[a];
                break;
            case 159:
                this.$ = new i.Value(o[a]);
                break;
            case 160:
                this.$ = new i.Value(o[a]);
                break;
            case 161:
                this.$ = [o[a]];
                break;
            case 162:
                this.$ = [o[a - 2], o[a]];
                break;
            case 163:
                this.$ = {source: o[a]};
                break;
            case 164:
                this.$ = {source: o[a], object: !0};
                break;
            case 165:
                this.$ = {source: o[a - 2], guard: o[a]};
                break;
            case 166:
                this.$ = {source: o[a - 2], guard: o[a], object: !0};
                break;
            case 167:
                this.$ = {source: o[a - 2], step: o[a]};
                break;
            case 168:
                this.$ = {source: o[a - 4], guard: o[a - 2], step: o[a]};
                break;
            case 169:
                this.$ = {source: o[a - 4], step: o[a - 2], guard: o[a]};
                break;
            case 170:
                this.$ = new i.Switch(o[a - 3], o[a - 1]);
                break;
            case 171:
                this.$ = new i.Switch(o[a - 5], o[a - 3], o[a - 1]);
                break;
            case 172:
                this.$ = new i.Switch(null, o[a - 1]);
                break;
            case 173:
                this.$ = new i.Switch(null, o[a - 3], o[a - 1]);
                break;
            case 174:
                this.$ = o[a];
                break;
            case 175:
                this.$ = o[a - 1].concat(o[a]);
                break;
            case 176:
                this.$ = [
                    [o[a - 1], o[a]]
                ];
                break;
            case 177:
                this.$ = [
                    [o[a - 2], o[a - 1]]
                ];
                break;
            case 178:
                this.$ = new i.If(o[a - 1], o[a], {type: o[a - 2]});
                break;
            case 179:
                this.$ = o[a - 4].addElse(new i.If(o[a - 1], o[a], {type: o[a - 2]}));
                break;
            case 180:
                this.$ = o[a];
                break;
            case 181:
                this.$ = o[a - 2].addElse(o[a]);
                break;
            case 182:
                this.$ = new i.If(o[a], i.Block.wrap([o[a - 2]]), {type: o[a - 1], statement: !0});
                break;
            case 183:
                this.$ = new i.If(o[a], i.Block.wrap([o[a - 2]]), {type: o[a - 1], statement: !0});
                break;
            case 184:
                this.$ = new i.Op(o[a - 1], o[a]);
                break;
            case 185:
                this.$ = new i.Op("-", o[a]);
                break;
            case 186:
                this.$ = new i.Op("+", o[a]);
                break;
            case 187:
                this.$ = new i.Op("--", o[a]);
                break;
            case 188:
                this.$ = new i.Op("++", o[a]);
                break;
            case 189:
                this.$ = new i.Op("--", o[a - 1], null, !0);
                break;
            case 190:
                this.$ = new i.Op("++", o[a - 1], null, !0);
                break;
            case 191:
                this.$ = new i.Existence(o[a - 1]);
                break;
            case 192:
                this.$ = new i.Op("+", o[a - 2], o[a]);
                break;
            case 193:
                this.$ = new i.Op("-", o[a - 2], o[a]);
                break;
            case 194:
                this.$ = new i.Op(o[a - 1], o[a - 2], o[a]);
                break;
            case 195:
                this.$ = new i.Op(o[a - 1], o[a - 2], o[a]);
                break;
            case 196:
                this.$ = new i.Op(o[a - 1], o[a - 2], o[a]);
                break;
            case 197:
                this.$ = new i.Op(o[a - 1], o[a - 2], o[a]);
                break;
            case 198:
                this.$ = function () {
                    return o[a - 1].charAt(0) === "!" ? (new i.Op(o[a - 1].slice(1), o[a - 2], o[a])).invert() : new i.Op(o[a - 1], o[a - 2], o[a])
                }();
                break;
            case 199:
                this.$ = new i.Assign(o[a - 2], o[a], o[a - 1]);
                break;
            case 200:
                this.$ = new i.Assign(o[a - 4], o[a - 1], o[a - 3]);
                break;
            case 201:
                this.$ = new i.Extends(o[a - 2], o[a])
        }
    }, table: [
        {1: [2, 1], 3: 1, 4: 2, 5: 3, 7: 4, 8: 6, 9: 7, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 5], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [3]},
        {1: [2, 2], 6: [1, 74]},
        {6: [1, 75]},
        {1: [2, 4], 6: [2, 4], 26: [2, 4], 101: [2, 4]},
        {4: 77, 7: 4, 8: 6, 9: 7, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 26: [1, 76], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 7], 6: [2, 7], 26: [2, 7], 101: [2, 7], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 8], 6: [2, 8], 26: [2, 8], 101: [2, 8], 102: 90, 103: [1, 65], 105: [1, 66], 108: 91, 109: [1, 68], 110: 69, 125: [1, 89]},
        {1: [2, 12], 6: [2, 12], 25: [2, 12], 26: [2, 12], 49: [2, 12], 54: [2, 12], 57: [2, 12], 62: 93, 66: [1, 95], 67: [1, 96], 68: [1, 97], 69: 98, 70: [1, 99], 72: [2, 12], 73: [1, 100], 77: [2, 12], 80: 92, 83: [1, 94], 84: [2, 107], 85: [2, 12], 90: [2, 12], 92: [2, 12], 101: [2, 12], 103: [2, 12], 104: [2, 12], 105: [2, 12], 109: [2, 12], 117: [2, 12], 125: [2, 12], 127: [2, 12], 128: [2, 12], 131: [2, 12], 132: [2, 12], 133: [2, 12], 134: [2, 12], 135: [2, 12], 136: [2, 12]},
        {1: [2, 13], 6: [2, 13], 25: [2, 13], 26: [2, 13], 49: [2, 13], 54: [2, 13], 57: [2, 13], 62: 102, 66: [1, 95], 67: [1, 96], 68: [1, 97], 69: 98, 70: [1, 99], 72: [2, 13], 73: [1, 100], 77: [2, 13], 80: 101, 83: [1, 94], 84: [2, 107], 85: [2, 13], 90: [2, 13], 92: [2, 13], 101: [2, 13], 103: [2, 13], 104: [2, 13], 105: [2, 13], 109: [2, 13], 117: [2, 13], 125: [2, 13], 127: [2, 13], 128: [2, 13], 131: [2, 13], 132: [2, 13], 133: [2, 13], 134: [2, 13], 135: [2, 13], 136: [2, 13]},
        {1: [2, 14], 6: [2, 14], 25: [2, 14], 26: [2, 14], 49: [2, 14], 54: [2, 14], 57: [2, 14], 72: [2, 14], 77: [2, 14], 85: [2, 14], 90: [2, 14], 92: [2, 14], 101: [2, 14], 103: [2, 14], 104: [2, 14], 105: [2, 14], 109: [2, 14], 117: [2, 14], 125: [2, 14], 127: [2, 14], 128: [2, 14], 131: [2, 14], 132: [2, 14], 133: [2, 14], 134: [2, 14], 135: [2, 14], 136: [2, 14]},
        {1: [2, 15], 6: [2, 15], 25: [2, 15], 26: [2, 15], 49: [2, 15], 54: [2, 15], 57: [2, 15], 72: [2, 15], 77: [2, 15], 85: [2, 15], 90: [2, 15], 92: [2, 15], 101: [2, 15], 103: [2, 15], 104: [2, 15], 105: [2, 15], 109: [2, 15], 117: [2, 15], 125: [2, 15], 127: [2, 15], 128: [2, 15], 131: [2, 15], 132: [2, 15], 133: [2, 15], 134: [2, 15], 135: [2, 15], 136: [2, 15]},
        {1: [2, 16], 6: [2, 16], 25: [2, 16], 26: [2, 16], 49: [2, 16], 54: [2, 16], 57: [2, 16], 72: [2, 16], 77: [2, 16], 85: [2, 16], 90: [2, 16], 92: [2, 16], 101: [2, 16], 103: [2, 16], 104: [2, 16], 105: [2, 16], 109: [2, 16], 117: [2, 16], 125: [2, 16], 127: [2, 16], 128: [2, 16], 131: [2, 16], 132: [2, 16], 133: [2, 16], 134: [2, 16], 135: [2, 16], 136: [2, 16]},
        {1: [2, 17], 6: [2, 17], 25: [2, 17], 26: [2, 17], 49: [2, 17], 54: [2, 17], 57: [2, 17], 72: [2, 17], 77: [2, 17], 85: [2, 17], 90: [2, 17], 92: [2, 17], 101: [2, 17], 103: [2, 17], 104: [2, 17], 105: [2, 17], 109: [2, 17], 117: [2, 17], 125: [2, 17], 127: [2, 17], 128: [2, 17], 131: [2, 17], 132: [2, 17], 133: [2, 17], 134: [2, 17], 135: [2, 17], 136: [2, 17]},
        {1: [2, 18], 6: [2, 18], 25: [2, 18], 26: [2, 18], 49: [2, 18], 54: [2, 18], 57: [2, 18], 72: [2, 18], 77: [2, 18], 85: [2, 18], 90: [2, 18], 92: [2, 18], 101: [2, 18], 103: [2, 18], 104: [2, 18], 105: [2, 18], 109: [2, 18], 117: [2, 18], 125: [2, 18], 127: [2, 18], 128: [2, 18], 131: [2, 18], 132: [2, 18], 133: [2, 18], 134: [2, 18], 135: [2, 18], 136: [2, 18]},
        {1: [2, 19], 6: [2, 19], 25: [2, 19], 26: [2, 19], 49: [2, 19], 54: [2, 19], 57: [2, 19], 72: [2, 19], 77: [2, 19], 85: [2, 19], 90: [2, 19], 92: [2, 19], 101: [2, 19], 103: [2, 19], 104: [2, 19], 105: [2, 19], 109: [2, 19], 117: [2, 19], 125: [2, 19], 127: [2, 19], 128: [2, 19], 131: [2, 19], 132: [2, 19], 133: [2, 19], 134: [2, 19], 135: [2, 19], 136: [2, 19]},
        {1: [2, 20], 6: [2, 20], 25: [2, 20], 26: [2, 20], 49: [2, 20], 54: [2, 20], 57: [2, 20], 72: [2, 20], 77: [2, 20], 85: [2, 20], 90: [2, 20], 92: [2, 20], 101: [2, 20], 103: [2, 20], 104: [2, 20], 105: [2, 20], 109: [2, 20], 117: [2, 20], 125: [2, 20], 127: [2, 20], 128: [2, 20], 131: [2, 20], 132: [2, 20], 133: [2, 20], 134: [2, 20], 135: [2, 20], 136: [2, 20]},
        {1: [2, 21], 6: [2, 21], 25: [2, 21], 26: [2, 21], 49: [2, 21], 54: [2, 21], 57: [2, 21], 72: [2, 21], 77: [2, 21], 85: [2, 21], 90: [2, 21], 92: [2, 21], 101: [2, 21], 103: [2, 21], 104: [2, 21], 105: [2, 21], 109: [2, 21], 117: [2, 21], 125: [2, 21], 127: [2, 21], 128: [2, 21], 131: [2, 21], 132: [2, 21], 133: [2, 21], 134: [2, 21], 135: [2, 21], 136: [2, 21]},
        {1: [2, 22], 6: [2, 22], 25: [2, 22], 26: [2, 22], 49: [2, 22], 54: [2, 22], 57: [2, 22], 72: [2, 22], 77: [2, 22], 85: [2, 22], 90: [2, 22], 92: [2, 22], 101: [2, 22], 103: [2, 22], 104: [2, 22], 105: [2, 22], 109: [2, 22], 117: [2, 22], 125: [2, 22], 127: [2, 22], 128: [2, 22], 131: [2, 22], 132: [2, 22], 133: [2, 22], 134: [2, 22], 135: [2, 22], 136: [2, 22]},
        {1: [2, 23], 6: [2, 23], 25: [2, 23], 26: [2, 23], 49: [2, 23], 54: [2, 23], 57: [2, 23], 72: [2, 23], 77: [2, 23], 85: [2, 23], 90: [2, 23], 92: [2, 23], 101: [2, 23], 103: [2, 23], 104: [2, 23], 105: [2, 23], 109: [2, 23], 117: [2, 23], 125: [2, 23], 127: [2, 23], 128: [2, 23], 131: [2, 23], 132: [2, 23], 133: [2, 23], 134: [2, 23], 135: [2, 23], 136: [2, 23]},
        {1: [2, 9], 6: [2, 9], 26: [2, 9], 101: [2, 9], 103: [2, 9], 105: [2, 9], 109: [2, 9], 125: [2, 9]},
        {1: [2, 10], 6: [2, 10], 26: [2, 10], 101: [2, 10], 103: [2, 10], 105: [2, 10], 109: [2, 10], 125: [2, 10]},
        {1: [2, 11], 6: [2, 11], 26: [2, 11], 101: [2, 11], 103: [2, 11], 105: [2, 11], 109: [2, 11], 125: [2, 11]},
        {1: [2, 75], 6: [2, 75], 25: [2, 75], 26: [2, 75], 40: [1, 103], 49: [2, 75], 54: [2, 75], 57: [2, 75], 66: [2, 75], 67: [2, 75], 68: [2, 75], 70: [2, 75], 72: [2, 75], 73: [2, 75], 77: [2, 75], 83: [2, 75], 84: [2, 75], 85: [2, 75], 90: [2, 75], 92: [2, 75], 101: [2, 75], 103: [2, 75], 104: [2, 75], 105: [2, 75], 109: [2, 75], 117: [2, 75], 125: [2, 75], 127: [2, 75], 128: [2, 75], 131: [2, 75], 132: [2, 75], 133: [2, 75], 134: [2, 75], 135: [2, 75], 136: [2, 75]},
        {1: [2, 76], 6: [2, 76], 25: [2, 76], 26: [2, 76], 49: [2, 76], 54: [2, 76], 57: [2, 76], 66: [2, 76], 67: [2, 76], 68: [2, 76], 70: [2, 76], 72: [2, 76], 73: [2, 76], 77: [2, 76], 83: [2, 76], 84: [2, 76], 85: [2, 76], 90: [2, 76], 92: [2, 76], 101: [2, 76], 103: [2, 76], 104: [2, 76], 105: [2, 76], 109: [2, 76], 117: [2, 76], 125: [2, 76], 127: [2, 76], 128: [2, 76], 131: [2, 76], 132: [2, 76], 133: [2, 76], 134: [2, 76], 135: [2, 76], 136: [2, 76]},
        {1: [2, 77], 6: [2, 77], 25: [2, 77], 26: [2, 77], 49: [2, 77], 54: [2, 77], 57: [2, 77], 66: [2, 77], 67: [2, 77], 68: [2, 77], 70: [2, 77], 72: [2, 77], 73: [2, 77], 77: [2, 77], 83: [2, 77], 84: [2, 77], 85: [2, 77], 90: [2, 77], 92: [2, 77], 101: [2, 77], 103: [2, 77], 104: [2, 77], 105: [2, 77], 109: [2, 77], 117: [2, 77], 125: [2, 77], 127: [2, 77], 128: [2, 77], 131: [2, 77], 132: [2, 77], 133: [2, 77], 134: [2, 77], 135: [2, 77], 136: [2, 77]},
        {1: [2, 78], 6: [2, 78], 25: [2, 78], 26: [2, 78], 49: [2, 78], 54: [2, 78], 57: [2, 78], 66: [2, 78], 67: [2, 78], 68: [2, 78], 70: [2, 78], 72: [2, 78], 73: [2, 78], 77: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78], 90: [2, 78], 92: [2, 78], 101: [2, 78], 103: [2, 78], 104: [2, 78], 105: [2, 78], 109: [2, 78], 117: [2, 78], 125: [2, 78], 127: [2, 78], 128: [2, 78], 131: [2, 78], 132: [2, 78], 133: [2, 78], 134: [2, 78], 135: [2, 78], 136: [2, 78]},
        {1: [2, 79], 6: [2, 79], 25: [2, 79], 26: [2, 79], 49: [2, 79], 54: [2, 79], 57: [2, 79], 66: [2, 79], 67: [2, 79], 68: [2, 79], 70: [2, 79], 72: [2, 79], 73: [2, 79], 77: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79], 90: [2, 79], 92: [2, 79], 101: [2, 79], 103: [2, 79], 104: [2, 79], 105: [2, 79], 109: [2, 79], 117: [2, 79], 125: [2, 79], 127: [2, 79], 128: [2, 79], 131: [2, 79], 132: [2, 79], 133: [2, 79], 134: [2, 79], 135: [2, 79], 136: [2, 79]},
        {1: [2, 105], 6: [2, 105], 25: [2, 105], 26: [2, 105], 49: [2, 105], 54: [2, 105], 57: [2, 105], 66: [2, 105], 67: [2, 105], 68: [2, 105], 70: [2, 105], 72: [2, 105], 73: [2, 105], 77: [2, 105], 81: 104, 83: [2, 105], 84: [1, 105], 85: [2, 105], 90: [2, 105], 92: [2, 105], 101: [2, 105], 103: [2, 105], 104: [2, 105], 105: [2, 105], 109: [2, 105], 117: [2, 105], 125: [2, 105], 127: [2, 105], 128: [2, 105], 131: [2, 105], 132: [2, 105], 133: [2, 105], 134: [2, 105], 135: [2, 105], 136: [2, 105]},
        {6: [2, 55], 25: [2, 55], 27: 109, 28: [1, 73], 44: 110, 48: 106, 49: [2, 55], 54: [2, 55], 55: 107, 56: 108, 58: 111, 59: 112, 75: [1, 70], 88: [1, 113], 89: [1, 114]},
        {5: 115, 25: [1, 5]},
        {8: 116, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 118, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 119, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {13: 121, 14: 122, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 123, 44: 63, 58: 47, 59: 48, 61: 120, 63: 25, 64: 26, 65: 27, 75: [1, 70], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 100: [1, 56]},
        {13: 121, 14: 122, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 123, 44: 63, 58: 47, 59: 48, 61: 124, 63: 25, 64: 26, 65: 27, 75: [1, 70], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 100: [1, 56]},
        {1: [2, 72], 6: [2, 72], 25: [2, 72], 26: [2, 72], 40: [2, 72], 49: [2, 72], 54: [2, 72], 57: [2, 72], 66: [2, 72], 67: [2, 72], 68: [2, 72], 70: [2, 72], 72: [2, 72], 73: [2, 72], 77: [2, 72], 79: [1, 128], 83: [2, 72], 84: [2, 72], 85: [2, 72], 90: [2, 72], 92: [2, 72], 101: [2, 72], 103: [2, 72], 104: [2, 72], 105: [2, 72], 109: [2, 72], 117: [2, 72], 125: [2, 72], 127: [2, 72], 128: [2, 72], 129: [1, 125], 130: [1, 126], 131: [2, 72], 132: [2, 72], 133: [2, 72], 134: [2, 72], 135: [2, 72], 136: [2, 72], 137: [1, 127]},
        {1: [2, 180], 6: [2, 180], 25: [2, 180], 26: [2, 180], 49: [2, 180], 54: [2, 180], 57: [2, 180], 72: [2, 180], 77: [2, 180], 85: [2, 180], 90: [2, 180], 92: [2, 180], 101: [2, 180], 103: [2, 180], 104: [2, 180], 105: [2, 180], 109: [2, 180], 117: [2, 180], 120: [1, 129], 125: [2, 180], 127: [2, 180], 128: [2, 180], 131: [2, 180], 132: [2, 180], 133: [2, 180], 134: [2, 180], 135: [2, 180], 136: [2, 180]},
        {5: 130, 25: [1, 5]},
        {5: 131, 25: [1, 5]},
        {1: [2, 147], 6: [2, 147], 25: [2, 147], 26: [2, 147], 49: [2, 147], 54: [2, 147], 57: [2, 147], 72: [2, 147], 77: [2, 147], 85: [2, 147], 90: [2, 147], 92: [2, 147], 101: [2, 147], 103: [2, 147], 104: [2, 147], 105: [2, 147], 109: [2, 147], 117: [2, 147], 125: [2, 147], 127: [2, 147], 128: [2, 147], 131: [2, 147], 132: [2, 147], 133: [2, 147], 134: [2, 147], 135: [2, 147], 136: [2, 147]},
        {5: 132, 25: [1, 5]},
        {8: 133, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 134], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 95], 5: 135, 6: [2, 95], 13: 121, 14: 122, 25: [1, 5], 26: [2, 95], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 123, 44: 63, 49: [2, 95], 54: [2, 95], 57: [2, 95], 58: 47, 59: 48, 61: 137, 63: 25, 64: 26, 65: 27, 72: [2, 95], 75: [1, 70], 77: [2, 95], 79: [1, 136], 82: [1, 28], 85: [2, 95], 87: [1, 58], 88: [1, 59], 89: [1, 57], 90: [2, 95], 92: [2, 95], 100: [1, 56], 101: [2, 95], 103: [2, 95], 104: [2, 95], 105: [2, 95], 109: [2, 95], 117: [2, 95], 125: [2, 95], 127: [2, 95], 128: [2, 95], 131: [2, 95], 132: [2, 95], 133: [2, 95], 134: [2, 95], 135: [2, 95], 136: [2, 95]},
        {8: 138, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 47], 6: [2, 47], 8: 139, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 26: [2, 47], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 101: [2, 47], 102: 39, 103: [2, 47], 105: [2, 47], 106: 40, 107: [1, 67], 108: 41, 109: [2, 47], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 125: [2, 47], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 48], 6: [2, 48], 25: [2, 48], 26: [2, 48], 54: [2, 48], 77: [2, 48], 101: [2, 48], 103: [2, 48], 105: [2, 48], 109: [2, 48], 125: [2, 48]},
        {1: [2, 73], 6: [2, 73], 25: [2, 73], 26: [2, 73], 40: [2, 73], 49: [2, 73], 54: [2, 73], 57: [2, 73], 66: [2, 73], 67: [2, 73], 68: [2, 73], 70: [2, 73], 72: [2, 73], 73: [2, 73], 77: [2, 73], 83: [2, 73], 84: [2, 73], 85: [2, 73], 90: [2, 73], 92: [2, 73], 101: [2, 73], 103: [2, 73], 104: [2, 73], 105: [2, 73], 109: [2, 73], 117: [2, 73], 125: [2, 73], 127: [2, 73], 128: [2, 73], 131: [2, 73], 132: [2, 73], 133: [2, 73], 134: [2, 73], 135: [2, 73], 136: [2, 73]},
        {1: [2, 74], 6: [2, 74], 25: [2, 74], 26: [2, 74], 40: [2, 74], 49: [2, 74], 54: [2, 74], 57: [2, 74], 66: [2, 74], 67: [2, 74], 68: [2, 74], 70: [2, 74], 72: [2, 74], 73: [2, 74], 77: [2, 74], 83: [2, 74], 84: [2, 74], 85: [2, 74], 90: [2, 74], 92: [2, 74], 101: [2, 74], 103: [2, 74], 104: [2, 74], 105: [2, 74], 109: [2, 74], 117: [2, 74], 125: [2, 74], 127: [2, 74], 128: [2, 74], 131: [2, 74], 132: [2, 74], 133: [2, 74], 134: [2, 74], 135: [2, 74], 136: [2, 74]},
        {1: [2, 29], 6: [2, 29], 25: [2, 29], 26: [2, 29], 49: [2, 29], 54: [2, 29], 57: [2, 29], 66: [2, 29], 67: [2, 29], 68: [2, 29], 70: [2, 29], 72: [2, 29], 73: [2, 29], 77: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29], 90: [2, 29], 92: [2, 29], 101: [2, 29], 103: [2, 29], 104: [2, 29], 105: [2, 29], 109: [2, 29], 117: [2, 29], 125: [2, 29], 127: [2, 29], 128: [2, 29], 131: [2, 29], 132: [2, 29], 133: [2, 29], 134: [2, 29], 135: [2, 29], 136: [2, 29]},
        {1: [2, 30], 6: [2, 30], 25: [2, 30], 26: [2, 30], 49: [2, 30], 54: [2, 30], 57: [2, 30], 66: [2, 30], 67: [2, 30], 68: [2, 30], 70: [2, 30], 72: [2, 30], 73: [2, 30], 77: [2, 30], 83: [2, 30], 84: [2, 30], 85: [2, 30], 90: [2, 30], 92: [2, 30], 101: [2, 30], 103: [2, 30], 104: [2, 30], 105: [2, 30], 109: [2, 30], 117: [2, 30], 125: [2, 30], 127: [2, 30], 128: [2, 30], 131: [2, 30], 132: [2, 30], 133: [2, 30], 134: [2, 30], 135: [2, 30], 136: [2, 30]},
        {1: [2, 31], 6: [2, 31], 25: [2, 31], 26: [2, 31], 49: [2, 31], 54: [2, 31], 57: [2, 31], 66: [2, 31], 67: [2, 31], 68: [2, 31], 70: [2, 31], 72: [2, 31], 73: [2, 31], 77: [2, 31], 83: [2, 31], 84: [2, 31], 85: [2, 31], 90: [2, 31], 92: [2, 31], 101: [2, 31], 103: [2, 31], 104: [2, 31], 105: [2, 31], 109: [2, 31], 117: [2, 31], 125: [2, 31], 127: [2, 31], 128: [2, 31], 131: [2, 31], 132: [2, 31], 133: [2, 31], 134: [2, 31], 135: [2, 31], 136: [2, 31]},
        {1: [2, 32], 6: [2, 32], 25: [2, 32], 26: [2, 32], 49: [2, 32], 54: [2, 32], 57: [2, 32], 66: [2, 32], 67: [2, 32], 68: [2, 32], 70: [2, 32], 72: [2, 32], 73: [2, 32], 77: [2, 32], 83: [2, 32], 84: [2, 32], 85: [2, 32], 90: [2, 32], 92: [2, 32], 101: [2, 32], 103: [2, 32], 104: [2, 32], 105: [2, 32], 109: [2, 32], 117: [2, 32], 125: [2, 32], 127: [2, 32], 128: [2, 32], 131: [2, 32], 132: [2, 32], 133: [2, 32], 134: [2, 32], 135: [2, 32], 136: [2, 32]},
        {1: [2, 33], 6: [2, 33], 25: [2, 33], 26: [2, 33], 49: [2, 33], 54: [2, 33], 57: [2, 33], 66: [2, 33], 67: [2, 33], 68: [2, 33], 70: [2, 33], 72: [2, 33], 73: [2, 33], 77: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33], 90: [2, 33], 92: [2, 33], 101: [2, 33], 103: [2, 33], 104: [2, 33], 105: [2, 33], 109: [2, 33], 117: [2, 33], 125: [2, 33], 127: [2, 33], 128: [2, 33], 131: [2, 33], 132: [2, 33], 133: [2, 33], 134: [2, 33], 135: [2, 33], 136: [2, 33]},
        {1: [2, 34], 6: [2, 34], 25: [2, 34], 26: [2, 34], 49: [2, 34], 54: [2, 34], 57: [2, 34], 66: [2, 34], 67: [2, 34], 68: [2, 34], 70: [2, 34], 72: [2, 34], 73: [2, 34], 77: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34], 90: [2, 34], 92: [2, 34], 101: [2, 34], 103: [2, 34], 104: [2, 34], 105: [2, 34], 109: [2, 34], 117: [2, 34], 125: [2, 34], 127: [2, 34], 128: [2, 34], 131: [2, 34], 132: [2, 34], 133: [2, 34], 134: [2, 34], 135: [2, 34], 136: [2, 34]},
        {1: [2, 35], 6: [2, 35], 25: [2, 35], 26: [2, 35], 49: [2, 35], 54: [2, 35], 57: [2, 35], 66: [2, 35], 67: [2, 35], 68: [2, 35], 70: [2, 35], 72: [2, 35], 73: [2, 35], 77: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35], 90: [2, 35], 92: [2, 35], 101: [2, 35], 103: [2, 35], 104: [2, 35], 105: [2, 35], 109: [2, 35], 117: [2, 35], 125: [2, 35], 127: [2, 35], 128: [2, 35], 131: [2, 35], 132: [2, 35], 133: [2, 35], 134: [2, 35], 135: [2, 35], 136: [2, 35]},
        {4: 140, 7: 4, 8: 6, 9: 7, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 141], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 142, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 146], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 86: 144, 87: [1, 58], 88: [1, 59], 89: [1, 57], 90: [1, 143], 93: 145, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 111], 6: [2, 111], 25: [2, 111], 26: [2, 111], 49: [2, 111], 54: [2, 111], 57: [2, 111], 66: [2, 111], 67: [2, 111], 68: [2, 111], 70: [2, 111], 72: [2, 111], 73: [2, 111], 77: [2, 111], 83: [2, 111], 84: [2, 111], 85: [2, 111], 90: [2, 111], 92: [2, 111], 101: [2, 111], 103: [2, 111], 104: [2, 111], 105: [2, 111], 109: [2, 111], 117: [2, 111], 125: [2, 111], 127: [2, 111], 128: [2, 111], 131: [2, 111], 132: [2, 111], 133: [2, 111], 134: [2, 111], 135: [2, 111], 136: [2, 111]},
        {1: [2, 112], 6: [2, 112], 25: [2, 112], 26: [2, 112], 27: 148, 28: [1, 73], 49: [2, 112], 54: [2, 112], 57: [2, 112], 66: [2, 112], 67: [2, 112], 68: [2, 112], 70: [2, 112], 72: [2, 112], 73: [2, 112], 77: [2, 112], 83: [2, 112], 84: [2, 112], 85: [2, 112], 90: [2, 112], 92: [2, 112], 101: [2, 112], 103: [2, 112], 104: [2, 112], 105: [2, 112], 109: [2, 112], 117: [2, 112], 125: [2, 112], 127: [2, 112], 128: [2, 112], 131: [2, 112], 132: [2, 112], 133: [2, 112], 134: [2, 112], 135: [2, 112], 136: [2, 112]},
        {25: [2, 51]},
        {25: [2, 52]},
        {1: [2, 68], 6: [2, 68], 25: [2, 68], 26: [2, 68], 40: [2, 68], 49: [2, 68], 54: [2, 68], 57: [2, 68], 66: [2, 68], 67: [2, 68], 68: [2, 68], 70: [2, 68], 72: [2, 68], 73: [2, 68], 77: [2, 68], 79: [2, 68], 83: [2, 68], 84: [2, 68], 85: [2, 68], 90: [2, 68], 92: [2, 68], 101: [2, 68], 103: [2, 68], 104: [2, 68], 105: [2, 68], 109: [2, 68], 117: [2, 68], 125: [2, 68], 127: [2, 68], 128: [2, 68], 129: [2, 68], 130: [2, 68], 131: [2, 68], 132: [2, 68], 133: [2, 68], 134: [2, 68], 135: [2, 68], 136: [2, 68], 137: [2, 68]},
        {1: [2, 71], 6: [2, 71], 25: [2, 71], 26: [2, 71], 40: [2, 71], 49: [2, 71], 54: [2, 71], 57: [2, 71], 66: [2, 71], 67: [2, 71], 68: [2, 71], 70: [2, 71], 72: [2, 71], 73: [2, 71], 77: [2, 71], 79: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71], 90: [2, 71], 92: [2, 71], 101: [2, 71], 103: [2, 71], 104: [2, 71], 105: [2, 71], 109: [2, 71], 117: [2, 71], 125: [2, 71], 127: [2, 71], 128: [2, 71], 129: [2, 71], 130: [2, 71], 131: [2, 71], 132: [2, 71], 133: [2, 71], 134: [2, 71], 135: [2, 71], 136: [2, 71], 137: [2, 71]},
        {8: 149, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 150, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 151, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {5: 152, 8: 153, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 5], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {27: 158, 28: [1, 73], 44: 159, 58: 160, 59: 161, 64: 154, 75: [1, 70], 88: [1, 113], 89: [1, 57], 112: 155, 113: [1, 156], 114: 157},
        {111: 162, 115: [1, 163], 116: [1, 164]},
        {6: [2, 90], 11: 168, 25: [2, 90], 27: 169, 28: [1, 73], 29: 170, 30: [1, 71], 31: [1, 72], 41: 166, 42: 167, 44: 171, 46: [1, 46], 54: [2, 90], 76: 165, 77: [2, 90], 88: [1, 113]},
        {1: [2, 27], 6: [2, 27], 25: [2, 27], 26: [2, 27], 43: [2, 27], 49: [2, 27], 54: [2, 27], 57: [2, 27], 66: [2, 27], 67: [2, 27], 68: [2, 27], 70: [2, 27], 72: [2, 27], 73: [2, 27], 77: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27], 90: [2, 27], 92: [2, 27], 101: [2, 27], 103: [2, 27], 104: [2, 27], 105: [2, 27], 109: [2, 27], 117: [2, 27], 125: [2, 27], 127: [2, 27], 128: [2, 27], 131: [2, 27], 132: [2, 27], 133: [2, 27], 134: [2, 27], 135: [2, 27], 136: [2, 27]},
        {1: [2, 28], 6: [2, 28], 25: [2, 28], 26: [2, 28], 43: [2, 28], 49: [2, 28], 54: [2, 28], 57: [2, 28], 66: [2, 28], 67: [2, 28], 68: [2, 28], 70: [2, 28], 72: [2, 28], 73: [2, 28], 77: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28], 90: [2, 28], 92: [2, 28], 101: [2, 28], 103: [2, 28], 104: [2, 28], 105: [2, 28], 109: [2, 28], 117: [2, 28], 125: [2, 28], 127: [2, 28], 128: [2, 28], 131: [2, 28], 132: [2, 28], 133: [2, 28], 134: [2, 28], 135: [2, 28], 136: [2, 28]},
        {1: [2, 26], 6: [2, 26], 25: [2, 26], 26: [2, 26], 40: [2, 26], 43: [2, 26], 49: [2, 26], 54: [2, 26], 57: [2, 26], 66: [2, 26], 67: [2, 26], 68: [2, 26], 70: [2, 26], 72: [2, 26], 73: [2, 26], 77: [2, 26], 79: [2, 26], 83: [2, 26], 84: [2, 26], 85: [2, 26], 90: [2, 26], 92: [2, 26], 101: [2, 26], 103: [2, 26], 104: [2, 26], 105: [2, 26], 109: [2, 26], 115: [2, 26], 116: [2, 26], 117: [2, 26], 125: [2, 26], 127: [2, 26], 128: [2, 26], 129: [2, 26], 130: [2, 26], 131: [2, 26], 132: [2, 26], 133: [2, 26], 134: [2, 26], 135: [2, 26], 136: [2, 26], 137: [2, 26]},
        {1: [2, 6], 6: [2, 6], 7: 172, 8: 6, 9: 7, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 26: [2, 6], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 101: [2, 6], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 3]},
        {1: [2, 24], 6: [2, 24], 25: [2, 24], 26: [2, 24], 49: [2, 24], 54: [2, 24], 57: [2, 24], 72: [2, 24], 77: [2, 24], 85: [2, 24], 90: [2, 24], 92: [2, 24], 97: [2, 24], 98: [2, 24], 101: [2, 24], 103: [2, 24], 104: [2, 24], 105: [2, 24], 109: [2, 24], 117: [2, 24], 120: [2, 24], 122: [2, 24], 125: [2, 24], 127: [2, 24], 128: [2, 24], 131: [2, 24], 132: [2, 24], 133: [2, 24], 134: [2, 24], 135: [2, 24], 136: [2, 24]},
        {6: [1, 74], 26: [1, 173]},
        {1: [2, 191], 6: [2, 191], 25: [2, 191], 26: [2, 191], 49: [2, 191], 54: [2, 191], 57: [2, 191], 72: [2, 191], 77: [2, 191], 85: [2, 191], 90: [2, 191], 92: [2, 191], 101: [2, 191], 103: [2, 191], 104: [2, 191], 105: [2, 191], 109: [2, 191], 117: [2, 191], 125: [2, 191], 127: [2, 191], 128: [2, 191], 131: [2, 191], 132: [2, 191], 133: [2, 191], 134: [2, 191], 135: [2, 191], 136: [2, 191]},
        {8: 174, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 175, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 176, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 177, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 178, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 179, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 180, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 181, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 146], 6: [2, 146], 25: [2, 146], 26: [2, 146], 49: [2, 146], 54: [2, 146], 57: [2, 146], 72: [2, 146], 77: [2, 146], 85: [2, 146], 90: [2, 146], 92: [2, 146], 101: [2, 146], 103: [2, 146], 104: [2, 146], 105: [2, 146], 109: [2, 146], 117: [2, 146], 125: [2, 146], 127: [2, 146], 128: [2, 146], 131: [2, 146], 132: [2, 146], 133: [2, 146], 134: [2, 146], 135: [2, 146], 136: [2, 146]},
        {1: [2, 151], 6: [2, 151], 25: [2, 151], 26: [2, 151], 49: [2, 151], 54: [2, 151], 57: [2, 151], 72: [2, 151], 77: [2, 151], 85: [2, 151], 90: [2, 151], 92: [2, 151], 101: [2, 151], 103: [2, 151], 104: [2, 151], 105: [2, 151], 109: [2, 151], 117: [2, 151], 125: [2, 151], 127: [2, 151], 128: [2, 151], 131: [2, 151], 132: [2, 151], 133: [2, 151], 134: [2, 151], 135: [2, 151], 136: [2, 151]},
        {8: 182, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 145], 6: [2, 145], 25: [2, 145], 26: [2, 145], 49: [2, 145], 54: [2, 145], 57: [2, 145], 72: [2, 145], 77: [2, 145], 85: [2, 145], 90: [2, 145], 92: [2, 145], 101: [2, 145], 103: [2, 145], 104: [2, 145], 105: [2, 145], 109: [2, 145], 117: [2, 145], 125: [2, 145], 127: [2, 145], 128: [2, 145], 131: [2, 145], 132: [2, 145], 133: [2, 145], 134: [2, 145], 135: [2, 145], 136: [2, 145]},
        {1: [2, 150], 6: [2, 150], 25: [2, 150], 26: [2, 150], 49: [2, 150], 54: [2, 150], 57: [2, 150], 72: [2, 150], 77: [2, 150], 85: [2, 150], 90: [2, 150], 92: [2, 150], 101: [2, 150], 103: [2, 150], 104: [2, 150], 105: [2, 150], 109: [2, 150], 117: [2, 150], 125: [2, 150], 127: [2, 150], 128: [2, 150], 131: [2, 150], 132: [2, 150], 133: [2, 150], 134: [2, 150], 135: [2, 150], 136: [2, 150]},
        {81: 183, 84: [1, 105]},
        {1: [2, 69], 6: [2, 69], 25: [2, 69], 26: [2, 69], 40: [2, 69], 49: [2, 69], 54: [2, 69], 57: [2, 69], 66: [2, 69], 67: [2, 69], 68: [2, 69], 70: [2, 69], 72: [2, 69], 73: [2, 69], 77: [2, 69], 79: [2, 69], 83: [2, 69], 84: [2, 69], 85: [2, 69], 90: [2, 69], 92: [2, 69], 101: [2, 69], 103: [2, 69], 104: [2, 69], 105: [2, 69], 109: [2, 69], 117: [2, 69], 125: [2, 69], 127: [2, 69], 128: [2, 69], 129: [2, 69], 130: [2, 69], 131: [2, 69], 132: [2, 69], 133: [2, 69], 134: [2, 69], 135: [2, 69], 136: [2, 69], 137: [2, 69]},
        {84: [2, 108]},
        {27: 184, 28: [1, 73]},
        {27: 185, 28: [1, 73]},
        {1: [2, 83], 6: [2, 83], 25: [2, 83], 26: [2, 83], 27: 186, 28: [1, 73], 40: [2, 83], 49: [2, 83], 54: [2, 83], 57: [2, 83], 66: [2, 83], 67: [2, 83], 68: [2, 83], 70: [2, 83], 72: [2, 83], 73: [2, 83], 77: [2, 83], 79: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83], 90: [2, 83], 92: [2, 83], 101: [2, 83], 103: [2, 83], 104: [2, 83], 105: [2, 83], 109: [2, 83], 117: [2, 83], 125: [2, 83], 127: [2, 83], 128: [2, 83], 129: [2, 83], 130: [2, 83], 131: [2, 83], 132: [2, 83], 133: [2, 83], 134: [2, 83], 135: [2, 83], 136: [2, 83], 137: [2, 83]},
        {1: [2, 84], 6: [2, 84], 25: [2, 84], 26: [2, 84], 40: [2, 84], 49: [2, 84], 54: [2, 84], 57: [2, 84], 66: [2, 84], 67: [2, 84], 68: [2, 84], 70: [2, 84], 72: [2, 84], 73: [2, 84], 77: [2, 84], 79: [2, 84], 83: [2, 84], 84: [2, 84], 85: [2, 84], 90: [2, 84], 92: [2, 84], 101: [2, 84], 103: [2, 84], 104: [2, 84], 105: [2, 84], 109: [2, 84], 117: [2, 84], 125: [2, 84], 127: [2, 84], 128: [2, 84], 129: [2, 84], 130: [2, 84], 131: [2, 84], 132: [2, 84], 133: [2, 84], 134: [2, 84], 135: [2, 84], 136: [2, 84], 137: [2, 84]},
        {8: 188, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 57: [1, 192], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 71: 187, 74: 189, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 91: 190, 92: [1, 191], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {69: 193, 70: [1, 99], 73: [1, 100]},
        {81: 194, 84: [1, 105]},
        {1: [2, 70], 6: [2, 70], 25: [2, 70], 26: [2, 70], 40: [2, 70], 49: [2, 70], 54: [2, 70], 57: [2, 70], 66: [2, 70], 67: [2, 70], 68: [2, 70], 70: [2, 70], 72: [2, 70], 73: [2, 70], 77: [2, 70], 79: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70], 90: [2, 70], 92: [2, 70], 101: [2, 70], 103: [2, 70], 104: [2, 70], 105: [2, 70], 109: [2, 70], 117: [2, 70], 125: [2, 70], 127: [2, 70], 128: [2, 70], 129: [2, 70], 130: [2, 70], 131: [2, 70], 132: [2, 70], 133: [2, 70], 134: [2, 70], 135: [2, 70], 136: [2, 70], 137: [2, 70]},
        {6: [1, 196], 8: 195, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 197], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 106], 6: [2, 106], 25: [2, 106], 26: [2, 106], 49: [2, 106], 54: [2, 106], 57: [2, 106], 66: [2, 106], 67: [2, 106], 68: [2, 106], 70: [2, 106], 72: [2, 106], 73: [2, 106], 77: [2, 106], 83: [2, 106], 84: [2, 106], 85: [2, 106], 90: [2, 106], 92: [2, 106], 101: [2, 106], 103: [2, 106], 104: [2, 106], 105: [2, 106], 109: [2, 106], 117: [2, 106], 125: [2, 106], 127: [2, 106], 128: [2, 106], 131: [2, 106], 132: [2, 106], 133: [2, 106], 134: [2, 106], 135: [2, 106], 136: [2, 106]},
        {8: 200, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 146], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 85: [1, 198], 86: 199, 87: [1, 58], 88: [1, 59], 89: [1, 57], 93: 145, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 53], 25: [2, 53], 49: [1, 201], 53: 203, 54: [1, 202]},
        {6: [2, 56], 25: [2, 56], 26: [2, 56], 49: [2, 56], 54: [2, 56]},
        {6: [2, 60], 25: [2, 60], 26: [2, 60], 40: [1, 205], 49: [2, 60], 54: [2, 60], 57: [1, 204]},
        {6: [2, 63], 25: [2, 63], 26: [2, 63], 40: [2, 63], 49: [2, 63], 54: [2, 63], 57: [2, 63]},
        {6: [2, 64], 25: [2, 64], 26: [2, 64], 40: [2, 64], 49: [2, 64], 54: [2, 64], 57: [2, 64]},
        {6: [2, 65], 25: [2, 65], 26: [2, 65], 40: [2, 65], 49: [2, 65], 54: [2, 65], 57: [2, 65]},
        {6: [2, 66], 25: [2, 66], 26: [2, 66], 40: [2, 66], 49: [2, 66], 54: [2, 66], 57: [2, 66]},
        {27: 148, 28: [1, 73]},
        {8: 200, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 146], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 86: 144, 87: [1, 58], 88: [1, 59], 89: [1, 57], 90: [1, 143], 93: 145, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 50], 6: [2, 50], 25: [2, 50], 26: [2, 50], 49: [2, 50], 54: [2, 50], 57: [2, 50], 72: [2, 50], 77: [2, 50], 85: [2, 50], 90: [2, 50], 92: [2, 50], 101: [2, 50], 103: [2, 50], 104: [2, 50], 105: [2, 50], 109: [2, 50], 117: [2, 50], 125: [2, 50], 127: [2, 50], 128: [2, 50], 131: [2, 50], 132: [2, 50], 133: [2, 50], 134: [2, 50], 135: [2, 50], 136: [2, 50]},
        {1: [2, 184], 6: [2, 184], 25: [2, 184], 26: [2, 184], 49: [2, 184], 54: [2, 184], 57: [2, 184], 72: [2, 184], 77: [2, 184], 85: [2, 184], 90: [2, 184], 92: [2, 184], 101: [2, 184], 102: 87, 103: [2, 184], 104: [2, 184], 105: [2, 184], 108: 88, 109: [2, 184], 110: 69, 117: [2, 184], 125: [2, 184], 127: [2, 184], 128: [2, 184], 131: [1, 78], 132: [2, 184], 133: [2, 184], 134: [2, 184], 135: [2, 184], 136: [2, 184]},
        {102: 90, 103: [1, 65], 105: [1, 66], 108: 91, 109: [1, 68], 110: 69, 125: [1, 89]},
        {1: [2, 185], 6: [2, 185], 25: [2, 185], 26: [2, 185], 49: [2, 185], 54: [2, 185], 57: [2, 185], 72: [2, 185], 77: [2, 185], 85: [2, 185], 90: [2, 185], 92: [2, 185], 101: [2, 185], 102: 87, 103: [2, 185], 104: [2, 185], 105: [2, 185], 108: 88, 109: [2, 185], 110: 69, 117: [2, 185], 125: [2, 185], 127: [2, 185], 128: [2, 185], 131: [1, 78], 132: [2, 185], 133: [2, 185], 134: [2, 185], 135: [2, 185], 136: [2, 185]},
        {1: [2, 186], 6: [2, 186], 25: [2, 186], 26: [2, 186], 49: [2, 186], 54: [2, 186], 57: [2, 186], 72: [2, 186], 77: [2, 186], 85: [2, 186], 90: [2, 186], 92: [2, 186], 101: [2, 186], 102: 87, 103: [2, 186], 104: [2, 186], 105: [2, 186], 108: 88, 109: [2, 186], 110: 69, 117: [2, 186], 125: [2, 186], 127: [2, 186], 128: [2, 186], 131: [1, 78], 132: [2, 186], 133: [2, 186], 134: [2, 186], 135: [2, 186], 136: [2, 186]},
        {1: [2, 187], 6: [2, 187], 25: [2, 187], 26: [2, 187], 49: [2, 187], 54: [2, 187], 57: [2, 187], 66: [2, 72], 67: [2, 72], 68: [2, 72], 70: [2, 72], 72: [2, 187], 73: [2, 72], 77: [2, 187], 83: [2, 72], 84: [2, 72], 85: [2, 187], 90: [2, 187], 92: [2, 187], 101: [2, 187], 103: [2, 187], 104: [2, 187], 105: [2, 187], 109: [2, 187], 117: [2, 187], 125: [2, 187], 127: [2, 187], 128: [2, 187], 131: [2, 187], 132: [2, 187], 133: [2, 187], 134: [2, 187], 135: [2, 187], 136: [2, 187]},
        {62: 93, 66: [1, 95], 67: [1, 96], 68: [1, 97], 69: 98, 70: [1, 99], 73: [1, 100], 80: 92, 83: [1, 94], 84: [2, 107]},
        {62: 102, 66: [1, 95], 67: [1, 96], 68: [1, 97], 69: 98, 70: [1, 99], 73: [1, 100], 80: 101, 83: [1, 94], 84: [2, 107]},
        {66: [2, 75], 67: [2, 75], 68: [2, 75], 70: [2, 75], 73: [2, 75], 83: [2, 75], 84: [2, 75]},
        {1: [2, 188], 6: [2, 188], 25: [2, 188], 26: [2, 188], 49: [2, 188], 54: [2, 188], 57: [2, 188], 66: [2, 72], 67: [2, 72], 68: [2, 72], 70: [2, 72], 72: [2, 188], 73: [2, 72], 77: [2, 188], 83: [2, 72], 84: [2, 72], 85: [2, 188], 90: [2, 188], 92: [2, 188], 101: [2, 188], 103: [2, 188], 104: [2, 188], 105: [2, 188], 109: [2, 188], 117: [2, 188], 125: [2, 188], 127: [2, 188], 128: [2, 188], 131: [2, 188], 132: [2, 188], 133: [2, 188], 134: [2, 188], 135: [2, 188], 136: [2, 188]},
        {1: [2, 189], 6: [2, 189], 25: [2, 189], 26: [2, 189], 49: [2, 189], 54: [2, 189], 57: [2, 189], 72: [2, 189], 77: [2, 189], 85: [2, 189], 90: [2, 189], 92: [2, 189], 101: [2, 189], 103: [2, 189], 104: [2, 189], 105: [2, 189], 109: [2, 189], 117: [2, 189], 125: [2, 189], 127: [2, 189], 128: [2, 189], 131: [2, 189], 132: [2, 189], 133: [2, 189], 134: [2, 189], 135: [2, 189], 136: [2, 189]},
        {1: [2, 190], 6: [2, 190], 25: [2, 190], 26: [2, 190], 49: [2, 190], 54: [2, 190], 57: [2, 190], 72: [2, 190], 77: [2, 190], 85: [2, 190], 90: [2, 190], 92: [2, 190], 101: [2, 190], 103: [2, 190], 104: [2, 190], 105: [2, 190], 109: [2, 190], 117: [2, 190], 125: [2, 190], 127: [2, 190], 128: [2, 190], 131: [2, 190], 132: [2, 190], 133: [2, 190], 134: [2, 190], 135: [2, 190], 136: [2, 190]},
        {8: 206, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 207], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 208, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {5: 209, 25: [1, 5], 124: [1, 210]},
        {1: [2, 132], 6: [2, 132], 25: [2, 132], 26: [2, 132], 49: [2, 132], 54: [2, 132], 57: [2, 132], 72: [2, 132], 77: [2, 132], 85: [2, 132], 90: [2, 132], 92: [2, 132], 96: 211, 97: [1, 212], 98: [1, 213], 101: [2, 132], 103: [2, 132], 104: [2, 132], 105: [2, 132], 109: [2, 132], 117: [2, 132], 125: [2, 132], 127: [2, 132], 128: [2, 132], 131: [2, 132], 132: [2, 132], 133: [2, 132], 134: [2, 132], 135: [2, 132], 136: [2, 132]},
        {1: [2, 144], 6: [2, 144], 25: [2, 144], 26: [2, 144], 49: [2, 144], 54: [2, 144], 57: [2, 144], 72: [2, 144], 77: [2, 144], 85: [2, 144], 90: [2, 144], 92: [2, 144], 101: [2, 144], 103: [2, 144], 104: [2, 144], 105: [2, 144], 109: [2, 144], 117: [2, 144], 125: [2, 144], 127: [2, 144], 128: [2, 144], 131: [2, 144], 132: [2, 144], 133: [2, 144], 134: [2, 144], 135: [2, 144], 136: [2, 144]},
        {1: [2, 152], 6: [2, 152], 25: [2, 152], 26: [2, 152], 49: [2, 152], 54: [2, 152], 57: [2, 152], 72: [2, 152], 77: [2, 152], 85: [2, 152], 90: [2, 152], 92: [2, 152], 101: [2, 152], 103: [2, 152], 104: [2, 152], 105: [2, 152], 109: [2, 152], 117: [2, 152], 125: [2, 152], 127: [2, 152], 128: [2, 152], 131: [2, 152], 132: [2, 152], 133: [2, 152], 134: [2, 152], 135: [2, 152], 136: [2, 152]},
        {25: [1, 214], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {119: 215, 121: 216, 122: [1, 217]},
        {1: [2, 96], 6: [2, 96], 25: [2, 96], 26: [2, 96], 49: [2, 96], 54: [2, 96], 57: [2, 96], 72: [2, 96], 77: [2, 96], 85: [2, 96], 90: [2, 96], 92: [2, 96], 101: [2, 96], 103: [2, 96], 104: [2, 96], 105: [2, 96], 109: [2, 96], 117: [2, 96], 125: [2, 96], 127: [2, 96], 128: [2, 96], 131: [2, 96], 132: [2, 96], 133: [2, 96], 134: [2, 96], 135: [2, 96], 136: [2, 96]},
        {8: 218, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 99], 5: 219, 6: [2, 99], 25: [1, 5], 26: [2, 99], 49: [2, 99], 54: [2, 99], 57: [2, 99], 66: [2, 72], 67: [2, 72], 68: [2, 72], 70: [2, 72], 72: [2, 99], 73: [2, 72], 77: [2, 99], 79: [1, 220], 83: [2, 72], 84: [2, 72], 85: [2, 99], 90: [2, 99], 92: [2, 99], 101: [2, 99], 103: [2, 99], 104: [2, 99], 105: [2, 99], 109: [2, 99], 117: [2, 99], 125: [2, 99], 127: [2, 99], 128: [2, 99], 131: [2, 99], 132: [2, 99], 133: [2, 99], 134: [2, 99], 135: [2, 99], 136: [2, 99]},
        {1: [2, 137], 6: [2, 137], 25: [2, 137], 26: [2, 137], 49: [2, 137], 54: [2, 137], 57: [2, 137], 72: [2, 137], 77: [2, 137], 85: [2, 137], 90: [2, 137], 92: [2, 137], 101: [2, 137], 102: 87, 103: [2, 137], 104: [2, 137], 105: [2, 137], 108: 88, 109: [2, 137], 110: 69, 117: [2, 137], 125: [2, 137], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 46], 6: [2, 46], 26: [2, 46], 101: [2, 46], 102: 87, 103: [2, 46], 105: [2, 46], 108: 88, 109: [2, 46], 110: 69, 125: [2, 46], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [1, 74], 101: [1, 221]},
        {4: 222, 7: 4, 8: 6, 9: 7, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 128], 25: [2, 128], 54: [2, 128], 57: [1, 224], 90: [2, 128], 91: 223, 92: [1, 191], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 114], 6: [2, 114], 25: [2, 114], 26: [2, 114], 40: [2, 114], 49: [2, 114], 54: [2, 114], 57: [2, 114], 66: [2, 114], 67: [2, 114], 68: [2, 114], 70: [2, 114], 72: [2, 114], 73: [2, 114], 77: [2, 114], 83: [2, 114], 84: [2, 114], 85: [2, 114], 90: [2, 114], 92: [2, 114], 101: [2, 114], 103: [2, 114], 104: [2, 114], 105: [2, 114], 109: [2, 114], 115: [2, 114], 116: [2, 114], 117: [2, 114], 125: [2, 114], 127: [2, 114], 128: [2, 114], 131: [2, 114], 132: [2, 114], 133: [2, 114], 134: [2, 114], 135: [2, 114], 136: [2, 114]},
        {6: [2, 53], 25: [2, 53], 53: 225, 54: [1, 226], 90: [2, 53]},
        {6: [2, 123], 25: [2, 123], 26: [2, 123], 54: [2, 123], 85: [2, 123], 90: [2, 123]},
        {8: 200, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 146], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 86: 227, 87: [1, 58], 88: [1, 59], 89: [1, 57], 93: 145, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 129], 25: [2, 129], 26: [2, 129], 54: [2, 129], 85: [2, 129], 90: [2, 129]},
        {1: [2, 113], 6: [2, 113], 25: [2, 113], 26: [2, 113], 40: [2, 113], 43: [2, 113], 49: [2, 113], 54: [2, 113], 57: [2, 113], 66: [2, 113], 67: [2, 113], 68: [2, 113], 70: [2, 113], 72: [2, 113], 73: [2, 113], 77: [2, 113], 79: [2, 113], 83: [2, 113], 84: [2, 113], 85: [2, 113], 90: [2, 113], 92: [2, 113], 101: [2, 113], 103: [2, 113], 104: [2, 113], 105: [2, 113], 109: [2, 113], 115: [2, 113], 116: [2, 113], 117: [2, 113], 125: [2, 113], 127: [2, 113], 128: [2, 113], 129: [2, 113], 130: [2, 113], 131: [2, 113], 132: [2, 113], 133: [2, 113], 134: [2, 113], 135: [2, 113], 136: [2, 113], 137: [2, 113]},
        {5: 228, 25: [1, 5], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 140], 6: [2, 140], 25: [2, 140], 26: [2, 140], 49: [2, 140], 54: [2, 140], 57: [2, 140], 72: [2, 140], 77: [2, 140], 85: [2, 140], 90: [2, 140], 92: [2, 140], 101: [2, 140], 102: 87, 103: [1, 65], 104: [1, 229], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 140], 125: [2, 140], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 142], 6: [2, 142], 25: [2, 142], 26: [2, 142], 49: [2, 142], 54: [2, 142], 57: [2, 142], 72: [2, 142], 77: [2, 142], 85: [2, 142], 90: [2, 142], 92: [2, 142], 101: [2, 142], 102: 87, 103: [1, 65], 104: [1, 230], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 142], 125: [2, 142], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 148], 6: [2, 148], 25: [2, 148], 26: [2, 148], 49: [2, 148], 54: [2, 148], 57: [2, 148], 72: [2, 148], 77: [2, 148], 85: [2, 148], 90: [2, 148], 92: [2, 148], 101: [2, 148], 103: [2, 148], 104: [2, 148], 105: [2, 148], 109: [2, 148], 117: [2, 148], 125: [2, 148], 127: [2, 148], 128: [2, 148], 131: [2, 148], 132: [2, 148], 133: [2, 148], 134: [2, 148], 135: [2, 148], 136: [2, 148]},
        {1: [2, 149], 6: [2, 149], 25: [2, 149], 26: [2, 149], 49: [2, 149], 54: [2, 149], 57: [2, 149], 72: [2, 149], 77: [2, 149], 85: [2, 149], 90: [2, 149], 92: [2, 149], 101: [2, 149], 102: 87, 103: [1, 65], 104: [2, 149], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 149], 125: [2, 149], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 153], 6: [2, 153], 25: [2, 153], 26: [2, 153], 49: [2, 153], 54: [2, 153], 57: [2, 153], 72: [2, 153], 77: [2, 153], 85: [2, 153], 90: [2, 153], 92: [2, 153], 101: [2, 153], 103: [2, 153], 104: [2, 153], 105: [2, 153], 109: [2, 153], 117: [2, 153], 125: [2, 153], 127: [2, 153], 128: [2, 153], 131: [2, 153], 132: [2, 153], 133: [2, 153], 134: [2, 153], 135: [2, 153], 136: [2, 153]},
        {115: [2, 155], 116: [2, 155]},
        {27: 158, 28: [1, 73], 44: 159, 58: 160, 59: 161, 75: [1, 70], 88: [1, 113], 89: [1, 114], 112: 231, 114: 157},
        {54: [1, 232], 115: [2, 161], 116: [2, 161]},
        {54: [2, 157], 115: [2, 157], 116: [2, 157]},
        {54: [2, 158], 115: [2, 158], 116: [2, 158]},
        {54: [2, 159], 115: [2, 159], 116: [2, 159]},
        {54: [2, 160], 115: [2, 160], 116: [2, 160]},
        {1: [2, 154], 6: [2, 154], 25: [2, 154], 26: [2, 154], 49: [2, 154], 54: [2, 154], 57: [2, 154], 72: [2, 154], 77: [2, 154], 85: [2, 154], 90: [2, 154], 92: [2, 154], 101: [2, 154], 103: [2, 154], 104: [2, 154], 105: [2, 154], 109: [2, 154], 117: [2, 154], 125: [2, 154], 127: [2, 154], 128: [2, 154], 131: [2, 154], 132: [2, 154], 133: [2, 154], 134: [2, 154], 135: [2, 154], 136: [2, 154]},
        {8: 233, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 234, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 53], 25: [2, 53], 53: 235, 54: [1, 236], 77: [2, 53]},
        {6: [2, 91], 25: [2, 91], 26: [2, 91], 54: [2, 91], 77: [2, 91]},
        {6: [2, 39], 25: [2, 39], 26: [2, 39], 43: [1, 237], 54: [2, 39], 77: [2, 39]},
        {6: [2, 42], 25: [2, 42], 26: [2, 42], 54: [2, 42], 77: [2, 42]},
        {6: [2, 43], 25: [2, 43], 26: [2, 43], 43: [2, 43], 54: [2, 43], 77: [2, 43]},
        {6: [2, 44], 25: [2, 44], 26: [2, 44], 43: [2, 44], 54: [2, 44], 77: [2, 44]},
        {6: [2, 45], 25: [2, 45], 26: [2, 45], 43: [2, 45], 54: [2, 45], 77: [2, 45]},
        {1: [2, 5], 6: [2, 5], 26: [2, 5], 101: [2, 5]},
        {1: [2, 25], 6: [2, 25], 25: [2, 25], 26: [2, 25], 49: [2, 25], 54: [2, 25], 57: [2, 25], 72: [2, 25], 77: [2, 25], 85: [2, 25], 90: [2, 25], 92: [2, 25], 97: [2, 25], 98: [2, 25], 101: [2, 25], 103: [2, 25], 104: [2, 25], 105: [2, 25], 109: [2, 25], 117: [2, 25], 120: [2, 25], 122: [2, 25], 125: [2, 25], 127: [2, 25], 128: [2, 25], 131: [2, 25], 132: [2, 25], 133: [2, 25], 134: [2, 25], 135: [2, 25], 136: [2, 25]},
        {1: [2, 192], 6: [2, 192], 25: [2, 192], 26: [2, 192], 49: [2, 192], 54: [2, 192], 57: [2, 192], 72: [2, 192], 77: [2, 192], 85: [2, 192], 90: [2, 192], 92: [2, 192], 101: [2, 192], 102: 87, 103: [2, 192], 104: [2, 192], 105: [2, 192], 108: 88, 109: [2, 192], 110: 69, 117: [2, 192], 125: [2, 192], 127: [2, 192], 128: [2, 192], 131: [1, 78], 132: [1, 81], 133: [2, 192], 134: [2, 192], 135: [2, 192], 136: [2, 192]},
        {1: [2, 193], 6: [2, 193], 25: [2, 193], 26: [2, 193], 49: [2, 193], 54: [2, 193], 57: [2, 193], 72: [2, 193], 77: [2, 193], 85: [2, 193], 90: [2, 193], 92: [2, 193], 101: [2, 193], 102: 87, 103: [2, 193], 104: [2, 193], 105: [2, 193], 108: 88, 109: [2, 193], 110: 69, 117: [2, 193], 125: [2, 193], 127: [2, 193], 128: [2, 193], 131: [1, 78], 132: [1, 81], 133: [2, 193], 134: [2, 193], 135: [2, 193], 136: [2, 193]},
        {1: [2, 194], 6: [2, 194], 25: [2, 194], 26: [2, 194], 49: [2, 194], 54: [2, 194], 57: [2, 194], 72: [2, 194], 77: [2, 194], 85: [2, 194], 90: [2, 194], 92: [2, 194], 101: [2, 194], 102: 87, 103: [2, 194], 104: [2, 194], 105: [2, 194], 108: 88, 109: [2, 194], 110: 69, 117: [2, 194], 125: [2, 194], 127: [2, 194], 128: [2, 194], 131: [1, 78], 132: [2, 194], 133: [2, 194], 134: [2, 194], 135: [2, 194], 136: [2, 194]},
        {1: [2, 195], 6: [2, 195], 25: [2, 195], 26: [2, 195], 49: [2, 195], 54: [2, 195], 57: [2, 195], 72: [2, 195], 77: [2, 195], 85: [2, 195], 90: [2, 195], 92: [2, 195], 101: [2, 195], 102: 87, 103: [2, 195], 104: [2, 195], 105: [2, 195], 108: 88, 109: [2, 195], 110: 69, 117: [2, 195], 125: [2, 195], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [2, 195], 134: [2, 195], 135: [2, 195], 136: [2, 195]},
        {1: [2, 196], 6: [2, 196], 25: [2, 196], 26: [2, 196], 49: [2, 196], 54: [2, 196], 57: [2, 196], 72: [2, 196], 77: [2, 196], 85: [2, 196], 90: [2, 196], 92: [2, 196], 101: [2, 196], 102: 87, 103: [2, 196], 104: [2, 196], 105: [2, 196], 108: 88, 109: [2, 196], 110: 69, 117: [2, 196], 125: [2, 196], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [2, 196], 135: [2, 196], 136: [1, 85]},
        {1: [2, 197], 6: [2, 197], 25: [2, 197], 26: [2, 197], 49: [2, 197], 54: [2, 197], 57: [2, 197], 72: [2, 197], 77: [2, 197], 85: [2, 197], 90: [2, 197], 92: [2, 197], 101: [2, 197], 102: 87, 103: [2, 197], 104: [2, 197], 105: [2, 197], 108: 88, 109: [2, 197], 110: 69, 117: [2, 197], 125: [2, 197], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [2, 197], 136: [1, 85]},
        {1: [2, 198], 6: [2, 198], 25: [2, 198], 26: [2, 198], 49: [2, 198], 54: [2, 198], 57: [2, 198], 72: [2, 198], 77: [2, 198], 85: [2, 198], 90: [2, 198], 92: [2, 198], 101: [2, 198], 102: 87, 103: [2, 198], 104: [2, 198], 105: [2, 198], 108: 88, 109: [2, 198], 110: 69, 117: [2, 198], 125: [2, 198], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [2, 198], 135: [2, 198], 136: [2, 198]},
        {1: [2, 183], 6: [2, 183], 25: [2, 183], 26: [2, 183], 49: [2, 183], 54: [2, 183], 57: [2, 183], 72: [2, 183], 77: [2, 183], 85: [2, 183], 90: [2, 183], 92: [2, 183], 101: [2, 183], 102: 87, 103: [1, 65], 104: [2, 183], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 183], 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 182], 6: [2, 182], 25: [2, 182], 26: [2, 182], 49: [2, 182], 54: [2, 182], 57: [2, 182], 72: [2, 182], 77: [2, 182], 85: [2, 182], 90: [2, 182], 92: [2, 182], 101: [2, 182], 102: 87, 103: [1, 65], 104: [2, 182], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 182], 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 103], 6: [2, 103], 25: [2, 103], 26: [2, 103], 49: [2, 103], 54: [2, 103], 57: [2, 103], 66: [2, 103], 67: [2, 103], 68: [2, 103], 70: [2, 103], 72: [2, 103], 73: [2, 103], 77: [2, 103], 83: [2, 103], 84: [2, 103], 85: [2, 103], 90: [2, 103], 92: [2, 103], 101: [2, 103], 103: [2, 103], 104: [2, 103], 105: [2, 103], 109: [2, 103], 117: [2, 103], 125: [2, 103], 127: [2, 103], 128: [2, 103], 131: [2, 103], 132: [2, 103], 133: [2, 103], 134: [2, 103], 135: [2, 103], 136: [2, 103]},
        {1: [2, 80], 6: [2, 80], 25: [2, 80], 26: [2, 80], 40: [2, 80], 49: [2, 80], 54: [2, 80], 57: [2, 80], 66: [2, 80], 67: [2, 80], 68: [2, 80], 70: [2, 80], 72: [2, 80], 73: [2, 80], 77: [2, 80], 79: [2, 80], 83: [2, 80], 84: [2, 80], 85: [2, 80], 90: [2, 80], 92: [2, 80], 101: [2, 80], 103: [2, 80], 104: [2, 80], 105: [2, 80], 109: [2, 80], 117: [2, 80], 125: [2, 80], 127: [2, 80], 128: [2, 80], 129: [2, 80], 130: [2, 80], 131: [2, 80], 132: [2, 80], 133: [2, 80], 134: [2, 80], 135: [2, 80], 136: [2, 80], 137: [2, 80]},
        {1: [2, 81], 6: [2, 81], 25: [2, 81], 26: [2, 81], 40: [2, 81], 49: [2, 81], 54: [2, 81], 57: [2, 81], 66: [2, 81], 67: [2, 81], 68: [2, 81], 70: [2, 81], 72: [2, 81], 73: [2, 81], 77: [2, 81], 79: [2, 81], 83: [2, 81], 84: [2, 81], 85: [2, 81], 90: [2, 81], 92: [2, 81], 101: [2, 81], 103: [2, 81], 104: [2, 81], 105: [2, 81], 109: [2, 81], 117: [2, 81], 125: [2, 81], 127: [2, 81], 128: [2, 81], 129: [2, 81], 130: [2, 81], 131: [2, 81], 132: [2, 81], 133: [2, 81], 134: [2, 81], 135: [2, 81], 136: [2, 81], 137: [2, 81]},
        {1: [2, 82], 6: [2, 82], 25: [2, 82], 26: [2, 82], 40: [2, 82], 49: [2, 82], 54: [2, 82], 57: [2, 82], 66: [2, 82], 67: [2, 82], 68: [2, 82], 70: [2, 82], 72: [2, 82], 73: [2, 82], 77: [2, 82], 79: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82], 90: [2, 82], 92: [2, 82], 101: [2, 82], 103: [2, 82], 104: [2, 82], 105: [2, 82], 109: [2, 82], 117: [2, 82], 125: [2, 82], 127: [2, 82], 128: [2, 82], 129: [2, 82], 130: [2, 82], 131: [2, 82], 132: [2, 82], 133: [2, 82], 134: [2, 82], 135: [2, 82], 136: [2, 82], 137: [2, 82]},
        {72: [1, 238]},
        {57: [1, 192], 72: [2, 87], 91: 239, 92: [1, 191], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {72: [2, 88]},
        {8: 240, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 72: [2, 122], 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {12: [2, 116], 28: [2, 116], 30: [2, 116], 31: [2, 116], 33: [2, 116], 34: [2, 116], 35: [2, 116], 36: [2, 116], 37: [2, 116], 38: [2, 116], 45: [2, 116], 46: [2, 116], 47: [2, 116], 51: [2, 116], 52: [2, 116], 72: [2, 116], 75: [2, 116], 78: [2, 116], 82: [2, 116], 87: [2, 116], 88: [2, 116], 89: [2, 116], 95: [2, 116], 99: [2, 116], 100: [2, 116], 103: [2, 116], 105: [2, 116], 107: [2, 116], 109: [2, 116], 118: [2, 116], 124: [2, 116], 126: [2, 116], 127: [2, 116], 128: [2, 116], 129: [2, 116], 130: [2, 116]},
        {12: [2, 117], 28: [2, 117], 30: [2, 117], 31: [2, 117], 33: [2, 117], 34: [2, 117], 35: [2, 117], 36: [2, 117], 37: [2, 117], 38: [2, 117], 45: [2, 117], 46: [2, 117], 47: [2, 117], 51: [2, 117], 52: [2, 117], 72: [2, 117], 75: [2, 117], 78: [2, 117], 82: [2, 117], 87: [2, 117], 88: [2, 117], 89: [2, 117], 95: [2, 117], 99: [2, 117], 100: [2, 117], 103: [2, 117], 105: [2, 117], 107: [2, 117], 109: [2, 117], 118: [2, 117], 124: [2, 117], 126: [2, 117], 127: [2, 117], 128: [2, 117], 129: [2, 117], 130: [2, 117]},
        {1: [2, 86], 6: [2, 86], 25: [2, 86], 26: [2, 86], 40: [2, 86], 49: [2, 86], 54: [2, 86], 57: [2, 86], 66: [2, 86], 67: [2, 86], 68: [2, 86], 70: [2, 86], 72: [2, 86], 73: [2, 86], 77: [2, 86], 79: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86], 90: [2, 86], 92: [2, 86], 101: [2, 86], 103: [2, 86], 104: [2, 86], 105: [2, 86], 109: [2, 86], 117: [2, 86], 125: [2, 86], 127: [2, 86], 128: [2, 86], 129: [2, 86], 130: [2, 86], 131: [2, 86], 132: [2, 86], 133: [2, 86], 134: [2, 86], 135: [2, 86], 136: [2, 86], 137: [2, 86]},
        {1: [2, 104], 6: [2, 104], 25: [2, 104], 26: [2, 104], 49: [2, 104], 54: [2, 104], 57: [2, 104], 66: [2, 104], 67: [2, 104], 68: [2, 104], 70: [2, 104], 72: [2, 104], 73: [2, 104], 77: [2, 104], 83: [2, 104], 84: [2, 104], 85: [2, 104], 90: [2, 104], 92: [2, 104], 101: [2, 104], 103: [2, 104], 104: [2, 104], 105: [2, 104], 109: [2, 104], 117: [2, 104], 125: [2, 104], 127: [2, 104], 128: [2, 104], 131: [2, 104], 132: [2, 104], 133: [2, 104], 134: [2, 104], 135: [2, 104], 136: [2, 104]},
        {1: [2, 36], 6: [2, 36], 25: [2, 36], 26: [2, 36], 49: [2, 36], 54: [2, 36], 57: [2, 36], 72: [2, 36], 77: [2, 36], 85: [2, 36], 90: [2, 36], 92: [2, 36], 101: [2, 36], 102: 87, 103: [2, 36], 104: [2, 36], 105: [2, 36], 108: 88, 109: [2, 36], 110: 69, 117: [2, 36], 125: [2, 36], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {8: 241, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 242, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 109], 6: [2, 109], 25: [2, 109], 26: [2, 109], 49: [2, 109], 54: [2, 109], 57: [2, 109], 66: [2, 109], 67: [2, 109], 68: [2, 109], 70: [2, 109], 72: [2, 109], 73: [2, 109], 77: [2, 109], 83: [2, 109], 84: [2, 109], 85: [2, 109], 90: [2, 109], 92: [2, 109], 101: [2, 109], 103: [2, 109], 104: [2, 109], 105: [2, 109], 109: [2, 109], 117: [2, 109], 125: [2, 109], 127: [2, 109], 128: [2, 109], 131: [2, 109], 132: [2, 109], 133: [2, 109], 134: [2, 109], 135: [2, 109], 136: [2, 109]},
        {6: [2, 53], 25: [2, 53], 53: 243, 54: [1, 226], 85: [2, 53]},
        {6: [2, 128], 25: [2, 128], 26: [2, 128], 54: [2, 128], 57: [1, 244], 85: [2, 128], 90: [2, 128], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {50: 245, 51: [1, 60], 52: [1, 61]},
        {6: [2, 54], 25: [2, 54], 26: [2, 54], 27: 109, 28: [1, 73], 44: 110, 55: 246, 56: 108, 58: 111, 59: 112, 75: [1, 70], 88: [1, 113], 89: [1, 114]},
        {6: [1, 247], 25: [1, 248]},
        {6: [2, 61], 25: [2, 61], 26: [2, 61], 49: [2, 61], 54: [2, 61]},
        {8: 249, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 199], 6: [2, 199], 25: [2, 199], 26: [2, 199], 49: [2, 199], 54: [2, 199], 57: [2, 199], 72: [2, 199], 77: [2, 199], 85: [2, 199], 90: [2, 199], 92: [2, 199], 101: [2, 199], 102: 87, 103: [2, 199], 104: [2, 199], 105: [2, 199], 108: 88, 109: [2, 199], 110: 69, 117: [2, 199], 125: [2, 199], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {8: 250, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 201], 6: [2, 201], 25: [2, 201], 26: [2, 201], 49: [2, 201], 54: [2, 201], 57: [2, 201], 72: [2, 201], 77: [2, 201], 85: [2, 201], 90: [2, 201], 92: [2, 201], 101: [2, 201], 102: 87, 103: [2, 201], 104: [2, 201], 105: [2, 201], 108: 88, 109: [2, 201], 110: 69, 117: [2, 201], 125: [2, 201], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 181], 6: [2, 181], 25: [2, 181], 26: [2, 181], 49: [2, 181], 54: [2, 181], 57: [2, 181], 72: [2, 181], 77: [2, 181], 85: [2, 181], 90: [2, 181], 92: [2, 181], 101: [2, 181], 103: [2, 181], 104: [2, 181], 105: [2, 181], 109: [2, 181], 117: [2, 181], 125: [2, 181], 127: [2, 181], 128: [2, 181], 131: [2, 181], 132: [2, 181], 133: [2, 181], 134: [2, 181], 135: [2, 181], 136: [2, 181]},
        {8: 251, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 133], 6: [2, 133], 25: [2, 133], 26: [2, 133], 49: [2, 133], 54: [2, 133], 57: [2, 133], 72: [2, 133], 77: [2, 133], 85: [2, 133], 90: [2, 133], 92: [2, 133], 97: [1, 252], 101: [2, 133], 103: [2, 133], 104: [2, 133], 105: [2, 133], 109: [2, 133], 117: [2, 133], 125: [2, 133], 127: [2, 133], 128: [2, 133], 131: [2, 133], 132: [2, 133], 133: [2, 133], 134: [2, 133], 135: [2, 133], 136: [2, 133]},
        {5: 253, 25: [1, 5]},
        {27: 254, 28: [1, 73]},
        {119: 255, 121: 216, 122: [1, 217]},
        {26: [1, 256], 120: [1, 257], 121: 258, 122: [1, 217]},
        {26: [2, 174], 120: [2, 174], 122: [2, 174]},
        {8: 260, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 94: 259, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 97], 5: 261, 6: [2, 97], 25: [1, 5], 26: [2, 97], 49: [2, 97], 54: [2, 97], 57: [2, 97], 72: [2, 97], 77: [2, 97], 85: [2, 97], 90: [2, 97], 92: [2, 97], 101: [2, 97], 102: 87, 103: [1, 65], 104: [2, 97], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 97], 125: [2, 97], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 100], 6: [2, 100], 25: [2, 100], 26: [2, 100], 49: [2, 100], 54: [2, 100], 57: [2, 100], 72: [2, 100], 77: [2, 100], 85: [2, 100], 90: [2, 100], 92: [2, 100], 101: [2, 100], 103: [2, 100], 104: [2, 100], 105: [2, 100], 109: [2, 100], 117: [2, 100], 125: [2, 100], 127: [2, 100], 128: [2, 100], 131: [2, 100], 132: [2, 100], 133: [2, 100], 134: [2, 100], 135: [2, 100], 136: [2, 100]},
        {8: 262, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 138], 6: [2, 138], 25: [2, 138], 26: [2, 138], 49: [2, 138], 54: [2, 138], 57: [2, 138], 66: [2, 138], 67: [2, 138], 68: [2, 138], 70: [2, 138], 72: [2, 138], 73: [2, 138], 77: [2, 138], 83: [2, 138], 84: [2, 138], 85: [2, 138], 90: [2, 138], 92: [2, 138], 101: [2, 138], 103: [2, 138], 104: [2, 138], 105: [2, 138], 109: [2, 138], 117: [2, 138], 125: [2, 138], 127: [2, 138], 128: [2, 138], 131: [2, 138], 132: [2, 138], 133: [2, 138], 134: [2, 138], 135: [2, 138], 136: [2, 138]},
        {6: [1, 74], 26: [1, 263]},
        {8: 264, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 67], 12: [2, 117], 25: [2, 67], 28: [2, 117], 30: [2, 117], 31: [2, 117], 33: [2, 117], 34: [2, 117], 35: [2, 117], 36: [2, 117], 37: [2, 117], 38: [2, 117], 45: [2, 117], 46: [2, 117], 47: [2, 117], 51: [2, 117], 52: [2, 117], 54: [2, 67], 75: [2, 117], 78: [2, 117], 82: [2, 117], 87: [2, 117], 88: [2, 117], 89: [2, 117], 90: [2, 67], 95: [2, 117], 99: [2, 117], 100: [2, 117], 103: [2, 117], 105: [2, 117], 107: [2, 117], 109: [2, 117], 118: [2, 117], 124: [2, 117], 126: [2, 117], 127: [2, 117], 128: [2, 117], 129: [2, 117], 130: [2, 117]},
        {6: [1, 266], 25: [1, 267], 90: [1, 265]},
        {6: [2, 54], 8: 200, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [2, 54], 26: [2, 54], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 85: [2, 54], 87: [1, 58], 88: [1, 59], 89: [1, 57], 90: [2, 54], 93: 268, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 53], 25: [2, 53], 26: [2, 53], 53: 269, 54: [1, 226]},
        {1: [2, 178], 6: [2, 178], 25: [2, 178], 26: [2, 178], 49: [2, 178], 54: [2, 178], 57: [2, 178], 72: [2, 178], 77: [2, 178], 85: [2, 178], 90: [2, 178], 92: [2, 178], 101: [2, 178], 103: [2, 178], 104: [2, 178], 105: [2, 178], 109: [2, 178], 117: [2, 178], 120: [2, 178], 125: [2, 178], 127: [2, 178], 128: [2, 178], 131: [2, 178], 132: [2, 178], 133: [2, 178], 134: [2, 178], 135: [2, 178], 136: [2, 178]},
        {8: 270, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 271, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {115: [2, 156], 116: [2, 156]},
        {27: 158, 28: [1, 73], 44: 159, 58: 160, 59: 161, 75: [1, 70], 88: [1, 113], 89: [1, 114], 114: 272},
        {1: [2, 163], 6: [2, 163], 25: [2, 163], 26: [2, 163], 49: [2, 163], 54: [2, 163], 57: [2, 163], 72: [2, 163], 77: [2, 163], 85: [2, 163], 90: [2, 163], 92: [2, 163], 101: [2, 163], 102: 87, 103: [2, 163], 104: [1, 273], 105: [2, 163], 108: 88, 109: [2, 163], 110: 69, 117: [1, 274], 125: [2, 163], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 164], 6: [2, 164], 25: [2, 164], 26: [2, 164], 49: [2, 164], 54: [2, 164], 57: [2, 164], 72: [2, 164], 77: [2, 164], 85: [2, 164], 90: [2, 164], 92: [2, 164], 101: [2, 164], 102: 87, 103: [2, 164], 104: [1, 275], 105: [2, 164], 108: 88, 109: [2, 164], 110: 69, 117: [2, 164], 125: [2, 164], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [1, 277], 25: [1, 278], 77: [1, 276]},
        {6: [2, 54], 11: 168, 25: [2, 54], 26: [2, 54], 27: 169, 28: [1, 73], 29: 170, 30: [1, 71], 31: [1, 72], 41: 279, 42: 167, 44: 171, 46: [1, 46], 77: [2, 54], 88: [1, 113]},
        {8: 280, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 281], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 85], 6: [2, 85], 25: [2, 85], 26: [2, 85], 40: [2, 85], 49: [2, 85], 54: [2, 85], 57: [2, 85], 66: [2, 85], 67: [2, 85], 68: [2, 85], 70: [2, 85], 72: [2, 85], 73: [2, 85], 77: [2, 85], 79: [2, 85], 83: [2, 85], 84: [2, 85], 85: [2, 85], 90: [2, 85], 92: [2, 85], 101: [2, 85], 103: [2, 85], 104: [2, 85], 105: [2, 85], 109: [2, 85], 117: [2, 85], 125: [2, 85], 127: [2, 85], 128: [2, 85], 129: [2, 85], 130: [2, 85], 131: [2, 85], 132: [2, 85], 133: [2, 85], 134: [2, 85], 135: [2, 85], 136: [2, 85], 137: [2, 85]},
        {8: 282, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 72: [2, 120], 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {72: [2, 121], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 37], 6: [2, 37], 25: [2, 37], 26: [2, 37], 49: [2, 37], 54: [2, 37], 57: [2, 37], 72: [2, 37], 77: [2, 37], 85: [2, 37], 90: [2, 37], 92: [2, 37], 101: [2, 37], 102: 87, 103: [2, 37], 104: [2, 37], 105: [2, 37], 108: 88, 109: [2, 37], 110: 69, 117: [2, 37], 125: [2, 37], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {26: [1, 283], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [1, 266], 25: [1, 267], 85: [1, 284]},
        {6: [2, 67], 25: [2, 67], 26: [2, 67], 54: [2, 67], 85: [2, 67], 90: [2, 67]},
        {5: 285, 25: [1, 5]},
        {6: [2, 57], 25: [2, 57], 26: [2, 57], 49: [2, 57], 54: [2, 57]},
        {27: 109, 28: [1, 73], 44: 110, 55: 286, 56: 108, 58: 111, 59: 112, 75: [1, 70], 88: [1, 113], 89: [1, 114]},
        {6: [2, 55], 25: [2, 55], 26: [2, 55], 27: 109, 28: [1, 73], 44: 110, 48: 287, 54: [2, 55], 55: 107, 56: 108, 58: 111, 59: 112, 75: [1, 70], 88: [1, 113], 89: [1, 114]},
        {6: [2, 62], 25: [2, 62], 26: [2, 62], 49: [2, 62], 54: [2, 62], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {26: [1, 288], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {5: 289, 25: [1, 5], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {5: 290, 25: [1, 5]},
        {1: [2, 134], 6: [2, 134], 25: [2, 134], 26: [2, 134], 49: [2, 134], 54: [2, 134], 57: [2, 134], 72: [2, 134], 77: [2, 134], 85: [2, 134], 90: [2, 134], 92: [2, 134], 101: [2, 134], 103: [2, 134], 104: [2, 134], 105: [2, 134], 109: [2, 134], 117: [2, 134], 125: [2, 134], 127: [2, 134], 128: [2, 134], 131: [2, 134], 132: [2, 134], 133: [2, 134], 134: [2, 134], 135: [2, 134], 136: [2, 134]},
        {5: 291, 25: [1, 5]},
        {26: [1, 292], 120: [1, 293], 121: 258, 122: [1, 217]},
        {1: [2, 172], 6: [2, 172], 25: [2, 172], 26: [2, 172], 49: [2, 172], 54: [2, 172], 57: [2, 172], 72: [2, 172], 77: [2, 172], 85: [2, 172], 90: [2, 172], 92: [2, 172], 101: [2, 172], 103: [2, 172], 104: [2, 172], 105: [2, 172], 109: [2, 172], 117: [2, 172], 125: [2, 172], 127: [2, 172], 128: [2, 172], 131: [2, 172], 132: [2, 172], 133: [2, 172], 134: [2, 172], 135: [2, 172], 136: [2, 172]},
        {5: 294, 25: [1, 5]},
        {26: [2, 175], 120: [2, 175], 122: [2, 175]},
        {5: 295, 25: [1, 5], 54: [1, 296]},
        {25: [2, 130], 54: [2, 130], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 98], 6: [2, 98], 25: [2, 98], 26: [2, 98], 49: [2, 98], 54: [2, 98], 57: [2, 98], 72: [2, 98], 77: [2, 98], 85: [2, 98], 90: [2, 98], 92: [2, 98], 101: [2, 98], 103: [2, 98], 104: [2, 98], 105: [2, 98], 109: [2, 98], 117: [2, 98], 125: [2, 98], 127: [2, 98], 128: [2, 98], 131: [2, 98], 132: [2, 98], 133: [2, 98], 134: [2, 98], 135: [2, 98], 136: [2, 98]},
        {1: [2, 101], 5: 297, 6: [2, 101], 25: [1, 5], 26: [2, 101], 49: [2, 101], 54: [2, 101], 57: [2, 101], 72: [2, 101], 77: [2, 101], 85: [2, 101], 90: [2, 101], 92: [2, 101], 101: [2, 101], 102: 87, 103: [1, 65], 104: [2, 101], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 101], 125: [2, 101], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {101: [1, 298]},
        {90: [1, 299], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 115], 6: [2, 115], 25: [2, 115], 26: [2, 115], 40: [2, 115], 49: [2, 115], 54: [2, 115], 57: [2, 115], 66: [2, 115], 67: [2, 115], 68: [2, 115], 70: [2, 115], 72: [2, 115], 73: [2, 115], 77: [2, 115], 83: [2, 115], 84: [2, 115], 85: [2, 115], 90: [2, 115], 92: [2, 115], 101: [2, 115], 103: [2, 115], 104: [2, 115], 105: [2, 115], 109: [2, 115], 115: [2, 115], 116: [2, 115], 117: [2, 115], 125: [2, 115], 127: [2, 115], 128: [2, 115], 131: [2, 115], 132: [2, 115], 133: [2, 115], 134: [2, 115], 135: [2, 115], 136: [2, 115]},
        {8: 200, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 93: 300, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 200, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 25: [1, 146], 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 60: 147, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 86: 301, 87: [1, 58], 88: [1, 59], 89: [1, 57], 93: 145, 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [2, 124], 25: [2, 124], 26: [2, 124], 54: [2, 124], 85: [2, 124], 90: [2, 124]},
        {6: [1, 266], 25: [1, 267], 26: [1, 302]},
        {1: [2, 141], 6: [2, 141], 25: [2, 141], 26: [2, 141], 49: [2, 141], 54: [2, 141], 57: [2, 141], 72: [2, 141], 77: [2, 141], 85: [2, 141], 90: [2, 141], 92: [2, 141], 101: [2, 141], 102: 87, 103: [1, 65], 104: [2, 141], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 141], 125: [2, 141], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 143], 6: [2, 143], 25: [2, 143], 26: [2, 143], 49: [2, 143], 54: [2, 143], 57: [2, 143], 72: [2, 143], 77: [2, 143], 85: [2, 143], 90: [2, 143], 92: [2, 143], 101: [2, 143], 102: 87, 103: [1, 65], 104: [2, 143], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 117: [2, 143], 125: [2, 143], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {115: [2, 162], 116: [2, 162]},
        {8: 303, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 304, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 305, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 89], 6: [2, 89], 25: [2, 89], 26: [2, 89], 40: [2, 89], 49: [2, 89], 54: [2, 89], 57: [2, 89], 66: [2, 89], 67: [2, 89], 68: [2, 89], 70: [2, 89], 72: [2, 89], 73: [2, 89], 77: [2, 89], 83: [2, 89], 84: [2, 89], 85: [2, 89], 90: [2, 89], 92: [2, 89], 101: [2, 89], 103: [2, 89], 104: [2, 89], 105: [2, 89], 109: [2, 89], 115: [2, 89], 116: [2, 89], 117: [2, 89], 125: [2, 89], 127: [2, 89], 128: [2, 89], 131: [2, 89], 132: [2, 89], 133: [2, 89], 134: [2, 89], 135: [2, 89], 136: [2, 89]},
        {11: 168, 27: 169, 28: [1, 73], 29: 170, 30: [1, 71], 31: [1, 72], 41: 306, 42: 167, 44: 171, 46: [1, 46], 88: [1, 113]},
        {6: [2, 90], 11: 168, 25: [2, 90], 26: [2, 90], 27: 169, 28: [1, 73], 29: 170, 30: [1, 71], 31: [1, 72], 41: 166, 42: 167, 44: 171, 46: [1, 46], 54: [2, 90], 76: 307, 88: [1, 113]},
        {6: [2, 92], 25: [2, 92], 26: [2, 92], 54: [2, 92], 77: [2, 92]},
        {6: [2, 40], 25: [2, 40], 26: [2, 40], 54: [2, 40], 77: [2, 40], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {8: 308, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {72: [2, 119], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 38], 6: [2, 38], 25: [2, 38], 26: [2, 38], 49: [2, 38], 54: [2, 38], 57: [2, 38], 72: [2, 38], 77: [2, 38], 85: [2, 38], 90: [2, 38], 92: [2, 38], 101: [2, 38], 103: [2, 38], 104: [2, 38], 105: [2, 38], 109: [2, 38], 117: [2, 38], 125: [2, 38], 127: [2, 38], 128: [2, 38], 131: [2, 38], 132: [2, 38], 133: [2, 38], 134: [2, 38], 135: [2, 38], 136: [2, 38]},
        {1: [2, 110], 6: [2, 110], 25: [2, 110], 26: [2, 110], 49: [2, 110], 54: [2, 110], 57: [2, 110], 66: [2, 110], 67: [2, 110], 68: [2, 110], 70: [2, 110], 72: [2, 110], 73: [2, 110], 77: [2, 110], 83: [2, 110], 84: [2, 110], 85: [2, 110], 90: [2, 110], 92: [2, 110], 101: [2, 110], 103: [2, 110], 104: [2, 110], 105: [2, 110], 109: [2, 110], 117: [2, 110], 125: [2, 110], 127: [2, 110], 128: [2, 110], 131: [2, 110], 132: [2, 110], 133: [2, 110], 134: [2, 110], 135: [2, 110], 136: [2, 110]},
        {1: [2, 49], 6: [2, 49], 25: [2, 49], 26: [2, 49], 49: [2, 49], 54: [2, 49], 57: [2, 49], 72: [2, 49], 77: [2, 49], 85: [2, 49], 90: [2, 49], 92: [2, 49], 101: [2, 49], 103: [2, 49], 104: [2, 49], 105: [2, 49], 109: [2, 49], 117: [2, 49], 125: [2, 49], 127: [2, 49], 128: [2, 49], 131: [2, 49], 132: [2, 49], 133: [2, 49], 134: [2, 49], 135: [2, 49], 136: [2, 49]},
        {6: [2, 58], 25: [2, 58], 26: [2, 58], 49: [2, 58], 54: [2, 58]},
        {6: [2, 53], 25: [2, 53], 26: [2, 53], 53: 309, 54: [1, 202]},
        {1: [2, 200], 6: [2, 200], 25: [2, 200], 26: [2, 200], 49: [2, 200], 54: [2, 200], 57: [2, 200], 72: [2, 200], 77: [2, 200], 85: [2, 200], 90: [2, 200], 92: [2, 200], 101: [2, 200], 103: [2, 200], 104: [2, 200], 105: [2, 200], 109: [2, 200], 117: [2, 200], 125: [2, 200], 127: [2, 200], 128: [2, 200], 131: [2, 200], 132: [2, 200], 133: [2, 200], 134: [2, 200], 135: [2, 200], 136: [2, 200]},
        {1: [2, 179], 6: [2, 179], 25: [2, 179], 26: [2, 179], 49: [2, 179], 54: [2, 179], 57: [2, 179], 72: [2, 179], 77: [2, 179], 85: [2, 179], 90: [2, 179], 92: [2, 179], 101: [2, 179], 103: [2, 179], 104: [2, 179], 105: [2, 179], 109: [2, 179], 117: [2, 179], 120: [2, 179], 125: [2, 179], 127: [2, 179], 128: [2, 179], 131: [2, 179], 132: [2, 179], 133: [2, 179], 134: [2, 179], 135: [2, 179], 136: [2, 179]},
        {1: [2, 135], 6: [2, 135], 25: [2, 135], 26: [2, 135], 49: [2, 135], 54: [2, 135], 57: [2, 135], 72: [2, 135], 77: [2, 135], 85: [2, 135], 90: [2, 135], 92: [2, 135], 101: [2, 135], 103: [2, 135], 104: [2, 135], 105: [2, 135], 109: [2, 135], 117: [2, 135], 125: [2, 135], 127: [2, 135], 128: [2, 135], 131: [2, 135], 132: [2, 135], 133: [2, 135], 134: [2, 135], 135: [2, 135], 136: [2, 135]},
        {1: [2, 136], 6: [2, 136], 25: [2, 136], 26: [2, 136], 49: [2, 136], 54: [2, 136], 57: [2, 136], 72: [2, 136], 77: [2, 136], 85: [2, 136], 90: [2, 136], 92: [2, 136], 97: [2, 136], 101: [2, 136], 103: [2, 136], 104: [2, 136], 105: [2, 136], 109: [2, 136], 117: [2, 136], 125: [2, 136], 127: [2, 136], 128: [2, 136], 131: [2, 136], 132: [2, 136], 133: [2, 136], 134: [2, 136], 135: [2, 136], 136: [2, 136]},
        {1: [2, 170], 6: [2, 170], 25: [2, 170], 26: [2, 170], 49: [2, 170], 54: [2, 170], 57: [2, 170], 72: [2, 170], 77: [2, 170], 85: [2, 170], 90: [2, 170], 92: [2, 170], 101: [2, 170], 103: [2, 170], 104: [2, 170], 105: [2, 170], 109: [2, 170], 117: [2, 170], 125: [2, 170], 127: [2, 170], 128: [2, 170], 131: [2, 170], 132: [2, 170], 133: [2, 170], 134: [2, 170], 135: [2, 170], 136: [2, 170]},
        {5: 310, 25: [1, 5]},
        {26: [1, 311]},
        {6: [1, 312], 26: [2, 176], 120: [2, 176], 122: [2, 176]},
        {8: 313, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {1: [2, 102], 6: [2, 102], 25: [2, 102], 26: [2, 102], 49: [2, 102], 54: [2, 102], 57: [2, 102], 72: [2, 102], 77: [2, 102], 85: [2, 102], 90: [2, 102], 92: [2, 102], 101: [2, 102], 103: [2, 102], 104: [2, 102], 105: [2, 102], 109: [2, 102], 117: [2, 102], 125: [2, 102], 127: [2, 102], 128: [2, 102], 131: [2, 102], 132: [2, 102], 133: [2, 102], 134: [2, 102], 135: [2, 102], 136: [2, 102]},
        {1: [2, 139], 6: [2, 139], 25: [2, 139], 26: [2, 139], 49: [2, 139], 54: [2, 139], 57: [2, 139], 66: [2, 139], 67: [2, 139], 68: [2, 139], 70: [2, 139], 72: [2, 139], 73: [2, 139], 77: [2, 139], 83: [2, 139], 84: [2, 139], 85: [2, 139], 90: [2, 139], 92: [2, 139], 101: [2, 139], 103: [2, 139], 104: [2, 139], 105: [2, 139], 109: [2, 139], 117: [2, 139], 125: [2, 139], 127: [2, 139], 128: [2, 139], 131: [2, 139], 132: [2, 139], 133: [2, 139], 134: [2, 139], 135: [2, 139], 136: [2, 139]},
        {1: [2, 118], 6: [2, 118], 25: [2, 118], 26: [2, 118], 49: [2, 118], 54: [2, 118], 57: [2, 118], 66: [2, 118], 67: [2, 118], 68: [2, 118], 70: [2, 118], 72: [2, 118], 73: [2, 118], 77: [2, 118], 83: [2, 118], 84: [2, 118], 85: [2, 118], 90: [2, 118], 92: [2, 118], 101: [2, 118], 103: [2, 118], 104: [2, 118], 105: [2, 118], 109: [2, 118], 117: [2, 118], 125: [2, 118], 127: [2, 118], 128: [2, 118], 131: [2, 118], 132: [2, 118], 133: [2, 118], 134: [2, 118], 135: [2, 118], 136: [2, 118]},
        {6: [2, 125], 25: [2, 125], 26: [2, 125], 54: [2, 125], 85: [2, 125], 90: [2, 125]},
        {6: [2, 53], 25: [2, 53], 26: [2, 53], 53: 314, 54: [1, 226]},
        {6: [2, 126], 25: [2, 126], 26: [2, 126], 54: [2, 126], 85: [2, 126], 90: [2, 126]},
        {1: [2, 165], 6: [2, 165], 25: [2, 165], 26: [2, 165], 49: [2, 165], 54: [2, 165], 57: [2, 165], 72: [2, 165], 77: [2, 165], 85: [2, 165], 90: [2, 165], 92: [2, 165], 101: [2, 165], 102: 87, 103: [2, 165], 104: [2, 165], 105: [2, 165], 108: 88, 109: [2, 165], 110: 69, 117: [1, 315], 125: [2, 165], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 167], 6: [2, 167], 25: [2, 167], 26: [2, 167], 49: [2, 167], 54: [2, 167], 57: [2, 167], 72: [2, 167], 77: [2, 167], 85: [2, 167], 90: [2, 167], 92: [2, 167], 101: [2, 167], 102: 87, 103: [2, 167], 104: [1, 316], 105: [2, 167], 108: 88, 109: [2, 167], 110: 69, 117: [2, 167], 125: [2, 167], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 166], 6: [2, 166], 25: [2, 166], 26: [2, 166], 49: [2, 166], 54: [2, 166], 57: [2, 166], 72: [2, 166], 77: [2, 166], 85: [2, 166], 90: [2, 166], 92: [2, 166], 101: [2, 166], 102: 87, 103: [2, 166], 104: [2, 166], 105: [2, 166], 108: 88, 109: [2, 166], 110: 69, 117: [2, 166], 125: [2, 166], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [2, 93], 25: [2, 93], 26: [2, 93], 54: [2, 93], 77: [2, 93]},
        {6: [2, 53], 25: [2, 53], 26: [2, 53], 53: 317, 54: [1, 236]},
        {26: [1, 318], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [1, 247], 25: [1, 248], 26: [1, 319]},
        {26: [1, 320]},
        {1: [2, 173], 6: [2, 173], 25: [2, 173], 26: [2, 173], 49: [2, 173], 54: [2, 173], 57: [2, 173], 72: [2, 173], 77: [2, 173], 85: [2, 173], 90: [2, 173], 92: [2, 173], 101: [2, 173], 103: [2, 173], 104: [2, 173], 105: [2, 173], 109: [2, 173], 117: [2, 173], 125: [2, 173], 127: [2, 173], 128: [2, 173], 131: [2, 173], 132: [2, 173], 133: [2, 173], 134: [2, 173], 135: [2, 173], 136: [2, 173]},
        {26: [2, 177], 120: [2, 177], 122: [2, 177]},
        {25: [2, 131], 54: [2, 131], 102: 87, 103: [1, 65], 105: [1, 66], 108: 88, 109: [1, 68], 110: 69, 125: [1, 86], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [1, 266], 25: [1, 267], 26: [1, 321]},
        {8: 322, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {8: 323, 9: 117, 10: 20, 11: 21, 12: [1, 22], 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 20: 15, 21: 16, 22: 17, 23: 18, 24: 19, 27: 62, 28: [1, 73], 29: 49, 30: [1, 71], 31: [1, 72], 32: 24, 33: [1, 50], 34: [1, 51], 35: [1, 52], 36: [1, 53], 37: [1, 54], 38: [1, 55], 39: 23, 44: 63, 45: [1, 45], 46: [1, 46], 47: [1, 29], 50: 30, 51: [1, 60], 52: [1, 61], 58: 47, 59: 48, 61: 36, 63: 25, 64: 26, 65: 27, 75: [1, 70], 78: [1, 43], 82: [1, 28], 87: [1, 58], 88: [1, 59], 89: [1, 57], 95: [1, 38], 99: [1, 44], 100: [1, 56], 102: 39, 103: [1, 65], 105: [1, 66], 106: 40, 107: [1, 67], 108: 41, 109: [1, 68], 110: 69, 118: [1, 42], 123: 37, 124: [1, 64], 126: [1, 31], 127: [1, 32], 128: [1, 33], 129: [1, 34], 130: [1, 35]},
        {6: [1, 277], 25: [1, 278], 26: [1, 324]},
        {6: [2, 41], 25: [2, 41], 26: [2, 41], 54: [2, 41], 77: [2, 41]},
        {6: [2, 59], 25: [2, 59], 26: [2, 59], 49: [2, 59], 54: [2, 59]},
        {1: [2, 171], 6: [2, 171], 25: [2, 171], 26: [2, 171], 49: [2, 171], 54: [2, 171], 57: [2, 171], 72: [2, 171], 77: [2, 171], 85: [2, 171], 90: [2, 171], 92: [2, 171], 101: [2, 171], 103: [2, 171], 104: [2, 171], 105: [2, 171], 109: [2, 171], 117: [2, 171], 125: [2, 171], 127: [2, 171], 128: [2, 171], 131: [2, 171], 132: [2, 171], 133: [2, 171], 134: [2, 171], 135: [2, 171], 136: [2, 171]},
        {6: [2, 127], 25: [2, 127], 26: [2, 127], 54: [2, 127], 85: [2, 127], 90: [2, 127]},
        {1: [2, 168], 6: [2, 168], 25: [2, 168], 26: [2, 168], 49: [2, 168], 54: [2, 168], 57: [2, 168], 72: [2, 168], 77: [2, 168], 85: [2, 168], 90: [2, 168], 92: [2, 168], 101: [2, 168], 102: 87, 103: [2, 168], 104: [2, 168], 105: [2, 168], 108: 88, 109: [2, 168], 110: 69, 117: [2, 168], 125: [2, 168], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {1: [2, 169], 6: [2, 169], 25: [2, 169], 26: [2, 169], 49: [2, 169], 54: [2, 169], 57: [2, 169], 72: [2, 169], 77: [2, 169], 85: [2, 169], 90: [2, 169], 92: [2, 169], 101: [2, 169], 102: 87, 103: [2, 169], 104: [2, 169], 105: [2, 169], 108: 88, 109: [2, 169], 110: 69, 117: [2, 169], 125: [2, 169], 127: [1, 80], 128: [1, 79], 131: [1, 78], 132: [1, 81], 133: [1, 82], 134: [1, 83], 135: [1, 84], 136: [1, 85]},
        {6: [2, 94], 25: [2, 94], 26: [2, 94], 54: [2, 94], 77: [2, 94]}
    ], defaultActions: {60: [2, 51], 61: [2, 52], 75: [2, 3], 94: [2, 108], 189: [2, 88]}, parseError: function (t, n) {
        throw new Error(t)
    }, parse: function (t) {
        function d(e) {
            r.length = r.length - 2 * e, i.length = i.length - e, s.length = s.length - e
        }

        function v() {
            var e;
            return e = n.lexer.lex() || 1, typeof e != "number" && (e = n.symbols_[e] || e), e
        }

        var n = this, r = [0], i = [null], s = [], o = this.table, u = "", a = 0, f = 0, l = 0, c = 2, h = 1;
        this.lexer.setInput(t), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, typeof this.lexer.yylloc == "undefined" && (this.lexer.yylloc = {});
        var p = this.lexer.yylloc;
        s.push(p), typeof this.yy.parseError == "function" && (this.parseError = this.yy.parseError);
        var m, g, y, b, w, E, S = {}, x, T, N, C;
        for (; ;) {
            y = r[r.length - 1], this.defaultActions[y] ? b = this.defaultActions[y] : (m == null && (m = v()), b = o[y] && o[y][m]);
            if (typeof b == "undefined" || !b.length || !b[0]) {
                if (!l) {
                    C = [];
                    for (x in o[y])this.terminals_[x] && x > 2 && C.push("'" + this.terminals_[x] + "'");
                    var k = "";
                    this.lexer.showPosition ? k = "Parse error on line " + (a + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + C.join(", ") + ", got '" + this.terminals_[m] + "'" : k = "Parse error on line " + (a + 1) + ": Unexpected " + (m == 1 ? "end of input" : "'" + (this.terminals_[m] || m) + "'"), this.parseError(k, {text: this.lexer.match, token: this.terminals_[m] || m, line: this.lexer.yylineno, loc: p, expected: C})
                }
                if (l == 3) {
                    if (m == h)throw new Error(k || "Parsing halted.");
                    f = this.lexer.yyleng, u = this.lexer.yytext, a = this.lexer.yylineno, p = this.lexer.yylloc, m = v()
                }
                for (; ;) {
                    if (c.toString()in o[y])break;
                    if (y == 0)throw new Error(k || "Parsing halted.");
                    d(1), y = r[r.length - 1]
                }
                g = m, m = c, y = r[r.length - 1], b = o[y] && o[y][c], l = 3
            }
            if (b[0]instanceof Array && b.length > 1)throw new Error("Parse Error: multiple actions possible at state: " + y + ", token: " + m);
            switch (b[0]) {
                case 1:
                    r.push(m), i.push(this.lexer.yytext), s.push(this.lexer.yylloc), r.push(b[1]), m = null, g ? (m = g, g = null) : (f = this.lexer.yyleng, u = this.lexer.yytext, a = this.lexer.yylineno, p = this.lexer.yylloc, l > 0 && l--);
                    break;
                case 2:
                    T = this.productions_[b[1]][1], S.$ = i[i.length - T], S._$ = {first_line: s[s.length - (T || 1)].first_line, last_line: s[s.length - 1].last_line, first_column: s[s.length - (T || 1)].first_column, last_column: s[s.length - 1].last_column}, E = this.performAction.call(S, u, f, a, this.yy, b[1], i, s);
                    if (typeof E != "undefined")return E;
                    T && (r = r.slice(0, -1 * T * 2), i = i.slice(0, -1 * T), s = s.slice(0, -1 * T)), r.push(this.productions_[b[1]][0]), i.push(S.$), s.push(S._$), N = o[r[r.length - 2]][r[r.length - 1]], r.push(N);
                    break;
                case 3:
                    return!0
            }
        }
        return!0
    }};
    undefined, n.exports = r
}), define("ace/mode/coffee/nodes", ["require", "exports", "module", "ace/mode/coffee/scope", "ace/mode/coffee/lexer", "ace/mode/coffee/helpers"], function (e, t, n) {
    var r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I, q, R, U, z, W, X, V, $, J, K, Q, G, Y, Z, et, tt, nt, rt, it, st, ot, ut, at, ft, lt, ct, ht, pt = {}.hasOwnProperty, dt = function (e, t) {
        function r() {
            this.constructor = e
        }

        for (var n in t)pt.call(t, n) && (e[n] = t[n]);
        return r.prototype = t.prototype, e.prototype = new r, e.__super__ = t.prototype, e
    }, vt = [].indexOf || function (e) {
        for (var t = 0, n = this.length; t < n; t++)if (t in this && this[t] === e)return t;
        return-1
    };
    R = e("./scope").Scope, ct = e("./lexer"), B = ct.RESERVED, q = ct.STRICT_PROSCRIBED, ht = e("./helpers"), Z = ht.compact, rt = ht.flatten, nt = ht.extend, st = ht.merge, et = ht.del, at = ht.starts, tt = ht.ends, it = ht.last, ut = ht.some, t.extend = nt, Y = function () {
        return!0
    }, M = function () {
        return!1
    }, V = function () {
        return this
    }, O = function () {
        return this.negated = !this.negated, this
    }, t.Base = o = function () {
        function e() {
        }

        return e.prototype.compile = function (e, t) {
            var n;
            return e = nt({}, e), t && (e.level = t), n = this.unfoldSoak(e) || this, n.tab = e.indent, e.level === k || !n.isStatement(e) ? n.compileNode(e) : n.compileClosure(e)
        }, e.prototype.compileClosure = function (e) {
            if (this.jumps())throw SyntaxError("cannot use a pure statement in an expression.");
            return e.sharedScope = !0, l.wrap(this).compileNode(e)
        }, e.prototype.cache = function (e, t, n) {
            var r, i;
            return this.isComplex() ? (r = new L(n || e.scope.freeVariable("ref")), i = new s(r, this), t ? [i.compile(e, t), r.value] : [i, r]) : (r = t ? this.compile(e, t) : this, [r, r])
        }, e.prototype.compileLoopReference = function (e, t) {
            var n, r;
            return n = r = this.compile(e, T), -Infinity < +n && +n < Infinity || m.test(n) && e.scope.check(n, !0) || (n = "" + (r = e.scope.freeVariable(t)) + " = " + n), [n, r]
        }, e.prototype.makeReturn = function (e) {
            var t;
            return t = this.unwrapAll(), e ? new a(new L("" + e + ".push"), [t]) : new F(t)
        }, e.prototype.contains = function (e) {
            var t;
            return t = !1, this.traverseChildren(!1, function (n) {
                if (e(n))return t = !0, !1
            }), t
        }, e.prototype.containsType = function (e) {
            return this instanceof e || this.contains(function (t) {
                return t instanceof e
            })
        }, e.prototype.lastNonComment = function (e) {
            var t;
            t = e.length;
            while (t--)if (!(e[t]instanceof h))return e[t];
            return null
        }, e.prototype.toString = function (e, t) {
            var n;
            return e == null && (e = ""), t == null && (t = this.constructor.name), n = "\n" + e + t, this.soak && (n += "?"), this.eachChild(function (t) {
                return n += t.toString(e + X)
            }), n
        }, e.prototype.eachChild = function (e) {
            var t, n, r, i, s, o, u, a;
            if (!this.children)return this;
            u = this.children;
            for (r = 0, s = u.length; r < s; r++) {
                t = u[r];
                if (this[t]) {
                    a = rt([this[t]]);
                    for (i = 0, o = a.length; i < o; i++) {
                        n = a[i];
                        if (e(n) === !1)return this
                    }
                }
            }
            return this
        }, e.prototype.traverseChildren = function (e, t) {
            return this.eachChild(function (n) {
                return t(n) === !1 ? !1 : n.traverseChildren(e, t)
            })
        }, e.prototype.invert = function () {
            return new D("!", this)
        }, e.prototype.unwrapAll = function () {
            var e;
            e = this;
            while (e !== (e = e.unwrap()))continue;
            return e
        }, e.prototype.children = [], e.prototype.isStatement = M, e.prototype.jumps = M, e.prototype.isComplex = Y, e.prototype.isChainable = M, e.prototype.isAssignable = M, e.prototype.unwrap = V, e.prototype.unfoldSoak = M, e.prototype.assigns = M, e
    }(), t.Block = u = function (e) {
        function t(e) {
            this.expressions = Z(rt(e || []))
        }

        return dt(t, e), t.prototype.children = ["expressions"], t.prototype.push = function (e) {
            return this.expressions.push(e), this
        }, t.prototype.pop = function () {
            return this.expressions.pop()
        }, t.prototype.unshift = function (e) {
            return this.expressions.unshift(e), this
        }, t.prototype.unwrap = function () {
            return this.expressions.length === 1 ? this.expressions[0] : this
        }, t.prototype.isEmpty = function () {
            return!this.expressions.length
        }, t.prototype.isStatement = function (e) {
            var t, n, r, i;
            i = this.expressions;
            for (n = 0, r = i.length; n < r; n++) {
                t = i[n];
                if (t.isStatement(e))return!0
            }
            return!1
        }, t.prototype.jumps = function (e) {
            var t, n, r, i;
            i = this.expressions;
            for (n = 0, r = i.length; n < r; n++) {
                t = i[n];
                if (t.jumps(e))return t
            }
        }, t.prototype.makeReturn = function (e) {
            var t, n;
            n = this.expressions.length;
            while (n--) {
                t = this.expressions[n];
                if (!(t instanceof h)) {
                    this.expressions[n] = t.makeReturn(e), t instanceof F && !t.expression && this.expressions.splice(n, 1);
                    break
                }
            }
            return this
        }, t.prototype.compile = function (e, n) {
            return e == null && (e = {}), e.scope ? t.__super__.compile.call(this, e, n) : this.compileRoot(e)
        }, t.prototype.compileNode = function (e) {
            var n, r, i, s, o, u, a;
            this.tab = e.indent, s = e.level === k, r = [], a = this.expressions;
            for (o = 0, u = a.length; o < u; o++)i = a[o], i = i.unwrapAll(), i = i.unfoldSoak(e) || i, i instanceof t ? r.push(i.compileNode(e)) : s ? (i.front = !0, n = i.compile(e), i.isStatement(e) || (n = "" + this.tab + n + ";", i instanceof L && (n = "" + n + "\n")), r.push(n)) : r.push(i.compile(e, T));
            return s ? this.spaced ? "\n" + r.join("\n\n") + "\n" : r.join("\n") : (n = r.join(", ") || "void 0", r.length > 1 && e.level >= T ? "(" + n + ")" : n)
        }, t.prototype.compileRoot = function (e) {
            var t, n, r, i, s, o;
            return e.indent = e.bare ? "" : X, e.scope = new R(null, this, null), e.level = k, this.spaced = !0, i = "", e.bare || (s = function () {
                var e, t, i, s;
                i = this.expressions, s = [];
                for (r = e = 0, t = i.length; e < t; r = ++e) {
                    n = i[r];
                    if (!(n.unwrap()instanceof h))break;
                    s.push(n)
                }
                return s
            }.call(this), o = this.expressions.slice(s.length), this.expressions = s, s.length && (i = "" + this.compileNode(st(e, {indent: ""})) + "\n"), this.expressions = o), t = this.compileWithDeclarations(e), e.bare ? t : "" + i + "(function() {\n" + t + "\n}).call(this);\n"
        }, t.prototype.compileWithDeclarations = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, p, d, v;
            n = o = "", p = this.expressions;
            for (s = l = 0, c = p.length; l < c; s = ++l) {
                i = p[s], i = i.unwrap();
                if (!(i instanceof h || i instanceof L))break
            }
            e = st(e, {level: k}), s && (u = this.expressions.splice(s, 9e9), d = [this.spaced, !1], f = d[0], this.spaced = d[1], v = [this.compileNode(e), f], n = v[0], this.spaced = v[1], this.expressions = u), o = this.compileNode(e), a = e.scope;
            if (a.expressions === this) {
                r = e.scope.hasDeclarations(), t = a.hasAssignments;
                if (r || t)s && (n += "\n"), n += "" + this.tab + "var ", r && (n += a.declaredVariables().join(", ")), t && (r && (n += ",\n" + (this.tab + X)), n += a.assignedVariables().join(",\n" + (this.tab + X))), n += ";\n"
            }
            return n + o
        }, t.wrap = function (e) {
            return e.length === 1 && e[0]instanceof t ? e[0] : new t(e)
        }, t
    }(o), t.Literal = L = function (e) {
        function t(e) {
            this.value = e
        }

        return dt(t, e), t.prototype.makeReturn = function () {
            return this.isStatement() ? this : t.__super__.makeReturn.apply(this, arguments)
        }, t.prototype.isAssignable = function () {
            return m.test(this.value)
        }, t.prototype.isStatement = function () {
            var e;
            return(e = this.value) === "break" || e === "continue" || e === "debugger"
        }, t.prototype.isComplex = M, t.prototype.assigns = function (e) {
            return e === this.value
        }, t.prototype.jumps = function (e) {
            if (this.value === "break" && !((e != null ? e.loop : void 0) || (e != null ? e.block : void 0)))return this;
            if (this.value === "continue" && (e != null ? !e.loop : !void 0))return this
        }, t.prototype.compileNode = function (e) {
            var t, n;
            return t = this.value === "this" ? ((n = e.scope.method) != null ? n.bound : void 0) ? e.scope.method.context : this.value : this.value.reserved ? '"' + this.value + '"' : this.value, this.isStatement() ? "" + this.tab + t + ";" : t
        }, t.prototype.toString = function () {
            return' "' + this.value + '"'
        }, t
    }(o), t.Undefined = function (e) {
        function t() {
            return t.__super__.constructor.apply(this, arguments)
        }

        return dt(t, e), t.prototype.isAssignable = M, t.prototype.isComplex = M, t.prototype.compileNode = function (e) {
            return e.level >= S ? "(void 0)" : "void 0"
        }, t
    }(o), t.Null = function (e) {
        function t() {
            return t.__super__.constructor.apply(this, arguments)
        }

        return dt(t, e), t.prototype.isAssignable = M, t.prototype.isComplex = M, t.prototype.compileNode = function () {
            return"null"
        }, t
    }(o), t.Bool = function (e) {
        function t(e) {
            this.val = e
        }

        return dt(t, e), t.prototype.isAssignable = M, t.prototype.isComplex = M, t.prototype.compileNode = function () {
            return this.val
        }, t
    }(o), t.Return = F = function (e) {
        function t(e) {
            e && !e.unwrap().isUndefined && (this.expression = e)
        }

        return dt(t, e), t.prototype.children = ["expression"], t.prototype.isStatement = Y, t.prototype.makeReturn = V, t.prototype.jumps = V, t.prototype.compile = function (e, n) {
            var r, i;
            return r = (i = this.expression) != null ? i.makeReturn() : void 0, !r || r instanceof t ? t.__super__.compile.call(this, e, n) : r.compile(e, n)
        }, t.prototype.compileNode = function (e) {
            return this.tab + ("return" + [this.expression ? " " + this.expression.compile(e, C) : void 0] + ";")
        }, t
    }(o), t.Value = Q = function (e) {
        function t(e, n, r) {
            return!n && e instanceof t ? e : (this.base = e, this.properties = n || [], r && (this[r] = !0), this)
        }

        return dt(t, e), t.prototype.children = ["base", "properties"], t.prototype.add = function (e) {
            return this.properties = this.properties.concat(e), this
        }, t.prototype.hasProperties = function () {
            return!!this.properties.length
        }, t.prototype.isArray = function () {
            return!this.properties.length && this.base instanceof i
        }, t.prototype.isComplex = function () {
            return this.hasProperties() || this.base.isComplex()
        }, t.prototype.isAssignable = function () {
            return this.hasProperties() || this.base.isAssignable()
        }, t.prototype.isSimpleNumber = function () {
            return this.base instanceof L && I.test(this.base.value)
        }, t.prototype.isString = function () {
            return this.base instanceof L && y.test(this.base.value)
        }, t.prototype.isAtomic = function () {
            var e, t, n, r;
            r = this.properties.concat(this.base);
            for (t = 0, n = r.length; t < n; t++) {
                e = r[t];
                if (e.soak || e instanceof a)return!1
            }
            return!0
        }, t.prototype.isStatement = function (e) {
            return!this.properties.length && this.base.isStatement(e)
        }, t.prototype.assigns = function (e) {
            return!this.properties.length && this.base.assigns(e)
        }, t.prototype.jumps = function (e) {
            return!this.properties.length && this.base.jumps(e)
        }, t.prototype.isObject = function (e) {
            return this.properties.length ? !1 : this.base instanceof _ && (!e || this.base.generated)
        }, t.prototype.isSplice = function () {
            return it(this.properties)instanceof U
        }, t.prototype.unwrap = function () {
            return this.properties.length ? this : this.base
        }, t.prototype.cacheReference = function (e) {
            var n, r, i, o;
            return i = it(this.properties), this.properties.length < 2 && !this.base.isComplex() && (i != null ? !i.isComplex() : !void 0) ? [this, this] : (n = new t(this.base, this.properties.slice(0, -1)), n.isComplex() && (r = new L(e.scope.freeVariable("base")), n = new t(new H(new s(r, n)))), i ? (i.isComplex() && (o = new L(e.scope.freeVariable("name")), i = new E(new s(o, i.index)), o = new E(o)), [n.add(i), new t(r || n.base, [o || i])]) : [n, r])
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i, s;
            this.base.front = this.front, r = this.properties, t = this.base.compile(e, r.length ? S : null), (this.base instanceof H || r.length) && I.test(t) && (t = "" + t + ".");
            for (i = 0, s = r.length; i < s; i++)n = r[i], t += n.compile(e);
            return t
        }, t.prototype.unfoldSoak = function (e) {
            var n, r = this;
            return this.unfoldedSoak != null ? this.unfoldedSoak : (n = function () {
                var n, i, o, u, a, f, l, c, h;
                if (o = r.base.unfoldSoak(e))return Array.prototype.push.apply(o.body.properties, r.properties), o;
                h = r.properties;
                for (i = l = 0, c = h.length; l < c; i = ++l) {
                    u = h[i];
                    if (!u.soak)continue;
                    return u.soak = !1, n = new t(r.base, r.properties.slice(0, i)), f = new t(r.base, r.properties.slice(i)), n.isComplex() && (a = new L(e.scope.freeVariable("ref")), n = new H(new s(a, n)), f.base = a), new b(new p(n), f, {soak: !0})
                }
                return null
            }(), this.unfoldedSoak = n || !1)
        }, t
    }(o), t.Comment = h = function (e) {
        function t(e) {
            this.comment = e
        }

        return dt(t, e), t.prototype.isStatement = Y, t.prototype.makeReturn = V, t.prototype.compileNode = function (e, t) {
            var n;
            return n = "/*" + ot(this.comment, this.tab) + ("\n" + this.tab + "*/\n"), (t || e.level) === k && (n = e.indent + n), n
        }, t
    }(o), t.Call = a = function (e) {
        function t(e, t, n) {
            this.args = t != null ? t : [], this.soak = n, this.isNew = !1, this.isSuper = e === "super", this.variable = this.isSuper ? null : e
        }

        return dt(t, e), t.prototype.children = ["variable", "args"], t.prototype.newInstance = function () {
            var e, n;
            return e = ((n = this.variable) != null ? n.base : void 0) || this.variable, e instanceof t && !e.isNew ? e.newInstance() : this.isNew = !0, this
        }, t.prototype.superReference = function (e) {
            var t, n, i;
            n = e.scope.namedMethod();
            if (!n)throw SyntaxError("cannot call super outside of a function.");
            i = n.name;
            if (i == null)throw SyntaxError("cannot call super on an anonymous function.");
            return n.klass ? (t = [new r(new L("__super__"))], n["static"] && t.push(new r(new L("constructor"))), t.push(new r(new L(i))), (new Q(new L(n.klass), t)).compile(e)) : "" + i + ".__super__.constructor"
        }, t.prototype.superThis = function (e) {
            var t;
            return t = e.scope.method, t && !t.klass && t.context || "this"
        }, t.prototype.unfoldSoak = function (e) {
            var n, r, i, s, o, u, a, f, l;
            if (this.soak) {
                if (this.variable) {
                    if (r = ft(e, this, "variable"))return r;
                    f = (new Q(this.variable)).cacheReference(e), i = f[0], o = f[1]
                } else i = new L(this.superReference(e)), o = new Q(i);
                return o = new t(o, this.args), o.isNew = this.isNew, i = new L("typeof " + i.compile(e) + ' === "function"'), new b(i, new Q(o), {soak: !0})
            }
            n = this, s = [];
            for (; ;) {
                if (n.variable instanceof t) {
                    s.push(n), n = n.variable;
                    continue
                }
                if (!(n.variable instanceof Q))break;
                s.push(n);
                if (!((n = n.variable.base)instanceof t))break
            }
            l = s.reverse();
            for (u = 0, a = l.length; u < a; u++)n = l[u], r && (n.variable instanceof t ? n.variable = r : n.variable.base = r), r = ft(e, n, "variable");
            return r
        }, t.prototype.filterImplicitObjects = function (e) {
            var t, n, r, i, o, u, a, f, l, c;
            n = [];
            for (u = 0, f = e.length; u < f; u++) {
                t = e[u];
                if (!((typeof t.isObject == "function" ? t.isObject() : void 0) && t.base.generated)) {
                    n.push(t);
                    continue
                }
                r = null, c = t.base.properties;
                for (a = 0, l = c.length; a < l; a++)i = c[a], i instanceof s || i instanceof h ? (r || n.push(r = new _(o = [], !0)), o.push(i)) : (n.push(i), r = null)
            }
            return n
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i;
            return(i = this.variable) != null && (i.front = this.front), (r = z.compileSplattedArray(e, this.args, !0)) ? this.compileSplat(e, r) : (n = this.filterImplicitObjects(this.args), n = function () {
                var r, i, s;
                s = [];
                for (r = 0, i = n.length; r < i; r++)t = n[r], s.push(t.compile(e, T));
                return s
            }().join(", "), this.isSuper ? this.superReference(e) + (".call(" + this.superThis(e) + (n && ", " + n) + ")") : (this.isNew ? "new " : "") + this.variable.compile(e, S) + ("(" + n + ")"))
        }, t.prototype.compileSuper = function (e, t) {
            return"" + this.superReference(t) + ".call(" + this.superThis(t) + (e.length ? ", " : "") + e + ")"
        }, t.prototype.compileSplat = function (e, t) {
            var n, r, i, s, o;
            return this.isSuper ? "" + this.superReference(e) + ".apply(" + this.superThis(e) + ", " + t + ")" : this.isNew ? (i = this.tab + X, "(function(func, args, ctor) {\n" + i + "ctor.prototype = func.prototype;\n" + i + "var child = new ctor, result = func.apply(child, args), t = typeof result;\n" + i + 'return t == "object" || t == "function" ? result || child : child;\n' + this.tab + "})(" + this.variable.compile(e, T) + ", " + t + ", function(){})") : (n = new Q(this.variable), (s = n.properties.pop()) && n.isComplex() ? (o = e.scope.freeVariable("ref"), r = "(" + o + " = " + n.compile(e, T) + ")" + s.compile(e)) : (r = n.compile(e, S), I.test(r) && (r = "(" + r + ")"), s ? (o = r, r += s.compile(e)) : o = "null"), "" + r + ".apply(" + o + ", " + t + ")")
        }, t
    }(o), t.Extends = d = function (e) {
        function t(e, t) {
            this.child = e, this.parent = t
        }

        return dt(t, e), t.prototype.children = ["child", "parent"], t.prototype.compile = function (e) {
            return(new a(new Q(new L(lt("extends"))), [this.child, this.parent])).compile(e)
        }, t
    }(o), t.Access = r = function (e) {
        function t(e, t) {
            this.name = e, this.name.asKey = !0, this.soak = t === "soak"
        }

        return dt(t, e), t.prototype.children = ["name"], t.prototype.compile = function (e) {
            var t;
            return t = this.name.compile(e), m.test(t) ? "." + t : "[" + t + "]"
        }, t.prototype.isComplex = M, t
    }(o), t.Index = E = function (e) {
        function t(e) {
            this.index = e
        }

        return dt(t, e), t.prototype.children = ["index"], t.prototype.compile = function (e) {
            return"[" + this.index.compile(e, C) + "]"
        }, t.prototype.isComplex = function () {
            return this.index.isComplex()
        }, t
    }(o), t.Range = j = function (e) {
        function t(e, t, n) {
            this.from = e, this.to = t, this.exclusive = n === "exclusive", this.equals = this.exclusive ? "" : "="
        }

        return dt(t, e), t.prototype.children = ["from", "to"], t.prototype.compileVariables = function (e) {
            var t, n, r, i, s;
            e = st(e, {top: !0}), n = this.from.cache(e, T), this.fromC = n[0], this.fromVar = n[1], r = this.to.cache(e, T), this.toC = r[0], this.toVar = r[1];
            if (t = et(e, "step"))i = t.cache(e, T), this.step = i[0], this.stepVar = i[1];
            s = [this.fromVar.match(I), this.toVar.match(I)], this.fromNum = s[0], this.toNum = s[1];
            if (this.stepVar)return this.stepNum = this.stepVar.match(I)
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d;
            return this.fromVar || this.compileVariables(e), e.index ? (u = this.fromNum && this.toNum, s = et(e, "index"), o = et(e, "name"), f = o && o !== s, h = "" + s + " = " + this.fromC, this.toC !== this.toVar && (h += ", " + this.toC), this.step !== this.stepVar && (h += ", " + this.step), p = ["" + s + " <" + this.equals, "" + s + " >" + this.equals], a = p[0], i = p[1], n = this.stepNum ? +this.stepNum > 0 ? "" + a + " " + this.toVar : "" + i + " " + this.toVar : u ? (d = [+this.fromNum, +this.toNum], r = d[0], c = d[1], d, r <= c ? "" + a + " " + c : "" + i + " " + c) : (t = "" + this.fromVar + " <= " + this.toVar, "" + t + " ? " + a + " " + this.toVar + " : " + i + " " + this.toVar), l = this.stepVar ? "" + s + " += " + this.stepVar : u ? f ? r <= c ? "++" + s : "--" + s : r <= c ? "" + s + "++" : "" + s + "--" : f ? "" + t + " ? ++" + s + " : --" + s : "" + t + " ? " + s + "++ : " + s + "--", f && (h = "" + o + " = " + h), f && (l = "" + o + " = " + l), "" + h + "; " + n + "; " + l) : this.compileArray(e)
        }, t.prototype.compileArray = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v;
            if (this.fromNum && this.toNum && Math.abs(this.fromNum - this.toNum) <= 20)return f = function () {
                v = [];
                for (var e = p = +this.fromNum, t = +this.toNum; p <= t ? e <= t : e >= t; p <= t ? e++ : e--)v.push(e);
                return v
            }.apply(this), this.exclusive && f.pop(), "[" + f.join(", ") + "]";
            o = this.tab + X, s = e.scope.freeVariable("i"), l = e.scope.freeVariable("results"), a = "\n" + o + l + " = [];", this.fromNum && this.toNum ? (e.index = s, n = this.compileNode(e)) : (c = "" + s + " = " + this.fromC + (this.toC !== this.toVar ? ", " + this.toC : ""), r = "" + this.fromVar + " <= " + this.toVar, n = "var " + c + "; " + r + " ? " + s + " <" + this.equals + " " + this.toVar + " : " + s + " >" + this.equals + " " + this.toVar + "; " + r + " ? " + s + "++ : " + s + "--"), u = "{ " + l + ".push(" + s + "); }\n" + o + "return " + l + ";\n" + e.indent, i = function (e) {
                return e != null ? e.contains(function (e) {
                    return e instanceof L && e.value === "arguments" && !e.asKey
                }) : void 0
            };
            if (i(this.from) || i(this.to))t = ", arguments";
            return"(function() {" + a + "\n" + o + "for (" + n + ")" + u + "}).apply(this" + (t != null ? t : "") + ")"
        }, t
    }(o), t.Slice = U = function (e) {
        function t(e) {
            this.range = e, t.__super__.constructor.call(this)
        }

        return dt(t, e), t.prototype.children = ["range"], t.prototype.compileNode = function (e) {
            var t, n, r, i, s, o;
            return o = this.range, i = o.to, n = o.from, r = n && n.compile(e, C) || "0", t = i && i.compile(e, C), i && (!!this.range.exclusive || +t !== -1) && (s = ", " + (this.range.exclusive ? t : I.test(t) ? "" + (+t + 1) : (t = i.compile(e, S), "+" + t + " + 1 || 9e9"))), ".slice(" + r + (s || "") + ")"
        }, t
    }(o), t.Obj = _ = function (e) {
        function t(e, t) {
            this.generated = t != null ? t : !1, this.objects = this.properties = e || []
        }

        return dt(t, e), t.prototype.children = ["properties"], t.prototype.compileNode = function (e) {
            var t, n, r, i, o, u, a, f, l, c, p;
            l = this.properties;
            if (!l.length)return this.front ? "({})" : "{}";
            if (this.generated)for (c = 0, p = l.length; c < p; c++) {
                u = l[c];
                if (u instanceof Q)throw new Error("cannot have an implicit value in an implicit object")
            }
            return n = e.indent += X, o = this.lastNonComment(this.properties), l = function () {
                var u, a, c;
                c = [];
                for (t = u = 0, a = l.length; u < a; t = ++u)f = l[t], i = t === l.length - 1 ? "" : f === o || f instanceof h ? "\n" : ",\n", r = f instanceof h ? "" : n, f instanceof Q && f["this"] && (f = new s(f.properties[0].name, f, "object")), f instanceof h || (f instanceof s || (f = new s(f, f, "object")), (f.variable.base || f.variable).asKey = !0), c.push(r + f.compile(e, k) + i);
                return c
            }(), l = l.join(""), a = "{" + (l && "\n" + l + "\n" + this.tab) + "}", this.front ? "(" + a + ")" : a
        }, t.prototype.assigns = function (e) {
            var t, n, r, i;
            i = this.properties;
            for (n = 0, r = i.length; n < r; n++) {
                t = i[n];
                if (t.assigns(e))return!0
            }
            return!1
        }, t
    }(o), t.Arr = i = function (e) {
        function t(e) {
            this.objects = e || []
        }

        return dt(t, e), t.prototype.children = ["objects"], t.prototype.filterImplicitObjects = a.prototype.filterImplicitObjects, t.prototype.compileNode = function (e) {
            var t, n, r;
            return this.objects.length ? (e.indent += X, r = this.filterImplicitObjects(this.objects), (t = z.compileSplattedArray(e, r)) ? t : (t = function () {
                var t, i, s;
                s = [];
                for (t = 0, i = r.length; t < i; t++)n = r[t], s.push(n.compile(e, T));
                return s
            }().join(", "), t.indexOf("\n") >= 0 ? "[\n" + e.indent + t + "\n" + this.tab + "]" : "[" + t + "]")) : "[]"
        }, t.prototype.assigns = function (e) {
            var t, n, r, i;
            i = this.objects;
            for (n = 0, r = i.length; n < r; n++) {
                t = i[n];
                if (t.assigns(e))return!0
            }
            return!1
        }, t
    }(o), t.Class = f = function (e) {
        function t(e, t, n) {
            this.variable = e, this.parent = t, this.body = n != null ? n : new u, this.boundFuncs = [], this.body.classBody = !0
        }

        return dt(t, e), t.prototype.children = ["variable", "parent", "body"], t.prototype.determineName = function () {
            var e, t;
            if (!this.variable)return null;
            e = (t = it(this.variable.properties)) ? t instanceof r && t.name.value : this.variable.base.value;
            if (vt.call(q, e) >= 0)throw SyntaxError("variable name may not be " + e);
            return e && (e = m.test(e) && e)
        }, t.prototype.setContext = function (e) {
            return this.body.traverseChildren(!1, function (t) {
                if (t.classBody)return!1;
                if (t instanceof L && t.value === "this")return t.value = e;
                if (t instanceof c) {
                    t.klass = e;
                    if (t.bound)return t.context = e
                }
            })
        }, t.prototype.addBoundFunctions = function (e) {
            var t, n, i, s, o, u;
            if (this.boundFuncs.length) {
                o = this.boundFuncs, u = [];
                for (i = 0, s = o.length; i < s; i++)t = o[i], n = (new Q(new L("this"), [new r(t)])).compile(e), u.push(this.ctor.body.unshift(new L("" + n + " = " + lt("bind") + "(" + n + ", this)")));
                return u
            }
        }, t.prototype.addProperties = function (e, t, n) {
            var i, o, u, a, f;
            return f = e.base.properties.slice(0), u = function () {
                var e;
                e = [];
                while (i = f.shift()) {
                    if (i instanceof s) {
                        o = i.variable.base, delete i.context, a = i.value;
                        if (o.value === "constructor") {
                            if (this.ctor)throw new Error("cannot define more than one constructor in a class");
                            if (a.bound)throw new Error("cannot define a constructor as a bound function");
                            a instanceof c ? i = this.ctor = a : (this.externalCtor = n.scope.freeVariable("class"), i = new s(new L(this.externalCtor), a))
                        } else i.variable["this"] ? (a["static"] = !0, a.bound && (a.context = t)) : (i.variable = new Q(new L(t), [new r(new L("prototype")), new r(o)]), a instanceof c && a.bound && (this.boundFuncs.push(o), a.bound = !1))
                    }
                    e.push(i)
                }
                return e
            }.call(this), Z(u)
        }, t.prototype.walkBody = function (e, n) {
            var r = this;
            return this.traverseChildren(!1, function (i) {
                var s, o, a, f, l, c;
                if (i instanceof t)return!1;
                if (i instanceof u) {
                    c = s = i.expressions;
                    for (o = f = 0, l = c.length; f < l; o = ++f)a = c[o], a instanceof Q && a.isObject(!0) && (s[o] = r.addProperties(a, e, n));
                    return i.expressions = s = rt(s)
                }
            })
        }, t.prototype.hoistDirectivePrologue = function () {
            var e, t, n;
            t = 0, e = this.body.expressions;
            while ((n = e[t]) && n instanceof h || n instanceof Q && n.isString())++t;
            return this.directives = e.splice(0, t)
        }, t.prototype.ensureConstructor = function (e) {
            return this.ctor || (this.ctor = new c, this.parent && this.ctor.body.push(new L("" + e + ".__super__.constructor.apply(this, arguments)")), this.externalCtor && this.ctor.body.push(new L("" + this.externalCtor + ".apply(this, arguments)")), this.ctor.body.makeReturn(), this.body.expressions.unshift(this.ctor)), this.ctor.ctor = this.ctor.name = e, this.ctor.klass = null, this.ctor.noReturn = !0
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i, o, u, a;
            return n = this.determineName(), o = n || "_Class", o.reserved && (o = "_" + o), i = new L(o), this.hoistDirectivePrologue(), this.setContext(o), this.walkBody(o, e), this.ensureConstructor(o), this.body.spaced = !0, this.ctor instanceof c || this.body.expressions.unshift(this.ctor), this.body.expressions.push(i), (a = this.body.expressions).unshift.apply(a, this.directives), this.addBoundFunctions(e), t = l.wrap(this.body), this.parent && (this.superClass = new L(e.scope.freeVariable("super", !1)), this.body.expressions.unshift(new d(i, this.superClass)), t.args.push(this.parent), u = t.variable.params || t.variable.base.params, u.push(new P(this.superClass))), r = new H(t, !0), this.variable && (r = new s(this.variable, r)), r.compile(e)
        }, t
    }(o), t.Assign = s = function (e) {
        function t(e, t, n, r) {
            var i, s, o;
            this.variable = e, this.value = t, this.context = n, this.param = r && r.param, this.subpattern = r && r.subpattern, i = (o = s = this.variable.unwrapAll().value, vt.call(q, o) >= 0);
            if (i && this.context !== "object")throw SyntaxError('variable name may not be "' + s + '"')
        }

        return dt(t, e), t.prototype.children = ["variable", "value"], t.prototype.isStatement = function (e) {
            return(e != null ? e.level : void 0) === k && this.context != null && vt.call(this.context, "?") >= 0
        }, t.prototype.assigns = function (e) {
            return this[this.context === "object" ? "value" : "variable"].assigns(e)
        }, t.prototype.unfoldSoak = function (e) {
            return ft(e, this, "variable")
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i, s, o, u, a, f;
            if (t = this.variable instanceof Q) {
                if (this.variable.isArray() || this.variable.isObject())return this.compilePatternMatch(e);
                if (this.variable.isSplice())return this.compileSplice(e);
                if ((o = this.context) === "||=" || o === "&&=" || o === "?=")return this.compileConditional(e)
            }
            r = this.variable.compile(e, T);
            if (!this.context) {
                if (!(s = this.variable.unwrapAll()).isAssignable())throw SyntaxError('"' + this.variable.compile(e) + '" cannot be assigned.');
                if (typeof s.hasProperties == "function" ? !s.hasProperties() : !void 0)this.param ? e.scope.add(r, "var") : e.scope.find(r)
            }
            return this.value instanceof c && (n = A.exec(r)) && (n[1] && (this.value.klass = n[1]), this.value.name = (u = (a = (f = n[2]) != null ? f : n[3]) != null ? a : n[4]) != null ? u : n[5]), i = this.value.compile(e, T), this.context === "object" ? "" + r + ": " + i : (i = r + (" " + (this.context || "=") + " ") + i, e.level <= T ? i : "(" + i + ")")
        }, t.prototype.compilePatternMatch = function (e) {
            var n, i, s, o, u, a, f, l, c, h, p, d, v, g, y, b, w, S, x, C, A, O, M, _, D, P, j;
            y = e.level === k, w = this.value, h = this.variable.base.objects;
            if (!(p = h.length))return s = w.compile(e), e.level >= N ? "(" + s + ")" : s;
            a = this.variable.isObject();
            if (y && p === 1 && !((c = h[0])instanceof z)) {
                c instanceof t ? (A = c, O = A.variable, u = O.base, c = A.value) : c.base instanceof H ? (M = (new Q(c.unwrapAll())).cacheReference(e), c = M[0], u = M[1]) : u = a ? c["this"] ? c.properties[0].name : c : new L(0), n = m.test(u.unwrap().value || 0), w = new Q(w), w.properties.push(new (n ? r : E)(u));
                if (_ = c.unwrap().value, vt.call(B, _) >= 0)throw new SyntaxError("assignment to a reserved word: " + c.compile(e) + " = " + w.compile(e));
                return(new t(c, w, null, {param: this.param})).compile(e, k)
            }
            S = w.compile(e, T), i = [], g = !1;
            if (!m.test(S) || this.variable.assigns(S))i.push("" + (d = e.scope.freeVariable("ref")) + " = " + S), S = d;
            for (o = x = 0, C = h.length; x < C; o = ++x) {
                c = h[o], u = o, a && (c instanceof t ? (D = c, P = D.variable, u = P.base, c = D.value) : c.base instanceof H ? (j = (new Q(c.unwrapAll())).cacheReference(e), c = j[0], u = j[1]) : u = c["this"] ? c.properties[0].name : c);
                if (!g && c instanceof z)l = c.name.unwrap().value, c = c.unwrap(), b = "" + p + " <= " + S + ".length ? " + lt("slice") + ".call(" + S + ", " + o, (v = p - o - 1) ? (f = e.scope.freeVariable("i"), b += ", " + f + " = " + S + ".length - " + v + ") : (" + f + " = " + o + ", [])") : b += ") : []", b = new L(b), g = "" + f + "++"; else {
                    l = c.unwrap().value;
                    if (c instanceof z)throw c = c.name.compile(e), new SyntaxError("multiple splats are disallowed in an assignment: " + c + "...");
                    typeof u == "number" ? (u = new L(g || u), n = !1) : n = a && m.test(u.unwrap().value || 0), b = new Q(new L(S), [new (n ? r : E)(u)])
                }
                if (l != null && vt.call(B, l) >= 0)throw new SyntaxError("assignment to a reserved word: " + c.compile(e) + " = " + b.compile(e));
                i.push((new t(c, b, null, {param: this.param, subpattern: !0})).compile(e, T))
            }
            return!y && !this.subpattern && i.push(S), s = i.join(", "), e.level < T ? s : "(" + s + ")"
        }, t.prototype.compileConditional = function (e) {
            var n, r, i;
            i = this.variable.cacheReference(e), n = i[0], r = i[1];
            if (!n.properties.length && n.base instanceof L && n.base.value !== "this" && !e.scope.check(n.base.value))throw new Error('the variable "' + n.base.value + "\" can't be assigned with " + this.context + " because it has not been defined.");
            return vt.call(this.context, "?") >= 0 && (e.isExistentialEquals = !0), (new D(this.context.slice(0, -1), n, new t(r, this.value, "="))).compile(e)
        }, t.prototype.compileSplice = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, h;
            return l = this.variable.properties.pop().range, r = l.from, u = l.to, n = l.exclusive, o = this.variable.compile(e), c = (r != null ? r.cache(e, N) : void 0) || ["0", "0"], i = c[0], s = c[1], u ? (r != null ? r.isSimpleNumber() : void 0) && u.isSimpleNumber() ? (u = +u.compile(e) - +s, n || (u += 1)) : (u = u.compile(e, S) + " - " + s, n || (u += " + 1")) : u = "9e9", h = this.value.cache(e, T), a = h[0], f = h[1], t = "[].splice.apply(" + o + ", [" + i + ", " + u + "].concat(" + a + ")), " + f, e.level > k ? "(" + t + ")" : t
        }, t
    }(o), t.Code = c = function (e) {
        function t(e, t, n) {
            this.params = e || [], this.body = t || new u, this.bound = n === "boundfunc", this.bound && (this.context = "_this")
        }

        return dt(t, e), t.prototype.children = ["params", "body"], t.prototype.isStatement = function () {
            return!!this.ctor
        }, t.prototype.jumps = M, t.prototype.compileNode = function (e) {
            var t, n, r, o, u, a, f, l, c, h, p, d, v, m, g, y, w, E, x, T, N, C, k, A, O, M, _, P, H, B, j, F, I;
            e.scope = new R(e.scope, this.body, this), e.scope.shared = et(e, "sharedScope"), e.indent += X, delete e.bare, delete e.isExistentialEquals, c = [], n = [], _ = this.paramNames();
            for (g = 0, x = _.length; g < x; g++)a = _[g], e.scope.check(a) || e.scope.parameter(a);
            P = this.params;
            for (y = 0, T = P.length; y < T; y++) {
                l = P[y];
                if (!l.splat)continue;
                H = this.params;
                for (w = 0, N = H.length; w < N; w++)f = H[w].name, f["this"] && (f = f.properties[0].name), f.value && e.scope.add(f.value, "var", !0);
                p = new s(new Q(new i(function () {
                    var t, n, r, i;
                    r = this.params, i = [];
                    for (t = 0, n = r.length; t < n; t++)f = r[t], i.push(f.asReference(e));
                    return i
                }.call(this))), new Q(new L("arguments")));
                break
            }
            B = this.params;
            for (E = 0, C = B.length; E < C; E++)l = B[E], l.isComplex() ? (v = h = l.asReference(e), l.value && (v = new D("?", h, l.value)), n.push(new s(new Q(l.name), v, "=", {param: !0}))) : (h = l, l.value && (u = new L(h.name.value + " == null"), v = new s(new Q(l.name), l.value, "="), n.push(new b(u, v)))), p || c.push(h);
            m = this.body.isEmpty(), p && n.unshift(p), n.length && (j = this.body.expressions).unshift.apply(j, n);
            for (r = O = 0, k = c.length; O < k; r = ++O)f = c[r], e.scope.parameter(c[r] = f.compile(e));
            d = [], F = this.paramNames();
            for (M = 0, A = F.length; M < A; M++) {
                a = F[M];
                if (vt.call(d, a) >= 0)throw SyntaxError("multiple parameters named '" + a + "'");
                d.push(a)
            }
            return!m && !this.noReturn && this.body.makeReturn(), this.bound && (((I = e.scope.parent.method) != null ? I.bound : void 0) ? this.bound = this.context = e.scope.parent.method.context : this["static"] || e.scope.parent.assign("_this", "this")), o = e.indent, t = "function", this.ctor && (t += " " + this.name), t += "(" + c.join(", ") + ") {", this.body.isEmpty() || (t += "\n" + this.body.compileWithDeclarations(e) + "\n" + this.tab), t += "}", this.ctor ? this.tab + t : this.front || e.level >= S ? "(" + t + ")" : t
        }, t.prototype.paramNames = function () {
            var e, t, n, r, i;
            e = [], i = this.params;
            for (n = 0, r = i.length; n < r; n++)t = i[n], e.push.apply(e, t.names());
            return e
        }, t.prototype.traverseChildren = function (e, n) {
            if (e)return t.__super__.traverseChildren.call(this, e, n)
        }, t
    }(o), t.Param = P = function (e) {
        function t(e, t, n) {
            var r;
            this.name = e, this.value = t, this.splat = n;
            if (r = e = this.name.unwrapAll().value, vt.call(q, r) >= 0)throw SyntaxError('parameter name "' + e + '" is not allowed')
        }

        return dt(t, e), t.prototype.children = ["name", "value"], t.prototype.compile = function (e) {
            return this.name.compile(e, T)
        }, t.prototype.asReference = function (e) {
            var t;
            return this.reference ? this.reference : (t = this.name, t["this"] ? (t = t.properties[0].name, t.value.reserved && (t = new L(e.scope.freeVariable(t.value)))) : t.isComplex() && (t = new L(e.scope.freeVariable("arg"))), t = new Q(t), this.splat && (t = new z(t)), this.reference = t)
        }, t.prototype.isComplex = function () {
            return this.name.isComplex()
        }, t.prototype.names = function (e) {
            var t, n, r, i, o, u;
            e == null && (e = this.name), t = function (e) {
                var t;
                return t = e.properties[0].name.value, t.reserved ? [] : [t]
            };
            if (e instanceof L)return[e.value];
            if (e instanceof Q)return t(e);
            n = [], u = e.objects;
            for (i = 0, o = u.length; i < o; i++) {
                r = u[i];
                if (r instanceof s)n.push(r.value.unwrap().value); else if (r instanceof z)n.push(r.name.unwrap().value); else {
                    if (!(r instanceof Q))throw SyntaxError("illegal parameter " + r.compile());
                    r.isArray() || r.isObject() ? n.push.apply(n, this.names(r.base)) : r["this"] ? n.push.apply(n, t(r)) : n.push(r.base.value)
                }
            }
            return n
        }, t
    }(o), t.Splat = z = function (e) {
        function t(e) {
            this.name = e.compile ? e : new L(e)
        }

        return dt(t, e), t.prototype.children = ["name"], t.prototype.isAssignable = Y, t.prototype.assigns = function (e) {
            return this.name.assigns(e)
        }, t.prototype.compile = function (e) {
            return this.index != null ? this.compileParam(e) : this.name.compile(e)
        }, t.prototype.unwrap = function () {
            return this.name
        }, t.compileSplattedArray = function (e, n, r) {
            var i, s, o, u, a, f, l, c;
            a = -1;
            while ((f = n[++a]) && !(f instanceof t))continue;
            if (a >= n.length)return"";
            if (n.length === 1)return o = n[0].compile(e, T), r ? o : "" + lt("slice") + ".call(" + o + ")";
            i = n.slice(a);
            for (u = l = 0, c = i.length; l < c; u = ++l)f = i[u], o = f.compile(e, T), i[u] = f instanceof t ? "" + lt("slice") + ".call(" + o + ")" : "[" + o + "]";
            return a === 0 ? i[0] + (".concat(" + i.slice(1).join(", ") + ")") : (s = function () {
                var t, r, i, s;
                i = n.slice(0, a), s = [];
                for (t = 0, r = i.length; t < r; t++)f = i[t], s.push(f.compile(e, T));
                return s
            }(), "[" + s.join(", ") + "].concat(" + i.join(", ") + ")")
        }, t
    }(o), t.While = G = function (e) {
        function t(e, t) {
            this.condition = (t != null ? t.invert : void 0) ? e.invert() : e, this.guard = t != null ? t.guard : void 0
        }

        return dt(t, e), t.prototype.children = ["condition", "guard", "body"], t.prototype.isStatement = Y, t.prototype.makeReturn = function (e) {
            return e ? t.__super__.makeReturn.apply(this, arguments) : (this.returns = !this.jumps({loop: !0}), this)
        }, t.prototype.addBody = function (e) {
            return this.body = e, this
        }, t.prototype.jumps = function () {
            var e, t, n, r;
            e = this.body.expressions;
            if (!e.length)return!1;
            for (n = 0, r = e.length; n < r; n++) {
                t = e[n];
                if (t.jumps({loop: !0}))return t
            }
            return!1
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i;
            return e.indent += X, i = "", t = this.body, t.isEmpty() ? t = "" : (this.returns && (t.makeReturn(r = e.scope.freeVariable("results")), i = "" + this.tab + r + " = [];\n"), this.guard && (t.expressions.length > 1 ? t.expressions.unshift(new b((new H(this.guard)).invert(), new L("continue"))) : this.guard && (t = u.wrap([new b(this.guard, t)]))), t = "\n" + t.compile(e, k) + "\n" + this.tab), n = i + this.tab + ("while (" + this.condition.compile(e, C) + ") {" + t + "}"), this.returns && (n += "\n" + this.tab + "return " + r + ";"), n
        }, t
    }(o), t.Op = D = function (e) {
        function r(e, n, r, i) {
            if (e === "in")return new w(n, r);
            if (e === "do")return this.generateDo(n);
            if (e === "new") {
                if (n instanceof a && !n["do"] && !n.isNew)return n.newInstance();
                if (n instanceof c && n.bound || n["do"])n = new H(n)
            }
            return this.operator = t[e] || e, this.first = n, this.second = r, this.flip = !!i, this
        }

        var t, n;
        return dt(r, e), t = {"==": "===", "!=": "!==", of: "in"}, n = {"!==": "===", "===": "!=="}, r.prototype.children = ["first", "second"], r.prototype.isSimpleNumber = M, r.prototype.isUnary = function () {
            return!this.second
        }, r.prototype.isComplex = function () {
            var e;
            return!this.isUnary() || (e = this.operator) !== "+" && e !== "-" || this.first.isComplex()
        }, r.prototype.isChainable = function () {
            var e;
            return(e = this.operator) === "<" || e === ">" || e === ">=" || e === "<=" || e === "===" || e === "!=="
        }, r.prototype.invert = function () {
            var e, t, i, s, o;
            if (this.isChainable() && this.first.isChainable()) {
                e = !0, t = this;
                while (t && t.operator)e && (e = t.operator in n), t = t.first;
                if (!e)return(new H(this)).invert();
                t = this;
                while (t && t.operator)t.invert = !t.invert, t.operator = n[t.operator], t = t.first;
                return this
            }
            return(s = n[this.operator]) ? (this.operator = s, this.first.unwrap()instanceof r && this.first.invert(), this) : this.second ? (new H(this)).invert() : this.operator === "!" && (i = this.first.unwrap())instanceof r && ((o = i.operator) === "!" || o === "in" || o === "instanceof") ? i : new r("!", this)
        }, r.prototype.unfoldSoak = function (e) {
            var t;
            return((t = this.operator) === "++" || t === "--" || t === "delete") && ft(e, this, "first")
        }, r.prototype.generateDo = function (e) {
            var t, n, r, i, o, u, f, l;
            i = [], n = e instanceof s && (o = e.value.unwrap())instanceof c ? o : e, l = n.params || [];
            for (u = 0, f = l.length; u < f; u++)r = l[u], r.value ? (i.push(r.value), delete r.value) : i.push(r);
            return t = new a(e, i), t["do"] = !0, t
        }, r.prototype.compileNode = function (e) {
            var t, n, r, i;
            n = this.isChainable() && this.first.isChainable(), n || (this.first.front = this.front);
            if (this.operator === "delete" && e.scope.check(this.first.unwrapAll().value))throw SyntaxError("delete operand may not be argument or var");
            if (((r = this.operator) === "--" || r === "++") && (i = this.first.unwrapAll().value, vt.call(q, i) >= 0))throw SyntaxError("prefix increment/decrement may not have eval or arguments operand");
            return this.isUnary() ? this.compileUnary(e) : n ? this.compileChain(e) : this.operator === "?" ? this.compileExistence(e) : (t = this.first.compile(e, N) + " " + this.operator + " " + this.second.compile(e, N), e.level <= N ? t : "(" + t + ")")
        }, r.prototype.compileChain = function (e) {
            var t, n, r, i;
            return i = this.first.second.cache(e), this.first.second = i[0], r = i[1], n = this.first.compile(e, N), t = "" + n + " " + (this.invert ? "&&" : "||") + " " + r.compile(e) + " " + this.operator + " " + this.second.compile(e, N), "(" + t + ")"
        }, r.prototype.compileExistence = function (e) {
            var t, n;
            return this.first.isComplex() ? (n = new L(e.scope.freeVariable("ref")), t = new H(new s(n, this.first))) : (t = this.first, n = t), (new b(new p(t), n, {type: "if"})).addElse(this.second).compile(e)
        }, r.prototype.compileUnary = function (e) {
            var t, n, i;
            if (e.level >= S)return(new H(this)).compile(e);
            n = [t = this.operator], i = t === "+" || t === "-", (t === "new" || t === "typeof" || t === "delete" || i && this.first instanceof r && this.first.operator === t) && n.push(" ");
            if (i && this.first instanceof r || t === "new" && this.first.isStatement(e))this.first = new H(this.first);
            return n.push(this.first.compile(e, N)), this.flip && n.reverse(), n.join("")
        }, r.prototype.toString = function (e) {
            return r.__super__.toString.call(this, e, this.constructor.name + " " + this.operator)
        }, r
    }(o), t.In = w = function (e) {
        function t(e, t) {
            this.object = e, this.array = t
        }

        return dt(t, e), t.prototype.children = ["object", "array"], t.prototype.invert = O, t.prototype.compileNode = function (e) {
            var t, n, r, i, s;
            if (this.array instanceof Q && this.array.isArray()) {
                s = this.array.base.objects;
                for (r = 0, i = s.length; r < i; r++) {
                    n = s[r];
                    if (n instanceof z) {
                        t = !0;
                        break
                    }
                    continue
                }
                if (!t)return this.compileOrTest(e)
            }
            return this.compileLoopTest(e)
        }, t.prototype.compileOrTest = function (e) {
            var t, n, r, i, s, o, u, a, f;
            return this.array.base.objects.length === 0 ? "" + !!this.negated : (a = this.object.cache(e, N), o = a[0], s = a[1], f = this.negated ? [" !== ", " && "] : [" === ", " || "], t = f[0], n = f[1], u = function () {
                var n, u, a, f;
                a = this.array.base.objects, f = [];
                for (r = n = 0, u = a.length; n < u; r = ++n)i = a[r], f.push((r ? s : o) + t + i.compile(e, S));
                return f
            }.call(this), u = u.join(n), e.level < N ? u : "(" + u + ")")
        }, t.prototype.compileLoopTest = function (e) {
            var t, n, r, i;
            return i = this.object.cache(e, T), r = i[0], n = i[1], t = lt("indexOf") + (".call(" + this.array.compile(e, T) + ", " + n + ") ") + (this.negated ? "< 0" : ">= 0"), r === n ? t : (t = r + ", " + t, e.level < T ? t : "(" + t + ")")
        }, t.prototype.toString = function (e) {
            return t.__super__.toString.call(this, e, this.constructor.name + (this.negated ? "!" : ""))
        }, t
    }(o), t.Try = J = function (e) {
        function t(e, t, n, r) {
            this.attempt = e, this.error = t, this.recovery = n, this.ensure = r
        }

        return dt(t, e), t.prototype.children = ["attempt", "recovery", "ensure"], t.prototype.isStatement = Y, t.prototype.jumps = function (e) {
            var t;
            return this.attempt.jumps(e) || ((t = this.recovery) != null ? t.jumps(e) : void 0)
        }, t.prototype.makeReturn = function (e) {
            return this.attempt && (this.attempt = this.attempt.makeReturn(e)), this.recovery && (this.recovery = this.recovery.makeReturn(e)), this
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i;
            return e.indent += X, r = this.error ? " (" + this.error.compile(e) + ") " : " ", i = this.attempt.compile(e, k), t = function () {
                var t;
                if (this.recovery) {
                    if (t = this.error.value, vt.call(q, t) >= 0)throw SyntaxError('catch variable may not be "' + this.error.value + '"');
                    return e.scope.check(this.error.value) || e.scope.add(this.error.value, "param"), " catch" + r + "{\n" + this.recovery.compile(e, k) + "\n" + this.tab + "}"
                }
                if (!this.ensure && !this.recovery)return" catch (_error) {}"
            }.call(this), n = this.ensure ? " finally {\n" + this.ensure.compile(e, k) + "\n" + this.tab + "}" : "", "" + this.tab + "try {\n" + i + "\n" + this.tab + "}" + (t || "") + n
        }, t
    }(o), t.Throw = $ = function (e) {
        function t(e) {
            this.expression = e
        }

        return dt(t, e), t.prototype.children = ["expression"], t.prototype.isStatement = Y, t.prototype.jumps = M, t.prototype.makeReturn = V, t.prototype.compileNode = function (e) {
            return this.tab + ("throw " + this.expression.compile(e) + ";")
        }, t
    }(o), t.Existence = p = function (e) {
        function t(e) {
            this.expression = e
        }

        return dt(t, e), t.prototype.children = ["expression"], t.prototype.invert = O, t.prototype.compileNode = function (e) {
            var t, n, r, i;
            return this.expression.front = this.front, r = this.expression.compile(e, N), m.test(r) && !e.scope.check(r) ? (i = this.negated ? ["===", "||"] : ["!==", "&&"], t = i[0], n = i[1], r = "typeof " + r + " " + t + ' "undefined" ' + n + " " + r + " " + t + " null") : r = "" + r + " " + (this.negated ? "==" : "!=") + " null", e.level <= x ? r : "(" + r + ")"
        }, t
    }(o), t.Parens = H = function (e) {
        function t(e) {
            this.body = e
        }

        return dt(t, e), t.prototype.children = ["body"], t.prototype.unwrap = function () {
            return this.body
        }, t.prototype.isComplex = function () {
            return this.body.isComplex()
        }, t.prototype.compileNode = function (e) {
            var t, n, r;
            return r = this.body.unwrap(), r instanceof Q && r.isAtomic() ? (r.front = this.front, r.compile(e)) : (n = r.compile(e, C), t = e.level < N && (r instanceof D || r instanceof a || r instanceof v && r.returns), t ? n : "(" + n + ")")
        }, t
    }(o), t.For = v = function (e) {
        function t(e, t) {
            var n;
            this.source = t.source, this.guard = t.guard, this.step = t.step, this.name = t.name, this.index = t.index, this.body = u.wrap([e]), this.own = !!t.own, this.object = !!t.object, this.object && (n = [this.index, this.name], this.name = n[0], this.index = n[1]);
            if (this.index instanceof Q)throw SyntaxError("index cannot be a pattern matching expression");
            this.range = this.source instanceof Q && this.source.base instanceof j && !this.source.properties.length, this.pattern = this.name instanceof Q;
            if (this.range && this.index)throw SyntaxError("indexes do not apply to range loops");
            if (this.range && this.pattern)throw SyntaxError("cannot pattern match over range loops");
            this.returns = !1
        }

        return dt(t, e), t.prototype.children = ["body", "source", "guard", "step"], t.prototype.compileNode = function (e) {
            var t, n, r, i, o, a, f, l, c, h, p, d, v, g, y, w, E, S, x, C, A, O, M, _, D;
            return t = u.wrap([this.body]), p = (D = it(t.expressions)) != null ? D.jumps() : void 0, p && p instanceof F && (this.returns = !1), C = this.range ? this.source.base : this.source, x = e.scope, v = this.name && this.name.compile(e, T), f = this.index && this.index.compile(e, T), v && !this.pattern && x.find(v), f && x.find(f), this.returns && (S = x.freeVariable("results")), l = this.object && f || x.freeVariable("i"), c = this.range && v || f || l, h = c !== l ? "" + c + " = " : "", this.step && !this.range && (O = x.freeVariable("step")), this.pattern && (v = l), _ = "", o = "", n = "", a = this.tab + X, this.range ? r = C.compile(st(e, {index: l, name: v, step: this.step})) : (M = this.source.compile(e, T), (v || this.own) && !m.test(M) && (n = "" + this.tab + (y = x.freeVariable("ref")) + " = " + M + ";\n", M = y), v && !this.pattern && (g = "" + v + " = " + M + "[" + c + "]"), this.object || (d = x.freeVariable("len"), i = "" + h + l + " = 0, " + d + " = " + M + ".length", this.step && (i += ", " + O + " = " + this.step.compile(e, N)), A = "" + h + (this.step ? "" + l + " += " + O : c !== l ? "++" + l : "" + l + "++"), r = "" + i + "; " + l + " < " + d + "; " + A)), this.returns && (w = "" + this.tab + S + " = [];\n", E = "\n" + this.tab + "return " + S + ";", t.makeReturn(S)), this.guard && (t.expressions.length > 1 ? t.expressions.unshift(new b((new H(this.guard)).invert(), new L("continue"))) : this.guard && (t = u.wrap([new b(this.guard, t)]))), this.pattern && t.expressions.unshift(new s(this.name, new L("" + M + "[" + c + "]"))), n += this.pluckDirectCall(e, t), g && (_ = "\n" + a + g + ";"), this.object && (r = "" + c + " in " + M, this.own && (o = "\n" + a + "if (!" + lt("hasProp") + ".call(" + M + ", " + c + ")) continue;")), t = t.compile(st(e, {indent: a}), k), t && (t = "\n" + t + "\n"), "" + n + (w || "") + this.tab + "for (" + r + ") {" + o + _ + t + this.tab + "}" + (E || "")
        }, t.prototype.pluckDirectCall = function (e, t) {
            var n, r, i, o, u, f, l, h, p, d, v, m, g, y, b;
            r = "", d = t.expressions;
            for (u = h = 0, p = d.length; h < p; u = ++h) {
                i = d[u], i = i.unwrapAll();
                if (!(i instanceof a))continue;
                l = i.variable.unwrapAll();
                if (!(l instanceof c || l instanceof Q && ((v = l.base) != null ? v.unwrapAll() : void 0)instanceof c && l.properties.length === 1 && ((m = (g = l.properties[0].name) != null ? g.value : void 0) === "call" || m === "apply")))continue;
                o = ((y = l.base) != null ? y.unwrapAll() : void 0) || l, f = new L(e.scope.freeVariable("fn")), n = new Q(f), l.base && (b = [n, l], l.base = b[0], n = b[1]), t.expressions[u] = new a(n, i.args), r += this.tab + (new s(f, o)).compile(e, k) + ";\n"
            }
            return r
        }, t
    }(G), t.Switch = W = function (e) {
        function t(e, t, n) {
            this.subject = e, this.cases = t, this.otherwise = n
        }

        return dt(t, e), t.prototype.children = ["subject", "cases", "otherwise"], t.prototype.isStatement = Y, t.prototype.jumps = function (e) {
            var t, n, r, i, s, o, u;
            e == null && (e = {block: !0}), s = this.cases;
            for (r = 0, i = s.length; r < i; r++) {
                o = s[r], n = o[0], t = o[1];
                if (t.jumps(e))return t
            }
            return(u = this.otherwise) != null ? u.jumps(e) : void 0
        }, t.prototype.makeReturn = function (e) {
            var t, n, r, i, s;
            i = this.cases;
            for (n = 0, r = i.length; n < r; n++)t = i[n], t[1].makeReturn(e);
            return e && (this.otherwise || (this.otherwise = new u([new L("void 0")]))), (s = this.otherwise) != null && s.makeReturn(e), this
        }, t.prototype.compileNode = function (e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g;
            a = e.indent + X, f = e.indent = a + X, r = this.tab + ("switch (" + (((d = this.subject) != null ? d.compile(e, C) : void 0) || !1) + ") {\n"), v = this.cases;
            for (u = l = 0, h = v.length; l < h; u = ++l) {
                m = v[u], s = m[0], t = m[1], g = rt([s]);
                for (c = 0, p = g.length; c < p; c++)i = g[c], this.subject || (i = i.invert()), r += a + ("case " + i.compile(e, C) + ":\n");
                if (n = t.compile(e, k))r += n + "\n";
                if (u === this.cases.length - 1 && !this.otherwise)break;
                o = this.lastNonComment(t.expressions);
                if (o instanceof F || o instanceof L && o.jumps() && o.value !== "debugger")continue;
                r += f + "break;\n"
            }
            return this.otherwise && this.otherwise.expressions.length && (r += a + ("default:\n" + this.otherwise.compile(e, k) + "\n")), r + this.tab + "}"
        }, t
    }(o), t.If = b = function (e) {
        function t(e, t, n) {
            this.body = t, n == null && (n = {}), this.condition = n.type === "unless" ? e.invert() : e, this.elseBody = null, this.isChain = !1, this.soak = n.soak
        }

        return dt(t, e), t.prototype.children = ["condition", "body", "elseBody"], t.prototype.bodyNode = function () {
            var e;
            return(e = this.body) != null ? e.unwrap() : void 0
        }, t.prototype.elseBodyNode = function () {
            var e;
            return(e = this.elseBody) != null ? e.unwrap() : void 0
        }, t.prototype.addElse = function (e) {
            return this.isChain ? this.elseBodyNode().addElse(e) : (this.isChain = e instanceof t, this.elseBody = this.ensureBlock(e)), this
        }, t.prototype.isStatement = function (e) {
            var t;
            return(e != null ? e.level : void 0) === k || this.bodyNode().isStatement(e) || ((t = this.elseBodyNode()) != null ? t.isStatement(e) : void 0)
        }, t.prototype.jumps = function (e) {
            var t;
            return this.body.jumps(e) || ((t = this.elseBody) != null ? t.jumps(e) : void 0)
        }, t.prototype.compileNode = function (e) {
            return this.isStatement(e) ? this.compileStatement(e) : this.compileExpression(e)
        }, t.prototype.makeReturn = function (e) {
            return e && (this.elseBody || (this.elseBody = new u([new L("void 0")]))), this.body && (this.body = new u([this.body.makeReturn(e)])), this.elseBody && (this.elseBody = new u([this.elseBody.makeReturn(e)])), this
        }, t.prototype.ensureBlock = function (e) {
            return e instanceof u ? e : new u([e])
        }, t.prototype.compileStatement = function (e) {
            var n, r, i, s, o;
            return r = et(e, "chainChild"), s = et(e, "isExistentialEquals"), s ? (new t(this.condition.invert(), this.elseBodyNode(), {type: "if"})).compile(e) : (i = this.condition.compile(e, C), e.indent += X, n = this.ensureBlock(this.body), o = "if (" + i + ") {\n" + n.compile(e) + "\n" + this.tab + "}", r || (o = this.tab + o), this.elseBody ? o + " else " + (this.isChain ? (e.indent = this.tab, e.chainChild = !0, this.elseBody.unwrap().compile(e, k)) : "{\n" + this.elseBody.compile(e, k) + "\n" + this.tab + "}") : o)
        }, t.prototype.compileExpression = function (e) {
            var t, n, r, i;
            return i = this.condition.compile(e, x), n = this.bodyNode().compile(e, T), t = this.elseBodyNode() ? this.elseBodyNode().compile(e, T) : "void 0", r = "" + i + " ? " + n + " : " + t, e.level >= x ? "(" + r + ")" : r
        }, t.prototype.unfoldSoak = function () {
            return this.soak && this
        }, t
    }(o), l = {wrap: function (e, t, n) {
        var i, s, o, f, l;
        if (e.jumps())return e;
        o = new c([], u.wrap([e])), i = [];
        if ((f = e.contains(this.literalArgs)) || e.contains(this.literalThis))l = new L(f ? "apply" : "call"), i = [new L("this")], f && i.push(new L("arguments")), o = new Q(o, [new r(l)]);
        return o.noReturn = n, s = new a(o, i), t ? u.wrap([s]) : s
    }, literalArgs: function (e) {
        return e instanceof L && e.value === "arguments" && !e.asKey
    }, literalThis: function (e) {
        return e instanceof L && e.value === "this" && !e.asKey || e instanceof c && e.bound || e instanceof a && e.isSuper
    }}, ft = function (e, t, n) {
        var r;
        if (!(r = t[n].unfoldSoak(e)))return;
        return t[n] = r.body, r.body = new Q(t), r
    }, K = {"extends": function () {
        return"function(child, parent) { for (var key in parent) { if (" + lt("hasProp") + ".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"
    }, bind: function () {
        return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"
    }, indexOf: function () {
        return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"
    }, hasProp: function () {
        return"{}.hasOwnProperty"
    }, slice: function () {
        return"[].slice"
    }}, k = 1, C = 2, T = 3, x = 4, N = 5, S = 6, X = "  ", g = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*", m = RegExp("^" + g + "$"), I = /^[+-]?\d+$/, A = RegExp("^(?:(" + g + ")\\.prototype(?:\\.(" + g + ")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\]))|(" + g + ")$"), y = /^['"]/, lt = function (e) {
        var t;
        return t = "__" + e, R.root.assign(t, K[e]()), t
    }, ot = function (e, t) {
        return e = e.replace(/\n/g, "$&" + t), e.replace(/\s+$/, "")
    }
}), define("ace/mode/coffee/scope", ["require", "exports", "module", "ace/mode/coffee/helpers"], function (e, t, n) {
    var r, i, s, o;
    o = e("./helpers"), i = o.extend, s = o.last, t.Scope = r = function () {
        function e(t, n, r) {
            this.parent = t, this.expressions = n, this.method = r, this.variables = [
                {name: "arguments", type: "arguments"}
            ], this.positions = {}, this.parent || (e.root = this)
        }

        return e.root = null, e.prototype.add = function (e, t, n) {
            return this.shared && !n ? this.parent.add(e, t, n) : Object.prototype.hasOwnProperty.call(this.positions, e) ? this.variables[this.positions[e]].type = t : this.positions[e] = this.variables.push({name: e, type: t}) - 1
        }, e.prototype.namedMethod = function () {
            return this.method.name || !this.parent ? this.method : this.parent.namedMethod()
        }, e.prototype.find = function (e) {
            return this.check(e) ? !0 : (this.add(e, "var"), !1)
        }, e.prototype.parameter = function (e) {
            if (this.shared && this.parent.check(e, !0))return;
            return this.add(e, "param")
        }, e.prototype.check = function (e) {
            var t;
            return!!(this.type(e) || ((t = this.parent) != null ? t.check(e) : void 0))
        }, e.prototype.temporary = function (e, t) {
            return e.length > 1 ? "_" + e + (t > 1 ? t - 1 : "") : "_" + (t + parseInt(e, 36)).toString(36).replace(/\d/g, "a")
        }, e.prototype.type = function (e) {
            var t, n, r, i;
            i = this.variables;
            for (n = 0, r = i.length; n < r; n++) {
                t = i[n];
                if (t.name === e)return t.type
            }
            return null
        }, e.prototype.freeVariable = function (e, t) {
            var n, r;
            t == null && (t = !0), n = 0;
            while (this.check(r = this.temporary(e, n)))n++;
            return t && this.add(r, "var", !0), r
        }, e.prototype.assign = function (e, t) {
            return this.add(e, {value: t, assigned: !0}, !0), this.hasAssignments = !0
        }, e.prototype.hasDeclarations = function () {
            return!!this.declaredVariables().length
        }, e.prototype.declaredVariables = function () {
            var e, t, n, r, i, s;
            e = [], t = [], s = this.variables;
            for (r = 0, i = s.length; r < i; r++)n = s[r], n.type === "var" && (n.name.charAt(0) === "_" ? t : e).push(n.name);
            return e.sort().concat(t.sort())
        }, e.prototype.assignedVariables = function () {
            var e, t, n, r, i;
            r = this.variables, i = [];
            for (t = 0, n = r.length; t < n; t++)e = r[t], e.type.assigned && i.push("" + e.name + " = " + e.type.value);
            return i
        }, e
    }()
})