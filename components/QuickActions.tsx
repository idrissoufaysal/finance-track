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
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const actions: ActionItem[] = [
    {
      id: "add",
      label: "Add Money",
      icon: "add",
      onPress: () => router.push("/new-transaction"),
    },
    {
      id: "send",
      label: "Send",
      icon: "paper-plane-outline",
      onPress: () => router.push("/new-transaction"),
    },
    {
      id: "convert",
      label: "Convert",
      icon: "swap-horizontal",
      onPress: () => router.push("/(tabs)/transactions"),
    },
    {
      id: "more",
      label: "More",
      icon: "ellipsis-horizontal",
      onPress: () => router.push("/(tabs)/budgets"),
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
    marginTop: 20,
    marginBottom: 8,
  },
  itemWrap: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  squircle: {
    width: 60,
    height: 60,
    borderRadius: 22,
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
