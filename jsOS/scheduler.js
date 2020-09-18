/*此为系统核心的进程调度程序
 *此调度程序由clock异步运行在系统之上
 *定时处理进程的调度
 *此调度程序模拟状态下允许进程异步和同步两个策略
 *同步状态下可以运行模拟操作系统调度算法
 *异步状态下可以让程序在浏览器真正并发运行
 *但同时调度算法已失去用处
 *进程调度程序操作的是mm的PCB数据及内存的数据
 */
var isImitate = true; //是否为模拟进程调度状态
var schedulerClockID = null; //调度程序时钟ID
function initScheduler() {
    schedulerClockID = bindClock(runScheduler, 5); //进程调度程序绑定时钟2ms
}

function stopScheduler() {
    if (schedulerClockID != null) {
        removeClock(schedulerClockID);
        schedulerClockID = null;
    }
}

function runScheduler() {
    scanPCBList(); //扫描进程队列
    scanPCBReadlyList(); //扫描进程等待队列

}

function scanPCBList() {
    if (PCBList != null && PCBList.length > 0) {
        for (var i = 0; i < PCBList.length; i++) {
            if (PCBList[i].state == 0 || PCBList[i].state == 99) {
                //就绪或延迟状态
                if (PCBList[i].isImitate && PCBList[i].imitateData != null) {
                    //判断进程到达延迟
                    if (PCBList[i].state != 99 && PCBList[i].imitateData.reachTime > 0) {
                        PCBList[i].imitateData.reachTime += (CPUSliceIndex + 1);
                        PCBList[i].state = 99;
                    }
                    if (PCBList[i].imitateData.reachTime > (CPUSliceIndex + 1))
                        continue;
                    //到达时间应在下一个时间片
                    PCBList[i].imitateData.reachTime = CPUSliceIndex + 1;
                }
                PCBList[i].state = 1;
                PCBReadlyList.push(PCBList[i]);
                consoleOut("进程ID" + PCBList[i].PCBID + "进入等待队列");
                PCBList.splice(i, 1); //弹出队列
                i--; //退一位
            }

            if (i >= 0 && i < PCBList.length && PCBList[i].state == -1) {
                //进程转为终止状态则删除进程
                PCBList.splice(i, 1);
            }
        }
    }
}


function scanPCBReadlyList() {
    try {
        if (isImitate) //是否开启进程调度模拟
        {
            FCFS();
            RR();
            priorityNumberFun();
        }
        commonRun(); //正常多线程运行状态
    } catch (e) {
        consoleOut("进程调度时发生了一些错误", true, e);
    }



}

function changeProcessState(PCBID = null, state = -1) {
    //改变进程状态
    if (PCBID != null && PCBList.length > 0) {
        for (var i = 0; i < PCBList.length; i++)
            if (PCBList[i].PCBID == PCBID)
                PCBList[i].state = state;
    }
}

//调度需要的函数工具
function isCPUEmpty(type = 0) {
    //正常状态下CPU总是空闲
    if (type == 0) return true;
    for (var i = 0; i < CPU.length; i++) {
        //扫描同一模拟方法的进程是否占有CPU
        if (CPU[i].isImitate && CPU[i].imitateData.imitateType == type)
            return false;
    }
    return true;
}

function isReadlyListEmpty(type = 0) {
    if (type == 0 && PCBReadlyList.length > 0) {
        return false;
    }
    if (PCBReadlyList.length > 0)
        for (var i = 0; i < PCBReadlyList.length; i++) {
            //扫描就绪队列是否有该模拟方法的进程
            if (PCBReadlyList[i].isImitate && PCBReadlyList[i].imitateData.imitateType == type)
                return false;
        }
    return true;
}

function commonRun() {
    //扫描非模拟状态的进程
    for (var i = 0; i < PCBReadlyList.length; i++) {
        if (!PCBReadlyList[i].isImitate) {
            consoleOut("进程ID" + PCBReadlyList[i].PCBID + "获得CPU");
            CPU.push(PCBReadlyList[i]);
            PCBReadlyList.splice(i, 1)
        }

    }
}


