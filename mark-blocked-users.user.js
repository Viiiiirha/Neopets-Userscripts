// ==UserScript==
// @name         Mark Blocked Users
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  Mark users you have blocked
// @author       Virha
// @match        https://www.neopets.com/neoboards/boardlist.phtml?*
// @match        https://www.neopets.com/neoboards/topic.phtml*
// @match        https://www.neopets.com/block.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    var markedColor = "red";
    var list = GM_getValue("list", [])
    if (window.location.href.includes("block")) {
        document.querySelectorAll("#content > table > tbody > tr > td.content > form > table > tbody > tr > td:nth-child(1)").forEach(element => {
            var name = element.textContent;
            if (name != "User Blocked" && !list.includes(name)) {
                list.push(name);
            }
        });
        GM_setValue("list", list);
    }

    if (window.location.href.includes("boardlist")) {
        for (var user of document.querySelectorAll(".author")) {
            console.log(user.textContent.trim());
            if (list.includes(user.textContent.trim())) {
                user.style.color = markedColor;
                var board = user.parentNode.querySelector(".boardTopicTitle a");
                board.onclick = function(event) {
                    if (!confirm("You have this user blocked. Are you sure you want to open their board?")) {
                        event.preventDefault();
                    }
                };

            }
        }
    }

    if (window.location.href.includes("topic")) {
        for (var poster of document.querySelectorAll(".postAuthorName")) {
            if (list.includes(poster.textContent.trim())) {
                poster.style.color = markedColor;

            }
        }
    }
})();
