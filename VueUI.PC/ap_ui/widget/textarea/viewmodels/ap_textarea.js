var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: textarea组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var textarea = (function (_super) {
                __extends(textarea, _super);
                /*构造函数*/
                function textarea(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(textarea.prototype, "value", {
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
                /*初始化*/
                textarea.prototype.init = function () {
                    Vue.component("ap-textarea", {
                        template: '<textarea :cols="cols" :rows="rows" :style="style" v-model="value" :class="classname" v-on:input="onInput" :data-check="validate" :data-checkmsg="checkmsg" :maxlength="maxlength"></textarea>',
                        props: {
                            cols: String,
                            rows: String,
                            style: String,
                            classname: String,
                            validate: [String, Object],
                            checkmsg: [String, Object],
                            maxlength: String,
                            changefn: Function
                        },
                        data: function () {
                            return {
                                value: ""
                            };
                        },
                        watch: {
                            value: function (val) {
                                var self = this;
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
                                this.$emit('input', event.target.value);
                                //this.value = event.target.value;
                            },
                            blur: function () {
                                if (!this.validate)
                                    return;
                                var dom = this.$el;
                                if (dom.getAttribute("data-blur") == "false")
                                    return false;
                                var isError = ap.ui.widget.Validate.validInput(dom);
                                return isError;
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return textarea;
            })(ap.core.ui);
            widget.textarea = textarea;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
