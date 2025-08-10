// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "ishtop-landing",
  "appId": "1:895516153164:web:e17e28fa7eb259683e2be9",
  "storageBucket": "ishtop-landing.firebasestorage.app",
  "apiKey": "AIzaSyC3r29wwg6yXZU-dg7Tnt4bJCbhh4k6Fvk",
  "authDomain": "ishtop-landing.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "895516153164"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
