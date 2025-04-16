// app.js

import { attachAuthStateChangeObserver } from "./controller/firebase_auth.js";
import { onClickHomeMenu, onClickMenu2Menu, onClickSignoutMenu, onClickUserInfo } from "./controller/menueventhandlers.js";
import { routing, routePathnames } from "./controller/route_controller.js";
import { getAuth, applyActionCode } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { userInfo } from "./view/elements.js";
import { homePageView } from "./view/home_page.js";

// Menu button handlers
document.getElementById('menu-home').onclick = onClickHomeMenu;
document.getElementById('menu-menu2').onclick = onClickMenu2Menu;
document.getElementById('menu-signout').onclick = onClickSignoutMenu;
document.getElementById('userInfo').onclick = onClickUserInfo;

attachAuthStateChangeObserver();

window.onload = async function(e) {
    // Check for action code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const actionCode = urlParams.get('oobCode');
    const mode = urlParams.get('mode');

    if (actionCode && mode === 'verifyEmail') {
        await handleVerifyEmail(actionCode);
        // Remove action code parameters from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        console.log(pathname, hash);
        routing(pathname, hash);
    }
};

window.onpopstate = function(e) {
    e.preventDefault();
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    routing(pathname, hash);
};

async function handleVerifyEmail(actionCode) {
    const auth = getAuth();
    try {
        // Apply the action code
        await applyActionCode(auth, actionCode);
        // Email address has been updated
        alert('Your email address has been verified and updated successfully.');
        // Refresh the currentUser and UI
        await auth.currentUser.reload();
        userInfo.textContent = auth.currentUser.email;
        // Redirect to home or desired page
        history.pushState(null, null, routePathnames.HOME);
        homePageView();
    } catch (error) {
        console.error('Error verifying email:', error);
        alert('Error verifying email: ' + error.message);
    }
}
