/**
 * Created by ccjoe on 2015/10/23.
 * @author Joe
 * @email icareu.joe@gmail.com
 */
//----------ģ�黯���ע��(UI���)
(function($) {
    /**
     * ��Corajs��ɨ��ȫ��ע���������
     * @method Cora.widgetize
     * @param {dom} widget
     * @example
     * ���ʹ�÷�ʽ widget="pluginsName" data-options={ a:"a",b:"b"}
     */
    $.widgetize = function(widget) {
        var $widget = $(widget),
            widgetName = $widget.attr('widget'),
            widgetArgs = JSON.parse($widget.attr('data-options')),
            opts = widgetArgs ? widgetArgs : {};

        $.log('ִ�в��: [' + widgetName + ']', {type: 'info'});
        try {
            $widget[widgetName](opts);
        } catch (e) {
            throw Error(e || widgetName + '�����û��ע�ᣡ');
        }
    };

    /**
     * ��Corajs��ע����������Կ���ͨ��dom��widget������data-optionȥע������������
     * @method Cora.regWidget
     * @param {object} opts ���԰���verion, name ..
     * @porproty opts.verion �汾��
     * @porproty opts.name �����
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
     * ��Corajs��ָ��Ԫ����ж�����
     * @method Cora.unWidget
     * @param {element} elem ж�������ָ����Ԫ��
     */
    $.unWidget = function(elem){
        // ж���ѻ���ʵ��
        $.data.del(elem);
        //ж��������ʵ��
        elem.innerHTML = '';
    }

})(Cora);