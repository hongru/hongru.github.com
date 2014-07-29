
var N1 = N1 || {};

N1.ns = function (name, fn) {
    var names = name.split('.'),
        i = -1,
        loopName = window;

    if (names[0] == '') {names[0] = 'N1'}

    while (names[++ i]) {
        if (loopName[names[i]] === undefined) {
            loopName[names[i]] = {};
        }
        loopName = loopName[names[i]]
    }

    if (fn) {
        if (typeof fn == 'function') {
            fn.call(loopName, self['N1']);
        } else if (toType(fn) == 'object') {
            $.extend(loopName, fn);
        }
    }

};

//stage
N1.ns('.stage', function () {
    var canvas,
        stage,
        $cont,
        me = this;

    var RectSprite = CEC.Sprite.Rect,
        Ticker = CEC.Ticker;

    var canvasWidth = 640,
        canvasHeight = 960;

    this.INIT_WIDTH = 640;
    this.INIT_HEIGHT = 960;

    function initStage () {
        var $canvas = $('<canvas id="cec-canvas"></canvas>').appendTo('#stage');
        $cont = $('#stage');
        canvas = $canvas[0];
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        stage = new RectSprite(canvas);
        layer1 = new RectSprite({
            x: 0,
            y: 0,
            width: stage.width,
            height: stage.height,
            zIndex: 1
        }).appendTo(stage);
        layer2 = new RectSprite({
            x: 0,
            y: 0,
            width: stage.width,
            height: stage.height,
            zIndex: 10
        }).appendTo(stage);

        me.$ = stage;
        me.layer1 = layer1;
        me.layer2 = layer2;
        N1.canvas = canvas;
    }

    // 场景控制
    var test_interval;
    function bind () {
        N1.stage.$.on('enter:search', function () {
            N1.logo.leave();
            N1.stars.move(true);

            if (Math.random() > 0.4) {
                //play countdown
                var n = 10;
                test_interval = setInterval(function () {
                    N1.countdown.setNumber(n);
                    if (n == 0) clearInterval(test_interval);
                    n --;
                }, 1000);
            }
        });
        N1.stage.$.on('leave:search', function () {
            N1.logo.enter();
            N1.stars.move(false);
            N1.countdown.hide();
            clearInterval(test_interval)
        });
    }
    
    function init () {
        initStage();
        bind();
    }

    this.init = init;

});
