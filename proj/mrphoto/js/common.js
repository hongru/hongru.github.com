/* common methods */
(function ($, undefined) {

    var self = this;
    if (!$) { this['$'] = {}; }
    
    // namespace
    $.NS = function (name, fn) {
        var names = name.split('.'),
            i = -1,
            loopName = self;
        if (names[0] == '') {
            names[0] = '$';
        }
        
        while (names[++ i]) {
            var na = names[i];
            if (loopName[na] ===  undefined) {
                loopName[na] = {};
            }
            loopName = loopName[na];
        }
        !!fn && fn.call(loopName, $);
    };
    
    // escape
    $.escape = function(string) {
        return (''+string).replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;')
                          .replace(/'/g, '&#x27;')
                          .replace(/\//g,'&#x2F;');
    };
    // template
    $.templateSettings = {
        evaluate    : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g,
        escape      : /<%-([\s\S]+?)%>/g
    };
    var noMatch = /.^/;
    var unescape = function(code) {
        return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
    };

    $.template = function (str, data) {
        var c  = $.templateSettings;
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
            'with(obj||{}){__p.push(\'' +
            str.replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(c.escape || noMatch, function(match, code) {
                    return "',$.escape(" + unescape(code) + "),'";
                })
                .replace(c.interpolate || noMatch, function(match, code) {
                    return "'," + unescape(code) + ",'";
                })
                .replace(c.evaluate || noMatch, function(match, code) {
                    return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
                })
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n')
                .replace(/\t/g, '\\t')
                + "');}return __p.join('');";
                
        var func = new Function('obj', '$', tmpl);
        if (data) return func(data, $);
        
        return function (data) {
            return func.call(this, data, $);
        };
    };
		
	// image ready
	/**
	 * @param	{String}	图片路径
	 * @param	{Function}	尺寸就绪
	 * @param	{Function}	加载完毕 (可选)
	 * @param	{Function}	加载错误 (可选)
	 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
	 */
	var imgReady = (function () {
		var list = [], intervalId = null,

		// 用来执行队列
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},

		// 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};

		return function (url, ready, load, error) {
			var onready, width, height, newWidth, newHeight,
				img = new Image();

			img.src = url;

			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};

			width = img.width;
			height = img.height;

			// 加载错误后的事件
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};

			// 图片尺寸就绪
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||
					// 如果图片已经在其他地方加载可使用面积检测
					newWidth * newHeight > 1024
				) {
					ready.call(img);
					onready.end = true;
				};
			};
			onready();

			// 完全加载完毕的事件
			img.onload = function () {
				// onload在定时器时间差范围内可能比onready快
				// 这里进行检查并保证onready优先执行
				!onready.end && onready();

				load && load.call(img);

				// IE gif动画会循环执行onload，置空onload即可
				img = img.onload = img.onerror = null;
			};

			// 加入队列中定期执行
			if (!onready.end) {
				list.push(onready);
				// 无论何时只允许出现一个定时器，减少浏览器性能损耗
				if (intervalId === null) intervalId = setInterval(tick, 40);
			};
		};
	})();
	$.imgReady = imgReady;

})(jQuery);

// jquery easing
// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];
 
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

