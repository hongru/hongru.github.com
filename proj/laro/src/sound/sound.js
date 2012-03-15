/**
 * Sound pkg
 * base on html5 audio
 */
 
Laro.register('.game', function (La) {
	
	var Sound = La.Class(function (url, callback, isAuto) {
		this.url = url;
		this.loaded = false;
		this.callback = callback;
		this.channels = {};
		this.currentChannel = null;
		this.genAudio();
		this.bind();
		this.audio.load();
			
		
	}).methods({
		genAudio: function () {
			this.audio = document.createElement('audio');//new Audio();
			this.audio.src = this.url;
			this.audio.preload = 'auto';
		if (this.audio.play && navigator.userAgent.toLowerCase().indexOf('msie') < 0) {
				this.audio.play();
				this.audio.pause();
			}
			document.body.appendChild(this.audio)
		},
		bind: function () {
			var _this = this;
			this.audio.addEventListener('loadedmetadata', function (e) { 
				_this.addChannel('default', 0, _this.getDuration());	
			}, false);
			this.audio.addEventListener('playing', function(e) { 
				// todo	
			}, false);
			this.audio.addEventListener('timeupdate', function (e) {
				// todo
			}, false);
			this.audio.addEventListener('canplaythrough', function (e) { 
				_this.loaded = true;
				!_this.channels['default'] && _this.addChannel('default', 0, _this.getDuration());
				!!_this.callback && _this.callback();
			}, false);
		},
		update: function (dt) {
			// todo
		},
		getVolume: function () {
			return this.audio.volume;		   
		},
		setVolume: function (v) {
			v = Math.max(0, Math.min(v, 100));
			this.audio.volume = v;		   
		},
		haveData: function () {
			var s = this.audio.readyState;
			if (s == 1) {
				return false;
			} else if (s == 2 || s == 3 || s == 4 || s == 5) {
				return true;
			}
		},
		isPlayingChannel: function (name) {
			return !this.audio.paused && (name === this.currentChannel.name);				  
		},
		getDuration: function () {
			return this.audio.duration;
		},
		getCurrentChannel: function () {
			return this.currentChannel;
		},
		addChannel: function (name, start, duration) {
			if (La.toType(name) == 'object') {
				name = name.name;
				start = name.start;
				duration = name.duration;
			}
			var wholeDuration = this.getDuration();
			if (start > wholeDuration) {
				throw 'Sound channel start wrong!'
			}

			if (start + duration > wholeDuration) {
				duration = wholeDuration - start;
			}
			this.channels[name] = {
				start: start,
				end: (start + duration),
				duration: duration
			};
			
			return this.channels[name];
		},
		removeChannel: function (name) {
			delete this.channels[name];			   
		},
		pause: function () {
			return this.audio.pause();	   
		},
		preloadChannel: function (name) {
			this.pause();
			var channel = this.channels[name];
			if (channel) {
				this.audio.currentTime = channel.start;
			}
		},
		play: function (name, isLoop) {
			var _this = this, timer = -1;
			
			if (name == undefined) {
				name = 'default';
			}
			if (isLoop == undefined) {
				isLoop = false;
			}
			
			if (this.currentChannel) {
				clearTimeout(this.currentChannel.timer);
			}
			if (this.haveData()) {
				var channel = this.channels[name];
				clearTimeout(channel.timer);
				this.audio.currentTime = channel.start;
				this.audio.play();
				
				if (isLoop) {
					timer = setTimeout(function () {
						_this.play(name, i)
					}, channel.duration*1000);
				}
				
				
				this.currentChannel = {
					name: name,
					start: channel.start,
					duration: channel.duration,
					end: channel.end,
					isLoop: isLoop,
					startTime: (+new Date),
					timer: timer
				};
			}
		}
	})

	this.Sound = Sound;
	La.extend({Sound: Sound});

})
