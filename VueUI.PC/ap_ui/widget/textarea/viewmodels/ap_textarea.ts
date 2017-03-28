/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: textarea组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class textarea extends ap.core.ui {

        /*构造函数*/
        constructor(id: any) {
            super(id);
            this.init();
        }

        /*value值设置*/
        public get value(): any {
            return this._control["value"];
        }

        public set value(value: any) {
            this._control["value"] = value;
        }

        /*初始化*/
        public init() {
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
                    }
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
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            });
        }
    }
}