// jq.mousewheel
(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

// main script
$.NS('FiPhoto', function () {
	var pkg = this;
	var downloadMime = 'image/octet-stream';
	
	this.size11 = {w: 650, h: 650};
	this.size43 = {w: 800, h: 600};
    this.step = 0;
	
	function generateCanvas(succFunc, errFunc) {
		pkg.$con = $('#container');
		pkg.$wrap = pkg.$con.parent();
		pkg.$imgWrap = $('#image-wrap');
		pkg.$tabWrap = $('#fx-tab-container');
		pkg.$toolbar = $('#toolbar');
		pkg.$toolbtns = $('#toolbar a');
		pkg.$doc = $('#doc');
		pkg.$mode = $('#mode');
		pkg.$modeli = $('#mode li');
		try {
			var canvas = fx.canvas();
			if (!!canvas) {
				pkg.canvas = canvas;                      
				succFunc(canvas);
			}
			
		} catch(e) {
			alert(e);
			!!errFunc && errFunc();
			return;
		}
	}
	
	function bindEvent() {
		freeModeBind();
		pkg.$modeli.bind('click', function (e) {
			pkg.setMode($(this).attr('data-mode'));
		})
	}
	
	function freeModeBind () {
		pkg.$con.bind('dragenter', function (e) {
			e.preventDefault();
			pkg.$wrap.addClass('dragover');
			pkg.$wrap.addClass('noimg');
			pkg.$con.html('');
			$(pkg.canvas).css({opacity: 0});
		}).bind('dragleave', function (e) {
			e.preventDefault();
			pkg.$wrap.removeClass('dragover');
			//pkg.$con.html('<div class="drop-inner"></div>');
		}).bind('dragover', function (e) {
			e.preventDefault();
			
		}).bind('drop', function (e) {
			e.preventDefault();

			var dt = e.dataTransfer || e.originalEvent.dataTransfer;  
			var files = dt.files; 

			pkg.handleFiles(files);  
		});
	}
	
	function limitModeBind () {
		
	}
	
	function errCallback() {
		pkg.$con.html('Sorry, Your browser do not support webGL')
	}
	
	function _init () {
		bindEvent();
		pkg.setMode();
	}
	
	this.mode = 'limit'; // | limit
	
	this.init = function () {
		generateCanvas(_init, errCallback);
		FiPhoto.operation.init();
		/*
		FiPhoto.tab.init();
		FiPhoto.toolbar.init();
		FiPhoto.cut.init();
		FiPhoto.roll.init();
		FiPhoto.share.init();
		*/
	};
	this.setMode = function (mode) {
		if (mode == undefined) {
			mode = this.mode || 'free';
		}
		this.mode = mode;
		pkg.$modeli.each(function () {
			if ($(this).attr('data-mode') == mode) {
				$(this).addClass('current');
			} else {
				$(this).removeClass('current');
			}
		})
	};
	this.handleFiles = function (files) {
		for (var i = 0; i < files.length; i++) {  
			var file = files[i];  
			var imageType = /image.*/;  
			  
			if (!file.type.match(imageType)) {  
			  continue;  
			}  

			var reader = new FileReader();  
			reader.onload = function(e){ 
				if (pkg.mode == 'free') {
					// 直接进入滤镜状态
					pkg.setFx('normal', e.target.result);
					pkg.$wrap.removeClass('dragover');
					pkg.$wrap.removeClass('noimg');	
				} else {
					pkg.$wrap.removeClass('dragover');
					pkg.$wrap.removeClass('noimg');	
                    !FiPhoto.$con.find('canvas')[0] && FiPhoto.operation.initCanvas();
					FiPhoto.operation.initImage(e.target.result);
				}
				
			}

			reader.readAsDataURL(file);  
		}  
	}

	
	this.setFx = function (type, url) {
		var image = document.getElementById('fx-image');
		if (!image) {
			image = document.createElement('img');
			image.id = 'fx-image';

			pkg.$imgWrap.append(image);
		}
		pkg.image = image;
		var oldUrl = pkg.image.src;
	
		if (url) {
			pkg.image.src = url;
		}
		var ww = pkg.image.width,
			hh = pkg.image.height,
			mm = Math.max(ww, hh);
		if (!url && mm > 0 && mm <= 1024) {
			FiPhoto.fx[type]();
			FiPhoto.tab.show();
			FiPhoto.tab.update(type);
			FiPhoto.toolbar.show();
			return;
		}
		$.imgReady(url, function () {
		
			var newW = this.width, newH = this.height;
			var max = Math.max(newW, newH);
			if (max > 1024) {
				if (max == newW) {
					var div = newH/newW;
					newW = 1024;
					newH = Math.round(newW * div);
				} else if (max == newH) {
					var div = newW/newH;
					newH = 1024;
					newW = Math.round(newH*div);
				}
			}
			pkg.image.width = newW;
			pkg.image.height = newH;
			
			FiPhoto.fx[type]();
			FiPhoto.tab.show();
			FiPhoto.tab.update(type);
			FiPhoto.toolbar.show();
		})
		//$(pkg.image).hide();
		/*
		FiPhoto.fx[type]();
		FiPhoto.tab.show();
		FiPhoto.tab.update(type);
		FiPhoto.toolbar.show();
		*/
	};
	
	// save image
	this.save = function () {
		var dataURL = pkg.canvas.toDataURL();
		document.location.href = dataURL.replace(/image\/png/i, downloadMime);
		$('<a href="'+dataURL+'">img</a>').appendTo('body');
	}
	this.createImage = function (src) {
		var img = document.createElement('img');
		img.src = src;
		return img;
	};
	
	// get click cmd el & info
	this.CLICKIN = {};
	this.getCmdInfo = function (el, toEl, filterAttr) {
		if (!toEl) {toEl = document.body}
		if (!filterAttr) {filterAttr = 'data-cmd'}
		if (!el) { return null; }
		
		var related = el.getAttribute('data-related');
		if (!!related) {
			this.CLICKIN[related] = 1;
		}
		
		var cmd = el.getAttribute(filterAttr);
		if (!!cmd) {
			return {
				el: el,
				cmd: cmd
			};
		} else if (el.parentNode && el.parentNode.nodeType == 1) {
			return arguments.callee.call(this, el.parentNode, toEl, filterAttr);
		}
	};
});

/* FiPhoto.operation */
// 第一步的图片手术
$.NS('FiPhoto.operation', function () {
	var pkg = this;
    var step1 = {};
	
	this.imgInfo = {
		src: '',
		width: 0,
		height: 0,
		limitW: 0,
		limitH: 0
	}
	this.limitMode = '11';
	this.limitInfo = {
		'11': [650, 650],
		'43': [800, 600]
	}
	
	this.init = function (oSize) {
		if (oSize == undefined) { oSize = FiPhoto.size11 };
		this.size = oSize;		
        this.getStepEls();
        this.bind();
	};
    
    this.initCanvas = function () {
        this.create();
		this.setCvsPos();
    }
    
    this.getStepEls = function () {
        step1.$tit = $('#fx-step1 .ea-title');
        step1.$btns = $('#fx-step1 .btn');
		step1.$l_btns = $('#fx-step1 .limit-btn');
		step1.$l_btnbg = $('#limit-btn-bg');
		step1.$dropArea = $('#drop-area');
		step1.$container = $('#container');
        
        var titPos = step1.$tit.show().position();
        step1.$tit.attr({
            'data-left': titPos.left,
            'data-top': titPos.top
        }).hide();

        step1.$btns.each(function () {
            var pos = $(this).show().position();
            $(this).attr({
                'data-left': pos.left,
                'data-top': pos.top
            }).hide();
        });
        
        this['step1'] = step1;
    };
    
    this.bind = function () {
		$('body').unbind('click.dispatch');
		$('body').bind('click.dispatch', function (e) {
			e.preventDefault();
			// reset
			FiPhoto.CLICKIN = {};
			var bubble = FiPhoto.getCmdInfo(e.target);
			if (bubble) {
				var cmd = bubble.cmd,
					el = bubble.el;
				switch(cmd) {
					case 'limit':
						FiPhoto.CLICKIN['limit'] = 1;
						pkg.toggleLimitBtn($(el));
						break;
					case 'limitin':
						FiPhoto.CLICKIN['limit'] = 1;
						pkg.l_btnClick($(el));
						break;
					case 'rotate':
						pkg.rotate();
						break;
					case 'border':
						pkg.toggleBorderBtn($(el));
						break;
					case 'scale':
						pkg.toggleScaleBtn($(el));
						break;
				}
			}
			
			if (!FiPhoto.CLICKIN['limit']) { pkg.deactiveLimitBtn(); }

		});
    };
	
	this.hideAllPanel = function () {
		
	};
	
	this.l_btnClick = function ($el) {
		var cur = parseInt(pkg['step1']['$l_btnbg'].css('left'));
		var ccur = parseInt($el.css('left'));
		if (cur != ccur) {
			pkg.limitMode = ccur > cur ? '43' : '11';
			pkg['step1']['$l_btnbg'].stop().animate({'left': ccur});

			step1.$dropArea.stop().animate({'width': (pkg.limitInfo[pkg.limitMode][0]+2) });
			step1.$container.stop().animate({
				'width': pkg.limitInfo[pkg.limitMode][0],
				'height': pkg.limitInfo[pkg.limitMode][1]
			}, {
				step: function (now, fx) {
					if (pkg.cvs) {
						if (fx.prop == 'width') {
							pkg.cvs.width = now;
						} else if (fx.prop == 'height') {
							pkg.cvs.height = now;
						}
						pkg.drawImage();
					}

				}
			});
			
		} 
		
	};
    
    this.toggleLimitBtn = function ($btn) { 
        $btn.hasClass('active') ? this.deactiveLimitBtn($btn) : this.activeLimitBtn($btn);
    };
    this.deactiveLimitBtn = function ($btn) {
		$btn = $btn || $('.btn.limit');
        $btn.removeClass('active');
        $('.limit-panel').hide();
    };
    this.activeLimitBtn = function ($btn) {
        $btn.addClass('active');
        $('.limit-panel').show();
    };
    
    
    this.rotate = function () {
		pkg.imgInfo.rotate += Math.PI/2;
		if (pkg.imgInfo.rotate == 2*Math.PI) {
			pkg.imgInfo.rotate = 0;
		}
		pkg.drawImage();
    };
    
    this.toggleBorderBtn = function () {
    
    };
    
    this.toggleScaleBtn = function () {
    
    };
	
	this.create = function () {
		// 创建一个 canvas 用于 图片手术， 大小为 650*2；
		this.$canvas = $('<canvas class="operation-cvs"></canvas>').appendTo(FiPhoto.$con);
		this.cvs = this.$canvas.get(0);
		this.cvs.width = this.size.w;
		this.cvs.height = this.size.h;
		this.ctx = this.cvs.getContext('2d');

	};
	
	this.setCvsPos = function () {
		this.$canvas.css({
			position: 'absolute',
			display: 'none',
			left: 1,
			top: 1
		});
	};
	
	this.initImage = function (src) { 
		var callCB = false;
		var $img = $('#operation-image');
		if (!$img[0]) {
			$img = $('<img id="operation-image" alt="" src="'+ src +'" />').appendTo(FiPhoto.$imgWrap);
		} else {
			$img.attr('src', src);
		}
		this.$operationImage = $img;
		
		var img = this.$operationImage[0];
		if (img.complete) { 
			imgLoadedCallback();
			return;
		} 
		this.$operationImage.load(function () { imgLoadedCallback() });
		
		function imgLoadedCallback () {
			if (callCB) return; 
			
			FiPhoto.$imgWrap.show();
			pkg.imgInfo = {
				img: img,
				src: img.src,
				left: 0,
				top: 0,
				width: $(img).width(),
				height: $(img).height(),
				limitW: pkg.size.w,
				limitH: pkg.size.h,
				offsetX: 0,
				offsetY: 0,
				rotate: 0,
				scale : 1
			};
			FiPhoto.$imgWrap.hide();
			pkg.setScale(1);
			pkg.drawImage();
            pkg.checkStep(1);
			pkg.bindCanvas();
            
			callCB = true;
		}
	};
	
	this.setScale = function (s) {
		if (this.cvs && this.ctx && this.imgInfo) {
			this.imgInfo.scale = s;
			this.imgInfo.showWidth = this.imgInfo.width * s;
			this.imgInfo.showHeight = this.imgInfo.height * s;
		}
	};
	
	
	// bind canvas to move image and scale
	this.bindCanvas = function () {
		this.$canvas.unbind('mousewheel');
		this.$canvas.unbind('mousedown');
		
		this.$canvas.bind('mousewheel', function (e, delta, deltaX, deltaY) {
			e.preventDefault();
			//console.log(delta, deltaX, deltaY);
			
			if (delta > 0 && pkg.imgInfo.scale < 3) {
				// zoom +
				pkg.setScale(pkg.imgInfo.scale + 0.1);
				//pkg.ctx.scale(pkg.imgInfo.scale, pkg.imgInfo.scale);
				pkg.drawImage();

			} else if (delta < 0 && pkg.imgInfo.scale > 0.2) {
				// zoom -
				pkg.setScale(pkg.imgInfo.scale - 0.1);
				pkg.drawImage();
			}
		});
		
		this.$canvas.bind('mousedown', function (e) {
			pkg.startDrag = true;
			pkg.dragInfo = {
				mouseX: e.clientX,
				mouseY: e.clientY,
				imgOffsetX: pkg.imgInfo.offsetX,
				imgOffsetY: pkg.imgInfo.offsetY
			};
		}).bind('mouseleave', function (e) {
			pkg.startDrag = false;
			clearTimeout(pkg.canvasTimer);
			$('#ctrl-info').fadeOut();		
		}).bind('mouseenter', function (e) {
			clearTimeout(pkg.canvasTimer);
			pkg.canvasTimer = setTimeout(function () {
				$('#ctrl-info').fadeIn();
			}, 500);	
		});
		
		$(window).bind('mouseup', function (e) {
			pkg.startDrag = false;
		}).bind('mousemove', function (e) {
			if (!!pkg.startDrag && pkg.dragInfo) {
				var disX = e.clientX - pkg.dragInfo.mouseX,
					disY = e.clientY - pkg.dragInfo.mouseY;
				
				var deg = pkg.imgInfo.rotate;
				var flag = (2*deg/Math.PI)%2 == 0 ? 1 : -1;
				pkg.imgInfo.offsetX = pkg.dragInfo.imgOffsetX + flag*(disX*Math.cos(deg) - disY*Math.sin(deg));
				pkg.imgInfo.offsetY = pkg.dragInfo.imgOffsetY + flag*(disX*Math.sin(deg) + disY*Math.cos(deg));
				
				pkg.drawImage();
			}
		})
	};
	
	this.drawImage = function () {
		var ctx = this.ctx;
		var cvs = this.cvs;
		var info = this.imgInfo;
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		ctx.save();
		ctx.translate(cvs.width/2, cvs.height/2);
		ctx.rotate(info.rotate);
		ctx.translate(-cvs.width/2, -cvs.height/2);
		ctx.drawImage(info.img, 0, 0, info.width, info.height, cvs.width/2 - info.showWidth/2 + info.offsetX, cvs.height/2 - info.showHeight/2 + info.offsetY, info.showWidth, info.showHeight);
		ctx.restore();
		
		this.$canvas.show();
	};
    
    // 检测 当前step
    this.checkStep = function (step) {
        var easing = 'easeOutBack';
        if (step == undefined) { step = 1; }
       // if (step == FiPhoto.step) { return; }
       // if (step > FiPhoto.step) { // 从右边出来
            var $tit = pkg['step'+step]['$tit'],
                $btns = pkg['step'+step]['$btns'],
                timeout = 0;
            
			$('#edit-area').css({'height': 306});
			this.scrollToBottom(btnsMove);
			
			function btnsMove () {
				$tit.css({'left': 850}).show().animate({'left': parseInt($tit.attr('data-left'))}, {
					duration: 1000,
					easing: easing,
					callback: function () {}
				});
				$btns.each(function () {
					var _this = this;
					timeout += 100;
					setTimeout(function () {
						$(_this).css({'left': 850}).show()
							.animate({'left': parseInt($(_this).attr('data-left'))}, {
								duration: 1000,
								easing: easing,
								callback: function () {}
							})
					}, timeout)
					
				})
				FiPhoto.step = step;
			}
            
        //}
    };
	
	this.scrollToBottom = function (cb) {
		if (cb == undefined) { cb = function () {} }
		var h = Math.max($('body').height(), $('html').height());
		var wh = $(window).height();
		$('html, body').animate({
			scrollTop: (h-wh)
		}, cb);
	}

});
	
$.NS('FiPhoto.fx', function () {

	this.normal = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback () {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0, 0).update();
			FiPhoto.$con.empty().append(canvas);
			
			var ww = Math.max(800, canvas.width + 100);
			FiPhoto.$doc.animate({width: ww}, function () {
				$(FiPhoto.canvas).animate({opacity: 1});
			});
			
		}
		if (image.complete) { 
			setTimeout(imgLoadCallback, 0)
			//imgLoadCallback();
			return;
		}
		$(image).load(imgLoadCallback)

	};
	this.amaro = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback() {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0, 0.15).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).sepia(0.4).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).vignette(0.2, 0.4).update();
			FiPhoto.$con.empty().append(canvas);
		}
		if (image.complete) {
			setTimeout(imgLoadCallback, 0)
			return;
		}
		$(image).load(imgLoadCallback)

	};
	this.rise = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback() {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0.05, 0.3).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).hueSaturation(-0.02, 0.3).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).sepia(0.6).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).vignette(0.12, 0.4).update();
			FiPhoto.$con.empty().append(canvas);
		}    
		if (image.complete) {
			setTimeout(imgLoadCallback, 0)
			return;
		}
		$(image).load(imgLoadCallback)
	};
	this.hudson = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback() {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0.15, 0.15).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).hueSaturation(0, 0.15).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).vignette(0.2, 0.5).update();
			FiPhoto.$con.empty().append(canvas);
		}    
		if (image.complete) {
			setTimeout(imgLoadCallback, 0)
			return;
		}
		$(image).load(imgLoadCallback)
	}
	this.xpoll = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback() {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0, 0.25).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).hueSaturation(0, 0.2).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).vignette(0, 0.5).update();
			FiPhoto.$con.empty().append(canvas);
		}    
		if (image.complete) {
			setTimeout(imgLoadCallback, 0)
			return;
		}
		$(image).load(imgLoadCallback)
	}
	this.sierra = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback() {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0, 0.25).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).hueSaturation(0, 0.2).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).sepia(0.4).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).vignette(0, 0.5).update();
			FiPhoto.$con.empty().append(canvas);
		}    
		if (image.complete) {
			setTimeout(imgLoadCallback, 0)
			return;
		}
		$(image).load(imgLoadCallback)
	}
	this.inkwell = function () {
		var canvas = FiPhoto.canvas,
			image = FiPhoto.image;
		function imgLoadCallback() {
			var texture = canvas.texture(image);
			canvas.draw(texture).brightnessContrast(0.05, 0.2).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).hueSaturation(0, -1).update();
			texture = canvas.texture(canvas);
			canvas.draw(texture).vignette(0.15, 0.5).update();
			FiPhoto.$con.empty().append(canvas);
		}    
		if (image.complete) {
			setTimeout(imgLoadCallback, 0)
			return;
		}
		$(image).load(imgLoadCallback)
	}
	
});
	
