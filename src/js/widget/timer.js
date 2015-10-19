/**
 * @author Joe <icareu.joe@gmail.com>
 * @email icareu.joe@gmail.com   
 * @date 2014-07-16 10:15:13   
 * @content Timer                 
 */

(function($) {
    
    var init = {
        timerComponents: function (){
            return {
                ten: '<div class="cell"><div class="numbers moveten">0 1 2 3 4 5 6 7 8 9</div></div>',
                six: '<div class="cell"><div class="numbers movesix">0 1 2 3 4 5 6</div></div>',
                div: '<div class="cell divider"><div class="numbers">:</div></div>',
                className: ['tenhour', 'hour', 'tenminute', 'minute', 'tensecond', 'second', 'milisecond', 'tenmilisecond', 'hundredmilisecond'],
                css:'.moveten {\
                      animation: moveten 1s steps(10, end) infinite;\
                      animation-play-state: paused;\
                      }\
                    .movesix {\
                      animation: movesix 1s steps(6, end) infinite;\
                      animation-play-state: paused;\
                    }\
                    .animation-none{animation: none;}\
                    .second{animation-duration: 10s;}\
                    .tensecond{animation-duration: 60s;}\
                    .milisecond {animation-duration: 1s;}\
                    .tenmilisecond {animation-duration: 0.1s;}\
                    .hundredmilisecond {animation-duration: 0.01s;}\
                    .minute {animation-duration: 600s;}\
                    .tenminute {animation-duration: 3600s;}\
                    .hour {animation-duration: 36000s;}\
                    .tenhour {animation-duration: 360000s;}\
                    @keyframes moveten {\
                      0% {top: 0;}\
                      100% {top: -400px;}\
                    }\
                    @keyframes movesix {\
                      0% {top: 0;}\
                      100% {top: -240px;}\
                    }\
                    .timer {\
                      padding: 10px;\
                      background: linear-gradient(top, #222, #444);\
                      overflow: hidden;\
                      display: inline-block;\
                      border: 7px solid #efefef;\
                      border-radius: 5px;\
                      position: relative;\
                      box-shadow: \
                        inset 0 -2px 10px 1px rgba(0, 0, 0, 0.75), \
                        0 5px 20px -10px rgba(0, 0, 0, 1);\
                    }\
                    .cell {\
                      width: 0.60em;\
                      height: 40px;\
                      font-size: 50px;\
                      overflow: hidden;\
                      position: relative;\
                      float: left;\
                    }\
                    .numbers {\
                      width: 0.6em;\
                      line-height: 40px;\
                      font-family: digital, arial, verdana;\
                      text-align: center;\
                      color: black;\
                      position: absolute;\
                      top: 0;\
                      left: 0;\
                      animation-play-state:running;\
                    }'
            }
        }, 

        makeTimer: function (ithis, opts){
            var s = this.timerComponents();
            var domhms = s.ten+s.ten+s.div+s.six+s.ten+s.div+s.six+s.ten;
            var dommills = s.div + s.ten + s.ten + s.ten;
            var domtimer = domhms + dommills;
            ithis.insert('front', '<div class="timer">'+domtimer+'</div>');

            var $numbers = ithis.find('.cell:not(.divider) .numbers');
            $numbers.each(function(item, i){
                $(item).addClass(s.className[i]);
            });
            ithis.addCssBlock(s.css);
        }      
    }
    /**
     * 初始化执行插件 this没有执行环境时指向window, call后执行在Timer对象上
     * @method initTimer
     * @this {widnow} 
     */
    function initTimer(opts) {
        init.makeTimer(this.$dom, opts);
    }
    
    
    /**
     * 此构造函数一般不直接调用，是用来实现插件化的中间过程；如果注册了window.Timer，则可以直接调用以便灵活处理
     * @class Timer
     * @param {object} opts - 传入的参数对象. 
     * @see defaultOptions
     * @param {element} ithis - 插件执行的对象.
     * @extends initTimer
     * @example
     * var uiTimer = new Timer(opts, element);
     */
    function Timer(opts, ithis) {
        /**
         * 最终执行于Timer实例的参列
         * @member {Object} Timer~opts
         */
        this.opts = $.extend({}, defaultOptions, opts); //再混合一次的目的是防止使用window.Timer调用
        /**
         * 插件根元素  
         * @member {element} Timer~$dom
         * @alias ithis
         */
        this.$dom = $(ithis); //this.$dom指向单个实例的根元素
        initTimer.call(this, this.opts); //改变原this到当前timer对象
    };
        

    /** @lends Timer.prototype */
    Timer.prototype = {
         _getNos: function(){
            return this.$dom.find('.numbers');
         },
        /** @method Timer#stop -停止计时*/
        stop: function(){
            this._getNos().removeClass('animation-none').css({'animation-play-state':'paused'});
        },      
        /** @method Timer#start -开始计时*/
        start: function(){
            this._getNos().removeClass('animation-none').css({'animation-play-state':'running'});
        },      
        /** @method Timer#reset -重置计时*/
        reset: function(){
            this._getNos().addClass('animation-none');
        }
    };

    /**
     * @external "Cora.fn"
     * @see {@link http://learn.Cora.com/plugins/|Cora Plugins}
     */
    $.extend($.fn, {
        /**
         * A: 转换为插件风格去执行,一个Corajs插件
         * @method Cora#timer
         * @param {Object} options 自定义的属性对象
         * @property {string} test -切换列表 @default
         * @property {function} hideTimer -切换内容 
         * @instance Timer
         * @example <caption>options 部分参数使用示例</caption>
         *    $("selector").timer({
         *      test:"mouseover",
         *      hideTimer: function(){}
         *    });
         * @example 默认调用方法 $(Select).timer()
         * @mixes defaultOptions
         * @namespace timer
         * @extends Timer
         */
        timer: function(options) {
            //遍历匹配的元素集合
            var args = [].slice.call(arguments, 1);
            //this指向jQuery对象
            return this.each(function(item, i) {
                //判断是否实例化过
                var ui = $.data.get(item);
                if (!ui) {
                    var opts = $.extend({}, defaultOptions, typeof options === "object" ? options : {});
                    //ui 即为实例化过的组件
                    ui = new Timer(opts, item);
                    //实例化后在上面添加标识;
                    $.data.set(item,  ui);
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
     * @property {string} type -timer类型 timer-stopwatch timer-countdown timer-show
     * @property {function} hideTimer -切换内容        
     * @default
     * @augments defaultOptions
     */
    var defaultOptions = {
        type: 'timer-count',
        show: ['hour', 'minute', 'second', 'milisecond'],
    }

    /**
     * B: 在框架中实现注册组件或插件
     * @example 组件使用方式
     * <div widget="pluginsName" data-options='{a:"a",b:"b"}'></div>
     */
    $.regWidget({
        name: 'timer'
    });

    /**
     * C: 在window上全局注册组件或插件
     * @borrows Timer as 
     * @example 组件使用方式 new Timer(opts, item);
     */
    window.Timer = Timer;
})(Cora)
