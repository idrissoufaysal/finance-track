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
import { BalanceCard } from "@/components/BalanceCard";
import { QuickActions } from "@/components/QuickActions";
import { TransactionItem } from "@/components/TransactionItem";
import { EmptyState } from "@/components/EmptyState";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { filteredTransactions, resetToDemo } = useFinance();

  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header: Good morning + Search & Notification/Theme buttons */}
      <View style={styles.header}>
        <View style={styles.greetingCol}>
          <Text style={[styles.greetingTitle, { color: colors.text }]}>Good morning</Text>
          <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
            Let's build your brighter future
          </Text>
        </View>

        <View style={styles.headerRightBtns}>
          {/* Search Button */}
          <Pressable
            onPress={() => router.push("/(tabs)/transactions")}
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search-outline" size={18} color={colors.text} />
          </Pressable>

          {/* Theme Toggle Button (Moon/Sun) */}
          <Pressable
            onPress={toggleTheme}
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={18}
              color={colors.text}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pine Green Hero Balance Card */}
        <BalanceCard />

        {/* 4 Quick Actions Row: Add Money, Send, Convert, More */}
        <QuickActions />

        {/* Recent Transactions Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/transactions")}
              hitSlop={8}
            >
              <Text style={[styles.seeAllText, { color: colors.textSecondary }]}>
                See all →
              </Text>
            </Pressable>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                title="No transactions yet"
                subtitle="Tap 'Add Money' above or load sample data to explore your transactions."
              />
              <Pressable
                onPress={resetToDemo}
                style={[styles.demoPillBtn, { backgroundColor: colors.tint }]}
              >
                <Ionicons name="sparkles" size={14} color="#fff" />
                <Text style={styles.demoPillText}>Load Sample Data</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.transactionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {recentTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} showDate={true} />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greetingCol: {
    gap: 4,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  headerRightBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  recentSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  transactionsCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 12,
  },
  demoPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  demoPillText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
