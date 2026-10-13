import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "@/types/finance";
import { getCategoryById } from "@/constants/categories";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/dateUtils";

interface Props {
  transaction: Transaction;
  showDate?: boolean;
}

export function TransactionItem({ transaction, showDate = true }: Props) {
  const { colors, isDark } = useTheme();
  const { deleteTransaction } = useFinance();
  const category = getCategoryById(transaction.categoryId);

  const isIncome = transaction.type === "income";

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la transaction",
      `Voulez-vous supprimer "${transaction.title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  // Specific brand / category styling matching Stitch screenshots
  const getIconConfig = () => {
    const titleLower = transaction.title.toLowerCase();
    if (titleLower.includes("netflix")) {
      return { icon: "play", bg: "#000000", color: "#E50914", isBrand: true };
    }
    if (titleLower.includes("starbucks") || titleLower.includes("café")) {
      return { icon: "cafe", bg: "#006241", color: "#FFFFFF", isBrand: true };
    }
    if (titleLower.includes("uber")) {
      return { icon: "car", bg: "#F59E0B", color: "#000000", isBrand: true };
    }
    if (titleLower.includes("salaire") || titleLower.includes("salary")) {
      return { icon: "briefcase", bg: isDark ? "#122B1E" : "#0D2E22", color: "#34D399", isBrand: true };
    }
    return {
      icon: category.icon,
      bg: category.color + (isDark ? "25" : "18"),
      color: category.color,
      isBrand: false,
    };
  };

  const iconConfig = getIconConfig();

  return (
    <Pressable
      onLongPress={handleDelete}
      style={({ pressed }) => [
        styles.row,
        {
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {/* Circular Icon */}
      <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
        <Ionicons name={iconConfig.icon as any} size={18} color={iconConfig.color} />
      </View>

      {/* Main Info */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {category.name}
        </Text>
      </View>

      {/* Amount and Date Column */}
      <View style={styles.amountCol}>
        <Text
          style={[
            styles.amount,
            {
              color: isIncome ? colors.income : colors.text,
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          {isIncome ? "+ " : "- "}
          {formatCurrency(transaction.amount)}
        </Text>
        <Text style={[styles.dateText, { color: colors.textMuted }]}>
          {transaction.date === new Date().toISOString().split("T")[0]
            ? "Today"
            : transaction.date}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  amountCol: {
    alignItems: "flex-end",
    gap: 3,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
