/*****************************************************************
** Copyright (c) 南京奥派(AllPass)信息产业股份公司研发部
** 创建人:    wangcong
** 创建日期:  2015/9/1 10:55:06
** 描 述:     验证组件 v2.0
** 修改人:    wangcong
** 修改日期:  2016/03/07 18:13
** 修改说明:  修改组件,新增2.0
**-----------------------------------------------------------------
******************************************************************/
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var widget;
        (function (widget) {
            var Validate = (function () {
                function Validate() {
                }
                /*弹出提醒函数*/
                Validate.TipError = function (dom, msg, result, guide) {
                    var self = this;
                    //判断隐藏域
                    if ($(dom) && $(dom).attr("type") == "hidden") {
                        var target = $(dom).attr("target");
                        dom = $("#" + target);
                    }
                    var layId = $(dom).attr("layId");
                    var layMsg = $(dom).attr("layMsg");
                    var direction = $(dom).attr("laydire") || 0;
                    guide = guide || 1;
                    if (result == false) {
                        if (!layId) {
                            self.CreateTips(msg, dom, guide, direction);
                        }
                        else if (layMsg != msg) {
                            self.CreateTips(msg, dom, guide, direction);
                            if (layMsg && layMsg != msg) {
                                self.RemoveLayTips(layId);
                            }
                        }
                    }
                    else {
                        $(dom).attr("layId", "");
                        $(dom).attr("layMsg", "");
                        self.RemoveLayTips(layId);
                    }
                };
                /*弹出提醒函数*/
                Validate.TipErrorExtend = function (dom, msg, result) {
                    this.TipError(dom, msg, result, 2);
                };
                Validate.CreateTips = function (msg, dom, guide, direction) {
                    var index;
                    if (direction > 0)
                        index = layer.tips(msg, dom, { guide: guide, time: 0, tipsMore: true, tips: direction });
                    else {
                        index = layer.tips(msg, dom, { guide: guide, time: 0, tipsMore: true });
                    }
                    $(dom).attr("layId", "layui-layer" + index);
                    $(dom).attr("layMsg", msg);
                };
                //删除Layer.Tips层
                Validate.RemoveLayTips = function (layId) {
                    if (layId && $("#" + layId).length > 0) {
                        $("#" + layId).remove();
                    }
                };
                //删除所有layer标签
                Validate.RemoveAllTips = function () {
                    var tips = document.querySelectorAll(".layui-layer-tips");
                    for (var i = 0; i < tips.length; i++) {
                        var domid = tips[i].id;
                        var dom = document.querySelector("*[layid='" + domid + "']");
                        dom.setAttribute("layid", "");
                        dom.setAttribute("layMsg", "");
                        tips[i].parentNode.removeChild(tips[i]);
                    }
                };
                /*获取默认的验证消息*/
                Validate.getCheckMsg = function (dom, defaultMsg, type) {
                    var self = this;
                    var msg = dom.attr(self.DATACHECKMSG);
                    var value = dom.val();
                    var returnMsg = defaultMsg;
                    if (msg) {
                        var convertObj = self.GetCheckObject(msg);
                        if (convertObj && type) {
                            if (typeof (convertObj) == "object") {
                                for (var propertyName in convertObj) {
                                    if (propertyName == type) {
                                        var checkmsg = convertObj[propertyName];
                                        if (checkmsg && typeof (checkmsg) == "function") {
                                            returnMsg = checkmsg(value);
                                        }
                                        else {
                                            returnMsg = checkmsg;
                                        }
                                        return returnMsg; //直接返回不继续执行
                                    }
                                }
                            }
                            else if (typeof (convertObj) == "string") {
                                returnMsg = convertObj;
                            }
                        }
                    }
                    return returnMsg;
                };
                /*本地验证，返回true(验证通过)，false（验证不通过）*/
                Validate.validReg = function (reg, value) {
                    return reg.test(value);
                };
                /*
                * v1.0添加，
                * v2.0修改，同时兼容v1.0,
                * 验证单个控件*/
                Validate.validInput = function (input) {
                    var self = this;
                    var dom = $(input);
                    var type = dom.attr("data-check");
                    var msg = null;
                    var value = dom.val();
                    var result = true;
                    var validateObj = null;
                    if (type == "required") {
                        validateObj = this.ValidateRules[type];
                        result = validateObj.validate(value);
                        msg = self.getCheckMsg(dom, validateObj.defaultMsg, type);
                    }
                    else {
                        //获取验证类型
                        var chkObj = self.GetCheckObject(type);
                        if (!chkObj)
                            return false; //如果出错，直接返回
                        //v2.0版本的精简验证
                        for (var propertyName in chkObj) {
                            var propertyValue = chkObj[propertyName];
                            //兼容v1.0处理
                            if (propertyName == "type") {
                                propertyName = propertyValue;
                                propertyValue = true;
                            }
                            //分类型处理
                            validateObj = this.ValidateRules[propertyName];
                            if (!validateObj) {
                                console.error("没有找到指定类型的验证规则[" + propertyValue + "]");
                                return false;
                            }
                            //bool类型，修复1==true
                            if (propertyValue && (typeof (propertyValue) == "boolean" && propertyValue == true || propertyValue == 'true')) {
                                if (propertyName != "required" && value == '')
                                    result = true; //如果内容为空并且验证其他类型进行跳过处理
                                else {
                                    result = validateObj.validate(value);
                                    msg = self.getCheckMsg(dom, validateObj.defaultMsg, propertyName);
                                }
                            }
                            else if ((propertyValue || propertyValue == 0) && typeof (propertyValue) == "number") {
                                result = validateObj.validate(value, propertyValue);
                                msg = self.getCheckMsg(dom, validateObj.defaultMsg(propertyValue), propertyName);
                            }
                            //如果验证不通过，结束这次循环
                            if (result == false)
                                break;
                        }
                    }
                    //提示消息
                    if (result == false) {
                        //特殊的控件类型处理
                        if (dom.attr("type") == "hidden")
                            dom = $("#" + dom.attr("target"));
                    }
                    self.TipError(dom, msg, result);
                    return result;
                };
                /*
                * v2.0进行重构
                */
                Validate.GetCheckObject = function (attr) {
                    var chkObj = {};
                    //v2.0版本，省去{},程序自动处理
                    if (attr.indexOf(":") > 0) {
                        if (attr.indexOf("{") == -1 && attr.indexOf("}") == -1)
                            attr = "{" + attr + "}";
                        //报错直接返回
                        try {
                            eval("chkObj = " + attr);
                        }
                        catch (e) {
                            console.error("获取validate组件验证内容出错：" + e);
                            return false;
                        }
                        //将类型转小写
                        if (chkObj && chkObj.type) {
                            chkObj.type = chkObj.type.toLowerCase();
                        }
                    }
                    else {
                        chkObj = "" + attr;
                    }
                    return chkObj;
                };
                /*
               * v1.0版本添加，
               * v2.0版本修改，兼容v1.0版本
               * 验证表单*/
                Validate.validDom = function (dom, extendValidFun, validFunExcuteNo) {
                    var self = this;
                    var from = $(dom);
                    var validResult = true;
                    var tagType = dom[0].tagName; //获取元素类型
                    var isValidateAll = from.attr("data-checkall") || true; //是否验证全部控件
                    var inputarr;
                    if (tagType && tagType.toLowerCase() != "input") {
                        inputarr = $("input[data-check],textarea[data-check]", from);
                    }
                    else {
                        inputarr = from;
                    }
                    var onefirstInput = null;
                    inputarr.each(function (i, d) {
                        var input = $(this);
                        if (extendValidFun && typeof (extendValidFun) == "function") {
                            //v2.0版本，直接传递序号
                            validResult = self.GetResult(validResult, extendValidFun(i));
                            //无返回值赋值为true
                            if (validResult == null)
                                validResult = true;
                        }
                        //验证通过，才继续验证
                        if (isValidateAll || (!isValidateAll && validResult == true))
                            validResult = self.GetResult(validResult, self.validInput(input));
                        //赋值第一个验证不通过的控件
                        if (!onefirstInput)
                            onefirstInput = input;
                        //判断是否验证全部控件
                        if (!isValidateAll)
                            return validResult; //出现错误，直接return不继续执行
                    });
                    if (isValidateAll || (!isValidateAll && validResult == true)) {
                        if (extendValidFun && typeof (extendValidFun) == "function") {
                            validResult = self.GetResult(validResult, extendValidFun(-1)); //最后执行
                        }
                    }
                    if (onefirstInput) {
                        //跳转至第一个
                        $('html, body').animate({ scrollTop: $(onefirstInput).offset().top - 60 }, 500);
                        onefirstInput = null;
                    }
                    return validResult;
                };
                /*
                * 获取验证结果
                */
                Validate.GetResult = function (validResult, result) {
                    return validResult == true ? result : false;
                };
                /*
                * v1.0版本添加，
                * v2.0版本已废弃，集成与validate中
                * 包含编辑器的验证*/
                Validate.validDomIncludeEditor = function (dom, editor, validNo) {
                    var self = this;
                    //扩展编辑器验证
                    var extendValid = function (index) {
                        if (index == validNo) {
                            var value = editor.text();
                            value = value.replace(/\s+/g, "");
                            var result = value != "";
                            self.TipErrorExtend($("div[class='ke-container ke-container-default']"), "请输入内容", result);
                            return result;
                        }
                        return true;
                    };
                    return self.validDom(dom, extendValid);
                };
                /*
                * v2.0 添加，扩展编辑器验证
                */
                Validate.ShowEditorTipsError = function (editor, msg) {
                    var self = this;
                    var value = editor.text();
                    value = value.replace(/\s+/g, "");
                    var result = value != "";
                    self.TipErrorExtend($("div[class='ke-container ke-container-default']"), msg, result);
                    return result;
                };
                /*定义的验证字符串常量*/
                //static REQUIRED = "required";
                //static MAXLENGTH = "maxlength";
                //static MINLENGTH = "minlength";
                //static MINVALUE = "minvalue";
                //static MAXVALUE = "maxvalue";
                /*定义取值用常量*/
                Validate.DATACHECKMSG = "data-checkmsg";
                /*验证规则*/
                Validate.ValidateRules = {
                    'required': {
                        validate: function (value) {
                            return (!value || value.replace(/\s+/g, "") == "") ? false : true;
                        }, defaultMsg: '不能为空'
                    },
                    'email': { validate: function (value) { return Validate.validReg(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, value); }, defaultMsg: '格式错误' },
                    'english': { validate: function (value) { return Validate.validReg(/^[A-Za-z0-9]+$/, value); }, defaultMsg: '格式错误' },
                    'phone': { validate: function (value) { return Validate.validReg(/^(1(([35][0-9])|(47)|[8][0-9]|[7][0-9]))\d{8}$/, value); }, defaultMsg: '格式错误' },
                    'number': { validate: function (value) { return Validate.validReg(/^[0-9]*$/, value); }, defaultMsg: '请输入数字' },
                    'pint': { validate: function (value) { return Validate.validReg(/^[1-9]*[1-9][0-9]*$/, value); }, defaultMsg: '请输入正整数' },
                    'double2p': { validate: function (value) { return Validate.validReg(/^\d+\.?\d{0,2}$/, value); }, defaultMsg: '只能输入两位小数' },
                    'cardno': { validate: function (value) { return Validate.validReg(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/, value); }, defaultMsg: '格式错误' },
                    'chinese': { validate: function (value) { return Validate.validReg(/^[\u4e00-\u9fa5]+$/i, value); }, defaultMsg: '请输入汉字' },
                    'minlength': { validate: function (value, check) { return (value && value.length < check) ? false : true; }, defaultMsg: function (length) { return '至少输入长度为' + length + '的内容'; } },
                    'maxlength': { validate: function (value, check) { return (value && value.length > check) ? false : true; }, defaultMsg: function (length) { return '最多输入长度为' + length + '的内容'; } },
                    'minvalue': { validate: function (value, check) { return (value && parseFloat(value) < check) ? false : true; }, defaultMsg: function (value) { return '最小值为' + value; } },
                    'maxvalue': { validate: function (value, check) { return (value && parseFloat(value) > check) ? false : true; }, defaultMsg: function (value) { return '最大值为' + value; } },
                    'cn09en': { validate: function (value) { return Validate.validReg(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, value); }, defaultMsg: '只能输入汉字、数字、字母' },
                    'date': { validate: function (value) { return Validate.validReg(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/, value); }, defaultMsg: '请输入正确的日期' },
                    'datetime': { validate: function (value) { return Validate.validReg(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/, value); }, defaultMsg: '格式错误' },
                    'numletter': { validate: function (value) { return Validate.validReg(/^[A-Za-z0-9]+$/, value); }, defaultMsg: '只能输入数字、字母' },
                    'capitalletter': { validate: function (value) { return Validate.validReg(/^[A-Z]+$/, value); }, defaultMsg: '只能输入大写字母' },
                    'tax': { validate: function (value) { return Validate.validReg(/^((0\d{2,3})-)(\d{7,8})$/, value); }, defaultMsg: '格式错误' },
                };
                return Validate;
            })();
            widget.Validate = Validate;
        })(widget = ui.widget || (ui.widget = {}));
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
//增加离开焦点验证
window.onload = function () {
    $("body").on("blur", "input[data-check],textarea[data-check]", function () {
        var dom = $(this);
        if (dom.hasClass("Wdate"))
            return false;
        if ($(dom).attr("data-blur") == "false")
            return false; //判断离开焦点
        var isError = ap.ui.widget.Validate.validInput(dom);
        return isError;
    });
};
//扩展Jquery函数
//兼容1.0版本
$.fn.apValidate = function (extendValidFun, validFunExcuteNo) {
    function customExtend(index) {
        if (index == validFunExcuteNo) {
            return extendValidFun();
        }
        else {
            return true;
        }
    }
    return ap.ui.widget.Validate.validDom(this, customExtend);
};
$.fn.apValidateEditor = function (editorObject, validFunExcuteNo) {
    return ap.ui.widget.Validate.validDomIncludeEditor(this, editorObject, validFunExcuteNo);
};
$.fn.apValidateInput = function () {
    return ap.ui.widget.Validate.validInput(this);
};
/*
2.0新增
*
*@obj1（可空） ：扩展验证函数 || 编辑器对象
*@num1（可空） ：扩展验证函数执行顺序 || 编辑器验证顺序
*@obj2（可空） ：扩展验证函数 || 编辑器对象
*@num2（可空） ：扩展验证函数执行顺序 || 编辑器验证顺序
*
*调用方式：1. $("#input").validate();                         //验证input控件，支持隐藏域，隐藏域需要设置target 属性
*          2. $("#div").validate();                           //验证容器，自动获取容器内部需要验证的控件
*          3. $("#div").validate(extendFunction);             //扩展函数验证，默认为-1，最后执行，0表示最先执行。传递下标参数
*          4. $("#div").validate(extendFunction,2);           //扩展函数验证，指定验证顺序
*          5. $("#div").validate(editor);                     //编辑器验证，默认为-1，最后执行，0表示最先执行
*          6. $("#div").validate(editor,2);                   //编辑器验证，指定验证顺序
*          7. $("#div").validate(editor,2,extendFunction);    //编辑器验证，指定验证顺序，添加扩展验证，扩展验证最后执行
*          8. $("#div").validate(editor,2,extendFunction,3);  //编辑器验证，指定验证顺序，添加扩展验证，指定验证顺序
*          9. $("#div").validate(extendFunction,2,editor);    //添加扩展验证，指定验证顺序，编辑器验证，编辑器验证最后执行
*         10. $("#div").validate(extendFunction,2,editor,3);  //添加扩展验证,，指定验证顺序，编辑器验证，指定验证顺序
*/
$.fn.validate = function (obj1, num1, obj2, num2) {
    var dom = $(this);
    var validateModule = ap.ui.widget.Validate;
    if (obj1 == num1 && num1 == obj2 && obj2 == num2 && num2 == undefined) {
        //当参数全部为空时，执行验证控件方法
        return validateModule.validDom(this);
    }
    else {
        //判断第一个参数为验证函数
        var extendFunction = null;
        var extendFunctionExcuteNumber = null;
        var editor = null;
        var editorValidateNumber = null;
        if (obj1 && typeof (obj1) == "function") {
            extendFunction = obj1;
            if (num1 > -2)
                extendFunctionExcuteNumber = num1;
            if (obj2 && typeof (obj2) == "object")
                editor = obj2;
            if (num2 > -2)
                editorValidateNumber = num2;
        }
        else {
            if (obj1 && typeof (obj1) == "object")
                editor = obj1;
            if (num1 > -2)
                editorValidateNumber = num1;
            if (obj2 && typeof (obj2) == "function")
                extendFunction = obj2;
            if (num2 > -2)
                extendFunctionExcuteNumber = num2;
        }
        //包装一层验证编辑器的函数
        var extendValid = function (index) {
            //先验证扩展验证函数
            if (extendFunction != null) {
                if (extendFunctionExcuteNumber == null)
                    return extendFunction(index);
                else {
                    if (index == extendFunctionExcuteNumber)
                        return extendFunction(index);
                }
            }
            //再验证编辑器
            if (editor != null) {
                if (editorValidateNumber == null)
                    editorValidateNumber = -1;
                if (index == editorValidateNumber) {
                    var inputDom = editor["srcElement"][0];
                    var msg = "请输入内容";
                    var isBlur = true;
                    if (inputDom && $(inputDom).length > 0) {
                        msg = $(inputDom).attr(validateModule.DATACHECKMSG) || msg;
                        isBlur = $(inputDom).attr("data-blur") || isBlur;
                        if (isBlur == true) {
                            editor.afterBlur = function () {
                                return validateModule.ShowEditorTipsError(editor, msg);
                            };
                        }
                    }
                    return validateModule.ShowEditorTipsError(editor, msg);
                    ;
                }
            }
            return true;
        };
        return validateModule.validDom(dom, extendValid);
    }
    return true;
};
/*
2.0新增，增加编辑器离开焦点
*/
$.extend({
    addEditorBlur: function (editor) {
        if (editor) {
            var inputDom = editor["srcElement"][0];
            var msg = "不能为空";
            var isBlur = true;
            var validateModule = ap.ui.widget.Validate;
            if (inputDom && $(inputDom).length > 0) {
                msg = $(inputDom).attr(validateModule.DATACHECKMSG) || msg;
                isBlur = $(inputDom).attr("data-blur") || isBlur;
                if (isBlur == true) {
                    editor.afterBlur = function () {
                        return validateModule.ShowEditorTipsError(editor, msg);
                    };
                }
            }
        }
    }
});
