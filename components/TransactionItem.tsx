import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "@/types/finance";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/dateUtils";

interface Props {
  transaction: Transaction;
  showDate?: boolean;
}

export function TransactionItem({ transaction }: Props) {
  const { colors, isDark } = useTheme();
  const { deleteTransaction } = useFinance();

  const isIncome = transaction.type === "income";

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'opération",
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

  const isToday = transaction.date === new Date().toISOString().split("T")[0];
  const dateFormatted = isToday ? "Aujourd'hui" : transaction.date;

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
      {/* Icône circulaire simple Entrée / Sortie */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isIncome
              ? isDark
                ? "rgba(52, 211, 153, 0.15)"
                : "#DCFCE7"
              : isDark
              ? "rgba(239, 68, 68, 0.15)"
              : "#FEE2E2",
          },
        ]}
      >
        <Ionicons
          name={isIncome ? "arrow-down" : "arrow-up"}
          size={18}
          color={isIncome ? (isDark ? "#34D399" : "#059669") : "#EF4444"}
        />
      </View>

      {/* Titre et Heure */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {dateFormatted} {transaction.time ? `• ${transaction.time}` : ""}
        </Text>
      </View>

      {/* Montant */}
      <View style={styles.amountCol}>
        <Text
          style={[
            styles.amount,
            {
              color: isIncome
                ? isDark
                  ? "#34D399"
                  : "#059669"
                : isDark
                ? "#F87171"
                : "#DC2626",
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          {isIncome ? "+ " : "- "}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  amountCol: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 15,
    fontWeight: "800",
  },
});
