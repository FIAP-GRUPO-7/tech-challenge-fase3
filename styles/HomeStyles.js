import { StyleSheet } from "react-native";
import { colors, spacing, radius, fontSize } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

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
    fontSize: fontSize.lg,
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

  sidebarLeft: {
    width: "20%",
    backgroundColor: colors.text.white,
    borderRightWidth: 1,
    borderRightColor: colors.background,
    padding: spacing.md,
  },
  sidebarItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  sidebarItemText: {
    color: colors.text.secondary,
    fontWeight: "500",
    fontSize: fontSize.md,
  },

  sidebarRight: {
    width: "25%",
    backgroundColor: colors.text.white,
    borderLeftWidth: 1,
    borderLeftColor: colors.background,
    padding: spacing.md,
  },
  sidebarRightTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  sidebarRightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingVertical: spacing.sm,
  },
  sidebarRightValue: {
    fontWeight: "700",
    fontSize: fontSize.md,
  },

  mainContent: {
    flex: 1,
    padding: spacing.lg,
  },

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

  shortcutsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.lg,
  },
  shortcut: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent + "33", // cor com transparência
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    textAlign: "center",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.text.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.sm,
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
    fontSize: fontSize.md,
  },

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
