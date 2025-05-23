// menueventhandlers.js

import { homePageView } from "../view/home_page.js";
import { signOutFirebase, updateUserEmail } from "./firebase_auth.js";
import { routePathnames } from "./route_controller.js";

export function onClickHomeMenu(e) {
  history.pushState(null, null, routePathnames.HOME);
  homePageView();
}

export async function onClickSignoutMenu(e) {
  await signOutFirebase(e);
}

export async function onClickUserInfo(e) {
  // Create a semi-transparent overlay
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  // Create the popup container
  const popup = document.createElement('div');
  popup.id = 'user-info-popup';
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
  popup.style.width = '300px';
  popup.style.textAlign = 'center';

  // Title
  const title = document.createElement('h2');
  title.textContent = 'User Settings';
  popup.appendChild(title);

  // Email input
  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'new-email';
  emailLabel.textContent = 'New Email:';
  emailLabel.style.display = 'block';
  emailLabel.style.marginTop = '15px';
  emailLabel.style.textAlign = 'left';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'new-email';
  emailInput.name = 'new-email';
  emailInput.style.width = '100%';
  emailInput.style.padding = '8px';
  emailInput.style.marginTop = '5px';
  emailInput.style.boxSizing = 'border-box';
  emailInput.value = '';

  popup.appendChild(emailLabel);
  popup.appendChild(emailInput);

  // Save Email Button
  const saveEmailButton = document.createElement('button');
  saveEmailButton.textContent = 'Save Email';
  saveEmailButton.style.marginTop = '15px';
  saveEmailButton.style.padding = '10px 20px';
  saveEmailButton.style.cursor = 'pointer';

  popup.appendChild(saveEmailButton);

  // Dark Mode Toggle Button
  const darkModeButton = document.createElement('button');
  darkModeButton.textContent = 'Toggle Dark Mode';
  darkModeButton.style.marginTop = '15px';
  darkModeButton.style.padding = '10px 20px';
  darkModeButton.style.cursor = 'pointer';

  popup.appendChild(darkModeButton);

  // Close Button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '15px';
  closeButton.style.padding = '10px 20px';
  closeButton.style.cursor = 'pointer';

  popup.appendChild(closeButton);

  // Append popup to overlay and to body
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Save email event
  saveEmailButton.onclick = async function () {
    const newEmail = emailInput.value.trim();
    if (newEmail) {
      try {
        await updateUserEmail(newEmail);
        showVerificationPopup(newEmail);
      } catch (error) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
          alert('Please re-authenticate and try again.');
        } else if (error.code === 'auth/operation-not-allowed') {
          alert('Email update operation not allowed. Please verify the new email first.');
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    } else {
      alert('Please enter a valid email address.');
    }
  };

  // Dark mode toggle
  darkModeButton.onclick = function () {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
  };

  // Close popup
  closeButton.onclick = function () {
    document.body.removeChild(overlay);
  };

  // Popup for confirmation
  function showVerificationPopup(email) {
    document.body.removeChild(overlay);

    const verificationOverlay = document.createElement('div');
    verificationOverlay.id = 'verification-overlay';
    verificationOverlay.style.position = 'fixed';
    verificationOverlay.style.top = '0';
    verificationOverlay.style.left = '0';
    verificationOverlay.style.width = '100vw';
    verificationOverlay.style.height = '100vh';
    verificationOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    verificationOverlay.style.display = 'flex';
    verificationOverlay.style.justifyContent = 'center';
    verificationOverlay.style.alignItems = 'center';
    verificationOverlay.style.zIndex = '1000';

    const verificationPopup = document.createElement('div');
    verificationPopup.id = 'verification-popup';
    verificationPopup.style.backgroundColor = '#fff';
    verificationPopup.style.padding = '20px';
    verificationPopup.style.borderRadius = '8px';
    verificationPopup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    verificationPopup.style.width = '300px';
    verificationPopup.style.textAlign = 'center';

    const message = document.createElement('p');
    message.textContent = `A confirmation email has been sent to ${email}. Please keep this page open until you confirm.`;
    message.style.marginBottom = '20px';
    verificationPopup.appendChild(message);

    const closeVerificationButton = document.createElement('button');
    closeVerificationButton.textContent = 'Close';
    closeVerificationButton.style.padding = '10px 20px';
    closeVerificationButton.style.cursor = 'pointer';

    verificationPopup.appendChild(closeVerificationButton);
    verificationOverlay.appendChild(verificationPopup);
    document.body.appendChild(verificationOverlay);

    closeVerificationButton.onclick = function () {
      document.body.removeChild(verificationOverlay);
    };
  }
}
