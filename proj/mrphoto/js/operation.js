/* FiPhoto.operation */
// 第一步的图片手术
$.NS('FiPhoto.operation', function () {
    var pkg = this;
    var step1 = {};

    this.imgInfo = {
        src: '',
        width: 0,
        height: 0,
        limitW: 0,
        limitH: 0
    }
    this.limitMode = '11';
    this.limitInfo = {
        '11': {
            normal: {
                width: 650,
                height: 650,
                left: 1,
                top: 1,
                borderW: 0,
                borderH: 0
            },

            b1: {
                width: 610,
                height: 610,
                left: 21,
                top: 21,
                borderW: 20,
                borderH: 20,
                borderStyle: '#fff',
                borderRadius: 0
            },
            b2: {
                width: 610,
                height: 610,
                left: 21,
                top: 21,
                borderW: 20,
                borderH: 20,
                borderStyle: '#000',
                borderRadius: 0
            }
        },
        '43': {
            normal: {
                width: 800,
                height: 600,
                left: 1,
                top: 1,
                borderW: 0,
                borderH: 0
            },
            
            b1: {
                width: 760,
                height: 560,
                left: 21,
                top: 21,
                borderW: 20,
                borderH: 20,
                borderStyle: '#fff',
                borderRadius: 0
            },
            b2: {
                width: 760,
                height: 560,
                left: 21,
                top: 21,
                borderW: 20,
                borderH: 20,
                borderStyle: '#000',
                borderRadius: 0
            }
        }
    };


    this.init = function (oSize) {
        if (oSize == undefined) { oSize = FiPhoto.size11 };
        this.size = oSize;		
        this.getStepEls();
        this.bind();
    };

    this.initCanvas = function () {
        this.create();
        this.setCvsPos();
    }

    this.getStepEls = function () {
        step1.$tit = $('#fx-step1 .ea-title');
        step1.$btns = $('#fx-step1 .btn');
        step1.$l_btns = $('#fx-step1 .limit-btn');
        step1.$l_btnbg = $('#limit-btn-bg');
        step1.$dropArea = $('#drop-area');
        step1.$container = $('#container');

        this['step1'] = step1;
    };

    this.bind = function () {
        $('body').unbind('click.dispatch');
        $('body').bind('click.dispatch', function (e) {
            // reset
            FiPhoto.CLICKIN = {};
            var bubble = FiPhoto.getCmdInfo(e.target);
            if (bubble) {
                var cmd = bubble.cmd,
                    el = bubble.el;
                    cmd != 'save' && e.preventDefault();
                switch(cmd) {
                    case 'limit':
                        FiPhoto.CLICKIN['limit'] = 1;
                        pkg.toggleLimitBtn($(el));
                        break;
                    case 'limitin':
                        FiPhoto.CLICKIN['limit'] = 1;
                        pkg.l_btnClick($(el));
                        break;
                    case 'rotate':
                        pkg.rotate();
                        break;
                    case 'border':
                        pkg.toggleBorderBtn($(el));
                        pkg.drawImage();
                        break;
                    case 'scale':
                        pkg.toggleScaleBtn($(el));
                        break;
                    case 'next':
                        FiPhoto.setFx('normal', pkg.cvs.toDataURL());
                        FiPhoto.goStep2();
                }
            }

            if (!FiPhoto.CLICKIN['limit']) { pkg.deactiveLimitBtn(); }

        });
    };

    this.hideAllPanel = function () {

    };

    this.l_btnClick = function ($el) {
        var cur = parseInt(pkg['step1']['$l_btnbg'].css('left'));
        var ccur = parseInt($el.css('left'));
        if (cur != ccur) {
            pkg.limitMode = ccur > cur ? '43' : '11';
            var bk = FiPhoto.BORDER || 'normal';
            var info = pkg.limitInfo[pkg.limitMode][bk];
            
            pkg['step1']['$l_btnbg'].stop().animate({'left': ccur});
            pkg.deactiveLimitBtn();

            step1.$container.stop().animate({
                'width': info['width'] + 2*info.borderW,
                'height': info['height'] + 2*info.borderH
            }, {
                step: function (now, fx) {
                    if (pkg.cvs) {
                        if (fx.prop == 'width') {
                            pkg.cvs.width = now - 2*info.borderW;
                            step1.$dropArea.css('width', now+2);
                            FiPhoto.$doc.width(now + 100);
                            FiPhoto.docWidthChange();
                        } else if (fx.prop == 'height') {
                            pkg.cvs.height = now - 2*info.borderH;
                        }
                        pkg.drawImage();
                    }

                }
            });

            // fx-container
            $('#fx-container').css({
                width: info['width'],
                height: info['height']
            });

        } 

    };

    this.toggleLimitBtn = function ($btn) { 
        $btn.hasClass('active') ? this.deactiveLimitBtn($btn) : this.activeLimitBtn($btn);
    };
    this.deactiveLimitBtn = function ($btn) {
        $btn = $btn || $('.btn.limit');
        $btn.removeClass('active');
        $('.limit-panel').hide();
    };
    this.activeLimitBtn = function ($btn) {
        $btn.addClass('active');
        var pos = $btn.position();
        $('.limit-panel').css({
            left: (pos.left + 15),
            top: (pos.top + 50)
        }).show();
    };


    this.rotate = function () {
        pkg.imgInfo.rotate += Math.PI/2;
        if (pkg.imgInfo.rotate == 2*Math.PI) {
            pkg.imgInfo.rotate = 0;
        }
        pkg.drawImage();
    };

    this.toggleBorderBtn = function () {
        FiPhoto.BORDER ? pkg.removeBorder() : pkg.addBorder();
        // todo
    };
    
    this.applyInfo = function (info) {
        pkg.imgInfo.limitW = info.width;
        pkg.imgInfo.limitH = info.height;
        this.cvs.width = info.width;
        this.cvs.height = info.height;
        this.cvs.style['left'] = parseInt(info.left) + 'px';
        this.cvs.style['top'] = parseInt(info.top) + 'px';
        this.cvs.parentNode.style['background'] = info.borderStyle || 'transparent';
        this.drawImage();   
    };
    this.addBorder = function (borderType) {
        if (borderType == undefined) borderType = 'b1';
        FiPhoto.BORDER = borderType;
        
        var info = this.limitInfo[this.limitMode][borderType];
        info && this.applyInfo(info);
        
    };
    this.removeBorder = function () {
        FiPhoto.BORDER = 0;
        
        var info = this.limitInfo[this.limitMode]['normal'];
        info && this.applyInfo(info);
    };

    this.toggleScaleBtn = function () {

    };

    this.create = function () {
        // 创建一个 canvas 用于 图片手术， 大小为 650*2；
        this.$canvas = $('<canvas class="operation-cvs"></canvas>').appendTo(FiPhoto.$con);
        this.cvs = this.$canvas.get(0);
        this.cvs.width = this.size.w;
        this.cvs.height = this.size.h;
        this.ctx = this.cvs.getContext('2d');

    };

    this.setCvsPos = function () {
        this.$canvas.css({
            position: 'absolute',
            display: 'none',
            left: 1,
            top: 1
        });
    };

    this.initImage = function (src) { 
        var callCB = false;
        var $img = $('#operation-image');
        if (!$img[0]) {
            $img = $('<img id="operation-image" alt="" src="'+ src +'" />').appendTo(FiPhoto.$imgWrap);
        } else {
            $img.attr('src', src);
        }
        this.$operationImage = $img;

        var img = this.$operationImage[0];
        if (img.complete) { 
            imgLoadedCallback();
            return;
        } 
        this.$operationImage.load(function () { imgLoadedCallback() });

        function imgLoadedCallback () {
            if (callCB) return; 

            FiPhoto.$imgWrap.show();
            pkg.imgInfo = {
                img: img,
                src: img.src,
                left: 0,
                top: 0,
                width: $(img).width(),
                height: $(img).height(),
                limitW: pkg.size.w,
                limitH: pkg.size.h,
                offsetX: 0,
                offsetY: 0,
                rotate: 0,
                scale : 1
            };
            FiPhoto.$imgWrap.hide();
            pkg.setScale(1);
            pkg.drawImage();
            pkg.checkStep(1);
            pkg.bindCanvas();

            callCB = true;
        }
    };

    this.setScale = function (s) {
        if (this.cvs && this.ctx && this.imgInfo) {
            this.imgInfo.scale = s;
            this.imgInfo.showWidth = this.imgInfo.width * s;
            this.imgInfo.showHeight = this.imgInfo.height * s;
        }
    };


    // bind canvas to move image and scale
    this.bindCanvas = function () {
        this.$canvas.unbind('mousewheel');
        this.$canvas.unbind('mousedown');

        this.$canvas.bind('mousewheel', function (e, delta, deltaX, deltaY) {
            e.preventDefault();
            //console.log(delta, deltaX, deltaY);

            if (delta > 0 && pkg.imgInfo.scale < 3) {
                // zoom +
                pkg.setScale(pkg.imgInfo.scale + 0.1);
                //pkg.ctx.scale(pkg.imgInfo.scale, pkg.imgInfo.scale);
                pkg.drawImage();

            } else if (delta < 0 && pkg.imgInfo.scale > 0.2) {
                // zoom -
                pkg.setScale(pkg.imgInfo.scale - 0.1);
                pkg.drawImage();
            }
        });

        this.$canvas.bind('mousedown', function (e) {
            pkg.startDrag = true;
            pkg.dragInfo = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                imgOffsetX: pkg.imgInfo.offsetX,
                imgOffsetY: pkg.imgInfo.offsetY
            };
        }).bind('mouseleave', function (e) {
            pkg.startDrag = false;
            clearTimeout(pkg.canvasTimer);
            $('#ctrl-info').fadeOut();		
        }).bind('mouseenter', function (e) {
            clearTimeout(pkg.canvasTimer);
            pkg.canvasTimer = setTimeout(function () {
                $('#ctrl-info').fadeIn();
            }, 500);	
        });

        $(window).bind('mouseup', function (e) {
            pkg.startDrag = false;
        }).bind('mousemove', function (e) {
            if (!!pkg.startDrag && pkg.dragInfo) {
                var disX = e.clientX - pkg.dragInfo.mouseX,
                    disY = e.clientY - pkg.dragInfo.mouseY;

                var deg = pkg.imgInfo.rotate;
                var flag = (2*deg/Math.PI)%2 == 0 ? 1 : -1;
                pkg.imgInfo.offsetX = pkg.dragInfo.imgOffsetX + flag*(disX*Math.cos(deg) - disY*Math.sin(deg));
                pkg.imgInfo.offsetY = pkg.dragInfo.imgOffsetY + flag*(disX*Math.sin(deg) + disY*Math.cos(deg));

                pkg.drawImage();
            }
        })
    };

    this.drawImage = function () {
        var ctx = this.ctx;
        var cvs = this.cvs;
        var info = this.imgInfo;
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        ctx.save();
        ctx.translate(cvs.width/2, cvs.height/2);
        ctx.rotate(info.rotate);
        ctx.translate(-cvs.width/2, -cvs.height/2);
        ctx.drawImage(info.img, 0, 0, info.width, info.height, cvs.width/2 - info.showWidth/2 + info.offsetX, cvs.height/2 - info.showHeight/2 + info.offsetY, info.showWidth, info.showHeight);
        ctx.restore();

        this.$canvas.show();
    };

    // 检测 当前step
    this.checkStep = function (step) {
        var easing = 'easeOutBack';
        if (step == undefined) { step = 1; }
            this.scrollToBottom(panelMove);

            function panelMove () {
                FiPhoto.$toolsUl.animate({'left': -(FiPhoto.$doc.width()*step)})
                FiPhoto.step = step;
            }

        //}
    };

    this.scrollToBottom = function (cb) {
        if (cb == undefined) { cb = function () {} }
        var h = Math.max($('body').height(), $('html').height());
        var wh = $(window).height();
        $('html, body').animate({
            scrollTop: (h-wh)
        }, cb);
    }

});

