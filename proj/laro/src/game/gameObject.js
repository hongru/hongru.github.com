/**
 * GameObject
 * {Class}
 * 负责处理和管理游戏中不同layers
 * 包括有多层layers组成的背景
 * 由单层layer组成的人物或者物体等等
 */

Laro.register('.game', function (La) {
		
	var Class = Laro.Class;

	/**
	 * base Class
	 * 基类
	 */
	var GameObject = Class(function (x, y, z, manager) {
		this.x = x || 0;
		this.y = y || 0;
		this.zOrder = z || 0;
		this.manager = manager;

	}).methods({
		joinIn: function (manager) {
			this.manager = manager;
		}, 
		startUp: function (x, y, z) {
			if (x != undefined) this.x = x;
			if (y != undefined) this.y = y;
			if (z != undefined) this.zOrder = z;

			this.manager.addGameObject(this);
		},
		shutDown: function () {
			this.manager.removeGameObject(this);
		}

	});

		
})

