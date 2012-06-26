Director('tab').$actor('con').$define(function () {
    var me = this,
        dr = me.$director;
    function getEl () {
        var els = {};
        els.wrapper = dr.util.$('tab-content');
        me.els = els;
    }
    function render () {
        var html = dr.tpl.tc; // maybe templete(dr.tpl.tc, [data]);
        me.els.wrapper.innerHTML = html;
    }
        
    // auto called by dr's $wake
    this.$wake = function () {
        dr.log('con wake');
        getEl();
        render();
        
        me.$focus('heartbreak', function (who) {
            dr.log('[actor '+ me.name +'] know ' + who + ' heart break');
        });
    };
    
    this.go = function (ind) {
        var oldEl = me.els.wrapper.querySelector('li.current'),
            lis = me.els.wrapper.querySelectorAll('li');
        oldEl && dr.util.removeClass(oldEl, 'current');
        lis[ind] && dr.util.addClass(lis[ind], 'current');
        
        
    }
});