import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

interface ActionItem {
  id: string;
  label: string;
  icon: any;
  onPress: () => void;
}

export function QuickActions() {
  const { colors } = useTheme();
  const router = useRouter();

  const actions: ActionItem[] = [
    {
      id: "add",
      label: "Ajouter",
      icon: "add",
      onPress: () => router.push("/new-transaction"),
    },
    {
      id: "budgets",
      label: "Budgets",
      icon: "pie-chart-outline",
      onPress: () => router.push("/(tabs)/budgets"),
    },
    {
      id: "analytics",
      label: "Statistiques",
      icon: "stats-chart-outline",
      onPress: () => router.push("/(tabs)/analytics"),
    },
    {
      id: "history",
      label: "Historique",
      icon: "list-outline",
      onPress: () => router.push("/(tabs)/transactions"),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((act) => (
        <Pressable
          key={act.id}
          onPress={act.onPress}
          style={({ pressed }) => [
            styles.itemWrap,
            { opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <View
            style={[
              styles.squircle,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name={act.icon} size={22} color={colors.text} />
          </View>
          <Text style={[styles.label, { color: colors.text }]}>{act.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 6,
  },
  itemWrap: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  squircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});
