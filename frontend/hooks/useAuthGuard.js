import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";

export default function useAuthGuard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const auth = !!token; // true if token exists
      setIsAuthenticated(auth);
      setIsLoading(false);

      const inAuthGroup = segments[0] === "Auth";

      // If not logged in and not in Auth group, redirect to login
      if (!auth && !inAuthGroup) {
        router.replace("/Auth/login");
      }

      // If logged in but in Auth group (login/register), redirect to tabs
      if (auth && inAuthGroup) {
        router.replace("/(tabs)");
      }
    };

    checkAuth();
  }, [segments]);

  return { isAuthenticated, isLoading };
}
