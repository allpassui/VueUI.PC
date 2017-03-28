var ap;
(function (ap) {
    var utility;
    (function (utility) {
        var ajax;
        (function (ajax_1) {
            var ajaxPackage = (function () {
                function ajaxPackage() {
                }
                ajaxPackage.prototype.ajax = function (url, type, data, cbSuccess, cbError) {
                    var ajax = new ap.utility.ajax.ajax();
                    //ajax.url = "http://localhost/DataService/WCF/Service.svc/UpdateClass";
                    ajax.async = false;
                    ajax.url = url;
                    ajax.type = type;
                    ajax.data = data;
                    ajax.onSuccess = cbSuccess;
                    if (cbError) {
                        ajax.onError = cbError;
                    }
                    else {
                        ajax.onError = function (data) { };
                    }
                    ajax.load();
                };
                ajaxPackage.prototype.ajaxasync = function (url, type, data, cbSuccess, cbError) {
                    var ajax = new ap.utility.ajax.ajax();
                    //ajax.url = "http://localhost/DataService/WCF/Service.svc/UpdateClass";
                    ajax.async = true;
                    ajax.url = url;
                    ajax.type = type;
                    ajax.data = data;
                    ajax.onSuccess = cbSuccess;
                    if (cbError) {
                        ajax.onError = cbError;
                    }
                    else {
                        ajax.onError = function (data) { };
                    }
                    ajax.load();
                };
                ajaxPackage.prototype.ajax_getcontent = function (url) {
                    var content = "";
                    var ajax = new ap.utility.ajax.ajax();
                    ajax.async = false;
                    ajax.url = url;
                    ajax.type = "GET";
                    ajax.onSuccess = function (data) {
                        content = data;
                    };
                    ajax.onError = function (data) {
                    };
                    ajax.load();
                    return content;
                };
                return ajaxPackage;
            })();
            ajax_1.ajaxPackage = ajaxPackage;
        })(ajax = utility.ajax || (utility.ajax = {}));
    })(utility = ap.utility || (ap.utility = {}));
})(ap || (ap = {}));
acbbAjaxPackage = new ap.utility.ajax.ajaxPackage();
