import { View, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/Home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    try {
      await signup(email, password);
      router.replace('/Home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button title="Criar conta" onPress={handleSignup} />
    </View>
  );
}
