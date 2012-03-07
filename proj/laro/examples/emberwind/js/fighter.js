// fighter 
Laro.register('Emberwind', function (La) {
	var PKG = this;

	// Fighter States Class
	this.FG_Born = La.BaseState.extend().methods({
		enter: function (msg, fromState) {

			var state = {
				frames: 6,
				imgW: 372,
				imgH: 93,
				imgUrl: 'fighter/wait.gif',
				framerate: 10
			};
			this._t = 0;
			this.host.x = 200;
			this.host.y = 0;
			this.end = false;
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.end = this.host.check(this.host.x, this._t*this._t*1000);
			this.host.setPos(this.host.x, this._t*this._t*1000);
			this.animation.update(dt);
		},
		draw: function (render) {
			this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            this.end && this.host.fsm.setState(PKG.FG_states.wait);
		}
	});
	
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
			this._t = 0;
			this.onFloor = false;
			this._oldy = this.host.y;
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			var h = this._t*this._t*1000;
			//this.host.setPos(this.host.x, this.host.y+h);
			if (!this.onFloor && !this.host.check(this.host.x, this._oldy + h)) {
				this.host.y = this._oldy + h;
			} else {
				this.onFloor = true;
			}
			this.animation.update(dt)
		},
		draw: function (render) {
			this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            // 攻击优先级比 行动高
            //console.log(PKG.keyboard.keyStack)
            if (PKG.keyboard.keyStack.join('') == 'asdf') { 
				this.host.fsm.setState(PKG.FG_states.beforeWhirlKick);
				PKG.keyboard.resetKeyStack();
			}
            if (PKG.keyboard.key('a')) {
                this.host.fsm.setState(PKG.FG_states.lightBoxing);
            } else if (PKG.keyboard.key('k')) {
                this.host.fsm.setState(PKG.FG_states.lightKick);
            } else if (PKG.keyboard.key('right') && !PKG.keyboard.key('left')) {
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
			this._t = 0;
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			if (document.getElementById('camera-ck').checked && this.host.x > 500) {
				if (!this.host.check(this.host.x, this.host.y, PKG.cameraPos - dt*100)) {
					PKG.BGPOS -= dt*100;
					PKG.cameraPos -= dt*100;
					PKG.BGPOS2 -= dt*40;	
				}
				
			} else {
				var h = this._t*this._t*100;
				if (this.host.x < 770) {
					this.host.setPos(this.host.x + dt*100, this.host.y);
				}
			}
            
            this.animation.update(dt);
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (PKG.keyboard.key('a')) {
                this.host.fsm.setState(PKG.FG_states.lightBoxing);
            }
            if (PKG.keyboard.key('k')) {
                this.host.fsm.setState(PKG.FG_states.lightKick);
            }
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
			this._t = 0;
			this.animation = this.host.getAnimation(state);
			this.animation.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			if (document.getElementById('camera-ck').checked && this.host.x < 300 && PKG.cameraPos < 0) {
				if (!this.host.check(this.host.x, this.host.y, PKG.cameraPos + dt*100)) {
					PKG.BGPOS += dt*100;
					PKG.cameraPos += dt*100;
					PKG.BGPOS2 += dt*40;	
				}
				
			} else {
				if (!this.host.check(this.host.x, this.host.y + dt*200)) {
					this.host.y += dt*200;
				}
				if (this.host.x > 30) {
					this.host.setPos(this.host.x - dt*100, this.host.y);
				}
			}
            
            this.animation.update(dt);
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (PKG.keyboard.key('a')) {
                this.host.fsm.setState(PKG.FG_states.lightBoxing);
            }
            if (PKG.keyboard.key('k')) {
                this.host.fsm.setState(PKG.FG_states.lightKick);
            }
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
            this.jumpH = 170;
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
				PKG.fighter_sfx.footfall.play();
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
			if (document.getElementById('camera-ck').checked && this.host.x > 500 && PKG.keyboard.key('right')) {
				if (!this.host.check(this.host.x, this.host.y, PKG.cameraPos - dt*250)) {
					PKG.BGPOS -= dt*250;
					PKG.cameraPos -= dt*250;
					PKG.BGPOS2 -= dt*250*0.4;
				}
				
			} else {
				if (this.host.x < 770 && PKG.keyboard.key('right')) {
					this.host.setPos(this.host.x + dt*250, this.host.y);
				} 
			}
            
            var h = this.v0*this._t - this.g * Math.pow(this._t, 2) / 2;
			this.host.setPos(this.host.x, this._oldy-h);
            this.animation.update(dt);
            
			this._curJumpEnd = this.host.check(this.host.x, this._oldy-h);
			this._curJumpEnd && PKG.fighter_sfx.footfall.play();
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
			if (document.getElementById('camera-ck').checked && this.host.x < 300 && PKG.cameraPos < 0) {
				if (!this.host.check(this.host.x, this.host.y, PKG.cameraPos + dt*200)) {
					PKG.BGPOS += dt*200;
					PKG.cameraPos += dt*200;
					PKG.BGPOS2 += dt*200*0.4;
				}
				
			} else {
				if (this.host.x > 30) {
					this.host.setPos(this.host.x - dt*200, this.host.y);
				} 
			}

            var h = this.v0*this._t - this.g * Math.pow(this._t, 2) / 2;

			this.host.setPos(this.host.x, this._oldy - h);
            this.animation.update(dt);
			
			this._curJumpEnd = this.host.check(this.host.x, this._oldy - h);
			this._curJumpEnd && PKG.fighter_sfx.footfall.play();
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
    
    // 轻拳 
    this.FG_LightBoxing = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 3,
				imgW: 282,
				imgH: 91,
				imgUrl: 'fighter/RYU1_light_boxing.gif',
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
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._end) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    })
    
    // 轻腿 
    this.FG_LightKick = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 5,
				imgW: 580,
				imgH: 94,
				imgUrl: 'fighter/RYU1_light_kick.gif',
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
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._end) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    })
    
    // before whirlkick
    this.FG_BeforeWhirlKick = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 3,
				imgW: 213,
				imgH: 120,
				imgUrl: 'fighter/RYU1_before_whirl_kick.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play(false);
            this._t = 0;
            this._end = false;
			
			
			PKG.beforeJumpY = this.host.y;
		},
		leave: function () {
		
		},
		update: function (dt) {
            this._t += dt;
			this.host.y = PKG.beforeJumpY - 40;
            this.animation.update(dt);
            
            if (this._t >= this.animation.getLength()) {
                this._end = true;
            }
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._end) { 
                this.host.fsm.setState(PKG.FG_states.whirlKicking);
            } 
		}
    });
    this.FG_WhirlKicking = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 4,
				imgW: 608,
				imgH: 132,
				imgUrl: 'fighter/RYU1_whirl_kick.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play();
            this._t = 0;
            this._end = false;
			
			PKG.fighter_sfx.whirl_kick.play();
		},
		leave: function () {
		
		},
		update: function (dt) {
            this._t += dt;
            this.animation.update(dt);
			
			if (PKG.keyboard.key('right')) {
				if (document.getElementById('camera-ck').checked && this.host.x > 500) {
					if (!this.host.check(this.host.x, this.host.y, PKG.cameraPos - dt*160)) {
						PKG.BGPOS -= dt*160;
						PKG.cameraPos -= dt * 160;
						PKG.BGPOS2 -= dt*160*0.4;
					}
					
				} else {
					if (this.host.x < 770) {
						this.host.setPos(this.host.x + dt*160, this.host.y);
					}
				}
			} else if (PKG.keyboard.key('left')) {
				if (document.getElementById('camera-ck').checked && this.host.x < 300 && PKG.cameraPos < 0) {
					if (!this.host.check(this.host.x, this.host.y, PKG.cameraPos + dt*160)) {
						PKG.BGPOS += dt*160;
						PKG.cameraPos += dt*160;
						PKG.BGPOS2 += dt*160*0.4;
					}
					
				} else {
					if (this.host.x > 30) {
						this.host.setPos(this.host.x - dt*160, this.host.y);
					}
				}
			}
            
            if (this._t >= 3*this.animation.getLength()) {
                this._end = true;
            }
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._end) { 
                this.host.fsm.setState(PKG.FG_states.afterWhirlKick);
            } 
		}
    });
    this.FG_AfterWhirlKick = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var state = {
				frames: 5,
				imgW: 285,
				imgH: 132,
				imgUrl: 'fighter/RYU1_after_whirl_kick.gif',
				framerate: 10
			};
			this.animation = this.host.getAnimation(state);
			this.animation.play(false);
			this._oldy = this.host.y;
            this._t = 0;
            this._end = false;
		},
		leave: function () {
		},
		update: function (dt) {
            this._t += dt;
            this.animation.update(dt);
            
			var h = this._t * this._t * 1000;
            if (this.host.check(this.host.x, this._oldy+h)) {
				this._end = true;
			} else {
				this.host.y = this._oldy + h;
			}
		},
		draw: function (render) {
            this.animation.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
            if (this._end) { 
                this.host.fsm.setState(PKG.FG_states.wait);
            } 
		}
    });
	
    /* fighter states */
	var fStates = {
		born: 0,
		wait: 1,
		goForward: 2,
        goBack: 3,
        jump: 4,
        jumpForward: 5,
        jumpBack: 6,
        crouch: 7,
        standUp: 8,
        lightBoxing: 9,
        lightKick: 10,
        
        beforeWhirlKick: 11,
        whirlKicking: 12,
        afterWhirlKick: 13
        
	};
	var statesList = [
		fStates.born, PKG.FG_Born,
		fStates.wait, PKG.FG_Wait,
		fStates.goForward, PKG.FG_GoForward,
        fStates.goBack, PKG.FG_GoBack,
        fStates.jump, PKG.FG_Jump,
        fStates.jumpForward, PKG.FG_JumpForward,
        fStates.jumpBack, PKG.FG_JumpBack,
        fStates.crouch, PKG.FG_Crouch,
        fStates.standUp, PKG.FG_StandUp,
        fStates.lightBoxing, PKG.FG_LightBoxing,
        fStates.lightKick, PKG.FG_LightKick,
        
        fStates.beforeWhirlKick, PKG.FG_BeforeWhirlKick,
        fStates.whirlKicking, PKG.FG_WhirlKicking,
        fStates.afterWhirlKick, PKG.FG_AfterWhirlKick
	];
	
	this.FG_states = fStates;
	this.FG_statesList = statesList;
	
    /* Main fighter class */
	this.Fighter = La.Class(function(render, opt) {
		//console.log(render)
		opt = opt || {};
		this.render = render;
		this.fsm = new La.AppFSM(this, statesList);
		this.fsm.setState(PKG.FG_states.born);
		this.x = opt.x;
		this.y = opt.y;
		this.w = opt.w;
		this.h = opt.h;
		this._t = 0;
		
		this.lockX = 0; // 为1表示不能向前移动，-1表示不能向后
		this.lockY = 0; // 1表示不能向上， -1表示不能向下
		
		this.textures = {};

	}).methods({
		update: function (dt) {
			this.fsm.update(dt);

		},
		draw: function (render) {
			this.fsm.draw(render);
		},
		getAnimation: function (stateObj) {
			var anim = this.genAnimation(stateObj);
			return new La.AnimationHandle(anim); 
		},
		setPos: function (x, y, cameraPos) {
			if (this.check(x, y)) {
				return;
			} 

			if ((this.lockX == 1 && x > this.x) || (this.lockX == -1 && x < this.x)) {
				this.x = this.x;
			} else {
				this.x = x;
			}
			
			if ((this.lockY == -1 && y > this.y) || (this.lockY == 1 && y < this.y)) {
				this.y = this.y;
			} else {
				this.y = y;
			}
			
			if (cameraPos != undefined) {
				PKG.cameraPos = cameraPos;
			}
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
		},
		// 检测 将要到达的位置是否可用
		// 用矩形 overlaps 交叠判断
		check: function (x, y, cameraPos) {
			if (cameraPos == undefined) {  
				cameraPos = PKG.cameraPos;
			}
			this.lockX = 0;
			this.lockY = 0;
			
			var fighterRect = new Laro.Rectf(x-this.w/2+8, y-this.h/3, x+this.w/2-2, y+this.h/3);
			var bks = g_data.game.stage1.blocks;
			var unitW = g_data.game.stage1.unitW;
			var unitH = g_data.game.stage1.unitH;
			var oo = PKG.getBlockNumToShow();
			
			for (var i = 0; i < bks.length; i ++) {
				var row = bks[i];
				for (var j = oo.from; j < oo.to; j ++) {
					var scrX = j*unitW + cameraPos,
						scrY = this.render.getHeight() - (i + 1)*unitH;
					if (row[j]) {
						var bkRect = new Laro.Rectf(scrX, scrY, scrX + unitW-1, scrY + unitH-1);
					
						if (fighterRect.overlaps(bkRect)) { 
							this._t = 0;
							/*if (bkRect.contains(fighterRect.x1, (fighterRect.y1 - fighterRect.height/2))) {this.lockX = 1}
							if (bkRect.contains(fighterRect.x0, (fighterRect.y1 - fighterRect.height/2))) {this.lockX = -1}
							if (bkRect.contains((fighterRect.x0 + fighterRect.width/2), fighterRect.y1)) {this.lockY = -1}
							if (bkRect.contains((fighterRect.x0 + fighterRect.width/2), fighterRect.y0)) {this.lockY = 1}*/
							
							return true;
						}
					}
				}
			}
			return false;
			
		}
	}).statics({
		getInstance: function (render, opt) {
			if (PKG.Fighter.instance == null) {
				PKG.Fighter.instance = new PKG.Fighter(render, opt);
			}
			return PKG.Fighter.instance;
		},
		instance: null
	});
	

})