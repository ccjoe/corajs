/**
 * @author sfliu
 * Copyright(C) 2015 - 2016, All rights reserved.
 * Date: 2015-09-31
 */
;(function(){
	var _$ = window.$,
		_cora = window.cora;

	/**
	 * 全局对象
	 * @namespace
	 * @constructs cora
	 * @static
	 * @return {dom} 返回全局变量
	 * @desc 选择器 compatibility > ie81
	 */
	function cora(selector) {
	    var selectorType = 'querySelectorAll';
	    if (selector.indexOf('#') === 0) {
	        selectorType = 'getElementById';
	        selector = selector.substr(1, selector.length);
	    }
	    return document[selectorType](selector);
	};
	/**
	 * @version cora.version
	 */
	cora.version = '1.0.0';

	/**
	 * 命名冲突时使用此方法
	 * @method cora.noConflict
	 * @return {cora} 返回全局变量
	 */
	cora.noConflict = function(){
	    window.$ = _$;
	    window.cora = _cora;
	    return cora;
	};

	/**
	 * 探测浏览器类型
	 * @method cora.browse
	 * @return {string} 返回浏览器类型字符串
	 */
	cora.browse = function(){
		var blist = {

		};
		return blist;
	};

	/**
	 * 将类数组对象转化为数组
	 * @method cora.toArray
	 * @param {arrayLike} arrayLike
	 * @return {array} 返回真正的数组对象
	 */	
	cora.toArray = function(arrayLike){
		return Array.prototype.slice.call(arrayLike);
	};
	/**
	 * 判断变量的类型, 判断dom类型时,用querySelectorAll集合为object
	 * @method cora.type
	 * @param {object} 待检测的变量
	 * @return {string} 返回变量的类型
	 */
	cora.type=function(obj){
		if (obj===null) return String(obj);
		var tobj = {},
			types = ['boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'error', 'undefined'],
			type = Object.prototype.toString.call(obj);

		for(var i=0; i<types.length; i++){
			tobj['[object '+ types[i].charAt(0).toUpperCase()+types[i].slice(1) +']'] = types[i];
		}
		
		if (type in tobj) return tobj[type];
		if (type==='[object Object]') type = obj + '';
		var arr = type.match(/^\[object (HTML\w+)\]$/);
		if (arr) return arr[1];
		return 'object';
	};

	/**
	 * Copy混合对象
	 * @method cora.extend
	 * @param {object} 待合并的对象
	 * @return {object} 返回变量的类型
	 * @todo 性能有待验证：问题在于传入多个对象时是采用按前二合并依次往后, 可优化或验证是否从后往前合并更高效
	 */
	cora.extend = Object.assign || function (){
		var args = this.toArray(arguments);
		if(!args.length){
			return{};
		}else if(args.length === 1){
			return args[0];
		}else{
			for(var i=0; i<args.length; i++){
				args[0] = _extend(args[0], args[i]);
			}
			return args[0];
		}

		function _extend(a, b){
		    for(var i in b){
		        bival = b[i];
		        if(bival && Object.prototype.toString.call(bival) === '[object Object]'){
		                a[i] = a[i] || {};
		                extend(a[i], bival);
		            }else{
		                a[i] = bival;
		            }
		    }
		    return a;			
		}
	};


	/**
	 * data实现节点绑定数据  works in all browsers
	 * @namespace
	 */
	cora.data = window.WeakMap ? new WeakMap() : (function() {
	    var lastId = 0,
	        store = {};
	    return {
	    	/**
			 * 设置数据 setter
			 * @method cora.data.set
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
			 * @method cora.data.get
			 * @param {object} element 绑定数据的元素
			 * @return {object} 返回绑定的数据类型
			 */
	        get: function(element) {
	            return store[element.myCustomDataTag];
	        }
	    };
	}());

	/**
	 * @class cora.fn
	 */
	var fn = cora.fn = cora.prototype = {
		/** 
		 * 判断元素是否具有某个class
		 * @method hasClass
		 * @param {string} class的名称
		 * @return {boolean} 返回true或者false
		 */
		hasClass: function () {
			// body...
		}
	};

	fn.constructor = cora;

	//----------扩展数据类型
	//扩展String
	//扩展Date
	/**
	 * Date日期的扩展方法
	 * @class cora.Date
	 * @namespace
	 */
	cora.extend(Date.prototype, {
		/**
		 * @method addYears
		 * 加上特定的年份
		 * @param {integer} 需要加上的特定年份
		 * @return {object} 返回加好年份的日期对象
		 */
		addYears:function(y){
			var d=new Date(+this);
			d.setYear(d.getFullYear()+y);
			return d;
		}
	});
	// ...

	//----------模板引擎

	//----------模块化组件注册(UI组件)


	//----------AMD模块化支持
	if (typeof module === "object" && module && typeof module.exports === "object") {
	    module.exports = cora;
	}else if (typeof define === "function" && define.amd) {
	    define(function() {
	        return cora;
	    });
	    window.cora = window.$ = cora;
	} else if (typeof window === "object" && typeof window.document === "object") {
	    window.cora = window.$ = cora;
	}

})();


//string slice splice indexOf substr substring 
//arrar slice splice indexOf
//参考 jbonejs 