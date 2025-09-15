import { StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Cabeçalho
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerText: {
    color: colors.text.white,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  logoutButtonText: {
    color: colors.text.white,
    fontWeight: "700",
  },

  // Conteúdo principal
  mainContent: {
    flex: 1,
    padding: spacing.lg,
  },

  // Card de saldo
  card: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    color: colors.text.white,
    fontSize: fontSize.md,
  },
  cardSubtitle: {
    color: "#93C5FD",
    marginTop: 4,
    fontSize: fontSize.sm,
  },
  cardAmount: {
    color: colors.text.white,
    fontSize: fontSize.xl,
    fontWeight: "700",
    marginTop: spacing.sm,
  },

  // Atalhos
  shortcutsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: spacing.lg,
  },
  shortcut: {
    width: 48,
    height: 48,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  shortcutText: {
    fontSize: 10,
    color: colors.background,
    textAlign: "center",
  },

  // Resumo financeiro
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap", 
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.text.white,
    borderRadius: radius.md,
    padding: spacing.md,
    margin: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryLabel: {
    color: colors.text.muted,
    fontSize: fontSize.sm,
  },
  summaryValue: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: fontSize.sm,
  },

  // Transações recentes
  transactionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingVertical: spacing.sm,
  },
  transactionValue: {
    fontWeight: "700",
    fontSize: fontSize.md,
  },
});
