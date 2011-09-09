/**
 * pageflip effect of canvas
 * @author horizon
 */

(function (win, undefined) {
 	
 	var extend = function (target, source, isOverwrite) {
		if (isOverwrite === undefined) { isOverwrite = true }
		for (var key in source) {
			if (!target.hasOwnProperty(key) || isOverwrite) {
				target[key] = source[key];
			}
		}
		return target;
	}
 
 	var PageFlip = function () {
		
		var init = function (options) {
			this.setOptions(options);
			if (typeof this.opt.book == 'string') {
				this.book = document.getElementById(this.opt.book);
			} else if (!!this.opt.book && this.opt.book.nodeType == 1) {
				this.book = this.opt.book;
			} else {
				throw new Error('no book');
			}
			this.bookWidth = this.opt.bookWidth == 'auto' ? this.book.offsetWidth : this.opt.bookWidth;
			this.bookHeight = this.opt.bookHeight == 'auto' ? this.book.offsetHeight : this.opt.bookHeight;
			this.pageWidth = this.opt.pageWidth == 'auto' ? this.bookWidth/2 : this.opt.pageWidth;
			this.pageHeight = this.opt.pageHeight == 'auto' ? this.bookHeight/2 : this.opt.pageHeight;
			this.pages = this.book.getElementsByTagName(this.opt.pageNodeName);
			this.$flips = [];
			this.mouse = {x:0, y:0};
			this.page = 0;
			this.draggingPage = -1;

			this.checkCanvas();
			this.setFlips();
			this.bindEvents();
			this.go();
		}
		init.prototype = {
			setOptions: function (options) {
				this.opt = {
					book: null,
					pageNodeName: 'section',
					bookWidth: 'auto',
					bookHeight: 'auto',
					pageWidth: 'auto',
					pageHeight: 'auto',
					canvasPadding: 60,
					fps: 60,
					minZindex: 0,
					topSpace: 0
				};
				extend(this.opt, options || {});				
			},
			checkCanvas: function () {
				var canvasid = '__pageflip-canvas__';
				var canvas = document.getElementById(canvasid);
				if (canvas == undefined) {
					canvas = document.createElement('canvas');
					canvas.id = canvasid;
					this.book.appendChild(canvas);
				}
				// set canvas size; should cover the book
				canvas.width = this.bookWidth + (this.opt.canvasPadding*2);
				canvas.height = this.bookHeight + (this.opt.canvasPadding*2);
				// set canvas position; cover the book
				canvas.style['position'] = 'absolute';
				canvas.style['left'] = -this.opt.canvasPadding + 'px';
				canvas.style['top'] = -this.opt.canvasPadding + 'px';
				canvas.style['zIndex'] = this.opt.minZindex + this.pages.length + 1;

				this.canvas = canvas;
				this.ctx = canvas.getContext('2d');
			},
			setFlips: function () {
				for (var i=0, len=this.pages.length; i<len; i++) {
					this.pages[i].style['zIndex'] = len - i;

					this.$flips.push({
						progress: 1,
						target: 1,
						page : this.pages[i],
						dragging: false
					});	
				}		  
			},
			bindEvents: function () {
				var context = this;
				var mouseMoveHandler = function (event) { //console.log(context.mouse.x)
					context.mouse.x = event.clientX - context.book.offsetLeft - (context.bookWidth/2);
					context.mouse.y = event.clientY - context.book.offsetTop;
				};
				var mouseDownHandler = function (event) {
					event.preventDefault();
					if (Math.abs(context.mouse.x) < context.pageWidth) { 
						// mouse pointer in the book area
						if (context.mouse.x < 0 && context.page - 1 >= 0) { 
							context.$flips[context.page-1].dragging = true;
							context.draggingPage = context.page - 1;

						} else if (context.mouse.x > 0 && context.page + 1 < context.$flips.length) {
							context.$flips[context.page].dragging = true;
							context.draggingPage = context.page;
						}
					}
				}
				var mouseUpHandler = function (event) {
					for (var i=0; i<context.$flips.length; i++) {
						if (context.$flips[i].dragging) {
							if (context.mouse.x < 0) {
								context.$flips[i].target = -1;
								context.page = Math.min(context.page + 1, context.$flips.length);
							} else {
								context.$flips[i].target = 1;
								context.page = Math.max(context.page - 1, 0);
							}
						}

						context.$flips[i].dragging = false;
					}

					
				}

				document.addEventListener('mousemove', mouseMoveHandler, false);
				document.addEventListener('mousedown', mouseDownHandler, false);
				document.addEventListener('mouseup', mouseUpHandler, false);
			},
			nextPage: function () {
						  
			},
			render: function () { //console.log(77)

				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

				for (var i = 0, len = this.$flips.length; i < len; i ++) {
					var flip = this.$flips[i];
					if (flip.dragging) {
						flip.target = Math.max(Math.min(this.mouse.x/this.pageWidth, 1), -1);
					}

					flip.progress += (flip.target - flip.progress) * .2;

					if (flip.dragging || Math.abs(flip.progress) < .997) {
						this.drawFlip(flip);
					}
				}
			
			},
			drawFlip: function (flip) {
				var strength = 1 - Math.abs(flip.progress),
					foldWidth = (this.pageWidth*.5) * (1-flip.progress),
					foldX = this.pageWidth * flip.progress + foldWidth,
					verticalOutdent = 20 * strength,
					paperShadowWidth = (this.pageWidth*.5) * Math.max( Math.min(1 - flip.progress, .5), 0 ),
					rightShadowWidth = (this.pageWidth*.5) * Math.max( Math.min(strength, .5), 0 ),
					leftShadowWidth = (this.pageWidth*.5) * Math.max( Math.min(strength, .5), 0 ),
					page_y = this.opt.topSpace;

				flip.page.style.width = Math.max(foldX, 0) + 'px';
				this.ctx.save();
				this.ctx.translate(this.opt.canvasPadding + (this.bookWidth*.5), page_y + this.opt.canvasPadding);

				// sharp shadow of left page
				this.ctx.strokeStyle = 'rgba(0, 0, 0, '+(.05 * strength)+')';
				this.ctx.lineWidth = 30 * strength;
				this.ctx.beginPath();
				this.ctx.moveTo(foldX-foldWidth, -verticalOutdent*.5);
				this.ctx.lineTo(foldX-foldWidth, this.pageHeight + (verticalOutdent*.5));
				this.ctx.stroke();

				// right drop shadow
				var rightShadowGradient = this.ctx.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
				rightShadowGradient.addColorStop(0, 'rgba(0,0,0,'+(strength*.2)+')');
				rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0)');
				this.ctx.fillStyle = rightShadowGradient;
				this.ctx.beginPath();
				this.ctx.moveTo(foldX, 0);
				this.ctx.lineTo(foldX+rightShadowWidth, 0);
				this.ctx.lineTo(foldX + rightShadowWidth, this.pageHeight);
				this.ctx.lineTo(foldX, this.pageHeight);
				this.ctx.fill();

				// left drop shadow
				var leftShadowGradient = this.ctx.createLinearGradient(foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
				leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0)');
				leftShadowGradient.addColorStop(1, 'rgba(0,0,0,'+(strength*.15)+')');
				this.ctx.fillStyle = leftShadowGradient;
				this.ctx.beginPath();
				this.ctx.moveTo(foldX - foldWidth - leftShadowWidth, 0);
				this.ctx.lineTo(foldX - foldWidth, 0);
				this.ctx.lineTo(foldX - foldWidth, this.pageHeight);
				this.ctx.lineTo(foldX - foldWidth - leftShadowWidth, this.pageHeight);
				this.ctx.fill();

				// folded paper gradient
				var foldGradient = this.ctx.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
				foldGradient.addColorStop(.35, '#fafafa');
				foldGradient.addColorStop(.73, '#eeeeee');
				foldGradient.addColorStop(.9, '#fafafa');
				foldGradient.addColorStop(1, '#e2e2e2');

				this.ctx.fillStyle = foldGradient;
				this.ctx.strokeStyle = 'rgba(0,0,0,0.06)';
				this.ctx.lineWidth = .5;
				this.ctx.beginPath();
				this.ctx.moveTo(foldX, 0);
				this.ctx.lineTo(foldX, this.pageHeight);
				this.ctx.quadraticCurveTo(foldX, this.pageHeight + (verticalOutdent*2), foldX - foldWidth, this.pageHeight + verticalOutdent);
				this.ctx.lineTo(foldX - foldWidth, -verticalOutdent);
				this.ctx.quadraticCurveTo(foldX, -verticalOutdent*2, foldX, 0);
				this.ctx.fill();
				this.ctx.stroke();

				this.ctx.restore();
			},
			go : function () {
				var context = this;
				this.$timer = setInterval(function () {
					context.render();
				}, 1000/this.opt.fps);
			}
		}
		return init;

	}();	

	this.PageFlip = PageFlip;

 })(window)
