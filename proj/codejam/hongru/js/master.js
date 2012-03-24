/* 怪物类 */
Laro.register('PD', function (La) {

	// 怪物state Class
	this.M_Wait = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('master_wait');
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
			this.anim = this.host.getAnimation('master_run');
			this.anim.play();
			this._t = 0;
			this.speed = 1;
			this.dis = 0;
		},
		leave: function () {
		
		},
		update: function (dt) {
			this.anim.update(dt);
			
			var role = PD.$role;
			this.dis = Math.sqrt(Math.pow(role.x - this.host.x, 2) + Math.pow(role.y - this.host.y, 2));
			
			//var angle = Math.atan((PD.MOUSEDOWN_X - this.host.x)/(PD.MOUSEDOWN_Y - this.host.y));
			var spy = this.speed*(role.y - this.host.y)/this.dis;
			var spx = this.speed*(role.x - this.host.x)/this.dis;
			
			this.host.x += spx;
			this.host.y += spy;
		},
		draw: function (render) {
			this.anim.draw(render, this.host.x, this.host.y, 0, 1, null);
		},
		transition: function () {
			if (this.dis <= 4) {
				this.host.setState(0);
				PD.startMove = false;
			}
		}
	});
	
	this.M_Attacked = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('master_run');
			this.anim.play();
			this._t = 0;
			this.speed = 1;
			this.dis = 0;

			//攻击成功 通知被攻击
			var role = PD.$role;
			//role.fsm.setState(3);
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.update(dt);

			if (this._t >= this.anim.getLength()) {
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

	//被攻击
	this.M_Beattacked = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('master_run');
			this.anim.play();
			this._t = 0;
			this.speed = 1;
			this.dis = 0;
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.anim.update(dt);
			
			var role = PD.$role;
			this.host.heath -= role.attack;

			if (this._t >= this.anim.getLength()) {
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
	
	// 怪物 statesList
	var statesList = [
		0, this.M_Wait,
		1, this.M_Run,
		2, this.M_Attacked,
		3, this.M_Beattacked
	]
	
	this.Master = La.Class(function (x, y) {
		this.x = x;
		this.y = y;

		//cfg
		this.r_attack = 100;
		this.r_run = 500;

		this.animHash = {};
		
		this.fsm = new La.AppFSM(this, statesList);
		//this.setState(0);
		//this.fsm.setState(0)
	}).methods({
		setState: function (state, msg) {
			this.fsm.setState(state, msg);
		},
		update: function (dt) {
			this.fsm.update(dt);
		},
		chkrun : function(){

		},
		chkAttack : function(){

		},
		draw: function (render) {
			this.fsm.draw(render);
		},
		getAnimation: function (id) {
			if (this.animHash[id]) {
				return this.animHash[id];
			}
			var stInfo = g_data.imageW[id],
				info = stInfo.info,
				data = stInfo.data;
				
			var frames = [];
			var image = PD.loader.loadedImages['images/master/spirit.png'];
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