import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const registerUser = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      const uid = user.uid;
      
      await updateProfile(user, {
        displayName: fullName,
      });

      console.log("[registerUser - sucesso, perfil atualizado com nome]");

      const contaRef = doc(db, "contas", uid);
      await setDoc(contaRef, {                 
        nome: fullName,
        saldo: 0,
        ultimaAtualizacao: new Date(),
        userId: uid,
      });

      console.log("[registerUser - sucesso, criação de dados do usuário]");
      return user;
    }
  } catch (err) {
    console.error(`[registerUser - falha] ${err.message}`);
    throw err;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("[loginUser - sucesso]");
    return userCredential;
  } catch (err) {
    console.error(`[loginUser - falha] ${err.message}`);
    throw new Error("Email ou senha inválidos.");
  }
};