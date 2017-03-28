/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: Worker基类
**-----------------------------------------------------------------
******************************************************************/
namespace ap.core {

   /*Worker接口*/
    export interface IWorker {
        fn?: any,
        args?: any,
        callback?:any,
        data?:any
    }

    export abstract class worker {
        private worker = [];
        private baseurl = "";
        private publickey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDA3FaQ9z9qzx49amgv46sH2q6VUM1yzqXC1BBFnpl/6ebKIcaqUMYBseNrryKmcvurpM8ALD/As+GxJNk+LY43jv5tJY+EBCPkQUr0MxAV8YVH/zoQlGhAYfIgriaI/JoI0v8QnlAobRol6i0Hw56PWdKgrK10WExXUw4UEMAP5wIDAQAB";
        private defaultScripts =
        ["../../ap_scripts/basic/axios.js",
            "../../ap_scripts/basic/es6-promise.auto.js"];
        //arr是自定义导入的js，pathlevel是目录层级，0指的是和ap_scripts同层级，pathlevel递增表示目录层级不断递增
        constructor(arr?: any, pathlevel?: any) {
            this.defaultScripts.forEach(function (value, index, array) {
                if (typeof pathlevel == "number" && pathlevel >= 0) {
                    var str = "";
                    for (var i = 0; i < pathlevel; i++) {
                        str += "../";
                    }
                    value = str + value.slice(6, value.length);
                }
                importScripts(value);
            })
            if (arr instanceof Array) {
                arr.forEach(function (value, index, array) {
                    importScripts(value);
                })
            }

            //初始化axios配置
            this.initaxios();

            //接收post数据
            this.onMessage();
        }

        /*webworker接收数据*/
        private onMessage() {
            var self = this;
            onmessage = function (evt) {
                if (!evt.data)
                    return;
                var tworker: IWorker = evt.data;
                if ((tworker.args) && (typeof tworker.args == "string")) {
                    try {
                        var obj = JSON.parse(tworker.args);
                        tworker.args = obj;
                    }
                    catch (e) {
                    }
                }
                self.worker.push(evt.data);

                if (tworker.fn)
                {
                    self.handleData(tworker.fn, tworker.args, function (res) {
                        tworker.data = res;
                        postMessage(tworker);
                    });
                }

            }
        }

        /*处理数据*/
        public handleData(fn: any, args: any, callback: any) {
            this[fn](args, callback);
        }

        /*初始化axios配置*/
        public initaxios() {
            //if (axios.defaults.baseURL)
            //    return;
            //var self = this;
            //return axios.get("../../ap_scripts/config/acbb_basicconfig.acg").then(function (response) {
            //    axios.defaults.baseURL = "http://" + response.data.wcf_IP + "/ACBB.BusinessService/";//response.data.wcf_Name;
            //    axios.defaults.headers.post['Content-Type'] = 'application/json';
            //    self.baseurl = "http://" + response.data.file_IP + response.data.web_Name;
            //}).catch(function (error) {
            //    console.log(error);
            //});
        }

        /*初始化service url*/
        public initService(name: any, callback: any) {
            var self = this;
            axios.defaults.baseURL = "http://" + "192.168.0.85" + "/ACBB.Service/";
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            self.baseurl = "http://" + "192.168.0.85" + "/ACBB.Web2.0/";
            //if (!this.baseurl) {
                //this.initaxios().then(function () {
                    axios.get(self.baseurl + "/ap_scripts/config/acbb_wcf.acg").then(function (response) {
                        var url = response.data['' + name + ''];
                        callback(url);
                    }).catch(function (error) {
                        console.log(error);
                    });
                //});
            //} else {
            //    axios.get(self.baseurl + "/ap_scripts/config/acbb_wcf.acg").then(function (response) {
            //        var url = response.data['' + name + ''];
            //        callback(url);
            //    }).catch(function (error) {
            //        console.log(error);
            //    });
            //}

        }

        //编码
        public encrypt(str: any) {
            //var encrypt = new JSEncrypt();
            //encrypt.setPublicKey(this.publickey);
            //var encrypted = encrypt.encrypt(str);
            //return encrypted;
        }
    }
}