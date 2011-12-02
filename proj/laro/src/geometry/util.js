/**
 * util of geometry
 * @require [global]
 */

Laro.register('.geometry.util', function (La) {

	var slice = Array.prototype.slice,
		toType = La.toType,
		self = this;

	var findNumber = function (p, arr) {
		var result = arr.splice(0, 1)[0];

		for (var i = 0; i < arr.length; i ++) {
			if (toType(arr[i]) == 'number') {
				result = Math[p](result, arr[i]);
			}
		}
		return result;
	} 
	// 返回几个数中最小那个	
	this.min = Math.min;

	// 返回最大的数
	this.max = Math.max;
    
	// 返回三个数中间那个
	this.clamp = function (arg) {
		var arr = toType(arg) == 'array' ? arg : slice.call(arguments, 0),
			_min = Math.min(arr[0], Math.min(arr[1], arr[2]));
		if (arr.length === 3) {
			for (var i = 0; i < arr.length; i ++) {
				if (arr[i] === _min) {
					arr.splice(i, 1);
					break;
				}
			}
			return Math.min(arr[0], arr[1]);
		}
	};
	// 返回指定插值系数的两数插值
	this.lerp = function (from, to, t) {
		return from + t * (to - from);
	};
    

    Laro.extend(this);
})
