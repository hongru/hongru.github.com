////////////////////////////////////////////////////////////
// // ==== Simple 2D Vector Class ====
// @author Gerard Ferrandez / http://www.dhteumeuleu.com/
// last update: Oct 24, 2013
// Released under the MIT license
// http://www.dhteumeuleu.com/LICENSE.html
////////////////////////////////////////////////////////////

"use strict";

var ge1doot = ge1doot || {};

ge1doot.V2 = function () {

/*
      ##,                                   ,##
      '##,                                 ,##'
       '##                                 ##'
        ##               __,               ##
        ##          __.-'   \              ##
        ##    ___.-'__.--'\ |              ##,
        ## .-' .-, (      | |        _     '##
        ##/ / /""=\ \     | |       / \     ##,
        '#| |_\   / /     | |      /   \    '##
        / `-` 0 0 '-'`\   | |      | |  \   ,##
        \_,   (__)  ,_/  / /       |  \  \  ##'
         / /    \   \\  / /        |  |\  \ ## __
        | /`.__.-'-._)|/ /         |  | \  \##`__)
        \        ^    / /          |  |  | v## '--.
         '._    '-'_.' / _.----.   |  |  l ,##  (_,'
          '##'-,  ` `"""/       `'/|  | / ,##--,  )
           '#/`        `         '    |'  ##'   `"
            |                         /\_/#'
            |              __.  .-,_.;###`
           _|___/_..---'''`   _/  (###'
       .-'`   ____,...---""```     `._
      (   --''        __,.,---.    ',_)
       `.,___,..---'``  / /    \     '._
            |  |       ( (      `.  '-._)
            |  /        \ \      \'-._)
            | |          \ \      `"`
            | |           \ \
            | |    .-,     ) |
            | |   ( (     / /
            | |    \ '---' /
            /  \    `-----`
           | , /
           |(_/\-,
           \  ,_`)
            `-._)
	*/


	var FloatArray = Float32Array || Array;

	if (FloatArray == Array) {
	
		this.vector = function (x, y) {
			return [x || 0, y || 0];
		}
		
		this.matrix = function () {
			return [
				0, 0, // row0
				0, 0, // row1
				0, 0  // pos
			];
		}
		
		FloatArray.prototype.set = function (v) {
			for (var i = 0, l = v.length; i < l; i++) this[i] = v[i];
			return this;
		}
		
	} else {
	
		this.vector = function (x, y) {
			return new FloatArray([x || 0, y || 0]);
		}
		
		this.matrix = function () {
			return new FloatArray([
				0, 0, // row0
				0, 0, // row1
				0, 0  // pos
			]);
		}
	}
	
	// create an array of vector arrays
	
	this.vectorsArray = function (n, values, scaleX, scaleY) {
		var buffer = new Array(n);
		for (var i = 0; i < n; i++) {
			buffer[i] = this.vector(
				values != undefined ? (values[i * 2] * (scaleX || 1)) : 0,
				values != undefined ? (values[i * 2 + 1] * (scaleY || 1)) : 0
			);
		}
		return buffer;
	}
	
	// V2 stacked results
	
	this.result = this.vectorsArray(16);
	this.rid = 0;
	
	// inverse
	
	this.inv = function (a) {
		var result = this.result[this.rid++ % 16];
		result[0] = -a[0];
		result[1] = -a[1];
		return result;
	};

	// multiply scalar
	
	this.scale = function (a, s) {
		var result = this.result[this.rid++ % 16];
		result[0] = a[0] * s;
		result[1] = a[1] * s;
		return result;
	}
	
	
	// normal vector
	
	this.normal = function (a, b) {
		var result = this.result[this.rid++ % 16];
		var x = a[0] - b[0],
			y = a[1] - b[1],
			len = Math.sqrt(x * x + y * y);
		result[0] = -y / len;
		result[1] = x / len;
		return result;
	}
	
	
	// perpendicular
	
	this.perp = function (a) {
		var result = this.result[this.rid++ % 16];
		result[0] = -a[1];
		result[1] = a[0];
		return result;
	}
	
	
	// subtraction
	
	this.sub = function (a, b) {
		var result = this.result[this.rid++ % 16];
		result[0] = a[0] - b[0];
		result[1] = a[1] - b[1];
		return result;
	}
	
	
	// set matrix
	
	FloatArray.prototype.setMatrix = function (a, p) {
		this[0] = Math.cos(a);
		this[1] = Math.sin(a);
		this[2] = -this[1];
		this[3] =  this[0];
		this[4] = p[0];
		this[5] = p[1];
		return this;
	}
	
	// clamp
	
	this.clamp = function (v, min, max) {
		if (v > max) v = max; else if (v < min) v = min;
		return v;
	}
	
	// rotate into space of
	
	this.rotateIntoSpaceOf = function (m, a) {
		var dx = -a[0], dy = -a[1],
		result = this.result[this.rid++ % 16];
		result[0] = dx * m[0] + dy * m[1];
		result[1] = dx * m[2] + dy * m[3];
		return result;
	}
	
	// ---- Array prototype Monkey patching (for chaining..) ----
	
	FloatArray.prototype.copy = function (a) {
		this[0] = a[0];
		this[1] = a[1];
		return this;
	}
	
	
	FloatArray.prototype.normal = function (a, b) {
		var x = a[0] - b[0],
			y = a[1] - b[1],
			len = Math.sqrt(x * x + y * y);
		this[0] = -y / len;
		this[1] = x / len;
		return this;
	}
	
	
	FloatArray.prototype.inv = function (a) {
		this[0] = -a[0];
		this[1] = -a[1];
		return this;
	}
	
	
	FloatArray.prototype.invSelf = function () {
		this[0] = -this[0];
		this[1] = -this[1];
		return this;
	}
	
	
	FloatArray.prototype.dot = function (a) {
		return this[0] * a[0] + this[1] * a[1];
	}
	
	
	FloatArray.prototype.add = function (a, b) {
		this[0] = a[0] + b[0];
		this[1] = a[1] + b[1];
		return this;
	}
	
	
	FloatArray.prototype.addSelf = function (a) {
		this[0] += a[0];
		this[1] += a[1];
		return this;
	}
	
	
	FloatArray.prototype.sub = function (a, b) {
		this[0] = a[0] - b[0];
		this[1] = a[1] - b[1];
		return this;
	}
	
	
	FloatArray.prototype.subSelf = function (a) {
		this[0] -= a[0];
		this[1] -= a[1];
		return this;
	}
	
	
	FloatArray.prototype.subMultSelf = function (a, s) {
		this[0] -= a[0] * s;
		this[1] -= a[1] * s;
		return this;
	}
	
	
	FloatArray.prototype.scale = function (a, s) {
		this[0] = a[0] * s;
		this[1] = a[1] * s;
		return this;
	}
	
	
	FloatArray.prototype.addMultSelf = function (a, s) {
		this[0] += a[0] * s;
		this[1] += a[1] * s;
		return this;
	}
	
	
	FloatArray.prototype.scaleSelf = function (s) {
		this[0] *= s;
		this[1] *= s;
		return this;
	}
	
	
	FloatArray.prototype.perp = function (a) {
		this[0] = -a[1];
		this[1] = a[0];
		return this;
	}
	
	
	FloatArray.prototype.perpSelf = function () {
		var a = this[0];
		this[0] = -this[1];
		this[1] = a;
		return this;
	}
	
	
	FloatArray.prototype.lenSqr = function () {
		return this[0] * this[0] + this[1] * this[1];
	}
	
	
	FloatArray.prototype.len = function () {
		return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
	}
	
	
	FloatArray.prototype.rotateIntoSpaceOf = function (m, a) {
		var dx = -a[0], dy = -a[1];
		this[0] = dx * m[0] + dy * m[1];
		this[1] = dx * m[2] + dy * m[3];
		return this;
	}
	
	
	FloatArray.prototype.rotateBy = function (m, a) {
		var dx = a[0], dy = a[1];
		this[0] = m[0] * dx + m[2] * dy;
		this[1] = m[1] * dx + m[3] * dy;
		return this;
	}
	
	
	FloatArray.prototype.transformBy = function (m, a) {
		var dx = a[0], dy = a[1];
		this[0] = m[0] * dx + m[2] * dy + m[4];
		this[1] = m[1] * dx + m[3] * dy + m[5];
		return this;
	}

	
	FloatArray.prototype.min = function (a, b) {
		var ax = a[0], ay = a[1], bx = b[0], by = b[1];
		if (ax < this[0]) this[0] = ax;
		if (ay < this[1]) this[1] = ay;
		if (bx < this[0]) this[0] = bx;
		if (by < this[1]) this[1] = by;
		return this;
	}
	
	
	FloatArray.prototype.max = function (a, b) {
		var ax = a[0], ay = a[1], bx = b[0], by = b[1];
		if (ax > this[0]) this[0] = ax;
		if (ay > this[1]) this[1] = ay;
		if (bx > this[0]) this[0] = bx;
		if (by > this[1]) this[1] = by;
		return this;
	}
	
	return this;
	
}
