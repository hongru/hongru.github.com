/* global ui, remoteApi, lib, location, $ */

;(function (global) {
    var exports = {};

    if (!global) {
        return;
    }

    var STATUS_EXIT = -1;
    var STATUS_ENTRANCE = 1;
    var STATUS_TIPS = 2;
    var STATUS_LOGIN = 3;
    var STATUS_MAIN = 4;
    var STATUS_WAITING = 5;
    var STATUS_COUNTDOWN = 6;
    var STATUS_RESULT = 7;

    var status;

    var userInfo;

    var currentRequestId = 1;

    var waitingGuideTimer;
    var planetZoomTimer;

    function showMain() {
        // 状态复原：星球、星云、头像、进度
        ui.userNum.number = 1;
        ui.avatars.setUsers([]);
        ui.avatars.me = userInfo;
        ui.avatars.scene = 'main';
        ui.progress.percent = NaN;
        ui.result.display = false;
        ui.dashboard.display = true;
        ui.stars.display(true);
        ui.stars.move(false);
        ui.stars.acce(false);

        // 按钮可点击
        ui.btnStart.disabled = false;

        // 游戏状态相关：
        // 文字设为游戏规则介绍
        // LOGO显示
        // 星球消失
        // 倒计时消失
        // 顶栏显示
        // 星云重置
        ui.guide.html = ui.guide.HTML_MAIN;
        ui.guide.display = true;
        ui.logo.display = true;
        ui.planet.zooming = false;
        ui.countdown.text = '';
        ui.btnHelp.display = true;
        // ui.cloudEffect.display = true;
        // ui.cloudEffect.flying = false;

        clearTimeout(planetZoomTimer);
        clearTimeout(waitingGuideTimer);
    }

    /**
     * 数据格式
     * {
     *     me: {nickname, icon, award, desc},
     *     users: [{nickname, icon, award, desc}]
     * }
     */
    function showResult(data) {

        // 提供分享素材：奖品信息
        if (data.me.award > 0) {
            userInfo.award = data.me.desc;
        }
        else {
            userInfo.award = '';
        }

        // 去结果页面
        // 星云停止运行
        // 隐藏仪表盘
        // 按钮不可点击
        ui.avatars.setUsers(data.users, true);
        ui.avatars.me = null;
        ui.avatars.scene = 'result';
        ui.result.setPrize(data.me);
        ui.result.setFriends(data.users);
        ui.result.display = true;
        ui.dashboard.display = false;
        ui.btnStart.disabled = true;
        // ui.cloudEffect.fast = false;
        ui.progress.percent = NaN;
        ui.btnHelp.display = true;
        ui.stars.display(true);
        ui.stars.move(false);
        ui.stars.acce(false);

        // 游戏状态相关：
        // 更新中奖信息(包括头像)
        // 倒计时消失
        // 倒计时提示消失
        // 星球消失
        ui.guide.display = false;
        ui.countdown.text = '';
        ui.planet.disappear();
        // ui.cloudEffect.flying = false;
        // ui.cloudEffect.display = false;

        clearTimeout(planetZoomTimer);
        clearTimeout(waitingGuideTimer);
    }

    function showWaiting() {
        // Logo消失
        // 顶栏消失
        // 文字先消失，3秒之后出现等待提示
        // 星云停止
        // 星球消失
        ui.guide.html = ui.guide.HTML_WAITING;
        ui.guide.display = true;
        ui.logo.display = false;
        ui.btnHelp.display = false;
        // ui.cloudEffect.fast = false;
        // ui.cloudEffect.flying = true;
        ui.planet.zooming = false;
        ui.stars.display(true);
        ui.stars.move(true);
        ui.stars.acce(false);

        clearTimeout(planetZoomTimer);
        clearTimeout(waitingGuideTimer);

        waitingGuideTimer = setTimeout(function () {
            ui.guide.html = ui.guide.HTML_LONG_WAITING;
            ui.guide.display = true;
        }, 5000);
    }

    function showCountdown() {
        // 星云加快
        // 倒计时提示
        // 倒计时
        // 剩最后5秒钟时星球动画开始
        // ui.cloudEffect.fast = true;
        ui.guide.html = ui.guide.HTML_COUNTDOWN;
        ui.stars.display(true);
        ui.stars.move(true);
        ui.stars.acce(true);

        clearTimeout(planetZoomTimer);
        clearTimeout(waitingGuideTimer);

        planetZoomTimer = setTimeout(function () {
            ui.planet.zooming = true;
        }, 5000);
    }

    function doCheck(requestId) {

        if (currentRequestId !== requestId) {
            return;
        }

        if (status !== STATUS_WAITING && status !== STATUS_COUNTDOWN) {
            return;
        }

        // action => check
        remoteApi.check(function (err, data) {

            /**
             * 适配数据
             * < {
             * <     allUser[{userNick, award, desc, icon}],
             * <     status, res, leftTime, userNick
             * < }
             * > {
             * >     me, users[{nickname, award, icon, title, desc, shortDesc}],
             * >     leftTime, percent, result
             * > }
             * 
             * @param  {object} data 原始数据
             * @return {object}      适配后的数据
             */
            function processData(data) {
                var currentUsers = [];
                var currentPercent = 0;
                var me;

                if (parseInt(data.res, 10) === 0) {
                    return {failed: true, error: data.error};
                }

                if (parseInt(data.status, 10) === 4) {
                    // global.debugDom.innerHTML = JSON.stringify(data);
                }

                if (parseInt(data.status, 10) === 1) {
                    currentPercent = 0;
                }
                if (parseInt(data.status, 10) === 2) {
                    currentPercent = (10 - (parseInt(data.leftTime, 10) || 10)) * 10;
                }

                if (data.allUser && data.allUser.forEach) {
                    data.allUser.forEach(function (user) {
                        var u = {
                            nickname: user.userNick,
                            award: parseInt(user.award, 10) || 0,
                            icon: user.icon
                        };

                        if (u.award === 0) {
                            u.title = '未中奖';
                            u.desc = user.desc || '';
                            u.shortDesc = '';
                        }
                        else {
                            u.title = '中奖啦';
                            u.desc = user.desc;
                            if (u.award === 1) {
                                u.shortDesc = '红包';
                            }
                            else if (u.award > 1) {
                                u.shortDesc = '免单';
                            }
                        }

                        if (user.userNick === userInfo.nickname) {
                            me = u;
                            me.icon = userInfo.icon;
                            return;
                        }

                        currentUsers.push(u);
                    });
                }

                return {
                    me: me,
                    users: currentUsers,
                    percent: currentPercent,
                    leftTime: parseInt(data.leftTime, 10) || '',
                    result: parseInt(data.status, 10) === 4
                };
            }

            if (status !== STATUS_WAITING && status !== STATUS_COUNTDOWN) {
                return;
            }

            if (err) {
                // re-check
                setTimeout(function () {
                    doCheck(requestId);
                }, 1000);
                return;
            }

            data = processData(data);

            if (data.failed) {
                if (data.error) {
                    global.location.href = "http://login.waptest.taobao.com/login.htm?redirect_url=" + encodeURIComponent(location.href);
                }
                return;
            }

            if (data.result) {
                // from waiting/countdown to result
                status = STATUS_RESULT;
                showResult(data);
                return;
            }

            if (data.users.length > 0) {
                // from waiting to countdown or stay countdown
                if (status !== STATUS_COUNTDOWN) {
                    // from waiting to countdown
                    status = STATUS_COUNTDOWN;

                    showCountdown();
                }
            }
            else {
                // from countdown to waiting or stay waiting
                if (status !== STATUS_WAITING) {
                    // from countdown to waiting
                    status = STATUS_WAITING;

                    showWaiting();
                }
            }

            ui.avatars.setUsers(data.users);
            ui.userNum.number = data.users.length + 1;
            ui.progress.percent = data.percent;

            if (status === STATUS_COUNTDOWN) {
                ui.countdown.text = data.leftTime;
            }
            else {
                ui.countdown.text = '';
            }

            // re-check
            setTimeout(function () {
                doCheck(requestId);
            }, 1000);
        });
    }

    function doStart() {

        if (status !== STATUS_WAITING) {
            return;
        }

        // 打点
        $.ajax({
            aplus: true,
            apuri: 'click_nque1_play'
        });

        // action => press
        remoteApi.start(function (err, data) {

            if (err) {
                setTimeout(doStart, 3000);
                return;
            }

            if (status !== STATUS_WAITING) {
                return;
            }

            data;

            currentRequestId++;
            doCheck(currentRequestId);
        });
    }


    function back() {
        // from warning to exit
        status = STATUS_EXIT;
        location.href = 'http://h5.m.taobao.com/alone/act/1212/mainbanner.html';
    }


    function start() {

        if (status !== STATUS_MAIN) {
            return;
        }

        // from main to waiting
        status = STATUS_WAITING;

        showWaiting();
        doStart();
    }

    function end() {

        if (status !== STATUS_WAITING && status !== STATUS_COUNTDOWN) {
            return;
        }

        // from waiting/countdown to main
        status = STATUS_MAIN;
        showMain();

        // action => release
        remoteApi.end();
    }


    function retry() {
        // from result to main
        status = STATUS_MAIN;

        showMain();
    }


    function showHelp() {
        ui.help.display = true;
    }

    function hideHelp() {
        ui.help.display = false;
    }

    function go() {
        location.href = 'http://trade.taobao.com/trade/itemlist/list_bought_items.htm';
    }

    function share() {
        var EMPTY_TEXT_LIB = [
            '#1212万万没想到# 早上一起床，我在抽免单，上班挤公交，奋发抽免单，开会被忽略，我去抽免单，加班陪老板，偷闲抽免单！约会烛光下，一笑抽免单！1212手机淘宝，免单联盟，仅此一天！',
            '#1212万万没想到# 不是富二代，不是白富美，从不幻想免费的午餐，只在1212手机淘宝，疯颠这一次，我为“免单联盟”带盐！',
            '#1212万万没想到# 马云大手一挥，1212手机淘宝，乘飞船领免单去！仅此一天！'];
        var AWARD_TEXT = '#1212万万没想到# 人生所有的郁闷，都是因为没中奖！！我刚刚在手机淘宝中了{award}！快来快来，我们一起抛弃郁闷吧！';
        var SHARE_URL = 'http://h5.m.taobao.com/alone/act/1212/nque1banner.html';

        var text = '';

        // 打点
        $.ajax({
            aplus: true,
            apuri: 'click_nque1_share'
        });

        if (userInfo.award) {
            text = AWARD_TEXT.replace(/\{award\}/ig, userInfo.award);
        }
        else {
            text = EMPTY_TEXT_LIB[Math.floor(Math.random() * EMPTY_TEXT_LIB.length)];
        }

        lib.share.openTaobaoAPPNativeShare(
            '', text, SHARE_URL, '',
            function (data) {data;},
            function (data) {data;});
    }


    function init() {
        status = STATUS_ENTRANCE;

        ui.btnHelp.help = showHelp;
        ui.help.back = hideHelp;

        remoteApi.checkCart(function (err, result) {

            global.debugDom.innerHTML = '购物车状态：' + result;

            if (parseInt(result, 10) === 1) {
                // from entrance to main
                status = STATUS_MAIN;

                ui.btnStart.start = start;
                ui.btnStart.end = end;

                ui.result.retry = retry;
                ui.result.go = go;
                ui.result.share = share;

                userInfo = {nickname: lib.login.getNickFromCookie()};
                global.debugDom.innerHTML += '<br>昵称：' + userInfo.nickname;

                remoteApi.getAvatar(function (err, icon) {
                    if (!icon) {
                        return;
                    }
                    userInfo.icon = icon;
                    ui.avatars.me = userInfo;
                });

                showMain();
            }
            else {
                // from entrance to warning
                status = STATUS_TIPS;
                ui.warning.back = back;
                ui.warning.display = true;
            }
        });

    }

    exports.init = init;

    global.ctrl = exports;
})(this);
