/*= Type Shot of Laro =*/

Laro.register('TypeShot', function (La) {

	var pkg = this;

	this.render = null;

	this.init = function (cvsId, w, h) {
		this.canvasId = cvsId;
		this.w = w;
		this.h = h;
		this.canvas = document.getElementById(cvsId);
		this.createRender();

		this.$fsm.init();
		this.$loop.init();

	};

	this.createRender = function () {
		this.oldRender = this.render;
		var oldCanvas = document.getElementById(this.canvasId);
		var canvasParent = oldCanvas.parentNode;

		var canvas = document.createElement('canvas');
		canvas.width = this.w;
		canvas.height = this.h;
		canvas.id = this.canvasId;

		this.render = new La.CanvasRender(canvas, 1, false);
		canvasParent.replaceChild(canvas, oldCanvas);
		this.canvas = canvas;
		
		
	};

	// findScreenTransition
	this.findScreenTransition = function (from, to, out) {
		
	};

	this.screenTransition = null;
	this._c = 255;
	this.screenTransitionDefaultIn = new La.ScreenTransitionFade(new La.Pixel32(this._c, this._c, this._c, 255), new La.Pixel32(this._c, this._c, this._c, 0), 1);
	this.screenTransitionDefaultOut = new La.ScreenTransitionFade(new La.Pixel32(this._c, this._c, this._c, 0), new La.Pixel32(this._c, this._c, this._c, 255), 1);
	
	this.loader = new La.ResourceLoader();
	

});

/**
 * States Class
 */
Laro.register('TypeShot.sClass', function (La) {
	var pkg = this,
		$TS = TypeShot;
	
	this.Loading = La.BaseState.extend(function () {
		this.fontObj = {
				"outline_b": 0,
				"font": "Allan",
				"outline": 1.0,
				"base_b": 255,
				"base_g": 255,
				"outline_r": 0,
				"base_r": 255,
				"size": 26,
				"id": "MainMenu",
				"outline_g": 0
				
			};
		this.barW = 100;
		this.barH = 10;
		this.loadAll = false;
		this.progress = 0;

	}).methods({
		enter: function (msg, fromState) {
			console.log('loading', fromState)
			this._t = 0;
			this.font = new La.Font(this.fontObj);
			this.title = this.font.generateCanvas('Laro TypeShot');

			var images = [
				'images/backdrop.png',
				'images/bullet.png',
				'images/destroyer.png',
				'images/explosion.png',
				'images/gezi.png',
				'images/grid.png',
				'images/mine.png',
				'images/missle.png',
				'images/oppressor.png',
				'images/plasma.png',
				'images/ship.png',
				'images/tungsten-18.png',
				'images/tungsten-18-orange.png',
				'images/tungsten-48.png'
			];
			$TS.loader.preload(images, La.curry(this.resourceLoadCallback, this));
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
		},
		draw: function (render) {
			var rw = render.getWidth(),
				rh = render.getHeight();
			render.drawFillScreen('#000');
			render.drawText(this.title, (rw-this.title.width)/2, rh/3 - this.title.height, 1);

			this.drawProgressBar(render);
		},	
		transition: function () {
		/*	if (this._t > 5) {
				this.host.setState(this.host.states.inGame);
			}*/
			if (this.loadAll) {
				this.host.setState(this.host.states.inGame);
			}
		},
		resourceLoadCallback: function (p) {
			this.progress = p; 
			if (p >= 1) {
				this.loadAll = true;
			}
		},
		drawProgressBar: function (render) {
			var x0 = (render.getWidth()-this.barW)/2,
				y0 = (render.getHeight()/2),
				x1 = (render.getWidth()+this.barW)/2,
				y1 = render.getHeight()/2 + this.barH;
			render.drawRect(x0, y0, x1, y1, '#F5D74F');
			render.drawFilledRect(x0, y0, (x0 + this.progress*this.barW), y1, '#fff');
		}
	});
	
	this.InGame = La.BaseState.extend().methods({
		enter: function (msg, fromState) {
			console.log('inGame', fromState)
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
		
})

Laro.register('TypeShot.$fsm', function (La) {
		
	var pkg = this,
		$TS = TypeShot,
		$sClass = TypeShot.sClass;

	var states = {
		loading: 0,
		inGame: 1
	};
	var statesList = [
		states.loading, $sClass.Loading,
		states.inGame, $sClass.InGame
	];

	this.stateModes = {
		kStateActive: 0,
		kTransitionOut: 1,
		kTransitionIn: 2
	};
	this.stateMode = this.stateModes.kStateActive;
	
	this.states = states;
	this.statesList = statesList;

	this.newState = -1;
	this.newMessage = null;

	this.init = function () {
		this.$ = new La.AppFSM(this, statesList);	
		this.setState(this.states.loading);
	}


	this.setState = function (state, msg, suspendCurrent) {
		this.newState = state;
		this.newMessage = msg;

		if (suspendCurrent || state == -1 || this.$.isSuspended(state)) {
			this.$.setState(state, msg, suspendCurrent);
		} else {
			var st = $TS.screenTransitionDefaultOut;
			st.reset();

			this.stateMode = this.stateModes.kTransitionOut;
			$TS.screenTransition = st;
		}
	}
});

/**
 * looper
 */
Laro.register('TypeShot.$loop', function (La) {
	var pkg = this;
	var $fsm = TypeShot.$fsm;
	var $TS = TypeShot;

	this.init = function () {
		this.$ = new La.Loop(this.looper, this);
	}
	this.looper = function (dt) {
		this.update(dt);
		this.draw();
	}

	this.update = function (dt) {
		if ($fsm.stateMode == $fsm.stateModes.kStateActive) { //属于状态机状态转换
                $fsm.$.update(dt);
		} else {
			!!$TS.screenTransition && $TS.screenTransition.update(dt);
			if ($TS.screenTransition.isDone) {
				if ($fsm.stateMode == $fsm.stateModes.kTransitionOut) {
					var st = $TS.screenTransitionDefaultIn;

					st.reset();
					$TS.screenTransition = st;
					$fsm.stateMode = $fsm.stateModes.kTransitionIn;
					$fsm.$.setState($fsm.newState, $fsm.newMessage);
				} else {
					$TS.screenTransition = null;
					$fsm.stateMode = $fsm.stateModes.kStateActive;
				}
			}
		}
		
	};

	this.draw = function () {
		$TS.render.clear();
		$fsm.$.draw($TS.render);
		$TS.screenTransition && $TS.screenTransition.draw($TS.render);
		$TS.render.flush();
	};

		
})
