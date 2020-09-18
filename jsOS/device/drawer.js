/*这是一个在指定canva中画图的设备*/
/*
 *构造函数解释
 *PCBID:占用设备的进程ID
 *cmdData:控制设备的命令
 *returnMMIndex:要返回数据的指定内存位置,-1则不返回
 */
/*画图的工具函数*/






/*画图器主类*/
class Drawer {

    constructor(deviceID = null, isUse = false, PCBID = -1, cmdData = {}, returnMMIndex = -1) {
        if (deviceID != null) {
            this.deviceID = deviceID;
            this.isUse = isUse;
            this.PCBID = PCBID;
            this.cmdData = cmdData;
            this.returnMMIndex = returnMMIndex;
        }

    }
    stop() {
        //运行完成停止设备
        this.isUse = false;
        this.PCBID = -1;
        this.cmdData = {};
        this.returnMMIndex = -1;
    }
    returnToMm(data, index) {
        //返回数据到设备返回数据内存
        setDeviceReturnMM(data, index)
    }
    getCanvas() {
        var cmdData = this.cmdData;
        if (cmdData == {}) return null;
        var cmWindowMain = document.getElementById("cmWindow-main" + cmdData.cmWindowID)
        if (cmWindowMain != null) {
            var canvas = $("#cmWindow-main" + cmdData.cmWindowID + ">canvas")[0];
            if (!isDOM(canvas) || !cmdData.isDrawer) {
                if (!cmdData.isDrawer && canvas != null)
                    cmWindowMain.removeChild(canvas);
                canvas = document.createElement("canvas")
                canvas.id = "canvas" + cmdData.cmWindowID;
                canvas.width = cmdData.canvas.xLength;
                canvas.height = cmdData.canvas.xLength;
                cmWindowMain.appendChild(canvas);

            }

            var ctx = canvas.getContext("2d");
            return ctx;
        } else {
            consoleOut("获取窗口失败" + cmdData.cmWindowID)
            return null;
        }
    }
    drawLine(data) {

            var ctx = this.getCanvas();
            if (data == null) return;
            if (ctx == null) return;
            var i = 0;
            var startPoint = {};
            var endPoint = {};
            startPoint = data.point[i];
            endPoint = data.point[i + 1];
            while (1) {

                var sX = startPoint.x;
                var sY = startPoint.y;
                var eX = endPoint.x;
                var eY = endPoint.y;
                ctx.beginPath(); //开始新路径
                ctx.moveTo(sX, sY);
                ctx.lineTo(eX, eY);
                ctx.stroke();
                i++;
                if (i >= data.point.length - 1) break;
                startPoint = endPoint;
                endPoint = data.point[i + 1];

            }
            return data;
        }
        //异步画矩形可用画线方法进行,这个就直接画方了
    drawRectangle(data) {
        if (data == null) return;
        var ctx = this.getCanvas();
        //功能未完成
        return data;

    }
    drawCricle(data) {
        if (data == null) return;
        var ctx = this.getCanvas();
        //功能未完成
        return data;
    }
    selectAndRun(cmdData) {

        var data
        switch (cmdData.method) {
            case 'line':
                data = this.drawLine(cmdData.data)
                break;
            case 'rectangle':
                data = this.drawRectangle(cmdData.data)
                break;
            case 'cricle':
                data = this.drawCricle(cmdData.data)
                break;
            default:
                consoleOut("未读取到任何画图命令,或该画图方法未实现--window" + cmdData.cmWindowID)
                break;
        }
        if (data != cmdData.data) {
            //加入一个进程ID方便查询
            cmdData["PCBID"] = this.PCBID;
            cmdData.isDrawer = true;
            cmdData.data = data;
            cmdData.dataID += 1;

        }
        if (this.returnMMIndex != -1 && data != null) {
            //只返回控制信息
            this.returnToMm(cmdData, this.returnMMIndex)
        }
        this.stop()
    }
    run(reqData) {
        //读入数据
        try {
            this.isUse = true;
            this.PCBID = reqData.PCBID;
            this.returnMMIndex = reqData.processMMIndex;
            this.cmdData = reqData.cmdData;
            //判断数据
            if (this.deviceID != null && this.isUse && this.PCBID != -1) {
                if (JSON.stringify(this.cmdData) != "{}") {
                    this.selectAndRun(this.cmdData)
                } else {
                    consoleOut("画图设备" + this.deviceID + "未读取到任何命令")
                }
            } else {
                consoleOut("画图设备" + this.deviceID + "未被任何程序使用需运行")
            }
        } catch (e) {
            consoleOut("画图设备发生一个错误", true, e);
        }
    }
    destroy() {
        removeDrawer(this.deviceID);
    }

}



function createDrawer() {
    var deviceID = drawerCreateNum + 1;
    var drawer = new Drawer(deviceID);
    drawerCreateNum += 1;
    drawerList.push(drawer);
    consoleOut("一台画图设备创建成功 设备ID" + deviceID);
    return drawer;
}

function removeDrawer(deviceID = -1) {
    if (deviceID != -1 && drawerList.length > 0)
        for (var i = 0; i < drawerList.length; i++)
            if (drawerList[i].deviceID == deviceID) {
                //注意splice方法会影响数组本身
                drawerList.splice(i, 1)
            }
}