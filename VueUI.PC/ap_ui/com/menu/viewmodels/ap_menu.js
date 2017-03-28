var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: menu组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var com;
        (function (com) {
            //菜单组件
            var menu = (function (_super) {
                __extends(menu, _super);
                function menu(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(menu.prototype, "options", {
                    //菜单选项
                    get: function () {
                        return this._control["options"];
                    },
                    set: function (value) {
                        this._control["options"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(menu.prototype, "title", {
                    //菜单标题
                    get: function () {
                        return this._control["title"];
                    },
                    set: function (value) {
                        this._control["title"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(menu.prototype, "defaultOption", {
                    //默认选中
                    get: function () {
                        return this._control["defaultoption"];
                    },
                    set: function (value) {
                        this._control["defaultoption"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                menu.prototype.init = function () {
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
                                defaultoption: 0
                            };
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
                                    el.parentElement.insertBefore(subnav, el.nextElementSibling);
                                }
                                else {
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
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return menu;
            })(ap.core.ui);
            com.menu = menu;
        })(com = ui.com || (ui.com = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
