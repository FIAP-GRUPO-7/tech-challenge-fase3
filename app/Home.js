import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Home() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.replace("/Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Home ✔️</Text>
      <Pressable onPress={logout} style={{ padding: 10, backgroundColor: "#e11d48", borderRadius: 8 }}>
        <Text style={{ color: "white", fontWeight: "700" }}>Sair</Text>
      </Pressable>
    </View>
  );
}
