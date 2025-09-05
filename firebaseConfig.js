import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9j59QILJJRBxhVb3RjRhotLwI8YiRWdw",
  authDomain: "fase3-banco.firebaseapp.com",
  projectId: "fase3-banco",
  storageBucket: "fase3-banco.appspot.com",
  messagingSenderId: "763272564201",
  appId: "1:763272564201:web:5a230c20015683f2e0cf78",
  measurementId: "G-0S35DXRK1F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
