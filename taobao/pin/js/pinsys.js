;(function () {
    //PinSys
        var PinSys = function (arr, opt) {
            this.container = '#cont';
            this.cont_w = 1000;
            this._arr = arr;
            $.extend(this, opt || {});
            
            this.$cont = $(this.container);
            this.arr1in1 = [];
            this.arr3in1 = [];
            this.arr3c = [];
            
            this.__init();

        };
        PinSys.prototype = {
            __init: function () {
                this.pick1in1();
                this.pick3in1();
                while(this._arr.length) {
                    this.arr3c.push(this._arr.splice(0, 3));
                }
                
                this._start();
            },

            pick1in1: function () {
                for (var i = 0; i < this._arr.length; i ++) {
                    var o = this._arr[i];
                    if (o.width > this.cont_w*0.8) {
                        var ar = this._arr.splice(i, 1);
                        this.arr1in1.push(ar);
                        i --;
                    }
                }
            },
            pick3in1: function () {
                this._arr.sort(function (a, b) {return a.width > b.width});
                for (var i = 0; i < this._arr.length; i += 3) {
                    var i0 = this._arr[i],
                        i1 = this._arr[i+1],
                        i2 = this._arr[i+2];
                    if (i0 && i1 && i2 && (i0.width + i1.width + i2.width < 1.4*this.cont_w)) {
                        this.arr3in1.push(this._arr.splice(i, 3));
                        i -= 3;
                    }
                }
            },
            _start: function () {
                var list = ([]).concat(this.arr3c).concat(this.arr1in1).concat(this.arr3in1);
                list.sort(function () { return (Math.random() > 0.5) });
                
                this._setCont(list.length);
                
                var ins_arr = [], me = this;
                list.forEach(function (arr, i) {
                    ins_arr.push(new $.PIN3(arr, {
                        container: ('#pin_wrap_'+i),
                        cont_w: me.cont_w
                    }))
                });
                
                this.$cont.width(this.cont_w).show();
            },
            _setCont: function (n) {
                var domstr = '';
                for (var i = 0; i < n; i ++) {
                    domstr += '<div class="pin-wrap" id="pin_wrap_'+i+'"></div>';
                }
                this.$cont.html(domstr);
            }
        };
        
    $.PinSys = PinSys;
})();    
