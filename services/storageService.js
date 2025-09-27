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
          console.log(`Upload está ${progress}% feito para ${fileName}`);
        },
        (error) => {
          console.error("Erro no upload para o Storage:", error);
          reject(
            new Error("Falha ao enviar o arquivo para o Firebase Storage.")
          );
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(
            `Arquivo ${fileName} enviado e URL de download obtida:`,
            downloadURL
          );
          resolve(downloadURL);
        }
      );
    });
  } catch (err) {
    console.error("Erro ao preparar upload:", err);
    throw new Error("Falha ao preparar o arquivo para upload.");
  }
};

export const uploadFileFromUri = async (fileUri, fileName, userId) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `comprovantes/${userId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload está ${progress}% feito`);
        },
        (error) => {
          console.error("Erro no upload para o Storage:", error);
          reject(
            new Error("Falha ao enviar o arquivo para o Firebase Storage.")
          );
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Arquivo enviado e URL de download obtida:", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (err) {
    console.error("Erro ao preparar upload:", err);
    throw new Error("Falha ao preparar o arquivo para upload.");
  }
};

export const downloadFileToLocal = async (storageFilePath, localFileName) => {
  try {
    const fileRef = ref(storage, storageFilePath);
    const downloadURL = await getDownloadURL(fileRef);

    const localUri = FileSystem.documentDirectory + localFileName;

    console.log(`Baixando de ${downloadURL} para ${localUri}`);
    const { uri } = await FileSystem.downloadAsync(downloadURL, localUri);

    console.log(`Download concluído. Arquivo salvo em: ${uri}`);
    return uri;
  } catch (err) {
    console.error("Erro ao baixar o arquivo:", err);
    throw new Error("Falha ao baixar o arquivo do Firebase Storage.");
  }
};
