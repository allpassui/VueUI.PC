var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 滑动条组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            //slider滑动块
            var slider = (function (_super) {
                __extends(slider, _super);
                function slider(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(slider.prototype, "values", {
                    //values
                    get: function () {
                        return this._control["values"];
                    },
                    set: function (value) {
                        this._control["values"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(slider.prototype, "options", {
                    //选项
                    get: function () {
                        return this._control["options"];
                    },
                    set: function (value) {
                        this._control["options"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                slider.prototype.init = function () {
                    Vue.component("ap-slider", {
                        template: '<div>' +
                            '<div class="vue-slider-outer"  @mouseup="mouseUp"  @mousemove="mouseMove" @mouseleave="mouseLeave">' +
                            '<div class="vue-slider-inner" :style="{width:width,height:height}">' +
                            '<div class="vue-slider-progress" :style="slider"></div>' +
                            '<div><div :style="lstyle" @mousedown="mouseDown(1)" dragable="false"><div style="margin-top:-13px">{{computedScore(Math.round( this.scoreL))}}</div></div>' +
                            '<div :style="mstyle" @mousedown="mouseDown(2)" dragable="false"><div style="margin-top:-13px">{{computedScore(Math.round(this.scoreM - this.scoreL))}}</div></div></div>' +
                            '<div :style="hstyle" @mousedown="mouseDown(3)" dragable="false"><div style="margin-top:-13px">{{computedScore(Math.round(this.scoreH - this.scoreM))}}</div></div></div>' +
                            '</div>' +
                            '</div>',
                        props: ["width", "height", "upperlimit", "lowerlimit"],
                        watch: {
                            options: function () {
                                this.scoreL = this.options.scoreL;
                                this.scoreM = this.options.scoreM;
                                this.scoreH = this.options.scoreH;
                                this.value = this.scoreL + "," + this.scoreM + "," + this.scoreH;
                            }
                        },
                        computed: {
                            slider: {
                                get: function () {
                                    if (!this.options) {
                                        return "width:" + (this.upperlimit - this.lowerlimit) + "%;margin-left:" + this.lowerlimit + "%";
                                    }
                                    else {
                                        return "width:" + (this.options.total) / this.options.total * 100 + "%;margin-left:0%";
                                    }
                                },
                                set: function () {
                                }
                            },
                            lstyle: {
                                get: function () {
                                    if (this.scoreL == undefined)
                                        return "display:none;";
                                    else
                                        return "width:20px;height:20px;background-color: blue;line-height:50px;cursor:pointer;margin-left:" + this.scoreL / this.options.total * 100 + "%";
                                }, set: function () { }
                            },
                            mstyle: {
                                get: function () {
                                    if (this.scoreM == undefined)
                                        return "display:none;";
                                    else
                                        return "width:20px;height:20px;background-color: blue;line-height:50px;cursor:pointer;margin-top:-20px;margin-left:" + this.scoreM / this.options.total * 100 + "%";
                                },
                                set: function () { }
                            },
                            hstyle: {
                                get: function () {
                                    if (this.scoreH == undefined)
                                        return "display:none;";
                                    else
                                        return "width:20px;height:20px;background-color: blue;line-height:50px;cursor:pointer;margin-top:-20px;margin-left:" + this.scoreH / this.options.total * 100 + "%";
                                },
                                set: function () { }
                            }
                        },
                        data: function () {
                            return {
                                scoreL: 0,
                                selected: 0,
                                scoreM: 0,
                                scoreH: 0,
                                clickOrDrag: 0,
                                currentX: 0,
                                options: {},
                                value: ""
                            };
                        },
                        methods: {
                            mouseClick: function (val) {
                                if (this.clickOrDrag == 0)
                                    return;
                                //获取div的margin-left以及宽度
                                var outerdiv = document.querySelector('.vue-slider-outer');
                                var style = window.getComputedStyle ? window.getComputedStyle(outerdiv, "") : outerdiv.currentStyle;
                                var margin_left = parseFloat(style["margin-left"].replace("px", ""));
                                var width = parseFloat(this.width.replace("px", ""));
                                //获取分数区间
                                if (!this.options.total) {
                                    console.log("methods=>options.total is required");
                                }
                                var intervalwidth = this.options.interval ? width / (this.options.total) * this.options.interval : width / (this.options.total);
                                //计算分数
                                var clickposition = val.screenX - margin_left;
                                var positionFloat = parseFloat(clickposition / width) * 100;
                                var total = parseFloat(this.options.total);
                                //计算相对位置
                                var score = this.options.interval ? Math.round(clickposition / intervalwidth) * this.options.interval : clickposition / intervalwidth;
                                if (Math.abs(this.scoreL / total * 100 - positionFloat) < Math.abs(this.scoreH / total * 100 - positionFloat)) {
                                    //this.scoreL = this.options.interval ? Math.round(positionFloat / this.options.interval) * this.options.interval : positionFloat;
                                    this.scoreL = score;
                                }
                                else {
                                    //this.scoreH = this.options.interval ? Math.round(positionFloat / this.options.interval) * this.options.interval : positionFloat;
                                    this.scoreH = score;
                                }
                                this.$emit("input", this.scoreL + "," + this.scoreM + "," + this.scoreH);
                            },
                            mouseDown: function (val) {
                                this.selected = val;
                                this.currentX = val.screenX;
                            },
                            mouseMove: function (val) {
                                if (this.selected == 0 || this.clickOrDrag == 1)
                                    return;
                                var outerdiv = document.querySelector('.vue-slider-outer');
                                var style = window.getComputedStyle ? window.getComputedStyle(outerdiv, "") : outerdiv.currentStyle;
                                //var margin_left = parseFloat(style["margin-left"].replace("px", ""));
                                var margin_left = document.querySelector('.vue-slider-inner').getBoundingClientRect().width;
                                var width = parseFloat(this.width.replace("px", ""));
                                var intervalwidth = this.options.interval ? width / (this.options.total) * this.options.interval : width / (this.options.total);
                                var clickposition = val.screenX - margin_left;
                                var positionFloat = parseFloat(clickposition / width) * 100;
                                var score = clickposition / intervalwidth * this.options.interval;
                                if (this.selected == 1) {
                                    var af_score = this.scoreM == undefined ? this.options.total : this.scoreM;
                                    this.scoreL = score > af_score ? af_score : (score < 0 ? 0 : score);
                                }
                                else if (this.selected == 2) {
                                    var af_score = this.scoreH == undefined ? this.options.total : this.scoreH;
                                    this.scoreM = score > af_score ? af_score : (score < this.scoreL ? this.scoreL : score);
                                }
                                else if (this.selected == 3) {
                                    this.scoreH = score > this.options.total ? this.options.total : (score < this.scoreM ? this.scoreM : score);
                                }
                            },
                            mouseUp: function (val) {
                                if (this.selected == 0 || this.clickOrDrag == 1)
                                    return;
                                if (this.selected == 1) {
                                    this.scoreL = Math.round(this.scoreL / this.options.interval) * this.options.interval;
                                }
                                else if (this.selected == 2) {
                                    this.scoreM = Math.round(this.scoreM / this.options.interval) * this.options.interval;
                                }
                                else if (this.selected == 3) {
                                    this.scoreH = Math.round(this.scoreH / this.options.interval) * this.options.interval;
                                }
                                this.selected = 0;
                                this.value = this.scoreL + "," + this.scoreM + "," + this.scoreH;
                                console.log(this.value);
                            },
                            mouseLeave: function (val) {
                                if (this.selected == 0 || this.clickOrDrag == 1)
                                    return;
                                if (this.selected == 1) {
                                    this.scoreL = Math.round(this.scoreL / this.options.interval) * this.options.interval;
                                }
                                else if (this.selected == 2) {
                                    this.scoreM = Math.round(this.scoreM / this.options.interval) * this.options.interval;
                                }
                                else if (this.selected == 3) {
                                    this.scoreH = Math.round(this.scoreH / this.options.interval) * this.options.interval;
                                }
                                this.selected = 0;
                                this.value = this.scoreL + "," + this.scoreM + "," + this.scoreH;
                            },
                            computedScore: function (score) {
                                if (score < 60 && score >= 0) {
                                    return score + '分钟';
                                }
                                else if (score >= 60) {
                                    return (Math.floor(score / 60) + "小时" + (score % 60) + "分钟");
                                }
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return slider;
            })(ap.core.ui);
            widget.slider = slider;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
