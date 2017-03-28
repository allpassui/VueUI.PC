/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      yqj
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       pc端浏览器-上传封装
**-----------------------------------------------------------------
******************************************************************/
namespace ap.utility.upload {

    /*上传状态枚举*/
    export enum UploadStatus {
        UPLOAD_STATE_READY = 0,              //任务已添加,准备上传
        UPLOAD_STATE_PROCESSING= 1,          //普通任务上传中
        UPLOAD_STATE_COMPLETE = 2,           //任务上传完成
        UPLOAD_STATE_ABORT = -1,              //任务暂停
        UPLOAD_STATE_CANCEL = -2,            //任务已取消
        UPLOAD_STATE_ERROR = -3,             //任务已失败
    }

    /*块的上传状态枚举*/
    export enum BlockStatus {
        STATUS_NOUPLOAD = 0,              //块 未上传
        STATUS_UPLOADED = 1,         //块 上传中
        STATUS_PAUSE = -1,              //暂停
        STATUS_CANCEL = -2,              //暂停
        STATUS_ERROR = -3,            //出错
    }


    //上传接口
    export interface IUpload {
        debug: boolean; //debug模式将输出上传日志
        id: string;
        width: string; //父容器的宽
        height: string; //父容器的高
        itemWidth: string; //上传按钮的宽
        itemHeight: string; //上传按钮的高
        url: string; //上传地址
        multiple: boolean; //是否允许多文件上传
        auto: boolean; //是否自动上传
        finishDel: boolean; //上传完是否删除
        fileNums: number; //文件总计个数
        fileSize: string; //文件总计大小
        loaded: Array<any>; //文件上传进度数组
        maxSize: number; //文件上传的大小限制
        block: number; //文件上传的块大小 分片上传时有效
        allows: string; //文件允许上传的后缀名
        path: string; //文件上传的相对路径
        images: Array<UploadImageInfo>; //上传的文件中所有图片的信息

        /* 样式设定*/
        showUploadBtn: boolean; //显示文件上传按钮
        showDragArea: boolean; //显示文件拖拽区域
        showFootBar: boolean; //显示底部工具栏
        showFileList: boolean; //显示文件列表
        showPauseBtn: boolean;//显示暂停按钮
        showContinueBtn: boolean;//显示继续按钮
        showCancelBtn: boolean; //显示取消按钮
        showRemoveBtn: boolean;//显示删除按钮
        showProgress: boolean;

        containerClass: string; //外部容器样式
        filePickerClass: string; //选择文件按钮样式
        dragAreaClass: string; //拖拽地区的样式
        footBarClass: string; //底部工具栏样式
        uploadBtnClass: string;//上传按钮的样式
        fileListClass: string; //文件列表的样式
        pauseBtnClass: string; //暂停按钮的样式
        continueBtnClass: string;//继续按钮的样式
        cancelBtnClass: string; //取消按钮的样式
        removeBtnClass: string; //删除按钮的样式
        progressClass: string; //进度条的样式

        loadImage(domId: string, src: any); //加载图片显示缩略图
        clearImage(domId: string); //清除加载图片
        filterFile(files: any): any;//过滤文件
        onClick(files: any): boolean; //点击选择事件
        onFilterFile(files: any): any; //供给外部的过滤文件格式等的接口，外部需要把过滤后的文件返回
        onSelect(selectFile: any, files: any);      // 提供给外部获取选中的文件，供外部实现预览等功能  selectFile:当前选中的文件  allFiles:还没上传的全部文件
        onDelete(file: any, files: any);            // 提供给外部获取删除的单个文件，供外部实现删除效果  file:当前删除的文件  files:删除之后的文件
        onProgress(file: any, loaded: any, total: any); // 提供给外部获取单个文件的上传进度，供外部实现上传进度效果
        onSuccess(file: any, responseInfo: any);   // 提供给外部获取单个文件上传成功，供外部实现成功效果
        onFailure(file: any, responseInfo: any);    // 提供给外部获取单个文件上传失败，供外部实现失败效果
        onComplete(responseInfo: any);         // 提供给外部获取全部文件上传完成，供外部实现完成效果
        onAbort(file: any); //暂停
        onCancel(file: any); //取消
        Bind(id: string): void; //绑定操作
        Template: string;      //模板

    }


    //图片信息
    export class UploadImageInfo {

        private _index: number = 0;
        private _name: string = '';
        private _size: number = 0;
        private _ext: string = '';
        private _width: number = 0;
        private _height: number = 0;

        constructor() {

        }

        public get index(): number {
            return this._index;
        }

        public set index(index: number) {
            this._index = index;
        }


        public get name(): string {
            return this._name;
        }

        public set name(name: string) {
            this._name = name;
        }

        public get size(): number {
            return this._size;
        }

        public set size(size: number) {
            this._size = size;
        }

        public get ext(): string {
            return this._ext;
        }

        public set ext(ext: string) {
            this._ext = ext;
        }

        public get width(): number {
            return this._width;
        }

        public set width(width: number) {
            this._width = width;
        }

        public get height(): number {
            return this._height;
        }

        public set height(height: number) {
            this._height = height;
        }



    }

    export class uploader implements IUpload {

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

        private _id: string;

        public get id() {
            return this._id;
        }

        public set id(id: string) {
            this._id = id;
        }


        //父容器的宽
        private _width: string = "700px";

        public get width() {
            return this._width;
        }

        public set width(width: string) {
            this._width = width;
        }

        //父容器的高
        private _height: string = "400px";

        public get height() {
            return this._height;
        }

        public set height(height: string) {
            this._height = height;
        }

        //上传按钮的宽
        private _itemWidth: string = "100px";

        public get itemWidth() {
            return this._itemWidth;
        }

        public set itemWidth(itemWidth: string) {
            this._itemWidth = itemWidth;
        }

        //上传按钮的高
        private _itemHeight: string = "44px";

        public get itemHeight() {
            return this.itemHeight;
        }

        public set itemHeight(itemHeight: string) {
            this._itemHeight = itemHeight;
        }


        private _fileNums: number = 0; //文件总计个数

        public get fileNums() {
            return this._fileNums;
        }

        public set fileNums(fileNums: number) {
            this._fileNums = fileNums;
        }

        private _fileSize: string = "0KB"; //文件总计大小

        public get fileSize() {
            return this._fileSize;
        }

        public set fileSize(fileSize: string) {
            this._fileSize = fileSize;
        }


        //是否允许多文件上传
        private _multiple: boolean = false;

        public get multiple() {
            return this._multiple;
        }

        public set multiple(mutiple: boolean) {
            this._multiple = mutiple;
        }


        //是否上传完删除文件
        private _finishDel: boolean = false;

        public get finishDel() {
            return this._finishDel;
        }

