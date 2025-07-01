import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import SafeScreen from "../components/SafeScreen";
import { SplashScreen } from "expo-router";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await checkAuth();
      setAppReady(true);
    };
    prepare();
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const secondSegment = segments[1] || "";
    const allowedAuthRoutes = [
      "forgot-password",
      "verify-reset-code",
      "reset-password",
      "changepassword",
      "moodlogs",
    ];

    const isSignedIn = !!user && !!token;

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isSignedIn && inAuthGroup && !allowedAuthRoutes.includes(secondSegment)) {
      router.replace("/(tabs)");
    }

    SplashScreen.hideAsync();
  }, [appReady, user, token, segments]);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeScreen>
      <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
