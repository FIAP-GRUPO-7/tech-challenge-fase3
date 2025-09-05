import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./useAuth";

export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/Login");
    }
  }, [user, loading, router]);
}
