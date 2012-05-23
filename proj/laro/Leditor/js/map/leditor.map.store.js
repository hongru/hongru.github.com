/**
 * localStorage
 */

// 用localStorage来保存用户数据，免得编辑一半丢了
Leta.NS('Leditor.map.store', function (L) {
    var pkg = this,
        prefix = 'leditor_map_';
    
    this.set = function (key, con) {
        key = prefix + key;
        con = typeof con == 'string' ? con : JSON.stringify(con);
        localStorage.setItem(key, con);
    };

    this.get = function (key) {
        key = prefix + key;
        var ret = localStorage.getItem(key);
        try {
            ret = JSON.parse(ret);
        } catch(e) {}

        return ret;
    };

    this.remove = function (key) {
        localStorage.removeItem(prefix + key);
    };

    this.clear = function () {
        localStorage.clear();
    };
})
