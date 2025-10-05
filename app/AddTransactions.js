import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { colors, fontSize, radius, spacing } from "../styles/theme";
import { uploadFileFromUri } from '../services/storageService';

import OcultarSaldoIcon from '../assets/images/ocultar-saldo-preto.png';
import FileUploaderComponent from '../components/ui/FileUploaderComponent';


export default function AddTransaction() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipientFromParams = params.recipient;

  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [numericValue, setNumericValue] = useState(0);
  const [formattedValue, setFormattedValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const fileToUploadRef = useRef(null);
  const handleFileSelection = (fileObject) => {
    fileToUploadRef.current = fileObject;
    console.log("Arquivo local selecionado e pronto para upload:", fileObject);
  };

  useEffect(() => {
    if (!recipientFromParams) {
      Alert.alert("Erro", "Nenhum destinatário selecionado.");
      router.back();
    }
  }, [recipientFromParams, router]);

  useEffect(() => {
    if (!user?.uid) {
      setLoadingBalance(false);
      return;
    }
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach(doc => {
        total += doc.data().value;
      });
      setBalance(total);
      setLoadingBalance(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleValueChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned === '') {
      setNumericValue(0);
      setFormattedValue('');
      return;
    }
    const newNumericValue = parseInt(cleaned, 10) / 100;
    setNumericValue(newNumericValue);

    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(newNumericValue);

    setFormattedValue(formatted);
  };

  const handleSaveTransaction = async () => {
    if (authLoading) {
      Alert.alert("Aguarde", "Carregando informações do usuário...");
      return;
    }
    if (!user) { /* ... */ return; }
    if (numericValue <= 0) { /* ... */ return; }
    if (numericValue > balance) { /* ... */ return; }

    setLoading(true);

    let finalAttachmentUrl = null;
    const fileToUpload = fileToUploadRef.current;

    if (fileToUpload && fileToUpload.uri) {
      try {

        const fileName = `comprovante_${user.uid}_${new Date().getTime()}.pdf`;
        finalAttachmentUrl = await uploadFileFromUri(fileToUpload.uri, fileName, user.uid);
        console.log("Upload CONCLUÍDO. URL obtida e pronta para navegar:", finalAttachmentUrl);
      } catch (error) {
        console.error("Erro no upload do comprovante ANTES da transação:", error);
        Alert.alert("Erro de Upload", "Não foi possível enviar o comprovante. Tente novamente.");
        setLoading(false);
        return;
      }
    }

    router.push({
      pathname: '/Loading',
      params: {
        recipient: recipientFromParams,
        value: numericValue.toString(),
        attachmentUrl: finalAttachmentUrl,
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo Disponível:</Text>
          {loadingBalance ? <ActivityIndicator size="small" color={colors.primary} /> : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.balanceValue}>
                {showBalance ? `R$ ${balance.toFixed(2).replace('.', ',')}` : '●●●●●●'}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(prev => !prev)}>
                <Image source={OcultarSaldoIcon} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.recipientLabel}>Transferindo para:</Text>
          <Text style={styles.recipientName}>{recipientFromParams}</Text>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            placeholder="R$ 0,00"
            value={formattedValue}
            onChangeText={handleValueChange}
            keyboardType="numeric"
            style={styles.valueInput}
            placeholderTextColor={colors.text.muted}
          />

          <View style={{ marginTop: spacing.xl }}>
            {user && <FileUploaderComponent user={user} onFileSelected={handleFileSelection} />}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {loading ? <ActivityIndicator size="large" color={colors.secondary} /> : (
          <TouchableOpacity style={styles.button} onPress={handleSaveTransaction}>
            <Text style={styles.buttonText}>Transferir agora</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, },
  scrollContent: { padding: spacing.lg, flexGrow: 1, },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: fontSize.lg, fontWeight: "600", color: colors.text.primary, textAlign: 'center', },
  backButtonContainer: { width: 40 },
  backButton: { fontSize: 36, color: colors.text.black, fontWeight: '300', },
  balanceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl * 2, },
  balanceLabel: { fontSize: fontSize.md, color: colors.text.secondary, },
  balanceValue: { fontWeight: "bold", color: colors.text.primary, fontSize: fontSize.md, },
  eyeIcon: { width: 24, height: 24, marginLeft: spacing.sm, resizeMode: 'contain' },
  formContainer: { flex: 1, },
  recipientLabel: { fontSize: fontSize.sm, color: colors.text.muted, },
  recipientName: { fontSize: fontSize.md, fontWeight: 'bold', marginBottom: spacing.lg, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: spacing.md, },
  label: { color: colors.text.secondary, fontSize: fontSize.sm, marginBottom: spacing.xs },
  valueInput: { fontSize: 28, fontWeight: 'bold', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: spacing.sm, color: colors.text.primary, },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: '#eee', },
  button: { backgroundColor: colors.secondary, padding: spacing.lg, borderRadius: radius.lg, alignItems: 'center', },
  buttonText: { color: colors.text.white, fontSize: fontSize.md, fontWeight: 'bold', }
});