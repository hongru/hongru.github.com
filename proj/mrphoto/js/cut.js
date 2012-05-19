
$.NS('FiPhoto.cut', function () {
    var pkg = this;
    var isDragStart = false,
        mousePos = {x: 0, y: 0},
        cutInfo = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        },
        canvasInfo = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };

    this.init = function () {
        this.create();
        this.bind();
    };
    this.bind = function () {
        this.$cutWin.bind('mousedown', function (e) { pkg.dragStart(e) });
        $(document).bind('mousemove.dragCutWindow', function (e) { pkg.mouseMove(e) })
            .bind('mouseup.dragCutWindow', function (e) { pkg.mouseUp(e) });
    };
    this.dragStart = function (e) {
        isDragStart = true;
        pkg.updateInfo(e);
    }
    this.mouseMove = function (e) {
        if (!isDragStart) { return }
      /*  var newLeft = cutInfo.left + (e.clientX - mousePos.x),
            newTop = cutInfo.top + (e.clientY - mousePos.y),
            maxLeft = (canvasInfo.left + canvasInfo.width - cutInfo.width),
            maxTop = (canvasInfo.top + canvasInfo.height - cutInfo.height);
        */
        var newLeft = cutInfo.left + (e.clientX - mousePos.x),
            newTop = cutInfo.top + (e.clientY - mousePos.y);
        pkg.$cutWin.css({
            left: newLeft,
            top: newTop,
            backgroundPosition: '-'+(e.clientX - mousePos.x)+'px -'+(e.clientY - mousePos.y)+'px'
        });


    }
    this.mouseUp = function (e) {
        isDragStart = false;
        pkg.updateInfo(e);
    }
    this.updateInfo = function (e) {
        mousePos = {
            x: e.clientX,
            y: e.clientY
        };
        canvasInfo = pkg.getCanvasInfo();
        cutInfo = pkg.getCutInfo();
    }
    this.create = function () {
        this.$mask = $('<div class="mask hide" id="mask"></div>');
        this.$cutWin = $('<div class="cut-window hide" id="cut-window"></div>');
        this.$mask.appendTo('body');
        this.$cutWin.appendTo('body');
    };
    this.show = function () {
        /*this.$mask.show();
        this.updateCutWin();
        this.$cutWin.css({
            backgroundImage: 'url('+FiPhoto.canvas.toDataURL()+')',
            backgroundRepeat: 'no-repeat'
        })
        this.$cutWin.show();
        */
    };
    this.updateCutWin = function () {
        var info = this.getCanvasInfo();
        var wh = Math.min(info.width, info.height);
        info.left -= 1;
        info.top -= 1;
        info.width = wh;
        info.height = wh;
        this.$cutWin.css(info);
    }
    this.getCanvasInfo = function () {
        var pos = $(FiPhoto.canvas).position();
        var ret = {
            left: pos.left,
            top: pos.top,
            width: $(FiPhoto.canvas).width(),
            height: $(FiPhoto.canvas).height()
        };
        return ret;
    };
    this.getCutInfo = function () {
        var pos = $(pkg.$cutWin).position();
        var ret = {
            left: pos.left,
            top: pos.top,
            width: $(pkg.$cutWin).width(),
            height: $(pkg.$cutWin).height()
        }
        return ret;
    }
});

