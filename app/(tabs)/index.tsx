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
import { Palette } from "@/constants/Colors";
import { PeriodSelector } from "@/components/PeriodSelector";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionItem } from "@/components/TransactionItem";
import { EmptyState } from "@/components/EmptyState";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { filteredTransactions, resetToDemo } = useFinance();

  const recentTransactions = filteredTransactions.slice(0, 10);

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* En-tête : Salutations + Recherche et Thème */}
      <View style={styles.header}>
        <View style={styles.greetingCol}>
          <Text style={[styles.greetingTitle, { color: colors.text }]}>Bonjour</Text>
          <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
            Vos finances en toute simplicité
          </Text>
        </View>

        <View style={styles.headerRightBtns}>
          {/* Recherche */}
          <Pressable
            onPress={() => router.push("/(tabs)/transactions")}
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search-outline" size={18} color={colors.text} />
          </Pressable>

          {/* Bascule de Thème */}
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
        {/* 1. Filtres temporels : Aujourd'hui | Semaine | Mois | Année (AVANT la carte de solde) */}
        <PeriodSelector />

        {/* 2. Carte de Solde avec Cercle SVG Entrées / Sorties */}
        <BalanceCard />

        {/* 3. Bouton d'action rapide principal : Nouvelle transaction */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => router.push("/new-transaction")}
            style={({ pressed }) => [
              styles.addBtn,
              {
                backgroundColor: isDark ? "#34D399" : "#059669",
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons
              name="add-circle"
              size={20}
              color={isDark ? Palette.obsidianBg : "#FFFFFF"}
            />
            <Text
              style={[
                styles.addBtnText,
                { color: isDark ? Palette.obsidianBg : "#FFFFFF" },
              ]}
            >
              Nouvelle opération
            </Text>
          </Pressable>
        </View>

        {/* 4. Liste des Opérations Récentes de la période */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Opérations de la période
            </Text>
            {filteredTransactions.length > 0 && (
              <Pressable
                onPress={() => router.push("/(tabs)/transactions")}
                hitSlop={8}
              >
                <Text style={[styles.seeAllText, { color: colors.textSecondary }]}>
                  Voir tout ({filteredTransactions.length}) →
                </Text>
              </Pressable>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                title="Aucune opération"
                subtitle="Enregistrez une dépense ou un revenu pour cette période."
              />
              <Pressable
                onPress={resetToDemo}
                style={[styles.demoPillBtn, { backgroundColor: colors.tint }]}
              >
                <Ionicons name="sparkles" size={14} color="#fff" />
                <Text style={styles.demoPillText}>Charger des exemples démo</Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={[
                styles.transactionsCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
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
    paddingBottom: 6,
  },
  greetingCol: {
    gap: 3,
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
    paddingBottom: 100,
  },
  actionRow: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  recentSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyWrap: {
    paddingVertical: 16,
    alignItems: "center",
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
    fontWeight: "600",
  },
  transactionsCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
});
