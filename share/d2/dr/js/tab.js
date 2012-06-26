Director('tab').$define(function () {
    var me = this;
    function dispatchClickEvent () {
        me.util.addEvent(document.body, 'click', function (e) {
            e = e || window.event;
            var tar = e.target || e.srcElement;
            tar = me.util.bubbleTo(tar, document.body, 'data-cmd');
            
            if (tar) {
                var cmd = tar.getAttribute('data-cmd'),
                    param = tar.getAttribute('data-param');
                switch (cmd) {
                    case 'tab':
                        me.go(param);
                        break;
                }
            }
        });
    }
    // firstAct auto called when $wake()
    this.$act = function () {
        dispatchClickEvent(); 
        me.go(0);
        
        setTimeout(function () {
            me.$notify('heartbreak', 'hongru');
        }, 5000);
    };
    
    this.log = function (msg) {
        console && console.log(msg);
    };
    
    // go current tab
    this.go = function (ind) {
        ind = parseInt(ind);
        me.$actors.hd.go(ind);
        me.$actors.con.go(ind);
    }
});