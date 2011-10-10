/**
 * Director pattern
 * for Big Web App Development
 */

(function (win, undefined) {
 
 	var initializing = false,
		superTest = /horizon/.test(function () {horizon;}) ? /\b_super\b/ : /.*/;

	this.Class = function () {};
	Class.extend = function (prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;

		for (var name in prop) {
			prototype[name] = (typeof prop[name] === 'function' && typeof _super[name] === 'function' && superTest.test(prop[name])) ? (function (name, fn) {
					return function () {
						var temp = this._super;	
						// 当前子类通过_super继承父类
						this._super = _super[name];
						//继承方法执行完毕后还原
						var ret = fn.apply(this, arguments);
						this._super = temp;

						return ret;
					}
				})(name, prop[name]) : prop[name];
		}
		
		function Class () {
			if (!initializing && this.init) {
				this.init.apply(this, arguments);
			}
		}
		Class.prototype = prototype;
		Class.constructor = Class;
		Class.extend = arguments.callee;

		return Class;
	};

	var extend = function (target, source, isOverwrite) {
		if (isOverwrite == undefined) {
			isOverwrite = true;
		}
		for (var key in source) {
			if (!target.hasOwnProperty(key) || isOverwrite) {
				target[key] = source[key];
			}
		}
		return target;
	}

	/**
	 * Person
	 * Director & Actor 的基类
	 */
	var Person = Class.extend({
		init: function (name) {
			this.name = name;
			this.isWaking = false;
			this.$WAKETODO = [];
		},
		$wake: function () {
			this.isWaking = true;
		},
		$sleep: function () {
			this.isWaking = false;
		}
	});

	/**
	 * Director
	 */
	var Director = Person.extend({
		init: function (name, fn) {
			this._super(name);
			!!fn && fn.call && fn.apply && extend(this, new fn);
			this.actors = [];
			this._observes = {};
		},

		$wake: function (wakeFn) {
			this._super();
			wakeFn != undefined && this.$WAKETODO.push(wakeFn);
			this.$firstAct != undefined && this.$WAKETODO.push(this.$firstAct);

			for (var i = 0; i < this.actors.length; i ++) {
				var actor = this.actors[i];
				if (actor instanceof Actor) {
					actor.$wake();
				}
			}
			
			for (var j = 0; j < this.$WAKETODO.length; j ++) {
				var fn = this.$WAKETODO[j];
				if (typeof fn == 'string') {
					fn = this[fn];
				}
				!!fn.call && !!fn.apply && fn.call(this);
			}
		},
		$sleep: function (sleepFn) { 
			this._super();
			!!sleepFn && sleepFn();
		},
		$observe: function (actor, type, listener) {
			if (this._observes[actor.name] == undefined) {
				this._observes[actor.name] = {};
			}
			if (this._observes[actor.name][type] == undefined) {
				this._observes[actor.name][type] = [];
			}
			this._observes[actor.name][type].push(listener);
		}
			
	})

	/**
	 * Actor
	 */
	var Actor = Person.extend({
		init: function (opt, fn) {
			this._super(opt.name);
			!!fn && fn.call && fn.apply && extend(this, new fn);
			this.director = opt.director;
			if (this.director instanceof Director) {
				this.director.actors.push(this);
			}
		},
		$wake: function (wakeFn) { 
			this._super();
			wakeFn != undefined && this.$WAKETODO.push(wakeFn);
			for (var i = 0; i < this.$WAKETODO.length; i ++) {
				var fn = this.$WAKETODO[i];
				if (typeof fn == 'string') {
					fn = this[fn];
				}
				!!fn.call && !!fn.apply && fn.call(this);
			}
		},
		$sleep: function (sleepFn) { 
			this._super();
			!!sleepFn && sleepFn();
		},
		$notifyDirector: function (type, arg) {
			var listeners = this.director._observes[this.name][type];
			if (!!listeners) {
				for (var i = 0; i < listeners.length; i ++) {
					listeners[i].apply(this, Array.prototype.slice.call(arguments, 1));
				}
			}
		}
	})
 	
	/* public interface */
	this.Director = function (name, fn) {
		return (this instanceof Director) ? this.init(name, fn) : new Director(name, fn);
	};
	this.Actor = function (opt, fn) {
		return (this instanceof Actor) ? this.init(opt, fn) : new Actor(opt, fn);
	}
 
 })(window)
