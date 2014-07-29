N1.ns('.cart', function () {
    var RectSprite = CEC.Sprite.Rect,
        TWEEN = CEC.TWEEN,
        stage;
    var cart,
        cartText;

    function init () {
        stage = N1.stage.layer1;
        initCart();
        initCartText();
    }

    function initCart() {
        cart = new RectSprite({
            x: 0,
            y: 1000,
            width: 640,
            height: 371,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T10KcqFnpaXXbhC_3r-640-371.png',
            backgroundRepeat: 'no-repeat'
        }).appendTo(stage);

        cart.tween = new TWEEN.Tween({
            y: cart.y
        })
        .to({y: 592}, 500)
        .onUpdate(function () {
            cart.y = this.y;
        })
        .delay(1200)
        .start()
    }

    function initCartText () {
        cartText = new RectSprite({
            x: 200,
            y: 870,
            width: 237,
            height:27,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T18zR.FdNhXXX03Pjq-237-27.png',
            backgroundRepeat: 'no-repeat',
            opacity: 0
        }).appendTo(stage);

        cartText.tween = new TWEEN.Tween({
            opacity: 0
        })
        .to({opacity: 1}, 800)
        .onUpdate(function () {
            cartText.opacity = this.opacity;
        })
        .delay(1200)
        .start()
    }

    this.init = init;
});