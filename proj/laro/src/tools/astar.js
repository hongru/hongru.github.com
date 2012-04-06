/**
 * A* 寻路算法
 * 基于map为规则矩阵的形式
 */

Laro.register('.tools', function (La) {
	var pkg = this;

	var P = function (parentP, pos, endPos) {
		this.pos = pos;
		this.endPos = endPos;
		if (parentP) {
			this.parentP = parentP;
			this.parentPos = parentP.pos;
		}
		
	};
	P.prototype = {
		getGByPoint: function (p) {
			var retG = p.G || 0;
			if (p.pos[0] == this.pos[0] || p.pos[1] == this.pos[1]) {
				retG += 10;
			} else {
				retG += 14;
			}
			return retG;
		},
		updateH: function (endPos) {
			if (!endPos) {
				endPos = this.endPos;
			}	 
			this.H = 10*(Math.abs(this.pos[0]-this.endPos[0]) + Math.abs(this.pos[1]-this.endPos[1]));
		},
		updateF: function () {
			this.F = this.G + this.H;		 
		}

	};

	/**
	 * 所有用于寻路算法的mapMatrix,这里都简化成可通过，和不可通过两种方式
	 * 可通过统一用 0 ，不可通过统一 用 大于0的数字表示
	 * 所以在使用以下方法时，可能需要先 将 你的mapMatrix 格式化一下
	 */
	var AStar = La.Class(function (mapMatrix, whiteList) {
		this.mapMatrix = mapMatrix;
		this.mmRow = mapMatrix.length;
		this.mmCol = mapMatrix[0].length;
		// 用于处理可以斜着穿透拐角的白名单，默认都是不可斜穿
		if (whiteList == undefined) {
			whiteList = [];
		}
		this.whiteList = whiteList;
		this._whiteHash = {};
		for (var i = 0; i < this.whiteList.length; i ++) {
			this._whiteHash[this.whiteList[i]] = 1;
		}
		
	}).methods({
		// startPos,endPos 分别表示寻路相对于mapMatrix的起始位置 和 结束位置
		// 比如第几行，第几列
		getPath: function (startPos, endPos) {
			this.startPos = startPos;
			this.endPos = endPos;
			this.currP = null;

			this.openHash = {};
			this.closeHash = {};

			this.path = [];
			
			// whether startPos or endPos is out of mapMatrix, or not available;
			if (this.mapMatrix[startPos[0]][startPos[1]] > 0
				|| this.mapMatrix[startPos[0]][startPos[1]] == undefined
				|| this.mapMatrix[endPos[0]][endPos[1]] > 0
				|| this.mapMatrix[endPos[0]][endPos[1]] == undefined) {
				return null;
			} 

			// push in openList
			//this.openList.push(startPos);
			var startP = new P(null, startPos, endPos);
			this.openHash[startPos.join('_')] = startP;
			this.currP = startP;
			this._step();

			return this.path;
		},
		_step: function () {
			// step a
			var F = Number.MAX_VALUE, isEmpty = true;
			for (var k in this.openHash) {
				isEmpty = false;
				if (this.openHash[k].F < F) {
					F = this.openHash[k].F;
					this.currP = this.openHash[k];
				}
			}
			if (isEmpty) {
				// not find path;
				return false;
			}

			// step b
			var key = this.currP.pos.join('_');
			delete this.openHash[key];
			this.closeHash[key] = 1;

			// step c
			var pos = this.currP.pos,
				endPos = this.endPos;
			for (var r = pos[0]-1; r <= pos[0]+1; r ++) {
				var row = this.mapMatrix[r];
				if (!!row) {
					for (var c = pos[1]-1; c <= pos[1]+1; c ++) {
						var _pos = [r, c];
						if (row[c] === 0) {
							// available;
							//in closeHash, continue;
							//or in corner rules, continue;
							if (this.closeHash[_pos.join('_')]
								|| (row[pos[1]] > 0 && !this._whiteHash[row[pos[1]]]) 
								|| (this.mapMatrix[pos[0]][c] > 0 && !this._whiteHash[this.mapMatrix[pos[0]][c]])) {
								continue;
							}

							// not in openHash
							if (!this.openHash[_pos.join('_')]) {
								var p = new P(this.currP, _pos, endPos);
								p.G = p.getGByPoint(this.currP);
								p.updateH();
								p.updateF();
								this.openHash[p.pos.join('_')] = p;
							} else {
							// already in openHash
								var p = this.openHash[_pos.join('_')],
									eG = p.getGByPoint(this.currP);
								if (p.G > eG) {
									p.G = eG;
									p.updateF();
									p.parentP = this.currP;
									p.parentPos = this.currP.pos;
								}
							}

						} else if (row[c] > 0) {
							this.closeHash[_pos.join('_')] = 1;
						}
					}
				}
			}

			// step d
			// stop or not
			if (this.currP.pos[0] == this.endPos[0] && this.currP.pos[1] == this.endPos[1]) {
				// get path successfully
				this._composePath(this.currP);
				return true;
			} else {
				arguments.callee.call(this);
			}


		},
		// compose path
		_composePath: function (p) {
			this.path.unshift(p.pos);
			if (p.parentP) {
				arguments.callee.call(this, p.parentP);
			}

		}
		
	});

	this.AStar = AStar;

})
