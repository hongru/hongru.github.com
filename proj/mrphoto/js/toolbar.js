$.NS('FiPhoto.toolbar', function () {
    var pkg = this;

    this.init = function () {
        this.create();
        this.bind();
    };
    this.create = function () {
        pkg.$btns = FiPhoto.$toolbtns || $('#toolbar a');
    };
    this.bind = function () {
        pkg.$btns.click(function (e) {
            
            var cmd = $(this).attr('data-cmd');
            switch(cmd) {
                case 'cut':
                    e.preventDefault();
                    FiPhoto.cut.show();
                    break;
                case 'roll-left':
                    e.preventDefault();
                    FiPhoto.roll.left();
                    break;
                case 'roll-right':
                    e.preventDefault();
                    FiPhoto.roll.right();
                    break;
                case 'blur':
                    e.preventDefault();
                    FiPhoto.blur.show();
                    break;
                case 'save':
                    //FiPhoto.save();
                    break;
            }
        })
    };
    this.show = function () {
        FiPhoto.$toolbar.fadeIn();
    }
});

