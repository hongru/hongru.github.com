N1.ns('.game', function () {

    function init () {
        //init mods
        N1.stage.init();
        N1.preload.init(function () {
            N1.bg.init();
            N1.logo.init();
            N1.cart.init();
            N1.btn.init();
            N1.mainAvatar.init();

            N1.stars.init();
            N1.countdown.init();
        })
        

        //resize();
        bind();
    }

    function resize () {
        var oldWidth = N1.stage.INIT_WIDTH,
            oldHeight = N1.stage.INIT_HEIGHT,
            w = oldWidth,
            h = oldHeight;

        h = window.innerHeight;
        w = oldWidth*h/oldHeight;

        N1.canvas.width = w;
        N1.canvas.height = h;

        N1.stage.$.setScale(w/oldWidth, h/oldHeight);
        N1.stage.$.moveTo((w-oldWidth)/2, (h-oldHeight)/2);
    }

    function bind () {
        //$(window).on('resize', resize);
        CEC.Ticker.singleton.on('tick', function (dt) {
            N1.stage.$.clear();
            N1.stage.$.render(dt);

            CEC.TWEEN.update();
        })
    }

    this.init = init; 
});

//invoke
N1.game.init();