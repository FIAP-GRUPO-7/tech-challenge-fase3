import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddTransactionScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleAddTransaction = async () => {
    if (!description || !amount) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      const parsedAmount = parseFloat(amount.replace(',', '.'));
      if (isNaN(parsedAmount)) {
        Alert.alert('Erro', 'O valor inserido não é um número válido.');
        return;
      }

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        description,
        amount: parsedAmount,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sucesso', 'Transação adicionada com sucesso!');

      router.push('/(tabs)/list');

    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      Alert.alert('Erro', 'Não foi possível adicionar a transação.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Transação</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição da transação"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 100.50)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Adicionar Transação" onPress={handleAddTransaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});