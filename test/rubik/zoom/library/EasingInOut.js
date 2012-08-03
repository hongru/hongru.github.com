////////////////////////////////////////////////////////////
// ==== In Out Easing - notime version ====
// @author Gerard Ferrandez / http://www.dhteumeuleu.com/
// last update: Jan 12, 2012
// Licensed under CC-BY - do not remove this notice
////////////////////////////////////////////////////////////

"use strict";

var ge1doot = ge1doot || {};

ge1doot.tweens = {
	first: false,
	prev: false,
	iterate: function () {
		var obj = this.first;
		do {
			obj.ease();
		} while ( obj = obj.next );
	}
};

ge1doot.tweens.Add = function (steps, initValue, initValueTarget, isAngle) {
	this.target  = initValueTarget || 0;
	this.value   = initValue  || 0;
	this.steps   = steps;
	this.isAngle = isAngle || false;
	this.speedMod = 1;
	// ---- used for normalizing angles ----
	if (isAngle) {
		this.normalizePI = function () {
			if (Math.abs(this.target - this.value) > Math.PI) {
				if (this.target < this.value)  this.value -= 2 * Math.PI;
				else this.value += 2 * Math.PI;
			}
		};
	}
	// ---- init target ----
	this.setTarget(this.target);
	// ---- add tween in queue ----
	if (!ge1doot.tweens.first) ge1doot.tweens.first = this; else ge1doot.tweens.prev.next = this;
	ge1doot.tweens.prev = this;
};
// ---- set target ----
ge1doot.tweens.Add.prototype.setTarget = function (target, speedMod) {
	this.speedMod = (speedMod) ? speedMod : 1;
	this.target  = target;
	// ---- normalize PI ----
	if (this.isAngle) {
		this.target = this.target % (2 * Math.PI);
		this.normalizePI();
	}
	// ---- set target ----
	if (this.running && this.oldTarget === target) return;
	this.oldTarget = target;
	this.running   = true;
	this.prog      = 0;
	this.from      = this.value;
	this.dist      = -(this.target - this.from) * 0.5;
};
// ---- easing ----
ge1doot.tweens.Add.prototype.ease = function () {
	if (!this.running) return;
	var s = this.speedMod * this.steps;
	if (this.prog++ < s) {
		// ---- inOut easing ----
		this.value = this.dist * (Math.cos(Math.PI * (this.prog / s)) - 1) + this.from;
		// ---- normalize PI ----
		if (this.isAngle) this.normalizePI();
	} else {
		// ---- stop ----
		this.running = false;
		this.value = this.target;
	}
};