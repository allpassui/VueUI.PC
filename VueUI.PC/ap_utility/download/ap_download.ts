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

namespace ap.utility.download {

    //下载接口
    export interface IDownload {

        debug: boolean; //debug模式将输出下载日志
        id: string;
        url: string; //下载服务地址
        data: Array<any>;// 下载文件列表
        block: number; //文件块的大小
        fileSize: string; //文件总计大小
        loadedInfo: any; //文件下载进度信息

        /* 样式设定*/
        showProgress: boolean; //显示文件下载按钮

        onFilterFile(files: any): any; //供给外部的过滤文件格式等的接口，外部需要把过滤后的文件返回
        onSelect(selectFile: any, files: any);      // 提供给外部获取选中的文件，供外部实现预览等功能  selectFile:当前选中的文件  allFiles:还没下载的全部文件
        onDelete(file: any, files: any);            // 提供给外部获取删除的单个文件，供外部实现删除效果  file:当前删除的文件  files:删除之后的文件
        onProgress(file: any, loaded: any, total: any); // 提供给外部获取单个文件的下载进度，供外部实现下载进度效果
        onSuccess(file: any);   // 提供给外部获取单个文件下载成功，供外部实现成功效果
        onError(responseInfo: any);    // 提供给外部获取单个文件下载失败，供外部实现失败效果
        onComplete(responseInfo: any);         // 提供给外部获取全部文件下载完成，供外部实现完成效果
        onAbort(file: any); //暂停
        onCancel(file: any); //取消
        Bind(id: string): void; //绑定操作
        Template: string;      //模板

    }


    /*上传状态枚举*/
    export enum DownloadStatus {
        DOWNLOAD_STATE_READY = 0,              //任务已添加,准备下载
        DOWNLOAD_STATE_PACK = 1,              //正在打包
        DOWNLOAD_STATE_CALC = 2,              //正在计算分块
        DOWNLOAD_STATE_PROCESSING = 3,         //任务下载中
        DOWNLOAD_STATE_COMBINE= 4,             //合并文件块
        DOWNLOAD_STATE_COMPLETE = 5,           //任务下载完成
        DOWNLOAD_STATE_ABORT = -1,              //任务暂停
        DOWNLOAD_STATE_CANCEL = -2,            //任务已取消
        DOWNLOAD_STATE_ERROR = -3,             //任务已失败
    }


    export class chunk {
        private _fileOldName: string = "";
        public get fileOldName(): string {
            return this._fileOldName;
        }
        public set fileOldName(fileOldName: string) {
            this._fileOldName = fileOldName;
        }

        private _fileNewName: string = "";
        public get fileNewName(): string {
            return this._fileNewName;
        }
        public set fileNewName(fileNewName: string) {
            this._fileNewName = fileNewName;
        }

        private _chunkNumber: number;

        public get chunkNumber(): number {
            return this._chunkNumber;
        }

        public set chunkNumber(chunkNumber: number) {
            this._chunkNumber = chunkNumber;
        }

        private _chunkCount: number;

        public get chunkCount(): number {
            return this._chunkCount;
        }

        public set chunkCount(chunkCount: number) {
            this._chunkCount = chunkCount;
        }

        private _block: number;
        public get block(): number {
            return this._block;
        }
        public set block(block: number) {
            this._block = block;
        }

        private _fileName: string;

        public get fileName(): string {
            return this._fileName;
        }

        public set fileName(fileName: string) {
            this._fileName = fileName;
        }

        private _filePath: string;

        public get filePath(): string {
            return this._filePath;
        }

        public set filePath(filePath: string) {
            this._filePath = filePath;
        }

        private _downloadPath: string;

        public get downloadPath(): string {
            return this._downloadPath;
        }

        public set downloadPath(downloadPath: string) {
            this._downloadPath = downloadPath;
        }


    }


    //下载器，用于解析下载任务，同时提供批量下载
    export class downloader {

        //在debug模式下 将输出日志
        private _debug: boolean = false;

