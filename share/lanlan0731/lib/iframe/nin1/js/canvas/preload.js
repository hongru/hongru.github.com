//preload
N1.ns('.preload', function () {
    
    CEC.Loader.belongto(CEC.Sprite);

    var loader,
        loaderSprite,
        RectSprite = CEC.Sprite.Text;
    var assets = [
        'http://gtms01.alicdn.com/tps/i1/T1A30KFb4jXXX_yTTS-300-185.png',
        'http://gtms01.alicdn.com/tps/i1/T1rzlzFklkXXXRImYm-223-35.png',
        'http://gtms01.alicdn.com/tps/i1/T1hkBFFeBjXXXz0cAs-640-960.png',
        'http://gtms01.alicdn.com/tps/i1/T1JQdUFcNkXXaj2fvh-168-84.png',
        'http://gtms01.alicdn.com/tps/i1/T1p4tyFoJgXXbBhDcr-640-265.png',
        'http://gtms01.alicdn.com/tps/i1/T1cLBJFe8jXXbBhDcr-640-265.png',
        'http://gtms01.alicdn.com/tps/i1/T10KcqFnpaXXbhC_3r-640-371.png',
        'http://gtms01.alicdn.com/tps/i1/T1W3RFFc0jXXcCcBHm-69-69.png',
        'http://gtms01.alicdn.com/tps/i1/T18zR.FdNhXXX03Pjq-237-27.png', 
        'http://gtms01.alicdn.com/tps/i1/T19QVUFlxiXXa_Ptjr-88-87.png',
        'http://gtms01.alicdn.com/tps/i1/T1e5uaFiVhXXaMbbPe-35-33.png',
        'http://gtms01.alicdn.com/tps/i1/T19WinFkXhXXaTzlLc-31-30.png',
        'http://gtms01.alicdn.com/tps/i1/T1HiClFbxgXXaBQJvs-94-59.png'
    ]

    function init (done) {
        var stage = N1.stage.$;
        loaderSprite = new RectSprite({
            x: 0,
            y: 0,
            width: stage.width,
            height: stage.height,
            textColor: '#ffffff',
            textAlign: 'center',
            verticalAlign: 'middle',
            text: 'loading...'
        }).appendTo(N1.stage.layer1);

        loader = new CEC.Loader(assets, function (p) {
            loaderSprite.setText('loading: ' + Math.ceil(p*100) + '%');
            if (p >= 1) {
                done && done();
            }
        });
    }

    this.init = init;
});