// ==UserScript==
// @name         hydro抽奖小插件
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  https://github.com/B-up-yige/hydro-plugins
// @author       yige123
// @homepage     https://github.com/B-up-yige/hydro-plugins
// @downloadURL  https://github.com/B-up-yige/hydro-plugins/raw/refs/heads/main/lottery%20draw.js
// @updateURL    https://github.com/B-up-yige/hydro-plugins/raw/refs/heads/main/lottery%20draw.js

// @match        *://*gxustoj.com/*/contest/*/scoreboard
// @match        *://*gxustoj.com/contest/*/scoreboard

// @icon         https://www.google.com/s2/favicons?sz=64&domain=gxustoj.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("catch!");
    var board = document.getElementsByTagName("tbody")[0];
    var acm = board.getElementsByClassName("col--solved");
    var ioi = board.getElementsByClassName("col--total_score");
    var rank = board.getElementsByClassName("col--rank");
    var user = board.getElementsByClassName("col--user");
    var res;

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

    //开始抽奖
    function start(){

        var valid = [];

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
                if(solve > 0 && isRank){
                    valid.push(i);
                }
            }
        }
        
        console.log(valid);

        res = valid.sort(() => Math.random() - 0.5).slice(0, 4);
        console.log(res);
        for(i = 0; i < user.length; i++){
            if(res.includes(i))user[i].style.backgroundColor = "#FF0080";
            else user[i].style.backgroundColor = "";
        }

        var button = document.getElementById("1145141");
        button.innerHTML = "保存结果";
        button.onclick = save;

        button = document.getElementById("1433223");
        button.style.display = "inline";
    }

    var button = document.createElement("button");
    button.innerHTML = "重新抽奖";
    button.id = "1433223";
    button.onclick = start;
    button.className = "button";
    button.style.display = "none";
    document.getElementsByClassName("section__header")[0].appendChild(button);

    button = document.createElement("button");
    button.innerHTML = "开始抽奖";
    button.id = "1145141";
    button.onclick = start;
    button.className = "button";
    document.getElementsByClassName("section__header")[0].appendChild(button);
})();