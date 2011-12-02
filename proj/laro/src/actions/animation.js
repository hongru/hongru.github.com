/**
 * Animation
 * {Class}
 * 动画类
 */

Laro.register('.action', function (La) {

	var Class = La.Class || La.base.Class,
		extend = La.extend;

	/**
	 * @param anim {Object} 从json配置里面获取的anim 配置
			{
				"nbrOfFrames": 73,
				"name": "TimeTrap",
				"atlas": "atlas/game/timetrap",
				"type": "animation",
				"image": "anims/timetrap.png",
				"pivoty": 128,
				"framerate": 30,
				"pivotx": 256,
				"events": []
			}
	 * @param frames {Array} 从json配置文件里面获得的每帧的位置信息
	 */
	var Animation = Class(function (anim, frames) {
		extend(this, anim);

		this.frames = frames;
		if (anim.framerate == undefined) anim.framerate = 20;
		// 这个动画执行需要的时间
		this.animationLength = frames.length / anim.framerate;
	}).methods({
		// 获取动画时间内指定时间段[from, to]中插入的事件
		getEvents: function (from, to) {
			var events = [];
			for (var e = 0; e < this.events.length; e ++) {
				var evt = this.events[e];
				if (evt.time >= from && evt.time < to) {
					events.push(evt.name);
				}
			}
			return events;
		},
		// 获取下一个动画内（指定时间段内）插入事件的触发具体时间
		getTimeForNextEvent: function (from, to) {
			var first = -1;
			for (var e = 0; e < this.events.length; e ++) {
				var evt = this.events[e];
				if (evt.time > from && evt.time < to) {
					if (first != -1) return first;
					first = evt.time;
				}
			}
			return first;
		},
		// 给定两个时间区间，如果有交集，交集中的事件push两次
		getEventsSlow: function (from, to, start, end, dt) {
			var events = [],
				e,
				evt;
			for (e = 0; e < this.events.length; e++) {
				evt = this.events[e];
				if (evt.time >= from && evt.time < end) {
					events.push(evt.name);
				}
			}

			for (e = 0; e < this.events.length; e ++) {
				evt = this.events[e];
				if (evt.time >= start && evt.time < to) {
					events.push(evt.name);
				}
			}

			return events;
		}
	});

	this.Animation = Animation;
	Laro.extend(this);
		
})
