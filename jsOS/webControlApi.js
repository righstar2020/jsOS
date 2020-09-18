//通过网页控制模拟系统
//可操作读取底层设备和数据



//左侧菜单按钮功能函数

//展示内容
function displayContent(name = "content1") {
    var contentList = document.getElementsByClassName("content");
    for (var i = 0; i < contentList.length; i++)
        if (contentList[i].id == name) {
            contentList[i].style.display = "block";
        } else {
            contentList[i].style.display = 'none';
        }
}

function switchContent(btnName = "btn1", title = "进程调度模拟") {
    var contentTitle = document.getElementById("contentTitle");
    contentTitle.innerHTML = title;
    switch (btnName) {
        case 'btn1':
            displayContent("content1");
            break;
        case 'btn2':
            displayContent("content2");
            break;
        case 'btn3':
            displayContent("content3");
            break;
        default:
            break;
    }
}


function sideBtnClick() {
    var sideListBtns = document.getElementsByClassName("sideListBtn");

    if (this.classList.contains("btnOn")) return;

    for (var i = 0; i < sideListBtns.length; i++)
        if (sideListBtns[i].classList.contains("btnOn"))
            sideListBtns[i].classList.remove("btnOn")

    this.classList.add("btnOn");

    switchContent(this.id, this.title)
}

function bindLeftSideBtn() {
    var sideListBtns = document.getElementsByClassName("sideListBtn");

    for (var i = 0; i < sideListBtns.length; i++)
        sideListBtns[i].onclick = sideBtnClick


}
bindLeftSideBtn();


//leftBox读取内存PCBCreateList数据动态更新
function createTbodyElem(data = null) {

}
//更新chart信息

//模拟数据显示对应的图表选项
var imitateShowOptionList = [{
        title: {
            text: '进程模拟数据统计', //图表的title
            textStyle: {
                fontSize: 12,
                fontWeight: 400
            }
        },
        legend: {
            data: ['周转时间', '带权周转时间'] //图例,可以通过点击图例控制图表隐藏或显示某一指标
        },
        xAxis: { //横坐标轴配置
            nameLocation: 'center', //名字位置
            nameTextStyle: { verticalAlign: 'top', lineHeight: 26 },
            name: 'PCBID', //横轴名字

            axisPointer: {
                show: true //指示器
            },
            data: [] //PCBID
        },
        yAxis: {
            name: '时间' //纵轴名字
        }, //纵坐标轴配置
        series: [{ //系列，这个数组可以存放多个对象，每个对象就是一组同质的数据，如销量、收入、支出。
            name: '周转时间', //当前这组数据的名称
            type: 'bar', //当前这组数据以什么样的形式展现。bar：条形图；line：折线图；pie：饼图，除此之外还有散点图、雷达图等等很多
            data: [] //当前组数据具体值
        }, {
            name: '带权周转时间',
            type: 'line',
            data: []
        }]
    },
    {
        title: {
            text: '平均统计', //图表的title
            textStyle: {
                fontSize: 12,
                fontWeight: 400
            }
        },
        legend: {
            data: ['平均周转时间', '平均带权周转时间'] //图例,可以通过点击图例控制图表隐藏或显示某一指标
        },
        xAxis: { //横坐标轴配置
            nameLocation: 'center', //名字位置
            nameTextStyle: { verticalAlign: 'top', lineHeight: 26 },
            name: '调度算法', //横轴名字
            axisPointer: {
                show: true //指示器
            },
            data: ['FCFS', 'RR', '优先级调度'] //模拟方法名 FCFS RR 
        },
        yAxis: {
            name: '时间' //纵轴名字
        }, //纵坐标轴配置
        series: [{ //系列，这个数组可以存放多个对象，每个对象就是一组同质的数据，如销量、收入、支出。
            name: '平均周转时间', //当前这组数据的名称
            type: 'bar', //当前这组数据以什么样的形式展现。bar：条形图；line：折线图；pie：饼图，除此之外还有散点图、雷达图等等很多
            data: [] //当前组数据具体值
        }, {
            name: '平均带权周转时间',
            type: 'line',
            data: []
        }]
    }

]
var chartDrawerList = []; //图表应用队列
for (var i = 0; i < 4; i++)
    chartDrawerList.push(new drawChart()); //创建四个画图表应用
