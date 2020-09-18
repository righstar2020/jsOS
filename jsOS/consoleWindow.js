/*设备:1.控制台 包括设备主窗口以及一些输出的函数*/
var consoleWindow = document.getElementById("consoleWindow");

function consoleClear() {
    while (consoleWindow.children.length > 0)
        consoleWindow.removeChild(consoleWindow.lastChild)
    createInputDom();
}




function inputFocus() {
    var consoleInput = $("#consoleInput>input");
    consoleInput.focus();
}
inputFocus();
//consoleWindow.onclick = inputFocus

function createInputDom() {
    var dom = document.createElement('div');
    dom.className = 'consoleInput';
    dom.id = "consoleInput"
    dom.innerHTML = ">&nbsp; <input type='text' autofocus='autofocus' onkeydown='scanInput(event)' />"
    consoleWindow.appendChild(dom)
    inputFocus()
    return dom;
}




function rmInputDom() {
    var self = document.getElementById("consoleInput");
    if (self != null && self.parentElement) {
        var parent = self.parentElement;
        return parent.removeChild(self);
    } else {
        return;
    }

}
/*
 *参数解释
 *str:输出的文本
 *endOut:是否为程序最后一个输出
 */
function consoleOut(str = "  ", waitEnd = true, exceptErr = null) {
    var dom = document.createElement('div');
    str = str.toString()
    if (exceptErr != null) {
        str += exceptErr.toString();
        console.log(exceptErr);
    }

    dom.className = 'consoleText';
    dom.innerHTML = ">&nbsp;&nbsp;" + str;
    rmInputDom();
    consoleWindow.appendChild(dom);
    if (waitEnd)
        createInputDom();
    console.log(str)
}