        public set finishDel(finishDel: boolean) {
            this._finishDel = finishDel;
        }

        //上传url
        private _url: string;

        public get url() {
            return this._url;
        }

        public set url(url: string) {
            this._url = url;
        }


        private _path: string = '';

        public get path() {
            return this._path;
        }

        public set path(path: string) {
            this._path = path;
        }

        //是否自动上传
        private _auto: boolean = false;
        public get auto() {
            return this._auto;
        }
        public set auto(auto: boolean) {
            this._auto = auto;
        }

        //上传的平均时速
        private avgSpeed: string;

        private _maxSize: number = 500 * 1024 * 1024; //文件上传的最大尺寸

        public get maxSize() {
            return this._maxSize;
        }

        public set maxSize(maxSize: number) {
            this._maxSize = maxSize;
        }

        private _block: number = 20 * 1024 * 1024; //20M 文件上传的块大小 分片上传时有效

        public get block() {
            return this._block;
        }

        public set block(block: number) {
            this._block = block;
        }

        private _allows: any; //文件允许上传的后缀名

        public get allows() {
            return this._allows;
        }

        public set allows(allows: any) {
            this._allows = allows;
        }


        private _uploadFile: Array<any> = [];			  // 需要上传的文件数组

        public get UploadFile() {
            return this._uploadFile;
        }

        public set UploadFile(file: Array<any>) {
            this._uploadFile = file;
        }

        private lastUploadFile: Array<any> = [];          // 上一次选择的文件数组，方便继续上传使用
        private perUploadFile: Array<any> = [];          // 存放永久的文件数组，方便删除使用
        /* 提供给外部的接口 */

        //模板路径
        private _template: any;

        public get Template() {
            return this._template || this.getTemplate("../../Widget/ap-widget-upload/ap-widget-upload.html");
        }

        public set Template(templateUrl: any) {
            if (templateUrl.indexOf("/") == -1) {
                templateUrl = "../../Widget/ap-widget-upload/" + templateUrl;
            }
            this._template = this.getTemplate(templateUrl);
        }

        //进度上传进度的数组
        private _loaded: any = [];

        public get loaded() {
            return this._loaded;
        }

        public set loaded(loaded: Array<any>) {
            this._loaded = loaded;
        }

        //上传的图片数组
        public images: Array<ap.utility.upload.UploadImageInfo> = [];


        /* 样式设定*/
        private _showProgress: boolean = false;
        public get showProgress() {
            return this._showProgress;
        }

        public set showProgress(showProgress: boolean) {
            this._showProgress = showProgress;
        }

        private _showUploadBtn: boolean = true; //显示文件上传按钮
        public get showUploadBtn() {
            return this._showUploadBtn;
        }

        public set showUploadBtn(showUploadBtn: boolean) {
            this._showUploadBtn = showUploadBtn;
        }

        private _showDragArea: boolean = true; //显示文件拖拽区域
        public get showDragArea() {
            return this._showDragArea;
        }

        public set showDragArea(showDragArea: boolean) {
            this._showDragArea = showDragArea;
        }

        private _showFootBar: boolean = true; //显示底部工具栏
        public get showFootBar() {
            return this._showFootBar;
        }

        public set showFootBar(showFootBar: boolean) {
            this._showFootBar = showFootBar;
        }

        private _showFileList: boolean = true; //显示文件列表
        public get showFileList() {
            return this._showFileList;
        }

        public set showFileList(showFileList: boolean) {
            this._showFileList = showFileList;
        }

        private _showPauseBtn: boolean = true;//显示暂停按钮
        public get showPauseBtn() {
            return this._showPauseBtn;
        }

        public set showPauseBtn(showPauseBtn: boolean) {
            this._showPauseBtn = showPauseBtn;
        }

        private _showContinueBtn: boolean = true;//显示继续按钮
        public get showContinueBtn() {
            return this._showContinueBtn;
        }

        public set showContinueBtn(showContinueBtn: boolean) {
            this._showContinueBtn = showContinueBtn;
        }

        private _showCancelBtn: boolean = true; //显示取消按钮
        public get showCancelBtn() {
            return this._showCancelBtn;
        }

        public set showCancelBtn(showCancelBtn: boolean) {
            this._showCancelBtn = showCancelBtn;
        }

        _showRemoveBtn: boolean;//显示删除按钮
        public get showRemoveBtn() {
            return this._showRemoveBtn;
        }

        public set showRemoveBtn(showRemoveBtn: boolean) {
            this._showRemoveBtn = showRemoveBtn;
        }

        private _containerClass: string; //外部容器样式
        public get containerClass() {
            return this._containerClass;
        }

        public set containerClass(containerClass: string) {
            this._containerClass = containerClass;
        }

        private _filePickerClass: string; //选择文件按钮样式
        public get filePickerClass() {
            return this._filePickerClass;
        }

        public set filePickerClass(filePickerClass: string) {
            this._filePickerClass = filePickerClass;
        }

        private _dragAreaClass: string; //拖拽地区的样式
        public get dragAreaClass() {
            return this._dragAreaClass;
        }

        public set dragAreaClass(dragAreaClass: string) {
            this._dragAreaClass = dragAreaClass;
        }


        private _footBarClass: string; //底部工具栏样式
        public get footBarClass() {
            return this._footBarClass;
        }

        public set footBarClass(footBarClass: string) {
            this._footBarClass = footBarClass;
        }

        private _uploadBtnClass: string;//上传按钮的样式
        public get uploadBtnClass() {
            return this._uploadBtnClass;
        }

        public set uploadBtnClass(uploadBtnClass: string) {
            this._uploadBtnClass = uploadBtnClass;
        }

        private _fileListClass: string; //文件列表的样式
        public get fileListClass() {
            return this._fileListClass;
        }

        public set fileListClass(fileListClass: string) {
            this._fileListClass = fileListClass;
        }


        private _pauseBtnClass: string; //暂停按钮的样式
        public get pauseBtnClass() {
            return this._pauseBtnClass;
        }

        public set pauseBtnClass(pauseBtnClass: string) {
            this._pauseBtnClass = pauseBtnClass;
        }

        private _continueBtnClass: string;//继续按钮的样式
        public get continueBtnClass() {
            return this._continueBtnClass;
        }

        public set continueBtnClass(continueBtnClass: string) {
            this._continueBtnClass = continueBtnClass;
        }

        private _cancelBtnClass: string; //取消按钮的样式
        public get cancelBtnClass() {
            return this._cancelBtnClass;
        }

        public set cancelBtnClass(cancelBtnClass: string) {
            this._cancelBtnClass = cancelBtnClass;
        }

        private _removeBtnClass: string; //删除按钮的样式
        public get removeBtnClass() {
            return this._removeBtnClass;
        }