$.NS('FiPhoto.tab', function () {
	var pkg = this;
	this.init = function () {
		this.create();
		this.bind();
	};
	this.create = function () {
		var dom = [];
		dom.push('<ul>');
		for (var k in FiPhoto.fx) {
			dom.push('<li data-cmd="'+ k +'">'+ k +'</li>');
		}
		dom.push('</ul>');
		FiPhoto.$tabWrap.html(dom.join(''));
		
		pkg.$ul = FiPhoto.$tabWrap.find('ul');
		pkg.$li = pkg.$ul.find('li');
		
	};
	this.bind = function () {
		pkg.$li.bind('click', function (e) {
			e.preventDefault();
			var cmd = $(this).attr('data-cmd');
			FiPhoto.setFx(cmd);
		})
	};
	this.show = function () {
		FiPhoto.$tabWrap.slideDown();
	};
	this.update = function (type) {
		pkg.$li.removeClass('current');
		pkg.$li.each(function (i) {
			if ($(this).attr('data-cmd') == type) {
				$(this).addClass('current');
				return;
			}
		})
	}
})

$.NS('FiPhoto.toolbar', function () {
	var pkg = this;

	this.init = function () {
		this.create();
		this.bind();
	};
	this.create = function () {
		pkg.$btns = FiPhoto.$toolbtns || $('#toolbar a');
	};
	this.bind = function () {
		pkg.$btns.click(function (e) {
			e.preventDefault();
			var cmd = $(this).attr('data-cmd');
			switch(cmd) {
				case 'cut':
					FiPhoto.cut.show();
					break;
				case 'roll-left':
					FiPhoto.roll.left();
					break;
				case 'roll-right':
					FiPhoto.roll.right();
					break;
				case 'blur':
					FiPhoto.blur.show();
					break;
				case 'save':
					FiPhoto.save();
					break;
			}
		})
	};
	this.show = function () {
		FiPhoto.$toolbar.fadeIn();
	}
});

