/**
 * Created by ccjoe on 2015/10/23.
 * @author Joe
 * @email icareu.joe@gmail.com
 */
/**
 * �򵥵ķ�������ģʽ(publisher-subscriber)
 * @class Cora.PS
 * @namespace
 * @exampl
 * Cora.PS.add('pubNO1', function(data){
     *      console.log('����������ʱ���ĵĶ����ߣ����ܵ���������:', data);
     * });
 * function subNo1(data, name){
     *      console.log('subNo1���ĵ�'+name+'���󣬽����ܵ���Ϣ��Ϊ��', data);
     * }
 * function subNo2(data, name){
     *      console.log('subFn2���ĵ�'+name+'���󣬽����ܵ���Ϣ��Ϊ��', data);
     * }
 * Cora.PS.add('pubNO2');  //���������� pubNO2;
 * subNo1.sub('pubNO1');   //subNo1���ĵ� pubNO1
 * subNo2.sub('pubNO1').sub('pubNO2');   //subNo2���ĵ� pubNO1
 * Cora.PS.send('pubNO1', {data:123}) //pubNO1������Ϣ
 * Cora.PS.send('pubNO2', {data:'pubNo2 From!'}) //pubNO1������Ϣ
 * @todo ��Ҫ���巢�����Ļ��ƴ�����PS������һ��PS����ά������ӷ����߻��Ƹ��ã�
 * @done ���Ϊһ��PS���󣬹������з������Ķ���
 */
(function(Cora){
    var PubSub = function(){
        //��������, ��Ϊ������name,ֵΪ����������,
        this.pubs = {
            /*puberName: [suber, suber2]*/
        };
    };
    var ps = new PubSub();
    PubSub.prototype.get = function(name){
        return this.pubs[name];
    };
    PubSub.prototype.set = function(name, subArr){
        return this.pubs[name] = subArr;
    };

    /**
     * �������������ߣ������ж�����ʱ�󶨴���Ķ�����
     * ����������Ѵ��ڣ���Ϊ���÷�����
     * @method Cora.PS#addPub
     * @param {string} name ���������ƻ��ʶ
     * @param {function} [sub1, sub2, ...] ������
     * @return {object} Cora.PS ����
     */
    PubSub.prototype.add = function(name /*, sub1, sub2...*/){
        var subs = this.get(name) || [];
        if(subs.length){
            Cora.log('�Ѵ���'+name+'������,�������ö�����', {type: 'warn'});
        }
        var addsubs = Cora.toArray(arguments);
        addsubs.shift();
        this.set(name, addsubs);
        return this;
    };
    /**
     * name�ķ����߷�������
     * @method Cora.PS#send
     * @param {string} name ���������ƻ��ʶ
     * @param {object} data ����������
     * @return {object} Cora.PS ���󼴷�����
     */
    PubSub.prototype.send = function(name, data){
        // ��deliverʱ�����߼�ִ��
        this.pubs[name].forEach(function(sub){
            sub(data, name);
        });
        return this;
    };
    /**
     * @method Function#sub
     * @param {string} name ���ĵ� name �ķ�����
     * @return {function} ������
     */
    Function.prototype.sub = function(name){
        var isExist = ps.get(name).has(this);
        if(!isExist){
            ps.pubs[name].push(this);
        }
        return this;
    };
    /**
     * @method Function#unsub
     * @param {string} name ȡ�����ĵ�ĳpub(PS)����
     * @return {function} ȡ��������
     */
    Function.prototype.unsub = function(name){
        ps.pubs[name].remove(this);
        return this;
    };

    return ps;
})(Cora);