/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 表格组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {
    //表格
    export class table extends ap.core.ui{

        private static i = 0;
        constructor( id: string) {
            super(id);
            this.init();
        }

        //table列
        public get columns(): any {
            return this._control["columns"];
        }

        public set columns(value: any) {
            this._control["columns"] = value;
        }

        //checkbox样式
        public get checkbox(): any {
            return this._control["checkbox"];
        }

        public set checkbox(value: any) {
            this._control["checkbox"] = value;
        }

        //列表数据
        public get tabledata(): any {
            return this._control["tabledata"];
        }

        public set tabledata(value: any) {
            this._control["tabledata"] = value;
            table.i += 1;
        }

        //主键
        public get key(): any {
            return this._control["key"];
        }

        public set key(value: any) {
            this._control["key"] = value;
        }

        //置灰选项
        public get disabled(): any {
            return this._control["disabled"];
        }

        public set disabled(value: any) {
            this._control["disabled"] = value;
        }

        //checkbox点中以后的根据key获取的返回值
        public get values(): any {
            return this._control["values"];
        }

        public set values(value: any) {
            this._control["values"] = value;
        }

        //checkbox点中以后的index
        public get indexes(): any {
            return this._control["indexes"];
        }

        public set indexes(value: any) {
            this._control["indexes"] = value;
        }

        //checkbox点击
        public get checkboxClick(): any {
            return this._control["checkboxclick"]; 
        }

        public set checkboxClick(value: any) {
            this._control["checkboxclick"] = value;
        }

        //操作列点击
        public get operateClick(): any {
            return this._control["operateclick"];
        }

        public set operateClick(value: any) {
            this._control["operateclick"] = value;
        } 

        //全选按钮显示
        public get showAllSelected(): any {
            return this._control["showallselected"];
        }

        public set showAllSelected(value: any) {
            this._control["showallselected"] = value;
        }

        public init(): any {
            Vue.component("ap-table", {
                template: new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/table/views/table_template.html"),
                data: function () {
                    return {
                        init: true,
                        columns: [],
                        checkbox: {},
                        tabledata: [],
                        checked: [],
                        allchecked: false,
                        key: "",
                        values: [],
                        indexes: [],
                        disabled: [],
                        showallselected: true
                    }
                },
                updated: function () {
                    //用计数器来区分开始的没有数据和表格后面的没有数据
                    if (table.i > 0) {
                        this.init = false;
                    }
                },
                watch: {
                    tabledata: function () {
                        var self = this;
                        self.checked = [];
                        self.values = [];
                        if (!self.init) {
                            self.indexes = [];
                        }
                        this.tabledata.forEach(function (val, index, arr) {  
                            if (self.indexes.indexOf(index) > -1) {
                                self.checked.push({ "checked": true });
                                self.values.push(self.tabledata[index][self.key]);
                            } else {
                                self.checked.push({ "checked": false });
                            }                                
                        })
                        self.allchecked = false;

                        if (self.disabled.length <= 0) {
                            this.tabledata.forEach(function (val, index, arr) {
                                self.disabled.push({ "disabled": false });
                            })
                        }
                    }
                },
                methods: {
                    operateclick: function (index, event) {
                        alert(index + ":::" + event);
                    },
                    checkboxclick: function (index, value, event) {
                        //如果置灰就返回
                        if (this.disabled[index] && this.disabled[index].disabled)
                            return;
                        var self = this;
                        var count = 0;
                        var abledcount = 0;
                        self.values = [];
                        self.indexes = [];
                        this.checked[index].checked = !this.checked[index].checked;
                        this.checked.forEach(function (val, index, arr) {
                            if (!val.checked) {
                                self.allchecked = false;
                            } else {
                                count++;
                                self.values.push(self.tabledata[index][self.key]);
                                self.indexes.push(index);
                            }                            
                        })
                        console.log(this.values);
                        this.disabled.forEach(function (val,index,arr) {
                            if (!self.disabled[index].disabled)
                                abledcount++;
                        })

                        //全选判断
                        if (count == abledcount) {
                            this.allchecked = true;
                        }
                    },
                    selectallclick: function (event) {
                        var self = this;
                        this.values = [];
                        this.indexes = [];
                        if (this.allchecked) {
                            this.checked.forEach(function (val, index, arr) {
                                if (!self.disabled[index].disabled) {
                                    self.checked[index].checked = false;
                                }                                                         
                            })
                            this.allchecked = false;
                        } else {
                            this.checked.forEach(function (val, index, arr) {
                                if (!self.disabled[index].disabled) {
                                    self.checked[index].checked = true;
                                    self.values.push(self.tabledata[index][self.key]);
                                    self.indexes.push(index);
                                }
                            })
                            this.allchecked = true;
                        }
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