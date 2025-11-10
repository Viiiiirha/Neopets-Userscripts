// ==UserScript==
// @name         Double or Nothing Odds
// @namespace    http://tampermonkey.net/
// @version      2025-11-10
// @description  Display recorded odds on Double or Nothing
// @author       Virha
// @match        https://www.neopets.com/medieval/doubleornothing.phtml?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    let wins = GM_getValue("wins", 0);
    let losses = GM_getValue("losses", 0);
    let tails = document.querySelector("ruffle-embed[src*='cointoss_tails.swf']");
    if (tails) {
        losses++;
        console.log("loss");
        GM_setValue("losses", losses);
    }
    let heads = document.querySelector("ruffle-embed[src*='cointoss_heads.swf']");
    if (heads) {
        wins++;
        console.log("win");
        GM_setValue("wins", wins);
    }


    //This is likely one of the least efficient ways I could have set it up. Nonetheless, this is the way I set it up and, though inefficient, it works
    let di = document.createElement("div");
    di.style.textAlign = "center";
    let loc = document.querySelector("td.content ruffle-embed").parentNode.parentNode.parentNode.parentNode;
    di.innerHTML = `<b>Wins:</b> ${wins}<br><b>Losses:</b> ${losses}<br><b>Win Rate:</b> ${Math.round((wins/(wins+losses))*10000)/100}%`;
    let br = document.createElement("br");
    if (tails) {
        let br2 = document.createElement("br");
        loc.parentNode.insertBefore(br2, loc.nextSibling);
        loc.parentNode.insertBefore(di, br2);
        loc.parentNode.insertBefore(br, di);
    } else {
        loc.parentNode.insertBefore(br, loc.nextSibling);
        loc.parentNode.insertBefore(br, di);
    }

})();
