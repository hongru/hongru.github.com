/*= Type Shot of Laro =*/

Laro.register('TypeShot', function (La) {

	var pkg = this;
	
	this.score = 0;

	this.render = null;
	this.getUid = function () {
		var id = 0;
		return function () {
			return id ++;
		}
	}();

	this.init = function (cvsId, w, h) {
		this.canvasId = cvsId;
		this.w = w;
		this.h = h;
		this.canvas = document.getElementById(cvsId);
		this.createRender();

		this.$fsm.init();
		this.$loop.init();
		this.keyboard = new La.Keyboard();

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
		this.barW = 160;
		this.barH = 6;
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
				'images/grid_w.png',
				'images/mine.png',
				'images/missle.png',
				'images/oppressor.png',
				'images/plasma.png',
				'images/ship.png',
				'images/tungsten-18.png',
				'images/tungsten-18-orange.png',
				'images/tungsten-48.png',
				
				//music
				'music/endure.mp3',
				'music/explosion.mp3',
				'music/hit.mp3',
				'music/plasma.mp3'
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
			render.drawFilledRect(x0, y0, (x0 + this.progress*this.barW), y1, '#F5D74F');
		}
	});
	
	/**
	 * in game states
	 */
	this.InGame = La.BaseState.extend(function () {
		
		$TS.textures = {};
		$TS.music = {};
		
		this.bgPos = 0;
		
		$TS.enemyNum = 2;
		$TS.enemyCollection = {};
		$TS.addEnemys = function (n) {
			for (var i = 0; i < n; i ++) {
				var id = $TS.getUid();
				$TS.enemyCollection[id] = new $TS.Enemy(id);
			}
		}
		$TS.checkEnemys = function () {
			var isEmpty = true;
			for (var k in $TS.enemyCollection) {
				if (k != undefined) {
					isEmpty = false;
					break;
				}
			}
			if (isEmpty) {
				$TS.enemyNum ++;
				$TS.addEnemys($TS.enemyNum);
			}
		}
		
		this.scoreFont = new La.Font(g_data.font.scoreFont);
		
	}).methods({
		enter: function (msg, fromState) {
			console.log('inGame', fromState);
			$TS.textures['bg'] = $TS.$res.getImage('bg');
			$TS.textures['grid'] = $TS.$res.getImage('grid');
			$TS.textures['ship'] = $TS.$res.getImage('ship');
			$TS.textures['enemy'] = $TS.$res.getImage('enemy');

			$TS.textures['explosion_0'] = $TS.$res.getImage('explosion', 0);
			$TS.textures['explosion_1'] = $TS.$res.getImage('explosion', 1);
			$TS.textures['explosion_2'] = $TS.$res.getImage('explosion', 2);
			
			$TS.textures['plasma'] = $TS.$res.getImage('plasma');
			
			$TS.music['bgm'] = $TS.$res.getSound('music/endure.mp3');
			$TS.music['explosion'] = $TS.$res.getSound('music/explosion.mp3');
			$TS.music['hit'] = $TS.$res.getSound('music/hit.mp3');
			$TS.music['plasma'] = $TS.$res.getSound('music/plasma.mp3');

			$TS.ship = new $TS.Ship();
			$TS.addEnemys($TS.enemyNum);

			$TS.music['bgm'].play('default', true);
		},
		leave: function () {
		
		},
		update: function (dt) {
			if (this.bgPos + 100*dt >= 62) {
				this.bgPos = 0;
			} else {
				this.bgPos += dt * 100;
			}

			$TS.ship.update(dt);
			for (var i in $TS.enemyCollection) {
				$TS.enemyCollection[i].update(dt);
			}
		},
		draw: function (render) {
			var cx = render.getWidth()/2,
				cy = render.getHeight()/2;

			render.drawImage($TS.textures['bg'], cx, cy, 0, 1, 1, false, false);

			this.drawGrid(render);
			$TS.ship.draw(render);

			render.context.globalCompositeOperation = 'lighter';
			for (var i in $TS.enemyCollection) {
				$TS.enemyCollection[i].draw(render);
			}
			
			var score = this.scoreFont.generateCanvas('score: ' + $TS.score);
			render.drawText(score, render.getWidth()- 80, render.getHeight()-30, 1);
			
		},
		drawGrid: function (render) {
			for (var i = -2; i < 11; i ++) {
				render.drawImage($TS.textures['grid'], 0, i*$TS.textures['grid'].height + this.bgPos, 0, false, 0.5, false, false);
			}		  
		},

		transition: function () {
			
		} 
	});
	
	// Game over
	this.GameOver = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
			console.log('Game Over')
			this.font = new La.Font(g_data.font.bigFont);
			this.title = this.font.generateCanvas('Game Over');
			this.score = this.font.generateCanvas('Your score:' + $TS.score);
		},
		leave: function () {},
		update: function (dt) {
		
		},
		draw: function (render) {
			render.drawFillScreen('#000');
			render.drawText(this.title, (render.getWidth()-this.title.width)/2, (render.getHeight()/3), 1);
			render.drawText(this.score, (render.getWidth()-this.score.width)/2, (render.getHeight()/3 + this.title.height + 40), 1);
		}
	})
		
});

