/**
 * Created by sfliu on 2015/10/28.
 */
/* _______________________________________
 * | @author  >|   Joe                    |
 * | @email   >|   icareu.joe@gmail.com   |
 * | @date    >|   2014-04-16 13:51:13    |
 * | @content >|   Ϊ�����ڶ�Ŀ¼������� |
 * | @content >|   �Զ����� ����h1--h6ʶ��|
 * | @content >|   ��λ����㼶           |
 * |___________|__________________________|
 */
/*
 * �����Բ��Լ��ݵ� ie7, ie6��δ����
 */

(function($){
    $.fn.guide = function(options){
        //��ϲ���
        options = options || {};
        //console.log($.fn.guide.defaults);
        opts = $.extend({},$.fn.guide.defaults,options);
        var $cont = $(this);

        //һ��ҳ���֧��һ����������
        if($cont.length > 1){
            return;
        }

        var init = function(){
                //��Ŀ¼������ʽ
                styleGuide(opts.guideClass);

                hxArrSet = _getHxLen();
                if(!hxArrSet) return;
                // �����������h1-h6
                if(parseInt(hxArrSet.join(""),10) > 0){

                    //���Ŀ¼���
                    _showFrame();

                    //��Ŀ¼����
                    addAnchor("linked");

                    //�����滻
                    hxSort();

                    //Ϊ����hx���
                    setNo();

                    if(opts.isScorllShow){
                        scrollShow();
                    }
                }
            },

        //��ȡh1-h6������ֵ
            _getHxLen = function(){
                var num, total = 0,
                    hxArr    = [];          //��Ŷ༶Ŀ¼������
                for(var i=1; i<=6; i++){
                    //hxObj.push($cont.find("h"+i));
                    num = $cont.find("h"+i).length;
                    total += num;
                    hxArr.push(num);
                }
                //���hx������ hxnum ������ʾ����
                if(total < opts.hxnum){
                    return;
                }

                //���ذ���hx��������hx���ȵ�����
                return hxArr;
            },

        //��������
            _showFrame = function(){
                var $placeDom = $(opts.placeDom);
                $placeDom.prepend('<div class='+opts.guideClass.slice(1)+'></div>');
                var $guideDom = $placeDom.find(opts.guideClass);

                if(opts.placeDom === 'body'){
                    $guideDom.addClass('fixed').removeClass('relate');
                }else{
                    $guideDom.addClass('relate').removeClass('fixed').prepend('<span class="switch-pos">�л���ʾ</span>');
                    $placeDom.find('.switch-pos').click(function(){
                        !$guideDom.hasClass('fixed') ?
                            $guideDom.addClass('fixed').removeClass('relate') :
                            $guideDom.addClass('relate').removeClass('fixed');
                    });
                }
            },

        //����ê�� ��link Or Linked
            addAnchor = function(linkOrLinked){
                //����h1-h6
                var thishx;
                //hno h�ļ���  h1, h2
                //hnum h�������
                for(var hno=1; hno<=6; hno++){
                    //����hx�����
                    if(hxArrSet[hno-1] > 0){
                        var hsumno = 1; //ͬ����hx���
                        //��ÿһ��hx����
                        for(var hnum=1; hnum <= hxArrSet[hno-1]; hnum++){
                            if(linkOrLinked === "linked"){
                                //����ê��������class hx�Ա�hx�滻��a�������
                                thishx = $cont.find("h"+hno).eq(hnum-1).addClass("h"+hno);
                                thishx.attr({"name":"to"+hno+hnum, "id":"to"+hno+hnum});

                            }else if(linkOrLinked === "link"){

                                //����ê������    hx���滻��a�������޷����ң������class����
                                //ȥ���������
                                thishx = $(opts.guideClass).find(".h"+hno).eq(hnum-1).attr({"href":'#to'+hno+hnum}).attr({"code-num": '#to'+hno+hnum});

                                //ֻ֧������Ŀ¼
                                //��h2��ʼ���
                                if(hno === 2){
                                    thishx.prepend('<span>'+ hnum +' </span>');
                                }else if(hno === 3){
                                    //���ǰ����ͬ�������+1������
                                    thishx.prev().hasClass('h'+hno) ? hsumno++ : (hsumno=1);
                                    //����������ϼ�hx
                                    var subIndex = parseInt(getClosestElemByClass(thishx, 'a.h2').find('span').text(),10);
                                    thishx.prepend('<span>'+ subIndex + '.' + hsumno + ' </span>');
                                }else if(hno > 3){
                                    thishx.prepend('<span>? </span>');
                                }

                                //�滻��ǩ�����class�Ա㲻Ӱ�����
                                thishx.replaceWith('<a code-num="#to'+hno+hnum+'" href="#to'+hno+hnum+'" class="h'+ hno +'">' + thishx.html()+ '</a>');

                            }

                        }
                    }
                }
            },
        //��ȡͬ�������classNameԪ�أ��ϼ���closest();
            getClosestElemByClass = function($elem, className){
                return !$elem.prev().hasClass(className) ? $elem.prev() : getClosestElemByClass($elem.prev(), className);
            },

        //����sort
            hxSort = function(){
                var newHxDom =$cont.find("h1,h2,h3,h4,h5,h6").clone();
                $(opts.guideClass).append(newHxDom);
                //���ê������
                addAnchor("link");
            },
        //Ϊ������ӱ��
            setNo = function(){
                $(opts.guideClass).find('a').each(function(i,item){
                    var $i = $(item);
                    var findIndex = $i.attr('href').substring(1);
                    var findNo = $i.find('span').text();
                    $cont.find('[name="' + findIndex + '"]').prepend('<span>'+findNo+'</span>');
                })
            },
        //�����������ʽ
            styleGuide = function(mainClass){
                var $styleDom = $('<style type="text/css"></style>');
                var guideFrame =
                    mainClass + '{max-width:280px; background-color : #fff; padding : 10px; z-index: 10000}' +
                    mainClass + '.fixed{top:50%; right:10px;  margin-top : -150px; overflow : auto; z-index : 10000; position: fixed; box-shadow: 0 1px 10px #999; max-height : 300px;}' +
                    mainClass + '.relate{border : 2px solid #ddd; position: relative; margin:0 0 0  50px; float: right;}' +
                    mainClass + ' a { display: block; font-size: 12px; color: #333; text-decoration: none; line-height : 24px; padding-left : 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-algin: left }' +
                    mainClass + ' a.active { color:green }'+
                    mainClass + ' .h1{ font-size: 15px; font-weight: bold; border-bottom : 1px solid #ddd; margin-bottom: 8px; max-width: 200px; padding-right:80px; }' +
                    mainClass + ' .h2{ color: #555; font-size: 13px; font-weight:bold; margin-bottom:1px;}' +
                    mainClass + ' .h3{ margin-left: 15px; color: #666; font-size: 13px;  margin-bottom:2px; }' +
                    mainClass + ' .h4{ margin-left: 30px; color: #777;  margin-bottom:4px;  }' +
                    mainClass + ' .h5{ margin-left: 45px; color: #999;  margin-bottom:6px;  }' +
                    mainClass + ' .h6{ margin-left: 60px; color: #aaa;   }' +
                    mainClass + ' .switch-pos{ position:absolute; right:10px; top: 5px; color: #fff; background-color:rgba(0,0,0,.5); cursor: pointer; padding: 0 5px; font-size:13px; line-height:25px; border-radius:2px;}';
                //ie
                if( $styleDom[0].styleSheet ){
                    $styleDom[0].styleSheet.cssText = guideFrame;
                }else{
                    $styleDom.text(guideFrame);
                }

                $("head").append($styleDom);
            },

            scrollShow = function(){
                var $keyElem;
                //����ʱ��Ӧ��ʾ������Ŀ
                $(window).scroll(function(){
                    $cont.find("h1,h2,h3,h4,h5,h6").each(function(){
                        //ֻҪ������Χû�������ĳһ��hxԪ��, ��hx����һ����Ϊ���������
                        if( Math.ceil( $(this).offset().top ) - $(window).scrollTop() >= 5 ){
                            //�ҳ���С�Ĵ���0��hxԪ��,��href���ҵĻ���ie7��ǰhref���Զ���������
                            $keyElem = $('a[code-num="#'+$(this).attr("name")+'"]');
                            $keyElem.prev().addClass("active").siblings().removeClass("active");
                            return false;
                        }else{
                            if($keyElem)
                                $keyElem.addClass("active").siblings().removeClass("active");
                        }
                    })
                });
            };
        //����
        init();
    };

    //Ĭ�ϲ���
    $.fn.guide.defaults = {
        guideClass   : ".guide-frame", //
        placeDom: "body",   //����Ĭ����body��������;
        hxnum: 5,            //���hx������ hxnum ������ʾ����
        isScorllShow : true
    };

    /**
     * B: �ڿ����ʵ��ע���������
     * @example ���ʹ�÷�ʽ
     * <div widget="pluginsName" data-options='{a:"a",b:"b"}'></div>
     */
    $.regWidget({
        name: 'guide'
    });
})(jQuery);
