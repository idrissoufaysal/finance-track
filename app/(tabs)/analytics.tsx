import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import { PeriodSelector } from '@/components/PeriodSelector';
import { formatCurrency } from '@/utils/dateUtils';

export default function AnalyticsScreen() {
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { periodSummary, categorySummaries, filteredTransactions, timeFrame } = useFinance();

  const totalExpense = periodSummary.totalExpense;
  const totalIncome = periodSummary.totalIncome;

  // Key metrics
  const avgExpense = filteredTransactions.length > 0 
    ? totalExpense / (timeFrame === 'day' ? 1 : timeFrame === 'week' ? 7 : 30)
    : 0;

  const maxTxExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((max, t) => Math.max(max, t.amount), 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Analyses financières</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Rapports détaillés & Répartition
        </Text>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PeriodSelector />

        {/* 3 Metric Summary Cards */}
        <View style={styles.metricsGrid}>
          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.metricIconWrap, { backgroundColor: colors.incomeLight }]}>
              <Ionicons name="sparkles" size={16} color={colors.income} />
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Taux d\'épargne
            </Text>
            <Text
              style={[
                styles.metricValue,
                { color: colors.income, fontVariant: ['tabular-nums'] },
              ]}
            >
              {Math.round(periodSummary.savingsRate)}%
            </Text>
          </View>

          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.metricIconWrap, { backgroundColor: colors.expenseLight }]}>
              <Ionicons name="trending-down" size={16} color={colors.expense} />
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Moy. / {timeFrame === 'day' ? 'opér.' : 'jour'}
            </Text>
            <Text
              style={[
                styles.metricValue,
                { color: colors.text, fontVariant: ['tabular-nums'] },
              ]}
            >
              {formatCurrency(avgExpense)}
            </Text>
          </View>

          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.metricIconWrap, { backgroundColor: Palette.amber500 + '20' }]}>
              <Ionicons name="alert-circle" size={16} color={Palette.amber500} />
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Max dépense
            </Text>
            <Text
              style={[
                styles.metricValue,
                { color: colors.text, fontVariant: ['tabular-nums'] },
              ]}
            >
              {formatCurrency(maxTxExpense)}
            </Text>
          </View>
        </View>

        {/* Flow Balance Compare Card */}
        <View
          style={[
            styles.compareCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Flux de trésorerie</Text>

          <View style={styles.flowRow}>
            <View style={styles.flowCol}>
              <Text style={[styles.flowLabel, { color: colors.textSecondary }]}>Entrées</Text>
              <Text style={[styles.flowAmount, { color: colors.income, fontVariant: ['tabular-nums'] }]}>
                +{formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.flowCol}>
              <Text style={[styles.flowLabel, { color: colors.textSecondary }]}>Sorties</Text>
              <Text style={[styles.flowAmount, { color: colors.expense, fontVariant: ['tabular-nums'] }]}>
                -{formatCurrency(totalExpense)}
              </Text>
            </View>
          </View>

          {/* Ratio bar */}
          <View style={[styles.ratioBarBg, { backgroundColor: colors.expenseLight }]}>
            <View
              style={[
                styles.ratioBarFill,
                {
                  width: `${
                    totalIncome + totalExpense > 0
                      ? (totalIncome / (totalIncome + totalExpense)) * 100
                      : 50
                  }%`,
                  backgroundColor: colors.income,
                },
              ]}
            />
          </View>
          <View style={styles.ratioLabels}>
            <Text style={[styles.ratioText, { color: colors.income }]}>
              {totalIncome + totalExpense > 0
                ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100)
                : 0}
              % Revenus
            </Text>
            <Text style={[styles.ratioText, { color: colors.expense }]}>
              {totalIncome + totalExpense > 0
                ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100)
                : 0}
              % Dépenses
            </Text>
          </View>
        </View>

        {/* Full Category Ranking */}
        <View
          style={[
            styles.categorySection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 16 }]}>
            Classement complet des catégories
          </Text>

          {categorySummaries.length === 0 ? (
            <Text style={[styles.emptyNotice, { color: colors.textSecondary }]}>
              Aucune dépense enregistrée pour cette période.
            </Text>
          ) : (
            <View style={{ gap: 14 }}>
              {categorySummaries.map((cat, idx) => (
                <View key={cat.category.id} style={styles.catRankRow}>
                  <Text style={[styles.rankNumber, { color: colors.textMuted }]}>
                    #{idx + 1}
                  </Text>
                  <View
                    style={[
                      styles.rankIconWrap,
                      { backgroundColor: cat.category.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={cat.category.icon as any}
                      size={16}
                      color={cat.category.color}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.rankTopInfo}>
                      <Text style={[styles.rankName, { color: colors.text }]}>
                        {cat.category.name}
                      </Text>
                      <Text
                        style={[
                          styles.rankAmount,
                          { color: colors.text, fontVariant: ['tabular-nums'] },
                        ]}
                      >
                        {formatCurrency(cat.totalAmount)}
                      </Text>
                    </View>

                    <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSecondary }]}>
                      <View
                        style={[
                          styles.progressThumb,
                          {
                            width: `${Math.min(100, Math.max(3, cat.percentage))}%`,
                            backgroundColor: cat.category.color,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.rankBottomInfo}>
                      <Text style={[styles.rankCount, { color: colors.textMuted }]}>
                        {cat.count} opération{cat.count > 1 ? 's' : ''}
                      </Text>
                      <Text style={[styles.rankPercent, { color: colors.textSecondary }]}>
                        {cat.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  metricIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  compareCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 10,
  },
  flowCol: {},
  flowLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  flowAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  ratioBarBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 6,
  },
  ratioBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  ratioLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratioText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categorySection: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptyNotice: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
  },
  catRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '700',
    width: 20,
  },
  rankIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rankName: {
    fontSize: 13,
    fontWeight: '600',
  },
  rankAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressThumb: {
    height: '100%',
    borderRadius: 3,
  },
  rankBottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankCount: {
    fontSize: 11,
  },
  rankPercent: {
    fontSize: 11,
    fontWeight: '600',
  },
});
