/**
 * Created by sfliu on 2015/10/20.
 */
//charset 'utf-8';
/* Test Core Cora.is{Type}*/
describe("检测类型相关", function(){
    //'Boolean', 'Number', 'String', 'Function', 'Object', 'Array', 'Date', 'Regexp', 'Error', 'Undefined', 'Null', HTMLCollection, HTML(TagName)Element
    it("Cora.type检测类型", function(){
        expect(Cora.type({}) === 'Object').toBe(true);
        expect(Cora.type({a:1}) === 'Object').toBe(true);
        expect(Cora.type(null) === 'Null').toBe(true);
        expect(Cora.type([]) === 'Array').toBe(true);
        expect(Cora.type(NaN) === 'Number').toBe(true);
        expect(Cora.type('') === 'String').toBe(true);
        expect(Cora.type('123') === 'String').toBe(true);
        expect(Cora.type(123) === 'Number').toBe(true);
        expect(Cora.type(0) === 'Number').toBe(true);
        expect(Cora.type(0) === 'Boolean').toBe(false);
        expect(Cora.type(true) === 'Boolean').toBe(true);
        expect(Cora.type(false) === 'Boolean').toBe(true);
        expect(Cora.type(undefined) === 'Undefined').toBe(true);
        expect(Cora.type(function(){}) === 'Function').toBe(true);
        expect(Cora.type(function(){return true}) === 'Function').toBe(true);
    });

    //'isBoolean', 'isNumber', 'isString', 'isFunction', 'isArray', 'isDate', 'isRegexp', 'isError', 'isUndefined', isNull, isNaN, isHTML
    it("Cora.is[type]检测类型", function(){
        expect(Cora.isObject({})).toBe(true);
        expect(Cora.isObject({a:1,b:[]})).toBe(true);
        expect(Cora.isObject(NaN)).toBe(false);
        expect(Cora.isObject([])).toBe(false);

        expect(Cora.isFunction(function(){})).toBe(true);
        expect(Cora.isFunction(function(){return false})).toBe(true);

        expect(Cora.isArray([])).toBe(true);
        expect(Cora.isArray([1,2,3])).toBe(true);
        expect(Cora.isArray([{a:1},{b:2}])).toBe(true);

        expect(Cora.isNumber(0)).toBe(true);
        expect(Cora.isNumber(1)).toBe(true);
        expect(Cora.isNumber(123)).toBe(true);
        expect(Cora.isNumber(null)).toBe(false);
        //NaN可以判断类型为 isNumber 与 isNaN;
        expect(Cora.isNumber(NaN)).toBe(true);
        expect(Cora.isNaN(NaN)).toBe(true);

        expect(Cora.isBoolean(NaN)).toBe(false);
        expect(Cora.isBoolean(true)).toBe(true);
        expect(Cora.isBoolean(false)).toBe(true);
        expect(Cora.isBoolean(0)).toBe(false);
        expect(Cora.isBoolean(1)).toBe(false);

        expect(Cora.isUndefined(void 0)).toBe(true);
        expect(Cora.isUndefined(undefined)).toBe(true);

        expect(Cora.isDate(new Date())).toBe(true);
        expect(Cora.isDate(1440000)).toBe(false);
        expect(Cora.isDate((new Date()).toLocaleString )).toBe(false);

        //expect(Cora.isRegexp(/\S/)).toBe(true);
        //expect(Cora.isRegexp(new RegExp(/\S/))).toBe(true);

        expect(Cora.isError(new Error('test error'))).toBe(true);
        expect(Cora.isError(Error('test error 2'))).toBe(true);

        expect(Cora.isNull(null)).toBe(true);
        expect(Cora.isNull(NaN)).toBe(false);
        expect(Cora.isNull('')).toBe(false);

        //expect(Cora.isHTML(document.getElementById('#test'))).toBe(true);
    });
});

