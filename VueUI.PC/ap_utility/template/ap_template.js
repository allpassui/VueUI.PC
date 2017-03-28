var ap;
(function (ap) {
    var utility;
    (function (utility) {
        var template;
        (function (template) {
            var handletemplate = (function () {
                function handletemplate() {
                    this._components = ["ap-header", "ap-menu", "ap-toolbar", "ap-table", "ap-pager", "ap-datepicker"];
                }
                handletemplate.prototype.SetTemplateToSession = function (name, path) {
                    axios.get(path).then(function (response) {
                        var data = Base64.encode(response.data);
                        sessionStorage.setItem(name, data);
                    });
                };
                handletemplate.prototype.GetTemplateFromSession = function (name) {
                    return sessionStorage.getItem(name);
                };
                handletemplate.prototype.SaveTemplate = function (callback) {
                    var self = this;
                    var flag = true;
                    this._components.forEach(function (value, index, arr) {
                        if (!sessionStorage.getItem(value)) {
                            flag = false;
                        }
                    });
                    if (!flag) {
                        axios.all([axios.get("../../ap_ui/com/header/views/header_template.html"),
                            axios.get("../../ap_ui/com/menu/views/menu_template.html"),
                            axios.get("../../ap_ui/com/toolbar/views/toolbar_template.html"),
                            axios.get("../../ap_ui/widget/table/views/table_template.html"),
                            axios.get("../../ap_ui/widget/pager/views/pager_template.html"),
                            axios.get("../../ap_ui/widget/datepicker/views/template.html")
                        ]).then(function (response) {
                            response.forEach(function (value, index, arr) {
                                sessionStorage.setItem(self._components[index], Base64.encode(value.data));
                            });
                            callback();
                        });
                    }
                    else {
                        callback();
                    }
                };
                return handletemplate;
            })();
            template.handletemplate = handletemplate;
        })(template = utility.template || (utility.template = {}));
    })(utility = ap.utility || (ap.utility = {}));
})(ap || (ap = {}));
