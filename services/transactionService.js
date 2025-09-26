import { collection, doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


export async function realizarDeposito(valor, userId) {
  const novaTransacaoRef = doc(collection(db, "transacoes"));

  const contaRef = doc(db, "contas", userId);

  const transacoes = {
    userId: userId,
    tipo: "deposito",
    valor: valor,
    dataTransacao: new Date(),
    status: "concluida",
    contaOrigemId: userId, 
    contaDestinoId: userId,
  };

  const novoSaldo = {
    saldo: increment(valor),
  }

  try {
    await setDoc(novaTransacaoRef, transacoes);
    await updateDoc(contaRef, novoSaldo);
    console.log("Transação e atualização de conta realizadas com sucesso!");
    return {
      success: true,
      transacaoId: novaTransacaoRef.id,
    };
  } catch (error) {
    console.error("Erro ao realizar transação em lote: ", error);
    return {
      success: false,
      error: error.message,
    };
  }
}