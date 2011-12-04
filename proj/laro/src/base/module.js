
(function (win, undefined) {
    
    var toString = Object.prototype.toString,
        nativeIsArray = Array.isArray,
        _ = {};
        
    _.isArray = nativeIsArray || function (o) {
        return toString.call(o) === '[object Array]';
	}
    _.isString = function (o) {
		return !!(o === '' || (o && o.charCodeAt && o.substr));	
	}
	/**
	 * Method 判断是否为Object
	 * {}, [] , function(){}  都会返回true
	 */
	_.isObject = function (o) {
		return o === Object(o);
	}

    /**
     * Method 使用模块的主函数
     * @param (String or Array) 要使用的模块名
     * @param (Function) *optional 加载模块后的回调函数
     * @param (Object) *optional 回调绑定对象
     * @return undefined
     * xhr同步的方式由于http请求，暂不能支持跨域模块loader
     * 默认register为异步
    **/ 
    var _module = function (moduleName, callback, context) {
        var argIndex=-1;
        
        // private method 监测moduleName,如果是url(http://*)路径形式，register后load
            function checkURL(src) {
                var dsrc = src;
                if (src && src.substring(0, 4) == "url(") {
                    dsrc = src.substring(4, src.length - 1);
                }
                var r = _module.registered[dsrc];
                return (!r && (!_module.__checkURLs || !_module.__checkURLs[dsrc]) && src && src.length > 4 && src.substring(0, 4) == "url(");
            }
            
        // 并发调用的模块列表
        var moduleNames = new Array();
        
        if (_.isArray(moduleName)) {
            var _moduleNames = moduleName;
            for (var s=0;s<_moduleNames.length; s++) {
                if (_module.registered[_moduleNames[s]] || checkURL(_moduleNames[s])) {
                    moduleNames.push(_moduleNames[s]);
                }
            }
            moduleName = moduleNames[0];
            argIndex = 1;
        } else {
            while (typeof(arguments[++argIndex]) == "string") {
                if (_module.registered[moduleName] || checkURL(moduleName)) {
                    moduleNames.push(arguments[argIndex]);
                }
            }
        }
        callback = arguments[argIndex];
        context = arguments[++argIndex];
        
        if (moduleNames.length > 1) {
            var cb = callback;
            callback = function() {
                _module(moduleNames, cb, context);
            }
        }
        
        // 已经register过的模块hash
        var reg = _module.registered[moduleName];
        // 处理直接使用url的情况
        if (!_module.__checkURLs) _module.__checkURLs = {};
        if (checkURL(moduleName) && moduleName.substring(0, 4) == "url(") {
            moduleName = moduleName.substring(4, moduleName.length - 1);
            if (!_module.__checkURLs[moduleName]) {
                moduleNames[0] = moduleName;
                _module.register(moduleName, moduleName);
                reg = _module.registered[moduleName];
                var callbackQueue = _module.prototype.getCallbackQueue(moduleName);
                var cbitem = new _module.prototype.curCallBack(function() {
                    _module.__checkURLs[moduleName] = true;
                });
                callbackQueue.push(cbitem);
                callbackQueue.push(new _module.prototype.curCallBack(callback, context));
                callback = undefined;
                context = undefined;
            }
        }
        
        if (reg) {
            // 先处理被依赖的模块
            for (var r=reg.requirements.length-1; r>=0; r--) {
                if (_module.registered[reg.requirements[r].name]) {
                    _module(reg.requirements[r].name, function() {
                        _module(moduleName, callback, context); 
                    }, context);
                    return;
                }
            }

            // load每个模块
            for (var u=0; u<reg.urls.length; u++) {
                if (u == reg.urls.length - 1) {
                    if (callback) {
                        _module.load(reg.name, reg.urls[u], reg.isAsyn, reg.asyncWait, new _module.prototype.curCallBack(callback, context));
                    } else { 
                        _module.load(reg.name, reg.urls[u], reg.isAsyn, reg.asyncWait);
                    }
                } else {
                    _module.load(reg.name, reg.urls[u], reg.isAsyn, reg.asyncWait);
                }
            }
            
        } else {
            !!callback && callback.call(context);
        }
    }
        
    _module.prototype = {

        /**
         * Method 模块注册
         * @param (String or Object) 注册的模块名或者对象字面量
         * @param (Number) *optional 异步等待时间
         * @param (String or Array) 注册模块对应的url地址
         * @return (Object) 注册模块的相关信息对象字面量
        **/
        register : function(name, isAsyn, asyncWait, urls) {
            var reg;
            if (_.isObject(name)) {
                reg = name;
                reg = new _module.prototype.__register(reg.name, reg.isAsyn, reg.asyncWait, urls);
            } else {
                reg = new _module.prototype.__register(name, isAsyn, asyncWait, urls);
            }
            if (!_module.registered) _module.registered = { };
            if (_module.registered[name] && window.console) {
                window.console.log("Warning: Module named \"" + name + "\" was already registered, Overwritten!!!");
            }
            _module.registered[name] = reg;
            return reg;
        },
        // -- 注册模块的行动函数，并提供链式调用
        __register : function(_name, _isAsyn, _asyncWait, _urls) {
            this.name = _name;
            var a=0;
            var arg = arguments[++a];
            
            if (arg && typeof arg == 'boolean') {
                this.isAsyn = arg;
                arg = arguments[++a];
            } else {
                this.isAsyn = true;
            }
            
            if (arg && typeof(arg) == "number") { 
                this.asyncWait = _asyncWait; 
            } else { 
                this.asyncWait = 0; 
            }
            
            this.urls = new Array();
            if (arg && arg.length && typeof(arg) != "string") {
                this.urls = arg;
            } else {
                for (a=a; a<arguments.length; a++) {
                    if (arguments[a] && typeof(arguments[a]) == "string") this.urls.push(arguments[a]);
                }
            }
            // 依赖列表
            this.requirements = new Array();
            
            this.require = function(resourceName) {
                var reqM = [];
                if (Object.prototype.toString.call(resourceName) == '[object Array]' && !!resourceName.length) {
                    reqM = resourceName;
                } else {
                    reqM = Array.prototype.slice.call(arguments, 0);
                }
                for (var i = 0; i < reqM.length; i ++) {
                    this.requirements.push({ name : reqM[i] })
                }

                return this;
            }
            this.register = function(name, isAsyn, asyncWait, urls) {
                return _module.register(name, isAsyn, asyncWait, urls);
            }
            return this;
        },

        defaultAsyncTime: 10,
        
        // -- 处理加载模块逻辑
        load: function(moduleName, scriptUrl, isAsyn, asyncWait, cb) {
            if (asyncWait == undefined) asyncWait = _module.defaultAsyncTime;
            
            if (!_module.loadedscripts) _module.loadedscripts = new Array();

             var callbackQueue = _module.prototype.getCallbackQueue(scriptUrl);
             callbackQueue.push(new _module.prototype.curCallBack( function() {
                 _module.loadedscripts.push(_module.registered[moduleName]);
                 _module.registered[moduleName] = undefined;
             }, null));
             if (cb) {
                 callbackQueue.push(cb);
                 if (callbackQueue.length > 2) return;
             }
             
             if (isAsyn) {
                _module.asynLoadScript(moduleName, scriptUrl, asyncWait, callbackQueue);
             } else {
                _module.xhrLoadScript(moduleName, scriptUrl, callbackQueue);
             }
        }, 
        
        xhrLoadScript: function (moduleName, scriptUrl, callbackQueue) {
            var xhr;
            if (window.XMLHttpRequest)
				xhr = new XMLHttpRequest();
			else if (window.ActiveXObject) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP"); 
			}
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    _module.injectScript(xhr.responseText, moduleName);
					_module.loadProgressCallback && _module.loadProgressCallback(moduleName, scriptUrl);
                    if (callbackQueue) {
                        for (var q=0; q<callbackQueue.length; q++) {
                            callbackQueue[q].runCallback();
                        }
                    }
                    _module.__callbackQueue[scriptUrl] = undefined;
                }
            }
            
            if (callbackQueue.length > 1) {
                xhr.open("GET", scriptUrl, true);
            } else {
                xhr.open("GET", scriptUrl, false);
            }
            xhr.send(null);
        },
        
        // -- 加载模块行动函数
        asynLoadScript : function(moduleName, scriptUrl, asyncWait, callbackQueue) {
            var scriptNode = _module.prototype.createScriptNode();
            scriptNode.setAttribute("src", scriptUrl);
            if (callbackQueue) {
                // 执行callback队列
                var execQueue = function() {
                    _module.__callbackQueue[scriptUrl] = undefined;
                    for (var q=0; q<callbackQueue.length; q++) {
                        callbackQueue[q].runCallback();
                    }
                    // 重置callback队列
                    callbackQueue = new Array(); 
                }
                scriptNode.onload = scriptNode.onreadystatechange = function() {
                    if ((!scriptNode.readyState) || scriptNode.readyState == "loaded" || scriptNode.readyState == "complete" || scriptNode.readyState == 4 && scriptNode.status == 200) {
                        asyncWait > 0 ? setTimeout(execQueue, asyncWait) : execQueue();
                    }
                };
            }
            var headNode = document.getElementsByTagName("head")[0];
            headNode.appendChild(scriptNode);
			
			_module.loadProgressCallback && _module.loadProgressCallback(moduleName, scriptUrl);
        },    
        
        // -- 执行当前 callback
        curCallBack : function(_callback, _context) {
            this.callback = _callback;
            this.context = _context;
            this.runCallback = function() {
                !!this.callback && (!!this.context ? this.callback.call(this.context) : this.callback());
            };
        },
        // -- 获取callback列表
        getCallbackQueue: function(scriptUrl) {
            if (!_module.__callbackQueue) _module.__callbackQueue = {};    
             var callbackQueue = _module.__callbackQueue[scriptUrl];        
             if (!callbackQueue) callbackQueue = _module.__callbackQueue[scriptUrl] = new Array();
             return callbackQueue;
        },
        
        createScriptNode : function() {
            var scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("language", "Javascript");
            return scriptNode;    
        },
        injectScript: function (scriptText, scriptName) {
            var scriptNode = _module.prototype.createScriptNode();
            try {
                scriptNode.setAttribute("name", scriptName);
            } catch (err) { }
            scriptNode.text = scriptText;
            var headNode = document.getElementsByTagName("head")[0];
            headNode.appendChild(scriptNode);
        }
        
    }
    // 提供静态方法
    _module.register = _module.prototype.register;
    _module.load = _module.prototype.load;
    _module.defaultAsyncTime = _module.prototype.defaultAsyncTime;
    _module.asynLoadScript = _module.prototype.asynLoadScript;
    _module.xhrLoadScript = _module.prototype.xhrLoadScript;
    
    /**
     * 模块并发（确认并发模块间没有依赖关系）。可以代替如下：
     * Laro.module('a');
     * Laro.module('b');
     * --> Laro.multiModule('a','b') or Leta.multiModule(['a', 'b'])
     * 本方法暂只提供“组回调”，每个并发模块也有回调的请分开写
     * 
     */
    var multiModule = function (moduleNames, cb, context) {
        var argInd = -1,
			loadSuccNum = 0,
            moduleArr = [];
       	if (_.isArray(moduleNames)) {
			moduleArr = moduleNames;
		} else {
			while (_.isString(arguments[++argInd])) {
				moduleArr.push(arguments[argInd]);
			}
			cb = arguments[argInd];
			context = arguments[++argInd];
		}
        for (var i=0, l=moduleArr.length; i < l; i++) {
			_module(moduleArr[i], function () {
						loadSuccNum ++;
						//alert(loadSuccNum);
						if (loadSuccNum == moduleArr.length) {
							!!cb && cb.call(context);							
						}
					})
		}
    }
    
    
    Laro.extend({
        module: _module,
        use: _module,
        multiModule: multiModule
    })

})(window)