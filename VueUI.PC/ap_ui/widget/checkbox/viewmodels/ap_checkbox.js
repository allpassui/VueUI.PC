var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: checkbox组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var checkbox = (function (_super) {
                __extends(checkbox, _super);
                /*构造函数*/
                function checkbox(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(checkbox.prototype, "value", {
                    /*复选框选中值*/
                    get: function () {
                        return this._control["value"];
                    },
                    set: function (value) {
                        this._control["value"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(checkbox.prototype, "options", {
                    /*复选框选项*/
                    get: function () {
                        return this._control["options"];
                    },
                    set: function (value) {
                        this._control["options"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(checkbox.prototype, "data", {
                    /*复选框数据*/
                    get: function () {
                        return this._control["data"];
                    },
                    set: function (value) {
                        this._control["data"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(checkbox.prototype, "dataValueField", {
                    /*value值*/
                    get: function () {
                        return this._control["dataValueField"];
                    },
                    set: function (value) {
                        this._control["dataValueField"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(checkbox.prototype, "dataTextField", {
                    /*text值*/
                    get: function () {
                        return this._control["dataTextField"];
                    },
                    set: function (value) {
                        this._control["dataTextField"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(checkbox.prototype, "disabled", {
                    /*disabled值*/
                    get: function () {
                        return this._control["disabled"];
                    },
                    set: function (value) {
                        this._control["disabled"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*初始化组件*/
                checkbox.prototype.init = function () {
                    Vue.component("ap-checkbox", {
                        template: '<div>' +
                            '<label v-for="(item,index) in options" class="m-choicelabel" v-on:click="iclick(item.value,index)"><i :class="cbclass(item.value,index)"></i>{{item.text}}</label>' +
                            '</div>',
                        props: {
                            callback: Function
                        },
                        data: function () {
                            return {
                                value: [],
                                options: [],
                                data: [],
                                dataValueField: "",
                                dataTextField: "",
                                disabled: []
                            };
                        },
                        watch: {
                            data: function () {
                                var self = this;
                                if (!(this.dataValueField && this.dataTextField))
                                    return;
                                this.options = [];
                                this.data.forEach(function (value, index, arr) {
                                    var obj = {};
                                    obj.value = value[self.dataValueField];
                                    obj.text = value[self.dataTextField];
                                    self.options.push(obj);
                                });
                            }
                        },
                        methods: {
                            cbclass: function (val, index) {
                                if (this.value.indexOf(val) > -1) {
                                    if (this.disabled[index]) {
                                        return "u-checkbox icon-checkbox icon-checkboxsel dis";
                                    }
                                    else {
                                        return "u-checkbox icon-checkbox icon-checkboxsel";
                                    }
                                }
                                else {
                                    if (this.disabled[index]) {
                                        return "u-checkbox icon-checkbox dis";
                                    }
                                    else {
                                        return "u-checkbox icon-checkbox";
                                    }
                                }
                            },
                            iclick: function (val, index) {
                                if (this.disabled[index])
                                    return;
                                if (this.value.indexOf(val) > -1) {
                                    for (var i = 0; i < this.value.length; i++) {
                                        if (this.value[i] == val) {
                                            this.value.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                                else
                                    this.value.push(val);
                                if (this.callback) {
                                    this.callback(val, this.value);
                                }
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return checkbox;
            })(ap.core.ui);
            widget.checkbox = checkbox;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
