;(function () {
        function PIN3 (imgs, opt) {
            this.defaults = {
                container: '#cont',
                cont_w: 'auto',
                cont_h: 'auto',
                space: 8,
                m_pos: 0 //1,2,3,4 - up,right,bottom,left
            };
            
            this.defaults = $.extend(this.defaults, opt || {});
            this.imgs = imgs;
            this.$cont = $(this.defaults.container);
            this.isAutoW = (typeof this.defaults.cont_w != 'number');
            
            this.__init();
        }
        PIN3.prototype = {
            __init: function () {
                this._prepareImgs();
                this._setCont();
                this.adjust();
            },
            _prepareImgs: function () {
            /*
                this.imgs.sort(function (a, b) {return a.width < b.width});
                this.imgs.forEach(function (o, i) { o.w_ind = 'w_'+i });
                this.imgs.sort(function (a, b) {return a.height < b.height});
                this.imgs.forEach(function (o, i) { o.h_ind = 'h_'+i }); */
                this.imgs.sort(function (a, b) {return a.width*a.height < b.width*b.height});
                this.imgs.forEach(function (o, i) { o.a_ind = 'a_' + i });
            },
            _setCont: function () {
                //var w = this.defaults.cont_w == 'auto' ? this._getMaxW() : this.defaults.cont_w;
                //this.$cont.width(w);
                //fill
                var tmpl = this._getTmpl();
                this.$cont.html(tmpl);
                
                this.$m0 = this.$cont.find('.a_0');
                this.$m1 = this.$cont.find('.a_1');
                this.$m2 = this.$cont.find('.a_2');
            },
            _getTmpl: function () {
                var ret = [];
                for (var i = 0; i < this.imgs.length; i ++) {
                    var o = this.imgs[i];
                    o.w_ind = o.w_ind || '';
                    o.h_ind = o.h_ind || '';
                    ret.push('<div class="c s'+o.width+'x'+o.height+' '+o.a_ind+' '+o.w_ind+' '+o.h_ind+'" data-url="'+o.src+'" data-sw="'+o.width+'" data-sh="'+o.height+'"></div>');
                }
                return ret.join('');
            },
            _getMaxW: function () {
                var warr = [];
                for (var i = 0; i < this.imgs.length; i ++) {
                    warr.push(this.imgs[i].width);
                }
                return Math.max.apply(null, warr);
            },
            _setM_h: function (pos, w, h) {

                var ww = w;
                if (!this.isAutoW) {
                    ww = this.defaults.cont_w;
                    var scale = ww/w;
                    w = Math.floor(w*scale);
                    h = Math.floor(h*scale);
                    
                    this.$m0.data('scale', scale);
                    
                }
                
                var at = pos == 1 ? 'top' : 'bottom',
                    obj = {
                        width: w,
                        height: h,
                        left: 0
                    };
                obj[at] = 0;
                
                this.$m0.css(obj);
                this.$cont.width(ww);

            },
            _setM: function () {
                var $m = this.$m0,
                    w = $m.data('sw'),
                    h = $m.data('sh');
                if (this.defaults.m_pos == 0) {
                    var _pins = this.$cont.find('.c');
                    if (_pins.length == 1) {
                        this.defaults.m_pos = 1;
                    } else if (_pins.length == 2) {
                        this.defaults.m_pos = 4;
                    } else {
                        if ((w > h) || (!this.isAutoW && w > this.defaults.cont_w)) {
                            this.defaults.m_pos = (Math.random() > 0.5 ? 1 : 3);
                        } else {
                            this.defaults.m_pos = 4;
                        }
                    }
                    
                }

                switch(this.defaults.m_pos) {
                    case 1:
                        this._setM_h(1, w, h);
                        break;
                    case 2:
                        
                        break;
                    case 3:
                        this._setM_h(3, w, h);
                        break;
                    case 4:
                        var wh = h;
                        /*
                        if (!this.isAutoW) {
                            wh = this.defaults.cont_h;
                            var scale = h/wh;
                            w = Math.floor(w*scale);
                            h = Math.floor(h*scale);
                            
                            this.$m0.attr('scale', this._sm(scale));
                        }*/

                        $m.css({
                            width: w,
                            height: h,
                            left: 0,
                            top: 0
                        });
                        this.$cont.height(wh);

                        break;
                }
            },

            _setO_h: function (pos, m0_w, m0_h, m1_w, m1_h, m2_w, m2_h) {

                var st = pos == 1 ? (m0_h + this.defaults.space) : 0;
                var w1 = Math.floor((m0_w-this.defaults.space)*m1_w/(m2_w+m1_w)),
                    w2 = m0_w - this.defaults.space - w1,
                    h1 = Math.floor(m1_h*w1/m1_w),
                    h2 = Math.floor(m2_h*w2/m2_w),
                    rh = Math.floor((h1+h2)/2);

                this.$m1.css({
                    top: st,
                    left: 0,
                    width: w1,
                    height: rh
                });
                
                this.$m2.css({
                    top: st,
                    left: (w1 + this.defaults.space),
                    width: w2,
                    height: rh
                });
                
                this.$cont.height(m0_h + rh + this.defaults.space);
            },
            _setOther: function () {
                var $m1 = this.$m1,
                    $m2 = this.$m2,
                    $m0 = this.$m0,
                    m0_h = $m0.height(),
                    m0_w = $m0.width(),
                    c_w = this.$cont.width(),
                    c_h = this.$cont.height(),
                    
                    m1_w = $m1.data('sw'),
                    m2_w = $m2.data('sw'),
                    m1_h = $m1.data('sh'),
                    m2_h = $m2.data('sh');

                switch(this.defaults.m_pos) {
                    case 1:
                        this._setO_h(1, m0_w, m0_h, m1_w, m1_h, m2_w, m2_h);
                        break;
                    case 2:
                        break;
                    case 3:
                        this._setO_h(3, m0_w, m0_h, m1_w, m1_h, m2_w, m2_h);
                        break;
                    case 4:
                        var sl = m0_w + this.defaults.space;
                        if (this.isAutoW) {
                            this.$cont.width(m0_w + m1_w);
                        } else {
                            this.$cont.width(this.defaults.cont_w);
                        }
                        c_w = this.$cont.width();
                        
                        var w1 = c_w - sl,
                            w2 = w1,
                            h1 = Math.floor((m0_h - this.defaults.space) * (m1_h/(m1_h+m2_h))),
                            h2 = m0_h - this.defaults.space - h1;
                            
                        $m1.css({
                            top: 0,
                            left: sl,
                            width: w1,
                            height: h1
                        });
                        $m2.css({
                            top: (h1 + this.defaults.space),
                            left: sl,
                            width: w2,
                            height: h2
                        }); 
                            
                        break;
                }

            },
            _sm: function (n) {
                return ('' + Math.floor(parseFloat(n)*100) + '%');
            },
            _setBackImg: function () {
                var me = this;
                this.$cont.find('.c').each(function () {
                    var sw = $(this).data('sw'),
                        sh = $(this).data('sh'),
                        cw = $(this).width(),
                        ch = $(this).height(),
                        url = $(this).data('url'),
                        bs;

                    if ((cw/ch) > (sw/sh)) {
                        bs = '100% auto';
                        $(this).attr('scale', me._sm(cw/sw));
                    } else {
                        bs = 'auto 100%';
                        $(this).attr('scale', me._sm(ch/sh));
                    }
                    
                    $(this).css({
                        'background-image': 'url(' + url + ')',
                        'background-size': bs
                    })
                    
                });
            },
            
            can3in1: function () {
                var cw = parseInt(this.defaults.cont_w) || this.$cont.width(),
                    m0w = parseInt(this.$m0.data('sw')),
                    m1w = parseInt(this.$m1.data('sw')),
                    m2w = parseInt(this.$m2.data('sw')),
                    s = (m0w + m1w + m2w + 2*this.defaults.space)/cw;
                
                return (s>0.6 && s<1.4);
            },
            do3in1: function () {
                var m0h = parseInt(this.$m0.data('sh')),
                    m1h = parseInt(this.$m1.data('sh')),
                    m2h = parseInt(this.$m2.data('sh')),
                    
                    m0w = parseInt(this.$m0.data('sw')),
                    m1w = parseInt(this.$m1.data('sw')),
                    m2w = parseInt(this.$m2.data('sw')),
                    
                    cw = parseInt(this.defaults.cont_w) || this.$cont.width(),
                    
                    rh = (m1h+m2h)/2;
                
                var w0 = Math.floor((cw-2*this.defaults.space)*m0w/(m0w+m1w+m2w)),
                    w1 = Math.floor((cw-2*this.defaults.space)*m1w/(m0w+m1w+m2w)),
                    w2 = cw-2*this.defaults.space - w0 - w1;
                
                this.$m0.css({
                    left: 0,
                    top: 0,
                    width: w0,
                    height: rh
                });
                this.$m1.css({
                    left: (w0 + this.defaults.space),
                    top: 0,
                    width: w1,
                    height: rh
                });
                this.$m2.css({
                    left: (w0+w1+2*this.defaults.space),
                    top: 0,
                    width: w2,
                    height: rh
                });
                
                this.$cont.width(cw).height(rh);
            },
            _fixH: function () {
                var $pins = this.$cont.find('.c'),
                    _h = $pins.height();
                if ($pins.length <= 2) {
                    this.$m1.height(_h)
                    this.$cont.height(_h);
                }
            },
            
            adjust: function () {

                if (this.can3in1()) {
                    this.do3in1();
                } else {
                    this._setM();
                    this._setOther();
                }

                this._fixH();
                this._setBackImg();
                this.$cont.show();
            }
        }
        
        $.PIN3 = PIN3;
})();
