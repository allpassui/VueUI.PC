var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: header组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var com;
        (function (com) {
            //页面头部
            var header = (function (_super) {
                __extends(header, _super);
                function header(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(header.prototype, "title", {
                    //标题
                    get: function () {
                        return this._control["title"];
                    },
                    set: function (value) {
                        this._control["title"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(header.prototype, "username", {
                    //用户名称
                    get: function () {
                        return this._control["username"];
                    },
                    set: function (value) {
                        this._control["username"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(header.prototype, "imgurl", {
                    //头像地址
                    get: function () {
                        return this._control["imgurl"];
                    },
                    set: function (value) {
                        this._control["imgurl"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(header.prototype, "spans", {
                    //头部菜单项
                    get: function () {
                        return this._control["spans"];
                    },
                    set: function (value) {
                        this._control["spans"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(header.prototype, "infonum", {
                    //消息数量
                    get: function () {
                        return this._control["infonum"];
                    },
                    set: function (value) {
                        this._control["infonum"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                header.prototype.init = function () {
                    Vue.component("ap-header", {
                        template: Base64.decode(sessionStorage["ap-header"]),
                        data: function () {
                            return {
                                roledown: false,
                                title: "奥派通用模块建设软件",
                                username: "管理员",
                                imgurl: "../../Img/Common/head.jpg",
                                infonum: "4",
                                student: false,
                                spans: [
                                    {
                                        "title": "任务"
                                    },
                                    {
                                        "title": "实验"
                                    },
                                    {
                                        "title": "学习管理"
                                    }
                                ]
                            };
                        },
                        methods: {
                            spanClick: function () {
                            },
                            logoutClick: function () {
                                //ap.scripts.common.loginentity.instance.clearLoginEntity();
                                window.location.href = "../../ap_module_login/views/login.html";
                                /* new ap.scripts.common.acbbcommon().GetPath("/ap_com_login/Login.html");*/
                            },
                            mouseover: function () {
                                this.roledown = true;
                            },
                            mouseout: function () {
                                this.roledown = false;
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return header;
            })(ap.core.ui);
            com.header = header;
        })(com = ui.com || (ui.com = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
