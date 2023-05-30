(function (window, document){

    let mJs = function (selector) {
        return new mJs.prototype.init(selector);
    };


    mJs.prototype = {
        init: function (selector) {

        },
    };

    mJs.prototype.mSelector = function (select){
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
        let textSpan = textDiv.appendChild(document.createElement("span"));
        textSpan.innerText = "请选择";
        let optionUl = selectBox.appendChild(document.createElement("ul"));
        for (let i = 0; i < options.length; i++) {
            let optionLi = optionUl.appendChild(document.createElement("li"));
            optionLi.setAttribute("data-value", options[i].value);
            optionLi.innerText = options[i].text;
            if (options[i].selected) {
                valueInput.value = options[i].value;
                textSpan.innerText = options[i].text;
            }
        }
        document.onclick = event => {
            let trigger = true;
            let text, box, value, span, ul;
            let target = event.target;
            let tagName = target.tagName.toUpperCase();
            if (tagName === "DIV") {
                box = target.parentNode;
            } else if (tagName === "LI" || tagName === "SPAN") {
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
            span = text.querySelector("span");
            ul = box.querySelector("ul");
            if (tagName === "DIV" || tagName === "SPAN") {
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
                        span.innerText = lis[i].innerText;
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



    // 美化页面上的select
    function cssSelect(){
        let selects = document.querySelectorAll("select.select");
        for (let i = 0; i < selects.length; i++) {
            mJs().mSelector(selects[i]);
        }
    }


    //将构造函数挂载到全局window
    mJs.prototype.init.prototype = mJs.prototype;
    window.mJs = mJs;


    {
        cssSelect();
    }

    return mJs;

})(window, document);