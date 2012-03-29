// emberwind eg.
Laro.register('Emberwind', function (La) {
    var PKG = this;
	
	/* 演示用 设置 */
	PKG.CONFIG = {
		__sceneBg: {
			'one': ['Titlescreen0', 'Titlescreen2'], // back, front
			'two': ['bg1', 'bg2']
		},
		usebg: 'two',
		showPeople: true,
		showSceneBg: true,
		loadingStatus: true,
		showOperatingGuide: true,
	}

	PKG.states = {
		kStateIntro: 0,
		kStateTimetrap: 1,
        kStateMenu: 2,
		
		kStateLoadingStage: 3,
		kStateInGame: 4
	};
    
    var Game = La.Class(function (id) {
        this.canvasId = id;
        this.canvas = document.getElementById(id);
        
        var statesList = [
            PKG.states.kStateIntro, PKG.IntroState,
            PKG.states.kStateTimetrap, PKG.Timetrap,
            PKG.states.kStateMenu, PKG.Menu,
			
			PKG.states.kStateLoadingStage, PKG.LoadingStage,
			PKG.states.kStateInGame, PKG.InGame
        ];
        this.fsm = new La.AppFSM(this, statesList);   
        
        this.resources = new Emberwind.Resource()
        this.resources.setCallback(La.curry(this.resourceCallback, this));
        Emberwind.Resource.instance = this.resources;

        this.screenTransition = null;
        this.screenTransitions = [
            {
                from: PKG.states.kStateIntro,
				to: PKG.states.kStateTimetrap,
				out: true,
				transition: new La.ScreenTransitionFade(new La.Pixel32(255, 255, 255, 0), new La.Pixel32(255, 255, 255, 255), 0.25)
            },
			{
				from: PKG.states.kStateIntro,
				to: PKG.states.kStateTimetrap,
				out: false,
				transition: new La.ScreenTransitionFade(new La.Pixel32(255, 255, 255, 255), new La.Pixel32(255, 255, 255, 0), 0.25)
			},
            {
                from: PKG.states.kStateTimetrap,
				to: PKG.states.kStateMenu,
				out: true,
				transition: new La.ScreenTransitionFade(new La.Pixel32(255, 255, 255, 0), new La.Pixel32(255, 255, 255, 255), 0.25)
            },
			{
				from: PKG.states.kStateTimetrap,
				to: PKG.states.kStateMenu,
				out: false,
				transition: new La.ScreenTransitionFade(new La.Pixel32(255, 255, 255, 255), new La.Pixel32(255, 255, 255, 0), 0.25)
			}
        ];
		this.screenTransitionDefaultIn = new La.ScreenTransitionFade(new La.Pixel32(255, 255, 255, 255), new La.Pixel32(255, 255, 255, 0), 1);
		this.screenTransitionDefaultOut = new La.ScreenTransitionFade(new La.Pixel32(255, 255, 255, 0), new La.Pixel32(255, 255, 255, 255), 1);

		this.newState = -1;
		this.newMessage = null;
		this.stateModes = {
			kStateActive: 0,
			kTransitionOut: 1,
			kTransitionIn: 2
		};
		this.stateMode = this.stateModes.kStateActive;

        this.render = null;
		Game.instance = this;

		this.createRender();
        this.resources.init();
        
        this.keyboard = new La.Keyboard();

    }).methods({
		getInstance: function () {
			if (!Game.instance) throw 'Game not init';
			return Game.instance;
		},
		createRender: function () {
			this.oldRender = this.render;
			var oldCanvas = document.getElementById(this.canvasId);
			var canvasParent = oldCanvas.parentNode;

			var canvas = document.createElement('canvas');
			canvas.width = 800;
			canvas.height = 600;
			canvas.id = this.canvasId;

			this.render = new La.CanvasRender(canvas, 1, false);
			canvasParent.replaceChild(canvas, oldCanvas);
			this.canvas = canvas;
			
			PKG.render = this.render;
		},
		resourceCallback: function () {
			if (this.initialized) return;
			this.initialized = true;

			this.fsm.setState(PKG.states.kStateIntro);
			this.appLoop = new La.Loop(this.looper, this);
		},
		looper: function (dt) {
			this.update(dt);
			this.draw();
		},

		update: function (dt) {
        
			if (this.stateMode == this.stateModes.kStateActive) { //属于状态机状态转换
                this.fsm.update(dt);
			} else {
				!!this.screenTransition && this.screenTransition.update(dt);
				if (this.screenTransition.isDone) {
					if (this.stateMode == this.stateModes.kTransitionOut) {
						var st = this.findScreenTransition(this.fsm.currentState, this.newState, false);
						if (st == null) st = this.findScreenTransition(-1, this.newState, false);
						if (st == null) st = this.screenTransitionDefaultIn;

						st.reset();
						this.screenTransition = st;
						this.stateMode = this.stateModes.kTransitionIn;
                        //console.log('----------- '+this.newState)
						this.fsm.setState(this.newState, this.newMessage);
					} else {

						this.screenTransition = null;
						this.stateMode = this.stateModes.kStateActive;
					}
				}
			}		
		},
		findScreenTransition: function (from, to, out) {
			for (var i = 0; i < this.screenTransitions.length; i ++) {
				var stt = this.screenTransitions[i];
				if (stt.from == from && stt.to == to && stt.out == out) {
					return stt.transition;
				}
			}				
			return null;
		},
		draw: function () {
			this.render.clear();
			this.fsm.draw(this.render);
			this.screenTransition && this.screenTransition.draw(this.render);
			this.render.flush();
		},
        tryChangeState : function (condition, toState, msg, reEnter, suspendedCurrent) { 

            if (reEnter === undefined) reEnter = true;
            if (suspendedCurrent === undefined) suspendedCurrent = false;
            if (toState == La.FSM.kNextState) toState = this.fsm.currentState + 1;

            if (condition &&
            (toState != this.fsm.currentState || reEnter)) {
                this.setState(toState, msg, suspendedCurrent);
                return true;
            }
            return false;
        },
        setState: function (state, msg, suspendCurrent) {
            this.newState = state;
            this.newMessage = msg;
         
            if (suspendCurrent || state == -1 || this.fsm.isSuspended(state)) {
                this.fsm.setState(state, msg, suspendCurrent);
            } else { 
                var st = this.findScreenTransition(this.fsm.currentState, state, true);

                if (st == null) st = this.findScreenTransition(this.fsm.currentState, -1, true);
                if (st == null) st = this.screenTransitionDefaultOut;
         
                st.reset();
         
                this.stateMode = this.stateModes.kTransitionOut;
                this.screenTransition = st;
            }
        }
	})
    
    // interface
    this.Game = Game;

});

