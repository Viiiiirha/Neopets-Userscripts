// ==UserScript==
// @name         Flagged Users 
// @namespace    http://tampermonkey.net/
// @version      2025-06-11
// @description  Add a list of flagged users and mark flagged and blocked users visually
// @author       Virha
// @match        https://www.neopets.com/block.phtml*
// @match        https://www.neopets.com/neoboards/boardlist.phtml?*
// @match        https://www.neopets.com/neoboards/topic.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';
    const blockedColor = "red";
    const flaggedColor = "#e8ae02";
    let flaggedUserList = GM_getValue("flagged",[]);
    let blockedUserList = GM_getValue("blocked", []);
    console.log("Flagged:");
    console.log(flaggedUserList);

    if (!Array.isArray(flaggedUserList)){
        flaggedUserList = [];
        GM_setValue("flagged",[]);
        console.log("Error Encountered. Flagged list has been reset. Apologies.");
    }

    if (window.location.href.includes("block")) {

        //update blocklist
        let tempList = [];
        document.querySelectorAll("#content > table > tbody > tr > td.content > form > table > tbody > tr > td:nth-child(1)").forEach(element => {
            const blockedUN = element.textContent.trim();
            if (blockedUN != "User Blocked") {
                tempList.push(blockedUN);
                if (flaggedUserList.includes(blockedUN)){
                    let lt = flaggedUserList.filter(item => item !== blockedUN);
                    GM_setValue("flagged",lt);
                }
            }
        });
        GM_setValue("blocked", tempList);
    }
    //set up flagged UI and fill names
    const form = document.querySelector("#content > table > tbody > tr > td.content > form");
    if (form && form.parentNode) {
        const container = document.createElement("div");
        const flag = document.createElement("b");
        flag.textContent = "Flagged Users List";
        const desc = document.createElement("p");
        desc.textContent = "This is not native Neopets functionality and is added by a userscript. Flagged users will have their usernames appear in a specific color to aid in remembering when a user isn't necessarily a problem, but still one to be wary of. They will not be prevented from engaging with you in any manner and this is a purely visual change.";
        const table = document.createElement("table");
        table.setAttribute("width", "400");
        table.setAttribute("id", "flaggedUsers");
        table.setAttribute("align", "center");
        table.setAttribute("border", "0");
        table.setAttribute("cellpadding", "3");
        table.setAttribute("cellspacing", "0");
        table.style.border = "1px solid #000000";
        table.style.borderBottom = 0;
        const css = document.createElement("style");
        css.textContent = `
            #flaggedUsers td {
            border-bottom: 1px solid #000000;
            }
            .tableHeader {
            background-color: #2367B5;
            color: #FFFFFF;
            font-weight: bolder;
            height: 22px;
            font-size: 9pt;
            text-align: left;
            padding-left: 3px;
            }
            #flaggedUsers td:nth-child(2) {
            text-align:center;
            }
            #flaggedUsers tr:nth-child(2n+1) {
            background-color: #f6f6f6;
            }
            `
            table.appendChild(document.createElement("tr"));
            const listHead = document.createElement("td");
            listHead.textContent = "User Flagged";
            listHead.classList.add("tableHeader");
            const remHead = document.createElement("td");
            remHead.textContent = "Remove?";
            remHead.classList.add("tableHeader");
            appendAll(table.querySelector("tr"),[listHead,remHead]);
            appendAll(container,[css,flag,desc,table]);
            replaceTopForm();
            form.parentNode.insertBefore(container, form.nextSibling);
            fillTable(flaggedUserList);
        }



    function appendAll(cont, list){
        for (const item of list){
            cont.appendChild(item);
        }
    }

    function replaceTopForm() {
        const td = document.createElement("td");
        td.setAttribute("width","33%");
        td.setAttribute("height","100%");
        const d = document.createElement("div");
        d.classList.add("contentModule");
        d.setAttribute("height","100%");
        const tab = document.createElement("table");
        tab.setAttribute("cellpadding",3);
        tab.setAttribute("cellspacing",0);
        tab.setAttribute("border",0);
        tab.classList.add("contentModuleTable");
        const tr1 = document.createElement("tr");
        const td2 = document.createElement("td");
        td2.classList.add("contentModuleHeaderAlt");
        const b = document.createElement("b");
        b.textContent = "Add User to Flagged List";
        const tr2 = document.createElement("tr");
        const td3 = document.createElement("td");
        td3.setAttribute("align","left");
        td3.setAttribute("valign","top");
        td3.classList.add("contentModuleContent");
        const tab2 = document.createElement("table");
        tab2.setAttribute("width","100%");
        tab2.setAttribute("cellspacing",0);
        tab2.setAttribute("border",0);
        tab2.setAttribute("cellpadding",0);
        tab2.setAttribute("height","100%");
        const tr3 = document.createElement("tr");
        const td4 = document.createElement("td");
        td4.setAttribute("align","center");
        const b2 = document.createElement("b");
        b2.textContent="Username";
        const input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("id","flaggedInput");
        input.setAttribute("size",20);
        input.setAttribute("maxlength",20);
        const tr4 = document.createElement("tr");
        const td5 = document.createElement("td");
        td5.setAttribute("valign","bottom");
        const br = document.createElement("br");
        const d2 = document.createElement("div");
        d2.setAttribute("align","center");
        d2.setAttribute("style","padding: 4px; background-color: #EFEFEF;");
        const enter = document.createElement("button");
        enter.textContent = "Flag User";
        td.appendChild(d);
        d.appendChild(tab);
        tab.appendChild(tr1);
        tr1.appendChild(td2);
        td2.appendChild(b);
        tab.appendChild(tr2);
        tr2.appendChild(td3);
        td3.appendChild(tab2);
        tab2.appendChild(tr3);
        tr3.appendChild(td4);
        td4.appendChild(b2);
        td4.appendChild(document.createElement("br"));
        td4.appendChild(input);
        tab2.appendChild(tr4);
        tr4.appendChild(td5);
        td5.appendChild(br);
        td5.appendChild(d2);
        d2.appendChild(enter);
        document.querySelector("#content > table > tbody > tr > td.content > table > tbody > tr > td:nth-child(2)").style.display="None";
        document.querySelector("#content > table > tbody > tr > td.content > table > tbody > tr").insertBefore(td,document.querySelector("#content > table > tbody > tr > td.content > table > tbody > tr > td:nth-child(2)"));

        enter.onclick = async function() {
            const name = document.querySelector("#flaggedInput").value.trim().toLowerCase();
            if (name === "") {
                alert("Oops! Cannot flag a user without a username :)");
                return;
            }
            let flaggedList = await GM_getValue("flagged", []);
            let blocklist = [];
            document.querySelectorAll("#content > table > tbody > tr > td.content > form > table > tbody > tr > td:nth-child(1)").forEach(element => {
                const un = element.textContent.trim();
                if (un !== "User Blocked" && !blocklist.includes(un)) {
                    blocklist.push(un);
                }
            });
            if (blocklist.includes(name)) {
                alert("You have this user blocked. A user can either be blocked or flagged, not both. Unblock this user if you'd like to flag them instead.");
                return;
            }
            if (flaggedList.includes(name)) {
                alert("User is already flagged. Perhaps you'd like to block them instead?");
                return;
            }
            flaggedList.push(name);
            await GM_setValue("flagged", flaggedList.sort());
            location.reload();
        };
    }

    function fillTable( list) {
        const table = document.querySelector("#flaggedUsers");
        for (const user of list){
            const newRow = document.createElement("tr");
            newRow.classList.add("flaggedUserRow");
            const nameLab = document.createElement("td");
            nameLab.textContent = user;
            nameLab.classList.add("nameLabel");
            const remTD = document.createElement("td");
            const rem = document.createElement("input");
            rem.setAttribute("type","checkbox");
            remTD.appendChild(rem);
            newRow.appendChild(nameLab);
            newRow.appendChild(remTD);
            table.appendChild(newRow);
        }
        const unflagRow = document.createElement("tr");
        const unflagTD = document.createElement("td");
        unflagTD.setAttribute("colspan",2);
        unflagTD.setAttribute("align","center");
        unflagTD.style.backgroundColor = "#DEDEDE";
        const unflag = document.createElement("button");
        unflag.textContent = "Unflag";
        unflagTD.appendChild(unflag);
        unflagRow.appendChild(unflagTD);
        table.appendChild(unflagRow);

        unflag.onclick = async function(){
            const flaggedList = [];
            for (const userRow of document.querySelectorAll(".flaggedUserRow")){
                const check = userRow.querySelector("input");
                if (!check.checked){
                    flaggedList.push(userRow.querySelector(".nameLabel").textContent.trim());
                }
            }
            await GM_setValue("flagged", flaggedList.sort());
            location.reload();
        }

    }
    //Change name color in boardlist and add confirmation when board is clicked on
    if (window.location.href.includes("boardlist")) {

        for (const user of document.querySelectorAll(".author")) {
            const board = user.parentNode.querySelector(".boardTopicTitle a");
            if (blockedUserList.includes(user.textContent.trim())) {
                user.style.color = blockedColor;
                board.onclick = function(event) {
                    if (!confirm("You have this user blocked. Are you sure you want to open their board?")) {
                        event.preventDefault();
                    }
                };

            }
            if (flaggedUserList.includes(user.textContent.trim())) {
                user.style.color = flaggedColor;
                board.onclick = function(event) {
                    if (!confirm("You have this user flagged. Are you sure you want to open their board?")) {
                        event.preventDefault();
                    }
                };

            }
        }
    }
    if (window.location.href.includes("topic")) {
        for (const post of document.querySelectorAll(".boardPostByline")) {
            var flagButton = document.createElement("div");
            flagButton.appendChild(document.createElement("p"));
            flagButton.firstChild.textContent = "FLAG USER";
            flagButton.classList.add("flagUser");
            const css = document.createElement("style");
            css.textContent = `
            .flagUser {
            cursor: pointer;
            color: #999;
            font-size: 10px;
            position:absolute;
            bottom:0;
            left:8px;
            }
            .postPet {
            margin-bottom:12px;
            }
            `;

            appendAll(post,[css,flagButton]);
            const poster=post.querySelector(".postAuthorName");
            if (blockedUserList.includes(poster.textContent.trim())) {
                poster.style.color = blockedColor;
                post.querySelector(".flagUser").remove();
            }
            if (flaggedUserList.includes(poster.textContent.trim())) {
                poster.style.color = flaggedColor;
                post.querySelector(".flagUser").firstChild.textContent = "UNFLAG USER";


            }
            flagButton.onclick = function() {
                if (flaggedUserList.includes(poster.textContent.trim())){
                    let tempList = flaggedUserList.filter(item => item !== poster.textContent.trim());
                    GM_setValue("flagged",tempList);
                    let postsByUser = Array.from(document.querySelectorAll("li")).filter(curPost => {
                        const authorEl = curPost.querySelector(".postAuthorName");
                        return authorEl && authorEl.textContent.trim() === poster.textContent.trim();
                    });
                    for (var po of postsByUser) {
                        po.querySelector(".postAuthorName").style.color = "inherit";
                        po.querySelector(".flagUser").firstChild.textContent = "FLAG USER";
                    }
                }
                else {
                    flaggedUserList.push(poster.textContent.trim());
                    GM_setValue("flagged",flaggedUserList);
                    let postsByUser = Array.from(document.querySelectorAll("li")).filter(curPost => {
                        const authorEl = curPost.querySelector(".postAuthorName");
                        return authorEl && authorEl.textContent.trim() === poster.textContent.trim();
                    });
                    for (var pos of postsByUser) {
                        pos.querySelector(".postAuthorName").style.color = flaggedColor;
                        pos.querySelector(".flagUser").firstChild.textContent = "UNFLAG USER";
                    }
                }
            }
        }
    }
})();