$.NS('FiPhoto.cut', function () {
	var pkg = this;
	var isDragStart = false,
		mousePos = {x: 0, y: 0},
		cutInfo = {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		},
		canvasInfo = {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		};
	
	this.init = function () {
		this.create();
		this.bind();
	};
	this.bind = function () {
		this.$cutWin.bind('mousedown', function (e) { pkg.dragStart(e) });
		$(document).bind('mousemove.dragCutWindow', function (e) { pkg.mouseMove(e) })
			.bind('mouseup.dragCutWindow', function (e) { pkg.mouseUp(e) });
	};
	this.dragStart = function (e) {
		isDragStart = true;
		pkg.updateInfo(e);
	}
	this.mouseMove = function (e) {
		if (!isDragStart) { return }
	  /*  var newLeft = cutInfo.left + (e.clientX - mousePos.x),
			newTop = cutInfo.top + (e.clientY - mousePos.y),
			maxLeft = (canvasInfo.left + canvasInfo.width - cutInfo.width),
			maxTop = (canvasInfo.top + canvasInfo.height - cutInfo.height);
		*/
		var newLeft = cutInfo.left + (e.clientX - mousePos.x),
			newTop = cutInfo.top + (e.clientY - mousePos.y);
		pkg.$cutWin.css({
			left: newLeft,
			top: newTop,
			backgroundPosition: '-'+(e.clientX - mousePos.x)+'px -'+(e.clientY - mousePos.y)+'px'
		});
				 
		
	}
	this.mouseUp = function (e) {
		isDragStart = false;
		pkg.updateInfo(e);
	}
	this.updateInfo = function (e) {
		mousePos = {
			x: e.clientX,
			y: e.clientY
		};
		canvasInfo = pkg.getCanvasInfo();
		cutInfo = pkg.getCutInfo();
	}
	this.create = function () {
		this.$mask = $('<div class="mask hide" id="mask"></div>');
		this.$cutWin = $('<div class="cut-window hide" id="cut-window"></div>');
		this.$mask.appendTo('body');
		this.$cutWin.appendTo('body');
	};
	this.show = function () {
		/*this.$mask.show();
		this.updateCutWin();
		this.$cutWin.css({
			backgroundImage: 'url('+FiPhoto.canvas.toDataURL()+')',
			backgroundRepeat: 'no-repeat'
		})
		this.$cutWin.show();
		*/
	};
	this.updateCutWin = function () {
		var info = this.getCanvasInfo();
		var wh = Math.min(info.width, info.height);
		info.left -= 1;
		info.top -= 1;
		info.width = wh;
		info.height = wh;
		this.$cutWin.css(info);
	}
	this.getCanvasInfo = function () {
		var pos = $(FiPhoto.canvas).position();
		var ret = {
			left: pos.left,
			top: pos.top,
			width: $(FiPhoto.canvas).width(),
			height: $(FiPhoto.canvas).height()
		};
		return ret;
	};
	this.getCutInfo = function () {
		var pos = $(pkg.$cutWin).position();
		var ret = {
			left: pos.left,
			top: pos.top,
			width: $(pkg.$cutWin).width(),
			height: $(pkg.$cutWin).height()
		}
		return ret;
	}
});

