import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, docFirebase, setDocFirebase } from "../firebaseConfig";

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      const uid = user.uid;
      console.log("[registerUser - sucesso criação de usuário]");

      const contaRef = docFirebase(db, "contas", uid);
      await setDocFirebase(contaRef, {
        saldo: 0,
        ultimaAtualizacao: new Date(),
        userId: uid,
      });

      console.log("[registerUser - sucesso criação de dados usuário]");
      return user;
    }
  } catch (err) {
    console.error(`[registerUser - falha] ${err.message}`);
    throw err;
  }
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
  .then((response) => {
    console.log(response);
  });
};
