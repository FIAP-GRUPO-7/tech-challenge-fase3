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
    fontSize: fontSize.xl + 4,
    fontWeight: "700",
    marginBottom: spacing.sm,
    textAlign: "center",
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  input: {
    width: "100%",
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
    width: "100%",
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
