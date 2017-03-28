/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      yqj
** 创建日期:    2017年2月15日
** 修改人:
** 修改日期:
** 描 述:       下载封装库
**-----------------------------------------------------------------
******************************************************************/
/// <reference path="../../d_ts/lodash-2.4.1.d.ts" />
/// <reference path="../ajax/ap_ajax.ts" />
/// <reference path="../../d_ts/vue.0.10.5.d.ts" />
var ap;
(function (ap) {
    var utility;
    (function (utility) {
        var download;
        (function (download) {
            /*上传状态枚举*/
            (function (DownloadStatus) {
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_READY"] = 0] = "DOWNLOAD_STATE_READY";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_PACK"] = 1] = "DOWNLOAD_STATE_PACK";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_CALC"] = 2] = "DOWNLOAD_STATE_CALC";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_PROCESSING"] = 3] = "DOWNLOAD_STATE_PROCESSING";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_COMBINE"] = 4] = "DOWNLOAD_STATE_COMBINE";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_COMPLETE"] = 5] = "DOWNLOAD_STATE_COMPLETE";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_ABORT"] = -1] = "DOWNLOAD_STATE_ABORT";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_CANCEL"] = -2] = "DOWNLOAD_STATE_CANCEL";
                DownloadStatus[DownloadStatus["DOWNLOAD_STATE_ERROR"] = -3] = "DOWNLOAD_STATE_ERROR";
            })(download.DownloadStatus || (download.DownloadStatus = {}));
            var DownloadStatus = download.DownloadStatus;
            var chunk = (function () {
                function chunk() {
                    this._fileOldName = "";
                    this._fileNewName = "";
                }
                Object.defineProperty(chunk.prototype, "fileOldName", {
                    get: function () {
                        return this._fileOldName;
                    },
                    set: function (fileOldName) {
                        this._fileOldName = fileOldName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "fileNewName", {
                    get: function () {
                        return this._fileNewName;
                    },
                    set: function (fileNewName) {
                        this._fileNewName = fileNewName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "chunkNumber", {
                    get: function () {
                        return this._chunkNumber;
                    },
                    set: function (chunkNumber) {
                        this._chunkNumber = chunkNumber;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "chunkCount", {
                    get: function () {
                        return this._chunkCount;
                    },
                    set: function (chunkCount) {
                        this._chunkCount = chunkCount;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "block", {
                    get: function () {
                        return this._block;
                    },
                    set: function (block) {
                        this._block = block;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "fileName", {
                    get: function () {
                        return this._fileName;
                    },
                    set: function (fileName) {
                        this._fileName = fileName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "filePath", {
                    get: function () {
                        return this._filePath;
                    },
                    set: function (filePath) {
                        this._filePath = filePath;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(chunk.prototype, "downloadPath", {
                    get: function () {
                        return this._downloadPath;
                    },
                    set: function (downloadPath) {
                        this._downloadPath = downloadPath;
                    },
                    enumerable: true,
                    configurable: true
                });
                return chunk;
            })();
            download.chunk = chunk;
            //下载器，用于解析下载任务，同时提供批量下载
            var downloader = (function () {
                function downloader() {
                    //在debug模式下 将输出日志
                    this._debug = false;
                    this._fileSize = "0"; //文件总计大小
                    this._block = 1 * 1024 * 1024; //20M 文件下载的块大小 分片下载时有效
                    this._downloadFiles = []; // 需要下载的文件数组
                    this._fileNums = 0; //文件总计个数
                    this.downloaders = [];
                    //上传参数
                    this._data = [];
                    this.files = [];
                    //本地存储
                    this._downloadStore = null;
                    this._guid = new Date().getTime();
                    this._useMomery = true;
                }
                Object.defineProperty(downloader.prototype, "debug", {
                    get: function () {
                        return this._debug;
                    },
                    set: function (debug) {
                        this._debug = debug;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    set: function (id) {
                        this._id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "fileSize", {
                    get: function () {
                        return this._fileSize;
                    },
                    set: function (fileSize) {
                        this._fileSize = fileSize;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "url", {
                    get: function () {
                        return this._url;
                    },
                    set: function (url) {
                        this._url = url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "block", {
                    get: function () {
                        return this._block;
                    },
                    set: function (block) {
                        this._block = block;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "fileNums", {
                    get: function () {
                        return this._fileNums;
                    },
                    set: function (fileNums) {
                        this._fileNums = fileNums;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "Template", {
                    get: function () {
                        return this._template || ap.utility.utils.utils.GetTemplate("../../Widget/ap-wiget-download/ap-widget-download.html");
                    },
                    set: function (templateUrl) {
                        this._template = ap.utility.utils.utils.GetTemplate(templateUrl);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "data", {
                    get: function () {
                        return this._data;
                    },
                    set: function (data) {
                        this._data = data;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "downloadStore", {
                    get: function () {
                        return this._downloadStore;
                    },
                    set: function (downloadStore) {
                        this._downloadStore = downloadStore;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "guid", {
                    get: function () {
                        return this._guid;
                    },
                    set: function (guid) {
                        this._guid = guid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloader.prototype, "useMomery", {
                    get: function () {
                        return this._useMomery;
                    },
                    set: function (useMomery) {
                        this._useMomery = useMomery;
                    },
                    enumerable: true,
                    configurable: true
                });
                //初始化下载器
                downloader.prototype.start = function () {
                    if (!this.data) {
                        throw new Error("请设置上传文件参数");
                    }
                    if (!_.isArray(this.data)) {
                        throw new Error("文件参数是一个数组");
                    }
                    if (!this.useMomery) {
                        this.initStore(this.run.bind(this));
                    }
                    else {
                        this.run(); //后续实现的内存模式
                    }
                };
                //运行
                downloader.prototype.run = function () {
                    var files = [];
                    var folderName = ".allpass"; //如果文件夹名称为空，约定为.allpass
                    this.data.forEach(function (file) {
                        //if (!file.fileOldName) return;
                        if (file.folderName)
                            folderName = file.folderName;
                        if (!files[folderName])
                            files[folderName] = [];
                        //过滤掉重复的文件
                        files[folderName].push({
                            fileOldPath: file.fileOldPath,
                            fileOldName: file.fileOldName,
                            fileNewName: file.fileNewName,
                            filePath: file.filePath,
                            folderName: folderName,
                            downloadPath: file.downloadPath
                        });
                    });
                    var count = 0;
                    //遍历文件夹，调用下载
                    for (var item in files) {
                        var subFiles = files[item];
                        var subList = [];
                        subFiles.forEach(function (subItem) {
                            subList.push({
                                fileOldPath: subItem.fileOldPath,
                                fileOldName: subItem.fileOldName,
                                fileNewName: subItem.fileNewName,
                                filePath: subItem.filePath,
                                folderName: subItem.folderName,
                                downloadPath: subItem.downloadPath
                            });
                        });
                        var downloader = new ap.utility.download.downloadCore();
                        downloader.index = count;
                        downloader.block = this.block;
                        downloader.url = this.url;
                        downloader.data = subList;
                        downloader.showName = item;
                        downloader.downloadStore = this.downloadStore;
                        downloader.guid = this.guid;
                        downloader.useMomery = this.useMomery;
                        this.downloaders.push(downloader);
                        downloader.start(); //开始下载
                        count++;
                    }
                    this.fileNums = count;
                };
                //初始化存储数据库
                downloader.prototype.initStore = function (callback) {
                    if (callback === void 0) { callback = null; }
                    if (!this.downloadStore) {
                        this.downloadStore = new ap.utility.db.dataBaseStore("allpass-download-db");
                        this.downloadStore.addStore({
                            storeName: this.guid,
                            columns: [
                                { name: 'id', primary: true },
                                { name: 'fileName', index: true },
                                { name: 'blob' },
                                { name: 'guid', index: true }
                            ]
                        }, false, callback);
                    }
                    else {
                        callback(null);
                    }
                };
                //绑定
                downloader.prototype.Bind = function (id) {
                    var self = this;
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
                downloader.prototype.stop = function (index) {
                    var downloader = this.downloaders[index];
                    if (downloader) {
                        downloader.stop();
                    }
                };
                downloader.prototype.restart = function (index) {
                    var downloader = this.downloaders[index];
                    if (downloader) {
                        downloader.restart();
                    }
                };
                downloader.prototype.cancel = function (index) {
                    var downloader = this.downloaders[index];
                    if (downloader) {
                        downloader.cancel();
                    }
                };
                return downloader;
            })();
            download.downloader = downloader;
            //核心下载处理类
            var downloadCore = (function () {
                function downloadCore() {
                    this._index = 0;
                    //在debug模式下 将输出日志
                    this._debug = false;
                    this._fileSize = "0KB"; //文件总计大小
                    this._block = 1 * 1024 * 1024; //1M 文件下载的块大小 分片下载时有效
                    //进度下载进度的数组
                    this._loadedInfo = {
                        fileName: '-',
                        fileSize: 0,
                        block: this.block,
                        fileCount: 0,
                        total: 0,
                        loaded: 0,
                        loadedTxt: '0',
                        progress: 0,
                        avgSpeed: 0,
                        totalTime: '',
                        startTime: new Date(),
                        endTime: new Date() //结束时间，默认等于开始时间
                    };
                    /* 样式设定*/
                    this._showProgress = true; //显示文件下载按钮
                    this.showName = "";
                    this._data = [];
                    //是否压缩
                    this._isZip = true;
                    //下载状态
                    this._status = 0;
                    this._statusTxt = "准备下载";
                    //是否强制下载 默认是
                    this._forceDownload = true;
                    //下载的路径
                    this._fileOldPath = "";
                    this._fileOldName = "";
                    this._fileNewName = "";
                    this._chunkCountMethod = "GetChunkCount";
                    this._downloadMethod = "DownloadMultiFile";
                    this._downloadPath = "";
                    this._guid = new Date().getTime();
                    this._needInitStore = true;
                    this._useMomery = true;
                }
                Object.defineProperty(downloadCore.prototype, "index", {
                    get: function () {
                        return this._index;
                    },
                    set: function (index) {
                        this._index = index;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "debug", {
                    get: function () {
                        return this._debug;
                    },
                    set: function (debug) {
                        this._debug = debug;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    set: function (id) {
                        this._id = id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "fileSize", {
                    get: function () {
                        return this._fileSize;
                    },
                    set: function (fileSize) {
                        this._fileSize = fileSize;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "url", {
                    get: function () {
                        return this._url;
                    },
                    set: function (url) {
                        this._url = url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "block", {
                    get: function () {
                        return this._block;
                    },
                    set: function (block) {
                        this._block = block;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "loadedInfo", {
                    get: function () {
                        return this._loadedInfo;
                    },
                    set: function (loadedInfo) {
                        this._loadedInfo = loadedInfo;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "showProgress", {
                    get: function () {
                        return this._showProgress;
                    },
                    set: function (showProgress) {
                        this._showProgress = showProgress;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "data", {
                    get: function () {
                        return this._data;
                    },
                    set: function (data) {
                        this._data = data;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "isZip", {
                    get: function () {
                        return this._isZip;
                    },
                    set: function (isZip) {
                        this._isZip = isZip;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "status", {
                    get: function () {
                        return this._status;
                    },
                    set: function (status) {
                        this._status = status;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "statusTxt", {
                    get: function () {
                        return this._statusTxt;
                    },
                    set: function (statusTxt) {
                        this._statusTxt = statusTxt;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "forceDownload", {
                    get: function () {
                        return this._forceDownload;
                    },
                    set: function (forceDownload) {
                        this._forceDownload = forceDownload;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "fileOldPath", {
                    get: function () {
                        return this._fileOldPath;
                    },
                    set: function (fileOldPath) {
                        this._fileOldPath = fileOldPath;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "fileOldName", {
                    get: function () {
                        return this._fileOldName;
                    },
                    set: function (fileOldName) {
                        this._fileOldName = fileOldName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "fileNewName", {
                    get: function () {
                        return this._fileNewName;
                    },
                    set: function (fileNewName) {
                        this._fileNewName = fileNewName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "chunkCountMethod", {
                    get: function () {
                        return this._chunkCountMethod;
                    },
                    set: function (chunkCountMethod) {
                        this._chunkCountMethod = chunkCountMethod;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "downloadMethod", {
                    get: function () {
                        return this._downloadMethod;
                    },
                    set: function (downloadMethod) {
                        this._downloadMethod = downloadMethod;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "downloadPath", {
                    get: function () {
                        return this._downloadPath;
                    },
                    set: function (downloadPath) {
                        this._downloadPath = downloadPath;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "downloadStore", {
                    get: function () {
                        return this._downloadStore;
                    },
                    set: function (downloadStore) {
                        this._downloadStore = downloadStore;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "guid", {
                    get: function () {
                        return this._guid;
                    },
                    set: function (guid) {
                        this._guid = guid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "xhr", {
                    get: function () {
                        return this._xhr;
                    },
                    set: function (xhr) {
                        this._xhr = xhr;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "calcResult", {
                    get: function () {
                        return this._calcResult;
                    },
                    set: function (calcResult) {
                        this._calcResult = calcResult;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "needInitStore", {
                    get: function () {
                        return this._needInitStore;
                    },
                    set: function (needInitStore) {
                        this._needInitStore = needInitStore;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(downloadCore.prototype, "useMomery", {
                    get: function () {
                        return this._useMomery;
                    },
                    set: function (useMomery) {
                        this._useMomery = useMomery;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*
                  检查文件类型和大小
                  提供给外部的过滤文件格式等的接口，外部需要把过滤后的文件返回
                */
                downloadCore.prototype.filterFile = function (files) {
                    var tmpFiles = [];
                    return tmpFiles;
                };
                //接口方法
                downloadCore.prototype.onGetChunkCount = function (xhr, that) {
                    // 提供给外部获取文件切分块数
                };
                downloadCore.prototype.onSelect = function (selectFile, files) {
                    // 提供给外部获取选中的文件，供外部实现预览等功能  selectFile:当前选中的文件  allFiles:还没下载的全部文件
                };
                downloadCore.prototype.onDelete = function (file, files) {
                    // 提供给外部获取删除的单个文件，供外部实现删除效果  file:当前删除的文件  files:删除之后的文件
                };
                downloadCore.prototype.onProgress = function (file, loaded, total) {
                    // 提供给外部获取单个文件的下载进度，供外部实现下载进度效果
                };
                downloadCore.prototype.onSuccess = function (file) {
                    // 提供给外部获取单个文件下载成功，供外部实现成功效果
                };
                downloadCore.prototype.onError = function (responseInfo) {
                    // 提供给外部获取单个文件下载失败，供外部实现失败效果
                };
                downloadCore.prototype.onComplete = function (responseInfo) {
                    // 提供给外部获取全部文件下载完成，供外部实现完成效果
                };
                downloadCore.prototype.onAbort = function (file) {
                    // 提供给外部获取全部文件下载完成，供外部实现完成效果
                };
                downloadCore.prototype.onCancel = function (file) {
                    // 提供给外部获取全部文件下载完成，供外部实现完成效果
                };
                downloadCore.prototype.onFilterFile = function (files) {
                    //提供给外部过滤文件的接口
                    return files;
                };
                downloadCore.prototype.onSaveUrl = function (url) {
                    //提供给外部文件的接口, 处理下载后的url
                };
                downloadCore.prototype.onSaveBlob = function (url) {
                    //提供给外部文件的接口, 处理下载后的url
                };
                Object.defineProperty(downloadCore.prototype, "Template", {
                    get: function () {
                        return this._template || ap.utility.utils.utils.GetTemplate("../download/ap_widget_downloadCore.html");
                    },
                    set: function (templateUrl) {
                        this._template = ap.utility.utils.utils.GetTemplate(templateUrl);
                    },
                    enumerable: true,
                    configurable: true
                });
                //绑定
                downloadCore.prototype.Bind = function (id) {
                    var self = this;
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
                //初始化存储数据库
                downloadCore.prototype.initStore = function (callback) {
                    if (callback === void 0) { callback = null; }
                    this.downloadStore = new ap.utility.db.dataBaseStore("allpass-download-db");
                    this.downloadStore.addStore({
                        storeName: this.guid,
                        columns: [
                            { name: 'id', primary: true },
                            { name: 'fileName', index: true },
                            { name: 'blob' },
                            { name: 'guid', index: true }
                        ]
                    }, false, callback);
                };
                //开始下载--测试方法
                downloadCore.prototype.start = function () {
                    //准备下载
                    this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_READY);
                    var that = this;
                    this.arrBlobs = [];
                    this.chunkQueue = [];
                    if (!this.useMomery) {
                        this.initStore(function (db) {
                            //alert('1');
                            this.getChunkCount();
                        }.bind(this));
                    }
                    else {
                        //alert('1');
                        this.getChunkCount();
                    }
                };
                downloadCore.prototype.saveBlob = function (id, fileName, blob) {
                    this.downloadStore.useStore(this.guid);
                    this.downloadStore.set({ id: id, fileName: fileName, guid: this.guid, blob: blob });
                };
                //取得文件块数
                downloadCore.prototype.getChunkCount = function () {
                    //设置状态--计算分块
                    if (this.data && this.data.length > 1) {
                        this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_CALC);
                    }
                    else {
                        this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_PACK);
                    }
                    var that = this;
                    var params = '';
                    params = JSON.stringify({
                        fileData: JSON.stringify({
                            fileOldPath: this.fileOldPath,
                            fileOldName: this.fileOldName,
                            fileNewName: this.fileNewName,
                            downloadPath: this.downloadPath,
                            data: JSON.stringify(this.data),
                            block: this.block
                        })
                    });
                    var xhr = new XMLHttpRequest();
                    if (!_.endsWith(this.url, '/'))
                        this.url = this.url + '/';
                    xhr.open("POST", this.url + this.chunkCountMethod, true);
                    //contentType: "application/json; charset=utf-8"
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.onload = function () {
                        that.onChunkCountRecieved(this, that);
                    };
                    xhr.addEventListener("error", function (e) {
                        this.onError(e.target.responseText);
                    }.bind(this), false);
                    xhr.send(params);
                    this.xhr = xhr;
                };
                //逐块下载
                downloadCore.prototype.downloadChunks = function (chunkCount, fileOldName, fileNewName, filePath) {
                    //开始下载状态
                    this.setStatus(DownloadStatus.DOWNLOAD_STATE_PROCESSING);
                    var that = this;
                    for (var i = 1; i <= chunkCount; i++) {
                        var chunk = new ap.utility.download.chunk();
                        chunk.chunkCount = chunkCount;
                        chunk.chunkNumber = i;
                        chunk.block = this.block;
                        chunk.fileOldName = fileOldName;
                        chunk.fileNewName = fileNewName;
                        chunk.filePath = filePath;
                        chunk.downloadPath = this.downloadPath;
                        this.chunkQueue.push(chunk);
                    }
                    this.downloadNextChunk();
                };
                //下载下一块
                downloadCore.prototype.downloadNextChunk = function () {
                    if (this.chunkQueue.length > 0) {
                        var nextChunk = this.chunkQueue.shift();
                        if (this.useMomery) {
                            this.downloadChunk(nextChunk); //内存模式
                        }
                        else {
                            this.downloadStore.useStore(this.guid);
                            //检查已下载的分块
                            this.downloadStore.get(nextChunk.chunkNumber, function (data) {
                                //data是blob数据
                                if (!data) {
                                    this.downloadChunk(nextChunk);
                                }
                                else {
                                    if (this.debug) {
                                        this.logPage(data.fileName + ' 第' + data.id + '分块已上传');
                                    }
                                    this.updateProgress({ loaded: data.blob.size });
                                    this.downloadNextChunk();
                                }
                            }.bind(this));
                        }
                    }
                    else {
                        this.chunkQueue = null;
                        this.onAllChunksDownloaded();
                    }
                };
                //发起请求，下载文件
                downloadCore.prototype.downloadChunk = function (chunk) {
                    var that = this;
                    var params = JSON.stringify({
                        data: JSON.stringify({
                            fileOldName: chunk.fileOldName,
                            fileNewName: chunk.fileNewName,
                            folderName: '',
                            filePath: chunk.filePath,
                            downloadPath: chunk.downloadPath,
                            forceDownload: true
                        }),
                    });
                    //this.fileGuidParamName + "=" + chunk.fileName + "&" + this.chunkParamName + "=" + chunk.chunkNumber;
                    var xhr = new XMLHttpRequest();
                    if (!_.endsWith(this.url, '/'))
                        this.url = this.url + '/';
                    xhr.open("POST", this.url + this.downloadMethod, true);
                    xhr.responseType = "blob"; //接受二进制数据
                    //不采用通常的range来实现
                    //xhr.setRequestHeader("Range", "bytes=" + chunk.chunkNumber * chunk.block + "-");  //必须按顺序执行
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("X_FILE_BLOCK", chunk.block.toString());
                    xhr.setRequestHeader("X_FILE_CHUNK", chunk.chunkNumber.toString());
                    xhr.setRequestHeader("X_FILE_CHUNKS", chunk.chunkCount.toString());
                    xhr.onload = function () {
                        that.onChunkDownloaded(this, chunk);
                    };
                    // 错误
                    xhr.addEventListener("error", function (e) {
                        this._wholeError(e, chunk);
                    }.bind(this), false);
                    //停止
                    xhr.addEventListener("abort", function () {
                        this._wholeAbort(chunk);
                    }.bind(this), false);
                    //显示数据有问题，除了文件的blob，每次请求都伴随着一次3kb的响应数据
                    //xhr.onprogress = that.updateProgress.bind(that); //下载进度监控
                    xhr.send(params);
                    this.xhr = xhr;
                };
                //下载错误
                downloadCore.prototype._wholeError = function (e, chunk) {
                    this.setStatus(DownloadStatus.DOWNLOAD_STATE_ERROR);
                    if (this.debug)
                        this.logConsole(this.showName + " 下载异常，服务器返回消息:" + e.target.responseText);
                    this.onError(e.target.responseText);
                };
                //下载暂停
                downloadCore.prototype._wholeAbort = function (chunk) {
                    //alert('暂停');
                    this.setStatus(DownloadStatus.DOWNLOAD_STATE_ABORT);
                    this.onAbort(chunk);
                };
                //更新进度
                downloadCore.prototype.updateProgress = function (event) {
                    this.loadedInfo.loaded += event.loaded;
                    var loaded = this.loadedInfo.loaded;
                    var total = this.loadedInfo.fileSize;
                    var percentComplete = 0;
                    if (event.lengthComputable) {
                        total = event.total;
                        percentComplete = (Number)((loaded / event.total * 100).toFixed());
                    }
                    else {
                        percentComplete = (Number)((loaded / total * 100).toFixed());
                    }
                    if (percentComplete > 100)
                        percentComplete = 100;
                    var thisTime = new Date();
                    //过去秒数
                    var secs = (thisTime.getTime() - this.loadedInfo.startTime.getTime()) / 1000;
                    this.loadedInfo.endTime = thisTime;
                    this.loadedInfo.avgSpeed = ap.utility.utils.utils.BytesToSize(Math.floor(loaded / secs)) + "/s";
                    this.loadedInfo.totalTime = ap.utility.utils.utils.SecondsToTime(secs);
                    this.loadedInfo.loaded = loaded;
                    this.loadedInfo.loadedTxt = ap.utility.utils.utils.BytesToSize(loaded);
                    this.loadedInfo.total = ap.utility.utils.utils.BytesToSize(total);
                    this.loadedInfo.progress = percentComplete;
                };
                //接受文件块数信息
                downloadCore.prototype.onChunkCountRecieved = function (xhr, that) {
                    var result = JSON.parse(JSON.parse(xhr.responseText)); //json 包装string
                    if (result.isSuccess) {
                        this.run(result);
                    }
                    else {
                        this.onError(result);
                    }
                };
                downloadCore.prototype.run = function (result) {
                    if (result.isSuccess) {
                        this.calcResult = result;
                        this.loadedInfo = {
                            fileOldName: result.fileOldName,
                            fileNewName: result.fileNewName,
                            fileSize: result.fileSize,
                            filePath: result.filePath,
                            block: result.block,
                            fileCount: result.fileCount,
                            total: 0,
                            loaded: 0,
                            loadedTxt: '',
                            progress: 0,
                            avgSpeed: 0,
                            totalTime: '',
                            startTime: new Date(),
                            endTime: new Date() //结束时间，默认等于开始时间
                        };
                        this.fileOldName = result.fileOldName;
                        this.fileNewName = result.fileNewName;
                        this.downloadPath = result.downloadPath;
                        this.chunkCount = parseInt(result.fileCount);
                        //下载中
                        this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_PROCESSING);
                        this.downloadChunks(this.chunkCount, result.fileOldName, result.fileNewName, result.filePath);
                    }
                    else {
                        this.logPage(result.message);
                    }
                };
                //文件块下载完成后事件
                downloadCore.prototype.onChunkDownloaded = function (xhr, downloadedChunk) {
                    if (this.status === DownloadStatus.DOWNLOAD_STATE_ABORT) {
                        return;
                    }
                    //保存到本地存储
                    if (!this.useMomery) {
                        this.saveBlob(downloadedChunk.chunkNumber, downloadedChunk.fileName, xhr.response);
                    }
                    else {
                        this.arrBlobs.push(xhr.response);
                    }
                    this.updateProgress({ loaded: xhr.response.size });
                    if (this.chunkQueue.length === 0) {
                        this.onAllChunksDownloaded();
                    }
                    else {
                        this.downloadNextChunk();
                    }
                    xhr = null;
                };
                //所有文件块下载完成后事件
                downloadCore.prototype.onAllChunksDownloaded = function () {
                    this.setStatus(DownloadStatus.DOWNLOAD_STATE_COMBINE);
                    //合并块文件
                    if (!this.useMomery) {
                        //根据索引取得所有数据
                        this.downloadStore.getAllByCursor(function (data) {
                            //this.downloadStore.getAllByIndex('guid', function (data) {
                            _.sortBy(data, ['id']);
                            data.forEach(function (item) {
                                this.arrBlobs.push(item.blob);
                            }.bind(this));
                            this.combineBlobAndSave();
                            this.downloadStore.deleteStore(this.guid);
                        }.bind(this));
                    }
                    else {
                        this.combineBlobAndSave();
                    }
                };
                //合并块文件，提交保存
                downloadCore.prototype.combineBlobAndSave = function () {
                    var finalBlob = new Blob(this.arrBlobs, { type: this.arrBlobs[0].type });
                    if (this.forceDownload) {
                        this.saveAs(finalBlob, this.fileNewName);
                    }
                    else {
                        this.openResource(finalBlob);
                    }
                    this.arrBlobs = null;
                    //外部回调接口
                    this.onSuccess(finalBlob);
                    //下载完成
                    this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_COMPLETE);
                };
                //暂停
                downloadCore.prototype.stop = function () {
                    if (this.xhr) {
                        this.xhr.abort();
                    }
                    this.chunkQueue = []; //清空上传队列
                    if (this.status === DownloadStatus.DOWNLOAD_STATE_PROCESSING) {
                        this.setStatus(DownloadStatus.DOWNLOAD_STATE_ABORT);
                    }
                };
                //重新开始
                downloadCore.prototype.restart = function () {
                    //this.initStore();
                    //不需要重新计算分块
                    if (this.calcResult) {
                        this.run(this.calcResult);
                    }
                    else {
                        this.start();
                    }
                };
                //取消
                downloadCore.prototype.cancel = function () {
                    this.stop();
                    try {
                        if (!this.useMomery) {
                            this.downloadStore.deleteStore(this.guid);
                        }
                    }
                    catch (e) {
                    }
                    this.setStatus(DownloadStatus.DOWNLOAD_STATE_CANCEL);
                };
                /*
                弹出对话框保存
                1.Chrome需要配置弹出对话框
                2.firefox a标签的下载不生效
                //兼容处理
                //http://stackoverflow.com/questions/30694453/blob-createobjecturl-download-not-working-in-firefox-but-works-when-debugging
        
                */
                downloadCore.prototype.saveAs = function (blob, fileName) {
                    var URL = window.URL || window.webkitURL || window;
                    var type = blob.type;
                    var force_saveable_type = 'application/octet-stream';
                    if (type && type != force_saveable_type) {
                        var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                        blob = slice.call(blob, 0, blob.size, force_saveable_type);
                    }
                    var url = URL.createObjectURL(blob);
                    var save_link = document.createElement('a');
                    save_link.style.display = "none";
                    save_link.href = url;
                    save_link.download = fileName;
                    //兼容ie处理
                    if (window.navigator.msSaveOrOpenBlob) {
                        save_link.onclick = function () {
                            window.navigator.msSaveOrOpenBlob(blob, fileName);
                        };
                    }
                    document.body.appendChild(save_link);
                    //this.fireClick(save_link);
                    save_link.click();
                    setTimeout(function () {
                        document.body.removeChild(save_link);
                        URL.revokeObjectURL(url);
                    }, 100);
                };
                downloadCore.prototype.openResource = function (blob) {
                    var URL = window.URL || window.webkitURL || window;
                    var type = blob.type;
                    var force_saveable_type = 'application/octet-stream';
                    if (type && type != force_saveable_type) {
                        var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                        blob = slice.call(blob, 0, blob.size, force_saveable_type);
                    }
                    this.onSaveBlob(blob);
                    var url = URL.createObjectURL(blob);
                    this.onSaveUrl(url);
                };
                //设置下载状态
                downloadCore.prototype.setStatus = function (status) {
                    this.status = status;
                    this.statusTxt = this.getDownloadStatusText(status);
                };
                //获取上传状态说明
                downloadCore.prototype.getDownloadStatusText = function (status) {
                    switch (status) {
                        case DownloadStatus.DOWNLOAD_STATE_READY:
                            return "准备下载"; //任务已添加,准备下载
                        case DownloadStatus.DOWNLOAD_STATE_PACK:
                            return "正在打包";
                        case DownloadStatus.DOWNLOAD_STATE_CALC:
                            return "正在打包，计算分块";
                        case DownloadStatus.DOWNLOAD_STATE_PROCESSING:
                            return "下载中";
                        case DownloadStatus.DOWNLOAD_STATE_COMBINE:
                            return "合并文件";
                        case DownloadStatus.DOWNLOAD_STATE_COMPLETE:
                            return "下载完成";
                        case DownloadStatus.DOWNLOAD_STATE_ABORT:
                            return "已暂停";
                        case DownloadStatus.DOWNLOAD_STATE_CANCEL:
                            return "已取消";
                        case DownloadStatus.DOWNLOAD_STATE_ERROR:
                            return "已失败";
                    }
                    return "未知状态";
                };
                //在页面写日志
                downloadCore.prototype.logPage = function (message) {
                    if (this.debug) {
                        ap.utility.utils.utils.Log(message);
                    }
                };
                //在控制台写日志
                downloadCore.prototype.logConsole = function (message) {
                    console.log(message);
                };
                //在控制台抛异常
                downloadCore.prototype.logError = function (message) {
                    throw new Error(message);
                };
                //触发事件
                downloadCore.prototype.fireEvent = function (obj, type, response) {
                    //var isIE = navigator.userAgent.match(/MSIE (\d)/i);
                    //isIE = isIE ? isIE[1] : undefined;
                    ////给obj绑定事件
                    ////传统浏览器使用attachEvent 现代浏览器使用addEventListner
                    //isIE < 9 ? obj.attachEvent("on" + type, response) :
                    //obj.addEventListener(type, response, false);
                    //// 触发自定义事件
                    //if (isIE < 9) {
                    //    //传统浏览器
                    //    var event = document.createEventObject();//创建对象           
                    //    event.msg = "我是fireEvent触发的";//给事件对象添加属性              
                    //    obj.fireEvent("on" + type, event);//触发事件
                    //} else {
                    //    //现代浏览器
                    //    var e = document.createEvent("MouseEvents");//创建事件对象              
                    //    e.initEvent(type, false, false);//初始化事件对象initMouseEvent需要更多参数
                    //    e.msg = "我是despatchEvent触发的"; //给事件对象添加属性
                    //    obj.dispatchEvent(e);//触发事件          
                    //}
                };
                downloadCore.prototype.fireClick = function (el) {
                    var evt;
                    if (document.createEvent) {
                        evt = document.createEvent("MouseEvents");
                        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        el.dispatchEvent(evt);
                    }
                    else if (el.fireEvent) {
                        el.fireEvent('onclick');
                    }
                };
                return downloadCore;
            })();
            download.downloadCore = downloadCore;
        })(download = utility.download || (utility.download = {}));
    })(utility = ap.utility || (ap.utility = {}));
})(ap || (ap = {}));
