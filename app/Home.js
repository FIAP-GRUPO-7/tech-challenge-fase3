// app/Home.js
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { styles } from "../styles/HomeStyles";
import { colors } from "../styles/theme";

export default function Home() {
  useAuthGuard();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Olá, {user?.email}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.mainContent}>
        {/* Card de saldo */}
        <View style={styles.card}>
          <Text style={styles.cardText}>Saldo disponível</Text>
          <Text style={styles.cardAmount}>R$ 2.500,00</Text>
          <Text style={styles.cardSubtitle}>Conta Corrente</Text>
        </View>

        {/* Atalhos */}
        <View style={styles.shortcutsContainer}>
          {["Pix", "Transferir", "Pagar", "Investir"].map((item, idx) => (
            <View key={idx} style={styles.shortcut}>
              <Text style={styles.shortcutText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Transações recentes */}
        <View style={styles.summaryCard}>
          <Text style={styles.transactionTitle}>Transações recentes</Text>
          {[
            { desc: "Depósito", value: "+R$ 500", color: colors.accent },
            { desc: "Compra", value: "-R$ 120", color: colors.danger },
            { desc: "Assinatura", value: "-R$ 40", color: colors.danger },
          ].map((item, idx) => (
            <View key={idx} style={styles.transactionRow}>
              <Text>{item.desc}</Text>
              <Text style={[styles.transactionValue, { color: item.color }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
