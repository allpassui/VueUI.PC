/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: radiobutton组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class radiobutton extends ap.core.ui {
        
        /*构造函数*/
        constructor(id?: string) {
            super(id);
            this.init();
        }

        /*单选框选中值*/
        public get value(): any {
            return this._control["value"];
        }

        public set value(value: any) {
            this._control["value"] = value;
        }

        /*单选框选项*/
        public get options(): any {
            return this._control["options"];
        }

        public set options(value:any) {
            this._control["options"] = value;
        }

        /*单选框数据*/
        public get data(): any {
            return this._control["data"];
        }

        public set data(value: any) {
            this._control["data"] = value;
        }

        /*value值*/
        public get dataValueField(): any {
            return this._control["dataValueField"];
        }

        public set dataValueField(value: any) {
            this._control["dataValueField"] = value;
        }

        /*text值*/
        public get dataTextField(): any {
            return this._control["dataTextField"];
        }

        public set dataTextField(value: any) {
            this._control["dataTextField"] = value;
        }

        /*初始化组件*/
        public init() {
            Vue.component("ap-radiobutton", {
                template: '<div class="allpass-rb-outer">' +
                '<label v-for="(value,index) in options" class="formLabel"  v-on:click="rdclick(value.value)"><i :class="radioclass(index)"></i>{{value.text}}</label>' +
                '</div>',
                data(){
                    return {
                        value: "",
                        options: [],
                        data: [],
                        dataValueField: "",
                        dataTextField: ""
                    }
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
                            var obj: IOptions = {};
                            obj.value = value[self.dataValueField];
                            obj.text = value[self.dataTextField];
                            self.options.push(obj);
                        })
                    }
                },
                methods: {
                    radioclass: function (index) {
                        if (this.value) {
                            return this.value == this.options[index].value ? "u-radio icon-radio icon-radiosel" : "u-radio icon-radio";
                        } else {
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
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            })
        }
    } 
}