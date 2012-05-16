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


(function (win, undefined) {
    /**
     * Laro - 顶级命名空间
     * 
     * @namespace
     * @name Laro
     */
    var __INFO__ = {
        $name: 'Laro',
        $version: '0.1',
        $description: 'game engine based on html5'
    };

    var	toString = Object.prototype.toString,
        slice = Array.prototype.slice,
        self = this || win;

    /**
     * 判断指定参数的 type
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {*} 需要接受类型判断的参数
     * 
     * @return {String}指定参数的类型
     */
    function toType (o) {
        var r = toString.call(o).toLowerCase(),
            from = 8,
            to = r.length - 1;
        return r.substring(from, to);
    }

    /**
     * 扩展一个指定的对象的属性 或 方法，如果只有一个参数，表示直接扩展顶级命名空间 Laro
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {Object} target 被扩展的对象
     * @param {Object} source 用于扩展的源对象
     * @param {Boolean} isOverwrite 指定是否覆盖已有属性或方法
     *
     * @return {Object} obj 扩展之后的目标对象
     * 
     */
    function extend (target, source, isOverwrite) {
        var argInd = -1,
            args = slice.call(arguments, 0);
        target = self[__INFO__['$name']] || {};
        source = [];
        isOverwrite = true;
        while (args[++ argInd]) {
            if (toType(args[argInd]) === 'boolean') {
                isOverwrite = args[argInd];
            } else if (toType(args[argInd]) === 'object') {
                source.push(args[argInd]);
            } 
        }

        if (source.length >= 2) {
            target = source.splice(0, 1)[0];
        }

        for (var i = 0; i < source.length; i ++) {
            var _s = source[i];
            for (var key in _s) {
                if (!target.hasOwnProperty(key) || isOverwrite) {
                    target[key] = _s[key];
                }
            }
        }

        return target;
    }

    /**
     * 注册一个命名空间
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {String} name: 注册的命名空间名字，以‘.’开始表示注册为Laro的子命名空间，如 Laro.register('.test', function () {...}) ; 否则表示注册顶级命名空间
     * @param {Function} fn: 命名空间属性或方法的 提供 者
     * 
     */
    function register (name, fn) {
        var names = name.split('.'),
            i = -1,
            loopName = self;

        if (names[0] == '') {names[0] = __INFO__['$name']}

        while (names[++ i]) {
            if (loopName[names[i]] === undefined) {
                loopName[names[i]] = {};
            }
            loopName = loopName[names[i]]
        }

        !!fn && fn.call(loopName, self[__INFO__['$name']]);

    }

    /**
     * 返回指定区间的随机数
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {Number} from: 区间开始
     * @param {Number} to: 区间结束
     *
     * @return {Number} num 指定区间的随机数
     * 
     */
    function randomRange(from, to) {
        return from + Math.random() * (to - from);
    }

    /**
     * 返回随机的 true 或者 false[相同概率]
     * 
     * @memberOf Laro
     * @function
     *
     * @return {Boolean} bool 相同概率的随机true或者 false
     * 
     */
    function randomBool() {
        return Math.random() >= 0.5;
    }
    /**
     * 科里化
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {Function} cb: 被科里化的方法
     * @param {Object} context: 指定上下文对象
     *
     * @return {Function}  科里化之后的方法
     * 
     */
    function curry (cb, context) {
        return function () {
            typeof cb == 'function' && cb.apply(context, arguments);
        }
    }

    /**
     * 带参数的科里化
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {Function} cb: 被科里化的方法
     * @param {Object} context: 指定上下文对象
     * @param {*} 科里化后的方法调用时参数
     *
     * @return {Function} fun 科里化之后的方法
     * 
     */
    function curryWithArgs(cb, context) {
        var args = Array.prototype.slice.call(arguments, 0);
        delete args[0];
        delete args[1];
        return function () {
            typeof cb == 'function' && cb.apply(context, args.concat(arguments));
        };
    }

    var $public = {
        toType: toType,
        extend: extend,
        register: register,
        NS: register,
        randomRange: randomRange,
        randomBool: randomBool,
        curry: curry,
        curryWithArgs: curryWithArgs
    };


    var Laro = extend({}, __INFO__, $public);
    this[__INFO__['$name']] = win[__INFO__['$name']] = Laro;

 })(window);
