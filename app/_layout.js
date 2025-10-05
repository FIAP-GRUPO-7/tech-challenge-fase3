import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* A rota "index" é o ponto de entrada do seu aplicativo.
          Ela lida com o redirecionamento para login ou para as abas.
      */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Rota para o grupo de abas */}
      <Stack.Screen name="tabs" options={{ headerShown: false }} />

      {/* Rota para a tela de login */}
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="AddTransactions" options={{ title: "Adicionar Transação" }} />

      {/* Rotas para o fluxo de transferência */}
      <Stack.Screen name="Loading" options={{ headerShown: false }} />
      <Stack.Screen name="Comprovante" options={{ headerShown: false }} />
    </Stack>
  );
}