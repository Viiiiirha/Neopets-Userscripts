// ==UserScript==
// @name         Neopets - Read Books Faster
// @namespace    http://tampermonkey.net/
// @version      2026-11-02
// @description  Automate book reading
// @author       Viirha
// @match        https://www.neopets.com/home/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// ==/UserScript==

(function() {

    const bookPet = "GenderfIuidity";
    let reading = false;
    const pendingBooks = new Set();
    function isVisible(element) {
        if (!element) return false;
        let current = element;
        while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                style.opacity === "0" ||
                current.hidden
            ) {
                return false;
            }

            current = current.parentElement;
        }

        return element.getClientRects().length > 0;
    }
    async function readBook(objid) {

        if (pendingBooks.has(objid)) return;

        pendingBooks.add(objid);

        console.log(`%cReading book ${objid}`, "color: blue; font-weight: bold");

        try {
            const body = new URLSearchParams({
                obj_id: objid,
                action: `Read to ${bookPet}`,
                petcare: "1"
            });

            const response = await fetch(
                "https://www.neopets.com/np-templates/views/useobject.phtml",
                {
                    method: "POST",
                    headers: {
                        "accept": "text/html, */*; q=0.01",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    body: body,
                    credentials: "include"
                }
            );
            const responseText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, "text/html");
            document.querySelector(".icon-back__2020").click();
            document.querySelector(".petCare-button-read").click();
            console.groupEnd();
            if (!response.ok) {
                console.error("Request unsuccessful.");
            }
        } catch (error) {
            console.error("Error reading book:", error);
        } finally {
            pendingBooks.delete(objid);
        }
    }

    document.addEventListener("click", function(event) {
        if (!reading) return;
        const book = event.target.closest(".petCare-itemgrid-item");
        if (!book) return;
        const grid = document.querySelector("#petCareList");
        if (!grid || !grid.contains(book)) return;
        const objid = book.dataset.objid;
        if (!objid) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        readBook(objid);

    }, true);
    function onPopupOpen() {
        console.log(`%cReading to ${bookPet}`, "color: green; font-weight: bold");
    }
    function onPopupClose() {
        reading = false;
        pendingBooks.clear();

        console.log("Popup closed");
    }
    function checkPopup() {
        const title = document.querySelector("#petCareListTitle");

        const popupOpen = isVisible(title) &&
              title.textContent.includes("Read to " + bookPet);

        if (popupOpen && !reading) {
            reading = true;
            onPopupOpen();
        }

        if (!popupOpen && reading) {
            onPopupClose();
        }
    }

    const observer = new MutationObserver(checkPopup);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
        attributeFilter: ["class", "style", "hidden"]
    });

    checkPopup();

})();
