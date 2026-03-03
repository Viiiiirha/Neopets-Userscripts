// ==UserScript==
// @name         Display Custom Shopkeeper (Your end only!)
// @namespace    http://tampermonkey.net/
// @version      2026-03-03
// @description  Replaces your shopkeeper on pages where you edit your shop so that you don't have to see the emo usuki
// @author       viirha
// @match        https://www.neopets.com/market.phtml?type=edit
// @match        https://www.neopets.com/market.phtml?type=your
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// ==/UserScript==

document.onload = (function() {
    const new_shopkeeper_image = "https://images.neopets.com/new_shopkeepers/1247.gif" //<-- Royalboy zafara reading. Replace it with whatever image you want.


    document.querySelectorAll("td:has(input[onclick='update_picture()']) > img,#content > table > tbody > tr > td.content > p:has(a)+center > img[name='keeperimage']").forEach(e=>{
    e.src = new_shopkeeper_image;
});
})();