describe("String扩展方法测试", function(){
    it("String#pad 字符串测试", function(){
        console.log('test'.pad(5));
        console.log('test'.pad(5,0));
        console.log('teststr'.pad(10,0,'right'));
    });

    it("String#countdownFormat", function(){
        expect(true).toBe(true);
        console.log(new Date().countdownFormat(+new Date()), '显示00：00：00 0000');
        console.log(new Date().countdownFormat(+new Date()+1000*0.8), '显示00：00：00 0800');
        console.log(new Date().countdownFormat(+new Date()+1000*1.5), '显示00：00：01 0500');
        console.log(new Date().countdownFormat(+new Date()+1000*60), '显示00：01：00 0000');
        console.log(new Date().countdownFormat(+new Date()+1000*61.1), '显示00：01：01 0100');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60), '显示01：00：00 0000');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60+1000), '显示01：06：01 0000');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60+1000*61.1), '显示01：01：01 0100');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60*23+1000*61.1), '显示23：01：01 0100');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60*24+1000*61.1, {showDay:true}), '显示1天 00：01：01 0100');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60*24), '00：00：00 0000');
        console.log(new Date().countdownFormat(+new Date()+1000*60*60*24, {showDay:true, showMillSecond:true}), '显示1天 00：00：00 0000');
    });

    it("Cora.template For Test", function(){
        expect(true).toBe(true);
        //expect(Cora.template('<% data %>', {data:123}) === '123').toBe(true);
    });
});

describe("Array测试", function(){
    $.log('array.prototype.somemethod，somemethod不存在时才会调用到,对于测试不便测到！', {type: 'info'});
});

describe("Cora.PS 发布订阅对象测试", function(){
    Cora.PS.add('pubNO1', function(data){
        console.log('创建发布者时订阅的订阅者，接受到的数据是:', data);
    });
    function subNo1(data, name){
        console.log('subNo1订阅到'+name+'对象，将接受到消息，为：', data);
    }
    function subNo2(data, name){
        console.log('subFn2订阅到'+name+'对象，将接受到消息，为：', data);
    }
    Cora.PS.add('pubNO2');  //新增发布者 pubNO2;
    subNo1.sub('pubNO1');   //subNo1订阅到 pubNO1
    subNo2.sub('pubNO1').sub('pubNO2');   //subNo2订阅到 pubNO1
    subNo2.unsub('pubNO1');   //subNo1订阅到 pubNO1

    it("发布消息", function(){
        Cora.PS.send('pubNO1', {data:123}); //pubNO1发布消息
        Cora.PS.send('pubNO2', {data:'pubNo2 From!'}); //pubNO1发布消息
    });

    it("添加重复发布对象会覆盖之前的发布订阅绑定", function(){
        Cora.PS.add('pubNO2');
        Cora.PS.send('pubNO2', {data:'此消息应该不会显示出来'}); //pubNO1发布消息
        console.log('不会触发之前的绑定，此处应无订阅消息');
    })
});

describe("Cora.url 测试获取url对象", function(){
    var urlarr = ['http://www.test.com/a/b/c?test=1&kk=2#hash/p1/p2/p3?htest=1&hh=2',
        'http://www.test.com/a/b/c/?test=1&kk=2#hash/p1/p2/p3',
        'http://www.test.com/a/b/c?test=1&kk=2#hash?htest=1&hh=2',
        'http://www.test.com/a/b/c/?test=1&kk=2#hash',
        'http://www.test.com/a/b/c',
        'http://www.test.com/#hash',
        'https://test.cn/#hash',
        'http://www.test.com/',
        'http://test.com/',
        'http://test.com/',
        '/a/b/c#hash/p1/p2/p3/?test=1&kk=2',
        '#hash/p1/p2/p3/?test=1&kk=2',
        '#test?test=1&kk=2',
        '?test=1&kk=2',
        '#hash',
        ''];

    it("测试打印内容", function(){
        for(var i=0 ; i<urlarr.length; i++){
            var item = urlarr[i];
            var urls = Cora.url.get(item);
            console.log(urls);
        }
        console.log('----------------------------');

        for(var j=0 ; j<urlarr.length; j++){
            var item = urlarr[j];
            console.log(Cora.url.get(item, true));
        }
        console.log('----------------------------');

        for(var k=0 ; k<urlarr.length; k++){
            var item = urlarr[k];
            console.log(Cora.url.getParams(item));
        }
        console.log('----------------------------');

    });
});