//先来先服务
function FCFS() {
    for (var i = 0; i < PCBReadlyList.length; i++)
        if (PCBReadlyList[i].isImitate && PCBReadlyList[i].imitateData.imitateType == 1) {
            if (!PCBReadlyList[i].imitateData.hasOwnProperty("waitStart"))
                PCBReadlyList[i].imitateData.waitStart = CPUSliceIndex;
            if (isCPUEmpty(1)) {
                PCBReadlyList[i].imitateData.waitTime += (CPUSliceIndex - PCBReadlyList[i].imitateData.waitStart);
                delete PCBReadlyList[i].imitateData.waitStart;
                //赋予进程足够完成的时间片
                consoleOut("进程ID" + PCBReadlyList[i].PCBID + "获得CPU");
                PCBReadlyList[i].imitateData.timeSliceNum = PCBReadlyList[i].imitateData.runTime;
                CPU.push(PCBReadlyList[i]);
                PCBReadlyList.splice(i, 1);
            }
        }

}
//时间片轮转
function RR(sliceNum = 2) {
    for (var i = 0; i < PCBReadlyList.length; i++)
        if (PCBReadlyList[i].isImitate && PCBReadlyList[i].imitateData.imitateType == 2) {
            if (!PCBReadlyList[i].imitateData.hasOwnProperty("waitStart"))
                PCBReadlyList[i].imitateData.waitStart = CPUSliceIndex;
            if (isCPUEmpty(2)) {
                PCBReadlyList[i].imitateData.waitTime += (CPUSliceIndex - PCBReadlyList[i].imitateData.waitStart);
                delete PCBReadlyList[i].imitateData.waitStart;

                consoleOut("进程ID" + PCBReadlyList[i].PCBID + "获得CPU");
                //赋予进程规定的时间片
                //避免时间片超出
                PCBReadlyList[i].imitateData.timeSliceNum = (PCBReadlyList[i].imitateData.runTime - PCBReadlyList[i].imitateData.usedSliceNum) > sliceNum ? sliceNum : (PCBReadlyList[i].imitateData.runTime - PCBReadlyList[i].imitateData.usedSliceNum);
                CPU.push(PCBReadlyList[i]);
                PCBReadlyList.splice(i, 1);
            }
        }
}

//优先数调度
function priorityNumberFun() {
    var topLevel = -1;

    for (var i = 0; i < PCBReadlyList.length; i++)
        if (PCBReadlyList[i].isImitate && PCBReadlyList[i].imitateData.imitateType == 3) {
            if (!PCBReadlyList[i].imitateData.hasOwnProperty("waitStart"))
                PCBReadlyList[i].imitateData.waitStart = CPUSliceIndex;

            if (topLevel == -1 || PCBReadlyList[i].imitateData.priorityLevel > PCBReadlyList[topLevel].imitateData.priorityLevel)
                topLevel = i;

        }
        //没有优先级调度的进程则返回
    if (!isCPUEmpty(3) || isReadlyListEmpty(3)) return;
    if (topLevel >= 0 && PCBReadlyList[topLevel].isImitate && PCBReadlyList[topLevel].imitateData.imitateType == 3)
        if (isCPUEmpty(3)) {
            PCBReadlyList[topLevel].imitateData.waitTime += (CPUSliceIndex - PCBReadlyList[topLevel].imitateData.waitStart);
            delete PCBReadlyList[topLevel].imitateData.waitStart;

            //赋予进程足够完成的时间片
            consoleOut("进程ID" + PCBReadlyList[topLevel].PCBID + "获得CPU");
            PCBReadlyList[topLevel].imitateData.timeSliceNum = PCBReadlyList[topLevel].imitateData.runTime;
            CPU.push(PCBReadlyList[topLevel]);
            PCBReadlyList.splice(topLevel, 1);
        }
}