var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年2月22日09:42:31
** 描 述: button新组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var buttons = (function (_super) {
                __extends(buttons, _super);
                /*构造函数*/
                function buttons(id) {
                    _super.call(this, id);
                    this.init();
                }
                /*初始化组件*/
                buttons.prototype.init = function () {
                    Vue.component("ap-buttons", {
                        created: function () {
                            this.storedtext = this.text;
                            var classarr = this.type.split(" ");
                            if (classarr.indexOf("btn") > -1) {
                                this.$options.template = new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/button/views/button_template.html");
                            }
                            else if (classarr.indexOf("icon") > -1) {
                                this.$options.template = new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/button/views/icon_template.html");
                            }
                            if (classarr[1]) {
                                var type = classarr[1].split("-")[1];
                                if (type == "save") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-save";
                                }
                                else if (type == "confirm") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-confirm";
                                }
                                else if (type == "back") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-back";
                                }
                                else if (type == "search") {
                                    this.classname = "u-button btn-search";
                                    this.iconclass = "icon-search";
                                }
                                else if (type == "cancel") {
                                    this.classname = "u-button btn-default";
                                    this.iconclass = "icon-cancel";
                                }
                                else if (type == "add") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-add";
                                }
                                else if (type == "delete") {
                                    this.classname = "u-button btn-default";
                                    this.iconclass = "icon-delete";
                                }
                                else if (type == "import") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-import";
                                }
                                else if (type == "export") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-export";
                                }
                                else if (type == "download") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-download";
                                }
                                else if (type == "upload") {
                                    this.classname = "u-button btn-primary";
                                    this.iconclass = "icon-upload";
                                }
                            }
                            if (classarr[2]) {
                                //this.classname+=" btn-small"
                                this.classname += classarr[2];
                            }
                        },
                        data: function () {
                            return {
                                storedtext: "",
                                classname: "",
                                iconclass: ""
                            };
                        },
                        props: {
                            type: {
                                type: String,
                                default: "btn"
                            },
                            style: {
                                type: Object
                            },
                            text: {
                                type: String,
                                default: ""
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return buttons;
            })(ap.core.ui);
            widget.buttons = buttons;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
