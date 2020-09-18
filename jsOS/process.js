/*此为进程创建的主程序
 *通过new应用程序创建进程
 *同时规定进程运行所需的设备数
 *所需clock最大时长(模拟cpu的使用时长)
 *包括可以创建操作系统模拟的一些需要的变量
 *大部分数据存储于PCB数组中,
 *对于有数据存储需求的应用可把数据存入内存模块mm
 */


function createProcess(app = null, processName = null, imitateData = null, mmID = null) {
    try {
        var PCBID = processHistoryNum + 1;
        processHistoryNum += 1;
        var PCB = deepCopy(defaultPCB);
        PCB.PCBID = PCBID;
        if (processName != null)
            PCB.processName = processName;
        if (imitateData != null)
            PCB.imitateData = imitateData;
        if (mmID != null)
            PCB.mmID = mmID;
        if (app != null)
            PCB.app = app;
        if (app != null) {
            app.PCBID = PCBID;
        }
        PCBCreateList.push(PCB);
        return PCB;
    } catch (e) {
        consoleOut("创建进程时发生了一个错误");
    }
}

function PCBPush(PCB = null) {
    if (PCB != null) {
        PCBList.push(PCB);
        consoleOut("进程ID:" + PCB.PCBID + "进入进程队列")
    }
}
//清除已完成的进程
function clearCreateProcessList(type = 0) {
    if (PCBCreateList.length <= 0) {
        API.showMsg("未创建任何进程")
        return;
    }
    var i = 0;
    while (i < PCBCreateList.length && PCBCreateList.length > 0) {

        if (type == 0) {
            //清空所有已结束的进程 
            if (PCBCreateList[i].imitateData.runTime == PCBCreateList[i].imitateData.usedSliceNum)
                PCBCreateList.splice(i, 1);
            else if (PCBCreateList[i].app != null && PCBCreateList[i].app.isEnd)
                PCBCreateList.splice(i, 1);
            else
                i++;

        } else if (PCBCreateList[i].isImitate) {

            if (PCBCreateList[i].imitateData.imitateType == type) {

                if (PCBCreateList[i].imitateData.runTime == PCBCreateList[i].imitateData.usedSliceNum) {

                    PCBCreateList.splice(i, 1);
                } else if (PCBCreateList[i].app != null && PCBCreateList[i].app.isEnd)
                    PCBCreateList.splice(i, 1);
                else
                    i++;

            } else
                i++;

        } else {
            i++;
        }
    }

    API.showMsg("已清空完成")
}


//创建模拟进程调度的进程
//app可以指定要模拟的应用
//randNum 运行时间
var runTimeRandom = false; //选择是否随机运行时间
var priorityLevelRandom = false; //选择是否随机优先级
function createImitateProcess(app = null, imitateType = 1, priorityLevelNum = 5, randNum = 20) {
    var PCB = createProcess()
    var randomRunTime;
    var priorityLevel;


    PCB.app = new drawStar(); //默认创建画星星程序
    if (app != null)
        PCB.app = app;


    if (runTimeRandom)
        randomRunTime = Math.floor(Math.random() * randNum + 1);
    else
        randomRunTime = setRunTime; //默认全局设置的运行时间

    if (priorityLevelRandom)
        priorityLevel = Math.floor(Math.random() * priorityLevelNum + 1);
    else
        priorityLevel = setPriorityLevel; //默认全局设置的优先级

    PCB.isImitate = true;
    PCB.imitateData.imitateType = imitateType;
    PCB.imitateData.runTime = randomRunTime;
    if (imitateType == 3) {
        PCB.imitateData.priorityLevel = priorityLevel;
    }


    imitateProcessList.push(PCB);
    return PCB;
}
//判断是否所有进程已完成
function isAllFinishProcess() {
    for (var i = 0; i < PCBCreateList.length; i++)
        if (PCBCreateList[i].state == 1)
            if (PCBCreateList[i].isImitate && PCBCreateList[i].imitateData.runTime != PCBCreateList[i].imitateData.usedSliceNum)
                return false;

    return true;
}
//运行所有模拟程序
function runImitateProcessList() {
    //只运行未被运行的程序
    //不进行延迟
    if (imitateProcessList.length <= 0) {
        API.showMsg("未发现模拟进程");
        return;
    }
    var delayNum = 0;
    if (isAllFinishProcess()) {
        //队列已清空则设置CPUSliceIndex = -1
        CPUSliceIndex = -1;
    }
    while (imitateProcessList.length > 0) {
        imitateProcessList[0].imitateData.reachTime = delayNum;
        PCBPush(imitateProcessList[0]); //加入进程队列
        imitateProcessList.shift(); //已加入队列则移除
        delayNum += setDelay; //设置延迟时间
    }
    API.showMsg("模拟进程已全部进入队列");
}