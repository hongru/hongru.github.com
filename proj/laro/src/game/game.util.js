/** 
 * Laro (Game Engine Based on Canvas) 
 * Code licensed under the MIT License
 *
 * @fileOverview Laro
 * @version 1.0
 * @author  Hongru
 * @description 
 * 
 */
 
/**
 * Game util
 * @description
 */ 
 
Laro.register('.game', function (La) {
    
    var Class = La.base.Class || La.Class;
    
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
    
	/**
     * 循环Loop类
     * @class 
     * @name Loop
     * @memberOf Laro
     * 
     * @param {Function} callback: 循环每帧的调用函数
     * @param {Object} that: 上下文对象

     * @return Loop 实例
     */
    var Loop = Class(function (callback, that) {
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
    
    //screen fade or in
	/**
     * ScreenTransitionFade - 渐变动画类
     * @class 
     * @name ScreenTransitionFade
     * @memberOf Laro
     * 
     * @param {Object} from: 渐变开始的 Pixel32 实例
     * @param {Object} to: 渐变结束的 Pixel32 实例
	 * @param {Number} maxTime: 持续时间

     * @return ScreenTransitionFade 实例
     */
    var ScreenTransitionFade = Class(function (from, to, maxTime) {
        this.maxTime = maxTime;
        this.from = from;
        this.to = to;
        
        this.time = 0;
        this.isDone = false;
    }).methods({
	/**
     * @lends Laro.ScreenTransitionFade.prototype
     */
		/**
		 * 渐变动画更新方法
		 */
        update: function (dt) {
            this.time = Math.min(this.time + dt, this.maxTime);
        },
		/**
		 * 渐变动画绘制方法
		 */
        draw: function (render) {
            this.isDone = this.time == this.maxTime;
            var color = new La.Pixel32(La.lerp(this.from.r, this.to.r, this.time/this.maxTime),
                                        La.lerp(this.from.g, this.to.g, this.time/this.maxTime),
                                        La.lerp(this.from.b, this.to.b, this.time/this.maxTime),
                                        La.lerp(this.from.a, this.to.a, this.time/this.maxTime));
            color.a > 0 && render.drawFillScreen(color);
        },
		/**
		 * 渐变动画重置
		 */
        reset: function () {
            this.time = 0;
            this.isDone = false;
        }
    })
    
    this.Loop = Loop;
    this.ScreenTransitionFade = ScreenTransitionFade;
    
    Laro.extend(this);

})