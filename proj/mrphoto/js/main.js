// main script
$.NS('FiPhoto', function () {
    var pkg = this;
    var downloadMime = 'image/octet-stream';

    this.size11 = {w: 650, h: 650};
    this.size43 = {w: 800, h: 600};
    this.step = 0;
    this.borderClass = 'border1 border2 border3 border4';
    
    function generateCanvas(succFunc, errFunc) {
        pkg.$con = $('#container');
        pkg.$fxCon = $('#fx-container');
        pkg.$wrap = pkg.$con.parent();
        pkg.$imgWrap = $('#image-wrap');
        pkg.$tabWrap = $('#fx-tab-container');
        pkg.$toolbar = $('#toolbar');
        pkg.$toolbtns = $('#toolbar a');
        pkg.$doc = $('#doc');
        pkg.$mode = $('#mode');
        pkg.$modeli = $('#mode li');
        pkg.$toolsUl = $('#tools-ul')
        try {
            var canvas = fx.canvas();
            if (!!canvas) {
                pkg.canvas = canvas;                      
                succFunc(canvas);
            }

        } catch(e) {
            alert(e);
            !!errFunc && errFunc();
            return;
        }
    }

    function bindEvent() {
        freeModeBind();
        pkg.$modeli.bind('click', function (e) {
            pkg.setMode($(this).attr('data-mode'));
        });
        $(window).resize(resize);
    }

    function freeModeBind () {
        
        pkg.$wrap.bind('dragenter', function (e) {
            e.preventDefault();
            
            pkg.$fxCon.hide();
            pkg.operation.cvs && pkg.operation.removeBorder();
            pkg.$con.show();
            
            pkg.$wrap.addClass('dragover');
            pkg.$wrap.addClass('noimg');
            pkg.$con.html('');
        }).bind('dragleave', function (e) {
            e.preventDefault();
            pkg.$wrap.removeClass('dragover');
        }).bind('dragover', function (e) {
            e.preventDefault();

        }).bind('drop', function (e) {
            e.preventDefault();

            var dt = e.dataTransfer || e.originalEvent.dataTransfer;  
            var files = dt.files; 

            pkg.handleFiles(files);  
        });
        
        pkg.$con.bind('mousemove', function (e) {
            if (pkg.$con.find('*').length == 0) {
                pkg.$inputUpload && pkg.$inputUpload.css({
                    left: e.offsetX - 20,
                    top: e.offsetY - 10
                });
            }
        });
    }

    function limitModeBind () {

    }

    function errCallback() {
        pkg.$con.html('Sorry, Your browser do not support webGL')
    }

    function _init () {
        bindEvent();
        pkg.setMode();
    }
    function docWidthChange () {
        var w = pkg.$doc.width();
        pkg.$toolsUl.css({
            width: 3*w,
            left: -pkg.step*w
        });
        pkg.$toolsUl.find('.panel').width(w);
    }
    function resize() {
        var doch = pkg.$doc.height(),
            wh = $(window).height();
        pkg.$doc.height(Math.max(wh, doch));
    }
    function handleFileInput () {
        var inputFile = document.getElementById('input-upload');
        if (!inputFile) {
            $('<input type="file" class="input-upload" title="" id="input-upload" />').appendTo('#drop-area');
        }
        pkg.$inputUpload = $('#input-upload');
        pkg.$inputUpload.bind('change', function (e) {
            pkg.handleFiles($(this).get(0).files);
        });
    }

    this.mode = 'limit'; // | limit
    this.docWidthChange = docWidthChange;

    this.init = function () {
        generateCanvas(_init, errCallback);
        docWidthChange();
        resize();
        handleFileInput();
        
        FiPhoto.operation.init();
        FiPhoto.tab.init();
        FiPhoto.toolbar.init();
        FiPhoto.cut.init();
        FiPhoto.roll.init();
        FiPhoto.share.init();

    };
    this.setMode = function (mode) {
        if (mode == undefined) {
            mode = this.mode || 'free';
        }
        this.mode = mode;
        pkg.$modeli.each(function () {
            if ($(this).attr('data-mode') == mode) {
                $(this).addClass('current');
            } else {
                $(this).removeClass('current');
            }
        })
    };
    this.handleFiles = function (files) {
        for (var i = 0; i < files.length; i++) {  
            var file = files[i];  
            var imageType = /image.*/;  

            if (!file.type.match(imageType)) {  
              continue;  
            }  

            var reader = new FileReader();  
            reader.onload = function(e){ 
                if (pkg.mode == 'free') {
                    // 直接进入滤镜状态
                    pkg.setFx('normal', e.target.result);
                    pkg.$wrap.removeClass('dragover');
                    pkg.$wrap.removeClass('noimg');	
                } else {
                    pkg.$wrap.removeClass('dragover');
                    pkg.$wrap.removeClass('noimg');	
                    !FiPhoto.$con.find('canvas')[0] && FiPhoto.operation.initCanvas();
                    FiPhoto.operation.initImage(e.target.result);
                }

            }

            reader.readAsDataURL(file);  
        }  
    }


    this.setFx = function (type, url) {
        var image = document.getElementById('fx-image');
        function doUpdate () {
            if (FiPhoto.BORDER) {
                var info = FiPhoto.operation.limitInfo[FiPhoto.operation.limitMode][FiPhoto.BORDER];
                FiPhoto.canvas.style['left'] = info.left + 'px';
                FiPhoto.canvas.style['top'] = info.top + 'px';
                FiPhoto.$fxCon.css({
                    width: (info.width + 2*info.borderW),
                    height: (info.height + 2*info.borderH)
                });
                info.borderStyle ? FiPhoto.$fxCon.addClass(info.borderStyle) : FiPhoto.$fxCon.removeClass('border1')
            }
            FiPhoto.fx[type]();
            FiPhoto.tab.show();
            FiPhoto.tab.update(type);
            FiPhoto.toolbar.show();
        }
        
        if (!image) {
            image = document.createElement('img');
            image.id = 'fx-image';

            pkg.$imgWrap.append(image);
        }
        pkg.image = image;
        var oldUrl = pkg.image.src;

        if (url) {
            pkg.image.src = url;
        }
        var ww = pkg.image.width,
            hh = pkg.image.height,
            mm = Math.max(ww, hh);
        if (!url && mm > 0 && mm <= 1024) {
            doUpdate();
            return;
        }
        $.imgReady(url, function () {

            var newW = this.width, newH = this.height;
            var max = Math.max(newW, newH);
            if (max > 1024) {
                if (max == newW) {
                    var div = newH/newW;
                    newW = 1024;
                    newH = Math.round(newW * div);
                } else if (max == newH) {
                    var div = newW/newH;
                    newH = 1024;
                    newW = Math.round(newH*div);
                }
            }
            pkg.image.width = newW;
            pkg.image.height = newH;

            doUpdate();
        });

    };

    // save image
    this.setHref = function () {
        this.CANDOWNLOAD = false;
        $('#save-btn').hide();
        var _url = pkg.canvas.toDataURL();      
        //document.location.href = dataURL.replace(/image\/png/i, downloadMime);
        var border = FiPhoto.BORDER || 'normal',
            info = FiPhoto.operation.limitInfo[FiPhoto.operation.limitMode][border];
            
        var tmpCanvas = document.createElement('canvas'),
            tmpCtx = tmpCanvas.getContext('2d'),
            tmpImg = new Image();
        tmpCanvas.width = info.width + 2*info.borderW;
        tmpCanvas.height = info.height + 2*info.borderH;
        if (info.borderStyle) {
            if (info.borderStyle == 'border1' || info.borderStyle == 'border2' || info.borderStyle == 'border4') {
                tmpCtx.fillStyle = pkg.$fxCon.css('backgroundColor');
                tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
                
            } else if (info.borderStyle == 'border3') {
                var _img = new Image();
                _img.src = 'http://hongru.github.com/proj/mrphoto/images/border3.png';
                _img.onload = function () {
                    var pp = tmpCtx.createPattern(_img, 'repeat');
                    tmpCtx.fillStyle = pp;
                    tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
                }
            }
        }
        
        tmpImg.src = _url;

        tmpImg.onload = function () {
            tmpCtx.drawImage(tmpImg, info.borderW, info.borderH);
            $('#save-btn').attr('href', tmpCanvas.toDataURL()).show();
            this.CANDOWNLOAD = true;
            
            tmpCanvas = null;
            tmpCtx = null;
            tmpImg = null;
        }
        
    }
    this.createImage = function (src) {
        var img = document.createElement('img');
        img.src = src;
        return img;
    };

    // get click cmd el & info
    this.CLICKIN = {};
    this.getCmdInfo = function (el, toEl, filterAttr) {
        if (!toEl) {toEl = document.body}
        if (!filterAttr) {filterAttr = 'data-cmd'}
        if (!el) { return null; }

        var related = el.getAttribute('data-related');
        if (!!related) {
            this.CLICKIN[related] = 1;
        }

        var cmd = el.getAttribute(filterAttr);
        if (!!cmd) {
            return {
                el: el,
                cmd: cmd
            };
        } else if (el.parentNode && el.parentNode.nodeType == 1) {
            return arguments.callee.call(this, el.parentNode, toEl, filterAttr);
        }
    };

    // btn 移动到第二步
    this.goStep2 = function () {
        FiPhoto.setFx('normal', FiPhoto.operation.cvs.toDataURL());
        FiPhoto.operation.checkStep(2);
    };
    this.goStep1 = function () {
        pkg.$fxCon.hide();
        pkg.$con.show();
        FiPhoto.operation.checkStep(1);
    }
});

