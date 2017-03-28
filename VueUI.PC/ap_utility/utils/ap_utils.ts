/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      yqj
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       浏览器-通用功能库，后续将完成nojquery的封装
**-----------------------------------------------------------------
******************************************************************/

namespace ap.utility.utils {

    export class utils {

        constructor() {
        }
        
        //时间格式化
        public static SecondsToTime(secs) {
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
        public static BytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0';
            var i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        }


        //检查浏览器是否支持分片下载
        private static CheckBroswerSupportBlock() {
            var support = typeof File !== 'undefined' && typeof Blob !== 'undefined' && typeof FileList !== 'undefined';
            return support;
        }

        
        //写日志，页面中放一个<div class="log"></div>
        public static Log(msg: string) {
            var log = document.querySelectorAll('.log');
            if (!log || log.length == 0) return;
            var timer = new Date();
            var p = document.createElement('p');
            var text = document.createTextNode(this.DateFormat(timer, "yyyy/MM/dd HH:mm:ss") + " " + msg);
            p.appendChild(text);
            log[0].appendChild(p);
        }

        //时间格式化
        public static DateFormat(date: any, formatType: any) {

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

        
        //load远程模板
        public static GetTemplate(url: string): string {
            var ajax = new ap.utility.ajax.ajax();
            ajax.url = url;
            ajax.async = false;
            ajax.load();
            return ajax.responseText;
        }


        public static ToObjectOrString(responseText: any): any {
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