/*系统的主时钟程序
 *采用浏览器setInterval()函数异步并发运行
 *提供进程调度器运行时
 *进程调度器同步策略下
 *clock时钟提供应用程序由调度器给定的运行时
 *提供设备控制器主时钟及设备的运行时
 *通过promise操作异步执行弱化系统卡顿现象
 */


//为方法绑定一个循环时钟
//fun方法, time 周期
function bindClock(fun = null, time = 10) {
    var clockID;
    clockID = setInterval(fun, time);
    if (typeof fun == "function") {
        //获取方法名称
        consoleOut(fun.name + "方法绑定了时钟" + clockID + " time=" + time + "ms")
    }
    clockList.push(clockID);
    return clockID;
}

//移除一个时钟,从clockList
function removeClock(clockID) {

    clearInterval(clockID);
    if (clockList.length > 0)
        for (var i = 0; i < clockList.length; i++) {
            if (clockList[i] == clockID) {
                consoleOut("移除时钟" + clockList[i] + "成功")
                clockList.splice(i, 1);
                return true;
            }
        }
    else
        consoleOut("未找到任何时钟")
}

//更新屏幕显示的时间
function updateScreenTime() {
    var timeStr = getOSTimeStr();
    var toDay = getOSTimeStr(new Date().getTime(), 3);
    var toMin = getOSTimeStr(new Date().getTime(), 4);
    var toDay2 = getOSTimeStr(new Date().getTime(), 5);
    var screenTimeDom = document.getElementById("screenTime");
    screenTimeDom.innerHTML = toMin + '<br/>' + toDay;
    screenTimeDom.title = toDay2;
}

function updateOSTime() {
    //更新系统时间
    OSTime = new Date().getTime();
    updateScreenTime();
}

function initOSTime() {
    //初始化系统时间更新时钟
    bindClock(updateOSTime, 1); //更新时间绑定时钟,每1ms
}

//一些系统时间格式的转换函数

function getOSTimeStr(timestamp = new Date().getTime(), type = 1) {
    // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
    var date = new Date(timestamp);
    var str;
    Y = date.getFullYear();
    //M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    M = date.getMonth() + 1;
    D = date.getDate();
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    if (type == 1)
        str = " " + h + ':' + m + ':' + s + "<br/>" + Y + '/' + M + '/' + D + ' ';
    if (type == 2) //hh:mm:ss
        str = " " + h + ':' + m + ':' + s;
    if (type == 3) //YYYY/MM/DD
        str = Y + '/' + M + '/' + D;
    if (type == 4) //hh:mm
        str = " " + h + ':' + m;
    if (type == 5) //年月日
        str = Y + '年' + M + '月' + D + '日';
    return str;
}