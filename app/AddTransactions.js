import { useLocalSearchParams, useRouter } from "expo-router"; // Importe useLocalSearchParams
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { db } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { colors, fontSize, radius, spacing } from "../styles/theme";

import AvatarImg from "../assets/images/Avatar.png";
import { styles as homeStyles } from "../styles/HomeStyles";

export default function AddTransaction() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams(); // Pega os parâmetros da rota
  const recipientFromParams = params.recipient; // Pega o destinatário

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (!recipientFromParams) {
      // Se não houver destinatário, volta para a tela anterior
      Alert.alert("Erro", "Nenhum destinatário selecionado.");
      router.back();
    }
  }, [recipientFromParams, router]);

  const handleSaveTransaction = async () => {
    if (!value.trim()) {
      Alert.alert("Erro", "Por favor, preencha o valor.");
      return;
    }
    const numericValue = parseFloat(value.replace(",", "."));
    if (isNaN(numericValue) || numericValue <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor numérico válido e positivo.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        recipient: recipientFromParams, // Usa o destinatário vindo dos parâmetros
        value: -numericValue,
        type: "Transferência", // Pode ser ajustado se necessário
        createdAt: serverTimestamp(),
      });
      Alert.alert("Sucesso", "Transação realizada com sucesso!");
      router.replace('/Home'); // Volta para a Home após o sucesso
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      Alert.alert("Erro", "Não foi possível realizar a transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={homeStyles.container}>
       {menuVisible && (
        <View style={homeStyles.dropdownMenu}>
          <TouchableOpacity style={homeStyles.dropdownClose} onPress={() => setMenuVisible(false)}>
            <Text style={{ color: colors.text.white, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.dropdownLogout} onPress={logout}>
            <Text style={homeStyles.dropdownLogoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={homeStyles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={AvatarImg} style={homeStyles.avatar} />
          <Text style={homeStyles.headerText}>Olá, {user?.email}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
          <Text style={{ color: colors.text.black, fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <View style={styles.formHeader}>
            <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
                <Text style={styles.backButton}>‹</Text> 
            </TouchableOpacity>
            <Text style={styles.title}>Adicionar Transação</Text>
            <View style={styles.backButtonContainer} /> 
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.balanceInfo}>
            Saldo Disponível: <Text style={styles.balanceValue}>R$ 2.500,00</Text>
          </Text>
          
          <Text style={styles.recipientLabel}>Transferindo para:</Text>
          <Text style={styles.recipientName}>{recipientFromParams}</Text>

          <Input
            label="Valor"
            placeholder="R$ 1000,00"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            style={styles.valueInput}
          />
          
          <View style={styles.attachmentContainer}>
             <Text style={styles.attachmentText}>Anexo</Text>
             <TouchableOpacity style={styles.attachmentButton}>
                  <Text>Escolher arquivo</Text>
             </TouchableOpacity>
             <Text style={styles.attachmentInfo}>Nenhum arquivo escolhido</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 20 }} />
          ) : (
            <Button
              title="Transferir agora"
              onPress={handleSaveTransaction}
              className="mt-4"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    formHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
    },
    title: {
        fontSize: fontSize.lg, fontWeight: "600", color: colors.text.primary, textAlign: 'center',
    },
    backButtonContainer: { width: 40 },
    backButton: {
        fontSize: 36, color: colors.text.black, fontWeight: '300',
    },
    formContainer: {
        padding: spacing.lg,
    },
    balanceInfo: {
        fontSize: fontSize.md, color: colors.text.secondary, marginBottom: spacing.xl,
    },
    balanceValue: {
        fontWeight: "bold", color: colors.text.primary,
    },
    recipientLabel: {
        fontSize: fontSize.sm, color: colors.text.muted,
    },
    recipientName: {
        fontSize: fontSize.md, fontWeight: 'bold', marginBottom: spacing.lg, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: spacing.md,
    },
    valueInput: {
        fontSize: 28, fontWeight: 'bold', borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: spacing.sm,
    },
    attachmentContainer: { marginTop: spacing.xl, },
    attachmentText: { marginBottom: spacing.sm, color: colors.text.secondary, },
    attachmentButton: {
        backgroundColor: '#f0f0f0', padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
    },
    attachmentInfo: {
        marginTop: spacing.sm, fontStyle: 'italic', color: colors.text.muted
    }
});