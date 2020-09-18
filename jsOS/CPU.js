/*
 *cpu核心调度程序
 *负责进程的run和一些指令处理
 */

function initCPU() {
    runCPU();
    bindClock(runCPU, FreTimes); //为cpu绑定时钟,2ms

}
var debug = 0;



function runCPU() {
    //该方法调用进程的app.run方法
    //CPU时间片序号加一
    CPUSliceIndex += 1;
    if (CPU.length > 0 && CPU != null) {
        for (var i = 0; i < CPU.length; i++) {

            if (CPU[i].firstReach) {
                //进程第一次时间片
                CPU[i].firstReach = false;
                if (CPU[i].imitateData != null) {

                    CPU[i].imitateData.startTime = CPUSliceIndex;


                }

            }
            if (CPU[i].app != undefined && CPU[i].app != null) {
                CPU[i].app.PCBID = CPU[i].PCBID;
                //运行程序
                CPU[i].app.run();

            }
            //标识模拟状态
            if (CPU[i].isImitate) {
                //扫描CPU每个进程占有时间片减一
                if (CPU[i].imitateData.timeSliceNum != null && CPU[i].imitateData.timeSliceNum > 0) {
                    CPU[i].imitateData.usedSliceNum += 1;
                    CPU[i].imitateData.timeSliceNum -= 1;
                }

                if (CPU[i].imitateData.timeSliceNum != null && CPU[i].imitateData.timeSliceNum <= 0) {
                    //时间片到则退出CPU
                    popCPU(CPU[i].PCBID)

                    i--; //索引还在原位置

                    //continue;
                }
            } else {
                //非模拟
                //进程占有无限时间片
                if (CPU[i].imitateData != null) {
                    CPU[i].imitateData.usedSliceNum += 1;
                    CPU[i].imitateData.runTime += 1; //运行时间自动加1
                }
            }

            if (CPU[i].app != undefined && CPU[i].app != null) {
                //判断应用是否自我关闭
                if (CPU[i].app.isEnd) {
                    popCPU(CPU[i].PCBID)
                        //i--; //索引还在原位置
                }

            }


        }
    }



}









//浅拷贝最终操作的是createProcess里的数据
function saveCPUData(PCB = null) {
    if (PCB != null) {
        if (!PCB.isImitate && PCB.imitateData != null) {
            //保存非模拟进程数据
            //完成时间应在下一个时间片
            PCB.imitateData.finishTime = CPUSliceIndex + 1;
            PCB.imitateData.roundTime = PCB.imitateData.finishTime - PCB.imitateData.reachTime;
            PCB.imitateData.wRoundTime = PCB.imitateData.roundTime / PCB.imitateData.runTime;
        }
        if (PCB.isImitate && PCB.imitateData.imitateType == 1) {
            //保存FCFS模拟数据
            //完成时间应在下一个时间片
            PCB.imitateData.finishTime = CPUSliceIndex + 1;
            PCB.imitateData.roundTime = PCB.imitateData.finishTime - PCB.imitateData.reachTime;
            PCB.imitateData.wRoundTime = PCB.imitateData.roundTime / PCB.imitateData.runTime;
        }
        if (PCB.isImitate && PCB.imitateData.imitateType == 2) {
            //RR算法保存队列
            if (PCB.imitateData.usedSliceNum >= PCB.imitateData.runTime || (PCB.app != null && PCB.app.isEnd)) {

                //完成时间应在下一个时间片
                PCB.imitateData.finishTime = CPUSliceIndex + 1;
                PCB.imitateData.roundTime = PCB.imitateData.finishTime - PCB.imitateData.reachTime;
                PCB.imitateData.wRoundTime = PCB.imitateData.roundTime / PCB.imitateData.runTime;
            } else {
                //进程未完成则返回就绪队列
                PCBReadlyList.push(PCB);
            }
        }

        if (PCB.isImitate && PCB.imitateData.imitateType == 3) {
            //保存优先级调度模拟数据
            //完成时间应在下一个时间片
            PCB.imitateData.finishTime = CPUSliceIndex + 1;
            PCB.imitateData.roundTime = PCB.imitateData.finishTime - PCB.imitateData.reachTime;
            PCB.imitateData.wRoundTime = PCB.imitateData.roundTime / PCB.imitateData.runTime;
        }
    }
}

function popCPU(PCBID = null) {
    //退出CPU指定进程
    if (PCBID != null && CPU.length > 0) {
        for (var i = 0; i < CPU.length; i++) //for循环会分解成单步语句
            if (CPU[i].PCBID == PCBID) {
                //退出CPU保存数据
                consoleOut("进程ID" + PCBID + "退出CPU")
                saveCPUData(CPU[i]);
                CPU.splice(i, 1);

                i--; //索引还在原位置

            }

    }
}





function clearCPU() {
    //清空cpu里进程
    while (CPU.length > 0) {
        CPU.shift();
    }
}