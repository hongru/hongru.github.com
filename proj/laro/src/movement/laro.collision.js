/**
 * laro.collision
 * @require [geometry]
 */

Laro.register('.collision', function (La) {
	var pkg = this;
	
	// CONFIG
	this.SWEEP_EPSILON = 0.001;
	this.PENETRATION_EPSILON = 0.002;

	if (!La.Circle) {
		/**
		 * 圆
		 * @param {Vec2} cent   Point of centre
 		 * @param {number} rad  Radius of circle
		 */ 
		La.Circle = function (cent, rad) {
			this.c = cent;
			this.r = rad;
		};
	}

	if (!La.Ray2) {
		/**
		 * 二维射线
		 * @param {Vec2} p 端点
 		 * @param {Vec2} n 方向向量
		 */
		La.Ray2 = function (p, n) {
			this.point = p;
			this.normal = n;
		}
	}

	/* === main === */
	var Circle = La.Circle,
		Vec2 = La.Vector2,
		Ray2 = La.Ray2;

	/**
	 * CollisionContact
	 * 碰撞相关信息
	 * @param {Vec2} p 碰撞点
	 * @param {Vec2} n 方向向量
	 * @param {Number} d 相交深度
	 * @param {Function} fn 返回面朝方向
	 * @param {Object} usr 
	 * @param {Number} mat 质地 0-1, 0表示刚体
	 */
	var CollisionContact = function (p, n, d, fn, usr, mat) {
		this.point = p;
		this.normal = n;
		this.depth = d;
		this.faceNormal = fn;
		this.user = usr;
		this.material = mat;
	};
	this.CollisionContact = CollisionContact;

	/**
	 * ConvexShape
	 * 凸起物体基类
	 * @param {String} type - 'rect' | 'circle' | 'poly'
	 * @param {Number} mat 质地
	 */
	var ConvexShape = La.Class(function (type, mat) {
		this.type = type;
		if (mat == undefined) {
			mat = 0;
		}
		this.material = mat;
		this.y_min = Number.MAX_VALUE;
		this.user = null;
		this.points = [];
			
	}).methods({
		//增加一个顶点 Vec2
		addPoint: function (v) {
			this.points.push(v);
			if (v.y < this.y_min) {
				this.y_min = v.y;
			}
		},
		//清除 顶点
		clear: function () {
			this.points = [];
			this.y_min = Number.MAX_VALUE;
			return this;
		},
		numOfPoints: function () {
			return this.points.length;
		},
		//移动指定 向量
		offset: function (v) {
			this.y_min += v.y;
			for (var i = 0; i < this.points.length; i ++) {
				this.points[i].add(v);
			}

			return this;
		},
		// 横向翻转
		// @param {Number} x ,翻转的x坐标
		hFlip: function (x) {
			this.points.reverse();
			for (var i = 0; i < this.points.length; i ++) {
				this.points[i].x = x - (this.points[i].x - x);
			}

			return this;
		},
		// 生成一个新的拷贝
		copy: function () {
			var c = new this.ConvexShape(this.type, this.material);
			for (var i = 0; i < this.points.length; i ++) {
				c.addPoint(this.points[i].copy());
			}

			return c;
		}
		
	});
	this.ConvexShape = ConvexShape;


	/**
	 * 二维线段
	 * LineSegment2
	 * @param {Point2} start
	 * @param {Point2} end
	 */
	var LineSegment2 = La.Class(function (start, end) {
		this.a = new Vec2(start.x, start.y);
		this.b = new Vec2(end.x, end.y);
			
	}).methods({
		// @param {Vec2} p
		// @return {Vec2}
		// 获取线段上 到指定点p 最短距离的点
		getClosestPoint: function (p) {
			var val = this.getProjectionParam(p);
			// Clamp
			var param = val < 0 ? 0 : val > 1 ? 1 : val;
		 
			var res = new Vec2(this.b.x, this.b.y);
			res.sub(this.a);
			res.mul(param);
			res.add(this.a);
		 
			return res;
		},
		// @param {Vec2} p
		// @return {number}
		// 获取距离p点最短距离的点 的 比例
		getProjectionParam: function (p) {
			var m = this.b.copy().sub(this.a); // m = b - a
			var proj = p.copy().sub(this.a); // p - a
			return m.dot(proj) / m.dot(m); // m.(p-a) / m.m
		},
		// @param {Vec2} p
		// @return {number}
		// 得到 p 点到线段的最短距离
		getProjectionDistance: function (p) {
			var _p = new Vec2(p.x, p.y);
			_p.sub(this.getClosestPoint(p));
			return _p.magnitude();
		}
		
	});
	this.LineSegment2 = LineSegment2;
	
	/* == Helper == */
	// 用于帮助检测 碰撞
	/**
	 * Helper area calculation function. Returns 2 X the area.
	 * 三角形外积
	 *
	 * @param  {Vec2} pointA
	 * @param  {Vec2} pointB
	 * @param  {Vec2} pointC
	 * @return {number}
	 */
	function signed2DTriArea(pointA, pointB, pointC) {
		 return ((pointA.x - pointC.x) * (pointB.y - pointC.y) - (pointA.y - pointC.y) * (pointB.x - pointC.x));
	}
	this.signed2DTriArea = signed2DTriArea;
	
	/**
	 * Helper intersection function. Intersects a ray with a sphere.
	 *
	 * @param {Ray2}   ray      Ray for intersecting
	 * @param {Circle} circle   Circle to be intersected
	 * @return {boolean}        If the ray intersects the sphere
	 * 判断 射线与 圆 是否相交
	 */
	var closure;
	function intersectRaySphere(ray, circle) {
		closure = function () {
			return localCollisionTime;   
		};
	 
		var m = new Vec2(ray.point.x, ray.point.y);
		m.sub(circle.c);
	 
		var a = ray.normal.dot(ray.normal);
		var b = m.dot(ray.normal);
		var c = m.dot(m) - circle.r * circle.r;
	 
		// Is the ray heading towards the circle? Otherwise it won't intersect
		if (c > 0 && b > 0) {
			return false;
		}
		
		var discr = b * b - a * c;
	 
		// Do the ray intersect the sphere if the ray was infinitely long?
		if (discr < 0) {
			return false;
		}
		
		var localCollisionTime = (-b - Math.sqrt(discr)) / a;
	 
		// Check that the collision time is on the ray
		if (localCollisionTime < 0 || localCollisionTime > 1) {
			return false;
		}
	 
		return true;
	}
	this.intersectRaySphere = intersectRaySphere;
	
	/**
	 * Helper intersection function. Checks if two lines intersect.
	 *
	 * @param {LineSegment2} a Line A
	 * @param {LineSegment2} b Line B
	 * @return {Object} An object is returned with intersection point and time if they intersect, otherwise null.
	 * 判断两条线段是否相交，如果是，返回交点，和相交时间， 否则返回null
	 */
	function intersectLineSegments(a, b) {
		var a1 = signed2DTriArea(a.a, a.b, b.b);
		var a2 = signed2DTriArea(a.a, a.b, b.a);
		if (a1 * a2 < 0) {
			var a3 = signed2DTriArea(b.a, b.b, a.a);
			var a4 = a3 + a2 - a1;
			if (a3 * a4 < 0) {
				var intersectionTime = a3 / (a3 - a4);
	 
				// intersectionPoint = a.a + intersectionTime * (a.b - a.a);
				var intersectionPoint = new Vec2(a.b.x, a.b.y);
				intersectionPoint.sub(a.a);
				intersectionPoint.mul(intersectionTime);
				intersectionPoint.add(a.a);
	 
				return {intersectionPoint: intersectionPoint,intersectionTime : intersectionTime};
			}
		}
	 
		return null;
	}
	this.intersectLineSegments = intersectLineSegments;
	
	/**
	 * Collision object to hold both contact points and intersection time
	 *
	 * @param {[CollisionContact]} cts Array consisting of contact points
	 * @param {number} it Intersection Time
	 * @constructor
	 */
	function Collisions(cts, it) {
		this.cts = cts;
		this.it = it;
	}
	this.Collisions = Collisions;
	
	/**
	 * Test a sweep-circle against convex shape.
	 *
	 * @param {Circle}      circle        Circle used in test
	 * @param {Vec2}        movement      Vector describing movement
	 * @param {ConvexShape} shape         Shape to be tested against
	 * @return {Collisions}               Collision objects that holds both contact points and intersection time.
	 * 判断一个移动的圆 和 不规则凸起形状的碰撞相交关系，如果相交，返回关联的点和 相交时间
	 * convex shape 的 points 顶点顺序 需要是逆时针排列的，这样可以避免在内部碰撞的检测，同时movement反向的也可以直接跳出
	 */
	function getCollisionShape(circle, movement, shape) {
		var contactPoints = [],
			SWEEP_EPSILON = pkg.SWEEP_EPSILON;
	 
		var foundOne = false;
		var minIntersectionTime = Number.MAX_VALUE;
		var localIntersectionTime = Number.MAX_VALUE;
	 
		var i = 0;      // Used for iteration
		var pt;         // Handle during loops
		var contact;    // Placeholder for eventual contact point
	 
		if (shape.numOfPoints() > 1) {
			pt = shape.points;
			for (i = 0; i < pt.length; i++) {
				var last = pt[i];
				var curr = i+1 === pt.length ? pt[0] : pt[i+1];
	 
				// last & curr is now start and end points of the line.
				// 远离
				var normal = new Vec2(-(curr.y - last.y), curr.x - last.x);
				if (0 < normal.dot(movement)) {
					continue; 
				}
	 
				normal.normalize();
	 
				// last = last + normal * (circle.r + SWEEP_EPSILON)
				var _last = new Vec2(normal.x, normal.y);
				_last.mul(circle.r + SWEEP_EPSILON);
				_last.add(last);
	 
				// curr = curr + normal * (circle.r + SWEEP_EPSILON)
				var _curr = new Vec2(normal.x, normal.y);
				_curr.mul(circle.r + SWEEP_EPSILON);
				_curr.add(curr);
	 
				var endPos = new Vec2(circle.c.x, circle.c.y);
				endPos.add(movement);
	 
				var localContact = new Vec2();
	 
				var res = intersectLineSegments(new LineSegment2(circle.c, endPos), new LineSegment2(_last, _curr));
				if (res) {
					if (res.intersectionTime < minIntersectionTime) {
						foundOne = true;
						minIntersectionTime = res.intersectionTime;
	 
						// localContact - normal * circle.r
						var _lc = new Vec2(normal.x, normal.y);
						_lc.mul(circle.r);
	 
						res.intersectionPoint.sub(_lc);
	 
						contact = new CollisionContact(res.intersectionPoint, normal, 0, shape.user, shape.material);
					}
				}
			}
		}
	 
	 
		if (!foundOne) {
			pt = shape.points;
			for (i = 0; i < pt.length; i++) {
				localIntersectionTime = Number.MAX_VALUE; 
	 
				// Multiply the length of the ray to make sure that the spheres won't go
				// through each other at extremely low speeds
				var _mov = new Vec2(movement.x, movement.y);
				_mov.mul(1.1);
				if (intersectRaySphere(new Ray2(circle.c, _mov), new Circle(pt[i], circle.r))) {
					localIntersectionTime = closure();
					if (localIntersectionTime < minIntersectionTime) {
						// Got collision.
						foundOne = true;
						minIntersectionTime = localIntersectionTime;
						
						// circle.c + localIntersectionTime * movement - pt[i]
						var _normal = new Vec2(movement.x, movement.y);
						_normal.mul(localIntersectionTime);
						_normal.sub(pt[i]);
						_normal.add(circle.c);
						_normal.normalize();
	 
						// Contact point is the vertex.
						// Normal is vector from corner to position of sphere at collision time.
						contact = new CollisionContact(pt[i], _normal, 0, shape.user, shape.material);
					}
				}
			}
		}
		
	 
		if (foundOne) {
			contactPoints.push(contact);
			return new Collisions(contactPoints, minIntersectionTime);
		}
		else {
			return null;
		}
	};
	this.getCollisionShape = getCollisionShape;
	
	/**
	 * Test two sweep circles against eachother
	 *
	 * @param {Circle} circleA
	 * @param {Vec2}   movementA
	 * @param {Circle} circleB
	 * @param {Vec2}   movementB
	 * @return {Collisions}  Collision objects that holds both contact points and intersection time.
	 * 两个移动的圆的 相交 关系
	 */
	function getCollisionSphere(circleA, movementA, circleB, movementB) {
		// Calculating the sum of the movement of the two circles. The test is reduced
		// to a ray test against a stationary circle
		
		// movementA - movementB
		var movementOfCircleA = new Vec2(movementA.x, movementA.y);
		movementOfCircleA.sub(movementB);
		var cB = new Circle(circleB.c, circleA.r + circleB.r);
	 
		// Now do a regular ray-circle intersection.
		var contactPoints = [];
		var collision = null;
		
		// Multiply the length of the ray with 1.1 to make sure that the spheres won't go
		// through each other at extremely low speeds
		if (intersectRaySphere(new Ray2(circleA.c, movementOfCircleA.mul(1.1)), cB)) {
			var localCollisionTime = closure();
	 
			var contactPoint = new CollisionContact();
	 
			// Normal is line between centers at collision time.
			// contactPoint.normal = ((circleA.c + localCollisionTime * movementA) - (circleB.c + localCollisionTime * movementB)).normalize();
			var rhs = new Vec2(movementB.x, movementB.y); // RHS of -
			rhs.mul(localCollisionTime);
			rhs.add(circleB.c);
	 
			contactPoint.normal = new Vec2(movementA.x, movementA.y); // LHS of -
			contactPoint.normal.mul(localCollisionTime);
			contactPoint.normal.add(circleA.c);
	 
			contactPoint.normal.sub(rhs);
			contactPoint.normal.normalize();
	 
			// Collision point.
			// contactPoint.point = (circleB.c + localCollisionTime * movementB) + contactPoint.normal * circleB.r;
			rhs = new Vec2(contactPoint.normal.x, contactPoint.normal.y); // RHS of outer +
			rhs.mul(circleB.r);
	 
			contactPoint.point = new Vec2(movementB.x, movementB.y); // LHS of outer +
			contactPoint.point.mul(localCollisionTime);
			contactPoint.point.add(circleB.c);
	 
			contactPoint.point.add(rhs);
	 
			contactPoints.push(contactPoint);
			collision = new Collisions(contactPoints, localCollisionTime);
		}
	 
		return collision;
	};
	this.getCollisionSphere = getCollisionSphere;
	
	/**
	 * Test if a sphere is penetrating a convex shape.
	 *
	 * @param {Circle}              circle
	 * @param {Vec2}                pos [偏移向量pos]
	 * @param [ConvexShape]         shapes
	 *
	 * @return {[CollisionContact]}  contactPoints
	 * 圆是否穿过 某个凸起物
	 */
	function getPenetrations(circle, pos, shapes) { 
		var contactPoints = [],
			PENETRATION_EPSILON = pkg.PENETRATION_EPSILON,
			SWEEP_EPSILON = pkg.SWEEP_EPSILON;
			
		for (var i = 0; i < shapes.length; i++) {
			if (shapes[i].numOfPoints() > 1) {
				for (var p = 0; p < shapes[i].points.length; p++) {
					var last = shapes[i].points[p];
					var curr = p+1 === shapes[i].points.length ? shapes[i].points[0] : shapes[i].points[p+1];
	 
					var circlePos = new Vec2(circle.c.x, circle.c.y);
					circlePos.add(pos);
	 
					var ls = new LineSegment2(curr, last);
					var closestPoint = ls.getClosestPoint(circlePos);
	 
					var contactVector = new Vec2(closestPoint.x, closestPoint.y);
					contactVector.sub(circlePos);

					if (contactVector.dot(contactVector) <= ((circle.r + PENETRATION_EPSILON) * (circle.r + PENETRATION_EPSILON))) { 
						var depth = (circle.r + SWEEP_EPSILON) - contactVector.magnitude();
	 
						// faceNormal = last - curr
						var faceNormal = new Vec2(last.x, last.y);
						faceNormal.sub(curr);
						faceNormal.y *= -1;
						faceNormal.normalize();
	 
						contactVector.mul(-1);
	 
						var contact = new CollisionContact(closestPoint, contactVector, depth, faceNormal, shapes[i].user, shapes[i].material);
						contact.normal.normalize();
	 
						contactPoints.push(contact);
					}
				}
			}
		}
	 
		return contactPoints;
	};
	this.getPenetrations = getPenetrations;
	
	
	// export to Laro
	La.extend(this);
		
});
