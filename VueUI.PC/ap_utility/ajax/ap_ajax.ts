/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      yqj
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       ajax请求封装库
**-----------------------------------------------------------------
******************************************************************/
namespace ap.utility.ajax {
    export interface IAjax {
        url: string;
        //GET/POST默认为GET
        type: string;
        //debug，默认为false
        debug: boolean;
        data: any;
        //true异步 false同步 默认为异步
        async: boolean;
        timeOut: number;//超时时间
        contentType: string;
        onSuccess(responseText: any, readyState: any): any;
        onError(responseText: any, readyState: any): any;
        //json html,默认json,jsonp--跨域
        dataType: string;
        load();
        responseText: any;
    }

    export class ajax implements IAjax {

        public url: string;
        public type: string = "GET";
        public debug: boolean = false;
        public data: any;
        public async: boolean = true;
        private sendString: string;
        public dataType: string = "json";
        public timeOut: number = 3000; //默认3秒钟


        private _responseText: any;
        public get responseText() {
            return this._responseText;
        }
        public set responseText(responseText: any) {
            this._responseText = responseText;
        }

        public contentType: string = "text/json";
        private _xhr: XMLHttpRequest;
        private _data: FormData = null;
        private _aborted: boolean = false;

        private timeout_flag: any;  //跨域请求时的超时标识
        private scriptTag: any; //跨域请求创建的scriptTag
        private jsonpCallBack: any; //跨域请求的回调函数


        private static jsonp: string = "jsonp";


        //请求回调响应事件
        private onResponse() {

            if (this._xhr.status == 200) {
                this.onSuccess(this.toObjectOrString(this._xhr.responseText), this._xhr.readyState);
            } else {
                if (!this.onError) {
                    this.onError(this.toObjectOrString(this._xhr.responseText), this._xhr.readyState);
                }
            }
        }

        //成功后方法
        public onSuccess(responseText: any, readyState: any) {
            this.responseText = responseText;
        }

        //失败后方法
        public onError(responseText: any, readyState: any) {
            this.responseText = responseText;
        }


        private toObjectOrString(responseText: any): any {
            if (responseText) {
                try {
                    return JSON.parse(responseText);
                }
                catch (e) {
                }
            }

            return responseText; //非json，返回原生字符串
        }


        //是否已暂停
        public isAborted(): boolean {
            if (this.dataType.toLocaleLowerCase() === ajax.jsonp) {
                return this._aborted;
            } else {
                return this._aborted && this._xhr.readyState == 4;
            }
        }

        //暂停操作
        public abort() {

            if (this.dataType.toLocaleLowerCase() === ajax.jsonp) {

                clearTimeout(this.timeout_flag);
                document.body.removeChild(this.scriptTag);
                delete window[this.jsonpCallBack];
                this.onError(null, null);
                this._aborted = true;

            } else {
                if (this._xhr.readyState != 4) {
                    this._xhr.abort();
                    this._aborted = true;
                }
            }


        }


        //发送请求
        public load() {

            if (!this.url) {
                if (this.debug == true) {
                    console.log("使用ajax未传url参数");
                }
            }

            if (this.dataType.toLocaleLowerCase() === ajax.jsonp) {
                this.createJsonp();
            } else {
                this.sendWithXHR();
            }
        }

        //获取域名，用于简单判断是否跨域
        private getHost(url= null): string {
            var host = "null";
            var port = "null";
            if (typeof url == "undefined"
                || null == url)
                url = window.location.href;
            var regex = /.*\:\/\/([^\/|:]*).*/;
            var match = url.match(regex);
            if (typeof match != "undefined"
                && null != match) {
                host = match[1];
                port = match[2];
            }
            if (typeof host != "undefined"
                && null != host) {
                var strAry = host.split(".");
                if (strAry.length > 1) {
                    host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1];
                }
            }
            return host;
        }


        //正常请求
        public sendWithXHR() {

            this._xhr = new XMLHttpRequest();

            this._xhr.onreadystatechange = ((obj) => {
                return () => {
                    obj.ReadyStateChange(this._xhr)
                                 };
            })(this);

            //this.type = this._data ? 'POST' : 'GET'; //如果有表单数据，自动切换到post

            this.dataParams();

            this._xhr.open(this.type, this.url, this.async);
            this._xhr.onload = function () { this.onResponse(); }.bind(this);
            this._xhr.onerror = function () { this.onResponse(); }.bind(this);

            //if (this.contentType) this._xhr.setRequestHeader('Content-type', this.contentType);
            if (this.type.toLowerCase() == 'post') {
                this._xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }

            this._xhr.send(this.data ? JSON.stringify(this.data) : null);

            if (this.type.toLowerCase() == "get") {
                if (this.debug == true) {
                    console.log("GET fired at:" + this.url + "?" + this.sendString);
                }
            }

            if (this.type.toLowerCase() == "post") {
                if (this.debug == true) {
                    console.log("POST fired at:" + this.url + " || Data:" + this.sendString);
                }
            }

        }

