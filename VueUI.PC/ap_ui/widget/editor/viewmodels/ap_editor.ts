declare var editor: any;
declare var $: any;
declare var state: any;
/*****************************************************************
** Copyright (c) 南京奥派（AllPass）信息产业股份公司产品中心
** 创建人: 何健伟
** 创建日期: 2017年12月15日 09时00分
** 描 述: 编辑器组件
**-----------------------------------------------------------------
******************************************************************/
namespace ap.ui.widget {

    export class editor extends ap.core.ui {

        public proto = {

            el: null,
            // calls to the browser's execCommand, returns success or failure.
            cmd: function (command, val) {
                var success = document.execCommand(command, false, val || null);
                return success;
            },

            // whether or not the formating command can be executed on the current range
            cmdEnabled: function (cmd) {
                return document.queryCommandEnabled(cmd);
            },

            // whether or not the formating command has been executed on the current range (i.e. active)
            cmdState: function (cmd) {
                return document.queryCommandState(cmd);
            },

            // toggle whether or not the element is editable
            enable: function (enable) {
                this.el.setAttribute("contenteditable", enable);
                return this;
            },

            // give focus back to the element
            focus: function () {
                this.el.focus();
                return this;
            },

            // get the html of the element
            getHtml: function () {
                return this.el.innerHTML;
            },

            // replace the innerHTML of the element (maintains a history)
            replaceHtml: function (html) {
                this.restoreSelection();
                this.cmd("selectAll");
                this.cmd("insertHTML", html);
                window.getSelection().removeAllRanges();
            },

            // get the currently selected range
            getCurrentRange: function () {
                var sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            },

            // save the user selection
            saveSelection: function () {
                this.savedRange = this.getCurrentRange();
                return this;
            },

            // restore the user selection
            restoreSelection: function () {
                var selection = window.getSelection();
                if (this.savedRange) {
                    try {
                        selection.removeAllRanges();
                    } catch (ex) {
                        document.body.createTextRange().select();
                        document.selection.empty();
                    }

                    selection.addRange(this.savedRange);
                }
                return this;
            },

            // whether or not there is a selection
            hasSelection: function () {
                return (this.savedRange !== undefined) && !this.savedRange.collapsed;
            },

            // get the nearest container element for the current range.
            getElement: function () {
                var el, range = this.getCurrentRange();
                if (range) {
                    // normalize Firefox & Chrome tag selection
                    el = this.getSelectedElement(range);
                    if (el.nodeType !== 1) el = range.commonAncestorContainer;
                }
                return el;
            },

            // find the closest element of selection for selector.
            closest: function (selector) {
                var el = this.getElement();
                if (!el) return;
                var matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
                while (el && el !== this.el && this.el.contains(el)) {
                    if (matches.call(el, selector)) break;
                    el = el.parentNode;
                }
                return (el !== this.el) ? el : undefined;
            },

            // gets the selections element hierarchy
            parents: function () {
                var current = this.getCurrentRange();

                var parents = [];
                if (current) {
                    var parent = current.commonAncestorContainer;
                    // ensure we're starting with an ELEMENT_NODE
                    if (parent.nodeType !== 1) parent = parent.parentNode;
                    while (parent && parent !== this.el && this.el.contains(parent)) {
                        parents.push(parent);
                        parent = parent.parentNode;
                    }
                }
                return parents;
            },

            // selects an element
            selectElement: function (el) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                var range = document.createRange();
                range.selectNode(el);
                sel.addRange(range);
                this.saveSelection();
                return this;
            },

