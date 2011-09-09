/**
 * QReader app
 * 用canvas绘制翻页效果，
 * 有两种翻页效果 hard & soft
 * hard用于封面封底一类，采用图片渲染
 * soft的直接在canvas上画矢量图
 */

Jx().$package('QReader', function (J) {
	var $D = J.dom,
		$id = $D.id,
		$ = $D.mini;
	
	this.WIN_WIDTH = window.innerWidth;
	this.WIN_HEIGHT = window.innerHeight;
	// 单页宽度
	this.PAGE_WIDTH = 1066;
	// 单页高度
	this.PAGE_HEIGHT = 720;
	// 纸张和书边的margin值
	this.PAGE_MARGIN_X = 14;
	this.PAGE_MARGIN_Y = 0;
	// 书的高宽， 包括边上的留白
	this.BOOK_WIDTH = 2160;
	this.BOOK_HEIGHT = 720;
	
	// 书容器
	this.BOOK = $id('book');
	// 页容器
	this.PAGES = $id('pages');

	// ua 判断
	this.UA = navigator.userAgent.toLowerCase();
	this.isTouchDevice = (/android|iphone|ipad/.test(this.UA));
	if (this.isTouchDevice) { $D.addClass(document.documentElement, 'touchdevice') }

	this.time = function () {
		return new Date().getTime();
	}

	// Region Class
	// 用于产生一个区域
	this.Region = J.Class({
		init: function () {
			this.left = 999999;
			this.top = 999999;
			this.right = 0;
			this.bottom = 0;
		},
		reset: function () {
			this.left = 999999;
			this.top = 999999;
			this.right = 0;
			this.bottom = 0;
		},
		inflate: function (x, y) {
			this.left = Math.min(this.left, x);
			this.top = Math.min(this.top, y);
			this.right = Math.max(this.right, x);
			this.bottom = Math.max(this.bottom, y);
		} ,
		contains: function (x, y) {
			return (x > this.left && x < this.right && y > this.top && y < this.bottom);
		},
		// 扩展一个正方形区域
		toRectangle: function (padding) {
			padding |= 0;
			return {
				x : this.left - padding,
				y : this.top - padding,
				width: this.right - this.left + (padding*2),
				height: this.bottom - this.top + (padding*2)
			}
		}
	});

	this.log = function (s) {
		if (window.console && s) {
			window.console.log(s);
		}
	};

	this.initialize = function () {
		QReader.preload.initialize();
		QReader.pageflip.initialize();

	}

});


/**
 * package {QReader.preload}
 * 资源预加载，初始化设置
 */
Jx().$package('QReader.preload', function (J) {
	
	var packageContext = this,
		$D = J.dom,
		$E = J.event;


	this.initialize = function () {
		this.resetConst();
		this.resetBookStyle();
	}

	this.resetConst = function () {
		if (QReader.isTouchDevice) {
			// 重置const 为pad版本
			QReader.PAGE_WIDTH = 800;
			QReader.PAGE_HEIGHT = 500;
			QReader.PAGE_MARGIN_X = 14;
			QReader.PAGE_MARGIN_Y = 0;
			QReader.BOOK_WIDTH = (QReader.PAGE_WIDTH + QReader.PAGE_MARGIN_X) * 2;
			QReader.BOOK_HEIGHT = (QReader.PAGE_HEIGHT + QReader.PAGE_MARGIN_Y) * 2;

			QReader.pageflip.CANVAS_V_PADDING = 80;
			QReader.pageflip.CANVAS_H_PADDING = 20;
			QReader.pageflip.CANVAS_WIDTH = QReader.BOOK_WIDTH + (QReader.pageflip.CANVAS_H_PADDING * 2);
			QReader.pageflip.CANVAS_HEIGHT = QReader.BOOK_HEIGHT + (QReader.pageflip.CANVAS_V_PADDING * 2);
		}

	}

	this.resetBookStyle = function () {
		$D.setStyle(QReader.BOOK, 'width', QReader.BOOK_WIDTH + 'px');
		$D.setStyle(QReader.BOOK, 'height', QReader.BOOK_HEIGHT + 'px');
		$D.setStyle(QReader.BOOK, 'marginLeft', -QReader.BOOK_WIDTH*3/4 + 'px');
	}

})


