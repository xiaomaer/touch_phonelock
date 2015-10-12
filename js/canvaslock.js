//计算九个圆的圆心
var openlock = (function() {
	var doc = document,
		radius = 25,
		borderwidth = 2,
		wdis, hdis,
		canvas = doc.getElementById("canvas"),
		touchPoints = [],
		ninepoints = [];
	//设置画布的宽高，并计算圆之间的距离
	function setCanvasSize() {
			var bodywidth = window.innerWidth || doc.body.clientWidth || doc.documentElement.clientWidth,
				bodyheight = window.innerHeight || doc.body.clientHeight || doc.documentElement.clientHeight,
				//窗口宽高
				cwidth = doc.body.offsetWidth,
				cheight = doc.body.offsetHeight;
			//body的宽高
			canvas.width = cwidth;
			canvas.height = cheight;
			wdis = (cwidth - 3 * 2 * (radius + borderwidth)) / 6;
			hdis = (cheight - 3 * 2 * (radius + borderwidth)) / 6;
		}
		//计算圆心

	function circleCenters() {
		var points = [];
		for (var col = 0; col < 3; col++) {
			for (var row = 0; row < 3; row++) {
				var point = {
					x: (wdis + radius + borderwidth) * (row * 2 + 1),
					y: (hdis + radius + borderwidth) * (col * 2 + 1)
				}
				points.push(point);
			}
		}
		return points;
	}

	//初始化画布，即绘制九个圆
	function initCavans() {
		ninepoints = circleCenters();
		var len = ninepoints.length,
			ctx = canvas.getContext("2d");

		ctx.strokeStyle = "white";
		ctx.lineWidth = borderwidth;
		for (var i = 0; i < len; i++) {
			ctx.beginPath();
			ctx.arc(ninepoints[i].x, ninepoints[i].y, radius, 0, Math.PI * 2, false);
			ctx.stroke();
		}

	}

	function istouchstart(event) {
			var targets = event.touches;
			if (targets.length === 1) {
				isPointselect(targets[0]);
			}
		}
		//判断手指是否在圆圈上

	function isPointselect(target) {
		var powx, powy, dis,
			pagex = target.pageX,
			pagey = target.pageY;
		for (var i = 0; i < ninepoints.length; i++) {
			powx = Math.pow((ninepoints[i].x - pagex), 2);
			powy = Math.pow((ninepoints[i].y - pagey), 2);
			dis = Math.sqrt((powx + powy));
			if (dis < radius) //触摸点到圆心的距离小于半径时，则触发事件
			{
				if (touchPoints.indexOf(i) === -1) //值i是否存在于数组中，不存在返回-1，存在的话返回在数组中的位置
				{ //不存在于数组中，就保存
					touchPoints.push(i);
					var ctx = canvas.getContext("2d");
					ctx.beginPath();
					ctx.fillStyle = "white";
					ctx.arc(ninepoints[i].x, ninepoints[i].y, 8, 0, 2 * Math.PI, false);
					ctx.fill();
				}
				break; //结束循环
			}

		}
	}


///questions:不知道如何实现“直线跟着手指移动”？
	function istouchmove(event) {
		event.preventDefault(); //阻止默认行为滚动
		var touches = event.targetTouches;
		if (touches.length == 1) {
			isPointselect(touches[0]);
			if (touchPoints.length > 1) {
				var maxlen = touchPoints.length - 1,
					beforecurr = touchPoints[maxlen - 1],
					currlen = touchPoints[maxlen],
					ctx = canvas.getContext("2d");
				ctx.beginPath();
				ctx.lineWidth = 6;
				ctx.strokeStyle = "white";
				ctx.moveTo(ninepoints[beforecurr].x, ninepoints[beforecurr].y);
				ctx.lineTo(ninepoints[currlen].x, ninepoints[currlen].y);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}

 //显示密码，并且1s后清空画布，即绘制线消失
	function istouchend() {
		alert("密码是：" + touchPoints.join(""));
		setTimeout(clearcanvas,1000);

	}
	//清空画布，并重新绘制九宫格
	function clearcanvas(){
		var cwidth = doc.body.offsetWidth,
			cheight = doc.body.offsetHeight,
			ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0,cwidth,cheight);
		touchPoints = [];
		openlock.initCanvas();
	}
	}
	return {
		setCanvas: setCanvasSize,
		initCanvas: initCavans,
		handlestart: istouchstart,
		handlemove: istouchmove,
		handleend: istouchend
	};
})();
window.onload = function() {
	openlock.setCanvas();
	openlock.initCanvas();
};
window.onresize = function() {
	openlock.setCanvas();
	openlock.initCanvas();
};
document.addEventListener("touchstart", openlock.handlestart, false);
document.addEventListener("touchmove", openlock.handlemove, false);
document.addEventListener("touchend", openlock.handleend, false);