        public get debug() {
            return this._debug;
        }

        public set debug(debug: boolean) {
            this._debug = debug;
        }

        private _id: string;

        public get id() {
            return this._id;
        }

        public set id(id: string) {
            this._id = id;
        }


        private _fileSize: string = "0"; //文件总计大小

        public get fileSize() {
            return this._fileSize;
        }

        public set fileSize(fileSize: string) {
            this._fileSize = fileSize;
        }

        //下载url
        private _url: string;

        public get url() {
            return this._url;
        }

        public set url(url: string) {
            this._url = url;
        }

        //下载的平均时速
        private avgSpeed: string;

        private _block: number = 1 * 1024 * 1024; //20M 文件下载的块大小 分片下载时有效

        public get block() {
            return this._block;
        }

        public set block(block: number) {
            this._block = block;
        }

        private _downloadFiles: Array<any> = [];			  // 需要下载的文件数组

        private _fileNums: number = 0; //文件总计个数

        public get fileNums() {
            return this._fileNums;
        }

        public set fileNums(fileNums: number) {
            this._fileNums = fileNums;
        }

        //模板路径
        private _template: any;

        public get Template() {
            return this._template || ap.utility.utils.utils.GetTemplate("../../Widget/ap-wiget-download/ap-widget-download.html");
        }

        public set Template(templateUrl: any) {
            this._template = ap.utility.utils.utils.GetTemplate(templateUrl);
        }

        public downloaders: Array<ap.utility.download.downloadCore> = [];

        //上传参数
        private _data: any = [];
        public get data(): any {
            return this._data;
        }
        public set data(data: any) {
            this._data = data;
        }

        public files: any = [];

        //本地存储
        private _downloadStore: any = null;
        public get downloadStore(): any {
            return this._downloadStore;
        }
        public set downloadStore(downloadStore: any) {
            this._downloadStore = downloadStore;
        }


        private _guid: number = new Date().getTime();
        public get guid(): number {
            return this._guid;
        }
        public set guid(guid: number) {
            this._guid = guid;
        }

        private _useMomery: boolean = true;
        public get useMomery(): boolean {
            return this._useMomery;
        }

        public set useMomery(useMomery: boolean) {
            this._useMomery = useMomery;
        }


        //初始化下载器
        public start() {

            if (!this.data) {
                throw new Error("请设置上传文件参数");
            }

            if (!_.isArray(this.data)) {
                throw new Error("文件参数是一个数组");
            }

            if (!this.useMomery) {
                this.initStore(this.run.bind(this));
            } else {
                this.run(); //后续实现的内存模式
            }

        }


        //运行
        private run() {

            var files = [];

            var folderName = ".allpass"; //如果文件夹名称为空，约定为.allpass
            this.data.forEach(function (file) {

                //if (!file.fileOldName) return;

                if (file.folderName) folderName = file.folderName;

                if (!files[folderName]) files[folderName] = [];

                //过滤掉重复的文件
                files[folderName].push({
                    fileOldPath: file.fileOldPath,
                    fileOldName: file.fileOldName,
                    fileNewName: file.fileNewName,
                    filePath: file.filePath,
                    folderName: folderName,
                    downloadPath: file.downloadPath
                });

            })

            var count: number = 0;

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

                })

