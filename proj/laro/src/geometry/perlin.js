/**
 * Perlin
 * 噪声花边
 * @require [global, point2, vector2, geometry.util]
 */

Laro.register('perlin', function (La) {
	this.start = true;
	this.g1 = [];
	this.p = [];
		
	this.noise = function (arg) {
		var bx0, bx1,
			rx0, rx1,
			sx , t, u, v;

		if (this.start) {
			this.start = false;
			this.init();
		}

		var s = this.setup(arg, bx0, bx1, rx0, rx1);

		sx = this.s_curve(s.rx0);
		u = s.rx0 * this.g1[this.p[s.bx0]];
		v = s.rx1 * this.g1[this.p[s.bx1]];

		return La.geometry.util.lerp(u, v, sx);
	};
	// 三次曲线，可调整
	this.s_curve = function (t) {
		return t * t * (3 - 2*t);
	};

	this.setup = function (i, bx0, bx1, rx0, rx1) {
		var B = 0x100, // 256
			BM = 0xff, // 255
			N = 0x1000,// 4096
			NP = 12,   // 
			NM = 0xfff,// 4095
			s = {};

		s.t = i + N;
		s.bx0 = Math.floor(s.t) & BM;
		s.bx1 = (s.bx0 + 1) & BM;
		s.rx0 = s.t - Math.floor(s.t);
		s.rx1 = s.rx0 - 1;
		return s;
	};	

	this.init = function () {
		var B = 0x100, // 256
			i, j, k;
		for (i = 0; i < B; i ++) {
			this.p[i] = i;
			this.g1[i] = (Math.random() * (2*B) - B) / B;
		}

		while (-- i) {
			k = this.p[i];
			j = Math.floor(Math.random() * B);
			this.p[i] = this.p[j];
			this.p[j] = k;
		}

		for (i = 0; i < B + 2; i ++) {
			this.p[B+i] = this.p[i];
			this.g1[B + i] = this.g1[i];
		}
	}
	
})
