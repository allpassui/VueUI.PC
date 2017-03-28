/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      lv
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       pc端浏览器-上传-项目封装
**-----------------------------------------------------------------
******************************************************************/

declare var layerpk: any;
declare var acbbTips: any;

namespace ap.utility.upload {

    export class UploadPackage {
        //资源上传封装
        //id=divId，
        //path = 平台目录（自定义）,
        //cbSuccess = 上传成功回调(返回路径)
        //选中文件后触发回调事件
        public resourcesUpdate(id, path, fileType, templateUrl, cbSuccess, onClick_) {
            var uploader = new ap.utility.upload.uploader();
            //平台上传地址
            uploader.url = acbbBasicConfig.GetPluginValue("upload") + "/UploadFile";
            //文件后缀限制PNG\jpg\jpeg\bmp\gif
            //"*.xls;*.xlsx;*.doc;*.docx;*.ppt;*.pptx;*.pdf;*.mp4;*.flv;*.rar;*.zip;*.jpg;*.jpeg;*.bmp;*.gif;*.png;" +
            //"*.XLS;*.XLSX;*.DOC;*.DOCX;*.PPT;*.PPTX;*.PDF;*.MP4;*.FLV;*.RAR;*.ZIP;*.JPG;*.JPEG;*.BMP;*.GIF;*.PNG;";
            uploader.allows = fileType || "*.xls;*.doc;*.ppt;";
            //自动上传
            uploader.auto = true;
            //上传文件大小（100M）
            uploader.maxSize = 150 * 1024 * 1024;
            //上传目录路径
            uploader.path = path;
            //模板路径
            //uploader.Template = new ap.scripts.common.acbbcommon().GetPath("/ap_widget_function/upload/uploadImage.html");
            uploader.Template = templateUrl;

            if (onClick_ && typeof (onClick_) == "function") {
                //选中文件后触发
                uploader.onClick = function (files) {

                    return onClick_(files);
                }
            } else {
                uploader.onClick = function (files) {

                    if (files[0].name.length > 200) {
                        //文件名称过长
                        layerpk.alert(acbbTips.GetValue("FileNameLength"), 8);
                        return false;
                    }
                    return true;
                }
            }
            //图片问题回调
            uploader.onFilterFile = function (msg) {
                //msg.id 为1格式限制，2文件是过大
                if (msg.id == 1) {

                    layerpk.alert(acbbTips.GetValue("FileForm"), 8);

                } else {

                    layerpk.alert(acbbTips.GetValue("FileSize"), 8);

                }
            }
            //上传成功回调
            if (cbSuccess && typeof (cbSuccess) == "function") {
                uploader.onSuccess = function (file, response) {

                    response = JSON.parse(response);
                    cbSuccess(file, response);
                };
            }

            //发生错误回调
            uploader.onFailure = function (file, resp) {

                if (!resp) {

                    layerpk.alert(acbbTips.GetValue("UploadError"), 8);
                } else {

                    layerpk.alert(resp.message, 8);
                }

            }
            uploader.Bind(id);
        }
    }

}