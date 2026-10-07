import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmxwOnqZtkNLFXe7YKT2HJZ5E813q_1ps",
  authDomain: "campusfind-6c1aa.firebaseapp.com",
  projectId: "campusfind-6c1aa",
  storageBucket: "campusfind-6c1aa.firebasestorage.app",
  messagingSenderId: "1022855093124",
  appId: "1:1022855093124:web:e3f9f9e62e616744375bd1",
  measurementId: "G-SX842NVZ8D"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);