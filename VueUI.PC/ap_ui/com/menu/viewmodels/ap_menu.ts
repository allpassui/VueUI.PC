/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: menu组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.com {
    //菜单组件
    export class menu extends ap.core.ui{      

        constructor(id:any) {
            super(id);
            this.init();
        }

        //菜单选项
        public get options(): any {
            return this._control["options"];
        }

        public set options(value: any) {
            this._control["options"] = value;
        }

        //菜单标题
        public get title(): any {
            return this._control["title"];
        }

        public set title(value: any) {
            this._control["title"] = value;
        }

        //默认选中
        public get defaultOption(): any {
            return this._control["defaultoption"];
        }

        public set defaultOption(value: any) {
            this._control["defaultoption"] = value;
        }

        public init() {
            Vue.component("ap-menu", {
                template: Base64.decode(sessionStorage["ap-menu"]),
                data: function () {
                    return {
                        value: "",
                        showsubnav: false,
                        menuindex: 0,
                        itemindex: 0,
                        options: [],
                        title: "管理员管理",
                        defaultoption:0
                    }
                },
                computed: {
                    childlist: {
                        get: function () {
                            //根据点击的主菜单绑定子菜单的数据
                            var self = this;
                            var list = this.options.filter(function (item) {
                                return item.text == self.value;
                            });
                            if (list.length > 0) {
                                return list[0].childoptions;
                            }
                        },
                        set: function () { }
                    }
                },
                methods: {
                    menuClick: function (index, text, event) {
                        this.value = text;
                        this.menuindex = index;
                        var el = event.currentTarget;
                        if (el.parentElement.querySelector("li.cur")) {
                            el.parentElement.querySelector("li.cur").classList.remove("cur");
                        }
                        el.classList.add("cur");
                        //$(el).addClass("cur").siblings().removeClass("cur");
                        var subnav = document.querySelector(".m-subnav");
                        if (this.options[index].childoptions) {
                            this.showsubnav = true;
                            el.parentElement.insertBefore(subnav,el.nextElementSibling);
                        } else {
                            window.location.href = this.options[index].href;
                        }
                    },
                    itemClick: function (index, event) {
                        var el = event.currentTarget;
                        //$(el).addClass("cur").siblings().removeClass("cur");
                        if (el.parentElement.querySelector("li.cur")) {
                            el.parentElement.querySelector("li.cur").classList.remove("cur");
                        }
                        el.classList.add("cur");
                        window.location.href = this.options[this.menuindex].childoptions[index].href;
                    }
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