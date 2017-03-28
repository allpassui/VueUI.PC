declare var acbbAjaxPackage: any;

namespace ap.utility.ajax {
    export class ajaxPackage {
        public ajax(url, type, data, cbSuccess, cbError) {
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
                ajax.onError = function (data) { }
            }
            ajax.load();
        }

        public ajaxasync(url, type, data, cbSuccess, cbError) {
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
            else
            {
                ajax.onError = function (data) {}
            }
            ajax.load();
        }

        public ajax_getcontent(url)
        {
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
        }
    }
}

acbbAjaxPackage = new ap.utility.ajax.ajaxPackage();