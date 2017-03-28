/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: UI基类
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var core;
    (function (core) {
        var ui = (function () {
            /*构造函数*/
            function ui(id) {
                this._id = "";
                this._page = null;
                this._control = null;
                this._id = id;
                ap.core.ui.CONTROLS[id] = this;
            }
            /*过滤组件*/
            ui.prototype.filterCom = function (x, b) {
                return x.$el.id == this._id;
            };
            /*window的click事件*/
            ui.prototype.winClick = function (targetdom, callback) {
                window.addEventListener("click", function (e) {
                    var dom = e.target;
                    while (dom) {
                        if (dom == targetdom) {
                            return;
                        }
                        dom = dom.parentElement;
                        if (dom == document.body) {
                            break;
                        }
                    }
                    callback();
                });
            };
            ui.CONTROLS = new Array();
            return ui;
        })();
        core.ui = ui;
    })(core = ap.core || (ap.core = {}));
})(ap || (ap = {}));
