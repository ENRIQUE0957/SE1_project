// firebase_auth.js

import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    onAuthStateChanged, signOut,
    verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./firebase_core.js";
import { DEV } from "../model/constants.js";
import { homePageView } from "../view/home_page.js";
import { signinPageView } from "../view/signin_page.js";
import { routePathnames, routing } from "../controller/route_controller.js";
import { userInfo } from "../view/elements.js";

const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export let currentUser = null;

// Handle user sign-in
export async function signinFirebase(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (DEV) console.log("Signed in successfully:", userCredential.user);
    } catch (error) {
        if (DEV) console.log("Signin error:", error);
        alert('Signin Error: ' + error.message);
    }
}

// Handle user sign-out
export async function signOutFirebase() {
    try {
        await signOut(auth);
        if (DEV) console.log("User signed out successfully.");
    } catch (error) {
        if (DEV) console.log("Sign-out error:", error);
        alert('Sign Out Error: ' + error.message);
    }
}

// Attach observer for auth state changes
export function attachAuthStateChangeObserver() {
    onAuthStateChanged(auth, onAuthStateChangedListener);
}

// Update UI based on user auth state
function onAuthStateChangedListener(user) {
    currentUser = user;
    if (user) {
        userInfo.textContent = 'Settings'; // Always display 'Settings' when signed in
        const postAuth = document.getElementsByClassName('myclass-postauth');
        for (let i = 0; i < postAuth.length; i++) {
            postAuth[i].classList.replace('d-none', 'd-block');
        }
        const preAuth = document.getElementsByClassName('myclass-preauth');
        for (let i = 0; i < preAuth.length; i++) {
            preAuth[i].classList.replace('d-block', 'd-none');
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        routing(pathname, hash);
    } else {
        userInfo.textContent = 'Settings'; // Also display 'Settings' when not signed in
        const postAuth = document.getElementsByClassName('myclass-postauth');
        for (let i = 0; i < postAuth.length; i++) {
            postAuth[i].classList.replace('d-block', 'd-none');
        }
        const preAuth = document.getElementsByClassName('myclass-preauth');
        for (let i = 0; i < preAuth.length; i++) {
            preAuth[i].classList.replace('d-none', 'd-block');
        }
        history.pushState(null, null, routePathnames.HOME);
        signinPageView();
    }
}

// Function to create a new user
export async function createNewUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully:', userCredential.user);
        // You can add additional logic here, like saving user information to Firestore
        return userCredential.user;
    } catch (error) {
        console.error('Error creating new user:', error.code, error.message);
        throw error;
    }
}

// Function to update the user's email
export async function updateUserEmail(newEmail) {
    if (!currentUser) {
        throw new Error('No user is currently signed in.');
    }
    try {
        await verifyBeforeUpdateEmail(currentUser, newEmail);
        if (DEV) console.log('Verification email sent to new email address.');
        // The popup will be handled in the event handler
    } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
            // Re-authenticate the user
            try {
                await reauthenticateUser();
                // After re-authentication, try sending the verification email again
                await verifyBeforeUpdateEmail(currentUser, newEmail);
                if (DEV) console.log('Verification email sent after re-authentication.');
            } catch (reauthError) {
                console.error('Re-authentication failed:', reauthError);
                throw reauthError;
            }
        } else {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }
}

// Function to re-authenticate the user
export async function reauthenticateUser() {
    if (!currentUser) {
        throw new Error('No user is currently signed in.');
    }
    const email = currentUser.email;
    const password = prompt('Please enter your password to re-authenticate:');
    if (!password) {
        throw new Error('Password is required for re-authentication.');
    }
    const credential = EmailAuthProvider.credential(email, password);
    try {
        await reauthenticateWithCredential(currentUser, credential);
        if (DEV) console.log('User re-authenticated successfully.');
    } catch (error) {
        console.error('Re-authentication error:', error);
        throw error;
    }
}
