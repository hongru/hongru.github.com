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
            if (this.host.x == undefined) { this.host.x = render.getWidth()/2 }
            if (this.host.y == undefined) { this.host.y = render.getHeight() - 60 }
            
			this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (PKG.keyboard.key('right') && !PKG.keyboard.key('left')) {
                this.host.fsm.setState(PKG.FG_states.goForward);
            } else if (PKG.keyboard.key('left') && !PKG.keyboard.key('right')) {
                this.host.fsm.setState(PKG.FG_states.goBack);
            } else if (PKG.keyboard.key('up') && PKG.keyboard.key('right')) {
                this.host.fsm.setState(PKG.FG_states.jumpForward)
            } else if (PKG.keyboard.key('up') && PKG.keyboard.key('left')) {
                this.host.fsm.setState(PKG.FG_states.jumpBack)
            } else if (PKG.keyboard.key('up')) {
                this.host.fsm.setState(PKG.FG_states.jump)
            } else if (PKG.keyboard.key('down')) {
                this.host.fsm.setState(PKG.FG_states.crouch)
            }
            
		}
	});
	
    // 向右前进
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
            this.host.x += (dt*100);
            this.animation.update(dt);
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (!PKG.keyboard.key('right')) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } else if (PKG.keyboard.key('right') && PKG.keyboard.key('up')) {
                this.host.fsm.setState(PKG.FG_states.jumpForward)
            } else if (PKG.keyboard.key('down')) {
                this.host.fsm.setState(PKG.FG_states.crouch)
            }
		}
	});
    
    //面向右后退
    this.FG_GoBack = La.BaseState.extend(function () {
    
    }).methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 6,
				imgW: 378,
				imgH: 91,
				imgUrl: 'fighter/RYU1_goBack.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
            this.host.x -= (dt*100);
            this.animation.update(dt);
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (!PKG.keyboard.key('left')) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } else if (PKG.keyboard.key('left') && PKG.keyboard.key('up')) {
                this.host.fsm.setState(PKG.FG_states.jumpBack)
            } else if (PKG.keyboard.key('down')) {
                this.host.fsm.setState(PKG.FG_states.crouch)
            }
		}
    });
    
    // 向上跳
    this.FG_Jump = La.BaseState.extend(function () {
    
    }).methods({
        enter: function (msg, fromState) {
            this._oldx = this.host.x;
            this._oldy = this.host.y;
            
            this._curJumpEnd = false;
            this._t = 0;
                        
            var state = {
				frames: 2,
				imgW: 114,
				imgH: 109,
				imgUrl: 'fighter/RYU1_jump_down.gif',
				framerate: 3
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play(false);
            
            // 跳起高度和跳起时间
            // 根据物理公式 v0*t - g*t^2/2 = h 
            // 和 v0 = g*t 就可以算出 重力加速度以及每个dt 人物跳起的高度
            this.jumpH = 140;
            this.jumpT = this.animation.getLength()/2;
            // 上面已知了 h 和 t 可以算的 v0 和 g 
            this.g = 2*this.jumpH / Math.pow(this.jumpT, 2);
            this.v0 = this.g * this.jumpT;
            
		},
		leave: function () {
		
		},
		update: function (dt) {
            this._t += dt;
            this.animation.update(dt);
            
            var h = this.v0*this._t - this.g * Math.pow(this._t, 2) / 2;
            this.host.y = this._oldy - h;
            
            if (this._t >= this.animation.getLength()) {
                this.host.y = this._oldy;
                this._curJumpEnd = true;
            }
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._curJumpEnd) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    })
    
    // 向前跳
    this.FG_JumpForward = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 8,
				imgW: 464,
				imgH: 109,
				imgUrl: 'fighter/RYU1_jumpUp.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play(false);
            
            // 弹跳info
            this.jumpH = 140;
            this.jumpT = this.animation.getLength()/2;
            // 上面已知了 h 和 t 可以算的 v0 和 g 
            this.g = 2*this.jumpH / Math.pow(this.jumpT, 2);
            this.v0 = this.g * this.jumpT;
            
            this._t = 0;
            this._oldy = this.host.y;
            this._curJumpEnd = false;
		},
		leave: function () {
		
		},
		update: function (dt) {
            this._t += dt;
            this.host.x += (dt*250);
            var h = this.v0*this._t - this.g * Math.pow(this._t, 2) / 2;
            this.host.y = this._oldy - h;
            this.animation.update(dt);
            
            if (this._t >= this.animation.getLength()) {
                this._curJumpEnd = true;
                this.host.y = this._oldy;
            }
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._curJumpEnd) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    });
    
    // 向后跳
    this.FG_JumpBack = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 9,
				imgW: 1116,
				imgH: 109,
				imgUrl: 'fighter/RYU1_jump_back.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play(false);
            
            // 弹跳info
            this.jumpH = 140;
            this.jumpT = this.animation.getLength()/2;
            // 上面已知了 h 和 t 可以算的 v0 和 g 
            this.g = 2*this.jumpH / Math.pow(this.jumpT, 2);
            this.v0 = this.g * this.jumpT;
            
            this._t = 0;
            this._oldy = this.host.y;
            this._curJumpEnd = false;
		},
		leave: function () {
		
		},
		update: function (dt) {
            this._t += dt;
            this.host.x -= (dt*200);
            var h = this.v0*this._t - this.g * Math.pow(this._t, 2) / 2;
            this.host.y = this._oldy - h;
            this.animation.update(dt);
            
            if (this._t >= this.animation.getLength()) {
                this._curJumpEnd = true;
                this.host.y = this._oldy;
            }
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y-20, 0, 1, null);
		},
		transition: function () {
            if (this._curJumpEnd) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    })
    
    // 蹲下
    this.FG_Crouch = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 1,
				imgW: 63,
				imgH: 83,
				imgUrl: 'fighter/RYU1_crouch.gif',
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
            this.animation.draw(render, this.host.x, this.host.y+10, 0, 1, null);
		},
		transition: function () {
            if (!PKG.keyboard.key('down')) { 
                this.host.fsm.setState(PKG.FG_states.standUp);
            } 
		}
    });
    
    // 站起
    this.FG_StandUp = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 3,
				imgW: 189,
				imgH: 83,
				imgUrl: 'fighter/RYU1_stand_up.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play(false);
            this._t = 0;
            this._end = false;
		},
		leave: function () {
		
		},
		update: function (dt) {
            this._t += dt;
            this.animation.update(dt);
            
            if (this._t >= this.animation.getLength()) {
                this._end = true;
            }
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y+10, 0, 1, null);
		},
		transition: function () {
            if (this._end) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    });
	
    /* fighter states */
	var fStates = {
		wait: 0,
		goForward: 1,
        goBack: 2,
        jump: 3,
        jumpForward: 4,
        jumpBack: 5,
        crouch: 6,
        standUp: 7
	};
	var statesList = [
		fStates.wait, PKG.FG_Wait,
		fStates.goForward, PKG.FG_GoForward,
        fStates.goBack, PKG.FG_GoBack,
        fStates.jump, PKG.FG_Jump,
        fStates.jumpForward, PKG.FG_JumpForward,
        fStates.jumpBack, PKG.FG_JumpBack,
        fStates.crouch, PKG.FG_Crouch,
        fStates.standUp, PKG.FG_StandUp
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