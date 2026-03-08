// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBb8Zpxpb-5b_fwe1LuQXNn-8k7Xl7fmDA",
  authDomain: "exposer01.firebaseapp.com",
  projectId: "exposer01",
  storageBucket: "exposer01.firebasestorage.app",
  messagingSenderId: "769907287005",
  appId: "1:769907287005:web:64876487fa716e44108c34"
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
