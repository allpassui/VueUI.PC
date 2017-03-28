/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      ly
** 创建日期:    2017年2月15日
** 修改人:      
** 修改日期:    
** 描 述:       pc端浏览器数据埋点封装库
**-----------------------------------------------------------------
******************************************************************/
namespace ap.utility.db {

    export class DataBuriedPoint {

        constructor() {

        }
        //数据库名
        private dbName: string = "allpassdbp";

        //模块配置表
        private storeName: string = "dbpmodules";

        //浏览器配置表
        private cstoreName: string = "dbpclient";

        //列元素,默认一下列名
        private columns: any = [
            { name: 'id', primary: true },
            { name: 'modulename', index: true },
            { name: 'number', index: true },
            { name: 'softname', index: true }
        ];

        //表对应的列元素
        private ccolumns: any = [
            { name: 'id', primary: true },
            { name: 'resolution', index: true },
            { name: 'operatesystem', index: true }
        ]

        //是否已经发送,用于阻塞,防止重复数据提交
        private hasSend: boolean = false;

        //数据请求类型
        private type: string = "POST";

        //模块名
        public moduleName: string = "";

        //软件名
        public softName: string = "";

        //url
        public url: string = "";

        //时间
        public timeOut: number = 10000;

        //dbStore
        public dbStore: dataBaseStore;

        //初始化
        public Init() {
            //初始化创建数据库
            this.CreateDB();
            //刷新浏览器或关闭浏览器提示信息
            this.OnBeforeUnload();
            //定时器
            this.SetInterval();
        }

        //创建数据库
        private CreateDB() {
            this.dbStore = new ap.utility.db.dataBaseStore(this.dbName);
            this.dbStore.addStores([
                {
                    storeName: this.storeName,
                    columns: this.columns
                },
                {
                    storeName: this.cstoreName,
                    columns: this.ccolumns
                }]);
        }

        //匹配浏览器操作系统环境
        private QueryClientOS() {
            var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return "Mac";
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return "Unix";
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux) return "Linux";
            var appVersion = navigator.appVersion;
            if (isWin) {
                var isWin2K = appVersion.indexOf("Windows NT 5.0") > -1 || appVersion.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Win2000";
                var isWinXP = appVersion.indexOf("Windows NT 5.1") > -1 || appVersion.indexOf("Windows XP") > -1;
                if (isWinXP) return "WinXP";
                var isWin2003 = appVersion.indexOf("Windows NT 5.2") > -1 || appVersion.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Win2003";
                var isWinVista = appVersion.indexOf("Windows NT 6.0") > -1 || appVersion.indexOf("Windows Vista") > -1;
                if (isWinVista) return "WinVista";
                var isWin7 = appVersion.indexOf("Windows NT 6.1") > -1 || appVersion.indexOf("Windows 7") > -1;
                if (isWin7) return "Win7";
                var isWin8 = appVersion.indexOf("Windows NT 6.2") > -1 || appVersion.indexOf("Windows NT 6.3") > -1;
                if (isWin8) return "Win8";
                var isWin10 = appVersion.indexOf("Windows NT 10.0") > -1;
                if (isWin10) return "Win10";
            }
            return "other";
        }

