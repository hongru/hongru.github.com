/**
 * state for fsm
 */

Laro.register('.game', function (La) {

    var Class = La.Class || La.base.Class,
        toType = La.toType;

    // 以下state类的方法 都需要 子类重写后调用。
    var BaseState = Class(function (host, fsm, id) {
        if (host == undefined || toType(host) != 'object') return;
        this.host = host;
        this.fsm = fsm;
        this.stateId = id;
        this.isSuspended = false;

    }).methods({
        enter: function (msg, fromState) { console.warn('no enter') },
        leave: function () { console.warn('no leave') },
        update: function (dt) { console.warn('no update') },
        suspended: function (dt) { console.warn('no suspended') },
        message: function (msg) { console.warn('no message')},
        suspend: function () { console.warn('no suspend') },
        resume: function (msg, fromState) { console.warn('no resume') },
        preload: function () { console.warn('no preload') },
        cancelPreload: function () { console.warn('no cancelPreload') },
        transition: function () { return false }

    });

    /**
     * SimpleState
     */
    var SimpleState = BaseState.extend(function (id, enterFn, leaveFn, updateFn) {
        this.stateId = id;
        var emptyFn = function () {};
        this.isSuspended = false;

        this.enter = enterFn != null ? enterFn : emptyFn;
        this.leave = leaveFn != null ? leaveFn : emptyFn;
        this.update = updateFn != null ? updateFn : emptyFn;
    });

    this.BaseState = BaseState;
    this.SimpleState = SimpleState;

})
