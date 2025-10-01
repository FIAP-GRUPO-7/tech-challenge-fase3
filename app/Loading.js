import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import { colors, fontSize } from '../styles/theme';

// Função para gerar as iniciais a partir de um nome
const getInitials = (name) => {
  if (!name) return '??';
  const names = name.trim().split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  
  const { recipient, value } = params;
  const numericValue = parseFloat(value);

  // Animação para a barra de progresso
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Inicia a animação da barra
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500, // Duração da animação em milissegundos
      useNativeDriver: false, // Necessário para animar a largura
    }).start();

    const executeTransaction = async () => {
      if (!user || !recipient || !numericValue) {
        Alert.alert("Erro", "Dados da transação inválidos.");
        router.replace('/tabs/Home');
        return;
      }

      try {
        // Salva a transação no Firestore
        const transactionRef = await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          recipient: recipient,
          value: -numericValue,
          type: "Transferência",
          createdAt: serverTimestamp(),
        });

        // Verifica e salva o novo contato se necessário
        const contactsRef = collection(db, "contacts");
        const q = query(contactsRef, where("userId", "==", user.uid), where("name", "==", recipient));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(contactsRef, {
              userId: user.uid,
              name: recipient,
              initials: getInitials(recipient)
          });
        }
        
        // Navega para a tela de comprovante com os dados da transação
        router.replace({
            pathname: '/Comprovante',
            params: {
                recipient: recipient,
                value: numericValue,
                transactionId: transactionRef.id,
            }
        });

      } catch (error) {
        console.error("Erro no processo de transação: ", error);
        Alert.alert("Erro", "Não foi possível completar a transação.");
        router.replace('/tabs/Home');
      }
    };

    setTimeout(() => {
        executeTransaction();
    }, 3500);

  }, []);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transferindo..</Text>
      
      {/* Barra de Progresso */}
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: progressBarWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  text: {
    color: 'white',
    fontSize: fontSize.xl + 10,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  }
});