        public set removeBtnClass(removeBtnClass: string) {
            this._removeBtnClass = removeBtnClass;
        }

        private _progressClass: string; //进度条的样式
        public get progressClass() {
            return this._progressClass;
        }

        public set progressClass(progressClass: string) {
            this._progressClass = progressClass;
        }


        private _xhr: any;
        public get xhr(): any {
            return this._xhr;
        }

        public set xhr(xhr: any) {
            this._xhr = xhr;
        }


        //允许上传的文件键值对
        private allowFileExtensions: any = [];
        private filter: string; //配置项的后缀转成拼接后的mime

        //服务器端报错的文件索引
        private serverErrorFileIndexs: any = [];

        //图片最大高度
        private static MAX_HEIGHT: number = 100;


        //绑定
        public Bind(id: any) {

            //初始化文件后缀mime类型
            this.initAllowExtensions();

            this.id = id;
            this.filter = this.change2MIME();

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

        /*
          检查文件类型和大小
          提供给外部的过滤文件格式等的接口，外部需要把过滤后的文件返回
        */
        public filterFile(files: any): any {

            var tmpFiles = [];
            _.forEach(files, function (item: any) {

                var check: boolean = false;

                //文件类型
                var type = item.name.slice(item.name.lastIndexOf('.') + 1) || item.type.slice(item.type.lastIndexOf('/') + 1);
                if (type) type = type.toLocaleLowerCase();
                if (this.allows) {

                    if (_.isArray(this.allows)) {

                        var check: boolean = false;
                        var checkSize = 0;
                        //先判断满足某一个后缀
                        for (var index in this.allows) {
                            var allow = this.allows[index];
                            var checkExt = allow.ext;
                            var size = allow.size;
                            if (!_.contains(checkExt, "*.*")) {
                                if (checkExt.toLocaleLowerCase().indexOf(type) !== -1) {
                                    check = true;
                                    checkSize = size;
                                }
                            }
                        }

                        if (!check) {
                            var message = {
                                id: 1,
                                message: "不允许上传后缀名为" + type + "的文件!"
                            };
                            this.onFilterFile(message);
                            return;
                        }

                        //文件体积
                        if (item.size > checkSize) {

                            var message = {
                                id: 2,
                                //message: "上传的文件[" + item.name + "]大小" + this.bytesToSize(item.size) + "超出限制" + this.bytesToSize(checkSize) + "!"
                                message: "文件超出限制"
                            };

                            this.onFilterFile(message);
                            check = false;
                        }

                        //其他处理

                        //检查通过
                        if (check) tmpFiles.push(item);



                    } else {

                        var check: boolean = true;

                        var checkExt = this.allows;
                        var size = this.maxSize;
                        if (!_.contains(checkExt, "*.*")) {
                            if (this.allows.toLocaleLowerCase().indexOf(type) === -1) {
                                this.onFilterFile({
                                    id: 1,
                                    message: "不允许上传后缀名为" + type + "的文件!"
                                });
                                check = false;
                            }
                        }

                        if (check) {
                            //文件体积
                            if (item.size > size) {
                                this.onFilterFile({
                                    id: 2,
                                    //message: "上传的文件[" + item.name + "]大小" + this.bytesToSize(item.size) + "超出限制" + this.bytesToSize(this.maxSize) + "!"
                                    message: "文件超出限制"
                                });
                                check = false;
                            }
                        }


                        if (check) tmpFiles.push(item);

                    }


                }


            }.bind(this))

            //tmpFiles = this.onFilterFile(tmpFiles);

            return tmpFiles;

        }


        public onClick(files: any): boolean {
            // 提供给外部获取选中的文件，供外部实现预览等功能
            return true;
        }

        //接口方法
        public onSelect(selectFile: any, files: any) {
            // 提供给外部获取选中的文件，供外部实现预览等功能  selectFile:当前选中的文件  allFiles:还没上传的全部文件
        }

        public onDelete(file: any, files: any) {
            // 提供给外部获取删除的单个文件，供外部实现删除效果  file:当前删除的文件  files:删除之后的文件
        }

        public onProgress(file: any, loaded: number, total: number) {
            // 提供给外部获取单个文件的上传进度，供外部实现上传进度效果
        }

        public onSuccess(file: any, responseInfo: any) {
            // 提供给外部获取单个文件上传成功，供外部实现成功效果
        }

        public onFailure(file: any, responseInfo: any) {
            // 提供给外部获取单个文件上传失败，供外部实现失败效果
        }

        public onComplete(responseInfo: any) {
            // 提供给外部获取全部文件上传完成，供外部实现完成效果
        }

        public onAbort(file: any) {
            // 提供给外部获取全部文件上传完成，供外部实现完成效果
        }

        public onCancel(file: any) {
            // 提供给外部获取全部文件上传完成，供外部实现完成效果
        }

        public onFilterFile(message: any) {
            //提供给外部过滤文件的接口

        }


        //模拟点击input[file]控件，一般情况下input是隐藏的
        private inputClick() {
            //var self=this;
            if (!this.id) throw "请先调用bind";
            var input: any = document.querySelector('#ImgUpload'  + ' input[type="file"]');
            if (!input) return;

            if (this.debug) {
                var debugDiv: HTMLDivElement = <HTMLDivElement>document.querySelector('#log');
                if (debugDiv) debugDiv.innerHTML = '';
            }

            input.click();
        }

        //清空上传控件
        private clearInput() {
            var input: any = document.querySelector('#ImgUpload' + ' input[type="file"]');
            //input.select(); 
            //input.outerHTML = input.outerHTML;
            //input.onchange = this.getFiles;
            input.value = ''; //必须清空上传控件的值，否则选择同一个文件，不会触发change事件
        }


        ////处理文件拖拽的光标问题
        private dragHover(e) {
            e.stopPropagation();
            e.preventDefault();
            this[e.type === "dragover" ? "dragOver" : "dragLeave"].call(e.target);
            return this;
        }


        // 获取文件
        private getFiles(e: any) {

            // 从事件中获取选中的所有文件
            var files = e.target.files || e.dataTransfer.files;

            if (files.length == 0) {
                return;
            }

            //触发onclick事件
            if (!this.onClick(files)) {
                return false;
            }

            //处理
            //this.dragHover(e);


            if (this.UploadFile) this.lastUploadFile = this.UploadFile;


            this.UploadFile = this.filterFile(files);
            this.loaded = [];
            this.fileNums = 0;

            var tmpFiles = [];


            var lArr = [];  // 之前文件的名称数组
            var uArr = [];  // 现在文件的名称数组

            //之前上传的数据
            //if (this.multiple) {
            //    _.forEach(this.lastUploadFile, function (k: any, v: any) {
            //        lArr.push(k.name);
            //    });
            //}

            //本次上传的数据
            _.forEach(this.UploadFile, function (k: any, v: any) {
                uArr.push(k.name);
            });

            _.forEach(uArr, function (k: any, v: any) {
                // 获得当前选择的每一个文件   判断当前这一个文件是否存在于之前的文件当中
                //if (!_.contains(lArr, k)) {  // 不存在
                tmpFiles.push(this.UploadFile[v]);
                //}
            }.bind(this));

            // 如果tmpFiles进行过过滤上一次选择的文件的操作，需要把过滤后的文件赋值
            this.UploadFile = tmpFiles;

            // 调用对文件处理的方法
            this.dealtFiles();

            //统计文件信息
            this.getFilesInfo();

            //自动上传
            if (this.auto) this.UploadFiles();

            this.clearInput();

            return true;
        }




        // 处理过滤后的文件，给每个文件设置下标
        private dealtFiles() {

            // 目前是遍历所有的文件，给每个文件增加唯一索引值
            _.forEach(this.UploadFile, function (k: any, v: any) {
                // 因为涉及到继续添加，所以下一次添加需要在总个数的基础上添加
                k.index = this.fileNums;
                k.progress = 0;
                // 添加一个之后自增
                this.fileNums++;

                //文件信息
                var fileinfo = {
                    file: k,
                    name: k.name, //文件名
                    index: k.index, //索引
                    loaded: 0,   //本次上传
                    preLoaded: 0, //已上传大小
                    total: 0,    //总计大小
                    progress: 0, //进度
                    avgSpeed: 0, //平均时速
                    totalTime: "", //总计耗时
                    startTime: "", //开始时间
                    endTime: "", //结束时间
                    remainingTime: "",//预计剩余时间--暂不处理
                    startStatus: -2,//按钮状态--初始状态是未上传
                    status: UploadStatus.UPLOAD_STATE_READY, //状态是request反馈的
                    statusName: this.getUploadStatusText(UploadStatus.UPLOAD_STATE_READY), //状态名称
                    xhr: {},//request实例
                    needSplit: false, //需要分片上传
                };

                //分块上传初始化检查
                fileinfo = this.blockUploadInit(fileinfo);

                this.loaded.push(fileinfo);

                //对于图片的特殊处理
                var info = new ap.utility.upload.UploadImageInfo();
                info.index = k.index;
                info.name = k.name;
                info.size = k.size;
                this.getImageInfo(k, info);


            }.bind(this));

            // 先把当前选中的文件保存备份
            var selectFile = this.UploadFile;
            // 要把全部的文件都保存下来，因为删除所使用的下标是全局的变量
            //this.perUploadFile = this.perUploadFile.concat(this.UploadFile);
            // 合并下上传的文件
            //this.UploadFile = this.lastUploadFile.concat(this.UploadFile);

            // 执行选择回调
            this.onSelect(selectFile, this.UploadFile);

            return this;
        }


        // 上传后删除文件，取决于配置finishDel
        private deleteFile(delFileIndex: number, isCb: boolean) {

            var tmpFile = [];  // 用来替换的文件数组
            // 合并下上传的文件
            var delFile = this.UploadFile[delFileIndex];

            // 目前是遍历所有的文件，对比每个文件  删除
            var index = 0;
            _.forEach(this.UploadFile, function (k, v) {
                if (delFile != k) {
                    k.index = index;
                    // 如果不是删除的那个文件 就放到临时数组中
                    tmpFile.push(k);

                    index++;

                } else {

                    //delete(this.loaded[k.index]);
                    this.loaded.splice(k.index, 1); //删除
                    index = k.index;
                    //重排索引
                    this.sortIndex(k.index);

                }

            }.bind(this));

            this.UploadFile = tmpFile;
            this.fileNums = this.UploadFile.length;

            if (isCb) {  // 执行回调
                // 回调删除方法，供外部进行删除效果的实现
                this.onDelete(delFile, this.UploadFile);
            }

            return true;
        }


        private sortIndex(index) {
            _.forEach(this.loaded, function (item) {
                if (item.index > index) {
                    item.index--;
                    item.file.index--;
                }
            })
        }


        // 批量上传文件
        public UploadFiles() {

            //if(this.UploadFile.length>0) this.showProgress = true;

            //// 遍历所有文件  ，在调用单个文件上传的方法
            _.forEach(this.loaded, function (k, v) {

                if (k.needSplit) {
                    this.blockUpload(k);  //分块上传
                } else {
                    this.upload(k);
                }

            }.bind(this));
        }


        // 上传单个个文件
        private upload(fileData: any) {


            var file = fileData.file;

            if (!this.url || this.url === '') {
                throw "缺少Url地址";
            }

            //正在上传的文件 和 已完成的文件 不处理
            if (this.loaded[file.index].status !== UploadStatus.UPLOAD_STATE_READY) {
                return;
            }

            this.showProgress = true;

            //点击重新上传时，置进度相关数据为0
            this.resetFileInfo(file.index);

            //上传文件对象
            var fileData: any = {};
            fileData.file = file;
            fileData.xhr = {};
            fileData.progress = function (fileData, e) {
                this.calcFileInfo(file.index, e.loaded, e.total);
            };

            fileData.load = function (fileData, e) {

                if (this.finishDel) {
                    // 从文件中删除上传成功的文件  false是不执行onDelete回调方法
                    this.deleteFile(file.index, false);

                    if (this.UploadFile.length == 0) {
                        // 回调全部完成方法
                        this.onComplete("全部完成");
                    }
                } else {
                    var isAllComplete = true;

                    //判断数组中每个文件的状态--非传输中
                    _.forEach(this.loaded, function (item: any) {
                        if (item.Status == UploadStatus.UPLOAD_STATE_PROCESSING) {
                            isAllComplete = false;
                        }
                    }.bind(this))

                    if (isAllComplete) this.onComplete("全部完成");

                }

            };

            fileData.error = function (fileData, e) { }

            this.postFile(fileData);

            //设定任务开始时间
            this.loaded[file.index].startTime = new Date();
            //设置请求器
            this.loaded[file.index].xhr = fileData.xhr;

        }

        //取消上传任务
        private cancel(index: number) {

            var task = this.loaded[index];
            if (!task) return;

            var status = task.status;

            //若任务已完成,直接返回
            if (status != UploadStatus.UPLOAD_STATE_PROCESSING) {
                alert("文件未开始上传!");
                return;
            }

            if (task.needSplit) {

                this.loaded[index].blobchunks.forEach(function (item) {
                    if (item.status === BlockStatus.STATUS_NOUPLOAD && item.xhr.readyState != 4 /*DONE*/) {
                        item.status = BlockStatus.STATUS_CANCEL;
                        item.xhr.abort();

                        //设置按钮的状态为暂停  bug
                        this.loaded[index].startStatus = BlockStatus.STATUS_CANCEL;
                        this.setUploadStatus(index, UploadStatus.UPLOAD_STATE_CANCEL);

                    }
                }.bind(this));

            } else {
                var xhr = task.xhr;
                if (xhr) {
                    xhr.abort();
                }
            }

            //置进度相关数据为0
            this.resetFileInfo(index);

        }


        //移除任务
        private remove(index: number) {

            var task = this.loaded[index];
            if (!task) return;

            if (task.status == UploadStatus.UPLOAD_STATE_PROCESSING) {
                this.cancel(index);
            }

            //删除文件
            this.deleteFile(index, true);

            //重新统计文件信息
            this.getFilesInfo();

        }


        //上传文件封装方法
        //使用时传入一个fileData对象
        private postFile(fileData: any) {

            if (!fileData.file) return;
            var index = fileData.file.index;

            //设置状态--所有准备好的文件
            if (this.loaded[index].status != UploadStatus.UPLOAD_STATE_READY) {
                return;
            }

            this.loaded[index].startStatus = UploadStatus.UPLOAD_STATE_PROCESSING;

            var formdata = new FormData();
            formdata.append("fileList", fileData.file);
            var xhr = new XMLHttpRequest();

            // 进度
            xhr.upload.addEventListener("progress", function (e) {

                this._wholeProgress(fileData, e);

            }.bind(this), false);
            // 完成
            xhr.addEventListener("load", function (e) {
                this._wholeLoad(fileData, e);
            }.bind(this), false);
            // 错误
            xhr.addEventListener("error", function (e) {
                this._wholeError(fileData, e);
            }.bind(this), false);

            //停止
            xhr.addEventListener("abort", function () {
                this._wholeAbort(fileData);
            }.bind(this), false);


            xhr.open("POST", this.url, true);
            xhr.setRequestHeader("X_FILE_NAME", encodeURIComponent(fileData.file.name));
            if (this.path && this.path != '') {
                xhr.setRequestHeader("X_FILE_PATH", encodeURIComponent(this.path));
            }
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X_FILE_UPLOAD_WITHBLOCK", "0"); //0:false 1:true

            xhr.onreadystatechange = ((obj) => {
                return () => {
                    obj.readyStateChange(xhr, fileData.file.index);
                };
            })(this);

            xhr.send(formdata);

            fileData.xhr = xhr;

            this.xhr = xhr;

            return xhr;

        }


        //整个文件上传时，progress操作
        private _wholeProgress(fileData, e) {

            if (!e.lengthComputable) throw "不支持计算进度";

            if (fileData.progress && _.isFunction(fileData.progress)) {
                fileData.progress.apply(this, arguments);
            }

            //设置状态--传输中
            this.setUploadStatus(fileData.file.index, UploadStatus.UPLOAD_STATE_PROCESSING);

            // 回调到外部
            this.onProgress(fileData.file, e.loaded, e.total);

        }


        //整个文件上传load操作
        private _wholeLoad(fileData, e) {

            if (fileData.load && _.isFunction(fileData.load)) {
                fileData.load.apply(this, arguments);
            }

            var result = JSON.parse(JSON.parse(e.target.responseText));
            if (result.IsSuccess) {

                this.showProgress = false;

                //设置状态--完成
                this.setUploadStatus(fileData.file.index, UploadStatus.UPLOAD_STATE_COMPLETE);
                this.loaded[fileData.file.index].startStatus = 0;
                // 回调到外部
                this.onSuccess(fileData.file, this.toObjectOrString(e.target.responseText));

                if (this.debug) this.log(fileData.file.name + " 上传成功!");

            } else {
                //设置状态--错误
                this.setUploadStatus(fileData.file.index, UploadStatus.UPLOAD_STATE_ERROR);


                // 回调到外部
                this.onFailure(fileData.file, this.toObjectOrString(e.target.responseText));

                if (this.debug) this.log(fileData.file.name + " 上传失败，服务器返回消息:" + result.Message);

            }
        }


        //整个文件上传时异常处理
        private _wholeError(fileData, e) {

            if (fileData.error && _.isFunction(fileData.error)) {
                fileData.error.apply(this, arguments);
            }

            //设置状态--出错
            this.setUploadStatus(fileData.file.index, UploadStatus.UPLOAD_STATE_ERROR);

            // 回调到外部
            this.onFailure(fileData.file, this.toObjectOrString(e.target.responseText));

            if (this.debug) this.log(fileData.file.name + " 上传异常，服务器返回消息:" + e.target.responseText);

        }


        //整个文件上传时终止操作
        private _wholeAbort(fileData) {

            if (fileData.abort && _.isFunction(fileData.abort)) {
                fileData.abort.apply(this, arguments);
            }

            //设置状态--取消
            this.setUploadStatus(fileData.file.index, UploadStatus.UPLOAD_STATE_CANCEL);

            // 回调到外部
            this.onAbort(fileData.file);

            if (this.debug) this.log(fileData.file.name + ' 已取消上传');
        }



        //onreadystatechange
        private readyStateChange(xhr: any, index: any) {

            //if (this.debug) this.log('readyState:' + xhr.readyState + ' status:' + xhr.status);

            if (xhr.status == 200) {
                //重启异常的上传任务
                _.forEach(this.serverErrorFileIndexs, function (index) {
                    //this.restart(index);
                }.bind(this))

                this.serverErrorFileIndexs = [];
            }

            if (xhr.status == 404) {
                if (this.debug) alert('404：找不到对应服务');
                this.serverErrorFileIndexs.push(index);
                this.cancel(index);
            }

        }


        //计算文件的进度，平均速率，总耗时
        private calcFileInfo(index: number, loaded: number, total: number) {

            var fileinfo = this.loaded[index];
            var thisTime = new Date();
            //过去秒数
            var secs = (thisTime.getTime() - fileinfo.startTime.getTime()) / 1000;

            if (loaded > total) loaded = total; //fix 浏览器bug

            fileinfo.endTime = thisTime;
            fileinfo.avgSpeed = this.bytesToSize(Math.floor(loaded / secs)) + "/s";
            fileinfo.totalTime = this.secondsToTime(secs);
            fileinfo.loaded = this.bytesToSize(loaded);
            fileinfo.total = this.bytesToSize(total);
            fileinfo.name = fileinfo.name;
            fileinfo.progress = (loaded / total * 100).toFixed();

            return fileinfo;

        }

        //重置文件上传信息--点击重传时
        private resetFileInfo(index: number) {

            var item = this.loaded[index];
            if (item && item.status !== UploadStatus.UPLOAD_STATE_COMPLETE) {
                item.chunk = 0;
                item.startTime = new Date();
                item.endTime = item.startTime;
                item.avgSpeed = 0;
                item.totalTime = 0;
                item.loaded = 0;
                item.progress = 0;
                item.success = 0;

                this.blockUploadInit(item); //块信息重新初始化
            }
        }


        //统计选中的文件信息
        private getFilesInfo() {

            var self = this;
            var files = self.UploadFile;
            var size: any = 0;
            var num = files.length;
            _.forEach(files, function (k: any, v: any) {
                // 计算得到文件总大小
                size += k.size;
            });

            self.fileNums = num;
            self.fileSize = this.bytesToSize(size);

        }


        //处理拖动文件事件
        private dragDropEvent(e: any) {
            this.disabledEvent(e);
            this.getFiles(e);
        }

        //禁用事件
        private disabledEvent(e: any) {
            e.stopPropagation();
            e.preventDefault();
        }


        //时间格式化
        private secondsToTime(secs) {
            var hr: any = Math.floor(secs / 3600);
            var min: any = Math.floor((secs - (hr * 3600)) / 60);
            var sec: any = Math.floor(secs - (hr * 3600) - (min * 60));
            var misecs: any = 0;

            if (hr < 10) { hr = "0" + hr; }
            if (min < 10) { min = "0" + min; }
            if (sec < 10) { sec = "0" + sec; }
            if (hr) { hr = "00"; }
            if (secs < 1) { misecs = secs * 1000; }
            return hr + ':' + min + ':' + sec + ':' + misecs;
        }

        //文件大小格式化
        public bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0B';
            var i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        }



