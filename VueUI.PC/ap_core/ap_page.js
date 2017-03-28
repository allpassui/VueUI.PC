/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 页面基类
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var core;
    (function (core) {
        var page = (function () {
            function page(businessName, methods) {
                var _this = this;
                //worker相对路径
                this._businessName = "";
                //session存储组件名称
                this._components = ["ap-header", "ap-menu", "ap-toolbar", "ap-table", "ap-pager", "ap-datepicker"];
                var self = this;
                this._businessName = businessName;
                this._methods = methods;
                document.addEventListener("readystatechange", function (ev) { _this.initControl(_this); }, false);
                document.addEventListener("DOMContentLoaded", function (ev) { _this.initData(_this); }, false);
                //sessionstrorage丢失直接跳转到登录页
                window.addEventListener("storage", function (e) {
                    if (self._components.indexOf(e.key) > 0)
                        window.location.href = "../../ap_module_login/views/login.html";
                });
            }
            /*初始化组件*/
            page.prototype.initControl = function (current) {
                var self = this;
                if (document.readyState == "interactive") {
                    current.initAtInteractive();
                    this._container = new Vue({
                        el: "form",
                        data: {
                            context: self
                        }
                    });
                }
                else if (document.readyState == "complete") {
                    current.initAtComplete();
                }
            };
            /*向bll层发送数据*/
            page.prototype.postMessage = function (msg) {
                this._worker.postMessage(msg);
            };
            /*初始化数据*/
            page.prototype.initData = function (current) {
                //var ref = current;
                if (current._businessName) {
                    this._worker = new Worker(current._businessName);
                    this.action(this._methods);
                    this._worker.onmessage = function (evt) {
                        current.renderDataAsync(evt);
                    };
                }
                current.renderData();
            };
            /*提供的向bll层传递数据的扩展方法*/
            page.prototype.action = function (methods) {
                if (!methods)
                    return;
                var self = this;
                var arr = methods.split("/");
                if (arr.length > 0) {
                    if (this[arr[1]]) {
                        this[arr[1]](arr[2]);
                    }
                    else {
                        var worker = {};
                        worker.fn = arr[1];
                        //处理传的参数
                        if (self[arr[2]]) {
                            var temp = {};
                            for (var key in self[arr[2]]) {
                                var value = self[arr[2]][key];
                                if (typeof value == "object") {
                                    if (value.isVue) {
                                        temp[key] = self.getValue(value.refid, value.key);
                                    }
                                    else {
                                        temp[key] = JSON.stringify(value);
                                    }
                                }
                                else {
                                    temp[key] = value;
                                }
                            }
                            worker.args = temp;
                        }
                        else {
                            worker.args = arr[2];
                        }
                        worker.callback = "on_" + arr[1];
                        this._worker.postMessage(worker);
                    }
                }
            };
            /*获取Vue对象的参数的值*/
            page.prototype.getValue = function (refid, key) {
                return ap.core.ui.CONTROLS[refid]._control[key];
            };
            /*设置Vue对象中的值*/
            page.prototype.setValue = function (vue, key, value) {
                //vue.$emit("setValue", key, value, this._container);
            };
            /*设置Vue对象里的方法*/
            page.prototype.setMethods = function (refid, key, callback) {
                this._container.$children.filter(function (x) { return x.$el.id == refid; })[0][key] = callback;
            };
            return page;
        })();
        core.page = page;
    })(core = ap.core || (ap.core = {}));
})(ap || (ap = {}));
