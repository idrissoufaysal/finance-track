import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { ONBOARDING_STORAGE_KEY } from "@/services/storageShared";
import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";
import { NavigationBar } from "expo-navigation-bar";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <FinanceProvider>
          <RootNavigation />
        </FinanceProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigation() {
  const { theme, colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  const [checked, setChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
      .then((value) => setNeedsOnboarding(value !== "true"))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!checked) return;
    const inOnboarding = segments[0] === "onboarding";
    if (needsOnboarding && !inOnboarding) {
      router.replace("/onboarding");
    }
  }, [checked, needsOnboarding, segments, router]);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      {Platform.OS === "android" && (
        <>
          <RNStatusBar
            backgroundColor="transparent"
            translucent
            barStyle={theme === "dark" ? "light-content" : "dark-content"}
          />
          <NavigationBar style={theme === "dark" ? "light" : "dark"} />
        </>
      )}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-transaction"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>

      {/* Écran Splash animé inspiré du design Stitch (Forest Sanctuary & Obsidian Vault) */}
      {!isSplashComplete && (
        <AnimatedSplashScreen onAnimationComplete={() => setIsSplashComplete(true)} />
      )}
    </>
  );
}
