N1.ns('.btn', function () {
    var RectSprite = CEC.Sprite.Rect,
        Ticker = CEC.Ticker,
        TWEEN = CEC.TWEEN,
        stage,
        me = this;

    var btn,
        btnActive,
        icon;

    var hasTouch = ('ontouchstart' in window)
    var EV = {
        'start': hasTouch ? 'touchstart' : 'mousedown',
        'move': hasTouch ? 'touchmove' : 'mousemove',
        'end': hasTouch ? 'touchend': 'mouseup'
    };

    function init () {
        stage = N1.stage.layer2;

        initBtn();
        initIcon();

        bind();
    }

    function initBtn () {
        btn = new RectSprite({
            x: 0,
            y: 644,
            width: 640,
            height: 265,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1p4tyFoJgXXbBhDcr-640-265.png',
            backgroundRepeat: 'no-repeat',
            opacity: 0
        }).appendTo(stage);

        //active
        btnActive = new RectSprite({
            x: 0,
            y: 0,
            width: btn.width,
            height: btn.height,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1cLBJFe8jXXbBhDcr-640-265.png',
            backgroundRepeat: 'no-repeat',
            opacity: 0
        }).appendTo(btn).hide();

        btnActive.tween = new TWEEN.Tween({
            opacity: 0
        })
        .to({opacity: 1}, 800)
        .yoyo(1).repeat(1000000)
        .onUpdate(function () {
            btnActive.opacity = this.opacity;
        }).start();

        //tween
        btn.tween = new TWEEN.Tween({
            opacity: btn.opacity
        })
        .to({opacity: 1}, 1000)
        .delay(1800)
        .onUpdate(function () {
            btn.opacity = this.opacity
        })
        .start();

        //click area
        var clickArea = new RectSprite({
            x: 239,
            y: 50,
            width: 164,
            height: 164,
            zIndex: 3
        }).appendTo(btn);
        btn.clickArea = clickArea;

        me.startBtn = btn;
    }

    function initIcon () {
        icon = new RectSprite({
            x: 20,
            y: 16,
            width: 69,
            height: 69,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1W3RFFc0jXXcCcBHm-69-69.png',
            backgroundRepeat: 'no-repeat',
            opacity: 0
        }).appendTo(stage);


        icon.tween = new TWEEN.Tween({
            opacity: 0
        })
        .to({opacity: 1}, 800)
        .yoyo(1)
        .repeat(99999999)
        .onUpdate(function () {
            icon.opacity = this.opacity;
        })
        .start();

        me.quesIcon = icon; 
        
    }

    function bind () {
        btn.clickArea.on(EV.start, function (e) {
            if (btn.status != 'active') {
                btn.status = 'active';
                btnActive.show();

                N1.stage.$.fire('enter:search');
            }
            
        });

        N1.canvas.addEventListener(EV.end, function () {
            if (btn.status == 'active') {
                delete btn.status;
                btnActive.hide();
                N1.stage.$.fire('leave:search');
            }
        }, false);
    }

    this.init = init; 
});