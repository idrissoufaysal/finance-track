import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/context/ThemeContext';
import { TimeFrame } from '@/types/finance';

export function PeriodSelector() {
  const { colors, isDark } = useTheme();
  const {
    timeFrame,
    setTimeFrame,
    goToPrevious,
    goToNext,
    goToToday,
    periodTitle,
    isCurrent,
  } = useFinance();

  const options: { key: TimeFrame; label: string }[] = [
    { key: 'day', label: "Aujourd'hui" },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'year', label: 'Année' },
  ];

  return (
    <View style={styles.container}>
      {/* 4 Filtres : Aujourd'hui | Semaine | Mois | Année */}
      <View
        style={[
          styles.segmentedWrapper,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        {options.map((opt) => {
          const isActive = timeFrame === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setTimeFrame(opt.key)}
              style={[
                styles.segmentItem,
                isActive && [
                  styles.segmentItemActive,
                  {
                    backgroundColor: isDark ? "#232C27" : "#FFFFFF",
                    borderColor: isDark ? "rgba(52, 211, 153, 0.3)" : colors.border,
                  },
                ],
              ]}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  {
                    color: isActive
                      ? isDark
                        ? "#34D399"
                        : "#059669"
                      : colors.textSecondary,
                    fontWeight: isActive ? "700" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Barre de navigation temporelle (< Libellé >) */}
      <View style={styles.navBar}>
        <Pressable
          onPress={goToPrevious}
          style={({ pressed }) => [
            styles.navArrow,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={16} color={colors.text} />
        </Pressable>

        <Pressable onPress={goToToday} style={styles.titleWrap}>
          <Text style={[styles.periodTitleText, { color: colors.text }]}>
            {periodTitle}
          </Text>
          {!isCurrent && (
            <View style={[styles.todayBadge, { backgroundColor: colors.tint + "20" }]}>
              <Text style={[styles.todayBadgeText, { color: colors.tint }]}>
                Aujourd'hui
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={goToNext}
          style={({ pressed }) => [
            styles.navArrow,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={16} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
    gap: 8,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  segmentItemActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: 12,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodTitleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  todayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
