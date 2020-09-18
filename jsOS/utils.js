/*
 *一些操作dom和
 *判断的数学工具函数
 */
//判断是否为DOM节点
var isDOM = (typeof HTMLElement === 'object') ?
    function(obj) {
        return obj instanceof HTMLElement;
    } :
    function(obj) {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
    //对象深拷贝
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
//通过Base64监听数组变化
var Base64Code = [];

function isArrayChange(arr = null) {

    var str = JSON.stringify(arr);
    str = encodeURIComponent(str); //中文转码
    var code = window.btoa(str);
    for (var i = 0; i < Base64Code.length; i++) {
        if (Base64Code[i] == code) return false;
    }


    Base64Code.push(code);
    return true;
}