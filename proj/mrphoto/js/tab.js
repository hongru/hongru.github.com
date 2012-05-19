$.NS('FiPhoto.tab', function () {
    var pkg = this;
    this.init = function () {
        this.create();
        this.bind();
    };
    this.create = function () {
        var dom = [];
        dom.push('<ul>');
        for (var k in FiPhoto.fx) {
            dom.push('<li data-cmd="'+ k +'">'+ k +'</li>');
        }
        dom.push('</ul>');
        FiPhoto.$tabWrap.html(dom.join(''));

        pkg.$ul = FiPhoto.$tabWrap.find('ul');
        pkg.$li = pkg.$ul.find('li');

    };
    this.bind = function () {
        pkg.$li.bind('click', function (e) {
            e.preventDefault();
            var cmd = $(this).attr('data-cmd');
            FiPhoto.setFx(cmd);
        });
    };
    this.show = function () {

        $('#filter-area').fadeIn();
    };
    this.update = function (type) {
        pkg.$li.removeClass('current');
        pkg.$li.each(function (i) {
            if ($(this).attr('data-cmd') == type) {
                $(this).addClass('current');
                return;
            }
        })
    }
})

