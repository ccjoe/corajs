/**
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
            types: ['boolean', 'number', 'string', 'function', 'object', 'array', 'date', 'regexp', 'error', 'undefined', 'null', 'html'],
            capitalize: function(str, lower_others) {
                return str.charAt(0).toUpperCase() + (!lower_others ? str.slice(1) : str.slice(1).toLowerCase());
            }
        },
        fn;

    /**
     * 全局对象
     * @namespace
     * @constructs Cora
     * @static
     * @return {dom} 返回的对象即Cora对象，$(selector)[0]指向原生HTMLElement的数组;
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
        return new fn._init(selector);
    };
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
    /**
     * 判断变量的类型, 判断dom类型时,用querySelectorAll集合为object
     * @method Cora.type
     * @param {var} obj 待检测的变量
     * @return {string} 返回变量的类型
     * @example
     * 返回的类型有：'boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'error', 'undefined', HTMLCollection, HTML(TagName)Element
     * Cora.type(NaN)  => number
     * @todo NodeList HTMLCollection 判断均为 HTMLCollection, 在IE8 为object
     */
    Cora.type = function(obj) {
        if (obj === null) return String(obj);
        var tobj = {},
            types = _g.types;
        type = Object.prototype.toString.call(obj);

        for (var i = 0; i < types.length; i++) {
            tobj['[object ' + _g.capitalize(types[i]) + ']'] = types[i];
        }

        if (type in tobj) return tobj[type];
        if (type === '[object Object]') type = obj + '';
        var arr = type.match(/^\[object (HTML\w+)\]$/);
        if (arr) return arr[1];

        var arr2 = type.match(/^\[object (NodeList)\]$/);
        if (arr2) return 'HTMLCollection';

        return 'object';
    };
    /**
     * 判断变量的类型, 判断dom类型时,用querySelectorAll集合为object
     * @method Cora.is[Type]
     * @param {var} eth 待检测的变量
     * @return {boolean} 是否为指定的Type
     * @example
     * 方法列表有：'isBoolean', 'isNumber', 'isString', 'isFunction', 'isArray', 'isDate', 'isRegexp', 'isError', 'isUndefined', isNull, isNaN, isHTML
     */

	for (var gi = 0; gi < _g.types.length; gi++) {
		(function(i) {
			var item = _g.types[i];
			Cora['is' + _g.capitalize(item)] = function(eth) {
				return (Cora.type(eth) === item);
			};
			Cora.isHTML = function(eth) {
				return (!!~Cora.type(eth).indexOf('HTML'))
			};
            
            Cora.isHTMLCollection = function(elems){
                return Cora.type(elems) === 'HTMLCollection';
            };

			Cora.isNaN = function(eth){
				return Cora.isNumber(eth) && isNaN(eth);
			}
		})(gi);
	}

	//Array.prototype.slice.call => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Streamlining_cross-browser_behavior
	//Object.keys  => Polyfill From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	(function(){var a=Array.prototype.slice;try{a.call(document.documentElement)}catch(b){Array.prototype.slice=function(h,d){d=(typeof d!=="undefined")?d:this.length;if(Object.prototype.toString.call(this)==="[object Array]"){return a.call(this,h,d)}var f,j=[],e,c=this.length;var k=h||0;k=(k>=0)?k:Math.max(0,c+k);var g=(typeof d=="number")?Math.min(d,c):c;if(d<0){g=c+d}e=g-k;if(e>0){j=new Array(e);if(this.charAt){for(f=0;f<e;f++){j[f]=this.charAt(k+f)}}else{for(f=0;f<e;f++){j[f]=this[k+f]}}}return j}}if(!Object.keys){Object.keys=function(){var c=Object.prototype.hasOwnProperty,f=!({toString:null}).propertyIsEnumerable("toString"),e=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],d=e.length;return function(j){if(typeof j!=="object"&&(typeof j!=="function"||j===null)){throw new TypeError("Object.keys called on non-object")}var h=[],k,g;for(k in j){if(c.call(j,k)){h.push(k)}}if(f){for(g=0;g<d;g++){if(c.call(j,e[g])){h.push(e[g])}}}return h}}}})();
   
    /**
     * 将类数组对象转化为数组
     * @method Cora.toArray
     * @param {arrayLike} arrayLike 类数组对象
     * @return {array} 返回真正的数组对象
     * @todo ie<9需要支持 
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Browser_compatibility
     */

    Cora.toArray = function(arrayLike) {
        return [].slice.call(arrayLike);
    };
    /**
     * Copy混合对象
     * @method Cora.merge
     * @param {object} 待合并的对象
     * @return {object} 返回合并后的第一个对象
     */
    Cora.merge = function(a, b) {
        for (var i in b) {
            bival = b[i];
            if (bival && Cora.isObject(bival)) {
                a[i] = a[i] || {};
                Cora.merge(a[i], bival);
            } else {
                a[i] = bival;
            }
        }
        return a;
    };
    /**
     * 判断对象与数组是否相等，内部采取深度递归全等对比
     * @method Cora.objectEqual
     * @param {object} 待对比的对象
     * @param {object} 待对比的对象
     * @return {boolean} 返回是否相等
     */
    Cora.objectEqual = function (a, b) {
        //遍历a与b的类型是否相同
        if(Cora.type(a) !==Cora.type(b)){
        	return false;
        }
    	//遍历a与b的长度是否相等
        if(Object.keys(a).length !== Object.keys(b).length){
        	return false;
        }
    	//先遍历b中所有属性与A是否===
    	for (var i in b) {
            bival = b[i];
            if (bival && Cora.isObject(bival)) {
                if(!Cora.objectEqual(a[i], bival)){
                	return false;
                }
            } else {
                if(a[i] != bival){
                	return false;
                }
            }
        }

        return true;
    };

    Cora.equal = function(a, b){
    	var type = Cora.type(a);
    	switch (type) {   		
    		case 'object':
    			return Cora.objectEqual(a, b);
    		    break;
    		default:
    			return a === b;
    			break; 
    	}
    };

    /**
     * 混合多个对象
     * @method Cora.extend
     * @param {object} 待合并的对象
     * @return {object} 返回变量的类型
     * @todo 性能有待验证：问题在于传入多个对象时是采用按前二合并依次往后, 可优化或验证是否从后往前合并更高效
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
         *		rainbow: false,
         *    css: "text-shadow: 0 1px 0 #ccc,0 2px 0 #aaa"
         * });
         * 仅支持一次输出一个对象
         */
        var log = function(output, opts) {
          var format = '',
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
                      opts.color = 'yellow';
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

    //双缓冲技术,减少对视图的冗余刷新 @todo应用场景
    Cora.Buffer = (function(){
        var Buffer = function () {
            this.queue = [];    //队列
        };

        Buffer.prototype = {
            setqueue: function(queue){
                this.queue = queue;
            },
            render: function () {
                //没有被锁的情况下执行渲染
                if (!this.locked) {
                    this.flush();
                }
            },
            flush: function () {
                for (var i = 0, sub; sub = this.queue[i++]; ) {
                    sub.update && sub.update(); //执行队列
                }
                this.locked = 0;
                this.queue = [];
            }
        }

        var buffer = new Buffer();
        return buffer;
    })();

    /**
     * 探测浏览器类型
     * @method Cora.browse
     * @return {string} 返回浏览器类型字符串
     */
    Cora.browse = function() {
        var blist = {

        };
        return blist;
    };

    /**
     * 判断domReady
     * @method Cora.ready
     * @param {function} func 待检测的变量
     */
    Cora.ready = function(func) {};
    Cora.url = (function(){
    		return { }
    	  //1=>URL,
        //2=>传入key,返回value,
        // 传入 'hash' 返回hash名，
        // 传入 'search' 返回kv字符串,
        // 传入 'domain' 返回.com|.net ~~~,
        // 否则返回key:value obj;
        // http://www.sth.com/th
        // 传入location
        // getUrl: function (url, keyOrObj) {
        //     //对url进行decodeURIComponen解码
        //     url = decodeURIComponent(url);
        //     var hashsearch = !~url.indexOf('#') ? '' : url.substr(url.indexOf('#') + 2);
            

        //     var pos = hashsearch.indexOf('?');
        //     if (!!~pos) {
        //         var hash = hashsearch.substr(0, pos),
        //             search = hashsearch.substr(pos + 1),
        //             kvArr = search.split('&');
        //     } else {
        //         var hash = hashsearch,
        //             search = '',
        //             kvArr = [];
        //     }

        //     var kvObj = {};

        //     for (var i = 0; i < kvArr.length; i++) {
        //         var kvi = kvArr[i];
        //         kvObj[kvi.substr(0, kvi.indexOf('='))] = kvi.substr(kvi.indexOf('=') + 1);
        //     }

        //     if (typeof keyOrObj === 'string') {
        //         if (keyOrObj === 'hash') {
        //             return hash;
        //         }
        //         if (keyOrObj === 'search') {
        //             return search;
        //         }
        //         if (keyOrObj === 'domain') {
        //             var durl = /http:\/\/([^\/]+)\//i,
        //             domain = str.match(durl);
        //             return domain[1].substr(domain[1].lastIndexOf('.') + 1);
        //         }
        //         return kvObj[keyOrObj];
        //     }

        //     return kvObj;
        // },
    });
		
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
                    return unescape(citem[1]);
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
            var date = new Date(),
                endTime = date.getTime() + expire;
            document.cookie = name + "=" + escape(value) + expire;
        },
    	 /**
         * 按键与值设置
         * @method Cora.cookie.del
         * @param {string} name cookie的名称
         */
        del: function (name) {
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = name + "=v; expires=" + date.toGMTString();
        }
    }
    /**
     * Array 数组的扩展方法
     * @namespace Array
     * @constructs Array
     * @static
     */
    Cora.extend(Array.prototype, {
        //all brower Array.prototype.indexOf || 
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
    	//all brower Array.prototype.indexOf || 
    	/** @method Array#indexOf */
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
    	/** @method Array#filter */
		filter: Array.prototype.filter || function (arr, filterfn) {
			var validValues = [];
		    for (var index = 0; index < arr.length; i++) {
		        if (filterfn(theArray[index])) {
		            validValues.push(theArray[index]);
		        }
		    }
		}
    });
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
        rtrim: String.prototype.trimRigth || function() {
            return this.replace(/\s+$/g, '');
        },
        /**
         * 字符串中间去空格,但最少保留一位空格
         * @method String#mtrim
         * @return {string} 返回处理后的字符串
         */
        mtrim: function() {
            return this.replace(/\s+/g, ' ')
        },
        /**
         * 将一个单词的首字母大写
         * @method String#capit 即capitalize
         * @param {String} lower_others 将其余字符小写
         * @return {string} 返回处理后的字符串
         */
        capit: function(lower_others) {
            return _g.capitalize(this, lower_others);
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

    Cora.extend(Date.prototype, {
        /**
         * 将时长转化为time格式
         * @method Date#countdownFormat
         * @param {integer} second 以毫秒计的时长
         * @return {string} 返回固定格式的字符串
         * @example 
         * getFormatTime(3600*1000*23) => "3天 23:00:00"
         */
		countdownFormat: function(endTime) {
			var remainTime = new Date(endTime) - new Date(+this),
				remainDays = Math.floor(remainTime / (3600000 * 24)),
				s = remainTime % (3600000 * 24);

			var daystr = remainDays ? remainDays + '天 ' : '';
			if (s < 1000) s = 0;
			var h = 0,
				m = 0,
				s = Math.floor(s / 1000);
			if (s >= 60) {
				m = Math.floor(s / 60);
				s = s % 60;
				if (m >= 60) {
					h = Math.floor(m / 60);
					m = m % 60;
				}
			}
			function tf(num) {
				return (num < 10) ? (0 + '' + num) : num;
			}
			return daystr + tf(h) + ':' + tf(m) + ':' + tf(s);
		},
        //性能不如上面
        // getFormatTime: function(millsecond) {
        // 	return new Date(millsecond-3600*8*1000).toTimeString().match(/^(\d{2}\:){2}\d{2}/)[0];
        // }
    });
    /**
     * 事件
     * @namespace Cora.event
     * @todo
     */
    Cora.event = {
	    /**
         * 为单个元素绑定事件
         * @method Cora.event.reg 
         * @param {element} target 待绑定的元素
         * @param {eventType} type 触发的事件类型
         * @param {function} callback 触发回调
         */
    	reg: function (target, type, callback) {
		    var listenerMethod = target.addEventListener || target.attachEvent,
		        eventName = target.addEventListener ? type : 'on' + type;
		    listenerMethod(eventName, callback, false);
		},
	    /**
         * 为单个元素解绑事件
         * @method Cora.event.reg 
         * @param {element} target 待绑定的元素
         * @param {eventType} type 解绑触发的事件类型
         * @param {function} callback 触发回调
         */
		unreg: function (target, type, callback) {
		    var removeMethod = target.removeEventListener || target.detachEvent,
		        eventName = target.removeEventListener ? type : 'on' + type;
                console.log('removeMethod'+ eventName);
		    removeMethod(eventName, callback);
		}
    }


    // 解决移动端模拟双击、长按、左右滑动、缩放的问题
    
    
    /**
     * @lends Cora.prototype
     */
    fn = Cora.fn = Cora.prototype = {

        /**
         * @method Cora~_init
         * @private
         * @todo 传入array时注意有无这种情况，区分传入HTMLCollection(NodeList)
         */
        _init: function(selector) {
            if (!selector)
                return this;
            //Cora对象    
            if (selector instanceof Cora) {
                return selector;
            }
            var type = Cora.type(selector);
            //是function时
            if (type === 'function') return Cora.ready(selector);
            //是html元素时
            if (type.indexOf('HTML') !== -1) {
                return this._makeCora(selector.length ? selector : [selector]);
            }
            //dom array
            if (type === 'array') {
                return this._makeCora(selector);
            }            
            //判断为原生html集合时
            if (type === 'HTMLCollection') {
                return this._makeCora(Cora.toArray(selector));
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
            var idom, isset = (void 0 !== attrval);
            if (!isset) {
                return this[0][0].getAttribute(attrname);
            }

            this.each(function(item, i) {
                item.setAttribute(attrname, attrval);
            });
        },
        /** 
         * 判断元素是否具有某个class
         * @method Cora#find
         * @param {string} selector 选择器字符
         * @return {element} 返回Cora对象
         */
        find: function(selector) {
            var fdom, domarr = [];
            this.each(function(item, i) {
                fdom = item.querySelectorAll(selector);
                if (fdom.length) {
                    domarr = domarr.concat(Cora.toArray(fdom));
                }
            });
            var selector = this.selector ? this.selector + ' ' + selector : selector;
            var newfdom = Cora(domarr);
            return newfdom;
        },        
        /** 
         * 在cora对象里添加元素
         * @method Cora#add
         * @param {element} elem 元素，可以是单个元素，Cora对象元素, NodeList;
         * @return {Cora} 返回Cora对象
         * @todo 传入NodeList时
         */
        add: function(elem) {
            if(Cora.isHTML(elem)){
                this[0].push(elem);
            }

            if(elem instanceof Cora){
                this[0] = this[0].concat(elem[0]);
            }

            if(Cora.isHTMLCollection(elem)){
                var elems = Cora.toArray(elem);
                this[0].concat(elems);
            }
            return this;
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
            this.each(function(item, i) {
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

        css: function(key, value) {
            var args = arguments,
                i = 0,
                setter;

            // Get attribute
            if (Cora.isString(key) && args.length === 1) {
                return this[0] && window.getComputedStyle(this[0])[key];
            }

            // Set attributes
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
         * @param {element} elem被添加的元素
         * @param {String} position(1.before 2.front 3.end 4.after) 被添加的元素的位置
         * @example 
         * 1<a>2<b></b>3</a>4 
         * position(1.before 2.front 3.end 4.after);
         */
        insert: function(position, elem) {
            var posi = position;
            posi = (posi === 'front') ? 'afterbegin' : posi;
            posi = (posi === 'end') ? 'beforeend' : posi;
            this[0].forEach(function(item, i) {
                item.insertAdjacentHTML(posi, elem);
            });
        },
        /** 
         * 在元素上设置绑定数据或获取数据
         * @method Cora#data
         * @param {object} elem被添加的数据对象
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
         * @param {eventType} type 触发的事件类型
         * @param {string} selector 待绑定的元素的选择器
         * @param {function} callback 触发回调
         * @todo 1: dom.contains	2: fn.bind(sth)
         */
        on: function(eventType, selector, callback){
        	var _t = this;
        	//没有selector时为每个元素绑定事件
        	if(Cora.isFunction(selector)){
        		callback = selector;
        		_t.each(function (item) {
        			Cora.event.reg(item, eventType, callback);
        		});
        		return _t;
        	}
        	// 有selector时则为事件代理

            _t.each(function(item, i){
                Cora.event.reg(item, eventType, function(event) {
                    console.log('always happen anywhere');
                    var target = event.target || event.srcElement,
                    $targetContainer = Cora(item).find(selector);
                    $targetContainer.each(function(item){
                        if(item.contains(target)){
                            callback(event, target);
                        }
                    });
                });
            });
        	
            return _t;

    // if (event.stopPropgation) {
    //     event.stopPropagation();
    // }
    // else {
    //     event.cancelBubble = true;
    // }
        },  
        /**
         * 为cora元素绑定事件
         * @method Cora#on
         * @param {eventType} type 触发的事件类型
         * @param {string} selector 待绑定的元素的选择器
         * @param {function} callback 触发回调
         * @todo 1: dom.contains	2: fn.bind(sth)
         */
        off: function(eventType, callback){
    		this.each(function (item) {
                console.log(item, 'item');
    			Cora.event.unreg(item, eventType, callback);
    		});
    		return this;
    	}
        

    };

    Cora.prototype._init.prototype = Cora.prototype;
    //----------模板引擎

    //----------模块化组件注册(UI组件)
    (function($) {
        /**
         * 在Corajs上扫描全局注册组件或插件
         * @method Cora.widgetize
         * @param {dom} widgetElem
         * @example
         * 组件使用方式 widget="pluginsName" data-options={ a:"a",b:"b"}
         */
        $.widgetize = function(widget) {
            var $widget = $(widget);
            widgetName = $widget.attr('widget'),
            widgetArgs = JSON.parse($widget.attr('data-options'));
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

    })(Cora)


    //----------AMD模块化支持
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

//string slice splice indexOf substr substring 
//arrar slice splice indexOf
//参考 jbonejs
