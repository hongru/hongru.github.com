/**
 * Pixel32
 * 32位像素点
 */
Laro.register('.geometry', function (La) {

    var assert = La.err.assert,
        Class = La.base.Class;

    var Pixel32 = Class({
        initialize: function (r, g, b, a) {
            assert(r >= 0 && r <= 255, 'Pixel32 wrong --> r');
            assert(g >= 0 && g <= 255, 'Pixel32 wrong --> g');
            assert(b >= 0 && b <= 255, 'Pixel32 wrong --> b');

            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a === undefined ? 255 : a;

            this.normalized = [r/255.0, g/255.0, b/255.0, this.a > 1 ? this.a/255.0 : this.a];
        },
        equal: function (pix) {
            if (pix instanceof Pixel32) {
                return this.r == pix.r 
                        && this.g == pix.g
                        && this.b == pix.b
                        && this.a == pix.a;
            } else {
                return false;
            }
        },
        toString: function () {
            return 'rgba('+ this.r +', '+ this.g +', '+ this.b +', '+ this.normalized[3] +')';		  
        },
        rgbString: function () {
            return 'rgb('+ this.r +', '+ this.g +', '+ this.b +')';
        }
    });

    this.Pixel32 = Pixel32;

    Laro.extend(this);
})
