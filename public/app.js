import { attachAuthStateChangeObserver } from "./controller/firebase_auth.js";
import {
  onClickHomeMenu,
  onClickSignoutMenu,
  onClickUserInfo
} from "./controller/menueventhandlers.js";

import { routing, routePathnames } from "./controller/route_controller.js";
import { getAuth, applyActionCode } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { userInfo } from "./view/elements.js";
import { homePageView } from "./view/home_page.js";

// ✅ Updated menu button handlers
document.getElementById('menu-home').onclick = onClickHomeMenu;
document.getElementById('menu-signout').onclick = onClickSignoutMenu;
document.getElementById('userInfo').onclick = onClickUserInfo;


attachAuthStateChangeObserver();

window.onload = async function (e) {
  const urlParams = new URLSearchParams(window.location.search);
  const actionCode = urlParams.get('oobCode');
  const mode = urlParams.get('mode');

  if (actionCode && mode === 'verifyEmail') {
    await handleVerifyEmail(actionCode);
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    console.log(pathname, hash);
    routing(pathname, hash);
  }
};

window.onpopstate = function (e) {
  e.preventDefault();
  const pathname = window.location.pathname;
  const hash = window.location.hash;
  routing(pathname, hash);
};

async function handleVerifyEmail(actionCode) {
  const auth = getAuth();
  try {
    await applyActionCode(auth, actionCode);
    alert('Your email address has been verified and updated successfully.');
    await auth.currentUser.reload();
    userInfo.textContent = auth.currentUser.email;
    history.pushState(null, null, routePathnames.HOME);
    homePageView();
  } catch (error) {
    console.error('Error verifying email:', error);
    alert('Error verifying email: ' + error.message);
  }
}
