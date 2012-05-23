/**
 * ddra.FluidCollection
 * 针对流体粒子的collection
 */
 
;(function ($, undefined) {
    
    // particle neighbors; grid info
    var Grid = $.Class(function () {
        this._i = 0;
        this.neighbors = [];
    }).methods({
        push: function (p) {
            this.neighbors[this._i++] = p;
        },
        reset: function () {
            this._i = 0;
            //this.neighbors = [];
        },
        hasNeighbors: function () {
            return this.neighbors.length > 0;
        }
    });
    
    // 默认以canvas边界为容器边界
    var FluidCollection = $.Class(function (canvas, config) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.cfg = $.extend($.config, config || {});
        
        this.nbx = 0;
        this.nby = 0;
        this.width = this.canvas.width || this.canvas.offsetWidth;
        this.height = this.canvas.height || this.canvas.offsetHeight;
        this.grids = [];
        this.neighbors = [];
        this.mousePressed = false;
        this.mousemoveAvailable = false;
        this.mousePos = new $.Vector2(0, 0);
        
        this.particles = new $.Collection();
        
        this.initGrid();
        this.bindCanvas();
    }).methods({
        initGrid: function () {
            // calculate nbx, nby;
            this.nbx = Math.round(this.width / this.cfg.gridResolution) + 1;
            this.nby = Math.round(this.height / this.cfg.gridResolution) + 1;
            // init grid
            for (var i = 0; i < this.nbx * this.nby; i ++) {
                this.grids[i] = new Grid();
            }
        },
        push: function (p) {
            return this.particles.push(p);
        },
        simulate: function () {
            for (var i = 0; i < this.grids.length; i ++) this.grids[i].reset();
            this.particles.dispatch('simulate1');
            this.particles.dispatch('simulate2');
            this.particles.dispatch('simulate3');
        },
        clearCanvas: function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
        },
        bindCanvas: function () {
            var _this = this,
                canvasPos = $.getPos(this.canvas);
            this.canvas.addEventListener('mousedown', function (e) { _this.mousePressed = true;  }, false); 
            document.addEventListener('mouseup',   function (e) { _this.mousePressed = false; }, false); 
            document.addEventListener('mousemove', function (e) { 
                _this.mousePos.x = e.clientX - canvasPos.x; 
                _this.mousePos.y = e.clientY - canvasPos.y; 
            }, false);
        }
    
    });
    
    $.FluidCollection = FluidCollection;

})(ddra);