function updateImitateDataOnChart(data = null, avaRoundTime = null, avaWRoundTime, avaMnum) {
    if (data != null && chartDrawerList.length >= 4) {
        //三个不同调度方法的图表
        optionList = [];
        for (var i = 0; i < 3; i++)
            optionList.push(deepCopy(imitateShowOptionList[0]));
        for (var i = 0; i < data.length; i++) {
            if (data[i].type == 0) continue;
            optionList[data[i].type - 1].xAxis.data.push(data[i].arr[1]) //进程PCBID
            optionList[data[i].type - 1].series[0].data.push(data[i].arr[9]) //周转时间
            optionList[data[i].type - 1].series[1].data.push(data[i].arr[10]) //带权周转时间
        }
        //平均数据
        var avgOption = deepCopy(imitateShowOptionList[1]);

        for (var i = 0; i < avaMnum.length; i++) {
            if (avaMnum[i] != 0) {
                avgOption.series[0].data.push(Number((avaRoundTime[i] / avaMnum[i]).toFixed(2))) //平均周转
                avgOption.series[1].data.push(Number((avaWRoundTime[i] / avaMnum[i]).toFixed(2))) //平均带权周转
            }
        }
        var typeName = ['FCFS', 'RR', '优先级调度'];
        for (var i = 0; i < 3; i++) {
            optionList[i].title.text = typeName[i];
            if (!chartDrawerList[i].isEnd)
                chartDrawerList[i].run(optionList[i]) //三个方法
        }
        if (!chartDrawerList[3].isEnd)
            chartDrawerList[3].run(avgOption)
    }
}
//更新表格信息
function updateImitateDataView() {
    var view0 = document.getElementById("imitateView0");
    var view1 = document.getElementById("imitateView1");
    var view2 = document.getElementById("imitateView2");
    var view3 = document.getElementById("imitateView3");
    var data = []
    if (PCBCreateList == null || (!isArrayChange(PCBCreateList) && PCBCreateList.length > 0)) return;

    var typeName = ['非模拟', 'FCFS', 'RR', '优先级调度'];
    for (var i = 0; i < PCBCreateList.length; i++)
        if (PCBCreateList[i].imitateData != null) {
            var elem = {
                type: 0,
                arr: []
            }

            elem.type = PCBCreateList[i].imitateData.imitateType;
            elem.arr.push(typeName[PCBCreateList[i].imitateData.imitateType]) //0
            elem.arr.push(PCBCreateList[i].PCBID); //1
            elem.arr.push(PCBCreateList[i].imitateData.priorityLevel);
            elem.arr.push(PCBCreateList[i].imitateData.runTime)
            elem.arr.push(PCBCreateList[i].imitateData.usedSliceNum)
            elem.arr.push(PCBCreateList[i].imitateData.reachTime)
            elem.arr.push(PCBCreateList[i].imitateData.startTime)
            elem.arr.push(PCBCreateList[i].imitateData.finishTime)
            elem.arr.push(PCBCreateList[i].imitateData.waitTime)
            elem.arr.push(PCBCreateList[i].imitateData.roundTime) //9
            elem.arr.push(Number(PCBCreateList[i].imitateData.wRoundTime.toFixed(2))) //保留两位小数
            data.push(deepCopy(elem));
        }


    var trList = ['', '', '', '']
    var avaRoundTime = [0, 0, 0];
    var avaWRoundTime = [0, 0, 0];
    var avaMnum = [0, 0, 0]; //各模拟的个数
    for (var i = 0; i < data.length; i++) {
        var tdList = '';
        for (var j = 0; j < data[i].arr.length; j++) {

            tdList += '<td>' + data[i].arr[j] + '</td>\r\n';

        }

        if (data[i].type != 0) {
            //计算平均
            avaRoundTime[data[i].type - 1] += data[i].arr[data[i].arr.length - 2]
            avaWRoundTime[data[i].type - 1] += data[i].arr[data[i].arr.length - 1]
            avaMnum[data[i].type - 1] += 1;
        }

        if (data[i].type == 0) {
            //非模拟状态
            trList[0] += '<tr>' + tdList + '</tr>\r\n';;
        }
        if (data[i].type == 1) {
            trList[1] += '<tr>' + tdList + '</tr>\r\n';;
        }
        if (data[i].type == 2) {
            trList[2] += '<tr>' + tdList + '</tr>\r\n';;
        }
        if (data[i].type == 3) {
            trList[3] += '<tr>' + tdList + '</tr>\r\n';;
        }
    }




    view0.innerHTML = trList[0] + trList[1] + trList[2] + trList[3];

    //加入平均计算显示
    for (var i = 0; i < 3; i++) {
        var td = ''

        td += '<td>平均周转时间</td>';
        td += '<td>' + (avaRoundTime[i] / avaMnum[i]).toFixed(2) + '</td>';
        td += '<td>平均带权周转时间</td>';
        td += '<td>' + (avaWRoundTime[i] / avaMnum[i]).toFixed(2) + '</td>'
        trList[i + 1] += '<tr>' + td + '</tr>';
    }
    view1.innerHTML = trList[1]
    view2.innerHTML = trList[2]
    view3.innerHTML = trList[3]

    //更新chart
    updateImitateDataOnChart(data, avaRoundTime, avaWRoundTime, avaMnum)

}
bindClock(updateImitateDataView, 10);