/**
 * package {QReader.pageflip}
 * 翻页效果控制和渲染
 */
Jx().$package('QReader.pageflip', function (J) {

	var $D = J.dom,
		$E = J.event,
		context = this;
		$D.getNextElement = function (el) { 
							var node = el.nextSibling;
							if (node.nodeType == 1) {
								return node;
							}
							else if (node.nextSibling) {
								return $D.getNextElement(node);
							}
							return null;
						};
	
	// canvas 要比书大一点，用于绘制3d效果
	// 上下padding值
	this.CANVAS_V_PADDING = 80;
	this.CANVAS_H_PADDING = 20;
	// canvas高宽
	this.CANVAS_WIDTH = QReader.BOOK_WIDTH + (this.CANVAS_H_PADDING * 2);
	this.CANVAS_HEIGHT = QReader.BOOK_HEIGHT + (this.CANVAS_V_PADDING * 2);
	// 触发翻页效果的区域宽度
	this.HINT_WIDTH = 200;
	this.HINT_WIDTH_TOUCH = 300;
	// mousedown 后多长时间开始算作拖拽动作
	this.CLICK_FREQUENCY = 350;
	this.pages = [];
	this.flips = [];
	this.mouseHistory = [];
	this.canvas = null;
	this.dragging = false;
	this.turning = false;
	this.mouse = {
		x: 0,
		y: 0,
		down: false
	};
	// 用于绘制拖拽页边的倾斜角度
	this.skew = {
		top: 0,
		topTarget: 0,
		bottom: 0,
		bottomTarget : 0
	};
	this.ctx = null;
	this.mouseDownTime = 0;
	this.texture = null;
	this.textures = {};
	this.flipLeftPage = null;
	this.flipBackCover = null;
	this.isEventsAreBound = false;
	this.loopInterval = -1;
	this.fps = 30;
	this.dirtyRegion = new QReader.Region();

	// 初始化
    this.initialize = function () {
		this.createCanvas();
		this.createTextures();
		if (!this.isEventsAreBound) {
			this.registerEventListeners();
		}
	};

	// 绑定事件
	this.registerEventListeners = function () {
		this.unRegisterEventListeners();
		this.isEventsAreBound = true;
		$E.on(document, 'mousemove', this.onMouseMove);
		$E.on(document, 'mousedown', this.onMouseDown);
		$E.on(document, 'mouseup', this.onMouseUp);
		if (QReader.isTouchDevice) {
			document.addEventListener('touchstart', this.onTouchStart, false);
			document.addEventListener('touchmove', this.onTouchMove, false);
			document.addEventListener('touchend', this.onTouchEnd, false);
		}
	};

	// 移除事件
	this.unRegisterEventListeners = function () {
		this.isEventsAreBound = false;
		$E.off(document, 'mousemove', this.onMouseMove);
		$E.off(document, 'mousedown', this.onMouseDown);
		$E.off(document, 'mouseup', this.onMouseUp);
		if (QReader.isTouchDevice) {
			document.removeEventListener('touchstart', this.onTouchStart);
			document.removeEventListener('touchmove', this.onTouchMove);
			document.removeEventListener('touchend', this.onTouchEnd);
		}
	};

	// 创建画布
	this.createCanvas = function () {
		this.canvas = $D.node('canvas', {
					id: 'pageflip'
				});
		$D.setStyle(this.canvas, 'position', 'absolute');
		$D.setStyle(this.canvas, 'top', -this.CANVAS_V_PADDING + 'px');
		$D.setStyle(this.canvas, 'left', -this.CANVAS_H_PADDING + 'px');
		this.canvas.width = this.CANVAS_WIDTH;
		this.canvas.height = this.CANVAS_HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		QReader.BOOK.appendChild(this.canvas);
	}

	// 获取用于渲染的材质，主要是封底封面的图片
	this.createTextures = function () {
		// to be continue
		this.flipLeftPage = null;
		this.flipBackCover = null;
		
		this.textures.front = null; // 封面正面
		this.textures.back = this.flipBackCover; //封底正面
		this.textures.left = this.flipLeftPage; // 封面内页
		this.textures.right = null; // 封底内页
	}
	
	// 动画激活
	this.activate = function () {
		if (this.loopInterval == -1) {
			clearInterval(this.loopInterval);
			this.loopInterval = setInterval(function () { context.reDraw() }, 1000/this.fps);
		}
		$D.setStyle(this.canvas, 'zIndex', 1000);
	}

	// 停止绘制
	this.deActivate = function () {
		clearInterval(this.loopInterval);
		this.loopInterval = -1;
		this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		$D.setStyle(this.canvas, 'zIndex', 0);
	}

	// 绘制canvas动画
	this.reDraw = function () {
		var cvs = this.canvas,
			ctx = this.ctx;
		// 每次把脏区域扩展40足够容错了
		var dirtyRect = this.dirtyRegion.toRectangle(40);
		if (dirtyRect.width > 1 && dirtyRect.height > 1) {
			ctx.clearRect(dirtyRect.x, dirtyRect.y, dirtyRect.width, dirtyRect.height);
		}
		this.dirtyRegion.reset();
		// 以下要针对业务改进，页数过多时这种循环效率很低
		for (var i = 0, len = this.flips.length; i < len; i ++) {
			var flip = this.flips[i];
			if (flip.type == 'hard') {
				// 为封面封底
				this.renderHardFlip(flip);
			} else {
				this.renderSoftFlip(flip);
			}
		}
		this.removeInactiveFlips();
	}

	// 绘制内页的翻页动画
	this.renderSoftFlip = function (flip) {
		var mouse = this.mouse,
			skew = this.skew,
			cvs = this.canvas,
			ctx = this.ctx,
			currentPage = flip.currentPage;

		if (flip.direction == -1) {
			currentPage = flip.targetPage;
		} else {
			flip.targetPage.width(QReader.PAGE_WIDTH);
		}

		if (this.dragging && !flip.consumed) {
			// 拖拽而且正在翻页中,跟着鼠标走
			mouse.x = Math.max(Math.min(mouse.x, QReader.PAGE_WIDTH), - QReader.PAGE_WIDTH);
			mouse.y = Math.max(Math.min(mouse.y, QReader.PAGE_HEIGHT), 0);
			flip.progress = Math.min(mouse.x/QReader.PAGE_WIDTH, 1);
		} else {
			// 完成翻页动作，缓动过程
			var distance = Math.abs(flip.target - flip.progress),
				speed = flip.target == -1 ? .3 : .2,
				ease = distance < 1 ? speed + Math.abs(flip.progress * (1 - speed)) : speed;
			ease *= Math.max(1 - Math.abs(flip.progress), flip.target == 1 ? .5 : .2);
			flip.progress += (flip.target - flip.progress) * ease;
			
			// 翻页动作完成
			if (Math.round(flip.progress * 99) == Math.round(flip.target * 99)) {
				flip.progress = flip.target;
				flip.x = flip.progress + QReader.PAGE_WIDTH;
				$D.setStyle(currentPage, 'width', flip.x + 'px');

				if (flip.target == 1 || flip.target == -1) {
					// 要完全翻页
					flip.consumed = true;
					this.completeCurrentTurn();
					return false;
				}
			}
		}
		
		// 当前帧
		flip.x = QReader.PAGE_WIDTH * flip.progress;
		flip.strength = 1 - (flip.x / QReader.PAGE_WIDTH);
		if (flip.target == -1 && flip.progress < -0.9) {
			// 当向左翻页接近完成时，透明度变化
			flip.alpha = 1 - ((Math.abs(flip.progress) - 0.9)/0.1);
		}
		var shadowAlpha = Math.min(1 - ((Math.abs(flip.progress) - 0.75) / 0.25), 1),
			centralizedFoldStrength = flip.strength > 1 ? 2 - flip.strength : flip.strength,
			verticalOutdent = 40 * centralizedFoldStrength,
			horizontalSpread = (QReader.PAGE_WIDTH * .5) * flip.strength * .95;
		if (flip.x + horizontalSpread < 0) {
			horizontalSpread = Math.abs(flip.x);
		}

		var shadowSpread = (QReader.PAGE_WIDTH * .5) * Math.max(Math.min(flip.strength, .5), 0),
			rightShadowWidth = (QReader.PAGE_WIDTH * .5) * Math.max(Math.min(flip.strength, .5), 0),
			leftShadowWidth = (QReader.PAGE_WIDTH * .5) * Math.max(Math.min(centralizedFoldStrength, .5), 0),
			foldShadowWidth = (QReader.PAGE_WIDTH * .5) * Math.max(Math.min(flip.strength, .05), 0);

		$D.setStyle(currentPage, 'width', Math.max(flip.x + horizontalSpread*.5, 0) + 'px');

		// 拖拽页边有倾斜角度
		if (this.dragging) {
			skew.topTarget = Math.max(Math.min((mouse.y/(QReader.PAGE_HEIGHT * .5)), 1), 0) * (40 * centralizedFoldStrength);
			skew.bottomTarget = Math.max(Math.min(1- (mouse.y - (QReader.PAGE_HEIGHT * .5)) / (QReader.PAGE_HEIGHT * .5), 1), 0) * (40 * centralizedFoldStrength);
		} else {
			skew.topTarget = 0;
			skew.bottomTarget = 0;
		}

		if (flip.progress == 1) {
			skew.top = 0;
			skew.bottom = 0;
		}
		// 页边倾斜角度变化
		skew.top += (skew.topTarget - skew.top) * .03;
		skew.bottom += (skew.bottomTarget - skew.bottom) * .03;
		flip.x += horizontalSpread;
		
		// 开始的位置
		// 翻页从右边开始，所以开始位置在纸张右上角
		var drawingOffset = {
			x: this.CANVAS_H_PADDING + QReader.PAGE_MARGIN_X + QReader.PAGE_WIDTH,
			y: this.CANVAS_V_PADDING + QReader.PAGE_MARGIN_Y
		};
		
		// draw canvas
		ctx.save();
		ctx.translate(drawingOffset.x, drawingOffset.y);
		ctx.globalAlpha = flip.alpha;
		// 相交矢量图，先画的在上
		if (flip.direction == -1) {
			ctx.globalCompositeOperation = 'destination-over';
		}
		// 画卷页的右边界
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.lineWidth = .5;
		ctx.beginPath();
		ctx.moveTo(flip.x + 1, 0);
		ctx.lineTo(flip.x + 1, QReader.PAGE_HEIGHT);
		ctx.stroke();

		// 画卷页下边的弧形，填充阴影和高光，看起来有3d效果
		var foldGradient = ctx.createLinearGradient(flip.x - shadowSpread, 0, flip.x, 0);
		foldGradient.addColorStop(.35, '#fafafa');
		foldGradient.addColorStop(.73, '#eeeeee');
		foldGradient.addColorStop(.9, '#fafafa');
		foldGradient.addColorStop(1, '#e2e2e2');
		ctx.fillStyle = foldGradient;
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
		ctx.lineWidth = .5;
		ctx.beginPath();
		ctx.moveTo(flip.x, 0);
		ctx.lineTo(flip.x, QReader.PAGE_HEIGHT);
		ctx.quadraticCurveTo(flip.x, QReader.PAGE_HEIGHT + (verticalOutdent * 1.9),
							flip.x - horizontalSpread + skew.bottom, QReader.PAGE_HEIGHT + verticalOutdent);
		ctx.lineTo(flip.x - horizontalSpread + skew.top, -verticalOutdent);
		ctx.quadraticCurveTo(flip.x, -verticalOutdent*1.9, flip.x, 0);
		ctx.fill();
		ctx.stroke();
		
		// 卷页阴影中的一束高光
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(0,0,0, '+ (0.04*shadowAlpha) +')';
		ctx.lineWidth = 20* shadowAlpha;

		// 卷页左侧边界
		ctx.beginPath();
		ctx.moveTo(flip.x + skew.top - horizontalSpread, -verticalOutdent*.5);
		ctx.lineTo(flip.x + skew.bottom - horizontalSpread, QReader.PAGE_HEIGHT + (verticalOutdent*.5));
		ctx.stroke();

		// 卷页在右侧纸张上投下的阴影
		var rightShadowGradient = ctx.createLinearGradient(flip.x, 0, flip.x + rightShadowWidth, 0);
		rightShadowGradient.addColorStop(0, 'rgba(0,0,0, '+ (shadowAlpha*.1) +')');
		rightShadowGradient.addColorStop(.8, 'rgba(0,0,0,0)');
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = rightShadowGradient;
		ctx.beginPath();
		ctx.moveTo(flip.x, 0);
		ctx.lineTo(flip.x + rightShadowWidth, 0);
		ctx.lineTo(flip.x + rightShadowWidth, QReader.PAGE_HEIGHT);
		ctx.lineTo(flip.x, QReader.PAGE_HEIGHT);
		ctx.fill();

		// 过度到更浅一点的阴影渐变
		var foldShadowGradient = ctx.createLinearGradient(flip.x, 0, flip.x + foldShadowWidth, 0);
		foldShadowGradient.addColorStop(0, 'rgba(0,0,0, '+ (shadowAlpha*.15) +')');
		foldShadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = foldShadowGradient;
		ctx.beginPath();
		ctx.moveTo(flip.x, 0);
		ctx.lineTo(flip.x + foldShadowWidth, 0);
		ctx.lineTo(flip.x + foldShadowWidth, QReader.PAGE_HEIGHT);
		ctx.lineTo(flip.x, QReader.PAGE_HEIGHT);
		ctx.fill();
		ctx.restore();

		// 卷页左侧投下的阴影
		var leftShadowGradient = ctx.createLinearGradient(flip.x - horizontalSpread - leftShadowWidth, 0 , flip.x - horizontalSpread, 0);
		leftShadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
		leftShadowGradient.addColorStop(1, 'rgba(0,0,0, '+ (shadowAlpha*.05) +')');
		ctx.fillStyle = leftShadowGradient;
		ctx.beginPath();
		ctx.moveTo(flip.x - horizontalSpread + skew.top - leftShadowWidth, 0);
		ctx.lineTo(flip.x - horizontalSpread + skew.top, 0);
		ctx.lineTo(flip.x - horizontalSpread + skew.bottom, QReader.PAGE_HEIGHT);
		ctx.lineTo(flip.x - horizontalSpread + skew.bottom - leftShadowWidth, QReader.PAGE_HEIGHT);
		ctx.fill();
		ctx.restore();

		this.dirtyRegion.inflate(QReader.PAGE_WIDTH + this.CANVAS_H_PADDING + flip.x - horizontalSpread - leftShadowWidth, 0);
		this.dirtyRegion.inflate(QReader.PAGE_WIDTH + this.CANVAS_H_PADDING + flip.x + rightShadowWidth, this.CANVAS_HEIGHT);
	}
	
	// 绘制硬纸张的翻转动画
	// 用于硬的封面封底
	this.renderHardFlip = function (flip) {
		// TODO
	}
	
	// 移除变换的翻页
	this.removeInactiveFlips = function () {
		var activeFlips = 0;
		for (var i = 0; i < this.flips.length; i ++) {
			var flip = this.flips[i];
			if (flip.progress == flip.target && (flip.target == 1 || flip.target == -1)) {
				this.flips.splice(i, 1);
				i --;
			} else {
				activeFlips ++;
			}
		}

		if (activeFlips == 0) {
			this.deActivate();
		}
	};

	this.removeHardFlips = function () {
		for (var i = 0; i < this.flips.length; i ++) {
			var flip = this.flips[i];
			if (flip.type == 'hard') {
				this.flips.splice(i, 1);
				i --;
			}
		}
	};

	// 翻到指定页
	this.turnToPage = function (currentPage, targetPage, direction, type) {
		if (type == 'hard' && !this.dragging) {
			this.removeHardFlips();
		}
		var flip = this.getCurrentFlip();
		if (flip.consumed) {
			flip = this.createFlip();
		}

		this.dragging = false;
		this.turning = true;
		this.hinting = false;

		flip.currentPage = currentPage;
		flip.targetPage = targetPage;
		flip.direction = direction;
		flip.alpha = 1;
		flip.consumed = true;
		flip.type  = type || 'soft';
		flip.target = -1;

		if (direction == -1) {
			flip.target = 1;
			flip.progress = -1;
		}

		if (QReader.navigation.isFullScreen()) {
			flip.progress = flip.target * .95;
		}

		this.activate();
		this.reDraw();
	} 

	// 翻页过程中松手，继续完成翻页动作
	this.completeCurrentTurn = function () {
		if (this.turning) {
			this.turning = false;
			var flip = this.flips[this.flips.length - 1];
			if (flip) {
				QReader.navigation.updateCurrentPointer(flip.currentPage, flip.targetPage);
			}
		}
	};

	// 获取当前翻页
	this.getCurrentFlip = function () {
		if (this.flips.length == 0) {
			this.createFlip();
		}
		return this.flips[this.flips.length - 1];
	}
	
	// 创建一个翻页对象
	this.createFlip = function () {
		if (this.flips.length > 3) {
			this.flips = this.flips.splice(4, 99);
		}
		var flip = new this.Flip()
		this.flips.push(flip);
		return flip;
	}

	// 获取触发翻页的钩子区域
	this.getHintRegion = function () {
		var region = new QReader.Region();
		if (QReader.navigation.isHomePage() || QReader.navigation.isLastPage() || QReader.navigation.isCreditsPage()) {
			region.left = QReader.BOOK_WIDTH/2 - (QReader.isTouchDevice ? this.HINT_WIDTH_TOUCH : this.HINT_WIDTH);
			region.right = QReader.BOOK_WIDTH/2;
		} else {
			region.left = QReader.PAGE_WIDTH - (QReader.isTouchDevice ? this.HINT_WIDTH_TOUCH : this.HINT_WIDTH);
			region.right = QReader.PAGE_WIDTH;
		}
		region.top = 0;
		region.bottom = QReader.PAGE_HEIGHT;

		return region;
	}

	// 判读鼠标是否落在翻页钩子区域
	this.isMouseInHintRegion = function () {
		return this.getHintRegion().contains(this.mouse.x, this.mouse.y);
	}

	// 处理鼠标按下事件
	this.handlePointerDown = function () {
		if (this.isMouseInHintRegion()) {
			$D.setStyle(document.body, 'cursor', 'pointer');
			if (QReader.time() - this.mouseDownTime > this.CLICK_FREQUENCY) {
				this.dragging = true;
			}
			this.mouseDownTime = QReader.time();
			this.activate();
		}
	}

	// 处理鼠标移动
	this.handlePointerMove = function () {
		var hinting = this.hinting;
		this.hinting = false;
		$D.setStyle(document.body, 'cursor', '');

		if (!this.dragging && !this.turning && (!QReader.navigation.isCreditsPage() || (QReader.navigation.isCreditsPage() && QReader.navigation.isBookOpen()))) {
			var flip = this.getCurrentFlip();
			if (flip.progress < 0) {
				flip = this.createFlip();
			}
			var isHardCover = (QReader.navigation.isHomePage() || QReader.navigation.isLastPage() || (QReader.navigation.isCreditsPage() && QReader.navigation.isBookOpen()));
			flip.type = isHardCover ? 'hard' : 'soft';

			if (this.isMouseInHintRegion()) {
				if (this.mouseHistory[4]) {
					var distanceX = this.mouse.x - (this.mouseHistory[4].x || 0);
					var distanceY = this.mouse.y - (this.mouseHistory[4].y || 0);
					var distanceTravelled = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
				} else {
					var distanceTravelled = 0;
				}

				if (!QReader.navigation.isHomePage() || distanceTravelled < 100) {
					flip.target = Math.min(this.mouse.x / QReader.PAGE_WIDTH, .98);
					$D.setStyle(document.body, 'cursor', 'pointer');
					this.activate();
					this.hinting = true;
					if (QReader.navigation.isHomePage()) {
						flip.target = Math.min(this.mouse.x / QReader.PAGE_WIDTH, .95);
						var currentPage = $D.mini('#pages section.current')[0];
						$D.setStyle(currentPage, 'width', QReader.PAGE_WIDTH + 'px');
						$D.setStyle(currentPage, 'display', 'block');
					} else {
						var currentPage = $D.mini('#pages section.current')[0];
					
						var nextPage = $D.getNextElement(currentPage);
						if (nextPage.nodeName.toLowerCase() == 'section') {
							$D.setStyle(nextPage, 'width', QReader.PAGE_WIDTH);
							$D.show(nextPage);
						}
					}
				}
			} else {
				if (flip.progress != 1 && flip.target != -1) {
					if (this.hinting == true) {
						var currentPage = $D.mini('#pages section.current')[0];
						var nextPage = $D.getNextElement(currentPage);
						$D.setStyle(nextPage, 'width', 0);
					}
					flip.target = 1;
					this.activate();
					this.hinting = false;
				}
			}
		} else {
			if (this.dragging) {
				if (this.getCurrentFlip().type != 'hard') {
					this.getCurrentFlip().alpha = 1;
				}
			}
		}

		while (this.mouseHistory.length > 9) {
			this.mouseHistory.pop();
		}

		this.mouseHistory.unshift(this.mouse);
	}

	// 鼠标松开
	this.handlePointerUp = function () {
		if (QReader.time() -  this.mouseDownTime < this.CLICK_FREQUENCY) {
			QReader.navigation.goToNextPage();
			this.dragging = false;
			return false;
		}
		if (this.dragging && this.mouse.x < QReader.PAGE_WIDTH * .45) {
			var succeeded = QReader.navigation.goToNextPage();
			if (succeeded == false) {
				this.dragging = false;
			}
		} else {
			this.dragging = false;
			this.handlePointerMove();
		}
	}

	this.onMouseDown = function (event) {
		context.mouse.down = true;
		context.updateRelativeMousePosition(event.clientX, event.clientY);
		context.handlePointerDown();
		if (context.isMouseInHintRegion()) {
			event.preventDefault();
			return false;
		}
	}

	this.onMouseMove = function (event) {
		context.updateRelativeMousePosition(event.clientX, event.clientY);
		context.handlePointerMove();
	}

	this.onMouseUp = function (event) {
		context.mouse.down = false;
		context.updateRelativeMousePosition(event.clientX, event.clientY);
		context.handlePointerUp();
	}

	// 移动设备 touch 事件支持
	this.onTouchStart = function (event) {
		if (event.touches.length == 1) {
			var globalX = event.touches[0].pageX - (window.innerWidth - QReader.PAGE_WIDTH) * .5;
			var globalY = event.touches[0].pageY - (window.innerHeight - QReader.PAGE_HEIGHT) * .5;
			context.updateRelativeMousePosition(globalX, globalY);
			context.mouse.down = true;
			if (context.isMouseInHintRegion()) {
				event.preventDefault();
				context.handlePointerDown();
			}
		}
	}

	this.onTouchMove = function (event) {
		if (event.touches.length == 1) {
			var globalX = event.touches[0].pageX - (window.innerWidth - QReader.PAGE_WIDTH) * .5;
			var globalY = event.touches[0].pageY - (window.innerHeight - QReader.PAGE_HEIGHT) * .5;
			context.updateRelativeMousePosition(globalX, globalY);
			if (context.isMouseInHintRegion()) {
				event.preventDefault();
				context.handlePointerMove();
			}
		}
	}

	this.onTouchEnd = function (event) {
		context.mouse.down = false;
		context.handlePointerUp();
	}

	// 获取鼠标相对坐标
	this.getRelativeMousePosition = function (globalX, globalY) {
		var point = {
			x: globalX,
			y: globalY
		};
		point.x -= $D.getXY(QReader.PAGES)[0] + QReader.PAGE_WIDTH;
		point.y -= $D.getXY(QReader.PAGES)[1];

		return point;
	}

	// 更新鼠标坐标
	this.updateRelativeMousePosition = function (globalX, globalY) {
		var point = this.getRelativeMousePosition(globalX, globalY);
		this.mouse.x = point.x;
		this.mouse.y = point.y;
	}

	// Flip类，用于创建一个翻页实例
	this.Flip = function () {
		this.id = Math.round(Math.random() * 1000);
		this.currentPage = $D.mini('#pages section.current')[0];
		this.targetPage = $D.mini('#pages section.current')[0];
		this.direction = -1;
		this.progress = 1;
		this.target = 1;
		this.strength = 0;
		this.alpha = 1;
		this.type = 'soft';
		this.x = 0;
		this.consumed = false;
	}
});


/**
 * package {QReader.navigation}
 * 处理页面导航逻辑
 */
Jx().$package('QReader.navigation', function (J) {

	this.isCreditsPage = function () {
		return false;
	}

	this.isHomePage = function () {
		return false;
	}

	this.isFullScreen = function () {
		return false;
	}

	this.isBookOpen = function () {
		return true;
	}
	
	this.goToNextPage = function () {
		return false;
	}

	this.isLastPage = function () {
		return false;
	}

})


QReader.initialize();
