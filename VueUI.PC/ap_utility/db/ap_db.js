/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品部
** 创建人:      yqj
** 创建日期:    2017年2月15日
** 修改人:
** 修改日期:
** 描 述:       浏览器本地存储封装库
**-----------------------------------------------------------------
******************************************************************/
/// <reference path="../../ref.d.ts" />
/// <reference path="../../d_ts/lodash-2.4.1.d.ts" />
var ap;
(function (ap) {
    var utility;
    (function (utility) {
        var db;
        (function (db_1) {
            //两种临时存储接口
            (function (DbType) {
                DbType[DbType["sessionStorage"] = 0] = "sessionStorage";
                DbType[DbType["localStorage"] = 1] = "localStorage";
            })(db_1.DbType || (db_1.DbType = {}));
            var DbType = db_1.DbType;
            //Html5 本地存储--临时存储的两个方案：
            //sessionStorage是会话层面的存储，页面关闭则存储销毁
            //localStorage 是持久存储，但清空缓存会影响localStorage，浏览器有差异
            var localStore = (function () {
                //构造函数
                function localStore(name, dbType) {
                    this._name = "";
                    this._dbType = DbType.sessionStorage;
                    this._length = 0;
                    this._debug = false;
                    this.keys = []; //存储索引对应的key,下标从0开始
                    this.store = null;
                    if (!name)
                        name = Date.now().toString();
                    switch (dbType) {
                        case DbType.sessionStorage:
                            if (!window.sessionStorage) {
                                throw new Error("浏览器不支持会话存储");
                            }
                            this.store = window.sessionStorage;
                            break;
                        case DbType.localStorage:
                            if (!window.localStorage) {
                                throw new Error("浏览器不支持本地存储");
                            }
                            this.store = window.localStorage;
                            break;
                    }
                    this.name = name;
                    this.dbType = dbType;
                }
                Object.defineProperty(localStore.prototype, "name", {
                    get: function () {
                        return this._name;
                    },
                    set: function (name) {
                        this._name = name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(localStore.prototype, "dbType", {
                    get: function () {
                        return this._dbType;
                    },
                    set: function (dbType) {
                        this._dbType = dbType;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(localStore.prototype, "length", {
                    get: function () {
                        return this._length;
                    },
                    set: function (length) {
                        this._length = length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(localStore.prototype, "debug", {
                    get: function () {
                        return this._debug;
                    },
                    set: function (debug) {
                        this._debug = debug;
                    },
                    enumerable: true,
                    configurable: true
                });
                //数据存储时初始化前缀
                localStore.prototype.initKey = function (key) {
                    if (!key) {
                        throw new Error("没有键数据");
                    }
                    var joinKey = encodeURIComponent(this._name + "_" + key); //编码
                    return joinKey; //JSON.stringify(joinKey);
                };
                //取值操作
                localStore.prototype.get = function (key) {
                    var joinedKey = this.initKey(key);
                    var item = this.store.getItem(joinedKey);
                    return this.toObjectOrString(item);
                };
                //赋值操作
                localStore.prototype.set = function (key, value) {
                    var joinedKey = this.initKey(key);
                    if (_.isObject(value)) {
                        this.store.setItem(joinedKey, JSON.stringify(value));
                        this.keys.push(key);
                        this.length++;
                    }
                    else {
                        this.store.setItem(joinedKey, value);
                        this.keys.push(key);
                        this.length++;
                    }
                };
                //移除操作
                localStore.prototype.remove = function (keyOrKeys) {
                    if (!keyOrKeys)
                        return;
                    var joinedKey = '';
                    if (_.isArray(keyOrKeys)) {
                        _.forEach(keyOrKeys, function (item) {
                            joinedKey = this.initKey(item);
                            this.store.removeItem(joinedKey);
                            this.length--;
                            var index = _.indexOf(this.keys, item);
                            this.keys.splice(index, 1);
                        }.bind(this));
                    }
                    else {
                        joinedKey = this.initKey(keyOrKeys);
                        this.store.removeItem(joinedKey);
                        this.length--;
                        var index = _.indexOf(this.keys, keyOrKeys);
                        this.keys.splice(index, 1);
                    }
                };
                //批量取值
                localStore.prototype.getAll = function (keyOrKeys) {
                    if (keyOrKeys === void 0) { keyOrKeys = null; }
                    var data = [];
                    if (!keyOrKeys) {
                        _.forEach(this.keys, function (item) {
                            var value = this.get(item);
                            if (value)
                                data.push(value);
                        }.bind(this));
                        return data;
                    }
                    var joinedKey = '';
                    if (_.isArray(keyOrKeys)) {
                        _.forEach(keyOrKeys, function (item) {
                            var value = this.get(item);
                            if (value)
                                data.push(value);
                        }.bind(this));
                    }
                    else {
                        var value = this.get(keyOrKeys);
                        if (value)
                            data.push(value);
                    }
                    return data;
                };
                //只清除当前实例的数据
                localStore.prototype.clear = function () {
                    _.forEach(this.keys, function (item) {
                        var joinedKey = this.initKey(item);
                        this.store.removeItem(joinedKey);
                    }.bind(this));
                };
                localStore.prototype.toObjectOrString = function (responseText) {
                    if (responseText) {
                        try {
                            return JSON.parse(responseText);
                        }
                        catch (e) {
                        }
                    }
                    return responseText; //非json，返回原生字符串
                };
                return localStore;
            })();
            db_1.localStore = localStore;
            //本地数据库存储
            var dataBaseStore = (function () {
                //构造函数
                function dataBaseStore(name) {
                    if (name === void 0) { name = null; }
                    this._dbName = "allpassdb";
                    this._length = 0;
                    //数据库初始版本号
                    this._version = 1;
                    this._autoKey = false; //主键是否自增长
                    this._keyName = "id"; //主键字段 默认主键字段是id
                    this.stores = []; //存储表
                    this.storeKeys = []; //存储表对应的键
                    this.storeIndexs = []; //存储表对应的索引
                    this.storeName = ""; //当前的表名
                    this.store = null;
                    this.initOk = false;
                    this.initSysVersion = 1;
                    this.indexedDB = null;
                    this.db = null;
                    this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
                    this.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
                    this.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
                    if (!name)
                        name = Date.now().toString();
                    this.dbName = name;
                    indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                    if (!indexedDB) {
                        throw new Error("当前浏览器不支持本地数据库");
                    }
                    this.indexedDB = indexedDB;
                    this.initSystemInfo(); //初始化系统表
                }
                Object.defineProperty(dataBaseStore.prototype, "dbName", {
                    get: function () {
                        return this._dbName;
                    },
                    set: function (name) {
                        this._dbName = name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(dataBaseStore.prototype, "length", {
                    get: function () {
                        return this._length;
                    },
                    set: function (length) {
                        this._length = length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(dataBaseStore.prototype, "version", {
                    get: function () {
                        return this._version;
                    },
                    set: function (version) {
                        this._version = version;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(dataBaseStore.prototype, "autoKey", {
                    get: function () {
                        return this._autoKey;
                    },
                    set: function (autoKey) {
                        this._autoKey = autoKey;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(dataBaseStore.prototype, "keyName", {
                    get: function () {
                        return this._keyName;
                    },
                    set: function (keyName) {
                        this._keyName = keyName;
                    },
                    enumerable: true,
                    configurable: true
                });
                //添加仓库
                dataBaseStore.prototype.addStore = function (store) {
                    if (!store) {
                        this.logError("addStore没有传入参数");
                        return;
                    }
                    if (!store.storeName) {
                        this.logConsole("addStore传入的参数没有设定storeName");
                    }
                    if (!store.columns || store.columns.length == 0) {
                        this.logConsole("addStore传入的参数没有设定columns");
                    }
                    this.addStores([store]);
                };
                //添加store
                dataBaseStore.prototype.addStores = function (stores) {
                    if (stores.length == 0)
                        return;
                    //this.stores = [];
                    stores.forEach(function (item) {
                        this.stores.push(item);
                    }.bind(this));
                    this.changeVersion(); //不调用addStore，批量创建
                };
                dataBaseStore.prototype.checkInit = function (callback) {
                    if (this.initOk) {
                        //添加到系统表
                        callback();
                        return;
                    }
                    setTimeout(function () {
                        this.checkInit(callback);
                    }.bind(this), 1);
                };
                //创建新store只能在version change事件中触发
                dataBaseStore.prototype.changeVersion = function () {
                    this.checkInit(function () {
                        //添加到系统表
                        this.systemGet(this.dbName, function (data) {
                            this.version = 1;
                            if (data)
                                this.version = data.version;
                            this.version++;
                            this.open(null, function (db) {
                                this.createObjectStore(db);
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                };
                //创建新store
                dataBaseStore.prototype.createObjectStore = function (db) {
                    if (this.stores.length == 0)
                        return;
                    //添加到系统表
                    //this.systemSet({ db: this.dbName, version: db.version });
                    this.stores.forEach(function (item, index) {
                        if (!item) {
                            this.logConsole("addStores没有传入参数");
                            return;
                        }
                        if (!item.storeName) {
                            this.logConsole("addStores传入的参数没有设定storeName");
                            return;
                        }
                        if (!item.columns || item.columns.length == 0) {
                            this.logConsole("addStores传入的参数没有设定columns");
                            return;
                        }
                        this.storeName = item.storeName; //当前仓库永远是最新的一个
                        if (db.objectStoreNames.contains(item.storeName)) {
                            //db.deleteObjectStore(item.storeName); //删除仓库
                            db.close();
                            return;
                        }
                        // Create Object Store  
                        // This method was not called from a VERSION_CHANGE transaction callback.  
                        var result = {};
                        var auto = item.autoIncrement;
                        if (auto) {
                            result.autoIncrement = true;
                        }
                        else {
                            //循环列，找出主键
                            var primaryKey = null;
                            item.columns.forEach(function (item) {
                                if (item.primary) {
                                    primaryKey = item.name;
                                }
                            });
                            if (!primaryKey) {
                                this.logConsole("addStores传入的参数columns没有设定primary");
                                return;
                            }
                            result.keyPath = primaryKey;
                            result.autoIncrement = false;
                        }
                        var objectStore = db.createObjectStore(item.storeName, result);
                        //创建索引
                        item.columns.forEach(function (item) {
                            //主键自动加唯一索引
                            if (item.primary) {
                                objectStore.createIndex(item.name, item.name, { unique: true });
                            }
                            else if (item.index) {
                                var shouldIndex = true;
                                if (!item.unique)
                                    shouldIndex = false;
                                objectStore.createIndex(item.name, item.name, { unique: shouldIndex });
                            }
                        });
                        db.close();
                    });
                };
                //切换store
                dataBaseStore.prototype.useStore = function (storeName) {
                    this.storeName = storeName;
                    return this;
                };
                //连接数据库并初始化表
                dataBaseStore.prototype.open = function (dbCall, updateCall) {
                    if (updateCall === void 0) { updateCall = null; }
                    var isExcute = false;
                    var that = this;
                    this.systemGet(this.dbName, function (data) {
                        var ver = 1;
                        if (data)
                            ver = data.version;
                        if (!this.version)
                            this.version = 0;
                        if (ver && ver > this.version) {
                            this.version = ver;
                        }
                        var request = this.indexedDB.open(this.dbName, this.version);
                        request.onerror = function (e) {
                            console.log(e.currentTarget.error.message);
                        };
                        request.onsuccess = function (e) {
                            var db = e.target.result;
                            if (dbCall)
                                dbCall(db);
                        }.bind(that);
                        request.onupgradeneeded = function (e) {
                            var db = e.target.result;
                            //添加到系统表
                            this.systemSet(this.dbName, { db: this.dbName, version: db.version });
                            if (updateCall)
                                updateCall(db);
                            //this.createObjectStore(db);
                            console.log(this.dbName + ' DB version changed to ' + this.version);
                        }.bind(that);
                    }.bind(that));
                };
                dataBaseStore.prototype.getStore = function (db) {
                    var transaction = db.transaction(this.storeName, 'readwrite'); //事务状态下 trans可以设定多张表
                    var store = transaction.objectStore(this.storeName);
                    return store;
                };
                //取值
                dataBaseStore.prototype.get = function (key, callback) {
                    var that = this;
                    this.open(function (db) {
                        var store = this.getStore(db);
                        var request = store.get(key);
                        request.onsuccess = function (e) {
                            var data = e.target.result;
                            callback(data);
                            db.close();
                        }.bind(this);
                    }.bind(that));
                };
                //赋值
                dataBaseStore.prototype.set = function (value, callback) {
                    if (callback === void 0) { callback = null; }
                    var that = this;
                    this.open(function (db) {
                        var store = this.getStore(db);
                        store.put(value); //相对于add方法，put是根据相同主键，有则更新，无则添加
                        this.length++;
                        if (callback)
                            callback(value);
                        db.close();
                    }.bind(that));
                };
                //删除键值
                dataBaseStore.prototype.remove = function (key) {
                    var that = this;
                    this.open(function (db) {
                        var store = this.getStore(db);
                        store.delete(key);
                        this.length--;
                    }.bind(that));
                };
                //清空仓库
                dataBaseStore.prototype.clear = function () {
                    var that = this;
                    this.open(function (db) {
                        var store = this.getStore(db);
                        store.clear();
                    }.bind(that));
                };
                dataBaseStore.prototype.deleteStore = function (storeName) {
                    //添加到系统表
                    this.systemGet(this.dbName, function (data) {
                        this.version = 1;
                        if (data)
                            this.version = data.version;
                        this.version++;
                        this.open(null, function (db) {
                            db.deleteObjectStore(storeName); //删除仓库
                            db.close();
                        }.bind(this));
                    }.bind(this));
                    //var that = this;
                    //this.version++;
                    //this.open(null, function (db) {
                    //    //var transaction = db.transaction(storeName, 'readwrite');
                    //    db.deleteObjectStore(storeName); //删除仓库
                    //    db.close();
                    //}.bind(that));
                };
                //删除数据库--慎重，测试时调用，删除db
                dataBaseStore.prototype.deleteDataBase = function () {
                    //var that = this;
                    //this.open(function (db) {
                    //    db.close();
                    this.indexedDB.deleteDatabase(this.dbName); //删除数据库---注意部分浏览器并不让删除，权限问题
                    //}.bind(that));
                    this.systemSet(this.dbName, { db: this.dbName, version: 0 });
                };
                //通过游标取得store的所有数据，每次处理一行,回调所有数据
                dataBaseStore.prototype.getAllByCursor = function (callback) {
                    var that = this;
                    this.open(function (db) {
                        var data = [];
                        var store = this.getStore(db);
                        var request = store.openCursor();
                        request.onsuccess = function (e) {
                            var cursor = e.target.result;
                            if (cursor) {
                                var result = cursor.value;
                                if (result)
                                    data.push(result);
                                cursor.continue();
                            }
                            else {
                                if (callback)
                                    callback(data);
                            }
                            db.close();
                        };
                    }.bind(that));
                };
                //取得索引列的值等于value的第一个数据项
                dataBaseStore.prototype.getDefaultByIndex = function (indexName, indexValue, callback) {
                    var that = this;
                    this.open(function (db) {
                        var store = this.getStore(db);
                        var idx = store.index(indexName);
                        idx.get(indexValue).onsuccess = function (e) {
                            var result = e.target.result;
                            if (result) {
                                if (callback)
                                    callback(result);
                            }
                            else {
                                this.logError(indexName + "没有建立索引");
                            }
                        }.bind(this);
                    }.bind(that));
                };
                dataBaseStore.prototype.getAllByIndex = function (indexName, callback) {
                    var that = this;
                    this.open(function (db) {
                        var data = [];
                        var store = this.getStore(db);
                        var index = store.index(indexName);
                        var request = index.openCursor(null, this.IDBCursor.prev);
                        /*
                        IDBCursor.NEXT                     顺序循环
                        IDBCursor.NEXT_NO_DUPLICATE        顺序循环不重复
                        IDBCursor.PREV                     倒序循环
                        IDBCursor.PREV_NO_DUPLICATE        倒序循环不重复
                        */
                        request.onsuccess = function (e) {
                            var cursor = e.target.result;
                            if (cursor) {
                                var result = cursor.value;
                                if (result)
                                    data.push(result);
                                cursor.continue();
                            }
                            else {
                                if (callback)
                                    callback(data);
                            }
                        }.bind(this);
                    }.bind(that));
                };
                //在控制台写日志
                dataBaseStore.prototype.logConsole = function (message) {
                    console.log(message);
                };
                //在控制台抛异常
                dataBaseStore.prototype.logError = function (message) {
                    throw new Error(message);
                };
                //初始化系统表
                dataBaseStore.prototype.initSystemInfo = function (version) {
                    if (version === void 0) { version = 1; }
                    this.initOk = true;
                };
                dataBaseStore.prototype.systemSet = function (dbName, value) {
                    var local = window.localStorage;
                    local.setItem("allpass_system_version_" + dbName, JSON.stringify(value));
                };
                dataBaseStore.prototype.systemGet = function (key, callback) {
                    var local = window.localStorage;
                    var re = local.getItem("allpass_system_version_" + key);
                    callback(JSON.parse(re));
                };
                return dataBaseStore;
            })();
            db_1.dataBaseStore = dataBaseStore;
        })(db = utility.db || (utility.db = {}));
    })(utility = ap.utility || (ap.utility = {}));
})(ap || (ap = {}));
