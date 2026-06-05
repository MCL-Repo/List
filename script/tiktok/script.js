// ==UserScript==
// @name         Purple Domain Custom Badge
// @match        https://www.tiktok.com/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    setInterval(() => {
        const profileName = [...document.querySelectorAll("*")]
            .find(el => el.textContent?.includes("purple.domain"));

        if (!profileName || profileName.dataset.customBadge) return;

        profileName.dataset.customBadge = "1";

        const badge = document.createElement("span");
        badge.textContent = " ◆ PURPLE";
        badge.style.color = "#a855f7";
        badge.style.fontWeight = "bold";
        badge.style.marginLeft = "6px";

        profileName.appendChild(badge);
    }, 1000);
})();
