/**
 * Render
 * {Class}
 */

Laro.register('.world', function (La) {
	var Class = La.base.Class || La.Class,
		Pixel32 = La.geometry.Pixel32,
		Rectf = La.geometry.Rectf,
		assert = La.err.assert,
		Layer = La.world.Layer,
		TileLayer = La.world.TileLayer,
		SpriteLayer = La.world.SpriteLayer;

	var Render = Class(function () {
		// scale
		this.scaleFactor = 1.0;
		this.width = 0;
		this.height = 0;
		this.clips = [];
		this.defaultClip = null;

		this.frontToBack = false;

		this.calls = 0;
		this.maxCalls = 10000;

		this.red = new Pixel32(255, 0, 0);
		this.green = new Pixel32(0, 255, 0);
		this.blue = new Pixel32(0, 0, 255);
		this.black = new Pixel32(0, 0, 0);
		this.white = new Pixel32(255, 255, 255);
		this.transparent = new Pixel32(0, 0, 0, 0);
	}).methods({
		isFrontToBack: function () {
			return this.frontToBack;
		},
		clear: function () {},
		getWidth: function () { return this.width },
		getHeight: function () { return this.height },
		getSafeRect: function () { return new Rectf(0, 0, this.getWidth(), this.getHeight()) },
		reset: function (w, h) {
			assert(w > 0 && h > 0, 'invalid arguments');
			this.width = w;
			this.height = h;
			this.defaultClip = new Rectf(0, 0, w/this.scaleFactor, h/this.scaleFactor);
		},
		setScaleFactor: function (factor) {
			assert(factor > 0.0, 'factor wrong');
			this.scaleFactor = factor;
			this.defaultClip = new Rectf(0, 0, this.getWidth()/this.scaleFactor, this.getHeight()/this.scaleFactor);
		},

		/**
		 * 以下未定义的空函数会在继承于Render的子类中定义
		 * 
		 */

		drawLine: function (x0, y0, x1, y1, color) {  },
		drawCircle: function (x, y, r, color) {},
		drawRect: function (x0, y0, x1, y1, color) {},
		//折线
		drawQuad: function (verts, cols) {
			
		},
		// 三角形
		drawTris: function (verts, cols) {},
		// 从上向下渐变的rect
		drawFilledRect: function (x0, y0, x1, y1, c1, c2) {},
		// 渐变三角形
		drawFilledTris: function (verts, cols) {},
		// image
		// @param imgW {ImageWapper}
		// @param x {Number} 坐标 0 到 width
		// @param y {Number} 坐标 0 到Height
		// @param angle {Number} 图片旋转角度
		// @param centered {Boolean} 是否居中
		// @param alpha ｛Number｝0-255 透明度。默认255
		// @param tint {Pixel32} 像素混合
		// @param flipped {Boolean} 是否沿y 轴翻转
		drawImage: function (imgW, x, y, angle, centered, alpha, tint, flipped) {},
		/**
		 * 在三角形区域画图
		 *
		 * @param imgW {ImageWapper}
		 * @param xy {Array} 三角形三个顶点的坐标list
		 * @param uv {Array} 三角形texture 的坐标list
		 * @param tint {Pixel32} 32位像素点混合
		 */
		drawTriangleImage: function (imgW, xy, uv, tint) {},
		/**
		 * draws a particle
		 *
		 * @param imgW {ImageWapper}
		 * @param x {number}
 		 * @param y {Number} 0..height
		 * @param angle {Number} a float in radians
		 * @param scaleX {Number} defines image scaling
		 * @param scaleY {Number} defines image scaling
		 * @param alpha {Number} default is 255
		 * @param color {Pixel32}
		 * @param additive {Boolean} defines alpha blending mode
		 */		
		drawParticle: function (imgW, x, y, angle, scaleX, scaleY, alpha, color, additive) {},
		/**
		 * 一系列图片，当需要平铺的图片或者可以用同一张图片的时候。
		 *
		 * @param imgW {ImageWapper}
		 * @param x {Number} 0..width
		 * @param y {Number} 0..height
		 * @param htiles {Number} horizontal tiles: > 0
		 * @param vtiles {Number} vertical tiles: > 0
		 * @param alpha {Number} 0..255
		 */
		drawTilingImage: function (imgW, x, y, htiles, vtiles, alpha) {
			var i, j,
				w = imgW.textureWidth,
				h = imgW.textureHeight;
			for (i = 0; i < htiles; i ++) {
				for (j = 0; j < vtiles; j ++) {
					this.drawImage(imgW, x + i*w, y + j*h, 0, true, alpha);
				}
			}
		},
		/**
		 * draws a layer
		 *
		 * @param layer {Layer}
		 * @param ox {Number} offset in pixels
		 * @param oy {Number} offset in pixels
		 * @param x {Number} first tile
		 * @param y {Number} first tile
		 * @param nx {Number} tile index
		 * @param ny {Number} tile index
		 */
		drawLayer: function (layer, ox, oy, x, y, nx, ny) {
			var i, j, img, ix, iy, centered, flipped, offset;
			if (layer instanceof Layer) {
				// draw 所有行
				for (j = y; j < y + ny; j ++) {
					var previous = layer.previous(x, j),
						last = layer.index(x + nx - 1, j);
					// 画所有列
					var imgW, ix, iy, centered, flipped, offset;
					for (i = previous + 1, offset = i*5; i <= last; i ++) {
						imgW = layer.tiles[offset++];
						ix = layer.tiles[offset++];
						iy = layer.tiles[offset++];
						centered = layer.tiles[offset++];
						flipped = Layer.tiles[offset++];

						this.drawImage(imgW, ox + ix, oy + iy, 0, centered, 1, null, flipped);
					}
				}
			} else if (layer instanceof SpriteLayer) {
				var frontToBack = this.isFrontToBack();
				for (i = 0; i < layer.count(); i ++) {
					offset = 4 * (frontToBack ? this.count() - 1 - i : i);
					var minX = layer.rectangles[offset ++],
						minY = layer.rectangles[offset++],
						maxX = layer.rectangles[offset++],
						maxY = layer.rectangles[offset++];
					if (maxX >= x && minX <= x + nx && maxY >= y && minY <= y + ny) {
						offset = 5 * (frontToBack ? layer.count() - 1 - i : i);

						imgW = layer.tiles[offset++];
						ix = layer.tiles[offset++];
						iy = layer.tiles[offset++];
						centered = layer.tiles[offset++];
						flipped = layer.tiles[offset++];

						this.drawImage(imgW, ox + ix, oy + iy, 0, centered, 1, null, flipped);
					}
				}
			} else {
				assert(false);
			}
		},
		// image text
		drawText: function (imgW, x, y, alpha) {
					  
		},
		drawCanvas: function (canvas, x, y) {},
		// pure text on canvas
		drawSystemText: function (txt, x, y, color) {},
		// fill screen
		drawFillScreen: function (color) {},
		
		/**
		 * clip methods
		 * 剪裁
		 */
		pushClipRect: function (r) {
			assert(r instanceof Rectf);
			this.clips.push(r);
		},
		popClipRect: function () {
			assert(this.clips.length > 0, 'no clip to pop');
			return this.clips.pop();
		},
		// 获取当前起作用的clip，通常是最后一个
		getClipRect: function () {
			if (this.clips.length == 0) {
				return this.defaultClip;
			} else {
				return this.clips[this.clips.length - 1];
			}			 
		},
		flush: function () {
			this.calls = 0;	   
		}

	});

	this.Render = Render;
    
    Laro.extend(this);
});
