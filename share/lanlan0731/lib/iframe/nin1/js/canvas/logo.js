//logo
N1.ns('.logo', function () {
    var stage,
        zi1,
        zi2,
        zi3,
        me = this;

    var RectSprite = CEC.Sprite.Rect,
        TWEEN = CEC.TWEEN;

    function init () {
        stage = N1.stage.layer1;

        initText1();
        initText2();
        initText3();

        me.enter();
    }

    function initText1 () {
        zi1 = new RectSprite({
            x: 650,
            y: 224,
            width: 223,
            height: 35,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1rzlzFklkXXXRImYm-223-35.png',
            backgroundRepeat: 'no-repeat'
        })
        .appendTo(stage);

        zi1.tween = new TWEEN.Tween({
            x: zi1.x
        })
        .to({x: 254}, 500)
        .delay(500)
        .onUpdate(function () {
            zi1.x = this.x;
        });
    }
    function initText2 () {
        zi2 = new RectSprite({
            x: -350,
            y: 270,
            width: 300,
            height: 185,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1A30KFb4jXXX_yTTS-300-185.png',
            backgroundRepeat: 'no-repeat'
        })
        .appendTo(stage);

        zi2.tween = new TWEEN.Tween({
            x: zi2.x
        })
        .to({x: 118}, 500)
        .delay(800)
        .onUpdate(function () {
            zi2.x = this.x;
        });
    }
    function initText3 () {
        zi3 = new RectSprite({
            x: 350,
            y: -200,
            width: 168,
            height: 84,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1JQdUFcNkXXaj2fvh-168-84.png',
            backgroundRepeat: 'no-repeat'
        })
        .appendTo(stage);

        zi3.tween = new TWEEN.Tween({
            y: zi3.y
        })
        .to({y: 310}, 800)
        .delay(1000)
        .onUpdate(function () {
            zi3.y = this.y;
        });
    }

    //public
    this.init = init;
    this.enter = function () {
        zi1.tween.to({x: 254}, 500).easing(TWEEN.Easing.Back.Out).start();
        zi2.tween.to({x: 118}, 500).easing(TWEEN.Easing.Back.Out).start();
        zi3.tween.to({y: 310}, 800).easing(TWEEN.Easing.Bounce.Out).start();
    }
    this.leave = function () {
       zi1.tween.delay(0).to({x: 650}, 500).easing(TWEEN.Easing.Back.In).start();
       zi2.tween.delay(0).to({x: -350}, 500).easing(TWEEN.Easing.Back.In).start();
       zi3.tween.delay(0).to({y: -200}, 500).easing(TWEEN.Easing.Back.In).start();
    }

});