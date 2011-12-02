/**
 * game start
 * @require [loader, world, ...]
 */

Laro.register('.game', function (La) {
		
	this.go = function (opt) {
		var defaults = {
			canvasId: null,
			width: 0,
			height: 0,
			scale: 1,
			fps: 60,
			gameClass: function () {},
			loaderClass: function () {}
		};
		Laro.extend(defaults, opt || {});

		//TODO
	}		
})