function addImitateProcess(app = null, imitateType = 1, priorityLevel = 0, randomType = false, randomPriorityLevel = false) {

    if (randomType) imitateType = Math.floor(Math.random() * 3 + 1)
    if (randomPriorityLevel) priorityLevel = Math.floor(Math.random() * 6)

    createImitateProcess(app, imitateType);
    scrollToBottom('content1')

}

function runImitateProcess() {
    runImitateProcessList(); //扫描清空模拟进程队列
}

function clearImitateProcess() {
    var id = this.id
    var type = parseInt(id[id.length - 1]);
    clearCreateProcessList(type); //扫描清空已完成的模拟进程
}

//绑定按钮,添加随机进程模拟
function bindAddImitate() {

}


//绑定按钮,运行进程模拟
function bindRunImitate() {
    var runBtn = document.getElementsByClassName("runImitate");
    for (var i = 0; i < runBtn.length; i++)
        runBtn[i].onclick = runImitateProcess
}
//绑定按钮,清除进程模拟
function bindClearImitate() {
    var btn = document.getElementsByClassName("clearImitate");
    for (var i = 0; i < btn.length; i++) {
        btn[i].onclick = clearImitateProcess

    }

}
//滚动条到底部
function scrollToBottom(domID = null) {
    var dom = document.getElementById(domID)

    if (isDOM(dom)) {
        dom.scrollTop = dom.scrollHeight

    }
}
//设置模拟数据选择
//时间片选择
//到达延迟选择
function setImitateChoice() {
    var valueList = []
    valueList.push(document.getElementById("choiceRunTime").value);
    valueList.push(document.getElementById("choiceDelayTime").value);
    valueList.push(document.getElementById("choicePriorityLevel").value);
    for (var i = 0; i < 3; i++)
        valueList[i] = Number(valueList[i]);
    var flag = false;

    if (valueList[0] > 0 && valueList[0] != setRunTime) {
        setRunTime = valueList[0]; //时间片
        API.showMsg("设置所需时间片 " + setRunTime)
        flag = true;
    }
    if (valueList[1] > 0 && valueList[1] != setDelay) {
        setDelay = valueList[1]; //延迟
        API.showMsg("设置延迟 " + setDelay)
        flag = true;
    }
    if (valueList[2] > 0 && valueList[2] != setPriorityLevel) {
        setPriorityLevel = valueList[2]; //优先级
        API.showMsg("设置优先级 " + setPriorityLevel);
        flag = true;
    }
    if (!flag) {
        API.showMsg("未修改任何数据");
        return;
    }


}
bindAddImitate();
bindRunImitate();
bindClearImitate();





//动态引入样式
function loadStyles(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(link);
}

//测试函数
function test() {

    // document.getElementsByClassName("login_box")[0].style.float = 'none'
}