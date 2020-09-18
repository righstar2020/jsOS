/*操作amazeUI及layUI js组件以及网页显示的一些函数*/
/*amazeUI的操作*/
var progress = $.AMUI.progress;
var progressNum = 0;
var API = {
    osLoad: function() {
        progress.start();
        progressNum++;
    },
    //展示窗口底部导航栏
    showBottomSide: function() {
        var bottomSide = document.getElementById("bottomSide");
        bottomSide.style.display = "block";
    },
    osLoadFinish: function() {
        progressNum--;
        if (progressNum <= 0) {
            progress.done();
        }


    },
    //layui的调用
    showMsg: function(msg, anim = 5, offset = '20px', time = 1800) {

        layui.use('layer', function() {
            var layer = layui.layer
            layer.msg(msg, {
                offset: offset,
                anim: anim,
                time: time
            });

        });
    }

}


//一些前端工具,数据可视化
var webUtils = {

    drawChart: function(option = null, domID = null) {


        if (option == null) {
            option = {
                title: {
                    text: '进程模拟数据统计', //图表的title
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 600
                    }
                },
                legend: {
                    data: ['周转时间', '带权周转时间'] //图例,可以通过点击图例控制图表隐藏或显示某一指标
                },
                xAxis: { //横坐标轴配置
                    data: [] //PCBID
                },
                yAxis: {}, //纵坐标轴配置
                series: [{ //系列，这个数组可以存放多个对象，每个对象就是一组同质的数据，如销量、收入、支出。
                    name: '周转时间', //当前这组数据的名称
                    type: 'bar', //当前这组数据以什么样的形式展现。bar：条形图；line：折线图；pie：饼图，除此之外还有散点图、雷达图等等很多
                    data: [] //当前组数据具体值
                }, {
                    name: '带权周转时间',
                    type: 'line',
                    data: []
                }]
            };
        }




        if (option != null && domID != null) {
            console.log(domID);
            var myChart = echarts.init(document.getElementById(domID));

            myChart.setOption(option);
            return myChart;
        }
    }

}