var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 轮播图组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var shuffling = (function (_super) {
                __extends(shuffling, _super);
                /*构造函数*/
                function shuffling(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(shuffling.prototype, "options", {
                    /*图片src设置*/
                    get: function () {
                        return this._control["toptions"];
                    },
                    set: function (value) {
                        this._control["toptions"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(shuffling.prototype, "width", {
                    /*图片宽度设置*/
                    get: function () {
                        return this._control["width"];
                    },
                    set: function (value) {
                        this._control["width"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(shuffling.prototype, "isClickShow", {
                    /*左右点击显示*/
                    get: function () {
                        return this._control["isClickShow"];
                    },
                    set: function (value) {
                        this._control["isClickShow"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*初始化组件*/
                shuffling.prototype.init = function () {
                    var self = this;
                    Vue.component("ap-shuffling", {
                        template: new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/shuffling/views/template.html"),
                        props: {
                            mountedcallback: {
                                type: Function
                            }
                        },
                        data: function () {
                            return {
                                toptions: [],
                                options: [],
                                nowindex: 0,
                                speedNum: 16,
                                attrJson: {
                                    left: -500
                                },
                                moveEle: "",
                                moveEleChildren: "",
                                minEle: "",
                                autoPlayTime: 3000,
                                oPre: "",
                                oNext: "",
                                iTimer: "",
                                width: 250,
                                isClickShow: true,
                                init: false
                            };
                        },
                        watch: {
                            toptions: function () {
                                //将第一张图插入到数组最后实现轮播效果
                                this.options = [];
                                if (this.toptions.length > 1) {
                                    for (var i = 0; i < this.toptions.length; i++) {
                                        this.options.push(this.toptions[i]);
                                    }
                                    this.options.push(this.toptions[0]);
                                }
                                else {
                                    this.options = this.toptions;
                                }
                                this.width = this.$el.offsetWidth;
                                clearInterval(this.iTimer);
                                this.nowindex = 0;
                            }
                        },
                        updated: function (e) {
                            this.moveEle = this.$el.querySelector('.oUlplay');
                            this.moveEleChildren = this.moveEle.querySelectorAll('li');
                            this.minEle = this.$el.getElementsByClassName('samllTitle')[0].getElementsByTagName('li');
                            if (this.minEle.length > 0) {
                                this.minEle[0].className = "thisTitle";
                            }
                            this.moveEle.style.left = "0px";
                            var temp = this;
                            this.iTimer = setInterval(function () { temp.autoPlay(temp.moveEle, temp.autoPlayTime); }, temp.autoPlayTime);
                        },
                        methods: {
                            startMove: function (moveEle, attrJson, speedNum) {
                                var temp = this;
                                var isStop = true;
                                clearInterval(moveEle.timer);
                                moveEle.timer = setInterval(function () {
                                    for (var attr in attrJson) {
                                        //获取到目的地的值
                                        var offset = attrJson[attr]; //-500
                                        //计算当前的位置
                                        var curAttr = temp.getStyle(moveEle, attr); //0
                                        //计算速度
                                        var speed = (offset - curAttr) / speedNum;
                                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                                        if (offset != curAttr) {
                                            isStop = false;
                                        }
                                        else if (temp.nowindex == temp.options.length - 1) {
                                            temp.moveEle.style[attr] = "0px";
                                            temp.nowindex = 0;
                                            clearInterval(moveEle.timer);
                                            return;
                                        }
                                        if (attr == 'opacity') {
                                            moveEle.style.filter = 'alpha(opacity:' + (curAttr + speed) + ')';
                                            moveEle.style.opacity = (curAttr + speed) / 100;
                                        }
                                        else {
                                            moveEle.style[attr] = curAttr + speed + 'px';
                                        }
                                        //当所有值到达目的地时设置为 true
                                        if (isStop) {
                                            clearInterval(moveEle.timer);
                                        }
                                    }
                                }, 10);
                            },
                            getStyle: function (moveEle, name) {
                                var result = null;
                                result = moveEle.currentStyle ? moveEle.currentStyle[name] : getComputedStyle(moveEle, false)[name];
                                if (name == "opacity") {
                                    return parseInt(parseFloat(result) * 100);
                                }
                                return parseInt(result);
                            },
                            minEleMove: function (minEle) {
                                for (var i = 0; i < minEle.length; i++) {
                                    minEle[i].className = '';
                                }
                                var index = this.nowindex;
                                if (index == minEle.length) {
                                    index = 0;
                                }
                                minEle[index].className = 'thisTitle';
                            },
                            minEleClickMove: function (index) {
                                this.nowindex = index;
                                var moveEle = this.$el.querySelectorAll(".samllTitle li")[index];
                                this.startMove(this.moveEle, this.getNewAttrJson(), this.speedNum);
                                this.minEleMove(this.minEle);
                            },
                            autoPlay: function (moveEle, autoPlayTime) {
                                var temp = this;
                                setTimeout(function () {
                                    if (temp.nowindex >= temp.moveEleChildren.length - 1) {
                                        temp.nowindex = 0;
                                    }
                                    else {
                                        temp.nowindex++;
                                    }
                                    temp.startMove(moveEle, temp.getNewAttrJson(), temp.speedNum);
                                    temp.minEleMove(temp.minEle);
                                }, autoPlayTime);
                            },
                            getNewAttrJson: function () {
                                var temp = this;
                                var position = -1 * this.width * (this.nowindex);
                                return {
                                    left: position
                                };
                            },
                            preClick: function () {
                                if (this.nowindex > 0) {
                                    this.nowindex--;
                                    this.startMove(this.moveEle, this.getNewAttrJson(), this.speedNum);
                                    this.minEleMove(this.minEle);
                                }
                                else {
                                    this.nowindex = this.moveEleChildren.length - 2;
                                    this.startMove(this.moveEle, this.getNewAttrJson(), this.speedNum);
                                    this.minEleMove(this.minEle);
                                }
                            },
                            nextClick: function () {
                                if (this.nowindex < this.moveEleChildren.length - 2) {
                                    this.nowindex++;
                                    this.startMove(this.moveEle, this.getNewAttrJson(), this.speedNum);
                                    this.minEleMove(this.minEle);
                                }
                                else {
                                    this.nowindex = 0;
                                    this.startMove(this.moveEle, this.getNewAttrJson(), this.speedNum);
                                    this.minEleMove(this.minEle);
                                }
                            },
                            allEvent: function () {
                                var temp = this;
                                this.oPre.addEventListener('click', function (e) {
                                    if (temp.nowindex > 0) {
                                        temp.nowindex--;
                                        temp.startMove(temp.moveEle, temp.getNewAttrJson(), temp.speedNum);
                                        temp.minEleMove(temp.minEle);
                                    }
                                    else {
                                        temp.nowindex = temp.moveEleChildren.length - 1;
                                        temp.startMove(temp.moveEle, temp.getNewAttrJson(), temp.speedNum);
                                        temp.minEleMove(temp.minEle);
                                    }
                                }, false);
                                this.oNext.addEventListener('click', function (e) {
                                    if (temp.nowindex < temp.moveEleChildren.length - 1) {
                                        temp.nowindex++;
                                        temp.startMove(temp.moveEle, temp.getNewAttrJson(), temp.speedNum);
                                        temp.minEleMove(temp.minEle);
                                    }
                                    else {
                                        temp.nowindex = 0;
                                        temp.startMove(temp.moveEle, temp.getNewAttrJson(), temp.speedNum);
                                        temp.minEleMove(temp.minEle);
                                    }
                                }, false);
                                this.oPre.onmouseover = this.oNext.onmouseover = this.moveEle.onmouseover = function (e) {
                                    clearInterval(this.iTimer);
                                };
                                this.oPre.onmouseout = this.oNext.onmouseout = this.moveEle.onmouseout = function (e) {
                                    this.iTimer = setInterval(function () { temp.autoPlay(temp.moveEle, temp.autoPlayTime); }, temp.autoPlayTime);
                                };
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                            if (this.mountedcallback) {
                                this.mountedcallback();
                            }
                            this.oPre = this.$el.getElementsByClassName('pre')[0];
                            this.oNext = this.$el.getElementsByClassName('next')[0];
                            this.moveEle = this.$el.querySelector('.oUlplay');
                            this.moveEleChildren = this.moveEle.querySelectorAll('li');
                            this.minEle = this.$el.getElementsByClassName('samllTitle')[0].getElementsByTagName('li');
                            this.width = this.$el.offsetWidth;
                        }
                    });
                };
                return shuffling;
            })(ap.core.ui);
            widget.shuffling = shuffling;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
