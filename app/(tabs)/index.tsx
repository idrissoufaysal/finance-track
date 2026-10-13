import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
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
import { PeriodSelector } from "@/components/PeriodSelector";
import { BalanceCard } from "@/components/BalanceCard";
import { FinanceChart } from "@/components/FinanceChart";
import { CategoryBreakdownCard } from "@/components/CategoryBreakdownCard";
import { TransactionItem } from "@/components/TransactionItem";
import { EmptyState } from "@/components/EmptyState";

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, colors, isDark, toggleTheme } = useTheme();
  const { filteredTransactions, timeFrame } = useFinance();

  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoIcon, { backgroundColor: colors.tint }]}>
            <Ionicons name="trending-up" size={18} color="#fff" />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>Finance Track</Text>
            <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
              {isDark ? "Forest Obsidian" : "Forest Wealth"}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* Quick Theme Switcher Button */}
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel="Changer de thème"
            style={({ pressed }) => [
              styles.themeToggleBtn,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={18}
              color={isDark ? "#f59e0b" : colors.text}
            />
          </Pressable>

          {/* Add Transaction Button */}
          <Pressable
            onPress={() => router.push("/new-transaction")}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector (Day / Week / Month) */}
        <PeriodSelector />

        {/* Hero Balance Card */}
        <BalanceCard />

        {/* Dynamic Chart (Day / Week / Month) */}
        <FinanceChart />

        {/* Category Breakdown */}
        <CategoryBreakdownCard />

        {/* Recent Transactions in Selected Period */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Opérations de la période
            </Text>
            {filteredTransactions.length > 5 && (
              <Pressable onPress={() => router.push("/(tabs)/transactions")}>
                <Text style={[styles.seeAllText, { color: colors.tint }]}>
                  Voir tout ({filteredTransactions.length})
                </Text>
              </Pressable>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              title="Aucune opération trouvée"
              subtitle={`Aucune dépense ou revenu pour cette période (${
                timeFrame === "day" ? "journée" : timeFrame === "week" ? "semaine" : "mois"
              }).`}
            />
          ) : (
            <View
              style={[
                styles.txCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {recentTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} showDate={timeFrame !== "day"} />
              ))}
            </View>
          )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  recentSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  txCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
});
