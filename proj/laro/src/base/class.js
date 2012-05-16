/** 
 * Laro (Game Engine Based on Canvas) 
 * Code licensed under the MIT License:
 *
 * @fileOverview Laro
 * @version 1.0
 * @author  Hongru
 * @description 
 * 
 */
 
/** 
 * @description
 * Package: Laro.base
 */
 
Laro.register('.base', function (L) {

    var context = this,
    old = context.Class,
    f = 'function',
    fnTest = /xyz/.test(function() {
        xyz
    }) ? /\bsupr\b/: /.*/,
    proto = 'prototype';
	
	/**
     * 创建一个类
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {Function} o: 类的constructor， 也可以是一个Object字典，如果是这样，那么initialize默认为constructor，其他的methods
	 * @example 
	 * Man = Laro.Class(function (name) {
			this.name = name;
		}).methods({
			walk: function () {
				//todo
			},
			talk: function () {
				//todo
			}
		});
		
		SuperMan = Man.extend(function (name, canfly) {
			this.name = name;
			this.canfly = canfly;
		}).methods({
			walk: function () {
				this.supr();
				// todo
			},
			fly: function () {
				// todo
			}
		});
     * 
     * @return {Class} 返回一个类
     */
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

	/**
     * @lends Laro.Class(...)
	 * @param {Function} o: 子类的constructor
	 * @param {Boolean} fromSub: 不继承父类
	 * @return {Class} 返回一个类的子类
     */ 
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
    }

    Class.noConflict = function() {
        context.Class = old;
        return this;
    }
    context.Class = Class;

    Laro.Class = Class;
    
});
