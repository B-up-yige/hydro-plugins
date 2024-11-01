// ==UserScript==
// @name         hydro抽奖小插件
// @namespace    http://tampermonkey.net/
// @version      1.2.8
// @description  https://github.com/B-up-yige/hydro-plugins
// @author       yige123
// @homepage     https://github.com/B-up-yige/hydro-plugins
// @downloadURL  https://raw.githubusercontent.com/B-up-yige/hydro-plugins/refs/heads/main/%E6%8A%BD%E5%A5%96%E5%B0%8F%E6%8F%92%E4%BB%B6.js
// @updateURL    https://raw.githubusercontent.com/B-up-yige/hydro-plugins/refs/heads/main/%E6%8A%BD%E5%A5%96%E5%B0%8F%E6%8F%92%E4%BB%B6.js

// @match        *://*.gxustoj.com/contest/*/scoreboard
// @match        *://*.gxustoj.com/d/*/contest/*/scoreboard

// @icon         https://www.google.com/s2/favicons?sz=64&domain=gxustoj.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("catch!");
    var board = document.getElementsByTagName("tbody")[0];
    var acm = board.getElementsByClassName("col--solved");
    var ioi = board.getElementsByClassName("col--total_score");
    var rank = board.getElementsByClassName("col--rank");
    var user = board.getElementsByClassName("col--user");
    var res, valid, single;
    var numberOfPeople = 4;

    //转换文本为临时文件
    function downloadTextFile(text, fileName) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    //储存结果
    function save(){
        var em = res.sort();
        var resName = [];
        for(var i = 0; i < res.length; i++){
            resName.push(user[em[i]].getElementsByTagName("a")[0].innerText);
        }
        downloadTextFile(resName.join("\n"), "抽奖结果");
    }

    //抽奖动画
    function draw(time, ms){
        res = valid.sort(() => Math.random() - 0.5).slice(0, numberOfPeople);
        for(var i = 0; i < user.length; i++){
            if(res.includes(i))user[i].style.backgroundColor = "#FF0080";
            else user[i].style.backgroundColor = "";
        }

        if(time)setTimeout(draw, ms, time-1, ms+25);
        else{
            var button = document.getElementById("1145141");
            button.innerHTML = "重新抽奖";

            button = document.getElementById("1433223");
            button.style.display = "inline";

            var div = document.getElementById("getNumberOfPeople");
            div.style.display = "inline";

            single = 0;
        }
    }

    //获取有效人数
    function getValid(scLimit){
        valid = [];

        if(acm.length){
            for(var i = 0; i < acm.length; i++){
                var solve = Number(acm[i].getElementsByTagName("span")[0].innerText.split("\n")[0]);
                var isRank = (rank[i].getElementsByTagName("span")[0].innerText != "*");
                if(solve > 0 && isRank){
                    valid.push(i);
                }
            }
        }else{
            for(var i = 0; i < ioi.length; i++){
                var solve = Number(ioi[i].getElementsByTagName("span")[0].innerText);
                var isRank = (rank[i].getElementsByTagName("span")[0].innerText != "*");
                if(parseInt(solve) > scLimit && isRank){
                    valid.push(i);
                }
            }
        }
    }

    //开始抽奖
    function start(){
        if(single)return ;
        else single = 1;

        var button = document.getElementById("1145141");
        button.innerHTML = "抽奖中...";
        button = document.getElementById("1433223");
        button.style.display = "none";
        var div = document.getElementById("getNumberOfPeople");
        var input = div.getElementsByTagName("input")[0];
        div.style.display = "none";

        numberOfPeople = input.value;

        var scLimit = 0;
        if(ioi.length){
            div = document.getElementById("scoreLimit");
            input = div.getElementsByTagName("input")[0];
            scLimit = input.value;
        }
        getValid(scLimit);

        draw(20, 25);
    }

    getValid(0);

    var button = document.createElement("button");
    button.innerHTML = "获取有效参与人数";
    button.id = "getValidNumber";
    button.onclick = function (){
        var scLimit = 0;
        if(ioi.length){
            div = document.getElementById("scoreLimit");
            input = div.getElementsByTagName("input")[0];
            scLimit = input.value;
        }
        getValid(scLimit);
        alert("有效参与人数为：" + valid.length);
    };
    button.className = "button";
    document.getElementsByClassName("section__header")[0].appendChild(button);

    button = document.createElement("button");
    button.innerHTML = "开始抽奖";
    button.id = "1145141";
    button.onclick = start;
    button.className = "button";
    document.getElementsByClassName("section__header")[0].appendChild(button);

    button = document.createElement("button");
    button.innerHTML = "保存结果";
    button.id = "1433223";
    button.onclick = save;
    button.className = "button";
    button.style.display = "none";
    document.getElementsByClassName("section__header")[0].appendChild(button);

    var input = document.createElement("input");
    input.value = Math.min(numberOfPeople, user.length);
    input.type = "number";
    input.max = valid.length;
    input.min = 1;

    var div = document.createElement("div")
    div.innerHTML = "人数：";
    div.id = "getNumberOfPeople";
    div.style.marginLeft = "10px";
    div.style.display = "inline";
    div.appendChild(input);
    document.getElementsByClassName("section__header")[0].appendChild(div);

    if(ioi.length){
        input = document.createElement("input");
        input.value = 0;
        input.type = "number";
        input.min = 0;

        div = document.createElement("div")
        div.innerHTML = "分数阈值：";
        div.id = "scoreLimit";
        div.style.marginLeft = "10px";
        div.style.display = "inline";
        div.appendChild(input);
        document.getElementsByClassName("section__header")[0].appendChild(div);
    }
})();