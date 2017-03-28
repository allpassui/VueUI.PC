/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      yqj
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       浏览器-视频播放库
**-----------------------------------------------------------------
******************************************************************/

/// <reference path="../../d_ts/lodash-2.4.1.d.ts" />
/// <reference path="../ajax/ap_ajax.ts" />
/// <reference path="../../d_ts/vue.0.10.5.d.ts" />

namespace ap.utility.video {

    //上传接口
    export interface IVideo {
        debug: boolean; //debug模式将输出上传日志
        id: string;
        width: string; //父容器的宽
        height: string; //父容器的高
        ext: string; //文件扩展名
        isFlv: boolean; //是否flv视频
        videoPicture: string;  //首秒截图
        mp4Url: string; //mp4地址
        flvUrl: string; //flv地址
        webmUrl: string;
        ogvUrl: string;
        Bind(id: string): void; //绑定操作
        OnSuccess(data: any): void;
        Template: string;      //模板
        getVideoInfoUrl: string;
        playVideoUrl: string;
    }


    export class video {

        constructor() {
        }

        //在debug模式下 将输出日志
        private _debug: boolean = false;

        public get debug() {
            return this._debug;
        }

        public set debug(debug: boolean) {
            this._debug = debug;
        }

        private _isFlv: boolean = false;

        public get isFlv() {
            return this._isFlv;
        }

        public set isFlv(isFlv: boolean) {
            this._isFlv = isFlv;
        }


        private _ext: string;

        public get ext() {
            return this._ext;
        }

        public set ext(ext: string) {
            this._ext = ext;
        }


        private _getVideoInfoUrl: string;

        public get getVideoInfoUrl() {
            return this._getVideoInfoUrl;
        }

        public set getVideoInfoUrl(getVideoInfoUrl: string) {
            this._getVideoInfoUrl = getVideoInfoUrl;
        }


        private _playVideoUrl: string;

        public get playVideoUrl() {
            return this._playVideoUrl;
        }

        public set playVideoUrl(playVideoUrl: string) {
            this._playVideoUrl = playVideoUrl;
        }

        //mp4地址
        private _mp4Url: string;

        public get mp4Url() {
            return this._mp4Url;
        }

        public set mp4Url(mp4Url: string) {
            this._mp4Url = mp4Url;
        }

        //flv地址
        private _flvUrl: string;

        public get flvUrl() {
            return this._flvUrl;
        }

        public set flvUrl(flvUrl: string) {
            this._flvUrl = flvUrl;
        }

        //webm地址
        private _webmUrl: string;

        public get webmUrl() {
            return this._webmUrl;
        }

        public set webmUrl(webmUrl: string) {
            this._webmUrl = webmUrl;
        }

        //ogv地址
        private _ogvUrl: string;

        public get ogvUrl() {
            return this._ogvUrl;
        }

        public set ogvUrl(ogvUrl: string) {
            this._ogvUrl = ogvUrl;
        }

        //视频截图
        private _videoPicture: string;

        public get videoPicture() {
            return this._videoPicture;
        }

        public set videoPicture(videoPicture: string) {
            this._videoPicture = videoPicture;
        }


        //父容器的宽
        private _width: string = "600";

        public get width() {
            return this._width;
        }

        public set width(width: string) {
            this._width = width;
        }

        //父容器的高
        private _height: string = "400";

        public get height() {
            return this._height;
        }

        public set height(height: string) {
            this._height = height;
        }


        private _id: string;

        public get id() {
            return this._id;
        }

        public set id(id: string) {
            this._id = id;
        }


        //模板路径
        private _template: any;

        public get Template() {
            return this._template || this.getTemplate("../ap-widget-video/video.html");
        }

        public set Template(templateUrl: any) {
            this._template = this.getTemplate(templateUrl);
        }


        private flag: boolean = false;

        //绑定
        public Bind(id: any) {

            this.id = id;

            var self = this;

            this.getVideoInfo();

            var vm = new Vue({
                el: "#" + id,
                replace: false,
                template: self.Template,
                data: {
                    obj: self
                },
                computed: {

                },
                methods: {
                    //通过_提升绑定方法的作用域，将this指向uploader实例
                    _: function (fn) {
                        if (_.isFunction(fn)) fn.apply(this, arguments);
                    }.bind(self)
                }
            });

        }

        public OnSuccess(data: any): void {

        }

        //load远程模板
        private getTemplate(url: string): string {
            var ajax = new ap.utility.ajax.ajax();
            ajax.url = url;
            ajax.async = false;
            ajax.load();
            return ajax.responseText;
        }


        private getVideoInfo() {

            var count: number = 0;
            var ret = setInterval(function () {

                count++;

                if (count > 100) {
                    clearInterval(ret);
                }

                var ajax = new ap.utility.ajax.ajax();
                ajax.async = true;
                ajax.url = this.getVideoInfoUrl;
                //ajax.data = { fileName: fileName };
                ajax.onSuccess = function (resp) {

                    //console.log(resp);

                    var result = JSON.parse(resp);
                    if (result.Flag === 1) {
                        clearInterval(ret);

                        this.OnSuccess(result);

                        this.ext = result.Extension;
                        this.mp4Url = this.playVideoUrl + result.Mp4Path;
                        this.ogvUrl = this.playVideoUrl + result.OgvPath;
                        this.webmUrl = this.playVideoUrl + result.WebmPath;
                        this.flvUrl = this.playVideoUrl + result.FlvPath;
                        this.videoPicture = this.playVideoUrl + result.Picture;

                        this.flag = 1;

                        if (this.ext) {
                            if (this.ext.toLowerCase() == '.flv') {
                                this.isFlv = true;
                            } else {
                                this.isFlv = false;
                            }
                        }

                    }

                }.bind(this);
                ajax.onError = function (resp) {

                }.bind(this);

                ajax.load();

            }.bind(this), 100);

        }

    }
}