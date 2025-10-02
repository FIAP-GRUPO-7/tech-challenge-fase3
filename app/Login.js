import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser, registerUser } from "../services/authService";
import { styles } from "../styles/LoginStyles";
import Animated, { FadeInDown } from "react-native-reanimated";

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
    // ...
    try {
      await loginUser(email, password);
      router.replace("/tabs/Home");
    } catch (err) {
      // ...
    }
  };

  const handleSignup = async () => {
    // ...
    try {
      await registerUser(email, password);
      router.replace("/tabs/Home");
    } catch (err) {
      // ...
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Acesse sua conta bancária</Text>


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