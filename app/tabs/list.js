import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function TransactionsListScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(items);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar transações:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }) => {
    const valueColor = item.amount >= 0 ? 'green' : 'red';

    return (
      <View style={styles.transactionItem}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={[styles.transactionAmount, { color: valueColor }]}>R$ {item.amount.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Transações</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : transactions.length === 0 ? (
        <Text>Nenhuma transação ainda.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionDescription: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});