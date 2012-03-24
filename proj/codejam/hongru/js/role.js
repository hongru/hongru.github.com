/* 人物Role */
Laro.register('PD', function (La) {

	// 人物state Class
	this.R_Wait = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
			this.anim = this.host.getAnimation('role_wait');
			
			this.anim.play();
			this._t = 0;
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
		
		},
		leave: function () {
		
		},
		update: function (dt) {
		
		},
		draw: function (render) {
		
		},
		transition: function () {
		
		}
	});
	
	// 人物 statesList
	var statesList = [
		0, this.R_Wait,
		1, this.R_Run,
		2, this.R_Attacked
	]
	
	this.Role = La.Class(function (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width || 106;
		this.height = height || 128;
		this.bloodBarW = 150;
		this.bloodBarH = 10;
		
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
			PD.roleMousedown = true;
			PD.showCircle = true;
		});
		this.checkSprite.addEventListener('touchstart', function (x, y) {
			PD.roleMousedown = true;
			PD.showCircle = true;
		});

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
			ctx.fillRect(this.x - this.bloodBarW/2, this.y-this.height-20, this.bloodBarW, this.bloodBarH)
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
				data = stInfo.data;
				
			var frames = [];
			var image = PD.loader.loadedImages['images/role/role-right.png'];
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