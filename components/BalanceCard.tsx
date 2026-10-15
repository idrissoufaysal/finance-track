import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, G } from "react-native-svg";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { Palette } from "@/constants/Colors";
import { formatCurrency } from "@/utils/dateUtils";

export function BalanceCard() {
  const { colors, isDark } = useTheme();
  const { periodSummary, timeFrame } = useFinance();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const displayBalance = isBalanceHidden
    ? "••••••••"
    : formatCurrency(periodSummary.netBalance);

  const totalIncome = periodSummary.totalIncome;
  const totalExpense = periodSummary.totalExpense;
  const totalVolume = totalIncome + totalExpense;

  // Calcul des proportions pour le cercle Entrées / Sorties
  const incomeRatio = totalVolume > 0 ? totalIncome / totalVolume : 0.5;
  const expenseRatio = totalVolume > 0 ? totalExpense / totalVolume : 0.5;

  const size = 76;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const incomeDash = totalVolume > 0 ? incomeRatio * circumference : 0;
  const expenseDash = totalVolume > 0 ? expenseRatio * circumference : 0;

  const periodLabelMap = {
    day: "aujourd'hui",
    week: "cette semaine",
    month: "ce mois-ci",
    year: "cette année",
  };

  return (
    <View style={styles.card}>
      {/* Ligne du haut : Libellé + Visibilité */}
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <View style={styles.statusDot} />
          <Text style={styles.label}>
            Solde {periodLabelMap[timeFrame] || "du mois"}
          </Text>
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

        {/* Taux d'épargne de la période */}
        <View style={styles.savingsPill}>
          <Ionicons
            name={periodSummary.netBalance >= 0 ? "trending-up" : "trending-down"}
            size={13}
            color={periodSummary.netBalance >= 0 ? Palette.mintElectric : "#F87171"}
          />
          <Text
            style={[
              styles.savingsPillText,
              {
                color:
                  periodSummary.netBalance >= 0
                    ? Palette.mintElectric
                    : "#F87171",
              },
            ]}
          >
            {Math.round(periodSummary.savingsRate)}% épargne
          </Text>
        </View>
      </View>

      {/* Ligne Centrale : Solde Grand Format + Cercle SVG Entrées/Sorties */}
      <View style={styles.middleRow}>
        <View style={styles.balanceCol}>
          <Text
            style={[styles.balanceText, { fontVariant: ["tabular-nums"] }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayBalance}
          </Text>
          <Text style={styles.balanceSubtext}>
            {periodSummary.netBalance >= 0 ? "Épargne positive" : "Déficit temporaire"}
          </Text>
        </View>

        {/* Cercle exprimant les Entrées (Vert) et Sorties (Rouge) */}
        <View style={styles.circleWrapper}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Piste de fond */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {totalVolume > 0 ? (
                <>
                  {/* Arc des Entrées (Vert émeraude) */}
                  {totalIncome > 0 && (
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke={Palette.mintElectric}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${incomeDash} ${circumference}`}
                      strokeDashoffset={0}
                      strokeLinecap={totalExpense > 0 ? "round" : "butt"}
                      fill="transparent"
                    />
                  )}
                  {/* Arc des Sorties (Rouge corail) */}
                  {totalExpense > 0 && (
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      stroke="#F87171"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${expenseDash} ${circumference}`}
                      strokeDashoffset={-incomeDash}
                      strokeLinecap={totalIncome > 0 ? "round" : "butt"}
                      fill="transparent"
                    />
                  )}
                </>
              ) : null}
            </G>
          </Svg>

          {/* Icône au centre du cercle */}
          <View style={styles.circleCenter} pointerEvents="none">
            <Ionicons
              name="swap-vertical"
              size={18}
              color={Palette.mintPale}
            />
          </View>
        </View>
      </View>

      {/* Ligne inférieure : Sous-totaux Entrées vs Sorties */}
      <View style={styles.bottomRow}>
        <View style={styles.flowCol}>
          <View style={styles.flowHeader}>
            <View style={[styles.flowDot, { backgroundColor: "#34D399" }]} />
            <Text style={styles.flowLabel}>Entrées</Text>
          </View>
          <Text style={[styles.flowAmount, { color: "#34D399" }]}>
            +{formatCurrency(totalIncome)}
          </Text>
        </View>

        <View style={styles.flowDivider} />

        <View style={styles.flowCol}>
          <View style={styles.flowHeader}>
            <View style={[styles.flowDot, { backgroundColor: "#F87171" }]} />
            <Text style={styles.flowLabel}>Sorties</Text>
          </View>
          <Text style={[styles.flowAmount, { color: "#FCA5A5" }]}>
            -{formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: Palette.pineCard,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.pineBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  eyeBtn: {
    padding: 2,
  },
  savingsPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 211, 153, 0.14)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    gap: 4,
  },
  savingsPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  balanceCol: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  balanceSubtext: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
  },
  circleWrapper: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circleCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  flowCol: {
    flex: 1,
    gap: 3,
  },
  flowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flowDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  flowLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    fontWeight: "500",
  },
  flowAmount: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  flowDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginHorizontal: 12,
  },
});
