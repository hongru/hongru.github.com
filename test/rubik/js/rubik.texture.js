/**
 * textures 3D transform 
 */
Laro.NS('rubik.texture', function (L) {
    var pkg = this;
    // Triangle constructor
    var Triangle = function (parent, p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.next = false;
        // ---- pre calculation for transform----
        this.d    = p0.tx * (p2.ty - p1.ty) - p1.tx * p2.ty + p2.tx * p1.ty + (p1.tx - p2.tx) * p0.ty;
        this.pmy  = p1.ty - p2.ty;
        this.pmx  = p1.tx - p2.tx;
        this.pxy  = p2.tx * p1.ty - p1.tx * p2.ty;
        // ---- link for iteration ----
        if (!parent.firstTriangle) parent.firstTriangle = this; else parent.prev.next = this;
        parent.prev = this;
    };
    
    this.Image = function (canvas, imgSrc, lev) {
        this.canvas        = canvas;
        this.ctx           = canvas.getContext("2d");
        this.texture       = new Image();
        this.texture.src   = imgSrc;
        this.lev           = lev;
        this.isLoading     = true;
        this.firstPoint    = false;
        this.firstTriangle = false;
        this.prev          = false;
    };
    this.Image.prototype = {
        loading : function () {
            if (this.texture.complete && this.texture.width) {
                this.isLoading = false;
                var points = [];
                // ---- create points ----
                for (var i = 0; i <= this.lev; i++) {
                    for (var j = 0; j <= this.lev; j++) {
                        var tx = (i * (this.texture.width / this.lev));
                        var ty = (j * (this.texture.height / this.lev));
                        var p = {
                            tx: tx,
                            ty: ty,
                            nx: tx / this.texture.width,
                            ny: ty / this.texture.height,
                            next: false
                        };
                        points.push(p);
                        if (!this.firstPoint) this.firstPoint = p; else this.prev.next = p;
                        this.prev = p;
                    }
                }
                var lev = this.lev + 1;
                for (var i = 0; i < this.lev; i++) {
                    for (var j = 0; j < this.lev; j++) {
                        // ---- up ----
                        var t = new Triangle(this, 
                            points[j + i * lev],
                            points[j + i * lev + 1],
                            points[j + (i + 1) * lev]
                        );
                        // ---- down ----
                        var t = new Triangle(this,
                            points[j + (i + 1) * lev + 1],
                            points[j + (i + 1) * lev],
                            points[j + i * lev + 1]
                        );
                    }
                }
            }
        },
        draw3D: function (p0, p1, p2, p3) {
            // ---- loading ----
            if (this.isLoading) {
                this.loading();
            } else {
                // ---- project points ----
                var p = this.firstPoint;
                do {
                    var mx = p0.X + p.ny * (p3.X - p0.X);
                    var my = p0.Y + p.ny * (p3.Y - p0.Y);
                    p.px = (mx + p.nx * (p1.X + p.ny * (p2.X - p1.X) - mx));
                    p.py = (my + p.nx * (p1.Y + p.ny * (p2.Y - p1.Y) - my));
                } while ( p = p.next );
                // ---- draw triangles ----
                var w = this.canvas.width;
                var h = this.canvas.height;
                var t = this.firstTriangle;
                do {
                    var p0 = t.p0;
                    var p1 = t.p1;
                    var p2 = t.p2;
                    // ---- centroid ----
                    var xc = (p0.px + p1.px + p2.px) / 3;
                    var yc = (p0.py + p1.py + p2.py) / 3;
                    // ---- clipping ----
                    var isTriangleVisible = true;
                    if (xc < 0 || xc > w || yc < 0 || yc > h) {
                        if (Math.max(p0.px, p1.px, p2.px) < 0 || Math.min(p0.px, p1.px, p2.px) > w || Math.max(p0.py, p1.py, p2.py) < 0 || Math.min(p0.py, p1.py, p2.py) > h) {
                            isTriangleVisible = false;
                        }
                    }
                    if (isTriangleVisible) {
                        this.ctx.save();
                        this.ctx.beginPath();
                        var dx, dy, d;
                        // ---- draw non anti-aliased triangle ----
                        dx = xc - p0.px;
                        dy = yc - p0.py;
                        d = Math.max(Math.abs(dx), Math.abs(dy));
                        this.ctx.moveTo(p0.px - 2 * (dx / d), p0.py - 2 * (dy / d));
                        dx = xc - p1.px;
                        dy = yc - p1.py;
                        d = Math.max(Math.abs(dx), Math.abs(dy));
                        this.ctx.lineTo(p1.px - 2 * (dx / d), p1.py - 2 * (dy / d));
                        dx = xc - p2.px;
                        dy = yc - p2.py;
                        d = Math.max(Math.abs(dx), Math.abs(dy));
                        this.ctx.lineTo(p2.px - 2 * (dx / d), p2.py - 2 * (dy / d));
                        this.ctx.closePath();
                        // ---- clip ----
                        this.ctx.clip();
                        // ---- texture mapping ----
                        this.ctx.transform(
                            -(p0.ty * (p2.px - p1.px) -  p1.ty * p2.px  + p2.ty *  p1.px + t.pmy * p0.px) / t.d, // m11
                             (p1.ty *  p2.py + p0.ty  * (p1.py - p2.py) - p2.ty *  p1.py - t.pmy * p0.py) / t.d, // m12
                             (p0.tx * (p2.px - p1.px) -  p1.tx * p2.px  + p2.tx *  p1.px + t.pmx * p0.px) / t.d, // m21
                            -(p1.tx *  p2.py + p0.tx  * (p1.py - p2.py) - p2.tx *  p1.py - t.pmx * p0.py) / t.d, // m22
                             (p0.tx * (p2.ty * p1.px  -  p1.ty * p2.px) + p0.ty * (p1.tx *  p2.px - p2.tx  * p1.px) + t.pxy * p0.px) / t.d, // dx
                             (p0.tx * (p2.ty * p1.py  -  p1.ty * p2.py) + p0.ty * (p1.tx *  p2.py - p2.tx  * p1.py) + t.pxy * p0.py) / t.d  // dy
                        );
                        this.ctx.drawImage(this.texture, 0, 0);
                        this.ctx.restore();
                        // ---- debug mode ----
                        if (this.stroke) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(t.p0.px, t.p0.py);
                            this.ctx.lineTo(t.p1.px, t.p1.py);
                            this.ctx.lineTo(t.p2.px, t.p2.py);
                            this.ctx.closePath();
                            this.ctx.strokeStyle = this.stroke;
                            this.ctx.stroke();
                        }
                    }
                } while ( t = t.next );
            }
        },
        pointInTriangle : function (xm, ym, p1, p2, p3) {
            // ---- Compute vectors ----
            var v0x = p3.X - p1.X;
            var v0y = p3.Y - p1.Y;
            var v1x = p2.X - p1.X;
            var v1y = p2.Y - p1.Y;
            var v2x = xm - p1.X;
            var v2y = ym - p1.Y;
            // ---- Compute dot products ----
            var dot00 = v0x * v0x + v0y * v0y;
            var dot01 = v0x * v1x + v0y * v1y;
            var dot02 = v0x * v2x + v0y * v2y;
            var dot11 = v1x * v1x + v1y * v1y;
            var dot12 = v1x * v2x + v1y * v2y;
            // ---- Compute barycentric coordinates ----
            var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
            var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
            var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
            // ---- Check if point is in triangle ----
            return (u >= 0) && (v >= 0) && (u + v < 1);
        },
        pointerInside : function (xm, ym, p0, p1, p2, p3) {
            if (
                this.pointInTriangle(xm, ym, p0, p1, p2) || 
                this.pointInTriangle(xm, ym, p0, p2, p3)
            ) return true; else return false;
        }
    }
    
    this.Triangle = Triangle;
});