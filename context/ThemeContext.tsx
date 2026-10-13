import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useColorScheme as useColorSchemeRN, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";

export type ThemeMode = "system" | "light" | "dark";

interface ThemeContextType {
  theme: "light" | "dark";
  themeMode: ThemeMode;
  isDark: boolean;
  colors: typeof Colors.light;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = "@finance_track_theme_mode_v1";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorSchemeRN();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((val) => {
        if (val === "light" || val === "dark" || val === "system") {
          setThemeModeState(val);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn("Failed to save theme mode:", e);
    }
  }, []);

  const resolvedTheme: "light" | "dark" = useMemo(() => {
    if (themeMode === "light") return "light";
    if (themeMode === "dark") return "dark";
    return systemScheme === "dark" ? "dark" : "light";
  }, [themeMode, systemScheme]);

  const toggleTheme = useCallback(async () => {
    const nextMode: ThemeMode = resolvedTheme === "dark" ? "light" : "dark";
    await setThemeMode(nextMode);
  }, [resolvedTheme, setThemeMode]);

  const colors = useMemo(() => Colors[resolvedTheme], [resolvedTheme]);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      themeMode,
      isDark: resolvedTheme === "dark",
      colors,
      setThemeMode,
      toggleTheme,
    }),
    [resolvedTheme, themeMode, colors, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Graceful fallback outside provider
    return {
      theme: "light",
      themeMode: "system",
      isDark: false,
      colors: Colors.light,
      setThemeMode: async () => {},
      toggleTheme: async () => {},
    };
  }
  return ctx;
}
