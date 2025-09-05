import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { registerUser, loginUser } from "../authService"; 

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
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f1f5f9" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          backgroundColor: "#fff",
        }}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          backgroundColor: "#fff",
        }}
      />

      {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginBottom: 12 }} />
      ) : (
        <>
          <TouchableOpacity
            onPress={handleLogin}
            style={{ backgroundColor: "#2563eb", padding: 15, borderRadius: 8, marginBottom: 10 }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignup}
            style={{ backgroundColor: "#16a34a", padding: 15, borderRadius: 8 }}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
              Criar Conta
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
