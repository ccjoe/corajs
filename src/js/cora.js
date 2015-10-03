/**
 * @author sfliu
 * Copyright(C) 2015 - 2016, All rights reserved.
 * Date: 2015-09-31
 */
;(function(){
	var _$ = window.$,
		  _Cora = window.Cora;

	//内部全局变量
	var _g = {
		types: ['boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'error', 'undefined', 'null'],
	},fn;

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
	 */
	Cora.version = '1.0.0';

	/**
	 * 命名冲突时使用此方法
	 * @method Cora.noConflict
	 * @return {Cora} 返回全局变量
	 */
	Cora.noConflict = function(){
	    window.$ = _$;
	    window.Cora = _Cora;
	    return Cora;
	};
	/**
	 * 判断变量的类型, 判断dom类型时,用querySelectorAll集合为object
	 * @method Cora.type
	 * @param {object} obj 待检测的变量
	 * @return {string} 返回变量的类型
	 * @example
	 * 返回的类型有：'boolean', 'number', 'string', 'function', 'array', 'date', 'regexp', 'error', 'undefined', HTMLCollection, HTML(TagName)Element
	 */
	Cora.type=function(obj){
		if (obj===null) return String(obj);
		var tobj = {}, types = _g.types;
			type = Object.prototype.toString.call(obj);

		for(var i=0; i<types.length; i++){
			tobj['[object '+ types[i].capit() +']'] = types[i];
		}
		
		if (type in tobj) return tobj[type];
		if (type==='[object Object]') type = obj + '';
		var arr = type.match(/^\[object (HTML\w+)\]$/);
		if (arr) return arr[1];
		return 'object';
	};

	// Cora[is+_g.types]

	/**
	 * 探测浏览器类型
	 * @method Cora.browse
	 * @return {string} 返回浏览器类型字符串
	 */
	Cora.browse = function(){
		var blist = {

		};
		return blist;
	};

	/**
	 * 将类数组对象转化为数组
	 * @method Cora.toArray
	 * @param {arrayLike} arrayLike 类数组对象
	 * @return {array} 返回真正的数组对象
	 */	
	Cora.toArray = function(arrayLike){
		return [].slice.call(arrayLike);
	};

	/**
	 * 判断domReady
	 * @method Cora.ready
	 * @param {function} func 待检测的变量
	 */
	Cora.ready=function(func){
	
	};
	/**
	 * Copy混合对象
	 * @method Cora.merge
	 * @param {object} 待合并的对象
	 * @return {object} 返回合并后的第一个对象
	 */	
	Cora.merge = function(a, b){
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
	};
	/**
	 * 混合多个对象
	 * @method Cora.extend
	 * @param {object} 待合并的对象
	 * @return {object} 返回变量的类型
	 * @todo 性能有待验证：问题在于传入多个对象时是采用按前二合并依次往后, 可优化或验证是否从后往前合并更高效
	 */
	Cora.extend = Object.assign || function (){
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
	};

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
	        }
	    };
	}());

	/**
	 * @lends Cora.prototype
	 */
	fn = Cora.fn = Cora.prototype = {
		/**
		 * @method Cora~_init
		 * @private
		 * @todo 传入html元素时返回其
		 */
		_init: function(selector){
			if(!selector) 
				return this;
			//是function时
			if(Cora.type(selector) === 'function')
        return Cora.ready(selector);
      //是html元素时
      if(Cora.type(selector).indexOf('HTML') !== -1){
      	return this._makeCora(selector.length ? selector : [selector]);
      }
      //Cora对象    
      if(selector instanceof Cora){
      	return selector;
      }
      //dom array
      if(Cora.type(selector) === 'array'){
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
		_makeCora: function (dom, selector) {
			console.log(this, '[DEBUG this:] '+selector);
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
			this[0].forEach(function(item, i){
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
			var idom, isset = (void 0!==attrval);
			console.log(isset, 'isset');
			if(!isset){
				return this[0][0].getAttribute(attrname);
			}
			
			this.each(function(item, i){
				item.setAttribute(attrname, attrval);
			});
		},		
		/** 
		 * 判断元素是否具有某个class
		 * @method Cora#find
		 * @param {string} selector 选择器字符
		 * @return {element} 返回Cora对象
		 */
		find: function (selector) {
			var fdom, domarr = [];
			this.each(function(item, i){
				fdom = item.querySelectorAll(selector);
				if(fdom.length){
				 domarr = domarr.concat( Cora.toArray(fdom) );
				}
			});
			var selector = this.selector ? this.selector + ' ' + selector : selector;
			var newfdom = Cora(domarr);
			return newfdom;
		},
		/** 
		 * 判断元素是否具有某个class
		 * @method Cora#hasClass
		 * @param {string} className class的名称
		 * @todo indexOf兼容性
		 */
		hasClass: function (className) {
			var regstr = '^(\w*\s)*'+className+'\s*$';
			var re = new RegExp(regstr, 'g'),
					results = [];

			this.each(function(item){
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
		addClass: function (className) {
		  this.each(function(item, i){
				item.className += ' '+className;
			});
			return this;
		},
		/** 
		 * 元素去除某个class
		 * @method Cora#removeClass
		 * @param {string} className class的名称
		 */
		removeClass: function (className) {
			var regstr = '^'+className+'$';
			var re = new RegExp(regstr, 'g');

			this.each(function(item){
				item.className = item.className.replace(re, '').trim();
			});
			return this;
		},
		css:function(){

		},
		/** 
		 * 在元素里添加包含style标签及style内容的样式块
		 * @method Cora#addCssBlock
		 * @param {string} styleBlock style的内容
		 */
		addCssBlock: function(styleBlock){
        this.insert('front', '<style type = "text/css">'+styleBlock.trim().mtrim()+'</style>');
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
		insert: function(position, elem){
			var posi = position;
				  posi = (posi === 'front') ? 'afterbegin' : posi;
				  posi = (posi === 'end') ? 'beforeend' : posi;
        this[0].forEach(function(item, i){
        	item.insertAdjacentHTML(posi, elem);
        });
    },

	};

	Cora.prototype._init.prototype = Cora.prototype;

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
		trim: String.prototype.trim || function(){
			return this.replace(/^\s+|\s+$/g, '');
		},
		/**
		 * 字符串去前面去空格
		 * @method String#ltrim
		 * @return {string} 返回处理后的字符串
		 */
		ltrim: String.prototype.trimLeft || function(){
			return this.replace(/^\s+/g, '');
		},
		/**
		 * 字符串去后面去空格
		 * @method String#rtrim
		 * @return {string} 返回处理后的字符串
		 */
		rtrim: String.prototype.trimRigth || function(){
			return this.replace(/\s+$/g, '');
		},
		/**
		 * 字符串中间去空格,但最少保留一位空格
		 * @method String#mtrim
		 * @return {string} 返回处理后的字符串
		 */
		mtrim: function(){
			return this.replace(/\s+/g, ' ')
		},
		/**
		 * 将一个单词的首字母大写
		 * @method String#capit 即capitalize
		 * @param {String} lower_others 将其余字符小写
		 * @return {string} 返回处理后的字符串
		 */
		capit: function(lower_others){
			return this.charAt(0).toUpperCase() + ( !lower_others ? this.slice(1) : this.slice(1).toLowerCase() );
		},
		/**
		 * 将下划线或者中划线字符 转换转换成 camelized
		 * @method String#camelize
		 * @return {string} 返回处理后的字符串
		 * @example '-moz-transform'.camelize() => 'MozTransform'
		 */		
		camelize: function(){
			return this.trim().replace(/[-_\s]+(.)?/g, function(match, c) {
		    return c ? c.toUpperCase() : "";
		  });
		},
		/**
		 * 将下划线或者中划线字符 转换转换成 camelized
		 * @method String#underscored
		 * @return {string} 返回处理后的字符串
		 * @example 'MozTransform'.underscored() => 'moz_transform'
		 */		
		underscored: function(){
			return this.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
		},
		/**
		 * 将下划线或者中划线字符 转换转换成 camelized
		 * @method String#dasherize
		 * @return {string} 返回处理后的字符串
		 * @example 'MozTransform'.dasherize()=> '-moz-transform'
		 */		
		dasherize: function(){
			return this.trim().replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
		}
	});

	/**
	 * Date日期的扩展方法
	 * @namespace Date
	 * @constructs Date
	 */
	Cora.extend(Date.prototype, {
		/**
		 * +y年后的时间
		 * @method Date#addYears
		 * @param {integer} y 需要加上的特定年份
		 * @return {Date} 返回加好年份的日期对象
		 */
		addYears:function(y){
			var d=new Date(+this);
			d.setYear(d.getFullYear()+y);
			return d;
		},
		/**
		 * 加上特定的月份
		 * @method Date#addMonths
		 * @param {integer} m 需要加上的特定年份
		 * @return {Date} 返回加好年份的日期对象
		 */
		addMonth:function(m){
			
		}
	});
	// ...

	//----------模板引擎

	//----------模块化组件注册(UI组件)
  //B: 插件组件化
  
  //C：插件组件化


	/**
	 * 在Corajs上扫描全局注册组件或插件
	 * @method Cora.widgetize
	 * @param {dom} widgetElem
	 * @example
   * 组件使用方式 widget="pluginsName" data-options={ a:"a",b:"b"}
	 */	
  Cora.widgetize = function(widget){
  	var $widget = $(widget);
    		widgetName = $widget.attr('widget'),
  		  widgetArgs = JSON.parse($widget.attr('data-options'));
      	opts = widgetArgs ? widgetArgs : {};

  		console.log('执行插件：'+ widgetName + '参数为：' + opts, Cora.fn, '元素为：', $widget);
      try{
      	$widget[widgetName](opts);
      }catch(e){
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
 	Cora.regWidget = function(opts){
 		var widgetName = opts.name;
 		var $widgets = Cora('[widget='+widgetName+']');
 		$widgets.each(function(item){
 			Cora.widgetize(item);
 		});
 	};

	//----------AMD模块化支持
	if (typeof module === "object" && module && typeof module.exports === "object") {
	    module.exports = Cora;
	}else if (typeof define === "function" && define.amd) {
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