import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/context/ThemeContext';
import { formatCurrency, formatCompact } from '@/utils/dateUtils';

export function FinanceChart() {
  const { colors } = useTheme();
  const { chartPoints, timeFrame, setSelectedDate } = useFinance();

  const maxExpense = Math.max(10, ...chartPoints.map((p) => p.expense));

  const title =
    timeFrame === 'day'
      ? 'Activité de la semaine'
      : timeFrame === 'week'
      ? 'Dépenses journalières (Lun - Dim)'
      : timeFrame === 'month'
      ? 'Évolution hebdomadaire du mois'
      : 'Évolution mensuelle de l’année';

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Max : {formatCurrency(maxExpense)}
        </Text>
      </View>

      <View style={styles.chartArea}>
        {chartPoints.map((point, index) => {
          const ratio = Math.min(1, point.expense / maxExpense);
          const barHeight = Math.max(8, ratio * 100);
          const empty = point.expense <= 0;

          return (
            <Pressable
              key={`${point.dateString}_${index}`}
              style={styles.barCol}
              accessibilityRole="button"
              onPress={() => {
                const parts = point.dateString.split('-');
                if (parts.length === 3) {
                  setSelectedDate(
                    new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                  );
                }
              }}
            >
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: point.isSelected
                        ? colors.tint
                        : empty
                        ? colors.track
                        : colors.tintSoft,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: point.isSelected ? colors.tint : colors.textSecondary,
                    fontWeight: point.isSelected ? '700' : '500',
                  },
                ]}
              >
                {point.dayLabel}
              </Text>

              <Text
                style={[styles.amountLabel, { color: colors.textMuted, fontVariant: ['tabular-nums'] }]}
                numberOfLines={1}
              >
                {point.expense > 0 ? formatCompact(point.expense) : '-'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
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
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    paddingTop: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    justifyContent: 'flex-end',
    width: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  barFill: {
    width: 14,
    borderRadius: 7,
  },
  dayLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  amountLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
});
