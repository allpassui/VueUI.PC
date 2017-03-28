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
var ap;
(function (ap) {
    var utility;
    (function (utility) {
        var video;
        (function (video_1) {
            var video = (function () {
                function video() {
                    //在debug模式下 将输出日志
                    this._debug = false;
                    this._isFlv = false;
                    //父容器的宽
                    this._width = "600";
                    //父容器的高
                    this._height = "400";
                    this.flag = false;
                }
                Object.defineProperty(video.prototype, "debug", {
                    get: function () {
                        return this._debug;
                    },
                    set: function (debug) {
                        this._debug = debug;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "isFlv", {
                    get: function () {
                        return this._isFlv;
                    },
                    set: function (isFlv) {
                        this._isFlv = isFlv;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "ext", {
                    get: function () {
                        return this._ext;
                    },
                    set: function (ext) {
                        this._ext = ext;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "getVideoInfoUrl", {
                    get: function () {
                        return this._getVideoInfoUrl;
                    },
                    set: function (getVideoInfoUrl) {
                        this._getVideoInfoUrl = getVideoInfoUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "playVideoUrl", {
                    get: function () {
                        return this._playVideoUrl;
                    },
                    set: function (playVideoUrl) {
                        this._playVideoUrl = playVideoUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "mp4Url", {
                    get: function () {
                        return this._mp4Url;
                    },
                    set: function (mp4Url) {
                        this._mp4Url = mp4Url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "flvUrl", {
                    get: function () {
                        return this._flvUrl;
                    },
                    set: function (flvUrl) {
                        this._flvUrl = flvUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "webmUrl", {
                    get: function () {
                        return this._webmUrl;
                    },
                    set: function (webmUrl) {
                        this._webmUrl = webmUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "ogvUrl", {
                    get: function () {
                        return this._ogvUrl;
                    },
                    set: function (ogvUrl) {
                        this._ogvUrl = ogvUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "videoPicture", {
                    get: function () {
                        return this._videoPicture;
                    },
                    set: function (videoPicture) {
                        this._videoPicture = videoPicture;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "width", {
                    get: function () {
                        return this._width;
                    },
                    set: function (width) {
                        this._width = width;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "height", {
                    get: function () {
                        return this._height;
                    },
                    set: function (height) {
                        this._height = height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    set: function (id) {
                        this._id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(video.prototype, "Template", {
                    get: function () {
                        return this._template || this.getTemplate("../ap-widget-video/video.html");
                    },
                    set: function (templateUrl) {
                        this._template = this.getTemplate(templateUrl);
                    },
                    enumerable: true,
                    configurable: true
                });
                //绑定
                video.prototype.Bind = function (id) {
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
                        computed: {},
                        methods: {
                            //通过_提升绑定方法的作用域，将this指向uploader实例
                            _: function (fn) {
                                if (_.isFunction(fn))
                                    fn.apply(this, arguments);
                            }.bind(self)
                        }
                    });
                };
                video.prototype.OnSuccess = function (data) {
                };
                //load远程模板
                video.prototype.getTemplate = function (url) {
                    var ajax = new ap.utility.ajax.ajax();
                    ajax.url = url;
                    ajax.async = false;
                    ajax.load();
                    return ajax.responseText;
                };
                video.prototype.getVideoInfo = function () {
                    var count = 0;
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
                                    }
                                    else {
                                        this.isFlv = false;
                                    }
                                }
                            }
                        }.bind(this);
                        ajax.onError = function (resp) {
                        }.bind(this);
                        ajax.load();
                    }.bind(this), 100);
                };
                return video;
            })();
            video_1.video = video;
        })(video = utility.video || (utility.video = {}));
    })(utility = ap.utility || (ap.utility = {}));
})(ap || (ap = {}));
