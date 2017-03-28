/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 侧边工具栏
**-----------------------------------------------------------------
******************************************************************/

namespace ap.ui.com {

    export class toolbar extends ap.core.ui{

        constructor(id: any) {
            super(id);
            this.init();
        }

        public init() {
            Vue.component("ap-toolbar", {
                template: Base64.decode(sessionStorage["ap-toolbar"]),
                props: {
                    fn: Function
                },
                methods: {
                    buttonClick: function () {
                        if (typeof (this.fn) == "function") {
                            this.fn();
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