import { StyleSheet } from "react-native";
import { colors, spacing, fontSize, radius } from "./theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.text.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.text.white,
    fontSize: fontSize.md,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  button: {
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  loginButton: {
    backgroundColor: colors.secondary,
  },
  signupButton: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.text.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: fontSize.md,
  },
  loader: {
    marginBottom: spacing.md,
  },
});
