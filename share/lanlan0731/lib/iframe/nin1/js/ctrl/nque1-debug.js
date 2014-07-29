;(function(win, lib, app) {
    lib;
    app;

    /**
     * 页面初始化
     * 1. 如果不是主客，就直接跳到首页
     * 2. 如果没有登录，就调起客户端登录
     */
    function init() {

        // DEBUG: do not detect inTaobaoAPP
        // if (lib.smartbanner.uaInTaobaoApp() || lib.smartbanner.ttidInTaobaoApp()) {
        if (!lib.smartbanner.uaInTaobaoApp()) {
            // window.location.href = 'http://m.taobao.com/';
            // return;
        }

        // DEBUG: do not check login
        // 判断是否已经登录，否则跳转到登录页面
        if (!lib.login.isLogin()) {
            // window.location.href = "http://login.waptest.taobao.com/login.htm?redirect_url=" + encodeURIComponent(location.href);
        }
    }

    init();
})(window, window['lib'] || (window['lib'] = {}), window['app'] || (window['app'] = {}));