/**
 * Laro Editor
 */
Laro.register('.$lea', function (La) {
	
	var pkg = this,
		loader = null,
		sourceObj = null;
	
	this.animations = {};
	
	var getAnimation = function (name, fromObj, useLoader,/*for test behind args*/ textureImg, createNew) {
		if (!fromObj) { fromObj = sourceObj }
		if (!useLoader) { useLoader = loader }
		if (!createNew && pkg.animations[name]) { return pkg.animations[name]; }
		
		var o = fromObj[name];
		if (o) {
			var info = o.info,
				data = o.data,
				filename = o.filename;
			
			var frames = [];
			var image = textureImg || useLoader.loadedImages[filename] || useLoader.loadImage(filename);
			for (var i = 0; i < data.length; i ++) {
				var source = data[i];
 
                var width = source[2] - source[0];
                var height = source[3] - source[1];
 
                var xOffset = source[0] - source[4];
                var yOffset = source[1] - source[5];
 
                var textureWidth = xOffset + width + source[6] - source[2];
                var textureHeight = yOffset + height + source[7] - source[3];
 
                frames.push(new Laro.ImageRegion(image, source[0], source[1], width, height, xOffset, yOffset, textureWidth, textureHeight));
			}
			var anim = new Laro.Animation(info, frames);
            pkg.animations[name] = new La.AnimationHandle(anim);
			
			return pkg.animations[name];
		}
		
	};
	
	this.getAnimation = getAnimation;
	
	this.setSourceObj = function (o) {
		sourceObj = o;
		this.sourceObj = o;
	};
	this.setLoader = function (l) {
		loader = l;
		this.loader = l;
	};
	
});