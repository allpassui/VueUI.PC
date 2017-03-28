var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: input组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var input = (function (_super) {
                __extends(input, _super);
                /*构造函数*/
                function input(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(input.prototype, "value", {
                    /*value值设置*/
                    get: function () {
                        return this._control["value"];
                    },
                    set: function (value) {
                        this._control["value"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(input.prototype, "disabled", {
                    /*disabled值设置*/
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
                input.prototype.init = function () {
                    Vue.component("ap-input", {
                        template: '<input :type="type" v-model="value" v-on:input="onInput" :class="classname" :style="style" @blur="blur" @focus="focus" @keydown="keydown" :placeholder="placeholder" :data-check="validate" :data-checkmsg="checkmsg" :maxlength="maxlength" :disabled="disabled"/>',
                        props: {
                            type: {
                                type: String,
                                default: "text"
                            },
                            style: String,
                            validate: [String, Object],
                            placeholder: [String],
                            checkmsg: [String, Object],
                            classname: {
                                type: String,
                                default: "allpass-input-regular"
                            },
                            changefn: Function,
                            maxlength: String,
                            onkeydown: Function
                        },
                        data: function () {
                            return {
                                value: "",
                                disabled: false
                            };
                        },
                        watch: {
                            value: function (val) {
                                var self = this;
                                if (this.type != "hidden")
                                    return;
                                if (!val)
                                    return;
                                setTimeout(function () {
                                    self.blur();
                                }, 10);
                            }
                        },
                        methods: {
                            onInput: function (event) {
                                if (this.changefn) {
                                    this.changefn();
                                }
                                //前者用v-model双向绑定,后者是data存储的input的值
                                this.$emit('input', event.target.value);
                                //this.storedvalue = event.target.value;
                            },
                            blur: function () {
                                if (!this.validate)
                                    return;
                                var dom = this.$el;
                                if (dom.getAttribute("data-blur") == "false")
                                    return false;
                                var isError = ap.ui.widget.Validate.validInput(dom);
                                return isError;
                            },
                            focus: function () {
                            },
                            keydown: function () {
                                if (this.onkeydown) {
                                    this.onkeydown();
                                }
                            }
                        },
                        created: function () {
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return input;
            })(ap.core.ui);
            widget.input = input;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
