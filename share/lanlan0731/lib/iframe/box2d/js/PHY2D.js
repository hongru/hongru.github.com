/* =======================================================
 *  ---- Rigid bodies physics engine ----
 * script: Gerard Ferrandez - 28 April 2013
 * last update: Nov 3, 2013
 * ------------------------------------------------------
 * Adapted from a C# demo by Paul Firth
 * http://www.wildbunny.co.uk/blog/2011/03/25/speculative-contacts-an-continuous-collision-engine-approach-part-1/
 * ------------------------------------------------------
 * JavaScript code released under the MIT license
 * http://www.dhteumeuleu.com/LICENSE.html
 * ======================================================= */

"use strict";

var ge1doot = ge1doot || {};

ge1doot.PHY2D = function() {
	
	// closure variables
	
	var 
	ctx, pointer, drag,
	objects   = [],
	contacts  = [],
	contactsI = 0, numIterations, kTimeStep, kGravity, kFriction,
	DEBUG = false, EPSILON = 0.0001;

	// instantiate Vector library
	
	var V2 = ge1doot.V2();
	
	// ==== BroadPhase 'Seep and Prune' 1D Constructor ====
	
	var SAP = {
	
		axis: [],
		pairs: [],
		
		// sweep point constructor
		
		SweepPoint: function (body, index) {
			this.body    = body;
			this.AABB    = body.motionBounds;
			this.axis    = body.motionBounds.axis;
			this.index   = index;
			this.invMass = body.invMass;
		},
		
		// pair Constructor
		
		Pair : function (A, B) {
			this.A    = A;
			this.B    = B;			
		},
		
		// add left/right AABB's vectors
		
		add: function (rb) {
			this.axis.push(new this.SweepPoint(rb, 0));
			this.axis.push(new this.SweepPoint(rb, 1));
		},
		
		// remove object from SAP
		
		del: function (rb) {
			
			// clean up axis
			
			var k = this.axis.length;
			while (k--) {
				var p = this.axis[k];
				if (p.body === rb) {
					this.axis.splice(k, 1);
				}
			}
			
			// clean up broad pairs
			
			var k = this.pairs.length;
			while (k--) {
				var p = this.pairs[k];
				if (p.A === rb.motionBounds || p.B === rb.motionBounds) {
					this.pairs.splice(k, 1);
				}
			}
		},
		
		// delete A-B pair
		
		deletePair: function (A, B) {
			
			var k = this.pairs.length;
			while (k--) {
				var p = this.pairs[k];
				if ((p.A === A && p.B === B) || (p.A === B && p.B === A)) {
					this.pairs.splice(k, 1);
					break;
				}
			}
			
		},
		
		// 1D Sweep And Prune
		
		collide: function () {
			
			var i, j, keyelement, key, swapper;
			
			// persistent insertion sort
			
			for (var j = 1, l = this.axis.length; j < l; j++) {
				
				keyelement = this.axis[j];
				key = keyelement.axis[keyelement.index];
				i = j - 1;
				swapper = this.axis[i];
				
				while (i >= 0 && swapper.axis[swapper.index] > key) {
					
					// start X overlap
					
					if (keyelement.index === 0 && swapper.index === 1) {
						if (swapper.invMass !== 0 || keyelement.invMass !== 0) {
							this.pairs.push(
								new this.Pair(swapper.AABB, keyelement.AABB)
							);
						}
					}
					
					// stop X overlap
					
					if (keyelement.index === 1 && swapper.index === 0) {
						this.deletePair(swapper.AABB, keyelement.AABB);
					}
					
					this.axis[i + 1] = swapper;
					swapper = this.axis[--i];
				}
				
				this.axis[i + 1] = keyelement;
			}
			
			// AABB overlaps
			
			contactsI = 0;
			var k = this.pairs.length;
			while (k--) {
				var p = this.pairs[k], A = p.A, B = p.B;
				if ( A.overlap(B) ) {
					A.body.contact(B.body);
				}
			}
		}
		
	};
	
	// ==== AABB Constructor ====
	
	var AABB = function (body) {
		this.body        = body;
		this.center      = V2.vector();
		this.halfExtends = V2.vector();
		this.axis        = V2.vector();
	}

	AABB.prototype.min = V2.vector();
	AABB.prototype.max = V2.vector();

	AABB.prototype.reset = function () {
		this.min[0] =  100000;
		this.min[1] =  100000;
		this.max[0] = -100000;
		this.max[1] = -100000;
	}

	AABB.prototype.minmax = function (a, b) {
		this.min.min(a, b);
		this.max.max(a, b);
	}

	AABB.prototype.save = function () {
		this.center.add(this.min, this.max).scaleSelf(0.5);
		this.halfExtends.sub(this.max, this.min).scaleSelf(0.5);
		this.axis[0] = Math.floor(this.center[0] - this.halfExtends[0]);
		this.axis[1] = Math.floor(this.center[0] + this.halfExtends[0]);
	
		if (DEBUG) {
			ctx.beginPath();
			ctx.moveTo(this.center[0] - this.halfExtends[0], this.center[1] - this.halfExtends[1]);
			ctx.lineTo(this.center[0] + this.halfExtends[0], this.center[1] - this.halfExtends[1]);
			ctx.lineTo(this.center[0] + this.halfExtends[0], this.center[1] + this.halfExtends[1]);
			ctx.lineTo(this.center[0] - this.halfExtends[0], this.center[1] + this.halfExtends[1]);
			ctx.closePath();
			ctx.fillStyle = "rgba(255,0,0,0.5)";
			ctx.fill();
		}
	
	}

	AABB.prototype.overlap = function(that) {
	
		// Y axis only (X axis handled during SAP phase)
		
		return (
			Math.abs(
				that.center[1] - this.center[1]
			) - (
				this.halfExtends[1] + that.halfExtends[1]
			) < 0
		);
	}
	
	// ==== Feature Pair Constructor ====
	
	var FeaturePair = function () {
		this.dist       = 0.0;
		this.closestI   = 0.0;
		this.edge       = 0.0;
		this.fpc        = 0.0;
		//this.centreDist = 0.0;
	}

	FeaturePair.prototype.set = function (dist, closestI, edge, fpc/*, centreDist*/) {
		this.dist       = dist;
		this.closestI   = closestI;
		this.edge       = edge;
		this.fpc        = fpc;
	}
	
	// ==== Rigid Body Constructor ====
	
	var RigidBody = function (img, x, y, w, h, vertrices, invMass, angularVel, angle) {
		
		this.img             = img;
		this.w               = w;
		this.h               = h;
		this.vel             = V2.vector();
		this.pos             = V2.vector(x, y);
		this.next            = V2.vector();
		this.angularVel      = angularVel || 0;
		this.invMass         = invMass || 0;
		this.angle           = angle || 0;
		this.matrix          = V2.matrix();
		this.matrixNextFrame = V2.matrix();
		this.motionBounds    = new AABB(this);
		this.drag            = false;
		this.vCount          = Math.floor(vertrices.length / 2);
		this.static          = false;
		
		// add object to SAP axis
		SAP.add(this);
		
		// form local space points
		this.localSpacePoints = V2.vectorsArray(this.vCount, vertrices, w * 0.5, h * 0.5);
		
		// and local space normals
		this.localSpaceNormals = V2.vectorsArray(this.vCount);
		for (var i = 0; i < this.vCount; i++ ) {
			this.localSpaceNormals[i].normal(
				this.localSpacePoints[(i + 1) % this.vCount],
				this.localSpacePoints[i]
			);	
		}
		
		// world points
		this.worldSpaceNormals = V2.vectorsArray(this.vCount);
		this.worldSpacePoints  = V2.vectorsArray(this.vCount);
		
		// calculate inverse inertia tensor
		this.invI = (invMass > 0) ? 1 / ((1 / invMass) * (w * w + h * h) / 3) : 0
		
		// contact points
		this.c1 = V2.vector();
		this.c0 = V2.vector();

	}

	RigidBody.prototype.empty           = V2.vector();
	RigidBody.prototype.mostSeparated   = new FeaturePair();
	RigidBody.prototype.mostPenetrating = new FeaturePair();
	
	RigidBody.prototype.getSupportVertices = function (that, wsN) {
		
		// rotate into RigidBody space
		var closestI = -1, closestD = -100000,
		v = V2.rotateIntoSpaceOf(that.matrix, wsN);
		
		// support
		for (var i = 0; i < that.vCount; i++) {
			var d = v.dot(that.localSpacePoints[i]);
			if (d > closestD) {
				closestD = d;
				closestI = i;
			}
		}
		return closestI;
		
	}
	
	RigidBody.prototype.featurePairJudgement = function (that, fpc) {
		
		var wsN, closestI, closest, mfp0, mfp1, dist, centreDist;
		
		for (var edge = 0; edge < this.vCount; edge++) {
			
			// get support vertices
			wsN = this.worldSpaceNormals[edge];
			closestI = this.getSupportVertices(that, wsN);
			    
			// form point on plane of minkowski face
			closest = that.worldSpacePoints[closestI];
			mfp0 = V2.sub(closest, this.worldSpacePoints[edge]); 			
			    
			// distance from origin to face	
			dist = mfp0.dot(wsN);
			
			if (dist > 0) {
				
				// separating axis, but we want to track closest points anyway
				
				// recompute distance to clamped edge
				mfp1 = V2.sub(closest, this.worldSpacePoints[(edge + 1) % this.vCount]);
				this.projectPointOntoEdge(this.empty, false, mfp0, mfp1);
				
				// recompute distance
				dist = this.c0.lenSqr();
				
				if (dist < this.mostSeparated.dist) {
					this.mostSeparated.set(dist, closestI, edge, fpc);
				}
				
			} else {
				
				// penetration
				if (dist > this.mostPenetrating.dist) {
					this.mostPenetrating.set(dist, closestI, edge, fpc);
				}
				
			}
		}
	}

	RigidBody.prototype.projectPointOntoEdge = function (p0, p1, e0, e1) {
		
		var e10, l, t;
		
		e10 = V2.sub(e1, e0);
		l = e10.lenSqr() + EPSILON;
		
		// time along edge - c0
		t = V2.clamp(e10.dot(V2.sub(p0, e0)) / l, 0, 1);
		
		// form point
		this.c0.scale(e10, t).addSelf(e0);
		
		if (p1) {
			// time along edge - c1
			t = V2.clamp(e10.dot(V2.sub(p1, e0)) / l, 0, 1);
			// form point
			this.c1.scale(e10, t).addSelf(e0);
		}
		
	}
	
	RigidBody.prototype.motionAABB = function () {
		
		this.motionBounds.reset();
		
		// loop through all points
		for (var i = 0; i < this.vCount; i++ ) {
			this.motionBounds.minmax(
				this.worldSpacePoints[i].transformBy(this.matrix, this.localSpacePoints[i]),
				this.next.transformBy(this.matrixNextFrame, this.localSpacePoints[i])
			);
			// world normals
			this.worldSpaceNormals[i].rotateBy(this.matrix, this.localSpaceNormals[i]);
		}
		
		// save bounding box
		this.motionBounds.save();
	}

	RigidBody.prototype.integrate = function () {

		if (this.drag) {
			// dragging object
			this.vel[0] = (pointer.X - this.pos[0]) * 10;
			this.vel[1] = (pointer.Y - this.pos[1]) * 10;
		} else {
			// gravity
			if (this.invMass > 0) this.vel[1] += kGravity;
		}
		
		// update position
		var v = V2.scale(this.vel, kTimeStep);
		this.pos.addSelf(v);
		this.angle += this.angularVel * kTimeStep;
		
		// set transform matrix
		this.matrix.setMatrix(this.angle, this.pos);
		this.matrixNextFrame.setMatrix(
			this.angle + this.angularVel * kTimeStep, 
			v.addSelf(this.pos)
		);
		
		// compute motion AABB
		if (!this.static) this.motionAABB();
		else {
			if (this.invMass === 0) {
				this.static = true;
				this.motionAABB();
			}
		}
		
	}
	
	RigidBody.prototype.contact = function (that) {

		var face, vertex, vertexRect, faceRect, fp, va, vb, vc, n0, n1, wsN, wdV0, wdV1, wsV0, wsV1;
		
		// generate contacts for this pair
		this.mostSeparated.set(100000, -1, -1, 0, 100000);
		this.mostPenetrating.set(-100000, -1, -1, 0, 100000);
		
		// face of A, vertices of B
		this.featurePairJudgement(that, 2);
		
		// faces of B, vertices of A
		that.featurePairJudgement(this, 1);
		
		if (this.mostSeparated.dist > 0 && this.mostSeparated.fpc !== 0) {
			
			// objects are separated
			face = this.mostSeparated.edge;
			vertex = this.mostSeparated.closestI;
			fp = this.mostSeparated.fpc;
			
		} else if (this.mostPenetrating.dist <= 0) {
			
			// objects are penetrating
			face = this.mostPenetrating.edge;
			vertex = this.mostPenetrating.closestI;
			fp = this.mostPenetrating.fpc;
		}
		
		if (fp === 1) vertexRect = this, faceRect = that;
		else vertexRect = that, faceRect = this;
			
		// world space vertex
		wsN = faceRect.worldSpaceNormals[face];
		
		// other vertex adjacent which makes most parallel normal with the collision normal
		va = vertexRect.worldSpacePoints[(vertex - 1 + vertexRect.vCount) % vertexRect.vCount];
		vb = vertexRect.worldSpacePoints[vertex];
		vc = vertexRect.worldSpacePoints[(vertex + 1) % vertexRect.vCount];
		
		if (
			V2.normal(vb, va).dot(wsN) < V2.normal(vc, vb).dot(wsN)
		) {
			wdV0 = va;
			wdV1 = vb;
		} else {
			wdV0 = vb;
			wdV1 = vc;
		}
		
		// world space edge
		wsV0 = faceRect.worldSpacePoints[face];
		wsV1 = faceRect.worldSpacePoints[(face + 1) % faceRect.vCount];
		
		
		// form contact
		if (fp === 1) {
		
			// project vertex onto edge
			this.projectPointOntoEdge(wsV0, wsV1, wdV0, wdV1);
			that.projectPointOntoEdge(wdV1, wdV0, wsV0, wsV1);
			n0 = -wsN[0];
			n1 = -wsN[1];
			
		} else {
		
			this.projectPointOntoEdge(wdV1, wdV0, wsV0, wsV1);
			that.projectPointOntoEdge(wsV0, wsV1, wdV0, wdV1);
			n0 = wsN[0];
			n1 = wsN[1];
			
		}
		
		// first contact
		if (!contacts[contactsI]) contacts[contactsI] = new Contact();
		contacts[contactsI++].set(this, that, this.c0, that.c0, n0, n1);
		
		// second contact
		if (!contacts[contactsI]) contacts[contactsI] = new Contact();
		contacts[contactsI++].set(this, that, this.c1, that.c1, n0, n1);
	
		if (DEBUG) {
			ctx.strokeStyle = "rgb(0,255,0)";
			ctx.beginPath();
			ctx.moveTo(this.c0[0], this.c0[1]);
			ctx.lineTo(that.c0[0], that.c0[1]);
			ctx.stroke();
			
			ctx.strokeStyle = "rgb(0,0,255)";
			ctx.beginPath();
			ctx.moveTo(this.c1[0], this.c1[1]);
			ctx.lineTo(that.c1[0], that.c1[1]);
			ctx.stroke();
		}
	
	}
	
	RigidBody.prototype.del = function () {
		var k = objects.length;
		while (k--) {
			if (objects[k] === this) {
				SAP.del(this);
				objects.splice(k, 1);
				break;
			}
		}
	}
	
	RigidBody.prototype.draw = function () {
		
		if (this.img) {
		
			// draw image
			ctx.save();
			ctx.translate(this.pos[0], this.pos[1]);
			ctx.rotate(this.angle);
			ctx.drawImage(this.img, -this.w * 0.5, -this.h * 0.5, this.w, this.h);
			ctx.restore();
			
			if (pointer.isDown && !drag && this.invMass) {
				
				// poly path
				ctx.beginPath();
				for (var j = 0; j < this.vCount; j++ ) {
					var a = this.worldSpacePoints[j];
					ctx.lineTo(a[0], a[1]);
				}
				ctx.closePath();
				
				// test point in poly
				if (ctx.isPointInPath(pointer.X, pointer.Y)) {
					this.drag = true;
					drag = true;
				}
				
			}
		}
	}
	
	// ==== Contact Constructor ====
	var Contact = function () {
		
		this.a           = {};
		this.b           = {};
		this.normal      = V2.vector();
		this.ra          = V2.vector();
		this.rb          = V2.vector();
		this.dist        = 0;
		this.impulseN    = 0;
		this.impulseT    = 0;
		this.invDenom    = 0;
		this.invDenomTan = 0;
		
	}
	
	Contact.prototype.set = function (A, B, pa, pb, n0, n1) {
		
		var ran, rbn, pn;
		
		this.a = A;
		this.b = B;
		this.normal[0] = n0;
		this.normal[1] = n1;
		this.dist = V2.sub(pb, pa).dot(this.normal);
		this.impulseN = 0;
		this.impulseT = 0;
		
		// calculate radius arms
		this.ra.sub(pa, A.pos).perpSelf();
		this.rb.sub(pb, B.pos).perpSelf();
		
		// compute denominator in impulse equation
		ran = this.ra.dot(this.normal);
		rbn = this.rb.dot(this.normal);
		pn  = V2.perp(this.normal);
		this.invDenom  = 1 / (A.invMass + B.invMass + (ran * ran * A.invI) + (rbn * rbn * B.invI));
		ran = this.ra.dot(pn);
		rbn = this.rb.dot(pn);
		this.invDenomTan = 1 / (A.invMass + B.invMass + (ran * ran * A.invI) + (rbn * rbn * B.invI));
	}
	
	Contact.prototype.applyImpulse = function (imp) {
		
		// linear
		this.a.vel.addMultSelf(imp, this.a.invMass);
		this.b.vel.subMultSelf(imp, this.b.invMass);
		
		// angular
		this.a.angularVel += imp.dot(this.ra) * this.a.invI;
		this.b.angularVel -= imp.dot(this.rb) * this.b.invI;
	}

	Contact.prototype.solve = function () {
		
		var p, dv, newImpulse, absMag;
		
		// get all of relative normal velocity
		dv = V2.sub(
			V2.scale(this.rb, this.b.angularVel).addSelf(this.b.vel),
			V2.scale(this.ra, this.a.angularVel).addSelf(this.a.vel)
		);
		
		// accumulated impulse
		newImpulse = (dv.dot(this.normal) + this.dist / kTimeStep) * this.invDenom + this.impulseN;
		
		// push only
		if (newImpulse > 0) newImpulse = 0;
		
		// apply impulse
		this.applyImpulse(V2.scale(this.normal, newImpulse - this.impulseN));
		this.impulseN = newImpulse;
		
		// friction
		absMag = Math.abs( this.impulseN ) * kFriction;
		p = V2.perp(this.normal);
		newImpulse = V2.clamp(dv.dot(p) * this.invDenomTan + this.impulseT, -absMag, absMag);
		
		// apply friction impulse
		this.applyImpulse(p.scaleSelf(newImpulse - this.impulseT));
		this.impulseT = newImpulse;
		
	}
	
	
	// ======== API ========
	
	
	this.init = function (data, c, p) {
		ctx = c;
		pointer = p;
		numIterations = data.numIterations || 4;
		kTimeStep = data.kTimeStep || 1/60;
		kGravity = data.kGravity || 0;
		kFriction = data.kFriction || 0;
	}
	
	
	// ---- rendering loop ----
	
	this.render = function () {
		
		// collisions
		SAP.collide();
		
		// solve
		for (var j = 0; j < numIterations; j++) {
			var k = contactsI;
			while (k--) contacts[k].solve();
		}
		
		// integrate
		var k = objects.length;
		while (k--) {
			var rb = objects[k];
			rb.integrate();
			rb.draw();
		}
	}
	
	// ---- delete all static objects ----
	
	this.deleteStatic = function () {
		var k = objects.length;
		while (k--) {
			var p = objects[k];
			if (!p.invMass) {
				SAP.del(p);
				objects.splice(k, 1);
			}
		}
	}
	
	// ---- create new rectangle ----
	
	this.rectangle = function (img, x, y, w, h, mass, angularVel, angle) {
		var invMass = mass ? 1 / mass : 0;
		var rb = new RigidBody(img, x, y, w, h, [1,-1,-1,-1,-1,1,1,1], invMass, angularVel, angle);
		objects.push(rb);
		return rb;
	}
	
	// ---- create new triangle ----
	
	this.triangle = function (img, x, y, w, h, mass, angularVel, angle) {
		var invMass = mass ? 1 / mass : 0;
		var rb = new RigidBody(img, x, y, w, h, [0,-1,-1,1,1,1], invMass, angularVel, angle);
		objects.push(rb);
		return rb;
	}
	
	// ---- create new line ----
	
	this.line = function (img, x, y, w, h, mass, angularVel, angle) {
		var invMass = mass ? 1 / mass : 0;
		var rb = new RigidBody(img, x, y, w, h, [1,0,-1,0], invMass, angularVel, angle);
		objects.push(rb);
		return rb;
	}
	
	// ---- objects ----
	
	this.objects = objects;

	this.drag = function (d) {
		var k = objects.length;
		while (k--) objects[k].drag = d;
		drag = d;
	}
	
	// delete object
	
	this.deleteObject = function (index) {
		
		var rb = objects[index];
		
		if (rb) {
	
			// clean SAP
			SAP.del(rb);
			
			// delete object
			objects.splice(index, 1);
			
		}
	}
	
	// ---- return namespace reference ----
	
	return this;
	
}