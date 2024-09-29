// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import the Authentication module
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC62tNd9-Hg47xYlQLha5blF13fWpWJN6k",
  authDomain: "lienco-4bba9.firebaseapp.com",
  projectId: "lienco-4bba9",
  storageBucket: "lienco-4bba9.appspot.com",
  messagingSenderId: "168294717955",
  appId: "1:168294717955:web:af9d2178d6fbbe40268c36",
  measurementId: "G-LJV10FMJC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export the auth instance
export const db = getFirestore(app); // Export the Firestore instance