            restart: function () {
                var range = document.createRange();
                range.selectNode(this.el);

                range.startOffset = 1;

            },
            getSelectedElement: function (range) {
                var selectedElement;
                if (this.rangeSelectsSingleNode(range)) {
                    // Selection encompasses a single element
                    selectedElement = range.startContainer.childNodes[range.startOffset];
                } else if (range.startContainer.nodeType === 3) {
                    // Selection range starts inside a text node, so get its parent
                    selectedElement = range.startContainer.parentNode;
                } else {
                    // Selection starts inside an element
                    selectedElement = range.startContainer;
                }
                return selectedElement;
            },
            rangeSelectsSingleNode: function (range) {
                var startNode = range.startContainer;
                return startNode === range.endContainer && startNode.hasChildNodes() && range.endOffset === range.startOffset + 1;
            }


        }


         public init() {
             ["bold", "italic", "copy", "cut", "paste", "delete",
                 "forwardDelete", "fontName", "fontSize", "foreColor",
                 "hiliteColor", "backColor", "justifyCenter", "justifyFull",
                 "justifyLeft", "justifyRight", "strikeThrough", "subscript",
                 "superscript", "underline", "removeFormat", "heading", "formatBlock",
                 "indent", "outdent", "createLink", "unlink", "insertBrOnReturn",
                 "insertHorizontalRule", "insertImage", "insertOrderedList",
                 "insertUnorderedList", "insertParagraph", "insertText",
                 "insertHTML", "undo", "redo", "selectAll"].forEach(function (command) {
                this[command] = this.cmd.bind(this, command);
            }, this.proto);
        }

         public bindUpload() {
             var self = this;
             var CRUpload = new ap.utility.upload.UploadPackage();
             CRUpload.resourcesUpdate(
                 "ImgUpload",
                 acbbBasicConfig.GetValue("name"),
                 "*.jpg;*.png;*.bmp",
                 new ap.scripts.common.acbbcommon().GetPath("/ap_utility/upload/filepicture.html"),
                 function (file, response) {
                     var downloadurl = acbbBasicConfig.GetPluginValue("download") + "/GetFile?filePath=" + acbbBasicConfig.GetValue("name") + "/&fileName=";
                     var path = downloadurl + response.NewFileName;
                     self.proto.restoreSelection().focus().insertHTML("<img src='" + path + "' />");
                 },
                 null);
         }

         public bindUploadFile() {
             var self = this;
             var CRUpload = new ap.widget.acbbfunction.UploadPackage();
             CRUpload.resourcesUpdate(
                 "ImgUpload",
                 acbbBasicConfig.GetValue("name"),
                 "*.mp4;*.avi",
                 new ap.scripts.common.acbbcommon().GetPath("/ap_widget_function/upload/uploadResources.html"),
                 function (file, response) {
                     var downloadurl = acbbBasicConfig.GetPluginValue("download") + "/GetFile?filePath=" + acbbBasicConfig.GetValue("name") + "/&fileName=";
                     var path = downloadurl + response.NewFileName;
                     self.proto.restoreSelection().focus().insertHTML("<br/>");
                     var vedio = '<video controls="controls"><source src="' + path + '" type="video/mp4; codecs=avc1.42E01E, mp4a.40.2" /></video>';
                     //var embed = '<embed src="'+path+'" autostart= true >';
                     self.proto.restoreSelection().focus().insertHTML(vedio);
                 },
                 null);
         }
        //a.forEach(function (command) {
        //    this[command] = this.cmd.bind(this, command);
        //}, this.proto);

       
        //el.addEventListener('mouseout', function (e) {
        //    this.proto.saveSelection();
        //})



        //public rangeSelectsSingleNode(range) {
        //    var startNode = range.startContainer;
        //    return startNode === range.endContainer && startNode.hasChildNodes() && range.endOffset === range.startOffset + 1;
        //}

        //public getSelectedElement(range) {
        //    var selectedElement;
        //    if (this.rangeSelectsSingleNode(range)) {
        //        // Selection encompasses a single element
        //        selectedElement = range.startContainer.childNodes[range.startOffset];
        //    } else if (range.startContainer.nodeType === 3) {
        //        // Selection range starts inside a text node, so get its parent
        //        selectedElement = range.startContainer.parentNode;
        //    } else {
        //        // Selection starts inside an element
        //        selectedElement = range.startContainer;
        //    }
        //    return selectedElement;
        //}