/**
 * 飞船 ship
 */
Laro.register('TypeShot', function (La) {
	var pkg = this,
		$TS = this;
		
	$TS.plasmas = [];
	
	$TS.Plasma = La.Class(function (ship, enemyId) {
		this.from = ship;
		this.enemyId = enemyId;
		var to = $TS.enemyCollection[enemyId];
		var from = ship;
		
		this.x = from.x;
		this.y = from.y;
		this.v = 500;
		this.angle = Math.atan((to.x-from.x)/(from.y-to.y));
		this.vx = Math.cos(Math.PI/2 - this.angle)*this.v;
		this.vy = -Math.sin(Math.PI/2 - this.angle)*this.v;
		
		this.end = false;
		
	}).methods({
		update: function (dt) { 
			var ene = $TS.enemyCollection[this.enemyId];
			if (Math.sqrt(Math.pow(this.x-ene.x, 2) + Math.pow(this.y-ene.y, 2)) < 20) { 
				this.end = true;
				this.x = this.from.x;
				this.y = this.from.y;
				
				ene.setState(1, this.enemyId);
			} else {
				this.x += this.vx*dt;
				this.y += this.vy*dt;
			}

		},
		draw: function (render) {
			!this.end && render.drawImage($TS.textures['plasma'], this.x, this.y, this.angle, 1, 1, false, false);
		}
	})
		

	// wait
	this.Ship_Wait = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
			
		},
		leave: function () {
		
		},
		update: function (dt) {
		
		},
		draw: function (render) {
			render.drawImage($TS.textures['ship'], this.host.x, this.host.y, this.host.angle, 1, 1, false, false)
		},
		transition: function () {
			if (this.host.collapse) {
				this.host.setState(shipStates.collapse);
			}
		}
	});

	// shoot
	this.Ship_Shoot = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
			$TS.score += 2;
			var ene = $TS.enemyCollection[msg];
			ene.cur = true;
			ene.txt = ene.txt.substr(1);
			
			this.host.angle = Math.atan((ene.x-this.host.x)/(this.host.y-ene.y));
			
			$TS.plasmas.push(new $TS.Plasma(this.host, msg))
			$TS.music['plasma'].play()
		},
		leave: function () {
		
		},
		update: function (dt) {
		
		},
		draw: function (render) {
			render.drawImage($TS.textures['ship'], this.host.x, this.host.y, this.host.angle, 1, 1, false, false)
		},
		transition: function () {
			this.host.setState(shipStates.wait);
		}
	});

	// wrong
	this.Ship_Wrong = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
		
		},
		leave: function () {
		
		},
		update: function (dt) {
		
		},
		draw: function (render) {
		
		}
	});

	this.Ship_Collapse = La.BaseState.extend(function () {
			
	}).methods({
		enter: function (msg, fromState) {
			console.log('ship collapse');
			this._t = 0;
			this.explosionImgs = [];
			this.al = 1;
			$TS.music['explosion'].play();
	
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.al = Math.max((3-this._t)/3, 0);
		},
		draw: function (render) {
			for (var i = 0; i < 10; i ++) {
				var ag = Math.PI*i*36/180;
				var x = this.host.x + Math.sin(ag)*this._t*50;
				var y = this.host.y + Math.cos(ag)*this._t*50;
				render.drawImage($TS.textures['explosion_'+Math.floor(Math.random()*3)], x, y, this._t, 1, this.al, false, false)
			}
		},
		transition: function () {
			// game over
			if (this._t > 2) {
				$TS.$fsm.setState(2);
			}
		}
	});


	var shipStates = {
		wait: 0,
		shoot: 1,
		wrong: 2,
		collapse: 3
	};
	var shipStatesList = [
		0, this.Ship_Wait,
		1, this.Ship_Shoot,
		2, this.Ship_Wrong,
		3, this.Ship_Collapse
	];
	// main constructor
	this.Ship = La.Class(function (x, y) {
		this.x = x || $TS.render.getWidth()/2;
		this.y = y || $TS.render.getHeight()-30;
		this.cx = this.x + $TS.textures['ship'].width/2;
		this.cy = this.y + $TS.textures['ship'].height/2;
		
		this.angle = 0;

		this.fsm = new La.AppFSM(this, shipStatesList);
		this.setState(shipStates.wait);
		this.collapse = false;
		
		var _this = this;		
		$TS.keyboard.addKeydownCallback('type', function (e) {
			var tmpKeys = [];
			var key = null;
			var hasCur = false;
			
			if ($TS.enemyCollection) {
				for (var i in $TS.enemyCollection) {
					var ene = $TS.enemyCollection[i];
					if (ene.cur) {
						hasCur = true;
						key = ene.txt.substr(0, 1);
						if (key == e.$keyName) {
							_this.setState(shipStates.shoot, i);
							return;
						} 
					}
					tmpKeys.push({
						key: ene.txt.substr(0, 1),
						id: i
					});
				}
				
				if (!hasCur) {
					for (var i = 0; i < tmpKeys.length; i ++) {
						var o = tmpKeys[i];
						if (o.key == e.$keyName) {
							_this.setState(shipStates.shoot, o.id);
							return;
						} 
					}
				}
				
			}
			
		})

	}).methods({
		update: function (dt) {
			this.fsm.update(dt);
			this.check();
			
			for (var i = 0; i < $TS.plasmas.length; i ++) {
				var p = $TS.plasmas[i];
				p && p.update(dt);
				if (p && p.end) {
					$TS.plasmas.splice(i, 1);
					i --;
				}
			}
			
			// explosion
			for (var i = 0; i < $TS.explosions.length; i ++) {
				var ex = $TS.explosions[i];
				ex && ex.update(dt);
				if (ex.isDead) {
					$TS.explosions.splice(i, 1);
					i --;
				}
			}
		},
		draw: function (render) {
			this.fsm.draw(render);
			
			for (var i = 0; i < $TS.plasmas.length; i ++) {
				var p = $TS.plasmas[i];
				p && p.draw(render);
			}
			
			for (var i = 0; i < $TS.explosions.length; i ++) {
				var p = $TS.explosions[i];
				p && p.draw(render);
			}
		},
		setState: function (state, msg) {
			this.fsm.setState(state, msg);
		},
		check: function () {
			if ($TS.enemyCollection) {
				for (var i in $TS.enemyCollection) {
					var ene = $TS.enemyCollection[i];
					var dis = Math.sqrt(Math.pow(this.x - ene.x, 2) + Math.pow(this.y - ene.y, 2));
					if (dis < 20) {
						this.collapse = true;
					}
					
				}
			}
		}
	});
		
});


