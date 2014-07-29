;(function () {
var canvas = document.getElementById('knife-intro-canvas');
		var ctx = canvas.getContext('2d');
		var points = [
				[26, 171],
				[99, 92],
				[196, 124],
				[313, 195],
				[462, 122]
			];
		var pas = [];
		var pbs = [];
		var lastNor;
		var tempPoints = {};
		var midPoints = {};
		var bisectorNors = {};
		var bisectorPoints = {};

		function draw5Points() {
			
			for (var i = 0; i < points.length; i ++) {
				var p = points[i];
				ctx.beginPath();
				ctx.arc(p[0], p[1], 2, 0, Math.PI*2, false);
				ctx.fill();
			}
		}

		function drawLine() {
			for (var i = 0; i < points.length-1; i ++) {
				var p = points[i];
				var np = points[i+1];
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(p[0], p[1]);
				ctx.lineTo(np[0], np[1]);
				ctx.stroke();
				ctx.restore();
			}
		}

		function drawCircleByPoint (noDraw) {
			for (var i = 1; i < points.length-1; i ++) {
				var p = points[i];
				ctx.save();
				ctx.translate(p[0], p[1]);
				ctx.beginPath();
				ctx.arc(0, 0, 30, 0, Math.PI*2, false);
				ctx.strokeStyle = '#999';
				!noDraw && ctx.stroke();
				ctx.restore();
			}
		}

		function getVectorByPoints (noDraw) {
			for (var i = 1; i < points.length-1; i ++) {
				var p = points[i];
				var pp = points[i-1];
				var np = points[i+1];

				var l1 = Math.sqrt(Math.pow(p[0]-pp[0], 2) + Math.pow(p[1]-pp[1], 2));
				var l2 = Math.sqrt(Math.pow(p[0]-np[0], 2) + Math.pow(p[1]-np[1], 2));

				var n1 = [(pp[0]-p[0])/l1, (pp[1]-p[1])/l1];
				var n2 = [(np[0]-p[0])/l2, (np[1]-p[1])/l2];
				lastNor = n2;

				var tp1 = [p[0]+n1[0]*30, p[1]+n1[1]*30];
				var tp2 = [p[0]+n2[0]*30, p[1]+n2[1]*30];
				tempPoints[i] = [tp1, tp2];

				tempPoints[i].forEach(function (tp) {
					ctx.save();
					ctx.beginPath();
					ctx.arc(tp[0], tp[1], 2, 0, Math.PI*2, false);
					ctx.strokeStyle = '#ff4a00';
					!noDraw && ctx.stroke();
				})
			}
		}

		function getMidPoint (noDraw) {
			for (var k in tempPoints) {
				var arr = tempPoints[k];
				console.log(arr)
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(arr[0][0], arr[0][1]);
				ctx.lineTo(arr[1][0], arr[1][1]);
				ctx.strokeStyle = '#999';
				ctx.setLineDash([5]);
				!noDraw && ctx.stroke();
				ctx.restore();

				var l = Math.sqrt(Math.pow(arr[1][0] - arr[0][0], 2) + Math.pow(arr[1][1] - arr[0][1], 2));
				var nor = [(arr[1][0] - arr[0][0])/l, (arr[1][1]-arr[0][1])/l];
				midPoints[k] = [arr[0][0] + nor[0]*l/2, arr[0][1]+nor[1]*l/2];

				ctx.beginPath();
				ctx.arc(midPoints[k][0], midPoints[k][1], 2, 0, Math.PI*2, false);
				!noDraw && ctx.stroke();
			}
		}

		function drawBisector () {
			var step = 5;
			for (var k in midPoints) {
				var mp = midPoints[k],
					p = points[k];
				var l = Math.sqrt(Math.pow(mp[0]-p[0], 2) + Math.pow(mp[1]-p[1], 2));
				var nx = (mp[0]-p[0])/l,
					ny = (mp[1]-p[1])/l;

				if (ny < 0) {
					nx = -nx;
					ny = -ny;
				}
				bisectorNors[k] = [nx, ny];

				var pa = [p[0] + nx*step, p[1]+ny*step];
				var pb = [p[0] - nx*step, p[1]-ny*step];

				bisectorPoints[k] = {
					pa: pa,
					pb: pb
				};
				pas.push(pa);
				pbs.push(pb);

				step += 5;

				ctx.save();
				ctx.beginPath();
				ctx.arc(pa[0], pa[1], 2, 0, Math.PI*2, true);
				ctx.strokeStyle = 'red';
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(pb[0], pb[1], 2, 0, Math.PI*2, true);
				ctx.strokeStyle = 'blue';
				ctx.stroke();
				ctx.restore();
			}

			var lastInd = parseInt(k) + 1;
			var lastN = [-lastNor[1], lastNor[0]];
			if (lastN[1] < 0) lastN = [-lastN[0], -lastN[1]];
			var p = points[lastInd];
			var pa = [p[0] + lastN[0]*step, p[1]+lastN[1]*step];
			var pb = [p[0]-lastN[0]*step, p[1]-lastN[1]*step];
			bisectorPoints[lastInd] = {
				pa: pa,
				pb: pb
			};
			pas.push(pa);
			pbs.push(pb);

			ctx.save();
			ctx.beginPath();
			ctx.arc(pa[0], pa[1], 2, 0, Math.PI*2, true);
			ctx.strokeStyle = 'red';
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(pb[0], pb[1], 2, 0, Math.PI*2, true);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
			ctx.restore();
		}

		function join2Fill() {
			var allP = [points[0]].concat(pbs).concat(pas.reverse());
			//ctx.save();
			console.log(allP)
			ctx.beginPath();
			for (var i =0; i < allP.length-1; i ++) {
				
				ctx.moveTo(allP[i][0], allP[i][1]);
				ctx.lineTo(allP[i+1][0], allP[i+1][1]);
				if (i < (allP.length-1)/2) {
					ctx.strokeStyle = 'blue';
					ctx.setLineDash([5]);
					ctx.globalAlpha = 1;
				} else {
					ctx.globalAlpha = 0.1;
				}
				ctx.stroke();
			}
			ctx.lineTo(allP[0][0], allP[0][1])

			ctx.stroke();

			//ctx.restore();
		}

		function clear () {
			pas = [];
			pbs = [];
			tempPoints = {};
			midPoints = {};
			bisectorNors = {};
			bisectorPoints = {};
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}


		function getPoints(ps) {
			var arr = [];
			for (var i = 0; i < ps.length; i ++) {
				arr.push({
					x: ps[i][0],
					y: ps[i][1]
				});
			}
			return arr;
		}
		function drawBrokenLine (points) {
			var cs = [];
			ctx.beginPath();
			ctx.moveTo(points[0]['x'], points[0]['y']);
			for (var i = 1; i < points.length; i ++) {
				if (points[i].type == 'c') {
					cs.push(points[i]);
					if (points.length > 3) continue;
				}
				ctx.lineTo(points[i]['x'], points[i]['y']);
			}
			ctx.strokeStyle = 'black';
			ctx.stroke();
			ctx.closePath();

			for (var i = 0; i < cs.length; i ++) {
				ctx.beginPath();
				ctx.arc(cs[i].x, cs[i].y, 5, 0, Math.PI*2, true);
				ctx.closePath();
				ctx.strokeStyle = 'red';
				ctx.stroke();
			}
		}
		function getSegLength(p0, p1) {
			return Math.sqrt(Math.pow(p0['x']-p1['x'], 2) + Math.pow(p0['y'] - p1['y'], 2));
		}
		function getSegNormal(p0, p1) {
			var l = getSegLength(p0, p1);
			return [(p1['x'] - p0['x'])/l, (p1['y'] - p0['y'])/l];
		}
		function insertBezierPoints (points) {
			if (points.length == 3) {
				points[1].type = 'c';
				return points;
			} else if (points.length > 3) {
				for (var i = 1; i < points.length - 2; i ++) {
					var p0 = points[i],
						p1 = points[i+1],
						l = getSegLength(p0, p1),
						nor = getSegNormal(p0, p1);
					var p = {
						type: 'c',
						x: p0.x + nor[0]*l/2,
						y: p0.y + nor[1]*l/2
					};
					points.splice(i+1, 0, p);
					i ++;
				}
			}
			return points;
		}


		function step1 () {
			clear();
			draw5Points();
		}
		function step2 () {
			step1();
		 	drawLine();
		}
		function step3 () {
			step2();
			drawCircleByPoint();
		}
		function step4 () {
			step3();
			getVectorByPoints();
		}
		function step5 () {
			step4();
			getMidPoint();
		}
		function step6 () {
			step5();
			drawBisector();
		}
		function step7 () {
			step6();
			join2Fill();
		}

		function step8 () {
			step7();
			//get bezier
			var p = [points[0]].concat(pbs);
			p = getPoints(p);
			p = insertBezierPoints(p);

			ctx.save();
			ctx.beginPath();
			for (var i = 0; i < p.length-2; i += 2) {
				ctx.moveTo(p[i].x, p[i].y);
				ctx.quadraticCurveTo(p[i+1].x, p[i+1].y, p[i+2].x, p[i+2].y);
			}
			ctx.strokeStyle = 'red';
			ctx.globalAlpha = '1';
			ctx.setLineDash([0])
			ctx.stroke();
			ctx.closePath();
			ctx.restore();

		}

		function step9 () {
			step8();
			var p = [points[0]].concat(pas.reverse());
			p = getPoints(p);
			p = insertBezierPoints(p);

			ctx.save();
			ctx.beginPath();
			for (var i = 0; i < p.length-2; i += 2) {
				ctx.moveTo(p[i].x, p[i].y);
				ctx.quadraticCurveTo(p[i+1].x, p[i+1].y, p[i+2].x, p[i+2].y);
			}
			ctx.strokeStyle = 'red';
			ctx.globalAlpha = '1';
			ctx.setLineDash([0])
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}

		function play () {
			var arr = [step1,step2,step3,step4,step5,step6,step7,step8,step9];
			var t = 0;
			for (var i = 0; i < arr.length; i ++) {
				var f = arr[i];
				(function (i, f, t) {
					setTimeout(function () {
						f();
					}, t)
				})(i, f, t);
				t += 1000;
			}
		}
		
		//bind
		step1();
		var stepInd = 1;
		var stepArr = [step1,step2,step3,step4,step5,step6,step7,step8,step9];
		$('#knife-intro').on('click', function (e) {
			
			if (stepInd > 9) {
				stepInd = 1;
				ctx.globalAlpha = 1;
				ctx.setLineDash([0])
			}
			stepArr[stepInd] && stepArr[stepInd]();
			stepInd ++;
		});
})();