        //获取上传状态说明
        private getUploadStatusText(status) {
            switch (status) {
                case UploadStatus.UPLOAD_STATE_READY: return "准备中";
                case UploadStatus.UPLOAD_STATE_PROCESSING: return "上传中";
                case UploadStatus.UPLOAD_STATE_COMPLETE: return "已完成";

                case UploadStatus.UPLOAD_STATE_ABORT: return "暂停";
                case UploadStatus.UPLOAD_STATE_CANCEL: return "已取消";
                case UploadStatus.UPLOAD_STATE_ERROR: return "已失败";
            }

            return "未知状态";

        }

        //设置上传状态
        private setUploadStatus(index: number, status: number) {
            if (this.loaded[index]) {
                var task = this.loaded[index];
                task.status = status;
                task.statusName = this.getUploadStatusText(task.status);
            }
        }


        //分片上传--断点时抛弃当前block的大小
        private blockUploadInit(fileData: any) {

            if (fileData.file.size > this.block) {
                fileData.needSplit = true;

                //当前分隔组ID
                fileData.chunk = 0;
                //记录上传完毕的块数量
                fileData.success = 0;
                //总chunk数量
                fileData.chunks = Math.ceil(fileData.file.size / this.block);

                fileData.blobchunks = [];
                //已经上传成功的区块号
                fileData.alreadyList = [];

                fileData.uploadchunks = [];
            }

            //清空本地缓存
            //this.localClear(fileData);

            return fileData;

        }

