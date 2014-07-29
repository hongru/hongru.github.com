N1.ns('.stars', function () {
    
    var RectSprite = CEC.Sprite.Rect,
        planetLayer,
        me = this;

    var N = 10;
    // initialize
    // {x,y,z, cx, cy, cameraLength}
    var Planet = RectSprite.extend({
        cx: N1.stage.INIT_WIDTH/2,
        cy: 312,
        cameraLength: 2000,

        initialize: function (opt) {
            this.supr(opt);
            this._x = this.x;
            this._y = this.y;
            this._speed = this.speed;
            this._lineLength = this.lineLength;
            this._lineWidth = this.lineWidth;

            this.setZ(this.z);
        },
        setZ: function (z) {
            if (z > this.cameraLength) {
                z = this.cameraLength;
            }
            this.z = z;
            this._scale = (this.cameraLength - this.z)/this.cameraLength;

            this.x = (this._x - this.cx) * this._scale + this.cx;
            this.y = (this._y - this.cy) * this._scale + this.cy;
            this.opacity = this._scale;
            this.setScale(this._scale, this._scale);
            this.speed = this._speed * this._scale;
            if (this.lineLength) this.lineLength = this._lineLength * this._scale;
            if (this.lineWidth) this.lineWidth = this._lineWidth * this._scale;
        },
        getScale: function () {
            return this._scale;
        }
    });


    function init () {
        var stage = N1.stage.$;
        planetLayer = new RectSprite({
            x: 0,
            y: 0,
            width: stage.width,
            height: stage.height,
            zIndex: 2,
            visible: false
        }).appendTo(stage);

        initPlanets();
        me.planetLayer = planetLayer;
    }

    function getNormal(p0, p1) {
        var dis = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
        return [(p1.x - p0.x)/dis, (p1.y - p0.y)/dis];
    }

    function createPlanet (type) {
        var width, height, backgroundImage;
        var angle = Math.PI*2 * Math.random(),
                r = N1.stage.INIT_WIDTH/1.5,
                cx = N1.stage.INIT_WIDTH/2,
                cy = 312;

        switch(type) {
            case 1:
                width = 31;
                height = 30;
                backgroundImage = 'http://gtms01.alicdn.com/tps/i1/T19WinFkXhXXaTzlLc-31-30.png';
                break;
            case 2:
                width = 35;
                height = 33;
                backgroundImage = 'http://gtms01.alicdn.com/tps/i1/T1e5uaFiVhXXaMbbPe-35-33.png';
                break;
            case 3:
                width = 94;
                height = 59;
                backgroundImage = 'http://gtms01.alicdn.com/tps/i1/T1HiClFbxgXXaBQJvs-94-59.png';
                break;

        }

        if (backgroundImage) {
            var planet = new Planet({
                x: r * Math.cos(angle) + cx,
                y: r * Math.sin(angle) + cy,
                z: 1000 + Math.random() * 1000,
                speed: Math.random() * 10,
                width: width,
                height: height,
                backgroundImage: backgroundImage
            }).appendTo(planetLayer)
            .on('render:before', function (dt) {
                this.z -= (dt*200 + this.speed);
                if (this.z < 0) {
                    var angle = Math.PI*2 * Math.random();
                    this.z += (1000 + Math.random()*1000);
                    this._x = r * Math.cos(angle) + cx;
                    this._y = r * Math.sin(angle) + cy;
                }
                this.setZ(this.z);
            });
        } else {
            var planet = new Planet({
                x: r * Math.cos(angle) + cx,
                y: r * Math.sin(angle) + cy,
                z: 1000 + Math.random() * 1000,
                speed: Math.random() * 50,
                lineWidth: Math.ceil(Math.random()*5),
                lineLength: 10 + Math.random()*30,
                width: 1,
                height: 1
            }).appendTo(planetLayer)
            .on('render:before', function (dt) {
                this.z -= (dt*200 + this.speed);
                if (this.z < 0) {
                    var angle = Math.PI*2 * Math.random();
                    this.z += 2000;
                    this._x = r * Math.cos(angle) + cx;
                    this._y = r * Math.sin(angle) + cy;
                }
                this.setZ(this.z);
            })
            .on('render', function (dt) {
                this.ctx.save();
                var nor = getNormal({x:this.x, y: this.y}, {x:this._x, y: this._y});
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(nor[0]*this.lineLength, nor[1]*this.lineLength);
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.strokeStyle = '#fff';
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.restore();
            })
        }

    }

    function initPlanets () {
        for (var i = 0; i < N-3; i ++) {
            createPlanet()
        }
        createPlanet(1);
        createPlanet(2);
        createPlanet(3);
    }

    this.init = init;
    this.move = function (flag) {
        flag ? this.planetLayer.show() : this.planetLayer.hide();
    }
})