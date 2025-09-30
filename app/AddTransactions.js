import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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

import OcultarSaldoIcon from '../assets/images/ocultar-saldo-preto.png';

export default function AddTransaction() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipientFromParams = params.recipient;

  const [balance, setBalance] = useState(2500.00);
  // Mantemos dois estados: um para o valor numérico puro e outro para o texto formatado
  const [numericValue, setNumericValue] = useState(0); 
  const [formattedValue, setFormattedValue] = useState(''); 

  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (!recipientFromParams) {
      Alert.alert("Erro", "Nenhum destinatário selecionado.");
      router.back();
    }
  }, [recipientFromParams, router]);

  // --- NOVA FUNÇÃO PARA FORMATAR O VALOR ---
  const handleValueChange = (text) => {
    // Remove tudo que não for dígito
    const cleaned = text.replace(/\D/g, '');
    if (cleaned === '') {
        setNumericValue(0);
        setFormattedValue('');
        return;
    }
    // Converte a string de dígitos para um número (representando centavos)
    const newNumericValue = parseInt(cleaned, 10) / 100;
    setNumericValue(newNumericValue);

    // Formata o número para o padrão de moeda brasileiro
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(newNumericValue);
    
    setFormattedValue(formatted);
  };


  const handleSaveTransaction = async () => {
    if (numericValue <= 0) {
      Alert.alert("Erro de Validação", "Por favor, insira um valor válido e positivo.");
      return;
    }
    if (numericValue > balance) {
        Alert.alert("Saldo Insuficiente", `O valor da transferência não pode ser maior que o saldo disponível.`);
        return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        recipient: recipientFromParams,
        value: -numericValue, // Salva o valor numérico puro
        type: "Transferência",
        createdAt: serverTimestamp(),
      });
      const newBalance = balance - numericValue;
      setBalance(newBalance);
      Alert.alert("Sucesso!", `Transferência de R$ ${numericValue.toFixed(2)} realizada com sucesso.`);
      router.replace('/Home');
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      Alert.alert("Erro no Servidor", "Não foi possível realizar a transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
              <Text style={styles.backButton}>‹</Text> 
          </TouchableOpacity>
          <Text style={styles.title}>Adicionar Transação</Text>
          <View style={styles.backButtonContainer} /> 
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo Disponível:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.balanceValue}>
                {showBalance ? `R$ ${balance.toFixed(2).replace('.', ',')}` : '●●●●●●'}
            </Text>
            <TouchableOpacity onPress={() => setShowBalance(prev => !prev)}>
                <Image source={OcultarSaldoIcon} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.recipientLabel}>Transferindo para:</Text>
          <Text style={styles.recipientName}>{recipientFromParams}</Text>
          
          <Text style={styles.label}>Valor</Text>
          <TextInput
            placeholder="R$ 0,00"
            value={formattedValue} // Exibe o valor formatado
            onChangeText={handleValueChange} // Usa a nova função de formatação
            keyboardType="numeric"
            style={styles.valueInput}
            placeholderTextColor={colors.text.muted}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSaveTransaction}>
            <Text style={styles.buttonText}>Transferir agora</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.lg,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    title: {
        fontSize: fontSize.lg, fontWeight: "600", color: colors.text.primary, textAlign: 'center',
    },
    backButtonContainer: { width: 40 },
    backButton: {
        fontSize: 36, color: colors.text.black, fontWeight: '300',
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl * 2,
    },
    balanceLabel: {
        fontSize: fontSize.md, color: colors.text.secondary,
    },
    balanceValue: {
        fontWeight: "bold", color: colors.text.primary, fontSize: fontSize.md,
    },
    eyeIcon: {
        width: 24,
        height: 24,
        marginLeft: spacing.sm,
        resizeMode: 'contain'
    },
    formContainer: {
        flex: 1,
    },
    recipientLabel: {
        fontSize: fontSize.sm, color: colors.text.muted,
    },
    recipientName: {
        fontSize: fontSize.md, fontWeight: 'bold', marginBottom: spacing.lg, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: spacing.md,
    },
    label: {
        color: colors.text.secondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.xs
    },
    valueInput: {
        fontSize: 28, 
        fontWeight: 'bold', 
        borderBottomWidth: 1, 
        borderColor: '#ccc', 
        paddingBottom: spacing.sm,
        color: colors.text.primary,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        backgroundColor: colors.secondary,
        padding: spacing.lg,
        borderRadius: radius.lg,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.text.white,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    }
});