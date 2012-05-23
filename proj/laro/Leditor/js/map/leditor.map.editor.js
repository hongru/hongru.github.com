// map.editor
Leta.NS('Leditor.map.editor', function (L) {
    var pkg = this,
        initialized = false;
    
    var defaults = {
        cols: 20,
        rows: 10,
        unitW: 0,
        unitH: 0
    };
    var tpl = {
        grid: '<div class="grid" style="width:<%= width %>px;height:<%= height %>px"><div class="grid-inner" style="height:<%= (height-1) %>px"></div></div>'
    };
    
    function fixDefaults (w, h) {
        defaults.unitW = w;
        defaults.unitH = h;
    }
    function initGrid () {
    /*    Leditor.map.els.ea.css({
            width: defaults.cols * defaults.unitW,
            height: defaults.rows * defaults.unitH
        });*/
        addRows();
    }
    function addRows (n) {
        n = n || defaults.rows;
        for (var i = 0; i < n; i ++) {
            var con = '';
            for (var j = 0; j < defaults.cols; j ++) {
                con += L.str.template(tpl.grid, {width: defaults.unitW, height: defaults.unitH});
            }
            L.$('<div class="rows">'+ con +'</div>').appendTo(Leditor.map.els.ea);
        }
    }
    
    this.init = function (uw, uh) {
        if (initialized) { return true; }
        
        L.$('img', Leditor.map.els.tc)[0].onload = function () {
            fixDefaults(this.width, this.height);
            initGrid();
        }
        initialized = true;
    };
});