/**
 * enemy
 */
Laro.register('TypeShot', function (La) {
	var pkg = this;
	var $TS = this;
	
	$TS.explosions = [];
	$TS.Explosion = La.Class(function (pos) {
		this.pos = pos;
		this.life = 1;
		this._t = 0;
		this.a = 1;
		
		this.isDead = false;
	}).methods({
		update: function (dt) {
			this._t += dt;
			this.a = Math.max(0, this.life-this._t)/this.life;
			this.isDead = (this._t > this.life);
		},
		draw: function (render) {
			if (!this.isDead) {
				for (var i = 0; i < 4; i ++) {
					var ag = Math.PI*i/2;
					var x = this.pos.x + Math.sin(ag)*this._t*50;
					var y = this.pos.y + Math.cos(ag)*this._t*50;
					render.drawImage($TS.textures['explosion_'+Math.floor(Math.random()*3)], x, y, this._t, 1, this.a, false, false)
				}
			}
		}
		
	})

	var chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
	
	this.getRandomWord = function (min, max) {
		var n = min;
		if (max && max > min) {
			n = Math.round(Math.random()*(max-min) + min);
		}
		var ret = [];
		for (var i = 0; i < n; i ++) {
			ret.push(chars[Math.round(Math.random()*26)]);
		}
		
		return ret.join('');
	}

	this.Enemy_Normal = La.BaseState.extend(function () {
		this._t = 0;
		this.angle = 0;

		this.fontObj = g_data.font.enemy;
		this.host.font = new La.Font(this.fontObj);
		this.host.redFont = new La.Font(g_data.font.enemy_red);
		
		this.host.txt = pkg.getRandomWord(3, 7);
		this.host.text = this.host.font.generateCanvas(this.host.txt);
		this.host.textR = this.host.redFont.generateCanvas(this.host.txt);
		this.host.cur = false;
	}).methods({
		enter: function (msg, fromState) {
			
		},
		leave: function () {
		
		},
		update: function (dt) {
			this._t += dt;
			this.a = Math.abs(Math.cos(this._t*2));
			this.a = Math.max(this.a, 0.3);
			this.angle += dt;

			var dis = Math.sqrt(Math.pow($TS.ship.x - this.host.x, 2) + Math.pow($TS.ship.y - this.host.y, 2));
			var v = 20*dt,
				vx = v*($TS.ship.x - this.host.x)/dis,
				vy = v*($TS.ship.y - this.host.y)/dis;
			this.host.x += vx;
			this.host.y += vy;
		},
		draw: function (render) {
			var drawT = this.host.text;
			if (this.host.cur) {
				/*if (!this.host.txt || this.host.txt == '') {
					this.host.setState(enemyStates.dead, this.host.id);
				}*/
				drawT = this.host.redFont.generateCanvas(this.host.txt);
			}
			render.drawImage($TS.textures['enemy'], this.host.x, this.host.y, this.angle, 1, this.a, false, false);
			render.drawText(drawT, this.host.x-drawT.width/3, this.host.y-drawT.height, 1);
		}
	});

	this.Enemy_Attacked = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
			this.host.y -= 2;
			this.id = msg;
			
			$TS.explosions.push(new $TS.Explosion({x: this.host.x, y: this.host.y}));
			$TS.music['hit'].play();
		},
		leave: function () {
		
		},
		update: function (dt) {
		
		},
		draw: function (render) {
			var drawT = this.host.redFont.generateCanvas(this.host.txt);
			render.drawImage($TS.textures['enemy'], this.host.x, this.host.y, this.angle, 1, this.a, false, false);
			render.drawText(drawT, this.host.x-drawT.width/3, this.host.y-drawT.height, 1);
		},
		transition: function () {
			if (this.host.txt && this.host.txt != '') {
				this.host.setState(0);
			} else {
				this.host.setState(2, this.id);
			}
		}
	});

	this.Enemy_Dead = La.BaseState.extend(function () {
		
	}).methods({
		enter: function (msg, fromState) {
			this._t = 0;
			this.id = msg;
			$TS.score += 5;
		},
		leave: function () {
		
		},
		update: function (dt) {
			var hass = false;
			for (var i = 0; i < $TS.plasmas.length; i ++) {
				if ($TS.plasmas[i].enemyId == this.id) {
					hass = true;
					break;
				}
			}
			if (this.id == this.host.id && !hass) {
				delete $TS.enemyCollection[this.id];
				
				$TS.checkEnemys();
			}
		},
		draw: function (render) {
			render.drawImage($TS.textures['enemy'], this.host.x, this.host.y, this.angle, 1, this.a, false, false);
		}
	});


	var enemyStates = {
		normal: 0,
		attacked: 1,
		dead:2
	};
	var enemyStatesList = [
		0, this.Enemy_Normal,
		1, this.Enemy_Attacked,
		2, this.Enemy_Dead
	];
		
	this.Enemy = La.Class(function (id, x, y) {
		this.id = id;
		this.x = x || (410-Math.random()*460);
		this.y = y || (-Math.random()*50);

		this.fsm = new La.AppFSM(this, enemyStatesList);
		this.setState(0);
	}).methods({
		update: function (dt) {
			this.fsm.update(dt);
		},
		draw: function (render) {
			this.fsm.draw(render);
		},
		setState: function (state, msg) {
			this.fsm.setState(state, msg);
		},
		currentState: function () {
			return this.fsm.currentState;
		},
		isDead: function () {
			return (this.fsm.currentState == 2);
		}
	});
})


