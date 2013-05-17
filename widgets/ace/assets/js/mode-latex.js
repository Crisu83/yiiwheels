ace.define("ace/mode/latex", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/latex_highlight_rules", "ace/mode/folding/latex", "ace/range"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("./text").Mode, s = e("../tokenizer").Tokenizer, o = e("./latex_highlight_rules").LatexHighlightRules, u = e("./folding/latex").FoldMode, a = e("../range").Range, f = function () {
        this.$tokenizer = new s((new o).getRules()), this.foldingRules = new u
    };
    r.inherits(f, i), function () {
        this.toggleCommentLines = function (e, t, n, r) {
            var i = !0, s = /^(\s*)\%/;
            for (var o = n; o <= r; o++)if (!s.test(t.getLine(o))) {
                i = !1;
                break
            }
            if (i) {
                var u = new a(0, 0, 0, 0);
                for (var o = n; o <= r; o++) {
                    var f = t.getLine(o), l = f.match(s);
                    u.start.row = o, u.end.row = o, u.end.column = l[0].length, t.replace(u, l[1])
                }
            } else t.indentRows(n, r, "%")
        }, this.getNextLineIndent = function (e, t, n) {
            return this.$getIndent(t)
        }
    }.call(f.prototype), t.Mode = f
}), ace.define("ace/mode/latex_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
        this.$rules = {start: [
            {token: "keyword", regex: "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)"},
            {token: "lparen", regex: "[[({]"},
            {token: "rparen", regex: "[\\])}]"},
            {token: "string", regex: "\\$(?:(?:\\\\.)|(?:[^\\$\\\\]))*?\\$"},
            {token: "comment", regex: "%.*$"}
        ]}
    };
    r.inherits(s, i), t.LatexHighlightRules = s
}), ace.define("ace/mode/folding/latex", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode", "ace/range", "ace/token_iterator"], function (e, t, n) {
    var r = e("../../lib/oop"), i = e("./fold_mode").FoldMode, s = e("../../range").Range, o = e("../../token_iterator").TokenIterator, u = t.FoldMode = function () {
    };
    r.inherits(u, i), function () {
        this.foldingStartMarker = /^\s*\\(begin)|(section|subsection)\b|{\s*$/, this.foldingStopMarker = /^\s*\\(end)\b|^\s*}/, this.getFoldWidgetRange = function (e, t, n) {
            var r = e.doc.getLine(n), i = this.foldingStartMarker.exec(r);
            if (i)return i[1] ? this.latexBlock(e, n, i[0].length - 1) : i[2] ? this.latexSection(e, n, i[0].length - 1) : this.openingBracketBlock(e, "{", n, i.index);
            var i = this.foldingStopMarker.exec(r);
            if (i)return i[1] ? this.latexBlock(e, n, i[0].length - 1) : this.closingBracketBlock(e, "}", n, i.index + i[0].length)
        }, this.latexBlock = function (e, t, n) {
            var r = {"\\begin": 1, "\\end": -1}, i = new o(e, t, n), u = i.getCurrentToken();
            if (!u || u.type !== "keyword")return;
            var a = u.value, f = r[a], l = function () {
                var e = i.stepForward(), t = e.type == "lparen" ? i.stepForward().value : "";
                return f === -1 && (i.stepBackward(), t && i.stepBackward()), t
            }, c = [l()], h = f === -1 ? i.getCurrentTokenColumn() : e.getLine(t).length, p = t;
            i.step = f === -1 ? i.stepBackward : i.stepForward;
            while (u = i.step()) {
                if (u.type !== "keyword")continue;
                var d = r[u.value];
                if (!d)continue;
                var v = l();
                if (d === f)c.unshift(v); else if (c.shift() !== v || !c.length)break
            }
            if (c.length)return;
            var t = i.getCurrentTokenRow();
            return f === -1 ? new s(t, e.getLine(t).length, p, h) : new s(p, h, t, i.getCurrentTokenColumn())
        }, this.latexSection = function (e, t, n) {
            var r = ["\\subsection", "\\section", "\\begin", "\\end"], i = new o(e, t, n), u = i.getCurrentToken();
            if (!u || u.type != "keyword")return;
            var a = r.indexOf(u.value), f = 0, l = t;
            while (u = i.stepForward()) {
                if (u.type !== "keyword")continue;
                var c = r.indexOf(u.value);
                if (c >= 2) {
                    f || (l = i.getCurrentTokenRow() - 1), f += c == 2 ? 1 : -1;
                    if (f < 0)break
                } else if (c >= a)break
            }
            f || (l = i.getCurrentTokenRow() - 1);
            while (l > t && !/\S/.test(e.getLine(l)))l--;
            return new s(t, e.getLine(t).length, l, e.getLine(l).length)
        }
    }.call(u.prototype)
})