N1.ns('.bg', function () {
    
    var RectSprite = CEC.Sprite.Rect,
        stage;

    function initGrad () {
        stage = N1.stage.layer1;
        var grad = new RectSprite({
            x: 0,
            y: 0,
            width: stage.width,
            height: stage.height,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T1hkBFFeBjXXXz0cAs-640-960.png',
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat'
        }).appendTo(stage);
    }

    this.init = initGrad;

});