/**
 * resource
 * 从g_data 里面拿数据
 */
Laro.register('TypeShot.$res', function (La) {
	var pkg = this,
		$TS = TypeShot;

	this.EMBImages = {};
	
	// 获取经包装过的image资源
	// 默认是取第一帧相关数据
	this.getImage = function (name, frame) {
		if (frame == undefined) {
			frame = 0;
		}

		var emb = this.EMBImages[name];
		if (!!emb) {
			return emb[frame];
		}
		for (var k in g_data.imageW) {
			if (name == k) {
				this.EMBImages[k] = {};
				for (var i = 0; i < g_data.imageW[k].data.length; i ++) {
					var data = g_data.imageW[k],
						source = data.data[i],
						filename = data.filename;
					this.EMBImages[k][i] = this.getEMBImage(source, filename);
				}
				return this.EMBImages[name][frame];
			}
		}
	};

	this.getEMBImage = function (source, filename) {
		var width = source[2] - source[0] + 1;
  		var height = source[3] - source[1] + 1;
 
  		var xOffset = source[0] - source[4];
 		var yOffset = source[1] - source[5];
 
    	var textureWidth = xOffset + width + source[6] - source[2];
    	var textureHeight = yOffset + height + source[7] - source[3];
 
   		var image = $TS.loader.loadImage(filename);
    	return new La.EMBImage(image, source[0], source[1], width, height, xOffset, yOffset, textureWidth, textureHeight);
		
	};
	
	this.getSound = function (filename) {
		var loader = $TS.loader; 
        var loadedSounds = loader.loadedSounds;
        return loadedSounds[filename];
	}
		
})

Laro.register('TypeShot.$fsm', function (La) {
		
	var pkg = this,
		$TS = TypeShot,
		$sClass = TypeShot.sClass;

	var states = {
		loading: 0,
		inGame: 1,
		gameOver: 2
	};
	var statesList = [
		states.loading, $sClass.Loading,
		states.inGame, $sClass.InGame,
		states.gameOver, $sClass.GameOver
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
	
	this.scoreFont = new La.Font(g_data.font.scoreFont);

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
		this.drawScore($TS.render);
		$TS.render.flush();
	};
	
	this.drawScore = function (render) {
		
	}

		
})
