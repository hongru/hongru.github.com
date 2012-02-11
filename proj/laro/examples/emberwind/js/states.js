// emberwind state
Laro.register('Emberwind', function (La) {
    var Vec2 = La.Vector2, Pixel32 = La.Pixel32;
    var pkg = this;
	
    this.IntroState = La.BaseState.extend(function () {
        this.t = 0;
        this.delayAfter = 1;
        this.doneT = null;
        this.progress = 0;
     
        this.minLogoTime = 3;
        this.logoStartT = null;
     
        this.font = null;
        this.progressText = null;
        this.lastProgress = -1;
     
        this.operaLogo = null;

    }).methods({
        enter : function (msg, fromState) {
            La.ResourceLoader.getInstance().preloadImages(["laro.png"], La.curry(this.operaProgressCallback, this));
         
            var images = [
                "titlescreen0.png", 
                "titlescreen1.png", 
                "titlescreen2.png", 
                "titlescreen3.png", 
                "titlescreen4.png", 
                "titletext_html5.png", 
                "titlescreen_wick_eyes.png", 
                "titlescreen_kindle_eyes.png", 
                "timetrap.png",

				'fighter/wait.gif',
				'fighter/goForward.gif'

            ];
            La.ResourceLoader.getInstance().preloadImages(images, La.curry(this.progressCallback, this));
         
            this.font = Emberwind.Resource.getInstance().getFont("LoadingIntro");
            this.operaLogo = Emberwind.Resource.getInstance().getImage("opera_logo", "opera_logo"); 
        },
        leave: function () {},
        progressCallback : function (status) {
            this.progress = status;
         
            if (status >= 1) {
                this.doneT = this.t + this.delayAfter;
            }
        },
        operaProgressCallback : function (status) {
            if (status >= 1) {
                this.logoStartT = this.t;
                this.minLogoTime += this.t;
            }
        },
        update : function (dt) {
            this.t += dt;
        },
        transition : function () { 
            return this.host.tryChangeState(this.doneT != null && this.t >= this.doneT && this.logoStartT != null && this.t >= this.minLogoTime, La.FSM.kNextState);
        },
        draw : function (render) {
            render.clear(render.white);
         
            var centerW = render.getWidth() / 2;
            var centerH = render.getHeight() / 2;
         
            if (this.logoStartT != null) {
                var logoAlpha = Math.min(1, this.t - this.logoStartT);
                render.drawImage(this.operaLogo, centerW, centerH, 0, true, logoAlpha, null, false);
            }
         
         
            if (this.lastProgress != this.progress) {
                this.progressText = this.font.generateCanvas(Math.ceil(this.progress * 100) + " %");
                this.lastProgress = this.progress;
            }
         
            var alpha = 1;
            if (this.t < 1) {
                alpha = this.t;
            }
            if (this.doneT != null) {
                alpha = Math.max(0, this.doneT - this.t);
            }
         
            render.drawText(this.progressText, centerW - this.progressText.width / 2, 420, alpha);
        }
    
    });
    
    // Timetrap
    this.Timetrap = La.BaseState.extend().methods({
        enter: function (msg, fromState) {
            var res = Emberwind.Resource.getInstance();
            this.animation = res.getAnimation('TimeTrap');
            this.timeInState = 0;
        },
        leave: function () {},
        update: function (dt) {
            dt = Math.min(dt, 1/15);
            this.animation.update(dt);
            if (this.timeInState < 0.5 && this.timeInState + dt > 0.5) {
                this.animation.play(false);
            }
            this.timeInState += dt;
        },
        transition: function () {
            return this.host.tryChangeState(this.timeInState > 5, La.FSM.kNextState, 'stage0');
        },
        draw: function (render) {
            render.clear(render.white);
            this.timeInState > 0.5 && this.animation.draw(render, render.getWidth()/2, render.getHeight()/2, 0, 1, null);
        }
    });
    
    this.Menu = La.BaseState.extend(function () {

        this.titleImgs = [];

        this.buttonPressed = -1;
        this.cloudXPos = 0;
        this.fogXPos = 0;
     
        this.doStartScreen = true; // temp
        this.timeIntoStartScreen = 0;
        this.titleParam = 0;
        this.pressStartText = null;
        this.pressStartFlash = 0;

    }).methods({
        enter: function (msg, fromState) {
            this.timeIntoStartScreen = 999;
  
            this.lastMusicPos = 0;
         
            this.buttonPressed = -1;
            var dep = Emberwind.Resource.getInstance();
            this.titleImgs[0] = dep.getImage("Titlescreen0", "default");
            this.titleImgs[1] = dep.getImage("Titlescreen1", "default");
            this.titleImgs[2] = dep.getImage("Titlescreen2", "default");
            this.titleImgs[3] = dep.getImage("Titlescreen3", "default");
            this.titleImgs[4] = dep.getImage("Titlescreen4", "default");
            this.titleImgs[5] = dep.getImage("TitlescreenLogo", "default");
            
            this.cloudXPos = 0;
            this.fogXPos = 0;
			
			this.fighter = Emberwind.Fighter.getInstance(Emberwind.Game.instance.render);
			
			// add event
			var cvs = Emberwind.Game.instance.canvas;
			this.cvs = cvs;
			var _this = this;
			this.cvs.addEventListener('click', function (e) {
				_this.buttonPressed = 1;
			}, false)


        },
        leave: function () {
			this.cvs.removeEventListener('click');
		},
        update: function (dt) {
            this.titleParam += dt;
            this.pressStartFlash += dt;

            this.timeInSinceStartScreen = 0;
            if (this.timeIntoStartScreen > 0) this.timeIntoStartScreen += dt;
     
            if (this.timeIntoStartScreen > 3) {
                this.doStartScreen = false;
            }
     
            this.cloudXPos -= 24 * dt;
            if (this.cloudXPos < - this.titleImgs[1].textureWidth * 2) this.cloudXPos = -24 * dt;
     
            this.fogXPos -= 8 * dt;
            if (this.fogXPos < - this.titleImgs[3].textureWidth * 10) this.fogXPos = -8 * dt;
			
			this.fighter.update(dt);

        },
        transition: function () {
			if (this.buttonPressed == 1) {
				pkg.Game.instance.setState(pkg.states.kStateLoadingStage, 'stage0');
			}
        },
        draw: function (render) {
            this.drawStartScreenBackground(render);
			this.drawFighter(render);
        },
        drawStartScreenBackground: function (render) {
            var center = new Vec2(render.getWidth() / 2, render.getHeight() / 2);
 
            render.clear();
            render.drawImage(this.titleImgs[0], center.x, center.y, 0, true, 1, null, false);
            
            for (var i = 0; i < 3; i++) {
                render.drawParticle(this.titleImgs[1], this.cloudXPos + this.titleImgs[1].textureWidth * 2 * i, this.titleImgs[1].textureHeight - 150, 0, 2, 2, 1, new Pixel32(255, 255, 255), false);
            }

            var castleScale = 1.25;
            if (this.timeIntoStartScreen > 0.5) {
                castleScale = 1.25 - 0.25 * La.clamp(0, (this.timeIntoStartScreen - 0.5) / 2, 1);
            }
         
            render.drawParticle(this.titleImgs[2], center.x, center.y, 0, castleScale, castleScale, 1, new Pixel32(0xff, 0xff, 0xff, 0x0), false);
         
            var fgScale = 5;
            if (this.timeIntoStartScreen > 0.5) {
                fgScale = 5 - 4 * La.clamp(0, (this.timeIntoStartScreen - 0.5) / 2, 1);
            }
            //render.drawParticle(this.titleImgs[4], center.x, center.y, 0, fgScale, fgScale, 1, new Pixel32(0xff, 0xff, 0xff, 0x0), false);
            
            var titlePos = center.y;
            if (this.timeIntoStartScreen > 2.5) {
                titlePos = -(this.titleImgs[5].textureHeight / 2) + this.titleImgs[5].textureHeight * La.clamp(0, (this.timeIntoStartScreen - 2.5) * 2, 1);
            } else {
                var tp = La.clamp(0, this.timeIntoStartScreen * 4, 1) * Math.PI / 2;
                titlePos = center.y - Math.sin(tp) * render.getHeight() * 2 / 3;
            }
         
         
            var offsetX = perlin.noise(this.titleParam / 2) * 5;
            var offsetY = perlin.noise(this.titleParam / 2 + 100) * 5;
         
            offsetY += 10; // Maybe
            render.drawParticle(this.titleImgs[5], center.x + offsetX, titlePos + offsetY, 0, 1, 1, 1, new Pixel32(0xff, 0xff, 0xff, 0xff), false);
        },
		drawFighter: function (render) {
			this.fighter.draw(render);
		}
    });
	
	
	// LoadingStage state
	this.LoadingStage = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
		
		},
		leave: function () {},
		update: function (dt) {
		
		},
		draw: function (render) {
			render.clear(render.black);
			render.context.font = '32pt Arial';
			render.context.fillStyle = '#ffffff';
			render.context.fillText('Loading Stage 0', render.getWidth()/2 - 100, render.getHeight()/2)
		},
		transition: function () {
		
		}
	});

	// into game; 
	this.InGame = La.BaseState.extend(function () {
	
	}).methods({
		enter: function (msg, fromState) {
		
		},
		leave: function () {},
		update: function (dt) {
		
		},
		draw: function (render) {
		
		},
		transition: function () {
		
		}
	});

})