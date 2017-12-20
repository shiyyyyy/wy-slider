window.onload = function () {
    // 获取元素
    function $(obj) { return document.getElementsByClassName(obj)[0] };
    var swiper = $("swiper");         // 最大盒子
    var imgBox = $("sliderMain");       // 图片盒子
    var imgs = imgBox.children;         // 图片
    var btns = $("sliderCtrl").children;

    // 初始化
    var scrollWidth = swiper.offsetWidth;
    for(var i = 1 ; i < imgs.length ; i++ ){
        imgs[i].style.left = scrollWidth + "px";
    }
    var key = 0; // 用来控制播放的张数

    // 点击事件
    for (var k in btns) {
        btns[k].onclick = function () {
            // 如果惦记的是 左 按钮
            if (this.className == "sliderCtrlPrev") {
                animate(imgs[key], { left: scrollWidth });
                --key < 0 ? key = imgs.length - 1 : key;
                imgs[key].style.left = -scrollWidth + "px";
                animate(imgs[key], { left: 0 });
                // 小按钮改变
                changeCurrentStyle();
            }
            // 点击 右 按钮
            else if (this.className == "sliderCtrlNext") {
               autoplay();
            }
            // 点击的是 小按钮
            else {
                var that = this.innerHTML - 1;
                if (that > key) {
                    animate(imgs[key], { left: -scrollWidth });
                    imgs[that].style.left = scrollWidth + "px";
                } else if (that < key) {
                    animate(imgs[key], { left: scrollWidth });
                    imgs[that].style.left = -scrollWidth + "px";
                }
                key = that;
                animate(imgs[key], { left: 0 });
                // 小按钮改变
                changeCurrentStyle();
            }
        }
    }

    // 改变小按钮当前样式事件
    function changeCurrentStyle() {
        for (var i = 1, len = btns.length - 1; i < len; i++) {
            btns[i].className = "sliderCtrlCon";
        }
        btns[key+1].className = "sliderCtrlCon current";

    }

    // 自动播放
    var timer = null ;
    timer = setInterval(autoplay,3000);
    function autoplay(){
        animate(imgs[key], { left: -scrollWidth });
        ++key > imgs.length - 1 ? key = 0 : key;
        imgs[key].style.left = scrollWidth + "px";
        animate(imgs[key], { left: 0 })
        // 小按钮改变
        changeCurrentStyle();
    }

    // 鼠标移动 开始/暂停
    swiper.onmouseover = function(){
        clearInterval(timer);
    }
    swiper.onmouseout = function(){
        clearInterval(timer);
        timer = setInterval(autoplay,3000);
    }






    // 封装动画函数
    function animate(obj, json, fn) {  // 给谁    json
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var flag = true;  // 用来判断是否停止定时器   一定写到遍历的外面
            for (var attr in json) {   // attr  属性     json[attr]  值
                //开始遍历 json
                // 计算步长    用 target 位置 减去当前的位置  除以 10
                // console.log(attr);
                var current = 0;
                if (attr == "opacity") {
                    current = Math.round(parseInt(getStyle(obj, attr) * 100)) || 0;
                    console.log(current);
                }
                else {
                    current = parseInt(getStyle(obj, attr)); // 数值
                }
                // console.log(current);
                // 目标位置就是  属性值
                var step = (json[attr] - current) / 10;  // 步长  用目标位置 - 现在的位置 / 10
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                //判断透明度
                if (attr == "opacity")  // 判断用户有没有输入 opacity
                {
                    if ("opacity" in obj.style)  // 判断 我们浏览器是否支持opacity
                    {
                        // obj.style.opacity
                        obj.style.opacity = (current + step) / 100;
                    }
                    else {  // obj.style.filter = alpha(opacity = 30)
                        obj.style.filter = "alpha(opacity = " + (current + step) * 10 + ")";

                    }
                }
                else if (attr == "zIndex") {
                    obj.style.zIndex = json[attr];
                }
                else {
                    obj.style[attr] = current + step + "px";
                }

                if (current != json[attr])  // 只要其中一个不满足条件 就不应该停止定时器  这句一定遍历里面
                {
                    flag = false;
                }
            }
            if (flag)  // 用于判断定时器的条件
            {
                clearInterval(obj.timer);
                //alert("ok了");
                if (fn)   // 很简单   当定时器停止了。 动画就结束了  如果有回调，就应该执行回调
                {
                    fn(); // 函数名 +  （）  调用函数  执行函数
                }
            }
        }, 30)
    }
    function getStyle(obj, attr) {  //  谁的      那个属性
        if (obj.currentStyle)  // ie 等
        {
            return obj.currentStyle[attr];  // 返回传递过来的某个属性
        }
        else {
            return window.getComputedStyle(obj, null)[attr];  // w3c 浏览器
        }
    }


}