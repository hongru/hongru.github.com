/**
 * canvas render
 * {Class}
 * @inherit from {Render}
 */

Laro.register('.world', function (La) {
		
	var assert = La.err.assert,
		Render = La.world.Render,
		Class = La.base.Class,
		toType = La.toType,
		Layer = La.world.Layer,
		TileLayer = La.world.TileLayer,
		SpriteLayer = La.world.SpriteLayer;

	var CanvasRender = Render.extend(function (canvasElement, scale, frontToBack) {
		this.canvas = canvasElement;
		this.context = this.canvas.getContext('2d');
		this.scaleFactor = toType(scale) == 'number' ? scale : 1.0;

		this.context.scale(this.scaleFactor, this.scaleFactor);

		this.frontToBack = frontToBack == undefined ? false : frontToBack;

		if (this.frontToBack) {
			this.context.globalCompositeOperation = 'destination-over';
		}

		this.secondCanvas = document.createElement('canvas');
		this.secondContext = this.secondCanvas.getContext('2d');
	}).methods({
		getWidth: function () {
			return this.canvas.width || 800;
		},
		getHeight: function () {
			return this.canvas.height || 600;
		},
		// draw Rect
		drawRect: function (x0, y0, x1, y1, color) {
			x0 = Math.floor(x0);
			y0 = Math.floor(y0);
			x1 = Math.floor(x1);
			y1 = Math.floor(y1);
			this.context.lineWidth = 2;
			this.context.strokeStyle = color.toString();
			this.context.strokeRect(x0, y0, x1 - x0, y1 - y0);
		},
		drawLine: function (x0, y0, x1, y1, color) {
			x0 = Math.floor(x0);
			y0 = Math.floor(y0);
			x1 = Math.floor(x1);
			y1 = Math.floor(y1);
			this.context.lineWidth = 2;
			this.context.strokeStyle = color.toString();
			this.context.beginPath();
			this.context.moveTo(x0, y0);
			this.context.lineTo(x1, y1);
			this.context.stroke();
		},
		// draw circle
		drawCircle: function (x, y, r, color) {
			this.context.lineWidth = 2;
			this.context.strokeStyle = color.toString();
			this.context.beginPath();
			this.context.arc(x, y, r, 0, Math.PI*2, true);
			this.context.stroke();
		},
		// 填充颜色的矩形
		// 如果指定两个颜色，则由上向下渐变
		drawFilledRect: function (x0, y0, x1, y1, color, color2) {
			if (this.calls ++ > this.maxCalls) return;
			this.context.save();
			if (color2 != undefined) {
				var gradient = this.context.createLinearGradient(0, y0, 0, y1);
				gradient.addColorStop(0, color.toString());
				gradient.addColorStop(0, color2.toString());
				this.context.fillStyle = gradient;
			} else {
				this.context.fillStyle = color.toString();
			}

			this.context.fillRect(x0, y0, x1-x0, y1 - y0);
			this.context.restore();
		},
		drawImage: function (imgW, x, y, angle, centered, alpha, tint, hFlipped) {
			if (this.calls++ > this.maxCalls) return;
			this.context.save();
			if (toType(alpha) == 'number' && alpha != 1) {
				this.context.globalAlpha = alpha;
			}
			this.context.translate(x, y);

			var halfWidth = Math.floor(imgW.textureWidth / 2);
			var halfHeight = Math.floor(imgW.textureHeight / 2);

			if (toType(angle) == 'number' && angle != 0) {
				if (!centered) {
					this.context.translate(halfWidth, halfHeight);
				}
				this.context.rotate(angle);
				this.context.translate(-halfWidth, -halfHeight);
			} else if (centered) {
				this.context.translate(-halfWidth, -halfHeight);
				x = -halfWidth;
				y = -halfHeight;
			}

			if (hFlipped) {
				//横向，沿y轴翻转
				x = -x;
				this.context.scale(-1, 1);
				this.context.translate(-imgW.textureWidth, 0);
				x -= imgW.textureWidth;
			}
			// offset of the image
			this.context.translate(imgW.offsetX, imgW.offsetY);
			x += imgW.offsetX;
			y += imgW.offsetY;

			if(!this.frontToBack) {
				this.drawEMBImage(imgW, x, y, angle !== 0, this.context);
			}

			//图片边缘混合色
			if (!!tint && tint.a != 0) {
				//在secondCanvas上画image，加上alpha通道
				//再画一个矩形覆盖在上面用tint的color来模拟边缘模糊效果
				this.secondContext.clearRect(0, 0, this.secondCanvas.width, this.secondCanvas.height);
				if (this.secondCanvas.width != imgW.width) {
					this.secondCanvas.width = imgW.width;
				}
				if (this.secondCanvas.height != imgW.height) {
					this.secondCanvas.height = imgW.height;
				}
				this.secondContext.save();

				this.drawEMBImage(imgW, 0, 0, false, this.secondContext);

				// 保留相交部分
				this.secondContext.globalCompositeOperation = 'source-in';
				this.secondContext.globalAlpha = tint.a > 1 ? tint.a/255 : tint.a;
				this.secondContext.fillStyle = tint.rgbString();
				this.secondContext.fillRect(0, 0, this.secondCanvas.width, this.secondCanvas.height);
				this.secondContext.restore();

				this.context.drawImage(this.secondCanvas, 0, 0);
			}

			if (this.frontToBack) {
				this.drawEMBImage(imgW, x, y, angle != 0, this.context);
			}

			this.context.restore();
		},
		scale: function (v) {
			return Math.ceil(v * this.scaleFactor) / this.scaleFactor;	   
		},
		drawEMBImage: function (imgW, x, y, angled, context) {
			if (!imgW.image.complete) return;
			if (this.scaleFactor !== 1 && !angled) {
				var xs = this.scale(x);
				var ys = this.scale(y);
				var xe = this.scale(x + imgW.width - xs);
				var ye = this.scale(y + imgW.height - ys);
				// drawImage 后面8个关于位置的参数，前4个是针对image的，后面四个是针对canvas的
				context.drawImage(imgW.image, imgW.x, imgW.y, imgW.width, imgW.height, xs-x, ys-y, xe, ye);
			} else {
				context.drawImage(imgW.image, imgW.x, imgW.y, imgW.width, imgW.height, 0, 0, imgW.width, imgW.height);
			}
		},
		// image text
		drawText: function (img, x, y, alpha, forced) {
			if (this.calls++ > this.maxCalls && !forced) return;
			this.context.save();
			if (toType(alpha) == 'number') {
				this.context.globalAlpha = alpha;
			}
			this.context.drawImage(img, x, y);
			this.context.restore();
		},
		// clear canvas
		// 如果指定了color，则在clear画布之后加上颜色
		clear: function (color) {
			this.calls = 0;
			this.context.clearRect(0, 0, this.canvas.width/this.scaleFactor, this.canvas.height/this.scaleFactor);
			!!color && this.drawFilledRect(0, 0, this.canvas.width/this.scaleFactor, this.canvas.height/this.scaleFactor, color.toString());
		},
		// 针对画布上已经分好的格子 画一系列的 image（平铺拼接）
		drawTilingImage: function (imgW, x, y, htiles, vtiles, alpha) {
			alpha = alpha == undefined ? 1 : alpha;
			this.context.save();
			if (alpha != 1) {
				this.globalAlpha = alpha;
			}
			for (var i = 0; i < htiles; i ++) {
				for (var j = 0; j < vtiles; j ++) {
					this.context.save();
					var xpos = x + imgW.textureWidth * i - imgW.textureWidth/2;
					var ypos = y + imgW.textureHeight * j - imgW.textureHeight/2;
					this.context.translate(xpos, ypos);
					this.drawEMBImage(imgW, xpos, ypos, false, this.context);
					this.context.restore();
				}
			}
			this.context.restore();
		},
		// 画n边形
		// @param verts {Array} 2n个元素数组，分别是n个点的xy坐标
		drawQuad: function (verts, color) {
			var i2 = verts.length - 2;
			for (var i = 0; i < verts.length; i += 2) {
				this.drawLine(verts[i], verts[i + 1], verts[i2], verts[i2 + 1], color);
				i2 = i;
			}
		},
		drawPoly: function (verts, color) {
			this.drawQuad(verts, color);		  
		},
		// n个三角形
		// @param verts {Array} 6n个元素数组，n个三角形的3个点的x,y坐标
		drawTris: function (verts, color) {
			assert(verts.length%6 !== 0, 'invalid points number');
			var n = verts.length / 6,
				i2;
			for (var v = 0; v < n; v += 6) {
				i2 = v + 4;
				for (var i = v; i < v + 6; i += 2) {
					this.drawLine(verts[i], verts[i + 1], verts[i2], verts[i2 + 1], color);
					i2 = i;
				}
			}
		},
		drawFillScreen: function (color) {
			if (this.calls ++ > this.maxCalls) return;
			this.context.fillStyle = color.toString();
			this.context.fillRect(0, 0, this.canvas.width/this.scaleFactor, this.canvas.height/this.scaleFactor);
		},
		// 纯文本
		drawSystemText: function (txt, x, y, color) {
			this.context.textAlign = 'left';
			this.context.fillStyle = color.toString();
			this.context.fillText(txt, x, y);
		},
		setScaleFactor: function (factor, reset) {
			if (!!reset) {
				this.context.scale(1/this.scaleFactor, 1/this.scaleFactor);
			}			
			this.scaleFactor = factor;
			this.context.scale(this.scaleFactor, this.scaleFactor);
			if (this.frontToBack) {
				this.context.globalCompositeOperation = 'destination-over';
			}
		},
		getContext: function () {
			return this.context;			
		},
		// http://tulrich.com/geekstuff/canvas/jsgl.js
		drawTriangleImage : function(image, xy, uv, tint) {
			var x0 = xy[0];
			var y0 = xy[1];
			var x1 = xy[2];
			var y1 = xy[3];
			var x2 = xy[4];
			var y2 = xy[5];
 
			var sx0 = uv[0];
			var sy0 = uv[1];
			var sx1 = uv[2];
			var sy1 = uv[3];
			var sx2 = uv[4];
			var sy2 = uv[5];
 
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(x0, y0);
			this.context.lineTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.closePath();
			this.context.clip();
 
			var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
			if (denom === 0) return;
 
			var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
			var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
			var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
			var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
			var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
			var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;
 
			this.context.transform(m11, m12, m21, m22, dx, dy);
			this.drawEMBImage(image, 0, 0, false, this.context);
			this.context.restore();
		},
		// image particle
		drawParticle: function (img, x, y, angle, scaleX, scaleY, alpha, color, additive) {
			if (this.calls ++ > this.maxCalls) return;
			this.context.save();
			this.context.translate(x, y);
			if (scaleX != 1 || scaleY != 1) {
				this.context.scale(scaleX, scaleY);
			}
			if (additive) {
				// 相交处颜色中和
				this.context.globalCompositeOperation = 'lighter';
			}
			this.drawImage(img, 0, 0, angle, true, alpha, null, false);
			this.context.restore();
		},
		drawCanvas: function (canvas, x, y) {
			if (this.calls ++ > this.maxCalls) return;
			this.drawImage(canvas, x, y);
		},
		drawLayer: function (layer, ox, oy, x, y, nx, ny) {
			var i, j, offset;
			if (layer instanceof TileLayer) {
				for (j = y; j < y + ny; j ++) {
					var previous = layer.previous(x, j),
						last = layer.index(x + nx - 1, j);
					var img, ix, iy, centered, flipped;
					for (i = previous + 1, offset = i * 5; i <= last; i ++) {
						if (this.calls ++ > this.maxCalls) continue;
						img = layer.tiles[offset++];
						ix = layer.tiles[offset++];
						iy = layer.tiles[offset++];
						offset ++;
						flipped = layer.tiles[offset++];
						// draw tile image
						var px = ox + ix + img.offsetX,
							py = oy + iy + img.offsetY,
							width = img.width,
							height = img.height;

						if (this.scaleFactor != 1) {
							px = this.scale(px);
							py = this.scale(py);
							width = this.scale(width);
							height = this.scale(height);
						}

						if (!flipped) {
							this.context.drawImage(img.image, img.x, img.y, img.width, img.height, px, py, width, height);
						} else {
							this.context.scale(-1, 1);
							this.context.drawImage(img.image, img.x, img.y, img.width, img.height, -(px + width), py, width, height);
							this.context.scale(-1, 1);
						}
					}
				}
			} else if (layer instanceof SpriteLayer) {
				var count = layer.count;
				for (i = 0; i < count; i ++) {
					offset = 4 * i;
					var minX = layer.rectangles[offset ++],
						minY = layer.rectangles[offset ++],
						maxX = layer.rectangles[offset ++],
						maxY = layer.rectangles[offset ++];

					if (maxX >= x && minX <= x + nx && maxY >= y && minY <= y + ny) {
						if (this.calls++ > this.maxCalls) continue;
						offset = 5 * i;
						img = layer.tiles[offset ++];
						ix = layer.tiles[offset ++];
						iy = layer.tiles[offset ++];
						centered = layer.tiles[offset ++];
						flipped = layer.tiles[offset ++];

						this.drawImage(img, ox + ix, oy + iy, 0, centered, 1, null, flipped);
					}
				}
			} else {
				assert(false);
			}
		},
		pushClipRect: function (rect) {
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(rect.x0, rect.y0);
			this.context.lineTo(rect.x0, rect.y1);
			this.context.lineTo(rect.x1, rect.y1);
			this.context.lineTo(rect.x1, rect.y0);
			this.context.lineTo(rect.x0, rect.y0);
			this.context.clip();
		},
		popClipRect: function () {
			this.context.restore();			 
		}
	});

	this.CanvasRender = CanvasRender;
    
    Laro.extend(this);
})
