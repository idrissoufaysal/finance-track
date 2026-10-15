import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Animated, PanResponder } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "@/types/finance";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/dateUtils";

interface Props {
  transaction: Transaction;
  showDate?: boolean;
}

const ACTION_WIDTH = 84;

export function TransactionItem({ transaction, showDate = true }: Props) {
  const { colors } = useTheme();
  const { deleteTransaction } = useFinance();

  const isIncome = transaction.type === "income";
  const [translateX] = useState(() => new Animated.Value(0));
  const [restOffset, setRestOffset] = useState(0);

  const animateTo = useCallback(
    (to: number) => {
      setRestOffset(to);
      Animated.spring(translateX, {
        toValue: to,
        useNativeDriver: true,
        bounciness: 4,
        speed: 18,
      }).start();
    },
    [translateX]
  );

  const close = useCallback(() => animateTo(0), [animateTo]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, g) =>
          Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderMove: (_evt, g) => {
          const next = Math.min(0, Math.max(-ACTION_WIDTH, restOffset + g.dx));
          translateX.setValue(next);
        },
        onPanResponderRelease: (_evt, g) => {
          animateTo(restOffset + g.dx < -ACTION_WIDTH / 2 ? -ACTION_WIDTH : 0);
        },
        onPanResponderTerminate: () => {
          animateTo(restOffset < -ACTION_WIDTH / 2 ? -ACTION_WIDTH : 0);
        },
      }),
    [restOffset, translateX, animateTo]
  );

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'opération",
      `Voulez-vous supprimer "${transaction.title}" ?`,
      [
        { text: "Annuler", style: "cancel", onPress: close },
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
    <View style={styles.swipeWrap}>
      {/* Action révélée au glissement */}
      <View style={[styles.deleteAction, { backgroundColor: colors.expense }]}>
        <Pressable
          onPress={handleDelete}
          style={styles.deleteBtn}
          accessibilityRole="button"
          accessibilityLabel={`Supprimer ${transaction.title}`}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteLabel}>Suppr.</Text>
        </Pressable>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.row,
          { backgroundColor: colors.surface, transform: [{ translateX }] },
        ]}
      >
        <Pressable onLongPress={handleDelete} delayLongPress={350} style={styles.rowInner}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isIncome ? colors.incomeLight : colors.expenseLight },
            ]}
          >
            <Ionicons
              name={isIncome ? "arrow-down" : "arrow-up"}
              size={18}
              color={isIncome ? colors.income : colors.expense}
            />
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {transaction.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {showDate ? dateFormatted : ""}
              {showDate && transaction.time ? " • " : ""}
              {transaction.time ? transaction.time : ""}
            </Text>
          </View>

          <View style={styles.amountCol}>
            <Text
              style={[
                styles.amount,
                { color: isIncome ? colors.income : colors.expense, fontVariant: ["tabular-nums"] },
              ]}
            >
              {isIncome ? "+ " : "- "}
              {formatCurrency(transaction.amount)}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeWrap: {
    position: "relative",
    justifyContent: "center",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 4,
    bottom: 4,
    width: ACTION_WIDTH,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    flex: 1,
    width: "100%",
  },
  deleteLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  row: {
    borderRadius: 14,
  },
  rowInner: {
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
