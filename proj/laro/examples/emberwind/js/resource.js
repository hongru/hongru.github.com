//Emberwind.Resource
Laro.register('Emberwind', function (La) {
    var Class = La.Class;
    var Resource = Class(function (path) {
        if (!path) {
            path = 'resources/';
        }
        
        this.path = path;
        this.animations = [];
        this.imageSets = [];
        this.atlases = {};
		this.fonts = {};
        
        this.loadedAnimations = [];
        this.loadedImages = {};
    }).methods({

		init: function () {
			for (var k in g_data.resources.atlases) {
				if(g_data.resources.atlases[k].type == 'atlas') {
					this.atlases[k] = new La.Atlas(g_data.resources.atlases[k]);
				}
			}
		//	this.atlases = g_data.resources.atlases;
		//	console.log(this.atlases)
			this.imageSets = g_data.resources.imagesets;
			this.animations = g_data.resources.animations;
			this.stages = g_data.game.stages;

			for (var i = 0; i < g_data.resources.fonts.length; i ++) {
				var f = g_data.resources.fonts[i];
				this.fonts[f.id] = new La.Font(f);
			}

			!!this.callback && this.callback();
		},
		setCallback: function (cb) {
			this.callback = cb;
		},
		getFont: function (f) {
			return this.fonts[f];
		},
		getImage: function (setName, imageName) {
			var set = this.loadedImages[setName];
			if (!!set) {
				var image = set[imageName];
				if (image) return image
			}
			var imageset = this.loadImageset(setName);
			this.loadedImages[setName] = imageset;
			return imageset[imageName];
		},
		loadImageset: function (setName) {
			var is = null;
			for (var i in this.imageSets) {
				if (this.imageSets.hasOwnProperty(i)) {
					var isl = this.imageSets[i];

					if (isl.name == setName) {
						is = isl;
						break;
					}
				}
			}

			var atlas = this.atlases[is.atlas];
			var sources = atlas.sources[is.name];
		//	console.log(atlas)
			var filename = atlas.filename;

			var set = {};
			for (var f in is.frames) {
				if (is.frames.hasOwnProperty(f)) {
					var name = is.frames[f];
					var source = sources[f];
					//console.log(filename)
					set[name] = this.getEMBImage(source, filename);
				}
			}
			return set;
		},
		getEMBImage: function (source, filename) {
		    var width = source[2] - source[0] + 1;
  			var height = source[3] - source[1] + 1;
 
  			var xOffset = source[0] - source[4];
 			var yOffset = source[1] - source[5];
 
    		var textureWidth = xOffset + width + source[6] - source[2];
    		var textureHeight = yOffset + height + source[7] - source[3];
 
   			var image = La.ResourceLoader.getInstance().loadImage(filename);
    		return new La.EMBImage(image, source[0], source[1], width, height, xOffset, yOffset, textureWidth, textureHeight);
						 
		},
		getAnimation: function (index, callback, mirrored) {
			var a = this.loadedAnimations[index];
			if (a == undefined) {
				a = this.loadAnimation(index);
				this.loadedAnimations[index] = a;
			}
			if (a == null) return null;
			return new La.AnimationHandle(a, callback, mirrored);
		},
		loadAnimation: function (index) {
			var anim = null;
			if (typeof index == 'number') {
				anim = this.animations[index];
			} else {
				for (var i = 0; i < this.animations.length; i ++) {
					var at = this.animations[i];
					//console.log(at.name, index)
					if (at.name == index) {
						anim = at;
						break;
					}
				}
			}
			//console.log(anim)
			if (anim == null) return null;

			var atlas = this.atlases[anim.atlas];
			var sources = atlas.sources[anim.name];
			var image = La.ResourceLoader.getInstance().loadImage(atlas.filename);

			var frames = [];
   			for (var j = 0; j < sources.length; j++) {
        		var source = sources[j];
 
        		var width = source[2] - source[0];
        		var height = source[3] - source[1];
 
        		var xOffset = source[0] - source[4];
        		var yOffset = source[1] - source[5];
 
        		var textureWidth = xOffset + width + source[6] - source[2];
        		var textureHeight = yOffset + height + source[7] - source[3];
 
        		frames.push(new La.EMBImage(image, source[0], source[1], width, height, xOffset, yOffset, textureWidth, textureHeight));
    		}
    		return new La.Animation(anim, frames);
			
		}

    }).statics({
		getInstance: function () {
            if (!Resource.instance) {
                Resource.instance = new Resource(this.path);
                Resource.instance.init();
            }
            return Resource.instance;
        }	
	});

	this.Resource = Resource;

})
