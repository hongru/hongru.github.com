/**
 * base class of resource
 */

Laro.register('.game', function (La) {
	var Class = La.base.Class,
		assert = La.err.assert,
		toType = La.toType,
		Pixel32 = La.geometry.Pixel32;

	/**
	 * 地图集资源
	 * 集合通过游戏的json文件输出的资源列表
	 * @param obj {Object} 配置json 对象
	 */
	var Atlas = Class(function (obj) {
		this.name = obj.name;
		this.filename = obj.filename;
		this.sources = {};

		for (var k in obj.sources) {
			if (obj.sources.hasOwnProperty(k)) {
				var s = obj.sources[k];
				this.sources[s.name] = s.data;
			}
		}
	});

	var checkFile = function (s) {
		var suffix = s.lastIndexOf('.');
		suffix = s.substr(suffix);
		if (/png|jpg|jpeg|gif|bmp/.test(suffix)) {
			return 'image';
		} else if (/ogg|mp3|m4a|wav/.test(suffix)) {
			return 'sound';
		}
	}
	var isImage = function (s) {
		return (checkFile(s) == 'image');
	}
	var isSound = function (s) {
		return (checkFile(s) == 'sound');
	}

	/**
	 * ResourceLoader
	 * {Class}
	 * 主要是image的loader
	 */
	var ResourceLoader = Class(function (path) {
		// imagePath 资源主路径，可配置
		this.imagePath = path || 'resources/';
		this.basePath = this.imagePath;
		this.loadedImages = {};	
		this.loadedSounds = {};

	}).methods({

		// 加载一张图片
		loadImage: function (fileName) {
			var image = this.loadedImages[fileName];
			if (!!image) {
				return image;
			}

			image = new Image();
			image.src = this.imagePath + fileName;
			this.loadedImages[fileName] = image;
			return image;
		},
		// 预加载多张图片
		preloadImages: function (fileNames, callback) {
			var imagesLoaded = 0,
				_fileNames = [],
				ind = -1,
				args = arguments;

			if (toType(fileNames) == 'array') {
				_fileNames = fileNames;
			} else {
				while(toType(args[++ind]) == 'string') {
					_fileNames.push(args[ind]);
				}
				callback = args[ind];
			}

			var length = _fileNames.length;
			var callCallback = function (arg) {
				!!callback && callback(arg);
			};
			var imageLoaded = function () {
				imagesLoaded ++;
				// 传一个 已加载 和 资源总数的比例进去，以便计算加载进度
				callCallback(imagesLoaded/length);
			};
			var imageError = function () {
				console.log('an image load error');
			};

			for (var i = 0; i < length; i ++) {
				var fileName = _fileNames[i],
					image = this.loadedImages[fileName];
				if (image != undefined) {
					imagesLoaded ++;
					continue;
				}

				image = new Image();
				image.src = this.imagePath + fileName;
				image.onload = imageLoaded;
				image.onerror = imageError;
				this.loadedImages[fileName] = image;
			}

			callCallback(imagesLoaded / length);
		},
		// 预加载多个资源，包括图片和音乐等
		preload: function (files, callback) {
			var fileLoaded = 0,
				_fileNames = [],
				ind = -1,
				args = arguments;

			if (toType(files) == 'array') {
				_fileNames = files;
			} else {
				while(toType(args[++ind]) == 'string') {
					_fileNames.push(args[ind]);
				}
				callback = args[ind];
			}

			var length = _fileNames.length;
			var callCallback = function (arg) {
				!!callback && callback(arg);
			}
			var fileLoadedCB = function () {
				fileLoaded ++;
				callCallback(fileLoaded/length);
			};
			
			for (var i = 0; i < length; i ++) {
				// 先检查是否已经加载
				var filename = _fileNames[i];
				if (isImage(filename)) {
					var image = this.loadedImages[filename];
					if (!!image) {
						fileLoaded ++;
						continue;
					}
					image = new Image();
					image.src = this.basePath + filename;
					image.onload = fileLoadedCB;
					image.onerror = fileLoadedCB;
					this.loadedImages[filename] = image;
				} else if (isSound(filename)) {
					var sound = this.loadedSounds[filename];
					if (!!sound) {
						fileLoaded ++;
						continue;
					}
					sound = new La.Sound(this.basePath + filename, fileLoadedCB);
					this.loadedSounds[filename] = sound;
				}
			}

			callCallback(fileLoaded/length);
		}
	}).statics({
        //获取当前实例
		getInstance: function () {
			if (ResourceLoader.instance === null) {
				ResourceLoader.instance = new ResourceLoader(this.imagePath);
			}
			return ResourceLoader.instance;
		},
		instance: null	
	});

	// Game Tile
	var Tile = Class(function (image, shapes, index, name) {
		name = name == undefined ? null : name;
		this.image = image;
		this.shapes = shapes;
		this.index = index;
		this.name = name;
	});

	// Game Font define
	var Font = Class(function (f) {
		this.baseColor = new Pixel32(f.base_r, f.base_g, f.base_b);
		this.outlineColor = new Pixel32(f.outline_r, f.outline_g, f.outline_b);
		this.size = f.size;
		this.font = f.font;
		this.outline = f.outline;
	}).methods({
		getFont: function () {
			var ret = [];
			ret.push('normal');
			ret.push(this.size + 'px');
			ret.push(this.font);
			return ret.join(' ');
		},
		/**
		 * 生成一个显示文字的canvas
		 * @param text {String}
		 * @param wrapWidth {Number} 一行文字宽度，超过则换行
		 */
		generateCanvas: function (text, wrapWidth) {
			var canvas = document.createElement('canvas'),
				c = canvas.getContext('2d');
			c.font = this.getFont();

			var outline = this.outline * 2;
			if (wrapWidth != undefined) {
				text = this.wrapText(c, text, wrapWidth);
				canvas.width = c.measureText(text).width + 8 + outline * 2; // 默认的文字都要有一定的margin
				canvas.height = (this.size + outline*4) * text.split('\n').length;
			} else {
				canvas.width = c.measureText(text).width + 8 + outline * 2;
				canvas.height = this.size + outline * 4;
			}

			c.fillStyle = this.baseColor.toString();
			c.textBaseline = 'middle';
			c.textAlign = 'left';
			c.font = this.getFont();

			if (outline != 0) {
				c.strokeStyle = this.outlineColor.toString();
				c.lineWidth = outline;
				c.strokeText(text, outline, this.size/2 + outline * 2);
			}

			c.fillText(text, outline, this.size/2 + outline*2);
			return canvas;
		},
		wrapText: function (c, text, width) {
			var result = '',
				parts = text.split(' '),
				i = 0;
			while (i < parts.length) {
				if (c.measureText(result + parts[i]).width >= width) {
					result += '\n' + parts[i];
				} else if (i != 0) {
					result += ' ' + parts[i];
				} else {
					result += parts[i];
				}
				i ++;
			}
			return result;
		}
	});

	this.Atlas = Atlas;
	this.ResourceLoader = ResourceLoader;
	this.Tile = Tile;
	this.Font = Font;
    
    // copy to Laro namespace
    Laro.extend(this);
})
