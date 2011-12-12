// 3d tags

var Tags3D = function () {
    
    var extend = function (target, source, isOverwrite) {
        if (isOverwrite == undefined) isOverwrite = true;
        for (var key in source) {
            if (!(key in target) || isOverwrite) {
                target[key] = source[key];
            }
        }
        return target;
    };
    var $ = function (id) {
        return document.getElementById(id) || id;
    };
    var $$ = function (tag, p) {
        return p.getElementsByTagName(tag);
    };
    var addEvent = function (o, e, f) {
        o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on'+e, function () {f.call(o)});
    }
    
    var init = function (config) {
        this.opt = {
            radius: 120,
            speed: 10,
            size: 250,
            isSameDis: true, // tags 之间是否平均间距
            focal: 300, // 视角焦距
            ellipticalParam: 1, // 椭圆系数，1表示正圆
            container: null
        };
        extend(this.opt, config);
        
        this.sx = 0;
        this.cx = 0;
        this.sy = 0;
        this.cy = 0;
        this.sz = 0;
        this.cz = 0;
        this.mcList = []; // 数据变量临时存储
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lasta = 0;
        this.lastb = 0;
        
        this.initialize()
    };
    
    init.prototype = {
        initialize: function () {
            if (!this.opt.container) throw 'no container';
            this.container = $(this.opt.container) || this.opt.container;
            this.tags = $$('a', this.container);
            this.getMcList();
            this.sinCos(0, 0, 0);
            this.position();
            this.bindEvent();
            this.go();
        },
        getMcList: function () {
            for (var i = 0; i < this.tags.length; i ++) {
                var data = {};
                data.offsetWidth = this.tags[i].offsetWidth;
                data.offsetHeight = this.tags[i].offsetHeight;
                this.mcList.push(data);
            }
        },
        bindEvent: function () {
            var _this = this;
            addEvent(this.container, 'mouseover', function (e) {
                _this.isActive = true;
            });
            addEvent(this.container, 'mouseout', function (e) {
                _this.isActive = false;
            });
            addEvent(this.container, 'mousemove', function (e) {
                e = e || window.event;
                _this.mouseX = e.clientX - (_this.container.offsetLeft + _this.container.offsetWidth / 2);
                _this.mouseY = e.clientY - (_this.container.offsetTop + _this.container.offsetHeight / 2);
                
                _this.mouseX /= 5;
                _this.mouseY /= 5;
            });
        },
        go: function () {
            var _this = this;
            this.interval = setInterval(function () { _this.update(); }, 16);
        },
        stop: function () {
            clearInterval(this.interval);
            this.isActive = false;
        },
        update: function () {
            var a, b;
            if (this.isActive) {
                a = (-Math.min( Math.max( -this.mouseY, -this.opt.size ), this.opt.size ) / this.opt.radius ) * this.opt.speed;
                b = (Math.min( Math.max( -this.mouseX, -this.opt.size ), this.opt.size ) / this.opt.radius ) * this.opt.speed;
            } else { // 加上缓动
                a = this.lasta * 0.98;
                b = this.lastb * 0.98;
            }
            this.lasta = a;
            this.lastb = b;
            
            if (Math.abs(a) < 0.01 && Math.abs(b) < 0.01) {
                return;
            }
            
            var c = 0;
            this.sinCos(a, b, c);
            this.rotate();
        },
        rotate: function () {
            for (var j = 0; j < this.mcList.length; j ++) {
                var rx1 = this.mcList[j].cx;
                var ry1 = this.mcList[j].cy*this.cx + this.mcList[j].cz*(-this.sx);
                var rz1 = this.mcList[j].cy*this.sx + this.mcList[j].cz*this.cx;
                
                var rx2 = rx1*this.cy + rz1*this.sy;
                var ry2 = ry1;
                var rz2 = rx1*(-this.sy) + rz1*this.cy;
                
                var rx3 = rx2*this.cz + ry2*(-this.sz);
                var ry3 = rx2*this.sz + ry2*this.cz;
                var rz3 = rz2;
                
                this.mcList[j].cx = rx3;
                this.mcList[j].cy = ry3;
                this.mcList[j].cz = rz3;
                
                var scale = this.opt.focal/(this.opt.focal + rz3);
                this.mcList[j].x = (this.ellipticalParam*rx3*scale) - (this.ellipticalParam*2);
                this.mcList[j].y = ry3*scale;
                this.mcList[j].scale = scale;
                this.mcList[j].alpha = scale;
                this.mcList[j].alpha = (this.mcList[j].alpha-0.6)*(10/6);
            }
            this.doPosition();
            this.depthSort();
        },
        doPosition: function () {
            var centerX = this.container.offsetWidth / 2;
            var centerY = this.container.offsetHeight / 2;
            for (var i = 0; i < this.mcList.length; i ++) {
                this.tags[i].style.left = this.mcList[i].cx + centerX - this.mcList[i].offsetWidth/2 + 'px';
                this.tags[i].style.top = this.mcList[i].cy + centerY - this.mcList[i].offsetHeight/2 + 'px';		
                this.tags[i].style.fontSize = Math.ceil(12*this.mcList[i].scale/2)+ 8 +'px';
                
                this.tags[i].style.filter = "alpha(opacity=" + 100*this.mcList[i].alpha + ")";
                this.tags[i].style.opacity = this.mcList[i].alpha;
            }
        },
        depthSort: function () {
            var aTmp = [];
            for (var i = 0; i < this.tags.length; i ++) {
                aTmp.push(this.tags[i]);
            }
            
            aTmp.sort(function (a, b) {
                if (a.cz > b.cz) {
                    return -1;
                } else if (a.cz < b.cz) {
                    return 1;
                } else {
                    return 0;
                }
            });
            
            for (var i = 0; i < aTmp.length; i ++) {
                aTmp[i].style.zIndex = i;
            }
        },
        sinCos: function (x, y, z) {
            var dtr = Math.PI / 180;
            
            this.sx = Math.sin(x * dtr);
            this.cx = Math.cos(x * dtr);
            this.sy = Math.sin(y * dtr);
            this.cy = Math.cos(y * dtr);
            this.sz = Math.sin(z * dtr);
            this.cz = Math.cos(z * dtr);
        },
        position: function () {
            var phi = 0,
                theta = 0,
                max = this.tags.length;
                i = 0;
            
            var aTmp = [],
                oFragment = document.createDocumentFragment();
            // 随机排序
            for (i = 0; i < this.tags.length; i ++) {
                aTmp.push(this.tags[i]);
            }
            aTmp.sort(function () {
                return Math.random()<0.5?1:-1;
            });
            
            // append
            for (i = 0; i < aTmp.length; i ++) {
                oFragment.appendChild(aTmp[i]);
            }
            this.container.appendChild(oFragment);
            
            // render
            for (i = 1; i <= max; i ++) {
                if (this.opt.isSameDis) { // 平均间距
                    phi = Math.acos(-1+(2*i-1)/max);
                    theta = Math.sqrt(max*Math.PI)*phi;
                } else { // 随机间距
                    phi = Math.random()*(Math.PI);
                    theta = Math.random()*(2*Math.PI);
                }
                
                // 三维旋转坐标变换
                this.mcList[i-1].cx = this.opt.radius * Math.cos(theta)*Math.sin(phi);
                this.mcList[i-1].cy = this.opt.radius * Math.sin(theta)*Math.sin(phi);
                this.mcList[i-1].cz = this.opt.radius * Math.cos(phi);
                
                this.tags[i-1].style.left = this.mcList[i-1].cx + this.container.offsetWidth/2 - this.mcList[i-1].offsetWidth/2 + 'px';
                this.tags[i-1].style.top = this.mcList[i-1].cy + this.container.offsetHeight/2 - this.mcList[i-1].offsetHeight/2 + 'px';
            }
        }
    }

    return init;
}();