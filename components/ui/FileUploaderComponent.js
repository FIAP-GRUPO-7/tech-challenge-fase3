import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { uploadFileFromBlob } from "../../services/storageService";
import { colors } from "../../styles/theme";

const FileUploaderComponent = ({ user, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadStatus(
      files.map((file) => ({
        name: file.name,
        status: "Pronto para enviar",
        url: null,
      }))
    );
  };

  const handleUploadClick = async () => {
    if (!user || !user.uid) {
      alert("Usuário não autenticado. Por favor, faça login.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Nenhum arquivo selecionado para upload.");
      return;
    }

    setIsUploading(true);
    const newUploadStatuses = [...uploadStatus];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        try {
          newUploadStatuses[i].status = "Enviando...";
          setUploadStatus([...newUploadStatuses]);

          const downloadUrl = await uploadFileFromBlob(
            file,
            file.name,
            user.uid
          );

          newUploadStatuses[i].status = `Sucesso!`;
          newUploadStatuses[i].url = downloadUrl;

          if (onUploadSuccess) {
            onUploadSuccess(downloadUrl);
          }

          console.log(`Upload de ${file.name} concluído. URL: ${downloadUrl}`);
        } catch (error) {
          newUploadStatuses[i].status = `Falha: ${error.message}`;
          console.error(`Erro ao enviar ${file.name}:`, error);
        }
        setUploadStatus([...newUploadStatuses]);
      }
    } catch (globalError) {
      console.error("Erro geral no processo de upload:", globalError);
      alert(`Erro geral: ${globalError.message}`);
    } finally {
      setIsUploading(false);
      setSelectedFiles([]);
      setUploadStatus([]);
    }
  };

  const handleMobileFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"], // limita os tipos
        multiple: true,
      });

      if (result.canceled) {
        return;
      }

    // No expo-document-picker, cada arquivo vem em result.assets
      const files = result.assets || [];
      setSelectedFiles(files);
      setUploadStatus(
        files.map((file) => ({
          name: file.name,
          status: "Pronto para enviar",
          url: null,
        }))
      );
    } catch (err) {
      console.error("Erro ao selecionar arquivo:", err);
    }
  };

  const renderFileInput = () => {
    if (Platform.OS === "web") {
      return (
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={styles.fileInput}
          disabled={isUploading}
          accept="image/*,application/pdf"
        />
      );
    }

    return (
      <Button
        title="Selecionar Documento"
        onPress={handleMobileFilePick}
        disabled={isUploading}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload de Comprovantes</Text>

      {renderFileInput()}

      {selectedFiles.length > 0 && (
        <View style={styles.fileListContainer}>
          <Text style={styles.subtitle}>Arquivos Selecionados:</Text>
          {selectedFiles.map((file, index) => (
            <Text key={file.name + index} style={styles.fileItem}>
              - {file.name}
            </Text>
          ))}
        </View>
      )}

      {uploadStatus.length > 0 && (
        <View style={styles.statusContainer}>
          <Text style={styles.subtitle}>Status do Upload:</Text>
          {uploadStatus.map((item, index) => (
            <View key={item.name + index} style={styles.statusRow}>
              <Text style={styles.statusItem}>
                {item.name}: {item.status}
              </Text>
              {item.url && (
                <Text style={styles.statusUrl}>
                  URL: {item.url.substring(0, 30)}...
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <Button
        title={isUploading ? "Enviando..." : "Enviar Arquivos"}
        onPress={handleUploadClick}
        disabled={selectedFiles.length === 0 || isUploading}
        color={colors.accent}
      />
      {isUploading && (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: colors.text.black,
  },
  fileInput: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fefefe",
    color: colors.text.black,
  },
  fileListContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  fileItem: {
    fontSize: 14,
    marginBottom: 3,
    color: colors.text.black,
  },
  statusContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e0f7fa",
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  statusRow: {
    marginBottom: 5,
  },
  statusItem: {
    fontSize: 14,
    color: colors.text.black,
  },
  statusUrl: {
    fontSize: 12,
    color: colors.text.muted,
  },
});

export default FileUploaderComponent;
