import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { PeriodSelector } from "@/components/PeriodSelector";
import { TransactionItem } from "@/components/TransactionItem";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency } from "@/utils/dateUtils";

export default function TransactionsScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { filteredTransactions } = useFinance();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all");

  const displayedTransactions = useMemo(() => {
    return filteredTransactions.filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchNote = tx.note?.toLowerCase().includes(query);
        if (!matchTitle && !matchNote) return false;
      }
      return true;
    });
  }, [filteredTransactions, typeFilter, search]);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      {/* Barre de recherche et actions supérieures */}
      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Rechercher une opération..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8} accessibilityRole="button" accessibilityLabel="Effacer la recherche">
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel="Changer de thème"
          style={({ pressed }) => [
            styles.squareBtn,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={18} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/new-transaction")}
          accessibilityRole="button"
          accessibilityLabel="Nouvelle transaction"
          style={({ pressed }) => [
            styles.squareBtn,
            { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="add" size={22} color={colors.onTint} />
        </Pressable>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PeriodSelector />

        {/* Filtres de Type : Toutes | Dépenses | Revenus */}
        <View style={styles.filterRow}>
          {(["all", "expense", "income"] as const).map((t) => {
            const isActive = typeFilter === t;
            const label = t === "all" ? "Toutes" : t === "expense" ? "Dépenses" : "Revenus";
            return (
              <Pressable
                key={t}
                onPress={() => setTypeFilter(t)}
                accessibilityRole="button"
                style={[
                  styles.filterPill,
                  { backgroundColor: isActive ? colors.tint : colors.surfaceSecondary },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isActive ? colors.onTint : colors.textSecondary,
                      fontWeight: isActive ? "700" : "500",
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Récapitulatif des résultats */}
        <View style={styles.resultsInfoRow}>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {displayedTransactions.length} opération{displayedTransactions.length > 1 ? "s" : ""}
          </Text>
          <Text style={[styles.resultsTotal, { color: colors.text, fontVariant: ["tabular-nums"] }]}>
            {formatCurrency(
              displayedTransactions.reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0)
            )}
          </Text>
        </View>

        {displayedTransactions.length === 0 ? (
          <EmptyState
            title="Aucun résultat"
            subtitle="Modifiez vos critères ou enregistrez une nouvelle opération."
          />
        ) : (
          <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {displayedTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} showDate={true} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  squareBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 12,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillText: {
    fontSize: 13,
  },
  resultsInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  resultsTotal: {
    fontSize: 14,
    fontWeight: "700",
  },
  listCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
});
