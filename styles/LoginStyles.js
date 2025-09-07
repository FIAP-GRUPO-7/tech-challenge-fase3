import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F1F5F9",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#111827", 
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  errorText: {
    color: "#DC2626",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#2563EB", 
  },
  signupButton: {
    backgroundColor: "#16A34A", 
  },
  loader: {
    marginBottom: 16,
  },
});