        //检查浏览器是否支持分片上传
        private check() {
            var support = typeof File !== 'undefined' && typeof Blob !== 'undefined' && typeof FileList !== 'undefined';
            if (this.debug) this.log('浏览器' + (support ? '' : '不') + '支持分块上传方式!');
            return support;
        }


        //停止所有文件上传
        private stopAll() {

            this.loaded.forEach(function (fileData) {
                this.stop(fileData.file.index);
            })
        }

        //停止单个文件的所有块的上传
        private stop(index: number) {

            if (this.xhr) this.xhr.abort(); //停止当前请求

            this.loaded[index].blobchunks.forEach(function (item) {
                //if (item.status === BlockStatus.STATUS_NOUPLOAD && item.xhr.readyState != 4 /*DONE*/) {
                item.status = BlockStatus.STATUS_PAUSE;
                //item.xhr.abort();

                //设置按钮的状态为暂停  bug
                this.loaded[index].startStatus = BlockStatus.STATUS_PAUSE;
                this.setUploadStatus(index, UploadStatus.UPLOAD_STATE_ABORT);

                //}
            }.bind(this));
        }


        //开始所有块的上传
        private blockUpload(fileData) {

            if (!this.check()) return;

            //正在上传的文件 和 已完成的文件 不处理
            if (this.loaded[fileData.file.index].status !== UploadStatus.UPLOAD_STATE_READY) {
                return;
            }

            this.showProgress = true;

            //点击重新上传时，置进度相关数据为0
            this.resetFileInfo(fileData.file.index);

            var task = [];

            //根据配置的block,使用Bolb对象的slice方法分隔文件,分割后直接上传
            //计算slice的起始地址
            for (var i = 0; i < fileData.chunks; i++) {

                fileData.chunk++;
                var start = (fileData.chunk - 1) * this.block;
                var end = fileData.chunk * this.block;
                var blob = fileData.file.slice(start, end);

                var chunkinfo = {
                    file: fileData.file,
                    fileindex: fileData.file.index,
                    //块信息
                    blob: blob,
                    //块编号
                    chunk: fileData.chunk,
                    chunks: fileData.chunks, //总块数
                    loaded: 0, //当前块上传进度
                    xhr: new XMLHttpRequest(),
                    status: BlockStatus.STATUS_NOUPLOAD, //当前块的上传状态
                    //文件信息
                    filename: fileData.file.name,
                    filesize: fileData.file.size,
                    filetype: fileData.file.type,
                    modified: fileData.file.lastModified,

                };

                //检查已上传的文件块
                this.localCheck(chunkinfo, null);

                //检查当前区块的上传状态
                if (fileData.alreadyList.indexOf(fileData.chunk) !== -1) {
                    //此区块已经上传成功
                    chunkinfo.status = BlockStatus.STATUS_UPLOADED;
                    chunkinfo.loaded = this.block;
                    fileData.success++;
                }

                // debugger;
                fileData.blobchunks.push(chunkinfo);

                //设定任务开始时间
                this.loaded[fileData.file.index].startTime = new Date();

            }

            //开始上传
            this.downloadNext(fileData);

        }