        //onreadystatechange
        private ReadyStateChange(xmlhttp: any) {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var text = xmlhttp.responseText;
                if (this.dataType.toLowerCase() == "json") {

                }

                else if (this.dataType.toLowerCase() == "html") {

                }

                //该事件放到load方法中
                //this.onSuccess(xmlhttp.responseText, xmlhttp.readyState);

                if (this.debug == true) {
                    console.log("SuccessResponse");
                    console.log("Response Data:" + xmlhttp.responseText);
                }
            }
            else {
                if (this.debug == true) {
                    console.log("FailureResponse --> State:" + xmlhttp.readyState + "Status:" + xmlhttp.status);
                }
            }
        }

        //data参数处理--该方法暂时废弃
        private dataParams() {
            var sendData = this.data,
                _sendString = [];

            var postData = sendData;

            //get请求，拼接成url
            //post, 序列化成json

            if (typeof sendData === "string") {
                var tmpArr = String.prototype.split.call(sendData, '&');

                for (var i = 0, j = tmpArr.length; i < j; i++) {
                    var datum = tmpArr[i].split('=');
                    _sendString.push(encodeURIComponent(datum[0]) + "=" + encodeURIComponent(datum[1]));
                }
            }
            else if (typeof sendData === 'object' && !(sendData instanceof String || (FormData && sendData instanceof FormData))) {
                for (var k in sendData) {
                    var datum = sendData[k];

                    if (Object.prototype.toString.call(datum) == "[object Array]") {
                        for (var i = 0, j = datum.length; i < j; i++) {
                            _sendString.push(encodeURIComponent(k) + "[]=" + encodeURIComponent(datum[i]));
                        }
                    } else {
                        _sendString.push(encodeURIComponent(k) + "=" + encodeURIComponent(datum));
                    }

                    if (typeof datum === 'object') {
                        postData[k] = JSON.stringify(datum);
                    }
                }

            }

            this.sendString = _sendString.join('&');

            if (this.type == 'GET' && this.data) {
                this.url += (this.url.indexOf('?') == -1 ? '?' : '&') + this.sendString;
                this.data = null;
            } else {
                this.data = postData;
            }

            //加时间戳，防止缓存
            if (this.url.indexOf("?") > -1) {
                this.url += "&" + Math.random();
            } else {
                this.url += "?" + Math.random();
            }

        }


        //跨域加载Json数据
        public loadJsonp(url: string= null): string {
            this.async = false;
            this.type = "GET";
            if (url) this.url = url;
            this.load();
            return "";
        }

        // JSONP
        //该跨域请求，只能处理get请求，对于post,建议采用websocket
        //对于服务器设置了Access-Control-Allow-Origin的情况下，不需要通过jsonp访问
        private createJsonp() {

            this.scriptTag = document.createElement("script");
            var timeName = new Date().getTime() + Math.round(Math.random() * 1000);
            this.jsonpCallBack = "JSONP_" + timeName;

            window[this.jsonpCallBack] = this.jsonpCallback.bind(this);

            this.scriptTag.src = this.url + (this.url.indexOf("?") > -1 ? "" : "?") + "callback=" + this.jsonpCallBack;
            this.scriptTag.type = "text/javascript";
            this.scriptTag.async = true; //html5
            document.body.appendChild(this.scriptTag);
            this.setTime(this.jsonpCallBack, this.scriptTag);

        }

        //跨域调用回调函数
        private jsonpCallback(data: any) {
            clearTimeout(this.timeout_flag);
            document.body.removeChild(this.scriptTag);
            this.onSuccess(data, null);

        }

        //设置请求超时
        private setTime(callback, script) {

            this.timeout_flag = setTimeout(function () {
                if (this.dataType.toLocaleLowerCase() === ajax.jsonp) {
                    //delete window[this.jsonpCallBack];
                    document.body.removeChild(script);
                    //处理异常
                    //this.onError("调用jsonp超时", null);
                }

                console.log("timeout");

            }.bind(this), this.timeOut);

        }


        //同步加载静态资源 html,json
        public loadData(): any {
            this.async = false; //同步加载
            this.load();
            return this.responseText;
        }


    }
}

