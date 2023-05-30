(function (window, document) {

    let mJs = function (selector) {
        return new mJs.prototype.init(selector);
    };


    mJs.prototype = {
        length: 0,
        constructor: mJs,
        init: function (selector) {
            if (typeof selector === "string") {
                let elements = document.querySelectorAll(selector);
                for (let i = 0; i < elements.length; i++) {
                    this[i] = elements[i];
                }
                this.length = elements.length;
                return this;
            }
        },

    };
    mJs.isNull = function (obj) {
        return obj === undefined || obj === null;
    }
    mJs.isBlank = function (str) {
        return this.isNull(str) || str.trim() === "";
    }
    mJs.isNotNull = function (obj) {
        return !this.isNull(obj);
    }
    mJs.isNotBlank = function (str) {
        return !this.isBlank(str);
    }

    mJs.mSelector = function (select) {
        select.classList.add("select");
        let options = select.querySelectorAll("option");
        let selectBox = select.parentNode.appendChild(document.createElement("div"));
        selectBox.className = "select-box";
        selectBox.setAttribute("collapse", "true");
        let valueDiv = selectBox.appendChild(document.createElement('div'));
        valueDiv.className = "select-value";
        let valueInput = valueDiv.appendChild(document.createElement("input"));
        valueInput.type = "hidden";
        valueInput.name = select.name;
        let textDiv = selectBox.appendChild(document.createElement("div"));
        textDiv.className = "select-text";
        textDiv.innerText = "请选择";
        let optionUl = selectBox.appendChild(document.createElement("ul"));
        for (let i = 0; i < options.length; i++) {
            let optionLi = optionUl.appendChild(document.createElement("li"));
            optionLi.setAttribute("data-value", options[i].value);
            optionLi.innerText = options[i].text;
            if (options[i].selected) {
                valueInput.value = options[i].value;
                textDiv.innerText = options[i].text;
            }
        }
        // 目前这里还有一个问题：如果原来document本身就有click方法，那么原来的方法不再执行，或者后面新写了document的click事件，那么下面的逻辑就不会再执行
        document.onclick = event => {
            let trigger = true;
            let text, box, value, ul;
            let target = event.target;
            let tagName = target.tagName.toUpperCase();
            if (tagName === "DIV") {
                box = target.parentNode;
            } else if (tagName === "LI") {
                box = target.parentNode.parentNode;
            } else {
                trigger = false;
            }
            let uls = document.querySelectorAll(".select-box > ul");
            for (let i = 0; i < uls.length; i++) {
                if (uls[i].parentNode !== box) {
                    uls[i].style.height = "0";
                    uls[i].parentNode.setAttribute("collapse", "true");
                }
            }
            if (!trigger || !box.classList.contains("select-box")) {
                return;
            }
            value = box.querySelector("div.select-value > input")
            text = box.querySelector("div.select-text");
            ul = box.querySelector("ul");
            if (tagName) {
                if (box.getAttribute("collapse") === "true") {
                    box.setAttribute("collapse", "false");
                    ul.style.height = "auto";
                } else {
                    box.setAttribute("collapse", "true");
                    ul.style.height = "0";
                }
            } else {
                let lis = ul.querySelectorAll("li");
                for (let i = 0; i < lis.length; i++) {
                    if (target === lis[i]) {
                        value.value = lis[i].getAttribute("data-value");
                        text.innerText = lis[i].innerText;
                        if (box.getAttribute("collapse") === "true") {
                            box.setAttribute("collapse", "false");
                            ul.style.height = "auto";
                        } else {
                            box.setAttribute("collapse", "true");
                            ul.style.height = "0";
                        }
                    }
                }
            }
        }
    }

    mJs.extend = mJs.prototype.extend = function () {

    }


    mJs.mTable = {
        data: [],
        total: null,
        checkbox: false,
        sequence: false,
        columns: [],
        tools: null,
        eTable: null,
        eTableContainer: null,
        // eQueryBox: null,
        eTableBox: null,
        eTableContent: null,
        eTableTool: null,
        eTableNavigation: null,
        eTableHead: null,
        eTableBody: null,
        __init__: function (option) {
            if (mJs.isBlank(option.tableId)) {
                throw "argument's property tableId can't be null"
            }
            this.eTable = document.querySelector(option.tableId);
            this.eTableHead = this.eTable.querySelector("thead");
            if (mJs.isNull(this.eTableHead)) {
                this.eTableHead = this.eTable.appendChild(document.createElement("thead"));
            }
            this.eTableContent = this.eTable.parentNode;
            if (mJs.isNull(this.eTableContent) || !this.eTableContent.classList.contains("table-content")) {
                throw "error";
            }
            this.eTableBox = this.eTableContent.parentNode;
            if (mJs.isNull(this.eTableBox) || !this.eTableBox.classList.contains("table-box")) {
                throw "error";
            }
            this.eTableContainer = this.eTableBox.parentNode;
            if (mJs.isNull(this.eTableContainer) || !this.eTableContainer.classList.contains("table-container")) {
                throw "error";
            }
            // this.eQueryBox = this.eTableContainer.querySelector(".query-box");
            this.eTableTool = this.eTableBox.querySelector(".table-tool");
            this.eTableNavigation = this.eTableBox.querySelector(".table-pagination");
            this.checkbox = option.checkbox || this.checkbox;
            this.sequence = option.sequence || this.sequence;
            // 后面实现复杂的表头
            this.columns = option.columns[option.columns.length - 1] || this.columns;
            this.tools = option.tools || this.tools;
            this.data = [
                {
                    name: "信号旗",
                    url: "111",
                    method: 1
                },
                {
                    name: "阿尔法",
                    url: "222",
                    method: 2
                },
                {
                    name: "野小子",
                    url: "333",
                    method: 3
                }

            ]
        },
        __getTool__: function (tool) {
            let eLi = document.createElement("li");
            let eA = eLi.appendChild(document.createElement("a"));
            switch (tool.toUpperCase()) {
                case "REFRESH":
                    let eIcon = eA.appendChild(document.createElement("i"));
                    eIcon.className = "micon micon-refresh";
                    break;
                default:
                    eLi = null;
                    break;
            }
            return eLi;
        },
        __createDefaultTool__: function () {
            if (mJs.isNotNull(this.tools) && this.tools.length > 0) {
                if (mJs.isNull(this.eTableTool)) {
                    this.eTableTool = document.createElement("div");
                    this.eTableTool.className = "table-tool";
                    this.eTableBox.insertBefore(this.eTableTool, this.eTableContent);
                }
                let eDefaultTool = this.eTableTool.appendChild(document.createElement("div"));
                eDefaultTool.classList.add("default-tools");
                let eDefaultToolUl = eDefaultTool.appendChild(document.createElement("ul"));
                eDefaultToolUl.classList.add("inline");
                for (let i = 0; i < this.tools.length; i++) {
                    let eToolLi = this.__getTool__(this.tools[i]);
                    if (mJs.isNotNull(eToolLi)) {
                        eDefaultToolUl.appendChild(eToolLi);
                    }
                }
            }
        },
        __createTableHead__: function () {
            let columns = this.columns;
            let tr = this.eTableHead.appendChild(document.createElement("tr"));
            if (this.sequence) {
                tr.appendChild(document.createElement("td"));
            }
            if (this.checkbox) {
                let td = tr.appendChild(document.createElement("td"));
                let div = td.appendChild(document.createElement("div"));
                div.className = "form-cell";
                let checkbox = div.appendChild(document.createElement("input"));
                checkbox.type = "checkbox";
                checkbox.className = "checkbox";
            }
            for (let i = 0; i < columns.length; i++) {
                let td = tr.appendChild(document.createElement("td"));
                td.innerText = columns[i].title;
            }
        },

        __createTableBody__: function () {
            let columns = this.columns;
            let data = this.data;
            let eTableBody = this.eTable.appendChild(document.createElement("tbody"));
            for (let row = 0; row < data.length; row++) {
                let tr = eTableBody.appendChild(document.createElement("tr"));
                if (this.sequence) {
                    let td = tr.appendChild(document.createElement("td"));
                    td.innerText = row + 1;
                }
                if (this.checkbox) {
                    let td = tr.appendChild(document.createElement("td"));
                    let div = td.appendChild(document.createElement("div"));
                    div.className = "form-cell";
                    let checkbox = div.appendChild(document.createElement("input"));
                    checkbox.type = "checkbox";
                    checkbox.className = "checkbox";
                }
                for (let col = 0; col < columns.length; col++) {
                    let td = tr.appendChild(document.createElement("td"));
                    let div = td.appendChild(document.createElement("div"));
                    if (mJs.isNotNull(columns[col].formatter)) {
                        div.className = "table-cell";
                        div.innerHTML = columns[col].formatter.call(document, data[row][columns[col].field], data[row], row);
                    } else if (mJs.isNotNull(columns[col].editor)) {
                        let type = columns[col].editor.type || "text";
                        div.className = "form-cell";
                        if (type === "text") {
                            let input = div.appendChild(document.createElement("input"));
                            input.type = type;
                            input.className = "input";
                            input.value = data[row][columns[col].field];
                        }
                        if (type === "select") {
                            let select = div.appendChild(document.createElement("select"));
                            select.className = "select";
                            let dict = columns[col].editor.data;
                            for (let i = 0; i < dict.length; i++) {
                                let option = select.appendChild(document.createElement("option"));
                                option.value = dict[i].value;
                                option.text = dict[i].text;
                                if (data[row][columns[col].field] == dict[i].value) {
                                    option.selected = true;
                                }
                            }
                        }
                    } else {
                        div.className = "table-cell";
                        let span = div.appendChild(document.createElement("span"));
                        span.innerText = data[row][columns[col].field];
                    }

                }
            }
        },
        __createTablePagination__: function () {

        },
        table: function (options) {
            this.__init__(options);
            this.__createDefaultTool__();
            this.__createTableHead__();
            this.__createTableBody__();
            this.__createTablePagination__();
            cssSelect();
        }
    }


    // 美化页面上的select
    function cssSelect() {
        let selects = document.querySelectorAll("select.select");
        for (let i = 0; i < selects.length; i++) {
            mJs.mSelector(selects[i]);
        }
    }


    //将构造函数挂载到全局window
    mJs.prototype.init.prototype = mJs.prototype;
    window.mJs = mJs;

    // 没美化页面上的select
    {
        cssSelect();
    }

    return mJs;

})(window, document);