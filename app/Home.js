import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { styles } from "../styles/HomeStyles";

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
        {/* Sidebar */}
        <View style={styles.sidebar}>
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
            <Text style={{ color: "#93C5FD", marginTop: 4 }}>
              Conta Corrente
            </Text>
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
              <Text style={[styles.summaryValue, { color: "#16A34A" }]}>
                R$ 1.300,00
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Saídas</Text>
              <Text style={[styles.summaryValue, { color: "#DC2626" }]}>
                R$ 2.200,00
              </Text>
            </View>
          </View>

          {/* Transações recentes */}
          <View style={styles.summaryCard}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
              Transações recentes
            </Text>
            {[
              { desc: "Depósito", value: "+R$ 500", color: "#16A34A" },
              { desc: "Compra", value: "-R$ 120", color: "#DC2626" },
              { desc: "Assinatura", value: "-R$ 40", color: "#DC2626" },
            ].map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                  paddingVertical: 8,
                }}
              >
                <Text>{item.desc}</Text>
                <Text style={{ fontWeight: "700", color: item.color }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Extrato lateral */}
        <View style={styles.sidebar}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Extrato
          </Text>
          {[
            { desc: "Depósito", value: "+R$ 150", color: "#16A34A" },
            { desc: "Depósito", value: "+R$ 100", color: "#16A34A" },
            { desc: "Transferência", value: "-R$ 500", color: "#DC2626" },
          ].map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
                paddingVertical: 8,
              }}
            >
              <Text>{item.desc}</Text>
              <Text style={{ fontWeight: "700", color: item.color }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
