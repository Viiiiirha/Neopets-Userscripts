// ==UserScript==
// @name         Create-a-Trade QoL Features
// @namespace    http://tampermonkey.net/
// @version      2025-06-26
// @description  Prevent selection of >10 items and allow clicking on the item
// @author       Virha
// @match        https://www.neopets.com/island/tradingpost.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// ==/UserScript==

(function() {
    const checkboxes = document.querySelectorAll("input[name='selected_items[]'][type='checkbox']");

    function updateCheckboxStates() {
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        checkboxes.forEach(cb => {
            cb.disabled = checkedCount >= 10 && !cb.checked;
            const td = cb.closest("td");
        if (td && td.nextElementSibling && cb.disabled) {
            td.nextElementSibling.style.cursor = "default";
            td.style.cursor = "not-allowed";
        }
        });
    }

    checkboxes.forEach(cb => {
        cb.addEventListener("change", updateCheckboxStates);
    });

    checkboxes.forEach(cb => {
        const td = cb.closest("td");
        if (td && td.nextElementSibling) {
            td.nextElementSibling.style.cursor = "pointer";
            td.style.cursor = "pointer";
            td.nextElementSibling.addEventListener("click", () => {
                if (!cb.disabled) {
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event("change"));
                }
            });
            td.addEventListener("click", () => {
                if (!cb.disabled) {
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event("change"));
                }
            });
        }
    });
})();
