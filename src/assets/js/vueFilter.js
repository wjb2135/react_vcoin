import Vue from 'vue'
import store from '@/vuex/store'

Vue.filter('time', function(value) {
 	// value是整数，否则要parseInt转换
    var time = new Date((parseInt(value))*1000);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();

    return (m<10?'0'+m:m) + '-' + (d<10?'0'+d:d);
});

Vue.filter('times', function (value) {
    // value是整数，否则要parseInt转换
    var time = new Date((parseInt(value)) * 1000);
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();

    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
});


Vue.filter('fullTime', function(value) {
 	// value是整数，否则要parseInt转换
    var time = new Date((parseInt(value))*1000);
    var Y = time.getFullYear();
    var M = time.getMonth()+1;
    var D = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();

    return Y + '-' + (M<10?'0'+M:M) + '-' + (D<10?'0'+D:D) + ' ' + (h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s);
});

Vue.filter('getDateDiff', function(dateTimeStamp) {
    var minute = 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;

    var now = Date.parse(new Date())/1000;
    var diffValue = now - (parseInt(dateTimeStamp));
    if (diffValue < 0) {

        //若日期不符则弹出窗口告之

        //alert("结束日期不能小于开始日期！");

    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    let result;
    if (monthC >= 1) {
        result = "发表于" + parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        result = "发表于" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        result = "发表于" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        result = "发表于" + parseInt(hourC) + "个小时前";
    } else if (minC >= 1) {
        result = "发表于" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚发表";
    return result;
});

/**
 * 金额格式化 添加“,”分隔符
 * @param {Number} money 金额
 * @param {Number} dc_num 保留几位小数、默认3位
 */
Vue.filter('formatMoney', function (money,dc_num = 3) {
    // 为空则返回空
    if(money == "") {
        return "";
    }
    // 判断money是否为有效数字
    money = parseFloat(money) + "";
    if ('NaN' == money) {
        return "0.000";
    }
    // 获取数字的符号 - 或 +
    var money_flag = "";
    if (money.indexOf("-") != -1) {
        money = money.replace(/-/g, "");
        money_flag = "-";
    }
    // 小数位个数
    var money_decimals = "."
    for(var i=0;i<dc_num;i++){money_decimals+="0"}

    var decimals_index = money.indexOf(".")
    // 获取小数部分
    if(decimals_index!= -1){
        // 根据输入的位数截取小数
        money_decimals = money.substring(decimals_index,decimals_index+dc_num+1)
        money = money.substr(0,decimals_index)
    }
    // 整数部分每三位加一个逗号
    var re = /(\d)(?=(?:\d{3})+$)/g;
    while (re.test(money)) {
        money = money.replace(re,'$1,');
    }
    // 拼接
    return money_flag + money + money_decimals;
});

// 全局自定义指令
// 滑动验证
Vue.directive('move', function (el) {
    var done = false; // 是否通过验证
    el.onmousedown = function (e) {
        var X = e.clientX - el.offsetLeft
        document.onmousemove = function (e) {
            var endx = e.clientX - X
            el.className = 'move moveBefore'
            el.style.left = endx + 'px'
            // console.log(el.parentNode.children[0])
            var width = $('.movebox').width() - $('.move').width()
            el.parentNode.children[0].style.width = endx + 'px'
            el.parentNode.children[1].innerHTML = '请按住滑块，拖动到最右边'
            //临界值小于
            if (endx <= 0) {
                el.style.left = 0 + 'px'
                el.parentNode.children[0].style.width = 0 + 'px'
                //$('.movego').width(0)
                store.dispatch('setMoveSuccess', false);
            }
            //临界值大于
            // console.log(el.style.left)
            if (parseInt(el.style.left) >= width) {
                el.style.left = width + 'px'
                el.parentNode.children[0].style.width = width + 'px'
                el.parentNode.children[1].className = 'txt success'
                el.parentNode.children[1].innerHTML = '验证通过'
                el.className = 'move moveSuccess'
                el.onmousedown = null;
                done = true;
                store.dispatch('setMoveSuccess', true);
            }
        }
    }
    document.onmouseup = function (e) {
        document.onmousemove = null;
        if (done) {
            store.dispatch('setMoveSuccess', true);
            return;
        }
        el.style.left = 0 + 'px'
        el.parentNode.children[0].style.width = 0 + 'px'
        store.dispatch('setMoveSuccess', false);
    }
})