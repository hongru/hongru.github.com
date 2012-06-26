/**
 * Director pattern
 * @desc
 * for Big Web Applications Development
 * @author: github.com/hongru
 * @licence: MIT
 */

;(function (win, undefined) {

    var f = 'function',
        fnTest = /xyz/.test(function() {
            xyz
        }) ? /\bsupr\b/: /.*/,
        proto = 'prototype';

    function Class(o) {
        return extend.call(isFn(o) ? o: function() {},
        o, 1);
    }

    function isFn(o) {
        return typeof o === f;
    }

    function wrap(k, fn, supr) {
        return function() {
            var tmp = this.supr;
            this.supr = supr[proto][k];
            var ret = fn.apply(this, arguments);
            this.supr = tmp;
            return ret;
        }
    }

    function process(what, o, supr) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                what[k] = isFn(o[k]) && isFn(supr[proto][k]) && fnTest.test(o[k]) ? wrap(k, o[k], supr) : o[k];
            }
        }
    }

    function extend(o, fromSub) {
        // must redefine noop each time so it doesn't inherit from previous arbitrary classes
        function noop() {}
        noop[proto] = this[proto];

        var supr = this,
        prototype = new noop(),
        isFunction = isFn(o),
        _constructor = isFunction ? o: this,
        _methods = isFunction ? {}: o;

        function fn() {
            if (this.initialize) this.initialize.apply(this, arguments);
            else {
                fromSub || isFunction && supr.apply(this, arguments);
                _constructor.apply(this, arguments);
            }
        }

        fn.methods = function(o) {
            process(prototype, o, supr);
            fn[proto] = prototype;
            return this;
        }

        fn.methods.call(fn, _methods).prototype.constructor = fn;

        fn.extend = arguments.callee;
        fn[proto].implement = fn.statics = function(o, optFn) {
            o = typeof o == 'string' ? (function() {
                var obj = {};
                obj[o] = optFn;
                return obj;
            } ()) : o;
            process(this, o, supr);
            return this;
        }

        return fn;
    };
    
    // mix object
    function mix (target, source, isOverwrite) {
        if (isOverwrite == undefined) isOverwrite = true;
        for (var k in source) {
            if (!(k in target) || isOverwrite) {
                target[k] = source[k];
            }
        }
        return target;
    }

    /**
     * Base Class
     */
    var toString = Object.prototype.toString;
    var Person = Class(function (name) {
        this.name = name;
    }).methods({
        $define: function (ns, fn) {
            var me = this;
            if (fn) {
                if (typeof ns == 'string') {
                    this[ns] = toString.call(this[ns]) == '[object Object]' ? this[ns] : {};
                    me = this[ns];
                }    
            } else {
                fn = ns;
            }
            
            if (typeof fn == 'function') {
                fn.call(me);
            } else if (typeof fn == 'object') {
                mix(me, fn);
            }

        }
    });

    // Actor begin
    var _Actor = Person.extend(function (name, director) {
        this.$director = director;
        this.$director.$actors[name] = this;

    }).methods({
        $focus: function (type, fn) {
            if (!this.$director._observers[this.name]) { this.$director._observers[this.name] = {}; }
            if (!this.$director._observers[this.name][type]) { this.$director._observers[this.name][type] = []; }
            this.$director._observers[this.name][type].push(fn);
        }
    });

    // Director begin
    var _directors = {};
    
    var _Director = Person.extend(function (name) {
        this.$actors = {};
        this._observers = {};
        _directors[name] = this;

    }).methods({
        // director wake -->
        // dispatch $wake of all actors -->
        // act begin
        $wake: function () {
            this.$prepare && this.$prepare();
            for (var k in this.$actors) {
                this.$actors[k].$wake && this.$actors[k].$wake();
            }    
            this.$act && this.$act();
        },
        $actor: function (name) {
            return this.$actors[name] || new _Actor(name, this);
        },
        $notify: function (type, msg) {
            for (var a in this._observers) {
                if (this._observers[a][type] && this._observers[a][type].length) {
                    for (var i = 0; i < this._observers[a][type].length; i ++) {
                        this._observers[a][type][i].apply(null, Array.prototype.slice.call(arguments, 1));
                    }
                }
            }
        }
    });

    var Director = function (name) {
        return _directors[name] || new _Director(name);
    }

    this.Director = win.Director = Director;

})(window);
