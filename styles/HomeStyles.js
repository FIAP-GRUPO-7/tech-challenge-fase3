import { StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: colors.black,
    borderRadius: radius.md,
    padding: spacing.md,
    minWidth: 120,
    zIndex: 1000,
    elevation: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  dropdownClose: {
    alignSelf: "flex-end",
  },
  dropdownLogout: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.text.muted,
    paddingTop: spacing.sm,
  },
  dropdownLogoutText: {
    color: colors.text.white,
    fontWeight: "600",
    
    fontSize: fontSize.sm,
    textAlign: "center",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    marginRight: 10,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: colors.text.muted + "33",
  },
  headerText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  headerMenu: {
    fontSize: fontSize.lg,
    color: colors.text.primary,
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
    zIndex: 1,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    color: colors.text.white,
    fontSize: fontSize.md,
  },
  cardSubtitle: {
    color: "#DCEAFE",
    marginTop: 4,
    fontSize: fontSize.sm,
  },
  cardAmount: {
    color: colors.text.white,
    fontSize: fontSize.xl,
    fontWeight: "700",
    marginTop: spacing.sm,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
    resizeMode: 'contain',
  },


  // Atalhos
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  shortcut: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  shortcutText: {
    color: colors.text.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },


  // Transações recentes
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },

  transactionsHeaderText: {
    flex: 1,
    textAlign: "center",
    color: colors.text.white,
    fontWeight: "600",
  },

  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  transactionText: {
    flex: 1,
    textAlign: "center",
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },

  transactionValuePositive: {
    flex: 1,
    textAlign: "center",
    color: "green",
    fontWeight: "600",
  },

  transactionValueNegative: {
    flex: 1,
    textAlign: "center",
    color: "red",
    fontWeight: "600",
  },

  transactionsContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: radius.sm,
    padding: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: "#fff", 
  },

  transactionsTitle: {
    fontSize: fontSize.md,
    fontWeight: "800",
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },

  viewAllText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
    marginTop: spacing.sm,
  },

});
