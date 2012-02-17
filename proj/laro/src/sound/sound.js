/**
 * Sound pkg
 * base on html5 audio
 */
 
Laro.register('.game', function (La) {
	
	var Sound = La.Class(function (url, isAuto) {
		this.url = url;
		this.channels = {};
		this.currentChannel = null;
		this.genAudio();
		this.bind();
		this.audio.load();
		
	}).methods({
		genAudio: function () {
			this.audio = new Audio();
			this.audio.src = this.url;
		
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
				var cur = _this.currentChannel,
					t = (+ new Date);

				if (t >= cur.startTime + cur.duration*1000) {
					_this.isPlayingChannel(cur.name) && _this.pause();
					if (cur.isLoop) {
						_this.play(cur.name, cur.isLoop);
					}
				}
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
			if (name == undefined) {
				name = 'default';
			}
			if (isLoop == undefined) {
				isLoop = false;
			}
			if (this.haveData()) {
				var channel = this.channels[name];
				this.audio.currentTime = channel.start;
				this.audio.play();
				this.currentChannel = {
					name: name,
					start: channel.start,
					duration: channel.duration,
					end: channel.end,
					isLoop: isLoop,
					startTime: (+new Date)
				};
			}
		}
	})

	this.Sound = Sound;
	La.extend({Sound: Sound});

})
