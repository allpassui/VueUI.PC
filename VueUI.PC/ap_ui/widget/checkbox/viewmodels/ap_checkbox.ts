/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: checkbox组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class checkbox extends ap.core.ui {

        /*构造函数*/
        constructor(id:any) {
            super(id);
            this.init();
        }

        /*复选框选中值*/
        public get value(): any {
            return this._control["value"];
        }

        public set value(value: any) {
            this._control["value"] = value;
        }

        /*复选框选项*/
        public get options(): any {
            return this._control["options"];
        }

        public set options(value: any) {
            this._control["options"] = value;
        }

        /*复选框数据*/
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

        /*disabled值*/
        public get disabled(): any {
            return this._control["disabled"];
        }

        public set disabled(value: any) {
            this._control["disabled"] = value;
        }

        /*初始化组件*/
        public init() {
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
                        disabled:[]
                    }
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
                    cbclass: function (val, index) {
                        if (this.value.indexOf(val) > -1) {
                            if (this.disabled[index]) {
                                return "u-checkbox icon-checkbox icon-checkboxsel dis";
                            } else {
                                return "u-checkbox icon-checkbox icon-checkboxsel";
                            }                       
                        }
                        else {
                            if (this.disabled[index]) {
                                return "u-checkbox icon-checkbox dis";
                            } else {
                                return "u-checkbox icon-checkbox";
                            }
                        }
                    },
                    iclick: function (val,index) {
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
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            });
        }
    }
}