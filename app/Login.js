import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { registerUser, loginUser } from "../authService";
import { styles } from "../styles/LoginStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const validateFields = () => {
    if (!email || !password) {
      setError("Por favor, preencha email e senha.");
      return false;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;
    setLoading(true);
    setError("");
    try {
      await loginUser(email, password);
      router.replace("/Home");
    } catch (err) {
      setError("Erro ao fazer login: " + err.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!validateFields()) return;
    setLoading(true);
    setError("");
    try {
      await registerUser(email, password);
      router.replace("/Home");
    } catch (err) {
      setError("Erro ao criar conta: " + err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : (
        <>
          <TouchableOpacity onPress={handleLogin} style={[styles.button, styles.loginButton]}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignup} style={[styles.button, styles.signupButton]}>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
