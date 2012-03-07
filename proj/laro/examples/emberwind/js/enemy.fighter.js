// Enemy fighter
Laro.register('Emberwind', function (La) {
	var PKG = this;
	
	// Fighter States Class
	this.Enemy_FG_Born = La.BaseState.extend().methods({
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
	
	// Enemy Fighter
	this.Enemy_Fighter = La.Class(function () {
		
	}).methods({
	
	});
	
});