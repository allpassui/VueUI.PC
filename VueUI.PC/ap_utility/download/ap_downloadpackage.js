/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      lv
** 创建日期:    2017年2月15日
** 修改人:
** 修改日期:
** 描 述:       下载器件-项目封装库
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var utility;
    (function (utility) {
        var download;
        (function (download) {
            var downLoadPackage = (function () {
                function downLoadPackage() {
                    var folderName = acbbBasicConfig.GetValue("name");
                    this.DownLoadUrl = acbbBasicConfig.GetPluginValue("download");
                }
                //预览播放封装（PDF，视频）
                //newResourceName=数据库中存储生成的新文件名,
                //resourcePreviewPath=文件路径
                //onSaveUrl=回调事件返回预览url
                //进度条DIV
                downLoadPackage.prototype.DownloadCore = function (newResourceName, resourcePreviewPath, onSaveUrl, domId, onError) {
                    var downloader = new ap.utility.download.downloadCore();
                    //下载地址
                    downloader.url = this.DownLoadUrl;
                    //新文件名称
                    downloader.fileOldName = newResourceName;
                    //文件路径
                    downloader.fileOldPath = resourcePreviewPath;
                    //不强制下载
                    downloader.forceDownload = false;
                    //为空时不加载进度
                    if (domId != "" && domId != null) {
                        downloader.Template = acbbCommon.GetPath("/ap_widget_function/download/ap_widget_downloadPreview.html");
                        downloader.Bind(domId);
                    }
                    if (onSaveUrl && typeof (onSaveUrl) == "function") {
                        downloader.onSaveUrl = function (url) {
                            onSaveUrl(url);
                        };
                    }
                    //开始
                    downloader.start();
                    //错误返回
                    if (onError && typeof (onError) == "function") {
                        downloader.onError = function (resp) {
                            onError(resp);
                        };
                    }
                };
                return downLoadPackage;
            })();
            download.downLoadPackage = downLoadPackage;
        })(download = utility.download || (utility.download = {}));
    })(utility = ap.utility || (ap.utility = {}));
})(ap || (ap = {}));
