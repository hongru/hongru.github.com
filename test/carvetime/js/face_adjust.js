window.faceAdjust = {
	
	img: null,
	
	/**
	 * 脸的数据
	 * @param {Object} opt
	 */
	faces: [],
	_currentPoints: [],
	
	_bgCanvas: null,
	_bgCtx: null,
	
	_middleCanvas: null,
	_middleCtx: null,
	
	_topCanvas: null,
	_topCtx: null,
	
	
	_positionImg: null,
	/**
	 * 初始化
	 */
	init: function(opt){
		var _self = this;
		this._positionImg = new Image();
		this._positionImg.onload = function(){
			_self._init2(opt);
			
		};
		this._positionImg.src= "img/point.png";
	},
	_init2: function(opt){
		
		var _self = this;
		this.img = opt.img;
		for( var i=0, _item; _item = opt.data[i]; i++){
			_item.index  = i;
		}
		this.faces = opt.data;
		
		var canvas = this._createCanvas(document.getElementById("step1Source"));
		this._bgCanvas = canvas;
		this._bgCtx = canvas.getContext('2d');
		
		canvas = this._createCanvas(document.getElementById("step1Source"));
		this._middleCanvas = canvas;
		this._middleCtx = canvas.getContext('2d')
		
		var canvas = this._createCanvas(document.getElementById("step1Source"));
		this._topCanvas = canvas;
		this._topCtx = canvas.getContext('2d');
		
		//图片
		this._bgCtx.drawImage(this.img, 0, 0);
		
		this._renderAll();
		this._bindEvent();
	},
	_createCanvas: function(containerElem){
		var canvas = document.createElement('canvas');  
	    canvas.setAttribute('width',this.img.width);  
	    canvas.setAttribute('height',this.img.height);  
		canvas.style.position = "absolute"; 
	    
		containerElem.appendChild(canvas);
		return canvas;
		
		
	},
	_bindEvent: function(){
		var _self = this;
		$(this._topCanvas).bind('mousedown', function(event){
			_self._onMouseDown(event);
		});
		$(this._topCanvas).bind('mouseup', function(event){
			_self._onMouseUp(event);
			
		});
		$(this._topCanvas).bind('mousemove', function(event){
			_self._onMouseMove(event);
			
		});
		
	},
	_onMouseDown: function(e){
		if( this._dealParam ){
			return;
		}
		var _pos = this._getMousePos(e, this._topCanvas);
		
		var _index = this._getSelectPoint(_pos);
		if( _index != -1){
			this._dealParam = {
				obj: this._currentPoints[_index],
				type: "point",
				offsetLeft:  _pos.x - this._currentPoints[_index].x,
				offsetTop: _pos.y - this._currentPoints[_index].y
			};
			
			var _arr = this._currentPoints.splice(_index, 1);
			this._currentPoints.push(_arr[0]);
		}else{
			var _index =  this._findFace(_pos);
			if( _index != -1){
				this._dealParam = {
					obj: this.faces[_index],
					type: "face",
					offsetLeft:  _pos.x - this.faces[_index].centerX,
					offsetTop: _pos.y - this.faces[_index].centerY
				};
				
				var _arr = this.faces.splice(_index, 1);
				this.faces.push(_arr[0]);
			}
		}
		
	},
	_onMouseUp: function(){
		
		if( this._dealParam != null){
			this._renderAll();
			this._dealParam = null;
		}

	},
	_onMouseMove: function(e){
		if( this._dealParam ){
			var _pos = this._getMousePos(e, this._topCanvas);
			
			if( this._dealParam.type == "point"){
				this._dealParam.obj.x =  _pos.x - this._dealParam.offsetLeft;
				this._dealParam.obj.y =  _pos.y - this._dealParam.offsetTop;
			}else{
				//定点坐标和中心点坐标
				this._dealParam.obj.x =  _pos.x - this._dealParam.offsetLeft;
				this._dealParam.obj.y =  _pos.y - this._dealParam.offsetTop;
				
				this._dealParam.obj.centerX =  _pos.x - this._dealParam.offsetLeft;
				this._dealParam.obj.centerY =  _pos.y - this._dealParam.offsetTop;
			}
			
			this._renderAll();
		}else{
			var _pos = this._getMousePos(e, this._topCanvas);
			if( this._getSelectPoint(_pos) != -1 || this._findFace(_pos) != -1){
				document.getElementById("step1Source").style.cursor = "move";
			}else{
				document.getElementById("step1Source").style.cursor = 'default';
			}
		}
		
		
		
	},
	/**
	 * 渲染
	 */
	_renderAll: function(){
		this._middleCtx.clearRect(0,0, this.img.width, this.img.height);
		this._topCtx.clearRect(0,0, this.img.width, this.img.height);
		
		this._topCtx.fillStyle = 'rgba(0, 0, 0, .3)';
		this._topCtx.fillRect(0,0, this.img.width, this.img.height);
		
		this._middleCtx.fillStyle = 'rgba(0, 0, 0, .3)';
		this._middleCtx.fillRect(0,0, this.img.width, this.img.height);
		
		


		this._currentPoints = [];
		
		for( var i=0, l = this.faces.length -1 ; i < l;  i++){
			this._renderFace(this.faces[i]);
		}
		this._renderFace(this.faces[this.faces.length-1], true);
		
		
		
	},
	_renderFace: function(face, isTop){
		
		var _ctx = isTop ?  this._topCtx : this._middleCtx;
		
		_ctx.save();
		_ctx.translate(face.centerX, face.centerY);
		_ctx.rotate(face.roll);
		var _outlinewidth = 4;
		
		_ctx.fillStyle = 'rgba(255, 255, 255, .5)';
		_ctx.fillRect( - face.w/2 -_outlinewidth ,   - face.h/2- _outlinewidth, face.w + (2 * _outlinewidth), face.h + (2 * _outlinewidth));


		_ctx.clearRect(- face.w/2, - face.h/2 , face.w, face.h);
		if( isTop ){
			 this._middleCtx.save();
			 this._middleCtx.translate(face.centerX, face.centerY);
			 this._middleCtx.rotate(face.roll);
			 this._middleCtx.clearRect(- face.w/2, - face.h/2 , face.w, face.h);
			 this._middleCtx.restore();
		}
		_ctx.restore();
		
		if( isTop ){
			this._renderPoints(face);	
		}else{
//			this._renderPoints(face);	
		}
	},
	/**
	 * 渲染点
	 */
	_renderPoints: function(face){
		var _border = 5;
		this._topCtx.drawImage(this._positionImg, face.eye_left.x - _border, face.eye_left.y - _border);
		this._topCtx.drawImage(this._positionImg, face.eye_right.x - _border, face.eye_right.y - _border);
		this._topCtx.drawImage(this._positionImg, face.mouth_left.x - _border, face.mouth_left.y - _border);
		this._topCtx.drawImage(this._positionImg, face.mouth_center.x - _border, face.mouth_center.y - _border);
		this._topCtx.drawImage(this._positionImg, face.mouth_right.x - _border, face.mouth_right.y - _border);
		this._topCtx.drawImage(this._positionImg, face.nose.x - _border, face.nose.y - _border);
		
		this._currentPoints.push(face.eye_left);
		this._currentPoints.push(face.eye_right);
		this._currentPoints.push(face.mouth_left);
		this._currentPoints.push(face.mouth_center);
		this._currentPoints.push(face.mouth_right);
		this._currentPoints.push(face.nose);
		
	},
	/**
	 * 
	 */
	_findFace: function(pos){
		for( var i= this.faces.length - 1 ; i >= 0;  i--){
			if( this._posInFace(pos, this.faces[i]) ){
				return i;
			}
		}
		return -1;
	},
	/**
	 * 
	 * @param {Object} pos
	 * @param {Object} face
	 */
	_posInFace: function(pos, face){
		
		//算个圆，简单点把
		var _radius  = Math.min(face.w/2, face.h/2);
		
		var _dis = Math.sqrt(Math.pow(pos.x - face.centerX , 2) + Math.pow(pos.y - face.centerY , 2));
		
		if( _dis < _radius ){
			return true;
		}
		
//		var left = face.w/2;
//		var top = face.h/2
//		
//		var currentWidth = face.w ;
//		var currentHeight = face.h;
//		var _hypotenuse = Math.sqrt(Math.pow(currentWidth / 2, 2) + Math.pow(currentHeight / 2, 2));
//		var _angle = Math.atan(currentHeight / currentWidth);
//		
//		// offset added for rotate and scale actions
//		var offsetX = Math.cos(_angle + face.roll) * _hypotenuse;
//		var offsetY = Math.sin(_angle + face.roll) * _hypotenuse;
//		var theta = face.roll;
//		var sinTh = Math.sin(theta);
//		var cosTh = Math.cos(theta);
//		
//		var tl = {
//			x: left- offsetX,
//			y: top - offsetY
//		};
//		var tr = {
//			x: tl.x + (currentWidth * cosTh),
//			y: tl.y + (currentWidth * sinTh)
//		};
//		var br = {
//			x: tr.x - (currentHeight * sinTh),
//			y: tr.y + (currentHeight * cosTh)
//		};
//		var bl = {
//			x: tl.x - (currentHeight * sinTh),
//			y: tl.y + (currentHeight * cosTh)
//		};
		
		
		
	},
	/**
	 * 取得鼠标位置
	 * @param {Object} e
	 * @param {Object} elem
	 */
	_getMousePos: function(e, elem){
		
		var positionX = e.originalEvent.x - $(elem).offset().left + document.body.scrollLeft ;
		var positiony = e.originalEvent.y - $(elem).offset().top + document.body.scrollTop; 
		
		return {
			x: positionX,
			y: positiony
		};
	},
	_getSelectPoint: function(pos){
		var _border = 5;
		for( var i= this._currentPoints.length-1; i>=0; i--){
			if( pos.x > this._currentPoints[i].x -_border && pos.x < (this._currentPoints[i].x + _border)
				&& pos.y > this._currentPoints[i].y - _border && pos.y < (this._currentPoints[i].y + _border) ){
				return i;
			}
		}
		return -1;
	},
	
	finish: function(){
		this._middleCtx.clearRect(0,0, this.img.width, this.img.height);
		this._topCtx.clearRect(0,0, this.img.width, this.img.height);
		this._topCanvas.parentNode.removeChild( this._topCanvas );
		
	},
	getFace: function(){
		this.faces.sort(function(o1, o2){
			return o1.index - o2.index;
			
		});
		return this.faces;
		
	},
	getBgCanvas: function(){
		return this._bgCanvas;
		
	}
	
};
