import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { styles } from "../styles/HomeStyles"; // importe o styles

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

        {/* Main Content */}
        <ScrollView style={styles.mainContent}>
          {/* Cartão de saldo */}
          <View style={styles.card}>
            <Text style={styles.cardText}>Saldo</Text>
            <Text style={styles.cardAmount}>R$ 2.500,00</Text>
            <Text style={{ color: "#93C5FD", marginTop: 4 }}>Conta Corrente</Text>
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
        </ScrollView>
      </View>
    </View>
  );
}
