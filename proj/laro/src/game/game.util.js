/**
 * game utils
 */
 
Laro.register('.game', function (La) {
    
    var Class = La.base.Class || La.Class;
    
    /**
     * Provides requestAnimationFrame in a cross browser way.
     */
    window.requestAnimationFrame = this.requestAnimationFrame =  (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
               window.setTimeout(callback, 1);
             };
    })();
    
    var Loop = Class(function (callback, that) {
        var keepUpdating = true,
            lastLoopTime = new Date();
            
        function loop () {
            if (!keepUpdating) { return }
            requestAnimationFrame(loop);
            
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
    
    //screen fade or in
    var ScreenTransitionFade = Class(function (from, to, maxTime) {
        this.maxTime = maxTime;
        this.from = from;
        this.to = to;
        
        this.time = 0;
        this.isDone = false;
    }).methods({
        update: function (dt) {
            this.time = Math.min(this.time + dt, this.maxTime);
        },
        draw: function (render) {
            this.isDone = this.time == this.maxTime;
            var color = new La.Pixel32(La.lerp(this.from.r, this.to.r, this.time/this.maxTime),
                                        La.lerp(this.from.g, this.to.g, this.time/this.maxTime),
                                        La.lerp(this.from.b, this.to.b, this.time/this.maxTime),
                                        La.lerp(this.from.a, this.to.a, this.time/this.maxTime));
            color.a > 0 && render.drawFillScreen(color);
        },
        reset: function () {
            this.time = 0;
            this.isDone = false;
        }
    })
    
    this.Loop = Loop;
    this.ScreenTransitionFade = ScreenTransitionFade;
    
    Laro.extend(this);

})