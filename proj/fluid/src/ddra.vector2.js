/**
 * ddra.Vector2
 */

;(function ($, undefined) {

    var Vector2 = $.Class(function (x, y) {
        this.x = x;
        this.y = y;

    }).methods({
        manitude: function () {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        },
        add: function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },
        sub: function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
        mul: function (f) {
            this.x *= f;
            this.y *= f;
            return this;
        },
        div: function (f) {
            this.x /= f;
            this.y /= f;
            return this;
        },
        // 返回一个新的实例，不改变原有
        addNew: function (v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        },
        subNew: function (v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        },
        mulNew: function (f) {
            return new Vector2(this.x * f, this.y * f);
        },
        divNew: function (f) {
            return new Vector2(this.x / f, this.y / f);
        },

        equal: function (v) {
            return (this.x === v.x && this.y === v.y);
        },
        copy: function () {
            return new Vector2(this.x, this.y);
        },

        dot: function (v) {
            return this.x * v.x + this.y * v.y;
        },
        cross: function (v) {
            return this.x * v.x - this.y * v.y;
        },
        length: function () {
            return this.manitude();
        },
        normalize: function () {
            var inv = 1/this.length();
            return this.mul(inv);
        }
    
    });

    $.Vector2 = Vector2;

})(ddra);
