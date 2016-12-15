/**
 * Created by ccjoe on 2015/10/23.
 * @author Joe
 * @email icareu.joe@gmail.com
 */
//----------模块化组件注册(UI组件)
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