        private downloadNext(fileData: any) {

            var chunkinfo = fileData.blobchunks.shift();
            if (chunkinfo) this.sendBlobWithXhr(chunkinfo);
        }


        //重新开始--断点续传
        private restart(index: number) {

            var self = this.loaded[index];
            self.status = 0;
            self.startStatus = 0;
            this.blockUpload(self);

            //var self = this.loaded[index];
            //self.blobchunks.forEach(function (item) {
            //    if (item.status === BlockStatus.STATUS_PAUSE) {
            //        item.status = BlockStatus.STATUS_NOUPLOAD;
            //        this.setUploadStatus(index, UploadStatus.UPLOAD_STATE_PROCESSING); //设置继续状态
            //        self.startStatus = 0;

            //        self.blobchunks.push(item);

            //        //this.sendBlobWithXhr(item);
            //    }
            //}.bind(this));

            //this.downloadNext(self);

        }


        //分片上传封装
        private sendBlobWithXhr(chunkinfo) {

            if (chunkinfo.status === BlockStatus.STATUS_UPLOADED) {
                if (this.debug) this.log('该块(' + chunkinfo.chunk + ')已上传');

                var fileData = this.loaded[chunkinfo.fileindex];
                fileData.uploadchunks.push(chunkinfo);

                this.downloadNext(this.loaded[chunkinfo.fileindex]);
                return false;
            }


            //上传的二进制数据
            var blob = chunkinfo.blob;
            //var file=chunkinfo.file;

            var fd = new FormData();


            //发送二进制文件
            fd.append('file', blob);

            var xhr = chunkinfo.xhr;

            //以下处理断点续传的header
            xhr.open("POST", this.url, true);

            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X_FILE_UPLOAD_WITHBLOCK", "1"); //0:false 1:true

            xhr.setRequestHeader("X_FILE_NAME", encodeURIComponent(chunkinfo.filename));
            xhr.setRequestHeader("X_FILE_SIZE", chunkinfo.filesize);
            xhr.setRequestHeader("X_FILE_TYPE", chunkinfo.filetype);
            xhr.setRequestHeader("X_FILE_MODIFIED", chunkinfo.modified);
            xhr.setRequestHeader("X_FILE_BLOCK", this.block);
            xhr.setRequestHeader("X_FILE_CHUNK", chunkinfo.chunk);
            xhr.setRequestHeader("X_FILE_CHUNKS", chunkinfo.chunks);
            xhr.setRequestHeader("X_FILE_PATH", encodeURIComponent(this.path));

            xhr.addEventListener("load", function (e) {
                this._uploadchunkListener(chunkinfo, e);
            }.bind(this), false);

            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {
                    chunkinfo.loaded = evt.loaded;
                    this._uploadProgress(chunkinfo);
                }

            }.bind(this));

