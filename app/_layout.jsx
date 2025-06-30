import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { SplashScreen } from "expo-router";
import { COLORS } from "../constants/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await checkAuth(); // must await here
      setAppReady(true);
    };

    prepare();
  }, []);

   useEffect(() => {
    if (!appReady) return;

    const isSignedIn = !!user && !!token;

    const group = segments[0];       // (auth), (tabs)
    const subRoute = segments[1];    // e.g., "verify-email"
    const isInAuthGroup = group === "(auth)";
    const isVerificationPage = isInAuthGroup && subRoute === "verify-email";

    if (!isSignedIn && !isInAuthGroup) {
  router.replace("/sign-in");
} else if (isSignedIn && isInAuthGroup && user?.isVerified) {
  router.replace("/(tabs)");
}

    SplashScreen.hideAsync(); // <- hide splash when decision is made
  }, [appReady, user, token, segments]);

  return (
    <SafeAreaProvider style={{ flex: 1}}>
      <SafeScreen>
        {appReady ? <Slot /> : null}
      </SafeScreen>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </SafeAreaProvider>
  );
}

