// ==UserScript==
// @name         Stamp Album Navigation
// @namespace    http://tampermonkey.net/
// @version      2026-03-05
// @description  Adds links to go to the next or previous page of the stamp album
// @author       viirha
// @match        https://www.neopets.com/stamps.phtml?type=album*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// ==/UserScript==

(function() {
    let page = parseInt(window.location.href.match(/[0-9]+/)[0]);
    let loc = document.querySelector("a[href*=page_id] + a[href*=page_id]").parentNode.nextSibling;
    let acloc = document.createElement("div");
    acloc.id = "acloc";
    let max = document.querySelectorAll("a[href*=page_id] + a[href*=page_id]").length;
    let css = document.createElement("style");
    css.innerHTML = `
    #nextendd {
    position: absolute;
    right: 0;
    }
    #acloc {
    position: relative;
    }
    `
    if (page>1) {
        makePrev(acloc);
    }
    acloc.appendChild(css);
    if (page<max) {
        makeNext(acloc);
    }

    loc.parentNode.insertBefore(acloc,loc);


    function makeNext(loc) {
        let newlink = window.location.href.replace(page,page+1);
        let b = document.createElement("a");
        b.href = newlink;
        b.textContent = "Next";
        loc.appendChild(b);
        b.id= "nextendd";

    }
    function makePrev(loc) {
        let newlink = window.location.href.replace(page,page-1);
        let b = document.createElement("a");
        b.href = newlink;
        b.textContent = "Previous";
        loc.appendChild(b);
    }
    // Your code here...
})();
