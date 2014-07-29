/* global lib */

;(function (global) {
    var exports = {};
    var api;

    if (!global) {
        return;
    }

    if (global.WindVane && global.WindVane.api) {
        api = global.WindVane.api;
    }

    /**
     * 按下按钮的后端交互
     * {
     *     <number> res: 1 | 0 // 1表示成功，0表示失败
     * }
     * 
     * @param  {Function} done 回调函数
     */
    function start(done) {
        if (typeof done === 'function') {
            done(null, {});
        }
        return;

        global.base.getGeolocation(function (err, data) {
            global.debugDom.innerHTML = (err || '') + JSON.stringify(data);

            function finish(result) {
                // ui.guide.html = 'end: ' + JSON.stringify(arguments[0]);

                if (typeof done === 'function') {
                    done(null, result);
                }
            }

            function sent() {
                api.server.send(finish, finish, {
                    api: 'mtop.msp.activity.dt.jointBidding',
                    v: '1.0',
                    ecode: '1',
                    param: {
                        command: 'press',
                        latitude: data.latitude || '',
                        longitude: data.longitude || ''
                    }
                });
            }

            if (api) {

                api.base.plusUT(sent, sent, {
                    eid: '9199',
                    a1: 'nque1',
                    a2: 'game',
                    a3: 'start'
                });

                return;
            }
        }, 3000);
    }

    /**
     * 松开按钮的后端交互
     * {
     *     <number> res: 1 | 0 // 1表示成功，0表示失败
     * }
     * 
     * @param  {Function} done 回调函数
     */
    function end(done) {
        if (typeof done === 'function') {
            done(null, {});
        }
        return;

        function finish(result) {
            // ui.guide.html = 'check: ' + JSON.stringify(arguments[0]);

            if (typeof done === 'function') {
                done(null, result);
            }
        }

        function sent(e) {
            e;

            api.server.send(finish, finish, {
                api: 'mtop.msp.activity.dt.jointBidding',
                v: '1.0',
                ecode: '1',
                param: {
                    command: 'unlink'
                }
            });
        }

        if (api) {

            api.base.plusUT(sent, sent, {
                eid: '9199',
                a1: 'nque1',
                a2: 'game',
                a3: 'end'
            });

            return;
        }
    }

    /**
     * 轮训检查状态的后端交互
     * {
     *     <number> leftTime // 倒计时的时候才有这个字段
     *     <number> res: 1 | 0 // 1表示正常，0表示异常
     *     <number> status // 1表示等待、2表示倒计时、3表示正在开奖、4表示已经开奖
     *     <object> allUser: [{
     *         <string> userNick // 昵称
     *         <number> award // 奖品编号
     *         <string> desc // 奖品描述
     *         <string> icon // 用户头像地址
     *     }]
     *     <string> userNick // 自己的昵称
     * }
     * 
     * @param  {Function} done 回调函数
     */
    function check(done) {
        // DEBUG: sorts of status
        var TESTING_RESULT = {data: {status: 4, leftTime: 7, allUser: [
            // {userNick: 'yanxu0001'},
            // {userNick: 'yanxu0002'}

            {userNick: 'zhuzitest601', award: 0, desc: '未中奖'},
            {userNick: 'jianghu02', award: 1, desc: '1212元红包'},
            {userNick: 'Myself', award: 0, desc: '未中奖文<br>案在此！'},

            {userNick: 'xianweng19', award: 3, desc: '购物车全免'},
            {userNick: 'xianweng12', award: 1, desc: '宝贝免单'},

            {userNick: 'zhuzitest555', award: 0, desc: '太遗憾了，您未中奖，人品太差啦啦啦 :-('},
            {userNick: 'zhuzitest602', award: 2, desc: '宝贝免单'}
        ]}};

        if (typeof done === 'function') {
            done(null, TESTING_RESULT.data);
        }
        return;

        function finish(result) {
            try {
                if (parseInt(result.data.res, 10) === 0) {
                    global.debugDom.innerHTML = JSON.stringify(result);
                }
                else {
                    result.data.status;
                    result.data.leftTime;
                    result.data.allUser.length;
                }
                // DEBUG: jump to exception to debug
                // a.b;
            }
            catch (e) {
                result = {data: {res: 0, error: true}};

                // DEBUG: use testing result
                // result = TESTING_RESULT;

                global.debugDom.innerHTML = (JSON.stringify(result));
            }

            if (typeof done === 'function') {
                done(null, result.data);
            }
        }

        function sent() {

            api.server.send(finish, finish, {
                api: 'mtop.msp.activity.dt.checkBidding',
                v: '1.0',
                ecode: '1',
                param: {}
            });
        }

        if (api) {

            api.base.plusUT(sent, sent, {
                eid: '9199',
                a1: 'nque1',
                a2: 'game',
                a3: 'check'
            });
            return;
        }
    }

    /**
     * 获得当前用户的头像，并将其尺寸改为40像素
     * 
     * @param  {Function} done 回调函数
     */
    function getAvatar(done) {
        if (typeof done === 'function') {
            done(null, '');
        }
        return;

        lib.mtop.request(
            {
                api: 'com.taobao.client.user.getUserInfo',
                v: '1.0',
                data: {}
            },
            function (result) {
                var icon;

                if (!result || !result.data || !result.data.logo) {
                    done(null, '');
                    return;
                }
                
                icon = result.data.logo;

                if (icon) {
                    icon = icon.replace(/(width|height)\=160/ig, '$1=40');
                    done(null, icon);
                }
            },
            function () {
                done(null, '');
                return;
            }
        );
    }

    /**
     * 确定当前购物车的状态，是否可以参加游戏
     * 
     * @param  {Function} done 回调函数
     */
    function checkCart(done) {
        if (typeof done === 'function') {
            done(null, 1);
        }
        return;

        function finish(result) {

            if (typeof done === 'function') {

                if (!result || !result.data || !result.data.result) {
                    done(null, null);
                    return;
                }

                done(null, result.data.result);
            }

        }

        function sent(e) {
            e;

            api.server.send(finish, finish, {
                api: 'mtop.trade.act.canAttendAct',
                v: '1.0',
                ecode: '1',
                param: {}
            });
        }

        if (api) {

            api.base.plusUT(sent, sent, {
                eid: '9199',
                a1: 'nque1',
                a2: 'game',
                a3: 'canattendact'
            });

            return;
        }
    }

    exports.check = check;
    exports.start = start;
    exports.end = end;
    exports.getAvatar = getAvatar;
    exports.checkCart = checkCart;

    global.remoteApi = exports;
})(this);