Cora.log = (function() {
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
     * Cora.log("show in console");
     * Cora.log("show in console", {
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

        console[collapsed ? 'groupCollapsed' : 'group'](name, Cora.config.debugLabel);
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