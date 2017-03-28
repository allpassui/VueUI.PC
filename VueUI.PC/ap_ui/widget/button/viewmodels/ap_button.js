var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: button组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var button = (function (_super) {
                __extends(button, _super);
                /*构造函数*/
                function button(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(button.prototype, "value", {
                    /*value值设置*/
                    get: function () {
                        return this._control["storedtext"];
                    },
                    set: function (value) {
                        this._control["storedtext"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*初始化组件*/
                button.prototype.init = function () {
                    Vue.component("ap-button", {
                        props: {
                            fn: {
                                type: [Function, Object]
                            },
                            text: {
                                type: String,
                                default: ""
                            },
                            classname: {
                                type: String
                            },
                            type: {
                                type: String,
                                default: "button"
                            },
                            style: {
                                type: Object
                            }
                        },
                        data: function () {
                            return {
                                storedtext: ""
                            };
                        },
                        methods: {},
                        created: function () {
                            this.storedtext = this.text;
                            if (this.type == "a") {
                                this.$options.template = '<a :class="classname"  :style="style" ><slot></slot>{{storedtext}}</a>';
                            }
                            else {
                                this.$options.template = '<button type="button" :class="classname"  :style="style" ><slot></slot>{{storedtext}}</button>';
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return button;
            })(ap.core.ui);
            widget.button = button;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
