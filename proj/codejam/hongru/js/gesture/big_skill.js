
		var oldX; var oldY;
		var canvas;
		var ctx_big;
		var _r = new DollarRecognizer();
		var _points = [];
		var isMouseDown = false; // mouse only bool
		var threshold = 3; // number of pixels required to be moved for a movement to count
		
		canvas = document.getElementById("big_skill");  
		ctx_big = canvas.getContext("2d");
	
		document.getElementById('big_skill').addEventListener('touchstart', function(e) {
			e.preventDefault();
			_points = [];
			var touch = e.touches[0];
			ctx_big.beginPath();
			ctx_big.strokeStyle = "#bae1ff";
			ctx_big.lineCap = "round"; 
			ctx_big.lineJoin = "round";
			ctx_big.lineWidth = 6;
			oldX = touch.pageX;
			oldY = touch.pageY;
		}, false);
		
		document.getElementById('big_skill').addEventListener('touchmove', function(e) {
			if (oldX - e.pageX < 3 && oldX - e.pageX > -3) {
				return;
			}
			if (oldY - e.pageY < 3 && oldY - e.pageY > -3) {
				return;
			}
			var touch = e.touches[0];
			ctx_big.moveTo(oldX,oldY);
			oldX = touch.pageX;
			oldY = touch.pageY;
			ctx_big.lineTo(oldX,oldY);
			ctx_big.stroke();
			ctx_big.shadowColor = 'rgba(169,236,255,0.25)';
			ctx_big.shadowOffsetX = 0;
			ctx_big.shadowOffsetY = 0;
			ctx_big.shadowBlur = 10;
			_points[_points.length] = new Point(oldX,oldY);
		}, false);
		
		document.getElementById('big_skill').addEventListener('touchend', function(e) {
			ctx_big.closePath();
			if (_points.length >= 10) {
				var result = _r.Recognize(_points);
				//alert(result.Name+" "+Math.round(result.Score*100) + "%");
				PD.Star_Fall(result);
			}
			_points = [];
			ctx_big.clearRect(0,0,canvas.width,canvas.height);
		}, false);
		
		
		
		// MOUSE BINDS FOR THE HELL OF IT
		document.getElementById('big_skill').addEventListener('mousedown', function(e) {
			isMouseDown = true;
			e.preventDefault();
			_points = [];
			ctx_big.beginPath();
			ctx_big.strokeStyle = "#bae1ff";
			ctx_big.lineCap = "round";
			ctx_big.lineJoin = "round";
			ctx_big.lineWidth = 6;
			ctx_big.shadowColor = 'rgba(169,236,255,0.1)';
			ctx_big.shadowOffsetX = 0;
			ctx_big.shadowOffsetY = 0;
			ctx_big.shadowBlur = 10;
			oldX = e.pageX;
			oldY = e.pageY;
		}, false);
		
		document.getElementById('big_skill').addEventListener('mousemove', function(e) {
			if (!isMouseDown) {
				return;
			}
			if (oldX - e.pageX < 3 && oldX - e.pageX > -3) {
				return;
			}
			if (oldY - e.pageY < 3 && oldY - e.pageY > -3) {
				return;
			}
			ctx_big.moveTo(oldX,oldY);
			oldX = e.pageX;
			oldY = e.pageY;
			ctx_big.lineTo(oldX,oldY);
			ctx_big.stroke();
			_points[_points.length] = new Point(oldX,oldY);
		}, false);
		
		document.getElementById('big_skill').addEventListener('mouseup', function(e) {
			isMouseDown = false;
			ctx_big.closePath();
			if (_points.length >= 10) {
				var result = _r.Recognize(_points);
				PD.Star_Fall(result);
			}
			_points = [];
			ctx_big.clearRect(0,0,canvas.width,canvas.height);
		}, false);
