/**
 * layer for render
 * {Class}
 */

Laro.register('.world', function (La) {
	var Class = La.base.Class || Laro.Class,
		assert = La.err.assert,
		Rectf = La.geometry.Rectf;

	// tiles 是一个list
	// 包含元组（imageW, x, y, centered, flipped）
	// *暂时要求为必须
	var Layer = Class(function (tiles) {
		if (tiles != undefined) {
			this.tiles = tiles;
			this.image = this.tiles[0].image;
			assert(this.count > 0, 'arguments of Layer is not enough');
		}	
	}).methods({
		count: function () {
			return this.tiles.length / 5;
		},
		// 获取当前layer 元组在layers list 的参数里的实际位置
		offset: function (i) {
			return i * 5;
		}
	});

	/**
	 * TileLayer
	 * 地图层
	 * @inherit from Layer
	 * tiles @param 用于组成tile 的元组
	 * indices @param {Array} 用于标记被分成每一小块地图的位置
	 * sx @param {Number} 横向tile的个数
	 * sy @param {Number} 纵向tile的个数
	 */
	var TileLayer = Layer.extend(function (tiles, indices, sx, sy) {
		assert(indices.length == sx * sy);
		this.indices = indices;
		this.sx = sx;
		this.sy = sy;
	}).methods({
		// 获取指定位置tile
		// i, j 都是从0 开始
		index : function (i, j) {
			return this.indices[i + this.sx * j];
		},
		// 获取对应tile的配置的位置
		tile: function (i, j) {
			var ind = j == null ? i : this.index(i, j);
			return ind == -1 ? -1 : ind * 5;
		},
		// 获取上一个指定位置的上一个tile
		previous: function (i, j) {
			if (i === 0) {
				return j == 0 ? -1 : this.index(this.sx - 1, j - 1)
			} else {
				return this.index(i - 1, j);
			}
		}
	});

	/**
	 * SpriteLayer
	 * 精灵层
	 * @inherit from Layer
	 * tiles @param {Array} tile 元组组成的list
	 * rectangles @param {Rect} 矩形边框
	 * rect @param {Rect}
	 */
	var SpriteLayer = Layer.extend(function (tiles, rectangles, rect) {
		assert(rect instanceof Rectf);
		this.rectangles = rectangles;
		this.rect = rect;
	});

	this.Layer = Layer;
	this.TileLayer = TileLayer;
	this.SpriteLayer = SpriteLayer;

    Laro.extend(this);
});
