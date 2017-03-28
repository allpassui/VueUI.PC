/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: header组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.com {
    //页面头部
    export class header extends ap.core.ui {

        constructor(id: any) {
            super(id);
            this.init();           
        }

        //标题
        public get title(): any {
            return this._control["title"];
        }

        public set title(value: any) {
            this._control["title"] = value;
        }

        //用户名称
        public get username(): any {
            return this._control["username"];
        }

        public set username(value: any) {
            this._control["username"] = value;
        }

        //头像地址
        public get imgurl(): any {
            return this._control["imgurl"];
        }

        public set imgurl(value: any) {
            this._control["imgurl"] = value;
        }

        //头部菜单项
        public get spans(): any {
            return this._control["spans"];
        }

        public set spans(value: any) {
            this._control["spans"] = value;
        }

        //消息数量
        public get infonum(): any {
            return this._control["infonum"];
        }

        public set infonum(value: any) {
            this._control["infonum"] = value;
        }

        public init() {
            Vue.component("ap-header", {
                template: Base64.decode(sessionStorage["ap-header"]),
                data: function () {
                    return {
                        roledown: false,
                        title: "奥派通用模块建设软件",
                        username: "管理员",
                        imgurl: "../../Img/Common/head.jpg",
                        infonum: "4",
                        student:false,
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
                    }
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
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            })
        } 
    }
}