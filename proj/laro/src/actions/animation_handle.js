/**
 * AnimationHandle
 * {Class}
 * 管理驱动动画
 */

Laro.register('.action', function (La) {
	
	var Class = La.Class || La.base.Class;

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
		clone: function () {
			var clone = new AnimationHandle(this.animation, this.callback, this.renderMirrored);
			clone.start = this.start;
			clone.end = this.end;
			clone.time = this.time;
			return clone;
		},
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

		draw : function (render, x, y, angle, alpha, tint) {
			var image = this.animation.frames[this.currentFrame];
			var baseX = this.renderMirrored ? x - (image.textureWidth - this.animation.pivotx) : x - this.animation.pivotx;
			render.drawImage(image, baseX, y - this.animation.pivoty, angle, false, alpha, tint, this.renderMirrored);
		},
		mirror: function () {
			this.renderMirrored = !this.renderMirrored;		
		},
		// play animation 
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
		// play 到指定时间点
		playToTime: function (t) {
			this.playTo = t;
			if (this.time >= this.playTo * this.animation.animationLength - 0.5 / this.animation.framerate) {
				this.time = this.start * this.animation.animationLength;
			}
			this.playing = true;
		},
		// play 到指定 event位置
		playToEvent: function (name) {
			for (var i = 0; i < this.animation.events.length; i ++) {
				var e = this.animation.events[i];
				if (e.name == name) {
					this.playToTime(e.time / this.animation.animationLength);
					break;
				}
			}			 
		},
		// stop
		stop: function () {
			this.playing = false;	  
		},
		// 返回动画初始位置
		rewind: function () {
			this.time = this.start * this.animation.animationLength;		
		},
		// 跳到指定位置
		gotoTime: function (time) {
			this.time = time * this.animation.animationLength;		  
		},
		// 跳到指定事件位置
		gotoEvent: function (evt) {
			for (var i = 0; i < this.animation.events.length; i ++) {
				var e = this.animation.events[i];
				if (e.name == evt) {
					this.time = e.time;
					break;
				}
			}		   
		},
		//跳到动画结束位置
		gotoEnd: function () {
			var halfFrame = 0.5 / this.animation.framerate;
			this.time = (this.end - halfFrame) * this.animation.animationLength;
		},
		// 指定动画播放的区间
		setRange: function (s, e) {
			this.start = s;
			this.end = e;

			var length = this.animation.animationLength;
			if (this.time < s * length) this.time = s * length;
			if (this.time > e * length) this.time = e * length;
		},
		// 播放速度
		setSpeed: function (s) {
			this.speed = s;		  
		},
		// 获取用于播放的动画长度
		getLength: function () {
			return this.animation.animationLength * (this.end - this.start);		   
		},
		// 获取当前位置
		getCurrentPosition: function () {
			return this.time;					
		},
		// 是否停止
		isStopped: function () {
			return !this.playing;		   
		},
		setCallback: function (cb) {
			this.callback = cb;			 
		}
	});

	this.AnimationHandle = AnimationHandle;
	Laro.extend(this);
		
})
