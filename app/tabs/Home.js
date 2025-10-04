import { useRouter } from "expo-router";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import AvatarImg from "../../assets/images/Avatar.png";
import OcultarSaldoIcon from "../../assets/images/ocultar-saldo-branco.png";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { styles } from "../../styles/HomeStyles";
import { colors } from "../../styles/theme";

// Removida a importação do FileUploaderComponent
// import FileUploaderComponent from "../../components/ui/FileUploaderComponent";

export default function Home() {
  useAuthGuard();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [0] }],
  });

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty && !loading) {
            try {
                await addDoc(collection(db, "transactions"), {
                    userId: user.uid,
                    value: 2500,
                    type: "Depósito Inicial",
                    createdAt: serverTimestamp(),
                });
            } catch (error) {
                console.error("Erro ao criar depósito inicial:", error);
            }
        } else {
            let total = 0;
            const items = snapshot.docs.map((doc) => {
                const data = doc.data();
                total += data.value || 0;
                return { id: doc.id, ...data };
            });
            
            setTransactions(items);
            setBalance(total);

            const recentTransactions = items
                .filter(t => t.createdAt && typeof t.createdAt.toDate === 'function')
                .slice(0, 7)
                .reverse();
            
            if (recentTransactions.length > 0) {
                setChartData({
                    labels: recentTransactions.map(t => t.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit' })),
                    datasets: [{ data: recentTransactions.map(t => t.value) }]
                });
            } else {
                setChartData({ labels: ['Início'], datasets: [{ data: [0] }] });
            }
        }
        setLoading(false);
    },
    (err) => {
        console.error("Erro ao carregar transações:", err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleShortcutPress = useCallback((key) => {
      if (key === "Transferir" || key === "Pix") {
        router.push("/tabs/add");
      } else {
        router.push("/tabs/list");
      }
    }, [router]
  );

  const renderTx = ({ item }) => {
    const value = item.value || 0;
    const valueColor = value >= 0 ? colors.accent : colors.danger;
    const displayValue = (value >= 0 ? "+" : "-") + "R$ " + Math.abs(value).toFixed(2);
    
    const dateString = item.createdAt && typeof item.createdAt.toDate === 'function'
      ? item.createdAt.toDate().toLocaleDateString('pt-BR')
      : "Processando...";

    return (
      <View style={styles.transactionRow}>
        <Text style={styles.transactionMeta}>{dateString}</Text>
        <Text style={styles.transactionDesc}>{item.type || item.recipient || "—"}</Text>
        <Text style={[styles.transactionValue, { color: valueColor }]}>{displayValue}</Text>
      </View>
    );
  };

  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(64, 135, 249, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: colors.secondary },
  };

  return (
    <View style={styles.container}>
      {menuVisible && (
          <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownClose} onPress={() => setMenuVisible(false)}>
                  <Text style={{ color: colors.text.white, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownLogout} onPress={logout}>
                  <Text style={styles.dropdownLogoutText}>Sair</Text>
              </TouchableOpacity>
          </View>
      )}

      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={AvatarImg} style={styles.avatar} />
          <Text style={styles.headerText}>Olá, {user?.email}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={{ color: colors.text.black, fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.card}>
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.cardText}>Saldo disponível</Text>
              <Text style={styles.cardAmount}>
                {showBalance ? `R$ ${balance.toFixed(2).replace('.', ',')}` : "●●●●●●"}
              </Text>
              <Text style={styles.cardSubtitle}>Conta Corrente</Text>
            </View>
            <TouchableOpacity onPress={() => setShowBalance((s) => !s)}>
              <Image source={OcultarSaldoIcon} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Linha do FileUploaderComponent foi REMOVIDA daqui */}

        <View style={styles.summaryCard}>
            <Text style={styles.transactionTitle}>Atividade Recente</Text>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <LineChart
                    data={chartData}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            )}
        </View>

        <View style={styles.shortcutsContainer}>
          {["Pix", "Transferir", "Investir"].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.shortcut} onPress={() => handleShortcutPress(item)}>
              <Text style={styles.shortcutText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.transactionTitle}>Transações recentes</Text>
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
              data={transactions.slice(0, 5)}
              keyExtractor={(t) => t.id}
              renderItem={renderTx}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push("/tabs/list")}>
            <Text style={styles.seeAllText}>Ver todas as transações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}