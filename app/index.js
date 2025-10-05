import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/tabs/Home');
      } else {
        router.replace('/Login');
      }
    }
  }, [user, loading]);

  return null;
}