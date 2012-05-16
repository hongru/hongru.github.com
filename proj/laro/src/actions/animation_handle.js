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
 * Package: Laro.action
 */

Laro.register('.action', function (La) {
	/**
     * 命名空间 Laro.action
     * 
     * @namespace
     * @name Laro.action
     */
	var Class = La.Class || La.base.Class;

	/**
     * 帧动画控制类
     * @class 

	 * @memberOf Laro
     * @name AnimationHandle
     * @constructor
     * 
     * @param {Object} animation: Animation实例（包含Animation需要的各种信息）
     * @param {Function} callback: 帧动画播放回调函数
     * @param {Boolean} mirrored: 是否横向翻转
     * @return 帧动画控制实例
     */
	var AnimationHandle = Class(function (animation, callback, mirrored) {
		if (animation instanceof AnimationHandle) {
			animation = animation.animation;
		}
		if (mirrored == undefined) {
			mirrored = false;
		}

		this.animation = animation;
		this.callback = callback == undefined ? null : callback;
		this.currentFrame = 0;
		this.time = 0;
		this.renderMirrored = mirrored;

		this.speed = 1;
		this.start = 0;
		this.end = 1;

		this.playTo = -1;
		this.loop = true;
		this.playing = false;

	}).methods({
	/**
     * @lends Laro.AnimationHandle.prototype
     */ 
	 
		/**
		 * 克隆一个 AnimationHandle 实例
		 *
		 * @return AnimationHandle 实例
		 */
		clone: function () {
			var clone = new AnimationHandle(this.animation, this.callback, this.renderMirrored);
			clone.start = this.start;
			clone.end = this.end;
			clone.time = this.time;
			return clone;
		},
		/**
		 * 用于帧动画更新的update方法
		 * @param {Number} dt: 帧间隔时间
		 */
		update: function (dt) {
			if (!this.playing) {
				this.currentFrame = Math.floor(this.time * this.animation.framerate) % this.animation.nbrOfFrames;
				return;
			}

			var oldTime = this.time;
			this.time += this.speed * dt;

			var halfFrame = 0.5/this.animation.framerate;
			var animationLength = this.animation.animationLength;
			
			// 循环
			if (this.loop) {
				if (this.speed > 0) {
					this.time = this.time >= animationLength * this.end ? this.start * animationLength : this.time;
				} else {
					this.time = this.time <= animationLength * this.start ? this.end * animationLength - halfFrame : this.time;
				}
			} else {
				var tempPlayTo; 
				if (this.speed > 0) {
					tempPlayTo = this.playTo >= 0 ? this.playTo : this.end;
					if (this.time >= animationLength * tempPlayTo) { 
						this.time = animationLength * tempPlayTo - halfFrame;
						this.playing = false;
					}
				} else {
					tempPlayTo = this.playTo >= 0 ? this.playTo : this.start;
					if (this.time <= animationLength * tempPlayTo) {
						this.time = animationLength * tempPlayTo + halfFrame;
						this.playing = false;
					}
				}
			}

			this.time = Math.max(this.time, 0);
			this.currentFrame = Math.floor(this.time * this.animation.framerate) % this.animation.nbrOfFrames;

			if (this.callback != null) {
				var timeToCheck = this.playing ? this.time : (this.speed > 0 ? animationLength * this.end : this.animation.animationLength * this.start);
				var evts;
				if (oldTime < timeToCheck) {
					evts = this.animation.getEvents(oldTime, timeToCheck);
				} else {
					evts = this.animation.getEventsSlow(oldTime, timeToCheck, animationLength * this.start, animationLength * this.end, dt);
				}

				if (evts.length >= 2) {
					this.time = this.animation.getTimeForNextEvent(oldTime, timeToCheck);
					evts = [evts[0]];
				}

				for (var e = 0; e < evts.length; e++) {
					this.callback(evts[e], this);
				}

				if (!this.playing) {
					this.callback('stopped', this);
				}
			}
		},
		/**
		 * 帧动画绘制方法
		 * @param {Object} render: Laro.CanvasRender 实例
		 * @param {Number} x: 绘制在画布上的x坐标
		 * @param {Number} y: 绘制在画布上的y坐标
		 * @param {Number} angle: 绘制角度
		 * @param {Number} alpha: 绘制透明度
		 * @param {Color} tint: 边缘混合色
		 */
		draw : function (render, x, y, angle, alpha, tint) {
			var image = this.animation.frames[this.currentFrame];
			var baseX = this.renderMirrored ? x - (image.textureWidth - this.animation.pivotx) : x - this.animation.pivotx;
			render.drawImage(image, baseX, y - this.animation.pivoty, angle, false, alpha, tint, this.renderMirrored);
		},
		/**
		 * 帧动画横向翻转
		 */
		mirror: function () {
			this.renderMirrored = !this.renderMirrored;		
		},
		/**
		 * 播放帧动画
		 * @param {Boolean} loop: 是否循环，默认为true
		 */
		play: function (loop) {
			this.playTo = -1;
			if (loop == undefined) {
				loop = true;
			}
			if (this.time >= this.end * this.animation.animationLength - 0.5 / this.animation.framerate) {
				this.time = this.start * this.animation.animationLength;
			}
			this.loop = loop;
			this.playing = true;
		},
		/**
		 * 播放帧动画到指定时间点
		 * @param {Number} t: 指定时间点
		 */
		playToTime: function (t) {
			this.playTo = t;
			if (this.time >= this.playTo * this.animation.animationLength - 0.5 / this.animation.framerate) {
				this.time = this.start * this.animation.animationLength;
			}
			this.playing = true;
		},
		/**
		 * 播放帧动画到指定事件触发处
		 * @param {String} name: 事件名
		 */
		playToEvent: function (name) {
			for (var i = 0; i < this.animation.events.length; i ++) {
				var e = this.animation.events[i];
				if (e.name == name) {
					this.playToTime(e.time / this.animation.animationLength);
					break;
				}
			}			 
		},
		/**
		 * 停止帧动画
		 */
		stop: function () {
			this.playing = false;	  
		},
		/**
		 * 返回到开始位置
		 */
		rewind: function () {
			this.time = this.start * this.animation.animationLength;		
		},
		/**
		 * 跳到指定位置
		 * @param {Number} time: 指定时间点
		 */
		gotoTime: function (time) {
			this.time = time * this.animation.animationLength;		  
		},
		/**
		 * 跳到指定事件位置
		 * @param {String} evt: 指定事件名
		 */
		gotoEvent: function (evt) {
			for (var i = 0; i < this.animation.events.length; i ++) {
				var e = this.animation.events[i];
				if (e.name == evt) {
					this.time = e.time;
					break;
				}
			}		   
		},
		/**
		 * 跳到动画结束位置
		 */
		gotoEnd: function () {
			var halfFrame = 0.5 / this.animation.framerate;
			this.time = (this.end - halfFrame) * this.animation.animationLength;
		},
		/**
		 * 指定动画播放区间
		 * @param {Number} s: 指定区间开始
		 * @param {Number} e: 指定区间结束
		 */
		setRange: function (s, e) {
			this.start = s;
			this.end = e;

			var length = this.animation.animationLength;
			if (this.time < s * length) this.time = s * length;
			if (this.time > e * length) this.time = e * length;
		},
		/**
		 * 指定动画播放速度
		 * @param {Number} s: 播放速度
		 */
		setSpeed: function (s) {
			this.speed = s;		  
		},
		/**
		 * 获取用于播放的动画长度
		 */
		getLength: function () {
			return this.animation.animationLength * (this.end - this.start);		   
		},
		/**
		 * 获取当前位置
		 */
		getCurrentPosition: function () {
			return this.time;					
		},
		/**
		 * 是否停止
		 */
		isStopped: function () {
			return !this.playing;		   
		},
		/**
		 * 设置播放回调
		 * @param {Function} cb: 播放回调
		 */
		setCallback: function (cb) {
			this.callback = cb;			 
		}
	});

	this.AnimationHandle = AnimationHandle;
	Laro.extend(this);
		
})
