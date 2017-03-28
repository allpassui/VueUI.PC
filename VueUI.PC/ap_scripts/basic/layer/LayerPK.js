(function () {
	function LayerPK() {

	}
	//【询问框】：
	LayerPK.prototype.Layer_XW = function (title, width, height, message, btnname, btnnames, fun, fun1, icon) {
		var typeIcon = -1;
		if (icon != null || fun != undefined) {
			typeIcon = icon;
		}
		layer.open({
			type: 0,
			title: title,
			shade: [0],
			icon: typeIcon,
			area: width,
			content: message,
			btn: [btnname, btnnames],
			yes: function () {
				if (fun1 != null || fun1 != undefined) {
					fun1();
				}
				layer.closeAll();
			}
            , btn2: function () {
            	if (fun != null || fun != undefined) {
            		fun();
            	}

            }

		});


	}


	//【iframe层一】
	//弹出新页面
	LayerPK.prototype.Layer_Iframe = function (ititle, awidth, aheight, isrc) {
		//layer.open({
		//    type: 2,
		//    maxmin: false,
		//    shadeClose: false,
		//    title: ititle,
		//    shade: [0.4, '#000'],
		//    offset: ['50px', ''],
		//    area: [awidth+'px', aheight+'px'],
		//    iframe: { src: isrc }
		//});

		layer.open({
			type: 2,
			maxmin: false,
			shadeClose: false,
			title: ititle,
			shade: [0.4, '#000'],
			//	offset: [($(window).height() - aheight)/2 + 'px', ''],
			area: [awidth + 'px', aheight + 'px'],
			content: isrc

		});
	}
	//【iframe层二】
	//弹出客户反馈
	LayerPK.prototype.Layer_Iframe2 = function (ititle, awidth, aheight, isrc) {
		//layer.open({
		//	type: 2,
		//	move: false,
		//	shadeClose: true,
		//	shade: [0, '#fff'],
		//	fadeIn: 300,
		//	title: ititle,
		//	area: [awidth + 'px', aheight + 'px'],
		//	content: isrc,
		//	offset: [($(window).height() - 545) + 'px', ($(window).width() - 700) + 'px'],
		//	shift: 'right-bottom'
		//});
		layer.open({
			type: 2,
			move: false,
			shadeClose: true,
			//shade: [0, '#fff'],
			maxmin: false,
			title: ititle,
			content: isrc,
			offset: [($(window).height() - 515) + 'px', ($(window).width() - 650) + 'px'],
			area: [awidth + 'px', aheight + 'px'],
			shift: 'right-bottom'
			//content: isrc

		});
	}

	//【iframe层三】
	//弹出客户反馈
	LayerPK.prototype.Layer_Iframe3 = function (ititle, awidth, aheight, isrc, closebtn) {
		//layer.open({
		//	type: 2,
		//	move: false,
		//	shadeClose: true,
		//	shade: [0, '#fff'],
		//	fadeIn: 300,
		//	title: ititle,
		//	area: [awidth + 'px', aheight + 'px'],
		//	content: isrc,
		//	offset: [($(window).height() - 545) + 'px', ($(window).width() - 700) + 'px'],
		//	shift: 'right-bottom'
		//});
		layer.open({
			type: 2,
			maxmin: false,
			shadeClose: false,
			title: ititle,
			closeBtn: closebtn,
			shade: [0.4, '#000'],
			//	offset: [($(window).height() - aheight)/2 + 'px', ''],
			area: [awidth + 'px', aheight + 'px'],
			content: isrc

		});
	}

	LayerPK.prototype.Layer_Close = function () {
		layer.closeAll();
	}

	LayerPK.prototype.msg = function (vtitle, vwidth, vheight, msg, btn1, btn2, fun, fun1, icon) {
		return layerpk.Layer_XW(vtitle, vwidth, vheight, msg, btn1, btn2, fun, fun1, icon);
	}

	LayerPK.prototype.IframePage = function (ititle, awidth, aheight, isrc) {
		layerpk.Layer_Iframe(ititle, awidth, aheight, isrc)
	}
	LayerPK.prototype.IframePage2 = function (ititle, awidth, aheight, isrc) {
		layerpk.Layer_Iframe2(ititle, awidth, aheight, isrc)
	}
	LayerPK.prototype.IframePage3 = function (ititle, awidth, aheight, isrc, closebtn) {
		layerpk.Layer_Iframe3(ititle, awidth, aheight, isrc, closebtn)
	}

	//关闭弹出新页面	
	LayerPK.prototype.Close = function () {
		layer.close(layer.index);
	}

	LayerPK.prototype.Page_Close = function () {
		window.parent.document.getElementById("btnClose").click();
	}

	//删除提示
	LayerPK.prototype.DeleteMsg = function (msg, fun) {
		var vtitle = "删除" + msg;
		var vwidth = "400";
		var vheight = "200";
		msg = "确认要把所选" + msg + "删除吗？";
		var btn1 = "取消";
		var btn2 = "确定";
		return layerpk.Layer_XW(vtitle, vwidth, vheight, msg, btn1, btn2, fun);
	}

	//删除提示
	LayerPK.prototype.ClearMsg = function (msg, fun) {
		var vtitle = "清空" + msg;
		var vwidth = "400";
		var vheight = "200";
		msg = "确认要把" + msg + "清空吗？";
		var btn1 = "取消";
		var btn2 = "确定";
		return layerpk.Layer_XW(vtitle, vwidth, vheight, msg, btn1, btn2, fun);
	}

	//放弃提示
	LayerPK.prototype.CancelMoveMsg = function (msg, fun) {
		var vtitle = "放弃" + msg; //msg 移动七巧板
		var vwidth = "400";
		var vheight = "200";
		msg = "确认要把放弃" + msg + "机会吗？";
		var btn1 = "取消";
		var btn2 = "确定";
		return layerpk.Layer_XW(vtitle, vwidth, vheight, msg, btn1, btn2, fun);
	}

	//修改状态提示
	LayerPK.prototype.UpdateMsg = function (msg, fun) {
		var vtitle = "启动/暂停" + msg;
		var vwidth = "400";
		var vheight = "200";
		msg = "确认要把所选" + msg + "启动/暂停吗？";
		var btn1 = "取消";
		var btn2 = "确定";
		return layerpk.Layer_XW(vtitle, vwidth, vheight, msg, btn1, btn2, fun);
	}

	//重选模板提示
	LayerPK.prototype.ChooseTemplate = function (title, msg, fun) {
		var vwidth = "400";
		var vheight = "200";
		var btn1 = "取消";
		var btn2 = "确定";
		return layerpk.Layer_XW(title, vwidth, vheight, msg, btn1, btn2, fun);
	}

	//提示
	LayerPK.prototype.alert = function (msg, number) {
		layer.msg(msg, { icon: number, time: 2000 });
	}

	//提示自定义时间
	LayerPK.prototype.alert_time = function (msg, number, time) {
		layer.msg(msg, { icon: number, time: time });
	}

	//JS没有重载
	LayerPK.prototype.Tips = function (obj, msg, time) {
		if (!time) {
			return layer.tips(msg, obj, { guide: 2, time: 2000, tipsMore: true });
		} else {
			//layer.tips(msg, obj, { guide: 1, time: 2 });
			return layer.tips(msg, obj, { guide: 2, time: -1, tipsMore: true });
		}
	}
	LayerPK.prototype.TipsNoMore = function (obj, msg, time) {
		//layer.tips(msg, obj, { guide: 1, time: 2 });
		return layer.tips(msg, obj, { guide: 2, time: time, tipsMore: false });
	}
	/*
    //提示信息向下
    //txc 2015/4/7
    */
	LayerPK.prototype.UpTips = function (obj, msg) {
		layer.tips(msg, obj, { guide: 2, time: 2 });
	}

	layerpk = new LayerPK();
})()

function Page_Close() {
	window.parent.document.getElementById("btnClose").click();
}
//关闭弹出新页面	
function Close() {
	layer.close(layer.index);
}