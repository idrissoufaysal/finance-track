import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { DonutChart } from "@/components/DonutChart";
import { SpendingTrendChart } from "@/components/SpendingTrendChart";
import { PeriodSelector } from "@/components/PeriodSelector";
import { formatCurrency } from "@/utils/dateUtils";

export default function AnalyticsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const {
    periodSummary,
    categorySummaries,
    chartPoints,
    budgets,
    periodTitle,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<"spending" | "income" | "savings">("spending");

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "spending", label: "Dépenses" },
    { key: "income", label: "Revenus" },
    { key: "savings", label: "Épargne" },
  ];

  // Tranches du donut chart dérivées de la base de données
  const donutSlices = useMemo(() => {
    return categorySummaries.map((cs) => ({
      id: cs.category.id,
      name: cs.category.name,
      percentage: cs.percentage,
      color: cs.category.color,
      amount: cs.totalAmount,
    }));
  }, [categorySummaries]);

  // Calcul du respect des budgets alloués
  const totalBudgetLimit = useMemo(() => {
    return budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  }, [budgets]);

  const budgetUsagePercent =
    totalBudgetLimit > 0
      ? Math.round((periodSummary.totalExpense / totalBudgetLimit) * 100)
      : 0;

  const isUnderBudget = periodSummary.totalExpense <= totalBudgetLimit;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* En-tête : Titre Statistiques + Sélecteur de période */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Statistiques</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {periodTitle}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/new-transaction")}
          style={[styles.plusBtn, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sélecteur de période (Jour / Semaine / Mois) */}
        <PeriodSelector />

        {/* Onglets Dépenses / Revenus / Épargne */}
        <View style={styles.pillsRow}>
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            const bg = isActive
              ? isDark
                ? "#34D399"
                : "#059669"
              : colors.surfaceSecondary;
            const textColor = isActive
              ? isDark
                ? "#070D0A"
                : "#FFFFFF"
              : colors.textSecondary;

            return (
              <Pressable
                key={t.key}
                onPress={() => setActiveTab(t.key)}
                style={[styles.pillItem, { backgroundColor: bg }]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: textColor, fontWeight: isActive ? "700" : "500" },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Récapitulatif rapide selon l'onglet actif */}
        <View style={[styles.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.summaryBoxLabel, { color: colors.textSecondary }]}>
            {activeTab === "spending"
              ? "Total des dépenses"
              : activeTab === "income"
              ? "Total des revenus"
              : "Solde net d'épargne"}
          </Text>
          <Text
            style={[
              styles.summaryBoxValue,
              {
                color:
                  activeTab === "spending"
                    ? colors.expense
                    : colors.income,
                fontVariant: ["tabular-nums"],
              },
            ]}
          >
            {activeTab === "spending"
              ? formatCurrency(periodSummary.totalExpense)
              : activeTab === "income"
              ? formatCurrency(periodSummary.totalIncome)
              : formatCurrency(periodSummary.netBalance)}
          </Text>
        </View>

        {/* Graphique Donut par Catégorie */}
        <View style={[styles.cardSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Répartition par catégorie
          </Text>
          <DonutChart
            totalSpent={
              activeTab === "spending"
                ? periodSummary.totalExpense
                : periodSummary.totalIncome
            }
            slices={donutSlices}
          />
        </View>

        {/* Bannière Budgétaire Dynamique */}
        {totalBudgetLimit > 0 && (
          <View
            style={[
              styles.bannerCard,
              {
                backgroundColor: isUnderBudget
                  ? colors.bannerBg
                  : isDark
                  ? "#2A1414"
                  : "#FEE2E2",
              },
            ]}
          >
            <View
              style={[
                styles.leafCircle,
                {
                  backgroundColor: isUnderBudget
                    ? isDark
                      ? "rgba(52, 211, 153, 0.18)"
                      : "#D1E7D6"
                    : "rgba(239, 68, 68, 0.2)",
                },
              ]}
            >
              <Ionicons
                name={isUnderBudget ? "shield-checkmark" : "alert-circle"}
                size={20}
                color={isUnderBudget ? (isDark ? "#34D399" : "#059669") : "#EF4444"}
              />
            </View>
            <View style={styles.bannerInfo}>
              <Text
                style={[
                  styles.bannerTitle,
                  {
                    color: isUnderBudget
                      ? isDark
                        ? "#34D399"
                        : "#065F46"
                      : "#DC2626",
                  },
                ]}
              >
                {isUnderBudget
                  ? `Sous le plafond : ${budgetUsagePercent}% consommé`
                  : `Attention : Dépassement à ${budgetUsagePercent}%`}
              </Text>
              <Text
                style={[
                  styles.bannerSubtitle,
                  { color: isDark ? "#88988E" : "#4B5563" },
                ]}
              >
                {isUnderBudget
                  ? `Vous avez dépensé ${formatCurrency(periodSummary.totalExpense)} sur un plafond de ${formatCurrency(totalBudgetLimit)}.`
                  : `Vos dépenses de ${formatCurrency(periodSummary.totalExpense)} dépassent le plafond de ${formatCurrency(totalBudgetLimit)}.`}
              </Text>
            </View>
          </View>
        )}

        {/* Évolution chronologique des dépenses */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
            Tendance journalière
          </Text>
          <SpendingTrendChart points={chartPoints} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 12,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  pillItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 13,
  },
  summaryBox: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryBoxLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryBoxValue: {
    fontSize: 26,
    fontWeight: "800",
  },
  cardSection: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    gap: 12,
    marginTop: 6,
  },
  leafCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerInfo: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  bannerSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
});
