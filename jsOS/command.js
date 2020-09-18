/*操作系统的命令函数文件 操作一切底层设备 作为核心文件*/
/*控制台*/

/*显示当前时间*/
function showTime() {
    consoleOut(new Date());
}
//创建窗口
function cmdCreateWindow() {
    createJsWindow();
}
//为方法绑定时钟,返回时钟ID
function cmdBindClock(fun = null, time = 10) {
    if (fun != null)
        return bindClock(fun, time);
    else
        consoleOut("cmd绑定时钟失败")
}
//移除时钟,手动ID
function cmdRemoveClock(clockID = null) {
    if (clockID != null)
        return removeClock(clockID);
    else
        consoleOut("cmd移除时钟失败")
}
//清楚除所有时钟
function cmdClearAllClock() {

    while (clockList.length > 0)
        removeClock(clockList[0]);
    clockList = []
}
//返回所有时钟
function showAllClock() {
    consoleOut(clockList.toString());
}




//启动设备管理器
function cmdRunDC() {
    runDeviceControl();
}
//关闭设备管理器
function cmdstopDC() {
    stopDeviceControl();
}