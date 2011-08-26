/**
 * JCanvas
 * 给canvas里面图形加上常用事件代理
 * @author horizon
 */

(function () {
 	
 	var initializing = false,
		superTest = /horizon/.test(function () {horizon;}) ? /\b_super\b/ : /.*/;
	// 临时Class
	this.Class = function () {};
	// 继承方法extend
	Class.extend = function (prop) {
		var _super = this.prototype;
		//创建一个实例，但不执行init
		initializing = true;
		var prototype = new this();
		initializing = false;

		for (var name in prop) {
			// 用闭包保证多级继承不会污染
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
		
		//真实的constructor
		function Class () {
			if (!initializing && this.init) {
				this.init.apply(this, arguments);
			}
		}
		Class.prototype = prototype;
		Class.constructor = Class;
		Class.extend = arguments.callee;

		return Class;
	}
 	/**
	 * 定义一个可视图形的基本属性
	 */
	var DisplayClass = Class.extend({
		init: function (option) {
			if (option === undefined) {
				option = {};
			}
			this.x = typeof option.x === 'number' ? option.x : 0;
			this.y = typeof option.y === 'number' ? option.y : 0;
			this.width = typeof option.width === 'number' ? option.width : 0;
			this.height = typeof option.height === 'number' ? option.height : 0;
			this.stage = null;
			this.draw = typeof option.draw === 'function' ? option.draw : function () {};
		}			
	});

	/**
	 * 交互对象
	 */
	var InteractiveClass = DisplayClass.extend({
				init: function (option) {
					this._super(option);
					this.eventListener = {};
				},
				addEventListener: function (type, func) {
					if (this.eventListener[type] === null || this.eventListener[type] === undefined) {
						this.eventListener[type] = [];
					}
					this.eventListener[type].push(func);
				},
				removeEventListener: function (type, func) {
					if (this.eventListener[type] === null || this.eventListener[type] === undefined) {
						return;
					}
					for (var i=0; i<this.eventListener[type].length; i++) {
						// 删除指定的监听器
						if (this.eventListener[type][i] == func) {
							delete this.eventListener[type][i];
							this.eventListener[type].splice(i, 1);
						}
					}
					// 如果这种类型没有监听器，删除它
					if (this.eventListener[type].length === 0) {
						delete this.eventListener[type];
					}
				},
				removeAllEventListener: function (type) {
					if (this.eventListener[type] === null || this.eventListener[type] === undefined) {
						return;
					}	
					this.eventListener[type].splice();
					delete this.eventListener[type];
				},
				hasEventListener: function (type) {
					return (!!this.eventListener[type] && this.eventListener[type].length > 0);				 
				}
			});

	/**
	 * Sprite 容器
	 */
	var ObjectContainerClass = InteractiveClass.extend({
				init: function (ctx, option) {
					this._super(option);
					this.ctx = ctx;
					this.children = [];
					this.maxWidth = 0;
					this.maxHeight = 0;
					this.hoverChildren = [];
				},
				addEventListener: function (type, func) { this._super(type, func) },
				removeEventListener: function (type, func) { this._super(type, func) },
				removeAllEventListener: function (type) { this._super(type) },
				hasEventListener: function (type) { this._super(type) },
				getContext: function () {
					return this.ctx;
				},
				addChild: function (child) {
					if (this.maxWidth < child.x + child.width) {
						this.maxWidth = child.x + child.width;
					}
					if (this.maxHeight < child.y + child.height) {
						this.maxHegiht = child.y + child.height;
					}
					child.stage = this;

					this.children.push(child);
				},
				addChildAt: function (child, index) {
					if (this.maxWidth < child.x + child.width) {
						this.maxWidth = child.x + child.width;
					}			
					if (this.maxHeight < child.y + child.height) {
						this.maxHeight = child.y + child.height;
					}
					child.stage = this;
					this.children.splice(index, 0, child);
				},
				removeChild: function (child) {
					this.children.splice(this.getChildIndex(child), 1);	
					// 如果是支撑最大宽高的child被移除了，重新处理最大宽高
					if (this.maxWidth == child.x + child.width) {
						this.maxWidth = 0;
						for (var i=0; i<this.children.length; i++) {
							if (this.maxWidth < this.children[i].x + this.children[i].width) {
								this.maxWidth = this.children[i].x + this.children[i].width;
							}
						}
					}
					if (this.maxHeight == child.y + child.height) {
						this.maxHeight = 0;
						for (var i=0; i<this.children.length; i++) {
							if (this.maxHeight < this.children[i].y + this.children[i].height) {
								this.maxHeight = this.children[i].y + this.children[i].height;
							}
						}
					}
					child.stage = null;
				},
				removeChildAt: function (index) {
					this.children[index].stage = null;
					var child =	this.children.splice(index, 1);
					// 最大宽高
					if (this.maxWidth == child.x + child.width) {
						this.maxWidth = 0;
						for (var i=0; i<this.children.length; i++) {
							if (this.maxWidth < this.children[i].x + this.children[i].width) {
								this.maxWidth = this.children[i].x + this.children[i].width;
							}
						}
					}
					if (this.maxHeight == child.y + child.height) {
						this.maxHeight = 0;
						for (var i=0; i<this.children.length; i++) {
							this.maxHeight = 0;
							if (this.maxHeight < this.children[i].y + this.children[i].height) {
								this.maxHeight = this.children[i].y + this.children[i].height;
							}
						}
					}
				}, 
				getChildAt: function (index) {
					return this.children[index];			
				},
				getChildIndex: function (child) {
					for (var i=0; i<this.children.length; i++) {
						if (this.children[i] == child) {
							return i;
						}
					}			   
					return -1;
				},
				contains: function (child) {
					return (this.getChildIndex(child) != -1);		  
				},

				// 鼠标事件
				dispatchMouseEvent: function (type, x, y) {
					var mouseX = x, mouseY = y;
					var _hoverChildren = [];
					for (var i=0; i<this.children.length; i++) {
						if (!!this.children[i].dispatchMouseEvent) {
							this.children[i].dispatchMouseEvent(type, mouseX-this.children[i].x, mouseY-this.children[i].y);
						}
						//鼠标悬浮于子对象上面
						if (mouseX > this.children[i].x && mouseX < this.children[i].x + this.children[i].width
							&& mouseY > this.children[i].y && mouseY < this.children[i].y + this.children[i].height) {
							type == 'mousemove' && _hoverChildren.push(this.children[i]);
						
						if (this.children[i].eventListener[type] == null
							|| this.children[i].eventListener[type] == undefined) {
							continue; // 没有事件监听器
						}
						// 有事件监听则遍历执行
						for (var j=0, arr=this.children[i].eventListener[type]; j < arr.length; j++) {
							arr[j](mouseX-this.children[i].x, mouseY-this.children[i].y);
						}
						}
					};
					if (type != 'mousemove') {
						return; // 不是 mousemove事件则到此结束
					}
					// 以下是处理mousemove事件
					for (var k=0; k<this.hoverChildren.length; k++) {
						// 原来hoverChildren中有的，现在没有的，转而执行 mouseout
						var has = false;
						for (var m=0; m<_hoverChildren.length; m++) {
							if (this.hoverChildren[k] == _hoverChildren[m]) {
								has = true;
							}
						}
						if (!has) {
							//不存在了，处理 this.hoverChildren[k] 的mouseout
							// 刚好又有事件在监听mouseout，则执行
							if (!!this.hoverChildren[k].eventListener['mouseout']) {
								for (var i=0, outObj = this.hoverChildren[k]; i<outObj.eventListener['mouseout'].length; i++) {
									outObj.eventListener['mouseout'][i](mouseX-outObj.x, mouseY-outObj.y);
								}
							}
							// 处理完后就销毁
							delete this.hoverChildren[k];
						}
					};
					// 原来hoverChildren中没有的，现在有了，证明mouseover
					for (var k=0; k<_hoverChildren.length; k++) {
						var has = false;
						for (var m=0; m<this.hoverChildren.length; m++) {
							if (_hoverChildren[k] == this.hoverChildren[m]) {
								has = true;
							}
						};
						if (!has) {
							//证明鼠标刚进入，处理mouseenter或mouseover
							this.hoverChildren.push(_hoverChildren[k]);
							if (_hoverChildren[k].eventListener['mouseover']) {
								for (var i=0, enterObj = _hoverChildren[k]; i<enterObj.eventListener['mouseover'].length; i++) {
									enterObj.eventListener['mouseover'][i](mouseX-enterObj.x, mouseY-enterObj.y);
								}
							}
						}
					};
					this.clearHoverChildren();
				},
				// 重新清理鼠标悬浮下的对象数组
				clearHoverChildren: function () {
					var tempArr = [];
					for (var i=0; i<this.hoverChildren.length; i++) {
						if (this.hoverChildren[i] != null && this.hoverChildren[i] != undefined) {
							tempArr.push(this.hoverChildren[i]);
						}
					}
					this.hoverChildren = tempArr;
				}
			});

	/**
	 * Stage {Class}
	 * 一个canvas对应一个stage实例
	 * @inherit {objectContainerClass}
	 * @param {htmlCanvasElement}
	 */
	var Stage = ObjectContainerClass.extend({
		init: function (canvas, option) {
			this._super(canvas.getContext('2d'), option);
			if (canvas === undefined) { throw new Error('htmlCanvasElement undefined') }
			this.canvas = canvas;
			this.isStart = false;
			this.interval = 16;
			this.timer = null;
			this.stage = null;
			this.CONFIG = {
				interval: 16,
				isClear: true
			};
			this.width = canvas.width;
			this.height = canvas.height;
			// 对canvasElement 监听
			//
			var context = this;
			var batchAddMouseEventListener = function (el, evArr) {
				for (var i=0; i<evArr.length; i++) { //console.log(evArr[i])
					el.addEventListener(evArr[i], function (param, i) {
						return function (e) { 
							var x = e.clientX - param.canvas.offsetLeft,
								y = e.clientY - param.canvas.offsetTop;
							if (!!param.eventListener[evArr[i]]) {
								for (var j=0; j<param.eventListener[evArr[i]].length; j++) {
									param.eventListener[evArr[i]][j](x, y);
								}
							}
							param.dispatchMouseEvent(evArr[i], x, y);
						}
					}(context, i), false);
				}
			};
			var batchAddKeyEventListener = function (el, evArr) {
				for (var i=0; i<evArr.length; i++) {
					el.addEventListener(evArr[i], function (param, i) {
								return function (e) {
									if (!!param.eventListener[evArr[i]]) {
										for (var j=0; j<param.eventListener[evArr[i]].length; j++) {
											param.eventListener[evArr[i]][j](e);
										}
									}
								}
							}(context, i), false);
				}
			};
			batchAddMouseEventListener(this.canvas, ['mousemove', 'mouseup', 'mousedown', 'click', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave']);	
			batchAddKeyEventListener(this.canvas, ['keyup', 'keydown', 'keypress']);
		},
		onRefresh: function () {},
		addEventListener: function (type, func) { return this._super(type, func) },
		removeEventListener: function (type, func) { return this._super(type, func) },
		removeAllEventListener: function (type) { return this._super(type) },
		hasEventListener: function (type) { return this._super(type) },
		getContext: function () { return this._super() },
		addChild: function (child) { return this._super(child) },
		addChildAt: function (child, index) { return this._super(child, index) },
		removeChild: function (child) { return this._super(child) },
		removeChildAt: function (child, index) { return this._super(child, index) },
		getChildAt: function (index) { return this._super(index) },
		getChildIndex: function (child) { return this._super(child) },
		contains: function (child) { return this._super(child) },
		dispatchMouseEvent: function (type, x, y) { return this._super(type, x, y) },
		clearHoverChildren: function () { return this._super() },
		render: function () {
			// 重绘
			!!this.CONFIG.isClear && this.clear();
			// 画舞台
			//console.log(this.children)
			this.draw();
			// 画舞台元素
			for (var i=0; i<this.children.length; i++) {
				// 坐标系移到对应位置
				this.ctx.translate(this.children[i].x, this.children[i].y);
				this.children[i].render();
				this.ctx.translate(-this.children[i].x, -this.children[i].y);
			}
		},
		clear: function (x, y, w, h) {
			if (x !== undefined && y !== undefined && w !== undefined && h !== undefined) {
				this.ctx.clearRect(x, y, w, h);
			} else {
				this.ctx.clearRect(0, 0, this.width, this.height);
			}
		},
		// 舞台表演开始
		start: function () {
			this.isStart = true;
			this.timer = setInterval((function (param) {
				return function () {
					param.render();
					param.onRefresh();
				}
			})(this), this.CONFIG.interval)
		},
		// 结束
		stop: function () {
			this.isStart = false;
			clearInterval(this.timer);
		}
	})

	/**
	 * Sprite {class}
	 * @inherit ObjectContainerClass
	 * @param {Object}
	 * option {
	 *		stage:
	 *		x:
	 *		y:
	 *		width:
	 *		height:
	 * }
	 */
	var Sprite = ObjectContainerClass.extend({
		init: function (ctx, option) {
			this._super(ctx, option);
			this.isDragging = false;
			this.dragPos = {};
			this.dragFunc = null;
			this.dropFunc = null;
		},
		addEventListener: function (type, func) { return this._super(type, func) },
		removeEventListener: function (type, func) { return this._super(type, func) },
		removeAllEventListener: function (type) { return this._super(type) },
		hasEventListener: function (type) { return this._super(type) },
		getContext: function () { return this._super() },
		addChild: function (child) { return this._super(child) },
		addChildAt: function (child, index) { return this._super(child, index) },
		removeChild: function (child) { return this._super(child) },
		removeChildAt: function (index) { return this._super(index) },
		getChildAt: function (index) { return this._super(index) },
		getChildIndex: function (child) { return this._super(child) },
		contains: function (child) { return this._super(child) },
		dispatchMouseEvent: function (type, x, y) { return this._super(type, x, y) },
		clearHoverChildren: function () { return this._super() },
		render: function () {
			this.draw();
			// 强制缩放，保证子对象不会比自己大
			this.ctx.scale(
						this.width < this.maxWidth ? this.width/this.maxWidth : 1,
						this.height < this.maxHeight ? this.height/this.maxHeight : 1
					);
			// 绘制子对象
			for (var i=0; i<this.children.length; i++) {
				this.ctx.translate(this.children[i].x, this.children[i].y);
				this.children[i].render();
				this.children[i].translate(-this.children[i].x, this.children[i].y);
			}
			this.ctx.scale(
						this.width < this.maxWidth ? this.maxWidth/this.width : 1,
						this.height < this.maxHeight ? this.maxHeight/this.height : 1
					);
		},
		onDrag: function (x, y) {
			var context = this;
			this.isDragging = true;
			this.dragPos.x = x + this.x;
			this.dragPos.y = y + this.y;
			this.dragFunc = function (_x, _y) {
				var offsetX = _x - context.dragPos.x,
					offsetY = _y - context.dragPos.y;
				context.x += offsetX;
				context.y += offsetY;
				context.dragPos.x = _x;
				context.dragPos.y = _y;
			};
			this.dropFunc = function (_x, _y) {
				context.onDrop();
			}; 
			this.stage.addEventListener('mousemove', this.dragFunc);
			this.stage.addEventListener('mouseout', this.dropFunc);
		},
		onDrop: function () {
			this.isDragging = false;
			this.dragPos = {};
			this.stage.removeEventListener('mousemove', this.dragFunc);
			this.stage.removeEventListener('mouseout', this.dropFunc);
			delete this.dragFunc;
			delete this.dropFunc;
		}
	})

	/**
	 * Vector2 {Class}
	 * 二维矢量类
	 */
	var Vector2 = Class.extend({
				init: function (x, y) {
					this.x = x;
					this.y = y;
				},
				copy: function () {
					return new Vector2(this.x, this.y);
				},
				length: function () {
					return Math.sqrt(this.sqrLength());
				},
				sqrLength: function () {
					return this.x*this.x + this.y*this.y;
				},
				/**
				 * 标准化，单位长度为1
				 */
				normalize: function () {
					var inv = 1/this.length();
					return new Vector2(this.x*inv, this.y*inv);
				},
				// 反向
				negate: function () {
					return new Vector2(-this.x, -this.y);
				},
				add: function (v) {
					return new Vector2(this.x+v.x, this.y+v.y);
				},
				subtract: function(v) {
					return new Vector2(this.x-v.x, this.y-v.y);		  
				},
				multiply: function (n) {
					return new Vector2(this.x*n, this.y*n);		  
				},
				divide: function (n) {
					return new Vector2(this.x/n, this.y/n);		
				},
				//矢量积
				dot: function (v) {
					return new Vector2(this.x*v.x, this.y*v.y);	 
				}
			});
	Vector2.zero = new Vector2(0, 0);

	/**
	 * Color {Class}
	 */
	var Color = Class.extend({
				init: function (r, g, b) {
					this.r = r;
					this.g =g;
					this.b =b;
				},
				copy: function () {
					return new Color(this.r, this.g, this.b);
				},
				add: function (c) {
					return new Color(
						Math.min(this.r+c.r, 1),
						Math.min(this.g+c.g, 1),
						Math.min(this.b+c.b, 1)
						);
				},
				subtract: function (c) {
					return new Color(
						Math.max(this.r-c.r, 0),
						Math.max(this.g-c.g, 0),
						Math.max(this.b-c.b, 0)
						);
				},
				multiply: function (n) {
					return new Color(
							Math.min(this.r*n, 1),
							Math.min(this.g*n, 1),
							Math.min(this.b*n, 1)
							);		  
				},
				divide: function (n) {
					return new Color(this.r/n, this.g/n, this.b/n);
				},
				/**
				 * 混合调配
				 */
				modulate: function (c) {
					return new Color(this.r*c.r, this.g*c.g, this.b*c.b);		  
				},
				saturate: function () {
					this.r = Math.min(this.r, 1);
					this.g = Math.min(this.g, 1);
					this.b = Math.min(this.b, 1);
				}
			});
	// static Color
	Color.black = new Color(0, 0, 0);
	Color.white = new Color(1, 1, 1);
	Color.red = new Color(1, 0, 0);
	Color.green = new Color(0, 1, 0);
	Color.blue = new Color(0, 0, 1);
	Color.yellow = new Color(1, 1, 0);
	Color.cyan = new Color(0, 1, 1);
	Color.purple = new Color(1, 0, 1);

	/**
	 * Particle Class
	 * 粒子类
	 * @param {Object}
	 * {
	 *		position:
	 *		velocity:
	 *		life:
	 *		color:
	 *		size:
	 * }
	 */
	var Particle = Class.extend({
		init: function (option) {
			this.position = option.position;
			this.velocity = option.velocity;
			this.acceleration = Vector2.zero;
			this.age = 0;
			this.life = option.life;
			this.color = option.color;
			this.size = option.size;
		}		
	});

	/**
	 * ParticleSystem {Class}
	 * 粒子系统，相当于粒子的一个collection
	 * @require Particle
	 */
	var ParticleSystem = Class.extend({
		init: function () {
			this.$private = {
				particles : []
			}
			
			this.gravity = new Vector2(0, 100);
			this.effectors = [];

		},
		// push 粒子到发射备用区
		emit: function (particle) {
			this.$private.particles.push(particle);
		},
		// 模拟运动(在当前时间微分下)
		simulate: function (dt) {
			this.aging(dt);
			this.applyGravity();
			this.applyEffectors();
			this.kinematics(dt);
		},
		// 判断粒子的生存时间
		aging: function (dt) {
			for (var i=0; i < this.$private.particles.length; ) {
				var p = this.$private.particles[i];
				p.age += dt;
				if (p.age > p.life) {
					this.kill(i);
				} else  {
					i ++;
				}
			}
		},
		kill: function (index) {
			if (index < this.$private.particles.length) {
				this.$private.particles.splice(index, 1);
			}	  
		},
		applyGravity: function () {
			for (var i in this.$private.particles) {
				this.$private.particles[i].acceleration = this.gravity;
			}			  
		},
		applyEffectors: function () {
			for (var j in this.effectors) {
				var apply = this.effectors[j].apply;
				for (var i in this.$private.particles) {
					apply(this.$private.particles[i]);
				}
			}				
		},
		// 运动学变换，矢量叠加
		kinematics: function (dt) {
			for (var i in this.$private.particles) {
				var p  = this.$private.particles[i];
				p.position = p.position.add(p.velocity.multiply(dt));
				p.velocity = p.velocity.add(p.acceleration.multiply(dt));
			}
		},
		/**
		 * 默认粒子的寿命由透明度表示
		 */
		render: function (ctx) {
			for (var i in this.$private.particles) {
				var p  = this.$private.particles[i],
					alpha = 1- (p.age/p.life);
				ctx.fillStyle = 'rgba('+Math.floor(p.color.r*255)+', '+Math.floor(p.color.g*255)+', '+Math.floor(p.color.b)+', '+alpha.toFixed(2)+')';
				ctx.beginPath();
				ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI*2, true);
				ctx.closePath();
				ctx.fill();
			}
		}
	})

	/**
	 * ParticleBlock Class
	 * @require [Particle, ParticleSystem]
	 */
	var ParticleBlock = Class.extend({
		init: function (x1, y1, x2, y2)	{
			this.apply = function (particle) {
				if (particle.position.x - particle.size < x1 || particle.position.x + particle.size > x2) {
					particle.velocity.x *= -1;
				}
				if (particle.position.y - particle.size < y1 || particle.position.y + particle.size > y2) {
					particle.velocity.y *= -1;
				}
			}
		}	
	})

	/**
	 * @pulic Interface
	 */
	this.Stage = Stage;
	this.Sprite = Sprite;
	this.Vector2 = Vector2;
	this.Color = Color;
	this.Particle = Particle;
	this.ParticleSystem = ParticleSystem;
	this.ParticleBlock = ParticleBlock;

 })();
