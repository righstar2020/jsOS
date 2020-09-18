(function() {
    var d = new OS("jsOs");
    try {
        d.run("时间:" + (String)(new Date()))
    } catch (c) {
        consoleOut("系统启动出现一些错误", c)
    }
})();