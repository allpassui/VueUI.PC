/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: input组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class input extends ap.core.ui{
        
        /*构造函数*/
        constructor(id?: string) {
            super(id);
            this.init();
        }

        /*value值设置*/
        public get value(): any {
            return this._control["value"];
        }

        public set value(value:any) {
            this._control["value"] = value;
        }

        /*disabled值设置*/
        public get disabled(): any {
            return this._control["disabled"];
        }

        public set disabled(value: any) {
            this._control["disabled"] = value;
        }

        /*初始化组件*/
        public init(): any {
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
                data() {
                    return {
                        value: "",
                        disabled: false
                    }
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
                created() {
                },
                mounted: function () {
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(
                        (ctl, index) => { return ctl.$el.id == this.$el.id }
                    )[0];
                }
            })
        }

    }
    
}