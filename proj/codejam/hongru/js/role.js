/* 人物Role */
Laro.register('PD', function (La) {

	// 人物state Class
	this.R_Wait = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('role_wait');
			
			this.anim.play();
			this._t = 0;
			this.length = this.anim.getLength();
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);
			if (this._t > this.length) {
				this.checkNearMonster();
			}
			
		},
		checkNearMonster: function () {
			var hasNear = false;
			var mm = null;
			for (var i = 0; i < PD.$monsters.length; i ++) {
				var mo = PD.$monsters[i];
				if (mo.dead) {
					break;
				}
				var dis = Math.sqrt(Math.pow(this.host.x - mo.x, 2) + Math.pow(this.host.y - mo.y, 2));
				if (dis < 100) {
					mo.setState(3, {
						attack: 30
					});
					//mo.x += ((this.host.x > mo.x) ? -40 : 40);
					hasNear = true;
					mm = mo;
				}
			}
			if (hasNear) {
				PD.roleFaceRight = (this.host.x < mm.x);
				this.host.setState(3, mm);
			}
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			PD.startMove && this.host.setState(1);
		}
	});
	
	this.R_Run = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('role_run');
			this.anim.play();
			this._t = 0;
			this.speed = 5;
			this.dis = 0;
		},
		leave: function () {
		
		},
		update: function (dt) {
			this.speed = 200*dt;
			this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);
			
			this.dis = Math.sqrt(Math.pow(PD.pieX - this.host.x, 2) + Math.pow(PD.pieY - this.host.y, 2));
			
			//var angle = Math.atan((PD.MOUSEDOWN_X - this.host.x)/(PD.MOUSEDOWN_Y - this.host.y));
			var spy = this.speed*(PD.pieY - this.host.y)/this.dis;
			var spx = this.speed*(PD.pieX - this.host.x)/this.dis;
			
			this.host.x += spx;
			if (this.host.y + spy < 168) {
				this.host.y = 168;
			} else {
				this.host.y += spy;
			}
			this.host.checkSprite.setPos(this.host.x, this.host.y);
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this.dis <= 4 || Math.abs(this.host.x-PD.pieX) <= 2) {
				this.host.setState(0);
				PD.startMove = false;
				PD.showCircle = false;
			}
		}
	});
	
	this.R_Attacked = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('role_attacked');
			this.anim.play(false);
			this.length = this.anim.getLength();
			this._t = 0;
			this.host.nowLife -= msg.attack;
			this.host.nowLife = this.host.nowLife >=0 ? this.host.nowLife : 0;
			PD.roleFaceRight = msg.roleFace;
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if(!this.host.nowLife){
				this.host.setState(4);
			}
			if (this._t > this.length) {
				this.host.setState(0);
			}
		}
	});
	
	// 普通攻击
	this.R_Attack = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) { 
			this.anim = this.host.getAnimation('role_attack');
			this.anim.play(false);
			this._t = 0;
			this.length = this.anim.getLength();
			this.msg = msg;

			this.music = PD.$res.getSound('OGG/role_attack.ogg');
			this.music.setVolume(0.2);
            this.music.play('default', false);

		},
		leave: function () {
			this.music.pause();
		},
		update: function (dt) {
			this._t += dt;
			this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);
			if (this.anim.currentFrame == 2) {
				this.msg.x += ((this.host.x > this.msg.x) ? -5 : 5);
			}
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this._t > this.length) {
				this.host.setState(0);
			}
		}
	});
	
	// 技能1
	this.R_Skill1 = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			console.log('skill1');
			if(this._t){return};
			this.anim = this.host.getAnimation('skillAnim1');
			this.anim.play(false);
			this.length = this.anim.getLength();
			this._t = 0;

			this.music = PD.$res.getSound('OGG/role_skill1.ogg');
			this.music.setVolume(0.3);
            this.music.play('default', false);
		},
		checkNear: function () {
			var mm = null;
			for (var i = 0; i < PD.$monsters.length; i ++) {
				var mo = PD.$monsters[i];
				if (mo.dead) {
					break;
				}
				var dis = Math.sqrt(Math.pow(this.host.x - mo.x, 2) + Math.pow(this.host.y - mo.y, 2));
				if (dis < 100) {
					mo.setState(3, {
						attack: 130,
						offset: ((this.host.x > mo.x) ? -200 : 200)
					});
					//mo.x += ((this.host.x > mo.x) ? -40 : 40);
					hasNear = true;
					mm = mo;
				}
			}
		},
		leave: function () {
			this.music.pause();
		},
		update: function (dt) {
			this._t += dt;
			this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);
			
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this._t >= this.length) {
				this._t = 0;
				this.checkNear();
				this.host.setState(0);
			}
		}
	});	

	//  技能2
	this.R_Skill2 = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			if(this._t){return};
			console.log('skill2');
			this.anim = this.host.getAnimation('skillAnim2');
			this.anim.play(false);
			this.length = this.anim.getLength();
			this._t = 0;

			this.music = PD.$res.getSound('OGG/role_skill2.ogg');
			this.music.setVolume(0.3);
            this.music.play('default', false);
		},
		checkNear: function () {
			var mm = null;
			for (var i = 0; i < PD.$monsters.length; i ++) {
				var mo = PD.$monsters[i];
				if (mo.dead) {
					break;
				}
				var dis = Math.sqrt(Math.pow(this.host.x - mo.x, 2) + Math.pow(this.host.y - mo.y, 2));
				if (dis < 100) {
					mo.setState(3, {
						attack: 130,
						offset: ((this.host.x > mo.x) ? -200 : 200)
					});
					//mo.x += ((this.host.x > mo.x) ? -40 : 40);
					hasNear = true;
					mm = mo;

					//补血
					this.host.nowLife += 80;
				}
			}
		},
		leave: function () {
			this.music.pause();
		},
		update: function (dt) {
			this._t += dt;
			this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);

			if(this.anim.currentFrame == 3){
				this.checkNear();
			}
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this._t >= this.length) {
				this._t = 0;
				this.host.setState(0);
			}
		}
	});	
	
	this.R_BigSkill = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			console.log('S');
			this.anim = this.host.getAnimation('role_sskill');
			this.anim.play(false);
			this.length = this.anim.getLength();
			this._t = 0;
			this.pos = 0;
			
			for (var i = 0; i < PD.$monsters.length; i ++) {
				var mo = PD.$monsters[i];
				mo.setState(3, {
					attack: 300,
					offset: ((this.host.x > mo.x) ? -200 : 200)
				})
			}
		},

		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
		//	this.anim.renderMirrored = !PD.roleFaceRight;
			this.anim.update(dt);
			this.pos += 200*dt;
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
			render.drawImage(PD.textures['skill_rain'], this.host.x - 100, this.host.y - 250 + this.pos, 0,1,1, false, false);
		},
		transition: function () {
			if (this._t > 3) {
				this.host.setState(0);
			}
		}
	})
	
	// 人物 statesList
	var statesList = [
		0, this.R_Wait,
		1, this.R_Run,
		2, this.R_Attacked,
		3, this.R_Attack,
		4, this.R_Skill1,
		5, this.R_Skill2,
		6, this.R_BigSkill
	]
	
	this.Role = La.Class(function (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width || 106;
		this.height = height || 128;
		this.bloodBarW = 150;
		this.bloodBarH = 10;
		
		this.life = 1000;
		this.nowLife = 1000;
		
		this.animHash = {};
		
		this.fsm = new La.AppFSM(this, statesList);
		
		// 生成一个 标识 人物范围的 sprite
		this.checkSprite = new La.$sprite(PD.stage.ctx, function () {
			this.x = x - 53;
			this.y = y-128;
			this.width = 106;
			this.height = 128;
			this.draw = function () {
			/*	this.ctx.beginPath();
				this.ctx.rect(0, 0, this.width, this.height);
				this.ctx.closePath();
				this.ctx.strokeStyle = 'black';
				this.ctx.stroke(); */
			};
			this.setPos = function (x, y) {
				this.x = x - 53;
				this.y = y-128;
			}
		});
		PD.stage.addChild(this.checkSprite);
		this.checkSprite.addEventListener('mousedown', function (x, y) {
			if (PD.mouseOnIcon) {return}
			PD.roleMousedown = true;
			PD.showCircle = true;
		});
		this.checkSprite.addEventListener('touchstart', function (x, y) {
			if (PD.mouseOnIcon) {return }
			PD.roleMousedown = true;
			PD.showCircle = true;
		});
		//this.checkSprite.addEventListener('mouseup', function () { PD.roleMousedown = false });
		//this.checkSprite.addEventListener('touchend', function () { PD.roleMousedown = false });
		

	}).methods({
		setState: function (state, msg) {
			this.fsm.setState(state, msg);
		},
		update: function (dt) {
			this.fsm.update(dt);
		},
		draw: function (render) {
			
			PD.showCircle && this.drawCircle(render);
			this.fsm.draw(render);
			this.drawBloodBar(render);
		},
		drawBloodBar: function (render) {
			var ctx = render.context;
			ctx.save();
			ctx.globalAlpha = 0.7;
			ctx.fillStyle = '#000';
			ctx.fillRect(this.x - this.bloodBarW/2-2, this.y-this.height-20-2, this.bloodBarW+4, this.bloodBarH+4);
			
			ctx.fillStyle = 'green';
			ctx.fillRect(this.x - this.bloodBarW/2, this.y-this.height-20, this.bloodBarW*this.nowLife/this.life, this.bloodBarH)
			ctx.restore();
		},
		drawCircle: function (render) {
			render.drawImage(PD.textures['circle'], this.x-this.width/2, this.y-30, 0, 0, 1, false, false)
		},
		getAnimation: function (id) {
			if (this.animHash[id]) {
				return this.animHash[id];
			}
			var stInfo = g_data.imageW[id],
				info = stInfo.info,
				data = stInfo.data,
				filename = stInfo.filename;
				
			var frames = [];
			var image = PD.loader.loadedImages[filename];
			for (var i = 0; i < data.length; i ++) {
				var source = data[i];
				
				var width = source[2] - source[0];
				var height = source[3] - source[1];
		 
				var xOffset = source[0] - source[4];
				var yOffset = source[1] - source[5];
		 
				var textureWidth = xOffset + width + source[6] - source[2];
				var textureHeight = yOffset + height + source[7] - source[3];

				frames.push(new Laro.ImageRegion(image, source[0], source[1], width, height, xOffset, yOffset, textureWidth, textureHeight));
			};
			
			var anim = new Laro.Animation(info, frames);
			this.animHash[id] = new La.AnimationHandle(anim);
			return this.animHash[id]; 
		}
	});
	
	
});