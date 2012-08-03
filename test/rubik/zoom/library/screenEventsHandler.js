////////////////////////////////////////////////////////////
// ==== unified screen & touch events handler ====
// @author Gerard Ferrandez / http://www.dhteumeuleu.com/
// last update: May 23, 2012
// Licensed under CC-BY - do not remove this notice
////////////////////////////////////////////////////////////

var ge1doot = ge1doot || {};

ge1doot.screen = {};

ge1doot.screen.InitEvents = function (setup) {
	this.setup     = setup;
	this.container = document.getElementById(setup.container);
	this.mouseX    = 0;
	this.mouseY    = 0;
	this.left      = 0;
	this.top       = 0;
	this.height    = 0;
	this.width     = 0;
	this.dragX     = 0;
	this.dragY     = 0;
	this.startX    = 0;
	this.startY    = 0;
	this.drag      = false;
	this.moved     = false;
	this.down      = false;
	this.cxb       = 0;
	this.cyb       = 0;
	this.running   = true;
	this.canvas    = false;
	this.ctx       = false;
	// ---- no onclick ----
	if (setup.click) this.container.onclick = function () { return false; };
	// ---- canvas mode ----
	if (setup.canvas) {
		this.canvas = document.getElementById(setup.canvas);
		this.ctx = this.canvas.getContext("2d");
	}
	// ---- this closure ----
	var self = this;
	// ---- resize ----
	window.addEventListener('resize', function () {
		self.resize();
	}, false);
	this.resize();
	// ======== unified touch/mouse events handler ========
	this.container.ontouchstart = this.container.onmousedown = function (e) {
		if (!self.running) return true;
		// ---- touchstart ----
		if (self.canvas) {
			if (e.target !== self.canvas) return;
		} else {
			if (e.target !== self.container) return;
		}
		e.preventDefault(); // prevents scrolling
		if (self.container.setCapture) self.container.setCapture();
		self.drag = false;
		self.moved = false;
		self.down = true;
		self.startX = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - self.left;
		self.startY = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - self.top;
		// ---- call external down function ----
		self.setup.down && self.setup.down();
		return false;
	};
	this.container.ontouchmove = this.container.onmousemove = function(e) {
		if (!self.running) return true;
		// ---- touchmove ----
		e.preventDefault();
		self.mouseX = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - self.left;
		self.mouseY = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - self.top;
		if (self.down) {
			self.dragX = self.cxb + (self.mouseX - self.startX);
			self.dragY = self.cyb - (self.mouseY - self.startY);
		}
		if (Math.abs(self.mouseX - self.startX) > 10 || Math.abs(self.mouseY - self.startY) > 10) {
			// ---- if pointer moves then cancel the tap/click ----
			self.moved = true;
			if (self.down) self.drag = true;
		}
		// ---- call external move function ----
		self.setup.move && self.setup.move();
	};
	this.container.ontouchend = this.container.onmouseup = function(e) {
		if (!self.running) return true;
		// ---- touchend ----
		e.preventDefault();
		if (self.container.releaseCapture) self.container.releaseCapture();
		self.cxb = self.dragX;
		self.cyb = self.dragY;
		if (!self.moved) {
			// ---- click/tap ----
			self.mouseX = self.startX;
			self.mouseY = self.startY;
			// ---- call external click function ----
			self.setup.click && self.setup.click();
		} else {
			// ---- call external up function ----
			self.setup.up && self.setup.up();
		}
		self.drag = false;
		self.down = false;
		self.moved = false;
	};
	this.container.ontouchcancel = function(e) {
		if (!self.running) return true;
		// ---- reset ---- 
		if (self.container.releaseCapture) self.container.releaseCapture();
		self.drag = false;
		self.moved = false;
		self.down = false;
		self.cxb = self.dragX;
		self.cyb = self.dragY;
		self.startX = 0;
		self.startY = 0;
	};
};

// ==== resize ====
ge1doot.screen.InitEvents.prototype.resize = function () {
	// ---- size ----
	this.width  = this.container.offsetWidth;
	this.height = this.container.offsetHeight;
	// ---- offset ----
	var o = this.container;
	for (this.left = 0, this.top = 0; o != null; o = o.offsetParent) {
		this.left += o.offsetLeft;
		this.top  += o.offsetTop;
	}
	// ---- canvas resize ----
	if (this.canvas) {
		this.canvas.width  = this.width;
		this.canvas.height = this.height;
	}
}