import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#34D399" : "#0D2E22",
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Analytics */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pie-chart" : "pie-chart-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Center Floating Action Button (⇄) */}
      <Tabs.Screen
        name="center-action"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarButton: () => (
            <View style={styles.floatingCenterWrap}>
              <Pressable
                onPress={() => router.push("/new-transaction")}
                style={({ pressed }) => [
                  styles.floatingCenterBtn,
                  {
                    backgroundColor: isDark ? "#123728" : "#0D2E22",
                    borderColor: isDark ? "#34D399" : "rgba(255, 255, 255, 0.2)",
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Ionicons name="swap-horizontal" size={24} color="#34D399" />
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

      {/* 4. Cards / Budgets */}
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Cards",
          tabBarLabel: "Cards",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "card" : "card-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 5. Profile / Transactions */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingCenterWrap: {
    top: -14,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCenterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});
