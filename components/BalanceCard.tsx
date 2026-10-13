import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import Colors, { Palette } from "@/constants/Colors";
import { formatCurrency } from "@/utils/dateUtils";

export function BalanceCard() {
  const { colors, isDark } = useTheme();
  const { periodSummary } = useFinance();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const displayBalance = isBalanceHidden
    ? "••••••••"
    : formatCurrency(periodSummary.netBalance);

  return (
    <View style={styles.card}>
      {/* Top Row: Indicator + Total Balance + Eye + Signal Icon */}
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <View style={styles.statusDot} />
          <Text style={styles.label}>Total Balance</Text>
          <Pressable
            onPress={() => setIsBalanceHidden(!isBalanceHidden)}
            hitSlop={8}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={isBalanceHidden ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#A7F3D0"
            />
          </Pressable>
        </View>

        {/* Right signal / chart icon */}
        <View style={styles.signalIcon}>
          <Ionicons name="stats-chart" size={16} color="#34D399" />
        </View>
      </View>

      {/* Main Row: Big Balance + Percentage Pill */}
      <View style={styles.mainRow}>
        <Text
          style={[styles.balanceText, { fontVariant: ["tabular-nums"] }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {displayBalance}
        </Text>

        <View style={styles.badgeColumn}>
          <View style={styles.pillBadge}>
            <Ionicons name="caret-up" size={12} color="#34D399" />
            <Text style={styles.pillText}>12.6%</Text>
          </View>
          <Text style={styles.pillSubtext}>vs last month</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Palette.pineCard,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Palette.pineBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.mintElectric,
    shadowColor: Palette.mintElectric,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  eyeBtn: {
    padding: 2,
  },
  signalIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 211, 153, 0.12)",
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    flex: 1,
  },
  badgeColumn: {
    alignItems: "flex-end",
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 211, 153, 0.18)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  pillText: {
    color: Palette.mintElectric,
    fontSize: 12,
    fontWeight: "700",
  },
  pillSubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 3,
  },
});
