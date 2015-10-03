/**
 * @author Joe <icareu.joe@gmail.com>
 * @email icareu.joe@gmail.com   
 * @date 2014-07-16 10:15:13   
 * @content Bones                 
 */

(function($) {
    /**
     * 初始化执行插件
     * @method initBones
     * @this {widnow} 
     * 没有执行环境时指向window, call后执行在Bones对象上
     */
    function initBones(opts) {
        console.log(opts, 'opts');
    }
    /**
     * 此构造函数一般不直接调用，是用来实现插件化的中间过程；如果注册了window.Bones，则可以直接调用以便灵活处理
     * @class Bones
     * @param {object} opts - 传入的参数对象. 
     * @see defaultOptions
     * @param {element} ithis - 插件执行的对象.
     * @extends initBones
     * @example
     * var uiBones = new Bones(opts, element);
     */
    function Bones(opts, ithis) {
        /**
         * 最终执行于Bones实例的参列
         * @member {Object} Bones~opts
         */
        
        this.opts = $.extend({}, defaultOptions, opts); //再混合一次的目的是防止使用window.Bones调用
        /**
         * 插件根元素  
         * @member {element} Bones~$dom
         * @alias ithis
         */
        this.$dom = $(ithis); //this.$dom指向单个实例的根元素
        initBones.call(this, this.opts); //改变原this到当前bones对象
    };
        

    /** @lends Bones.prototype */
    Bones.prototype = {
    /**
     * @this 指向原型对象即Bones上. 
     * @method Bones#getBonesList
     */
      getBonesList: function() {
          // this bones对象,原型上方法this指向原型对象即Switcth上. 
          return this.$dom.find(this.opts.bonesList);
      },  
      /**
       * 原型上方法this指向原型对象即Bones上. 
       * @method Bones#getBonesList2
       */
      getBonesList2: function() {
          // this bones对象,原型上方法this指向原型对象即Switcth上. 
          return this.$dom.find(this.opts.bonesList);
      }
    }

    /**
     * @external "Cora.fn"
     * @see {@link http://learn.Cora.com/plugins/|Cora Plugins}
     */
    $.extend($.fn, {
        /**
         * A: 转换为插件风格去执行,一个Corajs插件
         * @method Cora#bones
         * @param {Object} options 自定义的属性对象
         * @property {string} test -切换列表 @default
         * @property {function} hideBones -切换内容 
         * @instance Bones
         * @example <caption>options 部分参数使用示例</caption>
         *    $("selector").bones({
         *      test:"mouseover",
         *      hideBones: function(){}
         *    });
         * @example 默认调用方法 $(Select).bones()
         * @mixes defaultOptions
         * @namespace bones
         * @extends Bones
         */
        bones: function(options) {
            //遍历匹配的元素集合
            var args = [].slice.call(arguments, 1);
            //this指向jQuery对象
            return this[0].forEach(function(item) {
                //判断是否实例化过
                var ui = $.data.get(item, "bones");
                if (!ui) {
                    var opts = $.extend({}, defaultOptions, typeof options === "object" ? options : {});
                    //ui 即为实例化过的组件
                    ui = new Bones(opts, item);
                    //实例化后在上面添加标识;
                    $.data.set(item, "bones", ui);
                }

                //如果参数为字符串，或函数则 ui即Tab实例上的方法执行在Tab上,参数为options对象
                if (typeof options === "string" && typeof ui[options] == 'function') {
                    ui[options].apply(ui, args); //执行插件的方法
                }

            });
        }
    });
    /**
     * 插件的默认参数 里面的this指向swc构造函数
     * @namespace defaultOptions
     * @property {string} test -切换列表 
     * @property {function} hideBones -切换内容        
     * @default
     * @augments defaultOptions
     */
    var defaultOptions = {
        test: '1',
        /** @callback */
        hideBones: function() {} //隐藏后回调
    }

    /**
     * B: 在框架中实现注册组件或插件
     * @example 组件使用方式
     * <div widget="pluginsName" data-options='{a:"a",b:"b"}'></div>
     */
    $.regWidget({
        name: 'bones'
    });

    /**
     * C: 在window上全局注册组件或插件
     * @borrows Bones as 
     * @example 组件使用方式 new Bones(opts, item);
     */
    window.Bones = Bones;
})(Cora)
