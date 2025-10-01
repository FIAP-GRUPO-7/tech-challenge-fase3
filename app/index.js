import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redireciona para o grupo de abas
        router.replace('/tabs/Home');
      } else {
        // Redireciona para a tela de login
        router.replace('/Login');
      }
    }
  }, [user, loading]);

  return null;
}