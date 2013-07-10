var pin = pin || {};

pin.g_config = {};

pin.ns = function (name, fn) {
        var names = name.split('.'),
            i = -1,
            loopName = window;

        if (names[0] == '') {names[0] = 'pin'}

        while (names[++ i]) {
            if (loopName[names[i]] === undefined) {
                loopName[names[i]] = {};
            }
            loopName = loopName[names[i]]
        }

        !!fn && fn.call(loopName, pin);

    }
