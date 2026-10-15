import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";
import { useFinance } from "@/context/FinanceContext";
import { Palette } from "@/constants/Colors";
import { formatCurrency } from "@/utils/dateUtils";

// Couleurs sémantiques conformes au Design System "Forest Sanctuary & Obsidian Vault"
const INCOME_COLOR = Palette.mintElectric; // #34D399 - Vert Émeraude / Menthe vivante
const EXPENSE_COLOR = "#FA5C65"; // #FA5C65 - Rouge Corail / Carmin chaud
const BADGE_TEXT_COLOR = Palette.pineDeep; // #0D2E22 - Encre forêt profonde à contraste élevé

/**
 * Calcule le tracé SVG d'un secteur de camembert
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const startX = cx + r * Math.cos(startAngle);
  const startY = cy + r * Math.sin(startAngle);
  const endX = cx + r * Math.cos(endAngle);
  const endY = cy + r * Math.sin(endAngle);

  const angleDiff = endAngle - startAngle;
  const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

  return `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
}

export function BalanceCard() {
  const { periodSummary, timeFrame } = useFinance();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const displayBalance = isBalanceHidden
    ? "••••••••"
    : formatCurrency(periodSummary.netBalance);

  const totalIncome = periodSummary.totalIncome;
  const totalExpense = periodSummary.totalExpense;
  const totalVolume = totalIncome + totalExpense;

  // Proportions
  const incomeRatio = totalVolume > 0 ? totalIncome / totalVolume : 0;
  const expenseRatio = totalVolume > 0 ? totalExpense / totalVolume : 0;

  const incomePercent = (incomeRatio * 100).toFixed(1);
  const expensePercent = (expenseRatio * 100).toFixed(1);

  // Dimensions du camembert
  const size = 84;
  const cx = size / 2;
  const cy = size / 2;
  const r = 40;
  const badgeRadius = r * 0.58;

  // Calcul des angles et positions des badges
  // Le vert menthe (Entrées) commence à 0 (3h) et va jusqu'à incomeAngle dans le sens horaire
  // Le rouge corail (Sorties) complète le reste
  const incomeAngle = incomeRatio * 2 * Math.PI;

  const incomeMidAngle = incomeAngle / 2;
  const incomeBadgeX = cx + badgeRadius * Math.cos(incomeMidAngle);
  const incomeBadgeY = cy + badgeRadius * Math.sin(incomeMidAngle);

  const expenseMidAngle = incomeAngle + (2 * Math.PI - incomeAngle) / 2;
  const expenseBadgeX = cx + badgeRadius * Math.cos(expenseMidAngle);
  const expenseBadgeY = cy + badgeRadius * Math.sin(expenseMidAngle);

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
              color={Palette.mintPale}
            />
          </Pressable>
        </View>

        {/* Taux d'épargne de la période */}
        <View style={styles.savingsPill}>
          <Ionicons
            name={periodSummary.netBalance >= 0 ? "trending-up" : "trending-down"}
            size={13}
            color={periodSummary.netBalance >= 0 ? Palette.mintElectric : EXPENSE_COLOR}
          />
          <Text
            style={[
              styles.savingsPillText,
              {
                color:
                  periodSummary.netBalance >= 0
                    ? Palette.mintElectric
                    : EXPENSE_COLOR,
              },
            ]}
          >
            {Math.round(periodSummary.savingsRate)}% épargne
          </Text>
        </View>
      </View>

      {/* Ligne Centrale : Solde Grand Format + Camembert SVG avec badges de pourcentage */}
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

        {/* Camembert compact 2D Entrées (Menthe) / Sorties (Corail) avec pilules % */}
        <View style={styles.chartWrapper}>
          {totalVolume === 0 ? (
            <View style={styles.emptyCircle}>
              <Ionicons name="swap-vertical" size={16} color="rgba(255, 255, 255, 0.4)" />
            </View>
          ) : (
            <View style={{ width: size, height: size, position: "relative" }}>
              <Svg width={size} height={size}>
                {expenseRatio >= 0.999 ? (
                  <Circle cx={cx} cy={cy} r={r} fill={EXPENSE_COLOR} />
                ) : incomeRatio >= 0.999 ? (
                  <Circle cx={cx} cy={cy} r={r} fill={INCOME_COLOR} />
                ) : (
                  <>
                    {/* Tranche Entrées (Vert Émeraude / Menthe) */}
                    <Path
                      d={describeArc(cx, cy, r, 0, incomeAngle)}
                      fill={INCOME_COLOR}
                    />
                    {/* Tranche Sorties (Rouge Corail) */}
                    <Path
                      d={describeArc(cx, cy, r, incomeAngle, 2 * Math.PI)}
                      fill={EXPENSE_COLOR}
                    />
                  </>
                )}
              </Svg>

              {/* Badge Sorties (% blanc avec chiffre foncé gras) */}
              {expenseRatio >= 0.12 && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.badgeWrapper,
                    {
                      left: expenseRatio >= 0.999 ? cx : expenseBadgeX,
                      top: expenseRatio >= 0.999 ? cy : expenseBadgeY,
                    },
                  ]}
                >
                  <View style={styles.pillBadge}>
                    <Text style={styles.pillBadgeText}>{expensePercent}%</Text>
                  </View>
                </View>
              )}

              {/* Badge Entrées (% blanc avec chiffre foncé gras) */}
              {incomeRatio >= 0.12 && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.badgeWrapper,
                    {
                      left: incomeRatio >= 0.999 ? cx : incomeBadgeX,
                      top: incomeRatio >= 0.999 ? cy : incomeBadgeY,
                    },
                  ]}
                >
                  <View style={styles.pillBadge}>
                    <Text style={styles.pillBadgeText}>{incomePercent}%</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Ligne inférieure : Sous-totaux Entrées (Menthe) vs Sorties (Corail) */}
      <View style={styles.bottomRow}>
        <View style={styles.flowCol}>
          <View style={styles.flowHeader}>
            <View style={[styles.flowDot, { backgroundColor: INCOME_COLOR }]} />
            <Text style={styles.flowLabel}>Entrées</Text>
          </View>
          <Text style={[styles.flowAmount, { color: INCOME_COLOR }]}>
            +{formatCurrency(totalIncome)}
          </Text>
        </View>

        <View style={styles.flowDivider} />

        <View style={styles.flowCol}>
          <View style={styles.flowHeader}>
            <View style={[styles.flowDot, { backgroundColor: EXPENSE_COLOR }]} />
            <Text style={styles.flowLabel}>Sorties</Text>
          </View>
          <Text style={[styles.flowAmount, { color: "#FFA6AC" }]}>
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
  chartWrapper: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeWrapper: {
    position: "absolute",
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  pillBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 3,
  },
  pillBadgeText: {
    color: BADGE_TEXT_COLOR,
    fontSize: 9.5,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.3,
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
