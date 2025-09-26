import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRx782uZkXC7B8kb0fODccWmMA5X3uHgE",
  authDomain: "tech-challenge-ebeef.firebaseapp.com",
  projectId: "tech-challenge-ebeef",
  storageBucket: "tech-challenge-ebeef.firebasestorage.app",
  messagingSenderId: "692746756401",
  appId: "1:692746756401:web:217a789820d21e4cdb5010",
  measurementId: "G-S7X441RLM5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);     
export const storage = getStorage(app); 
