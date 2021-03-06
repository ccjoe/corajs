﻿/**
 * @author sfliu
 * Copyright(C) 2015 - 2016, All rights reserved.
 * Date: 2015-09-31
 */
;
(function() {
    var _$ = window.$,
        _Cora = window.Cora;
    //内部全局变量
    var _g = {
            types: ['Boolean', 'Number', 'String', 'Function', 'Object', 'Array', 'Date', 'RegExp', 'Error', 'Undefined', 'Null', 'HTML']
        },
        fn;
    /************************************ Main ***************************************/
    /**
     * 全局对象
     * @namespace
     * @constructs Cora
     * @static
     * @return {Object} 返回的对象即Cora对象，$(selector)[0]指向原生HTMLElement的数组;
     * @desc 选择器 compatibility > ie81
     * @example
     * Cora(selector);
     * $(selector)
     * 其内部实现是依据querySelectorAll与getElementsById,所以selector需要符合其语法。
     * 选择器 $(selector) 的值是Cora对象，包含选择器的结果
     * 选择器 $(selector)[0] 的值是Array，包含选择器的结果
     * 选择器 $(selector)[0][0] 的值是原生 HTML*Element, 是第一个元素
     */
    function Cora(selector) {
        return new fn.init(selector);
    }
    /************************************ Tools ***************************************/
    /**
     * @version Cora.version
     * @method Cora.version
     */
    Cora.version = '1.0.0';

    /**
     * @method Cora.config
     * @property debug 是否开启debug
     */
    Cora.config = {
        debug: true,
        debugLabel: '			<-【Corajs DEBUG】'
    };

    Cora.noop = function noop() {};

    /**
     * 命名冲突时使用此方法
     * @method Cora.noConflict
     * @return {Cora} 返回全局变量
     */
    Cora.noConflict = function() {
        window.$ = _$;
        window.Cora = _Cora;
        return Cora;
    };
    /**------------ type && is{Type} ------------------*/
    /**
     * 判断变量的类型, 判断dom类型时,用querySelectorAll集合为object
     * @method Cora.type
     * @param {type} obj 待检测的变量
     * @return {string} 返回变量的类型
     * @example
     * 返回的类型有：'Boolean', 'Number', 'String', 'Function', 'Object', 'Array', 'Date', 'Regexp', 'Error', 'Undefined', 'Null', HTMLCollection, HTML(TagName)Element
     * Cora.type(NaN)  => number
     */
    Cora.type = function(obj) {
        if (obj === null) return 'Null';
        var tobj = {},
            types = _g.types,
            type = Object.prototype.toString.call(obj);

        for (var i = 0; i < types.length; i++) {
            tobj['[object ' + types[i] + ']'] = types[i];
        }

        if (type in tobj) return tobj[type];
        if (type === '[object Object]') type = obj + '';
        var arr = type.match(/^\[object (HTML\w+)]$/);
        if (arr) return arr[1];
        return 'object';
    };
    /**
     * 判断变量的类型, 判断dom类型时,用querySelectorAll集合为object
     * @method Cora.is[Type]
     * @param {object} eth 待检测的变量
     * @return {boolean} 是否为指定的Type
     * @example
     * 方法列表有：'isBoolean', 'isNumber', 'isString', 'isFunction', 'isArray', 'isDate', 'isRegexp', 'isError', 'isUndefined', isNull, isNaN, isHTML
     */
    for (var gi = 0; gi < _g.types.length; gi++) (function (i) {
        var item = _g.types[i];
        Cora['is' + item] = function (eth) {
            return (Cora.type(eth) === item);
        };
    })(gi);
    Cora.isHTML = function(eth) {
        return (!!~Cora.type(eth).indexOf('HTML'))
    };
    //@warn NaN可以判断类型为 isNumber 与 isNaN;
    Cora.isNaN = function(eth){
        return Cora.isNumber(eth) && isNaN(eth);
    };

	//Array.prototype.slice.call => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Streamlining_cross-browser_behavior
	//Object.keys  => Polyfill From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	(function(){var a=Array.prototype.slice;try{a.call(document.documentElement)}catch(b){Array.prototype.slice=function(h,d){d=(typeof d!=="undefined")?d:this.length;if(Object.prototype.toString.call(this)==="[object Array]"){return a.call(this,h,d)}var f,j=[],e,c=this.length;var k=h||0;k=(k>=0)?k:Math.max(0,c+k);var g=(typeof d=="number")?Math.min(d,c):c;if(d<0){g=c+d}e=g-k;if(e>0){j=new Array(e);if(this.charAt){for(f=0;f<e;f++){j[f]=this.charAt(k+f)}}else{for(f=0;f<e;f++){j[f]=this[k+f]}}}return j}}if(!Object.keys){Object.keys=function(){var c=Object.prototype.hasOwnProperty,f=!({toString:null}).propertyIsEnumerable("toString"),e=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],d=e.length;return function(j){if(typeof j!=="object"&&(typeof j!=="function"||j===null)){throw new TypeError("Object.keys called on non-object")}var h=[],k,g;for(k in j){if(c.call(j,k)){h.push(k)}}if(f){for(g=0;g<d;g++){if(c.call(j,e[g])){h.push(e[g])}}}return h}}}})();
    /**--------------- type && is{Type} ------------------*/
    /**
     * 将类数组对象或单个元素转化为数组
     * @method Cora.toArray
     * @param {array} arrlike 类数组对象
     * @todo ie<9需要支持
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Browser_compatibility
     */
    Cora.toArray = function(arrlike) {
        if(Cora.isArray(arrlike)){
            return arrlike;
        }
        if(!arrlike.length && Cora.isHTML(arrlike)){
            return [arrlike];
        }
        return [].slice.call(arrlike);
    };

    /**--------------- Extend ------------------*/
    /**
     * Copy混合对象
     * @method Cora.merge
     * @param {object} a 待合并的对象
     * @param {object} b 待合并的对象
     * @return {object} 返回合并后的第一个对象
     */
    Cora.merge = function(a, b) {
        var bival;
        for (var i in b) {
            if(b.hasOwnProperty(i)){
                bival = b[i];
                if (bival && Cora.isObject(bival)) {
                    a[i] = a[i] || {};
                    Cora.merge(a[i], bival);
                } else {
                    a[i] = bival;
                }
            }
        }
        return a;
    };
    /**
     * 混合多个对象
     * @method Cora.extend
     * @param {object} 待合并的对象
     * @return {object} 返回变量的类型
     * @todo 是否有性能问题有待验证：问题在于传入多个对象时是采用按前二合并依次往后, 可优化或验证是否从后往前合并更高效
     * 对比 https://github.com/sindresorhus/object-assign相关优化
     */
    Cora.extend = Object.assign || function() {
            var args = Cora.toArray(arguments);
            if (!args.length) {
                return {};
            } else if (args.length === 1) {
                return args[0];
            } else {
                for (var i = 0; i < args.length; i++) {
                    args[0] = Cora.merge(args[0], args[i]);
                }
                return args[0];
            }
        };
    /**--------------- Equal ------------------*/
    /**
     * 判断对象与数组是否相等，内部采取深度递归全等对比
     * @desc 这里认为空对象与空对象，空数组与空数组相等，相同内容的对象与数组相等, NaN与NaN不相等
     * @method Cora.objectEqual
     * @param  a 待对比的对象
     * @param  b 待对比的对象
     * @return {boolean} 返回是否相等
     */
    Cora.objectEqual = function (a, b) {
        //遍历a与b的类型是否相同
        if(Cora.type(a) !== Cora.type(b)){
        	return false;
        }
    	//遍历a与b的长度是否相等
        if(Object.keys(a).length !== Object.keys(b).length){
        	return false;
        }
    	//先遍历b中所有属性与A是否===
    	for (var i in b) {
            if(b.hasOwnProperty(i)) {
                var bival = b[i];
                if (bival && Cora.isObject(bival)) {
                    if (!Cora.objectEqual(a[i], bival)) {
                        return false;
                    }
                } else {
                    if (a[i] != bival) {
                        return false;
                    }
                }
            }
        }
        return !(Cora.isNaN(a) || Cora.isNaN(b));
    };
    /**
     * 判断任意对象是否相等
     * @desc 这里认为空对象与空对象，空数组与空数组相等，相同内容的对象与数组相等, NaN与NaN不相等
     * @method Cora.equal
     * @param  a 待对比的对象
     * @param  b 待对比的对象
     * @return {boolean} 返回是否相等
     */
    Cora.equal = function(a, b){
    	var type = Cora.type(a);
    	switch (type) {   		
            case 'Object':
            case 'Array':
    			return Cora.objectEqual(a, b);
    		    break;
    		default:
    			return a === b;
    			break; 
    	}
    };

    /**--------------- Browse ------------------*/
    /**
     * 探测浏览器类型
     * @method Cora.browse
     * @return {string} 返回浏览器类型字符串
     */
    Cora.browse = function() {
        //var blist = {
        //
        //};
        //return blist;
    };
    /**
     * 判断domReady
     * @method Cora.ready
     * @param {function} func 待检测的变量
     */
    Cora.ready = function(func) {};

    /**--------------- URL Parse ------------------*/
    Cora.url = (function(){
        var re = {
            url: /((http|https):\/\/)?((\w+\.)+\w+)?(:\d+)?((\/\w+)+)?\/?\??((\w+=\w+&?)+)?#?(.+)?/g,
            kv : /(\w+)=([^&#]+)/g,
            search: /([^\?]+)?\??((\w+=\w+&?)+)?/,     //[^\?]+ 除?外所有
            path: /.+((\/\w+)+)?/
        };

        /**
         * 处理键值对字符串为对象,获取url里所有键值对返回
         * @method Cora.url.getParams
         * @param {string} kvp key-value-pairs-string
         * @return {object} 返回键值对对象
         * @example  hashsearch=test; => {hashsearch: test}
         */
        var getParams = function (kvp) {
            if(!kvp) return {};
            var okvp = {},  kvpi; //object key val pairs;
            var kvpArr = encodeURI(kvp).match(re.kv);
            if(!kvpArr || !kvpArr.length) return {};
            kvpArr.forEach(function(i){
                re.kv.lastIndex = 0;
                kvpi = re.kv.exec(i);
                okvp[kvpi[1]] = decodeURI(kvpi[2]);
            });
            return okvp;
        };
        /**
         * 处理hash里 search部分键值对对象
         * @method Cora.url.getHashSearch
         * @param {string} url  string
         * @return {object} 返回hash里的search部分键值对对象
         * @example  #hash/hashpath/123?hashsearch=test; => {hashsearch: test}
         */
        var getHashSearch = function (hash, isParse){
            if(!hash) return isParse ? {} : '';
            var hashSchStr = re.search.exec(hash)[2];
            return isParse ? getParams(hashSchStr) : hashSchStr;
        };

        /**
         * 处理hash里 path部分数组
         * @method Cora.url.getHashPath
         * @param {string} hash hash部分字符串
         * @return {array} 返回hash里的path部分数组
         * @example  #hash/hashpath/123/?hashsearch=test; => [hashpath,123]
         */
        var getHashPath = function (hash, isParse){
            if(!hash) return isParse ? [] : '';
            var hashPathStr = re.path.exec(hash)[0];
            return isParse ? hashPathStr.split('/') : hashPathStr;
        };

        /**
         * 处理url 相关部件解析与 生成
         * @method Cora.url.getUrl
         * @param {string} url 传入url
         * @param {boolean} parse parse为true时返回的各部件为序列化对象，否则为string
         * @return {object} 返回url各部件
         * @example  http://domain.com/pathto/urlpath/123?search=1&param=11/#hash/hashpath/123?hashsearch=test;
         * return value like {
                protocal: {string},   协议
                domain: {string},     域名
                path: {string},       路径
                search: {object},     参数
                hash: {string},       Hash，#后所有
                hashsearch: {object}  Hash里参数
                hashPath: {array}     Hash里数组
            };
         */
        var getUrl  = function (url, isParse){
            re.url.lastIndex = 0;
            var uri = re.url.exec(url);
            var hashfull = uri[10], path = uri[6] || '', search = uri[8] || '';
            //console.log(uri, 'uri');
            return {
                protocal: uri[2],
                domain: uri[3],
                port: uri[5],
                path: isParse ? path.substring(1).split('/') : path,
                search: isParse ? getParams(search) : search,
                hash: hashfull,
                hashPath: getHashPath(hashfull, isParse) ,
                hashsearch: getHashSearch(hashfull, isParse)
            };
        };
        /**
         * 将object 处理为url 相关部件search
         * @method Cora.url.setParam
         * @param {object} obj 将object对象转化为url参数字符串
         * @param {string} equalStr key与value间的相等字符, 默认为 '='
         * @param {string} joinStr key-value key-value间的连接符 默认为 '&'
         * @return {object} search
         */
        var setParams = function (obj, equalStr, joinStr) {
            var paramstr = '', equalStr = equalStr || '=';
            joinStr = joinStr || '&';

            for (var i in obj) {
                paramstr += i + equalStr + obj[i] + joinStr;
            }
            return paramstr.remove('right');
        };
        /**
         * 将object 为url设置新增serach
         * @method Cora.url.set
         * @param {string} url 被操作的url
         * @param {string} kvpOrk object or string key
         * @param {string} value  value
         * @return {object} 设置search的url
         */
        var setUrl = function (url, kvpOrk, value) {
            var kvpair = Cora.isObject(kvpOrk) ? setParams(kvpOrk) : (kvpOrk + '=' + value);
            return url.replace(re.search, function (str, $0, $1) {
                return ($0 ? $0 : '') + '?' + ($1 ? $1 + '&' : '') + kvpair;
            });
        };

        return {
            get: getUrl,
            set: setUrl,
            getParams: getParams,
            setParams: setParams,
            getHashSearch: getHashSearch,
            getHashPath: getHashPath
        };
    })();

    /**--------------- Log Module ------------------*/
    Cora.log = (function($) {
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = window.console || {};

        while (length--) {
            console[methods[length]] = console[methods[length]] || Cora.noop;
        }
        /**
         * 输出Debug信息
         * @method Cora.log
         * @namespace
         * @param {string} output 输出信息的内容
         * @param {Object} opts 其它参数对象
         * @prop opts.type {string}  options 输出信息的类型【error, warning, log】
         * @prop opts.color {string} options 输出信息的颜色
         * @prop opts.size  {string} options small large x-large... 输出信息的大小
         * @prop opts.shadow {boolean}  options true/false 输出信息是否带阴影
         * @prop opts.css  {css} options css key:value pairs输出信息的样式，也可以复写颜色与大小
         * @example
         * $.log("show in console");
         * $.log("show in console", {
         * 	  type: 'warn',
         *    color: 'red',
         *    size: 'large',
         *    shadow: true,
         *	  rainbow: false,
         *    css: "text-shadow: 0 1px 0 #ccc,0 2px 0 #aaa"
         * });
         * 仅支持一次输出一个对象
         */
        var log = function(output, opts) {
            var format = '';
            opts = opts || {};
            var type = opts.type = opts.type || 'log';
            var hasColor = (void 0 !== opts.color);
            if (Cora.isString(output)) {
                format = '%s';
            }
            if (Cora.isObject(output)) {
                format = '%O';
            }

            if (Cora.isNumber(output)) {
                format = '%d';
            }
            if (Cora.isHTML(output)) {
                format = '%o';
            }

            if (!hasColor) {
                switch (type) {
                    case 'info':
                        opts.color = '#999';
                        break;
                    case 'warn':
                        opts.color = 'orange';
                        break;
                    case 'error':
                        opts.color = 'pink';
                }
            }

            opts.size = opts.size || 'normal';
            opts.css = opts.css || '';
            if (opts.rainbow){
                opts.css += 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;';
            }
            if (opts.shadow) {
                opts.css += "text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9;";
            }
            console[type]('%c' + format + '%s', 'color:' + opts.color + '; font-size:' + opts.size + '; ' + opts.css, output,  Cora.config.debugLabel);

        };
        /**
         * 输出Debug分组信息
         * @method Cora.log.group
         * @param {string} name 分组名
         * @param {function} cb 分组的内容
         * @param {boolean} collapsed 是否折叠
         * @todo 暂时不太有意义，因为程序执行在console里，在IE里可能不执行
         */
        log.group = function(name, cb, collapsed) {
            collapsed = collapsed || false;

            console[collapsed ? 'groupCollapsed' : 'group'](name, $.config.debugLabel);
            cb();
            console.groupEnd();
        };
        /**
         * 输出Debug执行时间信息
         * @method Cora.log.time
         * @param {string} name 分组名
         * @param {function} cb 被测试执行时间的对象
         * @param {function} times 执行次数
         */
        log.time = function(name, cb, times) {
            console.time(name);
            if (times) {
                for (var i = 0; i < times; i++) {
                    cb();
                }
            } else {
                cb();
            }
            console.timeEnd(name);
        };
        /**
         * 输出Debug执行时cpu信息, 在chrome profile面板查看相应详情
         * @method Cora.log.cpu
         * @param {string} name profile组名
         * @param {function} cb 被测试执行时间的对象
         * @param {function} times 执行次数
         */
        log.cpu = function(name, cb, times) {
            console.profile(name);
            if (times) {
                for (var i = 0; i < times; i++) {
                    cb();
                }
            } else {
                cb();
            }
            console.profileEnd(name);
        };
        return log;
    })();

    /************************************ Data ***************************************/
    /**
     * data实现节点绑定数据  works in all browsers
     * @namespace Cora.data
     */
    Cora.data = window.WeakMap ? new WeakMap() : (function() {
        var lastId = 0,
            store = {};
        return {
            /**
             * 设置数据 setter
             * @method Cora.data.set
             * @param {object} element 待绑定的元素
             * @param {object} info 待绑定的数据
             */
            set: function(element, info) {
                var id;
                if (element.myCustomDataTag === undefined) {
                    id = lastId++;
                    element.myCustomDataTag = id;
                }
                store[id] = info;
            },

            /**
             * 获取数据 getter
             * @method Cora.data.get
             * @param {object} element 绑定数据的元素
             * @return {object} 返回绑定的数据类型
             */
            get: function(element) {
                return store[element.myCustomDataTag];
            },
            /**
             * 删除数据绑定
             * @method Cora.data.del
             * @param {object} element 绑定数据的元素
             */
            del: function(element){
            	store[element.myCustomDataTag] = void 0;
            }
        };
    }());

    /************************************ Cookie ***************************************/
    /**
     * 实现cookie操作
     * @namespace Cora.cookie
     */
    Cora.cookie = {
    	 /**
         * 按key get
         * @method Cora.cookie.get
         * @param {string} key cookie的名称
         * @return {string} 
         */
    	 get: function(key) {
            var c = document.cookie.split(";");
            for (var i = 0; i < c.length; i++) {
                var citem = c[i].split("=");
                if (key === citem[0].replace(/^\s*|\s*$/, "")) {
                    return decodeURI(citem[1]);
                }
            }
        },
    	 /**
         * 按键与值设置
         * @method Cora.cookie.set
         * @param {string} name cookie的名称
         * @param {string} value cookie的值
         * @param {string} expire cookie的过期时间
         */        
        set: function (name, value, expire) {　
            //var date = new Date(),
            //    endTime = date.getTime() + expire;
            document.cookie = name + "=" + encodeURI(value) + expire;
        },
    	 /**
         * 按键与值设置
         * @method Cora.cookie.del
         * @param {string} name cookie的名称
         */
        del: function (name) {
            var d = new Date();
             d.setTime(d.getTime() - 10000);
            document.cookie = name + "=v; expires=" + d; //.toGMTString()
        }
    };

    /************************************ Array ***************************************/
    /**
     * Array 数组的扩展方法
     * @namespace Array
     * @constructs Array
     * @static
     */
    Cora.extend(Array.prototype, {
        //all brower
    	/** @method Array#forEach */
    	forEach: Array.prototype.forEach || function forEach( callback, thisArg ) {
		    var T, k;
		    if ( this == null ) {
		      throw new TypeError( "this is null or not defined" );
		    }
		    var O = Object(this);
		    var len = O.length >>> 0; // Hack to convert O.length to a UInt32
		    if ( {}.toString.call(callback) !== "[object Function]" ) {
		      throw new TypeError( callback + " is not a function" );
		    }
		    if ( thisArg ) {
		      T = thisArg;
		    }
		    k = 0;
		    while( k < len ) {
		      var kValue;
		      if ( Object.prototype.hasOwnProperty.call(O, k) ) {
		        kValue = O[ k ];
		        callback.call( T, kValue, k, O );
		      }
		      k++;
		    }
		  },
    	//all brower
    	/**
         * 查找元素下标  (只能查找简单类型) 
         * @method Array#indexOf 
         */
    	indexOf : Array.prototype.indexOf || function(valToFind) {
			    var foundIndex = -1;
			    for (var index = 0; index < this.length; index++) {
			        if (this[index] === valToFind) {
			            foundIndex = index;
			            break;
			        }
			    }
			    return foundIndex;
			},
    	/**
         * 过滤元素或对象返回符合条件的数组
         * @method Array#filter
         * @param {function} fun 回调函数
         * @return Array
         */
		filter: Array.prototype.filter || function(fun /*, thisArg */) {
            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;   //无符号右移运算
            if (typeof fun !== "function")
                throw new TypeError();

            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];
                    if (fun.call(thisArg, val, i, t))
                        res.push(val);
                }
            }
            return res;
        },
        /**
         * 查找元素或对象下标  (indexOf升级版  查找任意类型,不包括NaN) 
         * @method Array#indexOfObj 
         * @return {number} 下标
         */
        indexOfObj: function(any){
            var hasIt = -1;
            for(var i=0; i<this.length; i++){
                if(Cora.equal(this[i], any)){
                    hasIt = i;
                    break;
                }
            }
            return hasIt;
        },
        /**
         * 查找是否包含元素或对象  (查找任意类型,不包括NaN) 
         * @method Array#has 
         * @return {boolean} true/false 存在不存在
         */
        has: function(any){
            return this.indexOfObj(any) !== -1;
        },
        //去掉数组中某元素或对象，(下标会变动);
        /**
         * 查找元素或对象下标  (filter升级版  查找任意类型,不包括NaN) 
         * @method Array#remove 
         */
        remove: function(any){
            return this.splice(this.indexOfObj(any),1);
        }
    });

    /************************************ String ***************************************/
    /**
     * String日期的扩展方法
     * @namespace String
     * @constructs String
     * @static
     */
    Cora.extend(String.prototype, {
        /**
         * 字符串去前后去空格
         * @method String#trim
         * @return {string} 返回处理后的字符串
         */
        trim: String.prototype.trim || function() {
            return this.replace(/^\s+|\s+$/g, '');
        },
        /**
         * 字符串去前面去空格
         * @method String#ltrim
         * @return {string} 返回处理后的字符串
         */
        ltrim: String.prototype.trimLeft || function() {
            return this.replace(/^\s+/g, '');
        },
        /**
         * 字符串去后面去空格
         * @method String#rtrim
         * @return {string} 返回处理后的字符串
         */
        rtrim: String.prototype.trimRight || function() {
            return this.replace(/\s+$/g, '');
        },
        /**
         * 字符串去空格,但最少保留一位空格
         * @method String#mtrim
         * @params {boolean} remain1space
         * @return {string} 返回处理后的字符串
         */
        mtrim: function (remain1space) {
            remain1space = remain1space ? ' ' : '';
            return this.replace(/\s+/g, remain1space);
        },
        /**
         * 字符串去字符
         * @method String#remove
         * @param {string} len 当len为非left,right字符串时为指定要去除的字符，为left,right时去掉相应位置的单字符，为数字时去除相应宽度字符
         * @param {number} lr 当len为长度时，lr指定left,还是right去除
         * @return {string} 返回处理后的字符串
         */
        remove: function (len, lr) {
            if (Cora.isString(len) && len !== 'left' && len !== 'right') {
                return this.split(len).join('');
            }
            if (len === 'left') {
                return this.substring(1);
            }
            if (len === 'right') {
                return this.substring(0, this.length - 1);
            }
            len = len || 1;
            lr = lr || 'left';
            return lr === 'left' ? this.substring(len) : this.substring(0, this.length - len);
        },
        /**
         * 字符串补位
         * @method String#pad
         * @param {number} width 补位数
         * @param {string} padstr 补位的字符
         * @param {string} lr left 还是 right补位
         * @default lr 为 left
         * @return {string} 返回处理后的字符串
         */
        pad: function(width, padstr, lr){
            var ellilen = width-this.length;
            if(ellilen<1){
                return this;
            }
            lr = lr || 'left';
            padstr = (padstr === void 0) ? ' ' : String(padstr);

            var padstrlen = padstr.length;
            for(var endstr='',i=0; i<ellilen/padstrlen; i++){
                endstr+=padstr;
            }
            return (lr==='left'?endstr:'') + this + (lr==='right'?endstr:'');
        },
        /**
         * 将一个单词的首字母大写
         * @method String#capit 即capitalize
         * @param {String} lower_others 将其余字符小写
         * @return {string} 返回处理后的字符串
         */
        capitalize: function(lower_others) {
            return this.charAt(0).toUpperCase() + (!lower_others ? this.slice(1) : this.slice(1).toLowerCase());
        },
        /**
         * 将下划线或者中划线字符 转换转换成 camelized
         * @method String#camelize
         * @return {string} 返回处理后的字符串
         * @example '-moz-transform'.camelize() => 'MozTransform'
         */
        camelize: function() {
            return this.trim().replace(/[-_\s]+(.)?/g, function(match, c) {
                return c ? c.toUpperCase() : "";
            });
        },
        /**
         * 将camelized或者中划线转化成下划线
         * @method String#underscored
         * @return {string} 返回处理后的字符串
         * @example 'MozTransform'.underscored() => 'moz_transform'
         */
        underscored: function() {
            return this.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
        },
        /**
         * 将camelized或者下划线转化成中划线
         * @method String#dasherize
         * @return {string} 返回处理后的字符串
         * @example 'MozTransform'.dasherize()=> '-moz-transform'
         */
        dasherize: function() {
            return this.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
        }
    });

    /************************************ Function ***************************************/
    Cora.extend(Function.prototype, {
        bind: Function.prototype.bind || function(a){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")}var e=Array.prototype.slice.call(arguments,1),c=this,d=function(){},b=function(){return c.apply(this instanceof d&&a?this:a||window,e.concat(Array.prototype.slice.call(arguments)))};d.prototype=this.prototype;b.prototype=new d();return b}
    });

    /************************************ Date ***************************************/
    /**
     * Date日期的扩展方法
     * @namespace Date
     * @constructs Date
     */
    /**
     * +y年后的时间
     * @method Date#addYears Date#addMonth Date#addDays Date#addHours Date#addMinutes Date#addSeconds
     * @param {integer} num 需要加上的特定数字
     * @return {Date} 返回加好年份的日期对象
     * 方法列表有：addYears addMonth addDays addHours addMinutes addSeconds
     */
    ['Year', 'Month', 'Days', 'Hours', 'Minutes', 'Seconds'].forEach(function (item) {
    	Date.prototype['add'+item] = function(num){
    		if(item === 'Days') item = 'Date';
    		var td = new Date(+this);
    		td['set'+item](td['get'+ (item==='Year'?'FullYear':item)]()+num);
    		return td;
    	}
    });
    //(new Date()).Format('yy-MM-dd hh-mm-ss -q -S')  "16-05-11 17-07-09 -2(季度) -486(millSecond)"
    Date.prototype.Format = function(fmt){ //author: meizz
      var o = {   
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return fmt;   
    } 

    Cora.extend(Date.prototype, {
        /**
         * 将时长转化为time格式
         * @method Date#countdownFormat
         * @param {Date} endTime 以毫秒计的时长
         * @param {Object} opts 是否显示天与millsecond
         * @return {string} 返回固定格式的字符串
         * @example
         * getFormatTime(3600*1000*23) => "3天 23:00:00"
         */
		countdownFormat: function(endTime, opts) {
			var remainTime = new Date(endTime) - new Date(+this),
				remainDays = Math.floor(remainTime / (3600000 * 24)),
                daystr = remainDays ? remainDays + '天 ' : '',
				ms = remainTime % (3600000 * 24);   //毫秒数

            var h=0, m=0, s=0;     //时分秒
            if(ms >= 1000){
                s = Math.floor(ms / 1000);
                ms = ms % 1000;
                if (s >= 60) {
                    m = Math.floor(s / 60);
                    s = s % 60;
                    if (m >= 60) {
                        h = Math.floor(m / 60);
                        m = m % 60;
                    }
                }
            }
            opts = opts || {};
			return (opts.showDay?daystr:'') +
                    String(h).pad(2,0) + ':' +
                    String(m).pad(2,0) + ':' +
                    String(s).pad(2,0) +
                    (opts.showMillSecond?' '+String(ms).pad(4,0):'');
		}
    });

    /******************************** publisher-subscriber ***********************************/
    /**
     * 简单的发布订阅模式(publisher-subscriber)
     * @class Cora.PS
     * @namespace
     * @exampl
     * Cora.PS.add('pubNO1', function(data){
     *      console.log('创建发布者时订阅的订阅者，接受到的数据是:', data);
     * });
     * function subNo1(data, name){
     *      console.log('subNo1订阅到'+name+'对象，将接受到消息，为：', data);
     * }
     * function subNo2(data, name){
     *      console.log('subFn2订阅到'+name+'对象，将接受到消息，为：', data);
     * }
     * Cora.PS.add('pubNO2');  //新增发布者 pubNO2;
     * subNo1.sub('pubNO1');   //subNo1订阅到 pubNO1
     * subNo2.sub('pubNO1').sub('pubNO2');   //subNo2订阅到 pubNO1
     * Cora.PS.send('pubNO1', {data:123}) //pubNO1发布消息
     * Cora.PS.send('pubNO2', {data:'pubNo2 From!'}) //pubNO1发布消息
     * @done 解决为一个PS对象，管理所有发布订阅对象
     */
    Cora.PS = (function(){
        /**
         * @see Cora.PS
         */
        var PubSub = function(){
            //管理发布者, 键为发布者name,值为订阅者数组,
            this.pubs = {
                /*puberName: [suber, suber2]*/
            };
        };
        var ps = new PubSub();
        PubSub.prototype.get = function(name){
          return this.pubs[name];
        };
        PubSub.prototype.set = function(name, subArr){
          return this.pubs[name] = subArr;
        };

        /**
         * 创建新增发布者，并且有订阅者时绑定传入的订阅者
         * 如果发布者已存在，则为设置发布者
         * @method Cora.PS#add
         * @param {string} name 发布者名称或标识
         * @param {function} arguments 订阅者
         * @return {object} Cora.PS 对象
         */
        PubSub.prototype.add = function(name /*, sub1, sub2...*/){
            var subs = this.get(name) || [];
            if(subs.length){
                Cora.log('已存在'+name+'发布者,将会重置订阅者', {type: 'warn'});
            }
            var addsubs = Cora.toArray(arguments);
                addsubs.shift();
            this.set(name, addsubs);
            return this;
        };
        /**
         * name的发布者发布动作
         * @method Cora.PS#send
         * @param {string} name 发布者名称或标识
         * @param {object} data 发布的数据
         * @return {object} Cora.PS 对象即发布者
         */
        PubSub.prototype.send = function(name, data){
            // 有deliver时订阅者即执行
            this.pubs[name].forEach(function(sub){
                sub(data, name);
            });
            return this;
        };
        /**
         * @method Function#sub
         * @param {string} name 订阅到 name 的发布者
         * @return {function} 订阅者
         */
        Function.prototype.sub = function(name){
            var isExist = ps.get(name).has(this);
            if(!isExist){
                ps.pubs[name].push(this);
            }
            return this;
        };
        /**
         * @method Function#unsub
         * @param {string} name 取消订阅到某pub(PS)对象
         * @return {function} 取消订阅者
         */
        Function.prototype.unsub = function(name){
            ps.pubs[name].remove(this);
            return this;
        };

        return ps;
    })();

    /***************************************** EVENT ******************************************/
    /**
     * 事件
     * @namespace Cora.event
     * @todo 确定是否所有的事件都会注册在window上
     */
    Cora.event =(function(){

        var stopBubble = function (event) {
            if (event.stopPropgation) {
                event.stopPropagation();
            }else {
                event.cancelBubble = true;
            }
        };

        var _callback = function(event, callback){
            event.target =   event.target || event.srcElement;
            callback(event);
            stopBubble(event);
        };

        return {
            /**
             * 为单个元素绑定事件
             * @method Cora.event.reg
             * @param {element} target 待绑定的元素
             * @param {eventType} type 触发的事件类型
             * @param {function} callback 触发回调
             */
            reg: function (target, type, callback) {
                var eventName = target.addEventListener ? type : 'on' + type;
                if(target.addEventListener){
                    target.addEventListener(eventName, function(event){_callback(event, callback);});
                }else{
                    target.attachEvent(eventName, function(event){_callback(event, callback);});
                }
            },
            /**
             * 为单个元素解绑事件
             * @method Cora.event.reg
             * @param {element} target 待绑定的元素
             * @param {eventType} type 解绑触发的事件类型
             * @param {function} callback 触发回调
             */
            unreg: function (target, type, callback) {
                var eventName = target.removeEventListener ? type : 'on' + type;
                if(target.removeEventListener){
                    target.removeEventListener(eventName, function(event){_callback(event, callback);});
                }else{
                    target.detachEvent(eventName, function(event){_callback(event, callback);});
                }
            }
        }
    })();

    /***************************************** DOM ******************************************/
    /**
     * @lends Cora.prototype
     */
    fn = Cora.fn = Cora.prototype = {

        /**
         * @method Cora~init
         * @protected
         * @todo 传入html元素时返回其
         */
        init: function(selector) {
            if (!selector)
                return this;
            //Cora对象    
            if (selector instanceof Cora) {
                return selector;
            }
            var type = Cora.type(selector);
            //是function时
            if (type === 'Function') return Cora.ready(selector);
            //是html元素时
            if (type.indexOf('HTML') !== -1) {
                return this._makeCora(selector.length ? selector : [selector]);
            }
            //dom array
            if (type === 'Array') {
                return this._makeCora(selector);
            }

            var selectorType = 'querySelectorAll';
            if (selector.indexOf('#') === 0) {
                selectorType = 'getElementById';
                selector = selector.substr(1, selector.length);
            }
            var selectorElem = document[selectorType](selector);

            // if(!selectorElem.length){
            // 	console.log(selectorElem, 'selectorElem');
            // 	selectorElem = [selectorElem];
            // }else{
            selectorElem = Cora.toArray(selectorElem);
            // }
            return this._makeCora(selectorElem, selector);
        },
        /** 
         * 生成Cora对象
         * @private
         * @method Cora~_makeCora
         */
        _makeCora: function(dom, selector) {
            this[0] = dom;
            this.length = this[0].length;
            this.selector = selector;
            this.type = 'Cora';
            return this;
        },
        /** 
         * 遍历Cora对象
         * @method Cora#each
         * @param {function} func
         * @callback {function} func -回调方法
         */
        each: function(func) {
            this[0].forEach(function(item, i) {
                func(item, i);
            });
        },
        /** 
         * getter setter Cora对象的属性
         * @method Cora#attr
         * @param {string} attrname -属性名
         * @param {string} attrval -属性值
         * @return {string|undefined} getter时返回string
         * @example 
         * getter:  Cora(selector).attr('attrname')
         * setter:  Cora(selector).attr('attrname', 'attrbal')
         */
        attr: function(attrname, attrval) {
            var isset = (void 0 !== attrval);
            if (!isset) {
                return this[0][0].getAttribute(attrname);
            }

            this.each(function(item) {
                item.setAttribute(attrname, attrval);
            });
        },
        /** 
         * 判断元素是否具有某个class
         * @method Cora#find
         * @param {string} selector 选择器字符
         * @return {object} 返回Cora对象
         */
        find: function(selector) {
            var fdom, domarr = [];
            this.each(function(item) {
                fdom = item.querySelectorAll(selector);
                if (fdom.length) {
                    domarr = domarr.concat(Cora.toArray(fdom));
                }
            });
            //var selector = this.selector ? this.selector + ' ' + selector : selector;
            return Cora(domarr);
        },
        /** 
         * 判断元素是否具有某个class
         * @method Cora#hasClass
         * @param {string} className class的名称
         * @todo indexOf兼容性
         */
        hasClass: function(className) {
            var re = new RegExp('^(\w*\s)*' + className + '\s*$', 'g'),
                results = [];

            this.each(function(item) {
                result = re.test(item.className.trim());
                results.push(result);
            });
            return (results.indexOf(true) !== -1);
        },
        /** 
         * 元素添加class [All browsers]
         * @method Cora#addClass
         * @param {string} className class的名称
         */
        addClass: function(className) {
            this.each(function(item) {
                item.className += ' ' + className;
                item.className = item.className.trim();
            });
            return this;
        },
        /** 
         * 元素去除某个class
         * @method Cora#removeClass
         * @param {string} className class的名称
         */
        removeClass: function(className) {
            var re = new RegExp(className + '$', 'g');

            this.each(function(item) {
                item.className = item.className.replace(re, '').trim();
            });
            return this;
        },
    //     prefixCss: function(cssprop, value){
				//   var cssKv={}, 
				//   prefixs = ['moz', 'webkit', 'o', 'ms'];
				//   prefixs.forEach(function(prefix){
				//     cssKv['-'+prefix+'-'+cssprop] = value;
				//   });
				//   return cssKv;
				// },
        /**
         * 为元素添加样式
         * @method Cora#css
         * @param {string} key css key
         * @param {string} value css value
         * @param {object} key key-value pairs
         */
        css: function(key, value) {
            var args = arguments,
                setter;
            if (Cora.isString(key) && args.length === 1) {
                return this[0] && window.getComputedStyle(this[0])[key];
            }
            if (args.length === 2) {
                setter = function(el) {
                    el.style[key] = value;
                };
            } else if (Cora.isObject(key)) {
                setter = function(el) {
                    Object.keys(key).forEach(function(name) {
                        el.style[name.camelize()] = key[name];
                    });
                };
            }
            this.each(function(item) {
                setter(item);
            });
            return this;
        },
        /**
         * 为元素添加样式
         * @method Cora#animate
         */
        animate: function() {
            return this;
        },
        /** 
         * 在元素里添加包含style标签及style内容的样式块
         * @method Cora#addCssBlock
         * @param {string} styleBlock style的内容
         */
        addCssBlock: function(styleBlock) {
            this.insert('front', '<style type = "text/css">' + styleBlock.trim().mtrim() + '</style>');
            // //ie
            // if( styleDom.styleSheet ){
            //   styleDom.styleSheet.cssText = styleBlock;
            // }else{
            //   styleDom.innerText = styleBlock;
            // }
            // console.log(styleDom, 'styleDom');
        },
        /**
         * 在元素某处添加元素
         * @method Cora#insert
         * @param {String} position (1.before 2.front 3.end 4.after) 被添加的元素的位置
         * @param {element} elem 被添加的元素
         * @example
         * 1<a>2<b></b>3</a>4
         * position(1.before 2.front 3.end 4.after);
         */
        insert: function(position, elem) {
            var posi = position;
            posi = (posi === 'front') ? 'afterbegin' : posi;
            posi = (posi === 'end') ? 'beforeend' : posi;
            this[0].forEach(function(item) {
                item.insertAdjacentHTML(posi, elem);
            });
        },
        /** 
         * 在元素上设置绑定数据或获取数据
         * @method Cora#data
         * @param {object} set elem被添加的数据对象
         */
        data: function (set) {
        	var data = Cora.data;
        	if(!set){
        		return data.get(this[0][0])
        	}else{
        		data.set(this[0][0], set);
        	}
        },
        // Cora.objectEqual
        contains: function(elem){
        	
        },
	    /**
         * 为cora元素绑定事件
         * @method Cora#on
         * @param {eventType} eventType 触发的事件类型
         * @param {string} selector 待绑定的元素的选择器
         * @param {function} callback 触发回调
         * @todo 1: dom.contains	2: fn.bind(sth)
         */
        on: function(eventType, selector, callback){
        	var _t = this;
            var _cb = function(event){
                console.log('memory test');
                var retCb = callback(event, event.target);
                if(retCb === false){     //仅申明返回false时阻止默认行为
                    event.preventDefault();
                }
            };

        	//没有selector时为每个元素绑定事件
        	if(Cora.isFunction(selector)){
        		callback = selector;
        		_t.each(function (item) {
        			Cora.event.reg(item, eventType, _cb);
        		});
        		return _t;
        	}
        	// 有selector时则为事件代理
        	Cora.event.reg(this[0][0], eventType, function(event) {
        		var target = event.target,
        			targetContainer = _t.find(selector);
        			targetContainer.each(function(item){
        				if(item.contains(target)){
                            _cb(event);
        				}
        			});
        	});
            return _t;
        },  
        /**
         * 为cora元素绑定事件
         * @method Cora#on
         * @param {eventType} eventType 触发的事件类型
         * @param {function} callback 触发回调
         */
        off: function(eventType, callback){
            Cora.event.unreg(this[0][0], eventType, callback);
            return this;
    	}

    };

    Cora.prototype.init.prototype = Cora.prototype;

    /************************************* Template ****************************************/
    /*
     *@see https://github.com/olado/doT
     *Laura Doktorova https://github.com/olado/doT Licensed under the MIT license
     */
    (function(){function p(b,a,d){return("string"===typeof a?a:a.toString()).replace(b.define||h,function(a,c,e,g){0===c.indexOf("def.")&&(c=c.substring(4));c in d||(":"===e?(b.defineParams&&g.replace(b.defineParams,function(a,b,l){d[c]={arg:b,text:l}}),c in d||(d[c]=g)):(new Function("def","def['"+c+"']="+g))(d));return""}).replace(b.use||h,function(a,c){b.useParams&&(c=c.replace(b.useParams,function(a,b,c,l){if(d[c]&&d[c].arg&&l)return a=(c+":"+l).replace(/'|\\/g,"_"),d.__exp=d.__exp||{},d.__exp[a]=
        d[c].text.replace(new RegExp("(^|[^\\w$])"+d[c].arg+"([^\\w$])","g"),"$1"+l+"$2"),b+"def.__exp['"+a+"']"}));var e=(new Function("def","return "+c))(d);return e?p(b,e,d):e})}function k(b){return b.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var f={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
        define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0},m;f.encodeHTMLSource=function(b){var a={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},d=b?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(b){return b?
        b.toString().replace(d,function(b){return a[b]||b}):""}};m=function(){return this||(0,eval)("this")}();"undefined"!==typeof module&&module.exports?module.exports=f:"function"===typeof define&&define.amd?define(function(){return f}):m.doT=f;var r={start:"'+(",end:")+'",startencode:"'+encodeHTML("},s={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},h=/$^/;f.template=function(b,a,d){a=a||f.templateSettings;var n=a.append?r:s,c,e=0,g;b=a.use||a.define?p(a,b,d||{}):b;b=("var out='"+(a.strip?
        b.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):b).replace(/'|\\/g,"\\$&").replace(a.interpolate||h,function(b,a){return n.start+k(a)+n.end}).replace(a.encode||h,function(b,a){c=!0;return n.startencode+k(a)+n.end}).replace(a.conditional||h,function(b,a,c){return a?c?"';}else if("+k(c)+"){out+='":"';}else{out+='":c?"';if("+k(c)+"){out+='":"';}out+='"}).replace(a.iterate||h,function(b,a,c,d){if(!a)return"';} } out+='";e+=1;g=d||"i"+e;a=k(a);return"';var arr"+
            e+"="+a+";if(arr"+e+"){var "+c+","+g+"=-1,l"+e+"=arr"+e+".length-1;while("+g+"<l"+e+"){"+c+"=arr"+e+"["+g+"+=1];out+='"}).replace(a.evaluate||h,function(a,b){return"';"+k(b)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,"");c&&(a.selfcontained||!m||m._encodeHTML||(m._encodeHTML=f.encodeHTMLSource(a.doNotSkipEncoded)),b="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+f.encodeHTMLSource.toString()+
        "("+(a.doNotSkipEncoded||"")+"));"+b);try{return new Function(a.varname,b)}catch(q){throw"undefined"!==typeof console&&console.log("Could not create a template function: "+b),q;}};f.compile=function(b,a){return f.template(b,null,a)}})();

    Cora.extend(Cora, doT);

    /************************************* Animation ****************************************/
    (function(w) {
        w.requestAnimationFrame = window.requestAnimationFrame;
        w.cancelAnimationFrame = window.cancelAnimationFrame;

        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
            w.requestAnimationFrame = w[vendors[x]+'RequestAnimationFrame'];
            w.cancelAnimationFrame =
                w[vendors[x]+'CancelAnimationFrame'] || w[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!w.requestAnimationFrame)
            w.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = w.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!w.cancelAnimationFrame)
            w.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }(Cora));

    /**
     * Tween.js
     * @method Cora.tween.Linear：无缓动效果；
     * @method Cora.tween.Quadratic：二次方的缓动（t^2）；
     * @method Cora.tween.Cubic：三次方的缓动（t^3）；
     * @method Cora.tween.Quartic：四次方的缓动（t^4）；
     * @method Cora.tween.Quintic：五次方的缓动（t^5）；
     * @method Cora.tween.Sinusoidal：正弦曲线的缓动（sin(t)）；
     * @method Cora.tween.Exponential：指数曲线的缓动（2^t）；
     * @method Cora.tween.Circular：圆形曲线的缓动（sqrt(1-t^2)）；
     * @method Cora.tween.Elastic：指数衰减的正弦曲线缓动；
     * @method Cora.tween.Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
     * @method Cora.tween.Bounce：指数衰减的反弹缓动。

     * @method Cora.tween.每个效果都分三个缓动方式（方法），分别是：
     * @method Cora.tween.easeIn：从0开始加速的缓动；
     * @method Cora.tween.easeOut：减速到0的缓动；
     * @method Cora.tween.easeInOut：前半段从0开始加速，后半段减速到0的缓动。
     * @method Cora.tween.其中Linear是无缓动效果，没有以上效果。
     *
     * @param {number} t: current（当前时间）；
     * @param {number} b: beginning value（初始值）；
     * @param {number} c: change in value（变化量）；
     * @param {number} d: duration（持续时间）。
     */
    Math.tween={Linear:function(e,a,g,f){return g*e/f+a},Quad:{easeIn:function(e,a,g,f){return g*(e/=f)*e+a},easeOut:function(e,a,g,f){return -g*(e/=f)*(e-2)+a},easeInOut:function(e,a,g,f){if((e/=f/2)<1){return g/2*e*e+a}return -g/2*((--e)*(e-2)-1)+a}},Cubic:{easeIn:function(e,a,g,f){return g*(e/=f)*e*e+a},easeOut:function(e,a,g,f){return g*((e=e/f-1)*e*e+1)+a},easeInOut:function(e,a,g,f){if((e/=f/2)<1){return g/2*e*e*e+a}return g/2*((e-=2)*e*e+2)+a}},Quart:{easeIn:function(e,a,g,f){return g*(e/=f)*e*e*e+a},easeOut:function(e,a,g,f){return -g*((e=e/f-1)*e*e*e-1)+a},easeInOut:function(e,a,g,f){if((e/=f/2)<1){return g/2*e*e*e*e+a}return -g/2*((e-=2)*e*e*e-2)+a}},Quint:{easeIn:function(e,a,g,f){return g*(e/=f)*e*e*e*e+a},easeOut:function(e,a,g,f){return g*((e=e/f-1)*e*e*e*e+1)+a},easeInOut:function(e,a,g,f){if((e/=f/2)<1){return g/2*e*e*e*e*e+a}return g/2*((e-=2)*e*e*e*e+2)+a}},Sine:{easeIn:function(e,a,g,f){return -g*Math.cos(e/f*(Math.PI/2))+g+a},easeOut:function(e,a,g,f){return g*Math.sin(e/f*(Math.PI/2))+a},easeInOut:function(e,a,g,f){return -g/2*(Math.cos(Math.PI*e/f)-1)+a}},Expo:{easeIn:function(e,a,g,f){return(e==0)?a:g*Math.pow(2,10*(e/f-1))+a},easeOut:function(e,a,g,f){return(e==f)?a+g:g*(-Math.pow(2,-10*e/f)+1)+a},easeInOut:function(e,a,g,f){if(e==0){return a}if(e==f){return a+g}if((e/=f/2)<1){return g/2*Math.pow(2,10*(e-1))+a}return g/2*(-Math.pow(2,-10*--e)+2)+a}},Circ:{easeIn:function(e,a,g,f){return -g*(Math.sqrt(1-(e/=f)*e)-1)+a},easeOut:function(e,a,g,f){return g*Math.sqrt(1-(e=e/f-1)*e)+a},easeInOut:function(e,a,g,f){if((e/=f/2)<1){return -g/2*(Math.sqrt(1-e*e)-1)+a}return g/2*(Math.sqrt(1-(e-=2)*e)+1)+a}},Elastic:{easeIn:function(g,e,k,j,f,i){var h;if(g==0){return e}if((g/=j)==1){return e+k}if(typeof i=="undefined"){i=j*0.3}if(!f||f<Math.abs(k)){h=i/4;f=k}else{h=i/(2*Math.PI)*Math.asin(k/f)}return -(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e},easeOut:function(g,e,k,j,f,i){var h;if(g==0){return e}if((g/=j)==1){return e+k}if(typeof i=="undefined"){i=j*0.3}if(!f||f<Math.abs(k)){f=k;h=i/4}else{h=i/(2*Math.PI)*Math.asin(k/f)}return(f*Math.pow(2,-10*g)*Math.sin((g*j-h)*(2*Math.PI)/i)+k+e)},easeInOut:function(g,e,k,j,f,i){var h;if(g==0){return e}if((g/=j/2)==2){return e+k}if(typeof i=="undefined"){i=j*(0.3*1.5)}if(!f||f<Math.abs(k)){f=k;h=i/4}else{h=i/(2*Math.PI)*Math.asin(k/f)}if(g<1){return -0.5*(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e}return f*Math.pow(2,-10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i)*0.5+k+e}},Back:{easeIn:function(e,a,h,g,f){if(typeof f=="undefined"){f=1.70158}return h*(e/=g)*e*((f+1)*e-f)+a},easeOut:function(e,a,h,g,f){if(typeof f=="undefined"){f=1.70158}return h*((e=e/g-1)*e*((f+1)*e+f)+1)+a},easeInOut:function(e,a,h,g,f){if(typeof f=="undefined"){f=1.70158}if((e/=g/2)<1){return h/2*(e*e*(((f*=(1.525))+1)*e-f))+a}return h/2*((e-=2)*e*(((f*=(1.525))+1)*e+f)+2)+a}},Bounce:{easeIn:function(e,a,g,f){return g-Tween.Bounce.easeOut(f-e,0,g,f)+a},easeOut:function(e,a,g,f){if((e/=f)<(1/2.75)){return g*(7.5625*e*e)+a}else{if(e<(2/2.75)){return g*(7.5625*(e-=(1.5/2.75))*e+0.75)+a}else{if(e<(2.5/2.75)){return g*(7.5625*(e-=(2.25/2.75))*e+0.9375)+a}else{return g*(7.5625*(e-=(2.625/2.75))*e+0.984375)+a}}}},easeInOut:function(e,a,g,f){if(e<f/2){return Tween.Bounce.easeIn(e*2,0,g,f)*0.5+a}else{return Tween.Bounce.easeOut(e*2-f,0,g,f)*0.5+g*0.5+a}}}};

    /**
     * 在Corajs上扫描全局注册组件或插件
     * @method Cora.Anim
     * @param {element} $elem 引起动画的方法
     * @param {object} cssOpts 引起动画的方法
     * @example
     * @todo 实现常规的快捷接口，实现动画的事件触发，实现动画的流程控制
     */
    Cora.fx = (function(){
        var intProps = function(){

        };
        //动画初始状态
        var getInitFx = function(props){

        };

        //动画终止状态
        var getEndFx = function(props){
            //将props处理成动画需要的数据;
            return props;
        };

        //动画中间态时的对象值
        var getProgressFx = function(props, duration){
            var cssProgress = {};
            return cssProgress;
        };

        var doFx = function($elem,  props, animOpts){
            var reqAniFrame = Cora.requestAnimationFrame;
            animOpts.effect = animOpts.effect || 'Linear';

            var repeatFn = function(){
                $elem.css(props);
                reqAniFrame(repeatFn);
            };
            reqAniFrame(repeatFn);
        };
        return doFx;
    })();


    /********************************** 模块化组件注册 **********************************/
    (function($) {
        /**
         * 在Corajs上扫描全局注册组件或插件
         * @method Cora.widgetize
         * @param {dom} widget
         * @example
         * 组件使用方式 widget="pluginsName" data-options={ a:"a",b:"b"}
         */
        $.widgetize = function(widget) {
            var $widget = $(widget),
                widgetName = $widget.attr('widget'),
                widgetArgs = JSON.parse($widget.attr('data-options')),
                opts = widgetArgs ? widgetArgs : {};

            $.log('执行插件: [' + widgetName + ']', {type: 'info'});
            try {
                $widget[widgetName](opts);
            } catch (e) {
                throw Error(e || widgetName + '组件还没有注册！');
            }
        };

        /**
         * 在Corajs上注册组件或插件以可以通过dom上widget属性与data-option去注册组件名与参列
         * @method Cora.regWidget
         * @param {object} opts 属性包含verion, name ..
         * @porproty opts.verion 版本号
         * @porproty opts.name 组件名
         * @example <div widget="Bones" data-options="JSON STRING"></div>
         */
        $.regWidget = function(opts) {
            var widgetName = opts.name;
            var $widgets = Cora('[widget=' + widgetName + ']');
            $widgets.each(function(item) {
                Cora.widgetize(item);
            });
        };
        /**
         * 在Corajs上指定元素上卸载组件
         * @method Cora.unWidget
         * @param {element} elem 卸载组件所指定的元素
         */
        $.unWidget = function(elem){
            // 卸载已缓存实例
            $.data.del(elem);
            //卸载已运行实例
            elem.innerHTML = '';
        }

    })(Cora);

    /************************************* AMD ****************************************/
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Cora;
    } else if (typeof define === "function" && define.amd) {
        define(function() {
            return Cora;
        });
        window.Cora = window.$ = Cora;
    } else if (typeof window === "object" && typeof window.document === "object") {
        window.Cora = window.$ = Cora;
    }
})();


//参考 jbonejs doT
//动画模块