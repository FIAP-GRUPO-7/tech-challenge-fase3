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

      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar esquerdo */}
        <View style={styles.sidebarLeft}>
          {["Início", "Transferências", "Investimentos", "Outros serviços"].map(
            (item, index) => (
              <TouchableOpacity key={index} style={styles.sidebarItem}>
                <Text style={styles.sidebarItemText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Main content */}
        <ScrollView style={styles.mainContent}>
          {/* Card de saldo */}
          <View style={styles.card}>
            <Text style={styles.cardText}>Saldo</Text>
            <Text style={styles.cardAmount}>R$ 2.500,00</Text>
            <Text style={styles.cardSubtitle}>Conta Corrente</Text>
          </View>

          {/* Atalhos */}
          <View style={styles.shortcutsContainer}>
            {["Pagar", "Transferir", "Pix", "Investir", "Fatura", "Seguros"].map(
              (item, idx) => (
                <View key={idx} style={styles.shortcut}>
                  <Text style={styles.shortcutText}>{item}</Text>
                </View>
              )
            )}
          </View>

          {/* Resumo financeiro */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Saldo Inicial</Text>
              <Text style={styles.summaryValue}>R$ 5.000,00</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Entradas</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                R$ 1.300,00
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Saídas</Text>
              <Text style={[styles.summaryValue, { color: colors.danger }]}>
                R$ 2.200,00
              </Text>
            </View>
          </View>

          {/* Transações recentes */}
          <View style={styles.summaryCard}>
            <Text style={styles.transactionTitle}>Transações recentes</Text>
            {[
              { desc: "Depósito", value: "+R$ 500", color: colors.success },
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

        {/* Sidebar direito (Extrato) */}
        <View style={styles.sidebarRight}>
          <Text style={styles.sidebarRightTitle}>Extrato</Text>
          {[
            { desc: "Depósito", value: "+R$ 150", color: colors.success },
            { desc: "Depósito", value: "+R$ 100", color: colors.success },
            { desc: "Transferência", value: "-R$ 500", color: colors.danger },
          ].map((item, idx) => (
            <View key={idx} style={styles.sidebarRightRow}>
              <Text>{item.desc}</Text>
              <Text style={[styles.sidebarRightValue, { color: item.color }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
