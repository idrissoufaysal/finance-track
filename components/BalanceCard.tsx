import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import { formatCurrency } from '@/utils/dateUtils';

export function BalanceCard() {
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { periodSummary, timeFrame } = useFinance();

  const isPositive = periodSummary.netBalance >= 0;

  const labelPeriod = 
    timeFrame === 'day' ? 'du jour' : timeFrame === 'week' ? 'de la semaine' : 'du mois';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Solde net {labelPeriod}
        </Text>
        {periodSummary.savingsRate > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.incomeLight }]}>
            <Ionicons name="sparkles" size={12} color={colors.income} />
            <Text style={[styles.badgeText, { color: colors.income }]}>
              {Math.round(periodSummary.savingsRate)}% épargné
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.balanceAmount,
          {
            color: isPositive ? colors.text : colors.expense,
            fontVariant: ['tabular-nums'],
          },
        ]}
      >
        {isPositive ? '+' : ''}
        {formatCurrency(periodSummary.netBalance)}
      </Text>

      {/* Row for Incomes & Expenses */}
      <View style={[styles.statsRow, { borderTopColor: colors.borderSubtle }]}>
        {/* Incomes */}
        <View style={styles.statBox}>
          <View style={[styles.iconCircle, { backgroundColor: colors.incomeLight }]}>
            <Ionicons name="arrow-down" size={14} color={colors.income} />
          </View>
          <View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Revenus</Text>
            <Text
              style={[
                styles.statAmount,
                { color: colors.income, fontVariant: ['tabular-nums'] },
              ]}
            >
              +{formatCurrency(periodSummary.totalIncome)}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Expenses */}
        <View style={styles.statBox}>
          <View style={[styles.iconCircle, { backgroundColor: colors.expenseLight }]}>
            <Ionicons name="arrow-up" size={14} color={colors.expense} />
          </View>
          <View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dépenses</Text>
            <Text
              style={[
                styles.statAmount,
                { color: colors.expense, fontVariant: ['tabular-nums'] },
              ]}
            >
              -{formatCurrency(periodSummary.totalExpense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 8,
  },
});
