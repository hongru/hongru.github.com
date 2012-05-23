/**
 * run fluid particles simulation
 */

;(function ($) {
    
    $.init = function (canvas, config) {
        var pcvs = document.getElementById('pcanvas'),
            pctx = pcvs.getContext('2d');
            pctx.fillStyle = '#649ED4';
            pctx.beginPath();
            pctx.arc(pcvs.width/2, pcvs.height/2, pcvs.width/2, 0, Math.PI*2, true);
            pctx.closePath();
            pctx.fill();
            
        var coll = new $.FluidCollection(canvas);
        for (var i = 0; i < 1000; i ++) {
            var r = Math.floor(i/50),
                c = i%50;
            coll.push(new $.FluidParticle(c*8 + 20, r*10+30, coll));
        }
        
        fps = 0;
        var looper = $.Loop(function (dt) {
            coll.clearCanvas();
            coll.simulate();
            fps ++;
        });
        
        // util
        
            
        document.getElementById('ck').addEventListener('change', function (e) {
            coll.mousemoveAvailable = this.checked;
        }, false);
        
        setInterval(function () {
            document.getElementById('log').innerHTML = 'fps: ' + fps;
            fps = 0;
        }, 1000)
    }

})(ddra);