/**
 * Camera
 * 镜头的概念，用于控制同一场景中的背景移动
 */

(function (win, undefined) {
 
 	var Camera = Laro.Class(function (render) {
		this.x = 0;
		this.y = 0;
		this.render = render;
		this.width = render.width;
		this.height = render.height;
		this.objects = [];
	
	}).methods({
		//增加camera可控的物体或 layer
		//{
		//	name: ,
		//	texture: ,
		//	moveParam: 
		//}
		addObject: function (obj) {
			if (!(obj instanceof CameraObject)) {
				throw 'obj not instanceof CameraObject';
			}
			obj.host = this;
			this.objects.push(obj);
			return obj;
		},
		removeObject: function (name) {
			for (var i = 0; i < this.objects.length; i ++) {
				var obj = this.objects[i];
				if (obj.name === name) {
					return this.objects.splice(i, 1);
				}
			}
		},
		update: function (dt) {
			for (var i = 0; i < this.objects.length; i ++) {
				var obj = this.objects[i];
				obj.update && obj.update(dt);
			}
		},
		draw: function (render) {
			render = render || this.render;
			for (var i = 0; i < this.objects.length; i ++) {
				var obj = this.objects[i];
				obj.draw && obj.draw(render);
			}
		}

	
	}).statics({
		instance: null,
		getInstance: function (render) {
			if (!Camera.instance) {
				Camera.instance = new Camera(render);
			}
			return Camera.instance;
		}
	});

	var CameraObject = Laro.Class(function (name, texture, moveParam) {
		if (typeof name == 'string') {
			this.name = name;
			this.texture = texture;
			this.moveParam = moveParam;
		} else if (typeof name == 'object') {
			this.name = name.name;
			this.texture = name.texture;
			this.moveParam = name.moveParam;
		}
		this.host = null;
			
	}).methods({
		update: function (dt) {
			//todo
		},
		draw: function (render) {
			//todo
		}

	}).statics({
		
	});

	Laro.extend({ 
		Camera: Camera,
		CameraObject: CameraObject	
	});
 
 })(window)
