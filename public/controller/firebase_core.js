
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBLZ0XJ1sPDakJ6TguAKR0fHXabycYVOZA",
    authDomain: "se1-project-group4.firebaseapp.com",
    projectId: "se1-project-group4",
    storageBucket: "se1-project-group4.firebasestorage.app",
    messagingSenderId: "865140912015",
    appId: "1:865140912015:web:a95e39feb0a8dd3ece25fa",
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const auth = getAuth(app);

