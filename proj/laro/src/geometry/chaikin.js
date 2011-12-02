/**
 * Chaikin
 * 球面插值曲线算法
 * @require [global, geometry.point2, geometry.vector2]
 */

Laro.register('.geometry.chaikin', function (La) {

	var Point2 = La.geometry.Point2,
		Vector2 = La.geometry.Vector2,
		self = this;
		
	this.subDivide = function (handles, subdivs) {
		if (handles.length) {
			do {
				var numHandles = handles.length;
				// 第一个点
				handles.push(new Point2(handles[0].x, handles[0].y));
 
				for (var i = 0; i < numHandles - 1; ++i) {
					// 每次拿出两个点
					var p0 = handles[i];
					var p1 = handles[i + 1];

					// 根据两个原始点创建两个新点，做插值
					var Q = new Point2(0.75 * p0.x + 0.25 * p1.x, 0.75 * p0.y + 0.25 * p1.y);
					var R = new Point2(0.25 * p0.x + 0.75 * p1.x, 0.25 * p0.y + 0.75 * p1.y);
	 
					handles.push(Q);
					handles.push(R);
				}
				// 最后一个店
				handles.push(new Point2(handles[numHandles - 1].x, handles[numHandles - 1].y));
 
				// 更新数组
				for (var i = 0; i < numHandles; ++i)
					handles.shift();
				//handles.shift(numHandles);
			} while (--subdivs > 0);
		}
	};

	// 获取多点间距
	this.getLength = function (points) {
		var len = 0;
		var diff = null;
		for (var i = 1; i < points.length; i++) {
			diff = points[i].subNew(points[i-1]);
			len += Math.sqrt(diff.x * diff.x + diff.y * diff.y);
		}
		return len;
	};
	
	// 根据长度获取点
	this.getPointAtLength = function (points, len) {
		if (points.length === 0) { return new Point2(0, 0); }
		if (points.length === 1) { return points[0]; }
 
		var diff = null;
		for (var i = 0; i !== points.length - 1; i++) {
			diff = points[i+1].subNew(points[i]);
			var segLen = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
			if (segLen > len) {
				return new Point2(points[i].x + diff.x * len / segLen, points[i].y + diff.y * len / segLen);
			} else {
				len -= segLen;
			}
		}
		return points[points.length-1];
	};

	this.getDirAtParam = function (points, param) {
		if (points.length < 2) { return new Point2(0, 0); }
 
		var totalLen = this.getLength(points);
		var tgtLen = param * totalLen;
		var diff = null;
 
		for (var i = 0; i !== points.length - 1; i++) {
			diff = points[i+1].subNew(points[i]);
			var segLen = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
			if (segLen > tgtLen) {
				return diff;
			} else {
				tgtLen -= segLen;
			}
		}
	 
		return points[points.length-1].subNew(points[points.length-2]);
	};
	
	this.getEvenlySpacedPoints = function (handles, count, normals) {
		var tmp = handles.slice(0);
		var points = [];
		var dir = null;
		this.subdivide(tmp, 3);
		var len = this.getLength(tmp);
		var spacing = len / (count - 1);
		points.push(tmp[0]);
 
		if (normals) {
			dir = this.getDirAtParam(tmp, 0);
			normals.push(new Point2(-dir.y, dir.x));
		}
 
		for (var i = 1; i < count - 1; i++) {
			points.push(this.getPointAtLength(tmp, i * spacing));
			if (normals) {
				dir = this.getDirAtParam(tmp, i * spacing / len);
				normals.push(new Point2(-dir.y, dir.x));
			}
		}
	
		points.push(tmp[tmp.length-1]);
 
		if (normals) {
			dir = this.getDirAtParam(tmp, 1);
			normals.push(new Point2(-dir.y, dir.x));
		}
	 
		return points;
	};
	
	// copy to Laro namespace
    Laro.extend(this);
})
