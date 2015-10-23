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
})