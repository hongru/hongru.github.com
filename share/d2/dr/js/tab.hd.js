Director('tab').$actor('hd').$define(function () {
    var me = this,
        dr = me.$director;
    function getEl () {
        var els = {};
        els.wrapper = dr.util.$('tab-header');
        me.els = els;
    }
    function render () {
        var html = dr.tpl.th; // maybe templete(dr.tpl.th, [data]);
        me.els.wrapper.innerHTML = html;
    }
    // auto called by dr's $wake
    this.$wake = function () {
        dr.log('hd wake');
        getEl();
        render();
    };
    
    this.go = function (ind) {
        var oldEl = me.els.wrapper.querySelector('li.current'),
            lis = me.els.wrapper.querySelectorAll('li');
        oldEl && dr.util.removeClass(oldEl, 'current');
        lis[ind] && dr.util.addClass(lis[ind], 'current');
    }
});