(function () {
    function LayerPK() {

    }
    //【询问框】：
    LayerPK.prototype.Layer_XW = function (title, width,height, message, btnname, btnnames, fun,fun1, icon) {
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
            ,btn2: function () {
            if (fun != null || fun != undefined) {
                fun();
            }

            }

        });

       
    }


    //【iframe层一】
    //弹出新页面
    LayerPK.prototype.Layer_Iframe = function (ititle, awidth, aheight, isrc) {        
        layer.open({
            type: 2,
            maxmin: false,
            shadeClose: false,
            title: ititle,
            shade: [0.4, '#000'],
            //offset: [($(window).height() - aheight)/2 + 'px', ''],
            area: [awidth, aheight],
            content: isrc
        });
    }


    //【iframe层二】
    //弹出客户反馈
    LayerPK.prototype.Layer_Iframe2 = function (ititle,awidth,aheight,isrc){
        layer.open({
           type: 2,
            maxmin: false,
            shadeClose: false,
            title: ititle,
            shade: [0.4, '#000'],      
            area: [awidth, aheight],            
            offset: [($(window).height() - 545) +'px',($(window).width() - 700) +'px'],
            content: isrc
        }); 
    }

    LayerPK.prototype.Layer_Close = function () {
        layer.closeAll();
    }

    LayerPK.prototype.msg = function (vtitle, vwidth, vheight, msg, btn1, btn2, fun,fun1,icon) {
        return layerpk.Layer_XW(vtitle, vwidth, vheight, msg, btn1, btn2, fun, fun1, icon);
    }

    LayerPK.prototype.IframePage = function (ititle, awidth, aheight, isrc) {
        layerpk.Layer_Iframe(ititle, awidth, aheight, isrc)
    }

     LayerPK.prototype.IframePage2 = function (ititle, awidth, aheight, isrc) {
        layerpk.Layer_Iframe2(ititle, awidth, aheight, isrc)
    }

    //关闭弹出新页面	
    LayerPK.prototype.Close = function () {
        layer.close(layer.index);
    }

    LayerPK.prototype.Page_Close = function () {
        window.parent.document.getElementById("btnClose").click();
    }

    //提示
    LayerPK.prototype.alert = function (msg, number) {
        layer.msg(msg, {icon: number,time:2000});
    }

    LayerPK.prototype.Tips = function (obj, msg) {
        layer.tips(msg, obj, { guide: 1, time: 2000 });
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