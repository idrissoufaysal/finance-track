import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFinance } from "@/context/FinanceContext";
import { useTheme, ThemeMode } from "@/context/ThemeContext";
import { getCategoryById } from "@/constants/categories";
import { formatCurrency } from "@/utils/dateUtils";

export default function BudgetsScreen() {
  const { theme, colors, isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { budgets, transactions, clearAllData, resetToDemo } = useFinance();

  // Calculate monthly spent for each budget in current month
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date.startsWith(currentMonthYear)
  );

  let totalBudget = 0;
  let totalSpent = 0;

  const budgetItems = budgets.map((b) => {
    const spent = currentMonthExpenses
      .filter((t) => t.categoryId === b.categoryId)
      .reduce((acc, t) => acc + t.amount, 0);

    totalBudget += b.monthlyLimit;
    totalSpent += spent;

    const percentage = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
    const category = getCategoryById(b.categoryId);

    return {
      budget: b,
      spent,
      category,
      percentage,
      remaining: Math.max(0, b.monthlyLimit - spent),
      isOver: spent > b.monthlyLimit,
    };
  });

  const globalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleClearAll = () => {
    Alert.alert(
      "Remettre à zéro",
      "Voulez-vous supprimer toutes les transactions et repartir d'une base vierge (0 opération, 0 FCFA) ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            Alert.alert("Succès", "L'application est maintenant à zéro.");
          },
        },
      ]
    );
  };

  const handleResetDemo = () => {
    Alert.alert(
      "Charger données démo",
      "Voulez-vous charger un jeu de 8 transactions représentatives pour tester l'application ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Charger démo",
          onPress: async () => {
            await resetToDemo();
            Alert.alert("Succès", "Données de démonstration chargées.");
          },
        },
      ]
    );
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: "light", label: "Clair", icon: "sunny-outline" },
    { mode: "dark", label: "Sombre", icon: "moon-outline" },
    { mode: "system", label: "Système", icon: "phone-portrait-outline" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Plafonds de Budget</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Gestion mensuelle & Thème
          </Text>
        </View>

        {/* Quick Theme Switcher */}
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
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Preference Card */}
        <View
          style={[
            styles.themeCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.themeHeaderRow}>
            <View style={[styles.themeIconCircle, { backgroundColor: colors.tint + "20" }]}>
              <Ionicons name="color-palette-outline" size={18} color={colors.tint} />
            </View>
            <View>
              <Text style={[styles.themeCardTitle, { color: colors.text }]}>
                Thème d'affichage
              </Text>
              <Text style={[styles.themeCardSubtitle, { color: colors.textSecondary }]}>
                Actif : {theme === "dark" ? "Forest Obsidian (Sombre)" : "Forest Wealth (Clair)"}
              </Text>
            </View>
          </View>

          <View style={[styles.themePillsRow, { backgroundColor: colors.surfaceSecondary }]}>
            {themeOptions.map((opt) => {
              const isSelected = themeMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => setThemeMode(opt.mode)}
                  style={[
                    styles.themePillItem,
                    isSelected && [
                      styles.themePillActive,
                      { backgroundColor: colors.surface, shadowColor: "#000" },
                    ],
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={16}
                    color={isSelected ? colors.tint : colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.themePillText,
                      {
                        color: isSelected ? colors.text : colors.textSecondary,
                        fontWeight: isSelected ? "700" : "500",
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Global Budget Card */}
        <View
          style={[
            styles.globalCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.globalTop}>
            <View>
              <Text style={[styles.globalTitle, { color: colors.textSecondary }]}>
                Dépenses mensuelles globales
              </Text>
              <Text style={[styles.monthLabel, { color: colors.tint }]}>
                Ce mois-ci
              </Text>
            </View>
            <View
              style={[
                styles.globalBadge,
                {
                  backgroundColor:
                    globalPercentage > 100
                      ? colors.expenseLight
                      : globalPercentage > 85
                      ? "#fef3c7"
                      : colors.incomeLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.globalBadgeText,
                  {
                    color:
                      globalPercentage > 100
                        ? colors.expense
                        : globalPercentage > 85
                        ? "#d97706"
                        : colors.income,
                  },
                ]}
              >
                {Math.round(globalPercentage)}% utilisé
              </Text>
            </View>
          </View>

          <View style={styles.amountLine}>
            <Text style={[styles.spentAmount, { color: colors.text, fontVariant: ["tabular-nums"] }]}>
              {formatCurrency(totalSpent)}
            </Text>
            <Text style={[styles.limitAmount, { color: colors.textMuted, fontVariant: ["tabular-nums"] }]}>
              / {formatCurrency(totalBudget)}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={[styles.globalBarTrack, { backgroundColor: colors.surfaceSecondary }]}>
            <View
              style={[
                styles.globalBarFill,
                {
                  width: `${Math.min(100, Math.max(2, globalPercentage))}%`,
                  backgroundColor:
                    globalPercentage > 100
                      ? colors.expense
                      : globalPercentage > 85
                      ? "#f59e0b"
                      : colors.tint,
                },
              ]}
            />
          </View>

          <Text style={[styles.remainingText, { color: colors.textSecondary }]}>
            {totalBudget >= totalSpent
              ? `Il vous reste ${formatCurrency(totalBudget - totalSpent)} à dépenser ce mois.`
              : `Budget dépassé de ${formatCurrency(totalSpent - totalBudget)} !`}
          </Text>
        </View>

        {/* Category Budget Cards */}
        <View style={styles.categoriesList}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Plafonds par catégorie
          </Text>

          {budgetItems.map((item) => {
            const barColor = item.isOver
              ? colors.expense
              : item.percentage > 85
              ? "#f59e0b"
              : item.category.color;

            return (
              <View
                key={item.budget.categoryId}
                style={[
                  styles.itemCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemCatInfo}>
                    <View
                      style={[
                        styles.catIconWrap,
                        { backgroundColor: item.category.color + "20" },
                      ]}
                    >
                      <Ionicons
                        name={item.category.icon as any}
                        size={18}
                        color={item.category.color}
                      />
                    </View>
                    <View>
                      <Text style={[styles.catName, { color: colors.text }]}>
                        {item.category.name}
                      </Text>
                      <Text style={[styles.catLimit, { color: colors.textSecondary }]}>
                        Plafond : {formatCurrency(item.budget.monthlyLimit)} / mois
                      </Text>
                    </View>
                  </View>

                  <View style={styles.itemAmountCol}>
                    <Text
                      style={[
                        styles.itemSpent,
                        {
                          color: item.isOver ? colors.expense : colors.text,
                          fontVariant: ["tabular-nums"],
                        },
                      ]}
                    >
                      {formatCurrency(item.spent)}
                    </Text>
                    <Text
                      style={[
                        styles.itemPercent,
                        { color: barColor, fontVariant: ["tabular-nums"] },
                      ]}
                    >
                      {item.percentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>

                {/* Bar */}
                <View style={[styles.itemBarTrack, { backgroundColor: colors.surfaceSecondary }]}>
                  <View
                    style={[
                      styles.itemBarThumb,
                      {
                        width: `${Math.min(100, Math.max(2, item.percentage))}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>

                <View style={styles.itemFooter}>
                  <Text style={[styles.footerStatus, { color: colors.textMuted }]}>
                    {item.isOver
                      ? `Dépassement de ${formatCurrency(item.spent - item.budget.monthlyLimit)}`
                      : `Reste : ${formatCurrency(item.remaining)}`}
                  </Text>
                  <Text style={[styles.footerStatus, { color: colors.textSecondary }]}>
                    {item.isOver ? "Alerte plafond" : "Dans la limite"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Database & Reset Actions */}
        <View style={styles.dangerZone}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Gestion des données
          </Text>

          <Pressable
            onPress={handleClearAll}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.expenseLight, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.expense} />
            <Text style={[styles.actionButtonText, { color: colors.expense }]}>
              Remettre la base à zéro (0 transaction)
            </Text>
          </Pressable>

          <Pressable
            onPress={handleResetDemo}
            style={({ pressed }) => [
              styles.actionButtonSecondary,
              { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Ionicons name="sparkles-outline" size={18} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Charger un exemple de transactions démo
            </Text>
          </Pressable>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  themeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  themeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  themeCardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  themeCardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  themePillsRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  themePillItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  themePillActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themePillText: {
    fontSize: 13,
  },
  globalCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  globalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  globalTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  globalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  globalBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  amountLine: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 14,
  },
  spentAmount: {
    fontSize: 26,
    fontWeight: "800",
  },
  limitAmount: {
    fontSize: 15,
    fontWeight: "600",
  },
  globalBarTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  globalBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  remainingText: {
    fontSize: 13,
    fontWeight: "500",
  },
  categoriesList: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  itemCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemCatInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  catName: {
    fontSize: 14,
    fontWeight: "600",
  },
  catLimit: {
    fontSize: 11,
    marginTop: 1,
  },
  itemAmountCol: {
    alignItems: "flex-end",
  },
  itemSpent: {
    fontSize: 15,
    fontWeight: "700",
  },
  itemPercent: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  itemBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  itemBarThumb: {
    height: "100%",
    borderRadius: 3,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerStatus: {
    fontSize: 11,
    fontWeight: "500",
  },
  dangerZone: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
