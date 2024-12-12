import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnGC9-lUxgzbgIx7GmFUDbfyouB4L0xtI",
  authDomain: "laundry-c5002.firebaseapp.com",
  projectId: "laundry-c5002",
  storageBucket: "laundry-c5002.firebasestorage.app",
  messagingSenderId: "617710419603",
  appId: "1:617710419603:web:fb6f93591761983d9c1766",
  measurementId: "G-S8PDCXTQYW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
