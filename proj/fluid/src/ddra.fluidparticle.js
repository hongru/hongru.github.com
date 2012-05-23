/**
 * ddra.FluidParticle
 * 针对流体粒子的particle
 */
 
;(function ($, undefined) {

    var FluidParticle = $.Particle.extend(function (x, y, collection) {
        if (x instanceof $.Vector2) {
            this.pos = x;
            this.collection = y;
        }
        this.pos =  new $.Vector2(x, y);
        this.oldpos = this.pos.copy();
        this.velocity = new $.Vector2(0, 0);
        
        this.collection = collection;
        this.drop = document.getElementById('pcanvas');
        this.width = this.drop.width;
        this.height = this.drop.height;
        
        if (!this.collection) {
            throw 'FluidParticles need a FluidCollection!'
        }
        

    }).methods({

        simulate: function () {
            // todo
        },
        // step 1
        simulate1: function () {
            this.updateNeighbors();
            this.checkMouse();
            this.applyGravity();
        },
        // setp 2
        simulate2: function () {
            this.ddra();
        },
        // step 3
        simulate3: function () {
            // calculate next velocity
            this.velocity = this.pos.subNew(this.oldpos);
            // draw
            this.draw();
        },
        
        checkMouse: function () {
            if (this.collection.mousePressed || this.collection.mousemoveAvailable) { 
                var dv = this.pos.subNew(this.collection.mousePos);
                var vlen = dv.length(); 
                if (vlen >= 1 && vlen < 60) { 
                    this.velocity.add(dv.mul(0.5*this.collection.cfg.particleRadius/vlen/vlen));
                } 
            } 
        },
        draw: function () {
            this.collection.ctx.drawImage(this.drop, this.pos.x - this.width/2, this.pos.y - this.height/2);
        },
        updateNeighbors: function () {
            var grid = this.collection.grids[Math.round(this.pos.y / this.collection.cfg.gridResolution) * this.collection.nbx + Math.round(this.pos.x / this.collection.cfg.gridResolution)];
            
            grid && grid.push(this);
        },
        applyGravity: function () {
            var g = this.collection.cfg.gravity;
            g = g instanceof $.Vector2 ? g : new $.Vector2(0, g);
            this.velocity.add(g);
            this.oldpos = this.pos.copy();
            this.pos.add(this.velocity);
        },
        // Double Density Relaxation Algorithm
        ddra: function () {
            var pressure = 0,
                pressureNear = 0,
                nl = 0;
            // grid pos
            var gridpos = {
                x: Math.round(this.pos.x / this.collection.cfg.gridResolution),
                y: Math.round(this.pos.y / this.collection.cfg.gridResolution)
            };
            // 3*3 grid
            for (var i = -1; i <= 1; i ++) {
                for (var j = -1; j <= 1; j ++) {
                    var h = this.collection.grids[(gridpos.y + j) * this.collection.nbx + (gridpos.x + i)]; 
                    if (h && h.hasNeighbors()) { 
                        // foreach neighbors pair
                        // don't use Vector2, performance better
                        for (var a = 0, l = h._i; a < l; a++) { 
                            var pn = h.neighbors[a]; 
                            if (pn != this) { 
                                var dx = pn.pos.x - this.pos.x,
                                    dy = pn.pos.y - this.pos.y;
                                var vlen = Math.sqrt(dx*dx + dy*dy);
                                if (vlen < this.collection.cfg.particleRadius){ 
                                    // compute density and near-density 
                                    var q = 1 - (vlen / this.collection.cfg.particleRadius); 
                                    pressure += q * q; // quadratic spike 
                                    pressureNear += q * q * q; // cubic spike 
                                    pn.q = q; 
                                    pn.vlx = dx * q / vlen;
                                    pn.vly = dy * q / vlen;

                                    this.collection.neighbors[nl++] = pn; 
                                } 
                            } 
                        } 
                    } 
                }
            }
            
            this.boundaryLimit();
            // relaxation
            this.relaxation(pressure, pressureNear, nl);
        },
        // boundaryLimit
        boundaryLimit: function () {
            var rad = this.collection.cfg.particleRadius,
                nw = this.collection.width,
                nh = this.collection.height,
                halfW = this.width/2,
                halfH = this.height/2;
            
            // horizontal check
            if (this.pos.x < rad){ 
                var q = 1 - Math.abs(this.pos.x / rad); 
                this.pos.x += q * q * 0.5; 
            } else if (this.pos.x > nw - rad){ 
                var q = 1 - Math.abs((nw - this.pos.x) / rad); 
                this.pos.x -= q * q * 0.5; 
            } 
            
            // vertical check
            if (this.pos.y < rad){ 
                var q = 1 - Math.abs(this.pos.y / rad); 
                this.pos.y += q * q * 0.5; 
            } else if (this.pos.y > nh - rad){ 
                var q = 1 - Math.abs((nh - this.pos.y) / rad); 
                this.pos.y -= q * q * 0.5; 
            } 
            
            if (this.pos.x < halfW) {
                this.pos.x = halfW;
            } else if (this.pos.x > nw - halfW) {
                this.pos.x = nw - halfW;
            }  
            
            if (this.pos.y < halfH) {
                this.pos.y = halfH;
            } else if (this.pos.y > nh - halfH) {
                this.pos.y = nh - halfH;
            }  
            
        },
        relaxation: function (pressure, pressureNear, nl) {
            pressure = (pressure - 3) * 0.5; 
            pressureNear *= 0.5; 
            for (var a = 0; a < nl; a++){ 
                var np = this.collection.neighbors[a]; 
                // apply displacements 
                var p = pressure + pressureNear * np.q; 

                var dx = np.vlx * p / 2,
                    dy = np.vly * p / 2;
                np.pos.x += dx;
                np.pos.y += dy;
                this.pos.x -= dx;
                this.pos.y -= dy;
            } 
        }
        
    });
    
    $.FluidParticle = FluidParticle;

})(ddra);