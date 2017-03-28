var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var select = (function (_super) {
                __extends(select, _super);
                /*构造函数*/
                function select(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(select.prototype, "value", {
                    /*下拉框选中值*/
                    get: function () {
                        return this._control["value"];
                    },
                    set: function (value) {
                        this._control["value"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(select.prototype, "text", {
                    /*下拉框显示值*/
                    get: function () {
                        return this._control["wrappedText"];
                    },
                    set: function (value) {
                        this._control["wrappedText"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(select.prototype, "options", {
                    /*下拉框选项*/
                    get: function () {
                        return this._control["options"];
                    },
                    set: function (value) {
                        this._control["options"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(select.prototype, "data", {
                    /*下拉框数据*/
                    get: function () {
                        return this._control["data"];
                    },
                    set: function (value) {
                        this._control["data"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(select.prototype, "dataValueField", {
                    /*value值*/
                    get: function () {
                        return this._control["dataValueField"];
                    },
                    set: function (value) {
                        this._control["dataValueField"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(select.prototype, "dataTextField", {
                    /*text值*/
                    get: function () {
                        return this._control["dataTextField"];
                    },
                    set: function (value) {
                        this._control["dataTextField"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*初始化组件*/
                select.prototype.init = function () {
                    var select = this;
                    Vue.component("ap-select", {
                        template: '<div class="m-select">' +
                            '<div class="dropdown" :style= "btnstyle" >' +
                            '<div class="dropdown-toggle" v-on:click="buttonClick" ><label :style="{width:swidth}">{{wrappedText}}</label><span class="arrow"><i></i></span></div>' +
                            '<div class="scroll-list-wrap" data-scroll="scrollMe" v-show="isshow" :style="liststyle">' +
                            '<ul class="option scroll-list">' +
                            '<li v-for="(item,index) in options" v-on:click="itemClick(index)"><a>{{item.text}}</a></li >' +
                            '</ul>' +
                            '</div><div v-show="isscrollshow" class="scroll-bg" style="height: 170px; top:33px"><div class="scroll-block"  style="height: 40px;" :style={top:top}></div></div>' +
                            '</div>' +
                            '</div>',
                        props: {
                            text: String,
                            btnstyle: {
                                type: Object,
                                default: function () {
                                    return {};
                                }
                            },
                            swidth: {
                                type: String,
                                default: "111px"
                            },
                            liststyle: {
                                type: Object,
                                default: function () {
                                    return {};
                                }
                            },
                            itemcallback: {
                                type: Function
                            },
                            liheight: {
                                type: String,
                                default: "26px"
                            }
                        },
                        data: function () {
                            return {
                                options: [],
                                value: "",
                                data: [],
                                dataValueField: "",
                                dataTextField: "",
                                display: true,
                                wrappedText: this.text,
                                width: 1582,
                                height: 1400,
                                heightfix: 130,
                                scrollBarHeightDiff: 0,
                                factHeightDiff: 0,
                                cssCore: 'webkit',
                                isValidDrag: false,
                                top: "0px",
                                heightFix: 400,
                                _top: 0,
                                max: 321,
                                nowTop: 0,
                                scrollArr: [],
                                start: {},
                                delta: {},
                                _thisScroll: "",
                                _t: false,
                                sb: "",
                                sk: "",
                                step: 0,
                                h: 0,
                                H: 0,
                                isshow: false,
                                isscrollshow: false
                            };
                        },
                        watch: {
                            data: function () {
                                var self = this;
                                if (!(this.dataValueField && this.dataTextField))
                                    return;
                                this.options = [];
                                this.data.forEach(function (value, index, arr) {
                                    var obj = {};
                                    obj.value = value[self.dataValueField];
                                    obj.text = value[self.dataTextField];
                                    self.options.push(obj);
                                });
                            },
                            options: function () {
                            }
                        },
                        created: function () {
                            this.cssCore = function (testCss) {
                                switch (true) {
                                    case testCss.webkitTransition === '':
                                        return 'webkit';
                                        break;
                                    case testCss.MozTransition === '':
                                        return 'Moz';
                                        break;
                                    case testCss.msTransition === '':
                                        return 'ms';
                                        break;
                                    case testCss.OTransition === '':
                                        return 'O';
                                        break;
                                    default:
                                        return '';
                                }
                            }(document.createElement('ComicView').style);
                        },
                        methods: {
                            buttonClick: function () {
                                if (!this.options) {
                                    return;
                                }
                                var self = this;
                                var o = self.$el.querySelector(".scroll-list-wrap");
                                while (o.tagName.toUpperCase() !== 'BODY') {
                                    self._thisScroll = o.getAttribute('data-scroll');
                                    if (self._thisScroll) {
                                        self.scrollArr.push(self._thisScroll);
                                        break;
                                    }
                                    else {
                                        o = o.parentNode;
                                    }
                                }
                                ;
                                if (!self.isshow) {
                                    self.isshow = true;
                                }
                                else {
                                    self.isshow = false;
                                    self.isscrollshow = false;
                                }
                                setTimeout(function () {
                                    var H = self.options.length * (self.$el.querySelector("li").offsetHeight);
                                    var fd = self.factHeightDiff;
                                    var fx = self.heightfix;
                                    var h = fx ? fx : self.height - fd;
                                    h = H - 1 < h ? H : h;
                                    var fh = self.scrollBarHeightDiff;
                                    var S = h - fh;
                                    var s = h / H * S;
                                    s = s > S ? S + 1 : s;
                                    //self.$el.querySelector(".scroll-list-wrap").style.width = self.swidth;
                                    self.$el.querySelector(".scroll-list-wrap").style.height = h + 'px';
                                    self.h = h;
                                    self.H = H;
                                    console.log(h + "," + H);
                                    self.$el.querySelector(".scroll-bg").style.height = S + 'px';
                                    self.$el.querySelector(".scroll-block").style.height = s * 0.8 + 'px';
                                    self.max = ~~(S - s + 1);
                                    self.step = s;
                                    if (self.isshow) {
                                        if (self.H === self.h) {
                                            self.isscrollshow = false;
                                        }
                                        else {
                                            self.isscrollshow = true;
                                        }
                                    }
                                    self.$el.querySelector(".scroll-list").style.position = "relative";
                                    o.onmouseover = function (e) {
                                        e.cancelBubble = true;
                                        o.onmousewheel = self.wheelScroll;
                                        /*Firefox注册事件*/
                                        if (document.addEventListener) {
                                            o.addEventListener('DOMMouseScroll', self.wheelScroll, false);
                                        }
                                        select.winClick(self.$el, function () {
                                            self.isshow = false;
                                            self.isscrollshow = false;
                                        });
                                    };
                                    self.$el.onmousedown = function (e) {
                                        if (e.target.className == "scroll-bg") {
                                            self.sb = e.target;
                                            self.bgMouseDown();
                                        }
                                        else if (e.target.className == "scroll-block") {
                                            self.sb = self.$el.querySelector(".scroll-bg");
                                            self.sk = e.target;
                                            self.skMouseDown();
                                        }
                                        else {
                                        }
                                    };
                                    document.body.onmouseup = function () {
                                        document.body.onmousemove = null;
                                        if (self.isValidDrag) {
                                            self.restart();
                                        }
                                    };
                                });
                            },
                            itemClick: function (index) {
                                var self = this;
                                this.isshow = false;
                                this.isscrollshow = false;
                                self.wrappedText = self.options[index].text;
                                this.$emit("input", self.options[index].value);
                                self.value = self.options[index].value;
                                if (self.itemcallback) {
                                    this.itemcallback(self.text, self.value);
                                }
                            },
                            cssCore: function (testCss) {
                                switch (true) {
                                    case testCss.webkitTransition === '':
                                        return 'webkit';
                                        break;
                                    case testCss.MozTransition === '':
                                        return 'Moz';
                                        break;
                                    case testCss.msTransition === '':
                                        return 'ms';
                                        break;
                                    case testCss.OTransition === '':
                                        return 'O';
                                        break;
                                    default:
                                        return '';
                                }
                            },
                            translate: function () {
                                if (this.cssCore !== '') {
                                    return function (o, x, y) {
                                        o[this.cssCore + 'Transform'] = 'translate(' + x + 'px,' + y + 'px) translateZ(0)';
                                    };
                                }
                                else {
                                    return function (o, x, y) {
                                        o.left = x + 'px';
                                        o.top = y + 'px';
                                    };
                                }
                            }(),
                            pull: function (e) {
                                if (this._top < 0) {
                                    this._top = 0;
                                }
                                else if (this._top > this.max) {
                                    this._top = this.max;
                                }
                                try {
                                    this.top = this._top + 'px';
                                    //this.translate(this.$el.querySelector(".scroll-list").style, 0, (this._top / this.max * (this.h - this.H)) >> 0);
                                    this.$el.querySelector(".scroll-list").style.top = ((this._top / this.max * (this.h - this.H)) >> 0) + "px";
                                }
                                catch (e) {
                                }
                                //this.top = parseInt(this.top.split("px")[0]) + 8 + "px";
                            },
                            goScroll: function (e) {
                                var len = this.scrollArr.length, o;
                                e = e || window.event;
                                if (e.preventDefault) {
                                    e.preventDefault();
                                }
                                else {
                                    e.returnValue = false;
                                }
                                if (this.isValidDrag) {
                                    this.delta = {
                                        X: e.clientX - this.start.X,
                                        Y: e.clientY - this.start.Y
                                    };
                                    this._top = this.nowTop + this.delta.Y;
                                    this.pull();
                                }
                            },
                            runScroll: function (e) {
                            },
                            wheelScroll: function (e) {
                                var isFromScroll = false, direct, thisScroll, o;
                                e = e || window.event;
                                o = e.target || e.srcElement;
                                while (o.tagName.toUpperCase() !== 'BODY') {
                                    thisScroll = o.getAttribute('data-scroll');
                                    if (thisScroll) {
                                        isFromScroll = true;
                                        break;
                                    }
                                    else {
                                        o = o.parentNode;
                                    }
                                }
                                if (!isFromScroll)
                                    return;
                                if (e.preventDefault) {
                                    e.preventDefault();
                                }
                                else {
                                    e.returnValue = false;
                                }
                                direct = -e.wheelDelta || e.detail;
                                direct = direct < 0 ? -1 : 1;
                                this.wheelMove(direct);
                            },
                            wheelMove: function (dir) {
                                this._top = this.nowTop + (this.h / this.options.length / 2) * dir;
                                this.pull();
                                this.nowTop = this._top;
                            },
                            skMouseDown: function (e) {
                                this.isValidDrag = true;
                                document.body.onmousemove = this.goScroll;
                                this.addClass(this.sb, 'scroll-scrolling');
                                this.removeClass(this.$el.querySelector(".scroll-list"), "moved");
                                e = e || window.event;
                                this.start = {
                                    X: e.clientX,
                                    Y: e.clientY,
                                    time: +new Date
                                };
                                this.delta = {};
                            },
                            bgMouseDown: function (e) {
                                e = e || window.event;
                                //if ((e.target || e.srcElement) === sk) return
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
                                var oN = o.className, arrName, arrNow;
                                if (oN.indexOf(cls) === -1)
                                    return;
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
                                this.addClass(this.$el.querySelector(".scroll-list"), 'moved');
                                if (!this.delta.Y)
                                    return;
                                this.nowTop = this._top;
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            var self = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return select;
            })(ap.core.ui);
            widget.select = select;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
