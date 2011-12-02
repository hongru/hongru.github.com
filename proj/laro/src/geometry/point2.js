/**
 * point2
 * @require [global]
 */

Laro.register('.geometry', function (La) {
	
	var self = this,
		Class = La.base.Class;
		
	// 二维点
	var Point2 = Class({
		initialize: function (x, y) {
			this.x = x;
			this.y = y;
		},
		// x, y 平方和
		magnitudeSquared: function () {
			return this.x * this.x + this.y * this.y;
		},
		// 平方和 根
		magnitude: function () {
			return Math.sqrt(this.magnitudeSquared());
		},
		// add 
		// return this;
		add: function (v) {
			this.x += v.x;
			this.y += v.y;
			return this;
		},
		// add a vector
		// return new vector
		addNew: function (v) {
			return new Point2(this.x + v.x, this.y + v.y);		
		},
		sub: function (v) {
			this.x -= v.x;
			this.y -= v.y;
			return this;
		},
		subNew: function (v) {
			return new Point2(this.x - v.x, this.y - v.y);		
		},
		mul: function (f) {
			this.x *= f;
			this.y *= f;
			return this;
		},
		mulNew: function (f) {
			return new Point2(this.x * f, this.y * f);		
		},
		div: function (f) {
			this.x /= f;
			this.y /= f;
			return this;
		},
		divNew: function (f) {
			return new Point2(this.x / f, this.y / f);		
		},
		equal: function (v) {
			return (this.x === v.x && this.y === v.y);	   
		},
		notEqual: function (v) {
			return (this.x !== v.x || this.y !== v.y);		  
		},
		copy: function () {
			return new Point2(this.x, this.y);	  
		}
	});

	this.Point2 = Point2;
    
    Laro.extend(this);

});
