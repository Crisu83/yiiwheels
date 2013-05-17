ace.define("ace/mode/xquery", ["require", "exports", "module", "ace/worker/worker_client", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/xquery_highlight_rules", "ace/range", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (e, t, n) {
    var r = e("../worker/worker_client").WorkerClient, i = e("../lib/oop"), s = e("./text").Mode, o = e("../tokenizer").Tokenizer, u = e("./xquery_highlight_rules").XQueryHighlightRules, a = e("../range").Range, f = e("./behaviour/cstyle").CstyleBehaviour, l = e("./folding/cstyle").FoldMode, c = function (e) {
        this.$tokenizer = new o((new u).getRules()), this.$behaviour = new f(e), this.foldingRules = new l
    };
    i.inherits(c, s), function () {
        this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t), i = t.match(/\s*(?:then|else|return|[{\(]|<\w+>)\s*$/);
            return i && (r += n), r
        }, this.checkOutdent = function (e, t, n) {
            return/^\s+$/.test(t) ? /^\s*[\}\)]/.test(n) : !1
        }, this.autoOutdent = function (e, t, n) {
            var r = t.getLine(n), i = r.match(/^(\s*[\}\)])/);
            if (!i)return 0;
            var s = i[1].length, o = t.findMatchingBracket({row: n, column: s});
            if (!o || o.row == n)return 0;
            var u = this.$getIndent(t.getLine(o.row));
            t.replace(new a(n, 0, n, s - 1), u)
        }, this.$getIndent = function (e) {
            var t = e.match(/^(\s+)/);
            return t ? t[1] : ""
        }, this.toggleCommentLines = function (e, t, n, r) {
            var i, s, o = !0, u = /^\s*\(:(.*):\)/;
            for (i = n; i <= r; i++)if (!u.test(t.getLine(i))) {
                o = !1;
                break
            }
            var f = new a(0, 0, 0, 0);
            for (i = n; i <= r; i++)s = t.getLine(i), f.start.row = i, f.end.row = i, f.end.column = s.length, t.replace(f, o ? s.match(u)[1] : "(:" + s + ":)")
        }, this.createWorker = function (e) {
            this.$deltas = [];
            var t = new r(["ace"], "ace/mode/xquery_worker", "XQueryWorker"), n = this;
            return e.getDocument().on("change", function (e) {
                n.$deltas.push(e.data)
            }), t.attachToDocument(e.getDocument()), t.on("start", function (e) {
                n.$deltas = []
            }), t.on("error", function (t) {
                e.setAnnotations([t.data])
            }), t.on("ok", function (t) {
                e.clearAnnotations()
            }), t.on("highlight", function (t) {
                if (n.$deltas.length > 0)return;
                var r = 0, i = e.getLength() - 1, s = t.data.lines, o = t.data.states;
                e.bgTokenizer.lines = s, e.bgTokenizer.states = o, e.bgTokenizer.fireUpdateEvent(r, i)
            }), t
        }
    }.call(c.prototype), t.Mode = c
}), ace.define("ace/mode/xquery_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
        var e = "after|ancestor|ancestor-or-self|and|as|ascending|attribute|before|case|cast|castable|child|collation|comment|copy|count|declare|default|delete|descendant|descendant-or-self|descending|div|document|document-node|element|else|empty|empty-sequence|end|eq|every|except|first|following|following-sibling|for|function|ge|group|gt|idiv|if|import|insert|instance|intersect|into|is|item|last|le|let|lt|mod|modify|module|namespace|namespace-node|ne|node|only|or|order|ordered|parent|preceding|preceding-sibling|processing-instruction|rename|replace|return|satisfies|schema-attribute|schema-element|self|some|stable|start|switch|text|to|treat|try|typeswitch|union|unordered|validate|where|with|xquery|contains|paragraphs|sentences|times|words|by|collectionreturn|variable|version|option|when|encoding|toswitch|catch|tumbling|sliding|window|at|using|stemming|collection|schema|while|on|nodes|index|external|then|in|updating|value|of|containsbreak|loop|continue|exit|returning|append|json|position".split("|"), t = "[_A-Za-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�]", n = "[-._A-Za-z0-9·À-ÖØ-öø-˿̀-ͽͿ-῿‌‍‿⁀⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�]", r = t + n + "*", i = "(?:" + r + ":)?" + r, s = "(?:(?:Q{.*}" + r + ")|(?:" + i + "))";
        this.$rules = {start: [
            {token: "support.type", regex: "<\\!\\[CDATA\\[", next: "cdata"},
            {token: "xml-pe", regex: "<\\?", next: "pi"},
            {token: "comment", regex: "<\\!--", next: "xmlcomment"},
            {token: "comment.doc", regex: "\\(:~", next: "comment.doc"},
            {token: "comment", regex: "\\(:", next: "comment"},
            {token: ["text", "meta.tag"], regex: "(<\\/?)(" + i + ")", next: "tag"},
            {token: "constant", regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},
            {token: "variable", regex: "\\$" + s},
            {token: "string", regex: "'", next: "apos-string"},
            {token: "string", regex: '"', next: "quot-string"},
            {token: "text", regex: "\\s+"},
            {token: function (t) {
                return e.indexOf(t.toLowerCase()) !== -1 ? "keyword" : "support.function"
            }, regex: s},
            {token: "keyword.operator", regex: "\\*|:=|=|<|>|\\-|\\+"},
            {token: "lparen", regex: "[[({]"},
            {token: "rparen", regex: "[\\])}]"}
        ], tag: [
            {token: "text", regex: "\\/?>", next: "start"},
            {token: ["text", "meta.tag"], regex: "(<\\/)(" + i + ")", next: "start"},
            {token: "meta.tag", regex: i},
            {token: "text", regex: "\\s+"},
            {token: "string", regex: "'", next: "apos-attr"},
            {token: "string", regex: '"', next: "quot-attr"},
            {token: "string", regex: "'.*?'"},
            {token: "text", regex: "="}
        ], pi: [
            {token: "xml-pe", regex: ".*\\?>", next: "start"},
            {token: "xml-pe", regex: ".*"}
        ], cdata: [
            {token: "support.type", regex: "\\]\\]>", next: "start"},
            {token: "support.type", regex: "\\s+"},
            {token: "support.type", regex: "(?:[^\\]]|\\](?!\\]>))+"}
        ], "comment.doc": [
            {token: "comment.doc", regex: ":\\)", next: "start"},
            {token: "comment.doc.tag", regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,6}"},
            {token: "comment.doc.tag", regex: "@[\\w\\d_]+"},
            {token: "comment.doc", regex: "\\s+"},
            {token: "comment.doc.tag", regex: "TODO"},
            {token: "comment.doc", regex: "[^@:^\\s]+"},
            {token: "comment.doc", regex: "."}
        ], comment: [
            {token: "comment", regex: ".*:\\)", next: "start"},
            {token: "comment", regex: ".+"}
        ], xmlcomment: [
            {token: "comment", regex: ".*?-->", next: "start"},
            {token: "comment", regex: ".+"}
        ], "apos-string": [
            {token: "string", regex: ".*'", next: "start"},
            {token: "string", regex: ".*"}
        ], "quot-string": [
            {token: "string", regex: '.*"', next: "start"},
            {token: "string", regex: ".*"}
        ], "apos-attr": [
            {token: "string", regex: ".*'", next: "tag"},
            {token: "string", regex: ".*"}
        ], "quot-attr": [
            {token: "string", regex: '.*"', next: "tag"},
            {token: "string", regex: ".*"}
        ]}
    };
    r.inherits(s, i), t.XQueryHighlightRules = s
}), ace.define("ace/mode/behaviour/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour", "ace/token_iterator", "ace/lib/lang"], function (e, t, n) {
    var r = e("../../lib/oop"), i = e("../behaviour").Behaviour, s = e("../../token_iterator").TokenIterator, o = e("../../lib/lang"), u = ["text", "paren.rparen", "punctuation.operator"], a = ["text", "paren.rparen", "punctuation.operator", "comment"], f = 0, l = -1, c = "", h = 0, p = -1, d = "", v = "", m = function () {
        m.isSaneInsertion = function (e, t) {
            var n = e.getCursorPosition(), r = new s(t, n.row, n.column);
            if (!this.$matchTokenType(r.getCurrentToken() || "text", u)) {
                var i = new s(t, n.row, n.column + 1);
                if (!this.$matchTokenType(i.getCurrentToken() || "text", u))return!1
            }
            return r.stepForward(), r.getCurrentTokenRow() !== n.row || this.$matchTokenType(r.getCurrentToken() || "text", a)
        }, m.$matchTokenType = function (e, t) {
            return t.indexOf(e.type || e) > -1
        }, m.recordAutoInsert = function (e, t, n) {
            var r = e.getCursorPosition(), i = t.doc.getLine(r.row);
            this.isAutoInsertedClosing(r, i, c[0]) || (f = 0), l = r.row, c = n + i.substr(r.column), f++
        }, m.recordMaybeInsert = function (e, t, n) {
            var r = e.getCursorPosition(), i = t.doc.getLine(r.row);
            this.isMaybeInsertedClosing(r, i) || (h = 0), p = r.row, d = i.substr(0, r.column) + n, v = i.substr(r.column), h++
        }, m.isAutoInsertedClosing = function (e, t, n) {
            return f > 0 && e.row === l && n === c[0] && t.substr(e.column) === c
        }, m.isMaybeInsertedClosing = function (e, t) {
            return h > 0 && e.row === p && t.substr(e.column) === v && t.substr(0, e.column) == d
        }, m.popAutoInsertedClosing = function () {
            c = c.substr(1), f--
        }, m.clearMaybeInsertedClosing = function () {
            h = 0, p = -1
        }, this.add("braces", "insertion", function (e, t, n, r, i) {
            var s = n.getCursorPosition(), u = r.doc.getLine(s.row);
            if (i == "{") {
                var a = n.getSelectionRange(), f = r.doc.getTextRange(a);
                if (f !== "" && f !== "{" && n.getWrapBehavioursEnabled())return{text: "{" + f + "}", selection: !1};
                if (m.isSaneInsertion(n, r))return/[\]\}\)]/.test(u[s.column]) ? (m.recordAutoInsert(n, r, "}"), {text: "{}", selection: [1, 1]}) : (m.recordMaybeInsert(n, r, "{"), {text: "{", selection: [1, 1]})
            } else if (i == "}") {
                var l = u.substring(s.column, s.column + 1);
                if (l == "}") {
                    var c = r.$findOpeningBracket("}", {column: s.column + 1, row: s.row});
                    if (c !== null && m.isAutoInsertedClosing(s, u, i))return m.popAutoInsertedClosing(), {text: "", selection: [1, 1]}
                }
            } else if (i == "\n" || i == "\r\n") {
                var p = "";
                m.isMaybeInsertedClosing(s, u) && (p = o.stringRepeat("}", h), m.clearMaybeInsertedClosing());
                var l = u.substring(s.column, s.column + 1);
                if (l == "}" || p !== "") {
                    var d = r.findMatchingBracket({row: s.row, column: s.column}, "}");
                    if (!d)return null;
                    var v = this.getNextLineIndent(e, u.substring(0, s.column), r.getTabString()), g = this.$getIndent(u);
                    return{text: "\n" + v + "\n" + g + p, selection: [1, v.length, 1, v.length]}
                }
            }
        }), this.add("braces", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && s == "{") {
                var o = r.doc.getLine(i.start.row), u = o.substring(i.end.column, i.end.column + 1);
                if (u == "}")return i.end.column++, i;
                h--
            }
        }), this.add("parens", "insertion", function (e, t, n, r, i) {
            if (i == "(") {
                var s = n.getSelectionRange(), o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled())return{text: "(" + o + ")", selection: !1};
                if (m.isSaneInsertion(n, r))return m.recordAutoInsert(n, r, ")"), {text: "()", selection: [1, 1]}
            } else if (i == ")") {
                var u = n.getCursorPosition(), a = r.doc.getLine(u.row), f = a.substring(u.column, u.column + 1);
                if (f == ")") {
                    var l = r.$findOpeningBracket(")", {column: u.column + 1, row: u.row});
                    if (l !== null && m.isAutoInsertedClosing(u, a, i))return m.popAutoInsertedClosing(), {text: "", selection: [1, 1]}
                }
            }
        }), this.add("parens", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && s == "(") {
                var o = r.doc.getLine(i.start.row), u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == ")")return i.end.column++, i
            }
        }), this.add("brackets", "insertion", function (e, t, n, r, i) {
            if (i == "[") {
                var s = n.getSelectionRange(), o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled())return{text: "[" + o + "]", selection: !1};
                if (m.isSaneInsertion(n, r))return m.recordAutoInsert(n, r, "]"), {text: "[]", selection: [1, 1]}
            } else if (i == "]") {
                var u = n.getCursorPosition(), a = r.doc.getLine(u.row), f = a.substring(u.column, u.column + 1);
                if (f == "]") {
                    var l = r.$findOpeningBracket("]", {column: u.column + 1, row: u.row});
                    if (l !== null && m.isAutoInsertedClosing(u, a, i))return m.popAutoInsertedClosing(), {text: "", selection: [1, 1]}
                }
            }
        }), this.add("brackets", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && s == "[") {
                var o = r.doc.getLine(i.start.row), u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == "]")return i.end.column++, i
            }
        }), this.add("string_dquotes", "insertion", function (e, t, n, r, i) {
            if (i == '"' || i == "'") {
                var s = i, o = n.getSelectionRange(), u = r.doc.getTextRange(o);
                if (u !== "" && u !== "'" && u != '"' && n.getWrapBehavioursEnabled())return{text: s + u + s, selection: !1};
                var a = n.getCursorPosition(), f = r.doc.getLine(a.row), l = f.substring(a.column - 1, a.column);
                if (l == "\\")return null;
                var c = r.getTokens(o.start.row), h = 0, p, d = -1;
                for (var v = 0; v < c.length; v++) {
                    p = c[v], p.type == "string" ? d = -1 : d < 0 && (d = p.value.indexOf(s));
                    if (p.value.length + h > o.start.column)break;
                    h += c[v].value.length
                }
                if (!p || d < 0 && p.type !== "comment" && (p.type !== "string" || o.start.column !== p.value.length + h - 1 && p.value.lastIndexOf(s) === p.value.length - 1)) {
                    if (!m.isSaneInsertion(n, r))return;
                    return{text: s + s, selection: [1, 1]}
                }
                if (p && p.type === "string") {
                    var g = f.substring(a.column, a.column + 1);
                    if (g == s)return{text: "", selection: [1, 1]}
                }
            }
        }), this.add("string_dquotes", "deletion", function (e, t, n, r, i) {
            var s = r.doc.getTextRange(i);
            if (!i.isMultiLine() && (s == '"' || s == "'")) {
                var o = r.doc.getLine(i.start.row), u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == s)return i.end.column++, i
            }
        })
    };
    r.inherits(m, i), t.CstyleBehaviour = m
}), ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (e, t, n) {
    var r = e("../../lib/oop"), i = e("../../range").Range, s = e("./fold_mode").FoldMode, o = t.FoldMode = function () {
    };
    r.inherits(o, s), function () {
        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.getFoldWidgetRange = function (e, t, n) {
            var r = e.getLine(n), i = r.match(this.foldingStartMarker);
            if (i) {
                var s = i.index;
                return i[1] ? this.openingBracketBlock(e, i[1], n, s) : e.getCommentFoldRange(n, s + i[0].length, 1)
            }
            if (t !== "markbeginend")return;
            var i = r.match(this.foldingStopMarker);
            if (i) {
                var s = i.index + i[0].length;
                return i[1] ? this.closingBracketBlock(e, i[1], n, s) : e.getCommentFoldRange(n, s, -1)
            }
        }
    }.call(o.prototype)
})