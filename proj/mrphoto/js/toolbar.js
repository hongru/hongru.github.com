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
            e.preventDefault();
            var cmd = $(this).attr('data-cmd');
            switch(cmd) {
                case 'cut':
                    FiPhoto.cut.show();
                    break;
                case 'roll-left':
                    FiPhoto.roll.left();
                    break;
                case 'roll-right':
                    FiPhoto.roll.right();
                    break;
                case 'blur':
                    FiPhoto.blur.show();
                    break;
                case 'save':
                    FiPhoto.save();
                    break;
            }
        })
    };
    this.show = function () {
        FiPhoto.$toolbar.fadeIn();
    }
});

