/**
 * Laro.global
 */

(function (win, undefined) {
 
 	var __INFO__ = {
		$name: 'Laro',
		$version: '0.1',
		$description: 'game engine based on html5'
	};

	var	toString = Object.prototype.toString,
		slice = Array.prototype.slice,
		self = this || win;


	function toType (o) {
		var r = toString.call(o).toLowerCase(),
			from = 8,
			to = r.length - 1;
		return r.substring(from, to);
	}

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

	function randomRange(from, to) {
		return from + Math.random() * (to - from);
	}
	function randomBool() {
		return Math.random() >= 0.5;
	}
	function curry (cb, context) {
		return function () {
			typeof cb == 'function' && cb.apply(context, arguments);
		}
	}
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
		randomRange: randomRange,
		randomBool: randomBool,
		curry: curry,
		curryWithArgs: curryWithArgs
	};

	var Laro = extend({}, __INFO__, $public);
	this[__INFO__['$name']] = win[__INFO__['$name']] = Laro;
 
 })(window);
