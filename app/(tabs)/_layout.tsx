import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 14);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: bottomInset,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,
          backgroundColor: isDark ? "rgba(16, 24, 20, 0.96)" : "rgba(255, 255, 255, 0.96)",
          borderWidth: 1,
          borderColor: isDark ? "rgba(52, 211, 153, 0.25)" : "rgba(0, 0, 0, 0.08)",
          shadowColor: isDark ? "#34D399" : "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.25 : 0.08,
          shadowRadius: 18,
          elevation: 10,
          paddingHorizontal: 12,
        },
      }}
    >
      {/* 1. Onglet Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabItemWrap,
                focused && [
                  styles.tabItemActive,
                  {
                    backgroundColor: isDark
                      ? "rgba(52, 211, 153, 0.16)"
                      : "rgba(5, 150, 105, 0.1)",
                  },
                ],
              ]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={20}
                color={
                  focused
                    ? isDark
                      ? "#34D399"
                      : "#059669"
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: focused
                      ? isDark
                        ? "#34D399"
                        : "#059669"
                      : colors.textSecondary,
                    fontWeight: focused ? "700" : "500",
                  },
                ]}
              >
                Accueil
              </Text>
            </View>
          ),
        }}
      />

      {/* 2. Bouton Central [+] avec halo émeraude tactile */}
      <Tabs.Screen
        name="center-action"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.floatingCenterWrap}>
              <Pressable
                onPress={() => router.push("/new-transaction")}
                style={({ pressed }) => [
                  styles.floatingCenterBtn,
                  {
                    backgroundColor: isDark ? "#34D399" : "#059669",
                    shadowColor: isDark ? "#34D399" : "#059669",
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.94 : 1 }],
                  },
                ]}
                hitSlop={6}
              >
                <Ionicons
                  name="add"
                  size={30}
                  color={isDark ? "#07100C" : "#FFFFFF"}
                />
              </Pressable>
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/new-transaction");
          },
        }}
      />

      {/* 3. Onglet Historique */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Historique",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabItemWrap,
                focused && [
                  styles.tabItemActive,
                  {
                    backgroundColor: isDark
                      ? "rgba(52, 211, 153, 0.16)"
                      : "rgba(5, 150, 105, 0.1)",
                  },
                ],
              ]}
            >
              <Ionicons
                name={focused ? "receipt" : "receipt-outline"}
                size={20}
                color={
                  focused
                    ? isDark
                      ? "#34D399"
                      : "#059669"
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: focused
                      ? isDark
                        ? "#34D399"
                        : "#059669"
                      : colors.textSecondary,
                    fontWeight: focused ? "700" : "500",
                  },
                ]}
              >
                Historique
              </Text>
            </View>
          ),
        }}
      />

      {/* Routes secondaires désactivées de la navbar */}
      <Tabs.Screen
        name="analytics"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="budgets"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItemWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabItemActive: {
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontSize: 12,
  },
  floatingCenterWrap: {
    top: -16,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCenterBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
});
