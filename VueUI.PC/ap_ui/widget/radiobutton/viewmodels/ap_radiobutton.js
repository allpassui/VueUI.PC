var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: radiobutton组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var radiobutton = (function (_super) {
                __extends(radiobutton, _super);
                /*构造函数*/
                function radiobutton(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(radiobutton.prototype, "value", {
                    /*单选框选中值*/
                    get: function () {
                        return this._control["value"];
                    },
                    set: function (value) {
                        this._control["value"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(radiobutton.prototype, "options", {
                    /*单选框选项*/
                    get: function () {
                        return this._control["options"];
                    },
                    set: function (value) {
                        this._control["options"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(radiobutton.prototype, "data", {
                    /*单选框数据*/
                    get: function () {
                        return this._control["data"];
                    },
                    set: function (value) {
                        this._control["data"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(radiobutton.prototype, "dataValueField", {
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
                Object.defineProperty(radiobutton.prototype, "dataTextField", {
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
                /*初始化组件*/
                radiobutton.prototype.init = function () {
                    Vue.component("ap-radiobutton", {
                        template: '<div class="allpass-rb-outer">' +
                            '<label v-for="(value,index) in options" class="formLabel"  v-on:click="rdclick(value.value)"><i :class="radioclass(index)"></i>{{value.text}}</label>' +
                            '</div>',
                        data: function () {
                            return {
                                value: "",
                                options: [],
                                data: [],
                                dataValueField: "",
                                dataTextField: ""
                            };
                        },
                        props: {
                            callback: Function
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
                            radioclass: function (index) {
                                if (this.value) {
                                    return this.value == this.options[index].value ? "u-radio icon-radio icon-radiosel" : "u-radio icon-radio";
                                }
                                else {
                                    return "u-radio icon-radio";
                                }
                            },
                            rdclick: function (value) {
                                this.value = value;
                                console.log(value);
                                this.$emit('input', value);
                                if (this.callback) {
                                    this.callback(value);
                                }
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return radiobutton;
            })(ap.core.ui);
            widget.radiobutton = radiobutton;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
