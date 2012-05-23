/**
 * ddra.util
 */

;(function ($, undefined) {
    
    /**
     * Provides requestAnimationFrame in a cross browser way.
	 * @function
	 * @name requestAnimFrame
     */
    window.requestAnimFrame = this.requestAnimFrame =  (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000/60);
            };
    })();
    
    function extend (target, source, isOverwrite) {
        if (isOverwrite == undefined) { isOverwrite = true }
        for (var k in source) {
            if (!(k in target) || isOverwrite) {
                target[k] = source[k];
            }
        }
        return target;
    };
    
    function getPos (el) {
        for (var x = 0, y = 0; el != null; el = el.offsetParent) {
            x += el.offsetLeft;
            y += el.offsetTop;
        }
        return {x: x, y: y};
    };
    
    /**
     * 循环Loop类
     * @class 
     * @name Loop
     */
    var Loop = $.Class(function (callback, that) {
        var keepUpdating = true,
            lastLoopTime = new Date();
            
        function loop () {
            if (!keepUpdating) { return }
            requestAnimFrame(loop);
            
            var time = new Date(),
                dt = (time - lastLoopTime) / 1000;
            // 时间间隔太长(大于3秒)，强制拉回dt
            if (dt >= 3) {
                dt = 0.25;
            }
            
            callback.call(that, dt);
            lastLoopTime = time;
        }
        
        // 停止
        this.stop = function () {
            keepUpdating = false;
        }
        
        // 继续
        this.resume = function () {
            keepUpdating = true;
            lastLoopTime = new Date();
            loop();
        }
        
        loop();
        return this;
    });
    
    $.extend = extend;
    $.getPos = getPos;
    $.Loop = Loop;

})(ddra);