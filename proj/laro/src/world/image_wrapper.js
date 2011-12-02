/**
 * Image Wrapper
 * 给图片加上包装，增加一些额外的参数来使用
 */

Laro.register('.texture', function (La) {
	var assert = La.err.assert,
		Class = La.base.Class || la.Class;

	/**
	 * 定义一个图片的部分区域
	 * param {Image} htmlImageElement
	 * param {number} 所要使用的region的x坐标
	 * param {number} region的y坐标
	 * param {number} region 宽
	 * param {number} region 高
	 * param {number} x 方向padding值
	 * param {number} y 方向padding
	 * param {number} 所要使用这个区域的目标宽度
	 * param {number} 目标高度
	 */
	var ImageRegion = Class(function (image, x, y, width, height, offsetX, offsetY, textureW, textureH) {
		assert(image instanceof HTMLImageElement || image instanceof HTMLCanvasElement, 'invalid image');
		this.image = image;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.offsetX = offsetX == null ? 0 : offsetX;
		this.offsetY = offsetY == null ? 0 : offsetY;
		this.textureWidth = textureW == null ? width : textureW;
		this.textureHeight = textureH == null ? height : textureH;
		this.hasPadding = (offsetX > 0) || (offsetY > 0) || (textureW > width) || (textureH > height);
	}).methods({
		getImageWidth : function () {
			return this.image.width;
		},
		getImageHeight: function () {
			return this.image.height;
		}
	});

	this.ImageRegion = ImageRegion;
    this.EMBImage = ImageRegion;
    
    Laro.extend(this);
		
})