         constructor(id: any) {
            super(id);
            var self = this;
            //var proto2 = new editor().proto;
            Vue.component("ApEditor", {
                created() {
                    //var filePath = new ap.scripts.common.acbbcommon().GetPath("/ap_widget_ui/editor/templates/editor_template.html");
                    this.$options.template = new ap.utility.ajax.ajaxPackage().ajax_getcontent("../../editor/views/editor_template.html");
                },
                props: {
                    value: {
                        default:""
                    }
                },
                data: function(){
                    return {
                        htmlstate:true,
                        showfontsize:false,
                        fontsize: [
                            { "text": "Small", "value": "2" },
                            { "text": "Normal", "value": "3" },
                            { "text": "Medium", "value": "4" },
                            { "text": "Large", "value": "5" },
                            { "text": "Huge", "value": "6" }
                        ],
                        showfontname: false,
                        fontname: [
                            { "text": "宋体", "value": "宋体" },
                            { "text": "黑体", "value": "黑体" },
                            { "text": "楷体", "value": "楷体" },
                            { "text": "微软雅黑", "value": "微软雅黑" },
                            { "text": "Arial", "value": "Arial" },
                            { "text": "Verdana", "value": "Verdana" },
                            { "text": "Georgia", "value": "Georgia" },
                            { "text": "Times New Roman", "value": "Times New Roman" },
                            { "text": "Microsoft JhengHei", "value": "Microsoft JhengHei" },
                            { "text": "Trebuchet MS", "value": "Trebuchet MS" },
                            { "text": "Courier New", "value": "Courier New" },
                            { "text": "Impact", "value": "Impact" },
                            { "text": "Comic Sans MS", "value": "Comic Sans MS" },
                            { "text": "Consolas", "value": "Consolas" }
                        ],
                        showforecolor:false,
                        forecolor: [{ name: 'Black', style: 'background-color:#000000' },
                            { name: 'MediumBlack', style: 'background-color:#444444' },
                            { name: 'LightBlack', style: 'background-color:#666666' },
                            { name: 'DimBlack', style: 'background-color:#999999' },
                            { name: 'Gray', style: 'background-color:#CCCCCC' },
                            { name: 'DimGray', style: 'background-color:#EEEEEE' },
                            { name: 'LightGray', style: 'background-color:#F3F3F3' },
                            { name: 'White', style: 'background-color:#FFFFFF' },

                            //{ name: 'libreak', style: null },

                            { name: 'Red', style: 'background-color:#FF0000' },
                            { name: 'Orange', style: 'background-color:#FF9900' },
                            { name: 'Yellow', style: 'background-color:#FFFF00' },
                            { name: 'Lime', style: 'background-color:#00FF00' },
                            { name: 'Cyan', style: 'background-color:#00FFFF' },
                            { name: 'Blue', style: 'background-color:#0000FF' },
                            { name: 'BlueViolet', style: 'background-color:#8A2BE2' },
                            { name: 'Magenta', style: 'background-color:#FF00FF' },

                            //{ name: 'libreak', style: null },

                            { name: 'LightPink', style: 'background-color:#FFB6C1' },
                            { name: 'Bisque', style: 'background-color:#FCE5CD' },
                            { name: 'BlanchedAlmond', style: 'background-color:#FFF2CC' },
                            { name: 'LightLime', style: 'background-color:#D9EAD3' },
                            { name: 'LightCyan', style: 'background-color:#D0E0E3' },
                            { name: 'AliceBlue', style: 'background-color:#CFE2F3' },
                            { name: 'Lavender', style: 'background-color:#D9D2E9' },
                            { name: 'Thistle', style: 'background-color:#EAD1DC' },

                            { name: 'LightCoral', style: 'background-color:#EA9999' },
                            { name: 'Wheat', style: 'background-color:#F9CB9C' },
                            { name: 'NavajoWhite', style: 'background-color:#FFE599' },
                            { name: 'DarkSeaGreen', style: 'background-color:#B6D7A8' },
                            { name: 'LightBlue', style: 'background-color:#A2C4C9' },
                            { name: 'SkyBlue', style: 'background-color:#9FC5E8' },
                            { name: 'LightPurple', style: 'background-color:#B4A7D6' },
                            { name: 'PaleVioletRed', style: 'background-color:#D5A6BD' },

                            { name: 'IndianRed', style: 'background-color:#E06666' },
                            { name: 'LightSandyBrown', style: 'background-color:#F6B26B' },
                            { name: 'Khaki', style: 'background-color:#FFD966' },
                            { name: 'YellowGreen', style: 'background-color:#93C47D' },
                            { name: 'CadetBlue', style: 'background-color:#76A5AF' },
                            { name: 'DeepSkyBlue', style: 'background-color:#6FA8DC' },
                            { name: 'MediumPurple', style: 'background-color:#8E7CC3' },
                            { name: 'MediumVioletRed', style: 'background-color:#C27BA0' },

                            { name: 'Crimson', style: 'background-color:#CC0000' },
                            { name: 'SandyBrown', style: 'background-color:#E69138' },
                            { name: 'Gold', style: 'background-color:#F1C232' },
                            { name: 'MediumSeaGreen', style: 'background-color:#6AA84F' },
                            { name: 'Teal', style: 'background-color:#45818E' },
                            { name: 'SteelBlue', style: 'background-color:#3D85C6' },
                            { name: 'SlateBlue', style: 'background-color:#674EA7' },
                            { name: 'VioletRed', style: 'background-color:#A64D79' },

                            { name: 'Brown', style: 'background-color:#990000' },
                            { name: 'Chocolate', style: 'background-color:#B45F06' },
                            { name: 'GoldenRod', style: 'background-color:#BF9000' },
                            { name: 'Green', style: 'background-color:#38761D' },
                            { name: 'SlateGray', style: 'background-color:#134F5C' },
                            { name: 'RoyalBlue', style: 'background-color:#0B5394' },
                            { name: 'Indigo', style: 'background-color:#351C75' },
                            { name: 'Maroon', style: 'background-color:#741B47' },

                            { name: 'DarkRed', style: 'background-color:#660000' },
                            { name: 'SaddleBrown', style: 'background-color:#783F04' },
                            { name: 'DarkGoldenRod', style: 'background-color:#7F6000' },
                            { name: 'DarkGreen', style: 'background-color:#274E13' },
                            { name: 'DarkSlateGray', style: 'background-color:#0C343D' },
                            { name: 'Navy', style: 'background-color:#073763' },
                            { name: 'MidnightBlue', style: 'background-color:#20124D' },
                            { name: 'DarkMaroon', style: 'background-color:#4C1130' }]
                    }
                },
                mounted() {
                    self.proto.el = this.$el.children[1].firstChild;
                    self.bindUpload();
                    ap.core.ui.CONTROLS[this.$el.id]._control = this.$root.$children.filter((ctl, index) => { return ctl.$el.id == this.$el.id })[0];
                },
                computed: {
                    forecolorstyle: {
                        get: function () {},
                        set: function () {}
                    }
                },
                methods: {
                    clearDoc: function () {
                        if (confirm("确认要清空吗？")) {
                            self.proto.el.innerHTML = "";
                        }
                    },
                    doMouseout: function () {      
                        state = self.proto.saveSelection();   
                    },
                    printDoc: function () {
                        var oPrntWin = window.open("", "_blank", "width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
                        oPrntWin.document.open();
                        oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + self.proto.el.innerHTML + "<\/body><\/html>");
                        oPrntWin.document.close();
                    },
                    undo: function () {
                        self.proto.restoreSelection().focus().undo();
                    },
                    redo: function () {
                        self.proto.restoreSelection().focus().redo();
                    },
                    bold: function () {
                        state.restoreSelection().bold();
                        state.saveSelection();
                    },
                    underline: function () {    
                        state.restoreSelection().underline();
                        state.saveSelection();
                    },
                    italic: function () {
                        state.restoreSelection().focus().italic();
                        state.saveSelection();
                    },
                    justifyLeft: function () {
                        self.proto.restoreSelection().focus().justifyLeft();
                    },
                    justifyRight: function () {
                        self.proto.restoreSelection().focus().justifyRight();
                    },
                    justifyCenter: function () {
                        self.proto.restoreSelection().focus().justifyCenter();
                    },
                    justifyFull: function () {
                        self.proto.restoreSelection().focus().justifyFull();
                    },
                    toggleFontSize: function () {
                        this.showfontsize = !this.showfontsize;
                        this.showfontname = false;
                        this.showforecolor = false;
                    },
                    fontSize: function (val) {
                        state.restoreSelection().focus().fontSize(val);
                        state.saveSelection();
                    },
                    toggleFontName: function () {
                        this.showfontname = !this.showfontname;
                        this.showforecolor = false;
                        this.showfontsize = false;
                    },
                    fontName: function (val) {
                        state.restoreSelection().focus().fontName(val);
                        state.saveSelection();
                    },
                    toggleForeColor: function () {
                        this.showforecolor = !this.showforecolor;
                        this.showfontname = false;
                        this.showfontsize = false;
                    },
                    foreColor: function (val) {
                        val = val.split(":")[1];
                        state.restoreSelection().focus().foreColor(val);
                        state.saveSelection();
                    },
                    backColor: function (val) {
                        val = val.split(":")[1];
                        self.proto.restoreSelection().focus().backColor(val);
                    },
                    indent: function () {
                        self.proto.restoreSelection().focus().indent();
                    },
                    outdent: function () {
                        self.proto.restoreSelection().focus().outdent();
                    },
                    insertOrderedList: function () {
                        self.proto.restoreSelection().focus().insertOrderedList();
                    },
                    insertUnorderedList: function () {
                        self.proto.restoreSelection().focus().insertUnorderedList();
                    },
                    blockquote: function () {
                        if (navigator.userAgent.match(/MSIE/i)) {
                            self.proto.restoreSelection().focus().indent();
                        } else {
                            self.proto.restoreSelection().focus().formatBlock('<blockquote>');
                        }
                        
                    },
                    video: function () {
                        self.bindUploadFile();
                    },
                    selectall: function () {
                        state.restoreSelection().selectAll();
                        state.saveSelection();
                    },
                    removeformat: function () {
                        state.restoreSelection().focus().removeFormat();
                    },
                    createLink: function () {
                        var sLnk = prompt("请输入超链接地址", "http:\/\/");
                        if (sLnk && sLnk !== "http://") {
                            var sText = document.getSelection();
                            self.proto.restoreSelection().focus().insertHTML('<a href="' + sLnk + '" target="_blank">' + sLnk + '</a>');
                        }
                    },
                    unlink: function () {
                        self.proto.restoreSelection().unlink();
                    },
                    toHtml: function () {
                        if (this.htmlstate) {
                            var editor = document.querySelector("#input-edit");
                            var content = document.createTextNode(document.querySelector("#input-edit").innerHTML);
                            editor.innerHTML = "";
                            editor.setAttribute("contenteditable", "false");
                            var pre = document.createElement('pre');
                            pre.setAttribute("contenteditable", "true");
                            pre.appendChild(content);
                            editor.appendChild(pre);
                            this.htmlstate = false;
                        } else {
                            var code = document.querySelector("#input-edit pre").innerText;
                            document.querySelector("#input-edit").innerHTML = code;
                            document.querySelector("#input-edit").setAttribute("contenteditable", "true");
                            this.htmlstate = true;
                        }

                    }
                }
            });
            this.init();
        }
    }
}
//editor.BindUpload();