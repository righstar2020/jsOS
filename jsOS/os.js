class OS {
    constructor(osName = config.osName) {
        this.osName = osName;
    }
    init() {
        //此处进行系统初始化和一些设备的启动和创建
        //系统时间
        initOSTime();
        //设备管理器
        runDeviceControl();
        //初始化cpu
        initCPU();
        //预创建一台画图设备
        createDrawer();
        //初始化进程调度程序
        initScheduler();
    }
    finishInit() {

        //创建一个画图表程序
        //var app2 = new drawChart();
        //app2.init();
        //app2.drawChart();
    }
    run(args = []) {
        if (args != null && args != []) {
            API.osLoad();
            consoleOut(this.osName + '系统启动中' + args, false);
            new Promise((resolve, reject) => {
                this.init()
                setTimeout(function() {
                    resolve()
                }, 1000)
            }).then(res => {
                consoleOut(this.osName + '系统启动成功' + args)
                API.showBottomSide();
                API.osLoadFinish()
                API.showMsg('系统启动成功')
                this.finishInit()
            })


        } else {
            consoleOut(this.osName + '系统启动失败')
        }
    }


}