            // 错误
            xhr.addEventListener("error", function (e) {

                if (this.debug) alert('服务器请求异常，请检查服务地址。');

                this.loaded[chunkinfo.fileindex].blockchunks.push(chunkinfo);

                //设置状态--出错
                this.setUploadStatus(chunkinfo.fileindex, UploadStatus.UPLOAD_STATE_ERROR);

                // 回调到外部
                this.onFailure(chunkinfo.file, this.toObjectOrString(xhr.responseText));

                if (this.debug) this.log("error");

            }.bind(this), false);


            xhr.addEventListener("abort", function () {

                //设置状态--取消
                this.setUploadStatus(chunkinfo.fileindex, UploadStatus.UPLOAD_STATE_CANCEL);

                // 回调到外部
                this.onAbort(chunkinfo.file);

                this.serverErrorFileIndexs.push(chunkinfo.fileindex);

                if (this.debug) this.log("abort");

            }.bind(this), false);

            xhr.onreadystatechange = ((obj) => {
                return () => {
                    obj.readyStateChange(xhr, chunkinfo.fileindex);
                };
            })(this);

            xhr.send(fd);

            this.xhr = xhr;

        }


        //上传成功事件监听
        private _uploadchunkListener(chunkinfo, evt) {

            var fileData = this.loaded[chunkinfo.fileindex];

            if (evt.target.responseText) {
                var result = JSON.parse(this.toObjectOrString(evt.target.responseText));

                if (result.IsSuccess) {

                    this.loaded[chunkinfo.fileindex].success++;
                    chunkinfo.success++;
                    chunkinfo.status = BlockStatus.STATUS_UPLOADED;

                    this.loaded[chunkinfo.fileindex].startStatus = 0;
                    if (this.debug) this.log('第' + chunkinfo.chunk + '块上传成功,进度(' + this.loaded[chunkinfo.fileindex].success + '/' + chunkinfo.chunks + ')');

                    //保存本地
                    this.localSave(chunkinfo);
                    //检查所有块
                    this.localCheck(chunkinfo, evt);

                    fileData.uploadchunks.push(chunkinfo);


                } else {


                    //this.loaded[chunkinfo.fileindex].blobchunks.push(chunkinfo);
                    if (this.debug) this.log('第' + chunkinfo.chunk + '块上传失败，服务器返回消息:' + result.Message);


                }

                this.downloadNext(fileData);
            }

        }

        //合并块的进度
        private _uploadProgress(chunkinfo) {

            var loaded: number = 0;
            var index = chunkinfo.fileindex;
            var fileData = this.loaded[index];
            var blobchunks = fileData.blobchunks;
            var uploadchunks = fileData.uploadchunks;

            uploadchunks.forEach(function (item) {
                loaded += item.loaded;
            });

            var fileSize: number = chunkinfo.filesize;
            this.calcFileInfo(index, loaded, fileSize); //统计块上传信息

            //设置状态--传输中
            this.setUploadStatus(index, UploadStatus.UPLOAD_STATE_PROCESSING);
            // 回调到外部
            this.onProgress(fileData.file, loaded, fileSize);

        }


        //将上传成功的块信息写入本地存储
        private localSave(chunkinfo) {

            var file_index_name: string = chunkinfo.filesize + "_"
                + chunkinfo.filetype + "_"
                + chunkinfo.modified + "_"
                + chunkinfo.filename + "_"
                + chunkinfo.chunks + "_"
                + chunkinfo.chunk;

            localStorage.removeItem(file_index_name); //手机bug set前先remove
            localStorage.setItem(file_index_name, "1"); //0是失败 1是成功

        }

        //检查已经上传的文件块
        private localCheck(chunkinfo, evt) {

            var isAllReady = true;
            var chunks = chunkinfo.chunks;
            var uploadList = [];
            this.loaded[chunkinfo.fileindex].alreadyList = [];
            for (var i = 1; i <= chunks; i++) {

                var file_index_name: string = chunkinfo.filesize + "_"
                    + chunkinfo.filetype + "_"
                    + chunkinfo.modified + "_"
                    + chunkinfo.filename + "_"
                    + chunkinfo.chunks + "_"
                    + i;

                if (localStorage.getItem(file_index_name) === "1") {
                    this.loaded[chunkinfo.fileindex].alreadyList.push(i);
                    uploadList.push(file_index_name);
                } else {
                    isAllReady = false;
                }
            }

            //全部上传完毕
            if (isAllReady) {

                this.showProgress = false;

                var index = chunkinfo.fileindex;
                var fileData = this.loaded[index];
                var uploadchunks = fileData.uploadchunks;
                uploadchunks.push(chunkinfo);

                this._uploadProgress(chunkinfo);


                //再次循环
                uploadList.forEach(function (item) {
                    localStorage.removeItem(item);
                });

                //设置状态--完成
                this.setUploadStatus(chunkinfo.fileindex, UploadStatus.UPLOAD_STATE_COMPLETE);

                this.onSuccess(chunkinfo.file, this.toObjectOrString(evt.target.responseText));

                this.onComplete("上传完成");

            } else {
                //查看不连续 有跳包的 必须重发

            }

        }

        //只清除文件存储的缓存
        private localClear(fileData) {
            var chunks = fileData.chunks;
            var file = fileData.file;
            for (var i = 1; i <= chunks; i++) {

                var file_index_name: string = file.filesize + "_"
                    + file.filetype + "_"
                    + file.modified + "_"
                    + file.filename + "_"
                    + file.chunks + "_"
                    + i;

                localStorage.removeItem(file_index_name);
            }
        }


        //日志--测试用，发布时移除
        private log(msg: string) {
            //var log = document.querySelectorAll('.log');
            //var timer = new Date();
            //var p = document.createElement('p');
            //var text = document.createTextNode(this.dateFormat(timer, "yyyy/MM/dd HH:mm:ss") + " " + msg);
            //p.appendChild(text);
            //log[0].appendChild(p);
        }

        //时间格式化
        private dateFormat(date: any, formatType: any) {

            var str = formatType;
            var Week = ['日', '一', '二', '三', '四', '五', '六'];

            str = str.replace(/yyyy|YYYY/, date.getFullYear());
            str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

            str = str.replace(/MM/, date.getMonth() > 9 ? date.getMonth().toString() : '0' + date.getMonth());
            str = str.replace(/M/g, date.getMonth());

            str = str.replace(/w|W/g, Week[date.getDay()]);

            str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
            str = str.replace(/d|D/g, date.getDate());

            str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
            str = str.replace(/h|H/g, date.getHours());
            str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
            str = str.replace(/m/g, date.getMinutes());

            str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
            str = str.replace(/s|S/g, date.getSeconds());

            return str;
        }


        //初始化允许上传的文件后缀，对应的mime是input file的accept属性需要的
        private initAllowExtensions() {
            //暂不处理
        }

        //根据用户输入的allows文件后缀名转成mime类型，给input控件使用
        //mime有bug,目前直接使用文件后缀名
        private change2MIME(): string {
            if (this.allows) {

                var exts = this.allows;
                if (_.isArray(this.allows)) {
                    exts = '';
                    this.allows.forEach(function (item) {
                        exts += ';' + item.ext;
                    });
                }

                var allowsArr = exts.split(';');
                var mimes = [];

                var allowAll = false;

                _.forEach(allowsArr, function (k: any) {
                    //if(!_.startsWith(k,'*.')) {
                    //    k="*."+k;
                    //}
                    //if(!_.startsWith(k,'*')) {
                    //    k="*"+k;
                    //}

                    //if(k==="*.*") allowAll=true;

                    //if(this.allowFileExtensions[k]) {
                    //    mimes.push(this.allowFileExtensions[k]);
                    //}
                    mimes.push(k.replace("*", ""));

                }.bind(this))

                if (allowAll) return "";

                return mimes.join(",");

            }

            return "";

        }

        //load远程模板
        private getTemplate(url: string): string {
            var ajax = new ap.utility.ajax.ajax();
            ajax.url = url;
            ajax.async = false;
            ajax.load();
            return ajax.responseText;
        }


        //读取图片基本信息
        public getImageInfo(src: any, info: ap.utility.upload.UploadImageInfo) {

            if (!src) return;

            // 过滤掉 非 image 类型的文件 
            if (!src.type || !src.type.match(/image.*/)) {
                return;
            }

            var image = new Image();
            var reader = new FileReader();
            // 绑定load事件自动回调函数 
            reader.onload = function (e) {

                var url = reader.result;//读取到的文件内容
                image.src = url;//reader读取的文件内容是base64

                var width = image.naturalWidth;
                var height = image.naturalHeight;
                info.width = width;
                info.height = height;
                info.ext = this.getFileExt(info.name);

                //添加到数组
                this.images.push(info);


            }.bind(this);
            // 读取文件内容 
            reader.readAsDataURL(src);
        }

        public clearImage(domId) {
            var container = document.getElementById(domId);
            if (!container) return;
            var childs = container.childNodes;
            for (var i = childs.length - 1; i >= 0; i--) {
                container.removeChild(childs.item(i));
            }
        }

        /*扩展功能 图片预览*/
        // 加载 图像文件(url路径)
        public loadImage(domId: any, src: any) {

            var container = document.getElementById(domId);
            if (!container) return;

            this.clearImage(domId);

            if (!src) return;

            // 过滤掉 非 image 类型的文件 
            if (!src.type || !src.type.match(/image.*/)) {
                return;
            }

            // 创建 FileReader 对象 并调用 render 函数来完成渲染. 
            var reader = new FileReader();
            // 绑定load事件自动回调函数 
            reader.onload = function (e) {
                // 调用render 
                this.render(domId, e.target.result);

            }.bind(this);
            // 读取文件内容 
            reader.readAsDataURL(src);
        }

        // 渲染
        private render(domId, src) {
            // 创建一个 Image 对象 
            var image = new Image();
            // 绑定 load 事件处理器，加载完成后执行 
            image.onload = function () {

                var container = document.getElementById(domId);
                if (!container) return;
                // 获取 canvas DOM 对象 
                var canvas = document.createElement("canvas");
                container.appendChild(canvas);

                // 如果高度超标 
                if (image.height > uploader.MAX_HEIGHT) {
                    // 宽度等比例缩放 *= 
                    image.width *= uploader.MAX_HEIGHT / image.height;
                    image.height = uploader.MAX_HEIGHT;
                }
                // 获取 canvas的 2d 环境对象, 
                // 可以理解Context是管理员，canvas是房子 
                var ctx = canvas.getContext("2d");
                // canvas清屏 
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // 重置canvas宽高 
                canvas.width = image.width;
                canvas.height = image.height;
                // 将图像绘制到canvas上 
                ctx.drawImage(image, 0, 0, image.width, image.height);
                // !!! 注意，image 没有加入到 dom之中 
            };
            // 设置src属性，浏览器会自动加载。 
            // 记住必须先绑定事件，才能设置src属性，否则会出同步问题。 
            image.src = src;
        }


        //取文件后缀名
        private getFileExt(filepath) {
            if (filepath != "") {
                var pos = "." + filepath.replace(/.+\./, "");
                return pos;
            }
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


    }
}