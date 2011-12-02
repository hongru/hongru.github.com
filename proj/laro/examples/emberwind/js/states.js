// emberwind state
Laro.register('Emberwind', function (La) {
    
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
                "timetrap.png" 

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

})