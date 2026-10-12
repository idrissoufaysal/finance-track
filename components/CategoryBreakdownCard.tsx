import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/dateUtils';

export function CategoryBreakdownCard() {
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { categorySummaries, periodSummary } = useFinance();

  if (categorySummaries.length === 0) {
    return null;
  }

  // Show top 4 categories
  const topCategories = categorySummaries.slice(0, 4);

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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Dépenses par catégorie</Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {categorySummaries.length} catégories
        </Text>
      </View>

      <View style={styles.list}>
        {topCategories.map((item) => {
          return (
            <View key={item.category.id} style={styles.row}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: item.category.color + '20' },
                ]}
              >
                <Ionicons
                  name={item.category.icon as any}
                  size={16}
                  color={item.category.color}
                />
              </View>

              <View style={styles.info}>
                <View style={styles.topInfo}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {item.category.name}
                  </Text>
                  <Text
                    style={[
                      styles.amount,
                      { color: colors.text, fontVariant: ['tabular-nums'] },
                    ]}
                  >
                    {formatCurrency(item.totalAmount)}
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={[styles.barBg, { backgroundColor: colors.surfaceSecondary }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.min(100, Math.max(3, item.percentage))}%`,
                        backgroundColor: item.category.color,
                      },
                    ]}
                  />
                </View>

                <View style={styles.bottomInfo}>
                  <Text style={[styles.txCount, { color: colors.textMuted }]}>
                    {item.count} transaction{item.count > 1 ? 's' : ''}
                  </Text>
                  <Text style={[styles.percentage, { color: colors.textSecondary }]}>
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txCount: {
    fontSize: 11,
  },
  percentage: {
    fontSize: 11,
    fontWeight: '600',
  },
});
