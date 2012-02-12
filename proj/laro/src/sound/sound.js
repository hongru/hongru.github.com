/**
 * Sound pkg
 * base on html5 audio
 */
 
Laro.register('.game', function (La) {
	
	var Sound = La.Class(function (url, isAuto) {
		this.url = url;
		this.genAudio();
		
	}).methods({
		genAudio: function () {
			var audioElem = document.createElement('audio');
		}
	})
})