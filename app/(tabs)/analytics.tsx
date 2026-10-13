import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
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

export default function AnalyticsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { periodSummary } = useFinance();

  const [activeTab, setActiveTab] = useState<"spending" | "income" | "savings" | "goals">("spending");

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "spending", label: "Spending" },
    { key: "income", label: "Income" },
    { key: "savings", label: "Savings" },
    { key: "goals", label: "Goals" },
  ];

  const totalSpent = periodSummary.totalExpense > 0 ? periodSummary.totalExpense : 754330;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header: < Back | Analytics | 📅 Calendar */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.circleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics</Text>

        <Pressable
          style={[styles.circleBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Pills: Spending | Income | Savings | Goals */}
        <View style={styles.pillsRow}>
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            const bg = isActive
              ? (isDark ? "#34D399" : "#0D2E22")
              : (isDark ? "#121A15" : "#ECEEE9");
            const textColor = isActive
              ? (isDark ? "#070D0A" : "#FFFFFF")
              : colors.textSecondary;

            return (
              <Pressable
                key={t.key}
                onPress={() => setActiveTab(t.key)}
                style={[styles.pillItem, { backgroundColor: bg }]}
              >
                <Text style={[styles.pillText, { color: textColor, fontWeight: isActive ? "700" : "500" }]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Section: Your Spending */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Spending</Text>
          <Pressable style={styles.dropdownBtn}>
            <Text style={[styles.dropdownText, { color: colors.textSecondary }]}>Aug 2026</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Donut Chart with Center Text & 2-Column Legend */}
        <DonutChart totalSpent={totalSpent} />

        {/* Banner Card: You're 12% under budget! */}
        <View style={[styles.bannerCard, { backgroundColor: colors.bannerBg }]}>
          <View style={[styles.leafCircle, { backgroundColor: isDark ? "rgba(52, 211, 153, 0.15)" : "#D1E7D6" }]}>
            <Ionicons name="leaf" size={18} color={isDark ? "#34D399" : "#0D2E22"} />
          </View>
          <View style={styles.bannerInfo}>
            <Text style={[styles.bannerTitle, { color: colors.bannerText }]}>
              You're 12% under budget!
            </Text>
            <Text style={[styles.bannerSubtitle, { color: isDark ? "#88988E" : "#4B5563" }]}>
              Great job managing your spending this month.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.bannerText} />
        </View>

        {/* Section: Spending Trend */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending Trend</Text>
        </View>

        <SpendingTrendChart />
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 14,
  },
  pillItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 13,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: "600",
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 12,
    marginTop: 16,
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
    fontSize: 14,
    fontWeight: "700",
  },
  bannerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
});
