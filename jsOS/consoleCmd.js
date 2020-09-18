/*在控制台执行命令的一些函数*/
/*所有支持的命令及参数的解释*/
/*部分命令使用eval函数实现,多为不需传参的函数*/
var cmdList = [{
    name: 'cls',
    cmd: 'consoleClear',
    describe: '清空控制台命令,无参数'
}]

function scanCmd(cmd) {
    //命令后可带参数,用一个空格隔开
    var parm = null;
    var strArr = cmd.split(" ");
    if (strArr.length > 1) {
        cmd = strArr[0];
        parm = strArr[1];
    }
    //下面部分命令用case扫描
    switch (cmd) {
        case 'cls':
            consoleClear();

            break;
        case 'showtime':
            showTime();
            break;
        case 'createWindow':
            cmdCreateWindow();
            break;
        case 'bindClock':
            cmdBindClock();
            break;
        case 'rmClock':
            if (parm != null)
                cmdRemoveClock(parm);
            else
                cmdRemoveClock();
            break;
        case 'clearClock':
            cmdClearAllClock();
            break;
        case 'showClock':
            showAllClock();
            break;
        case 'runDC':
            cmdRunDC();
            break;
        case 'stopDC':
            cmdstopDC();
            break;
        default:
            consoleOut("命令错误或命令未实现");
            break;
    }
}

function pushCmdHistory(cmd) {
    cmdHistory.push(cmd);
    cmdHistoryIndex = cmdHistory.length
    if (cmdHistory.length > 100)
        cmdHistory.splice(0, 1)
}

function inputNextLine() {
    var str = $("#consoleInput>input").val();
    //写入历史命令
    pushCmdHistory(str)
    consoleOut(str);
    scanCmd(str);
}
//设置光标位置
function setCaretPosition(ctrl, pos) {
    // Modern browsers

    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
        console.log(ctrl, " " + pos)
            // IE8 and below
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();

    }
}

function getCmdHistory(up = true) {
    //注意jQuery语法,jq为对象数组
    var input = $("#consoleInput>input")[0];

    if (up && cmdHistory.length > 0 && cmdHistoryIndex > 0) {
        cmdHistoryIndex -= 1;
        input.value = (cmdHistory[cmdHistoryIndex]);
        //设置光标位置
        setCaretPosition(input, input.value.length)
    } else if (!up && cmdHistory.length > 0 && cmdHistoryIndex < cmdHistory.length - 1) {
        cmdHistoryIndex += 1;
        input.value = (cmdHistory[cmdHistoryIndex]);
        setCaretPosition(input, input.value.length)
    }


}

function scanInput(e) {
    try {
        //扫描回车
        if (event.keyCode == "13") {
            inputNextLine();

        }
        //箭头键由onkeydown检测
        //扫描箭头上
        if (event.keyCode == "38") {
            getCmdHistory();

        }
        //扫描箭头下
        if (event.keyCode == "40") {
            getCmdHistory(false);
        }
    } catch (e) {
        consoleOut("扫描命令或执行时出现了一些错误", e)
    }

}