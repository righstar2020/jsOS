/*
 *这是一个创建窗口的设备
 *设备包括窗口的一些关闭和最小化,
 *以及移动的一些函数
 */
class jsWindow {
    constructor(windowID = 0, windowName = null) {
        this.windowID = windowID;
        this.windowName = windowName || ('窗口' + windowID)
        this.isClose = false;
    }
    createWindow() {
        var windowDom = document.createElement('div');
        windowDom.className = 'commonWindow';
        windowDom.id = "window" + this.windowID
        var html = `
            <div class="cmWindow-top">
                <div class="cmWindow-title" title="` + this.windowName + `" >` + this.windowName + `</div>
                <div class="cmWindow-close">
                    <i class="layui-icon layui-icon-close" style="font-size:12px;"></i>
                </div>
            </div>
            <div class="cmWindow-main" id="cmWindow-main` + this.windowID + `"></div>`;
        windowDom.innerHTML = html;
        mainWindow.appendChild(windowDom);

    }
    close() {
        //自我关闭的方法
        removeFromWindow(this.windowID);
        this.isClose = true;
    }
    init(args = []) {
        try {
            API.osLoad();
            this.createWindow();
            bindMoveFun(this.windowID);
            bindWindowClose(this.windowID)
            consoleOut(this.windowID + '窗口创建成功');
            API.osLoadFinish();
        } catch (e) {
            consoleOut(this.windowID + '窗口创建失败', e);
        }
    }


}


//绑定窗口移动的方法,需传入windowID默认999
function bindMoveFun(windowID = 999) {
    try {
        var cmWindow = document.getElementById("window" + windowID);
        //dom数组对象转数组
        //cmWindow = Array.from(cmWindow);
        if (cmWindow != null) {

            cmWindow.onmousedown = function(e) {
                var left = cmWindow.offsetLeft;
                var top = cmWindow.offsetTop;
                var x = e.clientX;
                var y = e.clientY;
                //绑定window方法修复bug
                window.onmousemove = function(e) {
                    var moveX = e.clientX - x;
                    var moveY = e.clientY - y;
                    cmWindow.style.top = top + moveY + 'px';
                    cmWindow.style.left = left + moveX + 'px';
                }
            };
            cmWindow.onmouseup = function(e) {
                window.onmousemove = null;

            }


        }
    } catch (e) {
        console.log(e)
    }
}
bindMoveFun();

function removeFromWindowList(windowID = 999) {
    if (windowList != null && windowList.length > 0)
        for (let i = 0; i < windowList.length; i++) {
            if (windowList[i].windowID == windowID) {
                windowList[i].isClose = true;
                windowList.splice(i, 1);
                break;
            }
        }
}
//绑定窗口close的函数
function removeFromWindow(windowID = 999) {
    var closeWindow = document.getElementById("window" + windowID);
    if (closeWindow != null) {

        mainWindow.removeChild(closeWindow);

        removeFromWindowList(windowID);
    } else {
        consoleOut("jQuery查找元素失败");
    }


}

function bindWindowClose(windowID = 999) {
    var closeWindow = $("#window" + windowID + ">.cmWindow-top>.cmWindow-close")
    if (closeWindow != null) {

        //jquery绑定方法与原生有所不同

        closeWindow.click(function(e) {
            removeFromWindow(windowID);
            consoleOut("窗口" + windowID + "关闭");
        });


    } else {
        consoleOut("jQuery查找元素失败");
    }
}
bindWindowClose();

function createJsWindow(windowID = 0, windowName = null) {
    //元素id不可重复
    windowID = windowCreatedNum + 1;
    var elemWindow = new jsWindow(windowID, windowName);
    elemWindow.init();
    windowList.push(elemWindow);
    windowCreatedNum += 1;
    return elemWindow;
}