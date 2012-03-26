/* 怪物类 */
Laro.register('PD', function (La) {

	// 怪物state Class
	this.M_Wait = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation(this.host.id);
			this.anim.play();
			this._t = 0;
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.update(dt);
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			var role = PD.$role;

			if (this.host.heath <= 0 || this.host.dead) {
				this.host.setState(4)
			}

			this.dis = Math.sqrt(Math.pow(role.x - this.host.x, 2) + Math.pow(role.y - this.host.y, 2));

			if(this.dis - this.host.r_attack <= 0){
                this.host.fsm.setState(2);
			}else if(this.dis - this.host.r_run <= 0){
                this.host.fsm.setState(1);
			}else{
                this.host.fsm.setState(0);
			}
		}
	});
	
	this.M_Run = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation(this.host.id);
			this.anim.play();
			this._t = 0;
			this.speed = 1;
			this.dis = 0;
		},
		leave: function () {
		
		},
		update: function (dt) {
			this.anim.update(dt);
			this.speed = 100*dt;
			
			var role = PD.$role;
			this.dis = Math.sqrt(Math.pow(role.x - this.host.x, 2) + Math.pow(role.y - this.host.y, 2));
			
			//var angle = Math.atan((PD.MOUSEDOWN_X - this.host.x)/(PD.MOUSEDOWN_Y - this.host.y));
			var spy = this.speed*(role.y - this.host.y)/this.dis;
			var spx = this.speed*(role.x - this.host.x)/this.dis;
			
			this.host.x += spx;
			this.host.y += spy;

			if (this._t >= this.anim.getLength()) {
                this.animationEnd = true;
            }
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if(this.dis - this.host.r_attack <= 0){
                this.host.fsm.setState(2);
			}else if(this.animationEnd){
                this.host.fsm.setState(0);
			}
		}
	});
	
	this.M_Attacked = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation(this.host.id);
			this.anim.play();
			this._t = 0;
			this.speed = 1;
			this.dis = 0;
			this.animationEnd = false;

		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.update(dt);

			if (this._t >= this.anim.getLength()) {
                this.animationEnd = true;
				PD.$role.fsm.setState(2, {
					attack: 15,
					roleFace: (this.host.x > PD.$role.x) // 为true时，人面向右
				}); 
            }
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this.animationEnd) {
                this.host.fsm.setState(0);
            }
		}
	});

	//被攻击
	this.M_Beattacked = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation(this.host.id);
			this.anim.play();
			this._t = 0;
			this.speed = 1;
			this.dis = 0;
			this.animationEnd = false;
			this.msg = msg;
			this.host.heath -= this.msg.attack;
			if (this.msg.offset) {
				this.host.x += this.msg.offset;
			}
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.update(dt);
			


			if (this._t >= this.anim.getLength()) {
				var role = PD.$role;
				
                this.animationEnd = true;
            }
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this.animationEnd) {
                this.host.fsm.setState(0);
            }
		}
	});
	
	this.M_Dead = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) { console.log('dead')
			this.anim = this.host.getAnimation(this.host.id);
			this.anim.play();
			this._t = 0;
			this.a = 1;
			for (var i = 0; i < PD.$monsters.length; i ++) {
					var mo = PD.$monsters[i];
					if (mo.heath <= 0 || mo.dead) {
						PD.$monsters.splice(i, 1);
						i --;
					}
				}
			if (PD.$monsters.length == 0) {
				//this.showGo();
				//this.host.setState(5);
				PD.$fsm.$.setState(6)
			}
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.update(dt);
			//this.a = Math.max(1-this._t/2, 0);
			
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, this.a, null);
		},
		transition: function () { console.log(PD.$monsters)
			//if (this.a == 0) {
				for (var i = 0; i < PD.$monsters.length; i ++) {
					var mo = PD.$monsters[i];
					if (mo.heath <= 0 || mo.dead) {
						PD.$monsters.splice(i, 1);
						i --;
					}
				}
		//	}
			
		}	
	});
	
	this.GoNext = La.BaseState.extend().methods({
		enter: function (msg, fromState) { 
			console.log('goNext');
			this._t = 0;
		},
		leave: function () {
			
		},
		update: function (dt) {
			this._t += dt;
			

		},
		draw: function (render) {
			render.drawImage(PD.textures['GO'], 0, render.getHeight()/2-50, 0, 1, 1, false, false);
		},
		transition: function () {

		}	
	});
	
	// 怪物 statesList
	var statesList = [
		0, this.M_Wait,
		1, this.M_Run,
		2, this.M_Attacked,
		3, this.M_Beattacked,
		4, this.M_Dead,
		5, this.GoNext
	]
	
	this.Master = La.Class(function (x, y, width, height) {
		this.x = x;
		this.y = y;
		
		this.id = 'monster';

		this.width = width || 98;
		this.height = height || 110;
		this.heath = this.fullHeath = 500;
		this.dead = false;

		this.attack = 15;

		this.bloodBarW = 80;
		this.bloodBarH = 6;

		//cfg
		this.r_attack = 40;
		this.r_run = 300;

		this.animHash = {};
		
		this.fsm = new La.AppFSM(this, statesList);
		this.setState(0);
		//this.fsm.setState(0)
	}).methods({
		setState: function (state, msg) {
			this.fsm.setState(state, msg);
		},
		update: function (dt) {
			this.fsm.update(dt);
			this.checkLife(dt);
		},
		checkLife: function (dt) {
			if (this.heath <=0) {
				this.heath = 0;
				this.dead = true;
			}
		},
		chkrun : function(){

		},
		chkAttack : function(){

		},
		draw: function (render) {
			this.fsm.draw(render);
			this.drawBloodBar(render);
		},
		drawBloodBar: function (render) {
			var ctx = render.context;
			ctx.save();
			ctx.globalAlpha = 0.7;
			ctx.fillStyle = '#000';
			ctx.fillRect(this.x - this.bloodBarW/2-2, this.y-this.height-2, this.bloodBarW+4, this.bloodBarH+4);
			
			ctx.fillStyle = 'green';
			ctx.fillRect(this.x - this.bloodBarW/2, this.y-this.height, this.bloodBarW*this.heath/this.fullHeath, this.bloodBarH)
			ctx.restore();
		},
		getAnimation: function (id) {
			if (this.animHash[id]) {
				return this.animHash[id];
			}
			var stInfo = g_data.imageW[id],
				info = stInfo.info,
				data = stInfo.data,
				image = PD.loader.loadedImages[stInfo.filename];
				
			var frames = [];
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
	
	this.Boss = this.Master.extend();
});