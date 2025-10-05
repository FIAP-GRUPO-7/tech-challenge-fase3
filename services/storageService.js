import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebaseConfig";
import * as FileSystem from "expo-file-system";

export const uploadFileFromBlob = async (fileBlob, fileName, userId) => {
  try {
    const storageRef = ref(storage, `comprovantes/${userId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, fileBlob);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`[STORAGE] Upload está ${progress.toFixed(0)}% feito para ${fileName}`);
        },
        (error) => {
          console.error("[STORAGE] Erro no upload para o Storage:", error);
          reject(new Error("Falha ao enviar o arquivo para o Firebase Storage."));
        },
        async () => {
          // Quando o upload está completo, pega a URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`[STORAGE] Arquivo ${fileName} enviado. URL obtida.`);
          resolve(downloadURL);
        }
      );
    });
  } catch (err) {
    console.error("[STORAGE] Erro ao preparar upload:", err);
    throw new Error("Falha ao preparar o arquivo para upload.");
  }
};

export const uploadFileFromUri = async (fileUri, fileName, userId) => {
  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("[STORAGE] Falha na leitura do URI local via XHR."));
      };
      xhr.responseType = "blob";
      xhr.open("GET", fileUri, true);
      xhr.send(null);
    });

    const storageRef = ref(storage, `comprovantes/${userId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`[STORAGE] Upload está ${progress.toFixed(0)}% feito`);
        },
        (error) => {
          console.error("[STORAGE] Erro no upload para o Storage:", error);
          reject(new Error("Falha ao enviar o arquivo para o Firebase Storage."));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("[STORAGE] Arquivo enviado e URL de download obtida.");
          resolve(downloadURL);
        }
      );
    });
  } catch (err) {
    console.error("[STORAGE] Erro ao preparar upload:", err);
    throw new Error("Falha ao preparar o arquivo para upload.");
  }
};

export const downloadFileToLocal = async (storageFilePath, localFileName) => {
  try {
    const fileRef = ref(storage, storageFilePath);
    const downloadURL = await getDownloadURL(fileRef);

    const localUri = FileSystem.documentDirectory + localFileName;

    console.log(`[STORAGE] Baixando de ${downloadURL} para ${localUri}`);
    const { uri } = await FileSystem.downloadAsync(downloadURL, localUri);

    console.log(`[STORAGE] Download concluído. Arquivo salvo em: ${uri}`);
    return uri;
  } catch (err) {
    console.error("[STORAGE] Erro ao baixar o arquivo:", err);
    throw new Error("Falha ao baixar o arquivo do Firebase Storage.");
  }
};