                var downloader: ap.utility.download.downloadCore = new ap.utility.download.downloadCore();

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
        }


        //初始化存储数据库
        private initStore(callback: (db: any) => void = null) {

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

            } else {
                callback(null);
            }

        }


        //绑定
        public Bind(id: any) {

            var self = this;

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


        public stop(index: number) {
            var downloader = this.downloaders[index];
            if (downloader) {
                downloader.stop();
            }
        }

        public restart(index: number) {
            var downloader = this.downloaders[index];
            if (downloader) {
                downloader.restart();
            }
        }

        public cancel(index: number) {
            var downloader = this.downloaders[index];
            if (downloader) {
                downloader.cancel();
            }
        }



    }


    //核心下载处理类
    export class downloadCore implements IDownload {

        constructor() {
        }

        private _index: number = 0;
        public get index(): number {
            return this._index;
        }
        public set index(index: number) {
            this._index = index;
        }

        //在debug模式下 将输出日志
        private _debug: boolean = false;

        public get debug() {
            return this._debug;
        }

        public set debug(debug: boolean) {
            this._debug = debug;
        }

        private _id: string;

        public get id() {
            return this._id;
        }

        public set id(id: string) {
            this._id = id;
        }


        private _fileSize: string = "0KB"; //文件总计大小

        public get fileSize() {
            return this._fileSize;
        }

        public set fileSize(fileSize: string) {
            this._fileSize = fileSize;
        }


        //下载url
        private _url: string;

        public get url() {
            return this._url;
        }

        public set url(url: string) {
            this._url = url;
        }

        //下载的平均时速
        private avgSpeed: string;

        private _block: number = 1 * 1024 * 1024; //1M 文件下载的块大小 分片下载时有效

        public get block() {
            return this._block;
        }

        public set block(block: number) {
            this._block = block;
        }

        //进度下载进度的数组
        private _loadedInfo: any = {
            fileName: '-', //文件名
            fileSize: 0, //文件大小
            block: this.block, //分块大小
            fileCount: 0, //文件块数
            total: 0,
            loaded: 0, //已下载字节数
            loadedTxt: '0', //已下载字节描述
            progress: 0, //下载进度
            avgSpeed: 0, //平均时速
            totalTime: '', //总耗时
            startTime: new Date(), //开始时间
            endTime: new Date() //结束时间，默认等于开始时间
        };

        public get loadedInfo() {
            return this._loadedInfo;
        }

        public set loadedInfo(loadedInfo: any) {
            this._loadedInfo = loadedInfo;
        }

        /* 样式设定*/
        private _showProgress: boolean = true; //显示文件下载按钮
        public get showProgress() {
            return this._showProgress;
        }

        public set showProgress(showProgress: boolean) {
            this._showProgress = showProgress;
        }

        public showName: string = "";

        private _data: Array<any> = [];
        public get data(): Array<any> {
            return this._data;
        }
        public set data(data: Array<any>) {
            this._data = data;
        }




        //是否压缩
        private _isZip: boolean = true;
        public get isZip(): boolean {
            return this._isZip;
        }
        public set isZip(isZip: boolean) {
            this._isZip = isZip;
        }

        //下载状态
        private _status: number = 0;
        public get status(): number {
            return this._status;
        }
        public set status(status: number) {
            this._status = status;
        }

        private _statusTxt: string = "准备下载";
        public get statusTxt(): string {
            return this._statusTxt;
        }
        public set statusTxt(statusTxt: string) {
            this._statusTxt = statusTxt;
        }


        //是否强制下载 默认是
        private _forceDownload: boolean = true;
        public get forceDownload(): boolean {
            return this._forceDownload;
        }
        public set forceDownload(forceDownload: boolean) {
            this._forceDownload = forceDownload;
        }


        //下载的路径
        private _fileOldPath: string = "";
        public get fileOldPath(): string {
            return this._fileOldPath;
        }
        public set fileOldPath(fileOldPath: string) {
            this._fileOldPath = fileOldPath;
        }

        private _fileOldName: string = "";
        public get fileOldName(): string {
            return this._fileOldName;
        }
        public set fileOldName(fileOldName: string) {
            this._fileOldName = fileOldName;
        }

        private _fileNewName: string = "";
        public get fileNewName(): string {
            return this._fileNewName;
        }
        public set fileNewName(fileNewName: string) {
            this._fileNewName = fileNewName;
        }


        private arrBlobs: any[];
        private chunkQueue: chunk[];

        private _chunkCountMethod: string = "GetChunkCount";
        public get chunkCountMethod(): string {
            return this._chunkCountMethod;
        }

        public set chunkCountMethod(chunkCountMethod: string) {
            this._chunkCountMethod = chunkCountMethod;
        }

        private _downloadMethod: string = "DownloadMultiFile";
        public get downloadMethod(): string {
            return this._downloadMethod;
        }

        public set downloadMethod(downloadMethod: string) {
            this._downloadMethod = downloadMethod;
        }


        private _downloadPath: string = "";
        public get downloadPath(): string {
            return this._downloadPath;
        }

        public set downloadPath(downloadPath: string) {
            this._downloadPath = downloadPath;
        }


        //本地存储
        private _downloadStore: any;
        public get downloadStore(): any {
            return this._downloadStore;
        }
        public set downloadStore(downloadStore: any) {
            this._downloadStore = downloadStore;
        }


        private _guid: number = new Date().getTime();
        public get guid(): number {
            return this._guid;
        }
        public set guid(guid: number) {
            this._guid = guid;
        }


        //当前请求的实例
        private _xhr: any;
        public get xhr(): any {
            return this._xhr;
        }
        public set xhr(xhr: any) {
            this._xhr = xhr;
        }

        private _calcResult: any;
        public get calcResult(): any {
            return this._calcResult;
        }
        public set calcResult(calcResult: any) {
            this._calcResult = calcResult;
        }

        private chunkCount: number;

        private _needInitStore: boolean = true;
        public get needInitStore(): boolean {
            return this._needInitStore;
        }
        public set needInitStore(needInitStore: boolean) {
            this._needInitStore = needInitStore;
        }


        private _useMomery: boolean = true;
        public get useMomery(): boolean {
            return this._useMomery;
        }

        public set useMomery(useMomery: boolean) {
            this._useMomery = useMomery;
        }

        /*
          检查文件类型和大小
          提供给外部的过滤文件格式等的接口，外部需要把过滤后的文件返回
        */
        public filterFile(files: any): any {

            var tmpFiles = [];
            return tmpFiles;

        }


        //接口方法
        public onGetChunkCount(xhr: XMLHttpRequest, that: downloader) {
            // 提供给外部获取文件切分块数
        }


        public onSelect(selectFile: any, files: any) {
            // 提供给外部获取选中的文件，供外部实现预览等功能  selectFile:当前选中的文件  allFiles:还没下载的全部文件
        }

        public onDelete(file: any, files: any) {
            // 提供给外部获取删除的单个文件，供外部实现删除效果  file:当前删除的文件  files:删除之后的文件
        }

        public onProgress(file: any, loaded: number, total: number) {
            // 提供给外部获取单个文件的下载进度，供外部实现下载进度效果
        }

        public onSuccess(file: any) {
            // 提供给外部获取单个文件下载成功，供外部实现成功效果
        }

        public onError(responseInfo: any) {
            // 提供给外部获取单个文件下载失败，供外部实现失败效果
        }

        public onComplete(responseInfo: any) {
            // 提供给外部获取全部文件下载完成，供外部实现完成效果
        }

        public onAbort(file: any) {
            // 提供给外部获取全部文件下载完成，供外部实现完成效果
        }

        public onCancel(file: any) {
            // 提供给外部获取全部文件下载完成，供外部实现完成效果
        }

        public onFilterFile(files: any) {
            //提供给外部过滤文件的接口
            return files;
        }


        public onSaveUrl(url: any) {
            //提供给外部文件的接口, 处理下载后的url

        }

        public onSaveBlob(url: any) {
            //提供给外部文件的接口, 处理下载后的url

        }



        //模板路径
        private _template: any;

        public get Template() {
            return this._template || ap.utility.utils.utils.GetTemplate("../download/ap_widget_downloadCore.html");
        }

        public set Template(templateUrl: any) {
            this._template = ap.utility.utils.utils.GetTemplate(templateUrl);
        }

        //绑定
        public Bind(id: any) {

            var self = this;

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


        //初始化存储数据库
        private initStore(callback: (db: any) => void = null) {

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

        //开始下载--测试方法
        public start(): void {

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
            } else {
                //alert('1');
                this.getChunkCount();
            }

        }


        private saveBlob(id, fileName, blob) {
            this.downloadStore.useStore(this.guid);
            this.downloadStore.set({ id: id, fileName: fileName, guid: this.guid, blob: blob });
        }


        //取得文件块数
        private getChunkCount(): void {

            //设置状态--计算分块
            if (this.data && this.data.length > 1) {
                this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_CALC);
            } else {
                this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_PACK);
            }

            var that = this;

            var params: string = '';

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


            var xhr: XMLHttpRequest = new XMLHttpRequest();
            if (!(<any>_).endsWith(this.url, '/')) this.url = this.url + '/';


            xhr.open("POST", this.url + this.chunkCountMethod, true);
            //contentType: "application/json; charset=utf-8"
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = function () {
                that.onChunkCountRecieved(<any>this, <any>that);
            };

            xhr.addEventListener("error", function (e) {
                this.onError(e.target.responseText);
            }.bind(this), false);

            xhr.send(params);

            this.xhr = xhr;

        }

        //逐块下载
        private downloadChunks(chunkCount: number, fileOldName: string, fileNewName: string, filePath: string): void {

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

        }

        //下载下一块
        private downloadNextChunk(): void {

            if (this.chunkQueue.length > 0) {

                var nextChunk: chunk = this.chunkQueue.shift();

                if (this.useMomery) {
                    this.downloadChunk(nextChunk); //内存模式
                } else {
                    this.downloadStore.useStore(this.guid);
                    //检查已下载的分块
                    this.downloadStore.get(nextChunk.chunkNumber, function (data) {
                        //data是blob数据
                        if (!data) {
                            this.downloadChunk(nextChunk);
                        } else {
                            if (this.debug) {
                                this.logPage(data.fileName + ' 第' + data.id + '分块已上传');
                            }
                            this.updateProgress({ loaded: data.blob.size });
                            this.downloadNextChunk();
                        }
                    }.bind(this));
                }


            } else {
                this.chunkQueue = null;
                this.onAllChunksDownloaded();
            }

        }


        //发起请求，下载文件
        private downloadChunk(chunk: chunk): void {

            var that = this;

            var params: string = JSON.stringify({
                data: JSON.stringify({
                    fileOldName: chunk.fileOldName,
                    fileNewName: chunk.fileNewName, //打包后的文件同名
                    folderName: '',
                    filePath: chunk.filePath,
                    downloadPath: chunk.downloadPath,
                    forceDownload: true
                }),
            });

            //this.fileGuidParamName + "=" + chunk.fileName + "&" + this.chunkParamName + "=" + chunk.chunkNumber;

            var xhr: XMLHttpRequest = new XMLHttpRequest();

            if (!(<any>_).endsWith(this.url, '/')) this.url = this.url + '/';
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
                that.onChunkDownloaded(<any>this, chunk);
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

        }

        //下载错误
        private _wholeError(e: any, chunk: any) {

            this.setStatus(DownloadStatus.DOWNLOAD_STATE_ERROR);
            if (this.debug) this.logConsole(this.showName + " 下载异常，服务器返回消息:" + e.target.responseText);
            this.onError(e.target.responseText);

        }

        //下载暂停
        private _wholeAbort(chunk: any) {
            //alert('暂停');
            this.setStatus(DownloadStatus.DOWNLOAD_STATE_ABORT);
            this.onAbort(chunk);
        }


        //更新进度
        private updateProgress(event) {

            this.loadedInfo.loaded += event.loaded;
            var loaded = this.loadedInfo.loaded;
            var total = this.loadedInfo.fileSize;

            var percentComplete = 0;
            if (event.lengthComputable) {
                total = event.total;
                percentComplete = (Number)((loaded / event.total * 100).toFixed());
                //this.logConsole(percentComplete.toString());

            } else {

                percentComplete = (Number)((loaded / total * 100).toFixed());
                //this.logConsole(percentComplete.toString());
            }

            if (percentComplete > 100) percentComplete = 100;

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

        }


        //接受文件块数信息
        private onChunkCountRecieved(xhr: XMLHttpRequest, that: downloader): void {

            var result = JSON.parse(JSON.parse(xhr.responseText)); //json 包装string
            if (result.isSuccess) {
                this.run(result);
            } else {
                this.onError(result);
            }
        }


        private run(result: any) {
            if (result.isSuccess) {

                this.calcResult = result;


                this.loadedInfo = {
                    fileOldName: result.fileOldName, //原文件名
                    fileNewName: result.fileNewName,  //新文件名
                    fileSize: result.fileSize, //文件大小
                    filePath: result.filePath,
                    block: result.block, //分块大小
                    fileCount: result.fileCount, //文件块数
                    total: 0,
                    loaded: 0, //已下载字节数
                    loadedTxt: '', //已下载字节描述
                    progress: 0, //下载进度
                    avgSpeed: 0, //平均时速
                    totalTime: '', //总耗时
                    startTime: new Date(), //开始时间
                    endTime: new Date() //结束时间，默认等于开始时间
                };


                this.fileOldName = result.fileOldName;
                this.fileNewName = result.fileNewName;
                this.downloadPath = result.downloadPath;
                this.chunkCount = parseInt(result.fileCount);

                //下载中
                this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_PROCESSING);

                this.downloadChunks(this.chunkCount, result.fileOldName, result.fileNewName, result.filePath);

            } else {
                this.logPage(result.message);
            }
        }


        //文件块下载完成后事件
        private onChunkDownloaded(xhr: XMLHttpRequest, downloadedChunk: chunk): void {

            if (this.status === DownloadStatus.DOWNLOAD_STATE_ABORT) {
                return;
            }

            //保存到本地存储
            if (!this.useMomery) {
                this.saveBlob(downloadedChunk.chunkNumber, downloadedChunk.fileName, xhr.response);
            } else {
                this.arrBlobs.push(xhr.response);
            }

            this.updateProgress({ loaded: xhr.response.size });

            if (this.chunkQueue.length === 0) {
                this.onAllChunksDownloaded();
            } else {
                this.downloadNextChunk();
            }

            xhr = null;
        }


        //所有文件块下载完成后事件
        private onAllChunksDownloaded(): void {

            this.setStatus(DownloadStatus.DOWNLOAD_STATE_COMBINE);

            //合并块文件
            if (!this.useMomery) {
                //根据索引取得所有数据
                this.downloadStore.getAllByCursor(function (data) {
                    //this.downloadStore.getAllByIndex('guid', function (data) {

                    _.sortBy(data, ['id']);

                    data.forEach(function (item) {
                        this.arrBlobs.push(item.blob);
                    }.bind(this))

                    this.combineBlobAndSave();
                    this.downloadStore.deleteStore(this.guid);

                }.bind(this));
            } else {
                this.combineBlobAndSave();
            }

        }

        //合并块文件，提交保存
        private combineBlobAndSave() {
            var finalBlob: Blob = new Blob(this.arrBlobs, { type: this.arrBlobs[0].type });

            if (this.forceDownload) {
                this.saveAs(finalBlob, this.fileNewName);
            } else {
                this.openResource(finalBlob);
            }

            this.arrBlobs = null;
            //外部回调接口
            this.onSuccess(finalBlob);

            //下载完成
            this.setStatus(ap.utility.download.DownloadStatus.DOWNLOAD_STATE_COMPLETE);
        }


        //暂停
        public stop() {

            if (this.xhr) {
                this.xhr.abort();
            }

            this.chunkQueue = []; //清空上传队列

            if (this.status === DownloadStatus.DOWNLOAD_STATE_PROCESSING) {
                this.setStatus(DownloadStatus.DOWNLOAD_STATE_ABORT);
            }

        }

        //重新开始
        public restart() {

            //this.initStore();
            //不需要重新计算分块
            if (this.calcResult) {
                this.run(this.calcResult);
            } else {
                this.start();
            }
        }


        //取消
        public cancel() {
            this.stop();

            try {
                if (!this.useMomery) {
                    this.downloadStore.deleteStore(this.guid);
                }
            } catch (e) {
                //alert('出错了');
            }

            this.setStatus(DownloadStatus.DOWNLOAD_STATE_CANCEL);
        }

        /*
        弹出对话框保存
        1.Chrome需要配置弹出对话框
        2.firefox a标签的下载不生效
        //兼容处理
        //http://stackoverflow.com/questions/30694453/blob-createobjecturl-download-not-working-in-firefox-but-works-when-debugging

        */
        private saveAs(blob, fileName) {
            var URL = window.URL || window.webkitURL || window;
            var type = blob.type;
            var force_saveable_type = 'application/octet-stream';
            if (type && type != force_saveable_type) { // 强制下载，而非在浏览器中打开
                var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
            }


            var url = URL.createObjectURL(blob);
            var save_link = document.createElement('a');
            save_link.style.display = "none";
            save_link.href = url;
            (<any>save_link).download = fileName;

            //兼容ie处理
            if (window.navigator.msSaveOrOpenBlob) {
                save_link.onclick = function () {
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                }
             }

            document.body.appendChild(save_link);
            //this.fireClick(save_link);

            save_link.click();

            setTimeout(function () {
                document.body.removeChild(save_link);
                URL.revokeObjectURL(url);
            }, 100);

        }



        private openResource(blob) {
            var URL = window.URL || window.webkitURL || window;
            var type = blob.type;
            var force_saveable_type = 'application/octet-stream';
            if (type && type != force_saveable_type) { // 强制下载，而非在浏览器中打开
                var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
            }

            this.onSaveBlob(blob);

            var url = URL.createObjectURL(blob);

            this.onSaveUrl(url);

        }


        //设置下载状态
        private setStatus(status: number) {
            this.status = status;
            this.statusTxt = this.getDownloadStatusText(status);
        }


        //获取上传状态说明
        private getDownloadStatusText(status: number): string {

            switch (status) {
                case DownloadStatus.DOWNLOAD_STATE_READY:
                    return "准备下载";              //任务已添加,准备下载
                case DownloadStatus.DOWNLOAD_STATE_PACK:              //正在打包
                    return "正在打包";
                case DownloadStatus.DOWNLOAD_STATE_CALC: //正在计算分块
                    return "正在打包，计算分块";
                case DownloadStatus.DOWNLOAD_STATE_PROCESSING:         //任务下载中
                    return "下载中";
                case DownloadStatus.DOWNLOAD_STATE_COMBINE:         //任务下载中
                    return "合并文件";
                case DownloadStatus.DOWNLOAD_STATE_COMPLETE:           //任务下载完成
                    return "下载完成";
                case DownloadStatus.DOWNLOAD_STATE_ABORT:              //任务暂停
                    return "已暂停";
                case DownloadStatus.DOWNLOAD_STATE_CANCEL:            //任务已取消
                    return "已取消";
                case DownloadStatus.DOWNLOAD_STATE_ERROR:            //任务已失败
                    return "已失败";
            }

            return "未知状态";

        }

        //在页面写日志
        private logPage(message: string) {
            if (this.debug) {
                ap.utility.utils.utils.Log(message);
            }
        }
        
        //在控制台写日志
        private logConsole(message: string) {
            console.log(message);
        }

        //在控制台抛异常
        private logError(message: string) {
            throw new Error(message);
        }


        //触发事件
        private fireEvent(obj: any, type: any, response: any) {
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
        }

        private fireClick(el) {
            var evt;
            if (document.createEvent) { // DOM Level 2 standard  
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window,
                    0, 0, 0, 0, 0, false, false, false, false, 0, null);

                el.dispatchEvent(evt);
            } else if (el.fireEvent) { // IE  
                el.fireEvent('onclick');
            }
        }

    }

}