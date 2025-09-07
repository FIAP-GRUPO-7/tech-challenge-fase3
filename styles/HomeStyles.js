import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  sidebar: {
    width: "25%",          
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    padding: 12,
  },
  sidebarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sidebarItemText: {
    color: "#374151",
    fontWeight: "500",
  },

  mainContent: {
    flex: 1,
    padding: 16,
  },

  card: {
    backgroundColor: "#1E40AF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    color: "#FFFFFF",
  },
  cardAmount: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },


  shortcutsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  shortcut: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#BFDBFE",
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutText: {
    fontSize: 12,
    color: "#1E3A8A",
    textAlign: "center",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryLabel: {
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryValue: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 16,
  },
});
