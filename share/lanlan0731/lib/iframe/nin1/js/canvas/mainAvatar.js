N1.ns('.mainAvatar', function () {
    var RectSprite = CEC.Sprite.Rect,
        TextSprite = CEC.Sprite.Text,
        TWEEN = CEC.TWEEN; 

    var avatar,
        avatarImg,
        avatarText;

    function init () {
        avatar = new RectSprite({
            x: 275,
            y: 548,
            width: 88,
            height: 130
        }).appendTo(N1.stage.layer1);

        avatarImg = new RectSprite({
            x: 0,
            y: 0,
            backgroundImage: 'http://gtms01.alicdn.com/tps/i1/T19QVUFlxiXXa_Ptjr-88-87.png',
            width: 88,
            height: 87,
            opacity: 0
        }).appendTo(avatar);

        avatarText = new TextSprite({
            x: 0,
            y: 95,
            width: 88,
            height: 30,
            fontSize: 12,
            text: '岑安',
            textAlign: 'center',
            textColor: '#fff',
            opacity: 0
        }).appendTo(avatar);

        //tween
        avatar.tween = new TWEEN.Tween({
            opacity: 0,
            y: 480
        })
        .to({
            opacity: 1,
            y: 548
        }, 1000)
        .delay(2000)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(function () {
            avatarImg.opacity = this.opacity;
            avatarText.opacity = this.opacity;
            avatar.y = this.y;
        })
        .start();
    }

    this.init = init;

});