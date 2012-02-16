/**
 * Sound pkg
 * base on html5 audio
 */
 
Laro.register('.game', function (La) {
	
	var Sound = La.Class(function (url, isAuto) {
		this.url = url;
		this.currentChannel = null;
		this.genAudio();
		this.channels = {};
		this.bind();
		this.audio.load();
		
	}).methods({
		genAudio: function () {
			this.audio = new Audio();
			this.audio.src = this.url;
			this.addChannel('default', 0, this.getDuration());
		},
		bind: function () {
			
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
			var channel = this.channels[name];
			this.audio.currentTime = channel.start;
			this.audio.play();
			this.currentChannel = {
				name: name,
				isLoop: isLoop
			};
		}
	})
})
