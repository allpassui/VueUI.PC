/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: datepicker组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {
    export class scroll extends ap.core.ui {

        constructor(id: any) {
            super(id);
            this.init();
        }

        //滚动条初始化
        public get scrollinit(): any {
            return this._control["scrollinit"];
        }

        public set scrollinit(value: any) {
            this._control["scrollinit"] = !this._control["scrollinit"];
        }

        //高度设置
        public get heightfix(): any {
            return this._control["heightfix"];
        }

        public set heightfix(value: any) {
            this._control["heightfix"] = value;
        }

        //滚动条标识设置
        public get index(): any {
            return "";
        }

        public set index(value: any) {
            this._control["contain"] = "scrollList" + value;
            this._control["wrap"] = "scrollListWrap" + value;
            this._control["scrollBg"] = "scrollBg" + value;
            this._control["scrollBlock"] = "scrollBlock" + value;
        }

        //滚动条滚到底部
        public set scrollToBottom(value: any) {
            var self = this;
            setTimeout(function () {
                self._control["top"] = self._control["max"] + "px";
                self._control["_top"] = self._control["max"];
                self._control["nowTop"] = self._control["max"];
                var style = document.getElementById(self._control["contain"]).style;
                var diff = (self._control["_top"] / self._control["max"] * (self._control["h"] - self._control["H"])) >> 0;
                if (!self._control["ishorizontal"]) {
                    style["top"] = diff + "px";
                } else {
                    style["left"] = diff + "px";
                }
            }, 10);
        }

        //滚动条滚到头部
        public set scrollToTop(value: any) {
            var self = this;
            setTimeout(function () {
                self._control["top"] = 0 + "px";
                self._control["_top"] = 0;
                self._control["nowTop"] = 0;
                var style = document.getElementById(self._control["contain"]).style;
                if (!self._control["ishorizontal"]) {
                    style["top"] = "0px";
                } else {
                    style["left"] = "0px";
                }
            }, 10);
        }

        public init() {
            Vue.component('ap-scroll', {
                template: '<div class="scroll-bg" id="scrollBg" style="display: block;">' +
                '<div class="scroll-block"  id="scrollBlock" :style={top:top}></div>' +
                '</div>',
                data: function () {
                    return {
                        width: 1582,
                        height: 1400,
                        heightfix: 0,
                        scrollBarHeightDiff: 0,
                        factHeightDiff: 0,
                        cssCore: 'webkit',
                        isValidDrag: false,
                        top: "0px",
                        contain: "scrollList",
                        wrap: "scrollListWrap",
                        scrollBg: "scrollBg",
                        scrollBlock: "scrollBlock",
                        _top: 0,
                        max: 321,
                        nowTop: 0,
                        start: {},
                        delta: {},
                        _thisScroll: "",
                        scrollid: "",
                        _t: false,
                        sb: "",
                        sk: "",
                        step: 0,
                        scrollinit: false,
                        h: 0,
                        H: 0
                    }
                },
                props: {
                    ishorizontal: {
                        type: Boolean,
                        default: false
                    },
                    callback: {
                        type: Function
                    },
                    bottomcallback: {
                        type: Function
                    },
                    topcallback: {
                        type: Function
                    }
                },
                watch: {
                    scrollinit: function () {
                        var self = this;
                        var o = document.getElementById(self.wrap);
                        while (o.tagName.toUpperCase() !== 'BODY') {
                            self._thisScroll = o.getAttribute('data-scroll');
                            if (self._thisScroll) {
                                self.scrollid = o.id;
                                break;
                            } else {
                                o = o.parentNode;
                            }
                        };
                        if (!self.ishorizontal) {
                            var H = document.getElementById(self.contain).offsetHeight;
                            var fd = self.factHeightDiff;
                            var fx = self.heightfix;
                            //滚动条包裹高度用padding内部的height计算
                            var height = parseFloat(document.defaultView.getComputedStyle(o.parentElement, null).height.split("px")[0]);
                            var h = fx ? fx : height - fd;
                            //var h = fx ? fx : o.parentElement.offsetHeight - fd;
                            h = H - 1 < h ? H : h;
                            var fh = self.scrollBarHeightDiff;
                            var S = h - fh;
                            var s = h / H * S;
                            s = s > S ? S + 1 : s;
                            document.getElementById(self.wrap).style.width = document.getElementById(self.contain).offsetWidth + 'px';
                            document.getElementById(self.wrap).style.height = h + 'px';
                            try {
                                self.$el.style.height = S + 'px';
                                self.$el.children[0].style.height = s + 'px';
                            } catch (e) {

                            }
                        } else {
                            var H = document.getElementById(self.contain).offsetWidth;
                            var fd = self.factHeightDiff;
                            var fx = self.heightfix;
                            var height = parseFloat(document.defaultView.getComputedStyle(o.parentElement, null).width.split("px")[0]);
                            var h = fx ? fx : height - fd;
                            h = H - 1 < h ? H : h;
                            var fh = self.scrollBarHeightDiff;
                            var S = h - fh;
                            var s = h / H * S;
                            s = s > S ? S + 1 : s;
                            document.getElementById(self.wrap).style.width = h + 'px';
                            document.getElementById(self.wrap).style.height = document.getElementById(self.contain).offsetHeight + 'px';
                            try {
                                self.$el.style.width = S + 'px';
                                self.$el.children[0].style.width = s + 'px';
                            } catch (e) {

                            }
                        }

                        self.h = h;
                        self.H = H;
                        if (H === h) {
                            self.$el.style.display = 'none';
                        } else {
                            self.$el.style.display = 'block';
                        }
                        self.max = ~~(S - s + 1);
                        self.step = s;

                        document.getElementById(this.wrap).style.position = "relative";
                        document.getElementById(this.contain).style.position = "relative";
                        self.wheelMove(-0.1);//用来解决内容页初始化没跟着滚动条变化
                        o.onmousedown = function (e) {
                            e.cancelBubble = true;
                            window.onmouseup = document.onmouseup = function (e) {
                                e.cancelBubble = true;
                                document.onmousemove = null;
                                if (self.isValidDrag) {
                                    self.restart();
                                }
                            };
                            if (e.target.className == "scroll-bg" || e.target.className == "scroll-bg-h") {
                                self.sb = e.target;
                                self.bgMouseDown(e);
                            } else if (e.target.className == "scroll-block" || e.target.className == "scroll-block-h") {
                                self.sb = self.$el;
                                self.sk = e.target;
                                self.skMouseDown(e);
                            } else {
                            }
                        };

                        //o.onmouseenter = function (e) {
                        //    window.onmousewheel = document.onmousewheel = self.wheelScroll;
                        //}
                        //当移动到指定区域选定对应滚动条
                        o.onmouseover = function (e) {
                            e.cancelBubble = true;
                            o.onmousewheel = self.wheelScroll;
                            /*Firefox注册事件*/
                            if (document.addEventListener) {
                                document.addEventListener('DOMMouseScroll', self.wheelScroll, false)
                            }
                        }

                    }
                },
                created: function () {
                    this.cssCore = function (testCss) {
                        switch (true) {
                            case testCss.webkitTransition === '':
                                return 'webkit';
                            case testCss.MozTransition === '':
                                return 'Moz';
                            case testCss.msTransition === '':
                                return 'ms';
                            case testCss.OTransition === '':
                                return 'O';
                            default:
                                return '';
                        }
                    } (document.createElement('ComicView').style);

                    if (this.ishorizontal) {
                        this.$options.template = '<div class="scroll-bg-h" id="scrollBg" style="width: 400px; display: block;">' + '<div class="scroll-block-h"  id="scrollBlock" style="width: 80px;" :style={left:top}></div>' + '</div>';
                    }
                    //document.getElementById(this.contain).style.position = "absolute";
                },
                methods: {
                    cssCore: function (testCss) {
                        switch (true) {
                            case testCss.webkitTransition === '':
                                return 'webkit';
                            case testCss.MozTransition === '':
                                return 'Moz';
                            case testCss.msTransition === '':
                                return 'ms';
                            case testCss.OTransition === '':
                                return 'O';
                            default:
                                return '';
                        }
                    },
                    translate: function () {
                        if (this.cssCore !== '') {
                            return function (o, x, y) {
                                o[this.cssCore + 'Transform'] = 'translate(' + x + 'px,' + y + 'px) translateZ(0)';
                            }
                        } else {
                            return function (o, x, y) {
                                o.left = x + 'px';
                                o.top = y + 'px';
                            }
                        }
                    } (),
                    pull: function (e) {
                        if (this._top < 0) {
                            this._top = 0;
                            if (this.topcallback) {
                                this.topcallback();
                            }
                        } else if (this._top > this.max) {
                            this._top = this.max;
                            if (this.bottomcallback) {
                                this.bottomcallback();
                            }
                        }
                        try {
                            this.top = this._top + 'px';

                            if (!this.ishorizontal) {
                                document.getElementById(this.contain).style.top = ((this._top / this.max * (this.h - this.H)) >> 0) + "px";
                                //this.translate(document.getElementById(this.contain).style, 0, (this._top / this.max * (this.h - this.H)) >> 0);
                            } else {
                                document.getElementById(this.contain).style.left = ((this._top / this.max * (this.h - this.H)) >> 0) + "px";
                                //this.translate(document.getElementById(this.contain).style, (this._top / this.max * (this.h - this.H)) >> 0 , 0 );
                            }

                            if (this.callback) {
                                this.callback();
                            }

                        } catch (e) {

                        }
                    },
                    goScroll: function (e) {
                        e = e || window.event;
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                        if (this.isValidDrag) {
                            this.delta = {
                                X: e.clientX - this.start.X,
                                Y: e.clientY - this.start.Y
                            }
                            if (!this.ishorizontal) {
                                this._top = this.nowTop + this.delta.Y;
                            } else {
                                this._top = this.nowTop + this.delta.X;
                            }
                            this.pull();
                        }
                    },
                    runScroll: function (e) {

                    },
                    wheelScroll: function (e) {
                        //textarea的时候滚动条事件不触发
                        if (e.target.tagName == "TEXTAREA")
                            return;
                        var isFromScroll = false,
                            direct,
                            thisScroll,
                            o;
                        e = e || window.event;
                        o = e.target || e.srcElement;

                        while (o.tagName.toUpperCase() !== 'BODY') {
                            thisScroll = o.getAttribute('data-scroll');
                            if (thisScroll) {
                                isFromScroll = true;
                                break;
                            } else {
                                o = o.parentNode;
                            }
                        }
                        if (!isFromScroll || o.id != ap.core.ui.CONTROLS[this.$el.id]._control["scrollid"]) return;

                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                        direct = - e.wheelDelta || e.detail;
                        direct = direct < 0 ? -1 : 1;
                        this.wheelMove(direct);
                    },
                    wheelMove: function (dir) {
                        this._top = this.nowTop + ~~(80 * .1) * dir;
                        this.pull();
                        this.nowTop = this._top;
                    },
                    skMouseDown: function (e) {
                        this.isValidDrag = true;
                        window.onmousemove = document.onmousemove = this.goScroll;
                        this.addClass(this.sb, 'scroll-scrolling');
                        this.removeClass(document.getElementById(this.contain), "moved");
                        e = e || window.event;
                        this.start = {
                            X: e.clientX,
                            Y: e.clientY,
                            time: +new Date
                        }
                        this.delta = {};
                    },
                    bgMouseDown: function (e) {
                        e = e || window.event;
                        //if ((e.target || e.srcElement) === sk) return;
                        this._top = e.offsetY < this.nowTop ? this.nowTop - (this.step * .7) >> 0
                            : this.nowTop + (this.step * .7) >> 0;
                        this.pull();
                        this.nowTop = this._top;
                    },
                    addClass: function (o, cls) {
                        var oN = o.className;

                        if (oN.indexOf(cls) === -1) {
                            o.className = oN + ' ' + cls;
                        }
                    },
                    removeClass: function (o, cls) {
                        var oN = o.className,
                            arrName,
                            arrNow;

                        if (oN.indexOf(cls) === -1) return;
                        arrName = oN.split(' ');
                        arrNow = arrName.length;
                        while (arrNow--) {
                            if (arrName[arrNow] === cls) {
                                arrName.splice(arrNow, 1);
                            }
                        }
                        o.className = arrName.join(' ');
                    },
                    restart: function () {
                        this.isValidDrag = false;
                        this.removeClass(this.sb, 'scroll-scrolling');
                        this.addClass(document.getElementById(this.contain), 'moved');
                        if (!this.delta.Y) return;
                        this.nowTop = this._top;
                    }
                },
                mounted: function () {
                    var self = this;
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];

                }
            })
        }

    }
}