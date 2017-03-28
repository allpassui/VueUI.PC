/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      hjw
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       模板库
**-----------------------------------------------------------------
******************************************************************/
declare var axios: any;
declare var Base64: any;

namespace ap.utility.template {

    export class handletemplate {

        private _components = ["ap-header", "ap-menu", "ap-toolbar", "ap-table", "ap-pager", "ap-datepicker"];
        
        constructor() {
            
        }

        public SetTemplateToSession(name, path) {
            axios.get(path).then(function (response) {
                var data = Base64.encode(response.data);
                sessionStorage.setItem(name, data);
            })
        }

        public GetTemplateFromSession(name) {
            return sessionStorage.getItem(name);
        }

        public SaveTemplate(callback?:any) {
            var self = this;
            var flag = true;
            this._components.forEach(function (value, index, arr) {
                if (!sessionStorage.getItem(value)) {
                    flag = false;
                }
            })
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
                    })
                    callback();
                })
            } else {
                callback();
            }
        }
    }

}