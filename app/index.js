import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo ao Banco!</Text>
      <Link href="/login" asChild>
        <Button title="Ir para Login" />
      </Link>
    </View>
  );
}
