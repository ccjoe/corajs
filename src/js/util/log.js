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
     * ���Debug��Ϣ
     * @method Cora.log
     * @namespace
     * @param {string} output �����Ϣ������
     * @param {Object} opts ������������
     * @prop opts.type {string}  options �����Ϣ�����͡�error, warning, log��
     * @prop opts.color {string} options �����Ϣ����ɫ
     * @prop opts.size  {string} options small large x-large... �����Ϣ�Ĵ�С
     * @prop opts.shadow {boolean}  options true/false �����Ϣ�Ƿ����Ӱ
     * @prop opts.css  {css} options css key:value pairs�����Ϣ����ʽ��Ҳ���Ը�д��ɫ���С
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
     * ��֧��һ�����һ������
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
     * ���Debug������Ϣ
     * @method Cora.log.group
     * @param {string} name ������
     * @param {function} cb ���������
     * @param {boolean} collapsed �Ƿ��۵�
     * @todo ��ʱ��̫�����壬��Ϊ����ִ����console���IE����ܲ�ִ��
     */
    log.group = function(name, cb, collapsed) {
        collapsed = collapsed || false;

        console[collapsed ? 'groupCollapsed' : 'group'](name, Cora.config.debugLabel);
        cb();
        console.groupEnd();
    };
    /**
     * ���Debugִ��ʱ����Ϣ
     * @method Cora.log.time
     * @param {string} name ������
     * @param {function} cb ������ִ��ʱ��Ķ���
     * @param {function} times ִ�д���
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
     * ���Debugִ��ʱcpu��Ϣ, ��chrome profile���鿴��Ӧ����
     * @method Cora.log.cpu
     * @param {string} name profile����
     * @param {function} cb ������ִ��ʱ��Ķ���
     * @param {function} times ִ�д���
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