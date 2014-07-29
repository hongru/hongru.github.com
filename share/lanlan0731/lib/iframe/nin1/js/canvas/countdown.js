N1.ns('.countdown', function () {
    var RectSprite = CEC.Sprite.Rect,
        TextSprite = CEC.Sprite.Text,
        TWEEN = CEC.TWEEN,
        me = this; 

    var countdonwLayer;
    function init () {
        initLayer();
    }
    function initLayer () {
        countdonwLayer = new TextSprite({
            x: 0,
            y: 0,
            width: N1.stage.$.width,
            height: 730,
            zIndex: 3,
            text: '10',
            textColor: '#fff',
            textAlign: 'center',
            verticalAlign: 'middle',
            fontSize: 167,
            opacity: 0,
            fontStyle: 'italic',
            visible: false,
            scaleX: 3,
            scaleY: 3

        }).appendTo(N1.stage.$);

        countdonwLayer.tween = new TWEEN.Tween({scale:3, opacity:0.1}).to({scale:1, opacity:0.4}, 500).easing(TWEEN.Easing.Cubic.In)
        .onUpdate(function () {
            countdonwLayer.setScale(this.scale, this.scale);
            countdonwLayer.opacity = this.opacity;
        });

    }

    this.init = init;
    this.setNumber = function (n) {
        countdonwLayer.setText(n.toString()).show();

        countdonwLayer.tween.to({scale:3, opacity:0.1}, 10).start()//.to({scale:1, opacity:0.4}, 500).start();
        setTimeout(function () {
            countdonwLayer.tween.to({scale:1, opacity:0.4}, 400).start();
        }, 20)
    };
    this.hide = function () {
        countdonwLayer.hide();
    }
});