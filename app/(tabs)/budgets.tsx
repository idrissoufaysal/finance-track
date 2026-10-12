import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import { getCategoryById } from '@/constants/categories';
import { formatCurrency } from '@/utils/dateUtils';

export default function BudgetsScreen() {
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { budgets, transactions, resetToDemo } = useFinance();

  // Calculate monthly spent for each budget in current month
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthYear)
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

  const handleResetDemo = () => {
    Alert.alert(
      'Réinitialiser les données',
      'Voulez-vous recharger les données financières de démonstration ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            await resetToDemo();
            Alert.alert('Succès', 'Données de démonstration rechargées !');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Plafonds de Budget</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Suivi mensuel par catégorie
          </Text>
        </View>

        <Pressable
          onPress={handleResetDemo}
          style={({ pressed }) => [
            styles.resetBtn,
            { backgroundColor: colors.surfaceSecondary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="refresh" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Global monthly budget card */}
        <View
          style={[
            styles.globalCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.globalTop}>
            <Text style={[styles.globalTitle, { color: colors.textSecondary }]}>
              Budget global du mois
            </Text>
            <View
              style={[
                styles.globalBadge,
                {
                  backgroundColor:
                    globalPercentage > 100
                      ? colors.expenseLight
                      : globalPercentage > 75
                      ? Palette.amber500 + '20'
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
                        : globalPercentage > 75
                        ? Palette.amber500
                        : colors.income,
                  },
                ]}
              >
                {Math.round(globalPercentage)}% consommé
              </Text>
            </View>
          </View>

          <View style={styles.amountsRow}>
            <Text style={[styles.spentAmount, { color: colors.text, fontVariant: ['tabular-nums'] }]}>
              {formatCurrency(totalSpent)}
            </Text>
            <Text style={[styles.limitAmount, { color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>
              / {formatCurrency(totalBudget)}
            </Text>
          </View>

          <View style={[styles.globalBarBg, { backgroundColor: colors.surfaceSecondary }]}>
            <View
              style={[
                styles.globalBarFill,
                {
                  width: `${Math.min(100, globalPercentage)}%`,
                  backgroundColor:
                    globalPercentage > 100
                      ? colors.expense
                      : globalPercentage > 75
                      ? Palette.amber500
                      : colors.tint,
                },
              ]}
            />
          </View>

          <Text style={[styles.remainingText, { color: colors.textSecondary }]}>
            {totalBudget >= totalSpent
              ? `Il vous reste ${formatCurrency(totalBudget - totalSpent)} à dépenser ce mois-ci.`
              : `Dépassement de budget de ${formatCurrency(totalSpent - totalBudget)} !`}
          </Text>
        </View>

        {/* Categories budget cards */}
        <View style={styles.categoriesList}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Détail par catégorie
          </Text>

          {budgetItems.map((item) => {
            const barColor = item.isOver
              ? colors.expense
              : item.percentage > 75
              ? Palette.amber500
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
                        { backgroundColor: item.category.color + '20' },
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
                        Plafond : {formatCurrency(item.budget.monthlyLimit)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.itemAmountCol}>
                    <Text
                      style={[
                        styles.itemSpent,
                        {
                          color: item.isOver ? colors.expense : colors.text,
                          fontVariant: ['tabular-nums'],
                        },
                      ]}
                    >
                      {formatCurrency(item.spent)}
                    </Text>
                    <Text
                      style={[
                        styles.itemPercent,
                        { color: barColor, fontVariant: ['tabular-nums'] },
                      ]}
                    >
                      {item.percentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={[styles.itemBarTrack, { backgroundColor: colors.surfaceSecondary }]}>
                  <View
                    style={[
                      styles.itemBarThumb,
                      {
                        width: `${Math.min(100, item.percentage)}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>

                <View style={styles.itemFooter}>
                  <Text style={[styles.footerStatus, { color: colors.textMuted }]}>
                    {item.isOver
                      ? `Dépassé de ${formatCurrency(item.spent - item.budget.monthlyLimit)}`
                      : `Reste ${formatCurrency(item.remaining)}`}
                  </Text>
                </View>
              </View>
            );
          })}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  globalCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  globalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  globalTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  globalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  globalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  amountsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 12,
  },
  spentAmount: {
    fontSize: 28,
    fontWeight: '800',
  },
  limitAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  globalBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  globalBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  remainingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoriesList: {
    marginTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemCatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: 14,
    fontWeight: '600',
  },
  catLimit: {
    fontSize: 11,
    marginTop: 1,
  },
  itemAmountCol: {
    alignItems: 'flex-end',
  },
  itemSpent: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemPercent: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  itemBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  itemBarThumb: {
    height: '100%',
    borderRadius: 3,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
});
