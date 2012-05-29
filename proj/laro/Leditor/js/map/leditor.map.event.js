/**
 * leditor.map.event
 */

Leta.NS('Leditor.map.event', function (L) {
    var pkg = this,
        $ = L.$,
        $E = L.event,
        $LM = Leditor.map;

    var tempImg;
    function createTempImg () {
        tempImg = $('<img id="temp-img" src="about:blank" alt="" />').appendTo(document.body);
        tempImg.css({
            'position': 'absolute',
            'display': 'none',
            'left' : 0,
            'opacity': 0.5,
            'top': 0
        });
    }

    function clickOnSourceImg (e, tar) {
        tempImg.attr('src', tar.src);
        $LM.usingImg = tempImg;
    }
    function onMousemove (e) {
        if ($LM.usingImg) {
            var dim = tempImg.dim();
            tempImg.show('block').css({
                'left': e.clientX - dim.width/2,
                'top': e.clientY - dim.height/2
            });
        }
    }

    function bind () {
        $E.dispatch(document.body, 'click', {
            'get-img': clickOnSourceImg
        });

        $E.on(document, 'mousemove', onMousemove);
        
    }

    this.init = function () {
        createTempImg();
        bind();
    }

});
