var selectedX = '1px/0.02ms',
    selected = 1,
    timeList = 10,
    TotalTime = '',//总时间
    XLength = '',//x 轴长度
    interval = '',//间隔
    standardPressure = '',//标准电压
    selectedY = '1px/20uv',
    YHeight = 20, // 高度动态变化
    arrs = [],// 所有的数据
    YNameHeight = 0,//基线高度动态变
    jointName = ['I', 'II', 'III', 'AVR', 'AVL', 'AVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'],//导联名称
    startX = '',
    startY = '',
    boxFlag = true,//判断是否已创建box
    measure = false; //是否开启测量

//初始化 canvas
function initCanvas() {
    var c_canvas = document.getElementById("ecg");
    arrs.push(arr);
    arrs.push(arr);
    arrs.push(arr2);
    TotalTime = parseInt(0.002 * arr.length);  //总时间
    remove();
    drawLine(c_canvas, '1');  //目标元素 ，宽度
}

$('#handChange').change(function () {
    arrs = [];
    if ($("#handChange").val() == '1px/0.02ms') {
        selected = 1;
        timeList = 10;
        remove();
    }
    if ($("#handChange").val() == '1px/0.01ms') {
        selected = 2;
        timeList = 20;
        remove();
    }
    if ($("#handChange").val() == '1px/0.005ms') {
        selected = 3;
        timeList = 30;
        remove();
    }
    initCanvas();
});
$('#handChangeY').change(function () {
    arrs = [];
    if ($("#handChangeY").val() == '1px/20uv') {
        YHeight = 20;
        YNameHeight = 1;
        remove();

    } else if ($("#handChangeY").val() == '1px/10uv') {
        YHeight = 10;
        YNameHeight = 1;
        remove();
    }
    setTimeout(function () {
        initCanvas();
    });
});

function remove() {
    $('#example').width(551 * selected - 51 * (selected - 1));
    $('#ecg').attr("width", 551 * selected - 51 * (selected - 1));
    $('#ecg').attr("height", 551);
    $('.box').remove();
    boxFlag = true;
    timeX();
}

//  初始化 心电图
function drawLine(c_canvas, width) {
    var ctx = c_canvas.getContext('2d');
    ctx.strokeWidth = width;
    ctx.clearRect(0, 0, c_canvas.width, c_canvas.height);   // 变化时清除原来的线
    paintingElectrocardiogram(ctx, c_canvas);
}

//     算心电图
function paintingElectrocardiogram(ctx, c_canvas) {

    if (TotalTime == 10 && arr.length >= 4995 || arr.length <= 5005) {   //10 秒 5001 个点    500导联   // if(1/0.002==500)
        standardPressure = 4.88;                           //标准电压
        XLength = TotalTime * 50 + 51;              //10秒基数为551
        interval = 10;               // 10个点用1个点
        drawingGrid(c_canvas);     //画网格
        CalculationCanvas(ctx, "#000000");
    } else if (1 / 0.004 == 250) {             //250  导联
        XLength = TotalTime * 50 + 51;            //默认10秒 ，基数551
        interval = 5;               // 5个点用1个点
        drawingGrid(c_canvas);
        CalculationCanvas(ctx, "#000000");
    } else if (1 / 0.008 == 125) {            //125 导联
        XLength = TotalTime * 50 + 51;            //默认10秒 ，基数551
        interval = 1;               //  interval=2.5;     2.5个点用1个点   先取两个中一个  再取后三个中一个
        drawingGrid(c_canvas);
        ctx.beginPath();
        for (var x = 50, i = 1; x < XLength * selected; x++, i++) {
            if (i % 2 == 0) {
                ctx.lineTo(x, -arr[Math.round((x - 49 + 2) * interval / selected)] * standardPressure / YHeight + ((i + 1) * 100))
            } else {
                ctx.lineTo(x, -arr[Math.round((x - 49 + 3) * interval / selected)] * standardPressure / YHeight + ((i + 1) * 100))
            }
        }
    }
}

//  计算导联图
function CalculationCanvas(ctx, color) {
    ctx.strokeStyle = color;
    for (var i = 0; i < arrs.length; i++) {
        canvasTitle(ctx, i);
        ctx.beginPath();
        for (var x = 50; x < XLength * selected; x++) {
            ctx.lineTo(x, -arrs[i][Math.round((x - 49) * interval / selected)] * standardPressure / YHeight + ((i + 1) * 100));
        }
        ctx.stroke();
        ctx.closePath();
    }
}

// 画网格
function drawingGrid(c_canvas) {
    drawSmallGrid(c_canvas, '#f1dedf', 1, 2);   //最小的网格  目标元素   宽度  每根线之间的距离
    drawMediumGrid(c_canvas, '#f0adaa', 1, 10);   //中等网格
    drawBigGrid(c_canvas, '#e0514b', 1, 50);  //大网格
}

//小网格
function drawSmallGrid(c_canvas, color, width, distance) {
    if (c_canvas.getContext) {
        var context = c_canvas.getContext("2d");
        context.strokeStyle = color;
        context.strokeWidth = width;
        context.beginPath();            //新建一条路径，路径一旦创建成功，图形绘制命令被指向到路径上生成路径
        for (var x = 0.5; x < XLength * selected; x += distance) {          //x轴
            context.moveTo(x, 0);     //路径的起始坐标
            context.lineTo(x, XLength);
            context.stroke();   //线条来绘制图形轮廓
        }
        for (var y = 0.5; y < XLength; y += distance) {
            context.moveTo(0, y);
            context.lineTo(XLength * selected, y);
            context.stroke();
        }
        context.closePath();   //闭合路径之后，图形绘制命令又重新指向到上下文中
    }
}

