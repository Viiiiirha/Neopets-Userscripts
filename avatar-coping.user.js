// ==UserScript==
// @name         Avatar Coping
// @namespace    http://tampermonkey.net/
// @version      2026-03-03
// @description  Replaces your avatar with the avatar you want (purely cosmetic, for you only)
// @author       viirha
// @match        *://www.neopets.com/neoboards/topic.phtml?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// ==/UserScript==

(function() {
    const username = document.querySelector(".nav-profile-dropdown-text > a").textContent.trim();
    const desired_avatar = "https://images.neopets.com/neoboards/avatars/zafara_helpful.gif";//<-- A random one. Replace with desired avatar url

    let list = document.querySelectorAll("a:has(.authorIcon)");
    for (let user of list) {
        let theirun=user.href.replace(/.*user=/,"");
        if (user.href.replace(/.*user=/,"")===username) {
            user.querySelector(".authorIcon").style.backgroundImage = `url(${desired_avatar})`;
        }
    }
    // Your code here...
})();
