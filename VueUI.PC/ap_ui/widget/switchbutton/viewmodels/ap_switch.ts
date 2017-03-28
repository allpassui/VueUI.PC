/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 开关组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class switchbutton extends ap.core.ui{
        constructor(id: any) {
            super(id);
            this.init();
        }

        public get value(): any {
            return this._control["value"];
        }

        public set value(value: any) {
            this._control["value"] = value;
        }

        public get options(): any {
            return this._control["options"];
        }

        public set options(value: any) {
            this._control["options"] = value;
        }

        public init() {
            Vue.component("ap-switch", {
                template: '<div class="allpass-switch-outer">' +
                '<div v-for="(item,index) in options" v-on:click="divClick(index)"><input type="radio" class="allpass-switch allpass-switch-animbg" :checked="item.checked"/><label>{{item.value}}</label></div>' +
                '</div>',
                data(){
                    return {
                        value: "",
                        options:""
                    }
                },
                methods: {
                    divClick: function (index) {
                        this.options[index].checked = !(this.options[index].checked);
                    }
                },
                mounted: function () {
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            })
        }
    }

}