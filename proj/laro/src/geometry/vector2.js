/**
 * Vector2
 * @require [global, base.class, geometry.point2]
 */

Laro.register('.geometry', function (La) {
		
	var self = this,
		Class = La.base.Class,
		Point2 = La.geometry.Point2;

	var Vector2 = Point2.extend({
		// 矢量点积
		dot: function (v) {
			return this.x * v.x + this.y * v.y;
		},
		
		cross: function (v) {
			return this.x * v.x - this.y * v.y; 
		},
		length: function () {
			return this.magnitude();
		},
		// 单位化
		normalize: function () {
			var inv = 1 / this.length();
			this.x *= inv;
			this.y *= inv;
			return this;
		},
		copy: function () {
			return new Vector2(this.x, this.y);
		} 
	});

	Vector2.zero = new Vector2(0, 0);
	Vector2.X = new Vector2(1, 0);
	Vector2.Y = new Vector2(0, 1);

	this.Vector2 = Vector2;
    
    Laro.extend(this);
		
})
