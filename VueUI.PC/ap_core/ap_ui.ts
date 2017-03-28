/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: UI基类
**-----------------------------------------------------------------
******************************************************************/
namespace ap.core {

    export class ui {
        public _id: string = "";
        public _page: any = null;
        public _control: any = null;
        public static CONTROLS: any = new Array();

        /*构造函数*/
        constructor(id: string) {
            this._id = id;
            ap.core.ui.CONTROLS[id] = this;
        }

        /*过滤组件*/
        public filterCom(x,b) {
            return x.$el.id == this._id;
        }

        /*window的click事件*/
        public winClick(targetdom, callback) {
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
            })
        }

        //public onSetValue() {
        //    var self = this;
        //    this._bus.$on('setValue', (key, value, container) => {
        //        container.$children.filter(function (x) { return x.$el.id == self._id })[0][key] = value;
        //    });
        //    return this._bus;
        //}
    }
}