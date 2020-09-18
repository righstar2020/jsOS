var mainWindow = document.getElementById("mainWindow");
var windowList = [];
var windowCreatedNum = 0;
var cmdHistory = [];
var cmdHistoryIndex = 0;
var clockList = [];
var OSTime = new Date().getTime();
var deviceCCID = -1;
var deviceRoundTime = 100;
var drawerSyn = true;
var drawerList = [];
var drawerCreateNum = 0;
var deviceIODataList = [];
var deviceReturnMM = [];

function setDeviceReturnMM(c, d) {
    if (deviceReturnMM.length > d + 1) {} else {
        deviceReturnMM.push(c)
    }
}
var PCBCreateList = [];
var processHistoryNum = 0;
var PCBList = [];
var PCBReadlyList = [];
var PCBBlockList = [];
var imitateProcessList = [];
var setRunTime = 10;
var setDelay = 0;
var setPriorityLevel = 0;
var CPU = [];
var FreTimes = 200;
var CPUSliceIndex = 0;
var processMM = [];
var defaultPCB = {
    PCBID: 0,
    state: 0,
    processName: "未命名的进程",
    firstReach: true,
    clockID: 0,
    app: null,
    isImitate: false,
    imitateData: {
        timeSliceNum: 0,
        imitateType: 0,
        priorityLevel: 0,
        runTime: 0,
        usedSliceNum: 0,
        reachTime: 0,
        startTime: 0,
        finishTime: 0,
        waitTime: 0,
        roundTime: 0,
        wRoundTime: 0,
    },
    mmID: 0
};
var defaultDrawerData = {
    PCBID: 1,
    deviceName: "drawer",
    diviceID: 1,
    processMMIndex: 0,
    cmdData: {
        dataID: 1,
        cmWindowID: 999,
        method: "line",
        isDrawer: false,
        canvas: {
            xLength: 100,
            ylength: 100
        },
        data: {
            point: [{
                    x: 0,
                    y: 30
                },
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
        }
    }
};