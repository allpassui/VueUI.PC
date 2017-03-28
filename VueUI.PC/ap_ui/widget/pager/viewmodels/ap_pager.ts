/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: pager组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class pager extends ap.core.ui {

        constructor(id: any) {
            super(id);
            this.init();
        }

        //页数
        public get pageCount(): any {
            return this._control["pagecount"];
        }

        public set pageCount(value: any) {
            this._control["pagecount"] = value;
        }

        //目前页面
        public get currentPage(): any {
            return this._control["currentpage"];
        }

        public set currentPage(value: any) {
            this._control["currentpage"] = value;
        }

        //回调
        public get callback(): any {
            return this._control["callback"];
        }

        public set callback(value: any) {
            this._control["callback"] = value;
        }

        public init() {
            Vue.component("ap-pager", {
                created: function () {
                    this.$options.template = new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/pager/views/pager_template.html");
                    //if (sessionStorage["ap-pager"]) {
                    //    this.$options.template = sessionStorage["ap-pager"];
                    //} else {
                    //    this.$options.template = new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/pager/views/pager_template.html");
                    //}
                },
                data: function () {
                    return {
                        pages: [],
                        currentpage: 1,
                        pagecount: 1,
                        startindex: {
                            type: Number,
                            default: 1
                        },
                        endindex: {
                            type: Number,
                            default: 1
                        },
                        isPageEmpty: false,
                        pageinterval: 5
                    }
                },
                watch: {
                    pagecount: function () {
                        this.startindex = 1;
                        this.endindex = (this.startindex + this.pageinterval - 1) < this.pagecount ? (this.startindex + this.pageinterval - 1) : this.pagecount;
                        this.pages = [];
                        for (var i = this.startindex; i <= this.endindex; i++) {
                            this.pages.push(i);
                        }
                        //如果当前页数大于页码数量就调到最后一页，用于删除最后一页所有数据
                        if (this.currentpage > this.pagecount) {
                            this.currentpage = this.pagecount == 0 ? 1 : this.pagecount;
                        }
                    },
                    endindex: function () {
                        this.pages = [];
                        for (var i = this.startindex; i <= this.endindex; i++) {
                            this.pages.push(i);
                        }
                    },
                    currentpage: function () {
                        this.callback();
                    }
                },
                methods: {
                    prepage: function () {
                        if (this.currentpage <= 1)
                            return;
                        this.currentpage -= 1;
                        var index = Math.floor((this.currentpage - 1) / this.pageinterval);
                        if (this.currentpage < this.startindex) {
                            this.startindex = this.pageinterval * index + 1;
                            this.endindex = this.pageinterval * (index + 1);
                        }
                    },
                    nextpage: function () {
                        if (this.currentpage >= this.pagecount)
                            return;
                        this.currentpage += 1;
                        if (this.currentpage > this.endindex) {
                            this.startindex += this.pageinterval;
                            this.endindex += this.pageinterval;
                            this.endindex = this.pagecount > this.endindex ? this.endindex : this.pagecount;
                        }
                    },
                    preinterval: function () {
                        var index = Math.floor((this.currentpage - 1) / this.pageinterval);
                        index = index - 1 > 0 ? index - 1 : 0;
                        this.currentpage = index * this.pageinterval + 1;
                        this.startindex = this.currentpage;
                        this.endindex = (this.startindex + this.pageinterval) > this.pagecount ? this.pagecount : (this.startindex + this.pageinterval - 1);
                    },
                    nextinterval: function () {
                        var index = Math.floor((this.currentpage - 1) / this.pageinterval);
                        var totalindex = this.pagecount / this.pageinterval;
                        index = index + 1 < totalindex ? index + 1 : totalindex;
                        this.currentpage = index * this.pageinterval + 1;
                        this.startindex = this.currentpage;
                        this.endindex = (this.startindex + this.pageinterval) > this.pagecount ? this.pagecount : (this.startindex + this.pageinterval - 1);
                    },
                    gotopage: function (pageindex) {
                        this.currentpage = pageindex;
                    },
                    callback: function () {
                    }
                },
                mounted: function () {
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                }
            })
        }
    }
}