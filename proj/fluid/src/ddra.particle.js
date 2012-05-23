/**
 * ddra.Particle
 * @class
 */

;(function ($, undefined) {

    var Particle = $.Class(function (x, y) {
        this.pos = x instanceof $.Vector2 ? x : new $.Vector2(x, y);
        this.oldpos = this.pos.copy();
        this.velocity = new $.Vector2(0, 0);
        this.width = 0;
        this.height = 0;
    
    }).methods({
        /**
         * 流体模拟,collection 约定方法
         */
        simulate: function () {
            
        },
        /**
         * 附加重力
         */
        applyGravity: function () {
            
        }

    
    });

    $.Particle = Particle;

})(ddra);