//中网格
function drawMediumGrid(c_canvas, color, width, distance) {
    if (c_canvas.getContext) {
        var context = c_canvas.getContext("2d");
        context.strokeStyle = color;
        context.strokeWidth = width;
        context.beginPath();
        for (var x = 0.5; x < XLength * selected; x += distance) {
            context.moveTo(x, 0);
            context.lineTo(x, XLength);
            context.stroke();
        }
        for (var y = 0.5; y < XLength; y += distance) {
            context.moveTo(0, y);
            context.lineTo(XLength * selected, y);
            context.stroke();
        }
        context.closePath();
    }
}

//大网格
function drawBigGrid(c_canvas, color, width, distance) {
    if (c_canvas.getContext) {
        var context = c_canvas.getContext("2d");
        context.strokeStyle = color;
        context.strokeWidth = width;
        context.beginPath();
        for (var x = 0.5; x < XLength * selected; x += distance) {
            context.moveTo(x, 0);
            context.lineTo(x, XLength);
            context.stroke();
        }
        for (var y = 0.5; y < XLength; y += distance) {
            context.moveTo(0, y);
            context.lineTo(XLength * selected, y);
            context.stroke();
        }
        context.closePath();
    }
}

//    基线
function canvasTitle(ctx, i) {
    ctx.beginPath();
    //  根据i 和 y轴坐标的关系，得到以下关系  (（i+1）*2-1)*50
    ctx.moveTo(0, 50 + ((i + 1) * 2 - 1) * 50);
    ctx.lineTo(10, 50 + ((i + 1) * 2 - 1) * 50);
    if (selectedY == '1px/10uv') {
        ctx.lineTo(10, ((i + 1) * 2 - 1) * 50 - 50);
        ctx.lineTo(30, ((i + 1) * 2 - 1) * 50 - 50);
    } else if (selectedY == '1px/20uv') {
        ctx.lineTo(10, ((i + 1) * 2 - 1) * 50);
        ctx.lineTo(30, ((i + 1) * 2 - 1) * 50);
    }
    ctx.lineTo(30, 50 + ((i + 1) * 2 - 1) * 50);
    ctx.lineTo(40, 50 + ((i + 1) * 2 - 1) * 50);
    ctx.stroke();
    ctx.closePath();
    ctx.font = "20px Courier New";
    ctx.strokeText(jointName[i], 35, ((i + 1) * 2 - 1) * 50 + 30);
}

$('.measure').on('click', function () {
    measure = !measure;
    if (measure) {
        $('.measure').html('关闭');
    } else {
        boxFlag = false;
        $('.box').remove();
        $('.measure').html('测量');
    }
});

// 动态拼接时间
function timeX() {
    $('.time_x').empty();
    var spanTime = '';
    for (var i = 0; i <= timeList; i++) {
        if (i == 0) {
            spanTime += "<span class=time_l>" + (i / timeList * 10) + "s</span>";
        } else {
            spanTime += "<span class=time>" + (i / timeList * 10).toFixed(1) + "s</span>";
        }
    }
    $('.time_x').append(spanTime);
}

/////////////////////////////////////
//  鼠标按下
$('#ecg').mousedown(function (e) {
    e = e || window.event;
    startX = e.pageX;
    startY = e.pageY;
    boxFlag = true;
    $('.box').remove();
    // 判断是否已有box
    if (boxFlag) {
        // 在页面创建 box
        var active_box = document.createElement("div");
        active_box.id = "active_box";
        active_box.className = "box";
        active_box.style.top = startY - 30 + 'px';       //注意此处减30 因为获取的高度为相对浏览器的高度，所以要减去上面高度
        active_box.style.left = startX + 'px';
        document.getElementById('example').appendChild(active_box);
        active_box = null;
        // 创建标尺
        var ruler = document.createElement("div");
        ruler.id = 'ruler';
        ruler.style.position = 'absolute';
        ruler.style.bottom = -20 + 'px';
        ruler.style.left = 0 + 'px';
        ruler.style.fontWeight = 1000;
        var box = document.getElementsByClassName("box")[0];
        box.appendChild(ruler);
        boxFlag = false;
    }
});
//     鼠标移动
$('#ecg').mousemove(function (e) {
    if (measure) {
        e = e || window.event;
        var active_box = document.getElementById("active_box");
        if (document.getElementById("active_box") !== null) {
            var ab = document.getElementById("active_box");
            ab.style.width = e.pageX - startX + 'px';
            ab.style.height = e.pageY - startY + 'px';
            //计算 标尺
            var time_x = parseFloat(selectedX.split('px/')[1]);
            var time_y = parseFloat(selectedY.split('px/')[1]);
            var ruler_x = ab.style.width.split('px')[0] * time_x;
            var ruler_y = ab.style.height.split('px')[0] * time_y;
            document.getElementById('ruler').innerHTML = ruler_x.toFixed(2) + 's,' + ruler_y.toFixed(2) + 'uv '
        }
    }
});
//     鼠标抬起
$('#ecg').mouseup(function () {
    // 禁止拖动
    //dragging = false;
    if (document.getElementById("active_box") !== null) {
        var ab = document.getElementById("active_box");
        ab.removeAttribute("id");
        if (ab.offsetWidth < 3 || ab.offsetHeight < 3) {
            document.getElementById('example').removeChild(ab);
        }
    }
});