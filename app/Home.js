import { useCallback, useEffect, useState } from "react";
import AvatarImg from "../assets/images/Avatar.png";
import OcultarSaldoIcon from "../assets/images/ocultar-saldo-branco.png";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { styles } from "../styles/HomeStyles";
import { colors } from "../styles/theme";

// Firestore
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Button } from "react-native-web";
import { db } from "../firebaseConfig";
import { realizarDeposito } from "../services/transactionService";

export default function Home() {
  useAuthGuard();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  // Buscar transações da pessoa
  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
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
        console.error("Erro ao carregar transações:", err);
        Alert.alert("Erro", "Não foi possível carregar as transações.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleShortcutPress = useCallback(
    (key) => {
      if (key === "Transferir") router.push("/add-transaction");
      else if (key === "Pix") router.push("/add-transaction?type=pix");
      else if (key === "Pagar") router.push("/add-transaction?type=payment");
      else if (key === "Comprovantes") router.push("/comprovantes");
      else router.push("/transactions");
    },
    [router]
  );

  const handleClick = async () => {
    realizarDeposito(4.0, user.uid);
  };

  //  Função de cada linha da transação
  const renderTx = ({ item }) => {
    const valueColor = item.value >= 0 ? colors.accent : colors.danger;
    const displayValue =
      (item.value >= 0 ? "+" : "-") + "R$ " + Math.abs(item.value).toFixed(2);

    return (
      <View style={styles.transactionRow}>
        {/* Data */}
        <Text style={styles.transactionMeta}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleDateString()
            : "—"}
        </Text>

        {/* Tipo */}
        <Text style={styles.transactionDesc}>{item.type || "—"}</Text>

        {/* Valor */}
        <Text style={[styles.transactionValue, { color: valueColor }]}>
          {displayValue}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Menu Dropdown */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          {/* Fechar */}
          <TouchableOpacity
            style={styles.dropdownClose}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={{ color: colors.text.white, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          {/* Botão sair */}
          <TouchableOpacity style={styles.dropdownLogout} onPress={logout}>
            <Text style={styles.dropdownLogoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cabeçalho */}
      <View style={styles.header}>
        {/* Avatar + Texto */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={AvatarImg} style={styles.avatar} />
          <Text style={styles.headerText}>Olá, {user?.email}</Text>
        </View>

        {/* Botão hamburguer */}
        <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
          <Text style={{ color: colors.text.black, fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Card saldo */}
        <View style={styles.card}>
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.cardText}>Saldo disponível</Text>
              <Text style={styles.cardAmount}>
                {showBalance ? "R$ 2.500,00" : "******"}
              </Text>
              <Text style={styles.cardSubtitle}>Conta Corrente</Text>
              <Button onPress={() => handleClick()}></Button>
            </View>
            <TouchableOpacity onPress={() => setShowBalance((s) => !s)}>
              <Image source={OcultarSaldoIcon} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Atalhos */}
        <View style={styles.shortcutsContainer}>
          {["Pix", "Transfe", "Investir"].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.shortcut}
              onPress={() => handleShortcutPress(item)}
            >
              <Text style={styles.shortcutText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transações recentes */}
        <View style={styles.summaryCard}>
          <Text style={styles.transactionTitle}>Transações recentes</Text>

          {/* Cabeçalho da tabela */}
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsHeaderText}>Data</Text>
            <Text style={styles.transactionsHeaderText}>Tipo</Text>
            <Text style={styles.transactionsHeaderText}>Valor</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : transactions.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma transação ainda.</Text>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(t) => t.id}
              renderItem={renderTx}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => router.push("/transactions")}
          >
            <Text style={styles.seeAllText}>Ver todas as transações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
