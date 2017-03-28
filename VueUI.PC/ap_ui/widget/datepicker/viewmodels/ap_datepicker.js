var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: datepicker组件
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var datepicker = (function (_super) {
                __extends(datepicker, _super);
                function datepicker(id) {
                    _super.call(this, id);
                    this.init();
                }
                Object.defineProperty(datepicker.prototype, "value", {
                    //设置值
                    get: function () {
                        return this._control["value"];
                    },
                    set: function (value) {
                        if (value) {
                            value = this._control["stringify"](new Date(value));
                        }
                        this._control["value"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(datepicker.prototype, "format", {
                    //设置时间格式
                    get: function () {
                        return this._control["format"];
                    },
                    set: function (value) {
                        this._control["format"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(datepicker.prototype, "disableddate", {
                    //禁用时间
                    get: function () {
                        return this._control["disableddate"];
                    },
                    set: function (value) {
                        this._control["disableddate"] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                datepicker.prototype.init = function () {
                    var datepicker = this;
                    Vue.component("ap-datepicker", {
                        template: new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../ap_ui/widget/datepicker/views/template.html"),
                        data: function () {
                            var today = new Date;
                            return {
                                weekRange: ['日', '一', '二', '三', '四', '五', '六'],
                                dateRange: [],
                                currDate: "",
                                popupDisplay: false,
                                value: "",
                                isMonthShow: false,
                                isYearShow: false,
                                isHourShow: false,
                                isMinuteShow: false,
                                isSecondShow: false,
                                isTimeShow: false,
                                month: "一月",
                                year: "2013",
                                hour: "00",
                                minute: "00",
                                second: "00",
                                format: "yyyy-MM-dd",
                                hdisabled: false,
                                mdisabled: false,
                                sdisabled: false,
                                disableddate: "",
                                bottom: ""
                            };
                        },
                        props: {
                            classname: [String],
                            validate: [String, Object],
                            checkmsg: [String, Object],
                            toggle: {
                                type: String,
                                default: "down"
                            },
                            callback: {
                                type: Function
                            }
                        },
                        created: function () {
                            this.currDate = new Date;
                        },
                        watch: {
                            currDate: function () {
                                this.getDateRange();
                                this.setYear(this.currDate.getFullYear());
                                this.setMonth(this.currDate.getMonth() + 1);
                                this.setYear(this.currDate.getFullYear());
                            },
                            value: function () {
                                var self = this;
                                var valueDate = this.parse(this.value);
                                if (valueDate) {
                                    this.currDate = valueDate;
                                    this.setMonth(this.currDate.getMonth() + 1);
                                    this.setYear(this.currDate.getFullYear());
                                    this.setHour(this.currDate.getHours());
                                    this.setMinute(this.currDate.getMinutes());
                                    this.setSecond(this.currDate.getSeconds());
                                }
                                setTimeout(function () {
                                    self.validatefn();
                                }, 100);
                            },
                            format: function (val) {
                                if (val.indexOf("hh")) {
                                    this.isTimeShow = true;
                                }
                                if (val.indexOf("hh") < 0) {
                                    this.hdisabled = true;
                                }
                                if (val.indexOf("mm") < 0) {
                                    this.mdisabled = true;
                                }
                                if (val.indexOf("ss") < 0) {
                                    this.sdisabled = true;
                                }
                            },
                            disableddate: function (val) {
                                if (val) {
                                    if (this.isdisabled(this.currDate)) {
                                        this.currDate = this.parse(this.disableddate.value);
                                    }
                                    this.getDateRange();
                                }
                            }
                        },
                        methods: {
                            monthClick: function (val) {
                                this.setMonth(val);
                                this.currDate = new Date(this.currDate.getFullYear(), val - 1, this.currDate.getDate());
                                this.isMonthShow = false;
                            },
                            yearClick: function (val) {
                                this.setYear(val);
                                this.currDate = new Date(val, this.currDate.getMonth(), this.currDate.getDate());
                                this.isYearShow = false;
                            },
                            hourClick: function (val) {
                                this.setHour(val);
                                this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), this.currDate.getDate(), val, this.currDate.getMinutes(), this.currDate.getSeconds());
                                this.isHourShow = false;
                            },
                            minuteClick: function (val) {
                                this.setMinute(val);
                                this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), this.currDate.getDate(), this.currDate.getHours(), val, this.currDate.getSeconds());
                                this.isMinuteShow = false;
                            },
                            secondClick: function (val) {
                                this.setSecond(val);
                                this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), this.currDate.getDate(), this.currDate.getHours(), this.currDate.getMinutes(), val);
                                this.isSecondShow = false;
                            },
                            triggerMonth: function () {
                                this.isMonthShow = !this.isMonthShow;
                            },
                            triggerYear: function () {
                                this.isYearShow = !this.isYearShow;
                            },
                            triggerHour: function () {
                                this.isHourShow = !this.isHourShow;
                                this.isMinuteShow = false;
                                this.isSecondShow = false;
                            },
                            triggerMinute: function () {
                                this.isMinuteShow = !this.isMinuteShow;
                                this.isHourShow = false;
                                this.isSecondShow = false;
                            },
                            triggerSecond: function () {
                                this.isSecondShow = !this.isSecondShow;
                                this.isHourShow = false;
                                this.isMinuteShow = false;
                            },
                            mouseover: function (e, date) {
                                if (!date) {
                                    return;
                                }
                                if (this.isdisabled(date)) {
                                    return;
                                }
                                else {
                                    e.target.className = "WdayOn";
                                }
                            },
                            mouseout: function (e, classname) {
                                e.target.className = classname;
                            },
                            inputClick: function (e) {
                                if (this.toggle == "up") {
                                    this.$el.style.position = "relative";
                                    var bottom = this.$el.children[0].offsetHeight;
                                    this.bottom = bottom + "px";
                                }
                                if (this.parse(this.value)) {
                                    this.currDate = this.parse(this.value);
                                }
                                this.popupDisplay = true;
                                var self = this;
                                datepicker.winClick(self.$el, function () {
                                    self.popupDisplay = false;
                                    self.validatefn();
                                });
                            },
                            preNextYearClick: function (flag) {
                                var year;
                                if (flag == 0) {
                                    year = this.currDate.getFullYear() - 1;
                                    this.setYear(year);
                                    this.currDate = new Date(year, this.currDate.getMonth(), this.currDate.getDate());
                                }
                                else if (flag == 1) {
                                    year = this.currDate.getFullYear() + 1;
                                    this.setYear(year);
                                    this.currDate = new Date(year, this.currDate.getMonth(), this.currDate.getDate());
                                }
                            },
                            preNextMonthClick: function (flag) {
                                if (flag == 0) {
                                    var preMonth = this.getYearMonth(this.currDate.getFullYear(), this.currDate.getMonth() - 1);
                                    this.setMonth(preMonth.month + 1);
                                    this.currDate = new Date(preMonth.year, preMonth.month, this.currDate.getDate());
                                }
                                else if (flag == 1) {
                                    var nextMonth = this.getYearMonth(this.currDate.getFullYear(), this.currDate.getMonth() + 1);
                                    this.setMonth(nextMonth.month + 1);
                                    this.currDate = new Date(nextMonth.year, nextMonth.month, this.currDate.getDate());
                                }
                            },
                            itemClick: function (date) {
                                if (this.isdisabled(date))
                                    return;
                                date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.hour, this.minute, this.second);
                                this.value = this.stringify(date);
                                this.currDate = date;
                                this.popupDisplay = false;
                                if (this.callback) {
                                    this.callback();
                                }
                            },
                            clearClick: function () {
                                this.value = "";
                                this.disableddate = "";
                                this.popupDisplay = false;
                            },
                            todayClick: function () {
                                if (this.isdisabled(new Date))
                                    return;
                                this.currDate = new Date;
                                this.value = this.stringify(this.currDate);
                                this.setYear(this.currDate.getFullYear());
                                this.setMonth(this.currDate.getMonth() + 1);
                                this.setYear(this.currDate.getFullYear());
                            },
                            confirmClick: function () {
                                this.value = this.stringify(this.currDate);
                                this.popupDisplay = false;
                                if (this.callback) {
                                    this.callback();
                                }
                            },
                            getYearMonth: function (year, month) {
                                if (month > 11) {
                                    year++;
                                    month = 0;
                                }
                                else if (month < 0) {
                                    year--;
                                    month = 11;
                                }
                                return { year: year, month: month };
                            },
                            stringify: function (date) {
                                var year = date.getFullYear();
                                var month = date.getMonth() + 1;
                                var day = date.getDate();
                                var hour = date.getHours();
                                var minute = date.getMinutes();
                                var second = date.getSeconds();
                                var temp = this.format
                                    .replace(/yyyy/g, year)
                                    .replace(/MM/g, ('0' + month).slice(-2))
                                    .replace(/dd/g, ('0' + day).slice(-2))
                                    .replace(/yy/g, year)
                                    .replace(/M/g, month)
                                    .replace(/d/g, day);
                                if (this.format.indexOf("hh") > 0) {
                                    temp = temp.replace(/hh/g, ('0' + hour).slice(-2));
                                }
                                if (this.format.indexOf("mm") > 0) {
                                    temp = temp.replace(/mm/g, ('0' + minute).slice(-2));
                                }
                                if (this.format.indexOf("ss") > 0) {
                                    temp = temp.replace(/ss/g, ('0' + second).slice(-2));
                                }
                                return temp;
                            },
                            parse: function (str) {
                                var date = new Date(str);
                                if (str && date.toString() == "Invalid Date") {
                                    date = this.getDateForStringDate(str);
                                }
                                return isNaN(date.getFullYear()) ? null : date;
                            },
                            getDayCount: function (year, month) {
                                var dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                                //如果2月
                                if (month == 1) {
                                    //如果闰年
                                    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
                                        return 29;
                                    }
                                    return 28;
                                }
                                return dict[month];
                            },
                            getDateRange: function () {
                                this.dateRange = [];
                                var time = {
                                    year: this.currDate.getFullYear(),
                                    month: this.currDate.getMonth(),
                                    day: this.currDate.getDate()
                                };
                                //当月总天数
                                var dayCount = this.getDayCount(time.year, time.month);
                                //第一天
                                var currMonthFirstDay = new Date(time.year, time.month, 1);
                                //第一周如果不足7天的补齐上周
                                var firstWeekDay = currMonthFirstDay.getDay();
                                if (firstWeekDay == 0) {
                                    firstWeekDay = 7;
                                }
                                var preMonth = this.getYearMonth(time.year, time.month - 1);
                                var preMonthDayCount = this.getDayCount(preMonth.year, preMonth.month);
                                for (var i = 0; i < firstWeekDay; i++) {
                                    var daytext = preMonthDayCount + i - firstWeekDay + 1;
                                    if (this.isdisabled(new Date(preMonth.year, preMonth.month, daytext))) {
                                        this.dateRange.push({
                                            text: daytext,
                                            date: new Date(preMonth.year, preMonth.month, daytext),
                                            sclass: 'WotherDay'
                                        });
                                    }
                                    else {
                                        this.dateRange.push({
                                            text: daytext,
                                            date: new Date(preMonth.year, preMonth.month, daytext),
                                            sclass: 'WinvalidDay'
                                        });
                                    }
                                }
                                //本月
                                var currMonthDayCount = this.getDayCount(time.year, time.month);
                                for (var i = 0; i < currMonthDayCount; i++) {
                                    var daytext = i + 1;
                                    var date = new Date(time.year, time.month, daytext);
                                    var weekday = date.getDay();
                                    var sclass = '';
                                    if (weekday == 6 || weekday == 0) {
                                        sclass = 'Wwday';
                                    }
                                    else {
                                        sclass = "Wday";
                                    }
                                    if (daytext == time.day && this.value) {
                                        var valueDate = this.parse(this.value);
                                        if (valueDate) {
                                            if (valueDate.getFullYear() == time.year && valueDate.getMonth() == time.month) {
                                                sclass = 'Wselday';
                                            }
                                        }
                                    }
                                    else if (!this.value && (daytext == time.day)) {
                                        sclass = 'Wselday';
                                    }
                                    if (this.isdisabled(new Date(time.year, time.month, daytext))) {
                                        this.dateRange.push({
                                            text: daytext,
                                            date: new Date(time.year, time.month, daytext),
                                            sclass: 'WinvalidDay'
                                        });
                                    }
                                    else {
                                        this.dateRange.push({
                                            text: daytext,
                                            date: new Date(time.year, time.month, daytext),
                                            sclass: sclass
                                        });
                                    }
                                }
                                //下月补全
                                var nextMonthDayCount = 42 - currMonthDayCount - firstWeekDay;
                                var nextMonth = this.getYearMonth(time.year, time.month + 1);
                                for (var i = 0; i < nextMonthDayCount; i++) {
                                    var daytext = i + 1;
                                    if (this.isdisabled(new Date(nextMonth.year, nextMonth.month, daytext))) {
                                        this.dateRange.push({
                                            text: daytext,
                                            date: new Date(nextMonth.year, nextMonth.month, daytext),
                                            sclass: 'WotherDay'
                                        });
                                    }
                                    else {
                                        this.dateRange.push({
                                            text: daytext,
                                            date: new Date(nextMonth.year, nextMonth.month, daytext),
                                            sclass: 'WinvalidDay'
                                        });
                                    }
                                }
                            },
                            setMonth: function (val) {
                                switch (val) {
                                    case 1:
                                        {
                                            this.month = "一月";
                                            break;
                                        }
                                        ;
                                    case 2:
                                        {
                                            this.month = "二月";
                                            break;
                                        }
                                        ;
                                    case 3:
                                        {
                                            this.month = "三月";
                                            break;
                                        }
                                        ;
                                    case 4:
                                        {
                                            this.month = "四月";
                                            break;
                                        }
                                        ;
                                    case 5:
                                        {
                                            this.month = "五月";
                                            break;
                                        }
                                        ;
                                    case 6:
                                        {
                                            this.month = "六月";
                                            break;
                                        }
                                        ;
                                    case 7:
                                        {
                                            this.month = "七月";
                                            break;
                                        }
                                        ;
                                    case 8:
                                        {
                                            this.month = "八月";
                                            break;
                                        }
                                        ;
                                    case 9:
                                        {
                                            this.month = "九月";
                                            break;
                                        }
                                        ;
                                    case 10:
                                        {
                                            this.month = "十月";
                                            break;
                                        }
                                        ;
                                    case 11:
                                        {
                                            this.month = "十一";
                                            break;
                                        }
                                        ;
                                    case 12:
                                        {
                                            this.month = "十二";
                                            break;
                                        }
                                        ;
                                }
                            },
                            setYear: function (val) {
                                this.year = val;
                            },
                            setHour: function (val) {
                                this.hour = val;
                            },
                            setMinute: function (val) {
                                this.minute = val;
                            },
                            setSecond: function (val) {
                                this.second = val;
                            },
                            validatefn: function () {
                                if (!this.validate)
                                    return;
                                var dom = this.$el.querySelector(".Wdate");
                                if (dom.getAttribute("data-blur") == "false")
                                    return false;
                                var isError = ap.ui.widget.Validate.validInput(dom);
                                return isError;
                            },
                            isdisabled: function (date) {
                                if (!this.disableddate)
                                    return false;
                                var disdate = this.parse(this.disableddate.value);
                                if (this.disableddate.type == "<") {
                                    return new Date(date.getFullYear(), date.getMonth(), date.getDate()) < new Date(disdate.getFullYear(), disdate.getMonth(), disdate.getDate());
                                }
                                else if (this.disableddate.type == "=") {
                                    return new Date(date.getFullYear(), date.getMonth(), date.getDate()) == new Date(disdate.getFullYear(), disdate.getMonth(), disdate.getDate());
                                }
                                else if (this.disableddate.type == ">") {
                                    return new Date(date.getFullYear(), date.getMonth(), date.getDate()) > new Date(disdate.getFullYear(), disdate.getMonth(), disdate.getDate());
                                }
                                return false;
                            },
                            getDateForStringDate: function (strDate) {
                                //解决 ie，火狐浏览器不兼容new Date(s)
                                var s = strDate.split(" ");
                                var s1 = s[0].split("-");
                                var s2 = s[1].split(":");
                                if (s2.length == 2) {
                                    s2.push("00");
                                }
                                return new Date(s1[0], s1[1] - 1, s1[2], s2[0], s2[1], s2[2]);
                            }
                        },
                        mounted: function () {
                            var _this = this;
                            var me = this;
                            me.getDateRange();
                            ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter(function (ctl, index) { return ctl.$el.id == _this.$el.id; })[0];
                        }
                    });
                };
                return datepicker;
            })(ap.core.ui);
            widget.datepicker = datepicker;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
