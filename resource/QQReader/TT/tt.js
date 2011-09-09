/*
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
(function(A, w) {
    function ma() {
        if (!c.isReady) {
            try {
                s.documentElement.doScroll("left");
            } catch(a) {
                setTimeout(ma, 1);
                return;
            }
            c.ready();
        }
    }
    function Qa(a, b) {
        b.src ? c.ajax({
            url: b.src,
            async: false,
            dataType: "script"
        }) : c.globalEval(b.text || b.textContent || b.innerHTML || "");
        b.parentNode && b.parentNode.removeChild(b);
    }
    function X(a, b, d, f, e, j) {
        var i = a.length;
        if (typeof b === "object") {
            for (var o in b) {
                X(a, o, b[o], f, e, d);
            }
            return a;
        }
        if (d !== w) {
            f = !j && f && c.isFunction(d);
            for (o = 0; o < i; o++) {
                e(a[o], b, f ? d.call(a[o], o, e(a[o], b)) : d, j);
            }
            return a;
        }
        return i ? e(a[0], b) : w;
    }
    function J() {
        return (new Date).getTime();
    }
    function Y() {
        return false;
    }
    function Z() {
        return true;
    }
    function na(a, b, d) {
        d[0].type = a;
        return c.event.handle.apply(b, d);
    }
    function oa(a) {
        var b, d = [],
        f = [],
        e = arguments,
        j,
        i,
        o,
        k,
        n,
        r;
        i = c.data(this, "events");
        if (! (a.liveFired === this || !i || !i.live || a.button && a.type === "click")) {
            a.liveFired = this;
            var u = i.live.slice(0);
            for (k = 0; k < u.length; k++) {
                i = u[k];
                i.origType.replace(O, "") === a.type ? f.push(i.selector) : u.splice(k--, 1);
            }
            j = c(a.target).closest(f, a.currentTarget);
            n = 0;
            for (r = j.length; n < r; n++) {
                for (k = 0; k < u.length; k++) {
                    i = u[k];
                    if (j[n].selector === i.selector) {
                        o = j[n].elem;
                        f = null;
                        if (i.preType === "mouseenter" || i.preType === "mouseleave") {
                            f = c(a.relatedTarget).closest(i.selector)[0];
                        }
                        if (!f || f !== o) {
                            d.push({
                                elem: o,
                                handleObj: i
                            });
                        }
                    }
                }
            }
            n = 0;
            for (r = d.length; n < r; n++) {
                j = d[n];
                a.currentTarget = j.elem;
                a.data = j.handleObj.data;
                a.handleObj = j.handleObj;
                if (j.handleObj.origHandler.apply(j.elem, e) === false) {
                    b = false;
                    break;
                }
            }
            return b;
        }
    }
    function pa(a, b) {
        return "live." + (a && a !== "*" ? a + ".": "") + b.replace(/\./g, "`").replace(/ /g, "&");
    }
    function qa(a) {
        return ! a || !a.parentNode || a.parentNode.nodeType === 11;
    }
    function ra(a, b) {
        var d = 0;
        b.each(function() {
            if (this.nodeName === (a[d] && a[d].nodeName)) {
                var f = c.data(a[d++]),
                e = c.data(this, f);
                if (f = f && f.events) {
                    delete e.handle;
                    e.events = {};
                    for (var j in f) {
                        for (var i in f[j]) {
                            c.event.add(this, j, f[j][i], f[j][i].data);
                        }
                    }
                }
            }
        });
    }
    function sa(a, b, d) {
        var f, e, j;
        b = b && b[0] ? b[0].ownerDocument || b[0] : s;
        if (a.length === 1 && typeof a[0] === "string" && a[0].length < 512 && b === s && !ta.test(a[0]) && (c.support.checkClone || !ua.test(a[0]))) {
            e = true;
            if (j = c.fragments[a[0]]) {
                if (j !== 1) {
                    f = j;
                }
            }
        }
        if (!f) {
            f = b.createDocumentFragment();
            c.clean(a, b, f, d);
        }
        if (e) {
            c.fragments[a[0]] = j ? f: 1;
        }
        return {
            fragment: f,
            cacheable: e
        };
    }
    function K(a, b) {
        var d = {};
        c.each(va.concat.apply([], va.slice(0, b)),
        function() {
            d[this] = a;
        });
        return d;
    }
    function wa(a) {
        return "scrollTo" in a && a.document ? a: a.nodeType === 9 ? a.defaultView || a.parentWindow: false;
    }
    var c = function(a, b) {
        return new c.fn.init(a, b);
    },
    Ra = A.jQuery,
    Sa = A.$,
    s = A.document,
    T,
    Ta = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,
    Ua = /^.[^:#\[\.,]*$/,
    Va = /\S/,
    Wa = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
    Xa = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
    P = navigator.userAgent,
    xa = false,
    Q = [],
    L,
    $ = Object.prototype.toString,
    aa = Object.prototype.hasOwnProperty,
    ba = Array.prototype.push,
    R = Array.prototype.slice,
    ya = Array.prototype.indexOf;
    c.fn = c.prototype = {
        init: function(a, b) {
            var d, f;
            if (!a) {
                return this;
            }
            if (a.nodeType) {
                this.context = this[0] = a;
                this.length = 1;
                return this;
            }
            if (a === "body" && !b) {
                this.context = s;
                this[0] = s.body;
                this.selector = "body";
                this.length = 1;
                return this;
            }
            if (typeof a === "string") {
                if ((d = Ta.exec(a)) && (d[1] || !b)) {
                    if (d[1]) {
                        f = b ? b.ownerDocument || b: s;
                        if (a = Xa.exec(a)) {
                            if (c.isPlainObject(b)) {
                                a = [s.createElement(a[1])];
                                c.fn.attr.call(a, b, true);
                            } else {
                                a = [f.createElement(a[1])];
                            }
                        } else {
                            a = sa([d[1]], [f]);
                            a = (a.cacheable ? a.fragment.cloneNode(true) : a.fragment).childNodes;
                        }
                        return c.merge(this, a);
                    } else {
                        if (b = s.getElementById(d[2])) {
                            if (b.id !== d[2]) {
                                return T.find(a);
                            }
                            this.length = 1;
                            this[0] = b;
                        }
                        this.context = s;
                        this.selector = a;
                        return this;
                    }
                } else {
                    if (!b && /^\w+$/.test(a)) {
                        this.selector = a;
                        this.context = s;
                        a = s.getElementsByTagName(a);
                        return c.merge(this, a);
                    } else {
                        return ! b || b.jquery ? (b || T).find(a) : c(b).find(a);
                    }
                }
            } else {
                if (c.isFunction(a)) {
                    return T.ready(a);
                }
            }
            if (a.selector !== w) {
                this.selector = a.selector;
                this.context = a.context;
            }
            return c.makeArray(a, this);
        },
        selector: "",
        jquery: "1.4.2",
        length: 0,
        size: function() {
            return this.length;
        },
        toArray: function() {
            return R.call(this, 0);
        },
        get: function(a) {
            return a == null ? this.toArray() : a < 0 ? this.slice(a)[0] : this[a];
        },
        pushStack: function(a, b, d) {
            var f = c();
            c.isArray(a) ? ba.apply(f, a) : c.merge(f, a);
            f.prevObject = this;
            f.context = this.context;
            if (b === "find") {
                f.selector = this.selector + (this.selector ? " ": "") + d;
            } else {
                if (b) {
                    f.selector = this.selector + "." + b + "(" + d + ")";
                }
            }
            return f;
        },
        each: function(a, b) {
            return c.each(this, a, b);
        },
        ready: function(a) {
            c.bindReady();
            if (c.isReady) {
                a.call(s, c);
            } else {
                Q && Q.push(a);
            }
            return this;
        },
        eq: function(a) {
            return a === -1 ? this.slice(a) : this.slice(a, +a + 1);
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq( - 1);
        },
        slice: function() {
            return this.pushStack(R.apply(this, arguments), "slice", R.call(arguments).join(","));
        },
        map: function(a) {
            return this.pushStack(c.map(this,
            function(b, d) {
                return a.call(b, d, b);
            }));
        },
        end: function() {
            return this.prevObject || c(null);
        },
        push: ba,
        sort: [].sort,
        splice: [].splice
    };
    c.fn.init.prototype = c.fn;
    c.extend = c.fn.extend = function() {
        var a = arguments[0] || {},
        b = 1,
        d = arguments.length,
        f = false,
        e,
        j,
        i,
        o;
        if (typeof a === "boolean") {
            f = a;
            a = arguments[1] || {};
            b = 2;
        }
        if (typeof a !== "object" && !c.isFunction(a)) {
            a = {};
        }
        if (d === b) {
            a = this; --b;
        }
        for (; b < d; b++) {
            if ((e = arguments[b]) != null) {
                for (j in e) {
                    i = a[j];
                    o = e[j];
                    if (a !== o) {
                        if (f && o && (c.isPlainObject(o) || c.isArray(o))) {
                            i = i && (c.isPlainObject(i) || c.isArray(i)) ? i: c.isArray(o) ? [] : {};
                            a[j] = c.extend(f, i, o);
                        } else {
                            if (o !== w) {
                                a[j] = o;
                            }
                        }
                    }
                }
            }
        }
        return a;
    };
    c.extend({
        noConflict: function(a) {
            A.$ = Sa;
            if (a) {
                A.jQuery = Ra;
            }
            return c;
        },
        isReady: false,
        ready: function() {
            if (!c.isReady) {
                if (!s.body) {
                    return setTimeout(c.ready, 13);
                }
                c.isReady = true;
                if (Q) {
                    for (var a, b = 0; a = Q[b++];) {
                        a.call(s, c);
                    }
                    Q = null;
                }
                c.fn.triggerHandler && c(s).triggerHandler("ready");
            }
        },
        bindReady: function() {
            if (!xa) {
                xa = true;
                if (s.readyState === "complete") {
                    return c.ready();
                }
                if (s.addEventListener) {
                    s.addEventListener("DOMContentLoaded", L, false);
                    A.addEventListener("load", c.ready, false);
                } else {
                    if (s.attachEvent) {
                        s.attachEvent("onreadystatechange", L);
                        A.attachEvent("onload", c.ready);
                        var a = false;
                        try {
                            a = A.frameElement == null;
                        } catch(b) {}
                        s.documentElement.doScroll && a && ma();
                    }
                }
            }
        },
        isFunction: function(a) {
            return $.call(a) === "[object Function]";
        },
        isArray: function(a) {
            return $.call(a) === "[object Array]";
        },
        isPlainObject: function(a) {
            if (!a || $.call(a) !== "[object Object]" || a.nodeType || a.setInterval) {
                return false;
            }
            if (a.constructor && !aa.call(a, "constructor") && !aa.call(a.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
            var b;
            for (b in a) {}
            return b === w || aa.call(a, b);
        },
        isEmptyObject: function(a) {
            for (var b in a) {
                return false;
            }
            return true;
        },
        error: function(a) {
            throw a;
        },
        parseJSON: function(a) {
            if (typeof a !== "string" || !a) {
                return null;
            }
            a = c.trim(a);
            if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                return A.JSON && A.JSON.parse ? A.JSON.parse(a) : (new Function("return " + a))();
            } else {
                c.error("Invalid JSON: " + a);
            }
        },
        noop: function() {},
        globalEval: function(a) {
            if (a && Va.test(a)) {
                var b = s.getElementsByTagName("head")[0] || s.documentElement,
                d = s.createElement("script");
                d.type = "text/javascript";
                if (c.support.scriptEval) {
                    d.appendChild(s.createTextNode(a));
                } else {
                    d.text = a;
                }
                b.insertBefore(d, b.firstChild);
                b.removeChild(d);
            }
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase();
        },
        each: function(a, b, d) {
            var f, e = 0,
            j = a.length,
            i = j === w || c.isFunction(a);
            if (d) {
                if (i) {
                    for (f in a) {
                        if (b.apply(a[f], d) === false) {
                            break;
                        }
                    }
                } else {
                    for (; e < j;) {
                        if (b.apply(a[e++], d) === false) {
                            break;
                        }
                    }
                }
            } else {
                if (i) {
                    for (f in a) {
                        if (b.call(a[f], f, a[f]) === false) {
                            break;
                        }
                    }
                } else {
                    for (d = a[0]; e < j && b.call(d, e, d) !== false; d = a[++e]) {}
                }
            }
            return a;
        },
        trim: function(a) {
            return (a || "").replace(Wa, "");
        },
        makeArray: function(a, b) {
            b = b || [];
            if (a != null) {
                a.length == null || typeof a === "string" || c.isFunction(a) || typeof a !== "function" && a.setInterval ? ba.call(b, a) : c.merge(b, a);
            }
            return b;
        },
        inArray: function(a, b) {
            if (b.indexOf) {
                return b.indexOf(a);
            }
            for (var d = 0, f = b.length; d < f; d++) {
                if (b[d] === a) {
                    return d;
                }
            }
            return - 1;
        },
        merge: function(a, b) {
            var d = a.length,
            f = 0;
            if (typeof b.length === "number") {
                for (var e = b.length; f < e; f++) {
                    a[d++] = b[f];
                }
            } else {
                for (; b[f] !== w;) {
                    a[d++] = b[f++];
                }
            }
            a.length = d;
            return a;
        },
        grep: function(a, b, d) {
            for (var f = [], e = 0, j = a.length; e < j; e++) { ! d !== !b(a[e], e) && f.push(a[e]);
            }
            return f;
        },
        map: function(a, b, d) {
            for (var f = [], e, j = 0, i = a.length; j < i; j++) {
                e = b(a[j], j, d);
                if (e != null) {
                    f[f.length] = e;
                }
            }
            return f.concat.apply([], f);
        },
        guid: 1,
        proxy: function(a, b, d) {
            if (arguments.length === 2) {
                if (typeof b === "string") {
                    d = a;
                    a = d[b];
                    b = w;
                } else {
                    if (b && !c.isFunction(b)) {
                        d = b;
                        b = w;
                    }
                }
            }
            if (!b && a) {
                b = function() {
                    return a.apply(d || this, arguments);
                };
            }
            if (a) {
                b.guid = a.guid = a.guid || b.guid || c.guid++;
            }
            return b;
        },
        uaMatch: function(a) {
            a = a.toLowerCase();
            a = /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || !/compatible/.test(a) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(a) || [];
            return {
                browser: a[1] || "",
                version: a[2] || "0"
            };
        },
        browser: {}
    });
    P = c.uaMatch(P);
    if (P.browser) {
        c.browser[P.browser] = true;
        c.browser.version = P.version;
    }
    if (c.browser.webkit) {
        c.browser.safari = true;
    }
    if (ya) {
        c.inArray = function(a, b) {
            return ya.call(b, a);
        };
    }
    T = c(s);
    if (s.addEventListener) {
        L = function() {
            s.removeEventListener("DOMContentLoaded", L, false);
            c.ready();
        };
    } else {
        if (s.attachEvent) {
            L = function() {
                if (s.readyState === "complete") {
                    s.detachEvent("onreadystatechange", L);
                    c.ready();
                }
            };
        }
    } (function() {
        c.support = {};
        var a = s.documentElement,
        b = s.createElement("script"),
        d = s.createElement("div"),
        f = "script" + J();
        d.style.display = "none";
        d.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
        var e = d.getElementsByTagName("*"),
        j = d.getElementsByTagName("a")[0];
        if (! (!e || !e.length || !j)) {
            c.support = {
                leadingWhitespace: d.firstChild.nodeType === 3,
                tbody: !d.getElementsByTagName("tbody").length,
                htmlSerialize: !!d.getElementsByTagName("link").length,
                style: /red/.test(j.getAttribute("style")),
                hrefNormalized: j.getAttribute("href") === "/a",
                opacity: /^0.55$/.test(j.style.opacity),
                cssFloat: !!j.style.cssFloat,
                checkOn: d.getElementsByTagName("input")[0].value === "on",
                optSelected: s.createElement("select").appendChild(s.createElement("option")).selected,
                parentNode: d.removeChild(d.appendChild(s.createElement("div"))).parentNode === null,
                deleteExpando: true,
                checkClone: false,
                scriptEval: false,
                noCloneEvent: true,
                boxModel: null
            };
            b.type = "text/javascript";
            try {
                b.appendChild(s.createTextNode("window." + f + "=1;"));
            } catch(i) {}
            a.insertBefore(b, a.firstChild);
            if (A[f]) {
                c.support.scriptEval = true;
                delete A[f];
            }
            try {
                delete b.test;
            } catch(o) {
                c.support.deleteExpando = false;
            }
            a.removeChild(b);
            if (d.attachEvent && d.fireEvent) {
                d.attachEvent("onclick",
                function k() {
                    c.support.noCloneEvent = false;
                    d.detachEvent("onclick", k);
                });
                d.cloneNode(true).fireEvent("onclick");
            }
            d = s.createElement("div");
            d.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
            a = s.createDocumentFragment();
            a.appendChild(d.firstChild);
            c.support.checkClone = a.cloneNode(true).cloneNode(true).lastChild.checked;
            c(function() {
                var k = s.createElement("div");
                k.style.width = k.style.paddingLeft = "1px";
                s.body.appendChild(k);
                c.boxModel = c.support.boxModel = k.offsetWidth === 2;
                s.body.removeChild(k).style.display = "none";
            });
            a = function(k) {
                var n = s.createElement("div");
                k = "on" + k;
                var r = k in n;
                if (!r) {
                    n.setAttribute(k, "return;");
                    r = typeof n[k] === "function";
                }
                return r;
            };
            c.support.submitBubbles = a("submit");
            c.support.changeBubbles = a("change");
            a = b = d = e = j = null;
        }
    })();
    c.props = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    };
    var G = "jQuery" + J(),
    Ya = 0,
    za = {};
    c.extend({
        cache: {},
        expando: G,
        noData: {
            embed: true,
            object: true,
            applet: true
        },
        data: function(a, b, d) {
            if (! (a.nodeName && c.noData[a.nodeName.toLowerCase()])) {
                a = a == A ? za: a;
                var f = a[G],
                e = c.cache;
                if (!f && typeof b === "string" && d === w) {
                    return null;
                }
                f || (f = ++Ya);
                if (typeof b === "object") {
                    a[G] = f;
                    e[f] = c.extend(true, {},
                    b);
                } else {
                    if (!e[f]) {
                        a[G] = f;
                        e[f] = {};
                    }
                }
                a = e[f];
                if (d !== w) {
                    a[b] = d;
                }
                return typeof b === "string" ? a[b] : a;
            }
        },
        removeData: function(a, b) {
            if (! (a.nodeName && c.noData[a.nodeName.toLowerCase()])) {
                a = a == A ? za: a;
                var d = a[G],
                f = c.cache,
                e = f[d];
                if (b) {
                    if (e) {
                        delete e[b];
                        c.isEmptyObject(e) && c.removeData(a);
                    }
                } else {
                    if (c.support.deleteExpando) {
                        delete a[c.expando];
                    } else {
                        a.removeAttribute && a.removeAttribute(c.expando);
                    }
                    delete f[d];
                }
            }
        }
    });
    c.fn.extend({
        data: function(a, b) {
            if (typeof a === "undefined" && this.length) {
                return c.data(this[0]);
            } else {
                if (typeof a === "object") {
                    return this.each(function() {
                        c.data(this, a);
                    });
                }
            }
            var d = a.split(".");
            d[1] = d[1] ? "." + d[1] : "";
            if (b === w) {
                var f = this.triggerHandler("getData" + d[1] + "!", [d[0]]);
                if (f === w && this.length) {
                    f = c.data(this[0], a);
                }
                return f === w && d[1] ? this.data(d[0]) : f;
            } else {
                return this.trigger("setData" + d[1] + "!", [d[0], b]).each(function() {
                    c.data(this, a, b);
                });
            }
        },
        removeData: function(a) {
            return this.each(function() {
                c.removeData(this, a);
            });
        }
    });
    c.extend({
        queue: function(a, b, d) {
            if (a) {
                b = (b || "fx") + "queue";
                var f = c.data(a, b);
                if (!d) {
                    return f || [];
                }
                if (!f || c.isArray(d)) {
                    f = c.data(a, b, c.makeArray(d));
                } else {
                    f.push(d);
                }
                return f;
            }
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var d = c.queue(a, b),
            f = d.shift();
            if (f === "inprogress") {
                f = d.shift();
            }
            if (f) {
                b === "fx" && d.unshift("inprogress");
                f.call(a,
                function() {
                    c.dequeue(a, b);
                });
            }
        }
    });
    c.fn.extend({
        queue: function(a, b) {
            if (typeof a !== "string") {
                b = a;
                a = "fx";
            }
            if (b === w) {
                return c.queue(this[0], a);
            }
            return this.each(function() {
                var d = c.queue(this, a, b);
                a === "fx" && d[0] !== "inprogress" && c.dequeue(this, a);
            });
        },
        dequeue: function(a) {
            return this.each(function() {
                c.dequeue(this, a);
            });
        },
        delay: function(a, b) {
            a = c.fx ? c.fx.speeds[a] || a: a;
            b = b || "fx";
            return this.queue(b,
            function() {
                var d = this;
                setTimeout(function() {
                    c.dequeue(d, b);
                },
                a);
            });
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", []);
        }
    });
    var Aa = /[\n\t]/g,
    ca = /\s+/,
    Za = /\r/g,
    $a = /href|src|style/,
    ab = /(button|input)/i,
    bb = /(button|input|object|select|textarea)/i,
    cb = /^(a|area)$/i,
    Ba = /radio|checkbox/;
    c.fn.extend({
        attr: function(a, b) {
            return X(this, a, b, true, c.attr);
        },
        removeAttr: function(a) {
            return this.each(function() {
                c.attr(this, a, "");
                this.nodeType === 1 && this.removeAttribute(a);
            });
        },
        addClass: function(a) {
            if (c.isFunction(a)) {
                return this.each(function(n) {
                    var r = c(this);
                    r.addClass(a.call(this, n, r.attr("class")));
                });
            }
            if (a && typeof a === "string") {
                for (var b = (a || "").split(ca), d = 0, f = this.length; d < f; d++) {
                    var e = this[d];
                    if (e.nodeType === 1) {
                        if (e.className) {
                            for (var j = " " + e.className + " ", i = e.className, o = 0, k = b.length; o < k; o++) {
                                if (j.indexOf(" " + b[o] + " ") < 0) {
                                    i += " " + b[o];
                                }
                            }
                            e.className = c.trim(i);
                        } else {
                            e.className = a;
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function(a) {
            if (c.isFunction(a)) {
                return this.each(function(k) {
                    var n = c(this);
                    n.removeClass(a.call(this, k, n.attr("class")));
                });
            }
            if (a && typeof a === "string" || a === w) {
                for (var b = (a || "").split(ca), d = 0, f = this.length; d < f; d++) {
                    var e = this[d];
                    if (e.nodeType === 1 && e.className) {
                        if (a) {
                            for (var j = (" " + e.className + " ").replace(Aa, " "), i = 0, o = b.length; i < o; i++) {
                                j = j.replace(" " + b[i] + " ", " ");
                            }
                            e.className = c.trim(j);
                        } else {
                            e.className = "";
                        }
                    }
                }
            }
            return this;
        },
        toggleClass: function(a, b) {
            var d = typeof a,
            f = typeof b === "boolean";
            if (c.isFunction(a)) {
                return this.each(function(e) {
                    var j = c(this);
                    j.toggleClass(a.call(this, e, j.attr("class"), b), b);
                });
            }
            return this.each(function() {
                if (d === "string") {
                    for (var e, j = 0, i = c(this), o = b, k = a.split(ca); e = k[j++];) {
                        o = f ? o: !i.hasClass(e);
                        i[o ? "addClass": "removeClass"](e);
                    }
                } else {
                    if (d === "undefined" || d === "boolean") {
                        this.className && c.data(this, "__className__", this.className);
                        this.className = this.className || a === false ? "": c.data(this, "__className__") || "";
                    }
                }
            });
        },
        hasClass: function(a) {
            a = " " + a + " ";
            for (var b = 0, d = this.length; b < d; b++) {
                if ((" " + this[b].className + " ").replace(Aa, " ").indexOf(a) > -1) {
                    return true;
                }
            }
            return false;
        },
        val: function(a) {
            if (a === w) {
                var b = this[0];
                if (b) {
                    if (c.nodeName(b, "option")) {
                        return (b.attributes.value || {}).specified ? b.value: b.text;
                    }
                    if (c.nodeName(b, "select")) {
                        var d = b.selectedIndex,
                        f = [],
                        e = b.options;
                        b = b.type === "select-one";
                        if (d < 0) {
                            return null;
                        }
                        var j = b ? d: 0;
                        for (d = b ? d + 1 : e.length; j < d; j++) {
                            var i = e[j];
                            if (i.selected) {
                                a = c(i).val();
                                if (b) {
                                    return a;
                                }
                                f.push(a);
                            }
                        }
                        return f;
                    }
                    if (Ba.test(b.type) && !c.support.checkOn) {
                        return b.getAttribute("value") === null ? "on": b.value;
                    }
                    return (b.value || "").replace(Za, "");
                }
                return w;
            }
            var o = c.isFunction(a);
            return this.each(function(k) {
                var n = c(this),
                r = a;
                if (this.nodeType === 1) {
                    if (o) {
                        r = a.call(this, k, n.val());
                    }
                    if (typeof r === "number") {
                        r += "";
                    }
                    if (c.isArray(r) && Ba.test(this.type)) {
                        this.checked = c.inArray(n.val(), r) >= 0;
                    } else {
                        if (c.nodeName(this, "select")) {
                            var u = c.makeArray(r);
                            c("option", this).each(function() {
                                this.selected = c.inArray(c(this).val(), u) >= 0;
                            });
                            if (!u.length) {
                                this.selectedIndex = -1;
                            }
                        } else {
                            this.value = r;
                        }
                    }
                }
            });
        }
    });
    c.extend({
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },
        attr: function(a, b, d, f) {
            if (!a || a.nodeType === 3 || a.nodeType === 8) {
                return w;
            }
            if (f && b in c.attrFn) {
                return c(a)[b](d);
            }
            f = a.nodeType !== 1 || !c.isXMLDoc(a);
            var e = d !== w;
            b = f && c.props[b] || b;
            if (a.nodeType === 1) {
                var j = $a.test(b);
                if (b in a && f && !j) {
                    if (e) {
                        b === "type" && ab.test(a.nodeName) && a.parentNode && c.error("type property can't be changed");
                        a[b] = d;
                    }
                    if (c.nodeName(a, "form") && a.getAttributeNode(b)) {
                        return a.getAttributeNode(b).nodeValue;
                    }
                    if (b === "tabIndex") {
                        return (b = a.getAttributeNode("tabIndex")) && b.specified ? b.value: bb.test(a.nodeName) || cb.test(a.nodeName) && a.href ? 0 : w;
                    }
                    return a[b];
                }
                if (!c.support.style && f && b === "style") {
                    if (e) {
                        a.style.cssText = "" + d;
                    }
                    return a.style.cssText;
                }
                e && a.setAttribute(b, "" + d);
                a = !c.support.hrefNormalized && f && j ? a.getAttribute(b, 2) : a.getAttribute(b);
                return a === null ? w: a;
            }
            return c.style(a, b, d);
        }
    });
    var O = /\.(.*)$/,
    db = function(a) {
        return a.replace(/[^\w\s\.\|`]/g,
        function(b) {
            return "\\" + b;
        });
    };
    c.event = {
        add: function(a, b, d, f) {
            if (! (a.nodeType === 3 || a.nodeType === 8)) {
                if (a.setInterval && a !== A && !a.frameElement) {
                    a = A;
                }
                var e, j;
                if (d.handler) {
                    e = d;
                    d = e.handler;
                }
                if (!d.guid) {
                    d.guid = c.guid++;
                }
                if (j = c.data(a)) {
                    var i = j.events = j.events || {},
                    o = j.handle;
                    if (!o) {
                        j.handle = o = function() {
                            return typeof c !== "undefined" && !c.event.triggered ? c.event.handle.apply(o.elem, arguments) : w;
                        };
                    }
                    o.elem = a;
                    b = b.split(" ");
                    for (var k, n = 0, r; k = b[n++];) {
                        j = e ? c.extend({},
                        e) : {
                            handler: d,
                            data: f
                        };
                        if (k.indexOf(".") > -1) {
                            r = k.split(".");
                            k = r.shift();
                            j.namespace = r.slice(0).sort().join(".");
                        } else {
                            r = [];
                            j.namespace = "";
                        }
                        j.type = k;
                        j.guid = d.guid;
                        var u = i[k],
                        z = c.event.special[k] || {};
                        if (!u) {
                            u = i[k] = [];
                            if (!z.setup || z.setup.call(a, f, r, o) === false) {
                                if (a.addEventListener) {
                                    a.addEventListener(k, o, false);
                                } else {
                                    a.attachEvent && a.attachEvent("on" + k, o);
                                }
                            }
                        }
                        if (z.add) {
                            z.add.call(a, j);
                            if (!j.handler.guid) {
                                j.handler.guid = d.guid;
                            }
                        }
                        u.push(j);
                        c.event.global[k] = true;
                    }
                    a = null;
                }
            }
        },
        global: {},
        remove: function(a, b, d, f) {
            if (! (a.nodeType === 3 || a.nodeType === 8)) {
                var e, j = 0,
                i, o, k, n, r, u, z = c.data(a),
                C = z && z.events;
                if (z && C) {
                    if (b && b.type) {
                        d = b.handler;
                        b = b.type;
                    }
                    if (!b || typeof b === "string" && b.charAt(0) === ".") {
                        b = b || "";
                        for (e in C) {
                            c.event.remove(a, e + b);
                        }
                    } else {
                        for (b = b.split(" "); e = b[j++];) {
                            n = e;
                            i = e.indexOf(".") < 0;
                            o = [];
                            if (!i) {
                                o = e.split(".");
                                e = o.shift();
                                k = new RegExp("(^|\\.)" + c.map(o.slice(0).sort(), db).join("\\.(?:.*\\.)?") + "(\\.|$)");
                            }
                            if (r = C[e]) {
                                if (d) {
                                    n = c.event.special[e] || {};
                                    for (B = f || 0; B < r.length; B++) {
                                        u = r[B];
                                        if (d.guid === u.guid) {
                                            if (i || k.test(u.namespace)) {
                                                f == null && r.splice(B--, 1);
                                                n.remove && n.remove.call(a, u);
                                            }
                                            if (f != null) {
                                                break;
                                            }
                                        }
                                    }
                                    if (r.length === 0 || f != null && r.length === 1) {
                                        if (!n.teardown || n.teardown.call(a, o) === false) {
                                            Ca(a, e, z.handle);
                                        }
                                        delete C[e];
                                    }
                                } else {
                                    for (var B = 0; B < r.length; B++) {
                                        u = r[B];
                                        if (i || k.test(u.namespace)) {
                                            c.event.remove(a, n, u.handler, B);
                                            r.splice(B--, 1);
                                        }
                                    }
                                }
                            }
                        }
                        if (c.isEmptyObject(C)) {
                            if (b = z.handle) {
                                b.elem = null;
                            }
                            delete z.events;
                            delete z.handle;
                            c.isEmptyObject(z) && c.removeData(a);
                        }
                    }
                }
            }
        },
        trigger: function(a, b, d, f) {
            var e = a.type || a;
            if (!f) {
                a = typeof a === "object" ? a[G] ? a: c.extend(c.Event(e), a) : c.Event(e);
                if (e.indexOf("!") >= 0) {
                    a.type = e = e.slice(0, -1);
                    a.exclusive = true;
                }
                if (!d) {
                    a.stopPropagation();
                    c.event.global[e] && c.each(c.cache,
                    function() {
                        this.events && this.events[e] && c.event.trigger(a, b, this.handle.elem);
                    });
                }
                if (!d || d.nodeType === 3 || d.nodeType === 8) {
                    return w;
                }
                a.result = w;
                a.target = d;
                b = c.makeArray(b);
                b.unshift(a);
            }
            a.currentTarget = d;
            (f = c.data(d, "handle")) && f.apply(d, b);
            f = d.parentNode || d.ownerDocument;
            try {
                if (! (d && d.nodeName && c.noData[d.nodeName.toLowerCase()])) {
                    if (d["on" + e] && d["on" + e].apply(d, b) === false) {
                        a.result = false;
                    }
                }
            } catch(j) {}
            if (!a.isPropagationStopped() && f) {
                c.event.trigger(a, b, f, true);
            } else {
                if (!a.isDefaultPrevented()) {
                    f = a.target;
                    var i, o = c.nodeName(f, "a") && e === "click",
                    k = c.event.special[e] || {};
                    if ((!k._default || k._default.call(d, a) === false) && !o && !(f && f.nodeName && c.noData[f.nodeName.toLowerCase()])) {
                        try {
                            if (f[e]) {
                                if (i = f["on" + e]) {
                                    f["on" + e] = null;
                                }
                                c.event.triggered = true;
                                f[e]();
                            }
                        } catch(n) {}
                        if (i) {
                            f["on" + e] = i;
                        }
                        c.event.triggered = false;
                    }
                }
            }
        },
        handle: function(a) {
            var b, d, f, e;
            a = arguments[0] = c.event.fix(a || A.event);
            a.currentTarget = this;
            b = a.type.indexOf(".") < 0 && !a.exclusive;
            if (!b) {
                d = a.type.split(".");
                a.type = d.shift();
                f = new RegExp("(^|\\.)" + d.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
            }
            e = c.data(this, "events");
            d = e[a.type];
            if (e && d) {
                d = d.slice(0);
                e = 0;
                for (var j = d.length; e < j; e++) {
                    var i = d[e];
                    if (b || f.test(i.namespace)) {
                        a.handler = i.handler;
                        a.data = i.data;
                        a.handleObj = i;
                        i = i.handler.apply(this, arguments);
                        if (i !== w) {
                            a.result = i;
                            if (i === false) {
                                a.preventDefault();
                                a.stopPropagation();
                            }
                        }
                        if (a.isImmediatePropagationStopped()) {
                            break;
                        }
                    }
                }
            }
            return a.result;
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function(a) {
            if (a[G]) {
                return a;
            }
            var b = a;
            a = c.Event(b);
            for (var d = this.props.length, f; d;) {
                f = this.props[--d];
                a[f] = b[f];
            }
            if (!a.target) {
                a.target = a.srcElement || s;
            }
            if (a.target.nodeType === 3) {
                a.target = a.target.parentNode;
            }
            if (!a.relatedTarget && a.fromElement) {
                a.relatedTarget = a.fromElement === a.target ? a.toElement: a.fromElement;
            }
            if (a.pageX == null && a.clientX != null) {
                b = s.documentElement;
                d = s.body;
                a.pageX = a.clientX + (b && b.scrollLeft || d && d.scrollLeft || 0) - (b && b.clientLeft || d && d.clientLeft || 0);
                a.pageY = a.clientY + (b && b.scrollTop || d && d.scrollTop || 0) - (b && b.clientTop || d && d.clientTop || 0);
            }
            if (!a.which && (a.charCode || a.charCode === 0 ? a.charCode: a.keyCode)) {
                a.which = a.charCode || a.keyCode;
            }
            if (!a.metaKey && a.ctrlKey) {
                a.metaKey = a.ctrlKey;
            }
            if (!a.which && a.button !== w) {
                a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0;
            }
            return a;
        },
        guid: 100000000,
        proxy: c.proxy,
        special: {
            ready: {
                setup: c.bindReady,
                teardown: c.noop
            },
            live: {
                add: function(a) {
                    c.event.add(this, a.origType, c.extend({},
                    a, {
                        handler: oa
                    }));
                },
                remove: function(a) {
                    var b = true,
                    d = a.origType.replace(O, "");
                    c.each(c.data(this, "events").live || [],
                    function() {
                        if (d === this.origType.replace(O, "")) {
                            return b = false;
                        }
                    });
                    b && c.event.remove(this, a.origType, oa);
                }
            },
            beforeunload: {
                setup: function(a, b, d) {
                    if (this.setInterval) {
                        this.onbeforeunload = d;
                    }
                    return false;
                },
                teardown: function(a, b) {
                    if (this.onbeforeunload === b) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };
    var Ca = s.removeEventListener ?
    function(a, b, d) {
        a.removeEventListener(b, d, false);
    }: function(a, b, d) {
        a.detachEvent("on" + b, d);
    };
    c.Event = function(a) {
        if (!this.preventDefault) {
            return new c.Event(a);
        }
        if (a && a.type) {
            this.originalEvent = a;
            this.type = a.type;
        } else {
            this.type = a;
        }
        this.timeStamp = J();
        this[G] = true;
    };
    c.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = Z;
            var a = this.originalEvent;
            if (a) {
                a.preventDefault && a.preventDefault();
                a.returnValue = false;
            }
        },
        stopPropagation: function() {
            this.isPropagationStopped = Z;
            var a = this.originalEvent;
            if (a) {
                a.stopPropagation && a.stopPropagation();
                a.cancelBubble = true;
            }
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = Z;
            this.stopPropagation();
        },
        isDefaultPrevented: Y,
        isPropagationStopped: Y,
        isImmediatePropagationStopped: Y
    };
    var Da = function(a) {
        var b = a.relatedTarget;
        try {
            for (; b && b !== this;) {
                b = b.parentNode;
            }
            if (b !== this) {
                a.type = a.data;
                c.event.handle.apply(this, arguments);
            }
        } catch(d) {}
    },
    Ea = function(a) {
        a.type = a.data;
        c.event.handle.apply(this, arguments);
    };
    c.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    },
    function(a, b) {
        c.event.special[a] = {
            setup: function(d) {
                c.event.add(this, b, d && d.selector ? Ea: Da, a);
            },
            teardown: function(d) {
                c.event.remove(this, b, d && d.selector ? Ea: Da);
            }
        };
    });
    if (!c.support.submitBubbles) {
        c.event.special.submit = {
            setup: function() {
                if (this.nodeName.toLowerCase() !== "form") {
                    c.event.add(this, "click.specialSubmit",
                    function(a) {
                        var b = a.target,
                        d = b.type;
                        if ((d === "submit" || d === "image") && c(b).closest("form").length) {
                            return na("submit", this, arguments);
                        }
                    });
                    c.event.add(this, "keypress.specialSubmit",
                    function(a) {
                        var b = a.target,
                        d = b.type;
                        if ((d === "text" || d === "password") && c(b).closest("form").length && a.keyCode === 13) {
                            return na("submit", this, arguments);
                        }
                    });
                } else {
                    return false;
                }
            },
            teardown: function() {
                c.event.remove(this, ".specialSubmit");
            }
        };
    }
    if (!c.support.changeBubbles) {
        var da = /textarea|input|select/i,
        ea, Fa = function(a) {
            var b = a.type,
            d = a.value;
            if (b === "radio" || b === "checkbox") {
                d = a.checked;
            } else {
                if (b === "select-multiple") {
                    d = a.selectedIndex > -1 ? c.map(a.options,
                    function(f) {
                        return f.selected;
                    }).join("-") : "";
                } else {
                    if (a.nodeName.toLowerCase() === "select") {
                        d = a.selectedIndex;
                    }
                }
            }
            return d;
        },
        fa = function(a, b) {
            var d = a.target,
            f, e;
            if (! (!da.test(d.nodeName) || d.readOnly)) {
                f = c.data(d, "_change_data");
                e = Fa(d);
                if (a.type !== "focusout" || d.type !== "radio") {
                    c.data(d, "_change_data", e);
                }
                if (! (f === w || e === f)) {
                    if (f != null || e) {
                        a.type = "change";
                        return c.event.trigger(a, b, d);
                    }
                }
            }
        };
        c.event.special.change = {
            filters: {
                focusout: fa,
                click: function(a) {
                    var b = a.target,
                    d = b.type;
                    if (d === "radio" || d === "checkbox" || b.nodeName.toLowerCase() === "select") {
                        return fa.call(this, a);
                    }
                },
                keydown: function(a) {
                    var b = a.target,
                    d = b.type;
                    if (a.keyCode === 13 && b.nodeName.toLowerCase() !== "textarea" || a.keyCode === 32 && (d === "checkbox" || d === "radio") || d === "select-multiple") {
                        return fa.call(this, a);
                    }
                },
                beforeactivate: function(a) {
                    a = a.target;
                    c.data(a, "_change_data", Fa(a));
                }
            },
            setup: function() {
                if (this.type === "file") {
                    return false;
                }
                for (var a in ea) {
                    c.event.add(this, a + ".specialChange", ea[a]);
                }
                return da.test(this.nodeName);
            },
            teardown: function() {
                c.event.remove(this, ".specialChange");
                return da.test(this.nodeName);
            }
        };
        ea = c.event.special.change.filters;
    }
    s.addEventListener && c.each({
        focus: "focusin",
        blur: "focusout"
    },
    function(a, b) {
        function d(f) {
            f = c.event.fix(f);
            f.type = b;
            return c.event.handle.call(this, f);
        }
        c.event.special[b] = {
            setup: function() {
                this.addEventListener(a, d, true);
            },
            teardown: function() {
                this.removeEventListener(a, d, true);
            }
        };
    });
    c.each(["bind", "one"],
    function(a, b) {
        c.fn[b] = function(d, f, e) {
            if (typeof d === "object") {
                for (var j in d) {
                    this[b](j, f, d[j], e);
                }
                return this;
            }
            if (c.isFunction(f)) {
                e = f;
                f = w;
            }
            var i = b === "one" ? c.proxy(e,
            function(k) {
                c(this).unbind(k, i);
                return e.apply(this, arguments);
            }) : e;
            if (d === "unload" && b !== "one") {
                this.one(d, f, e);
            } else {
                j = 0;
                for (var o = this.length; j < o; j++) {
                    c.event.add(this[j], d, i, f);
                }
            }
            return this;
        };
    });
    c.fn.extend({
        unbind: function(a, b) {
            if (typeof a === "object" && !a.preventDefault) {
                for (var d in a) {
                    this.unbind(d, a[d]);
                }
            } else {
                d = 0;
                for (var f = this.length; d < f; d++) {
                    c.event.remove(this[d], a, b);
                }
            }
            return this;
        },
        delegate: function(a, b, d, f) {
            return this.live(b, d, f, a);
        },
        undelegate: function(a, b, d) {
            return arguments.length === 0 ? this.unbind("live") : this.die(b, null, d, a);
        },
        trigger: function(a, b) {
            return this.each(function() {
                c.event.trigger(a, b, this);
            });
        },
        triggerHandler: function(a, b) {
            if (this[0]) {
                a = c.Event(a);
                a.preventDefault();
                a.stopPropagation();
                c.event.trigger(a, b, this[0]);
                return a.result;
            }
        },
        toggle: function(a) {
            for (var b = arguments, d = 1; d < b.length;) {
                c.proxy(a, b[d++]);
            }
            return this.click(c.proxy(a,
            function(f) {
                var e = (c.data(this, "lastToggle" + a.guid) || 0) % d;
                c.data(this, "lastToggle" + a.guid, e + 1);
                f.preventDefault();
                return b[e].apply(this, arguments) || false;
            }));
        },
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a);
        }
    });
    var Ga = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    c.each(["live", "die"],
    function(a, b) {
        c.fn[b] = function(d, f, e, j) {
            var i, o = 0,
            k, n, r = j || this.selector,
            u = j ? this: c(this.context);
            if (c.isFunction(f)) {
                e = f;
                f = w;
            }
            for (d = (d || "").split(" ");
            (i = d[o++]) != null;) {
                j = O.exec(i);
                k = "";
                if (j) {
                    k = j[0];
                    i = i.replace(O, "");
                }
                if (i === "hover") {
                    d.push("mouseenter" + k, "mouseleave" + k);
                } else {
                    n = i;
                    if (i === "focus" || i === "blur") {
                        d.push(Ga[i] + k);
                        i += k;
                    } else {
                        i = (Ga[i] || i) + k;
                    }
                    b === "live" ? u.each(function() {
                        c.event.add(this, pa(i, r), {
                            data: f,
                            selector: r,
                            handler: e,
                            origType: i,
                            origHandler: e,
                            preType: n
                        });
                    }) : u.unbind(pa(i, r), e);
                }
            }
            return this;
        };
    });
    c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),
    function(a, b) {
        c.fn[b] = function(d) {
            return d ? this.bind(b, d) : this.trigger(b);
        };
        if (c.attrFn) {
            c.attrFn[b] = true;
        }
    });
    A.attachEvent && !A.addEventListener && A.attachEvent("onunload",
    function() {
        for (var a in c.cache) {
            if (c.cache[a].handle) {
                try {
                    c.event.remove(c.cache[a].handle.elem);
                } catch(b) {}
            }
        }
    });
    (function() {
        function a(g) {
            for (var h = "", l, m = 0; g[m]; m++) {
                l = g[m];
                if (l.nodeType === 3 || l.nodeType === 4) {
                    h += l.nodeValue;
                } else {
                    if (l.nodeType !== 8) {
                        h += a(l.childNodes);
                    }
                }
            }
            return h;
        }
        function b(g, h, l, m, q, p) {
            q = 0;
            for (var v = m.length; q < v; q++) {
                var t = m[q];
                if (t) {
                    t = t[g];
                    for (var y = false; t;) {
                        if (t.sizcache === l) {
                            y = m[t.sizset];
                            break;
                        }
                        if (t.nodeType === 1 && !p) {
                            t.sizcache = l;
                            t.sizset = q;
                        }
                        if (t.nodeName.toLowerCase() === h) {
                            y = t;
                            break;
                        }
                        t = t[g];
                    }
                    m[q] = y;
                }
            }
        }
        function d(g, h, l, m, q, p) {
            q = 0;
            for (var v = m.length; q < v; q++) {
                var t = m[q];
                if (t) {
                    t = t[g];
                    for (var y = false; t;) {
                        if (t.sizcache === l) {
                            y = m[t.sizset];
                            break;
                        }
                        if (t.nodeType === 1) {
                            if (!p) {
                                t.sizcache = l;
                                t.sizset = q;
                            }
                            if (typeof h !== "string") {
                                if (t === h) {
                                    y = true;
                                    break;
                                }
                            } else {
                                if (k.filter(h, [t]).length > 0) {
                                    y = t;
                                    break;
                                }
                            }
                        }
                        t = t[g];
                    }
                    m[q] = y;
                }
            }
        }
        var f = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        e = 0,
        j = Object.prototype.toString,
        i = false,
        o = true;
        [0, 0].sort(function() {
            o = false;
            return 0;
        });
        var k = function(g, h, l, m) {
            l = l || [];
            var q = h = h || s;
            if (h.nodeType !== 1 && h.nodeType !== 9) {
                return [];
            }
            if (!g || typeof g !== "string") {
                return l;
            }
            for (var p = [], v, t, y, S, H = true, M = x(h), I = g;
            (f.exec(""), v = f.exec(I)) !== null;) {
                I = v[3];
                p.push(v[1]);
                if (v[2]) {
                    S = v[3];
                    break;
                }
            }
            if (p.length > 1 && r.exec(g)) {
                if (p.length === 2 && n.relative[p[0]]) {
                    t = ga(p[0] + p[1], h);
                } else {
                    for (t = n.relative[p[0]] ? [h] : k(p.shift(), h); p.length;) {
                        g = p.shift();
                        if (n.relative[g]) {
                            g += p.shift();
                        }
                        t = ga(g, t);
                    }
                }
            } else {
                if (!m && p.length > 1 && h.nodeType === 9 && !M && n.match.ID.test(p[0]) && !n.match.ID.test(p[p.length - 1])) {
                    v = k.find(p.shift(), h, M);
                    h = v.expr ? k.filter(v.expr, v.set)[0] : v.set[0];
                }
                if (h) {
                    v = m ? {
                        expr: p.pop(),
                        set: z(m)
                    }: k.find(p.pop(), p.length === 1 && (p[0] === "~" || p[0] === "+") && h.parentNode ? h.parentNode: h, M);
                    t = v.expr ? k.filter(v.expr, v.set) : v.set;
                    if (p.length > 0) {
                        y = z(t);
                    } else {
                        H = false;
                    }
                    for (; p.length;) {
                        var D = p.pop();
                        v = D;
                        if (n.relative[D]) {
                            v = p.pop();
                        } else {
                            D = "";
                        }
                        if (v == null) {
                            v = h;
                        }
                        n.relative[D](y, v, M);
                    }
                } else {
                    y = [];
                }
            }
            y || (y = t);
            y || k.error(D || g);
            if (j.call(y) === "[object Array]") {
                if (H) {
                    if (h && h.nodeType === 1) {
                        for (g = 0; y[g] != null; g++) {
                            if (y[g] && (y[g] === true || y[g].nodeType === 1 && E(h, y[g]))) {
                                l.push(t[g]);
                            }
                        }
                    } else {
                        for (g = 0; y[g] != null; g++) {
                            y[g] && y[g].nodeType === 1 && l.push(t[g]);
                        }
                    }
                } else {
                    l.push.apply(l, y);
                }
            } else {
                z(y, l);
            }
            if (S) {
                k(S, q, l, m);
                k.uniqueSort(l);
            }
            return l;
        };
        k.uniqueSort = function(g) {
            if (B) {
                i = o;
                g.sort(B);
                if (i) {
                    for (var h = 1; h < g.length; h++) {
                        g[h] === g[h - 1] && g.splice(h--, 1);
                    }
                }
            }
            return g;
        };
        k.matches = function(g, h) {
            return k(g, null, null, h);
        };
        k.find = function(g, h, l) {
            var m, q;
            if (!g) {
                return [];
            }
            for (var p = 0, v = n.order.length; p < v; p++) {
                var t = n.order[p];
                if (q = n.leftMatch[t].exec(g)) {
                    var y = q[1];
                    q.splice(1, 1);
                    if (y.substr(y.length - 1) !== "\\") {
                        q[1] = (q[1] || "").replace(/\\/g, "");
                        m = n.find[t](q, h, l);
                        if (m != null) {
                            g = g.replace(n.match[t], "");
                            break;
                        }
                    }
                }
            }
            m || (m = h.getElementsByTagName("*"));
            return {
                set: m,
                expr: g
            };
        };
        k.filter = function(g, h, l, m) {
            for (var q = g, p = [], v = h, t, y, S = h && h[0] && x(h[0]); g && h.length;) {
                for (var H in n.filter) {
                    if ((t = n.leftMatch[H].exec(g)) != null && t[2]) {
                        var M = n.filter[H],
                        I,
                        D;
                        D = t[1];
                        y = false;
                        t.splice(1, 1);
                        if (D.substr(D.length - 1) !== "\\") {
                            if (v === p) {
                                p = [];
                            }
                            if (n.preFilter[H]) {
                                if (t = n.preFilter[H](t, v, l, p, m, S)) {
                                    if (t === true) {
                                        continue;
                                    }
                                } else {
                                    y = I = true;
                                }
                            }
                            if (t) {
                                for (var U = 0;
                                (D = v[U]) != null; U++) {
                                    if (D) {
                                        I = M(D, t, U, v);
                                        var Ha = m ^ !!I;
                                        if (l && I != null) {
                                            if (Ha) {
                                                y = true;
                                            } else {
                                                v[U] = false;
                                            }
                                        } else {
                                            if (Ha) {
                                                p.push(D);
                                                y = true;
                                            }
                                        }
                                    }
                                }
                            }
                            if (I !== w) {
                                l || (v = p);
                                g = g.replace(n.match[H], "");
                                if (!y) {
                                    return [];
                                }
                                break;
                            }
                        }
                    }
                }
                if (g === q) {
                    if (y == null) {
                        k.error(g);
                    } else {
                        break;
                    }
                }
                q = g;
            }
            return v;
        };
        k.error = function(g) {
            throw "Syntax error, unrecognized expression: " + g;
        };
        var n = k.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function(g) {
                    return g.getAttribute("href");
                }
            },
            relative: {
                "+": function(g, h) {
                    var l = typeof h === "string",
                    m = l && !/\W/.test(h);
                    l = l && !m;
                    if (m) {
                        h = h.toLowerCase();
                    }
                    m = 0;
                    for (var q = g.length, p; m < q; m++) {
                        if (p = g[m]) {
                            for (;
                            (p = p.previousSibling) && p.nodeType !== 1;) {}
                            g[m] = l || p && p.nodeName.toLowerCase() === h ? p || false: p === h;
                        }
                    }
                    l && k.filter(h, g, true);
                },
                ">": function(g, h) {
                    var l = typeof h === "string";
                    if (l && !/\W/.test(h)) {
                        h = h.toLowerCase();
                        for (var m = 0, q = g.length; m < q; m++) {
                            var p = g[m];
                            if (p) {
                                l = p.parentNode;
                                g[m] = l.nodeName.toLowerCase() === h ? l: false;
                            }
                        }
                    } else {
                        m = 0;
                        for (q = g.length; m < q; m++) {
                            if (p = g[m]) {
                                g[m] = l ? p.parentNode: p.parentNode === h;
                            }
                        }
                        l && k.filter(h, g, true);
                    }
                },
                "": function(g, h, l) {
                    var m = e++,
                    q = d;
                    if (typeof h === "string" && !/\W/.test(h)) {
                        var p = h = h.toLowerCase();
                        q = b;
                    }
                    q("parentNode", h, m, g, p, l);
                },
                "~": function(g, h, l) {
                    var m = e++,
                    q = d;
                    if (typeof h === "string" && !/\W/.test(h)) {
                        var p = h = h.toLowerCase();
                        q = b;
                    }
                    q("previousSibling", h, m, g, p, l);
                }
            },
            find: {
                ID: function(g, h, l) {
                    if (typeof h.getElementById !== "undefined" && !l) {
                        return (g = h.getElementById(g[1])) ? [g] : [];
                    }
                },
                NAME: function(g, h) {
                    if (typeof h.getElementsByName !== "undefined") {
                        var l = [];
                        h = h.getElementsByName(g[1]);
                        for (var m = 0, q = h.length; m < q; m++) {
                            h[m].getAttribute("name") === g[1] && l.push(h[m]);
                        }
                        return l.length === 0 ? null: l;
                    }
                },
                TAG: function(g, h) {
                    return h.getElementsByTagName(g[1]);
                }
            },
            preFilter: {
                CLASS: function(g, h, l, m, q, p) {
                    g = " " + g[1].replace(/\\/g, "") + " ";
                    if (p) {
                        return g;
                    }
                    p = 0;
                    for (var v;
                    (v = h[p]) != null; p++) {
                        if (v) {
                            if (q ^ (v.className && (" " + v.className + " ").replace(/[\t\n]/g, " ").indexOf(g) >= 0)) {
                                l || m.push(v);
                            } else {
                                if (l) {
                                    h[p] = false;
                                }
                            }
                        }
                    }
                    return false;
                },
                ID: function(g) {
                    return g[1].replace(/\\/g, "");
                },
                TAG: function(g) {
                    return g[1].toLowerCase();
                },
                CHILD: function(g) {
                    if (g[1] === "nth") {
                        var h = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2] === "even" && "2n" || g[2] === "odd" && "2n+1" || !/\D/.test(g[2]) && "0n+" + g[2] || g[2]);
                        g[2] = h[1] + (h[2] || 1) - 0;
                        g[3] = h[3] - 0;
                    }
                    g[0] = e++;
                    return g;
                },
                ATTR: function(g, h, l, m, q, p) {
                    h = g[1].replace(/\\/g, "");
                    if (!p && n.attrMap[h]) {
                        g[1] = n.attrMap[h];
                    }
                    if (g[2] === "~=") {
                        g[4] = " " + g[4] + " ";
                    }
                    return g;
                },
                PSEUDO: function(g, h, l, m, q) {
                    if (g[1] === "not") {
                        if ((f.exec(g[3]) || "").length > 1 || /^\w/.test(g[3])) {
                            g[3] = k(g[3], null, null, h);
                        } else {
                            g = k.filter(g[3], h, l, true ^ q);
                            l || m.push.apply(m, g);
                            return false;
                        }
                    } else {
                        if (n.match.POS.test(g[0]) || n.match.CHILD.test(g[0])) {
                            return true;
                        }
                    }
                    return g;
                },
                POS: function(g) {
                    g.unshift(true);
                    return g;
                }
            },
            filters: {
                enabled: function(g) {
                    return g.disabled === false && g.type !== "hidden";
                },
                disabled: function(g) {
                    return g.disabled === true;
                },
                checked: function(g) {
                    return g.checked === true;
                },
                selected: function(g) {
                    return g.selected === true;
                },
                parent: function(g) {
                    return !! g.firstChild;
                },
                empty: function(g) {
                    return ! g.firstChild;
                },
                has: function(g, h, l) {
                    return !! k(l[3], g).length;
                },
                header: function(g) {
                    return /h\d/i.test(g.nodeName);
                },
                text: function(g) {
                    return "text" === g.type;
                },
                radio: function(g) {
                    return "radio" === g.type;
                },
                checkbox: function(g) {
                    return "checkbox" === g.type;
                },
                file: function(g) {
                    return "file" === g.type;
                },
                password: function(g) {
                    return "password" === g.type;
                },
                submit: function(g) {
                    return "submit" === g.type;
                },
                image: function(g) {
                    return "image" === g.type;
                },
                reset: function(g) {
                    return "reset" === g.type;
                },
                button: function(g) {
                    return "button" === g.type || g.nodeName.toLowerCase() === "button";
                },
                input: function(g) {
                    return /input|select|textarea|button/i.test(g.nodeName);
                }
            },
            setFilters: {
                first: function(g, h) {
                    return h === 0;
                },
                last: function(g, h, l, m) {
                    return h === m.length - 1;
                },
                even: function(g, h) {
                    return h % 2 === 0;
                },
                odd: function(g, h) {
                    return h % 2 === 1;
                },
                lt: function(g, h, l) {
                    return h < l[3] - 0;
                },
                gt: function(g, h, l) {
                    return h > l[3] - 0;
                },
                nth: function(g, h, l) {
                    return l[3] - 0 === h;
                },
                eq: function(g, h, l) {
                    return l[3] - 0 === h;
                }
            },
            filter: {
                PSEUDO: function(g, h, l, m) {
                    var q = h[1],
                    p = n.filters[q];
                    if (p) {
                        return p(g, l, h, m);
                    } else {
                        if (q === "contains") {
                            return (g.textContent || g.innerText || a([g]) || "").indexOf(h[3]) >= 0;
                        } else {
                            if (q === "not") {
                                h = h[3];
                                l = 0;
                                for (m = h.length; l < m; l++) {
                                    if (h[l] === g) {
                                        return false;
                                    }
                                }
                                return true;
                            } else {
                                k.error("Syntax error, unrecognized expression: " + q);
                            }
                        }
                    }
                },
                CHILD: function(g, h) {
                    var l = h[1],
                    m = g;
                    switch (l) {
                    case "only":
                    case "first":
                        for (; m = m.previousSibling;) {
                            if (m.nodeType === 1) {
                                return false;
                            }
                        }
                        if (l === "first") {
                            return true;
                        }
                        m = g;
                    case "last":
                        for (; m = m.nextSibling;) {
                            if (m.nodeType === 1) {
                                return false;
                            }
                        }
                        return true;
                    case "nth":
                        l = h[2];
                        var q = h[3];
                        if (l === 1 && q === 0) {
                            return true;
                        }
                        h = h[0];
                        var p = g.parentNode;
                        if (p && (p.sizcache !== h || !g.nodeIndex)) {
                            var v = 0;
                            for (m = p.firstChild; m; m = m.nextSibling) {
                                if (m.nodeType === 1) {
                                    m.nodeIndex = ++v;
                                }
                            }
                            p.sizcache = h;
                        }
                        g = g.nodeIndex - q;
                        return l === 0 ? g === 0 : g % l === 0 && g / l >= 0;
                    }
                },
                ID: function(g, h) {
                    return g.nodeType === 1 && g.getAttribute("id") === h;
                },
                TAG: function(g, h) {
                    return h === "*" && g.nodeType === 1 || g.nodeName.toLowerCase() === h;
                },
                CLASS: function(g, h) {
                    return (" " + (g.className || g.getAttribute("class")) + " ").indexOf(h) > -1;
                },
                ATTR: function(g, h) {
                    var l = h[1];
                    g = n.attrHandle[l] ? n.attrHandle[l](g) : g[l] != null ? g[l] : g.getAttribute(l);
                    l = g + "";
                    var m = h[2];
                    h = h[4];
                    return g == null ? m === "!=": m === "=" ? l === h: m === "*=" ? l.indexOf(h) >= 0 : m === "~=" ? (" " + l + " ").indexOf(h) >= 0 : !h ? l && g !== false: m === "!=" ? l !== h: m === "^=" ? l.indexOf(h) === 0 : m === "$=" ? l.substr(l.length - h.length) === h: m === "|=" ? l === h || l.substr(0, h.length + 1) === h + "-": false;
                },
                POS: function(g, h, l, m) {
                    var q = n.setFilters[h[2]];
                    if (q) {
                        return q(g, l, h, m);
                    }
                }
            }
        },
        r = n.match.POS;
        for (var u in n.match) {
            n.match[u] = new RegExp(n.match[u].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            n.leftMatch[u] = new RegExp(/(^(?:.|\r|\n)*?)/.source + n.match[u].source.replace(/\\(\d+)/g,
            function(g, h) {
                return "\\" + (h - 0 + 1);
            }));
        }
        var z = function(g, h) {
            g = Array.prototype.slice.call(g, 0);
            if (h) {
                h.push.apply(h, g);
                return h;
            }
            return g;
        };
        try {
            Array.prototype.slice.call(s.documentElement.childNodes, 0);
        } catch(C) {
            z = function(g, h) {
                h = h || [];
                if (j.call(g) === "[object Array]") {
                    Array.prototype.push.apply(h, g);
                } else {
                    if (typeof g.length === "number") {
                        for (var l = 0, m = g.length; l < m; l++) {
                            h.push(g[l]);
                        }
                    } else {
                        for (l = 0; g[l]; l++) {
                            h.push(g[l]);
                        }
                    }
                }
                return h;
            };
        }
        var B;
        if (s.documentElement.compareDocumentPosition) {
            B = function(g, h) {
                if (!g.compareDocumentPosition || !h.compareDocumentPosition) {
                    if (g == h) {
                        i = true;
                    }
                    return g.compareDocumentPosition ? -1 : 1;
                }
                g = g.compareDocumentPosition(h) & 4 ? -1 : g === h ? 0 : 1;
                if (g === 0) {
                    i = true;
                }
                return g;
            };
        } else {
            if ("sourceIndex" in s.documentElement) {
                B = function(g, h) {
                    if (!g.sourceIndex || !h.sourceIndex) {
                        if (g == h) {
                            i = true;
                        }
                        return g.sourceIndex ? -1 : 1;
                    }
                    g = g.sourceIndex - h.sourceIndex;
                    if (g === 0) {
                        i = true;
                    }
                    return g;
                };
            } else {
                if (s.createRange) {
                    B = function(g, h) {
                        if (!g.ownerDocument || !h.ownerDocument) {
                            if (g == h) {
                                i = true;
                            }
                            return g.ownerDocument ? -1 : 1;
                        }
                        var l = g.ownerDocument.createRange(),
                        m = h.ownerDocument.createRange();
                        l.setStart(g, 0);
                        l.setEnd(g, 0);
                        m.setStart(h, 0);
                        m.setEnd(h, 0);
                        g = l.compareBoundaryPoints(Range.START_TO_END, m);
                        if (g === 0) {
                            i = true;
                        }
                        return g;
                    };
                }
            }
        } (function() {
            var g = s.createElement("div"),
            h = "script" + (new Date).getTime();
            g.innerHTML = "<a name='" + h + "'/>";
            var l = s.documentElement;
            l.insertBefore(g, l.firstChild);
            if (s.getElementById(h)) {
                n.find.ID = function(m, q, p) {
                    if (typeof q.getElementById !== "undefined" && !p) {
                        return (q = q.getElementById(m[1])) ? q.id === m[1] || typeof q.getAttributeNode !== "undefined" && q.getAttributeNode("id").nodeValue === m[1] ? [q] : w: [];
                    }
                };
                n.filter.ID = function(m, q) {
                    var p = typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id");
                    return m.nodeType === 1 && p && p.nodeValue === q;
                };
            }
            l.removeChild(g);
            l = g = null;
        })();
        (function() {
            var g = s.createElement("div");
            g.appendChild(s.createComment(""));
            if (g.getElementsByTagName("*").length > 0) {
                n.find.TAG = function(h, l) {
                    l = l.getElementsByTagName(h[1]);
                    if (h[1] === "*") {
                        h = [];
                        for (var m = 0; l[m]; m++) {
                            l[m].nodeType === 1 && h.push(l[m]);
                        }
                        l = h;
                    }
                    return l;
                };
            }
            g.innerHTML = "<a href='#'></a>";
            if (g.firstChild && typeof g.firstChild.getAttribute !== "undefined" && g.firstChild.getAttribute("href") !== "#") {
                n.attrHandle.href = function(h) {
                    return h.getAttribute("href", 2);
                };
            }
            g = null;
        })();
        s.querySelectorAll &&
        function() {
            var g = k,
            h = s.createElement("div");
            h.innerHTML = "<p class='TEST'></p>";
            if (! (h.querySelectorAll && h.querySelectorAll(".TEST").length === 0)) {
                k = function(m, q, p, v) {
                    q = q || s;
                    if (!v && q.nodeType === 9 && !x(q)) {
                        try {
                            return z(q.querySelectorAll(m), p);
                        } catch(t) {}
                    }
                    return g(m, q, p, v);
                };
                for (var l in g) {
                    k[l] = g[l];
                }
                h = null;
            }
        } ();
        (function() {
            var g = s.createElement("div");
            g.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (! (!g.getElementsByClassName || g.getElementsByClassName("e").length === 0)) {
                g.lastChild.className = "e";
                if (g.getElementsByClassName("e").length !== 1) {
                    n.order.splice(1, 0, "CLASS");
                    n.find.CLASS = function(h, l, m) {
                        if (typeof l.getElementsByClassName !== "undefined" && !m) {
                            return l.getElementsByClassName(h[1]);
                        }
                    };
                    g = null;
                }
            }
        })();
        var E = s.compareDocumentPosition ?
        function(g, h) {
            return !! (g.compareDocumentPosition(h) & 16);
        }: function(g, h) {
            return g !== h && (g.contains ? g.contains(h) : true);
        },
        x = function(g) {
            return (g = (g ? g.ownerDocument || g: 0).documentElement) ? g.nodeName !== "HTML": false;
        },
        ga = function(g, h) {
            var l = [],
            m = "",
            q;
            for (h = h.nodeType ? [h] : h; q = n.match.PSEUDO.exec(g);) {
                m += q[0];
                g = g.replace(n.match.PSEUDO, "");
            }
            g = n.relative[g] ? g + "*": g;
            q = 0;
            for (var p = h.length; q < p; q++) {
                k(g, h[q], l);
            }
            return k.filter(m, l);
        };
        c.find = k;
        c.expr = k.selectors;
        c.expr[":"] = c.expr.filters;
        c.unique = k.uniqueSort;
        c.text = a;
        c.isXMLDoc = x;
        c.contains = E;
    })();
    var eb = /Until$/,
    fb = /^(?:parents|prevUntil|prevAll)/,
    gb = /,/;
    R = Array.prototype.slice;
    var Ia = function(a, b, d) {
        if (c.isFunction(b)) {
            return c.grep(a,
            function(e, j) {
                return !! b.call(e, j, e) === d;
            });
        } else {
            if (b.nodeType) {
                return c.grep(a,
                function(e) {
                    return e === b === d;
                });
            } else {
                if (typeof b === "string") {
                    var f = c.grep(a,
                    function(e) {
                        return e.nodeType === 1;
                    });
                    if (Ua.test(b)) {
                        return c.filter(b, f, !d);
                    } else {
                        b = c.filter(b, f);
                    }
                }
            }
        }
        return c.grep(a,
        function(e) {
            return c.inArray(e, b) >= 0 === d;
        });
    };
    c.fn.extend({
        find: function(a) {
            for (var b = this.pushStack("", "find", a), d = 0, f = 0, e = this.length; f < e; f++) {
                d = b.length;
                c.find(a, this[f], b);
                if (f > 0) {
                    for (var j = d; j < b.length; j++) {
                        for (var i = 0; i < d; i++) {
                            if (b[i] === b[j]) {
                                b.splice(j--, 1);
                                break;
                            }
                        }
                    }
                }
            }
            return b;
        },
        has: function(a) {
            var b = c(a);
            return this.filter(function() {
                for (var d = 0, f = b.length; d < f; d++) {
                    if (c.contains(this, b[d])) {
                        return true;
                    }
                }
            });
        },
        not: function(a) {
            return this.pushStack(Ia(this, a, false), "not", a);
        },
        filter: function(a) {
            return this.pushStack(Ia(this, a, true), "filter", a);
        },
        is: function(a) {
            return !! a && c.filter(a, this).length > 0;
        },
        closest: function(a, b) {
            if (c.isArray(a)) {
                var d = [],
                f = this[0],
                e,
                j = {},
                i;
                if (f && a.length) {
                    e = 0;
                    for (var o = a.length; e < o; e++) {
                        i = a[e];
                        j[i] || (j[i] = c.expr.match.POS.test(i) ? c(i, b || this.context) : i);
                    }
                    for (; f && f.ownerDocument && f !== b;) {
                        for (i in j) {
                            e = j[i];
                            if (e.jquery ? e.index(f) > -1 : c(f).is(e)) {
                                d.push({
                                    selector: i,
                                    elem: f
                                });
                                delete j[i];
                            }
                        }
                        f = f.parentNode;
                    }
                }
                return d;
            }
            var k = c.expr.match.POS.test(a) ? c(a, b || this.context) : null;
            return this.map(function(n, r) {
                for (; r && r.ownerDocument && r !== b;) {
                    if (k ? k.index(r) > -1 : c(r).is(a)) {
                        return r;
                    }
                    r = r.parentNode;
                }
                return null;
            });
        },
        index: function(a) {
            if (!a || typeof a === "string") {
                return c.inArray(this[0], a ? c(a) : this.parent().children());
            }
            return c.inArray(a.jquery ? a[0] : a, this);
        },
        add: function(a, b) {
            a = typeof a === "string" ? c(a, b || this.context) : c.makeArray(a);
            b = c.merge(this.get(), a);
            return this.pushStack(qa(a[0]) || qa(b[0]) ? b: c.unique(b));
        },
        andSelf: function() {
            return this.add(this.prevObject);
        }
    });
    c.each({
        parent: function(a) {
            return (a = a.parentNode) && a.nodeType !== 11 ? a: null;
        },
        parents: function(a) {
            return c.dir(a, "parentNode");
        },
        parentsUntil: function(a, b, d) {
            return c.dir(a, "parentNode", d);
        },
        next: function(a) {
            return c.nth(a, 2, "nextSibling");
        },
        prev: function(a) {
            return c.nth(a, 2, "previousSibling");
        },
        nextAll: function(a) {
            return c.dir(a, "nextSibling");
        },
        prevAll: function(a) {
            return c.dir(a, "previousSibling");
        },
        nextUntil: function(a, b, d) {
            return c.dir(a, "nextSibling", d);
        },
        prevUntil: function(a, b, d) {
            return c.dir(a, "previousSibling", d);
        },
        siblings: function(a) {
            return c.sibling(a.parentNode.firstChild, a);
        },
        children: function(a) {
            return c.sibling(a.firstChild);
        },
        contents: function(a) {
            return c.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document: c.makeArray(a.childNodes);
        }
    },
    function(a, b) {
        c.fn[a] = function(d, f) {
            var e = c.map(this, b, d);
            eb.test(a) || (f = d);
            if (f && typeof f === "string") {
                e = c.filter(f, e);
            }
            e = this.length > 1 ? c.unique(e) : e;
            if ((this.length > 1 || gb.test(f)) && fb.test(a)) {
                e = e.reverse();
            }
            return this.pushStack(e, a, R.call(arguments).join(","));
        };
    });
    c.extend({
        filter: function(a, b, d) {
            if (d) {
                a = ":not(" + a + ")";
            }
            return c.find.matches(a, b);
        },
        dir: function(a, b, d) {
            var f = [];
            for (a = a[b]; a && a.nodeType !== 9 && (d === w || a.nodeType !== 1 || !c(a).is(d));) {
                a.nodeType === 1 && f.push(a);
                a = a[b];
            }
            return f;
        },
        nth: function(a, b, d) {
            b = b || 1;
            for (var f = 0; a; a = a[d]) {
                if (a.nodeType === 1 && ++f === b) {
                    break;
                }
            }
            return a;
        },
        sibling: function(a, b) {
            for (var d = []; a; a = a.nextSibling) {
                a.nodeType === 1 && a !== b && d.push(a);
            }
            return d;
        }
    });
    var Ja = / jQuery\d+="(?:\d+|null)"/g,
    V = /^\s+/,
    Ka = /(<([\w:]+)[^>]*?)\/>/g,
    hb = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
    La = /<([\w:]+)/,
    ib = /<tbody/i,
    jb = /<|&#?\w+;/,
    ta = /<script|<object|<embed|<option|<style/i,
    ua = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Ma = function(a, b, d) {
        return hb.test(d) ? a: b + "></" + d + ">";
    },
    F = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        area: [1, "<map>", "</map>"],
        _default: [0, "", ""]
    };
    F.optgroup = F.option;
    F.tbody = F.tfoot = F.colgroup = F.caption = F.thead;
    F.th = F.td;
    if (!c.support.htmlSerialize) {
        F._default = [1, "div<div>", "</div>"];
    }
    c.fn.extend({
        text: function(a) {
            if (c.isFunction(a)) {
                return this.each(function(b) {
                    var d = c(this);
                    d.text(a.call(this, b, d.text()));
                });
            }
            if (typeof a !== "object" && a !== w) {
                return this.empty().append((this[0] && this[0].ownerDocument || s).createTextNode(a));
            }
            return c.text(this);
        },
        wrapAll: function(a) {
            if (c.isFunction(a)) {
                return this.each(function(d) {
                    c(this).wrapAll(a.call(this, d));
                });
            }
            if (this[0]) {
                var b = c(a, this[0].ownerDocument).eq(0).clone(true);
                this[0].parentNode && b.insertBefore(this[0]);
                b.map(function() {
                    for (var d = this; d.firstChild && d.firstChild.nodeType === 1;) {
                        d = d.firstChild;
                    }
                    return d;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(a) {
            if (c.isFunction(a)) {
                return this.each(function(b) {
                    c(this).wrapInner(a.call(this, b));
                });
            }
            return this.each(function() {
                var b = c(this),
                d = b.contents();
                d.length ? d.wrapAll(a) : b.append(a);
            });
        },
        wrap: function(a) {
            return this.each(function() {
                c(this).wrapAll(a);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                c.nodeName(this, "body") || c(this).replaceWith(this.childNodes);
            }).end();
        },
        append: function() {
            return this.domManip(arguments, true,
            function(a) {
                this.nodeType === 1 && this.appendChild(a);
            });
        },
        prepend: function() {
            return this.domManip(arguments, true,
            function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild);
            });
        },
        before: function() {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false,
                function(b) {
                    this.parentNode.insertBefore(b, this);
                });
            } else {
                if (arguments.length) {
                    var a = c(arguments[0]);
                    a.push.apply(a, this.toArray());
                    return this.pushStack(a, "before", arguments);
                }
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false,
                function(b) {
                    this.parentNode.insertBefore(b, this.nextSibling);
                });
            } else {
                if (arguments.length) {
                    var a = this.pushStack(this, "after", arguments);
                    a.push.apply(a, c(arguments[0]).toArray());
                    return a;
                }
            }
        },
        remove: function(a, b) {
            for (var d = 0, f;
            (f = this[d]) != null; d++) {
                if (!a || c.filter(a, [f]).length) {
                    if (!b && f.nodeType === 1) {
                        c.cleanData(f.getElementsByTagName("*"));
                        c.cleanData([f]);
                    }
                    f.parentNode && f.parentNode.removeChild(f);
                }
            }
            return this;
        },
        empty: function() {
            for (var a = 0, b;
            (b = this[a]) != null; a++) {
                for (b.nodeType === 1 && c.cleanData(b.getElementsByTagName("*")); b.firstChild;) {
                    b.removeChild(b.firstChild);
                }
            }
            return this;
        },
        clone: function(a) {
            var b = this.map(function() {
                if (!c.support.noCloneEvent && !c.isXMLDoc(this)) {
                    var d = this.outerHTML,
                    f = this.ownerDocument;
                    if (!d) {
                        d = f.createElement("div");
                        d.appendChild(this.cloneNode(true));
                        d = d.innerHTML;
                    }
                    return c.clean([d.replace(Ja, "").replace(/=([^="'>\s]+\/)>/g, '="$1">').replace(V, "")], f)[0];
                } else {
                    return this.cloneNode(true);
                }
            });
            if (a === true) {
                ra(this, b);
                ra(this.find("*"), b.find("*"));
            }
            return b;
        },
        html: function(a) {
            if (a === w) {
                return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(Ja, "") : null;
            } else {
                if (typeof a === "string" && !ta.test(a) && (c.support.leadingWhitespace || !V.test(a)) && !F[(La.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Ka, Ma);
                    try {
                        for (var b = 0, d = this.length; b < d; b++) {
                            if (this[b].nodeType === 1) {
                                c.cleanData(this[b].getElementsByTagName("*"));
                                this[b].innerHTML = a;
                            }
                        }
                    } catch(f) {
                        this.empty().append(a);
                    }
                } else {
                    c.isFunction(a) ? this.each(function(e) {
                        var j = c(this),
                        i = j.html();
                        j.empty().append(function() {
                            return a.call(this, e, i);
                        });
                    }) : this.empty().append(a);
                }
            }
            return this;
        },
        replaceWith: function(a) {
            if (this[0] && this[0].parentNode) {
                if (c.isFunction(a)) {
                    return this.each(function(b) {
                        var d = c(this),
                        f = d.html();
                        d.replaceWith(a.call(this, b, f));
                    });
                }
                if (typeof a !== "string") {
                    a = c(a).detach();
                }
                return this.each(function() {
                    var b = this.nextSibling,
                    d = this.parentNode;
                    c(this).remove();
                    b ? c(b).before(a) : c(d).append(a);
                });
            } else {
                return this.pushStack(c(c.isFunction(a) ? a() : a), "replaceWith", a);
            }
        },
        detach: function(a) {
            return this.remove(a, true);
        },
        domManip: function(a, b, d) {
            function f(u) {
                return c.nodeName(u, "table") ? u.getElementsByTagName("tbody")[0] || u.appendChild(u.ownerDocument.createElement("tbody")) : u;
            }
            var e, j, i = a[0],
            o = [],
            k;
            if (!c.support.checkClone && arguments.length === 3 && typeof i === "string" && ua.test(i)) {
                return this.each(function() {
                    c(this).domManip(a, b, d, true);
                });
            }
            if (c.isFunction(i)) {
                return this.each(function(u) {
                    var z = c(this);
                    a[0] = i.call(this, u, b ? z.html() : w);
                    z.domManip(a, b, d);
                });
            }
            if (this[0]) {
                e = i && i.parentNode;
                e = c.support.parentNode && e && e.nodeType === 11 && e.childNodes.length === this.length ? {
                    fragment: e
                }: sa(a, this, o);
                k = e.fragment;
                if (j = k.childNodes.length === 1 ? (k = k.firstChild) : k.firstChild) {
                    b = b && c.nodeName(j, "tr");
                    for (var n = 0, r = this.length; n < r; n++) {
                        d.call(b ? f(this[n], j) : this[n], n > 0 || e.cacheable || this.length > 1 ? k.cloneNode(true) : k);
                    }
                }
                o.length && c.each(o, Qa);
            }
            return this;
        }
    });
    c.fragments = {};
    c.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    },
    function(a, b) {
        c.fn[a] = function(d) {
            var f = [];
            d = c(d);
            var e = this.length === 1 && this[0].parentNode;
            if (e && e.nodeType === 11 && e.childNodes.length === 1 && d.length === 1) {
                d[b](this[0]);
                return this;
            } else {
                e = 0;
                for (var j = d.length; e < j; e++) {
                    var i = (e > 0 ? this.clone(true) : this).get();
                    c.fn[b].apply(c(d[e]), i);
                    f = f.concat(i);
                }
                return this.pushStack(f, a, d.selector);
            }
        };
    });
    c.extend({
        clean: function(a, b, d, f) {
            b = b || s;
            if (typeof b.createElement === "undefined") {
                b = b.ownerDocument || b[0] && b[0].ownerDocument || s;
            }
            for (var e = [], j = 0, i;
            (i = a[j]) != null; j++) {
                if (typeof i === "number") {
                    i += "";
                }
                if (i) {
                    if (typeof i === "string" && !jb.test(i)) {
                        i = b.createTextNode(i);
                    } else {
                        if (typeof i === "string") {
                            i = i.replace(Ka, Ma);
                            var o = (La.exec(i) || ["", ""])[1].toLowerCase(),
                            k = F[o] || F._default,
                            n = k[0],
                            r = b.createElement("div");
                            for (r.innerHTML = k[1] + i + k[2]; n--;) {
                                r = r.lastChild;
                            }
                            if (!c.support.tbody) {
                                n = ib.test(i);
                                o = o === "table" && !n ? r.firstChild && r.firstChild.childNodes: k[1] === "<table>" && !n ? r.childNodes: [];
                                for (k = o.length - 1; k >= 0; --k) {
                                    c.nodeName(o[k], "tbody") && !o[k].childNodes.length && o[k].parentNode.removeChild(o[k]);
                                }
                            } ! c.support.leadingWhitespace && V.test(i) && r.insertBefore(b.createTextNode(V.exec(i)[0]), r.firstChild);
                            i = r.childNodes;
                        }
                    }
                    if (i.nodeType) {
                        e.push(i);
                    } else {
                        e = c.merge(e, i);
                    }
                }
            }
            if (d) {
                for (j = 0; e[j]; j++) {
                    if (f && c.nodeName(e[j], "script") && (!e[j].type || e[j].type.toLowerCase() === "text/javascript")) {
                        f.push(e[j].parentNode ? e[j].parentNode.removeChild(e[j]) : e[j]);
                    } else {
                        e[j].nodeType === 1 && e.splice.apply(e, [j + 1, 0].concat(c.makeArray(e[j].getElementsByTagName("script"))));
                        d.appendChild(e[j]);
                    }
                }
            }
            return e;
        },
        cleanData: function(a) {
            for (var b, d, f = c.cache, e = c.event.special, j = c.support.deleteExpando, i = 0, o;
            (o = a[i]) != null; i++) {
                if (d = o[c.expando]) {
                    b = f[d];
                    if (b.events) {
                        for (var k in b.events) {
                            e[k] ? c.event.remove(o, k) : Ca(o, k, b.handle);
                        }
                    }
                    if (j) {
                        delete o[c.expando];
                    } else {
                        o.removeAttribute && o.removeAttribute(c.expando);
                    }
                    delete f[d];
                }
            }
        }
    });
    var kb = /z-?index|font-?weight|opacity|zoom|line-?height/i,
    Na = /alpha\([^)]*\)/,
    Oa = /opacity=([^)]*)/,
    ha = /float/i,
    ia = /-([a-z])/ig,
    lb = /([A-Z])/g,
    mb = /^-?\d+(?:px)?$/i,
    nb = /^-?\d/,
    ob = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    },
    pb = ["Left", "Right"],
    qb = ["Top", "Bottom"],
    rb = s.defaultView && s.defaultView.getComputedStyle,
    Pa = c.support.cssFloat ? "cssFloat": "styleFloat",
    ja = function(a, b) {
        return b.toUpperCase();
    };
    c.fn.css = function(a, b) {
        return X(this, a, b, true,
        function(d, f, e) {
            if (e === w) {
                return c.curCSS(d, f);
            }
            if (typeof e === "number" && !kb.test(f)) {
                e += "px";
            }
            c.style(d, f, e);
        });
    };
    c.extend({
        style: function(a, b, d) {
            if (!a || a.nodeType === 3 || a.nodeType === 8) {
                return w;
            }
            if ((b === "width" || b === "height") && parseFloat(d) < 0) {
                d = w;
            }
            var f = a.style || a,
            e = d !== w;
            if (!c.support.opacity && b === "opacity") {
                if (e) {
                    f.zoom = 1;
                    b = parseInt(d, 10) + "" === "NaN" ? "": "alpha(opacity=" + d * 100 + ")";
                    a = f.filter || c.curCSS(a, "filter") || "";
                    f.filter = Na.test(a) ? a.replace(Na, b) : b;
                }
                return f.filter && f.filter.indexOf("opacity=") >= 0 ? parseFloat(Oa.exec(f.filter)[1]) / 100 + "": "";
            }
            if (ha.test(b)) {
                b = Pa;
            }
            b = b.replace(ia, ja);
            if (e) {
                f[b] = d;
            }
            return f[b];
        },
        css: function(a, b, d, f) {
            if (b === "width" || b === "height") {
                var e, j = b === "width" ? pb: qb;
                function i() {
                    e = b === "width" ? a.offsetWidth: a.offsetHeight;
                    f !== "border" && c.each(j,
                    function() {
                        f || (e -= parseFloat(c.curCSS(a, "padding" + this, true)) || 0);
                        if (f === "margin") {
                            e += parseFloat(c.curCSS(a, "margin" + this, true)) || 0;
                        } else {
                            e -= parseFloat(c.curCSS(a, "border" + this + "Width", true)) || 0;
                        }
                    });
                }
                a.offsetWidth !== 0 ? i() : c.swap(a, ob, i);
                return Math.max(0, Math.round(e));
            }
            return c.curCSS(a, b, d);
        },
        curCSS: function(a, b, d) {
            var f, e = a.style;
            if (!c.support.opacity && b === "opacity" && a.currentStyle) {
                f = Oa.test(a.currentStyle.filter || "") ? parseFloat(RegExp.$1) / 100 + "": "";
                return f === "" ? "1": f;
            }
            if (ha.test(b)) {
                b = Pa;
            }
            if (!d && e && e[b]) {
                f = e[b];
            } else {
                if (rb) {
                    if (ha.test(b)) {
                        b = "float";
                    }
                    b = b.replace(lb, "-$1").toLowerCase();
                    e = a.ownerDocument.defaultView;
                    if (!e) {
                        return null;
                    }
                    if (a = e.getComputedStyle(a, null)) {
                        f = a.getPropertyValue(b);
                    }
                    if (b === "opacity" && f === "") {
                        f = "1";
                    }
                } else {
                    if (a.currentStyle) {
                        d = b.replace(ia, ja);
                        f = a.currentStyle[b] || a.currentStyle[d];
                        if (!mb.test(f) && nb.test(f)) {
                            b = e.left;
                            var j = a.runtimeStyle.left;
                            a.runtimeStyle.left = a.currentStyle.left;
                            e.left = d === "fontSize" ? "1em": f || 0;
                            f = e.pixelLeft + "px";
                            e.left = b;
                            a.runtimeStyle.left = j;
                        }
                    }
                }
            }
            return f;
        },
        swap: function(a, b, d) {
            var f = {};
            for (var e in b) {
                f[e] = a.style[e];
                a.style[e] = b[e];
            }
            d.call(a);
            for (e in b) {
                a.style[e] = f[e];
            }
        }
    });
    if (c.expr && c.expr.filters) {
        c.expr.filters.hidden = function(a) {
            var b = a.offsetWidth,
            d = a.offsetHeight,
            f = a.nodeName.toLowerCase() === "tr";
            return b === 0 && d === 0 && !f ? true: b > 0 && d > 0 && !f ? false: c.curCSS(a, "display") === "none";
        };
        c.expr.filters.visible = function(a) {
            return ! c.expr.filters.hidden(a);
        };
    }
    var sb = J(),
    tb = /<script(.|\s)*?\/script>/gi,
    ub = /select|textarea/i,
    vb = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
    N = /=\?(&|$)/,
    ka = /\?/,
    wb = /(\?|&)_=.*?(&|$)/,
    xb = /^(\w+:)?\/\/([^\/?#]+)/,
    yb = /%20/g,
    zb = c.fn.load;
    c.fn.extend({
        load: function(a, b, d) {
            if (typeof a !== "string") {
                return zb.call(this, a);
            } else {
                if (!this.length) {
                    return this;
                }
            }
            var f = a.indexOf(" ");
            if (f >= 0) {
                var e = a.slice(f, a.length);
                a = a.slice(0, f);
            }
            f = "GET";
            if (b) {
                if (c.isFunction(b)) {
                    d = b;
                    b = null;
                } else {
                    if (typeof b === "object") {
                        b = c.param(b, c.ajaxSettings.traditional);
                        f = "POST";
                    }
                }
            }
            var j = this;
            c.ajax({
                url: a,
                type: f,
                dataType: "html",
                data: b,
                complete: function(i, o) {
                    if (o === "success" || o === "notmodified") {
                        j.html(e ? c("<div />").append(i.responseText.replace(tb, "")).find(e) : i.responseText);
                    }
                    d && j.each(d, [i.responseText, o, i]);
                }
            });
            return this;
        },
        serialize: function() {
            return c.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? c.makeArray(this.elements) : this;
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || ub.test(this.nodeName) || vb.test(this.type));
            }).map(function(a, b) {
                a = c(this).val();
                return a == null ? null: c.isArray(a) ? c.map(a,
                function(d) {
                    return {
                        name: b.name,
                        value: d
                    };
                }) : {
                    name: b.name,
                    value: a
                };
            }).get();
        }
    });
    c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),
    function(a, b) {
        c.fn[b] = function(d) {
            return this.bind(b, d);
        };
    });
    c.extend({
        get: function(a, b, d, f) {
            if (c.isFunction(b)) {
                f = f || d;
                d = b;
                b = null;
            }
            return c.ajax({
                type: "GET",
                url: a,
                data: b,
                success: d,
                dataType: f
            });
        },
        getScript: function(a, b) {
            return c.get(a, null, b, "script");
        },
        getJSON: function(a, b, d) {
            return c.get(a, b, d, "json");
        },
        post: function(a, b, d, f) {
            if (c.isFunction(b)) {
                f = f || d;
                d = b;
                b = {};
            }
            return c.ajax({
                type: "POST",
                url: a,
                data: b,
                success: d,
                dataType: f
            });
        },
        ajaxSetup: function(a) {
            c.extend(c.ajaxSettings, a);
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            xhr: A.XMLHttpRequest && (A.location.protocol !== "file:" || !A.ActiveXObject) ?
            function() {
                return new A.XMLHttpRequest;
            }: function() {
                try {
                    return new A.ActiveXObject("Microsoft.XMLHTTP");
                } catch(a) {}
            },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        lastModified: {},
        etag: {},
        ajax: function(a) {
            function b() {
                e.success && e.success.call(k, o, i, x);
                e.global && f("ajaxSuccess", [x, e]);
            }
            function d() {
                e.complete && e.complete.call(k, x, i);
                e.global && f("ajaxComplete", [x, e]);
                e.global && !--c.active && c.event.trigger("ajaxStop");
            }
            function f(q, p) { (e.context ? c(e.context) : c.event).trigger(q, p);
            }
            var e = c.extend(true, {},
            c.ajaxSettings, a),
            j,
            i,
            o,
            k = a && a.context || e,
            n = e.type.toUpperCase();
            if (e.data && e.processData && typeof e.data !== "string") {
                e.data = c.param(e.data, e.traditional);
            }
            if (e.dataType === "jsonp") {
                if (n === "GET") {
                    N.test(e.url) || (e.url += (ka.test(e.url) ? "&": "?") + (e.jsonp || "callback") + "=?");
                } else {
                    if (!e.data || !N.test(e.data)) {
                        e.data = (e.data ? e.data + "&": "") + (e.jsonp || "callback") + "=?";
                    }
                }
                e.dataType = "json";
            }
            if (e.dataType === "json" && (e.data && N.test(e.data) || N.test(e.url))) {
                j = e.jsonpCallback || "jsonp" + sb++;
                if (e.data) {
                    e.data = (e.data + "").replace(N, "=" + j + "$1");
                }
                e.url = e.url.replace(N, "=" + j + "$1");
                e.dataType = "script";
                A[j] = A[j] ||
                function(q) {
                    o = q;
                    b();
                    d();
                    A[j] = w;
                    try {
                        delete A[j];
                    } catch(p) {}
                    z && z.removeChild(C);
                };
            }
            if (e.dataType === "script" && e.cache === null) {
                e.cache = false;
            }
            if (e.cache === false && n === "GET") {
                var r = J(),
                u = e.url.replace(wb, "$1_=" + r + "$2");
                e.url = u + (u === e.url ? (ka.test(e.url) ? "&": "?") + "_=" + r: "");
            }
            if (e.data && n === "GET") {
                e.url += (ka.test(e.url) ? "&": "?") + e.data;
            }
            e.global && !c.active++&&c.event.trigger("ajaxStart");
            r = (r = xb.exec(e.url)) && (r[1] && r[1] !== location.protocol || r[2] !== location.host);
            if (e.dataType === "script" && n === "GET" && r) {
                var z = s.getElementsByTagName("head")[0] || s.documentElement,
                C = s.createElement("script");
                C.src = e.url;
                if (e.scriptCharset) {
                    C.charset = e.scriptCharset;
                }
                if (!j) {
                    var B = false;
                    C.onload = C.onreadystatechange = function() {
                        if (!B && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                            B = true;
                            b();
                            d();
                            C.onload = C.onreadystatechange = null;
                            z && C.parentNode && z.removeChild(C);
                        }
                    };
                }
                z.insertBefore(C, z.firstChild);
                return w;
            }
            var E = false,
            x = e.xhr();
            if (x) {
                e.username ? x.open(n, e.url, e.async, e.username, e.password) : x.open(n, e.url, e.async);
                try {
                    if (e.data || a && a.contentType) {
                        x.setRequestHeader("Content-Type", e.contentType);
                    }
                    if (e.ifModified) {
                        c.lastModified[e.url] && x.setRequestHeader("If-Modified-Since", c.lastModified[e.url]);
                        c.etag[e.url] && x.setRequestHeader("If-None-Match", c.etag[e.url]);
                    }
                    r || x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    x.setRequestHeader("Accept", e.dataType && e.accepts[e.dataType] ? e.accepts[e.dataType] + ", */*": e.accepts._default);
                } catch(ga) {}
                if (e.beforeSend && e.beforeSend.call(k, x, e) === false) {
                    e.global && !--c.active && c.event.trigger("ajaxStop");
                    x.abort();
                    return false;
                }
                e.global && f("ajaxSend", [x, e]);
                var g = x.onreadystatechange = function(q) {
                    if (!x || x.readyState === 0 || q === "abort") {
                        E || d();
                        E = true;
                        if (x) {
                            x.onreadystatechange = c.noop;
                        }
                    } else {
                        if (!E && x && (x.readyState === 4 || q === "timeout")) {
                            E = true;
                            x.onreadystatechange = c.noop;
                            i = q === "timeout" ? "timeout": !c.httpSuccess(x) ? "error": e.ifModified && c.httpNotModified(x, e.url) ? "notmodified": "success";
                            var p;
                            if (i === "success") {
                                try {
                                    o = c.httpData(x, e.dataType, e);
                                } catch(v) {
                                    i = "parsererror";
                                    p = v;
                                }
                            }
                            if (i === "success" || i === "notmodified") {
                                j || b();
                            } else {
                                c.handleError(e, x, i, p);
                            }
                            d();
                            q === "timeout" && x.abort();
                            if (e.async) {
                                x = null;
                            }
                        }
                    }
                };
                try {
                    var h = x.abort;
                    x.abort = function() {
                        x && h.call(x);
                        g("abort");
                    };
                } catch(l) {}
                e.async && e.timeout > 0 && setTimeout(function() {
                    x && !E && g("timeout");
                },
                e.timeout);
                try {
                    x.send(n === "POST" || n === "PUT" || n === "DELETE" ? e.data: null);
                } catch(m) {
                    c.handleError(e, x, null, m);
                    d();
                }
                e.async || g();
                return x;
            }
        },
        handleError: function(a, b, d, f) {
            if (a.error) {
                a.error.call(a.context || a, b, d, f);
            }
            if (a.global) { (a.context ? c(a.context) : c.event).trigger("ajaxError", [b, a, f]);
            }
        },
        active: 0,
        httpSuccess: function(a) {
            try {
                return ! a.status && location.protocol === "file:" || a.status >= 200 && a.status < 300 || a.status === 304 || a.status === 1223 || a.status === 0;
            } catch(b) {}
            return false;
        },
        httpNotModified: function(a, b) {
            var d = a.getResponseHeader("Last-Modified"),
            f = a.getResponseHeader("Etag");
            if (d) {
                c.lastModified[b] = d;
            }
            if (f) {
                c.etag[b] = f;
            }
            return a.status === 304 || a.status === 0;
        },
        httpData: function(a, b, d) {
            var f = a.getResponseHeader("content-type") || "",
            e = b === "xml" || !b && f.indexOf("xml") >= 0;
            a = e ? a.responseXML: a.responseText;
            e && a.documentElement.nodeName === "parsererror" && c.error("parsererror");
            if (d && d.dataFilter) {
                a = d.dataFilter(a, b);
            }
            if (typeof a === "string") {
                if (b === "json" || !b && f.indexOf("json") >= 0) {
                    a = c.parseJSON(a);
                } else {
                    if (b === "script" || !b && f.indexOf("javascript") >= 0) {
                        c.globalEval(a);
                    }
                }
            }
            return a;
        },
        param: function(a, b) {
            function d(i, o) {
                if (c.isArray(o)) {
                    c.each(o,
                    function(k, n) {
                        b || /\[\]$/.test(i) ? f(i, n) : d(i + "[" + (typeof n === "object" || c.isArray(n) ? k: "") + "]", n);
                    });
                } else { ! b && o != null && typeof o === "object" ? c.each(o,
                    function(k, n) {
                        d(i + "[" + k + "]", n);
                    }) : f(i, o);
                }
            }
            function f(i, o) {
                o = c.isFunction(o) ? o() : o;
                e[e.length] = encodeURIComponent(i) + "=" + encodeURIComponent(o);
            }
            var e = [];
            if (b === w) {
                b = c.ajaxSettings.traditional;
            }
            if (c.isArray(a) || a.jquery) {
                c.each(a,
                function() {
                    f(this.name, this.value);
                });
            } else {
                for (var j in a) {
                    d(j, a[j]);
                }
            }
            return e.join("&").replace(yb, "+");
        }
    });
    var la = {},
    Ab = /toggle|show|hide/,
    Bb = /^([+-]=)?([\d+-.]+)(.*)$/,
    W, va = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]];
    c.fn.extend({
        show: function(a, b) {
            if (a || a === 0) {
                return this.animate(K("show", 3), a, b);
            } else {
                a = 0;
                for (b = this.length; a < b; a++) {
                    var d = c.data(this[a], "olddisplay");
                    this[a].style.display = d || "";
                    if (c.css(this[a], "display") === "none") {
                        d = this[a].nodeName;
                        var f;
                        if (la[d]) {
                            f = la[d];
                        } else {
                            var e = c("<" + d + " />").appendTo("body");
                            f = e.css("display");
                            if (f === "none") {
                                f = "block";
                            }
                            e.remove();
                            la[d] = f;
                        }
                        c.data(this[a], "olddisplay", f);
                    }
                }
                a = 0;
                for (b = this.length; a < b; a++) {
                    this[a].style.display = c.data(this[a], "olddisplay") || "";
                }
                return this;
            }
        },
        hide: function(a, b) {
            if (a || a === 0) {
                return this.animate(K("hide", 3), a, b);
            } else {
                a = 0;
                for (b = this.length; a < b; a++) {
                    var d = c.data(this[a], "olddisplay"); ! d && d !== "none" && c.data(this[a], "olddisplay", c.css(this[a], "display"));
                }
                a = 0;
                for (b = this.length; a < b; a++) {
                    this[a].style.display = "none";
                }
                return this;
            }
        },
        _toggle: c.fn.toggle,
        toggle: function(a, b) {
            var d = typeof a === "boolean";
            if (c.isFunction(a) && c.isFunction(b)) {
                this._toggle.apply(this, arguments);
            } else {
                a == null || d ? this.each(function() {
                    var f = d ? a: c(this).is(":hidden");
                    c(this)[f ? "show": "hide"]();
                }) : this.animate(K("toggle", 3), a, b);
            }
            return this;
        },
        fadeTo: function(a, b, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            },
            a, d);
        },
        animate: function(a, b, d, f) {
            var e = c.speed(b, d, f);
            if (c.isEmptyObject(a)) {
                return this.each(e.complete);
            }
            return this[e.queue === false ? "each": "queue"](function() {
                var j = c.extend({},
                e),
                i,
                o = this.nodeType === 1 && c(this).is(":hidden"),
                k = this;
                for (i in a) {
                    var n = i.replace(ia, ja);
                    if (i !== n) {
                        a[n] = a[i];
                        delete a[i];
                        i = n;
                    }
                    if (a[i] === "hide" && o || a[i] === "show" && !o) {
                        return j.complete.call(this);
                    }
                    if ((i === "height" || i === "width") && this.style) {
                        j.display = c.css(this, "display");
                        j.overflow = this.style.overflow;
                    }
                    if (c.isArray(a[i])) { (j.specialEasing = j.specialEasing || {})[i] = a[i][1];
                        a[i] = a[i][0];
                    }
                }
                if (j.overflow != null) {
                    this.style.overflow = "hidden";
                }
                j.curAnim = c.extend({},
                a);
                c.each(a,
                function(r, u) {
                    var z = new c.fx(k, j, r);
                    if (Ab.test(u)) {
                        z[u === "toggle" ? o ? "show": "hide": u](a);
                    } else {
                        var C = Bb.exec(u),
                        B = z.cur(true) || 0;
                        if (C) {
                            u = parseFloat(C[2]);
                            var E = C[3] || "px";
                            if (E !== "px") {
                                k.style[r] = (u || 1) + E;
                                B = (u || 1) / z.cur(true) * B;
                                k.style[r] = B + E;
                            }
                            if (C[1]) {
                                u = (C[1] === "-=" ? -1 : 1) * u + B;
                            }
                            z.custom(B, u, E);
                        } else {
                            z.custom(B, u, "");
                        }
                    }
                });
                return true;
            });
        },
        stop: function(a, b) {
            var d = c.timers;
            a && this.queue([]);
            this.each(function() {
                for (var f = d.length - 1; f >= 0; f--) {
                    if (d[f].elem === this) {
                        b && d[f](true);
                        d.splice(f, 1);
                    }
                }
            });
            b || this.dequeue();
            return this;
        }
    });
    c.each({
        slideDown: K("show", 1),
        slideUp: K("hide", 1),
        slideToggle: K("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        }
    },
    function(a, b) {
        c.fn[a] = function(d, f) {
            return this.animate(b, d, f);
        };
    });
    c.extend({
        speed: function(a, b, d) {
            var f = a && typeof a === "object" ? a: {
                complete: d || !d && b || c.isFunction(a) && a,
                duration: a,
                easing: d && b || b && !c.isFunction(b) && b
            };
            f.duration = c.fx.off ? 0 : typeof f.duration === "number" ? f.duration: c.fx.speeds[f.duration] || c.fx.speeds._default;
            f.old = f.complete;
            f.complete = function() {
                f.queue !== false && c(this).dequeue();
                c.isFunction(f.old) && f.old.call(this);
            };
            return f;
        },
        easing: {
            linear: function(a, b, d, f) {
                return d + f * a;
            },
            swing: function(a, b, d, f) {
                return ( - Math.cos(a * Math.PI) / 2 + 0.5) * f + d;
            }
        },
        timers: [],
        fx: function(a, b, d) {
            this.options = b;
            this.elem = a;
            this.prop = d;
            if (!b.orig) {
                b.orig = {};
            }
        }
    });
    c.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this);
            (c.fx.step[this.prop] || c.fx.step._default)(this);
            if ((this.prop === "height" || this.prop === "width") && this.elem.style) {
                this.elem.style.display = "block";
            }
        },
        cur: function(a) {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                return this.elem[this.prop];
            }
            return (a = parseFloat(c.css(this.elem, this.prop, a))) && a > -10000 ? a: parseFloat(c.curCSS(this.elem, this.prop)) || 0;
        },
        custom: function(a, b, d) {
            function f(j) {
                return e.step(j);
            }
            this.startTime = J();
            this.start = a;
            this.end = b;
            this.unit = d || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            var e = this;
            f.elem = this.elem;
            if (f() && c.timers.push(f) && !W) {
                W = setInterval(c.fx.tick, 13);
            }
        },
        show: function() {
            this.options.orig[this.prop] = c.style(this.elem, this.prop);
            this.options.show = true;
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
            c(this.elem).show();
        },
        hide: function() {
            this.options.orig[this.prop] = c.style(this.elem, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0);
        },
        step: function(a) {
            var b = J(),
            d = true;
            if (a || b >= this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                for (var f in this.options.curAnim) {
                    if (this.options.curAnim[f] !== true) {
                        d = false;
                    }
                }
                if (d) {
                    if (this.options.display != null) {
                        this.elem.style.overflow = this.options.overflow;
                        a = c.data(this.elem, "olddisplay");
                        this.elem.style.display = a ? a: this.options.display;
                        if (c.css(this.elem, "display") === "none") {
                            this.elem.style.display = "block";
                        }
                    }
                    this.options.hide && c(this.elem).hide();
                    if (this.options.hide || this.options.show) {
                        for (var e in this.options.curAnim) {
                            c.style(this.elem, e, this.options.orig[e]);
                        }
                    }
                    this.options.complete.call(this.elem);
                }
                return false;
            } else {
                e = b - this.startTime;
                this.state = e / this.options.duration;
                a = this.options.easing || (c.easing.swing ? "swing": "linear");
                this.pos = c.easing[this.options.specialEasing && this.options.specialEasing[this.prop] || a](this.state, e, 0, 1, this.options.duration);
                this.now = this.start + (this.end - this.start) * this.pos;
                this.update();
            }
            return true;
        }
    };
    c.extend(c.fx, {
        tick: function() {
            for (var a = c.timers, b = 0; b < a.length; b++) {
                a[b]() || a.splice(b--, 1);
            }
            a.length || c.fx.stop();
        },
        stop: function() {
            clearInterval(W);
            W = null;
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                c.style(a.elem, "opacity", a.now);
            },
            _default: function(a) {
                if (a.elem.style && a.elem.style[a.prop] != null) {
                    a.elem.style[a.prop] = (a.prop === "width" || a.prop === "height" ? Math.max(0, a.now) : a.now) + a.unit;
                } else {
                    a.elem[a.prop] = a.now;
                }
            }
        }
    });
    if (c.expr && c.expr.filters) {
        c.expr.filters.animated = function(a) {
            return c.grep(c.timers,
            function(b) {
                return a === b.elem;
            }).length;
        };
    }
    c.fn.offset = "getBoundingClientRect" in s.documentElement ?
    function(a) {
        var b = this[0];
        if (a) {
            return this.each(function(e) {
                c.offset.setOffset(this, a, e);
            });
        }
        if (!b || !b.ownerDocument) {
            return null;
        }
        if (b === b.ownerDocument.body) {
            return c.offset.bodyOffset(b);
        }
        var d = b.getBoundingClientRect(),
        f = b.ownerDocument;
        b = f.body;
        f = f.documentElement;
        return {
            top: d.top + (self.pageYOffset || c.support.boxModel && f.scrollTop || b.scrollTop) - (f.clientTop || b.clientTop || 0),
            left: d.left + (self.pageXOffset || c.support.boxModel && f.scrollLeft || b.scrollLeft) - (f.clientLeft || b.clientLeft || 0)
        };
    }: function(a) {
        var b = this[0];
        if (a) {
            return this.each(function(r) {
                c.offset.setOffset(this, a, r);
            });
        }
        if (!b || !b.ownerDocument) {
            return null;
        }
        if (b === b.ownerDocument.body) {
            return c.offset.bodyOffset(b);
        }
        c.offset.initialize();
        var d = b.offsetParent,
        f = b,
        e = b.ownerDocument,
        j, i = e.documentElement,
        o = e.body;
        f = (e = e.defaultView) ? e.getComputedStyle(b, null) : b.currentStyle;
        for (var k = b.offsetTop, n = b.offsetLeft;
        (b = b.parentNode) && b !== o && b !== i;) {
            if (c.offset.supportsFixedPosition && f.position === "fixed") {
                break;
            }
            j = e ? e.getComputedStyle(b, null) : b.currentStyle;
            k -= b.scrollTop;
            n -= b.scrollLeft;
            if (b === d) {
                k += b.offsetTop;
                n += b.offsetLeft;
                if (c.offset.doesNotAddBorder && !(c.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(b.nodeName))) {
                    k += parseFloat(j.borderTopWidth) || 0;
                    n += parseFloat(j.borderLeftWidth) || 0;
                }
                f = d;
                d = b.offsetParent;
            }
            if (c.offset.subtractsBorderForOverflowNotVisible && j.overflow !== "visible") {
                k += parseFloat(j.borderTopWidth) || 0;
                n += parseFloat(j.borderLeftWidth) || 0;
            }
            f = j;
        }
        if (f.position === "relative" || f.position === "static") {
            k += o.offsetTop;
            n += o.offsetLeft;
        }
        if (c.offset.supportsFixedPosition && f.position === "fixed") {
            k += Math.max(i.scrollTop, o.scrollTop);
            n += Math.max(i.scrollLeft, o.scrollLeft);
        }
        return {
            top: k,
            left: n
        };
    };
    c.offset = {
        initialize: function() {
            var a = s.body,
            b = s.createElement("div"),
            d,
            f,
            e,
            j = parseFloat(c.curCSS(a, "marginTop", true)) || 0;
            c.extend(b.style, {
                position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: "1px",
                height: "1px",
                visibility: "hidden"
            });
            b.innerHTML = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
            a.insertBefore(b, a.firstChild);
            d = b.firstChild;
            f = d.firstChild;
            e = d.nextSibling.firstChild.firstChild;
            this.doesNotAddBorder = f.offsetTop !== 5;
            this.doesAddBorderForTableAndCells = e.offsetTop === 5;
            f.style.position = "fixed";
            f.style.top = "20px";
            this.supportsFixedPosition = f.offsetTop === 20 || f.offsetTop === 15;
            f.style.position = f.style.top = "";
            d.style.overflow = "hidden";
            d.style.position = "relative";
            this.subtractsBorderForOverflowNotVisible = f.offsetTop === -5;
            this.doesNotIncludeMarginInBodyOffset = a.offsetTop !== j;
            a.removeChild(b);
            c.offset.initialize = c.noop;
        },
        bodyOffset: function(a) {
            var b = a.offsetTop,
            d = a.offsetLeft;
            c.offset.initialize();
            if (c.offset.doesNotIncludeMarginInBodyOffset) {
                b += parseFloat(c.curCSS(a, "marginTop", true)) || 0;
                d += parseFloat(c.curCSS(a, "marginLeft", true)) || 0;
            }
            return {
                top: b,
                left: d
            };
        },
        setOffset: function(a, b, d) {
            if (/static/.test(c.curCSS(a, "position"))) {
                a.style.position = "relative";
            }
            var f = c(a),
            e = f.offset(),
            j = parseInt(c.curCSS(a, "top", true), 10) || 0,
            i = parseInt(c.curCSS(a, "left", true), 10) || 0;
            if (c.isFunction(b)) {
                b = b.call(a, d, e);
            }
            d = {
                top: b.top - e.top + j,
                left: b.left - e.left + i
            };
            "using" in b ? b.using.call(a, d) : f.css(d);
        }
    };
    c.fn.extend({
        position: function() {
            if (!this[0]) {
                return null;
            }
            var a = this[0],
            b = this.offsetParent(),
            d = this.offset(),
            f = /^body|html$/i.test(b[0].nodeName) ? {
                top: 0,
                left: 0
            }: b.offset();
            d.top -= parseFloat(c.curCSS(a, "marginTop", true)) || 0;
            d.left -= parseFloat(c.curCSS(a, "marginLeft", true)) || 0;
            f.top += parseFloat(c.curCSS(b[0], "borderTopWidth", true)) || 0;
            f.left += parseFloat(c.curCSS(b[0], "borderLeftWidth", true)) || 0;
            return {
                top: d.top - f.top,
                left: d.left - f.left
            };
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || s.body; a && !/^body|html$/i.test(a.nodeName) && c.css(a, "position") === "static";) {
                    a = a.offsetParent;
                }
                return a;
            });
        }
    });
    c.each(["Left", "Top"],
    function(a, b) {
        var d = "scroll" + b;
        c.fn[d] = function(f) {
            var e = this[0],
            j;
            if (!e) {
                return null;
            }
            if (f !== w) {
                return this.each(function() {
                    if (j = wa(this)) {
                        j.scrollTo(!a ? f: c(j).scrollLeft(), a ? f: c(j).scrollTop());
                    } else {
                        this[d] = f;
                    }
                });
            } else {
                return (j = wa(e)) ? "pageXOffset" in j ? j[a ? "pageYOffset": "pageXOffset"] : c.support.boxModel && j.document.documentElement[d] || j.document.body[d] : e[d];
            }
        };
    });
    c.each(["Height", "Width"],
    function(a, b) {
        var d = b.toLowerCase();
        c.fn["inner" + b] = function() {
            return this[0] ? c.css(this[0], d, false, "padding") : null;
        };
        c.fn["outer" + b] = function(f) {
            return this[0] ? c.css(this[0], d, false, f ? "margin": "border") : null;
        };
        c.fn[d] = function(f) {
            var e = this[0];
            if (!e) {
                return f == null ? null: this;
            }
            if (c.isFunction(f)) {
                return this.each(function(j) {
                    var i = c(this);
                    i[d](f.call(this, j, i[d]()));
                });
            }
            return "scrollTo" in e && e.document ? e.document.compatMode === "CSS1Compat" && e.document.documentElement["client" + b] || e.document.body["client" + b] : e.nodeType === 9 ? Math.max(e.documentElement["client" + b], e.body["scroll" + b], e.documentElement["scroll" + b], e.body["offset" + b], e.documentElement["offset" + b]) : f === w ? c.css(e, d) : this.css(d, typeof f === "string" ? f: f + "px");
        };
    });
    A.jQuery = A.$ = c;
})(window);
(function($) {
    $.toJSON = function(o) {
        if (typeof(JSON) == "object" && JSON.stringify) {
            return JSON.stringify(o);
        }
        var type = typeof(o);
        if (o === null) {
            return "null";
        }
        if (type == "undefined") {
            return undefined;
        }
        if (type == "number" || type == "boolean") {
            return o + "";
        }
        if (type == "string") {
            return $.quoteString(o);
        }
        if (type == "object") {
            if (typeof o.toJSON == "function") {
                return $.toJSON(o.toJSON());
            }
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                var day = o.getUTCDate();
                if (day < 10) {
                    day = "0" + day;
                }
                var year = o.getUTCFullYear();
                var hours = o.getUTCHours();
                if (hours < 10) {
                    hours = "0" + hours;
                }
                var minutes = o.getUTCMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                var seconds = o.getUTCSeconds();
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                var milli = o.getUTCMilliseconds();
                if (milli < 100) {
                    milli = "0" + milli;
                }
                if (milli < 10) {
                    milli = "0" + milli;
                }
                return '"' + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + 'Z"';
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++) {
                    ret.push($.toJSON(o[i]) || "null");
                }
                return "[" + ret.join(",") + "]";
            }
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;
                if (type == "number") {
                    name = '"' + k + '"';
                } else {
                    if (type == "string") {
                        name = $.quoteString(k);
                    } else {
                        continue;
                    }
                }
                if (typeof o[k] == "function") {
                    continue;
                }
                var val = $.toJSON(o[k]);
                pairs.push(name + ":" + val);
            }
            return "{" + pairs.join(", ") + "}";
        }
    };
    $.evalJSON = function(src) {
        if (typeof(JSON) == "object" && JSON.parse) {
            return JSON.parse(src);
        }
        return eval("(" + src + ")");
    };
    $.secureEvalJSON = function(src) {
        if (typeof(JSON) == "object" && JSON.parse) {
            return JSON.parse(src);
        }
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, "@");
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval("(" + src + ")");
        } else {
            throw new SyntaxError("Error parsing JSON, source is not valid.");
        }
    };
    $.quoteString = function(string) {
        if (string.match(_escapeable)) {
            return '"' + string.replace(_escapeable,
            function(a) {
                var c = _meta[a];
                if (typeof c === "string") {
                    return c;
                }
                c = a.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    var _meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    };
})(jQuery);






var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function(data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) {
                    return data[i].identity;
                }
            } else {
                if (dataProp) {
                    return data[i].identity;
                }
            }
        }
    },
    searchVersion: function(dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) {
            return;
        }
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    },
    {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    },
    {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    },
    {
        prop: window.opera,
        identity: "Opera"
    },
    {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    },
    {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    },
    {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    },
    {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    },
    {
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    },
    {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    },
    {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    },
    {
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    },
    {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    },
    {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
    },
    {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }]
};
BrowserDetect.init();
var TT = TT || {};
TT.PAGE_WIDTH = 800;
TT.PAGE_HEIGHT = 500;
TT.PAGE_MIN_WIDTH = 1000;
TT.PAGE_MIN_HEIGHT = 680;
TT.PAGE_MARGIN_X = 32;
TT.PAGE_MARGIN_Y = 10;
TT.BOOK_WIDTH = 1660;
TT.BOOK_HEIGHT = 520;
TT.BOOK_WIDTH_CLOSED = TT.BOOK_WIDTH / 2;
TT.BOOK_OFFSET_X = 5;
TT.UA = navigator.userAgent.toLowerCase();
TT.IS_TOUCH_DEVICE = TT.UA.match(/android/) || TT.UA.match(/iphone/) || TT.UA.match(/ipad/) || TT.UA.match(/ipod/);
TT.initialize = function() {
    TT.preloader.initialize();
    TT.overlay.initialize();
    TT.storage.initialize();
    TT.cache.initialize();
    TT.search.initialize();
    TT.chapternav.initialize();
    TT.sharing.initialize();
    TT.paperstack.initialize();
    TT.tableofthings.initialize();
    TT.flipintro.initialize();
    $(window).resize(TT.onWindowResize);
    $(window).scroll(TT.onWindowScroll);
    TT.updateLayout();
    $("img").mousedown(function(event) {
        event.preventDefault();
    });
};
TT.startup = function() {
    TT.navigation.initialize();
    TT.pageflip.initialize();
    TT.history.initialize();
    TT.locale.initialize();
    TT.chapternav.updateSelection();
    TT.tableofthings.updateSelection();
    TT.chapternav.updateReadMarkers();
    TT.tableofthings.updateReadMarkers();
    TT.paperstack.updateStack();
    TT.navigation.updateNextPrevLinks($("#pages section.current"));
};
TT.onWindowResize = function(event) {
    TT.updateLayout();
};
TT.onWindowScroll = function(event) {
    TT.updateLayout(true);
};
TT.updateLayout = function(fromScroll) {
    var applicationSize = {
        width: $(window).width(),
        height: $(window).height()
    };
    $("body").css({
        overflowX: applicationSize.width < TT.PAGE_MIN_WIDTH ? "auto": "hidden",
        overflowY: applicationSize.height < TT.PAGE_MIN_HEIGHT ? "auto": "hidden"
    });
    applicationSize.width = Math.max(applicationSize.width, TT.PAGE_MIN_WIDTH);
    applicationSize.height = Math.max(applicationSize.height, TT.PAGE_MIN_HEIGHT);
    var center = {
        x: applicationSize.width * 0.5,
        y: applicationSize.height * 0.5
    };
    if (!fromScroll) {
        if (applicationSize.width < TT.PAGE_MIN_WIDTH + $("#grey-mask").width() + 50) {
            $("#grey-mask").css({
                left: -((TT.PAGE_MIN_WIDTH + $("#grey-mask").width() + 50) - applicationSize.width)
            });
        } else {
            $("#grey-mask").css({
                left: 0
            });
        }
        $("#book").css({
            left: center.x - (TT.BOOK_WIDTH * 0.5) - (TT.BOOK_WIDTH_CLOSED * 0.5) + TT.BOOK_OFFSET_X,
            top: center.y - (TT.BOOK_HEIGHT * 0.5),
            margin: 0
        });
        $("#table-of-contents div.center").css({
            left: center.x - (parseInt($("#table-of-contents div.center").innerWidth()) * 0.5),
            top: center.y - (parseInt($("#table-of-contents div.center").height()) * 0.5),
            margin: 0
        });
        $("#table-of-contents, header, footer").css({
            width: applicationSize.width
        });
        $("#credits").css({
            left: center.x - ($("#credits").width() * 0.5),
            top: center.y - ($("#credits").height() * 0.5),
            margin: 0
        });
        $("#overlay div.bookmark").css({
            left: center.x - ($("#overlay div.bookmark").width() * 0.5),
            top: center.y - ($("#overlay div.bookmark").height() * 0.5),
            margin: 0
        });
        $("footer").css({
            top: applicationSize.height - $("footer").height(),
            margin: 0
        });
        $("#search-dropdown").css({
            left: $("#search-field").position().left + 1,
            top: $("#search-field").position().top + $("#search-field").height() + 2
        });
        $("#chapter-nav").css({
            left: center.x - ($("#chapter-nav").width() * 0.5) + 5 + TT.BOOK_OFFSET_X,
            top: $("footer").position().top - $("#chapter-nav").outerHeight() + 5
        });
    }
    $("#pagination-prev, #pagination-next").css({
        top: center.y - 20
    });
    if (!TT.IS_TOUCH_DEVICE) {
        $("#pagination-prev").css({
            left: $(window).scrollLeft()
        });
        $("#pagination-next").css({
            right: "auto",
            left: $(window).scrollLeft() + $(window).width() - $("#pagination-next").width()
        });
    }
};
TT.log = function(o) {
    if (window.console && o) {
        window.console.log(o);
    }
};
TT.lights = (function() {
    $("footer div.lights a").click(function(e) {
        e.preventDefault();
        if ($("html").hasClass("dark")) {
            $(this).parent().removeClass("clone").appendTo("footer .lights-wrapper");
            setTimeout(function() {
                $("div.lights .icon").removeClass("off");
            },
            0);
        } else {
            $(this).parent().addClass("clone").appendTo("body");
            setTimeout(function() {
                $("div.lights .icon").addClass("off");
            },
            0);
        }
        $("html,body").toggleClass("dark");
    });
    $(".dark footer").live("hover",
    function() {
        $("div.lights").toggleClass("active");
    });
    return {
        turnOn: function() {
            $("html,body").removeClass("dark");
            $("div.lights").removeClass("clone").appendTo("footer .lights-wrapper");
            $("div.lights .icon").removeClass("off");
        }
    };
})();
TT.fullscreen = (function() {
    function onEnterFullScreen() {
        $("div.fullscreen").addClass("clone").appendTo("body");
        $("div.fullscreen .icon").addClass("off");
        TT.pageflip.unregisterEventListeners();
        TT.updateLayout();
        TT.lights.turnOn();
    }
    function onExitFullScreen() {
        $("div.fullscreen").removeClass("clone").appendTo("footer .fullscreen-wrapper");
        $("div.fullscreen .icon").removeClass("off");
        TT.pageflip.registerEventListeners();
        TT.updateLayout();
    }
    $("footer div.fullscreen a").click(function(e) {
        e.preventDefault();
        $("html,body").toggleClass("fullscreen");
        if ($("html").hasClass("fullscreen")) {
            onEnterFullScreen();
        } else {
            onExitFullScreen();
        }
    });
    $("footer .fullscreen-wrapper").show();
    return {
        exit: function() {
            $("html,body").removeClass("fullscreen");
            onExitFullScreen();
        }
    };
})();
TT.time = function() {
    return new Date().getTime();
};
TT.track = function(url) {
    _gaq.push(["_trackPageview", url]);
};
window.TT = TT;
TT.preloader = {};
TT.preloader.assetsComplete = false;
TT.preloader.contentsComplete = false;
TT.preloader.finished = false;
TT.preloader.assetsLoaded = 0;
TT.preloader.assetsToLoad = 0;
TT.preloader.initialize = function() {
    TT.preloader.animation.initialize();
    TT.preloader.animation.activate();
    TT.preloader.assetsToLoad = 9;
    var spritesImage = new Image();
    var frontImage = new Image();
    var backImage = new Image();
    var rightImage = new Image();
    var leftImage = new Image();
    var repeatImage = new Image();
    var paperImage = new Image();
    var leftFlippedImage = new Image();
    var backImageFlipped = new Image();
    TT.preloader.addAssetToPreloadQueue($(spritesImage));
    TT.preloader.addAssetToPreloadQueue($(frontImage));
    TT.preloader.addAssetToPreloadQueue($(backImage));
    TT.preloader.addAssetToPreloadQueue($(rightImage));
    TT.preloader.addAssetToPreloadQueue($(leftImage));
    TT.preloader.addAssetToPreloadQueue($(repeatImage));
    TT.preloader.addAssetToPreloadQueue($(paperImage));
    TT.preloader.addAssetToPreloadQueue($(leftFlippedImage));
    TT.preloader.addAssetToPreloadQueue($(backImageFlipped));
    $("#preloader .contents").delay(50).animate({
        opacity: 1
    },
    300);
    var versionSuffix = "?v=" + 1;
    spritesImage.src = "/css/images/sprites.png" + versionSuffix;
    frontImage.src = "/css/images/front-cover.jpg" + versionSuffix;
    backImage.src = "/css/images/back-cover.jpg" + versionSuffix;
    rightImage.src = "/css/images/right-page.jpg" + versionSuffix;
    leftImage.src = "/css/images/left-page.jpg" + versionSuffix;
    repeatImage.src = "/css/images/repeat-x.png" + versionSuffix;
    paperImage.src = "/css/images/right-page-paper.jpg" + versionSuffix;
    leftFlippedImage.src = "/css/images/left-page-flipped.jpg" + versionSuffix;
    backImageFlipped.src = "/css/images/back-cover-flipped.jpg" + versionSuffix;
};
TT.preloader.updateMeter = function() {
    var segmentsTotal = TT.preloader.assetsToLoad;
    var segmentsComplete = TT.preloader.assetsLoaded;
    if (TT.preloader.contentsComplete) {
        segmentsComplete++;
    }
    var progress = Math.min(segmentsComplete / segmentsTotal, 1);
    var progressWidth = progress * $("#preloader .progress").width();
    $("#preloader .progress .fill").width(progressWidth);
};
TT.preloader.addAssetToPreloadQueue = function(asset) {
    asset.load(TT.preloader.onAssetLoaded);
    asset.error(TT.preloader.onAssetLoaded);
};
TT.preloader.onAssetLoaded = function(event) {
    if (++TT.preloader.assetsLoaded >= TT.preloader.assetsToLoad) {
        TT.preloader.onAllAssetsLoaded();
    }
    TT.log("Asset preloaded: " + $(event.target).attr("src") + " [" + TT.preloader.assetsLoaded + "/" + TT.preloader.assetsToLoad + "]");
    TT.preloader.updateMeter();
};
TT.preloader.onAllAssetsLoaded = function() {
    if (!TT.preloader.assetsComplete && TT.preloader.assetsLoaded >= TT.preloader.assetsToLoad) {
        TT.preloader.assetsComplete = true;
        TT.preloader.finish();
    }
    TT.preloader.updateMeter();
};
TT.preloader.onContentsLoaded = function() {
    if (!TT.preloader.contentsComplete) {
        TT.preloader.contentsComplete = true;
        TT.preloader.finish();
    }
    TT.preloader.updateMeter();
};
TT.preloader.finish = function() {
    if (TT.preloader.contentsComplete && TT.preloader.assetsComplete && !TT.preloader.finished) {
        $("#preloader").stop(true, true).fadeOut(200,
        function() {
            TT.preloader.animation.deactivate();
            $(this).remove();
        });
        $("#book").css({
            opacity: 0
        }).show().delay(200).fadeTo(700, 1);
        TT.updateLayout();
        TT.startup();
        setTimeout(TT.preloader.loadIllustrations, 3000);
        TT.preloader.finished = true;
    }
    TT.preloader.updateMeter();
};
TT.preloader.loadIllustrations = function() {
    $("div.page").find("img").each(function() {
        if ($(this).attr("src") !== $(this).attr("data-src")) {
            $(this).attr("src", $(this).attr("data-src"));
        }
    });
};
TT.preloader.animation = {};
TT.preloader.animation.loopInterval = -1;
TT.preloader.animation.WIDTH = 89;
TT.preloader.animation.HEIGHT = 29;
TT.preloader.animation.VSPACE = 20;
TT.preloader.animation.canvas = null;
TT.preloader.animation.context = null;
TT.preloader.animation.flip = {
    progress: 0,
    alpha: 0
};
TT.preloader.animation.initialize = function() {
    this.canvas = $("#preloader .animation");
    if (this.canvas[0]) {
        this.canvas[0].width = this.WIDTH;
        this.canvas[0].height = this.HEIGHT + (this.VSPACE * 2);
        this.context = this.canvas[0].getContext("2d");
    }
};
TT.preloader.animation.activate = function() {
    if (TT.preloader.animation.loopInterval == -1) {
        TT.preloader.animation.flip.progress = 1;
        TT.preloader.animation.loopInterval = setInterval(function() {
            if (TT.preloader.animation.canvas[0]) {
                TT.preloader.animation.render();
            }
        },
        32);
    }
};
TT.preloader.animation.deactivate = function() {
    clearInterval(TT.preloader.animation.loopInterval);
    TT.preloader.animation.loopInterval = -1;
};
TT.preloader.animation.render = function() {
    this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT + (this.VSPACE * 2));
    this.context.save();
    this.context.translate(0, this.VSPACE);
    this.context.fillStyle = "#f4f4f4";
    this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.context.fillStyle = "#999999";
    this.context.fillRect(0, 0, this.WIDTH, 1);
    this.context.fillRect(0, this.HEIGHT, this.WIDTH, 2);
    this.context.fillRect(0, 0, 1, this.HEIGHT);
    this.context.fillRect(this.WIDTH - 1, 0, 1, this.HEIGHT);
    this.context.fillRect(Math.floor(this.WIDTH * 0.5), 0, 1, this.HEIGHT);
    this.context.fillRect(54, 8, 25, 2);
    this.context.fillRect(54, 11, 25, 2);
    this.context.fillRect(54, 14, 25, 2);
    this.context.fillRect(54, 17, 25, 2);
    this.context.fillRect(54, 20, 25, 2);
    this.context.translate(0, 1);
    TT.preloader.animation.flip.progress -= Math.max(0.12 * (1 - Math.abs(TT.preloader.animation.flip.progress)), 0.02);
    TT.preloader.animation.flip.alpha = 1 - ((Math.abs(TT.preloader.animation.flip.progress) - 0.7) / 0.3);
    if (TT.preloader.animation.flip.progress <= -1.1) {
        TT.preloader.animation.flip.progress = 1;
    }
    var strength = 1 - Math.abs(TT.preloader.animation.flip.progress);
    var anchorOutdent = strength * 12;
    var controlOutdent = strength * 8;
    var source = {
        top: {
            x: this.WIDTH * 0.5,
            y: 0
        },
        bottom: {
            x: this.WIDTH * 0.5,
            y: this.HEIGHT
        }
    };
    var destination = {
        top: {
            x: source.top.x + (this.WIDTH * TT.preloader.animation.flip.progress * 0.55),
            y: 0 - anchorOutdent
        },
        bottom: {
            x: source.bottom.x + (this.WIDTH * TT.preloader.animation.flip.progress * 0.55),
            y: this.HEIGHT - anchorOutdent
        }
    };
    var control = {
        top: {
            x: source.top.x + (12 * TT.preloader.animation.flip.progress),
            y: -controlOutdent
        },
        bottom: {
            x: source.bottom.x + (12 * TT.preloader.animation.flip.progress),
            y: this.HEIGHT - controlOutdent
        }
    };
    this.context.fillStyle = "rgba(245,245,245," + TT.preloader.animation.flip.alpha + ")";
    this.context.strokeStyle = "rgba(90,90,90," + TT.preloader.animation.flip.alpha + ")";
    this.context.beginPath();
    this.context.moveTo(source.top.x, source.top.y);
    this.context.quadraticCurveTo(control.top.x, control.top.y, destination.top.x, destination.top.y);
    this.context.lineTo(destination.bottom.x, destination.bottom.y);
    this.context.quadraticCurveTo(control.bottom.x, control.bottom.y, source.bottom.x, source.bottom.y);
    this.context.fill();
    this.context.stroke();
    this.context.restore();
};
TT.history = {};
TT.history.TABLE_OF_CONTENTS = "table-of-things";
TT.history.HOME = "home";
TT.history.FOREWORD = "foreword";
TT.history.THEEND = "theend";
TT.history.CREDITS = "credits";
TT.history.previousHash = "";
TT.history.hashCheckInterval = -1;
TT.history.initialize = function() {
    if (TT.history.supportsHistoryPushState()) {
        $(window).bind("popstate", TT.history.onPopState);
    } else {
        TT.history.hashCheckInterval = setInterval(TT.history.onCheckHash, 200);
    }
};
TT.history.supportsHistoryPushState = function() {
    return ("pushState" in window.history) && window.history.pushState !== null;
};
TT.history.onCheckHash = function() {
    if (document.location.hash !== TT.history.previousHash) {
        TT.history.navigateToPath(document.location.hash.slice(1));
        TT.history.previousHash = document.location.hash;
    }
};
TT.history.pushState = function(url) {
    if (TT.history.supportsHistoryPushState()) {
        window.history.pushState("", "", url);
    } else {
        TT.history.previousHash = "#" + url;
        document.location.hash = url;
    }
    TT.track(url);
};
TT.history.onPopState = function(event) {
    TT.history.navigateToPath(document.location.pathname);
};
TT.history.navigateToPath = function(pathname) {
    pathname = TT.locale.removeLocaleCodeFromURL(pathname);
    var part1 = pathname.split("/")[1];
    var part2 = pathname.split("/")[2];
    if (!part1 || part1 == TT.history.HOME) {
        TT.navigation.goToHome(true);
    } else {
        if (part1 == TT.history.CREDITS) {
            TT.navigation.goToCredits(true);
        } else {
            if (part1 == TT.history.TABLE_OF_CONTENTS) {
                TT.tableofthings.show();
            } else {
                if (part2) {
                    TT.navigation.goToPage(part1, part2, true);
                } else {
                    TT.navigation.goToPage(part1, "1", true);
                }
            }
        }
    }
};
TT.storage = {};
TT.storage.isFirstTimeVisitor = true;
TT.storage.contents = "";
TT.storage.data = {
    articles: {},
    progress: {},
    bookmark: {
        articleId: "",
        pageNumber: ""
    }
};
TT.storage.initialize = function() {
    TT.storage.routeDataRequest();
};
TT.storage.load = function() {
    if (TT.storage.supportsLocalStorage() && localStorage.data) {
        TT.storage.data = $.parseJSON(localStorage.data);
    }
};
TT.storage.save = function() {
    if (TT.storage.supportsLocalStorage()) {
        localStorage.data = $.toJSON(TT.storage.data);
    }
};
TT.storage.supportsLocalStorage = function() {
    return ("localStorage" in window) && window.localStorage !== null;
};
TT.storage.getArticlesFromServer = function() {
    TT.log("Getting articles from server");
    var disabledArticles = TT.chapternav.getDisabledArticles();
    $.ajax({
        url: "/" + SERVER_VARIABLES.LANG + "/all",
        contentType: "text/html;charset=UTF-8",
        success: function(data) {
            var globalPageCounter = 0;
            TT.storage.data.articles = {};
            $(data).each(function() {
                var articleId = $(this).attr("id");
                $(this).find("section").each(function(i) {
                    globalPageCounter++;
                    $(this).addClass("globalPage-" + globalPageCounter).css("zIndex", 500 - globalPageCounter).hide();
                    if (TT.storage.supportsLocalStorage()) {
                        TT.storage.data.articles["/" + articleId + "/" + (i + 1)] = $("<div>").append($(this).clone()).remove().html();
                    }
                    var articleIsDisabled = false;
                    for (var i = 0; i < disabledArticles.length; i++) {
                        if (disabledArticles[i] == articleId) {
                            articleIsDisabled = true;
                        }
                    }
                    if (articleIsDisabled == false) {
                        $("#pages").append($("<div>").append($(this).clone()).remove().html());
                    }
                });
            });
            TT.storage.save();
            TT.storage.onFindBookmark();
            TT.storage.activateCurrentPageAndSetPageCount();
        }
    });
};
TT.storage.getArticlesFromServerTranslated = function() {
    TT.log("getting articles from server");
    var disabledArticles = TT.chapternav.getDisabledArticles();
    $.ajax({
        url: "/all",
        contentType: "text/html;charset=UTF-8",
        success: function(data) {
            var globalPageCounter = 0;
            TT.storage.data.articles = {};
            $(data).each(function() {
                var articleId = $(this).attr("id");
                $(this).find("section").each(function(i) {
                    globalPageCounter++;
                    $(this).addClass("globalPage-" + globalPageCounter).css("zIndex", 500 - globalPageCounter).hide();
                    if (TT.storage.supportsLocalStorage()) {
                        TT.storage.data.articles["/" + articleId + "/" + (i + 1)] = $("<div>").append($(this).clone()).remove().html();
                    }
                    var articleIsDisabled = false;
                    for (var i = 0; i < disabledArticles.length; i++) {
                        if (disabledArticles[i] == articleId) {
                            articleIsDisabled = true;
                        }
                    }
                    if (articleIsDisabled == false) {
                        $("#pages").append($("<div>").append($(this).clone()).remove().html());
                    }
                });
            });
            TT.storage.save();
            TT.storage.onFindBookmark();
            TT.storage.activateCurrentPageAndSetPageCount();
        }
    });
};
TT.storage.getArticlesFromStorage = function() {
    TT.log("Getting articles from storage");
    TT.storage.isFirstTimeVisitor = false;
    if (localStorage.data) {
        TT.storage.data = $.parseJSON(localStorage.data);
    } else {
        TT.storage.getArticlesFromServer();
        return;
    }
    var disabledArticles = TT.chapternav.getDisabledArticles();
    for (var articlePath in TT.storage.data.articles) {
        var articleIsDisabled = false;
        for (var i = 0; i < disabledArticles.length; i++) {
            if (disabledArticles[i] == articlePath.split("/")[1]) {
                articleIsDisabled = true;
            }
        }
        if (articleIsDisabled == false) {
            $("#pages").append(TT.storage.data.articles[articlePath]);
        }
    }
    TT.storage.onFindBookmark();
    TT.storage.activateCurrentPageAndSetPageCount();
};
TT.storage.routeDataRequest = function() {
    if (!TT.storage.supportsLocalStorage()) {
        TT.storage.getArticlesFromServer();
    } else {
        TT.log("Version on server is: " + SERVER_VARIABLES.SITE_VERSION);
        if (SERVER_VARIABLES.SITE_VERSION != localStorage.version || SERVER_VARIABLES.LANG != localStorage.lang) {
            localStorage.version = SERVER_VARIABLES.SITE_VERSION;
            localStorage.lang = SERVER_VARIABLES.LANG;
            TT.storage.getArticlesFromServer();
        } else {
            TT.storage.getArticlesFromStorage();
        }
    }
};
TT.storage.activateCurrentPageAndSetPageCount = function() {
    var $origArticle = $("#pages section").eq(0);
    $origArticle.attr("id", "original");
    $("#pages section:not(#original)").each(function(i) {
        if ($(this).hasClass($origArticle.attr("class"))) {
            $origArticle.remove();
            $(this).addClass("current").show().next("section").show();
            $('<span id="currentPage">' + parseFloat(i + 1) + "</span>").appendTo("body");
        }
    });
    if ($("#pages section.current").length === 0) {
        $("#pages section").first().addClass("current");
    }
    $("#pages section div.page").each(function(i) {
        $(this).append('<span class="pageNumber">' + (i + 1) + "</span>");
    });
    if ($("body").hasClass("home")) {
        $("#pages section").removeClass("current");
        $("#pages section").first().addClass("current");
    } else {
        if ($("body").hasClass("credits")) {
            $("#pages section").removeClass("current");
            $("#pages section").last().addClass("current");
        }
    }
    TT.preloader.onContentsLoaded();
};
TT.storage.onFindBookmark = function() {
    if (TT.storage.supportsLocalStorage()) {
        if (TT.storage.data.bookmark.articleId && $("#pagination-prev").hasClass("inactive") && !(TT.storage.data.bookmark.articleId == $("#articleId").text() && TT.storage.data.bookmark.pageNumber == $("#pageNumber").text())) {
            TT.log("Bookmark found: " + TT.storage.data.bookmark.articleId + "/" + TT.storage.data.bookmark.pageNumber);
            TT.overlay.showBookmark(function() {
                TT.navigation.goToPage(TT.storage.data.bookmark.articleId, TT.storage.data.bookmark.pageNumber);
            },
            function() {
                TT.navigation.goToHome();
            },
            function() {
                TT.storage.setBookmark($("#articleId").text(), $("#pageNumber").text());
            });
            TT.log("Bookmark found: " + TT.storage.data.bookmark.articleId + "/" + TT.storage.data.bookmark.pageNumber);
        } else {
            TT.storage.setBookmark($("#articleId").text(), $("#pageNumber").text());
        }
    }
};
TT.storage.setBookmark = function(articleId, pageNumber) {
    if (TT.storage.supportsLocalStorage() && articleId != TT.history.THEEND) {
        TT.storage.data.bookmark.articleId = articleId;
        TT.storage.data.bookmark.pageNumber = pageNumber;
        TT.storage.data.progress["/" + articleId + "/" + pageNumber] = true;
        TT.storage.save();
        TT.chapternav.updateReadMarkers();
        TT.tableofthings.updateReadMarkers();
    }
};
TT.storage.hasArticleBeenRead = function(articleId) {
    return TT.storage.data.progress["/" + articleId + "/1"] == true;
};
TT.pageflip = {};
TT.pageflip.HINT_WIDTH = 100;
TT.pageflip.HINT_WIDTH_TOUCH = 250;
TT.pageflip.CANVAS_VERTICAL_PADDING = 80;
TT.pageflip.CANVAS_HORIZONTAL_PADDING = 20;
TT.pageflip.CANVAS_WIDTH = TT.BOOK_WIDTH + (TT.pageflip.CANVAS_HORIZONTAL_PADDING * 2);
TT.pageflip.CANVAS_HEIGHT = TT.BOOK_HEIGHT + (TT.pageflip.CANVAS_VERTICAL_PADDING * 2);
TT.pageflip.FRAMERATE = 30;
TT.pageflip.CLICK_FREQUENCY = 350;
TT.pageflip.SOFT_FLIP = "soft";
TT.pageflip.HARD_FLIP = "hard";
TT.pageflip.pages = [];
TT.pageflip.flips = [];
TT.pageflip.canvas = null;
TT.pageflip.context = null;
TT.pageflip.dirtyRegion = new Region();
TT.pageflip.dragging = false;
TT.pageflip.turning = false;
TT.pageflip.hinting = false;
TT.pageflip.loopInterval = -1;
TT.pageflip.mouse = {
    x: 0,
    y: 0,
    down: false
};
TT.pageflip.mouseHistory = [];
TT.pageflip.skew = {
    top: 0,
    topTarget: 0,
    bottom: 0,
    bottomTarget: 0
};
TT.pageflip.mouseDownTime = 0;
TT.pageflip.texture = null;
TT.pageflip.textures = {};
TT.pageflip.flippedLeftPage = null;
TT.pageflip.flippedBackCover = null;
TT.pageflip.lastKeyboardNavigationTime = 0;
TT.pageflip.lastKeyboardNavigationDirection = null;
TT.pageflip.eventsAreBound = null;
TT.pageflip.initialize = function() {
    TT.pageflip.createCanvas();
    TT.pageflip.createTextures();
    if (TT.pageflip.eventsAreBound == null) {
        TT.pageflip.registerEventListeners();
    }
    $(document).bind("keydown", TT.pageflip.onKeyPress);
};
TT.pageflip.registerEventListeners = function() {
    TT.pageflip.unregisterEventListeners();
    TT.pageflip.eventsAreBound = true;
    $(document).bind("mousemove", TT.pageflip.onMouseMove);
    $(document).bind("mousedown", TT.pageflip.onMouseDown);
    $(document).bind("mouseup", TT.pageflip.onMouseUp);
    if (TT.IS_TOUCH_DEVICE) {
        document.addEventListener("touchstart", TT.pageflip.onTouchStart, false);
        document.addEventListener("touchmove", TT.pageflip.onTouchMove, false);
        document.addEventListener("touchend", TT.pageflip.onTouchEnd, false);
    }
};
TT.pageflip.unregisterEventListeners = function() {
    TT.pageflip.eventsAreBound = false;
    $(document).unbind("mousemove", TT.pageflip.onMouseMove);
    $(document).unbind("mousedown", TT.pageflip.onMouseDown);
    $(document).unbind("mouseup", TT.pageflip.onMouseUp);
    if (TT.IS_TOUCH_DEVICE) {
        document.removeEventListener("touchstart", TT.pageflip.onTouchStart);
        document.removeEventListener("touchmove", TT.pageflip.onTouchMove);
        document.removeEventListener("touchend", TT.pageflip.onTouchEnd);
    }
};
TT.pageflip.createTextures = function() {
    TT.pageflip.flippedLeftPage = $("<img>", {
        src: $("#left-page img").attr("data-src-flipped"),
        width: $("#left-page img").attr("width"),
        height: $("#left-page img").attr("height")
    })[0];
    TT.pageflip.flippedBackCover = $("<img>", {
        src: $("#back-cover img").attr("data-src-flipped"),
        width: $("#back-cover img").attr("width"),
        height: $("#back-cover img").attr("height")
    })[0];
    TT.pageflip.textures.front = $("#front-cover img")[0];
    TT.pageflip.textures.back = TT.pageflip.flippedBackCover;
    TT.pageflip.textures.left = TT.pageflip.flippedLeftPage;
    TT.pageflip.textures.right = $("#right-page img")[0];
};
TT.pageflip.createCanvas = function() {
    TT.pageflip.canvas = $('<canvas id="pageflip"></canvas>');
    TT.pageflip.canvas.css({
        position: "absolute",
        top: -TT.pageflip.CANVAS_VERTICAL_PADDING,
        left: -TT.pageflip.CANVAS_HORIZONTAL_PADDING,
        zIndex: 0
    });
    TT.pageflip.canvas[0].width = TT.pageflip.CANVAS_WIDTH;
    TT.pageflip.canvas[0].height = TT.pageflip.CANVAS_HEIGHT;
    TT.pageflip.context = TT.pageflip.canvas[0].getContext("2d");
    TT.pageflip.canvas.appendTo($("#book"));
};
TT.pageflip.createCanvasTexture = function(image, translation, scale, rotation) {
    var canvas = $("<canvas></canvas>");
    canvas.css({
        position: "absolute",
        display: "block"
    });
    canvas[0].width = TT.BOOK_WIDTH_CLOSED;
    canvas[0].height = TT.BOOK_HEIGHT;
    var context = canvas[0].getContext("2d");
    context.translate(translation.x, translation.y);
    context.scale(scale.x, scale.y);
    context.rotate(rotation);
    context.drawImage(image, 0, 0);
    return canvas[0];
};
TT.pageflip.activate = function() {
    if (TT.pageflip.loopInterval == -1) {
        clearInterval(TT.pageflip.loopInterval);
        TT.pageflip.loopInterval = setInterval(TT.pageflip.redraw, 1000 / TT.pageflip.FRAMERATE);
    }
    TT.pageflip.canvas.css("z-index", 1010);
};
TT.pageflip.deactivate = function() {
    clearInterval(TT.pageflip.loopInterval);
    TT.pageflip.loopInterval = -1;
    TT.pageflip.context.clearRect(0, 0, TT.pageflip.CANVAS_WIDTH, TT.pageflip.CANVAS_HEIGHT);
    TT.pageflip.canvas.css("z-index", 0);
};
TT.pageflip.redraw = function() {
    var cvs = TT.pageflip.canvas[0];
    var ctx = TT.pageflip.context;
    var dirtyRect = TT.pageflip.dirtyRegion.toRectangle(40);
    if (dirtyRect.width > 1 && dirtyRect.height > 1) {
        ctx.clearRect(dirtyRect.x, dirtyRect.y, dirtyRect.width, dirtyRect.height);
    }
    TT.pageflip.dirtyRegion.reset();
    for (var i = 0, len = TT.pageflip.flips.length; i < len; i++) {
        var flip = TT.pageflip.flips[i];
        if (flip.type == TT.pageflip.HARD_FLIP) {
            TT.pageflip.renderHardFlip(flip);
        } else {
            TT.pageflip.renderSoftFlip(flip);
        }
    }
    TT.pageflip.removeInactiveFlips();
};
TT.pageflip.renderSoftFlip = function(flip) {
    var mouse = TT.pageflip.mouse;
    var skew = TT.pageflip.skew;
    var cvs = TT.pageflip.canvas[0];
    var ctx = TT.pageflip.context;
    var currentPage = flip.currentPage;
    if (flip.direction === -1) {
        currentPage = flip.targetPage;
    } else {
        flip.targetPage.width(TT.PAGE_WIDTH);
    }
    if (TT.pageflip.dragging && !flip.consumed) {
        mouse.x = Math.max(Math.min(mouse.x, TT.PAGE_WIDTH), -TT.PAGE_WIDTH);
        mouse.y = Math.max(Math.min(mouse.y, TT.PAGE_HEIGHT), 0);
        flip.progress = Math.min(mouse.x / TT.PAGE_WIDTH, 1);
    } else {
        var distance = Math.abs(flip.target - flip.progress);
        var speed = flip.target == -1 ? 0.3 : 0.2;
        var ease = distance < 1 ? speed + Math.abs(flip.progress * (1 - speed)) : speed;
        ease *= Math.max(1 - Math.abs(flip.progress), flip.target == 1 ? 0.5 : 0.2);
        flip.progress += (flip.target - flip.progress) * ease;
        if (Math.round(flip.progress * 99) == Math.round(flip.target * 99)) {
            flip.progress = flip.target;
            flip.x = TT.PAGE_WIDTH * flip.progress;
            currentPage.css({
                width: flip.x
            });
            if (flip.target == 1 || flip.target == -1) {
                flip.consumed = true;
                TT.pageflip.completeCurrentTurn();
                return false;
            }
        }
    }
    flip.x = TT.PAGE_WIDTH * flip.progress;
    flip.strength = 1 - (flip.x / TT.PAGE_WIDTH);
    if (flip.target == -1 && flip.progress < -0.9) {
        flip.alpha = 1 - ((Math.abs(flip.progress) - 0.9) / 0.1);
    }
    var shadowAlpha = Math.min(1 - ((Math.abs(flip.progress) - 0.75) / 0.25), 1);
    var centralizedFoldStrength = flip.strength > 1 ? 2 - flip.strength: flip.strength;
    var verticalOutdent = 40 * centralizedFoldStrength;
    var horizontalSpread = (TT.PAGE_WIDTH * 0.5) * flip.strength * 0.95;
    if (flip.x + horizontalSpread < 0) {
        horizontalSpread = Math.abs(flip.x);
    }
    if (TT.navigation.isCreditsPage()) {
        horizontalSpread = 0;
    }
    var shadowSpread = (TT.PAGE_WIDTH * 0.5) * Math.max(Math.min(flip.strength, 0.5), 0);
    var rightShadowWidth = (TT.PAGE_WIDTH * 0.5) * Math.max(Math.min(flip.strength, 0.5), 0);
    var leftShadowWidth = (TT.PAGE_WIDTH * 0.5) * Math.max(Math.min(centralizedFoldStrength, 0.5), 0);
    var foldShadowWidth = (TT.PAGE_WIDTH * 0.9) * Math.max(Math.min(flip.strength, 0.05), 0);
    currentPage.css({
        width: Math.max(flip.x + horizontalSpread * 0.5, 0)
    });
    if (TT.pageflip.dragging) {
        skew.topTarget = Math.max(Math.min((mouse.y / (TT.PAGE_HEIGHT * 0.5)), 1), 0) * (40 * centralizedFoldStrength);
        skew.bottomTarget = Math.max(Math.min(1 - (mouse.y - (TT.PAGE_HEIGHT * 0.5)) / (TT.PAGE_HEIGHT * 0.5), 1), 0) * (40 * centralizedFoldStrength);
    } else {
        skew.topTarget = 0;
        skew.bottomTarget = 0;
    }
    if (flip.progress === 1) {
        skew.top = 0;
        skew.bottom = 0;
    }
    skew.top += (skew.topTarget - skew.top) * 0.3;
    skew.bottom += (skew.bottomTarget - skew.bottom) * 0.3;
    flip.x += horizontalSpread;
    var drawingOffset = {
        x: TT.pageflip.CANVAS_HORIZONTAL_PADDING + TT.PAGE_MARGIN_X + TT.PAGE_WIDTH,
        y: TT.pageflip.CANVAS_VERTICAL_PADDING + TT.PAGE_MARGIN_Y
    };
    ctx.save();
    ctx.translate(drawingOffset.x, drawingOffset.y);
    ctx.globalAlpha = flip.alpha;
    if (flip.direction == -1) {
        ctx.globalCompositeOperation = "destination-over";
    }
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(flip.x + 1, 0);
    ctx.lineTo(flip.x + 1, TT.PAGE_HEIGHT);
    ctx.stroke();
    var foldGradient = ctx.createLinearGradient(flip.x - shadowSpread, 0, flip.x, 0);
    foldGradient.addColorStop(0.35, "#fafafa");
    foldGradient.addColorStop(0.73, "#eeeeee");
    foldGradient.addColorStop(0.9, "#fafafa");
    foldGradient.addColorStop(1, "#e2e2e2");
    ctx.fillStyle = foldGradient;
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(flip.x, 0);
    ctx.lineTo(flip.x, TT.PAGE_HEIGHT);
    ctx.quadraticCurveTo(flip.x, TT.PAGE_HEIGHT + (verticalOutdent * 1.9), flip.x - horizontalSpread + skew.bottom, TT.PAGE_HEIGHT + verticalOutdent);
    ctx.lineTo(flip.x - horizontalSpread + skew.top, -verticalOutdent);
    ctx.quadraticCurveTo(flip.x, -verticalOutdent * 1.9, flip.x, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0," + (0.04 * shadowAlpha) + ")";
    ctx.lineWidth = 20 * shadowAlpha;
    ctx.beginPath();
    ctx.moveTo(flip.x + skew.top - horizontalSpread, -verticalOutdent * 0.5);
    ctx.lineTo(flip.x + skew.bottom - horizontalSpread, TT.PAGE_HEIGHT + (verticalOutdent * 0.5));
    ctx.stroke();
    var rightShadowGradient = ctx.createLinearGradient(flip.x, 0, flip.x + rightShadowWidth, 0);
    rightShadowGradient.addColorStop(0, "rgba(0,0,0," + (shadowAlpha * 0.1) + ")");
    rightShadowGradient.addColorStop(0.8, "rgba(0,0,0,0.0)");
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = rightShadowGradient;
    ctx.beginPath();
    ctx.moveTo(flip.x, 0);
    ctx.lineTo(flip.x + rightShadowWidth, 0);
    ctx.lineTo(flip.x + rightShadowWidth, TT.PAGE_HEIGHT);
    ctx.lineTo(flip.x, TT.PAGE_HEIGHT);
    ctx.fill();
    var foldShadowGradient = ctx.createLinearGradient(flip.x, 0, flip.x + foldShadowWidth, 0);
    foldShadowGradient.addColorStop(0, "rgba(0,0,0," + (shadowAlpha * 0.15) + ")");
    foldShadowGradient.addColorStop(1, "rgba(0,0,0,0.0)");
    ctx.fillStyle = foldShadowGradient;
    ctx.beginPath();
    ctx.moveTo(flip.x, 0);
    ctx.lineTo(flip.x + foldShadowWidth, 0);
    ctx.lineTo(flip.x + foldShadowWidth, TT.PAGE_HEIGHT);
    ctx.lineTo(flip.x, TT.PAGE_HEIGHT);
    ctx.fill();
    ctx.restore();
    var leftShadowGradient = ctx.createLinearGradient(flip.x - horizontalSpread - leftShadowWidth, 0, flip.x - horizontalSpread, 0);
    leftShadowGradient.addColorStop(0, "rgba(0,0,0,0.0)");
    leftShadowGradient.addColorStop(1, "rgba(0,0,0," + (shadowAlpha * 0.05) + ")");
    ctx.fillStyle = leftShadowGradient;
    ctx.beginPath();
    ctx.moveTo(flip.x - horizontalSpread + skew.top - leftShadowWidth, 0);
    ctx.lineTo(flip.x - horizontalSpread + skew.top, 0);
    ctx.lineTo(flip.x - horizontalSpread + skew.bottom, TT.PAGE_HEIGHT);
    ctx.lineTo(flip.x - horizontalSpread + skew.bottom - leftShadowWidth, TT.PAGE_HEIGHT);
    ctx.fill();
    ctx.restore();
    TT.pageflip.dirtyRegion.inflate(TT.PAGE_WIDTH + TT.pageflip.CANVAS_HORIZONTAL_PADDING + flip.x - horizontalSpread - leftShadowWidth, 0);
    TT.pageflip.dirtyRegion.inflate(TT.PAGE_WIDTH + TT.pageflip.CANVAS_HORIZONTAL_PADDING + flip.x + rightShadowWidth, TT.pageflip.CANVAS_HEIGHT);
};
TT.pageflip.renderHardFlip = function(flip) {
    var mouse = TT.pageflip.mouse;
    var skew = TT.pageflip.skew;
    var cvs = TT.pageflip.canvas[0];
    var ctx = TT.pageflip.context;
    var currentPage = flip.currentPage;
    if (flip.direction === -1) {
        currentPage = flip.targetPage;
    }
    if (TT.pageflip.dragging) {
        mouse.x = Math.max(Math.min(mouse.x, TT.PAGE_WIDTH), -TT.PAGE_WIDTH);
        mouse.y = Math.max(Math.min(mouse.y, TT.PAGE_HEIGHT), 0);
        flip.target = mouse.x / TT.PAGE_WIDTH;
        flip.progress += (flip.target - flip.progress) * 0.4;
    } else {
        if (Math.abs(flip.target) === 1) {
            flip.progress += Math.max(0.5 * (1 - Math.abs(flip.progress)), 0.02) * (flip.target < flip.progress ? -1 : 1);
            flip.progress = Math.max(Math.min(flip.progress, 1), -1);
        } else {
            flip.progress += (flip.target - flip.progress) * 0.4;
        }
        if (flip.progress === 1 || flip.progress === -1) {
            flip.progress = flip.target;
            flip.x = TT.PAGE_WIDTH * flip.progress;
            if (TT.navigation.isCreditsPage()) {
                currentPage.width(flip.x);
            }
            if (flip.target == 1 || flip.target == -1) {
                flip.consumed = true;
                TT.pageflip.completeCurrentTurn();
            }
        }
    }
    if (TT.navigation.isHomePage()) {
        if (flip.progress > 0.99) {
            $("#front-cover-bookmark").stop(true, true).fadeIn(300);
            $("#front-cover").show();
        } else {
            $("#front-cover").hide();
            if (flip.progress < 0.99) {
                $("#front-cover-bookmark").fadeOut(250,
                function() {
                    $(this).hide();
                });
            }
        }
        if (flip.progress > 0) {
            TT.pageflip.texture = TT.pageflip.textures.front;
            $("#left-page").width(0).hide();
        } else {
            TT.pageflip.texture = TT.pageflip.textures.left;
            if (flip.progress < -0.99) {
                $("#left-page").show().width(TT.BOOK_WIDTH_CLOSED);
            } else {
                $("#left-page").width(0).hide();
                $("#right-page").show();
            }
        }
        $("#page-shadow-overlay").stop(true, true).fadeTo(0.1, flip.progress * 0.3);
    } else {
        if (TT.navigation.isCreditsPage() || TT.navigation.isLastPage()) {
            if (flip.progress < -0.998) {
                if (TT.navigation.isCreditsPage()) {
                    $("#back-cover").show();
                } else {
                    $("#left-page").show().width(TT.BOOK_WIDTH_CLOSED);
                }
            } else {
                $("#back-cover").hide();
                $("body").addClass("credits");
            }
            if (flip.progress > 0) {
                TT.pageflip.texture = TT.pageflip.textures.right;
                if (flip.progress > 0.996) {
                    $("#right-page").show();
                    $("body").removeClass("credits");
                } else {
                    $("#right-page").hide();
                }
            } else {
                TT.pageflip.texture = TT.pageflip.textures.back;
            }
        } else {
            $("#right-page").show();
            $("#left-page").show().width(TT.BOOK_WIDTH_CLOSED);
        }
    }
    if (flip.target == -1 && flip.progress < -0.95) {
        flip.alpha = 1 - ((Math.abs(flip.progress) - 0.95) / 0.05);
    }
    flip.x = TT.PAGE_WIDTH * flip.progress;
    flip.strength = 1 - (flip.x / TT.PAGE_WIDTH);
    var centralizedFoldStrength = flip.strength > 1 ? 2 - flip.strength: flip.strength;
    if (TT.navigation.isCreditsPage() || TT.navigation.isLastPage()) {
        currentPage.css({
            width: Math.max(flip.x, 0)
        });
    }
    ctx.save();
    ctx.translate(TT.pageflip.CANVAS_HORIZONTAL_PADDING + TT.BOOK_WIDTH_CLOSED, TT.pageflip.CANVAS_VERTICAL_PADDING);
    var scaleX = flip.progress;
    var scaleY = 0;
    var scaleYFactor = 0.35;
    var scaleYFinal = 1 + (1 * scaleYFactor) * centralizedFoldStrength;
    var width = TT.BOOK_WIDTH_CLOSED;
    var height = TT.BOOK_HEIGHT;
    var segments = Math.round(40 + (30 * (0.9999 - ((TT.BOOK_WIDTH_CLOSED * scaleX)) / TT.BOOK_WIDTH_CLOSED)));
    segments = Math.min(width, segments);
    var segmentWidth = width / segments;
    var thickness = 10 * centralizedFoldStrength;
    var hoffset = flip.progress <= 0.05 ? 1 + (1 - (Math.max(flip.progress, 0) / 0.05)) * -thickness: -1;
    var voffset = {
        left: Math.abs(Math.min(flip.progress, 0)) * 2,
        right: flip.progress * 2
    };
    if (Math.abs(scaleX) < 0.99) {
        var ext = ((height - (height * scaleYFinal)) / 2);
        ctx.fillStyle = SERVER_VARIABLES.SOLID_BOOK_COLOR;
        ctx.beginPath();
        ctx.moveTo(0, -0.5);
        ctx.lineTo((width * scaleX) - (2 * scaleX), ext - 0.5);
        ctx.lineTo((width * scaleX) + (thickness + hoffset), ext + voffset.right);
        ctx.lineTo((width * scaleX) + (thickness + hoffset), ext + (height * scaleYFinal) - voffset.right);
        ctx.lineTo((width * scaleX) - (2 * scaleX), ext + (height * scaleYFinal) + 0.5);
        ctx.lineTo(0, height + 0.5);
        ctx.closePath();
        ctx.fill();
    }
    for (var i = 0; i < segments; i++) {
        scaleY = 1 + (i / segments) * scaleYFactor * centralizedFoldStrength;
        var y = (height - (height * scaleY)) / 2;
        var sw = i >= segments - 1 ? segmentWidth: segmentWidth + 3;
        ctx.save();
        ctx.translate(0, y);
        ctx.transform(scaleX, 0, 0, scaleY, 0, 0);
        while ((i * segmentWidth) + sw > TT.BOOK_WIDTH_CLOSED) {
            sw *= 0.9999;
        }
        ctx.drawImage(TT.pageflip.texture, i * segmentWidth, 0, sw, height, i * segmentWidth, 0, sw, height);
        ctx.restore();
    }
    var intensity = Math.max(Math.abs(centralizedFoldStrength), 0.9);
    var ps = {
        top: {
            x: (width * scaleX) + hoffset,
            y: (height - (height * scaleY)) / 2
        },
        bottom: {
            x: (width * scaleX) + hoffset,
            y: ((height - (height * scaleY)) / 2) + height * scaleY
        }
    };
    ctx.fillStyle = SERVER_VARIABLES.SOLID_BOOK_COLOR;
    ctx.beginPath();
    ctx.moveTo(ps.top.x, ps.top.y + voffset.left);
    ctx.lineTo(ps.top.x + thickness, ps.top.y + voffset.right);
    ctx.lineTo(ps.bottom.x + thickness, ps.bottom.y - voffset.right);
    ctx.lineTo(ps.bottom.x, ps.bottom.y - voffset.left);
    ctx.closePath();
    ctx.fill();
    TT.pageflip.dirtyRegion.inflate(TT.PAGE_WIDTH + TT.pageflip.CANVAS_HORIZONTAL_PADDING + TT.PAGE_MARGIN_X - thickness, ps.top.y + TT.pageflip.CANVAS_VERTICAL_PADDING);
    TT.pageflip.dirtyRegion.inflate(TT.PAGE_WIDTH + TT.pageflip.CANVAS_HORIZONTAL_PADDING + (width * scaleX) + thickness, ps.bottom.y + TT.pageflip.CANVAS_VERTICAL_PADDING);
    ctx.restore();
};
TT.pageflip.removeInactiveFlips = function() {
    var activeFlips = 0;
    for (var i = 0; i < TT.pageflip.flips.length; i++) {
        var flip = TT.pageflip.flips[i];
        if (flip.progress === flip.target && (flip.target === 1 || flip.target === -1)) {
            TT.pageflip.flips.splice(i, 1);
            i--;
        } else {
            activeFlips++;
        }
    }
    if (activeFlips == 0) {
        TT.pageflip.deactivate();
    }
};
TT.pageflip.removeHardFlips = function() {
    for (var i = 0; i < TT.pageflip.flips.length; i++) {
        var flip = TT.pageflip.flips[i];
        if (flip.type == TT.pageflip.HARD_FLIP) {
            TT.pageflip.flips.splice(i, 1);
            i--;
        }
    }
};
TT.pageflip.turnToPage = function(currentPage, targetPage, direction, type) {
    if (type == TT.pageflip.HARD_FLIP && !TT.pageflip.dragging) {
        TT.pageflip.removeHardFlips();
    }
    var flip = TT.pageflip.getCurrentFlip();
    if (flip.consumed) {
        flip = TT.pageflip.createFlip();
    }
    TT.pageflip.dragging = false;
    TT.pageflip.turning = true;
    TT.pageflip.hinting = false;
    flip.currentPage = currentPage;
    flip.targetPage = targetPage;
    flip.direction = direction;
    flip.alpha = 1;
    flip.consumed = true;
    flip.type = type || TT.pageflip.SOFT_FLIP;
    flip.target = -1;
    if (direction === -1) {
        flip.target = 1;
        flip.progress = -1;
    }
    if (TT.navigation.isFullScreen()) {
        flip.progress = flip.target * 0.95;
    }
    TT.pageflip.activate();
    TT.pageflip.redraw();
};
TT.pageflip.completeCurrentTurn = function() {
    if (TT.pageflip.turning) {
        TT.pageflip.turning = false;
        var flip = TT.pageflip.flips[TT.pageflip.flips.length - 1];
        if (flip) {
            TT.navigation.updateCurrentPointer(flip.currentPage, flip.targetPage);
        }
    }
};
TT.pageflip.getCurrentFlip = function() {
    if (TT.pageflip.flips.length == 0) {
        TT.pageflip.createFlip();
    }
    return TT.pageflip.flips[TT.pageflip.flips.length - 1];
};
TT.pageflip.createFlip = function() {
    if (TT.pageflip.flips.length > 3) {
        TT.pageflip.flips = TT.pageflip.flips.splice(4, 99);
    }
    var flip = new TT.pageflip.Flip();
    TT.pageflip.flips.push(flip);
    return flip;
};
TT.pageflip.getHintRegion = function() {
    var region = new Region();
    if (TT.navigation.isHomePage() || TT.navigation.isLastPage() || TT.navigation.isCreditsPage()) {
        region.left = TT.BOOK_WIDTH_CLOSED - (TT.IS_TOUCH_DEVICE ? TT.pageflip.HINT_WIDTH_TOUCH: TT.pageflip.HINT_WIDTH);
        region.right = TT.BOOK_WIDTH_CLOSED;
    } else {
        region.left = TT.PAGE_WIDTH - (TT.IS_TOUCH_DEVICE ? TT.pageflip.HINT_WIDTH_TOUCH: TT.pageflip.HINT_WIDTH);
        region.right = TT.PAGE_WIDTH;
    }
    region.top = 0;
    region.bottom = TT.PAGE_HEIGHT;
    return region;
};
TT.pageflip.isMouseInHintRegion = function() {
    return TT.pageflip.getHintRegion().contains(TT.pageflip.mouse.x, TT.pageflip.mouse.y);
};
TT.pageflip.onKeyPress = function(event) {
    if (!TT.search.hasFocus) {
        var hasPassedLockdown = TT.time() - TT.pageflip.lastKeyboardNavigationTime > 1000;
        if (event.keyCode == 37 && (TT.pageflip.lastKeyboardNavigationDirection === -1 || hasPassedLockdown)) {
            TT.navigation.goToPreviousPage();
            TT.pageflip.lastKeyboardNavigationDirection = -1;
            TT.pageflip.lastKeyboardNavigationTime = TT.time();
            event.preventDefault();
            return false;
        } else {
            if (event.keyCode == 39 && (TT.pageflip.lastKeyboardNavigationDirection === 1 || hasPassedLockdown)) {
                TT.navigation.goToNextPage();
                TT.pageflip.lastKeyboardNavigationDirection = 1;
                TT.pageflip.lastKeyboardNavigationTime = TT.time();
                event.preventDefault();
                return false;
            } else {
                if (event.keyCode == 27) {
                    TT.fullscreen.exit();
                    event.preventDefault();
                    return false;
                }
            }
        }
    }
};
TT.pageflip.handlePointerDown = function() {
    if (TT.pageflip.isMouseInHintRegion()) {
        $("body").css("cursor", "pointer");
        if (TT.time() - TT.pageflip.mouseDownTime > TT.pageflip.CLICK_FREQUENCY) {
            TT.pageflip.dragging = true;
        }
        TT.pageflip.mouseDownTime = TT.time();
        TT.pageflip.activate();
    }
};
TT.pageflip.handlePointerMove = function() {
    var hinting = TT.pageflip.hinting;
    TT.pageflip.hinting = false;
    $("body").css("cursor", "");
    if (!TT.pageflip.dragging && !TT.pageflip.turning && (!TT.navigation.isCreditsPage() || (TT.navigation.isCreditsPage() && TT.navigation.isBookOpen()))) {
        var flip = TT.pageflip.getCurrentFlip();
        if (flip.progress < 0) {
            flip = TT.pageflip.createFlip();
        }
        var isHardCover = (TT.navigation.isHomePage() || TT.navigation.isLastPage() || (TT.navigation.isCreditsPage() && TT.navigation.isBookOpen()));
        flip.type = isHardCover ? TT.pageflip.HARD_FLIP: TT.pageflip.SOFT_FLIP;
        if (TT.pageflip.isMouseInHintRegion()) {
            if (TT.pageflip.mouseHistory[4]) {
                var distanceX = TT.pageflip.mouse.x - (TT.pageflip.mouseHistory[4].x || 0);
                var distanceY = TT.pageflip.mouse.y - (TT.pageflip.mouseHistory[4].y || 0);
                var distanceTravelled = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            } else {
                var distanceTravelled = 0;
            }
            if (!TT.navigation.isHomePage() || distanceTravelled < 100) {
                flip.target = Math.min(TT.pageflip.mouse.x / TT.PAGE_WIDTH, 0.98);
                $("body").css("cursor", "pointer");
                TT.pageflip.activate();
                TT.pageflip.hinting = true;
                if (TT.navigation.isHomePage()) {
                    flip.target = Math.min(TT.pageflip.mouse.x / TT.PAGE_WIDTH, 0.95);
                    $("#pages section.current").show().width(TT.PAGE_WIDTH);
                } else {
                    $("#pages section.current").next("section").show().width(TT.PAGE_WIDTH);
                }
            }
        } else {
            if (flip.progress !== 1 && flip.target !== -1) {
                if (TT.pageflip.hinting == true) {
                    $("#pages section.current").next("section").width(0);
                }
                flip.target = 1;
                TT.pageflip.activate();
                TT.pageflip.hinting = false;
            }
        }
    } else {
        if (TT.pageflip.dragging) {
            if (TT.pageflip.getCurrentFlip().type != TT.pageflip.HARD_FLIP) {
                TT.pageflip.getCurrentFlip().alpha = 1;
            }
        }
    }
    while (TT.pageflip.mouseHistory.length > 9) {
        TT.pageflip.mouseHistory.pop();
    }
    TT.pageflip.mouseHistory.unshift(TT.pageflip.mouse);
};
TT.pageflip.handlePointerUp = function() {
    if (TT.time() - TT.pageflip.mouseDownTime < TT.pageflip.CLICK_FREQUENCY) {
        TT.navigation.goToNextPage();
        TT.pageflip.dragging = false;
        return false;
    }
    if (TT.pageflip.dragging && TT.pageflip.mouse.x < TT.PAGE_WIDTH * 0.45) {
        var succeeded = TT.navigation.goToNextPage();
        if (succeeded == false) {
            TT.pageflip.dragging = false;
        }
    } else {
        TT.pageflip.dragging = false;
        TT.pageflip.handlePointerMove();
    }
};
TT.pageflip.onMouseDown = function(event) {
    TT.pageflip.mouse.down = true;
    TT.pageflip.updateRelativeMousePosition(event.clientX, event.clientY);
    TT.pageflip.handlePointerDown();
    if (TT.pageflip.isMouseInHintRegion()) {
        event.preventDefault();
        return false;
    }
};
TT.pageflip.onMouseMove = function(event) {
    TT.pageflip.updateRelativeMousePosition(event.clientX, event.clientY);
    TT.pageflip.handlePointerMove();
};
TT.pageflip.onMouseUp = function(event) {
    TT.pageflip.mouse.down = false;
    TT.pageflip.updateRelativeMousePosition(event.clientX, event.clientY);
    TT.pageflip.handlePointerUp();
};
TT.pageflip.onTouchStart = function(event) {
    if (event.touches.length == 1) {
        var globalX = event.touches[0].pageX - (window.innerWidth - TT.PAGE_WIDTH) * 0.5;
        var globalY = event.touches[0].pageY - (window.innerHeight - TT.PAGE_HEIGHT) * 0.5;
        TT.pageflip.updateRelativeMousePosition(globalX, globalY);
        TT.pageflip.mouse.down = true;
        if (TT.pageflip.isMouseInHintRegion()) {
            event.preventDefault();
            TT.pageflip.handlePointerDown();
        }
    }
};
TT.pageflip.onTouchMove = function(event) {
    if (event.touches.length == 1) {
        var globalX = event.touches[0].pageX - (window.innerWidth - TT.PAGE_WIDTH) * 0.5;
        var globalY = event.touches[0].pageY - (window.innerHeight - TT.PAGE_HEIGHT) * 0.5;
        TT.pageflip.updateRelativeMousePosition(globalX, globalY);
        if (TT.pageflip.isMouseInHintRegion()) {
            event.preventDefault();
            TT.pageflip.handlePointerMove();
        }
    }
};
TT.pageflip.onTouchEnd = function(event) {
    TT.pageflip.mouse.down = false;
    TT.pageflip.handlePointerUp();
};
TT.pageflip.getRelativeMousePosition = function(globalX, globalY) {
    var point = {
        x: globalX,
        y: globalY
    };
    point.x -= $("#pages").offset().left + TT.PAGE_WIDTH;
    point.y -= $("#pages").offset().top;
    return point;
};
TT.pageflip.updateRelativeMousePosition = function(globalX, globalY) {
    var point = TT.pageflip.getRelativeMousePosition(globalX, globalY);
    TT.pageflip.mouse.x = point.x;
    TT.pageflip.mouse.y = point.y;
};
TT.pageflip.Flip = function() {
    this.id = Math.round(Math.random() * 1000);
    this.currentPage = $("#pages section.current");
    this.targetPage = $("#pages section.current");
    this.direction = -1;
    this.progress = 1;
    this.target = 1;
    this.strength = 0;
    this.alpha = 1;
    this.type = TT.pageflip.SOFT_FLIP;
    this.x = 0;
    this.consumed = false;
};
function Region() {
    this.left = 999999;
    this.top = 999999;
    this.right = 0;
    this.bottom = 0;
}
Region.prototype.reset = function() {
    this.left = 999999;
    this.top = 999999;
    this.right = 0;
    this.bottom = 0;
};
Region.prototype.inflate = function(x, y) {
    this.left = Math.min(this.left, x);
    this.top = Math.min(this.top, y);
    this.right = Math.max(this.right, x);
    this.bottom = Math.max(this.bottom, y);
};
Region.prototype.contains = function(x, y) {
    return x > this.left && x < this.right && y > this.top && y < this.bottom;
};
Region.prototype.toRectangle = function(padding) {
    padding |= 0;
    return {
        x: this.left - padding,
        y: this.top - padding,
        width: this.right - this.left + (padding * 2),
        height: this.bottom - this.top + (padding * 2)
    };
};
TT.paperstack = {};
TT.paperstack.container = null;
TT.paperstack.initialize = function() {
    TT.paperstack.container = $("#paperstack");
};
TT.paperstack.updateStack = function(overrideProgress) {
    var availablePapers = $("div.paper", TT.paperstack.container).length;
    var visiblePapers = Math.round(((1 - (overrideProgress ? overrideProgress: TT.chapternav.getProgress())) * availablePapers));
    if (visiblePapers != 0) {
        $(".paper:lt(" + visiblePapers + ")", TT.paperstack.container).css({
            opacity: 1
        });
        $(".paper:gt(" + visiblePapers + ")", TT.paperstack.container).css({
            opacity: 0
        });
        $(".shadow", TT.paperstack.container).css({
            opacity: 1
        });
    } else {
        $(".paper", TT.paperstack.container).css({
            opacity: 0
        });
        $(".shadow", TT.paperstack.container).css({
            opacity: 0
        });
    }
    $(".shadow", TT.paperstack.container).css({
        marginLeft: -9 + visiblePapers
    });
};
TT.illustrations = {};
TT.illustrations.FRAME_RATE = 30;
TT.illustrations.ASSETS_URL = "/media/illustrations/";
TT.illustrations.interval = -1;
TT.illustrations.update = function(currentPage) {
    TT.illustrations.deactivate();
    if (currentPage && !TT.navigation.isHomePage() && !TT.navigation.isFullScreen()) {
        TT.log("Activate animation: " + currentPage.attr("class"));
        if (currentPage.hasClass("title-html") && currentPage.hasClass("page-3")) {
            TT.illustrations.html.activate($("div.image1", currentPage));
        } else {
            if (currentPage.hasClass("title-foreword") && currentPage.hasClass("page-1")) {
                TT.illustrations.cloud.activate($("div.image1", currentPage));
            } else {
                if (currentPage.hasClass("title-open-source") && currentPage.hasClass("page-1")) {
                    TT.illustrations.opensource.activate($("div.image1", currentPage));
                } else {
                    if (currentPage.hasClass("title-what-is-the-internet") && currentPage.hasClass("page-1")) {
                        TT.illustrations.internet.activate($("div.image1", currentPage));
                    } else {
                        if (currentPage.hasClass("title-page-load") && currentPage.hasClass("page-1")) {
                            TT.illustrations.pageload.activate($("div.image1", currentPage));
                        } else {
                            if (currentPage.hasClass("title-web-apps") && currentPage.hasClass("page-1")) {
                                TT.illustrations.webapps.activate($("div.image1", currentPage));
                            } else {
                                if (currentPage.hasClass("title-threed") && currentPage.hasClass("page-1")) {
                                    TT.illustrations.threed.activate($("div.image1", currentPage));
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
TT.illustrations.deactivate = function() {
    clearInterval(TT.illustrations.interval);
};
TT.illustrations.createCanvas = function(parent, world) {
    var canvas = $("<canvas></canvas>");
    canvas[0].width = world.width;
    canvas[0].height = world.height;
    parent.append(canvas);
    TT.illustrations.updateCanvasPosition(parent, world);
    return canvas;
};
TT.illustrations.updateCanvasPosition = function(parent, world) {
    var canvas = $("canvas", parent);
    canvas.css({
        position: "absolute",
        left: $("img", parent).position().left + world.x,
        top: $("img", parent).position().top + world.y
    });
    return $("img", parent).width() !== 0 || $("img", parent).height() !== 0;
};
TT.illustrations.threed = {
    canvas: null,
    context: null,
    container: null,
    image: null,
    cloudImage: null,
    clouds: [],
    alpha: 0,
    world: {
        x: 0,
        y: 0,
        width: 320,
        height: 150
    },
    positioned: false,
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
            this.cloudImage = new Image();
            this.cloudImage.src = TT.illustrations.ASSETS_URL + "3d01_clouds.png";
            this.clouds.push({
                source: {
                    x: 0,
                    y: 0,
                    width: 63,
                    height: 35
                },
                x: 44,
                y: 16,
                originalX: 44,
                originalY: 16,
                velocity: {
                    x: 0,
                    y: 0
                }
            });
            this.clouds.push({
                source: {
                    x: 0,
                    y: 36,
                    width: 70,
                    height: 40
                },
                x: 147,
                y: 10,
                originalX: 147,
                originalY: 10,
                velocity: {
                    x: 0,
                    y: 0
                }
            });
            this.clouds.push({
                source: {
                    x: 0,
                    y: 78,
                    width: 84,
                    height: 50
                },
                x: 213,
                y: 48,
                originalX: 212,
                originalY: 48,
                velocity: {
                    x: 0,
                    y: 0
                }
            });
        } else {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.threed.draw();
    },
    draw: function() {
        if (!this.positioned) {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        if (this.cloudImage.complete) {
            this.alpha = Math.min(this.alpha + 0.1, 1);
            this.context.globalAlpha = this.alpha;
            for (var i = 0; i < this.clouds.length; i++) {
                var cloud = this.clouds[i];
                cloud.x += cloud.velocity.x;
                cloud.y += cloud.velocity.y;
                cloud.velocity.x *= 0.96;
                cloud.velocity.y *= 0.96;
                var speed = 0.3;
                if (Math.abs(cloud.velocity.x) < 0.01) {
                    if (cloud.x > cloud.originalX) {
                        cloud.velocity.x -= 0.05 + Math.random() * speed;
                    } else {
                        cloud.velocity.x += 0.05 + Math.random() * speed;
                    }
                }
                if (Math.abs(cloud.velocity.y) < 0.01) {
                    if (cloud.y > cloud.originalY) {
                        cloud.velocity.y -= 0.01 + Math.random() * speed;
                    } else {
                        cloud.velocity.y += 0.01 + Math.random() * speed;
                    }
                }
                this.context.save();
                this.context.translate(cloud.x, cloud.y);
                this.context.drawImage(this.cloudImage, cloud.source.x, cloud.source.y, cloud.source.width, cloud.source.height, 0, 0, cloud.source.width, cloud.source.height);
                this.context.restore();
            }
        }
    }
};
TT.illustrations.webapps = {
    GRAVITY: 0.04,
    canvas: null,
    context: null,
    container: null,
    image: null,
    leaves: [],
    points: [{
        x: 86,
        y: 100
    },
    {
        x: 35,
        y: 88
    },
    {
        x: 168,
        y: 35
    },
    {
        x: 250,
        y: 15
    }],
    world: {
        x: 20,
        y: 30,
        width: 300,
        height: 260
    },
    positioned: false,
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
        } else {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.webapps.draw();
    },
    draw: function() {
        if (!this.positioned) {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        if (this.leaves.length < 4 && Math.random() > 0.9) {
            var point = this.points[Math.floor(Math.random() * this.points.length)];
            this.leaves.push({
                x: point.x,
                y: point.y,
                w: 18 + (Math.random() * 8),
                h: 6 + (Math.random() * 4),
                alpha: 0,
                rotation: Math.random() * Math.PI,
                velocity: {
                    x: -0.2 + (Math.random() * 0.4),
                    y: Math.random() * 2,
                    rotation: -0.1 + (Math.random() * 0.2)
                }
            });
        }
        for (var i = 0; i < this.leaves.length; i++) {
            var leaf = this.leaves[i];
            leaf.velocity.y += this.GRAVITY;
            if (leaf.y > this.world.height + 20) {
                this.leaves.splice(i, 1);
                i--;
                continue;
            }
            leaf.x += leaf.velocity.x;
            leaf.y += leaf.velocity.y;
            leaf.rotation += leaf.velocity.rotation;
            leaf.alpha = Math.min(leaf.alpha + 0.1, 1);
            this.context.save();
            var b = 3;
            this.context.globalAlpha = leaf.alpha;
            this.context.beginPath();
            this.context.translate(leaf.x, leaf.y);
            this.context.rotate(leaf.rotation);
            this.context.strokeStyle = "rgba(0,100,20,0.7)";
            this.context.fillStyle = "rgba(159,192,94,0.9)";
            this.context.moveTo(0, leaf.h / 2);
            this.context.quadraticCurveTo(leaf.w / 2, -b, leaf.w, leaf.h / 2);
            this.context.quadraticCurveTo(leaf.w / 2, leaf.h + b, 0, leaf.h / 2);
            this.context.stroke();
            this.context.fill();
            this.context.restore();
        }
        var mask = this.context.createLinearGradient(0, 0, 0, this.world.height);
        mask.addColorStop(0.7, "rgba(255, 255, 255, 0)");
        mask.addColorStop(1, "rgba(255, 255, 255, 1)");
        this.context.save();
        this.context.globalCompositeOperation = "destination-out";
        this.context.beginPath();
        this.context.fillStyle = mask;
        this.context.fillRect(0, 0, this.world.width, this.world.height);
        this.context.restore();
    }
};
TT.illustrations.pageload = {
    GRAVITY: 0.04,
    canvas: null,
    context: null,
    container: null,
    image: null,
    bubbles: [],
    world: {
        x: 10,
        y: 100,
        width: 220,
        height: 100
    },
    positioned: false,
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
        } else {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.pageload.draw();
    },
    draw: function() {
        if (!this.positioned) {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        if (this.bubbles.length < 7 && Math.random() > 0.85) {
            this.bubbles.push({
                x: Math.random() * this.world.width,
                y: this.world.height + 10,
                alpha: 0,
                size: 1 + Math.random() * 3,
                velocity: {
                    x: -0.4 + (Math.random() * 0.8),
                    y: Math.random() * -2
                }
            });
        }
        for (var i = 0; i < this.bubbles.length; i++) {
            var bubble = this.bubbles[i];
            bubble.velocity.y -= this.GRAVITY;
            if (bubble.y < -10) {
                this.bubbles.splice(i, 1);
                i--;
                continue;
            } else {
                if (bubble.y < this.world.height * 0.3) {
                    bubble.alpha = Math.max(bubble.y / (this.world.height * 0.3), 0);
                } else {
                    if (bubble.y > this.world.height * 0.7) {
                        bubble.alpha = 1 - Math.min((bubble.y - this.world.height * 0.7) / (this.world.height * 0.3), 1);
                    }
                }
            }
            bubble.x += bubble.velocity.x;
            bubble.y += bubble.velocity.y;
            this.context.beginPath();
            this.context.strokeStyle = "rgba( 0, 0, 0, " + (bubble.alpha * 0.3) + " )";
            this.context.fillStyle = "rgba( 0, 180, 250, " + (bubble.alpha * 0.7) + " )";
            this.context.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2, true);
            this.context.stroke();
        }
        var mask = this.context.createLinearGradient(0, 0, -25, this.world.height);
        mask.addColorStop(0, "rgba(255, 255, 255, 1)");
        mask.addColorStop(0.6, "rgba(255, 255, 255, 0)");
        this.context.save();
        this.context.globalCompositeOperation = "destination-out";
        this.context.beginPath();
        this.context.fillStyle = mask;
        this.context.fillRect(0, 0, this.world.width, this.world.height);
        this.context.restore();
    }
};
TT.illustrations.internet = {
    GRAVITY: 0.04,
    canvas: null,
    context: null,
    container: null,
    image: null,
    zero: null,
    one: null,
    numbers: [],
    positioned: false,
    world: {
        x: 345,
        y: 115,
        width: 120,
        height: 80
    },
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
            this.zero = new Image();
            this.zero.src = TT.illustrations.ASSETS_URL + "internet01-part1.png";
            this.one = new Image();
            this.one.src = TT.illustrations.ASSETS_URL + "internet01-part2.png";
        } else {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.internet.draw();
    },
    draw: function() {
        if (!this.positioned) {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        if (this.zero.complete && this.one.complete) {
            if (this.numbers.length < 20 && Math.random() > 0.6) {
                this.numbers.push({
                    type: Math.random() > 0.5 ? 1 : 0,
                    x: 5,
                    y: 0,
                    alpha: 0,
                    rotation: Math.random() * Math.PI,
                    velocity: {
                        x: 0.4 + (Math.random() * 1.6),
                        y: Math.random() * 2,
                        rotation: -0.1 + (Math.random() * 0.2)
                    }
                });
            }
            for (var i = 0; i < this.numbers.length; i++) {
                var number = this.numbers[i];
                var image = number.type == 0 ? this.zero: this.one;
                number.velocity.y += this.GRAVITY;
                if (number.y > this.world.height + image.height) {
                    this.numbers.splice(i, 1);
                    i--;
                    continue;
                } else {}
                if (number.y < this.world.height * 0.1) {
                    number.alpha = Math.min(number.y / (this.world.height * 0.1), 1);
                } else {}
                if (number.y > this.world.height * 0.6) {
                    number.alpha = 1 - Math.min((number.y - this.world.height * 0.5) / (this.world.height * 0.3), 1);
                }
                number.x += number.velocity.x;
                number.y += number.velocity.y;
                number.rotation += number.velocity.rotation;
                this.context.save();
                this.context.globalAlpha = number.alpha;
                this.context.translate(number.x + Math.round(image.width * 0.5), number.y + Math.round(image.height * 0.5));
                this.context.rotate(number.rotation);
                this.context.translate( - Math.round(image.width * 0.5), -Math.round(image.height * 0.5));
                this.context.drawImage(image, 0, 0);
                this.context.restore();
            }
        }
    }
};
TT.illustrations.opensource = {
    canvas: null,
    context: null,
    container: null,
    image: null,
    cog1: {
        image: null,
        x: 57,
        y: 14,
        currentRotation: 0,
        targetRotation: 0,
        lastUpdate: 0
    },
    cog2: {
        image: null,
        x: 28,
        y: 38,
        currentRotation: 0,
        targetRotation: 0,
        lastUpdate: 0
    },
    alpha: 0,
    world: {
        x: 90,
        y: 37,
        width: 100,
        height: 100
    },
    positioned: false,
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
            this.cog1.image = new Image();
            this.cog1.image.src = TT.illustrations.ASSETS_URL + "opensource01-part1.png";
            this.cog2.image = new Image();
            this.cog2.image.src = TT.illustrations.ASSETS_URL + "opensource01-part2.png";
        } else {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        this.cog1.lastUpdate = TT.time();
        this.cog2.lastUpdate = TT.time();
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.opensource.draw();
    },
    draw: function() {
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        if (!this.positioned) {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
        if (this.cog1.image.complete && this.cog2.image.complete) {
            this.alpha = Math.min(this.alpha + 0.08, 1);
            if (this.cog1.currentRotation > this.cog1.targetRotation - 1 && TT.time() - this.cog1.lastUpdate > 2000) {
                this.cog1.targetRotation += Math.PI / 3;
                this.cog1.lastUpdate = TT.time();
            }
            if (this.cog2.currentRotation > this.cog2.targetRotation - 1 && TT.time() - this.cog2.lastUpdate > 6000) {
                this.cog2.targetRotation += Math.PI / 9;
                this.cog2.lastUpdate = TT.time();
            }
            this.cog1.currentRotation += (this.cog1.targetRotation - this.cog1.currentRotation) * 0.5;
            this.cog2.currentRotation += (this.cog2.targetRotation - this.cog2.currentRotation) * 0.4;
            if (Math.abs(this.cog1.currentRotation - this.cog1.targetRotation) < 0.05) {
                this.cog1.currentRotation = this.cog1.targetRotation;
            }
            if (Math.abs(this.cog2.currentRotation - this.cog2.targetRotation) < 0.05) {
                this.cog2.currentRotation = this.cog2.targetRotation;
            }
            this.context.save();
            this.context.globalAlpha = this.alpha;
            this.context.save();
            this.context.translate(this.cog1.x + Math.round(this.cog1.image.width * 0.5), this.cog1.y + Math.round(this.cog1.image.height * 0.5));
            this.context.rotate(this.cog1.currentRotation);
            this.context.translate( - Math.round(this.cog1.image.width * 0.5), -Math.round(this.cog1.image.height * 0.5));
            this.context.drawImage(this.cog1.image, 0, 0);
            this.context.restore();
            this.context.save();
            this.context.translate(this.cog2.x + Math.round(this.cog2.image.width * 0.5), this.cog2.y + Math.round(this.cog2.image.height * 0.5));
            this.context.rotate(this.cog2.currentRotation);
            this.context.translate( - Math.round(this.cog2.image.width * 0.5), -Math.round(this.cog2.image.height * 0.5));
            this.context.drawImage(this.cog2.image, 0, 0);
            this.context.restore();
            this.context.restore();
        }
    }
};
TT.illustrations.cloud = {
    canvas: null,
    context: null,
    container: null,
    image: null,
    cloutImage: null,
    world: {
        x: 0,
        y: 0,
        width: 240,
        height: 200
    },
    positioned: false,
    clouds: [{
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    },
    {
        x: Math.random() * 240,
        y: Math.random() * 200,
        strength: 1,
        velocity: {
            x: 0,
            y: 0
        },
        size: 8 + Math.random() * 8
    }],
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
            this.cloudImage = new Image();
            this.cloudImage.src = TT.illustrations.ASSETS_URL + "3d01_clouds.png";
        } else {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.cloud.draw();
    },
    draw: function() {
        if (!this.positioned) {
            this.positioned = TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        if (this.image[0].complete) {
            this.context.drawImage(this.image[0], 0, 0);
        }
        var speed = 3;
        for (var i = 0, len = this.clouds.length; i < len; i++) {
            var cloud = this.clouds[i];
            cloud.velocity.x /= 1.04;
            cloud.velocity.y /= 1.04;
            if (Math.abs(cloud.velocity.x) < 0.2) {
                if (cloud.x > this.world.width / 2) {
                    cloud.velocity.x -= 0.7 + Math.random() * speed;
                } else {
                    cloud.velocity.x += 0.7 + Math.random() * speed;
                }
            }
            if (Math.abs(cloud.velocity.y) < 0.2) {
                if (cloud.y > this.world.height / 2) {
                    cloud.velocity.y -= 0.5 + Math.random() * speed;
                } else {
                    cloud.velocity.y += 0.5 + Math.random() * speed;
                }
            }
            cloud.x += cloud.velocity.x;
            cloud.y += cloud.velocity.y;
            cloud.strength = Math.max(Math.min(cloud.strength, 1), 0);
            var gradient = this.context.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.size);
            this.context.save();
            var browser = BrowserDetect.browser.toLowerCase();
            if (browser == "firefox") {
                gradient.addColorStop(0.4, "rgba(255,255,255," + (cloud.strength * 0.7) + ")");
                gradient.addColorStop(1, "rgba(255,255,255,0)");
            } else {
                gradient.addColorStop(0.4, "rgba(90,170,190," + (cloud.strength) + ")");
                gradient.addColorStop(1, "rgba(90,170,190,0)");
                this.context.globalCompositeOperation = "source-in";
            }
            this.context.beginPath();
            this.context.fillStyle = gradient;
            this.context.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2, true);
            this.context.fill();
            this.context.restore();
        }
    }
};
TT.illustrations.html = {
    canvas: null,
    context: null,
    container: null,
    image: null,
    world: {
        x: 100,
        y: -15,
        width: 150,
        height: 200
    },
    bulbs: [{
        x: 27,
        y: 22,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 62,
        y: 30,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 90,
        y: 39,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 117,
        y: 48,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 22,
        y: 59,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 23,
        y: 89,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 24,
        y: 115,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 25,
        y: 139,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 124,
        y: 87,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 124,
        y: 116,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 124,
        y: 144,
        strength: 0,
        momentum: 0,
        size: 10
    },
    {
        x: 124,
        y: 178,
        strength: 0,
        momentum: 0,
        size: 10
    }],
    initialize: function(container) {
        if (this.canvas === null) {
            this.container = container;
            this.image = $("img", container);
            this.canvas = TT.illustrations.createCanvas(container, this.world);
            this.context = this.canvas[0].getContext("2d");
        } else {
            TT.illustrations.updateCanvasPosition(this.container, this.world);
        }
    },
    activate: function(container) {
        this.initialize(container);
        TT.illustrations.interval = setInterval(this.render, 1000 / TT.illustrations.FRAME_RATE);
    },
    render: function() {
        TT.illustrations.html.draw();
    },
    draw: function() {
        this.context.clearRect(0, 0, this.world.width, this.world.height);
        for (var i = 0, len = this.bulbs.length; i < len; i++) {
            var bulb = this.bulbs[i];
            if (bulb.strength < 0.1 && bulb.momentum <= 0 && Math.random() > 0.98) {
                bulb.momentum = Math.random() * 0.3;
            } else {
                if (bulb.strength >= 1 && Math.random() > 0.98) {
                    bulb.momentum = -Math.random() * 0.3;
                }
            }
            bulb.strength += bulb.momentum;
            bulb.strength = Math.max(Math.min(bulb.strength, 1), 0);
            var gradient = this.context.createRadialGradient(bulb.x, bulb.y, 0, bulb.x, bulb.y, bulb.size);
            gradient.addColorStop(0.4, "rgba(255,255,100," + (bulb.strength * 0.95) + ")");
            gradient.addColorStop(1, "rgba(255,255,100,0)");
            this.context.beginPath();
            this.context.fillStyle = gradient;
            this.context.arc(bulb.x, bulb.y, bulb.size, 0, Math.PI * 2, true);
            this.context.fill();
        }
    }
};
TT.navigation = {};
TT.navigation.transitioningFromHardCover = false;
TT.navigation.hasNavigated = false;
TT.navigation.currentPageName = "";
TT.navigation.currentThing = "";
TT.navigation.enqueueNavigation = null;
TT.navigation.initialize = function() {
    $("#pages section:not(.current)").width(0).hide();
    TT.navigation.assignNavigationHandlers();
    TT.navigation.assignNextPrevHandlers();
    if (TT.navigation.isHomePage()) {
        TT.flipintro.activate();
    } else {
        $("#front-cover").hide();
        $("#front-cover-bookmark").hide();
        $("#front-cover-arrow").hide();
    }
    if (!TT.navigation.isCreditsPage()) {
        $("#back-cover").hide();
    }
    if (TT.navigation.isTableOfThings()) {
        $("body").addClass("home").addClass("tot");
    } else {
        if (!TT.navigation.isHomePage() && !TT.navigation.isCreditsPage()) {
            $("body").addClass("book");
        }
    }
    TT.sharing.updateSharer();
    TT.navigation.loadImages();
    TT.illustrations.update($("#pages section.current"));
    TT.navigation.updatePageVisibility($("#pages section.current"));
};
TT.navigation.assignNavigationHandlers = function() {
    $("header a.logo").click(function() {
        TT.navigation.goToHome();
        return false;
    });
    $("header li.about a").click(function() {
        TT.navigation.goToPage(TT.history.FOREWORD, 1);
        return false;
    });
    $("header li.credits a").click(function() {
        TT.navigation.goToCredits();
        return false;
    });
    $("#front-cover-bookmark a.open-book").click(function() {
        TT.navigation.goToNextPage();
        return false;
    });
    $("header li.table-of-things a").click(function() {
        TT.tableofthings.show();
        return false;
    });
    $("#table-of-contents a.go-back").click(function() {
        TT.tableofthings.hide();
        return false;
    });
    $("#front-cover-arrow").click(function() {
        TT.navigation.goToNextPage();
        return false;
    });
    $("footer .print a").click(function() {
        if (window.location.pathname.match("en-US")) {
            TT.overlay.showPrint();
            return false;
        }
    });
    $("#pages section a").click(function() {
        var link = $(this).attr("href");
        if (link.indexOf("http://") == -1 && link.indexOf("www.") == -1) {
            var article = link.split("/")[1];
            var page = link.split("/")[2];
            if (article && page) {
                TT.navigation.goToPage(article, page);
            }
            return false;
        }
    });
};
TT.navigation.assignNextPrevHandlers = function() {
    $("#pagination-prev").click(function(e) {
        e.preventDefault();
        TT.navigation.goToPreviousPage();
    });
    $("#pagination-next").click(function(e) {
        e.preventDefault();
        TT.navigation.goToNextPage();
    });
    var element = '<div class="page-progress"><p class="thing"></p><p class="number">' + SERVER_VARIABLES.PAGE + " <span></span></p></div>";
    if (!TT.IS_TOUCH_DEVICE) {
        $("#pagination-prev").append(element);
        $("#pagination-next").append(element);
    }
};
TT.navigation.isHomePage = function() {
    return $("body").hasClass("home");
};
TT.navigation.isCreditsPage = function() {
    return $("body").hasClass("credits");
};
TT.navigation.isTableOfThings = function() {
    return $("body").hasClass("tot");
};
TT.navigation.isBookOpen = function() {
    return $("body").hasClass("book");
};
TT.navigation.isFullScreen = function() {
    return $("body").hasClass("fullscreen");
};
TT.navigation.isForeword = function(target) {
    if (!target) {
        target = $("#pages section.current");
    }
    return TT.navigation.classToArticle(target.attr("class")) == TT.history.FOREWORD;
};
TT.navigation.isLastPage = function(target) {
    if (target) {
        return target.next("section").length == 0 && !TT.navigation.isCreditsPage();
    }
    return $("#pages section.current").next("section").length == 0 && !TT.navigation.isCreditsPage();
};
TT.navigation.isFirstPage = function(target) {
    if (target) {
        return target.prev("section").length == 0 && !TT.navigation.isHomePage();
    }
    return $("#pages section.current").prev("section").length == 0 && !TT.navigation.isHomePage();
};
TT.navigation.classToArticle = function(theClass) {
    return theClass ? theClass.match(/title-([a-zA-Z-0-9]+)/)[1] : null;
};
TT.navigation.classToArticlePage = function(theClass) {
    return theClass ? parseInt(theClass.match(/page-([0-9]+)/)[1]) : null;
};
TT.navigation.classToGlobalPage = function(theClass) {
    return theClass ? parseInt(theClass.match(/globalPage-([0-9]+)/)[1]) : null;
};
TT.navigation.updateNextPrevLinks = function(targetPage) {
    if (TT.navigation.isCreditsPage()) {
        $("#pagination-next").addClass("inactive");
        $("#pagination-prev").removeClass("inactive");
    } else {
        if (TT.navigation.isHomePage()) {
            $("#pagination-prev").addClass("inactive");
            $("#pagination-next").removeClass("inactive");
        } else {
            $("#pagination-prev, #pagination-next").removeClass("inactive");
        }
    }
    var nextPage = TT.navigation.isHomePage() ? targetPage.attr("class") : targetPage.next("section").attr("class");
    var prevPage = targetPage.prev("section").attr("class");
    if (nextPage) {
        TT.navigation.updatePaginationHint(nextPage, $("#pagination-next"));
    } else {
        $("#pagination-next .page-progress").hide();
    }
    if (prevPage && !TT.navigation.isLastPage() && !TT.navigation.isCreditsPage()) {
        TT.navigation.updatePaginationHint(prevPage, $("#pagination-prev"));
    } else {
        $("#pagination-prev .page-progress").hide();
    }
};
TT.navigation.updatePaginationHint = function(page, button) {
    var articleId = TT.navigation.classToArticle(page);
    var articleIndex = $("#chapter-nav ul li").find("[data-article=" + articleId + "]").parent().index() + 1;
    var pageNumber = TT.navigation.classToArticlePage(page);
    var numberOfPages = $("#pages section.title-" + articleId).length;
    if (pageNumber != undefined && numberOfPages != undefined) {
        $(".page-progress", button).show();
        if (articleId == TT.history.FOREWORD) {
            $("p.thing", button).html(SERVER_VARIABLES.FOREWORD);
        } else {
            $("p.thing", button).html(SERVER_VARIABLES.THING + " " + articleIndex);
        }
        $("p.number span", button).text(pageNumber + "/" + numberOfPages);
    } else {
        $(".page-progress", button).hide();
    }
};
TT.navigation.getCurrentArticleId = function() {
    return TT.navigation.classToArticle($("#pages section.current").attr("class"));
};
TT.navigation.getCurrentArticlePage = function() {
    return TT.navigation.classToArticlePage($("#pages section.current").attr("class"));
};
TT.navigation.goToPreviousPage = function() {
    TT.navigation.cleanUpTransitions();
    if (TT.navigation.transitioningFromHardCover) {
        return false;
    }
    if (TT.navigation.isFirstPage()) {
        if (!TT.navigation.isHomePage()) {
            TT.pageflip.completeCurrentTurn();
            TT.navigation.goToHome();
        }
        return false;
    }
    TT.pageflip.completeCurrentTurn();
    var currentPage = $("#pages section.current");
    var prevArticle, prevPage = null;
    if (TT.navigation.isCreditsPage()) {
        prevArticle = TT.navigation.classToArticle(currentPage.attr("class"));
        prevPage = TT.navigation.classToArticlePage(currentPage.attr("class"));
    } else {
        prevArticle = TT.navigation.classToArticle(currentPage.prev("section").attr("class"));
        prevPage = TT.navigation.classToArticlePage(currentPage.prev("section").attr("class"));
    }
    TT.navigation.goToPage(prevArticle, prevPage);
};
TT.navigation.goToNextPage = function() {
    TT.navigation.cleanUpTransitions();
    if (TT.navigation.transitioningFromHardCover) {
        return false;
    }
    if (TT.navigation.isLastPage() || TT.navigation.isCreditsPage()) {
        if (!TT.navigation.isCreditsPage() || (TT.navigation.isCreditsPage() && TT.navigation.isBookOpen())) {
            TT.pageflip.completeCurrentTurn();
            TT.navigation.goToCredits();
        }
        return false;
    }
    TT.pageflip.completeCurrentTurn();
    var currentPage = $("#pages section.current");
    var prevArticle, prevPage = null;
    if (TT.navigation.isHomePage()) {
        nextArticle = TT.navigation.classToArticle(currentPage.attr("class"));
        nextPage = TT.navigation.classToArticlePage(currentPage.attr("class"));
    } else {
        TT.pageflip.completeCurrentTurn();
        nextArticle = TT.navigation.classToArticle(currentPage.next("section").attr("class"));
        nextPage = TT.navigation.classToArticlePage(currentPage.next("section").attr("class"));
    }
    TT.navigation.goToPage(nextArticle, nextPage);
};
TT.navigation.goToHome = function(fromHistoryChange) {
    TT.tableofthings.hide();
    if (!TT.navigation.isHomePage()) {
        if (TT.navigation.isCreditsPage()) {
            TT.navigation.enqueueNavigation = {
                call: function() {
                    delete this.call;
                    setTimeout(TT.navigation.goToHome, 1);
                }
            };
            TT.navigation.goToPage(TT.history.THEEND, 1, false);
            return;
        }
        TT.navigation.currentPageName = TT.history.HOME;
        $("#back-cover").hide();
        $("body").removeClass("book").removeClass(TT.history.CREDITS).addClass(TT.history.HOME);
        TT.flipintro.activate();
        TT.sharing.updateSharer();
        TT.navigation.transitioningFromHardCover = false;
        $("#pages section").removeClass("current");
        $("#pages section").first().addClass("current");
        var currentPage = $("#pages section.current");
        currentPage.width(TT.PAGE_WIDTH);
        if (!fromHistoryChange) {
            TT.history.pushState("/" + TT.locale.getLocaleCodeFromURL() + "/home");
        }
        TT.pageflip.turnToPage(currentPage, currentPage, -1, TT.pageflip.HARD_FLIP);
    }
};
TT.navigation.goToCredits = function(fromHistoryChange) {
    TT.tableofthings.hide();
    if (!TT.navigation.isCreditsPage() || (TT.navigation.isCreditsPage() && TT.navigation.isBookOpen())) {
        if ((TT.navigation.isBookOpen() || TT.navigation.isHomePage()) && (!TT.navigation.isLastPage() && !TT.navigation.isCreditsPage())) {
            TT.navigation.enqueueNavigation = {
                call: function() {
                    delete this.call;
                    setTimeout(TT.navigation.goToCredits, 1);
                }
            };
            TT.navigation.goToPage(TT.history.THEEND, 1, false);
            TT.paperstack.updateStack(1);
            return;
        }
        TT.navigation.currentPageName = TT.history.CREDITS;
        $("#page-shadow-overlay").hide();
        $("#front-cover").hide();
        $("#front-cover-bookmark").hide();
        $("#front-cover-arrow").hide();
        $("body").removeClass("book").removeClass(TT.history.HOME).addClass(TT.history.CREDITS);
        TT.sharing.updateSharer();
        TT.navigation.transitioningFromHardCover = false;
        $("#pages section").removeClass("current");
        $("#pages section").last().addClass("current");
        var currentPage = $("#pages section.current");
        TT.navigation.updatePageVisibility(currentPage, 1);
        if (!fromHistoryChange) {
            TT.history.pushState("/" + TT.locale.getLocaleCodeFromURL() + "/credits");
        }
        TT.pageflip.turnToPage(currentPage, currentPage, 1, TT.pageflip.HARD_FLIP);
    } else {
        $("#pages section.current").hide();
    }
};
TT.navigation.goToPage = function(articleId, pageNumber, fromHistoryChange) {
    TT.navigation.loadImages(articleId, pageNumber);
    if (TT.navigation.isCreditsPage() && articleId !== TT.history.THEEND) {
        TT.navigation.enqueueNavigation = {
            articleId: articleId,
            pageNumber: pageNumber,
            fromHistoryChange: fromHistoryChange,
            call: function() {
                delete this.call;
                TT.navigation.goToPage(this.articleId, this.pageNumber, this.fromHistoryChange);
            }
        };
        articleId = TT.history.THEEND;
        pageNumber = 1;
    }
    var currentPage = $("#pages section.current");
    var targetPage = $("#pages section.title-" + articleId + ".page-" + pageNumber);
    TT.navigation.hasNavigated = true;
    TT.tableofthings.hide();
    var isSamePageInBook = currentPage.attr("class") === targetPage.attr("class");
    var isSamePageOverall = targetPage.attr("class") === TT.navigation.currentPageName;
    if ((!isSamePageOverall && !isSamePageInBook) || (TT.navigation.isHomePage() || TT.navigation.isCreditsPage())) {
        TT.navigation.currentPageName = targetPage.attr("class");
        if (TT.navigation.classToArticle(TT.navigation.currentPageName) == TT.history.THEEND) {
            TT.sharing.updateSharer(true);
        }
        var type = TT.pageflip.SOFT_FLIP;
        if (TT.navigation.isHomePage() || TT.navigation.isCreditsPage()) {
            type = TT.pageflip.HARD_FLIP;
            TT.navigation.transitioningFromHardCover = true;
        }
        var currentGlobalPageNumber = TT.navigation.classToGlobalPage($(".current").attr("class"));
        var targetGlobalPageNumber = TT.navigation.classToGlobalPage(targetPage.attr("class"));
        if (currentGlobalPageNumber != null && targetGlobalPageNumber != null) {
            var steps = Math.abs(currentGlobalPageNumber - targetGlobalPageNumber);
            var direction = targetGlobalPageNumber > currentGlobalPageNumber ? 1 : -1;
            if (targetGlobalPageNumber == currentGlobalPageNumber) {
                direction = TT.navigation.isHomePage() ? 1 : -1;
            }
            TT.navigation.updatePageVisibility(targetPage, direction, steps);
            TT.pageflip.turnToPage(currentPage, targetPage, direction, type);
            if (!fromHistoryChange) {
                TT.history.pushState("/" + TT.locale.getLocaleCodeFromURL() + "/" + articleId + "/" + pageNumber);
            }
            TT.storage.setBookmark(articleId, pageNumber);
            TT.navigation.updateNextPrevLinks(targetPage);
            TT.navigation.updatePageReferences(articleId);
            return true;
        }
    }
    return false;
};
TT.navigation.updatePageVisibility = function(targetPage, direction, steps) {
    steps = steps || 0;
    var currentDepth = parseInt($("#pages section.current").css("z-index"));
    if (steps > 1 || TT.navigation.isHomePage()) {
        currentDepth = parseInt(targetPage.css("z-index"));
    }
    $("#pages section:not(.current)").each(function() {
        var z = parseInt($(this).css("z-index"));
        if (z > currentDepth) {
            $(this).width(0).hide().css("top");
        } else {
            if (z < currentDepth - 1) {
                $(this).hide();
            }
        }
    });
    targetPage.show();
    if (steps > 1 && direction == 1 && TT.navigation.isHomePage()) {
        $("#pages section.current").width(0).hide();
        targetPage.width(TT.PAGE_WIDTH).show();
    }
    if (!TT.navigation.isHomePage()) {
        $("#left-page").width(TT.BOOK_WIDTH_CLOSED).show();
    }
};
TT.navigation.updateCurrentPointer = function(currentPage, targetPage) {
    if (TT.navigation.transitioningFromHardCover) {
        $("body").removeClass(TT.history.HOME).removeClass(TT.history.CREDITS).addClass("book");
        $("#page-shadow-overlay").hide();
        TT.navigation.transitioningFromHardCover = false;
    }
    currentPage.removeClass("current");
    targetPage.addClass("current");
    TT.sharing.updateSharer();
    TT.navigation.updatePageReferences();
    TT.navigation.updateNextPrevLinks(targetPage);
    if (TT.navigation.enqueueNavigation && TT.navigation.enqueueNavigation.call) {
        TT.navigation.enqueueNavigation.call();
        TT.navigation.enqueueNavigation = null;
    }
};
TT.navigation.updatePageReferences = function(articleId) {
    TT.chapternav.updateSelection(articleId);
    TT.tableofthings.updateSelection(articleId);
    TT.paperstack.updateStack();
    TT.illustrations.update($("#pages section.current"));
};
TT.navigation.cleanUpTransitions = function(currentPage, targetPage) {
    TT.pageflip.removeInactiveFlips();
    if (TT.pageflip.flips.length == 0) {
        TT.navigation.transitioningFromHardCover = false;
    }
};
TT.navigation.loadImages = function(articleId, pageNumber) {
    var cur = articleId && pageNumber ? $("#pages section.title-" + articleId + ".page-" + pageNumber) : $("#pages section.current");
    var pages = [cur];
    if (cur.prev("section").length) {
        pages.push(cur.prev("section"));
    }
    if (cur.next("section").length) {
        pages.push(cur.next("section"));
    }
    for (var i = 0; i < pages.length; i++) {
        pages[i].find("img").each(function() {
            if ($(this).attr("src") !== $(this).attr("data-src")) {
                $(this).attr("src", $(this).attr("data-src"));
            }
        });
    }
};
TT.cache = {};
TT.cache.initialize = function() {
    $(window.applicationCache).bind("downloading", TT.cache.onDownloadingHandler);
    $(window.applicationCache).bind("progress", TT.cache.onProgressHandler);
    $(window.applicationCache).bind("error", TT.cache.onErrorHandler);
    $(window.applicationCache).bind("cached", TT.cache.onCachedHandler);
    $(window.applicationCache).bind("updateready", TT.cache.onUpdateReadyHandler);
    $(window.applicationCache).bind("noupdate", TT.cache.onNoUpdateHandler);
    $(window.applicationCache).bind("obsolete", TT.cache.onObsoleteHandler);
};
TT.cache.onDownloadingHandler = function(event) {
    TT.log("TT.cache.onDownloadingHandler");
};
TT.cache.onNoUpdateHandler = function(event) {
    TT.log("TT.cache.onNoUpdateHandler");
};
TT.cache.onProgressHandler = function(event) {
    TT.log("TT.cache.onProgressHandler");
};
TT.cache.onErrorHandler = function(event) {
    TT.log("TT.cache.onErrorHandler");
};
TT.cache.onObsoleteHandler = function(event) {
    TT.log("TT.cache.onObsoleteHandler");
    window.location.reload();
};
TT.cache.onCachedHandler = function(event) {
    TT.log("TT.cache.onCachedHandler");
};
TT.cache.onUpdateReadyHandler = function(event) {
    TT.log("TT.cache.onCachedHandler");
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        TT.log("Manifest is changed. New version being swapped in and reloading.");
        window.applicationCache.swapCache();
        window.location.reload();
    } else {
        TT.log("Manifest is unchanged. Do nothing.");
    }
};
TT.search = {};
TT.search.THING_RESULTS_LIMIT = 2;
TT.search.KEYWORD_RESULTS_LIMIT = 8;
TT.search.DEFAULT_TEXT = $("#search-field").attr("value");
TT.search.dropdown = null;
TT.search.dropdownResults = null;
TT.search.dropdownTitles = null;
TT.search.dropdownKeywords = null;
TT.search.field = null;
TT.search.hasFocus = false;
TT.search.titleResults = [];
TT.search.keywordResults = [];
TT.search.hideInterval = -1;
TT.search.initialize = function() {
    TT.search.field = $("#search-field");
    TT.search.dropdown = $("#search-dropdown");
    TT.search.dropdownResults = $("#search-dropdown div.results");
    TT.search.dropdownTitles = $("#search-dropdown div.results .things");
    TT.search.dropdownKeywords = $("#search-dropdown div.results .keywords");
    TT.search.field.focus(TT.search.onSearchFieldFocus);
    TT.search.field.blur(TT.search.onSearchFieldBlur);
    TT.search.field.change(TT.search.onSearchFieldChange);
    TT.search.field.keyup(TT.search.onSearchFieldChange);
    TT.search.field.click(function(event) {
        if (TT.search.field.val() == "") {
            TT.search.onSearchFieldChange(event);
        }
    });
};
TT.search.onSearchFieldFocus = function(event) {
    clearInterval(TT.search.hideInterval);
    if (event.target.value === TT.search.DEFAULT_TEXT) {
        event.target.value = "";
    }
    TT.search.showResult();
    TT.search.hasFocus = true;
    $("header, #search-dropdown").addClass("searching");
};
TT.search.onSearchFieldBlur = function(event) {
    clearInterval(TT.search.hideInterval);
    if (event.target.value === "") {
        event.target.value = TT.search.DEFAULT_TEXT;
    }
    TT.search.hideInterval = setInterval(TT.search.hideResults, 100);
    TT.search.hasFocus = false;
    $("header, #search-dropdown").removeClass("searching");
};
TT.search.onSearchFieldChange = function(event) {
    clearInterval(TT.search.hideInterval);
    if (TT.search.field.val() == "" || TT.search.field.val().length < 2) {
        TT.search.titleResults = [];
        TT.search.keywordResults = [];
        TT.search.hideResults();
    } else {
        TT.search.searchFor(TT.search.field.val());
    }
};
TT.search.searchFor = function(term) {
    TT.search.titleResults = [];
    TT.search.keywordResults = [];
    TT.search.regexEscape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    var searchPattern = new RegExp(TT.search.regexEscape(term), "gi");
    $(".page h2, .page h3, .page p").each(function() {
        var elBeingSearched = $(this);
        var elText = $(this).text();
        if (searchPattern.test(elText)) {
            var matchVariations = elText.match(searchPattern);
            var uniqueMatchVariations = {};
            for (var i = 0; i < matchVariations.length; i++) {
                uniqueMatchVariations[matchVariations[i]] = true;
            }
            for (term in uniqueMatchVariations) {
                var elResults = elText.split(term);
                for (i = 1; i < elResults.length; i++) {
                    var result = {};
                    var anteSnippet = elResults[i - 1].substr( - 10).replace(/</, "&lt;");
                    var postSnippet = elResults[i].substr(0, 10).replace(/</, "&lt;");
                    result.articleId = elBeingSearched.parents("section").eq(0).attr("class").match(/title-([a-z-0-9]+)/)[1];
                    term = term.replace(/</, "&lt;");
                    result.snippet = anteSnippet + "<strong>" + term + "</strong>" + postSnippet;
                    var chapterElement = $("#chapter-nav ul li").find("[data-article=" + result.articleId + "]");
                    if (chapterElement.length > 0) {
                        result.articlePage = elBeingSearched.parents("section").eq(0).attr("class").match(/page-([0-9]+)/)[1];
                        result.articleIndex = chapterElement.parent().index() + 1;
                        result.articleTitle = chapterElement.attr("data-title");
                        result.articleGlobalStartPage = $(".pageNumber", elBeingSearched.parents("section")).text();
                        result.articleGlobalEndPage = chapterElement.attr("data-globalendpage");
                        if (result.articleTitle.length > 38) {
                            result.articleTitle = result.articleTitle.slice(0, 36) + "...";
                        }
                        if (elBeingSearched.is("h2") || elBeingSearched.is("h3")) {
                            var isDuplicate = false;
                            for (var j = 0; j < TT.search.titleResults.length; j++) {
                                if (TT.search.titleResults[j].articleTitle == result.articleTitle) {
                                    isDuplicate = true;
                                }
                            }
                            if (!isDuplicate) {
                                TT.search.titleResults.push(result);
                            }
                        } else {
                            TT.search.keywordResults.push(result);
                        }
                    }
                }
            }
        }
    });
    TT.search.showResult();
};
TT.search.showResult = function() {
    TT.search.dropdownTitles.children("ul").remove();
    TT.search.dropdownKeywords.children("ul").remove();
    var hasTitleResults = TT.search.titleResults.length > 0;
    var hasKeywordResults = TT.search.keywordResults.length > 0;
    if (!hasTitleResults) {
        TT.search.dropdownTitles.hide();
    }
    if (!hasKeywordResults) {
        TT.search.dropdownKeywords.hide();
    }
    if (hasKeywordResults || hasTitleResults) {
        TT.search.dropdown.removeClass("no-results").addClass("open");
    } else {
        if (TT.search.field.val() != "") {
            TT.search.dropdown.addClass("no-results").addClass("open");
        }
    }
    if (hasTitleResults) {
        var resultHTML = $("<ul/>");
        for (var i = 0; i < Math.min(TT.search.titleResults.length, TT.search.THING_RESULTS_LIMIT); i++) {
            var result = TT.search.titleResults[i];
            var li = $("<li/>").mousedown(function() {
                TT.navigation.goToPage($(this).attr("class"), 1);
            });
            li.addClass(result.articleId);
            li.append('<div class="illustration"></div>');
            li.append('<p class="title">#' + result.articleIndex + " " + result.articleTitle + "</p>");
            if (Math.abs(parseInt(result.articleGlobalStartPage) - parseInt(result.articleGlobalEndPage)) != 0) {
                li.append('<p class="pages">' + SERVER_VARIABLES.PAGES + ": " + result.articleGlobalStartPage + "-" + result.articleGlobalEndPage + "</p>");
            } else {
                li.append('<p class="pages">' + SERVER_VARIABLES.PAGE + ": " + result.articleGlobalStartPage + "</p>");
            }
            resultHTML.append(li);
        }
        TT.search.dropdownTitles.append(resultHTML);
        TT.search.dropdownTitles.show();
    }
    if (hasKeywordResults) {
        var resultHTML = $("<ul/>");
        for (var i = 0; i < Math.min(TT.search.keywordResults.length, TT.search.KEYWORD_RESULTS_LIMIT); i++) {
            var result = TT.search.keywordResults[i];
            var li = $("<li/>").mousedown(function() {
                TT.navigation.goToPage($(this).attr("data-articleId"), $(this).attr("data-articlePage"));
            });
            li.attr("data-articleId", result.articleId);
            li.attr("data-articlePage", result.articlePage);
            li.append('<p class="snippet">"...' + result.snippet + '..."</p>');
            li.append('<p class="pages">' + SERVER_VARIABLES.THING + " #" + result.articleIndex + " " + SERVER_VARIABLES.PAGE + ": " + result.articleGlobalStartPage + "</p>");
            resultHTML.append(li);
        }
        TT.search.dropdownKeywords.append(resultHTML);
        TT.search.dropdownKeywords.show();
    }
    TT.search.dropdown.children(".fader").height(TT.search.dropdownResults.outerHeight());
};
TT.search.hideResults = function() {
    TT.search.dropdown.removeClass("open");
};
TT.chapternav = {};
TT.chapternav.initialize = function() {
    $("#chapter-nav ul li").click(TT.chapternav.onChapterClick);
    if (!TT.IS_TOUCH_DEVICE) {
        $("#chapter-nav ul li").mouseover(TT.chapternav.onChapterMouseOver);
        $("#chapter-nav ul li").mouseout(TT.chapternav.onChapterMouseOut);
    }
    $("#chapter-nav ul li .over div.description").css({
        opacity: 0
    });
};
TT.chapternav.updateReadMarkers = function() {
    $("#chapter-nav ul li").each(function() {
        var articleId = $("a", this).attr("data-article");
        if (TT.storage.hasArticleBeenRead(articleId)) {
            $(this).addClass("read");
        }
    });
};
TT.chapternav.getDisabledArticles = function() {
    var articles = [];
    $("#chapter-nav ul li.disabled").each(function() {
        var article = $("a", this).attr("data-article");
        if (article) {
            articles.push(article);
        }
    });
    return articles;
};
TT.chapternav.updateSelection = function(overrideArticleId) {
    var selectedArticleId = TT.navigation.classToArticle($("#pages section.current").attr("class"));
    if (overrideArticleId) {
        selectedArticleId = overrideArticleId;
    }
    $("#chapter-nav ul li").removeClass("selected");
    if (selectedArticleId && !TT.navigation.isHomePage() && !TT.navigation.isCreditsPage() && !TT.navigation.isForeword()) {
        var element = $("#chapter-nav ul li").find("[data-article=" + selectedArticleId + "]");
        if (element && element.parent()) {
            element.parent().addClass("selected");
            TT.sharing.updateSharerIndex(element.parent().index() + 1);
        }
    }
    if (!TT.storage.isFirstTimeVisitor || !TT.navigation.isHomePage() || TT.navigation.hasNavigated) {
        $("#chapter-nav").show();
    }
    $("#chapter-nav ul li a.over").each(function() {
        $(this).css({
            top: -$(this).height() + 4
        });
    });
};
TT.chapternav.getProgress = function(overrideArticleId) {
    var selectedArticle = $("#chapter-nav ul li.selected");
    if (overrideArticleId) {
        selectedArticle = $("#chapter-nav ul li").find("[data-article=" + overrideArticleId + "]").parent();
    }
    if (TT.navigation.isHomePage() || TT.navigation.isForeword()) {
        return 0;
    } else {
        if (TT.navigation.isCreditsPage() || TT.navigation.isLastPage() || selectedArticle.length == 0) {
            return 1;
        }
    }
    return Math.min(selectedArticle.index() / ($("#chapter-nav ul li:not(.disabled)").length - 1), 1);
};
TT.chapternav.onChapterClick = function(event) {
    var item = $(event.target).is("li") ? $(event.target) : $(event.target).parents("li");
    var articleId = $("a", item).attr("data-article");
    if (articleId && !item.hasClass("disabled")) {
        if (TT.navigation.goToPage(articleId, 1)) {
            if (TT.chapternav.getProgress(articleId) > TT.chapternav.getProgress()) {
                TT.paperstack.updateStack(TT.chapternav.getProgress(articleId));
            }
            TT.chapternav.updateSelection(articleId);
        }
    }
    event.preventDefault();
};
TT.chapternav.onChapterMouseOver = function(event) {
    var item = $(event.target).is("li") ? $(event.target) : $(event.target).parents("li");
    var description = $("div.description", item);
    description.stop(true, false).fadeTo(200, 1);
};
TT.chapternav.onChapterMouseOut = function(event) {
    var item = $(event.target).is("li") ? $(event.target) : $(event.target).parents("li");
    var description = $("div.description", item);
    description.fadeTo(200, 0);
};
TT.sharing = {};
var l = window.location;
TT.sharing.BASE_URL = l.protocol + "//" + l.hostname + "/" + SERVER_VARIABLES.LANG;
TT.sharing.FACEBOOK_SHARER = "http://www.facebook.com/sharer.php";
TT.sharing.TWITTER_SHARER = "http://twitter.com/share";
TT.sharing.PLUSONE_SHARER = "http://www.20thingsilearned.com/" + SERVER_VARIABLES.LANG;
TT.sharing.initialize = function() {
    $("footer div.sharing .facebook, #credits div.share .facebook").click(TT.sharing.shareBookOnFacebook);
    $("footer div.sharing .twitter, #credits div.share .twitter").click(TT.sharing.shareBookOnTwitter);
    $("footer div.sharing .url").click(TT.sharing.openClipboardNotification);
    $("#sharer div.content ul li.facebook").click(TT.sharing.shareChapterOnFacebook);
    $("#sharer div.content ul li.twitter").click(TT.sharing.shareChapterOnTwitter);
    $("#sharer div.content ul li.print").click(TT.sharing.printThing);
    TT.sharing.updateGlobalGplusBtn();
    $(document).mousedown(TT.sharing.documentMouseDownHandler);
};
TT.sharing.updateSharer = function(hide) {
    var articleId = TT.navigation.classToArticle($("#pages section.current").attr("class"));
    $("#sharer div.content ul li.print a").attr("href", "/" + SERVER_VARIABLES.LANG + "/" + articleId + "/print");
    if (TT.navigation.isHomePage() || TT.navigation.isCreditsPage() || TT.navigation.isLastPage() || TT.navigation.isForeword() || hide) {
        $("#sharer").stop(true, true);
        $("#sharer").fadeOut(150);
    } else {
        if (TT.navigation.currentThing != articleId) {
            TT.navigation.currentThing = articleId;
            TT.sharing.updateChapterGplusBtn();
        }
        $("#sharer").stop(true, true).delay(150).fadeIn(150);
    }
};
TT.sharing.updateChapterGplusBtn = function() {
    var li = $("#sharer li.gplus").html("");
    var url = TT.sharing.PLUSONE_SHARER + "/" + TT.navigation.getCurrentArticleId();
    var newBtn = '<g:plusone size="small" count="false" href="' + url + '"></g:plusone>';
    li.append(newBtn);
    gapi.plusone.go(li[0]);
};
TT.sharing.updateGlobalGplusBtn = function() {
    var url = TT.sharing.PLUSONE_SHARER;
    var footerLi = $("footer .sharing li.gplus");
    var footerBtn = '<g:plusone size="small" count="false" href="' + url + '"></g:plusone>';
    footerLi.append(footerBtn);
    gapi.plusone.go(footerLi[0]);
    var creditsLi = $("#credits .share li.gplus");
    var creditsBtn = '<g:plusone count="false" href="' + url + '"></g:plusone>';
    creditsLi.append(creditsBtn);
    gapi.plusone.go(creditsLi[0]);
};
TT.sharing.updateSharerIndex = function(index) {
    if (index != 0) {
        if (index != $("#sharer div.content p.index span").text()) {
            $("#sharer div.content p.index span").each(function(i) {
                if (i > 1) {
                    $(this).remove();
                }
            });
            $("#sharer div.content p.index span").delay(300).fadeOut(200,
            function() {
                $(this).remove();
            });
            var span = $("<span>" + index + "</span>");
            span.hide().delay(300).fadeIn(200);
            $("#sharer div.content p.index").append(span);
            TT.sharing.updateSharer();
        }
    } else {
        $("#sharer").fadeOut();
    }
};
TT.sharing.openClipboardNotification = function() {
    $("footer .clipboard-notification").show().focus().select();
    return false;
};
TT.sharing.documentMouseDownHandler = function(event) {
    if (event && event.target === $("footer .clipboard-notification")[0]) {
        $("footer .clipboard-notification").focus().select();
        return false;
    } else {
        $("footer .clipboard-notification").fadeOut(200);
    }
};
TT.sharing.shareBookOnFacebook = function() {
    var url = TT.sharing.BASE_URL;
    var title = SERVER_VARIABLES.FACEBOOK_MESSAGE;
    TT.sharing.shareOnFacebook(url, title);
    return false;
};
TT.sharing.shareBookOnTwitter = function() {
    var url = TT.sharing.BASE_URL;
    var title = SERVER_VARIABLES.TWITTER_MESSAGE;
    TT.sharing.shareOnTwitter(url, title);
    return false;
};
TT.sharing.shareChapterOnFacebook = function() {
    var url = TT.sharing.BASE_URL + "/" + TT.navigation.getCurrentArticleId();
    var title = SERVER_VARIABLES.FACEBOOK_MESSAGE_SINGLE;
    TT.sharing.shareOnFacebook(url, title);
    return false;
};
TT.sharing.shareChapterOnTwitter = function() {
    var url = TT.sharing.BASE_URL + "/" + TT.navigation.getCurrentArticleId();
    var title = SERVER_VARIABLES.TWITTER_MESSAGE_SINGLE;
    TT.sharing.shareOnTwitter(url, title);
    return false;
};
TT.sharing.shareOnFacebook = function(url, title) {
    var shareURL = TT.sharing.FACEBOOK_SHARER;
    shareURL += "?u=" + encodeURIComponent(url);
    shareURL += "&t=" + encodeURIComponent(title);
    window.open(shareURL, "Facebook", "toolbar=0,status=0,width=726,location=no,menubar=no,height=436");
};
TT.sharing.shareOnTwitter = function(url, title) {
    var shareURL = TT.sharing.TWITTER_SHARER;
    shareURL += "?original_referer=" + encodeURIComponent(url);
    shareURL += "&text=" + encodeURIComponent(title);
    shareURL += "&url=" + encodeURIComponent(url);
    window.open(shareURL, "Twitter", "toolbar=0,status=0,width=726,location=no,menubar=no,height=436");
};
TT.overlay = {};
TT.overlay.overlay = null;
TT.overlay.bookmark = null;
TT.overlay.print = null;
TT.overlay.visible = false;
TT.overlay.initialize = function() {
    TT.overlay.overlay = $("#overlay");
    TT.overlay.bookmark = $("#overlay div.bookmark");
    TT.overlay.print = $("#overlay div.print");
};
TT.overlay.showBookmark = function(continueCallback, restartCallback, cancelCallback) {
    TT.overlay.overlay.stop().fadeIn(200);
    TT.overlay.bookmark.siblings().hide();
    TT.overlay.bookmark.stop().fadeIn(200);
    $("a.resume", TT.overlay.bookmark).click(function() {
        TT.overlay.hide();
        continueCallback();
        return false;
    });
    $("a.restart", TT.overlay.bookmark).click(function() {
        TT.overlay.hide();
        restartCallback();
        return false;
    });
    $("a.close", TT.overlay.bookmark).click(function() {
        TT.overlay.hide();
        cancelCallback();
        return false;
    });
    TT.overlay.visible = true;
    TT.overlay.hasShownBookmark = true;
    TT.pageflip.unregisterEventListeners();
    $("body").addClass("overlay");
};
TT.overlay.showPrint = function() {
    TT.overlay.overlay.stop().fadeIn("fast");
    TT.overlay.print.siblings().hide();
    TT.overlay.print.stop().fadeIn("fast");
    $("a.close", TT.overlay.print).click(function() {
        TT.overlay.hide();
        return false;
    });
    $("a.downloadPdf.disabled", TT.overlay.print).click(function() {
        return false;
    });
    TT.overlay.visible = true;
    TT.pageflip.unregisterEventListeners();
    $("body").addClass("overlay");
};
TT.overlay.hide = function() {
    TT.overlay.overlay.stop().fadeOut("fast");
    TT.overlay.bookmark.stop().fadeOut("fast");
    TT.overlay.print.stop().fadeOut("fast");
    TT.overlay.visible = false;
    TT.pageflip.registerEventListeners();
    $("body").removeClass("overlay");
};
TT.tableofthings = {};
TT.tableofthings.COLUMNS = 5;
TT.tableofthings.visible = false;
TT.tableofthings.initialize = function() {
    $("#table-of-contents ul li").mouseenter(TT.tableofthings.onChapterMouseOver);
    $("#table-of-contents ul li").mouseleave(TT.tableofthings.onChapterMouseOut);
    $("#table-of-contents ul li").click(TT.tableofthings.onChapterClick);
};
TT.tableofthings.updateReadMarkers = function() {
    $("#table-of-contents ul li").each(function() {
        var articleId = $("a", this).attr("data-article");
        if (TT.storage.hasArticleBeenRead(articleId)) {
            $(this).addClass("read");
        }
    });
};
TT.tableofthings.updateSelection = function(overrideArticleId) {
    var selectedArticleId = TT.navigation.classToArticle($("#pages section.current").attr("class"));
    if (overrideArticleId) {
        selectedArticleId = overrideArticleId;
    }
    $("#table-of-contents ul li").removeClass("selected");
    if (selectedArticleId) {
        var element = $("#table-of-contents ul li").find("[data-article*=" + selectedArticleId + "]");
        if (element && element.parent()) {
            element.parents("li").addClass("selected");
        }
    }
};
TT.tableofthings.show = function() {
    if (!TT.tableofthings.visible) {
        $("body").addClass("tot");
        $("#table-of-contents").stop(true, true).show().fadeTo(200, 1);
        $("#table-of-contents div.header").stop().css({
            opacity: 1
        });
        TT.tableofthings.truncate();
        $("#table-of-contents ul li").each(function(i) {
            var row = Math.floor(i / TT.tableofthings.COLUMNS);
            var col = i % TT.tableofthings.COLUMNS;
            row++;
            col++;
            $(this).stop().css({
                opacity: 0
            }).show().delay((row + col) * 50).fadeTo(100, 1);
        });
        TT.updateLayout();
    }
    TT.tableofthings.visible = true;
    TT.pageflip.unregisterEventListeners();
};
TT.tableofthings.hide = function() {
    $("body").removeClass("tot");
    $("#table-of-contents").delay(200).fadeTo(200, 0,
    function() {
        $(this).hide();
    });
    $("#table-of-contents div.header").stop().fadeTo(150, 0);
    var length = $("#table-of-contents ul li").length;
    $("#table-of-contents ul li").each(function(i) {
        var row = Math.floor((length - 1 - i) / TT.tableofthings.COLUMNS);
        var col = (length - 1 - i) % TT.tableofthings.COLUMNS;
        row++;
        col++;
        $(this).stop().fadeTo((row + col) * 40, 0);
    });
    TT.tableofthings.visible = false;
    if (!TT.navigation.isFullScreen()) {
        TT.pageflip.registerEventListeners();
    }
    TT.updateLayout();
};
TT.tableofthings.onChapterClick = function(event) {
    if ($("body").hasClass("tot")) {
        var articleId = $(event.target).parents("li").children("a").attr("data-article");
        if (!articleId) {
            articleId = $(event.target).children("a").attr("data-article");
        }
        if (TT.navigation.goToPage(articleId, 1)) {
            TT.tableofthings.hide();
            TT.chapternav.updateSelection(articleId);
            TT.tableofthings.updateSelection(articleId);
        }
    }
    return false;
};
TT.tableofthings.onChapterMouseOver = function(event) {
    $(this).find(".extended").show();
    $(this).find(".ellipsis").hide();
    $(this).find("p.fullyTruncated").show();
    if ($(event.target).parents("li").hasClass("disabled") || $(event.target).parents("li").hasClass("selected")) {
        return false;
    }
};
TT.tableofthings.onChapterMouseOut = function(event) {
    $(this).find(".extended").hide();
    $(this).find(".ellipsis").show();
    $(this).find("p.fullyTruncated").hide();
};
TT.tableofthings.truncate = function() {
    $("#table-of-contents ul li").each(function(i) {
        var that = $(this);
        var thatA = that.find("a");
        that.css("z-index", 1000 - i);
        if (thatA.outerHeight() > 130) {
            TT.tableofthings.findSliceLength(thatA);
        }
    });
};
TT.tableofthings.findSliceLength = function(aEl) {
    var p = aEl.find("p").eq(1);
    var len = p.text().length;
    var txt = p.text();
    var start = len;
    while (aEl.outerHeight() > 130) {
        len = start = txt.lastIndexOf(" ", start - 1);
        if (len <= 0) {
            len = 0;
        }
        var tease = txt.slice(0, len);
        var extended = txt.slice(len);
        var ellipsis = extended.length > 0 && len != 0 ? " ...": "";
        p.html('<span class="tease">' + tease + '</span><span class="ellipsis">' + ellipsis + '</span><span class="extended" style="display:none;">' + extended + "</span>");
        if (len == 0) {
            p.addClass("fullyTruncated").hide();
            break;
        }
    }
    var h3 = aEl.find("h3");
    len = h3.text().length;
    txt = h3.text();
    var start = len;
    while (aEl.outerHeight() > 130) {
        len = start = txt.lastIndexOf(" ", start - 1);
        var tease = txt.slice(0, len);
        var extended = txt.slice(len);
        var ellipsis = extended.length > 0 ? " ...": "";
        h3.html('<span class="tease">' + tease + '</span><span class="ellipsis">' + ellipsis + '</span><span class="extended" style="display:none;">' + extended + "</span>");
    }
};
TT.flipintro = {};
TT.flipintro.WIDTH = 89;
TT.flipintro.HEIGHT = 29;
TT.flipintro.VSPACE = 20;
TT.flipintro.loopInterval = -1;
TT.flipintro.canvas = null;
TT.flipintro.context = null;
TT.flipintro.flip = {
    progress: 0,
    alpha: 0
};
TT.flipintro.initialize = function() {
    TT.flipintro.canvas = $("#flip-intro");
    if (TT.flipintro.canvas[0]) {
        TT.flipintro.canvas[0].width = TT.flipintro.WIDTH;
        TT.flipintro.canvas[0].height = TT.flipintro.HEIGHT + (TT.flipintro.VSPACE * 2);
        TT.flipintro.context = TT.flipintro.canvas[0].getContext("2d");
    }
};
TT.flipintro.activate = function() {
    if (TT.flipintro.loopInterval == -1) {
        TT.flipintro.flip.progress = 1;
        TT.flipintro.loopInterval = setInterval(TT.flipintro.render, 32);
    }
};
TT.flipintro.deactivate = function() {
    clearInterval(TT.flipintro.loopInterval);
    TT.flipintro.loopInterval = -1;
};
TT.flipintro.render = function() {
    if (!TT.flipintro.canvas[0]) {
        return;
    }
    TT.flipintro.context.clearRect(0, 0, TT.flipintro.WIDTH, TT.flipintro.HEIGHT + (TT.flipintro.VSPACE * 2));
    if (!TT.navigation.isHomePage()) {
        TT.flipintro.deactivate();
    }
    TT.flipintro.flip.progress -= Math.max(0.12 * (1 - Math.abs(TT.flipintro.flip.progress)), 0.02);
    TT.flipintro.flip.alpha = 1 - ((Math.abs(TT.flipintro.flip.progress) - 0.7) / 0.3);
    if (TT.flipintro.flip.progress < -2) {
        TT.flipintro.flip.progress = 1;
    }
    var strength = 1 - Math.abs(TT.flipintro.flip.progress);
    var anchorOutdent = strength * 12;
    var controlOutdent = strength * 8;
    var source = {
        top: {
            x: TT.flipintro.WIDTH * 0.5,
            y: TT.flipintro.VSPACE
        },
        bottom: {
            x: TT.flipintro.WIDTH * 0.5,
            y: TT.flipintro.HEIGHT + TT.flipintro.VSPACE
        }
    };
    var destination = {
        top: {
            x: source.top.x + (TT.flipintro.WIDTH * TT.flipintro.flip.progress * 0.6),
            y: TT.flipintro.VSPACE - anchorOutdent
        },
        bottom: {
            x: source.bottom.x + (TT.flipintro.WIDTH * TT.flipintro.flip.progress * 0.6),
            y: TT.flipintro.HEIGHT + TT.flipintro.VSPACE - anchorOutdent
        }
    };
    var control = {
        top: {
            x: source.top.x + (12 * TT.flipintro.flip.progress),
            y: TT.flipintro.VSPACE - controlOutdent
        },
        bottom: {
            x: source.bottom.x + (12 * TT.flipintro.flip.progress),
            y: TT.flipintro.HEIGHT + TT.flipintro.VSPACE - controlOutdent
        }
    };
    TT.flipintro.context.fillStyle = "rgba(238,238,238," + TT.flipintro.flip.alpha + ")";
    TT.flipintro.context.strokeStyle = "rgba(90,90,90," + TT.flipintro.flip.alpha + ")";
    TT.flipintro.context.beginPath();
    TT.flipintro.context.moveTo(source.top.x, source.top.y);
    TT.flipintro.context.quadraticCurveTo(control.top.x, control.top.y, destination.top.x, destination.top.y);
    TT.flipintro.context.lineTo(destination.bottom.x, destination.bottom.y);
    TT.flipintro.context.quadraticCurveTo(control.bottom.x, control.bottom.y, source.bottom.x, source.bottom.y);
    TT.flipintro.context.fill();
    TT.flipintro.context.stroke();
};
var TT = TT || {};
TT.locale = {};
TT.locale.title = null;
TT.locale.list = null;
TT.locale.initialize = function() {
    this.title = $("#language-selector-title");
    this.list = $("#language-selector-list");
    this.title.click(function() {
        if ($(this).hasClass("open")) {
            TT.locale.closeList();
        } else {
            TT.locale.openList();
        }
    });
    $("li a", this.list).attr("href", "#").click(function(event) {
        var targetLocale = $(this).parents("li").attr("data-locale");
        var targetURL = TT.locale.removeLocaleCodeFromURL(document.location.pathname);
        document.location = "/" + targetLocale + targetURL;
        event.preventDefault();
    });
    this.title.mousedown(function(event) {
        event.preventDefault();
    });
};
TT.locale.onDocumentMouseDown = function(event) {
    if ($(event.target).parents("#language-selector").length === 0) {
        TT.locale.closeList();
    }
};
TT.locale.openList = function() {
    this.title.addClass("open");
    this.list.addClass("open");
    $(document).bind("mousedown", this.onDocumentMouseDown);
};
TT.locale.closeList = function() {
    this.title.removeClass("open");
    this.list.removeClass("open");
    $(document).unbind("mousedown", this.onDocumentMouseDown);
};
TT.locale.getLocaleCodeFromURL = function() {
    var code = document.location.pathname;
    if (code.indexOf("fil-PH") > 0) {
        code = code.match(/\/fil-PH/gi) || "";
    } else {
        if (code.indexOf("es-419") > 0) {
            code = code.match(/\/es-419/gi) || "";
        } else {
            code = code.match(/\/(..\-..)/gi) || "";
        }
    }
    code = code.toString().replace(/\//gi, "");
    if (!code) {
        return "en-US";
    }
    return code;
};
TT.locale.getLanguageFromLocaleCode = function(localeCode) {
    var languageCode = localeCode.slice(0, localeCode.indexOf("-"));
    if (!languageCode) {
        return locale;
    }
    return languageCode;
};
TT.locale.removeLocaleCodeFromURL = function(url) {
    if (url.indexOf("fil-PH") > 0) {
        return url.replace(/\/fil-PH/gi, "");
    } else {
        if (url.indexOf("es-419") > 0) {
            return url.replace(/\/es-419/gi, "");
        } else {
            return url.replace(/\/(..\-..)/gi, "");
        }
    }
};