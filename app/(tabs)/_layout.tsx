import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { CurvedBottomTabs } from "@/components/ui/curved-bottom-tabs";

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      tabBar={(props) => (
        <CurvedBottomTabs
          {...props}
          gradients={isDark ? ["#0D2E22", "#051610"] : ["#1B4D3E", "#0D2E22"]}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="new-transaction"
        options={{
          title: "Ajouter",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "add-circle" : "add"}
              size={size ? size + 4 : 26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Historique",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
