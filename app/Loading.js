import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import { colors, fontSize } from '../styles/theme';

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
  const { user, loading: authLoading } = useAuth();

  const { recipient, value, attachmentUrl } = params;

  let numericValue;
  if (typeof value === 'number') {
    numericValue = value;
  } else if (typeof value === 'string') {
    numericValue = parseFloat(value);
  } else {
    numericValue = 0;
  }

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!authLoading) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }).start();
    }

    const processTransaction = async () => {
      if (authLoading) {
        console.log('Aguardando carregamento da autenticação...');
        return;
      }

      if (!user) {
        console.log('Usuário não autenticado, redirecionando para login...');
        Alert.alert("Erro", "Usuário não autenticado.");
        router.replace('/Login');
        return;
      }

      if (!recipient) {
        Alert.alert("Erro", "Destinatário não informado.");
        router.replace('/tabs/Home');
        return;
      }

      if (!numericValue || isNaN(numericValue) || numericValue <= 0) {
        Alert.alert("Erro", `Valor inválido: ${value}. Deve ser um número maior que zero.`);
        router.replace('/tabs/Home');
        return;
      }

      try {
        const transactionRef = await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          recipient: recipient,
          value: -numericValue,
          type: "Transferência",
          createdAt: serverTimestamp(),
          attachmentUrl: attachmentUrl || null,
        });

        // Cria o contato se não existir
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

        router.replace({
          pathname: '/Comprovante',
          params: {
            recipient: recipient,
            value: numericValue,
            transactionId: transactionRef.id,
            attachmentUrl: attachmentUrl,
          }
        });

      } catch (error) {
        console.error("Erro no processo de transação: ", error);
        Alert.alert("Erro", "Não foi possível completar a transação.");
        router.replace('/tabs/Home');
      }
    };

    if (!authLoading) {
      setTimeout(() => {
        processTransaction();
      }, 3500);
    }

  }, [authLoading, user]);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (authLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando...</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Usuário não autenticado</Text>
        <Text style={styles.errorText}>Redirecionando para login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transferindo..</Text>

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
  errorText: {
    color: 'white',
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: 10,
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