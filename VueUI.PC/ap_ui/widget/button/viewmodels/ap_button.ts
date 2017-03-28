/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: button组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class button extends ap.core.ui {
        
        /*构造函数*/
        constructor(id: string) {
            super(id);
            this.init();
        }

        /*value值设置*/
        public get value(): any {
            return this._control["storedtext"];
        }

        public set value(value: any) {
            this._control["storedtext"] = value;
        }

        /*初始化组件*/
        public init(): any {
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
                data: function(){
                    return {
                        storedtext:""
                    }
                },
                methods: {
                },
                created() {
                    this.storedtext = this.text;
                    if (this.type == "a") {
                        this.$options.template = '<a :class="classname"  :style="style" ><slot></slot>{{storedtext}}</a>';
                    } else {
                        this.$options.template = '<button type="button" :class="classname"  :style="style" ><slot></slot>{{storedtext}}</button>';
                    }
                },
                mounted: function () {
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            })
        }
    }
    
}

