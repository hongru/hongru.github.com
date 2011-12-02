/**
 * fsm
 * 有限状态机
 */

Laro.register('.game', function (La) {
		
	var Class = La.Class || La.base.Class,
		SimpleState = La.SimpleState || La.game.SimpleState,
		BaseState = La.BaseState || La.game.BaseState;

	var FSM = Class(function (host, states, onStateChange){
		if (host == undefined) return;
		this.host = host;
		this.onStateChange = onStateChange;
		this.stateArray = [];

		// states list 中，俩个元素为一组，分别是state标识{Int,标识状态顺序},和对应的state 类
		for (var i = 0; i < states.length; i += 2) {
			var stateId = states[i],
				stateClass = states[i + 1];

			if (stateClass instanceof SimpleState) {
				this.stateArray[stateId] = stateClass;
			} else {
				this.stateArray[stateId] = new stateClass(host, this, stateId);
			}
		}

		this.currentState = FSM.kNoState;
		this.numSuspended = 0;
		this.suspendedArray = [];
		this.numPreloaded = 0;
		this.preloadedArray = [];
		this.numStates = this.stateArray.length;

	}).methods({
		// 进入某一个state
		enter: function (startState, message) {
			this.setState(startState, message);
		},
		// 退出state，回到初始化状态
		leave: function () {
			this.setState(FSM.kNoState);
		},
		// 每帧状态机更新
		update: function (dt) {
			for (var i = 0; i < this.numSuspended; i ++) {
				this.stateArray[this.suspendedArray[i]].suspended(dt);
			}

			if (this.currentState != FSM.kNoState) {
				this.stateArray[this.currentState].update(dt);
				// update 之后再判断transition
				if (this.currentState != FSM.kNoState) {
					this.stateArray[this.currentState].transition();
				}
			}
		},
		// 发出消息
		message: function (msg) {
			this.currentState != FSM.kNoState && this.stateArray[this.currentState].message(msg);	 
		},
		// 消息挂起
		messageSuspended: function (msg) {
			for (var i = 0; i < this.numSuspended; i ++) {
				this.stateArray[this.suspendedArray[i]].message(msg);
			}				  
		},
		// 改变状态,根据一个判断来决定是否改变状态进入下一个状态
		// 返回boolean值表示尝试改变是否成功
		tryChangeState: function (condition, toState, msg, reEnter, suspendedCurrent) {
			if (reEnter == undefined) { reEnter = true } //重进当前状态
			if (suspendedCurrent == undefined) { suspendedCurrent = true }
			if (toState == FSM.kNextState) { toState = this.currentState + 1 }

			if (condition 
				&& (toState != this.currentState || reEnter)) { console.log(toState)
				this.setState(toState, msg, suspendedCurrent);
				return true;
			}

			return false;
		},
		// 设置状态
		setState: function (state, msg, suspendedCurrent) {
			if (state = FSM.kNextState) {
				state = this.currentState + 1;
			}

			if (state == FSM.kNoState) {
				// 当前挂起的状态全部推出
				for ( ; this.numSuspended > 0; this.numSuspended --) {
					this.stateArray[this.suspendedArray[this.numSuspended - 1]].leave();
					this.stateArray[this.suspendedArray[this.numSuspended - 1]].isSuspended = false;
				}
				// 等待中的状态也全部终止
				for ( ; this.numPreloaded > 0; this.numPreloaded --) {
					this.stateArray[this.preloadedArray[this.numPreloaded - 1]].cancelPreload();
				}
			} else {
				if (suspendedCurrent) { // 需要挂起当前的状态
					this.stateArray[this.currentState].suspended();
					this.stateArray[this.currentState].isSuspended = true;
					this.suspendedArray[this.numSuspended ++] = this.currentState;
				} else {
					// 推出当前状态，进入指定状态
					if (this.currentState != FSM.kNoState) {
						this.stateArray[this.currentState].leave();
					}
					// 如果指定状态并没有挂起的话，需要把所有挂起的状态退出
					if (!this.stateArray[state].isSuspended) {
						for ( ; this.numSuspended > 0; this.numSuspended --) {
							this.stateArray[this.suspendedArray[this.numSuspended - 1]].leave();
							this.stateArray[this.suspendedArray[this.numSuspended - 1]].isSuspended = false;
						}
					}
				}
			}

			// 处理等待中的状态，如果不是指定状态，都取消
			for (var p = 0; p < this.numPreloaded; p++) {
				this.preloadedArray[p] != state && this.stateArray[this.preloadedArray[p]].cancelPreload();
			}
			this.numPreloaded = 0;
			// 从当前状态到指定状态
			this.onStateChange != undefined && this.onStateChange(this.currentState, state, msg);

			var lastState = this.currentState;
			this.currentState = state;

			if (this.currentState != FSM.kNoState) {
				if (this.stateArray[this.currentState].isSuspended) {
					// 状态转变后，如果状态是挂起的，不能是最后一个
					this.stateArray[this.currentState].resume(msg, lastState);
					this.stateArray[this.currentState].isSuspended = false;
					-- this.numSuspended;
				} else {
					// 进入指定状态
					this.stateArray[this.currentState].enter(msg, lastState);
				}
			}
		},
		// 获取当前状态
		getCurrentState: function () {
			if (this.currentState == FSM.kNoState) return null;
			return this.stateArray[this.currentState];
		},
		preload: function (state) {
			this.preloadedArray[this.numPreloaded ++] = state;		 
		},
		isSuspended: function (state) {
			return this.stateArray[state].isSuspended;			 
		}
	
	}).statics({
		kNoState : -1, // 默认初始化状态码
		kNextState: -2 // 默认进入下一个状态的状态码
	});

	/**
	 * app 的 FSM
	 * 添加一些简单的交互处理
	 */
	var AppFSM = FSM.extend().methods({
		draw: function (render) {
			// 如果状态类支持 draw，调用draw来绘制相关内容
			for (var i = 0; i < this.numSuspended; i ++) {
				this.stateArray[this.suspendedArray[i]].draw(render);
			}
			var s = this.getCurrentState();
			!!s && s.draw(render);
		},
		onMouse: function (x, y, left, leftPressed) {
			// 鼠标事件
			var s = this.getCurrentState();
			!!s && s.onMouse(x, y, left, leftPressed);
		}
	})

	this.FSM = FSM;
	this.AppFSM = AppFSM;
	Laro.extend(this);
		
})