$.NS('FiPhoto.roll', function () {
	var pkg = this;
	this.init = function () {
		//this.create();
	};
	this.create = function () {
		if (!this.$tmpCanvas && !this.cvs) {
			this.$tmpCanvas = $('<canvas></canvas>').appendTo('body');
			this.cvs = this.$tmpCanvas.get(0);
			
			this.ctx = this.cvs.getContext('2d');	
		}
		this.cvs.width = FiPhoto.canvas.height;
		this.cvs.height = FiPhoto.canvas.width;
	}
	this.do = function (dir) {
		if (dir == undefined) {
			dir = 'left';
		}
		var angle = 0;
		if (dir == 'left') {
			angle = Math.PI/2;
		} else if (dir == 'right') {
			angle = -Math.PI/2;
		}
		
		this.create();
		this.ctx.save();
		this.ctx.translate(this.cvs.width/2, this.cvs.height/2);
		this.ctx.rotate(angle);
		this.ctx.translate(-this.cvs.height/2, -this.cvs.width/2);
		this.ctx.drawImage(FiPhoto.image, 0, 0, FiPhoto.image.width, FiPhoto.image.height);
		this.ctx.restore();
		
		//FiPhoto.image.src = this.ctx.toDataURL('image/png');
		var type = FiPhoto.$tabWrap.find('li.current').attr('data-cmd');
		var src = this.cvs.toDataURL('image/png');

		FiPhoto.setFx(type, src);
		
		//this.destory();
	}
	this.left = function () {
		this.do('left');
	};
	this.destory = function () {
		this.$tmpCanvas.remove();
		this.$tmpCanvas = null;
		this.cvs = null;
		this.ctx = null;
	};
	this.right = function () {
		this.do('right');
	}
});

$.NS('FiPhoto.share', function () {
	var pkg = this;
	this.init = function () {
	
	};
	this.show = function () {
		
	};
	this.hide = function () {
	
	};
	
	this.toRenren = function () {
	
	};
	this.toSinaWeibo = function () {
	
	};
	this.toTXWeibo = function () {
	
	};
	this.toQzone = function () {
	
	};
})
	
