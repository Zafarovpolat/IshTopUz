// @/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  projectId: "ishtop-landing",
  appId: "1:895516153164:web:e17e28fa7eb259683e2be9",
  storageBucket: "ishtop-landing.firebasestorage.app",
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ishtop-landing.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "895516153164",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
