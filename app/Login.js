import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tela de Login</Text>
      <Link href="/home" asChild>
        <Button title="Entrar" />
      </Link>
    </View>
  );
}
