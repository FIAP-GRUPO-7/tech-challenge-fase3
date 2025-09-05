import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};


export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
