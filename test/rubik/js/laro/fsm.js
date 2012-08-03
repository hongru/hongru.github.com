/** 
 * Laro (Game Engine Based on Canvas) 
 * Code licensed under the MIT License:
 *
 * @fileOverview Laro
 * @version 1.0
 * @author  Hongru
 * @description 
 * 
 */

/**
 * FSM 有限状态机
 * @description
 */ 

Laro.register('.game', function (La) {

    var Class = La.Class || La.base.Class,
        SimpleState = La.SimpleState || La.game.SimpleState,
        BaseState = La.BaseState || La.game.BaseState;
   /**
     * FSM (状态机)类
     * @class 
     * @name FSM
     * @memberOf Laro
     * 
     * @param {Object} host: 状态机context（状态宿主）
     * @param {Array} states: 状态列表
     * @param {Function} onStateChange: 状态改变触发事件

     * @return FSM 实例
     */
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
    /**
     * @lends Laro.FSM.prototype
     */

        /**
         * 进入某一个state
         * @param {String} startState: 状态名
         * @param {String} message: 进入状态的传递消息
         */
        enter: function (startState, message) {
            this.setState(startState, message);
        },

        /**
         * 退出state，回到初始化状态

         */
        leave: function () {
            this.setState(FSM.kNoState);
        },

        /**
         * 每帧状态机更新
         * @param {Number} dt: 主循环时间间隔
         */
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
        /**
         * 基于当前状态发出消息
         * @param {String} msg: 消息
         */
        message: function (msg) {
            this.currentState != FSM.kNoState && this.stateArray[this.currentState].message(msg);	 
        },
        /**
         * 挂起某条消息
         * @param {String} msg: 消息
         */
        messageSuspended: function (msg) {
            for (var i = 0; i < this.numSuspended; i ++) {
                this.stateArray[this.suspendedArray[i]].message(msg);
            }				  
        },
        /**
         * 尝试改变状态,根据一个判断来决定是否改变状态进入下一个状态
         * @param {Boolean} condition: 是否改变状态的条件
         * @param {String} toState: 目标状态的状态名
         * @param {String} msg: 进入目标状态的消息
         * @param {Boolean} reEnter: 是否可以重新进入当前状态
         * @param {Boolean} suspendedCurrent: 是否挂起当前状态
         * @return {Boolean} 尝试改变状态是否成功
         */
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
        /**
         * 设置状态
         * @param {String} state: 目标状态的状态名
         * @param {String} msg: 进入目标状态的消息
         * @param {Boolean} suspendedCurrent: 是否挂起当前状态
         */
        setState: function (state, msg, suspendedCurrent) {
            if (state == FSM.kNextState) {
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

        /**
         * 获取当前状态
         * @return {Object} 当前状态的实例对象
         */
        getCurrentState: function () {
            if (this.currentState == FSM.kNoState) return null;
            return this.stateArray[this.currentState];
        },
        /**
         * 预载入状态
         * @param {String} 状态名
         */
        preload: function (state) {
            this.preloadedArray[this.numPreloaded ++] = state;		 
        },
        /**
         * 判断状态是否挂起
         * @param {String} 状态名
         * @return {Boolean} 是否挂起
         */
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
     * AppFSM 类
     * @class 
     * @name AppFSM
     * @memberOf Laro
     * @extends Laro.FSM
     * 

     * @return AppFSM 实例
     */
    var AppFSM = FSM.extend(function () {
        this._STRING2NUM = {};
    }).methods({
    /**
     * @lends Laro.AppFSM.prototype
     */

        /**
         * 状态机派发draw方法
         * @param {Object} render: 渲染实例
         */
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
        },
        /**
         * 添加一个状态到当前状态机
         */
        addState: function (name, sClass) {
            var oldLen = this.stateArray.length;
            if (!sClass instanceof Laro.BaseState) {
                console.error('不能添加一个非状态类');
                return false;
            }
            this.stateArray[oldLen] = new sClass(this.host, this, oldLen);
            this._STRING2NUM[String(name)] = oldLen;
            return sClass;
        },

        /**
         * 打包多个状态为一个新状态，并添加到状态列表
         * 进入这个新状态时会同时触发组成这个状态的子状态的所有enter事件，其他的事件亦是如此次
         * @param name {String} :新状态的名字
         * @param slist {Array} : 组成新状态的所有子状态ind或者name
         * @return {Class} 新状态Class
         */
        packageState: function (name, slist, sClass) {
            var _this = this,
                oldLen = this.stateArray.length,
                ins = (sClass && sClass instanceof Laro.BaseState) ? new sClass(this.host, this, oldLen) : null;

            function exec (method, args) {
                for (var i = 0; i < slist.length; i ++) {
                    var ind = typeof slist[i] == 'number' ? slist[i] : _this._STRING2NUM[slist[i]];
                    _this.stateArray[ind][method] && _this.stateArray[ind][method].apply(_this.stateArray[ind], args);

                }

                ins && ins[method] && ins[method].apply(ins, args);
            }

            var newState = Laro.BaseState.extend(function () {

            }).methods({
                enter: function (msg, from) {
                    exec('enter', arguments);
                },
                leave: function () {
                    exec('leave', arguments);
                },
                update: function (dt) {
                    exec('update', arguments);
                },
                suspended: function (dt) {
                    exec('suspended', arguments);
                },
                message: function (msg) {
                    exec('message', arguments);
                },
                suspend: function () {
                    exec('suspend', arguments);
                },
                resume: function () {
                    exec('resume', arguments);
                },
                preload: function () {
                    exec('preload', arguments);
                },
                cancelPreload: function () {
                    exec('cancelPreload', arguments);
                },
                transition: function () {
                    exec('transition', arguments);
                }

            });

            this.addState(name, newState);

            return newState;
        },

        /**
         * 重写setState，让其可以兼容正常的 num 类型的id 和 string类型的名字
         */
        setState: function (stateid, msg, suspendedCurrent) {

            if (typeof stateid == 'string') {
                stateid = this._STRING2NUM[stateid];
            }
            if (typeof stateid != 'number') {
                console.error('找不到要跳转的state');
                return;
            }
            return this.supr(stateid, msg, suspendedCurrent);
        }

    })

    this.FSM = FSM;
    this.AppFSM = AppFSM;
    Laro.extend(this);

});
