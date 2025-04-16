import { root } from "./elements.js";
import { signinFirebase  } from "../controller/firebase_auth.js";
import { onClickCreateUser } from "../controller/signin_controller.js";

export async function signinPageView() {
    const response = await fetch('/view/templates/signin_page_template.html',
        {cache: 'no-store'}
    );

    const divWrapper = document.createElement('div'); // <div></div>
    divWrapper.style.width = '400px';
    divWrapper.classList.add('m-4', 'p-4');
    divWrapper.innerHTML = await response.text();

    // attach form submit event listener
    const form = divWrapper.getElementsByTagName('form')[0];
    form.onsubmit = signinFirebase;

    // creates a pop up on Create New User
    const createButton = divWrapper.querySelector('#create-new-user');
    createButton.onclick = onClickCreateUser;

    root.innerHTML = ''; // clear current page rendering
    root.appendChild(divWrapper);
}