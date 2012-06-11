/* horizon main */
$.NS('Ho', function () {
    var lt = {}, rt = {};
    var mask_fix = {
        // children
        '0': {
            left: -170,
            top: -222,
            width: 404,
            height: 450,
            fit: 224,
            img: $('#mask0')[0]
        },
        '1': {
            left: -130,
            top: -242,
            width: 397,
            height: 447,
            fit: 218,
            img: $('#mask1')[0]
        },
        // young
        '2': {
            left: -82,
            top: -90,
            width: 180,
            height: 180,
            fit: 90,
            img: $('#mask2')[0]
        },
        '3': {
            left: -44,
            top: -77,
            width: 180,
            height: 180,
            fit: 92,
            img: $('#mask3')[0]
        },
        // girls
        '4': {
            left: -71,
            top: -80,
            width: 200,
            height: 210,
            fit: 148,
            img: $('#mask4')[0]
        },
        '5': {
            left: -89,
            top: -125,
            width: 264,
            height: 238,
            fit: 155,
            img: $('#mask5')[0]
        }
    };
    
    var scale = [];
    
    function drawFace(data, i) {
        var width = Math.floor(data.width || data.w);
        var height = Math.floor(data.height || data.h);
        var x = Math.floor(data.x),
            y = Math.floor(data.y);
        
        var cvs = faceAdjust._bgCanvas;
        var canvasPos = $(cvs).offset();

        var faceWidth = width;
        
        scale[i] = (faceWidth / mask_fix[i].fit);

        $('<div class="faceBox"></div>').css({
            width: width,
            height: height,
            left: (x + canvasPos.left),
            top: (y + canvasPos.top)
        }).appendTo('body');
    }
    
    function drawFacial(data, n) {
        var width = data.w;
        var height = data.h;
        var cvs = faceAdjust._bgCanvas;
        var canvasPos = $(cvs).offset();

        var points = ["eye_left", "eye_right", "mouth_left", "mouth_center", "mouth_right", "nose", "ear_left", "ear_right"];

        for(var i = 0; i < points.length; i++) {
            var values = data[points[i]];
            if (values) {
                $('<div class="facePoint"></div>').css({
                    left: (values.x + canvasPos.left),
                    top: (values.y + canvasPos.top)
                }).appendTo('body');    
                if (points[i] == 'eye_left') {
                    lt.x = Math.floor(values.x + Math.floor(mask_fix[n].left * scale[n]));
                    lt.y = Math.floor(values.y + Math.floor(mask_fix[n].top * scale[n]));
                }
            }
        }
    }
    
    function makeUp (i) {
        face.setContext(faceAdjust._bgCanvas.getContext('2d'));
       // face.draw('3', 250, 350, 141, 120);
       face.draw(mask_fix[i].img, lt.x, lt.y, Math.floor(mask_fix[i].width*scale[i]), Math.floor(mask_fix[i].height*scale[i]));
    }
    
    // init fx canvas
    try {
        var canvas = fx.canvas();
        if (!!canvas) {
            FiPhoto.canvas = canvas;         
            FiPhoto.image = $('#tmpimg')[0];
            FiPhoto.$con = $('#container');
            FiPhoto.$fxCon = $('#step1Source');
            
            FiPhoto.setHref = function () {
                // todo;
                $('#save-btn').attr('href', FiPhoto.canvas.toDataURL()).show();
            }
        }

    } catch(e) {
        alert(e.message);
    }
    
    this.toOlder = function (data) {
        //console.log(data);
        for (var i = 0; i < data.length; i ++) {
            // 适配测试图片
            var n = i;
            if (/children/.test(g_data.fileName)) {
                n += 0;
            } else if (/young/.test(g_data.fileName)) {
                n += 2;
            } else if (/girls/.test(g_data.fileName)) {
                n += 4;
            } else {
                n += 0;
            }
            
            drawFace(data[i], n);
            drawFacial(data[i], n);
            // 画皱纹
            makeUp(n);            
        }
        
        this.clearFacePoint(1000);
    };
    
    this.bindFxClick = function () {
        $('#photoBar img').unbind('click').bind('click', function (e) {
            $('#save-btn').hide();
            var fx = $(this).attr('fx');
            FiPhoto.fx[fx] && FiPhoto.fx[fx]();
        });
    };
    
    this.clearFacePoint = function (delay) {
        setTimeout(function () {
            $('.faceBox, .facePoint').fadeOut();
        }, delay)
        
    }
});