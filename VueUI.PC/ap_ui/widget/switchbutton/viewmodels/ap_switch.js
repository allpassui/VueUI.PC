var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 开关组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var switchbutton = (function (_super) {
                __extends(switchbutton, _super);
                function switchbutton(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(switchbutton.prototype, "value", {
                    get: function () {
                        return this._control["value"];
                    },
                    set: function (value) {
                        this._control["value"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(switchbutton.prototype, "options", {
                    get: function () {
                        return this._control["options"];
                    },
                    set: function (value) {
                        this._control["options"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                switchbutton.prototype.init = function () {
                    Vue.component("ap-switch", {
                        template: '<div class="allpass-switch-outer">' +
                            '<div v-for="(item,index) in options" v-on:click="divClick(index)"><input type="radio" class="allpass-switch allpass-switch-animbg" :checked="item.checked"/><label>{{item.value}}</label></div>' +
                            '</div>',
                        data: function () {
                            return {
                                value: "",
                                options: ""
                            };
                        },
                        methods: {
                            divClick: function (index) {
                                this.options[index].checked = !(this.options[index].checked);
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return switchbutton;
            })(ap.core.ui);
            widget.switchbutton = switchbutton;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
