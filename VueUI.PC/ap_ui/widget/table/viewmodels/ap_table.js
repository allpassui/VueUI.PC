var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 表格组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            //表格
            var table = (function (_super) {
                __extends(table, _super);
                function table(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(table.prototype, "columns", {
                    //table列
                    get: function () {
                        return this._control["columns"];
                    },
                    set: function (value) {
                        this._control["columns"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "checkbox", {
                    //checkbox样式
                    get: function () {
                        return this._control["checkbox"];
                    },
                    set: function (value) {
                        this._control["checkbox"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "tabledata", {
                    //列表数据
                    get: function () {
                        return this._control["tabledata"];
                    },
                    set: function (value) {
                        this._control["tabledata"] = value;
                        table.i += 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "key", {
                    //主键
                    get: function () {
                        return this._control["key"];
                    },
                    set: function (value) {
                        this._control["key"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "disabled", {
                    //置灰选项
                    get: function () {
                        return this._control["disabled"];
                    },
                    set: function (value) {
                        this._control["disabled"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "values", {
                    //checkbox点中以后的根据key获取的返回值
                    get: function () {
                        return this._control["values"];
                    },
                    set: function (value) {
                        this._control["values"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "indexes", {
                    //checkbox点中以后的index
                    get: function () {
                        return this._control["indexes"];
                    },
                    set: function (value) {
                        this._control["indexes"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "checkboxClick", {
                    //checkbox点击
                    get: function () {
                        return this._control["checkboxclick"];
                    },
                    set: function (value) {
                        this._control["checkboxclick"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "operateClick", {
                    //操作列点击
                    get: function () {
                        return this._control["operateclick"];
                    },
                    set: function (value) {
                        this._control["operateclick"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(table.prototype, "showAllSelected", {
                    //全选按钮显示
                    get: function () {
                        return this._control["showallselected"];
                    },
                    set: function (value) {
                        this._control["showallselected"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                table.prototype.init = function () {
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
                            };
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
                                    }
                                    else {
                                        self.checked.push({ "checked": false });
                                    }
                                });
                                self.allchecked = false;
                                if (self.disabled.length <= 0) {
                                    this.tabledata.forEach(function (val, index, arr) {
                                        self.disabled.push({ "disabled": false });
                                    });
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
                                    }
                                    else {
                                        count++;
                                        self.values.push(self.tabledata[index][self.key]);
                                        self.indexes.push(index);
                                    }
                                });
                                console.log(this.values);
                                this.disabled.forEach(function (val, index, arr) {
                                    if (!self.disabled[index].disabled)
                                        abledcount++;
                                });
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
                                    });
                                    this.allchecked = false;
                                }
                                else {
                                    this.checked.forEach(function (val, index, arr) {
                                        if (!self.disabled[index].disabled) {
                                            self.checked[index].checked = true;
                                            self.values.push(self.tabledata[index][self.key]);
                                            self.indexes.push(index);
                                        }
                                    });
                                    this.allchecked = true;
                                }
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                table.i = 0;
                return table;
            })(ap.core.ui);
            widget.table = table;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
