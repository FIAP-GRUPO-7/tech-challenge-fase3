import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser, registerUser } from "../services/authService";
import { styles } from "../styles/LoginStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Novo estado
  const [isSigningUp, setIsSigningUp] = useState(false); // Novo estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const validateFields = () => {
    if (isSigningUp && !fullName.trim()) {
      setError("Por favor, preencha o nome completo.");
      return false;
    }
    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha email e senha.");
      return false;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await loginUser(email, password);
      router.replace("/tabs/Home");
    } catch (err) {
      setError(err.message || "Email ou senha inválidos.");
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await registerUser(email, password, fullName);
      router.replace("/tabs/Home");
    } catch (err) {
      setError(err.message || "Erro ao criar conta.");
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* O título muda de acordo com o modo */}
      <Text style={styles.title}>{isSigningUp ? "Criar Conta" : "Login"}</Text>
      <Text style={styles.subtitle}>
        {isSigningUp ? "Crie uma nova conta para começar" : "Acesse sua conta bancária"}
      </Text>

      {/* Campo de Nome Completo condicional */}
      {isSigningUp && (
        <TextInput
          placeholder="Nome Completo"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
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
          {/* Mostra botões de acordo com o modo */}
          {isSigningUp ? (
            <>
              <TouchableOpacity onPress={handleSignup} style={[styles.button, styles.signupButton]}>
                <Text style={styles.buttonText}>Confirmar Cadastro</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSigningUp(false)}>
                <Text style={styles.linkText}>Voltar para o login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleLogin} style={[styles.button, styles.loginButton]}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsSigningUp(true)} style={[styles.button, styles.signupButton]}>
                <Text style={styles.buttonText}>Criar Conta</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}