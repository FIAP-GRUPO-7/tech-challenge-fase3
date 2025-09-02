import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig";

export default function useAuthGuard() {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        
        router.replace("/Login");
      }
    });

    return unsubscribe;
  }, []);
}
