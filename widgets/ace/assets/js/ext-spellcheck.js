ace.define("ace/ext/spellcheck", ["require", "exports", "module"], function (e, t, n) {
    text.spellcheck = !0, host.on("nativecontextmenu", function (e) {
        if (!host.selection.isEmpty())return;
        var t = host.getCursorPosition(), n = host.session.getWordRange(t.row, t.column), r = host.session.getTextRange(n);
        host.session.tokenRe.lastIndex = 0;
        if (!host.session.tokenRe.test(r))return;
        var e = r + " " + PLACEHOLDER;
        text.value = e, text.setSelectionRange(r.length + 1, r.length + 1), text.setSelectionRange(0, 0), inputHandler = function (t) {
            if (t == e)return"";
            if (t.lastIndexOf(e) == t.length - e.length)return t.slice(0, -e.length);
            if (t.indexOf(e) == 0)return t.slice(e.length);
            if (t.slice(-2) == PLACEHOLDER) {
                var r = t.slice(0, -2);
                if (r.slice(-1) == " ")return r = r.slice(0, -1), host.session.replace(n, r), r
            }
            return t
        }
    })
})