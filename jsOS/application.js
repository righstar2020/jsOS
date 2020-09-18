/*
 *此为系统应用创建有关的模块
 *在此定义设计jsOS的应用程序类
 *基于窗口的应用,
 *设计的应用可以自由调用设备,
 *但要符合一定规范
 *注意应用程序和进程概念不一致
 *进程基于程序的代码方法运行
 */
//这是一个应用的基类,写应用要基于基类扩展
//PCBID由进程创建程序赋予,无则无法运行
//mmAddress内存地址-1则未赋予
//runTime由进程调度器赋予的运行时间,动态变化,一般固定时间片50ms间隔
class App {

    constructor(name = "未命名的应用", PCBID = -1, mmAddress = -1, runTime = 0) {
        this.appName = name;
        this.PCBID = PCBID;
        this.mmAddress = mmAddress;
        this.runTime = runTime;
        this.isInited - false;
    }
    init() {
        //应用首次创建初始化
        this.isInited = true;
    }
    readMM(mmAddress, mmType) {
        //mmType要写的内存块类型,deviceReq:设备请求
    }

    writeMM(mmAddress, mmType) {
        //mmType要写的内存块类型,deviceRes:设备返回
    }
    live() {
        //进程存活检查已进行的工作并继续进行

    }
    run() {
        //应用在进程运行的方法
        consoleOut("一个来自父类的run方法")
        if (!this.isInited)
            this.init();
    }
    close() {
        //应用从CPU和进程队列进行自我关闭

    }
}


//一个画星星的窗口程序
class drawStar extends App {
    constructor(name = "未命名的应用", PCBID = -1, mmAddress = -1, runTime = 0, ) {
            super(name, PCBID, mmAddress, runTime)
            this.isInited = false;
            this.random = true;
            this.step = 0; //标识程序运行步数
            this.isEnd = false; //标识应用是否结束
        }
        //重写父类run方法成功
    init(random) {
        this.isInited = true;
        var myWindow = createJsWindow(null, '画星星程序');
        this.myWindow = myWindow;
        this.myWindowID = myWindow.windowID;
        //程序存活
        this.live(random);
    }
    close() {
        //程序关闭
        //存储或返回必要数据
        this.isEnd = true;

        consoleOut("进程ID" + this.PCBID + "结束")
    }
    run() {


        if (!this.isInited)
            this.init()
        else
            this.live()
    }
    randomShape(ReqData = null) {
        if (ReqData != null) {

            var pointDataList = [{
                    x: 0,
                    y: 30
                }, //起始坐标
                {
                    x: 100,
                    y: 30
                },
                {
                    x: 10,
                    y: 100
                },
                {
                    x: 50,
                    y: 0
                },
                {
                    x: 90,
                    y: 100
                },
                {
                    x: 0,
                    y: 30
                }
            ]
            var point = []


            var i = Math.floor(Math.random() * 5);
            i = this.step % 5;
            point.push(pointDataList[i]);
            point.push(pointDataList[i + 1]);
            ReqData.cmdData.data.point = point;
            if (this.step != 0 && this.step % 5 == 0)
                ReqData.cmdData.isDrawer = false;
            this.step++;

            return ReqData;
        }
    }
    live() {
        //判断窗口是否被关闭
        if (this.myWindow.isClose)
            this.close();
        //深拷贝
        var deviceReq = deepCopy(defaultDrawerData);
        if (deviceReq == null) { consoleOut("设备请求数据为空"); return; }
        deviceReq.PCBID = this.PCBID == -1 ? 1 : this.PCBID;
        deviceReq.cmdData.cmWindowID = this.myWindowID;
        deviceReq.cmdData.isDrawer = true;
        if (this.random)
            deviceReq = this.randomShape(deviceReq); //选择顺序画图


        if (deviceReq != null)
            deviceIODataList.push(deviceReq);


    }
    readMM(mmAddress, mmType = "deviceRes") {

    }


}



//一个画图表的窗口程序
class drawChart extends App {
    constructor(name = "未命名的应用", PCBID = -1, mmAddress = -1, runTime = 0, ) {
            super(name, PCBID, mmAddress, runTime)
            this.isInited = false;
        }
        //重写父类run方法成功
    init(option, width, heght) {
        var myWindow = createJsWindow(null, '图表应用')
        this.myWindow = myWindow;
        this.myWindowID = myWindow.windowID;
        this.myChart = null;
        this.createChart(option, null, width, heght)
        this.isInited = true;

    }
    run(option = null, width = 350, heght = 220) {
        if (!this.isInited)
            this.init(option, width, heght);
        else
            this.live(option);
    }
    createChart(option = null, myWidnowID = null, width = 300, height = 250) {
        var myWindowBodyDom = document.getElementById("cmWindow-main" + this.myWindowID);
        myWindowBodyDom.style.width = width + 'px';
        myWindowBodyDom.style.height = height + 'px';
        this.myChart = webUtils.drawChart(option, "cmWindow-main" + this.myWindowID)
    }
    upDateChartOption(option) {
        if (this.myChart != null) {
            this.myChart.setOption(option);
        }
    }
    live(option) {
        this.upDateChartOption(option)
        if (this.myWindow.isClose)
            this.close();
    }
    close() {
        this.isEnd = true
    }
    readMM(mmAddress, mmType = "deviceRes") {

    }


}