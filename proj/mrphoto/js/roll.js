$.NS('FiPhoto.roll', function () {
    var pkg = this;
    this.init = function () {
        //this.create();
    };
    this.create = function () {
        if (!this.$tmpCanvas && !this.cvs) {
            this.$tmpCanvas = $('<canvas></canvas>').appendTo('body');
            this.cvs = this.$tmpCanvas.get(0);

            this.ctx = this.cvs.getContext('2d');	
        }
        this.cvs.width = FiPhoto.canvas.height;
        this.cvs.height = FiPhoto.canvas.width;
    }
    this.do = function (dir) {
        if (dir == undefined) {
            dir = 'left';
        }
        var angle = 0;
        if (dir == 'left') {
            angle = Math.PI/2;
        } else if (dir == 'right') {
            angle = -Math.PI/2;
        }

        this.create();
        this.ctx.save();
        this.ctx.translate(this.cvs.width/2, this.cvs.height/2);
        this.ctx.rotate(angle);
        this.ctx.translate(-this.cvs.height/2, -this.cvs.width/2);
        this.ctx.drawImage(FiPhoto.image, 0, 0, FiPhoto.image.width, FiPhoto.image.height);
        this.ctx.restore();

        //FiPhoto.image.src = this.ctx.toDataURL('image/png');
        var type = FiPhoto.$tabWrap.find('li.current').attr('data-cmd');
        var src = this.cvs.toDataURL('image/png');

        FiPhoto.setFx(type, src);

        //this.destory();
    }
    this.left = function () {
        this.do('left');
    };
    this.destory = function () {
        this.$tmpCanvas.remove();
        this.$tmpCanvas = null;
        this.cvs = null;
        this.ctx = null;
    };
    this.right = function () {
        this.do('right');
    }
});

