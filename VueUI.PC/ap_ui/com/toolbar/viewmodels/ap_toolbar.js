/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 侧边工具栏
**-----------------------------------------------------------------
******************************************************************/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var com;
        (function (com) {
            var toolbar = (function (_super) {
                __extends(toolbar, _super);
                function toolbar(id) {
                    _super.call(this, id);
                    this.init();
                }
                toolbar.prototype.init = function () {
                    Vue.component("ap-toolbar", {
                        template: Base64.decode(sessionStorage["ap-toolbar"]),
                        props: {
                            fn: Function
                        },
                        methods: {
                            buttonClick: function () {
                                if (typeof (this.fn) == "function") {
                                    this.fn();
                                }
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return toolbar;
            })(ap.core.ui);
            com.toolbar = toolbar;
        })(com = ui.com || (ui.com = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