        //插入数据
        public Insert(moduleName: string, callback: any) {
            var obj = this;
            var dbStore = obj.dbStore;
            obj.moduleName = moduleName;
            dbStore.useStore(obj.storeName);
            dbStore.getAllByCursor(function (data) {
                var flag = false;
                //遍历数据源，查找相同项
                var allNum = data.length;
                var j = 1;
                for (var i = 0; i < allNum; i++) {
                    dbStore.useStore(obj.storeName);
                    dbStore.get(i + 1, function (data) {
                        //有相同数据更新Number
                        if (obj.moduleName == data.modulename && obj.softName == data.softname) {
                            flag = true;
                            dbStore.useStore(obj.storeName);
                            dbStore.set({
                                id: data.id,
                                modulename: obj.moduleName,
                                softname: obj.softName,
                                number: data.number + 1
                            }, function () {
                                    if (callback) {
                                        callback();
                                    }
                                });
                        }

                        //遍历到最后一条，查找无相同项，执行if中语句
                        if (j == allNum && !flag) {
                            dbStore.useStore(obj.storeName);
                            dbStore.set({
                                id: allNum + 1,
                                modulename: obj.moduleName,
                                softname: obj.softName,
                                number: 1
                            }, function () {
                                    if (callback) {
                                        callback();
                                    }
                                });
                        }
                        j++;

                    })
                }

                //indexDB中无记录，插入新的记录
                if (allNum == 0) {
                    dbStore.useStore(obj.storeName);
                    dbStore.set({
                        id: allNum + 1,
                        modulename: obj.moduleName,
                        softname: obj.softName,
                        number: 1
                    }, function () {
                            if (callback) {
                                callback(moduleName);
                            }
                        });
                }
            });
        }

        //删除数据库
        public DeleteDB() {
            this.dbStore.deleteDataBase();
        }

        //删除indexDB中store
        public DeleteStore(storeName: string) {
            this.dbStore.useStore(storeName);
            this.dbStore.deleteStore(storeName);
        }

        //清空数据
        public Clear(storeName: string) {
            this.dbStore.useStore(storeName);
            this.dbStore.clear();
        }

        //Ajax
        public AjaxPost(obj: any) {
            if (obj == null) {
                obj = this;
            }
            if (this.hasSend) {
                return;
            }
            this.hasSend = true;
            var ajax = new ap.utility.ajax.ajax();
            ajax.url = obj.url;
            ajax.type = obj.type;
            obj.dbStore.useStore(obj.storeName);
            //取indexDB中的所有数据
            obj.dbStore.getAllByCursor(function (data) {
                //查询客户端配置表中是否有数据
                obj.dbStore.useStore(obj.cstoreName);
                obj.dbStore.getAllByCursor(function (cdata) {
                    //如果客户端配置表不存在
                    if (cdata.length == 0) {
                        //初始化浏览器配置参数
                        var sysParam = [{
                            resolution: window.screen.width + "*" + window.screen.height,
                            operatesystem: obj.QueryClientOS()
                        }];
                        //保存浏览器配置
                        obj.dbStore.useStore(obj.cstoreName);
                        obj.dbStore.set({
                            id: 1,
                            resolution: window.screen.width + "*" + window.screen.height,
                            operatesystem: obj.QueryClientOS()
                        },
                            function () {
                                //配置ajax参数
                                ajax.data = { "moduleParam": JSON.stringify(data), "clientParam": JSON.stringify(sysParam) };
                                obj.AjaxCallBack(ajax, obj);
                            });
                    }
                    else {
                        //无数据的情况，不发送
                        if (data.length == 0) {
                             obj.hasSend = false;
                            return;
                        }
                        ajax.data = { "moduleParam": JSON.stringify(data), "clientParam": [] };
                        obj.AjaxCallBack(ajax, obj);
                    }
                });
            });

        }

        //刷新浏览器或关闭浏览器提示信息
        public OnBeforeUnload() {
            var obj = this;
            window.onbeforeunload = function (e) {
                obj.AjaxPost(obj);
                return;
            }
        }

        //Ajax 回调事件
        private AjaxCallBack(ajax: any, obj: any) {
            ajax.onSuccess = function (response) {
                var json = eval('(' + response + ')');
                if (json.IsSuccess == "1") {
                    //清除数据
                    obj.Clear(obj.storeName);
                    obj.hasSend = false;
                }
                console.log(json.Message);
            };
            ajax.onError = function (response) {
                if (response == "") {
                    console.log("启动宿主服务");
                }
                else {
                    console.log("更新失败");
                }
                obj.hasSend = false;
            };
            ajax.debug = true;
            ajax.load();

        }

        //定时器
        private SetInterval() {
            setInterval(function () {
                this.AjaxPost(this);
            }.bind(this), this.timeOut);
        }
    }
}