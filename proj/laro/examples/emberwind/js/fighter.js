// fighter 
Laro.register('Emberwind', function (La) {
	var PKG = this;

	// Fighter States Class
	this.FG_Wait = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
			//alert('FG-wait')
			//console.log(this.host)
			var state = {
				frames: 6,
				imgW: 372,
				imgH: 93,
				imgUrl: 'fighter/wait.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
			this.animation.update(dt)
		},
		draw: function (render) {
			this.animation.draw(render, render.getWidth() / 2, render.getHeight() - 60, 0, 1, null);
		},
		transition: function () {
            if (PKG.keyboard.key('right')) {
                this.host.fsm.setState(PKG.FG_states.goForward);
            } 
		}
	});
	
	this.FG_GoForward = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
            var state = {
				frames: 6,
				imgW: 396,
				imgH: 92,
				imgUrl: 'fighter/goForward.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
            this.animation.update(dt);
		},
		draw: function (render) {
            this.animation.draw(render, render.getWidth() / 2, render.getHeight() - 60, 0, 1, null);
		},
		transition: function () {
            if (!PKG.keyboard.key('right')) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
	});
	
    /* fighter states */
	var fStates = {
		wait: 0,
		goForward: 1
	};
	var statesList = [
		fStates.wait, PKG.FG_Wait,
		fStates.goForward, PKG.FG_GoForward
	];
	
	this.FG_states = fStates;
	this.FG_statesList = statesList;
	
    /* Main fighter class */
	this.Fighter = La.Class(function(render) {
		//console.log(render)
		this.fsm = new La.AppFSM(this, statesList);
		this.fsm.setState(PKG.FG_states.wait);
		
		this.textures = {};

	}).methods({
		update: function (dt) {
			this.fsm.update(dt)
		},
		draw: function (render) {
			this.fsm.draw(render);
		},
		getAnimation: function (stateObj) {
			var anim = this.genAnimation(stateObj);
			return new La.AnimationHandle(anim); 
		},
		genAnimation: function (state) {
			var image = La.ResourceLoader.getInstance().loadImage(state.imgUrl);
			var cData = this.createAnimData(state);
			this.animData = cData.data;
			this.animInfo = cData.info;
			
			var frames = [];
			for (var i = 0; i < this.animData.data.length; i ++) {
				var source = this.animData.data[i];
				
				var width = source[2] - source[0];
				var height = source[3] - source[1];
		 
				var xOffset = source[0] - source[4];
				var yOffset = source[1] - source[5];
		 
				var textureWidth = xOffset + width + source[6] - source[2];
				var textureHeight = yOffset + height + source[7] - source[3];
				
			   // console.log(textureWidth, textureHeight);
				
				frames.push(new Laro.ImageRegion(image, source[0], source[1], width, height, xOffset, yOffset, textureWidth, textureHeight));

			}
			
			return new Laro.Animation(this.animInfo, frames);
		},
		createAnimData: function (state) {
			var info = {
				"nbrOfFrames": 0,
				"pivoty": 60,
				"framerate": 60,
				"pivotx": 30,
				"events": []
			};
			var data = {
				"data": [],
				"filename": ''
			};
			var unitW = state.imgW/state.frames,
				unitH = state.imgH;
			for (var i = 0; i < state.frames; i ++) {
				var imgX1 = i * unitW,
					imgY1 = 0,
					imgX2 = imgX1 + unitW,
					imgY2 = unitH;
					
				var coord = [imgX1, imgY1, imgX2, imgY2, imgX1, imgY1, imgX2, imgY2];
				data['data'].push(coord);
			}
			
			data['filename'] = state.imgUrl;
		
			info['nbrOfFrames'] = data['data'].length;
			if (state.framerate != undefined) { info['framerate'] = state.framerate }
			
			return {
				data: data,
				info: info
			};	
		}
	}).statics({
		getInstance: function (render) {
			if (PKG.Fighter.instance == null) {
				PKG.Fighter.instance = new PKG.Fighter(render);
			}
			return PKG.Fighter.instance;
		},
		instance: null
	});
	

})