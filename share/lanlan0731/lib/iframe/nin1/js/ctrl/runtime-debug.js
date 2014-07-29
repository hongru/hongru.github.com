/* global async, ui, ctrl, loadImages, viewport, $ */

;(function (global) {
    var ref;

    function initUI() {
        async.parallel([
                global.load,
                ui.init
            ], function () {
                async.parallel([
                        global.ui.dashboard.init,
                        global.ui.btnStart.init,
                        global.ui.logo.init,
                        global.ui.planet.init,
                        global.ui.progress.init,
                        global.ui.userNum.init,
                        global.ui.btnHelp.init,
                        global.ui.warning.init,
                        global.ui.countdown.init,
                        global.ui.guide.init,
                        global.ui.help.init,
                        global.ui.avatars.init,
                        global.ui.stars.init,
                        global.ui.result.init
                    ], ctrl.init);
            });
    }

    ref = global.base.getURLReferrer();

    if (ref) {
        // 打点
        $.ajax({
            aplus : true,
            apuri : ref
        });
    }

    initUI();
})(this);
