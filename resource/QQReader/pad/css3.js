/**
 * CSS3 animate
 * @example 
 * 	CSS3.animate(el)
 		.to(500, 200)
 		.rotate(180)
 		.scale(.5)
 		.set('background-color', '#888')
 		.set('border-color', 'black')
 		.duration('2s')
 		.skew(50, -10)
 		.then()
 			.set('opacity', 0)
 			.duration('0.3s')
 			.scale(.1)
 			.pop()
 		.end();
 * 	
 */	
Jx().$package('CSS3', function (J) {

	var packageContext = this;
	var current = (typeof getComputedStyle != 'undefined') ? getComputedStyle : currentStyle;
	// 样式为数字+px 的属性
	var map = {
		'top': 'px',
		'left': 'px',
		'right': 'px',
		'bottom': 'px',
		'width': 'px',
		'height': 'px',
		'font-size': 'px',
		'margin': 'px',
		'margin-top': 'px',
		'margin-left': 'px',
		'margin-right': 'px',
		'margin-bottom': 'px',
		'padding': 'px',
		'padding-left': 'px',
		'padding-right': 'px',
		'padding-top': 'px',
		'padding-bottom': 'px',
		'border-width': 'px'
	}

	this.animate = function (selector) {
		var el = this.animate.get(selector);
		return new Anim(el);
	};
	this.animate.defaults = {
		duration: 500
	};
	this.animate.ease = {
		'in' : 'ease-in',
		'out': 'ease-out',
		'in-out': 'ease-in-out',
		'snap' : 'cubic-bezier(0,1,.5,1)'
	};
	this.animate.get = function (selector) {
		if (typeof selector != 'string' && selector.nodeType == 1) {
			return selector;
		}
		return document.getElementById(selector) || document.querySelectorAll(selector)[0];
	};

	// EventEmitter {Class}
	var EventEmitter = J.Class({
		init: function () {
			this.callbacks = {};
		},		
		on: function (event, fn) {
			(this.callbacks[event] = this.callbacks[event] || []).push(fn);
			return this;
		},
		/**
		 * param {event} 指定event
		 * params 指定event的callback的参数
		 */
		fire: function (event) {
			var args = Array.prototype.slice.call(arguments, 1),
				callbacks = this.callbacks[event],
				len;
			if (callbacks) {
				for (var i = 0, len = callbacks.length; i < len; i ++) {
					callbacks[i].apply(this, args);
				}
			}
			return this;
		}
	});

	/**
	 * Anim {Class}
	 * @inherit from EventEmitter
	 * param {Element}
	 */
	var Anim = J.Class({extend: EventEmitter},{
		init: function (el) {
			var context = this;
			// 调父类方法
			this.callSuper = function (funcName) {
				var slice = Array.prototype.slice;
				var args = slice.call(arguments, 1);
				Anim.superClass[funcName].apply(context, args.concat(slice.call(arguments)));
			}

			this.callSuper('init');

			if (!(this instanceof Anim)) {
				return new Anim(el);
			}
			this.el = el;
			this._props = {};
			this._rotate = 0;
			this._transitionProps = [];
			this._transforms = [];
			this.duration(packageContext.animate.defaults.duration);

		},
		transform : function (transform) {
			this._transforms.push(transform);
			return this;
		},
		// skew methods
		skew: function (x, y) {
			y = y || 0;
			return this.transform('skew('+ x +'deg, '+ y +'deg)');
		},
		skewX: function (x) {
			return this.transform('skewX('+ x +'deg)');	   
		},
		skewY: function (y) {
			return this.transform('skewY('+ y +'deg)');	   
		},
		// translate methods
		translate: function (x, y) {
			y = y || 0;
			return this.transform('translate('+ x +'px, '+ y +'px)');
		},
		to: function (x, y) {
			return this.translate(x, y);	
		},
		translateX: function (x) {
			return this.transform('translateX('+ x +'px)');			
		},
		x: function (x) {
			return this.translateX(x);   
		},
		translateY: function (y) {
			return this.transform('translateY('+ y +'px)');			
		},
		y: function (y) {
			return this.translateY(y);   
		},
		// scale methods
		scale: function (x, y) {
			y = (y == null) ? x : y;
			return this.transform('scale('+ x +', '+ y +')');
		},
		scaleX: function (x) {
			return this.transform('scaleX('+ x +')');
		},
		scaleY: function (y) {
			return this.transform('scaleY('+ y +')');
		},
		// rotate methods
		rotate: function (n) {
			return this.transform('rotate('+ n +'deg)');
		},

		// set transition ease
		ease: function (fn) {
			fn = packageContext.animate.ease[fn] || fn || 'ease';
			return this.setVendorProperty('transition-timing-function', fn);
		},

		//set duration time
		duration: function (n) {
			n = this._duration = (typeof n == 'string') ? parseFloat(n)*1000 : n;
			return this.setVendorProperty('transition-duration', n + 'ms');
		},

		// set delay time
		delay: function (n) {
			n = (typeof n == 'string') ? parseFloat(n) * 1000 : n;
			return this.setVendorProperty('transition-delay', n + 'ms');
		},

		// set property to val
		setProperty: function (prop, val) {
			this._props[prop] = val;
			return this;
		},
		setVendorProperty: function (prop, val) {
			this.setProperty('-webkit-' + prop, val);
			this.setProperty('-moz-' + prop, val);
			this.setProperty('-ms-' + prop, val);
			this.setProperty('-o-' + prop, val);
			return this;
		},
		set: function (prop, val) {
			this.transition(prop);	 
			if (typeof val == 'number' && map[prop]) {
				val += map[prop];
			}
			this._props[prop] = val;
			return this;
		},
		
		// add value to a property
		add: function (prop, val) {
			var self = this;
			return this.on('start', function () {
				var curr = parseInt(self.current(prop), 10);
				self.set(prop, curr + val + 'px');
			})
		},
		// sub value to a property
		sub: function (prop, val) {
			var self = this;
			return this.on('start', function () {
				var curr = parseInt(self.current(prop), 10);
				self.set(prop, curr - val + 'px');
			})
		},
		current: function (prop) {
			return current(this.el).getPropertyValue(prop);		 
		},

		transition: function (prop) {
			if (this._transitionProps.indexOf(prop) > -1) { return this; }
			this._transitionProps.push(prop);
			return this;
		},
		applyPropertys: function () {
			var props = this._props,
				el = this.el;
			for (var prop in props) {
				if (props.hasOwnProperty(prop)) {
					el.style.setProperty(prop, props[prop], '');
				}
			}
			return this;
		},
		
		// then
		then: function (fn) {
			if (fn instanceof Anim) {
				this.on('end', function () {
					fn.end();		
				})
			} else if (typeof fn == 'function') {
				this.on('end', fn);
			} else {
				var clone = new Anim(this.el);
				clone._transforms = this._transforms.slice(0);
				this.then(clone);
				clone.parent = this;
				return clone;
			}

			return this;
		},
		pop: function () {
			return this.parent;	 
		},
		end: function (fn) {
			var self = this;
			this.fire('start');

			if (this._transforms.length > 0) {
				this.setVendorProperty('transform', this._transforms.join(' '));
			}

			this.setVendorProperty('transition-properties', this._transitionProps.join(', '));
			this.applyPropertys();

			if (fn) { this.then(fn) }

			setTimeout(function () {
				self.fire('end');		
			}, this._duration);

			return this;
		}
	});
		
});
