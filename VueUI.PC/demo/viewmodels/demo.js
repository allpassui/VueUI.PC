var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ap;
(function (ap) {
    var ui;
    (function (ui) {
        var demo = (function (_super) {
            __extends(demo, _super);
            function demo() {
                _super.call(this, "");
                this.inputvalue = "";
                this.selectindex = { "z-index": "100" };
            }
            demo.prototype.initAtInteractive = function () {
                this.radiobutton = new ap.ui.widget.radiobutton("rb");
                this.checkbox = new ap.ui.widget.checkbox("cb");
                this.input = new ap.ui.widget.input("input");
                this.select = new ap.ui.widget.select("select");
                this.savebtn = new ap.ui.widget.buttons("save");
                this.confirmbtn = new ap.ui.widget.buttons("confirm");
                this.deletebtn = new ap.ui.widget.buttons("delete");
                this.addbtn = new ap.ui.widget.buttons("add");
                this.cancelbtn = new ap.ui.widget.buttons("cancel");
                this.searchbtn = new ap.ui.widget.buttons("search");
                this.backbtn = new ap.ui.widget.buttons("back");
                this.importbtn = new ap.ui.widget.buttons("import");
                this.exportbtn = new ap.ui.widget.buttons("export");
                this.downloadbtn = new ap.ui.widget.buttons("download");
                this.uploadbtn = new ap.ui.widget.buttons("upload");
                this.textarea = new ap.ui.widget.textarea("textarea");
                this.editor = new ap.ui.widget.editor("editor");
                this.switch = new ap.ui.widget.switchbutton("switch");
                this.table = new ap.ui.widget.table("table");
                this.pager = new ap.ui.widget.pager("pager");
                this.shuffling = new ap.ui.widget.shuffling("shuffling");
                this.datepicker = new ap.ui.widget.datepicker("dp");
                //this.slider = new ap.ui.widget.slider("slider");
                this.scroll = new ap.ui.widget.scroll("scroll");
            };
            demo.prototype.initAtComplete = function () {
            };
            demo.prototype.renderDataAsync = function (evt) {
            };
            demo.prototype.renderData = function () {
                //radiobutton
                this.radiobutton.options = [
                    { value: 1, text: "男" },
                    { value: 2, text: "女" }
                ];
                this.radiobutton.value = 1;
                //input
                this.input.value = 222;
                //checkbox
                this.checkbox.options = [{ text: "这个是checkbox选择之一哦，可以进行多选哦！", value: 1 }, { text: "这个是checkbox选择之二哦，可以进行多选哦！", value: 2 }, { text: "这个是checkbox选择之三哦，可以进行多选哦！", value: 3 }, { text: "这个是checkbox选择之四哦，可以进行多选哦！", value: 4 }];
                this.checkbox.value = [2];
                //select
                this.select.options = [
                    { value: '1', text: "allpass1" },
                    { value: '2', text: "allpass2" },
                    { value: '3', text: "allpass3" },
                    { value: '4', text: "allpass4" },
                    { value: '5', text: "allpass5" },
                    { value: '6', text: "allpass6" },
                    { value: '7', text: "allpass7" },
                    { value: '8', text: "allpass8" },
                    { value: '9', text: "allpass9" },
                    { value: '10', text: "allpass10" }
                ];
                this.select.text = "请选择";
                //textarea
                this.textarea.value = 43453;
                //switchButton
                this.switch.options = [{ value: "丫丫丫", checked: true }];
                //Table
                this.table.columns = [
                    { 'field': 'StudentNumber', 'text': '学号', 'width': '40px', 'textAlign': 'center' },
                    { 'field': 'RealName', 'text': '真实姓名', 'width': '40px', 'textAlign': 'center' },
                    { 'field': 'Email', 'text': '邮箱', 'width': '40px', 'textAlign': 'center' },
                    { 'field': 'Password', 'text': '密码', 'width': '40px', 'textAlign': 'center' },
                    { 'field': 'MobileNo', 'text': '手机', 'width': '40px', 'textAlign': 'center' },
                    { 'field': 'operate', 'width': '40px', 'text': '操作', 'textAlign': 'center', 'operations': [{ 'type': 'edit', 'text': '编辑' }, { 'type': 'delete', 'text': '删除' }] },
                ];
                this.table.checkbox = {
                    'visible': true,
                    'width': '20px'
                };
                this.table.tabledata = [
                    { "StudentNumber": "201609001", "Sex": "男", "RealName": "阿西", "Email": "123@qq.com", "MobileNo": "13851888888", "Password": "111111" },
                    { "StudentNumber": "201609002", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                    { "StudentNumber": "201609003", "Sex": "男", "RealName": "阿西", "Email": "123@qq.com", "MobileNo": "13851888888", "Password": "111111" },
                    { "StudentNumber": "201609004", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                    { "StudentNumber": "201609005", "Sex": "男", "RealName": "阿西", "Email": "123@qq.com", "MobileNo": "13851888888", "Password": "111111" },
                    { "StudentNumber": "201609006", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                    { "StudentNumber": "201609007", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                    { "StudentNumber": "201609008", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                    { "StudentNumber": "201609009", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                    { "StudentNumber": "201609010", "Sex": "男", "RealName": "阿东", "Email": "124@qq.com", "MobileNo": "13851888884", "Password": "111111" },
                ];
                //表体操作
                this.table.operateClick = function (index, value, event) {
                    if (value == "edit") {
                        Dialog.Iframe('编辑班级', 500, 350, 'demoedit.html');
                    }
                    else if (value == "delete") {
                        self.delOne(self.getValue("table", "tabledata")[index].ClassInfoID);
                    }
                    //else if (value == "view") {
                    //    window.location.href = "../views/companylook.html");
                    //}
                };
                //分页
                this.pager.pageCount = 3;
                this.pager.currentPage = 2;
                //日期控件
                this.datepicker.format = "yyyy-MM-dd hh:mm";
                this.datepicker.value = "2017/02/14";
                this.datepicker.disableddate = { "type": "<", "value": "2017-01-23" };
                //轮播图
                this.shuffling.options = ["../images/l.jpg", "../images/shadow.jpg", "../images/l.jpg", "../images/shadow.jpg"];
                //滚动条
                this.scroll.scrollinit = 1;
                //slider
                //var obj = { interval: 1 };
                //obj['total'] = 10;
                //var index = 3;
                //var scoreL = Math.round(10 / (index + 1));
                //var scoreM = Math.round(2 * scoreL);
                //var scoreH = 3 * scoreL;
                //obj["scoreL"] = scoreL;
                //obj["scoreM"] = scoreM;
                //obj["scoreH"] = scoreH;
                //this.slider.options = obj;
            };
            return demo;
        })(ap.core.page);
        ui.demo = demo;
        var uidemo = new ap.ui.demo();
    })(ui = ap.ui || (ap.ui = {}));
})(ap || (ap = {}));
