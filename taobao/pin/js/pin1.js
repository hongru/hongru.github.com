;(function () {
    //opt: top, left, width, height
    function Pin1 (imgs, opt) {
        this.defaults = {
            container: null,
            cont_w: 1000
        }
        this.defaults = $.extend(this.defaults, opt || {});
        
        this.$cont = $(this.defaults.container);
        this.$cont.width(this.defaults.cont_w);
        
        this.__init();
    }
    Pin1.prototype = {
        __init: function () {
            
        }
    }
    
    $.Pin1 = Pin1;

})();